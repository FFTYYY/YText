import type { BaseNode , TextNode , ParagraphNode , GroupNode , StructNode , SupportNode } from "../elements"
import { TextPrototype , ParagraphPrototype , GroupPrototype , StructPrototype , SupportPrototype } from "../elements"

export {EditorCore , TextStyle , GroupStyle , StructStyle , SupportStyle}

class EditorCore{
    textstyles   : { [sty: string] : TextStyle    }
    groupstyles  : { [sty: string] : GroupStyle   }
    structstyles : { [sty: string] : StructStyle  }
    supportstyles: { [sty: string] : SupportStyle }
    root: GroupNode

    constructor(textstyles: TextStyle[] = [], groupstyles: GroupStyle[] = [], structstyles: StructStyle[] = [], supportstyles: SupportStyle[] = []){
        this.textstyles    = {}
        this.groupstyles   = {}
        this.structstyles  = {}
        this.supportstyles = {}

        for(let style of textstyles)
            this.add_textstyle(style)
        for(let style of groupstyles)
            this.add_groupstyle(style)
        for(let style of structstyles)
            this.add_structstyle(style)
        for(let style of supportstyles)
            this.add_supportstyle(style)

        this.root = GroupPrototype("root" , {}) //节点树
    }

    add_textstyle(style: TextStyle){
        this.textstyles[style.name] = style
    }

    add_groupstyle(style: GroupStyle){
        this.groupstyles[style.name] = style
    }

    add_structstyle(style: StructStyle){
        this.structstyles[style.name] = style
    }

    add_supportstyle(style: SupportStyle){
        this.supportstyles[style.name] = style
    }
}

class Style{
    name: string
    parameter_prototype: any
    prototype: BaseNode

    constructor(name: string, parameter_prototype: any, prototype: BaseNode){
        this.name = name
        this.parameter_prototype = parameter_prototype
        this.prototype = prototype
    }

    makenode(){
        return this.prototype
    }

    update_prototype(new_proto:any){
        Object.assign(this.prototype , new_proto)
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

        let prototype = GroupPrototype(name,parameter_prototype)
        prototype.name = name
        prototype.parameters = parameter_prototype

        super(name, parameter_prototype, prototype)
    }

}

class StructStyle extends Style{
    declare prototype: StructNode

    constructor(name: string , parameter_prototype: any){

        let prototype = StructPrototype(name , parameter_prototype)
        prototype.name = name
        prototype.parameters = parameter_prototype

        super(name, parameter_prototype, prototype)
    }

}

class SupportStyle extends Style{
    declare prototype: SupportNode

    constructor(name: string , parameter_prototype: any){

        let prototype = SuportPrototype(name , parameter_prototype)
        prototype.name = name
        prototype.parameters = parameter_prototype

        super(name, parameter_prototype, prototype)
    }

}

