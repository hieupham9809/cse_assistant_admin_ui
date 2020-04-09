import React, { Component } from 'react';
import './AddNewActivity.css';
import validate from './validator.js';
import { Button, Modal, Alert } from 'react-bootstrap';
import { Form, Row, Col } from 'react-bootstrap'
import { INSERT_API } from '../dragging_form_add_new_activity/constants';

import TextInput from './TextInput';
import TextArea from './TextArea';
import { IconContext } from "react-icons";
import {FaPlusCircle} from "react-icons/fa";
import {FaMinusCircle} from "react-icons/fa";
import axios from 'axios';

class FormComponent extends Component {
  
	constructor(){
		super();
    this.associateInit = {
                time: {
                  value: '',
                  valid: true,
                  touched: false,
                  validationRules: {
                    maxLength: 200
                  },
                  placeholder: '08h30 sáng 26/03/2020, ...'
                },
                works: {
                  value: '',
                  valid: true,
                  touched: false,
                  validationRules: {
                    maxLength: 200
                  },
                  placeholder: 'làm công trình giao thông nông thôn, dạy học, hỗ trợ tổ chức sự kiện, ...'
                },
                name_place: {
                  value: '',
                  valid: true,
                  touched: false,
                  validationRules: {
                    maxLength: 200
                  },
                  placeholder: 'nhà thi đấu đa năng ĐH Bách Khoa, Hội trường A5 cơ sở Lý Thường Kiệt, ...'
                },
                address: {
                  value: '',
                  valid: true,
                  touched: false,
                  validationRules: {
                    maxLength: 200
                  },
                  placeholder: '268 Lý Thường Kiệt, ...'
                }
              }
		this.state = {
          formIsValid : false,    
	      	formGeneralControls: {
	          	name_activity: {
		            value: '',
		            placeholder: 'mùa hè xanh 2020, tiếp sức mùa thi 2020, nâng cao kỹ năng giao tiếp với nhà tuyển dụng, ...',
		            valid: false,
		            touched: false,
		            validationRules: {
		                minLength: 5,
                    maxLength: 500,
		                isRequired: true
		            }
	  	        },
              type_activity: {
                value: '',
                placeholder: 'chiến dịch, chương trình, hội thảo, ...',
                valid: true,
                touched: false,
                validationRules: {
                    maxLength: 500
                }
              },
              holder: {
                value: '',
                valid: true,
                touched: false,
                validationRules: {
                    maxLength: 500
                },
                placeholder: 'Đoàn thanh niên - Hội sinh viên khoa Khoa học và Kỹ thuật Máy tính - ĐH Bách Khoa'
              },
              contact: {
                value: '',
                valid: true,
                touched: false,
                validationRules: {
                    maxLength: 500
                },
                placeholder: 'đồng chí Nguyễn Văn A - 09123456789, Ban Truyền thông khoa KH&KT Máy tính'
              },
              reward: {
                value: '',
                valid: true,
                touched: false,
                validationRules: {
                    maxLength: 500
                },
                placeholder: '5 điểm rèn luyện, 0.5 ngày CTXH, ...'
              },
              register: {
                value: '',
                valid: true,
                touched: false,
                validationRules: {
                    maxLength: 500
                },
                placeholder: 'điền vào link xxxxxx, đến văn phòng 602H6 để đăng ký, ...'
              },
              joiner: {
                value: '',
                valid: true,
                touched: false,
                validationRules: {
                    maxLength: 500
                },
                placeholder: 'sinh viên khoa KH&KT Máy tính ĐH Bách Khoa, số lượng tham gia tối đa 200 sinh viên, ...'
              },
              time: {
                value: '',
                valid: true,
                touched: false,
                validationRules: {
                    maxLength: 500
                },
                placeholder: '08h30 sáng 26/03/2020, ...'
              },
              name_place: {
                value: '',
                valid: true,
                touched: false,
                validationRules: {
                    maxLength: 500
                },
                placeholder: 'nhà thi đấu đa năng ĐH Bách Khoa, Hội trường A5 cơ sở Lý Thường Kiệt, ...'
              },
              address: {
                value: '',
                valid: true,
                touched: false,
                validationRules: {
                    maxLength: 500
                },
                placeholder: '268 Lý Thường Kiệt, ...'
              },
              works: {
                value: '',
                valid: true,
                touched: false,
                validationRules: {
                    maxLength: 500
                },
                placeholder: 'dọn dẹp nghĩa trang, ...'
              }
	      	},
          associateControls: {
            associateValues : [
              this.mapCopy(this.associateInit)
            ]
          },
          isShowConfirmDialog: false,
          isShowSuccessDialog: false,
          isShowErrorDialog: false
	    } 
	}
  mapCopy = (object) => {
    return Object.keys(object).reduce(function (output, key) {
      output[key] = object[key];
      
      return output;
      }, {})
  }
  deleteRowHandle = (idx) => {
    
    const updatedAssociatedControls = {
      ...this.state.associateControls
    };

    const updatedAssociatedValues = updatedAssociatedControls.associateValues;
    if (idx >=0 && idx < updatedAssociatedValues.length){
      updatedAssociatedValues.splice(idx, 1);
    }

    updatedAssociatedControls.associateValues = updatedAssociatedValues;
    this.setState({
      associateControls: updatedAssociatedControls
    });
    

  }
  addMoreRowHandle = () => {
    const updatedAssociatedControls = {
      ...this.state.associateControls
    };

    const updatedAssociatedValues = updatedAssociatedControls.associateValues;
    updatedAssociatedValues.push(this.mapCopy(this.associateInit));
    
    updatedAssociatedControls.associateValues = updatedAssociatedValues;

    this.setState({
        associateControls: updatedAssociatedControls
    });
  }
  changeAssociateValue = event => {
    var idx = event.target.getAttribute('data-key');
    var name = event.target.name;
    var value = event.target.value;
    
    const updatedAssociatedControls = {
      ...this.state.associateControls
    };

    const updatedAssociatedValues = updatedAssociatedControls.associateValues;
    
    if (idx < updatedAssociatedValues.length){
      const updatedAssociatedElement = {
        ...updatedAssociatedValues[idx][name]
      }
      updatedAssociatedElement.value = value;
      updatedAssociatedElement.touched = true;
      updatedAssociatedElement.valid = validate(value, updatedAssociatedElement.validationRules);
      updatedAssociatedValues[idx][name] = updatedAssociatedElement;
      
      updatedAssociatedControls.associateValues = updatedAssociatedValues;
      // let formIsValid = true;
      // for (let associateElementIdx in updatedAssociatedValues){
      //   for (let fieldElement in updatedAssociatedValues[associateElementIdx]){
      //     formIsValid = updatedAssociatedValues[associateElementIdx][fieldElement].valid && formIsValid;
      //   }

      // }
      
      this.setState({
        associateControls: updatedAssociatedControls
      })

    }
  }
  // changeAssociateValue = event => {
  //   var idx = event.target.getAttribute('data-key');
  //   var name = event.target.name;
  //   var value = event.target.value;
    
