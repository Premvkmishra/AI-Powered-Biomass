import os
import django
import random
from datetime import datetime, timedelta

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tivra_backend.settings")
django.setup()

from core.models import User, Product

# Set the seller user (change the ID if needed)
SELLER_ID = 1
seller = User.objects.get(id=SELLER_ID)

commodity_types = ["Biomass", "Briquettes", "Biodiesel"]
locations = [f"Warehouse {i}" for i in range(1, 11)]

for i in range(30):
    commodity = random.choice(commodity_types)
    quantity = random.randint(5, 50)
    price = random.randint(15000, 40000)
    unit = "ton"
    start_date = datetime.now().date()
    end_date = start_date + timedelta(days=random.randint(15, 60))
    availability = f"{start_date},{end_date}"
    location = random.choice(locations)
    product = Product.objects.create(
        seller=seller,
        commodity_type=commodity,
        quantity=quantity,
        price=price,
        unit_of_measure=unit,
        availability_dates=availability,
        pickup_location=location,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    print(f"Created product {i+1}: {commodity} ({quantity} {unit}) at {location}")

print("30 products added successfully.")