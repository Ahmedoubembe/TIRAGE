# 🚀 INSTRUCTIONS DE DÉMARRAGE - APPLICATION TIRAGE

## 📋 Prérequis

- Node.js installé (version 16 ou supérieure)
- npm installé

## 🔧 Installation des dépendances

Si ce n'est pas déjà fait, installez les dépendances :

```bash
npm install
```

## ▶️ Démarrer l'application

Pour lancer l'application en mode développement :

```bash
ng serve
# OU
npm start
```

L'application sera accessible à l'adresse : **http://localhost:4200**

## 📁 Format des fichiers CSV attendus

L'application nécessite **DEUX fichiers CSV séparés** :

### 1. Fichier des catégories (`categories.csv`)

```csv
categorie,interval,nombre_gagnants,prix
S1,[3500 - 5000],2,10000 MRU
S2,[2500 - 3499],3,5000 MRU
S3,[1500 - 2499],5,2000 MRU
S4,[500 - 1499],10,1000 MRU
```

**Points importants :**
- Séparateur : **virgule** (,)
- Colonnes : `categorie,interval,nombre_gagnants,prix`
- `interval` peut être : `[3500 - 5000]`, `[2500 - 3499]`, etc.
- Les crochets sont automatiquement retirés lors du traitement

### 2. Fichier des clients (`clients.csv`)

```csv
tel;name;score
30770077;BASSIROU GOUMBALA;3975,19
46487629;Ahmed Adoud;3600,61
46480003;Mohamed Taya;3266,82
44038989;Sidi Mohamed Ebah;2770,38
22068350;Seniya El Atigh;2646,69
```

**Points importants :**
- Séparateur : **point-virgule** (;)
- Colonnes : `tel;name;score`
- Le **score** utilise la **virgule** comme séparateur décimal : `3975,19`
- Les clients sont automatiquement assignés à leur catégorie selon leur score

## 🎯 Étapes d'utilisation

### 1. Page d'accueil (Upload CSV)
- Vous verrez **deux zones de téléversement** :
  - **1. Fichier des catégories** : Sélectionnez votre fichier `categories.csv`
  - **2. Fichier des clients** : Sélectionnez votre fichier `clients.csv`
- Une fois les deux fichiers sélectionnés, cliquez sur le bouton **"Charger les données"**
- Les fichiers seront chargés automatiquement

### 2. Sélection de la catégorie
- Une liste des catégories apparaît
- Cliquez sur une catégorie pour la sélectionner
- Cliquez sur **"Lancer le tirage"**

### 3. Animation de tirage
- Les **scores** défilent à l'écran (ex: 3975.19, 3600.61)
- L'animation ralentit progressivement
- Un score est mis en évidence
- Le gagnant est révélé avec : **Téléphone + Score + Prix**

### 4. Affichage des gagnants
- Le panneau passe en **mode plein écran** dès le premier gagnant
- **Confettis** à chaque révélation
- La liste des gagnants s'affiche progressivement
- Bouton **"Gagnant suivant"** pour révéler le prochain gagnant

### 5. Fin du tirage
- Quand tous les gagnants sont révélés, le bouton devient **"Retour à la sélection"**
- Vous pouvez retourner choisir une autre catégorie

## 🐛 Dépannage

### Le bouton de téléversement n'apparaît pas

1. Vérifiez que le serveur de développement est lancé :
   ```bash
   ng serve
   ```

2. Ouvrez la console du navigateur (F12) et vérifiez s'il y a des erreurs

3. Effacez le cache du navigateur (Ctrl+Shift+R ou Cmd+Shift+R)

4. Vérifiez que l'URL est bien **http://localhost:4200**

### Erreur lors du chargement du CSV

1. Vérifiez le format des fichiers :
   - **Fichier catégories** : séparateur virgule (,)
   - **Fichier clients** : séparateur point-virgule (;)
   - Scores avec virgule décimale (3975,19)

2. Assurez-vous que les fichiers sont en **UTF-8** (pas UTF-8 avec BOM)

3. Vérifiez que vous avez sélectionné **les deux fichiers** avant de cliquer sur "Charger les données"

### L'application ne démarre pas

1. Installez les dépendances :
   ```bash
   npm install
   ```

2. Si l'erreur persiste, nettoyez et réinstallez :
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Vérifiez la version de Node.js :
   ```bash
   node --version
   # Doit être >= 16.x
   ```

## 📝 Exemples de fichiers CSV

Deux fichiers d'exemple sont fournis dans le projet :

### `exemple_categories.csv` :

```csv
categorie,interval,nombre_gagnants,prix
S1,[3500 - 5000],2,10000 MRU
S2,[2500 - 3499],3,5000 MRU
S3,[1500 - 2499],5,2000 MRU
S4,[500 - 1499],10,1000 MRU
```

### `exemple_clients.csv` :

```csv
tel;name;score
30770077;BASSIROU GOUMBALA;3975,19
46487629;Ahmed Adoud;3600,61
46480003;Mohamed Taya;3266,82
44038989;Sidi Mohamed Ebah;2770,38
22068350;Seniya El Atigh;2646,69
31234567;Fatou Ba;2580,45
32345678;Mamadou Diallo;2420,12
33456789;Aminata Sow;1850,67
34567890;Ousmane Kane;1720,34
35678901;Aissata Diop;1590,89
36789012;Ibrahima Fall;1450,23
37890123;Mariam Toure;1380,56
38901234;Abdoulaye Sy;1220,78
39012345;Khadija Ndiaye;1150,90
40123456;Moussa Cisse;980,45
41234567;Awa Sarr;890,23
42345678;Cheikh Diouf;750,67
43456789;Binta Wade;680,34
44567890;Seydou Gueye;590,12
45678901;Fatoumata Mbaye;520,89
```

Ces fichiers contiennent :
- 4 catégories (S1, S2, S3, S4)
- 20 clients avec des scores variés
- Les clients seront automatiquement assignés aux bonnes catégories selon leurs scores

## ✅ Vérification rapide

Pour vérifier que tout fonctionne :

1. Lancez l'application : `ng serve`
2. Ouvrez http://localhost:4200
3. Vous devez voir :
   - Un header "BAMIS DIGITAL" en haut
   - Un titre "Tirage au Sort"
   - Un texte "Importez vos fichiers CSV pour commencer"
   - Deux zones de téléversement :
     - "1. Fichier des catégories"
     - "2. Fichier des clients"

Si vous ne voyez pas cette page, vérifiez la console du navigateur (F12) pour les erreurs.

## 🆘 Support

Si le problème persiste :

1. Vérifiez les logs de la console du navigateur (F12)
2. Vérifiez les logs du terminal où `ng serve` est lancé
3. Essayez de redémarrer le serveur de développement
4. Essayez un autre navigateur (Chrome, Firefox, Edge)
