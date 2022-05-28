var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var taskFormHandler = function(event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  // Check if input values are empty strings
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return fasle;
  }

  formEl.reset();

  // Package up data like an object
  var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput,
  };

  // Send it as an arcument to createTaskEl
  createTaskEl(taskDataObj);
};

var createTaskEl = function (taskDataObj) {
  // Create List Item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // Create Div to holdtask info and add to list item
  var taskInfoEl = document.createElement("div");
  // Give it a class name
  taskInfoEl.className = "task-info";
  // Add HTML content to div
  taskInfoEl.innerHTML =
    "<h3 class='task-name'>" +
    taskDataObj.name +
    "</h3><span class='task-type'>" +
    taskDataObj.type +
    "</span>";

  listItemEl.appendChild(taskInfoEl);


  // Add Entire list item to list
  tasksToDoEl.appendChild(listItemEl);
};

formEl.addEventListener("sumbit", taskFormHandler);