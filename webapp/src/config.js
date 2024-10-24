const config = {
    printerAPI: 'ws://localhost:3000/vnc/printer',
    microphoneAPI: 'ws://localhost:3000/vnc/audio',
    fileFetchAPI: 'http://localhost:3000/files/',
    cupsAddress: 'ipp://<VNC_Service_Host>:631',
    backendURL: 'localhost:8000',
    userToken: '123' // not relevant
};

export default config;