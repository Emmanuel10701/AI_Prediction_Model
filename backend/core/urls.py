from django.urls import path
from .views import predict_age_gender

urlpatterns = [
    path("predict/", predict_age_gender, name="predict"),
]
