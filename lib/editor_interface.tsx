/** 这个文件定义面向用户的YEditor组件。
 * @module 
 */

import React from "react";
import { createEditor , Node , BaseEditor , Path} from "slate"
import { Slate, Editable, withReact, ReactEditor} from "slate-react"
import { Editor, Transforms , Point , Text } from "slate"

import Card from "@mui/material/Card"

import { text_prototype , paragraph_prototype , inline_prototype , group_prototype , struct_prototype, support_prototype , } from "./core/elements"
import type { StyledNode , InlineNode , GroupNode , StructNode , SupportNode , } from "./core/elements"
import type { StyleType , NodeType } from "./core/elements"
import { get_node_type , is_styled } from "./core/elements"
import { EditorCore } from "./core/editor_core"
import { is_same_node , update_kth , get_hidden_idx } from "./utils"
import { withAllYEditorPlugins } from "./plugins/apply_all"
import { Renderer } from "./core/renderer"
import { node2path } from ".";

export { YEditor }
export type { EditorRenderer_Props , EditorRenderer_Func}
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
    onUpdate: (v: any) => void

    /**
     * @param props.editor 与这个组件对应的YEditor。
     * @param props.onUpdate 当数据变化时的回调函数。这个函数不需要改变editor的值，因为这个改变会被自动完成。
     */
    constructor(props: YEditorComponent_Props){
        super(props)

        this.editor = props.editor
        this.core = this.editor.core
        this.slate = this.editor.slate

        this.onUpdate = props.onUpdate || ( (v: any) => {} ) // 这个函数用于通知外部自身的改变
    }

    /** 
     * 当 slate 改变 value 时通知自身的函数。
     */
    update_value(value: Node[]){
        this.core.update_children(value)
        this.onUpdate(value)
    }

    /** 渲染函数
     * @param props.element 当前要渲染的节点。
     * @param props.attributes 当前元素的属性，这是slate要求的。
     * @param props.children 下层节点，这是slate要求的。
     * @private
     */
     renderElement(props: YEditorComponent_RenderElement_Props){
        let me = this
        let element = props.element || props.leaf

        let type = get_node_type(element)
        let name = undefined // 如果name是undefined，则get_renderer会返回默认样式。
        if(is_styled(element)){
            name = element.name
        }
        
        let R = this.editor.get_renderer(type , name)
        return <R {...props} editor={me.editor}></R>
    }
    renderLeaf(props: YEditorComponent_RenderElement_Props){
        let me = this
        let R = this.editor.get_renderer("text")
        return <R {...props} editor={me.editor}></R>
    }
    render(){
        let me = this
        return <Slate 
            editor = {me.slate} 
            value = {[paragraph_prototype("")]} 
            onChange = {value => me.update_value(value)} 
        >
            <Editable
                renderElement={me.renderElement.bind(me)}
                renderLeaf   ={me.renderLeaf.bind(me)}
                onFocus = {e=>me.editor.apply_all()}
            />
        </Slate>
    }
    
}

interface YEditorToolbox_Props{
    editor: YEditor
}

/** Editor 的 renderer 可以接受的参数列表。继承自 renderer.Renderer_Props。 */
interface EditorRenderer_Props<NT extends Node = Node>{
    attributes: any
    children: any[]
    editor: YEditor
    element?: NT
    leaf?: NT
}

/** Editor 的 renderer 函数接口。继承自 renderer.Renerer_Func。 */
type EditorRenderer_Func<NT extends Node = Node> = (props: EditorRenderer_Props<NT>) => void

/** 一个合法的暂存操作函数。 */
type TemporaryOperation_Func = (slate: Editor) => void

class YEditor extends Renderer<EditorRenderer_Props>{
    subeditors: { [subnode_idx: number]: YEditor }
    slate: ReactEditor
    subinfo: {feditor: YEditor, father: StyledNode, son: GroupNode} | undefined
    static Component = _YEditorComponent
    
    constructor(core: EditorCore){
        super(core)

        this.slate  = withAllYEditorPlugins( withReact(createEditor() as ReactEditor) ) as ReactEditor
        this.subeditors = {}

        this.subinfo = undefined
    }

    is_sub(){
        return this.subinfo != undefined
    }

    /** 这个函数添加一个临时操作。 */
    add_subeditor(subeditor: YEditor){
        this.subeditors[subeditor.subinfo.son.idx] = subeditor
    }

    /** 这个函数应用所有临时操作。 */
    apply_all(){
        let me = this
        Object.values(this.subeditors).map((subeditor: YEditor)=>{
            subeditor.sub_apply(me)
        } )
        this.subeditors = {}
    }

    /** 这个函数只能被子编辑器调用，通过这个函数来将子编辑器的修改应用到父编辑器上。 */
    sub_apply(father_editor: YEditor){

        if(this.subinfo == undefined)
            throw new Error("this.subinfo == undefined") 

        let father = this.subinfo.father
        let son = this.subinfo.son
        let hidden_idx = get_hidden_idx(father , son)
        let new_son = {...son , ...{children: this.core.root.children}} // 更新之后的son。
        let new_hiddens = update_kth(father.hiddens , hidden_idx , new_son) // 更新之后的 father.hiddens。

        // 应用变换。
        Transforms.setNodes(
            father_editor.slate , 
            {...father , ...{hiddens: new_hiddens}} , 
            {at: node2path(father_editor.slate , father)}
        )
    }

    /** 通过调用这个函数来告知一个编辑器组件其是子编辑器。 
     * @param father 这个子编辑器挂载到父编辑器的哪个节点上。
     * @param son 这个子编辑器对应的 hidden 节点。
    */
    set_sub_info(feditor: YEditor , father: StyledNode, son: GroupNode){
        this.subinfo = {
            feditor: feditor , 
            father: father ,
            son: son , 
        }
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
                let node: InlineNode = style.makenode()
                Transforms.wrapNodes(
                    me.slate , 
                    node as InlineNode , 
                    { 
                        match: (n:Node)=>Text.isText(n) , // 所有子节点中是文本的那些。
                        split: true , 
                    }
                )
            }

        }
        if(nodetype == "support")
        {        
            let style = me.core.supportstyles[stylename]
            if(style == undefined)
                return (e:any) => undefined

            return (e:any) => {
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
