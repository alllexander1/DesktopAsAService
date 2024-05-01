import React, { useState } from 'react';
import FileManager from './FileManager';
import { Button, Container, Collapse } from 'react-bootstrap';

function Sidebar() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Button
        //className='top-0 start-0'
        style={{ position: 'absolute', top: 0, left: 0,  width: '170px', marginLeft: '10px'}}
        onClick={toggleVisibility}
        variant="primary"
      >
        {isVisible ? 'Hide PDF Manager' : 'Show PDF Manager'}
      </Button>
      {isVisible ? (
        <div>
          <FileManager></FileManager>
        </div>
      ) : null}
      
    </div>
  );
}

export default Sidebar;
