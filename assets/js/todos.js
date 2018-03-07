var todos;
$( document ).ready(function() {
	if(window.localStorage.getItem('todoId'))
    console.log(window.localStorage)
  else {
  	window.localStorage.setItem("todoId", 1)
  }
  if (window.localStorage.getItem("todos"))
  	todos = JSON.parse(window.localStorage.getItem("todos"));
  else
  	todos = []
  for (var i = 0; i<todos.length; i++)
  	$("ul").append("<li><span id="+ todos[i].id + "><i class='fa fa-trash' ></i></span> " + todos[i].text + "</li>")
});

// check off todos by clicking
$("ul").on("click", "li", function(){
	$(this).toggleClass("completed");
});

// click on x to delete todo

$("ul").on("click", "span", function(event){
	const indexOfTodo = todos.findIndex(function(todo) {
		return todo.id.toString() === event.target.id;
	})
	todos.splice(indexOfTodo, 1);
	window.localStorage.setItem("todos", JSON.stringify(todos));
	$(this).parent().fadeOut(500,function(){
		$(this).remove();
	});
	event.stopPropagation();
});

// adding new todo
$("input[type='text']").keypress(function(event){
	if(event.which === 13){
		//grabbing new todo text from input
		var todoText = $(this).val();
		var todoId = window.localStorage.getItem("todoId");
		$(this).val("");
		//create a new li and add to ul
		todos.push({
			id: todoId,
			text: todoText
		});
		$("ul").append("<li><span id="+ todoId + "><i class='fa fa-trash' ></i></span> " + todoText + "</li>")
		window.localStorage.setItem("todoId", parseInt(todoId) + 1)
		window.localStorage.setItem("todos", JSON.stringify(todos));
	}
});

$(".fa-plus").click(function(){
	$("input[type='text']").fadeToggle();
});

//export file to csv

var todoToCSVRow = function(todoItem) {
    var csvRow = todoItem.id + ',' + todoItem.text;
    return csvRow + '\r\n';
}

var exportToCSV = function() {

    if (!todos.length) {
        return;
    }

    var csvContent = "data:text/csv;charset=utf-8,";

    // headers
    csvContent += 'id,name\r\n';

    todos.forEach(function(item){
        csvContent += todoToCSVRow(item);
    }); 

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "todos.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link); 
}

$("#export").click(function(){
	exportToCSV();
});

// import csv file

function processData(event) {
	  var csv = event.target.result
	  csv = csv.trim()
    var todoItems = csv.split(/\r\n|\n/);
    for (var i=1; i<todoItems.length; i++) {
    	var todoItem = todoItems[i].split(",")
    	todos.push({
    		id: parseInt(todoItem[0]),
    		text: todoItem[1]
    	});
    	$("ul").append("<li><span id="+ todoItem[0] + "><i class='fa fa-trash' ></i></span> " + todoItem[1]+ "</li>")
    }
    window.localStorage.setItem("todos", JSON.stringify(todos));
}

var handleImport = function (files) {
  if (window.FileReader) {
      // FileReader are supported.
      getAsText(files[0]);
  } else {
      alert('FileReader are not supported in this browser.');
  }
}


function getAsText(fileToRead) {
  var reader = new FileReader();
  // Read file into memory as UTF-8      
  reader.readAsText(fileToRead);
  // Handle errors load
  reader.onload = processData;
  reader.onerror = errorHandler;
}

function errorHandler() {
	console.log("Error!");
}

$("#import").click(function() {
	$("#csvFileInput").click()
})