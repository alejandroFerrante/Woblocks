import {useContext} from 'react'
import {AppContext } from '../App'
import WBContext from '../WBContext'

export default function ContextTst(props : any){
	
	const appContext = useContext(AppContext)

	const {item , item2, item1Setter} = useContext(WBContext);//extract things from context 

	console.log('ContextTst called');

	return  <>
				<div>
					{'ContextTst here, tst is: '+appContext.tst}
					{'ContextTst here, item is: '+item}
					{'ContextTst here, item2 is: '+item2}
				</div>
				<button onClick={() => { item1Setter('TOOOT'); console.log('Button CLicked');} } >change</button>
			</>
}