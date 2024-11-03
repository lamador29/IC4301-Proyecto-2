# Links py
Programa para realizar web scraping en Wikipedia con Python.
## Variables:
- El archivo contiene 4 variables al inicio las cuales se pueden modificar a como se desee, aquí se explica que son:

	 -  article: desde donde se desea iniciar la búsqueda, puede usarse cualquier pagina.

	- depth: indica la profundidad de la recursión del proceso

	- csv y Json: le indican al programa donde colocar sus resultados bajo ambos formatos, si se usa el nombre de un csv y json ya creados el programa dejara los resultados dentro del archivo sin problemas y asegurandose de no duplicar sus datos.

- Es muy poco aconsejable usar ninguna profundidad mayor a 2 debido a que el programa esta diseñado para cantidades medianas de datos. El programa esta hecho para ser ejecutado en segundo plano en cualquier laptop, si se desea mayor velocidad abajo se indica como lograrlo.

- Se estima que depth 5 deberia de descargar a almenos la mitad de la base de datos de wikipedia, dependiendo de donde se comienza, así que en verdad que solo deberia usarse depth 2 maximo con este programa sin modificarlo.

## Descripcion del funcionamiento:

- El script va recogiendo de manera recursiva todas las referencias en un articulo de wikipedia hacia otros articulos de wikipedia, los cuales tendrán más referencias que pueden usarse para seguir con el ciclo, esto se repite segun la profundidad que se desea. El programa en cada paso evita repetir articulos.

![Diagrama ilústrativo](https://i.imgur.com/YYbyfgK.png)

- Después de este proceso recursivo, el script pasa a descargar y procesar los datos de manera concurrente con todos los procesadores en el dispositivo que lo ejecuta, esto (y también los ciclos de recoger enlaces) se logra mediante la librería de Joblib y su apartado de multiprocesamiento. Se descarga aproximadamente a un ritmo de 23 mil por hora, esto se hace a propósito y no más rápido para que pueda fácilmente ser ejecutado en segundo plano.
- El mayor cuello de botella para el programa es hacerle peticiones a las muchas páginas de wikipedia que se ejecutan. Si se desea una mayor velocidad, se deberia de usar multithreading en lugar de multiprocesamiendo para que cada core se encargue de hacer 10 o más requests. El problema es que esta tarea es muy intensiva en recursos computacionales, por lo tanto, se optó por una opcion más tranquila con JobLib

## Resultados:
- Eventualmente, cuando los datos son procesados, se escriben tanto en formato CSV como un JSON. Ambos tienen propósitos distintos. El JSON contiene información sobre todos los tags que contiene el sitio, mientras que el CSV contiene todo lo demás.

- Se opta por esto para que sea más sencillo el procesamiento de los datos posterior al web scraping, para que queden en el formato más sencillo de analizar según la naturaleza de ambas cosas. 
## 
#### Creado específicamente por: Wesley Esquivel Mena, Estudiante de Tecnológico de Costa Rica
Nota: Si eres un estudiante ajeno a este proyecto y estás leyendo esto (por qué seguramente quedará público), te aconsejo que solo lo tomes como inspiración y que aprendas por tu cuenta los conceptos de web scraping.