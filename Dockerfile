FROM node:10
ENV NODE_ENV=production
WORKDIR /home/node/app
COPY package* ./
RUN npm install --quiet
COPY . .
USER node
EXPOSE 3000
CMD ["npm", "start"]
