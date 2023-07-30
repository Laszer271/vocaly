FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN npm install -g react-scripts

RUN npm install react-loader-spinner

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]

