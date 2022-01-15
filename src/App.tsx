import React from "react"
import Button from "@mui/material/Button"

import "./App.css"
import { YEditor } from "./editor/core/editor/editor_interface"
import { EditorCore , GroupStyle , AbstractStyle} from "./editor/core/editor/editor_core"
import { new_default_group } from "./editor/components/groups"
import { new_default_iniline } from "./editor/components/inlines"
import { newparagraph } from "./editor/components/supports"

class App extends React.Component {
	editorcore: EditorCore
	editor: YEditor

	constructor(props: any) {
		super(props)
		this.state = {}

		this.editor = new YEditor(new EditorCore())

		let [theoremstyle, theoremrenderer] = new_default_group(
			"theorem" , 
			{title: "Theorem 1" , other_param: "xxx" , sub_par: {a: "1", b: "2"}}
		)
		this.editor.core.add_groupstyle(theoremstyle)
		this.editor.update_renderer(theoremrenderer , "group" , theoremstyle.name)
		
		let [strongstyle, strongrenderer] = new_default_iniline("strong" , {test: "haha"})
		this.editor.core.add_inlinestyle(strongstyle)
		this.editor.update_renderer(strongrenderer , "inline" , strongstyle.name)

		let [npstyle , nprenderer] = newparagraph()
		this.editor.core.add_supportstyle(npstyle)
		this.editor.update_renderer(nprenderer , "support" , npstyle.name)

		this.editor.core.add_abstractstyle(new AbstractStyle("comment" , {}))

	}
	render() {

		let me = this
		const buttons_grp = Object.keys(this.editor.core.groupstyles).map( (name) => 
			<Button 
				key = {name}
				onClick = {e => me.editor.get_onClick("group" , name)(e)}
			>{name}</Button>
		)
		const buttons_inl = Object.keys(this.editor.core.inlinestyles).map( (name) => 
			<Button 
				key = {name}
				onClick = {e => me.editor.get_onClick("inline" , name)(e)}
			>{name}</Button>
		)
		const buttons_spt = Object.keys(this.editor.core.supportstyles).map( (name) => 
			<Button 
				key = {name}
				onClick = {e => me.editor.get_onClick("support" , name)(e)}
			>{name}</Button>
		)
		
		return <div>
			<div>
				{buttons_grp}{buttons_inl}{buttons_spt}
			</div>
			<div>
				<YEditor.Component editor={me.editor}/>
			</div>
		</div> 
	}
}

export default App
