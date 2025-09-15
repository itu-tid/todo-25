import { useState } from "react";
import "./App.css";
import ToDoList from "./ToDoList";

function App() {
  return (
    <>
      <ToDoList name="Important & Urgent" />
      <ToDoList name="Important & Not Urgent" />
      <ToDoList name="Not Important & Urgent" />
      <ToDoList name="Not Important & Not Urgent" />
    </>
  );
}

export default App;
