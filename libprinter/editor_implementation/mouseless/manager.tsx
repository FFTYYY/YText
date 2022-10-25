/** 这个模块定义键盘按下事件处理器。 
 * @module
*/

import React from "react"
import produce from "immer"
import {
    UnexpectedParametersError , 
} from "../../exceptions"

export type {
    OnKeyDownFunction , 
    OnKeyUpFunction , 
    DirectionKey , 
    RunKey , 
    MouselessActivateOperation , 
    MouselessUnActivateOperation , 
    MouselessRun , 
    MouselessRegisterFunction , 
    MouselessUnRegisterFunction , 
    MouselessRegisteration , 
    KeyEventManagerSpaceItem , 
    KeyEventManagerNonSpaceItem , 
    KeyEventManagerProps , 
    KeyEventManagerState , 
}

export {
    KeyDownUpFunctionProxy ,
    is_direction ,
    is_enter ,
    MouselessRegister ,
    KeyEventManager ,
}

/** 按键按下时的操作。 */
type OnKeyDownFunction = (e: React.KeyboardEvent<HTMLDivElement>)=>boolean

/** 按键抬起时的操作。 */
type OnKeyUpFunction = (e: React.KeyboardEvent<HTMLDivElement>)=>boolean

/** 按键管理器向子节点提供按键按下操作和抬起操作的上下文。 */
var KeyDownUpFunctionProxy = React.createContext<[OnKeyDownFunction | undefined,OnKeyUpFunction | undefined]>([undefined , undefined])


/** 所有方向按键。 */
type DirectionKey = "ArrowLeft" | "ArrowRight" | "ArrowDown" | "ArrowUp"

/** enter键。 */
type RunKey = "Enter"

/** 判断一个按键是不是方向键。 */
function is_direction(key: string): key is DirectionKey{
    return key == "ArrowLeft" || key == "ArrowRight" || key == "ArrowDown" || key == "ArrowUp"
} 

/** 判断一个按键是不是enter。 */
function is_enter(key: string): key is RunKey{
    return key == "Enter"
} 

/** 无鼠标元素激活操作。 */
type MouselessActivateOperation = ()=>void

/** 无鼠标元素取消激活操作。 */
type MouselessUnActivateOperation = ()=>void

/** 无鼠标元素响应操作。 */
type MouselessRun = ()=>void

/** 无鼠标元素注册函数。 */
type MouselessRegisterFunction = ( 
    space: string, 
    position: string, 
    on_activate: MouselessActivateOperation, 
    on_unactivate: MouselessUnActivateOperation, 
    run: MouselessRun 
) => void

/** 无鼠标元素取消注册函数。 */
type MouselessUnRegisterFunction = ( 
    space: string, 
    position: string, 
) => void

/** 无鼠标元素在管理器中注册的值。 */
interface MouselessRegisteration {
    activate: MouselessActivateOperation
    unactivate: MouselessUnActivateOperation
    run: MouselessRun
}

/** 提供无鼠标元素注册函数的上下文。 */
let MouselessRegister = React.createContext<[MouselessRegisterFunction, MouselessUnRegisterFunction]>([()=>{}, ()=>{}])

/** 按键管理器的空间元素描述。 */
interface KeyEventManagerSpaceItem{
    /** 匹配用按键。*/
    key: string

    /** 第一次聚焦时的位置。 */
    activate_position: (position_list: string[], cur_position: string) => string

    /** 按下方向键时的聚焦切换。 */
    switch_position: (position_list: string[], cur_position: string, direction: DirectionKey) => string
}

/** 按键事件管理器的非空间元素描述。 */
interface KeyEventManagerNonSpaceItem{
    
    /** 匹配用按键。*/
    key: string

    /** 按下时操作。 */
    on_activate: (event)=>boolean
}

/** 按键事件管理器的`props`。 */
interface KeyEventManagerProps{
    spaces: KeyEventManagerSpaceItem[]
    non_space_oprations: KeyEventManagerNonSpaceItem[]

    children: React.ReactChild | React.ReactChild[]
}
/** 按键事件管理器的`state`。 */
interface KeyEventManagerState{
    /** 只在按下ctrl的状态下有效，记录哪些键和ctrl同时被按下了。 */
    ctrl_key: {[key: string]: boolean}

    /** 记录每个空间的当前激活位置。 */
    cur_positions: {[space:string]: string}

    /** 记录每个空间中有的元素。 */
    elements: {[space:string]: {[position: string]: MouselessRegisteration}}
}

/** 按键事件管理器。 */
class KeyEventManager extends React.Component<KeyEventManagerProps, KeyEventManagerState>{
    spaces: {[key: string]: KeyEventManagerSpaceItem}
    non_space_oprations: {[key: string]: KeyEventManagerNonSpaceItem}

    constructor(props: KeyEventManagerProps){
        super(props)

        this.state = {
            ctrl_key: {} , 
            cur_positions: {} , 
            elements: {} , 
        }

        this.update_props()
    }

    /** 目前ctrl键是否处于按下状态。 */
    ctrl_down(){
        return this.state.ctrl_key["Control"]
    }

