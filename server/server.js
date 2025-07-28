import 'dotenv/config'
import express from 'express'
import userRouter from './routes/user.route.js'
import { errorHanndler } from './libs/middleware.js'

const app = express()
const PORT = process.env.PORT || 8001

// Middlewares
app.use(express.json())

// Routes
app.use('/api/v1/users', userRouter)

// 404 handler (pastikan setelah semua route!)
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

// Error handler middleware
app.use(errorHanndler)
// app.use((err, req, res, next) => {
//   console.error('❌ Error:', err)
//   res.status(err.status || 500).json({
//     status: err.status || 500,
//     message: err.message || 'Internal Server Error'
//   })
// })

// Start server with port conflict handling
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please use a different port.`)
    process.exit(1)
  } else {
    console.error('❌ Unexpected server error:', err)
  }
})
