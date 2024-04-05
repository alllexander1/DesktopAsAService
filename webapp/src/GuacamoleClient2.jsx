import Guacamole from 'guacamole-common-js';
import React from 'react';

class GuacamoleStage extends React.Component {

    // Connection tokens, ToDo: implement better solution
    conn = {
        'C1': 'eyJpdiI6IkhLTkMyLzgwdWN4cEJTdXhMZDl6bFE9PSIsInZhbHVlIjoiT2tuVHR2UzVWQk1zc2pXU1M5djI2YUpGdUxabjczZUFxeXJyanY4UTlUditmU2N5MlRhWkZId2hFNFNnd3VMeS90UzIvR2RuVFBYT0VwTjdFTWtJOE5GWHlEa3U0RTQ2N3V3N09Sc0pwYUxpL0ROY2U2ajhGcmg0R1VwRE83amw3SnFPV2ZRT0M0RW55NytITFRwUkxLeFNXMEswNk5xOGNUc3FiRCswRzZ2M29lNm1wZm5XcUxoUVV5SnNDTkR0V2hpN25rcFdzZ1FCd3dmTURRemxVWlFrZkVRZmU3Smk5UE0xVUZYS29STFRUTHpXQjNQUHNPam5xQWh4T1JFakQ2ZjFkM3JmR0FUK2dkTHc0RTV2amYzWlRXNEdpSkR1UkEyTFpuNVN1dW89In0%3D',
        'C2': 'eyJpdiI6IkdlZzVRTEVlZUFJUU1BUTh0UHh2TUE9PSIsInZhbHVlIjoiNWhycFNFWXdlVUFWWjgzZHkvQ2xub3JxZ0grMTNLZUdqc3dhTHI4dzlKem9acTF6RkltR0VDdmhuaDIxVmRFeFZvRWZsM3NIdks1YlErTWEwV1k4aGkzcS9QMVJuM3NUaEJ0UVMyUlpQZVhCUTByNmN2ckl2S09ST3gxWTVNQXRjTk8zVHVZRFlOSHZvUE1kYUVubHpaVm1qTW1GdkNuNHRWQ0MyTWIwSGpXMkVFNEcxdEhjTUVYcnovcTNQVk00ZWVwTmhIaTMwZWhuNU5FYVVXdDJSZDFFSktLZFF5NzY2QlFneDdTNTQyNHJaaGt3MG9OR0NaOFhJV3FwUnptV0oweVZuaURlM3RRR0tpeGxra2Z2MkM5U0FRM0FDYXdNSE44WGt4Z3Y1T289In0%3D'
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
        client.connect('token='+this.token);

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