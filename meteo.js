console.log('script actif');

const input = document.querySelector('input[type="text"]');
console.log(input);

const blockMessageErreur = document.querySelector('.CONST');
const cont = document.querySelector('.cont');
console.log(cont);

const button = document.querySelector('button[type="submit"]');
console.log(button);

button.addEventListener('click', (e) => {
  e.preventDefault();
  verifie();
});

function showError(msg) {

  const old = document.querySelector('.erreur');
  if (old) old.remove();

  let erreurDiv = document.createElement('div');
  erreurDiv.className = 'erreur';
  let error = document.createElement('p');
  error.textContent = msg;
  error.style.color = 'red';
  erreurDiv.appendChild(error);
  blockMessageErreur.appendChild(erreurDiv);
}

function verifie() {

  const existing = document.querySelector('.erreur');
  if (existing) existing.remove();

  let inputval = input.value.trim();

  if (inputval === "") {
    showError('Entrer une ville');
    return; 
  }


//   if (/\d/.test(inputval)) {
//     showError('Pas de nombre dans le nom de la ville');
//     return;
//   }


  api(inputval);
}

let apiKey = '16cac8f6d93069244a34d7c7ad1922d9'; 
let apiBase = 'https://api.openweathermap.org/data/2.5/weather';

async function api(nomVille) {
  try {
    // construit l'URL correctement : q=city et units=metric pour °C
    const url = `${apiBase}?q=${encodeURIComponent(nomVille)}&units=metric&appid=${apiKey}`;
    let reponse = await fetch(url);

    if (!reponse.ok) {
      // gestion d'erreur si la ville n'existe pas ou autre code HTTP
      if (reponse.status === 404) {
        showError('Ville introuvable');
      } else {
        showError('Erreur API : ' + reponse.status);
      }
      return;
    }

    let data = await reponse.json();
    console.log(data);

    // Met à jour l'interface (attention aux sélecteurs en minuscules)
    document.getElementById('nomVille').textContent = data.name || '';
    document.querySelector('.temp h1').textContent = Math.round(data.main.temp) + '°C';
    const ventP = document.querySelector('.vent p');
    if (ventP) ventP.textContent = data.wind.speed + ' km/h';
    const humidP = document.querySelector('.humidité p');
    if (humidP) humidP.textContent = data.main.humidity + ' %';
    const pressP = document.querySelector('.pression p');
    if (pressP) pressP.textContent = data.main.pressure + ' hPa';
  } catch (err) {
    console.error(err);
    showError('Erreur réseau ou API');
  }
}
 