import './GuacamoleStage.css'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import Guacamole from 'guacamole-common-js';
import React from 'react';
import {Mic, MicMute, ChevronUp, ChevronDown} from 'react-bootstrap-icons'
import PrintClient from './clients/PrintClient'
import AudioClient from './clients/AudioClient'

class GuacamoleStage extends React.Component {

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.token = this.props.connection.token;
        this.state = {
            taskbarCollapsed: false,
            audioEnabled: false,
            audioStatus: 'Not connected',
            printerStatus: 'Not connected',
            printerName: '',
        };
        this.printClient = new PrintClient('ws//localhost:8010/', this.updatePrinterStatus, this.updatePrinterName);
        this.audioClient = props.connection.type == 'VNC' ? new AudioClient('ws//localhost:8020/', this.updateAudioStatus): null;
    }

    updatePrinterStatus = (status) => {
        this.setState({ printerStatus: status });
    };

    updatePrinterName = (name) => {
        this.setState({printerName: name});
    };

    updateAudioStatus = (status) => {
        this.setState({ audioStatus: status });
    };

    componentDidMount(){
        const tunnel = new Guacamole.WebSocketTunnel('ws://localhost:8080/');
        const client = new Guacamole.Client(tunnel);

        this.myRef.current.appendChild(client.getDisplay().getElement());

        // Printing option
        this.printClient.start();

        //Microphone

        /*const sendAudio = function(){
            console.log('Sending audio data')
            navigator.mediaDevices.getUserMedia({ audio : true }).then((stream) => {
                const audioContext = new AudioContext();
                audioContext.resume();
    
                function onAudioCaptured(event) {
                    const audioData = event.inputBuffer.getChannelData(0); // Get audio data
                    // Convert audio data to Int16Array (16-bit PCM)
                    const intData = new Int16Array(audioData.length);
                    for (let i = 0; i < audioData.length; i++) {
                        intData[i] = audioData[i] * 0x7FFF; // Scale to 16-bit range
                    }
                    // Send audio data over WebSocket connection
                    audioSocket.send(intData.buffer);
                }
    
                //const source = audioContext.createMediaStreamSource(stream);
                const scriptNode = audioContext.createScriptProcessor(2048, 2, 1); 
                scriptNode.connect(audioContext.destination);
                scriptNode.addEventListener('audioprocess', onAudioCaptured);
    
                const source = audioContext.createMediaStreamSource(stream);
                //source.disconnect(audioContext.destination)
                source.connect(scriptNode);
            });
            }
        
        const audioSocket = new WebSocket('ws://localhost:8020');

        audioSocket.onopen = (event) => {
            console.log('Connected to audio server.');
            audioSocket.send('192.168.178.28');
        }

        audioSocket.onmessage = (message) => {
            console.log(message);
            if(message.data == 'Connected')
                sendAudio();
        }
        */

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

    startMicrophone(){
        if(this.props.connection.type == 'VNC'){
            this.audioClient.start();
        }else{

        }
    }

    stopMicrophone(){
        if(this.props.connection.type == 'VNC'){
            this.audioClient.stop();
        }else{
            
        }
    }

    toggleAudio = (event) => {
        this.setState((prevState) => {
            const newState = !prevState.audioEnabled;
            if(newState)
                this.startMicrophone();
            else
                this.stopMicrophone();
            return {audioEnabled: newState}
        });
    }

    toggleTaskbar = () => {
        this.setState((prevState) => ({
            taskbarCollapsed: !prevState.taskbarCollapsed
        }));
    }

    render() {
        return(
            <div className='container'>
                <button onClick={this.toggleTaskbar} className="btn btn-primary mb-1">
                    {this.state.taskbarCollapsed ? 'Show taskbar' : 'Hide taskbar'} {this.state.taskbarCollapsed ? <ChevronDown /> : <ChevronUp />}
                </button>
                {!this.state.taskbarCollapsed && (
                <Card className='taskbar'>
                    <div className='d-flex justify-content-around align-items-start m-2'>
                        <div>
                            <span className='heading'>Connection Info:</span>
                            <Table striped bordered hover size='sm'>
                                <thead>
                                    <tr>
                                        <th>Parameter</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Connection Type</td>
                                        <td>{this.props.connection.type}</td>
                                    </tr>
                                    <tr>
                                        <td>Machine Address</td>
                                        <td>{this.props.connection.address}</td>
                                    </tr>
                                    <tr>
                                        <td>Operating System</td>
                                        <td>{this.props.connection.os}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                        <div>
                            <span className='heading'>Audio:</span>
                            <button style={{marginBottom: '10px'}} className={this.state.audioEnabled ? 'btn btn-success' : 'btn btn-danger'} onClick={this.toggleAudio}>
                                {this.state.audioEnabled ? <Mic /> : <MicMute />}
                            </button>
                            <br/>
                            <span>Status: {this.state.audioStatus}</span>
                        </div>
                        <div>
                            <span className='heading'>Printer:</span>
                            <span>Status: {this.state.printerStatus}</span>
                            <br/>
                            <span>Printer path: {this.state.printerName}</span>
                        </div>
                    </div>       
                </Card>
                )}
                <div ref={this.myRef} />
            </div>
        );
        //return <div ref={this.myRef} />;
    }
}

export default GuacamoleStage;