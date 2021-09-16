ARG BASE_IMAGE=node:16-alpine

FROM $BASE_IMAGE AS deps

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --silent

# Build project
FROM $BASE_IMAGE AS builder

WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN yarn build && yarn install --production --ignore-scripts --prefer-offline --silent

# Run project
FROM $BASE_IMAGE AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

CMD ["yarn", "start"]
