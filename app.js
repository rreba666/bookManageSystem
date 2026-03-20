import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { sequelize } from './models/index.js'
import router from './routes/bookRoutes.js'

//获取当前文件的绝对路径和所在目录（固定格式）
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(express.static(path.join(__dirname, 'public')))

try {
    await sequelize.authenticate()
    console.log('数据库连接成功')
} catch (error) {
    console.error('数据库连接失败:', error)
}

// 路由导出的是对象直接挂载，若导出函数，则使用 router(app)
app.use('/', router)

 // 处理404固定格式
app.use((req,res)=>{
    res.status(404).json({
        code: 40400,
        msg: `找不到 ${req.method} ${req.url}`
    })
})

// 服务器异常处理固定格式
app.use((err,req,res,next)=>{
    console.log('服务器错误',err);
    res.status(500).json({
        code:50000,
        msg:`服务器出现异常`
    })
})

// 定义端口号
const PORT = 3000




app.listen(PORT,()=>{
    console.log('服务器在3000端口运行');
})

