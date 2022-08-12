import {useContext} from 'react'
import {AppContext} from '../App'

export default function ContextTst2(props : any){
	
	 const appContext = useContext(AppContext)

	 console.log('ContextTst2 called');

	return  <>
				<div>
					{'ContextTst2 here, tst is: '+appContext.tst}
				</div>
			</>
}