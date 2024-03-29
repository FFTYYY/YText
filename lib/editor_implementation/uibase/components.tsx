/** 
 * 这个模块提供一些基础组件。
 * @module
 */

import React, { ReactFragment } from "react"

import {
    ScrollBarBox , 
} from "./scroll"

import {
    Typography , 
    Box , 
    Paper , 
    Card , 
    Container , 
} from "@mui/material"
import type {
    TypographyProps , 
    PaperProps , 
    BoxProps , 
} from "@mui/material"

import {
    default_theme , 
    ThemeContext , 
} from "../../core/theme"

export { 
    EditorComponentPaper , 
    EditorParagraphBox , 
    EditorBackgroundPaper , 
    EditorComponentEditingBox , 
    EditorUnselecableBox , 
    EditorComponentBox , 
    EditorStructureTypography , 
}

// XXX 可以加入一个通用抽屉...

/** 这个组件定义一个不可被选中的区域。用于 slate 的各种不希望被修改的辅助部分。 */
const EditorUnselecableBox = (props: BoxProps) => <Box 
    contentEditable = {false}
    {...props}
    sx = {[
        {
            userSelect: "none" , 
        } , 
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]) , 
    ]}
/>

/** 这个组件定义默认的段落渲染方式。 */
const EditorParagraphBox = (props: TypographyProps) => {
    let theme = React.useContext(ThemeContext)
    return <Typography 
        component = {Box}
        {...props}
        sx = {[
            {
                ...theme.editor.fonts.body , 
                marginTop: theme.editor.margins.paragraph , 
            } , 
            ...(Array.isArray(props.sx) ? props.sx : [props.sx]) , 
        ]}
    />
}

/** 结构性的文字。 */
const EditorStructureTypography = (props: TypographyProps) => {
    let theme = React.useContext(ThemeContext)
    return <Typography 
        component = {Box}
        {...props}
        sx = {[
            {
                ...theme.editor.fonts.structure,
                marginY: "auto" , // 垂直居中
                height: theme.editor.fonts.structure.lineHeight , 
                whiteSpace: "nowrap" , 
            },
            ...(Array.isArray(props.sx) ? props.sx : [props.sx]) , 
        ]}
    />
}


/** 这个组件定义可以书写的区域。
 * @param props.autogrow 如果为 true ，则区域会自动横向增长以填满父元素。
 */
const EditorComponentEditingBox = (props: BoxProps & {autogrow?: boolean}) => {
    let theme = React.useContext(ThemeContext)
    return <Box 
        {...{...props , autogrow: undefined}} // 去掉自己定义的属性。
        sx = {[
            {
                paddingX : theme.editor.margins.background , 
                ...(props.autogrow
                    ? { flex: 1 , minWidth: 0 , } // 如果自动增长，就设置一个 flex 属性。但是必须同时设置一个 minWidth，不知道为啥...
                                                // 可以参考 https://makandracards.com/makandra/66994-css-flex-and-min-width 
                    : {} // { minWidth: theme.editor.widths.minimum_content } // 如果不自动增长，设置一个最小宽度。
                ) ,
            } , 
            ...(Array.isArray(props.sx) ? props.sx : [props.sx]) , 
        ]}
    />
}

let EditorComponentPaperNestLevel = React.createContext<number>(1)

/** 这个组件定义一个用来渲染特殊节点的纸张。 
 * @param props.is_inline 这个组件是否是行内组件。
*/
const EditorComponentPaper = (props: PaperProps & {is_inline?: boolean, component?: "card" | "paper"}) =>{
    let net_level = React.useContext(EditorComponentPaperNestLevel) // 已经嵌套了多少层了
    let {children , is_inline, component, ...other_props} = props
    
    let CONT = Paper
    if(props.component == "card"){
        CONT = Card
    }

    let theme = React.useContext(ThemeContext)

    return <CONT 
        elevation = {net_level}
        square 
        {...other_props} // 去掉自己定义的属性。
        sx = {[
            {
                paddingY : "0.5rem" , 
                paddingX : "0.25rem" , 
            } , 
            {
                ...(is_inline
                    ? { // 行内
                        display     : "inline-block" ,
                        minHeight   : theme.editor.fonts.body.lineHeight , 
                        color       : "text.primary" ,
                        marginX     : theme.editor.margins.small , 
                    } : { // 块级
                        marginTop   : theme.editor.margins.paragraph ,      
                        color       : "text.primary" ,        
                    }
                ) , 
            } , 
            ...(Array.isArray(props.sx) ? props.sx : [props.sx]) , 
        ]}
    ><EditorComponentPaperNestLevel.Provider value = {net_level + 2}>
        {children}
    </EditorComponentPaperNestLevel.Provider></CONT>
}

/** 对于一个不用纸张作为最外层元素的节点，这个组件用来提供其边框。 */
const EditorComponentBox = (props: BoxProps) => {
    let theme = React.useContext(ThemeContext)
    return <Box 
        {...props}
        sx = {[
            {
                marginTop: theme.editor.margins.paragraph , 
            },
            ...(Array.isArray(props.sx) ? props.sx : [props.sx]) , 
        ]}
    />
}

/** 包裹整个编辑器的纸张。 */
const EditorBackgroundPaper = (props: PaperProps) => <Paper 
    elevation = {0}
    variant = "outlined"
    square 
    {...props}
    sx = {[
        {
            width: "100%" , 
            height: "100%" , 
            overflow: "hidden" ,         
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]) , 
    ]}
/>

