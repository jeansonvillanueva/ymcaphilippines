#!/usr/bin/env python3

filepath = r'C:\Users\Jeanson\yphilippines\frontend\src\hooks\useApi.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: Remove /testsite/ from API base
old_base = "const API_BASE = 'https://ymca.ph/testsite/php-api/index.php';"
new_base = "const API_BASE = 'https://ymca.ph/php-api/index.php';"
content = content.replace(old_base, new_base)

# Fix 2: Update admin path to use secure portal
old_admin = "export const ADMIN_API_URL = `${API_BASE}?path=/admin`;"
new_admin = "export const ADMIN_API_URL = `${API_BASE}?path=/secure-management/v3/k7n4m9p2q8c1x5j3/portal`;"
content = content.replace(old_admin, new_admin)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('✓ API configuration fixed:')
print('  - API base: https://ymca.ph/php-api/index.php')
print('  - Admin path: /secure-management/v3/k7n4m9p2q8c1x5j3/portal')
