import * as dotenv from 'dotenv'
dotenv.config()
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTIONSTRING,
}
export default dbConfig
