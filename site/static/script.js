Array.from(document.querySelectorAll(".hljs-built_in")).map((element) => {
  const name = element.textContent;
  element.addEventListener("mouseover", (e) => {
    console.log("over", name);
  });
  element.addEventListener("mouseleave", (e) => {
    console.log("leave", name);
  });
});

if (window.location.hash)
  document.querySelector(window.location.hash).scrollIntoView();
