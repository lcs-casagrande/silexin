import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from time import sleep

options = Options()
options.add_argument('window-size=400,800')
#options.add_argument('--headless')

navegador = webdriver.Chrome(options=options)

navegador.get('https://www.linkedin.com/')

email = navegador.find_element(By.ID,'session_key')
email.send_keys('5511974645103')
senha = navegador.find_element(By.ID,'session_password')
senha.send_keys('balotelli9')
senha.submit()

navegador.get('https://www.linkedin.com/in/milena-pessoni-8388a21a4/')

site = BeautifulSoup(navegador.page_source, 'html.parser')

print(site.prettify())