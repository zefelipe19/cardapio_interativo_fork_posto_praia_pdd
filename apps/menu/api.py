from django.db.models import Q
from ninja import NinjaAPI
from .schemas import ProductSchema, CategorySchema
from .models import Product, Category

api = NinjaAPI()

@api.get('/list_menu', response=list[CategorySchema])
def list_product(request):
    menu = Category.objects.all()
    return menu


@api.get('/list_promos', response=list[ProductSchema])
def list_promos(request):
    promos = Product.objects.filter(Q(is_active=True) & Q(is_promo=True) & Q(promotional_price__gt=1)).filter().all()
    return promos
