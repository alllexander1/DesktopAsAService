FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update
RUN apt-get install -y cups cups-pdf python3 python3-flask
RUN apt-get install nano
RUN apt-get install curl
RUN echo "root:root" | chpasswd

COPY app /app
RUN mkdir /app/out

COPY cupsd.conf /etc/cups/cupsd.conf
COPY postprocess.sh /usr/local/bin/postprocess.sh
RUN chmod -R 777 /usr/local/bin/postprocess.sh
RUN touch /usr/local/bin/env_vars.sh && chmod -R 777 /usr/local/bin/env_vars.sh

WORKDIR /app

EXPOSE 631
EXPOSE 5000

CMD service dbus start && service cups start && python3 app.py