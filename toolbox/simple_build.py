import os
import sys
import subprocess

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    cmd = [
        sys.executable, '-m', 'PyInstaller',
        '--name', '工具1.0',
        '--windowed',
        '--add-data', 'templates/index.html;templates',
        '--add-data', 'templates/md2pdf.html;templates',
        '--add-data', 'templates/plan_generator.html;templates',
        '--add-data', 'static/noteNB/index.html;static/noteNB',
        '--add-data', 'static/noteNB/logo.png;static/noteNB',
        '--add-data', 'static/noteNB/assets/index-Bit0yig2.js;static/noteNB/assets',
        '--add-data', 'static/noteNB/assets/index-C9wlhvwb.css;static/noteNB/assets',
        '--add-data', 'static/md2pdf/index.html;static/md2pdf',
        '--hidden-import', 'flask',
        '--hidden-import', 'werkzeug',
        '--hidden-import', 'jinja2',
        '--hidden-import', 'markupsafe',
        '--hidden-import', 'itsdangerous',
        '--hidden-import', 'click',
        '--hidden-import', 'blinker',
        '--hidden-import', 'markdown',
        '--hidden-import', 'playwright',
        '--hidden-import', 'playwright.sync_api',
        '--hidden-import', 'docx',
        '--hidden-import', 'lxml',
        '--hidden-import', 'lxml.etree',
        '--hidden-import', 'numpy',
        '--hidden-import', 'greenlet',
        '--hidden-import', 'cryptography',
        '--hidden-import', 'cffi',
        '--hidden-import', 'webbrowser',
        '--hidden-import', 'email',
        '--hidden-import', 'dateutil',
        '--hidden-import', 'six',
        '--clean',
        '--noconfirm',
        'app.py'
    ]
    
    print('开始打包...')
    print(f'命令长度: {len(" ".join(cmd))}')
    
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
    
    if result.returncode == 0:
        print('✓ 打包成功！')
        print(f'输出目录: dist/工具1.0')
    else:
        print('✗ 打包失败！')
        print(f'错误信息: {result.stderr[-2000:] if len(result.stderr) > 2000 else result.stderr}')

if __name__ == '__main__':
    main()
