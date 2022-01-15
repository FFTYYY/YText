import React from "react"
import Button from "@mui/material/Button"

import "./App.css"
import { YEditor , Renderer_Props , Renderer_Func } from "./editor/core/editor/editor_interface"
import { StyledNode , NodeType , StyleType } from "./editor/core/elements"
import { new_default_group } from "./editor/components/groups"
import { new_default_iniline } from "./editor/components/inlines"
import { newparagraph } from "./editor/components/supports"
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import ButtonGroup from '@mui/material/ButtonGroup';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import SettingsIcon from '@mui/icons-material/Settings';
import Switch from '@mui/material/Switch';
import {DefaultHidden} from "./editor/components/hidden"
import {DefaultParameterWithEditorWithDrawer} from "./editor/components/universe"
import {EditorCore , InlineStyle , GroupStyle , StructStyle , SupportStyle , AbstractStyle} from "./editor/core/editor/editor_core"
import { DefaultEditor } from "./editor/components/editor"

interface App_State{
	acc_expd: {[key in StyleType]: boolean}
	param_drawer_open: boolean
}
class App extends React.Component<any,App_State> {
    inlinestyles    : InlineStyle   []
    groupstyles     : GroupStyle    []
    structstyles    : StructStyle   []
    supportstyles   : SupportStyle  []
    abstractstyles  : AbstractStyle []
    default_renderers: {[nd in NodeType]?: Renderer_Func}
    style_renderers  : {[nd in StyleType]?: {[sty: string]: Renderer_Func}}

	constructor(props: any) {
		super(props)

		
		let [theoremstyle, theoremrenderer] = new_default_group(
			"theorem" , 
			{title: "Theorem 1" , other_param: "xxx" , sub_par: {a: "1", b: "2"}}
		)
		let [strongstyle, strongrenderer] = new_default_iniline("strong" , {test: "haha"})
		let [npstyle , nprenderer] = newparagraph("newparagraph")


		this.abstractstyles = [new AbstractStyle("comment" , {})]
		this.groupstyles  = [theoremstyle]
		this.inlinestyles = [strongstyle]
		this.supportstyles = [npstyle]
		this.structstyles = []
		this.style_renderers = {
			"group": {
				"theorem": theoremrenderer , 
			} , 
			"inline": {
				"strong": strongrenderer , 
			} , 
			"support": {
				"newparagraph": nprenderer , 
			} , 
		}
	}
	render() {
		let me = this
		return <DefaultEditor 
			inlinestyles = {me.inlinestyles}
			groupstyles = {me.groupstyles}
			structstyles = {me.structstyles}
			supportstyles = {me.supportstyles}
			abstractstyles = {me.abstractstyles}
			default_renderers = {me.default_renderers}
			style_renderers = {me.style_renderers}
		/>
	}
}

export default App
