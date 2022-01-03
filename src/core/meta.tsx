/* 
    这个文件定义所有可能出现的Slate节点类型，以及常用接口。
*/

import { NodeTransforms } from "slate/dist/transforms/node"
import { Node } from 'slate'

interface RendererProps{
    attributes: any
    children: any
    element: any
}

interface TextPrototype{
    text: string
}

interface ParagraphPrototype{
    type: string
    children: Node[]
}

interface GroupPrototype{
    type: string
    precursor: GroupPrototype | undefined
    successor: GroupPrototype | undefined
    parameters: any
    groupname: string
    children: Node[]
}

interface AbstractPrototype{
    type: string
    parameters: any
    abstractname: string
    hidden: Node[] 
    children: Node[]
}

function text_prototype() :TextPrototype{
    return {
        text: "233" , 
    }
}

function paragraph_prototype() :ParagraphPrototype{
    return {
        special: false , 
        type: "paragraph" , 
        children: [text_prototype()],
    }
}

function group_prototype(groupname: string , parameters: any): GroupPrototype{
    return {
        special: true , 
        type: "group" , 
        precursor: undefined , 
        successor: undefined , 
        parameters: parameters , 
        groupname: groupname , 
        children: [paragraph_prototype()],
    }
}

function abstract_prototype(abstractname: string , parameters: any): AbstractPrototype{
    return {        
        special: true , 
        type: "abstract" , 
        abstractname: abstractname , 
        parameters: parameters , 
        hidden: [paragraph_prototype()] , // 下层子节点
        children: [paragraph_prototype()], // 同层子节点
    }
}

export {text_prototype , paragraph_prototype , group_prototype , abstract_prototype}
export type { RendererProps }