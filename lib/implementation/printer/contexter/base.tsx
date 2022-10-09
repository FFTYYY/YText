/** 这个模块定义所有预处理时处理上下文的工具的基类。
 * @module
 */
import { 
    Env , 
    Context , 
    PrinterEnterFunction , 
    PrinterExitFunction , 
} from "../../../core/renderer"
import { 
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
	get_node_type , 

} from "../../../core/intermidiate"
 
export { ContexterBase }
  

/**
 * 这个类定义一个预处理时的处理上下文的工具的基类。
 * 每个上下文工具以这样的方式运作：
 * - 每个上下文工具有一个唯一的名称，其只会操作环境和上下文中对应名称的项目。
 * - 每个上下文工具提供三个方法：进入方法、退出方法和询问方法，其中前两个方法在预处理时使用，而询问方法则是在渲染时从上下文中读出
 *   所约定的数据。
 * - 每个上下文工具自行维护是否需要进行下一次迭代。
 TODO 是不是需要提供一个『如果已经确定不需要二次迭代，那么下一次进入就会自动跳过』的方法啊？
 TODO 不要修改env和context
 */
class ContexterBase<NODETYPE = Node>{
    key: string
    default_val: string

    /**
     * 上下文工具的构造函数。
     * @param key 本工具的唯一名称。
     * @param default_val 如果环境还没创建，默认的环境。
     */
    constructor(key:string, default_val: any){
        this.key = key
        this.default_val = default_val
    }

    /** 进入时操作。子类需要重写这个函数。 */
    enter(node: NODETYPE , env: Env , context: Context): [Env , Context]{
        return [env , context]
    }
    /** 退出时操作。子类需要重写这个函数。 */
    exit(node: NODETYPE , env: Env , context: Context): [Env , Context, boolean]{
        return [env , context , true]
    }

    /** 这个函数确保自己的环境存在，如果没有就创建一个。 */
    ensure_env(env: Env): Env{
        if(env[this.key] == undefined){
            env[this.key] = this.default_val
        }
        return env
    }

    get_env(env: Env): any{
        env = this.ensure_env(env)
        return env[this.key]
    }

    set_env(env: Env , val: any){
        env = this.ensure_env(env)
        env[this.key] = val
        return env
    }

    get_context(context: Context): any{
        return context[this.key]
    }

    set_context(context: Context , val: any): Context{
        context[this.key] = val
        return context
    }

    make_context(val: any): Context{
        return {[this.key]: val}
    }

}