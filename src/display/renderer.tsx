/*
    这个文件定义一个React组件，来渲染slate node树 。
    exports:
        Renderer: 一个类，用来记录渲染信息。
        Renderer.Component: 一个组件，用来渲染node树。
*/

import {text_prototype , paragraph_prototype , group_prototype} from "../core/meta"
import type { RendererProps } from "../core/meta"

interface RendererComponentProps{
    node: any
    renderer: Renderer
}

function _Renderer_Component(props: RendererComponentProps){
    let node = props.node
    let me   = props.renderer

    if(node.children == undefined){
        return <span>{node.text}</span>
    }

    let children = node.children
    let SubRenderer = me.decide_renderer(node)
    return <SubRenderer 
        element={node}
        attributes={undefined}
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
            "default":       (props: RendererProps) => <div {...props.attributes}>{props.children}</div> , 
            "paragraph":     (props: RendererProps) => <p {...props.attributes}>{props.children}</p> , 
            "group-default": (props: RendererProps) => <div {...props.attributes}>{props.children}</div> , // group default
            "grouptypes": {}
        }
    }

    update_default_paragraph(renderer: (props: RendererProps)=>any){
        this.renderers.paragraph = renderer
    }
    update_default_group(renderer: (props: RendererProps)=>any){
        this.renderers["group-default"] = renderer
    }

    update_renderer(grouptype_name: string , renderer: (props: RendererProps)=>any){
        this.renderers.grouptypes[grouptype_name] = renderer
    }

    decide_renderer(node:any): (props:RendererProps)=>any{
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