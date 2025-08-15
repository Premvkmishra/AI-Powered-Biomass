"""
Comprehensive utility functions for Tivra Platform
This file imports all utility functions from individual modules for easy access
"""

# User utilities
from .user_utils import (
    get_user_by_id,
    get_user_by_email,
    get_user_by_username,
    get_all_users,
    get_users_by_role,
    get_verified_users,
    get_unverified_users,
    search_users,
    get_user_profile,
    get_user_with_profile,
    get_users_with_profiles,
    get_users_by_location,
    get_users_by_gst_number,
    get_active_users,
    get_user_stats
)

# Product utilities
from .product_utils import (
    get_product_by_id,
    get_all_products,
    get_products_by_seller,
    get_products_by_commodity_type,
    get_products_by_location,
    get_products_by_price_range,
    get_products_by_quantity_range,
    search_products,
    get_products_with_seller_info,
    get_products_by_seller_with_info,
    get_available_products,
    get_products_by_unit,
    get_product_stats,
    get_seller_products_with_stats,
    get_products_by_date_range,
    get_recent_products,
    get_products_by_rating,
    update_product,
    delete_product
)

# Enquiry utilities
from .enquiry_utils import (
    get_enquiry_by_id,
    get_all_enquiries,
    get_enquiries_by_buyer,
    get_enquiries_by_seller,
    get_enquiries_by_product,
    get_enquiries_by_status,
    get_pending_enquiries,
    get_accepted_enquiries,
    get_rejected_enquiries,
    get_negotiating_enquiries,
    get_enquiries_with_details,
    get_enquiries_by_buyer_with_details,
    get_enquiries_by_seller_with_details,
    get_enquiries_by_price_range,
    get_enquiries_by_quantity_range,
    search_enquiries,
    get_enquiry_stats,
    get_buyer_enquiry_stats,
    get_seller_enquiry_stats,
    get_recent_enquiries,
    get_enquiries_by_date_range,
    respond_to_enquiry
)

# Order utilities
from .order_utils import (
    get_order_by_id,
    get_all_orders,
    get_orders_by_buyer,
    get_orders_by_seller,
    get_orders_by_transporter,
    get_orders_by_status,
    get_requested_orders,
    get_picked_orders,
    get_in_transit_orders,
    get_delivered_orders,
    get_available_jobs,
    get_orders_with_details,
    get_orders_by_buyer_with_details,
    get_orders_by_seller_with_details,
    get_orders_by_transporter_with_details,
    search_orders,
    get_order_stats,
    get_buyer_order_stats,
    get_seller_order_stats,
    get_transporter_order_stats,
    get_recent_orders,
    get_orders_by_date_range,
    get_orders_by_enquiry
)

# Message utilities
from .message_utils import (
    get_message_by_id,
    get_all_messages,
    get_messages_by_enquiry,
    get_messages_by_sender,
    get_messages_by_user,
    get_messages_with_details,
    get_messages_by_enquiry_with_details,
    get_messages_by_sender_with_details,
    get_messages_by_user_with_details,
    search_messages,
    get_recent_messages,
    get_messages_by_date_range,
    get_message_stats,
    get_user_message_stats,
    get_enquiry_message_stats,
    get_conversation_messages,
    get_unread_messages_count
)

# Transaction utilities
from .transaction_utils import (
    get_transaction_by_id,
    get_all_transactions,
    get_transaction_by_order,
    get_transactions_by_buyer,
    get_transactions_by_seller,
    get_transactions_by_transporter,
    get_transactions_with_details,
    get_transactions_by_buyer_with_details,
    get_transactions_by_seller_with_details,
    get_transactions_by_transporter_with_details,
    get_transactions_by_amount_range,
    search_transactions,
    get_transaction_stats,
    get_buyer_transaction_stats,
    get_seller_transaction_stats,
    get_transporter_transaction_stats,
    get_recent_transactions,
    get_transactions_by_date_range,
    get_transactions_by_invoice_number,
    get_high_value_transactions,
    get_transaction_summary_by_period
)

# Audit log utilities
from .audit_utils import (
    get_audit_log_by_id,
    get_all_audit_logs,
    get_audit_logs_by_user,
    get_audit_logs_by_action,
    get_audit_logs_with_user_details,
    get_audit_logs_by_user_with_details,
    search_audit_logs,
    get_recent_audit_logs,
    get_audit_logs_by_date_range,
    get_audit_log_stats,
    get_user_audit_stats,
    get_action_audit_stats,
    get_audit_logs_by_action_type,
    get_user_activity_summary,
    get_system_activity_summary,
    get_audit_logs_by_details_key,
    get_audit_logs_by_details_contains
)

# Route utilities
from .route_utils import (
    get_route_by_id,
    get_all_routes,
    get_routes_by_transporter,
    get_routes_by_origin,
    get_routes_by_destination,
    get_routes_by_location,
    get_routes_with_transporter_details,
    get_routes_by_transporter_with_details,
    search_routes,
    get_route_stats,
    get_transporter_route_stats,
    get_recent_routes,
    get_routes_by_date_range,
    get_popular_routes,
    get_route_network,
    get_transporter_route_network,
    find_common_routes,
    get_route_suggestions
)

