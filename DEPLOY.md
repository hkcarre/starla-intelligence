# Publishing STARLA to GitHub Pages

## Quick Setup (3 Minutes)

### Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `starla-intelligence`
3. Description: `STARLA Intelligence Platform - Starbucks EMEA RTD Analytics | Powered by OptiaData`
4. Select **Public**
5. Click **Create repository**

### Step 2: Push Code

Run these commands in PowerShell:

```powershell
cd "c:\Dev\starbucks\starla-platform"
git remote add origin https://github.com/YOUR_USERNAME/starla-intelligence.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to **Pages** in left sidebar
4. Under "Source", select **Deploy from a branch**
5. Branch: `main`, Folder: `/ (root)`
6. Click **Save**

### Step 4: Access Your Live Site

After ~1 minute, your site will be live at:

```
https://YOUR_USERNAME.github.io/starla-intelligence/
```

## Share with Colleagues

Send them anyone of these links:

- **Dashboard**: `https://YOUR_USERNAME.github.io/starla-intelligence/`
- **Monthly Commentary**: `https://YOUR_USERNAME.github.io/starla-intelligence/commentary.html`

---

## Alternative: Use hkcarre Account

Based on your previous projects, if using `hkcarre`:

```powershell
git remote add origin https://github.com/hkcarre/starla-intelligence.git
git branch -M main
git push -u origin main
```

Live URL: `https://hkcarre.github.io/starla-intelligence/`
