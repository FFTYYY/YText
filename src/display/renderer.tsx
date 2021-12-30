import {text_prototype , paragraph_prototype , group_prototype} from "../core/meta"
import React, { useEffect, useMemo, useState , useCallback} from "react";


function _Renderer_Component(props){
    let node = props.node
    let me   = props.renderer

    if(node.children == undefined){
        return <span>{node.text}</span>
    }

    let children = node.children
    let SubRenderer = me.decide_renderer(node)
    return <SubRenderer 
        attributes={{node:{node}}}
        children={
            Object.keys(children).map((num) => <Renderer.Component
                node={children[num]} 
                renderer={me} 
                key={num}
            />)
        }
    />

}
class Renderer{
    renderers: any

    static Component = _Renderer_Component

    constructor(){
        this.renderers = {
            "default":       (props) => <div {...props.attributes}>{props.children}</div> , 
            "paragraph":     (props) => <p {...props.attributes}>{props.children}</p> , 
            "group-default": (props) => <div {...props.attributes}>{props.children}</div> , // group default
            "grouptypes": {}
        }
    }

    update_default_paragraph(renderer){
        this.renderers.paragraph = renderer
    }
    update_default_group(renderer){
        this.renderers["group-default"] = renderer
    }

    update_renderer(grouptype_name , renderer){
        this.renderers.grouptypes[grouptype_name] = renderer
    }

    decide_renderer(node){
        if(node.type == "paragraph"){
            return this.renderers.paragraph
        }
        else if(node.type == "group"){
            let r = this.renderers.grouptypes[node.typename]
            if(r === undefined){
                return this.renderers["group-default"]
            }
            return r
        }
        return this.renderers["default"]
    }
}

export default Renderer