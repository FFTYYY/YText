/* 这个文件定义所有节点。
*/

import { Node , BaseElement  } from 'slate'

export {
    TextPrototype , 
    ParagraphPrototype , 
    GroupPrototype , 
    StructPrototype , 
    SupportPrototype , 
}
export type {
    BaseNode , 
    TextNode , 
    ParagraphNode , 
    GroupNode , 
    StructNode , 
    SupportNode , 
}

export type { NodeType , GroupRelationType }

// 所有可能的节点类型
type NodeType = "text" | "paragraph" | "group" | "struct" | "support"

// 所有可能的段组连接方式
type GroupRelationType = "chaining" | "separating"

interface BaseNode{
    type: NodeType
    hidden?: BaseNode[]    
    hidden_parameters?: any
}

interface TextNode extends BaseNode{
    text: string
    name?: string
    parameters?: string // 文本节点可以有parameters，因为文本节点可以有样式
}

// 注意段落节点则没有样式，因为所有段落样式都由group定义
interface ParagraphNode extends BaseNode{
    children: TextNode[]
}

interface GroupNode extends BaseNode{
    name: string
    parameters: string
    relation: GroupRelationType
    children: ParagraphNode[] | GroupNode[] | StructNode[]
}

interface StructNode extends BaseNode{
    name: string
    parameters: string
    children: GroupNode[] | StructNode[]
}

interface SupportNode extends BaseNode{
    name: string
    parameters: string
}

function TextPrototype(text: string = ""): TextNode{
    return {
        type: "text" , 
        text: text , 
    }
}

function ParagraphPrototype(): ParagraphNode{
    return {
        type: "paragraph" , 
        children: [] , 
    }
}

function GroupPrototype(name: string , parameter_proto: any): GroupNode{
    return {
        type: "group" , 
        name: name , 

        parameters: parameter_proto , 
        relation: "separating" , 

        children: [] , 
    }
}

function StructPrototype(name: string , parameter_proto: any): StructNode{
    return {
        type: "struct" , 
        name: name , 

        parameters: parameter_proto , 

        children: [] , 
    }
}

function SupportPrototype(name: string , parameter_proto: any): SupportNode{
    return {
        type: "support" , 
        name: name , 
        parameters: parameter_proto , 
    }
}

