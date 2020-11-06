import dotenv from 'dotenv'
import { Snowflake } from 'snowflake-promise'

dotenv.config()

const snowflake = new Snowflake({
  account: process.env.ACCOUNT,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  schema: 'JUNCTION_2020',
  warehouse: 'WH01',
  database: 'DEV_EDW_JUNCTION',
})

const app = async () => {
  await snowflake.connect()
  const result = await snowflake.execute('select * from cafe_pos_data')
  console.log(result)
}

app()
