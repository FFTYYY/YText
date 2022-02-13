import Box from '@mui/material/Box';
import { createTheme, ThemeProvider, styled , makeStyles } from '@mui/material/styles';
import React from "react";

export {OnlyFixedComponent , OnlyScrollFixedComponent , FixedComponent , ScrollFixedComponent}

let FixedComponent = {
    width: "100%" , 
    height: "100%" , 
    overflow: "hidden" ,     
} as React.CSSProperties 

let ScrollFixedComponent = {
    position: "absolute" , 
    width: "100%" , 
    height: "100%" , 
    overflow: "auto" ,     
} as React.CSSProperties

let OnlyFixedComponent = {
    position: "absolute" , 
    width: "100%" , 
    height: "100%" , 
    overflow: "hidden" ,     
} as React.CSSProperties 

let OnlyScrollFixedComponent = {
    position: "absolute" , 
    width: "100%" , 
    height: "100%" , 
    overflow: "auto" ,     
} as React.CSSProperties
