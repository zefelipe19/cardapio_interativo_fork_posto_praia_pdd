from django.db.models import Q
from django.shortcuts import get_object_or_404
from ninja import NinjaAPI, File
from ninja.files import UploadedFile
from .schemas import ProductSchemaIn, ProductSchema, CategorySchemaIn, CategorySchemaMenu, CategorySchema
from .models import Product, Category

api = NinjaAPI()

@api.get('/list_menu', response=list[CategorySchemaMenu])
def list_product(request):
    menu = Category.objects.all()
    return menu

@api.get('/list_promos', response=list[ProductSchema])
def list_promos(request):
    promos = Product.objects.filter(Q(is_active=True) & Q(is_promo=True) & Q(promotional_price__gt=1)).filter().all()
    return promos

@api.get('/category', response=list[CategorySchema])
def list_categories(request):
    category = Category.objects.all()
    return category

@api.post('/category')
def create_category(request, payload: CategorySchemaIn):
    category = Category.objects.create(**payload.dict())
    return {"id": category.id, "title": category.title}

@api.delete('/category/{category_id}')
def delete_category(request, category_id: int):
    try:
        category = get_object_or_404(Category, id=category_id)
        category.delete()
        return {"deleted": category.title}
    except:
        return {"error": "cannot delete category with products"}

@api.post('/product')
def create_product(request, payload: ProductSchemaIn, image: UploadedFile = None):
    product_data = payload.dict()
    product_img = image
    product = Product.objects.create(
        category=Category.objects.get(id=product_data.pop("category", None)),
        **product_data,
        image=product_img
    )
    return {"category": product.category.title, "product": product.title}

@api.delete('/product/{product_id}')
def delete_product(request, product_id: int):
    product = get_object_or_404(Product, id=product_id)
    product.delete()
    return {"deleted": product.title}

@api.put('/product/{product_id}')
def update_product(request, product_id, payload):
    pass
