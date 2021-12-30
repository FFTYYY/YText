/* 这个文件定义所有可能出现的Slate节点类型 */

import { NodeTransforms } from "slate/dist/transforms/node"
import { Node } from 'slate'

interface RendererProps{
    attributes: any , 
    children: any , 
    element: any , 
}

interface TextPrototype{
    text: string , 
}

interface ParagraphPrototype{
    type: string , 
    children: Node[] , 
}

interface GroupPrototype{
    type: string,
    precursor: GroupPrototype | undefined , 
    successor: GroupPrototype | undefined , 
    parameters: any , 
    typename: string , 
    children: Node[]
}

function text_prototype() :TextPrototype{
    return {
        text: "233" , 
    }
}

function paragraph_prototype() :ParagraphPrototype{
    return {
        type: "paragraph" , 
        children: [text_prototype()],
    }
}

function group_prototype(typename: string , parameters: any): GroupPrototype{
    return {        
        type: "group" , 
        precursor: undefined , 
        successor: undefined , 
        parameters: parameters , 
        typename: typename , 
        children: [paragraph_prototype()],
    }
}

export {text_prototype , paragraph_prototype , group_prototype}
export type { RendererProps }