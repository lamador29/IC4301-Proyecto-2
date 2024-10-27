import os
import requests
from bs4 import BeautifulSoup
import re
import csv
import json

# Filtros para los tags
exclude_list = ["contents", "see also", "notes", "references", "further reading", "external links", "citations", "websites", "directories", "sources"]

#Para obtener todos los enlaces dentro de un articulo de wikipedia
def get_links(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        wiki_links = []
        for p_tag in soup.find_all('p'):
            links = [a.get('href') for a in p_tag.find_all('a', href=True) if a.get('href').startswith('/wiki/')]
            wiki_links.extend(links)
        return wiki_links
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the page: {e}")
        return None

#Tomar el titulo de la pagina wikipedia
def get_title(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        title_tag = soup.find('span', class_='mw-page-title-main')
        title = title_tag.text if title_tag else "Title not found"
        
        return title.lower()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the page: {e}")
        return None

#Los subtitulos (tags)
def get_subtitles(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
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
def get_paragraph_text(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        paragraphs = [p.text.strip() for p in soup.find_all('p')]
        
        return paragraphs
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the page: {e}")
        return None

#Limpiar el texto
def clean_text(text):
    """Cleans the text by removing punctuation, making it lowercase, and preserving spaces between words."""
    spaced_text = re.sub(r'[^a-zA-Z0-9]', ' ', text)
    cleaned_text = re.sub(r'\s+', ' ', spaced_text).lower().strip()
    return cleaned_text

#Obtener los tags con su texto
def get_paragraphs_by_subtitle(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
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
    all_articles = {}
    #If it doesn't exist yet:
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            all_articles = json.load(f)        
    all_articles[article_title] = data
    #Otherwise:
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(all_articles, f, ensure_ascii=False, indent=4)



#Proceso recursivo para encontrar links
def fillLinks(Linklist, url):
    url = 'https://wikipedia.org' + url
    Linklist = get_links(url)
    newList = [url]
    for link in Linklist:
        link = 'https://wikipedia.org' + link
        #print(link + " \n")
        newList.append(link)
    return newList

def web_crawling(Linklist, limit):
    if(limit == 0):#base case to avoid uberRecursion
        print("Recursion is stopped!")
        return Linklist
    
    print("getting links...")
    counter = 1
    size = len(Linklist)
    Newlist = Linklist
    for url in Linklist:
        try: #Si el articulo 2000 falla por alguna razon super equisde, solo siga con el resto
             #No me hagas tener que repetirlo todo, que sino entonces termino hasta el 2026 :(
            sublist = get_links('https://wikipedia.org' + url)
            if(len(sublist) > 1):
                Newlist = Newlist + sublist
            print(counter, " out of ", size)
            counter += 1
        except Exception:
            continue
    Newlist = list(set(Newlist)) #Remove repeats
    print("Found a total of: ", len(Newlist))
    print("Going into the next level! \n")
    limit -= 1
    return  web_crawling(Newlist, limit)


LinkList = ['/wiki/Cheese']
csv_file = 'wikipedia.csv'
# LinkList = fillLinks(LinkList)
#total = len(LinkList)
print(len(LinkList))
LinkList = web_crawling(LinkList, 3)
total = len(LinkList)
print("There's a total of", total)

#Esta cosa pide a gritos ser paralelizada... !!!
counter = 0
with open(csv_file, mode='w', newline='') as file:
    fieldNames = ["link", "title", "subtitles", "text"] 
    writer = csv.DictWriter(file, fieldnames=fieldNames)
    writer.writeheader()
    for url in LinkList:
        try:
            paragraphs = get_paragraph_text(url)
            # Join all paragraphs into a single string
            joined_paragraphs = " ".join(paragraphs)
            cleaned_text = clean_text(joined_paragraphs)
            subtitles = get_subtitles(url)
            title = get_title(url)
            writer.writerow({"link": url, "title": title, "subtitles": subtitles.lower(), "text": cleaned_text})
            paragraphs_by_subtitle = get_paragraphs_by_subtitle(url)
            save_to_json(paragraphs_by_subtitle, title)
            print(counter, " out of ",total)
            counter +=1
        except Exception:
            continue

print(f"Data written to {csv_file}")

