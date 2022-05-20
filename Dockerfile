FROM node:lts-alpine AS client-build
RUN apk add --no-cache python3 build-base
WORKDIR /build
ADD client .
RUN yarn
RUN yarn build

FROM python:3.10-alpine AS generate-requirements
RUN pip install --upgrade pip pipenv
COPY Pipfile Pipfile.lock ./
RUN pipenv lock -r > /requirements.txt

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
WORKDIR /app
COPY --from=generate-requirements /requirements.txt ./
RUN pip install --upgrade pip gunicorn && pip install -r requirements.txt
COPY --from=client-build /build/dist/draperweb-client /var/www/draperweb/
COPY manage.py docker/entrypoint.sh ./
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
ADD draperweb draperweb
CMD ["/bin/sh", "entrypoint.sh"]
