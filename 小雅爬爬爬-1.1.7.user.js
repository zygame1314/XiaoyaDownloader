// ==UserScript==
// @name        小雅爬爬爬
// @match        https://*.ai-augmented.com/*
// @grant       none
// @description 爬取小雅平台的课件
// @license MIT
// @author     Yi
// @version    1.1.7
// @namespace  https://greasyfork.org/users/1268039
// @downloadURL https://update.greasyfork.org/scripts/488536/%E5%B0%8F%E9%9B%85%E7%88%AC%E7%88%AC%E7%88%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/488536/%E5%B0%8F%E9%9B%85%E7%88%AC%E7%88%AC%E7%88%AC.meta.js
// ==/UserScript==

var isProgressBarVisible = true;
// 添加样式规则来更改 placeholder 的颜色
var styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `

#searchInput::placeholder {
  color: #ffa500;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  appearance: none;
  background-color: #fff;
  border: 2px solid #ffa500;
  border-radius: 4px;
  margin-right: 10px;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.custom-checkbox:checked {
  background-color: #ffa500;
  border-color: #ffa500;
}

.custom-checkbox:checked::before {
  content: '✓';
  display: block;
  text-align: center;
  line-height: 18px;
  color: #fff;
  font-size: 16px;
}

.custom-checkbox:hover {
  border-color: #ff8c00;
}

.glowing-text {
  background: linear-gradient(90deg, #ffa500, #ff8c00, #ffa500);
  background-size: 200% 100%;
  animation: flowingGradient 3s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@keyframes flowingGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes slideInFade {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideOutFade {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }

    .new-history-item {
        animation: slideInFade 0.5s ease-out forwards;
    }

    .remove-history-item {
        animation: slideOutFade 0.5s ease-in forwards;
    }

@keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }

    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.9); }
    }

    .popup-show {
        animation: fadeIn 0.3s ease-out forwards;
    }

    .popup-hide {
        animation: fadeOut 0.3s ease-in forwards;
    }

    @keyframes glowPulse {
  0% {
    box-shadow: 0 0 5px #fcbb34;
  }
  50% {
    box-shadow: 0 0 15px #fcbb34, 0 0 20px #f0932b; /* 在中间加强发光 */
  }
  100% {
    box-shadow: 0 0 5px #fcbb34;
  }
}

#teacherInfoContainer, #userSearchContainer {
        font-family: 'Arial', sans-serif;
    }
    .title {
        color: #333;
        border-bottom: 2px solid #fcbb34;
        padding-bottom: 10px;
        margin-bottom: 15px;
    }
    .teacher-list, .user-info {
        list-style-type: none;
        padding: 0;
    }
    .teacher-item, .user-info p {
        background-color: #fff;
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.3s ease;
    }
    .teacher-item:hover, .user-info p:hover {
        background-color: #FFE0B2;
        transform: translateX(5px);
    }
    .teacher-name, .user-info strong {
        font-weight: bold;
        color: #e69b00;
    }
    .teacher-number {
        color: #757575;
        font-size: 0.9em;
    }
    .loading, .no-data {
        text-align: center;
        color: #757575;
    }
    .dot {
        animation: blink 1s infinite;
    }
    @keyframes blink {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }
    .search-input {
        width: 200px;
        padding: 8px;
        border: 1px solid #FFD180;
        border-radius: 4px;
        margin-bottom: 10px;
    }
    .search-button {
        padding: 8px 12px;
        border: none;
        border-radius: 4px;
        background-color: #fcbb34;
        color: #fff;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }
    .search-button:hover {
        background-color: #e69b00;
    }
    .search-results {
        margin-top: 10px;
        border: 1px solid #FFD180;
        padding: 10px;
        border-radius: 4px;
        background-color: #fff;
    }
    .search-hint {
        color: #757575;
        font-style: italic;
        text-align: center;
        margin-top: 10px;
    }
`;
document.head.appendChild(styleSheet);

(function() {
    'use strict';

    // 动态导入dotlottie-player模块
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs';
    script.type = 'module'; // 指定导入类型为module
    document.head.appendChild(script); // 将脚本添加到<head>中

    // 监听脚本的加载事件以确认导入成功
    script.onload = () => {
        console.log('dotlottie-player模块已导入成功！');
    };

    // 监听错误事件以确认导入失败
    script.onerror = () => {
        console.error('无法导入dotlottie-player模块！');
    };
})();

let course_resources;
let historyListElement;
let svgElementIds = [];
let originalOrder = null;
let historyPopup = null;
let downloadHistory = [];
const hostname = window.location.hostname;

// 等待 iframe 加载完成
function waitForIframe(selector, callback) {
    const iframe = document.querySelector(selector);
    if (iframe && iframe.contentDocument.readyState === 'complete') {
        callback(iframe); // iframe 已加载，执行回调
    } else {
        setTimeout(() => waitForIframe(selector, callback), 50); // 等待 50ms 后重试
    }
}

// 获取 SVG 元素 ID (仅数字)
function getSvgElementIds(iframe) {
    const iframeDocument = iframe.contentDocument;
    const targetSvgElement = iframeDocument.querySelector("body > svg > g");
    const gElementsWithId = targetSvgElement.querySelectorAll("g[id]");

    // 过滤出纯数字 ID
    const numericIds = Array.from(gElementsWithId)
    .filter(element => /^\d+$/.test(element.id)) // 正则表达式匹配纯数字
    .map(element => element.id);
    return numericIds;
}

// 处理 iframe 的回调函数
function handleIframeLoad(iframe) {
    console.log("目标 iframe 已加载完成！");

    // 跨域处理
    try {
        svgElementIds = getSvgElementIds(iframe); // 更新外部作用域中的 svgElementIds
        console.log(svgElementIds);
    } catch (error) {
        console.error("无法访问 iframe 内容，可能存在跨域限制:", error);
    }
}

// 监视页面的变化
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'IFRAME') {
                    waitForIframe("#xy_app_content iframe", handleIframeLoad);
                }
            }
        }
    }
});

// 开始监视
observer.observe(document.body, { childList: true, subtree: true });

function parseContent() {
    console.oldLog("::parseContent");

    // 在解析课程内容前清除筛选条件
    window.currentSearchKeyword = '';
    window.currentFilterCategory = '';
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.value = '';
    }
    const quickFilterSelect = document.getElementById("quickFilterSelect");
    if (quickFilterSelect) {
        quickFilterSelect.selectedIndex = 0; // 选择 "全部"
    }

    var download_url = 'https://' + hostname + '/api/jx-oresource/cloud/file_url/';
    var download_list = document.getElementById("download_list");
    download_list.innerHTML = '<h3 style="color:#fcbb34; font-weight:bold;">课程附件清单</h3>';

    for (let i in course_resources) {
        let resource = course_resources[i];
        let file_name = resource.name;
        let create_time = new Date(resource.created_at).toLocaleDateString();

        if (resource.mimetype) {
            const token = getCookie();

            fetch(download_url + resource.quote_id, { // 添加 headers
                headers: {
                    Authorization: `Bearer ${token}`
        }
            })
                .then(function(response) {
                return response.json();
            })
                .then(function(data) {
                if (data.success) {
                    let file_url = data.data.url;

                    var file_container = document.createElement('div');
                    file_container.className = 'file-item';
                    file_container.style.display = 'flex';
                    file_container.style.alignItems = 'center';

                    var checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'custom-checkbox';
                    checkbox.style.marginRight = '10px';
                    checkbox.setAttribute('data-visible', 'true');

                    var file_info = document.createElement('a');
                    file_info.innerHTML = file_name;
                    file_info.href = file_url;
                    file_info.target = "_blank";
                    file_info.className = 'download-link link-style'; // 添加'download-link'类
                    file_info.style.textDecoration = 'none';
                    file_info.title = `创建日期：${create_time}`;
                    file_info.setAttribute('data-created-at', resource.created_at);
                    file_info.setAttribute('data-origin-name', file_name); // 保存原始文件名称
                    file_info.setAttribute('data-resource-id', resource.id);
                    file_info.setAttribute('data-parent-id', resource.parent_id);
                    file_info.draggable = true; // 允许拖动
                    file_info.addEventListener('dragstart', (event) => {
                        event.dataTransfer.effectAllowed = 'move';
                        event.dataTransfer.setData('text/plain', file_url); // 保存下载地址
                        event.dataTransfer.setData('text/filename', file_name); // 保存文件名
                    });
                    file_info.style.display = 'inline-block';
                    file_info.style.padding = '5px 10px';
                    file_info.style.borderRadius = '5px'; // 添加圆角
                    file_info.style.transition = 'all 0.3s ease'; // 过渡效果，用于动画
                    // 鼠标悬停样式
                    file_info.addEventListener('mouseover', () => {
                        file_info.style.backgroundColor = '#FFD180'; // 背景变色
                        file_info.style.color = 'white'; // 文字颜色
                        file_info.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)'; // 阴影效果
                    });
                    // 鼠标移出样式
                    file_info.addEventListener('mouseout', () => {
                        file_info.style.backgroundColor = 'transparent'; // 背景透明
                        file_info.style.color = '#007bff'; // 恢复文字颜色
                        file_info.style.boxShadow = 'none'; // 移除阴影
                    });
                    // 点击时的样式变化
                    file_info.addEventListener('mousedown', () => {
                        file_info.style.transform = 'scale(0.95)'; // 按下效果
                    });
                    file_info.addEventListener('mouseup', () => {
                        file_info.style.transform = 'scale(1)'; // 恢复原样
                    });

                    file_info.addEventListener('mouseover', () => {
                        file_info.style.textDecoration = 'underline';
                        file_info.style.color = '#000';
                        file_info.style.fontWeight = "bold";
                    });

                    file_info.addEventListener('mouseout', function() {
                        file_info.style.textDecoration = 'none';
                        file_info.style.color = '';
                    });

                    // 拦截点击事件
                    file_info.addEventListener('click', function(event) {
                        event.preventDefault(); // 阻止默认行为
                        courseDownload(file_url, file_name); // 调用下载函数
                    });

                    file_container.appendChild(checkbox);
                    file_container.appendChild(file_info);
                    file_container.style.borderBottom = '1px solid #eee';
                    file_container.style.fontWeight = "bold";
                    file_container.style.padding = '5px 10px';
                    file_container.style.justifyContent = 'flex-start';
                    file_container.style.alignItems = 'center';

                    console.oldLog('::parse', file_name, file_url);
                    download_list.append(file_container);
                }
            }).catch(function(e) {
                console.oldLog('!!error', e);
            });
        }
    }
}

let toggleButton;

// 在文档中创建一个容器来放置所有下载进度条
let downloadsContainer = document.getElementById('downloadsContainer');
if (!downloadsContainer) {
    downloadsContainer = document.createElement('div');
    downloadsContainer.id = 'downloadsContainer';
    downloadsContainer.style.position = 'fixed';
    downloadsContainer.style.bottom = '150px';
    downloadsContainer.style.left = '10px';
    downloadsContainer.style.right = 'auto';
    downloadsContainer.style.zIndex = '9999';
    downloadsContainer.style.backgroundColor = '#FFF3E0';
    downloadsContainer.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2)';
    downloadsContainer.style.borderRadius = '8px';
    downloadsContainer.style.padding = '30px';
    downloadsContainer.style.width = 'auto';
    downloadsContainer.style.minWidth = '300px';
    downloadsContainer.style.boxSizing = 'border-box';
    downloadsContainer.style.margin = '0 auto';
    downloadsContainer.style.border = '1px solid #FFD180';
    // 应用过渡效果到 transform 属性
    downloadsContainer.style.transition = 'transform 0.3s ease-in-out';
    // 设置最大高度限制和溢出滚动
    downloadsContainer.style.maxHeight = '190px';
    downloadsContainer.style.overflowY = 'auto';
    downloadsContainer.style.transform = 'translateX(-90%)';
    downloadsContainer.addEventListener('dragover', function(e) {
        e.preventDefault(); // 阻止默认行为以允许拖放
        e.dataTransfer.dropEffect = 'move';
    });

    downloadsContainer.addEventListener('drop', function(e) {
        e.preventDefault(); // 阻止默认行为
        var downloadUrl = e.dataTransfer.getData('text/plain');
        var filename = e.dataTransfer.getData('text/filename');
        if (downloadUrl && filename) {
            courseDownload(downloadUrl, filename);
        }
    });

    // 创建收起/展示按钮
    toggleButton = document.createElement('button');
    toggleButton.title = '点击展开/收折进度条'
    toggleButton.textContent = '\u25BA'; // 初始为右箭头
    toggleButton.style.position = 'absolute';
    toggleButton.style.top = '50%';
    toggleButton.style.right = '8px';
    toggleButton.style.transform = 'translateY(-50%) rotate(0deg)';
    toggleButton.style.zIndex = '10000';
    toggleButton.style.border = 'none';
    toggleButton.style.boxShadow = '0 2px 4px 0 rgba(0, 0, 0, 0.24), 0 4px 5px 0 rgba(0, 0, 0, 0.19)'; // 添加层次感阴影
    toggleButton.style.background = 'linear-gradient(45deg, #FFC107, #FF9800)'; // 渐变背景
    toggleButton.style.borderRadius = '8px'; // 圆角
    toggleButton.style.padding = '4px 8px'; // 内边距
    toggleButton.style.paddingRight = '2px';
    toggleButton.style.paddingLeft = '2px';
    toggleButton.style.color = 'white'; // 按钮颜色为白色
    toggleButton.style.fontSize = '12px'; // 字体大小
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.transition = 'background-color 0.3s, box-shadow 0.3s, transform 0.3s'; // 过渡效果
    toggleButton.style.textShadow = '0 0 0px transparent';

    toggleButton.onmouseover = function() {
        toggleButton.style.background = 'linear-gradient(45deg, #FFEB3B, #FFC107)'; // 悬停时的渐变背景
        toggleButton.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.24), 0 6px 10px 0 rgba(0, 0, 0, 0.19)'; // 悬停时增加阴影的层次和模糊度
        toggleButton.style.transform = 'translateY(-60%) rotate(0deg)'; // 按钮向上移动，增加点击感
    };

    toggleButton.onmouseout = function() {
        toggleButton.style.background = 'linear-gradient(45deg, #FFC107, #FF9800)'; // 正常时的渐变背景
        toggleButton.style.boxShadow = '0 2px 4px 0 rgba(0, 0, 0, 0.24), 0 4px 5px 0 rgba(0, 0, 0, 0.19)'; // 恢复正常阴影
        toggleButton.style.transform = 'translateY(-50%) rotate(0deg)'; // 恢复原位置
    };

    let isCollapsed = true; // 初始状态设为已收起

    toggleButton.onclick = function() {
        // 切换收起/展开状态
        isCollapsed = !isCollapsed;

        if (isCollapsed) {
            downloadsContainer.style.transform = `translateX(-90%)`;
            toggleButton.textContent = '\u25BA'; // 右箭头，表示容器已收起
        } else {
            downloadsContainer.style.transform = 'translateX(0)';
            toggleButton.textContent = '\u25C4'; // 左箭头，表示容器已展开
        }
        toggleButton.style.transform = 'translateY(-50%) rotate(360deg)'; // 旋转箭头
    };

    // 将收起/展示按钮添加到 downloadsContainer
    downloadsContainer.appendChild(toggleButton);

    // 创建 dotlottie-player 容器
    let lottieContainer = document.createElement('div');
    lottieContainer.style.position = 'absolute';
    lottieContainer.style.top = '0';
    lottieContainer.style.left = '0';
    lottieContainer.style.width = '100%';
    lottieContainer.style.height = '100%';
    lottieContainer.style.zIndex = '-1'; // 确保 lottie 在底层
    lottieContainer.innerHTML = `
        <dotlottie-player src="https://lottie.host/0500ecdb-7f3b-4f73-ab09-155a70f85ce3/ZCLltVc7A4.json"
                          background="transparent" speed="1"
                          style="width: 100%; height: 100%;" loop autoplay>
        </dotlottie-player>`;

    // 将 dotlottie-player 容器添加到 downloadsContainer 的顶部
    downloadsContainer.prepend(lottieContainer);
}
// 确保 downloadsContainer 被添加到文档中
if (!document.body.contains(downloadsContainer)) {
    document.body.appendChild(downloadsContainer);
}

function updateContainerPosition() {
    // 获取窗口的高度
    let windowHeight = window.innerHeight;

    // 计算容器的高度（包括内边距和边框）
    let downloadsContainerHeight = downloadsContainer.offsetHeight;

    // 获取当前容器的顶部位置
    let currentTop = downloadsContainer.getBoundingClientRect().top;

    // 如果容器底部将要超出屏幕，则向上移动容器
    if (currentTop + downloadsContainerHeight > windowHeight) {
        let newTop = windowHeight - downloadsContainerHeight - 10; // 留出10px的边距
        downloadsContainer.style.top = `${newTop}px`;
        downloadsContainer.style.bottom = 'auto';
    }
}

