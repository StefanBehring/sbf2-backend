import mongoose from 'mongoose'

const aktienSchema = new mongoose.Schema({
  unternehmen: { type: String, required: true },
  wkn: { type: String, required: false },
  isin: { type: String, required: false },
  url: { type: String, required: true },
  urlHistorisch: { type: String, required: false },
  urlBilanzGuv: { type: String, required: false },
  urlDividende: { type: String, required: false },
})

const Aktien = mongoose.model('Aktien', aktienSchema)

module.exports = Aktien
