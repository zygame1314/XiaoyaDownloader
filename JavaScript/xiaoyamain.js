const viewAchievementsBtn = document.getElementById("view-achievements");
const achievementsModal = document.getElementById("achievements-modal");
const achievementsList = document.getElementById("achievements-list");
const closeBtn = achievementsModal.querySelector(".close");

viewAchievementsBtn.onclick = function () {
    updateAchievementsList();
    achievementsModal.style.display = "block";
}

closeBtn.onclick = function () {
    achievementsModal.querySelector('.modal-content').classList.add('hide');
    setTimeout(() => {
        achievementsModal.style.display = "none";
        achievementsModal.classList.remove('hide');
    }, 300);
}

window.onclick = function (event) {
    if (event.target === achievementsModal) {
        achievementsModal.style.display = "none";
    }
}

const achievementsPerPage = 5;
let currentPage = 1;

function updateAchievementsList() {
    const startIndex = (currentPage - 1) * achievementsPerPage;
    const endIndex = startIndex + achievementsPerPage;
    const pageAchievements = achievements.slice(startIndex, endIndex);

    achievementsList.innerHTML = '';
    pageAchievements.forEach(achievement => {
        const isUnlocked = achievementManager.isUnlocked(achievement.id);
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;

        let progressHTML = '';
        if (achievement.maxProgress) {
            const currentProgress = achievementManager.getProgress(achievement.id);
            const progressPercentage = Math.min((currentProgress / achievement.maxProgress) * 100, 100);
            progressHTML = `
                    <div class="achievement-progress">
                        <div class="progress-bar" style="width: ${progressPercentage}%"></div>
                        <span class="progress-text">${currentProgress}/${achievement.maxProgress}</span>
                    </div>
                `;
        }

        achievementElement.innerHTML = `
                <img src="${achievement.icon}" alt="${achievement.title}">
                <div class="achievement-info">
                    <h3>${achievement.title}</h3>
                    <p>${achievement.description}</p>
                    ${progressHTML}
                </div>
                <span class="achievement-status">${isUnlocked ? '已解锁' : '未解锁'}</span>
            `;
        achievementsList.appendChild(achievementElement);
    });

    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(achievements.length / achievementsPerPage);
    document.getElementById('page-info').textContent = `${currentPage} / ${totalPages}`;
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        updateAchievementsList();
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    const totalPages = Math.ceil(achievements.length / achievementsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updateAchievementsList();
    }
});

viewAchievementsBtn.onclick = function () {
    currentPage = 1;
    updateAchievementsList();
    achievementsModal.style.display = "block";
}

const isDarkMode = document.body.classList.contains('night-mode');
achievementsModal.style.backgroundColor = isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.4)';

const achievements = [
    {
        id: 'night_mode',
        title: '暗夜降临',
        description: '成功打开夜间模式。',
        icon: 'images/achievement-icon.webp'
    },
    {
        id: 'day_mode',
        title: '重返光明',
        description: '成功回到普通模式。',
        icon: 'images/achievement-icon-light.webp'
    },
    {
        id: 'first_visit',
        title: '初来乍到',
        description: '首次访问网站',
        icon: 'images/first-visit-icon.webp'
    },
    {
        id: 'explorer',
        title: '探索者',
        description: '浏览所有内容',
        icon: 'images/explorer-icon.webp'
    },
    {
        id: 'night_owl',
        title: '你就熬吧……',
        description: '在凌晨0点至5点使用夜间模式',
        icon: 'images/night-owl-icon.webp'
    },
    {
        id: 'early_bird',
        title: '起得早/熬穿了',
        description: '在早上5点至6点访问网站',
        icon: 'images/early-bird-icon.webp'
    },
    {
        id: 'bookworm',
        title: '有啥看的',
        description: '在网站上累计阅读超过1小时',
        icon: 'images/bookworm-icon.webp',
        maxProgress: 3600
    },
    {
        id: 'problem_solver',
        title: '勤学好问',
        description: '阅读完所有FAQ',
        icon: 'images/problem-solver-icon.webp'
    },
    {
        id: 'continuous_learner',
        title: '有什么值得留恋的吗？',
        description: '连续7天访问网站',
        icon: 'images/continuous-learner-icon.webp',
        maxProgress: 7
    },
    {
        id: 'script_switcher',
        title: '多面手',
        description: '尝试切换不同的小雅脚本',
        icon: 'images/switcher-icon.webp'
    },
    {
        id: 'all_scripts',
        title: '收集控',
        description: '查看所有三种小雅脚本的详情',
        icon: 'images/collector-icon.webp'
    }
];

