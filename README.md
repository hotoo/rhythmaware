# RhythmAware

---

输入节奏感知器。

根据用户当前的输入速度快速调整，感知用户当前的输入停顿。

---

## 使用说明

```js
var RhythmAware = require("rhythmaware");
var AutoComplete = require("autocomplete");

// AutoComplete 为假象模块。
var autocomplete = new AutoComplete("input");

var rhy = new RhythmAware("input").on("pause", function(){
  var datas = get_data(this.value);
  autocomplete.render(datas);
});
```

## API

### RhythmAware(String select)
### RhythmAware(HTMLElement input)

构造函数。

### .on(String eventName, Function handler)

支持事件包括：

* `input`: 输入过程中触发这个事件。
* `pause`: 输入停顿时触发这个事件。
