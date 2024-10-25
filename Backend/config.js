const config = {
    microphonePort: 8080,
    vncPrinterAPI: 'ws://192.168.178.29:8010/vnc/printer',
    filesDirectory: '/usr/src/app/files',
    certPath: './certificate/cert.crt',
    keyPath: './certificate/cert.key',
    webapp: './public'
};

module.exports = config;