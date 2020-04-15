import React, {Component} from 'react';
import './show_database.css';
import { Table, Button, Container, Pagination } from 'react-bootstrap';
import { Form, Row, Col, Spinner } from 'react-bootstrap'
import {IoMdSearch,IoIosBackspace} from "react-icons/io";
import { IconContext } from "react-icons";
import {getToken} from '../utils/utils.js'
import { Redirect } from 'react-router-dom';

import { GET_DB_API, GET_DB_FILTER } from '../dragging_form_add_new_activity/constants';

import axios from 'axios';
class ShowDatabase extends Component {
	constructor(props){
		super(props);
		
		this.state = {
			activities: null,
			total: 0,
			per_page: 20,
			is_loading: true,
			is_searching: props.data.is_searching,
			current_page: props.data.current_page,
			current_search_condition: props.data.is_searching ? props.data.current_search_condition : [
				{
					category : "name_activity",
					keyword: ""
				},
				{
					category : "none",
					keyword: ""
				}
			],
			// current_search_page: props.data.currentSearchPage,
			is_not_found: false,
			is_error: false
		}
	


	}
	resetState = () => {
		this.setState({
			activities: null,
			total: 0,
			per_page: 20,
			is_searching: false,
			current_page: 1,
			current_search_condition:[
				{
					category : "name_activity",
					keyword: ""
				},
				{
					category : "none",
					keyword: ""
				}
			],
			is_loading: false,
			is_not_found: false,
			is_error: false
		})
	}
	resetSearchBox = () => {
		this.setState({
			
			current_search_condition:[
				{
					category : "",
					keyword: ""
				},
				{
					category : "",
					keyword: ""
				}
			]
		})
	}
	handleClickActivity = (event, id)=>{
		this.props.onClickInActivity(event, id);
	}
	componentWillReceiveProps(nextProps) {
		
	  if (nextProps.data.is_searching){
			
		
			this.makeHttpFilterRequestWithPage(nextProps.data.current_page, this.createCondition())

		} else {
			// this.resetState();
			
		    this.makeHttpRequestWithPage(nextProps.data.current_page);

		}
	}
	handleChangeSearchCategory = (event, idx) => {

		if (idx >= 0 && idx < this.state.current_search_condition.length){
			const currentCondition = this.state.current_search_condition;
			currentCondition[idx].category = event.target.value;
			this.setState({
				current_search_condition : currentCondition
			})

		}
	}
	handleChangeSearchKeyword = (event, idx) => {
		if (idx >= 0 && idx < this.state.current_search_condition.length){
			const currentCondition = this.state.current_search_condition;
			currentCondition[idx].keyword = event.target.value;
			this.setState({
				current_search_condition : currentCondition
			})

		}
	}
	handleClickToPage = (page) => {
		if (this.state.is_searching){
			this.makeHttpFilterRequestWithPage(page, this.createCondition());

			return;
		}

		this.makeHttpRequestWithPage(page);
	}

