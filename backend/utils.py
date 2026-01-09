# utils.py

from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from math import radians, cos, sin, sqrt, atan2
import models
from database import DATABASE_URL, Base, engine, SessionLocal

# -------------------------------
# Pydantic Schemas
# -------------------------------
class SenderCreate(BaseModel):
    name: str
    email: str = None
    phone: str = None

class TravellerCreate(BaseModel):
    name: str
    email: str = None
    phone: str = None
    source_city: str
    dest_city: str

class OrderCreate(BaseModel):
    # sender_id is removed from here because we infer it from auth
    source_city: str
    dest_city: str
    weight_kg: float
    item_type: str
    source_lat: float
    source_lon: float
    dest_lat: float
    dest_lon: float

class ComplaintCreate(BaseModel):
    order_id: int
    issue: str

# Create tables (ensures they exist)
Base.metadata.create_all(bind=engine)

# -------------------------------
# Utilities
# -------------------------------
CITY_DATA = {
    "Mumbai": {"lat": 19.0760, "lon": 72.8777},
    "Delhi": {"lat": 28.7041, "lon": 77.1025},
    "Bangalore": {"lat": 12.9716, "lon": 77.5946},
    "Hyderabad": {"lat": 17.3850, "lon": 78.4867},
    "Ahmedabad": {"lat": 23.0225, "lon": 72.5714},
    "Chennai": {"lat": 13.0827, "lon": 80.2707},
    "Kolkata": {"lat": 22.5726, "lon": 88.3639},
    "Surat": {"lat": 21.1702, "lon": 72.8311},
    "Pune": {"lat": 18.5204, "lon": 73.8567},
    "Jaipur": {"lat": 26.9124, "lon": 75.7873},
    "New York": {"lat": 40.7128, "lon": -74.0060},
    "London": {"lat": 51.5074, "lon": -0.1278},
}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two coordinates in km"""
    R = 6371  # Earth's radius in km
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2*atan2(sqrt(a), sqrt(1-a))
    return round(R * c, 2)

from courier_pricing import price_calculator

# -------------------------------
# Sender Logic
# -------------------------------
def create_sender(db: Session, sender: SenderCreate, user):
    # Check if sender profile already exists for this Supabase user
    existing_sender = db.query(models.Sender).filter(models.Sender.supabase_id == user.id).first()
    if existing_sender:
        raise HTTPException(status_code=400, detail="Sender profile already exists for this user")

    db_sender = models.Sender(
        supabase_id=user.id,
        name=sender.name,
        email=sender.email if sender.email else user.email, # fallback to auth email
        phone=sender.phone
    )
    db.add(db_sender)
    db.commit()
    db.refresh(db_sender)
    return db_sender

def list_senders(db: Session, user):
    # Only return the current user's sender profile
    return db.query(models.Sender).filter(models.Sender.supabase_id == user.id).all()

def get_current_sender(db: Session, user):
    return db.query(models.Sender).filter(models.Sender.supabase_id == user.id).first()

# -------------------------------
# Traveller Logic
# -------------------------------
def create_traveller(db: Session, traveller: TravellerCreate, user):
    existing_traveller = db.query(models.Traveller).filter(models.Traveller.supabase_id == user.id).first()
    if existing_traveller:
        raise HTTPException(status_code=400, detail="Traveller profile already exists for this user")

    db_traveller = models.Traveller(
        supabase_id=user.id,
        name=traveller.name,
        email=traveller.email if traveller.email else user.email,
        phone=traveller.phone,
        source_city=traveller.source_city,
        dest_city=traveller.dest_city
    )
    db.add(db_traveller)
    db.commit()
    db.refresh(db_traveller)
    return db_traveller

def list_travellers(db: Session, user):
    # Only return the current user's traveller profile
    return db.query(models.Traveller).filter(models.Traveller.supabase_id == user.id).all()

def get_current_traveller(db: Session, user):
    return db.query(models.Traveller).filter(models.Traveller.supabase_id == user.id).first()

# -------------------------------
# Order Logic
# -------------------------------
def create_order(db: Session, order: OrderCreate, user):
    # Validate that current user has a Sender profile
    sender_profile = get_current_sender(db, user)
    if not sender_profile:
        raise HTTPException(status_code=400, detail="You must create a Sender profile first")

    # SECURITY FIX: Protect against coordinate manipulation (IDOR in Price)
    # Use server-side city coordinates if available, otherwise fallback to user input
    source_lat, source_lon = order.source_lat, order.source_lon
    dest_lat, dest_lon = order.dest_lat, order.dest_lon

    if order.source_city in CITY_DATA:
        source_lat = CITY_DATA[order.source_city]["lat"]
        source_lon = CITY_DATA[order.source_city]["lon"]
    
    if order.dest_city in CITY_DATA:
        dest_lat = CITY_DATA[order.dest_city]["lat"]
        dest_lon = CITY_DATA[order.dest_city]["lon"]

    distance_km = haversine_distance(source_lat, source_lon, dest_lat, dest_lon)
    price_response = price_calculator(source_lat, source_lon,
                                      dest_lat, dest_lon,
                                      order.weight_kg, order.item_type)
    price = price_response.price

    db_order = models.Order(
        sender_id=sender_profile.id, # Securely linked to auth user
        source_city=order.source_city,
        dest_city=order.dest_city,
        distance_km=distance_km,
        weight_kg=order.weight_kg,
        item_type=order.item_type,
        price=price,
        status="pending"
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def list_orders(db: Session, user):
    # Return orders where user is Sender OR user is Traveller
    sender_profile = get_current_sender(db, user)
    traveller_profile = get_current_traveller(db, user)

    sender_id = sender_profile.id if sender_profile else -1
    traveller_id = traveller_profile.id if traveller_profile else -1

    return db.query(models.Order).filter(
        (models.Order.sender_id == sender_id) | 
        (models.Order.traveller_id == traveller_id)
    ).all()

def list_available_orders(db: Session, source_city: str = None, dest_city: str = None):
    query = db.query(models.Order).filter(models.Order.status == "pending")
    if source_city:
        query = query.filter(models.Order.source_city == source_city)
    if dest_city:
        query = query.filter(models.Order.dest_city == dest_city)
    return query.all()

# -------------------------------
# Complaint Logic
# -------------------------------
def create_complaint(db: Session, complaint: ComplaintCreate, user):
    # Check if order exists and belongs to user
    order = db.query(models.Order).filter(models.Order.id == complaint.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    sender_profile = get_current_sender(db, user)
    traveller_profile = get_current_traveller(db, user)

    is_sender = sender_profile and order.sender_id == sender_profile.id
    is_traveller = traveller_profile and order.traveller_id == traveller_profile.id

    if not (is_sender or is_traveller):
        raise HTTPException(status_code=403, detail="Not authorized to complain about this order")

    db_complaint = models.Complaint(
        order_id=complaint.order_id,
        issue=complaint.issue
    )
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

def list_complaints(db: Session, user):
    # List complaints for orders involved with this user
    sender_profile = get_current_sender(db, user)
    traveller_profile = get_current_traveller(db, user)

    sender_id = sender_profile.id if sender_profile else -1
    traveller_id = traveller_profile.id if traveller_profile else -1

    return db.query(models.Complaint).join(models.Order).filter(
        (models.Order.sender_id == sender_id) | 
        (models.Order.traveller_id == traveller_id)
    ).all()

# -------------------------------
# Interaction Logic
# -------------------------------
def accept_order(db: Session, user, order_id: int):
    """
    Traveller accepts an order.
    """
    # 1. Validate User is a Traveller
    traveller_profile = get_current_traveller(db, user)
    if not traveller_profile:
        raise HTTPException(status_code=400, detail="You must create a Traveller profile first")

    # 2. Get Order
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # 3. Check if already accepted
    if order.traveller_id:
        raise HTTPException(status_code=400, detail="Order already accepted by another traveller")
    
    # 4. Check if traveller is trying to accept their own order (optional but good)
    sender_profile = get_current_sender(db, user)
    if sender_profile and order.sender_id == sender_profile.id:
         raise HTTPException(status_code=400, detail="You cannot accept your own order")

    # 5. Assign
    order.traveller_id = traveller_profile.id
    order.status = "accepted"
    db.commit()
    db.refresh(order)
    return order