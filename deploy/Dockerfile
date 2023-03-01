FROM node:lts-slim

WORKDIR /usr/src/app

COPY . .

RUN ls
#RUN rm -rf node_modules && rm -rf package-lock.json

EXPOSE 3000

CMD ["npm", "start"]
