import { Sequelize } from "sequelize";

const sequelize = new Sequelize('kunpeng_learn', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})



async function test() {
    try {
        await sequelize.authenticate()
        console.log('数据库连接成功！');
    }
    catch (err) {
        console.error('数据库连接失败:', error);
    }
}

test()