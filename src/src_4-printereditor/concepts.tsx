import {
	Printer ,
	PrinterComponent ,
	FirstClassConcept , 
	SecondClassConcept ,  
} from "../../libprinter"

export {
    first_concepts , 
    second_concepts ,
}

let theorem = new FirstClassConcept({
    type: "group" , 
    name: "theorem" , 
    parameter_prototype: {
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
    first_concept: "theorem" , 
    name: "theoremer" , 
    default_override: {
        alias_name: {
            type: "string" , 
            val: ""
        }
    },
    fixed_override: {
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
    first_concept: "strong" , 
    name: "stronger" , 
})

let comment = new FirstClassConcept({
    type: "abstract" , 
    name: "comment" , 
    parameter_prototype: {
        suffix: {
            type: "string" , 
            val: ""  , 
        }, 
    } , 
})

let sec_comment = new SecondClassConcept({
    type: "abstract" , 
    first_concept: "comment" , 
    name: "comment" , 
    fixed_override:{
        suffix: {
            type: "string" , 
            val: "haha"  , 
        }, 
    } , 
})

let line = new FirstClassConcept({
    type: "structure" , 
    name: "line" , 
    parameter_prototype: {
        widths: {
            type: "string" , 
            val: ""
        }
    } , 
})

let sec_line = new SecondClassConcept({
    type: "structure" ,  
    first_concept: "line" , 
    name: "line" , 
    default_override: {
        widths: {
            type: "string" , 
            val: ""
        }
    } , 
})


let first_concepts = [theorem , strong , comment , line]
let second_concepts = [sec_theorem , sec_strong , sec_comment ,  sec_line]
