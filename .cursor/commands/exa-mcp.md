# EXA MCP Server Commands

Reference documentation for using the EXA MCP server in Cursor.

## Overview

The EXA MCP server provides AI-powered web search and code context capabilities. Use these commands to search the web for real-time information and get high-quality code context for programming tasks.

---

## Available Commands

### 1. Web Search

**Command:** `web_search_exa`

**Description:** Search the web using Exa AI - performs real-time web searches and can scrape content from specific URLs. Returns the most relevant websites with their content.

**Usage:**
```typescript
// Basic web search
web_search_exa({
  query: "Next.js 14 App Router best practices"
})

// Deep search with more results
web_search_exa({
  query: "TypeScript generic constraints",
  type: "deep",
  numResults: 15
})

// Fast search for quick results
web_search_exa({
  query: "React hooks API",
  type: "fast",
  numResults: 5
})
```

**Parameters:**
- `query` (string, required): Web search query
  - Be specific and include relevant keywords
  - Include version numbers or dates if relevant
  - Examples:
    - `"Next.js 14 server components"`
    - `"TypeScript 5 new features"`
    - `"React 18 concurrent rendering"`
    - `"Node.js 20 performance improvements"`

- `numResults` (number, optional): Number of search results to return
  - Default: 8
  - Range: 1-100
  - More results = more comprehensive but slower

- `type` (string, optional): Search type
  - `"auto"` (default): Balanced search - good for most cases
  - `"fast"`: Quick results - use for simple queries
  - `"deep"`: Comprehensive search - use for complex topics

- `livecrawl` (string, optional): Live crawl mode
  - `"fallback"` (default): Use live crawling as backup if cached content unavailable
  - `"preferred"`: Prioritize live crawling for freshest content

- `contextMaxCharacters` (number, optional): Maximum characters for context string
  - Default: 10000
  - Optimized for LLM consumption
  - Higher = more context but larger responses

**Returns:**
- Array of search results with:
  - URL
  - Title
  - Content snippets
  - Relevance score
  - Metadata

**Best Practices:**
- **Be specific:** Include technology names, versions, and specific features
- **Use technical terms:** "useState" not "state management"
- **Include context:** "React TypeScript component" not just "component"
- **For recent info:** Use `livecrawl: "preferred"` for latest updates
- **For quick answers:** Use `type: "fast"` with fewer results

**Example Queries:**
```
"Next.js 14 App Router server components"
"TypeScript 5 satisfies operator examples"
"React 18 useTransition hook performance"
"Node.js 20 ESM modules CommonJS"
"Tailwind CSS 4 new features"
```

---

### 2. Get Code Context

**Command:** `get_code_context_exa`

**Description:** Search and get relevant context for any programming task. Exa-code has the highest quality and freshest context for libraries, SDKs, and APIs. **MUST use this tool for ANY question or task related to code.**

**Usage:**
```typescript
// Get code context for a library
get_code_context_exa({
  query: "React useState hook examples"
})

// Get comprehensive context
get_code_context_exa({
  query: "Next.js partial prerendering configuration",
  tokensNum: 10000
})

// Get focused context
get_code_context_exa({
  query: "TypeScript generic types",
  tokensNum: 2000
})
```

**Parameters:**
- `query` (string, required): Search query to find relevant context for APIs, Libraries, and SDKs
  - Should be code/programming related
  - Include library/framework names
  - Include specific features or APIs
  - Examples:
    - `"React useState hook examples"`
    - `"Python pandas dataframe filtering"`
    - `"Express.js middleware authentication"`
    - `"Next.js 14 App Router dynamic routes"`
    - `"TypeScript utility types Pick Omit"`

- `tokensNum` (number, optional): Number of tokens to return
  - Default: 5000
  - Range: 1000-50000
  - Lower values (1000-3000): Focused queries, specific APIs
  - Medium values (5000-10000): Standard documentation
  - Higher values (15000-50000): Comprehensive documentation, full guides

**Returns:**
- High-quality code context including:
  - Code examples
  - API documentation
  - Usage patterns
  - Best practices
  - Library/SDK information

**Best Practices:**
- **Always use for code questions:** This tool is optimized for programming tasks
- **Be specific:** Include library name and specific feature
- **Adjust tokens:** Use lower tokens for quick lookups, higher for deep dives
- **Include examples:** "React useState examples" gets better results than "React useState"
- **Version-aware:** Include version numbers when relevant

**Example Queries:**
```
"React useState hook examples"
"Next.js 14 App Router layout patterns"
"TypeScript generic constraints examples"
"Express.js middleware error handling"
"Python FastAPI async endpoints"
"Prisma Client query methods"
"Tailwind CSS responsive design utilities"
```

