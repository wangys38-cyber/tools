from flask import Flask, render_template, request, send_file, jsonify
import markdown
from datetime import datetime
from playwright.sync_api import sync_playwright
from docx import Document
import os
import sys
import logging
import traceback

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

try:
    app_data_dir = os.path.join(os.path.expanduser('~'), 'PDF快转')
    os.makedirs(app_data_dir, exist_ok=True)
except:
    app_data_dir = os.path.join(os.path.dirname(sys.executable), 'data')
    try:
        os.makedirs(app_data_dir, exist_ok=True)
    except:
        import tempfile
        app_data_dir = os.path.join(tempfile.gettempdir(), 'PDF快转')
        os.makedirs(app_data_dir, exist_ok=True)

app.config['UPLOAD_FOLDER'] = os.path.join(app_data_dir, 'uploads')
app.config['PDF_FOLDER'] = os.path.join(app_data_dir, 'pdfs')

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['PDF_FOLDER'], exist_ok=True)


def generate_html_with_watermark(content: str, watermark_text: str, is_markdown: bool = True) -> str:
    if is_markdown:
        html_content = markdown.markdown(
            content,
            extensions=[
                'extra',
                'codehilite',
                'tables',
                'fenced_code',
                'footnotes',
                'toc',
                'sane_lists'
            ],
            safe_mode=False
        )
    else:
        html_content = content

    html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
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
        .katex {{ font-size: 1.1em; }}
    </style>
</head>
<body>
    <div class="watermark">{watermark_text}</div>
    {html_content}
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function() {{
            renderMathInElement(document.body, {{
                delimiters: [
                    {{left: "$$", right: "$$", display: true}},
                    {{left: "$", right: "$", display: false}},
                    {{left: "\\\\(", right: "\\\\)", display: false}},
                    {{left: "\\\\[", right: "\\\\]", display: true}}
                ],
                throwOnError: false,
                errorColor: "#cc0000"
            }});
            setTimeout(function() {{
                document.body.classList.add('katex-ready');
            }}, 2000);
        }});
    </script>
