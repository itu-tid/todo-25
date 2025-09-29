import styled from "styled-components";

const ToDoItem = styled.li`
  list-style: none;
`;

const ToDoItemSC = styled(ToDoItem)`
  background-color: #ffffff;
  font-size: 1em;
  color: blue;
  font-weight: 400;
`;

const SelectedToDoItemSC = styled(ToDoItem)`
  background-color: lightgoldenrodyellow;
  font-size: 1.2em;
  color: #bf4f74;
  font-weight: 700;
`;

export { ToDoItemSC, SelectedToDoItemSC };
