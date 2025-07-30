# <� Residencial Palermo - Technical To-Do List

## =� Project Overview
Transform the current Bel Mangiare pasta business website into a residential care facility website for elderly adults. This comprehensive to-do list covers all necessary updates to rebrand, restructure, and redesign the site according to the new content and design guidelines.

---

## <� Phase 1: Project Setup & Brand Transformation

### 1.1 Brand Identity & Assets
- [ ] **Replace logo and brand assets**
  - Remove all Bel Mangiare branding from `/public/images/`
  - Create or obtain Residencial Palermo logo
  - Update favicon.ico with new brand
  - Replace logo192.png and logo512.png in public folder
  - Update manifest.json with new app name and descriptions

### 1.2 Project Configuration
- [ ] **Update package.json**
  - Change project name from "residencial-blanes" to "residencial-palermo"
  - Update version and metadata
  - Review and update dependencies if needed

### 1.3 SEO & Meta Information
- [ ] **Update public/index.html**
  - Change title to "Residencial Palermo - Cuidado y tranquilidad para adultos mayores"
  - Update meta description with new content focus
  - Update meta keywords for elderly care services
  - Update Open Graph and Twitter Card meta tags

---

## <� Phase 2: Design System Implementation

### 2.1 Color Palette Update
- [ ] **Implement new color scheme in CSS**
  - Primary orange: `#E0A94E` (naranja mostaza suave)
  - Dark text: `#2E2E2E` (negro suave)
  - Background: `#FFFCF8` (blanco c�lido)
  - Accent gray: `#DADADA` (gris claro)
  - Update all color variables in `src/App.css`
  - Replace pasta-themed colors throughout the design

### 2.2 Typography Implementation
- [ ] **Update font families**
  - Import Google Fonts: Quicksand, Nunito, DM Serif Display for headings
  - Import Google Fonts: Poppins, Lato, Work Sans for body text
  - Update CSS font-family declarations
  - Ensure proper font fallbacks

### 2.3 Visual Design Elements
- [ ] **Update design components**
  - Implement rounded corners and soft contours for buttons
  - Add more white space for better visual breathing room
  - Update icon styles to curved/minimalist approach
  - Create alternating background sections (white and light mustard)

---

## =� Phase 3: Image & Media Assets

### 3.1 Image Replacement
- [ ] **Remove pasta-related images**
  - Delete all pasta/food images from `/public/images/`
  - Remove pasta hero banner, product photos, factory images
  - Clear video folder if not needed

### 3.2 New Image Assets Required
- [ ] **Residential care facility images**
  - Hero banner: Peaceful residential facility exterior or interior
  - Individual and double rooms (bright and airy)
  - Common areas (reading, conversation spaces)
  - Interior patio with plants
  - Dining room setup
  - Adapted bathrooms
  - Orthopedic beds
  - Staff providing care (professional but warm)
  - Elderly residents in activities

### 3.3 Image Optimization
- [ ] **Optimize new images**
  - Convert large images to WebP format
  - Ensure responsive image sizes
  - Add proper alt text for accessibility
  - Implement lazy loading where appropriate

---

## =� Phase 4: Content Transformation

### 4.1 Navigation Structure
- [ ] **Update navigation menu**
  - Change "Inicio" (keep)
  - Change "Nosotros" to "�Qui�nes somos?" (keep similar)
  - Change "Productos" to "Instalaciones"
  - Change "Clientes" to "Servicios"
  - Change "Testimonios" (keep)
  - Change "FAQ" to "Preguntas frecuentes" (keep)
  - Change "Pedidos" to "Contacto"

### 4.2 Hero Section (Section 1)
- [ ] **Replace hero content**
  - New title: "Un espacio de tranquilidad y cuidado para tus seres m�s queridos"
  - New subtitle: "En Residencial Palermo combinamos atenci�n profesional, privacidad y calidez, para brindar un entorno seguro, digno y humano"
  - Update CTA button: "Coordin� una visita sin compromiso"
  - Replace background image with residential facility image
  - Update location to show Montevideo address

### 4.3 About Section (Section 2)
- [ ] **Transform "�Qui�nes somos?" section**
  - Replace pasta business story with residential care mission
  - Update content to focus on elderly care, respect, and quality of life
  - Replace factory/production images with facility images
  - Update story numbers and content to match new narrative
  - Change final quote to emphasize dignified care
  - Update CTAs to "visit coordination" and "learn about services"

### 4.4 Facilities Section (Section 3 - formerly Products)
- [ ] **Create "Nuestras instalaciones" section**
  - Replace product list with facility features:
    - Individual and double rooms
    - Common quiet spaces
    - Interior patio with plants
    - Adapted dining room
    - Accessible bathrooms
    - Orthopedic beds
  - Replace product gallery with facility photos
  - Update icons to home/facility related symbols
  - Add facility description emphasizing comfort and security

### 4.5 Services Section (Section 4 - formerly Clients)
- [ ] **Transform to "Servicios que ofrecemos"**
  - Replace client types with care services:
    - Nursing and medical supervision
    - Home-style adapted meals
    - Medication administration
    - Daily hygiene and personal assistance
    - Music therapy and cognitive stimulation
    - Physiotherapy and assisted mobility
    - Recreational activities
    - Emotional support and active conversation
    - Family communication
  - Update icons to healthcare/care related symbols
  - Replace production image with care-giving image

