---
id: azure-devops
title: Azure DevOps Fundamentals
icon: ♾️
subtitle: Learn Azure Boards, Pipelines, Repos, and Artifacts
category: Azure Cloud & DevOps
skills: Azure Compute, Azure Storage, Azure Networking
available: true
---

### Question 1
Difficulty: easy
What is the primary purpose of Azure Pipelines?
- [x] Continuous Integration and Continuous Delivery (CI/CD)
- [ ] Tracking work items and bugs
- [ ] Hosting Git repositories
- [ ] Managing private npm packages
> Hint: It automates the building, testing, and deployment of your code.
<!-- Source: https://learn.microsoft.com/en-us/shows/devops-fundamentals/ -->

### Question 2
Difficulty: easy
Which Azure DevOps service is used for agile project management and work tracking?
- [ ] Azure Test Plans
- [ ] Azure Artifacts
- [x] Azure Boards
- [ ] Azure Repos
> Hint: Think Kanban boards, sprints, and backlogs.
<!-- Source: https://learn.microsoft.com/en-us/shows/devops-fundamentals/ -->

### Question 3
Difficulty: easy
What type of version control systems does Azure Repos support?
- [ ] Only Git
- [ ] Only TFVC (Team Foundation Version Control)
- [x] Both Git and TFVC
- [ ] Subversion (SVN) and Git
> Hint: It supports both distributed and centralized Microsoft version control.
<!-- Source: https://learn.microsoft.com/en-us/shows/devops-fundamentals/ -->

### Question 4
Difficulty: medium
What format is primarily used to define Azure Pipelines as code?
- [ ] JSON
- [ ] XML
- [x] YAML
- [ ] TOML
> Hint: It's the most common human-readable data serialization language used for CI/CD configurations.
<!-- Source: https://learn.microsoft.com/en-us/shows/devops-fundamentals/ -->

### Question 5
Difficulty: medium
What is an Azure DevOps "Agent"?
- [x] Computing infrastructure that runs your pipeline jobs
- [ ] A project manager tracking progress
- [ ] A security scanner
- [ ] A billing entity
> Hint: It's the machine (Microsoft-hosted or self-hosted) that executes your build scripts.
<!-- Source: https://learn.microsoft.com/en-us/shows/devops-fundamentals/ -->

### Question 6
Difficulty: medium
Which service in Azure DevOps allows you to create, host, and share packages like npm, NuGet, and Maven?
- [ ] Azure Repos
- [ ] Azure Pipelines
- [x] Azure Artifacts
- [ ] Azure Container Registry
> Hint: Think of it as a private package manager repository.
<!-- Source: https://learn.microsoft.com/en-us/shows/devops-fundamentals/ -->

### Question 7
Difficulty: medium
What is a Pipeline "Stage" in Azure Pipelines?
- [ ] A specific build script command
- [x] A logical boundary in the pipeline (e.g., Build, Test, Deploy to Prod)
- [ ] A single virtual machine
- [ ] A code repository branch
> Hint: It's used to organize pipeline execution into phases, often requiring approvals to move between them.
<!-- Source: https://learn.microsoft.com/en-us/shows/devops-fundamentals/ -->

### Question 8
Difficulty: hard
What feature allows you to pause a pipeline execution until a human reviews and allows it to proceed?
- [ ] Agent Delays
- [ ] Pipeline Gates
- [x] Approvals and Checks
- [ ] Manual Triggers
> Hint: Typically configured on an Environment before deploying to Production.
<!-- Source: https://learn.microsoft.com/en-us/shows/devops-fundamentals/ -->

### Question 9
Difficulty: hard
Which of the following is NOT a native Work Item type in the default Agile process in Azure Boards?
- [ ] Epic
- [ ] Feature
- [ ] User Story
- [x] Sprint
> Hint: The first three represent work, whereas the fourth is a timebox (iteration).
<!-- Source: https://learn.microsoft.com/en-us/shows/devops-fundamentals/ -->

### Question 10
Difficulty: hard
How does Azure DevOps handle secrets and sensitive configuration values in Pipelines?
- [ ] Storing them in plain text in YAML
- [x] Using Pipeline Variable Groups linked to Azure Key Vault
- [ ] Emailing them to administrators
- [ ] Disabling secrets entirely
> Hint: It integrates with Azure's native cryptographic storage service.
<!-- Source: https://learn.microsoft.com/en-us/shows/devops-fundamentals/ -->
