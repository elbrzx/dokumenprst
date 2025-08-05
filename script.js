document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const showListBtn = document.getElementById('show-list-btn');
    const showFormBtn = document.getElementById('show-form-btn');
    const documentListView = document.getElementById('document-list-view');
    const expeditionFormView = document.getElementById('expedition-form-view');
    const documentListBody = document.getElementById('document-list-body');
    const expeditionForm = document.getElementById('expedition-form');
    const agendaNoSelect = document.getElementById('agenda-no');
    const recipientInput = document.getElementById('recipient');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const notesInput = document.getElementById('notes');
    const signaturePadCanvas = document.getElementById('signature-pad');
    const clearSignatureBtn = document.getElementById('clear-signature-btn');

    // --- State & Initialization ---
    // Mock data to simulate fetching from a Google Sheet
    let documents = [
        { id: 1, agenda_no: 'AGD-001', sender: 'PT. Maju Mundur', subject: 'Penawaran Kerjasama', position: 'Sekretariat' },
        { id: 2, agenda_no: 'AGD-002', sender: 'CV. Jaya Abadi', subject: 'Invoice Pembayaran', position: 'Sekretariat' },
        { id: 3, agenda_no: 'AGD-003', sender: 'Instansi Pemerintah', subject: 'Undangan Rapat', position: 'Sekretariat' },
        { id: 4, agenda_no: 'AGD-004', sender: 'User A', subject: 'Laporan Bulanan', position: 'Manager' },
    ];

    // Initialize Choices.js
    const choices = new Choices(agendaNoSelect, {
        removeItemButton: true,
        searchResultLimit: 5,
        placeholder: true,
        placeholderValue: 'Select agenda numbers',
    });

    // Initialize Signature Pad
    const signaturePad = new SignaturePad(signaturePadCanvas);

    // --- Functions ---

    /**
     * Renders the list of documents in the table.
     */
    function renderDocumentList() {
        documentListBody.innerHTML = ''; // Clear existing rows
        documents.forEach(doc => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doc.agenda_no}</td>
                <td>${doc.sender}</td>
                <td>${doc.subject}</td>
                <td>${doc.position}</td>
            `;
            documentListBody.appendChild(row);
        });
    }

    /**
     * Populates the agenda number dropdown in the expedition form.
     */
    function populateAgendaDropdown() {
        const agendaOptions = documents.map(doc => ({
            value: doc.agenda_no,
            label: `${doc.agenda_no} - ${doc.subject}`,
        }));
        choices.clearStore();
        choices.setChoices(agendaOptions, 'value', 'label', false);
    }

    /**
     * Switches the view between the document list and the expedition form.
     * @param {string} viewToShow - 'list' or 'form'
     */
    function switchView(viewToShow) {
        if (viewToShow === 'form') {
            documentListView.classList.add('hidden');
            expeditionFormView.classList.remove('hidden');
            showListBtn.classList.remove('active');
            showFormBtn.classList.add('active');
            populateAgendaDropdown(); // Refresh dropdown every time form is shown
        } else { // 'list'
            expeditionFormView.classList.add('hidden');
            documentListView.classList.remove('hidden');
            showFormBtn.classList.remove('active');
            showListBtn.classList.add('active');
        }
    }

    /**
     * Resets the form fields to their default state.
     */
    function resetForm() {
        expeditionForm.reset();
        choices.clearInput();
        choices.clearStore();
        populateAgendaDropdown();
        signaturePad.clear();
        // Set date and time to now
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        dateInput.value = `${year}-${month}-${day}`;
        timeInput.value = `${hours}:${minutes}`;
    }

    // --- Event Listeners ---

    showListBtn.addEventListener('click', () => switchView('list'));
    showFormBtn.addEventListener('click', () => switchView('form'));

    clearSignatureBtn.addEventListener('click', () => {
        signaturePad.clear();
    });

    expeditionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const selectedAgendaNos = choices.getValue(true);
        const recipient = recipientInput.value.trim();

        if (selectedAgendaNos.length === 0) {
            alert('Please select at least one Agenda No.');
            return;
        }
        if (!recipient) {
            alert('Please enter a recipient name.');
            return;
        }
        if (signaturePad.isEmpty()) {
            alert('Please provide a signature.');
            return;
        }

        // Update the position for each selected document
        selectedAgendaNos.forEach(agendaNo => {
            const docToUpdate = documents.find(doc => doc.agenda_no === agendaNo);
            if (docToUpdate) {
                docToUpdate.position = recipient;
            }
        });

        // Here you would typically send the data to the server/Google Sheet
        // For now, we just log it and update the UI
        console.log({
            agendas: selectedAgendaNos,
            recipient: recipient,
            date: dateInput.value,
            time: timeInput.value,
            notes: notesInput.value,
            signature: signaturePad.toDataURL(), // Save signature as a base64 string
        });

        alert('Expedition submitted successfully!');

        renderDocumentList();
        resetForm();
        switchView('list');
    });

    // --- Initial Load ---
    renderDocumentList();
    resetForm(); // Set initial date/time
});
