FROM node:lts-alpine AS client-build
RUN apk add --no-cache python3 build-base
WORKDIR /build
ADD client .
RUN yarn
RUN yarn build

FROM python:3.10-alpine
ENV DRAPERWEB_SECRET ""
ENV DRAPERWEB_MODE "production"
ENV DRAPERWEB_DB_NAME "draperweb"
ENV DRAPERWEB_DB_HOST "draperweb-db"
ENV DRAPERWEB_DB_PORT "5432"
ENV DRAPERWEB_DB_USER "postgres"
ENV DRAPERWEB_DB_PASSWORD ""
ENV SOCIAL_AUTH_NEXTCLOUD_KEY ""
ENV SOCIAL_AUTH_NEXTCLOUD_SECRET ""
EXPOSE 80
RUN apk add --no-cache libffi musl musl-dev libffi-dev build-base nginx
COPY --from=client-build /build/dist/draperweb-client /var/www/draperweb/
WORKDIR /app
COPY Pipfile Pipfile.lock manage.py docker/entrypoint.sh ./
RUN pip install --upgrade pip pipenv gunicorn && pipenv lock -r > requirements.txt
RUN pip install -r requirements.txt
RUN rm Pipfile Pipfile.lock requirements.txt
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
ADD draperweb draperweb
CMD ["/bin/sh", "entrypoint.sh"]
