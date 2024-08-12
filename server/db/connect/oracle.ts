import oracledb from 'oracledb'
import dbConfig from './config.ts'

export const connect = async () => {
  try {
    const connection = await oracledb.getConnection(dbConfig)

    return connection
  } catch (err) {
    console.error(err)
  }
}

export const runQuery = async (query: string, params: any) => {
  try {
    const connection = await connect()
    if (!connection) {
      throw new Error('Failed to establish connection')
    }
    const result = await connection.execute(query, params, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    })
    connection.commit()
    await connection.close()
    return result.rows
  } catch (err) {
    console.error(err)
  }
}
