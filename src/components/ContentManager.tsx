import ModalWindow from './ModalWindow'

import { useState } from "react"

export default function ContentManager(props:any){
	
	const [modalState,setModalState] = useState('CLOSED');

	const closeModal = function(){
		setModalState('CLOSED');
	}

	const openCreateObjectModal = function(){
		setModalState('OBJCREATE_OPEN');
	}

	const representations = [    
        //slides[currentIndex].url
        { isVisual:true,  name:"pepita", icon:"https://raw.githubusercontent.com/alejandroFerrante/Woblocks/main/icons/representations/bird.png", url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU0t0nM0q8vEe_eEHDLnQo63rbD-1qBbhcbu-D7BnWQs4DOYLpov51WgN4dkJyJmdZgbc&usqp=CAU" },
        { isVisual:true, name:"apple",   icon:"https://raw.githubusercontent.com/alejandroFerrante/Woblocks/main/icons/representations/apple.png", url:"https://www.seekpng.com/png/detail/45-454905_apple-cliparts-apple-vector.png"},
        { isVisual:false, name:"add",    icon:"https://raw.githubusercontent.com/alejandroFerrante/Woblocks/main/icons/representations/add.png", url:""},
		{ isVisual:false, name:"tick",   icon:"https://raw.githubusercontent.com/alejandroFerrante/Woblocks/main/icons/representations/tick.png", url:""},
		{ isVisual:false, name:"cross",  icon:"https://raw.githubusercontent.com/alejandroFerrante/Woblocks/main/icons/representations/cross.png", url:""}     
    ]

	return <>
		<ModalWindow representations={representations} />
	</>
}