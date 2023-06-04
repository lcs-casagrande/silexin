from bs4 import BeautifulSoup
from time import sleep
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options


options = Options()
options.add_argument('window-size=800,800')
#options.add_argument('--headless')

navegador = webdriver.Chrome(options=options)
navegador.get('https://www.linkedin.com/')

email = navegador.find_element(By.ID,'session_key')
email.send_keys('5511974645103')
senha = navegador.find_element(By.ID,'session_password')
senha.send_keys('****')
senha.submit()

navegador.get('https://www.linkedin.com/in/milena-pessoni-8388a21a4/')
#sleep(3)

site = BeautifulSoup(navegador.page_source, 'html.parser')

nome_comp = site.find('h1', attrs={'class': 'text-heading-xlarge inline t-24 v-align-middle break-words'}).text.strip()
local = site.find('span', attrs={'class': 'text-body-small inline t-black--light break-words'}).text.strip()
sobre = site.find('div', attrs={'class': 'display-flex full-width'}).text.strip()
pacote = site.find('div', attrs={'class': 'display-flex flex-row justify-space-between'})
duracoes = site.findAll('span', attrs={'class': 't-14 t-normal t-black--light'})
empresas = site.findAll('h4', attrs={'class': 'profile-section-card__subtitle'})
titulos = site.findAll('h2', attrs={'class': 'pvs-header__title text-heading-large'})
descricoes = site.find('div', attrs={'class': 'show-more-less-text'})
experiencias = site.findAll('li', attrs={'class': 'artdeco-list__item pvs-list__item--line-separated pvs-list__item--one-column'})
if experiencias == "none":
    experiencias = []
print(f'Nome: {nome_comp}')
print(f'descricoes:  ')
print(f'Local: {local}')
print(f'Sobre: {sobre} ')
#print(f'pacote: {experiencias}')

for empresa in empresas:
    print(f'Empresas {empresa.text.strip()}')

#for descricao in descricoes:
 #   print(f'Descrições {descricao.text.strip()}')

for duracao in duracoes:
    print(f'Duração {duracao.text.strip()}')


for titulo in titulos:
    print(f'Titulo {titulo.text.strip()}')

