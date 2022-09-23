import { useContext } from "react"
import WBContext from '../WBContext'
import woblocksControl from '../models/woblocksControl'

import TextField from '@material-ui/core/TextField';

//import EventEmitter from './EventEmitter'

/*
export function ProjectSaveAccept(){
	const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);

	if(!globalState.proposedSaveName || globalState.proposedSaveName === ''){return;}

	woblocksControl.saveSceneXmlContent();

	const blob = new Blob([woblocksControl.getProjetInfoAsJSON()]);	

	const anchor = window.document.createElement('a');
	anchor.href = window.URL.createObjectURL(blob);
	anchor.download = globalState.proposedSaveName+'.wbk';
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
	window.URL.revokeObjectURL(anchor.href);

	globalState.proposedSaveName = '';
	setGlobalState(globalState);
	valSetter( (val + 1) % 2);

}
*/

export default function ProjectSave(){

	//COMPONENT USED FOR DOWNLOADING CURRENT PROJECT 
	const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);

	const onFilenameChange = function(event:any){
		globalState.proposedSaveName = event.target.value;
		setGlobalState(globalState);
		valSetter( (val + 1) % 2);
	}

	const cellStyle = {paddingLeft:"20%",paddingRight:"10%"};

		
	return <>
			<br/>
		    <div style={cellStyle} >
		       	<TextField  label="Nombre de archivo" onChange={onFilenameChange} error={(!globalState.proposedSaveName || globalState.proposedSaveName === '')} helperText={(!globalState.proposedSaveName || globalState.proposedSaveName === '') && 'Debe completar un nombre'} /> *.wbk
		    </div>
		    <br/>
		     
	</>
}