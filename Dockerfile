FROM arm32v6/alpine

RUN apk add --no-cache npm && \
apk add --no-cache make gcc g++ python linux-headers udev && \
npm install serialport --build-from-source=serialport

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node","main.js"]