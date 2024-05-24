from ninja import NinjaAPI
from .schemas import ProductSchema, CategorySchema
from .models import Product, Category

api = NinjaAPI()

@api.get('/list_menu', response=list[CategorySchema])
def list_product(request):
    menu = Category.objects.all()
    return menu
