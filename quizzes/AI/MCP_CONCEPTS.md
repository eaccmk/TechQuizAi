---
id: mcp-concepts
title: MCP Fundamentals (v2)
icon: 🔌
subtitle: Master the Model Context Protocol, including the latest July 2026 v2 release
category: AI Foundations
skills: MCP, AI, LLM tools
available: true
---

### Question 1
Difficulty: easy
What does MCP stand for in the context of AI assistants?
- [x] Model Context Protocol
- [ ] Machine Computation Protocol
- [ ] Model Connection Process
- [ ] Multi-Context Parser
> Hint: It's an open standard that connects AI models to external tools and data sources.
<!-- Source: https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro -->

### Question 2
Difficulty: easy
What is the primary goal of the Model Context Protocol?
- [ ] To train faster LLMs
- [x] To standardize how AI models securely access external context (files, APIs, tools)
- [ ] To replace REST APIs entirely
- [ ] To generate images from text
> Hint: It acts like a "USB-C" port for AI applications.
<!-- Source: https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro -->

### Question 3
Difficulty: medium
What major architectural shift was introduced in MCP v2 release - July 2026 (7.28)?
- [ ] Moving from JSON to XML
- [ ] Requiring sticky sessions
- [x] Transitioning to a fully stateless protocol core
- [ ] Enforcing stateful WebSocket connections only
> Hint: This change allows MCP servers to easily run behind standard load balancers.
<!-- Source: https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro -->

### Question 4
Difficulty: medium
Are MCP v2 servers backward compatible with v1 clients?
- [ ] No, they are completely incompatible
- [x] Yes, the specification was designed with backward compatibility in mind
- [ ] Only for read-only operations
- [ ] Only if using the Python SDK
> Hint: The upgrade path was designed to avoid breaking existing implementations.
<!-- Source: https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro -->

### Question 5
Difficulty: medium
Which of the following is a new feature introduced in MCP v2?
- [ ] Basic Prompts
- [x] Multi Round-Trip Requests for interactive tools
- [ ] Local file reading only
- [ ] Synchronous single-threaded execution
> Hint: It enables tools that need back-and-forth interaction without long-lived sessions.
<!-- Source: https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro -->

### Question 6
Difficulty: medium
What new framework was formalized in the MCP v2 release to support new protocol features?
- [ ] The Middleware Framework
- [ ] The Authentication Framework
- [x] The Extensions Framework
- [ ] The Plugin Marketplace
> Hint: It provides a standard way to extend protocol capabilities over time.
<!-- Source: https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro -->

### Question 7
Difficulty: medium
In MCP terminology, what is a "Host"?
- [ ] The database storing the vectors
- [x] The application (like an IDE or chat interface) initiating the connection and utilizing the AI model
- [ ] The external API providing the data
- [ ] The physical server running the LLM
> Hint: Claude Desktop and AI IDEs act as this component.
<!-- Source: https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro -->

### Question 8
Difficulty: hard
Which capabilities graduated to official protocol extensions in the MCP v2 update?
- [ ] Image generation and audio parsing
- [x] Tasks & MCP Apps
- [ ] Vector search and RAG indexing
- [ ] Web scraping and browser automation
> Hint: These deal with executing background jobs and full application contexts.
<!-- Source: https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro -->

### Question 9
Difficulty: hard
What security policy was officially introduced in the July 2026 MCP v2 release?
- [ ] Required biometric authentication
- [ ] Mandatory end-to-end encryption for local processes
- [x] Authorization hardening and a formal 12-month deprecation policy
- [ ] Blocking all outbound internet access by default
> Hint: It focuses on lifecycle management and stricter auth rules.
<!-- Source: https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro -->

### Question 10
Difficulty: hard
How does the stateless nature of MCP v2 improve production deployments?
- [ ] It makes the protocol run faster on mobile devices
- [x] It eliminates the need for sticky sessions, simplifying horizontal scaling behind load balancers
- [ ] It reduces the size of the JSON payload by 50%
- [ ] It prevents the AI model from hallucinating
> Hint: Think about how HTTP scales compared to stateful protocols.
<!-- Source: https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro -->
