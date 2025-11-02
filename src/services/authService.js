import Parse from "parse";

/**
 * Service layer for User Authentication
 * This file handles user signup, login, logout, and session management
 */

/**
 * Sign up a new user
 * @param {string} username - The username for the new account
 * @param {string} password - The password for the new account
 * @param {string|null} email - Optional email address
 * @returns {Promise<Object>} The created user object with id, username, email, and createdAt
 */
export async function signUp(username, password, email = null) {
  const user = new Parse.User();
  user.set("username", username);
  user.set("password", password);

  if (email) {
    user.set("email", email);
  }

  try {
    const newUser = await user.signUp();

    return {
      id: newUser.id,
      username: newUser.get("username"),
      email: newUser.get("email"),
      createdAt: newUser.get("createdAt"),
    };
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
}

/**
 * Log in an existing user
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {Promise<Object>} The logged in user object with id, username, email, and createdAt
 */
export async function logIn(username, password) {
  try {
    const user = await Parse.User.logIn(username, password);

    return {
      id: user.id,
      username: user.get("username"),
      email: user.get("email"),
      createdAt: user.get("createdAt"),
    };
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

/**
 * Log out the current user
 * @returns {Promise<void>}
 */
export async function logOut() {
  try {
    await Parse.User.logOut();
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}

/**
 * Get the current logged in user
 * @returns {Object|null} The current user object or null if not logged in
 */
export function getCurrentUser() {
  const currentUser = Parse.User.current();

  if (!currentUser) {
    return null;
  }

  return {
    id: currentUser.id,
    username: currentUser.get("username"),
    email: currentUser.get("email"),
    createdAt: currentUser.get("createdAt"),
  };
}

/**
 * Check if a user is currently logged in
 * @returns {boolean} True if user is logged in, false otherwise
 */
export function isLoggedIn() {
  return Parse.User.current() !== null;
}
