/** 
 * 这个模块定义编辑器的渲染器。
 * 和印刷器不一样，编辑器没有预处理节点，因此每个渲染器只是一个渲染函数。
 * @module
 */

import React from "react"

import {
    Node , 
} from "../core"

export type {EditorRendererProps , EditorRenderer}

/** 编辑器的渲染器接收的的props */
interface EditorRendererProps<NodeType extends Node>{
    node: NodeType
    children: React.ReactElement
}

/** 编辑器的渲染器。 */
type EditorRenderer<NodeType extends Node = Node> = (props: EditorRendererProps<NodeType>)=>React.ReactElement

