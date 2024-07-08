from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy


def login_view(request):
    template_name = 'login.html'
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect(reverse_lazy('card_admin'))

    return render(request, template_name)

@login_required()
def logout_view(request):
    logout(request)
    return redirect(reverse_lazy('index'))