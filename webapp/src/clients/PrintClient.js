class PrintClient{

    constructor(serverAdress, statusCallback, nameCallback){
        this.statusCallback = statusCallback;
        this.nameCallback = nameCallback;
        this.serverAdress = serverAdress;
    }

    start(){
        this.socket = new WebSocket(this.serverAdress);
        this.statusCallback('Connecting...')
        console.log(this.serverAdress)

        this.socket.onopen = () => {
            console.log('Connected')
            this.statusCallback('Connected to server')
        }

        this.socket.onerror = () => {
            this.statusCallback('An error occured')
        }

        this.socket.onclose = () => {
            this.statusCallback('Connection closed')
        }

        this.socket.onmessage = (m) => {
            const data = JSON.parse(m.data);
            if (data.printer_path) {
                this.nameCallback(data.printer_path)
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