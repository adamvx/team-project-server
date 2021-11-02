FROM node:alpine

WORKDIR /usr/src/app

COPY ./drc ./drc

COPY ./tsconfig.json ./tsconfig.json

COPY ./package*.json ./

RUN npm i

COPY ./src ./src

RUN npm run build

CMD ["npm", "run", "prod"]