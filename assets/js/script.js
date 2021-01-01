//progress: start of 4.5.6
var pageContentEl = document.querySelector('#page-content');
var taskIdCounter = 0;
var formEl =  document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

var taskFormHandler = function(event){
    event.preventDefault();
     
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    
    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }
    
    formEl.reset();
    
    // console log if this is an edit of an existing task
    var isEdit = formEl.hasAttribute("data-task-id");
    
    if (isEdit){
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    else {
        //package data as an object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };
        
        //send it as an argument to createTaskEl
        createTaskEl(taskDataObj);
    }
};

var completeEditTask = function(taskName, taskType, taskId) {
    // find matching list items
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;
    
    // loop through the tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };
    
    // save tasks to localStorage
    saveTasks();
    
    alert("Task Updated!");
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

var createTaskEl = function(taskDataObj){
    //create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    
    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    
    // make generated list items draggable
    listItemEl.setAttribute("draggable", "true");
    
    //create div to hold task info and add to the list item
    var taskInfoEl = document.createElement("div");
    //give it a class name
    taskInfoEl.className = "task-info";
    //add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    
    listItemEl.appendChild(taskInfoEl);
    
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    
    //add entire list item to list
    tasksToDoEl.appendChild(listItemEl);
    
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);
    
    // save tasks to localStorage
    saveTasks();
    
    //increase task counter for next unique id
    taskIdCounter++;
};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";
    
    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    
    actionContainerEl.appendChild(editButtonEl);
    
    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    
    actionContainerEl.appendChild(deleteButtonEl);
    
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    var statusChoices = ["To Do", "In Progress", "Completed"];
    
    for (var i=0; i<statusChoices.length; i++) {
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        
        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    }
    
    actionContainerEl.appendChild(statusSelectEl);
    
    
    
    return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);

// function for edit button clicks
var editTask = function(taskId){
    console.log("editing task #" + taskId);
    
    //get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")
    
    //get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);
};

// function for delete button clicks
var deleteTask = function(taskId){
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")
    taskSelected.remove();
    
    //create a new array to hold updated list of tasks
    var updatedTaskArr = [];
    
    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    
    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;
    // save tasks to localStorage
    saveTasks();
};

var taskStatusChangeHandler = function(event) {
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");
    
    //get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();
    
    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");  
    
    if (statusValue === "to do"){
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }
    
    // update tasks in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    // save tasks to localStorage
    saveTasks();
};

// handle button click events for the different types of buttons
var taskButtonHandler = function(event) {
    //get target element from event
    var targetEl = event.target
    
    // edit button was clicked
    if (event.target.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
        
    }
    // delete button was clicked
    else if (event.target.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var dragTaskHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);
    var getId = event.dataTransfer.getData("text/plain");
    console.log("getId:", getId, typeof getId);
};

var dropZoneDragHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        event.preventDefault();
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
};

var dropTaskHandler = function(event) {
    var id = event.dataTransfer.getData("text/plain");
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;
    // set status of task based on dropZone id
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    if (statusType === "tasks-to-do") {
        statusSelectEl.selectedIndex = 0;
    }
    else if (statusType === "tasks-in-progress") {
        statusSelectEl.selectedIndex = 1;
    }
    else if (statusType === "tasks-completed") {
        statusSelectEl.selectedIndex = 2;
    }
    
    dropZoneEl.appendChild(draggableElement);
    dropZoneEl.removeAttribute("style");
    
    // loop through tasks array to find and update the updated task's status
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }
    // save tasks to localStorage
    saveTasks();
    
};

var dragLeaveHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        taskListEl.removeAttribute("style");
    }
};

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Gets task items from localStorage.

// Converts tasks from the string format back into an array of objects.

// Iterates through a tasks array and creates task elements on the page from it.
var loadTasks = function() {
    
    tasks = localStorage.getItem('tasks');
    console.log(tasks);
    
    tasks = JSON.parse(tasks);
    console.log(tasks);
    
    if (!tasks) {
        tasks = [];
        return false;
    };
    
    for (i = 0; i < tasks.length; i++) {
        tasks[i].id = taskIdCounter;
        console.log(tasks[i]);
        
        var listItemEl = document.createElement('li');
        listItemEl.className = "task-item";
        listItemEl.setAttribute("data-task-id", tasks[i].id);
        listItemEl.setAttribute("draggable", true);
        
        var taskInfoEl = document.createElement('div');
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
        listItemEl.appendChild(taskInfoEl);
        
        var taskActionsEl = createTaskActions(tasks[i].id);
        listItemEl.appendChild(taskActionsEl);
        console.log(listItemEl);
        
        if (tasks[i].status === "to do") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.appendChild(listItemEl);
        }
        
        else if (tasks[i].status === "in progress") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.appendChild(listItemEl);
        }
        else if (tasks[i].status === "completed") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedEl.appendChild(listItemEl);
        }
        
        taskIdCounter++;
        console.log(listItemEl);
    }
    
};

pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);