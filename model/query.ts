import mysql from 'mysql';
import dbConfig from '../config/db';

// 使用MySQL连接池操作
const pool = mysql.createPool(dbConfig);

const query = (sql: string) => {
    return new Promise<any>((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if(error){
                reject(error);
            } else {
                connection.query(sql, (error, results) => {
                    if(error){
                        reject(error);
                    } else {
                        resolve(results);
                    }
                    connection.release();
                })
            }
        })
    })
}

export default query;