import os
import csv
from collections import Counter
from math import ceil

#                       Here be dragons.

txt_file = "C:\\Users\\Usuario\\Desktop\\sextotf8.csv"

def quitarPrimeraLinea(txt_file):
    # Step 1: Remove the first line and save the changes
    with open(txt_file, 'r',encoding='utf-16') as file:
        lines = file.readlines()

    # Write back all lines except the first
    with open(txt_file, 'w', encoding='utf-16') as file:
        file.writelines(lines[1:])
    print("Se quito la primera linea!")

def formatoConComas(txt_file):
    with open(txt_file, 'r', encoding='utf-16') as file:
        content = file.read().replace('[', '').replace(']', ',')
    # Write the final modified content back to the file
    with open(txt_file, 'w', encoding='utf-16') as file:
        file.write(content)

def dobleComasNo(txt_file):
    with open(txt_file, 'r', encoding='utf-8') as file:
        content = file.read().replace(',,', ',')
    # Write the final modified content back to the file
    with open(txt_file, 'w', encoding='utf-8') as file:
        file.write(content)

def wtf(txt_file):
    with open(txt_file, 'r', encoding='utf-8') as file:
        content = file.read().replace('"""', '')
    # Write the final modified content back to the file
    with open(txt_file, 'w', encoding='utf-8') as file:
        file.write(content)

def quitarLineasVacias(txt_file):
    with open(txt_file, 'r', encoding='utf-16') as file:
        lines = file.readlines()
    filtered_lines = [line for i, line in enumerate(lines) if i % 2 == 1]
    with open(txt_file, 'w', encoding='utf-16') as file:
        file.writelines(filtered_lines)

def quitarEspacios(txt_file):
    with open(txt_file, 'r', encoding='utf-16') as file:
        lines = file.readlines()

    # Remove extra spaces and write the cleaned data to a new file
    with open(txt_file, 'w', encoding='utf-16') as file:
        for line in lines:
            # Split by comma, strip spaces from each part, and join back with a single space after comma
            cleaned_line = ','.join(part.strip() for part in line.split(','))
            file.write(cleaned_line + '\n')

def swap_middle_elements(line):
    parts = line.strip().split(',')
    # Swap second and third elements
    parts[1], parts[2] = parts[2], parts[1]
    return ','.join(parts)

def swap_penultimos(line):
    parts = line.strip().split(',')
    # Swap third and fourth elements
    parts[2], parts[3] = parts[3], parts[2]
    return ','.join(parts)


