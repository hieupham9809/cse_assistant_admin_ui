import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Component} from 'react';

import AddNewActivity from './form_add_new_activity/AddNewActivity.js'
import DraggingForm from './dragging_form_add_new_activity/DraggingForm.js'
import ShowDatabase from './show_database/show_database.js'
import DetailActivity from './show_detail_update/show_detail_update.js'
import LoginForm from './login/login_form.js'
import {setUserSession, removeUserSession, getToken} from './utils/utils.js'
import { IconContext } from "react-icons";
import {TiArrowBack} from "react-icons/ti";
import { BrowserRouter, Switch, Route, NavLink, Redirect } from 'react-router-dom';
import axios from 'axios';
import { GET_DB_API } from './dragging_form_add_new_activity/constants';

import {Form, Modal, Nav, Navbar, NavDropdown, Button} from 'react-bootstrap'
// const MyLoginDialog = (props) => {
//       return (
//         <LoginForm 
//           // toggleSidebarOn={this.toggleSidebarOn.bind(this)}
//           loginCallback={(data)=>{this.handleLoginCallback(data)}}
//           {...props}
//         />
//       );
//     }
class App extends Component{
    
    MyLoginDialog = (props) => {
      return (
        <LoginForm 
          // toggleSidebarOn={this.toggleSidebarOn.bind(this)}
          loginCallback={(data)=>{this.handleLoginCallback(data)}}
          {...props}
        />
      );
    }
    constructor(){
        super();
        this.data = {
                    current_page: 1,
                    is_searching: false,
                    current_search_condition: null
                };
        this.state = {
            redirect: null,
            is_logged_in: null,
            show_database : {
                is_show : true,
                data: {
                    currentPage: 1,
                    currentSearchPage:1,
                    currentSearchCondition: null
                }
                

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
    componentDidMount(){
        console.log('app componentDidMount');
        axios.get(GET_DB_API + '1', { headers:
            {
                "Authorization": "JWT " + getToken()
            }
        }).then((res)=> {
            // this.setState({is_logged_in: true});
            this.showLoginDialog(false);

        }, (err)=> {
            // console.log(err.message);
            this.showLoginDialog(true);
        })
    }
    handleClickInActivity = (event, id)=>{
       
        var displayComponent = this.showComponent("show_detail");
        displayComponent.show_detail.activity_id = id;
        this.setState({
            ...displayComponent,
        })
    }
    handleNotifyCurrentPageAndCondition = (data) => {
        if (data.is_logged_in != null && !data.is_logged_in){
            this.showLoginDialog(true);
        } else{
            this.data = data;
        }
    }
    handleLoginCallback = (data) => {
        this.showLoginDialog(!data.is_logged_in);
        // this.setState({is_logged_in: data.is_logged_in})
    }
    handleLogout = () => {
        removeUserSession();
        // this.setState({
        //     is_logged_in: false
        // });
        this.showLoginDialog(true);
    }
    reset_save_data = () => {
        this.data = {
                    current_page: 1,
                    is_searching: false,
                    current_search_condition: null
                };
    }
    
    handleReturnDatabase = () => {
        if (this.data.is_searching && this.state.show_database.is_show){
            this.reset_save_data();
        }
        this.setState(this.showComponent("show_database"));

    }
    showLoginDialog = (isShow) => {
        this.setState({ is_logged_in: !isShow });
        // console.log('redirect: login')
        
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
        
        return showComponent;
    }
    render = () => {
        
        return (

        <div>
        <BrowserRouter>

            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="top-nav-bar">
                <Navbar.Brand href="#">Moderator's Panel</Navbar.Brand>
                <Nav.Link >
                    <IconContext.Provider value={{ className: "back-icon" }}>
                      
                        <TiArrowBack onClick={() => this.handleReturnDatabase()}/>
                      
                    </IconContext.Provider>
                </Nav.Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        
                        <NavDropdown title="Tạo hoạt động" id="create-activity-dropdown">
                            <NavDropdown.Item className="add-new-drop-item" onClick={()=>{this.setState(this.showComponent("show_add_form"))}} >Tạo mới</NavDropdown.Item>
                            <NavDropdown.Item className="add-new-drop-item" onClick={()=>{this.setState(this.showComponent("show_add_drag"))}}>Tạo từ bài đăng có sẵn (beta)</NavDropdown.Item>
                
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Form inline>
                            {this.state.is_logged_in 
                                ? <Button 
                                    onClick={()=>{this.handleLogout()}}
                                    className="btn-login" 
                                    variant="outline-light">Đăng xuất</Button>
                                : <Button 
                                    onClick={()=>{this.showLoginDialog(true)}}
                                    className="btn-login" 
                                    variant="outline-light">Đăng nhập</Button>}
                        </Form>
                        
                        
                    </Nav>
                </Navbar.Collapse>

            </Navbar>

            {this.state.show_database.is_show && <ShowDatabase 
                notifyCurrentPageAndCondition={(data)=>{this.handleNotifyCurrentPageAndCondition(data);}}
                data={this.data}
                onClickInActivity={this.handleClickInActivity}/>}
            {this.state.show_detail.is_show 
                && this.state.show_detail.activity_id.length > 0 
                && <DetailActivity activity_id={this.state.show_detail.activity_id}/>}
            {this.state.show_add_form.is_show 
                && <AddNewActivity/>}
            {this.state.show_add_drag.is_show
                && <DraggingForm/>}
            {this.state.is_logged_in != null && !this.state.is_logged_in && <LoginForm 
                loginCallback={(data)=>{this.handleLoginCallback(data)}}
            />}
            {/*this.state.redirect && <Redirect to={this.state.redirect} />*/}
            {/*<Switch>
                          
                          <Route exact path="/login" render={this.MyLoginDialog}
                        />
                          
                        </Switch>*/}
            
        </BrowserRouter>
        {/*<Modal 
                        show={true}
                        onHide={()=>{this.showLoginDialog(false)}}
                        size="sm"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered>
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                              Đăng nhập
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                              <Form.Group controlId="formBasicUsername">
                                <Form.Label>Tên đăng nhập</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="..."
                                    onChange={(event)=>{this.handeInputLoginChange(event, "username")}}
        
                                     />
                                
                              </Form.Group>
        
                              <Form.Group controlId="formBasicPassword">
                                <Form.Label>Mật khẩu</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="..."
                                    onChange={(event)=>{this.handeInputLoginChange(event, "password")}}
        
                                     />
                              </Form.Group>
                              
                              <Button variant="primary" type="submit">
                                Đăng nhập
                              </Button>
                            </Form>
                        </Modal.Body>
                        
                    </Modal>*/}
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
