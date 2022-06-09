var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

var taskIdCounter = 0;

var tasks = [];

var completeEditTask = function(taskName, taskType, taskId) {
    // Find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // Set new rules
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // Loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType
        }
    };

    saveTask();

    alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

var taskFormHandler = function(event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  // Check if input values are empty strings
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }

  formEl.reset();

  var isEdit = formEl.hasAttribute("data-task-id");

  // Has data attribute, so get task id and call function to complete edit process
  if(isEdit) {
      var taskId = formEl.getAttribute("data-task-id");
      completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  // No data attribut, so create object as normal and pass to createTaskEl function
  else {
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
    };
    createTaskEl(taskDataObj);
  }
};

var createTaskEl = function (taskDataObj) {
  // Create List Item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // Add task id as a custom atrribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);

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

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

  // Add Entire list item to list
  tasksToDoEl.appendChild(listItemEl);

  // Gives task object ID
  taskDataObj.id = taskIdCounter;

  tasks.push(taskDataObj)

  // Save to local storage
  saveTask();

  // Increase counter for next unique id
  taskIdCounter++;

  console.log(taskDataObj);
  console.log(taskDataObj.status);
};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // Create Edit Button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // Create Delete Button 
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    // Create Select
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    
    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];
    
    for (var i = 0; i < statusChoices.length; i++) {
        // Create Option Element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        
        // Append to Select
        statusSelectEl.appendChild(statusOptionEl)
    }
    
    return actionContainerEl;
};


// Delete Task Function
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // Create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // Loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        // If tasks[i].id doesn't match taskId we will keep it and push it to the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i])
        }
    };

    // Reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

  saveTask();
};

// Edit Task Function
var editTask = function(taskId) {
    formEl.setAttribute("data-task-id", taskId);
    
    // Get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    
    // Get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    
    document.querySelector("#save-task").textContent = "Save Task";
};

var taskButtonHandler = function (event) {
    // Get target element from event
    var targetEl = event.target;
    
    // Edit button was clicked
    if(targetEl.matches(".edit-btn")){
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId)
    }
    
    // Delete button was clicked
    if(targetEl.matches(".delete-btn")) {
        // Get the elements task ID
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var taskStatusChangeHandler = function(event) {
    // Get the task item's ID
    var taskId = event.target.getAttribute("data-task-id");

    // Get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // Find the parent task item element based on ID
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } 
    else  if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // Update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status === statusValue;
        }
    };

    saveTask();
};

var saveTask = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function() {
    // Get task items from local storage
    tasks = window.localStorage.getItem('tasks');
    console.log(tasks)

    if (tasks === null) {
        tasks = [];
        return false;
    };

    // Converts tasks from the string format back into an array of objects
    tasks = JSON.parse(tasks);
    console.log(tasks);

    // Iterates through a tasks array and creates elements on the page from it
    for (var i = 0; i < tasks.length; i++) {
        console.log(tasks[i]);
        tasks[i].id = taskIdCounter;

        console.log(tasks[i]);

        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";
        listItemEl.setAttribute("data-task-id", tasks[i].id);
        console.log(listItemEl);

        var taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";

        listItemEl.appendChild(taskInfoEl);

        var taskActionsEl = createTaskActions(tasks[i].id);

        listItemEl.appendChild(taskActionsEl);
        console.log(listItemEl);

        if (tasks[i].status === "to do") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksInProgressEl.appendChild(listItemEl);
        } else if (tasks[i].status === "in progress") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.appendChild(listItemEl);
        } else if (tasks[i].status === "complete") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksInProgressEl.appendChild(listItemEl);
        }
        taskIdCounter++;
        console.log(listItemEl)
    };

};

formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();