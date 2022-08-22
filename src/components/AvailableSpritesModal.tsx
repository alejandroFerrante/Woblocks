import { AppBar, Dialog, DialogProps, IconButton, IconButtonProps, Toolbar, Typography, ImageList, ImageListItem, ImageListItemBar } from '@material-ui/core'
import { Close as CloseIcon, Done as DoneIcon } from '@material-ui/icons'

import { useContext, useState } from "react"
import WBContext from '../WBContext'
import woblocksControl from '../models/woblocksControl'

import {getAllSprites} from '../ImagePathManager'

export default function AvailableSpritesModal(){


	const handleClose = () => {
		globalState.modalState = 'CLOSED';
		setGlobalState(globalState);
   		valSetter( (val + 1) % 2);	
	}

	const cellStyle = {paddingLeft:"10%"};

	const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);
		
	return <>
		<Dialog  open={true} onClose={handleClose}>
			
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="Cerrar">
                        <CloseIcon />
                    </IconButton>
                    <Typography>Sprites Disponibles</Typography>
                </Toolbar>
            </AppBar>
		
			<>
				
				<ImageList cols={3} rowHeight={164} >
			      <ImageListItem key="Subheader" cols={2}>

			      </ImageListItem>
			      {getAllSprites().map((item:any) => (
			        <ImageListItem key={item.alias}>
			          <img
			            src={item.url}
			            alt={item.alias}
			            loading="lazy"
			          />
			          <ImageListItemBar
			            title={item.alias}
			          />
			        </ImageListItem>
			      ))}
			    </ImageList>
		        
		        
			</>
			
        </Dialog>

	</>
}