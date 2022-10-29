import { Typography  , TextField } from "@mui/material"
import React from "react"

import {
    get_deafult_group_editor_with_appbar , 
    get_default_group_editor_with_rightbar , 
    get_default_inline_editor , 
    get_default_abstract_editor , 
    get_default_editors , 
    get_default_struct_editor_with_rightbar , 

    EditorComponent , 
    GlobalInfo , 
    ConceptNode , 
} from "../../libprinter"


export { 
    editors , 
    default_editors , 
} 


let brightwords_editor  = get_deafult_group_editor_with_appbar({})

var subsection_editor   = get_deafult_group_editor_with_appbar({get_label: (n)=>`次节：${n.parameters.title.val}`})
var formatted_editor    = get_default_group_editor_with_rightbar({})
var followwords_editor  = get_default_group_editor_with_rightbar({})
var mount_editor        = get_default_group_editor_with_rightbar({})
var display_editor      = get_default_group_editor_with_rightbar({})
var mathblock_editor    = get_default_group_editor_with_rightbar({
    rightbar_extra(n) {/** 在右侧提供一个用于快速输入退出符号的文本框。 */
        class _Ex extends React.Component<{node: ConceptNode}>{
            constructor(props){super(props)}
            render(){
                let node = this.props.node
                let universal_props = {variant: "standard" as "standard" , sx: {width: "2rem" , marginBottom: "0.5rem" , hright: "1rem"}}
                let label = <Typography sx={{fontSize: "0.7rem"}}>extra</Typography>
                let suffix_default = node.parameters.suffix.val // 注意，这里假设close必不用代理。
                return <GlobalInfo.Consumer>{globalinfo => {
                    let editor = globalinfo.editor as EditorComponent
                    return <TextField {...universal_props} label={label} defaultValue={suffix_default} onChange = {(e)=>{
                        let val = e.target.value
                        editor.auto_set_parameter( node , {suffix: {type: "string" , val: val}})
                    }}/>
                }}</ GlobalInfo.Consumer>
            }
        }

        return [_Ex]
    },
})
let subwords_editor     = get_default_group_editor_with_rightbar({})

// var sectioner_editor    = get_DefaultSplitterEditor({get_title: (n) => get_param_val(n,"title") as string})
// var ender_editor        = get_DefaultSplitterEditor({get_title: () => "章节"})


var strong_editor       = get_default_inline_editor({})
var delete_editor       = get_default_inline_editor({surrounder: (props)=><del>{props.children}</del>  })
var link_editor         = get_default_inline_editor({surrounder: (props)=><u>{props.children}</u>      })
var mathinline_editor   = get_default_inline_editor({surrounder: (props)=><>{props.children}</>        })


// var image_editor = get_DefaultDisplayerEditor({
//     get_label: ()=>"图片" , 
//     is_empty: (n)=>!!get_param_val(n , "target") , 
//     render_element: (props) => {
//         let [ url , set_url ] = React.useState("")
//         let target = get_param_val(props.element , "target") as string
//         let type = get_param_val(props.element , "type")

//         React.useEffect(()=>{(async ()=>{
//             if(type == "internal"){
//                 let resource_info = await Interaction.get.resource_info(target , BackendData.node_id)
//                 if(!resource_info.url){
//                     set_url("")
//                 }
//                 else{
//                     set_url(url_from_root(resource_info.url))
//                 }
//                 // 其实直接`set_url(resource_info.url)`也行，套一层`url_from_root`主要是为了调试方便。
//             }
//             else{
//                 set_url(target)
//             }
//         })()})

//         let p_width = get_param_val(props.element , "width")
//         let p_height = get_param_val(props.element , "height")

//         return <img src={url || undefined } style={{
//             width: p_width > 0 ? `${p_width}rem` : "100%", 
//             height: p_height > 0 ? `${p_height}rem` : "100%" , 
//         }}/>
//     } , 
// })

var alignedwords_editor = get_default_struct_editor_with_rightbar({
    get_label: (n)=>n.parameters.label.val as string, 
    get_numchildren: (n) => {
        let widths_str = n.parameters.widths.val as string
        let widths = widths_str.split(",").reduce((s,x)=>[...s,parseInt(x)] , [] as number[])
        return widths.length
    },
    get_widths: (n)=>{
        let widths_str = n.parameters.widths.val as string
        let widths = widths_str.split(",").reduce((s,x)=>[...s,parseInt(x)] , [] as number[])
        return widths
    }
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
    "support": {} , 
    "abstract": {
        "穆言": get_default_abstract_editor({get_label: (n)=>"comment"})
    } ,
}


let default_editors = get_default_editors()
