FROM node:14 as base

WORKDIR /home/node/authenication

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package.json *.lock tsconfig.json tsconfig.build.json ./

RUN yarn

COPY . . 

# DEVELOPMENT
FROM base as dev

ENV NODE_ENV=development



# PRODUCTION
FROM base as production

ENV NODE_PATH=./build

ENV NODE_ENV=production

RUN yarn build