function checkEarlyBird() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    if (currentHour === 5 && currentMinute >= 0 && currentMinute <= 59 && currentSecond >= 0 && currentSecond <= 59) {
        achievementManager.unlock('early_bird');
    }
}

function checkNightOwl() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if ((currentHour === 0 || currentHour === 1 || currentHour === 2 || currentHour === 3 || currentHour === 4) &&
        currentMinute >= 0 && currentMinute <= 59 &&
        isNightMode) {
        achievementManager.unlock('night_owl');
    }
}

function checkContinuousLearning() {
    const lastVisit = localStorage.getItem('lastVisit');
    const today = new Date().toDateString();
    if (lastVisit !== today) {
        let streak = parseInt(localStorage.getItem('visitStreak') || '0');
        streak++;
        if (streak >= 7) {
            achievementManager.unlock('continuous_learner');
        }
        localStorage.setItem('visitStreak', streak.toString());
        localStorage.setItem('lastVisit', today);
    }
}

function checkBookworm() {
    if (!achievementManager.isUnlocked('bookworm')) {
        let currentReadingTime = parseInt(localStorage.getItem('readingTime') || '0');
        currentReadingTime++;

        if (currentReadingTime >= 3600) {
            achievementManager.unlock('bookworm');
        }

        localStorage.setItem('readingTime', currentReadingTime.toString());
    }
}

function checkProblemSolver(faqId) {
    let openedFAQs = JSON.parse(localStorage.getItem('openedFAQs') || '[]');
    openedFAQs = openedFAQs.filter(id => id && id.trim() !== '');
    if (!openedFAQs.includes(faqId)) {
        openedFAQs.push(faqId);
        localStorage.setItem('openedFAQs', JSON.stringify(openedFAQs));
    }
    if (openedFAQs.length === document.querySelectorAll('#faq details').length) {
        achievementManager.unlock('problem_solver');
    }
}

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function checkExplorer() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        setTimeout(() => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
                console.log('页面已滚动到底部并停留，解锁探索者成就！');
                achievementManager.unlock('explorer');
            }
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        if (!localStorage.getItem('visited')) {
            achievementManager.unlock('first_visit');
            localStorage.setItem('visited', 'true');
        }
    }, 5000);

    setTimeout(checkEarlyBird, 5000);
    checkContinuousLearning();
});

const achievementManager = {
    unlock: function (achievementId) {
        let unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
        if (!unlockedAchievements.includes(achievementId)) {
            unlockedAchievements.push(achievementId);
            localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
            this.showNotification(achievementId);
        }
    },
    isUnlocked: function (achievementId) {
        let unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
        return unlockedAchievements.includes(achievementId);
    },
    getProgress: function (achievementId) {
        switch (achievementId) {
            case 'bookworm':
                return parseInt(localStorage.getItem('readingTime') || '0');
            case 'continuous_learner':
                return parseInt(localStorage.getItem('visitStreak') || '0');
            default:
                return 0;
        }
    },
    showNotification: function (achievementId) {
        const achievement = achievements.find(a => a.id === achievementId);
        if (achievement) {
            showAchievement(achievement.title, achievement.description, achievement.icon);
        }
    }
};

let readingTime;
let readingInterval;

