FROM node:22-alpine AS build

WORKDIR /app

# VITE_API_URL est inliné dans le bundle au build (pas modifiable via docker run -e).
# En relatif (/api), le front et l'API partagent la même origine derrière le
# reverse proxy Nginx du Front, donc pas de CORS ni d'IP du Back à coder en dur.
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
