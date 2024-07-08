from django.urls import path
from .views import index, cart, admin

urlpatterns = [
    path('', index, name='index'),
    path('carrinho/', cart, name='cart'),
    path('cardapio/admin', admin, name='card_admin'),
]
