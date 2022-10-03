/** 这个模块定义概念类，包括一级概念和二级概念。 
 * @module
*/

import { ParameterValue , ParameterList } from './intermidiate'
export type {
    MetaParameters , 
    FixedParameterValue , 
    FixedParameterList , 
    FirstClassConcept , 
    SecondClassConcept , 
}

/** 元参数列表的接口。
 * 元参数列表应该作为一级概念的一部分。
 */
 interface MetaParameters{

    /** 是否强制节点渲染为行内样式。 */
	forceInline?: boolean,

    /** 是否强制节点渲染为块级样式。 */
	forceBlock?: boolean,

    /** 是否强制没有子节点。 */
	forceVoid?: boolean,
}

/** 固定参数项的可行类型。 */
type FixedParameterValue = ParameterValue | {"type": "function" , val: string}

/** 固定参数项的参数列表。 */
interface FixedParameterList{[key: string]: FixedParameterValue}

/** 一级概念。 
 * 一级概念被二级概念继承以形成真正的概念。
 * 一级概念提供参数原型、元参数，以及印刷方法。
*/
class FirstClassConcept{
    /** 对应的节点类型。 */
    type: "group" | "inline" | "structure" | "support" | "abstract"
    /** 概念的名称。一级概念的名称和类型的二元组是其唯一标志。 */
    name: string

    /** 参数列表。 */
    parameterPrototype: ParameterList
    /** 元参数列表。如果没有提供会默认把所有项都设置为`undefined`。 */
    metaParameters: MetaParameters

    constructor(
        type: "group" | "inline" | "structure" | "support" | "abstract" , 
        name: string , 
        metaParameters: MetaParameters , 
        parameterPrototype?: ParameterList , 
    ){
        this.type = type
        this.name = name
        this.metaParameters = metaParameters

        if(parameterPrototype == undefined){
            this.parameterPrototype = {
                forceInline: undefined , 
                forceBlock: undefined , 
                forceVoid: undefined , 
            }
        }
        else{
            this.parameterPrototype = parameterPrototype
        }
    }
}

/** 二级概念。
 * 二级概念继承一级概念以形成真正的概念。之所以这么设计，是为了让概念可以在编辑中动态创建而免于编程。
 * 二级概念描述如何重写一级概念的参数。
 */
class SecondClassConcept{
    /** 对应的一级概念类型。 */
    type: string
    /** 对应的一级概念名称。 */
    firstConcept: string

    /** 二级概念名称。类型和名称是检索一个二级概念的唯一标志。 */
    name: string

    /** 要修改哪些参数的默认值。 */
    defaultOverride: ParameterList
    /** 要固定哪些参数的值。 */
    fixedIverride: FixedParameterList

    constructor(
        firstConcept: string , 
        name: string , 
        defaultOverride: ParameterList , 
        fixedIverride: FixedParameterList , 
    ){
        this.firstConcept = firstConcept
        this.name = name
        this.defaultOverride = defaultOverride
        this.fixedIverride = fixedIverride
    }
}
