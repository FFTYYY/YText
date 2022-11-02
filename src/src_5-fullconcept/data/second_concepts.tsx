import {
	Printer ,
	PrinterComponent ,
	FirstClassConcept , 
	SecondClassConcept ,  
    ParameterValue ,
    ParameterList , 
} from "../../../lib"
import  sec_ccpts_data from "./second_concepts.json"


export {second_concepts}

function second_concepts_from_json(infos: any){

    let ret: SecondClassConcept[] = []
    for(let x in infos){
        let info = infos[x]
        ret.push( new SecondClassConcept({
            name: x , 
            type: info.type , 
            first_concept: info.first , 
            default_override: info.default , 
            fixed_override: info.fixed , 
        }))
    }
    return ret
}

let second_concepts = second_concepts_from_json(sec_ccpts_data)