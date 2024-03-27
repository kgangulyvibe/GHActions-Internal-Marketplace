// This action will look at the issue body and find the action to run
// It will return the action name and owner
// It will also set the output variables for the next steps to use

// Inputs are provided by the workflow file when calling the action.
// - github: the github object
// - owner: the owner of the repository where the issue is located
// - repo: the repository name where the issue is located
// - issue_number: the issue number to look at
// - core: the core object which is used to set the output variables

// Outputs
// - result: 0 if action found, 1 if not found
// - action: the action to run
// - owner: the owner of the action
// - name: the name of the action

module.exports = async ({github, owner, repo, issue_number, core}) => { // we use async to make sure we can use await in the function body. The arguments are the inputs we need to run the action which are sent by the workflow file when calling the action
    // module.exports is used to export the function so it can be used in the workflow file when calling the action with the inputs
    // The function is async so we can use await in the function body
    // The function takes the inputs we need to run the action as arguments
  console.log(`Looking at this repository: [${owner}/${repo}]`)
  console.log(`Running with issue number [${issue_number}]`)

  // we always need these in the next steps:
  console.log(`::set-output name=request_owner::${owner}`)   
  console.log(`::set-output name=request_repo::${repo}`)
  console.log(`::set-output name=request_issue::${issue_number}`)

  if (issue_number == null || issue_number == undefined || issue_number == '') {
    core.setFailed('Issue_number not found')
    return
  }

  const issue = await github.rest.issues.get({
    owner: owner,
    repo: repo,
    issue_number: issue_number,
  }) // github.rest.issues.get is used to get the issue body from the repository. We use await to make sure we wait for the response before continuing
  
  console.log(`Issue body: [${JSON.stringify(issue.data.body)}]`)

  let split
  if (issue.data.body.indexOf('\r\n') > -1) {
    split = issue.data.body.split(/\r\n/) // issue.data.body.split(/\r\n/) is used to split the body of the issue by new lines. We use \r\n because it is the new line character in Windows
  }
  else {
    split = issue.data.body.split(/\n\n/) // issue.data.body.split(/\n\n/) is used to split the body of the issue by new lines. We use \n\n because it is the new line character in Unix
  }

  let action
  console.log(`After splitting the body we have [${split.length}] lines`)
  for (let i = 0; i < split.length; i++) {
    console.log(`Line [${i}] [${split[i]}]`)
    if (split[i].startsWith('uses: ')) {
      console.log(`Found uses statement!`)
        
      action = split[i].substring(6) // as an example "uses: actions/checkout@v2". we use substring(6) to get "actions/checkout@v2" because we know the length of "uses: " is 6
      let spaceIndex = action.indexOf(' ') // if there is a space, we need to cut off the action name, as an example "uses: actions/checkout@v2 with: {ref: 'refs/heads/feature-branch'}". we use indexOf(' ') to get the index of the first space and then use substring(0, spaceIndex) to get "actions/checkout@v2"
      if (spaceIndex > 0) {
        console.log(`Found space at char [${spaceIndex}], cutting of the action text before it`)
        action = action.substring(0, spaceIndex)       
      }
      console.log(`Found action with name [${action}]`)
      break
    }
  }

  let result
  if (action === null || action === undefined || action === '') {
    console.log('Action to use not found')
    core.setFailed('Action to use not found')
    result = 1
  }
  else {
    console.log('Action to use found')
    result = 0
  }

  // return action
  if (result === 0) {
    let index = action.indexOf('/') // We do action.indexOf('/') to find the first slash in the action name. This is to split the owner and the action name. For example, index = 7 for "actions/checkout@v2" and we use substring(0, 7) to get "actions" and substring(8) to get "checkout@v2"
    let actionOwner = action.substring(0, index)
    let actionNameWithVersion = action.substring(index + 1)

    // define the action without the version
    let actionName = actionNameWithVersion.split('@')[0]

    console.log(`Found owner:${actionOwner}`)
    console.log(`Found action:${actionName}`)

    console.log(`::set-output name=actionOwnerNameVersion::${action}`) // example of this output is actionRepo = "actions/checkout@v2"
    console.log(`::set-output name=actionOwner::${actionOwner}`) // example of this output is actionOwner = "actions"
    console.log(`::set-output name=actionName::${actionName}`) // example of this output is actionName = "checkout"
  }

  return { result, action } // example output of result: 0, action: "actions/checkout@v2"
}
