import { useState, useEffect } from "react";
import "../App.css";
import ToDoList from "../components/TodoList/ToDoList";
import LoginPage from "./LoginPage";
import { getCurrentUser, logOut } from "../services/authService";
import { CATEGORIES } from "../constants/categories";
import { Header, WelcomeMessage, LogoutButton } from "./HomePage.sc";

function HomePage() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in on mount
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleLoginSuccess = () => {
    const user = getCurrentUser();
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setCurrentUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // If no user is logged in, show the authentication form
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // If user is logged in, show the todo lists
  return (
    <>
      <Header>
        <WelcomeMessage>Welcome, {currentUser.username}!</WelcomeMessage>
      </Header>

      <ToDoList name={CATEGORIES.IMPORTANT_URGENT} />
      <ToDoList name={CATEGORIES.IMPORTANT_NOT_URGENT} />
      <ToDoList name={CATEGORIES.NOT_IMPORTANT_URGENT} />
      <ToDoList name={CATEGORIES.NOT_IMPORTANT_NOT_URGENT} />

      <br />
      <LogoutButton onClick={handleLogout}>Log Out</LogoutButton>
    </>
  );
}

export default HomePage;
