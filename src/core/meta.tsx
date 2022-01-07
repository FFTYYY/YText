// 给一个组件分配这个prop可以防止其被slate视为文本
const non_selectable_prop = {
    style: { userSelect: "none" },
    contentEditable: false , 
}

export { non_selectable_prop }