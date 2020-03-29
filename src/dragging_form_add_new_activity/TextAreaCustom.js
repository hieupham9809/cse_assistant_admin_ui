import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TinyColor from './tinycolor';
import { trimNewLine, getSelectionText, checkParentRelation } from './utils';
import '../form_add_new_activity/AddNewActivity.css';
import './TextArea.css';
import { IconContext } from "react-icons";
import {FaPlusCircle} from "react-icons/fa";
import { PREDICT_API,INSERT_API } from './constants';
import { Button, Modal, Alert } from 'react-bootstrap';
import { Form, Row, Col } from 'react-bootstrap'

// import LabelMap from './LabelMap';
import axios from 'axios';
export default class TextAreaCustom extends Component {
  static propTypes = {
    categories: PropTypes.objectOf(PropTypes.shape({
      color: PropTypes.string.isRequired,
      shortcut: PropTypes.string.isRequired,
    })).isRequired,
    runs: PropTypes.objectOf(PropTypes.shape({
      end: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      prev: PropTypes.number,
    })),
    text: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    onSaved: PropTypes.func.isRequired,
  };
  static defaultProps = {
    runs: null,
  };
  constructor(props) {
    super(props);
    const text = props.text
      .split('\n')
      .map(trimNewLine)
      .join('\n');
    this.state = {
      isPredicting: false,
      text:'',
      runs:  {
          0: {
            end: 0,
            type: 'normal',
            prev: null,
          },
        },
      listTags: [],
      listGroup: {
        original: [],
        group_1: [],
        group_2: []
      },
      isShowConfirmDialog: false,
      isShowSuccessBadge: false,
      isShowErrorBadge: false,
      isShowValidateError: false
    };
  }

  onChangeInputValue(event) {
    // console.log("----------------------------------input value")
    // console.log(typeof event.target.value)
    
    this.setState({
        text:event.target.value,
        runs:{
          0: {
            end: event.target.value.length,
            type: 'normal',
            prev: null,
          },
        }
    });
    // console.log(this.state.text)
}
  componentWillMount() {
    Object.keys(this.props.categories).forEach((x) => {
      const listener = this.handleKeyDown(x);
      document.addEventListener('keydown', listener);
      this.shortcutListener.push(listener);
    });
  }

  componentWillReceiveProps(nextProps) {
    const text = nextProps.text
      .split('\n')
      .map(trimNewLine)
      .join('\n');
    this.setState({
      text,
      runs: nextProps.runs
        ? nextProps.runs
        : {
          0: {
            end: text.length,
            type: 'normal',
            prev: null,
          },
          listTags: []
        },
    });
  }

  componentWillUnmount() {
    this.shortcutListener.forEach(listener =>
      document.removeEventListener('keydown', listener));
    this.shortcutListener = [];
  }

  container = null;
  shortcutListener = [];

  handleKeyDown = name => (e) => {
    if (e.key.toLowerCase() === this.props.categories[name].shortcut.toLowerCase()) {
      this.handleTextSelected(name);
    }
  };

