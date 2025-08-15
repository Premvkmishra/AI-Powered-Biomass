from django.db.models import Q, Avg, Count, Sum
from typing import Optional, List, Dict, Any
from ..models import Product, User

def get_product_by_id(product_id: int) -> Optional[Product]:
    """Get product by ID"""
    try:
        return Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return None

def get_all_products() -> List[Product]:
    """Get all products"""
    return Product.objects.all()

def get_products_by_seller(seller_id: int) -> List[Product]:
    """Get products by seller ID"""
    return Product.objects.filter(seller_id=seller_id)

def get_products_by_commodity_type(commodity_type: str) -> List[Product]:
    """Get products by commodity type"""
    return Product.objects.filter(commodity_type=commodity_type)

def get_products_by_location(location: str) -> List[Product]:
    """Get products by pickup location"""
    return Product.objects.filter(pickup_location__icontains=location)

def get_products_by_price_range(min_price: float, max_price: float) -> List[Product]:
    """Get products within price range"""
    return Product.objects.filter(price__gte=min_price, price__lte=max_price)

def get_products_by_quantity_range(min_quantity: float, max_quantity: float) -> List[Product]:
    """Get products within quantity range"""
    return Product.objects.filter(quantity__gte=min_quantity, quantity__lte=max_quantity)

def search_products(query: str) -> List[Product]:
    """Search products by commodity type or pickup location"""
    return Product.objects.filter(
        Q(commodity_type__icontains=query) |
        Q(pickup_location__icontains=query)
    )

def get_products_with_seller_info() -> List[Product]:
    """Get products with seller information"""
    return Product.objects.select_related('seller').all()

def get_products_by_seller_with_info(seller_id: int) -> List[Product]:
    """Get products by seller with seller information"""
    return Product.objects.select_related('seller').filter(seller_id=seller_id)

def get_available_products() -> List[Product]:
    """Get products that are currently available"""
    return Product.objects.filter(quantity__gt=0)

def get_products_by_unit(unit: str) -> List[Product]:
    """Get products by unit of measure"""
    return Product.objects.filter(unit_of_measure=unit)

def get_product_stats() -> Dict[str, Any]:
    """Get product statistics"""
    total_products = Product.objects.count()
    total_sellers = Product.objects.values('seller').distinct().count()
    
    commodity_stats = {}
    for commodity in ['Biomass', 'Briquettes', 'Biodiesel']:
        commodity_stats[commodity] = Product.objects.filter(commodity_type=commodity).count()
    
    avg_price = Product.objects.aggregate(avg_price=Avg('price'))
    total_quantity = Product.objects.aggregate(total_quantity=Sum('quantity'))
    
    return {
        'total_products': total_products,
        'total_sellers': total_sellers,
        'commodity_stats': commodity_stats,
        'average_price': avg_price['avg_price'],
        'total_quantity': total_quantity['total_quantity']
    }

def get_seller_products_with_stats(seller_id: int) -> Dict[str, Any]:
    """Get seller's products with statistics"""
    products = Product.objects.filter(seller_id=seller_id)
    total_products = products.count()
    total_value = products.aggregate(total_value=Sum('price'))
    avg_price = products.aggregate(avg_price=Avg('price'))
    
    commodity_distribution = {}
    for commodity in ['Biomass', 'Briquettes', 'Biodiesel']:
        commodity_distribution[commodity] = products.filter(commodity_type=commodity).count()
    
    return {
        'products': products,
        'total_products': total_products,
        'total_value': total_value['total_value'],
        'average_price': avg_price['avg_price'],
        'commodity_distribution': commodity_distribution
    }

def get_products_by_date_range(start_date, end_date) -> List[Product]:
    """Get products created within date range"""
    return Product.objects.filter(created_at__range=[start_date, end_date])

def get_recent_products(limit: int = 10) -> List[Product]:
    """Get most recent products"""
    return Product.objects.order_by('-created_at')[:limit]

def get_products_by_rating(min_rating: float) -> List[Product]:
    """Get products from sellers with minimum rating"""
    return Product.objects.filter(seller__profile__rating__gte=min_rating) 

def update_product(product_id: int, data: dict) -> Optional[Product]:
    """Update a product by ID with the given data dict."""
    try:
        product = Product.objects.get(id=product_id)
        for key, value in data.items():
            setattr(product, key, value)
        product.save()
        return product
    except Product.DoesNotExist:
        return None

def delete_product(product_id: int) -> bool:
    """Delete a product by ID. Returns True if deleted, False if not found."""
    try:
        product = Product.objects.get(id=product_id)
        product.delete()
        return True
    except Product.DoesNotExist:
        return False 