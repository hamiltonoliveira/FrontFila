# Etapa 1: build da aplicação Angular
FROM node:22 AS builder

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Build para produção (gera dist/front-bridge)
RUN npm run build -- --configuration=production

# Etapa 2: imagem final com Nginx
FROM nginx:1.25-alpine

# Remove default nginx.conf
RUN rm /etc/nginx/conf.d/default.conf

# Copia nosso nginx.conf
COPY nginx.conf /etc/nginx/conf.d

# Copia arquivos buildados para a pasta pública do Nginx
COPY --from=builder /app/dist/front-bridge /usr/share/nginx/html

# Indica que o container vai escutar na porta 80.
EXPOSE 80

# Inicia o Nginx em modo foreground para o container rodar corretamente
# O que significa isso?
# Normalmente o Nginx roda como daemon (em segundo plano).
# A flag daemon off; faz o Nginx rodar no primeiro plano (foreground).
# Isso é importante no Docker para que o processo principal do container não termine imediatamente, mantendo o container ativo enquanto o Nginx está rodando.

CMD ["nginx", "-g", "daemon off;"]
