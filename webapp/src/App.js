import './App.css';
import GuacamoleStage from './GuacamoleClient2';
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState } from 'react';

function App() {

  const [selectedOption, setSelectedOption] = useState('C1');

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className='App'>
      <div className='d-flex-column justify-content-center align-items-center' >
        <h1 className="mb-4">Desktop As A Service - Prototype</h1>
        <div className="d-flex justify-content-center align-items-baseline" >
          <span className="me-4">Please select a connection:</span>
          <select className="form-select w-auto mb-4" value={selectedOption} onChange={handleSelectChange}>     
            <option value="C1">Linux Mint - RDP</option>
            <option value="C2">Windows 10 - RDP</option>
          </select>
        </div>      
        <div className="d-flex justify-content-center">
          <GuacamoleStage connection={selectedOption} key={selectedOption}></GuacamoleStage>
        </div>
      </div>  
    </div>
  );
}


export default App;
