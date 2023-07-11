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
    Button , 
    Box , 
    Paper ,
    Divider , 
    Popover , 
} from "@mui/material"

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
    GlobalInfoProvider, 
} from "../core"

import { 
    DefaultParameterEditButton , 
    AutoStackedPopperWithButton , 
    DefaultRootParameterEditButton , 
} from "./buttons"
import { 
    AutoStack , 
    AutoTooltip , 
    AutoStackedPopper , 
    AutoStackButtons , 
} from "../uibase"
import {
    object_foreach , 
    merge_object ,

} from "../core/utils"

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
    ScrollBarBox , 
} from "../uibase"

import {
    set_normalize_status , 
    get_normalize_status , 
} from "../editor/plugins"
import {
    slate_is_concept , 
} from "../editor/utils"

import {
    DefaultSidebar , 
    get_mouseless_space as sidebar_get_mouseless_space , 
} from "./sidebar"
import {
    get_mouseless_space as buttons_get_mouseless_space
} from "./buttons"
import {
    ThemeProvider , 
    Theme , 
    default_theme , 
} from "../core/theme"

export { DefaultEditorComponent }


type DefaultEditorComponentprops = EditorComponentProps & {
    theme?: Theme
    extra_buttons?: any
    onSave?: ()=>void // 保存时操作。

    sidebar_extra?: (editor: EditorComponent)=>{
        button: React.ReactElement
        run: ()=>void
    }[]
}

/** 
 * 这个组件提供一个开箱即用的默认编辑器组件。
 */
