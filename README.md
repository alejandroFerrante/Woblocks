<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">What is Woblocks</a>
    </li>
    <li>
      <a href="#getting-started">HOW TO INSTALL</a>
    </li>
    <li><a href="#usage">HOW TO USE</a></li>
    <li><a href="#roadmap">HOW TO EXPORT YOUR CODE</a></li>
    <li><a href="#contributing">COLLABORATORS & LINKS</a></li>
  </ol>
</details>

## What is Woblocks?

Woblocks is the result of a match made in heaven: Google's Blockly, a block-based open source language and Wollok, a OOP language designed to seamlessly illustrate and teach about the fundamental principles of object oriented programming.

Wollok was created by teachers and researchers of different Argentinian public Universities as an educational tool. The natural evolution of the project came with Wollok Game, an extension that incorporates tools to not only write programs but to generate video games, taking the didactic experience to the next level.
This is where Woblocks comes along to provide a new way of building programs and video games: Blocks.

Blocks have proven to be a fantastic way to approach the teaching of programming languages in a visual way. Rather than simply writing code, block manipulation creates more familiar metaphors for non technical people.

Our hope is to make this project grow in a collaborative way, adding more features and refining its functioning in order to make it easy to use and understand, and yet a powerful tool for building and learning the fundamentals of OOP. 

## How to Install

In order to get Woblocks running you will need some prequisites.In any Unix system, you can intstall them via the terminal console.

*create containing folder
    mkdir <folder name>

*install nvm
		wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash

*install npm
		nvm install node

*install http server
		sudo npm install -g http-server
	
*install git
		sudo apt-get install git
	
*download Woblocks
		git clone https://github.com/alejandroFerrante/Woblocks.git
	
*download Wollok & Wollok Game
		cd Woblocks
		npm install
	
Congratulations!Now you can run Woblocks via
  npm start

And finally open a browser and check http://127.0.0.1:8081/


## How to Use

Once you have completed the installation phase, you will be able to start building with Woblocks!
You wil see the main screen as follows:

*1- Blocks Workspace
*2- Blocks Toolbox
*3- Created Objects Tabs
*4- Generated Code
*5- Scene
*6- Game Config
*7- Import/Export

To define an object, simply go to the Toolbox section and drag the object block to the Workspace.
Next you will be able to attach properties and method blocks by dragging it from the Toolbox section.

The main execution thread will be formed from the stacking of blocks from the Workspace section and will be displayed on the Scene section.
For example:
You can get a more detailed example here.
  
## How to Export Code

Once you are satisfied with the work you've done, you can export it as a .wbk file. You do so by going to the Import/Export section and clicking the export button.
  
## Collaborators & Links

https://www.wollok.org/

https://github.com/wollok

https://uqbar.org/#/
