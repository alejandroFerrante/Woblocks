import { Send as SendIcon } from '@material-ui/icons'
import DialogButton from './DialogButton'
import PlayGame from './PlayGame'
import { useContext } from "react"
import WBContext from "../WBContext"

export default function PlayDialogButton() {

	const {globalState} = useContext(WBContext);

	const terminateGame = function(){
		console.log('HERE');
		if(globalState.wkGame){
			globalState.wkGame.stop();
			console.log('!!');
		}
	}

	return <DialogButton
		title="Wollok Game"
		tooltip="Ejecutar Juego"
		Icon={SendIcon}
		dialogProps={{ fullScreen: true }}
		onClose={terminateGame}
	>
		<PlayGame />
	</DialogButton>
}
