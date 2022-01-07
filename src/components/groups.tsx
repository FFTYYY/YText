import { GroupNode , GroupPrototype , ParagraphPrototype} from "../core/elements"
import { GroupStyle , EditorCore} from "../core/editor/editorcore"
import type { Renderer_Func , Renderer_Props } from "../core/editor/editor_interface"
import { YEditor } from "../core/editor/editor_interface"
import { Button } from "antd"
import { Transforms , Node } from "slate"
import { Node2Path } from "./utils"
import { Card } from "antd"
import React from "react"
import { Menu, Dropdown } from 'antd'
import { Row, Col } from 'antd';
export {theorem}
import {CaretDownOutlined,} from '@ant-design/icons';
import { DownOutlined } from '@ant-design/icons';
import {non_selectable_prop} from "../core/meta"
import { Input } from 'antd';

function theorem(editor: YEditor, name:string = "theorem"): [GroupStyle,Renderer_Func]{
    let style = new GroupStyle(name , {
        "words": "Theorem"
    })

    function getMenu(element){
        console.log(element.parameters.words)
        return <Menu onClick={e=>{console.log(e)}}>
            <Menu.Item key={1}>
                <Input 
                    placeholder="words" 
                    defaultValue={element.parameters.words} 
                    onChange={e=>{
                        let new_parameters = {}
                        Object.assign(new_parameters , element.parameters)
                        new_parameters.words = e.target.value
                        Transforms.setNodes(
                            editor.slate , 
                            { parameters:new_parameters },
                            { match: n=>n===element }
                        )                
                    }}
                    onClick = {e=>{
                        e.stopPropagation()    
                    }}
                />
            </Menu.Item>
        </Menu>
    }

    let renderer = (props: Renderer_Props) => <div {...props.attributes}><Card><Row>
        <Col span={20}><span {...non_selectable_prop}>{props.element.parameters.words}</span>{props.children}</Col>
        <Col span={4} {...non_selectable_prop}>    
            <Dropdown overlay={getMenu(props.element)}>
                <CaretDownOutlined/>
            </Dropdown>
        </Col>
    </Row></Card></div>
    

    return [style , renderer]
}