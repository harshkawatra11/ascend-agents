# 08 — Design System

## Mandate
Agency-grade, editorial, heavily professional. **No blue-purple SaaS-gradient look.** No generic "AI slop" dashboard template feel. Think: a well-designed policy report or financial terminal, not a chatbot landing page.

## Color Palette

### Base (warm neutral, editorial)
| Token | Hex | Use |
|---|---|---|
| `paper` | `#F4EEE4` | primary background — warm off-white/beige |
| `paper-dim` | `#EDE4D3` | secondary surface / card background |
| `parchment` | `#E4D8C3` | tertiary surface, hover states |
| `ink` | `#231F1A` | primary text |
| `ink-soft` | `#4A433A` | secondary text |
| `hairline` | `#D8CBB4` | borders, dividers |
| `accent-clay` | `#B5502E` | primary accent (buttons, links, active states) — terracotta, not blue |
| `accent-brass` | `#8A6D3B` | secondary accent — brass/amber |

### Semantic Risk Colors (reserved exclusively for risk signaling)
| Level | Color | Hex |
|---|---|---|
| Healthy | green | `#3F6B4A` |
| Monitor | amber | `#A8823A` |
| Stress | orange | `#B5622E` |
| Critical | red | `#9E3A2E` |

Risk colors never appear as decorative UI chrome — only on map pins, heatmap cells, badges, and alert severities.

## Typography
- **Display/headings**: a serif with editorial weight — e.g. `"Source Serif 4"` or `"Fraunces"` (self-hosted via `next/font`).
- **Body/UI**: a clean grotesk sans — e.g. `"Inter"` or `"IBM Plex Sans"`.
- **Numerals/data**: tabular figures for all KPI/metric displays (`font-variant-numeric: tabular-nums`).
- Type scale: modest, editorial (e.g. 13/15/18/24/32/48px), generous line-height on body copy, tight tracking on large display numbers.

## Layout Principles
- Generous whitespace, hairline borders instead of heavy drop shadows.
- Cards use subtle 1px borders (`hairline`) and minimal shadow, not glassmorphism.
- Grid-based KPI strip, not free-floating widget chaos.
- Data-dense sections (tables, scorecards) use monospaced/tabular numerals for scannability.

## Motion
Framer Motion used sparingly: card enter/exit on approve-reject, risk-color cross-fade, number count-up on KPI load. No bouncy/playful easing — use restrained `ease-out`, 150–250ms.

## Components (Tailwind theme tokens)
Define in `tailwind.config.ts` under `theme.extend.colors` matching the token table above, plus `fontFamily.serif` / `fontFamily.sans` mapped to the chosen fonts. Component library: hand-built (no shadcn default blue theme) styled directly with these tokens.

## Reference Mood
Financial Times / The Economist data journalism pages, Bloomberg terminal density, high-end policy-report PDFs — applied to a live operational dashboard.
