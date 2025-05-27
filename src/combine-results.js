/**
 * Combine security scan and CodeQL results and post them as a comment on the issue.
 * 
 * @param {Object} github - GitHub API client
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} issue_number - Issue number
 * @param {string} codeql_run_link - Link to the CodeQL run
 * @param {Object} codeqlResult - Results from CodeQL analysis
 * @param {string} securityScanResult - Path to security scan results file
 * @param {Object} fs - File system module
 */
module.exports = async ({github, owner, repo, issue_number, codeql_run_link, codeqlResult, securityScanResult, fs}) => {
  console.log(`Combining results for issue ${issue_number} in repo ${owner}/${repo}`);
  
  // Read security scan results
  let securityScanContent = '';
  try {
    securityScanContent = fs.readFileSync(securityScanResult, 'utf8');
    console.log('Security scan results loaded successfully');
  } catch (error) {
    console.log(`Error reading security scan file: ${error}`);
    securityScanContent = 'Error reading security scan results.';
  }
  
  // Format CodeQL results
  let codeQLContent = '### CodeQL Analysis Results\n\n';
  codeQLContent += `* Run: [View CodeQL run](${codeql_run_link})\n`;
  codeQLContent += `* Scan completed at: ${codeqlResult.created_at || 'N/A'}\n`;
  codeQLContent += `* Issues found: ${codeqlResult.results_count || '0'}\n`;
  
  // If there were results, add them
  if (codeqlResult.results_count > 0) {
    codeQLContent += '\nSecurity issues were found. Review the CodeQL run for details.\n';
  } else {
    codeQLContent += '\nNo security issues were found by CodeQL.\n';
  }
  
  // Create combined comment body
  const commentBody = [
    '## Security Analysis Results\n',
    '### Security Scan Results\n',
    securityScanContent,
    '\n',
    codeQLContent,
    '\n',
    '---\n',
    'This report was automatically generated based on security checks of the requested action.'
  ].join('\n');
  
  console.log('Posting comment to issue');
  
  // Post comment to issue
  try {
    await github.rest.issues.createComment({
      owner,
      repo,
      issue_number,
      body: commentBody
    });
    console.log('Comment posted successfully');
  } catch (error) {
    console.log(`Error posting comment: ${error}`);
  }
  
  return true;
};