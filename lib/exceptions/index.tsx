export {
    UnexpectedParametersError , 
    BadNodeError , 
}

/** 这个异常表示函数遇到了不符合约定的参数。 */
class UnexpectedParametersError extends Error{
    constructor(msg: string){
        super(msg)
        Object.setPrototypeOf(this, UnexpectedParametersError.prototype);
    }
}

/** 这个异常表示遇到了不符合约定的节点。 */
class BadNodeError extends Error{
    constructor(msg: string){
        super(msg)
        Object.setPrototypeOf(this, BadNodeError.prototype);
    }
}

