import {
    Typography , 
    Box , 
    Paper , 
} from "@mui/material"
import type {
    TypographyProps , 
    PaperProps , 
    BoxProps , 
} from "@mui/material"
import type { SxProps } from "@mui/material/styles"


import { Node } from "slate"
import type  { PrinterRenderFunc_Props } from "../../../printer"
import { GroupNode} from "../../../core/elements"
import type { PrinterRenderer } from "../../../printer"

export { PrinterGroupBox , PrinterParagraphBox , PrinterInlineTitle }

const PrinterParagraphBox = (props: TypographyProps) => <Typography 
    component = {Box}
    {...props}
    sx = {(theme:any)=>{return {
        ...theme.typography.body1,
        marginTop: theme.margins.paragraph , 
    }}}
/>

const PrinterGroupBox = (props: BoxProps) => <Box 
    {...props}
    sx = {{
        marginTop: (theme:any) => theme.margins.paragraph , 
        ...props.sx
    } as SxProps}
/>


const PrinterInlineTitle = (props: BoxProps) => <Box 
    {...props}
    sx = {{
        marginTop: (theme:any) => theme.margins.paragraph , 
        display: "inline-block" , 
        ...props.sx
    } as SxProps}
/>
