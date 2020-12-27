Pour installer l'appweb : 
`npm install`.

Pour lancer l'appweb : 
`npm run serve`. Cette commande lance le serveur de dev avec le hot-reload. 

Pour build le projet et le minifier : 
`npm run build`, cette commande compile le projet dans le dossier `/dist`.
Pour lancer le projet, on utilise encore [pm2](https://pm2.keymetrics.io/) :
`pm2 start serve.sh`. Le fichier `serve.sh` lance la commande `serve --single --listen 3500 dist`. 
`serve` permet de servir un dossier donné en argument, ici `dist`, sur le port 3500.