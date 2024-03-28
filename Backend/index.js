const GuacamoleLite = require('guacamole-lite');

const websocketOptions = {
    port: 8080 // WebSocket server port
};

const guacdOptions = {
    host: '192.168.178.31',
    port: 4822 // guacd server port
};

const clientOptions = {
    crypt: {
        cypher: 'AES-256-CBC',
        key: 'MySuperSecretKeyForParamsToken12' // Use a secure key
    }
};

const guacServer = new GuacamoleLite(websocketOptions, guacdOptions, clientOptions);
console.log('Server running on port 8080...')