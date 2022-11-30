import { Send as SendIcon } from '@material-ui/icons'
import DialogButton from './DialogButton'
import PlayGame from './PlayGame'
import { useContext } from "react"
import WBContext from "../WBContext"
import woblocksControl from '../models/woblocksControl'

export default function PlayDialogButton() {

	const {globalState} = useContext(WBContext);

	const terminateGame = function(){
		if(globalState.wkGame){
			globalState.wkGame.stop();
		}
	}

	return <DialogButton
		title="Wollok Game"
		tooltip="Ejecutar Juego"
		Icon={SendIcon}
		dialogProps={{ fullScreen: true }}
		onOpen={()=>{woblocksControl.sanitizeTextInputBlocks();}}
		onClose={terminateGame}
	>
		<PlayGame />
	</DialogButton>
}
