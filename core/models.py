from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class User(AbstractUser):
    ROLE_CHOICES = [
        ('Buyer', 'Buyer'),
        ('Seller', 'Seller'),
        ('Transporter', 'Transporter'),
        ('Admin', 'Admin'),
    ]
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    gst_number = models.CharField(max_length=50)
    kyc_document = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    contact_info = models.CharField(max_length=255)
    rating = models.FloatField(default=0.0)

    def __str__(self):
        return f"Profile of {self.user.email}"

class Product(models.Model):
    COMMODITY_CHOICES = [
        ('Biomass', 'Biomass'),
        ('Briquettes', 'Briquettes'),
        ('Biodiesel', 'Biodiesel'),
        # Add more as needed
    ]
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    commodity_type = models.CharField(max_length=50, choices=COMMODITY_CHOICES)
    quantity = models.FloatField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    unit_of_measure = models.CharField(max_length=20)
    availability_dates = models.CharField(max_length=100)  # Use CharField for daterange for now
    pickup_location = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.commodity_type} by {self.seller.email}"

class Enquiry(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
        ('Negotiating', 'Negotiating'),
    ]
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enquiries')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='enquiries')
    quantity = models.FloatField()
    offered_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Enquiry by {self.buyer.email} for {self.product}"

class Message(models.Model):
    enquiry = models.ForeignKey(Enquiry, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message by {self.sender.email} on {self.timestamp}"

class Order(models.Model):
    STATUS_CHOICES = [
        ('Requested', 'Requested'),
        ('Picked', 'Picked'),
        ('In Transit', 'In Transit'),
        ('Delivered', 'Delivered'),
    ]
    enquiry = models.ForeignKey(Enquiry, on_delete=models.CASCADE, related_name='orders')
    transporter = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='transported_orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Requested')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order for {self.enquiry}"

class Transaction(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='transaction')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    invoice_number = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transaction for {self.order}"

from django.contrib.postgres.fields import JSONField

class AuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='audit_logs')
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField()

    def __str__(self):
        return f"AuditLog by {self.user.email} at {self.timestamp}"

class Route(models.Model):
    transporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='routes')
    origin = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Route {self.origin} to {self.destination} for {self.transporter.email}"
