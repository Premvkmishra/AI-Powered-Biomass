import django
import os
import random
from datetime import datetime, timedelta

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tivra_backend.settings')

django.setup()

from core.models import User, Profile, Product, Enquiry, Message, Order, Transaction, AuditLog, Route
from django.contrib.auth.hashers import make_password
from django.utils import timezone

# Clear existing data first
print("Clearing existing data...")
Route.objects.all().delete()
Transaction.objects.all().delete()
Order.objects.all().delete()
Message.objects.all().delete()
Enquiry.objects.all().delete()
Product.objects.all().delete()
Profile.objects.all().delete()
User.objects.all().delete()
AuditLog.objects.all().delete()
print("Existing data cleared.")

# Create multiple users for each role
users = {}

# Create multiple buyers
buyers = []
for i in range(3):
    user, created = User.objects.get_or_create(
        email=f"buyer{i+1}@example.com",
        defaults={
            'username': f"buyer{i+1}",
            'password': make_password("password123"),
            'role': "Buyer",
            'is_verified': True
        }
    )
    buyers.append(user)
    
    profile, created = Profile.objects.get_or_create(
        user=user,
        defaults={
            'gst_number': f"GST{random.randint(1000,9999)}",
            'kyc_document': f"kyc_buyer{i+1}.pdf",
            'location': f"City {chr(65+i)}",  # City A, B, C
            'contact_info': f"+91-900000000{i}",
            'rating': 0.0
        }
    )

# Create multiple sellers
sellers = []
for i in range(4):
    user, created = User.objects.get_or_create(
        email=f"seller{i+1}@example.com",
        defaults={
            'username': f"seller{i+1}",
            'password': make_password("password123"),
            'role': "Seller",
            'is_verified': True
        }
    )
    sellers.append(user)
    
    profile, created = Profile.objects.get_or_create(
        user=user,
        defaults={
            'gst_number': f"GST{random.randint(1000,9999)}",
            'kyc_document': f"kyc_seller{i+1}.pdf",
            'location': f"City {chr(65+i)}",  # City A, B, C, D
            'contact_info': f"+91-900000001{i}",
            'rating': 4.0 + random.uniform(0, 1)  # 4.0 to 5.0
        }
    )

# Create multiple transporters
transporters = []
for i in range(5):
    user, created = User.objects.get_or_create(
        email=f"transporter{i+1}@example.com",
        defaults={
            'username': f"transporter{i+1}",
            'password': make_password("password123"),
            'role': "Transporter",
            'is_verified': True
        }
    )
    transporters.append(user)
    
    profile, created = Profile.objects.get_or_create(
        user=user,
        defaults={
            'gst_number': f"GST{random.randint(1000,9999)}",
            'kyc_document': f"kyc_transporter{i+1}.pdf",
            'location': f"City {chr(65+i)}",  # City A, B, C, D, E
            'contact_info': f"+91-900000002{i}",
            'rating': 4.0 + random.uniform(0, 1)  # 4.0 to 5.0
        }
    )

# Create admin
admin_user, created = User.objects.get_or_create(
    email="admin@tivra.com",
    defaults={
        'username': "admin",
        'password': make_password("password123"),
        'role': "Admin",
        'is_verified': True
    }
)

profile, created = Profile.objects.get_or_create(
    user=admin_user,
    defaults={
        'gst_number': "GST0000",
        'kyc_document': "kyc_admin.pdf",
        'location': "Headquarters",
        'contact_info': "+91-9000000000",
        'rating': 0.0
    }
)

# Store all users
users.update({
    "buyers": buyers,
    "sellers": sellers,
    "transporters": transporters,
    "admin": admin_user
})

# PRODUCTS (for multiple sellers)
products = []
commodity_types = ["Biomass", "Briquettes", "Biodiesel"]
locations = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"]

for seller in sellers:
    for i in range(3):  # 3 products per seller
        p, created = Product.objects.get_or_create(
            seller=seller,
            commodity_type=random.choice(commodity_types),
            defaults={
                'quantity': 10 + i * 5 + random.randint(0, 10),
                'price': 20000 + i * 5000 + random.randint(0, 5000),
                'unit_of_measure': "ton",
                'availability_dates': f"{timezone.now().date()} to {(timezone.now() + timedelta(days=30)).date()}",
                'pickup_location': random.choice(locations),
                'created_at': timezone.now() - timedelta(days=random.randint(0, 30)),
                'updated_at': timezone.now()
            }
        )
        products.append(p)

