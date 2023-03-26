from bs4 import BeautifulSoup
from time import sleep
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import pandas as pd

dcabecalho = []
d2titulo1 = []
dtitulo1 = []
dtitulo2 = []
dtitulo3 = []

options = Options()
options.add_argument('window-size=800,800')
#options.add_argument('--headless')

navegador = webdriver.Chrome(options=options)
navegador.get('https://www.linkedin.com/')

email = navegador.find_element(By.ID,'session_key')
email.send_keys('5511974645103')
senha = navegador.find_element(By.ID,'session_password')
senha.send_keys('balotelli9')
senha.submit()

navegador.get('https://www.linkedin.com/in/ohana-norberto/')
#sleep(3)

site = BeautifulSoup(navegador.page_source, 'html.parser')

titulos = site.findAll('li', attrs={'class': 'artdeco-list__item pvs-list__item--line-separated pvs-list__item--one-column'})
print()

print('Titulo')


cabecas = site.findAll('div', attrs={'class': 'pvs-header__container'})

for cabeca in cabecas:
    #print('Cabeçalhos')
    cab_t = cabeca.find('span', attrs={'class': 'visually-hidden'}).text
    #print(cab_t)
    dcabecalho.append(cab_t)
    for titulo in titulos:
        tit1s = titulo.findAll('span', attrs={'class': 'mr1 t-bold'})

        tit21s = titulo.findAll('span', attrs={'class': 'mr1 hoverable-link-text t-bold'})
        for tit21 in tit21s:
            #print('2º titulo 1')
            tit21_text = tit21.find('span', attrs={'class': 'visually-hidden'}).text
            #print(tit21_text)
            d2titulo1.append(tit21_text)
            for tit1 in tit1s:
                #print('Titulo 1')
                #print(tit1)
                tit1_text = tit1.find('span', attrs={'class': 'visually-hidden'}).text
                #print(tit1_text)
                print(tit1_text)
                dtitulo1.append(tit1_text)

                tit2s = titulo.findAll('span', attrs={'class': 't-14 t-normal'})
                for tit2 in tit2s:
                    #print('Titulo 2')
                    #print(tit2)
                    tit2_text = tit2.find('span', attrs={'class': 'visually-hidden'}).text
                    #print(tit2_text)
                    print(tit2_text)
                    dtitulo2.append(tit2_text)

                    tit3s = titulo.findAll('span', attrs={'class': 't-14 t-normal t-black--light'})
                    #print(titulo)
                    for tit3 in tit3s:
                        #print('Titulo 3')
                        #print(tit3)
                        tit3_text = tit3.find('span', attrs={'class': 'visually-hidden'}).text
                        print(tit3_text)
                        dtitulo3.append(tit3_text)


print(dcabecalho)
print(d2titulo1)
print(dtitulo1)
print(dtitulo2)
print(dtitulo3)

#candidatos ={'Cabeçalho':dcabecalho,'2º Titulo':d2titulo1,'Titulo 1':dtitulo1,'Titulo 2': dtitulo2,'Titulo 3':dtitulo3}
#candidato = pd.DataFrame(candidatos)
#candidato.to_csv('individual_csv')
#candidato = spark.read.csv('df_tabela1_csv', header = True, inferSchema=True)
#candidato.show()




    #print(site.prettify())

