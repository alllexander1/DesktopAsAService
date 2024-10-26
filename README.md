# DesktopAsAService

## About
This is a web-based remote-desktop viewer for RDP and VNC connections based on Apache Guacamole. It supports mouse, keyboard, sound, microphone, printing and data transfer for RDP connections. For VNC connections an extention has been build to support audio and printing.

## Setup

### Step 1: Build the application
1. Clone the project
2. Open the file webapp/src/config.js and put the ip of the host:
    ```js
    const host = '<Host_IP>';
    ```
    Now the frontend knows the adress of the backend
3. Open the file Backend/config.js and change the adress of the Print Server and Guacd to their host(Probably the same host).
    ```js
    vncPrinterAPI: 'ws://<Host_IP>:8010/vnc/printer',
    guacdHost: '<Guacd_IP>',
    guacdPort: '4822'
    ```
4. Since https is used, a certificate is required. Create a certificate in the folder /Backend/certificate:
    ```sh
    #STEP 1: Create the server private key
    openssl genrsa -out cert.key 2048

    #STEP 2: Create the certificate signing request (CSR)
    openssl req -new -key cert.key -out cert.csr

    #STEP 3: Sign the certificate using the private key and CSR
    openssl x509 -req -days 3650 -in cert.csr -signkey cert.key -out cert.crt
    ```
    Since this is an experimental app, self signed certificate can be used.
5. Create a folder for the pdf files. For example ``DesktopAsAService/files``
5. Navigate to PrintService VNC and build the docker image for the print server:
    ```sh
    docker build -t cups_server_img .
    ```
7. Navigate to the root folder of the project and build the app image:
    ```sh
    docker build -t app_img .
    ```
8. Run Guacd on Port 4822.
9. Run a print server container and set the files folder as a volume:
    ```sh
    docker run -d -p 8010:8010 -p 631:631 -v <PATH_TO_FILES>:/usr/src/app/files --name cups cups_server_img
    ```
10. Run the app in a container and use the same volume for the files:
    ```
    docker run -d -p 8000:8000 -p 8090:8090 -v <PATH_TO_FILES>:/usr/src/app/files --name daas app_img
    ```

### Step 2: Configure the Remote Desktops

__Windows with RPD:__
1. Activate the Windows Remote Desktop feature in the settings.

**Linux with VNC**
1. Install and run a VNC server e.g. x11vnc
2. Open the file ``/etc/pulse/default.pa``
3. Enable TCP connections for PulseAudio:
    ```
    load-module module-native-protocol-tcp auth-anonymous=1
    ```
4. Add virtual microphone:
    ```
    load-module module-null-sink
    load-module module-null-sink sink_name="virtual_speaker" sink_properties=device.description="virtual_speaker"
    load-module module-remap-source master="virtual_speaker.monitor" source_name="virtual_mic"
    ```
    Enable port 8080 for TCP microphone connections. (It will also work with the default port where the output audio is streamed, but for better performance use one port for input and one for output audio):
    ```
    load-module module-native-protocol-tcp auth-anonymous=1 port=8080
    ```
5. Add an IPP printer:
    ```
    sudo lpadmin -p <PRINTER_NAME_LOCAL> -E -v ipp://<Print_Server_IP>:631/printers/<PRINTER_NAME>
    ```
    Use later the \<PRINTER_NAME> as guest name.

### Step 3: Usage
1. Generate a token with the information about the remote desktop. For that use either the generateToken.js or generateToken.py program in the root folder of the project.
2. Start the application in a browser ``https://<host_ip>:8090``
3. Put the required data in the form field and click connect. (guest name is the name of the printer for VNC connections)
4. When starting new connection or reconecting always close the current connection first since the keyboard input is used by Guacamole. 