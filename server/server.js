import 'dotenv/config'
import { db } from './dbConnect.js'
import express from 'express'
import userRouter from './routes/user.route.js'

const app = express()
const PORT = 8000

app.use('/api/v1/users', userRouter)

app.use('/', (req, res) => {
  res.status(200).json({ message: 'Hello, World!' });
})

app.use(/(.*)/, (req, res) => {
  res.status(404).json({ message: 'not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running ons http://localhost:${PORT}`);
});


