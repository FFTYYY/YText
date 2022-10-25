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

import { EditorBackgroundPaper , EditorComponentEditingBox } from "./uibase"

export { DefaultEditorComponent }

// TODO 完善无鼠标操作。

/** 这个对象定义默认的按钮栏的无鼠标操作的各种操作。 
 * 约定：所有位置用 JSON.stringify([number, number]) 表示，其中前一个表示行（0/1/2/3=组/行内/支持/结构），后一个表示第几个对象。
*/
let default_buttonbar_mouseless = {
    typenames: ["group" , "inline" , "support" , "structure"] as ["group" , "inline" , "support" , "structure"] , 
    space: "q" , 

    register_position(typename: Exclude<AllConceptTypes, "abstract">, idx: number){
        let typeidx = default_buttonbar_mouseless.typenames.indexOf(typename)
        return JSON.stringify([typeidx, idx])
    } , 
    
    get_run(editor: EditorComponent<GroupNode>, typename: Exclude<AllConceptTypes, "abstract">, pos_y: number){
        return ()=>{
            let concept_names = Object.keys( editor.get_core().renderers[typename] )
            let concept_name = concept_names[pos_y]
            editor.new_concept_node(typename , concept_name)
        }
    } , 

    get_activate_position(){
        return (position_list: string[], cur_position: string): string | undefined => {
            if(cur_position != undefined){ // 如果之前已经选过值了，那就用之前的值。
                return cur_position
            }
            if(position_list.length == 0){
                return undefined
            }
            let positions = position_list.reduce((s,x)=>[...s, JSON.parse(x)], [])
            positions.sort((a: [number,number],b: [number,number])=>(a[0] == b[0]) ? (a[1] - b[1]) : (a[0] - b[0]))
            return JSON.stringify(positions[0]) // 最小的那个。
        }
    } , 

    /** 这个函数以editor为参数，返回改变位置的函数。 */
    get_switch_position(editor: EditorComponent<GroupNode | AbstractNode>){
        if(editor == undefined){
            return ()=>undefined
        }
        return (position_list: string[], cur_position: string, direction: DirectionKey) => {
            if(cur_position == undefined){ // 如果都没有选中过位置，那就用最小的。
                 return default_buttonbar_mouseless.get_activate_position()(position_list, cur_position)
            }
            let xmax = default_buttonbar_mouseless.typenames.length
    
            let [pos_x , pos_y]: [number , number] = JSON.parse(cur_position)
            if(direction == "ArrowUp"){
                pos_x --
            }
            else if(direction  == "ArrowDown"){
                pos_x ++
            }
            pos_x = ((pos_x % xmax) + xmax) % xmax
            
            let typename = default_buttonbar_mouseless.typenames[pos_x]
            let ymax = Object.keys( editor.get_core().renderers[typename] ).length // TODO renderers?
            if(direction == "ArrowLeft"){
                pos_y --
            }
            else if(direction  == "ArrowRight"){
                pos_y ++ 
            }
            pos_y = ((pos_y % ymax) + ymax) % ymax

            return JSON.stringify([pos_x, pos_y])
        }
    } , 
}


interface DefaultButtonbarProps<RootType extends AbstractNode | GroupNode>{
    editor: EditorComponent<RootType>
}
/** 这个组件是编辑器的右边工具栏的组件按钮部分。 */
class DefaultButtonbar<RootType extends AbstractNode | GroupNode> extends React.Component<DefaultButtonbarProps<RootType>>{
    constructor(props: DefaultButtonbarProps<RootType>){
        super(props)
    }

    get_editor(){
        return this.props.editor
    }
    
    render(){
        let icons = {
            group: CalendarViewDayIcon , 
            inline: CloseFullscreenIcon , 
            support: CoffeeIcon , 
            structure: QrCodeIcon , 
        }

        let me = this

        return <React.Fragment>
            {["group" , "inline" , "support" , "structure"].map ( (typename: Exclude<AllConceptTypes , "abstract">)=>{
                let Icon = icons[typename]
                return <React.Fragment key={typename}>
                    <AutoStackedPopperWithButton
                        poper_props = {{
                            stacker: AutoStackButtons ,
                            component: styled(Paper)({backgroundColor: "#aabbddbb" , }) ,  
                        }}
                        button_class = {IconButton}
                        button_props = {{
                            children: <Icon /> , 
                        }}
                        title = {typename}
                    >{
                        Object.keys( this.get_editor().get_core().renderers[typename] ).map( (stylename , idx) => 
                            <MouselessElement 
                                key = {idx}
                                space = {default_buttonbar_mouseless.space}
                                position = {default_buttonbar_mouseless.register_position(typename, idx)}
                                run = {default_buttonbar_mouseless.get_run(me.get_editor() as EditorComponent<GroupNode>, typename, idx)}
                            >
                                <Button 
                                    onClick = {e => me.get_editor().new_concept_node(typename , stylename)}
                                    variant = "text"
                                >
                                    {stylename}
                                </Button>
                                <Divider orientation="vertical" flexItem/>
                            </MouselessElement>
                        )
                    }</AutoStackedPopperWithButton>
                </React.Fragment>
            })}
        </React.Fragment>
    }
}


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
    buttonbar_ref	: React.RefObject<DefaultButtonbar<RootType>>

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
        this.buttonbar_ref = React.createRef<DefaultButtonbar<RootType>>()
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
                    {
                        key: default_buttonbar_mouseless.space , 
                        activate_position: default_buttonbar_mouseless.get_activate_position() , 
                        switch_position: default_buttonbar_mouseless.get_switch_position(me.get_editor()) , 
                    }
                ]}
                non_space_oprations = {[]}
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
                        <DefaultButtonbar editor={me.get_editor()} ref={me.buttonbar_ref}/>
                    </AutoStack>
                })()}</Box>
            </KeyEventManager>
        </EditorBackgroundPaper></ThemeProvider>
    }
}
