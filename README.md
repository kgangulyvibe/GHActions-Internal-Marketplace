# GitHub Actions - Internal Marketplace

Pre-requisites:
1. A GitHub Organization
2. A GitHub Repository

## Request for using a public GitHub Action

### Step 1. Opt in to fine-grained personal access tokens from the Organization

[Set a personal access token policy for your organization](https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-programmatic-access-to-your-organization/setting-a-personal-access-token-policy-for-your-organization)


### Step 2. Create a GitHub Token for the Organization

Follow the steps to create a [Fine-grained personal access token](https://docs.github.com/en/enterprise-cloud@latest/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token) and select the owner as the organization. The token will only be able to access resources owned by the selected resource owner. Organizations that you are a member of will not appear unless the organization opted in to fine-grained personal access tokens. 

Give **Read-Only** access to Secrets. Keep in mind the GITHUB_TOKEN name as you will need it in the next step.

![image](https://github.com/kcodeg123/GHActions-Internal-Marketplace/assets/3813135/3f9fe67a-fe2e-4c5d-83d1-e1debd8689b7)

### Step 3. Create a new organization secret

You can configure the level of access of the new secret but since we have only 

### Step 3. Create an issue on a repository for maintaining the requests

[issue-comment-tag](https://github.com/marketplace/actions/issue-comment-tag)

    on:
      issues:
        types: [opened]
        
    jobs:
      tag-a-user:
        runs-on: ubuntu-latest
        steps: 
          - uses: devops-actions/issue-comment-tag@v0.1.8
            name: Tag a user or team in an issue comment
            with: 
              issue: ${{ github.event.issue.number }}
              team: kcodeg123
              owner: ${{ github.repository_owner }}
              repo: ${{ github.repository }}
              GITHUB_TOKEN: ${{ secrets.GITHUBTOKEN }}

### Step 4. Edit the permissions of GITHUB_TOKEN

[Reference](https://docs.github.com/en/actions/security-guides/automatic-token-authentication).

Under the **Settings** tab of the repository, go to **Actions** > **General** and update the permissions granted to the **GITHUB_TOKEN** under Workflow permissions to **Read and write permissions**.  

![image](https://github.com/kcodeg123/GHActions-Internal-Marketplace/assets/3813135/fbab478f-f362-4dd1-916b-e82315edf900)
