# Use an official Node.js image
FROM node:18-alpine AS builder

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the entire Next.js project
COPY . .

# Build the Next.js app
RUN pnpm build

# Use a lightweight Node.js runtime for production
FROM node:18-alpine AS runner
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy built files and dependencies
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port 3000
EXPOSE 3000

# Start Next.js server
CMD ["pnpm", "start"]