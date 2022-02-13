/** 
 * 这个模块提供一些默认的 Group 的渲染器。
 * @module
 */

import React, {useState , createRef} from "react"

import { Node, Editor } from "slate"

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
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Portal from '@mui/material/Portal';
import Popper from '@mui/material/Popper';
import { Tooltip } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import Switch from '@mui/material/Switch';
import Container from '@mui/material/Container';
import Popover from '@mui/material/Popover';

import { GroupStyle , EditorCore} from "../../core/editor_core"
import { GroupNode , StyledNode , paragraph_prototype , get_node_type } from "../../core/elements"
import type { EditorRenderer_Func , EditorRenderer_Props } from "../../editor_interface"
import { YEditor } from "../../editor_interface"

import { add_nodes , set_node , add_nodes_before , move_node } from "../../behaviours"
import { non_selectable_prop , is_same_node , node2path } from "../../utils"
import { DefaultHidden } from "./hidden"
import { DefaultParameterContainer , DefaultParameterEditButton , DefaultCloseButton } from "./universe"
import type { UniversalComponent_Props } from "./universe/parameter_container" 
import { AutoTooltip  , AutoStack , Direction , SimpleAutoStack , AutoStackedPopper} from "./universe/direction_control"

export { get_DefaultGroup_with_AppBar , get_DefaultGroup_with_RightBar}

/** 这个函数返回一个默认的group组件。
 * @param get_title 从参数列表获得title的方法。
 * @param appbar_extra 要额外向appbar里添加的组件。
 * @returns 一个用于渲染group的组件。
*/
function get_DefaultGroup_with_AppBar(
    get_title:((parameters:any)=>string) = ((parameters:any)=>parameters.title) , 
    appbar_extra: (props: UniversalComponent_Props) => any = (props:UniversalComponent_Props) => <></>
): EditorRenderer_Func{
    // 渲染器
    return (props: EditorRenderer_Props) => {
        let element = props.element as GroupNode
        let title = get_title(element.parameters)
        let editor = props.editor
        let E = appbar_extra

        return <Paper
            sx={{
                marginLeft: "1%",
                marginRight: "1%",
            }}
            {...props.attributes}
            variant="outlined"
        >
            <AppBar {...non_selectable_prop} position="static" color="primary">
                <Toolbar><AutoStack force_direction="row">
                    <Typography>{title}</Typography>
                    <DefaultParameterEditButton editor={editor} element={element}/>         
                    <DefaultHidden      editor={editor} element={element} />
                    <DefaultGroupSwicth editor={editor} element={element} />
                    <DefaultCloseButton editor={editor} element={element} />
                    <E editor={editor} element={element}/>
                </AutoStack></Toolbar>
            </AppBar >
            <Box sx={{marginLeft: "1%", marginRight: "1%",}}>{props.children}</Box>
        </Paper>
    }
}

/** 这个函数返回一个默认的group组件，但是各种选项等都被折叠在右边。
 * @param get_title 从参数列表获得title的方法。
 * @param appbar_extra 要额外向appbar里添加的组件。
 * @returns 一个用于渲染group的组件。
*/
function get_DefaultGroup_with_RightBar(
    get_title:((parameters:any)=>string) = ((parameters:any)=>parameters.title) , 
    rightbar_extra: (props: UniversalComponent_Props) => any = (props:UniversalComponent_Props) => <></>
): EditorRenderer_Func{
    // 渲染器
    return (props: EditorRenderer_Props) => {
        let element = props.element as GroupNode
        let title = get_title(element.parameters)
        let editor = props.editor
        let E = rightbar_extra

        let [menu_anchor, set_menu_anchor] = React.useState<null | HTMLElement>(null);

        const expand_button = <Box {...non_selectable_prop}><SimpleAutoStack force_direction="column">
            
            <Typography>{title}</Typography>

            <E editor={editor} element={element}/>

            <AutoTooltip title = "展开"><IconButton 
                onClick = {e => set_menu_anchor(menu_anchor == undefined ? e.currentTarget : undefined)}
                size = "small"
            ><KeyboardArrowDownIcon /></IconButton></AutoTooltip>
            <AutoStackedPopper 
                anchorEl = {menu_anchor} 
                open = {menu_anchor != undefined}
            >
                <DefaultParameterEditButton editor={editor} element={element}/>
                <DefaultHidden      editor={editor} element={element} />
                <DefaultGroupSwicth editor={editor} element={element} />
                <DefaultCloseButton editor={editor} element={element} />
            </AutoStackedPopper>

        </SimpleAutoStack></Box>

        return <Paper
            sx={{
                marginLeft: "1%",
                marginRight: "1%",
            }}
            {...props.attributes}
            variant="outlined"
            color = "secondary"
        >
            <Box>
                <Grid container columns={24}>
                <Grid item xs={21} md={22} xl={23}><Box sx={{marginLeft: "1%", marginRight: "1%",}}>{props.children}</Box></Grid>
                <Grid item xs={3}  md={2}  xl={1}>{expand_button}</Grid>
                
                </Grid>
            </Box>
        </Paper>
    }
}


/** 这个组件给一个 Group 组件提供一个开关，用于控制 Group 的 relation 。 */
function DefaultGroupSwicth(props: {editor: YEditor , element: Node}){
    let element = props.element as GroupNode
    let editor = props.editor

    let [ checked , set_checked ] = useState(element.relation == "chaining") // 开关是否打开

    /** 处理开关的逻辑。 */
    function switch_check_change(e: any & {target: any & {checked: boolean}}){
        let checked = e.target.checked
        set_checked(checked)

        if(checked == false){ // 从开到关
            add_nodes_before(editor , paragraph_prototype() , element)
            set_node(editor , element , { relation: "separating" })
        }
        if(checked == true){ // 从关到开
            
            set_node( editor , element , { relation: "chaining" } )

            let node_path = node2path(editor.slate , element)
            let depth = node_path.length - 1
            let bro_path = undefined
            for(let i = node_path[depth]-1;i >= 0;i--){
                let new_path = [...node_path]
                new_path[depth] = i

                let tar_node = Node.descendant(editor.slate , new_path)
                if(get_node_type(tar_node) == "group"){
                    bro_path = new_path
                    break
                }
            }
            if(bro_path != undefined){
                bro_path[depth] ++
                move_node(editor , element , bro_path)
            }
        }

    }

    return <AutoTooltip title = "贴合"><Switch checked={checked} onChange={switch_check_change}></Switch></AutoTooltip>
}

