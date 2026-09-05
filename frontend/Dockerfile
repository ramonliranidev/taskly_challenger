FROM node:20-alpine

# Angular CLI global (fallback; o projeto usa o @angular/build local)
RUN npm install -g @angular/cli

WORKDIR /app

# Roda como usuário não-root (uid/gid 1000 — mesmo do host no WSL) para que
# o node_modules e o package-lock.json gerados no container fiquem acessíveis
# fora dele, sem "poluir" o host com arquivos root.
RUN chown -R node:node /app
USER node

EXPOSE 4200
