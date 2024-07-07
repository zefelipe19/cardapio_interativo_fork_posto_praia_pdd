from django.shortcuts import render
from django.contrib.auth.decorators import login_required

def index(request):
    return render(request, 'index.html')


def cart(request):
    return render(request, 'cart.html')

@login_required()
def admin(request):
    return render(request, 'admin.html')