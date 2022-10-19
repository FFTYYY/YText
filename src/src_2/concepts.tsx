import {
	Printer ,
	PrinterComponent ,
	FirstClassConcept , 
	SecondClassConcept ,  
} from "../../lib"

export {
    first_concepts , 
    second_concepts ,
}

let theorem = new FirstClassConcept({
    type: "group" , 
    name: "theorem" , 
    parameterPrototype: {
        name: {
            type: "string" , 
            val: "theorem"  , 
        }, 
        alias: {
            type: "string" , 
            val: ""
        }
    } , 
})

let strong = new FirstClassConcept({
    type: "inline" , 
    name: "strong" , 
})

let sec_theorem = new SecondClassConcept({
    type: "group" , 
    firstConcept: "theorem" , 
    name: "theorem" , 
    defaultOverride: {
        alias_name: {
            type: "string" , 
            val: ""
        }
    },
    fixedIverride: {
        alias:{
            type: "function" , 
            val: "p=>p.alias_name.val ? `(${p.alias_name.val})` : ``" , 
        } , 
        name: {
            type: "string" , 
            val: "Theorem"
        }
    }
})

let sec_strong = new SecondClassConcept({
    type: "inline" , 
    firstConcept: "strong" , 
    name: "stronger" , 
})

let comment = new FirstClassConcept({
    type: "abstract" , 
    name: "comment" , 
    parameterPrototype: {
        suffix: {
            type: "string" , 
            val: ""  , 
        }, 
    } , 
})

let sec_comment = new SecondClassConcept({
    type: "abstract" , 
    firstConcept: "comment" , 
    name: "comment" , 
    fixedIverride:{
        suffix: {
            type: "string" , 
            val: "haha"  , 
        }, 
    } , 
})



let first_concepts = [theorem , strong , comment]
let second_concepts = [sec_theorem , sec_strong , sec_comment]
