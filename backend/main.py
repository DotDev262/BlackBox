from fastapi import FastAPI

app = FastAPI()

@app.get("/route")
def get_route(source: str, destination: str):
    return {"message": f"Transporting from {source} to {destination}"}

@app.get("/")
def read_root():
    return {"BlackBox": "World"}