function updateIndicator() {
    let indicator = document.getElementById('progressIndicator');
    let progressBarCount = downloadsContainer.querySelectorAll('.progressBar').length;

    if (!indicator) {
        // 如果指示器不存在，创建指示器
        indicator = document.createElement('div');
        indicator.id = 'progressIndicator';
        indicator.style.position = 'absolute';
        indicator.style.top = '10px';
        indicator.style.right = '5px';
        indicator.style.backgroundColor = '#f00';
        indicator.style.backgroundImage = 'linear-gradient(to bottom right, #ffcc80, #ff8c00)';
        indicator.style.color = 'white';
        indicator.style.textShadow = '0px 1px 2px rgba(0, 0, 0, 0.7)'; // 添加文本阴影
        indicator.style.borderRadius = '50%';
        indicator.style.width = '20px';
        indicator.style.height = '20px';
        indicator.style.display = 'flex';
        indicator.style.alignItems = 'center';
        indicator.style.justifyContent = 'center';
        indicator.style.fontSize = '12px';
        indicator.style.fontWeight = 'bold';
        indicator.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.4)'; // 添加外阴影
        indicator.style.transition = 'background-color 0.3s, box-shadow 0.3s'; // 平滑变化的过渡效果
        downloadsContainer.appendChild(indicator);
    }
    // 更新指示器的文本，即使进度条数量为0也显示
    indicator.textContent = progressBarCount;
}

function updateDownloadsContainerVisibility() {
    // 检查是否存在除 lottieContainer、提示信息、收起按钮和指示器外的其他子元素
    const nonEmptyNodes = Array.from(downloadsContainer.children).filter(child => {
        return !child.classList.contains('slide-out') && child.tagName !== 'P' &&
            child !== downloadsContainer.firstChild && child !== toggleButton &&
            child.id !== 'progressIndicator';
    });

    if (nonEmptyNodes.length === 0) {
        if (!downloadsContainer.querySelector('p')) {
            let emptyText = document.createElement('p');
            emptyText.innerHTML = `
            暂无下载内容 ᓚᘏᗢ<br>
            <span style="font-size: 10px;">(可拖动文件下载)</span>
            `;
            emptyText.style.color = '#FF9800';
            emptyText.style.textAlign = 'center';
            emptyText.style.fontFamily = 'Microsoft YaHei';
            emptyText.style.fontSize = '16px';
            emptyText.style.fontWeight = 'bold';
            emptyText.style.padding = '20px';
            emptyText.style.marginTop = '15px';
            emptyText.style.borderRadius = '8px';
            emptyText.style.opacity = '0';
            emptyText.style.transition = 'opacity 1s ease-in-out, transform 1s';
            emptyText.style.transform = 'translateY(-20px)';
            emptyText.style.top = '50%';

            // 添加到DOM后触发动画
            setTimeout(() => {
                emptyText.style.opacity = '1';
                emptyText.style.transform = 'translateY(0)';
            }, 100);

            // 轻微上下浮动动画
            emptyText.animate([
                { transform: 'translateY(0)' },
                { transform: 'translateY(-10px)' },
                { transform: 'translateY(0)' }
            ], {
                duration: 3000,
                iterations: Infinity,
                easing: 'ease-in-out'
            });

            downloadsContainer.appendChild(emptyText);
        }
        // 显示或隐藏进度条容器基于 isProgressBarVisible 变量
        downloadsContainer.style.display = isProgressBarVisible ? 'block' : 'none';
    } else {
        let emptyText = downloadsContainer.querySelector('p');
        if (emptyText) {
            downloadsContainer.removeChild(emptyText);
        }
    }
    // 更新按钮可见性
    toggleButton.style.display = isProgressBarVisible ? 'block' : 'none';
}

updateIndicator()
updateDownloadsContainerVisibility();

function courseDownload(file_url, file_name) {
    return new Promise((resolve, reject) => {
        const useThirdPartyDownload = localStorage.getItem('useThirdPartyDownload') === 'true';
        const token = getCookie();
        const downloadsContainer = document.getElementById('downloadsContainer');
        const controller = new AbortController();
        const signal = controller.signal;

        // 创建进度条相关元素
        let progressText = document.createElement('span');
        let progressBar = document.createElement('div');
        let progressBarContainer = document.createElement('div');
        let progressContainer = document.createElement('div');

        // 设置文本
        progressText.innerText = `正在下载: ${file_name}`;
        progressText.style.color = '#FF9800';
        progressText.style.fontWeight = 'bold';
        progressText.style.fontSize = '16px';
        progressText.style.fontFamily = 'Microsoft YaHei';
        progressText.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.1)';
        progressText.style.padding = '5px 0';
        progressText.style.borderRadius = '4px';

        // 设置progressBar
        progressBar.style.height = '18px';
        progressBar.style.width = '0%';
        progressBar.style.borderRadius = '8px';
        progressBar.className = 'progressBar'

        // 设置progressBarContainer
        progressBarContainer.style.background = '#E0E0E0';
        progressBarContainer.style.borderRadius = '8px';
        progressBarContainer.style.height = '18px';
        progressBarContainer.style.width = '100%';
        progressBarContainer.style.overflow = 'hidden';
        progressBarContainer.appendChild(progressBar);

        // 设置 progressContainer
        progressContainer.style.display = 'flex';
        progressContainer.style.flexDirection = 'column';
        progressContainer.style.alignItems = 'center';
        progressContainer.style.justifyContent = 'space-around';
        progressContainer.appendChild(progressText);

        // 创建一个用来显示下载百分比的span元素
        let progressPercentText = document.createElement('span');
        progressPercentText.style.fontFamily = 'Arial Rounded MT Bold, Helvetica Rounded, Arial, sans-serif';
        progressPercentText.style.fontSize = '16px';
        progressPercentText.style.marginLeft = '10px';
        progressPercentText.style.position = 'absolute';
        progressPercentText.style.left = '0';
        progressPercentText.style.top = '0';
        progressPercentText.style.width = '100%';
        progressPercentText.style.textAlign = 'center';
        progressPercentText.style.lineHeight = '18px';
        progressPercentText.style.zIndex = '1';
        progressPercentText.style.fontWeight = 'bold';

        progressContainer.appendChild(progressBarContainer);
        progressBarContainer.style.position = 'relative';
        progressBarContainer.appendChild(progressPercentText);
        progressContainer.classList.add('slide-in');

        updateIndicator();
        updateDownloadsContainerVisibility();

        downloadsContainer.appendChild(progressContainer);
        window.abortControllers = window.abortControllers || {};
        window.abortControllers[file_name] = controller;

        // 添加文件大小和停止按钮到一个新的横向排列的容器
        let controlContainer = document.createElement('div');
        controlContainer.style.display = 'flex';
        controlContainer.style.justifyContent = 'space-between';
        controlContainer.style.alignItems = 'center';
        controlContainer.style.width = '100%';

        // 创建文件大小显示元素
        let fileSizeSpan = document.createElement('span');
        fileSizeSpan.style.fontFamily = 'Microsoft YaHei';
        fileSizeSpan.style.fontSize = '14px';
        fileSizeSpan.style.marginRight = 'auto';
        fileSizeSpan.style.fontWeight = 'bold';

        let stopButton = document.createElement('button');
        stopButton.textContent = '停止';
        stopButton.style.padding = '5px 10px';
        stopButton.style.border = 'none';
        stopButton.style.borderRadius = '5px';
        stopButton.style.backgroundColor = '#FF4136';
        stopButton.style.color = 'white';
        stopButton.style.cursor = 'pointer';
        stopButton.style.fontSize = '14px';
        stopButton.style.fontWeight = 'bold';
        stopButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        stopButton.style.transition = 'transform 0.3s ease';
        stopButton.style.marginTop = '10px';

        stopButton.onmouseover = function() {
            stopButton.style.transform = 'scale(1.2)';
        };

        stopButton.onmouseout = function() {
            stopButton.style.transform = 'scale(1)';
        };

        stopButton.onclick = function() {
            console.log(`尝试停止下载: ${file_name}`);
            controller.abort(); // 使用 AbortController 来中断下载
            progressContainer.classList.add('slide-out');
            progressContainer.addEventListener('animationend', () => {
                progressContainer.remove();
                updateIndicator();
                updateDownloadsContainerVisibility();
            }, { once: true });
        };

        controlContainer.appendChild(fileSizeSpan);
        controlContainer.appendChild(stopButton);
        progressContainer.appendChild(controlContainer);

        let styleElement = document.getElementById('progress-bar-styles');
        if (!styleElement) {
            let styles = document.createElement('style');
            styles.id = 'progress-bar-styles';
            styles.textContent = `
            .progressBar {
                background-color: #FF9800;
                background-image: repeating-linear-gradient(
                    45deg,
                    rgba(255, 255, 255, 0.15) 25%,
                    transparent 25%,
                    transparent 50%,
                    rgba(255, 255, 255, 0.15) 50%,
                    rgba(255, 255, 255, 0.15) 75%,
                    transparent 75%,
                    transparent
                );
                background-size: 40px 40px;
                animation: moveBackground 2s linear infinite;
            }
            @keyframes moveBackground {
                from { background-position: 0 0; }
                to { background-position: 40px 0; }
            }
            .slide-in {
                animation: slideIn 0.5s ease-out forwards;
            }
            .slide-out {
                animation: slideOut 0.5s ease-in forwards;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
            document.head.appendChild(styles);
        }

        function bytesToSize(bytes) {
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes === 0) return '0 Byte';
            const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
        }

        updateIndicator();
        updateDownloadsContainerVisibility();
        updateContainerPosition();

        // 保存下载历史
        saveDownloadHistory(file_name, file_url);

        if (useThirdPartyDownload) {
            // 使用第三方下载软件
            const downloadLink = document.createElement('a');
            downloadLink.href = file_url;
            downloadLink.download = file_name;
            downloadLink.setAttribute('data-downloadurl', `application/octet-stream:${file_name}:${file_url}`);
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            // 模拟下载进度
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                if (progress <= 100) {
                    progressBar.style.width = `${progress}%`;
                    progressPercentText.innerText = `${progress}%`;
                } else {
                    clearInterval(interval);
                    progressContainer.classList.add('slide-out');
                    progressContainer.addEventListener('animationend', () => {
                        progressContainer.remove();
                        updateIndicator();
                        updateDownloadsContainerVisibility();
                    }, { once: true });
                }
            }, 200);

            // 立即解析 Promise，允许下一个下载开始
            resolve();
        } else {
            // 使用fetch API开始下载文件
            fetch(file_url, {
                signal,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                // 获取文件大小信息
                const contentLength = response.headers.get('Content-Length');
                if (contentLength) {
                    // 更新文件大小显示
                    const fileSize = bytesToSize(contentLength);
                    fileSizeSpan.innerText = `文件大小: ${fileSize}`;
                } else {
                    // 如果无法获取文件大小，则显示消息
                    fileSizeSpan.innerText = `无法获取文件大小`;
                    updateIndicator()
                    updateDownloadsContainerVisibility();
                }

                const reader = response.body.getReader();
                let receivedBytes = 0;
                let chunks = [];

                reader.read().then(function processResult(result) {
                    if (result.done) {
                        // 下载完成后的处理
                        const blob = new Blob(chunks, { type: 'application/octet-stream' });
                        const downloadUrl = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = downloadUrl;
                        a.download = file_name;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(downloadUrl);
                        progressContainer.classList.add('slide-out');
                        progressContainer.addEventListener('animationend', () => {
                            progressContainer.remove();
                            updateIndicator(); // 更新指示器
                            updateDownloadsContainerVisibility(); // 刷新下载列表的可见性
                        }, { once: true });
                        return;
                    }
                    // 存储接收到的数据块
                    chunks.push(result.value);
                    receivedBytes += result.value.length;
                    resolve();
                    // 计算下载的百分比并更新UI
                    let percentComplete = (receivedBytes / contentLength) * 100;
                    progressBar.style.width = `${percentComplete.toFixed(2)}%`; // 更新进度条的宽度
                    progressPercentText.innerText = `${percentComplete.toFixed(2)}%`;

                    // 读取下一部分数据
                    reader.read().then(processResult);
                })
                    .catch(e => {
                    // 下载失败或被中止时的处理
                    if (e.name === 'AbortError') {
                        console.error(`${file_name} 的下载被用户取消了`);
                    } else {
                        console.error(e);
                    }
                    progressContainer.remove();
                    updateIndicator()
                    updateDownloadsContainerVisibility();
                    reject(e);
                });
            });
        }
    });
}

window.currentSearchKeyword = '';
window.currentFilterCategory = '';

window.updateUI = function() {
    var download_list = document.getElementById("download_list");
    if (!document.getElementById("lottie-animation-container")) {
        var lottieContainer = document.createElement("div");
        lottieContainer.id = "lottie-animation-container";
        lottieContainer.innerHTML = `
        <dotlottie-player src="https://lottie.host/f6cfdc36-5c9a-4dac-bb71-149cdf2e7d92/VRIhn9vXE5.json"
                          background="transparent" speed="1"
                          style="width: 300px; height: 300px; transform: scaleX(-1);" loop autoplay>
        </dotlottie-player>`;
        lottieContainer.style.position = "absolute";
        lottieContainer.style.top = "50%";
        lottieContainer.style.right = "0";
        lottieContainer.style.transform = "translateY(-50%)";
        lottieContainer.style.zIndex = "-1";

        download_list.appendChild(lottieContainer);
    }

    // 为新创建的链接添加拖放事件监听器
    const fileLinks = document.querySelectorAll("#download_list .file-item a");
    fileLinks.forEach(fileLink => {
        fileLink.draggable = true;
        fileLink.addEventListener('dragstart', (event) => {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', fileLink.href);
            event.dataTransfer.setData('text/filename', fileLink.getAttribute('data-origin-name'));
        });
    });

    var container = document.getElementById("searchAndFilterContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "searchAndFilterContainer";
        container.style.position = "relative"
        container.style.display = "flex";
        container.style.marginBottom = '10px';

        download_list.prepend(container);
    }

    var searchInput = document.getElementById("searchInput");
    if (!searchInput) {
        searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.placeholder = "搜索文件名/后缀名";
        searchInput.id = "searchInput";
        searchInput.style.padding = '5px';
        searchInput.style.marginRight = '10px';
        searchInput.style.border = '2px solid #ffa500';
        searchInput.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.1)';
        searchInput.style.borderRadius = '4px';
        searchInput.style.outline = 'none';
        searchInput.style.color = '#ffa500';
        searchInput.style.fontWeight = 'bold';
        searchInput.style.backgroundColor = '#fffbe6';

        searchInput.addEventListener("input", function () {
            filterList(this.value);
        });
        container.appendChild(searchInput);
    }

    var quickFilterSelect = document.getElementById("quickFilterSelect");
    if (!quickFilterSelect) {
        quickFilterSelect = document.createElement("select");
        quickFilterSelect.id = "quickFilterSelect";
        quickFilterSelect.style.padding = '5px';
        quickFilterSelect.style.marginRight = '10px';
        quickFilterSelect.style.border = '2px solid #ffa500';
        quickFilterSelect.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.1)';
        quickFilterSelect.style.borderRadius = '4px';
        quickFilterSelect.style.outline = 'none';
        quickFilterSelect.style.cursor = 'pointer';
        quickFilterSelect.style.color = '#ffa500';
        quickFilterSelect.style.fontWeight = 'bold';
        quickFilterSelect.style.backgroundColor = '#fffbe6';
        window.quickFilters.forEach(function (filter) {
            var option = document.createElement("option");
            option.value = filter.value;
            option.text = filter.label;
            quickFilterSelect.appendChild(option);
        });
        quickFilterSelect.addEventListener("change", function () {
            filterListByCategory(this.value);
        });

        container.appendChild(quickFilterSelect);
    } else {
        quickFilterSelect.innerHTML = ''; // 清空已有的选项

        // 重新添加筛选选项
        window.quickFilters.forEach(function (filter) {
            var option = document.createElement("option");
            option.value = filter.value;
            option.text = filter.label;
            option.style.fontWeight = 'bold';
            quickFilterSelect.appendChild(option);
        });

        // 更新选中状态以匹配当前的筛选条件
        for (var i = 0; i < quickFilterSelect.options.length; i++) {
            if (quickFilterSelect.options[i].value === window.currentFilterCategory) {
                quickFilterSelect.selectedIndex = i;
                break;
            }
        }
    }

    // 添加排序下拉框
    var sortSelect = document.getElementById("sortSelect");
    if (!sortSelect) {
        // 如果还没有排序下拉框，则创建
        sortSelect = document.createElement("select");
        sortSelect.id = "sortSelect";
        // 修改排序下拉框样式
        sortSelect.style.padding = '5px';
        sortSelect.style.marginRight = '10px';
        sortSelect.style.border = '2px solid #ffa500';
        sortSelect.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.1)'; // 添加内部阴影效果
        sortSelect.style.borderRadius = '4px';
        sortSelect.style.outline = 'none';
        sortSelect.style.cursor = 'pointer';
        sortSelect.style.color = '#ffa500'; // 设置文本颜色
        sortSelect.style.fontWeight = 'bold';
        sortSelect.style.backgroundColor = '#fffbe6';

        // 添加排序选项
        var sortOptions = [
            { value: '', label: '排序方式' },
            { value: 'date_asc', label: '日期升序' },
            { value: 'date_desc', label: '日期降序' },
            { value: 'xiaoya_order', label: '小雅排序' }
        ];
        sortOptions.forEach(function (option) {
            var opt = document.createElement("option");
            opt.value = option.value;
            opt.text = option.label;
            opt.style.fontWeight = 'bold';
            sortSelect.appendChild(opt);
        });

        // 添加排序下拉框事件监听器
        sortSelect.addEventListener("change", function () {
            sortList(this.value); // 调用原有的日期排序函数
        });
        container.appendChild(sortSelect); // 将排序下拉框添加到容器中
    }

    var existingSelectAllCheckbox = document.getElementById("selectAllCheckbox");
    if (!existingSelectAllCheckbox) {
        var selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.className = 'custom-checkbox';
        selectAllCheckbox.id = 'selectAllCheckbox';
        selectAllCheckbox.style.marginRight = '10px';

        var selectAllLabel = document.createElement('label');
        selectAllLabel.htmlFor = 'selectAllCheckbox';
        selectAllLabel.textContent = '全选';
        selectAllLabel.style.fontWeight = 'bold';
        selectAllLabel.style.color = '#FFA500';
        selectAllLabel.style.userSelect = 'none';

        var checkboxContainer = document.createElement('div');
        checkboxContainer.appendChild(selectAllCheckbox);
        checkboxContainer.appendChild(selectAllLabel);
        download_list.prepend(checkboxContainer);
        checkboxContainer.style.display = 'flex';
        checkboxContainer.style.position = "relative"
        checkboxContainer.style.alignItems = 'center';
        checkboxContainer.style.padding = '5px 10px';
        checkboxContainer.style.marginBottom = '10px';

        selectAllCheckbox.addEventListener('change', function() {
            var checkboxes = document.querySelectorAll("#download_list input[type='checkbox']:not(#selectAllCheckbox)");
            checkboxes.forEach(function(checkbox) {
                if (checkbox.getAttribute('data-visible') === 'true') {
                    checkbox.checked = selectAllCheckbox.checked;
                    var event = new Event('change', {
                        'bubbles': true,
                        'cancelable': true
                    });
                    checkbox.dispatchEvent(event);
                }
            });
        });
    }

    var existingBulkDownloadButton = document.getElementById("bulkDownloadButton");
    if (!existingBulkDownloadButton) {
        var bulkDownloadButton = document.createElement('button');
        bulkDownloadButton.innerHTML = '<span style="font-weight: bold;">批量下载</span>';
        bulkDownloadButton.id = "bulkDownloadButton";
        bulkDownloadButton.title = '点击下载所选文件';
        bulkDownloadButton.style.cssText = `
    position: fixed;
    top: 15px;
    right: 15px;
    background: linear-gradient(90deg, #ffa500, #ff8c00, #ffa500);
    background-size: 200% 100%;
    animation: flowingGradient 3s ease infinite;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    transition: filter 0.3s, transform 0.3s; /* 修改 transition 属性 */
  `;

        bulkDownloadButton.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.05)';
            this.style.backgroundColor = '#ffd564';
        });

        bulkDownloadButton.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
            this.style.backgroundColor = '#fcbb34';
        });

        bulkDownloadButton.addEventListener('click', async function() {
            console.log('开始批量下载');
            var checkboxes = document.querySelectorAll("#download_list input[type='checkbox']:checked");
            const useThirdPartyDownload = localStorage.getItem('useThirdPartyDownload') === 'true';

            const downloadQueue = [];

            checkboxes.forEach(function(checkbox) {
                if (checkbox.checked && checkbox.getAttribute('data-visible') === 'true') {
                    var container = checkbox.closest('div');
                    var link = container.querySelector('a');
                    var file_name = link.getAttribute('data-origin-name');
                    var file_url = link.href;
                    downloadQueue.push({ url: file_url, name: file_name });
                }
            });

            console.log(`队列中的文件数: ${downloadQueue.length}`);

            for (let file of downloadQueue) {
                try {
                    console.log(`正在处理文件: ${file.name}`);
                    await courseDownload(file.url, file.name);
                    console.log(`成功添加下载: ${file.name}`);

                    if (useThirdPartyDownload) {
                        console.log(`等待 1 秒后继续下一个下载...`);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                } catch (error) {
                    console.error(`添加 ${file.name} 到下载队列时发生错误:`, error);
                }
            }

            console.log('批量下载任务添加完成');
        });

        download_list.appendChild(bulkDownloadButton);
        window.bulkDownloadButton = bulkDownloadButton;
    }
}

function sortList(order) {
    const downloadList = document.getElementById("download_list");
    const items = Array.from(downloadList.querySelectorAll(".file-item"));

    // 构建文件夹 ID 到索引的映射（用于小雅排序）
    const folderIndexMap = {};
    svgElementIds.forEach((id, index) => {
        folderIndexMap[id] = index;
    });

    items.sort((a, b) => {
        const aParentId = a.querySelector('a').getAttribute('data-parent-id');
        const bParentId = b.querySelector('a').getAttribute('data-parent-id');
        const aId = a.querySelector('a').getAttribute('data-resource-id');
        const bId = b.querySelector('a').getAttribute('data-resource-id');

        if (order === 'xiaoya_order') {
            const aFolderIndex = folderIndexMap[aParentId] || Infinity;
            const bFolderIndex = folderIndexMap[bParentId] || Infinity;

            if (aFolderIndex !== bFolderIndex) {
                return aFolderIndex - bFolderIndex; // 不同文件夹，按文件夹顺序排序
            } else {
                return aId.localeCompare(bId); // 同一文件夹，按文件 ID 排序
            }
        } else {
            const aDate = new Date(a.querySelector('a').getAttribute('data-created-at'));
            const bDate = new Date(b.querySelector('a').getAttribute('data-created-at'));

            if (order === 'date_asc') {
                return aDate - bDate;
            } else if (order === 'date_desc') {
                return bDate - aDate;
            }
        }
    });

    items.forEach(item => downloadList.appendChild(item));

    // 重新应用筛选条件
    applyFilters();
}

window.toggleListVisibility = function() {
    var download_list = document.getElementById("download_list");

    // 切换列表的显示和隐藏
    if (download_list.style.maxHeight === '0px' || download_list.style.maxHeight === '') {
        // 展开列表
        download_list.style.maxHeight = "300px";
        download_list.style.opacity = "1";
        download_list.style.overflowY = "auto"; // 添加垂直滚动条
    } else {
        // 折叠列表
        download_list.style.maxHeight = "0";
        download_list.style.opacity = "0";
        download_list.style.overflowY = "hidden"; // 隐藏垂直滚动条
    }
}

function filterList(keyword) {
    window.currentSearchKeyword = keyword.toLowerCase(); // 保存当前搜索关键词
    // 更新搜索框的值
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.value = keyword;
    }

    applyFilters();
}

function filterListByCategory(categoryValue) {
    window.currentFilterCategory = categoryValue; // 保存当前分类
    applyFilters(); // 应用筛选和搜索
}

function applyFilters() {
    var searchKeyword = window.currentSearchKeyword;
    var filterCategory = window.currentFilterCategory;
    var extensions = filterCategory ? filterCategory.split(',').map(ext => ext.trim()) : [];

    var containers = document.querySelectorAll("#download_list .file-item");
    containers.forEach(function(container) {
        var file = container.querySelector("a");
        var checkbox = container.querySelector("input[type='checkbox']");
        var fileName = file.getAttribute('data-origin-name').toLowerCase();
        var fileExtension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);

        var isSearchMatch = searchKeyword === '' || fileName.includes(searchKeyword);
        var isFilterMatch = filterCategory === "" || extensions.includes(fileExtension);

        var isVisible = isSearchMatch && isFilterMatch;
        container.style.display = isVisible ? "flex" : "none"; // 保持布局结构
        checkbox.setAttribute('data-visible', isVisible.toString());
    });

    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        const visibleCheckboxes = Array.from(document.querySelectorAll("#download_list .file-item input[type='checkbox'][data-visible='true']"));
        const allVisibleChecked = visibleCheckboxes.every(checkbox => checkbox.checked);
        selectAllCheckbox.checked = visibleCheckboxes.length > 0 && allVisibleChecked;
    }
    // 检查筛选后是否还有可见的课件
    var visibleItems = document.querySelectorAll("#download_list .file-item[style*='display: flex']");
    // 获取下载列表容器
    var download_list = document.getElementById("download_list");
    // 获取已有的提示信息元素
    var noResultsMessage = download_list.querySelector('p');
    if (visibleItems.length === 0) {
        // 如果没有可见的课件
        if (!noResultsMessage) {
            // 如果提示信息元素不存在，则创建
            noResultsMessage = document.createElement('p');
            noResultsMessage.style.color = '#FFA500'; // 保持橙色
            noResultsMessage.style.textAlign = 'center';
            noResultsMessage.style.fontWeight = 'bold'; // 加粗字体
            noResultsMessage.innerHTML = '<span style="font-size: 1.2em;"><span style="color: red;">没有</span></span>课件( ´･･)ﾉ(._.`)';
            download_list.appendChild(noResultsMessage);
        }
    } else {
        // 如果有可见的课件，则移除之前的提示信息
        if (noResultsMessage) {
            download_list.removeChild(noResultsMessage);
        }
    }
}