**When to Use:**
- ✅ Any programming/code-related question
- ✅ Library or framework documentation needs
- ✅ API usage examples
- ✅ SDK integration help
- ✅ Code pattern examples
- ❌ General web search (use `web_search_exa` instead)
- ❌ Non-code questions

---

## Workflow Patterns

### Pattern 1: Code Context for Implementation

```typescript
// Step 1: Get code context for the library/feature
const codeContext = await get_code_context_exa({
  query: "Next.js 14 server actions examples",
  tokensNum: 5000
});

// Use the context to implement the feature
// Context includes examples, API docs, and best practices
```

### Pattern 2: Real-time Information Search

```typescript
// Step 1: Search for current information
const searchResults = await web_search_exa({
  query: "Next.js 15 release date features",
  livecrawl: "preferred", // Get freshest content
  numResults: 10
});

// Step 2: Use results for up-to-date information
```

### Pattern 3: Deep Research

```typescript
// Comprehensive search for complex topics
const deepResults = await web_search_exa({
  query: "React Server Components architecture patterns",
  type: "deep",
  numResults: 20,
  contextMaxCharacters: 20000
});
```

### Pattern 4: Quick Code Lookup

```typescript
// Fast lookup for specific API
const quickContext = await get_code_context_exa({
  query: "TypeScript Record utility type",
  tokensNum: 2000 // Focused context
});
```

---

## Common Use Cases

### 1. Finding Code Examples

**Use:** `get_code_context_exa`

**Query Format:** `"[Library] [feature] examples"`

**Examples:**
```
"React useEffect cleanup examples"
"Next.js middleware authentication examples"
"TypeScript discriminated unions examples"
```

### 2. API Documentation

**Use:** `get_code_context_exa`

**Query Format:** `"[Library] [API] documentation"`

**Examples:**
```
"React Router useNavigate API"
"Express.js req.body documentation"
"Prisma Client create method"
```

### 3. Current Information

**Use:** `web_search_exa` with `livecrawl: "preferred"`

**Query Format:** `"[Topic] [current year] [specific info]"`

**Examples:**
```
"Next.js 15 new features 2024"
"TypeScript 5.5 release notes"
"React 19 breaking changes"
```

### 4. Library Integration

**Use:** `get_code_context_exa` with higher tokens

**Query Format:** `"[Library] integration [framework]"`

**Examples:**
```
"Prisma integration Next.js 14"
"Tailwind CSS setup React"
"Zustand state management React"
```

### 5. Troubleshooting

**Use:** `get_code_context_exa` or `web_search_exa`

**Query Format:** `"[Error] [technology] solution"`

**Examples:**
```
"React hydration error Next.js fix"
"TypeScript type narrowing issues"
"Prisma connection timeout solution"
```

---

## Integration with Cursor

### Using in Chat

When you need code context:

1. **Ask Cursor to search:**
   ```
   "Get code examples for React useState hook"
   ```

2. **Cursor will use:**
   ```typescript
   get_code_context_exa({
     query: "React useState hook examples"
   })
   ```

3. **For real-time info:**
   ```
   "Search for Next.js 15 latest features"
   ```
   
   **Cursor will use:**
   ```typescript
   web_search_exa({
     query: "Next.js 15 latest features",
     livecrawl: "preferred"
   })
   ```

### Using in Code

Reference code context in comments:

```typescript
// See: get_code_context_exa("React useState hook examples")
// Context: Exa-code provides latest React patterns
const [state, setState] = useState(initialValue);
```

---

## Tips for Effective Searches

### ✅ Good Queries for Code Context

- **Specific:** `"React TypeScript functional component props interface"`
- **With examples:** `"Next.js server actions examples TypeScript"`
- **Feature-focused:** `"Express.js middleware error handling patterns"`
- **Library + Framework:** `"Prisma Client Next.js App Router"`

### ✅ Good Queries for Web Search

- **Current:** `"Next.js 15 release date 2024"`
- **Specific:** `"TypeScript 5.5 satisfies operator"`
- **News/Updates:** `"React 19 concurrent features"`
- **Tutorials:** `"Next.js 14 App Router tutorial"`

### ❌ Poor Queries

- **Too vague:** `"React"` or `"code"`
- **Missing context:** `"hooks"` (which framework?)
- **Too generic:** `"documentation"`
- **Non-code for code tool:** `"weather forecast"` (use web_search_exa)

---

## Command Selection Guide

