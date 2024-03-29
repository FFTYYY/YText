import { GroupStyle , InlineStyle , AbstractStyle , SupportStyle , StructStyle } from "../../../../libeditor"



export { 
    brightwords_style , 
    followwords_style , 
    dimwords_style , 
    mount_style , 
    display_style , 
    newpara_style , 
    sectioner_style , 
    ender_style , 
    strong_style , 
    image_style , 
    alignedwords_style , 
    delete_style , 
    link_style , 
    subwords_style , 
    mathinline_style , 
    mathblock_style ,
    formatted_style , 
    subsection_style , 
    showchildren_style , 
    insertchildren_style , 
}

// js的处理器 识别不了ts标志，所以放到SPLIT前面
let type_string : "string" = "string"
let type_choice : "choice" = "choice"

// --- SPLIT ----
// ↑是为了给处理用的python脚本一个定位标志。

/** 这个函数为参数添加上类型。 */
// function make(dict: {[key: string]: string | boolean | number}){
function make(dict){
        return Object.keys(dict).reduce((obj , k)=>({...obj ,[k]: {
            type: typeof(dict[k]) , 
            val: dict[k]
    }}) , {})
}

var univ_lab = {
    label: "显示的名称" , 
}
/**
 * 关于`title`和`prefix`：`title`是附着在文本之外的，`prefix`则是文本的开头而已。
 */
var w_univ_par = {
    prefix: {val: "" , type: type_string} , 
    suffix: {val: "" , type: type_string} , 
    title:  {val: "" , type: type_string} , 
    close:  {val: "" , type: type_string} , 
    ordering: {
        val: "chinese" , 
        type: type_choice ,
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

var w_univ_lab = {
    ... univ_lab , 
    prefix: "文本前缀" , 
    suffix: "文本后缀" , 
    title: "入" , 
    close: "出" , 
    ordering: "编号格式"
}

var brightwords_style = new GroupStyle   ("昭言"   , {...w_univ_par , ...make({label: "昭言"})} , {...w_univ_lab})
var followwords_style = new GroupStyle   ("随言"   , {...w_univ_par , ...make({label: "随言"})} , {...w_univ_lab})
let subwords_style    = new GroupStyle   ("属言"   , 
    {...w_univ_par , ...make({label: "属言" , clustering: true})} , 
    {...w_univ_lab , clustering: "是否只在连缀的时候设置编号"}
)
var alignedwords_style= new StructStyle  ("齐言"   , 
    {...w_univ_par , ...make({ label: "齐言" , widths: "1"}) } , 
    {...w_univ_lab , widths: "（相对）宽度列表，用逗号分隔"} , 
)
var dimwords_style    = new AbstractStyle("穆言"   , {} , {})
var mathblock_style   = new GroupStyle   ("数学言" , 
    {...w_univ_par , ...make({ label: "数学" , environ: "align"})} , 
    {...w_univ_lab , environ: "环境"} , 
)
var mount_style       = new GroupStyle   ("裱示"   , {...w_univ_par , ...make({label: "裱示" , center: true})} , {...w_univ_lab})
var display_style     = new GroupStyle   ("彰示"   , {...w_univ_par , ...make({label: "彰示"})} , {...w_univ_lab})
var formatted_style   = new GroupStyle   ("格示"   , {...w_univ_par , ...make({label: "格示"})} , {...w_univ_lab})
var strong_style      = new InlineStyle  ("强调"   , make( { label: "强调" }) , {...univ_lab})
var delete_style      = new InlineStyle  ("刊调"   , make( { label: "刊调" }) , {...univ_lab})
let link_style        = new InlineStyle  ("链调"   , 
    {
        ... make( { label: "链接" , target: "" , autotext: false} ) , 
        type: {val: "index" , type: "choice" , choices: ["index" , "outer-index" , "http"]}
    }, 
    { ...univ_lab , target: "如何查找目标" , type: "目标格式（ index / outer-index / http ）" , autotext: "是否自动确定文本。" }
)
var image_style       = new SupportStyle ("图调"   , 
    {
        ...make( { label: "图片" , target: ""  , width: 10 , height: -1} )  , 
        type: {val: "internal" , type: "choice" , choices: ["internal" , "http"]}
    }, 
    {...univ_lab , target: "如何查找目标" , type: "目标格式（ internal / http ）" , width: "图片宽度（rem）" , height: "图片高度（rem）"}  , 
    { forceInline: true }
)
var mathinline_style  = new InlineStyle  ("数学调" , make( { label: "数学"} )  , {...univ_lab})

var newpara_style     = new SupportStyle ("新段"   , make( { } ) ) // 这个元素不渲染，所以没有`label`。
var subsection_style  = new GroupStyle   ("次节"   , make( { label: "次节" , title: "" } ) )
var sectioner_style   = new SupportStyle ("小节线" , make( { label: "小节" , title: "" , alone: false } ) )
var ender_style       = new SupportStyle ("章节线" , make( { label: "章" , } ) )
var showchildren_style = new SupportStyle ("展示子节点" , make( { 
    label: "展示子节点" , 
    max_height: -1 , 
    min_height: -1 , 
    scroll: true , 
} ) )

var insertchildren_style = new SupportStyle ("插入子节点" , make( { 
    label: "插入子节点" , 
    no_ender: true , 
} ) )
