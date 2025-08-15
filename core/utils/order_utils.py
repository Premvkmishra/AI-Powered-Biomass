from django.db.models import Q, Count, Sum, Avg
from typing import Optional, List, Dict, Any
from ..models import Order, Enquiry, User

def get_order_by_id(order_id: int) -> Optional[Order]:
    """Get order by ID"""
    try:
        return Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return None

def get_all_orders() -> List[Order]:
    """Get all orders"""
    return Order.objects.all()

def get_orders_by_buyer(buyer_id: int) -> List[Order]:
    """Get orders by buyer ID"""
    return Order.objects.filter(enquiry__buyer_id=buyer_id)

def get_orders_by_seller(seller_id: int) -> List[Order]:
    """Get orders for products by seller ID"""
    return Order.objects.filter(enquiry__product__seller_id=seller_id)

def get_orders_by_transporter(transporter_id: int) -> List[Order]:
    """Get orders by transporter ID"""
    return Order.objects.filter(transporter_id=transporter_id)

def get_orders_by_status(status: str) -> List[Order]:
    """Get orders by status"""
    return Order.objects.filter(status=status)

def get_requested_orders() -> List[Order]:
    """Get all requested orders"""
    return Order.objects.filter(status='Requested')

def get_picked_orders() -> List[Order]:
    """Get all picked orders"""
    return Order.objects.filter(status='Picked')

def get_in_transit_orders() -> List[Order]:
    """Get all in transit orders"""
    return Order.objects.filter(status='In Transit')

def get_delivered_orders() -> List[Order]:
    """Get all delivered orders"""
    return Order.objects.filter(status='Delivered')

def get_available_jobs() -> List[Order]:
    """Get orders without assigned transporter"""
    return Order.objects.filter(status='Requested', transporter__isnull=True)

def get_orders_with_details() -> List[Order]:
    """Get orders with all related details"""
    return Order.objects.select_related(
        'enquiry', 'enquiry__buyer', 'enquiry__product', 
        'enquiry__product__seller', 'transporter'
    ).all()

def get_orders_by_buyer_with_details(buyer_id: int) -> List[Order]:
    """Get orders by buyer with details"""
    return Order.objects.select_related(
        'enquiry', 'enquiry__buyer', 'enquiry__product', 
        'enquiry__product__seller', 'transporter'
    ).filter(enquiry__buyer_id=buyer_id)

def get_orders_by_seller_with_details(seller_id: int) -> List[Order]:
    """Get orders by seller with details"""
    return Order.objects.select_related(
        'enquiry', 'enquiry__buyer', 'enquiry__product', 
        'enquiry__product__seller', 'transporter'
    ).filter(enquiry__product__seller_id=seller_id)

def get_orders_by_transporter_with_details(transporter_id: int) -> List[Order]:
    """Get orders by transporter with details"""
    return Order.objects.select_related(
        'enquiry', 'enquiry__buyer', 'enquiry__product', 
        'enquiry__product__seller', 'transporter'
    ).filter(transporter_id=transporter_id)

def search_orders(query: str) -> List[Order]:
    """Search orders by buyer email, seller email, or transporter email"""
    return Order.objects.filter(
        Q(enquiry__buyer__email__icontains=query) |
        Q(enquiry__product__seller__email__icontains=query) |
        Q(transporter__email__icontains=query)
    )

def get_order_stats() -> Dict[str, Any]:
    """Get order statistics"""
    total_orders = Order.objects.count()
    requested_orders = Order.objects.filter(status='Requested').count()
    picked_orders = Order.objects.filter(status='Picked').count()
    in_transit_orders = Order.objects.filter(status='In Transit').count()
    delivered_orders = Order.objects.filter(status='Delivered').count()
    
    available_jobs = Order.objects.filter(status='Requested', transporter__isnull=True).count()
    
    return {
        'total_orders': total_orders,
        'requested_orders': requested_orders,
        'picked_orders': picked_orders,
        'in_transit_orders': in_transit_orders,
        'delivered_orders': delivered_orders,
        'available_jobs': available_jobs
    }

def get_buyer_order_stats(buyer_id: int) -> Dict[str, Any]:
    """Get order statistics for a specific buyer"""
    orders = Order.objects.filter(enquiry__buyer_id=buyer_id)
    total_orders = orders.count()
    requested_orders = orders.filter(status='Requested').count()
    picked_orders = orders.filter(status='Picked').count()
    in_transit_orders = orders.filter(status='In Transit').count()
    delivered_orders = orders.filter(status='Delivered').count()
    
    return {
        'total_orders': total_orders,
        'requested_orders': requested_orders,
        'picked_orders': picked_orders,
        'in_transit_orders': in_transit_orders,
        'delivered_orders': delivered_orders
    }

def get_seller_order_stats(seller_id: int) -> Dict[str, Any]:
    """Get order statistics for a specific seller"""
    orders = Order.objects.filter(enquiry__product__seller_id=seller_id)
    total_orders = orders.count()
    requested_orders = orders.filter(status='Requested').count()
    picked_orders = orders.filter(status='Picked').count()
    in_transit_orders = orders.filter(status='In Transit').count()
    delivered_orders = orders.filter(status='Delivered').count()
    
    return {
        'total_orders': total_orders,
        'requested_orders': requested_orders,
        'picked_orders': picked_orders,
        'in_transit_orders': in_transit_orders,
        'delivered_orders': delivered_orders
    }

def get_transporter_order_stats(transporter_id: int) -> Dict[str, Any]:
    """Get order statistics for a specific transporter"""
    orders = Order.objects.filter(transporter_id=transporter_id)
    total_orders = orders.count()
    requested_orders = orders.filter(status='Requested').count()
    picked_orders = orders.filter(status='Picked').count()
    in_transit_orders = orders.filter(status='In Transit').count()
    delivered_orders = orders.filter(status='Delivered').count()
    
    return {
        'total_orders': total_orders,
        'requested_orders': requested_orders,
        'picked_orders': picked_orders,
        'in_transit_orders': in_transit_orders,
        'delivered_orders': delivered_orders
    }

def get_recent_orders(limit: int = 10) -> List[Order]:
    """Get most recent orders"""
    return Order.objects.order_by('-created_at')[:limit]

def get_orders_by_date_range(start_date, end_date) -> List[Order]:
    """Get orders created within date range"""
    return Order.objects.filter(created_at__range=[start_date, end_date])

def get_orders_by_enquiry(enquiry_id: int) -> List[Order]:
    """Get orders for specific enquiry"""
    return Order.objects.filter(enquiry_id=enquiry_id) 