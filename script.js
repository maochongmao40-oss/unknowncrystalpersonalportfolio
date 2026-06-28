const projects = [
  {
    title: { zh: "项目名称 01", en: "Project 01" },
    tag: "INTERACTION",
    description: {
      zh: "一句话介绍这个项目的核心想法，以及它试图解决的问题。",
      en: "A one-line introduction to the project's core idea and the problem it explores.",
    },
    link: "#",
    cover: "",
  },
  {
    title: { zh: "项目名称 02", en: "Project 02" },
    tag: "RESEARCH",
    description: {
      zh: "一句话介绍这个项目的研究方向，以及值得被看见的部分。",
      en: "A one-line introduction to the project's research direction and what deserves attention.",
    },
    link: "#",
    cover: "",
  },
  {
    title: { zh: "项目名称 03", en: "Project 03" },
    tag: "EXPERIMENT",
    description: {
      zh: "一句话介绍这个项目的实验过程，以及它带来的新感受。",
      en: "A one-line introduction to the experiment and the new sensation it creates.",
    },
    link: "#",
    cover: "",
  },
];

const translations = {
  zh: {
    contact: "联系我",
    projectsTitle: "作品与实验",
    projectsHint: "悬停探索，点击查看项目详情。",
    sphereView: "球体",
    listView: "列表",
    listExpand: "展开",
    listCollapse: "收起",
    portraitPlaceholder: "个人形象照待上传",
    contactIntro: "欢迎交流创意、合作与有趣的新信号。",
    coverPlaceholder: "封面图片待上传",
    viewProject: "查看项目链接",
  },
  en: {
    contact: "Contact",
    projectsTitle: "Works & Experiments",
    projectsHint: "Hover to explore. Click a sphere for details.",
    sphereView: "Sphere",
    listView: "List",
    listExpand: "Expand",
    listCollapse: "Collapse",
    portraitPlaceholder: "PORTRAIT TO BE UPLOADED",
    contactIntro: "Open to creative conversations, collaborations, and interesting new signals.",
    coverPlaceholder: "COVER IMAGE TO BE UPLOADED",
    viewProject: "View project link",
  },
};

let currentLanguage = "zh";
const grid = document.querySelector("#project-grid");
const projectList = document.querySelector("#project-list");
const viewButtons = document.querySelectorAll(".view-toggle-button");
const molecule = document.createElement("div");
molecule.className = "molecule";
grid.appendChild(molecule);
const orbElements = [];
const bondElements = [];
const listElements = [];
const dialog = document.querySelector("#project-dialog");
const closeButton = document.querySelector("#dialog-close");
const dialogCover = document.querySelector("#dialog-cover");
const dialogTag = document.querySelector("#dialog-tag");
const dialogTitle = document.querySelector("#dialog-title");
const dialogDescription = document.querySelector("#dialog-description");
const dialogLink = document.querySelector("#dialog-link");
const contactButton = document.querySelector("#contact-button");
const contactPopover = document.querySelector("#contact-popover");
const contactClose = document.querySelector("#contact-close");
const languageToggle = document.querySelector("#language-toggle");
let activeProject = null;

function getProjectPosition(index) {
  if (index === 0) return { x: 0, y: 0, z: 34 };

  const ringIndex = index - 1;
  const angle = ringIndex * 2.399963229728653;
  const ring = Math.floor(ringIndex / 6);
  const radius = 330 + ring * 190;

  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius * 0.72,
    z: Math.sin(angle * 0.86) * 130,
  };
}

function createProjectOrb(project, index) {
  const button = document.createElement("button");
  button.className = "project-orb";
  button.type = "button";
  button.setAttribute("aria-label", `打开${project.title[currentLanguage]}详情`);
  button.dataset.index = index;
  button.innerHTML = `
    <span class="sphere-rim" aria-hidden="true"></span>
    <span class="sphere-reflection" aria-hidden="true"></span>
    <span class="sphere-line sphere-meridian" aria-hidden="true"></span>
    <span class="sphere-line sphere-latitude" aria-hidden="true"></span>
    <strong>${project.title[currentLanguage]}</strong>
  `;

  button.addEventListener("click", () => openProject(project));
  return button;
}

function createProjectListItem(project, index) {
  const item = document.createElement("article");
  item.className = "project-list-item";
  item.dataset.index = index;
  item.innerHTML = `
    <button class="project-list-trigger" type="button" aria-expanded="false">
      <span>
        <span class="project-list-meta">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <span>${project.tag}</span>
        </span>
        <h3>${project.title[currentLanguage]}</h3>
        <p>${project.description[currentLanguage]}</p>
      </span>
      <span class="project-list-arrow" aria-hidden="true">+</span>
    </button>
    <div class="project-list-panel">
      <div class="project-list-cover">
        <span>${translations[currentLanguage].coverPlaceholder}</span>
      </div>
      <div class="project-list-copy">
        <a href="${project.link}" target="_blank" rel="noreferrer">
          <span>${translations[currentLanguage].viewProject}</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  `;

  item.querySelector(".project-list-trigger").addEventListener("click", () => {
    const isOpen = item.classList.toggle("is-open");
    item.querySelector(".project-list-trigger").setAttribute("aria-expanded", `${isOpen}`);
  });
  return item;
}