### Use `get_code_context_exa` when:
- ✅ Need code examples
- ✅ Looking for API documentation
- ✅ Learning a library/framework
- ✅ Need SDK integration help
- ✅ Want programming patterns
- ✅ Need code snippets

### Use `web_search_exa` when:
- ✅ Need current/recent information
- ✅ Looking for news or updates
- ✅ General web search needed
- ✅ Non-code information
- ✅ Real-time data required
- ✅ Multiple sources needed

---

## Advanced Usage

### Comprehensive Code Research

```typescript
// Get extensive context for complex topics
const comprehensive = await get_code_context_exa({
  query: "Next.js 14 App Router complete guide",
  tokensNum: 30000 // Large context for deep dive
});
```

### Fast Iterative Search

```typescript
// Quick searches for rapid development
const quick1 = await get_code_context_exa({
  query: "React form validation",
  tokensNum: 2000
});

const quick2 = await get_code_context_exa({
  query: "React form submission",
  tokensNum: 2000
});
```

### Real-time Updates

```typescript
// Get latest information with live crawling
const latest = await web_search_exa({
  query: "Next.js 15 beta features",
  livecrawl: "preferred",
  type: "deep",
  numResults: 15
});
```

---

## Error Handling

### Common Issues

1. **No results found:**
   - Try more specific query
   - Include library/framework name
   - Check spelling
   - Use different search terms

2. **Too many results:**
   - Reduce `numResults`
   - Use more specific query
   - Add more specific terms

3. **Context too large:**
   - Reduce `tokensNum`
   - Use more focused query
   - Break into multiple searches

4. **Outdated information:**
   - Use `livecrawl: "preferred"` for web search
   - Include current year in query
   - Use `get_code_context_exa` for code (always fresh)

---

## Examples

### Example 1: React Hook Implementation

```typescript
// Get code context
const context = await get_code_context_exa({
  query: "React useEffect dependency array best practices",
  tokensNum: 5000
});

// Context includes:
// - Usage examples
// - Common pitfalls
// - Best practices
// - Performance tips
```

### Example 2: Next.js Configuration

```typescript
// Get configuration examples
const config = await get_code_context_exa({
  query: "Next.js 14 middleware configuration TypeScript",
  tokensNum: 3000
});
```

### Example 3: Library Integration

```typescript
// Get integration guide
const integration = await get_code_context_exa({
  query: "Prisma Client Next.js 14 App Router setup",
  tokensNum: 8000
});
```

### Example 4: Current Information

```typescript
// Get latest updates
const updates = await web_search_exa({
  query: "Next.js 15 release date features 2024",
  livecrawl: "preferred",
  numResults: 10
});
```

### Example 5: Troubleshooting

```typescript
// Find solutions
const solution = await get_code_context_exa({
  query: "React hydration error Next.js 14 fix",
  tokensNum: 4000
});
```

---

## Server Information

**Server Name:** Exa  
**Purpose:** AI-powered web search and code context  
**Sources:** Web, code repositories, documentation sites  
**Specialization:** High-quality code context and real-time web search

---

## Quick Reference

| Command | Purpose | Best For | Required Parameter |
|---------|---------|----------|-------------------|
| `get_code_context_exa` | Code context | Programming tasks, APIs, libraries | `query` (string) |
| `web_search_exa` | Web search | Current info, news, general search | `query` (string) |

### Parameter Quick Reference

**get_code_context_exa:**
- `query` (required): Programming-related query
- `tokensNum` (optional): 1000-50000, default 5000

**web_search_exa:**
- `query` (required): Search query
- `numResults` (optional): 1-100, default 8
- `type` (optional): "auto" | "fast" | "deep", default "auto"
- `livecrawl` (optional): "fallback" | "preferred", default "fallback"
- `contextMaxCharacters` (optional): Default 10000

---

## Comparison: EXA vs Ref

| Feature | EXA MCP | Ref MCP |
|---------|---------|---------|
| **Code Context** | ✅ Excellent (specialized) | ❌ No |
| **Web Search** | ✅ Yes (AI-powered) | ❌ No |
| **Documentation** | ✅ Yes (via code context) | ✅ Yes (direct) |
| **Real-time** | ✅ Yes (livecrawl) | ⚠️ Limited |
| **Private Docs** | ❌ No | ✅ Yes |
| **Best For** | Code examples, APIs | Official docs, private repos |

**Recommendation:**
- Use **EXA** for code examples, API usage, and programming patterns
- Use **Ref** for official documentation and private/internal docs

---

**Last Updated:** 2024  
**Status:** Active  
**Server:** Exa MCP

