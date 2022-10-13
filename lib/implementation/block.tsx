import React, { ReactComponentElement } from "react"

import {
    Printer , 
    ProcessedParameterList , 
    ConceptNode , 
    GroupNode , 
    PrinterRenderFunctionProps , 
    PrinterRenderFunction , 
    PrinterRenderer , 
    Env , 
    Context, 
    ParagraphNode, 
} from "../core"
import {
    ContexterBase , 
    InjectContexter , 
    ConsumerContexter , 
    InjectInformation , 
} from "./contexter"
import { 
    PrinterPartBox , 
    PrinterParagraphBox, 
} from "./uibase/components"
import {
    auto_renderer , 
} from "./utils"

export { get_default_group_renderer , get_default_paragraph_renderer }


// TODO 最好把contexters改成现场生成的。

/** 这个函数快速生产一个默认的块级组件的渲染器。 
 * 同时，这个函数会使用上下文工具，快捷地允许向段落的开头和结尾添加元素。
 * 
 * @param params.contexters 除了默认的注射器之外，额外添加的上下文工具。
 * @param params.outer 包裹外部的组件。可以负责间距之类的。
 * @param params.inner 包裹内部的组件。可以负责底色之类的。
 * @param params.pre_element 要在开头注入的元素。
 * @param params.aft_element 要在结束后注入的元素。
 * @param params.pre_text 要在开头注入的文本。
 * @param params.aft_text 要在结束后注入的文本。
 * @param params.element_key 注入元素使用的子环境名。
 * @param params.text_key 注入文本使用的子环境名。
*/
function get_default_group_renderer({
    contexters =  [] , 
    outer =  (props: PrinterRenderFunctionProps<GroupNode>)=><PrinterPartBox>{props.children}</PrinterPartBox> , 
    inner =  (props: PrinterRenderFunctionProps<GroupNode>)=><React.Fragment>{props.children}</React.Fragment> , 
    pre_element =  undefined , 
    aft_element =  undefined , 
    pre_text =  undefined , 
    aft_text =  undefined , 
    element_key =  "paragraph-element" , 
    text_key =  "paragraph-text" , 
}:{
    contexters?: ContexterBase<GroupNode>[]
    outer?: PrinterRenderFunction<GroupNode>
    inner?: PrinterRenderFunction<GroupNode>
    pre_element?: InjectInformation<GroupNode , React.ReactElement> | undefined
    aft_element?: InjectInformation<GroupNode , React.ReactElement> | undefined
    pre_text?: InjectInformation<GroupNode , string> | undefined
    aft_text?: InjectInformation<GroupNode , string> | undefined
    element_key?: string
    text_key?: string
}){
    let OUT = outer
    let INN = inner
    
    // 注意contexter是没有状态的，因此可以声明在外面。
    // 注意 xx && yy == xx == undefined ? undefined : yy
    let elmt_injecter = new InjectContexter<GroupNode , React.ReactElement<PrinterRenderFunctionProps<GroupNode>>>(
        element_key , {
            preinfo: (n,p,e,c)=>(pre_element && pre_element(n,p,e,c)), 
            aftinfo: (n,p,e,c)=>(aft_element && aft_element(n,p,e,c)), 
        }
    )
    let text_injecter = new InjectContexter<GroupNode , string>(
        text_key , {
            preinfo: (n,p,e,c)=>(pre_text && pre_text(n,p,e,c)) , 
            aftinfo: (n,p,e,c)=>(aft_text && aft_text(n,p,e,c)) , 
        }
    )

    // 把预先定义的两个注射器塞进contexter里面。
    contexters = [...contexters , elmt_injecter , text_injecter]

    return auto_renderer<GroupNode>({
        contexters: contexters , 
        render_function: (props: PrinterRenderFunctionProps<GroupNode>) => {
            let props_except_children = {
                node: props.node , 
                context: props.context , 
                parameters: props.parameters ,             
            }
            return <OUT {...props_except_children}>
                <INN {...props_except_children}>{props.children}</INN>
            </OUT>
        } , 
    })
}

/** 这个函数生成一个默认的段落样式。 
 * 这个函数生成的段落会使用上下文工具来允许:
 * + 在段落开头添加一个元素；
 * + 在段落开头添加一个文本；
 * 注意，永远不在段落结尾添加元素，因为概念上段落的数量是不确定的。
 * 
 * @param params.element_key 在段落开头添加元素的键。
 * @param params.text_key 在段落开头添加文本的键。
 * @param params.contexters 其他上下文作用器。
*/
function get_default_paragraph_renderer({
    element_key = "paragraph-element" , 
    text_key = "paragraph-text" , 
    contexters = []
}: {
    element_key?: string
    text_key?: string
    contexters?: ContexterBase<ParagraphNode> []
}){
    type RPROPS = PrinterRenderFunctionProps<ParagraphNode> // 只是让代码看起来不要太乱...

    // 注意contexter是没有状态的，因此可以声明在外面。
    let elmt_consumer = new ConsumerContexter<ParagraphNode , React.ReactElement<RPROPS>>(element_key)
    let text_consumer = new ConsumerContexter<ParagraphNode , string>(text_key)

    // 把预先定义的两个注射器塞进contexter里面。
    contexters = [...contexters , elmt_consumer , text_consumer]
    
    return auto_renderer<ParagraphNode>({
        contexters: contexters , 
        render_function: (props: RPROPS) => {
            let context = props.context
            let pre_elements = elmt_consumer.get_context(context)
            let pre_texts = text_consumer.get_context(context)

            // TODO pretext可能需要加点样式啥的？
            return <PrinterParagraphBox>
                {Object.keys(pre_elements).map((eleid)=><React.Fragment key={eleid}>{pre_elements[eleid]}</React.Fragment>)}
                {Object.keys(pre_texts).map((eleid)=><span key={eleid}>{pre_texts[eleid]}</span>)}
                {props.children}
                <br/>
            </PrinterParagraphBox>
        } , 
    })
}
