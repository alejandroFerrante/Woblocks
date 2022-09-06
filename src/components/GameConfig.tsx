
import { useContext } from "react"
import WBContext from '../WBContext'

import {getBackgrounds} from '../ImagePathManager';
import woblocksControl from '../models/woblocksControl'

import TextField from '@material-ui/core/TextField';

export function GameConfigAccept(){
    const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);
    const backs = [{name:'ninguna',url:'',value:''}].concat(getBackgrounds());

    globalState.gameWidth = globalState.proposedWidth;
    globalState.gameHeight = globalState.proposedHeight;
    globalState.gameBackgroundImage = backs[globalState.proposedBackgroundIndex];
    woblocksControl.saveConfigInfo(globalState.gameWidth,globalState.gameHeight, globalState.gameBackgroundImage);

    setGlobalState(globalState);
    valSetter( (val + 1) % 2);
}

export default function GameConfig(){

    //COMPONENT USED FOR CONFIGURING WIDTH, HEIGHT AND BACKGROUND IMAGE

	const cellStyle = {paddingLeft:"10%",paddingRight:"10%"};

	const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);
    globalState.proposedWidth = globalState.gameWidth;
    globalState.proposedHeight = globalState.gameHeight;
    setGlobalState(globalState);

    const onWidthChange = (event:any) => { 
        globalState.proposedWidth = event.target.value;
        setGlobalState(globalState);
    }

    const onHeightChange = (event:any) => { 
        globalState.proposedHeight = event.target.value;
        setGlobalState(globalState);
    }

	return <>
			<br/><br/>
	        <div style={cellStyle} > 
                <TextField defaultValue={globalState.proposedWidth} label="Ancho" onChange={onWidthChange} error={(!globalState.proposedWidth || globalState.proposedWidth <= 0 )} helperText={( (!globalState.proposedWidth || globalState.proposedWidth <= 0 ) && 'El ancho debe ser un entero positivo' )}/>
            </div>
	        <br/>
	        <div style={cellStyle} > 
                <TextField defaultValue={globalState.proposedHeight} label="Alto" onChange={onHeightChange} error={(!globalState.proposedHeight || globalState.proposedHeight <= 0)} helperText={( (!globalState.proposedHeight || globalState.proposedHeight <= 0) && 'La altura debe ser un entero positivo' )}/>
            </div> 
	        <br/>
	        <div style={cellStyle}><Slider slides={[{name:'ninguna',url:''}].concat(getBackgrounds())} /> </div>
		    <br/>	
	</>
}

export function Slider(props:any){

    const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);
    const backs = [{name:'ninguna',url:'',value:''}].concat(getBackgrounds());  

    const nextIndex = () => {
        if(globalState.proposedBackgroundIndex === props.slides.length - 1){
            globalState.proposedBackgroundIndex = 0;
        }else{
            globalState.proposedBackgroundIndex++;
        }
        setGlobalState(globalState);    
        valSetter( (val + 1) % 2);
    }

    const previousIndex = () => {
        if(globalState.proposedBackgroundIndex === 0 ){
            globalState.proposedBackgroundIndex = props.slides.length - 1;
        }else{
            globalState.proposedBackgroundIndex--;
        }
        setGlobalState(globalState);  
        valSetter( (val + 1) % 2);  
    }

    //STYLES///////////////////////////////////
    const slideStyle = {
        width: "60%",
        height: "60%",
        boarderRadius: "10px",
        backgroundPosition: "center",
        backgroundSize: "cover"
    }
    ///////////////////////////////////////////

    return <>
        <div  >
            Imagen de Fondo: <label style={{textAlign:"center"}}>{ backs[globalState.proposedBackgroundIndex].name }</label>
            <table>
              
              <tr>
                <td><div onClick={previousIndex}> {'<'} </div></td>
                
                <td><div style={slideStyle} > 

                    <div>
                        <img alt="Imagen de Fondo" style={{width:"180px",height:"150px"}} src={backs[globalState.proposedBackgroundIndex].url} />
                    </div>

                </div></td>
               
                <td><div onClick={nextIndex}> {'>'} </div></td>
               
               </tr>

            </table>

        </div>
    </>

}