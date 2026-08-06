# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['app.py'],
    pathex=[],
    binaries=[],
    datas=[('templates/index.html', 'templates'), ('templates/md2pdf.html', 'templates'), ('templates/plan_generator.html', 'templates'), ('static/noteNB/index.html', 'static/noteNB'), ('static/noteNB/logo.png', 'static/noteNB'), ('static/noteNB/assets/index-Bit0yig2.js', 'static/noteNB/assets'), ('static/noteNB/assets/index-C9wlhvwb.css', 'static/noteNB/assets'), ('static/md2pdf/index.html', 'static/md2pdf')],
    hiddenimports=['flask', 'werkzeug', 'jinja2', 'markupsafe', 'itsdangerous', 'click', 'blinker', 'markdown', 'playwright', 'playwright.sync_api', 'docx', 'lxml', 'lxml.etree', 'numpy', 'greenlet', 'cryptography', 'cffi', 'webbrowser', 'email', 'dateutil', 'six'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='工具1.0',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='工具1.0',
)
