import React, {useState , createRef} from "react"

import { Transforms, Node, Editor } from "slate"

import Button       from "@mui/material/Button"
import Card         from "@mui/material/Card"
import TextField    from "@mui/material/TextField"
import Grid         from "@mui/material/Grid"
import CardHeader   from "@mui/material/CardHeader"
import Menu         from "@mui/material/Menu"
import MenuItem     from "@mui/material/MenuItem"
import Drawer       from "@mui/material/Drawer"
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';

import { GroupStyle , EditorCore} from "../core/editor/editor_core"
import { GroupNode , StyledNode } from "../core/elements"
import type { Renderer_Func , Renderer_Props } from "../core/editor/editor_interface"
import { YEditor } from "../core/editor/editor_interface"

import { non_selectable_prop , is_same_node , node2path } from "../utils"
import { DefaultHidden } from "./hidden"
import { DefaultParameterContainer , DefaultParameterWithEditorWithDrawer} from "./universe"

export {new_default_group}

/** 这个函数返回一个默认的group组件。
 * 之所以再套一层函数，只是不想塞在一起让一个函数写得太长罢了。
 * @param name 这个组件的名称。
 * @param init_parameters 组件的初始参数列表。
 * @param title_key 要显示的标题在init_parameters中的名称，如果为undefined则没有标题。
 * 
 * @returns 一个用于渲染group的组件。
*/
function get_DefaultGroup(name:string , init_parameters:{title?:string} , title_key:string){
    
    return (props: Renderer_Props<GroupNode>) => {
        let element = props.element
        let title = (title_key != undefined) ? (element.parameters[title_key] || "") : ""
        let editor = props.editor
        let [ open , set_open ] = useState(false) // 抽屉是否打开

        return <div
            style={{
                marginLeft: "1%",
                marginRight: "1%",
            }}
        ><Card 
            {...props.attributes}
        >
            <AppBar {...non_selectable_prop} position="static">
                <Toolbar>
                    <IconButton onClick={e=>set_open(true)}>  <SettingsIcon/> </IconButton>          
                    <DefaultHidden editor={editor} element={element} />
                </Toolbar>
            </AppBar >
            {props.children}
            <DefaultParameterWithEditorWithDrawer open={open} editor={editor} element={element}
                onClose = { (e)=>{set_open(false)}}
            />
        </Card>
        </div>
    }
}
                    // <Typography>{title}</Typography>

function new_default_group(name:string = "theorem" , init_parameters:{title?:string} & any = {} , title_key = "title")
    : [GroupStyle,Renderer_Func<GroupNode>]
{

    // 样式说明
    let style = new GroupStyle(name , init_parameters)
        
    // 渲染器
    let renderer = (props: Renderer_Props<GroupNode>) => {
        let R = get_DefaultGroup(name , init_parameters , title_key)
        return <R {...props}></R> //有病吧
    }
    
    return [style , renderer]
}