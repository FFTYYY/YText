import {
    GroupNode , 
    StructNode , 
    SupportNode , 
    InlineNode , 
    ParagraphNode , 
    TextNode , 
    Node , 
    validate , 
} from "../../libprinter"

export {tree}

function make_parameters(parameters){
    for(let x in parameters){
        if(parameters[x]["type"] == "choice"){
            parameters[x].type = "string"
        }
    }
    return parameters
}

function create_group(concept , parameters , children , relation , idx = undefined): GroupNode{

    for(let x in parameters){
        if ( (parameters[x]) instanceof String){
            parameters[x] = {
                type: "string" , 
                val: parameters[x] , 
            }
        }
        else if ( (parameters[x]) instanceof Number){
            parameters[x] = {
                type: "number" , 
                val: parameters[x] , 
            }
        }
    }

    return {
        type: "group" as "group" , 
        idx: idx || Math.floor( Math.random() * 233333) , 
        concept: concept , 
        parameters: parameters , 
        children: children , 
        abstract: [] , 
        relation: relation , 
    }
    
}

function create_inline(concept , parameters , children , idx = undefined): InlineNode{
    if(children.length != 1)
    {
        throw "children length != 1"
    }
    return {
        type: "inline" as "inline" , 
        idx: idx || Math.floor( Math.random() * 233333) , 
        concept: concept , 
        parameters: parameters , 
        children: children , 
        abstract: [] , 
    }
}

function create_paragraph(children): ParagraphNode{
    return {
        children: children
    }
}

function create_text(text): TextNode{
    return {
        text: text
    }
}

function create_support(concept , parameters , idx= undefined): SupportNode{
    return {
        type: "support" , 
        idx: idx || Math.floor( Math.random() * 233333) , 
        concept: concept , 
        parameters: parameters , 
        children: [{children: [{text: "haha"}]}] , 
        abstract: [] , 

    }
}

function parse_concept(oldnode){
    let concept = "not-found"
    let parameters = {}
    if(oldnode["proxy_info"] && oldnode["proxy_info"].proxy_name){
        concept = oldnode["proxy_info"].proxy_name
        parameters = oldnode["proxy_info"].proxy_params
    }
    else{
        concept = oldnode["name"]
        parameters = oldnode["parameters"]

    }
    return [concept , make_parameters(parameters)]
}

function parse_children(oldnode){
    let old_c = oldnode.children
    let new_c: any[] = []
    for(let x of old_c){
        let c = parse(x)
        if(c)
            new_c.push(c)
    }
    return new_c
}

function parsetext(text){
    if(typeof(text) == "string"){
        return text
    }
    if(text instanceof Array){
        return text.map(x=>parsetext(x)).join("")
    }
    
    throw "wtf!"
    return text
}

function parse(oldnode){
    if(oldnode["type"] == "group"){
        let [concept , parameters] = parse_concept(oldnode)
        return create_group(concept , parameters, parse_children(oldnode) , oldnode["relation"] , oldnode["idx"])
    }
    if(oldnode["type"] == "inline"){
        let [concept , parameters] = parse_concept(oldnode)
        return create_inline(concept , parameters, parse_children(oldnode) , oldnode["idx"])
    }
    if(oldnode["type"] == "support"){
        let [concept , parameters] = parse_concept(oldnode)
        return create_support(concept , parameters, oldnode["idx"])
    }
    if(oldnode["type"] == "struct"){
        return {}
    }
    
    if(oldnode["text"] != undefined){
        return create_text(parsetext(oldnode["text"]))
    }
    if(oldnode["children"] != undefined){
        return create_paragraph(parse_children(oldnode))
    }
    throw "what the fuck?"
}

function convert_old_tree(json): GroupNode{
    let old_tree = JSON.parse(json)

    let ret = parse(old_tree) as GroupNode

    let [good , msg] = validate(ret)
    console.log("good? = " , good)
    console.log(msg)
    if(!good){
        console.log("not good!!!")
        console.log(msg)
        console.log("ret is" , ret)
        console.log("old is" , old_tree)
    }

    return ret
}

