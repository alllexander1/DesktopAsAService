const express = require('express')
const enableWs = require('express-ws')
const {exec} = require('child_process');

const app = express()
enableWs(app)
app.use(express.json())

var sessions = new Map();

app.ws('/vnc/printer', async (ws, req) => {
    const userID = req.query.id;
    console.log(`New print client connection: id=${userID}`)
    sessions.set(userID, ws)

    try {
        const result = await createPrinter(userID);
        ws.send(JSON.stringify({type: 'status', status: result}))
        ws.send(JSON.stringify({type: 'printer_path', printer_path: `/printers/${userID}`}))
    } catch (error) {
        ws.send(JSON.stringify({status: error}))
    }
    ws.on('close', () => {
        console.log(`Session for client id=${userID} closed`)
        sessions.delete(userID)
    })
})

// For notifications that pdf is created
app.post('/api/vnc/file', (req, res) => {
    const data = req.body;
    console.log('New file: ' + data['message'])
    handlePath(data['message'])
    res.json({ status: 'Path processed'});
});

async function createPrinter(name){
    console.log('Creating printer: ' + name);
    const path = `/usr/src/app/scripts/create_printer.sh ${name}`

    return new Promise((resolve, reject) => {
        exec(path, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error creating printer: ${stderr}`);
                reject('error: could not create printer');
            } else {
                console.log(`Printer ${name} is running: ${stdout}`);
                resolve('printer is ready');
            }
        });
    });
}

function handlePath(path){
    const clientId = path.split('/')[5];    // Extract the client id from the path
    const fileName = path.split('/')[6];
    const ws = sessions.get(clientId);
    const relativePath = `${clientId}/${fileName}`  // Extract the relative part of the file path

    if(ws)
        ws.send(JSON.stringify({type: 'file', name: relativePath}));
    else
        console.log(`No active session for client ${clientId}`);
}

app.listen(8010)

console.log('Server is running...')