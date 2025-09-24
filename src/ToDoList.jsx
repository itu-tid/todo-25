import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Title, Wrapper } from "./components/Title";

export default function ToDoList({ name }) {
  const [list, setList] = useState(null);
  const [input, setInput] = useState("");
  const [totalTaskCount, setTotalTaskCount] = useState(0);

  useEffect(() => {
    const data = localStorage.getItem(name);
    setList(data ? JSON.parse(data) : []);
  }, []);

  function saveListToLocalStorage(newList) {
    localStorage.setItem(name, JSON.stringify(newList));
  }

  function handleInputChange(event) {
    setInput(event.target.value);
  }

  // Every time the list changes, we save it to local storage
  useEffect(() => {
    if (list != null) {
      saveListToLocalStorage(list);
    }
  }, [list]);

  useEffect(() => {
    if (list !== null) {
      setTotalTaskCount(list.length);
    }
  }, [list]);

  function handleAddClick() {
    var newList = [...list, { id: uuidv4(), name: input, done: false }];
    setList(newList);
  }

  function handleCheckbox(element_id) {
    let newList = list.map((e) => {
      return e.id == element_id ? { id: e.id, name: e.name, done: !e.done } : e;
    });

    setList(newList);
  }

  function deleteElement(element_id) {
    let newList = list.filter((e) => {
      return e.id != element_id;
    });

    setList(newList);
  }

  if (list === null) {
    return "...";
  }

  return (
    <>
      <Wrapper>
        <Title>{name}</Title>
        <small>Total: {totalTaskCount}</small>
      </Wrapper>

      <ul>
        {list.map((elem) => (
          <li
            style={{ textDecoration: elem.done ? "line-through" : "" }}
            key={elem.id}
          >
            {elem.name}
            <input
              type="checkbox"
              value={elem.done}
              checked={elem.done}
              onClick={() => handleCheckbox(elem.id)}
            />
            {elem.done && "🎉"}
            <a
              href="#"
              onClick={() => deleteElement(elem.id)}
              style={{ color: "red" }}
            >
              x
            </a>
          </li>
        ))}
      </ul>

      <input type="text" onChange={handleInputChange} value={input}></input>

      <button autoFocus={true} onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
