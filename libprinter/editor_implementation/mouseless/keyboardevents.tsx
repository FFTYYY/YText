/** 这个模块处理键盘事件。 
 * @module
*/

import React from "react"

interface DefaultEditorKeyEventHandlerProps{

}

interface DefaultEditorKeyEventHandlerState{
    /** 只在按下ctrl的状态下有效，记录哪些键和ctrl同时被按下了。 */
    ctrl_key: {[key: string]: boolean}
}

class DefaultEditorKeyEventHandler extends React.Component<DefaultEditorKeyEventHandlerProps, DefaultEditorKeyEventHandlerState>{
    constructor(props: DefaultEditorKeyEventHandlerProps){
        super(props)

        this.state = {
            ctrl_key: {}
        }
    }

    is_selecting(){
        return this.state.ctrl_key["q"]
    }

    flush_key_state(keydown: boolean , e: React.KeyboardEvent<HTMLDivElement>){
        let me = this
        if(e.ctrlKey){ 
            if(keydown){ // 如果按下了ctrl，记录新按下了哪个键
                if(!me.state.ctrl_key[e.key]){
                    me.setState({ctrl_key: {...me.state.ctrl_key , [e.key]: true}})
                }
            }
            else{ // 如果按下了ctrl，记录新抬起了哪个键
                if(me.state.ctrl_key[e.key]){
                    me.setState({ctrl_key: {...me.state.ctrl_key , [e.key]: undefined}})
                }
            }
        }
        else{ // 如果没有按下ctrl，就清空状态。
            if(Object.keys( me.state.ctrl_key ).length > 0){
                me.setState({
                    ctrl_key: {} , 
                })
            }
        }
    }
    // prevent_key_down(e: React.KeyboardEvent<HTMLDivElement>){
    //     let me = this

    //     if(me.state.ctrl_key["Control"] && e.key == "s"){ // ctrl + s
    //         me.onSave() // 调用保存回调函数。
    //         e.preventDefault()
    //         return true
    //     }
    //     if(me.is_selecting()){
    //         if(me.buttonbar_ref && me.buttonbar_ref.current){
    //             let buttonbar = me.buttonbar_ref.current
    //             if(e.key == "ArrowLeft" || e.key == "ArrowRight" || e.key == "ArrowDown" || e.key == "ArrowUp" || e.key == "Enter"){
    //                 e.preventDefault()
    //                 return true
    //             }
    //         }
    //     }
    //     return false
    // }
    // handle_key_up(e){
    //     let me = this
    //     if(me.state.ctrl_key["Control"] && e.key == "s"){
    //         e.preventDefault()
    //         return true
    //     }
    //     if(me.is_selecting()){
    //         if(me.buttonbar_ref && me.buttonbar_ref.current){
    //             let buttonbar = me.buttonbar_ref.current
    //             if(e.key == "ArrowLeft"){
    //                 buttonbar.move({x: -1})
    //                 e.preventDefault()
    //                 return true
    //             }
    //             if(e.key == "ArrowRight"){
    //                 buttonbar.move({x: 1})
    //                 e.preventDefault()
    //                 return true
    //             }
    //             if(e.key == "ArrowDown"){
    //                 buttonbar.move({y: 1})
    //                 e.preventDefault()
    //                 return true
    //             }
    //             if(e.key == "ArrowUp"){
    //                 buttonbar.move({y: -1})
    //                 e.preventDefault()
    //                 return true
    //             }
    //             if(e.key == "Enter"){
    //                 buttonbar.force_click()
    //                 e.preventDefault()
    //                 return true
    //             }
    //         }
    //         return false
    //     }
    //     return false
    // }
}

class KeyHandlerContainer extends React.Component{
    constructor(props){
        super(props)
    }
}

/** 这个上下文用来在键盘事件处理器的容器和项目之间交换信息。具体来说，他对项目提供容器信息。 */
let KeyEventHandlerFather = React.createContext<React.Component<KeyHandlerContainer> | undefined>(undefined)

/** 这个类型描述被选中且被按下的操作。 */
type OnFocusEnterFunc = ()=>void 

/** 这个上下文用来让键盘事件处理器向其子节点提供是否被选中的信息。 */
let KeyEventHandlerRegesterOnEnter = React.createContext<(func: OnFocusEnterFunc)=>void | undefined>(undefined)

function KeyHandlerItem(props: {
    subidx: number 
}){
    let [focusing, set_focusing] = React.useState(false)
    let [onEnter , set_onenter]  = React.useState(()=>void)
    let 

    let father = React.useContext(KeyEventHandlerFather)
    React.useEffect(()=>{
        if(father != undefined){
            father.register_child(props.subidx , ()=>set_focusing(true), ()=>set_focusing(false))
            return ()=>{
                father.remove_child(props.subidx)
            }
        }
    })


}

