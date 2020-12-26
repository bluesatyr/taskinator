//progress: start of 4.2.1
var formEl =  document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var createTaskHandler = function(){
    event.preventDefault();
    console.log(event);
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.textContent = "This is a new task.";
    tasksToDoEl.appendChild(listItemEl);
};

formEl.addEventListener("submit", createTaskHandler);


/*

Handle form submission. We'll use JavaScript to add a task to the list when the "Add Task" button is clicked.

Capture form field values. We'll use JavaScript to capture the unique information the user enters (the task name and type).

Organize functionality. We'll refactor the code to make it more maintainable.

Address usability concerns. We'll improve the user experience by validating form input and resetting the form after the user clicks the "Add Task" button.

Save our progress with Git. We'll commit and push our changes up to GitHub
*/