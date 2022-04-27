import os
cwd = os.getcwd()+'/icons/representations'

with open('representations.js', 'w') as f:
	f.write('function getRepresentationNames(){')
	f.write('\n')
	f.write('var names = [];\n')
	for file in os.listdir(cwd):
		print(os.path.basename(file))
		f.write('names.push(\'')
		f.write(os.path.basename(file))
		f.write('\');\n')
	f.write('return names;\n')
	f.write('}')