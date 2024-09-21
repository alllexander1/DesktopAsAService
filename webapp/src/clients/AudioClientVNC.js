class AudioClient {

    constructor(config, token, destination){
        this.token = token;
        this.destination = destination;
        this.wsServerAddress = config.microphoneAPI;

        this._status = 'not connected';
        this.onStatusChange = null;

        this.audioContext = null;
        this.scriptNode = null;
        this.source = null;
        this.mediaStream = null;
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
        this.status = 'connecting'
        this.socket = new WebSocket(`${this.wsServerAddress}?token=${this.token}&destination=${this.destination}`);

        this.socket.onopen = () => {
            this.status = 'connected to proxy'
        }

        this.socket.onerror = (e) => {
            this.status = 'error'
        }

        this.socket.onclose = () => {
            this.status = 'connection closed'
        }

        // Only invoked once when server is connected to the VM or failed to connect
        this.socket.onmessage = (message) => {
            //console.log('Audio client received: ' + message.data)
            if(message.data === 'connected')
                this.status = 'ready'
            else
                this.status = 'cannot reach remote audio server'
        }
    }

    disconnect(){
        this.socket.close();
        this.status = 'disconnected'
    }

    startRecording() {
        if(!(this.status === 'ready'))
            return

        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            this.mediaStream = stream;
            this.audioContext = new AudioContext();
            this.audioContext.resume();

            function onAudioCaptured(event) {
                const audioBuffer = event.inputBuffer;
                var inputData = audioBuffer.getChannelData(0);
                var bytes = new Int16Array(inputData.length);
                for (var i = 0; i < inputData.length; i++) {
                    bytes[i] = Math.max(-0x7FFF, Math.min(0x7FFF, inputData[i] * 0x7FFF));
                }; 
                writer.sendData(bytes.buffer);
            }

            const scriptNode = this.audioContext.createScriptProcessor(2048, 1, 1);
            scriptNode.onaudioprocess = onAudioCaptured.bind(this);
            scriptNode.connect(this.audioContext.destination);

            const source = this.audioContext.createMediaStreamSource(stream);
            source.connect(scriptNode);

        })
    }

    stopRecording() {
        if (this.scriptNode) {
            this.scriptNode.disconnect();
            this.scriptNode = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }
    }

}

export default AudioClient;
