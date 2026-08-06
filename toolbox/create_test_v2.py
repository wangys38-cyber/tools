import openpyxl
from openpyxl.styles import Font, Alignment, Border, Side

wb = openpyxl.Workbook()

ws1 = wb.active
ws1.title = '员工信息表'

ws1['A1'] = '编号'
ws1['B1'] = '基本信息'
ws1['C1'] = '基本信息'
ws1['D1'] = '基本信息'
ws1['E1'] = '工作信息'
ws1['F1'] = '工作信息'

ws1['B2'] = '姓名'
ws1['C2'] = '年龄'
ws1['D2'] = '性别'
ws1['E2'] = '部门'
ws1['F2'] = '职位'

ws1.merge_cells('B1:D1')
ws1.merge_cells('E1:F1')
ws1.merge_cells('A1:A2')

test_data = [
    [1, '张三', 28, '男', '技术部', '高级工程师'],
    [2, '李四', 32, '女', '产品部', '产品经理'],
    [3, '王五', 25, '男', '技术部', '工程师'],
    [4, '赵六', 35, '女', '市场部', '市场总监'],
    [5, '钱七', 29, '男', '技术部', '高级工程师'],
]

for i, row_data in enumerate(test_data, start=3):
    for j, value in enumerate(row_data, start=1):
        ws1.cell(row=i, column=j, value=value)

print("员工信息表结构:")
for row in ws1.iter_rows(min_row=1, max_row=3, values_only=True):
    print(f"  {row}")

ws2 = wb.create_sheet('简单表格')

ws2['A1'] = '姓名'
ws2['B1'] = '年龄'
ws2['C1'] = '部门'
ws2['D1'] = '职位'
ws2['E1'] = '空列'

simple_data = [
    ['张三', 28, '技术部', '工程师', ''],
    ['李四', 32, '产品部', '经理', ''],
    ['王五', 25, '市场部', '专员', ''],
]

for i, row_data in enumerate(simple_data, start=2):
    for j, value in enumerate(row_data, start=1):
        ws2.cell(row=i, column=j, value=value)

print("\n简单表格结构:")
for row in ws2.iter_rows(min_row=1, max_row=3, values_only=True):
    print(f"  {row}")

test_file = 'test_excel_v2.xlsx'
wb.save(test_file)
print(f"\n测试文件已创建: {test_file}")
