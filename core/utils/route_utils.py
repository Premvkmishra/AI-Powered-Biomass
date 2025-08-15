from django.db.models import Q, Count
from typing import Optional, List, Dict, Any
from ..models import Route, User

def get_route_by_id(route_id: int) -> Optional[Route]:
    """Get route by ID"""
    try:
        return Route.objects.get(id=route_id)
    except Route.DoesNotExist:
        return None

def get_all_routes() -> List[Route]:
    """Get all routes"""
    return Route.objects.all()

def get_routes_by_transporter(transporter_id: int) -> List[Route]:
    """Get routes by transporter ID"""
    return Route.objects.filter(transporter_id=transporter_id)

def get_routes_by_origin(origin: str) -> List[Route]:
    """Get routes by origin"""
    return Route.objects.filter(origin__icontains=origin)

def get_routes_by_destination(destination: str) -> List[Route]:
    """Get routes by destination"""
    return Route.objects.filter(destination__icontains=destination)

def get_routes_by_location(location: str) -> List[Route]:
    """Get routes that pass through a specific location"""
    return Route.objects.filter(
        Q(origin__icontains=location) |
        Q(destination__icontains=location)
    )

def get_routes_with_transporter_details() -> List[Route]:
    """Get routes with transporter details"""
    return Route.objects.select_related('transporter').all()

def get_routes_by_transporter_with_details(transporter_id: int) -> List[Route]:
    """Get routes by transporter with details"""
    return Route.objects.select_related('transporter').filter(transporter_id=transporter_id)

def search_routes(query: str) -> List[Route]:
    """Search routes by origin, destination, or transporter email"""
    return Route.objects.filter(
        Q(origin__icontains=query) |
        Q(destination__icontains=query) |
        Q(transporter__email__icontains=query)
    )

def get_route_stats() -> Dict[str, Any]:
    """Get route statistics"""
    total_routes = Route.objects.count()
    total_transporters = Route.objects.values('transporter').distinct().count()
    
    return {
        'total_routes': total_routes,
        'total_transporters': total_transporters
    }

def get_transporter_route_stats(transporter_id: int) -> Dict[str, Any]:
    """Get route statistics for a specific transporter"""
    routes = Route.objects.filter(transporter_id=transporter_id)
    total_routes = routes.count()
    
    # Get unique origins and destinations
    unique_origins = routes.values('origin').distinct().count()
    unique_destinations = routes.values('destination').distinct().count()
    
    return {
        'total_routes': total_routes,
        'unique_origins': unique_origins,
        'unique_destinations': unique_destinations
    }

def get_recent_routes(limit: int = 10) -> List[Route]:
    """Get most recent routes"""
    return Route.objects.order_by('-created_at')[:limit]

def get_routes_by_date_range(start_date, end_date) -> List[Route]:
    """Get routes created within date range"""
    return Route.objects.filter(created_at__range=[start_date, end_date])

def get_popular_routes(limit: int = 10) -> List[Dict[str, Any]]:
    """Get most popular routes (routes with most transporters)"""
    routes = Route.objects.values('origin', 'destination').annotate(
        transporter_count=Count('transporter', distinct=True)
    ).order_by('-transporter_count')[:limit]
    
    return list(routes)

def get_route_network() -> Dict[str, Any]:
    """Get route network information"""
    total_routes = Route.objects.count()
    unique_origins = Route.objects.values('origin').distinct().count()
    unique_destinations = Route.objects.values('destination').distinct().count()
    
    # Get all unique locations
    all_locations = set()
    for route in Route.objects.all():
        all_locations.add(route.origin)
        all_locations.add(route.destination)
    
    return {
        'total_routes': total_routes,
        'unique_origins': unique_origins,
        'unique_destinations': unique_destinations,
        'total_locations': len(all_locations),
        'locations': list(all_locations)
    }

def get_transporter_route_network(transporter_id: int) -> Dict[str, Any]:
    """Get route network information for a specific transporter"""
    routes = Route.objects.filter(transporter_id=transporter_id)
    total_routes = routes.count()
    
    # Get unique locations for this transporter
    locations = set()
    for route in routes:
        locations.add(route.origin)
        locations.add(route.destination)
    
    return {
        'total_routes': total_routes,
        'total_locations': len(locations),
        'locations': list(locations)
    }

def find_common_routes(transporter1_id: int, transporter2_id: int) -> List[Route]:
    """Find routes that are common between two transporters"""
    routes1 = Route.objects.filter(transporter_id=transporter1_id)
    routes2 = Route.objects.filter(transporter_id=transporter2_id)
    
    common_routes = []
    for route1 in routes1:
        for route2 in routes2:
            if (route1.origin == route2.origin and route1.destination == route2.destination):
                common_routes.append(route1)
                break
    
    return common_routes

def get_route_suggestions(origin: str, destination: str) -> List[Route]:
    """Get route suggestions based on origin and destination"""
    return Route.objects.filter(
        Q(origin__icontains=origin) |
        Q(destination__icontains=destination)
    ).select_related('transporter') 