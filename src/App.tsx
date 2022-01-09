import React from "react";
import { YEditor } from "./editor/core/editor/editor_interface"
import { EditorCore , GroupStyle , AbstractStyle} from "./editor/core/editor/editor_core"
import { theorem } from "./editor/components/groups"
import Button from '@mui/material/Button';
import "./App.css"

class App extends React.Component {
	editorcore: EditorCore
	editor: YEditor

	constructor(props: any) {
		super(props)
		this.state = {}

		this.editor = new YEditor(new EditorCore())

		let [theoremstyle, theoremrenderer] = theorem(this.editor)

		this.editor.core.add_groupstyle(theoremstyle)
		this.editor.update_renderer(theoremrenderer , "group" , theoremstyle.name)
		
		this.editor.core.add_abstractstyle(new AbstractStyle("comment" , {}))

	}
	render() {

		let me = this
		let groupstyles = this.editor.core.groupstyles
		const buttons_grp = Object.keys(groupstyles).map( (name) => 
			<Button 
				key = {name}
				onClick = {e => me.editor.get_onClick("group" , name)(e)}
			>{name}</Button>
		)
		
		return <div>
			<div>
				{buttons_grp}
			</div>
			<div>
				<YEditor.Component editor={me.editor}/>
			</div>
		</div> 
	}
}

export default App
