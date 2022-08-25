
import { Add as AddIcon } from '@material-ui/icons'
import { IconButton } from '@material-ui/core'

import {useContext} from 'react'
import WBContext from '../WBContext'

type ChangeModalStateButtonProps = {
    Icon: typeof AddIcon,
    newModalState: string,
    iconColor:string,
    buttonTitle:string
}

export default function ChangeModalStateButton({Icon, newModalState, iconColor, buttonTitle}:ChangeModalStateButtonProps ){
    
    const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);
    
    const handleCLick = () => {
        if(globalState.modalState !== newModalState){
            globalState.modalState = newModalState;
            setGlobalState(globalState);
            valSetter( (val + 1) % 2);
        }
    }

    return <>
        <IconButton color="inherit" aria-label={buttonTitle}  onClick={handleCLick} title={buttonTitle}>
            <Icon style={{color:iconColor}} />
        </IconButton>
    </>

}