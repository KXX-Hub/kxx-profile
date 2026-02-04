# Early Apple Macintosh (1984) Pixel Art Homepage Redesign

## Date
2026-02-03

## Overview
Transform the homepage layout to authentic 1984 Macintosh monochrome aesthetic with pixel-perfect bitmap styling, classic Mac UI patterns, and Susan Kare-inspired design elements.

## Design Specifications

### Color Palette
- **Primary Background**: `#FFFFFF` (Classic Mac white)
- **Secondary Background**: `#F5F5F5` (Light gray)
- **Dark Elements**: `#000000` (Pure black)
- **Medium Gray**: `#888888` (Shadows, borders)
- **Light Gray**: `#CCCCCC` (Subtle backgrounds)

### Typography
- **Headings**: 'Press Start 2P' (Chicago-style)
- **Body**: 'VT323' (Monaco/Geneva-style)
- **Rendering**: `image-rendering: pixelated`

### UI Elements

#### Banner
- Remove photo overlay
- Replace with classic Mac desktop checkerboard pattern
- Optional: Menu bar at top with pixel text

#### Profile Avatar
- Mac window-style frame with title bar
- Black 1px border
- Diagonal line pattern in title bar
- White interior background

#### Navigation Cards
- Styled as Mac Finder windows
- Title bar with horizontal lines
- Decorative close box (top-left)
- 1-bit pixel art icons
- Invert colors on hover

#### Patterns
- Checkerboard backgrounds
- Diagonal line title bars
- Stipple/dithering for depth
- Pixel-perfect beveled edges

### Animations
- Remove: gradient shifts, glows, complex effects
- Keep: simple 1-2px translateY on hover
- Add: selection flash, minimal pixel movements

## Implementation Strategy
1. Update CSS color variables
2. Apply pixel-rendering globally
3. Transform banner section
4. Redesign profile frame
5. Convert navigation to Mac windows
6. Add classic Mac patterns via CSS/SVG
7. Simplify animations
8. Update scrollbar styling
