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
    Env , 
    Context , 
    PrinterEnterFunction , 
    PrinterExitFunction , 
    PrinterRenderFunction , 
} from "./renderer"
import {
    InlineNode , 
    GroupNode , 
    SupportNode , 
    StructNode , 
    AbstractNode , 
    Node , 

    is_concetnode , 
	is_inlinenode , 
	is_groupnode , 
	is_supportnode , 
	is_abstractnode , 
	is_structnode , 
	is_paragraphnode , 
	is_textnode , 
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
    "text"      : PrinterRenderer , 
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

    /** 查询一个渲染器。
     * @param type 查找的节点类型。
     * @param name 查找的概念名称。
     * 如果`type == "paragraph" || "text"`，那么`name`将会被忽略。
     * 反之，如果`type != "paragraph" && type != "text"`，那么`name`必须提供。
     */
    get_renderer(type: "group" | "inline" | "struct" | "support" | "abstract" | "paragraph" | "text" , name?: string){
        if(type != "paragraph" && type != "text" && name == undefined){
            
        }

    }
}

class PrinterComponent extends React.Component{

    printer: Printer
    root: GroupNode | AbstractNode

    constructor(props:{
        printer: Printer
        root: GroupNode | AbstractNode 
    }){
        super(props)

        this.printer = props.printer
        this.root = props.root
    }

    /**这个函数在印刷之前生成环境和上下文。 */
    preprocess(){
        let me = this 
        var context: Context = {}
        var env: Env = {}

        function _preprocess(nowcontext: Context , nowenv: Env , nownode: Node){

            /** 进入时操作。 */
            me.renderers[""]

            if (is_groupnode(nownode)){
                nownode
            }

        }


    }
    
    render(){
        return <></>
    }
}