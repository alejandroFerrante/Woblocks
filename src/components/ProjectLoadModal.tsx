import { AppBar, Dialog, DialogProps, IconButton, IconButtonProps, Toolbar, Typography } from '@material-ui/core'
import { Close as CloseIcon, Done as DoneIcon } from '@material-ui/icons'

import { useContext, useState } from "react"
import WBContext from '../WBContext'
import woblocksControl from '../models/woblocksControl'

import {getRepIconFor} from '../ImagePathManager'

export default function ProjectLoadModal(){

	//COMPONENT USED FOR LOADING A wbk PROJECT FILE 
	const handleAccept = () => {
		woblocksControl.loadProjetInfoFromJSON(fileContent);
		const fileContentJSON = JSON.parse(fileContent);
		setFilename('');
		setFileContent('');

		globalState.currentTabIndex = 0;
		globalState.tabObjects = [{name:'escena', icon:'wollok'}];
		const newTabObjs = Object.keys(fileContentJSON.definedObjectsInfo.objectsInfoMap).map(function(elem:any){
			const iconName = fileContentJSON.definedObjectsInfo.objectsInfoMap[elem].definedObjectsMappingInfo.representationName;
			return {name:elem , icon: getRepIconFor(iconName) }; 
		});
		globalState.tabObjects = globalState.tabObjects.concat(newTabObjs);
		globalState.gameWidth = fileContentJSON.config.height;
		globalState.gameHeight = fileContentJSON.config.width;
		globalState.modalState = 'CLOSED';

		woblocksControl.loadSceneXmlContent();

		setGlobalState(globalState);
   		valSetter( (val + 1) % 2);
	}

	const handleClose = () => {
		globalState.modalState = 'CLOSED';
		setGlobalState(globalState);
   		valSetter( (val + 1) % 2);	
	}

	const onFilenameChange = function(event:any){
		setFilename(event.target.value);
	}

	const fileLoaded = function(something:any){
		//setFile();
		var fr = new FileReader();
		fr.addEventListener("loadend", function(e:any) {
		    setFileContent(e.srcElement.result);
		});
		  
		fr.readAsText(something.target.files[0]);
	}

	const cellStyle = {paddingLeft:"20%",paddingRight:"10%"};

	const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);
	const [filename, setFilename] = useState('');
	const [fileContent, setFileContent] = useState('');

	return <>
		<Dialog  open={true} onClose={handleClose} fullWidth  maxWidth="sm" >
			
            <AppBar position="static">
                <Toolbar style={{justifyContent:"space-between"}} >
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="Cerrar">
                        <CloseIcon />
                    </IconButton>
                    <Typography>Cargar Proyecto</Typography>
                    <IconButton edge="end" color="inherit" onClick={handleAccept} aria-label="Cerrar">
                        <DoneIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
		
			<>
				<br/>
		        <div style={cellStyle} ><input type="file" accept=".wbk" onChange={fileLoaded}  /> </div>
		        <br/>
			</>
			
        </Dialog>

	</>
}