(function () {
  'use strict';

  // --- Local confetti (no CDN = no tracking-prevention issues) ---
  var confettiParticles = [];
  var confettiCanvas = document.getElementById('confetti-canvas');
  var confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  var confettiDpr = window.devicePixelRatio || 1;

  function resizeConfettiCanvas() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth * confettiDpr;
    confettiCanvas.height = window.innerHeight * confettiDpr;
    confettiCanvas.style.width = window.innerWidth + 'px';
    confettiCanvas.style.height = window.innerHeight + 'px';
    if (confettiCtx) confettiCtx.setTransform(confettiDpr, 0, 0, confettiDpr, 0, 0);
  }
  if (confettiCanvas) {
    resizeConfettiCanvas();
    window.addEventListener('resize', resizeConfettiCanvas);
  }

  function addConfetti(opts) {
    if (!confettiCanvas || !confettiCtx) return;
    var count = opts.particleCount || 80;
    var colors = opts.colors || ['#e8a0a8', '#f5c6ce', '#c97b85', '#c9a962', '#fff'];
    var origin = opts.origin || { x: 0.5, y: 0.5 };
    var angle = (opts.angle || 90) * (Math.PI / 180);
    var spread = (opts.spread || 60) * (Math.PI / 180);
    var w = confettiCanvas.width;
    var h = confettiCanvas.height;
    for (var i = 0; i < count; i++) {
      var a = angle + (Math.random() - 0.5) * spread;
      var v = 4 + Math.random() * 8;
      confettiParticles.push({
        x: w * origin.x,
        y: h * origin.y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 6,
      });
    }
    if (!window._confettiRaf) {
      function tick() {
        if (!confettiCtx || !confettiCanvas) return;
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        var alive = 0;
        confettiParticles.forEach(function (p) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.15;
          p.vx *= 0.99;
          p.vy *= 0.99;
          if (p.y < confettiCanvas.height + 20) alive++;
          confettiCtx.fillStyle = p.color;
          confettiCtx.beginPath();
          confettiCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          confettiCtx.fill();
        });
        confettiParticles = confettiParticles.filter(function (p) { return p.y < confettiCanvas.height + 20; });
        if (confettiParticles.length > 0) {
          window._confettiRaf = requestAnimationFrame(tick);
        } else {
          window._confettiRaf = null;
        }
      }
      window._confettiRaf = requestAnimationFrame(tick);
    }
  }

  // --- Refs ---
  const scrollDown = document.getElementById('scroll-down');
  const hero = document.getElementById('hero');
  const memesSection = document.getElementById('memes');
  const choiceSection = document.getElementById('choice');
  const successSection = document.getElementById('success');
  const btnYes = document.getElementById('btn-yes');
  const btnThink = document.getElementById('btn-think');
  const addToCalendar = document.getElementById('add-to-calendar');
  const nameTarget = document.getElementById('name-target');
  const sparkle = document.getElementById('sparkle');
  const eggToast = document.getElementById('egg-toast');
  const memeCards = document.querySelectorAll('.meme-card');
  const quizForm = document.getElementById('quiz-form');
  const quizResult = document.getElementById('quiz-result');
  const quizResultText = document.getElementById('quiz-result-text');
  const quizRedo = document.getElementById('quiz-redo');
  const quizPassed = document.getElementById('quiz-passed');
  const quizScrollToChoice = document.getElementById('quiz-scroll-to-choice');
  const quizScrollToPretty = document.getElementById('quiz-scroll-to-pretty');
  const prettyQuizSlides = document.getElementById('pretty-quiz-slides');
  const prettySlides = document.querySelectorAll('.pretty-slide');
  const prettyQuizDone = document.getElementById('pretty-quiz-done');
  const prettyQuizToCute = document.getElementById('pretty-quiz-to-cute');
  const cuteTogetherSection = document.getElementById('cute-together');
  const btnYesBabiii = document.getElementById('btn-yes-babiii');
  const btnYesBabbiii = document.getElementById('btn-yes-babbiii');

  // --- Lore Quiz ---
  const QUIZ_ANSWERS = ['A', 'B', 'B', 'A', 'B', 'C', 'C', 'C', 'D', 'C'];
  const QUIZ_PASS_SCORE = 7;

  function getQuizScore() {
    var score = 0;
    for (var i = 1; i <= 10; i++) {
      var selected = document.querySelector('input[name="q' + i + '"]:checked');
      if (selected && selected.value === QUIZ_ANSWERS[i - 1]) score++;
    }
    return score;
  }

  var MOCK_BY_WRONG = [
    /* 0 wrong */ '10/10. PERFECT. You actually paid attention. Babe is impressed 💕',
    /* 1 wrong */ '9/10. One wrong. ONE. We had one job. (Okay fine, you still passed. Scroll down 💕)',
    /* 2 wrong */ '8/10. Barely made it. Two wrong answers. Babe is watching you 👀 (But you\'re in. Scroll down!)',
    /* 3 wrong */ '7/10. Three wrong. That\'s a whole chunk of the lore. Babe is disappointed 😤 Try again!',
    /* 4 wrong */ '6/10. Four wrong. Half the quiz said "nope." Who are you, and do you even remember March 2024? 😭 Redo it!',
    /* 5 wrong */ '5/10. Five wrong. That\'s more wrong than right. WTF Babi 😤',
    /* 6 wrong */ '4/10. Six wrong. Come on bruh. Redo the quiz 😤',
    /* 7 wrong */ '3/10. Seven wrong. SEVEN. At this point you\'re just guessing. Do you even know my name? Babi Try again!',
    /* 8 wrong */ '2/10. Two right. The bar was on the floor and you brought a shovel 😭 Redo!',
    /* 9 wrong */ '1/10. One right. One. Babe is very disappointed. W0w Babi. Redo the quiz 😤',
    /* 10 wrong */ '0/10. Zero. ZERO. Babe is very disappointed. (Redo the quiz 😤)'
  ];

  function showQuizResult(passed, score) {
    var wrongCount = 10 - score;
    var msg = MOCK_BY_WRONG[wrongCount];
    quizForm.style.display = 'none';
    quizResult.classList.remove('quiz-result--hidden');
    quizResult.classList.remove('pass', 'fail');
    quizResult.classList.add(passed ? 'pass' : 'fail');
    quizResultText.textContent = msg;
    if (passed) {
      quizRedo.style.display = 'none';
      quizPassed.classList.remove('quiz-passed--hidden');
      /* Choice unlocks only after Pretty quiz; scroll to Pretty quiz next */
    } else {
      quizRedo.style.display = 'inline-block';
      quizPassed.classList.add('quiz-passed--hidden');
    }
  }

  function resetQuiz() {
    quizForm.reset();
    quizForm.style.display = 'block';
    quizResult.classList.add('quiz-result--hidden');
    quizPassed.classList.add('quiz-passed--hidden');
    quizResult.classList.remove('pass', 'fail');
  }

  if (quizForm) {
    quizForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var score = getQuizScore();
      var answered = 0;
      for (var i = 1; i <= 10; i++) {
        if (document.querySelector('input[name="q' + i + '"]:checked')) answered++;
      }
      if (answered < 10) {
        if (typeof showEggToast === 'function') showEggToast("Answer all 10 questions first 😤");
        return;
      }
      showQuizResult(score >= QUIZ_PASS_SCORE, score);
    });
  }

  if (quizRedo) quizRedo.addEventListener('click', resetQuiz);

  if (quizScrollToPretty) {
    quizScrollToPretty.addEventListener('click', function () {
      unlockAndGoTo('pretty-quiz');
    });
  }

  // --- Pretty quiz (no wrong answer) ---
  var currentPrettySlide = 0;
  function showPrettySlide(index) {
    currentPrettySlide = index;
    prettySlides.forEach(function (slide, i) {
      var isActive = i === index;
      slide.classList.toggle('pretty-slide--active', isActive);
      var video = slide.querySelector('.pretty-slide-video');
      if (video) {
        if (isActive) {
          video.play().catch(function () {});
        } else {
          video.pause();
        }
      }
    });
  }

  function playActivePrettyVideo() {
    var active = document.querySelector('.pretty-slide.pretty-slide--active');
    if (active) {
      var video = active.querySelector('.pretty-slide-video');
      if (video) video.play().catch(function () {});
    }
  }

  function finishPrettyQuiz() {
    if (!prettyQuizSlides || !prettyQuizDone) return;
    prettyQuizSlides.classList.add('pretty-quiz-slides--done');
    prettyQuizDone.classList.remove('pretty-quiz-done--hidden');
    /* Choice unlocks after "Are we cute together?" — scroll goes to cute-together section */
  }

  prettySlides.forEach(function (slide) {
    var opts = slide.querySelectorAll('.btn-pretty-opt');
    opts.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var slideIndex = parseInt(slide.getAttribute('data-slide'), 10);
        if (slideIndex < prettySlides.length - 1) {
          showPrettySlide(slideIndex + 1);
        } else {
          finishPrettyQuiz();
        }
      });
    });
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      prettySlides.forEach(function (slide) {
        var video = slide.querySelector('.pretty-slide-video');
        if (video) video.pause();
      });
    } else {
      playActivePrettyVideo();
    }
  });

  var prettyQuizSection = document.getElementById('pretty-quiz');
  if (prettyQuizSection) {
    var prettyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) playActivePrettyVideo();
        });
      },
      { threshold: 0.2 }
    );
    prettyObserver.observe(prettyQuizSection);
  }

  if (prettyQuizToCute) {
    prettyQuizToCute.addEventListener('click', function () {
      unlockAndGoTo('cute-together');
    });
  }

  function unlockSection(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('screen--locked');
  }

  function scrollToSection(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  function unlockAndGoTo(id) {
    unlockSection(id);
    scrollToSection(id);
  }

  function unlockChoiceAndScroll() {
    choiceSection.classList.remove('screen-choice--locked');
    choiceSection.classList.add('screen-choice--unlocked');
    choiceSection.scrollIntoView({ behavior: 'smooth' });
  }

  if (btnYesBabiii) btnYesBabiii.addEventListener('click', function () {
    unlockSection('choice');
    choiceSection.classList.remove('screen-choice--locked');
    choiceSection.classList.add('screen-choice--unlocked');
    scrollToSection('choice');
  });
  if (btnYesBabbiii) btnYesBabbiii.addEventListener('click', function () {
    unlockSection('choice');
    choiceSection.classList.remove('screen-choice--locked');
    choiceSection.classList.add('screen-choice--unlocked');
    scrollToSection('choice');
  });

  function unlockAllSections() {
    unlockSection('hero');
    scrollToSection('hero');
  }

  if (document.getElementById('ttt-to-hero')) {
    document.getElementById('ttt-to-hero').addEventListener('click', unlockAllSections);
  }

  scrollDown.addEventListener('click', function () {
    unlockSection('memes');
    scrollToSection('memes');
  });

  var memesToQuiz = document.getElementById('memes-to-quiz');
  if (memesToQuiz) memesToQuiz.addEventListener('click', function () {
    unlockAndGoTo('quiz');
  });

  // --- Tic-tac-toe (player = heart O, computer = X; win to unlock invitation) ---
  var TTT_WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  var tttBoard = ['', '', '', '', '', '', '', '', ''];
  var tttGameOver = false;
  var tttBoardEl = document.getElementById('ttt-board');
  var tttStatusEl = document.getElementById('ttt-status');
  var tttResultEl = document.getElementById('ttt-result');
  var tttResultTextEl = document.getElementById('ttt-result-text');
  var tttWonEl = document.getElementById('ttt-won');
  var tttRestartBtn = document.getElementById('ttt-restart');

  function tttCheckWinner(board) {
    for (var i = 0; i < TTT_WIN_LINES.length; i++) {
      var a = TTT_WIN_LINES[i][0], b = TTT_WIN_LINES[i][1], c = TTT_WIN_LINES[i][2];
      if (board[a] && board[a] === board[b] && board[b] === board[c]) return board[a];
    }
    if (board.every(function (c) { return c !== ''; })) return 'draw';
    return null;
  }

  function tttEmptyIndices(board) {
    var out = [];
    for (var i = 0; i < 9; i++) if (board[i] === '') out.push(i);
    return out;
  }

  function tttAiMove(board) {
    var empty = tttEmptyIndices(board);
    if (empty.length === 0) return -1;
    var i, j, line, countX, countO, emptyInLine;
    // Try to win (but only 70% of the time)
    if (Math.random() < 0.7) {
      for (i = 0; i < TTT_WIN_LINES.length; i++) {
        line = TTT_WIN_LINES[i];
        countX = 0; countO = 0; emptyInLine = -1;
        for (j = 0; j < 3; j++) {
          if (board[line[j]] === 'X') countX++;
          else if (board[line[j]] === 'O') countO++;
          else emptyInLine = line[j];
        }
        if (countX === 2 && emptyInLine !== -1) return emptyInLine;
      }
    }
    // Try to block (but only 50% of the time - makes it easier!)
    if (Math.random() < 0.5) {
      for (i = 0; i < TTT_WIN_LINES.length; i++) {
        line = TTT_WIN_LINES[i];
        countX = 0; countO = 0; emptyInLine = -1;
        for (j = 0; j < 3; j++) {
          if (board[line[j]] === 'X') countX++;
          else if (board[line[j]] === 'O') countO++;
          else emptyInLine = line[j];
        }
        if (countO === 2 && emptyInLine !== -1) return emptyInLine;
      }
    }
    // Sometimes skip center (30% chance)
    if (board[4] === '' && Math.random() > 0.3) return 4;
    // Mix of corners and random
    var corners = [0, 2, 6, 8];
    var availableCorners = corners.filter(function (idx) { return board[idx] === ''; });
    if (availableCorners.length > 0 && Math.random() > 0.4) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    // Otherwise random move
    return empty[Math.floor(Math.random() * empty.length)];
  }

  function tttRender() {
    if (!tttBoardEl) return;
    var cells = tttBoardEl.querySelectorAll('.ttt-cell');
    cells.forEach(function (cell, i) {
      var val = tttBoard[i];
      cell.textContent = val === 'O' ? '♥' : val === 'X' ? '×' : '';
      cell.className = 'ttt-cell' + (val === 'O' ? ' ttt-cell--heart' : val === 'X' ? ' ttt-cell--x' : '');
      cell.disabled = !!val || tttGameOver;
    });
  }

  function tttShowResult(message) {
    tttBoardEl.style.display = 'none';
    tttStatusEl.style.display = 'none';
    tttResultTextEl.textContent = message;
    tttResultEl.classList.remove('ttt-result--hidden');
    tttWonEl.classList.add('ttt-won--hidden');
  }

  function tttShowWon() {
    tttBoardEl.style.display = 'none';
    tttStatusEl.style.display = 'none';
    tttResultEl.classList.add('ttt-result--hidden');
    tttWonEl.classList.remove('ttt-won--hidden');
    unlockAllSections();
  }

  function tttEndGame(winner) {
    tttGameOver = true;
    tttRender();
    if (winner === 'O') {
      tttShowWon();
    } else if (winner === 'draw') {
      tttShowResult('Draw! Try again — win to unlock the invitation 💕');
    } else {
      tttShowResult('Computer wins this time. Try again — the invitation is waiting! 💕');
    }
  }

  function tttDoComputerMove() {
    var idx = tttAiMove(tttBoard);
    if (idx < 0) return;
    tttBoard[idx] = 'X';
    tttRender();
    var winner = tttCheckWinner(tttBoard);
    if (winner) {
      tttEndGame(winner);
    } else {
      tttStatusEl.textContent = 'Your turn — place your heart ♥';
    }
  }

  function tttCellClick(e) {
    var cell = e.target.closest('.ttt-cell');
    if (!cell || tttGameOver) return;
    var i = parseInt(cell.getAttribute('data-i'), 10);
    if (tttBoard[i] !== '') return;
    tttBoard[i] = 'O';
    tttRender();
    var winner = tttCheckWinner(tttBoard);
    if (winner) {
      tttEndGame(winner);
      return;
    }
    tttStatusEl.textContent = 'Computer is thinking...';
    setTimeout(tttDoComputerMove, 400);
  }

  function tttRestart() {
    tttBoard = ['', '', '', '', '', '', '', '', ''];
    tttGameOver = false;
    tttBoardEl.style.display = '';
    tttStatusEl.style.display = '';
    tttResultEl.classList.add('ttt-result--hidden');
    tttWonEl.classList.add('ttt-won--hidden');
    tttStatusEl.textContent = 'Your turn — tap a cell to place your heart ♥';
    tttRender();
  }

  if (tttBoardEl) {
    tttBoardEl.addEventListener('click', tttCellClick);
    tttRender();
  }
  if (tttRestartBtn) tttRestartBtn.addEventListener('click', tttRestart);

  // --- Scroll flow (hero scroll-down handled above: unlocks memes + scroll) ---

  // Meme cards: reveal when in view
  const memesObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          memeCards.forEach((card) => card.classList.add('visible'));
        }
      });
    },
    { threshold: 0.3, rootMargin: '0px' }
  );
  memesObserver.observe(memesSection);

  // --- Confetti ---
  function fireConfetti() {
    addConfetti({
      particleCount: 120,
      spread: 70,
      origin: { x: 0.5, y: 0.6 },
      colors: ['#e8a0a8', '#f5c6ce', '#c9a962', '#c97b85', '#fff'],
    });
    setTimeout(() => {
      addConfetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.5 },
        colors: ['#e8a0a8', '#f5c6ce', '#c97b85'],
      });
      addConfetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.5 },
        colors: ['#e8a0a8', '#f5c6ce', '#c97b85'],
      });
    }, 200);
  }

  // --- Success screen ---
  function showSuccess() {
    successSection.classList.add('visible');
    successSection.setAttribute('aria-hidden', 'false');
    fireConfetti();
  }

  // YES: success on click (or after 2s hold, see below)

  // --- "Let me think" dodging button ---
  const btnThinkEl = document.getElementById('btn-think');
  const buttonsWrap = btnThinkEl.closest('.buttons');
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const dodgeRadius = 80;
  const padding = 16;

  function getWrapRect() {
    const r = buttonsWrap.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  }

  function clampPosition(x, y) {
    const wrap = getWrapRect();
    const btn = btnThinkEl.getBoundingClientRect();
    const maxLeft = wrap.width - btn.width - padding;
    const maxTop = wrap.height - btn.height - padding;
    return {
      left: Math.max(padding, Math.min(maxLeft, x)),
      top: Math.max(padding, Math.min(maxTop, y)),
    };
  }

  let thinkPosition = { left: null, top: null };

  function initThinkPosition() {
    if (thinkPosition.left === null) {
      const rect = btnThinkEl.getBoundingClientRect();
      const wrap = buttonsWrap.getBoundingClientRect();
      thinkPosition = {
        left: rect.left - wrap.left,
        top: rect.top - wrap.top,
      };
    }
  }

  function moveThinkButton(clientX, clientY) {
    initThinkPosition();
    const wrap = getWrapRect();
    const btn = btnThinkEl.getBoundingClientRect();
    const centerX = btn.left + btn.width / 2;
    const centerY = btn.top + btn.height / 2;
    const dist = Math.hypot(clientX - centerX, clientY - centerY);
    if (dist < dodgeRadius) {
      const angle = Math.atan2(clientY - centerY, clientX - centerX);
      const newCenterX = clientX + Math.cos(angle) * dodgeRadius;
      const newCenterY = clientY + Math.sin(angle) * dodgeRadius;
      const relLeft = newCenterX - wrap.left - btn.width / 2;
      const relTop = newCenterY - wrap.top - btn.height / 2;
      const clamped = clampPosition(relLeft, relTop);
      thinkPosition = clamped;
      btnThinkEl.style.left = clamped.left + 'px';
      btnThinkEl.style.top = clamped.top + 'px';
      btnThinkEl.style.position = 'absolute';
      btnThinkEl.classList.add('dodge');
    }
  }

  if (!isTouch) {
    buttonsWrap.style.position = 'relative';
    document.addEventListener('mousemove', (e) => {
      if (successSection.classList.contains('visible')) return;
      moveThinkButton(e.clientX, e.clientY);
    });
  } else {
    // Mobile: on tap, nudge button slightly so it's playful but not frustrating
    // Only preventDefault when the touch is on the button (so page scroll isn't blocked)
    let tapCount = 0;
    btnThinkEl.addEventListener('touchstart', (e) => {
      if (e.target.closest('.btn-think')) e.preventDefault();
      tapCount++;
      initThinkPosition();
      const wrap = buttonsWrap.getBoundingClientRect();
      const maxLeft = wrap.width - btnThinkEl.getBoundingClientRect().width - padding;
      const maxTop = wrap.height - btnThinkEl.getBoundingClientRect().height - padding;
      const newLeft = Math.random() * Math.max(0, maxLeft - padding) + padding;
      const newTop = Math.random() * Math.max(0, maxTop - padding) + padding;
      thinkPosition = { left: newLeft, top: newTop };
      btnThinkEl.style.left = newLeft + 'px';
      btnThinkEl.style.top = newTop + 'px';
      btnThinkEl.style.position = 'absolute';
      btnThinkEl.classList.add('dodge');
    }, { passive: false });
  }

  btnThinkEl.addEventListener('click', (e) => {
    if (e.target.closest('.btn-think')) showEggToast("Okay okay, I'll wait… but the YES button is right there 💖");
  });

  // --- Add to calendar ---
  addToCalendar.addEventListener('click', (e) => {
    e.preventDefault();
    const date = new Date();
    date.setMonth(1); // Feb
    date.setDate(14);
    const year = date.getFullYear();
    const start = `${year}0214T190000`;
    const end = `${year}0214T220000`;
    const title = encodeURIComponent("Valentine's with you 💕");
    const details = encodeURIComponent("Best date ever. (Don't forget!)");
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
    window.open(calendarUrl, '_blank');
    showEggToast("Added! Now you have no excuse to forget 😏");
  });

  // --- Easter eggs ---

  function showEggToast(msg) {
    eggToast.textContent = msg;
    eggToast.classList.add('show');
    clearTimeout(showEggToast._t);
    showEggToast._t = setTimeout(() => eggToast.classList.remove('show'), 3500);
  }

  // Console message
  console.log(
    "%c💖 For Shambhavi %c— you're the best thing that could've happened. Say yes!",
    "font-size: 16px; font-weight: bold; color: #e8a0a8;",
    "font-size: 12px; color: #5c4450;"
  );

  // Click "Shambhavi" 7 times
  let nameClicks = 0;
  nameTarget.addEventListener('click', () => {
    nameClicks++;
    if (nameClicks === 7) {
      fireConfetti();
      showEggToast("We get it, you love her name. So do we. 💕");
      nameClicks = 0;
    }
  });

  // Double-click sparkle
  sparkle.addEventListener('dblclick', () => {
    addConfetti({
      particleCount: 30,
      spread: 360,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#c9a962', '#f5c6ce'],
    });
    showEggToast("You found the sparkle! ✨");
  });

  // Konami code
  const konami = [ 'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a' ];
  let konamiIndex = 0;
  document.addEventListener('keydown', (e) => {
    if (e.key === konami[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konami.length) {
        konamiIndex = 0;
        fireConfetti();
        showEggToast("You're a nerd and we love it. 🎮💖");
      }
    } else {
      konamiIndex = 0;
    }
  });

  // Right-click "cheating" message
  document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.buttons') || e.target.closest('.screen-choice')) {
      showEggToast("No cheating! Say yes with the left button 😤");
      e.preventDefault();
    }
  });

  // Hold YES for 2 seconds = eager message, then still proceed
  let yesHeld = false;
  let yesHoldTimer = null;
  btnYes.addEventListener('mousedown', () => {
    yesHeld = false;
    yesHoldTimer = setTimeout(() => {
      yesHeld = true;
      showEggToast("Eager much? We love it. 😏");
      showSuccess();
    }, 2000);
  });
  btnYes.addEventListener('mouseup', () => clearTimeout(yesHoldTimer));
  btnYes.addEventListener('mouseleave', () => clearTimeout(yesHoldTimer));
  btnYes.addEventListener('click', (e) => {
    if (!yesHeld) showSuccess();
  });

  // Secret: press S + H 3 times for "Shambhavi" shortcut
  let shCount = 0;
  let lastKey = '';
  document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (lastKey === 's' && k === 'h') {
      shCount++;
      if (shCount >= 3) {
        shCount = 0;
        showEggToast("S.H. = Shambhavi. You're paying attention. 💕");
      }
    }
    lastKey = k;
  });
})();
