# ══════════════════════════════════════════════════════════════
# neosale-timeline — Dockerfile
#
# EasyPanel config:
#   Build context : . (raiz do monorepo)
#   Dockerfile    : neosale-timeline/Dockerfile
#   Port          : 80
# ══════════════════════════════════════════════════════════════

# ──────────────────────────────────────────────────────────────
# Stage 1: Empacotar @neosale/ui como tarball
#
# Necessário porque Docker não resolve referências file:../
# O tarball inclui src/ (TypeScript) que o Vite compila.
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS ui-packer

WORKDIR /ui

COPY neosale-ui/ .

# npm pack gera neosale-ui-x.x.x.tgz — mover para nome fixo
# para não depender da versão no stage seguinte
RUN npm pack && mv *.tgz /tmp/neosale-ui.tgz

# ──────────────────────────────────────────────────────────────
# Stage 2: Build do app Vite
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copia o tarball empacotado no stage anterior
COPY --from=ui-packer /tmp/neosale-ui.tgz /tmp/neosale-ui.tgz

# Copia os manifests do projeto
COPY neosale-timeline/package*.json ./

# Substitui a referência file:../neosale-ui pelo tarball local
RUN sed -i 's|"@neosale/ui": "file:../neosale-ui"|"@neosale/ui": "file:/tmp/neosale-ui.tgz"|g' package.json

# Instala dependências (inclui @neosale/ui + suas deps lucide-react, @heroicons/react)
RUN npm install --workspaces=false

# Copia todo o código-fonte e executa o build de produção
COPY neosale-timeline/ .

RUN npm run build
# Saída em /app/dist/

# ──────────────────────────────────────────────────────────────
# Stage 3: Servir com Nginx (imagem mínima ~25 MB)
# ──────────────────────────────────────────────────────────────
FROM nginx:alpine

# Copia os assets estáticos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx config: SPA routing + gzip + cache de assets
COPY neosale-timeline/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
