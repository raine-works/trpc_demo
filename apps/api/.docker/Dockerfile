FROM node:18.12.1 AS builder
WORKDIR /src
COPY . .
RUN npm i -g pnpm
RUN pnpm install
RUN pnpm build

FROM node:18.12.1
WORKDIR /app
ENV PORT=8080
EXPOSE $PORT
COPY --from=builder /src/apps/api/package.json /app
COPY --from=builder /src/apps/api/prisma /app/prisma
COPY --from=builder /src/apps/api/.build /app/.build
COPY --from=builder /src/node_modules /app/node_modules
COPY --from=builder /src/apps/api/.env /app
RUN npm i -g pnpm

CMD ["node", ".build/server.js"]