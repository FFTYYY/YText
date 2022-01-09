import { GroupNode , GroupPrototype , ParagraphPrototype} from "../core/elements"
import { GroupStyle , EditorCore} from "../core/editor/editorcore"
import type { Renderer_Func , Renderer_Props } from "../core/editor/editor_interface"
import { YEditor } from "../core/editor/editor_interface"
import { Transforms , Node, Editor } from "slate"
import { Node2Path } from "./utils"
import React, {useState} from "react"
import {CaretDownOutlined,} from '@ant-design/icons'
import { DownOutlined } from '@ant-design/icons'
import {non_selectable_prop} from "../core/meta"
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import CardHeader from '@mui/material/CardHeader';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import { makeStyles , styled } from '@material-ui/styles';

export {DefaultNewHidden , DefaultHiddenEditor , DefaultHidden}
export type {DefaultHiddenEditor_Props}

// 这个组件提供一个按钮，让element选择其hidden style
function DefaultNewHidden(props: {editor: YEditor, element: Node}){
    const [anchorEl, setAnchorEl] = React.useState<undefined | HTMLElement>(undefined)

    let editor = props.editor
    let hiddenstyles = editor.core.hiddenstyles 

    function getOnClose(selection: string | undefined){
        return (e)=>{
            setAnchorEl(undefined)
            if(!hiddenstyles.hasOwnProperty(selection))
                return 

            Transforms.setNodes(
                editor.slate , 
                hiddenstyles[selection].makehidden() , 
                {match: n=>n.nodekey==props.element.nodekey}
            )
        }
    }

    return <div>
        <Button onClick={e=>setAnchorEl(e.currentTarget)}>Add Hidden</Button>
        <Menu
            anchorEl={anchorEl}
            open={anchorEl != undefined}
            onClose={getOnClose(undefined)}
        >
            {Object.keys(hiddenstyles).map(name=>{
                return <MenuItem onClick={getOnClose(name)} key={name}>{name}</MenuItem>
            })}
        </Menu>
    </div>  
}

interface DefaultHiddenEditor_Props{
    editor: YEditor
    element: Node
}

// 这个组件提供默认的hidden编辑页面
class DefaultHiddenEditor extends React.Component<DefaultHiddenEditor_Props>{
    subeditor: YEditor
    constructor(props: DefaultHiddenEditor_Props){
        super(props)

        this.state = {
            drawer_open: false
        }

        this.subeditor = new YEditor(new EditorCore(
            Object.values(props.editor.core.textstyles      ) , 
            Object.values(props.editor.core.groupstyles     ) , 
            Object.values(props.editor.core.structstyles    ) , 
            Object.values(props.editor.core.supportstyles   ) , 
            Object.values(props.editor.core.hiddenstyles    ) , 
        ))

        this.subeditor.renderers = props.editor.renderers
        this.subeditor.core.root = {...this.subeditor.core.root , ...{children:props.element.hidden.children}}
    }

	render() {

		let me = this
		let groupstyles = this.subeditor.core.groupstyles
		const buttons_grp = Object.keys(groupstyles).map( (name) => 
			<Button  type="primary"
				key = {name}
				onClick = {e => me.subeditor.get_onclick("group" , name)(e)}
			>{name}</Button>
		)
		        
        let props = this.props
		return <div>
            <Button onClick={e=>me.setState({drawer_open: true})}>Edit</Button>
            <Drawer
                anchor={"right"}
                open={this.state.drawer_open}
                onClose={e=>me.setState({drawer_open: false})}
                
                ModalProps = {{
                    keepMounted: true,
                }}

                PaperProps={{
                    sx: { width: "40%" },
                }}
                
            >
                <div>{buttons_grp} </div>
                <div>
                    <YEditor.Component 
                        editor={me.subeditor}
                        onUpdate={val=>{
                            console.log("hid" , me.subeditor.core.root)
                            Transforms.setNodes(
                                props.editor.slate , 
                                { hidden: {...props.element.hidden , ...{children: val}} } , 
                                { match: n=>n.nodekey == props.element.nodekey}
                            )
                        }}
                    />
                </div></Drawer>
        </div> 
	}
}


// 如果目标节点有hidden，则这个节点提供编辑界面，否则提供选择hidden的界面
function DefaultHidden(props: {editor: YEditor , element: Node}){
    let R:any = DefaultNewHidden
    if(props.element.hidden != undefined)
        R = DefaultHiddenEditor 
    return <R editor={props.editor} element={props.element}/>
}

