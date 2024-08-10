// Testing purposes

class AudioClient{

    constructor(vmAddress, statusCallback){
        this.vmAddress = vmAddress;
        this.statusCallback = statusCallback;
        this.socket = null;

        this.audioContext = null;
        this.scriptNode = null;
    }

    start(){
        this.statusCallback('Connecting...');
        this.socket = new WebSocket(this.vmAddress);

        this.socket.onopen = (event) => {
            this.statusCallback('Connected to audio server.');
            this.socket.send('192.168.178.28');
            
        }

    }

    
    makeTest(){
        var timeSend = Date.now();
        this.socket.send()
    }

    stop(){

    }

    
}

export default AudioClient;