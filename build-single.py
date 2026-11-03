from pathlib import Path
import base64,re
p=Path('dist');html=(p/'index.html').read_text();css=(p/'style.css').read_text()
for font in p.glob('font-*.ttf'):css=css.replace(font.name,'data:font/ttf;base64,'+base64.b64encode(font.read_bytes()).decode())
js=(p/'app.js').read_text().replace("'./three.module.js'","'data:text/javascript;base64,"+base64.b64encode((p/'three.module.js').read_bytes()).decode()+"'")
js=js.replace('assets/eniac.jpeg','data:image/jpeg;base64,'+base64.b64encode((p/'assets/eniac.jpeg').read_bytes()).decode())
js=js.replace('assets/hamilton.jpeg','data:image/jpeg;base64,'+base64.b64encode((p/'assets/hamilton.jpeg').read_bytes()).decode())
html=html.replace('<link rel="stylesheet" href="style.css">','<style>'+css+'</style>').replace('<script type="module" src="app.js"></script>','<script type="module">'+js+'</script>')
html=re.sub(r'<a href="presentation.html".*?</a>','',html)
(p/'presentation.html').write_text(html)
