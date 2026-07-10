# Platform Technical Specification
## Version 1.4 (Stage 4.0 Platform Consolidation)

This document serves as the formal technical specification for **Utility Hub**, a local-first browser-native application framework. Unlike philosophical or onboarding guidelines, `PLATFORM_SPEC.md` defines the strict technical schemas, routing contracts, component boundaries, and Engine-Plugin architectures that govern this platform.

---

## 1. Engine API Specification v1.0

The platform defines five distinct computational domains, each managed by a dedicated, isolated **Engine**. An Engine is a high-level router/orchestrator component that resolves individual tool sub-plugins based on a passed-in standard `toolId`.

### Engine Mount Schema
Each Engine component MUST conform to the standard React/TypeScript entry interface:

```typescript
interface EngineProps {
  toolId: string;
}

export default function CoreEngine({ toolId }: EngineProps): React.JSX.Element;
```

### Validated Engines
The following five core engines are officially registered and architecturally frozen:

1. **Text Engine (`TextEngine.tsx`)**: Processes character collections, word metrics, case modifications, and regex filters.
2. **Developer Engine (`DeveloperEngine.tsx`)**: Manages format validators, serialization/deserialization schemas (JSON, XML), and base encoding streams (Base64).
3. **Calculator Engine (`CalculatorEngine.tsx`)**: Implements mathematical formulary models, cryptographic salt generators (Passwords), and date/epoch handlers.
4. **Image Engine (`ImageEngine.tsx`)**: Coordinates HTML5 Canvas resamplers, format transcodes, dual comparison viewports, and custom compression workflows.
5. **PDF Engine (`PDFEngine.tsx`)**: Runs client-side `pdf-lib` stream handles to execute document combining (Merge) and subset separation (Page Extraction).

---

## 2. Tool Metadata Schema

Every tool in the ecosystem must be declared inside the master registry `src/data/tools.ts`. The registry array `TOOLS` contains objects conforming to the `ToolMetadata` interface.

### Schema Definition
```typescript
export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolMetadata {
  id: string;                     // Unique kebab-case identifier (e.g. 'pdf-merger')
  name: string;                   // Human-readable tool title
  description: string;            // Visual sub-heading describing operations
  category: string;               // Match to CATEGORIES registry (e.g. 'converter')
  iconName: string;               // Lucide React icon component key name
  globalKeywords: string[];       // Synonyms for NLP Intelligent Routing matched search
  howToUse: string[];            // Sequential array of instructions for user guides
  faqs: FAQItem[];                // Informational Q&A blocks rendered inside the sandbox
  difficulty: 'Easy' | 'Medium' | 'Hard'; // Diagnostic user complexity metrics
  estimatedTime: string;          // Approximate conversion/calculation duration
  version: string;                // Incrementing semantic engine version
  changelog: string[];            // Array of features released under current tool
  averageLatency: string;         // Diagnostic runtime execution duration (e.g., '< 50ms')
  popularScore: number;           // Calculated scoring metrics (0-100) for Hot Spotlights
  offlineReady: boolean;          // Strict guard indicating zero network dependency
  apiRequired: boolean;           // Indicates if secondary proxy services are expected
  supportsBatch: boolean;         // Batch processing capability indicator
  browserCompatibility: string;   // Verified compatibility constraints
  mobileReady: boolean;           // Responsive design flag
  hasKeyboardShortcuts: boolean;  // Enables standard overlay key bindings
  isPlanned?: boolean;            // Roadmap flag for coming soon visual placeholders
  plannedSprint?: string;         // Targets specific future architectural sprints
}
```

---

## 3. Routing & State Contracts

The platform operates on a **Single-View Client-Side Router State Machine** mounted at the application core.

### View States
- `home`: Default entry point rendering the unified `DashboardView`.
- `tool-[id]`: Dynamic routing path that unpacks the tool `id` and launches the target tool engine wrapped in a `ToolLayout`.
- `privacy` | `terms` | `disclaimer`: Static informational routes rendered via `StaticView`.

### History Telemetry Contract
Every route navigation to a tool must update the local browser audit log for quick-launch spotlights:
- **Key**: `smartutils_history`
- **Format**: JSON serialized array of `{ toolId: string; timestamp: number }` capped at 20 items.
- **Redundancy**: Duplicate entries of the same `toolId` must be filtered out, moving the most recently visited node to the top of the index.

