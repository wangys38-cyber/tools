import openpyxl

wb = openpyxl.Workbook()
ws1 = wb.active
ws1.title = '员工信息'
ws1.append(['姓名', '年龄', '部门', '职位', '入职日期', '薪资'])
ws1.append(['张三', 28, '技术部', '高级工程师', '2022-03-15', 18000])
ws1.append(['李四', 32, '产品部', '产品经理', '2020-07-01', 22000])
ws1.append(['王五', 25, '技术部', '工程师', '2023-06-01', 12000])
ws1.append(['赵六', 35, '市场部', '市场总监', '2019-01-10', 30000])
ws1.append(['钱七', 29, '技术部', '高级工程师', '2021-11-20', 20000])

test_file = 'test_col_select.xlsx'
wb.save(test_file)
print(f"测试Excel文件已创建: {test_file}")