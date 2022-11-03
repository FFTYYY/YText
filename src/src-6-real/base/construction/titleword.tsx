import React from "react"

export { TitleWord }

var id2title = {} // 缓存。

/** 这个组件异步加载一个节点的标题，等加载好了就现实出来。 */
class TitleWord extends React.PureComponent<{
    node_id: number
} , {
    title: string | undefined
}>{
    constructor(props){
        super(props)

        this.state = {
            title: undefined
        }
    }

    async componentDidMount() {
    }

    render(){
        return <>{this.state.title}</>
    }
}
