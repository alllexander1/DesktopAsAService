class PrintClient{

    constructor(serverAddr, id){
        this.serverAddr = serverAddr;
        this.id = id;
        this._status = 'unconnected';
        this.onStatusChange = null;
        this.connect();
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

    connect(){
        // Connect to WS Server
        console.log('connecting...')
        this.socket = new WebSocket(this.serverAddr);

        // When connected, send printer id
        this.socket.onopen = () => {
            this.status = 'connected'
            this.socket.send(this.id)
        }

        this.socket.onerror = () => {
            this.status = 'error'
        }

        this.socket.onclose = () => {
            this.status = 'connection closed'
        }

        this.socket.onmessage = (m) => {
            const data = JSON.parse(m.data);
            if (data.printer_path) {
                //this.nameCallback(data.printer_path)
            } else if (data.path) {
                this.downloadFile(data.path);
            }
        }
    }

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
}
export default PrintClient;