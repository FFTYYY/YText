import {
    Typography , 
    Box , 
    Paper , 
} from "@mui/material"
import type {
    TypographyProps , 
    PaperProps , 
    BoxProps , 
} from "@mui/material"


import { Node } from "slate"
import type  { PrinterRenderFunc_Props } from "../../printer"
import { GroupNode} from "../../core/elements"
import type { PrinterRenderer } from "../../printer"
import { OrderEffector , InjectEffector , ConsumeEffector , BasicEffector} from "./effecter"
import { PrinterBox , PrinterParagraph , PrinterInlineTitle } from "./basic/components"
import type { ValidParameter } from "../../core/elements"
import type { PrinterEnv , PrinterContext } from "../../printer"
import { AutoStack } from "../basic"
import type {InjectFunction} from "./effecter"

export { get_DefaultGroupPrinter }

type RenderFunction<NT> = (props: {element: NT, context: PrinterContext}) => any

function get_DefaultGroupPrinter(
    extra_effectors: BasicEffector[] = [], 
    inject_pre: InjectFunction<GroupNode> = (props)=><></>, 
    inject_suf: InjectFunction<GroupNode> = (props)=><></>, 
    render_pre: RenderFunction<GroupNode> = (props)=><></> , 
    render_suf: RenderFunction<GroupNode> = (props)=><></> , 
){
    let RP = render_pre
    let RS = render_suf
    let inject_effector = new InjectEffector<GroupNode>("global-injector" , "global-injector" , inject_pre , inject_suf)

    return {
        render_func: (props: PrinterRenderFunc_Props) => {
            let element = props.element as GroupNode 

            return <PrinterBox>
                <RP element={element} context={props.context}/>
                {props.children}
                <RS element={element} context={props.context}/>
            </PrinterBox>
        } , 
        enter_effect: (element: GroupNode, env: PrinterEnv): [PrinterEnv,PrinterContext] => {    
            let ret: [PrinterEnv , PrinterContext] = [ env , {} ]
            
            for(let extra_eff of extra_effectors){
                ret = extra_eff.enter_fuse(element , ret[0] , ret[1])
            }
            ret = inject_effector.enter_fuse(element , ret[0] , ret[1])
    
            return ret
        } , 
        exit_effect: (element: GroupNode, env: PrinterEnv , context: PrinterContext):[PrinterEnv,PrinterContext] => {    
            let ret: [PrinterEnv , PrinterContext] = [ env , context ]
    
            for(let extra_eff of extra_effectors){
                ret = extra_eff.exit_fuse(element , ret[0] , ret[1])
            }
            ret = inject_effector.exit_fuse(element , ret[0] , ret[1])
    
            return ret
        } , 
    }
}

