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

export { 
    ComponentPaper , 
    ParagraphBox , 
    EditorBackgroundPaper , 
    ComponentEditorBox , 
    InlineComponentPaper , 
    UnselecableBox , 
    ComponentBox , 
}

// TODO 加入一个不可选中的Box
// TODO 加入一个通用抽屉

const UnselecableBox = (props: BoxProps) => <Box 
    contentEditable = {false}
    {...props}
    sx = {{
        userSelect: "none" , 
        ...props.sx
    } as SxProps}
/>

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
const ComponentEditorBox = (props: BoxProps & {autogrow?: boolean}) =><Box 
    {...props}
    sx = {{
        paddingX : (theme: any) => theme.margins.background , 
        ...(props.autogrow
            ? { flex: 1 , minWidth: 0 , } // 如果自动增长，就设置一个 flex 属性。但是必须同时设置一个 minWidth，不知道为啥...
                                          // 可以参考 https://makandracards.com/makandra/66994-css-flex-and-min-width 
            : { minWidth: (theme: any) => theme.widths.minimum_content } // 如果不自动增长，设置一个最小宽度。
        ) ,
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

/** 对于一个非 Paper 的组件，这个组件用来提供其边框。 */
const ComponentBox = (props: BoxProps) =><Box 
    {...props}
    sx = {{
        marginTop: (theme: any) => theme.margins.paragraph , 
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

