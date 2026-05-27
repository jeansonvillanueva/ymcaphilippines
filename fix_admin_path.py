#!/usr/bin/env python3

filepath = r'C:\Users\Jeanson\yphilippines\frontend\src\hooks\useApi.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the admin API path with the secure portal path
old_admin = 'export const ADMIN_API_URL = `${API_BASE}?path=/admin`;'
new_admin = 'export const ADMIN_API_URL = `${API_BASE}?path=/secure-management/v3/k7n4m9p2q8c1x5j3/portal`;'
content = content.replace(old_admin, new_admin)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('Admin API URL updated to use secure portal path')
