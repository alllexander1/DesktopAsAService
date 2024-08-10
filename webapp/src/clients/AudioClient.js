class AudioClient {

    constructor(vmAddress, statusCallback){
        this.vmAddress = vmAddress;
        this.statusCallback = statusCallback;
        this.socket = null;

        this.audioContext = null;
        this.scriptNode = null;
    }

    start(){
        this.statusCallback('Connecting...')
        this.socket = new WebSocket(this.vmAddress);

        this.socket.onopen = (event) => {
            this.statusCallback('Connected to audio server.');
            this.socket.send('192.168.178.28');
        }

        this.socket.onerror = () => {
            this.statusCallback('An error occured')
        };

        this.socket.onclose = () => {
            this.statusCallback('Connection closed')
        }

        this.socket.onmessage = (message) => {
            console.log(message);
            if(message.data == 'Connected'){
                this.statusCallback('Connected to VM')
                this.sendAudio();
            }     
        }
    }

    stop(){
        this.socket.close();
        this.statusCallback('Connection closed')

        if (this.scriptNode) {
            this.scriptNode.disconnect();
            this.scriptNode = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }

    sendAudio = () => {
        console.log('Sending audio data')
        navigator.mediaDevices.getUserMedia({ audio : true }).then((stream) => {
            this.audioContext = new AudioContext();
            this.audioContext.resume();

            const onAudioCaptured = (event) => {
                const audioData = event.inputBuffer.getChannelData(0); // Get audio data
                // Convert audio data to Int16Array (16-bit PCM)
                const intData = new Int16Array(audioData.length);
                for (let i = 0; i < audioData.length; i++) {
                    intData[i] = audioData[i] * 0x7FFF; // Scale to 16-bit range
                }
                // Send audio data over WebSocket connection
                this.socket.send(intData.buffer);
            }

            this.scriptNode = this.audioContext.createScriptProcessor(2048, 2, 1); 
            this.scriptNode.connect(this.audioContext.destination);
            this.scriptNode.addEventListener('audioprocess', onAudioCaptured);

            const source = this.audioContext.createMediaStreamSource(stream);
            //source.disconnect(audioContext.destination)
            source.connect(this.scriptNode);
        });
        }
}

export default AudioClient;