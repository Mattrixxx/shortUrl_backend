const express = require('express')
const ShortUniqueId = require('short-unique-id')
const { getConnection } = require('./database')
const cors = require('cors')

const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors())

app.post('/api/create-short-url', async (req, res) => {
  const longUrl = req.body.longUrl
  const uid = new ShortUniqueId({ length: 10 })
  const uniqueID = uid()
  const sql = `INSERT INTO shorturl(longUrl, shortUrl) VALUES('${longUrl}','${uniqueID}')`

  try {
    const db = await getConnection()

    const [rows] = await db.execute(sql)

    res.status(201).json({ status: 'success', short_url: uniqueID })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error })
  }
})

app.get('/api/get-url', async (req, res) => {
  try {
    const db = await getConnection()

    const [rows] = await db.execute(`SELECT * FROM shorturl`)

    res.status(200).json(rows)
  } catch (error) {
    res.status(500).json({ status: 'error', message: error })
  }
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = req.params.shortUrl
  try {
    const db = await getConnection()
    let sql = `SELECT * FROM shorturl WHERE shortUrl='${shortUrl}' LIMIT 1`

    const [rows] = await db.execute(sql)

    const { id, count, longUrl } = rows[0]
    sql = `UPDATE shorturl SET count=${count + 1} WHERE id='${id}'`

    await db.execute(sql)

    res.redirect(longUrl)
  } catch (error) {
    res.status(500).json({ status: 'error', message: error })
  }
})

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
)
