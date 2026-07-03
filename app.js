/* ==========================================================================
   INTERACTIVE LOGIC & ANIMATIONS (GSAP, ScrollTrigger, Confetti)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // --------------------------------------------------------------------------
  // 1. LOADING SCREEN & CURTAIN OPENER
  // --------------------------------------------------------------------------
  const curtainLoader = document.getElementById("curtain-loader");
  const waxSealBtn = document.getElementById("wax-seal-btn");
  const ambientAudio = document.getElementById("ambient-audio");
  const audioToggleBtn = document.getElementById("audio-toggle-btn");

  // Fade in loader typography on load
  gsap.to(".curtain-signature-wrap", {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: "power2.out",
    delay: 0.2
  });

  // Action: Break the seal & open the site
  waxSealBtn.addEventListener("click", () => {
    // Add seal breaking micro-animation
    gsap.to(waxSealBtn, {
      scale: 0.8,
      rotation: -15,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        // Trigger page reveal
        document.body.classList.remove("loading-state");
        document.body.classList.add("loader-opened");
        
        // Start background music
        startAudio();
        
        // Staggered entry animation for hero section content
        animateHeroEntrance();
      }
    });
  });

  function animateHeroEntrance() {
    gsap.from("#hero .eyebrow", {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power3.out",
      delay: 0.8
    });
    
    gsap.from(".title-line-1", {
      opacity: 0,
      x: -50,
      duration: 1.2,
      ease: "power4.out",
      delay: 1.0
    });

    gsap.from(".title-line-2", {
      opacity: 0,
      x: 50,
      duration: 1.2,
      ease: "power4.out",
      delay: 1.2
    });

    gsap.from(".hero-tagline-scroller", {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: "power3.out",
      delay: 1.5
    });

    gsap.from(".hero-scroll-cue", {
      opacity: 0,
      y: 15,
      duration: 1,
      ease: "power2.out",
      delay: 2.0
    });
    
    gsap.from(".hero-watermark", {
      opacity: 0,
      scale: 0.8,
      duration: 2.5,
      ease: "power2.out",
      delay: 1.0
    });
  }

  // --------------------------------------------------------------------------
  // 2. CUSTOM CURSOR TRAIL (Desktop)
  // --------------------------------------------------------------------------
  const cursor = document.getElementById("custom-cursor");
  const cursorDot = cursor.querySelector(".cursor-dot");
  const cursorRing = cursor.querySelector(".cursor-ring");

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  // Track mouse coordinates
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Instant dot movement
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Smooth ring follow using requestAnimationFrame interpolation (lerp)
  function updateCursorRing() {
    const lerpFactor = 0.15;
    ringX += (mouseX - ringX) * lerpFactor;
    ringY += (mouseY - ringY) * lerpFactor;
    
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    
    requestAnimationFrame(updateCursorRing);
  }
  updateCursorRing();

  // Hide cursor when leaving window
  document.addEventListener("mouseleave", () => {
    cursor.style.display = "none";
  });
  document.addEventListener("mouseenter", () => {
    cursor.style.display = "block";
  });

  // Helper to rebind cursor hover listeners on dynamically created elements
  function bindCursorEffects() {
    const interactives = document.querySelectorAll("a, button, input, [role='button'], .gallery-item, .joke-card, .spin-button, .love-jar-container");
    interactives.forEach(el => {
      // Avoid double binding
      el.removeEventListener("mouseenter", addCursorHover);
      el.removeEventListener("mouseleave", removeCursorHover);
      el.addEventListener("mouseenter", addCursorHover);
      el.addEventListener("mouseleave", removeCursorHover);
    });
  }

  function addCursorHover() { cursor.classList.add("hovering"); }
  function removeCursorHover() { cursor.classList.remove("hovering"); }

  bindCursorEffects();

  // --------------------------------------------------------------------------
  // 3. BACKGROUND MUSIC (Audio Controller)
  // --------------------------------------------------------------------------
  let isAudioPlaying = false;

  function startAudio() {
    ambientAudio.volume = 0.55; // Clear, audible volume
    ambientAudio.play()
      .then(() => {
        isAudioPlaying = true;
        audioToggleBtn.classList.add("playing");
        audioToggleBtn.querySelector(".audio-status-text").textContent = "SOUND ON";
      })
      .catch((err) => {
        console.log("Audio autoplay prevented. Awaiting user interaction.", err);
      });
  }

  function toggleAudio() {
    if (isAudioPlaying) {
      ambientAudio.pause();
      isAudioPlaying = false;
      audioToggleBtn.classList.remove("playing");
      audioToggleBtn.querySelector(".audio-status-text").textContent = "SOUND OFF";
    } else {
      ambientAudio.play();
      isAudioPlaying = true;
      audioToggleBtn.classList.add("playing");
      audioToggleBtn.querySelector(".audio-status-text").textContent = "SOUND ON";
    }
  }

  audioToggleBtn.addEventListener("click", toggleAudio);

  // --------------------------------------------------------------------------
  // 4. CHAPTER SCROLL COLORS (Theme Morphing & Native Active Class Toggling)
  // --------------------------------------------------------------------------
  const chapters = document.querySelectorAll(".chapter");
  const navDots = document.querySelectorAll(".nav-dot");

  chapters.forEach((chapter) => {
    const themeName = chapter.id;
    const activeDot = document.querySelector(`.nav-dot[href="#${themeName}"]`);
    
    ScrollTrigger.create({
      trigger: chapter,
      start: "top 50%",
      end: "bottom 50%",
      toggleClass: activeDot ? { targets: activeDot, className: "active" } : null,
      onToggle: (self) => {
        if (self.isActive) {
          // Change body theme attribute
          document.body.setAttribute("data-theme", themeName);
        }
      }
    });
  });

  // Smooth scroll for nav dots
  navDots.forEach(dot => {
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = dot.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      
      gsap.to(window, {
        scrollTo: targetSection,
        duration: 1.2,
        ease: "power3.inOut"
      });
    });
  });

  // Force ScrollTrigger refresh on load to ensure nav dots and timelines synchronize
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });

  // --------------------------------------------------------------------------
  // 5. TIMELINE ANIMATIONS (Scroll-triggered markers)
  // --------------------------------------------------------------------------
  const timelineProgressFill = document.querySelector(".timeline-progress-fill");
  const timelineItems = document.querySelectorAll(".timeline-item");

  // Fill progress line on scroll
  gsap.to(timelineProgressFill, {
    height: "100%",
    scrollTrigger: {
      trigger: ".timeline-wrapper",
      start: "top 20%",
      end: "bottom 80%",
      scrub: true
    }
  });

  // Stagger reveal timeline cards
  timelineItems.forEach(item => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  });

  // --------------------------------------------------------------------------
  // 6. GALLERY LIGHTBOX & SHUFFLED POPULATING (Uniform Squares, No Captions)
  // --------------------------------------------------------------------------
  const galleryGridContainer = document.getElementById("gallery-grid-container");
  const lightbox = document.getElementById("gallery-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCloseBtn = document.getElementById("lightbox-close");
  const lightboxPrevBtn = document.getElementById("lightbox-prev");
  const lightboxNextBtn = document.getElementById("lightbox-next");

  // 24 images matching file extensions extracted, including the 2 new ones.
  const galleryImages = [
    { src: 'assets/gallery_5.jpg' },
    { src: 'assets/gallery_6.jpg' },
    { src: 'assets/gallery_7.jpg' },
    { src: 'assets/gallery_8.jpeg' },
    { src: 'assets/gallery_9.jpg' },
    { src: 'assets/gallery_10.jpg' },
    { src: 'assets/gallery_11.jpeg' },
    { src: 'assets/gallery_12.jpeg' },
    { src: 'assets/gallery_13.jpeg' },
    { src: 'assets/gallery_14.jpeg' },
    { src: 'assets/gallery_15.jpg' },
    { src: 'assets/gallery_16.jpeg' },
    { src: 'assets/gallery_17.jpeg' },
    { src: 'assets/gallery_18.jpeg' },
    { src: 'assets/gallery_19.jpeg' },
    { src: 'assets/gallery_20.jpeg' },
    { src: 'assets/gallery_21.jpeg' },
    { src: 'assets/gallery_22.jpeg' },
    { src: 'assets/gallery_23.jpeg' },
    { src: 'assets/gallery_24.jpeg' },
    { src: 'assets/gallery_25.jpeg' },
    { src: 'assets/gallery_26.jpeg' },
    { src: 'assets/gallery_27.jpg' },
    { src: 'assets/gallery_28.jpg' }
  ];

  let shuffledGallery = [];
  let currentGalleryIndex = 0;
  let currentCarouselIndex = 0;

  const carouselImg = document.getElementById("gallery-carousel-img");
  const carouselCounter = document.getElementById("gallery-carousel-counter");
  const carouselPrevBtn = document.getElementById("gallery-carousel-prev");
  const carouselNextBtn = document.getElementById("gallery-carousel-next");
  const carouselCard = document.getElementById("gallery-carousel-card");

  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Populate gallery carousel
  function initGallery() {
    shuffledGallery = shuffleArray(galleryImages);
    currentCarouselIndex = 0;
    
    if (carouselImg) {
      carouselImg.style.backgroundImage = `url('${shuffledGallery[0].src}')`;
      carouselCounter.textContent = `Photo 1 of ${shuffledGallery.length}`;
    }
    
    bindCursorEffects();
  }

  function updateCarousel() {
    const activePhoto = shuffledGallery[currentCarouselIndex];
    gsap.to(carouselImg, {
      opacity: 0,
      scale: 0.98,
      duration: 0.15,
      onComplete: () => {
        carouselImg.style.backgroundImage = `url('${activePhoto.src}')`;
        carouselCounter.textContent = `Photo ${currentCarouselIndex + 1} of ${shuffledGallery.length}`;
        gsap.to(carouselImg, {
          opacity: 1,
          scale: 1,
          duration: 0.25,
          ease: "power2.out"
        });
      }
    });
  }

  function showNextCarouselPhoto() {
    currentCarouselIndex = (currentCarouselIndex + 1) % shuffledGallery.length;
    updateCarousel();
  }

  function showPrevCarouselPhoto() {
    currentCarouselIndex = (currentCarouselIndex - 1 + shuffledGallery.length) % shuffledGallery.length;
    updateCarousel();
  }

  // Navigation button listeners
  if (carouselNextBtn) carouselNextBtn.addEventListener("click", showNextCarouselPhoto);
  if (carouselPrevBtn) carouselPrevBtn.addEventListener("click", showPrevCarouselPhoto);

  // Expand click to open in Lightbox modal
  if (carouselCard) {
    carouselCard.addEventListener("click", () => {
      openLightbox(currentCarouselIndex);
    });

    // Touch swipe gestures
    let startX = 0;
    carouselCard.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    carouselCard.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) showNextCarouselPhoto();
        else showPrevCarouselPhoto();
      }
    }, { passive: true });
  }

  // Open Lightbox
  function openLightbox(index) {
    currentGalleryIndex = index;
    const itemData = shuffledGallery[index];
    
    lightboxImg.src = itemData.src;
    
    lightbox.classList.add("active");
    gsap.fromTo("#lightbox-img", { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" });
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
  }

  function showNextImage() {
    let nextIndex = currentGalleryIndex + 1;
    if (nextIndex >= shuffledGallery.length) nextIndex = 0;
    
    gsap.to("#lightbox-img", {
      opacity: 0,
      scale: 0.98,
      duration: 0.15,
      onComplete: () => {
        openLightbox(nextIndex);
      }
    });
  }

  function showPrevImage() {
    let prevIndex = currentGalleryIndex - 1;
    if (prevIndex < 0) prevIndex = shuffledGallery.length - 1;
    
    gsap.to("#lightbox-img", {
      opacity: 0,
      scale: 0.98,
      duration: 0.15,
      onComplete: () => {
        openLightbox(prevIndex);
      }
    });
  }

  lightboxCloseBtn.addEventListener("click", closeLightbox);
  lightboxNextBtn.addEventListener("click", showNextImage);
  lightboxPrevBtn.addEventListener("click", showPrevImage);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("active")) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNextImage();
      if (e.key === "ArrowLeft") showPrevImage();
    } else {
      // Swipe/change slide in main carousel if section in viewport
      const gallerySec = document.getElementById("gallery");
      if (gallerySec) {
        const galleryRect = gallerySec.getBoundingClientRect();
        const isInViewport = (galleryRect.top < window.innerHeight && galleryRect.bottom > 0);
        if (isInViewport) {
          if (e.key === "ArrowRight") showNextCarouselPhoto();
          if (e.key === "ArrowLeft") showPrevCarouselPhoto();
        }
      }
    }
  });

  initGallery();

  // --------------------------------------------------------------------------
  // 7. SECRETS (Interactive HTML5 Canvas Coupon Spin Wheel - Re-spinnable)
  // --------------------------------------------------------------------------
  const wheelCanvas = document.getElementById("wheel-canvas");
  const ctx = wheelCanvas.getContext("2d");
  const spinBtn = document.getElementById("spin-btn");
  const wheelResult = document.getElementById("wheel-result");
  const resultTitle = document.getElementById("result-title");
  const resultDesc = document.getElementById("result-desc");
  const wheelCanvasWrap = wheelCanvas.parentElement;

  const coupons = [
    { title: "🎨 Pottery Date Coupon", desc: "Redeemable for 1x messy, romantic pottery class with Jay. Tucked in cab ride included!" },
    { title: "🚇 Metro Escort Privilege", desc: "Jay will accompany you to the metro, holding all bags without a single complaint." },
    { title: "📹 Exclusivity of the 4K Video", desc: "Full ownership of THE legendary 4K video. Tradeable for future dates." },
    { title: "🤫 Tease-Free 24 Hours", desc: "Jay will refrain from teasing Sahitya for a full calendar day. Structural integrity guaranteed." },
    { title: "💳 Jay's Wallet Dinner", desc: "No proper scared wallet arguments! Jay treats you to your favorite romantic restaurant." },
    { title: "🤗 Unconditional Mic Support", desc: "1x assistance with reciting beautiful poems, ensuring Jay holds the mic close and watches Saps shine." }
  ];

  const colors = ["#FFB5DA", "#C9B6FF", "#9BF6D6", "#FFF2F6", "#E8C468", "#B2F7EF"];
  const numSegments = coupons.length;
  const segmentAngle = (2 * Math.PI) / numSegments;

  let currentAngle = 0;
  let isSpinning = false;

  function drawWheel() {
    const cx = wheelCanvas.width / 2;
    const cy = wheelCanvas.height / 2;
    const r = cx - 12;

    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);

    for (let i = 0; i < numSegments; i++) {
      const angle = currentAngle + i * segmentAngle;
      
      // Draw segment slice
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, angle + segmentAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();
      ctx.strokeStyle = "rgba(74, 58, 78, 0.15)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw segment text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle + segmentAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#4A3A4E";
      ctx.font = "bold 11px 'Plus Jakarta Sans', sans-serif";
      
      // Truncate segment title for clean canvas layout
      let rawTitle = coupons[i].title.split(" ")[0] + " " + coupons[i].title.split(" ")[1];
      ctx.fillText(rawTitle, r - 30, 4);
      ctx.restore();
    }

    // Draw center circle border details
    ctx.beginPath();
    ctx.arc(cx, cy, 45, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFFDF9";
    ctx.fill();
    ctx.strokeStyle = "rgba(74, 58, 78, 0.2)";
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  drawWheel();

  spinBtn.addEventListener("click", () => {
    if (isSpinning) return;
    
    isSpinning = true;
    spinBtn.disabled = true; // Temporary disable while spinning
    wheelCanvasWrap.classList.add("spinning");
    wheelResult.classList.add("hidden");

    const spinDuration = 3500; // 3.5 seconds
    const startVelocity = Math.random() * 0.25 + 0.35; // Radians per frame
    const friction = 0.985; // Deceleration rate
    let velocity = startVelocity;
    
    const startTime = performance.now();

    function spinAnimation(time) {
      const elapsed = time - startTime;
      
      currentAngle += velocity;
      drawWheel();

      velocity *= friction;

      if (elapsed < spinDuration && velocity > 0.002) {
        requestAnimationFrame(spinAnimation);
      } else {
        isSpinning = false;
        spinBtn.disabled = false; // Re-enable spin button so it can be spun again
        wheelCanvasWrap.classList.remove("spinning");
        
        // Calculate stopping segment index
        // Pointer points straight down from center (1.5 * PI radians)
        const normalizedAngle = ((currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const pointerAngle = (1.5 * Math.PI - normalizedAngle + 2 * Math.PI) % (2 * Math.PI);
        const winningIndex = Math.floor(pointerAngle / segmentAngle) % numSegments;

        displaySpinResult(winningIndex);
      }
    }

    requestAnimationFrame(spinAnimation);
  });

  function displaySpinResult(index) {
    const winner = coupons[index];
    resultTitle.textContent = winner.title;
    resultDesc.textContent = winner.desc;
    
    wheelResult.classList.remove("hidden");
    
    // Shoot confetti burst centered on the result
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#FFB5DA', '#C9B6FF', '#9BF6D6', '#E8C468']
    });
  }

  // --------------------------------------------------------------------------
  // 8. INTERACTIVE CUTE PUZZLE (Click-to-Swap Tile Puzzle)
  // --------------------------------------------------------------------------
  const puzzleGrid = document.getElementById("puzzle-grid");
  const shuffleBtn = document.getElementById("shuffle-puzzle-btn");
  const puzzleSuccessCard = document.getElementById("puzzle-success-card");
  const triviaScrollBtn = document.getElementById("trivia-scroll-btn");

  const rows = 3;
  const cols = 3;
  let tiles = []; // Holds objects: { element, originalIndex, currentIndex }
  let selectedTile = null;
  let isPuzzleSolved = false;

  // Initialize and draw grid tiles
  function initPuzzle() {
    isPuzzleSolved = false;
    selectedTile = null;
    puzzleGrid.classList.remove("solved");
    puzzleSuccessCard.classList.add("hidden");
    shuffleBtn.disabled = false;
    shuffleBtn.style.opacity = "";
    shuffleBtn.textContent = "Reset Puzzle 🔄";

    tiles = [];
    puzzleGrid.innerHTML = "";

    // Generate indices 0 to 8
    let indices = Array.from({ length: rows * cols }, (_, i) => i);
    
    // Shuffle indices. Keep shuffling until it does not match the solved state.
    do {
      indices = shuffleArray(indices);
    } while (isSolvedCheck(indices));

    // Create puzzle tiles in the DOM
    indices.forEach((shuffledIdx, currentPosIdx) => {
      const tile = document.createElement("div");
      tile.className = "puzzle-tile";
      tile.setAttribute("data-original-index", shuffledIdx);
      
      // Calculate background percentage position matching the original index
      const row = Math.floor(shuffledIdx / cols);
      const col = shuffledIdx % cols;
      const xPercent = (col / (cols - 1)) * 100;
      const yPercent = (row / (rows - 1)) * 100;
      tile.style.backgroundPosition = `${xPercent}% ${yPercent}%`;

      tile.addEventListener("click", () => handleTileClick(currentPosIdx));

      puzzleGrid.appendChild(tile);
      tiles.push({
        element: tile,
        originalIndex: shuffledIdx,
        currentIndex: currentPosIdx
      });
    });

    bindCursorEffects();
  }

  function handleTileClick(index) {
    if (isPuzzleSolved) return;

    const clickedTile = tiles[index];

    if (selectedTile === null) {
      // First tile selected
      selectedTile = clickedTile;
      selectedTile.element.classList.add("selected");
    } else if (selectedTile === clickedTile) {
      // De-select if clicking the same tile
      selectedTile.element.classList.remove("selected");
      selectedTile = null;
    } else {
      // Swap tiles!
      swapTiles(selectedTile, clickedTile);
      selectedTile.element.classList.remove("selected");
      selectedTile = null;
      
      // Verify win
      checkPuzzleSolved();
    }
  }

  function swapTiles(tileA, tileB) {
    // 1. Swap background position and originalIndex styles in DOM
    const bgA = tileA.element.style.backgroundPosition;
    const origIdxA = tileA.element.getAttribute("data-original-index");

    tileA.element.style.backgroundPosition = tileB.element.style.backgroundPosition;
    tileA.element.setAttribute("data-original-index", tileB.element.getAttribute("data-original-index"));

    tileB.element.style.backgroundPosition = bgA;
    tileB.element.setAttribute("data-original-index", origIdxA);

    // 2. Swap values in tiles array
    const originalA = tileA.originalIndex;
    tileA.originalIndex = tileB.originalIndex;
    tileB.originalIndex = originalA;
  }

  function isSolvedCheck(indicesArray) {
    return indicesArray.every((val, i) => val === i);
  }

  function checkPuzzleSolved() {
    const isCorrect = tiles.every(tile => tile.originalIndex === tile.currentIndex);

    if (isCorrect) {
      isPuzzleSolved = true;
      puzzleGrid.classList.add("solved");
      shuffleBtn.disabled = true;
      shuffleBtn.style.opacity = "0.5";
      shuffleBtn.textContent = "Solved! 🔓";

      // Remove borders and gaps dynamically
      document.querySelectorAll(".puzzle-tile").forEach(tile => {
        tile.style.border = "none";
        tile.style.borderRadius = "0";
      });

      // Celebration pop-up
      setTimeout(() => {
        puzzleSuccessCard.classList.remove("hidden");
        
        // Staggered confetti burst
        const end = Date.now() + 1500;
        (function frame() {
          confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.8 }
          });
          confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.8 }
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        }());
      }, 800);
    }
  }

  shuffleBtn.addEventListener("click", initPuzzle);

  if (triviaScrollBtn) {
    triviaScrollBtn.addEventListener("click", () => {
      const letterSection = document.getElementById("letter");
      gsap.to(window, {
        scrollTo: letterSection,
        duration: 1.2,
        ease: "power3.inOut"
      });
    });
  }

  initPuzzle();

  // --------------------------------------------------------------------------
  // 9. THE LOVE LETTER (Envelope Animation)
  // --------------------------------------------------------------------------
  const envelope = document.getElementById("letter-envelope");
  const envelopeSealBtn = document.getElementById("envelope-seal-btn");
  const letterSheet = document.getElementById("letter-sheet");

  envelopeSealBtn.addEventListener("click", () => {
    envelope.classList.add("opened");
    
    // Animate envelope sliding down and letter pulling up
    gsap.to(".envelope-flap", {
      rotateX: 180,
      duration: 0.6,
      ease: "power2.inOut"
    });

    gsap.to(envelope, {
      y: 120,
      duration: 0.8,
      ease: "power2.inOut",
      delay: 0.2
    });

    gsap.to(letterSheet, {
      y: -240,
      scale: 1.05,
      height: 480,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.6
    });

    // Make the letter sheet scroll content visible/active after animation
    gsap.delayedCall(1.4, () => {
      letterSheet.style.overflow = "visible";
    });
  });

  // --------------------------------------------------------------------------
  // 10. THE FRIENDSHIP-O-METER (Locked In 4L)
  // --------------------------------------------------------------------------
  const friendshipSlider = document.getElementById("friendship-slider");
  const sliderHighlight = document.getElementById("slider-highlight");
  const meterVal = document.getElementById("meter-val");
  const meterMessage = document.getElementById("meter-message");
  const meterLock = document.getElementById("meter-lock-status");

  // Emoji calibrations from very sad to extremely happy
  const emojiTracks = [
    { max: 15, emoji: "😭" },
    { max: 30, emoji: "😢" },
    { max: 45, emoji: "😔" },
    { max: 60, emoji: "😐" },
    { max: 75, emoji: "🙂" },
    { max: 85, emoji: "😊" },
    { max: 95, emoji: "😁" },
    { max: 99, emoji: "😍" },
    { max: 100, emoji: "🔒🥰" }
  ];

  friendshipSlider.addEventListener("input", (e) => {
    const val = parseInt(e.target.value, 10);
    
    // 1. Update text percentage number
    meterVal.textContent = val;
    
    // 2. Adjust track highlights width
    sliderHighlight.style.width = `${val}%`;
    
    // 3. Find correct emoji step
    let currentEmoji = "";
    for (let track of emojiTracks) {
      if (val <= track.max) {
        currentEmoji = track.emoji;
        break;
      }
    }
    meterMessage.textContent = currentEmoji;
    
    // 4. Lock slider logic when reaching 100% calibration
    if (val === 100) {
      friendshipSlider.disabled = true;
      meterLock.classList.add("locked");
      meterLock.innerHTML = '<i class="fa-solid fa-lock"></i>';
      
      // Update text under slider
      meterMessage.textContent = "LESSSSGGGGOOOOOOOOO";
      meterMessage.style.fontSize = "24px";
      meterMessage.style.color = "var(--accent-color)";
      meterMessage.style.fontWeight = "800";
      
      // Continuous massive full-screen confetti celebration for 3.5 seconds!
      const duration = 3.5 * 1000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 7,
          angle: 60,
          spread: 65,
          origin: { x: 0, y: 0.8 },
          colors: ['#FFB5DA', '#C9B6FF', '#9BF6D6', '#E8C468', '#E0A96D']
        });
        confetti({
          particleCount: 7,
          angle: 120,
          spread: 65,
          origin: { x: 1, y: 0.8 },
          colors: ['#FFB5DA', '#C9B6FF', '#9BF6D6', '#E8C468', '#E0A96D']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  });

  // --------------------------------------------------------------------------
  // 11. GRAND FINALE: CONFETTI & CUSTOM CANVAS FIREWORKS
  // --------------------------------------------------------------------------
  const makeWishBtn = document.getElementById("make-wish-btn");
  const replayBtn = document.getElementById("replay-btn");
  const fireworksCanvas = document.getElementById("fireworks-canvas");
  const fCtx = fireworksCanvas.getContext("2d");

  // Handle canvas sizing
  function resizeFireworksCanvas() {
    fireworksCanvas.width = fireworksCanvas.parentElement.clientWidth;
    fireworksCanvas.height = fireworksCanvas.parentElement.clientHeight;
  }
  resizeFireworksCanvas();
  window.addEventListener("resize", resizeFireworksCanvas);

  // Fireworks Animation State
  let particlesArray = [];
  let isFireworksRunning = false;

  class FireworkParticle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 6 - 3;
      this.speedY = Math.random() * 6 - 3;
      this.color = color;
      this.gravity = 0.05;
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.008;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedY += this.gravity;
      this.alpha -= this.decay;
    }

    draw() {
      fCtx.save();
      fCtx.globalAlpha = this.alpha;
      fCtx.fillStyle = this.color;
      fCtx.beginPath();
      fCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      fCtx.fill();
      fCtx.restore();
    }
  }

  function launchCanvasFirework(centerX, centerY) {
    const palette = ['#FF2E93', '#FFD700', '#00F0FF', '#FF007F', '#C9B6FF', '#9BF6D6'];
    const particleCount = 60;
    
    for (let i = 0; i < particleCount; i++) {
      const color = palette[Math.floor(Math.random() * palette.length)];
      particlesArray.push(new FireworkParticle(centerX, centerY, color));
    }
  }

  function handleFireworksLoop() {
    if (particlesArray.length === 0 && !isFireworksRunning) return;
    
    // Semi-transparent clearing for trails (synchronized to the new bright pink background!)
    fCtx.fillStyle = 'rgba(255, 46, 147, 0.15)';
    fCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
      
      if (particlesArray[i].alpha <= 0) {
        particlesArray.splice(i, 1);
        i--;
      }
    }
    
    requestAnimationFrame(handleFireworksLoop);
  }

  // Wish Button Click trigger
  makeWishBtn.addEventListener("click", () => {
    // 1. Fire canvas-confetti bursts (multi-directional)
    const defaults = { origin: { y: 0.7 } };
    
    function fireConfetti(particleRatio, opts) {
      confetti(Object.assign({}, defaults, opts, {
        particleCount: Math.floor(200 * particleRatio)
      }));
    }

    fireConfetti(0.25, { spread: 26, startVelocity: 55 });
    fireConfetti(0.2, { spread: 60 });
    fireConfetti(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fireConfetti(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fireConfetti(0.1, { spread: 120, startVelocity: 45 });

    // 2. Launch background canvas fireworks
    const clientWidth = fireworksCanvas.width;
    const clientHeight = fireworksCanvas.height;

    // Launch random clusters
    for (let k = 0; k < 6; k++) {
      const rx = Math.random() * (clientWidth - 200) + 100;
      const ry = Math.random() * (clientHeight - 200) + 100;
      
      setTimeout(() => {
        launchCanvasFirework(rx, ry);
      }, k * 180);
    }

    // Start drawing loop if not already running
    if (!isFireworksRunning) {
      isFireworksRunning = true;
      handleFireworksLoop();
    }

    // Interactive button press feedback animation
    gsap.to(makeWishBtn, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
  });

  // Replay Experience (fixed returning to first chapter via ScrollToPlugin)
  replayBtn.addEventListener("click", () => {
    // Scroll smoothly to very top (Chapter 0 curtain load trigger)
    gsap.to(window, {
      scrollTo: 0,
      duration: 1.6,
      ease: "power3.inOut",
      onComplete: () => {
        // Reset states
        document.body.classList.remove("loader-opened");
        document.body.classList.add("loading-state");
        
        // Reset Envelope opened
        envelope.classList.remove("opened");
        gsap.set(".envelope-flap", { rotateX: 0 });
        gsap.set(envelope, { y: 0 });
        gsap.set(letterSheet, { y: 0, scale: 1, height: 340 });
        letterSheet.style.overflow = "hidden";
        
        // Reset Friendship Meter
        friendshipSlider.disabled = false;
        friendshipSlider.value = 0;
        sliderHighlight.style.width = "0%";
        meterVal.textContent = "0";
        meterMessage.textContent = "😭";
        meterMessage.style.fontSize = "";
        meterMessage.style.color = "";
        meterMessage.style.fontWeight = "";
        meterLock.classList.remove("locked");
        meterLock.innerHTML = '<i class="fa-solid fa-unlock-keyhole"></i>';
        
        // Reset Spin Wheel Game
        currentAngle = 0;
        drawWheel();
        spinBtn.disabled = false;
        wheelResult.classList.add("hidden");

        // Reset Puzzle Game
        initPuzzle();

        // Re-shuffle gallery photos
        initGallery();

        // Reset Curtain Signature animation
        gsap.set(".curtain-signature-wrap", { opacity: 0, y: 20 });
        gsap.to(".curtain-signature-wrap", {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          delay: 0.2
        });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 12. EASTER EGG & SYSTEM PREFERS REDUCED MOTION
  // --------------------------------------------------------------------------
  const easterEggBtn = document.getElementById("easter-egg-btn");
  const easterEggModal = document.getElementById("easter-egg-modal");
  const closeEggBtn = document.getElementById("close-egg-btn");

  easterEggBtn.addEventListener("click", () => {
    easterEggModal.classList.add("active");
    confetti({
      particleCount: 30,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FF2E93', '#FFFDF9']
    });
    confetti({
      particleCount: 30,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FF2E93', '#FFFDF9']
    });
  });

  closeEggBtn.addEventListener("click", () => {
    easterEggModal.classList.remove("active");
  });

  // Respect Accessibility preferences: prefers-reduced-motion
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mediaQuery.matches) {
    disableHeavyAnimations();
  }
  mediaQuery.addEventListener("change", () => {
    if (mediaQuery.matches) {
      disableHeavyAnimations();
    }
  });

  function disableHeavyAnimations() {
    console.log("Reduced motion preference detected. Simplifying transitions.");
    
    // Disable Tagline Scroller animation
    const taglineTrack = document.querySelector(".tagline-track");
    if (taglineTrack) taglineTrack.style.animation = "none";
    
    // Disable cursor ring follows
    cursorRing.style.display = "none";
    
    // Simplify scroll markers animations
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // Instant timeline load
    timelineItems.forEach(item => {
      gsap.set(item, { opacity: 1, y: 0 });
    });
    timelineProgressFill.style.height = "100%";
  }

});
