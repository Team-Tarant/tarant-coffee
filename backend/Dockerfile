FROM node:14-alpine

WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY tsconfig.json /app/tsconfig.json
COPY src /app/src

RUN npm i
RUN npm run build

EXPOSE 3000

CMD ["node", "./dist/app.js"]
