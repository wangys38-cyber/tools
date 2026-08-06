#!/usr/bin/env python3
import os
import sys
import markdown
from datetime import datetime
from pathlib import Path
from playwright.sync_api import sync_playwright


def generate_html_with_watermark(md_content: str, watermark_text: str) -> str:
    html_content = markdown.markdown(
        md_content,
        extensions=[
            'extra',
            'codehilite',
            'tables',
            'fenced_code',
            'footnotes',
            'toc',
            'sane_lists'
        ]
    )
    
    html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        @page {{
            size: A4;
            margin: 2cm;
        }}
        body {{
            font-family: "Microsoft YaHei", "SimSun", "Helvetica Neue", Helvetica, Arial, sans-serif;
            color: #333;
            line-height: 1.8;
            font-size: 14px;
        }}
        .watermark {{
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.06;
            font-size: 70px;
            font-weight: bold;
            color: #000;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(-15deg);
        }}
        h1 {{ font-size: 28px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }}
        h2 {{ font-size: 24px; font-weight: bold; margin-top: 30px; margin-bottom: 15px; }}
        h3 {{ font-size: 20px; font-weight: bold; margin-top: 25px; margin-bottom: 12px; }}
        h4 {{ font-size: 18px; font-weight: bold; margin-top: 20px; margin-bottom: 10px; }}
        h5 {{ font-size: 16px; font-weight: bold; margin-top: 18px; margin-bottom: 8px; }}
        h6 {{ font-size: 14px; font-weight: bold; margin-top: 16px; margin-bottom: 6px; }}
        p {{ margin-bottom: 15px; text-indent: 2em; }}
        ul, ol {{ margin-bottom: 15px; padding-left: 2em; }}
        li {{ margin-bottom: 8px; }}
        blockquote {{
            border-left: 4px solid #007bff;
            padding: 10px 15px;
            margin: 15px 0;
            color: #666;
            font-style: italic;
            background-color: #f8f9fa;
            border-radius: 0 4px 4px 0;
        }}
        code {{
            background-color: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: "Consolas", "Courier New", Courier, monospace;
            font-size: 0.9em;
        }}
        pre {{
            background-color: #2d2d2d;
            color: #ccc;
            padding: 15px;
            border-radius: 6px;
            overflow-x: auto;
            margin-bottom: 15px;
            white-space: pre-wrap;
            word-break: break-all;
        }}
        pre code {{
            background-color: transparent;
            padding: 0;
            color: inherit;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 13px;
        }}
        th, td {{
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }}
        th {{
            background-color: #f2f2f2;
            font-weight: bold;
        }}
        a {{
            color: #007bff;
            text-decoration: none;
        }}
        img {{
            max-width: 100%;
            height: auto;
            border-radius: 4px;
        }}
        hr {{
            border: none;
            border-top: 1px solid #ddd;
            margin: 30px 0;
        }}
    </style>
</head>
<body>
    <div class="watermark">{watermark_text}</div>
    {html_content}
</body>
</html>'''
    
    return html


def convert_md_to_pdf(md_path: str, pdf_path: str = None) -> str:
    md_file = Path(md_path)
    
    if not md_file.exists():
        print(f"错误：文件不存在 - {md_path}")
        sys.exit(1)
    
    if not md_file.suffix.lower() == '.md':
        print(f"错误：文件不是 Markdown 文件 - {md_path}")
        sys.exit(1)
    
    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    today = datetime.now().strftime('%Y年%m月%d日')
    watermark_text = f"Motorola  {today}"
    
    html_content = generate_html_with_watermark(md_content, watermark_text)
    
    if pdf_path is None:
        pdf_path = str(md_file.with_suffix('.pdf'))
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_content(html_content)
        
        page.pdf(
            path=pdf_path,
            format='A4',
            margin={
                'top': '2cm',
                'right': '2cm',
                'bottom': '2cm',
                'left': '2cm'
            },
            print_background=True
        )
        
        browser.close()
    
    print(f"PDF 生成成功：{pdf_path}")
    return pdf_path


def convert_directory(md_dir: str):
    dir_path = Path(md_dir)
    
    if not dir_path.exists():
        print(f"错误：目录不存在 - {md_dir}")
        sys.exit(1)
    
    if not dir_path.is_dir():
        print(f"错误：不是目录 - {md_dir}")
        sys.exit(1)
    
    md_files = list(dir_path.glob('*.md'))
    
    if not md_files:
        print(f"目录中没有找到 Markdown 文件 - {md_dir}")
        sys.exit(1)
    
    print(f"找到 {len(md_files)} 个 Markdown 文件，开始转换...")
    
    for md_file in md_files:
        print(f"正在转换：{md_file.name}")
        try:
            convert_md_to_pdf(str(md_file))
        except Exception as e:
            print(f"转换失败 {md_file.name}：{e}")
    
    print("批量转换完成！")


def main():
    if len(sys.argv) < 2:
        print("用法：")
        print("  python md2pdf.py <markdown文件路径>")
        print("  python md2pdf.py -d <目录路径>")
        print("  python md2pdf.py <markdown文件路径> <输出PDF路径>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    
    if input_path == '-d':
        if len(sys.argv) < 3:
            print("错误：请指定目录路径")
            sys.exit(1)
        convert_directory(sys.argv[2])
    else:
        output_path = sys.argv[2] if len(sys.argv) > 2 else None
        convert_md_to_pdf(input_path, output_path)


if __name__ == '__main__':
    main()
