/** 
 * 这个文件描述和样式有关的插件。
 * @module
 */

import { Transforms, Element, Node , Editor } from "slate"
import { get_node_type , GroupNode , paragraph_prototype } from "../elements"

export { set_inline , set_support }

/** 
 * 这个插件告诉编辑器所有 InlineNode 要作为 inline 样式渲染。
 * @param editor 这个插件服务的编辑器。
 * @returns editor
 */
function set_inline(editor: Editor): Editor{
    const isInline = editor.isInline

    editor.isInline = (element: Element): boolean => {
        return isInline(element) || get_node_type(element) == "inline"
    }

    return editor
}
/** 
 * 这个插件告诉编辑器所有 SupportNode 要作为空节点处理。
 */
function set_support(editor: Editor): Editor{
    const isVoid = editor.isVoid

    editor.isVoid = (element: Element): boolean => {
        return isVoid(element) || get_node_type(element) == "support"
    }

    return editor
}