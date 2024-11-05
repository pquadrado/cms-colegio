document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://127.0.0.1:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;

      localStorage.setItem('authToken', token);
      window.location.href = 'informacoes.html';
    } else {
      const errorElement = document.getElementById('error');
      errorElement.textContent = 'Invalid username or password';
      errorElement.style.display = 'block';
    }
  } catch (error) {
    console.error('Erro ao enviar requisição:', error);
    const errorElement = document.getElementById('error');
    errorElement.textContent = 'Erro ao conectar com o servidor. Tente novamente mais tarde.';
    errorElement.style.display = 'block';
  }
});

function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password");
  const passwordIcon = document.querySelector(".toggle-password");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    passwordIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
        `;
  } else {
    passwordInput.type = "password";
    passwordIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z"></path></svg>
        `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('informacoes.html') || window.location.pathname.includes('events.html') || window.location.pathname.includes('addevent.html')) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('Token não encontrado, redirecionando para index.html');
      window.location.href = 'index.html';
    } else {
      validateToken(token)
    }
  }
});

async function validateToken(token) {
  try {
    const response = await fetch('http://127.0.0.1:8080/api/validate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token })
    });

    console.log('Resposta do servidor:', response);

    if (!response.ok) {
      throw new Error('Token inválido');
    }

    const data = await response.json();

    if (!data.valid) {
      window.location.href = 'index.html';
    }
  } catch (error) {
    window.location.href = 'index.html';
  }
}



let inputFiles = [];

function newInput(input) {
  let filesStr = "";

  for (let i = 0; i < input.files.length; i++) {
    inputFiles.push(input.files[i]);
    filesStr += `<li>${input.files[i].name} <button onclick="removeFile(${inputFiles.length - 1})" class="button-remove-image">Remover</button></li>`;
  }

  document.getElementById("file-input").value = "";
  document.getElementById("dp-files").innerHTML += filesStr;
}

function removeFile(index) {
  inputFiles.splice(index, 1);
  displayFiles();
}

function validateForm() {
  const datePattern = /^(\d{2})-(\d{2})-(\d{4})$/;
  const timePattern = /^(\d{2}):(\d{2})$/;

  const date = document.getElementById("data").value;
  const startTime = document.getElementById("hora_inicio").value;
  const endTime = document.getElementById("hora_termino").value;

  const dateMatch = date.match(datePattern);
  if (!dateMatch) {
    alert("Data inválida. Use o formato dd-mm-yyyy.");
    return false;
  }

  const day = parseInt(dateMatch[1], 10);
  const month = parseInt(dateMatch[2], 10);
  const year = parseInt(dateMatch[3], 10);

  if (month < 1 || month > 12) {
    alert("Mês inválido. Use um valor entre 01 e 12.");
    return false;
  }
  if (day < 1 || day > 31 || (month === 2 && day > 29) || ((month === 4 || month === 6 || month === 9 || month === 11) && day > 30)) {
    alert("Dia inválido para o mês especificado.");
    return false;
  }

  const startTimeMatch = startTime.match(timePattern);
  if (!startTimeMatch) {
    alert("Hora de início inválida. Use o formato hh:mm.");
    return false;
  }

  const startHour = parseInt(startTimeMatch[1], 10);
  const startMinute = parseInt(startTimeMatch[2], 10);

  if (startHour < 0 || startHour > 23 || startMinute < 0 || startMinute > 59) {
    alert("Hora de início fora do intervalo permitido (00:00 - 23:59).");
    return false;
  }

  const endTimeMatch = endTime.match(timePattern);
  if (!endTimeMatch) {
    alert("Hora de término inválida. Use o formato hh:mm.");
    return false;
  }

  const endHour = parseInt(endTimeMatch[1], 10);
  const endMinute = parseInt(endTimeMatch[2], 10);

  if (endHour < 0 || endHour > 23 || endMinute < 0 || endMinute > 59) {
    alert("Hora de término fora do intervalo permitido (00:00 - 23:59).");
    return false;
  }

  return true;
}


function displayFiles() {
  const fileList = inputFiles.map((file, index) => `<li>${file.name} <button onclick="removeFile(${index})">Remover</button></li>`).join("");
  document.getElementById("dp-files").innerHTML = fileList;
}

async function submitForm() {
  const form = document.getElementById("eventForm");
  const formData = new FormData(form);

  if (!validateForm()) {
    return;
  }

  if(inputFiles.length === 0){
    return alert("Adicione ao menos uma imagem!");
  }

  inputFiles.forEach(file => formData.append("images[]", file));

  try {
    const response = await fetch("http://127.0.0.1:8080/evento", {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      alert(`${result.message}`)
    } else {
      const errorText = await response.text();
      alert(`${errorText}`)
    }
  } catch (error) {
    alert("Erro ao conectar com o servidor.")
    document.getElementById("result").innerHTML = `<p style="color: red;">Erro ao conectar com o servidor.</p>`;
  }
}

async function exibirEventos() {
  try {
    const response = await fetch("http://127.0.0.1:8080/evento");
    const eventos = await response.json();

    const eventosContainer = document.getElementById("eventos-container");

    eventos.forEach(evento => {
      const eventoHTML = `
        <div class="container-flex-events" data-event-id="${evento.id}">
          <div>
            <div class="header-events">
              <h3>${evento.titulo}</h3>
              <p>${evento.subtitulo}</p>
            </div>
            <div class="description-events">
              <p>${evento.descricao}</p>
            </div>
            <div class="details-event">
              <div>
                <div><span style="font-weight: 600;">Data:</span> ${evento.data}</div>
              </div>
              <div class="align-local-hour">
                <div><img alt="Ícone de relógio"
                    src="https://cdn.prod.website-files.com/66e9861bc46ae550860e8a13/66e9861cc46ae550860e8a9d_clock.svg"
                    class="icon-2"></div>
                <div>${evento.hora_inicio} - ${evento.hora_termino}</div>
              </div>
              <div class="align-local-hour">
                <div><img alt="Ícone de local"
                    src="https://cdn.prod.website-files.com/66e9861bc46ae550860e8a13/66e9861cc46ae550860e8a9e_placeholders.svg"
                    class="icon-2"></div>
                <div>${evento.local}</div>
              </div>
            </div>
          </div>
          <button class="button-delete" onclick="deletarEvento(${evento.id})">DELETE</button>
        </div>
      `;

      eventosContainer.insertAdjacentHTML("beforeend", eventoHTML);
    });
  } catch (error) {
    console.error("Erro ao carregar eventos:", error);
  }
}
async function deletarEvento(eventId) {
  const confirmDelete = confirm("Tem certeza de que deseja excluir este evento?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://127.0.0.1:8080/evento/${eventId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      document.querySelector(`[data-event-id="${eventId}"]`).remove();
      alert("Evento excluído com sucesso.");
    } else {
      alert("Erro ao excluir o evento.");
    }
  } catch (error) {
    console.error("Erro ao excluir evento:", error);
    alert("Erro ao conectar com o servidor.");
  }
}


document.addEventListener("DOMContentLoaded", exibirEventos);
