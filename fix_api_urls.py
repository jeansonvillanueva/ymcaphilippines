#!/usr/bin/env python3

filepath = r'C:\Users\Jeanson\yphilippines\frontend\src\hooks\useApi.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the API configuration
old_base = "const API_BASE = 'https://ymca.ph/php-api/index.php';"
new_base = "const API_BASE = 'https://ymca.ph/testsite/php-api/index.php';"
content = content.replace(old_base, new_base)

old_admin = "export const ADMIN_API_URL = `${API_BASE}?path=/n2r8k5j9m1`;"
new_admin = "export const ADMIN_API_URL = `${API_BASE}?path=/admin`;"
content = content.replace(old_admin, new_admin)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('File updated successfully')
