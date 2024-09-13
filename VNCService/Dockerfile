FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install requirements
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get install -y cups cups-pdf dos2unix && \
    apt-get clean

# Set default root password
RUN echo "root:root" | chpasswd

# Set working directory
WORKDIR /usr/src/app

# Copy and install express server
COPY package*.json ./
RUN npm install
COPY . .

# Fix line endings if working on windows host
RUN dos2unix ./scripts/create_printer.sh ./scripts/delete_printer.sh ./scripts/postprocess.sh

COPY /scripts/cupsd.conf /etc/cups/cupsd.conf

RUN chmod -R 777 ./scripts/postprocess.sh

EXPOSE 8010
EXPOSE 631

CMD service dbus start && service cups start && node server.js
