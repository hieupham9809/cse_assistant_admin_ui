import React from 'react';
import logo from './logo.svg';
import './App.css';
import AppDragDropDemo from './AppDragDropDemo' 
import AddNewActivity from './form_add_new_activity/AddNewActivity.js'
function App() {
  return (
    <AddNewActivity/>
    // <AppDragDropDemo/>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
