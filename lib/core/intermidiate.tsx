/** 这个模块定义文档的中间表示。
@module
*/

export type {
	TextNode , 
	ParagraphNode , 
	ParameterValue , 
	ParameterList , 
	Node , 
	NonLeafConceptNode , 
	ConceptNode , 
	NonLeafNode , 
	InlineNode , 
	GroupNode , 
	SupportNode , 
	StructNode , 
	AbstractNode , 
}


/** 文本节点的接口。 */
interface TextNode {text: string}

/** 段落节点的接口。 */
interface ParagraphNode {
	type: "paragraph"
	children: (TextNode | InlineNode) []
}

/** 所有参数项的可行类型。 */
type ParameterValue = 
	{type: "string" , val: string} |
	{type: "number" , val: number} | 
	{type: "boolean" , val: boolean}


/** 参数列表。 */
interface ParameterList{[key: string]: ParameterValue}


/** 所有可能的节点。 */
type Node = TextNode | ParagraphNode | ConceptNode

/** 所有概念节点，除了抽象节点。 */
type NonLeafConceptNode = InlineNode | GroupNode | StructNode | SupportNode

/** 所有概念节点。 */
type ConceptNode = NonLeafConceptNode | AbstractNode

/** 所有树上非叶子的节点。 */
type NonLeafNode = ParagraphNode | NonLeafConceptNode


/** 行内节点。 */
interface InlineNode{

	/** 节点类型 */
	type: "inline"
	/** 节点的全局唯一编号 */
	idx: number 

	/** 节点的二级概念 */
	concept: string
	/** 节点的二级概念参数。 */
	parameters: ParameterList
	/** 节点的缓存结果。 */
	cacheResult: any

	/** 子节点列表。 */
	children: [ Text ]
	/** 抽象列表。 */
	abstrct: AbstractNode []
}

/** 组节点。 */
interface GroupNode{
	/** 节点类型。 */
	type: "group"
	/** 节点的全局唯一编号。 */
	idx: number 

	/** 节点的二级概念 */
	concept: string
	/** 节点的二级概念参数。 */
	parameters: ParameterList
	/** 节点的缓存结果。 */
	cacheResult: any

	/** 子节点列表。 */
	children: NonLeafNode []
	/** 抽象列表。 */
	abstract: AbstractNode []

	/** 跟前一个节点的关系。 */
	relation: "chaining" | "separate"
}

/** 支持节点。 */
interface SupportNode{
	/** 节点类型。 */
	type: "support" 
	/** 节点的全局唯一编号。 */
	idx: number 

	/** 节点的二级概念 */
	concept: string
	/** 节点的二级概念参数。 */
	parameters: ParameterList
	/** 节点的缓存结果。 */
	cacheResult: any
	
	/** 子节点列表。必定为空。 */
	children: []
	/** 抽象列表。 */
	abstract: AbstractNode []
}

/** 结构节点。 */
interface StructNode{
	/** 节点类型。 */
	type: "structure" 
	/** 节点的全局唯一编号。 */
	idx: number 

	/** 节点的二级概念 */
	concept: string
	/** 节点的二级概念参数。 */
	parameters: ParameterList
	/** 节点的缓存结果。 */
	cacheResult: any
	
	/** 子节点列表。必定为组节点。 */
	children: GroupNode []
	/** 抽象列表。 */
	abstract: AbstractNode []

	numChildren: number
	relation: "chaining" | "separate"
}

/** 抽象节点。 */
interface AbstractNode{
	/** 节点类型。 */
	type: "abstract"
	/** 节点的全局唯一编号。 */
	idx: number 
	
	/** 节点的二级概念 */
	concept: string
	/** 节点的二级概念参数。 */
	parameters: ParameterList
	/** 节点的缓存结果。 */
	cacheResult: any
	
	/** 子节点列表。 */
	children: NonLeafNode []
	/** 抽象列表。 */
	abstract: AbstractNode []
}

