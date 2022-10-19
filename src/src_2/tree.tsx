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

function create_group(concept , parameters , children , abstract: any[] = []){

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
        idx: Math.floor( Math.random() * 233333) , 
        concept: concept , 
        parameters: parameters , 
        children: children , 
        abstract: abstract , 
        relation: "separate" as "separate" , 
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
        abstrct: abstract , 
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
    create_group("theorem" , {alias_name: "NFL"} , [
        create_paragraph([
            text("天下没有免费的午餐定理。") , 
        ]) , 
    ] , [
        create_abstract("comment" , {} , [
            create_paragraph([
                text("另外，希望大家知道，") , 
                inln("stronger" , {} , "这个") , 
                text("定理是要收钱的。") , 
            ]) , 
            create_group("theorem" , {alias_name: ""} , [
                create_paragraph([
                    text(`收费标准是12元/人。`) , 
                ]) , 
            ]) ,         
        ])
    ]) , 
    create_paragraph([
        text("这个定理告诉我们，天下是没有免费的午餐的。这是因为：") , 
    ]) , 
    create_group("theorem" , {alias_name: ""} , [
        create_paragraph([
            text(`午餐是要收费的。`) , 
        ]) , 
    ]) , 

])