### 4.6 Why Choose Us Section (Section 5)
- [ ] **Update "�Por qu� elegirnos?" section**
  - Replace pasta quality points with care quality:
    - Quiet and harmonious environment
    - Close attention with follow-up
    - Gentle adapted activity plan
    - Direct family communication
    - Flexibility in visits and routines
  - Update tagline to emphasize dignity and respect
  - Change icons to care/comfort related symbols

### 4.7 FAQ Section (Section 6)
- [ ] **Replace business FAQ with residential care FAQ**
  - Can I visit before making a decision?
  - Are private rooms available?
  - Do you accept self-sufficient people?
  - What does the monthly rate include?
  - How are family visits handled?
  - Update answers to focus on residential care policies

### 4.8 Testimonials Section (Section 7)
- [ ] **Replace business testimonials with family testimonials**
  - Quote from Luc�a about grandmother's care
  - Quote from Sergio about facility warmth
  - Quote from Valeria about mother's adaptation
  - Ensure testimonials reflect family member perspectives

### 4.9 Contact Section (Section 8)
- [ ] **Update contact information and form**
  - Change header to encourage visits
  - Update address placeholder
  - Update phone/WhatsApp placeholder
  - Change business hours (10 a 17 hs)
  - Update form for residential inquiries instead of business quotes
  - Change form fields to family/resident information
  - Update email recipient and purpose

---

## =� Phase 5: Component & Functionality Updates

### 5.1 Form Updates
- [ ] **Redesign contact form**
  - Remove business-related fields (business name, business type)
  - Add fields relevant to residential care:
    - Family member name
    - Potential resident name
    - Relationship to resident
    - Care level needed
    - Preferred visit date
    - Special requirements or questions
  - Update form validation
  - Update EmailJS template and configuration

### 5.2 Interactive Elements
- [ ] **Update modal and gallery functionality**
  - Replace product image modal with facility gallery
  - Update image arrays and descriptions
  - Ensure modal still functions properly with new images
  - Update gallery overlay text and icons

### 5.3 Animation and Transitions
- [ ] **Review and update animations**
  - Ensure all scroll animations work with new content
  - Update animation timing if needed for new content length
  - Test all intersection observer functionality
  - Verify smooth scrolling between sections

---

## =� Phase 6: Responsive Design & Accessibility

### 6.1 Mobile Optimization
- [ ] **Test and optimize mobile experience**
  - Verify all new content displays properly on mobile
  - Test navigation menu functionality
  - Ensure contact form works on mobile devices
  - Check image loading and optimization on mobile

### 6.2 Accessibility Improvements
- [ ] **Enhance accessibility**
  - Add proper alt text for all new images
  - Ensure color contrast meets WCAG standards with new color palette
  - Test keyboard navigation throughout the site
  - Add proper ARIA labels where needed
  - Ensure form accessibility

### 6.3 Performance Optimization
- [ ] **Optimize site performance**
  - Compress and optimize all new images
  - Review and minimize CSS for new design
  - Test page load times
  - Implement image lazy loading if not already present

---

## >� Phase 7: Testing & Quality Assurance

### 7.1 Cross-Browser Testing
- [ ] **Test across browsers**
  - Chrome, Firefox, Safari, Edge compatibility
  - Mobile browser testing (iOS Safari, Chrome Mobile)
  - Test all interactive elements and animations

### 7.2 Content Review
- [ ] **Comprehensive content review**
  - Proofread all new Spanish content for accuracy
  - Verify all links and navigation work correctly
  - Test contact form submission and EmailJS integration
  - Verify all images load correctly and have proper alt text

### 7.3 SEO Validation
- [ ] **SEO and metadata verification**
  - Test meta tags and Open Graph data
  - Verify structured data if applicable
  - Check robots.txt and sitemap if present
  - Test site speed and Core Web Vitals

---

## =� Phase 8: Deployment & Launch

### 8.1 Final Preparations
- [ ] **Pre-launch checklist**
  - Remove any remaining pasta/food references in code or comments
  - Update README.md with new project information
  - Clean up unused files and dependencies
  - Verify all environment variables and configurations

### 8.2 EmailJS Configuration
- [ ] **Set up EmailJS for contact form**
  - Create new EmailJS service for Residencial Palermo
  - Configure email template for residential inquiries
  - Update service ID, template ID, and public key in code
  - Test email delivery and notification system

### 8.3 Domain & Hosting
- [ ] **Prepare for deployment**
  - Configure domain for Residencial Palermo
  - Set up hosting environment
  - Configure any CDN or performance optimizations
  - Set up SSL certificate

---

## = Phase 9: Post-Launch Maintenance

### 9.1 Content Management
- [ ] **Set up content update process**
  - Document how to update testimonials
  - Create process for updating facility images
  - Set up analytics tracking for residential leads
  - Create backup and maintenance schedule

### 9.2 Feature Enhancements
- [ ] **Potential future improvements**
  - Add WhatsApp floating button with appropriate messaging
  - Consider adding online virtual tour functionality
  - Implement appointment booking system
  - Add multilingual support if needed

---

## =� Technical Notes

### Required Skills/Resources:
- React.js development
- CSS/SCSS styling
- Image optimization and compression
- Spanish content writing/translation
- EmailJS configuration
- Responsive design testing
---

## � Important Considerations

- Ensure all content is culturally appropriate for Montevideo, Uruguay
- Maintain warm, family-oriented tone throughout
- Emphasize dignity, respect, and quality of life
- All images should reflect diversity and inclusion
- Consider family members as primary decision-makers
- Ensure compliance with local healthcare facility regulations
- Maintain professional yet approachable communication style