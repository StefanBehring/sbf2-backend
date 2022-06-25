import mongoose from 'mongoose'

const historischSchema = new mongoose.Schema({
  aktieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aktien',
    required: true,
  },
  datum: { type: String, required: true },
  start: { type: Number, required: true },
  ende: { type: Number, required: true },
  hoch: { type: Number, required: true },
  tief: { type: Number, required: true },
  volumen: { type: Number, required: true },
})

const Historisch = mongoose.model('Historisch', historischSchema)

module.exports = Historisch
