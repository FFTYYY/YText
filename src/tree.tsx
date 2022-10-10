export {tree}

function create_group(concept , parameters , children){
    return {
        type: "group" as "group" , 
        idx: Math.floor( Math.random() * 233333) , 
        concept: concept , 
        parameters: parameters , 
        cacheResult: {} , 
        children: children , 
        abstract: [] , 
        relation: "separate" as "separate" , 
    }
    
}

function create_inline(concept , parameters , text){
    return {
        type: "inline" as "inline" , 
        idx: Math.floor( Math.random() * 233333) , 
        concept: concept , 
        parameters: parameters , 
        cacheResult: {} , 
        children: [ {text: text} ] , 
        abstrct: [] , 
    }
}

function create_paragraph(children){
    return {
        children: children
    }
}

function t(text){
    return {
        text: text
    }
}

let tree = create_group("root" , {} , [
    create_paragraph([
        t("今天教大家一个") , 
        create_inline("stronger" , {} , "简单") , 
        t("的定理。")
    ]) , 
    create_paragraph([
        t("希望大家不要不识好歹。") , 
    ]) , 
    create_group("theorem" , {alias_name: "NFL"} , [
        create_paragraph([
            t("天下没有免费的午餐定理。") , 
        ]) , 
    ]) , 
    create_paragraph([
        t("这个定理告诉我们，天下是没有免费的午餐的。这是因为：") , 
    ]) , 
    create_group("theorem" , {alias_name: ""} , [
        create_paragraph([
            t("午餐是要收费的。") , 
        ]) , 
    ]) , 

])

