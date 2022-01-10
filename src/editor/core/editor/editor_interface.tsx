/** 这个文件定义面向用户的YEditor组件。
 * @module 
 */

import React from "react";
import { createEditor , Node , BaseEditor , Path} from "slate"
import { Slate, Editable, withReact, ReactEditor} from "slate-react"
import { Editor, Transforms , Point , Text } from "slate"

import Card from "@mui/material/Card"

import { text_prototype , paragraph_prototype , inline_prototype , group_prototype , struct_prototype, support_prototype , } from "../elements"
import type { StyledNode , InlineNode , GroupNode , StructNode , SupportNode , AbstractNode , } from "../elements"
import type { StyleType , NodeType } from "../elements"
import { get_node_type , is_styled } from "../elements"
import { EditorCore } from "./editor_core"
import { is_same_node } from "../../utils"


export type { Renderer_Func , Renderer_Props }
export { YEditor }

interface YEditorComponent_Props{
    editor: YEditor                 // 目标YEditor对象
    onUpdate?: (newval:any)=>any    // 当节点改变时的回调函数
}

interface YEditorComponent_RenderElement_Props{
    attributes: any
    children: Node[]

    element?: Node
    leaf?: Node
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
    update_value(value: Node[]){
        this.core.root = {...this.core.root , ...{children:value}}
        this.onUpdate(value)
    }

    /** 渲染函数
     * @param props.element 当前要渲染的节点。
     * @param props.attributes 当前元素的属性，这是slate要求的。
     * @param props.children 下层节点，这是slate要求的。
     * @private
     */
    renderElement(props: YEditorComponent_RenderElement_Props){
        let element = props.element || props.leaf

        let type = get_node_type(element)
        let name = undefined // 如果name是undefined，则get_renderer会返回默认样式。
        if(is_styled(element)){
            name = element.name
        }
        
        let R = this.editor.get_renderer(type , name)
        return <R {...props}></R>
    }

    render(){
        let me = this
        return <Slate editor={me.slate} value={me.core.root.children} onChange={value => me.update_value(value)}>
            <Editable
                renderElement={me.renderElement.bind(me)}
                renderLeaf   ={me.renderElement.bind(me)}
                />
        </Slate>
    }
    
}

interface YEditorToolbox_Props{
    editor: YEditor
}

interface Renderer_Props<NT = Node>{
    attributes: any
    children: any[]
    element?: NT
    leaf?: NT
}


// TODO：一个可能解决hidden中参数无法编辑的问题的方案是，让renderer接收editor作为参数，不过这样会导致页面刷新，需要考虑
type Renderer_Func<NT = Node> = (props: Renderer_Props<NT>, editor?:YEditor)=>any

function default_renderer(props: Renderer_Props):any{
    return <Card {...props.attributes}>{props.children}</Card>
}

class YEditor{
    core: EditorCore
    default_renderers: {[nd: string]: Renderer_Func}
    style_renderers  : {[nd: string]: {[sty: string]: Renderer_Func}}
    slate: ReactEditor
    static Component = _YEditorComponent

    constructor(core: EditorCore){
        this.core = core

        this.default_renderers = {
            text      : (props: Renderer_Props)=><span {...props.attributes}>{props.children}</span> , 
            paragraph : (props: Renderer_Props)=><div {...props.attributes}>{props.children}</div> , 
            group     : default_renderer , 
            struct    : default_renderer , 
            support   : default_renderer , 
        }
        this.style_renderers = {
            "inline"    : {} , 
            "group"     : {} , 
            "struct"    : {} , 
            "support"   : {} , 
        }

        this.slate  = withReact(createEditor() as ReactEditor)
    }

    /** 根据给定的节点类型，给默认的渲染器赋值。 */
    set_default_renderer(nodetype: NodeType, renderer: Renderer_Func): void{
        if(nodetype == "inline" || nodetype == "text")
            this.default_renderers.text = renderer
        if(nodetype == "paragraph")
            this.default_renderers.paragraph = renderer
        if(nodetype == "group")
            this.default_renderers.group = renderer
        if(nodetype == "struct")
            this.default_renderers.struct = renderer
        if(nodetype == "support")
            this.default_renderers.support = renderer
    }


