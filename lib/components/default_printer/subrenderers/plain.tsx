import {
    Typography , 
    Box , 
    Paper , 
} from "@mui/material"

import type  { PrinterRenderFunc_Props } from "../../../printer"
import  { make_print_renderer } from "../../../printer"

export { DefaultParagraphPrinter }

let DefaultParagraphPrinter = make_print_renderer((props: PrinterRenderFunc_Props) => {
    return <Typography 
        component = {Box}
        {...props}
        sx = {(theme:any)=>{return {
            ...theme.typography.body1,
            marginTop: theme.margins.paragraph , 
        }}}
    />
})