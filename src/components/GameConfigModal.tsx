import { AppBar, Dialog, DialogProps, IconButton, IconButtonProps, Toolbar, Typography } from '@material-ui/core'
import { Close as CloseIcon, Done as DoneIcon } from '@material-ui/icons'

import { useContext, useState } from "react"
import WBContext from '../WBContext'

import {getBackgrounds} from '../ImagePathManager';
import woblocksControl from '../models/woblocksControl'

export default function GameConfigModal(){

    //COMPONENT USED FOR CONFIGURING WIDTH, HEIGHT AND BACKGROUND IMAGE
	const handleAccept = () => {
		globalState.gameWidth = myWidth;
		globalState.gameHeight = myHeight;
		globalState.gameBackgroundImage = (sliderIndex === 0)? '' : getBackgrounds()[sliderIndex - 1].value 
		globalState.modalState = 'CLOSED';
		console.log('GameConfigModal handleAccept '+myHeight+' '+myWidth+' '+globalState.gameBackgroundImage);
		woblocksControl.saveConfigInfo(myHeight,myWidth, globalState.gameBackgroundImage);		
		setGlobalState(globalState);
   		valSetter( (val + 1) % 2);
	}

	const handleClose = () => {
		globalState.modalState = 'CLOSED';
		setGlobalState(globalState);
   		valSetter( (val + 1) % 2);	
	}

	const cellStyle = {paddingLeft:"10%"};

	const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);
	const [myWidth, setMyWidth] = useState(globalState.gameWidth);
	const [myHeight, setMyHeight] = useState(globalState.gameHeight);
	const backNames = getBackgrounds().map(function(elem:any){return elem.value});
	const [sliderIndex,setSliderIndex] = useState( (backNames.includes(globalState.gameBackgroundImage)) ? backNames.indexOf(globalState.gameBackgroundImage) + 1 : 0 );

	return <>
		<Dialog  open={true} onClose={handleClose}>
			
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="Cerrar">
                        <CloseIcon />
                    </IconButton>
                    <Typography>Configuracion del Juego</Typography>
                    <IconButton edge="end" color="inherit" onClick={handleAccept} aria-label="Cerrar">
                        <DoneIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
		
			<>
				<br/>
		        <div style={cellStyle} > Ancho<input value={myWidth} onChange={(event) => {setMyWidth(event.target.value)}} /> </div>
		        <br/>
		        <div style={cellStyle} > Alto<input value={myHeight} onChange={(event) => {setMyHeight(event.target.value)}} /> </div> 
		        <br/>
		        <div style={cellStyle}><Slider slides={[{name:'ninguna',url:''}].concat(getBackgrounds())} index={sliderIndex} setSliderIndex={setSliderIndex} /> </div>
			</>
			
        </Dialog>

	</>
}

export function Slider(props:any){

  
    const nextIndex = () => {
        if(props.index == props.slides.length - 1){//if(currentIndex == currentSlides.length - 1){
            props.setSliderIndex(0);//setCurrentIndex(0);
        }else{
            props.setSliderIndex(props.index + 1);//setCurrentIndex(currentIndex + 1);
        }    
    }

    const previousIndex = () => {
        if(props.index == 0 ){//if(currentIndex == 0 ){
            props.setSliderIndex(props.slides.length - 1);//setCurrentIndex(currentSlides.length - 1);
        }else{
            props.setSliderIndex(props.index - 1);//setCurrentIndex(currentIndex - 1);
        }    
    }

    //STYLES///////////////////////////////////
    const containerStyles = {
        width: "950px",
        height: "600px",
        margin: "0 auto",
        paddingLeft:"5%"
    }

    const sliderStyle = {
        height: "100%",
        position: "relative"
    }

    const slideStyle = {
        width: "60%",
        height: "60%",
        boarderRadius: "10px",
        backgroundPosition: "center",
        backgroundSize: "cover"
    }
    ///////////////////////////////////////////

    return <>
        <div style={containerStyles} >
            Imagen de Fondo: <label>{props.slides[props.index].value}</label>
            <table>
              
              <tr>
                <td><div onClick={previousIndex}> {'<'} </div></td>
                
                <td><div style={slideStyle} > 

                    <div>
                        <img style={{width:"180px",height:"150px"}} src={props.slides[props.index].url} />
                    </div>

                </div></td>
               
                <td><div onClick={nextIndex}> {'>'} </div></td>
               
               </tr>

            </table>

        </div>
    </>

}