document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('background-canvas');
    canvas.style.zIndex = '-2';
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 50;
    const attractionRange = 150;
    let maxSpeed = 2;
    const maxAttractedParticles = 3;
    const minSize = 3;
    const maxSize = 8;
    let lineDistance = 150;

    const shockwaveCanvas = document.createElement('canvas');
    shockwaveCanvas.style.position = 'fixed';
    shockwaveCanvas.style.top = '0';
    shockwaveCanvas.style.left = '0';
    shockwaveCanvas.style.width = '100%';
    shockwaveCanvas.style.height = '100%';
    shockwaveCanvas.style.pointerEvents = 'none';
    shockwaveCanvas.style.zIndex = '-3';
    document.body.insertBefore(shockwaveCanvas, document.body.firstChild);

    const shockwaveCtx = shockwaveCanvas.getContext('2d');

    function resizeShockwaveCanvas() {
        shockwaveCanvas.width = window.innerWidth;
        shockwaveCanvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeShockwaveCanvas);
    resizeShockwaveCanvas();

    function drawShockwave(x, y) {
        requestAnimationFrame(() => {
            let radius = 0;
            let opacity = 0.8;
            let lineWidth = 3;
            const maxRadius = Math.max(shockwaveCanvas.width, shockwaveCanvas.height) * 0.4;
            const duration = 1000;
            const startTime = performance.now();

            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                shockwaveCtx.clearRect(0, 0, shockwaveCanvas.width, shockwaveCanvas.height);

                radius = maxRadius * progress;
                opacity = 0.8 * (1 - progress);

                if (radius <= 0 || opacity <= 0) {
                    shockwaveCtx.clearRect(0, 0, shockwaveCanvas.width, shockwaveCanvas.height);
                    return;
                }

                shockwaveCtx.beginPath();
                shockwaveCtx.arc(x, y, radius, 0, Math.PI * 2);
                shockwaveCtx.strokeStyle = `rgba(255, 165, 0, ${opacity})`;
                shockwaveCtx.lineWidth = lineWidth;
                shockwaveCtx.stroke();

                const innerRadius = radius * 0.8;
                shockwaveCtx.beginPath();
                shockwaveCtx.arc(x, y, innerRadius, 0, Math.PI * 2);
                shockwaveCtx.strokeStyle = `rgba(255, 215, 0, ${opacity * 0.7})`;
                shockwaveCtx.lineWidth = lineWidth * 0.7;
                shockwaveCtx.stroke();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    shockwaveCtx.clearRect(0, 0, shockwaveCanvas.width, shockwaveCanvas.height);
                }
            }

            requestAnimationFrame(animate);
        });
    }

    function triggerParticleEffect(x, y) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const canvasX = (x - rect.left) * scaleX;
        const canvasY = (y - rect.top) * scaleY;

        mouseParticle.x = canvasX;
        mouseParticle.y = canvasY;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            if (!p.isMouseParticle) {
                const dx = p.x - mouseParticle.x;
                const dy = p.y - mouseParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                p.shockwaveForce = 500 / (1 + distance * 0.1);
            }
        }
    }

    document.addEventListener('click', function (e) {
        requestAnimationFrame(() => {
            const x = e.clientX;
            const y = e.clientY;

            triggerParticleEffect(x, y);
            drawShockwave(x, y);
        });
    });

    readingTime = parseInt(localStorage.getItem('readingTime') || '0');

    if (readingInterval) {
        clearInterval(readingInterval);
    }

    readingInterval = setInterval(checkBookworm, 1000);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    const mouseParticle = {
        x: 0,
        y: 0,
        isMouseParticle: true,
        color: 'rgb(253,164,0)'
    };

    function getThemeColors() {
        const body = document.body;
        if (body.classList.contains('theme-xiaoya-crawl')) {
            return {
                colors: ['#FFA500', '#FFD700', '#FF6347', '#FF4500', '#FFA07A'],
                particleCount: 50,
                maxSpeed: 2,
                lineDistance: 150
            };
        } else if (body.classList.contains('theme-xiaoya-do')) {
            return {
                colors: ['#2196F3', '#64B5F6', '#1E88E5', '#42A5F5', '#90CAF9'],
                particleCount: 60,
                maxSpeed: 1.5,
                lineDistance: 120
            };
        } else if (body.classList.contains('theme-xiaoya-answer')) {
            return {
                colors: ['#9C27B0', '#BA68C8', '#8E24AA', '#AB47BC', '#E1BEE7'],
                particleCount: 40,
                maxSpeed: 1.8,
                lineDistance: 180
            };
        }
        return {
            colors: ['#FFA500', '#FFD700', '#FF6347', '#FF4500', '#FFA07A'],
            particleCount: 50,
            maxSpeed: 2,
            lineDistance: 150
        };
    }

    function updateParticles() {
        const themeConfig = getThemeColors();
        particles = [mouseParticle];

        maxSpeed = themeConfig.maxSpeed;
        lineDistance = themeConfig.lineDistance;

        for (let i = 0; i < themeConfig.particleCount; i++) {
            particles.push(createParticle(themeConfig.colors));
        }
    }

    function createParticle(themeColors) {
        if (!themeColors || !themeColors.length) {
            themeColors = ['#FFA500', '#FFD700', '#FF6347', '#FF4500', '#FFA07A'];
        }
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 2 - 1,
            repelForce: Math.random() < 0.5 ? -1 : 1,
            shockwaveForce: 0,
            radius: Math.random() * (maxSize - minSize) + minSize,
            color: themeColors[Math.floor(Math.random() * themeColors.length)],
            isAttracted: false,
            originalRadius: Math.random() * (maxSize - minSize) + minSize
        };
    }

    const initialConfig = getThemeColors();
    particles.push(mouseParticle);
    for (let i = 0; i < initialConfig.particleCount; i++) {
        particles.push(createParticle(initialConfig.colors));
    }

    document.addEventListener('scriptChanged', updateParticles);

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let attractedCount = 0;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            if (!p.isMouseParticle) {
                if (p.originalRadius === 0) {
                    p.originalRadius = p.radius;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();

                if (p.repelForce < 0) {
                    drawRippleEffect(p);
                }

                if (p.shockwaveForce > 0) {
                    const dx = p.x - mouseParticle.x;
                    const dy = p.y - mouseParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const force = p.shockwaveForce / distance;
                    p.vx += (dx / distance) * force;
                    p.vy += (dy / distance) * force;
                    p.shockwaveForce *= 0.9;
                }

                const dx = mouseParticle.x - p.x;
                const dy = mouseParticle.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < attractionRange && attractedCount < maxAttractedParticles) {
                    const force = (1 - distance / attractionRange) * 0.05;
                    const attractionForce = p.repelForce * force;
                    p.vx += dx / distance * attractionForce;
                    p.vy += dy / distance * attractionForce;
                    p.isAttracted = true;
                    attractedCount++;

                    if (p.repelForce > 0) {
                        p.radius = Math.min(p.radius * 1.05, p.originalRadius * 1.5);
                    } else {
                        p.radius = Math.max(p.radius * 0.95, p.originalRadius * 0.5);
                    }
                } else {
                    p.isAttracted = false;
                    p.radius = Math.max(p.radius * 0.98, p.originalRadius);
                }

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    if (!p2.isMouseParticle) {
                        const dx2 = p.x - p2.x;
                        const dy2 = p.y - p2.y;
                        const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                        if (distance2 < attractionRange) {
                            const force = (1 - distance2 / attractionRange) * 0.01;
                            const interactionForce = p.repelForce * p2.repelForce * force;

                            p.vx += dx2 / distance2 * interactionForce;
                            p.vy += dy2 / distance2 * interactionForce;
                            p2.vx -= dx2 / distance2 * interactionForce;
                            p2.vy -= dy2 / distance2 * interactionForce;
                        }
                    }
                }

                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (speed > maxSpeed) {
                    p.vx = (p.vx / speed) * maxSpeed;
                    p.vy = (p.vy / speed) * maxSpeed;
                }

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx = -p.vx;
                if (p.y < 0 || p.y > canvas.height) p.vy = -p.vy;
            }
        }
        drawLines();
    }

    function drawRippleEffect(particle) {
        const rippleCount = 3;
        const maxRippleRadius = particle.radius * 3;

        for (let i = 0; i < rippleCount; i++) {
            const rippleRadius = particle.radius + (maxRippleRadius - particle.radius) * (i + 1) / rippleCount;
            const opacity = 1 - (i + 1) / rippleCount;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, rippleRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 0, 0, ${opacity * 0.5})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];

                if ((p1.repelForce > 0 && p2.repelForce > 0) ||
                    (p1.isMouseParticle && p2.repelForce > 0) ||
                    (p2.isMouseParticle && p1.repelForce > 0)) {

                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < lineDistance) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);

                        const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                        gradient.addColorStop(0, p1.color);
                        gradient.addColorStop(1, p2.color);
                        ctx.strokeStyle = gradient;

                        ctx.lineWidth = 2 * (1 - distance / lineDistance);
                        ctx.stroke();
                    }
                }
            }

            if (p1.repelForce > 0 && !p1.isMouseParticle) {
                const dx = p1.x - mouseParticle.x;
                const dy = p1.y - mouseParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < lineDistance) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mouseParticle.x, mouseParticle.y);

                    const gradient = ctx.createLinearGradient(p1.x, p1.y, mouseParticle.x, mouseParticle.y);
                    gradient.addColorStop(0, p1.color);
                    gradient.addColorStop(1, mouseParticle.color);
                    ctx.strokeStyle = gradient;

                    ctx.lineWidth = 2 * (1 - distance / lineDistance);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        drawParticles();
        drawLines();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', function (e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        mouseParticle.x = (e.clientX - rect.left) * scaleX;
        mouseParticle.y = (e.clientY - rect.top) * scaleY;
    });

    resizeCanvas();
    for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
    }
    animate();
});

