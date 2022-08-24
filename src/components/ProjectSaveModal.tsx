import { AppBar, Dialog, DialogProps, IconButton, IconButtonProps, Toolbar, Typography } from '@material-ui/core'
import { Close as CloseIcon, Done as DoneIcon } from '@material-ui/icons'

import { useContext, useState } from "react"
import WBContext from '../WBContext'
import woblocksControl from '../models/woblocksControl'

export default function ProjectSaveModal(){

	//Accept button only visible when filename not empty
	//COMPONENT USED FOR DOWNLOADING CURRENT PROJECT 
	const handleAccept = () => {

		woblocksControl.saveSceneXmlContent();

		const blob = new Blob([woblocksControl.getProjetInfoAsJSON()]);	

		const anchor = window.document.createElement('a');
		anchor.href = window.URL.createObjectURL(blob);
		anchor.download = filename+'.wbk';
		document.body.appendChild(anchor);
		anchor.click();
		document.body.removeChild(anchor);
		window.URL.revokeObjectURL(anchor.href);

		setFilename('');
		globalState.modalState = 'CLOSED';
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

	const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);
	const [filename, setFilename] = useState('');
		
	return <>
		<Dialog  open={true} onClose={handleClose}>
			
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="Cerrar">
                        <CloseIcon />
                    </IconButton>
                    <Typography>Guardar Proyecto</Typography>
                    {filename !== '' && <IconButton edge="end" color="inherit" onClick={handleAccept} aria-label="Cerrar">
                        <DoneIcon />
                    </IconButton>}
                </Toolbar>
            </AppBar>
		
			<>
				<br/>
		        <div >Nombre de archivo:<input value={filename} onChange={onFilenameChange} /> {'.wbk'}</div>
		        <br/>
		        
		        
			</>
			
        </Dialog>

	</>
}