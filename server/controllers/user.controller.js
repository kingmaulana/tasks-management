import { db } from '../dbConnect.js';
import { ObjectId, ReturnDocument } from 'mongodb';

const collection = await db.collection('user');

export const test = async (req, res) => {
  let result = await collection.find({}).toArray();
  res.status(200).json(result);
}


export const getUser = async (req, res, next) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const user = await collection.findOne(query);

    if(!user) {
      return next({ status: 404, message: 'User not found'})
    }

    res.status(200).json(user)
  } catch (error) {
    next({ status: 500, error })
  }
}

export const updateUser = async (req, res, next) => {
  try {
    if(req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const query = { _id: new ObjectId(req.params.id) };
    const data = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    }

    const options = {
      returnDocument: 'after'
    }

    const updatedUser = await collection.findOneAndUpdate(query, data, options);
    const { password: pass, updatedAt, createdAt, ...rest } = updatedUser;
  } catch (error) {
    next ({ status: 500, error });
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const deletedUser = await collection.findOneAndDelete(query);

    if(!deletedUser) {
      return next({ status: 404, message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    next({ status: 500, error });
  }
}
