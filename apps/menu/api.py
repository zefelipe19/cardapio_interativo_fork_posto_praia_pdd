from django.db.models import Q
from django.shortcuts import get_object_or_404
from ninja import NinjaAPI, Body, File
from ninja.files import UploadedFile
from .schemas import ProductSchemaIn, ProductSchema, CategorySchemaIn, ProductSchemaUpdate, CategorySchemaMenu, CategorySchema, MessageSchema
from .models import Product, Category

api = NinjaAPI()

@api.get('/list_menu', response=list[CategorySchemaMenu])
def list_product(request):
    """
        Busca todas as categorias e seus respectivos produtos
    """
    menu = Category.objects.all()
    return menu

@api.get('/list_promos', response=list[ProductSchema])
def list_promos(request):
    """
        Busca todos os produtos cujo campo is_promo é verdadeiro e estão ativos com is_active
    """
    promos = Product.objects.filter(Q(is_active=True) & Q(is_promo=True) & Q(promotional_price__gt=1)).filter().all()
    return promos

@api.get('/category', response=list[CategorySchema])
def list_categories(request):
    """
        Lista apenas as categorias sem buscar nenhum produto
    """
    category = Category.objects.all()
    return category

@api.post('/category', response={201: CategorySchema, 400: MessageSchema})
def create_category(request, payload: CategorySchemaIn):
    """
        Cria uma categoria e a retorna
    """
    try:
        category = Category.objects.create(**payload.dict())
    except Exception as e:
        return 400, {"message": f"Não foi possível salvar a categoria, erro: {e}"}
    return 201, category

@api.delete('/category/{category_id}', response={200: MessageSchema, 400: MessageSchema})
def delete_category(request, category_id: int):
    """
        Deleta uma categoria, que não possua nenhum produto vinculado
    """
    try:
        category = get_object_or_404(Category, id=category_id)
        if category:
            category.delete()
    except Exception as e:
        return 400, {"message": f"Não foi possível deletar a categoria, erro: {e}"}
    return 200, {"message": f"{category.title} foi deletado permanentemente"}

@api.post('/product', response={201: ProductSchema, 400 : MessageSchema})
def create_product(request, payload: ProductSchemaIn, image: UploadedFile = File(None)):
    """
        Cria um produto desempacotando o payload junto com sua imagem caso a tenha
    """
    product_data = payload.dict()
    product_img = image
    try:
        product = Product.objects.create(
            category=Category.objects.get(id=product_data.pop("category", None)),
            **product_data,
            image=product_img
        )
        return 201, product
    except Exception as e:
        return 400, {"message" : "Não foi possível criar o produto"}

@api.delete('/product/{product_id}', response={200: MessageSchema, 404: MessageSchema})
def delete_product(request, product_id: int):
    """
        Deleta um produto com base no id recebido
    """
    try:
        product = get_object_or_404(Product, id=product_id)
        if product:
            product.delete()
    except:
        return 404, {"message": f"O produto de id {product_id} não foi encontrado"}
    return 200, {"message": f"o produto {product.title} foi deletado"}

@api.post('/product/{product_id}', response={201: ProductSchema, 400: MessageSchema})
def update_product(request, product_id: int, payload: ProductSchemaUpdate = Body(...), image: UploadedFile = File(None)):
    """
        Busca e modifica os valores de um model a partir do payload e do image, 
        o metodo utilizado deveria ser put ou patch, mas o django ninja ainda não tem suporte.
    """
    product = get_object_or_404(Product, id=product_id)
    try:
        for key, value in payload.dict().items():
            setattr(product, key, value)
        if image:
            product.image = image
        product.save()
    except Exception as e:
        return 400, {"message": f"An error as occurud: {e}"}
    return 201, product
