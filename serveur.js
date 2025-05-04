// // serveur.js
// const express = require('express');
// const bodyParser = require('body-parser');
// const mysql = require('mysql2');
// const cors = require('cors');

// const app = express();
// const port = 3000;

// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Connexion à la base de données distante
// const db = mysql.createConnection({
//   host: 'sql7.freesqldatabase.com',
//   user: 'sql7776142',
//   password: 'etSxEQTvi1',
//   database: 'sql7776142',
//   port: 3306
// });

// // Vérification de la connexion
// db.connect(err => {
//   if (err) {
//     console.error('Erreur de connexion MySQL:', err);
//   } else {
//     console.log('Connecté à la base de données MySQL distante');
//   }
// });

// // Route de test
// app.get('/', (req, res) => {
//   res.send('Serveur de quiz opérationnel');
// });

// // Route pour mettre à jour le score
// app.post('/submit', (req, res) => {
//   const { name, score } = req.body;
//   if (!name || score === undefined) {
//     return res.status(400).json({ error: 'Nom ou score manquant' });
//   }

//   const sql = 'UPDATE brightstar_users SET mark = ? WHERE name = ?';
//   db.query(sql, [score, name], (err, result) => {
//     if (err) {
//       console.error('Erreur lors de la mise à jour du score:', err);
//       return res.status(500).json({ error: 'Erreur serveur' });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Utilisateur non trouvé' });
//     }
//     res.json({ message: 'Score mis à jour avec succès' });
//   });
// });

// app.listen(port, () => {
//   console.log(`Quiz server running at http://localhost:${port}`);
// });












const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Middleware pour gérer les requêtes POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'sql7.freesqldatabase.com',
  user: 'sql7776142',
  password: 'etSxEQTvi1',
  database: 'sql7776142'
});

db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données : ', err);
    return;
  }
  console.log('Connexion à la base de données réussie');
});

// Servir quiz.html depuis la racine du projet
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API pour soumettre le score
app.post('/submit', (req, res) => {
  const { name, score } = req.body;
  if (!name || score === undefined) {
    return res.status(400).json({ message: 'Nom et score requis' });
  }

  const query = 'UPDATE brightstar_users SET mark = ? WHERE name = ?';
  db.query(query, [score, name], (err, result) => {
    if (err) {
      console.error('Erreur de mise à jour dans la base de données :', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    res.json({ message: `Score de ${name} mis à jour avec succès` });
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur de quiz opérationnel à http://localhost:${port}`);
});
