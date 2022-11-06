import { useContext } from "react"
import WBContext from '../WBContext'
import woblocksControl from '../models/woblocksControl'

import {getRepIconFor} from '../ImagePathManager'

import { AppBar, Dialog, DialogProps, IconButton, IconButtonProps, Toolbar, Typography } from '@material-ui/core'
import { Close as CloseIcon, Done as DoneIcon } from '@material-ui/icons'
import { ReactNode, useState } from 'react'

export default function DeleteConfirm(){

	const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);
	
	const closeDeleteConfirmWindow = function(){
		globalState.itemIndexToDelete = -1;
    	setGlobalState(globalState);
		valSetter( (val + 1) % 2);
	}

	const confirmItemDelete = function(){
		globalState.tabObjects.splice(globalState.itemIndexToDelete + 1,1); 
		woblocksControl.removeObjectOfIndex(globalState.itemIndexToDelete);
		woblocksControl.definedObjectsAsBlocklyBlocks();
        woblocksControl.loadSceneXmlContent();
        woblocksControl.fillMessagesOfForWorkspace();
        woblocksControl.sanitizedeletedObjects();                
        woblocksControl.closeToolbox();
        globalState.currentTabIndex = 0;
		globalState.itemIndexToDelete = -1;
    	setGlobalState(globalState);
		valSetter( (val + 1) % 2);
	}

	return <>
			<IconButton color="inherit" aria-label="blah" title="blah blah">
	        
	        </IconButton>
	        <Dialog  open={true}>
	            <AppBar position="static">
	                <Toolbar >
	                    <IconButton edge="start" color="inherit" aria-label="Cerrar" onClick={closeDeleteConfirmWindow}>
	                        <CloseIcon />
	                    </IconButton>
	                    <Typography style={{paddingLeft:"27%",paddingRight:"30%"}} >¿Borrar Objeto?</Typography>
	                    <IconButton edge="end" color="inherit" aria-label="Borrar" onClick={confirmItemDelete}>
	                        <DoneIcon />
	                    </IconButton>
	                </Toolbar>
	            </AppBar>
	            <div style={{minWidth:"500px"}}>
	                
	            </div>
	        </Dialog>			
	</>
}