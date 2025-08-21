const simpleGit = require('simple-git');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const git = simpleGit();

class GitService {
  constructor() {
    this.tempDir = path.join(__dirname, '../temp');
    this.ensureTempDir();
  }

  ensureTempDir() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirpSync(this.tempDir);
    }
  }

  async copyRepository(sourceUrl, destinationUrl, authorName = 'unisonary', authorEmail = 'unisonary@outlook.com') {
    const tempRepoPath = path.join(this.tempDir, `copy_${uuidv4()}`);
    
    try {
      console.log(`🚀 Starting repository copy...`);
      console.log(`📁 Source: ${sourceUrl}`);
      console.log(`📁 Destination: ${destinationUrl}`);
      console.log(`👤 New Author: ${authorName} <${authorEmail}>`);

      // Step 1: Clone source repository as working tree (not mirror)
      console.log(`📥 Step 1: Cloning source repository...`);
      await git.clone(sourceUrl, tempRepoPath, ['--recursive']);
      
      // Step 2: Change to temp directory
      const repoGit = simpleGit(tempRepoPath);
      
      // Step 3: Rewrite commit history
      console.log(`✏️ Step 2: Rewriting commit history...`);
      await this.rewriteHistory(repoGit, authorName, authorEmail);
      
      // Step 4: Modernize branch naming (master -> main)
      console.log(`🔄 Step 3: Modernizing branch names...`);
      await this.modernizeBranches(repoGit);
      
      // Step 5: Clean up and optimize
      console.log(`🧹 Step 4: Cleaning up repository...`);
      await repoGit.raw(['gc', '--aggressive', '--prune=now']);
      
      // Step 6: Update remote URL
      console.log(`🔗 Step 5: Updating remote URL...`);
      await repoGit.remote(['set-url', 'origin', destinationUrl]);
      
      // Step 7: Push to new repository
      console.log(`📤 Step 6: Pushing to new repository...`);
      await repoGit.push(['--all']);
      await repoGit.push(['--tags']);
      
      console.log(`✅ Repository successfully copied!`);
      
      return {
        success: true,
        message: 'Repository copied successfully',
        sourceUrl,
        destinationUrl,
        newAuthor: `${authorName} <${authorEmail}>`
      };
      
    } catch (error) {
      console.error('❌ Error during repository copy:', error);
      throw new Error(`Failed to copy repository: ${error.message}`);
    } finally {
      // Enhanced cleanup: Remove temporary repository directory
      await this.cleanupTempFiles(tempRepoPath);
      
      // Clean up main temp directory if it's empty
      await this.cleanupMainTempDir();
    }
  }

  async cleanupTempFiles(tempRepoPath) {
    try {
      if (fs.existsSync(tempRepoPath)) {
        await fs.remove(tempRepoPath);
        console.log(`🧹 Temporary repository directory cleaned up: ${path.basename(tempRepoPath)}`);
      }
    } catch (cleanupError) {
      console.warn(`⚠️ Warning: Could not clean up temporary directory: ${cleanupError.message}`);
    }
  }

  async cleanupMainTempDir() {
    try {
      if (fs.existsSync(this.tempDir)) {
        const contents = await fs.readdir(this.tempDir);
        if (contents.length === 0) {
          await fs.remove(this.tempDir);
          console.log(`🧹 Main temp directory cleaned up (was empty)`);
        } else {
          console.log(`📁 Main temp directory still contains ${contents.length} items`);
        }
      }
    } catch (cleanupError) {
      console.warn(`⚠️ Warning: Could not clean up main temp directory: ${cleanupError.message}`);
    }
  }

  async rewriteHistory(repoGit, authorName, authorEmail) {
    try {
      console.log(`🔄 Rewriting commit history for author: ${authorName} <${authorEmail}>`);
      
      // Get all branches
      const branches = await repoGit.branch();
      console.log(`📋 Found ${branches.all.length} branches: ${branches.all.join(', ')}`);
      
      // Rewrite all commits in all branches
      const filterScript = `
        export GIT_AUTHOR_NAME='${authorName}'
        export GIT_AUTHOR_EMAIL='${authorEmail}'
        export GIT_COMMITTER_NAME='${authorName}'
        export GIT_COMMITTER_EMAIL='${authorEmail}'
      `;
      
      console.log(`🔧 Applying author filter to all branches and tags...`);
      
      // Use git filter-branch to rewrite all commits
      await repoGit.raw([
        'filter-branch',
        '--env-filter', filterScript,
        '--tag-name-filter', 'cat',
        '--', '--branches', '--tags'
      ]);
      
      console.log(`✅ Commit history rewritten successfully`);
      
    } catch (error) {
      console.error('❌ Error rewriting history:', error.message);
      throw new Error(`Failed to rewrite commit history: ${error.message}`);
    }
  }

  async modernizeBranches(repoGit) {
    try {
      const branches = await repoGit.branch();
      
      if (branches.all.includes('master')) {
        console.log(`🔄 Renaming master branch to main...`);
        
        // Checkout master branch first
        await repoGit.checkout('master');
        
        // Rename master to main
        await repoGit.branch(['-m', 'master', 'main']);
        
        // Update HEAD reference if it was pointing to master
        const head = await repoGit.raw(['symbolic-ref', 'HEAD']);
        if (head.trim() === 'refs/heads/master') {
          await repoGit.raw(['symbolic-ref', 'HEAD', 'refs/heads/main']);
        }
        
        console.log(`✅ Master branch renamed to main successfully`);
      } else {
        console.log(`ℹ️ No master branch found, skipping branch modernization`);
      }
    } catch (error) {
      console.warn('⚠️ Warning: Could not modernize branches, continuing...', error.message);
    }
  }

  // Method to manually clean up all temporary files (can be called from API)
  async cleanupAllTempFiles() {
    try {
      if (fs.existsSync(this.tempDir)) {
        const contents = await fs.readdir(this.tempDir);
        console.log(`🧹 Cleaning up ${contents.length} temporary items...`);
        
        for (const item of contents) {
          const itemPath = path.join(this.tempDir, item);
          await fs.remove(itemPath);
          console.log(`🗑️ Removed: ${item}`);
        }
        
        // Remove the main temp directory
        await fs.remove(this.tempDir);
        console.log(`✅ All temporary files cleaned up successfully`);
        
        return { success: true, message: 'All temporary files cleaned up', itemsRemoved: contents.length };
      } else {
        console.log(`ℹ️ No temp directory found to clean up`);
        return { success: true, message: 'No temporary files to clean up' };
      }
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
      throw new Error(`Failed to clean up temporary files: ${error.message}`);
    }
  }
}

const gitService = new GitService();

module.exports = {
  copyRepository: (sourceUrl, destinationUrl, authorName, authorEmail) => 
    gitService.copyRepository(sourceUrl, destinationUrl, authorName, authorEmail),
  cleanupAllTempFiles: () => gitService.cleanupAllTempFiles()
};
