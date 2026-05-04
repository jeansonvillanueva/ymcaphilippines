# Admin Access - Quick Reference

## 🔐 Admin Portal URLs

### Login Page
```
https://ymca.ph/secure-management/v3/k7n4m9p2q8c1x5j3/portal/login
```

### Dashboard
```
https://ymca.ph/secure-management/v3/k7n4m9p2q8c1x5j3/portal/dashboard
```

---

## 📋 Quick Facts

| Aspect | Details |
|--------|---------|
| **Login URL** | `/secure-management/v3/k7n4m9p2q8c1x5j3/portal/login` |
| **Dashboard URL** | `/secure-management/v3/k7n4m9p2q8c1x5j3/portal/dashboard` |
| **Token Length** | 24 characters (k7n4m9p2q8c1x5j3) |
| **Total Path Length** | 47+ characters |
| **Security Layer** | Obscured routing (not sole defense) |
| **Requires** | Valid username & password + active session |
| **Session Storage** | HTTP-only cookies (backend) |
| **Default Session Timeout** | See backend configuration |

---

## ✅ Verification Checklist

- [ ] Login page loads at new URL
- [ ] Login with valid credentials works
- [ ] Dashboard displays after successful login
- [ ] Session persists across page reloads
- [ ] Logout redirects to login page
- [ ] Unauthorized users redirected to login
- [ ] Old `/admin` URLs no longer work (404)
- [ ] Browser developer tools show secure cookies

---

## 🚫 Outdated URLs

These URLs are **no longer valid:**
- ❌ `/admin/login`
- ❌ `/admin/dashboard`
- ❌ `/n2r8k5j9m1/login`
- ❌ `/n2r8k5j9m1/dashboard`

---

## 🔑 Important Reminders

1. **Never share this URL** in public channels, unencrypted emails, or version control
2. **Use strong passwords** - The obscured URL is only one layer of security
3. **Keep your browser secure** - Don't access from public/untrusted computers
4. **Report suspicious activity** - Alert IT if you see unauthorized login attempts
5. **Session timeout** - You may need to re-login after inactivity

---

## 🛠️ Troubleshooting

### Q: The login page won't load
- Check your internet connection
- Verify HTTPS is being used (not HTTP)
- Clear browser cache and cookies
- Try a different browser

### Q: I can't log in
- Verify your username and password are correct
- Check that CAPS LOCK is off
- Try resetting your password via admin support
- Check your session hasn't expired

### Q: I keep getting logged out
- The session timeout may be too short
- Contact admin/IT to adjust timeout settings
- Clear browser cookies and log in again
- Avoid switching browsers or devices during sessions

### Q: Where do I find the admin URL now?
- This file: `ADMIN_URL_SECURITY.md`
- Secure password manager (recommended)
- Ask your manager/admin for access

---

**Last Updated:** May 4, 2026
