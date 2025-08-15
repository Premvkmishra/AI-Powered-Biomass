"""
URL configuration for tivra_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import (
    UserViewSet, ProfileViewSet, ProductViewSet, EnquiryViewSet, MessageViewSet,
    OrderViewSet, TransactionViewSet, AuditLogViewSet, RouteViewSet
)
from core import views as core_views
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import permissions as drf_permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'profiles', ProfileViewSet)
router.register(r'products', ProductViewSet)
router.register(r'enquiries', EnquiryViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'audit-logs', AuditLogViewSet)
router.register(r'routes', RouteViewSet)

schema_view = get_schema_view(
    openapi.Info(
        title="Tivra Platform API",
        default_version='v1',
        description="API documentation for the Tivra digital marketplace platform.",
    ),
    public=True,
    permission_classes=(drf_permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/register/', core_views.register, name='register'),
    path('api/auth/login/', core_views.login, name='login'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

urlpatterns += [
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]
