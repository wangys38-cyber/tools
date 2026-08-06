import openpyxl
from openpyxl.styles import Font, Alignment, Border, Side
import os

wb = openpyxl.Workbook()

ws1 = wb.active
ws1.title = '员工信息表'

header_font = Font(bold=True)
center_align = Alignment(horizontal='center', vertical='center')
thin_border = Border(
    left=Side(style='thin'),
    right=Side(style='thin'),
    top=Side(style='thin'),
    bottom=Side(style='thin')
)

ws1['A1'] = '编号'
ws1['B1'] = '基本信息'
ws1['C1'] = '基本信息'
ws1['D1'] = '基本信息'
ws1['E1'] = '工作信息'
ws1['F1'] = '工作信息'
ws1['G1'] = '空列1'
ws1['H1'] = '空列2'

ws1['B2'] = '姓名'
ws1['C2'] = '年龄'
ws1['D2'] = '性别'
ws1['E2'] = '部门'
ws1['F2'] = '职位'
ws1['G2'] = ''
ws1['H2'] = ''

ws1.merge_cells('B1:D1')
ws1.merge_cells('E1:F1')
ws1.merge_cells('A1:A2')
ws1.merge_cells('B2:C2')

test_data = [
    [1, '张三', 28, '男', '技术部', '高级工程师', '', ''],
    [2, '李四', 32, '女', '产品部', '产品经理', '', ''],
    [3, '王五', 25, '男', '技术部', '工程师', '', ''],
    [4, '赵六', 35, '女', '市场部', '市场总监', '', ''],
    [5, '钱七', 29, '男', '技术部', '高级工程师', '', ''],
    [6, '', 31, '男', '人事部', 'HR经理', '', ''],
    [7, '孙八', '', '', '', '', '', ''],
]

for i, row_data in enumerate(test_data, start=3):
    for j, value in enumerate(row_data, start=1):
        cell = ws1.cell(row=i, column=j, value=value)

ws2 = wb.create_sheet('项目进度表')

ws2['A1'] = '项目编号'
ws2['B1'] = '项目名称'
ws2['C1'] = '负责人'
ws2['D1'] = '开始日期'
ws2['E1'] = '结束日期'
ws2['F1'] = '状态'
ws2['G1'] = '完成度'
ws2['H1'] = '备注'

ws2.merge_cells('D1:E1')

project_data = [
    ['P001', 'APP重构', '张三', '2024-01-01', '2024-06-30', '进行中', 60, '重点项目'],
    ['P002', '网站升级', '李四', '2024-02-15', '2024-08-31', '进行中', 45, ''],
    ['P003', '数据分析平台', '王五', '2024-03-01', '2024-12-31', '规划中', 10, '长期项目'],
    ['P004', 'CRM系统', '赵六', '2023-11-01', '2024-04-30', '已完成', 100, '已验收'],
    ['P005', 'ERP集成', '钱七', '2024-04-01', '2024-10-31', '进行中', 35, ''],
]

for i, row_data in enumerate(project_data, start=2):
    for j, value in enumerate(row_data, start=1):
        ws2.cell(row=i, column=j, value=value)

test_file = 'test_excel_complex.xlsx'
wb.save(test_file)
print(f"测试Excel文件已创建: {test_file}")
print(f"包含: 合并单元格、空列、多行表头")
