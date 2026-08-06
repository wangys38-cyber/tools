with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

old_convert_to_pdf = '''def find_browser_path():
    browser_path = None
    
    exe_dir = os.path.dirname(sys.executable)
    
    search_paths = [
        os.path.join(exe_dir, '_internal', 'chromium'),
        os.path.join(exe_dir, 'chromium'),
        os.path.join(exe_dir, '_internal', 'playwright', 'driver', 'chromium'),
        os.path.join(exe_dir, '_internal', 'ms-playwright', 'chromium'),
        os.path.join(exe_dir, 'playwright', 'driver', 'chromium'),
        os.path.join(exe_dir, 'ms-playwright', 'chromium'),
        os.path.join(os.path.dirname(__file__), '_internal', 'chromium'),
        os.path.join(os.path.dirname(__file__), 'chromium'),
        os.path.join(os.path.dirname(__file__), '_internal', 'playwright', 'driver', 'chromium'),
        os.path.join(os.path.dirname(__file__), '_internal', 'ms-playwright', 'chromium'),
    ]
    
    for chromium_dir in search_paths:
        if os.path.exists(chromium_dir):
            for sub_item in ['chrome.exe', 'chrome-headless-shell.exe']:
                candidate = os.path.join(chromium_dir, sub_item)
                if os.path.exists(candidate):
                    browser_path = candidate
                    logger.info(f'Found browser: {browser_path}')
                    return browser_path
            
            for item in os.listdir(chromium_dir):
                item_path = os.path.join(chromium_dir, item)
                if os.path.isdir(item_path):
                    for sub_item in ['chrome.exe', 'chrome-headless-shell.exe']:
                        candidate = os.path.join(item_path, sub_item)
                        if os.path.exists(candidate):
                            browser_path = candidate
                            logger.info(f'Found browser: {browser_path}')
                            return browser_path
    
    if not browser_path:
        user_data_dir = os.path.join(os.path.expanduser('~'), 'AppData', 'Local', 'ms-playwright')
        if os.path.exists(user_data_dir):
            for item in os.listdir(user_data_dir):
                if item.startswith('chromium'):
                    chromium_path = os.path.join(user_data_dir, item)
                    if os.path.isdir(chromium_path):
                        for sub_item in os.listdir(chromium_path):
                            sub_path = os.path.join(chromium_path, sub_item)
                            if os.path.isdir(sub_path):
                                for exe_name in ['chrome.exe', 'chrome-headless-shell.exe']:
                                    candidate = os.path.join(sub_path, exe_name)
                                    if os.path.exists(candidate):
                                        browser_path = candidate
                                        logger.info(f'Found browser in user cache: {browser_path}')
                                        return browser_path
    
    return browser_path

def convert_to_pdf(content: str, pdf_path: str, watermark_text: str, is_markdown: bool = True):
    html_content = generate_html_with_watermark(content, watermark_text, is_markdown)

    browser_path = find_browser_path()

    launch_options = {'headless': True}
    if browser_path:
        launch_options['executable_path'] = browser_path
        logger.info(f'Using bundled browser: {browser_path}')
    else:
        logger.warning('No bundled browser found, will try to use system browser')

    with sync_playwright() as p:
        browser = p.chromium.launch(**launch_options)
        page = browser.new_page()

        page.set_content(html_content)

        try:
            page.wait_for_function(
                'document.body.classList.contains("katex-ready")',
                timeout=30000
            )
        except Exception:
            page.wait_for_timeout(8000)

        page.wait_for_timeout(2000)

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

        browser.close()'''

new_convert_to_pdf = '''def convert_to_pdf(content: str, pdf_path: str, watermark_text: str, is_markdown: bool = True):
    html_content = generate_html_with_watermark(content, watermark_text, is_markdown)
    
    from io import BytesIO
    from weasyprint import HTML, CSS
    
    logger.info('Converting to PDF using WeasyPrint...')
    
    html = HTML(string=html_content)
    
    styles = CSS(string='''
        @page {
            size: A4;
            margin: 2cm;
        }
        body {
            font-family: sans-serif;
            font-size: 14px;
            line-height: 1.6;
        }
        h1 { font-size: 24px; font-weight: bold; margin-bottom: 16px; }
        h2 { font-size: 20px; font-weight: bold; margin-bottom: 12px; }
        h3 { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        h4 { font-size: 16px; font-weight: bold; margin-bottom: 8px; }
        h5 { font-size: 14px; font-weight: bold; margin-bottom: 6px; }
        h6 { font-size: 12px; font-weight: bold; margin-bottom: 4px; }
        p { margin-bottom: 10px; }
        ul, ol { margin-bottom: 10px; padding-left: 20px; }
        li { margin-bottom: 4px; }
        code { background-color: #f4f4f4; padding: 2px 4px; font-family: monospace; }
        pre { background-color: #f4f4f4; padding: 10px; overflow-x: auto; margin-bottom: 10px; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 10px; }
        th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
        th { background-color: #f0f0f0; }
        blockquote { border-left: 4px solid #ccc; padding-left: 12px; margin: 10px 0; color: #666; }
        img { max-width: 100%; }
        .watermark {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: 0.1;
            font-size: 48px;
            font-weight: bold;
            color: #333;
            transform: rotate(-45deg);
            transform-origin: center;
            text-align: center;
            vertical-align: middle;
            line-height: 100vh;
        }
    ''')
    
    pdf_bytes = html.write_pdf(stylesheets=[styles])
    
    with open(pdf_path, 'wb') as f:
        f.write(pdf_bytes)
    
    logger.info(f'PDF saved to: {pdf_path}')'''

content = content.replace(old_convert_to_pdf, new_convert_to_pdf)

old_import_section = '''from flask import Flask, render_template, request, send_file, jsonify, send_from_directory
import markdown
from datetime import datetime
from playwright.sync_api import sync_playwright
from docx import Document
import os
import sys
import logging
import traceback
import webbrowser'''

new_import_section = '''from flask import Flask, render_template, request, send_file, jsonify, send_from_directory
import markdown
from datetime import datetime
from docx import Document
import os
import sys
import logging
import traceback
import webbrowser'''

content = content.replace(old_import_section, new_import_section)

with open('app.py', 'w', encoding='utf-8') as f:
    f.write(content)

print('✓ 已切换到WeasyPrint')