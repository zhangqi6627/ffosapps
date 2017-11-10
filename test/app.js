window.addEventListener("load", function() {
  console.log("Hello World!");
});

window.onload = function(){
  console.log("hello world!!!!!");
  var image = document.getElementById("image1");
  image.addEventListener("click", function(){
    alert("image1");
  }, true);
}
