import {createContext, useState} from 'react'

const WBContext = createContext();//global and unique instance of WBContext 

export function WBProvider(props){
	return (
		<WBContext.Provider value={ {globalState:props.state, setGlobalState:props.stateSetter /* this part only for testing --->  */ ,val:props.val, valSetter:props.valSetter} }>		
			{props.children}
		</WBContext.Provider>
	);
}

export default WBContext;