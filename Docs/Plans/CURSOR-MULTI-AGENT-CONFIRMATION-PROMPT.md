# Cursor Multi-Agent Feature - Confirmation Prompt

**Purpose:** Get official clarification from Cursor documentation/support on how multi-agent actually works

---

## Prompt to Ask Cursor Support/Documentation

```
Hi Cursor team,

I'm trying to understand how the multi-agent feature works in Cursor 2.0. I've seen conflicting information and need clarification:

**Question 1: What is the actual multi-agent feature?**

Is multi-agent:
A) Role-based prompting where I use different prompts in the same chat to give the AI different "roles" (like "You are the Documentation Agent" vs "You are the Testing Agent"), but it's still one AI assistant switching roles?

OR

B) An actual multi-agent system where I can open multiple chat windows/sessions simultaneously, each with its own agent role, and they can work on different tasks in parallel?

**Question 2: If it's option B (multiple simultaneous agents):**

- How do I create/activate multiple agent sessions?
- Can they work on different files simultaneously?
- How do they coordinate/share context?
- Is there a specific UI feature or is it just multiple chat tabs?

**Question 3: Best practice for my use case:**

I have a project with:
- Phase 1: 9 sequential documentation tasks (updating markdown files)
- Phase 2: 6 implementation tasks (creating routes, wiring data, etc.)

Should I:
- Use role-based prompting (one agent, different roles per task)?
- Use multiple simultaneous chat sessions (if that's supported)?
- Or a combination?

**Question 4: Where can I find official documentation?**

I've checked cursor.com/docs but would like the official guide on:
- Multi-agent workflows
- Best practices for agent coordination
- Examples of multi-agent setups

Thank you for clarifying!
```

---

## Alternative: Check Documentation Directly

**URLs to check:**
- https://cursor.com/docs
- https://cursor.com/learn/agents
- https://cursor.com/changelog/2-0

**Search terms:**
- "multi-agent"
- "multiple agents"
- "agent coordination"
- "parallel agents"

---

## What We Need to Know

### Critical Questions:

1. **Is multi-agent a feature or a technique?**
   - Feature = Built-in UI/system for multiple agents
   - Technique = Using prompts to simulate multiple agents

2. **Can agents work simultaneously?**
   - Yes = Multiple chat tabs can work in parallel
   - No = One agent at a time, just different roles

3. **How do agents share context?**
   - Automatic = Cursor handles it
   - Manual = We need to coordinate via files/hand-offs

4. **What's the official recommendation?**
   - For documentation tasks (sequential)
   - For implementation tasks (can be parallel)

---

## Once We Get Confirmation

**Update these files:**
- `Docs/Plans/MULTI-AGENT-BLUEPRINT.md` - Adjust based on answer
- `Docs/Plans/QUICK-START-GUIDE.md` - Update workflow
- `Docs/AGENT-HANDOFF.md` - Adjust coordination method

---

**Status:** Waiting for Cursor confirmation  
**Next:** Use the prompt above to get official answer

