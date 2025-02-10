# Git Command Guide

## Basic Git Commands (Single Branch)

### Initial Setup
```bash
git init                    # Initialize a new Git repository
git remote add origin URL   # Connect to remote repository
```

### Daily Workflow
```bash
git status                  # Check status of working directory
git add .                   # Stage all changes
git commit -m "message"     # Commit staged changes
git push origin main       # Push commits to remote
```

### Tags
```bash
git tag v1.0.0             # Create a tag
git push origin --tags     # Push tags to remote
```

### Pulling Changes
```bash
git pull origin main       # Pull latest changes from remote
```

## Working with Multiple Branches

### Branch Management
```bash
git branch                  # List all local branches
git branch -r              # List remote branches
git branch new-branch      # Create new branch
git checkout new-branch    # Switch to branch
git checkout -b new-branch # Create and switch to new branch
```

### Merging Branches

#### Option 1: Merge (Creates merge commit)
```bash
git checkout main          # Switch to main branch
git merge feature-branch   # Merge feature branch into main
git push origin main      # Push merged changes
```

#### Option 2: Rebase (Linear history)
```bash
git checkout feature-branch # Switch to feature branch
git rebase main            # Rebase feature branch onto main
git checkout main          # Switch back to main
git merge feature-branch   # Fast-forward main to feature branch
git push origin main      # Push changes
```

### Force Push (Use with caution!)
```bash
git push -f origin main    # Force push changes (overwrites remote history)
```

### Deleting Branches

#### Delete Local Branch
```bash
git branch -d branch-name  # Delete branch (if merged)
git branch -D branch-name  # Force delete branch (even if not merged)
```

#### Delete Remote Branch
```bash
git push origin --delete branch-name  # Delete remote branch
```

## Handling Divergent Branches

When local and remote branches diverge, Git offers three strategies:

1. **Merge** (creates merge commit):
```bash
git config pull.rebase false  # Set merge strategy
git pull origin main         # Pull and merge
```

2. **Rebase** (linear history):
```bash
git config pull.rebase true   # Set rebase strategy
git pull origin main         # Pull and rebase
```

3. **Fast-forward only** (no divergent changes):
```bash
git config pull.ff only      # Set fast-forward only
git pull origin main         # Pull (fails if not fast-forward)
```

## Best Practices

1. Always pull before pushing to avoid conflicts
2. Use meaningful commit messages
3. Create branches for new features/fixes
4. Delete branches after merging
5. Be careful with force push (-f) as it overwrites history
6. Regularly tag important versions
7. Keep main branch stable and deployable