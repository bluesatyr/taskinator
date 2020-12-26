//progress: start of 4.2.6 "We can now create a new task item with the content..."
var formEl =  document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var createTaskHandler = function(){
    event.preventDefault();
    
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    console.log(taskNameInput);
    
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    console.log(taskTypeInput);
    
    //create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    
    //create div to hold task info and add to the list item
    var taskInfoEl = document.createElement("div");
    //give it a class name
    taskInfoEl.className = "task-info";
    //add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskNameInput + "</h3><span class='task-type'>" + taskTypeInput + "</span>";
    
    listItemEl.appendChild(taskInfoEl);
    //add entire list item to list
    tasksToDoEl.appendChild(listItemEl);
};

formEl.addEventListener("submit", createTaskHandler);


/*

Capture form field values. We'll use JavaScript to capture the unique information the user enters (the task name and type).

Organize functionality. We'll refactor the code to make it more maintainable.

Address usability concerns. We'll improve the user experience by validating form input and resetting the form after the user clicks the "Add Task" button.

Save our progress with Git. We'll commit and push our changes up to GitHub
*/