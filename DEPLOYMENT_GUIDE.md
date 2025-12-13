# 🚀 Deployment Guide - Vercel (Free Hosting)

Deploy your Digital Safety Hub to the internet for free in under 10 minutes.

---

## 📋 Prerequisites

- ✅ GitHub account (free)
- ✅ Vercel account (free)
- ✅ uClassify API key
- ✅ Your code working locally

---

## 🎯 Step-by-Step Deployment

### Step 1: Push to GitHub (3 minutes)

If not already done:

```bash
# Initialize git (if needed)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Digital Safety Hub"

# Create GitHub repo at: https://github.com/new
# Then connect and push:
git remote add origin https://github.com/YOUR-USERNAME/digital-safety-hub.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel (5 minutes)

1. **Go to:** https://vercel.com/signup
2. **Sign up** with GitHub (easiest)
3. **Click:** "Add New Project"
4. **Import** your `digital-safety-hub` repository
5. **Configure:**
   - Framework: Vite (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `./`

6. **Add Environment Variable:**
   - Key: `VITE_UCLASSIFY_API_KEY`
   - Value: `your_api_key_here`

7. **Click:** "Deploy"

8. **Wait 1-2 minutes** ⏳

9. **Done!** 🎉 Your URL: `https://digital-safety-hub.vercel.app`

---

## ✅ Verify Deployment

Test these URLs (replace with your actual domain):

1. **Home:** `https://your-app.vercel.app/`
2. **Education:** `https://your-app.vercel.app/education`
3. **Verify Evidence:** `https://your-app.vercel.app/hash`

**Test functionality:**
- ✅ Upload evidence
- ✅ Generate PDF
- ✅ Hash certificates download
- ✅ AI analysis works
- ✅ OCR extracts text
- ✅ Verification works

---

## 🔄 Automatic Updates

Every time you push to GitHub, Vercel automatically redeploys:

```bash
# Make changes locally
# Test with: npm run dev

# Commit and push
git add .
git commit -m "Updated feature"
git push

# Vercel automatically deploys! ✨
# Check status at: https://vercel.com/dashboard
```

---

## 🌍 Custom Domain (Optional)

### Using Vercel Subdomain (Free)
You automatically get: `your-project-name.vercel.app`

### Using Your Own Domain (~$10-15/year)

1. **Buy domain** from Namecheap, GoDaddy, etc.
2. **Vercel Dashboard** → Your Project → Settings → Domains
3. **Add domain:** `yourdomain.com`
4. **Follow DNS instructions** from Vercel
5. **Wait 5-30 minutes** for verification

---

## 🔐 Environment Variables

### Required Variable:
```
VITE_UCLASSIFY_API_KEY=your_api_key
```

### How to Update on Vercel:

1. **Vercel Dashboard** → Your Project
2. **Settings** → Environment Variables
3. **Add or Edit** variable
4. **Redeploy** (Settings → Deployments → Latest → ⋯ → Redeploy)

---

## 📊 Vercel Free Tier

What you get FREE:

| Feature | Free Tier |
|---------|-----------|
| Bandwidth | 100 GB/month |
| Build Minutes | 6,000/month |
| Deployments | Unlimited |
| Custom Domain | Yes |
| HTTPS/SSL | Automatic |
| Global CDN | Yes |
| Automatic Previews | Yes |

**More than enough for your use case!**

---

## 🛠️ Troubleshooting

### Build Fails

**Check build logs in Vercel:**
1. Dashboard → Your Project → Deployments
2. Click failed deployment
3. View logs

**Common fixes:**
- Ensure all dependencies in `package.json`
- Check for TypeScript/import errors
- Verify environment variables

### 404 Errors on Routes

**Fix:** The `vercel.json` file should already be configured:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

If missing, create this file in project root.

### API Not Working

**Check:**
- Environment variable `VITE_UCLASSIFY_API_KEY` is set
- Variable name starts with `VITE_` (required for Vite)
- Redeployed after adding variable
- API key is valid (test locally first)

---

## 📱 Mobile Testing

Your deployed app works perfectly on:
- ✅ iPhone (Safari)
- ✅ Android (Chrome)
- ✅ iPad/Tablets
- ✅ Desktop browsers

Test by visiting your Vercel URL on mobile devices.

---

## 🔍 Monitoring

### Vercel Analytics (Free)

Enable in Vercel Dashboard:
- Page views
- Unique visitors
- Top pages
- Performance metrics

### Check Deployment Status

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# List deployments
vercel list

# View logs
vercel logs
```

---

## 🎯 Post-Deployment Checklist

- [ ] All pages load correctly
- [ ] File upload works
- [ ] PDF generation works
- [ ] Hash certificates download
- [ ] AI analysis returns results
- [ ] OCR extracts text from screenshots
- [ ] Verification page works
- [ ] Mobile responsive
- [ ] HTTPS enabled (automatic)

---

## 🌟 Sharing Your App

Once deployed, share with:

- ✅ NGOs and advocacy groups
- ✅ Legal aid organizations  
- ✅ Women's rights groups
- ✅ Ethiopian Cyber Crime Unit
- ✅ Social workers
- ✅ Community organizations
- ✅ Social media (Twitter, Facebook)

**Example announcement:**
```
🛡️ Digital Safety Hub is now live!

A free tool to document digital abuse with:
✅ AI-powered threat detection
✅ Evidence verification (SHA-256 hashing)
✅ Legal PDF reports
✅ OCR text extraction

Try it: https://your-app.vercel.app

#DigitalSafety #CyberSecurity #Ethiopia
```

---

## 🔄 CI/CD Workflow

Your deployment workflow:

```
1. Code locally → npm run dev
2. Test changes
3. git commit -m "..."
4. git push
5. Vercel auto-builds
6. Vercel auto-deploys
7. Live in ~2 minutes! ✨
```

**No manual deployment needed!**

---

## 💰 Cost Breakdown

| Service | Cost |
|---------|------|
| Vercel Hosting | **FREE** |
| GitHub | **FREE** |
| uClassify API | **FREE** (1000 calls/day) |
| SSL Certificate | **FREE** (automatic) |
| Custom Domain | ~$10-15/year (optional) |

**Total Required: $0** 🎉

---

## 🎓 Advanced Options

### Multiple Environments

Create separate deployments for:
- Production: `main` branch
- Staging: `staging` branch
- Development: `dev` branch

Each gets its own URL automatically.

### Preview Deployments

Every pull request gets a preview URL:
- Test before merging
- Share with team
- Automatic cleanup

### Performance Optimization

Already included:
- ✅ Code splitting
- ✅ Asset optimization
- ✅ Caching headers
- ✅ Compression

---

## 📞 Support

### Vercel Resources
- Docs: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions
- Support: support@vercel.com

### Project Issues
- GitHub Issues
- Email: your@email.com

---

## 🎉 Success!

You now have:
- ✅ Live website accessible worldwide
- ✅ Professional URL with HTTPS
- ✅ Automatic updates on push
- ✅ Free hosting forever
- ✅ Global CDN (fast everywhere)
- ✅ Zero maintenance required

**Your Digital Safety Hub is helping people! 🌟**

---

**Made with 💚 for Digital Safety & Justice**
