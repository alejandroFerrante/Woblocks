import { Toolbar, AppBar, Typography } from '@material-ui/core'
import ObjectTabs from './ObjectTabs'
import PlayDialogButton from './PlayDialogButton'

export function HeaderContent(props:any) {
    // TODO: use pallete
    return <AppBar position="static">
        <Toolbar>
            <Typography variant="h5">Woblocks</Typography>
            <ObjectTabs openCreateObjectModal={props.openCreateObjectModal} definedObjects={props.definedObjects} currentTab={props.currentTab} onTabSwitch={props.onTabSwitch} />
            <PlayDialogButton/>
        </Toolbar>
    </AppBar>
}