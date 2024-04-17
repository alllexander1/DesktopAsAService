import Guacamole from 'guacamole-common-js';
import React from 'react';

class GuacamoleStage extends React.Component {

    // Connection tokens, ToDo: implement better solution
    conn = {
        //Pass mint
        //'C1': 'eyJpdiI6IkpOcEVFVUFoRjVVeDV6czNrVU1pTEE9PSIsInZhbHVlIjoiUnBQZHBFZEFlbTU5NE5jZSt4SE8wSC9ybmZpaG1VTUF5V3pidllJOVZzVmdCazVMM2lMQnRwMlo5YW0wTHVMUkxrMWtWbnBSb0RVNEgxbFJMb2g4K2FNcnNkbnFTZGQva1pMSjJIL1h4Mmx6WFNlZVhZaHBlVmw3bFlnVXJ3R1BQZUdNaEhZNjJkWk1OdjVJRzR1OFczYmZiTHh3SmV3U1VEeTNCMUp0dTBHdDJFNEFFY1NodGh2ek1Gd3lVT2hBIn0%3D',
        //Pass vnc
        'C1': 'eyJpdiI6Ikd0RG1lSS8veUkvUStzanNiYVNZM1E9PSIsInZhbHVlIjoieVJpR3pSc3lOTlAyaHZUdXNJNDVYc1EyR0Fvb0c4KzB0RGxLanh3bi9KUmxiRitEZXZqaWM0SEgzdDdIWC9WNzg1MEpsN05mRmcwV3JiU0lwWnhLN2g4NnFNUFVMM3VCR2JqL2JZaUlsMWd3UGpWODlrN3hIUldoVnhBS004WEdWSS9kU1JGRG1XV3hmcUp6NFU1NlN6aEVZdDFmZWNSNXlvMWpzWGtnKzZBNUc3dVh4bndGUU1mQnJ3Y0NqM1hkQnZ5NEh5THBTZDFmaXRlN3cxb3JVUER0Q3JkYU5HcGM0NG1RcE9KREhmNkhyOVdTY1FYVTlVOGpWQUxqbmtUamNjRVRPWW9SaG5WZTUrVXJuSDNrNi8yTHlxYnhMZGlQcm1Ta3p1SkdOUUE9In0%3D'
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

        // Audio
        client.onaudio = function(stream, type){

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