/** 这个模块定义editor的组件。
 * @module
 */
import React from "react"
import Slate from "slate"
import SlateReact from "slate-react"
import { withHistory } from "slate-history"
import produce from "immer"

import {
    Node , 
    GroupNode , 
    InlineNode , 
    StructNode ,
    AbstractNode , 
    SupportNode , 
    ParagraphNode , 
    TextNode , 
    Printer, 
    ParameterList,
    ConceptNode, 
} from "../core"

import {
    EditorRenderer , 
    EditorRendererProps , 
} from "./editor_renderer"

import {
    EditorPlugin , 
    with_ytext_plugin , 
} from "./plugins"

import {
    tree_op_mixin
} from "./treeopmixin"

export {
    EditorComponent , 
    EditorCore , 
}

/** 用来保存概念的编辑器渲染。 */
interface RendererDict{
    "group"     : {[name: string] : EditorRenderer<GroupNode>} , 
    "inline"    : {[name: string] : EditorRenderer<InlineNode>} , 
    "structure" : {[name: string] : EditorRenderer<StructNode>} , 
    "support"   : {[name: string] : EditorRenderer<SupportNode>} , 
    "abstract"  : {[name: string] : EditorRenderer<AbstractNode>} , 
}

/** 编辑器的默认渲染。 */
interface DefaultRendererhDict{
    "group"     : EditorRenderer<GroupNode> , 
    "inline"    : EditorRenderer<InlineNode> , 
    "structure" : EditorRenderer<StructNode> , 
    "support"   : EditorRenderer<SupportNode> , 
    "abstract"  : EditorRenderer<AbstractNode> , 
    "paragraph" : EditorRenderer<ParagraphNode> , 
    "text"      : EditorRenderer<TextNode> , 
}


/** 编辑器核心。
 * 要创建一个编辑器，需要对每个一级概念指定一个渲染器。
 */
class EditorCore{
    renderers: RendererDict 
    default_renderers: DefaultRendererhDict 
    printer: Printer

    constructor(params: {
        renderers: RendererDict , 
        default_renderers: DefaultRendererhDict, 
        printer: Printer , 
    }){
        this.renderers = params.renderers 
        this.default_renderers = params.default_renderers 
        this.printer = params.printer 
    }

    /** 新建一个文本节点。 */
    create_text(text: string = ""): TextNode{
        return {
            text: text
        }
    }

    /** 新建一个段落节点。 */
    create_paragraph(text: string = ""): ParagraphNode{
        let me = this
        return {
            children: [this.create_text(text)]
        }
    }

    /** 新建一个组节点。 */
    create_group(name: string, relation: "separating" | "chaining" = "separating"): GroupNode{
        let me = this
        let sec_concept = this.printer.get_second_concept("group" , name)
        let parameters = sec_concept == undefined ? {} : {...sec_concept.defaultOverride}

        return {
            type: "group" , 
            idx: Math.floor( Math.random() * 233333) , 
            concept: sec_concept.name , 
            parameters: parameters , 
            relation: relation , 
            children: [me.create_paragraph("")] , 
            abstract: [] , 
        }
    }

    /** 新建一个行内节点。 */
    create_inline(name: string, text: ""): InlineNode{
        let me = this
        let sec_concept = this.printer.get_second_concept("inline" , name)
        let parameters = sec_concept == undefined ? {} : {...sec_concept.defaultOverride}

        return {
            type: "inline" , 
            idx: Math.floor( Math.random() * 233333) , 
            concept: sec_concept.name , 
            parameters: parameters , 
            children: [me.create_text(text)] , 
            abstract: [] , 
        }
    }

    /** 新建一个支撑节点。 */
    create_support(name: string): SupportNode{
        let me = this
        let sec_concept = this.printer.get_second_concept("support" , name)
        let parameters = sec_concept == undefined ? {} : {...sec_concept.defaultOverride}

        return {
            type: "support" , 
            idx: Math.floor( Math.random() * 233333) , 
            concept: sec_concept.name , 
            parameters: parameters , 
            children: [] , 
            abstract: [] , 
        }
    }