    /** 查询当前哪个空间正在被激活。 */
    get_cur_activating(){
        for(let x in this.state.cur_positions){
            if(this.state.ctrl_key[x]){
                return x
            }
        }
        return undefined
    }

    /** 获得一个空间的位置。 */
    get_cur_position(space: string){
        return this.state.cur_positions[space]
    }

    /** 设置一个空间的位置。 */
    set_cur_position(space: string, position:string){
        this.setState({cur_positions: {...this.state.cur_positions, [space]: position}})
    }

    /** 获取一个空间内的所有元素位置。 */
    get_position_list(space: string): string[]{
        let ret = this.state.elements[space]
        if(ret == undefined){
            return []
        }
        return Object.keys(ret)
    }

    /** 获取一个具体的元素的操作函数。 */
    get_position_operation(
        space: string , 
        position: string , 
        operation: keyof MouselessRegisteration , 
    ): MouselessRegisteration[keyof MouselessRegisteration] | undefined{
        let _ret1 = this.state.elements[space]
        if(_ret1 == undefined){
            return undefined
        }
        let _ret2 = _ret1[position]
        if(_ret2 == undefined){
            return undefined
        }
        return _ret2[operation]
    }

    /** 新激活一个位置。 
     * 注意，这个函数通常不需要调用，因为会在当前激活元素切换时在componentDidUpdate中自动调用。
    */
    activate_position(space: string, position: string){
        let opration = this.get_position_operation(space, position, "activate")
        if(opration != undefined){
            opration()
        }
    }

    /** 取消激活一个位置。 
     * 注意，这个函数通常不需要调用，因为会在当前激活元素切换时在componentDidUpdate中自动调用。
    */
    unactivate_position(space: string, position: string){
        let opration = this.get_position_operation(space, position, "unactivate")
        if(opration != undefined){
            opration()
        }
    }

    /** 调用一个位置。 */
    run_position(space: string, position: string){
        let opration = this.get_position_operation(space, position, "run")
        if(opration != undefined){
            opration()
        }
    }

    /** 激活一个位置，并自动修改`cur_position`状态，并取消激活之前的位置。 */
    activate_position_and_unactivate_old(space: string, position: string){
        this.setState(produce(this.state, state=>{ // 修改状态。
            state.cur_positions[space] = position
        }))

    }

    /** 注册一个空间 */
    regester_space(
        space: string, 
        position: string, 
        on_activate: MouselessActivateOperation, 
        on_unactivate: MouselessUnActivateOperation, 
        run: MouselessRun
    ){
        if(this.state.elements[space] == undefined){
            this.setState(produce(this.state, state=>{
                state.elements[space] = {
                    [position]: { // 如果之前不存在这个空间，那么空间中只有一个元素。
                        activate: on_activate,
                        unactivate: on_unactivate , 
                        run: run , 
                    }
                }
            }))
            return 
        }

        this.setState(produce(this.state, state=>{
            state.elements[space][position] = { // 如果存在空间，则直接设置空间中的对应位置。
                activate: on_activate,
                unactivate: on_unactivate , 
                run: run , 
            }
        }))
    }

    /** 取消一个空间。 */
    unregister_space(space: string, position: string){
        if(this.state.elements[space] == undefined){ // 如果空间还不存在，说明根本没注册过。
            throw new UnexpectedParametersError("can not unregister a position that is not registered.")
        }
        
        this.setState(produce(this.state, state=>{
            delete state.elements[space][position]
        }))
    }

    /** 这个函数从`props`整理出自身的`spaces`和`non_space_oprations`属性。 */
    update_props(){

        // 只有不一样时才会更新。
        if(this.spaces == undefined || JSON.stringify(Object.keys(this.props.spaces)) != JSON.stringify(Object.keys(this.spaces))){
            this.spaces = {}
            for(let x of this.props.spaces){
                this.spaces[x.key] = x
            }    
        }
        if(this.non_space_oprations == undefined || JSON.stringify(Object.keys(this.props.non_space_oprations)) != JSON.stringify(Object.keys(this.non_space_oprations))){
            this.non_space_oprations = {}
            for(let x of this.props.non_space_oprations){
                this.non_space_oprations[x.key] = x
            }
        }
    }

    componentDidMount(): void {
        this.update_props()
    }

    componentDidUpdate(prevProps: Readonly<KeyEventManagerProps>, prevState: Readonly<KeyEventManagerState>): void {
        this.update_props() // 如果props修改了，调用更新props函数。

        // 自动处理`cur_position`的切换。
        for(let space in this.state.cur_positions){
            let new_cur = this.state.cur_positions[space]
            let old_cur = prevState.cur_positions[space]
            if(new_cur != old_cur){
                if(old_cur != undefined){ // 如果是从某个位置切换过来的，取消其激活。
                    this.unactivate_position(space, old_cur)
                }
                this.activate_position(space, new_cur)
            }
        }
    }

