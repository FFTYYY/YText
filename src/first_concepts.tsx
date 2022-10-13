
import {
	Printer ,
	PrinterComponent ,
	FirstClassConcept , 
	SecondClassConcept ,  
    ParameterValue ,
    ParameterList , 
} from "../lib"

/** 自动添加type */
function make_param(parameters: ParameterList<ParameterValue | string | number | boolean>): ParameterList{
    let ret: ParameterList = {}
    for(let x in parameters){
        if(parameters[x] instanceof String){
            ret[x] = {
                type: "string" as "string" , 
                val : parameters[x] , 
            } as ParameterValue
        }
        else if(parameters[x] instanceof Number){
            ret[x] = {
                type: "number" as "number", 
                val : parameters[x] , 
            } as ParameterValue
        }
        else if(parameters[x] instanceof Boolean){
            ret[x] = {
                type: "boolean" as "boolean", 
                val : parameters[x] , 
            } as ParameterValue
        }
        else 
            ret[x] = parameters[x] as ParameterValue
    }
    return ret
}

/**
 * 关于`title`和`prefix`：`title`是附着在文本之外的，`prefix`则是文本的开头而已。
 */
var words_params = {
    prefix: "", 
    suffix: "", 
    title:  "", 
    close:  "", 
    ordering: {
        val: "chinese" , 
        type: "string" as "string" ,
        choices: [
            "chinese" , // 一
            "arab" ,  // 1
            "arab-circle" ,  // ①
            "chinese-bracket" , // 【一】
            "arab-bracket" ,  // [1]
            "arab-round-bracket" ,  // 1)
            "none"
        ] ,
    }
}

var brightwords_style = new FirstClassConcept({type: "group" , name: "昭言" , 
    parameterPrototype: make_param({
        ...words_params , 
        label: "昭言" ,
    })   
})


var followwords_style = new FirstClassConcept   ({type: "group", name: "随言"   , 
    parameterPrototype: make_param({
        ...words_params , 
        label: "随言" ,
    })   
})
var subwords_style    = new FirstClassConcept   ({type: "group", name: "属言"   , 
    parameterPrototype: make_param({
        ...words_params , 
        label: "属言" ,
    })   
})
var mathblock_style   = new FirstClassConcept   ({type: "group", name: "数学言" , 
    parameterPrototype: make_param({
        ...words_params , 
        label: "数学" ,
        environ: "align" , 
    })   
})


// TODO 居中？
var mount_style       = new FirstClassConcept   ({type: "group", name: "裱示"   , 
    parameterPrototype: make_param({
        ...words_params , 
        label: "裱示" ,
    })
})
var display_style     = new FirstClassConcept   ({type: "group", name: "彰示"   , 
    parameterPrototype: make_param({
        ...words_params , 
        label: "彰示" ,
    })
})
var formatted_style   = new FirstClassConcept   ({type: "group", name: "格示"   , 
    parameterPrototype: make_param({
        ...words_params , 
        label: "格示" ,
    })
})

var subsection_style  = new FirstClassConcept   ({type: "group", name: "次节"   , 
    parameterPrototype: make_param({
        label: "次节" ,
        title: "" , 
    })
})

var strong_style      = new FirstClassConcept  ({type: "inline", name: "强"   , 
    parameterPrototype: make_param({
        label: "强" ,
    })
})
var delete_style      = new FirstClassConcept  ({type: "inline", name: "刊"   , 
    parameterPrototype: make_param({
        label: "刊" ,
    })
})

var delete_style      = new FirstClassConcept  ({type: "inline", name: "引"   , 
    parameterPrototype: make_param({
        label: "引" ,
        target: "" , 
        autotext: false , 
    })
})

var mathinline_style  = new FirstClassConcept  ({type: "inline", name: "数学" , 
    parameterPrototype: make_param({
        label: "数学" ,
    })
})


var image_style       = new FirstClassConcept ({type: "support", name: "图"   , 
    parameterPrototype: make_param({ 
        label: "图片" , 
        target: ""  , 
        width: 10 , 
        height: -1 , 
    }) , 
    metaParameters: { forceInline: true }
})

var newpara_style     = new FirstClassConcept ({type: "group", name: "新段"   , 
    parameterPrototype: make_param( { } ) 
}) // 这个元素不渲染，所以没有`label`。
var sectioner_style   = new FirstClassConcept ({type: "group", name: "小节线" , 
    parameterPrototype: make_param( { 
        label: "小节" , 
        title: "" , 
        alone: false 
    } ) 
})
var ender_style       = new FirstClassConcept ({type: "group", name: "章节线" , 
    parameterPrototype: make_param( { 
        label: "章" , 
    } ) 
})

// var alignedwords_style= new FirstClassConcept  ({type: "group", name: "齐言"   , 
//     {...w_univ_par , ...make({ label: "齐言" , widths: "1"}) } , 
//     {...w_univ_lab , widths: "（相对）宽度列表，用逗号分隔"} , 
// })

// var dimwords_style    = new FirstClassConcept({type: "group", name: "穆言"   , {} , {})


// var showchildren_style = new FirstClassConcept ({type: "group", name: "展示子节点" , make( { 
//     label: "展示子节点" , 
//     max_height: -1 , 
//     min_height: -1 , 
//     scroll: true , 
// } ) })

// var insertchildren_style = new FirstClassConcept ({type: "group", name: "插入子节点" , make( { 
//     label: "插入子节点" , 
//     no_ender: true , 
// } ) })


