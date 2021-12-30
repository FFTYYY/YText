import {abstract_prototype} from "../meta"

class AbstructType{
    name: string
    parameter_prototype: any
    renderer: (props: any)=>any
    proto: any
    
    constructor(name: string , parameter_prototype: any , renderer: (props: any)=>any){
        this.name = name
        this.parameter_prototype = parameter_prototype
        this.renderer = renderer

        this.proto = abstract_prototype(this.name , this.parameter_prototype)
    }

    make_node(){
        return this.proto
    }

}

export default AbstructType