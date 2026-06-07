# GitHub + Vercel Deployment Workflow

This document defines the safe, branch-based deployment strategy for TaskTraQ.

---

## Branch Strategy

| Branch   | Purpose                                          | Deploys To       |
|----------|--------------------------------------------------|------------------|
| `main`   | Stable production code. Only merge tested changes. | Vercel Production |
| `develop`| Active development. All new features, fixes, and Lovable updates. | Vercel Preview |

**Rule:** Never push directly to `main`. All changes reach `main` only through a Pull Request from `develop`.

---

## Step-by-Step: Configure the Workflow

### 1. Create the `develop` branch on GitHub

Since Lovable already syncs to GitHub, create the branch from the current `main`:

```bash
# Clone your repo locally (or use GitHub web UI)
git clone https://github.com/<your-username>/tasktraq.git
cd tasktraq
git checkout -b develop
git push -u origin develop
```

Alternatively, use the GitHub web interface:
1. Go to your repository on GitHub
2. Click the branch selector dropdown (currently showing `main`)
3. Type `develop` and click **Create branch: develop from 'main'**

---

### 2. Configure Lovable to push to `develop`

Lovable syncs changes to GitHub in real time. You must tell Lovable to target the `develop` branch instead of `main`.

1. In the Lovable editor, open your **Project Settings**
2. Go to **GitHub integration settings**
3. Change the default sync branch from `main` to `develop`

> If you do not see a branch selector, enable **GitHub Branch Switching** from your Lovable Account Settings > Labs.

Once configured, every change you make in the Lovable editor will be committed to `develop`.

---

### 3. Configure Vercel for branch-based deployments

1. Go to [vercel.com](https://vercel.com) and open your TaskTraQ project dashboard
2. Navigate to **Settings → Git**
3. Under **Production Branch**, ensure it is set to **`main`**
4. Under **Preview Branches**, enable deployments for `develop` (or all branches)
5. Save settings

**Result:**
- Every push to `main` triggers a **Production** deployment
- Every push to `develop` triggers a **Preview** deployment
- You get a unique preview URL for every `develop` commit to test safely

---

### 4. Protect the `main` branch on GitHub

Prevent accidental direct pushes to `main`:

1. On GitHub, go to **Settings → Branches**
2. Click **Add branch protection rule**
3. Branch name pattern: `main`
4. Enable the following:
   - **Require a pull request before merging**
   - **Require approvals** (set to at least 1)
   - **Require status checks to pass** (select the `CI / Build & Typecheck` workflow)
   - **Restrict pushes that create files larger than 100MB**
   - **Require linear history** (optional, keeps history clean)
5. Save

---

## Daily Development Flow

### Making changes

1. Edit your project in the **Lovable editor**
2. Lovable auto-commits to the `develop` branch on GitHub
3. Vercel builds a **Preview** deployment from `develop`
4. Open the preview URL to test your changes live

### Merging to production

When you are ready to ship tested changes:

1. On GitHub, go to **Pull requests → New pull request**
2. Base: `main` ← Compare: `develop`
3. Review the diff, add a clear title and description
4. Ensure the **CI checks pass** (build + typecheck + lint)
5. Click **Merge pull request**
6. Choose **Create a merge commit** or **Squash and merge**
7. Vercel automatically deploys `main` to **Production**

---

## Emergency Rollback

If a bad deployment reaches production:

1. On GitHub, go to **Commits** on the `main` branch
2. Find the last known good commit
3. Click the **...** menu → **Revert this commit** (creates a new PR)
4. Merge the revert PR
5. Vercel redeploys the stable `main` immediately

---

## CI / Automated Checks

This repository includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that runs on every PR to `main` and every push to `develop` or `main`:

- TypeScript typecheck
- ESLint
- Production build

The build must pass before any PR can merge into `main`.

---

## Summary Checklist

- [ ] `develop` branch exists on GitHub
- [ ] Lovable is configured to sync to `develop`
- [ ] Vercel production branch is set to `main`
- [ ] Vercel preview deployments are enabled for `develop`
- [ ] GitHub branch protection is enabled for `main`
- [ ] CI workflow is passing
