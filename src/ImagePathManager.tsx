
export type Representation = {
	isVisual: boolean,
	name: string,
	icon: any,
	alias: string,
	url: any
}

export const imagePathManager = {

	sprites:{
		clown_0:{url:require('./resources/sprites/clown_0.png') , alias:'clown_0.png'},
		clown_1:{url:require('./resources/sprites/clown_1.png') , alias:'clown_1.png'},
		fireWall:{url:require('./resources/sprites/fireWall.png') , alias:'fireWall.png'},
		pepita:{url:require('./resources/representations/pepita.png') , alias:'pepita.png'},
		bull:{url:require('./resources/representations/bull.png') , alias:'bull.png'},
		lion:{url:require('./resources/representations/lion.png') , alias:'lion.png'}
	},
	backgrounds:{
		circus_background:{url:require('./resources/sprites/circus_background.png') , alias:'circus_background.png'},
	},
	representations:[
		{isVisual:true,   name:"pepita",icon:require('./resources/representations/icons/pepita_icon.png'),alias:"pepita.png", url:require('./resources/representations/pepita.png')},
		{isVisual:true,   name:"bull",icon:require('./resources/representations/icons/bull_icon.png'),alias:"bull.png", url:require('./resources/representations/bull.png')},
		{isVisual:true,   name:"lion",icon:require('./resources/representations/icons/lion_icon.png'),alias:"lion.png", url:require('./resources/representations/lion.png')},
		{isVisual:false,  name:"config",icon:require('./resources/representations/icons/config.png'),alias:"", url:""},
		{isVisual:false,  name:"cross",icon:require('./resources/representations/icons/cross.png'),alias:"", url:""},
		{isVisual:false,  name:"sound",icon:require('./resources/representations/icons/sound.png'),alias:"", url:""},
		{isVisual:false,  name:"thumbdown",icon:require('./resources/representations/icons/thumbdown.png'),alias:"", url:""},
		{isVisual:false,  name:"thumbup",icon:require('./resources/representations/icons/thumbup.png'),alias:"", url:""},
		{isVisual:false,  name:"tick",icon:require('./resources/representations/icons/tick.png'),alias:"", url:""}
	],
	wbIcons:{
		action:require('./resources/wbIcons/action.png'),
		arrow:require('./resources/wbIcons/arrow.png'),
		buttonPress:require('./resources/wbIcons/buttonPress.png'),
		circle:require('./resources/wbIcons/circle.png'),
		condition:require('./resources/wbIcons/condition.png'),
		conditionNOK:require('./resources/wbIcons/conditionNOK.png'),
		conditionOK:require('./resources/wbIcons/conditionOK.png'),
		config:require('./resources/wbIcons/config.png'),
		controller:require('./resources/wbIcons/controller.png'),
		crash:require('./resources/wbIcons/crash.png'),
		forEach:require('./resources/wbIcons/forEach.png'),
		galery:require('./resources/wbIcons/galery.png'),
		load:require('./resources/wbIcons/load.png'),
		mSend:require('./resources/wbIcons/mSend.png'),
		object:require('./resources/wbIcons/object.png'),
		play:require('./resources/wbIcons/play.png'),
		playScene:require('./resources/wbIcons/playScene.png'),
		pointer:require('./resources/wbIcons/pointer.png'),
		question:require('./resources/wbIcons/question.png'),
		question_black:require('./resources/wbIcons/question_black.png'),
		return:require('./resources/wbIcons/return.png'),
		save:require('./resources/wbIcons/save.png'),
		showCode:require('./resources/wbIcons/showCode.png'),
		stopScene:require('./resources/wbIcons/stopScene.png'),
		timer:require('./resources/wbIcons/timer.png'),
		trash:require('./resources/wbIcons/trash.png'),
		wollok:require('./resources/wbIcons/wollok.png'),
		wollokBW:require('./resources/wbIcons/wollokBW.png'),
		world:require('./resources/wbIcons/world.png')
	},

	nextVisual: function(currentRep: Representation, isForward: boolean){
		// TODO: revisar
		var visuals = imagePathManager.representations.filter( rep => rep.isVisual)
		var nextIndex = 1 + visuals.indexOf(currentRep) + (isForward ? 1 : -1)
		return [visuals[visuals.length-1], ...visuals, visuals[0]][nextIndex]
	}
}

export const getIconPathFor = function(anIconName:string){
	if(anIconName in imagePathManager.wbIcons){
		return imagePathManager.wbIcons[anIconName as keyof typeof imagePathManager.wbIcons];	
	}else{
		return '';
	}
}

export const getRepIconFor =   function(aRepresentationIconName:string){
	const found = imagePathManager.representations.find(elem => elem.name === aRepresentationIconName);

	if(found){
		return found.icon;	
	}else{
		return '';
	}
}

export const getAllSprites = function(){
	return Object.values(imagePathManager.sprites);
}

export const getBackgrounds = function(){
	return Object.keys(imagePathManager.backgrounds).map(function(key:string){ const backs:any = imagePathManager.backgrounds; return {name:key , url:backs[key].url, value:backs[key].alias}});
}

export const getAllBackgrounds = function(){
	return Object.values(imagePathManager.backgrounds);
}