  parseTags(listToken,listLabel){
    let corpusPointer=0;
    let prev=null
    let tags={}
    if (listLabel[0]!='O')
        {
            // console.log(`begin_pointer ${corpusPointer} of label ${listLabel[0].slice(2,listLabel[0].length)}`)
            // console.log(`previous pointer ${prev} of label ${listLabel[0].slice(2,listLabel[0].length)}`)
            tags[corpusPointer.toString()]={}
            tags[corpusPointer.toString()]['prev']=prev
            tags[corpusPointer.toString()]['type']=listLabel[0].slice(2,listLabel[0].length)
            prev=corpusPointer
        }
    else
        {
            // console.log(`begin_pointer ${corpusPointer} of label normal`)
            // console.log(`previous pointer ${prev} of label normal`)
            tags[corpusPointer.toString()]={}
            tags[corpusPointer.toString()]['prev']=prev
            tags[corpusPointer.toString()]['type']='normal'
            prev=corpusPointer
        }

    
    for (let index=0;index<listToken.length-1;index++)
    {

        if (index==0)
            corpusPointer+=listToken[index].length //begin of corpus 
        else
            corpusPointer+=listToken[index].length+1 //middle/end of corpus
        if (listLabel[index].includes('B') && listLabel[index+1].includes('B')&&listLabel[index]!=listLabel[index+1]||listLabel[index].includes('I') && listLabel[index+1].includes('B'))
            {
                
                // console.log(`end_pointer ${corpusPointer} of label ${listLabel[index].slice(2,listLabel[index].length)}`)
                tags[prev.toString()]['end']=corpusPointer
                tags[prev.toString()]['type']=listLabel[index].slice(2,listLabel[index].length)

                // console.log(`begin_pointer ${corpusPointer} of label normal`)
                // console.log(`end_pointer ${corpusPointer+1} of label normal`)
                // console.log(`previous_pointer ${prev} of label normal`)
                tags[corpusPointer.toString()]={}
                tags[corpusPointer.toString()]['end']=corpusPointer+1
                tags[corpusPointer.toString()]['type']='normal'
                tags[corpusPointer.toString()]['end']=corpusPointer+1
                tags[corpusPointer.toString()]['prev']=prev


                // console.log(`begin_pointer ${corpusPointer+1} of label ${listLabel[index+1].slice(2,listLabel[index+1].length)}`)
                // console.log(`previous_pointer ${corpusPointer} of label ${listLabel[index+1].slice(2,listLabel[index+1].length)}`)
                tags[(corpusPointer+1).toString()]={}
                tags[(corpusPointer+1).toString()]['type']=listLabel[index+1].slice(2,listLabel[index+1].length)
                tags[(corpusPointer+1).toString()]['prev']=corpusPointer

                prev=corpusPointer+1
            }
        if (listLabel[index].includes('O') && listLabel[index+1].includes('B'))
            {
                // console.log(`end_pointer ${corpusPointer+1} of label normal`)
                tags[prev.toString()]['end']=corpusPointer+1



                // console.log(`begin_pointer ${corpusPointer+1} of label ${listLabel[index+1].slice(2,listLabel[index+1].length)}`)
                // console.log(`previous_pointer ${prev} of label ${listLabel[index+1].slice(2,listLabel[index+1].length)}`)
                tags[(corpusPointer+1).toString()]={}
                tags[(corpusPointer+1).toString()]['type']=listLabel[index+1].slice(2,listLabel[index+1].length)
                tags[(corpusPointer+1).toString()]['prev']=prev
                prev=corpusPointer+1
            }
        if (listLabel[index].includes('I') && listLabel[index+1].includes('O')||listLabel[index].includes('B') && listLabel[index+1].includes('O'))
            {
                // console.log(`end_pointer ${corpusPointer} of label ${listLabel[index].slice(2,listLabel[index].length)}`) 
                tags[prev.toString()]['end']=corpusPointer
                tags[prev.toString()]['type']=listLabel[index].slice(2,listLabel[index].length)


                // console.log(`begin_pointer ${corpusPointer} of label normal`)
                // console.log(`previous_pointer ${prev} of label normal`)
                tags[corpusPointer.toString()]={}
                tags[corpusPointer.toString()]['prev']=prev
                tags[corpusPointer.toString()]['type']='normal'
                prev=corpusPointer
            }
    }
    // console.log(listToken[listToken.length-1])
    corpusPointer+=listToken[listToken.length-1].length
    if (listLabel[listToken.length-1].includes('O'))
        {
            console.log(`end_pointer ${corpusPointer+1} of label normal`)
            tags[prev.toString()]['end']=corpusPointer+1
            tags[prev.toString()]['type']='normal'
            // console.log(`previous_pointer ${prev} of label normal`)
        }
    else
        {
            console.log(`end_pointer ${corpusPointer+1} of label ${listLabel[listToken.length-1].slice(2,listLabel[listToken.length-1].length)}`)
            tags[prev.toString()]['end']=corpusPointer+1
            tags[prev.toString()]['type']=listLabel[listToken.length-1].slice(2,listLabel[listToken.length-1].length)
            // console.log(`previous_pointer ${prev} of label ${listLabel[index].slice(2,listLabel[index].length)}`)
        }
    return tags    
  }
  createButton = (name, idx) => (
    <button
      type="button"
      className="btn btn-label btn-default"
      onClick={() => this.handleTextSelected(name)}
      key={`${name}-${idx}`}
      style={{
        backgroundColor: this.props.categories[name].color,
        color: TinyColor(this.props.categories[name].color).getBrightness() < 196 ? 'white' : 'black',
      }}
    >
      {`${this.props.categories[name].display_name} (${this.props.categories[name].shortcut})`}
    </button>
  );
  handleTextSelected = (name) => {
    // console.log("--------------------------------------HANDLE TEXTTTTTTTTTTTT")
    // console.log(this.container.contains)
    const range = getSelectionText();
    if (!range) return;
    if (!checkParentRelation(this.container, range.commonAncestorContainer)) {
      return;
    }
    const {
      startContainer, endContainer, startOffset, endOffset,
    } = range;
    if (startOffset === endOffset) return;
    const startContainerId = startContainer.parentNode.id.split('-');
    const endContainerId = endContainer.parentNode.id.split('-');
    const startRunIdx = parseInt(startContainerId[0], 10);
    const startRunLineOffset = parseInt(startContainerId[1], 10);
    const endRunIdx = parseInt(endContainerId[0], 10);
    const endRunLineOffset = parseInt(endContainerId[1], 10);
    const startIdx = startRunIdx + startRunLineOffset + startOffset;
    const endIdx = endRunIdx + endRunLineOffset + endOffset;
    // console.log(startIdx, endIdx)
    if (!startIdx && !endIdx) return;
    const { runs } = this.state;
    const old_runs = JSON.parse(JSON.stringify(runs));
    // console.log("--------------------------------old runs OUT IF ")
    // console.log(old_runs)
    // const old_runs=runs
    const startRun = runs[startRunIdx];
    // console.log('Start Run', startRunIdx)
    const endRun = runs[endRunIdx];
    const newEndRun = { ...endRun, prev: startIdx };
    let i = startRun.end;
    while (i && i <= endRunIdx && runs[i]) {
      const l = runs[i].end;
      delete runs[i];
      i = l;
    }
    startRun.end = startIdx;
    if (!runs[endIdx]) {
      runs[endIdx] = newEndRun;
      if (runs[newEndRun.end]) {
        runs[newEndRun.end].prev = endIdx;
      }
    } else {
      runs[endIdx].prev = startIdx;
    }
    if (!runs[startIdx]) {
      runs[startIdx] = {
        type: name,
        end: endIdx,
        prev: startRunIdx,
      };
    } else {
      runs[startIdx].type = name;
      runs[startIdx].end = endIdx;
    }
    i = startIdx;
    // console.log('Merge start at', i)
    // Merge run before
    while (i && runs[i] && runs[i].prev != null) {
      const { prev } = runs[i];
      // console.log(prev)
      if (runs[prev].type === runs[i].type) {
        runs[prev].end = runs[i].end;
        delete runs[i];
        i = prev;
      } else break;
    }
    // Merge run after
    // console.log(i)
    while (runs[i]) {
      const next = runs[i].end;
      if (runs[next] && runs[next].type === runs[i].type) {
        runs[i].end = runs[next].end;
        delete runs[next];
      } else if (runs[next]) {
        runs[next].prev = i;
        break;
      } else {
        break;
      }
    }
    // console.log("-----------------------------------LIST KEY runs")
    // // console.log(runs)
    // console.log(Object.keys(runs))
    if (!(Object.keys(runs).includes("NaN"))){
      
      this.setState({ runs });
      // this.props.onSaved(runs);
    }
    else{
      // console.log("------------------------runs in IF ")
      // console.log(old_runs)
      // console.log("<3 in if")
      this.setState({ runs: old_runs });
      // this.props.onSaved(old_runs);
      // console.log(this.state.runs)
    }
    

  };

