import type { BaseNode , TextNode , ParagraphNode , GroupNode , StructNode , SupportNode , AbstractNode } from "../elements"
import { TextPrototype , ParagraphPrototype , GroupPrototype , StructPrototype , SupportPrototype } from "../elements"

export {EditorCore , TextStyle , GroupStyle , StructStyle , SupportStyle , HiddenStyle}

class EditorCore{
    textstyles   : { [sty: string] : TextStyle    }
    groupstyles  : { [sty: string] : GroupStyle   }
    structstyles : { [sty: string] : StructStyle  }
    supportstyles: { [sty: string] : SupportStyle }
    hiddenstyles : { [sty: string] : HiddenStyle }
    root: GroupNode

    constructor(
        textstyles      : TextStyle     [] = [], 
        groupstyles     : GroupStyle    [] = [], 
        structstyles    : StructStyle   [] = [], 
        supportstyles   : SupportStyle  [] = [] ,
        hiddenstyles    : HiddenStyle   [] = [] , 
    ){
        this.textstyles    = {}
        this.groupstyles   = {}
        this.structstyles  = {}
        this.supportstyles = {}
        this.hiddenstyles  = {}

        for(let style of textstyles)
            this.add_textstyle(style)
        for(let style of groupstyles)
            this.add_groupstyle(style)
        for(let style of structstyles)
            this.add_structstyle(style)
        for(let style of supportstyles)
            this.add_supportstyle(style)
        for(let style of hiddenstyles)
            this.add_hiddenstyle(style)

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
    add_hiddenstyle(style: HiddenStyle){
        this.hiddenstyles[style.name] = style
    }
}

class Style{
    name: string
    parameter_prototype: any
    prototype_generator: ()=>BaseNode

    constructor(name: string, parameter_prototype: any, prototype_generator: ()=>BaseNode){
        this.name = name
        this.parameter_prototype = parameter_prototype
        this.prototype_generator = prototype_generator
    }

    makenode(){
        return this.prototype_generator()
    }

    update_prototype(prototype_generator:()=>BaseNode){
        this.prototype_generator = prototype_generator
    }

}

class TextStyle extends Style{
    declare prototype: ()=>TextNode

    constructor(name: string , parameter_prototype: any){

        let prototype = ()=>{
            let p = TextPrototype()
            p.name = name
            p.parameters = parameter_prototype
            return p
        }

        super(name, parameter_prototype, prototype)
    }

}

class GroupStyle extends Style{
    declare prototype: ()=>GroupNode

    constructor(name: string , parameter_prototype: any){

        let prototype = ()=>GroupPrototype(name , parameter_prototype)

        super(name, parameter_prototype, prototype)
    }

}

class StructStyle extends Style{
    declare prototype: ()=>StructNode

    constructor(name: string , parameter_prototype: any){

        let prototype = () => StructPrototype(name , parameter_prototype)

        super(name, parameter_prototype, prototype)
    }

}

class SupportStyle extends Style{
    declare prototype: ()=>SupportNode

    constructor(name: string , parameter_prototype: any){

        let prototype = ()=>SupportPrototype(name , parameter_prototype)

        super(name, parameter_prototype, prototype)
    }

}

class HiddenStyle extends Style{
    declare prototype: ()=>AbstractNode

    constructor(name: string , parameter_prototype: any){

        super(name, parameter_prototype, ()=>undefined)
    }

    makehidden(){
        return {
            hidden: GroupPrototype("hidden_root" , this.parameter_prototype) , 
        }
    }
}
