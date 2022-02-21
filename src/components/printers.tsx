import React , {useMemo} from "react"

import { 
	Box ,
	Divider , 
	Button , 
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
	
    PrinterDivider , 
    PrinterWeakenText , 
    PrinterDisplayText , 
    PrinterTitleBoxText  , 
    PrinterParagraphBox , 
    PrinterPartBox , 
    PrinterNewLevelBox , 
    PrinterOldLevelBox , 
    PrinterBackgroundPaper , 
	get_DefaultStructPrinter , 

	AutoStack , 
	make_print_renderer, 

	GlobalInfo , 
	idx2path , 
} from "../../lib"

import type {
	PrinterRenderer , 
	GroupNode , 
	InlineNode , 
	SupportNode , 
	StructNode , 
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
            return <PrinterTitleBoxText inline>{title} {order} ({alias})</PrinterTitleBoxText>
        }}
    )
	return theoremprinter
}

function my_proof_printer(){
	return get_DefaultBlockPrinter<GroupNode>({
		inner: (props: {element: GroupNode , context: PrinterContext, children: any}) => {
			let title = props.element.parameters.title
			return <React.Fragment><AutoStack force_direction="column">
				<PrinterTitleBoxText>{title}</PrinterTitleBoxText>
				<PrinterNewLevelBox><PrinterWeakenText>{props.children}</PrinterWeakenText></PrinterNewLevelBox>
				<PrinterTitleBoxText>Q.E.D</PrinterTitleBoxText>
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
				<PrinterOldLevelBox><PrinterParagraphBox>{order}</PrinterParagraphBox></PrinterOldLevelBox>
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
				<PrinterTitleBoxText>{order}th Section: {title}</PrinterTitleBoxText>
			</PrinterDivider>
		} , 
	})
}

function my_strong_printer(){
	return get_DefaultInlinePrinter<InlineNode>({
		outer: (props: {element: InlineNode , context: PrinterContext, children: any}) => {
			return <strong>{props.children}</strong>
		}
	})
}

function my_delete_printer(){
	return get_DefaultInlinePrinter<InlineNode>({
		outer: (props: {element: InlineNode , context: PrinterContext, children: any}) => {
			return <del>{props.children}</del>
		}
	})
}

// TODO 啊这...
function my_link_printer(){
	return get_DefaultInlinePrinter<InlineNode>({
		outer: (props: {element: InlineNode , context: PrinterContext, children: any}) => {
			let taridx = props.element.parameters.targetidx as (string)
			return <GlobalInfo.Consumer>{value => {
				let tarpath = JSON.stringify( idx2path( value.root , taridx ) )
				// TODO 似乎可以用react-router
				return <u onClick={e=>value.printer_component.scroll_to(tarpath)}>{props.children}</u>
			}}</GlobalInfo.Consumer>
		}
	})
}

function my_displaystyle_printer(){

    let printer = get_DefaultBlockPrinter<GroupNode>({
		inner: (props: {element: GroupNode , context: PrinterContext, children: any}) => {
			let title  = props.element.parameters.title
			let origin = props.element.parameters.origin
			return <React.Fragment><AutoStack force_direction="column">
				{title ? <PrinterTitleBoxText>{title}</PrinterTitleBoxText> : <></>}
				<PrinterDisplayText align="center">{props.children}</PrinterDisplayText>
				{origin ? <PrinterTitleBoxText align="right">——{origin}</PrinterTitleBoxText> : <></>}
			</AutoStack></React.Fragment>
		} , 
	})
	return printer
}

function my_image_printer(){

    let printer = get_DefaultInlinePrinter<SupportNode>({
		outer: (props: {element: SupportNode , context: PrinterContext, children: any}) => {
			let p = props.element.parameters as {url: string , width: number , height: number}
			let width = p.width > 0 ? `${p.width}rem` : "100%"
			let height = p.height > 0 ? `${p.height}rem` : "100%"
			// TODO 这玩意儿每次编辑都会重新加载，有点蛋疼....
			return <img src={p.url} style={{
				width: width, 
				height: height , 
			}}/>
		} , 
	})
	return printer
}

function my_struct_printer(){
	let printer = get_DefaultStructPrinter({
		get_widths: (element: StructNode) => (element.parameters.widths as string).split(",").map(x=>x=="" ? 1 : parseInt(x))
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
	let imageprinter 		= my_image_printer()
	let linkprinter 		= my_link_printer()
	let structprinter 		= my_struct_printer()


    printer.update_renderer( paragraphprinter, "paragraph" )
    printer.update_renderer( listprinter 	  as PrinterRenderer, "group" , "list" )
    printer.update_renderer( theoremprinter   as PrinterRenderer, "group" , "theorem" )
    printer.update_renderer( proofprinter 	  as PrinterRenderer, "group" , "proof" )
    printer.update_renderer( sectionerprinter as PrinterRenderer, "support" , "new-section" )
    printer.update_renderer( strongprinter    as PrinterRenderer, "inline" , "strong" )
    printer.update_renderer( deleteprinter    as PrinterRenderer, "inline" , "delete" )
    printer.update_renderer( displayprinter   as PrinterRenderer, "group" , "display" )
    printer.update_renderer( imageprinter     as PrinterRenderer, "support" , "image" )
    printer.update_renderer( linkprinter     as PrinterRenderer, "inline" , "link" )
    printer.update_renderer( structprinter     as PrinterRenderer, "struct" , "str" )
    
    return printer
}