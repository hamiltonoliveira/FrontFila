# Etapa 1: build do Angular
FROM node:22 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Etapa 2: nginx para servir
FROM nginx:alpine

# Copia build para o nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia o nginx.conf opcional
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
