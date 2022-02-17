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
import React from "react"

export { PrinterBox , PrinterParagraph , PrinterInlineTitle , NewLevel , PrinterTitle , OldLevel}


/** 段落节点的默认输出方式。 */
const PrinterParagraph = (props: TypographyProps) => <Typography 
    component = {Box}
    {...props}
    sx = {[
        (theme)=>({
        ...theme.printer.typography.body, // 使用内容字体样式。
        marginTop: theme.printer.margins.paragraph , 
        }) , 
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]) , 
    ]}
/>

/** 一个独占一行的标题。 */
const PrinterTitle = (props: TypographyProps) => <Typography 
    component = {Box}
    {...props}
    sx = {[
        (theme)=>({
            ...theme.printer.typography.structure, // 使用结构字体的样式
        }),
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]) , 
    ]}
/>

/** 一个行内的标题样式。 */
const PrinterInlineTitle = (props: TypographyProps) => <Typography 
    component = {Box}
    {...props}
    sx = {[
        (theme)=>({
            ...theme.printer.typography.structure, // 使用结构字体的样式
            marginRight: (theme) => theme.printer.margins.colon , 
            display: "inline-block" , 
        }),
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]) , 
    ]}
/>

/** 一个用来包裹一个部分的组件。 */
const PrinterBox = (props: BoxProps) => <Box 
    {...props}
    sx = {[
        {
            marginTop: (theme) => theme.printer.margins.special , 
            marginBottom: (theme) => theme.printer.margins.special , 
        } , 
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]) , 
    ]}
/>

/** 用来包裹右边部分，从而开启新层级的组件。 */
const NewLevel = (props: BoxProps) => <Box 
    {...props}
    sx = {[
        {
            marginLeft: (theme) => theme.printer.margins.level , 
        } ,
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]) , 
    ]}
/>

/** 用来包裹左边部分，从而开启新层级的组件。 */
const OldLevel = (props: BoxProps) => <Box 
    {...props}
    sx = {[
        {
            width: (theme) => theme.printer.margins.level , 
        } ,
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]) , 
    ]}
/>
