FROM node:18.12.1 AS builder
WORKDIR /src
COPY . .
ENV VITE_API_PORT=8090
RUN npm i -g pnpm
RUN pnpm install
RUN pnpm build

FROM node:18.12.1
WORKDIR /app
ENV PORT=3000
EXPOSE 3000
COPY --from=builder /src/apps/web/.build /app/.build
COPY --from=builder /src/apps/web/.server /app/.server
COPY --from=builder /src/node_modules /app/node_modules

CMD ["node", ".server/entry.express.mjs"]