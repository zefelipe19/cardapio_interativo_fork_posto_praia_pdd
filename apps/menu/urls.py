from django.urls import path
from .views import index, cart

urlpatterns = [
    path('', index, name='index'),
    path('carrinho/', cart, name='cart'),
]
