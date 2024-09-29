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
  const connection = await connect();
  if (!connection) {
    throw new Error('Failed to establish connection');
  }
  try {
    const result = await connection.execute(query, params, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    await connection.commit(); // Ensure durability
    return result.rows;
  } catch (err) {
    await connection.rollback(); // Ensure atomicity

    throw new Error((err as Error).message);
  } finally {
    await connection.close(); // Ensure resources are released
  }
};

export const runCursorQuery = async (query: string, params: any) => {
  try {
    const connection = await connect()
    if (!connection) {
      throw new Error('Failed to establish connection')
    }
    params = {
      ...params,
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    }
    const result = await connection.execute(query, params, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      resultSet: true,
    })
    const resultSet = result.outBinds.cursor
    let rows = []
    let row
    while ((row = await resultSet.getRow())) {
      rows.push(row)
    }
    await resultSet.close()
    connection.commit()
    await connection.close()
    return rows
  } catch (err) {

    throw new Error((err as Error).message)
  }
}