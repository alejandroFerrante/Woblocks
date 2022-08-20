import { Toolbar, AppBar } from '@material-ui/core'
import ObjectTabs from './ObjectTabs'
import PlayDialogButton from './PlayDialogButton'
import WoblocksLogo from './WoblocksLogo'
import ConfigButton from './ConfigButton'
import SaveProjectButton from './SaveProjectButton'
import LoadProjectButton from './LoadProjectButton'
import ShowCodeButton from './ShowCodeButton'

import { useContext } from "react"
import WBContext from '../WBContext'

export function HeaderContent(props:any) {
    
	const {globalState} = useContext(WBContext);

    return <AppBar position="static">
        <Toolbar>
            <WoblocksLogo/>
            <ObjectTabs />
            <PlayDialogButton/>
            {globalState.currentTabIndex === 0 && 
                <>
                    <ConfigButton />
                    <SaveProjectButton />
                    <LoadProjectButton />
                    <ShowCodeButton />
                </>
            }
        </Toolbar>
    </AppBar>
}