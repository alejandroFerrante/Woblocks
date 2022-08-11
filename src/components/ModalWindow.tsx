import { useState } from "react"
import NewObjectModal from './NewObjectModal'


export default function ModalWindow(props:any){
	

	return <>
		{ props.state == 'OBJCREATE_OPEN' && <NewObjectModal closeModal={props.closeModal} representations={props.representations}/>}		
	</>
}