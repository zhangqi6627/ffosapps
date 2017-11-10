var todoItems = document.querySelector('#todo-items');
var addNewButton = document.querySelector('#add-new button');
var addNewInput = document.querySelector('#add-new input');

todoItems.addEventListener('click', function(e) {
	e.target.classList.toggle('done');
});

addNewButton.addEventListener('click', function() {
	var li = document.createElement('li');
	li.textContent = addNewInput.value;
	todoItems.appendChild(li);

	addNewInput.value = '';

	var notification = new Notification(
		'New task created', { body: li.textContent });
});

window.onuserproximity = function (e) {
  if (e.near) {
  	navigator.vibrate(200);
  }
};
