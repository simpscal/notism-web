FROM oven/bun:1.1-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./

RUN bun install

COPY . .

EXPOSE 5173

CMD ["bun", "run", "start", "--host", "0.0.0.0"]
