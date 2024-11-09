from mrjob.job import MRJob
import csv
# pip install mrjob

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

if __name__ == '__main__':
    primero.run()
