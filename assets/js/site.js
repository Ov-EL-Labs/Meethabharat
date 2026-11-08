/* meetha bharat° — Shared Site JavaScript
   Handles:
   1. Ov.EL Labs Concept Pre-Roll Bumper & Skip
   2. Page loader
   3. Nav hamburger morph toggle
   4. Scroll reveals (IntersectionObserver)
   5. Signature degree circle (°) button click ripple
   6. Shopping Cart with Cookie & Cache persistence, GST 5% calculation
   7. Ov.EL Labs Demo Concept Checkout Modal (no real wa.me or phone links)
   8. Non-intrusive Demo Concept pill disclaimer
   ---------------------------------------------------------------- */
(function () {
  'use strict';

  /* ----------------------------------------------------------------
     1. Ov.EL Labs Concept Pre-Roll Bumper & Skip
     ---------------------------------------------------------------- */
  var preRoll = document.getElementById('ovelPreRoll');
  var introSeen = false;
  try {
    introSeen = localStorage.getItem('ovelConceptIntroSeen') === 'true';
  } catch (err) {}

  if (introSeen && preRoll) {
    preRoll.remove();
    preRoll = null;
  }

  if (!preRoll) {
    if (!introSeen) {
      preRoll = document.createElement('div');
      preRoll.id = 'ovelPreRoll';
      preRoll.className = 'ovel-preroll-overlay';
      preRoll.innerHTML = '<div class="ovel-composition"><div class="ovel-logo-block"><strong style="font-size:2.2rem;letter-spacing:-.08em">Ov.EL<span style="color:#6214E8">°</span></strong><span class="ovel-sub">WEB AGENCY</span></div><div class="ovel-rule"></div><div class="ovel-copy"><h2>Independent Concept Showcase</h2><p>This project is a non-commercial concept created by <strong>Ov.EL Labs</strong>. It is not the official website of <strong>meetha bharat°</strong>, and no revenue or profit is generated.</p></div></div><div class="ovel-progress-track"><div class="ovel-progress-fill"></div></div>';
      document.body.insertBefore(preRoll, document.body.firstChild);
    }
  }
  if (preRoll) {
    try {
      localStorage.setItem('ovelConceptIntroSeen', 'true');
    } catch (err) {}
    var skipBtn = document.getElementById('ovelSkipIntro') || document.getElementById('ovelSkipBtn');
    function dismissPreRoll() {
      if (preRoll && preRoll.parentNode) {
        preRoll.style.opacity = '0';
        preRoll.style.visibility = 'hidden';
        preRoll.style.pointerEvents = 'none';
        setTimeout(function () {
          if (preRoll && preRoll.parentNode) {
            preRoll.parentNode.removeChild(preRoll);
          }
        }, 500);
      }
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', dismissPreRoll);
    }

    // Auto-remove after 8.0s duration
    setTimeout(dismissPreRoll, 8000);
  }

  /* Sweets page category filters */
  var sweetsFilters = document.querySelectorAll('.page-sweets .filter-btn');
  var sweetProducts = document.querySelectorAll('#productsGrid .product-card');
  sweetsFilters.forEach(function (button) {
    button.addEventListener('click', function () {
      var selectedCategory = button.getAttribute('data-filter');
      sweetsFilters.forEach(function (filter) {
        var isSelected = filter === button;
        filter.classList.toggle('active', isSelected);
        filter.setAttribute('aria-selected', String(isSelected));
      });
      sweetProducts.forEach(function (product) {
        var matches = selectedCategory === 'all' || product.getAttribute('data-category') === selectedCategory;
        product.hidden = !matches;
      });
    });
  });

  /* ----------------------------------------------------------------
     2. Page loader
     ---------------------------------------------------------------- */
  var loader = document.getElementById('mb-loader');
  if (loader) {
    window.addEventListener('load', function () {
      loader.classList.add('mb-loader--done');
      setTimeout(function () {
        if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
      }, 650);
    });
  }

  /* ----------------------------------------------------------------
     3. Nav hamburger (cursive mb morph)
     ---------------------------------------------------------------- */
  var toggle = document.querySelector('.mb-ham-btn');
  var menu   = document.getElementById('mobile-nav') || document.getElementById('mobileNav');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      menu.setAttribute('data-open', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        menu.setAttribute('data-open', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.classList.contains('is-open')) {
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        menu.setAttribute('data-open', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  /* ----------------------------------------------------------------
     4. Scroll reveals (IntersectionObserver)
     ---------------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      io.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ----------------------------------------------------------------
     5. Signature Degree Motif (°) Button Click Ripple
     ---------------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn');
    if (!btn) return;

    var rect = btn.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height) * 2;
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    var ripple = document.createElement('span');
    ripple.className = 'mb-ripple-ring';
    ripple.style.width  = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left   = x + 'px';
    ripple.style.top    = y + 'px';

    btn.appendChild(ripple);

    setTimeout(function () {
      if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
    }, 650);
  });

  /* ----------------------------------------------------------------
     6. Subtle Ov.EL Labs Demo Concept Pill (Fixed Lower Corner)
     ---------------------------------------------------------------- */
  var disclaimerDismissed = false;
  try {
    disclaimerDismissed = localStorage.getItem('ovelDisclaimerDismissed') === 'true';
  } catch (err) {}

  function dismissDisclaimer(pill) {
    if (!pill) return;
    pill.classList.add('is-dismissed');
    try {
      localStorage.setItem('ovelDisclaimerDismissed', 'true');
    } catch (err) {}
    setTimeout(function () {
      if (pill.parentNode) pill.parentNode.removeChild(pill);
    }, 220);
  }

  if (!disclaimerDismissed && !document.querySelector('.ovel-concept-pill')) {
    var demoPill = document.createElement('aside');
    demoPill.className = 'ovel-concept-pill';
    demoPill.setAttribute('aria-label', 'Demo Disclaimer');
    demoPill.innerHTML = '<span class="ovel-concept-dot" aria-hidden="true"></span><span>* Concept Showcase by <strong>Ov.EL Labs</strong> · Not affiliated with Meetha Bharat® · No real orders</span><button type="button" class="ovel-concept-dismiss" aria-label="Hide project disclaimer">&times;</button>';
    document.body.appendChild(demoPill);
  }

  var existingDisclaimer = document.querySelector('.ovel-concept-pill');
  if (existingDisclaimer && !disclaimerDismissed) {
    var disclaimerButton = existingDisclaimer.querySelector('.ovel-concept-dismiss');
    if (!disclaimerButton) {
      disclaimerButton = document.createElement('button');
      disclaimerButton.type = 'button';
      disclaimerButton.className = 'ovel-concept-dismiss';
      disclaimerButton.setAttribute('aria-label', 'Hide project disclaimer');
      disclaimerButton.innerHTML = '&times;';
      existingDisclaimer.appendChild(disclaimerButton);
    }
    disclaimerButton.addEventListener('click', function () {
      dismissDisclaimer(existingDisclaimer);
    });
  } else if (existingDisclaimer && disclaimerDismissed) {
    existingDisclaimer.remove();
  }

  /* ----------------------------------------------------------------
     7. SHOPPING CART ENGINE (Cookies, Cache, GST 5% & Drawer UI)
     ---------------------------------------------------------------- */

  // Cookie storage helpers
  function setCookie(name, value, days) {
    var expires = '';
    if (days) {
      var d = new Date();
      d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + d.toUTCString();
    }
    try {
      document.cookie = name + '=' + encodeURIComponent(JSON.stringify(value)) + expires + '; path=/; SameSite=Lax';
    } catch (err) {}
  }

  function getCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) {
        try {
          return JSON.parse(decodeURIComponent(c.substring(nameEQ.length)));
        } catch (err) {
          return null;
        }
      }
    }
    return null;
  }

  // Dual-sync with localStorage for resilient multi-environment demo
  function loadCart() {
    var c = getCookie('mb_cart');
    if (c && Array.isArray(c)) return c;
    try {
      var s = localStorage.getItem('mb_cart');
      if (s) return JSON.parse(s);
    } catch (e) {}
    return [];
  }

  function saveCart(cart) {
    setCookie('mb_cart', cart, 30);
    try {
      localStorage.setItem('mb_cart', JSON.stringify(cart));
    } catch (e) {}
    updateCartUI();
  }

  var cart = loadCart();

  // Create Cart Backdrop & Drawer DOM elements
  var backdrop = document.createElement('div');
  backdrop.className = 'cart-backdrop';
  backdrop.id = 'mb-cart-backdrop';

  var drawer = document.createElement('aside');
  drawer.className = 'cart-drawer';
  drawer.id = 'mb-cart-drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-label', 'Shopping Cart');

  var toast = document.createElement('div');
  toast.className = 'mb-toast';
  toast.id = 'mb-toast';
  toast.innerHTML = '<span id="toast-text" class="mb-toast-text"></span><button id="toast-view-btn" class="mb-toast-btn">View Cart →</button>';

  // Demo Checkout Modal Element
  var checkoutModal = document.createElement('div');
  checkoutModal.className = 'demo-checkout-modal';
  checkoutModal.id = 'mb-demo-checkout-modal';
  checkoutModal.setAttribute('role', 'dialog');
  checkoutModal.setAttribute('aria-modal', 'true');
  checkoutModal.setAttribute('aria-labelledby', 'demo-modal-title');

  document.body.appendChild(backdrop);
  document.body.appendChild(drawer);
  document.body.appendChild(toast);
  document.body.appendChild(checkoutModal);

  // Inject Cart button into navigation
  function injectNavCartButton() {
    var pageCartBtn = document.getElementById('cartToggleBtn');
    if (pageCartBtn && !pageCartBtn.dataset.cartBound) {
      pageCartBtn.dataset.cartBound = 'true';
      pageCartBtn.addEventListener('click', openCartDrawer);
    }

    var navInner = document.querySelector('.nav-inner');
    if (!navInner || document.getElementById('mb-nav-cart-btn')) return;

    var cartBtn = document.createElement('button');
    cartBtn.id = 'mb-nav-cart-btn';
    cartBtn.className = 'nav-cart-btn';
    cartBtn.setAttribute('aria-label', 'View shopping cart');
    cartBtn.innerHTML =
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>' +
        '<line x1="3" y1="6" x2="21" y2="6"></line>' +
        '<path d="M16 10a4 4 0 0 1-8 0"></path>' +
      '</svg>' +
      '<span class="nav-cart-badge" id="nav-cart-count">0</span>';

    var hamBtn = navInner.querySelector('.mb-ham-btn');
    if (hamBtn) {
      navInner.insertBefore(cartBtn, hamBtn);
    } else {
      navInner.appendChild(cartBtn);
    }

    cartBtn.addEventListener('click', openCartDrawer);
  }

  function openCartDrawer() {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    drawer.classList.remove('is-open');
    if (!checkoutModal.classList.contains('is-active')) {
      backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  backdrop.addEventListener('click', function () {
    closeCartDrawer();
    closeCheckoutModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (checkoutModal.classList.contains('is-active')) {
        closeCheckoutModal();
      } else if (drawer.classList.contains('is-open')) {
        closeCartDrawer();
      }
    }
  });

  // Toast
  var toastTimer = null;
  function showToast(message) {
    var textEl = document.getElementById('toast-text');
    if (textEl) textEl.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 3800);
  }

  document.getElementById('toast-view-btn').addEventListener('click', function () {
    toast.classList.remove('show');
    openCartDrawer();
  });

  // Open Checkout Modal
  function openCheckoutModal() {
    closeCartDrawer();

    var subtotal = 0;
    cart.forEach(function (item) {
      subtotal += (item.price * item.qty);
    });
    var gst = Math.round(subtotal * 0.05 * 100) / 100;
    var grandTotal = Math.round((subtotal + gst) * 100) / 100;

    var itemsList = '';
    cart.forEach(function (item) {
      itemsList += '<div style="display:flex; justify-content:space-between; margin-bottom:6px;">' +
        '<span>' + item.name + ' (' + item.unit + ') × ' + item.qty + '</span>' +
        '<strong>₹' + (item.price * item.qty).toLocaleString('en-IN') + '</strong>' +
      '</div>';
    });

    checkoutModal.innerHTML =
      '<div class="demo-checkout-box">' +
        '<div class="demo-checkout-header">' +
          '<h3 id="demo-modal-title" style="font-family:var(--font-display); font-size:1.1875rem; margin:0;"><svg class="ui-icon ui-icon-inline" aria-hidden="true"><use href="assets/icons/icons.svg#sparkles"></use></svg> Demo Concept Checkout</h3>' +
          '<button id="close-modal-btn" style="background:none; border:none; font-size:1.5rem; cursor:pointer;">&times;</button>' +
        '</div>' +
        '<div class="demo-checkout-body" id="modal-body-content">' +
          '<div class="demo-tag-banner">' +
            '<strong>Non-Commercial Showcase Notice:</strong><br>' +
            'This website is an independent UI/UX concept prototype engineered by <strong>Ov.EL Labs</strong>. No real financial payments or product deliveries are handled. We are not affiliated with Meetha Bharat®.' +
          '</div>' +
          '<h4 style="font-family:var(--font-display); font-size:1rem; margin-bottom:10px;">Order Summary</h4>' +
          '<div class="demo-order-receipt">' +
            itemsList +
            '<div style="border-top:1px dashed rgba(0,0,0,0.15); margin-top:8px; padding-top:8px;">' +
              '<div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Subtotal:</span><span>₹' + subtotal.toLocaleString('en-IN') + '</span></div>' +
              '<div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>GST (5% Mithai Tax):</span><span>₹' + gst.toLocaleString('en-IN') + '</span></div>' +
              '<div style="display:flex; justify-content:space-between; font-weight:700; color:var(--brand-crimson); font-size:1.0625rem; margin-top:6px;">' +
                '<span>Total Payable:</span><span>₹' + grandTotal.toLocaleString('en-IN') + '</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<button id="confirm-demo-btn" class="btn btn-primary" style="width:100%; justify-content:center; margin-bottom:8px;">' +
            'Simulate Order Confirmation' +
          '</button>' +
          '<p style="font-size:0.75rem; color:var(--text-muted); text-align:center; margin:0;">' +
            'Demo simulation only · C Ov.EL Labs A demo website' +
          '</p>' +
        '</div>' +
      '</div>';

    checkoutModal.classList.add('is-active');
    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    document.getElementById('close-modal-btn').addEventListener('click', closeCheckoutModal);

    document.getElementById('confirm-demo-btn').addEventListener('click', function () {
      playSweetSuccessChime();
      var randId = Math.floor(1000 + Math.random() * 9000);
      var body = document.getElementById('modal-body-content');
      body.innerHTML =
        '<div class="order-success-state">' +
          '<span class="order-success-icon"><svg class="ui-icon" aria-hidden="true"><use href="assets/icons/icons.svg#celebration"></use></svg></span>' +
          '<h3 style="font-family:var(--font-display); font-size:1.25rem; color:var(--brand-crimson); margin-bottom:var(--s2);">' +
            'Demo Order Confirmed!' +
          '</h3>' +
          '<p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.6; margin-bottom:var(--s4);">' +
            'Order <strong>#OVEL-' + randId + '</strong> simulated successfully in Sandbox Mode. Total: <strong>₹' + grandTotal.toLocaleString('en-IN') + '</strong> (incl. 5% GST).' +
          '</p>' +
          '<div class="demo-tag-banner" style="text-align:left;">' +
            'Thank you for experiencing this design showcase by <strong>Ov.EL Labs</strong>. All cart cookies have been preserved.' +
          '</div>' +
          '<div style="display:flex; gap:8px; justify-content:center; margin-top:var(--s4);">' +
            '<button id="clear-and-close-btn" class="btn btn-primary" style="font-size:0.875rem;">Clear Cart &amp; Continue</button>' +
            '<button id="close-modal-receipt-btn" class="btn btn-secondary" style="font-size:0.875rem;">Close</button>' +
          '</div>' +
        '</div>';

      document.getElementById('clear-and-close-btn').addEventListener('click', function () {
        cart = [];
        saveCart(cart);
        closeCheckoutModal();
      });

      document.getElementById('close-modal-receipt-btn').addEventListener('click', closeCheckoutModal);
    });
  }

  function playSweetSuccessChime() {
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    var ctx = new AudioCtx();
    var now = ctx.currentTime;
    [523.25, 659.25, 783.99, 987.77].forEach(function (freq, i) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var t = now + i * 0.095;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.06, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 1.2);
    });
  }

  function closeCheckoutModal() {
    checkoutModal.classList.remove('is-active');
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // Calculate totals and render Drawer UI
  function updateCartUI() {
    var totalCount = 0;
    var subtotal = 0;

    cart.forEach(function (item) {
      totalCount += item.qty;
      subtotal += (item.price * item.qty);
    });

    // 5% Indian GST for confectioneries / sweets
    var gst = Math.round(subtotal * 0.05 * 100) / 100;
    var grandTotal = Math.round((subtotal + gst) * 100) / 100;

    // Update Nav Badge
    var badge = document.getElementById('nav-cart-count');
    if (badge) {
      badge.textContent = totalCount;
      badge.classList.add('bump');
      setTimeout(function () { badge.classList.remove('bump'); }, 300);
    }
    var pageBadge = document.getElementById('cartBadgeCount');
    if (pageBadge) {
      pageBadge.textContent = totalCount;
      pageBadge.setAttribute('aria-label', totalCount + ' items in cart');
    }

    // Render Drawer Content
    if (cart.length === 0) {
      drawer.innerHTML =
        '<div class="cart-drawer-header">' +
          '<h3 class="cart-drawer-title">Your Sweet Cart (0)</h3>' +
          '<button class="cart-drawer-close" id="cart-close-btn" aria-label="Close cart">&times;</button>' +
        '</div>' +
        '<div class="cart-drawer-body">' +
          '<div class="cart-empty-state">' +
            '<span class="cart-empty-icon" aria-hidden="true"><svg class="ui-icon ui-icon-inline" aria-hidden="true"><use href="assets/icons/icons.svg#candy"></use></svg></span>' +
            '<p class="cart-empty-text">Your cart is currently empty</p>' +
            '<p class="cart-empty-sub">Explore our handcrafted sweets, crunches &amp; namkeens to add joy to your bag.</p>' +
            '<a href="sweets.html" class="btn btn-primary" style="font-size:0.875rem;">Browse Sweets →</a>' +
          '</div>' +
        '</div>';
    } else {
      var itemsHtml = '';
      cart.forEach(function (item) {
        itemsHtml +=
          '<div class="cart-item" data-id="' + item.id + '">' +
            '<img src="' + item.image + '" alt="' + item.name + '" class="cart-item-img">' +
            '<div class="cart-item-details">' +
              '<h4 class="cart-item-name">' + item.name + '</h4>' +
              '<p class="cart-item-meta">' + (item.unit || '500g') + ' · ₹' + item.price + '</p>' +
              '<div class="cart-qty-ctrl">' +
                '<button class="cart-qty-btn btn-dec" data-id="' + item.id + '" aria-label="Decrease quantity">&minus;</button>' +
                '<span class="cart-qty-val">' + item.qty + '</span>' +
                '<button class="cart-qty-btn btn-inc" data-id="' + item.id + '" aria-label="Increase quantity">&plus;</button>' +
              '</div>' +
            '</div>' +
            '<div style="text-align:right;">' +
              '<p class="cart-item-price">₹' + (item.price * item.qty).toLocaleString('en-IN') + '</p>' +
              '<button class="cart-item-remove btn-del" data-id="' + item.id + '" aria-label="Remove ' + item.name + '">&times;</button>' +
            '</div>' +
          '</div>';
      });

      drawer.innerHTML =
        '<div class="cart-drawer-header">' +
          '<h3 class="cart-drawer-title">Your Sweet Cart (' + totalCount + ')</h3>' +
          '<button class="cart-drawer-close" id="cart-close-btn" aria-label="Close cart">&times;</button>' +
        '</div>' +
        '<div class="cart-drawer-body">' +
          itemsHtml +
        '</div>' +
        '<div class="cart-drawer-footer">' +
          '<div class="bill-breakdown">' +
            '<div class="bill-row"><span>Subtotal:</span><span>₹' + subtotal.toLocaleString('en-IN') + '</span></div>' +
            '<div class="bill-row"><span>GST (5% Mithai Tax):</span><span>₹' + gst.toLocaleString('en-IN') + '</span></div>' +
            '<div class="bill-row"><span>Hubballi Delivery:</span><span style="color:#10b981;font-weight:600;">FREE</span></div>' +
            '<div class="bill-row bill-row--highlight"><span>Total Payable:</span><span class="bill-val">₹' + grandTotal.toLocaleString('en-IN') + '</span></div>' +
          '</div>' +
          '<div class="cart-actions">' +
            '<button type="button" class="btn-whatsapp-order" id="btn-demo-checkout">' +
            'Checkout is a Demo Concept · ₹' + grandTotal.toLocaleString('en-IN') +
            '</button>' +
            '<button class="btn-clear-cart" id="cart-clear-btn">Clear Cart</button>' +
          '</div>' +
          '<p style="font-size:0.71875rem; color:var(--text-muted); text-align:center; margin-top:8px; margin-bottom:0;">' +
            '* Demo concept by Ov.EL Labs. Checkout is illustrative; no real orders are fulfilled.' +
          '</p>' +
        '</div>';
    }

    // Attach drawer button listeners
    var closeBtn = document.getElementById('cart-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);

    var checkoutBtn = document.getElementById('btn-demo-checkout');
    if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckoutModal);

    var clearBtn = document.getElementById('cart-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (confirm('Clear all items from your cart?')) {
          cart = [];
          saveCart(cart);
        }
      });
    }

    drawer.querySelectorAll('.btn-inc').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-id');
        for (var i = 0; i < cart.length; i++) {
          if (cart[i].id === id) {
            cart[i].qty += 1;
            break;
          }
        }
        saveCart(cart);
      });
    });

    drawer.querySelectorAll('.btn-dec').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-id');
        for (var i = 0; i < cart.length; i++) {
          if (cart[i].id === id) {
            cart[i].qty -= 1;
            if (cart[i].qty <= 0) {
              cart.splice(i, 1);
            }
            break;
          }
        }
        saveCart(cart);
      });
    });

    drawer.querySelectorAll('.btn-del').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-id');
        cart = cart.filter(function (it) { return it.id !== id; });
        saveCart(cart);
      });
    });
  }

  // Public Add To Cart Handler
  function addToCart(item) {
    var existing = false;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === item.id) {
        cart[i].qty += (item.qty || 1);
        existing = true;
        break;
      }
    }
    if (!existing) {
      cart.push({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        unit: item.unit || '500g',
        image: item.image,
        qty: item.qty || 1
      });
    }
    saveCart(cart);
    showToast('Added ' + item.name + ' to cart!');
  }

  // Global delegation for any "Add to Cart" / "Order Now" button
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-add-cart');
    if (!btn) return;

    e.preventDefault();
    var card = btn.closest('.sweet-card, .product-card');

    var id = btn.getAttribute('data-id') || (card && card.querySelector('h2, h3') ? card.querySelector('h2, h3').textContent.trim().toLowerCase().replace(/\s+/g, '-') : 'sweet-item');
    var name = btn.getAttribute('data-name') || (card && card.querySelector('h2, h3') ? card.querySelector('h2, h3').textContent.trim() : 'Delightful Sweet');
    var price = Number(btn.getAttribute('data-price') || 380);
    var unit = btn.getAttribute('data-unit') || btn.getAttribute('data-weight') || '500g';
    var imgEl = card && card.querySelector('img');
    var image = btn.getAttribute('data-image') || (imgEl ? imgEl.getAttribute('src') : 'assets/1.-Kaju-Katli.jpg');

    addToCart({
      id: id,
      name: name,
      price: price,
      unit: unit,
      image: image,
      qty: 1
    });
    if (btn.getAttribute('data-open-cart') === 'true') openCartDrawer();
  });

  // Initialize
  injectNavCartButton();
  updateCartUI();

  // Expose to window for testing/debugging
  window.MeethaCart = {
    addToCart: addToCart,
    openCart: openCartDrawer,
    closeCart: closeCartDrawer,
    getCart: function () { return cart; },
    clearCart: function () { cart = []; saveCart(cart); }
  };
})();
