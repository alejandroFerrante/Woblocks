import { useState, useContext } from "react"

import { Menu, Button, MenuItem, Grid, Paper, TextField, Switch, SvgIcon } from '@material-ui/core'
import { Close as CloseIcon, Done as DoneIcon } from '@material-ui/icons'
import { ArrowForward, ArrowBack } from '@material-ui/icons'
import woblocksControl from '../models/woblocksControl'

import WBContext from '../WBContext'
import {imagePathManager} from '../ImagePathManager'


/*
export function NewObjectAccept(){
		const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);

		if(!globalState.proposedNewObjName || globalState.proposedNewObjName === ''){
			return;
		}
		if(globalState.tabObjects.map(function(elem:any){return elem.name}).includes(globalState.proposedNewObjName) ){
			return;
		}
		//{chosenName, chosenRepresentation}
		const rep = imagePathManager.representations.filter(function(elem:any){return (!globalState.proposedNewObjIsVisual) || (elem.isVisual == true)})[globalState.proposedNewObjRepIcon];
		console.log('NewObjectModal handleAccept');

		//SAVE CURRENT WORKSPACE
		if(globalState.currentTabIndex == 0){
			woblocksControl.saveSceneXmlContent();
		}else{
			woblocksControl.saveObjectTabXmlContentWithIndex(globalState.currentTabIndex - 1);
		}

		//ADD TAB OBJ
		globalState.tabObjects.push( {name:globalState.proposedNewObjName , icon:rep.name} );

		//SELECT TAB
		globalState.currentTabIndex = globalState.tabObjects.length - 1;

		//ADD OBJ DATA
		woblocksControl.addObjectNamed(globalState.proposedNewObjName, rep.name,rep.isVisual);

		//LOAD NEW WORKSPACE
		var repImage = (globalState.proposedNewObjIsVisual)? rep.alias : null;//if visual add the image method to the block construct
		woblocksControl.addDefaultObjectXmlToWorkspaceWithNameAndImage	(globalState.proposedNewObjName, repImage);//this clears the workspace

		//SAVE OBJ WORKSPACE INFO
		woblocksControl.saveObjectTabXmlContentWithIndex(globalState.currentTabIndex - 1);
		woblocksControl.setObjectInfoOfIndex(globalState.currentTabIndex - 1, rep.name,globalState.proposedNewObjIsVisual);

		woblocksControl.closeToolbox();

        setGlobalState(globalState);
        valSetter( (val + 1) % 2);
	
}
*/

export default function NewObject(props:any){
	
    const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);

    const currentRepresentations = imagePathManager.representations.filter(function(elem:any){return (!globalState.proposedNewObjIsVisual) || (elem.isVisual == true)});
    
    const colSize = 4;
    var iconsGrid = [];
    var current = [];
    for(var i = 0; i < imagePathManager.representations.length; i++){
    	current.push({index:i , url:imagePathManager.representations[i].icon});
    	if(current.length === colSize || i == imagePathManager.representations.length - 1){
    		iconsGrid.push(current);
    		current = [];
    	}
    }

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

    const onVisualModeChange = function(){
    	globalState.proposedNewObjIsVisual = ! globalState.proposedNewObjIsVisual;
    	globalState.proposedNewObjRepIcon = 0;
    	setGlobalState(globalState);
		valSetter( (val + 1) % 2);	
    }

    //Slider
    const nextIndex = () => {
    	if(globalState.proposedNewObjRepIcon == currentRepresentations.length - 1){
            globalState.proposedNewObjRepIcon = 0;
        }else{
        	globalState.proposedNewObjRepIcon = globalState.proposedNewObjRepIcon +1;
        }
        setGlobalState(globalState);
        valSetter( (val + 1) % 2);
    }

    const previousIndex = () => {
        if(globalState.proposedNewObjRepIcon == 0 ){
            globalState.proposedNewObjRepIcon = currentRepresentations.length - 1;
        }else{
            globalState.proposedNewObjRepIcon = globalState.proposedNewObjRepIcon -1;
        }
        setGlobalState(globalState);
        valSetter( (val + 1) % 2);
    }

    const iconSelected = function(aNewValue:any){
    	globalState.proposedNewObjRepIcon = aNewValue;
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
	<table>
        <tr>
        <td>
		  <Button
	        id="basic-button" aria-controls={selectIconOpen ? 'basic-menu' : undefined}
	        aria-haspopup="true" aria-expanded={selectIconOpen ? 'true' : undefined}
	        onClick={showHideIconsMenu} >
        		<img title={(!globalState.proposedNewObjIsVisual && 'Seleccionar Icono') || 'el icono cambiara al seleccionar un sprite'} style={iconStyle} src={currentRepresentations[globalState.proposedNewObjRepIcon].icon} />
      	  </Button>
        </td>
      	
      	<td style={{paddingLeft:"20%"}} >
      		<TextField label="Nombre" onChange={onNameChange} error={globalState.proposedNewObjName === '' || globalState.tabObjects.map(function(elem:any){return elem.name}).includes(globalState.proposedNewObjName)} helperText={((globalState.proposedNewObjName === '' && 'El nombre no puede ser vacio') || (globalState.tabObjects.map(function(elem:any){return elem.name}).includes(globalState.proposedNewObjName) && 'Un objeto con este nombre ya fue creado'))}/>
      	</td>
      	<td style={{paddingLeft:"15%"}}>
      		{'Es Visual? '} <Switch checked={props.visualMode} onClick={onVisualModeChange} title="Un objeto visual existira graficamente en el juego. Debe poseer un metodo image y position"/>
      	</td>
      	</tr>
      	
      </table>
      
      { globalState.proposedNewObjIsVisual && 
				<table style={{paddingLeft:"30%"}}>
	      			<td><div onClick={previousIndex}> <SvgIcon ><ArrowBack /></SvgIcon> </div></td>
	                
	                <td><div style={slideStyle} > 
	                    <div style={{textAlign:"center"}} >
	                        <>    
	                        	<img style={{width:"140px",height:"140px"}} src={currentRepresentations[globalState.proposedNewObjRepIcon].url} />   
	                        </>
	                    </div>
	                </div></td>
	               
	                <td><div onClick={nextIndex}> <SvgIcon ><ArrowForward /></SvgIcon> </div></td>
	  			</table>
      		}
      <br/>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={selectIconOpen}
        onClose={handleCloseShowMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
      <Grid>

      	<table>
      		{	iconsGrid.map( function(row:any){
      				return <tr>
      				{row.map(function(elem:any){
      					return <td> <img style={iconStyle} src={elem.url} onClick={()=>{iconSelected(elem.index)}} /> </td>
      				})}
      				</tr>
      			} ) 		
      		}
      	</table>

      </Grid>

      </Menu>
		 
	</>
}