### Settings State Persistence
User layout preferences are loaded on app initialization and persistent via standard localStorage:
- **Density**: `smartutils_density` (`standard` | `compact`)
- **Font Size**: `smartutils_fontsize` (`sm` | `base` | `lg`)
- **Theme**: `smartutils_theme` (`light` | `dark`)

---

## 4. Layout & UI Component Architecture

To protect visual rhythm and branding consistency, the platform forces separation between layout templates and computational engines.

### 4.1. Shell Layout (`ToolLayout.tsx`)
Enforces uniform canvas sizing, sidebar navigations, step guides, FAQ indexes, and bookmark triggers.
- **Header Slot**: Integrates dynamic breadcrumbs, quick-return buttons, and favorite stars.
- **Sidebar Slot**: Displays interactive usage guides (`howToUse`), version trackers, and diagnostic metadata panels.
- **Interactive Body**: Injects the active computational plugin.
- **Accordion Footer**: Systematically maps and renders static FAQ blocks.

### 4.2. Header Navigation (`Header.tsx`)
Orchestrates global status controls:
- **Search Console**: Inline incremental tool search with auto-completion.
- **Bookmarked Dropdown**: Displays favorite tools direct launch pins.
- **System Settings Console**: Unfolds preferences for Theme Mode, Layout Density, and Font Sizing.
- **Command center shortcut**: Trigger buttons for hotkeys and help centers.

### 4.3. Footer Layout (`Footer.tsx`)
Directs region selections, platform signatures, and legal privacy disclosures.

---

## 5. Universal Command Center Specification

The platform mounts a global, modal **Command Palette** accessible via `Ctrl+K` or `Cmd+K`.

### Intelligent Routing Engine
The command center implements a client-side NLP processor matching terms to keywords:
- Inputs are normalized and sanitized.
- Matches against `tool.name` and `tool.globalKeywords` are ranked.
- Highest scores display an instant routing button ("Launch Now") with immediate focus.
- Shortcuts are supported for quick theme adjustments (`DM`) and spacing collapses (`DL`).

---

## 6. Browser-Native Sandbox Requirements

All computation must occur **locally** within the browser sandbox to guarantee offline capability and maximum client privacy.

### Local Stream Constraints
- **Zero Cloud Storage**: Data arrays, JSON objects, files, and PDF streams must never be transmitted to external servers. All operations must utilize client-side React State, Javascript buffers, blobs, or Canvas contexts.
- **Performance Thresholds**: Target average latency of `< 50ms` for processing datasets. Big files (e.g. multi-page PDFs or high-definition pictures) must employ progressive processing indicators to prevent browser thread locks.
- **Cross-Origin & iFrame Guard**: Because the app often runs inside constrained preview frame layers:
  - Avoid `window.alert`, `window.open`, or other blocks blocked by secure frame parameters.
  - Implement local modal overlays or toast dialogs for warning prompts or configuration notifications.

---

---

## 7. Structural Guardrails (ERB-0014)

### 7.1. Engine Knowledge Rule
Engines **MUST NEVER** know which specific tool is being rendered. No tool-specific conditional statements (e.g., `if (toolId === 'word-counter')`) are permitted inside the core engine orchestrator files (`TextEngine.tsx`, `DeveloperEngine.tsx`, `CalculatorEngine.tsx`, `ImageEngine.tsx`, `PDFEngine.tsx`). 
- **The Plugin Model**: Any behavior, inputs, state transformations, and schemas must be declared within the plugin files as unified metadata structures or callback functions.
- **The Engine Model**: Engines act purely as declarative interpreters that ingest these plugin contracts and render the interactive UI panels, keeping the core orchestrators decoupled, clean, and scaling-independent.

### 7.2. Manifest Evolution Strategy
As the platform approaches high tool volumes (500+ utilities), the central manifest (`src/data/tools.ts`) is prone to inflation.
- **Monitoring Trigger**: If the metadata structure begins accumulating too many optional parameters, conditional flags, or utility-specific fields, the manifest schema will be split into isolated domain registries:
  - `SEO metadata registry`
  - `UI component rendering registry`
  - `Engine mapping registry`
  - `Analytics telemetry registry`
- **Deferral Policy**: Avoid early split or over-engineering; only execute this modularization when clear structural or build-time latency evidence supports it.

### 7.3. Platform Maintenance Era
The platform has officially transitioned from concept and implementation validation into **Platform Expansion & Maintenance**. 
- Architectural priority shifts from *designing new infrastructure* to *protecting existing contracts from regression*.
- Focus on maintaining extremely low technical debt, high component reuse ratios, fluid responsive design, and robust iFrame boundary protections.
