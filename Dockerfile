FROM node:14 as base

WORKDIR /home/node/authenication

COPY package.json .

RUN yarn

COPY . . 


# PRODUCTION
FROM base as production

ENV NODE_PATH=./build

RUN yarn build



# DEVELOPMENT
FROM base as dev

ENV NODE_ENV=development


