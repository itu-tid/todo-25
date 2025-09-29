import styled from "styled-components";

const ToDoItemSC = styled.li`
  list-style: "none";
  background-color: "white";
  font-size: "1em";
  color: "darkBlue";
  font-weight: "400";
`;

const SelectedToDoItemSC = styled.li`
  list-style: "none";
  background-color: "lightgoldenrodyellow";
  font-size: "2em";
  color: #bf4f74;
  font-weight: "700";
`;

export { ToDoItemSC, SelectedToDoItemSC };
