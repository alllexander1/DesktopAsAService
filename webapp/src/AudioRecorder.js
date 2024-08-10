import Guacamole from 'guacamole-common-js';

class AudioRecorder {

    constructor(writer){
        this.writer = writer;
        this.audioContext = null;
        this.scriptNode = null;
        this.stream = null;
    }

    startRecording(){
        navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
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
                this.writer.sendData(intData.buffer);
            }

            this.scriptNode = this.audioContext.createScriptProcessor(2048, 2, 1); 
            this.scriptNode.connect(this.audioContext.destination);
            this.scriptNode.addEventListener('audioprocess', onAudioCaptured);

            const source = this.audioContext.createMediaStreamSource(stream);
            source.connect(this.scriptNode);
            this.stream = stream

        });

    }

    stopRecording(){
        if (this.scriptNode) {
            this.scriptNode.disconnect();
            this.scriptNode = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }
}

export default AudioRecorder;