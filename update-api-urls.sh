#!/bin/bash
# cPanel API URL Update Script
# Run this on your cPanel server via SSH after uploading files

echo "Updating API URLs in React build files..."
echo "Replace 'yourdomain.com' with your actual domain name"
echo ""

# Prompt for domain
read -p "Enter your domain (e.g., example.com): " domain

if [ -z "$domain" ]; then
    echo "Error: Domain cannot be empty"
    exit 1
fi

echo "Updating API URLs from Render to $domain/php-api..."

# Update API URLs in all JavaScript files
find /home/$(whoami)/public_html/assets/ -name "*.js" -type f -exec sed -i "s|https://ymcaph-backend.onrender.com|https://$domain/php-api|g" {} \;

# Also update any CSS files if needed
find /home/$(whoami)/public_html/assets/ -name "*.css" -type f -exec sed -i "s|https://ymcaph-backend.onrender.com|https://$domain/php-api|g" {} \;

echo "✅ API URLs updated successfully!"
echo ""
echo "Testing updated URLs..."
echo "Visit: https://$domain/php-api/test-db"
echo "Visit: https://$domain/api-test.html"
echo ""
echo "If you see 'Database is working!' then the API is connected."