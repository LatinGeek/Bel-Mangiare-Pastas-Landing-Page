import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    businessType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const productImages = [
    { src: "/images/bel-mangiare-images/IMG-20250716-WA0009.jpg", alt: "Pastas artesanales Bel Mangiare" },
    { src: "/images/bel-mangiare-images/IMG-20250716-WA0002.jpg", alt: "Producción de pastas frescas" },
    { src: "/images/bel-mangiare-images/IMG-20250716-WA0003.jpg", alt: "Variedad de pastas caseras" },
    { src: "/images/bel-mangiare-images/IMG-20250716-WA0010.jpg", alt: "Pasta fresca recién elaborada" },
    { src: "/images/bel-mangiare-images/IMG-20250716-WA0005.jpg", alt: "Proceso artesanal de elaboración" },
    { src: "/images/bel-mangiare-images/IMG-20250716-WA0007.jpg", alt: "Productos terminados Bel Mangiare" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check for cookie consent
  useEffect(() => {
    const cookieConsent = localStorage.getItem('belMangiare_cookieConsent');
    if (!cookieConsent) {
      // Show banner after 2 seconds
      const timer = setTimeout(() => {
        setShowCookieBanner(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Add staggered animation for child elements
          const children = entry.target.querySelectorAll('.animate-item');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate-in');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    // Observe all sections and animated elements
    const sections = document.querySelectorAll('section');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    sections.forEach((section) => observer.observe(section));
    animatedElements.forEach((element) => observer.observe(element));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      animatedElements.forEach((element) => observer.unobserve(element));
    };
  }, []);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [modalOpen]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      setMobileMenuOpen(false); // Close mobile menu after navigation
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleKeyDown = (e) => {
    if (modalOpen) {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  // Close mobile menu on escape key and prevent body scroll when open
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      // Check if screen width is greater than 768px (desktop breakpoint)
      if (window.innerWidth > 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const acceptCookies = () => {
    localStorage.setItem('belMangiare_cookieConsent', 'accepted');
    localStorage.setItem('belMangiare_cookieConsentDate', new Date().toISOString());
    setShowCookieBanner(false);
  };

  const openTermsModal = () => {
    setShowTermsModal(true);
  };

  const closeTermsModal = () => {
    setShowTermsModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // EmailJS configuration
      const templateParams = {
        from_name: formData.name,
        business_name: formData.businessName,
        business_type: formData.businessType,
        from_email: formData.email,
        from_phone: formData.phone,
        message: formData.message,
        to_email: 'belmangiarepastas.uy@gmail.com',
        date: new Date().toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        time: new Date().toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })
      };

      // Send email using EmailJS
              const result = await emailjs.send(
          'belmangiare', // Your EmailJS service ID
          'template_xcnvomc', // Replace with your actual template ID
          templateParams,
          '0mGtb4M2aFPwut2D0' // Replace with your EmailJS public key
        );

      console.log('Email sent successfully:', result);
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        businessName: '',
        email: '',
        phone: '',
        businessType: '',
        message: ''
      });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
      
      // Reset error status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App">
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="logo">
            <img src="/images/bel-mangiare-logo.png" alt="Bel Mangiare" style={{height: '40px'}} />
          </div>
          
          {/* Hamburger Menu Button */}
          <button 
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Desktop Navigation */}
          <nav className="nav desktop-nav">
            <ul>
              <li><a href="#home" onClick={() => scrollToSection('home')}>Inicio</a></li>
              <li><a href="#about" onClick={() => scrollToSection('about')}>Nosotros</a></li>
              <li><a href="#products" onClick={() => scrollToSection('products')}>Productos</a></li>
              <li><a href="#clients" onClick={() => scrollToSection('clients')}>Clientes</a></li>
              <li><a href="#testimonials" onClick={() => scrollToSection('testimonials')}>Testimonios</a></li>
              <li><a href="#faq" onClick={() => scrollToSection('faq')}>FAQ</a></li>
              <li><a href="#contact" onClick={() => scrollToSection('contact')}>Pedidos</a></li>
            </ul>
          </nav>

        </div>
      </header>

      {/* Mobile Navigation - Moved outside header */}
      <nav 
        className={`mobile-nav ${mobileMenuOpen ? 'active' : ''} ${isScrolled ? 'scrolled' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setMobileMenuOpen(false);
          }
        }}
      >
        <ul>
          <li><a href="#home" onClick={() => scrollToSection('home')}>Inicio</a></li>
          <li><a href="#about" onClick={() => scrollToSection('about')}>Nosotros</a></li>
          <li><a href="#products" onClick={() => scrollToSection('products')}>Productos</a></li>
          <li><a href="#clients" onClick={() => scrollToSection('clients')}>Clientes</a></li>
          <li><a href="#testimonials" onClick={() => scrollToSection('testimonials')}>Testimonios</a></li>
          <li><a href="#faq" onClick={() => scrollToSection('faq')}>FAQ</a></li>
          <li><a href="#contact" onClick={() => scrollToSection('contact')}>Pedidos</a></li>
        </ul>
      </nav>

      <main>
        <section id="home" className="hero">
          <img src="/images/pastas-hero-banner.webp" alt="Bel Mangiare pasta production" className="hero-background" />
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-text-centered">
              <h2>Pasta fresca artesanal con sabor casero para tu negocio</h2>
              <p>En Bel Mangiare elaboramos cada día pastas hechas como en casa, con ingredientes seleccionados y recetas tradicionales. Entregamos a comercios, residenciales y restaurantes que valoran el verdadero sabor.</p>

              <div className="hero-actions">
                <div className="hero-cta-row">
                  <button className="cta-button hero-button primary" onClick={() => scrollToSection('contact')}>Solicitá tu presupuesto sin compromiso</button>
                </div>
                <div className="hero-location-row">
                  <div className="hero-location">
                    <span className="location-icon">📍</span>
                    <span>Montevideo, Uruguay</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="about-modern">
          <div className="container">
            <div className="about-header-modern animate-on-scroll">
              <div className="about-badge-modern animate-item">
                <span className="badge-icon">🍝</span>
                <span>Más de 15 años elaborando</span>
              </div>
              <h2 className="animate-item">¿Quiénes somos?</h2>
              <p className="about-subtitle-modern animate-item">Una familia dedicada a la pasta artesanal de calidad</p>
            </div>
            
            <div className="about-content-modern">
              <div className="about-image-section animate-on-scroll animate-item">
                <div className="about-image-container-modern">
                  <img src="/images/fabricasdepastas.jpg" alt="Fábrica Bel Mangiare" />
                  <div className="image-overlay-modern">
                    <div className="overlay-content-modern">
                      <h4>15+ años</h4>
                      <p>Elaborando pasta artesanal con tradición familiar</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="about-text-modern">
                <div className="about-story-modern animate-on-scroll">
                  <div className="story-item-modern animate-item">
                    <div className="story-number">01</div>
                    <div className="story-content-modern">
                      <h3>Nuestro propósito</h3>
                      <p>
                        En Bel Mangiare abrimos nuestras puertas hace más de 15 años con un único propósito: elaborar pastas frescas artesanales con la misma dedicación que en casa, pero pensadas para negocios que necesitan volumen, calidad y cumplimiento.
                      </p>
                    </div>
                  </div>
                  
                  <div className="story-item-modern animate-item">
                    <div className="story-number">02</div>
                    <div className="story-content-modern">
                      <h3>Tradición familiar</h3>
                      <p>
                        Fundado por una familia con vocación por la gastronomía, Bel Mangiare nació como una fábrica con alma de cocina familiar. Creemos que el sabor casero no debería perderse, incluso cuando se produce en escala.
                      </p>
                    </div>
                  </div>
                  
                  <div className="story-item-modern animate-item">
                    <div className="story-number">03</div>
                    <div className="story-content-modern">
                      <h3>Compromiso comercial</h3>
                      <p>
                        Nos especializamos en la venta al por mayor, atendiendo a diversos tipos de negocios. Nuestra fábrica está equipada para responder con agilidad y cumplimiento, manteniendo el corazón de una cocina familiar.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="about-quote-modern animate-on-scroll animate-item">
                  <div className="quote-icon">“</div>
                  <blockquote>
                    Comer bien es nuestro nombre. Y también nuestra misión. Después de más de 15 años, seguimos elaborando con la misma pasión: pasta fresca como en casa, pero para tu negocio.
                  </blockquote>
                </div>
                
                <div className="about-actions-modern animate-on-scroll animate-item">
                  <button className="cta-button primary" onClick={() => scrollToSection('contact')}>Solicitá tu cotización</button>
                  <button className="cta-button secondary" onClick={() => scrollToSection('products')}>Ver productos</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="facilities">
          <div className="container">
            <h2 className="animate-on-scroll animate-item">Nuestros productos</h2>
            <p className="facilities-intro animate-on-scroll animate-item">Elaboramos pasta fresca todos los días, con materia prima de primera y recetas italianas que combinan tradición con el paladar local. Nuestras opciones más solicitadas por comercios y restaurantes:</p>
            <div className="product-cards-grid animate-on-scroll">
              <div className="product-card animate-item" style={{backgroundImage: 'url(/images/Productos/gnoccis-de-papa.jpg)'}}>
                <div className="product-card-overlay">
                  <h3>Ñoquis de papa</h3>
                </div>
              </div>
              <div className="product-card animate-item" style={{backgroundImage: 'url(/images/Productos/ravioles.jpeg)'}}>
                <div className="product-card-overlay">
                  <h3>Ravioles</h3>
                  <p>verdura, ricota, jamón y queso, pollo</p>
                </div>
              </div>
              <div className="product-card animate-item" style={{backgroundImage: 'url(/images/Productos/tallarines.PNG)'}}>
                <div className="product-card-overlay">
                  <h3>Tallarines</h3>
                  <p>yema, morrón, espinaca y albahaca</p>
                </div>
              </div>
              <div className="product-card animate-item" style={{backgroundImage: 'url(/images/Productos/sorrentinos.jpg)'}}>
                <div className="product-card-overlay">
                  <h3>Sorrentinos</h3>
                  <p>jamón y queso, capresse, ricota y nuez, verdura</p>
                </div>
              </div>
              <div className="product-card animate-item" style={{backgroundImage: 'url(/images/Productos/empanadas.jpeg)'}}>
                <div className="product-card-overlay">
                  <h3>Tapas de empanadas</h3>
                </div>
              </div>
              <div className="product-card animate-item" style={{backgroundImage: 'url(/images/Productos/Canelones.jpg)'}}>
                <div className="product-card-overlay">
                  <h3>Canelones</h3>
                  <p>Humita, verdura, carne, mixtos</p>
                </div>
              </div>
            </div>
            
            <h2 className="animate-on-scroll animate-item" style={{marginTop: '4rem'}}>Tucos y salsas</h2>
            <p className="facilities-intro animate-on-scroll animate-item">Complementá tus pastas con nuestras salsas artesanales, elaboradas con ingredientes frescos y recetas tradicionales que realzan el sabor de cada plato:</p>
            <div className="product-cards-grid animate-on-scroll">
              <div className="product-card animate-item" style={{backgroundImage: 'url(/images/Salsas/tuco-de-carne.webp)'}}>
                <div className="product-card-overlay">
                  <h3>Tuco de Carne</h3>
                </div>
              </div>
              <div className="product-card animate-item" style={{backgroundImage: 'url(/images/Salsas/tuco-de-pollo.jpg)'}}>
                <div className="product-card-overlay">
                  <h3>Tuco de pollo</h3>
                </div>
              </div>
              <div className="product-card animate-item" style={{backgroundImage: 'url(/images/Salsas/salsa-pomarola.jpg)'}}>
                <div className="product-card-overlay">
                  <h3>Salsa pomarola</h3>
                </div>
              </div>
              <div className="product-card animate-item" style={{backgroundImage: 'url(/images/Salsas/salsa-caruso.webp)'}}>
                <div className="product-card-overlay">
                  <h3>Salsa caruso</h3>
                </div>
              </div>
              <div className="product-card animate-item" style={{backgroundImage: 'url(/images/Salsas/salsa-pesto.webp)'}}>
                <div className="product-card-overlay">
                  <h3>Pesto</h3>
                </div>
              </div>
              <div className="product-card animate-item" style={{backgroundImage: 'url(/images/Salsas/salsa-de-queso.webp)'}}>
                <div className="product-card-overlay">
                  <h3>Salsa de queso</h3>
                </div>
              </div>
            </div>
            
            <h2 className="animate-on-scroll animate-item" style={{marginTop: '4rem'}}>Galería</h2>
            <div className="gallery-grid animate-on-scroll">
              {productImages.map((image, index) => (
                <div key={index} className="gallery-item animate-item" onClick={() => openModal(index)}>
                  <img src={image.src} alt={image.alt} />
                  <div className="gallery-overlay">
                    <span className="zoom-icon">🔍</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="product-note animate-on-scroll animate-item">
              <p><em>Cada bocado tiene historia, textura y sabor real. También desarrollamos recetas personalizadas para clientes frecuentes.</em></p>
            </div>
          </div>
        </section>

        <section id="clients" className="services">
          <div className="container">
            <div className="services-content">
              <div className="services-text animate-on-scroll">
                <h2 className="animate-item">¿A quiénes vendemos?</h2>
                <p className="services-intro animate-item">Aunque somos una fábrica, nuestro espíritu sigue siendo casero. Nos especializamos en venta al por mayor, brindando calidad y cumplimiento a diferentes tipos de negocios:</p>
                <ul>
                  <li><i className="fas fa-building service-icon"></i> Residenciales y hogares de adultos mayores</li>
                  <li><i className="fas fa-users service-icon"></i> Consumidor final</li>
                  <li><i className="fas fa-utensils service-icon"></i> Restaurantes y rotiserías</li>
                  <li><i className="fas fa-shopping-cart service-icon"></i> Almacenes y supermercados</li>
                  <li><i className="fas fa-snowflake service-icon"></i> Tiendas de congelados y productos gourmet</li>
                  <li><i className="fas fa-truck service-icon"></i> Distribuidores y revendedores</li>
                </ul>
                <p className="services-quote">"Nuestros clientes eligen Bel Mangiare porque saben que el sabor, la textura y la presentación importan. Proveemos a negocios, pero cocinamos como si fuera para nuestra familia."</p>
              </div>
              <div className="services-image">
                <img src="/images/bel-mangiare-images/IMG-20250716-WA0006.jpg" alt="Producción de pastas" />
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="testimonials">
          <div className="container">
            <h2 className="animate-on-scroll animate-item">Testimonios</h2>
            <div className="testimonials-grid animate-on-scroll">
              <div className="testimonial-item animate-item">
                <p>"Las pastas de Bel Mangiare son exactamente lo que buscábamos: sabor casero y calidad constante. Nuestros huéspedes siempre quedan satisfechos."</p>
                <cite>— Carmen, Directora de Residencial San José</cite>
              </div>
              <div className="testimonial-item animate-item">
                <p>"Trabajamos con Bel Mangiare hace 3 años. Su cumplimiento en entrega y la frescura de sus productos nos permite confiar completamente."</p>
                <cite>— Roberto, Dueño de Restaurante Il Forno</cite>
              </div>
              <div className="testimonial-item animate-item">
                <p>"La diferencia se nota en cada bocado. Los ravioles y ñoquis tienen esa textura y sabor que solo se logra con experiencia artesanal."</p>
                <cite>— Lucía, Distribuidora Gourmet</cite>
              </div>
            </div>
          </div>
        </section>

        <section className="why-choose-us">
          <div className="container">
            <h2 className="animate-on-scroll animate-item">¿Por qué elegirnos?</h2>
            <h3 className="animate-on-scroll animate-item">Por qué elegir Bel Mangiare</h3>
            <div className="benefits-grid animate-on-scroll">
              <div className="benefit-item animate-item">
                <i className="fas fa-check-circle benefit-icon"></i>
                <span>Producción artesanal con maquinaria adaptada</span>
              </div>
              <div className="benefit-item animate-item">
                <i className="fas fa-check-circle benefit-icon"></i>
                <span>Sabor casero garantizado</span>
              </div>
              <div className="benefit-item animate-item">
                <i className="fas fa-check-circle benefit-icon"></i>
                <span>Ingredientes frescos y de alta calidad</span>
              </div>
              <div className="benefit-item animate-item">
                <i className="fas fa-check-circle benefit-icon"></i>
                <span>Cumplimiento en tiempo y forma</span>
              </div>
              <div className="benefit-item animate-item">
                <i className="fas fa-check-circle benefit-icon"></i>
                <span>Atención personalizada y directa</span>
              </div>
              <div className="benefit-item animate-item">
                <i className="fas fa-check-circle benefit-icon"></i>
                <span>Pedidos flexibles y sin complicaciones</span>
              </div>
            </div>
            <p className="tagline">"Proveemos a negocios, pero cocinamos como si fuera para nuestra familia."</p>
          </div>
        </section>

        <section id="faq" className="faq">
          <div className="container">
            <h2 className="animate-on-scroll animate-item">Preguntas frecuentes</h2>
            <div className="faq-content animate-on-scroll">
              <div className="faq-text">
                <div className="faq-item animate-item">
                  <h3>¿Venden al público particular?</h3>
                  <p>Sí. Puedes encontrarnos en Montevideo, José Serrato 3647 o enviar un mensaje al WhatsApp, si estás en nuestra zona de envíos podemos enviártelo a tu hogar.</p>
                </div>
                <div className="faq-item animate-item">
                  <h3>¿Tienen mínimo de pedido?</h3>
                  <p>Sí, pero adaptamos según zona y frecuencia. Consultá sin compromiso.</p>
                </div>
                <div className="faq-item animate-item">
                  <h3>¿Puedo elegir el tipo de relleno o tamaño?</h3>
                  <p>Sí, producimos recetas personalizadas para clientes frecuentes.</p>
                </div>
                <div className="faq-item animate-item">
                  <h3>¿Tienen precios online?</h3>
                  <p>No. Cotizamos según volumen y destino. Enviamos propuesta detallada por WhatsApp o mail.</p>
                </div>
                <div className="faq-item animate-item">
                  <h3>¿Cuál es el proceso de pedido?</h3>
                  <p>Contactános por WhatsApp o formulario, definimos productos y cantidades, acordamos entrega y facturación. Simple y directo.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="contact-background">
            <img src="/images/pastas-varias-img.jpg" alt="Contact Background" className="contact-bg-image" />
            <div className="contact-overlay"></div>
          </div>
          <div className="container">
            <div className="contact-header animate-on-scroll">
              <h2 className="animate-item">¿Querés sumar pastas artesanales de verdad a tu negocio?</h2>
              <p className="contact-intro animate-item">Contactános y te enviamos una propuesta clara, rápida y adaptada a tus necesidades.</p>
            </div>
            
            <div className="contact-content-centered">
              <div className="contact-info-centered animate-on-scroll">
                <div className="contact-info-grid">
                  <div className="contact-item animate-item">
                    <div className="contact-icon">📍</div>
                    <h4>Producción</h4>
                    <p>Montevideo, Uruguay</p>
                  </div>
                  
                  <div className="contact-item animate-item">
                    <div className="contact-icon">📞</div>
                    <h4>WhatsApp Pedidos</h4>
                    <p>098 372 261</p>
                  </div>
                  
                  <div className="contact-item animate-item">
                    <div className="contact-icon">🕒</div>
                    <h4>Horarios</h4>
                    <p>Martes a domingo de 8 a 14:30 hs</p>
                  </div>
                  
                  <div className="contact-item animate-item">
                    <div className="contact-icon">✉️</div>
                    <h4>Email</h4>
                    <p>belmangiarepastas.uy@gmail.com</p>
                  </div>
                </div>
              </div>
              
              <div className="contact-form-centered">
                <form className="contact-form" onSubmit={handleSubmit}>
                  <h3>Solicitá tu cotización</h3>
                  
                  {submitStatus === 'success' && (
                    <div className="form-message success">
                      <span>✅ ¡Gracias! Tu solicitud fue enviada exitosamente. Te enviaremos una cotización personalizada pronto.</span>
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="form-message error">
                      <span>❌ Hubo un error al enviar tu solicitud. Por favor, intentá nuevamente.</span>
                    </div>
                  )}
                  
                  <div className="form-group">
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Nombre del contacto" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <input 
                      type="text" 
                      name="businessName"
                      placeholder="Nombre del negocio/empresa" 
                      value={formData.businessName}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <select 
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Tipo de negocio</option>
                      <option value="restaurante">Restaurante</option>
                      <option value="residencial">Residencial/Hogar</option>
                      <option value="almacen">Almacén/Supermercado</option>
                      <option value="rotiseria">Rotisería</option>
                      <option value="distribuidor">Distribuidor</option>
                      <option value="gourmet">Tienda Gourmet</option>
                      <option value="particular">Consumidor Final</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="Teléfono/WhatsApp" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <textarea 
                      name="message"
                      placeholder="Cuéntanos sobre tu negocio y qué productos te interesan..." 
                      rows="5" 
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span>Enviando...</span>
                        <span className="btn-icon">⏳</span>
                      </>
                    ) : (
                      <>
                        <span>Solicitá cotización</span>
                        <span className="btn-icon">→</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-info">
              <h3>Bel Mangiare</h3>
              <p>📍 Producción: Montevideo</p>
              <p>📞 WhatsApp: 098 372 261</p>
              <p>🕒 Martes a domingo de 8 a 14:30 hs</p>
            </div>
            <div className="footer-contact">
              <p>&copy; 2025 Bel Mangiare. Todos los derechos reservados.</p>
              <p>
                <button 
                  className="footer-link" 
                  onClick={openTermsModal}
                >
                  Términos y Condiciones
                </button>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Image Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <button className="modal-nav modal-prev" onClick={prevImage}>‹</button>
            <button className="modal-nav modal-next" onClick={nextImage}>›</button>
            <div className="modal-image-container">
              <img 
                src={productImages[currentImageIndex].src} 
                alt={productImages[currentImageIndex].alt} 
                className="modal-image"
              />
            </div>
            <div className="modal-info">
              <span className="modal-counter">
                {currentImageIndex + 1} / {productImages.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/59898372261?text=Hola!%20Quisiera%20recibir%20más%20información%20sobre%20Bel%20Mangiare%20Pastas"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Contactar por WhatsApp"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.531 3.488"/>
        </svg>
      </a>

      {/* Cookie Consent Banner */}
      {showCookieBanner && (
        <div className="cookie-banner">
          <div className="cookie-content">
            <div className="cookie-text">
              <i className="fas fa-cookie-bite"></i>
              <span>
                Utilizamos cookies para mejorar tu experiencia de navegación y analizar el tráfico del sitio. 
                Al continuar navegando, aceptas nuestro uso de cookies.
              </span>
            </div>
            <div className="cookie-actions">
              <button className="cookie-btn secondary" onClick={openTermsModal}>
                Más información
              </button>
              <button className="cookie-btn primary" onClick={acceptCookies}>
                Aceptar cookies
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="modal-overlay" onClick={closeTermsModal}>
          <div className="terms-modal" onClick={(e) => e.stopPropagation()}>
            <div className="terms-header">
              <h2>Términos y Condiciones</h2>
              <button className="modal-close" onClick={closeTermsModal}>×</button>
            </div>
            <div className="terms-content">
              <h3>1. Información General</h3>
              <p>Bel Mangiare es una empresa dedicada a la elaboración y venta de pastas frescas artesanales en Montevideo, Uruguay. Estos términos y condiciones regulan el uso de nuestro sitio web y los servicios que ofrecemos.</p>
              
              <h3>2. Uso de Cookies</h3>
              <p>Nuestro sitio web utiliza cookies para:</p>
              <ul>
                <li>Mejorar la experiencia de navegación del usuario</li>
                <li>Analizar el tráfico del sitio web</li>
                <li>Recordar tus preferencias de navegación</li>
                <li>Facilitar el funcionamiento de formularios de contacto</li>
              </ul>
              
              <h3>3. Información Personal</h3>
              <p>La información proporcionada a través de nuestros formularios de contacto se utiliza únicamente para:</p>
              <ul>
                <li>Responder a consultas comerciales</li>
                <li>Enviar cotizaciones personalizadas</li>
                <li>Comunicación relacionada con pedidos</li>
              </ul>
              <p>No compartimos tu información personal con terceros sin tu consentimiento explícito.</p>
              
              <h3>4. Productos y Servicios</h3>
              <p>Bel Mangiare se dedica a la venta al por mayor de pastas frescas artesanales. Los precios y disponibilidad están sujetos a cambios sin previo aviso. Las cotizaciones se realizan de manera personalizada según volumen y destino.</p>
              
              <h3>5. Contacto</h3>
              <p>Para consultas sobre estos términos y condiciones, puedes contactarnos a través de:</p>
              <ul>
                <li>Email: belmangiarepastas.uy@gmail.com</li>
                <li>WhatsApp: 098 372 261</li>
                <li>Dirección: Montevideo, Uruguay</li>
              </ul>
              
              <p className="terms-update"><strong>Última actualización:</strong> Enero 2025</p>
            </div>
            <div className="terms-actions">
              <button className="cookie-btn primary" onClick={closeTermsModal}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;