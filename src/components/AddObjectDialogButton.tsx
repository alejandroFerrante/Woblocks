import { Add as AddIcon } from '@material-ui/icons'
//import DialogButton from './DialogButton'

import { IconButton } from '@material-ui/core'

export default function AddObjectDialogButton(props:any){
    
    
    return <>
        <IconButton color="inherit" aria-label="Añadir Objeto" onClick={props.openCreateObjectModal}>
            <AddIcon />
        </IconButton>
    </>
        
}
