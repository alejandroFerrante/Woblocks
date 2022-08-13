import { useState, useContext } from "react"

import ObjectConfigForm from './ObjectConfigForm'
import { AppBar, Dialog, DialogProps, IconButton, IconButtonProps, Toolbar, Typography } from '@material-ui/core'
import { Close as CloseIcon, Done as DoneIcon } from '@material-ui/icons'

import woblocksControl from '../models/woblocksControl'

import WBContext from '../WBContext'

export default function NewObjectModal(props:any){
	
	const [visualMode,setVisualMode] = useState(false);
    const [sliderIndex,setSliderIndex] = useState(0);
    const [chosenName,setChosenName] = useState('');

    const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);

	const handleClose = () => {
		console.log('NewObjectModal handleClose');
		globalState.modalState = 'CLOSED';
        setGlobalState(globalState);
        valSetter( (val + 1) % 2);
	}

	const handleAccept = () => {
		//{chosenName, chosenRepresentation}
		const rep = props.representations.filter(function(elem:any){return (!visualMode) || (elem.isVisual == true)})[sliderIndex];
		console.log('NewObjectModal handleAccept');

		//SAVE CURRENT WORKSPACE
		if(globalState.currentTabIndex == 0){
			woblocksControl.saveSceneXmlContent();
		}else{
			woblocksControl.saveObjectTabXmlContentWithIndex(globalState.currentTabIndex - 1);
		}

		//ADD TAB OBJ
		globalState.tabObjects.push( {name:chosenName, icon:'wkIcon'} );

		//SELECT TAB
		globalState.currentTabIndex = globalState.tabObjects.length - 1;

		//ADD OBJ DATA
		woblocksControl.addObjectNamed(chosenName, rep.name,rep.isVisual);

		//LOAD NEW WORKSPACE
		woblocksControl.addDefaultObjectXmlToWorkspaceNamed(chosenName);//this clears the workspace

		globalState.modalState = 'CLOSED';
        setGlobalState(globalState);
        
        valSetter( (val + 1) % 2);
	}

	return <>
		<Dialog  open={true} onClose={handleClose}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="Cerrar">
                        <CloseIcon />
                    </IconButton>
                    <Typography>Crear Objeto</Typography>
                    <IconButton edge="end" color="inherit" onClick={handleAccept} aria-label="Cerrar">
                        <DoneIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
		<ObjectConfigForm  visualMode={visualMode} sliderIndex={sliderIndex} chosenName={chosenName} setVisualMode={setVisualMode} setSliderIndex={setSliderIndex} setChosenName={setChosenName} representations={props.representations}/>
        </Dialog>

	</>
}

	