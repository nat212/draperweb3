from django.db import models


class Wishlist(models.Model):
    name = models.TextField()
    description = models.TextField(blank=True, null=True)
    shared = models.BooleanField(default=False)
    shared_url = models.URLField(null=True)


class WishlistItem(models.Model):
    name = models.TextField()
    description = models.TextField(blank=True, null=True)
    brand = models.TextField(blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    amount = models.FloatField(null=True, blank=True)
    wishlist = models.ForeignKey(
        Wishlist, on_delete=models.CASCADE, related_name="items"
    )
