import { Send as SendIcon } from '@material-ui/icons'
import DialogButton from './DialogButton'
import { useContext } from "react"
import WBContext from '../WBContext'
import woblocksControl from '../models/woblocksControl'

export default function PlayDialogButton(){

	const onWollokGameDivRendered = (theDiv:any) => {

		if(!theDiv) return;
		
		const myProgramStr = woblocksControl.getExecutionString();
		const sources = woblocksControl.buildWkProgramSourceFor(myProgramStr);
		const project = { 
			main: 'main',
			images: globalState.wkImages, 
			sounds: [], 
			sources,
			description: "HOLA SOY UNA DESCRIPCION" 
		}
		
		//this.wkGame = new Game(project);
		//this.wkGame.start(theDiv);
	}
	const {globalState} = useContext(WBContext);

    return <><DialogButton  
        title="Wollok Game"
        tooltip="Ejecutar Juego"
        Icon={SendIcon}
        dialogProps={{fullScreen: true}}
        >
    	<div ref={onWollokGameDivRendered} >
        Soy Wollok game
        </div>
    </DialogButton></>
}