    /** 新建一个结构节点。 */
    create_structure(name: string, relation: "separating" | "chaining" = "separating"): StructNode{
        let me = this
        let sec_concept = this.printer.get_second_concept("structure" , name)
        let parameters = sec_concept == undefined ? {} : {...sec_concept.defaultOverride}

        return {
            type: "structure" , 
            idx: Math.floor( Math.random() * 233333) , 
            concept: sec_concept.name , 
            parameters: parameters , 
            children: [] , 
            abstract: [] , 
            relation: relation , 
        }
    }

    /** 新建一个抽象节点。 */
    create_abstract(name: string): AbstractNode{
        let me = this
        let sec_concept = this.printer.get_second_concept("abstract" , name)
        let parameters = sec_concept == undefined ? {} : {...sec_concept.defaultOverride}

        return {
            type: "abstract" , 
            idx: Math.floor( Math.random() * 233333) , 
            concept: sec_concept.name , 
            parameters: parameters , 
            children: [me.create_paragraph("")] , 
            abstract: [] , 
        }
    }
}

interface EditorComponentProps{
    editorcore: EditorCore 
    plugin: EditorPlugin

    /** 节点树更新时的回调。 */
    onUpdate: (v: any) => void

    /** 按键按下的回调。 */
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void

    /** 按键弹起的回调。 */
    onKeyUp: (e: React.KeyboardEvent<HTMLDivElement>) => void

    /** 按键按下弹起的回调。 */
    onKeyPress: (e: React.KeyboardEvent<HTMLDivElement>) => void

    /** 改变光标位置的回调。 */
    onFocusChange: ()=>void
    
}

type RemoveEditor<F> = F extends (editor: any, ...args: infer P) => infer R ? (...args: P) => R : never;
type TreeOpeationsMixinsOriginal = typeof tree_op_mixin
type TreeOpeationsMixins = {
    set_node           : <NT extends Slate.Node & ConceptNode>                         (node: NT, new_val: Partial<NT>         ) => void
    set_node_by_path   : <NT extends Slate.Node & ConceptNode>                         (path:number[] , new_val: Partial<NT>   ) => void
    auto_set_parameter : <NT extends Slate.Node & ConceptNode>                         (node: NT, parameters: ParameterList    ) => void
    delete_concept_node: <NT extends Slate.Node & ConceptNode>                         (node: NT                               ) => void
    delete_node_by_path: <NT extends Slate.Node              >                         (path: number[]                         ) => void
    move_concept_node  : <NT extends Slate.Node & ConceptNode>                         (node_from: NT, posto: number[]         ) => void
    unwrap_node        : <NT extends Slate.Node & ConceptNode>                         (node: NT                               ) => void
    move_node_by_path  : <NT extends Slate.Node              >                         (posf: number[], posto: number[]        ) => void
    add_nodes          : <NT extends Slate.Node              >                         (nodes: (NT[]) | NT, path: number[]     ) => void
    add_nodes_before   : <NT extends Slate.Node, TT extends Slate.Node & ConceptNode>  (nodes: (NT[]) | NT, target_node: TT    ) => void
    add_nodes_after    : <NT extends Slate.Node, TT extends Slate.Node & ConceptNode>  (nodes: (NT[]) | NT, target_node: TT    ) => void
    add_nodes_here     : <NT extends Slate.Node              >                         (nodes: (NT[]) | NT                     ) => void
    replace_nodes      : <NT extends Slate.Node & ConceptNode, ST extends Slate.Node>  (father_node: NT, nodes: ST[]           ) => void
    wrap_selected_nodes: <NT extends Slate.BaseElement       >                         (node: NT, options:{
                                                                                            match?: (n:NT)=>boolean , 
                                                                                            split?: boolean , 
                                                                                        }) => void
    wrap_nodes         : <NT extends Slate.BaseElement       >                         (node: NT, from: Slate.Point, to: Slate.Point, 
                                                                                        options:{
                                                                                            match?: (n:NT)=>boolean , 
                                                                                            split?: boolean , 
                                                                                        }) => void
}        



