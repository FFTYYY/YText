import {
    Typography , 
    Box , 
    Paper , 
} from "@mui/material"

import type  { PrinterRenderFunc_Props } from "../../printer"
import  { make_print_renderer } from "../../printer"
import { PrinterParagraphBox } from "./basic/components"

export { DefaultParagraphPrinter }

let DefaultParagraphPrinter = make_print_renderer((props: PrinterRenderFunc_Props) => <PrinterParagraphBox>{props.children}</PrinterParagraphBox>)