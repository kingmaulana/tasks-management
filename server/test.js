import express from 'express'
const app = express();
const PORT = 8081;

app.get('/', (req, res) => {
  res.send('It works!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
