FROM node:18-alpine
WORKDIR /frontend/
COPY src/ /frontend/src
COPY package.json /frontend/
RUN npm install
CMD ["npm", "start"]