/* 
    这个文件定义所有可能出现的Slate节点类型，以及常用接口。
*/

import { NodeTransforms } from "slate/dist/transforms/node"
import { Node } from 'slate'

interface TextPrototype{
    flags: {}
    text: string
}

interface ParagraphPrototype{
    flags: {}
    type: string
    children: Node[]
}

interface GroupPrototype{
    flags: {}
    type: string
    precursor: GroupPrototype | undefined
    successor: GroupPrototype | undefined
    parameters: any
    groupname: string
    children: Node[]
}

interface AbstractPrototype{
    flags: {}
    type: string
    parameters: any
    abstractname: string
    children: Node[]
}
interface AbstractMiddlePrototype{
    flags: {}
    type: string
    children: Node[]
}

function text_prototype(flags: any[] = []) :TextPrototype{
    return {
        flags: flags,
        text: "233" , 
    }
}

function paragraph_prototype(flags: any[] = []) :ParagraphPrototype{
    return {
        flags: {} , 
        type: "paragraph" , 
        children: [text_prototype()],
    }
}

function group_prototype(groupname: string , parameters: any , flags: any[] = []): GroupPrototype{
    return {
        flags: {} , 
        type: "group" , 
        precursor: undefined , 
        successor: undefined , 
        parameters: parameters , 
        groupname: groupname , 
        children: [paragraph_prototype()],
    }
}

function abstract_middle_prototype(real: boolean , flags: any = []): AbstractMiddlePrototype{
    let f = real ? ["real"] : []
    f = f.concat(flags)
    return {
        flags: f, 
        type: "abstract-middle" , 
        children: [paragraph_prototype()] , 
    }
}

function abstract_prototype(abstractname: string , parameters: any , flags: {}): AbstractPrototype{
    return {
        flags: {} , 
        type: "abstract" , 
        abstractname: abstractname , 
        parameters: parameters , 
        children: [
            abstract_middle_prototype(true) , 
            abstract_middle_prototype(false) , 
        ],
    }
}

export {text_prototype , paragraph_prototype , group_prototype , abstract_prototype}
