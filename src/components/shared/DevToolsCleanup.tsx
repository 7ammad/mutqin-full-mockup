"use client";

import { useEffect } from 'react';

/**
 * DevToolsCleanup - Removes React DevTools artifacts and injected content
 * This component runs client-side to clean up any "@node" text or similar artifacts
 * that may be injected by React DevTools or browser extensions.
 */
export function DevToolsCleanup() {
    useEffect(() => {
        // Function to remove React DevTools artifacts
        const cleanupDevTools = () => {
            // Remove any text nodes containing "@node"
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) => {
                        const text = node.textContent || '';
                        if (text.includes('@node') || text.match(/@node\s*\(\d+-\d+\)/)) {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                        return NodeFilter.FILTER_REJECT;
                    }
                }
            );

            const nodesToRemove: Text[] = [];
            let node;
            while (node = walker.nextNode()) {
                if (node instanceof Text) {
                    const text = node.textContent || '';
                    if (text.match(/@node\s*\(\d+-\d+\)/)) {
                        nodesToRemove.push(node);
                    }
                }
            }

            // Remove the nodes
            nodesToRemove.forEach(textNode => {
                if (textNode.parentNode) {
                    textNode.parentNode.removeChild(textNode);
                }
            });

            // Also check for React DevTools overlay elements
            const devToolsElements = document.querySelectorAll(
                '[data-react-devtools], [class*="react-devtools"], [id*="react-devtools"]'
            );
            devToolsElements.forEach(el => {
                if (el.textContent?.includes('@node')) {
                    el.remove();
                }
            });
        };

        // Run cleanup immediately
        cleanupDevTools();

        // Set up MutationObserver to catch dynamically injected content
        const observer = new MutationObserver((mutations) => {
            let shouldCleanup = false;
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        const text = node.textContent || '';
                        if (text.match(/@node\s*\(\d+-\d+\)/)) {
                            shouldCleanup = true;
                        }
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element;
                        if (element.textContent?.match(/@node\s*\(\d+-\d+\)/)) {
                            shouldCleanup = true;
                        }
                    }
                });
            });

            if (shouldCleanup) {
                // Debounce cleanup to avoid excessive calls
                setTimeout(cleanupDevTools, 100);
            }
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
        });

        // Cleanup on unmount
        return () => {
            observer.disconnect();
        };
    }, []);

    return null;
}


