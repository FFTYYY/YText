/** 
 * 这个文件提供一个开箱即用的editor示例。
 * @module
 */
 import React from "react"
 import Button from "@mui/material/Button"

import type { StyleType , NodeType } from "../../core/elements"

import { Node } from "slate"
import {object_foreach} from "../../utils"

import { YEditor } from "../../editor_interface"
import { new_default_iniline } from "./inlines"
import { newparagraph } from "./supports"
import {EditorCore , InlineStyle , GroupStyle , StructStyle , SupportStyle , AbstractStyle} from "../../core/editor_core"
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import Stack from '@mui/material/Stack';
import ButtonGroup from '@mui/material/ButtonGroup';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import { Paper , Divider } from '@mui/material';
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import CoffeeIcon from '@mui/icons-material/Coffee';
import SettingsIcon from '@mui/icons-material/Settings';
import QrCodeIcon from '@mui/icons-material/QrCode';



import Switch from '@mui/material/Switch';
import {DefaultHidden} from "./hidden"
import {DefaultParameterEditButton} from "./universe"
import {AutoStack , SimpleAutoStack , AutoTooltip , AutoStackedPopper , AutoStackButtons } from "./universe"
import {FilledStyle , ScrollFilledStyle } from "./universe"

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {my_theme} from "../theme"

export { DefaultEditor }
interface DefaultEditor_State{
	poper_anchor: {[key in StyleType]: any}
}

interface DefaultEditor_Props{
	editor: YEditor
	onUpdate?: (newval: Node[]) => void
	onMount?: () => void
}

/** 
 * 这个组件提供一个开箱即用的默认编辑器组件。
 */
class DefaultEditor extends React.Component <DefaultEditor_Props , DefaultEditor_State> {
	editor: YEditor
	onUpdate: (newval: Node[]) => void
	onMount: ()=>void

	constructor(props: DefaultEditor_Props) {
		super(props)

		this.state = {
			poper_anchor: {
				group: undefined, 
				inline: undefined, 
				support: undefined, 
				struct: undefined, 
			}
		}

		this.editor = props.editor
		this.onUpdate = props.onUpdate || ((newval: Node[])=>{})
		this.onMount  = props.onMount || (()=>{})
    }
	componentDidMount(): void {
		this.onMount()	
	}
	render() {

		let icons = {
			group: CalendarViewDayIcon , 
			inline: CloseFullscreenIcon , 
			support: CoffeeIcon , 
			struct: QrCodeIcon , 
		}
		let anchors = this.state.poper_anchor

		let toolbar_width = {
			xs: 0.15 , 
			md: 0.10 , 
			xl: 0.05 , 
		}
		let complement_width = object_foreach(toolbar_width , (x:number)=>1-x)
		// number2percent 用来将小数形式的表示转为字符串形式。MUI的sx的left属性不接受小数点表示。
		let number2percent = (obj: {[k:string]:number}) => object_foreach(obj , x=>`${Math.floor(x*100)%100}%`)

		let me = this
		return <ThemeProvider theme={my_theme}><Paper sx={FilledStyle}>

			<Box sx={{position: "absolute" , height: "100%" , width:  complement_width, overflow: "auto"}}>
				<YEditor.Component editor={me.editor} onUpdate={me.onUpdate}/>
			</Box>

			<Box sx={{position: "absolute" , height: "100%" , left: number2percent(complement_width), width: toolbar_width}}>

				<AutoStack force_direction="column">
					<DefaultParameterEditButton editor = {me.editor} element = {me.editor.core.root} />
					<DefaultHidden editor={me.editor} element={me.editor.core.root} />
					<Divider />
					{["group" , "inline" , "support" , "struct"].map ( (typename: StyleType)=>{
						let Icon = icons[typename]
						return <React.Fragment key={typename}>
							<AutoTooltip title = {typename}>
								<IconButton onClick={e=>{
									let new_anchor = (anchors[typename] == undefined) ? e.currentTarget : undefined
									let new_state = {...anchors , ...{[typename]: new_anchor}}
									me.setState({poper_anchor: new_state})
								}}><Icon /></IconButton>
							</AutoTooltip>

							<AutoStackedPopper
								anchorEl = {anchors[typename]}
								open = {anchors[typename] != undefined}
								stacker = {AutoStackButtons}
							>{
								Object.keys(me.editor.core[`${typename}styles`]).map( (stylename) => 
									<Button 
										key = {stylename}
										onClick = {e => me.editor.get_onClick(typename , stylename)(e)}
									>{stylename}</Button>
								)
							}</AutoStackedPopper>
						</React.Fragment>
					})}
				</AutoStack>
			</Box>

			</Paper></ThemeProvider>
	}
}
