import "./style.css";
 
const API_KEY = import.meta.env.VITE_NASA_API_KEY;
const base = import.meta.env.BASE_URL;
const MIN_DATE = "1995-06-16";
 
const app = document.querySelector("#app");
const datepicker = document.querySelector("#datepicker");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const randomBtn = document.querySelector("#random");
const lightbox = document.querySelector("#lightbox");
const lightboxImg = document.querySelector("#lightbox-img");
 
document.body.style.backgroundImage = `url("${base}Starry Sky.png")`;
 
function formatDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
 
const today = formatDate(new Date());
let currentDate = today;
 
datepicker.min = MIN_DATE;
datepicker.max = today;
 
function shiftDate(dateStr, delta) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + delta);
  return formatDate(d);
}
 
function randomDate() {
  const start = new Date(MIN_DATE + "T00:00:00").getTime();
  const end = new Date(today + "T00:00:00").getTime();
  return formatDate(new Date(start + Math.random() * (end - start)));
}
 
function updateNav() {
  prevBtn.disabled = currentDate <= MIN_DATE;
  nextBtn.disabled = currentDate >= today;
}
 
function loadImage(date) {
  currentDate = date || today;
  datepicker.value = currentDate;
  updateNav();
 
  app.innerHTML = `<img class="astronaut" src="${base}Astronaut.png" alt="loading" />`;
 
  let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
  if (date) {
    url += `&date=${date}`;
  }
 
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (!data.url) {
        app.innerHTML = `<p>Error: ${data.msg || "no media available for this date"}</p>`;
        return;
      }
 
      let media;
 
      if (data.media_type === "image") {
        media = `<img class="apod-image" src="${data.url}"/>`;
      } else if (data.url.includes("youtube")) {
        media = `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`;
      } else {
        media = `<video src="${data.url}" controls></video>`;
      }
 
      app.innerHTML = `
        <h1>${data.title}</h1>
        <div class="content">
          ${media}
          <p>${data.explanation}</p>
        </div>
      `;
    })
    .catch(err => {
      app.innerHTML = `<p>Error: ${err.message}</p>`;
    });
}
 
loadImage();
 
datepicker.addEventListener("change", (e) => {
  loadImage(e.target.value);
});
 
prevBtn.addEventListener("click", () => {
  loadImage(shiftDate(currentDate, -1));
});
 
nextBtn.addEventListener("click", () => {
  loadImage(shiftDate(currentDate, 1));
});
 
randomBtn.addEventListener("click", () => {
  loadImage(randomDate());
});
 
app.addEventListener("click", (e) => {
  if (e.target.classList.contains("apod-image")) {
    lightboxImg.src = e.target.src;
    lightbox.classList.add("open");
  }
});
 
lightbox.addEventListener("click", () => {
  lightbox.classList.remove("open");
});
 
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    lightbox.classList.remove("open");
  }
});
 
 