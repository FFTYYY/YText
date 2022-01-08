import React from "react";
import { YEditor } from "./core/editor/editor_interface"
import { EditorCore , GroupStyle , HiddenStyle} from "./core/editor/editorcore"
import { theorem } from "./components/groups"
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
		
		this.editor.core.add_hiddenstyle(new HiddenStyle("comment" , {}))

	}
	render() {

		let me = this
		let groupstyles = this.editor.core.groupstyles
		const buttons_grp = Object.keys(groupstyles).map( (name) => 
			<Button  type="primary"
				key = {name}
				onClick = {e => me.editor.get_onclick("group" , name)(e)}
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
