import React, {Component} from 'react';
import './show_detail_update.css';

import '../form_add_new_activity/AddNewActivity.css';
import validate from '../form_add_new_activity/validator.js';
import { Button, Modal, Alert, Spinner } from 'react-bootstrap';
import { Form, Row, Col } from 'react-bootstrap'
import { UPDATE_API, GET_SINGLE_API, DELETE_SINGLE_API } from '../dragging_form_add_new_activity/constants';

import TextInput from '../form_add_new_activity/TextInput';
import TextArea from '../form_add_new_activity/TextArea';
import { IconContext } from "react-icons";
import {FaPlusCircle} from "react-icons/fa";
import {FaMinusCircle} from "react-icons/fa";
import {getToken} from '../utils/utils.js'

import axios from 'axios';
import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";


class DetailActivity extends Component {
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
                  placeholder: '08h30 sáng 26/03/2020, ...',
                  startDate : new Date(),
                  endDate : new Date()
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
		      currentId: null,
          is_loading: false,
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
                placeholder: '08h30 sáng 26/03/2020, ...',
                startDate : new Date(),
                endDate : new Date()
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
          isNotFound: false,
          isShowConfirmUpdateDialog: false,
          isShowSuccessUpdateDialog: false,
          isShowErrorUpdateDialog: false,
          isShowConfirmDeleteDialog: false,
          isShowSuccessDeleteDialog: false,
          isShowErrorDeleteDialog: false
	    } 
	}
  mapCopy = (object) => {
    return Object.keys(object).reduce(function (output, key) {
      output[key] = object[key];
      
      return output;
      }, {})
  }
  componentDidMount(){
  	var activity_id = this.props.activity_id;
    

  	axios.get(GET_SINGLE_API + activity_id, {
      headers:
            {
              "Authorization": "JWT " + getToken()
            }
    }).then((res)=>{

		            var data = res.data.message;
					if (data !== 'activity not found'){
			            const updateFormGeneralControls = {...this.state.formGeneralControls};
			            
			            updateFormGeneralControls.name_activity.value = data.name_activity.join("; ");
			            updateFormGeneralControls.type_activity.value = data.type_activity.join("; ");
			            updateFormGeneralControls.holder.value = data.holder.join("; ");
			            updateFormGeneralControls.contact.value = data.contact.join("; ");
			            updateFormGeneralControls.reward.value = data.reward.join("; ");
			            updateFormGeneralControls.register.value = data.register.join("; ");
			            updateFormGeneralControls.joiner.value = data.joiner.join("; ");
			            updateFormGeneralControls.time.value = data.time.join("; ");
			            updateFormGeneralControls.name_place.value = data.name_place.join("; ");
			            updateFormGeneralControls.address.value = data.address.join("; ");
			            updateFormGeneralControls.works.value = data.works.join("; ");

                  if (data.time.length > 0 && typeof(data.time[0]) == "number"){
                    updateFormGeneralControls.time.startDate = new Date(data.time[0] * 1000)
                  }
                  if (data.time.length > 1 && typeof(data.time[0]) == "number"){
                    updateFormGeneralControls.time.endDate = new Date(data.time[1] * 1000)
                  }

						const associateControls = {...this.state.associateControls}
						
			            var associateRawValues = data.time_works_place_address_mapping;
			          
			            var associateValues = [];
			            for (let i in associateRawValues){
			            	const associateValue = {
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
				              };
			            	

			            	associateValue.time.value = associateRawValues[i].time.join("; ");
			            	associateValue.works.value = associateRawValues[i].works.join("; ");
			            	associateValue.address.value = associateRawValues[i].address.join("; ");
			            	associateValue.name_place.value = associateRawValues[i].name_place.join("; ");
			            	associateValues.push(associateValue);

                    if (associateRawValues[i].time.length > 0 && typeof(associateRawValues[i].time[0]) == "number"){
                      associateValue.time.startDate = new Date(associateRawValues[i].time[0] * 1000)
                    }
                    if (associateRawValues[i].time.length > 1 && typeof(associateRawValues[i].time[1]) == "number"){
                      associateValue.time.endDate = new Date(associateRawValues[i].time[1] * 1000)
                    }
			            		
			            }
			            

			            associateControls.associateValues = associateValues;
			            

				       //  let formIsValid = true;

			            for (var slot in updateFormGeneralControls){
			            	const updatedFormElement = updateFormGeneralControls[slot];
			            	updateFormGeneralControls[slot].valid  = validate(updatedFormElement.value, updatedFormElement.validationRules);
			            	// console.log('slot: ' + slot);
			            	// console.log(updateFormGeneralControls[slot].valid);
			            }


					    
				      	for (let associateElementIdx in associateValues){
					        for (let fieldElement in associateValues[associateElementIdx]){
					        	associateValues[associateElementIdx][fieldElement].valid 
					        	= validate(associateValues[associateElementIdx][fieldElement].value
					        		, associateValues[associateElementIdx][fieldElement].validationRules);			          
					        }

				      	}


			            this.setState({
		            		formGeneralControls: updateFormGeneralControls,
		            		associateControls: associateControls,
		            		is_loading: false,
		            		currentId: activity_id
					    });
			        }
		          },
		            (error)=>{

                  if (error.response){
                    
                    this.setState({isNotFound : (error.response.status == 404 || error.response.status == 400), is_loading: false, isShowErrorUpdateDialog: false});
                  }
		 
		            }
		          );
    this.setState({
              is_loading: true
        });
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
	showConfirmDeleteDialog = (isShow) => {
		this.setState({isShowConfirmDeleteDialog: isShow});
	}
	showSuccessDeleteDialog = (isShow) => {
		this.setState({isShowSuccessDeleteDialog: isShow});
	}
	showErrorDeleteDialog = (isShow) => {
		this.setState({isShowErrorDeleteDialog: isShow});
	}
    showConfirmUpdateDialog = (isShow)=> {
    	this.setState({isShowConfirmUpdateDialog: isShow});
    }
    showSuccessUpdateDialog = (isShow) => {
    	this.setState({isShowSuccessUpdateDialog: isShow});
    }
    showErrorUpdateDialog = (isShow) => {
    	this.setState({isShowErrorUpdateDialog: isShow});
    }
    deleteHandle = () => {
    	var currentId = this.state.currentId;
    	if (currentId != null && currentId.length > 0){
			axios.delete(DELETE_SINGLE_API + currentId,
        {
          headers:
            {
              "Authorization": "JWT " + getToken()
            }
        }).then((res)=>{
				this.setState({
					isShowConfirmDeleteDialog: false,
					isShowErrorDeleteDialog: false,
					isShowSuccessDeleteDialog: true,
          is_loading: false
				})

			}, (error)=>{
				this.setState({
					isShowConfirmDeleteDialog: false,
					isShowErrorDeleteDialog: true,
					isShowSuccessDeleteDialog: false,
          is_loading: false
				});

			});
        this.setState({
          is_loading: true
        });

    	}
    }
  	formUpdateHandler = () => {
    	
      const formGeneralControls = {
        ...this.state.formGeneralControls
      };
      
      
      const associateValuesControls = {
        ...this.state.associateControls
      }
      var listAssociateValues = this.filterAssociateValue(associateValuesControls.associateValues)
      var currentId = this.state.currentId;
      if (currentId == null || currentId.length === 0){
      	return;
      }
      var body_request_object = {
        activity: {
        	_id: currentId
          
        }
      }

      for (let field in formGeneralControls){
        if (field == "time"){
          body_request_object.activity[field] = [parseInt((formGeneralControls[field].startDate.getTime() / 1000).toFixed(0)), parseInt((formGeneralControls[field].endDate.getTime() / 1000).toFixed(0))]
        } else {
          body_request_object.activity[field] = this.convertRawValueToArray(formGeneralControls[field].value);
        }
      }
      body_request_object.activity["time_works_place_address_mapping"] = listAssociateValues;
      console.log(body_request_object)
      axios.put(UPDATE_API,
        body_request_object,
        {
          headers:
            {
              "Authorization": "JWT " + getToken()
            }
        }).then((res)=>{
            
            this.setState({
              isShowConfirmUpdateDialog: false,
              isShowSuccessUpdateDialog: true,
              isShowErrorUpdateDialog: false,
              is_loading: false,

            })
          },
            (error)=>{
              
              this.setState({
                isShowConfirmUpdateDialog: false,
                isShowSuccessUpdateDialog: false,
                isShowErrorUpdateDialog: true,
                is_loading: false,

              })

            }
          );

        this.setState({
          is_loading: true
        });
  	}
    convertRawValueToArray = (rawValue)=> {
      var trimmedValue = rawValue.trim();
      if (trimmedValue !== ''){
        return trimmedValue.split(';').map((elememt)=>{return elememt.trim()});
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
          // validElement.time = this.convertRawValueToArray(value.time.value);
          validElement.time = [parseInt((value.time.startDate.getTime() / 1000).toFixed(0)), parseInt((value.time.endDate.getTime() / 1000).toFixed(0))]
          validElement.works = this.convertRawValueToArray(value.works.value);
          validElement.name_place = this.convertRawValueToArray(value.name_place.value);
          validElement.address = this.convertRawValueToArray(value.address.value);
          finalList.push(validElement);
        }
      }

      return finalList;
    }

  setDateCustom = (date, isStart=true, associateIdx=null) => {
    // console.log(typeof(date))
    // console.log(date)
    if (associateIdx == null){
      const updatedControls = {
        ...this.state.formGeneralControls
      };
      const updatedFormElement = {
        ...updatedControls['time']
      };

      if (isStart){
        updatedFormElement.startDate = date
      } else {
        updatedFormElement.endDate = date
      }
      updatedControls['time'] = updatedFormElement;
      // console.log("updated datetime: ")
      // console.log(updatedFormElement)
      this.setState({
        formGeneralControls: updatedControls
      }); 

    } else {

      console.log("idx: " + associateIdx)
      const updatedAssociatedControls = {
        ...this.state.associateControls
      };

      const updatedAssociatedValues = updatedAssociatedControls.associateValues;
      
      if (associateIdx < updatedAssociatedValues.length){
        const updatedAssociatedElement = {
          ...updatedAssociatedValues[associateIdx]['time']
        }
        
        if (isStart){
          updatedAssociatedElement.startDate = date
        } else {
          updatedAssociatedElement.endDate = date
        }

        updatedAssociatedValues[associateIdx]['time'] = updatedAssociatedElement;
        // console.log(updatedAssociatedElement)
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
    
  }
	render = () => {
        var changeAssociateValue = this.changeAssociateValue;
        var deleteRowHandle = this.deleteRowHandle;
        var setDateCustom = this.setDateCustom;
        var newLocal = this;
        var isDisableForm = this.isDisableForm();
        if (this.state.isNotFound){
        	return <h6>Không tìm thấy hoạt động</h6>;
        }
      	return (
	        <Form className="main-detail-display">
            <h6><i>* Lưu ý nếu có nhiều giá trị thì nhập các giá trị cách nhau bởi dấu chấm phẩy (;)</i></h6>
            <h6><b>I. Thông tin chung của hoạt động</b> <i>(mỗi trường thông tin không quá 500 ký tự)</i></h6>

              <Form.Group className="form-group-custom">
                <Form.Label><b>Tên hoạt động</b></Form.Label>
                <TextInput name="name_activity" 
                           placeholder={this.state.formGeneralControls.name_activity.placeholder}
                           value={this.state.formGeneralControls.name_activity.value}
                           onChange={this.changeHandler}
                           touched={this.state.formGeneralControls.name_activity.touched ? 1 : 0}
                           valid={this.state.formGeneralControls.name_activity.valid ? 1 : 0}/>
                <Form.Text>Tên đầy đủ dùng để phân biệt với những hoạt động khác </Form.Text>
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
                    <Form.Text>Phân loại hoạt động giúp dễ dàng tìm kiếm hoạt động hơn </Form.Text>
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
              <Row className="row-custom">
                <Col className="column1" sm="4">
                  <Form.Group className="form-group-custom">
                    <Form.Label style={{display: "block"}}><b>Thời gian</b></Form.Label>
                    <div className="time-block-1">
                      <div>Bắt đầu:</div>
                      <DatePicker
                      selected={this.state.formGeneralControls.time.startDate}
                      onChange={(date) => setDateCustom(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="time"
                      dateFormat="MMMM d, yyyy h:mm aa"
                      />
                    </div>
                    <div className="time-block-2">
                      <div>Kết thúc:</div>
                      <DatePicker
                      selected={this.state.formGeneralControls.time.endDate}
                      onChange={(date) => setDateCustom(date, false)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="time"
                      dateFormat="MMMM d, yyyy h:mm aa"
                      />
                    </div>
                  </Form.Group>

                </Col>

                <Col className="column2" sm="8">
                  <Form.Group className="form-group-custom">
                    <Form.Label><b>Tên địa điểm</b></Form.Label>
                    <TextArea name="name_place" 
                               placeholder={this.state.formGeneralControls.name_place.placeholder}
                               value={this.state.formGeneralControls.name_place.value}
                               onChange={this.changeHandler}
                               touched={this.state.formGeneralControls.name_place.touched ? 1 : 0}
                               valid={this.state.formGeneralControls.name_place.valid ? 1 : 0}/>
          
                  </Form.Group>

                </Col>

              </Row>
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
                  <Form.Text>Thông tin liên hệ trực tiếp với ban tổ chức hoặc đơn vị đại diện </Form.Text>


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
              <br/>
              <h6><b>II. Thông tin chi tiết dành cho hoạt động có nhiều thông tin phức tạp</b> <i>(mỗi trường thông tin không quá 200 ký tự)</i></h6>
              
              <Form.Group className="form-group-custom associate-values-group">
                {
                  this.state.associateControls.associateValues.map(function(value, idx){
                    
                    return (<Row key={"row"+idx} className="row-custom row-associate">
                      <Col className="col-associate" sm="3">
                        <div className="associate-input">
                          
                          <div>
                            <div>Bắt đầu:</div>
                            <DatePicker
                            selected={value.time.startDate}
                            onChange={(date) => setDateCustom(date, true, idx)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                            />
                          </div>
                          <div>
                            <div>Kết thúc:</div>
                            <DatePicker
                            selected={value.time.endDate}
                            onChange={(date) => setDateCustom(date, false, idx)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                            />
                          </div>
                          {/*<TextArea data-key={idx}
                                                                                        name="time"
                                                                                        value={value.time.value}
                                                                                        placeholder={value.time.placeholder}
                                                                                        onChange={changeAssociateValue}
                                                                                        touched={value.time.touched ? 1 : 0}
                                                                                        valid={value.time.valid ? 1 : 0}/>*/}

  
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
              <br/>
              
              <Form.Group>
                <Button onClick={()=>newLocal.showConfirmUpdateDialog(true)}
                        disabled={isDisableForm}
                        className="submit-btn"
                > Cập nhật </Button>
                <Button onClick={()=>newLocal.showConfirmDeleteDialog(true)}
                        
                        className="delete-btn"
                > Xóa hoạt động </Button>
                {isDisableForm && <Alert className="alert-validate" variant="danger">Dữ liệu nhập không hợp lệ, vui lòng kiểm tra lại!</Alert>}
                <Modal show={this.state.isShowSuccessDeleteDialog}>
                  
                  <Modal.Body className="success-dialog">Xóa thành công!</Modal.Body>
                  <Modal.Footer className="text-center">
                    
                    <Button variant="primary" onClick={()=>newLocal.showSuccessDeleteDialog(false)}>
                      Đồng ý
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Modal show={this.state.isShowErrorDeleteDialog}>
                  
                  <Modal.Body className="error-dialog">Không thể xóa, vui lòng thử lại sau!</Modal.Body>
                  <Modal.Footer className="text-center">
                    
                    <Button variant="primary" onClick={()=>newLocal.showErrorDeleteDialog(false)}>
                      Đồng ý
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Modal show={this.state.isShowConfirmDeleteDialog} onHide={()=>newLocal.showConfirmDeleteDialog(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa hoạt động</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>Bạn có chắc muốn xóa hoạt động này? <div className="spinner-holder">{(this.state.is_loading) && <Spinner className="loading-spinner" animation="grow" variant="success" role="status"/>}</div>

                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={()=>newLocal.showConfirmDeleteDialog(false)}>
                      Hủy
                    </Button>
                    <Button variant="primary" onClick={this.deleteHandle} disabled={this.state.is_loading}>
                      Xóa
                    </Button>
                  </Modal.Footer>
                </Modal>
                </Form.Group>
                <Modal show={this.state.isShowSuccessUpdateDialog}>
                  
                  <Modal.Body className="success-dialog">Cập nhật thành công!</Modal.Body>
                  <Modal.Footer className="text-center">
                    
                    <Button variant="primary" onClick={()=>newLocal.showSuccessUpdateDialog(false)}>
                      Đồng ý
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Modal show={this.state.isShowErrorUpdateDialog}>
                  
                  <Modal.Body className="error-dialog">Có lỗi xảy ra, vui lòng thử lại sau!</Modal.Body>
                  <Modal.Footer className="text-center">
                    
                    <Button variant="primary" onClick={()=>newLocal.showErrorUpdateDialog(false)}>
                      Đồng ý
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Modal show={this.state.isShowConfirmUpdateDialog} onHide={()=>newLocal.showConfirmUpdateDialog(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Xác nhận cập nhật hoạt động</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>Bạn có muốn cập nhật hoạt động này?<div className="spinner-holder">{(this.state.is_loading) && <Spinner className="loading-spinner" animation="grow" variant="success" role="status"/>}</div>

                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={()=>newLocal.showConfirmUpdateDialog(false)}>
                      Hủy
                    </Button>
                    <Button variant="primary" onClick={this.formUpdateHandler}>
                      Cập nhật
                    </Button>
                  </Modal.Footer>
                </Modal>
            </Form>   
      	);
  	}
	
}

export default DetailActivity;