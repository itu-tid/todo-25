import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Title, Wrapper } from "./components/Title";

import ToDoItem from "./components/ToDoItem";
import PlayStopButton from "./PlayStopButton";
import ItemDuration from "./ItemDuration";
import RemoveItemButton from "./RemoveItemButton";
import Parse from "parse";

function totalTime(elem) {
  const time = elem.currentSessionStart
    ? (elem.totalTime || 0) +
      Math.floor((Date.now() - elem.currentSessionStart) / 1000)
    : elem.totalTime || 0;
  return time;
}

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

  // Save timer state before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      // If there's an active timer, stop it to save the accumulated time
      if (activeElementId) {
        handleStopTimer(activeElementId);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [activeElementId]);

  function handleAddClick() {
    const TodoItem = Parse.Object.extend("TodoItem");
    const newItem = new TodoItem();

    newItem.set("name", input);
    newItem.set("done", false);

    newItem.save().then(
      (newObj) => {
        alert("saved a todo with id: " + newObj.id);
      },
      (error) => {
        alert(error.message);
      }
    );

    const newList = [...list, { id: uuidv4(), name: input, done: false }];
    setList(newList);
    setInput("");
  }

  function handleCheckbox(element_id) {
    if (activeElementId === element_id) {
      handleStopTimer(element_id);
    }
    let newList = list.map((e) => {
      return e.id == element_id ? { ...e, done: !e.done } : e;
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
    const newList = list.filter((e) => {
      return e.id != element_id;
    });

    setList(newList);
  }

  // ==============================================================================
  //                                    TIMER
  // ==============================================================================

  function handleStartTimer(element_id) {
    let currentElement = list.find((e) => e.id === element_id);

    // Mark when this session started
    setList((list) =>
      list.map((e) =>
        e.id === element_id ? { ...e, currentSessionStart: Date.now() } : e
      )
    );

    setActiveElementId(currentElement.id);

    // clear previous timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // start new one - force re-render every second to update display
    intervalRef.current = setInterval(() => {
      // Force a re-render by updating the list (without actually changing data)
      setList((list) => [...list]);
    }, 1000);
  }

  function handleStopTimer(elementId) {
    // Save accumulated time and clear currentSessionStart
    setList((list) =>
      list.map((e) => {
        // map to save the current element duration

        if (e.id === elementId && e.currentSessionStart) {
          const sessionTime = Math.floor(
            (Date.now() - e.currentSessionStart) / 1000
          );
          return {
            ...e,
            totalTime: (e.totalTime || 0) + sessionTime,
            currentSessionStart: null,
          };
        }
        return e;
      })
    );

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
          <ToDoItem highlight={elem.id == activeElementId} key={elem.id}>
            <PlayStopButton
              isHidden={elem.done}
              isPlaying={elem.id === activeElementId}
              onPlay={() => handleStartTimer(elem.id)}
              onStop={() => handleStopTimer(elem.id)}
            />

            {elem.name}

            <input
              type="checkbox"
              checked={elem.done}
              onChange={() => handleCheckbox(elem.id)}
            />

            {elem.done && " 🎉"}

            <ItemDuration
              displayTime={totalTime(elem)}
              showAnimation={elem.id === activeElementId}
            />

            <RemoveItemButton onClick={() => deleteElement(elementId)} />
          </ToDoItem>
        ))}
      </ul>

      <input
        type="text"
        onChange={handleInputChange}
        onKeyDown={handleKeydownInInput}
        value={input}
      ></input>

      <button onClick={handleAddClick}>Add</button>
    </>
  );
}
