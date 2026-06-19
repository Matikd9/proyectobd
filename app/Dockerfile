FROM node:18-alpine

WORKDIR /app

# Instalar dependencias si existe package.json
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación (dev mode para POC)
CMD ["npm", "run", "dev"]
