from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def authenticated(request):
    """Check whether the user is authenticated."""
    return Response(request.user.is_authenticated)
