import csv
import re

def is_latin1(text):
    # Check if all characters in the text are within the Latin-1 (ISO 8859-1) range (U+0000 to U+00FF)
    return all(ord(char) <= 0xFF for char in text)

def process_csv(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as infile, \
         open(output_file, 'w', encoding='utf-8', newline='') as outfile:
        
        reader = csv.reader(infile)
        writer = csv.writer(outfile)

        for row in reader:
            # Check if all cells in the row contain only Latin-1 compatible characters
            if all(is_latin1(cell) for cell in row):
                writer.writerow(row)

# Replace 'input.csv' and 'output.csv' with your actual file paths
process_csv("C:\\Users\\Usuario\\Desktop\\quinto.csv", "C:\\Users\\Usuario\\Desktop\\quintotf8.csv")