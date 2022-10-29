/** 这个模块为一般段落提供样式。 
 * module
*/
import {
    Grid , 
    Box , 
    Stack , 
    IconButton , 
    Typography , 
    Paper , 
} from "@mui/material"
import { 
    AllNodeTypes,
    ParagraphNode , 
    Node , 
    GroupNode , 
    InlineNode , 
    StructNode , 
    SupportNode , 
} from "../core"

import { EditorRenderer , EditorRendererProps } from "../editor"
import { 
    EditorParagraphBox as ParagraphBox , 
    EditorUnselecableBox , 
    EditorStructureTypography , 
    EditorComponentPaper as ComponentPaper , 
    EditorComponentEditingBox as ComponentEditorBox , 
} from "./uibase"

export { get_default_renderers }

function get_default_block_renderer<NodeType extends Node>(){
    return (props: EditorRendererProps<NodeType>) => (<ComponentPaper sx={{border: "2px block"}}>
        <ComponentEditorBox>
            {props.children}
        </ComponentEditorBox>
    </ComponentPaper>)
}

function get_default_renderers(): {[key in AllNodeTypes]: EditorRenderer}{
    return {
        "group"     : get_default_block_renderer<GroupNode>() , 
        "inline"    : get_default_block_renderer<InlineNode>() , 
        "structure" : get_default_block_renderer<StructNode>() , 
        "support"   : get_default_block_renderer<SupportNode>() , 
        "abstract"  : (props) => <Box>{props.children}</Box> , 
        "paragraph" : (props) => <ParagraphBox>{props.children}</ParagraphBox> , 
        "text"      : (props) => <span>{props.children}</span> , 
    }
}

