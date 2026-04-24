const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const plateDatabase = {
  "ABC123": "Kiss János",
  "BCA234": "Nagy Ágnes",
  "CDE345": "Tóth Péter",
  "DEF456": "Szabó Erika",
  "EFG567": "Horváth Gábor",
  "FGH678": "Varga Katalin",
  "GHI789": "Molnár István",
  "HIJ890": "Lakatos Zoltán",
  "IJK901": "Farkas Andrea",
  "JKL012": "Balogh Gábor"
};

app.get('/api/lookup', (req, res) => {
  const plate = (req.query.plate || '').trim().toUpperCase();
  if (!plate) {
    return res.status(400).json({ error: 'Kérjük, adjon meg egy rendszámot a ?plate= paraméterrel.' });
  }

  const owner = plateDatabase[plate];
  if (!owner) {
    return res.status(404).json({
      plate,
      owner: null,
      message: 'A megadott rendszám nincs az adatbázisban.'
    });
  }

  res.json({ plate, owner });
});

app.listen(port, () => {
  console.log(`Rendszam lookup backend fut a http://localhost:${port}`);
});
