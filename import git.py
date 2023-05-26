from scrape_linkedin import ProfileScraper

#with ProfileScraper(cookie='AQEDARg1ubcE7EGFAAABh08cH-IAAAGH2gaMdk0AbJ4Wx1zplKtDWsrH0hX55sdD4E5bFZU3mMYJmi4xc2mUUbZCimRMUk9RZza2w-qWmlqhPdBqpe9OTc2Q7ClxhD31rTDKq5XWBI-_qzO-Rw6RFLY9') as scraper:

with ProfileScraper() as scraper:
    profile = scraper.scrape(user='lucas-casagrande')

print(profile.to_dict())
