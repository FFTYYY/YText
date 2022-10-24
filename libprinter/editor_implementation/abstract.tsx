/** 这个模块提供默认的抽象节点的渲染方式。
 * @module
 */

import React, {useState , createRef} from "react"
import * as Slate from "slate"
import produce from "immer"

import {
    Button ,
    Box , 
    Menu , 
    MenuItem , 
    Drawer , 
    IconButton , 
} from "@mui/material"
import { 
    AddBox as AddBoxIcon , 
    FilterNone as FilterNoneIcon , 
} from "@mui/icons-material"

import { AutoTooltip , ForceContain , AutoStackedPopper, EditorInformation } from "./uibase"
import {
    ConceptNode , 
    AllNodeTypes , 
    AllConceptTypes , 
    AbstractNode , 
    Printer , 
    GlobalInfo, 
    GlobalInfoProvider,
    GroupNode , 
} from "../core"
import {
    EditorComponent , 
} from "../editor"
import {
    DefaultEditorComponent
} from "./main"
import type { EditorRendererProps , EditorRenderer } from "../editor"

export {
    DefaultNewAbstract , 
    DefaultAbstractEditor , 
    DefaultAbstractEditorButtons , 
    get_default_abstract_editor , 
}

/** 这个组件提供一个按钮，让一个概念节点新建一个抽象概念。
 * @param props.editor 这个组件所服务的编辑器。
 * @param props.element 这个组件所服务的节点。注意只有 StyledNode 可以有 hidden 属性。
 */
function DefaultNewAbstract(props: {node: ConceptNode, anchor_element: any, open: boolean, onClose?: (e:any)=>void}){

    let globalinfo = React.useContext(GlobalInfo)
    let node = props.node 
    let editor = globalinfo.editor as EditorComponent<GroupNode | AbstractNode>

    // 这个列表罗列所有可选的抽象概念以供选择。
    // TODO 不应该从renderers读取吧。
    let abstract_concepts = editor.get_editorcore().renderers["abstract"]

    let onClose = props.onClose || ((e:any)=>{})

    function get_new_abstract_func(choice: string | undefined){
        return (e: any)=>{
            onClose(e)

            if(choice == undefined || abstract_concepts[choice] == undefined)
                return 

            let new_node_abstract = [...node.abstract , editor.get_editorcore().create_abstract(choice)]
            
            editor.set_node( node , {abstract: new_node_abstract})
        }
    }

    return <Menu
        anchorEl = {props.anchor_element}
        open = {props.open}
        onClose = {onClose}
    >{Object.keys(abstract_concepts).map(name=>{
        return <MenuItem onClick={get_new_abstract_func(name)} key={name}>{name}</ MenuItem>
    })}</Menu>
}

/** 抽象节点编辑器的`props`。 */
interface DefaultAbstractEditorProps{

    /** 所服务的节点。 */
    father: ConceptNode

    /** 所服务的是父节点的第几个抽象节点。 */
    sonidx: number

    /** 抽屉是否打开。 */
    open: boolean

    /** 抽屉关闭时的行为。 */
    onClose?: (e:any)=>void
}
/** 抽象节点编辑器的`state`。 */
interface DefaultAbstractEditorState{
    drawer_open: boolean
}

/** 这个组件提供默认的Abstract编辑页面。 
 * 这个组件会提供一个完整的文档编辑器，因为每个抽象节点都可以视为一个新文档。
*/
class DefaultAbstractEditor extends React.Component<DefaultAbstractEditorProps , DefaultAbstractEditorState>{

    /** 这个组件提供的文档编辑器的`ref`。 */
    subeditor_ref: React.RefObject<DefaultEditorComponent<AbstractNode>>


    /**
     * @param props.father 所服务的节点。
     * @param props.sonidx 所服务的是父节点的第几个抽象节点。
     * @param props.open 抽屉是否打开。
     * @param props.onClose 抽屉关闭时的行为。
     */
    constructor(props: DefaultAbstractEditorProps){
        super(props)

        this.state = {
            drawer_open: false
        }
        
        this.subeditor_ref = React.createRef()
    }

    // /** 这个函数将子编辑器的修改应用到父编辑器上。 */
    // sub_apply(father_editor: YEditor){

    //     let subeditor = this.get_editor()
    //     if(!subeditor)
    //         return 

    //     let father = this.father
    //     let son = this.son
    //     let hidden_idx = get_hidden_idx(father , son)
    //     let new_son = {...son , ...{children: subeditor.get_root().children}} // 更新之后的son。
    //     let new_hiddens = update_kth(father.hiddens , hidden_idx , new_son) // 更新之后的 father.hiddens。
        
    //     // TODO：这里有个bug，slate的setNodes并不会立刻应用，这导致如果有多个setNodes，后面修改的会覆盖前面的。
    //     // 应用变换。
    //     father_editor.set_node( father , { hiddens: new_hiddens })
    // }

    get_editor(){
        if(!(this.subeditor_ref && this.subeditor_ref.current && this.subeditor_ref.current.get_editor()))
            return undefined
        return this.subeditor_ref.current.get_editor()
    }

