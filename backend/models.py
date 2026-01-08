from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base  # <- import Base from your database.py

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
