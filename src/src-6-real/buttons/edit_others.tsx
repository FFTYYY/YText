import { 
	Snackbar , 
    SnackbarOrigin , 
    Button , 
    IconButton , 
    Drawer , 
    Paper, 
    Typography, 
    Divider, 
    Box, 
    TextField , 
    Popover , 
    InputAdornment , 
    Link
} from "@mui/material"
import { Node } from "slate"
import {
	EditorComponent , 
	AutoTooltip , 
	AutoIconButton , 
    AutoStack,
} 
from "../../../lib"
import {
    FollowTheSigns as FollowTheSignsIcon , 
    AirlineSeatFlatAngled as AirlineSeatFlatAngledIcon  , 
    AirlineSeatFlatAngledOutlined as AirlineSeatFlatAngledOutlinedIcon  , 
    AccessibleForward as AccessibleForwardIcon  , 
} 
from "@mui/icons-material"

import React from "react"

export { BackendEdit , NodeStructEdit , NodeStructEditShallow , NodeView }

function ButtonLikeLink(props: {title: string , href: string , Icon: any}){
    let Icon = props.Icon
    return  <Box sx={{
        marginLeft: "0.35rem" , 
        marginRight: "0.25rem" , 
        marginTop: "0.35rem" , 
        
    }}>
        <AutoTooltip title={props.title}>
            <Link underline="hover" href={props.href}>
                <Icon fontSize="small" color="primary"/>
            </Link>
        </AutoTooltip>
    </Box>
}

function BackendEdit(props: {}){

    return <ButtonLikeLink 
        title = "后台页面"
        href = {"#"}
        Icon = {FollowTheSignsIcon}
    />
}

function NodeStructEdit(props: {}){

    return <ButtonLikeLink 
        title = "编辑子节点结构"
        href = {"#"}
        Icon = {AirlineSeatFlatAngledIcon}
    />
}


function NodeStructEditShallow(props: {}){

    return <ButtonLikeLink 
        title = "（浅）编辑子节点结构"
        href = {"#"}
        Icon = {AirlineSeatFlatAngledOutlinedIcon}
    />
}

function NodeView(props: {}){

    return <ButtonLikeLink 
        title = "预览页面（有什么必要吗）"
        href = {"#"}
        Icon = {AccessibleForwardIcon }
    />
}

