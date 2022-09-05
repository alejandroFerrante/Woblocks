import { useState, useContext } from "react"
import { Menu, Button, Grid, TextField, Switch, SvgIcon, FormGroup, FormControlLabel } from '@material-ui/core'
import { ArrowForward, ArrowBack } from '@material-ui/icons'
import WBContext from '../WBContext'
import {imagePathManager, Representation} from '../ImagePathManager'

export default function NewObject(props:any){
	
    const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);

    //Icon Select
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const selectIconOpen = Boolean(anchorEl);
	const showHideIconsMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
		if(globalState.proposedNewObjIsVisual){return;}
		setAnchorEl(event.currentTarget);
	};
	const handleCloseShowMenu = () => {
		setAnchorEl(null);
	};

	//Others
	const onNameChange = function(event:any){
		globalState.proposedNewObjName = event.target.value;
		setGlobalState(globalState);
		valSetter( (val + 1) % 2);
    }

    const onVisualModeChange = function(isVisual: boolean){
    	globalState.proposedNewObjIsVisual = isVisual;
    	globalState.selectedRepresentation = imagePathManager.representations[0];
    	setGlobalState(globalState);
		valSetter( (val + 1) % 2);	
    }

    //Slider
    const nextRepresentation = (isForward = true) => () => {
    	globalState.selectedRepresentation = imagePathManager.nextVisual(globalState.selectedRepresentation, isForward)
        setGlobalState(globalState);
        valSetter( (val + 1) % 2);
    }

    const representationSelected = function(representation: Representation){
    	globalState.selectedRepresentation = representation;
    	setGlobalState(globalState);
        valSetter( (val + 1) % 2);
        handleCloseShowMenu();
    }

	const iconStyle = {width:"30px", height:"30px"}
	const slideStyle = {
        boarderRadius: "10px",
        backgroundPosition: "center",
        backgroundSize: "cover"
    }

	return <> 
		<FormGroup row={true}>

			{/********* Selector de íconos */}
			<FormControlLabel control={
				<Button
		id="basic-button" aria-controls={selectIconOpen ? 'basic-menu' : undefined}
		aria-haspopup="true" aria-expanded={selectIconOpen ? 'true' : undefined}
		onClick={showHideIconsMenu} >
					<img 
						alt="Ícono del objeto"
						title={(!globalState.proposedNewObjIsVisual && 'Seleccionar Icono') || 'el icono cambiara al seleccionar un sprite'} 
						style={iconStyle} 
						src={globalState.selectedRepresentation.icon}
					/>
				</Button>} 
				label="Ícono"
			/>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={selectIconOpen}
				onClose={handleCloseShowMenu}
				MenuListProps={{
				'aria-labelledby': 'basic-button',
				}}
			>
				<Grid container >{
						imagePathManager.representations.map(representation => 
							<Grid item xs={4} key={representation.icon}>
								<img 
									alt="Ícono"
									style={iconStyle} 
									src={representation.icon} 
									onClick={()=>{representationSelected(representation)}} 
								/>
							</Grid>
						)
				}</Grid>
			</Menu>

			{/********* Nombre del objeto */}
			<TextField 
				label="Nombre" 
				onChange={onNameChange} 
				error={
					globalState.proposedNewObjName === '' || 
						globalState.tabObjects.map(function(elem:any){return elem.name}).includes(globalState.proposedNewObjName)
				} 
				helperText={
					((globalState.proposedNewObjName === '' && 'El nombre no puede ser vacio') || (globalState.tabObjects.map(function(elem:any){return elem.name}).includes(globalState.proposedNewObjName) && 'Un objeto con este nombre ya fue creado'))
				}
			/>

			{/********* Switch objeto visual y selector de imagen */}
			<FormControlLabel 
				control={<Switch checked={props.visualMode} onClick={ (event:any) => onVisualModeChange(event.target.checked)} title="Un objeto visual existira graficamente en el juego. Debe poseer un metodo image y position"/>} 
				label="¿Es visual?" 
			/>
			{ globalState.proposedNewObjIsVisual && 
				<table style={{paddingLeft:"30%"}}>
	      			<td><div onClick={nextRepresentation(false)}> <SvgIcon ><ArrowBack /></SvgIcon> </div></td>
	                
	                <td><div style={slideStyle} > 
	                    <div style={{textAlign:"center"}} >
	                        <>    
	                        	<img 
									alt="Imagen del objeto en el juego"
									style={{width:"140px",height:"140px"}} 
									src={globalState.selectedRepresentation.url}
								/>   
	                        </>
	                    </div>
	                </div></td>
	               
	                <td><div onClick={nextRepresentation()}> <SvgIcon ><ArrowForward /></SvgIcon> </div></td>
	  			</table>
      		}
		</FormGroup>		 
	</>
}