let canPlaySound = false;
let achievementQueue = [];
let isDisplayingAchievement = false;

document.addEventListener('DOMContentLoaded', () => {
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = document.querySelectorAll('.section');
    const soundPrompt = document.getElementById('sound-prompt');
    const interactionEvents = ['click', 'keydown'];
    let hasInteracted = false;

    setTimeout(() => {
        soundPrompt.classList.add('show');
    }, 2000);

    function handleInteraction() {
        if (!hasInteracted) {
            hasInteracted = true;
            canPlaySound = true;
            soundPrompt.classList.add('hide');
            setTimeout(() => {
                soundPrompt.style.display = 'none';
            }, 300);

            interactionEvents.forEach(eventType => {
                document.removeEventListener(eventType, handleInteraction);
            });
        }

        if (!isDisplayingAchievement && achievementQueue.length > 0) {
            displayNextAchievement();
        }
    }

    interactionEvents.forEach(eventType => {
        document.addEventListener(eventType, handleInteraction);
    });

    function highlightTocLink() {
        let scrollPosition = window.scrollY;

        sections.forEach((section, index) => {
            if (section.offsetTop <= scrollPosition + 100) {
                tocLinks.forEach((link) => link.classList.remove('active'));
                tocLinks[index].classList.add('active');
            }
        });
    }

    const throttledScrollHandler = throttle(() => {
        highlightTocLink();
        checkExplorer();
        updateProgressBar();
    }, 200);

    window.addEventListener('scroll', throttledScrollHandler);

    highlightTocLink();
    updateProgressBar();
});

