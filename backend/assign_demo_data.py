import sys
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Order, Traveller, Sender

def assign_data(email: str):
    db = SessionLocal()
    try:
        # 1. Find the user's Traveller profile
        traveller = db.query(Traveller).filter(Traveller.email == email).first()
        if traveller:
            print(f"✓ Found Traveller profile for {email} (ID: {traveller.id})")
            # Update 'accepted' orders to this traveller
            accepted_orders = db.query(Order).filter(Order.status == "accepted").all()
            for order in accepted_orders:
                order.traveller_id = traveller.id
            print(f"  -> Assigned {len(accepted_orders)} accepted orders to you.")
        else:
            print(f"⚠ No Traveller profile found for {email}. Create one in the app (Transporter tab) first.")

        # 2. Find the user's Sender profile
        sender = db.query(Sender).filter(Sender.email == email).first()
        if sender:
            print(f"✓ Found Sender profile for {email} (ID: {sender.id})")
            # Update 'pending' orders to this sender
            pending_orders = db.query(Order).filter(Order.status == "pending").all()
            for order in pending_orders:
                order.sender_id = sender.id
            print(f"  -> Assigned {len(pending_orders)} pending orders to you.")
        else:
            print(f"⚠ No Sender profile found for {email}. Create one in the app (Add Shipment) first.")

        db.commit()
        print("\nDone! Refresh your app to see the changes.")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python assign_demo_data.py <your_email>")
        sys.exit(1)
    
    email = sys.argv[1]
    assign_data(email)
