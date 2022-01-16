import { text_prototype , paragraph_prototype , inline_prototype , group_prototype , struct_prototype, support_prototype , } from "./core/elements"
import type { StyledNode , InlineNode , GroupNode , StructNode , SupportNode , AbstractNode } from "./core/elements"
import type { StyleType , NodeType } from "./core/elements"
import { get_node_type , is_styled } from "./core/elements"
import { EditorCore } from "./core/editor_core"
import Card from "@mui/material/Card"
import { Renderer } from "./core/renderer"
import { Editor } from "slate"
import { Node , BaseText , BaseElement} from "slate"

export { OutRenderer }
export type { OutRenderer_Props }

interface OutRenderer_Props<NT = Node>{
    attributes: any
    children: any[]
    element: NT
}

class OutRenderer extends Renderer<OutRenderer_Props>{

    constructor(core: EditorCore){
        super(core)
    }

    Component(){
        let me = this
        let R = this._Component.bind(this)
        return <R element={me.core.root}></R>
    }

    _Component(props: {element: Node}){
        let element = props.element
        let me = this
        let ThisFunction = this._Component.bind(this)

        type has_children = Node & {children: Node[]}
        type has_text = Node & {text: string}

        let type = get_node_type(element)
        if(type == "text"){
            let R = this.get_renderer("text")
            let text:any = (element as has_text).text
            if(text == "")
                text = <br />
            return <R attributes={{}} element={element}>{text}</R>
        }

        let name = undefined // 如果name是undefined，则get_renderer会返回默认样式。
        if(is_styled(element)){
            name = element.name
        }
        
        let children = (element as has_children).children
        let R = this.get_renderer(type , name)
        return <R 
            attributes={{}}
            element={element}
            children={
                Object.keys(children).map((num) => <ThisFunction
                    element={children[num]} 
                    key={num}
                />)
            }
        />
    }
}

