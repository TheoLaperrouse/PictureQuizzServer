FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --production

COPY . .

RUN yarn prisma generate

EXPOSE 3000

CMD ["yarn", "start"]