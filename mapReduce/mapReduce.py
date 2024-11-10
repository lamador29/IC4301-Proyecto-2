from mrjob.job import MRJob
import csv
import json

#Para cada palabra distinta, ¿Cuáles páginas de Wikipedia la contienen?
class primero(MRJob):
    def mapper(self, _, line):
        reader = csv.reader([line])
        try:
            link, title, num_words, text = next(reader)
        except ValueError:
            return
        
        for word in text.split():
            yield word.lower(), link

    def reducer(self, word, links):
        yield word, list(set(links))

#Para cada par de palabras distintas contiguas ¿Cuáles páginas de Wikipedia la contienen?
class segundo(MRJob):
    def mapper(self, _, line):
        reader = csv.reader([line])
        try:
            link, title, num_words, text = next(reader)
        except ValueError:
            return
        
        words = text.split()
        for i in range(len(words) - 1):
            pair = (words[i].lower(), words[i + 1].lower())
            yield pair, link

    def reducer(self, pair, links):
        yield pair, list(set(links))

#Para cada palabra distinta por página, ¿Cuántas veces aparece la palabra en la página?
class tercero(MRJob):
    def mapper(self, _, line):
        reader = csv.reader([line])
        try:
            link, title, num_words, text = next(reader)
        except ValueError:
            return
        
        word_counts = {}
        for word in text.split():
            word = word.lower()
            word_counts[word] = word_counts.get(word, 0) + 1
        
        for word, count in word_counts.items():
            yield (link, word), count

    def reducer(self, link_word, counts):
        yield link_word, sum(counts)

#Para cada palabra distinta, ¿Cuál es el conteo total de la palabra en todas la páginas?
class cuarto(MRJob):
    def mapper(self, _, line):
        reader = csv.reader([line])
        try:
            link, title, num_words, text = next(reader)
        except ValueError:
            return
        
        for word in text.split():
            yield word.lower(), 1

    def reducer(self, word, counts):
        yield word, sum(counts)

#Para cada palabra y Tag que lo contiene, ¿Cuántas veces aparece la palabra por página?
class quinto(MRJob):
    def mapper(self, _, line):
        try:
            # Convertimos la línea de bytes a cadena de texto
            line = line.decode('utf-8') if isinstance(line, bytes) else line
            data = json.loads(line)  
            
            for page, tags in data.items():
                for tag, text in tags.items():
                    word_counts = {}
                    for word in text.split():
                        word = word.lower()
                        word_counts[word] = word_counts.get(word, 0) + 1
                    for word, count in word_counts.items():
                        yield (page, tag, word), count
        except json.JSONDecodeError:
            print("Error: Línea no pudo ser decodificada como JSON")
            return

    def reducer(self, page_tag_word, counts):
        yield page_tag_word, sum(counts)


#Para par de palabras contiguas y Tag que lo contiene, ¿Cuántas veces aparecen en la página?
class sexto(MRJob):
    def mapper(self, _, line):
        try:
            data = json.loads(line)
            for page, tags in data.items():
                for tag, text in tags.items():
                    words = text.split()
                    for i in range(len(words) - 1):
                        pair = (words[i].lower(), words[i + 1].lower())
                        yield (page, tag, pair), 1
        except ValueError:
            return

    def reducer(self, page_tag_pair, counts):
        yield page_tag_pair, sum(counts)

#¿Cuál es el porcentaje que una palabra aparece en una página? (Cantidad de veces la palabra aparece entre el total de palabras)
class septimo(MRJob):
    def mapper(self, _, line):
        reader = csv.reader([line])
        try:
            link, title, num_words, text = next(reader)
            num_words = int(num_words)  

            word_counts = {}
            for word in text.split():
                word = word.lower()
                word_counts[word] = word_counts.get(word, 0) + 1

            for word, count in word_counts.items():
                percentage = (count / num_words) * 100
                yield (link, word), percentage

        except ValueError:
            return

    def reducer(self, link_word, percentages):
        percentages = list(percentages) 
        yield link_word, sum(percentages) / len(percentages) if percentages else 0

#Para cada página ¿Cuáles TAGs contienen más palabras distintas? (Top 10)

#Para cada página ¿Cúales TAGs tiene más texto en general? (Top 10)

if __name__ == '__main__':
    #primero.run()
    #segundo.run()
    #tercero.run()
    #cuarto.run()
    #quinto.run()
    #sexto.run()
    septimo.run()