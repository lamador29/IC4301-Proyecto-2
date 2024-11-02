# Links

- El archivo contiene 4 variables al inicio, 
	- uRL: desde donde se desea iniciar la búsqueda, 
	- depth: indica la profundidad de la recursión 
	- csv y Json: le indican al programa donde colocar sus resultados bajo ambos formatos. 
- Es muy poco aconsejable usar ninguna profundidad mayor a 2 debido al estrés que genera en recursos computacionales. Esta hecho para ser ejecutado en segundo plano. 
- Se estima que depth 5 deberia de descargar a almenos la mitad de la base de datos de wikipedia, dependiendo de donde se comienza.

  

## Descripcion del funcionamiento:

- El script va recogiendo de manera recursiva todas las referencias en un articulo de wikipedia hacia otros articulos de wikipedia, los cuales tendrán más referencias que pueden usarse para seguir con el ciclo, esto se repite segun la profundidad que se desea.

- Despues de este proceso recursivo, el script pasa a descargar y procesar los datos de manera concurrente con todos los procesadores en el dispositivo que lo ejecuta, esto (y tambien los ciclos de recoger enlaces) se logra mediante la libreria de Joblib y su apartado de multiprocesamiento. Se descarga aproximadamente a un ritmo de 23 mil por hora, p

- Eventualmente cuando los datos son procesados, se escriben tanto en formato CSV como un JSON.


#### Creado por: Wesley Esquivel Mena, Tecnologico de Costa Rica