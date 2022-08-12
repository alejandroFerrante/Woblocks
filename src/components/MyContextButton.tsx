import {useContext} from 'react'
import WBContext from '../WBContext'


export default function MyContextButton(props:any){
    
    const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);
    
    const handleCLick = () => {
        console.log('MyContextButton handleCLick >> ');
        globalState.modalState = 'OPEN';
        setGlobalState(globalState);
        valSetter(5);
    }

    return <>
        <button color="inherit" aria-label="Añadir Objeto" onClick={handleCLick}>Click Me
        </button>
    </>

}