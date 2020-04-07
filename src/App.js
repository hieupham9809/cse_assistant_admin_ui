import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Component} from 'react';

import AddNewActivity from './form_add_new_activity/AddNewActivity.js'
import DraggingForm from './dragging_form_add_new_activity/DraggingForm.js'
import ShowDatabase from './show_database/show_database.js'
import DetailActivity from './show_detail_update/show_detail_update.js'

import { IconContext } from "react-icons";
import {TiArrowBack} from "react-icons/ti";

import {Nav, Navbar, NavDropdown} from 'react-bootstrap'
class App extends Component{
    constructor(){
        super();
        this.currentPage = 1;
        this.state = {
            show_database : {
                is_show : true,
                currentPage: 0

            },
            show_detail : {
                is_show : false,
                activity_id : ""

            },
            show_add_form : {
                is_show : false
            },
            show_add_drag : {
                is_show : false
            }
        }
    }
    handleClickInActivity = (event, id)=>{
       
        var displayComponent = this.showComponent("show_detail");
        displayComponent.show_detail.activity_id = id;
        this.setState({
            ...displayComponent,
        })
    }
    handleReturnDatabase = () => {
        this.setState(this.showComponent("show_database"));

    }
    showComponent = (component) => {
        var showComponent = {};
        for (let key in this.state){
            if (key.substring(0, 4) === 'show'){
                showComponent[key] = this.state[key];
            }
        }

        for (let show in showComponent){
            showComponent[show].is_show = (show === component);
        }
        console.log(showComponent);
        return showComponent;
    }
    render = () => {
        return (

        <div>

            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="top-nav-bar">
                <Navbar.Brand href="#">Moderator's Panel</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        
                        <NavDropdown title="Tạo hoạt động" id="create-activity-dropdown">
                            <NavDropdown.Item className="add-new-drop-item" onClick={()=>{this.setState(this.showComponent("show_add_form"))}} >Tạo mới</NavDropdown.Item>
                            <NavDropdown.Item className="add-new-drop-item" onClick={()=>{this.setState(this.showComponent("show_add_drag"))}}>Tạo từ bài đăng có sẵn (beta)</NavDropdown.Item>
                
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Link >
                            {!this.state.show_database.is_show && <IconContext.Provider value={{ className: "back-icon" }}>
                              
                                <TiArrowBack onClick={() => this.handleReturnDatabase()}/>
                              
                            </IconContext.Provider>}
                        </Nav.Link>

                        
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            
            {this.state.show_database.is_show && <ShowDatabase 
                onClickToSelectPage={(page)=>{this.currentPage = page}}
                pageToLoad={this.currentPage}
                onClickInActivity={this.handleClickInActivity}/>}
            {this.state.show_detail.is_show 
                && this.state.show_detail.activity_id.length > 0 
                && <DetailActivity activity_id={this.state.show_detail.activity_id}/>}
            {this.state.show_add_form.is_show 
                && <AddNewActivity/>}
            {this.state.show_add_drag.is_show
                && <DraggingForm/>}

        </div>
        // <DraggingForm/>
        // <AddNewActivity/>
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
}

export default App;
