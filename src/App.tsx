import React from "react";
import YEditor from "./core/editor"
import GroupType from "./core/elements/group"
import AbstractType from "./core/elements/abstract"
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import { Transforms } from 'slate'
import Card from '@mui/material/Card'
import Paper from '@mui/material/Paper'
import './App.css'
import Renderer from "./display/renderer"
import { listItemAvatarClasses } from "@mui/material";

class App extends React.Component {
	editor: YEditor
	renderer: Renderer

	constructor(props: any) {
		super(props)
		this.state = {
			value: []
		}

		this.editor = new YEditor()
		this.editor.add_grouptype(new GroupType(
			"test" , [] , [] , {} , (props) => <Card {...props.attributes}>{props.children}</Card>
		))
		this.editor.add_abstracttype(new AbstractType(
			"tabs" , {} , (props) => <Card {...props.attributes}>
				{props.children}
			</Card>
		))

		this.renderer = new Renderer()
		this.renderer.update_group_renderer("test" , (props) => <Paper elevation={3}  {...props.attributes}>{props.children}</Paper>)
		this.renderer.update_abstract_renderer("tabs" , (props) => <Paper elevation={3}  {...props.attributes}>{props.children}</Paper>)
	}

	updateValue(val: any[]){
		this.setState({value: val})
	}

	render() {

		let me = this
		let grouptypes = this.editor.grouptypes
		let abstractypes = this.editor.abstractypes
		const buttons_grp = Object.keys(grouptypes).map( (name) => 
			<Button 
				variant = "contained" 
				key = {name}
				onClick = {()=>{
					Transforms.insertNodes(me.editor.slate , grouptypes[name].make_node())
				}}
			>{name}</Button>
		)
		const buttons_abs = Object.keys(abstractypes).map( (name) => 
			<Button 
				variant = "text" 
				key = {name}
				onClick = {()=>{
					Transforms.insertNodes(me.editor.slate , abstractypes[name].make_node())
				}}
			>{name}</Button>
		)
		
		return <div>
			<div className = "left-part">
			<Toolbar> {buttons_grp} </Toolbar>
			<Toolbar> {buttons_abs} </Toolbar>
				<YEditor.Component 
					editor={this.editor} 
					onValueChange={(val: any[])=>{me.updateValue(val)}} 
					key="1"
				/>
			</div>
			<div className = "right-part">
				<Renderer.Component 
					renderer={this.renderer} 
					node={{
						type: "root" , 
						children: me.state.value
					}} 
					key="2"
				/>
			</div>
		</div> 
	}
}

export default App