let tree = convert_old_tree(`
    {"idx": 22769458, "type": "group", "name": "root", "parameters": {"title": {"val": "\u6839", "type": "string"}}, "relation": "separating", "children": [{"idx": 5758810, "type": "support", "name": "\u5c0f\u8282\u7ebf", "parameters": {"label": {"val": "\u5c0f\u8282", "type": "string"}, "title": {"val": "\u5bf9\u5bf9\u4e22", "type": "string"}, "alone": {"val": false, "type": "boolean"}}, "children": [{"text": ""}], "hiddens": [], "flags": {}, "proxy_info": {"proxy_name": ""}}, {"children": [{"text": ""}, {"idx": 815249, "type": "inline", "name": "\u94fe\u8c03", "parameters": {"label": {"val": "\u94fe\u63a5", "type": "string"}, "target": {"val": "1:21753320", "type": "string"}, "autotext": {"val": true, "type": "boolean"}, "type": {"val": "outer-index", "type": "choice", "choices": ["index", "outer-index", "http"]}}, "children": [{"text": "\u8fd9\u662f\u4e00\u4e2a\u8fde\u63a5"}], "hiddens": [], "flags": {}, "proxy_info": {"proxy_name": "\u94fe\u63a5", "proxy_params": {"target": {"val": "1:21753320", "type": "string"}, "autotext": {"val": true, "type": "boolean"}, "type": {"val": "outer-index", "type": "choice", "choices": ["index", "outer-index", "http"]}}}}, {"text": "\u80dc\u591a\u8d1f\u5c11\u7684"}]}, {"children": [{"text": ""}, {"idx": 18541055, "type": "support", "name": "\u56fe\u8c03", "parameters": {"label": {"val": "\u56fe\u7247", "type": "string"}, "target": {"val": "hesuan", "type": "string"}, "width": {"val": 10, "type": "number"}, "height": {"val": -1, "type": "number"}, "type": {"val": "internal", "type": "choice", "choices": ["internal", "http"]}}, "children": [{"text": ""}], "hiddens": [], "flags": {"forceInline": true}, "proxy_info": {"proxy_name": "\u56fe\u7247", "proxy_params": {"target": {"val": "hesuan", "type": "string"}, "width": {"val": 10, "type": "number"}, "height": {"val": -1, "type": "number"}, "type": {"val": "internal", "type": "choice", "choices": ["internal", "http"]}}}}, {"text": "\u6c34\u7535\u8d39\u8d39\u963f\u8428\u5fb7sdfasdasdasdasdasdasdadasdaasdasdaaasdasdasdasddsasdSdasdasdasdasd"}]}, {"children": [{"text": ""}]}, {"children": [{"text": ""}]}, {"idx": 14258716, "type": "support", "name": "\u5c0f\u8282\u7ebf", "parameters": {"label": {"val": "\u5c0f\u8282", "type": "string"}, "title": {"val": "\u662f", "type": "string"}, "alone": {"val": false, "type": "boolean"}}, "children": [{"text": ""}], "hiddens": [], "flags": {}, "proxy_info": {"proxy_name": "\u5c0f\u8282\u7ebf", "proxy_params": {"label": {"val": "\u5c0f\u8282", "type": "string"}, "title": {"val": "\u662f", "type": "string"}, "alone": {"val": false, "type": "boolean"}}}}, {"children": [{"text": ""}]}, {"idx": 10985034, "type": "group", "name": "\u6570\u5b66\u8a00", "parameters": {"prefix": {"val": "", "type": "string"}, "suffix": {"val": "", "type": "string"}, "title": {"val": "", "type": "string"}, "close": {"val": "", "type": "string"}, "ordering": {"val": "chinese", "type": "choice", "choices": ["chinese", "arab", "arab-circle", "chinese-bracket", "number-bracket", "none"]}, "label": {"type": "string", "val": "\u6570\u5b66"}, "environ": {"type": "string", "val": "align"}}, "relation": "separating", "children": [{"children": [{"text": "1 + 1 & = 0 + 1 + 1 \\\\"}]}, {"children": [{"text": "& = 2 \\\\label{2}"}]}], "hiddens": [], "flags": {}, "proxy_info": {"proxy_name": "\u6570\u5b66-\u5757", "proxy_params": {"prefix": {"val": "", "type": "string"}, "suffix": {"val": "", "type": "string"}, "title": {"val": "", "type": "string"}, "close": {"val": "", "type": "string"}, "ordering": {"val": "chinese", "type": "choice", "choices": ["chinese", "arab", "arab-circle", "chinese-bracket", "number-bracket", "none"]}, "label": {"type": "string", "val": "\u6570\u5b66"}, "environ": {"type": "string", "val": "align"}}}}, {"children": [{"text": ""}]}, {"children": [{"text": "\u516c\u5f0f"}, {"idx": 10468386, "type": "inline", "name": "\u6570\u5b66\u8c03", "parameters": {"label": {"type": "string", "val": "\u6570\u5b66"}}, "children": [{"text": "\\ref{2}"}], "hiddens": [], "flags": {}, "proxy_info": {"proxy_name": "\u6570\u5b66-\u884c\u5185", "proxy_params": {"label": {"type": "string", "val": "\u6570\u5b66"}}}}, {"text": "\u8bf4\u660e\u4e86"}, {"idx": 19542202, "type": "inline", "name": "\u6570\u5b66\u8c03", "parameters": {"label": {"type": "string", "val": "\u6570\u5b66"}}, "children": [{"text": "1+1=2"}], "hiddens": [], "flags": {}, "proxy_info": {"proxy_name": "\u6570\u5b66-\u884c\u5185", "proxy_params": {"label": {"type": "string", "val": "\u6570\u5b66"}}}}, {"text": "\u8fd9\u4ef6\u4e8b\u60c5\u3002"}]}, {"children": [{"text": ""}]}, {"idx": 3069775, "type": "group", "name": "\u5c5e\u8a00", "parameters": {"prefix": {"val": "", "type": "string"}, "suffix": {"val": "", "type": "string"}, "title": {"val": "", "type": "string"}, "close": {"val": "", "type": "string"}, "ordering": {"val": "chinese", "type": "choice", "choices": ["chinese", "arab", "arab-circle", "chinese-bracket", "number-bracket", "none"]}, "label": {"val": "\u5217\u8868", "type": "string"}, "clustering": {"val": true, "type": "boolean"}}, "relation": "separating", "children": [{"children": [{"text": ""}]}], "hiddens": [], "flags": {}, "proxy_info": {"proxy_name": "\u5217\u8868", "proxy_params": {"ordering": {"val": "chinese", "type": "choice", "choices": ["chinese", "arab", "arab-circle", "chinese-bracket", "number-bracket", "none"]}}}}, {"children": [{"text": ""}]}, {"children": [{"text": ""}]}, {"idx": 15235578, "type": "group", "name": "\u662d\u8a00", "parameters": {"prefix": {"val": "", "type": "string"}, "suffix": {"val": "", "type": "string"}, "title": {"val": "\u5b9a\u7406", "type": "string"}, "close": {"val": "", "type": "string"}, "ordering": {"val": "chinese", "type": "choice", "choices": ["chinese", "arab", "arab-circle", "chinese-bracket", "number-bracket", "none"]}, "label": {"val": "\u5b9a\u7406", "type": "string"}}, "relation": "separating", "children": [{"children": [{"text": "\u6df1\u5ea6"}]}], "hiddens": [], "flags": {}, "proxy_info": {"proxy_name": "\u547d\u9898", "proxy_params": {"ordering": {"val": "chinese", "type": "choice", "choices": ["chinese", "arab", "arab-circle", "chinese-bracket", "number-bracket", "none"]}, "alias": {"val": "", "type": "string"}, "category": {"val": "\u5b9a\u7406", "type": "choice", "choices": ["\u5b9a\u7406", "\u5f15\u7406", "\u63a8\u8bba", "\u547d\u9898"]}}}}, {"children": [{"text": ""}]}, {"idx": 18421038, "type": "group", "name": "\u662d\u8a00", "parameters": {"prefix": {"val": "", "type": "string"}, "suffix": {"val": "", "type": "string"}, "title": {"val": "\u547d\u9898", "type": "string"}, "close": {"val": "", "type": "string"}, "ordering": {"val": "chinese", "type": "choice", "choices": ["chinese", "arab", "arab-circle", "chinese-bracket", "number-bracket", "none"]}, "label": {"val": "\u547d\u9898", "type": "string"}}, "relation": "separating", "children": [{"children": [{"text": "\u963f\u8428\u5fb7\u963f\u8428\u5fb7"}]}], "hiddens": [], "flags": {}, "proxy_info": {"proxy_name": "\u547d\u9898", "proxy_params": {"ordering": {"val": "chinese", "type": "choice", "choices": ["chinese", "arab", "arab-circle", "chinese-bracket", "number-bracket", "none"]}, "alias": {"val": "", "type": "string"}, "category": {"val": "\u547d\u9898", "type": "choice", "choices": ["\u5b9a\u7406", "\u5f15\u7406", "\u63a8\u8bba", "\u547d\u9898"]}}}}, {"children": [{"text": ""}]}, {"children": [{"text": ""}]}, {"idx": 1438268, "type": "group", "name": "\u662d\u8a00", "parameters": {"prefix": {"val": "", "type": "string"}, "suffix": {"val": "", "type": "string"}, "title": {"val": "\u5b9a\u7406", "type": "string"}, "close": {"val": "", "type": "string"}, "ordering": {"val": "chinese", "type": "choice", "choices": ["chinese", "arab", "arab-circle", "chinese-bracket", "number-bracket", "none"]}, "label": {"val": "\u5b9a\u7406", "type": "string"}}, "relation": "separating", "children": [{"children": [{"text": ""}]}], "hiddens": [], "flags": {}, "proxy_info": {"proxy_name": "\u547d\u9898", "proxy_params": {"ordering": {"val": "chinese", "type": "choice", "choices": ["chinese", "arab", "arab-circle", "chinese-bracket", "number-bracket", "none"]}, "alias": {"val": "", "type": "string"}, "category": {"val": "\u5b9a\u7406", "type": "choice", "choices": ["\u5b9a\u7406", "\u5f15\u7406", "\u63a8\u8bba", "\u547d\u9898"]}}}}, {"children": [{"text": ""}]}, {"idx": 788715, "type": "group", "name": "\u5f70\u793a", "parameters": {"prefix": {"val": "", "type": "string"}, "suffix": {"val": "", "type": "string"}, "title": {"val": "", "type": "string"}, "close": {"val": "", "type": "string"}, "ordering": {"val": "none", "type": "string"}, "label": {"val": "\u8282\u5f15", "type": "string"}}, "relation": "separating", "children": [{"children": [{"text": "waeew"}]}], "hiddens": [], "flags": {}, "proxy_info": {"proxy_name": "\u8282\u5f15", "proxy_params": {}}}, {"children": [{"text": ""}]}, {"idx": 6338541, "type": "group", "name": "\u88f1\u793a", "parameters": {"prefix": {"val": "", "type": "string"}, "suffix": {"val": "", "type": "string"}, "title": {"val": "", "type": "string"}, "close": {"val": "", "type": "string"}, "ordering": {"val": "chinese", "type": "choice", "choices": ["chinese", "arab", "arab-circle", "chinese-bracket", "number-bracket", "none"]}, "label": {"val": "\u5f15\u7528", "type": "string"}}, "relation": "separating", "children": [{"children": [{"text": "asd"}]}], "hiddens": [], "flags": {}, "proxy_info": {"proxy_name": "\u5f15\u7528", "proxy_params": {"prefix": {"val": "", "type": "string"}, "suffix": {"val": "", "type": "string"}, "title": {"val": "", "type": "string"}, "close": {"val": "", "type": "string"}, "ordering": {"val": "chinese", "type": "choice", "choices": ["chinese", "arab", "arab-circle", "chinese-bracket", "number-bracket", "none"]}}}}, {"children": [{"text": ""}]}, {"idx": 5265332, "type": "group", "name": "\u5c5e\u8a00", "parameters": {"prefix": {"val": "", "type": "string"}, "suffix": {"val": "", "type": "string"}, "title": {"val": "", "type": "string"}, "close": {"val": "", "type": "string"}, "ordering": {"val": "none", "type": "string"}, "label": {"val": "\u9610\u8ff0", "type": "string"}, "clustering": {"type": "boolean", "val": true}}, "relation": "separating", "children": [{"children": [{"text": "sad"}]}], "hiddens": [], "flags": {}, "proxy_info": {"proxy_name": "\u9610\u8ff0", "proxy_params": {"title": {"val": "", "type": "string"}, "close": {"val": "", "type": "string"}, "clustering": {"type": "boolean", "val": true}}}}, {"children": [{"text": ""}]}, {"idx": 14577133, "type": "group", "name": "\u5c5e\u8a00", "parameters": {"prefix": {"val": "", "type": "string"}, "suffix": {"val": "", "type": "string"}, "title": {"val": "", "type": "string"}, "close": {"val": "", "type": "string"}, "ordering": {"val": "chinese", "type": "choice", "choices": ["chinese", "arab", "arab-circle", "chinese-bracket", "number-bracket", "none"]}, "label": {"val": "\u5217\u8868", "type": "string"}, "clustering": {"val": true, "type": "boolean"}}, "relation": "separating", "children": [{"children": [{"text": ""}]}], "hiddens": [], "flags": {}, "proxy_info": {"proxy_name": "\u5217\u8868", "proxy_params": {"ordering": {"val": "chinese", "type": "choice", "choices": ["chinese", "arab", "arab-circle", "chinese-bracket", "number-bracket", "none"]}}}}, {"idx": 14813703, "type": "group", "name": "\u5c5e\u8a00", "parameters": {"prefix": {"val": "", "type": "string"}, "suffix": {"val": "", "type": "string"}, "title": {"val": "", "type": "string"}, "close": {"val": "", "type": "string"}, "ordering": {"val": "chinese", "type": "choice", "choices": ["chinese", "arab", "arab-circle", "chinese-bracket", "number-bracket", "none"]}, "label": {"val": "\u5217\u8868", "type": "string"}, "clustering": {"val": true, "type": "boolean"}}, "relation": "chaining", "children": [{"children": [{"text": ""}]}], "hiddens": [], "flags": {}, "proxy_info": {"proxy_name": "\u5217\u8868", "proxy_params": {"ordering": {"val": "chinese", "type": "choice", "choices": ["chinese", "arab", "arab-circle", "chinese-bracket", "number-bracket", "none"]}}}}, {"children": [{"text": ""}]}, {"children": [{"text": ""}]}, {"idx": 19366339, "type": "group", "name": "\u683c\u793a", "parameters": {"prefix": {"val": "", "type": "string"}, "suffix": {"val": "", "type": "string"}, "title": {"val": "asd", "type": "string"}, "close": {"val": "", "type": "string"}, "ordering": {"val": "none", "type": "string"}, "label": {"val": "\u4ee3\u7801", "type": "string"}}, "relation": "separating", "children": [{"children": [{"text": "sad"}]}], "hiddens": [], "flags": {}, "proxy_info": {"proxy_name": "\u4ee3\u7801", "proxy_params": {"title": {"val": "asd", "type": "string"}, "close": {"val": "", "type": "string"}}}}, {"children": [{"text": ""}]}, {"idx": 13546364, "type": "group", "name": "\u968f\u8a00", "parameters": {"prefix": {"val": "", "type": "string"}, "suffix": {"val": "", "type": "string"}, "title": {"val": "\u8bc1\u660e", "type": "string"}, "close": {"val": "\u25a0", "type": "string"}, "ordering": {"val": "none", "type": "choice", "choices": ["chinese", "arab", "arab-circle", "chinese-bracket", "number-bracket", "none"]}, "label": {"val": "\u8bc1\u660e", "type": "string"}}, "relation": "separating", "children": [{"children": [{"text": "sad"}]}], "hiddens": [], "flags": {}, "proxy_info": {"proxy_name": "\u8bc1\u660e", "proxy_params": {}}}, {"children": [{"text": ""}]}, {"children": [{"text": "dsadsdf"}]}, {"children": [{"text": ""}]}, {"idx": 16791009, "type": "group", "name": "\u662d\u8a00", "parameters": {"prefix": {"val": "", "type": "string"}, "suffix": {"val": "", "type": "string"}, "title": {"val": "\u5b9a\u7406", "type": "string"}, "close": {"val": "", "type": "string"}, "ordering": {"val": "chinese", "type": "choice", "choices": ["chinese", "arab", "arab-circle", "chinese-bracket", "number-bracket", "none"]}, "label": {"val": "\u5b9a\u7406", "type": "string"}}, "relation": "separating", "children": [{"children": [{"text": "\u554a\u5bf9\u5bf9\u4e22dsdfsdf"}], "parameters": {"prefix": {"val": "", "type": "string"}, "suffix": {"val": "", "type": "string"}, "title": {"val": "\u8bc1\u660e", "type": "string"}, "close": {"val": "\u25a0", "type": "string"}, "ordering": {"val": "none", "type": "choice", "choices": ["chinese", "arab", "arab-circle", "chinese-bracket", "number-bracket", "none"]}, "label": {"val": "\u8bc1\u660e", "type": "string"}}, "proxy_info": {"proxy_name": "\u8bc1\u660e", "proxy_params": {}}}], "hiddens": [], "flags": {}, "proxy_info": {"proxy_name": "\u547d\u9898", "proxy_params": {"ordering": {"val": "chinese", "type": "choice", "choices": ["chinese", "arab", "arab-circle", "chinese-bracket", "number-bracket", "none"]}, "alias": {"val": "", "type": "string"}, "category": {"val": "\u5b9a\u7406", "type": "choice", "choices": ["\u5b9a\u7406", "\u5f15\u7406", "\u63a8\u8bba", "\u547d\u9898"]}}}}, {"idx": 12009830, "type": "group", "name": "\u968f\u8a00", "parameters": {"prefix": {"val": "", "type": "string"}, "suffix": {"val": "", "type": "string"}, "title": {"val": "\u8bc1\u660e", "type": "string"}, "close": {"val": "\u25a0", "type": "string"}, "ordering": {"val": "none", "type": "choice", "choices": ["chinese", "arab", "arab-circle", "chinese-bracket", "number-bracket", "none"]}, "label": {"val": "\u8bc1\u660e", "type": "string"}}, "relation": "chaining", "children": [{"children": [{"text": "\u963f\u65af\u8fbe\u6240\u591asdfsdfsdf"}]}], "hiddens": [], "flags": {}, "proxy_info": {"proxy_name": "\u8bc1\u660e", "proxy_params": {}}}, {"idx": 21753320, "type": "group", "name": "\u5c5e\u8a00", "parameters": {"prefix": {"val": "", "type": "string"}, "suffix": {"val": "", "type": "string"}, "title": {"val": "", "type": "string"}, "close": {"val": "", "type": "string"}, "ordering": {"val": "none", "type": "string"}, "label": {"val": "\u9610\u8ff0", "type": "string"}, "clustering": {"val": true, "type": "boolean"}}, "relation": "chaining", "children": [{"children": [{"text": "\u6309\u65f6\u5230\u8fbe\u65f6dsfsdfs"}]}], "hiddens": [], "flags": {}, "proxy_info": {"proxy_name": "\u9610\u8ff0", "proxy_params": {"title": {"val": "", "type": "string"}, "close": {"val": "", "type": "string"}, "clustering": {"val": true, "type": "boolean"}}}}, {"children": [{"text": ""}]}, {"children": [{"text": ""}]}, {"children": [{"text": ""}]}, {"children": [{"text": "sdfsdfsdfsdf"}]}, {"children": [{"text": "\u52a8\u9600"}]}, {"children": [{"text": "\u76842"}]}, {"children": [{"text": ""}]}, {"idx": 20813940, "type": "support", "name": "\u7ae0\u8282\u7ebf", "parameters": {"label": {"type": "string", "val": "\u7ae0"}}, "children": [{"text": ""}], "hiddens": [], "flags": {}, "proxy_info": {"proxy_name": ""}}], "hiddens": [], "flags": {}, "proxy_info": {"proxy_name": ""}}
`)
