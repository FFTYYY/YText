import {
    Typography , 
    Box , 
    Paper , 
} from "@mui/material"
import { Node } from "slate"
import type  { PrinterRenderFunc_Props } from "../../printer"
import  { make_print_renderer } from "../../printer"
import { PrinterParagraphBox } from "./basic/components"
import type { PrinterEnv , PrinterContext } from "../../printer"
import { OrderEffector , InjectEffector , ConsumeEffector} from "./effecter"
import React from "react"

export { get_DefaultParagraphPrinter }

function get_DefaultParagraphPrinter(){ 
    let consumer_effector = new ConsumeEffector("injector" , "injector")

    return {
        render_func: (props: PrinterRenderFunc_Props) => {
            let element = props.element 
            let extra =  consumer_effector.get_context(props.context)


            return <PrinterParagraphBox>
                <Box sx={{display:"inline-block"}}>{
                    Object.keys(extra).map((key)=><React.Fragment key={key}>{extra[key]}</React.Fragment>
                )}</Box>
                {props.children}
            </PrinterParagraphBox>
        } , 
        enter_effect: (element: Node, env: PrinterEnv): [PrinterEnv,PrinterContext] => {  
            let ret: [PrinterEnv , PrinterContext] = [ env , {} ]
    
            ret = consumer_effector.enter_fuse(element , ret[0] , ret[1])
    
            return ret
        } , 
        exit_effect: (element: Node, env: PrinterEnv , context: PrinterContext):[PrinterEnv,PrinterContext] => {    
            let ret: [PrinterEnv , PrinterContext] = [ env , context ]
    
            ret = consumer_effector.exit_fuse(element , ret[0] , ret[1])
    
            return ret
        } , 
    }
}