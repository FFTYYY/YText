import {
	Printer ,
	PrinterComponent ,
	FirstClassConcept , 
	SecondClassConcept ,  
	default_theme , 
	PrinterBackgroundPaper , 
	RendererhDict, 
	DefaultRendererhDict, 
} from "../lib"

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

export {theme}

// 递归合并两个对象的每一项。
function merge_object(obj_1: any, obj_2: any){
    if(obj_1 == undefined)
        return obj_2
    if(obj_2 == undefined)
        return obj_1
    
    // 但凡遇到叶子节点，优先以obj_2为准
    if(typeof obj_2 == "string" || typeof obj_2 == "number" || typeof obj_2 == "boolean"){
        return obj_2
    }
    // 但凡遇到叶子节点，就返回。
    if(typeof obj_1 == "string" || typeof obj_1 == "number" || typeof obj_1 == "boolean"){
        return obj_1
    }

    let ret = {}
    for(let key in {...obj_1,...obj_2}){
        ret[key] = merge_object(obj_1[key] , obj_2[key])
    }
    return ret
}


let my_theme = {
    margins: {
        paragraph: "0.4rem" ,  
        special: "1.0rem" ,  
        colon: "1rem" ,  
        level: "2rem" ,  
    } , 
    fonts: {
        body: {
            fontFamily: "STXihei" , 
        },
        title: {
            fontFamily: "SimHei" , 
        } , 
        structure: {
            fontFamily: "SimHei" , 
        } , 
        display: {
            fontFamily: "KaiTi" , 
        } , 
        weaken: {
            fontFamily: "FangSong" , 
        }
    } , 
}

let theme = merge_object(default_theme , my_theme)