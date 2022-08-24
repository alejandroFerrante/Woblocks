import { useContext } from "react"
import WBContext from '../WBContext'

import {getIconPathFor} from '../ImagePathManager'

import { PermDataSetting } from '@material-ui/icons'
import {SvgIcon, IconButton} from '@material-ui/core/'

export default function ConfigButton(){

	const {globalState,val,setGlobalState,valSetter} = useContext(WBContext);

	const handleClick = function(){
		globalState.modalState = 'CONFIG_OPEN';
        setGlobalState(globalState);
        valSetter( (val + 1) % 2);
	}

	return <>
		<IconButton onClick={handleClick} >
			<SvgIcon titleAccess="Configuracion del Juego" >
				<PermDataSetting style={{color:"white"}} />
    		</SvgIcon>
	    </IconButton>
	</>
}