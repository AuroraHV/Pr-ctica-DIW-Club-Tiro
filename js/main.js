document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const html = document.documentElement;
  const darkSwitch = document.getElementById("darkModeSwitch");
  const menuToggle = document.getElementById("menuToggle");
  const sideMenu = document.getElementById("sideMenu");
  const closeMenu = document.getElementById("closeMenu");
  const overlay = document.getElementById("overlay");
  const scrollTopBtn = document.getElementById("toTop");
  let graficoClubInstance = null;

  /* ============================
        MODO OSCURO
  ============================= */
  if (localStorage.getItem("theme") === "dark") {
    html.classList.add("theme-dark");
    darkSwitch?.classList.add("active");
  }

  darkSwitch?.addEventListener("click", () => {
    html.classList.toggle("theme-dark");
    darkSwitch.classList.toggle("active");
    localStorage.setItem(
      "theme",
      html.classList.contains("theme-dark") ? "dark" : "light"
    );
    aplicarTemaGrafico();
  });

  function aplicarTemaGrafico() {
    if (!graficoClubInstance) return;

    const isDark = html.classList.contains("theme-dark");
    const tickColor = isDark ? "#d1d5db" : "#4b5563";
    const gridColor = isDark
      ? "rgba(255,255,255,0.12)"
      : "rgba(0,0,0,0.12)";

    graficoClubInstance.options.scales.x.ticks.color = tickColor;
    graficoClubInstance.options.scales.y.ticks.color = tickColor;
    graficoClubInstance.options.scales.x.grid.color = gridColor;
    graficoClubInstance.options.scales.y.grid.color = gridColor;
    graficoClubInstance.update();
  }

  /* ============================================
        MENÚ LATERAL ACCESIBLE + INERT FIX
  ============================================= */

  let lastFocusedElement = null;

  function disablePanelFocus() {
    sideMenu
      .querySelectorAll("button, a, input, select, textarea")
      .forEach((el) => {
        el.setAttribute("tabindex", "-1");
      });
  }

  function enablePanelFocus() {
    sideMenu
      .querySelectorAll("button, a, input, select, textarea")
      .forEach((el) => {
        el.removeAttribute("tabindex");
      });
  }

  // Menú comienza OCULTO al árbol accesible
  sideMenu.setAttribute("inert", "");
  disablePanelFocus();

  function openPanel() {
    lastFocusedElement = document.activeElement;

    sideMenu.removeAttribute("inert"); // <-- ACTIVAMOS ACCESIBILIDAD

    sideMenu.classList.remove("side-menu-closed");
    sideMenu.classList.add("side-menu-open");
    overlay.classList.add("active");

    sideMenu.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");

    enablePanelFocus();
    closeMenu.focus();

    scrollTopBtn.style.opacity = "0";
    scrollTopBtn.style.pointerEvents = "none";
  }

  function closePanel() {
    sideMenu.classList.remove("side-menu-open");
    sideMenu.classList.add("side-menu-closed");
    overlay.classList.remove("active");

    sideMenu.setAttribute("inert", ""); // <-- PANEL FUERA DEL ÁRBOL ACCESIBLE
    sideMenu.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");

    disablePanelFocus();

    if (lastFocusedElement) lastFocusedElement.focus();

    scrollTopBtn.style.opacity = "0";
    scrollTopBtn.style.pointerEvents = "none";

    const onEnd = () => {
      sideMenu.removeEventListener("transitionend", onEnd);
      scrollTopBtn.style.opacity = "";
      scrollTopBtn.style.pointerEvents = "";
      toggleScrollTopBtn();
    };

    sideMenu.addEventListener("transitionend", onEnd);
  }

  menuToggle?.addEventListener("click", () => {
    const isClosed = sideMenu.classList.contains("side-menu-closed");
    if (isClosed) openPanel();
    else closePanel();
  });

  closeMenu?.addEventListener("click", closePanel);
  overlay?.addEventListener("click", closePanel);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sideMenu.classList.contains("side-menu-open")) {
      closePanel();
    }
  });

  sideMenu.addEventListener("keydown", (e) => {
    if (!sideMenu.classList.contains("side-menu-open")) return;

    const focusable = sideMenu.querySelectorAll(
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ============================================
        CERRAR MENÚ AL HACER SCROLL
  ============================================= */
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    if (sideMenu.classList.contains("side-menu-open")) {
      if (Math.abs(window.scrollY - lastScrollY) > 10) closePanel();
    }
    lastScrollY = window.scrollY;
  });

  /* ============================================
        HEADER SCROLL
  ============================================= */
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    if (window.scrollY > 10) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  });

  /* ============================================
        BOTÓN SUBIR ARRIBA
  ============================================= */

  function toggleScrollTopBtn() {
    if (window.scrollY > 350) {
      scrollTopBtn.classList.remove("hidden");
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
      scrollTopBtn.classList.add("hidden");
    }
  }

  window.addEventListener("scroll", toggleScrollTopBtn);
  toggleScrollTopBtn();

  function scrollToTop() {
    if (!scrollTopBtn) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (scrollTopBtn.classList.contains("shoot")) return;

    scrollTopBtn.classList.add("shoot");
    const flecha = scrollTopBtn.querySelector(".flecha");
    const diana = scrollTopBtn.querySelector(".diana");

    if (flecha) flecha.style.opacity = "1";
    if (diana) diana.style.opacity = "0";

    window.scrollTo({ top: 0, behavior: "smooth" });

    const check = setInterval(() => {
      if (window.scrollY <= 10) {
        clearInterval(check);
        scrollTopBtn.classList.remove("shoot");
        if (flecha) flecha.style.opacity = "1";
        if (diana) diana.style.opacity = "1";
      }
    }, 16);
  }

  scrollTopBtn?.addEventListener("click", scrollToTop);

  document.addEventListener("keydown", (e) => {
    const target = e.target;
    const isEditable =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      target?.isContentEditable;

    if (isEditable) return;

    if (e.key === "Home") {
      e.preventDefault();
      scrollToTop();
    }
  });

  /* ============================================
        ACORDEÓN BOOTSTRAP
  ============================================= */
  const bsAccordion = document.getElementById("accordionCurso");
  if (bsAccordion) {
    const buttons = bsAccordion.querySelectorAll(
      ".accordion-button[data-bs-toggle='collapse']"
    );

    buttons.forEach((btn) => {
      const targetSel = btn.getAttribute("data-bs-target");
      const panel = document.querySelector(targetSel);
      if (!panel) return;

      // Estado inicial 
      if (btn.getAttribute("aria-expanded") === "true") {
        btn.classList.remove("collapsed");
        panel.classList.add("show");
      } else {
        btn.classList.add("collapsed");
        panel.classList.remove("show");
      }

      btn.addEventListener("click", () => {
        const isOpen = !btn.classList.contains("collapsed");
        const parentSel = panel.getAttribute("data-bs-parent");

        // Cerrar todos los hermanos si hay data-bs-parent
        if (parentSel) {
          const parent = document.querySelector(parentSel);
          if (parent) {
            parent
              .querySelectorAll(".accordion-button[data-bs-toggle='collapse']")
              .forEach((otherBtn) => {
                if (otherBtn === btn) return;
                const otherSel = otherBtn.getAttribute("data-bs-target");
                const otherPanel = document.querySelector(otherSel);
                if (!otherPanel) return;
                otherBtn.classList.add("collapsed");
                otherBtn.setAttribute("aria-expanded", "false");
                otherPanel.classList.remove("show");
              });
          }
        }

        // Alternar el panel actual
        if (isOpen) {
          btn.classList.add("collapsed");
          btn.setAttribute("aria-expanded", "false");
          panel.classList.remove("show");
        } else {
          btn.classList.remove("collapsed");
          btn.setAttribute("aria-expanded", "true");
          panel.classList.add("show");
        }
      });
    });
  }

  /* ============================================
        LEER MÁS / LEER MENOS (calendario)
  ============================================= */
  document.querySelectorAll(".js-toggle-extra-info").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("aria-controls");
      const panel = targetId ? document.getElementById(targetId) : null;
      if (!panel) return;

      const isExpanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!isExpanded));
      btn.textContent = isExpanded ? "Leer más" : "Leer menos";
      panel.hidden = isExpanded;
    });
  });

  /* ============================================
        VALORACION DEL CURSO (estrellas)
  ============================================= */
  document.querySelectorAll(".valoracion-estrellas").forEach((group) => {
    const stars = Array.from(group.querySelectorAll(".valoracion-estrella"));
    const outputId = group.getAttribute("data-output");
    const output = outputId ? document.getElementById(outputId) : null;
    const ratingStorageKey = outputId
      ? `cdt-rating-${outputId}`
      : "cdt-rating-curso";

    const labels = {
      1: "1/5 - Muy mejorable",
      2: "2/5 - Puede mejorar",
      3: "3/5 - Bien",
      4: "4/5 - Muy bien",
      5: "5/5 - Excelente",
    };

    const paintStars = (value) => {
      stars.forEach((star, idx) => {
        const isActive = idx < value;
        star.classList.toggle("is-active", isActive);
        star.setAttribute("aria-pressed", String(isActive));
      });

      if (output) {
        output.textContent = value
          ? `Tu valoración: ${labels[value]}`
          : "Selecciona una puntuación.";
      }
    };

    stars.forEach((star) => {
      star.addEventListener("click", () => {
        const value = Number(star.getAttribute("data-rating-value")) || 0;
        paintStars(value);
        localStorage.setItem(ratingStorageKey, String(value));
      });
    });

    const savedValue = Number(localStorage.getItem(ratingStorageKey)) || 0;
    paintStars(savedValue);
  });

  /* ============================================
        CARRITO CON localStorage
  ============================================= */
  const CART_STORAGE_KEY = "cdt-cart";
  const defaultCart = {
    "licencia-f-pistola-25m": 1,
    "licencia-f-carabina-50m": 1,
  };

  const productCatalog = {
    "licencia-f-pistola-25m": {
      id: "licencia-f-pistola-25m",
      name: "Curso Licencia F — Pistola Standard 25M",
      shortName: "Licencia F — Pistola 25M",
      description: "Formación oficial para licencia deportiva",
      price: 350,
      image: "img/curso-pistola-pequeña.png",
      imageSet: [
        "img/curso-pistola-pequeña.png 300w",
        "img/curso-pistola-mediana.png 800w",
        "img/curso-pistola-grande.png 1600w",
      ].join(",\n                  "),
      imageLarge: "img/curso-pistola-grande.png",
      imageAlt: "Curso Licencia F Pistola",
    },
    "licencia-f-carabina-50m": {
      id: "licencia-f-carabina-50m",
      name: "Curso Licencia F — Carabina 50 M",
      shortName: "Licencia F — Carabina 50M",
      description: "Formación oficial para licencia deportiva",
      price: 350,
      image: "img/carabina1p.png",
      imageSet: [
        "img/carabina1p.png 400w",
        "img/carabina1m.png 800w",
        "img/carabina1g.png 1600w",
      ].join(",\n                  "),
      imageLarge: "img/carabina1g.png",
      imageAlt: "Curso Licencia F Carabina 50 M",
    },
    "licencia-e-carabina-50m": {
      id: "licencia-e-carabina-50m",
      name: "Curso Licencia E — Carabina 50 M",
      shortName: "Licencia E — Carabina 50M",
      description: "Curso de iniciación para obtener la Licencia E.",
      price: 350,
      image: "img/carabina3p.png",
      imageSet: [
        "img/carabina3p.png 400w",
        "img/carabina3m.png 800w",
        "img/carabina3g.png 1600w",
      ].join(",\n                  "),
      imageLarge: "img/carabina3g.png",
      imageAlt: "Curso Licencia E Carabina 50 M",
    },
    "licencia-d-carabina-50m": {
      id: "licencia-d-carabina-50m",
      name: "Curso Licencia D — Carabina 50 M",
      shortName: "Licencia D — Carabina 50M",
      description: "Formación para la Licencia D y práctica segura.",
      price: 400,
      image: "img/carabina2p.png",
      imageSet: [
        "img/carabina2p.png 400w",
        "img/carabina2m.png 800w",
        "img/carabina2g.png 1600w",
      ].join(",\n                  "),
      imageLarge: "img/carabina2g.png",
      imageAlt: "Curso Licencia D Carabina 50 M",
    },
    "curso-avanzado-carabina-precision": {
      id: "curso-avanzado-carabina-precision",
      name: "Curso Avanzado — Carabina de Precisión",
      shortName: "Avanzado — Carabina",
      description: "Entrenamiento avanzado para tiradores con experiencia.",
      price: 450,
      image: "img/carabina4p.png",
      imageSet: [
        "img/carabina4p.png 400w",
        "img/carabina4m.png 800w",
        "img/carabina4g.png 1600w",
      ].join(",\n                  "),
      imageLarge: "img/carabina4g.png",
      imageAlt: "Curso avanzado de carabina de precisión",
    },
  };

  function formatPrice(value) {
    return `${value} €`;
  }

  function getStoredCart() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return typeof parsed === "object" && parsed ? parsed : {};
    } catch {
      return {};
    }
  }

  function normalizeCart(cart) {
    return Object.entries(cart).reduce((acc, [productId, qty]) => {
      const quantity = Number(qty);
      if (productCatalog[productId] && Number.isFinite(quantity) && quantity > 0) {
        acc[productId] = Math.floor(quantity);
      }
      return acc;
    }, {});
  }

  function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalizeCart(cart)));
    renderCartUI();
  }

  function ensureCartSeed() {
    if (localStorage.getItem(CART_STORAGE_KEY) === null) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(defaultCart));
    }
  }

  function getCartEntries() {
    const cart = normalizeCart(getStoredCart());
    return Object.entries(cart)
      .map(([productId, quantity]) => {
        const product = productCatalog[productId];
        if (!product) return null;
        return {
          ...product,
          quantity,
          lineTotal: product.price * quantity,
        };
      })
      .filter(Boolean);
  }

  function getCartTotal() {
    return getCartEntries().reduce((total, item) => total + item.lineTotal, 0);
  }

  function addToCart(productId) {
    const cart = normalizeCart(getStoredCart());
    cart[productId] = (cart[productId] || 0) + 1;
    saveCart(cart);
  }

  function updateCartQuantity(productId, delta) {
    const cart = normalizeCart(getStoredCart());
    const currentQty = cart[productId] || 0;
    const nextQty = currentQty + delta;
    if (nextQty > 0) {
      cart[productId] = nextQty;
    } else {
      delete cart[productId];
    }
    saveCart(cart);
  }

  function removeFromCart(productId) {
    const cart = normalizeCart(getStoredCart());
    delete cart[productId];
    saveCart(cart);
  }

  function renderCartSummary() {
    const items = getCartEntries();
    const total = getCartTotal();

    document.querySelectorAll("[data-cart-summary-list]").forEach((list) => {
      list.innerHTML = items
        .map(
          (item) => `
            <li>
              <div class="cart-dropdown-item-row">
                <div class="cart-dropdown-item-main">
                  <button
                    type="button"
                    class="cart-dropdown-item-remove"
                    data-cart-summary-action="remove"
                    data-cart-id="${item.id}"
                    aria-label="Quitar ${item.name} del carrito"
                    title="Quitar producto"
                  >×</button>
                  <span class="cart-dropdown-item-name">${item.shortName}</span>
                </div>
                <span class="cart-dropdown-item-price">${formatPrice(item.lineTotal)}</span>
              </div>
              <div class="cart-dropdown-qty" aria-label="Cantidad en el carrito">
                <button
                  type="button"
                  class="cart-dropdown-qty-btn"
                  data-cart-summary-action="decrease"
                  data-cart-id="${item.id}"
                  aria-label="Reducir cantidad de ${item.name}"
                >−</button>
                <span class="cart-dropdown-qty-value">${item.quantity}</span>
                <button
                  type="button"
                  class="cart-dropdown-qty-btn"
                  data-cart-summary-action="increase"
                  data-cart-id="${item.id}"
                  aria-label="Aumentar cantidad de ${item.name}"
                >+</button>
              </div>
            </li>
          `
        )
        .join("");
    });

    document.querySelectorAll("[data-cart-summary-total]").forEach((el) => {
      el.textContent = formatPrice(total);
    });

    document.querySelectorAll("[data-cart-summary-empty]").forEach((el) => {
      el.hidden = items.length > 0;
    });
  }

  function renderCartPage() {
    const container = document.getElementById("cartItemsContainer");
    const totalValue = document.getElementById("cartTotalValue");
    const emptyState = document.getElementById("cartEmptyState");
    const footer = document.getElementById("cartFooterSummary");

    if (!container || !totalValue || !emptyState || !footer) return;

    const items = getCartEntries();
    const total = getCartTotal();

    if (items.length === 0) {
      container.innerHTML = "";
      totalValue.textContent = formatPrice(0);
      emptyState.hidden = false;
      footer.hidden = true;
      return;
    }

    emptyState.hidden = true;
    footer.hidden = false;
    totalValue.textContent = formatPrice(total);

    container.innerHTML = items
      .map(
        (item) => `
          <div class="cart-item-row" data-cart-item-id="${item.id}">
            <img
              src="${item.image}"
              srcset="
                  ${item.imageSet}
                "
              sizes="(max-width: 768px) 100vw, 240px"
              loading="lazy"
              decoding="async"
              alt="${item.imageAlt}"
              onclick="openLightbox('${item.imageLarge}')"
              class="w-full md:w-60 rounded-md object-cover self-center cursor-zoom-in"
            />

            <div class="cart-item-info">
              <h4 class="cart-item-title">${item.name}</h4>
              <p class="cart-item-meta">${item.description}</p>
            </div>

            <div class="cart-item-price">${formatPrice(item.price)}</div>

            <div class="cart-item-actions">
              <div class="cart-qty" aria-label="Cantidad del producto">
                <button
                  class="cart-qty-btn"
                  type="button"
                  data-cart-action="decrease"
                  data-cart-id="${item.id}"
                  aria-label="Reducir cantidad de ${item.name}"
                >−</button>
                <span class="cart-qty-value">${item.quantity}</span>
                <button
                  class="cart-qty-btn"
                  type="button"
                  data-cart-action="increase"
                  data-cart-id="${item.id}"
                  aria-label="Aumentar cantidad de ${item.name}"
                >+</button>
              </div>

              <button
                class="cart-action js-eliminar-producto"
                title="Eliminar producto"
                aria-label="Eliminar ${item.name}"
                data-product="${item.name}"
                data-cart-id="${item.id}"
                data-bs-toggle="modal"
                data-bs-target="#modalEliminar"
              >
                <svg
                  viewBox="0 0 10.156073 10.219604"
                  xmlns="http://www.w3.org/2000/svg"
                  class="cart-icon"
                >
                  <g transform="rotate(45,128.33668,-74.791173)">
                    <path
                      fill="currentColor"
                      d="m 96.964012,62.352184 h 1.272494 v 12.979434 h -1.272494 z"
                    />
                    <path
                      fill="currentColor"
                      transform="rotate(90)"
                      d="m 68.25058,-104.24583 h 1.272493 v 12.979437 H 68.25058 Z"
                    />
                  </g>
                </svg>
              </button>
            </div>
          </div>
        `
      )
      .join("");
  }

  function renderCartUI() {
    renderCartSummary();
    renderCartPage();
  }

  ensureCartSeed();
  renderCartUI();

  /* ============================================
        MODAL — Eliminar producto
  ============================================= */
  const modal = document.getElementById("modalEliminar");
  const backdrop = document.getElementById("modalBackdrop");
  const modalNombre = document.getElementById("modalProductoNombre");
  const btnConfirmar = document.getElementById("modalConfirmarEliminar");
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  let pendingProductId = null;
  let lastFocusModal = null;

  function abrirModal(nombreProducto, productId) {
    pendingProductId = productId;
    lastFocusModal = document.activeElement;
    if (modalNombre) modalNombre.textContent = nombreProducto;
    backdrop?.classList.add("show");
    modal?.classList.add("show");
    modal?.removeAttribute("aria-hidden");
    document.body.style.overflow = "hidden";
    // Foco al primer botón del modal
    requestAnimationFrame(() => {
      modal?.querySelector("button, [href]")?.focus();
    });
  }

  function cerrarModal() {
    modal?.classList.remove("show");
    backdrop?.classList.remove("show");
    modal?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    pendingProductId = null;
    lastFocusModal?.focus();
  }

  cartItemsContainer?.addEventListener("click", (e) => {
    const target = e.target.closest("button");
    if (!target) return;

    const productId = target.getAttribute("data-cart-id");
    if (!productId) return;

    const cartAction = target.getAttribute("data-cart-action");
    if (cartAction === "increase") {
      updateCartQuantity(productId, 1);
      return;
    }

    if (cartAction === "decrease") {
      updateCartQuantity(productId, -1);
      return;
    }

    if (target.classList.contains("js-eliminar-producto")) {
      const nombre = target.getAttribute("data-product") || "este producto";
      abrirModal(nombre, productId);
    }
  });

  // Confirmar eliminación
  btnConfirmar?.addEventListener("click", () => {
    if (pendingProductId) {
      removeFromCart(pendingProductId);
    }
    cerrarModal();
  });

  document.querySelectorAll("[data-bs-dismiss='modal']").forEach((el) => {
    el.addEventListener("click", cerrarModal);
  });

  backdrop?.addEventListener("click", cerrarModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("show")) {
      cerrarModal();
    }
  });

  /* ============================================
        DESPLEGABLE CARRITO
  ============================================= */
  const cartToggle = document.getElementById("cartToggle");
  const cartDropdown = document.getElementById("cartDropdown");

  function closeCartDropdown() {
    if (!cartToggle || !cartDropdown) return;
    cartDropdown.classList.remove("open");
    cartToggle.setAttribute("aria-expanded", "false");
    cartDropdown.setAttribute("aria-hidden", "true");
  }

  if (cartToggle && cartDropdown) {
    cartToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = cartDropdown.classList.toggle("open");
      cartToggle.setAttribute("aria-expanded", String(isOpen));
      cartDropdown.setAttribute("aria-hidden", String(!isOpen));
    });

    cartDropdown.addEventListener("click", (e) => {
      e.stopPropagation();

      const target = e.target.closest("button");
      if (!target) return;

      if (target.classList.contains("cart-dropdown-close")) {
        closeCartDropdown();
        cartToggle.focus();
        return;
      }

      const productId = target.getAttribute("data-cart-id");
      const summaryAction = target.getAttribute("data-cart-summary-action");
      if (!productId || !summaryAction) return;

      if (summaryAction === "remove") {
        removeFromCart(productId);
        return;
      }

      if (summaryAction === "increase") {
        updateCartQuantity(productId, 1);
      }

      if (summaryAction === "decrease") {
        updateCartQuantity(productId, -1);
      }
    });

    // Cerrar al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (
        !cartToggle.contains(e.target) &&
        !cartDropdown.contains(e.target)
      ) {
        closeCartDropdown();
      }
    });

    // Cerrar con Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && cartDropdown.classList.contains("open")) {
        closeCartDropdown();
        cartToggle.focus();
      }
    });
  }

  /* ============================================
        NOTIFICACIONES
  ============================================= */
  const siteHeader = document.querySelector(".header");
  const notificacionCarrito = document.getElementById("notificacion-carrito");

  function actualizarOffsetHeader() {
    const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
    document.documentElement.style.setProperty(
      "--header-offset",
      `${headerHeight}px`
    );
  }

  actualizarOffsetHeader();
  window.addEventListener("resize", actualizarOffsetHeader);

  function mostrarNotificacion(el) {
    if (!el) return;
    actualizarOffsetHeader();
    // Reinicia si ya estaba visible
    el.classList.remove("show");
    clearTimeout(el._autoClose);

    // reiniciar la transición
    void el.offsetWidth;
    el.classList.add("show");

    // Auto-cierre a los 4 s
    el._autoClose = setTimeout(() => cerrarNotificacion(el), 4000);
  }

  function cerrarNotificacion(el) {
    if (!el) return;
    el.classList.remove("show");
  }

  // Botones de añadir al carrito
  document.querySelectorAll(".js-add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.getAttribute("data-cart-id");
      if (productId && productCatalog[productId]) {
        addToCart(productId);
      }
      mostrarNotificacion(notificacionCarrito);
    });
  });

  // Botón de cierre manual
  document
    .querySelectorAll("[data-bs-dismiss='alert']") 
    .forEach((closeBtn) => {
      closeBtn.addEventListener("click", () => {
        const alert = closeBtn.closest(".alert");
        cerrarNotificacion(alert);
      });
    });

  /* ============================================
        PESTAÑAS BOOTSTRAP
  ============================================= */
  const bsTabList = document.getElementById("cursoTab");
  if (bsTabList) {
    const tabButtons = bsTabList.querySelectorAll(
      "button[data-bs-toggle='tab']"
    );

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Desactivar todas las pestañas y paneles
        tabButtons.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
          const pane = document.querySelector(b.getAttribute("data-bs-target"));
          if (pane) {
            pane.classList.remove("show", "active");
          }
        });

        // Activar la pestaña pulsada
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");

        const target = document.querySelector(
          btn.getAttribute("data-bs-target")
        );
        if (target) {
          target.classList.add("active");
          requestAnimationFrame(() => {
            requestAnimationFrame(() => target.classList.add("show"));
          });
        }
      });

      // Navegación con teclado
      btn.addEventListener("keydown", (e) => {
        const all = [...tabButtons];
        const idx = all.indexOf(btn);
        let next = null;
        if (e.key === "ArrowRight") next = all[(idx + 1) % all.length];
        if (e.key === "ArrowLeft") next = all[(idx - 1 + all.length) % all.length];
        if (next) {
          next.focus();
          next.click();
        }
      });
    });
  }

  /* ============================================
        BUSCADOR
  ============================================= */
  const searchForm = document.getElementById("menuSearchForm");
  const searchInput = document.getElementById("menuSearchInput");

  searchForm?.addEventListener("submit", (e) => {
    if (!searchInput.value.trim()) e.preventDefault();
  });

  /* ============================================
        CARRUSEL HERO ACCESIBLE
  ============================================= */
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");

  let currentSlide = 0;
  let slideInterval;
  let userKeyboard = false;

  document.addEventListener("keydown", () => (userKeyboard = true));

  function showSlide(index) {
    slides.forEach((slide, i) => {
      const active = index === i;

      slide.style.opacity = active ? "1" : "0";
      slide.style.zIndex = active ? "10" : "0";
      slide.setAttribute("aria-hidden", active ? "false" : "true");

      if (active) {
        slide.removeAttribute("inert");
        slide.removeAttribute("tabindex");
      } else {
        slide.setAttribute("inert", "");
        slide.setAttribute("tabindex", "-1");
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
      dot.setAttribute("aria-current", i === index);
    });

    if (userKeyboard) {
      const content = slides[index].querySelector(".hero-content");
      if (content) content.focus();
    }

    currentSlide = index;
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
  }

  function prevSlide() {
    showSlide((currentSlide - 1 + slides.length) % slides.length);
  }

  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  dots.forEach((dot, i) => dot.addEventListener("click", () => showSlide(i)));

  function startCarousel() {
    slideInterval = setInterval(nextSlide, 6000);
  }

  function stopCarousel() {
    clearInterval(slideInterval);
  }

  const hero = document.querySelector("#hero-carousel");
  hero.addEventListener("mouseenter", stopCarousel);
  hero.addEventListener("mouseleave", startCarousel);

  showSlide(0);
  startCarousel();

  /* ============================================
        LINK ACTIVO DEL MENÚ
  ============================================= */
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll("#sideMenu .menu-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (href === "index.html" && currentPage === "")) {
      link.classList.add("active");
    }
  });

  /* ========================================
   CHART.JS – ESTADÍSTICAS CLUB
======================================== */

