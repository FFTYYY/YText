/** 这个模块定义editor的组件。
 * @module
 */
import React, { StatelessComponent } from "react"
import * as Slate from "slate"
import * as SlateReact from "slate-react"
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
    AllNodeTypes, 
    NonLeafNode, 

    GlobalInfoProvider , 
} from "../core"

import {
    EditorRenderer , 
    EditorRendererProps , 
} from "./editor_renderer"

import {
    slate_is_concept , 
    slate_is_paragraph , 
    slate_is_same_concept_node , 
    slate_is_text , 
    slate_get_node_type , 
} from "./utils"

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

    /** 查询一个渲染器。
     * @param type 查找的节点类型。
     * @param name 查找的概念名称。
     * 如果`type == "paragraph" || "text"`，那么`name`将会被忽略。
     * 反之，如果`type != "paragraph" && type != "text"`，那么`name`必须提供。
     */
     get_renderer(type: AllNodeTypes , name?: string): EditorRenderer{
        if(type != "paragraph" && type != "text"){// 概念节点。
            if(name == undefined)
                return this.default_renderers[type]

            let ret = this.renderers[type][name]
            if(ret == undefined){ // 如果没有找到这个概念的渲染器，就返回一个这个概念类型的默认渲染器。
                ret = this.default_renderers[type]
            }
            return ret
        }

        return this.default_renderers[type] // 在不是概念节点的情况下，直接返回默认渲染器。
    }

    /** 这个函数直接从一个节点查询渲染器。 */
    get_node_renderer(node: Slate.Node & Node): EditorRenderer{
        let me = this
        if(slate_is_text(node)){ // 如果是文本节点，直接按类型查询。
            return me.get_renderer("text")
        }
        else if(slate_is_paragraph(node)){ // 如果是段落节点，直接按类型查询。
            return me.get_renderer("paragraph")
        }
        let concept = me.printer.get_node_first_concept(node)
        let concept_name = concept ? concept.name : undefined
        return me.get_renderer(node.type , concept_name) // 如果是概念节点，按类型和一级概念名查询。
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
            concept: name , 
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
            concept: name , 
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
            concept: name , 
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
            concept: name , 
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
            concept: name , 
            parameters: parameters , 
            children: [me.create_paragraph("")] , 
            abstract: [] , 
        }
    }

    get_meta_param(node: Slate.Element & ConceptNode){
        let concpt = this.printer.get_node_first_concept(node)
        return concpt && concpt.metaParameters
    }
}

interface EditorComponentProps{
    editorcore: EditorCore 
    plugin?: EditorPlugin
    init_rootchildren?: (SlateReact.ReactEditor & GroupNode)["children"]

    /** 节点树更新时的回调。 */
    onUpdate?: (v: any) => void

    /** 按键按下的回调。 */
    onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void

    /** 按键弹起的回调。 */
    onKeyUp?: (e: React.KeyboardEvent<HTMLDivElement>) => void

    /** 按键按下弹起的回调。 */
    onKeyPress?: (e: React.KeyboardEvent<HTMLDivElement>) => void

    /** 改变光标位置的回调。 */
    onFocusChange?: ()=>void
    
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

/** Slate 需要的渲染函数的 props 。 */
interface SlateLeafRendererProps{
    attributes: any
    children: Slate.Node[]
    leaf: Slate.Text
}
/** Slate 需要的渲染函数的 props 。 */
interface SlateElementRendererProps{
    attributes: any
    element: Slate.Element
    children: Slate.Node[]
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
    slate: GroupNode & SlateReact.ReactEditor
    root_children: (SlateReact.ReactEditor & GroupNode)["children"]
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

