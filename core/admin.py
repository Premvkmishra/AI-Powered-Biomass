from django.contrib import admin
from .models import User, Profile, Product, Enquiry, Message, Order, Transaction, AuditLog

admin.site.register(User)
admin.site.register(Profile)
admin.site.register(Product)
admin.site.register(Enquiry)
admin.site.register(Message)
admin.site.register(Order)
admin.site.register(Transaction)
admin.site.register(AuditLog)
