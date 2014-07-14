# 演示文档

---

````html
<input type="text" />
<div id="status">inited</div>
````

````javascript
seajs.use(['$', 'rhythmaware'], function($, rhythmaware){
  new rhythmaware("input").on("input", function(){
    $("#status").text("inputting...");
  }).on("pause", function(){
    $("#status").text("paused.");
  });
});
````
