from django.urls import path
from . import views as v

urlpatterns = [
    path('login/', v.login_view, name='login_user'),
    path('logout/', v.logout_view, name='logout_user')
]
