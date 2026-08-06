import requests
import os

# Test data
test_md_content = """# 测试文档

这是一个测试文件。

## 功能特性

- 支持标题
- 支持列表
- 支持**加粗**和*斜体*

---

*测试水印*
"""

# Test file
test_file_path = "打包测试.md"
with open(test_file_path, 'w', encoding='utf-8') as f:
    f.write(test_md_content)

print(f"Created test file: {test_file_path}")

# Test upload
try:
    print("\n--- Testing upload ---")
    with open(test_file_path, 'rb') as f:
        response = requests.post('http://localhost:5001/upload', files={'file': f})
    
    print(f"Upload response status: {response.status_code}")
    print(f"Upload response: {response.text}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\nOriginal name: {data['original_name']}")
        print(f"PDF filename: {data['filename']}")
        
        if 'filename' in data:
            print("\n--- Testing download ---")
            download_url = f'http://localhost:5001/download/{data["filename"]}'
            download_response = requests.get(download_url)
            
            if download_response.status_code == 200:
                pdf_path = f'test_output_{data["filename"]}'
                with open(pdf_path, 'wb') as f:
                    f.write(download_response.content)
                
                file_size = os.path.getsize(pdf_path)
                print(f"✅ PDF downloaded successfully!")
                print(f"File: {pdf_path}")
                print(f"Size: {file_size} bytes")
                
                expected_name = f"{data['original_name']}.pdf"
                actual_name = data['filename']
                
                if expected_name == actual_name:
                    print(f"\n✅ FILENAME MATCH: {expected_name}")
                else:
                    print(f"\n❌ FILENAME MISMATCH")
            else:
                print(f"\n❌ Download failed")
        else:
            print(f"\n❌ Upload failed")
    else:
        print(f"\n❌ Upload failed")
        
except Exception as e:
    print(f"\n❌ Test failed: {e}")
finally:
    if os.path.exists(test_file_path):
        os.remove(test_file_path)
        print(f"\nCleaned up test file: {test_file_path}")
