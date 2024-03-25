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

### Step 5. Ensure your GitHub notification are ON

To get notifications, ensure that your settings are updated to accept notifications.

When on the GitHub page, on the top right, click on your profile and select **Settings**. Go to **Notifications** and update **Participating, @mentions and custom** to notify you via GitHub and/or Email.

![image](https://github.com/kcodeg123/GHActions-Internal-Marketplace/assets/3813135/c4ceeb61-a0ac-4056-8271-8226dc41bf2b)

### Step 6. Create a new issue template

Create a new issue template for the repository to maintain the requests. 

The `.github/issue_template/request-new-action.yml` file is a GitHub issue template. This file will be used to create a structured format for new issues that are opened in your repository. This helps maintain consistency and clarity in the issues that are created.

Follow these steps to add code to the issue template:

1. Open the `.github/issue_template/request-new-action.yml` file in your repository. If the file doesn't exist, create it.

2. Add the following code to the file.

```yml
name: Request new action
description: Request new action to be added to the internal marketplace
title: "New action request: <name of action here>"
assignees:
  - rajbos
body:
  - type: markdown
    attributes:
      value: |
        Thanks you for your request. We need some information before we can proceed.
        After that, the request will be reviewed including an security assesment. Process tracking will happen inside this issue.

        Please tag '@-username' or '@-teamname' to notifiy them in comments.
  - type: input
    id: action_name
    attributes:
      label: Action name
      description: The name of the action you want to request in the format owner/repository
      placeholder: "uses: devops-actions/issue-comment-tag"
    validations:
      required: true
  - type: textarea
    id: reason
    attributes:
      label: Reasons
      description: Why do you want to request this action?
      render: shell
  - type: textarea
    id: usage
    attributes:
      label: Intended usage
      description: Describe the intended use of the action you want to request, include example repositories if you can.
      render: markdown
  - type: checkboxes
    id: duplication
    attributes:
      label: I have checked the internal marketplace for similar actions and couldn't find one that works for us.
      options:
        - label: I have checked the internal marketplace first
          required: true
```

The above code defines the structure of the issue template. It includes the name, description, title, assignees, and body of the issue. The body includes input fields for the action name, reasons for the request, intended usage, and a checkbox to confirm that the internal marketplace has been checked for similar actions. You can customize the template further by adding more fields or modifying the existing ones to suit your needs.

3. Save the file and commit the changes to your repository.

After you've added the code to the issue template, whenever a new issue is created in your repository, the creator will have the option to use this template. The issue will then follow the structure defined in the template, making it easier for others to understand and respond to the issue.

Remember to always review the issues created in your repository and respond appropriately.

### Step 7. Create a new issue

The steps to create a new issue are as follows:

1. Go to the issues tab in your repository.
2. Click on the "New issue" button.
3. Select the "Request new action" template from the list of templates.
4. Fill in the required information in the issue template.
5. Click on the "Submit new issue" button to create the issue.

The issue will be created with the structured format defined in the template, making it easier for the request to be reviewed and processed.

### Step 8. Review and process the request