interface EditorComponent extends TreeOpeationsMixins{
    /** 对应的编辑器。 */
    editorcore: EditorCore

    /** 节点树更新时的回调。 */
    onUpdate: (v: any) => void

    /** 按键按下的回调。 */
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void

    /** 按键弹起的回调。 */
    onKeyUp: (e: React.KeyboardEvent<HTMLDivElement>) => void

    /** 按键按下弹起的回调。 */
    onKeyPress: (e: React.KeyboardEvent<HTMLDivElement>) => void

    /** 改变光标位置的回调。 */
    onFocusChange: ()=>void
}
class EditorComponent extends React.Component<EditorComponentProps , {
    slate: SlateReact.ReactEditor & GroupNode
}>{
    
    constructor(props:EditorComponentProps){
        super(props)

        this.editorcore     = props.editorcore
        this.onUpdate       = props.onUpdate        || (()=>{})
        this.onKeyDown      = props.onKeyDown       || (()=>{})
        this.onKeyUp        = props.onKeyUp         || (()=>{})
        this.onKeyPress     = props.onKeyPress      || (()=>{})
        this.onFocusChange  = props.onFocusChange   || (()=>{})
        this.use_tree_op_mixin()

        let me = this

        let with_outer_plugin = props.plugin || ((x,y)=>y)

        this.state = {
            slate: this.make_root(
                with_outer_plugin(me , 
                    with_ytext_plugin(me , 
                        withHistory(
                            SlateReact.withReact(
                                Slate.createEditor() as SlateReact.ReactEditor
                            ) 
                        )
                    )
                )
            ), 
        }
    }

    /** 新建一个group节点塞进去。 */
    make_root(root: SlateReact.ReactEditor): SlateReact.ReactEditor & GroupNode{
        return {...root, ...this.editorcore.create_group("root")}
    }

    get_editorcore(){
        return this.editorcore
    }

    get_slate(){
        return this.state.slate
    }

    use_tree_op_mixin(){
        let me = this
        this.set_node               = (node, new_val) => tree_op_mixin.set_node(me , node, new_val)
        this.set_node_by_path       = (path , new_val) => tree_op_mixin.set_node_by_path(me,path, new_val)
        this.auto_set_parameter     = (node, parameters) => tree_op_mixin.auto_set_parameter(me,node, parameters)
        this.delete_concept_node    = (node) => tree_op_mixin.delete_concept_node(me,node)
        this.delete_node_by_path    = (path) => tree_op_mixin.delete_node_by_path (me,path)
        this.move_concept_node      = (node_from, posto) => tree_op_mixin.move_concept_node (me,node_from, posto)
        this.unwrap_node            = (node) => tree_op_mixin.unwrap_node (me,node, )
        this.move_node_by_path      = (posfr, posto) => tree_op_mixin.move_node_by_path(me,posfr, posto)
        this.add_nodes              = (nodes, path) => tree_op_mixin.add_nodes (me,nodes, path)
        this.add_nodes_before       = (nodes, target_node) => tree_op_mixin.add_nodes_before(me,nodes,target_node )
        this.add_nodes_after        = (nodes, target_node) => tree_op_mixin.add_nodes_after(me,nodes, target_node)
        this.add_nodes_here         = (nodes) => tree_op_mixin.add_nodes_here(me,nodes)
        this.wrap_selected_nodes    = (node, options) => tree_op_mixin.wrap_selected_nodes(me,node, options)
        this.wrap_nodes             = (node,fr,to,options) => tree_op_mixin.wrap_nodes(me, node, fr, to, options)
        this.replace_nodes          = (father_node, nodes) => tree_op_mixin.replace_nodes(me,father_node, nodes)  
    }

}

