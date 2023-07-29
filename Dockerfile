FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ["./utd-tool-crib/package.json", "./utd-tool-crib/package-lock.json", "./"]
RUN npm install --omit=dev
COPY [".env", "../"]
# COPY ["./utd-tool-crib/public/", "./utd-tool-crib/src/", "./"]
COPY ./utd-tool-crib/public/* public/
COPY ./utd-tool-crib/src src/
RUN npm run build

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

ENV PATH=$PATH:/home/node/.npm-global/bin

RUN npm -g install serve
CMD ["serve", "-s", "build"]