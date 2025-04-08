FROM node:18-alpine as builder


RUN apk update && apk --no-cache --virtual .build-deps add \
    python3 \
    make \
    g++ \
    build-base

WORKDIR /app

COPY package*.json ./
RUN npm ci
RUN npm run clean
COPY . .
RUN npm run build -- --mode production

RUN apk del .build-deps

FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/conf.d /etc/nginx/conf.d