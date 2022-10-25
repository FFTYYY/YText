/** 
 * 这个文件提供一个开箱即用的editor示例。
 * @module
 */
import React  from "react"

import {
    Accordion , 
    AccordionSummary , 
    Toolbar , 
    Typography , 
    IconButton , 
    Button , 
    Box , 
    Paper ,
    Divider , 
    Popover , 
} from "@mui/material"
import {
    CalendarViewDay as CalendarViewDayIcon , 
    CloseFullscreen as CloseFullscreenIcon , 
    Coffee as CoffeeIcon , 
    Settings as SettingsIcon , 
    QrCode as QrCodeIcon , 
} from "@mui/icons-material"
import { ThemeProvider , createTheme , styled } from "@mui/material/styles"
import type { Theme , ThemeOptions } from "@mui/material/styles"

import * as Slate from "slate"
import * as SlateReact from "slate-react"
import {
    EditorComponent , 
    EditorCore, 
    EditorComponentProps , 
} from "../editor"
import {
    ConceptNode , 
    GroupNode , 
    Node , 
    AllConceptTypes , 
    AllNodeTypes, 
    AbstractNode, 
} from "../core"

import { 
    DefaultParameterEditButton , 
    AutoStackedPopperWithButton , 
} from "./uibase"
import { 
    AutoStack , 
    AutoTooltip , 
    AutoStackedPopper , 
    AutoStackButtons , 
    default_editor_theme , 
} from "./uibase"
import {
    object_foreach , 
    merge_object ,

} from "./uibase"
import {
    KeyEventManager , 
    MouselessElement , 
    KeyDownUpFunctionProxy , 
    DirectionKey, 
} from "./mouseless"

import { 
    EditorBackgroundPaper , 
    EditorComponentEditingBox  ,
} from "./uibase"

import {
    DefaultButtonbar , 
    get_mouseless_space as buttonbar_get_mouseless_space , 
} from "./buttobar"

export { DefaultEditorComponent }

// TODO 完善无鼠标操作。


/** 
 * 这个组件提供一个开箱即用的默认编辑器组件。
 */
class DefaultEditorComponent<RootType extends AbstractNode | GroupNode> extends React.Component <EditorComponentProps<RootType> & {
    theme?: ThemeOptions
    extra_buttons?: any
    onSave?: ()=>void // 保存时操作。
} , {
    ctrl_key: any
}> {    
    onUpdate: (newval: Node[]) => void
    onFocusChange: ()=>void
    onSave: ()=> void

    editor_ref		: React.RefObject<EditorComponent<RootType>>

    constructor(props: EditorComponentProps<RootType> & {theme?: ThemeOptions, extra_buttons?: any, onSave?: ()=>void}) {
        super(props)

        this.state = {
            ctrl_key: {} , // 只在按下ctrl的状态下有效，记录哪些键被按下了
        }

        this.onUpdate = props.onUpdate || ((newval: Node[])=>{})
        // this.onMount  = props.onMount || (()=>{})
        this.onFocusChange  = props.onFocusChange || (()=>{})
        this.onSave = props.onSave || (()=>{})

        this.editor_ref = React.createRef<EditorComponent<RootType>>()
    }

    get_editor(){
        if(this.editor_ref && this.editor_ref.current)
            return this.editor_ref.current
        return undefined
    }

    get_root(): RootType{
        return this.get_editor()?.get_root()
    }

    componentDidMount(): void {
        let me = this

        while(!this.get_editor()); // 确保editor存在
    }

    render() {
    
        // 工具栏的宽度
        let toolbar_width = {
            xs: 0.15 , 
            md: 0.10 , 
            xl: 0.05 , 
        }
        // 除开工具栏之外的部分的宽度。
        let complement_width = object_foreach(toolbar_width , (x:number)=>1-x)
        // number2percent 用来将小数形式的表示转为字符串形式。MUI的sx的left属性不接受小数点表示。
        let number2percent = (obj: {[k:string]:number}) => object_foreach(obj , x=>`${Math.floor(x*100)%100}%`)

        let theme = merge_object(default_editor_theme , this.props.theme)

        let me = this

        return <ThemeProvider theme={createTheme(theme)}><EditorBackgroundPaper>
            <KeyEventManager
                spaces = {[
                    buttonbar_get_mouseless_space(me.get_editor())
                ]}
                non_space_oprations = {[
                    {
                        key: "s" , 
                        on_activate: ()=>{me.onSave()}
                    }
                ]}
            >
                <Box sx = {{ 
                    position: "absolute" , 
                    height: "100%", 
                    width: "100%", 
                    overflow: "auto", 
                }}><EditorComponentEditingBox>
                    <KeyDownUpFunctionProxy.Consumer>{([onkeydown , onkeyup])=>{
                        return <EditorComponent
                            ref 		        = {me.editor_ref} 

                            editorcore          = {me.props.editorcore}
                            plugin              = {me.props.plugin}
                            init_rootchildren   = {me.props.init_rootchildren}
                            init_rootproperty   = {me.props.init_rootproperty}

                            onUpdate            = {me.props.onUpdate}
                            onKeyPress          = {me.props.onKeyPress}
                            onFocusChange       = {me.props.onFocusChange}
                            
                        
                            onKeyDown = {onkeydown}
                            onKeyUp = {onkeyup}
                        />
                    }}
                    </KeyDownUpFunctionProxy.Consumer>
                </EditorComponentEditingBox></Box>

                <Box sx = {{
                    position: "absolute", 
                    height: "100%", 
                    left: number2percent(complement_width), 
                    width: toolbar_width
                }}>{(()=>{
                    let editor = me.get_editor()
                    let root = me.get_root()
                    if(!(editor && root)){
                        return <></>
                    }
                    return <AutoStack force_direction="column">
                        <DefaultParameterEditButton node={me.editor_ref.current?.get_root()} />
                        {/* <DefaultHiddenEditorButtons editor={editor} element={me.state.root} /> */}
                        {me.props.extra_buttons}
                        <Divider />
                        <DefaultButtonbar editor={me.get_editor()}/>
                    </AutoStack>
                })()}</Box>
            </KeyEventManager>
        </EditorBackgroundPaper></ThemeProvider>
    }
}