function createBond(fromIndex, toIndex) {
  const bond = document.createElement("span");

  bond.className = "molecule-bond";
  bond.setAttribute("aria-hidden", "true");
  bond.dataset.from = fromIndex;
  bond.dataset.to = toIndex;
  return bond;
}

function openProject(project) {
  activeProject = project;
  dialogTag.textContent = project.tag;
  dialogTitle.textContent = project.title[currentLanguage];
  dialogDescription.textContent = project.description[currentLanguage];
  dialogLink.href = project.link;

  dialogCover.classList.toggle("has-image", Boolean(project.cover));
  dialogCover.style.backgroundImage = project.cover ? `url("${project.cover}")` : "";
  dialogCover.querySelector("span").hidden = Boolean(project.cover);
  if (!dialog.open) dialog.showModal();
}

function updateLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.innerHTML = translations[language][element.dataset.i18n];
  });
  document.querySelectorAll(".language-option").forEach((option, index) => {
    option.classList.toggle("is-active", index === (language === "zh" ? 0 : 1));
  });
  languageToggle.setAttribute("aria-label", language === "zh" ? "Switch to English" : "切换至中文");
  orbElements.forEach((orb, index) => {
    const title = projects[index].title[language];
    orb.querySelector("strong").textContent = title;
    orb.setAttribute("aria-label", language === "zh" ? `打开${title}详情` : `Open ${title} details`);
  });
  listElements.forEach((item, index) => {
    const project = projects[index];
    item.querySelector("h3").textContent = project.title[language];
    item.querySelector(".project-list-trigger p").textContent = project.description[language];
    item.querySelector(".project-list-cover span").textContent = translations[language].coverPlaceholder;
    item.querySelector(".project-list-copy a span").textContent = translations[language].viewProject;
  });
  if (activeProject && dialog.open) openProject(activeProject);
}

projects.slice(1).forEach((_, index) => {
  const fromIndex = 0;
  const toIndex = index + 1;
  const bond = createBond(fromIndex, toIndex);
  bondElements.push(bond);
  molecule.appendChild(bond);
});

projects.forEach((project, index) => {
  const orb = createProjectOrb(project, index);
  const listItem = createProjectListItem(project, index);
  orbElements.push(orb);
  listElements.push(listItem);
  molecule.appendChild(orb);
  projectList.appendChild(listItem);
});

projectList.classList.add("is-hidden");

let rotationX = -8;
let rotationY = -12;
let targetRotationX = rotationX;
let targetRotationY = rotationY;
let velocityX = 0;
let velocityY = 0;
let dragStart = null;
let hasDragged = false;
let lastFrameTime = performance.now();

function renderRotation() {
  const radiansX = rotationX * (Math.PI / 180);
  const radiansY = rotationY * (Math.PI / 180);
  const cosX = Math.cos(radiansX);
  const sinX = Math.sin(radiansX);
  const cosY = Math.cos(radiansY);
  const sinY = Math.sin(radiansY);
  const cameraDistance = 1100;
  const projected = projects.map((_, index) => {
    const position = getProjectPosition(index);
    const x = position.x * cosY + position.z * sinY;
    const zAfterY = -position.x * sinY + position.z * cosY;
    const y = position.y * cosX - zAfterY * sinX;
    const z = position.y * sinX + zAfterY * cosX;
    const perspective = cameraDistance / (cameraDistance - z);

    return {
      x: x * perspective,
      y: y * perspective,
      z,
      scale: perspective,
      radius: (orbElements[index].offsetWidth * perspective) / 2,
    };
  });

  for (let pass = 0; pass < 4; pass += 1) {
    projected.forEach((from, fromIndex) => {
      projected.slice(fromIndex + 1).forEach((to, offset) => {
        const toIndex = fromIndex + offset + 1;
        const x = to.x - from.x;
        const y = to.y - from.y;
        const distance = Math.hypot(x, y) || 1;
        const minimumDistance = from.radius + to.radius + 22;
        if (distance >= minimumDistance) return;

        const correction = minimumDistance - distance;
        const unitX = x / distance;
        const unitY = y / distance;
        const fromWeight = fromIndex === 0 ? 0 : toIndex === 0 ? 1 : 0.5;
        const toWeight = 1 - fromWeight;
        from.x -= unitX * correction * fromWeight;
        from.y -= unitY * correction * fromWeight;
        to.x += unitX * correction * toWeight;
        to.y += unitY * correction * toWeight;
      });
    });
  }

  orbElements.forEach((orb, index) => {
    const point = projected[index];
    orb.style.transform = `translate3d(calc(-50% + ${point.x}px), calc(-50% + ${point.y}px), 0) scale(${point.scale})`;
    orb.style.zIndex = `${Math.round(point.z + 1000)}`;
    orb.style.setProperty("--surface-x", `${rotationX * -0.55}deg`);
    orb.style.setProperty("--surface-y", `${rotationY * -0.55}deg`);
  });

  bondElements.forEach((bond) => {
    const from = projected[Number(bond.dataset.from)];
    const to = projected[Number(bond.dataset.to)];
    const x = to.x - from.x;
    const y = to.y - from.y;
    const distance = Math.hypot(x, y);
    const unitX = x / distance;
    const unitY = y / distance;
    const startX = from.x + unitX * from.radius * 0.84;
    const startY = from.y + unitY * from.radius * 0.84;
    const angle = Math.atan2(y, x) * (180 / Math.PI);
    const scale = (from.scale + to.scale) / 2;

    bond.style.width = `${Math.max(0, distance - (from.radius + to.radius) * 0.84)}px`;
    bond.style.transform = `translate3d(${startX}px, ${startY}px, 0) rotate(${angle}deg) scaleY(${scale})`;
    bond.style.zIndex = "1";
  });
}

