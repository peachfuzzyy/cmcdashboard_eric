# CMC Markets — Account Manager Dashboard

Live market dashboard · Retail and institutional views · AI commentary

## Deploy on Vercel via GitHub

1. Create a new repo on GitHub named `cmc-dashboard`
2. Upload all these files maintaining the same folder structure
3. Go to vercel.com → Add New Project → Import from GitHub → select `cmc-dashboard`
4. In Vercel project settings → Environment Variables, add:
   ```
   ANTHROPIC_API_KEY = your_key_here
   ```
5. Redeploy — done

Every push to GitHub auto-deploys to Vercel.

## File structure
```
app/
  page.js              ← main page with tabs
  layout.js            ← HTML shell
  api/data/route.js    ← API route (Yahoo Finance + Anthropic)
  components/
    ui.js              ← shared components
    Retail.js          ← retail panel
    Insti.js           ← institutional panel
package.json
next.config.js
```
