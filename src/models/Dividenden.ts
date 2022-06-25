import mongoose from 'mongoose'

const dividendenSchema = new mongoose.Schema({
  aktieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aktien',
    required: true,
  },
  wert: { type: Number, required: true },
  waehrung: { type: String, required: true },
  jahr: { type: Number, required: true },
})

const Dividenden = mongoose.model('Dividenden', dividendenSchema)

module.exports = Dividenden
