/**
 * Smart Transport Reservation System - Core JavaScript Engine
 * First-Year C Programming Academic Demo
 * Simulates C structures, arrays, loops, and CRUD booking operations.
 */

// Initial Seed Data matching the project requirements:
// Total Seats: 40, Available: 28, Booked: 12, Cancelled: 2
const INITIAL_DEMO_RESERVATIONS = [
  { pnr: 'ST-TR-1021', name: 'Dhruv Saxena', age: 20, type: 'Train', from: 'Delhi Central', to: 'Chandigarh', date: '2026-09-22', seat: 12, status: 'CONFIRMED' },
  { pnr: 'ST-BU-1004', name: 'Ashish Gangwar', age: 21, type: 'Bus', from: 'Delhi Central', to: 'Jaipur Junction', date: '2026-09-23', seat: 4, status: 'CONFIRMED' },
  { pnr: 'ST-TR-1008', name: 'Aditya Kumar', age: 20, type: 'Train', from: 'Chandigarh', to: 'Delhi Central', date: '2026-09-24', seat: 8, status: 'CONFIRMED' },
  { pnr: 'ST-BU-1015', name: 'Garv Chaudhary', age: 19, type: 'Bus', from: 'Delhi Central', to: 'Dehradun', date: '2026-09-25', seat: 15, status: 'CONFIRMED' },
  { pnr: 'ST-BU-1003', name: 'Rohan Mehta', age: 24, type: 'Bus', from: 'Delhi Central', to: 'Chandigarh', date: '2026-09-22', seat: 3, status: 'CONFIRMED' },
  { pnr: 'ST-TR-1018', name: 'Pooja Verma', age: 27, type: 'Train', from: 'Agra Cantt', to: 'Delhi Central', date: '2026-09-22', seat: 18, status: 'CONFIRMED' },
  { pnr: 'ST-BU-1022', name: 'Siddharth Roy', age: 23, type: 'Bus', from: 'Delhi Central', to: 'Manali', date: '2026-09-26', seat: 22, status: 'CONFIRMED' },
  { pnr: 'ST-TR-1024', name: 'Kavita Singh', age: 31, type: 'Train', from: 'Jaipur Junction', to: 'Delhi Central', date: '2026-09-22', seat: 24, status: 'CONFIRMED' },
  { pnr: 'ST-BU-1027', name: 'Amit Sharma', age: 29, type: 'Bus', from: 'Chandigarh', to: 'Shimla', date: '2026-09-23', seat: 27, status: 'CONFIRMED' },
  { pnr: 'ST-TR-1031', name: 'Neha Gupta', age: 22, type: 'Train', from: 'Delhi Central', to: 'Chandigarh', date: '2026-09-27', seat: 31, status: 'CONFIRMED' },
  { pnr: 'ST-BU-1035', name: 'Vikram Joshi', age: 35, type: 'Bus', from: 'Dehradun', to: 'Delhi Central', date: '2026-09-25', seat: 35, status: 'CONFIRMED' },
  { pnr: 'ST-TR-1038', name: 'Ananya Das', age: 26, type: 'Train', from: 'Delhi Central', to: 'Agra Cantt', date: '2026-09-28', seat: 38, status: 'CONFIRMED' },
  // 2 Pre-cancelled reservations
  { pnr: 'ST-BU-1001', name: 'Sameer Khan', age: 28, type: 'Bus', from: 'Delhi Central', to: 'Chandigarh', date: '2026-09-18', seat: 1, status: 'CANCELLED' },
  { pnr: 'ST-TR-1002', name: 'Sunil Rao', age: 40, type: 'Train', from: 'Jaipur Junction', to: 'Delhi Central', date: '2026-09-19', seat: 2, status: 'CANCELLED' }
];

// App State
class TransportReservationApp {
  constructor() {
    this.totalSeats = 40;
    this.reservations = this.loadReservations();
    this.selectedSeat = null;
    this.initDOM();
    this.renderSeatMatrix();
    this.updateStats();
    this.bindEvents();
    this.setupDateInput();
  }

