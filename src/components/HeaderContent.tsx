import { Toolbar, AppBar } from '@material-ui/core'
import ObjectTabs from './ObjectTabs'
import PlayDialogButton from './PlayDialogButton'
import WoblocksLogo from './WoblocksLogo'

export function HeaderContent(props:any) {
    // TODO: use pallete
    return <AppBar position="static">
        <Toolbar>
            <WoblocksLogo/>
            <ObjectTabs />
            <PlayDialogButton/>
        </Toolbar>
    </AppBar>
}