import { useContext } from "react"
import WBContext from '../WBContext'

import {getIconPathFor} from '../ImagePathManager'

import { Save } from '@material-ui/icons'
import {SvgIcon, IconButton} from '@material-ui/core/'

export default function SaveProjectButton(){

	const {globalState,val,setGlobalState,valSetter} = useContext(WBContext);

	const handleClick = function(){
		globalState.modalState = 'PROJSAVE_OPEN';
        setGlobalState(globalState);
        valSetter( (val + 1) % 2);
	}

	return<>
		<IconButton onClick={handleClick} >
			<SvgIcon titleAccess="Guardar Proyecto" >
				<Save style={{color:"white"}} />
    		</SvgIcon>
	    </IconButton>
	</>

}