import django
import os

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tivra_backend.settings')

django.setup()

from django.db import connection

# Clear all data using raw SQL
print("Clearing existing data...")

with connection.cursor() as cursor:
    # Clear all tables in reverse dependency order
    tables = [
        'core_route',
        'core_transaction', 
        'core_order',
        'core_message',
        'core_enquiry',
        'core_product',
        'core_profile',
        'core_user',
        'core_auditlog'
    ]
    
    for table in tables:
        try:
            cursor.execute(f"DELETE FROM {table};")
            print(f"Cleared {table}")
        except Exception as e:
            print(f"Could not clear {table}: {e}")

print("Data clearing completed!") 