class DefaultEditorComponent extends React.Component <DefaultEditorComponentprops, {
    idx_conflicts: [number, number[][]][] // 节点idx冲突
}> {    
    onUpdate: (newval: Node[]) => void
    onFocusChange: ()=>void
    onSave: ()=> void

    editor_ref		: React.RefObject<EditorComponent>

    constructor(props: DefaultEditorComponentprops) {
        super(props)


        this.onUpdate = props.onUpdate || ((newval: Node[])=>{})
        this.onFocusChange  = props.onFocusChange || (()=>{})
        this.onSave = props.onSave || (()=>{})

        this.editor_ref = React.createRef<EditorComponent>()

        this.state = {
            idx_conflicts: [] , 
        }
    }


    get_editor(){
        if(this.editor_ref && this.editor_ref.current)
            return this.editor_ref.current
        return undefined
    }

    get_root(): AbstractNode | undefined{
        return this.get_editor()?.get_root()
    }
    append_idx_conflict(conflicts: [number, number[][]][]){
        this.setState({idx_conflicts: [...this.state.idx_conflicts, ...conflicts]})
    }

    IdxConflitSolver(props: {}){
        let me = this
        let editor = me.get_editor()
        if(editor == undefined){ // 等待editor创建完毕
            return <></>
        }
        let slate = editor.get_slate()
        let conflicts = this.state.idx_conflicts

        /**
         * 解决一个`idx`冲突。
         * 如果`keep`是`undefined`，则重写所有人的`idx`。如果`keep`是一个`path`，则
         * 保留这个`path`指向的节点的`idx`，重写其他节点的`idx`。如果`keep = "fuck"`，那么就跳过这个冲突。
         * @param keep 要如何解决冲突。
         * @returns 
         */
        function _solve(keep: number[] | undefined | string = undefined){
            if(conflicts.length <= 0){
                return
            }
            let new_conf = [...me.state.idx_conflicts]
            let confitem = new_conf.shift()
            if(keep != "fuck"){
                for(let path of confitem[1]){
                    if(keep && JSON.stringify(path) == JSON.stringify(keep)){ // 或许用下标比较更好？
                        continue
                    }
                    editor.set_node_by_path(path,{idx: Math.floor(Math.random()*233333333 + 2333333)})
                }    
            }
            me.setState({idx_conflicts: new_conf})
        }

        return <React.Fragment>
            <Popover
                sx={{
                    left: "30%",
                    top: "20%",
                    minWidth: "20rem" , 
                    minHeight: "30rem" , 
                }}
                PaperProps = {{
                    sx:{
                        paddingX: "1rem",
                        paddingY: "1rem" , 
                        minWidth: "40vw" , 
                        backgroundColor: "rgba(160,60,90,0.90)" , 
                        color: "white" , 
                    },
                }}
                
                open = {conflicts.length > 0}
                anchorReference="none"
                onClose={()=>{}}
            >
                <p>以下组件编号冲突，请选择要保留谁的编号。目前还有{conflicts.length}个冲突</p>
                {conflicts.length > 0 ? conflicts[0][1].map((path, key)=>{
                    return <div key = {key} style={{
                        
                        marginTop: "1rem" , 
                        marginBottom: "1rem" , 
                        display: "flex" , 
                    }}>
                        <div style={{
                            border: "1px solid white" ,
                            marginRight: "1rem" , 
                            paddingLeft: "0.5rem" , 
                            paddingRight: "0.5rem" , 
                        }}>
                            <p>位置：{JSON.stringify(path)}</p>
                            <p>内容：</p>
                            <p style={{paddingLeft: "2rem"}}>{Slate.Node.string(Slate.Node.get(slate, path))}</p>
                        </div>
                        <div style={{marginTop: "auto", marginBottom: "auto"}}>
                            <Button sx={{color:"white", borderColor: "white"}} variant="outlined" onClick={()=>{
                                _solve(path)
                            }}>保留这个</Button>
                        </div>
                    </div>
                }) : <></>}
                <Button sx={{color:"white", borderColor: "white", marginRight: "1rem"}} variant="outlined" onClick={()=>{
                    _solve()
                }}>你看着办</Button>
                <Button sx={{color:"white", borderColor: "white", marginRight: "1rem"}} variant="outlined" onClick={()=>{
                    _solve("fuck")
                }}>当不存在</Button>
            </Popover>
        </React.Fragment>
    }

    check_idx(){
        console.log()
        if(!get_normalize_status("pasting")){ // 如果没有在粘贴，就直接退出。
            return 
        }

        let me = this
        let editor = me.get_editor()
        let slate = editor.get_slate()
        let idx_paths: {[key: number]: number[][]} = {}
        for(let [node,path] of Slate.Node.descendants(slate)){
            if(!slate_is_concept(node)){
                continue
            }
            if(idx_paths[node.idx] == undefined){
                idx_paths[node.idx] = []
            }
            idx_paths[node.idx].push(path)
        }

        let conflicts = []
        for(let idx in idx_paths){
            if(idx_paths[idx].length > 1){
                conflicts.push([idx, idx_paths[idx]])
            }
        }
        if(conflicts.length > 0){
            me.append_idx_conflict( conflicts )
        }
        set_normalize_status({pasting: false})
    }


    componentDidMount(): void {
        let me = this

        while(!this.get_editor()); // 确保editor存在
        
        this.forceUpdate()

        setInterval(this.check_idx.bind(this), 1000) // 1s检查一次idx
    }

    render() {
    
        let paper_widths  = {xs: "87%" , md: "90%" , xl: "93%"} // 纸张的宽度，
        let paper_right   = {xs: "89%" , md: "92%" , xl: "95%"} // 纸张的宽度，
        let toolbar_width = {xs: "10%" , md: "7%" , xl: "5%"} // 工具栏的宽度。

        let theme = merge_object(default_theme , this.props.theme)

        let me = this

        let IdxConflitSolver = this.IdxConflitSolver.bind(this)
        return <GlobalInfoProvider value={{theme: theme}}><ThemeProvider value={theme}><EditorBackgroundPaper>
            <IdxConflitSolver />
            <KeyEventManager
                spaces = {[
                    sidebar_get_mouseless_space(me.get_editor()) , 
                    buttons_get_mouseless_space(me.get_editor()) , 
                ]}
                non_space_oprations = {[
                    {
                        key: "s" , 
                        on_activate: ()=>{me.onSave()}
                    }
                ]}
            >
                <ScrollBarBox key="area-1" sx = {{ 
                    position: "absolute" , 
                    top: "1%" , 
                    height: "98%", 
                    paddingRight: "1%" , 
                    width: paper_widths, 
                    overflow: "auto" , 
                }}>
                    <EditorComponentEditingBox>
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
                                
                                onKeyDown           = {onkeydown}
                                onKeyUp             = {onkeyup}
                            />
                        }}
                        </KeyDownUpFunctionProxy.Consumer>
                    </EditorComponentEditingBox>
                </ScrollBarBox>

                <Box key="area-2" sx = {{
                    position: "absolute", 
                    top: "1%" , 
                    height: "99%", 
                    left: paper_right, 
                    width: toolbar_width
                }}>{(()=>{
                    let editor = me.get_editor()
                    let root = me.get_root()
                    if(!(editor && root)){
                        return <></>
                    }
                    return <AutoStack force_direction="column">
                        <DefaultRootParameterEditButton root={root} editor={editor}/>
                        <Divider />
                        <DefaultSidebar 
                            editor = {me.get_editor()}
                            extra = {me.props.sidebar_extra}
                        />
                        {me.props.extra_buttons?.length > 0 ? <Divider /> : <></>}
                        {me.props.extra_buttons}
                    </AutoStack>
                })()}</Box>
            </KeyEventManager>
        </EditorBackgroundPaper></ThemeProvider></GlobalInfoProvider>
    }
}
