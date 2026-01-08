from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from courier_pricing import price_calculator, PriceResponse

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