# ENQUIRIES (by multiple buyers)
enquiries = []
for buyer in buyers:
    for i in range(2):  # 2 enquiries per buyer
        product = random.choice(products)
        e, created = Enquiry.objects.get_or_create(
            buyer=buyer,
            product=product,
            defaults={
                'quantity': 2 + i + random.randint(0, 5),
                'offered_price': product.price - random.randint(1000, 5000),
                'status': random.choice(["Pending", "Accepted", "Rejected", "Negotiating"]),
                'created_at': timezone.now() - timedelta(days=random.randint(0, 15))
            }
        )
        enquiries.append(e)

# MESSAGES (on Enquiries)
message_contents = [
    "Is this product available for immediate pickup?",
    "Can you provide a discount for bulk purchase?",
    "What's the quality grade of this biomass?",
    "Do you have any certifications for this product?",
    "Can you deliver to my location?",
    "What's the moisture content?",
    "Is this organic certified?",
    "Can you provide samples first?",
    "What's the delivery timeline?",
    "Do you accept payment on delivery?"
]

for enquiry in enquiries:
    # Create 2-4 messages per enquiry
    for i in range(random.randint(2, 4)):
        sender = random.choice([enquiry.buyer, enquiry.product.seller])
        Message.objects.get_or_create(
            enquiry=enquiry,
            sender=sender,
            content=random.choice(message_contents),
            defaults={
                'timestamp': timezone.now() - timedelta(days=random.randint(0, 10))
            }
        )

# ORDERS (from Enquiries) - Create various statuses
orders = []
for i, enquiry in enumerate(enquiries):
    # Some orders with transporters, some without (available jobs)
    transporter = random.choice(transporters) if random.choice([True, False]) else None
    
    # Create different order statuses
    if i < len(enquiries) // 3:  # 1/3 without transporter (available jobs)
        status = "Requested"
        transporter = None
    elif i < len(enquiries) * 2 // 3:  # 1/3 with transporter but not delivered
        status = random.choice(["Picked", "In Transit"])
        transporter = random.choice(transporters)
    else:  # 1/3 delivered
        status = "Delivered"
        transporter = random.choice(transporters)
    
    o, created = Order.objects.get_or_create(
        enquiry=enquiry,
        defaults={
            'transporter': transporter,
            'status': status,
            'created_at': timezone.now() - timedelta(days=random.randint(0, 20)),
            'updated_at': timezone.now() - timedelta(days=random.randint(0, 5))
        }
    )
    orders.append(o)

# TRANSACTIONS (for Orders that are delivered)
for order in orders:
    if order.status == "Delivered":
        Transaction.objects.get_or_create(
            order=order,
            defaults={
                'amount': order.enquiry.product.price * order.enquiry.quantity,
                'invoice_number': f"INV-{order.id:03d}",
                'created_at': order.updated_at
            }
        )

# ROUTES (for transporters)
route_origins = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"]
route_destinations = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"]

for transporter in transporters:
    # Create 2-4 routes per transporter
    for i in range(random.randint(2, 4)):
        origin = random.choice(route_origins)
        destination = random.choice(route_destinations)
        # Ensure origin and destination are different
        while destination == origin:
            destination = random.choice(route_destinations)
        
        Route.objects.get_or_create(
            transporter=transporter,
            origin=origin,
            destination=destination,
            defaults={
                'created_at': timezone.now() - timedelta(days=random.randint(0, 30))
            }
        )

# AUDIT LOGS (for Admin)
audit_actions = [
    "User registration",
    "Product creation",
    "Enquiry submission",
    "Order creation",
    "Payment processing",
    "Route creation",
    "User verification",
    "Product update",
    "Order status update",
    "Transaction completion"
]

for i in range(20):
    AuditLog.objects.get_or_create(
        user=admin_user,
        action=random.choice(audit_actions),
        defaults={
            'timestamp': timezone.now() - timedelta(days=random.randint(0, 30)),
            'details': {
                "user_id": random.choice(buyers + sellers + transporters).id,
                "action_type": "system",
                "ip_address": f"192.168.1.{random.randint(1, 255)}",
                "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        }
    )

print("Comprehensive dummy data created successfully!")
print(f"Created:")
print(f"- {len(buyers)} buyers")
print(f"- {len(sellers)} sellers") 
print(f"- {len(transporters)} transporters")
print(f"- {len(products)} products")
print(f"- {len(enquiries)} enquiries")
print(f"- {len(orders)} orders")
print(f"- {len(Route.objects.all())} routes")
print(f"- {len(AuditLog.objects.all())} audit logs")

# Print available jobs count
available_jobs = Order.objects.filter(status='Requested', transporter__isnull=True).count()
print(f"- {available_jobs} available jobs (orders without transporters)") 