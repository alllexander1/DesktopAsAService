import './GuacamoleStage.css'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import Guacamole from 'guacamole-common-js'
import React from 'react';
import {Mic, MicMute, ChevronUp, ChevronDown} from 'react-bootstrap-icons'

class GuacamoleStage extends React.Component {

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.token = this.props.connection.token;
        this.state = {
            taskbarCollapsed: false,
            audioEnabled: false,
            audioStatus: 'Recording disabled',
            printerStatus: 'Not connected',
            printerName: '',
        };
        this.audioStreamRDP = null;
        this.recorder = null;
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
        
        // Enable the microphone when needed
        client.onstatechange = (state => {
            if(state == 3){
               this.recordAudio();
            }
        })

        // Handle incomming PDFs
        this.updatePrinterStatus("Enabled")
        this.updatePrinterName("Guacamole Printer")
        client.onfile = this.downloadFile;
            
        
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

    downloadFile = (stream, mimetype, filename) => {
        // Remove dublicate .pdf
        if(filename.endsWith('.pdf.pdf')){
            filename = filename.slice(0, -4)
        }

        let dataChunks = [];
        stream.sendAck('OK', Guacamole.Status.Code.SUCCESS);
        
        // Collect all chunks
        stream.onblob = (data64) => {
            // Decode base64 data chunk
            let byteCharacters = atob(data64);
            let byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            let byteArray = new Uint8Array(byteNumbers);
            dataChunks.push(byteArray);
            
            stream.sendAck('OK', Guacamole.Status.Code.SUCCESS);
        };
        
        // Connect the chunks to a Blob and download the file
        stream.onend = () => {
            stream.sendAck('OK', Guacamole.Status.Code.SUCCESS);
    
            const blob = new Blob(dataChunks, { type: mimetype });

            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
    }

    recordAudio = () => {
        this.audioStreamRDP = this.client.createAudioStream("audio/L16;rate=44100,channels=2");        
        this.recorder = Guacamole.AudioRecorder.getInstance(this.audioStreamRDP, "audio/L16;rate=44100,channels=2"); 
        
        if(!this.recorder)
            this.audioStreamRDP.sendEnd();
        else 
            this.recorder.onclose = this.recordAudio;
    }

    toggleTaskbar = () => {
        this.setState((prevState) => ({
            taskbarCollapsed: !prevState.taskbarCollapsed
        }));
    }

    render() {
        return(
            <div>
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
                            <span>Speaker: enabled</span>
                            <span>Microphone: {this.state.audioStatus}</span>
                        </div>
                        <div>
                            <span className='heading'>Printer:</span>
                            <span>Status: {this.state.printerStatus}</span>
                            <br/>
                            <span>Printer name: {this.state.printerName}</span>
                        </div>
                    </div>       
                </Card>
                )}
                <div ref={this.myRef} />
            </div>
        );
    }
}

export default GuacamoleStage;