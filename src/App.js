import React from 'react';
import logo from './logo.svg';
import './App.css';

import AddNewActivity from './form_add_new_activity/AddNewActivity.js'
import DraggingForm from './dragging_form_add_new_activity/DraggingForm.js'
import ShowDatabase from './show_database/show_database.js'
import DetailActivity from './show_detail_update/show_detail_update.js'
function App() {
  return (
    // <DraggingFo/rm/>
    <AddNewActivity/>
    // <ShowDatabase/>
    // <AppDragDropDemo/>
    // <DetailActivity/>
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
