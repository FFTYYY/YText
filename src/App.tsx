import React from "react";
import { YEditor } from "./core/editor/editor_interface"
import { EditorCore , GroupStyle } from "./core/editor/editorcore"
import { theorem } from "./components/groups"
import { Button } from "antd"


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
	}
	render() {

		let me = this
		let groupstyles = this.editor.core.groupstyles
		const buttons_grp = Object.keys(groupstyles).map( (name) => 
			<Button 
				key = {name}
				onClick = {this.editor.get_onclick("group" , name)}
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
