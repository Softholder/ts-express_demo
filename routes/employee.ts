import express from 'express';
import bodyParser from 'body-parser';
import excelExport from 'excel-export';
import query from '../model/query';

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false});

let queryAllSQL = `SELECT employee.*, level.level, department.department
    FROM employee, level, department
    WHERE 
        employee.levelId = level.id AND
        employee.departmentId = department.id`;

router.get('/getEmployee', async (req, res) => {
    let { name = '', departmentId } = req.query;
    let conditions = `AND employee.name LIKE '%${name}%'`;
    if(departmentId){
        conditions = conditions + ` AND employee.departmentId=${departmentId}`;
    }
    let sql = `${queryAllSQL} ${conditions} ORDER BY employee.id DESC`;
    try {
        let result = await query(sql);
        result.forEach((i: any) => {
            i.key = i.id
        });
        res.json({
          flag: 0,
          data: result,
        });
    } catch (e) {
        res.json({
            flag: 1,
            msg: e.toString()
        })
    }
});

router.post('/createEmployee', urlencodedParser, async (req, res) => {
    let { name, departmentId, hiredate, levelId } = req.body;
    let sql = `INSERT INTO employee (name, departmentId, hiredate, levelId)
        VALUES ('${name}', ${departmentId}, '${hiredate}', ${levelId})`;
    try {
        let result = await query(sql);
        res.json({
            flag: 0,
            data: {
                key: result.insertId,
                id: result.insertId
            }
        })
    } catch (e) {
        res.json({
          flag: 1,
          msg: e.toString(),
        });
    }
  
});

let conf: excelExport.Config = {
  cols: [
    { caption: '员工ID', type: 'number' },
    { caption: '姓名', type: 'string' },
    { caption: '部门', type: 'string' },
    { caption: '入职时间', type: 'string' },
    { caption: '职级', type: 'string' },
  ],
  rows: []
};

router.get('/downloadEmployee', async (req, res) => {
    try {
          // 查询数据
          let result = await query(queryAllSQL);
          // 将数据映射为需要导出的格式
          conf.rows = result.map((i: any) => {
            return [i.id, i.name, i.department, i.hiredate, i.level];
          });
          // 生成excel
          let excel = excelExport.execute(conf);
          // 设置响应报文头
          res.setHeader('Content-Type', 'application/vnd.openxmlformats');
          res.setHeader(
            'Content-Disposition',
            'attachment; filename=EmployeeIndex.xlsx',
          );
          // 返回二进制文件
          res.end(excel, 'binary');
        } catch (e) {
        // 不是返回json格式，直接返回错误信息
        res.send(e.toString())
    }
})

export default router;