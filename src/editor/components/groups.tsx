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

import { GroupStyle , EditorCore} from "../core/editor/editor_core"
import { GroupNode , StyledNode } from "../core/elements"
import type { Renderer_Func , Renderer_Props } from "../core/editor/editor_interface"
import { YEditor } from "../core/editor/editor_interface"

import { non_selectable_prop , is_same_node} from "../utils"
import { DefaultHidden } from "./hidden"
import { DefaultParameterContainer } from "./universe"

export {theorem}

/** 这是一个默认的Parameter容器组件，和特定的节点关联，会自动修改对应节点的属性。
 * @param props.editor 这个组件所服务的编辑器。
 * @param element 这个组件所依附的节点。
 */
function DefaultGroupParameter(props: {editor: YEditor, element: GroupNode}){
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

function theorem(editor: YEditor, name:string = "theorem"): [GroupStyle,Renderer_Func<GroupNode>]{
    let style = new GroupStyle(name , {
        "words": "Theorem" , 
        "test1": "haha" , 
        "test2": {
            "oo": "as" , 
            "ss": "ass" , 
        }
    })

    // TODO: 让renderer和editor解耦，否则hidden中的子editor无法继承到正确的renderer
    let renderer = (props: Renderer_Props<GroupNode>) => {
        let element = props.element
        return <Card 
            {...props.attributes}
            sx={{
                marginLeft: "1%",
                marginRight: "1%",
            }}
        >
            <Grid container>
                <Grid item xs={11} key="left-part" >
                    <span>{element.parameters.words}</span>
                    {props.children}
                </Grid>

                <Grid item xs={1}  key="right-part"><div>
                    <DefaultGroupParameter editor={editor} element={element} />
                    <DefaultHidden         editor={editor} element={element}/>
                </div></Grid>
            </Grid>
        </Card>
    }
    
    return [style , renderer]
}