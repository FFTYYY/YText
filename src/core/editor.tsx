/* 
    这个文件定义了一个React组件，封装了Slate编辑器。
    exports:
        YEditor: 一个类，用于管理这个编辑器的自定义元素列表。
        YEditor.Component: 一个组件，表示一个编辑器。
    
    注：
        Editor对有哪些node一无所知，node需要自己维护在editor中的渲染方式。
*/

import React from "react";
import { createEditor , Node , BaseEditor} from 'slate'
import { Slate, Editable, withReact, ReactEditor} from 'slate-react'
import { Editor, Transforms } from 'slate'
import { EditorContext } from "slate-react/dist/hooks/use-slate-static";
import GroupType from "./elements/group"
import AbstractType from "./elements/abstract"
import {paragraph_prototype} from "./meta"

interface YEditorComponentProps{
    onValueChange: (val: any[]) => any
    editor: YEditor
}

interface SlateRendererProps{
    attributes: any
    element: Node
    children: any[]
}

class _YEditor_Component_ extends React.Component{
    yeditor: YEditor
    slate: ReactEditor

    constructor(props: YEditorComponentProps){
        super(props)
        this.state = {
            value: [paragraph_prototype()] , 
        }
        this.slate   = props.editor.slate
        this.yeditor = props.editor

        this.updateValue(this.state.value) //向父组件发送value初始值
    }

    renderElement(props: SlateRendererProps){
        let element = props.element
        let nodetype = element.type
        if (nodetype == "paragraph"){
            return <p {...props.attributes}>{props.children}</p>
        }
        else if (nodetype == "group"){
            let R = this.yeditor.grouptypes[element.groupname].renderer
            return <R {...props.attributes}>{props.children}</R>
        }
        else if (nodetype == "abstract"){
            let R = this.yeditor.abstractypes[element.abstractname].renderer

            return<R {...props.attributes}>{props.children}</R>
        }
        else if(nodetype == "abstract-middle"){
            return <div {...props.attributes}>{props.children}</div>
        }

        return <div {...props.attributes}>{props.children}</div>
    }

    updateValue(value:any){
        this.setState({value:value})
        if(this.props.onValueChange != undefined){ //将value的值传回给父组件
            this.props.onValueChange(value)
        }
    }

    render(){
        return <div>
            <Slate editor={this.slate} value={this.state.value} onChange={value => this.updateValue(value)}>
                <Editable
                    renderElement={this.renderElement.bind(this)}
                />
            </Slate>
        </div>
    }

}

export default class YEditor{
    grouptypes: any
    abstractypes: any
    slate: ReactEditor
    static Component = _YEditor_Component_

    constructor(){
        this.grouptypes = {}
        this.abstractypes = {}
        this.slate = withReact(createEditor())
    }

    add_grouptype(grouptype: GroupType){
        this.grouptypes[grouptype.name] = grouptype
    }
    add_abstracttype(abstractype: AbstractType){
        this.abstractypes[abstractype.name] = abstractype
    }
}