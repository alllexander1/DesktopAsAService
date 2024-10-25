// Imports
const enableWs = require('express-ws')
const WebSocket = require('ws')
const cors = require('cors');
const config = require('./config')
const {spawn} = require('child_process')

const https = require('https');
const fs = require('fs');

// SSL credentials
const sslOptions = {
    key: fs.readFileSync(config.keyPath),
    cert: fs.readFileSync(config.certPath)
};

// Guacamole Server
const GuacamoleLite = require('guacamole-lite');
const express = require('express');
const http = require('http');

const guacamoleApp = express();

const server = https.createServer(sslOptions, guacamoleApp);

const guacdOptions = {
    host: '192.168.178.31',
    port: 4822
};

const clientOptions = {
    crypt: {
        cypher: 'AES-256-CBC',
        key: 'MySuperSecretKeyForParamsToken12'
    },
    connectionDefaultSettings: {
        test: 'test'
    }
};

const guacServer = new GuacamoleLite(
    {server},
    guacdOptions,
    clientOptions
    //callbacks
);

server.listen(8000);


// Backend Server
const app = express();
const backendServer = https.createServer(sslOptions, app);
enableWs(app, backendServer);
app.use(express.json());


app.ws('/vnc/printer', (ws, req) => {
    const token = req.query.token;
    const userID = req.query.id;
    console.log(`New print client connection: token=${token}, id=${userID}`)

    // Validate token
    console.log('connecting to ' + `${config.vncPrinterAPI}?id=${userID}`)
    const proxy = new WebSocket(`${config.vncPrinterAPI}?id=${userID}`);
    
    ws.onmessage = (m) => {
        proxy.send(m.data)  // Forward to printer container
    }

    proxy.onmessage = (m) => {
        ws.send(m.data) // Forward to web-client
    }

    proxy.onerror = (e) => {
        ws.send(JSON.stringify({type: 'status', status: 'Proxy closed'}))
        console.log("Error")
    }

    ws.on('close', () => {
        console.log('Printer connection closed')
        proxy.close();
    })
    proxy.on('close', () => {
        console.log('Print connection to cups closed')
        ws.send(JSON.stringify({type: 'status', status: 'Cannot reach print server'}))
    })
})

// Microphone API
app.ws('/vnc/audio', (ws, req) => {
    const token = req.query.token;
    const destination = req.query.destination;
    console.log(`New Audio client connection: token=${token}, destination=${destination}`);

    ws.send('connected');

    // Pacat process
    const pacatProcess = spawn('pacat', [
        '--server', `${destination}:${config.microphonePort}`,      // PulseAudio server address
        '--device', 'virtual_speaker',                              // Name of the virtual microphone
        '--format', 's16le',                                        // Audio format (L16)
        '--rate', '44100',                                          // Sample rate
        '--channels', '1',                                          // Stereo
        '--latency-msec', '100',                                    // Target latency
    ]);

    pacatProcess.on('error', (error) => {
        console.error('Error starting pacat:', error.message);
        ws.send('Error: ' + error.message);
        ws.close();
    });

    pacatProcess.on('close', (code) => {
        console.log('pacat process exited with code', code);
        if (ws.readyState === ws.OPEN) {
            ws.send('pacat process closed');
        }
        ws.close();
    });

    ws.on('message', (data) => {
        if (!pacatProcess.stdin.writable) {
            console.log('pacat stdin is not writable');
            return;
        }
        pacatProcess.stdin.write(data);
    });

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
        pacatProcess.stdin.end();
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error.message);
        pacatProcess.stdin.end();
    });
    
});

// Serve Frontend
app.use(express.static(config.webapp));

// Fetch
app.use(cors())
app.use('/files', express.static(config.filesDirectory))

// Start the API server on port 8090
backendServer.listen(8090, () => {
    console.log('API server listening on port 8090');
});