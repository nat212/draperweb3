from rest_framework import serializers

from draperweb.wishlists.models import Wishlist, WishlistItem


class WishlistItemSerializer(serializers.ModelSerializer):
    wishlist = serializers.HyperlinkedRelatedField(
        queryset=Wishlist.objects.all(),
    )

    class Meta:
        model = WishlistItem
        fields = ("name", "description", "brand", "url", "amount", "wishlist")


class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ("name", "description", "shared", "shared_url", "items")
