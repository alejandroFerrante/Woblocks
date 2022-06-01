import os
cwd = os.getcwd()+'/icons/representations'

with open('representations.js', 'w') as f:
	print('\nREPRESENTATIONS:')
	f.write('function getRepresentationNames(){')
	f.write('\n')
	f.write('var names = [];\n')
	for file in os.listdir(cwd):
		print(os.path.basename(file))
		f.write('names.push(\'')
		f.write(os.path.basename(file))
		f.write('\');\n')
	f.write('return names;\n')
	f.write('}\n\n')

	print('\nDEFAULT IMAGES:')
	f.write('function getDefaultImages(){')
	f.write('\n')
	f.write('var result = [];\n')

	cwd = os.getcwd()+'/imgs'
	for file in os.listdir(cwd):
		print(os.path.basename(file))
		f.write('result.push(\'')
		f.write(os.path.basename(file))
		f.write('\');\n')

	f.write('return result;\n')
	f.write('}\n')