# utils.py

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, Session
from pydantic import BaseModel
from math import radians, cos, sin, sqrt, atan2
from datetime import datetime
from courier_pricing import price_calculator

# -------------------------------
# Database setup
# -------------------------------
DATABASE_URL = "sqlite:///./courier.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# -------------------------------
# Models
# -------------------------------
class Sender(Base):
    __tablename__ = "senders"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String)
    phone = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    orders = relationship("Order", back_populates="sender")

class Traveller(Base):
    __tablename__ = "travellers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String)
    phone = Column(String)
    source_city = Column(String, nullable=False)
    dest_city = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    orders = relationship("Order", back_populates="traveller")

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("senders.id"), nullable=False)
    traveller_id = Column(Integer, ForeignKey("travellers.id"), nullable=True)
    source_city = Column(String, nullable=False)
    dest_city = Column(String, nullable=False)
    distance_km = Column(Float, nullable=False)
    weight_kg = Column(Float, nullable=False)
    item_type = Column(String, nullable=False)
    status = Column(String, default="pending")
    price = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    sender = relationship("Sender", back_populates="orders")
    traveller = relationship("Traveller", back_populates="orders")

class Complaint(Base):
    __tablename__ = "complaints"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    issue = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    order = relationship("Order", backref="complaints")

# Create tables
Base.metadata.create_all(bind=engine)

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
    sender_id: int
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

# Create tables
Base.metadata.create_all(bind=engine)

# -------------------------------
# Utilities
# -------------------------------
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
def create_sender(db: Session, sender: SenderCreate):
    db_sender = Sender(**sender.dict())
    db.add(db_sender)
    db.commit()
    db.refresh(db_sender)
    return db_sender

def list_senders(db: Session):
    return db.query(Sender).all()

def create_traveller(db: Session, traveller: TravellerCreate):
    db_traveller = Traveller(**traveller.dict())
    db.add(db_traveller)
    db.commit()
    db.refresh(db_traveller)
    return db_traveller

def list_travellers(db: Session):
    return db.query(Traveller).all()

def create_order(db: Session, order: OrderCreate):
    # Check sender exists
    sender = db.query(Sender).filter(Sender.id == order.sender_id).first()
    if not sender:
        raise HTTPException(status_code=404, detail="Sender not found")

    distance_km = haversine_distance(order.source_lat, order.source_lon,
                                     order.dest_lat, order.dest_lon)
    price_response = price_calculator(order.source_lat, order.source_lon,
                                      order.dest_lat, order.dest_lon,
                                      order.weight_kg, order.item_type)
    price = price_response.price

    db_order = Order(
        sender_id=order.sender_id,
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

def list_orders(db: Session):
    return db.query(Order).all()

# Complaint CRUD

def create_complaint(db: Session, complaint: ComplaintCreate):
    # Check if order exists
    order = db.query(Order).filter(Order.id == complaint.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    db_complaint = Complaint(
        order_id=complaint.order_id,
        issue=complaint.issue
    )
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

def list_complaints(db: Session):
    return db.query(Complaint).all()

# Traveller accepts order
def accept_order(db: Session, traveller_id: int, order_id: int):
    """
    Traveller selects an order. Updates order with traveller_id and status.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.traveller_id:
        raise HTTPException(status_code=400, detail="Order already accepted by another traveller")
    
    traveller = db.query(Traveller).filter(Traveller.id == traveller_id).first()
    if not traveller:
        raise HTTPException(status_code=404, detail="Traveller not found")
    
    # Assign traveller and update status
    order.traveller_id = traveller_id
    order.status = "accepted"
    db.commit()
    db.refresh(order)
    return order
