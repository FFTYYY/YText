/** 
 * 样式分为两种，节点样式和抽象样式。其中节点样式又分了若干种（段组、行内、辅助、结构）。
 * 
 * 节点依据其节点样式的类型分成不同的类型。
 * 所有带样式的节点都必须有子节点。
 * 不带样式的子节点有两种，有子节点的（段落）和么有子节点的（文本）。
 * 
 * 每个样式节点都必须有一个参数属性和一个 flag 属性。参数决定了其渲染的内容， flag 决定了其渲染的模式。
 * 
 * 这个文件定义所有可能的节点类型、样式类型。
 * 
 * @module
 */

import { Node } from "slate"

export {
	text_prototype , 
	paragraph_prototype , 
	inline_prototype , 
	group_prototype , 
	struct_prototype , 
	support_prototype , 
	is_valid_parameter_leaf , 
	is_styled , 
	has_children , 
	is_paragraph , 
	get_node_type , 
	is_certain_style , 
}
export type {
	StyledNodeType , 
	StyleType , 
	NodeType , 
	GroupRelationType , 
	ValidParameterLeaf , 
	ValidParameter , 
	StyledNodeFlag , 
	StyledNodeBase , 
	StyledNode , 
	InlineNode , 
	GroupNode , 
	StructNode , 
	SupportNode , 
}

/**  全体可能的节点样式类型。 */
type StyledNodeType = "inline" | "group" | "struct" | "support" 

/** 全体可能的样式类型。 */
type StyleType = StyledNodeType | "abstract"

/** 全体可能的节点类型。 */
type NodeType = StyledNodeType | "paragraph" | "text"

/** 所有可能的段组连接方式。 */
type GroupRelationType = "chaining" | "separating"

/** 参数可以接受的叶子节点。 */
type ValidParameterLeaf = string | number | boolean

/** 合法的节点参数对象。 */
type ValidParameter = {[key:string]: ValidParameter | ValidParameterLeaf}



/** 节点的 flag 属性的接口。 */
interface StyledNodeFlag{
    forceInline?: boolean , 
    forceBlock?: boolean , 
    forceVoid?: boolean , 
}

/** 所有带样式的节点共享的属性。 */
type StyledNodeBase = {
    /** 节点的唯一编号。 */
    idx: number 

    /** 节点的节点样式类型。 */
    type: StyledNodeType
    
    /** 子节点列表。 */
    children: Node[]

    /** 节点样式的具体名称。 */
    name: string

    /** 节点的抽象列表。 */
    hiddens: GroupNode[] 

    /** 节点的参数。 */
    parameters: ValidParameter

    /** 节点的 flag 。 */
    flags: StyledNodeFlag
}

/** 一个合法的行内样式的节点。 */
type InlineNode = Node & StyledNodeBase & {
    type: "inline"
    children: [Node] // InlineNode 只能有一个子节点
}

/** 一个合法的段组样式的节点。 */
type GroupNode = Node & StyledNodeBase & {
    type: "group"

	/** 段组节点有一个额外的`relation`属性。 */
    relation: GroupRelationType 
}

/** 结构节点。 */
type StructNode = Node & StyledNodeBase & {
	type: "struct"
}

/** 辅助节点。 */
type SupportNode = Node & StyledNodeBase & {
    type: "support"
    children: [Node] // `SupportNode`只能有一个子节点
}

/** 一个合法的带样式的节点。 */
type StyledNode = InlineNode | GroupNode | StructNode | SupportNode


/** 这个函数为每个节点生成一个唯一的id。
 * @internal
*/
function gene_idx(){
    return parseInt( Math.random() * 23333333 )
}

/** 总之新建一个text node。*/
function text_prototype(text: string = ""): Node{
    return {
        text: text , 
    }
}

/** 总之新建一个段落。 */
function paragraph_prototype(text:string = ""): Node{
    return {
        children: [text_prototype(text)] , 
    }
}

/** 新建一个行内样式。 */
function inline_prototype(name: string, parameter_proto: ValidParameter, flags:StyledNodeFlag = {}): InlineNode{
    return {
        idx: gene_idx() , 
        type: "inline" , 
        name: name , 
        parameters: parameter_proto , 
        children: [ text_prototype("") ] , 
        hiddens: [] , 
        flags: flags , 
    }
}

/** 新建一个组节点。 */
function group_prototype(name: string , parameter_proto: ValidParameter, flags: StyledNodeFlag = {}): GroupNode{
    return {
        idx: gene_idx() , 
        type: "group" , 
        name: name , 

        parameters: parameter_proto , 
        relation: "separating" , 

        children: [paragraph_prototype()] , 
        hiddens: [] , 
        flags: flags , 
    }
}

/** 新建一个结构节点。 */
function struct_prototype(name: string , parameter_proto: ValidParameter , flags: StyledNodeFlag = {}): StructNode{
    return {
        idx: gene_idx() , 
        type: "struct" , 
        name: name , 

        parameters: parameter_proto , 

        children: [] , 
        hiddens: [] , 
        flags: {} , 
    }
}

/** 新建一个辅助节点。 */
function support_prototype(name: string , parameter_proto: ValidParameter , flags: StyledNodeFlag = {}): SupportNode{
    return {
        idx: gene_idx() , 
        type: "support" , 
        name: name , 
        parameters: parameter_proto , 
        children: [ text_prototype() ],
        hiddens: [] , 
        flags: flags , 
    }
}

/** 这个函数判断参数是否是合法的参数的叶节点。 */
function is_valid_parameter_leaf(o:any): o is ValidParameterLeaf{
    return typeof(o) == "string" || typeof(o) == "number" || typeof(o) == "boolean"
}

/** 这个函数判断一个节点是否是样式节点。 */
function is_styled(node: Node): node is StyledNode{
	return "type" in node
}

/** 这个函数判断一个节点是否有子节点。 */
function has_children(node: Node): node is {children: Node[]}{
	return "children" in node
}

/** 这个函数判断一个节点是否是段落节点。 */
function is_paragraph(node: Node):node is {children: Node[]}{
	return (!is_styled(node)) && has_children(node)
}

/** 这个函数给出一个字符串表示一个节点的类型。 */
function get_node_type(node: Node): NodeType{

    if(is_styled(node))
        return node.type

    // 如果一个没有style的节点有children，就判断为段落，否则是文本
    if("children" in node)
        return "paragraph"
    return "text"
}

/** 这个函数判断节点是不是给定的样式 
 * @param node 要判断的节点。
 * @param type 要判断的样式类型。
 * @param name 要判断的样式名。
*/
function is_certain_style(node: Node , type: StyleType, name: string):boolean{
    return get_node_type(node) == type && (node as StyledNode).name == name
}

