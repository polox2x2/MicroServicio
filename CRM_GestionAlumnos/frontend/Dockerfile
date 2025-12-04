# Usa una imagen base oficial de Node.js
FROM node:22-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de gestión de paquetes (usa patrón para tolerar falta de package-lock.json)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código (aunque src se montará por volumen)
COPY . .

# El puerto que expone el React Dev Server
EXPOSE 3000

# Comando por defecto para iniciar el servidor de desarrollo
CMD ["npm", "start"]