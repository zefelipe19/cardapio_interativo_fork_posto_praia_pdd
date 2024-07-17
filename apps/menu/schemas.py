from ninja import ModelSchema, Field, Schema
from .models import Product, Category


class ProductSchema(ModelSchema):
    class Meta:
        model = Product
        fields = ['id', 'category', 'title', 'price', 'promotional_price', 'description', 'image', 'is_active', 'is_promo']


class ProductSchemaIn(ModelSchema):
    class Meta:
        model = Product
        fields = ['category', 'title', 'price', 'promotional_price', 'description', 'is_active', 'is_promo']



class ProductSchemaUpdate(ModelSchema):
    class Meta:
        model = Product
        fields = ['title', 'price', 'promotional_price', 'description', 'is_active', 'is_promo']


class CategorySchema(ModelSchema):
    class Meta:
        model = Category
        fields = ['id', 'title']


class CategorySchemaIn(ModelSchema):
    class Meta:
        model = Category
        fields = ['title',]


class CategorySchemaMenu(ModelSchema):
    class Meta:
        model = Category
        fields = ['id', 'title']
    
    products: list[ProductSchema] = Field(..., alias='product')


class MessageSchema(Schema):
    message: set