        const init_rootchildren = props.init_rootchildren || [this.editorcore.create_paragraph("hello!")]

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
            root_children: init_rootchildren , 
        }
    }

    /** 新建一个group节点塞进去。 */
    make_root(root: SlateReact.ReactEditor): GroupNode & SlateReact.ReactEditor{
        Object.assign(root, this.editorcore.create_group("root"))
        return root as GroupNode & SlateReact.ReactEditor
    }

    get_editorcore(){
        return this.editorcore
    }

    get_slate(){
        return this.state.slate
    }

    use_tree_op_mixin(){
        let me = this
        this.set_node               = (node, new_val        ) => tree_op_mixin.set_node             (me , node, new_val)
        this.set_node_by_path       = (path , new_val       ) => tree_op_mixin.set_node_by_path     (me,path, new_val)
        this.auto_set_parameter     = (node, parameters     ) => tree_op_mixin.auto_set_parameter   (me,node, parameters)
        this.delete_concept_node    = (node                 ) => tree_op_mixin.delete_concept_node  (me,node)
        this.delete_node_by_path    = (path                 ) => tree_op_mixin.delete_node_by_path  (me,path)
        this.move_concept_node      = (node_from, posto     ) => tree_op_mixin.move_concept_node    (me,node_from, posto)
        this.unwrap_node            = (node                 ) => tree_op_mixin.unwrap_node          (me,node)
        this.move_node_by_path      = (posfr, posto         ) => tree_op_mixin.move_node_by_path    (me,posfr, posto)
        this.add_nodes              = (nodes, path          ) => tree_op_mixin.add_nodes            (me,nodes, path)
        this.add_nodes_before       = (nodes, target_node   ) => tree_op_mixin.add_nodes_before     (me,nodes,target_node )
        this.add_nodes_after        = (nodes, target_node   ) => tree_op_mixin.add_nodes_after      (me,nodes, target_node)
        this.add_nodes_here         = (nodes                ) => tree_op_mixin.add_nodes_here       (me,nodes)
        this.wrap_selected_nodes    = (node, options        ) => tree_op_mixin.wrap_selected_nodes  (me,node, options)
        this.wrap_nodes             = (node,fr,to,options   ) => tree_op_mixin.wrap_nodes           (me, node, fr, to, options)
        this.replace_nodes          = (father_node, nodes   ) => tree_op_mixin.replace_nodes        (me,father_node, nodes)  
    }

    /** 
     * 当 slate 改变 value 时通知自身的函数。
    */
    update_value(value: Slate.Node[]){
        this.onUpdate(value)
    }

    /** 渲染函数
     * @param props.element 当前要渲染的节点。
     * @param props.attributes 当前元素的属性，这是slate要求的。
     * @param props.children 下层节点，这是slate要求的。
     * @private
     */
    renderElement(props: SlateReact.RenderElementProps){
        let me = this
        let node = props.element as Slate.Element & NonLeafNode
                
        // 取得的子渲染器。
        let R = me.editorcore.get_node_renderer(node)

        // 需要给 slate 提供的顶层属性。
        let slate_attributes = props.attributes

        // 子渲染器需要的 props 。
        let subprops = {
            editor: me , 
            node: node ,
            children: props.children , 
        }
        
        // 如果这是个 inline 元素，就添加一个额外 style 。
        let extra_style = {}
        if(slate_is_concept(node)){
            let meta_param = this.editorcore.get_meta_param(node)
            if(meta_param && meta_param.forceInline){
                extra_style = {display: "inline-block"}
            }
            if(node.type == "inline"){
                extra_style = {display: "inline-block"}
            }
        }
        
        return <div {...slate_attributes} style={extra_style}><R {...subprops}/></div>
    }

    renderLeaf(props: SlateReact.RenderLeafProps){
        let me = this

        let R = me.editorcore.get_renderer("text")

        // 需要给 slate 提供的顶层属性。
        let slate_attributes = props.attributes

        // 子渲染器需要的 props 。
        let subprops = {
            editor: me  , 
            node: props.leaf ,
            children: props.children , 
        }
        return <span {...slate_attributes}><R {...subprops}></R></span>
    }

    render(){    
        let me = this

        let slate = me.state.slate
    
        let context = {
            editor: me , 
            slate: me.state.slate , 
            core: me.editorcore , 
        }
        
        let root_children = this.state.root_children
        console.log(me.state.slate)

        return <GlobalInfoProvider value={context}>
            <SlateReact.Slate 
                editor = {slate} 
                value = {root_children} 
                onChange = {value => {
                    // TODO ???
                    // if(JSON.stringify(value) == JSON.stringify(this.state.slate.children)){
                    //     return
                    // }
                    this.setState({
                        root_children: value as (SlateReact.ReactEditor & GroupNode)["children"]
                    })
                    me.update_value(value)
                    me.onFocusChange()
                }}
            >
                <SlateReact.Editable
                    renderElement = {me.renderElement.bind(me)}
                    renderLeaf    = {me.renderLeaf.bind(me)}
                    onClick       = {e=>{me.onFocusChange()}}
    
                    onCopy = {(e)=>{
                        return true // 虽然不知道是什么原理，但是返回`true`会使得`slate`只向粘贴板中输入文本。
                    }}

                    onPaste = {()=>{
                        //TODO 啊？
                        // set_normalize_status({pasting: true})
                        // return false
                    }}
    
                    onKeyDown = {e=>me.onKeyDown(e)}
                    onKeyUp = {e=>me.onKeyUp(e)}
                    onKeyPress = {e=>{me.onKeyPress(e)}}
                />
            </SlateReact.Slate>
        </GlobalInfoProvider>
    }
}