    /** 给定一个新的按键事件，设置自己的`ctrl_key`状态。 */
    flush_key_state(keydown: boolean , e: React.KeyboardEvent<HTMLDivElement>){
        let me = this
        if(e.ctrlKey){ 
            if(keydown){ // 如果按下了ctrl，记录新按下了哪个键
                if(!me.state.ctrl_key[e.key]){
                    me.setState({ctrl_key: {...me.state.ctrl_key , [e.key]: true}})
                }
            }
            else{ // 如果按下了ctrl，记录新抬起了哪个键
                if(me.state.ctrl_key[e.key]){
                    me.setState({ctrl_key: {...me.state.ctrl_key , [e.key]: undefined}})
                }
            }
        }
        else{ // 如果没有按下ctrl，就清空状态。
            if(Object.keys( me.state.ctrl_key ).length > 0){
                me.setState({
                    ctrl_key: {} , 
                })
            }
        }
    }

    /** 这个函数代理按键按下事件。注意因为所有的操作都会在按键抬起时处理，因此这个函数实质上不会做任何事，只是
     * 阻止那些将要被按键抬起函数处理的事件的传播。
     * @return 是否被处理。返回`true`表示事件将会在之后被按键抬起函数处理，否则表示不会被本处理器处理。
    */
    keydown_proxy(e: React.KeyboardEvent<HTMLDivElement>){
        this.flush_key_state(true, e)

        // 这个函数有三种可能：没有按下ctrl因此什么也不做、激活了某一个空间或者非空间操作、在某个空间激活的情况下进行移动。

        // 没有按下ctrl因此什么也不做。
        if(!this.ctrl_down()){
            return false
        }

        let cur_key = e.key

        // 激活某个非空间操作。
        if(this.non_space_oprations[cur_key]){ // 存在一个这个key的非空间操作。 
            e.preventDefault()
            return true
        }

        // 激活某个空间。
        if(this.spaces[cur_key]){ // 刚刚激活一个空间。
            e.preventDefault()
            return true
        }

        // 如果当前某个空间已经被激活，且正在使用方向键在空间中移动，或者使用回车键触发某个元素。
        let cur_space = this.get_cur_activating()
        if(cur_space){ 
            if(is_direction(cur_key) || is_enter(cur_key)){ 
                e.preventDefault()
                return true    
            }
        }

        return false
    }


    /** 这个函数代理按键抬起事件，但是注意，只有当事件被自身所处理时才会阻止事件传递。 
     * @return 是否被处理。返回`true`表示事件被本处理器处理了，否则表示没有被本处理器处理。
    */
    keyup_proxy(e: React.KeyboardEvent<HTMLDivElement>){
        this.flush_key_state(true, e)

        // 这个函数有三种可能：没有按下ctrl因此什么也不做、激活了某一个空间或者非空间操作、在某个空间激活的情况下进行移动。

        // 没有按下ctrl因此什么也不做。
        if(!this.ctrl_down()){
            return false
        }

        let cur_key = e.key

        // 激活某个非空间操作。
        if(this.non_space_oprations[cur_key]){ // 存在一个这个key的非空间操作。 
            this.non_space_oprations[cur_key].on_activate(e)
            e.preventDefault()
            return true
        }

        // 激活某个空间。
        if(this.spaces[cur_key]){ // 刚刚激活一个空间。
            let cur_space = cur_key

            let position_list = this.get_position_list(cur_space)
            let cur_position = this.get_cur_position(cur_space)
            let new_position = this.spaces[cur_space].activate_position(position_list, cur_position)
            this.setState(produce(this.state, state=>{
                state.cur_positions[cur_space] = new_position
            }))
            // 不用处理激活的问题，componentDidUpdate会自动处理。
            e.preventDefault()
            return true
        }

        // 如果当前某个空间已经被激活，且正在使用方向键在空间中移动，或者使用回车键触发某个元素。
        let cur_space = this.get_cur_activating()
        if(cur_space){ 
            if(is_direction(cur_key)){ // 当前按下了方向键。
                let cur_dir = cur_key

                let position_list = this.get_position_list(cur_space)
                let cur_position = this.get_cur_position(cur_space)    
                let new_position = this.spaces[cur_space].switch_position(position_list, cur_position, cur_dir)
                this.setState(produce(this.state, state=>{
                    state.cur_positions[cur_space] = new_position
                }))
                // 不用处理激活的问题，componentDidUpdate会自动处理。
                e.preventDefault()
                return true    
            }
            if(is_enter(cur_key)){ // 当前按下了enter键。
                let cur_position = this.get_cur_position(cur_space)    
                this.run_position(cur_space, cur_position)
            }
        }

        return false
    }

    render(){
        let me = this
        return <KeyDownUpFunctionProxy.Provider value = {[ // 提供按键抬起和按下的上下文。
            me.keydown_proxy.bind(me) , 
            me.keyup_proxy.bind(me) , 
        ]}>
            <MouselessRegister.Provider value = {[ // 提供注册和取消注册空间的上下文。
                me.regester_space.bind(me) , 
                me.unregister_space.bind(me) , 
            ]}>
                {me.props.children}
            </MouselessRegister.Provider>
        </KeyDownUpFunctionProxy.Provider>
    }
}

