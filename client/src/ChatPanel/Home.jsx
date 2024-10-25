import React from 'react';
import './Home.css'
import Right from './RightSide/Right';
import Left from './LeftSide/Left';

function Home() {
  return (
      <div className="fullContainer">
      <h2>Blabber-Bubble</h2>
      <div className="sideStructure">
         <Left />
        <Right /> 
      </div>
    </div>
  )
}

export default Home
