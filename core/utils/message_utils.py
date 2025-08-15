from django.db.models import Q, Count
from typing import Optional, List, Dict, Any
from ..models import Message, Enquiry, User

def get_message_by_id(message_id: int) -> Optional[Message]:
    """Get message by ID"""
    try:
        return Message.objects.get(id=message_id)
    except Message.DoesNotExist:
        return None

def get_all_messages() -> List[Message]:
    """Get all messages"""
    return Message.objects.all()

def get_messages_by_enquiry(enquiry_id: int) -> List[Message]:
    """Get messages for specific enquiry"""
    return Message.objects.filter(enquiry_id=enquiry_id)

def get_messages_by_sender(sender_id: int) -> List[Message]:
    """Get messages by sender ID"""
    return Message.objects.filter(sender_id=sender_id)

def get_messages_by_user(user_id: int) -> List[Message]:
    """Get messages where user is either sender or part of enquiry"""
    return Message.objects.filter(
        Q(sender_id=user_id) |
        Q(enquiry__buyer_id=user_id) |
        Q(enquiry__product__seller_id=user_id)
    )

def get_messages_with_details() -> List[Message]:
    """Get messages with sender and enquiry details"""
    return Message.objects.select_related('sender', 'enquiry', 'enquiry__buyer', 'enquiry__product').all()

def get_messages_by_enquiry_with_details(enquiry_id: int) -> List[Message]:
    """Get messages for enquiry with details"""
    return Message.objects.select_related('sender', 'enquiry', 'enquiry__buyer', 'enquiry__product').filter(enquiry_id=enquiry_id)

def get_messages_by_sender_with_details(sender_id: int) -> List[Message]:
    """Get messages by sender with details"""
    return Message.objects.select_related('sender', 'enquiry', 'enquiry__buyer', 'enquiry__product').filter(sender_id=sender_id)

def get_messages_by_user_with_details(user_id: int) -> List[Message]:
    """Get messages where user is involved with details"""
    return Message.objects.select_related('sender', 'enquiry', 'enquiry__buyer', 'enquiry__product').filter(
        Q(sender_id=user_id) |
        Q(enquiry__buyer_id=user_id) |
        Q(enquiry__product__seller_id=user_id)
    )

def search_messages(query: str) -> List[Message]:
    """Search messages by content or sender email"""
    return Message.objects.filter(
        Q(content__icontains=query) |
        Q(sender__email__icontains=query)
    )

def get_recent_messages(limit: int = 10) -> List[Message]:
    """Get most recent messages"""
    return Message.objects.order_by('-timestamp')[:limit]

def get_messages_by_date_range(start_date, end_date) -> List[Message]:
    """Get messages within date range"""
    return Message.objects.filter(timestamp__range=[start_date, end_date])

def get_message_stats() -> Dict[str, Any]:
    """Get message statistics"""
    total_messages = Message.objects.count()
    total_enquiries_with_messages = Message.objects.values('enquiry').distinct().count()
    total_senders = Message.objects.values('sender').distinct().count()
    
    return {
        'total_messages': total_messages,
        'total_enquiries_with_messages': total_enquiries_with_messages,
        'total_senders': total_senders
    }

def get_user_message_stats(user_id: int) -> Dict[str, Any]:
    """Get message statistics for a specific user"""
    sent_messages = Message.objects.filter(sender_id=user_id).count()
    received_messages = Message.objects.filter(
        Q(enquiry__buyer_id=user_id) |
        Q(enquiry__product__seller_id=user_id)
    ).exclude(sender_id=user_id).count()
    
    total_enquiries_involved = Message.objects.filter(
        Q(enquiry__buyer_id=user_id) |
        Q(enquiry__product__seller_id=user_id)
    ).values('enquiry').distinct().count()
    
    return {
        'sent_messages': sent_messages,
        'received_messages': received_messages,
        'total_enquiries_involved': total_enquiries_involved
    }

def get_enquiry_message_stats(enquiry_id: int) -> Dict[str, Any]:
    """Get message statistics for a specific enquiry"""
    messages = Message.objects.filter(enquiry_id=enquiry_id)
    total_messages = messages.count()
    unique_senders = messages.values('sender').distinct().count()
    
    return {
        'total_messages': total_messages,
        'unique_senders': unique_senders
    }

def get_conversation_messages(enquiry_id: int, user_id: int) -> List[Message]:
    """Get messages for a conversation where user is involved"""
    return Message.objects.filter(
        enquiry_id=enquiry_id
    ).filter(
        Q(sender_id=user_id) |
        Q(enquiry__buyer_id=user_id) |
        Q(enquiry__product__seller_id=user_id)
    ).order_by('timestamp')

def get_unread_messages_count(user_id: int) -> int:
    """Get count of unread messages for user (placeholder for future implementation)"""
    # This is a placeholder - you might want to add a 'read' field to Message model
    return Message.objects.filter(
        Q(enquiry__buyer_id=user_id) |
        Q(enquiry__product__seller_id=user_id)
    ).exclude(sender_id=user_id).count() 