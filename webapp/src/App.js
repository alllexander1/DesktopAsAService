import './App.css';
import FileManager from './FileManager';
import Sidebar from './Sidebar';
import GuacamoleStage from './GuacamoleClientVNC2';
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState } from 'react';

function App() {

  const [selectedOption, setSelectedOption] = useState('C1');

  const handleSelectChange = (event) => { 
    setSelectedOption(event.target.value);
  };

  /*return (
    <div className='App'>
      <div className='d-flex-column justify-content-center align-items-center' >
        <h1 className="mb-4">Desktop As A Service - Prototype</h1>
        <div className="d-flex justify-content-center align-items-baseline" >
          <span className="me-4">Please select a connection:</span>
          <select className="form-select w-auto mb-4" value={selectedOption} onChange={handleSelectChange}>     
            <option value="C1">Linux Mint - VNC</option>
            <option value="C2">Windows 10 - RDP</option>
          </select>
        </div> 
        <div className="d-flex justify-content-center">
          <GuacamoleStage connection={selectedOption} key={selectedOption}></GuacamoleStage>
          <FileManager style={{marginLeft: '200px'}}></FileManager>
        </div>
      </div>  
    </div>
  );*/

  return (
    <div className='App'>
      <div className='d-flex-column justify-content-center align-items-center' >
        <h1 className="mb-4">Desktop As A Service - Prototype</h1>
        <div className="d-flex justify-content-center align-items-baseline" >
          <span className="me-4">Please select a connection:</span>
          <select className="form-select w-auto mb-4" value={selectedOption} onChange={handleSelectChange}>     
            <option value="C1">Linux Mint - VNC</option>
            <option value="C2">Windows 10 - RDP</option>
          </select>
        </div> 
        <div className="d-flex justify-content-center">
          <GuacamoleStage connection={selectedOption} key={selectedOption}></GuacamoleStage>
          <Sidebar></Sidebar>
        </div>
      </div>  
    </div>
  );

}

export default App;