document.addEventListener('DOMContentLoaded', () => {
    let openedFAQs = JSON.parse(localStorage.getItem('openedFAQs') || '[]');
    openedFAQs = openedFAQs.filter(id => id && id.trim() !== '');
    document.querySelectorAll('#faq details').forEach((details, index) => {
        details.id = `faq-${index + 1}`;
        if (openedFAQs.includes(details.id)) {
            details.open = true;
        }
        details.addEventListener('toggle', function () {
            if (this.open) {
                checkProblemSolver(this.id);
            }
        });
        const summary = details.querySelector('summary');
        const content = details.querySelector('.faq-content');

        details.open = false;
        content.style.maxHeight = '0';
        content.style.opacity = '0';
        content.style.padding = '0';
        content.style.visibility = 'hidden';

        summary.addEventListener('click', (e) => {
            e.preventDefault();

            if (!details.open) {
                details.open = true;
                content.style.visibility = 'visible';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        content.style.maxHeight = content.scrollHeight + 'px';
                        content.style.opacity = '1';
                        content.style.padding = '15px';
                    });
                });
            } else {
                content.style.maxHeight = '0';
                content.style.opacity = '0';
                content.style.padding = '0';

                content.addEventListener('transitionend', function closeDetails(e) {
                    if (e.propertyName === 'opacity') {
                        details.open = false;
                        content.style.visibility = 'hidden';
                        content.removeEventListener('transitionend', closeDetails);
                    }
                });
            }
        });
    });
    localStorage.setItem('openedFAQs', JSON.stringify(openedFAQs));
    checkProblemSolver();
});

