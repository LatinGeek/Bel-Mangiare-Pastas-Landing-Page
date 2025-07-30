# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based single-page website for **Residencial Palermo**, a senior care facility in Montevideo, Uruguay. The site serves as the primary digital presence to showcase the facility's services, installations, and provide an easy way for families to contact and schedule visits.

## Development Commands

### Core Commands
- `npm start` - Start development server (runs on http://localhost:3000)
- `npm run build` - Create production build in `/build` directory
- `npm test` - Run test suite using React Testing Library
- `npm run eject` - Eject from Create React App (irreversible)

### Development Workflow
- Use `npm start` for development - includes hot reload and error reporting
- Test changes across different screen sizes (mobile-first approach)
- Build production version with `npm run build` before deployment

## Architecture & Code Structure

### Single Component Architecture
The entire application is built as **one large React component** (`src/App.js`) with all functionality contained within:
- All state management using React hooks (`useState`, `useEffect`)
- All event handlers defined within the main component
- Inline JSX sections for each page section (hero, about, facilities, services, etc.)

### Key State Variables
- `isScrolled` - Controls header appearance when scrolling
- `modalOpen` - Controls image gallery modal visibility  
- `currentImageIndex` - Tracks current image in gallery modal
- `mobileMenuOpen` - Controls mobile navigation menu
- `formData` - Contact form data object
- `isSubmitting` / `submitStatus` - Form submission state

### Main Sections (in order)
1. **Header** - Fixed navigation with desktop/mobile responsive menu
2. **Hero** - Full-screen background image with centered content and logo
3. **About** - Company story with numbered sections and quote
4. **Facilities** - Feature grid + image gallery with modal viewer
5. **Services** - Service list with icons and descriptions
6. **Testimonials** - Client testimonial cards
7. **Why Choose Us** - Benefits grid with checkmark icons
8. **FAQ** - Question and answer sections
9. **Contact** - Contact info grid + functional contact form
10. **Footer** - Company details and copyright

### Image Gallery System
- `facilityImages` array contains image paths and alt text
- Modal opens when gallery images are clicked (`openModal(index)`)
- Navigation with keyboard support (arrow keys, escape)
- Modal prevents body scroll when open

### Form Integration
- Uses **EmailJS** for contact form submission (currently has placeholder IDs that need configuration)
- Form validation and user feedback with success/error states
- Real-time form data binding with controlled inputs

## Styling & Design System

### CSS Architecture
All styles are in `src/App.css` using:
- CSS custom properties (variables) for consistent theming
- Mobile-first responsive design with `@media` queries
- CSS Grid and Flexbox for layout
- CSS animations and transitions for interactivity

### Color Palette (from design guidelines)
```css
:root {
  --primary-orange: #E0A94E;     /* Main brand color */
  --text-dark: #2E2E2E;          /* Primary text */
  --background-warm: #FFFCF8;    /* Page background */
  --accent-gray: #DADADA;        /* Complementary gray */
  --light-mustard: #F5E8CC;      /* Section backgrounds */
}
```

### Typography System
- **Headers**: `Quicksand`, `Nunito`, `DM Serif Display` (serif fallback)
- **Body Text**: `Poppins`, `Lato`, `Work Sans` (sans-serif)
- Mobile-responsive font scaling using `rem` units

### Responsive Breakpoints
- **Desktop**: 1025px and above (default styles)
- **Mobile/Tablet**: 1024px and below (single breakpoint for simplicity)
- Mobile-first approach with desktop overrides

### Animation System
- Intersection Observer API for scroll-triggered animations
- `.animate-on-scroll` and `.animate-item` classes for staggered animations
- Respects `prefers-reduced-motion` for accessibility

## Content Management

### Text Content
All text content is hardcoded in Spanish within `src/App.js`. Key content sections reference:
- Company story and values in About section
- Service descriptions with emoji icons
- FAQ questions and answers
- Contact information and form fields

### Images
- Located in `/public/images/` directory
- Currently contains: hero background, logo, and README
- **Missing facility images** - gallery references non-existent images that need to be added:
  - individual-room.jpg, double-room.jpg, common-area-reading.jpg
  - interior-patio.jpg, dining-room.jpg, accessible-bathroom.jpg
  - facility-interior.jpg, staff-providing-care.jpg, facility-garden.jpg

### Brand Guidelines
Following design guidelines in `website-design-guidelines.md`:
- Modern, bright, human tone
- Warm color palette with orange/mustard as primary
- Clean typography with ample white space
- Professional but approachable aesthetic

## Configuration Needed

### EmailJS Setup
Contact form requires EmailJS configuration (see `EMAILJS_SETUP.md`):
1. Replace placeholder values in `src/App.js` line ~196-200:
   - `YOUR_SERVICE_ID` → EmailJS service ID
   - `YOUR_TEMPLATE_ID` → EmailJS template ID  
   - `YOUR_PUBLIC_KEY` → EmailJS public key

### Contact Information
Update placeholder contact details in:
- Contact section (phone number currently shows "094 xxx xxx")
- Footer information
- Email addresses for form submissions

### Missing Assets
- Add actual facility photos to replace placeholder image paths
- Verify hero background image `hero-facility-exterior.jpg` exists
- Ensure logo `residencial-palermo-logo.png` is correctly placed

## Development Notes

### Mobile Navigation
- Uses hamburger menu with backdrop blur effect
- Menu closes on escape key, resize to desktop, or item selection
- Smooth scrolling navigation to page sections

### Accessibility Features
- Keyboard navigation support for modal and mobile menu
- Semantic HTML structure with proper heading hierarchy
- Focus management for modal dialogs
- Screen reader friendly alt texts and ARIA labels

### Performance Considerations  
- Single large component may impact performance with growth
- Consider code splitting if adding significant functionality
- Images should be optimized for web (WebP format recommended)
- Currently uses external Google Fonts (may want to self-host)

## Deployment

The site is configured for static hosting and can deploy to:
- **Netlify** (recommended): Connect GitHub repo, build command `npm run build`, publish directory `build`
- **Vercel**: Auto-deploy on push with zero configuration
- **GitHub Pages**: Add homepage field to package.json and use gh-pages

## Future Enhancements

Based on README suggestions, potential improvements include:
- Blog section for facility updates
- Online booking system for visits  
- Virtual tour integration
- Multi-language support (English/Portuguese)
- Admin panel for content management
- Performance and SEO optimization

## Important Notes

- This is a **single-page application** built with Create React App
- All functionality is contained in one component - consider refactoring if adding major features
- The contact form is functional but requires EmailJS configuration to work
- Mobile-first responsive design optimized for all device sizes
- Content is currently in Spanish for the Uruguayan market