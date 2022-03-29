import { useEffect, useState } from "react";
import DateTimePicker from 'react-datetime-picker'
import 'font-awesome/css/font-awesome.min.css';
import { CirclePicker } from "react-color";

//////////////TODO: Hide time left on onhold / add time finished on completed

const TodoTemplate = (props) => {
    let deadline = new Date(props.todoList[props.idx].deadline);
    const [isEdit, setIsEdit] = useState(props.isEdit);
    const [currentTitle, setCurrentTitle] = useState(props.todoList[props.idx].title)
    const [currentBody, setCurrentBody] = useState(props.todoList[props.idx].body)
    const [currentStatus, setCurrentStatus] = useState(props.todoList[props.idx].status)
    const [currentDeadline, setCurrentDeadline] = useState(deadline)
    const [timeLeft, setTimeLeft] = useState("Calculating...")
    const [timeColor, setTimeColor] = useState("green")
    const [color, setColor] = useState(props.color)
    const [fontColor, setFontColor] = useState("white")
    const handleSave =()=> {
        let now = new Date();
        setIsEdit(false);
        let newArr = [...props.todoList]
        newArr[props.idx] = {
            title: currentTitle,
            body: currentBody,
            status: currentStatus,
            dateAdded: props.dateAdded,
            deadline: currentDeadline,
            totalTime: Math.floor((currentDeadline - now) / (1000*60) +1),
            color: color,
        }
        setTimeColor("green")
        props.setTodoList(newArr)
    }
    const handleEdit = () => {
        
        setIsEdit(true);
    }
    const handleCancel= () => {
        setIsEdit(false)
    }
    const calculateTimeLeft = () => {
        if (currentDeadline && props.status == "Ongoing"){
            let now = new Date();
            let difference = Math.floor((currentDeadline - now) / (1000*60))  
            
            if (props.totalTime / 4 >= difference+1 && timeColor === "orange") {
                setTimeColor("red")
            }
            else if (props.totalTime / 2 >= difference+1 && timeColor === "green") {
                setTimeColor("orange")
            }
            
            if (difference > 1439){
                difference = Math.floor(difference / 60 / 24)
                setTimeLeft(`${difference} Days`)
            }
            else if (difference > 59){
                difference = Math.floor(difference / 60)
                setTimeLeft(`${difference +1} Hours`)
            }
            else{
                setTimeLeft(`${difference +1} Minutes`)
            }
            
        }
    }
    const timeStyles = {
        backgroundColor: timeColor == "green"? "green" : timeColor =="orange" ? "orange" : "red",
    }
    const headerStyles = {
        backgroundColor: props.status === "Ongoing" ? "#c3f0bb" : props.status === "On hold" ? "#f2c874" : "#f78686",
    }
    //timer
    useEffect(() => {
        calculateTimeLeft()
    }, [props.timer])
    //adjust font color
    useEffect(() => {
        if(color === "#cddc39" || color === "#ffeb3b" || color === "#ffc107"){
            setFontColor("black")
        }
        else{
            setFontColor("white")
        }
    }, [color])

    if (isEdit == true){
        return(
            <div className="todo-wrapper" >
                <div className="todo-header" >
                <input className="todo-edit-title" type="text" placeholder="Title" onChange={e => setCurrentTitle(e.target.value)} value={currentTitle}/>
                <select className="todo-edit-select" onChange={e => setCurrentStatus(e.target.value)} value={currentStatus}>
                    <option>Ongoing</option>
                    <option>On hold</option>
                    <option>Completed</option>
                </select>
                </div>
        
                <textarea className="todo-edit-body"placeholder="Todo here" onChange={e => setCurrentBody(e.target.value)} value={currentBody}/>
                <div className="todo-edit-footer">
                    <div id="todo-edit-button-wrapper">
                        <DeleteButton 
                        indexToDelete = {props.idx}
                        todoList = {props.todoList}
                        setTodoList = {props.setTodoList}
                        />
                        <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                        <button className="save-button" onClick={handleSave}>Save</button>
                    </div>
                    <DateTimePicker onChange={setCurrentDeadline} value={currentDeadline} />
                </div>
                <CirclePicker 
                    color={color}
                    onChange={color => setColor(color.hex)}
                    />
            </div>
        )
    }
    return (
      <div className="todo-wrapper" style={{backgroundColor: color}}>
        <div className="todo-header" style={headerStyles}>
          <h2 className="todo-title">{props.title}</h2>
          <span className="todo-status">{props.status}</span>
        </div>
        <p className="todo-body" style={{color: fontColor}}>{props.body}</p>
        <div className="todo-footer" style={{backgroundColor: color}}>
            <button className="edit-button" onClick={handleEdit}>Edit</button>
            <div className="todo-time-wrapper">
                <span className="todo-time-left" style={{color: fontColor}}>{timeLeft}</span>
                <div id="todo-time-left-color" style={timeStyles}></div>
            </div>
        </div>
      </div>
    )
  }
  
const DeleteButton = (props) => {
    const handleDelete = () => {
        console.log(props.todoList)
        let newArr = [...props.todoList]
        props.setTodoList(newArr.filter((item, idx) => idx !== props.indexToDelete))
        
    }
    return(
        <button className="delete-button" onClick={handleDelete}>Delete</button>
    )
    }
export default TodoTemplate