/** 这个模块定义文档的中间表示。
@module
*/

export {}


/** 文本节点的接口。 */
interface TextNode {text: string}

/** 段落节点的接口。 */
interface ParagraphNode {
	type: "paragraph"
	children: (TextNode | InlineNode) []
}

/** 元参数列表的接口。
 * 元参数列表应该作为一级概念的一部分。
 */
interface MetaParameters{
	forceInline?: boolean,
	forceBlock?: boolean,
	forceVoid?: boolean,
}

/** 所有参数项的可行的类型。 */
type ParameterValue = 
	{type: "string" , val: string} |
	{type: "number" , val: number} | 
	{type: "boolean" , val: boolean}
/** 固定参数项的可行类型。 */
type FixedParameterValue = ParameterValue | {"type": "function" , val: string}

// TODO 完善这个
interface ParameterList{[key: string]: ParameterValue}
interface FixedParameterList{[key: string]: FixedParameterValue}

interface InlineNode{
	type: "inline"
	idx: number 

	concept: string
	parameters: ParameterList

	children: [ Text ]
	abstrct: AbstractNode []
}


interface GroupNode{
	type: "group"
	idx: number 

	concept: string
	parameters: ParameterList

	children: NonLeafNode []
	abstract: AbstractNode []

	relation: "chaining" | "separate"
}

interface SupportNode{
	type: "support" 
	idx: number 

	concept: string
	parameters: ParameterList
	
	children: []
	abstract: AbstractNode []
}

interface AbstractNode{
	type: "abstract"
	idx: number 
	
	concept: string
	parameters: ParameterList
	
	children: NonLeafNode []
	abstract: AbstractNode []
}

