/** 这个模块定义一个印刷器 
 * @module
*/

import React from "react"

import {
    FirstClassConcept , 
    SecondClassConcept , 
} from "./concept"
import {
    PrinterRenderer , 
} from "./renderer"
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

/** 用来保存各个一级概念的渲染器的字典。 */
type RendererhDict = ConceptDict<PrinterRenderer>

/** 未找到概念时的渲染方案 */
interface DefaultRendererhDict{
    "group"     : PrinterRenderer , 
    "inline"    : PrinterRenderer , 
    "struct"    : PrinterRenderer , 
    "support"   : PrinterRenderer , 
    "abstract"  : PrinterRenderer , 
    "paragraph" : PrinterRenderer , 
}



/**
 * 印刷器类。
 * 这个类除了需要储存概念列表还需要什么？
 */
class Printer{
    firstClassConcepts: FirstClassConceptDict
    secondClassConcepts: SecondClassConceptDict
    renderers: RendererhDict 
    defaultRenderers: DefaultRendererhDict 

    constructor(props:{
        firstClassConcepts: FirstClassConceptDict , 
        secondClassConcepts: SecondClassConceptDict , 
        renderers: RendererhDict , 
        defaultRenderers: DefaultRendererhDict , 
        
    }){
        this.firstClassConcepts = props.firstClassConcepts
        this.secondClassConcepts    = props.secondClassConcepts
        this.renderers = props.renderers
        this.defaultRenderers = props.defaultRenderers
    }
}

