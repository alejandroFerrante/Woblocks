import { useState, useContext } from "react"

import ObjectConfigForm from './ObjectConfigForm'
import { AppBar, Dialog, DialogProps, IconButton, IconButtonProps, Toolbar, Typography } from '@material-ui/core'
import { Close as CloseIcon, Done as DoneIcon } from '@material-ui/icons'

import woblocksControl from '../models/woblocksControl'

import WBContext from '../WBContext'
import {imagePathManager} from '../ImagePathManager'


export default function NewObjectModal(props:any){
	
	const [visualMode,setVisualMode] = useState(false);
    const [sliderIndex,setSliderIndex] = useState(0);
    const [chosenName,setChosenName] = useState('');

    const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);

    //COMPONENT USED FOR SETTING OBJECT NAME AND REPRESENTATION
	const handleClose = () => {
		console.log('NewObjectModal handleClose');
		globalState.modalState = 'CLOSED';
        setGlobalState(globalState);
        valSetter( (val + 1) % 2);
	}

	const openAlert = function(aTitle:string,aBody:string){
		globalState.alertState.isOpen = true;
	    globalState.alertState.title = aTitle;
	    globalState.alertState.body = aBody;
	    globalState.alertState.mode = 'WARNING';
	    setGlobalState(globalState);
	    valSetter( (val+1) % 2 );
	}

	const handleAccept = () => {
		if(!chosenName || chosenName === ''){
			openAlert("Nombre Incompleto","No ha completado ningun nombre");
			return;
		}
		if(globalState.tabObjects.map(function(elem:any){return elem.name}).includes(chosenName) ){
			openAlert("Nombre Repetido","Un objeto con este nombre ya fue creado");
			return;
		}
		//{chosenName, chosenRepresentation}
		const rep = imagePathManager.representations.filter(function(elem:any){return (!visualMode) || (elem.isVisual == true)})[sliderIndex];
		console.log('NewObjectModal handleAccept');

		//SAVE CURRENT WORKSPACE
		if(globalState.currentTabIndex == 0){
			woblocksControl.saveSceneXmlContent();
		}else{
			woblocksControl.saveObjectTabXmlContentWithIndex(globalState.currentTabIndex - 1);
		}

		//ADD TAB OBJ
		globalState.tabObjects.push( {name:chosenName , icon:rep.name} );

		//SELECT TAB
		globalState.currentTabIndex = globalState.tabObjects.length - 1;

		//ADD OBJ DATA
		woblocksControl.addObjectNamed(chosenName, rep.name,rep.isVisual);

		//LOAD NEW WORKSPACE
		var repImage = (visualMode)? rep.alias : null;//if visual add the image method to the block construct
		//console.log('NewObjectModal '+visualMode+' '+repImage);
		woblocksControl.addDefaultObjectXmlToWorkspaceWithNameAndImage	(chosenName, repImage);//this clears the workspace

		//SAVE OBJ WORKSPACE INFO
		woblocksControl.saveObjectTabXmlContentWithIndex(globalState.currentTabIndex - 1);
		woblocksControl.setObjectInfoOfIndex(globalState.currentTabIndex - 1, rep.name,visualMode);

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
			<ObjectConfigForm  editName={true} visualMode={visualMode} sliderIndex={sliderIndex} chosenName={chosenName} setVisualMode={setVisualMode} setSliderIndex={setSliderIndex} setChosenName={setChosenName} representations={imagePathManager.representations}/>
        </Dialog>

	</>
}

	