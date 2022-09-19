import { Send as SendIcon } from '@material-ui/icons'
import DialogButton from './DialogButton'
import PlayGame from './PlayGame'

export default function PlayDialogButton() {

	return <DialogButton
		title="Wollok Game"
		tooltip="Ejecutar Juego"
		Icon={SendIcon}
		dialogProps={{ fullScreen: true }}
	>
		<PlayGame />
	</DialogButton>
}
