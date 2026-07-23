(function () {
  if (document.getElementById("stackforge-badge-root")) return;

  const style = document.createElement("style");
  style.innerHTML = `
    .sf-badge {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 99999;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 7px 15px;
      background-color: #0c0c0f;
      color: #d4d4d8;
      border: 1px solid #27272a;
      border-radius: 9999px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      font-weight: 500;
      text-decoration: none;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .sf-badge:hover {
      border-color: #FF6A00;
      color: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 0 20px rgba(255, 106, 0, 0.3);
    }
    .sf-dot {
      width: 7px;
      height: 7px;
      background-color: #FF6A00;
      border-radius: 50%;
      box-shadow: 0 0 8px #FF6A00;
    }
    .sf-bold {
      font-weight: 800;
      color: #ffffff;
      letter-spacing: 0.05em;
    }
  `;
  document.head.appendChild(style);

  const badge = document.createElement("a");
  badge.id = "stackforge-badge-root";
  badge.href = "https://stackforge.co.in?utm_source=embed_badge";
  badge.target = "_blank";
  badge.rel = "noopener noreferrer";
  badge.className = "sf-badge";
  badge.innerHTML = `<span class="sf-dot"></span><span>Built with <span class="sf-bold">STACKFORGE</span></span>`;

  document.body.appendChild(badge);
})();
