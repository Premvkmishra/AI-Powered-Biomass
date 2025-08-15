from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, Profile, Product, Enquiry, Message, Order, Transaction, AuditLog, Route
from .serializers import (
    UserSerializer, ProfileSerializer, ProductSerializer, EnquirySerializer,
    MessageSerializer, OrderSerializer, TransactionSerializer, AuditLogSerializer, RouteSerializer
)
from .permissions import IsBuyer, IsSeller, IsTransporter, IsAdmin
import logging
logger = logging.getLogger(__name__)
from rest_framework.permissions import AllowAny, IsAuthenticated
from core.utils.product_utils import update_product, delete_product
from core.utils.enquiry_utils import get_enquiry_by_id, respond_to_enquiry

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"UserViewSet list error: {str(e)}", exc_info=True)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"UserViewSet create error: {str(e)}", exc_info=True)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=True, methods=['patch'], permission_classes=[IsSeller|IsAdmin])
    def update_product(self, request, pk=None):
        data = request.data
        product = update_product(pk, data)
        if product:
            return Response(ProductSerializer(product).data)
        return Response({'error': 'Product not found'}, status=404)

    @action(detail=True, methods=['delete'], permission_classes=[IsSeller|IsAdmin])
    def delete_product(self, request, pk=None):
        deleted = delete_product(pk)
        if deleted:
            return Response({'success': True})
        return Response({'error': 'Product not found'}, status=404)

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def details(self, request, pk=None):
        product = self.get_object()
        return Response(ProductSerializer(product).data)

class EnquiryViewSet(viewsets.ModelViewSet):
    queryset = Enquiry.objects.all()
    serializer_class = EnquirySerializer
    permission_classes = [IsBuyer|IsSeller|IsAdmin]

    @action(detail=True, methods=['patch'], permission_classes=[IsSeller|IsAdmin])
    def respond(self, request, pk=None):
        status_update = request.data.get('status')
        message = request.data.get('message')
        enquiry = respond_to_enquiry(pk, status_update, message, request.user)
        if not enquiry:
            return Response({'error': 'Enquiry not found'}, status=404)
        return Response(EnquirySerializer(enquiry).data)

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsBuyer|IsSeller|IsAdmin]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsBuyer|IsSeller|IsTransporter|IsAdmin]

    @action(detail=False, methods=['get'], permission_classes=[IsTransporter])
    def available_jobs(self, request):
        jobs = Order.objects.filter(status='Requested', transporter__isnull=True)
        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data)

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsBuyer|IsSeller|IsAdmin]

class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdmin]

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    permission_classes = [IsTransporter|IsAdmin]

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    try:
        data = request.data
        required_fields = ['email', 'username', 'password', 'role', 'gst_number', 'kyc_document', 'location', 'contact_info']
        for field in required_fields:
            if field not in data:
                logger.warning(f"Registration missing field: {field}")
                return Response({'error': f'Missing field: {field}'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=data['email']).exists():
            logger.warning(f"Registration email exists: {data['email']}")
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        if data['role'] not in ['Buyer', 'Seller', 'Transporter', 'Admin']:
            logger.warning(f"Registration invalid role: {data['role']}")
            return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(
            email=data['email'],
            username=data['username'],
            password=data['password'],
            role=data['role']
        )
        Profile.objects.filter(user=user).update(
            gst_number=data['gst_number'],
            kyc_document=data['kyc_document'],
            location=data['location'],
            contact_info=data['contact_info']
        )
        refresh = RefreshToken.for_user(user)
        logger.info(f"User registered: {user.email}")
        return Response({
            'user_id': user.id,
            'email': user.email,
            'role': user.role,
            'token': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Registration failed: {str(e)}", exc_info=True)
        return Response({'error': f'Registration failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    try:
        data = request.data
        email = data.get('email')
        password = data.get('password')
        user = authenticate(request, email=email, password=password)
        if user is None:
            logger.warning(f"Login failed for email: {email}")
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        refresh = RefreshToken.for_user(user)
        logger.info(f"User logged in: {user.email}")
        return Response({
            'user_id': user.id,
            'email': user.email,
            'role': user.role,
            'token': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
    except Exception as e:
        logger.error(f"Login failed: {str(e)}", exc_info=True)
        return Response({'error': f'Login failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from rest_framework_simplejwt.views import TokenRefreshView
