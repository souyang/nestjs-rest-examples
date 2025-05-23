# Set nginx base image
FROM node:18
LABEL maintainer="Simon Ouyang"
WORKDIR  /app
COPY  ./dist ./dist
COPY package.json .
COPY package-lock.json .
RUN  npm ci --only=production --ignore-scripts
EXPOSE 3000
CMD ["node", "dist/main"]
