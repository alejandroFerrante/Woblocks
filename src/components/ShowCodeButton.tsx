import {useState} from 'react'
import {getIconPathFor} from '../ImagePathManager'
import swal from 'sweetalert'
import woblocksControl from '../models/woblocksControl'

export default function ShowCodeButton(){

	const buttonStyle = {width:"40px",height:"33px",backgroundColor:"transparent",borderColor:"transparent"};
	const imgStyle = {width:"100%",height:"100%",color:"white"};

	
	const handleClick = function(){
		
		var codeStr = woblocksControl.simpleFormatter( woblocksControl.getExecutionString(),true);
		var div:any = document.createElement("div");		
		div.innerHTML = codeStr;
		div.style = "text-align:left";

		swal({
		    title: "Codigo Generado",
		    content: div 
		});
		
	}

	return <button style={buttonStyle} onClick={handleClick} ><img style={imgStyle} src={getIconPathFor('showCode')} title="Mostrar Codigo Generado"/></button>

}