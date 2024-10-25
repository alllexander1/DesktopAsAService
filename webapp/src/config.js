const host = 'localhost';

const config = {
    printerAPI: `wss://${host}:8090/vnc/printer`,
    microphoneAPI: `wss://${host}:8090/vnc/audio`,
    fileFetchAPI: `https://${host}:8090/files/`,
    cupsAddress: `ipp://<cups_host>:631`,
    backendURL: `${host}:8000`,
    userToken: '123' // not relevant
};

export default config;