# Export all functions for easy import
__all__ = [
    # User functions
    'get_user_by_id', 'get_user_by_email', 'get_user_by_username',
    'get_all_users', 'get_users_by_role', 'get_verified_users',
    'get_unverified_users', 'search_users', 'get_user_profile',
    'get_user_with_profile', 'get_users_with_profiles',
    'get_users_by_location', 'get_users_by_gst_number',
    'get_active_users', 'get_user_stats',
    
    # Product functions
    'get_product_by_id', 'get_all_products', 'get_products_by_seller',
    'get_products_by_commodity_type', 'get_products_by_location',
    'get_products_by_price_range', 'get_products_by_quantity_range',
    'search_products', 'get_products_with_seller_info',
    'get_products_by_seller_with_info', 'get_available_products',
    'get_products_by_unit', 'get_product_stats',
    'get_seller_products_with_stats', 'get_products_by_date_range',
    'get_recent_products', 'get_products_by_rating',
    'update_product', 'delete_product',
    
    # Enquiry functions
    'get_enquiry_by_id', 'get_all_enquiries', 'get_enquiries_by_buyer',
    'get_enquiries_by_seller', 'get_enquiries_by_product',
    'get_enquiries_by_status', 'get_pending_enquiries',
    'get_accepted_enquiries', 'get_rejected_enquiries',
    'get_negotiating_enquiries', 'get_enquiries_with_details',
    'get_enquiries_by_buyer_with_details', 'get_enquiries_by_seller_with_details',
    'get_enquiries_by_price_range', 'get_enquiries_by_quantity_range',
    'search_enquiries', 'get_enquiry_stats', 'get_buyer_enquiry_stats',
    'get_seller_enquiry_stats', 'get_recent_enquiries',
    'get_enquiries_by_date_range', 'respond_to_enquiry',
    
    # Order functions
    'get_order_by_id', 'get_all_orders', 'get_orders_by_buyer',
    'get_orders_by_seller', 'get_orders_by_transporter',
    'get_orders_by_status', 'get_requested_orders', 'get_picked_orders',
    'get_in_transit_orders', 'get_delivered_orders', 'get_available_jobs',
    'get_orders_with_details', 'get_orders_by_buyer_with_details',
    'get_orders_by_seller_with_details', 'get_orders_by_transporter_with_details',
    'search_orders', 'get_order_stats', 'get_buyer_order_stats',
    'get_seller_order_stats', 'get_transporter_order_stats',
    'get_recent_orders', 'get_orders_by_date_range', 'get_orders_by_enquiry',
    
    # Message functions
    'get_message_by_id', 'get_all_messages', 'get_messages_by_enquiry',
    'get_messages_by_sender', 'get_messages_by_user', 'get_messages_with_details',
    'get_messages_by_enquiry_with_details', 'get_messages_by_sender_with_details',
    'get_messages_by_user_with_details', 'search_messages', 'get_recent_messages',
    'get_messages_by_date_range', 'get_message_stats', 'get_user_message_stats',
    'get_enquiry_message_stats', 'get_conversation_messages', 'get_unread_messages_count',
    
    # Transaction functions
    'get_transaction_by_id', 'get_all_transactions', 'get_transaction_by_order',
    'get_transactions_by_buyer', 'get_transactions_by_seller',
    'get_transactions_by_transporter', 'get_transactions_with_details',
    'get_transactions_by_buyer_with_details', 'get_transactions_by_seller_with_details',
    'get_transactions_by_transporter_with_details', 'get_transactions_by_amount_range',
    'search_transactions', 'get_transaction_stats', 'get_buyer_transaction_stats',
    'get_seller_transaction_stats', 'get_transporter_transaction_stats',
    'get_recent_transactions', 'get_transactions_by_date_range',
    'get_transactions_by_invoice_number', 'get_high_value_transactions',
    'get_transaction_summary_by_period',
    
    # Audit log functions
    'get_audit_log_by_id', 'get_all_audit_logs', 'get_audit_logs_by_user',
    'get_audit_logs_by_action', 'get_audit_logs_with_user_details',
    'get_audit_logs_by_user_with_details', 'search_audit_logs',
    'get_recent_audit_logs', 'get_audit_logs_by_date_range',
    'get_audit_log_stats', 'get_user_audit_stats', 'get_action_audit_stats',
    'get_audit_logs_by_action_type', 'get_user_activity_summary',
    'get_system_activity_summary', 'get_audit_logs_by_details_key',
    'get_audit_logs_by_details_contains',
    
    # Route functions
    'get_route_by_id', 'get_all_routes', 'get_routes_by_transporter',
    'get_routes_by_origin', 'get_routes_by_destination', 'get_routes_by_location',
    'get_routes_with_transporter_details', 'get_routes_by_transporter_with_details',
    'search_routes', 'get_route_stats', 'get_transporter_route_stats',
    'get_recent_routes', 'get_routes_by_date_range', 'get_popular_routes',
    'get_route_network', 'get_transporter_route_network', 'find_common_routes',
    'get_route_suggestions'
] 