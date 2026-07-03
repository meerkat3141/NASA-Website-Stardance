import "./style.css";
 
const API_KEY = import.meta.env.VITE_NASA_API_KEY;
const base = import.meta.env.BASE_URL;
 
const app = document.querySelector("#app");
const datepicker = document.querySelector("#datepicker");
 
document.body.style.backgroundImage = `url("${base}Starry Sky.png")`;
 
function loadImage(date) {
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
        media = `<img src="${data.url}"/>`;
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
 
 