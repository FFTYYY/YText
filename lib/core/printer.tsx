/** 这个模块定义一个印刷器 
 * @module
*/

import React from "react"

import {
    FirstClassConcept , 
    SecondClassConcept , 
} from "./concept"
import {
    InlineNode , 
    GroupNode , 
    SupportNode , 
    StructNode , 
    AbstractNode , 
} from "./intermidiate"

export {}

/** 用来保存概念的字典。 */
interface ConceptDict<T>{
    "group"     : {[name: string] : T} , 
    "inline"    : {[name: string] : T} , 
    "struct"    : {[name: string] : T} , 
    "support"   : {[name: string] : T} , 
    "abstract"  : {[name: string] : T} , 

}
/** 用来保存一级概念的字典。 */
type FirstClassConceptDict = ConceptDict<FirstClassConcept>

/** 用来保存二级概念的字典。 */
type SecondClassConceptDict = ConceptDict<SecondClassConcept>

/**
 * 印刷器类。
 * 这个类除了需要储存概念列表还需要什么？
 */
class Printer extends React.Component{
    firstClassConcepts: FirstClassConceptDict
    secondClassDict: SecondClassConceptDict
    constructor(props:{firstClassConcepts: FirstClassConceptDict , secondClassDict: SecondClassConceptDict}){
        super(props)
        this.firstClassConcepts = firstClassConcepts
        this.secondClassDict    = secondClassDict
    }
}

