/** 
 * 这个模块提供所有按钮的超类。
 * @module
 */

import React from "react"
import * as Slate from "slate"

import {
    ConceptNode , 
} from "../../core"

import {
    MouselessElement , 
} from "../mouseless"
import {
    SPACE , 
    get_position , 
} from "./mouseless"

export type {
    EditorButtonInformation , 
    ButtonBase ,     
    ButtonDescription , 
    ButtonGroupProps , 
}

export {
    ButtonGroup , 
}

/** 所有按钮组件的通用信息。 */
interface EditorButtonInformation<NodeType extends ConceptNode = ConceptNode>{
    node: Slate.Node & NodeType
}


/** 所有按钮的父类。 */
interface ButtonBase{
    run: (e?: React.KeyboardEvent<HTMLDivElement>)=>void
}

interface MouselessButtonProps<OtherPropsType = {}>{
    idx: number
    node: Slate.Node & ConceptNode
    other_props?: OtherPropsType
    component: any
}

/** 将一个按钮包装成一个无鼠标元素。 */
class MouselessButton<OtherPropsType = {}> extends React.Component<MouselessButtonProps<OtherPropsType>>{

    childref: React.RefObject<any>

    constructor(props: MouselessButtonProps<OtherPropsType>){
        super(props)

        this.childref = React.createRef<any>()
    }

    run(e: React.KeyboardEvent<HTMLDivElement>){
        if(this.childref && this.childref.current){
            return this.childref.current.run(e)
        }
    }

    render(){
        let C = this.props.component
        let other_props = this.props.other_props || {} as OtherPropsType
        
        return <MouselessElement
            space = {SPACE}
            run = {this.run.bind(this)}
            position = {get_position(this.props.node,this.props.idx)}
        >
            <C node={this.props.node} {...other_props} ref={this.childref}/>
        </MouselessElement>    
    }
}


type ButtonDescription<OtherPropsType = {}> = {
    other_props?: OtherPropsType
    component: any
} | any
interface ButtonGroupProps{
    buttons: ButtonDescription[]
    node: Slate.Node & ConceptNode
}
class ButtonGroup extends React.Component<ButtonGroupProps>{
    constructor(props: ButtonGroupProps){
        super(props)
    }
    render(){
        let buttons = this.props.buttons
        let node = this.props.node

        return Object.keys(buttons).map((subidx)=>{
            let res_other_props = {} 
            let res_component = buttons[subidx]
            if(buttons[subidx]["component"]){ // 如果是object描述
                let {other_props,component} = buttons[subidx]
                res_other_props = other_props
                res_component   = component
            }
            return <MouselessButton 
                key         = {subidx}
                node        = {node}
                idx         = {parseInt(subidx)}
                other_props = {res_other_props}
                component   = {res_component}
            />
        })
    }
}