import Guacamole from 'guacamole-common-js'
import React from 'react'
import './GuacamoleStage.css'
import Table from 'react-bootstrap/Table'
import {Mic, MicMute} from 'react-bootstrap-icons'
import RDPClient from './clients/RDPClient'
import PrintClient from './clients/PrintClient'
import AudioClient from './clients/AudioClientLanczos'
import config from './config'
import Accordion from 'react-bootstrap/Accordion';

class GuacamoleStage extends React.Component {

    constructor(props){
        super(props);
        this.myRef = React.createRef();
        this.token = this.props.connection.token;

        this.state = {
            isLoading: true,
            error: false,
            taskbarCollapsed: false,
            printerStatus: '',
            printerName: '',
            audioStatus: ''
        }
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
        const tunnel = new Guacamole.WebSocketTunnel(`ws://${config.backendURL}/`);
        const client = new Guacamole.Client(tunnel);
        this.myRef.current.appendChild(client.getDisplay().getElement());

        // Mouse Events
        const mouse = new Guacamole.Mouse(client.getDisplay().getElement());
        mouse.onEach(['mousedown', 'mouseup', 'mousemove'], function sendMouseEvent(e) {
            client.sendMouseState(e.state);
        });

        // Keyboard Events
        const keyboard = new Guacamole.Keyboard(document);
        keyboard.onkeydown = function (keysym) {
            client.sendKeyEvent(1, keysym);
        };
        keyboard.onkeyup = function (keysym) {
            client.sendKeyEvent(0, keysym);
        };

        client.onstatechange = (state) => {
            if(state === 3){
                this.setState({isLoading: false, error: false})
                if(this.props.connection.type === 'RDP'){
                    this.rdpManager = new RDPClient(client);
                    this.updateAudioStatus('Audio/Microphone is managed by RDP')
                    this.updatePrinterStatus('Using RDP printing')
                    this.updatePrinterName('Guacamole Printer')
                }
                else{
                    // Set up printer for VNC
                    this.printClient = new PrintClient(config, config.userToken, `${this.props.connection.guest}`)
                    this.printClient.connect();
                    this.printClient.onStatusChange = (state) => {
                        this.updatePrinterStatus(state)
                    }
                    this.printClient.onPathReceived = (path) => {
                        this.updatePrinterName(path)
                    }
                    // Set up microphone for VNC
                    this.audioClient = new AudioClient(config, config.userToken, `${this.props.connection.ip}`)
                    this.audioClient.connect();
                    this.audioClient.onStatusChange = (state) => {
                        this.updateAudioStatus(state)
                    }

                }
            }
        }

        // Error handling
        tunnel.onerror = (error) => {
            this.setState({isLoading: false, error: true})
        }

        client.onerror = (error) => {
            this.setState({isLoading: false, error: true})
        }

        client.connect('token='+this.token+'&GUAC_AUDIO=audio/L16'); 

        this.client = client;
        this.keyboard = keyboard;
        this.mouse = mouse;
    }

    componentWillUnmount(){
        this.keyboard.onkeydown = null;
        this.keyboard.onkeyup = null;
        this.mouse.onEach = null;
        this.client.disconnect();
        if(this.audioClient)
            this.audioClient.disconnect();
        if(this.vncPrinter)
            this.vncPrinter.disconnect();
        
    }

    toggleAudio = (event) => {
        this.setState((prevState) => {
            const newState = !prevState.audioEnabled;
            if(newState)
                this.audioClient.startRecording();
            else
                this.audioClient.stopRecording();
            return {audioEnabled: newState}
        });
    }

    
    render(){
        return(
            
            <div>
                <Accordion defaultActiveKey="0" className='mx-auto mb-2'>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Toolbar</Accordion.Header>
                        <Accordion.Body className='d-flex justify-content-around align-items-start m-2'>
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
                                        <td>{this.props.connection.ip}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                        <div>
                            <span className='heading'>Audio:</span>
                            <button disabled={this.props.connection.type==='RDP' || this.state.audioStatus !== 'ready'} style={{marginBottom: '10px'}} className={this.state.audioEnabled ? 'btn btn-success' : 'btn btn-danger'} onClick={this.toggleAudio}>
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
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <div ref={this.myRef} />
                {this.state.isLoading && (
                    <div className='loading-overlay'>
                        <span>Loading ...</span>
                    </div>
                )}
                {this.state.error && (
                    <div className='error-overlay'>
                        <span style={{color: 'red'}}>An error occured</span>
                    </div>
                )}
            </div>      
        );
    }

}
export default GuacamoleStage;