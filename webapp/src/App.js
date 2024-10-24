import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';
import React, { useEffect, useState } from 'react';
import GuacamoleStage from './GuacamoleStage.jsx';


function App() {

  const [connection, setConnection] = useState({
    token: '',
    type: '',
    ip: '',
    guest: ''
  });

  const [reloadKey, setReloadKey] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setConnection(prevConnection => ({
      ...prevConnection,
      [name]: value
    }));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setReloadKey((prevKey) => prevKey + 1);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false)
  }

  return(
    <div className='App'>
      <div className='d-flex-column justify-content-center align-items-center'>
        <h1 className="mb-4">Desktop As A Service - Prototype</h1>
        <Accordion defaultActiveKey="0" className='connection-form mx-auto' style={{ width: '70%' }}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Connect to Desktop</Accordion.Header>
            <Accordion.Body>
              <form onSubmit={handleSubmit} className='mx-auto'>
                <div className="mb-3">
                  <label className="form-label">Token</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="token" 
                    value={connection.token} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Connection Type</label>
                  <select 
                    className="form-select" 
                    name="type" 
                    value={connection.type} 
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Connection Type</option>
                    <option value="RDP">RDP</option>
                    <option value="VNC">VNC</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Machine Address</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="ip" 
                    value={connection.ip} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                {connection.type === 'VNC' && (
                  <div className="mb-3">
                    <label className="form-label">Guest Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="guest"
                      value={connection.guest}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
                <div>
                  <button disabled={isSubmitted} type="submit" className="btn btn-primary" style={{width: '100px'}}>Connect</button>
                  <button className="btn btn-danger ms-3" disabled={!isSubmitted} style={{ width: '100px' }} onClick={handleClose}>Close</button>
                </div>  
              </form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        {isSubmitted && (
          <div className="d-flex justify-content-center">
            <GuacamoleStage connection={connection} key={reloadKey} />
          </div>
        )}
      </div>
    </div>
  );
}
export default App;
