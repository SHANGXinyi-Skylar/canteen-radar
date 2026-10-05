const dishes = [
  { name: "黯然销魂叉烧饭", place: "CYM Canteen · 港式窗口", price: 42, wait: 6, score: 4.8, emoji: "🍖", color: "coral", tags: ["本周人气 No.1", "招牌必吃"], groups: ["hot", "fast", "budget"], reason: "想吃满足感强的，但不想等太久——就是它。" },
  { name: "炙烧三文鱼能量碗", place: "方树泉楼餐厅 · 轻食档", price: 48, wait: 3, score: 4.7, emoji: "🥑", color: "green", tags: ["高蛋白", "清爽不腻"], groups: ["fast", "light", "budget"], reason: "下午还有课，清爽、饱腹又不会吃完犯困。" },
  { name: "冬阴功海鲜汤面", place: "学生会大楼 · 东南亚档", price: 39, wait: 9, score: 4.6, emoji: "🍜", color: "gold", tags: ["酸辣开胃", "暖胃"], groups: ["hot", "fast", "budget"], reason: "酸辣开胃，特别适合今天需要被唤醒的你。" },
  { name: "韩式泡菜牛肉锅", place: "CYM Canteen · 韩式窗口", price: 52, wait: 13, score: 4.5, emoji: "🍲", color: "red", tags: ["今日新菜", "微辣"], groups: ["hot"], reason: "今天适合尝点新鲜的，热腾腾的一锅很有幸福感。" },
  { name: "黑松露野菌意面", place: "Bijas · 西餐窗口", price: 56, wait: 8, score: 4.4, emoji: "🍝", color: "purple", tags: ["素食友好", "香气浓郁"], groups: ["fast", "light"], reason: "想换换口味，这份意面精致但不需要等很久。" },
  { name: "海南鸡饭双拼", place: "方树泉楼餐厅 · 东南亚档", price: 38, wait: 7, score: 4.5, emoji: "🍗", color: "blue", tags: ["性价比", "肉食满足"], groups: ["fast", "budget"], reason: "预算友好又稳妥，是赶时间时不会出错的选择。" }
];

const dishGrid = document.querySelector("#dishGrid");
const tasteModal = document.querySelector("#tasteModal");
const resultModal = document.querySelector("#resultModal");
const toast = document.querySelector("#toast");
let currentFilter = "all";
let pickIndex = 0;

function renderDishes(filter = "all") {
  const visible = filter === "all" ? dishes : dishes.filter(dish => dish.groups.includes(filter));
  dishGrid.innerHTML = visible.map((dish, index) => `
    <article class="dish-card">
      <div class="dish-visual visual-${dish.color}">
        ${index < 3 && filter === "all" ? `<span class="rank-badge">TOP ${index + 1}</span>` : ""}
        <button class="save-btn" type="button" aria-label="收藏 ${dish.name}">♡</button>
        <span class="dish-emoji">${dish.emoji}</span>
      </div>
      <div class="dish-body">
        <div class="dish-title-row">
          <h3>${dish.name}</h3>
          <span class="dish-score">${dish.score} <small>★</small></span>
        </div>
        <p class="dish-location">${dish.place}</p>
        <div class="dish-tags">${dish.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
        <div class="dish-meta">
          <b>HK$ ${dish.price}</b>
          <span class="${dish.wait <= 8 ? "queue-fast" : "queue-mid"}">◷ 排队约 ${dish.wait} min</span>
        </div>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".save-btn").forEach(button => {
    button.addEventListener("click", () => {
      button.classList.toggle("saved");
      button.textContent = button.classList.contains("saved") ? "♥" : "♡";
      showToast(button.classList.contains("saved") ? "已加入我的想吃清单" : "已取消收藏");
    });
  });
}

function openModal(modal) {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(modal) {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function showToast(message) {
  toast.querySelector("p").textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("show"), 2400);
}

function showPick() {
  const dish = dishes[pickIndex % dishes.length];
  pickIndex += 1;
  document.querySelector("#resultEmoji").textContent = dish.emoji;
  document.querySelector("#resultName").textContent = dish.name;
  document.querySelector("#resultMeta").textContent = `${dish.place.split(" · ")[0]} · HK$${dish.price} · 排队约 ${dish.wait} 分钟`;
  document.querySelector("#resultReason").textContent = `“${dish.reason}”`;
  openModal(resultModal);
}

renderDishes();

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderDishes(currentFilter);
  });
});

document.querySelector("#pickForMe").addEventListener("click", showPick);
document.querySelector("#openTaste").addEventListener("click", () => openModal(tasteModal));
document.querySelector("#retryPick").addEventListener("click", showPick);
document.querySelector("#acceptPick").addEventListener("click", () => {
  closeModal(resultModal);
  showToast("好选择！已加入今日饭单");
});
document.querySelector("#saveTaste").addEventListener("click", () => {
  closeModal(tasteModal);
  showToast("口味偏好已更新");
  setTimeout(showPick, 400);
});

document.querySelectorAll(".modal-close").forEach(button => {
  button.addEventListener("click", () => closeModal(button.closest(".modal-overlay")));
});
document.querySelectorAll(".modal-overlay").forEach(overlay => {
  overlay.addEventListener("click", event => {
    if (event.target === overlay) closeModal(overlay);
  });
});

document.querySelectorAll(".chips").forEach(group => {
  group.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      if (group.classList.contains("single")) {
        group.querySelectorAll("button").forEach(item => item.classList.remove("selected"));
      }
      button.classList.toggle("selected");
    });
  });
});

const waitRange = document.querySelector("#waitRange");
waitRange.addEventListener("input", () => {
  document.querySelector("#waitValue").textContent = `${waitRange.value} 分钟`;
});

document.querySelectorAll(".like-btn").forEach(button => {
  button.addEventListener("click", () => {
    const value = Number(button.textContent.match(/\d+/)[0]);
    const liked = button.classList.toggle("liked");
    button.textContent = `${liked ? "♥" : "♡"} ${liked ? value + 1 : value - 1}`;
  });
});

document.querySelector("#loadMore").addEventListener("click", () => showToast("完整校园菜单正在持续收录中"));
document.querySelector("#reportBtn").addEventListener("click", () => showToast("感谢！报料入口已为你打开"));
document.querySelector("#writeReview").addEventListener("click", () => showToast("点评功能已准备好，登录后即可发布"));
document.querySelector("#campusSwitch").addEventListener("click", () => showToast("当前原型已锁定：香港大学本部校园"));

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    document.querySelectorAll(".modal-overlay.open").forEach(closeModal);
  }
});
