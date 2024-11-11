/*
This class represents a printing client for VNC connections. It establishes a websocket connection to the backend 
and waits for new files. If a message for a new file is received, the file is automatically downloaded.
*/
class PrintClient{

    constructor(config, token, id){
        this.config = config;
        this.token = token;
        this.id = id;
        this._path = '';
        this._status = 'not connected';
        this.onStatusChange = null;
        this.onPathReceived = null;
    }

    set path(path) {
        this._path = path;
        this.onPathReceived(path)
    }

    get path() {
        return this.path;
    }

    set status(newStatus) {
        this._status = newStatus;
        if (this.onStatusChange) {
            this.onStatusChange(newStatus);
        }
    }

    get status() {
        return this._status;
    }

    // Connect to proxy and handle messages
    connect(){
        this.socket = new WebSocket(`${this.config.printerAPI}?token=${this.token}&id=${this.id}`);

        this.socket.onerror = () => {
            this.status = 'error'
        }

        this.socket.onclose = () => {
            this.status = 'connection closed'
        }

        // On Message
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const type = message.type;

            // Received message is status change
            if(type === 'status'){
                this.status = message.status;
            }
            // Received message is the printer path
            else if(type === 'printer_path'){
                this.path = this.config.cupsAddress + message.printer_path
                this.status = 'printer is running'
            }
            // Received message a file path
            else if(type === 'file'){   
                this.fileName = message.name;
                const fetch_path = this.config.fileFetchAPI + this.fileName;
                this.downloadFile(fetch_path);
            }
        }

    }

    // Download file from backend
    downloadFile = function(path) {
        fetch(path)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = path.split('/').pop();
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error downloading file:', error));
    }

    disconnect(){
        this.socket.close();
    }
}

export default PrintClient;
