# 演示文档

---

````html
<input type="text" />
<div id="status"></div>
````

````javascript
seajs.use(['jquery', 'rhythmaware'], function($, rhythmaware){
  var status = $("#status")

  new rhythmaware("input").on("input", function(){
    status.text("inputting...");
  }).on("pause", function(){
    status.text("paused.");
  });

  status.text("inited")
});
````
