import { useState } from "react"

import ObjectConfigForm from './ObjectConfigForm'
import { AppBar, Dialog, DialogProps, IconButton, IconButtonProps, Toolbar, Typography } from '@material-ui/core'
import { Close as CloseIcon, Done as DoneIcon } from '@material-ui/icons'

import EventEmitter from './eventEmitter'

export default function ModalWindow(props:any){
	
	const [state,setState] = useState('CLOSED');

	const [visualMode,setVisualMode] = useState(false);
    const [sliderIndex,setSliderIndex] = useState(0);
    const [chosenName,setChosenName] = useState('');

	const handleClose = () => {}

	const handleAccept = () => {
		//{chosenName, chosenRepresentation}
		const rep = props.representations.filter(function(elem:any){return (!visualMode) || (elem.isVisual == true)})[sliderIndex];
		EventEmitter.emit('ObjectCreateConfigAccept',{chosenName:chosenName, chosenRepresentation:rep});
		props.closeModal();
	}

	return <>
		<Dialog  open={true} onClose={handleClose}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={props.closeModal} aria-label="Cerrar">
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

	