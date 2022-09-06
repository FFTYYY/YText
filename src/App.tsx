import React from 'react'
import {haha} from '../lib'

class App extends React.Component<{},{}>{
	constructor(props: {}){
		super(props)
	}

	render(){
		let me = this
		return <div>hello,world! haha = {haha}</div>
	}
}

export default App