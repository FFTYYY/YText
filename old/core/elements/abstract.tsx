import {abstract_prototype} from "../meta"

class AbstructType{
    name: string
    parameter_prototype: any
    renderer: (props: any)=>any
    proto: any
    is_inline: boolean
    
    constructor(name: string , parameter_prototype: any , is_inline:boolean , renderer: (props: any)=>any){
        this.name = name
        this.parameter_prototype = parameter_prototype
        this.renderer = renderer
        this.is_inline = is_inline

        let flags = new Set<string>()
        if(this.is_inline)
            flags.add("inline")

        this.proto = abstract_prototype(this.name , this.parameter_prototype , flags)
    }

    make_node(){
        return this.proto
    }

}

export default AbstructType