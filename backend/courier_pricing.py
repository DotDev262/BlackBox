from fastapi import FastAPI
from pydantic import BaseModel
from math import *

# note: this module provides helper functions and response models used by main.py
app = FastAPI()

class PriceResponse(BaseModel):
    price: int

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371  # km
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2*atan2(sqrt(a), sqrt(1-a))
    return round(R * c, 2)
def price_calculator(lat1: float, lon1: float, lat2: float, lon2: float, weight_kg: float, item_type: str):
    BASE_FEE = 49
    MIN_PRICE = 100
    MAX_PRICE = 1499

    distance_km = haversine_distance(lat1, lon1, lat2, lon2)
    # Distance slabs
    if distance_km <= 200: distance_fee = 40
    elif distance_km <= 500: distance_fee = 80
    elif distance_km <= 1000: distance_fee = 140
    elif distance_km <= 1500: distance_fee = 200
    else: distance_fee = 260


    # Weight fee
    if weight_kg <= 1: weight_fee = 0
    elif weight_kg <= 5: weight_fee = 75
    elif weight_kg <= 10: weight_fee = 200
    else: weight_fee = 400

    # Risk fee
    fees = {"normal":0, "documents":40, "fragile":150, "electronics":200}
    risk_fee = fees.get(item_type.lower(), 0)

    total = BASE_FEE + distance_fee + weight_fee + risk_fee
    total = max(MIN_PRICE, min(total, MAX_PRICE))

    return PriceResponse(price=total)


    