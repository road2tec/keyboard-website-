# How to Pull Changes (Client Guide)

If you are on top of the repository and want to get the latest changes from the GitHub repository:

## 1. Open Terminal
Open your VS Code terminal or Git Bash.

## 2. Check Status
Make sure you don't have uncommitted changes.
```bash
git status
```
If you have changes, stash them:
```bash
git stash
```

## 3. Pull Changes
Run the following command to pull the latest code from `main` branch:
```bash
git pull origin main
```

## 4. Re-install Dependencies (If needed)
If `package.json` was updated:
```bash
npm install
```

## 5. Restart Server
```bash
npm run dev
```

## Troubleshooting
- **Merge Conflicts**: If you see "CONFLICT", you need to manually fix the files in VS Code and then run:
  ```bash
  git add .
  git commit -m "Resolved conflicts"
  ```