</body>
</html>'''

    return html


def convert_to_pdf(content: str, pdf_path: str, watermark_text: str, is_markdown: bool = True):
    html_content = generate_html_with_watermark(content, watermark_text, is_markdown)

    exe_dir = os.path.dirname(sys.executable)
    browser_path = None
    
    chromium_dir = os.path.join(exe_dir, '_internal', 'ms-playwright', 'chromium')
    if os.path.exists(chromium_dir):
        for item in os.listdir(chromium_dir):
            if item.startswith('chrome') or item.startswith('win'):
                chrome_path = os.path.join(chromium_dir, item, 'chrome.exe')
                if os.path.exists(chrome_path):
                    browser_path = chrome_path
                    break

    if not browser_path:
        chromium_dir = os.path.join(exe_dir, 'ms-playwright', 'chromium')
        if os.path.exists(chromium_dir):
            for item in os.listdir(chromium_dir):
                if item.startswith('chrome') or item.startswith('win'):
                    chrome_path = os.path.join(chromium_dir, item, 'chrome.exe')
                    if os.path.exists(chrome_path):
                        browser_path = chrome_path
                        break

    launch_options = {'headless': True}
    if browser_path:
        launch_options['executable_path'] = browser_path
        logger.info(f'Using bundled browser: {browser_path}')

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

        browser.close()


def docx_to_html(docx_path: str) -> str:
    doc = Document(docx_path)
    html_parts = []

    for para in doc.paragraphs:
        style = para.style.name.lower()

        if style.startswith('heading'):
            level = int(style.replace('heading ', '')) if style.replace('heading ', '').isdigit() else 1
            html_parts.append(f'<h{level}>{para.text}</h{level}>')
        elif style == 'list paragraph':
            html_parts.append(f'<li>{para.text}</li>')
        elif style == 'quote':
            html_parts.append(f'<blockquote>{para.text}</blockquote>')
        else:
            html_parts.append(f'<p>{para.text}</p>')

    return '\n'.join(html_parts)


def get_default_watermark() -> str:
    today = datetime.now().strftime('%Y年%m月%d日')
    return f"Motorola  {today}"


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/test-batch')
def test_batch():
    return jsonify({'message': 'batch route test', 'version': '1.0'})


@app.route('/preview', methods=['POST'])
def preview():
    md_content = request.json.get('content', '')
    watermark_text = request.json.get('watermark', '')

    if not watermark_text.strip():
        watermark_text = get_default_watermark()

    html_content = generate_html_with_watermark(md_content, watermark_text)
    return jsonify({'html': html_content})


@app.route('/convert', methods=['POST'])
def convert():
    md_content = request.json.get('content', '')
    original_name = request.json.get('filename', '')
    watermark_text = request.json.get('watermark', '')

    if not md_content.strip():
        return jsonify({'error': '请输入内容'}), 400

    if not watermark_text.strip():
        watermark_text = get_default_watermark()

    if original_name:
        safe_name = original_name.replace('/', '_').replace('\\', '_').replace(':', '_').replace('*', '_').replace('?', '_').replace('"', '_').replace('<', '_').replace('>', '_').replace('|', '_')
        filename = f"{safe_name}.pdf"
    else:
        filename = f"document_{datetime.now().strftime('%Y%m%d')}.pdf"

    pdf_path = os.path.join(app.config['PDF_FOLDER'], filename)

    try:
        convert_to_pdf(md_content, pdf_path, watermark_text)
        print(f"转换成功: {filename}")
        logger.info(f"转换成功: {filename}")
        return jsonify({'filename': filename})
    except Exception as e:
        logger.error(f"转换失败: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500


@app.route('/download/<filename>')
def download(filename):
    pdf_folder = os.path.abspath(app.config['PDF_FOLDER'])
    pdf_path = os.path.join(pdf_folder, filename)

    if not os.path.exists(pdf_path):
        return jsonify({'error': '文件不存在'}), 404

    print(f"下载成功: {filename}")
    logger.info(f"下载成功: {filename}")
    return send_file(pdf_path, as_attachment=True, download_name=filename, mimetype='application/pdf')


@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': '请选择文件'}), 400

    file = request.files['file']
    watermark_text = request.form.get('watermark', '')

    if file.filename == '':
        return jsonify({'error': '请选择文件'}), 400

    filename_lower = file.filename.lower()
    is_md = filename_lower.endswith('.md')
    is_docx = filename_lower.endswith('.docx')

    if not (is_md or is_docx):
        return jsonify({'error': '只支持Markdown文件(.md)和Word文件(.docx)'}), 400

    if not watermark_text.strip():
        watermark_text = get_default_watermark()

    original_name = os.path.splitext(file.filename)[0]
    safe_name = original_name.replace('/', '_').replace('\\', '_').replace(':', '_').replace('*', '_').replace('?', '_').replace('"', '_').replace('<', '_').replace('>', '_').replace('|', '_')
    pdf_filename = f"{safe_name}.pdf"
    pdf_path = os.path.join(app.config['PDF_FOLDER'], pdf_filename)

    try:
        print(f"上传成功: {file.filename}")
        logger.info(f"上传成功: {file.filename}")
        
        if is_md:
            try:
                content = file.read().decode('utf-8')
            except UnicodeDecodeError:
                content = file.read().decode('gbk', errors='replace')
            convert_to_pdf(content, pdf_path, watermark_text, is_markdown=True)
        else:
            temp_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(temp_path)
            html_content = docx_to_html(temp_path)
            convert_to_pdf(html_content, pdf_path, watermark_text, is_markdown=False)
            os.remove(temp_path)

        print(f"转换成功: {pdf_filename}")
        logger.info(f"转换成功: {pdf_filename}")
        return jsonify({'filename': pdf_filename, 'original_name': original_name})
    except Exception as e:
        logger.error(f"上传/转换失败: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500


@app.route('/batch-upload', methods=['POST'])
def batch_upload():
    if 'files[]' not in request.files:
        return jsonify({'error': '请选择文件'}), 400

    files = request.files.getlist('files[]')
    watermark_text = request.form.get('watermark', '')

    if not watermark_text.strip():
        watermark_text = get_default_watermark()

    results = []
    success_count = 0
    fail_count = 0

    for file in files:
        if file.filename == '':
            continue

        filename_lower = file.filename.lower()
        is_md = filename_lower.endswith('.md')
        is_docx = filename_lower.endswith('.docx')

        if not (is_md or is_docx):
            results.append({
                'original_name': file.filename,
                'status': 'failed',
                'message': '不支持的文件格式'
            })
            fail_count += 1
            continue

        original_name = os.path.splitext(file.filename)[0]
        safe_name = original_name.replace('/', '_').replace('\\', '_').replace(':', '_').replace('*', '_').replace('?', '_').replace('"', '_').replace('<', '_').replace('>', '_').replace('|', '_')
        pdf_filename = f"{safe_name}.pdf"
        pdf_path = os.path.join(app.config['PDF_FOLDER'], pdf_filename)

        try:
            print(f"上传成功: {file.filename}")
            logger.info(f"上传成功: {file.filename}")
            
            if is_md:
                try:
                    content = file.read().decode('utf-8')
                except UnicodeDecodeError:
                    content = file.read().decode('gbk', errors='replace')
                convert_to_pdf(content, pdf_path, watermark_text, is_markdown=True)
            else:
                temp_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
                file.save(temp_path)
                html_content = docx_to_html(temp_path)
                convert_to_pdf(html_content, pdf_path, watermark_text, is_markdown=False)
                os.remove(temp_path)

            print(f"转换成功: {pdf_filename}")
            logger.info(f"转换成功: {pdf_filename}")
            results.append({
                'original_name': file.filename,
                'pdf_filename': pdf_filename,
                'status': 'success',
                'message': '转换成功'
            })
            success_count += 1
        except Exception as e:
            logger.error(f"文件 {file.filename} 转换失败: {str(e)}")
            results.append({
                'original_name': file.filename,
                'status': 'failed',
                'message': str(e)
            })
            fail_count += 1

    return jsonify({
        'results': results,
        'success_count': success_count,
        'fail_count': fail_count,
        'total_count': len(files)
    })


if __name__ == '__main__':
    try:
        print("PDF快转 2.0 启动中...")
        logger.info("PDF快转 2.0 启动中...")
        app.run(host='0.0.0.0', port=5001, debug=False)
    except Exception as e:
        logger.error(f"启动失败: {str(e)}")
        logger.error(traceback.format_exc())
        print(f"启动失败: {str(e)}")
        input("按回车键退出...")