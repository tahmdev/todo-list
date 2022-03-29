import logo from './logo.svg';
import './App.css';
import React, { useEffect } from "react"
import { useState } from 'react';
import useTodo from "./useTodo.js"
import TodoTemplate from './TodoTemplate';

function App() {
  return (
    <div className="App">
      <Main />
    </div>
  );
}

let intervalId = null;



const Main = () => {
  //get "list" from localStorage or return ""
  const [todoList, setTodoList] = useTodo("list", "")
  const [timer, setTimer] = useState(0)
  const [filter, setFilter] = useState("Ongoing")
  const [sortBy, setSortBy] = useState("Date added ↓") 
  //timer used to update all todo objects using useEffect 
  if (intervalId) {
    clearInterval(intervalId);
  }
  intervalId = setInterval(() => {  
    let newTimer = timer +1
    setTimer(newTimer)
  }, 1000);

  const resetDummy = () => {
    setTodoList("")
  }
  const addTodo = () => {
    let prevTodoList = [...todoList];
    let now = new Date();
    setTodoList(
      [...prevTodoList, {
        title: "",
        body: "",
        status: "Ongoing",
        isEdit: true,
        dateAdded: now,
        deadline: now,
        color: "#795548"
      }, ]
    )
  }
  //sort
  useEffect(() => {
    let newArr = [...todoList]

    switch(sortBy){
      case "Date added ↑":
        newArr.sort((a, b) => a.dateAdded > b.dateAdded ? 1 : a.dateAdded < b.dateAdded ? -1 : 0)

        break;
      case "Date added ↓":
        newArr.sort((a, b) => a.dateAdded > b.dateAdded ? -1 : a.dateAdded < b.dateAdded ? 1 : 0)
        break;
      case "Time left ↑":
        newArr.sort((a, b) => a.deadline > b.deadline ? 1 : a.deadline < b.deadline ? -1 : 0)
        
        break;
      case "Time left ↓":
        newArr.sort((a, b) => a.deadline > b.deadline ? -1 : a.deadline < b.deadline ? 1 : 0)
        break;
    }
    setTodoList(newArr)
  }, [sortBy])
  
  useEffect(() => {
  }, [todoList])
  return (
    <div>
      <div className="controls-flex">
        <div className="controls">
          <button className="new-item-button"onClick={addTodo}>New item</button>
          <div className="select-wrapper">
            <select className="controls-select" id="filter-select" onChange={e => setFilter(e.target.value)} value={filter}>
              <option>All</option>
              <option>Ongoing</option>
              <option>On hold</option>
              <option>Completed</option>
            </select>
            <select className="controls-select" id="sort-select" onChange={e => setSortBy(e.target.value)}>
              <option>Date added ↓</option>
              <option>Date added ↑</option>
              <option>Time left ↓</option>
              <option>Time left ↑</option>
            </select>
          </div>
        </div>
      </div>
      <div className="todo-container">
        {todoList && todoList.map((item, idx) => {
          if (filter === "All" || filter === item.status){
            return (
              <TodoTemplate 
              key={item.title + item.dateAdded}
              title={item.title}
              body={item.body}
              status={item.status}
              priority={item.priority}
              idx = {idx}
              todoList = {todoList}
              setTodoList = {setTodoList}
              isEdit = {item.isEdit}
              dateAdded = {item.dateAdded}
              timer = {timer}
              totalTime = {item.totalTime}
              color= {item.color}
              />
            )
          }
          
        })}
      </div>
      
    </div>
  )
}


export default App;
