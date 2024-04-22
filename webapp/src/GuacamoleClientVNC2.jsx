//import Guacamole from 'guacamole-common-js';
import Guacamole from 'C:\\Users\\alexa\\Desktop\\Masterarbeit\\DesktopAsAService\\webapp\\node_modules\\guacamole-common-js\\dist\\cjs\\guacamole-common.js';

import React from 'react';

class GuacamoleStage extends React.Component {

    // Connection tokens, ToDo: implement better solution
    conn = {
        'C1': 'eyJpdiI6IlhKM1ZUb01BQW1rRW5kQlRxSjM0WWc9PSIsInZhbHVlIjoiaitNKzFJMUlmd3dqRk9NZTl0WG9LUGNSRWxvc0M4bjRtOUJlc2ZXejNmWVhmSk91VVh6QnpRNHRRZmE5SUMzRVc0bk9uNm1KeVIza21pTVFJSGdENWVDZTRwMjc4a2NxaXpkVml6VTBRcXZ2ei9scndBUGJYd1Y4SjMzS2ltejRCYWRQOHYxU2Q2QXpvMTZyY0JvNDVXQS9VYTg1ZjhoNGRYM3MvR2JlSEZwTDR0dlpTOUJoYzJ4N3Y3YzBsVExMSmFUK3JnR1dnUEx2bmt5RTBVQ1ZmM2Z3SHoxMjlYaUFaV1Y2RE9CS2hETzkzVzEvbnNZekhZZEVheEZhaWpDekNoUlYxL2o1U1JuZzNQWFZXTWVOS3c9PSJ9',
        //'C1': 'eyJpdiI6IjhXNEhuSEx4NFdQUFlsWlVITmdOVUE9PSIsInZhbHVlIjoicnVLcXhxSk5OTXlGaTJvQloyd3NaWXI1OXUrNEVqNkkrd09LZERUSzBXWkFSeUJEWDFXMzN0S2NtdjRkYVFaNURtdHVUaVFRc2RObGpSUHBtZkxaUXNndlIwTzJvY05zOVpkNWsvbm9OQjAvanFJaXh0ZnAwTGRncjh6VVJNc1pPeE1NZnprUldkaHdFb3ZKWmlYK0JXeHFqbGFOVDc1VlRQOW5mc3lvYXR2QWd1enFKcFJZK2VkakIvVE9ydHZOZUQzRGlXRWd2ZnkyMXYzRXYvazA2T0l5bzJRRkwwVE9vNm0xd2g1UFViZnhxNmtqSzRVT0ZIOURKY0VsdGxKT1E4azN3TjQvWG1RemdWaGJOMWZBM21lT1hVaDNza2RmZXVjNHlQZ3ZnL0k9In0%3D',
        'C2': 'eyJpdiI6ImlDcFVhODNOR0ZkMEZkTG44SGVzRmc9PSIsInZhbHVlIjoib20xQ0NacFdtZTFDd0VIRGR1Q1hqb0dzRFR3WEVlQ3FmcUpMTmk0Ri9aWGJKbXdjaGR3WTIxVEs3NWljb1RaRy82UWJUSlM1UDZDWkNMU1k0UTNlc3VrbzJtK3VWZW9aVXdYWjlhM2VkdXRVaG9TTUVpSHdRdFF4dHIvU25sMkdJVll0VlF4U0p1WDdPd21DdTZBWUtiMGQ1STNxU2FGL0N1VTNiRmxKRjNTc0o3eEs2YkpzQnhsRDhzbGtrY25rTFVuMWFVc0NwY1E2R0phR1c0ZExkcjZGeHA2U3dkTGlNZlNkU3RxNzdpd3MvN0NVUVJZS0x4aDhuOWZqT0dKUExHTSt0MUlya1owVEp3QjBKdnNDdzdyYTAzRldvN3lmVVBKVERjQXBHNElnMERSK01ieGt2TjV5ZmxvN2ljOStwTFV3aHljazBzK3NBVWpNOEw2cWU0S0lCdm1rZVVpZGNnYm5EdTVTSktFPSJ9'
    }

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.token = this.conn[this.props.connection]
    }

    componentDidMount(){
        const tunnel = new Guacamole.WebSocketTunnel('ws://localhost:8080/');
        const client = new Guacamole.Client(tunnel);

        this.myRef.current.appendChild(client.getDisplay().getElement());

        // Download PDF
        client.onfile = (stream, mimetype, name) => {
            console.log('file stream received')
        }

        //Microphone
        const handleAudio = function() {
            var audioStream = client.createAudioStream("audio/L16;rate=44100,channels=2") ;
            var writer = new Guacamole.ArrayBufferWriter(audioStream);

            navigator.mediaDevices.getUserMedia({ audio : true }).then((stream) => {
                var context = Guacamole.AudioContextFactory.getAudioContext() ;
                var processor = context.createScriptProcessor(2048, 2, 2) ;
                    processor.connect(context.destination) ;
                
                    // Send blobs when audio buffers are received
                    processor.addEventListener('audioprocess', function processAudio(event) {
                        var inputBuffer = event.inputBuffer;
                        var inputData = inputBuffer.getChannelData(0);
                        // Write the audio data to the Guacamole audio input stream
                        var bytes = new Int16Array(inputData.length);
                        //console.log(bytes, 'bytes')
                        for (var i = 0; i < inputData.length; i++) {
                            bytes[i] = inputData[i] * 32766;
                        };
                        writer.sendData(bytes.buffer);
                    });
            
                    // Connect the processing node to the user's audio input source
                    var source = context.createMediaStreamSource(stream) ;
                    source.connect(processor) ;
            
                    // Attempt to explicitly resume AudioContext, as it can be paused
                    // by default
                    if (context.state === 'suspended')
                        context.resume();
            });
        }

        client.onstatechange = function(state){
            if (state === 3) {
                handleAudio();
            }
        }
        
        // Mouse listener
        const mouse = new Guacamole.Mouse(client.getDisplay().getElement());
        mouse.onEach(['mousedown', 'mouseup', 'mousemove'], function sendMouseEvent(e) {
            client.sendMouseState(e.state);
        });
        
        // Keyboard listener
        const keyboard = new Guacamole.Keyboard(document);
        keyboard.onkeydown = function (keysym) {
            client.sendKeyEvent(1, keysym);
        };
        keyboard.onkeyup = function (keysym) {
            client.sendKeyEvent(0, keysym);
        };

        // Error handler
        client.onerror = function(error) {
            console.error(error);
        };

        client.connect('token='+this.token);    // Connect to Webserver

        this.client = client;
        this.mouse = mouse;
        this.keyboard = keyboard;
    }

    componentWillUnmount() {
        this.client.disconnect();
    }

    

    render() {
        return <div ref={this.myRef} />;
    }
}

export default GuacamoleStage;