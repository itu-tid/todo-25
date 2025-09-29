import { SelectedToDoItemSC, ToDoItemSC } from "./ToDoItemSC";

export default function ToDoItem({ highlight, children }) {
  return highlight ? (
    <SelectedToDoItemSC>{children}</SelectedToDoItemSC>
  ) : (
    <ToDoItemSC>{children}</ToDoItemSC>
  );
}
