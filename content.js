const AI_OVERVIEW_SELECTOR = 'div.bzXtMb.M8OgIe.dRpWwb';

let aiOverviewHidden = true;


// ---------------------------------------------------------
// Inject the hiding CSS immediately
// ---------------------------------------------------------

function injectStyles() {
    if (document.getElementById('ai-overview-remover-style')) {
        return;
    }

    const style = document.createElement('style');

    style.id = 'ai-overview-remover-style';

    style.textContent = `
        div.bzXtMb.M8OgIe.dRpWwb.ai-overview-hidden {
            display: none !important;
        }

        #ai-overview-remover-toggle {
            appearance: none;
            border: 0;
            background: transparent;
            padding: 0;
            margin-left: 8px;
            width: 34px;
            height: 24px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            vertical-align: middle;
        }

        #ai-overview-remover-toggle .ai-toggle-track {
            position: relative;
            display: block;
            width: 28px;
            height: 16px;
            border-radius: 999px;
            background: #9aa0a6;
            transition: background 0.15s ease;
        }

        #ai-overview-remover-toggle .ai-toggle-knob {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: white;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
            transition: transform 0.15s ease;
        }

        #ai-overview-remover-toggle.enabled
            .ai-toggle-track {
            background: #1a73e8;
        }

        #ai-overview-remover-toggle.enabled
            .ai-toggle-knob {
            transform: translateX(12px);
        }

        #ai-overview-remover-toggle:focus-visible {
            outline: 2px solid #1a73e8;
            outline-offset: 2px;
            border-radius: 4px;
        }
    `;

    document.documentElement.appendChild(style);
}


// ---------------------------------------------------------
// AI Overview
// ---------------------------------------------------------

function updateAIOverview() {
    document.querySelectorAll(AI_OVERVIEW_SELECTOR).forEach((element) => {
        element.classList.toggle(
            'ai-overview-hidden',
            aiOverviewHidden
        );
    });
}


// ---------------------------------------------------------
// AI Mode
// ---------------------------------------------------------

function hideAIMode() {
    document.querySelectorAll('span').forEach((span) => {
        if (span.textContent.trim() !== 'AI Mode') {
            return;
        }

        const link = span.closest('a');

        if (!link) {
            return;
        }

        const listItem = link.closest('[role="listitem"]');

        if (listItem) {
            listItem.style.display = 'none';
        } else {
            link.style.display = 'none';
        }
    });
}


// ---------------------------------------------------------
// Toggle
// ---------------------------------------------------------

function createToggle() {
    if (document.getElementById('ai-overview-remover-toggle')) {
        return;
    }

    const tools = [...document.querySelectorAll('[role="button"]')]
        .find((element) => {
            return element.textContent.trim() === 'Tools';
        });

    if (!tools || !tools.parentNode) {
        return;
    }

    const toggle = document.createElement('button');

    toggle.id = 'ai-overview-remover-toggle';
    toggle.type = 'button';
    toggle.title = 'Show / hide Google AI Overview';
    toggle.setAttribute(
        'aria-label',
        'Show / hide Google AI Overview'
    );

    toggle.innerHTML = `
        <span class="ai-toggle-track">
            <span class="ai-toggle-knob"></span>
        </span>
    `;

    toggle.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        aiOverviewHidden = !aiOverviewHidden;

        updateAIOverview();
        updateToggleAppearance();
    });

    tools.parentNode.insertBefore(
        toggle,
        tools.nextSibling
    );

    updateToggleAppearance();
}


// ---------------------------------------------------------
// Toggle appearance
// ---------------------------------------------------------

function updateToggleAppearance() {
    const toggle = document.getElementById(
        'ai-overview-remover-toggle'
    );

    if (!toggle) {
        return;
    }

    toggle.classList.toggle(
        'enabled',
        !aiOverviewHidden
    );
}


// ---------------------------------------------------------
// Observe Google's dynamic DOM
// ---------------------------------------------------------

const observer = new MutationObserver(() => {
    createToggle();
    updateAIOverview();
    hideAIMode();
});


// ---------------------------------------------------------
// Startup
// ---------------------------------------------------------

injectStyles();

function init() {
    if (!document.body) {
        return;
    }

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    createToggle();
    updateAIOverview();
    hideAIMode();
}

if (document.body) {
    init();
} else {
    new MutationObserver(() => {
        if (document.body) {
            init();
        }
    }).observe(document.documentElement, {
        childList: true,
        subtree: true
    });
}