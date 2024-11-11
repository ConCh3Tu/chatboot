FROM node:18-bullseye as bot
ENV TZ=America/Lima
RUN apt-get update && apt-get install -y tzdata && \
    cp /usr/share/zoneinfo/America/Lima /etc/localtime && \
    echo "America/Lima" > /etc/timezone && \
    dpkg-reconfigure -f noninteractive tzdata
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
ARG RAILWAY_STATIC_URL
ARG PUBLIC_URL
ARG PORT
CMD ["npm", "start"]