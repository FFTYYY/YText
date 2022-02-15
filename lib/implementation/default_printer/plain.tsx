import {
    Typography , 
    Box , 
    Paper , 
} from "@mui/material"

import type  { PrinterRenderFunc_Props } from "../../printer"
import  { make_print_renderer } from "../../printer"
import { ParagraphBox } from "./basic/components"

export { DefaultParagraphPrinter }

let DefaultParagraphPrinter = make_print_renderer((props: PrinterRenderFunc_Props) => <ParagraphBox>{props.children}</ParagraphBox>)