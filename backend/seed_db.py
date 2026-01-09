"""
Seed database with demo data
"""
from models import Sender, Traveller, Order
from database import SessionLocal, engine, Base
from datetime import datetime
import random

def seed_database():
    """Create demo data in the database"""
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if data already exists
    existing_senders = db.query(Sender).count()
    if existing_senders > 0:
        print("Database already seeded, skipping...")
        db.close()
        return
    
    # Demo senders
    senders_data = [
        {"name": "Rajesh Kumar", "email": "rajesh@example.com", "phone": "+91-9876543210"},
        {"name": "Priya Sharma", "email": "priya@example.com", "phone": "+91-9876543211"},
        {"name": "Amit Patel", "email": "amit@example.com", "phone": "+91-9876543212"},
        {"name": "Neha Gupta", "email": "neha@example.com", "phone": "+91-9876543213"},
        {"name": "Vikram Singh", "email": "vikram@example.com", "phone": "+91-9876543214"},
    ]
    
    senders = []
    for sender_data in senders_data:
        sender = Sender(**sender_data)
        db.add(sender)
        senders.append(sender)
    
    db.commit()
    for sender in senders:
        db.refresh(sender)
    
    # Demo travellers (people transporting goods)
    travellers_data = [
        {"name": "Vikram Desai", "email": "vikram.d@example.com", "phone": "+91-9876543215", "source_city": "Mumbai", "dest_city": "Delhi"},
        {"name": "Ananya Verma", "email": "ananya@example.com", "phone": "+91-9876543216", "source_city": "Bangalore", "dest_city": "Hyderabad"},
        {"name": "Deepak Nair", "email": "deepak@example.com", "phone": "+91-9876543217", "source_city": "Chennai", "dest_city": "Kolkata"},
        {"name": "Sneha Reddy", "email": "sneha@example.com", "phone": "+91-9876543218", "source_city": "Pune", "dest_city": "Mumbai"},
        {"name": "Rohit Kumar", "email": "rohit@example.com", "phone": "+91-9876543219", "source_city": "Delhi", "dest_city": "Jaipur"},
    ]
    
    travellers = []
    for traveller_data in travellers_data:
        traveller = Traveller(**traveller_data)
        db.add(traveller)
        travellers.append(traveller)
    
    db.commit()
    for traveller in travellers:
        db.refresh(traveller)
    
    # Demo orders
    orders_data = [
        {
            "sender_id": senders[0].id,
            "traveller_id": travellers[0].id,
            "source_city": "Mumbai",
            "dest_city": "Delhi",
            "distance_km": 1400.0,
            "weight_kg": 5.0,
            "item_type": "documents",
            "status": "accepted",
            "price": 500.0,
        },
        {
            "sender_id": senders[1].id,
            "traveller_id": travellers[1].id,
            "source_city": "Bangalore",
            "dest_city": "Hyderabad",
            "distance_km": 580.0,
            "weight_kg": 10.0,
            "item_type": "fragile",
            "status": "accepted",
            "price": 650.0,
        },
        {
            "sender_id": senders[2].id,
            "traveller_id": None,
            "source_city": "Chennai",
            "dest_city": "Kolkata",
            "distance_km": 1700.0,
            "weight_kg": 20.0,
            "item_type": "electronics",
            "status": "pending",
            "price": 1200.0,
        },
        {
            "sender_id": senders[3].id,
            "traveller_id": travellers[2].id,
            "source_city": "Pune",
            "dest_city": "Mumbai",
            "distance_km": 150.0,
            "weight_kg": 1.0,
            "item_type": "documents",
            "status": "accepted",
            "price": 200.0,
        },
        {
            "sender_id": senders[4].id,
            "traveller_id": None,
            "source_city": "Ahmedabad",
            "dest_city": "Surat",
            "distance_km": 240.0,
            "weight_kg": 5.0,
            "item_type": "food",
            "status": "pending",
            "price": 300.0,
        },
    ]
    
    for order_data in orders_data:
        order = Order(**order_data)
        db.add(order)
    
    db.commit()
    db.close()
    print("✓ Database seeded with demo data")

if __name__ == "__main__":
    seed_database()
