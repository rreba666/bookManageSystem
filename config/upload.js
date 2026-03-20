import multer from 'multer'
import fs from 'fs'

// 确保目录存在
if (!fs.existsSync('upload')) {
    fs.mkdirSync('upload')
}

// 就是你原来用的配置
const upload = multer({ dest: 'upload/' })

export default upload