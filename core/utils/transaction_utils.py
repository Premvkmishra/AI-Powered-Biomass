from django.db.models import Q, Count, Sum, Avg
from typing import Optional, List, Dict, Any
from ..models import Transaction, Order, User

def get_transaction_by_id(transaction_id: int) -> Optional[Transaction]:
    """Get transaction by ID"""
    try:
        return Transaction.objects.get(id=transaction_id)
    except Transaction.DoesNotExist:
        return None

def get_all_transactions() -> List[Transaction]:
    """Get all transactions"""
    return Transaction.objects.all()

def get_transaction_by_order(order_id: int) -> Optional[Transaction]:
    """Get transaction by order ID"""
    try:
        return Transaction.objects.get(order_id=order_id)
    except Transaction.DoesNotExist:
        return None

def get_transactions_by_buyer(buyer_id: int) -> List[Transaction]:
    """Get transactions by buyer ID"""
    return Transaction.objects.filter(order__enquiry__buyer_id=buyer_id)

def get_transactions_by_seller(seller_id: int) -> List[Transaction]:
    """Get transactions for products by seller ID"""
    return Transaction.objects.filter(order__enquiry__product__seller_id=seller_id)

def get_transactions_by_transporter(transporter_id: int) -> List[Transaction]:
    """Get transactions by transporter ID"""
    return Transaction.objects.filter(order__transporter_id=transporter_id)

def get_transactions_with_details() -> List[Transaction]:
    """Get transactions with all related details"""
    return Transaction.objects.select_related(
        'order', 'order__enquiry', 'order__enquiry__buyer', 
        'order__enquiry__product', 'order__enquiry__product__seller', 'order__transporter'
    ).all()

def get_transactions_by_buyer_with_details(buyer_id: int) -> List[Transaction]:
    """Get transactions by buyer with details"""
    return Transaction.objects.select_related(
        'order', 'order__enquiry', 'order__enquiry__buyer', 
        'order__enquiry__product', 'order__enquiry__product__seller', 'order__transporter'
    ).filter(order__enquiry__buyer_id=buyer_id)

def get_transactions_by_seller_with_details(seller_id: int) -> List[Transaction]:
    """Get transactions by seller with details"""
    return Transaction.objects.select_related(
        'order', 'order__enquiry', 'order__enquiry__buyer', 
        'order__enquiry__product', 'order__enquiry__product__seller', 'order__transporter'
    ).filter(order__enquiry__product__seller_id=seller_id)

def get_transactions_by_transporter_with_details(transporter_id: int) -> List[Transaction]:
    """Get transactions by transporter with details"""
    return Transaction.objects.select_related(
        'order', 'order__enquiry', 'order__enquiry__buyer', 
        'order__enquiry__product', 'order__enquiry__product__seller', 'order__transporter'
    ).filter(order__transporter_id=transporter_id)

def get_transactions_by_amount_range(min_amount: float, max_amount: float) -> List[Transaction]:
    """Get transactions within amount range"""
    return Transaction.objects.filter(amount__gte=min_amount, amount__lte=max_amount)

def search_transactions(query: str) -> List[Transaction]:
    """Search transactions by invoice number or user emails"""
    return Transaction.objects.filter(
        Q(invoice_number__icontains=query) |
        Q(order__enquiry__buyer__email__icontains=query) |
        Q(order__enquiry__product__seller__email__icontains=query) |
        Q(order__transporter__email__icontains=query)
    )

def get_transaction_stats() -> Dict[str, Any]:
    """Get transaction statistics"""
    total_transactions = Transaction.objects.count()
    total_amount = Transaction.objects.aggregate(total_amount=Sum('amount'))
    avg_amount = Transaction.objects.aggregate(avg_amount=Avg('amount'))
    
    return {
        'total_transactions': total_transactions,
        'total_amount': total_amount['total_amount'],
        'average_amount': avg_amount['avg_amount']
    }

def get_buyer_transaction_stats(buyer_id: int) -> Dict[str, Any]:
    """Get transaction statistics for a specific buyer"""
    transactions = Transaction.objects.filter(order__enquiry__buyer_id=buyer_id)
    total_transactions = transactions.count()
    total_amount = transactions.aggregate(total_amount=Sum('amount'))
    avg_amount = transactions.aggregate(avg_amount=Avg('amount'))
    
    return {
        'total_transactions': total_transactions,
        'total_amount': total_amount['total_amount'],
        'average_amount': avg_amount['avg_amount']
    }

def get_seller_transaction_stats(seller_id: int) -> Dict[str, Any]:
    """Get transaction statistics for a specific seller"""
    transactions = Transaction.objects.filter(order__enquiry__product__seller_id=seller_id)
    total_transactions = transactions.count()
    total_amount = transactions.aggregate(total_amount=Sum('amount'))
    avg_amount = transactions.aggregate(avg_amount=Avg('amount'))
    
    return {
        'total_transactions': total_transactions,
        'total_amount': total_amount['total_amount'],
        'average_amount': avg_amount['avg_amount']
    }

def get_transporter_transaction_stats(transporter_id: int) -> Dict[str, Any]:
    """Get transaction statistics for a specific transporter"""
    transactions = Transaction.objects.filter(order__transporter_id=transporter_id)
    total_transactions = transactions.count()
    total_amount = transactions.aggregate(total_amount=Sum('amount'))
    avg_amount = transactions.aggregate(avg_amount=Avg('amount'))
    
    return {
        'total_transactions': total_transactions,
        'total_amount': total_amount['total_amount'],
        'average_amount': avg_amount['avg_amount']
    }

def get_recent_transactions(limit: int = 10) -> List[Transaction]:
    """Get most recent transactions"""
    return Transaction.objects.order_by('-created_at')[:limit]

def get_transactions_by_date_range(start_date, end_date) -> List[Transaction]:
    """Get transactions created within date range"""
    return Transaction.objects.filter(created_at__range=[start_date, end_date])

def get_transactions_by_invoice_number(invoice_number: str) -> List[Transaction]:
    """Get transactions by invoice number"""
    return Transaction.objects.filter(invoice_number__icontains=invoice_number)

def get_high_value_transactions(min_amount: float) -> List[Transaction]:
    """Get transactions above minimum amount"""
    return Transaction.objects.filter(amount__gte=min_amount)

def get_transaction_summary_by_period(start_date, end_date) -> Dict[str, Any]:
    """Get transaction summary for a specific period"""
    transactions = Transaction.objects.filter(created_at__range=[start_date, end_date])
    total_transactions = transactions.count()
    total_amount = transactions.aggregate(total_amount=Sum('amount'))
    avg_amount = transactions.aggregate(avg_amount=Avg('amount'))
    
    return {
        'period_start': start_date,
        'period_end': end_date,
        'total_transactions': total_transactions,
        'total_amount': total_amount['total_amount'],
        'average_amount': avg_amount['avg_amount']
    } 