grid.addEventListener("pointerdown", (event) => {
  if (event.target.closest(".project-orb")) return;
  dragStart = { x: event.clientX, y: event.clientY };
  hasDragged = false;
  grid.setPointerCapture(event.pointerId);
  grid.classList.add("is-dragging");
});

grid.addEventListener("pointermove", (event) => {
  if (!dragStart) return;
  const deltaX = event.clientX - dragStart.x;
  const deltaY = event.clientY - dragStart.y;
  if (Math.abs(deltaX) + Math.abs(deltaY) > 4) hasDragged = true;
  targetRotationY += deltaX * 0.34;
  targetRotationX -= deltaY * 0.34;
  velocityY = deltaX * 0.18;
  velocityX = -deltaY * 0.18;
  dragStart = { x: event.clientX, y: event.clientY };
});

grid.addEventListener("pointerup", (event) => {
  dragStart = null;
  grid.releasePointerCapture(event.pointerId);
  grid.classList.remove("is-dragging");
  window.setTimeout(() => {
    hasDragged = false;
  }, 0);
});

function animateRotation(time) {
  const frameScale = Math.min((time - lastFrameTime) / 16.67, 2);
  const follow = 1 - Math.pow(0.78, frameScale);
  const friction = Math.pow(0.94, frameScale);

  if (dragStart) {
    const previousRotationX = rotationX;
    const previousRotationY = rotationY;
    rotationX += (targetRotationX - rotationX) * follow;
    rotationY += (targetRotationY - rotationY) * follow;
    velocityX = (rotationX - previousRotationX) / frameScale;
    velocityY = (rotationY - previousRotationY) / frameScale;
  } else {
    rotationX += velocityX * frameScale;
    rotationY += velocityY * frameScale;
    velocityX *= friction;
    velocityY *= friction;
    targetRotationX = rotationX;
    targetRotationY = rotationY;
  }

  if (
    dragStart ||
    Math.abs(velocityX) > 0.002 ||
    Math.abs(velocityY) > 0.002
  ) {
    renderRotation();
  }

  lastFrameTime = time;
  window.requestAnimationFrame(animateRotation);
}

grid.addEventListener("click", (event) => {
  if (!hasDragged) return;
  event.preventDefault();
  event.stopPropagation();
  hasDragged = false;
}, true);

renderRotation();
window.requestAnimationFrame(animateRotation);

contactButton.addEventListener("click", () => {
  const isOpen = contactPopover.classList.toggle("is-open");
  contactPopover.setAttribute("aria-hidden", `${!isOpen}`);
  contactButton.setAttribute("aria-expanded", `${isOpen}`);
});

contactClose.addEventListener("click", () => {
  contactPopover.classList.remove("is-open");
  contactPopover.setAttribute("aria-hidden", "true");
  contactButton.setAttribute("aria-expanded", "false");
});

languageToggle.addEventListener("click", () => {
  updateLanguage(currentLanguage === "zh" ? "en" : "zh");
});

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const view = button.dataset.view;
    viewButtons.forEach((viewButton) => {
      viewButton.classList.toggle("is-active", viewButton === button);
    });
    grid.classList.toggle("is-hidden", view === "list");
    projectList.classList.toggle("is-hidden", view !== "list");
  });
});

closeButton.addEventListener("click", () => dialog.close());

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
