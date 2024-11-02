import os
import time
import requests
from bs4 import BeautifulSoup
import re
import csv
import json
from fake_useragent import UserAgent
from joblib import Parallel, delayed
from tqdm import tqdm

#Variables:
depth = 2
article = "https://en.wikipedia.org/wiki/Spain"
csv_file = 'wikipedia.csv'
json_file = 'wikipedia.json'

#------------------------------------------------------------------------------------------------
#                               Estimated data retrieval
#------------------------------------------------------------------------------------------------
# depth 0 = Single article
# depth 1 = All related articles
# depth 2 = Related articles about related articles, probably more than 20K
# depth 3 = Between 200K to 1 Million depending on how centric the article is
# depth 4 = Biggest increase, should fetch at least 50% of all data in wikipedia
# depth 5 = another increase, equivalent to depth 3
# depth 6 = small increase, equivalent to depth 2
# All further depths add negligible amounts of data.
#------------------------------------------------------------------------------------------------
# There's an estimated 6.8 million articles for english wikipedia, you will get only about 80% 
# MAX due to the amount of articles not referenced by anyone or that are too secluded from the rest.
#------------------------------------------------------------------------------------------------

# Filters for tags
exclude_list = ["contents", "see also", "notes", "references", "further reading", "external links", "citations", "websites", "directories", "sources"]


#------------------------------------------------------------------------------------------------
# Data proccesing | Methods here recieve a clean version of the article's HTML and process it
#------------------------------------------------------------------------------------------------
def get_links(url):
    """Para obtener todos los enlaces dentro de un articulo de wikipedia"""
    try:
        ua = UserAgent()
        randomguy = ua.random
        response = requests.get(url, headers = {'User-agent': randomguy})

        if response.status_code == 429:
            print("Wikipedia stopped you for procesing way too much")
            time.sleep(int(response.headers["Retry-After"]))
            print("Here we are again!")
            response = requests.get(url, headers = {'User-agent': randomguy})

        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        wiki_links = []
        for p_tag in soup.find_all('p'):
            links = [a.get('href') for a in p_tag.find_all('a', href=True) if a.get('href').startswith('/wiki/')]
            wiki_links.extend(links)
        wiki_links = list(set(wiki_links))
        return wiki_links
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the page: {e}")
        return None

def get_title(soup):
    """Tomar el titulo de la pagina wikipedia"""
    try:
        title_tag = soup.find('span', class_='mw-page-title-main')
        title = title_tag.text if title_tag else "Title not found"
        
        return title.lower()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the page: {e}")
        return None


def get_subtitles(soup):
    """Los subtitulos (tags)"""
    try:
        subtitles = []
        for tag in soup.find_all(['h2', 'h3', 'h4']):
            subtitle_text = tag.text.strip()
            if subtitle_text.lower() not in exclude_list:
                subtitles.append(subtitle_text)
        return " ".join(subtitles)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the page: {e}")
        return None

#Obtener todo el texto
def get_paragraph_text(soup):
    """#Obtener todo el texto"""
    try:
        paragraphs = [p.text.strip() for p in soup.find_all('p')]
        
        return paragraphs
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the page: {e}")
        return None


not_allowed_words = ["at", "the", "what", "with", "and", "was", "at", "its", "for", "from", "who", "than", "other", "such"
                     "citation", "needed", "where", "when", "while", "have", "are", "were", "had", "this", "like", "that",
                     "began", "make", "also", "about", "and"]

def filter_string(input_string):
    """Filtros para quitar palabrillas y numeros"""
    filtered_string = re.sub(r'\d+', '', input_string)
    words = filtered_string.split()
    filtered_words = [word for word in words if len(word) > 2 and word not in not_allowed_words]
    return ' '.join(filtered_words)

#Limpiar el texto
def clean_text(text):
    """Limpia un parrafo de texto conservando caracteres en español"""
    # Include a-z, A-Z, 0-9, and Spanish-specific characters like ñ, á, é, í, ó, ú, ü
    spaced_text = re.sub(r'[^a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ]', ' ', text)
    cleaned_text = re.sub(r'\s+', ' ', spaced_text).lower().strip()
    super_cleaned_text = filter_string(cleaned_text)
    return super_cleaned_text

#Obtener los tags con su texto
def get_paragraphs_by_subtitle(soup):
    """Metodo de webscraping para tomar datos para el JSON"""
    try:
        content = {}
        current_subtitle = None
        for tag in soup.find_all(['h1', 'h2', 'h3', 'h4', 'p']):
            if tag.name in ['h1', 'h2', 'h3', 'h4']:
                subtitle_text = tag.get_text(strip=True).lower()
                if subtitle_text not in exclude_list:
                    current_subtitle = subtitle_text
                    content[current_subtitle] = ""
                else:
                    current_subtitle = None  
            elif tag.name == 'p' and current_subtitle:
                paragraph_text = tag.get_text(" ", strip=True)
                cleaned_paragraph = clean_text(paragraph_text)
                content[current_subtitle] += " " + cleaned_paragraph
        content = {k: v.strip() for k, v in content.items()}
        return content
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the page: {e}")
        return None

