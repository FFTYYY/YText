/** 
 * 这个文件提供一些实用按钮。
 * @module
 */

import React, {useEffect, useState} from "react"

import { 
    Card , 
    TextField ,
    Drawer , 
    Button , 
    Typography , 
    Tooltip , 
    IconButton , 
    ClickAwayListener  , 
    Box , 
    Switch , 
} from "@mui/material"
import type { IconButtonProps  } from "@mui/material"

import {
    Close as CloseIcon , 
    Settings as SettingsIcon , 
    North as NorthIcon , 
    South as SouthIcon , 
    MoveUp as MoveUpIcon  , 
}
from "@mui/icons-material"


import * as Slate from "slate"
import {
    GroupNode , 
    Node , 
    StructNode , 
    ConceptNode , 
    GlobalInfo
} from "../../core"
import { 
    EditorComponent , 
    slate_concept_node2path , 
} from "../../editor"
import { AutoTooltip , Direction , AutoStack , AutoStackedPopper } from "./autodirection"
import { DefaultParameterWithEditorWithDrawer , EditorInformation } from "./parameter_container" 

export {    
    DefaultParameterEditButton , 
    DefaultCloseButton , 
    AutoStackedPopperWithButton , 
    NewParagraphButton , 
    DefaultSwicth , 
    AutoIconButton , 
    DefaultSoftDeleteButton , 
}

/** 这个函数是一个语法糖，用于自动创建按钮 */
function AutoIconButton(props:{
    onClick?: IconButtonProps["onClick"]
    size?: IconButtonProps["size"]
    title?: string
    icon?: any
    component?: "button" | "span"
}){
    let Icon = props.icon
    let component = props.component || "button"
    return <AutoTooltip title={props.title}>
        <IconButton onClick={props.onClick} size={props.size} component={component}>
            <Icon/>
        </IconButton>
    </AutoTooltip>
}

// PureComponent  效率更高。
/**
 * 这个组件向具体的编辑器和具体的节点提供 DefaultParameterContainer ，同时还提供一个按钮。
 * @param props.editor 这个组件所服务的编辑器。
 * @param props.element 这个组件所服务的节点。
 * @param props.open 抽屉是否打开。
 * @param props.onClose 抽屉关闭时的行为。
 */
class DefaultParameterEditButton extends React.PureComponent <EditorInformation & {
    onClose?: (e:any)=>void , 
}, {
    open: boolean
}>{
    constructor(props){
        super(props)

        this.state = {
            open: false
        }
    }
    render(){
        let props = this.props
        let onClose = props.onClose || ((e:any)=>{})
        let me = this

        return <Box sx={{marginX: "auto"}}>
            <AutoIconButton onClick={e=>me.setState({open:true})} title="设置参数" icon={SettingsIcon}/>
            <DefaultParameterWithEditorWithDrawer 
                node = {props.node} 
                open = {me.state.open} 
                onClose = {e=>{ 
                    onClose(e)
                    me.setState({open:false})
                }} 
            />
        </ Box>
    }
}


/** 这个组件提供一个直接删除节点的按钮。 
 * @param props.editor 这个组件所服务的编辑器。
 * @param props.element 这个组件所服务的节点。
 */
function DefaultCloseButton(props: EditorInformation){
    return <GlobalInfo.Consumer>{globalinfo=>{
        let editor = globalinfo.editor as EditorComponent
        return <AutoIconButton onClick={e=>{editor.delete_concept_node(props.node)}} title="删除组件" icon={CloseIcon} />
    }}</GlobalInfo.Consumer>
}


import {Transforms} from "slate"
/** 这个组件提供一个删除节点，但是将其子节点移动到节点外的按钮。 
 * @param props.editor 这个组件所服务的编辑器。
 * @param props.element 这个组件所服务的节点。
 * @param props.puretext 是否将子组件作为纯文本。
 */
