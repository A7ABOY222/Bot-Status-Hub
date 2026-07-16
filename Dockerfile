FROM node:22

WORKDIR /app

RUN corepack enable

COPY . .

RUN pnpm install

RUN pnpm --filter @workspace/leveling-bot run build

EXPOSE 3000

CMD ["pnpm", "--filter", "@workspace/leveling-bot", "run", "preview"]
