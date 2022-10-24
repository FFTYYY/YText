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
} from "../../libprinter"

export {renderers , default_renderers}

let renderers = {
    "group": {
        "theorem": get_deafult_group_editor_with_appbar({
            get_label: (n)=>"theorem"
        })
    } , 
    "inline": {
        "strong": get_default_inline_editor({
            get_label: (n)=>"strong"
        })
    } , 
    "structure": {} , 
    "support": {} , 
    "abstract": {
        "comment": get_default_abstract_editor({get_label: (n)=>"comment"})
    } ,
}

let def = (props: EditorRendererProps<Slate.Node & ConceptNode>) => {return <div>{props.children}</div>}
let default_renderers = {
    "group": get_deafult_group_editor_with_appbar({
        get_label: (n)=>"default"
    }) , 
    "inline": get_default_inline_editor({
        get_label: (n)=>"fuck"
    }) , 
    "structure": def , 
    "support": def , 
    "abstract": def ,
    "text": (props: EditorRendererProps<Slate.Node & TextNode>) => {return <span>{props.children}</span>} , 
    "paragraph": (props: EditorRendererProps<Slate.Node & ParagraphNode>) => {return <div>{props.children}</div>}, 

}