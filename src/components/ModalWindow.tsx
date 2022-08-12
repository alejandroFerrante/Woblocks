import { useContext } from "react"
import NewObjectModal from './NewObjectModal'

import WBContext from '../WBContext'

export default function ModalWindow(props:any){
	
	const {globalState} = useContext(WBContext);

	return <>
		{ globalState.modalState == 'OBJCREATE_OPEN' && <NewObjectModal/>}		
	</>

	//
}