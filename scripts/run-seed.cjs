const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

const PROJECT_REF = 'xageefgpshbhijmadhee'

const CONNECTIONS = [
  {
    label: 'Direct (5432)',
    host: `${PROJECT_REF}.supabase.co`,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'RouteManager@2246',
    ssl: { rejectUnauthorized: false },
  },
  {
    label: 'Direct no SSL (5432)',
    host: `${PROJECT_REF}.supabase.co`,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'RouteManager@2246',
    ssl: false,
  },
]

async function main() {
  let client = null

  for (const config of CONNECTIONS) {
    try {
      console.log(`Tentando: ${config.label}`)
      client = new Client(config)
      await client.connect()
      const res = await client.query('SELECT current_database(), current_user')
      console.log(`Conectado! DB: ${res.rows[0].current_database}, User: ${res.rows[0].current_user}\n`)
      break
    } catch (err) {
      console.log(`  Falhou: [${err.code}] ${err.message}\n`)
      client = null
    }
  }

  if (!client) {
    console.error('Não conectou em nenhum formato.')
    console.log('Abra o Supabase Dashboard > Settings > Database e cole a "Connection string" aqui.')
    process.exit(1)
  }

  try {
    const seedPath = path.join(__dirname, '..', 'supabase', 'seed.sql')
    const seedSQL = fs.readFileSync(seedPath, 'utf-8')

    console.log('Rodando seed.sql...')
    await client.query(seedSQL)
    console.log('Seed executado!')

    const result = await client.query('SELECT count(*) FROM atracoes')
    console.log(`${result.rows[0].count} atrações na tabela`)
  } catch (err) {
    console.error('Erro:', err.message)
  } finally {
    await client.end()
  }
}

main()
