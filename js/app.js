const taskInput = document.getElementById("task_input");
const DateInput = document.getElementById("date_input");
const AddButton = document.getElementById("add_button");
const editButton = document.getElementById("edit_button");
const alertMassage = document.getElementById("alert_massage");
const todosBody = document.querySelector("tbody");
const deleteAllButton = document.getElementById("delete_all_button");
const filterButtons = document.querySelectorAll(".filter_todos");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

const generateId = () => {
  return Math.round(
    Math.random() * Math.random() * Math.pow(10, 15)
  ).toString();
};
const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};
const ShowAlert = (message, type) => {
  alertMassage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`alert_${type}`);
  alertMassage.append(alert);
  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};

const displayTodos = (data) => {
  const todoList = data || todos;
  todosBody.innerHTML = "";
  if (!todoList.length) {
    todosBody.innerHTML = "<tr><td colspan = '4'>No task found!</td></tr>";
    return;
  }
  todoList.forEach((todo) => {
    todosBody.innerHTML += `
        <tr>
            <td>${todo.task}</td>
            <td>${todo.date ? todo.date : "No date !"}</td>
            <td>${todo.completed ? "completed" : "pending"}</td>
            <td>
                <button onclick="editHandler('${todo.id}')">Edit</button>
                <button onclick="toggleHandler('${todo.id}')">
                    ${todo.completed ? "Undo" : "Do"}
                </button>
                <button onclick="deleteHandler('${todo.id}')">Delete</button>
            </td>
        </tr>
    `;
  });
};

const addHandler = () => {
  const task = taskInput.value;
  const date = DateInput.value;
  const todo = {
    id: generateId(),
    completed: false,
    task: task,
    date: date,
  };
  if (task) {
    todos.push(todo);
    saveToLocalStorage();
    displayTodos();
    taskInput.value = "";
    DateInput.value = "";
    ShowAlert("Todo added successfully", "success");
  } else {
    ShowAlert("Please Enter a todo !", "error");
  }
};
const deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveToLocalStorage();
    displayTodos();
    ShowAlert("All todos cleared succesfully", "success");
  } else {
    ShowAlert("No todos to clear!", "error");
  }
};
const deleteHandler = (id) => {
  const newTodos = todos.filter((todo) => todo.id !== id);
  todos = newTodos;
  saveToLocalStorage();
  displayTodos();
  ShowAlert("Todo deleted succesfully", "success");
};
const toggleHandler = (id) => {
  const newTodos = todos.map((todo) => {
    if (todo.id == id) {
      // (1)
      //   return {
      //     id: todo.id,
      //     task: todo.task,
      //     date: todo.date,
      //     completed: !todo.completed,
      //   };
      // (2)
      return {
        ...todo,
        completed: !todo.completed,
      };
    } else {
      return todo;
    }
  });
  todos = newTodos;
  //   (3)
  // const todo = todos.find((todo) => todo.id == id);
  // todo.completed = !todo.completed;
  saveToLocalStorage();
  displayTodos();
  ShowAlert("Todo status changed succesfully", "success");
};
const editHandler = (id) => {
    const todo = todos.find((todo) => todo.id == id);
    taskInput.value = todo.task;
    DateInput.value = todo.date;
    AddButton.style.display="none"
    editButton.style.display ="inline-block";
    editButton.dataset.id = id;
}
const applyEditHandler = (event) => {
    const id = event.target.dataset.id;
    const todo = todos.find((todo) => todo.id == id);
    todo.task = taskInput.value;
    todo.date = DateInput.value;
    taskInput.value = "";
    DateInput.value = "";
    AddButton.style.display = "inline-block";
    editButton.style.display = "none"
    saveToLocalStorage();
    displayTodos();
    ShowAlert("Todo Edited succesfully", "success");
}


const filterHandler = (event) => {
  let filteredTodos = null;
  const filter = event.target.dataset.filter;
  switch (filter) {
    case "pending":
      filteredTodos = todos.filter((todo) => todo.completed === false);
      break;
    case "completed":
      filteredTodos = todos.filter((todo) => todo.completed === true);
      break;

    default:
      filteredTodos = todos;
      break;
  }
  displayTodos(filteredTodos)
};

window.addEventListener("load", () =>  displayTodos());
AddButton.addEventListener("click", addHandler);
deleteAllButton.addEventListener("click", deleteAllHandler);
editButton.addEventListener("click" , applyEditHandler)
filterButtons.forEach((button) => {
  button.addEventListener("click" , filterHandler)
})