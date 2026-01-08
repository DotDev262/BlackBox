from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from courier_pricing import price_calculator, PriceResponse
import utils
from sqlalchemy.orm import Session

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/route")
def get_route(source: str, destination: str):
    return {"message": f"Transporting from {source} to {destination}"}

@app.get("/calculate-price", response_model=PriceResponse)
def calculate_price(distance_km: float, weight_kg: float, item_type: str):
    return price_calculator(distance_km, weight_kg, item_type)

@app.get("/")
def read_root():
    return {"BlackBox": "World"}

@app.post("/senders")
def create_sender(sender: utils.SenderCreate, db: Session = Depends(utils.get_db)):
    return utils.create_sender(db, sender)

@app.get("/senders")
def list_senders(db: Session = Depends(utils.get_db)):
    return utils.list_senders(db)

# -------------------------------
# Traveller endpoints
# -------------------------------
@app.post("/travellers")
def create_traveller(traveller: utils.TravellerCreate, db: Session = Depends(utils.get_db)):
    return utils.create_traveller(db, traveller)

@app.get("/travellers")
def list_travellers(db: Session = Depends(utils.get_db)):
    return utils.list_travellers(db)

# -------------------------------
# Order endpoints
# -------------------------------
@app.post("/orders")
def create_order(order: utils.OrderCreate, db: Session = Depends(utils.get_db)):
    return utils.create_order(db, order)

@app.get("/orders")
def list_orders(db: Session = Depends(utils.get_db)):
    return utils.list_orders(db)