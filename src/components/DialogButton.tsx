import { AppBar, Dialog, DialogProps, IconButton, IconButtonProps, Toolbar, Typography } from '@material-ui/core'
import { Close as CloseIcon, Done as DoneIcon } from '@material-ui/icons'
import { ReactNode, useState } from 'react'

type DialogButtonProps = {
    Icon: typeof CloseIcon,
    title: string,
    tooltip: string,
    children: ReactNode,
    onAccept?: ()=>void, 
    buttonProps?: IconButtonProps,
    dialogProps?: Partial<DialogProps>
}

/**
 * Draws a button that opens a Dialog when clicked, and has a close icon.
 * The dialog contents are the children of the element.
 * @prop When onAccept is provided, this is an "Accept/Cancel" dialog
 */
export default function DialogButton({Icon, title, tooltip, children, onAccept, buttonProps, dialogProps}: DialogButtonProps){
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const handleAccept = () => {setOpen(false); onAccept!()}

    return <>
        <IconButton {...buttonProps} color="inherit" aria-label={tooltip} onClick={handleOpen}>
            <Icon />
        </IconButton>
        <Dialog {...dialogProps} open={open} onClose={handleClose}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="Cerrar">
                        <CloseIcon />
                    </IconButton>
                    <Typography>{title}</Typography>
                    { // If we have a callback onAccept, then we are an "Accept/Cancel" dialog
                    onAccept && <IconButton edge="end" color="inherit" onClick={handleAccept} aria-label="Cerrar">
                        <DoneIcon />
                    </IconButton>}
                </Toolbar>
            </AppBar>
            {children}
        </Dialog>
    </>
}