const backToTopButton = document.getElementById("back-to-top");

window.onscroll = function () {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
};

backToTopButton.onclick = function () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
};

const modal = document.getElementById("donateModal");
const btn = document.getElementById("donateButton");
const span = document.getElementsByClassName("close")[0];

btn.onclick = function (event) {
    event.preventDefault();
    modal.classList.add('show');
    setTimeout(() => {
        modal.style.display = "block";
    }, 10);
}

function closeModal() {
    modal.classList.add('hide');
    setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove('hide');
    }, 300);
}

span.onclick = closeModal;

window.onclick = function (event) {
    if (event.target === modal) {
        closeModal();
    }
}

function showAchievement(title, description, iconUrl) {
    achievementQueue.push({ title, description, iconUrl });
    if (!isDisplayingAchievement) {
        displayNextAchievement();
    }
}

function displayNextAchievement() {
    if (achievementQueue.length === 0) {
        isDisplayingAchievement = false;
        return;
    }

    isDisplayingAchievement = true;
    const { title, description, iconUrl } = achievementQueue.shift();
    const achievementSound = document.getElementById('achievement-sound');
    const popup = document.getElementById('achievement-popup');
    const titleElement = document.getElementById('achievement-title');
    const descriptionElement = document.getElementById('achievement-description');
    const iconElement = document.getElementById('achievement-icon');

    titleElement.textContent = title || '未知成就';
    descriptionElement.textContent = description || '恭喜你获得了一个成就！';
    iconElement.src = iconUrl || 'default-achievement-icon.webp';
    iconElement.alt = title || '成就图标';

    if (canPlaySound) {
        achievementSound.currentTime = 0;
        achievementSound.play().catch(error => console.warn('无法播放音效:', error));
    }

    popup.classList.add('show');
    popup.classList.remove('hide');

    setTimeout(() => {
        popup.classList.add('hide');
        setTimeout(() => {
            popup.classList.remove('show', 'hide');
            displayNextAchievement();
        }, 1000);
    }, 3000);

    logAchievement(title);
}

function logAchievement(achievementTitle) {
    const achievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
    if (!achievements.includes(achievementTitle)) {
        achievements.push(achievementTitle);
        localStorage.setItem('unlockedAchievements', JSON.stringify(achievements));
        console.log(`新成就解锁: ${achievementTitle}`);
    }
}

let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
let isNightMode = false;
let easterEggClickCount = 0;

document.addEventListener('keydown', (event) => {
    handleKonamiInput(event.key);
});

const easterEggTrigger = document.getElementById('easter-egg-trigger');
if (easterEggTrigger) {
    easterEggTrigger.addEventListener('click', () => {
        easterEggClickCount++;
        if (easterEggClickCount >= 5) {
            handleKonamiInput('ClickTrigger');
            easterEggClickCount = 0;
        }
    });
}

function handleKonamiInput(input) {
    if (input === 'ClickTrigger') {
        triggerKonamiEffect();
        return;
    }

    if (input === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            triggerKonamiEffect();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
}

function triggerKonamiEffect() {
    const ball = document.getElementById('transition-ball');
    ball.style.display = 'block';
    setTimeout(() => {
        ball.classList.add('active');
    }, 10);

    setTimeout(() => {
        isNightMode = !isNightMode;
        document.body.classList.toggle('night-mode', isNightMode);
        updateAchievementsList();
        ball.classList.remove('active');
        setTimeout(() => {
            ball.style.display = 'none';
        }, 500);

        if (isNightMode) {
            achievementManager.unlock('night_mode');
            checkNightOwl();
        } else {
            achievementManager.unlock('day_mode');
        }
    }, 500);
}

document.querySelectorAll('.section img').forEach(img => {
    img.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';

        const largeImg = document.createElement('img');
        largeImg.src = img.src;
        largeImg.style.maxWidth = '90%';
        largeImg.style.maxHeight = '90%';
        largeImg.style.objectFit = 'contain';

        modal.appendChild(largeImg);
        document.body.appendChild(modal);

        modal.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    });
});

