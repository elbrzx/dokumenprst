const USERNAME = "qintomb";
const PASSWORD = "1kmzwa88saa";

// Ganti URL ini dengan URL Web App kamu
const scriptURL = "https://script.google.com/macros/s/AKfycb.../exec";

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('dashboard-page').classList.contains('hidden')) {
    getData('masuk');
  }
});

function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  if (u === USERNAME && p === PASSWORD) {
    document.getElementById("login-page").classList.add("hidden");
    document.getElementById("dashboard-page").classList.remove("hidden");
    getData('masuk');
  } else {
    alert("Login gagal: Username atau password salah.");
  }
}

function showSection(id, navButton) {
  document.querySelectorAll('.content-section').forEach(sec => {
    sec.classList.add('hidden');
  });
  document.getElementById(id).classList.remove('hidden');

  document.getElementById('section-title').textContent = navButton.textContent;

  document.querySelectorAll('.nav-button').forEach(btn => {
    btn.classList.remove('active');
  });
  navButton.classList.add('active');

  const type = id.replace('surat', '').toLowerCase();
  getData(type);
}

function getData(type) {
  let containerId;
  if (type === 'dokumen') {
    containerId = 'dataDokumen';
  } else {
    containerId = 'dataSurat' + capitalize(type);
  }
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Container with id ${containerId} not found.`);
    return;
  }

  container.innerHTML = '<p>Memuat data...</p>';

  fetch(`${scriptURL}?type=${type}`)
    .then(res => res.json())
    .then(data => {
      if (!data || !Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<p>Tidak ada data untuk ditampilkan.</p>';
        return;
      }
      renderTable(container, data);
    })
    .catch(err => {
      console.error('Error fetching data:', err);
      container.innerHTML = '<p>Gagal memuat data. Silakan coba lagi.</p>';
    });
}

function renderTable(container, data) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const headers = Object.keys(data[0]);
  const headerRow = document.createElement('tr');
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText.replace(/_/g, ' ').toUpperCase();
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  data.forEach(rowData => {
    const row = document.createElement('tr');
    headers.forEach(header => {
      const td = document.createElement('td');
      td.textContent = rowData[header];
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);

  container.innerHTML = '';
  container.appendChild(table);
}

function submitData(type) {
  let payload = { type };
  const inputs = {};

  if (type === "masuk") {
    inputs.pengirim = document.getElementById("smPengirim");
    inputs.perihal = document.getElementById("smPerihal");
    payload.pengirim = inputs.pengirim.value;
    payload.perihal = inputs.perihal.value;
  } else if (type === "keluar") {
    inputs.tujuan = document.getElementById("skTujuan");
    inputs.perihal = document.getElementById("skPerihal");
    payload.tujuan = inputs.tujuan.value;
    payload.perihal = inputs.perihal.value;
  } else {
    inputs.judul = document.getElementById("dokJudul");
    inputs.keterangan = document.getElementById("dokKeterangan");
    payload.judul = inputs.judul.value;
    payload.keterangan = inputs.keterangan.value;
  }

  for (const key in payload) {
    if (payload[key] === '' && key !== 'type') {
      alert('Semua field harus diisi!');
      return;
    }
  }

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(payload),
  })
  .then(res => res.text())
  .then(response => {
    alert(response || 'Data berhasil dikirim!');
    for (const key in inputs) {
      inputs[key].value = '';
    }
    getData(type);
  })
  .catch(err => {
    console.error('Error submitting data:', err);
    alert('Gagal mengirim data.');
  });
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
