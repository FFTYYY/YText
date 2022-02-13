/** 这个模块提供一些基础设施。
 * @module
 */

import Box from '@mui/material/Box';
import { createTheme, ThemeProvider, styled , makeStyles } from '@mui/material/styles';
import React from "react";

export {FilledStyle , ScrollFilledStyle}

/**
 * 一个填满父元素的元素。
 */
let FilledStyle = {
    width: "100%" , 
    height: "100%" , 
    overflow: "hidden" ,     
} as React.CSSProperties 


/** 一个填满父元素的元素，但是可以滚动。 */
let ScrollFilledStyle = {
    width: "100%" , 
    height: "100%" , 
    overflow: "auto" ,     
} as React.CSSProperties

