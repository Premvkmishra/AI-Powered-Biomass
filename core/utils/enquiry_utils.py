from django.db.models import Q, Count, Avg
from typing import Optional, List, Dict, Any
from ..models import Enquiry, Product, User

def get_enquiry_by_id(enquiry_id: int) -> Optional[Enquiry]:
    """Get enquiry by ID"""
    try:
        return Enquiry.objects.get(id=enquiry_id)
    except Enquiry.DoesNotExist:
        return None

def get_all_enquiries() -> List[Enquiry]:
    """Get all enquiries"""
    return Enquiry.objects.all()

def get_enquiries_by_buyer(buyer_id: int) -> List[Enquiry]:
    """Get enquiries by buyer ID"""
    return Enquiry.objects.filter(buyer_id=buyer_id)

def get_enquiries_by_seller(seller_id: int) -> List[Enquiry]:
    """Get enquiries for products by seller ID"""
    return Enquiry.objects.filter(product__seller_id=seller_id)

def get_enquiries_by_product(product_id: int) -> List[Enquiry]:
    """Get enquiries for specific product"""
    return Enquiry.objects.filter(product_id=product_id)

def get_enquiries_by_status(status: str) -> List[Enquiry]:
    """Get enquiries by status"""
    return Enquiry.objects.filter(status=status)

def get_pending_enquiries() -> List[Enquiry]:
    """Get all pending enquiries"""
    return Enquiry.objects.filter(status='Pending')

def get_accepted_enquiries() -> List[Enquiry]:
    """Get all accepted enquiries"""
    return Enquiry.objects.filter(status='Accepted')

def get_rejected_enquiries() -> List[Enquiry]:
    """Get all rejected enquiries"""
    return Enquiry.objects.filter(status='Rejected')

def get_negotiating_enquiries() -> List[Enquiry]:
    """Get all negotiating enquiries"""
    return Enquiry.objects.filter(status='Negotiating')

def get_enquiries_with_details() -> List[Enquiry]:
    """Get enquiries with buyer and product details"""
    return Enquiry.objects.select_related('buyer', 'product', 'product__seller').all()

def get_enquiries_by_buyer_with_details(buyer_id: int) -> List[Enquiry]:
    """Get enquiries by buyer with details"""
    return Enquiry.objects.select_related('buyer', 'product', 'product__seller').filter(buyer_id=buyer_id)

def get_enquiries_by_seller_with_details(seller_id: int) -> List[Enquiry]:
    """Get enquiries by seller with details"""
    return Enquiry.objects.select_related('buyer', 'product', 'product__seller').filter(product__seller_id=seller_id)

def get_enquiries_by_price_range(min_price: float, max_price: float) -> List[Enquiry]:
    """Get enquiries within price range"""
    return Enquiry.objects.filter(offered_price__gte=min_price, offered_price__lte=max_price)

def get_enquiries_by_quantity_range(min_quantity: float, max_quantity: float) -> List[Enquiry]:
    """Get enquiries within quantity range"""
    return Enquiry.objects.filter(quantity__gte=min_quantity, quantity__lte=max_quantity)

def search_enquiries(query: str) -> List[Enquiry]:
    """Search enquiries by buyer email or product commodity type"""
    return Enquiry.objects.filter(
        Q(buyer__email__icontains=query) |
        Q(product__commodity_type__icontains=query)
    )

def get_enquiry_stats() -> Dict[str, Any]:
    """Get enquiry statistics"""
    total_enquiries = Enquiry.objects.count()
    pending_enquiries = Enquiry.objects.filter(status='Pending').count()
    accepted_enquiries = Enquiry.objects.filter(status='Accepted').count()
    rejected_enquiries = Enquiry.objects.filter(status='Rejected').count()
    negotiating_enquiries = Enquiry.objects.filter(status='Negotiating').count()
    
    avg_offered_price = Enquiry.objects.aggregate(avg_price=Avg('offered_price'))
    avg_quantity = Enquiry.objects.aggregate(avg_quantity=Avg('quantity'))
    
    return {
        'total_enquiries': total_enquiries,
        'pending_enquiries': pending_enquiries,
        'accepted_enquiries': accepted_enquiries,
        'rejected_enquiries': rejected_enquiries,
        'negotiating_enquiries': negotiating_enquiries,
        'average_offered_price': avg_offered_price['avg_price'],
        'average_quantity': avg_quantity['avg_quantity']
    }

def get_buyer_enquiry_stats(buyer_id: int) -> Dict[str, Any]:
    """Get enquiry statistics for a specific buyer"""
    enquiries = Enquiry.objects.filter(buyer_id=buyer_id)
    total_enquiries = enquiries.count()
    pending_enquiries = enquiries.filter(status='Pending').count()
    accepted_enquiries = enquiries.filter(status='Accepted').count()
    rejected_enquiries = enquiries.filter(status='Rejected').count()
    negotiating_enquiries = enquiries.filter(status='Negotiating').count()
    
    avg_offered_price = enquiries.aggregate(avg_price=Avg('offered_price'))
    avg_quantity = enquiries.aggregate(avg_quantity=Avg('quantity'))
    
    return {
        'total_enquiries': total_enquiries,
        'pending_enquiries': pending_enquiries,
        'accepted_enquiries': accepted_enquiries,
        'rejected_enquiries': rejected_enquiries,
        'negotiating_enquiries': negotiating_enquiries,
        'average_offered_price': avg_offered_price['avg_price'],
        'average_quantity': avg_quantity['avg_quantity']
    }

def get_seller_enquiry_stats(seller_id: int) -> Dict[str, Any]:
    """Get enquiry statistics for a specific seller"""
    enquiries = Enquiry.objects.filter(product__seller_id=seller_id)
    total_enquiries = enquiries.count()
    pending_enquiries = enquiries.filter(status='Pending').count()
    accepted_enquiries = enquiries.filter(status='Accepted').count()
    rejected_enquiries = enquiries.filter(status='Rejected').count()
    negotiating_enquiries = enquiries.filter(status='Negotiating').count()
    
    avg_offered_price = enquiries.aggregate(avg_price=Avg('offered_price'))
    avg_quantity = enquiries.aggregate(avg_quantity=Avg('quantity'))
    
    return {
        'total_enquiries': total_enquiries,
        'pending_enquiries': pending_enquiries,
        'accepted_enquiries': accepted_enquiries,
        'rejected_enquiries': rejected_enquiries,
        'negotiating_enquiries': negotiating_enquiries,
        'average_offered_price': avg_offered_price['avg_price'],
        'average_quantity': avg_quantity['avg_quantity']
    }

def get_recent_enquiries(limit: int = 10) -> List[Enquiry]:
    """Get most recent enquiries"""
    return Enquiry.objects.order_by('-created_at')[:limit]

def get_enquiries_by_date_range(start_date, end_date) -> List[Enquiry]:
    """Get enquiries created within date range"""
    return Enquiry.objects.filter(created_at__range=[start_date, end_date]) 

def respond_to_enquiry(enquiry_id: int, status_update: str = None, message: str = None, sender=None) -> Optional[Enquiry]:
    """Update enquiry status and optionally add a response message."""
    try:
        enquiry = Enquiry.objects.get(id=enquiry_id)
        if status_update:
            enquiry.status = status_update
        enquiry.save()
        if message and sender:
            from ..models import Message
            Message.objects.create(enquiry=enquiry, sender=sender, content=message)
        return enquiry
    except Enquiry.DoesNotExist:
        return None 