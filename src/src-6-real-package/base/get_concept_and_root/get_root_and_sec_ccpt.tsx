import root from "./root.json"
import sec_ccpt from "./sec_ccpt.json"

export {get_root, get_ccpt}

function get_root(){
    return root
}
function get_ccpt(){
    return [JSON.stringify(sec_ccpt)]
}