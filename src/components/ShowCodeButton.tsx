import {useState, useContext} from 'react'
import {getIconPathFor} from '../ImagePathManager'
//import swal from 'sweetalert'
import woblocksControl from '../models/woblocksControl'

import { Code } from '@material-ui/icons'
import {SvgIcon, IconButton} from '@material-ui/core/'

import WBContext from '../WBContext'

export default function ShowCodeButton(){
	
	const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);

	const handleClick = function(){
		
		var codeStr = woblocksControl.simpleFormatter( woblocksControl.getExecutionString(),true);
		var div:any = document.createElement("div");		
		div.innerHTML = codeStr;
		div.style = "text-align:left";

		//swal({
		//    title: "Codigo Generado",
		//    content: div 
		//});

		openAlert("Codigo Generado",div.outerHTML);
		
	}

	const openAlert = function(aTitle:string,aBody:any){
	    globalState.alertState.isOpen = true;
	    globalState.alertState.title = aTitle;
	    globalState.alertState.body = aBody;
	    globalState.alertState.mode = 'WARNING';
	    setGlobalState(globalState);
	    valSetter( (val+1) % 2 );
	}

	return<>
		<IconButton onClick={handleClick} >
			<SvgIcon titleAccess="Ver Codigo Generado" >
				<Code style={{color:"white"}} />
    		</SvgIcon>
	    </IconButton>
	</>
}