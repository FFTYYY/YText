/** 
 * 这个文件提供一个开箱即用的editor示例。
 * @module
 */
 import React from "react"
 import Button from "@mui/material/Button"

import type { StyleType , NodeType } from "../../core/elements"

import { Node } from "slate"
import { object_foreach , merge_object } from "../utils"

import { 
	Paper , 
	Divider ,  
} from "@mui/material"
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { Printer } from "../../printer"
import { default_theme } from "../basic"

export { DefaultPrinter }

interface DefaultPrinter_Props{
	printer: Printer
	theme?: ThemeOptions
}

/** 
 * 这个组件提供一个开箱即用的默认渲染器组件。
 */
class DefaultPrinter extends React.Component <DefaultPrinter_Props> {
    printer: Printer

	constructor(props: DefaultPrinter_Props) {
		super(props)

		this.printer = props.printer
    }

    render() {
		let theme = merge_object(default_theme , this.props.theme)

        return <ThemeProvider theme={createTheme(theme)}><Paper sx={{
			position: "absolute" , 
			height: "100%" , 
			width: "100%" , 
			overflowY: "auto" , 
			wordWrap: "break-word" , 
		}}>
            <Printer.Component
			    printer = {this.printer}
		    />
        </Paper></ThemeProvider>
	}
}
