/*
    这个文件定义一个React组件，来渲染slate node树 。
    exports:
        Renderer: 一个类，用来记录渲染信息。
        Renderer.Component: 一个组件，用来渲染node树。

    注：
        renderer必须知道每种node如何渲染，否则就会用默认的渲染方式。
*/

import {text_prototype , paragraph_prototype , group_prototype} from "../core/meta"

interface RendererComponentProps{
    node: any
    renderer: Renderer
}

interface RendererProps{
    children: any[]
    element: Node
}



function _Renderer_Component(props: RendererComponentProps){
    let node = props.node
    let me   = props.renderer

    if(node.children == undefined){
        return <span>{node.text}<br/></span>
    }

    let children = node.children
    let SubRenderer = me.decide_renderer(node)
    return <SubRenderer 
        element={node}
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
            "default":       (props: RendererProps) => <div>{props.children}</div> , 
            "paragraph":     (props: RendererProps) => <p>{props.children}</p> , 
            "group-default": (props: RendererProps) => <div>{props.children}</div> , // group default
            "grouptypes": {} , 
            "abstract-default": (props: RendererProps) => <div>{props.children}</div> , // abstract default
            "abstracttypes": {} , 
        }
    }

    update_default_paragraph(renderer: (props: RendererProps)=>any){
        this.renderers.paragraph = renderer
    }
    update_default_group(renderer: (props: RendererProps)=>any){
        this.renderers["group-default"] = renderer
    }
    update_default_abstract(renderer: (props: RendererProps)=>any){
        this.renderers["abstract-default"] = renderer
    }

    update_group_renderer(grouptype_name: string , renderer: (props: RendererProps)=>any){
        this.renderers.grouptypes[grouptype_name] = renderer
    }
    update_abstract_renderer(abstractype_name: string , renderer: (props: RendererProps)=>any){
        this.renderers.abstracttypes[abstractype_name] = renderer
    }

    decide_renderer(node:any): (props:RendererProps)=>any{
        if(node.type == "paragraph"){
            return this.renderers.paragraph
        }
        else if(node.type == "group"){
            let r = this.renderers.grouptypes[node.groupname]
            if(r === undefined){
                return this.renderers["group-default"]
            }
            return r
        }
        else if(node.type == "abstract"){
            let r = this.renderers.abstracttypes[node.abstractname]
            if(r === undefined){
                return this.renderers["abstract-default"]
            }
            return r
        }
        else if(node.type == "abstract-middle"){
            return this.renderers["default"]
        }
        return this.renderers["default"]
    }
}

export default Renderer