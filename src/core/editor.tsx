import type { BaseNode , TextNode , ParagraphNode , GroupNode , StructNode , SupportNode } from "./elements"
import { TextPrototype , ParagraphPrototype , GroupPrototype , StructPrototype , SupportPrototype } from "./elements"
class Editor{
    textstyles: TextStyle[]

    constructor(){
        this
    }
}

class TextStyle{
    name: string
    parameter_prototype: any
    prototype: TextNode

    constructor(name: string , parameter_prototype: any){
        this.name = name
        this.parameter_prototype = parameter_prototype

        this.prototype = TextPrototype()
        this.prototype.name = name
        this.prototype.parameters = parameter_prototype
    }

    makenode(){
        return this.prototype
    }
}

class GroupStyle{
    
}