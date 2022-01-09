/** 这个文件定义YEditor组件
 * @module 
 */

import React from "react";
import { createEditor , Node , BaseEditor , Path} from 'slate'
import { Slate, Editable, withReact, ReactEditor} from 'slate-react'
import { Editor, Transforms , Point } from 'slate'
import { EditorCore } from "./editorcore"
import type { BaseNode , TextNode , ParagraphNode , GroupNode , StructNode , SupportNode } from "../elements"
import { TextPrototype , ParagraphPrototype , GroupPrototype , StructPrototype , SupportPrototype } from "../elements"
import type { NodeType } from "../elements"
import Card from '@mui/material/Card';

export type { Renderer_Func , Renderer_Props }
export { YEditor }

interface YEditorComponent_Props{
    editor: YEditor // 目标YEditor对象
    onUpdate?: (newval:any)=>any // 当节点改变时的回调函数
}

interface YEditorComponent_RenderElement_Props{
    element: Node
    attributes: any
    children: Node[]
}

/** 
 * 这个类定义了渲染YEditor的组件
 * 一个YEditor类负责储存数据，而_YEditorComponent类负责渲染组件。
 */
class _YEditorComponent extends React.Component<YEditorComponent_Props>{
    editor: YEditor
    core: EditorCore
    slate: ReactEditor
    onUpdate: (v: any) => any

    /**
     * @param props.editor 与这个组件对应的YEditor。
     * @param props.onUpdate 当数据变化时的回调函数。这个函数不需要改变editor的值，因为这个改变会被自动完成。
     * @private
     */
    constructor(props: YEditorComponent_Props){
        super(props)

        this.editor = props.editor
        this.core = this.editor.core
        this.slate = this.editor.slate

        
        this.onUpdate = (v)=>null
        if(props.hasOwnProperty("onUpdate"))
            this.onUpdate = props.onUpdate
    }

    /** 当文档的值改变时调用这个函数。
     * @param value 改变的值。注意这个值是YEditorCore.root的children。
     * @private
     */
    updateValue(value: BaseNode[]){
        this.core.root = {...this.core.root , ...{children:value}}
        this.onUpdate(value)
    }

    /** 渲染函数
     * @param props.element 当前要渲染的节点
     * @param props.attributes 这是slate要求的
     * @param props.children 下层节点，这是slate要求的
     * @private
     */
    renderElement(props: YEditorComponent_RenderElement_Props){
        let element = props.element
        let type = element.type
        let name = undefined
        if ("name" in element){
            name = element.name
        }
        
        let R = this.editor.get_renderer(type , name)
        return <R {...props}></R>
    }

    render(){
        let me = this
        return <Slate editor={me.slate} value={me.core.root.children} onChange={value => me.updateValue(value)}>
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


// TODO：一个可能解决hidden中参数无法编辑的问题的方案是，让renderer接收editor作为参数，不过这样会导致页面刷新，需要考虑
type Renderer_Func = (props: Renderer_Props, editor?:YEditor)=>any

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
