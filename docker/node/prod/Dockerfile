FROM node:10-alpine
WORKDIR /app
COPY ../../.. /app
RUN npm ci
EXPOSE 3000
CMD ["npm", "run", "prod"]
