import React, {useState} from "react"

import { Transforms, Node, Editor } from "slate"

import Button       from "@mui/material/Button"
import Card         from "@mui/material/Card"
import TextField    from "@mui/material/TextField"
import Grid         from "@mui/material/Grid"
import CardHeader   from "@mui/material/CardHeader"
import Menu         from "@mui/material/Menu"
import MenuItem     from "@mui/material/MenuItem"
import Drawer       from "@mui/material/Drawer"

import { InlineStyle , EditorCore} from "../core/editor/editor_core"
import { InlineNode , StyledNode } from "../core/elements"
import type { Renderer_Func , Renderer_Props } from "../core/editor/editor_interface"
import { YEditor } from "../core/editor/editor_interface"

import { non_selectable_prop , is_same_node} from "../utils"
import { DefaultHidden } from "./hidden"
import { DefaultParameterContainer } from "./universe"

export { strong }

/** 这是一个Inline的默认的Parameter容器组件，和特定的节点关联，会自动修改对应节点的属性。
 * @param props.editor 这个组件所服务的编辑器。
 * @param element 这个组件所服务的节点。
 */
function DefaultInlineParameter(props: {editor: YEditor, element: InlineNode}){
    return <DefaultParameterContainer 
        initval={props.element.parameters} 
        onUpdate={val=>{
            Transforms.setNodes<GroupNode>(
                props.editor.slate , 
                { parameters: val },
                { match: n=> is_same_node(n,props.element) }
            )    
        }}
    />
}

function strong(editor: YEditor, name:string = "strong"): [InlineStyle,Renderer_Func<InlineNode>]{
    let style = new InlineStyle(name , {
        "words": "haha，草" , 
        "test1": "haha" , 
        "test2": {
            "oo": "as" , 
            "ss": "ass" , 
        }
    })

    // TODO: 让renderer和editor解耦，否则hidden中的子editor无法继承到正确的renderer
    let renderer = (props: Renderer_Props<InlineNode>) => {
        let element = props.element
        return <Card 
            {...props.attributes}
            style={{
                backgroundColor: "#AABBCC" , 
                display: "inline-block"
            }}
        >
            {props.children}
        </Card>
    }
    
    return [style , renderer]
}