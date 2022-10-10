import React from "react"
import {
	Printer ,
	PrinterComponent ,
	FirstClassConcept , 
	SecondClassConcept ,  
} from "../lib"
import {
	theorem , 
	strong , 
	sec_theorem , 
	sec_strong , 
} from "./concepts"
import {
	renderer_strong , 
	renderer_theorem , 
	default_renderers , 
} from "./renderers"
import {tree} from "./tree"

let printer = new Printer(
	[theorem , strong] , 
	[sec_theorem , sec_strong] , 
	{
		"group": {
			"theorem": renderer_theorem , 
		} , 
		"inline": {
			"strong": renderer_strong , 
		} , 
		"struct": {} , "support" : {} , "abstract": {} , 
	} , 
	default_renderers , 
)

class App extends React.Component<{},{}>{
	constructor(props: {}){
		super(props)
	}

	render(){
		let me = this
		return <PrinterComponent 
			printer = {printer} 
			root = {tree}
		></PrinterComponent>
	}
}

export default App