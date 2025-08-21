#!/bin/bash

# =============================================================================
# Git Repository Copier Tool
# =============================================================================
# 
# This script copies Git repositories while rewriting all commit history
# to change authors and automatically modernizing branch names.
#
# Usage: ./git-copier.sh <source_url> <new_url>
# Example: ./git-copier.sh https://github.com/user/repo.git https://github.com/unisonary/newrepo.git
#
# Author: unisonary
# License: MIT
# =============================================================================

set -e  # Exit on any error

# =============================================================================
# Configuration & Constants
# =============================================================================

# Color codes for output formatting
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly RED='\033[0;31m'
readonly NC='\033[0m'  # No Color

# Default author information
readonly DEFAULT_AUTHOR="unisonary"
readonly DEFAULT_EMAIL="unisonary@outlook.com"

# =============================================================================
# Utility Functions
# =============================================================================

print_status() { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# =============================================================================
# Input Validation & Setup
# =============================================================================

# Validate command line arguments
if [ $# -ne 2 ]; then
    echo "Usage: $0 <source_repo_url> <new_repo_url>"
    echo "Example: $0 https://github.com/user/repo.git https://github.com/unisonary/newrepo.git"
    echo "Note: Master branches will be automatically renamed to 'main'"
    exit 1
fi

# Set repository URLs
readonly SOURCE_REPO="$1"
readonly NEW_REPO="$2"

# Generate unique temporary directory name
readonly TEMP_DIR="temp_copy_$(date +%s)"

# Set author information (can be customized)
readonly NEW_AUTHOR="${DEFAULT_AUTHOR}"
readonly NEW_EMAIL="${DEFAULT_EMAIL}"

# =============================================================================
# Main Execution
# =============================================================================

# Display operation summary
print_status "Starting repository copy..."
print_status "Source: $SOURCE_REPO"
print_status "Destination: $NEW_REPO"
print_status "New Author: $NEW_AUTHOR <$NEW_EMAIL>"

# Verify Git is available
if ! command -v git &> /dev/null; then
    print_error "Git not found. Please install Git first."
    exit 1
fi

# Step 1: Clone source repository
print_status "Step 1: Cloning source repository..."
git clone --mirror "$SOURCE_REPO" "$TEMP_DIR"
cd "$TEMP_DIR"

# Step 2: Rewrite commit history
print_status "Step 2: Rewriting commit history..."
git filter-branch --env-filter "
    export GIT_AUTHOR_NAME='$NEW_AUTHOR'
    export GIT_AUTHOR_EMAIL='$NEW_EMAIL'
    export GIT_COMMITTER_NAME='$NEW_AUTHOR'
    export GIT_COMMITTER_EMAIL='$NEW_EMAIL'
" --tag-name-filter cat -- --branches --tags

# Step 2.5: Modernize branch naming (master -> main)
if git show-ref --verify --quiet refs/heads/master; then
    print_status "Renaming master branch to main..."
    git branch -m master main
fi

# Step 3: Clean up and optimize repository
print_status "Step 3: Cleaning up repository..."
git for-each-ref --format="%(refname)" refs/original/ | xargs -n 1 git update-ref -d 2>/dev/null || true
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Step 4: Update remote URL
print_status "Step 4: Updating remote URL..."
git remote set-url origin "$NEW_REPO"

# Step 5: Push to destination repository
print_status "Step 5: Pushing to new repository..."
print_warning "You may need to authenticate with your git provider."
echo "Make sure you have created the destination repository."
echo ""

# Auto-confirm push for non-interactive use
echo "Auto-confirming push..."
git push --mirror
print_status "✅ Repository successfully copied!"

# =============================================================================
# Finalization & Cleanup
# =============================================================================

# Return to original directory
cd ..

# Auto-cleanup temporary directory
print_status "Cleaning up temporary files..."
if [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
    print_status "✅ Temporary directory '$TEMP_DIR' removed"
else
    print_warning "Temporary directory '$TEMP_DIR' not found for cleanup"
fi

# Final success message
print_status "Repository copy completed successfully!"
print_status "🎉 All done! Your repository has been copied and cleaned up."
