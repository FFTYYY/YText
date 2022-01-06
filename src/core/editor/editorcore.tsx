import type { BaseNode , TextNode , ParagraphNode , GroupNode , StructNode , SupportNode } from "../elements"
import { TextPrototype , ParagraphPrototype , GroupPrototype , StructPrototype , SupportPrototype } from "../elements"

export {EditorCore , TextStyle , GroupStyle , StructStyle , SupportStyle}

class EditorCore{
    textstyles   : TextStyle[]
    groupstyles  : GroupStyle[]
    structstyles : StructStyle[]
    supportstyles: SupportStyle[]
    root: GroupNode

    constructor(textstyles: TextStyle[], groupstyles: GroupStyle[], structstyles: StructStyle[], supportstyles: SupportStyle[]){
        this.textstyles = textstyles
        this.groupstyles = groupstyles
        this.structstyles = structstyles
        this.supportstyles = supportstyles

        this.root = GroupPrototype("root" , {}) //节点树
    }
}

class Style{
    name: string
    parameter_prototype: any
    prototype: BaseNode

    constructor(name: string, parameter_prototype: any, prototype){
        this.name = name
        this.parameter_prototype = parameter_prototype
        this.prototype = prototype
    }

    makenode(){
        return this.prototype
    }

}

class TextStyle extends Style{
    declare prototype: TextNode

    constructor(name: string , parameter_prototype: any){

        let prototype = TextPrototype()
        prototype.name = name
        prototype.parameters = parameter_prototype

        super(name, parameter_prototype, prototype)
    }

}

class GroupStyle extends Style{
    declare prototype: GroupNode

    constructor(name: string , parameter_prototype: any){

        let prototype = TextPrototype()
        prototype.name = name
        prototype.parameters = parameter_prototype

        super(name, parameter_prototype, prototype)
    }

}

class StructStyle extends Style{
    declare prototype: StructNode

    constructor(name: string , parameter_prototype: any){

        let prototype = TextPrototype()
        prototype.name = name
        prototype.parameters = parameter_prototype

        super(name, parameter_prototype, prototype)
    }

}

class SupportStyle extends Style{
    declare prototype: SupportNode

    constructor(name: string , parameter_prototype: any){

        let prototype = TextPrototype()
        prototype.name = name
        prototype.parameters = parameter_prototype

        super(name, parameter_prototype, prototype)
    }

}