function add_download_button() {
    // 创建下载图标容器
    var downloadIconContainer = document.createElement('div');
    downloadIconContainer.id = "download_icon_container";
    downloadIconContainer.innerHTML = `
        <dotlottie-player class="download-icon"
                          src="https://lottie.host/604bb467-91d8-46f3-a7ce-786e25f8fded/alw6gwjRdU.json"
                          background="transparent"
                          speed="1"
                          style="width: 60px; height: 60px; margin: -15px;"
                          loop autoplay onclick="toggleListVisibility()"
                          title="点击展开或关闭列表"></dotlottie-player>
    `;

    // 设置下载图标容器的样式
    downloadIconContainer.style.cssText = `
        position: fixed;
        right: 10px;
        bottom: 10px;
        z-index: 9000;
        cursor: pointer;
    `;

    // 创建下载列表容器
    var downloadListContainer = document.createElement('div');
    downloadListContainer.id = "download_list";
    downloadListContainer.style.cssText = `
        z-index: 999;
        backdrop-filter: blur(10px);
        border: 2px solid #fcbb34;
        border-radius: 5px;
        max-height: 0;
        overflow-y: hidden;
        padding: 20px;
        flex-direction: column;
        align-items: flex-start;
        transition: max-height 0.5s ease-in-out, opacity 0.5s ease-in-out;
        opacity: 0;
        position: fixed;
        right: 30px;
        bottom: 50px;
        background-color: white;
    `;
    downloadListContainer.innerHTML = `
  <h3 style="text-align: center;">
    <span style="
      background: linear-gradient(90deg, #ffa500, #ff8c00, #ffa500);
      background-size: 200% 100%;
      animation: flowingGradient 3s ease infinite;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight:bold;
    ">暂无课件♪(´▽｀)</span>
  </h3>
  <br>
  <p style="text-align: center; font-size: 12px; color: #888; font-weight:bold;">（在课程首页才能获取到资源）</p>
`;

    // 添加下载图标的样式
    var downloadIconStyle = document.createElement('style');
    downloadIconStyle.innerHTML = `
  .download-icon {
    padding: 2px;
    margin: -20px;
    background-color: rgba(255, 255, 255, 0);
    border-radius: 10px;
    transition: transform 0.3s ease; // 确保动画效果的平滑过渡
    cursor: pointer;
  }

  .download-icon:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.1); // 悬停时放大
  }
`;


    document.head.appendChild(downloadIconStyle);
    document.body.appendChild(downloadIconContainer);
    document.body.appendChild(downloadListContainer);
}

// 获取token令牌
function getCookie(keyword = 'prd-access-token') {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name.includes(keyword)) {
            return value;
        }
    }
    return null; // 未找到匹配的 Cookie
}

function showDownloadHistory() {
    if (historyPopup) {
        return;
    }

    historyPopup = document.createElement('div');
    Object.assign(historyPopup.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        width: '80%',
        maxWidth: '800px', // 增加宽度以适应搜索框
        maxHeight: '80%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        opacity: '0',
    });

    const title = document.createElement('h2');
    title.textContent = '下载历史';
    Object.assign(title.style, {
        textAlign: 'center',
        color: '#fcbb34',
        marginTop: '0',
        marginBottom: '20px',
        fontWeight: 'bold',
    });

    historyPopup.historyListElement = document.createElement('ul');
    Object.assign(historyPopup.historyListElement.style, {
        listStyleType: 'none',
        padding: '0',
        marginBottom: '20px',
        overflowY: 'auto',
        flex: '1'
    });

    const buttonContainer = document.createElement('div');
    Object.assign(buttonContainer.style, {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px'
    });

    const clearButton = document.createElement('button');
    clearButton.textContent = '清空历史';
    Object.assign(clearButton.style, {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#fcbb34',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.3s'
    });
    clearButton.onmouseover = () => {
        clearButton.style.backgroundColor = '#fba100';
    };
    clearButton.onmouseout = () => {
        clearButton.style.backgroundColor = '#fcbb34';
    };
    clearButton.onclick = () => {
        if (confirm('确定要清空所有下载历史吗？此操作不可撤销。')) {
            const items = historyPopup.historyListElement.querySelectorAll('li');

            // 为每个项目添加移除动画
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('remove-history-item');
                }, index * 50); // 错开动画开始时间
            });

            // 等待所有动画完成后清空历史
            setTimeout(() => {
                downloadHistory = [];
                localStorage.removeItem('downloadHistory');
                updateHistoryList();
            }, items.length * 50 + 500); // 等待所有项目的动画完成，再加上一些额外时间
        }
    };

    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    Object.assign(closeButton.style, {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#ccc',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.3s'
    });
    closeButton.onmouseover = () => {
        closeButton.style.backgroundColor = '#bbb';
    };
    closeButton.onmouseout = () => {
        closeButton.style.backgroundColor = '#ccc';
    };
    closeButton.onclick = () => {
        const rect = historyPopup.getBoundingClientRect();
        const startX = rect.left;
        const startY = rect.top;

        // 设置起始位置
        historyPopup.style.top = startY + 'px';
        historyPopup.style.left = startX + 'px';
        historyPopup.style.transform = 'none';

        // 添加关闭动画类
        historyPopup.classList.remove('popup-show');
        historyPopup.classList.add('popup-hide');

        historyPopup.addEventListener('animationend', function() {
            document.body.removeChild(historyPopup);
            historyPopup = null; // 重置historyPopup
        }, { once: true });
    };

    buttonContainer.appendChild(clearButton);
    buttonContainer.appendChild(closeButton);

    historyPopup.appendChild(title);
    historyPopup.appendChild(historyPopup.historyListElement);
    historyPopup.appendChild(buttonContainer);
    document.body.appendChild(historyPopup);

    // 添加搜索框
    const searchContainer = createSearchBox();
    historyPopup.insertBefore(searchContainer, historyPopup.historyListElement);

    document.body.appendChild(historyPopup);

    // 触发显示动画
    setTimeout(() => {
        historyPopup.classList.add('popup-show');
    }, 10);

    updateHistoryList();
}

function createSearchBox() {
    const searchContainer = document.createElement('div');
    Object.assign(searchContainer.style, {
        margin: '0 0 20px 0',
        position: 'relative',
        width: '100%'
    });

    const searchInput = document.createElement('input');
    Object.assign(searchInput.style, {
        width: '100%',
        padding: '10px 40px 10px 15px',
        fontSize: '16px',
        border: '2px solid #fcbb34',
        borderRadius: '25px',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease'
    });
    searchInput.placeholder = '搜索下载历史...';

    const searchIcon = document.createElement('div');
    Object.assign(searchIcon.style, {
        position: 'absolute',
        right: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '20px',
        height: '20px',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23fcbb34"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>')`,
        backgroundSize: 'cover',
        cursor: 'pointer'
    });

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchIcon);

    // 添加搜索功能
    searchInput.addEventListener('input', () => {
        filterHistory(searchInput.value);
    });

    return searchContainer;
}

