import React from "react"
import {
    Box , 
} from "@mui/material"

import {
    MouselessRegister , 
    MouselessRun , 
} from "./manager"

export {
    MouselessElement , 
}

export type {
    MouselessElementProps , 
}

interface MouselessElementProps{
    space: string
    position: string 
    run: MouselessRun
    children: React.ReactChild | React.ReactChild[]
}

function MouselessElement(props: MouselessElementProps){
    let {space, position, run, children} = props

    let [act, set_act] = React.useState(false)
    let [regiester_func, unregister_func] = React.useContext(MouselessRegister)

    React.useEffect(()=>{
        console.log("???")
        regiester_func(space, position, ()=>set_act(true), ()=>set_act(false), run)

        return ()=>{
            unregister_func(space, position)
        }
    }, [props.space, props.position, props.run, props.children])

    return <Box sx={{
        border: act? "2px solid #112233" : "none"
    }}>
        {props.children}
    </Box>
}
