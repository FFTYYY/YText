import { GroupNode , GroupPrototype , ParagraphPrototype} from "../core/elements"
import { GroupStyle , EditorCore} from "../core/editor/editorcore"
import type { Renderer_Func , Renderer_Props } from "../core/editor/editor_interface"
import { YEditor } from "../core/editor/editor_interface"
import { Transforms , Node, Editor } from "slate"
import { Node2Path } from "./utils"
import React, {useState} from "react"
export {theorem}
import {CaretDownOutlined,} from '@ant-design/icons'
import { DownOutlined } from '@ant-design/icons'
import {non_selectable_prop} from "../core/meta"
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import CardHeader from '@mui/material/CardHeader';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import {DefaultNewHidden , DefaultHiddenEditor , DefaultHidden} from "./hidden"

interface DefaultParameterContainer_Props{
    initval: any
    onUpdate: (parameters: any) => void
}

/* 这个类定义一个组件，作为默认的参数更新器 */
class DefaultParameterContainer extends React.Component<DefaultParameterContainer_Props>{
    onUpdate: (parameters: any) => void

    constructor(props: DefaultParameterContainer_Props){
        super(props)

        this.state = {
            parameters: this.props.initval
        }

        this.onUpdate = props.onUpdate
    }

    renderString(props: {name: string, val: string, onChange: (newval:string)=>void}){
        return <TextField 
            defaultValue={props.val} 
            onBlur={e=>props.onChange(e.target.value)}
            label={props.name}
            variant="standard"
        ></TextField>
    }

    renderDict(props: {name: string, val:object, onChange: (newval:object)=>void}){
        let newval = {}
        Object.assign(newval , props.val)

        let RS = this.renderString.bind(this)
        let RO = this.renderDict.bind(this)

        return <Card key={props.name}>
            <CardHeader title={props.name} />
            {Object.keys(props.val).map(
                (subname)=>{
                    let subval = props.val[subname]

                    if(typeof subval === "string")
                    {
                        return <RS 
                            key={subname}
                            name={subname} 
                            val={subval} 
                            onChange={newsubval=>{
                                newval[subname] = newsubval
                                props.onChange(newval)
                            }} 
                        />               
                    }

                    return <RO 
                        key={subname}
                        name={subname} 
                        val={subval} 
                        onChange={newsubval=>{
                            newval[subname] = newsubval
                            props.onChange(newval)
                        }} 
                    />            
        }
        )}</Card>

    }

    render(){
        let R = this.renderDict.bind(this)
        let me = this

        return <R
            name="Parameters"
            val={me.state.parameters}
            onChange={newval=>{
                me.setState({parameters:newval})
                me.onUpdate(newval)
            }}
        ></R>
    }
}

// 这是一个默认的Parameter容器组件，和特定的节点关联，会自动修改对应节点的属性
function DefaultParameterContainer_withElement(props: {editor: YEditor, element: Node}){
    return <DefaultParameterContainer 
        initval={props.element.parameters} 
        onUpdate={val=>Transforms.setNodes(
            props.editor.slate , 
            { parameters:val },
            { match: n=> n.hasOwnProperty("nodekey") && n.nodekey==props.element.nodekey }
        ) }
    />
}

function theorem(editor: YEditor, name:string = "theorem"): [GroupStyle,Renderer_Func]{
    let style = new GroupStyle(name , {
        "words": "Theorem" , 
        "test1": "haha" , 
        "test2": {
            "oo": "as" , 
            "ss": "ass" , 
        }
    })


    let renderer = (props: Renderer_Props) => <Card {...props.attributes}><Grid container>
        <Grid item xs={11} key="left-part" ><span {...non_selectable_prop}>{props.element.parameters.words}</span>{props.children}</Grid>
        <Grid item xs={1}  key="right-part"><div {...non_selectable_prop}>
            <DefaultParameterContainer_withElement editor={editor} element={props.element} />
            <DefaultHidden editor={editor} element={props.element}/>
        </div></Grid>
    </Grid></Card>
    
    return [style , renderer]
}