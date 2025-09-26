import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Title, Wrapper } from "./components/Title";

import { StopCircleOutlined } from "@mui/icons-material";
import { PlayArrowOutlined } from "@mui/icons-material";
import moment from "moment";

export default function ToDoList({ name }) {
  const [list, setList] = useState(null);
  const [input, setInput] = useState("");
  const [totalTaskCount, setTotalTaskCount] = useState(0);
  const [activeElementId, setActiveElementId] = useState();

  const intervalRef = useRef(null);

  useEffect(() => {
    const data = localStorage.getItem(name);
    const listFromStorage = data ? JSON.parse(data) : [];
    const sorted = listFromStorage.sort((a, b) => a.done - b.done);

    setList(sorted);
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
    setInput("");
  }

  function handleCheckbox(element_id) {
    let newList = list.map((e) => {
      return e.id == element_id ? { id: e.id, name: e.name, done: !e.done } : e;
    });

    const sorted = newList.sort((a, b) => a.done - b.done);

    setList(sorted);
  }

  function handleKeydownInInput(event) {
    if (event.code == "Enter") {
      handleAddClick();
    }
  }

  function deleteElement(element_id) {
    let newList = list.filter((e) => {
      return e.id != element_id;
    });

    setList(newList);
  }

  function handleStartTimer(element_id) {
    console.log(element_id);

    let currentElement = list.find((e) => e.id === element_id);
    console.log(currentElement);

    setActiveElementId(currentElement.id);
    console.log("set active element id: " + currentElement.id);

    // clear previous timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // start new one
    intervalRef.current = setInterval(() => {
      setList((list) => {
        let newList = list.map((e) => {
          return e.id == element_id
            ? { ...e, timer: e.timer !== undefined ? e.timer + 1 : 0 }
            : e;
        });
        return newList;
      });
    }, 1000);
  }

  function handleStopTimer(element_id) {
    setActiveElementId(null);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
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
          <div>
            <li
              style={{
                listStyle: "none",
                backgroundColor:
                  elem.id === activeElementId
                    ? "lightgoldenrodyellow"
                    : "white",
                fontSize: elem.id === activeElementId ? "x-large" : "normal",
                color: elem.id === activeElementId ? "violet" : "darkBlue",
                fontWeight: elem.id === activeElementId ? "700" : "400",
              }}
              key={elem.id}
            >
              &nbsp;
              {!elem.done ? (
                elem.id !== activeElementId ? (
                  <PlayArrowOutlined
                    onClick={() => handleStartTimer(elem.id)}
                  ></PlayArrowOutlined>
                ) : (
                  <StopCircleOutlined
                    onClick={() => handleStopTimer(elem.id)}
                  ></StopCircleOutlined>
                )
              ) : (
                <PlayArrowOutlined
                  style={{
                    visibility: "hidden",
                  }}
                ></PlayArrowOutlined>
              )}
              &nbsp;
              {/* Checkbox */}
              <input
                type="checkbox"
                value={elem.done}
                checked={elem.done}
                onChange={() => handleCheckbox(elem.id)}
              />
              {elem.name}
              {elem.timer && (
                <span
                  style={{
                    fontSize: "small",
                    color: "green",
                    marginLeft: "1em",
                  }}
                >
                  ({elem.timer} /{" "}
                  {moment.duration(elem.timer, "seconds").humanize()})
                </span>
              )}
              {elem.done && "🎉"}
              {/* Remove */}
              <a
                href="#"
                onClick={() => deleteElement(elem.id)}
                style={{
                  color: "#a2a2a2cf",
                  fontSize: "xx-small",
                  marginLeft: "2em",
                  textDecoration: "none",
                }}
              >
                (remove)
              </a>
            </li>
          </div>
        ))}
      </ul>

      <input
        type="text"
        onChange={handleInputChange}
        onKeyDown={handleKeydownInInput}
        value={input}
      ></input>

      <button autoFocus={true} onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
