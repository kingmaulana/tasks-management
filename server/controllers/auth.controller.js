import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from '../dbConnect.js'


const collection = await db.collection('user')

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body
    const query = {
      $or: [
        { username },
        { email }
      ]
    }

    const existingUser = await collection.findOne(query)
    if(existingUser) {
      return next({ status: 422, message: 'Username or email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = {
      username,
      email,
      password: hashedPassword,
      avatar: 'https://g.codewithnathan.com/default-user.png',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const { insertedId } = await collection.insertOne(user)
    const token = jwt.sign({ id: insertedId }, process.env.AUTH_SECRET)
    user.id = insertedId
    const { password: pass, updatedAt, createdAt, ...rest } = user
    res
    .cookie('taskly_token', token, { httpOnly: true })
    .status(200)
    .json(rest)
  } catch (error) {
    console.log("🚀 ~ signup ~ error:", error)
    next({ status: 500, error })
  }
}

export const signin = async (req, res, next) => {
  const { email, password } = req.body
  console.log("🚀 ~ signin ~ req.body:", req.body)
  try {
    const validUser = await collection.findOne({ email })
    if(!validUser) {
      return next({ status: 401, message: 'Invalid email or password' })
    }

    const isPasswordValid = await bcrypt.compare(password, validUser.password)
    if(!isPasswordValid) {
      return next({ status: 401, message: 'Invalid email or password' })
    }

    const token = jwt.sign({ id: validUser._id }, process.env.AUTH_SECRET)
    const { password: pass, updatedAt, createdAt, ...rest } = validUser
    res
      .cookie('taskly_token', token, { httpOnly: true })
      .status(200)
      .json(rest)
  } catch (error) {
    console.log("🚀 ~ signin ~ error:", error)
    next({ status: 500, error })
  }
}


export const signout = async (req, res, next) => {
  try {
    res.clearCookie('taskly_token')
    res.status(200).json({ message: 'Signout successful' })
  } catch (error) {
    next({ status: 500, error })
  }
}
