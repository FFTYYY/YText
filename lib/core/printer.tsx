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
    ConceptNode, 
    Node , 
    AllNodeTypes , 
    AllConceptTypes , 

    is_concetnode , 
	is_inlinenode , 
	is_groupnode , 
	is_supportnode , 
	is_abstractnode , 
	is_structnode , 
	is_paragraphnode , 
	is_textnode , 
    //get_node_type, 
} from "./intermidiate"
import {
    UnexpectedParametersError , 
} from "../exceptions"
import {
    GlobalInfo , 
    GlobalInfoProvider , 
} from "./globalinfo"

export type {
    FirstClassConceptDict , 
    SecondClassConceptDict , 
    RendererhDict , 
    DefaultRendererhDict , 
}

export {
    Printer , 
    PrinterComponent , 
}

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

    /** 查询一个二级概念。
     * @param type 查找的节点类型。
     * @param name 查找的概念名称。
     * 如果没有找到，就返回`undefined`。
     */
    get_second_concept(type: AllConceptTypes, name: string): SecondClassConcept | undefined{
        return this.secondClassConcepts[type][name]
    }
    /** 查询一个一级概念。
     * @param type 查找的节点类型。
     * @param name 查找的概念名称。
     * 如果没有找到，就返回`undefined`。
     */
    get_first_concept(type: AllConceptTypes, name: string): FirstClassConcept | undefined{
        return this.firstClassConcepts[type][name]
    }

    /** 根据一个节点查询其二级概念。 */
    get_node_second_concept(node: ConceptNode): SecondClassConcept | undefined{
        let sec_concept_name = node.concept // 节点的二级概念名。
        return this.get_second_concept(node.type , sec_concept_name)
    }

    /** 根据一个节点查询其一级概念。 */
    get_node_first_concept(node: ConceptNode): FirstClassConcept | undefined{
        let sec_ccpt = this.get_node_second_concept(node)
        if(sec_ccpt == undefined){
            return undefined
        }
        let first_concept_name = sec_ccpt.firstConcept // 节点的一级概念名。
        return this.get_first_concept(node.type , first_concept_name)
    }
    

    /** 查询一个渲染器。
     * @param type 查找的节点类型。
     * @param name 查找的概念名称。
     * 如果`type == "paragraph" || "text"`，那么`name`将会被忽略。
     * 反之，如果`type != "paragraph" && type != "text"`，那么`name`必须提供。
     */
    get_renderer(type: AllNodeTypes , name?: string): PrinterRenderer{
        if(type != "paragraph" && type != "text"){// 概念节点。
            if(name == undefined)
                throw new UnexpectedParametersError(`type = ${type} must have a name.`) 
            let ret = this.renderers[type][name]
            if(ret == undefined){ // 如果没有找到这个概念的渲染器，就返回一个这个概念类型的默认渲染器。
                ret = this.defaultRenderers[type]
            }
            return ret
        }

        return this.defaultRenderers[type] // 在不是概念节点的情况下，直接返回默认渲染器。
    }

    /** 这个函数直接从一个节点查询渲染器。 */
    get_node_renderer(node: Node): PrinterRenderer{
        let me = this
        if(is_textnode(node)){ // 如果是文本节点，直接按类型查询。
            return me.get_renderer("text")
        }
        else if(is_paragraphnode(node)){ // 如果是段落节点，直接按类型查询。
            return me.get_renderer("paragraph")
        }
        
        let concept = me.get_node_first_concept(node)
        let concept_name = concept ? concept.name : undefined
        return me.get_renderer(node.type , concept_name) // 如果是概念节点，按类型和一级概念名查询。
    }
}

