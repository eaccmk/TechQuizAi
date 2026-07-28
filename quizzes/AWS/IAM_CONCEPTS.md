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

### Question 2
Difficulty: easy
What is the recommended best practice for the AWS Root Account user?
- [ ] Use it for everyday administrative tasks
- [x] Enable MFA and lock it away, using IAM users/roles instead
- [ ] Share root credentials with all team members
- [ ] Delete the root account immediately
> Hint: Root has unrestricted access to everything in your AWS account.

### Question 3
Difficulty: medium
What format are IAM policy documents written in?
- [ ] XML
- [ ] YAML
- [x] JSON
- [ ] TOML
> Hint: Key-value pairs containing Version, Statement, Effect, Action, Resource.

### Question 4
Difficulty: medium
What does an explicit DENY in an IAM policy do when evaluated against an explicit ALLOW?
- [ ] ALLOW takes precedence over DENY
- [x] DENY overrides any ALLOW
- [ ] Both apply equally
- [ ] Causes an evaluation error
> Hint: In AWS IAM, an explicit DENY always wins.

### Question 5
Difficulty: hard
Which IAM feature allows authentication via external identity providers like Google or Okta?
- [ ] IAM Access Analyzer
- [x] IAM Identity Center (SAML 2.0 / OIDC Federation)
- [ ] AWS KMS
- [ ] Amazon Cognito Sync
> Hint: Enables Single Sign-On (SSO) with enterprise identity systems.
