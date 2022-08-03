<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
	What is Woblocks
    </li>
    <li>
	Prerequisites
    </li>
    <li>
	Running
    </li>
    <li>
	How to Use
    </li>
    <li>
    Default Images and Icons
    </li>
    <li>
	How to Export your Code
    </li>
    <li>
    Color Palettes
    </li>
    <li>
	Collaborators & Links
    </li>
  </ol>
</details>

## What is Woblocks?

Woblocks is the result of a match made in heaven: Google's Blockly, a block-based open source language and Wollok, a OOP language designed to seamlessly illustrate and teach about the fundamental principles of object oriented programming.

Wollok was created by teachers and researchers of different Argentinian public Universities as an educational tool. The natural evolution of the project came with Wollok Game, an extension that incorporates tools to not only write programs but to generate video games, taking the didactic experience to the next level.
This is where Woblocks comes along to provide a new way of building programs and video games: Blocks.

Blocks have proven to be a fantastic way to approach the teaching of programming languages in a visual way. Rather than simply writing code, block manipulation creates more familiar metaphors for non technical people.

Our hope is to make this project grow in a collaborative way, adding more features and refining its functioning in order to make it easy to use and understand, and yet a powerful tool for building and learning the fundamentals of OOP. 

## Prerequisites

In order to get Woblocks running you will need some prequisites. In any Unix system, you can intstall them via the terminal console.
 
#### Install git and clone the project
```bash
	sudo apt-get install git
	git clone https://github.com/alejandroFerrante/Woblocks.git
	cd Woblocks # important, to get into the project folder
```

#### Install nvm and npm
```bash
    # installing nvm
    wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash 
    # installing npm via nvm
    nvm install node
```

#### Install dependencies
```bash
    npm install
```

#### Update default images and default icons

Next you will have to run a python script to configure default images and object icons. This script is called "generateDefaultImagesAndIcons.py", so if you open a terminal on the Woblocks directory run the command

```bash
python generateDefaultImagesAndIcons.py
```

## Running

Congratulations! Now you can run Woblocks. In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## How to Use

Once you have completed the installation phase, you will be able to start building with Woblocks!
You wil see the main screen as follows:

![Woblocks Main Screen](https://github.com/alejandroFerrante/Woblocks/blob/main/readme_SplashScreenReference.png)

- Blocks Workspace
- Blocks Toolbox
- Created Objects Tabs
- Generated Code
- Scene
- Game Config
- Import/Export

To define an object, simply go to the Toolbox section and drag the object block to the Workspace.
Next you will be able to attach properties and method blocks by dragging it from the Toolbox section.

![Drag Object BLock](https://github.com/alejandroFerrante/Woblocks/blob/main/readme_DragObjectBlock.png)

The main execution thread will be formed from the stacking of blocks from the Workspace section and will be displayed on the Scene section.

You can get a more detailed example here.

## Default Images and Icons

Woblocks uses a default set of images and icons that will be enabled by default for you to use. This are stored in /imgs and /icons/representations respectively.
You can add images to this directories and then you must run the generateDefaultImagesAndIcons script in order to incorporate them.

  
## How to Export Code

Once you are satisfied with the work you've done, you can export it as a .wbk file. You do so by going to the Import/Export section and clicking the export button.

## Color Palettes

Aren't the Woblocks block colors great? We are sure you agree, but if for any reason you want to personalize them with your own choice of palette, you can do so by editing the file called "pallettes.js".
  
## Collaborators & Links

https://www.wollok.org/

https://github.com/wollok

https://uqbar.org/#/