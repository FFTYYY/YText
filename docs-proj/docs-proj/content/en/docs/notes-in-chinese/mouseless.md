---
title: "Mouseless"
description: ""
lead: ""
date: 2023-02-05T23:35:04-05:00
lastmod: 2023-02-05T23:35:04-05:00
draft: false
images: []
menu:
  docs:
    parent: "notes-in-chinese"
    identifier: "mouseless-5167214fe86c4cc5de747502eda31378"
weight: 110
toc: true
---

__以下是我开发的时候写的一些笔记。没有写的很严谨，不完全符合现在的版本，仅供参考。__


# 无鼠标操作

YText编辑器提供了一系列功能来完成无鼠标操作，这些功能也可以被整合到用户自定义的编辑器中。

无鼠标操作功能分为三个核心部件：键盘事件管理器（KeyEventManager）和无鼠标元素（KeyEventElement）。

## 使用方法

所有无鼠标项目分成了一系列小组，每个称为一系列无鼠标项目空间，用一个唯一的字符串标志。在初始时，每个项目会在监听器处注册自己所处的空间和在这个空间中的位置，其中位置也是一个字符串。
每个空间对应一个 ctrl + [X] 的按键组合，其中[X]是某个按键。在容器听到一个空间的按键组合按下后，会**聚焦**该空间中的一个合适的位置的元素，项目会向容器提供一个**响应**操作，如果在聚焦状态下按下enter键，则会调用该响应函数。如果松开ctrl + [X]键，则会调用元素的**取消聚焦**操作，但是会记录此时元素的位置，方便下次聚焦时快速启动。

如果在按下ctrl + [X]的按键组合的情况下按下方向键，则会切换空间中的位置（具体如何切换是用户定义的），此时会调用原先聚焦的元素的**取消聚焦**操作，并调用新聚焦元素的聚焦操作。

## 具体实现

首先，键盘事件管理器代理slate的onKeyDown和onKeyUp函数，并使用React Context提供这两个方法。
```
type OnKeyDownFunction = (event)=>boolean
type OnKeyUpFunction = (event)=>boolean

var KeyDownUpFunctionProxy = React.createContext<[OnKeyDownFunction | undefined,OnKeyUpFunction | undefined]>([undefined , undefined])
```

### 键盘事件管理器的用户输入

键盘事件管理器需要用户提供一系列成组的方法，每组方法包含:
```javascript
interface EventManagerSpaceItem{
    // 空间名称（匹配用字符串）。
    spacename: string 

    // 匹配用按键。
    key: string

    // 第一次聚焦时的位置。 
    activate_position: (position_list: string[], cur_position: string) => number

    // 按下方向键时的聚焦切换。
    switch_position: (position_list: string[], cur_position: string, direction) => number
}
```

键盘输入管理器还可以代理非无鼠标操作的操作（例如ctrl+s保存）。
```javascript
interface EventManagerNonSpaceItem{
    
    // 匹配用按键。
    key: string

    // 按下时操作。 
    on_activate: (event)=>boolean
}
```

### 键盘事件管理器和无鼠标元素的通信。

键盘事件管理器必须在最上层，并通过Context向无鼠标元素传递注册自身的方法，无鼠标元素需要在键盘事件管理器中注册自身的位置以及三个函数：聚焦、响应、取消聚焦。

```javascript
// 无鼠标元素激活操作。 
type MouselessActivateOperation = ()=>void

// 无鼠标元素取消激活操作。 
type MouselessUnActivateOperation = ()=>void

// 无鼠标元素响应操作。 
type MouselessRun = ()=>void

// 无鼠标元素注册函数。 
type MouselessRegisterFunction = ( space: string, position: string, on_activate: MouselessActivateOperation, on_unactivate: MouselessUnActivateOperation, run: MouselessRun ) => void

// 提供无鼠标元素注册函数的上下文。 
let MouselessRegister = React.createContext<MouselessRegisterFunction>(()=>{})
```


