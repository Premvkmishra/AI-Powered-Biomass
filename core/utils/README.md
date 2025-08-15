# Tivra Platform Utility Functions

This directory contains utility functions for database operations in the Tivra Platform. These functions provide a clean, reusable interface for fetching data from the database.

## Structure

```
core/utils/
├── __init__.py
├── all_utils.py          # Comprehensive import file
├── user_utils.py         # User-related functions
├── product_utils.py      # Product-related functions
├── enquiry_utils.py      # Enquiry-related functions
├── order_utils.py        # Order-related functions
├── message_utils.py      # Message-related functions
├── transaction_utils.py  # Transaction-related functions
├── audit_utils.py        # Audit log-related functions
├── route_utils.py        # Route-related functions
├── example_usage.py      # Usage examples
└── README.md            # This file
```

## Quick Start

### Import Utility Functions

```python
# Import all utility functions
from core.utils.all_utils import (
    get_user_by_id,
    get_all_products,
    get_enquiries_by_buyer,
    get_available_jobs
)

# Or import specific modules
from core.utils.user_utils import get_user_by_id, get_users_by_role
from core.utils.product_utils import get_all_products, get_products_by_seller
```

### Basic Usage

```python
# Get a user by ID
user = get_user_by_id(1)

# Get all products
products = get_all_products()

# Get enquiries for a buyer
enquiries = get_enquiries_by_buyer(buyer_id=5)

# Get available jobs for transporters
jobs = get_available_jobs()
```

## Available Functions

### User Functions (`user_utils.py`)

- `get_user_by_id(user_id)` - Get user by ID
- `get_user_by_email(email)` - Get user by email
- `get_users_by_role(role)` - Get users by role
- `get_verified_users()` - Get all verified users
- `get_user_stats()` - Get user statistics
- `search_users(query)` - Search users by email/username

### Product Functions (`product_utils.py`)

- `get_product_by_id(product_id)` - Get product by ID
- `get_all_products()` - Get all products
- `get_products_by_seller(seller_id)` - Get products by seller
- `get_products_by_commodity_type(type)` - Get products by commodity type
- `get_product_stats()` - Get product statistics
- `search_products(query)` - Search products

### Enquiry Functions (`enquiry_utils.py`)

- `get_enquiry_by_id(enquiry_id)` - Get enquiry by ID
- `get_enquiries_by_buyer(buyer_id)` - Get enquiries by buyer
- `get_enquiries_by_seller(seller_id)` - Get enquiries by seller
- `get_pending_enquiries()` - Get pending enquiries
- `get_enquiry_stats()` - Get enquiry statistics

### Order Functions (`order_utils.py`)

- `get_order_by_id(order_id)` - Get order by ID
- `get_orders_by_buyer(buyer_id)` - Get orders by buyer
- `get_orders_by_transporter(transporter_id)` - Get orders by transporter
- `get_available_jobs()` - Get available jobs for transporters
- `get_order_stats()` - Get order statistics

### Message Functions (`message_utils.py`)

- `get_message_by_id(message_id)` - Get message by ID
- `get_messages_by_enquiry(enquiry_id)` - Get messages for enquiry
- `get_messages_by_user(user_id)` - Get messages by user
- `get_conversation_messages(enquiry_id, user_id)` - Get conversation messages

### Transaction Functions (`transaction_utils.py`)

- `get_transaction_by_id(transaction_id)` - Get transaction by ID
- `get_transactions_by_buyer(buyer_id)` - Get transactions by buyer
- `get_transaction_stats()` - Get transaction statistics
- `get_high_value_transactions(min_amount)` - Get high-value transactions

### Audit Log Functions (`audit_utils.py`)

- `get_audit_log_by_id(audit_log_id)` - Get audit log by ID
- `get_audit_logs_by_user(user_id)` - Get audit logs by user
- `get_user_activity_summary(user_id)` - Get user activity summary
- `get_system_activity_summary()` - Get system activity summary

### Route Functions (`route_utils.py`)

- `get_route_by_id(route_id)` - Get route by ID
- `get_routes_by_transporter(transporter_id)` - Get routes by transporter
- `get_popular_routes(limit)` - Get popular routes
- `get_route_network()` - Get route network information

## Usage in Views

### Simple Example

```python
from rest_framework.decorators import api_view
from rest_framework.response import Response
from core.utils.all_utils import get_user_by_id, get_products_by_seller

@api_view(['GET'])
def get_seller_dashboard(request, seller_id):
    # Get seller info
    seller = get_user_by_id(seller_id)
    
    # Get seller's products
    products = get_products_by_seller(seller_id)
    
    return Response({
        'seller': {
            'id': seller.id,
            'email': seller.email,
            'role': seller.role
        },
        'products': [
            {
                'id': product.id,
                'commodity_type': product.commodity_type,
                'price': product.price
            }
            for product in products
        ]
    })
```

### Advanced Example

```python
from core.utils.all_utils import (
    get_user_stats, get_product_stats, get_enquiry_stats,
    get_order_stats, get_transaction_stats
)

@api_view(['GET'])
def get_admin_dashboard(request):
    """Get comprehensive admin dashboard stats"""
    
    return Response({
        'user_stats': get_user_stats(),
        'product_stats': get_product_stats(),
        'enquiry_stats': get_enquiry_stats(),
        'order_stats': get_order_stats(),
        'transaction_stats': get_transaction_stats()
    })
```

## Benefits

1. **Reusability** - Functions can be used across multiple views
2. **Consistency** - Standardized way to fetch data
3. **Maintainability** - Easy to update database queries in one place
4. **Performance** - Optimized queries with select_related and prefetch_related
5. **Type Safety** - Functions include type hints for better IDE support

## Best Practices

1. **Import what you need** - Only import the functions you actually use
2. **Use with_details functions** - When you need related data, use the `_with_details` variants
3. **Handle None returns** - Always check if functions return None before using the result
4. **Use statistics functions** - For dashboard data, use the `_stats` functions
5. **Combine functions** - Chain multiple utility functions for complex queries

## Error Handling

All utility functions handle database exceptions gracefully:

```python
# Functions return None if object not found
user = get_user_by_id(999)
if user is None:
    return Response({'error': 'User not found'}, status=404)

# Functions return empty lists if no matches
products = get_products_by_seller(999)
# products will be an empty list, not None
```

## Performance Tips

1. Use `_with_details` functions when you need related data to avoid N+1 queries
2. Use statistics functions for dashboard data instead of counting manually
3. Use search functions for text-based queries
4. Use date range functions for time-based filtering

## Adding New Functions

To add new utility functions:

1. Create the function in the appropriate `*_utils.py` file
2. Add it to the imports in `all_utils.py`
3. Add it to the `__all__` list in `all_utils.py`
4. Update this README with documentation

Example:

```python
# In user_utils.py
def get_users_by_verification_status(is_verified: bool) -> List[User]:
    """Get users by verification status"""
    return User.objects.filter(is_verified=is_verified)

# In all_utils.py
from .user_utils import (
    # ... existing imports ...
    get_users_by_verification_status
)

__all__ = [
    # ... existing exports ...
    'get_users_by_verification_status'
]
``` 