# Build the frontend
FROM node:18 AS frontend-builder

WORKDIR /usr/src/app/webapp
COPY ./webapp/package*.json ./
RUN npm install
COPY ./webapp ./
RUN npm run build

#Build the backend
FROM node:18

# Install all required dependencies
RUN apt-get update && apt-get install -y \
    pulseaudio \
    pulseaudio-utils \
    alsa-utils \
    libasound2-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY ./Backend/package*.json ./
RUN rm -rf node_modules package-lock.json && npm install
COPY ./Backend ./

# Copy the builded frontend into the public forlder of the backend
COPY --from=frontend-builder /usr/src/app/webapp/build ./public

EXPOSE 8090
EXPOSE 8080

# Start the backend server
CMD [ "node", "server_https.js" ]