def formato2(txt_file):
    # Open the input file and read all lines
    with open(txt_file, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    with open(txt_file, 'w', encoding='utf-8') as file:
        for line in lines:
            swapped_line = swap_middle_elements(line)
            file.write(swapped_line + '\n')

def formatoParaSexto(txt_file):
    # Open the input file and read all lines
    with open(txt_file, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    with open(txt_file, 'w', encoding='utf-8') as file:
        for line in lines:
            swapped_line = swap_penultimos(line)
            file.write(swapped_line + '\n')

def print10First(txt_file):
    with open(txt_file, 'r', encoding='utf-8') as file:
        first_five_lines = [next(file).strip() for _ in range(10)]
    for line in first_five_lines:
            print(line)

def is_latin1(text):
    # Check if all characters in the text are within the Latin-1 (ISO 8859-1) range (U+0000 to U+00FF)
    return all(ord(char) <= 0xFF for char in text)

def is_latin1(text):
    # Check if all characters in the text are within the Latin-1 (ISO 8859-1) range (U+0000 to U+00FF)
    return all(ord(char) <= 0xFF for char in text)

def filter_text(input_file):
    temp_file = input_file + '.tmp'  # Temporary file to store filtered lines

    with open(input_file, 'r', encoding='utf-16') as infile, \
         open(temp_file, 'w', encoding='utf-16') as outfile:
        
        for line in infile:
            # Write line to temp file only if all characters are within the Latin-1 range
            if is_latin1(line):
                outfile.write(line)

    # Replace the original file with the temporary file
    os.replace(temp_file, input_file)

def convert_utf16_to_utf8(input_file):
    temp_file = input_file + '.tmp'  # Temporary file to store converted content

    # Open the UTF-16 file for reading and temporary UTF-8 file for writing
    with open(input_file, 'r', encoding='utf-16') as infile, \
         open(temp_file, 'w', encoding='utf-8') as outfile:
        for line in infile:
            outfile.write(line)
    os.replace(temp_file, input_file)

def txt_to_csv(txt_file, output):
    with open(txt_file, 'r', encoding='utf-8') as in_file:
        stripped = (line.strip() for line in in_file)
        lines = (line.split(",") for line in stripped if line)
        with open(output, 'w', encoding='utf-8') as out_file:
            writer = csv.writer(out_file)
            writer.writerow(('page', 'word1', 'word2', 'tag', 'amount'))
            writer.writerows(lines)

def txt_to_csv5(txt_file, output):
    with open(txt_file, 'r', encoding='utf-8') as in_file:
        stripped = (line.strip() for line in in_file)
        lines = (line.split(",") for line in stripped if line)
        with open(output, 'w', encoding='utf-8') as out_file:
            writer = csv.writer(out_file)
            writer.writerow(('page', 'word', 'tag', 'amount'))
            writer.writerows(lines)

def change_csv_separator(input_file, output_file, old_separator=',', new_separator=';'):
    # Read the original CSV file with the old separator and write to a new one with the new separator
    with open(input_file, 'r', encoding='utf-8') as infile, \
         open(output_file, 'w', encoding='utf-8', newline='') as outfile:
        
        reader = csv.reader(infile, delimiter=old_separator)
        writer = csv.writer(outfile, delimiter=new_separator)
        
        for row in reader:
            writer.writerow(row)


def change_csv_separator(input_file, old_separator=',', new_separator=';'):
    temp_file = input_file + '.tmp'  # Temporary file to store the modified content

    # Read the original CSV file and write to a temporary file with the new separator
    with open(input_file, 'r', encoding='utf-8') as infile, \
         open(temp_file, 'w', encoding='utf-8', newline='') as outfile:
        
        reader = csv.reader(infile, delimiter=old_separator)
        writer = csv.writer(outfile, delimiter=new_separator)
        
        for row in reader:
            writer.writerow(row)

    # Replace the original file with the temporary file
    os.replace(temp_file, input_file)

def print_first_10_lines(csv_file):
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.reader(file)
        
        # Loop through the first 10 lines and print each row
        for i, row in enumerate(reader):
            if i >= 258:
                break
            print(row)

def keep_every_second_line(file_path):
    temp_file = file_path + '.tmp'  # Temporary file to store the modified content
    
    # Open the original file for reading and the temporary file for writing
    with open(file_path, 'r', encoding='utf-8') as infile, \
         open(temp_file, 'w', encoding='utf-8') as outfile:
        
        # Enumerate lines and write only every second line to the temp file
        for index, line in enumerate(infile):
            if index % 2 == 0:  # Keep every second line (1, 3, 5, etc.)
                outfile.write(line)

    # Replace the original file with the temporary file
    os.replace(temp_file, file_path)

def add_line_numbers(file_path):
    temp_file = file_path + '.tmp'  # Temporary file to store modified content
    
    # Open the original file for reading and the temporary file for writing
    with open(file_path, 'r', encoding='utf-8') as infile, \
         open(temp_file, 'w', encoding='utf-8') as outfile:
        
        # Enumerate lines and write each line with a line number prefix
        for line_number, line in enumerate(infile, start=1):
            outfile.write(f"{line_number}\\{line}")

    # Replace the original file with the temporary file
    os.replace(temp_file, file_path)


def remove_rows_with_incorrect_columns(input_file, delimiter='\\', max_field_size=131072):
    temp_file = input_file + '.tmp'

    with open(input_file, 'r', encoding='utf-8') as infile, \
         open(temp_file, 'w', encoding='utf-8', newline='') as outfile:
        
        # Initialize CSV reader and writer
        writer = csv.writer(outfile, delimiter=delimiter)

        # Read the first line to get the header and expected column count
        first_line = infile.readline().strip()
        header = first_line.split(delimiter)
        expected_columns = len(header)
        writer.writerow(header)

        # Process each remaining line in the file
        for line in infile:
            if len(line) <= max_field_size:  # Check if line size is within limit
                row = line.strip().split(delimiter)  # Split manually by the delimiter
                if len(row) == expected_columns:  # Check column count
                    writer.writerow(row)

    # Replace the original file with the filtered temporary file
    os.replace(temp_file, input_file)

def remove_rows_with_incorrect_columns(input_file, delimiter='\\'):
    temp_file = input_file + '.tmp'

    with open(input_file, 'r', encoding='utf-8') as infile, \
         open(temp_file, 'w', encoding='utf-8') as outfile:
        
        # Read the header to determine the expected number of columns
        header = infile.readline().strip()
        expected_columns = len(header.split(delimiter))

        # Write the header to the temporary file
        outfile.write(header + '\n')

        # Process each line
        for line in infile:
            # Strip any leading/trailing whitespace and split by delimiter
            row = line.strip().split(delimiter)
            
            # Check if the row has the correct number of columns
            if len(row) == expected_columns:
                outfile.write(line)

    # Replace the original file with the filtered temporary file
    os.replace(temp_file, input_file)

def split_txt_file_into_slices(input_file, output_dir, n_slices):
    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Read the entire file into memory
    with open(input_file, 'r', encoding='utf-8') as infile:
        lines = infile.readlines()

    # Assume the first line is the header
    header = lines[0]
    data = lines[1:]

    # Calculate the number of rows per slice
    rows_per_slice = ceil(len(data) / n_slices)

    # Split data into slices and write each to a new file
    for i in range(n_slices):
        start_idx = i * rows_per_slice
        end_idx = start_idx + rows_per_slice
        slice_data = data[start_idx:end_idx]

        # Skip empty slices
        if not slice_data:
            break

        # Create the output file path
        output_file = os.path.join(output_dir, f'slice_{i+1}.csv')

        # Write the header and slice data to the new file
        with open(output_file, 'w', encoding='utf-8') as outfile:
            outfile.write(header)  # Write the header once
            outfile.writelines(slice_data)  # Write the corresponding slice of data

def extract_column(input_file, output_file, column_index, delimiter=','):
    with open(input_file, 'r', encoding='utf-8') as infile, \
         open(output_file, 'w', encoding='utf-8', newline='') as outfile:
        
        reader = csv.reader(infile, delimiter=delimiter)
        writer = csv.writer(outfile, delimiter=delimiter)

        # Iterate through rows and write only the specified column to the new file
        for row in reader:
            if row:  # Ensure the row is not empty
                writer.writerow([row[column_index]])


def filter_csv_by_second_element(data_file, filter_file, output_file):
    """
    Filters rows from `data_file` where the second element matches any value in `filter_file`.

    Parameters:
    - data_file: Path to the input CSV file with multiple columns.
    - filter_file: Path to the single-column CSV file for filtering.
    - output_file: Path to save the filtered output.
    """
    # Read the filter values from the single-column CSV file
    with open(filter_file, 'r') as f_file:
        filter_values = {row[0] for row in csv.reader(f_file, delimiter='\\')}
    
    # Open the input CSV and output the filtered lines
    with open(data_file, 'r') as d_file, open(output_file, 'w', newline='') as o_file:
        reader = csv.reader(d_file, delimiter='\\')
        writer = csv.writer(o_file, delimiter='\\')
        
        for row in reader:
            if row[1] in filter_values:  # Check if the second element exists in filter_values
                writer.writerow(row)

"""
print("Step 1 done, hope to God this works...")
formatoConComas(txt_file)
print("Step 2 done")
quitarEspacios(txt_file)
print("Step 3 done")
formato2(txt_file)
remove_non_unique_second_column("output2.csv")
print_first_10_lines("output2.csv")
print("done!")
print10First(txt_file)
dobleComasNo(txt_file)
formatoParaSexto(txt_file)
print10First(txt_file)
print("Yay?")
txt_to_csv5(txt_file, "C:\\Users\\Usuario\\Desktop\\quinto.csv")
"""
print("Ay vamos pues")
# change_csv_separator(txt_file, old_separator=',', new_separator='\\')
#print10First(txt_file)
#wtf(txt_file)
#print("here comes the result:")
#keep_every_second_line(txt_file)
#print10First(txt_file)
#add_line_numbers(txt_file)
#print_first_10_lines(txt_file)
#split_txt_file_into_slices(txt_file, "C:\\Users\\Usuario\\Desktop\\quinto", 6)
#extract_column("output2.csv", "titles.csv", 1, '\\')
#filter_csv_by_second_element(txt_file, "titles.csv", "C:\\Users\\Usuario\\Desktop\\quintotf8FK.csv")
#split_txt_file_into_slices(txt_file,"C:\\Users\\Usuario\\Desktop\\quinto", 6)
#print10First(txt_file)
#remove_rows_with_incorrect_columns(txt_file, delimiter='\\')
#filter_csv_by_second_element(txt_file, "titles.csv", "C:\\Users\\Usuario\\Desktop\\sextotf8FK.csv")
#split_txt_file_into_slices("C:\\Users\\Usuario\\Desktop\\sextotf8FK.csv","C:\\Users\\Usuario\\Desktop\\sexto", 14)
#print10First(txt_file)
print("Yay?")