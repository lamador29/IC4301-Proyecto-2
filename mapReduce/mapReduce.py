from mrjob.job import MRJob
import csv

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

if __name__ == '__main__':
    #primero.run()
    segundo.run()
    #tercero.run()
    #cuarto.run()