function DefaultSoftDeleteButton(props: EditorInformation & {puretext?: boolean}){
    return <GlobalInfo.Consumer>{globalinfo=>{
        let editor = globalinfo.editor as EditorComponent
        return <AutoIconButton onClick={e=>{
            if(props.puretext){
                // XXX 可能保留内部样式会比较好...
                let text = Slate.Node.string(props.node)
                let path = slate_concept_node2path(editor.get_root() , props.node)
                editor.delete_node_by_path(path)
                editor.add_nodes(editor.get_core().create_paragraph(text) , path)
            }
            else{
                editor.unwrap_node(props.node)
            }
        }} title="解除组件" icon={MoveUpIcon} />
    }}</GlobalInfo.Consumer>
}

/** 这个组件提供一个在组件的上下新建段落的节点。 
 * @param props.editor 这个组件所服务的编辑器。
 * @param props.node 这个组件所服务的节点。
 */
function NewParagraphButton(props: EditorInformation){
    return <GlobalInfo.Consumer>{globalinfo=>{
        let editor = globalinfo.editor as EditorComponent
        return <React.Fragment>
                <AutoIconButton
                onClick = { e => {editor.add_nodes_before(editor.get_core().create_paragraph() , props.node ) }}
                title = "向上添加段落"
                icon = {NorthIcon}
            ></AutoIconButton>
            <AutoIconButton
                onClick = { e => {editor.add_nodes_after (editor.get_core().create_paragraph() , props.node ) }}
                title = "向下添加段落"
                icon = {SouthIcon}
            ></AutoIconButton>
        </React.Fragment>
    }}</GlobalInfo.Consumer>
}


function AutoStackedPopperWithButton(props: {
    button_class: any , 
    poper_props?: any,
    button_props?: any , 
    title?: string ,  
    children?: any , 
    close_on_otherclick?: boolean,
    onClose?: ()=>void , 
}){
    let B = props.button_class
    let [menu_open, set_menu_open] = React.useState<boolean>(false)
    // 展开栏挂载的元素。
    let menu_anchor = React.useRef()
    let onClose = props.onClose || (()=>{}) // TODO use MUI onExit

    let my_set_menu_open = (new_val: boolean) => {
        set_menu_open(new_val)
        if(!new_val){ // 正在关闭
            onClose()
        }
    }

    let poper = <React.Fragment>
        <AutoTooltip title={props.title}><B 
            onClick = {e => my_set_menu_open(!menu_open)}
            ref = {menu_anchor}
            {...props.button_props}
        /></AutoTooltip>
        <AutoStackedPopper 
            anchorEl = {menu_anchor.current} 
            open = {menu_open}
            {...props.poper_props}
        >{props.children}</AutoStackedPopper>
    </React.Fragment>

    if(props.close_on_otherclick){
        return <ClickAwayListener onClickAway={()=>{my_set_menu_open(false)}}><Box>{poper}</Box></ ClickAwayListener>
    }
    return poper
}

function MyImg(props: {img_url: string}){
    return <img src={props.img_url}></img>
}

/** 这个组件给一个`Group`或`Struct`组件提供一个开关，用于控制`Group`或`Struct`的`relation`。 
 * @param props.editor 服务的编辑器。
 * @param props.element 服务的节点。
 */
function DefaultSwicth(props: {node: Slate.Node & (GroupNode | StructNode)}){
    let node = props.node
    let globalinfo = React.useContext(GlobalInfo)
    let editor = globalinfo.editor as EditorComponent

    let [ checked , set_checked ] = useState(node.relation == "chaining") // 开关是否打开

    React.useEffect(()=>{

        // 在节点被外部修改的情况下更新组件状态。主要是为了在撤销操作时正确的操作状态
        if( (node.relation == "chaining") != checked){ 
            set_checked(node.relation == "chaining")
        }
    })

    /** 处理开关的逻辑。 */
    function switch_check_change(e: any & {target: any & {checked: boolean}}){
        let checked = e.target.checked
        set_checked(checked)

        // constraints会自动处理更改，不用担心
        if(checked == false){ // 从开到关
            editor.set_node(node , { relation: "separating" })
        }
        if(checked == true){ // 从关到开
            editor.set_node(node , { relation: "chaining" } )
        }
    }

    return <AutoTooltip title = "贴贴"><Switch checked={checked} onChange={switch_check_change}></Switch></AutoTooltip>
}
