RUN corepack enable
RUN corepack prepare pnpm@10.15.0 --activate

COPY . .

RUN pnpm install
RUN pnpm --filter @workspace/leveling-bot build
