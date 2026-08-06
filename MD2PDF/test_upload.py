import requests
import os

# Test data
test_md_content = """# 测试文档

这是一个测试 Markdown 文件。

## 功能特性

- 支持标题
- 支持列表
- 支持**加粗**和*斜体*

## 代码示例

```python
print("Hello, World!")
```

---

*Motorola 水印测试*
"""

# Save test file
test_file_path = "test_upload.md"
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
        if 'filename' in data:
            print(f"\n--- Testing download ---")
            download_url = f'http://localhost:5001/download/{data["filename"]}'
            print(f"Download URL: {download_url}")
            
            download_response = requests.get(download_url)
            print(f"Download response status: {download_response.status_code}")
            
            if download_response.status_code == 200:
                pdf_path = f'test_output_{data["original_name"]}.pdf'
                with open(pdf_path, 'wb') as f:
                    f.write(download_response.content)
                
                file_size = os.path.getsize(pdf_path)
                print(f"PDF downloaded successfully!")
                print(f"File: {pdf_path}")
                print(f"Size: {file_size} bytes")
                
                if file_size > 0:
                    print("\n✅ TEST PASSED: PDF was successfully generated and downloaded!")
                else:
                    print("\n❌ TEST FAILED: PDF file is empty!")
            else:
                print(f"\n❌ Download failed with status: {download_response.status_code}")
                if download_response.text:
                    print(f"Error: {download_response.text}")
        else:
            print(f"\n❌ Upload failed: {data.get('error', 'Unknown error')}")
    else:
        print(f"\n❌ Upload failed with status: {response.status_code}")
        
except Exception as e:
    print(f"\n❌ Test failed with exception: {e}")
    import traceback
    traceback.print_exc()
finally:
    if os.path.exists(test_file_path):
        os.remove(test_file_path)
        print(f"\nCleaned up test file: {test_file_path}")
