from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from courier_pricing import price_calculator, PriceResponse
import utils
from seed_db import seed_database
from sqlalchemy.orm import Session
from auth import get_current_user

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: seed database
    # seed_database() # Disabling seed for now as it might conflict with auth logic or need updates
    yield
    # Shutdown: cleanup if needed
    pass

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost",
    "http://localhost:8081",
    "http://localhost:19006",
    "http://127.0.0.1",
    "http://127.0.0.1:8081",
    "http://127.0.0.1:19006",
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

@app.get("/users/me")
def read_users_me(user = Depends(get_current_user)):
    return {"user_id": user.id, "email": user.email}

@app.get("/route")
def get_route(source: str, destination: str):
    return {"message": f"Transporting from {source} to {destination}"}

@app.get("/calculate-price", response_model=PriceResponse)
def calculate_price(lat1: float, lon1: float, lat2: float, lon2: float, weight_kg: float, item_type: str):
    return price_calculator(lat1, lon1, lat2, lon2, weight_kg, item_type)

@app.get("/")
def read_root():
    return {"BlackBox": "World"}

# -------------------------------
# Sender endpoints
# -------------------------------
@app.post("/senders")
def create_sender(sender: utils.SenderCreate, db: Session = Depends(utils.get_db), user = Depends(get_current_user)):
    return utils.create_sender(db, sender, user)

@app.get("/senders")
def list_senders(db: Session = Depends(utils.get_db), user = Depends(get_current_user)):
    return utils.list_senders(db, user)

# -------------------------------
# Traveller endpoints
# -------------------------------
@app.post("/travellers")
def create_traveller(traveller: utils.TravellerCreate, db: Session = Depends(utils.get_db), user = Depends(get_current_user)):
    return utils.create_traveller(db, traveller, user)

@app.get("/travellers")
def list_travellers(db: Session = Depends(utils.get_db), user = Depends(get_current_user)):
    return utils.list_travellers(db, user)

# -------------------------------
# Order endpoints
# -------------------------------
@app.get("/orders/available")
def list_available_orders(source_city: str = None, dest_city: str = None, db: Session = Depends(utils.get_db)):
    print(f"DEBUG: Listing available orders. Filters: src={source_city}, dest={dest_city}")
    return utils.list_available_orders(db, source_city, dest_city)

@app.post("/orders")
def create_order(order: utils.OrderCreate, db: Session = Depends(utils.get_db), user = Depends(get_current_user)):
    return utils.create_order(db, order, user)

@app.get("/orders")
def list_orders(db: Session = Depends(utils.get_db), user = Depends(get_current_user)):
    return utils.list_orders(db, user)

@app.post("/orders/{order_id}/accept")
def traveller_accept_order(order_id: int, db: Session = Depends(utils.get_db), user = Depends(get_current_user)):
    return utils.accept_order(db, user, order_id)

@app.post("/complaints")
def create_complaint_endpoint(complaint: utils.ComplaintCreate, db: Session = Depends(utils.get_db), user = Depends(get_current_user)):
    return utils.create_complaint(db, complaint, user)

@app.get("/complaints")
def list_complaints_endpoint(db: Session = Depends(utils.get_db), user = Depends(get_current_user)):
    return utils.list_complaints(db, user)