function filterHistory(searchTerm) {
    const items = historyPopup.historyListElement.querySelectorAll('li');
    items.forEach((item, index) => {
        const text = item.textContent.toLowerCase();
        const matchesSearch = text.includes(searchTerm.toLowerCase());
        if (matchesSearch) {
            item.style.display = '';
            resetListItemStyles(item);
            // 添加动画效果
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 50); // 错开动画开始时间
        } else {
            item.style.display = 'none';
        }
    });
}

function resetListItemStyles(item) {
    Object.assign(item.style, {
        padding: '10px',
        borderBottom: '1px solid #eee',
        color: '#333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'opacity 0.3s, transform 0.3s' // 添加过渡效果
    });

    const redownloadButton = item.querySelector('button');
    if (redownloadButton) {
        Object.assign(redownloadButton.style, {
            padding: '5px 10px',
            border: 'none',
            borderRadius: '3px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '12px',
            transition: 'background-color 0.3s'
        });
    }
}

function updateHistoryList() {
    if (!historyPopup || !historyPopup.historyListElement) return;

    const historyListElement = historyPopup.historyListElement;
    historyListElement.innerHTML = '';

    // 过滤并保留最近3天的历史记录
    const threeDaysAgo = new Date().getTime() - (3 * 24 * 60 * 60 * 1000);
    downloadHistory = downloadHistory.filter(item => item.time > threeDaysAgo);

    if (downloadHistory.length === 0) {
        const noHistory = showNoHistoryMessage(historyListElement);
        requestAnimationFrame(() => {
            noHistory.style.opacity = '1';
            noHistory.style.transform = 'translateY(0)';
        });
    } else {
        downloadHistory.forEach((item, index) => {
            const listItem = createHistoryListItem(item, index);
            historyListElement.appendChild(listItem);

            // 添加一个小延迟，使动画错开
            setTimeout(() => {
                listItem.style.opacity = '1';
                listItem.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    // 更新本地存储
    localStorage.setItem('downloadHistory', JSON.stringify(downloadHistory));
}

function showNoHistoryMessage(historyListElement) {
    const noHistory = document.createElement('div');
    noHistory.id = 'noHistoryMessage';
    noHistory.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#fcbb34" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>暂无下载历史</p>
        <span>开始下载以添加记录 (⌐■_■)</span>
    `;
    Object.assign(noHistory.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#888',
        fontFamily: "'Microsoft YaHei', sans-serif",
        textAlign: 'center',
        opacity: '0',
        transform: 'translateY(-20px)',
        transition: 'opacity 0.5s, transform 0.5s'
    });

    const p = noHistory.querySelector('p');
    Object.assign(p.style, {
        fontSize: '18px',
        fontWeight: 'bold',
        margin: '10px 0 5px',
        color: '#fcbb34'
    });

    const span = noHistory.querySelector('span');
    Object.assign(span.style, {
        fontSize: '14px',
        opacity: '0.8',
        fontWeight: 'bold'
    });

    historyListElement.appendChild(noHistory);
    return noHistory;
}

function createHistoryListItem(item, index) {
    const listItem = document.createElement('li');
    Object.assign(listItem.style, {
        padding: '10px',
        borderBottom: '1px solid #eee',
        color: '#333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: '0', // 初始设置为透明
        transform: 'translateY(-20px)' // 初始位置略微向上
    });

    const itemInfo = document.createElement('span');
    itemInfo.textContent = `${index + 1}. ${item.filename} - ${new Date(item.time).toLocaleString()}`;

    const redownloadButton = createRedownloadButton(item);

    listItem.appendChild(itemInfo);
    listItem.appendChild(redownloadButton);

    return listItem;
}

function createRedownloadButton(item) {
    const redownloadButton = document.createElement('button');
    redownloadButton.textContent = '重新下载';
    Object.assign(redownloadButton.style, {
        padding: '5px 10px',
        border: 'none',
        borderRadius: '3px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '12px',
        transition: 'background-color 0.3s'
    });
    redownloadButton.onmouseover = () => {
        redownloadButton.style.backgroundColor = '#45a049';
    };
    redownloadButton.onmouseout = () => {
        redownloadButton.style.backgroundColor = '#4CAF50';
    };
    redownloadButton.onclick = () => {
        courseDownload(item.url, item.filename);
    };
    return redownloadButton;
}

function createDownloadHistoryPopup() {
    const popup = document.createElement('div');
    popup.id = 'downloadHistoryPopup';
    Object.assign(popup.style, {
        display: 'none',
        position: 'fixed',
        zIndex: '10002',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        maxWidth: '80%',
        maxHeight: '80%',
        overflowY: 'auto',
        opacity: '0',
        transition: 'opacity 0.3s ease'
    });

    document.body.appendChild(popup);
}

function saveDownloadHistory(filename, url) {
    const historyItem = { filename, url, time: new Date().getTime() };
    downloadHistory.unshift(historyItem); // 添加到数组开头

    // 过滤并保留最近3天的历史记录
    const threeDaysAgo = new Date().getTime() - (3 * 24 * 60 * 60 * 1000);
    downloadHistory = downloadHistory.filter(item => item.time > threeDaysAgo);

    localStorage.setItem('downloadHistory', JSON.stringify(downloadHistory));

    if (historyPopup && historyPopup.historyListElement) {
        // 移除"暂无下载历史"的消息（如果存在）
        const noHistoryMessage = historyPopup.historyListElement.querySelector('#noHistoryMessage');
        if (noHistoryMessage) {
            noHistoryMessage.remove();
        }

        const newListItem = createHistoryListItem(historyItem, 0);
        historyPopup.historyListElement.insertBefore(newListItem, historyPopup.historyListElement.firstChild);

        // 触发动画
        setTimeout(() => {
            newListItem.classList.add('new-history-item');
        }, 10);

        // 更新其他项的序号
        const existingItems = historyPopup.historyListElement.querySelectorAll('li');
        existingItems.forEach((item, index) => {
            if (index > 0) {
                const itemInfo = item.querySelector('span');
                itemInfo.textContent = itemInfo.textContent.replace(/^\d+\./, `${index + 1}.`);
            }
        });
    }
}

function loadDownloadHistory() {
    const savedHistory = localStorage.getItem('downloadHistory');
    if (savedHistory) {
        downloadHistory = JSON.parse(savedHistory);
        // 在加载时也过滤掉超过3天的记录
        const threeDaysAgo = new Date().getTime() - (3 * 24 * 60 * 60 * 1000);
        downloadHistory = downloadHistory.filter(item => item.time > threeDaysAgo);
        localStorage.setItem('downloadHistory', JSON.stringify(downloadHistory));
    }
}

function initializeControlPanel() {
    const controlPanel = document.createElement('div');
    const checkboxesContainer = document.createElement('div');
    const downloadInterfaceCheckbox = document.createElement('input');
    const downloadButtonCheckbox = document.createElement('input');
    const progressBarCheckbox = document.createElement('input');
    const teacherInfoCheckbox = document.createElement('input');
    const userSearchCheckbox = document.createElement('input');
    const toggleButton = document.createElement('button');
    const tipsDisplay = document.createElement('div');
    const showCourseNameText = document.createElement('div');
    let isControlPanelVisible = false;

    // 创建Lottie动画播放器元素
    const lottiePlayer = document.createElement('dotlottie-player');
    lottiePlayer.setAttribute('src', "https://lottie.host/4f5910c1-63a3-4ffa-965c-7c0e46a29928/PCa2EgPj4N.json");
    lottiePlayer.setAttribute('background', 'transparent');
    lottiePlayer.setAttribute('speed', '1');
    lottiePlayer.style.width = '100%';
    lottiePlayer.style.height = '100%';
    lottiePlayer.style.position = 'absolute';
    lottiePlayer.style.zIndex = '-2';
    lottiePlayer.style.top = '0';
    lottiePlayer.style.left = '0';
    lottiePlayer.setAttribute('loop', '');
    lottiePlayer.setAttribute('autoplay', '');

    // 模糊效果
    const blurredBackground = document.createElement('div');
    blurredBackground.style.position = 'absolute';
    blurredBackground.style.top = '0';
    blurredBackground.style.left = '0';
    blurredBackground.style.right = '0';
    blurredBackground.style.bottom = '0';
    blurredBackground.style.zIndex = '-1';
    blurredBackground.style.backdropFilter = 'blur(3px)';
    blurredBackground.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';

    // 将 blurredBackground 添加到 controlPanel 中
    controlPanel.appendChild(blurredBackground);

    // 设置控制面板样式
    controlPanel.style.position = 'fixed';
    controlPanel.style.top = '210px';
    controlPanel.style.right = isControlPanelVisible ? '40px' : '-700px';
    controlPanel.style.zIndex = '10000';
    controlPanel.style.backgroundColor = 'transparent';
    controlPanel.style.padding = '10px';
    controlPanel.style.borderRadius = '5px';
    controlPanel.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    controlPanel.style.border = '1px solid #fcbb34';
    controlPanel.style.transition = 'right 0.3s ease-in-out, width 0.3s ease-in-out, height 0.3s ease-in-out'; // 添加 width 和 height 的过渡
    controlPanel.style.overflow = 'hidden';
    controlPanel.style.width = '600px';
    controlPanel.style.height = '260px';

    controlPanel.appendChild(lottiePlayer);
    controlPanel.appendChild(tipsDisplay);
    controlPanel.appendChild(showCourseNameText);

    // 创建横向菜单容器
    const menuContainer = document.createElement('div');
    menuContainer.style.display = 'flex';
    menuContainer.style.justifyContent = 'space-around';
    menuContainer.style.marginBottom = '15px';
    menuContainer.style.borderBottom = '2px solid #fcbb34';
    menuContainer.style.padding = '10px 0';

    const menuItems = [
        { text: '<strong>消息管理</strong>', category: 'message', icon: '📨' },
        { text: '<strong>下载管理</strong>', category: 'download', icon: '📥' },
        { text: '<strong>导出功能</strong>', category: 'export', icon: '📤' },
        { text: '<strong>显示设置</strong>', category: 'display', icon: '🖥️' },
        { text: '<strong>检查更新</strong>', category: 'update', icon: '🔎' }
    ];

    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.innerHTML = `${item.icon} <span>${item.text}</span>`;
        menuItem.style.padding = '8px 12px';
        menuItem.style.cursor = 'pointer';
        menuItem.style.borderRadius = '20px';
        menuItem.style.transition = 'all 0.3s ease';
        menuItem.dataset.category = item.category;

        menuItem.addEventListener('mouseover', () => {
            menuItem.style.backgroundColor = 'rgba(252, 187, 52, 0.2)';
        });

        menuItem.addEventListener('mouseout', () => {
            if (!menuItem.classList.contains('active')) {
                menuItem.style.backgroundColor = 'transparent';
            }
        });

        menuContainer.appendChild(menuItem);
    });

    menuContainer.addEventListener('click', (event) => {
        const clickedItem = event.target.closest('div[data-category]');
        if (clickedItem) {
            const category = clickedItem.dataset.category;

            // 更新菜单项样式
            menuContainer.querySelectorAll('div[data-category]').forEach(mi => {
                mi.classList.toggle('active', mi.dataset.category === category);
                mi.style.backgroundColor = mi.dataset.category === category ? 'rgba(252, 187, 52, 0.2)' : 'transparent';
                mi.style.color = mi.dataset.category === category ? '#fcbb34' : '#000';
                mi.style.fontWeight = mi.dataset.category === category ? 'bold' : 'normal';
            });
            if (category === 'display') {
                controlPanel.style.width = '620px';
                controlPanel.style.height = '440px';
            } else if (category === 'update') {
                controlPanel.style.width = '610px';
                controlPanel.style.height = '330px';
            } else {
                controlPanel.style.width = '600px';
                controlPanel.style.height = '260px';
            }
            // 更新容器可见性
            [messageContainer, downloadContainer, exportContainer, displayContainer, updateContainer].forEach(container => {
                container.style.display = container.dataset.category === category ? 'block' : 'none';
            });

            console.log(`Switched to category: ${category}`);
        }
    });

    // 添加一个动画效果
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    #controlPanel > div {
        animation: fadeIn 0.3s ease-out;
    }
`;
    document.head.appendChild(styleSheet);

    // 将菜单容器添加到控制面板
    controlPanel.prepend(menuContainer);

    // 创建一个容器来包装按钮和装饰元素
    const Beautifulupdater = document.createElement('div');
    Beautifulupdater.style.position = 'relative';
    Beautifulupdater.style.width = '200px';
    Beautifulupdater.style.margin = '20px auto';
    Beautifulupdater.style.display = 'flex';
    Beautifulupdater.style.flexDirection = 'column';
    Beautifulupdater.style.justifyContent = 'center';
    Beautifulupdater.style.alignItems = 'center';

    // 创建更新按钮容器
    const updateButtonContainer = document.createElement('div');
    updateButtonContainer.style.textAlign = 'center'; // 居中对齐
    updateButtonContainer.style.marginTop = '20px';

    // 创建更新按钮
    const updateButton = document.createElement('button');
    updateButton.id = 'updateButton';
    updateButton.textContent = '检查更新';
    updateButton.style.padding = '10px 20px';
    updateButton.style.border = 'none';
    updateButton.style.borderRadius = '25px';
    updateButton.style.background = 'linear-gradient(90deg, #ffa500, #ff8c00, #ffa500)';
    updateButton.style.backgroundSize = '200% 100%';
    updateButton.style.animation = 'flowingGradient 3s ease infinite';
    updateButton.style.color = '#fff';
    updateButton.style.cursor = 'pointer';
    updateButton.style.fontWeight = 'bold';
    updateButton.style.fontSize = '16px';
    updateButton.style.transition = 'all 0.3s ease';
    updateButton.style.zIndex = '2';
    updateButtonContainer.appendChild(updateButton);

    // 添加悬浮和点击效果
    updateButton.onmouseover = () => {
        updateButton.style.transform = 'scale(1.1)';
        updateButton.style.boxShadow = '0 0 15px rgba(255, 165, 0, 0.7)';
    };
    updateButton.onmouseout = () => {
        updateButton.style.transform = 'scale(1)';
        updateButton.style.boxShadow = 'none';
    };
    updateButton.onmousedown = () => {
        updateButton.style.transform = 'scale(0.95)';
    };
    updateButton.onmouseup = () => {
        updateButton.style.transform = 'scale(1.1)';
    };

    // 创建版本号容器
    const versionContainer = document.createElement('div');
    versionContainer.style.textAlign = 'center'; // 居中对齐

    // 添加版本号显示
    const versionDisplay = document.createElement('div');
    versionDisplay.textContent = `V${GM_info.script.version}`;
    versionDisplay.style.cssText = `
  margin-top: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  text-align: center;
  background: linear-gradient(45deg, #f0932b, #fcbb34);
  box-shadow: 0 0 10px rgba(255, 165, 0, 0.5);
  animation: glowPulse 2s ease-in-out infinite;
  cursor: pointer;
`;
    versionContainer.appendChild(versionDisplay);

    // 添加点击计数器和事件监听器
    let clickCount = 0;
    let lastClickTime = 0;
    versionDisplay.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止事件冒泡
        const currentTime = new Date().getTime();
        if (currentTime - lastClickTime > 1000) { // 如果两次点击间隔超过1秒，重置计数
            clickCount = 0;
        }
        clickCount++;
        lastClickTime = currentTime;

        if (clickCount === 5) {
            activateEasterEgg();
            clickCount = 0; // 重置点击计数
        }
    });

    // 添加视觉反馈
    versionDisplay.addEventListener('mousedown', () => {
        versionDisplay.style.transform = 'scale(0.95)';
    });
    versionDisplay.addEventListener('mouseup', () => {
        versionDisplay.style.transform = 'scale(1)';
    });

    // 创建装饰元素
    const createDecorElement = (color, size, top, left, animationDelay) => {
        const element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.borderRadius = '50%';
        element.style.backgroundColor = color;
        element.style.top = `${top}px`;
        element.style.left = `${left}px`;
        element.style.animation = `float 3s ease-in-out infinite`;
        element.style.animationDelay = `${animationDelay}s`;
        element.style.zIndex = '1';
        return element;
    };

    // 添加装饰元素
    Beautifulupdater.appendChild(createDecorElement('#FFD700', 10, 10, 20, 0));
    Beautifulupdater.appendChild(createDecorElement('#FFA07A', 15, 70, 30, 0.5));
    Beautifulupdater.appendChild(createDecorElement('#98FB98', 12, 20, 160, 1));
    Beautifulupdater.appendChild(createDecorElement('#87CEFA', 8, 80, 170, 1.5));

    // 添加到容器
    Beautifulupdater.appendChild(versionContainer);
    Beautifulupdater.appendChild(updateButtonContainer);

    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
    @keyframes flowingGradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
`;
    document.head.appendChild(style);

    function compareVersions(currentVersion, latestVersion) {
        const currentParts = currentVersion.split('.').map(Number);
        const latestParts = latestVersion.split('.').map(Number);

        const maxLength = Math.max(currentParts.length, latestParts.length);

        for (let i = 0; i < maxLength; i++) {
            // 确保每个部分的位数相同
            const currentPart = String(currentParts[i] || 0).padStart(3, '0'); // 补零到3位
            const latestPart = String(latestParts[i] || 0).padStart(3, '0');

            if (latestPart > currentPart) {
                return -1; // 最新版本较大
            } else if (currentPart > latestPart) {
                return 1; // 当前版本较大
            }
        }

        return 0; // 版本相同
    }

    // 按钮点击事件：检查更新
    updateButton.onclick = function() {
        const scriptInfo = GM_info;
        const currentVersion = scriptInfo.script.version;

        // 构建元数据文件的 URL
        const metaURL = scriptInfo.script.downloadURL.replace(/\.user\.js$/, '.meta.js') + '?t=' + Date.now();

        fetch(metaURL)
            .then(response => response.text())
            .then(text => {
            console.log('Fetched meta data:', text); // 打印获取到的元数据内容

            const match = text.match(/\/\/\s*@version\s+([\d.]+)/);
            if (match && match[1]) {
                const latestVersion = match[1];
                const comparisonResult = compareVersions(currentVersion, latestVersion);

                if (comparisonResult < 0) {
                    if (confirm(`检测到新版本 ${latestVersion}，是否立即更新？`)) {
                        window.location.href = scriptInfo.script.downloadURL;
                    }
                } else {
                    alert('当前已是最新版本！');
                }
            } else {
                throw new Error('无法从更新信息中提取版本号。');
            }
        })
            .catch(error => {
            console.error('更新检查失败:', error);
            alert('更新检查失败，请稍后再试。');
        });
    };

    // 定义CSS
    const hoverGlowName = 'hover-glow';
    const styleSheet1 = document.createElement('style');
    styleSheet1.type = 'text/css';
    styleSheet1.innerText = `
    @keyframes ${hoverGlowName} {
        from {
            box-shadow: 0 0 8px #fcbb34;
        }
        to {
            box-shadow: 0 0 20px #fcbb34, 0 0 30px #fcbb34;
        }
    }

    #toggleButton:hover {
        animation: ${hoverGlowName} 1s ease-in-out infinite alternate;
    }

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 26px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #FF8C00; /* 改为橙色 */
}

input:checked + .slider:before {
  transform: translateX(24px);
}

/* 显示/隐藏图标 */
.slider:after {
  content: "•";
  position: absolute;
  top: 50%;
  left: 30px;
  transform: translateY(-50%);
  color: white;
  font-size: 20px;
  opacity: 0;
  transition: .4s;
}

input:checked + .slider:after {
  opacity: 1;
  left: 8px;
}

/* 悬停效果 */
.slider:hover {
  box-shadow: 0 0 5px rgba(255, 140, 0, 0.5); /* 改为橙色 */
}

.slider:hover:before {
  animation: pulse 1.5s infinite;
}

/* 脉冲动画 */
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 140, 0, 0.7); } /* 改为橙色 */
  70% { box-shadow: 0 0 0 10px rgba(255, 140, 0, 0); } /* 改为橙色 */
  100% { box-shadow: 0 0 0 0 rgba(255, 140, 0, 0); } /* 改为橙色 */
}

