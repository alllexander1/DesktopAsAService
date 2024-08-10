import './App.css';
import GuacamoleStage from './GuacamoleStage.jsx';
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState } from 'react';
import Sidebar from './Sidebar.js'

function App() {

  const connections = {
    C1: {
      type: 'VNC', 
      token: 'eyJpdiI6IlhKM1ZUb01BQW1rRW5kQlRxSjM0WWc9PSIsInZhbHVlIjoiaitNKzFJMUlmd3dqRk9NZTl0WG9LUGNSRWxvc0M4bjRtOUJlc2ZXejNmWVhmSk91VVh6QnpRNHRRZmE5SUMzRVc0bk9uNm1KeVIza21pTVFJSGdENWVDZTRwMjc4a2NxaXpkVml6VTBRcXZ2ei9scndBUGJYd1Y4SjMzS2ltejRCYWRQOHYxU2Q2QXpvMTZyY0JvNDVXQS9VYTg1ZjhoNGRYM3MvR2JlSEZwTDR0dlpTOUJoYzJ4N3Y3YzBsVExMSmFUK3JnR1dnUEx2bmt5RTBVQ1ZmM2Z3SHoxMjlYaUFaV1Y2RE9CS2hETzkzVzEvbnNZekhZZEVheEZhaWpDekNoUlYxL2o1U1JuZzNQWFZXTWVOS3c9PSJ9', 
      address: '192.168.178.28',
      os: 'Linux Mint'
    },
    C2: {
      type: 'RDP', 
      // Working token:
      //token: 'eyJpdiI6ImlDcFVhODNOR0ZkMEZkTG44SGVzRmc9PSIsInZhbHVlIjoib20xQ0NacFdtZTFDd0VIRGR1Q1hqb0dzRFR3WEVlQ3FmcUpMTmk0Ri9aWGJKbXdjaGR3WTIxVEs3NWljb1RaRy82UWJUSlM1UDZDWkNMU1k0UTNlc3VrbzJtK3VWZW9aVXdYWjlhM2VkdXRVaG9TTUVpSHdRdFF4dHIvU25sMkdJVll0VlF4U0p1WDdPd21DdTZBWUtiMGQ1STNxU2FGL0N1VTNiRmxKRjNTc0o3eEs2YkpzQnhsRDhzbGtrY25rTFVuMWFVc0NwY1E2R0phR1c0ZExkcjZGeHA2U3dkTGlNZlNkU3RxNzdpd3MvN0NVUVJZS0x4aDhuOWZqT0dKUExHTSt0MUlya1owVEp3QjBKdnNDdzdyYTAzRldvN3lmVVBKVERjQXBHNElnMERSK01ieGt2TjV5ZmxvN2ljOStwTFV3aHljazBzK3NBVWpNOEw2cWU0S0lCdm1rZVVpZGNnYm5EdTVTSktFPSJ9', 
      // Testing token
      token: 'eyJpdiI6InY1YVhSSjlhOTVSZDl3Ti9jVDg5QXc9PSIsInZhbHVlIjoidkR4VitybXBiRUVqNVRvM1MySzJnU01YL3ovQ3o4NG1QaHRmUTJDVlNjeStyZlI5WitzdUJPQ0VTUjRjaUJVVnU4clN1WDlHK1dsazBiT0FpT0t5TUEzQnV2bXNDOWFFdnkyTW1Qb2t1LzlqeXRySVRzeWlxMFlzejFIQ3BSZmxzU1hPSkNOc3d5T2tHQ1FQVm94N1NIb3ZIZ0VkK0UxSHpqVWVNS1Z1WHhaMGhUN0VXZ2pSVUh3Y1JSVzQ1d2ZLL0VBSE1lNkdBTThJRU9CVVFtVEpMK1IzNEQwUWkyZ1ZkMmtpbDZIeUtvVEo0QjBkMW9FUDJVMk9tbXRRUXhnMzd4K2F3MnYvVVhGVEZUMndnZkp5cW8xYnhiRTRaNGVuRTRjN2krRGJsRzRjYW93TWhZSjkzWnBYbXBMMHlYYzIrTEp1bVo2eEtmc0VuVUhZdmZuOEFYNXlmL0VHbTg0Z0N0VUZNWWZtVmMxR2lKbExKU0lxMlp3SGlOWk9TWkhzMU9Vcm0rV1Q3c25BYUFaTnhsVUxYTWs2d20rdkZYcFduWTN3cytrbHNrS3o5U21FUEVaQmVTTSttcGVDWldNNiJ9',
      address: '192.168.178.30',
      os: 'Windows 10 Pro'
    }
};

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
            <option value="C1">Linux Mint - VNC</option>
            <option value="C2">Windows 10 - RDP</option>
          </select>
        </div> 
        <div className="d-flex justify-content-center">
          <GuacamoleStage connection={connections[selectedOption]} key={selectedOption}></GuacamoleStage>
        </div>
      </div>  
    </div>
  );

}

export default App;


