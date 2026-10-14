/**
 * Station Cars Purley - Enhanced Vanilla JavaScript + GSAP
 * Features:
 * - Preloader with car progress animation
 * - Interactive Custom Mouse Cursor with Business Car that drives in direction of motion
 * - Infinite Smooth Marquee Loop for Airport Destinations with click-to-fill
 * - GSAP-powered 3D Perspective Card Tilt on Fleet & Banner
 * - Animated Executive Car driving across buttons on hover
 * - Real-time Fare Estimator & Modal workflows
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Preloader Lifecycle ---
  const preloader = document.getElementById('sitePreloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 550);
    }, 750);
  }

  // --- 2. Custom Interactive Mouse Cursor with Business Car ---
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const cursorCar = document.getElementById('cursorCar');

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let carX = mouseX;
    let carY = mouseY;
    let prevMouseX = mouseX;
    let prevMouseY = mouseY;
    let carAngle = 0;
    let carFlip = 1;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;

      // Calculate movement delta for car orientation
      const dx = mouseX - prevMouseX;
      const dy = mouseY - prevMouseY;
      const dist = Math.hypot(dx, dy);

      if (dist > 3) {
        if (dx < -1) {
          carFlip = -1; // Moving left: flip car to drive left
          carAngle = Math.max(-25, Math.min(25, (dy / Math.abs(dx)) * 30));
        } else if (dx > 1) {
          carFlip = 1; // Moving right: drive right
          carAngle = Math.max(-25, Math.min(25, (dy / dx) * 30));
        }
      }

      prevMouseX = mouseX;
      prevMouseY = mouseY;
    });

    // Smooth lerp loop for the outer cursor ring and business car
    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;

      if (cursorCar) {
        carX += (mouseX - carX) * 0.12;
        carY += (mouseY - carY) * 0.12;

        cursorCar.style.left = `${carX}px`;
        cursorCar.style.top = `${carY}px`;
        cursorCar.style.transform = `translate(-50%, 18px) scaleX(${carFlip}) rotate(${carAngle * carFlip}deg)`;
      }

      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover triggers for interactive elements
    const interactiveSelectors = 'a, button, input, select, textarea, .airport-item, .fleet-card, .banner-airport-row, .benefit-item, .btn-cta, .btn-quote, .app-badge-btn';
    document.querySelectorAll(interactiveSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRing.classList.add('cursor-active');
        if (cursorCar) cursorCar.style.filter = 'drop-shadow(0 6px 14px rgba(255, 212, 0, 0.8))';
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.classList.remove('cursor-active');
        if (cursorCar) cursorCar.style.filter = 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.55))';
      });
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
      if (cursorCar) cursorCar.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
      if (cursorCar) cursorCar.style.opacity = '1';
    });
  }

  // --- 3. Button Driving Car Effect ---
  // Injects miniature executive car that speeds across button on hover
  const carDriverSvgHtml = `
    <div class="btn-car-driver" aria-hidden="true">
      <svg viewBox="0 0 54 26" fill="none">
        <path d="M4 17 L8 17 C10 12, 17 6, 27 6 C35 6, 40 9, 46 13 L49 15 C51.5 16.5, 52 18.5, 50 20.5 C48.5 21.5, 45 21.5, 43 21.5 L39 21.5 C38 18.5, 34 18.5, 33 21.5 L17 21.5 C16 18.5, 12 18.5, 11 21.5 L4 21.5 C2.5 21.5, 1.5 20, 2 18.5 Z" fill="#FFD400"/>
        <circle cx="14" cy="21" r="3.6" fill="#041D34" stroke="#FFD400" stroke-width="1.8"/>
        <circle cx="36" cy="21" r="3.6" fill="#041D34" stroke="#FFD400" stroke-width="1.8"/>
        <circle cx="49" cy="17.5" r="1.5" fill="#FFFFFF"/>
        <path d="M49 17.5 L56 15 L56 20 Z" fill="rgba(255, 255, 255, 0.75)"/>
      </svg>
    </div>
  `;

  document.querySelectorAll('.btn-quote, .btn-cta, .btn-airport-yellow, .btn-bottom-wa, .btn-bottom-book, .btn-whatsapp-header').forEach(btn => {
    btn.classList.add('smoke-btn');
    if (!btn.querySelector('.btn-car-driver')) {
      btn.insertAdjacentHTML('beforeend', carDriverSvgHtml);
    }
  });

  // --- 4. GSAP 3D Interactive Perspective Tilt on Cards ---
  const cardsToTilt = document.querySelectorAll('.fleet-card, .airport-banner-card');
  cardsToTilt.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      if (window.gsap) {
        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          scale: 1.025,
          duration: 0.3,
          ease: 'power1.out',
          transformPerspective: 1000
        });
      } else {
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.025)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (window.gsap) {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.6,
          ease: 'elastic.out(1, 0.45)'
        });
      } else {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      }
    });
  });

  // --- 5. Navigation & Mobile Drawer ---
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerBackdrop = document.getElementById('drawerBackdrop');

  function openDrawer(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('open');
    if (mobileToggle) mobileToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('open');
    if (mobileToggle) mobileToggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  function toggleDrawer(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    if (mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeDrawer(e);
    } else {
      openDrawer(e);
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleDrawer);
  }
  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  document.querySelectorAll('.mobile-drawer-link').forEach(link => {
    link.addEventListener('click', (e) => {
      // Allow navigation to proceed while closing drawer smoothly
      closeDrawer(e);
    });
  });

  // --- 6. Sticky Header on Scroll ---
  const header = document.querySelector('.site-header');
  function handleHeaderScroll() {
    if (window.scrollY > 25) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // --- 7. Modals Management ---
  const quoteModal = document.getElementById('quoteModal');
  const bookingModal = document.getElementById('bookingModal');
  const appModal = document.getElementById('appModal');
  const closeModals = document.querySelectorAll('.modal-close-btn');

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function openModal(modal) {
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModals.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentModal = btn.closest('.modal-backdrop');
      closeModal(parentModal);
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        if (modal.id === 'drawerBackdrop') {
          closeDrawer(e);
        } else {
          closeModal(modal);
        }
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(modal => {
        closeModal(modal);
      });
      closeDrawer();
    }
  });

  // --- 8. Toast Notification Helper ---
  const toast = document.getElementById('appToast');
  let toastTimeout;
  function showToast(message) {
    if (!toast) return;
    const toastMsg = toast.querySelector('.toast-message');
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }

  // --- 9. Button Ripple Micro-interaction ---
  function createRipple(e) {
    const btn = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;
    const rect = btn.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('ripple-span');

    const existingRipple = btn.querySelector('.ripple-span');
    if (existingRipple) existingRipple.remove();

    btn.appendChild(circle);
    setTimeout(() => {
      circle.remove();
    }, 600);
  }

  document.querySelectorAll('.btn-quote, .btn-cta, .btn-whatsapp-header, .btn-bottom-wa, .btn-bottom-book, .btn-airport-yellow, .btn-outline-view').forEach(btn => {
    btn.classList.add('ripple-btn');
    btn.addEventListener('click', createRipple);
  });

  // --- 10. Get a Quote Calculation Logic ---
  const quoteBtn = document.getElementById('btnGetQuote');
  const pickupInput = document.getElementById('pickupLocation');
  const destInput = document.getElementById('destinationLocation');
  const dateTimeInput = document.getElementById('dateTimeInput');
  const passengersInput = document.getElementById('passengersSelect');

  if (dateTimeInput && !dateTimeInput.value) {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    dateTimeInput.placeholder = `${dateStr}, ${timeStr}`;
  }

  function calculateFare(destText, vehicleMultiplier = 1) {
    let baseFare = 38;
    const lower = (destText || '').toLowerCase();
    if (lower.includes('gatwick')) baseFare = 36;
    else if (lower.includes('heathrow')) baseFare = 58;
    else if (lower.includes('stansted')) baseFare = 92;
    else if (lower.includes('luton')) baseFare = 88;
    else if (lower.includes('london city') || lower.includes('city airport')) baseFare = 48;
    else if (lower.includes('central london') || lower.includes('london')) baseFare = 45;

    return Math.round(baseFare * vehicleMultiplier);
  }

  let currentCalculatedDest = 'London Gatwick Airport (LGW)';

  if (quoteBtn) {
    quoteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const pickup = pickupInput?.value.trim() || 'Purley, Surrey';
      const dest = destInput?.value.trim() || 'London Gatwick Airport (LGW)';
      const passengers = passengersInput?.value || '1-2 passengers';
      currentCalculatedDest = dest;

      const baseFare = calculateFare(dest, 1);

      const fareAmountEl = document.getElementById('quoteFareAmount');
      const fareRouteEl = document.getElementById('quoteFareRoute');
      const farePassengersEl = document.getElementById('quoteFarePassengers');

      if (fareAmountEl) {
        fareAmountEl.textContent = `£${baseFare}.00`;
        if (window.gsap) {
          gsap.fromTo(fareAmountEl, { scale: 1.2, color: '#FFD400' }, { scale: 1, color: '#073B66', duration: 0.4 });
        }
      }
      if (fareRouteEl) fareRouteEl.textContent = `${pickup} → ${dest}`;
      if (farePassengersEl) farePassengersEl.textContent = `For ${passengers}`;

      openModal(quoteModal);
    });
  }

  // Vehicle Tier Switcher inside Quote Modal
  const quoteDisplay = document.querySelector('.quote-fare-display');
  if (quoteDisplay && !document.querySelector('.modal-tier-pills')) {
    const pillsContainer = document.createElement('div');
    pillsContainer.className = 'modal-tier-pills';
    pillsContainer.innerHTML = `
      <button type="button" class="tier-pill-btn active" data-mult="1" data-tier="Saloon Cars">Saloon</button>
      <button type="button" class="tier-pill-btn" data-mult="1.4" data-tier="Executive Cars">Executive</button>
      <button type="button" class="tier-pill-btn" data-mult="1.55" data-tier="6–7 Seater MPVs">6–7 MPV</button>
      <button type="button" class="tier-pill-btn" data-mult="1.9" data-tier="8 Seater Minibuses">8 Seater</button>
      <button type="button" class="tier-pill-btn" data-mult="1.1" data-tier="Electric & Hybrid Vehicles">Hybrid</button>
    `;
    quoteDisplay.insertAdjacentElement('afterend', pillsContainer);

    pillsContainer.querySelectorAll('.tier-pill-btn').forEach(pill => {
      pill.addEventListener('click', () => {
        pillsContainer.querySelectorAll('.tier-pill-btn').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const mult = parseFloat(pill.dataset.mult) || 1;
        const tierName = pill.dataset.tier;
        const newPrice = calculateFare(currentCalculatedDest, mult);
        const fareAmountEl = document.getElementById('quoteFareAmount');
        if (fareAmountEl) {
          fareAmountEl.textContent = `£${newPrice}.00`;
          if (window.gsap) {
            gsap.fromTo(fareAmountEl, { scale: 1.15 }, { scale: 1, duration: 0.3 });
          }
        }
        const vehicleSelect = document.getElementById('bookingVehicleType');
        if (vehicleSelect) vehicleSelect.value = tierName;
      });
    });
  }

  // --- 11. Interactive Airport Quick-Select Chips (Works for both Marquee and Banner) ---
  function setupAirportQuickFill(selector) {
    document.querySelectorAll(selector).forEach(item => {
      item.addEventListener('click', () => {
        const airportName = item.querySelector('span')?.textContent?.trim();
        if (airportName && destInput) {
          destInput.value = airportName;
          destInput.focus();
          const formField = destInput.closest('.form-field');
          if (formField) {
            formField.style.borderColor = '#FFD400';
            formField.style.boxShadow = '0 0 0 4px rgba(255, 212, 0, 0.4)';
            setTimeout(() => {
              formField.style.borderColor = '';
              formField.style.boxShadow = '';
            }, 1800);
          }
          const bookingSec = document.getElementById('booking');
          if (bookingSec && window.scrollY > 400) {
            bookingSec.scrollIntoView({ behavior: 'smooth' });
          }
          showToast(`Destination selected: ${airportName}`);
        }
      });
    });
  }
  setupAirportQuickFill('.airport-item');
  setupAirportQuickFill('.banner-airport-row');

  // --- 12. Fleet Cards Interactive Selection ---
  const fleetCards = document.querySelectorAll('.fleet-card');
  fleetCards.forEach(card => {
    card.addEventListener('click', () => {
      fleetCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const vehicleName = card.querySelector('.fleet-name')?.textContent || 'Saloon Cars';
      showToast(`Selected vehicle tier: ${vehicleName}`);
      const vehicleSelect = document.getElementById('bookingVehicleType');
      if (vehicleSelect) {
        vehicleSelect.value = vehicleName;
      }
    });
  });

  // --- 13. Action Buttons Triggers ---
  document.querySelectorAll('.action-call-btn, .btn-phone-header').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Connecting to Station Cars Purley dispatch: 020 8660 6000');
    });
  });

  document.querySelectorAll('.action-whatsapp-btn, .btn-whatsapp-header, .btn-bottom-wa').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = encodeURIComponent('Hello Station Cars Purley, I would like to enquire about a minicab booking.');
      window.open(`https://wa.me/447340985787?text=${text}`, '_blank');
      showToast('Opening WhatsApp to message Station Cars Purley...');
    });
  });

  document.querySelectorAll('.action-book-online-btn, .btn-bottom-book').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Only prevent default and open modal if it's a button, not an anchor tag
      if (btn.tagName === 'BUTTON') {
        e.preventDefault();
        openModal(bookingModal);
      }
      // If it's an anchor tag, let it navigate naturally
    });
  });

  document.querySelectorAll('.action-download-app-btn, .app-badge-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(appModal);
    });
  });

  const bookingForm = document.getElementById('onlineBookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const refId = 'SCP-' + Math.floor(10000 + Math.random() * 90000);
      closeModal(bookingModal);
      showToast(`Booking request received! Ref: #${refId}. Driver confirmation sent to your phone.`);
    });
  }

  const confirmQuoteBtn = document.getElementById('btnConfirmQuoteBooking');
  if (confirmQuoteBtn) {
    confirmQuoteBtn.addEventListener('click', () => {
      closeModal(quoteModal);
      openModal(bookingModal);
    });
  }

  // Smooth scroll to sections for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // --- 14. Intersection Observer for Scroll Animations ---
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.benefit-item, .fleet-card, .airport-banner-card, .bottom-cta-card, .service-full-card, .airport-route-card, .metric-card').forEach((el, index) => {
      el.classList.add('reveal-item');
      el.style.transitionDelay = `${(index % 6) * 0.08}s`;
      revealObserver.observe(el);
    });
  }

  // --- 15. FAQ Accordion Toggle Interaction ---
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const parent = question.closest('.faq-item');
      if (parent) {
        parent.classList.toggle('open');
      }
    });
  });

  // --- 16. Contact Page Form Handler ---
  const contactForm = document.getElementById('contactPageForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const refId = 'SCP-MSG-' + Math.floor(1000 + Math.random() * 9000);
      contactForm.reset();
      showToast(`Thank you! Message transmitted to Purley dispatch. Ref: #${refId}. A controller will contact you shortly.`);
    });
  }
});
