#!/bin/sh

NAME="$1"

# Delete printer, config file, log file and output folder
if lpstat -p "$NAME"; then
    lpadmin -x "$NAME"
    rm -r "/app/out/$NAME"
    rm "/etc/cups/cups-pdf-$NAME.conf"
    rm "/var/log/cups/cups-pdf-${NAME}_log"
    return 0
else
    return 1
fi