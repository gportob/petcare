 // ===== NAVBAR SCROLL =====
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    nav.style.boxShadow = window.scrollY > 40 ? '0 2px 20px rgba(0,0,0,0.08)' : '';
  });

  function toggleMenu() {
    const links = document.querySelector('.nav-links');
    links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
    links.style.flexDirection = 'column';
    links.style.position = 'absolute';
    links.style.top = '72px'; links.style.left = '0'; links.style.right = '0';
    links.style.background = 'var(--creme)';
    links.style.padding = '1.5rem 5%';
    links.style.borderBottom = '1px solid rgba(45,106,79,0.1)';
  }

  // ===== BOOKING FORM =====
  let selectedService = '';
  let selectedDay = null;
  let selectedTime = '';
  let currentStep = 1;
  let calYear = 2026, calMonth = 3; // April 2026 (0-indexed)

  function selectService(el, name) {
    document.querySelectorAll('.service-opt').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    selectedService = name;
  }

  function selectTime(el) {
    document.querySelectorAll('.time-slot:not(.unavailable)').forEach(t => t.classList.remove('selected'));
    el.classList.add('selected');
    selectedTime = el.textContent;
  }

  const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const dayNames = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

  function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    document.getElementById('calMonthName').textContent = `${monthNames[calMonth]} ${calYear}`;
    grid.innerHTML = '';

    dayNames.forEach(d => {
      const h = document.createElement('div');
      h.className = 'cal-header'; h.textContent = d;
      grid.appendChild(h);
    });

    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const today = new Date();

    for (let i = 0; i < firstDay; i++) {
      const e = document.createElement('div'); e.className = 'cal-day empty';
      grid.appendChild(e);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day';
      cell.textContent = d;
      const dayDate = new Date(calYear, calMonth, d);
      const isToday = dayDate.toDateString() === today.toDateString();
      const isPast = dayDate < today && !isToday;
      const isSun = dayDate.getDay() === 0;

      if (isPast || isSun) cell.classList.add('disabled');
      else {
        if (isToday) cell.classList.add('today');
        if (selectedDay === d) cell.classList.add('selected');
        cell.onclick = () => selectDay(cell, d);
      }
      grid.appendChild(cell);
    }
  }

  function selectDay(el, d) {
    document.querySelectorAll('.cal-day.selected').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    selectedDay = d;
  }

  function changeMonth(dir) {
    calMonth += dir;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    if (calMonth < 0) { calMonth = 11; calYear--; }
    selectedDay = null;
    renderCalendar();
  }

  function goStep(n) {
    document.getElementById('step' + currentStep).classList.remove('active');
    document.getElementById('dot' + currentStep).classList.remove('active');
    document.getElementById('dot' + currentStep).classList.add('done');

    currentStep = n;
    document.getElementById('step' + currentStep).classList.add('active');
    document.getElementById('dot' + currentStep).classList.add('active');
    document.getElementById('stepNum').textContent = n;

    if (n === 2) renderCalendar();
  }

  function submitBooking() {
    const name = document.getElementById('ownerName').value;
    const phone = document.getElementById('ownerPhone').value;
    if (!name || !phone) { alert('Por favor, preencha seu nome e WhatsApp.'); return; }

    ['step1','step2','step3'].forEach(s => document.getElementById(s).style.display = 'none');
    document.querySelector('.form-step-indicator').style.display = 'none';
    document.querySelector('.form-title').style.display = 'none';
    document.querySelector('.form-subtitle').style.display = 'none';
    document.getElementById('bookingSuccess').style.display = 'block';
  }

  function resetForm() {
    ['step1','step2','step3'].forEach(s => {
      document.getElementById(s).style.display = '';
      document.getElementById(s).classList.remove('active');
    });
    document.querySelector('.form-step-indicator').style.display = '';
    document.querySelector('.form-title').style.display = '';
    document.querySelector('.form-subtitle').style.display = '';
    document.getElementById('bookingSuccess').style.display = 'none';

    document.querySelectorAll('.step-dot').forEach((d,i) => {
      d.classList.remove('active','done');
      if (i === 0) d.classList.add('active');
    });

    currentStep = 1;
    document.getElementById('step1').classList.add('active');
    document.getElementById('stepNum').textContent = '1';
    selectedService = ''; selectedDay = null; selectedTime = '';
  }

  // Init
  renderCalendar();