  //   const updatedAssociatedControls = {
  //     ...this.state.associateControls
  //   };

  //   const updatedAssociatedValues = updatedAssociatedControls.associateValues;
    
  //   if (idx < updatedAssociatedValues.length){
  //     const updatedAssociatedElement = {
  //       ...updatedAssociatedValues[idx][name]
  //     }
  //     updatedAssociatedElement.value = value;
  //     updatedAssociatedElement.touched = true;
  //     updatedAssociatedElement.valid = validate(value, updatedAssociatedElement.validationRules);
  //     updatedAssociatedValues[idx][name] = updatedAssociatedElement;
      
  //     updatedAssociatedControls.associateValues = updatedAssociatedValues;
  //     let formIsValid = true;
  //     for (let associateElementIdx in updatedAssociatedValues){
  //       for (let fieldElement in updatedAssociatedValues[associateElementIdx]){
  //         formIsValid = updatedAssociatedValues[associateElementIdx][fieldElement].valid && formIsValid;
  //       }

  //     }
      
  //     this.setState({
  //       associateControls: updatedAssociatedControls,
  //       formIsValid: formIsValid
  //     })

  //   }
  // }
  isDisableForm = () => {
    const formGeneralControls = {...this.state.formGeneralControls};

    const associateControls = {...this.state.associateControls}
    const associateValues = associateControls.associateValues;

    let formIsValid = true;

    for (var slot in formGeneralControls){
      const updatedFormElement = formGeneralControls[slot];
      const valid = validate(updatedFormElement.value, updatedFormElement.validationRules);
      formGeneralControls[slot].valid = valid;
      // console.log('slot: ' + slot);
      // console.log(valid);
      if (!valid){
        formIsValid = false;
      }
    }

    for (let associateElementIdx in associateValues){
        for (let fieldElement in associateValues[associateElementIdx]){
          formIsValid = associateValues[associateElementIdx][fieldElement].valid && formIsValid;
        }
    }   

    return !formIsValid;

  }
  changeHandler = event => {
        // console.log('onchange handler called')
        const name = event.target.name;
        const value = event.target.value;
        
        const updatedControls = {
          ...this.state.formGeneralControls
        
        };
        const updatedFormElement = {
          ...updatedControls[name]
        };
        
        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = validate(value, updatedFormElement.validationRules);
        updatedControls[name] = updatedFormElement;
        
        this.setState({
          formGeneralControls: updatedControls
        }); 

    }
	// changeHandler = event => {
 //      	// console.log('onchange handler called')
 //      	const name = event.target.name;
 //      	const value = event.target.value;
        
