# Baseline Browser Mapping Warning

## The Warning

You may see this warning during builds:

```
[baseline-browser-mapping] The data in this module is over two months old.  
To ensure accurate Baseline data, please update: `npm i baseline-browser-mapping@latest -D`
```

## What It Means

This is an **informational warning** from Next.js/Turbopack. It indicates that the browser compatibility data inside the `baseline-browser-mapping` package is stale, even though the package version itself is up-to-date.

## Is It a Problem?

**No.** This warning is harmless and does not affect:
- Build functionality
- Application runtime
- Browser compatibility checks
- Production deployments

## Why It Happens

The `baseline-browser-mapping` package contains browser compatibility data that gets updated periodically by the package maintainers. The warning appears when:
1. The package version is latest (✅ we have this)
2. But the data inside the package is older than 2 months

This is a limitation of how the package is structured - the data and version are separate.

## How to Update

If you want to refresh the data (though it won't necessarily fix the warning if the maintainers haven't updated it):

```bash
npm run update:baseline
```

Or manually:

```bash
npm install baseline-browser-mapping@latest --save-dev
```

## Permanent Solution

**Update Next.js to 16.0.6 or later.** This version includes a fix (PR #86625) that addresses the warning issue. The warning was caused by Next.js checking the data age incorrectly.

**Current Status:**
- ✅ Next.js updated to 16.0.7 (includes the fix)
- ✅ Warning should no longer appear

If you're still seeing the warning after updating Next.js:
- The warning is informational and harmless
- It doesn't affect build functionality or runtime
- The package maintainers are working on making this warning optional (see [issue #105](https://github.com/web-platform-dx/baseline-browser-mapping/issues/105))

## Recommendation

**If on Next.js 16.0.6+:** The warning should be resolved. If it still appears, it's harmless and can be ignored.

**If on older Next.js versions:** Update to 16.0.6 or later to resolve the warning.

## Related

- Package: `baseline-browser-mapping@^2.9.0`
- Next.js: `16.0.7` (includes fix for this warning)
- Update script: `npm run update:baseline`
- Next.js fix: [PR #86625](https://github.com/vercel/next.js/pull/86625)
- GitHub discussion: [Next.js #86681](https://github.com/vercel/next.js/discussions/86681)
- Package issue: [baseline-browser-mapping #105](https://github.com/web-platform-dx/baseline-browser-mapping/issues/105)
- Next.js docs: [Supported Browsers](https://nextjs.org/docs/architecture/supported-browsers)

