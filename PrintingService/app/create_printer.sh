#!/bin/sh

NAME="$1"

# Prepare folder
mkdir -p "/app/out/$NAME"
chmod -R 777 "/app/out/$NAME"

# Add config file
cp "/etc/cups/cups-pdf.conf" "/etc/cups/cups-pdf-$NAME.conf"
sed -i "s/Out \${HOME}\/PDF/Out \/app\/out\/$NAME/g" "/etc/cups/cups-pdf-$NAME.conf"
sed -i "s/#AnonDirName \/var\/spool\/cups-pdf\/ANONYMOUS/AnonDirName \/app\/out\/$NAME/g" "/etc/cups/cups-pdf-$NAME.conf"
sed -i "s/#PostProcessing/PostProcessing \/usr\/local\/bin\/postprocess.sh/g" "/etc/cups/cups-pdf-$NAME.conf"

# Add printer
lpadmin -p "$NAME" -v "cups-pdf:/$NAME" -E -P /usr/share/ppd/cups-pdf/CUPS-PDF_opt.ppd
cupsaccept "$NAME"
#cupsctl --share-printers
lpadmin -p "$NAME" -o printer-is-shared=true

return 0
