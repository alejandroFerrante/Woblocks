import {useRef,createRef} from 'react'
import { Send as SendIcon } from '@material-ui/icons'
import DialogButton from './DialogButton'



import { useContext, useState } from "react"
import WBContext from '../WBContext'
import woblocksControl from '../models/woblocksControl'

export default function PlayDialogButton(){

	const onWollokGameDivRendered = (elem:any) => {

		if(elem){
			myRef = elem;
			console.log('ELEM RENDERED');
			var myProgramStr = woblocksControl.getExecutionString();
			
			var main = 'main';
			var sounds:any[] = [];
			var sources = woblocksControl.buildWkProgramSourceFor(myProgramStr);
			var project = [ main, globalState.wkImages, sounds, sources ];
			
			//this.wkGame = new Game(project);
			//this.wkGame.start(myRef);

		}
	}
	const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);

	var myRef:any;

    return <>{myRef}<DialogButton  
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
