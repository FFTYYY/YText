import React from "react";
import YEditor from "./core/editor"
import GroupType from "./core/group"
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import { Transforms } from 'slate'
import Card from '@mui/material/Card'
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
		this.editor.add_group_type(new GroupType(
			"test" , [] , [] , {} , (props) => <Card {...props.attributes}>{props.children}</Card>
		))

		this.renderer = new Renderer()
		this.renderer.update_renderer("test" , (props) => <Card {...props.attributes}>{props.children}</Card>)
	}

	updateValue(val){
		this.setState({value: val})
	}

	render() {

		let me = this
		let grouptypes = this.editor.grouptypes
		const buttons = Object.keys(grouptypes).map( (name) => 
			<Button 
				variant = "contained" 
				key = {name}
				onClick = {()=>{
					Transforms.insertNodes(me.editor.slate , grouptypes[name].make_node())
				}}
			>{name}</Button>
		)
		
		return <div>
			<div className = "left-part">
				<Toolbar> {buttons} </Toolbar>
				<YEditor.Component 
					editor={this.editor} 
					onValueChange={(val)=>{me.updateValue(val)}} 
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
