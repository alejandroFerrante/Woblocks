import { Toolbar, AppBar } from '@material-ui/core'
import ObjectTabs from './ObjectTabs'
import PlayDialogButton from './PlayDialogButton'
import WoblocksLogo from './WoblocksLogo'

import ChangeModalStateButton from './ChangeModalStateButton'

import ShowCodeButton from './ShowCodeButton'

import { PermDataSetting, CloudUpload, Save } from '@material-ui/icons'

import { useContext } from "react"
import WBContext from '../WBContext'

export function HeaderContent(props:any) {
    
	const {globalState} = useContext(WBContext);

    return <AppBar position="static">
        <Toolbar>
            <WoblocksLogo/>
            <ObjectTabs />
            {globalState.currentTabIndex === 0 && 
                <>
                    <ChangeModalStateButton
                        Icon = {PermDataSetting}
                        newModalState = "CONFIG_OPEN"
                        iconColor = "white"
                        buttonTitle ="Configuracion del Juego"
                    />
                    <ChangeModalStateButton
                        Icon = {CloudUpload}
                        newModalState = "PROJLOAD_OPEN"
                        iconColor = "white"
                        buttonTitle ="Cargar Proyecto"
                    />
                    <ChangeModalStateButton
                        Icon = {Save}
                        newModalState = "PROJSAVE_OPEN"
                        iconColor = "white"
                        buttonTitle ="Guardar Proyecto"
                    />
                    <ShowCodeButton />
                </>
            }
            <PlayDialogButton/>
        </Toolbar>
    </AppBar>
}
