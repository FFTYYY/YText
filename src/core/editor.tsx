/* YEditor是一个React组件 */

import React, { useEffect, useMemo, useState , useCallback} from "react";
import { createEditor , Node , BaseEditor} from 'slate'
import { Slate, Editable, withReact, ReactEditor} from 'slate-react'
import { Editor, Transforms } from 'slate'
import { EditorContext } from "slate-react/dist/hooks/use-slate-static";
import GroupType from "./group"
import {paragraph_prototype} from "./meta"

interface YEditor_Component_Props{
    editor: YEditor
}

class _YEditor_Component_ extends React.Component{
    yeditor: YEditor
    slate: ReactEditor

    constructor(props: YEditor_Component_Props){
        super(props)
        this.state = {
            value: [paragraph_prototype()] , 
        }
        this.slate   = props.editor.slate
        this.yeditor = props.editor

        this.updateValue(this.state.value) //向父组件发送value初始值
    }

    renderElement(props: any){
        let element = props.element
        let nodetype = element.type
        if (nodetype == "paragraph"){
            return <p {...props.attributes}>{props.children}</p>
        }
        else if (nodetype == "group"){
            return this.yeditor.grouptypes[element.typename].renderer(props)
        }

        return <p {...props.attributes}>{props.children}</p>
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
    slate: ReactEditor
    static Component = _YEditor_Component_

    constructor(){
        this.grouptypes = {}
        this.slate = withReact(createEditor())
    }

    add_group_type(grouptype: GroupType){
        this.grouptypes[grouptype.name] = grouptype
    }
}