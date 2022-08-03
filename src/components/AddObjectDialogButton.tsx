import { Add as AddIcon } from '@material-ui/icons'
import DialogButton from './DialogButton'

export default function AddObjectDialogButton(){
    const handleAccept = () => {
        // TODO: produce global effect: create object
    }

    return <DialogButton 
        title={"Añadir objeto"}
        tooltip={"Añadir  objeto"}
        Icon={AddIcon}
        onAccept={handleAccept}
    >
        Añadir/Editar objeto
        Aquí hay que poner un componente que permita editar las propiedades del objeto
    </DialogButton>
}
