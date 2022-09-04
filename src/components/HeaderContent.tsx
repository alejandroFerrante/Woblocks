import { useContext } from "react"
import { Toolbar, AppBar } from '@material-ui/core'
import ObjectTabs from './ObjectTabs'
import PlayDialogButton from './PlayDialogButton'
import WoblocksLogo from './WoblocksLogo'

import DialogButton from './DialogButton'

import { PermDataSetting, CloudUpload, Save, Code } from '@material-ui/icons'

import WBContext from '../WBContext'

import woblocksControl from '../models/woblocksControl'
import {getBackgrounds} from '../ImagePathManager';

import GeneratedCode from './GeneratedCode'
import GameConfig from './GameConfig'
import ProjectLoad  from './ProjectLoad'
import ProjectSave  from './ProjectSave'

import GameConfigAccept from './GameConfig'
import ProjectLoadAccept from './ProjectLoad'
import ProjectSaveAccept from './ProjectSave'

export default function HeaderContent(props:any) {
    
	const {globalState,setGlobalState,val,valSetter} = useContext(WBContext);

    const onGameConfigAccept = GameConfigAccept;

    return <AppBar position="static">
        <Toolbar>
            <WoblocksLogo/>
            <ObjectTabs />
            {globalState.currentTabIndex === 0 && 
                <>

                    <DialogButton Icon = {PermDataSetting} title="Configuracion del Juego" tooltip="Configuracion del Juego" onAccept={onGameConfigAccept} >
                        <GameConfig />                            
                    </DialogButton>

                    <DialogButton Icon = {CloudUpload} title="Cargar Proyecto" tooltip="Cargar Proyecto" onAccept={ProjectLoadAccept} >
                        <ProjectLoad />
                    </DialogButton>

                    <DialogButton Icon = {Save} title="Guardar Proyecto" tooltip="Guardar Proyecto" onAccept={ProjectSaveAccept}>
                        <ProjectSave />
                    </DialogButton>

                    <DialogButton Icon = {Code} title="Codigo Generado" tooltip="Codigo Generado" >
                        <GeneratedCode />                            
                    </DialogButton>
                </>
            }
            <PlayDialogButton/>
        </Toolbar>
    </AppBar>
}

/*
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

*/