.switch:hover .slider:before {
  animation: pulse 1.5s infinite;
}

/* 标签 */
.switch::after {
  content: attr(data-label);
  position: absolute;
  right: -65px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #555;
}

input:checked + .slider:before {
  transform: translateX(24px);
  transition: .4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.slider:before {
  transition: .4s, transform .2s;
}

input:checked + .slider:before {
  transform: translateX(24px) scale(1.1);
}

.slider {
  background: linear-gradient(to right, #ccc 50%, #FF8C00 50%);
  background-size: 200% 100%;
  background-position: left bottom;
  transition: all .4s ease;
}

input:checked + .slider {
  background-position: right bottom;
}

#allTipsContainer::-webkit-scrollbar {
            width: 10px;
        }
        #allTipsContainer::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        #allTipsContainer::-webkit-scrollbar-thumb {
            background: #fcbb34;
            border-radius: 10px;
        }
        #allTipsContainer::-webkit-scrollbar-thumb:hover {
            background: #e67e22;
        }
        .tip-item {
            background-color: #fff8e1;
            border-left: 4px solid #fcbb34;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 5px;
            transition: all 0.2s ease;
        }
        .tip-item:hover {
            transform: translateX(5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        #closeTipsBtn {
            background-color: #fcbb34;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.2s ease;
            display: block;
            margin: 20px auto 0;
        }
        #closeTipsBtn:hover {
            background-color: #e67e22;
            transform: scale(1.05);
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -60%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }
        #allTipsContainer.show {
            animation: fadeIn 0.3s ease-out forwards;
        }

        ${style.textContent}
        @keyframes popOutToCenter {
            0% { transform: translate(var(--start-x), var(--start-y)) scale(0.7); opacity: 0; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes popInToOrigin {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            100% { transform: translate(var(--end-x), var(--end-y)) scale(0.7); opacity: 0; }
        }
        @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes typing {
        from { width: 0 }
        to { width: 100% }
    }

    @keyframes blink-caret {
        from, to { border-color: transparent }
        50% { border-color: #fcbb34; }
    }

    .tip-item {
        background: linear-gradient(45deg, #f3f4f6, #fff);
        border-left: 4px solid #fcbb34;
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        animation: fadeInUp 0.5s ease-out both;
        animation-play-state: paused;
}
        opacity: 0;
    }

    .tip-item:hover {
        transform: translateX(5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .tip-number {
        display: inline-block;
        background-color: #fcbb34;
        color: white;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border-radius: 50%;
        margin-right: 10px;
    }

    .tip-text {
        display: inline-block;
        vertical-align: middle;
    }

    #allTipsContainer h2 {
        font-size: 28px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 20px;
        color: #fcbb34;
        overflow: hidden;
        border-right: .15em solid #fcbb34;
        white-space: nowrap;
        letter-spacing: .15em;
        animation: typing 3.5s steps(40, end), blink-caret .75s step-end infinite;
    }
`;
    document.head.appendChild(styleSheet1);

    // 设置切换按钮样式
    const gearIcon = document.createElement('span');
    gearIcon.textContent = '⚙️';
    gearIcon.style.fontSize = '16px'; // 保持与按钮相同的字体大小
    // 齿轮图标的样式
    gearIcon.style.transition = 'transform 0.3s ease';
    gearIcon.style.display = 'inline-block';
    gearIcon.style.verticalAlign = 'middle';
    // 将齿轮图标添加到按钮中
    toggleButton.appendChild(gearIcon);
    toggleButton.id = 'toggleButton';
    toggleButton.style.fontSize = '16px';
    toggleButton.title = '控制面板';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '210px';
    toggleButton.style.right = '0';
    toggleButton.style.zIndex = '10001';
    toggleButton.style.backgroundColor = '#fcbb34';
    toggleButton.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2)';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px 0 0 5px';
    toggleButton.style.padding = '10px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.transition = 'right 0.3s ease-in-out, transform 0.3s ease';
    // 添加悬停效果
    toggleButton.style.transform = 'scale(1)'; // 默认比例
    toggleButton.addEventListener('mouseover', function() {
        toggleButton.style.transform = 'scale(1.1)'; // 悬停时放大
    });
    toggleButton.addEventListener('mouseout', function() {
        toggleButton.style.transform = 'scale(1)'; // 鼠标移出时恢复原大小
    });

    // 切换按钮点击事件
    toggleButton.addEventListener('click', function() {
        isControlPanelVisible = !isControlPanelVisible;
        controlPanel.style.right = isControlPanelVisible ? '40px' : '-700px';
        gearIcon.style.transform = 'rotate(360deg)';
        gearIcon.addEventListener('transitionend', function() {
            gearIcon.style.transform = 'none';
        }, { once: true });
    });

    // 创建分类容器
    const messageContainer = document.createElement('div');
    messageContainer.dataset.category = 'message';
    messageContainer.style.justifyContent = 'space-between';
    messageContainer.style.width = '100%';

    const downloadContainer = document.createElement('div');
    downloadContainer.dataset.category = 'download';
    downloadContainer.style.justifyContent = 'space-between';
    downloadContainer.style.width = '100%';

    const exportContainer = document.createElement('div');
    exportContainer.dataset.category = 'export';
    exportContainer.style.justifyContent = 'space-between';
    exportContainer.style.width = '100%';

    const displayContainer = document.createElement('div');
    displayContainer.dataset.category = 'display';
    displayContainer.style.justifyContent = 'space-between';
    displayContainer.style.width = '100%';

    const updateContainer = document.createElement('div');
    updateContainer.dataset.category = 'update';
    updateContainer.style.justifyContent = 'space-between';
    updateContainer.style.width = '100%';

    // 初始化复选框状态
    function initializeCheckboxState(checkbox, index) {
        const savedState = localStorage.getItem(`checkbox-${index}`);
        checkbox.checked = savedState === null ? true : savedState === 'true';
        progressBarCheckbox.addEventListener('change', () => {
            isProgressBarVisible = progressBarCheckbox.checked;
            updateVisibility();
        });
    }

    // 保存复选框状态
    function saveCheckboxState(checkbox, index) {
        localStorage.setItem(`checkbox-${index}`, checkbox.checked);
    }

    // 初始化复选框
    [downloadInterfaceCheckbox, downloadButtonCheckbox, progressBarCheckbox, teacherInfoCheckbox, userSearchCheckbox].forEach((checkbox, index) => {
        checkbox.type = 'checkbox';
        initializeCheckboxState(checkbox, index); // 调用函数以应用保存的状态
        checkbox.id = `checkbox-${index}`;
        checkbox.style.display = 'none'; // 隐藏原始复选框

        const label = document.createElement('label');
        label.className = 'switch';
        label.htmlFor = `checkbox-${index}`;
        const slider = document.createElement('span');
        slider.className = 'slider';
        label.appendChild(checkbox);
        label.appendChild(slider);

        const labelText = document.createElement('span');
        labelText.textContent = ['右上角下载栏', '右下角下载栏', '左下角进度条', '某个信息组件', '某个搜索组件'][index];

        // 增强文字样式
        labelText.style.color = '#fcbb34';
        labelText.style.marginRight = '15px';
        labelText.style.fontWeight = '600';
        labelText.style.fontSize = '16px'; // 略微增大字体
        labelText.style.fontFamily = 'Microsoft YaHei'
        labelText.style.letterSpacing = '0.5px';
        labelText.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.1)';
        labelText.style.transition = 'all 0.3s ease';
        labelText.style.cursor = 'pointer';

        // 添加悬停效果
        labelText.addEventListener('mouseover', () => {
            labelText.style.transform = 'translateY(-2px)';
            labelText.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.2)';
        });

        labelText.addEventListener('mouseout', () => {
            labelText.style.transform = 'translateY(0)';
            labelText.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.1)';
        });

        checkbox.addEventListener('change', () => {
            if (index === 1) {
                updateDownloadListVisibility(); // 仅当右下角下载列表复选框变化时，调用此函数
            } else {
                updateVisibility(); // 否则调用一般的更新可见性函数
            }
            saveCheckboxState(checkbox, index); // 保存复选框状态
        });

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.justifyContent = 'space-between';
        container.style.alignItems = 'center';
        container.style.padding = '10px';
        container.style.position = 'relative'; // 为伪元素定位

        // 添加文字
        container.appendChild(labelText);

        // 创建装饰元素容器
        const decorationContainer = document.createElement('div');
        decorationContainer.style.display = 'flex';
        decorationContainer.style.alignItems = 'center';
        decorationContainer.style.margin = '0 15px';

        // 添加装饰线
        const decorativeLine = document.createElement('div');
        decorativeLine.style.width = '40px';
        decorativeLine.style.height = '2px';
        decorativeLine.style.background = 'linear-gradient(to right, #ff9800, #ff5722)';

        // 添加动态小圆点 (第一个)
        const dotContainer1 = document.createElement('div');
        dotContainer1.style.position = 'relative';
        dotContainer1.style.width = '20px';
        dotContainer1.style.height = '20px';

        const dot1 = document.createElement('div');
        dot1.style.position = 'absolute';
        dot1.style.top = '50%';
        dot1.style.left = '50%';
        dot1.style.width = '8px';
        dot1.style.height = '8px';
        dot1.style.borderRadius = '50%';
        dot1.style.backgroundColor = '#ff9800';
        dot1.style.transform = 'translate(-50%, -50%)';
        dot1.style.animation = 'pulse 2s infinite';

        dotContainer1.appendChild(dot1);

        // 添加动态小圆点 (第二个)
        const dotContainer2 = document.createElement('div');
        dotContainer2.style.position = 'relative';
        dotContainer2.style.width = '20px';
        dotContainer2.style.height = '20px';

        const dot2 = document.createElement('div');
        dot2.style.position = 'absolute';
        dot2.style.top = '50%';
        dot2.style.left = '50%';
        dot2.style.width = '8px';
        dot2.style.height = '8px';
        dot2.style.borderRadius = '50%';
        dot2.style.backgroundColor = '#ff9800';
        dot2.style.transform = 'translate(-50%, -50%)';
        dot2.style.animation = 'pulse 2s infinite';

        dotContainer2.appendChild(dot2);

        // 将装饰元素添加到装饰容器
        decorationContainer.appendChild(dotContainer1);
        decorationContainer.appendChild(decorativeLine);
        decorationContainer.appendChild(dotContainer2);

        // 将装饰容器添加到主容器
        container.appendChild(decorationContainer);

        // 添加开关
        container.appendChild(label);

        checkboxesContainer.appendChild(container);
    });

    // 创建第一个按钮容器（用于已读和清空消息按钮）
    const messageButtonContainer = document.createElement('div');
    messageButtonContainer.style.display = 'flex';
    messageButtonContainer.style.justifyContent = 'space-between';
    messageButtonContainer.style.marginTop = '10px';

    // 创建"已读所有消息"按钮
    const markReadButton = document.createElement('button');
    markReadButton.id = 'markReadButton';
    markReadButton.textContent = '已读所有消息';
    markReadButton.title = '刷新页面以更新状态';

    // 添加样式
    markReadButton.style.cssText = `
  background-color: #2ecc71; /* 绿色 */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

    // 添加hover效果
    markReadButton.onmouseover = function() {
        markReadButton.style.backgroundColor = '#27ae60'; /* 深绿色 */
        markReadButton.style.transform = 'translateY(-2px)'; /* 轻微上移 */
        markReadButton.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)'; /* 加深阴影 */
    };

    markReadButton.onmouseout = function() {
        markReadButton.style.backgroundColor = '#2ecc71'; /* 回复绿色 */
        markReadButton.style.transform = 'translateY(0)'; /* 回复原位 */
        markReadButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)'; /* 回复阴影 */
    };

    // 绑定点击事件处理函数
    markReadButton.onclick = function() {
        markAllMessagesAsRead();
    };
    // 定义标记所有消息为已读的函数
    async function markAllMessagesAsRead() {
        const token = getCookie();
        const hostname = window.location.hostname;
        const pageSize = 20;
        const messageTypes = ["todo", "group", "personal", "system"];
        let hasUnreadMessages = false;

        for (const messageType of messageTypes) {
            try {
                let pageIndex = 1;
                let unreadMessageIds = [];

                while (true) {
                    const apiUrl = `https://${hostname}/api/jx-iresource/message/im/${messageType}?page_size=${pageSize}&page_index=${pageIndex}&msg_status=0`;
                    const response = await fetch(apiUrl, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                    }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const messages = data.data.list;

                        if (messages.length === 0 || pageIndex * pageSize >= data.data.total) {
                            break; // 没有更多消息或已经获取所有消息，退出循环
                        }

                        unreadMessageIds = unreadMessageIds.concat(messages.map(message => message.id));
                        pageIndex++;
                    } else {
                        console.error(`获取未读${messageType}消息失败:`, response.status, response.statusText);
                        alert(`获取未读${messageType}消息失败，请重试`);
                        return;
                    }
                }

                if (unreadMessageIds.length > 0) {
                    hasUnreadMessages = true;
                    const updateResponse = await fetch(`https://${hostname}/api/jx-iresource/message/im/updateStatus`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                    },
                        body: JSON.stringify({
                            message_ids: unreadMessageIds,
                            status: 1
                        })
                    });

                    if (updateResponse.ok) {
                        console.log(`所有${messageType}消息已标记为已读`);
                    } else {
                        console.error(`标记${messageType}消息失败:`, updateResponse.status, updateResponse.statusText);
                        alert(`标记${messageType}消息失败，请重试`);
                        return;
                    }
                } else {
                    console.log(`没有未读${messageType}消息`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert(`标记${messageType}消息失败，请重试`);
                return;
            }
        }

        if (hasUnreadMessages) {
            alert("所有消息已标记为已读");
        } else {
            console.log("没有未读消息");
            alert("没有未读消息");
        }

        // 调用API更新未读消息计数
        try {
            const updateCountResponse = await fetch(`https://${hostname}/api/jx-iresource/message/im/un_read_count`, {
                headers: {
                    "Authorization": `Bearer ${token}`
            }
            });

            if (updateCountResponse.ok) {
                const countData = await updateCountResponse.json();
                console.log("未读消息计数已更新:", countData);
                // 这里可以添加更新页面显示的逻辑
            } else {
                console.error("更新未读消息计数失败:", updateCountResponse.status, updateCountResponse.statusText);
            }
        } catch (error) {
            console.error("更新未读消息计数时发生错误:", error);
        }
    }

    // 创建"清空所有消息"按钮
    const clearMessagesButton = document.createElement('button');
    clearMessagesButton.id = 'clearMessagesButton';
    clearMessagesButton.textContent = '清空所有消息';
    clearMessagesButton.title = '刷新页面以更新状态';

    // 添加样式
    clearMessagesButton.style.cssText = `
  background-color: #e74c3c; /* 红色 */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

    // 添加hover效果
    clearMessagesButton.onmouseover = function() {
        clearMessagesButton.style.backgroundColor = '#c0392b'; /* 深红色 */
        clearMessagesButton.style.transform = 'translateY(-2px)'; /* 轻微上移 */
        clearMessagesButton.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)'; /* 加深阴影 */
    };

    clearMessagesButton.onmouseout = function() {
        clearMessagesButton.style.backgroundColor = '#e74c3c'; /* 回复红色 */
        clearMessagesButton.style.transform = 'translateY(0)'; /* 回复原位 */
        clearMessagesButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)'; /* 回复阴影 */
    };

    // 绑定点击事件处理函数
    clearMessagesButton.onclick = function() {
        if (confirm("确定要清空所有消息吗？该操作无法撤销。")) {
            clearAllMessages();
        }
    };

    async function clearAllMessages() {
        const token = getCookie();
        const hostname = window.location.hostname;
        const pageSize = 20;
        const messageTypes = ["todo", "group", "personal", "system"];
        let hasMessagesToClear = false;

        for (const messageType of messageTypes) {
            try {
                let pageIndex = 1;
                let messageIdsToClear = [];

                while (true) {
                    const apiUrl = `https://${hostname}/api/jx-iresource/message/im/${messageType}?page_size=${pageSize}&page_index=${pageIndex}`;
                    const response = await fetch(apiUrl, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                    }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const messages = data.data.list;

                        if (messages.length === 0 || pageIndex * pageSize >= data.data.total) {
                            break; // 没有更多消息或已经获取所有消息，退出循环
                        }

                        messageIdsToClear = messageIdsToClear.concat(messages.map(message => message.id));
                        pageIndex++;
                    } else {
                        console.error(`获取${messageType}消息失败:`, response.status, response.statusText);
                        alert(`获取${messageType}消息失败，请重试`);
                        return;
                    }
                }

                if (messageIdsToClear.length > 0) {
                    hasMessagesToClear = true;
                    const clearResponse = await fetch(`https://${hostname}/api/jx-iresource/message/im/selected/empty`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                    },
                        body: JSON.stringify({
                            message_ids: messageIdsToClear
                        })
                    });

                    if (clearResponse.ok) {
                        console.log(`所有${messageType}消息已清空`);
                    } else {
                        const errorText = await clearResponse.text();
                        console.error(`清空${messageType}消息失败:`, errorText);
                        alert(`清空${messageType}消息失败: ${errorText}`);
                        return;
                    }
                } else {
                    console.log(`没有${messageType}消息可清空`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert(`清空${messageType}消息出错: ${error.message}`);
                return;
            }
        }

        if (hasMessagesToClear) {
            alert("所有消息已清空");
        } else {
            console.log("没有消息可清空");
            alert("没有消息可清空");
        }

        // 调用API更新未读消息计数
        try {
            const updateCountResponse = await fetch(`https://${hostname}/api/jx-iresource/message/im/un_read_count`, {
                headers: {
                    "Authorization": `Bearer ${token}`
            }
            });

            if (updateCountResponse.ok) {
                const countData = await updateCountResponse.json();
                console.log("未读消息计数已更新:", countData);
                // 这里可以添加更新页面显示的逻辑
            } else {
                console.error("更新未读消息计数失败:", updateCountResponse.status, updateCountResponse.statusText);
            }
        } catch (error) {
            console.error("更新未读消息计数时发生错误:", error);
        }
    }

    // 将按钮添加到第一个容器
    messageButtonContainer.appendChild(markReadButton);
    messageButtonContainer.appendChild(clearMessagesButton);

    // 将第一个按钮容器添加到控制面板
    controlPanel.appendChild(messageButtonContainer);

    // 创建第二个按钮容器（用于下载历史按钮和未来可能的其他按钮）
    const downloadButtonContainer = document.createElement('div');
    downloadButtonContainer.style.display = 'flex';
    downloadButtonContainer.style.justifyContent = 'space-between';
    downloadButtonContainer.style.marginTop = '10px';

    // 创建"查看下载历史"按钮
    const showHistoryButton = document.createElement('button');
    showHistoryButton.id = 'showHistoryButton';
    showHistoryButton.textContent = '查看下载历史';
    showHistoryButton.title = '导出的文件不会被记录';

    // 添加样式
    showHistoryButton.style.cssText = `
  background-color: #3498db; /* 蓝色 */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

    // 添加hover效果
    showHistoryButton.onmouseover = function() {
        showHistoryButton.style.backgroundColor = '#2980b9'; /* 深蓝色 */
        showHistoryButton.style.transform = 'translateY(-2px)'; /* 轻微上移 */
        showHistoryButton.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)'; /* 加深阴影 */
    };

    showHistoryButton.onmouseout = function() {
        showHistoryButton.style.backgroundColor = '#3498db'; /* 回复蓝色 */
        showHistoryButton.style.transform = 'translateY(0)'; /* 回复原位 */
        showHistoryButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)'; /* 回复阴影 */
    };

    showHistoryButton.onclick = showDownloadHistory;

    // 将"查看下载历史"按钮添加到第二个容器
    downloadButtonContainer.appendChild(showHistoryButton);

    // 创建第三方下载切换按钮
    const thirdPartyDownloadButton = document.createElement('button');
    thirdPartyDownloadButton.id = 'thirdPartyDownloadButton';
    thirdPartyDownloadButton.title = '切换下载方式';

    // 添加样式
    thirdPartyDownloadButton.style.cssText = `
  background-color: #f39c12; /* 橙色 */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

    // 添加hover效果
    thirdPartyDownloadButton.onmouseover = function() {
        thirdPartyDownloadButton.style.transform = 'translateY(-2px)'; /* 轻微上移 */
        thirdPartyDownloadButton.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)'; /* 加深阴影 */
    };

    thirdPartyDownloadButton.onmouseout = function() {
        thirdPartyDownloadButton.style.transform = 'translateY(0)'; /* 回复原位 */
        thirdPartyDownloadButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)'; /* 回复阴影 */
    };

    // 从localStorage中获取当前状态
    let useThirdPartyDownload = localStorage.getItem('useThirdPartyDownload') === 'true';
    updateThirdPartyDownloadButtonState();

    thirdPartyDownloadButton.onclick = function() {
        useThirdPartyDownload = !useThirdPartyDownload;
        localStorage.setItem('useThirdPartyDownload', useThirdPartyDownload);
        updateThirdPartyDownloadButtonState();
    };

    function updateThirdPartyDownloadButtonState() {
        if (useThirdPartyDownload) {
            thirdPartyDownloadButton.textContent = '用第三方下载';
            thirdPartyDownloadButton.style.backgroundColor = '#27ae60'; // 绿色
        } else {
            thirdPartyDownloadButton.textContent = '用浏览器下载';
            thirdPartyDownloadButton.style.backgroundColor = '#f39c12'; // 橙色
        }
    }

    // 将按钮添加到第二个容器
    downloadButtonContainer.appendChild(thirdPartyDownloadButton);

    // 将第二个按钮容器添加到控制面板
    controlPanel.appendChild(downloadButtonContainer);

    // 创建第三个按钮容器
    const exportButtonContainer = document.createElement('div');
    exportButtonContainer.style.justifyContent = 'space-between';
    exportButtonContainer.style.display = 'flex';
    exportButtonContainer.style.marginTop = '10px';

    // 创建"导出ef2文件"按钮
    const exportEf2Button = document.createElement('button');
    exportEf2Button.id = 'exportEf2Button';
    exportEf2Button.textContent = '导出EF2文件';
    exportEf2Button.title = 'IDM专属导入格式';

    // 添加样式
    exportEf2Button.style.cssText = `
  background-color: #3498db; /* 蓝色 */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

    // 添加hover效果
    exportEf2Button.onmouseover = function() {
        exportEf2Button.style.backgroundColor = '#2980b9'; /* 深蓝色 */
        exportEf2Button.style.transform = 'translateY(-2px)'; /* 轻微上移 */
        exportEf2Button.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)'; /* 加深阴影 */
    };

    exportEf2Button.onmouseout = function() {
        exportEf2Button.style.backgroundColor = '#3498db'; /* 回复蓝色 */
        exportEf2Button.style.transform = 'translateY(0)'; /* 回复原位 */
        exportEf2Button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)'; /* 回复阴影 */
    };

    exportEf2Button.onclick = exportToEf2;

    // 将"导出ef2文件"按钮添加到第三个容器
    exportButtonContainer.appendChild(exportEf2Button);

    // 创建"导出txt文件"按钮
    const exportTxtButton = document.createElement('button');
    exportTxtButton.id = 'exportTxtButton';
    exportTxtButton.textContent = '导出TXT文件';
    exportTxtButton.title = '绝大多数下载软件都支持';

    // 添加样式
    exportTxtButton.style.cssText = `
  background-color: #2ecc71; /* 绿色 */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

    // 添加hover效果
    exportTxtButton.onmouseover = function() {
        exportTxtButton.style.backgroundColor = '#27ae60'; /* 深绿色 */
        exportTxtButton.style.transform = 'translateY(-2px)'; /* 轻微上移 */
        exportTxtButton.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)'; /* 加深阴影 */
    };

    exportTxtButton.onmouseout = function() {
        exportTxtButton.style.backgroundColor = '#2ecc71'; /* 回复绿色 */
        exportTxtButton.style.transform = 'translateY(0)'; /* 回复原位 */
        exportTxtButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)'; /* 回复阴影 */
    };

    exportTxtButton.onclick = exportToTxt;

    // 将"导出TXT文件"按钮添加到第三个容器
    exportButtonContainer.appendChild(exportTxtButton);
    // 将第三个按钮容器添加到控制面板
    controlPanel.appendChild(exportButtonContainer);
    addShowCourseNameText();
    addTipsDisplay();

    function exportToEf2() {
        const checkedCheckboxes = document.querySelectorAll("#download_list input[type='checkbox']:checked:not(#selectAllCheckbox)");
        console.log('Checked checkboxes for EF2 export:', checkedCheckboxes.length);

        const selectedFiles = Array.from(checkedCheckboxes).reduce((acc, checkbox) => {
            const container = checkbox.closest('div');
            if (checkbox.id === 'selectAllCheckbox') {
                console.log('Skipping select all checkbox');
                return acc; // 跳过全选按钮
            }
            if (!container) {
                console.error('Cannot find container for checkbox:', checkbox);
                return acc;
            }
            const link = container.querySelector('a');
            if (!link) {
                console.error('Cannot find link in container:', container);
                return acc;
            }
            const url = link.href;
            const filename = link.getAttribute('data-origin-name');
            if (!url || !filename) {
                console.error('Invalid URL or filename:', url, filename);
                return acc;
            }
            acc.push({ url, filename });
            return acc;
        }, []);

        console.log('Selected files for EF2 export:', selectedFiles.length);

        if (selectedFiles.length === 0) {
            alert('请选择要导出的文件');
            return;
        }

        const referer = window.location.href;
        const cookieString = document.cookie;

        let ef2Content = '';
        selectedFiles.forEach(file => {
            ef2Content += '<\r\n';
            ef2Content += `${file.url}\r\n`;
            ef2Content += `referer: ${referer}\r\n`;
            ef2Content += `cookie: ${cookieString}\r\n`;
            ef2Content += `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0\r\n`;
            ef2Content += '>\r\n';
        });

        ef2Content += '\r\n';

        console.log('EF2 content length:', ef2Content.length);

        const blob = new Blob([ef2Content], { type: 'text/plain' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = '课件链接.ef2';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    function exportToTxt() {
        const checkedCheckboxes = document.querySelectorAll("#download_list input[type='checkbox']:checked:not(#selectAllCheckbox)");
        console.log('Checked checkboxes for TXT export:', checkedCheckboxes.length);

        const selectedFiles = Array.from(checkedCheckboxes).reduce((acc, checkbox) => {
            const container = checkbox.closest('div');
            if (checkbox.id === 'selectAllCheckbox') {
                console.log('Skipping select all checkbox');
                return acc; // 跳过全选按钮
            }
            if (!container) {
                console.error('Cannot find container for checkbox:', checkbox);
                return acc;
            }
            const link = container.querySelector('a');
            if (!link) {
                console.error('Cannot find link in container:', container);
                return acc;
            }
            const url = link.href;
            if (!url) {
                console.error('Invalid URL:', url);
                return acc;
            }
            acc.push(url);
            return acc;
        }, []);

        console.log('Selected files for TXT export:', selectedFiles.length);

        if (selectedFiles.length === 0) {
            alert('请选择要导出的文件');
            return;
        }

        let txtContent = selectedFiles.join('\r\n');
        console.log('TXT content length:', txtContent.length);

        const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = '课件链接.txt';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    // 获取课程名称
    function getCourseName() {
        const footer = document.querySelector('.img_footer');
        if (footer) {
            const groupNameElement = footer.querySelector('.group_name');
            if (groupNameElement) {
                return groupNameElement.textContent; // 返回课程名称
            }
        }
        return '未知'; // 如果没有找到课程名称，返回默认文本
    }

    function addShowCourseNameText() {
        showCourseNameText.style.marginTop = '10px';
        showCourseNameText.style.marginBottom = '10px';
        showCourseNameText.style.fontSize = '16px'; // 减小字体大小
        showCourseNameText.style.backgroundColor = 'transparent';
        showCourseNameText.style.width = '100%';
        showCourseNameText.style.textAlign = 'center';
        showCourseNameText.style.fontWeight = '600'; // 稍微减轻字体粗细
        showCourseNameText.style.letterSpacing = '0.5px'; // 减少字母间距
        showCourseNameText.style.padding = '6px'; // 减少内边距
        showCourseNameText.style.boxSizing = 'border-box';
        showCourseNameText.className = 'glowing-text animated-text';

        // 添加 CSS 动画和样式
        const style = document.createElement('style');
        style.textContent = `
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
            100% { transform: translateY(0px); }
        }
        @keyframes colorChange {
            0% { color: #ff6600; text-shadow: 0 0 5px rgba(255, 102, 0, 0.7); }
            50% { color: #ff9900; text-shadow: 0 0 8px rgba(255, 153, 0, 0.8); }
            100% { color: #ff6600; text-shadow: 0 0 5px rgba(255, 102, 0, 0.7); }
        }
        @keyframes borderBlink {
            0% { box-shadow: 0 0 0 1px rgba(255, 165, 0, 0.3); }
            50% { box-shadow: 0 0 0 1px rgba(255, 165, 0, 0.8); }
            100% { box-shadow: 0 0 0 1px rgba(255, 165, 0, 0.3); }
        }
        .animated-text {
            animation:
                float 3s ease-in-out infinite,
                colorChange 5s linear infinite,
                borderBlink 2s linear infinite;
            border-radius: 5px;
        }
    `;
        document.head.appendChild(style);

        const observer = new MutationObserver((mutations, obs) => {
            const courseName = getCourseName();
            if (courseName !== showCourseNameText.getAttribute('data-course')) {
                showCourseNameText.setAttribute('data-course', courseName);
                typeWriter(`当前课程：${courseName}`, showCourseNameText);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });
    }

    // 打字机效果函数
    function typeWriter(text, element, index = 0) {
        if (index < text.length) {
            element.textContent = text.substring(0, index + 1);
            setTimeout(() => typeWriter(text, element, index + 1), 50);
        }
    }

    function addTipsDisplay() {
        tipsDisplay.id = 'tipsDisplay';
        tipsDisplay.id = 'tipsDisplay';
        tipsDisplay.style.padding = '15px';
        tipsDisplay.style.margin = '15px auto';
        tipsDisplay.style.maxWidth = '800px';
        tipsDisplay.style.width = '90%';
        tipsDisplay.style.backgroundColor = 'rgba(252, 187, 52, 0.1)';
        tipsDisplay.style.border = '2px solid #fcbb34';
        tipsDisplay.style.color = '#e67e22';
        tipsDisplay.style.borderRadius = '8px';
        tipsDisplay.style.fontSize = '16px';
        tipsDisplay.style.fontWeight = 'bold';
        tipsDisplay.style.textAlign = 'center';
        tipsDisplay.style.position = 'relative';
        tipsDisplay.style.overflow = 'hidden';
        tipsDisplay.style.cursor = 'pointer';
        tipsDisplay.style.boxShadow = '0 4px 6px rgba(252, 187, 52, 0.2)';
        tipsDisplay.style.maxHeight = '4em';
        tipsDisplay.style.transition = 'all 0.3s ease, max-height 0.5s ease-out';
        tipsDisplay.style.lineHeight = '1.6';
        tipsDisplay.title = '点击以查看/收起所有提示。';
        tipsDisplay.style.opacity = '1';
        tipsDisplay.style.transform = 'translateY(0)';

        // 添加脉动动画
        tipsDisplay.style.animation = 'pulsate 2s infinite';

        // 添加闪光效果
        tipsDisplay.style.backgroundImage = 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)';
        tipsDisplay.style.backgroundSize = '200% 100%';
        tipsDisplay.style.animation = 'pulsate 2s infinite, shine 3s infinite';


        // 添加新的样式
        const style = document.createElement('style');
        style.textContent = `
    #tipsDisplay:hover {
        background-color: rgba(252, 187, 52, 0.2);
        transform: translateY(-2px);
    }
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    #tipsDisplay {
        animation: fadeInUp 0.5s ease-out;
    }

    @keyframes pulsate {
    0% {
        box-shadow: 0 0 0 0 rgba(252, 187, 52, 0.4);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(252, 187, 52, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(252, 187, 52, 0);
    }
}

@keyframes shine {
    0% {
        background-position: -100% 0;
    }
    100% {
        background-position: 100% 0;
    }
}
    `;
        document.head.appendChild(style);

        // 提示信息列表
        const tipsList = [
            '右上角下载栏可下载单个文件。',
            '右下角下载栏可下载多个文件。',
            '可拖动链接至左下角进行下载。',
            '进度条位于左下角折叠列表中。',
            '搜索栏也可搜索后缀名等信息。',
            '右上角支持文档和压缩包下载。',
            '浏览器可以直接右键下载图片。',
            '视频可使用其他现成插件下载。',
            '控制面板可切换文件下载方式。',
            'IDM会强制接管所有下载链接。',
            '文件下载历史记录仅保存三天。',
            '导出时先在右下角列表中勾选。',
            '已读或清空消息后请刷新页面。',
            '课程首页才能获取到教师信息。',
            '搜索功能基于用户的填写信息。',
            '如有建议请在油猴反馈处留言。',
        ];

        let isPaused = false;
        let currentTipIndex = 0;
        let intervalId;
        let isShowingAllTips = false;

        function changeTip() {
            if (!isShowingAllTips && !isPaused) {
                currentTipIndex = (currentTipIndex + 1) % tipsList.length;
                tipsDisplay.style.transition = 'opacity 0.3s, transform 0.3s';
                tipsDisplay.style.opacity = '0';
                tipsDisplay.style.transform = 'translateX(-100%)';
            }
        }

        function updateTipDisplay() {
            tipsDisplay.innerHTML = '<i class="fas fa-lightbulb" style="margin-right: 10px;"></i>' + tipsList[currentTipIndex];
            tipsDisplay.style.opacity = '1';
            tipsDisplay.style.transform = 'translateX(0)';
        }

        tipsDisplay.addEventListener('transitionend', (event) => {
            if (event.propertyName === 'opacity' && tipsDisplay.style.opacity === '0' && !isShowingAllTips) {
                updateTipDisplay();
            }
        });

        // 创建一个新的元素来显示所有提示
        const allTipsContainer = document.createElement('div');
        allTipsContainer.id = 'allTipsContainer';
        allTipsContainer.style.display = 'none';
        allTipsContainer.style.position = 'fixed';
        allTipsContainer.style.top = '50%';
        allTipsContainer.style.left = '50%';
        allTipsContainer.style.transform = 'translate(-50%, -50%)';
        allTipsContainer.style.backgroundColor = '#fff';
        allTipsContainer.style.padding = '30px';
        allTipsContainer.style.borderRadius = '15px';
        allTipsContainer.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
        allTipsContainer.style.zIndex = '10002';
        allTipsContainer.style.maxWidth = '600px';
        allTipsContainer.style.width = '90%';
        allTipsContainer.style.maxHeight = '80vh';
        allTipsContainer.style.overflowY = 'auto';
        allTipsContainer.style.fontFamily = 'Microsoft YaHei, sans-serif';
        allTipsContainer.style.color = '#333';
        allTipsContainer.style.transition = 'none';
        allTipsContainer.style.transformOrigin = 'center center';
        // 获取提示框的位置
        function getTipsDisplayPosition() {
            const rect = tipsDisplay.getBoundingClientRect();
            return {
                left: rect.left + rect.width / 2,
                top: rect.top + rect.height / 2
            };
        }

        // 点击事件处理
        tipsDisplay.addEventListener('click', () => {
            isShowingAllTips = !isShowingAllTips;
            clearInterval(intervalId);

            if (isShowingAllTips) {
                const position = getTipsDisplayPosition();
                const startX = position.left - window.innerWidth / 2;
                const startY = position.top - window.innerHeight / 2;

                allTipsContainer.style.setProperty('--start-x', `${startX}px`);
                allTipsContainer.style.setProperty('--start-y', `${startY}px`);

                allTipsContainer.style.left = '50%';
                allTipsContainer.style.top = '50%';
                allTipsContainer.style.transform = `translate(${startX}px, ${startY}px) scale(0.7)`;
                allTipsContainer.style.opacity = '0';

                allTipsContainer.innerHTML = `
                <h2>所有提示</h2>
                ${tipsList.map((tip, index) => `
                    <div class="tip-item" style="animation: fadeInUp 0.5s ease-out ${index * 0.1}s both;">
                        <span class="tip-number">${index + 1}</span>
                        <span class="tip-text">${tip}</span>
                    </div>
                `).join('')}
                <button id="closeTipsBtn">关闭</button>
            `;

                allTipsContainer.style.display = 'block';

                // 重置并启动打开动画
                allTipsContainer.style.animation = 'none';
                void allTipsContainer.offsetWidth;
                allTipsContainer.style.animation = 'popOutToCenter 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards';
                // 添加关闭按钮事件
                document.getElementById('closeTipsBtn').addEventListener('click', closeTips);
            } else {
                closeTips();
            }
        });

        tipsDisplay.addEventListener('mouseover', () => {
            pauseTips();
            tipsDisplay.style.animation = 'pulsate 1s infinite, shine 2s infinite';
            tipsDisplay.style.transform = 'scale(1.02)';
        });

        tipsDisplay.addEventListener('mouseout', () => {
            resumeTips();
            tipsDisplay.style.animation = 'pulsate 2s infinite, shine 3s infinite';
            tipsDisplay.style.transform = 'scale(1)';
        });

        function closeTips() {
            // 立即停止所有子元素的动画
            allTipsContainer.querySelectorAll('*').forEach(el => {
                el.style.animation = 'none';
                void el.offsetWidth; // 强制重绘
            });

            // 立即停止容器本身的动画
            allTipsContainer.style.animation = 'none';

            // 强制浏览器重新计算样式
            void allTipsContainer.offsetWidth;

            const position = getTipsDisplayPosition();
            const endX = position.left - window.innerWidth / 2;
            const endY = position.top - window.innerHeight / 2;

            allTipsContainer.style.setProperty('--end-x', `${endX}px`);
            allTipsContainer.style.setProperty('--end-y', `${endY}px`);

            // 设置关闭动画
            allTipsContainer.style.animation = 'popInToOrigin 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards';

            allTipsContainer.addEventListener('animationend', () => {
                allTipsContainer.style.display = 'none';
                isShowingAllTips = false;
                resumeTips();
            }, { once: true });
        }

        function pauseTips() {
            isPaused = true;
            clearInterval(intervalId);
            // 停止移动动画
            tipsDisplay.style.transition = 'none';
            tipsDisplay.style.transform = 'translateX(0)';
        }

        function resumeTips() {
            if (!isShowingAllTips) {
                isPaused = false;
                updateTipDisplay();
                startTipInterval();
            }
        }

        function startTipInterval() {
            clearInterval(intervalId);
            intervalId = setInterval(changeTip, 5000);
        }

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && !isShowingAllTips) {
                resumeTips();
            } else {
                pauseTips();
            }
        });

        // 初始启动轮播
        updateTipDisplay();
        startTipInterval();
        // 将 allTipsContainer 添加到 body
        document.body.appendChild(allTipsContainer);
        // 暴露控制函数，供外部使用
        return {
            pauseTips,
            resumeTips
        };
    }

    function updateVisibility() {
        const downloadInterface = document.getElementById('downloadInterface');
        const progressBarInterface = document.getElementById('downloadsContainer');
        const downloadIconContainer = document.getElementById('download_icon_container');
        const downloadListContainer = document.getElementById('download_list');
        const teacherInfoContainer = document.getElementById('teacherInfoContainer');
        const userSearchContainer = document.getElementById('userSearchContainer');

        if (downloadInterface) {
            downloadInterface.style.display = downloadInterfaceCheckbox.checked ? 'block' : 'none';
        }
        if (teacherInfoContainer) {
            teacherInfoContainer.style.display = teacherInfoCheckbox.checked ? 'block' : 'none';
        }
        if (userSearchContainer) {
            userSearchContainer.style.display = userSearchCheckbox.checked ? 'block' : 'none';
        }
        if (progressBarInterface) {
            const isVisible = progressBarCheckbox.checked;
            progressBarInterface.style.display = isVisible ? 'block' : 'none';
            isProgressBarVisible = isVisible; // 更新 isProgressBarVisible 的值
        }
    }

    let isFirstLoad = true;

    // 专门更新右下角下载列表可见性的函数
    function updateDownloadListVisibility() {
        const downloadIconContainer = document.getElementById('download_icon_container');
        const downloadListContainer = document.getElementById('download_list');
        const isVisible = downloadButtonCheckbox.checked;

        if (downloadIconContainer && downloadListContainer) {
            downloadIconContainer.style.display = isVisible ? 'block' : 'none';
            downloadListContainer.style.display = isVisible ? 'block' : 'none';
            downloadListContainer.style.opacity = isVisible ? '1' : '0';
            downloadListContainer.style.maxHeight = isVisible ? '300px' : '0';
        }
    }

    // 将控件移动到对应的分类容器中
    messageContainer.appendChild(messageButtonContainer);
    downloadContainer.appendChild(downloadButtonContainer);
    exportContainer.appendChild(exportButtonContainer);
    displayContainer.appendChild(checkboxesContainer);
    updateContainer.appendChild(Beautifulupdater);

    // 将分类容器添加到控制面板中
    controlPanel.appendChild(messageContainer);
    controlPanel.appendChild(downloadContainer);
    controlPanel.appendChild(exportContainer);
    controlPanel.appendChild(displayContainer);
    controlPanel.appendChild(updateContainer);

    // 默认隐藏除了第一个分类以外的容器
    downloadContainer.style.display = 'none';
    exportContainer.style.display = 'none';
    displayContainer.style.display = 'none';
    updateContainer.style.display = 'none';

    // 将控制面板和切换按钮添加到页面中
    document.body.appendChild(controlPanel);
    document.body.appendChild(toggleButton);

    // 一开始就应用一次设置以匹配初始复选框状态
    updateVisibility();
    updateDownloadListVisibility();
}

