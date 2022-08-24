import { useContext } from "react"
import WBContext from '../WBContext'

import {getIconPathFor} from '../ImagePathManager'

import woblocksControl from '../models/woblocksControl'

import { CloudUpload } from '@material-ui/icons'
import {SvgIcon, IconButton} from '@material-ui/core/'

export default function LoadProjectButton(){

	const {globalState,val,setGlobalState,valSetter} = useContext(WBContext);

	const buttonStyle = {width:"40px",height:"33px",backgroundColor:"transparent",borderColor:"transparent"};
	const imgStyle = {width:"100%",height:"100%",color:"white"};

	const handleClick = function(){
		globalState.modalState = 'PROJLOAD_OPEN';
        setGlobalState(globalState);
        valSetter( (val + 1) % 2);
	}

	return<>
		<IconButton onClick={handleClick} >
			<SvgIcon titleAccess="Cargar Proyecto" >
				<CloudUpload style={{color:"white"}} />
    		</SvgIcon>
	    </IconButton>
	</>
}