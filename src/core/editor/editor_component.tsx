/* 作为React组件的Editor */

import React from "react";
import { createEditor , Node , BaseEditor} from 'slate'
import { Slate, Editable, withReact, ReactEditor} from 'slate-react'
import { Editor, Transforms } from 'slate'
import { EditorCore } from "./editorcore"
import type { BaseNode , TextNode , ParagraphNode , GroupNode , StructNode , SupportNode } from "../elements"
import { TextPrototype , ParagraphPrototype , GroupPrototype , StructPrototype , SupportPrototype } from "../elements"
import type { NodeType } from "../elements"

interface Renderer_Props{
    attributes: any
    children: any
}

function default_renderer(props: Renderer_Props):any{
    return <div {...props.attributes}>{props.children}</div>
}

class YEditor{
    core: EditorCore
    renderers: {[nd: string]: ((props: Renderer_Props)=>any) | {[sty: string]: ((props: Renderer_Props)=>any)}}

    constructor(core: EditorCore){
        this.core = core

        this.renderers = {
            "text-default"      : default_renderer , 
            "paragraph-default" : (props: Renderer_Props)=><p {...props.attributes}>{props.children}</p> , 
            "group-default"     : default_renderer , 
            "struct-default"    : default_renderer , 
            "support-default"   : default_renderer , 

            "textstyles"      : {} , 
            "paragraphstyles" : {} , 
            "groupstyles"     : {} , 
            "structstyles"    : {} , 
            "supportstyles"   : {} , 
        }

    }

    update_renderer(nodetype: NodeType, stylename: string | undefined = undefined){
        if(stylename == undefined){
            return this.renderers[`${nodetype}-default`]
        }
        let r = this.renderers[`${nodetype}styles`][stylename]
        if(r == undefined)
            return default_renderer
        return r
    }
    
}

