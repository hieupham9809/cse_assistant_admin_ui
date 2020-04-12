import React, {Component} from 'react';
import {Form, Modal, Button, Alert} from 'react-bootstrap'
import { LOGIN_API } from '../dragging_form_add_new_activity/constants';
import { setUserSession } from '../utils/utils.js'
import axios from 'axios';

class LoginForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			is_logged_in: false,
            is_invalid: false,
            is_error: false,
            username: "",
            password: ""
		}
	}
	returnToHome = () => {
        
        // this.props.history.push("/");
        this.props.loginCallback({})
        
    }
    handleResponseAlert = (response) => {
    	var state = {
    		is_logged_in: false,
    		is_invalid: false,
    		is_error: false
    	}
		if (Object.keys(state).includes(response)){
			state[response] = true;

		}
		
		this.setState({...state});
    }
    handeInputLoginChange = (event, field) => {

        if (["username", "password"].includes(field)){
            const login = {...this.state.login};

            login[field] = event.target.value;
            
            this.setState({
                ...login
            });
        }
        
    }
    handleLogin = () => {
    	
    	axios.post(LOGIN_API, {
			"username" : this.state.username.trim(),
			"password" : this.state.password.trim()
			}).then((res)=>{
				
				setUserSession(res.data.access_token);
				this.handleResponseAlert("is_logged_in");
				this.props.loginCallback({is_logged_in: true});
				
			}, 
			(error)=> {
				
				if (error.response){
					switch (error.response.status) {
						case 401:
							this.handleResponseAlert("is_invalid");
							break;
						default:
							this.handleResponseAlert("is_error");
							break;
					}
				}
			});
    }
	render = ()=> {
		return (
			<Modal 
                show={true}
                
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                      Đăng nhập
                    </Modal.Title>
                    
                </Modal.Header>
                <Modal.Body>
                	<p>
				      Vui lòng đăng nhập để tiếp tục
				    </p>
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
                      <div className="text-center">
	                      <Button variant="primary" onClick={this.handleLogin}>
	                        Đăng nhập
	                      </Button>
                      </div>
                      {this.state.is_logged_in && <Alert variant="success"> Đăng nhập thành công!</Alert>}
                      {this.state.is_invalid && <Alert variant="danger">Tên đăng nhập hoặc mật khẩu không chính xác</Alert>}

                      {this.state.is_error && <Alert variant="danger">Có lỗi xảy ra, vui lòng thử lại sau</Alert>}

                    </Form>
                </Modal.Body>
                
            </Modal> )
	}
}


export default LoginForm;

