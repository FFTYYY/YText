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

export { PrinterBox , PrinterParagraph , PrinterInlineTitle }

const PrinterParagraph = (props: TypographyProps) => <Typography 
    component = {Box}
    {...props}
    sx = {(theme:any)=>{return {
        ...theme.typography.body1,
        marginTop: theme.margins.paragraph , 
    }}}
/>

const PrinterInlineTitle = (props: BoxProps) => <Box 
    {...props}
    sx = {{
        marginX: (theme:any) => "1rem" , 
        display: "inline-block" , 
        ...props.sx
    } as SxProps}
/>

const PrinterBox = (props: BoxProps) => <Box 
    {...props}
    sx = {{
        marginTop: (theme:any) => theme.margins.paragraph , 
        paddingX : (theme:any) => theme.margins.paragraph , 
        ...props.sx
    } as SxProps}
/>


