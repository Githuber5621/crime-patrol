import postgres from 'postgres'
import { config } from 'dotenv'

config()

const sql = postgres(process.env.SUPABASE_SESSION_POOLER_URL)

export default sql