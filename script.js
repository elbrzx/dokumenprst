const USERNAME = "qintomb";
const PASSWORD = "1kmzwa88saa";

// Ganti URL ini dengan URL Web App kamu
const scriptURL = "https://script.google.com/macros/s/AKfycb.../exec";

function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  if (u === USERNAME && p === PASSWORD) {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("main").classList.remove("hidden");
  } else {
    alert("Login gagal");
  }
}

function showSection(id) {
  ["suratMasuk", "suratKeluar", "dokumen"].forEach(sec => {
    document.getElementById(sec).classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

function getData(type) {
  fetch(`${scriptURL}?type=${type}`)
    .then(res => res.json())
    .then(data => {
      let output = "<ul>";
      data.forEach(d => {
        output += `<li>${JSON.stringify(d)}</li>`;
      });
      output += "</ul>";
      document.getElementById("data" + capitalize(type)).innerHTML = output;
    });
}

function submitData(type) {
  let payload = { type };
  if (type === "masuk") {
    payload.pengirim = document.getElementById("smPengirim").value;
    payload.perihal = document.getElementById("smPerihal").value;
  } else if (type === "keluar") {
    payload.tujuan = document.getElementById("skTujuan").value;
    payload.perihal = document.getElementById("skPerihal").value;
  } else {
    payload.judul = document.getElementById("dokJudul").value;
    payload.keterangan = document.getElementById("dokKeterangan").value;
  }

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(payload),
  })
    .then(res => res.text())
    .then(alert);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
