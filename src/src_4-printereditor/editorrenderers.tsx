import React from "react"
import Slate from "slate"
import {
    get_deafult_group_editor_with_appbar , 
    GroupNode , 
    EditorRendererProps , 
    EditorRenderer ,
    
    InlineNode, 
    TextNode,
    ParagraphNode,
    ConceptNode, 
} from "../../libprinter"

export {renderers , default_renderers}

let renderers = {
    "group": {
        "theorem": get_deafult_group_editor_with_appbar({
            get_label: (n)=>"theorem"
        })
    } , 
    "inline": {} , 
    "structure": {} , 
    "support": {} , 
    "abstract": {} ,
}

let def = (props: EditorRendererProps<Slate.Node & ConceptNode>) => {return <div>{props.children}</div>}
let default_renderers = {
    "group": get_deafult_group_editor_with_appbar({
        get_label: (n)=>"default"
    }) , 
    "inline": (props: EditorRendererProps<Slate.Node & InlineNode>) => {return <span>{props.children}</span>} , 
    "structure": def , 
    "support": def , 
    "abstract": def ,
    "text": (props: EditorRendererProps<Slate.Node & TextNode>) => {return <span>{props.children}</span>} , 
    "paragraph": (props: EditorRendererProps<Slate.Node & ParagraphNode>) => {return <div>{props.children}</div>}, 

}