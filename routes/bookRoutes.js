import express from 'express'
import upload from '../config/upload.js'
import { allTasks, addTask, delTask, sortTasks, searchPrice, searchDate } from '../controllers/bookController.js'


const router = express.Router()

router.post('/addtask', upload.single('img'), addTask)
router.get('/alltasks',allTasks)
router.delete('/deltask',delTask)
router.get('/sorttasks',sortTasks)
router.get('/searchprice',searchPrice)
router.get('/searchdate',searchDate)

export default router