/** 这个类定义印刷器的组件。印刷器组件和印刷器（核心）是分开的，组件只负责绘制，而不储存任何信息，印刷器只负责储存信息，而不负责
 * 绘制。在使用时，将印刷器和节点树一起传入印刷器组件来印刷文章。
 */
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
    preprocess(): [Env , {[path: string]: Context}]{
        let me = this 

        /** 这个函数递归地检查整个节点树，并让每个节点对环境做处理。最终的结果被记录在全局变量中。 
         * @param nowenv 当前的环境。
         * @param node 当前节点。
         * @param path 当前节点到根的路径。
         * @param contexts 所有节点的上下文的储存。
         * 注意这个函数对`nowenv`是不改变的，但是对`contexts`却是改变的。
        */
        function _preprocess(nowenv: Env , node: Node , path: number[] , contexts: {[path: string]: Context})
            : [Env , boolean]
        {
            /** 进入时操作。 */

            let renderer = me.printer.get_node_renderer(node) // 向印刷器请求渲染器。
            let my_path = JSON.stringify(path) // 本节点的路径的字符串表示。
            let flag = true // 这个变量表示处理是否结束。只要有一个子节点的处理没有结束那就没有结束。

            let nowcontext: Context = contexts[my_path] // 使用path来作为每个节点的索引。
            if(nowcontext == undefined){
                nowcontext = {}
            }

            // 进入时先操作一次环境并建立一次上下文。
            let [env_1 , context_1] = renderer.enter(node , nowenv , nowcontext)

            // 然后让所有子节点操作环境。
            if (! is_textnode(node)){ // 还有子节点
                for(let c_idx in node.children){
                    let c = node.children[c_idx]
                    let [env_2 , flag_2] = _preprocess(env_1 , c , [...path , parseInt(c_idx)] , contexts) // 向下处理子节点。

                    flag = flag && flag_2 // 只要有一个子节点返回`false`，本节点就返回`false`。
                    env_1 = env_2 // 总之更新环境。
                }
            }

            // 退出时再操作一次环境和上下文。
            let [env_3 , context_3 , flag_3] = renderer.exit(node , env_1 , context_1)
            flag = flag && flag_3

            contexts[my_path] = context_3 //记录/更新 上下文。
            return [env_3 , flag]
        }

        let env = {}
        let contexts = {}
        let flag = true // 处理是否结束。如果为`false`就要继续处理。
        while(flag){
            let [newenv , newflag] = _preprocess(env , me.root , [] , contexts)
            env = newenv 
            flag = newflag
        }

        return [env , contexts]
    }
    
    /** 这个函数渲染一个子节点。 */
    subrender(props: {
        node: Node , 
        path: number [] , 
        contexts: {[path: string]: Context} , 
    }): React.ReactElement{
        let me = this
        let [node , path , contexts] = [props.node , props.path , props.contexts]
        let ThisFunction = me.subrender.bind(this)
        
        let my_path = JSON.stringify(node)
        let my_context = contexts[my_path] // 本节点的上下文信息。

        let renderer = me.printer.get_node_renderer(node) // 向印刷器请求渲染器。
        let RR = renderer.renderer // 真正的渲染函数。

        // 先渲染子节点。
        let children = <></>
        if (is_textnode(node)){
            children = <React.Fragment>{            
                Object.keys(children).map((subidx) => <ThisFunction
                key      = {subidx}
                node     = {children[subidx]} 
                path     = {[...path , parseInt(subidx)]}
                contexts = {contexts}
            />)}</React.Fragment>
        }

        // 渲染本节点。
        return <RR 
            context = {my_context}
            node = {node}
        >{children}</RR>
    }

    render(){
        let me = this
        let R = me.subrender.bind(this)

        let [env , contexts] = me.preprocess()

        // 通过React注入器提供给用户定义的渲染器的全局信息。
        let globalinfo = {
            "printer": me.printer , 
            "root": me.root , 
            "printerComponent": me , 
            "env": env , 
            "contexts": contexts , 
        }

        return <GlobalInfoProvider 
            value = {globalinfo}
        ><R
            node = {me.root} 
            path = {[]}
            contexts = {contexts}
        /></GlobalInfoProvider>
    }
}