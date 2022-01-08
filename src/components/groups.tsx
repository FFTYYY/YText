import { GroupNode , GroupPrototype , ParagraphPrototype} from "../core/elements"
import { GroupStyle , EditorCore} from "../core/editor/editorcore"
import type { Renderer_Func , Renderer_Props } from "../core/editor/editor_interface"
import { YEditor } from "../core/editor/editor_interface"
import { Button } from "antd"
import { Transforms , Node } from "slate"
import { Node2Path } from "./utils"
import { Card } from "antd"
import React from "react"
import { Menu, Dropdown } from 'antd'
import { Row, Col } from 'antd';
export {theorem}
import {CaretDownOutlined,} from '@ant-design/icons'
import { DownOutlined } from '@ant-design/icons'
import {non_selectable_prop} from "../core/meta"
import { Input } from 'antd'
import { MenuItem } from "rc-menu"

interface DefaultParameterContainer_Props{
    initval: any
    onUpdate: (parameters: any) => void
}
class DefaultParameterContainer extends React.Component<DefaultParameterContainer_Props>{
    onUpdate: (parameters: any) => void

    constructor(props: DefaultParameterContainer_Props){
        super(props)

        this.state = {
            parameters: this.props.initval
        }

        this.onUpdate = props.onUpdate
    }

    renderString(props: {name: string, val: string, onChange: (newval:string)=>void}){
        return <Input 
            placeholder={props.name} 
            defaultValue={props.val} 
            onChange={e=>props.onChange(e.target.value)}
            addonBefore={props.name}
            onKeyDown={e=>{e.stopPropagation()}}
        ></Input>
    }

    renderDict(props: {name: string, val:object, onChange: (newval:object)=>void}){
        let newval = {}
        Object.assign(newval , props.val)

        let RS = this.renderString.bind(this)
        let RO = this.renderDict.bind(this)

        return <div
            key={props.name}
            title={props.name}
            mode="inline"
        >{Object.keys(props.val).map(
                (subname)=>{
                    let subval = props.val[subname]

                    if(typeof subval === "string")
                    {
                        return <div key={subname}><RS 
                            name={subname} 
                            val={subval} 
                            onChange={newsubval=>{
                                newval[subname] = newsubval
                                props.onChange(newval)
                            }} 
                        /></div>                    
                    }

                    return <div key={subname} title={subname} mode="inline"><RO 
                        name={subname} 
                        val={subval} 
                        onChange={newsubval=>{
                            newval[subname] = newsubval
                            props.onChange(newval)
                        }} 
                    /></div>                    
        }
        )}</div>

    }

    render(){
        let R = this.renderDict.bind(this)
        let me = this

        return <R
            name="Parameters"
            val={me.state.parameters}
            onChange={newval=>{
                me.setState({parameters:newval})
                me.onUpdate(newval)
            }}
        ></R>
    }
}

function theorem(editor: YEditor, name:string = "theorem"): [GroupStyle,Renderer_Func]{
    let style = new GroupStyle(name , {
        "words": "Theorem" , 
        "test1": "haha" , 
        "test2": {
            "oo": "as" , 
            "ss": "ass" , 
        }
    })


    let renderer = (props: Renderer_Props) => <div {...props.attributes}><Card><Row>
        <Col span={4}><span {...non_selectable_prop}>{props.element.parameters.words}</span>{props.children}</Col>
        <Col span={20} {...non_selectable_prop}>    
            <DefaultParameterContainer 
                initval={props.element.parameters} 
                onUpdate={
                    val=>Transforms.setNodes(
                        editor.slate , 
                        { parameters:val },
                        { match: n=>n===props.element }
                    ) 
                }
            ></DefaultParameterContainer>     
        </Col>
    </Row></Card></div>
    

    return [style , renderer]
}