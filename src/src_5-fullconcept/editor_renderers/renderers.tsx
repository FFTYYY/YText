import { Typography  , TextField } from "@mui/material"
import React from "react"

import {
    get_deafult_group_editor_with_appbar , 
    get_default_group_editor_with_rightbar , 
    get_default_inline_editor , 
    get_default_abstract_editor , 
    get_default_editors , 
    get_default_struct_editor_with_rightbar , 
    get_default_spliter_editor , 
    get_default_display_editor , 

    EditorComponent , 
    GlobalInfo , 
    ConceptNode , 

    MouselessParameterEditor , 
    ButtonDescription , 
} from "../../../lib"


export { 
    editors , 
    default_editors , 
} 


let brightwords_editor  = get_deafult_group_editor_with_appbar({
    get_label: (n,p) => p.category
})
var subsection_editor   = get_deafult_group_editor_with_appbar({
    get_label: (n,p)=>`次节：${p.title}`
})
var formatted_editor    = get_default_group_editor_with_rightbar({})
var followwords_editor  = get_default_group_editor_with_rightbar({})
var mount_editor        = get_default_group_editor_with_rightbar({})
var display_editor      = get_default_group_editor_with_rightbar({})
let subwords_editor     = get_default_group_editor_with_rightbar({})
let sectioner_editor    = get_default_spliter_editor({get_title: (n,p)=>p.title})
let ender_editor        = get_default_spliter_editor({get_title: (n,p)=>"章节"})
var strong_editor       = get_default_inline_editor({})
var delete_editor       = get_default_inline_editor({surrounder: (props)=><del>{props.children}</del>  })
var link_editor         = get_default_inline_editor({surrounder: (props)=><u>{props.children}</u>      })
var mathinline_editor   = get_default_inline_editor({surrounder: (props)=><>{props.children}</>        })
var alignedwords_editor = get_default_struct_editor_with_rightbar({
    get_label: ()=>"行" , 
    get_numchildren: (n, p) => {
        let widths_str = p.widths as string
        let widths = widths_str.split(",").reduce((s,x)=>[...s,parseInt(x)] , [] as number[])
        return widths.length
    },
    get_widths: (n, p)=>{
        let widths_str = p.widths as string
        let widths = widths_str.split(",").reduce((s,x)=>[...s,parseInt(x)] , [] as number[])
        return widths
    }
})

var mathblock_editor    = get_default_group_editor_with_rightbar({
    rightbar_extra(n) {/** 在右侧提供一个用于快速输入退出符号的文本框。 */

        return [{
            component: MouselessParameterEditor , 
            other_props: {
                idx: 0 , 
                parameter_name: "suffix" , 
                label: "extra" , 
            } , 
            skip_mouseless: true , 
        }] as any 
    },
})

var image_editor = get_default_display_editor({
    get_label: ()=>"图片" , 
    is_empty: (n,p)=>!!(p.target) , 
    render_element: (props) => {
        let [ url , set_url ] = React.useState("")
        let node    = props.node
        let target  = node.parameters.target.val as string
        let type    = node.parameters.type.val as string
        let height  = node.parameters.height.val as number
        let width   = node.parameters.width.val as number

        React.useEffect(()=>{(async ()=>{
            if(type == "internal"){
                // TODO ...
            }
            else{
                set_url(target)
            }
        })()})

        return <img src={url || undefined } style={{
            width : width  > 0 ? `${width}rem`  : "100%", 
            height: height > 0 ? `${height}rem` : "100%" , 
        }}/>
    } , 
})



// var showchildren_editor = get_defaultSupportEditor_with_RightBar({
//     get_label: (n)=>get_param_val(n,"label") as string, 
// })


// var insertchildren_editor = get_DefaultSupportEditor_with_RightBar({
//     get_label: (n)=>get_param_val(n,"label") as string, 
// })

let editors = {
    "group": {
        "昭言": brightwords_editor , 
        "随言": followwords_editor , 
        "属言": subwords_editor , 
        "数学": mathblock_editor , 
        "裱示": mount_editor , 
        "彰示": display_editor ,
        "格示": formatted_editor , 
        "次节": subsection_editor  , 
    } , 
    "inline": {
        "强": strong_editor , 
        "刊": delete_editor , 
        "缀": link_editor , 
        "数学": mathinline_editor , 
    } , 
    "structure": {
        "齐言": alignedwords_editor , 
    } , 
    "support": {
        "图": image_editor , 
        "小节线": sectioner_editor , 
        "章节线": ender_editor , 
    } , 
    "abstract": {
        "穆言": get_default_abstract_editor({get_label: (n)=>"comment"})
    } ,
}


let default_editors = get_default_editors()
