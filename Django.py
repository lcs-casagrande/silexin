myapp/views.py
from django.http import HttpResponse

def hello(request):
return HttpResponse("Hello, World!")

myapp/urls.py
from django.urls import path
from myapp import views

urlpatterns = [
path('', views.hello, name='hello'),
]