 //        const updatedControls = {
 //        	...this.state.formGeneralControls
	      
 //      	};
 //      	const updatedFormElement = {
	//         ...updatedControls[name]
 //      	};
        
 //      	updatedFormElement.value = value;
 //      	updatedFormElement.touched = true;
 //      	updatedFormElement.valid = validate(value, updatedFormElement.validationRules);
 //      	updatedControls[name] = updatedFormElement;
 //        let formIsValid = true;
 //        for (let inputIdentifier in updatedControls) {

 //          formIsValid = updatedControls[inputIdentifier].valid && formIsValid;
 //        } 
 //      	this.setState({
	//         formGeneralControls: updatedControls,
 //          formIsValid: formIsValid
 //      	});	

 //  	}
    showSuccessDialog = (isShow) => {
      this.setState({isShowSuccessDialog: isShow});
    }
    showErrorDialog = (isShow) => {
      this.setState({isShowErrorDialog: isShow});
    }
    showConfirmDialog = (isShow)=> {
      if (isShow){
        this.setState({isShowConfirmDialog: true})
      } else {
        this.setState({isShowConfirmDialog: false})
      }
    }
  	formSubmitHandler = () => {
    	console.log(this.state.associateControls)
      const formGeneralControls = {
        ...this.state.formGeneralControls
      };
      
      
      const associateValuesControls = {
        ...this.state.associateControls
      }
      var listAssociateValues = this.filterAssociateValue(associateValuesControls.associateValues)
      var body_request_object = {
        activity: {
          
        }
      }

      for (let field in formGeneralControls){
        body_request_object.activity[field] = this.convertRawValueToArray(formGeneralControls[field].value);
      }
      body_request_object.activity["time_works_place_address_mapping"] = listAssociateValues;
      console.log(body_request_object);
      axios.post(INSERT_API,
        body_request_object).then((res)=>{
            console.log('id: ' + res.data.id);
            this.setState({
              isShowConfirmDialog: false,
              isShowSuccessDialog: true,
              isShowErrorDialog: false
            })
          },
            (error)=>{
              
              this.setState({
                isShowConfirmDialog: false,
                isShowSuccessDialog: false,
                isShowErrorDialog: true
              })

            }
          );

  	}
    convertRawValueToArray = (rawValue)=> {
      var trimmedValue = rawValue.trim();
      if (trimmedValue !== ''){
        return trimmedValue.split(',').map((elememt)=>{return elememt.trim()});
      }
      return [];

    }
    filterAssociateValue = (listValue) => {
      
      var finalList = []
      for (let index in listValue){
        var value = listValue[index]
        
        var isValid = false;
        for (let field in value){
          
          isValid |= (value[field].value.trim() !== '') 
        }

        if (isValid){
          var validElement = {}
          validElement.time = this.convertRawValueToArray(value.time.value);
          validElement.works = this.convertRawValueToArray(value.works.value);
          validElement.name_place = this.convertRawValueToArray(value.name_place.value);
          validElement.address = this.convertRawValueToArray(value.address.value);
          finalList.push(validElement);
        }
      }

      return finalList;
    }


