FROM node:18-alpine

WORKDIR /app

# 依存関係をコピーしてインストール
COPY package*.json ./
RUN npm install

# ソースコードをコピー
COPY . .

EXPOSE 3000

# 開発モードで起動
CMD ["npm", "run", "dev"]
