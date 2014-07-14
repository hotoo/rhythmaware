# RhythmAware

---

[![spm version](http://spmjs.io/badge/rhythmaware)](http://spmjs.io/package/rhythmaware)
[![Build Status](https://travis-ci.org/hotoo/rhythmaware.svg?branch=master)](https://travis-ci.org/hotoo/rhythmaware)


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

### RhythmAware(String selector)

### RhythmAware(HTMLElement element)

构造函数。

### .on(String eventName, Function handler)

### .off(String eventName, Function handler)


## EVENTS

### input

输入过程中触发这个事件。

### pause

输入停顿时触发这个事件。
