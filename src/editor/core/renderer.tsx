class Responder{
    name: string
    init: ()=>undefined
    states: { string: any }
    methods: { [method_name: string]: ()=>string }

    constructor(name: string , init: ()=>undefined, states: { string: any}, methods: { string: ()=>string }){
        this.name = name
        this.init = init
        this.states = states
        this.methods = methods
    }
}
export {}
