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
import { AutoTooltip , Direction , AutoStack , AutoStackedPopper } from "../uibase"
import { DefaultParameterWithEditorWithDrawer } from "./parameter_container" 

import {
    EditorButtonInformation , 
    ButtonBase , 
} from "./base"

export {    
    DefaultParameterEditButton , 
    DefaultCloseButton , 
    AutoStackedPopperWithButton , 
    NewParagraphButtonUp , 
    NewParagraphButtonDown , 
    DefaultSwicth , 
    AutoIconButton , 
    DefaultSoftDeleteButton , 
}



/** 这个函数是一个语法糖，用于自动创建带tooltip的按钮。 */
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

function MyImg(props: {img_url: string}){
    return <img src={props.img_url}></img>
}


// PureComponent  效率更高。
// XXX ?
/**
 * 这个组件向具体的编辑器和具体的节点提供 DefaultParameterContainer ，同时还提供一个按钮。
 * @param props.editor 这个组件所服务的编辑器。
 * @param props.element 这个组件所服务的节点。
 * @param props.open 抽屉是否打开。
 * @param props.onClose 抽屉关闭时的行为。
 */
class DefaultParameterEditButton extends React.PureComponent <EditorButtonInformation & {
    onClose?: (e:any)=>void , 
}, {
    open: boolean
}> implements ButtonBase {
    constructor(props: EditorButtonInformation & {onClose?: (e:any)=>void}){
        super(props)

        this.state = {
            open: false
        }
    }

    run(){
        this.setState({open:true})
    }

    render(){
        let props = this.props
        let onClose = props.onClose || ((e:any)=>{})
        let me = this

        return <Box sx={{marginX: "auto"}}>
            <AutoIconButton onClick={me.run.bind(me)} title="设置参数" icon={SettingsIcon}/>
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
class DefaultCloseButton extends React.Component<EditorButtonInformation> implements ButtonBase{
    static contextType = GlobalInfo

    constructor(props: EditorButtonInformation){
        super(props)
    }

    run(){
        let globalinfo = this.context
        let editor = globalinfo.editor as EditorComponent

        editor.delete_concept_node(this.props.node)
    }
    render(): React.ReactNode {
        return <AutoIconButton onClick={this.run.bind(this)} title="删除组件" icon={CloseIcon} />
    }
}

/** 这个组件提供一个删除节点，但是将其子节点移动到节点外的按钮。 
 * @param props.editor 这个组件所服务的编辑器。
 * @param props.element 这个组件所服务的节点。
 * @param props.puretext 是否将子组件作为纯文本。
 */
class DefaultSoftDeleteButton extends React.Component<EditorButtonInformation & {puretext?: boolean}> implements ButtonBase{
    static contextType = GlobalInfo

    constructor(props: EditorButtonInformation & {puretext?: boolean}){
        super(props)
    }

    run(){
        let globalinfo = this.context
        let editor = globalinfo.editor as EditorComponent

        if(this.props.puretext){
            // XXX 可能保留内部样式会比较好...
            let text = Slate.Node.string(this.props.node)
            let path = slate_concept_node2path(editor.get_root() , this.props.node)
            editor.delete_node_by_path(path)
            editor.add_nodes(editor.get_core().create_paragraph(text) , path)
        }
        else{
            editor.unwrap_node(this.props.node)
        }
    }
    render(): React.ReactNode {
        return <AutoIconButton onClick={this.run.bind(this)} title="解除组件" icon={MoveUpIcon} />
    }
}

/** 这个组件提供一个在组件的上新建段落的节点。 
 * @param props.editor 这个组件所服务的编辑器。
 * @param props.node 这个组件所服务的节点。
 */
class NewParagraphButtonUp extends React.Component<EditorButtonInformation> implements ButtonBase{
    static contextType = GlobalInfo

    constructor(props: EditorButtonInformation){
        super(props)
    }

    run(){
        let globalinfo = this.context
        let editor = globalinfo.editor as EditorComponent
        editor.add_nodes_before(editor.get_core().create_paragraph() , this.props.node )    
    }
    render(): React.ReactNode {
        return <AutoIconButton onClick={this.run.bind(this)} title="向上添加段落" icon={NorthIcon} />
    }
}

/** 这个组件提供一个在组件的下新建段落的节点。 
 * @param props.editor 这个组件所服务的编辑器。
 * @param props.node 这个组件所服务的节点。
 */
class NewParagraphButtonDown extends React.Component<EditorButtonInformation> implements ButtonBase{
    static contextType = GlobalInfo

    constructor(props: EditorButtonInformation){
        super(props)
    }

    run(){
        let globalinfo = this.context
        let editor = globalinfo.editor as EditorComponent
        editor.add_nodes_after(editor.get_core().create_paragraph() , this.props.node )    
    }
    render(): React.ReactNode {
        return <AutoIconButton onClick={this.run.bind(this)} title="向下添加段落" icon={SouthIcon} />
    }
}


/** 这个组件给一个`Group`或`Struct`组件提供一个开关，用于控制`Group`或`Struct`的`relation`。 
 * @param props.editor 服务的编辑器。
 * @param props.element 服务的节点。
 */
class DefaultSwicth extends React.Component<EditorButtonInformation<GroupNode | StructNode>, {
    checked: boolean
}> implements ButtonBase{
    static contextType = GlobalInfo
    
    switchref: React.RefObject<HTMLInputElement>

    constructor(props: EditorButtonInformation<GroupNode | StructNode>){
        super(props)

        this.state = {
            checked: props.node.relation == "chaining" , 
        }

        this.switchref = React.createRef<HTMLInputElement>()
    }

    get_switch(): HTMLInputElement | undefined{
        if(this.switchref && this.switchref.current){
            return this.switchref.current // 反正就是第一个children
        }
        return undefined
    }

    /** 当点击的时候，处理开关的逻辑。 */
    switch_check_change(e: React.MouseEvent<HTMLDivElement>){
        let globalinfo = this.context
        let editor = globalinfo.editor as EditorComponent
        let node = this.props.node

        let checked = this.get_switch().checked
        this.setState({checked: checked})

        // constraints会自动处理更改，不用担心
        if(checked){ // 从关到开
            editor.set_node(node , { relation: "chaining" } )
        }
        else{
            editor.set_node(node , { relation: "separating" })
        }
    }

    update(){
        let node = this.props.node
        // 在节点被外部修改的情况下更新组件状态。主要是为了在撤销操作时正确的操作状态
        if( (node.relation == "chaining") != this.state.checked){ 
            this.setState({checked: node.relation == "chaining"})
        }
    }

    componentDidMount(): void {
        this.update()
    }
    componentDidUpdate(): void {
        this.update()
    }
    
    run(){
        this.get_switch().click() // 模拟点击。
    }
    render(): React.ReactNode {
        return <AutoTooltip title = "贴贴">
            <Switch 
                checked = {this.state.checked} 
                onChange = {this.switch_check_change.bind(this)} 
                inputRef = {this.switchref}
            />
        </AutoTooltip>
    }
}




/** 折叠起来的按钮组的`props`。 */
interface AutoStackedPopperWithButtonProps {
    /** 用来展开菜单的按钮的类型。 */
    outer_button: any 

    /** 用来展开菜单的按钮的`props`。 */
    outer_props?: any 
    
    /** 传递给弹出框的`props` */
    poper_props?: any

    /** 鼠标移上去显示的字样。 */
    label?: string 

    /** 是否在点击其他位置时关闭。 */
    close_on_otherclick?: boolean

    /** 关闭时的其他行为。 */
    onClose?: ()=>void 

    /** 子元素。 */
    children?: any , 
}

/**
 * 这个组件定义一个折叠起来的按钮组。
 */
class AutoStackedPopperWithButton extends React.Component<AutoStackedPopperWithButtonProps, {
    menu_open: boolean
}>{

    menu_anchor_ref: React.RefObject<HTMLAnchorElement>

    /**
     * 创建一个折叠起来的按钮组，且通过无鼠标的方式来操作。
     * @param props.outer_button 用来展开菜单的按钮的类型。
     * @param props.outer_props 用来展开菜单的按钮的`props`。
     * @param props.poper_props 传递给弹出框的`props`
     * @param props.label 鼠标移上去显示的字样。
     * @param props.close_on_otherclick 是否在点击其他位置时关闭。
     * @param props.onClose 关闭时的其他行为。
     * @param props.children `children`会被渲染在按钮之前。
     */
    constructor(props: AutoStackedPopperWithButtonProps){
        super(props)

        this.state = {
            menu_open: false , 
        }

        this.menu_anchor_ref = React.createRef()
    }

    /** 打开菜单。 */
    set_menu_open(open: boolean){
        this.setState({menu_open: open})
        if(!open){ // 正在关闭
            let onClose = this.props.onClose || (()=>{})
            onClose() // TODO use MUI onExit
        }
    }

    /** 获得按钮组件，作为菜单组件的定位。 */
    get_anchor(){
        if(this.menu_anchor_ref && this.menu_anchor_ref.current){
            return this.menu_anchor_ref.current
        }
        return undefined
    }

    /** 模拟点击行为，切换菜单的关闭/打开。 
     * @param _ 这是无鼠标操作的接口规定的参数，没有实际意义。
     * @param force_open 为`undefined`表示切换状态，为`true`或者`false`表示强制设置状态。
    */
    run(_: any = undefined){
        this.set_menu_open(!this.state.menu_open)
    }

    render(){
        let props = this.props
        let children = props.children || <></>
        let B = props.outer_button


        let poper = <React.Fragment>
            <AutoTooltip title={props.label}><B 
                onClick     = {this.run.bind(this)}
                ref         = {this.menu_anchor_ref}
                {...props.outer_props}
            /></AutoTooltip>
            <AutoStackedPopper 
                anchorEl    = {this.get_anchor()} 
                open        = {this.state.menu_open}
                {...props.poper_props}
            >
                {children}
            </AutoStackedPopper>
        </React.Fragment>
    
        if(props.close_on_otherclick){
            return <ClickAwayListener onClickAway={()=>{this.set_menu_open(false)}}><Box>{poper}</Box></ ClickAwayListener>
        }
        return poper
    }
}
