/* 作为React组件的Editor */

import React from "react";
import { createEditor , Node , BaseEditor , Path} from 'slate'
import { Slate, Editable, withReact, ReactEditor} from 'slate-react'
import { Editor, Transforms , Point } from 'slate'
import { EditorCore } from "./editorcore"
import type { BaseNode , TextNode , ParagraphNode , GroupNode , StructNode , SupportNode } from "../elements"
import { TextPrototype , ParagraphPrototype , GroupPrototype , StructPrototype , SupportPrototype } from "../elements"
import type { NodeType } from "../elements"
// import type { Group_Child_Node , Struct_Child_Node } from "../elements"
import Card from '@mui/material/Card';

export type { Renderer_Func , Renderer_Props }
export { YEditor }

interface YEditorComponent_Props{
    editor: YEditor
}

interface SlateRenderer_Props{
    attributes: any
    element: BaseNode
    children: any[]
}
class _YEditorComponent extends React.Component<YEditorComponent_Props>{
    editor: YEditor
    core: EditorCore
    slate: ReactEditor

    constructor(props: YEditorComponent_Props){
        super(props)

        this.editor = this.props.editor
        this.core = this.editor.core
        this.slate = this.editor.slate

        
        this.state = {
            value: this.core.root.children
        }


    }


    updateValue(value: BaseNode[]){
        this.core.root.children = value
        this.setState({value: value})
    }

    renderElement(props){

        return <div {...props.attributes}>{props.children}</div>

        let element = props.element
        let type = element.type
        let name = undefined
        if (element.hasOwnProperty("name"))
            name = element.name
        let R = this.editor.get_renderer(type , name)
        return <R {...props} key={element.nodekey}></R>
    }

    render(){
        let me = this
        return <Slate editor={me.slate} value={me.state.value} onChange={value => me.updateValue(value)}>
            <Editable
                renderElement={me.renderElement.bind(me)}
            />
        </Slate>
    }
    
}

interface YEditorToolbox_Props{
    editor: YEditor
}

interface Renderer_Props{
    attributes: any
    children: any[]
    element: Node
}

type Renderer_Func = (props: Renderer_Props)=>any

function default_renderer(props: Renderer_Props):any{
    return <Card {...props.attributes}>{props.children}</Card>
}

class YEditor{
    core: EditorCore
    renderers: {[nd: string]: Renderer_Func | {[sty: string]: Renderer_Func}}
    slate: ReactEditor
    static Component = _YEditorComponent

    constructor(core: EditorCore){
        this.core = core

        this.renderers = {
            "text-default"      : default_renderer , 
            "paragraph-default" : (props: Renderer_Props)=><p {...props.attributes}>{props.children}</p> , 
            "group-default"     : default_renderer , 
            "struct-default"    : default_renderer , 
            "support-default"   : default_renderer , 

            "textstyles"      : {} , 
            "paragraphstyles" : {} , 
            "groupstyles"     : {} , 
            "structstyles"    : {} , 
            "supportstyles"   : {} , 
        }

        this.slate  = withReact(createEditor())
    }

    get_renderer(nodetype: NodeType, stylename: string | undefined = undefined){
        if(stylename == undefined){
            return this.renderers[`${nodetype}-default`]
        }
        let r = this.renderers[`${nodetype}styles`][stylename]
        if(r == undefined)
            return default_renderer
        return r
    }

    update_renderer(renderer: Renderer_Func, nodetype: NodeType, stylename: string | undefined = undefined){
        if(stylename == undefined){
            this.renderers[`${nodetype}-default`] = renderer
        }
        this.renderers[`${nodetype}styles`][stylename] = renderer
    }
    
    get_onclick(nodetype: NodeType, stylename: string): (e:any)=>undefined|void{
        let me = this
        let root = me.core.root
        if(nodetype == "group")
        {        
            let style = me.core.groupstyles[stylename]
            if(style == undefined)
                return (e:any) => undefined

            return function(e:any){
                let node = style.makenode()
                Transforms.insertNodes(me.slate , node)
            }
        }
        return (e:any) => undefined
    }
}

/* 以下是写了一半的把当前选区转换为group的代码
let selection = me.slate.selection

if (selection == undefined)
    return undefined

let point_bef = selection.anchor
let point_aft = selection.focus
if(Point.isAfter(point_bef , point_aft))
    [ point_bef , point_aft ] = [point_aft , point_bef]

let nodes: [Node,Path][] = Array.from( Node.elements(root , {from: point_bef.path, to: point_aft.path}) )
*/
