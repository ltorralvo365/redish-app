# --- Etapa 1: Compilação (Build) ---
FROM node:18-alpine AS build

# Instalar o pnpm globalmente
RUN npm install -g pnpm

WORKDIR /app

# Copiar os ficheiros de configuração de dependências
COPY package.json ./

# Instalar as dependências do projeto
RUN pnpm install

# Copiar todo o código fonte para o contentor
COPY . .

# Compilar a aplicação utilizando o Vite
RUN pnpm run build

# --- Etapa 2: Servidor de Produção (Nginx) ---
FROM nginx:alpine AS production

# Copiar os ficheiros compilados da etapa anterior para a pasta pública do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expor a porta 80 do contentor
EXPOSE 80

# Iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]