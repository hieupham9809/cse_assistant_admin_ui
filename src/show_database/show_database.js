import React, {Component} from 'react';
import './show_database.css';
import { Table, Button, Container, Pagination } from 'react-bootstrap';
import { Form, Row, Col } from 'react-bootstrap'
import {IoMdSearch} from "react-icons/io";
import { IconContext } from "react-icons";

import { GET_DB_API, GET_DB_FILTER } from '../dragging_form_add_new_activity/constants';

import axios from 'axios';
class ShowDatabase extends Component {
	constructor(props){
		super(props);
		
		this.state = {
			activities: null,
			total: 0,
			per_page: 20,
			current_page: props.pageToLoad,
			current_search_codition: [
				{
					category : "",
					keyword: ""
				}
			],
			current_search_page: 1,
			is_not_found: false,
			isError: false
		}
	


	}
	handleClickActivity = (event, id)=>{
		this.props.onClickInActivity(event, id);
	}
	handleChangeSearchCategory = (event, idx) => {
		console.log(idx)
		console.log(event.target.value)
		if (idx >= 0 && idx < this.state.current_search_codition.length){
			const currentCondition = this.state.current_search_codition;
			currentCondition[idx].category = event.target.value;
			this.setState({
				current_search_codition : currentCondition
			})

		}
	}
	handleChangeSearchKeyword = (event, idx) => {
		if (idx >= 0 && idx < this.state.current_search_codition.length){
			const currentCondition = this.state.current_search_codition;
			currentCondition[idx].keyword = event.target.value;
			this.setState({
				current_search_codition : currentCondition
			})

		}
	}
	handleClickToPage = (page) => {
		this.props.onClickToSelectPage(page);
		this.makeHttpRequestWithPage(page);
	}
	handleSearchRequest = () => {
		var condition = {}
		var currentSearchConditionList = this.state.current_search_codition;
		for (let idx in currentSearchConditionList){
			if (currentSearchConditionList[idx].category !== "none"){
				condition[currentSearchConditionList[idx].category] 
					= this.convertRawValueToArray(currentSearchConditionList[idx].keyword)
			}
		}
		
		console.log('request object: ');
		console.log(condition);
		this.makeHttpFilterRequestWithPage(this.state.current_search_page, condition);
	}
	convertRawValueToArray = (rawValue)=> {
      var trimmedValue = rawValue.trim();
      if (trimmedValue !== ''){
        return trimmedValue.split(',').map((elememt)=>{return elememt.trim()});
      }
      return [];

    }
	componentDidMount() {
	    this.makeHttpRequestWithPage(this.state.current_page);
  	}
  	makeHttpFilterRequestWithPage = (pageNumber, condition) => {
		// var condition = {}
		// condition[]
		axios.post(GET_DB_FILTER + pageNumber, {
			"condition" : condition
			}).then((res)=>{
		            
		            // console.log('data: ');
		            // console.log(res.data);
		            
		            this.setState({
				      activities: res.data.activities,
				      total: res.data.total,
				      per_page: res.data.per_page,
				      current_page: res.data.current_page,
				      current_search_page: res.data.current_page

				    });
		          },
		            (error)=>{
		              
		              console.log('error: ' + error.message);
		              this.setState({isError: true});

		            }
		          );
		
  	}
  	makeHttpRequestWithPage = pageNumber => {
	    

		axios.get(GET_DB_API + pageNumber).then((res)=>{
		            
		            // console.log('data: ');
		            // console.log(res.data);
		            this.setState({
				      activities: res.data.activities,
				      total: res.data.total,
				      per_page: res.data.per_page,
				      current_page: res.data.current_page

				    });
		          },
		            (error)=>{
		              
		              console.log('error: ' + error.message);
		              this.setState({isError: true});

		            }
		          );
	    

	    
	  }
	render = ()=>{
		let activities;
		if (this.state.isError){
			return (<h6>Có lỗi xảy ra, vui lòng thử lại sau</h6>)
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
			if (num == 1 || num == numPages || (num >= currentPage - 2 && num <= currentPage + 2)){
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
			<Container className="main-container">
				<Row className="search-pagination">
					<Col xs={6} md={5}>
						<Pagination>{pages}</Pagination>
					</Col>
					<Col xs={12} md={7}>
						<Form.Group as={Row} className="search-box">
						    <Form.Label className="input-search-box" column sm="auto">Tìm theo: </Form.Label>
						    <Col className="input-search-box" sm="3">
							    <Form.Control as="select" onChange={(event)=>{this.handleChangeSearchCategory(event, 0)}}>
							      <option value="none">Chọn</option>
							      <option value="name_activity">Tên hoạt động</option>
							      <option value="type_activity">Loại hoạt động</option>
							      
							    </Form.Control>
						    </Col>
						    <Col className="input-search-box" sm="7">
						    	<Form.Control 
						    		type="textarea" 
						    		placeholder="mùa hè xanh 2019" 
						    		column sm="3"
						    		onChange={(event)=>{this.handleChangeSearchKeyword(event, 0)}}/>
						    </Col>
						    <Col className="input-search-box" sm="auto">
							    <IconContext.Provider value={{ className: "search-icon" }} >
	                              
	                                <IoMdSearch onClick={() => this.handleSearchRequest()}/>
	                              
	                            </IconContext.Provider>
						    </Col>
					  	</Form.Group>
					</Col>
					
				</Row>
				<Table className="table-content" striped bordered hover>
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

			</Container>


		)
	}
}
export default ShowDatabase;