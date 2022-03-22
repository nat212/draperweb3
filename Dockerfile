FROM python:3.10-alpine
ENV DRAPERWEB_SECRET ""
ENV DRAPERWEB_MODE "production"
ENV DRAPERWEB_DB_NAME "draperweb"
ENV DRAPERWEB_DB_HOST "draperweb-db"
ENV DRAPERWEB_DB_PORT "5432"
ENV DRAPERWEB_DB_USERNAME "postgres"
ENV DRAPERWEB_DB_PASSWORD ""
ENV SOCIAL_AUTH_NEXTCLOUD_KEY ""
ENV SOCIAL_AUTH_NEXTCLOUD_SECRET ""
EXPOSE 8000
RUN apk add --no-cache libffi musl musl-dev libffi-dev build-base
WORKDIR /app
COPY Pipfile Pipfile.lock manage.py docker/entrypoint.sh ./
RUN pip install --upgrade pip pipenv && pipenv lock -r > requirements.txt
RUN pip install -r requirements.txt
RUN rm Pipfile Pipfile.lock requirements.txt
ADD draperweb draperweb
ENTRYPOINT ["/bin/sh", "entrypoint.sh"]
