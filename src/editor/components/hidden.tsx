/** 这个模块提供默认的抽象节点的渲染方式。
 * @module
 */

import React, {useState , createRef} from "react"

import { Transforms , Node, Editor } from "slate"

import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import TextField from "@mui/material/TextField"
import Grid from "@mui/material/Grid"
import CardHeader from "@mui/material/CardHeader"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Drawer from "@mui/material/Drawer"
import { makeStyles , styled } from "@material-ui/styles"
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import SwipeVerticalIcon from '@mui/icons-material/SwipeVertical';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';


import { StyledNode , NodeType , StyleType } from "../core/elements"
import { YEditor } from "../core/editor/editor_interface"
import { non_selectable_prop , is_same_node , node2path } from "../utils"
import { DefaultEditor } from "./editor"
import {EditorCore , InlineStyle , GroupStyle , StructStyle , SupportStyle , AbstractStyle} from "../core/editor/editor_core"

export {DefaultNewHidden , DefaultHiddenEditor , DefaultHidden}
export type {DefaultHiddenEditor_Props}

/** 这个组件提供一个按钮，让 element 选择其 hidden style 。
 * @param props.editor 这个组件所服务的编辑器。
 * @param props.element 这个组件所服务的节点。注意只有 StyledNode 可以有 hidden 属性。
 */
function DefaultNewHidden(props: {editor: YEditor, element: StyledNode}){
    const [anchor_element, set_anchor_element] = React.useState<undefined | HTMLElement>(undefined)

    let element = props.element 
    let editor = props.editor
    let abstractstyles = editor.core.abstractstyles 

    function get_onClose(selection: string | undefined){
        return (e: any)=>{
            set_anchor_element(undefined)
            if(abstractstyles[selection] == undefined)
                return 
                
            Transforms.setNodes<StyledNode>(
                editor.slate , 
                abstractstyles[selection].makehidden() , 
                { at: node2path(editor.slate , element ) }
            )
        }
    }

    return <div>
        <IconButton onClick={e=>set_anchor_element(e.currentTarget)}><SwipeVerticalIcon/></IconButton>
        <Menu
            anchorEl={anchor_element}
            open={anchor_element != undefined}
            onClose={get_onClose(undefined)}
        >
            {Object.keys(abstractstyles).map(name=>{
                return <MenuItem onClick={get_onClose(name)} key={name}>{name}</ MenuItem>
            })}
        </Menu>
    </div>  
}

interface DefaultHiddenEditor_Props{
    editor: YEditor
    element: StyledNode
}
interface DefaultHiddenEditor_State{
    drawer_open: boolean
}

/** 这个组件提供默认的hidden编辑页面。 */
class DefaultHiddenEditor extends React.Component<DefaultHiddenEditor_Props , DefaultHiddenEditor_State>{
    subeditor: YEditor


    /**
     * @param props.editor 这个组件所服务的编辑器。
     * @param props.element 这个组件所依附的节点。
     */
    constructor(props: DefaultHiddenEditor_Props){
        super(props)

        this.state = {
            drawer_open: false
        }
        
        this.subeditor = new YEditor(new EditorCore(
            Object.values(props.editor.core.inlinestyles    ) , 
            Object.values(props.editor.core.groupstyles     ) , 
            Object.values(props.editor.core.structstyles    ) , 
            Object.values(props.editor.core.supportstyles   ) , 
            Object.values(props.editor.core.abstractstyles  ) , 
        ))

        this.subeditor.default_renderers = props.editor.default_renderers
        this.subeditor.style_renderers   = props.editor.style_renderers
        this.subeditor.core.root = {...this.subeditor.core.root , ...{children:props.element.hidden.children}}
    }  

    update_value(newval: Node[]){
        let me = this
        let element: StyledNode = this.props.element

        this.props.editor.add_operation((slate)=>{
            Transforms.setNodes<StyledNode>(
                slate , 
                { hidden: {...element.hidden , ...{children: newval}} } , 
                { at: node2path(slate , me.props.element) }
            )
        })
    }

	render() {
		let me = this		
        let props = this.props
		return <div>
            <IconButton onClick={e=>me.setState({drawer_open: true})}><SportsMartialArtsIcon/></IconButton>
            <Drawer
                anchor={"left"}
                open={this.state.drawer_open}
                onClose={e=>{
                    me.setState({drawer_open: false}) // 关闭抽屉
                    props.editor.apply_all() // 上传状态
                }}
                ModalProps = {{keepMounted: true}}
                PaperProps={{sx: { width: "40%" }}}
            >
                <DefaultEditor 
                    editor = { me.subeditor }
                    onUpdate = { (newval: Node[]) => me.update_value(newval) }
                />
            </Drawer>
        </div> 
	}
}


/** 如果目标节点有hidden，则这个节点提供编辑界面，否则提供选择hidden的界面。
 * @param props.editor 这个组件所服务的编辑器。
 * @param props.element 这个组件所服务的节点。
 * @returns 若 props.element 有hidden属性，则返回一个 DefaultHiddenEditor ，否则返回一个 DefaultNewHidden。
*/
function DefaultHidden(props: {editor: YEditor , element: StyledNode}){
    let R:any = DefaultNewHidden
    if(props.element.hidden != undefined)
        R = DefaultHiddenEditor 
    return <R editor={props.editor} element={props.element}/>
}