    /** 根据给定的节点类型，给出默认的渲染器。 */
    get_default_renderer(nodetype: NodeType): Renderer_Func{
        if(nodetype == "inline" || nodetype == "text")
            return this.default_renderers.text
        if(nodetype == "paragraph")
            return this.default_renderers.paragraph
        if(nodetype == "group")
            return this.default_renderers.group
        if(nodetype == "struct")
            return this.default_renderers.struct
        if(nodetype == "support")
            return this.default_renderers.support
        
        return default_renderer
    }

    /** 根据给定的样式节点类型和样式名，给出对应样式的渲染器。 
     * @param nodetype 节点的类型。
     * @param stylename 样式名称。
    */
     get_style_renderer(nodetype: StyleType, stylename: string): Renderer_Func{
        let r: Renderer_Func | undefined = undefined
        if(nodetype == "inline")
            r = this.style_renderers.inline[stylename]
        if(nodetype == "group")
            r = this.style_renderers.group[stylename]
        if(nodetype == "struct")
            r = this.style_renderers.struct[stylename]
        if(nodetype == "support")
            r = this.style_renderers.support[stylename]
        if(r == undefined) // 没有找到样式
            r = this.get_default_renderer(nodetype)
        return r
    }

    /** 根据给定的样式节点类型和样式名，设置对应样式的渲染器。 
     * @param nodetype 节点的类型。
     * @param stylename 样式名称。
     * @param renderer 渲染器。
    */
    set_style_renderer(nodetype: StyleType, stylename: string, renderer: Renderer_Func): void{
        if(nodetype == "inline")
            this.style_renderers.inline[stylename] = renderer
        if(nodetype == "group")
            this.style_renderers.group[stylename] = renderer
        if(nodetype == "struct")
            this.style_renderers.struct[stylename] = renderer
        if(nodetype == "support")
            this.style_renderers.support[stylename] = renderer
    }

        
    /** 确定一个渲染器。
     * @param nodetype 
     * 节点类型。如果 stylename 为 undefined 则必须为 text 或 paragraph，否则必须为 inline、group、struct、support 之一。
     * @param stylename 样式名。如果为 undefined 就表示无样式（使用默认渲染器）。
     * @returns 如果 stylename 是 undefined 或者没有找到渲染器，就范围这个节点类型的默认渲染器，否则返回找到的渲染器。
     */
    get_renderer(nodetype: NodeType, stylename: string | undefined = undefined): Renderer_Func{
        if(stylename == undefined){
            return this.get_default_renderer(nodetype)
        }
        if(nodetype == "text" || nodetype == "paragraph")
            throw new Error(`当 nodetype = ${nodetype}，stylename 不能不为 undefined。`)
        
        return this.get_style_renderer(nodetype, stylename)
    }

    /** 更新渲染器。
     * @param nodetype 节点类型。
     * @param stylename 样式名。如果为 undefined 就表示更新默认渲染器。
     * @param renderer 要传入的渲染器。
     */
    update_renderer(renderer: Renderer_Func, nodetype: NodeType, stylename: string | undefined = undefined){
        if(stylename == undefined){
            this.set_default_renderer(nodetype, renderer)
        }
        if(nodetype == "text" || nodetype == "paragraph")
            throw new Error(`当 nodetype = ${nodetype}，stylename 不能不为 undefined。`)

        this.set_style_renderer(nodetype , stylename , renderer)
    }
    
    /** 这个函数帮助用户构建按钮。返回一个函数，这个函数表示要新建对应*样式*节点时的行为。
     * @param nodetype 节点类型，必须是有样式节点之一。
     * @param stylename 样式名。
     */
    get_onClick(nodetype: StyleType, stylename: string): (e:any)=>void{
        let me = this
        let root = me.core.root
        if(nodetype == "group")
        {        
            let style = me.core.groupstyles[stylename]
            if(style == undefined)
                return (e:any) => undefined

            return (e:any) => {
                let node = style.makenode()
                Transforms.insertNodes(me.slate , node)
            }
        }
        if(nodetype == "inline"){
            let style = me.core.inlinestyles[stylename]
            if(style == undefined)
                return (e:any) => undefined
            
            return (e:any)=>{
                Transforms.setNodes(
                    me.slate , 
                    style.makenode() , 
                    { 
                        match: (n:Node)=>Text.isText(n) , 
                        split: true , 
                    }
                )
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
