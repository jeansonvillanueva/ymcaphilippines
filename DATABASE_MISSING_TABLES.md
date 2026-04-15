# 🚨 CRITICAL: Database Tables Missing

## Issue
The `local` table doesn't exist in your `ymcaph_db` database. The admin system cannot work without this.

---

## 🔧 Two Options to Create Tables

### **Option 1: Using the Automatic Database Initializer (RECOMMENDED)**

#### Step 1: Check Status
```
https://ymca.ph/testsite/php-api/database-init
```

Should show JSON like:
```json
{
  "status": "Database Schema Check",
  "table_status": {
    "local": false,
    "local_pillars": false,
    "local_programs": false,
    "local_programs_bullets": false
  },
  "action_needed": "CREATE_TABLES",
  "next_step": "Visit: ?action=create to create all missing tables"
}
```

#### Step 2: Create All Tables
```
https://ymca.ph/testsite/php-api/database-init?action=create
```

Should show JSON like:
```json
{
  "status": "SUCCESS: All tables created",
  "all_tables_created": {
    "local": true,
    "local_pillars": true,
    "local_programs": true,
    "local_programs_bullets": true
  }
}
```

**If successful, you're done! Proceed to testing.**

---

### **Option 2: Using cPanel phpMyAdmin (MANUAL)**

#### Step 1: Login to phpMyAdmin
1. Go to cPanel → phpMyAdmin
2. Select database `ymcaph_db`

#### Step 2: Run SQL
1. Click **SQL** tab
2. Copy entire SQL from `database-schema.sql`
3. Paste into the SQL editor
4. Click **Go**

#### Step 3: Verify
Tables should now exist:
- ✅ `local`
- ✅ `local_pillars`
- ✅ `local_programs`
- ✅ `local_programs_bullets`

---

## ✅ After Creating Tables

### Upload These Files First
- ✅ `index.php` (updated with database-init route)
- ✅ `diagnose.php` (fixed to handle missing tables)
- ✅ `database-init.php` (NEW - table creation tool)
- ✅ `utils.php` (data parsing)
- ✅ `admin_locals_update.php` (logging)
- ✅ `test-data-receipt.php` (diagnostic)
- ✅ Frontend build files

### Test Steps

**Step 1: Verify Tables Created**
```
https://ymca.ph/testsite/php-api/database-init
```
Should show all tables = true

**Step 2: Run Diagnostic**
```
https://ymca.ph/testsite/php-api/diagnose
```
Should show database connected, tables exist, etc.

**Step 3: Test Admin Panel**
```
https://ymca.ph/testsite/admin
```
1. Go to "Find Your YMCA"
2. Try to select a local
3. If no locals appear, database is empty (normal - add some)

---

## 💡 What the Tables Do

| Table | Purpose |
|-------|---------|
| `local` | YMCA local information (name, member counts, etc.) |
| `local_pillars` | The 4 YMCA pillars (Community, Work, Planet, World) |
| `local_programs` | Programs under each pillar |
| `local_programs_bullets` | Bullet points for each program |

---

## 🚀 Quick Steps Summary

1. **Upload** `index.php`, `diagnose.php`, `database-init.php`, `utils.php`, `admin_locals_update.php`, `test-data-receipt.php`, and frontend build
2. **Visit** `https://ymca.ph/testsite/php-api/database-init?action=create`
3. **Verify** tables show as `true` in response
4. **Test admin** at `https://ymca.ph/testsite/admin`

That's it! ✅

---

## 📞 If Tables Won't Create

### Check Connection
Visit: `https://ymca.ph/testsite/php-api/diagnose`
- If `"connected": false` → Database credentials wrong in config.php

### Check Permissions
User `ymcaph_user` needs:
- CREATE permission
- ALTER permission
- REFERENCES permission (for foreign keys)

Go to cPanel → Databases → MySQL Databases and check user permissions.

### Manual SQL Import
If automatic fails, use phpMyAdmin:
1. Get SQL from `database-schema.sql` in workspace
2. Open cPanel → phpMyAdmin
3. Select `ymcaph_db`
4. Paste SQL and execute

---

**Next:** Upload files and create tables, then test! 🚀
