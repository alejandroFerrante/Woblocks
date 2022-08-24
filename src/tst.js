
import {Game} from '../node_modules/wollok-game-web/dist/index.js'

export function playGame(aProject, aGameDiv){
	var result = new Game(aProject);
	result.start(aGameDiv);
	return result;
}