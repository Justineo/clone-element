/* global cloneElement */

q("#clone").addEventListener("click", () => {
  [...qa(".source .item")].forEach((s) => {
    const r = q(".result", s.closest(".case"));

    r.innerHTML = "";
    r.appendChild(cloneElement(s, { snapshot: true }));
  });
});

q(".case-3 input").value = "Hello world.";

const canvas = q(".case-5 canvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "green";
ctx.fillRect(10, 10, 150, 100);

function q(selector, ctx) {
  return (ctx || document).querySelector(selector);
}

function qa(selector, ctx) {
  return (ctx || document).querySelectorAll(selector);
}
