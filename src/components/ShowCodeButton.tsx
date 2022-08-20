import {getIconPathFor} from '../ImagePathManager'
import swal from 'sweetalert'
import woblocksControl from '../models/woblocksControl'

export default function ShowCodeButton(){

	const buttonStyle = {width:"40px",height:"33px",backgroundColor:"transparent",borderColor:"transparent"};
	const imgStyle = {width:"100%",height:"100%",color:"white"};

	const handleClick = function(){
		swal("Codigo Generado", ""+woblocksControl.getExecutionString());
	}

	return <button style={buttonStyle} onClick={handleClick} ><img style={imgStyle} src={getIconPathFor('showCode')}/></button>

}