/*
    这个文件定义Slate的「Group」元素
*/

import {text_prototype , paragraph_prototype , group_prototype} from "../meta"

class GroupType{
    name: string
    allow_precursors: string[]
    allow_successors: string[]
    parameter_prototype: any
    renderer: (props: any)=>any
    proto: any
    
    constructor(name: string , allow_precursors: string[] , allow_successors: string[] , parameter_prototype: any , renderer: (props: any)=>any){
        this.name = name
        this.allow_precursors = allow_precursors
        this.allow_successors = allow_precursors
        this.parameter_prototype = parameter_prototype
        this.renderer = renderer

        this.proto = group_prototype(this.name , this.parameter_prototype)
    }

    make_node(){
        return this.proto
    }
}

export default GroupType