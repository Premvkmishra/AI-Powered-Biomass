import django
import os

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tivra_backend.settings')

django.setup()

from core.models import User, Profile, Product, Enquiry, Message, Order, Transaction, AuditLog, Route

print("Checking existing data...")
print(f"Users: {User.objects.count()}")
print(f"Profiles: {Profile.objects.count()}")
print(f"Products: {Product.objects.count()}")
print(f"Enquiries: {Enquiry.objects.count()}")
print(f"Messages: {Message.objects.count()}")
print(f"Orders: {Order.objects.count()}")
print(f"Transactions: {Transaction.objects.count()}")
print(f"Routes: {Route.objects.count()}")
print(f"Audit Logs: {AuditLog.objects.count()}")

if User.objects.count() > 0:
    print("\nFirst few users:")
    for user in User.objects.all()[:5]:
        print(f"- {user.email} ({user.role})")

if Profile.objects.count() > 0:
    print("\nFirst few profiles:")
    for profile in Profile.objects.all()[:5]:
        print(f"- User: {profile.user.email}, Location: {profile.location}") 