const ctx = document.getElementById("graficoClub");
let temporada = 2024;
const labelTemporada = document.getElementById("anioGrafico");


if (ctx) {

  let datos1 = [120, 35, 4, 240];
  let datos2 = [150, 50, 10, 320];

  graficoClubInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Tiradores activos", "Competiciones", "Cursos", "Alumnos"],
      datasets: [{
        label: "Datos anuales",
        data: datos1,
        backgroundColor: [
          "#0B3C5D",
          "#EAC42D",
          "#A83636",
          "#2C7A7B"
        ],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      animation: {
        duration: 1500
      },
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { color: "#4b5563" },
          grid: { color: "rgba(0,0,0,0.12)" }
        },
        y: {
          beginAtZero: true,
          ticks: { color: "#4b5563" },
          grid: { color: "rgba(0,0,0,0.12)" }
        }
      }
    }
  });

  aplicarTemaGrafico();

  document.getElementById("cambiarDatos").addEventListener("click", () => {

    const mostrandoDatos1 = graficoClubInstance.data.datasets[0].data[0] === datos1[0];

    if (mostrandoDatos1) {
      graficoClubInstance.data.datasets[0].data = datos2;
      temporada = 2025;
    } else {
      graficoClubInstance.data.datasets[0].data = datos1;
      temporada = 2024;
    }

    // actualizar texto visible al usuario
    labelTemporada.textContent = "Temporada " + temporada;

    graficoClubInstance.update();
  });
}

});

// ===========================
// LIGHTBOX GLOBAL
// ===========================

function openLightbox(imgSrc) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  lightboxImg.src = imgSrc;
  lightbox.classList.remove("hidden");
  lightbox.classList.add("flex");
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");

  lightbox.classList.add("hidden");
  lightbox.classList.remove("flex");
}

/* ========================================
   ANIMACIONES AL HACER SCROLL
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {

  const reveals = document.querySelectorAll(".reveal, .reveal-zoom");

  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },{
    threshold:0.2
  });

  reveals.forEach(el => observer.observe(el));

});

