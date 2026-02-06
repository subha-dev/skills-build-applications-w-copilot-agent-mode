"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
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
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from . import views
import os

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'teams', views.TeamViewSet)
router.register(r'activities', views.ActivityViewSet)
router.register(r'leaderboard', views.LeaderboardViewSet)
router.register(r'workouts', views.WorkoutViewSet)

# API Root view
@api_view(['GET'])
def api_root(request):
    # Get Codespace name from environment variable
    codespace_name = os.environ.get('CODESPACE_NAME')
    
    # Build base URL based on environment
    if codespace_name:
        # Use HTTPS for Codespace URL to avoid certificate issues
        base_url = f'https://{codespace_name}-8000.app.github.dev/api'
    else:
        # Fall back to request's host for local development
        scheme = 'https' if request.is_secure() else 'http'
        base_url = f'{scheme}://{request.get_host()}/api'
    
    return Response({
        'users': f'{base_url}/users/',
        'teams': f'{base_url}/teams/',
        'activities': f'{base_url}/activities/',
        'leaderboard': f'{base_url}/leaderboard/',
        'workouts': f'{base_url}/workouts/',
    })

urlpatterns = [
    path('', api_root, name='api_root'),
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
]