    render() {
        let me = this		
        let son = this.props.father.abstract[this.props.sonidx]
        if(!son){
            return 
        }
        let [son_children, son_but_children] = (()=>{
            let {children , ...son_but_children} = son
            return [children , son_but_children]
        })()

        return <GlobalInfo.Consumer>{globalinfo=>{
            let father_editor = globalinfo.editor as EditorComponent<GroupNode | AbstractNode>
            return <Drawer
                anchor      = {"left"}
                open        = {me.props.open}
                onClose     = {me.props.onClose}
                ModalProps  = {{keepMounted: true}}
                PaperProps  = {{sx: { width: "60%"}}}
                SlideProps = {{
                    onExited: () => {
                        let subeditor = me.get_editor()
                        if(!subeditor){
                            return
                        } 
                        let root = subeditor.get_root()

                        let father = me.props.father
                        let father_abstract_list = father.abstract
                        let new_abstract_list = produce(father_abstract_list, alis=>{
                            alis[me.props.sonidx].children = root.children
                        })

                        father_editor.set_node(father, {abstract: new_abstract_list})
                    } , 
                }}
            >
                <ForceContain.Provider value={true}>
                    <DefaultEditorComponent<AbstractNode> 
                        ref         = {me.subeditor_ref}
                        editorcore  = {father_editor.get_editorcore()}
                        init_rootchildren = {son_children}
                        init_rootproperty = {son_but_children}
                    />
                </ForceContain.Provider>
            </Drawer>
        }}</GlobalInfo.Consumer>
    }
}

/** 这个组件是一个菜单，菜单的每项是编辑一个抽象属性的按钮。 */
function DefaultAbstractEditorGroup(props: {node: Slate.Node & ConceptNode, anchor_element: any, open: boolean, onClose?: (e:any)=>void}){

    let node = props.node 
    let abstract = node.abstract 
    let onClose = props.onClose || ( (e:any)=>{} )

    let [drawer_open, set_drawer_open] = useState<undefined | string>(undefined) // 哪个抽屉打开，注意一次只能有一个抽屉打开。

    return <React.Fragment>
        <Menu
            anchorEl = {props.anchor_element}
            open = {props.open}
            onClose = {props.onClose}
        >{Object.keys(abstract).map((idx)=>{
            return <MenuItem key={idx} onClick={e=>{set_drawer_open(idx);onClose(e)}}>
                {abstract[idx].concept}-{idx}
            </ MenuItem>
        })}</Menu>

        {Object.keys(abstract).map((idx)=>{
            return <DefaultAbstractEditor
                key     = {idx}
                father  = {node} 
                sonidx  = {parseInt(idx)} 
                open    = {drawer_open == idx} 
                onClose = {(e:any)=>{set_drawer_open(undefined)}}
            />
        })}
    </React.Fragment>  
}

/** 这个组件提供两个按钮，分别是新建抽象和编辑抽象。
 * @param props.editor 这个组件所服务的编辑器。
 * @param props.element 这个组件所服务的节点。
 * @returns 一个渲染了两个 Button 的 
 */
function DefaultAbstractEditorButtons(props: EditorInformation){

    let node = props.node

    let [menu_new_ae, set_menu_new_ae]   = useState<undefined | HTMLElement>(undefined)
    let [menu_edit_ae, set_menu_edit_ae] = useState<undefined | HTMLElement>(undefined)

    return <GlobalInfo.Consumer>{globalinfo=>{
        let editor = globalinfo.editor as EditorComponent<AbstractNode | GroupNode>
        return <React.Fragment>

            <Box sx={{marginX: "auto"}}><AutoTooltip title="新建抽象">
                <IconButton onClick={e=>set_menu_new_ae(e.currentTarget)}><AddBoxIcon/></IconButton>
            </AutoTooltip></Box>

            <Box sx={{marginX: "auto"}}><AutoTooltip title="编辑抽象">
                <IconButton onClick={e=>set_menu_edit_ae(e.currentTarget)}><FilterNoneIcon/></IconButton>
            </AutoTooltip></Box>
            
            <DefaultNewAbstract
                node = {node} 
                anchor_element = {menu_new_ae}
                open = {menu_new_ae != undefined} 
                onClose = {e=>set_menu_new_ae(undefined)}
            />
            <DefaultAbstractEditorGroup 
                node = {node} 
                anchor_element = {menu_edit_ae}
                open = {menu_edit_ae != undefined} 
                onClose = {e=>{ set_menu_edit_ae(undefined) }}
            />
        </React.Fragment>
    }}</GlobalInfo.Consumer>
}

/**
 * 这个函数是向编辑器提供的，抽象节点的渲染函数。注意因为抽象节点只能作根，因此这个函数只会作为根节点渲染。
 * @param params.get_label 给定节点，获取标签的函数。
 * @returns 
 */
function get_default_abstract_editor({
    get_label       = (n:AbstractNode)=>n.parameters["label"].val as string, 
}: {
    get_label       ?: (n:AbstractNode)=>string ,  
}){
    return (props: EditorRendererProps<Slate.Node & AbstractNode>) => {
        let node = props.node as AbstractNode
        let label   = get_label(node)

        return <Box sx={{
            height: "100%" , 
            width: "100%" , 
        }}>
            {props.children}
        </Box>
    }
}