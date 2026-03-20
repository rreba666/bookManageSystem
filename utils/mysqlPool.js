import mysql2 from 'mysql2'

const pool = mysql2.createPool({
    connectionLimit: 10,
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'kunpeng_learn'
})

export  function query(sql) {
    return new Promise((resvole, reject) => {
        pool.getConnection((err,connection)=>{
            pool.query(sql,(err,result)=>{
                if (err) {
                    reject(err)
                }
                resvole(result)
                connection.release()

            })

        })

    })
}






