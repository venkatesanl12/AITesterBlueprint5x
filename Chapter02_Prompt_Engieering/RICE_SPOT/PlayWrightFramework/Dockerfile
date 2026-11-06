FROM mcr.microsoft.com/playwright:v1.65.0-noble

WORKDIR /work
COPY package*.json ./
RUN npm ci
COPY . .

CMD ["npx", "playwright", "test"]
