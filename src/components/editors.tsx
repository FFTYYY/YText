import { Node , Transforms } from "slate"

import {
    get_DefaultGroupEditor_with_AppBar , 
    get_DefaultGroupEditor_with_RightBar , 
    get_DefaultInlineEditor , 
    DefaultNewParagraphEditor , 
    get_DefaultSplitterEditor , 
    get_DefaultDisplayerEditor , 
    DefaultParagraphEditor , 
    get_DefaultStructEditor_with_RightBar , 
    YEditor , 
} from "../../lib"

import type {
	PrinterRenderer , 
	GroupNode , 
	PrinterEnv , 
	PrinterContext , 
} 
from "../../lib"

export { use_all_editors }

let theoremrenderer     = get_DefaultGroupEditor_with_AppBar()
let listrenderer        = get_DefaultGroupEditor_with_RightBar( (p)=>"list" )
let proofrenderer       = get_DefaultGroupEditor_with_RightBar( (p)=>"证明" )
let displayrenderer     = get_DefaultGroupEditor_with_AppBar((p)=>"展示")

let strongrenderer      = get_DefaultInlineEditor("Strong" , (props)=><strong>{props.children}</strong>)
let deleterenderer      = get_DefaultInlineEditor("Delete" , (props)=><del>{props.children}</del>)
let linkrenderer        = get_DefaultInlineEditor("Link" , (props)=><u>{props.children}</u>)

let nprenderer          = DefaultNewParagraphEditor
let sectrionrenderer    = get_DefaultSplitterEditor((parameters)=>parameters.alias)
let imagerenderer       = get_DefaultDisplayerEditor(
    "图片" , 
    (parameters)=>!!(parameters.url) , 
    (props: {parameters: any}) => {
        let p = props.parameters
        let width = p.width > 0 ? `${p.width}rem` : "100%"
        let height = p.height > 0 ? `${p.height}rem` : "100%"
        return <img src={p.url} style={{
            width: width, 
            height: height , 
        }}/>
    }
)
let structrenderer       = get_DefaultStructEditor_with_RightBar(
    (p)=>"结构" , 
    (n,p)=>{
        return p.widths.split(",").map(x=>x=="" ? 1 : parseInt(x))
    }
)

function use_all_editors(editor: YEditor){
    editor.update_renderer(DefaultParagraphEditor , "paragraph")
    editor.update_renderer(theoremrenderer  , "group" , "theorem")
    editor.update_renderer(strongrenderer   , "inline" , "strong")
    editor.update_renderer(deleterenderer   , "inline" , "delete")
    editor.update_renderer(nprenderer       , "support" , "newparagraph")
    editor.update_renderer(sectrionrenderer , "support" , "new-section")
    editor.update_renderer(imagerenderer    , "support" , "image")
    editor.update_renderer(listrenderer     , "group" , "list")
    editor.update_renderer(displayrenderer    , "group" , "display")
    editor.update_renderer(proofrenderer    , "group" , "proof")
    editor.update_renderer(linkrenderer      , "inline" , "link")
    editor.update_renderer(structrenderer    , "struct" , "str")
    return editor
}
