import React from "react"
import Button from "@mui/material/Button"

import { 
	Box ,
	Divider , 
} 
from "@mui/material"

import { Node , Transforms } from "slate"

import {
	EditorCore , 
	Printer , 
	
	GroupStyle , 
	AbstractStyle , 
	SupportStyle ,
	InlineStyle , 

	get_DefaultBlockPrinter , 
	get_DefaultParagraphPrinter , 
	get_DefaultInlinePrinter , 
	
	OrderEffector , 
	
	NewLevel , 
	AutoStack , 
	OldLevel , 
	PrinterParagraph , 
	PrinterDivider, 
	make_print_renderer, 
	PrinterTitle , 
	PrinterDisplay , 
} from "../../lib"

import type {
	PrinterRenderer , 
	GroupNode , 
	InlineNode , 
	SupportNode , 
	PrinterEnv , 
	PrinterContext , 
} 
from "../../lib"

export { use_all_printers }

function my_theorem_printer(){
    let orderer = new OrderEffector("order/theorem" , "order/theorem")

    let theoremprinter = get_DefaultBlockPrinter<GroupNode>({
        extra_effectors: [orderer] , 
        inject_pre: (props: {element: GroupNode , context: PrinterContext}) => {
            let order = orderer.get_context(props.context)
			let title = props.element.parameters.title
			let alias = props.element.parameters.alias
            return <PrinterTitle inline>{title} {order} ({alias})</PrinterTitle>
        }}
    )
	return theoremprinter
}

function my_proof_printer(){
	return get_DefaultBlockPrinter<GroupNode>({
		inner: (props: {element: GroupNode , context: PrinterContext, children: any}) => {
			let title = props.element.parameters.title
			return <React.Fragment><AutoStack force_direction="column">
				<PrinterTitle>{title}</PrinterTitle>
				<NewLevel>{props.children}</NewLevel>
				<PrinterTitle>Q.E.D</PrinterTitle>
			</AutoStack></React.Fragment>
		} , 
	})
}

function my_list_printer(){
	let orderer = new OrderEffector("order/list" , "order/list")
	return get_DefaultBlockPrinter<GroupNode>({
		extra_effectors: [orderer] , 
		inner: (props: {element: GroupNode , context: PrinterContext, children: any}) => {
			let order = orderer.get_context(props.context)
			return <React.Fragment><AutoStack force_direction="row">
				<OldLevel><PrinterParagraph>{order}</PrinterParagraph></OldLevel>
				<Box>{props.children}</Box>
			</AutoStack></React.Fragment>
		} , 
	})
}

function my_sectioner_printer(){
	let orderer = new OrderEffector("order/sectioner" , "order/sectioner")
	return get_DefaultBlockPrinter<GroupNode>({
		extra_effectors: [orderer] , 
		inner: (props: {element: GroupNode , context: PrinterContext, children: any}) => {
			let order = orderer.get_context(props.context)
			let title = props.element.parameters.title
			return <PrinterDivider>
				<PrinterTitle>{order}th Section: {title}</PrinterTitle>
			</PrinterDivider>
		} , 
	})
}

function my_strong_printer(){
	return get_DefaultInlinePrinter<InlineNode>({
		outer: (props: {element: InlineNode , context: PrinterContext, children: any}) => {
			return <PrinterParagraph><strong>{props.children}</strong></PrinterParagraph>
		}
	})
}

function my_delete_printer(){
	return get_DefaultInlinePrinter<InlineNode>({
		outer: (props: {element: InlineNode , context: PrinterContext, children: any}) => {
			return <PrinterParagraph><del>{props.children}</del></PrinterParagraph>
		}
	})
}

function my_displaystyle_printer(){

    let printer = get_DefaultBlockPrinter<GroupNode>({
		inner: (props: {element: GroupNode , context: PrinterContext, children: any}) => {
			let title  = props.element.parameters.title
			let origin = props.element.parameters.origin
			return <React.Fragment><AutoStack force_direction="column">
				{title ? <PrinterTitle>{title}</PrinterTitle> : <></>}
				<PrinterDisplay align="center">{props.children}</PrinterDisplay>
				{origin ? <PrinterTitle align="right">——{origin}</PrinterTitle> : <></>}
			</AutoStack></React.Fragment>
		} , 
	})
	return printer
}


function use_all_printers(printer: Printer){
    let listprinter 		= my_list_printer()
    let paragraphprinter 	= get_DefaultParagraphPrinter()

	let theoremprinter 		= my_theorem_printer()
    let proofprinter 		= my_proof_printer()
    let sectionerprinter 	= my_sectioner_printer()
	let strongprinter 		= my_strong_printer()
	let deleteprinter 		= my_delete_printer()
	let displayprinter 		= my_displaystyle_printer()


    printer.update_renderer( paragraphprinter, "paragraph" )
    printer.update_renderer( listprinter 	  as PrinterRenderer, "group" , "list" )
    printer.update_renderer( theoremprinter   as PrinterRenderer, "group" , "theorem" )
    printer.update_renderer( proofprinter 	  as PrinterRenderer, "group" , "proof" )
    printer.update_renderer( sectionerprinter as PrinterRenderer, "support" , "new-section" )
    printer.update_renderer( strongprinter    as PrinterRenderer, "inline" , "strong" )
    printer.update_renderer( deleteprinter    as PrinterRenderer, "inline" , "delete" )
    printer.update_renderer( displayprinter    as PrinterRenderer, "group" , "display" )
    
    return printer
}