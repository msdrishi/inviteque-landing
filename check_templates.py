import glob

files = glob.glob('src/pages/Template*.jsx')
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        print(f"{file}: showWelcome={content.find('showWelcome') != -1}, showGallery={content.find('showGallery') != -1}, welcomeMessage={content.find('welcomeMessage') != -1}")