  replaceAll(str, find, replace){
    return str.replace(new RegExp(find, 'g'), replace);
  }

  removeA(list,value) {
      // var what, a = arguments, L = a.length, ax;
      // while (L > 1 && arr.length) {
      //     what = a[--L];
      //     while ((ax= arr.indexOf(what)) !== -1) {
      //         arr.splice(ax, 1);
      //     }
      // }
      // return arr;
      var result=[]
      for (let index=0;index<list.length;index++)
      {
        if (list[index]!=value && list[index]!="️️️")
        {
          // console.log("------------------------length special")
          // console.log("️️️".length)
          result.push(list[index])
        }
      }
      return result
  }

  predict = () => {
    // console.log("abc")
    let {
      text, runs
    } = this.state;
    // let modify_runs={... runs}
    // const newLocal = this;

    // //LOAD AND CHANGE 
    // var corpusesConvert=require('/home/lap11305/LVTN/ner-labeling-tool/src/test_predicted_convert.json')
    // var resultJsonStringConvert=''
    let listLabel;
    let listToken;
    let newTags;
    let contentAfter;
    // for (let index=0;index<corpusesConvert.length;index++)
  




    contentAfter = this.replaceAll(text,"\n", " \n ")
    listToken = this.removeA(contentAfter.split(' '),'')
    let newMessage=listToken.join(' ')


    
    axios.post(PREDICT_API[[Math.floor(Math.random() * PREDICT_API.length)]],{
      items:[{content:newMessage,
      id:"1"}]
    }).then((res) => {
      // console.log(res)
      listLabel=res.data.results[0].tags
      console.log("---------------------------------Before fix label")
      // console.log(listLabel)
      for (let i=0;i<listLabel.length;i++)
      {
        console.log(`Token: ${listToken[i]} Label: ${listLabel[i]}`)
      }
      for (let i=0;i<listLabel.length-1;i++)
      {
        if (i==0&&listLabel[i].includes('I'))
        {
          listLabel[i]='B-'.concat(listLabel[i].slice(2,listLabel[i].length))
        }

        if (listLabel[i].includes('I') && listLabel[i+1].includes('I')&&listLabel[i].slice(2,listLabel[i].length)!=listLabel[i+1].slice(2,listLabel[i+1].length))
        {
          listLabel[i+1]='B-'.concat(listLabel[i+1].slice(2,listLabel[i+1].length))
        }

        if (listLabel[i].includes("O") && listLabel[i+1].includes("I"))
        {
          listLabel[i+1]='B-'.concat(listLabel[i+1].slice(2,listLabel[i+1].length))

        }

        if (listLabel[i].includes("B") && listLabel[i+1].includes("I")&&listLabel[i].slice(2,listLabel[i].length)!=listLabel[i+1].slice(2,listLabel[i+1].length))
        {
          listLabel[i+1]='B-'.concat(listLabel[i+1].slice(2,listLabel[i+1].length))

        }

      }
      // console.log("------------------------after fix label")
      for (let i=0;i<listLabel.length;i++)
      {
        console.log(`Token: ${listToken[i]} Label: ${listLabel[i]}`)
      }

      /** Replace tag inside original list label to ignore district, ward, street, city */
      listLabel = listLabel.map((label)=>{
        if (label !== "O" && ["street","ward", "district", "city"].includes(label.split("-")[1]))
          return label.split("-")[0] + "-address";
        else {
          return label;
        }
      })
      newTags=this.parseTags(listToken,listLabel)
      
      // console.log(data[idx].content)
      // data[idx].message = newMessage
      runs = newTags
      this.setState({ text:newMessage, runs:runs });

    }, (error)=> {
      
      this.setState({
        isPredicting: false
        
      });
      
    });

    }
  extractToTag = () => {
    var runs = this.state.runs;
    var associateRuns = Object.keys(runs).filter((start)=>{return (["time", "works", "address", "name_place"].includes(runs[start].type))}).map((start)=>{return {...runs[start], start: parseInt(start), category:"original"}})
    this.setState({listTags : associateRuns}) 
  }
  onDragStart(event, start){
    console.log('drag start: ', start);
    event.dataTransfer.setData("start", start);
    // console.log('get from event: ', event.dataTransfer.getData("id"));
  }
  onDragOver(event){
    event.preventDefault();
  }
  onDrop(event, category){
    console.log("dropped");
    let start = event.dataTransfer.getData("start")
    let listTags = this.state.listTags.filter((tag)=>{
      if (tag.start == start){
        tag.category = category
      }
      return tag
    });
    this.setState({
      ...this.state,
      listTags: listTags
    });
  }
  addMoreGroupHandle(){
    var listGroupObj = this.state.listGroup;
    var groupNumber = "group_" + Object.keys(listGroupObj).length;
    listGroupObj[groupNumber] = [];
    this.setState({listGroup: listGroupObj});
    
  }
  showConfirmDialog = (isShow)=> {
    if (isShow){
      this.setState({isShowConfirmDialog: true})
    } else {
      this.setState({isShowConfirmDialog: false, isShowValidateError: false})
    }
  }
  submitHandle = ()=>{
    const text = this.state.text;
    var postObject = {
              name_activity: [],
              type_activity: [],
              holder: [],
              contact: [],
              reward: [],
              register: [],
              joiner: [],
              works:[]
              
          }

    // TODO: traverse through this.state.runs to get text's substring and push to array
    var listRuns = this.state.runs;
    for (var index in listRuns){
      var run = listRuns[index];
      if (Object.keys(postObject).includes(run.type)){
        postObject[run.type].push(text.substring(index, run.end))
      }
    }
    
    // TODO: traverse through this.state.listGroup.origin to get general time, address, name_place
    postObject.time = [];
    postObject.name_place = [];
    postObject.address = [];
    postObject.works = [];

    var generalList = ["time", "address", "name_place", "works"]

    var listTags = this.state.listTags;
    var groupDict = {}

    for (var index in listTags){
      var tag = listTags[index]
      var content = text.substring(tag.start, tag.end);
      if (generalList.includes(tag.type)){
        if (tag.category === "original"){
          postObject[tag.type].push(content);
        } else {
          if (Object.keys(groupDict).includes(tag.category)){
            groupDict[tag.category][tag.type].push(content);
          } else {
            groupDict[tag.category] = {
              time: [],
              address: [],
              name_place: [],
              works: []
            }
            groupDict[tag.category][tag.type].push(content);
          }

      }

      }
    }
    postObject.time_work_place_mapping = [];
    Object.keys(groupDict).map((key)=>{postObject.time_work_place_mapping.push(groupDict[key])});

    if (postObject.name_activity.length == 0){
      this.setState({
        isShowSuccessBadge: false,
        isShowErrorBadge: false,
        isShowConfirmDialog: false,
        isShowValidateError: true})
      return ;
    }
    axios.post(INSERT_API,{
      activity: postObject
    }).then((res)=>{
      
      this.setState({
        isShowConfirmDialog: false,
        isShowSuccessBadge: true,
        isShowErrorBadge: false
      })
    },
      (error)=>{
        
        this.setState({
          isShowConfirmDialog: false,
          isShowSuccessBadge: false,
          isShowErrorBadge: true
        })

      }
    )

  }

