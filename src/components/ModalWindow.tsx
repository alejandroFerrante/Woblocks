import { useContext } from "react"
import NewObjectModal from './NewObjectModal'

import GameConfigModal  from './GameConfigModal'
import ProjectLoadModal from './ProjectLoadModal'
import ProjectSaveModal from './ProjectSaveModal'
import AvailableSpritesModal from './AvailableSpritesModal'

import WBContext from '../WBContext'

export default function ModalWindow(props:any){
	
	const {globalState} = useContext(WBContext);

	//RENDERS CORREPONDING MODAL DEPENDING ON GLOBAL MODAL STATE

	return <>
		{ globalState.modalState === 'OBJCREATE_OPEN' 		&& <NewObjectModal   />}
		{ globalState.modalState === 'CONFIG_OPEN' 	 		&& <GameConfigModal  />}
		{ globalState.modalState === 'PROJLOAD_OPEN'  		&& <ProjectLoadModal />}
		{ globalState.modalState === 'PROJSAVE_OPEN'  		&& <ProjectSaveModal />}
		{ globalState.modalState === 'AVLBL_SPRITES_OPEN'	&& <AvailableSpritesModal />}		
	</>
}