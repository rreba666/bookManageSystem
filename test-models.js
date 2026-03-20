// test-models.js
import { Books, BooksCategory, Todolist, sequelize } from './models/index.js'

async function testConnection() {
    try {
        // 1. 测试连接
        await sequelize.authenticate()
        console.log('✅ 数据库连接正常')

        // 2. 测试查询图书
        const books = await Books.findAll({ limit: 2 })
        console.log('✅ 查询图书成功:', books.length, '条')

        // 3. 测试查询分类
        const categories = await BooksCategory.findAll()
        console.log('✅ 查询分类成功:', categories.length, '个')

        // 4. 测试关联查询
        const booksWithCategory = await Books.findAll({
            include: [{
                model: BooksCategory,
                as: 'category',
                attributes: ['cate_name']
            }],
            limit: 2
        })
        console.log('✅ 关联查询成功:', booksWithCategory.length, '条')
        
        console.log('🎉 所有测试通过！模型工作正常')

    } catch (error) {
        console.error('❌ 测试失败:', error)
    } finally {
        // 关闭连接
        await sequelize.close()
    }
}

testConnection()