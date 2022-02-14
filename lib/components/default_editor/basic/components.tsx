/** 
 * 这个模块提供一些基础组件。
 * @module
 */

 import React from "react"

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
import type { ThemeOptions } from "@mui/material/styles"

import { Node } from "slate"


import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import type { SxProps } from "@mui/material/styles"

export { ComponentPaper , ParagraphBox , EditorBackgroundPaper , ComponentEditorBox , InlineComponentPaper}

// TODO 加入一个不可选中的Box
// TODO 加入一个通用抽屉

/** 这个元素定义一个默认的用作段落的 Box 组件。 */
const ParagraphBox = (props: TypographyProps) => <Typography 
    component = {Box}
    {...props}
    sx = {(theme:any)=>{return {
        ...theme.typography.body1,
        marginTop: theme.margins.paragraph , 
        
        ...props.sx , 
    }}}
/>

/** 这个元素提供一个用于书写组件内容的 Box 组件。 */
const ComponentEditorBox = (props: BoxProps) =><Box 
    {...props}
    sx = {{
        paddingX : (theme: any) => theme.margins.background , 
        ...props.sx
    } as SxProps}
/>

/** 这个元素定义一个默认的用作组件的纸张的组件。 */
const ComponentPaper = (props: PaperProps) =><Paper 
    elevation = {0}
    variant = "outlined" 
    square 
    {...props}
    sx = {{
        marginTop: (theme: any) => theme.margins.paragraph , 
        color  : (theme: any) => theme.palette.primary , 
        ...props.sx
    } as SxProps}
/>

/** 这个元素定义一个默认的用作组件的纸张的组件。 */
const InlineComponentPaper = (props: PaperProps) =><Paper 
    elevation = {2}
    square 
    {...props}
    sx = {{
        display: "inline-block" ,
        height:  (theme: any) => { `${theme.typography.body1.lineHeight}rem`} , // 高度等于行高。
        color  : (theme: any) => theme.palette.secondary.dark , 
        paddingX: (theme: any) => theme.margins.small , 
        ...props.sx
    } as SxProps}
/>

/** 包裹整个编辑器的 Paper。 */
const EditorBackgroundPaper = (props: PaperProps) => <Paper 
    elevation = {0}
    variant = "outlined"
    square 
    {...props}
    sx = {{
        width: "100%" , 
        height: "100%" , 
        overflow: "hidden" ,         
    } as SxProps}
/>