// 延迟 1 秒执行所有代码
setTimeout(() => {
    add_download_button(); // 添加下载按钮
    initializeControlPanel(); // 初始化控制面板
    window.toggleListVisibility(); // 切换下载列表的初始可见性
    loadDownloadHistory(); // 加载下载历史

    console.oldLog = console.log;
    console.log = (...data) => {
        if (data[0] === 'nodesToData') {
            course_resources = data[1];
            console.oldLog('::', course_resources);

            let groupId = null;
            for (const resourceId in course_resources) {
                if (course_resources[resourceId].group_id) {
                    groupId = course_resources[resourceId].group_id;
                    break;
                }
            }

            if (groupId) {
                getTeacherInfo(groupId).then((teacherInfo) => {
                    if (teacherInfo) {
                        updateTeacherInfo(teacherInfo);
                    } else {
                        console.error("无法获取老师信息");
                    }
                });
            } else {
                console.warn("无法找到包含 group_id 属性的资源，无法获取老师信息");
            }

            parseContent();
            return;
        }
        console.oldLog(...data);
    };

    // 定义快速筛选的类别选项
    window.quickFilters = [
        { label: "全部", value: "" },
        { label: "文档", value: "doc,docx,pdf,txt,odt,rtf,html,htm,xls,xlsx,ppt,pptx,odp" },
        { label: "图片", value: "jpg,jpeg,png,gif,bmp,tiff,svg,webp,tif" },
        { label: "压缩包", value: "zip,rar,7z,gz,bz2,tar" },
        // 可以继续添加其他类别
    ];

    window.abortControllers = {};

    // 创建一个 MutationObserver 实例
    const observer = new MutationObserver(function(mutationsList, observer) {
        // 在每次发生 DOM 变化时触发这个回调函数
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.target.id === 'download_list') {
                // 重新添加搜索框和批量下载按钮
                window.updateUI();
                break; // 处理完毕后退出循环
            }
        }
    });

    // 配置需要观察的目标节点和观察的类型
    observer.observe(document.body, { childList: true, subtree: true });
}, 1000); // 延迟 1 秒执行


