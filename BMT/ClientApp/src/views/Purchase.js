import React from 'react'
import { useState } from 'react';

const Purchase = () => {
  const [name, setName] = useState('');

  const onchangename = (event) => {
    const {value } = event.target;
    setName(value);
    
  }
  const showvalue = () => {
    alert(name);

  }
  return (
    <>
      <input type='text' onChange={onchangename} value={name} />
      <button onClick={showvalue}>Show</button>
    </>
  );
}

export default Purchase
