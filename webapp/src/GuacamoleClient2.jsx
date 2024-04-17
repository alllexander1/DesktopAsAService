import Guacamole from 'guacamole-common-js';
import React from 'react';

class GuacamoleStage extends React.Component {

    // Connection tokens, ToDo: implement better solution
    conn = {
        'C1': 'eyJpdiI6IlAwaGM5dEprT25nSnRHQmxjaEEzOFE9PSIsInZhbHVlIjoiM1JOeEtQMkRJdGZOWjJ4ZTBRTStwdnYvNDZRMXBNRWRhamxoZkYzdWJGUmtSWWp0OW5tK1dKendmRXIxNit2Y3A4cEI4a29IM2xDa1J1MC9JYmJDeHVrOXJYSWc5MURpOGl1NDMrazVXQ1pxbmt5SVBWa0xpRlBHYS9xbndNckpUZkg5WkhiSFJRU1ZNZUxLa3lid1lpM1k3S3NVUElza2tTLzVtZW9iUHVDNWRTWnJ0RmUxTGNleVppVEYyeXZCZHU5ZFFaNWcwRUoyN0lJem8vZVFRMzlxTy9xWWNTZ3Y3UUhhTUFTdUpwcGlFck9Dd0hweGxWdDE3WlJoT3NSVlZ3RUt5VFVuWmtsVzc1RG5USS93ZUJTNXZrQVdDcG9kT1lvNGxnLzY4ZzQ9In0%3D',
        'C2': 'eyJpdiI6IkswaitHbUlkTytpZUhTZDRnYndxM2c9PSIsInZhbHVlIjoiOXFyZVU4WWU4amw0bnQxdS9JaVFrUWFWZnhXbUl6Ums3ek1PWHpVQnlydlBGN3p2VCsxOG9NNWx3WThrb0t3QkN6SWNaWXRBTWVKQjQxSzRPcXFLTDA1MUFGV284SDV2ZjZwR1M5T2dJRU9jMlVJRUdPb0dWQ2wyUnNSZnJ1UHJJT2ZMcWtDUlVSUVJMUWNCTVlPTnp4ODVTNlp5MEhNL0pDajN6N05HalNWQmgwTHpySDBHVVdYWlJsa3h6WDRKSGxLWjBFUFQxamhJUDJlY0RhQnRZbkZiV2dGcXhxYWRvSXdtZGRFQk1zZWxUUDRKajA1d0xObG8xaWtMaC9sTmtPQUJiWFVNbnd1b3RaQVhmQ0RBK0dWRmYzV1hqSFc3QU1RMjAva21lM1pONFdDak5kbWtNUGRxVjh2RVNhMHJpK0xJblRWWFN0NVcycHBkTkRyREdYaU9nb3lJUzM1ejdNWXcvaWlnd0NqSGlHemlrM3hTaXhIT0RyTi8wNHFmIn0%3D'
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

        // Microphone
        
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