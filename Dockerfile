# ══════════════════════════════════════════════════════════════
# neosale-timeline — Dockerfile
#
# EasyPanel config:
#   Build context : . (raiz do repo neosale-timeline)
#   Dockerfile    : Dockerfile
#   Port          : 80
#
# @neosale/ui está vendorizado em vendor/neosale-ui/
# ══════════════════════════════════════════════════════════════

# ──────────────────────────────────────────────────────────────
# Stage 1: Build Vite
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copia manifests e vendor (contém @neosale/ui source)
COPY package*.json ./
COPY vendor/ ./vendor/

# Instala dependências (resolve @neosale/ui do vendor local)
RUN npm install --workspaces=false

# Copia restante do código e faz o build de produção
COPY . .
RUN npm run build

# ──────────────────────────────────────────────────────────────
# Stage 2: Servir com Nginx (~25 MB)
# ──────────────────────────────────────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
