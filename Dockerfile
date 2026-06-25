FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --registry=https://registry.npmmirror.com

COPY . .
RUN npm run build:h5

FROM nginx:alpine

COPY --from=builder /app/dist/h5 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
