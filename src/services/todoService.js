import Parse from "parse";

/**
 * Service layer for TodoItem operations
 */

// Define the TodoItem Parse class
const TodoItem = Parse.Object.extend("TodoItem");

/**
 * Convert a Parse TodoItem object to a plain JavaScript object
 * @param {Parse.Object} parseObj - The Parse object to convert
 * @returns {Object} Plain JavaScript object with todo data
 */
function todoItemToPlainObject(parseObj) {
  return {
    id: parseObj.id,
    name: parseObj.get("name"),
    done: parseObj.get("done"),
    totalTime: parseObj.get("totalTime") || 0,
    currentSessionStart: parseObj.get("currentSessionStart"),
    category: parseObj.get("category"),
    createdAt: parseObj.get("createdAt"),
    updatedAt: parseObj.get("updatedAt"),
  };
}

/**
 * Fetch all todo items for a specific category for the current user
 * @param {string} category - The category to filter by
 * @returns {Promise<Array>} Array of todo items as plain objects
 */
export async function fetchTodosByCategory(category) {
  const currentUser = Parse.User.current();

  const query = new Parse.Query(TodoItem);
  query.equalTo("category", category);
  query.equalTo("userId", currentUser);

  // Oldest first
  query.ascending("createdAt");

  try {
    const results = await query.find();
    return results.map(todoItemToPlainObject);
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
}

/**
 * Create a new todo item
 * @param {string} name - The task description
 * @param {string} category - The category key
 * @returns {Promise<Object>} The created todo item
 */
export async function createTodoItem(name, category) {
  const currentUser = Parse.User.current();

  if (!currentUser) {
    throw new Error("User must be logged in to create todos");
  }

  const item = new TodoItem();
  item.set("name", name);
  item.set("category", category);
  item.set("done", false);
  item.set("totalTime", 0);
  item.set("currentSessionStart", null);
  item.set("userId", currentUser);

  // Set ACL - only the creator can read and write this todo
  const acl = new Parse.ACL();
  acl.setReadAccess(currentUser, true);
  acl.setWriteAccess(currentUser, true);
  item.setACL(acl);

  try {
    const result = await item.save();
    return todoItemToPlainObject(result);
  } catch (error) {
    console.error("Error creating todo:", error);
    throw error;
  }
}

/**
 * Update an existing todo item
 * @param {string} id - The Parse objectId
 * @param {Object} updates - Object with fields to update
 * @returns {Promise<Object>} The updated todo item
 */
export async function updateTodoItem(id, updates) {
  const query = new Parse.Query(TodoItem);

  try {
    const item = await query.get(id);

    // Set only the fields that are provided
    Object.keys(updates).forEach((key) => {
      item.set(key, updates[key]);
    });

    const result = await item.save();
    return todoItemToPlainObject(result);
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
}

/**
 * Delete a todo item
 * @param {string} id - The Parse objectId
 * @returns {Promise<void>}
 */
export async function deleteTodoItem(id) {
  const query = new Parse.Query(TodoItem);

  try {
    const item = await query.get(id);
    await item.destroy();
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
}

/**
 * Set the done state of a todo item
 * @param {string} id - The Parse objectId
 * @param {boolean} done - The done state to set
 * @returns {Promise<Object>} The updated todo item
 */
export async function setDoneState(id, done) {
  return updateTodoItem(id, { done });
}

/**
 * Update the time tracking for a todo item
 * @param {string} id - The Parse objectId
 * @param {number} totalTime - The total accumulated time in milliseconds
 * @param {Date|null} currentSessionStart - The start time of current session, or null if not running
 * @returns {Promise<Object>} The updated todo item
 */
export async function updateTodoTime(id, totalTime, currentSessionStart) {
  return updateTodoItem(id, { totalTime, currentSessionStart });
}
