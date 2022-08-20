import { useContext } from "react"
import WBContext from '../WBContext'

import {getIconPathFor} from '../ImagePathManager'

//import woblocksControl from '../models/woblocksControl'

export default function SaveProjectButton(){

	const {globalState,val,setGlobalState,valSetter} = useContext(WBContext);

	const buttonStyle = {width:"40px",height:"33px",backgroundColor:"transparent",borderColor:"transparent"};
	const imgStyle = {width:"100%",height:"100%",color:"white"};

	const handleClick = function(){
		globalState.modalState = 'PROJSAVE_OPEN';
        setGlobalState(globalState);
        valSetter( (val + 1) % 2);
	}

	return <button style={buttonStyle} onClick={handleClick} ><img style={imgStyle} src={getIconPathFor('save')}/></button>

}