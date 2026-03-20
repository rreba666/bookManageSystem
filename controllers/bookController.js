// server-sequelize.js
import { Op } from 'sequelize'
import fs from 'fs'
import path from 'path'
import { Books, BooksCategory, Todolist, sequelize } from '../models/index.js'

// 获取所有图书（包含分类信息）
export const allTasks = async function (req, res) {
    try {
        let { page = 1, pageSize = 2, keyword = '' } = req.query
        page = parseInt(page)
        pageSize = parseInt(pageSize)
        let offset = (page - 1) * pageSize
        // 构建查询条件
        let whereCondition = {}
        if (keyword) {
            whereCondition = {
                [Op.or]: [
                    { title: { [Op.like]: `%${keyword}%` } },
                    { text: { [Op.like]: `%${keyword}%` } }
                ]
            }
        }
        // 查询数据
        const books = await Books.findAndCountAll({
            where: whereCondition,
            include: [{
                model: BooksCategory,
                as: 'category',  // 对应 init-models.js 中设置的别名
                attributes: ['cate_name']
            }],
            limit: pageSize,
            offset: offset,
            order: [['books_id', 'DESC']]
        })

        // 查询所有分类
        const categories = await BooksCategory.findAll()

        res.json({
            code: 20000,
            msg: '请求数据成功',
            data: books.rows,
            searchCount: books.count,
            totalCount: await Books.count(),
            cateCount: categories,
            page: page,
            pageSize: pageSize
        })

    } catch (error) {
        console.error('查询失败:', error)
        res.json({ code: 50000, msg: error.message })
    }
}

// 排序
export const sortTasks = async function (req, res) {
    try {
        let { field, sort, page = 1, pageSize = 2 } = req.query

        page = parseInt(page)
        pageSize = parseInt(pageSize)
        let offset = (page - 1) * pageSize

        const books = await Books.findAll({
            include: [{
                model: BooksCategory,
                as: 'category',
                attributes: ['cate_name']
            }],
            order: [[field, sort.toUpperCase()]],
            limit: pageSize,
            offset: offset
        })

        const total = await Books.count()

        res.json({
            code: 20000,
            msg: '请求数据成功',
            data: books,
            total: total
        })

    } catch (error) {
        console.error('排序查询失败:', error)
        res.json({ code: 50000, msg: error.message })
    }

}

// 价格范围搜索
export const searchPrice = async function (req, res) {
    try {
        let { minPrice, maxPrice } = req.query

        // 价格查询条件
        let priceCondition = {}
        if (minPrice && maxPrice) {
            priceCondition = {
                [Op.between]: [Number(minPrice), Number(maxPrice)]
            }
        } else if (minPrice) {
            priceCondition = {
                [Op.gte]: Number(minPrice)
            }
        } else if (maxPrice) {
            priceCondition = {
                [Op.lte]: Number(maxPrice)
            }
        }
        // 查询图书
        const books = await Books.findAll({
            where: {
                price: priceCondition
            },
            include: [{
                model: BooksCategory,
                as: 'category',
                attributes: ['cate_name']
            }],
            order: [['price', 'ASC']]
        })
        res.json({
            code: 20000,
            msg: '请求数据成功',
            data: books
        })

    }
    catch (e) {
        console.log('价格搜索失败:', e);
        res.json({
            code: 50000, msg: e.message
        })

    }
}

// 日期范围搜索
export const  searchDate = async function (req, res)  {
    try {
        let { startTime, endTime } = req.query
        // 构建时间条件
        let dateCondition = {}
        if (startTime && endTime) {
            dateCondition = {
                [Op.between]: [Number(startTime), Number(endTime)]
            }
        } else if (startTime) {
            dateCondition = {
                [Op.gte]: Number(startTime)
            }
        } else if (endTime) {
            dateCondition = {
                [Op.lte]: Number(endTime)
            }
        }

        const books = await Books.findAll({
            where: {
                date: dateCondition
            },
            include: [{
                model: BooksCategory,
                as: 'category',
                attributes: ['cate_name']
            }],
            order: [['date', 'DESC']]
        })

    }
    catch (error) {
        console.log('时间搜索失败', error);
        res.json({
            code: 50000,
            msg: error.message
        })
    }
}

// 添加书籍接口
export const addTask = async function (req, res)  {
    try {
        let { title, price, text, cate_id } = req.body

        if (!title || !title.trim()) {
            return res.json({ code: 40001, msg: '请将图书信息填充完整' })
        }
        if (!price || !price.trim()) {
            return res.json({ code: 40001, msg: '请将图书信息填充完整' })
        }
        if (!text || !text.trim()) {
            return res.json({ code: 40001, msg: '请将图书信息填充完整' })
        }

        // 检查重名
        const existingBook = await Books.findOne({
            where: { title: title.trim() }
        })

        if (existingBook) {
            if (req.file) {
                fs.unlinkSync(req.file.path)
            }
            return res.json({
                code: 20003,
                msg: '添加失败，书名不能重名'
            })
        }
        // 处理图片上传
        let imgPath = null
        if (req.file) {
            let { originalname, destination, filename } = req.file
            let ext = path.extname(originalname)
            let newFilename = filename + ext //获取后缀名
            let newPath = path.join(destination, newFilename)

            fs.renameSync(req.file.path, newPath)
            imgPath = `/upload/${newFilename}`
        }

        // 创建新图书
        const newBook = await Books.create({
            title: title.trim(),
            price: Number(price),
            text: text.trim(),
            img: imgPath,
            cate_id: cate_id || null,
            date: Math.floor(Date.now() / 1000)
        })

        res.json({
            code: 20000,
            msg: '添加成功',
            data: newBook
        })
    } catch (err) {
        console.log('添加错误:', err);
        // 出错时删除已上传的文件
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path)
        }
        res.json({ code: 50000, msg: err.message })
    }

}

// 删除图书
export const delTask= async function(req, res)  {
    try {
        let id = req.query.id

        if (!id || isNaN(Number(id))) {
            return res.json({ code: 40001, msg: '无效的ID' })
        }
        // 先查询图书，获取图片路径
        const book = await Books.findByPk(id)
        // 删除时也删除图片
        // 查询符合条件的记录数
        const deletedCount = await Books.destroy({
            where: { books_id: id }
        })

        if (deletedCount > 0) {
            //如果图片存在就删除
            if (book?.img) {
                const filename = book.img.split('/').pop()
                const filePath = path.join('upload', filename)
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath)
                }
            }
            res.json({
                code: 20000,
                msg: '删除成功'
            })
        } else {
            res.json({
                code: 20002,
                msg: '删除失败'
            })
        }
    } catch (error) {
        console.error('删除失败:', error)
        res.json({ code: 50000, msg: error.message })
    }
}



