import { Node , Transforms } from "slate"

import {
    get_DefaultGroup_with_AppBar , 
    get_DefaultGroup_with_RightBar , 
    get_DefaultInline , 
    DefaultNewParagraph , 
    get_DefaultSplitter , 
    get_DefaultDisplayer , 
    DefaultParagraph , 
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

let theoremrenderer     = get_DefaultGroup_with_AppBar()
let listrenderer        = get_DefaultGroup_with_RightBar( (p)=>"list" )
let proofrenderer       = get_DefaultGroup_with_RightBar( (p)=>"证明" )
let displayrenderer     = get_DefaultGroup_with_AppBar((p)=>"展示")

let strongrenderer      = get_DefaultInline("Strong" , (props)=><strong>{props.children}</strong>)
let deleterenderer      = get_DefaultInline("Delete" , (props)=><del>{props.children}</del>)
let linkrenderer        = get_DefaultInline("Link" , (props)=><u>{props.children}</u>)

let nprenderer          = DefaultNewParagraph
let sectrionrenderer    = get_DefaultSplitter((parameters)=>parameters.alias)
let imagerenderer       = get_DefaultDisplayer(
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

function use_all_editors(editor: YEditor){
    editor.update_renderer(DefaultParagraph , "paragraph")
    editor.update_renderer(theoremrenderer  , "group" , "theorem")
    editor.update_renderer(strongrenderer   , "inline" , "strong")
    editor.update_renderer(deleterenderer   , "inline" , "delete")
    editor.update_renderer(nprenderer       , "support" , "newparagraph")
    editor.update_renderer(sectrionrenderer , "support" , "new-section")
    editor.update_renderer(imagerenderer    , "support" , "image")
    editor.update_renderer(listrenderer     , "group" , "list")
    editor.update_renderer(displayrenderer    , "group" , "display")
    editor.update_renderer(proofrenderer    , "group" , "proof")
    editor.update_renderer(linkrenderer    , "inline" , "link")
    return editor
}
