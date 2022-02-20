import { Node , Transforms } from "slate"

import {
	YEditor , 
	EditorCore , 
	Printer , 
	
	GroupStyle , 
	AbstractStyle , 
	SupportStyle ,
	InlineStyle , 
	StructStyle , 

	group_prototype ,
	paragraph_prototype , 

} from "../../lib"

import type {
	PrinterRenderer , 
	GroupNode , 
	PrinterEnv , 
	PrinterContext , 
} 
from "../../lib"

export { get_all_styles }

let theoremstyle = new GroupStyle("theorem" , {
	title: "Theorem" , 
	alias: "xxx" , 
	test_1: {
		a: "1" , 
		b: "2" , 
	} , 
	test_2: {
		a: 123,
		b: 0.99 , 
		c: false , 
	}
})
let liststyle 		= new GroupStyle  ("list" , {})
let displaystyle 	= new GroupStyle  ("display" , {title: "" , origin: ""})
let prooftyle 		= new GroupStyle  ("proof" , {title: "Proof"})
let strongstyle     = new InlineStyle ("strong" , {})
let deletestyle     = new InlineStyle ("delete" , {})
let linkstyle       = new InlineStyle ("link" , {targetidx: ""})

let npstyle         = new SupportStyle("newparagraph" , {})
let sectionerstyle  = new SupportStyle("new-section" , {title: ""})
let imagestyle      = new SupportStyle("image" , {
	url: "" , 
	title: "" , 
	width: 10 , 
	height : -1,
} , {forceInline: true})

let comment = new AbstractStyle("comment" , {})
let testabs = new AbstractStyle("test" , {})

let teststruct = new StructStyle("str" , {widths: "1"})

function get_all_styles(){

	return [
		theoremstyle , 
		liststyle , 
		prooftyle , 
		strongstyle , 
		deletestyle , 
		npstyle , 
		sectionerstyle , 
		imagestyle , 
		comment  , 
		testabs , 
		displaystyle , 
		linkstyle , 
		teststruct , 
	]
}