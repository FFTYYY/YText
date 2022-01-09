/** 这个文件提供一些通用的组件的默认渲染。
 * @module
 */

import React, {useState} from "react"

import Card         from "@mui/material/Card"
import TextField    from "@mui/material/TextField"

import { GroupStyle , EditorCore} from "../core/editor/editor_core"
import type { Renderer_Func , Renderer_Props } from "../core/editor/editor_interface"
import { YEditor } from "../core/editor/editor_interface"

export { DefaultParameterContainer }

interface DefaultParameterContainer_Props{
    initval: any
    onUpdate: (parameters: any) => void
}
interface DefaultParameterContainer_State{
    parameters: any
}


/** 这个类定义一个组件，作为默认的参数更新器。 */
class DefaultParameterContainer extends React.Component <
        DefaultParameterContainer_Props , DefaultParameterContainer_State
>{
    onUpdate: (parameters: any) => void
    
    /**
     * @param props.initval 所有参数的初始值。
     * @param props.onUpdate 当参数更新时的回调函数。
     */
    constructor(props: DefaultParameterContainer_Props){
        super(props)

        this.state = {
            parameters: this.props.initval
        }

        this.onUpdate = props.onUpdate
    }

    /** 如果参数的当前项是一个字符串，则渲染一个输入框。
     * TODO：当前的方案是使用onBlur，即失去焦点时才更新。理想情况下，应该在有任何输入时就更新，但是因为这里接收val作为参数，
     * TODO：当onChange调用时，会导致此组件重新渲染而失去焦点。需要考虑如何解决这个问题。
     * 
     * @param props.name 参数项的名称。
     * @param props.val 参数的当前值。
     * @param onChange 当值改变时的回调函数。
     */
    renderString(props: {name: string, val: string, onChange: (newval:string)=>void}){
        return <TextField 
            defaultValue = {props.val} 
            onBlur  = {e=>props.onChange(e.target.value)}
            label   = {props.name}
            variant = "standard"
            sx      = {{marginLeft: "5%"}}
        ></TextField>
    }

    /** 如果参数的当前项是一个对象，则渲染一个菜单，并递归地检查每一项，直到遇到字符串。
     * TODO：还应该处理其他基本类型，例如number和boolean，但是目前只考虑了字符串。
     * 
     * @param props.name 参数项的名称。
     * @param props.val 参数项的当前值。应该是一个字典。
     * @param props.onChange 当值改变时的回调函数。
     */
    renderDict(props: {name: string, val:object, onChange: (newval:object)=>void}){
        let newval = {}
        Object.assign(newval , props.val)

        let RS = this.renderString.bind(this)   // 渲染一个文本框。
        let RO = this.renderDict.bind(this)     // 递归地渲染一个菜单。

        return <Card key={props.name} sx={{marginLeft: "5%"}}>
            <p>{props.name}</p>
            {Object.keys(props.val).map(
                (subname)=>{
                    let subval = props.val[subname]

                    if(typeof subval === "string")
                    {
                        return <RS 
                            key     = {subname}
                            name    = {subname} 
                            val     = {subval} 
                            onChange = {(newsubval:string)=>{
                                newval[subname] = newsubval
                                props.onChange(newval)
                            }} 
                        />               
                    }

                    return <RO 
                        key     = {subname}
                        name    = {subname} 
                        val     = {subval} 
                        onChange = {(newsubval:object)=>{
                            newval[subname] = newsubval
                            props.onChange(newval)
                        }} 
                    />            
        }
        )}</Card>

    }
    
    /**
     * 渲染函数。
     * 注意，这个组件必须被包裹在一个 non_selectable_prop 的元素内部。
     * @returns 一个菜单，提供各个参数的编辑项。
     */
    render(){
        let R = this.renderDict.bind(this)
        let me = this

        return <R
            name="Parameters"
            val={me.state.parameters}
            onChange={(newval:any)=>{
                me.setState({parameters:newval})
                me.onUpdate(newval)
            }}
        ></R>
    }
}

