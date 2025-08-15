from django.db.models import Q, Count
from typing import Optional, List, Dict, Any
from ..models import AuditLog, User

def get_audit_log_by_id(audit_log_id: int) -> Optional[AuditLog]:
    """Get audit log by ID"""
    try:
        return AuditLog.objects.get(id=audit_log_id)
    except AuditLog.DoesNotExist:
        return None

def get_all_audit_logs() -> List[AuditLog]:
    """Get all audit logs"""
    return AuditLog.objects.all()

def get_audit_logs_by_user(user_id: int) -> List[AuditLog]:
    """Get audit logs by user ID"""
    return AuditLog.objects.filter(user_id=user_id)

def get_audit_logs_by_action(action: str) -> List[AuditLog]:
    """Get audit logs by action"""
    return AuditLog.objects.filter(action=action)

def get_audit_logs_with_user_details() -> List[AuditLog]:
    """Get audit logs with user details"""
    return AuditLog.objects.select_related('user').all()

def get_audit_logs_by_user_with_details(user_id: int) -> List[AuditLog]:
    """Get audit logs by user with details"""
    return AuditLog.objects.select_related('user').filter(user_id=user_id)

def search_audit_logs(query: str) -> List[AuditLog]:
    """Search audit logs by action or user email"""
    return AuditLog.objects.filter(
        Q(action__icontains=query) |
        Q(user__email__icontains=query)
    )

def get_recent_audit_logs(limit: int = 10) -> List[AuditLog]:
    """Get most recent audit logs"""
    return AuditLog.objects.order_by('-timestamp')[:limit]

def get_audit_logs_by_date_range(start_date, end_date) -> List[AuditLog]:
    """Get audit logs within date range"""
    return AuditLog.objects.filter(timestamp__range=[start_date, end_date])

def get_audit_log_stats() -> Dict[str, Any]:
    """Get audit log statistics"""
    total_logs = AuditLog.objects.count()
    total_users = AuditLog.objects.values('user').distinct().count()
    total_actions = AuditLog.objects.values('action').distinct().count()
    
    return {
        'total_logs': total_logs,
        'total_users': total_users,
        'total_actions': total_actions
    }

def get_user_audit_stats(user_id: int) -> Dict[str, Any]:
    """Get audit log statistics for a specific user"""
    logs = AuditLog.objects.filter(user_id=user_id)
    total_logs = logs.count()
    unique_actions = logs.values('action').distinct().count()
    
    return {
        'total_logs': total_logs,
        'unique_actions': unique_actions
    }

def get_action_audit_stats(action: str) -> Dict[str, Any]:
    """Get audit log statistics for a specific action"""
    logs = AuditLog.objects.filter(action=action)
    total_logs = logs.count()
    unique_users = logs.values('user').distinct().count()
    
    return {
        'action': action,
        'total_logs': total_logs,
        'unique_users': unique_users
    }

def get_audit_logs_by_action_type(action_type: str) -> List[AuditLog]:
    """Get audit logs by action type (e.g., 'login', 'create', 'update', 'delete')"""
    return AuditLog.objects.filter(action__icontains=action_type)

def get_user_activity_summary(user_id: int) -> Dict[str, Any]:
    """Get user activity summary from audit logs"""
    logs = AuditLog.objects.filter(user_id=user_id)
    total_activities = logs.count()
    
    # Group by action type
    action_counts = {}
    for log in logs:
        action = log.action.split()[0] if log.action else 'unknown'  # Get first word of action
        action_counts[action] = action_counts.get(action, 0) + 1
    
    return {
        'user_id': user_id,
        'total_activities': total_activities,
        'action_breakdown': action_counts
    }

def get_system_activity_summary() -> Dict[str, Any]:
    """Get system-wide activity summary from audit logs"""
    total_logs = AuditLog.objects.count()
    
    # Group by action type
    action_counts = {}
    for log in AuditLog.objects.all():
        action = log.action.split()[0] if log.action else 'unknown'
        action_counts[action] = action_counts.get(action, 0) + 1
    
    return {
        'total_activities': total_logs,
        'action_breakdown': action_counts
    }

def get_audit_logs_by_details_key(key: str, value: str) -> List[AuditLog]:
    """Get audit logs where details JSON contains specific key-value pair"""
    return AuditLog.objects.filter(details__contains={key: value})

def get_audit_logs_by_details_contains(text: str) -> List[AuditLog]:
    """Get audit logs where details JSON contains specific text"""
    return AuditLog.objects.filter(details__icontains=text) 