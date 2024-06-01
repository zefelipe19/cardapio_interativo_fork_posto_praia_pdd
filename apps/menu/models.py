from django.db import models
from django.template.defaultfilters import slugify  
from uuid import uuid4


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Category(BaseModel):
    title = models.CharField(max_length=255, verbose_name='Titulo')

    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'
        ordering = ["title",]

    def  __str__(self):
        return self.title
    

class Product(BaseModel):
    category = models.ForeignKey(Category, on_delete=models.PROTECT, verbose_name='Categoria')
    title = models.CharField(max_length=255, verbose_name='Titulo')
    price = models.DecimalField(max_digits=8, decimal_places=2, verbose_name='Preço')
    promotional_price = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    description = models.TextField(blank=True, null=True, verbose_name='Descrição')
    image = models.ImageField(blank=True, null=True, verbose_name='Foto', upload_to='produtos/', )
    is_active = models.BooleanField(default=True, verbose_name='Em Estoque')
    is_promo = models.BooleanField(default=False, verbose_name='Em Promoção')
    slug = models.SlugField(blank=True, null=True)

    class Meta:
        verbose_name = 'Produto'
        verbose_name_plural = 'Produtos'
        ordering = ["title",]

    def __str__(self):
        return f'{self.title} | {self.category}'
    

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.title}-{self.category}-{uuid4()}")
        super().save()
        return
    