// 定义要抓取的后缀名
const EXTENSIONS = [".doc", ".pdf", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".txt", ".odt", ".rtf", ".zip", ".rar", ".7z", ".tar", ".gz", ".bz2", ".xz"];

// 全局变量
let previewLink;
let isDownloading = false;

// 主函数
function initCourseCapture() {
    const list = createDownloadInterface();
    initializeXHRInterceptor();
    createInitialPreviewLink();
}

// 创建下载界面
function createDownloadInterface() {
    const list = document.createElement("div");
    initializeListStyles(list);
    addAnimationStyles();
    return list;
}

// 初始化列表样式
function initializeListStyles(element) {
    element.id = "downloadInterface";
    Object.assign(element.style, {
        position: "fixed",
        top: "100px",
        right: "0",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
        zIndex: "9997",
        padding: "10px",
        background: "linear-gradient(270deg, #ffc700, #ff8c00, #ff6500)",
        backgroundSize: "400% 400%",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)"
    });

    element.classList.add("dynamic-gradient");
    element.innerHTML = "<h3><span style=\"font-family: '微软雅黑', 'Microsoft YaHei', sans-serif; font-weight: bold; font-style: italic; font-size: 16px;\">抓取到的课件</span></h3>";
    element.querySelector('h3').style.opacity = 0;

    addLottieAnimation(element);
    addInteractivity(element);

    document.body.appendChild(element);
}

// 添加Lottie动画
function addLottieAnimation(element) {
    const lottieContainer = document.createElement('div');
    Object.assign(lottieContainer.style, {
        position: "absolute",
        transition: "all 0.3s ease-in-out",
        width: "200%",
        height: "200%",
        left: "-60%",
        top: "-45%",
        overflow: "hidden",
        zIndex: "9998",
        pointerEvents: "none"
    });

    const lottiePlayer = document.createElement('dotlottie-player');
    lottiePlayer.setAttribute('src', "https://lottie.host/995b71c8-b7aa-45b0-bb77-94b850da5d5d/dyezqbvtia.json");
    lottiePlayer.setAttribute('background', "transparent");
    lottiePlayer.setAttribute('speed', "1");
    lottiePlayer.setAttribute('style', "width: 125%; height: 100%; position: absolute; left: -12.5%;");
    lottiePlayer.setAttribute('loop', "");
    lottiePlayer.setAttribute('autoplay', "");

    lottieContainer.appendChild(lottiePlayer);
    element.appendChild(lottieContainer);
}

// 添加交互性
function addInteractivity(element) {
    element.addEventListener("mouseover", () => {
        element.style.transform = "scale(1.1)";
    });
    element.addEventListener("mouseout", () => {
        element.style.transform = "scale(1)";
    });
    element.addEventListener("click", toggleInterfaceSize);
}

// 切换界面大小
function toggleInterfaceSize() {
    const element = document.getElementById("downloadInterface");
    const lottieContainer = element.querySelector('div');
    const h3 = element.querySelector('h3');

    if (element.style.width === "50px") {
        Object.assign(element.style, {
            width: "350px",
            height: "10%",
            borderRadius: "10px",
            overflow: "auto"
        });
        Object.assign(lottieContainer.style, {
            width: "70%",
            height: "100%",
            left: `${element.offsetWidth - lottieContainer.offsetWidth + 120}px`,
            top: "-20px"
        });
        h3.style.opacity = 1;
    } else {
        Object.assign(element.style, {
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            overflow: "hidden"
        });
        Object.assign(lottieContainer.style, {
            width: "200%",
            height: "200%",
            left: "-60%",
            top: "-45%"
        });
        h3.style.opacity = 0;
    }
}

