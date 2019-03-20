# Geoquizz_app
Application mobile autour de l'API REST de l'atelier.  

## Installation
Dans un premier temps, placez vous à la racine du projet et executez la commande :  
```
npm install
```

Branchez alors vôtre telephone et assurez vous que le debugage USB est activé.  

Par la suite il faut build l'application avec la commande suivante :  
* Pour Android : ```tns build android --bundle```
* Pour IOS : ```tns build ios --bundle```

Enfin, lancez la commande :  
* Pour Android : ```tns run android --bundle```
* Pour IOS : ```tns run ios --bundle```

## Changement de l'URL de l'API

L'URL de l'API est definie par une constante dans le fichier "App.vue", c'est une propiétée dans data ```url``` de la vue (Ligne 41)
Exemple d'URL :
-"http://xxxxxx.ngrok.io/" si le container est lancé via Ngrok.io


## Tester l'application
Pour pouvoir tester l'application, un compte utilisateur est fourni avec les credentials suivantes :
* Login : toto
* Password : password