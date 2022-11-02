export {tree}

function create_abstract(concept , parameters , children){
    return {
        type: "abstract" as "abstract" , 
        idx: Math.floor( Math.random() * 233333) , 
        concept: concept , 
        parameters: parameters , 
        children: children , 
        abstract: [] , 
    }
}

function create_group(concept , parameters , children , relation: string = "separating",abstract: any[] = []){

    for(let x in parameters){
        if ( typeof(parameters[x]) == "string"){
            parameters[x] = {
                type: "string" , 
                val: parameters[x] , 
            }
        }
        else if ( typeof(parameters[x]) == "number"){
            parameters[x] = {
                type: "number" , 
                val: parameters[x] , 
            }
        }
    }

    return {
        type: "group" as "group" , 
        idx: Math.floor( Math.random() * 233333) , 
        concept: concept , 
        parameters: parameters , 
        children: children , 
        abstract: abstract , 
        relation: relation as "separating" | "chaining", 
    }
}

function create_structure(concept , parameters , children , relation: string = "separating" , abstract: any[] = []){

    for(let x in parameters){
        if ( typeof(parameters[x]) == "string"){
            parameters[x] = {
                type: "string" , 
                val: parameters[x] , 
            }
        }
        else if ( typeof(parameters[x]) == "number"){
            parameters[x] = {
                type: "number" , 
                val: parameters[x] , 
            }
        }
    }

    return {
        type: "structure" as "structure" , 
        idx: Math.floor( Math.random() * 233333) , 
        concept: concept , 
        parameters: parameters , 
        children: children , 
        abstract: abstract , 
        relation: relation as "separating" | "chaining", 
    }
}

function create_paragraph(children){
    return {
        children: children
    }
}

function text(text){
    return {
        text: text
    }
}
function inln(concept , parameters , text , abstract: any[] = []){
    return {
        type: "inline" as "inline" , 
        idx: Math.floor( Math.random() * 233333) , 
        concept: concept , 
        parameters: parameters , 
        children: [ {text: text} ] , 
        abstract: abstract , 
    }
}

let tree = create_group("root" , {} , [
    create_paragraph([
        text("今天教大家一个") , 
        inln("stronger" , {} , "简单") , 
        text("的定理。") , 
    ]) , 
    create_paragraph([
        text("希望大家不要不识好歹。") , 
    ]) , 
    create_group("theoremer" , {alias_name: "NFL"} , [
        create_paragraph([
            text("天下没有免费的午餐定理。") , 
        ]) , 
    ] , "separating" , [
        create_abstract("comment" , {} , [
            create_paragraph([
                text("另外，希望大家知道，") , 
                inln("stronger" , {} , "这个") , 
                text("定理是要收钱的。") , 
            ]) , 
            create_group("theoremer" , {alias_name: ""} , [
                create_paragraph([
                    text(`收费标准是12元/人。`) , 
                ]) , 
            ]) ,         
        ])
    ]) , 
    create_paragraph([
        text("这个定理告诉我们，天下是没有免费的午餐的。这是因为：") , 
    ]) ,
    create_structure("line" , {widths: "2,2"} , [
        create_group("theoremer" , {alias_name: ""} , [
            create_paragraph([
                text(`午餐是要收费的。`) , 
            ]) , 
        ]) , 
        create_group("theoremer" , {alias_name: "收费定理", haha: "yes!"} , [
            create_paragraph([
                text(`还有其他收费项目`) , 
            ]) , 
        ]) , 
    ]) ,
    create_structure("line" , {widths: "2,2"} , [
        create_group("theoremer" , {alias_name: ""} , [
            create_paragraph([
                text(`不仅午餐要收费`) , 
            ]) , 
        ] , ) , 
        create_group("theoremer" , {alias_name: "超级收费定理"} , [
            create_paragraph([
                text(`吃饭也要收费。`) , 
            ])
        ], ) , 
    ] , "chaining") , 
])