  render() {

    const { text, runs } = this.state;
    
    const newLocal = this;
    let currentRuns = 0;
    var draggingTags = {}
    for (var key in newLocal.state.listGroup){
      draggingTags[key] = []
    }
 
    newLocal.state.listTags.forEach((tag)=>{
      const {start, end, type} = tag
      const { color } = this.props.categories[type];

      var draggableTag = (<div 
                        className="draggable"
                        draggable
                        onDragStart = {(e)=> this.onDragStart(e, start)}
                        title={text.substring(start, end)}
                        style={{
                          backgroundColor: color,
                          background: color,
                          color: TinyColor(color).getBrightness() < 196 ? 'white' : 'black',
                        }}
                      >
                        {text.substring(start, end)}
                      </div>);
      
      

      if (tag.category in draggingTags){
        draggingTags[tag.category].push(draggableTag)
      } else {
        draggingTags[tag.category] = [draggableTag]
      }
    })
   
    

    return (
      <Form>
         
          
          <Form.Group className="form-group-custom">
            <textarea 
                      className="text-area"
                      type="text" 
                      name="custom-input" 
                      style={{verticalAlign:"text-top",width:"100%",height:"200px"}} 
                      placeholder="Nhập toàn bộ bài đăng hoạt động vào đây, bỏ toàn bộ biểu tượng cảm xúc hoặc ký tự đặc biệt nếu có thể ... "
                      onChange={this.onChangeInputValue.bind(this)}/>
            <Button
              type="button"
              className="btn btn-default btn-form"
              key="predict"
              disabled={this.state.isPredicting}
              onClick={this.predict}
            >
              Tự động phân tích
            </Button>
          </Form.Group>
          <Form.Group 
                  className="text-container form-group-custom"
                  key="text-container"
                  id={this.props.id}
                  ref={function setContainer(container) {
                    newLocal.container = container;
                  }}
          >
            <h6>Điều chỉnh lại bằng tay</h6>

            {Object.keys(this.props.categories).map(this.createButton)}
          

        
        

          <br/>

          {Object.keys(runs).map((start) => {
            
            const { end, type } = runs[start];
            
            const { color } = this.props.categories[type];
            let len = 0;
            const temp = currentRuns;
            currentRuns = end;
            const parts = text.substring(start, end).split('\n');
            return parts.map((x, i) => {
              const id = len;
              len += x.length + 1;
              if (i < parts.length - 1) {
                return [
                  <span
                    key={`${temp}-${id}`}
                    id={`${temp}-${id}`}
                    title={type}
                    style={{
                      
                      backgroundColor: color,
                      color: TinyColor(color).getBrightness() < 196 ? 'white' : 'black',
                    }}
                  >
                    {x}
                  </span>,
                  <br key={`${temp}br${id}`} />,
                ];
              }
              return (
                <span
                  title={type}
                  key={`${temp}-${id}`}
                  id={`${temp}-${id}`}
                  style={{
                    
                    backgroundColor: color,
                    color: TinyColor(color).getBrightness() < 196 ? 'white' : 'black',
                  }}
                >
                  {x}
                </span>
              );
            });
          })}
        </Form.Group>
        
        <br/>
        <h6>Dành cho hoạt động có nhiều thời gian, công việc, địa điểm, địa chỉ:</h6>
        <Form.Group className="form-group-custom">
            
            <Button
              type="button"
              className="btn btn-default btn-form"
              key="extract"
              onClick={this.extractToTag}
            >Tạo Tag kéo thả</Button>
            {Object.keys(draggingTags).length !== 0 && draggingTags.constructor === Object && (
                Object.keys(draggingTags).map((category)=>{

                  return <div className={category.split('_')[0]}
                      onDragOver={(e)=>newLocal.onDragOver(e)}
                      onDrop={(e)=>newLocal.onDrop(e, category)}

                      >
                        
                        {(category === "original") && (<div><h8>Kéo thả các tag từ ô này xuống các ô dưới để gom nhóm các thông tin</h8></div>)}
                        {(category !== "original") && (<div><h10>thời gian, công việc, địa điểm, địa chỉ</h10> <br/><br/><h10>Thả vào đây</h10> </div>)}
                        
                        {draggingTags[category].length > 0 && draggingTags[category]}
                      </div>
                      

                })

              )}
            <IconContext.Provider value={{ className: "add-more-icon" }}>
              <FaPlusCircle onClick={()=>newLocal.addMoreGroupHandle()}/>
            </IconContext.Provider>
          </Form.Group>
          <Form.Group className="form-group-custom">
            <Button
              type="button"
              className="btn btn-default btn-form"
              onClick={()=>newLocal.showConfirmDialog(true)}
              >Tạo hoạt động</Button>
              {this.state.isShowSuccessBadge && <Alert variant='success'>
                Thêm thành công!
              </Alert>}
              {this.state.isShowErrorBadge && <Alert variant='danger'>
                Có lỗi xảy ra!
              </Alert>}

          </Form.Group>
          <Modal show={this.state.isShowConfirmDialog} onHide={()=>newLocal.showConfirmDialog(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Xác nhận thêm hoạt động</Modal.Title>
            </Modal.Header>
            <Modal.Body>Bạn có chắc tạo mới hoạt động này?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={()=>newLocal.showConfirmDialog(false)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={this.submitHandle}>
                Tạo mới
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={this.state.isShowValidateError} onHide={()=>this.showConfirmDialog(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Lỗi</Modal.Title>
            </Modal.Header>
            <Modal.Body>Không tìm thấy thông tin tên hoạt động, vui lòng kiểm tra lại</Modal.Body>
            <Modal.Footer>
              
              <Button variant="primary" onClick={()=>this.showConfirmDialog(false)}>
                Đồng ý
              </Button>
            </Modal.Footer>
          </Modal>
      </Form>
      
    );
  }
}
