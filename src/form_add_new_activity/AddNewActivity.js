import React, { Component } from 'react';
import './AddNewActivity.css';
import validate from './validator.js';
import { Button } from 'react-bootstrap';
import { Form, Row, Col } from 'react-bootstrap'
import TextInput from './TextInput';
import TextArea from './TextArea';
import { IconContext } from "react-icons";
import {FaPlusCircle} from "react-icons/fa";
import {FaMinusCircle} from "react-icons/fa";

class FormComponent extends Component {
  
	constructor(){
		super();
    this.associateInit = {
                time: {
                  value: '',
                  valid: true,
                  touched: false,
                  validationRules: {
                    maxLength: 30
                  },
                  placeholder: '08h30 sáng 26/03/2020, ...'
                },
                works: {
                  value: '',
                  valid: true,
                  touched: false,
                  validationRules: {
                    maxLength: 50
                  },
                  placeholder: 'làm công trình giao thông nông thôn, dạy học, hỗ trợ tổ chức sự kiện, ...'
                },
                name_place: {
                  value: '',
                  valid: true,
                  touched: false,
                  validationRules: {
                    maxLength: 50
                  },
                  placeholder: 'nhà thi đấu đa năng ĐH Bách Khoa, Hội trường A5 cơ sở Lý Thường Kiệt, ...'
                },
                address: {
                  value: '',
                  valid: true,
                  touched: false,
                  validationRules: {
                    maxLength: 50
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
                    maxLength: 200,
		                isRequired: true
		            }
	  	        },
              type_activity: {
                value: '',
                placeholder: 'chiến dịch, chương trình, hội thảo, ...',
                valid: true,
                touched: false,
                validationRules: {
                    maxLength: 100
                }
              },
              holder: {
                value: '',
                valid: true,
                touched: false,
                validationRules: {
                    maxLength: 200
                },
                placeholder: 'Đoàn thanh niên - Hội sinh viên khoa Khoa học và Kỹ thuật Máy tính - ĐH Bách Khoa'
              },
              contact: {
                value: '',
                valid: true,
                touched: false,
                validationRules: {
                    maxLength: 200
                },
                placeholder: 'đồng chí Nguyễn Văn A - 09123456789, Ban Truyền thông khoa KH&KT Máy tính'
              },
              reward: {
                value: '',
                valid: true,
                touched: false,
                validationRules: {
                    maxLength: 300
                },
                placeholder: '5 điểm rèn luyện, 0.5 ngày CTXH, ...'
              },
              register: {
                value: '',
                valid: true,
                touched: false,
                validationRules: {
                    maxLength: 200
                },
                placeholder: 'điền vào link xxxxxx, đến văn phòng 602H6 để đăng ký, ...'
              },
              joiner: {
                value: '',
                valid: true,
                touched: false,
                validationRules: {
                    maxLength: 200
                },
                placeholder: 'sinh viên khoa KH&KT Máy tính ĐH Bách Khoa, số lượng tham gia tối đa 200 sinh viên, ...'
              },
              time_general: {
                value: '',
                valid: true,
                touched: false,
                validationRules: {
                    maxLength: 100
                },
                placeholder: '08h30 sáng 26/03/2020, ...'
              },
              name_place_general: {
                value: '',
                valid: true,
                touched: false,
                validationRules: {
                    maxLength: 200
                },
                placeholder: 'nhà thi đấu đa năng ĐH Bách Khoa, Hội trường A5 cơ sở Lý Thường Kiệt, ...'
              },
              address_general: {
                value: '',
                valid: true,
                touched: false,
                validationRules: {
                    maxLength: 200
                },
                placeholder: '268 Lý Thường Kiệt, ...'
              }
	      	},
          associateControls: {
            associateValues : [
              this.mapCopy(this.associateInit)
            ]
          }
	    } 
	}
  mapCopy = (object) => {
    return Object.keys(object).reduce(function (output, key) {
      output[key] = object[key];
      console.log(output);
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
      let formIsValid = true;
      for (let associateElementIdx in updatedAssociatedValues){
        for (let fieldElement in updatedAssociatedValues[associateElementIdx]){
          formIsValid = updatedAssociatedValues[associateElementIdx][fieldElement].valid && formIsValid;
        }

      }
      
      this.setState({
        associateControls: updatedAssociatedControls,
        formIsValid: formIsValid
      })

    }
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
        let formIsValid = true;
        for (let inputIdentifier in updatedControls) {

          formIsValid = updatedControls[inputIdentifier].valid && formIsValid;
        } 
      	this.setState({
	        formGeneralControls: updatedControls,
          formIsValid: formIsValid
      	});	

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
      body_request_object.activity["time_work_place_mapping"] = listAssociateValues;
      console.log(body_request_object);
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
        console.log(value)
        var isValid = false;
        for (let field in value){
          console.log(field)
          console.log(value[field].value)
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
      	return (
	        <Form>
            <h6><i>* Lưu ý nếu có nhiều giá trị thì nhập các giá trị cách nhau bởi dấu phẩy</i></h6>
              <Form.Group className="form-group-custom">
                <Form.Label><b>Tên hoạt động</b></Form.Label>
                <TextInput name="name_activity" 
                           placeholder={this.state.formGeneralControls.name_activity.placeholder}
                           value={this.state.formGeneralControls.name_activity.value}
                           onChange={this.changeHandler}
                           touched={this.state.formGeneralControls.name_activity.touched ? 1 : 0}
                           valid={this.state.formGeneralControls.name_activity.valid ? 1 : 0}/>
                <Form.Text>Tên đầy đủ dùng để phân biệt với những hoạt động khác (tối thiểu 5 ký tự, không quá 100 ký tự)</Form.Text>
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
                    <Form.Text>Phân loại hoạt động giúp dễ dàng tìm kiếm hoạt động hơn (không quá 50 ký tự)</Form.Text>
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
                    <Form.Text>Ban tổ chức, đại diện đứng ra tổ chức hoạt động (không quá 100 ký tự)</Form.Text>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="form-group-custom">
                  <Form.Label><b>Thời gian</b></Form.Label>
                  <TextArea name="time_general" 
                             placeholder={this.state.formGeneralControls.time_general.placeholder}
                             value={this.state.formGeneralControls.time_general.value}
                             onChange={this.changeHandler}
                             touched={this.state.formGeneralControls.time_general.touched ? 1 : 0}
                             valid={this.state.formGeneralControls.time_general.valid ? 1 : 0}/>
          
              </Form.Group>
              <Form.Group className="form-group-custom">
                  <Form.Label><b>Tên địa điểm</b></Form.Label>
                  <TextArea name="name_place_general" 
                             placeholder={this.state.formGeneralControls.name_place_general.placeholder}
                             value={this.state.formGeneralControls.name_place_general.value}
                             onChange={this.changeHandler}
                             touched={this.state.formGeneralControls.name_place_general.touched ? 1 : 0}
                             valid={this.state.formGeneralControls.name_place_general.valid ? 1 : 0}/>
          
              </Form.Group>
              <Form.Group className="form-group-custom">
                  <Form.Label><b>Địa chỉ</b></Form.Label>
                  <TextArea name="address_general" 
                             placeholder={this.state.formGeneralControls.address_general.placeholder}
                             value={this.state.formGeneralControls.address_general.value}
                             onChange={this.changeHandler}
                             touched={this.state.formGeneralControls.address_general.touched ? 1 : 0}
                             valid={this.state.formGeneralControls.address_general.valid ? 1 : 0}/>
          
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
                  <Form.Text>Thông tin liên hệ trực tiếp với ban tổ chức hoặc đơn vị đại diện (không quá 100 ký tự)</Form.Text>


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
              <h6><i>* Dành cho hoạt động có nhiều thông tin phức tạp</i></h6>
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
                
                <IconContext.Provider value={{ className: "add-more-icon" }}>
                  <FaPlusCircle onClick={this.addMoreRowHandle}/>
                </IconContext.Provider>
              </Form.Group>
                <Button onClick={this.formSubmitHandler}
                        disabled={!this.state.formIsValid}
                > Thêm hoạt động </Button>
            </Form>   
      	);
  	}
	
}

export default FormComponent;