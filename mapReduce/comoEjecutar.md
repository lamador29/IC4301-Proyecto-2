## mapReduce
Se usa la libreria de mrjob, se requieren las siguientes cosas para que todo funcione:

**Paso 1: tener una version de python anterior a 3.13**
- Si no tienes una version menor a esa, debes instalarla porque por alguna razon quitarion en la 3.13 algo que la libreria usa. Recuerda incluirle el instalador pip

**Paso 2: Hacer un alias para esa version de python**
- Esta parte es medio rara. Debes de encontrar la direccion del interprete de python, y ponerlo en este comando:
		
		New-Alias -name python -Value C:\resto\de\direccion\...


	Ejemplo:

			New-Alias -name python -Value C:\Users\Usuario\AppData\Local\Programs\Python\Python312\python.exeq

**Paso 3: instalarle  las librerias**
		
		python -m pip install mrjob
		python -m pip install setuptools

**Paso 4:** 
- Ahora con la terminal de vscode puedes ejecutar este codigo para verificar que va bien:
		
		python mapReduce\mapReduce.py webCrawling\lizano.csv