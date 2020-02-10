const url = window.location.href.split("/");
const id = url.pop().toString();
console.log(id);

btn = document.getElementById("log-out");
btn.addEventListener("click", () => {
  const url = window.location.href;
  const spliturl = url.split("/");
  let newurl = "";
  spliturl.pop();
  const homecheack = spliturl.pop();
  if (homecheack !== "home") spliturl.push(homecheack);

  // const addslash = spliturl.map(url=>{

  // })

  spliturl.forEach(url => {
    newurl += url + "/";
  });
  newurl = newurl.slice(0, -1);
  console.log(newurl);
  fetch(`/api/users/${id}`, {
    method: "DELETE"
  })
    .then(res => {
      window.location.href = newurl;
    })
    .catch(err => {
      console.error(err);
    });
});
