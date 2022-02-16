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
let proofrenderer       = get_DefaultGroup_with_RightBar()

let strongrenderer      = get_DefaultInline()

let nprenderer          = DefaultNewParagraph
let sectrionrenderer    = get_DefaultSplitter((parameters)=>parameters.alias)
let imagerenderer       = get_DefaultDisplayer((parameters)=>parameters.url)

function use_all_editors(editor: YEditor){
    editor.update_renderer(DefaultParagraph , "paragraph")
    editor.update_renderer(theoremrenderer  , "group" , "theorem")
    editor.update_renderer(strongrenderer   , "inline" , "strong")
    editor.update_renderer(nprenderer       , "support" , "newparagraph")
    editor.update_renderer(sectrionrenderer , "support" , "new-section")
    editor.update_renderer(imagerenderer    , "support" , "image")
    editor.update_renderer(listrenderer     , "group" , "list")
    editor.update_renderer(proofrenderer    , "group" , "proof")
    return editor
}
