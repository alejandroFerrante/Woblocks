import { Add as AddIcon } from '@material-ui/icons'

import { IconButton } from '@material-ui/core'

import {useContext} from 'react'
import WBContext from '../WBContext'


export default function AddObjectDialogButton(props:any){
    
    const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);
    
    const handleCLick = () => {
        console.log('AddObjectDialogButton handleCLick >> '+globalState.modalState);
        if(globalState.modalState !== 'OBJCREATE_OPEN'){
            globalState.modalState = 'OBJCREATE_OPEN';
            setGlobalState(globalState);
            valSetter( (val + 1) % 2);
        }
    }

    return <>
        <IconButton color="inherit" aria-label="Añadir Objeto" onClick={handleCLick}>
            <AddIcon />
        </IconButton>
    </>

}
