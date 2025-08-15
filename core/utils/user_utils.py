from django.contrib.auth import get_user_model
from django.db.models import Q
from typing import Optional, List, Dict, Any
from ..models import User, Profile

User = get_user_model()

def get_user_by_id(user_id: int) -> Optional[User]:
    """Get user by ID"""
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None

def get_user_by_email(email: str) -> Optional[User]:
    """Get user by email"""
    try:
        return User.objects.get(email=email)
    except User.DoesNotExist:
        return None

def get_user_by_username(username: str) -> Optional[User]:
    """Get user by username"""
    try:
        return User.objects.get(username=username)
    except User.DoesNotExist:
        return None

def get_all_users() -> List[User]:
    """Get all users"""
    return User.objects.all()

def get_users_by_role(role: str) -> List[User]:
    """Get users by role"""
    return User.objects.filter(role=role)

def get_verified_users() -> List[User]:
    """Get all verified users"""
    return User.objects.filter(is_verified=True)

def get_unverified_users() -> List[User]:
    """Get all unverified users"""
    return User.objects.filter(is_verified=False)

def search_users(query: str) -> List[User]:
    """Search users by email, username, or first/last name"""
    return User.objects.filter(
        Q(email__icontains=query) |
        Q(username__icontains=query) |
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query)
    )

def get_user_profile(user_id: int) -> Optional[Profile]:
    """Get user profile by user ID"""
    try:
        return Profile.objects.get(user_id=user_id)
    except Profile.DoesNotExist:
        return None

def get_user_with_profile(user_id: int) -> Optional[User]:
    """Get user with profile data"""
    try:
        return User.objects.select_related('profile').get(id=user_id)
    except User.DoesNotExist:
        return None

def get_users_with_profiles() -> List[User]:
    """Get all users with their profiles"""
    return User.objects.select_related('profile').all()

def get_users_by_location(location: str) -> List[User]:
    """Get users by location"""
    return User.objects.filter(profile__location__icontains=location)

def get_users_by_gst_number(gst_number: str) -> List[User]:
    """Get users by GST number"""
    return User.objects.filter(profile__gst_number=gst_number)

def get_active_users() -> List[User]:
    """Get active users (not staff, not superuser)"""
    return User.objects.filter(is_active=True, is_staff=False, is_superuser=False)

def get_user_stats() -> Dict[str, Any]:
    """Get user statistics"""
    total_users = User.objects.count()
    verified_users = User.objects.filter(is_verified=True).count()
    unverified_users = User.objects.filter(is_verified=False).count()
    
    role_stats = {}
    for role in ['Buyer', 'Seller', 'Transporter', 'Admin']:
        role_stats[role] = User.objects.filter(role=role).count()
    
    return {
        'total_users': total_users,
        'verified_users': verified_users,
        'unverified_users': unverified_users,
        'role_stats': role_stats
    } 