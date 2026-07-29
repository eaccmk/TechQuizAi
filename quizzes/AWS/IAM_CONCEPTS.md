---
id: iam-concepts
title: IAM Concepts
icon: 🔐
subtitle: Understand Identity and Access Management
category: AWS Fundamentals
available: true
---

### Question 1
Difficulty: easy
Which IAM entity is assigned to AWS services to grant permissions securely without hardcoding credentials?
- [ ] IAM User
- [ ] IAM Group
- [x] IAM Role
- [ ] Root User
> Hint: Used by EC2 instances or Lambda functions to assume permissions temporarily.
<!-- Source: https://aws.amazon.com/getting-started/cloud-essentials/ -->

### Question 2
Difficulty: easy
What is the recommended best practice for the AWS Root Account user?
- [ ] Use it for everyday administrative tasks
- [x] Enable MFA and lock it away, using IAM users/roles instead
- [ ] Share root credentials with all team members
- [ ] Delete the root account immediately
> Hint: Root has unrestricted access to everything in your AWS account.
<!-- Source: https://aws.amazon.com/getting-started/cloud-essentials/ -->

### Question 3
Difficulty: medium
What format are IAM policy documents written in?
- [ ] XML
- [ ] YAML
- [x] JSON
- [ ] TOML
> Hint: Key-value pairs containing Version, Statement, Effect, Action, Resource.
<!-- Source: https://aws.amazon.com/getting-started/cloud-essentials/ -->

### Question 4
Difficulty: medium
What does an explicit DENY in an IAM policy do when evaluated against an explicit ALLOW?
- [ ] ALLOW takes precedence over DENY
- [x] DENY overrides any ALLOW
- [ ] Both apply equally
- [ ] Causes an evaluation error
> Hint: In AWS IAM, an explicit DENY always wins.
<!-- Source: https://aws.amazon.com/getting-started/cloud-essentials/ -->

### Question 5
Difficulty: hard
Which IAM feature allows authentication via external identity providers like Google or Okta?
- [ ] IAM Access Analyzer
- [x] IAM Identity Center (SAML 2.0 / OIDC Federation)
- [ ] AWS KMS
- [ ] Amazon Cognito Sync
> Hint: Enables Single Sign-On (SSO) with enterprise identity systems.
<!-- Source: https://aws.amazon.com/getting-started/cloud-essentials/ -->

### Question 6
Difficulty: easy
What is the principle of least privilege in AWS IAM?
- [x] Granting only the permissions required to perform a specific task
- [ ] Giving all users Administrator access
- [ ] Allowing read-only access to everyone by default
- [ ] Restricting access to only the root user
> Hint: Give users exactly what they need, and nothing more.
<!-- Source: https://aws.amazon.com/getting-started/cloud-essentials/ -->

### Question 7
Difficulty: medium
What AWS service allows you to centrally manage access across multiple AWS accounts?
- [ ] IAM Access Analyzer
- [ ] AWS Shield
- [ ] Amazon GuardDuty
- [x] AWS Organizations (with IAM Identity Center)
> Hint: It helps you manage policies and billing across many accounts.
<!-- Source: https://aws.amazon.com/getting-started/cloud-essentials/ -->

### Question 8
Difficulty: medium
Which of the following can be used to add an extra layer of security for user logins?
- [ ] Root keys
- [ ] Password rotation
- [x] Multi-Factor Authentication (MFA)
- [ ] VPC Peering
> Hint: Requires a token from a device like a phone in addition to a password.
<!-- Source: https://aws.amazon.com/getting-started/cloud-essentials/ -->

### Question 9
Difficulty: hard
What is a permissions boundary in IAM?
- [x] An advanced feature that sets the maximum permissions that an identity-based policy can grant to an IAM entity
- [ ] A firewall rule that blocks IP addresses
- [ ] A limit on how much money an IAM user can spend
- [ ] A geographic restriction on where an IAM user can log in
> Hint: It acts as an upper limit on permissions, even if a policy allows more.
<!-- Source: https://aws.amazon.com/getting-started/cloud-essentials/ -->

### Question 10
Difficulty: hard
When evaluating an IAM policy, what happens if there is no explicit ALLOW or explicit DENY for an action?
- [ ] The action is explicitly allowed
- [x] The action is implicitly denied
- [ ] An error is thrown
- [ ] The action is allowed if the user is in the admin group
> Hint: AWS defaults to "no" unless specifically told "yes".
<!-- Source: https://aws.amazon.com/getting-started/cloud-essentials/ -->
