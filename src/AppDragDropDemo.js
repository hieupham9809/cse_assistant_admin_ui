import React, { Component } from 'react';
import './AppDragDropDemo.css'
export default class AppDragDropDemo extends Component {
	state = {            
		tasks: [
				{name:"07:00 sáng", category:"original", bgcolor: "yellow"},  
			    {name:"12h trưa", category:"original", bgcolor:"yellow"},
			    {name:"hội trường H6", category:"original", bgcolor: "pink"},  
			    {name:"202H1", category:"original", bgcolor:"pink"},   
			    {name:"Lắng nghe câu chuyện vào nghề",  category:"original", bgcolor:"skyblue"},
			    {name:"Tham gia sân chơi trí tuệ",  category:"original", bgcolor:"skyblue"}

	    ]
	}
	onDragStart(event, name){
		console.log('drag start: ', name);
		event.dataTransfer.setData("name", name);
		// console.log('get from event: ', event.dataTransfer.getData("id"));
	}
	onDragOver(event){
		event.preventDefault();
	}
	onDrop(event, category){
		console.log("dropped");
		let name = event.dataTransfer.getData("name")
		let tasks = this.state.tasks.filter((task)=>{
			if (task.name == name){
				task.category = category
			}
			return task
		});
	 	this.setState({
			...this.state,
			tasks
		});
	}
	render(){
		var tasks = {
			original : [],
			box1 : [],
			box2 : []
		}

		this.state.tasks.forEach((t) => {
			console.log(t.category)
			tasks[t.category].push(
				<div key={t.name}
					draggable
					className="draggable"
					onDragStart = {(e)=> this.onDragStart(e, t.name)}
					style={{backgroundColor: t.bgcolor}}
				>
					{t.name}
				</div>
				);
		});

		return (
			<div className="container-drag">
				<h2 className="header">DRAG DROP</h2>
				<div className="original"
					onDragOver={(e)=>this.onDragOver(e)}
					onDrop={(e)=>this.onDrop(e, "original")}

				>
					<span className="task-header">original</span>
					{tasks.original}
				</div>	
				<div className="box-container">
					<div className="box box1"	
						onDragOver={(e)=>this.onDragOver(e)}
						onDrop={(e)=>this.onDrop(e, "box1")}
					>
						
						<span className="task-header">add-1</span>

						{tasks.box1}
					</div>

					<div className="box box2"	
						onDragOver={(e)=>this.onDragOver(e)}
						onDrop={(e)=>this.onDrop(e, "box2")}
					>
						
						<span className="task-header">add-2</span>

						{tasks.box2}
					</div>	
				</div>
			</div>
			);
	}
}