  loadReservations() {
    const stored = localStorage.getItem('smart_transport_reservations');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.warn('Fallback to default seed records:', e);
      }
    }
    return [...INITIAL_DEMO_RESERVATIONS];
  }

  saveReservations() {
    localStorage.setItem('smart_transport_reservations', JSON.stringify(this.reservations));
  }

  initDOM() {
    // Stat elements
    this.statTotal = document.getElementById('stat-total-seats');
    this.statAvailable = document.getElementById('stat-available-seats');
    this.statBooked = document.getElementById('stat-booked-seats');
    this.statCancelled = document.getElementById('stat-cancelled-seats');

    // Seat Grid
    this.seatMatrixGrid = document.getElementById('seat-matrix-grid');

    // Form elements
    this.bookingForm = document.getElementById('reservation-form');
    this.passengerNameInput = document.getElementById('passenger-name');
    this.passengerAgeInput = document.getElementById('passenger-age');
    this.fromSelect = document.getElementById('from-station');
    this.toSelect = document.getElementById('to-station');
    this.dateInput = document.getElementById('journey-date');
    this.seatInput = document.getElementById('seat-number');

    // Type Radios
    this.typeBusLabel = document.getElementById('type-bus-label');
    this.typeTrainLabel = document.getElementById('type-train-label');

    // Ticket Result Card
    this.generatedTicketBox = document.getElementById('generated-ticket-box');
    this.ticketPnrVal = document.getElementById('ticket-pnr-val');
    this.ticketNameVal = document.getElementById('ticket-name-val');
    this.ticketTypeVal = document.getElementById('ticket-type-val');
    this.ticketSeatVal = document.getElementById('ticket-seat-val');
    this.ticketRouteVal = document.getElementById('ticket-route-val');
    this.ticketDateVal = document.getElementById('ticket-date-val');

    // Check Ticket
    this.checkForm = document.getElementById('check-ticket-form');
    this.checkPnrInput = document.getElementById('check-pnr-input');
    this.checkEmptyText = document.getElementById('check-empty-text');
    this.checkDetailsWrap = document.getElementById('check-details-wrap');
    this.resPassenger = document.getElementById('res-passenger');
    this.resTransport = document.getElementById('res-transport');
    this.resRoute = document.getElementById('res-route');
    this.resSeat = document.getElementById('res-seat');
    this.resStatus = document.getElementById('res-status');

    // Cancel Ticket
    this.cancelForm = document.getElementById('cancel-ticket-form');
    this.cancelPnrInput = document.getElementById('cancel-pnr-input');
    this.cancelSuccessBox = document.getElementById('cancel-success-box');
    this.cancelErrorBox = document.getElementById('cancel-error-box');
    this.cancelEmptyText = document.getElementById('cancel-empty-text');
    this.cancelDetailsText = document.getElementById('cancel-details-text');

    // C Code Inspector Tabs
    this.codeSnippetDisplay = document.getElementById('c-code-display');
    this.inspectorTabs = document.querySelectorAll('.inspector-tab');

    // Mobile nav
    this.mobileToggle = document.getElementById('mobile-menu-toggle');
    this.navMenu = document.getElementById('nav-menu-links');
  }

  setupDateInput() {
    // Set default date to today or tomorrow
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const dateStr = today.toISOString().split('T')[0];
    if (this.dateInput) {
      this.dateInput.value = dateStr;
      this.dateInput.min = new Date().toISOString().split('T')[0];
    }
  }

  // Calculate active booked seats array (represented like int seats[40] in C)
  getBookedSeatsMap() {
    const bookedMap = {};
    this.reservations.forEach(r => {
      if (r.status === 'CONFIRMED') {
        bookedMap[r.seat] = r;
      }
    });
    return bookedMap;
  }

  updateStats() {
    const bookedMap = this.getBookedSeatsMap();
    const bookedCount = Object.keys(bookedMap).length;
    const availableCount = Math.max(0, this.totalSeats - bookedCount);
    const cancelledCount = this.reservations.filter(r => r.status === 'CANCELLED').length;

    if (this.statTotal) this.statTotal.textContent = this.totalSeats;
    if (this.statAvailable) this.statAvailable.textContent = availableCount;
    if (this.statBooked) this.statBooked.textContent = bookedCount;
    if (this.statCancelled) this.statCancelled.textContent = cancelledCount;
  }

  renderSeatMatrix() {
    if (!this.seatMatrixGrid) return;
    this.seatMatrixGrid.innerHTML = '';
    const bookedMap = this.getBookedSeatsMap();

    for (let seatNum = 1; seatNum <= this.totalSeats; seatNum++) {
      const isBooked = !!bookedMap[seatNum];
      const isSelected = this.selectedSeat === seatNum;

      const seatBtn = document.createElement('button');
      seatBtn.type = 'button';
      seatBtn.className = 'seat-btn';
      seatBtn.dataset.seatNumber = seatNum;
      seatBtn.textContent = seatNum;

      if (isBooked) {
        seatBtn.classList.add('booked');
        seatBtn.title = `Seat ${seatNum} - Booked by ${bookedMap[seatNum].name}`;
        seatBtn.setAttribute('aria-disabled', 'true');
      } else if (isSelected) {
        seatBtn.classList.add('selected');
        seatBtn.title = `Seat ${seatNum} - Selected`;
      } else {
        seatBtn.title = `Seat ${seatNum} - Available`;
      }

      seatBtn.addEventListener('click', () => {
        this.handleSeatClick(seatNum, isBooked);
      });

      this.seatMatrixGrid.appendChild(seatBtn);
    }
  }

  handleSeatClick(seatNum, isBooked) {
    if (isBooked) {
      alert(`⚠️ Seat ${seatNum} is already booked. Please select an available seat.`);
      return;
    }

    this.selectedSeat = seatNum;
    if (this.seatInput) {
      this.seatInput.value = seatNum;
    }
    this.renderSeatMatrix();
  }

  bindEvents() {
    // Journey Type Selection change
    const radioInputs = document.querySelectorAll('input[name="journey-type"]');
    radioInputs.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === 'Bus') {
          this.typeBusLabel.classList.add('active');
          this.typeTrainLabel.classList.remove('active');
        } else {
          this.typeTrainLabel.classList.add('active');
          this.typeBusLabel.classList.remove('active');
        }
      });
    });

    // Seat input direct typing sync with grid
    if (this.seatInput) {
      this.seatInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (val >= 1 && val <= this.totalSeats) {
          const bookedMap = this.getBookedSeatsMap();
          if (!bookedMap[val]) {
            this.selectedSeat = val;
            this.renderSeatMatrix();
          }
        }
      });
    }

    // Reservation Form Submit
    if (this.bookingForm) {
      this.bookingForm.addEventListener('submit', (e) => this.handleBookingSubmit(e));
    }

    // Check Ticket Form Submit
    if (this.checkForm) {
      this.checkForm.addEventListener('submit', (e) => this.handleCheckTicketSubmit(e));
    }

    // Cancel Ticket Form Submit
    if (this.cancelForm) {
      this.cancelForm.addEventListener('submit', (e) => this.handleCancelTicketSubmit(e));
    }

    // Mobile nav toggle
    if (this.mobileToggle && this.navMenu) {
      this.mobileToggle.addEventListener('click', () => {
        this.navMenu.classList.toggle('active');
      });
    }

    // Smooth scroll navigation link active state
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        if (this.navMenu.classList.contains('active')) {
          this.navMenu.classList.remove('active');
        }
      });
    });

    // C Code Inspector tab toggle
    this.inspectorTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.inspectorTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.displayCSnippet(tab.dataset.snippet);
      });
    });
  }

  handleBookingSubmit(e) {
    e.preventDefault();

    const name = this.passengerNameInput.value.trim();
    const age = parseInt(this.passengerAgeInput.value, 10);
    const journeyType = document.querySelector('input[name="journey-type"]:checked')?.value || 'Bus';
    const from = this.fromSelect.value;
    const to = this.toSelect.value;
    const date = this.dateInput.value;
    const seatNum = parseInt(this.seatInput.value, 10);

    // Form Validations
    if (!name) {
      alert('Please enter passenger name.');
      this.passengerNameInput.focus();
      return;
    }
    if (isNaN(age) || age < 1 || age > 110) {
      alert('Please enter a valid passenger age between 1 and 110.');
      this.passengerAgeInput.focus();
      return;
    }
    if (!from) {
      alert('Please select origin departure station.');
      this.fromSelect.focus();
      return;
    }
    if (!to) {
      alert('Please select destination station.');
      this.toSelect.focus();
      return;
    }
    if (from === to) {
      alert('Origin and Destination stations cannot be the same. Please choose distinct stations.');
      this.toSelect.focus();
      return;
    }
    if (!date) {
      alert('Please select a journey date.');
      this.dateInput.focus();
      return;
    }
    if (isNaN(seatNum) || seatNum < 1 || seatNum > this.totalSeats) {
      alert(`Please select a valid seat number between 1 and ${this.totalSeats}.`);
      this.seatInput.focus();
      return;
    }

    // Check if seat is already booked
    const bookedMap = this.getBookedSeatsMap();
    if (bookedMap[seatNum]) {
      alert(`Seat ${seatNum} is already occupied by another passenger. Please pick another seat.`);
      return;
    }

    // Generate unique academic PNR (e.g. ST-BU-4821 or ST-TR-4821)
    const typePrefix = journeyType === 'Bus' ? 'BU' : 'TR';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newPnr = `ST-${typePrefix}-${randomNum}`;

    // Create record matching C struct Ticket
    const newTicket = {
      pnr: newPnr,
      name: name,
      age: age,
      type: journeyType,
      from: from,
      to: to,
      date: date,
      seat: seatNum,
      status: 'CONFIRMED'
    };

    // Save to state
    this.reservations.unshift(newTicket);
    this.saveReservations();

    // Reset selection & Update UI
    this.selectedSeat = null;
    this.renderSeatMatrix();
    this.updateStats();

    // Render Generated Ticket
    this.displayGeneratedTicket(newTicket);

    // Feedback
    this.bookingForm.reset();
    this.setupDateInput();
    if (journeyType === 'Bus') {
      this.typeBusLabel.classList.add('active');
      this.typeTrainLabel.classList.remove('active');
    }
  }

  displayGeneratedTicket(ticket) {
    if (!this.generatedTicketBox) return;

    this.ticketPnrVal.textContent = `PNR: ${ticket.pnr}`;
    this.ticketNameVal.textContent = `${ticket.name} (${ticket.age} yrs)`;
    this.ticketTypeVal.textContent = `${ticket.type} Express`;
    this.ticketSeatVal.textContent = `Seat ${ticket.seat}`;
    this.ticketRouteVal.innerHTML = `${ticket.from} <span>➔</span> ${ticket.to}`;
    this.ticketDateVal.textContent = ticket.date;

    this.generatedTicketBox.classList.add('visible');
    this.generatedTicketBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  handleCheckTicketSubmit(e) {
    e.preventDefault();
    const query = this.checkPnrInput.value.trim().toUpperCase();
    if (!query) return;

    const found = this.reservations.find(r => r.pnr.toUpperCase() === query);

    if (found) {
      this.checkEmptyText.style.display = 'none';
      this.checkDetailsWrap.classList.add('active');

      this.resPassenger.textContent = `${found.name} (${found.age} yrs)`;
      this.resTransport.textContent = `${found.type} Express`;
      this.resRoute.innerHTML = `${found.from} ➔ ${found.to}`;
      this.resSeat.textContent = `Seat ${found.seat}`;
      this.resStatus.textContent = found.status;

      if (found.status === 'CONFIRMED') {
        this.resStatus.style.color = 'var(--accent-green)';
      } else {
        this.resStatus.style.color = 'var(--accent-red)';
      }
    } else {
      this.checkDetailsWrap.classList.remove('active');
      this.checkEmptyText.style.display = 'block';
      this.checkEmptyText.innerHTML = `❌ No record found for PNR <strong>"${query}"</strong>. Please verify the code.`;
    }
  }

  handleCancelTicketSubmit(e) {
    e.preventDefault();
    const query = this.cancelPnrInput.value.trim().toUpperCase();
    if (!query) return;

    const ticketIndex = this.reservations.findIndex(r => r.pnr.toUpperCase() === query);

    if (ticketIndex === -1) {
      this.cancelSuccessBox.classList.remove('visible');
      this.cancelEmptyText.style.display = 'none';
      this.cancelErrorBox.classList.add('visible');
      this.cancelErrorBox.textContent = `Invalid PNR: No booking found with number "${query}".`;
      return;
    }

    const ticket = this.reservations[ticketIndex];

    if (ticket.status === 'CANCELLED') {
      this.cancelSuccessBox.classList.remove('visible');
      this.cancelEmptyText.style.display = 'none';
      this.cancelErrorBox.classList.add('visible');
      this.cancelErrorBox.textContent = `Ticket ${ticket.pnr} has already been cancelled previously.`;
      return;
    }

    // Process Cancellation: change status, release seat
    ticket.status = 'CANCELLED';
    this.saveReservations();

    this.cancelErrorBox.classList.remove('visible');
    this.cancelEmptyText.style.display = 'none';
    this.cancelSuccessBox.classList.add('visible');
    this.cancelDetailsText.textContent = `PNR ${ticket.pnr} for ${ticket.name} (Seat ${ticket.seat}) cancelled. Seat has been released to available pool.`;

    // Re-render
    this.renderSeatMatrix();
    this.updateStats();

    // Also update check ticket view if currently open on same PNR
    if (this.checkDetailsWrap.classList.contains('active') && this.checkPnrInput.value.trim().toUpperCase() === query) {
      this.resStatus.textContent = 'CANCELLED';
      this.resStatus.style.color = 'var(--accent-red)';
    }
  }

  displayCSnippet(snippetKey) {
    if (!this.codeSnippetDisplay) return;

    let codeText = '';
    switch (snippetKey) {
      case 'structs':
        codeText = `<span class="cmt">// C Structure Definition for Ticket Record</span>
<span class="kw">struct</span> <span class="type">Ticket</span> {
    <span class="type">char</span> pnr[<span class="str">12</span>];
    <span class="type">char</span> passengerName[<span class="str">50</span>];
    <span class="type">int</span> age;
    <span class="type">char</span> transportType[<span class="str">10</span>];   <span class="cmt">// "Bus" or "Train"</span>
    <span class="type">char</span> source[<span class="str">30</span>];
    <span class="type">char</span> destination[<span class="str">30</span>];
    <span class="type">char</span> date[<span class="str">12</span>];
    <span class="type">int</span> seatNumber;
    <span class="type">int</span> isCancelled;          <span class="cmt">// 0 = Active, 1 = Cancelled</span>
};`;
        break;

      case 'booking':
        codeText = `<span class="cmt">// C Function: Reserve seat and allocate PNR</span>
<span class="type">void</span> <span class="fn">bookTicket</span>(<span class="kw">struct</span> <span class="type">Ticket</span> *t, <span class="type">int</span> seats[], <span class="type">int</span> totalSeats) {
    <span class="kw">if</span> (t-&gt;seatNumber &lt; <span class="str">1</span> || t-&gt;seatNumber &gt; totalSeats) {
        <span class="fn">printf</span>(<span class="str">"Invalid seat number!\\n"</span>);
        <span class="kw">return</span>;
    }
    <span class="kw">if</span> (seats[t-&gt;seatNumber - <span class="str">1</span>] == <span class="str">1</span>) {
        <span class="fn">printf</span>(<span class="str">"Seat %d is already booked!\\n"</span>, t-&gt;seatNumber);
        <span class="kw">return</span>;
    }
    
    seats[t-&gt;seatNumber - <span class="str">1</span>] = <span class="str">1</span>; <span class="cmt">// Mark seat as booked</span>
    t-&gt;isCancelled = <span class="str">0</span>;
    <span class="fn">sprintf</span>(t-&gt;pnr, <span class="str">"ST-%s-%04d"</span>, t-&gt;transportType, <span class="fn">rand</span>() % <span class="str">9000</span> + <span class="str">1000</span>);
    <span class="fn">printf</span>(<span class="str">"Ticket Confirmed! Your PNR is: %s\\n"</span>, t-&gt;pnr);
}`;
        break;

      case 'cancel':
        codeText = `<span class="cmt">// C Function: Cancel Ticket by PNR and free the seat</span>
<span class="type">int</span> <span class="fn">cancelTicket</span>(<span class="type">char</span> *pnr, <span class="type">int</span> seats[], <span class="type">int</span> totalSeats) {
    <span class="kw">struct</span> <span class="type">Ticket</span> temp;
    <span class="type">FILE</span> *fp = <span class="fn">fopen</span>(<span class="str">"reservations.dat"</span>, <span class="str">"rb+"</span>);
    <span class="kw">if</span> (!fp) <span class="kw">return</span> <span class="str">0</span>;

    <span class="kw">while</span> (<span class="fn">fread</span>(&amp;temp, <span class="kw">sizeof</span>(<span class="kw">struct</span> <span class="type">Ticket</span>), <span class="str">1</span>, fp)) {
        <span class="kw">if</span> (<span class="fn">strcmp</span>(temp.pnr, pnr) == <span class="str">0</span> &amp;&amp; temp.isCancelled == <span class="str">0</span>) {
            temp.isCancelled = <span class="str">1</span>;
            seats[temp.seatNumber - <span class="str">1</span>] = <span class="str">0</span>; <span class="cmt">// Release seat</span>
            <span class="fn">fseek</span>(fp, -<span class="kw">sizeof</span>(<span class="kw">struct</span> <span class="type">Ticket</span>), <span class="type">SEEK_CUR</span>);
            <span class="fn">fwrite</span>(&amp;temp, <span class="kw">sizeof</span>(<span class="kw">struct</span> <span class="type">Ticket</span>), <span class="str">1</span>, fp);
            <span class="fn">fclose</span>(fp);
            <span class="fn">printf</span>(<span class="str">"Ticket cancelled successfully.\\n"</span>);
            <span class="kw">return</span> <span class="str">1</span>;
        }
    }
    <span class="fn">fclose</span>(fp);
    <span class="kw">return</span> <span class="str">0</span>;
}`;
        break;

      case 'files':
        codeText = `<span class="cmt">// C File Handling: Binary CRUD record storage</span>
<span class="type">void</span> <span class="fn">saveReservationToFile</span>(<span class="kw">struct</span> <span class="type">Ticket</span> t) {
    <span class="type">FILE</span> *fp = <span class="fn">fopen</span>(<span class="str">"reservations.dat"</span>, <span class="str">"ab"</span>);
    <span class="kw">if</span> (fp == <span class="type">NULL</span>) {
        <span class="fn">printf</span>(<span class="str">"Error opening file for write!\\n"</span>);
        <span class="kw">return</span>;
    }
    <span class="fn">fwrite</span>(&amp;t, <span class="kw">sizeof</span>(<span class="kw">struct</span> <span class="type">Ticket</span>), <span class="str">1</span>, fp);
    <span class="fn">fclose</span>(fp);
}

<span class="type">void</span> <span class="fn">displayAllRecords</span>() {
    <span class="kw">struct</span> <span class="type">Ticket</span> t;
    <span class="type">FILE</span> *fp = <span class="fn">fopen</span>(<span class="str">"reservations.dat"</span>, <span class="str">"rb"</span>);
    <span class="kw">while</span> (<span class="fn">fread</span>(&amp;t, <span class="kw">sizeof</span>(<span class="kw">struct</span> <span class="type">Ticket</span>), <span class="str">1</span>, fp)) {
        <span class="fn">printf</span>(<span class="str">"%s | %s | Seat: %d | Status: %s\\n"</span>, 
               t.pnr, t.passengerName, t.seatNumber, 
               t.isCancelled ? <span class="str">"CANCELLED"</span> : <span class="str">"CONFIRMED"</span>);
    }
    <span class="fn">fclose</span>(fp);
}`;
        break;
    }

    this.codeSnippetDisplay.innerHTML = codeText;
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.app = new TransportReservationApp();
});
