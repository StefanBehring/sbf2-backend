import mongoose from 'mongoose'

export default function connectDatabase(url: string) {
  mongoose
    .connect(url)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error: Error) => console.log('can not connect: ' + error))
}
