---
name: Pearl & Holograph
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#3a494b'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#6a7a7b'
  outline-variant: '#b9cacb'
  surface-tint: '#00696f'
  primary: '#00696f'
  on-primary: '#ffffff'
  primary-container: '#00f2ff'
  on-primary-container: '#006a71'
  inverse-primary: '#00dbe7'
  secondary: '#705d00'
  on-secondary: '#ffffff'
  secondary-container: '#fcd400'
  on-secondary-container: '#6e5c00'
  tertiary: '#51606c'
  on-tertiary: '#ffffff'
  tertiary-container: '#cdddeb'
  on-tertiary-container: '#52626d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#74f5ff'
  primary-fixed-dim: '#00dbe7'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#ffe16d'
  secondary-fixed-dim: '#e9c400'
  on-secondary-fixed: '#221b00'
  on-secondary-fixed-variant: '#544600'
  tertiary-fixed: '#d4e5f3'
  tertiary-fixed-dim: '#b8c9d6'
  on-tertiary-fixed: '#0d1d27'
  on-tertiary-fixed-variant: '#394954'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  data-point:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
  container-padding: 24px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The brand personality is an intersection of high-end lifestyle concierge and advanced urban navigation. It evokes a sense of calm intelligence, where the complexity of a smart city is distilled into an airy, ethereal interface. The target audience is the modern urban explorer who values both technical precision and aesthetic beauty.

This design system utilizes **Glassmorphism** and **Minimalism** to achieve a "cinematic HUD" effect. The interface should feel like it is projected onto a thin sheet of glass rather than rendered on a screen. Every interaction is designed to feel weightless yet responsive, mimicking the tactile feedback of high-end mechanical instruments refined by a futuristic digital layer.

## Colors
The palette is rooted in a "Pearl" foundation—whites and silvers that provide a high-clarity canvas for data. The core background is **Pearl White**, accented by **Soft Sand** and **Cloud Gray** to differentiate between content layers.

The "Holograph" elements are driven by **Electric Cyan** and **Aqua Blue**, used primarily for active states, navigational paths, and interactive data. **Gold XP Glow** is reserved exclusively for achievement, prestige, or high-value discoveries within the city, providing a warm contrast to the cool technological tones. Use subtle linear gradients for holographic elements, typically 45-degree shifts from Cyan to Aqua.

## Typography
The system employs **Space Grotesk** for technical data, headlines, and UI labels to provide a geometric, futuristic edge. This font's open apertures and modern construction make it ideal for the "intelligent" aspect of the brand.

**Manrope** serves as the primary body font, chosen for its refined balance and excellent legibility in denser information blocks. For hierarchy, use heavy weights and uppercase styling for "Label Caps" to denote metadata or category tags. Interactive data (like distance or time) should always be rendered in Space Grotesk to emphasize the app's analytical nature.

## Layout & Spacing
This design system utilizes a **Fluid Grid** with a soft 8px rhythm. The layout philosophy centers on "Floating Containers"—elements rarely touch the edges of the viewport, instead maintaining a consistent 20px (mobile) or 40px (desktop) safe area.

Components are stacked vertically using "stack-md" for related content and "stack-lg" for distinct sections. Internal padding within cards and containers is generous (24px) to maintain the airy, premium feel of the brand. Horizontal spacing uses a 12-column grid for desktop and a 4-column grid for mobile, emphasizing verticality and ease of thumb navigation.

## Elevation & Depth
Elevation is conveyed through **Glassmorphism** rather than traditional drop shadows. Instead of casting shadows onto a flat surface, components appear to float at different depths through varying levels of background blur and border opacity.

- **Base Layer:** Solid Pearl White or Soft Sand.
- **Level 1 (Cards):** 20px backdrop blur, 40% white opacity, 1px solid white border at 20% opacity.
- **Level 2 (Modals/Popovers):** 40px backdrop blur, 60% white opacity, 1px solid white border at 40% opacity.
- **Floating HUD:** Elements use a "soft reflection" effect—a subtle linear gradient stroke (Top-Left to Bottom-Right) that mimics a light source catching the edge of glass.

## Shapes
The shape language is defined by "Organic Precision." Corners are rounded to level **2 (Rounded)** to feel approachable and premium, similar to high-end consumer electronics. 

Standard cards use a 1rem (16px) radius, while larger hero sections or main containers use 1.5rem (24px). Buttons and chips utilize a "Squircle" or fully pill-shaped aesthetic to distinguish them as highly interactive touch targets. Avoid sharp 90-degree angles to maintain the "airy" and "fluid" brand narrative.

## Components
- **Buttons:** Primary buttons feature a "Holographic Glow" (Cyan gradient) with a soft outer glow of the same color (5px blur). Secondary buttons are glass-morphic with a 1px white border.
- **Cards:** "Premium Rounded Cards" are the core unit. They must include a subtle inner glow on the top-left edge to simulate light hitting glass.
- **Floating Navigation:** The main nav bar is a pill-shaped glass container floating 24px from the bottom of the screen. Icons are thin-line weights (1.5pt) that glow Cyan when active.
- **Chips/Badges:** Small, pill-shaped elements with high-contrast text (Space Grotesk). For "XP" or "Discovery" badges, use a Gold XP Glow gradient.
- **Input Fields:** Semi-transparent containers with a bottom-only border that illuminates in Cyan when focused.
- **Interactive Layers:** Use "Layered Interactive Elements" where maps or 3D city views are visible through the blurred glass of the UI panels, creating a sense of immense depth.