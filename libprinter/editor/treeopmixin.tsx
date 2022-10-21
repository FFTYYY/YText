/** 这个模块定义所有修改文档的外部行为。 
 * @module
*/

/**
 TODO READ THIS
 1 应该保证slate是所有修改的来源
 2 应该加入一系列判断函数来将slate节点转成printer节点（e.g.：Slate.Node & ConceptNode)
 3 编辑器不应该维护root

 */

import Slate from "slate"
import {
    slate_is_concept , 
    slate_is_paragraph , 
    slate_is_text , 
    slate_is_same_concept_node , 
    slate_concept_node2path , 
} from "./utils"

import {
    ConceptNode , 
    GroupNode , 
    InlineNode , 
    ParagraphNode , 
    SupportNode , 
    StructNode , 
    ParameterList ,     
} from "../core"

import {
    EditorComponent , 
} from "./main"

export { tree_op_mixin }

/** 这个混入对象提供所有跟节点树操作有关的函数。
 * 基本上就是`slate`的`Transforms`的代理。
 */
let tree_op_mixin = {
    
    /** 这个函数修改节点的某个属性。相当于`slate.Transforms.setNodes`。 */
    set_node<NT extends Slate.Node & ConceptNode>(editor: EditorComponent, node: NT, new_val: Partial<NT>){
        Slate.Transforms.setNodes<NT>(editor.get_slate() , new_val , {at: slate_concept_node2path(editor.get_slate() , node)})
    } , 

    /** 这个函数修改节点的某个属性。相当于`slate.Transforms.setNodes`。 */
    set_node_by_path<NT extends Slate.Node & ConceptNode>(editor: EditorComponent, path:number[] , new_val: Partial<NT>){
        Slate.Transforms.setNodes<NT>(editor.get_slate() , new_val , {at: path})
    } , 

    /** 如果一个节点有代理，这个函数就修改代理，同时修改参数，否则只修改参数。 */
    auto_set_parameter<NT extends Slate.Node & ConceptNode>(editor: EditorComponent, node: NT, parameters: ParameterList){
        let P = {parameters: {...node.parameters , ...parameters}} as Partial<NT> // 有他妈的毛病
        tree_op_mixin.set_node<NT>(editor, node , P)
    } , 

    /** 这个函数删除一个节点。 */
    delete_concept_node<NT extends Slate.Node & ConceptNode>(editor: EditorComponent, node: NT){
        Slate.Transforms.removeNodes<NT>(editor.get_slate() , {at: slate_concept_node2path(editor.get_slate() , node)})
    } , 

    /** 这个函数删除一个节点。 */
    delete_node_by_path<NT extends Slate.Node>(editor: EditorComponent, path: number[]){
        Slate.Transforms.removeNodes<NT>(editor.get_slate() , {at: path})
    } , 
    
    /** 这个函数把一个节点移动到另一个位置。 */
    move_concept_node<NT extends Slate.Node & ConceptNode>(editor: EditorComponent, node_from: NT, position_to: number[]){
        Slate.Transforms.moveNodes(editor.get_slate() , {
            at: slate_concept_node2path(editor.get_slate() , node_from) , 
            to: position_to , 
        })
    } , 

    /** 这个组件把节点的子节点提升到顶层。 */
    unwrap_node<NT extends Slate.Node & ConceptNode>(editor: EditorComponent, node: NT){
        Slate.Transforms.unwrapNodes<NT>(editor.get_slate() , {at: slate_concept_node2path(editor.get_slate() , node)})
    } , 

    move_node_by_path<NT extends Slate.Node>(editor: EditorComponent, position_from: number[], position_to: number[]){
        Slate.Transforms.moveNodes<NT>(editor.get_slate() , {
            at: position_from , 
            to: position_to , 
        })
    } , 
        
    /** 这个函数插入一个或者系列节点。 */
    add_nodes<NT extends Slate.Node>(editor: EditorComponent, nodes: (NT[]) | NT, path: number[]){
        Slate.Transforms.insertNodes<NT>(editor.get_slate() , nodes, {at: path})
    } , 

    /** 这个函数在某个节点前面插入一个或者系列节点。 */
    add_nodes_before<NT extends Slate.Node, TT extends Slate.Node & ConceptNode>(editor: EditorComponent , nodes: (NT[]) | NT, target_node: TT){
        Slate.Transforms.insertNodes(editor.get_slate() , nodes, {at: slate_concept_node2path(editor.get_slate(),target_node)})
    } , 

    /** 这个函数在某个节点后面插入一个或者系列节点。 */
    add_nodes_after<NT extends Slate.Node, TT extends Slate.Node & ConceptNode>(editor: EditorComponent, nodes: (NT[]) | NT, target_node: TT){
        let path = slate_concept_node2path(editor.get_slate(),target_node)
        path[path.length-1] ++
        Slate.Transforms.insertNodes<NT>(editor.get_slate() , nodes, {at: path})
    } , 

    /** 这个函数在选中位置插入节点。 */
    add_nodes_here<NT extends Slate.Node>(editor: EditorComponent, nodes: (NT[]) | NT){
        Slate.Transforms.insertNodes(editor.get_slate() , nodes)
    } , 

    /** 把当前选择的区域打包成一个节点。 
     * @param options.match 判断子节点中哪些要打包的函数。
     * @param options.split 是否允许分裂父节点。
    */
    wrap_selected_nodes<NT extends Slate.BaseElement>(
        editor: EditorComponent , 
        node: NT, 
        options:{
            match?: (n:NT)=>boolean , 
            split?: boolean , 
        }
    ){
        // TODO 这啥啊
        // if(options.split){ // 分裂节点有可能造成多个相同`idx`的节点，因此需要开启特殊检查。
        //     set_normalize_status({pasting: true})
        // }
        
        Slate.Transforms.wrapNodes<NT>(
            editor.get_slate() , 
            node , 
            {
                match: options.match , 
                split: options.split , 
            }
        )
    } , 

    /** 把当前选择的区域打包成一个节点。 
     * @param options.match 判断子节点中哪些要打包的函数。
     * @param options.split 是否允许分裂父节点。
    */
    wrap_nodes<NT extends Slate.BaseElement>(
        editor: EditorComponent , 
        node: NT, 
        from: Slate.Point , 
        to: Slate.Point , 
        options:{
            match?: (n:NT)=>boolean , 
            split?: boolean , 
        }
    ){
        // TODO 这啥啊
        // if(options.split){ // 分裂节点有可能造成多个相同`idx`的节点，因此需要开启特殊检查。
        //     set_normalize_status({pasting: true})
        // }
        
        Slate.Transforms.wrapNodes<NT>(
            editor.get_slate() , 
            node , 
            {
                at: {
                    anchor: from , 
                    focus: to , 
                } , 
                match: options.match , 
                split: options.split , 
            }
        )
    } , 


    /** 这个函数把某个节点的全部子节点替换成给定节点。 */
    replace_nodes<NT extends Slate.Node & ConceptNode, ST extends Slate.Node>(editor: EditorComponent, father_node: NT, nodes: ST[]){
        let root = editor.get_slate()

        let father_path = slate_concept_node2path(root , father_node)

        let numc = father_node.children.length

        //把整个father删了
        if(numc > 0){
            Slate.Transforms.removeNodes<NT>(editor.get_slate(), {
                at: {
                    anchor: {path: [...father_path,0] , offset: 0} , 
                    focus: {path: [...father_path,numc-1] , offset: 0} , 
                }
            })
        }

        // 替换成新节点
        Slate.Transforms.insertNodes<NT>( editor.get_slate() , nodes , {at: [...father_path , 0]} )
    } , 

}
