import mongoose from 'mongoose'

const aktieTransaktionSchema = new mongoose.Schema({
  aktieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aktien',
    required: true,
  },
  anzahl: { type: Number, required: true },
  preis: { type: Number, required: true },
  datum: { type: String, required: true },
  istKauf: { type: Boolean, required: true },
})

const AktieTransaktion = mongoose.model(
  'AktieTransaktion',
  aktieTransaktionSchema
)

module.exports = AktieTransaktion
