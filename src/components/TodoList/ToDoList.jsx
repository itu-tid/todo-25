import { useEffect, useState, useRef } from "react";
import { Title, Wrapper } from "../Title";

import ToDoItem from "../TodoItem/ToDoItem";
import PlayStopButton from "./PlayStopButton";
import ItemDuration from "./ItemDuration";
import RemoveItemButton from "./RemoveItemButton";

import {
  fetchTodosByCategory,
  createTodoItem,
  updateTodoItem,
  deleteTodoItem,
  setDoneState,
  updateTodoTime,
} from "../../services/todoService";

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

  // Load todos from Parse on mount
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todos = await fetchTodosByCategory(name);
        const sorted = todos.sort((a, b) => a.done - b.done);
        setList(sorted);
      } catch (error) {
        console.error("Error loading todos:", error);
        setList([]);
      }
    };

    loadTodos();
  }, [name]);

  function handleInputChange(event) {
    setInput(event.target.value);
  }

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

  async function handleAddClick() {
    if (!input.trim()) return;

    try {
      const newItem = await createTodoItem(input, name);
      const newList = [...list, newItem];
      const sorted = newList.sort((a, b) => a.done - b.done);
      setList(sorted);
      setInput("");
    } catch (error) {
      console.error("Error creating todo:", error);
      alert("Failed to create todo: " + error.message);
    }
  }

  async function handleCheckbox(element_id) {
    if (activeElementId === element_id) {
      handleStopTimer(element_id);
    }

    const currentItem = list.find((e) => e.id === element_id);
    if (!currentItem) return;

    try {
      await setDoneState(element_id, !currentItem.done);

      let newList = list.map((e) => {
        return e.id === element_id ? { ...e, done: !e.done } : e;
      });

      const sorted = newList.sort((a, b) => a.done - b.done);
      setList(sorted);
    } catch (error) {
      console.error("Error setting done state:", error);
    }
  }

  function handleKeydownInInput(event) {
    if (event.code == "Enter") {
      handleAddClick();
    }
  }

  async function deleteElement(element_id) {
    try {
      await deleteTodoItem(element_id);

      const newList = list.filter((e) => {
        return e.id !== element_id;
      });

      setList(newList);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
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

  async function handleStopTimer(elementId) {
    const currentItem = list.find((e) => e.id === elementId);
    if (!currentItem || !currentItem.currentSessionStart) return;

    const sessionTime = Math.floor(
      (Date.now() - currentItem.currentSessionStart) / 1000
    );
    const newTotalTime = (currentItem.totalTime || 0) + sessionTime;

    try {
      // Save to Parse
      await updateTodoTime(elementId, newTotalTime, null);

      // Update local state
      setList((list) =>
        list.map((e) => {
          if (e.id === elementId) {
            return {
              ...e,
              totalTime: newTotalTime,
              currentSessionStart: null,
            };
          }
          return e;
        })
      );
    } catch (error) {
      console.error("Error stopping timer:", error);
    }

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

            <RemoveItemButton onClick={() => deleteElement(elem.id)} />
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