	handleSearchRequest = () => {
		var condition = this.createCondition();
		
		this.makeHttpFilterRequestWithPage(1, condition);
	}
	notifyToParent = (page, isSearching, condition, is_logged_out=false) => {
		if (is_logged_out){
			this.this.props.notifyCurrentPageAndCondition({is_logged_in: false});
			return;
		}
		this.props.notifyCurrentPageAndCondition({
			current_page: page,
			is_searching: isSearching,
			current_search_condition: condition

		});

	}
	createCondition = () => {
		var condition = {}
		var currentSearchConditionList = this.state.current_search_condition;
		for (let idx in currentSearchConditionList){
			if (currentSearchConditionList[idx].category !== "none"){
				condition[currentSearchConditionList[idx].category] 
					= this.convertRawValueToArray(currentSearchConditionList[idx].keyword)
			}
		}
		return condition;
	}
	convertRawValueToArray = (rawValue)=> {
      var trimmedValue = rawValue.trim();
      if (trimmedValue !== ''){
        return trimmedValue.split(',').map((elememt)=>{return elememt.trim()});
      }
      return [];

    }
	componentDidMount() {

		if (this.state.is_searching){

			this.makeHttpFilterRequestWithPage(this.state.current_page, this.createCondition())

		} else {

		    this.makeHttpRequestWithPage(this.state.current_page);
			
		}
  	}
  	makeHttpFilterRequestWithPage = (pageNumber, condition) => {
	    this.setState({is_loading: true});
		
		axios.post(GET_DB_FILTER + pageNumber, 
			{
				"condition" : condition
			},
			{
				headers:
						{
							"Authorization": "JWT " + getToken()
						}
			}).then((res)=>{

					this.notifyToParent(res.data.current_page, true, this.state.current_search_condition);
		            
		            this.setState({
				      activities: res.data.activities,
				      total: res.data.total,
				      per_page: res.data.per_page,
				      current_page: res.data.current_page,
				      is_searching: true,
				      is_loading: false,
				      is_error: false,
				      is_not_found: false


				    });
		          },
		            (error)=>{
		              	var newState = {is_loading: false}
		              	if (error.response){
		              		switch (error.response.status) {
		              			case 404:
 									newState["is_not_found"] = true;
		              				break;
	              				case 401:
	              					this.notifyToParent(null, null, null, true);
	              					break;
		              			default:
		              				newState["is_error"] = true;
		              				break;
		              		}
		              	}
		              	
 						this.setState({...newState})


		            }
		          );
		
  	}
  	makeHttpRequestWithPage = pageNumber => {
	    this.setState({is_loading: true});


		axios.get(GET_DB_API + pageNumber, { headers:
			{
				"Authorization": "JWT " + getToken()
			}
		}).then((res)=>{
		            
					this.notifyToParent(res.data.current_page, false, this.state.current_search_condition);

		            this.setState({
				      activities: res.data.activities,
				      total: res.data.total,
				      per_page: res.data.per_page,
				      current_page: res.data.current_page,
				      is_loading: false,
				      is_error: false,
				      is_not_found: false


				    });
		          },
		            (error)=>{
		            
		              	var newState = {is_loading: false}
		              	if (error.response){
		              		switch (error.response.status) {
		              			case 404:
 									newState["is_not_found"] = true;
		              				break;
	              				case 401:
	              					
	              					break;
		              			default:
		              				newState["is_error"] = true;
		              				break;
		              		}
		              	}
		              	
 						this.setState({...newState});


		            }
		          );
	    

	    
	  }
	render = ()=>{
		
		let activities;
		if (this.state.is_error){
			return (<h6>Có lỗi xảy ra, vui lòng thử lại sau</h6>)
		}
		if (this.state.is_not_found){
			return (<h6>Không tìm thấy hoạt động nào thỏa mãn</h6>)
		}
		if (this.state.activities !== null){
			activities = this.state.activities.map(activity=>(
				<tr key={activity._id}>
					<td className="id-td"></td>
					<td title={activity.name_activity}><div className="td-wrap-text"><a href="#" onClick={(event)=>{this.handleClickActivity(event, activity._id)}} >{activity.name_activity}</a></div></td>
					<td title={activity.type_activity}><div className="td-wrap-text">{activity.type_activity}</div></td>
					<td title={activity.time}><div className="td-wrap-text">{activity.time}</div></td>
					<td title={activity.holder}><div className="td-wrap-text">{activity.holder}</div></td>
					<td title={activity.contact}><div className="td-wrap-text">{activity.contact}</div></td>
					<td title={activity.reward}><div className="td-wrap-text">{activity.reward}</div></td>
					<td title={activity.register}><div className="td-wrap-text">{activity.register}</div></td>
					<td title={activity.joiner}><div className="td-wrap-text">{activity.joiner}</div></td>
					<td title={activity.name_place}><div className="td-wrap-text">{activity.name_place}</div></td>
					<td title={activity.address}><div className="td-wrap-text">{activity.address}</div></td>
					<td title={activity.works}><div className="td-wrap-text">{activity.works}</div></td>

				</tr>

				))
		} 
		let numPages = Math.ceil(this.state.total / this.state.per_page)
		let pages = []
		let currentPage = this.state.current_page;

		if (currentPage > 1){
			pages.push(<Pagination.First key={-3} onClick={()=>{this.handleClickToPage(1)}}/>);
			pages.push(<Pagination.Prev key={-5} onClick={()=>{this.handleClickToPage(currentPage - 1)}}/>);
		}
		for (let i = 0; i < numPages; i++){
			let num = i + 1;
			if (num == 1 || num == numPages || (num >= currentPage - 1 && num <= currentPage + 1)){
				if (num == numPages && currentPage < numPages - 2){
					pages.push(<Pagination.Ellipsis key={-1}/>)
				}
				pages.push(<Pagination.Item key={num} onClick={()=>{this.handleClickToPage(num)}} active={num === currentPage}>
			      {num}
			    </Pagination.Item>);
			    if (num == 1 && currentPage > 3){
					pages.push(<Pagination.Ellipsis key={-2}/>)
				}
			}
		    
		}
		if (currentPage < numPages){
			pages.push(<Pagination.Next key={-6} onClick={()=>{this.handleClickToPage(currentPage + 1)}}/>);
			pages.push(<Pagination.Last key={-4} onClick={()=>{this.handleClickToPage(numPages)}}/>);
		}

		return (
			<div className="main-containers">

				<Row className="search-pagination">
					<Col sm={12} md={5}>
						<Row className="paging-spinner-wrapper">
							<Col sm={2} md={2}>
								<div className="spinner-holder">{(this.state.is_loading) && <Spinner className="loading-spinner" animation="grow" variant="success" role="status"/>}</div>

							</Col>
							<Col sm={7} md={12}>
								<Pagination className="pagination">{pages}</Pagination>

							</Col>

							

						</Row>
						

					</Col>
					<Col sm={12} md={7}>
						<Form.Group as={Row} className="search-box">
						    <Form.Label className="input-search-box" column xs="1"><b>Tìm theo:</b></Form.Label>
						    <Col className="col-inside-box" xs="10">
						    	<Row>
								    <Col className="input-search-box" sm="4">
									    <Form.Control 
									    	as="select" 
									    	value={this.state.current_search_condition[0].category}
									    	onChange={(event)=>{this.handleChangeSearchCategory(event, 0)}}>
									      <option value="none">Chọn</option>
									      <option value="name_activity">Tên hoạt động</option>
									      <option value="address">Địa điểm</option>
									      
									      
									    </Form.Control>
								    </Col>
								    <Col className="input-search-box" sm="8">
								    	<Form.Control 
								    		type="textarea" 
								    		placeholder="mùa hè xanh 2019" 
								    		column sm="3"
								    		value={this.state.current_search_condition[0].keyword}
								    		onChange={(event)=>{this.handleChangeSearchKeyword(event, 0)}}/>
								    </Col>
							    </Row>
							    <Row>
								    <Col className="input-search-box" sm="4">
									    <Form.Control 
									    	as="select" 
									    	value={this.state.current_search_condition[1].category}
									    	onChange={(event)=>{this.handleChangeSearchCategory(event, 1)}}>
									      <option value="none">Chọn</option>
									      <option value="name_activity">Tên hoạt động</option>
									      <option value="address">Địa chỉ</option>
									      
									    </Form.Control>
								    </Col>
								    <Col className="input-search-box" sm="8">
								    	<Form.Control 
								    		type="textarea" 
								    		placeholder="Vĩnh Hòa, Chợ Lách, Bến Tre" 
								    		column sm="3"
								    		value={this.state.current_search_condition[1].keyword}
								    		onChange={(event)=>{this.handleChangeSearchKeyword(event, 1)}}/>
							    	</Col>
						    	</Row>
						    </Col>
						    
						    <Col className="col-inside-box" xs="1">
						    	<Row>
								    <IconContext.Provider value={{ className: "search-icon" }} >
		                              
		                                <IoMdSearch onClick={() => this.handleSearchRequest()}/>
		                              
		                            </IconContext.Provider>
	                            </Row>
	                            <Row>
		                            <IconContext.Provider  value={{ className: "search-icon" }} >
		                              
		                                <IoIosBackspace onClick={() => this.resetSearchBox()}/>
		                              
		                            </IconContext.Provider>
	                            </Row>
	                            
						    </Col>
						    
					  	</Form.Group>
					</Col>
					
				</Row>
				<Table responsive="lg" className="table-content" striped bordered hover>
					<thead>
						<tr>
							<th className="id-td">#</th>
							<th>Tên hoạt động</th>
							<th>Loại hoạt động</th>
							<th>Thời gian</th>
							<th>Ban tổ chức</th>
							<th>Liên hệ</th>
							<th>Lợi ích</th>
							<th>Đăng ký</th>
							<th>Đối tượng tham gia</th>
							<th>Địa điểm</th>
							<th>Địa chỉ</th>
							<th>Công việc</th>
						</tr>

					</thead>
					<tbody>

						{activities}
					</tbody>
					
				</Table>

			</div>


		)
	}
}
export default ShowDatabase;