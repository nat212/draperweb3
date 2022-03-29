from django.conf import settings
from social_core.backends.oauth import BaseOAuth2


class NextcloudOAuth2(BaseOAuth2):
    """Nextcloud OAuth authentication backend"""

    name = "nextcloud"
    AUTHORIZATION_URL = f"{settings.DRAPERWEB_BASE_URL}/index.php/apps/oauth2/authorize"
    ACCESS_TOKEN_URL = (
        f"{settings.DRAPERWEB_BASE_URL}/index.php/apps/oauth2/api/v1/token"
    )
    ACCESS_TOKEN_METHOD = "POST"
    REFRESH_TOKEN_URL = f"{settings.DRAPERWEB_BASE_URL}/index.php/apps/oauth2/authorize"
    REFRESH_TOKEN_METHOD = "POST"
    ID_KEY = "user_id"

    def get_user_details(self, response):
        """Return user details from Nextcloud account"""
        data = response["ocs"]["data"]
        return {"username": data.get("id"), "email": data.get("email")}

    def user_data(self, access_token: str, *args, response: dict = None, **kwargs):
        """Loads user data from service"""
        user_id = response["user_id"]
        url = (
            f"{settings.DRAPERWEB_BASE_URL}/ocs/v2.php"
            f"/cloud/users/{user_id}?format=json"
        )
        headers = {"Authorization": f"Bearer {access_token}"}
        return self.get_json(url, headers=headers)

    def auth_html(self):
        return super(NextcloudOAuth2, self).auth_html()
