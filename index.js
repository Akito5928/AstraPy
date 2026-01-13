// -----------------------------
// 星空アニメーション
// -----------------------------
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];

for (let i = 0; i < 200; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.2
    });
}

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;

        ctx.fillStyle = "white";
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });

    requestAnimationFrame(animateStars);
}

animateStars();


// -----------------------------
// Start AstraPy ボタン
// -----------------------------
document.getElementById("start-btn").onclick = () => {
    window.location.href = "./editor/";
};


// -----------------------------
// version.txt を読み込む
// -----------------------------
fetch("./editor/version.txt")
  .then(response => response.text())
  .then(text => {
    const lines = text.trim().split("\n");

    // 最新バージョン（最初の行の「 - 」より左側）
    const latestLine = lines[0];
    const latestVersion = latestLine.split(" - ")[0];

    document.getElementById("version").innerText = "Version: " + latestVersion;

    // 履歴一覧（XSS対策版）
    const historyEl = document.getElementById("history");
    historyEl.innerHTML = ""; // 一旦クリア

    const ul = document.createElement("ul");

    lines.forEach(line => {
      const li = document.createElement("li");
      li.textContent = line; // ← textContent で完全に安全
      ul.appendChild(li);
    });

    historyEl.appendChild(ul);
  })
  .catch(err => {
    document.getElementById("version").innerText = "Version: Unknown";
    document.getElementById("history").innerText = "History not found.";
  });