	render = () => {
        var changeAssociateValue = this.changeAssociateValue;
        var deleteRowHandle = this.deleteRowHandle;
        var newLocal = this;
        var isDisableForm = this.isDisableForm();

      	return (
	        <Form className="main-detail-display">
            <h6><i>* Lưu ý nếu có nhiều giá trị thì nhập các giá trị cách nhau bởi dấu phẩy</i></h6>
            <h6><b>I. Thông tin chung của hoạt động</b> <i>(mỗi trường thông tin không quá 500 ký tự)</i></h6>

              <Form.Group className="form-group-custom">
                <Form.Label><b>Tên hoạt động</b></Form.Label>
                <TextInput name="name_activity" 
                           placeholder={this.state.formGeneralControls.name_activity.placeholder}
                           value={this.state.formGeneralControls.name_activity.value}
                           onChange={this.changeHandler}
                           touched={this.state.formGeneralControls.name_activity.touched ? 1 : 0}
                           valid={this.state.formGeneralControls.name_activity.valid ? 1 : 0}/>
                <Form.Text>Tên đầy đủ dùng để phân biệt với những hoạt động khác</Form.Text>
              </Form.Group>
              <Row className="row-custom">
                <Col className="column1" sm="4">
                  <Form.Group className="form-group-custom">
                    <Form.Label><b>Loại hoạt động</b></Form.Label>
                    <TextInput name="type_activity" 
                               placeholder={this.state.formGeneralControls.type_activity.placeholder}
                               value={this.state.formGeneralControls.type_activity.value}
                               onChange={this.changeHandler}
                               touched={this.state.formGeneralControls.type_activity.touched ? 1 : 0}
                               valid={this.state.formGeneralControls.type_activity.valid ? 1 : 0}/>
                    <Form.Text>Phân loại hoạt động giúp dễ dàng tìm kiếm hoạt động hơn</Form.Text>
                  </Form.Group>
                </Col>
                <Col className="column2" sm="8">
                  <Form.Group className="form-group-custom">
                    <Form.Label><b>Ban tổ chức</b></Form.Label>
                    <TextInput name="holder" 
                               placeholder={this.state.formGeneralControls.holder.placeholder}
                               value={this.state.formGeneralControls.holder.value}
                               onChange={this.changeHandler}
                               touched={this.state.formGeneralControls.holder.touched ? 1 : 0}
                               valid={this.state.formGeneralControls.holder.valid ? 1 : 0}/>
                    <Form.Text>Ban tổ chức, đại diện đứng ra tổ chức hoạt động </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="form-group-custom">
                  <Form.Label><b>Thời gian</b></Form.Label>
                  <TextArea name="time" 
                             placeholder={this.state.formGeneralControls.time.placeholder}
                             value={this.state.formGeneralControls.time.value}
                             onChange={this.changeHandler}
                             touched={this.state.formGeneralControls.time.touched ? 1 : 0}
                             valid={this.state.formGeneralControls.time.valid ? 1 : 0}/>
          
              </Form.Group>
              <Form.Group className="form-group-custom">
                  <Form.Label><b>Tên địa điểm</b></Form.Label>
                  <TextArea name="name_place" 
                             placeholder={this.state.formGeneralControls.name_place.placeholder}
                             value={this.state.formGeneralControls.name_place.value}
                             onChange={this.changeHandler}
                             touched={this.state.formGeneralControls.name_place.touched ? 1 : 0}
                             valid={this.state.formGeneralControls.name_place.valid ? 1 : 0}/>
          
              </Form.Group>
              <Form.Group className="form-group-custom">
                  <Form.Label><b>Địa chỉ</b></Form.Label>
                  <TextArea name="address" 
                             placeholder={this.state.formGeneralControls.address.placeholder}
                             value={this.state.formGeneralControls.address.value}
                             onChange={this.changeHandler}
                             touched={this.state.formGeneralControls.address.touched ? 1 : 0}
                             valid={this.state.formGeneralControls.address.valid ? 1 : 0}/>
          
              </Form.Group>
              <Form.Group className="form-group-custom">
                  <Form.Label><b>Công việc</b></Form.Label>
                  <TextArea name="works" 
                             placeholder={this.state.formGeneralControls.works.placeholder}
                             value={this.state.formGeneralControls.works.value}
                             onChange={this.changeHandler}
                             touched={this.state.formGeneralControls.works.touched ? 1 : 0}
                             valid={this.state.formGeneralControls.works.valid ? 1 : 0}/>
          
              </Form.Group>
              <Form.Group className="form-group-custom">
                  <Form.Label><b>Đối tượng tham gia</b></Form.Label>
                  <TextArea name="joiner" 
                             placeholder={this.state.formGeneralControls.joiner.placeholder}
                             value={this.state.formGeneralControls.joiner.value}
                             onChange={this.changeHandler}
                             touched={this.state.formGeneralControls.joiner.touched ? 1 : 0}
                             valid={this.state.formGeneralControls.joiner.valid ? 1 : 0}/>
          
              </Form.Group>
              <Form.Group className="form-group-custom">
                  <Form.Label><b>Liên hệ</b></Form.Label>
                  <TextInput name="contact" 
                             placeholder={this.state.formGeneralControls.contact.placeholder}
                             value={this.state.formGeneralControls.contact.value}
                             onChange={this.changeHandler}
                             touched={this.state.formGeneralControls.contact.touched ? 1 : 0}
                             valid={this.state.formGeneralControls.contact.valid ? 1 : 0}/>
                  <Form.Text>Thông tin liên hệ trực tiếp với ban tổ chức hoặc đơn vị đại diện</Form.Text>


              </Form.Group>
              <Form.Group className="form-group-custom">
                  <Form.Label><b>Lợi ích khi tham gia</b></Form.Label>
                  <TextArea name="reward" 
                             placeholder={this.state.formGeneralControls.reward.placeholder}
                             value={this.state.formGeneralControls.reward.value}
                             onChange={this.changeHandler}
                             touched={this.state.formGeneralControls.reward.touched ? 1 : 0}
                             valid={this.state.formGeneralControls.reward.valid ? 1 : 0}/>
          
              </Form.Group>
              <Form.Group className="form-group-custom">
                  <Form.Label><b>Thông tin đăng ký hoạt động</b></Form.Label>
                  <TextArea name="register" 
                             placeholder={this.state.formGeneralControls.register.placeholder}
                             value={this.state.formGeneralControls.register.value}
                             onChange={this.changeHandler}
                             touched={this.state.formGeneralControls.register.touched ? 1 : 0}
                             valid={this.state.formGeneralControls.register.valid ? 1 : 0}/>
          
              </Form.Group>
              <h6><b>II. Thông tin chi tiết dành cho hoạt động có nhiều thông tin phức tạp</b> <i>(mỗi trường thông tin không quá 200 ký tự)</i></h6>

              <Form.Group className="form-group-custom associate-values-group">
                {
                  this.state.associateControls.associateValues.map(function(value, idx){
                    
                    return (<Row key={"row"+idx} className="row-custom row-associate">
                      <Col className="col-associate" sm="3">
                        <div className="associate-input">
                          <Form.Label>Thời gian</Form.Label>
                          <TextArea data-key={idx}
                                    name="time"
                                    value={value.time.value}
                                    placeholder={value.time.placeholder}
                                    onChange={changeAssociateValue}
                                    touched={value.time.touched ? 1 : 0}
                                    valid={value.time.valid ? 1 : 0}/>

  
                        </div>


                      </Col>
                      <Col className="col-associate" sm="3">
                        <div className="associate-input">
                          <Form.Label>Công việc</Form.Label>
                          <TextArea data-key={idx}
                                    name="works"
                                    value={value.works.value}
                                    placeholder={value.works.placeholder}
                                    onChange={changeAssociateValue}
                                    touched={value.works.touched ? 1 : 0}
                                    valid={value.works.valid ? 1 : 0}/>

                        </div>

                      </Col>
                      <Col className="col-associate" sm="3">
                        <div className="associate-input">
                          <Form.Label>Tên địa điểm</Form.Label>
                          <TextArea data-key={idx}
                                    name="name_place"
                                    value={value.name_place.value}
                                    placeholder={value.name_place.placeholder}
                                    onChange={changeAssociateValue}
                                    touched={value.name_place.touched ? 1 : 0}
                                    valid={value.name_place.valid ? 1 : 0}/>

                        </div>

                      </Col>
                      <Col className="col-associate" sm="3">
                        <div className="associate-input">
                          <Form.Label>Địa chỉ</Form.Label>
                          <TextArea data-key={idx}
                                    name="address"
                                    value={value.address.value}
                                    placeholder={value.address.placeholder}
                                    onChange={changeAssociateValue}
                                    touched={value.address.touched ? 1 : 0}
                                    valid={value.address.valid ? 1 : 0}/>

                        </div>

                      </Col> 
                      
                        <IconContext.Provider value={{ className: "eliminate-icon" }}>
                          
                            <FaMinusCircle 
                            data-btn={idx}
                            onClick={() => deleteRowHandle(idx)}/>
                          
                        </IconContext.Provider>
                      
                    </Row>)
                  })
                }
                
                <IconContext.Provider value={{ className: "add-more-icon-form" }}>
                  <FaPlusCircle onClick={this.addMoreRowHandle}/>
                </IconContext.Provider>
              </Form.Group>
                <Button onClick={()=>newLocal.showConfirmDialog(true)}
                        disabled={isDisableForm}
                        className="submit-btn"
                > Thêm hoạt động </Button>
                {isDisableForm && <Alert className="alert-validate" variant="danger">Dữ liệu nhập không hợp lệ, vui lòng kiểm tra lại!</Alert>}
                <Modal show={this.state.isShowSuccessDialog}>
                  
                  <Modal.Body className="success-dialog">Thêm thành công!</Modal.Body>
                  <Modal.Footer className="text-center">
                    
                    <Button variant="primary" onClick={()=>newLocal.showSuccessDialog(false)}>
                      Đồng ý
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Modal show={this.state.isShowErrorDialog}>
                  
                  <Modal.Body className="error-dialog">Có lỗi xảy ra, vui lòng thử lại sau!</Modal.Body>
                  <Modal.Footer className="text-center">
                    
                    <Button variant="primary" onClick={()=>newLocal.showErrorDialog(false)}>
                      Đồng ý
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Modal show={this.state.isShowConfirmDialog} onHide={()=>newLocal.showConfirmDialog(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Xác nhận thêm hoạt động</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>Bạn có chắc tạo mới hoạt động này?</Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={()=>newLocal.showConfirmDialog(false)}>
                      Hủy
                    </Button>
                    <Button variant="primary" onClick={this.formSubmitHandler}>
                      Tạo mới
                    </Button>
                  </Modal.Footer>
                </Modal>
            </Form>   
      	);
  	}
	
}

export default FormComponent;