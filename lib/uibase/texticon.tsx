/** 这个模块提供一个文本样式的图标，或者说类似于图标的文本。
 */

import {
    Typography , 
    TypographyProps , 
} from "@mui/material"
export { TextIcon }

function TextIcon(props: {
    text: string, 
} & TypographyProps){

    let {text, sx, ...other_props} = props
    if(sx == undefined){
        sx = {}
    }
    sx = {
        border: "2px solid", 
        fontWeight: 800, 
        borderRadius: "50%" , 
        lineHeight: "100%",
        padding: "0.15rem", 
        ...sx , 
    }
    
    return <Typography sx={sx} {...other_props}>{text}</Typography>
}