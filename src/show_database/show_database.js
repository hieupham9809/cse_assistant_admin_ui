import React, {Component} from 'react';
import './show_database.css';
import { Table, Button, Container, Pagination } from 'react-bootstrap';
import { GET_DB_API } from '../dragging_form_add_new_activity/constants';

import axios from 'axios';

class ShowDatabase extends Component {
	constructor(){
		super();
		this.state = {
			activities: null,
			total: 0,
			per_page: 20,
			current_page: null,
			isError: false
		}


	}
	handleClickActivity = ()=>{
		console.log('clicked');
	}
	handleClickToPage = (page) => {
		this.makeHttpRequestWithPage(page);
	}
	componentDidMount() {
	    this.makeHttpRequestWithPage(1);
  	}
  	makeHttpRequestWithPage = pageNumber => {
	    

		axios.get(GET_DB_API + pageNumber).then((res)=>{
		            
		            console.log('data: ');
		            console.log(res.data);
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
		if (this.state.activities !== null){
			activities = this.state.activities.map(activity=>(
				<tr key={activity.id}>
					<td></td>
					<td title={activity.name_activity}><div className="td-wrap-text"><a href="#" onClick={()=>{this.handleClickActivity()}}>{activity.name_activity}</a></div></td>
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
			pages.push(<Pagination.First onClick={()=>{this.handleClickToPage(1)}}/>);
			pages.push(<Pagination.Prev onClick={()=>{this.handleClickToPage(currentPage - 1)}}/>);
		}
		for (let i = 0; i < numPages; i++){
			let num = i + 1;
			if (num == 1 || num == numPages || (num >= currentPage - 2 && num <= currentPage + 2)){
				if (num == numPages && currentPage < numPages - 2){
					pages.push(<Pagination.Ellipsis/>)
				}
				pages.push(<Pagination.Item key={num} onClick={()=>{this.handleClickToPage(num)}} active={num === currentPage}>
			      {num}
			    </Pagination.Item>);
			    if (num == 1 && currentPage > 3){
					pages.push(<Pagination.Ellipsis/>)
				}
			}
		    
		}
		if (currentPage < numPages){
			pages.push(<Pagination.Next onClick={()=>{this.handleClickToPage(currentPage + 1)}}/>);
			pages.push(<Pagination.Last onClick={()=>{this.handleClickToPage(numPages)}}/>);
		}

		return (
			<Container className="main-container">
				<Pagination>{pages}</Pagination>
				<Table className="table-content" striped bordered hover>
					<thead>
						<tr>
							<th>#</th>
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