#Mandarlo a JSON
def save_to_json(data, article_title, filename='wikipedia.json'):
    """Metodo (Actualmente sin uso) para guardar un Json"""
    all_articles = {}
    #If it doesn't exist yet:
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            all_articles = json.load(f)        
    all_articles[article_title] = data
    #Otherwise:
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(all_articles, f, ensure_ascii=False, indent=4)


#------------------------------------------------------------------------------------------------
# Methods for web scraping links and data |  Manage to request and navigate through Wikipedia
#------------------------------------------------------------------------------------------------
def fillLinks(Linklist, url):
    """Metodo lineal para tomar enlaces de un archivo"""
    Linklist = get_links(url)
    newList = [url]
    for link in Linklist:
        link = 'https://wikipedia.org' + link
        #print(link + " \n")
        newList.append(link)
    return newList

def parallel_links(url):
    """Metodo todo chiquito usado por joblib"""
    sublist = fillLinks([], url)
    return sublist

def web_crawling(Linklist, limit):
    """Proceso para tomar todos los enlaces de manera recursiva"""
    if limit == 0:  # Caso base
        return Linklist
    print("Getting links...")
    if(len(Linklist)==1):
        results = Parallel(n_jobs=-1)(delayed(parallel_links)(url) for url in Linklist)
    else:
        results = Parallel(n_jobs=-1)(delayed(parallel_links)(url) for url in tqdm(Linklist))
    results = sum(results, [])
    NewList = Linklist + results
    NewList = list(set(NewList))
    limit -= 1
    if(limit > 0):
        print("Done! There are now", len(NewList),"elements and ", limit,"layers to go.")
    return web_crawling(NewList, limit)

def process_url(url):
    """Proceso para tomar todos los datos relevantes de un url de wikipedia"""
    try:
        ua = UserAgent()
        randomguy = ua.random
        response = requests.get(url, headers = {'User-agent': randomguy})
        if response.status_code == 429:
            #print("Wikipedia stopped you for procesing way too much") Multiprocesing can make it anoying...
            time.sleep(60)
            #print("Here we are again!")
            response = requests.get(url, headers = {'User-agent': randomguy})

        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        #Recoleccion de datos: 
        paragraphs = get_paragraph_text(soup)
        joined_paragraphs = " ".join(paragraphs)
        cleaned_text = clean_text(joined_paragraphs)
        subtitles = get_subtitles(soup)
        title = get_title(soup)
        paragraphs_by_subtitle = get_paragraphs_by_subtitle(soup)
        
        #Returns feos
        return {
            "csv": {"link": url, "title": title, "subtitles": subtitles.lower(), "text": cleaned_text},
            "json": {title: paragraphs_by_subtitle}
        }
    except Exception as e:
        #print(f"Error processing {url}: {e}")
        return None
#------------------------------------------------------------------------------------------------
# Retrieving the data for the links | You can see the steps the program takes here.
#------------------------------------------------------------------------------------------------
LinkList = [article]
print("The program is choosing to embark with a dept of ", depth)
LinkList = web_crawling(LinkList, depth)

total = len(LinkList)
print("There's a total of ", total, " articles found")
print("Now, it's time for fetching and processing the data from wikipedia")
print("Here we go!...")

data_results = Parallel(n_jobs=-1)(delayed(process_url)(url) for url in tqdm(LinkList))
"""Esto se va distribuyendo todos los urls encontrados entre tus procesadores"""

print("It is done! Now it's time for writing the results")
with open(csv_file, mode='w', newline='') as file:
    fieldnames = ["link", "title", "subtitles", "text"]
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.writeheader()
    
    for result in tqdm(data_results):
        try:
            if result and "csv" in result:
                writer.writerow(result["csv"])
        except Exception as e:
            continue

all_articles = {}
if os.path.exists(json_file):
    with open(json_file, 'r', encoding='utf-8') as f:
        try:
            all_articles = json.load(f)
        except json.JSONDecodeError:
            print("Error loading JSON: The file may be corrupted.")
            all_articles = {}

for result in data_results:
    if result and "json" in result:
        all_articles.update(result["json"])

with open(json_file, 'w', encoding='utf-8') as f:
    json.dump(all_articles, f, ensure_ascii=False, indent=4)

print(f"Done! The data was written into {csv_file} and {json_file}")