document.querySelectorAll('.close').forEach(closeButton => {
    closeButton.addEventListener('click', () => {
        const modal = closeButton.closest('.modal');
        modal.classList.add('hide');
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('hide');
        }, 500);
    });
});

function calculateReadingTime(section) {
    const contentClone = section.cloneNode(true);

    contentClone.querySelectorAll('.content-section.hidden').forEach(el => el.remove());
    contentClone.querySelectorAll('pre, code, script, style').forEach(el => el.remove());

    let content = contentClone.textContent;

    const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;
    const numbers = (content.match(/\d+/g) || []).length;
    const punctuation = (content.match(/[,.!?;:'"，。！？；：、]/g) || []).length;

    const chineseReadingSpeed = 300;
    const englishReadingSpeed = 200;
    const numberReadingSpeed = 400;
    const punctuationPause = 0.1;

    const readingTimeInSeconds = Math.round(
        (chineseChars / chineseReadingSpeed) * 60 +
        (englishWords / englishReadingSpeed) * 60 +
        (numbers / numberReadingSpeed) * 60 +
        punctuation * punctuationPause
    );

    let timeEstimate;
    if (readingTimeInSeconds < 60) {
        timeEstimate = `${readingTimeInSeconds} 秒`;
    } else {
        const minutes = Math.floor(readingTimeInSeconds / 60);
        const seconds = readingTimeInSeconds % 60;
        timeEstimate = seconds > 0 ?
            `${minutes} 分 ${seconds} 秒` :
            `${minutes} 分钟`;
    }

    const timeEstimateElement = document.createElement('p');
    timeEstimateElement.style.fontStyle = 'italic';
    timeEstimateElement.style.color = '#666';
    timeEstimateElement.style.marginBottom = '10px';
    timeEstimateElement.style.display = 'flex';
    timeEstimateElement.style.alignItems = 'center';

    timeEstimateElement.innerHTML = `
        <i class="material-icons" style="vertical-align: middle; font-size: 1em; margin-right: 5px;">schedule</i>
        预计阅读时间：${timeEstimate}${section.id === 'comments' ? '（不包含评论）' : ''}
        <span style="margin-left: 10px; font-size: 0.9em; color: #999;">
            (约 ${chineseChars + englishWords} 字)
        </span>
    `;

    return timeEstimateElement;
}

document.querySelectorAll('.section').forEach(section => {
    section.insertBefore(calculateReadingTime(section), section.firstChild);
});

document.addEventListener('scriptChanged', function () {
    document.querySelectorAll('.section > p').forEach(p => {
        if (p.innerHTML.includes('预计阅读时间')) {
            p.remove();
        }
    });

    document.querySelectorAll('.section').forEach(section => {
        section.insertBefore(calculateReadingTime(section), section.firstChild);
    });
});

function updateProgressBar() {
    const scrollPosition = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollPosition / totalHeight) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

function updateVisitCount(count) {
    const pageviews = document.getElementById('pageviews');
    const oldCount = parseInt(pageviews.textContent);
    const duration = 1000;
    const start = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        pageviews.textContent = Math.floor(oldCount + (count - oldCount) * progress);

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

function animateCounter(target, duration = 2500) {
    const counter = document.querySelector('.waline-pageview-count');
    const startValue = 0;
    const increment = target / (duration / 16);
    let currentValue = startValue;

    function updateCounter() {
        currentValue += increment;
        if (currentValue >= target) {
            counter.textContent = Math.round(target);
            return;
        }
        counter.textContent = Math.round(currentValue);
        requestAnimationFrame(updateCounter);
    }

    updateCounter();
}

document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.className === 'waline-pageview-count' &&
                mutation.target.textContent !== '0') {
                const targetValue = parseInt(mutation.target.textContent);
                animateCounter(targetValue);
                observer.disconnect();
            }
        });
    });

    observer.observe(document.querySelector('.waline-pageview-count'), {
        childList: true,
        characterData: true,
        subtree: true
    });
});

