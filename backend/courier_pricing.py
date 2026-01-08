from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class PriceResponse(BaseModel):
    price: int


def get_distance_fee(distance_km: float) -> int:
    if distance_km <= 50:
        return 30
    elif distance_km <= 150:
        return 60
    elif distance_km <= 300:
        return 100
    elif distance_km <= 600:
        return 150
    else:
        return 200


def get_weight_fee(weight_kg: float) -> int:
    if weight_kg <= 1:
        return 0
    elif weight_kg <= 5:
        return 75
    elif weight_kg <= 10:
        return 200
    else:
        return 400


def get_risk_fee(item_type: str) -> int:
    fees = {
        "normal": 0,
        "documents": 40,
        "fragile": 150,
        "electronics": 200
    }
    return fees.get(item_type.lower(), 0)


def price_calculator(distance_km: float, weight_kg: float, item_type: str):
    BASE_FEE = 49
    MIN_PRICE = 199
    MAX_PRICE = 1499

    total = (
        BASE_FEE +
        get_distance_fee(distance_km) +
        get_weight_fee(weight_kg) +
        get_risk_fee(item_type)
    )

    total = max(MIN_PRICE, min(total, MAX_PRICE))

    return PriceResponse(price=total)


    