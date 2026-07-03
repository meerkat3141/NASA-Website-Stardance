import "./style.css";
 
const API_KEY = import.meta.env.VITE_NASA_API_KEY;
 
const base = import.meta.env.BASE_URL;
 
const app = document.querySelector("#app");
const datepicker = document.querySelector("#datepicker");
 
// set the starry background from JS so it respects the base URL
document.body.style.backgroundImage = `url("${base}Starry Sky.png")`;
 
function loadImage(date) {
  // show the spinning astronaut while we wait
  app.innerHTML = `<img class="astronaut" src="${base}Astronaut.png" alt="loading" />`;
 
  let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
  if (date) {
    url += `&date=${date}`;
  }
 
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // if NASA sends back an error (bad date, rate limit), there's no url/title.
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
 
      // replacing innerHTML here automatically removes the astronaut
      app.innerHTML = `
        <h1>${data.title}</h1>
        ${media}
        <p>${data.explanation}</p>
      `;
    })
    .catch(err => {
      app.innerHTML = `<p>Error: ${err.message}</p>`;
    });
}
 
// load today's image when the page first opens
loadImage();
 
// reload with the chosen date whenever the user picks one
datepicker.addEventListener("change", (e) => {
  loadImage(e.target.value);
});
 