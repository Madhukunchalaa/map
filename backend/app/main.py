from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
import uvicorn

from app.database import engine, SessionLocal, Base
from app import models, services, seed_data, forecasting_service, opportunity_engine, auth, mongodb

# Create database tables
Base.metadata.create_all(bind=engine)

# Seed data if empty
db = SessionLocal()
if db.query(models.City).count() == 0:
    seed_data.populate_db(db)
db.close()

app = FastAPI(title="Opportunity Map API")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@app.on_event("startup")
async def startup_db_client():
    await mongodb.mongo.connect_to_storage()

@app.on_event("shutdown")
async def shutdown_db_client():
    await mongodb.mongo.close_storage()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication Endpoints
@app.post("/register")
async def register(form_data: OAuth2PasswordRequestForm = Depends()):
    db = mongodb.get_db()
    user = await db.users.find_one({"username": form_data.username})
    if user:
        return {"error": "Username already registered"}
    
    hashed_password = auth.get_password_hash(form_data.password)
    new_user = {
        "username": form_data.username,
        "password": hashed_password,
        "history": []
    }
    await db.users.insert_one(new_user)
    return {"message": "User registered successfully"}

@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db = mongodb.get_db()
    user = await db.users.find_one({"username": form_data.username})
    if not user or not auth.verify_password(form_data.password, user["password"]):
        return {"error": "Incorrect username or password"}
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = auth.decode_token(token)
    if not payload:
        return None
    username = payload.get("sub")
    if not username:
        return None
    db = mongodb.get_db()
    user = await db.users.find_one({"username": username})
    return user

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Opportunity Map API is running"}

@app.get("/cities")
def get_cities(db: Session = Depends(get_db)):
    return db.query(models.City).all()

@app.get("/resolve-city")
def resolve_city_endpoint(name: str, db: Session = Depends(get_db)):
    city = services.resolve_city(db, name)
    if not city:
        return {"error": "City not found"}
    return city

@app.get("/opportunities")
def get_opportunities(
    city_id: int, 
    business_type: str, 
    db: Session = Depends(get_db)
):
    return services.calculate_opportunities(db, city_id, business_type)

@app.get("/trends")
def get_trends(
    city_id: int, 
    business_type: str, 
    db: Session = Depends(get_db)
):
    return services.get_demand_trends(db, city_id, business_type)

@app.get("/stats")
def get_global_stats(db: Session = Depends(get_db)):
    return services.get_summary_stats(db)

@app.get("/predict")
def get_prediction(
    city_id: int, 
    business_type: str, 
    db: Session = Depends(get_db)
):
    return forecasting_service.predict_future_demand(db, city_id, business_type)

@app.get("/hotspots")
def get_hotspots(
    city_id: int, 
    db: Session = Depends(get_db)
):
    return forecasting_service.identify_hotspots(db, city_id)

@app.get("/api/opportunity-analysis")
def get_opportunity_analysis(
    city_id: int,
    db: Session = Depends(get_db)
):
    return opportunity_engine.opportunity_engine.analyze_city_opportunities(db, city_id)

@app.post("/api/analyze-custom")
async def analyze_custom(
    business_name: str,
    category: str,
    location: str,
    current_user: dict = Depends(get_current_user)
):
    if not current_user:
        return {"error": "Authentication required"}
    
    # Analyze using Opportunity Engine logic
    # We resolve the city or use it as a location string
    analysis = await opportunity_engine.opportunity_engine.analyze_custom_location(location, category)
    
    report = {
        "business_name": business_name,
        "category": category,
        "location": location,
        "timestamp": datetime.utcnow().isoformat(),
        "analysis": analysis
    }
    
    return report

@app.post("/api/history")
async def save_history(report: dict, current_user: dict = Depends(get_current_user)):
    if not current_user:
        return {"error": "Authentication required"}
    
    db = mongodb.get_db()
    await db.users.update_one(
        {"username": current_user["username"]},
        {"$push": {"history": report}}
    )
    return {"message": "Analysis saved to history"}

@app.get("/api/history")
async def get_history(current_user: dict = Depends(get_current_user)):
    if not current_user:
        return {"error": "Authentication required"}
    
    return current_user.get("history", [])

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
