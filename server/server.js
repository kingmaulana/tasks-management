import 'dotenv/config'
import { db } from './dbConnect.js'
import express from 'express'
import userRouter from './routes/user.route.js'

const app = express()
app.use(express.json())
const PORT = 8001

app.use('/api/v1/users', userRouter)
app.use('/', (req, res) => {
  res.status(200).json({ message: 'Hello, World!' });
})


app.use(/(.*)/, (req, res) => {
  res.status(404).json({ message: 'not found' });
});

// Start server + handle port-in-use error
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please use a different port.`);
    process.exit(1)
  } else {
    console.error('❌ Unexpected server error:', err)
  }
})


