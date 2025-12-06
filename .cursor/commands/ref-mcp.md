# Ref MCP Server Commands

Reference documentation for using the Ref MCP server in Cursor.

## Overview

The Ref MCP server provides access to documentation search and reading capabilities. Use these commands to search for and read documentation from web sources, GitHub, and private resources.

---

## Available Commands

### 1. Search Documentation

**Command:** `ref_search_documentation`

**Description:** Search for documentation on the web, GitHub, or from private resources (repos and PDFs).

**Usage:**
```typescript
// Search public documentation
ref_search_documentation({
  query: "React useState hook examples"
})

// Search private documentation
ref_search_documentation({
  query: "internal API documentation ref_src=private"
})
```

**Parameters:**
- `query` (string, required): Documentation search query
  - Should include programming language and framework/library names
  - For private docs, include `ref_src=private` in the query
  - Examples:
    - `"React useState hook examples"`
    - `"Python pandas dataframe filtering"`
    - `"Express.js middleware"`
    - `"Next.js partial prerendering configuration"`
    - `"internal API docs ref_src=private"`

**Returns:**
- Array of documentation results with URLs and metadata
- Each result includes a URL that can be passed to `ref_read_url`

**Best Practices:**
- Be specific: Include language, framework, and specific feature names
- Use technical terms: "useState" not "state management"
- For private docs: Always include `ref_src=private` flag
- Combine terms: "React TypeScript component props"

**Example Queries:**
```
"TypeScript generic types constraints"
"Next.js 14 App Router server components"
"Tailwind CSS responsive design breakpoints"
"Node.js Express middleware authentication"
"React Hook Form validation schema"
"PostgreSQL Prisma schema relations"
```

---

### 2. Read URL Content

**Command:** `ref_read_url`

**Description:** Read the content of a URL as markdown. Use this to read the full content of URLs returned from `ref_search_documentation`.

**Usage:**
```typescript
// Read a URL from search results
ref_read_url({
  url: "https://react.dev/reference/react/useState#usestate"
})
```

**Parameters:**
- `url` (string, required): The EXACT URL from a `ref_search_documentation` result
  - Must include the full URL including any hash fragments (#)
  - Example: `"https://react.dev/reference/react/useState#usestate"`

**Returns:**
- Markdown-formatted content of the webpage
- Includes code examples, documentation text, and formatting

**Important Notes:**
- Always use the EXACT URL from search results (including #hash fragments)
- URLs are converted to markdown for easy reading
- Works with documentation sites, GitHub, and other web sources

---

## Workflow Patterns

### Pattern 1: Search and Read Documentation

```typescript
// Step 1: Search for documentation
const results = await ref_search_documentation({
  query: "React useEffect cleanup function"
});

// Step 2: Read the most relevant result
if (results.length > 0) {
  const content = await ref_read_url({
    url: results[0].url // Use exact URL from search result
  });
}
```

### Pattern 2: Private Documentation Search

```typescript
// Search private/internal documentation
const results = await ref_search_documentation({
  query: "API authentication flow ref_src=private"
});

// Read internal docs
if (results.length > 0) {
  const content = await ref_read_url({
    url: results[0].url
  });
}
```

### Pattern 3: Framework-Specific Search

```typescript
// Search for framework-specific documentation
const results = await ref_search_documentation({
  query: "Next.js 14 App Router dynamic routes"
});

// Read official documentation
const docs = await ref_read_url({
  url: results[0].url
});
```

---

## Common Use Cases

### 1. Finding API Documentation

**Query:** `"[Library Name] API reference [feature]"`

**Example:**
```
"React Router useNavigate hook API"
"Express.js req.body middleware"
"Prisma Client query methods"
```

### 2. Learning Framework Features

**Query:** `"[Framework] [version] [feature] examples"`

**Example:**
```
"Next.js 14 server actions examples"
"React 18 concurrent features"
"TypeScript 5 decorators"
```

### 3. Troubleshooting

**Query:** `"[Error message] [technology] solution"`

**Example:**
```
"React hydration error Next.js fix"
"TypeScript type narrowing issues"
"Prisma connection timeout error"
```

### 4. Best Practices

**Query:** `"[Technology] best practices [topic]"`

**Example:**
```
"React component composition best practices"
"TypeScript type safety patterns"
"Next.js performance optimization"
```

---

## Integration with Cursor

### Using in Chat

When you need documentation:

1. **Ask Cursor to search:**
   ```
   "Search for React useState documentation"
   ```

2. **Cursor will use:**
   ```typescript
   ref_search_documentation({
     query: "React useState documentation"
   })
   ```

3. **Then read the results:**
   ```typescript
   ref_read_url({
     url: "[exact URL from search]"
   })
   ```

### Using in Code

Reference documentation in code comments:

```typescript
// See: ref_search_documentation("React useState hook")
// Docs: https://react.dev/reference/react/useState
const [state, setState] = useState(initialValue);
```

---

## Tips for Effective Searches

### ✅ Good Queries

- **Specific:** `"React TypeScript functional component props interface"`
- **Version-aware:** `"Next.js 14 App Router layout patterns"`
- **Feature-focused:** `"Express.js middleware error handling"`
- **Language + Framework:** `"Python FastAPI async endpoints"`

### ❌ Poor Queries

- **Too vague:** `"React"`
- **Missing context:** `"hooks"` (which framework?)
- **Too generic:** `"documentation"`
- **Missing version:** `"Next.js routing"` (which version?)

---

## Error Handling

### Common Issues

1. **No results found:**
   - Try more specific query
   - Include framework/library name
   - Check spelling

2. **URL read fails:**
   - Ensure using exact URL from search results
   - Include hash fragments if present
   - URL may be inaccessible (private/restricted)

3. **Private docs not found:**
   - Ensure `ref_src=private` is in query
   - Verify private resources are configured
   - Check access permissions

---

## Examples

### Example 1: React Documentation

```typescript
// Search
const results = await ref_search_documentation({
  query: "React useEffect dependency array"
});

// Read
const docs = await ref_read_url({
  url: results[0].url
});
```

### Example 2: Next.js Configuration

```typescript
// Search
const results = await ref_search_documentation({
  query: "Next.js 14 middleware configuration"
});

// Read
const configDocs = await ref_read_url({
  url: results[0].url
});
```

### Example 3: TypeScript Types

```typescript
// Search
const results = await ref_search_documentation({
  query: "TypeScript utility types Pick Omit"
});

// Read
const typeDocs = await ref_read_url({
  url: results[0].url
});
```

---

## Server Information

**Server Name:** Ref  
**Purpose:** Documentation search and reading  
**Sources:** Web, GitHub, private repos, PDFs  
**Format:** Markdown output

---

## Quick Reference

| Command | Purpose | Required Parameter |
|---------|---------|-------------------|
| `ref_search_documentation` | Search docs | `query` (string) |
| `ref_read_url` | Read URL content | `url` (string) |

---

**Last Updated:** 2024  
**Status:** Active  
**Server:** Ref MCP

