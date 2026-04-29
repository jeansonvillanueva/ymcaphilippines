# FACILITY INFORMATION - QUICK FIX GUIDE

## The Problem
Your **Facility Information form** doesn't save because the **database tables are missing**.

## The Fix (Choose 1 Option)

### 🟢 OPTION 1: PHPMyAdmin (EASIEST - 2 minutes)

1. Go to cPanel → PHPMyAdmin
2. Click "SQL" tab
3. Copy-paste this code below
4. Click "Go"
5. ✅ Done!

```sql
CREATE TABLE IF NOT EXISTS `facilities` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `local_id` varchar(100) NOT NULL,
  `buildings` varchar(255) DEFAULT NULL,
  `buildings_pillar_id` int DEFAULT NULL,
  `room_accommodations` varchar(255) DEFAULT NULL,
  `room_accommodations_pillar_id` int DEFAULT NULL,
  `basketball_court` varchar(255) DEFAULT NULL,
  `basketball_court_pillar_id` int DEFAULT NULL,
  `swimming_pool` varchar(255) DEFAULT NULL,
  `swimming_pool_pillar_id` int DEFAULT NULL,
  `fitness_gym` varchar(255) DEFAULT NULL,
  `fitness_gym_pillar_id` int DEFAULT NULL,
  `function_hall` varchar(255) DEFAULT NULL,
  `function_hall_pillar_id` int DEFAULT NULL,
  `badminton_court` varchar(255) DEFAULT NULL,
  `badminton_court_pillar_id` int DEFAULT NULL,
  `tennis_court` varchar(255) DEFAULT NULL,
  `tennis_court_pillar_id` int DEFAULT NULL,
  `martial_arts` varchar(255) DEFAULT NULL,
  `martial_arts_pillar_id` int DEFAULT NULL,
  `spaces` varchar(255) DEFAULT NULL,
  `spaces_pillar_id` int DEFAULT NULL,
  `other_facilities` varchar(255) DEFAULT NULL,
  `other_facilities_pillar_id` int DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_local_facilities (local_id),
  INDEX idx_local_id (local_id),
  CONSTRAINT fk_facilities_local FOREIGN KEY (local_id) REFERENCES `local`(local_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `facilities_images` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `local_id` varchar(100) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `image_order` int DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_local_id (local_id),
  CONSTRAINT fk_facilities_images_local FOREIGN KEY (local_id) REFERENCES `local`(local_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

---

### 🟡 OPTION 2: SQL File (2 minutes)

Use the file: **ADD_FACILITIES_TABLES.sql**

Steps:
1. In PHPMyAdmin, click "Import" tab
2. Choose the SQL file
3. Click "Go"

---

### 🟠 OPTION 3: PHP Setup Script (1 minute)

1. Upload: **php-api/setup-facilities.php** to your server
2. Visit in browser: `https://yourdomain.com/testsite/php-api/setup-facilities.php`
3. Done! ✅

---

## Test It Works

1. Go to admin panel
2. Click "Find Your YMCA" tab
3. Select a local
4. Add facility details
5. Click "Save"
6. Refresh page → Data should be there! ✅

---

## Still Not Working?

- Clear browser cache (Ctrl+F5)
- Log out and log back in
- Check admin console for errors (F12)
- See: **FACILITIES_DATABASE_SETUP.md** for troubleshooting

---

## Files Provided

- ✅ **FACILITIES_DATABASE_SETUP.md** - Full documentation
- ✅ **FACILITIES_FIX_SUMMARY.md** - Technical details
- ✅ **database-schema.sql** - Updated schema
- ✅ **ADD_FACILITIES_TABLES.sql** - SQL migration
- ✅ **php-api/setup-facilities.php** - PHP setup script

---

**That's it! Pick one option above and you're done.** 🎉