(function () {
    let devToolsOpen = false;

    function checkDevTools() {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;

        if (!devToolsOpen && (widthThreshold || heightThreshold)) {
            devToolsOpen = true;
            showMessage();
        }
    }

    function showMessage() {
        let div = document.createElement('div');
        div.style.cssText = `
                position: fixed;
                top: 20px;
                right: 10px;
                width: 350px;
                background: linear-gradient(135deg, #f0ad4e, #d9534f);
                color: white;
                text-align: center;
                padding: 20px;
                font-size: 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 9999;
                transition: all 0.4s ease-in-out;
                border-radius: 8px 8px 0 0;
            `;

        let memes = [
            "不是哥们，这答辩代码也看啊……😅",
            "检测到嘿客！🕵️‍♂️",
            "你怎么知道这里有彩蛋的？🥚",
            "警告：继续查看代码可能导致秃头。本站概不负责！👨‍🦲",
            "要被看光了，55555……😭",
            "这么闲？奖励一个彩蛋！🎉",
        ];

        let meme = memes[Math.floor(Math.random() * memes.length)];
        div.innerHTML = `<span style="font-weight: bold; font-size: 1.2em;">开发者工具已打开 🛠️</span><br><br>${meme}`;

        document.body.appendChild(div);

        setTimeout(() => {
            div.style.transform = 'translateY(-100%)';
        }, 6000);

        setTimeout(() => {
            div.remove();
        }, 6400);
    }

    window.addEventListener('resize', checkDevTools);
    setInterval(checkDevTools, 1000);
})();


document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('theme-xiaoya-crawl');

    const scriptOptions = document.querySelectorAll('.script-option');

    scriptOptions.forEach(option => {
        option.addEventListener('click', function () {
            const scriptType = this.getAttribute('data-script');

            scriptOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');

            document.body.className = document.body.className.replace(/theme-xiaoya-\w+/g, '');
            document.body.classList.add(`theme-${scriptType}`);

            const titleMap = {
                'xiaoya-crawl': '小雅爬爬爬',
                'xiaoya-do': '小雅做做做',
                'xiaoya-answer': '小雅答答答'
            };
            document.getElementById('page-title').textContent = `${titleMap[scriptType]} - 使用教程`;
            document.title = `${titleMap[scriptType]} - 使用教程`;

            const allContentSections = document.querySelectorAll('.content-section');
            allContentSections.forEach(section => {
                if (section.getAttribute('data-script') === scriptType) {
                    section.classList.remove('hidden');
                    section.classList.add('visible');
                } else {
                    section.classList.remove('visible');
                    section.classList.add('hidden');
                }
            });

            localStorage.setItem('preferredScript', scriptType);

            const event = new CustomEvent('scriptChanged', { detail: { script: scriptType } });
            document.dispatchEvent(event);

            if (achievementManager && typeof achievementManager.unlock === 'function') {
                achievementManager.unlock('script_switcher');
            }
        });
    });

    const savedScript = localStorage.getItem('preferredScript');
    if (savedScript) {
        const savedOption = document.querySelector(`.script-option[data-script="${savedScript}"]`);
        if (savedOption) {
            savedOption.click();
        }
    }

    const viewedScripts = JSON.parse(localStorage.getItem('viewedScripts') || '{}');

    document.addEventListener('scriptChanged', function (e) {
        const scriptType = e.detail.script;
        viewedScripts[scriptType] = true;
        localStorage.setItem('viewedScripts', JSON.stringify(viewedScripts));

        if (Object.keys(viewedScripts).length >= 3) {
            if (achievementManager && typeof achievementManager.unlock === 'function') {
                achievementManager.unlock('all_scripts');
            }
        }
    });
});

window.addEventListener('scroll', updateProgressBar);
window.addEventListener('resize', updateProgressBar);