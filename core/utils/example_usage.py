"""
Example usage of utility functions in views
This file shows how to use the utility functions in your API views
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

# Import utility functions
from .all_utils import (
    # User utilities
    get_user_by_id, get_users_by_role, get_user_stats,
    
    # Product utilities
    get_all_products, get_products_by_seller, get_product_stats,
    
    # Enquiry utilities
    get_enquiries_by_buyer, get_enquiry_stats,
    
    # Order utilities
    get_orders_by_buyer, get_available_jobs, get_order_stats,
    
    # Message utilities
    get_messages_by_user, get_message_stats,
    
    # Transaction utilities
    get_transactions_by_buyer, get_transaction_stats,
    
    # Audit utilities
    get_audit_logs_by_user, get_audit_log_stats,
    
    # Route utilities
    get_routes_by_transporter, get_route_stats
)

# Example 1: Simple user retrieval
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request, user_id):
    """Get user profile with utility function"""
    user = get_user_by_id(user_id)
    if not user:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    return Response({
        'id': user.id,
        'email': user.email,
        'role': user.role,
        'is_verified': user.is_verified
    })

# Example 2: Get all sellers
@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_sellers(request):
    """Get all sellers using utility function"""
    sellers = get_users_by_role('Seller')
    return Response({
        'sellers': [
            {
                'id': seller.id,
                'email': seller.email,
                'username': seller.username,
                'is_verified': seller.is_verified
            }
            for seller in sellers
        ]
    })

# Example 3: Get products by seller
@api_view(['GET'])
@permission_classes([AllowAny])
def get_seller_products(request, seller_id):
    """Get products by seller using utility function"""
    products = get_products_by_seller(seller_id)
    return Response({
        'products': [
            {
                'id': product.id,
                'commodity_type': product.commodity_type,
                'quantity': product.quantity,
                'price': product.price,
                'unit_of_measure': product.unit_of_measure
            }
            for product in products
        ]
    })

# Example 4: Get available jobs for transporters
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_available_jobs_view(request):
    """Get available jobs using utility function"""
    jobs = get_available_jobs()
    return Response({
        'available_jobs': [
            {
                'id': job.id,
                'enquiry_id': job.enquiry.id,
                'status': job.status,
                'created_at': job.created_at
            }
            for job in jobs
        ]
    })

# Example 5: Get user dashboard stats
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_dashboard_stats(request, user_id):
    """Get comprehensive dashboard stats using utility functions"""
    
    # Get user stats
    user_stats = get_user_stats()
    
    # Get product stats
    product_stats = get_product_stats()
    
    # Get enquiry stats
    enquiry_stats = get_enquiry_stats()
    
    # Get order stats
    order_stats = get_order_stats()
    
    # Get message stats
    message_stats = get_message_stats()
    
    # Get transaction stats
    transaction_stats = get_transaction_stats()
    
    # Get audit log stats
    audit_stats = get_audit_log_stats()
    
    # Get route stats
    route_stats = get_route_stats()
    
    return Response({
        'user_stats': user_stats,
        'product_stats': product_stats,
        'enquiry_stats': enquiry_stats,
        'order_stats': order_stats,
        'message_stats': message_stats,
        'transaction_stats': transaction_stats,
        'audit_stats': audit_stats,
        'route_stats': route_stats
    })

# Example 6: Get buyer-specific data
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_buyer_data(request, buyer_id):
    """Get buyer-specific data using utility functions"""
    
    # Get buyer's enquiries
    enquiries = get_enquiries_by_buyer(buyer_id)
    
    # Get buyer's orders
    orders = get_orders_by_buyer(buyer_id)
    
    # Get buyer's messages
    messages = get_messages_by_user(buyer_id)
    
    # Get buyer's transactions
    transactions = get_transactions_by_buyer(buyer_id)
    
    return Response({
        'enquiries': [
            {
                'id': enquiry.id,
                'product': enquiry.product.commodity_type,
                'status': enquiry.status,
                'quantity': enquiry.quantity
            }
            for enquiry in enquiries
        ],
        'orders': [
            {
                'id': order.id,
                'status': order.status,
                'created_at': order.created_at
            }
            for order in orders
        ],
        'messages': [
            {
                'id': message.id,
                'content': message.content,
                'timestamp': message.timestamp
            }
            for message in messages
        ],
        'transactions': [
            {
                'id': transaction.id,
                'amount': transaction.amount,
                'created_at': transaction.created_at
            }
            for transaction in transactions
        ]
    })

# Example 7: Search functionality
@api_view(['GET'])
@permission_classes([AllowAny])
def search_platform(request):
    """Search across multiple entities using utility functions"""
    query = request.GET.get('q', '')
    
    if not query:
        return Response({'error': 'Query parameter required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Search users
    users = search_users(query)
    
    # Search products
    products = search_products(query)
    
    # Search enquiries
    enquiries = search_enquiries(query)
    
    # Search messages
    messages = search_messages(query)
    
    return Response({
        'users': [
            {
                'id': user.id,
                'email': user.email,
                'role': user.role
            }
            for user in users
        ],
        'products': [
            {
                'id': product.id,
                'commodity_type': product.commodity_type,
                'price': product.price
            }
            for product in products
        ],
        'enquiries': [
            {
                'id': enquiry.id,
                'status': enquiry.status,
                'quantity': enquiry.quantity
            }
            for enquiry in enquiries
        ],
        'messages': [
            {
                'id': message.id,
                'content': message.content[:100] + '...' if len(message.content) > 100 else message.content
            }
            for message in messages
        ]
    }) 