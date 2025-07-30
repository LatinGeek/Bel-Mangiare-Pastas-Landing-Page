import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    familyMemberName: '',
    residentName: '',
    email: '',
    phone: '',
    relationship: '',
    careLevel: '',
    preferredVisitDate: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const facilityImages = [
    { src: "/images/individual-room.jpg", alt: "Habitación individual luminosa" },
    { src: "/images/double-room.jpg", alt: "Habitación doble confortable" },
    { src: "/images/common-area-reading.jpg", alt: "Área común de lectura" },
    { src: "/images/interior-patio.jpg", alt: "Patio interior con plantas" },
    { src: "/images/dining-room.jpg", alt: "Comedor adaptado" },
    { src: "/images/accessible-bathroom.jpg", alt: "Baño adaptado" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    setCurrentImageIndex((prev) => (prev + 1) % facilityImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + facilityImages.length) % facilityImages.length);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // EmailJS configuration
      const templateParams = {
        family_member_name: formData.familyMemberName,
        resident_name: formData.residentName,
        relationship: formData.relationship,
        care_level: formData.careLevel,
        preferred_visit_date: formData.preferredVisitDate,
        from_email: formData.email,
        from_phone: formData.phone,
        message: formData.message,
        to_email: 'contacto@residencialpalermo.com'
      };

      // Send email using EmailJS
      const result = await emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        templateParams,
        'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
      );

      console.log('Email sent successfully:', result);
      
      setSubmitStatus('success');
      setFormData({
        familyMemberName: '',
        residentName: '',
        email: '',
        phone: '',
        relationship: '',
        careLevel: '',
        preferredVisitDate: '',
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
            <h1>Palermo</h1>
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
              <li><a href="#about" onClick={() => scrollToSection('about')}>¿Quiénes somos?</a></li>
              <li><a href="#products" onClick={() => scrollToSection('products')}>Instalaciones</a></li>
              <li><a href="#clients" onClick={() => scrollToSection('clients')}>Servicios</a></li>
              <li><a href="#testimonials" onClick={() => scrollToSection('testimonials')}>Testimonios</a></li>
              <li><a href="#faq" onClick={() => scrollToSection('faq')}>Preguntas frecuentes</a></li>
              <li><a href="#contact" onClick={() => scrollToSection('contact')}>Contacto</a></li>
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
          <li><a href="#about" onClick={() => scrollToSection('about')}>¿Quiénes somos?</a></li>
          <li><a href="#products" onClick={() => scrollToSection('products')}>Instalaciones</a></li>
          <li><a href="#clients" onClick={() => scrollToSection('clients')}>Servicios</a></li>
          <li><a href="#testimonials" onClick={() => scrollToSection('testimonials')}>Testimonios</a></li>
          <li><a href="#faq" onClick={() => scrollToSection('faq')}>Preguntas frecuentes</a></li>
          <li><a href="#contact" onClick={() => scrollToSection('contact')}>Contacto</a></li>
        </ul>
      </nav>

      <main>
        <section id="home" className="hero">
          <img src="/images/hero-facility-exterior.jpg" alt="Residencial Palermo - Facility exterior" className="hero-background" />
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-text-centered">
              <div className="hero-logo">
                <img src="/images/residencial-palermo-logo.png" alt="Residencial Palermo Logo" className="hero-logo-image" />
              </div>
              <h2>Un espacio de tranquilidad y cuidado para tus seres más queridos</h2>
              <p>En Residencial Palermo combinamos atención profesional, privacidad y calidez, para brindar un entorno seguro, digno y humano.</p>

              <div className="hero-actions">
                <div className="hero-cta-row">
                  <button className="cta-button hero-button primary" onClick={() => scrollToSection('contact')}>Coordiná una visita sin compromiso</button>
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
                <span className="badge-icon">🏠</span>
                <span>Más de 15 años cuidando</span>
              </div>
              <h2 className="animate-item">¿Quiénes somos?</h2>
              <p className="about-subtitle-modern animate-item">Un hogar dedicado al cuidado y bienestar de adultos mayores</p>
            </div>
            
            <div className="about-content-modern">
              <div className="about-image-section animate-on-scroll animate-item">
                <div className="about-image-container-modern">
                  <img src="/images/facility-interior.jpg" alt="Residencial Palermo Interior" />
                  <div className="image-overlay-modern">
                    <div className="overlay-content-modern">
                      <h4>15+ años</h4>
                      <p>Brindando cuidado y atención con calidez humana</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 about-quote-modern animate-on-scroll animate-item">
                  <div className="quote-icon">"</div>
                  <blockquote>
                    En Palermo, cada persona es protagonista de su día a día. Después de más de 15 años, seguimos cuidando con la misma pasión: atención humana como en casa, pero con profesionalismo.
                  </blockquote>
                </div>
              </div>
              
              <div className="about-text-modern">
                <div className="about-story-modern animate-on-scroll">
                  <div className="story-item-modern animate-item">
                    <div className="story-number">01</div>
                    <div className="story-content-modern">
                      <h3>Nuestro propósito</h3>
                      <p>
                        Residencial Palermo nace con la vocación de acompañar a los adultos mayores en una etapa de la vida que merece respeto, contención y verdadera calidad humana.
                      </p>
                    </div>
                  </div>
                  
                  <div className="story-item-modern animate-item">
                    <div className="story-number">02</div>
                    <div className="story-content-modern">
                      <h3>Nuestro entorno</h3>
                      <p>
                        Ubicados en un entorno accesible de Montevideo, nuestro hogar fue diseñado para brindar un equilibrio entre tranquilidad, cuidados profesionales y ambiente personalizado. Nos especializamos en recibir tanto personas autoválidas como aquellas que necesitan asistencia leve o moderada.
                      </p>
                    </div>
                  </div>
                  
                  <div className="story-item-modern animate-item">
                    <div className="story-number">03</div>
                    <div className="story-content-modern">
                      <h3>Nuestro equipo</h3>
                      <p>
                        Nuestro equipo está compuesto por profesionales comprometidos, con experiencia en geriatría, enfermería, fisioterapia y acompañamiento emocional. Pero por sobre todo, somos un grupo humano que prioriza el bienestar diario, el respeto mutuo y la cercanía con las familias.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="about-actions-modern animate-on-scroll animate-item">
                  <button className="cta-button primary" onClick={() => scrollToSection('contact')}>Coordiná una visita</button>
                  <button className="cta-button secondary" onClick={() => scrollToSection('products')}>Ver instalaciones</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="facilities">
          <div className="container">
            <h2 className="animate-on-scroll animate-item">Nuestras instalaciones</h2>
            <p className="facilities-intro animate-on-scroll animate-item">Pensadas para favorecer la comodidad, el descanso y la seguridad, nuestras instalaciones ofrecen:</p>
            <div className="facilities-features animate-on-scroll">
              <div className="feature-item animate-item">
                <span className="feature-icon">🏠</span>
                <span>Habitaciones individuales y dobles, ventiladas y luminosas</span>
              </div>
              <div className="feature-item animate-item">
                <span className="feature-icon">🛋️</span>
                <span>Espacios comunes tranquilos para leer, conversar o descansar</span>
              </div>
              <div className="feature-item animate-item">
                <span className="feature-icon">🌿</span>
                <span>Patio interno con plantas y zona de aire libre</span>
              </div>
              <div className="feature-item animate-item">
                <span className="feature-icon">🍽️</span>
                <span>Comedor con menú adaptado a cada residente</span>
              </div>
              <div className="feature-item animate-item">
                <span className="feature-icon">🛁</span>
                <span>Baños adaptados con acceso seguro</span>
              </div>
              <div className="feature-item animate-item">
                <span className="feature-icon">🛏️</span>
                <span>Camas ortopédicas y asistencia si es requerida</span>
              </div>
            </div>
            <div className="gallery-grid animate-on-scroll">
              {facilityImages.map((image, index) => (
                <div key={index} className="gallery-item animate-item" onClick={() => openModal(index)}>
                  <img src={image.src} alt={image.alt} />
                  <div className="gallery-overlay">
                    <span className="zoom-icon">🔍</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="product-note animate-on-scroll animate-item">
              <p><em>Un entorno acogedor y privado, que brinda calma y contención.</em></p>
            </div>
          </div>
        </section>

        <section id="clients" className="services">
          <div className="container">
            <div className="services-header">
              <h2 className="animate-on-scroll animate-item">Servicios que ofrecemos</h2>
              <p className="services-intro animate-on-scroll animate-item">Ofrecemos una atención integral que abarca tanto el cuidado físico como emocional, respetando las particularidades de cada residente</p>
            </div>
            
            <div className="services-grid animate-on-scroll">
              <div className="service-card animate-item">
                <div className="service-icon-container">
                  <span className="service-icon">👩‍⚕️</span>
                </div>
                <h3>Enfermería y supervisión médica</h3>
                <p>Atención profesional las 24 horas con personal especializado en geriatría y cuidados médicos.</p>
              </div>
              
              <div className="service-card animate-item">
                <div className="service-icon-container">
                  <span className="service-icon">🍴</span>
                </div>
                <h3>Alimentación casera adaptada</h3>
                <p>Menús nutritivos y personalizados según las necesidades dietéticas de cada residente.</p>
              </div>
              
              <div className="service-card animate-item">
                <div className="service-icon-container">
                  <span className="service-icon">💊</span>
                </div>
                <h3>Administración de medicación</h3>
                <p>Control y administración segura de medicamentos con seguimiento profesional.</p>
              </div>
              
              <div className="service-card animate-item">
                <div className="service-icon-container">
                  <span className="service-icon">🧼</span>
                </div>
                <h3>Higiene diaria y asistencia</h3>
                <p>Cuidado personal completo con respeto a la dignidad y privacidad de cada persona.</p>
              </div>
              
              <div className="service-card animate-item">
                <div className="service-icon-container">
                  <span className="service-icon">🎵</span>
                </div>
                <h3>Musicoterapia y estimulación</h3>
                <p>Actividades cognitivas y terapia musical para mantener la mente activa y el bienestar emocional.</p>
              </div>
              
              <div className="service-card animate-item">
                <div className="service-icon-container">
                  <span className="service-icon">🧘‍♀️</span>
                </div>
                <h3>Fisioterapia y movilidad</h3>
                <p>Ejercicios adaptados y terapia física para mantener la movilidad y independencia.</p>
              </div>
              
              <div className="service-card animate-item">
                <div className="service-icon-container">
                  <span className="service-icon">📖</span>
                </div>
                <h3>Actividades recreativas</h3>
                <p>Programas de entretenimiento y socialización adaptados a los intereses de cada residente.</p>
              </div>
              
              <div className="service-card animate-item">
                <div className="service-icon-container">
                  <span className="service-icon">🧠</span>
                </div>
                <h3>Acompañamiento emocional</h3>
                <p>Apoyo psicológico y conversación activa para mantener el bienestar mental y social.</p>
              </div>
              
              <div className="service-card animate-item">
                <div className="service-icon-container">
                  <span className="service-icon">📞</span>
                </div>
                <h3>Contacto fluido con la familia</h3>
                <p>Comunicación constante y transparente con familiares sobre el cuidado y bienestar.</p>
              </div>
            </div>
            
            <div className="services-footer animate-on-scroll animate-item">
              <div className="services-quote">
                <p>"Cuidar con sensibilidad, ese es nuestro mayor valor."</p>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="testimonials">
          <div className="container">
            <h2 className="animate-on-scroll animate-item">Testimonios</h2>
            <div className="testimonials-grid animate-on-scroll">
              <div className="testimonial-item animate-item">
                <p>"Palermo fue la mejor decisión para mi abuela. Está tranquila, bien cuidada y siempre acompañada."</p>
                <cite>— Lucía, nieta</cite>
              </div>
              <div className="testimonial-item animate-item">
                <p>"Me sorprendió la calidez y el orden del lugar. Se nota el amor que hay en cada detalle."</p>
                <cite>— Sergio, hijo de residente</cite>
              </div>
              <div className="testimonial-item animate-item">
                <p>"La paz del entorno y el trato del personal hicieron que mi madre se adaptara muy rápido."</p>
                <cite>— Valeria, hija</cite>
              </div>
            </div>
          </div>
        </section>

        <section className="why-choose-us">
          <div className="container">
            <div className="why-choose-us-header">
              <h2 className="animate-on-scroll animate-item">¿Por qué elegirnos?</h2>
              <h3 className="animate-on-scroll animate-item">Porque la calidad de vida también se construye con pequeños gestos.</h3>
            </div>
            
            <div className="benefits-grid animate-on-scroll">
              <div className="benefit-card animate-item">
                <div className="benefit-icon-container">
                  <span className="benefit-icon">🏡</span>
                </div>
                <h3>Entorno silencioso y armonioso</h3>
                <p>Espacios diseñados para la tranquilidad, donde cada rincón respira paz y serenidad para el descanso pleno.</p>
              </div>
              
              <div className="benefit-card animate-item">
                <div className="benefit-icon-container">
                  <span className="benefit-icon">👥</span>
                </div>
                <h3>Atención cercana y con seguimiento</h3>
                <p>Cuidado personalizado con seguimiento continuo de cada residente por nuestro equipo profesional.</p>
              </div>
              
              <div className="benefit-card animate-item">
                <div className="benefit-icon-container">
                  <span className="benefit-icon">🎯</span>
                </div>
                <h3>Plan de actividades suaves y adaptadas</h3>
                <p>Programas diseñados específicamente para cada persona, respetando sus ritmos y preferencias individuales.</p>
              </div>
              
              <div className="benefit-card animate-item">
                <div className="benefit-icon-container">
                  <span className="benefit-icon">💬</span>
                </div>
                <h3>Comunicación directa con la familia</h3>
                <p>Mantenemos a las familias informadas con comunicación transparente y abierta sobre el bienestar de sus seres queridos.</p>
              </div>
              
              <div className="benefit-card animate-item">
                <div className="benefit-icon-container">
                  <span className="benefit-icon">🕒</span>
                </div>
                <h3>Flexibilidad en visitas y rutinas</h3>
                <p>Horarios adaptables que respetan las necesidades familiares y los hábitos de cada residente.</p>
              </div>
              
              <div className="benefit-card animate-item">
                <div className="benefit-icon-container">
                  <span className="benefit-icon">🛡️</span>
                </div>
                <h3>Seguridad las 24 horas</h3>
                <p>Supervisión constante y protocolos de seguridad que garantizan tranquilidad total para residentes y familias.</p>
              </div>
            </div>
            
            <div className="why-choose-us-footer animate-on-scroll animate-item">
              <div className="tagline-card">
                <p>"En Palermo, los días transcurren con calma, respeto y dignidad."</p>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="faq">
          <div className="container">
            <h2 className="animate-on-scroll animate-item">Preguntas frecuentes</h2>
            <div className="faq-content animate-on-scroll">
              <div className="faq-text">
                <div className="faq-item animate-item">
                  <h3>¿Puedo visitar antes de tomar una decisión?</h3>
                  <p>Claro que sí. Coordinamos visitas guiadas para que conozcas nuestras instalaciones y equipo.</p>
                </div>
                <div className="faq-item animate-item">
                  <h3>¿Hay habitaciones privadas disponibles?</h3>
                  <p>Sí. Contamos con habitaciones individuales y compartidas, según disponibilidad y preferencia.</p>
                </div>
                <div className="faq-item animate-item">
                  <h3>¿Aceptan personas autoválidas?</h3>
                  <p>Sí, y nos enfocamos en mantener su autonomía el mayor tiempo posible.</p>
                </div>
                <div className="faq-item animate-item">
                  <h3>¿Qué incluye la tarifa mensual?</h3>
                  <p>Estadía, comidas, atención de salud, higiene diaria, y acceso a todas las actividades.</p>
                </div>
                <div className="faq-item animate-item">
                  <h3>¿Cómo se manejan las visitas familiares?</h3>
                  <p>Con apertura y flexibilidad. Coordinamos horarios según lo que le haga bien al residente.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="contact-background">
            <img src="/images/footer-background.png" alt="Contact Background" className="contact-bg-image" />
            <div className="contact-overlay"></div>
          </div>
          <div className="container">
            <div className="contact-header animate-on-scroll">
              <h2 className="animate-item">¿Querés visitarnos?</h2>
              <p className="contact-intro animate-item">Coordiná un recorrido personalizado y descubrí si este es el lugar adecuado para tu familiar.</p>
            </div>
            
            <div className="contact-content-modern">
              <div className="contact-info-section animate-on-scroll">
                <div className="contact-info-cards">
                  <div className="contact-card animate-item">
                    <div className="contact-icon">📍</div>
                    <div className="contact-content">
                      <h4>Dirección</h4>
                      <p>Montevideo, Uruguay</p>
                    </div>
                  </div>
                  
                  <div className="contact-card animate-item">
                    <div className="contact-icon">📞</div>
                    <div className="contact-content">
                      <h4>Teléfono / WhatsApp</h4>
                      <p>094 xxx xxx</p>
                    </div>
                  </div>
                  
                  <div className="contact-card animate-item">
                    <div className="contact-icon">🕒</div>
                    <div className="contact-content">
                      <h4>Horarios</h4>
                      <p>Lunes a viernes de 10 a 17 hs</p>
                    </div>
                  </div>
                  
                  <div className="contact-card animate-item">
                    <div className="contact-icon">✉️</div>
                    <div className="contact-content">
                      <h4>Email</h4>
                      <p>contacto@residencialpalermo.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="contact-form-section animate-on-scroll">
                <div className="contact-form-container">
                  <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-header">
                      <h3>Coordiná tu visita</h3>
                      <p>Completá el formulario y nos pondremos en contacto contigo</p>
                    </div>
                    
                    {submitStatus === 'success' && (
                      <div className="form-message success">
                        <span>✅ ¡Gracias! Tu solicitud fue enviada exitosamente. Te contactaremos pronto para coordinar la visita.</span>
                      </div>
                    )}
                    
                    {submitStatus === 'error' && (
                      <div className="form-message error">
                        <span>❌ Hubo un error al enviar tu solicitud. Por favor, intentá nuevamente.</span>
                      </div>
                    )}
                    
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Tu nombre (familiar)</label>
                        <input 
                          type="text" 
                          name="familyMemberName"
                          placeholder="Escribe tu nombre completo" 
                          value={formData.familyMemberName}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Nombre del potencial residente</label>
                        <input 
                          type="text" 
                          name="residentName"
                          placeholder="Nombre completo del residente" 
                          value={formData.residentName}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Relación con el residente</label>
                        <select 
                          name="relationship"
                          value={formData.relationship}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecciona una opción</option>
                          <option value="hijo/a">Hijo/a</option>
                          <option value="nieto/a">Nieto/a</option>
                          <option value="cónyuge">Cónyuge</option>
                          <option value="hermano/a">Hermano/a</option>
                          <option value="sobrino/a">Sobrino/a</option>
                          <option value="otro familiar">Otro familiar</option>
                          <option value="amigo/a">Amigo/a</option>
                          <option value="tutor legal">Tutor legal</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>Nivel de cuidado necesario</label>
                        <select 
                          name="careLevel"
                          value={formData.careLevel}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecciona el nivel de cuidado</option>
                          <option value="autoválido">Autoválido (independiente)</option>
                          <option value="asistencia leve">Asistencia leve</option>
                          <option value="asistencia moderada">Asistencia moderada</option>
                          <option value="por evaluar">Por evaluar</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>Email</label>
                        <input 
                          type="email" 
                          name="email"
                          placeholder="tu-email@ejemplo.com" 
                          value={formData.email}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Teléfono / WhatsApp</label>
                        <input 
                          type="tel" 
                          name="phone"
                          placeholder="094 123 456" 
                          value={formData.phone}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="form-group full-width">
                      <label>Fecha preferida para visitar (opcional)</label>
                      <input 
                        type="date" 
                        name="preferredVisitDate"
                        value={formData.preferredVisitDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <label>Mensaje adicional</label>
                      <textarea 
                        name="message"
                        placeholder="Cuéntanos sobre las necesidades específicas o cualquier pregunta que tengas..." 
                        rows="4" 
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
                          <span>Coordiná tu visita</span>
                          <span className="btn-icon">→</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-info">
              <h3>Residencial Palermo</h3>
              <p>📍 Montevideo, Uruguay</p>
              <p>📞 Teléfono / WhatsApp: [09x xxx xxx]</p>
              <p>🕒 Lunes a viernes de 10 a 17 hs</p>
            </div>
            <div className="footer-contact">
              <p>&copy; 2024 Residencial Palermo. Todos los derechos reservados.</p>
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
                src={facilityImages[currentImageIndex].src} 
                alt={facilityImages[currentImageIndex].alt} 
                className="modal-image"
              />
            </div>
            <div className="modal-info">
              <span className="modal-counter">
                {currentImageIndex + 1} / {facilityImages.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;