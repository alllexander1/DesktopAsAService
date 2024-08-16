FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update
RUN apt-get install -y cups cups-pdf python3 python3-flask nano curl dos2unix gunicorn3
RUN echo "root:root" | chpasswd

COPY app /app
RUN mkdir /app/out

COPY cupsd.conf /etc/cups/cupsd.conf
COPY postprocess.sh /usr/local/bin/postprocess.sh
RUN chmod -R 777 /usr/local/bin/postprocess.sh
RUN touch /usr/local/bin/env_vars.sh && chmod -R 777 /usr/local/bin/env_vars.sh

# Fix line endings if working on windows host
RUN dos2unix /app/create_printer.sh /app/delete_printer.sh /usr/local/bin/postprocess.sh

WORKDIR /app

EXPOSE 631
EXPOSE 5000

CMD service dbus start && service cups start && gunicorn -b 0.0.0.0:5000 wsgi:app