// 添加动画样式
function addAnimationStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes gradientBgAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .dynamic-gradient {
            animation: gradientBgAnimation 15s ease infinite;
        }
    `;
    document.head.appendChild(style);
}

// 初始化XHR拦截器
function initializeXHRInterceptor() {
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        this.addEventListener("load", () => {
            if (EXTENSIONS.some(ext => url.includes(ext))) {
                handleXhrResponse(url);
            }
        });
        originalOpen.call(this, method, url, true, user, pass);
    };
}

// 处理XHR响应
function handleXhrResponse(url) {
    if (isDownloading) return;
    isDownloading = true;

    const token = getCookie();
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.onload = function () {
        const text = xhr.responseText.replace("}}", "").replace(/"/g, "");
        const match = text.match(/(http|https):\/\/\S+/);
        const content = document.title.split('|')[0].trim();

        if (match) {
            triggerNewLinkAnimation();
            updatePreviewLink(match[0], content);
        }
        isDownloading = false;
    };
    xhr.send();
}

// 触发新链接动画
function triggerNewLinkAnimation() {
    const downloadInterface = document.getElementById("downloadInterface");
    if (downloadInterface.style.width === "50px") {
        downloadInterface.style.animation = "pulse 0.5s ease-in-out 2";
        downloadInterface.addEventListener('animationend', () => {
            downloadInterface.style.animation = '';
        }, {once: true});
    }
}

// 创建初始预览链接
function createInitialPreviewLink() {
    if (!previewLink || !document.contains(previewLink)) {
        createPreviewLink("#", "等待课件...( ＿ ＿)ノ｜");
        previewLink.removeAttribute("href");
        Object.assign(previewLink.style, {
            pointerEvents: "none",
            color: "#DDD"
        });
    }
}

// 创建或更新预览链接
function updatePreviewLink(href, content) {
    const list = document.getElementById("downloadInterface");
    while (list.childNodes.length > 2) {
        list.removeChild(list.lastChild);
    }

    if (previewLink && document.contains(previewLink)) {
        Object.assign(previewLink, {
            href: href,
            textContent: content,
            style: {
                pointerEvents: "",
                color: ""
            }
        });
    } else {
        createPreviewLink(href, content);
    }
}

// 创建预览链接
function createPreviewLink(href, content) {
    previewLink = document.createElement("a");
    Object.assign(previewLink.style, {
        background: "linear-gradient(to right, #ffffff, #ffecb3)",
        backgroundClip: "text",
        webkitBackgroundClip: "text",
        color: "transparent",
        fontFamily: "'微软雅黑', 'Microsoft YaHei', sans-serif",
        fontWeight: "bold",
        transition: "transform 0.3s, text-shadow 0.3s",
        display: "inline-block",
        position: "relative"
    });

    previewLink.title = "点击以下载";
    previewLink.draggable = true;
    previewLink.dataset.downloadUrl = href;
    previewLink.dataset.filename = content;

    addPreviewLinkEventListeners(previewLink);

    const list = document.getElementById("downloadInterface");
    list.appendChild(previewLink);
    list.appendChild(document.createElement("br"));

    Object.assign(previewLink, {
        href: href,
        target: "_blank",
        textContent: content
    });

    previewLink.style.animation = "slideIn 0.5s forwards";
}

// 添加预览链接事件监听器
function addPreviewLinkEventListeners(previewLink) {
    previewLink.addEventListener('dragstart', (event) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', previewLink.dataset.downloadUrl);
        event.dataTransfer.setData('text/filename', previewLink.dataset.filename);
    });

    previewLink.addEventListener('mouseover', () => {
        previewLink.style.transform = "scale(1.05)";
        previewLink.style.textShadow = "0 0 8px rgba(255, 165, 0, 0.7)";
    });

    previewLink.addEventListener('mouseout', () => {
        previewLink.style.transform = "scale(1)";
        previewLink.style.textShadow = "none";
    });

    previewLink.addEventListener('mousedown', () => {
        previewLink.style.transform = "scale(0.95)";
    });

    previewLink.addEventListener('mouseup', () => {
        previewLink.style.transform = "scale(1.05)";
    });

    previewLink.addEventListener("click", function (event) {
        event.preventDefault();
        courseDownload(previewLink.href, previewLink.textContent);
    });
}

initCourseCapture();

function createToggleButton(text) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.cssText = `
        position: absolute;
        top: 10px;
        left: 100%;
        padding: 8px 16px;
        background-color: #fcbb34;
        color: white;
        border: none;
        border-radius: 0 8px 8px 0;
        cursor: pointer;
        white-space: nowrap;
        z-index: 10001;
        transition: all 0.3s ease;
        font-family: Arial, sans-serif;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        outline: none;
    `;

    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#e5a72e';
        button.style.transform = 'translateX(5px)';
    });

    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#fcbb34';
        button.style.transform = 'translateX(0)';
    });

    button.addEventListener('mousedown', () => {
        button.style.transform = 'translateX(2px) scale(0.98)';
    });

    button.addEventListener('mouseup', () => {
        button.style.transform = 'translateX(5px) scale(1)';
    });

    return button;
}

// 切换容器的显示/隐藏
function toggleContainer(container, button) {
    const isHidden = container.style.left === '-400px';
    container.style.left = isHidden ? '0' : '-400px';
    button.style.backgroundColor = isHidden ? '#e69b00' : '#fcbb34';
    button.textContent = isHidden ? '关闭' : button.getAttribute('data-original-text');
}

// 创建并设置教师信息容器
function createTeacherInfoContainer() {
    const container = document.createElement("div");
    container.id = "teacherInfoContainer";
    container.style.cssText = `
        position: fixed;
        top: 30vh;
        left: -400px;
        z-index: 10000;
        background-color: #FFF3E0;
        border: 1px solid #FFD180;
        border-radius: 0 8px 8px 0;
        padding: 20px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        width: 400px;
        height: 130px;
        max-height: 60vh;
        transition: all 0.3s ease;
        font-family: "Microsoft YaHei", sans-serif;
        font-weight: bold;
    `;
    const scrollContent = document.createElement('div');
    scrollContent.style.cssText = `
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        font-family: "Microsoft YaHei", sans-serif;
        font-weight: bold;
    `;
    scrollContent.id = "teacherInfoContent";
    scrollContent.innerHTML = `
        <div class="loading-message" style="text-align: center; padding: 20px;">
            <p style="margin-bottom: 10px; font-size: 16px;">请打开任意课程</p>
            <div class="loading-dots">
                <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
            </div>
        </div>
    `;
    const toggleButton = createToggleButton("教师信息");
    toggleButton.setAttribute('data-original-text', "教师信息");
    toggleButton.style.left = '400px';
    toggleButton.style.fontFamily = '"Microsoft YaHei", sans-serif';
    toggleButton.style.fontWeight = 'bold';
    toggleButton.onclick = (e) => {
        e.stopPropagation();
        toggleContainer(container, toggleButton);
    };
    container.appendChild(scrollContent);
    container.appendChild(toggleButton);
    document.body.appendChild(container);

    // 添加样式
    const teacher_style = document.createElement('style');
    teacher_style.textContent = `
        @keyframes blink {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
        }
        .loading-dots .dot {
            animation: blink 1.4s infinite;
            animation-fill-mode: both;
            font-size: 24px;
        }
        .loading-dots .dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        .loading-dots .dot:nth-child(3) {
            animation-delay: 0.4s;
        }
    `;
    document.head.appendChild(teacher_style);
}

function updateTeacherInfo(teacherInfo) {
    const content = document.getElementById("teacherInfoContent");
    if (teacherInfo && teacherInfo.length > 0) {
        content.innerHTML = `
            <h3 class="title" style="font-family: 'Microsoft YaHei', sans-serif; font-weight: bold; margin-bottom: 15px; padding-left: 10px;">教师信息</h3>
            <div class="teacher-list" style="font-family: 'Microsoft YaHei', sans-serif; font-weight: bold;">
                ${teacherInfo.map((teacher) => `
                    <div class="teacher-item" style="margin-bottom: 10px; padding: 10px; background-color: #FFE0B2; border-radius: 5px;">
                        <div class="teacher-name" style="margin-bottom: 5px;">${teacher.nickname}</div>
                        <div class="teacher-number" style="color: #757575;">${teacher.studentNumber}</div>
                    </div>
                `).join("")}
            </div>
        `;
    } else {
        content.innerHTML = '<p class="no-data" style="font-family: \'Microsoft YaHei\', sans-serif; font-weight: bold; color: #757575; text-align: center; padding: 20px;">暂无教师信息</p>';
    }
}

// 获取教师信息
async function getTeacherInfo(groupId) {
    if (!course_resources || Object.keys(course_resources).length === 0) {
        console.error("无法获取课程资源信息");
        return;
    }

    const token = getCookie();
    const apiUrl = `https://${hostname}/api/jx-iresource/statistics/group/visit`;

    const requestBody = {
        group_id: groupId,
        role_type: "normal"
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API 请求失败：${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const teachers = data.data.teachers;

        return teachers.map((teacher) => ({
            nickname: teacher.nickname,
            studentNumber: teacher.studentNumber,
        }));
    } catch (error) {
        console.error("获取教师信息时出错：", error);
        return null;
    }
}

function createUserSearchContainer() {
    const container = document.createElement('div');
    container.id = "userSearchContainer";
    container.style.cssText = `
        position: fixed;
        top: 45vh;
        left: -400px;
        z-index: 9999;
        background-color: #FFF3E0;
        border: 1px solid #FFD180;
        border-radius: 0 8px 8px 0;
        padding: 20px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        width: 400px;
        height: 150px;
        transition: all 0.3s ease;
        font-family: 'Microsoft YaHei', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: bold;
    `;

    const scrollContent = document.createElement('div');
    scrollContent.style.cssText = `
        height: 100%;
        overflow-y: auto;
    `;

    scrollContent.innerHTML = `
        <input type="text" id="userSearchInput" placeholder="输入电话/一卡通号" class="search-input" style="
            font-family: 'Microsoft YaHei', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-weight: normal;
            width: 70%;
            padding: 10px 15px;
            margin-right: 10px;
            border: 2px solid #FFD180;
            border-radius: 20px;
            font-size: 16px;
            color: #333;
            outline: none;
            transition: all 0.3s ease;
        ">
        <button id="userSearchButton" class="search-button" style="
            font-family: 'Microsoft YaHei', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-weight: bold;
            padding: 10px 20px;
            cursor: pointer;
            background-color: #FFD180;
            color: #333;
            border: none;
            border-radius: 20px;
            font-size: 16px;
            transition: all 0.3s ease;
        ">搜索</button>
        <div id="userSearchResults" class="search-results" style="
            margin-top: 15px;
            font-weight: normal;
        ">
            <p class="search-hint">请输入电话或一卡通号进行搜索</p>
        </div>
    `;

    const toggleButton = createToggleButton("用户搜索");
    toggleButton.setAttribute('data-original-text', "用户搜索");
    toggleButton.style.left = '400px';
    toggleButton.style.fontFamily = '"Microsoft YaHei", sans-serif';
    toggleButton.style.fontWeight = 'bold';
    toggleButton.onclick = (e) => {
        e.stopPropagation();
        toggleContainer(container, toggleButton);

        // 检查是否是第一次打开
        if (!localStorage.getItem('userSearchWarningShown')) {
            showUserSearchWarning();
            localStorage.setItem('userSearchWarningShown', 'true');
        }
    };

    container.appendChild(scrollContent);
    container.appendChild(toggleButton);
    document.body.appendChild(container);

    setTimeout(() => {
        const input = document.getElementById("userSearchInput");
        if (input) {
            input.addEventListener('focus', () => {
                input.style.borderColor = '#FFA000';
                input.style.boxShadow = '0 0 5px rgba(255, 160, 0, 0.5)';
            });
            input.addEventListener('blur', () => {
                input.style.borderColor = '#FFD180';
                input.style.boxShadow = 'none';
            });

            // 添加回车键搜索功能
            input.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    await performSearch();
                }
            });
        }

        const button = document.getElementById("userSearchButton");
        if (button) {
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#FFA000';
            });
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = '#FFD180';
            });
            button.addEventListener('click', performSearch);
        }
    }, 0);

    // 添加样式
    const search_style = document.createElement('style');
    search_style.textContent = `
        #userSearchInput::placeholder {
            color: #999;
            opacity: 1;
            transition: opacity 0.3s ease;
        }
        #userSearchInput:focus::placeholder {
            opacity: 0.5;
        }
    `;
    document.head.appendChild(search_style);
}

// 执行搜索的函数
async function performSearch() {
    const input = document.getElementById("userSearchInput");
    const resultsDiv = document.getElementById("userSearchResults");
    if (input && resultsDiv) {
        const username = input.value.trim();
        if (username.length > 0) {
            const userInfo = await searchUser(username);
            displayUserInfo(userInfo, resultsDiv);
        } else {
            resultsDiv.innerHTML = '<p class="search-hint">请输入用户名或学号进行搜索</p>';
        }
    }
}

// 添加显示警告的函数
function showUserSearchWarning() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10001;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(overlay);

    const warningDiv = document.createElement('div');
    warningDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #FFF3E0;
        border: none;
        border-radius: 12px;
        padding: 40px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10002;
        max-width: 600px;
        width: 90%;
        text-align: center;
        font-family: Arial, sans-serif;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    warningDiv.innerHTML = `
        <h3 style="
            color: #E65100;
            margin-top: 0;
            font-size: 28px;
            margin-bottom: 25px;
            font-family: 'Microsoft YaHei', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-weight: bold;
        ">⚠️ 警告</h3>
        <p style="
            color: #555;
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 30px;
            font-family: 'Microsoft YaHei', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        ">请注意：用户搜索功能仅供学习和研究使用。不当用途可能违反相关法律法规和学校政策。请遵守相关规定，尊重他人隐私。</p>
        <button id="warningCloseBtn" style="
            background-color: #FF9800;
            border: none;
            color: white;
            padding: 14px 28px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 18px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 50px;
            transition: background-color 0.3s ease;
            outline: none;
            font-family: 'Microsoft YaHei', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        ">我已了解</button>
    `;
    document.body.appendChild(warningDiv);

    const closeBtn = document.getElementById('warningCloseBtn');
    closeBtn.onmouseover = () => {
        closeBtn.style.backgroundColor = '#F57C00';
    };
    closeBtn.onmouseout = () => {
        closeBtn.style.backgroundColor = '#FF9800';
    };
    closeBtn.onclick = () => {
        fadeOutAndRemove(overlay);
        fadeOutAndRemove(warningDiv);
    };

    // 淡入效果
    setTimeout(() => {
        overlay.style.opacity = '1';
        warningDiv.style.opacity = '1';
    }, 10);
}

function fadeOutAndRemove(element) {
    element.style.opacity = '0';
    element.addEventListener('transitionend', function handler() {
        element.removeEventListener('transitionend', handler);
        element.parentNode.removeChild(element);
    });
}

// 搜索用户函数
async function searchUser(username) {
    const token = getCookie();
    const apiUrl = `https://${hostname}/api/jx-iresource/auth/user/info?username=${username}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.data;
        } else {
            throw new Error(`API 请求失败：${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error("搜索用户时出错：", error);
        return null;
    }
}

// 显示用户信息函数
function displayUserInfo(userInfo, resultsDiv) {
    if (userInfo && userInfo.length > 0) {
        const user = userInfo[0];
        resultsDiv.innerHTML = `
            <div class="user-info">
                <p><strong>用户名:</strong> ${user.loginName || "未知"}</p>
                <p><strong>昵称:</strong> ${user.nickname || "未知"}</p>
                <p><strong>姓名:</strong> ${user.realname || "未知"}</p>
                <p><strong>性别:</strong> ${user.sex || "未知"}</p>
                <p><strong>邮箱:</strong> ${user.email || "未知"}</p>
                <p><strong>电话:</strong> ${user.phone || "未知"}</p>
                <p><strong>学校:</strong> ${user.schoolName || "未知"}</p>
                <p><strong>QQ:</strong> ${user.qq || "未知"}</p>
            </div>
        `;
    } else {
        resultsDiv.innerHTML = '<p class="no-data">未找到该用户</p>';
    }
}

// 初始化函数
function initContainers() {
    createTeacherInfoContainer();
    createUserSearchContainer();
}

// 初始化 Konami 代码序列
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

// 监听键盘事件
document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// 激活彩蛋功能
function activateEasterEgg() {
    console.log("彩蛋已激活！");
    initContainers();
}