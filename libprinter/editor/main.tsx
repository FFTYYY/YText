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
    get_node_by_path , 
    get_node_path_by_idx , 
    get_node_by_idx , 
    set_node_by_path , 
    set_node_by_idx , 
    set_node , 
    set_node_parameters , 
    delete_node_by_path , 
    delete_node_by_idx , 
    insert_node , 
    insert_nodes , 
    insert_nodes_before , 
    insert_nodes_after , 
    move_node , 
    move_node_by_path , 
    replace_nodes , 
} from "./treeopmixin"

export {
    EditorComponent , 
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

    constructor(params: {renderers: RendererDict , default_renderers: DefaultRendererhDict, printer: Printer}){
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

class EditorComponent extends React.Component<EditorComponentProps , {
    slate: SlateReact.ReactEditor
    root: GroupNode
}>{
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
    
    // tree operation mixins
    get_node_by_path    : <NT extends Node = Node>  (path: number[])                                => NT | undefined
    get_node_path_by_idx: <NT extends Node = Node>  (idx: number)                                   => number[]| undefined
    get_node_by_idx     : <NT extends Node = Node>  (idx: number)                                   => NT | undefined
    set_node_by_path    : <NT extends Node>         (path: number[] , new_val: Partial<NT>)         => boolean
    set_node_by_idx     : <NT extends Node>         (idx: number , new_val: Partial<NT>)            => boolean
    set_node            : <NT extends ConceptNode>  (targetnode: NT, new_val: Partial<NT>)          => boolean
    set_node_parameters : <NT extends ConceptNode>  (targetnode: NT, parameters: ParameterList)     => boolean
    delete_node_by_path :                           (path: number[])                                => boolean
    delete_node_by_idx  :                           (idx: number)                                   => boolean
    insert_node         : <NT extends Node = Node>  (node: NT, path: number[])                      => boolean
    insert_nodes        : <NT extends Node = Node>  (nodes: NT[], path: number[])                   => boolean
    insert_nodes_before : <NT extends Node = Node>  (nodes: NT[], target_node: ConceptNode)         => boolean
    insert_nodes_after  : <NT extends Node = Node>  (nodes: NT[], target_node: ConceptNode)         => boolean
    move_node           : <NT extends ConceptNode>  (target_node: NT, position: number[])           => boolean
    move_node_by_path   :                           (from_path: number[], to_path: number[])        => boolean
    replace_nodes       : <FT extends ConceptNode>  (father_node: FT, new_children: FT["children"]) => boolean


    constructor(props:EditorComponentProps){
        super(props)

        this.editorcore     = props.editorcore
        this.onUpdate       = props.onUpdate        || (()=>{})
        this.onKeyDown      = props.onKeyDown       || (()=>{})
        this.onKeyUp        = props.onKeyUp         || (()=>{})
        this.onKeyPress     = props.onKeyPress      || (()=>{})
        this.onFocusChange  = props.onFocusChange   || (()=>{})
        this.use_tree_opertation_mixins()

        let me = this

        let with_outer_plugin = props.plugin || ((x,y)=>y)

        this.state = {
            slate: with_outer_plugin(me , 
                with_ytext_plugin(me , 
                    withHistory(
                        SlateReact.withReact(
                            Slate.createEditor() as SlateReact.ReactEditor
                        ) 
                    )
                )
            ), 
            root: me.editorcore.create_group("root")
        }
    }

    get_editorcore(){
        return this.editorcore
    }

    get_slate(){
        return this.state.slate
    }

    get_root(){
        return this.state.root
    }

    modify_root<RETTYPE>(apply: (root: GroupNode)=>RETTYPE): RETTYPE{
        let me = this
        let ret = undefined
        let new_root = produce(me.state.root , (root)=>{
            ret = apply(root)
        })
        me.setState({
            root: new_root
        })
        return ret
    }

    use_tree_opertation_mixins(){

        this.get_node_by_path    = <NT extends Node = Node>  (path: number[])                                => this.modify_root((root)=>get_node_by_path(root,path))
        this.get_node_path_by_idx= <NT extends Node = Node>  (idx: number)                                   => this.modify_root((root)=>get_node_path_by_idx(root,idx))
        this.get_node_by_idx     = <NT extends Node = Node>  (idx: number)                                   => this.modify_root((root)=>get_node_by_idx(root,idx))
        this.set_node_by_path    = <NT extends Node>         (path: number[] , new_val: Partial<NT>)         => this.modify_root((root)=>set_node_by_path(root,path,new_val))
        this.set_node_by_idx     = <NT extends Node>         (idx: number , new_val: Partial<NT>)            => this.modify_root((root)=>set_node_by_idx(root,idx,new_val))
        this.set_node            = <NT extends ConceptNode>  (targetnode: NT, new_val: Partial<NT>)          => this.modify_root((root)=>set_node(root,targetnode,new_val))
        this.set_node_parameters = <NT extends ConceptNode>  (targetnode: NT, parameters: ParameterList)     => this.modify_root((root)=>set_node_parameters(root,targetnode,parameters))
        this.delete_node_by_path =                           (path: number[])                                => this.modify_root((root)=>delete_node_by_path(root,path))
        this.delete_node_by_idx  =                           (idx: number)                                   => this.modify_root((root)=>delete_node_by_idx(root,idx))
        this.insert_node         = <NT extends Node = Node>  (node: NT, path: number[])                      => this.modify_root((root)=>insert_node(root,node,path))
        this.insert_nodes        = <NT extends Node = Node>  (nodes: NT[], path: number[])                   => this.modify_root((root)=>insert_nodes(root,nodes,path))
        this.insert_nodes_before = <NT extends Node = Node>  (nodes: NT[], target_node: ConceptNode)         => this.modify_root((root)=>insert_nodes_before(root,nodes,target_node))
        this.insert_nodes_after  = <NT extends Node = Node>  (nodes: NT[], target_node: ConceptNode)         => this.modify_root((root)=>insert_nodes_after(root,nodes,target_node))
        this.move_node           = <NT extends ConceptNode>  (target_node: NT, position: number[])           => this.modify_root((root)=>move_node(root,target_node,position))
        this.move_node_by_path   =                           (from_path: number[], to_path: number[])        => this.modify_root((root)=>move_node_by_path(root,from_path,to_path))
        this.replace_nodes       = <FT extends ConceptNode>  (father_node: FT, new_children: FT["children"]) => this.modify_root((root)=>replace_nodes(root,father_node,new_children))
    }
}

