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
    AbstractNode , 
}

export type { NodeType , GroupRelationType }

// 所有可能的节点类型
type NodeType = "text" | "paragraph" | "group" | "struct" | "support"

// 所有可能的段组连接方式
type GroupRelationType = "chaining" | "separating"

interface _BaseNode{
    nodekey: number
    type?: NodeType         // 没有type默认为Text
    hidden?: BaseNode[]    
    hidden_parameters?: any
}
type BaseNode = _BaseNode & Node

interface _TextNode extends _BaseNode{
    text: string
    name?: string
    parameters?: string // 文本节点可以有parameters，因为文本节点可以有样式
}
type TextNode = _TextNode & Node

// 注意段落节点则没有样式，因为所有段落样式都由group定义
interface _ParagraphNode extends _BaseNode{
    children: TextNode[]
}
type ParagraphNode = _ParagraphNode & Node

interface _GroupNode extends _BaseNode{
    name: string
    parameters: string
    relation: GroupRelationType
    children: BaseNode[]
}
type GroupNode = _GroupNode & Node

interface _StructNode extends _BaseNode{
    name: string
    parameters: string
    children: BaseNode[]
}
type StructNode = _StructNode & Node

interface _SupportNode extends _BaseNode{
    name: string
    parameters: string
}
type SupportNode = _SupportNode & Node

interface AbstractNode{
    hidden: Node[]
    abstract_parameters: string
}

var key_count = 0
function genekey(){
    return key_count ++
}

function TextPrototype(text: string = ""): TextNode{
    return {
        nodekey: genekey() , 
        type: "text" , 
        text: text , 
    }
}

function ParagraphPrototype(): ParagraphNode{
    return {
        nodekey: genekey() , 
        type: "paragraph" , 
        children: [TextPrototype("")] , 
    }
}

function GroupPrototype(name: string , parameter_proto: any): GroupNode{
    return {
        nodekey: genekey() , 
        type: "group" , 
        name: name , 

        parameters: parameter_proto , 
        relation: "separating" , 

        children: [ParagraphPrototype()] , 
    }
}

function StructPrototype(name: string , parameter_proto: any): StructNode{
    return {
        nodekey: genekey() , 
        type: "struct" , 
        name: name , 

        parameters: parameter_proto , 

        children: [] , 
    }
}

function SupportPrototype(name: string , parameter_proto: any): SupportNode{
    return {
        nodekey: genekey() , 
        type: "support" , 
        name: name , 
        parameters: parameter_proto , 
        children: [],
    }
}

