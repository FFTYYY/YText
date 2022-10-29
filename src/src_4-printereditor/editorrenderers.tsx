import React from "react"
import Slate from "slate"
import {
    get_deafult_group_editor_with_appbar , 
    get_default_abstract_editor , 
    GroupNode , 
    EditorRendererProps , 
    EditorRenderer ,
    
    InlineNode, 
    TextNode,
    ParagraphNode,
    ConceptNode, 
    get_default_inline_editor , 
    get_default_renderers , 
    get_deafult_group_editor_with_rightbar , 
    get_default_struct_with_rightbar , 
} from "../../libprinter"

export {renderers , default_renderers}

let renderers = {
    "group": {
        "theorem": get_deafult_group_editor_with_rightbar({
            get_label: (n)=>"theorem"
        })
    } , 
    "inline": {
        "strong": get_default_inline_editor({
            get_label: (n)=>"strong"
        })
    } , 
    "structure": {
        "line": get_default_struct_with_rightbar({
            get_label: (n)=>"行" , 
            get_numchildren:(n)=>{
                let widths_s = n.parameters.widths.val as string
                let widths = widths_s.split(",")
                return widths.length
            } , 
            get_widths: (n)=>{
                let widths_s = n.parameters.widths.val as string
                let widths = widths_s.split(",").reduce((s,x)=>([...s, parseInt(x)]) , [] as number[])
                return widths
            }
        })
    } , 
    "support": {} , 
    "abstract": {
        "comment": get_default_abstract_editor({get_label: (n)=>"comment"})
    } ,
}

let default_renderers = get_default_renderers()