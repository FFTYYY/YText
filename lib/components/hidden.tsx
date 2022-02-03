/** 这个模块提供默认的抽象节点的渲染方式。
 * @module
 */

import React, {useState , createRef} from "react"

import { Transforms , Node, Editor } from "slate"

import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
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


import { StyledNode , NodeType , StyleType ,  GroupNode } from "../core/elements"
import { YEditor } from "../editor_interface"
import { non_selectable_prop , is_same_node , node2path , update_kth} from "../utils"
import { DefaultEditor } from "./editor"
import { EditorCore , InlineStyle , GroupStyle , StructStyle , SupportStyle , AbstractStyle } from "../core/editor_core"

export {DefaultNewHidden , DefaultHiddenEditor , DefaultHidden}

/** 这个组件提供一个按钮，让 element 选择其 hidden style 。
 * @param props.editor 这个组件所服务的编辑器。
 * @param props.element 这个组件所服务的节点。注意只有 StyledNode 可以有 hidden 属性。
 */
function DefaultNewHidden(props: {editor: YEditor, element: StyledNode}){
    const [anchor_element, set_anchor_element] = React.useState<undefined | HTMLElement>(undefined)

    let element = props.element 
    let editor = props.editor
    let abstractstyles = editor.core.abstractstyles 

    function get_onClose(choice: string | undefined){
        return (e: any)=>{
            set_anchor_element(undefined)
            if(choice == undefined || abstractstyles[choice] == undefined)
                return 
            
            let new_hiddens = [...element.hiddens , ...[abstractstyles[choice].makehidden()]]

            Transforms.setNodes<StyledNode>(
                editor.slate , 
                {...element, ...{hiddens: new_hiddens}} , // 向 hiddens 中添加节点。 
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
    father: StyledNode

    /** 要编辑的 hidden 节点。 */
    son: GroupNode
}
interface DefaultHiddenEditor_State{
    drawer_open: boolean
}

/** 这个组件提供默认的hidden编辑页面。 */
class DefaultHiddenEditor extends React.Component<DefaultHiddenEditor_Props , DefaultHiddenEditor_State>{
    subeditor: YEditor
    hiddenid: number


    /**
     * @param props.editor 这个组件所服务的编辑器。
     * @param props.father 这个组件所服务的节点。
     * @param props.son 要编辑的 hidden 节点。
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
        // this.subeditor.core.root = {...this.subeditor.core.root , ...{children:props.son.children}}

        this.subeditor.set_sub_info(props.father , props.son)
        this.props.editor.add_subeditor(this.subeditor)

        console.log("constructing..." , props.son)
    }

    componentDidMount(): void {
        // Transforms.removeNodes(this.subeditor.slate , {at: [0]})
        Transforms.insertNodes(this.subeditor.slate ,  this.props.son.children , {at: [0]})

        console.log("mounting..." , this.props.son.children)    
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
                    // me.props.editor.apply_all()
                }}
                ModalProps = {{keepMounted: true}}
                PaperProps={{sx: { width: "40%" }}}
            >
                <DefaultEditor 
                    editor = { me.subeditor }
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
    let eidtor = props.editor
    let element = props.element
    return <Box>
        <Box><DefaultNewHidden editor={eidtor} element={element}/></Box>
        <Box>
        {Object.keys(element.hiddens).map((idx)=>{
            return <DefaultHiddenEditor key={idx} editor={eidtor} father={element} son={element.hiddens[idx]}/>
        })}</Box>
    </Box>
}

