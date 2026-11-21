// ==UserScript==
// @name        小雅爬爬爬
// @match       https://*.ai-augmented.com/*
// @grant       none
// @require     https://cdn.jsdmirror.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @description 🚀 小雅平台课件下载利器！批量下载、排序、筛选、导出等一应俱全！更多功能等你发掘！
// @license     MIT
// @author      Yi
// @version     2.0.2
// @icon        https://www.ai-augmented.com/static/logo3.1dbbea8f.png
// @homepageURL https://xiaoya.zygame1314.site
// @supportURL  https://xiaoya.zygame1314.site
// ==/UserScript==

var isProgressBarVisible = true;
var styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
    body,
    body * {
        font-family: 'Microsoft YaHei', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
    }
    .custom-checkbox {
        appearance: none;
        width: 25px;
        height: 25px;
        background-color: #fff;
        border: 2px solid #ffa500;
        border-radius: 50%;
        margin-right: 10px;
        cursor: pointer;
        position: relative;
        transition: all 0.3s ease;
        overflow: hidden;
    }
    .custom-checkbox::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        width: 15px;
        height: 15px;
        background-color: #ffa500;
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    .custom-checkbox:checked::before {
        transform: translate(-50%, -50%) scale(1);
    }
    .custom-checkbox:checked {
        border-color: #ff8c00;
        animation: rotate 0.5s ease;
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
            box-shadow: 0 0 15px #fcbb34, 0 0 20px #f0932b;
        }
        100% {
            box-shadow: 0 0 5px #fcbb34;
        }
    }
    #teacherInfoContainer, #userSearchContainer {
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
        .search-teacher-input {
            width: 200px;
            padding: 8px;
            border: 1px solid #FFD180;
            border-radius: 4px;
            margin-bottom: 10px;
        }
        .search-teacher-button {
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            background-color: #fcbb34;
            color: #fff;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .search-teacher-button:hover {
            background-color: #e69b00;
        }
        .search-teacher-results {
            margin-top: 10px;
            border: 1px solid #FFD180;
            padding: 10px;
            border-radius: 4px;
            background-color: #fff;
        }
        .search-teacher-hint {
            color: #757575;
            font-style: italic;
            text-align: center;
            margin-top: 10px;
        }
    }
    .failed-file {
        background-color: #ffeeee;
        padding: 5px;
        margin: 5px 0;
        border-radius: 5px;
    }
    .retry-btn {
        margin-left: 10px;
        padding: 2px 5px;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 3px;
        cursor: pointer;
    }
    .retry-btn:hover {
        background-color: #e0e0e0;
    }
    .failed-file {
        opacity: 0;
        transform: translateX(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .custom-select {
        position: relative;
        font-family: 'Microsoft YaHei', sans-serif;
        flex: 1;
        margin-right: 10px;
        z-index: 10000;
    }
    .custom-select select {
        display: none;
    }
    .select-selected {
        background-color: white;
        border: 2px solid #ffa500;
        border-radius: 20px;
        padding: 0 40px 0 15px;
        height: 38px;
        line-height: 38px;
        cursor: pointer;
        user-select: none;
        font-size: 14px;
        font-weight: bold;
        color: #ffa500;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
    }
    .select-selected:after {
        position: absolute;
        content: "";
        top: 50%;
        right: 15px;
        width: 0;
        height: 0;
        border: 6px solid transparent;
        border-color: #ffa500 transparent transparent transparent;
        transition: all 0.3s ease;
        transform: translateY(-50%);
    }
    .select-selected.select-arrow-active {
        border-radius: 20px 20px 0 0;
        border-bottom-color: transparent;
    }
    .select-selected.select-arrow-active:after {
        border-color: transparent transparent #ffa500 transparent;
        top: 50%;
        transform: translateY(-25%);
    }
    .select-items div,.select-selected {
        font-weight: bold;
        color: #ffa500;
        padding: 8px 15px;
        cursor: pointer;
        user-select: none;
    }
    .select-items {
        position: absolute;
        background-color: white;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 10001;
        border: 2px solid #ffa500;
        border-top: none;
        border-radius: 0 0 20px 20px;
        max-height: 200px;
        overflow-y: auto;
        box-shadow: 0 4px 8px rgba(255, 165, 0, 0.2);
        margin-top: -2px;
    }
    .select-hide {
        display: none;
    }
    .select-items div {
        padding: 8px 15px;
        display: flex;
        align-items: center;
        min-height: 38px;
        box-sizing: border-box;
    }
    .select-items div:hover, .same-as-selected {
        background-color: rgba(255, 165, 0, 0.2);
    }
    .select-selected:hover, .custom-select:focus-within .select-selected {
        border-color: #ff8c00;
        box-shadow: 0 0 8px rgba(255, 165, 0, 0.5);
    }
    .select-items::-webkit-scrollbar {
        width: 8px;
    }
    .select-items::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 0 0 20px 0;
    }
    .select-items::-webkit-scrollbar-thumb {
        background: #ffa500;
        border-radius: 10px;
    }
    .select-items::-webkit-scrollbar-thumb:hover {
        background: #ff8c00;
    }
    .select-items div:last-child {
        border-radius: 0 0 18px 18px;
    }
`;
document.head.appendChild(styleSheet);
(function ensureXyIconFont() {
    if (document.getElementById('xy-icon-font')) return;
    const link = document.createElement('link');
    link.id = 'xy-icon-font';
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdmirror.com/ajax/libs/font-awesome/6.7.2/css/all.min.css';
    link.onerror = () => {
        link.onerror = null;
        link.href = 'https://cdn.jsdmirror.com/npm/@fortawesome/fontawesome-free@6.7.2/css/all.min.css';
    };
    document.head.appendChild(link);
    const iconStyle = document.createElement('style');
    iconStyle.id = 'xy-icon-base';
    iconStyle.textContent = `
        .xy-icon,
        i.fa-solid {
            font-family: "Font Awesome 6 Free" !important;
            font-weight: 900 !important;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            vertical-align: -0.125em;
        }
    `;
    document.head.appendChild(iconStyle);
})();
function xyIcon(name, className = '') {
    return `<i class="fa-solid fa-${name} xy-icon${className ? ' ' + className : ''}" aria-hidden="true"></i>`;
}
function loadCustomFilters() {
    try {
        const savedFilters = localStorage.getItem('customQuickFilters');
        if (savedFilters) {
            const parsedFilters = JSON.parse(savedFilters);
            if (Array.isArray(parsedFilters) && parsedFilters.length === window.quickFilters.length) {
                return parsedFilters;
            }
        }
    } catch (error) {
        console.error('加载自定义过滤器时出错:', error);
    }
    return null;
}
let course_resources;
let currentResourcesGroupId = null;
let courseVisitData;
let historyListElement;
let failedContainer;
let failedToggleButton;
let noErrorsMessage;
let forcedExpandedItems = new Set();
let historyPopup = null;
let isEasterEggActivated = false;
let downloadHistory = [];
let detectInterval = null;
window.currentSearchKeyword = '';
window.currentFilterCategory = '';
window.quickFilters = [
    { label: "全部", value: "" },
    { label: "文档", value: "doc,docx,pdf,txt,odt,rtf,html,htm,xls,xlsx,ppt,pptx,odp,xmind" },
    { label: "图片", value: "jpg,jpeg,png,gif,bmp,tiff,svg,webp,tif" },
    { label: "音频", value: "mp3,wav,ogg,flac,aac,m4a,wma,aiff,ape,midi" },
    { label: "代码", value: "py,cpp,java,js,ts,cs,php,rb,go,swift,kt,c,h,sh,bat,json,xml,yaml,yml,sql,css,scss,less" },
    { label: "压缩包", value: "zip,rar,7z,gz,bz2,tar" }
];
const hostname = window.location.hostname;
const savedFilters = loadCustomFilters();
if (savedFilters) {
    window.quickFilters = savedFilters;
}
function isVideoFile(mimetype, resourceName) {
    const videoExtensions = [
        'mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', 'm4v',
        'mpeg', 'mpg', '3gp', 'ts', 'vob', 'ogv', 'divx', 'rm', 'rmvb', 'f4v'
    ];
    if (typeof mimetype === 'string' && mimetype.startsWith('video/')) {
        return true;
    }
    if (typeof resourceName === 'string') {
        const parts = resourceName.split('.');
        if (parts.length > 1) {
            const extension = parts.pop().toLowerCase();
            if (videoExtensions.includes(extension)) {
                return true;
            }
        }
    }
    return false;
}
async function getCourseAccessToken(visitData) {
    if (!visitData) return null;
    const token = getCookie();
    try {
        const authUrl = `https://${hostname}/api/jx-iresource/group/access/authorization`;
        const authResponse = await fetch(`${authUrl}?site_id=${visitData.site_id}&role_type=4`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const authData = await authResponse.json();
        return authData.data?.access_group_token;
    } catch (error) {
        console.error('获取访问token失败:', error);
        return null;
    }
}
async function getCourseResources(groupId, visitData) {
    const token = getCookie();
    const url = `https://${hostname}/api/jx-iresource/resource/queryCourseResources?group_id=${groupId}`;
    try {
        let response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json; charset=utf-8'
            }
        });
        let responseData = await response.json();
        if (responseData.code === 50007) {
            const accessToken = await getCourseAccessToken(visitData);
            if (accessToken) {
                response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json; charset=utf-8',
                        'X-Course-Access': accessToken
                    }
                });
                responseData = await response.json();
            }
        }
        if (!responseData.success) {
            throw new Error(`获取课程资源失败: ${responseData.message}`);
        }
        return responseData.data;
    } catch (error) {
        console.error('获取课程资源出错:', error);
        return null;
    }
}
async function getCourseVisitData(groupId) {
    const token = getCookie();
    const url = `https://${hostname}/api/jx-iresource/statistics/group/visit`;
    try {
        const visitResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({ group_id: groupId, role_type: "normal" })
        });
        const visitData = await visitResponse.json();
        if (!visitData.success) {
            console.error('获取课程访问数据失败:', visitData.message);
            return null;
        }
        return visitData.data;
    } catch (error) {
        console.error('获取课程访问数据失败:', error);
        return null;
    }
}
function isValidCourseUrl() {
    return window.location.href.startsWith(`https://${hostname}/app/jx-web/mycourse/`) &&
        /\/mycourse\/\d{19}/.test(window.location.pathname);
}
function getGroupIdFromUrl() {
    try {
        if (!isValidCourseUrl()) {
            return null;
        }
        const pathname = window.location.pathname;
        const match = pathname.match(/\/mycourse\/(\d{19})/);
        if (!match) {
            console.warn('未找到有效的课程ID');
            return null;
        }
        return match[1];
    } catch (error) {
        console.error('获取课程ID时出错:', error);
        return null;
    }
}
function decryptFileUrl(encryptedUrl) {
    try {
        const key = "94374647";
        const vector = "99526255";
        const base64Str = encryptedUrl
            .replace(/_/g, '+')
            .replace(/\*/g, '/')
            .replace(/-/g, '=');
        const keyUtf8 = window.CryptoJS.enc.Utf8.parse(key);
        const ivUtf8 = window.CryptoJS.enc.Utf8.parse(vector);
        const decrypted = window.CryptoJS.DES.decrypt({
            ciphertext: window.CryptoJS.enc.Base64.parse(base64Str)
        }, keyUtf8, {
            iv: ivUtf8,
            mode: window.CryptoJS.mode.CBC,
            padding: window.CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(window.CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('URL解密失败:', error);
        return encryptedUrl;
    }
}
async function parseContent() {
    if (!isValidCourseUrl()) {
        return;
    }
    window.currentSearchKeyword = '';
    window.currentFilterCategory = '';
    const groupId = getGroupIdFromUrl();
    if (!groupId) {
        showNotification('无法获取课程ID', 'error');
        return;
    }
    const openTree = document.getElementById('treeContainer');
    if (openTree && typeof openTree.close === 'function' && openTree.style.display === 'block') {
        openTree.close();
    }
    const visitData = await getCourseVisitData(groupId);
    courseVisitData = visitData;
    const resources = await getCourseResources(groupId, visitData);
    course_resources = resources;
    currentResourcesGroupId = resources ? groupId : null;
    if (!course_resources) {
        showNotification('获取课程资源失败', 'error');
        return;
    }
    if (visitData) {
        console.log('课程名称:', visitData.name);
        console.log('课程站点ID:', visitData.site_id);
        console.log('教师信息:', visitData.teachers);
    }
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.value = '';
    }
    const quickFilterSelect = document.getElementById("quickFilterSelect");
    if (quickFilterSelect) {
        quickFilterSelect.selectedIndex = 0;
    }
    var download_list = document.getElementById("download_list");
    download_list.innerHTML = '';
    const selectAllReset = document.getElementById('selectAllCheckbox');
    if (selectAllReset) selectAllReset.checked = false;
    failedContainer = document.createElement('div');
    failedContainer.id = 'failedContainer';
    failedContainer.style.cssText = `
        display: none;
        margin-top: 10px;
        border: 1px solid #ffcccc;
        border-radius: 5px;
        padding: 10px;
        background-color: #fff5f5;
        max-height: 200px;
        overflow-y: auto;
    `;
    noErrorsMessage = document.createElement('div');
    noErrorsMessage.style.cssText = `
        display: none;
        text-align: center;
        padding: 10px;
        color: #4caf50;
        font-weight: bold;
    `;
    noErrorsMessage.textContent = '太棒了！没有任何错误 (≧▽≦)';
    failedToggleButton = document.createElement('button');
    failedToggleButton.textContent = '显示失败项 (0)';
    failedToggleButton.style.cssText = `
        margin-top: 10px;
        padding: 5px 10px;
        background-color: #ff9999;
        border: none;
        border-radius: 5px;
        color: white;
        cursor: pointer;
        font-weight: bold;
    `;
    failedToggleButton.onclick = toggleFailedContainer;
    download_list.appendChild(failedToggleButton);
    download_list.appendChild(failedContainer);
    failedContainer.appendChild(noErrorsMessage);
    updateFailedCount();
    function createFileItem(resource) {
        let file_name = resource.name;
        let create_time = new Date(resource.created_at).toLocaleDateString();
        let update_time = new Date(resource.updated_at).toLocaleDateString();
        var file_container = document.createElement('div');
        file_container.className = 'file-item';
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'custom-checkbox';
        checkbox.setAttribute('data-visible', 'true');
        checkbox.id = 'file-checkbox-' + resource.id;
        checkbox.addEventListener('change', function () {
            updateTreeCheckbox(this);
            syncTreeWithDownloadList();
        });
        var fileIconInfo = getFileIconInfo(file_name);
        var fileIcon = document.createElement('span');
        fileIcon.className = `file-icon ${fileIconInfo.colorClass}`;
        fileIcon.innerHTML = fileIconInfo.html;
        var file_info = document.createElement('div');
        file_info.className = 'file-info';
        var fileName = document.createElement('div');
        fileName.className = 'file-name';
        fileName.textContent = file_name;
        fileName.title = file_name;
        var fileDetails = document.createElement('div');
        fileDetails.className = 'file-details';
        const svgIcons = {
            create: xyIcon('calendar-plus'),
            update: xyIcon('arrows-rotate')
        };
        var dateContainer = document.createElement('div');
        dateContainer.style.display = 'flex';
        dateContainer.style.justifyContent = 'space-between';
        var dateElement = document.createElement('span');
        dateElement.style.display = 'flex';
        dateElement.style.alignItems = 'center';
        dateElement.style.gap = '5px';
        if (create_time === update_time) {
            dateElement.innerHTML = `${svgIcons.create} 创建/更新: ${create_time}`;
            dateElement.title = '创建和更新日期';
        } else {
            dateElement.innerHTML = `
                ${svgIcons.create} 创建: ${create_time}
                <span style="margin: 0 8px;"></span>
                ${svgIcons.update} 更新: ${update_time}
            `;
            dateElement.title = '创建日期 / 更新日期';
        }
        dateContainer.appendChild(dateElement);
        fileDetails.appendChild(dateContainer);
        file_info.appendChild(fileName);
        file_info.appendChild(fileDetails);
        var downloadLink = document.createElement('a');
        downloadLink.className = 'download-link';
        downloadLink.href = '#';
        downloadLink.target = "_blank";
        downloadLink.title = `下载 ${file_name}`;
        downloadLink.setAttribute('data-created-at', resource.created_at);
        downloadLink.setAttribute('data-updated-at', resource.updated_at);
        downloadLink.setAttribute('data-origin-name', file_name);
        downloadLink.setAttribute('data-resource-id', resource.id);
        downloadLink.setAttribute('data-path', resource.path);
        downloadLink.setAttribute('data-parent-id', resource.parent_id);
        downloadLink.setAttribute('data-quote-id', resource.quote_id);
        downloadLink.draggable = true;
        var downloadIcon = document.createElement('span');
        downloadIcon.className = 'download-icon';
        downloadIcon.innerHTML = xyIcon('download');
        downloadLink.appendChild(downloadIcon);
        downloadLink.addEventListener('click', async function (event) {
            event.preventDefault();
            const downloadIcon = this.querySelector('.download-icon');
            downloadIcon.innerHTML = xyIcon('spinner', 'fa-spin');
            try {
                totalDownloads++;
                updateTotalProgress();
                const fileUrl = await window.getDownloadUrl(resource.quote_id);
                courseDownload(fileUrl, file_name);
            } catch (error) {
                console.error('获取下载链接失败:', error);
                addFailedFileNotification(file_name);
                completedDownloads++;
                updateTotalProgress();
            } finally {
                downloadIcon.innerHTML = xyIcon('download');
            }
        });
        var previewLink = document.createElement('a');
        previewLink.className = 'preview-link';
        previewLink.href = '#';
        previewLink.title = `预览 ${file_name}`;
        previewLink.setAttribute('data-created-at', resource.created_at);
        previewLink.setAttribute('data-updated-at', resource.updated_at);
        previewLink.setAttribute('data-origin-name', file_name);
        previewLink.setAttribute('data-resource-id', resource.id);
        previewLink.setAttribute('data-path', resource.path);
        previewLink.setAttribute('data-parent-id', resource.parent_id);
        var previewIcon = document.createElement('span');
        previewIcon.className = 'preview-icon';
        previewIcon.innerHTML = xyIcon('eye');
        previewLink.appendChild(previewIcon);
        previewLink.addEventListener('click', async function (event) {
            event.preventDefault();
            const previewIcon = this.querySelector('.preview-icon');
            previewIcon.innerHTML = xyIcon('spinner', 'fa-spin');
            try {
                const fileUrl = await window.getDownloadUrl(resource.quote_id);
                previewFile(file_name, fileUrl);
            } catch (error) {
                console.error('获取预览链接失败:', error);
                showNotification('获取预览链接失败', 'error');
            } finally {
                previewIcon.innerHTML = xyIcon('eye');
            }
        });
        file_container.appendChild(checkbox);
        file_container.appendChild(fileIcon);
        file_container.appendChild(file_info);
        file_container.appendChild(previewLink);
        file_container.appendChild(downloadLink);
        return file_container;
    }
    window.getDownloadUrl = async function (quoteId) {
        const maxRetries = 3;
        const retryDelay = 1000;
        let retryCount = 0;
        while (retryCount < maxRetries) {
            try {
                const token = getCookie();
                const response = await fetch('https://' + hostname + '/api/jx-oresource/cloud/file_url/' + quoteId, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    let fileUrl = data.data.url;
                    if (data.data.is_encryption) {
                        fileUrl = decryptFileUrl(fileUrl);
                    }
                    return fileUrl;
                }
                throw new Error('获取下载链接失败');
            } catch (error) {
                retryCount++;
                if (retryCount === maxRetries) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }
    }
    const fragment = document.createDocumentFragment();
    for (const resource of course_resources) {
        if (resource.mimetype &&
            resource.type !== 'folder' &&
            !isVideoFile(resource.mimetype, resource.name)) {
            const fileItem = createFileItem(resource);
            fragment.appendChild(fileItem);
        }
    }
    download_list.appendChild(fragment);
    function getFileIconInfo(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'webp', 'tif'];
        const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma', 'aiff', 'ape', 'midi'];
        const codeExts = ['py', 'cpp', 'java', 'js', 'ts', 'cs', 'php', 'rb', 'go', 'swift', 'kt', 'c', 'h', 'sh', 'bat', 'json', 'xml', 'yaml', 'yml', 'sql', 'css', 'scss', 'less'];
        const archiveExts = ['zip', 'rar', '7z', 'gz', 'bz2', 'tar'];
        let icon = 'link';
        let colorClass = 'file-icon-default';
        if (extension === 'pdf') {
            icon = 'file-pdf';
            colorClass = 'file-icon-document';
        } else if (extension === 'doc' || extension === 'docx') {
            icon = 'file-word';
            colorClass = 'file-icon-document';
        } else if (extension === 'xls' || extension === 'xlsx') {
            icon = 'file-excel';
            colorClass = 'file-icon-document';
        } else if (extension === 'ppt' || extension === 'pptx') {
            icon = 'file-powerpoint';
            colorClass = 'file-icon-document';
        } else if (['doc', 'docx', 'pdf', 'txt', 'odt', 'rtf', 'html', 'htm', 'xls', 'xlsx', 'ppt', 'pptx', 'odp', 'xmind'].includes(extension)) {
            icon = 'file-lines';
            colorClass = 'file-icon-document';
        } else if (imageExts.includes(extension)) {
            icon = 'file-image';
            colorClass = 'file-icon-image';
        } else if (audioExts.includes(extension)) {
            icon = 'file-audio';
            colorClass = 'file-icon-music';
        } else if (codeExts.includes(extension)) {
            icon = 'file-code';
            colorClass = 'file-icon-code';
        } else if (archiveExts.includes(extension)) {
            icon = 'file-zipper';
            colorClass = 'file-icon-archive';
        }
        return { html: xyIcon(icon), colorClass };
    }
    function toggleFailedContainer() {
        if (failedContainer.style.display === 'none') {
            failedContainer.style.display = 'block';
            failedToggleButton.textContent = '隐藏失败项 (' + (failedContainer.children.length - 1) + ')';
        } else {
            failedContainer.style.display = 'none';
            failedToggleButton.textContent = '显示失败项 (' + (failedContainer.children.length - 1) + ')';
        }
    }
    function updateFailedCount() {
        const count = failedContainer.children.length - 1;
        failedToggleButton.textContent = (failedContainer.style.display === 'none' ? '显示' : '隐藏') + '失败项 (' + count + ')';
        if (count > 0) {
            failedToggleButton.style.display = 'block';
            noErrorsMessage.style.display = 'none';
        } else {
            failedToggleButton.style.display = 'none';
            noErrorsMessage.style.display = 'block';
        }
    }
    function addFailedFileNotification(fileName) {
        const failedItem = document.createElement('div');
        failedItem.className = 'failed-file';
        failedItem.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            margin-bottom: 10px;
            background-color: #fff0f0;
            border-left: 4px solid #ff4d4d;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        `;
        const fileNameSpan = document.createElement('span');
        fileNameSpan.style.cssText = `
            color: #ff4d4d;
            font-weight: bold;
            margin-right: 10px;
        `;
        fileNameSpan.textContent = `❌ 添加失败: ${fileName}`;
        const retryButton = document.createElement('button');
        retryButton.className = 'retry-btn';
        retryButton.textContent = '重试';
        retryButton.style.cssText = `
            background-color: #ff9999;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            outline: none;
            box-shadow: 0 2px 4px rgba(255, 77, 77, 0.3);
        `;
        retryButton.onmouseover = () => {
            retryButton.style.backgroundColor = '#ff7777';
            retryButton.style.boxShadow = '0 4px 8px rgba(255, 77, 77, 0.5)';
        };
        retryButton.onmouseout = () => {
            retryButton.style.backgroundColor = '#ff9999';
            retryButton.style.boxShadow = '0 2px 4px rgba(255, 77, 77, 0.3)';
        };
        retryButton.onclick = () => {
            failedItem.style.opacity = '0';
            failedItem.style.transform = 'translateX(20px)';
            setTimeout(() => {
                failedItem.remove();
                const resource = Object.values(course_resources).find(r => r.name === fileName);
                updateFailedCount();
                if (failedContainer.children.length === 1) {
                    noErrorsMessage.style.display = 'block';
                }
            }, 300);
        };
        failedItem.appendChild(fileNameSpan);
        failedItem.appendChild(retryButton);
        failedContainer.appendChild(failedItem);
        updateFailedCount();
        setTimeout(() => {
            failedItem.style.opacity = '1';
            failedItem.style.transform = 'translateX(0)';
        }, 10);
    }
    noErrorsMessage.style.display = 'none';
    handleXhrResponse();
}
const PREVIEW_MODAL_CLASS = 'xiaoya-preview-modal';
const DRAG_HANDLE_CLASS = 'xiaoya-preview-drag-handle';
const CONTENT_WRAPPER_CLASS = 'xiaoya-preview-content-wrapper';
const CLOSE_BUTTON_CLASS = 'xiaoya-preview-close-button';
const INFO_BUTTON_CLASS = 'xiaoya-preview-info-button';
const CODE_PREVIEW_CLASS = 'xiaoya-code-preview';
const PREVIEW_BASE_URL = 'https://vip.ow365.cn/?i=29353&ssl=1&draw=1';
const SUPPORTED_DOCS = new Set(['pdf', 'txt', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'js', 'json', 'css', 'sql', 'xml', 'java', 'cs']);
const SUPPORTED_IMAGES = new Set(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico']);
const SUPPORTED_AUDIO = new Set(['mp3', 'wav', 'ogg']);
const SUPPORTED_ARCHIVES = new Set(['zip', 'rar', '7z']);
const SUPPORTED_CODE = new Set(['cpp', 'h', 'py', 'go', 'rs', 'md', 'php', 'rb', 'swift', 'kt', 'c', 'sh', 'bat', 'yaml', 'yml', 'scss', 'less', 'ts']);
const SUPPORTED_DOCS_FOR_INFO = new Set(['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx']);
function isSupportedForPreview(extension) {
    return SUPPORTED_DOCS.has(extension) ||
        SUPPORTED_IMAGES.has(extension) ||
        SUPPORTED_AUDIO.has(extension) ||
        SUPPORTED_ARCHIVES.has(extension) ||
        SUPPORTED_CODE.has(extension);
}
function createPreviewModalStructure(fileName) {
    const previewModal = document.createElement('div');
    previewModal.className = PREVIEW_MODAL_CLASS;
    previewModal.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background-color: rgba(255, 255, 255, 0.98); z-index: 10030; border-radius: 20px;
        box-shadow: 0 25px 50px rgba(0,0,0,0.25); width: 85%; height: 85%;
        overflow: hidden; opacity: 0; backdrop-filter: blur(15px);
        transition: opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        border: 1px solid rgba(255,255,255,0.18); display: flex; flex-direction: column;`;
    const dragHandle = document.createElement('div');
    dragHandle.className = DRAG_HANDLE_CLASS;
    dragHandle.style.cssText = `
        width: 100%; height: 40px; flex-shrink: 0;
        background: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
        background-size: 200% 100%; animation: shimmer 1.5s infinite; cursor: move;
        border-top-left-radius: 20px; border-top-right-radius: 20px;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: relative; overflow: hidden;`;
    if (!document.getElementById('xiaoya-shimmer-style')) {
        const style = document.createElement('style');
        style.id = 'xiaoya-shimmer-style';
        style.textContent = `
            @keyframes shimmer { 0% {background-position: 200% 0;} 100% {background-position: -200% 0;} }
            .${CODE_PREVIEW_CLASS} { background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 5px; padding: 15px; font-family: monospace; white-space: pre-wrap; word-wrap: break-word; max-height: 100%; overflow: auto; }
            .${CODE_PREVIEW_CLASS} code { display: block; }
        `;
        document.head.appendChild(style);
    }
    const dragIndicator = document.createElement('div');
    dragIndicator.style.cssText = `
        width: 50px; height: 5px; background-color: rgba(0,0,0,0.2); border-radius: 2.5px;
        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);`;
    dragHandle.appendChild(dragIndicator);
    const textLabel = document.createElement('span');
    textLabel.textContent = `预览: ${fileName}`;
    textLabel.style.cssText = `
        font-weight: bold; font-size: 14px; color: #555; position: absolute;
        left: 15px; top: 50%; transform: translateY(-50%); opacity: 0.7;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: calc(100% - 100px);`;
    dragHandle.appendChild(textLabel);
    const closeButton = document.createElement('button');
    closeButton.className = CLOSE_BUTTON_CLASS;
    closeButton.innerHTML = xyIcon('xmark');
    closeButton.style.cssText = `
        position: absolute; top: 5px; right: 5px; background-color: #FFA500; color: white;
        border: none; border-radius: 50%; width: 30px; height: 30px; display: flex;
        align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease;
        font-size: 16px; z-index: 1001; box-shadow: 0 2px 4px rgba(255, 165, 0, 0.3);`;
    closeButton.onmouseover = () => { closeButton.style.backgroundColor = '#FFB732'; };
    closeButton.onmouseout = () => { closeButton.style.backgroundColor = '#FFA500'; };
    closeButton.onclick = () => {
        previewModal.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(previewModal)) {
                document.body.removeChild(previewModal);
            }
        }, 400);
    };
    dragHandle.appendChild(closeButton);
    const contentWrapper = document.createElement('div');
    contentWrapper.className = CONTENT_WRAPPER_CLASS;
    contentWrapper.style.cssText = `
        width: 100%; flex-grow: 1; display: flex; justify-content: center;
        align-items: center; padding: 20px; box-sizing: border-box; overflow: auto;`;
    previewModal.appendChild(dragHandle);
    previewModal.appendChild(contentWrapper);
    return { previewModal, contentWrapper, dragHandle };
}
function setupDragHandling(modal, handle) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    const onMouseMove = (e) => {
        if (!isDragging) return;
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        if (clientX === undefined || clientY === undefined) return;
        let dx = clientX - startX;
        let dy = clientY - startY;
        requestAnimationFrame(() => {
            let newLeft = startLeft + dx;
            let newTop = startTop + dy;
            modal.style.left = `${newLeft}px`;
            modal.style.top = `${newTop}px`;
        });
    };
    const onTouchMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        onMouseMove(e);
    };
    const onMouseUp = () => {
        if (!isDragging) return;
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onMouseUp);
        modal.style.cursor = 'default';
    };
    const onMouseDown = (e) => {
        isDragging = true;
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        startX = clientX;
        startY = clientY;
        startLeft = modal.offsetLeft;
        startTop = modal.offsetTop;
        modal.style.cursor = 'grabbing';
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };
    const onTouchStart = (e) => {
        isDragging = true;
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        startX = clientX;
        startY = clientY;
        startLeft = modal.offsetLeft;
        startTop = modal.offsetTop;
        modal.style.cursor = 'grabbing';
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onMouseUp);
    };
    handle.addEventListener('mousedown', onMouseDown);
    handle.addEventListener('touchstart', onTouchStart, { passive: true });
}
async function fetchAndDisplayCode(fileUrl, codeElement) {
    try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const codeText = await response.text();
        codeElement.textContent = codeText;
    } catch (error) {
        console.error('获取代码文件失败:', error);
        codeElement.textContent = '加载代码失败。';
        showNotification('加载代码文件失败', 'error');
    }
}
function createContentElement(extension, fileUrl, contentWrapper, previewModal) {
    let element;
    if (SUPPORTED_CODE.has(extension)) {
        element = document.createElement('pre');
        element.className = CODE_PREVIEW_CLASS;
        const codeElement = document.createElement('code');
        element.appendChild(codeElement);
        codeElement.textContent = '正在加载代码...';
        fetchAndDisplayCode(fileUrl, codeElement);
        contentWrapper.appendChild(element);
    } else if (SUPPORTED_DOCS.has(extension) || SUPPORTED_ARCHIVES.has(extension)) {
        const previewUrl = `${PREVIEW_BASE_URL}&furl=${encodeURIComponent(fileUrl)}`;
        element = document.createElement('iframe');
        element.src = previewUrl;
        element.style.cssText = `width: 100%; height: 100%; border: none; border-radius: 0 0 15px 15px; box-shadow: 0 15px 30px rgba(0,0,0,0.15);`;
        contentWrapper.appendChild(element);
        if (SUPPORTED_DOCS_FOR_INFO.has(extension)) {
            setupInfoButton(previewModal, contentWrapper, element, fileUrl);
        }
    } else if (SUPPORTED_IMAGES.has(extension)) {
        element = document.createElement('img');
        element.src = fileUrl;
        element.style.cssText = `max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 15px; box-shadow: 0 15px 30px rgba(0,0,0,0.15); transition: transform 0.3s ease;`;
        element.onmouseover = () => { element.style.transform = 'scale(1.02)'; };
        element.onmouseout = () => { element.style.transform = 'scale(1)'; };
        contentWrapper.appendChild(element);
    } else if (SUPPORTED_AUDIO.has(extension)) {
        element = document.createElement('audio');
        element.controls = true;
        element.src = fileUrl;
        element.style.cssText = `width: 80%; max-width: 500px; box-shadow: 0 15px 30px rgba(0,0,0,0.15); border-radius: 30px;`;
        contentWrapper.appendChild(element);
    }
}
function setupInfoButton(modal, wrapper, iframe, fileUrl) {
    let isShowingInfo = false;
    let infoContent = null;
    const infoButton = document.createElement('button');
    infoButton.className = INFO_BUTTON_CLASS;
    infoButton.title = '查看文件信息';
    infoButton.innerHTML = xyIcon('circle-info', 'switch-icon');
    infoButton.style.cssText = `
        position: absolute; bottom: 20px; left: 20px; background-color: #FFA500; color: white;
        border: none; border-radius: 50%; width: 56px; height: 56px; cursor: pointer;
        transition: all 0.3s ease; z-index: 1001; display: flex; align-items: center;
        justify-content: center; font-size: 24px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);`;
    if (!document.getElementById('xiaoya-rotate-style')) {
        const style = document.createElement('style');
        style.id = 'xiaoya-rotate-style';
        style.textContent = `@keyframes rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } .rotating { animation: rotate 2s linear infinite; } .switch-icon { transition: transform 0.3s ease; }`;
        document.head.appendChild(style);
    }
    infoButton.onmouseover = () => { infoButton.style.backgroundColor = '#FFB732'; infoButton.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)'; };
    infoButton.onmouseout = () => { if (!infoButton.classList.contains('rotating')) { infoButton.style.backgroundColor = '#FFA500'; infoButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'; } };
    const resetButton = () => { infoButton.classList.remove('rotating'); infoButton.style.pointerEvents = 'auto'; };
    const toggleInfoDisplay = () => { iframe.style.display = 'none'; infoContent.style.display = 'block'; isShowingInfo = true; infoButton.title = '返回文件预览'; };
    infoButton.onclick = () => {
        if (isShowingInfo) {
            iframe.style.display = 'block';
            if (infoContent) infoContent.style.display = 'none';
            isShowingInfo = false;
            infoButton.title = '查看文件信息';
        } else {
            if (infoContent === null) {
                infoButton.classList.add('rotating');
                infoButton.style.pointerEvents = 'none';
                const infoUrl = `${PREVIEW_BASE_URL}&info=0&furl=${encodeURIComponent(fileUrl)}`;
                fetch(infoUrl)
                    .then(response => {
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                        return response.json();
                    })
                    .then(data => {
                        infoContent = createInfoContent(data);
                        if (infoContent) {
                            wrapper.appendChild(infoContent);
                            toggleInfoDisplay();
                        } else {
                            showNotification('无法创建文件信息视图。', 'error');
                        }
                        resetButton();
                    })
                    .catch(error => {
                        console.error('获取文档信息失败:', error);
                        showNotification('获取文档信息失败，请稍后重试。', 'error');
                        resetButton();
                    });
            } else {
                toggleInfoDisplay();
            }
        }
    };
    modal.appendChild(infoButton);
}
function previewFile(fileName, fileUrl) {
    const extension = fileName.split('.').pop().toLowerCase();
    if (!isSupportedForPreview(extension)) {
        showNotification('该类型文件不支持预览╯︿╰', 'warning');
        return;
    }
    const existingModal = document.querySelector(`.${PREVIEW_MODAL_CLASS}`);
    if (existingModal) {
        existingModal.remove();
    }
    const { previewModal, contentWrapper, dragHandle } = createPreviewModalStructure(fileName);
    setupDragHandling(previewModal, dragHandle);
    createContentElement(extension, fileUrl, contentWrapper, previewModal);
    document.body.appendChild(previewModal);
    requestAnimationFrame(() => {
        previewModal.style.opacity = '1';
    });
}
function createInfoContent(data) {
    let infoDiv = document.createElement('div');
    infoDiv.style.cssText = `
        width: 100%;
        height: 100%;
        overflow-y: auto;
        padding: 20px;
        box-sizing: border-box;
        background-color: #f0f4f8;
        display: none;
    `;
    const getIconForFileType = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        const icons = {
            pdf: xyIcon('file-pdf'), doc: xyIcon('file-word'), docx: xyIcon('file-word'), xls: xyIcon('file-excel'), xlsx: xyIcon('file-excel'), ppt: xyIcon('file-powerpoint'), pptx: xyIcon('file-powerpoint'),
            default: xyIcon('file')
        };
        return icons[extension] || icons.default;
    };
    const fileIcon = getIconForFileType(data.FileName);
    const { formattedContent, characterCount } = formatTextContent(data.Text);
    let contentHtml = `
        <div class="file-header">
            <div class="file-icon">${fileIcon}</div>
            <h1>${data.FileName}</h1>
        </div>
        <div class="info-grid">
            <div class="info-item">
                <span class="icon">${xyIcon('ruler')}</span>
                <span class="label">文件大小:</span>
                <span class="value">${formatFileSize(data.FileSize)}</span>
            </div>
            <div class="info-item">
                <span class="icon">${xyIcon('clock')}</span>
                <span class="label">创建时间:</span>
                <span class="value">${formatDate(data.CreateTime)}</span>
            </div>
            <div class="info-item">
                <span class="icon">${xyIcon('arrows-rotate')}</span>
                <span class="label">修改时间:</span>
                <span class="value">${formatDate(data.LastTime)}</span>
            </div>
        </div>
    `;
    if (data.PageCount !== undefined) {
        contentHtml += `
        <div class="info-grid">
            <div class="info-item">
                <span class="icon">${xyIcon('book-open')}</span>
                <span class="label">页数:</span>
                <span class="value">${data.PageCount}</span>
            </div>
            <div class="info-item">
                <span class="icon">${xyIcon('font')}</span>
                <span class="label">字数:</span>
                <span class="value">${characterCount}</span>
            </div>
        </div>
        <h2 class="section-title">${xyIcon('file-lines')} 文本内容提取</h2>
        <div class="search-container">
            <div class="search-box">
                <input type="text" id="searchInput" placeholder=" " />
                <label for="searchInput">${xyIcon('magnifying-glass')} 搜索文本...</label>
                <span class="search-border"></span>
            </div>
            <div class="search-buttons">
                <button id="prevButton" disabled>${xyIcon('arrow-up')} 上一个</button>
                <button id="nextButton" disabled>${xyIcon('arrow-down')} 下一个</button>
                <button id="searchButton">搜索</button>
            </div>
        </div>
        <div class="text-content" id="textContent">${formattedContent}</div>
    `;
    } else if (data.SlideCount !== undefined) {
        contentHtml += `
        <div class="info-grid">
            <div class="info-item">
                <span class="icon">${xyIcon('film')}</span>
                <span class="label">幻灯片数:</span>
                <span class="value">${data.SlideCount}</span>
            </div>
            <div class="info-item">
                <span class="icon">${xyIcon('ruler-combined')}</span>
                <span class="label">尺寸:</span>
                <span class="value">${data.Width} x ${data.Height}</span>
            </div>
            <div class="info-item">
                <span class="icon">${xyIcon('square')}</span>
                <span class="label">比例:</span>
                <span class="value">${data.Ratio}</span>
            </div>
        </div>
        <h2 class="section-title">${xyIcon('display')} 幻灯片标题</h2>
        <ul class="slide-names">
            ${data.SlideNames.split(';').map(name => `<li>${name.trim()}</li>`).join('')}
        </ul>
    `;
    } else if (data.SheetCount !== undefined) {
        contentHtml += `
        <div class="info-grid">
            <div class="info-item">
                <span class="icon">${xyIcon('table-cells')}</span>
                <span class="label">工作表数:</span>
                <span class="value">${data.SheetCount}</span>
            </div>
        </div>
        <h2 class="section-title">${xyIcon('table-list')} 工作表名称</h2>
        <ul class="sheet-names">
            ${data.SheetNames.split(';').map(name => `<li>${name.trim()}</li>`).join('')}
        </ul>
    `;
    }
    infoDiv.innerHTML = contentHtml;
    if (data.PageCount !== undefined) {
        const searchInput = infoDiv.querySelector('#searchInput');
        const searchButton = infoDiv.querySelector('#searchButton');
        const prevButton = infoDiv.querySelector('#prevButton');
        const nextButton = infoDiv.querySelector('#nextButton');
        const textContentDiv = infoDiv.querySelector('#textContent');
        let currentMatchIndex = -1;
        let matches = [];
        function highlightText(searchTerm) {
            const innerHTML = textContentDiv.innerHTML.replace(/<span class="highlight current">(.*?)<\/span>/gi, '$1')
                .replace(/<span class="highlight">(.*?)<\/span>/gi, '$1');
            textContentDiv.innerHTML = innerHTML;
            if (!searchTerm) {
                matches = [];
                currentMatchIndex = -1;
                prevButton.disabled = true;
                nextButton.disabled = true;
                return;
            }
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            let matchCount = 0;
            const replacer = (match) => {
                matchCount++;
                return `<span class="highlight">${match}</span>`;
            };
            textContentDiv.innerHTML = innerHTML.replace(regex, replacer);
            matches = textContentDiv.querySelectorAll('.highlight');
            if (matches.length > 0) {
                currentMatchIndex = 0;
                updateCurrentMatch();
                prevButton.disabled = false;
                nextButton.disabled = false;
            } else {
                currentMatchIndex = -1;
                prevButton.disabled = true;
                nextButton.disabled = true;
            }
        }
        function updateCurrentMatch() {
            matches.forEach((match) => match.classList.remove('current'));
            if (currentMatchIndex >= 0 && currentMatchIndex < matches.length) {
                const currentMatch = matches[currentMatchIndex];
                currentMatch.classList.add('current');
                currentMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            highlightText(searchTerm);
        });
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.trim();
                highlightText(searchTerm);
            }
        });
        nextButton.addEventListener('click', () => {
            if (matches.length > 0) {
                currentMatchIndex = (currentMatchIndex + 1) % matches.length;
                updateCurrentMatch();
            }
        });
        prevButton.addEventListener('click', () => {
            if (matches.length > 0) {
                currentMatchIndex = (currentMatchIndex - 1 + matches.length) % matches.length;
                updateCurrentMatch();
            }
        });
    }
    const style = document.createElement('style');
    style.textContent = `
        * {
            box-sizing: border-box;
        }
        body {
            line-height: 1.6;
            color: #333;
            background-color: #f0f4f8;
        }
        .file-header {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .file-icon {
            font-size: 48px;
            margin-right: 20px;
        }
        h1 {
            font-size: 24px;
            color: #2c3e50;
            margin: 0;
        }
        h2.section-title {
            font-size: 20px;
            color: #34495e;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
            margin-top: 40px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .info-item {
            background-color: #fff;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
        }
        .info-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        .info-item .icon {
            font-size: 24px;
            margin-bottom: 10px;
        }
        .info-item .label {
            font-weight: bold;
            color: #7f8c8d;
            margin-bottom: 5px;
        }
        .info-item .value {
            color: #2c3e50;
            font-size: 18px;
        }
        .text-content {
            background-color: #fff;
            padding: 25px;
            border-radius: 8px;
            margin-top: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            max-height: 500px;
            overflow-y: auto;
            font-size: 16px;
            line-height: 1.8;
            color: #34495e;
            border-left: 4px solid #3498db;
        }
        .text-content h3 {
            font-size: 20px;
            color: #2c3e50;
            margin-top: 20px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ecf0f1;
            padding-bottom: 5px;
        }
        .text-content p {
            margin-bottom: 15px;
        }
        .text-content ul {
            padding-left: 20px;
            margin-bottom: 15px;
        }
        .text-content li {
            margin-bottom: 5px;
        }
        .text-content strong {
            color: #2c3e50;
            font-weight: 700;
        }
        .text-content::-webkit-scrollbar {
            width: 8px;
        }
        .text-content::-webkit-scrollbar-thumb {
            background-color: #bdc3c7;
            border-radius: 4px;
        }
        .text-content::-webkit-scrollbar-track {
            background-color: #ecf0f1;
        }
        .slide-names, .sheet-names {
            list-style-type: none;
            padding-left: 0;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .slide-names li, .sheet-names li {
            margin-bottom: 10px;
            color: #3498db;
            font-size: 16px;
            transition: all 0.2s ease;
            padding: 10px;
            border-radius: 4px;
            background-color: #f7f9fc;
        }
        .slide-names li:hover, .sheet-names li:hover {
            color: #2980b9;
            transform: translateX(5px);
            background-color: #e8f0fe;
        }
        .search-container {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 10px;
        }
        .search-box {
            position: relative;
            flex: 1;
            min-width: 250px;
        }
        .search-box input[type="text"] {
            width: 100%;
            padding: 15px 20px;
            font-size: 16px;
            color: #2c3e50;
            border: none;
            border-bottom: 2px solid #ccc;
            background: transparent;
            outline: none;
            transition: border-color 0.3s;
        }
        .search-box input[type="text"]::placeholder {
            color: transparent;
        }
        .search-box label {
            position: absolute;
            top: 50%;
            left: 20px;
            transform: translateY(-50%);
            color: #aaa;
            font-size: 16px;
            pointer-events: none;
            transition: all 0.3s;
        }
        .search-box input[type="text"]:focus + label,
        .search-box input[type="text"]:not(:placeholder-shown) + label {
            top: 5px;
            transform: translateY(-100%);
            font-size: 12px;
            color: #3498db;
        }
        .search-box .search-border {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0%;
            height: 2px;
            background-color: #3498db;
            transition: width 0.3s;
        }
        .search-box input[type="text"]:focus ~ .search-border {
            width: 100%;
        }
        .search-buttons {
            display: flex;
            gap: 10px;
        }
        .search-buttons button {
            padding: 12px 15px;
            font-size: 16px;
            background: linear-gradient(135deg, #6dd5ed, #2193b0);
            color: #fff;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            outline: none;
        }
        .search-buttons button:disabled {
            background: #bdc3c7;
            cursor: not-allowed;
            box-shadow: none;
        }
        .search-buttons button:not(:disabled):hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }
        .highlight {
            background-color: #ffeb3b;
            padding: 2px 0;
            transition: background-color 0.3s;
        }
        .highlight.current {
            background-color: #ffc107;
        }
    `;
    infoDiv.appendChild(style);
    return infoDiv;
}
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
    else return (bytes / 1073741824).toFixed(2) + ' GB';
}
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}
function formatTextContent(text) {
    if (typeof text !== 'string') {
        console.error('Invalid text input:', text);
        return {
            formattedContent: '',
            characterCount: 0,
        };
    }
    text = text
        .replace(/\u0007/g, '\n')
        .replace(/\f/g, '\n')
        .replace(/\r/g, '\n')
        .trim();
    const characterCount = text.length;
    const lines = text.split(/\n+/).map((line) => line.trim()).filter((line) => line);
    let formattedContent = '';
    let inList = false;
    lines.forEach((line) => {
        if (line.match(/^[一二三四五六七八九十]+[、\.．]/)) {
            if (inList) {
                formattedContent += '</ul>';
                inList = false;
            }
            formattedContent += `<h2>${line}</h2>`;
        }
        else if (line.match(/^\d+[\.\、\.．]/)) {
            if (inList) {
                formattedContent += '</ul>';
                inList = false;
            }
            formattedContent += `<h3>${line}</h3>`;
        }
        else if (line.match(/^[①②③④⑤⑥⑦⑧⑨⑩]/)) {
            if (!inList) {
                formattedContent += '<ul>';
                inList = true;
            }
            formattedContent += `<li>${line}</li>`;
        }
        else if (line.match(/^[•⚫-]/)) {
            if (!inList) {
                formattedContent += '<ul>';
                inList = true;
            }
            formattedContent += `<li>${line.replace(/^[•⚫-]\s*/, '')}</li>`;
        }
        else {
            if (inList) {
                formattedContent += '</ul>';
                inList = false;
            }
            formattedContent += `<p>${line}</p>`;
        }
    });
    if (inList) {
        formattedContent += '</ul>';
        inList = false;
    }
    return {
        formattedContent,
        characterCount,
    };
}
let downloadsContainer = document.getElementById('downloadsContainer');
let wrapperContainer = document.getElementById('downloadsWrapperContainer');
let totalProgressBar;
let totalProgressText;
let totalDownloads = 0;
let completedDownloads = 0;
if (!wrapperContainer) {
    wrapperContainer = document.createElement('div');
    wrapperContainer.id = 'downloadsWrapperContainer';
    Object.assign(wrapperContainer.style, {
        position: 'fixed',
        bottom: '150px',
        left: '10px',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        overflow: 'visible',
        transition: 'transform 0.3s ease-in-out',
        transform: 'none'
    });
    downloadsContainer = document.createElement('div');
    downloadsContainer.id = 'downloadsContainer';
    Object.assign(downloadsContainer.style, {
        position: 'relative',
        bottom: 'auto',
        left: 'auto',
        right: 'auto',
        zIndex: '9999',
        backgroundColor: '#FFF3E0',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        padding: '30px',
        width: 'auto',
        minWidth: '600px',
        boxSizing: 'border-box',
        margin: '0 auto',
        border: '1px solid #FFD180',
        transition: 'transform 0.3s ease-in-out',
        maxHeight: '190px',
        overflowY: 'auto',
        overflowX: 'hidden',
    });
    wrapperContainer.appendChild(downloadsContainer);
    totalProgressBar = document.createElement('div');
    totalProgressBar.id = 'totalProgressBar';
    Object.assign(totalProgressBar.style, {
        width: '100%',
        height: '10px',
        backgroundColor: '#E0E0E0',
        borderRadius: '5px',
        overflow: 'hidden',
        marginBottom: '10px'
    });
    let totalProgressInner = document.createElement('div');
    Object.assign(totalProgressInner.style, {
        width: '0%',
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: '5px',
        transition: 'width 0.3s'
    });
    totalProgressBar.appendChild(totalProgressInner);
    totalProgressText = document.createElement('div');
    totalProgressText.id = 'totalProgressText';
    Object.assign(totalProgressText.style, {
        textAlign: 'center',
        marginBottom: '10px',
        fontWeight: 'bold',
        color: '#4CAF50'
    });
    totalProgressText.textContent = '总进度: 0%';
    downloadsContainer.appendChild(totalProgressText);
    downloadsContainer.appendChild(totalProgressBar);
}
function addDownloadsContainer() {
    document.body.appendChild(wrapperContainer);
}
function updateIndicator() {
    let indicator = document.getElementById('progressIndicator');
    let progressBarCount = downloadsContainer.querySelectorAll('.progressBar').length;
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'progressIndicator';
        Object.assign(indicator.style, {
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: '10000',
            backgroundColor: '#f00',
            backgroundImage: 'linear-gradient(to bottom right, #ffcc80, #ff8c00)',
            color: 'white',
            textShadow: '0px 1px 2px rgba(0, 0, 0, 0.7)',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)',
            transition: 'background-color 0.3s, box-shadow 0.3s'
        });
        wrapperContainer.appendChild(indicator);
    }
    indicator.textContent = progressBarCount;
    indicator.style.display = progressBarCount > 0 ? 'flex' : 'none';
    const transferBadge = document.getElementById('xy-transfer-badge');
    if (transferBadge) {
        transferBadge.textContent = String(progressBarCount);
        transferBadge.hidden = progressBarCount === 0;
    }
}
function updateDownloadsContainerVisibility() {
    const nonEmptyNodes = Array.from(downloadsContainer.children).filter(child =>
        !child.classList.contains('slide-out') &&
        child.tagName !== 'P' &&
        child.id !== 'progressIndicator' &&
        child.id !== 'totalProgressBar' &&
        child.id !== 'totalProgressText'
    );
    if (nonEmptyNodes.length === 0) {
        if (!downloadsContainer.querySelector('p')) {
            let emptyText = document.createElement('p');
            emptyText.innerHTML = `
                暂无下载内容 ᓚᘏᗢ<br>
                <span style="font-size: 10px;">(在「课件」页添加任务吧~)</span>
            `;
            Object.assign(emptyText.style, {
                color: '#FF9800',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                padding: '20px',
                marginTop: '15px',
                borderRadius: '8px',
                opacity: '0',
                transition: 'opacity 1s ease-in-out, transform 1s',
                transform: 'translateY(-20px)',
                top: '50%'
            });
            setTimeout(() => {
                emptyText.style.opacity = '1';
                emptyText.style.transform = 'translateY(0)';
            }, 100);
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
        wrapperContainer.style.display = isProgressBarVisible ? 'flex' : 'none';
        if (totalProgressBar) totalProgressBar.style.display = 'none';
        if (totalProgressText) totalProgressText.style.display = 'none';
    } else {
        let emptyText = downloadsContainer.querySelector('p');
        if (emptyText) {
            downloadsContainer.removeChild(emptyText);
        }
        if (totalProgressBar) totalProgressBar.style.display = 'block';
        if (totalProgressText) totalProgressText.style.display = 'block';
    }
    updateTotalProgress();
}
function updateTotalProgress() {
    if (totalDownloads === 0) {
        totalProgressBar.classList.add('hidden');
        totalProgressText.classList.add('hidden');
        setTimeout(() => {
            totalProgressBar.style.display = 'none';
            totalProgressText.style.display = 'none';
            totalProgressBar.classList.remove('hidden');
            totalProgressText.classList.remove('hidden');
        }, 500);
        return;
    }
    if (totalProgressBar.style.display === 'none') {
        totalProgressBar.style.display = 'block';
        totalProgressText.style.display = 'block';
        totalProgressBar.offsetHeight;
        totalProgressText.offsetHeight;
        totalProgressBar.classList.add('visible');
        totalProgressText.classList.add('visible');
    }
    if (completedDownloads === 0) {
        const progressInner = totalProgressBar.firstChild;
        progressInner.style.width = '0%';
        progressInner.style.backgroundColor = 'hsl(0, 100%, 35%)';
        totalProgressText.style.color = 'hsl(0, 100%, 35%)';
        totalProgressText.textContent = `总进度: 0.00% (0/${totalDownloads})`;
        return;
    }
    const progressPercentage = (completedDownloads / totalDownloads) * 100;
    const nextProgressPoint = ((completedDownloads + 0.5) / totalDownloads) * 100;
    const progressInner = totalProgressBar.firstChild;
    const startProgress = parseFloat(progressInner.style.width) || 0;
    const duration = 500;
    const startTime = performance.now();
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        let currentProgress;
        if (completedDownloads < totalDownloads) {
            currentProgress = startProgress + (nextProgressPoint - startProgress) * easeProgress;
        } else {
            currentProgress = startProgress + (progressPercentage - startProgress) * easeProgress;
        }
        progressInner.style.width = `${currentProgress}%`;
        const hue = Math.floor(120 * (currentProgress / 100));
        const color = `hsl(${hue}, 100%, 35%)`;
        progressInner.style.backgroundColor = color;
        totalProgressText.style.color = color;
        totalProgressText.textContent = `总进度: ${currentProgress.toFixed(2)}% (${completedDownloads}/${totalDownloads})`;
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else if (progressPercentage === 100) {
            progressInner.style.backgroundColor = '#4CAF50';
            totalProgressText.style.color = '#4CAF50';
            setTimeout(() => {
                totalProgressBar.classList.add('hidden');
                totalProgressText.classList.add('hidden');
                setTimeout(() => {
                    totalProgressBar.style.display = 'none';
                    totalProgressText.style.display = 'none';
                    totalProgressBar.classList.remove('hidden', 'visible');
                    totalProgressText.classList.remove('hidden', 'visible');
                    totalDownloads = 0;
                    completedDownloads = 0;
                }, 500);
            }, 1500);
        }
    }
    requestAnimationFrame(animate);
}
if (!document.getElementById('total-progress-styles')) {
    const style = document.createElement('style');
    style.id = 'total-progress-styles';
    style.textContent = `
        #totalProgressBar, #totalProgressText {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
        #totalProgressBar.visible, #totalProgressText.visible {
            opacity: 1;
            transform: translateY(0);
        }
        #totalProgressBar.hidden, #totalProgressText.hidden {
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.5s ease-in, transform 0.5s ease-in;
        }
        #totalProgressBar > div {
            transition: width 0.5s ease-in-out, background-color 0.5s ease-in-out;
            background-image: linear-gradient(
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
            animation: progress-bar-stripes 1s linear infinite;
        }
        @keyframes progress-bar-stripes {
            from { background-position: 40px 0; }
            to { background-position: 0 0; }
        }
    `;
    document.head.appendChild(style);
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
        const progressText = document.createElement('span');
        const progressBar = document.createElement('div');
        const progressBarContainer = document.createElement('div');
        const progressContainer = document.createElement('div');
        const progressPercentText = document.createElement('span');
        const speedAndTimeContainer = document.createElement('div');
        const speedText = document.createElement('span');
        const remainingTimeText = document.createElement('span');
        const styles = {
            progressText: {
                color: '#FF9800',
                fontWeight: 'bold',
                fontSize: '16px',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
                padding: '5px 0',
                borderRadius: '4px'
            },
            progressBar: {
                height: '18px',
                width: '0%',
                borderRadius: '8px',
                className: 'progressBar'
            },
            progressBarContainer: {
                background: '#E0E0E0',
                borderRadius: '8px',
                height: '18px',
                width: '100%',
                overflow: 'hidden',
                position: 'relative'
            },
            progressContainer: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around'
            },
            progressPercentText: {
                fontSize: '16px',
                marginLeft: '10px',
                position: 'absolute',
                left: '0',
                top: '0',
                width: '100%',
                textAlign: 'center',
                lineHeight: '18px',
                zIndex: '1',
                fontWeight: 'bold'
            },
            speedAndTimeContainer: {
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: '5px'
            },
            speedText: {
                fontSize: '14px',
                color: '#4CAF50',
                fontWeight: 'bold'
            },
            remainingTimeText: {
                fontSize: '14px',
                color: '#4CAF50',
                fontWeight: 'bold'
            }
        };
        Object.assign(progressText.style, styles.progressText);
        Object.assign(progressBar.style, styles.progressBar);
        Object.assign(progressBarContainer.style, styles.progressBarContainer);
        Object.assign(progressContainer.style, styles.progressContainer);
        Object.assign(progressPercentText.style, styles.progressPercentText);
        Object.assign(speedAndTimeContainer.style, styles.speedAndTimeContainer);
        Object.assign(speedText.style, styles.speedText);
        Object.assign(remainingTimeText.style, styles.remainingTimeText);
        progressText.innerText = `正在下载: ${file_name}`;
        progressBar.className = 'progressBar';
        speedText.innerText = '速度: 0 B/s';
        remainingTimeText.innerText = '剩余时间: 计算中...';
        progressBarContainer.appendChild(progressBar);
        progressContainer.appendChild(progressText);
        progressContainer.appendChild(progressBarContainer);
        progressBarContainer.appendChild(progressPercentText);
        speedAndTimeContainer.appendChild(speedText);
        speedAndTimeContainer.appendChild(remainingTimeText);
        progressContainer.appendChild(speedAndTimeContainer);
        progressContainer.classList.add('slide-in');
        downloadsContainer.appendChild(progressContainer);
        updateIndicator();
        updateDownloadsContainerVisibility();
        window.AbortController = window.AbortController || {};
        window.AbortController[file_name] = controller;
        const controlContainer = document.createElement('div');
        const fileSizeSpan = document.createElement('span');
        const stopButton = document.createElement('button');
        Object.assign(controlContainer.style, {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
        });
        Object.assign(fileSizeSpan.style, {
            fontSize: '14px',
            marginRight: 'auto',
            fontWeight: 'bold'
        });
        Object.assign(stopButton.style, {
            padding: '5px 10px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: '#FF4136',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.3s ease',
            marginTop: '10px'
        });
        stopButton.textContent = '停止';
        stopButton.onclick = () => {
            console.log(`尝试停止下载: ${file_name}`);
            controller.abort();
            progressContainer.classList.add('slide-out');
            progressContainer.addEventListener('animationend', () => {
                progressContainer.remove();
                completedDownloads++;
                updateIndicator();
                updateDownloadsContainerVisibility();
                if (completedDownloads >= totalDownloads) {
                    setTimeout(() => {
                        totalProgressBar.classList.add('hidden');
                        totalProgressText.classList.add('hidden');
                        setTimeout(() => {
                            totalProgressBar.style.display = 'none';
                            totalProgressText.style.display = 'none';
                            totalProgressBar.classList.remove('hidden', 'visible');
                            totalProgressText.classList.remove('hidden', 'visible');
                            totalDownloads = 0;
                            completedDownloads = 0;
                        }, 500);
                    }, 1500);
                }
            }, { once: true });
        };
        controlContainer.appendChild(fileSizeSpan);
        controlContainer.appendChild(stopButton);
        progressContainer.appendChild(controlContainer);
        addProgressBarStyles();
        updateIndicator();
        updateDownloadsContainerVisibility();
        saveDownloadHistory(file_name, file_url);
        if (useThirdPartyDownload) {
            handleThirdPartyDownload(file_url, file_name, progressBar, progressPercentText, progressContainer, () => {
                completedDownloads++;
                updateTotalProgress();
                resolve();
            });
        } else {
            handleFetchDownload(file_url, token, signal, fileSizeSpan, progressBar, progressPercentText,
                speedText, remainingTimeText, progressContainer, file_name, () => {
                    completedDownloads++;
                    updateTotalProgress();
                    resolve();
                }, reject);
        }
    });
}
function addProgressBarStyles() {
    if (!document.getElementById('progress-bar-styles')) {
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
                animation: progressSlideIn 0.5s ease-out forwards;
            }
            .slide-out {
                animation: progressSlideOut 0.5s ease-in forwards;
            }
            @keyframes progressSlideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes progressSlideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(styles);
    }
}
function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}
function handleThirdPartyDownload(file_url, file_name, progressBar, progressPercentText, progressContainer, resolve) {
    const downloadLink = document.createElement('a');
    downloadLink.href = file_url;
    downloadLink.download = file_name;
    downloadLink.setAttribute('data-downloadurl', `application/octet-stream:${file_name}:${file_url}`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
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
                resolve();
            }, { once: true });
        }
    }, 200);
}
function handleFetchDownload(file_url, token, signal, fileSizeSpan, progressBar, progressPercentText, speedText, remainingTimeText, progressContainer, file_name, resolve, reject) {
    let startTime = Date.now();
    let lastUpdateTime = startTime;
    let lastReceivedBytes = 0;
    fetch(file_url, {
        signal,
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            const contentLength = response.headers.get('Content-Length');
            if (contentLength) {
                const fileSize = bytesToSize(contentLength);
                fileSizeSpan.innerText = `文件大小: ${fileSize}`;
            } else {
                fileSizeSpan.innerText = `无法获取文件大小`;
                updateIndicator();
                updateDownloadsContainerVisibility();
            }
            const reader = response.body.getReader();
            let receivedBytes = 0;
            let chunks = [];
            function processResult(result) {
                if (result.done) {
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
                        updateIndicator();
                        updateDownloadsContainerVisibility();
                        resolve();
                    }, { once: true });
                    return;
                }
                chunks.push(result.value);
                receivedBytes += result.value.length;
                let percentComplete = (receivedBytes / contentLength) * 100;
                progressBar.style.width = `${percentComplete.toFixed(2)}%`;
                progressPercentText.innerText = `${percentComplete.toFixed(2)}%`;
                const currentTime = Date.now();
                const timeDiff = (currentTime - lastUpdateTime) / 1000;
                if (timeDiff >= 1) {
                    const bytesPerSecond = (receivedBytes - lastReceivedBytes) / timeDiff;
                    const speed = bytesToSize(bytesPerSecond) + '/s';
                    speedText.innerText = `速度: ${speed}`;
                    const remainingBytes = contentLength - receivedBytes;
                    const remainingTime = remainingBytes / bytesPerSecond;
                    const remainingTimeFormatted = formatTime(remainingTime);
                    remainingTimeText.innerText = `剩余: ${remainingTimeFormatted}`;
                    lastUpdateTime = currentTime;
                    lastReceivedBytes = receivedBytes;
                }
                reader.read().then(processResult);
            }
            reader.read().then(processResult);
        })
        .catch(e => {
            progressContainer.remove();
            updateIndicator();
            updateDownloadsContainerVisibility();
            reject(e);
        });
}
function formatTime(seconds) {
    if (seconds === Infinity || isNaN(seconds)) {
        return '计算中...';
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    let timeString = '';
    if (hours > 0) {
        timeString += `${hours}小时 `;
    }
    if (minutes > 0 || hours > 0) {
        timeString += `${minutes}分钟 `;
    }
    timeString += `${remainingSeconds}秒`;
    return timeString.trim();
}
window.updateUI = function () {
    const download_list = document.getElementById("download_list");
    const container = createOrUpdateContainer(download_list);
    createOrUpdateSearchInput(container);
    createOrUpdateQuickFilterSelect(container);
    createOrUpdateSortSelect(container);
    createOrUpdateSelectAllCheckbox(download_list);
    createOrUpdateBulkDownloadButton(download_list);
    createOrUpdateTreeViewButton(download_list);
    createOrUpdateHiddenProbeButton(download_list);
}
function createOrUpdateContainer(parent) {
    let container = document.getElementById("searchAndFilterContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "searchAndFilterContainer";
        Object.assign(container.style, {
            position: "relative",
            display: "flex",
            flexDirection: "column",
            marginTop: '30px',
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: 'rgba(255, 249, 230, 0.9)',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '2px solid #ffd700',
            zIndex: '10000'
        });
        const inputContainer = document.createElement("div");
        Object.assign(inputContainer.style, {
            display: "flex",
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            zIndex: '2'
        });
        container.appendChild(inputContainer);
        parent.prepend(container);
    }
    return container;
}
function createOrUpdateSearchInput(container) {
    let searchInput = document.getElementById("searchInput");
    if (!searchInput) {
        searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.placeholder = "搜索文件名/后缀名";
        searchInput.id = "searchInput";
        searchInput.className = "course-search-input";
        Object.assign(searchInput.style, {
            width: '200px',
            height: '38px',
            padding: '0 40px 0 15px',
            flex: '1',
            marginRight: '10px',
            border: '2px solid #ffa500',
            borderRadius: '20px',
            outline: 'none',
            color: '#ffa500',
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: '#fff',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 5px rgba(255, 165, 0, 0.2)',
        });
        searchInput.addEventListener("input", () => filterList(searchInput.value));
        searchInput.addEventListener("focus", () => {
            searchInput.style.boxShadow = '0 0 8px rgba(255, 165, 0, 0.5)';
            searchInput.style.borderColor = '#ff8c00';
        });
        searchInput.addEventListener("blur", () => {
            searchInput.style.boxShadow = '0 2px 5px rgba(255, 165, 0, 0.2)';
            searchInput.style.borderColor = '#ffa500';
        });
        const style = document.createElement('style');
        style.textContent = `
            .course-search-input::placeholder{
                color: #ffa500;
            }
            .search-input-wrap {
                position: relative;
                display: flex;
                align-items: center;
                flex: 1;
                min-width: 0;
            }
            .search-input-wrap .search-input-icon {
                position: absolute;
                right: 12px;
                display: inline-flex;
                color: #a8967e;
                font-size: 12px;
                pointer-events: none;
            }
            .search-input-wrap #searchInput {
                width: 100% !important;
                margin: 0 !important;
            }
        `;
        document.head.appendChild(style);
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'search-input-wrap';
        inputWrapper.innerHTML = `<span class="search-input-icon">${xyIcon('magnifying-glass')}</span>`;
        inputWrapper.appendChild(searchInput);
        container.querySelector("div").appendChild(inputWrapper);
    }
    searchInput.value = window.currentSearchKeyword || '';
}
function createOrUpdateQuickFilterSelect(container) {
    let quickFilterSelect = document.getElementById("quickFilterSelect");
    if (!quickFilterSelect) {
        quickFilterSelect = createCustomSelect("quickFilterSelect", "筛选类别");
        quickFilterSelect.addEventListener("change", (e) => filterListByCategory(e.detail));
        container.querySelector("div").appendChild(quickFilterSelect);
    }
    updateCustomSelectOptions(quickFilterSelect, window.quickFilters);
    setCustomSelectValue(quickFilterSelect, window.currentFilterCategory || '');
}
function createOrUpdateSortSelect(container) {
    let sortSelect = document.getElementById("sortSelect");
    if (!sortSelect) {
        sortSelect = createCustomSelect("sortSelect", "排序方式");
        sortSelect.addEventListener("change", (e) => sortList(e.detail));
        container.querySelector("div").appendChild(sortSelect);
    }
    updateCustomSelectOptions(sortSelect, [
        { value: '', label: '排序方式' },
        { value: 'date_asc', label: '日期升序' },
        { value: 'date_desc', label: '日期降序' },
        { value: 'xiaoya_order', label: '小雅排序' }
    ]);
}
function createCustomSelect(id, placeholder) {
    const select = document.createElement("div");
    select.id = id;
    select.className = "custom-select";
    select.innerHTML = `
        <div class="select-selected" data-value="">${placeholder}</div>
        <div class="select-items select-hide"></div>
    `;
    const selected = select.querySelector(".select-selected");
    const items = select.querySelector(".select-items");
    selected.addEventListener("click", function (e) {
        e.stopPropagation();
        closeAllSelect(this);
        items.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
    items.addEventListener("click", function (e) {
        e.stopPropagation();
    });
    document.addEventListener("click", closeAllSelect);
    return select;
}
function updateCustomSelectOptions(select, options) {
    const items = select.querySelector(".select-items");
    items.innerHTML = '';
    options.forEach(option => {
        const div = document.createElement("div");
        div.textContent = option.label;
        div.dataset.value = option.value;
        div.addEventListener("click", function (e) {
            e.stopPropagation();
            const selected = this.parentNode.previousElementSibling;
            selected.textContent = this.textContent;
            selected.dataset.value = this.dataset.value;
            this.parentNode.querySelector(".same-as-selected")?.classList.remove("same-as-selected");
            this.classList.add("same-as-selected");
            select.dispatchEvent(new CustomEvent('change', { detail: this.dataset.value }));
            closeAllSelect();
        });
        items.appendChild(div);
    });
    const rect = items.getBoundingClientRect();
    if (rect.bottom > window.innerHeight) {
        items.style.bottom = '100%';
        items.style.top = 'auto';
    } else {
        items.style.top = '100%';
        items.style.bottom = 'auto';
    }
}
function setCustomSelectValue(select, value) {
    const items = select.querySelector(".select-items");
    const selected = select.querySelector(".select-selected");
    const option = items.querySelector(`[data-value="${value}"]`);
    if (option) {
        selected.textContent = option.textContent;
        selected.dataset.value = value;
        items.querySelector(".same-as-selected")?.classList.remove("same-as-selected");
        option.classList.add("same-as-selected");
    }
}
function closeAllSelect(elmnt) {
    const items = document.getElementsByClassName("select-items");
    const selected = document.getElementsByClassName("select-selected");
    for (let i = 0; i < selected.length; i++) {
        if (elmnt != selected[i]) {
            selected[i].classList.remove("select-arrow-active");
        }
    }
    for (let i = 0; i < items.length; i++) {
        if (elmnt != items[i] && elmnt != selected[i]) {
            items[i].classList.add("select-hide");
        }
    }
}
function createOrUpdateSelectAllCheckbox(parent) {
    if (!document.getElementById("selectAllCheckbox")) {
        const checkboxContainer = document.createElement('div');
        Object.assign(checkboxContainer.style, {
            display: 'flex',
            position: "relative",
            alignItems: 'center',
            padding: '5px 10px',
            marginBottom: '10px'
        });
        const selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.className = 'custom-checkbox';
        selectAllCheckbox.id = 'selectAllCheckbox';
        selectAllCheckbox.style.marginRight = '10px';
        const selectAllLabel = document.createElement('label');
        selectAllLabel.htmlFor = 'selectAllCheckbox';
        selectAllLabel.textContent = '全选';
        Object.assign(selectAllLabel.style, {
            fontWeight: 'bold',
            color: '#FFA500',
            userSelect: 'none'
        });
        checkboxContainer.appendChild(selectAllCheckbox);
        checkboxContainer.appendChild(selectAllLabel);
        parent.prepend(checkboxContainer);
        selectAllCheckbox.addEventListener('change', handleSelectAllChange);
    }
}
function handleSelectAllChange() {
    const selectAllCheckbox = document.getElementById("selectAllCheckbox");
    const checkboxes = document.querySelectorAll("#download_list input[type='checkbox']:not(#selectAllCheckbox)");
    checkboxes.forEach(checkbox => {
        if (checkbox.getAttribute('data-visible') === 'true') {
            checkbox.checked = selectAllCheckbox.checked;
            checkbox.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        }
    });
    syncTreeWithDownloadList();
}
function applyCommonButtonStyle(button, gradientColors) {
    Object.assign(button.style, {
        background: `linear-gradient(90deg, ${gradientColors.join(", ")})`,
        backgroundSize: '200% 100%',
        animation: 'flowingGradient 3s ease infinite',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '30px',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        position: 'fixed',
        top: '20px',
        zIndex: 10000,
        fontSize: '16px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        outline: 'none',
    });
    button.addEventListener('mouseover', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 7px 14px rgba(0,0,0,0.12), 0 3px 6px rgba(0,0,0,0.08)';
        button.style.filter = 'brightness(110%)';
    });
    button.addEventListener('mouseout', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)';
        button.style.filter = 'brightness(100%)';
    });
    button.addEventListener('mousedown', () => {
        button.style.transform = 'translateY(1px)';
        button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.08)';
    });
    button.addEventListener('mouseup', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 7px 14px rgba(0,0,0,0.12), 0 3px 6px rgba(0,0,0,0.08)';
    });
    button.addEventListener('focus', () => {
        button.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.5), 0 4px 6px rgba(0,0,0,0.1)';
    });
    button.addEventListener('blur', () => {
        button.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)';
    });
}
function createOrUpdateBulkDownloadButton(parent) {
    if (!document.getElementById("bulkDownloadButton")) {
        const bulkDownloadButton = document.createElement('button');
        const bulkDownloadButtonGradient = ['#ffa500', '#ff8c00', '#ffa500'];
        bulkDownloadButton.innerHTML = '<span style="font-weight: bold;">批量下载</span>';
        bulkDownloadButton.id = "bulkDownloadButton";
        bulkDownloadButton.title = '点击下载所选文件';
        applyCommonButtonStyle(bulkDownloadButton, bulkDownloadButtonGradient);
        bulkDownloadButton.style.right = '15px';
        bulkDownloadButton.addEventListener('click', handleBulkDownload);
        parent.appendChild(bulkDownloadButton);
    }
}
async function handleBulkDownload() {
    console.log('开始批量下载');
    const checkboxes = document.querySelectorAll("#download_list input[type='checkbox']:checked");
    if (checkboxes.length === 0) {
        showNotification('还啥都没选呢（；´д｀）ゞ', 'warning');
        console.log('没有选择任何文件，批量下载已取消');
        return;
    }
    const downloadQueue = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked && checkbox.getAttribute('data-visible') === 'true')
        .map(checkbox => {
            const container = checkbox.closest('div');
            const link = container.querySelector('a.download-link');
            return {
                quoteId: link.getAttribute('data-quote-id'),
                name: link.getAttribute('data-origin-name')
            };
        });
    if (totalDownloads === 0) {
        totalDownloads = downloadQueue.length;
        completedDownloads = 0;
    } else {
        totalDownloads += downloadQueue.length;
    }
    console.log(`队列中的文件数: ${downloadQueue.length}`);
    if (downloadQueue.length > 10) {
        showNotification(
            `已选择 ${downloadQueue.length} 个文件，下载可能造成网络或性能瓶颈。确认继续？`,
            'confirm',
            async () => {
                processDownloadQueue(downloadQueue);
            },
            () => {
                showNotification('批量下载已取消', 'info');
                console.log('用户取消了批量下载');
                totalDownloads = 0;
                completedDownloads = 0;
            }
        );
    } else {
        processDownloadQueue(downloadQueue);
    }
}
async function processDownloadQueue(downloadQueue) {
    const useThirdPartyDownload = localStorage.getItem('useThirdPartyDownload') === 'true';
    for (let file of downloadQueue) {
        try {
            console.log(`准备下载: ${file.name}`);
            const fileUrl = await window.getDownloadUrl(file.quoteId);
            courseDownload(fileUrl, file.name).then(() => {
                console.log(`完成下载: ${file.name}`);
            }).catch(error => {
                console.error(`下载失败: ${file.name}`, error);
            });
            if (useThirdPartyDownload) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } catch (error) {
            console.error(`处理文件失败: ${file.name}`, error);
        }
    }
}
function sortList(order) {
    const downloadList = document.getElementById("download_list");
    const items = Array.from(downloadList.querySelectorAll(".file-item"));
    const folderSortMap = {};
    const pathStructureMap = {};
    if (course_resources) {
        course_resources.forEach(resource => {
            folderSortMap[resource.id] = resource.sort_position || 0;
            if (resource.path) {
                const pathParts = resource.path.split('/');
                let currentPath = '';
                pathParts.forEach((part, index) => {
                    const thisPath = currentPath ? `${currentPath}/${part}` : part;
                    currentPath = thisPath;
                    if (!pathStructureMap[part]) {
                        pathStructureMap[part] = {
                            depth: index,
                            sort_position: resource.sort_position || 0,
                            parent_id: index > 0 ? pathParts[index - 1] : null
                        };
                    }
                });
            }
        });
    }
    items.sort((a, b) => {
        const aLink = a.querySelector('a');
        const bLink = b.querySelector('a');
        const aParentId = aLink.getAttribute('data-parent-id');
        const bParentId = bLink.getAttribute('data-parent-id');
        const aPath = aLink.getAttribute('data-path');
        const bPath = bLink.getAttribute('data-path');
        const aPathParts = aPath ? aPath.split('/') : [];
        const bPathParts = bPath ? bPath.split('/') : [];
        if (order === 'xiaoya_order') {
            const minLength = Math.min(aPathParts.length, bPathParts.length);
            for (let i = 0; i < minLength; i++) {
                const aId = aPathParts[i];
                const bId = bPathParts[i];
                if (aId !== bId) {
                    const aSortPosition = folderSortMap[aId] || 0;
                    const bSortPosition = folderSortMap[bId] || 0;
                    return aSortPosition - bSortPosition;
                }
            }
            if (aPathParts.length !== bPathParts.length) {
                return aPathParts.length - bPathParts.length;
            }
            const aFolderPosition = folderSortMap[aParentId] || Infinity;
            const bFolderPosition = folderSortMap[bParentId] || Infinity;
            if (aFolderPosition !== bFolderPosition) {
                return aFolderPosition - bFolderPosition;
            }
            const aId = aLink.getAttribute('data-resource-id');
            const bId = bLink.getAttribute('data-resource-id');
            return aId.localeCompare(bId);
        } else {
            const aDate = new Date(aLink.getAttribute('data-created-at'));
            const bDate = new Date(bLink.getAttribute('data-created-at'));
            if (order === 'date_asc') {
                return aDate - bDate;
            } else if (order === 'date_desc') {
                return bDate - aDate;
            }
        }
    });
    items.forEach(item => downloadList.appendChild(item));
    applyFilters();
}
window.toggleListVisibility = function () {
    if (window.xyWorkspace) {
        window.xyWorkspace.toggle('files');
    }
}
function filterList(keyword) {
    window.currentSearchKeyword = keyword.toLowerCase();
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.value = keyword;
    }
    applyFilters();
}
function filterListByCategory(categoryValue) {
    window.currentFilterCategory = categoryValue;
    applyFilters();
}
function applyFilters() {
    var searchKeyword = window.currentSearchKeyword;
    var filterCategory = window.currentFilterCategory;
    var extensions = filterCategory ? filterCategory.split(',').map(ext => ext.trim()) : [];
    var containers = document.querySelectorAll("#download_list .file-item");
    containers.forEach(function (container) {
        var file = container.querySelector("a");
        var checkbox = container.querySelector("input[type='checkbox']");
        var fileName = file.getAttribute('data-origin-name').toLowerCase();
        var fileExtension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);
        var isSearchMatch = searchKeyword === '' || fileName.includes(searchKeyword);
        var isFilterMatch = filterCategory === "" || extensions.includes(fileExtension);
        var isVisible = isSearchMatch && isFilterMatch;
        container.style.display = isVisible ? "flex" : "none";
        checkbox.setAttribute('data-visible', isVisible.toString());
    });
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        const visibleCheckboxes = Array.from(document.querySelectorAll("#download_list .file-item input[type='checkbox'][data-visible='true']"));
        const allVisibleChecked = visibleCheckboxes.every(checkbox => checkbox.checked);
        selectAllCheckbox.checked = visibleCheckboxes.length > 0 && allVisibleChecked;
    }
    var visibleItems = document.querySelectorAll("#download_list .file-item[style*='display: flex']");
    var download_list = document.getElementById("download_list");
    var noResultsMessage = download_list.querySelector('p');
    if (visibleItems.length === 0) {
        if (!noResultsMessage) {
            noResultsMessage = document.createElement('p');
            noResultsMessage.style.color = '#FFA500';
            noResultsMessage.style.textAlign = 'center';
            noResultsMessage.style.fontWeight = 'bold';
            noResultsMessage.innerHTML = '<span style="font-size: 1.2em;"><span style="color: red;">没有</span></span>课件( ´･･)ﾉ(._.`)';
            download_list.appendChild(noResultsMessage);
        }
    } else {
        if (noResultsMessage) {
            download_list.removeChild(noResultsMessage);
        }
    }
}
const TREE_VIEW_CONFIG = {
    buttonId: 'treeViewButton',
    containerId: 'treeContainer',
    contentId: 'treeContent',
    loadingId: 'loadingAnimation',
    buttonText: '课程结构'
};
let treeBuildToken = 0;
function createOrUpdateTreeViewButton(parent) {
    let treeViewButton = document.getElementById(TREE_VIEW_CONFIG.buttonId);
    let treeContainer = document.getElementById(TREE_VIEW_CONFIG.containerId);
    if (!treeViewButton) {
        treeViewButton = createTreeViewButton();
        treeViewButton.title = '查看课程结构';
        parent.appendChild(treeViewButton);
    }
    if (!treeContainer) {
        treeContainer = createTreeContainer();
        document.body.appendChild(treeContainer);
    }
    if (treeContainer && treeContainer.dataset.xyBuilt === '1') {
        const existingContent = treeContainer.querySelector('#treeContent');
        const existingLoading = treeContainer.querySelector('#loadingAnimation');
        if (existingContent && existingLoading) {
            setupTreeViewButtonEvents(treeViewButton, treeContainer, existingContent, existingLoading);
        }
        return;
    }
    treeContainer.innerHTML = '';
    treeContainer.appendChild(createTreeHeader(treeContainer));
    const searchContainer = createSearchContainer();
    treeContainer.appendChild(searchContainer);
    const contentWrapper = document.createElement('div');
    contentWrapper.id = 'treeContentWrapper';
    treeContainer.appendChild(contentWrapper);
    const loadingAnimation = createLoadingAnimation();
    const treeContent = createTreeContent();
    contentWrapper.appendChild(loadingAnimation);
    contentWrapper.appendChild(treeContent);
    const footer = document.createElement('div');
    footer.className = 'tree-footer';
    const summary = document.createElement('span');
    summary.id = 'treeSelectionSummary';
    summary.textContent = '已选 0 个文件';
    footer.appendChild(summary);
    footer.appendChild(createTreeBulkDownloadButton());
    treeContainer.appendChild(footer);
    const expandAllButton = treeContainer.querySelector('#treeExpandAllButton');
    const collapseAllButton = treeContainer.querySelector('#treeCollapseAllButton');
    if (expandAllButton) expandAllButton.addEventListener('click', () => setAllFolders(treeContainer, true));
    if (collapseAllButton) collapseAllButton.addEventListener('click', () => setAllFolders(treeContainer, false));
    const searchInput = searchContainer.querySelector('#treeSearchInput');
    const clearSearchButton = searchContainer.querySelector('#treeClearSearchButton');
    const prevButton = searchContainer.querySelector('#treePrevButton');
    const nextButton = searchContainer.querySelector('#treeNextButton');
    let currentMatchIndex = -1;
    let matches = [];
    let highlightTimeout;
    let searchDebounce = null;
    if (clearSearchButton) clearSearchButton.addEventListener('click', clearTreeSearch);
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(searchDebounce);
            searchDebounce = setTimeout(performTreeSearch, 180);
        });
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                clearTimeout(searchDebounce);
                performTreeSearch();
            }
        });
    }
    if (prevButton) prevButton.addEventListener('click', () => navigateMatches(-1));
    if (nextButton) nextButton.addEventListener('click', () => navigateMatches(1));
    function performTreeSearch() {
        if (!searchInput) return;
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm === '') {
            clearTreeSearch();
            return;
        }
        forcedExpandedItems.clear();
        const treeItems = treeContainer.querySelectorAll('.item-content');
        matches = [];
        removeAllHighlights();
        treeItems.forEach(item => {
            const nameSpan = item.querySelector('.folder, .tree-file-name');
            if (!nameSpan) return;
            const textContent = nameSpan.textContent.trim();
            const span = nameSpan;
            if (textContent && textContent.toLowerCase().includes(searchTerm)) {
                matches.push(span);
                const parentElements = getParentElements(item.closest('li'));
                parentElements.forEach(el => forcedExpandedItems.add(el));
                expandParentFolders(item.closest('li'));
            }
        });
        currentMatchIndex = matches.length > 0 ? 0 : -1;
        updateNavigationButtons();
        updateSearchInfo();
        if (matches.length > 0) {
            highlightCurrentMatch();
            scrollToMatch(currentMatchIndex);
        }
    }
    function getParentElements(element) {
        const parents = [];
        let current = element;
        while (current && current !== treeContainer) {
            if (current.tagName === 'LI') {
                parents.push(current);
            }
            current = current.parentElement;
        }
        return parents;
    }
    function navigateMatches(direction) {
        if (matches.length === 0) return;
        currentMatchIndex += direction;
        if (currentMatchIndex < 0) currentMatchIndex = matches.length - 1;
        if (currentMatchIndex >= matches.length) currentMatchIndex = 0;
        updateNavigationButtons();
        updateSearchInfo();
        highlightCurrentMatch();
        scrollToMatch(currentMatchIndex);
    }
    function updateSearchInfo() {
        const searchInfo = document.getElementById('treeSearchInfo');
        if (searchInfo) {
            if (matches.length > 0) {
                searchInfo.textContent = `${currentMatchIndex + 1} / ${matches.length}`;
            } else {
                searchInfo.textContent = '无匹配结果';
            }
        }
    }
    function highlightCurrentMatch() {
        removeAllHighlights();
        if (currentMatchIndex >= 0 && currentMatchIndex < matches.length) {
            const currentMatch = matches[currentMatchIndex];
            const fragment = document.createDocumentFragment();
            while (currentMatch.firstChild) {
                fragment.appendChild(currentMatch.firstChild);
            }
            fragment.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const highlightSpan = document.createElement('span');
                    highlightSpan.className = 'highlight';
                    highlightSpan.textContent = node.textContent;
                    node.parentNode.replaceChild(highlightSpan, node);
                }
            });
            currentMatch.appendChild(fragment);
            scrollToMatch(currentMatchIndex);
            clearTimeout(highlightTimeout);
            highlightTimeout = setTimeout(() => {
                removeAllHighlights();
            }, 2000);
        }
    }
    function removeAllHighlights() {
        treeContainer.querySelectorAll('.highlight').forEach(el => {
            const parent = el.parentNode;
            while (el.firstChild) {
                parent.insertBefore(el.firstChild, el);
            }
            parent.removeChild(el);
        });
    }
    function scrollToMatch(index) {
        if (index >= 0 && index < matches.length) {
            const contentWrapper = document.getElementById('treeContentWrapper');
            const matchElement = matches[index];
            const wrapperRect = contentWrapper.getBoundingClientRect();
            const matchRect = matchElement.getBoundingClientRect();
            contentWrapper.scrollTop += matchRect.top - wrapperRect.top - wrapperRect.height / 2 + matchRect.height / 2;
            matchElement.scrollIntoView({ block: "nearest", inline: "nearest" });
        }
    }
    function clearTreeSearch() {
        const searchInput = document.getElementById('treeSearchInput');
        const searchInfo = document.getElementById('treeSearchInfo');
        if (searchInput) {
            searchInput.value = '';
        }
        if (searchInfo) {
            searchInfo.textContent = '';
        }
        forcedExpandedItems.clear();
        removeAllHighlights();
        matches = [];
        currentMatchIndex = -1;
        updateNavigationButtons();
    }
    function updateNavigationButtons() {
        prevButton.disabled = matches.length === 0;
        nextButton.disabled = matches.length === 0;
    }
    function expandParentFolders(element) {
        let current = element;
        while (current !== treeContainer) {
            if (current.tagName === 'LI') {
                const folderToggle = current.querySelector('.folder-toggle');
                const ul = current.querySelector('ul');
                if (folderToggle && ul) {
                    folderToggle.classList.add('open');
                    ul.classList.remove('collapsed');
                    ul.classList.add('expanded');
                    ul.style.display = 'block';
                    ul.style.height = 'auto';
                }
            }
            current = current.parentElement;
        }
    }
    setupTreeViewButtonEvents(treeViewButton, treeContainer, treeContent, loadingAnimation);
    setupTreeCheckboxEvents(treeContainer);
    addTreeViewStyles();
    setInitialFoldState(treeContainer);
    treeContainer.dataset.xyBuilt = '1';
}
function setInitialFoldState(container, expand = false) {
    const rootUl = container.querySelector('ul');
    if (!rootUl) return;
    const subFolders = rootUl.querySelectorAll('li > ul');
    subFolders.forEach(ul => {
        ul.classList.toggle('collapsed', !expand);
        ul.classList.toggle('expanded', expand);
        ul.style.display = expand ? 'block' : 'none';
        ul.style.height = '';
        const toggle = ul.parentElement.querySelector('.folder-toggle');
        if (toggle) {
            toggle.classList.toggle('open', expand);
            toggle.setAttribute('aria-expanded', String(expand));
            const folderName = ul.parentElement.querySelector('.folder')?.textContent || '文件夹';
            toggle.setAttribute('aria-label', `${expand ? '收起' : '展开'} ${folderName}`);
        }
        setFolderIconState(ul.parentElement, expand);
    });
}
function createTreeViewButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.id = TREE_VIEW_CONFIG.buttonId;
    button.textContent = TREE_VIEW_CONFIG.buttonText;
    return button;
}
function createTreeHeader(treeContainer) {
    const header = document.createElement('div');
    header.className = 'tree-head';
    header.innerHTML = `
        <div class="tree-head-title">
            <span class="tree-head-icon">${xyIcon('folder-tree')}</span>
            <span>课程结构</span>
            <span class="tree-head-count" id="treeFileCount">0 个文件</span>
        </div>
        <div class="tree-head-actions">
            <button type="button" class="tree-tool-btn" id="treeExpandAllButton">展开全部</button>
            <button type="button" class="tree-tool-btn" id="treeCollapseAllButton">收起全部</button>
            <button type="button" class="tree-tool-btn tree-back-btn" id="treeBackButton">返回列表</button>
        </div>
    `;
    const backButton = header.querySelector('#treeBackButton');
    if (backButton) {
        backButton.addEventListener('click', () => treeContainer.close());
    }
    return header;
}
function createTreeBulkDownloadButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'treeBulkDownloadButton';
    button.innerHTML = `
        ${xyIcon('download')}
        <span>下载所选</span>
    `;
    button.addEventListener('click', handleBulkDownload);
    return button;
}
function createSearchContainer() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'tree-search';
    searchContainer.innerHTML = `
        <div class="tree-search-box">
            <span class="tree-search-icon">${xyIcon('magnifying-glass')}</span>
            <input type="text" id="treeSearchInput" placeholder="搜索文件或文件夹" autocomplete="off" />
        </div>
        <button type="button" id="treeClearSearchButton" class="tree-icon-btn" title="清除搜索">${xyIcon('xmark')}</button>
        <button type="button" id="treePrevButton" class="tree-icon-btn" title="上一个" disabled>${xyIcon('chevron-left')}</button>
        <button type="button" id="treeNextButton" class="tree-icon-btn" title="下一个" disabled>${xyIcon('chevron-right')}</button>
        <span id="treeSearchInfo" class="search-info"></span>
    `;
    return searchContainer;
}
function createTreeContainer() {
    const container = document.createElement('div');
    container.id = TREE_VIEW_CONFIG.containerId;
    container.style.display = 'none';
    container.close = function () {
        const hadFocus = this.contains(document.activeElement);
        this.style.display = 'none';
        if (hadFocus) {
            setTimeout(() => {
                const button = document.getElementById(TREE_VIEW_CONFIG.buttonId);
                if (button) button.focus({ preventScroll: true });
            }, 0);
        }
    };
    return container;
}
function createTreeContent() {
    const content = document.createElement('div');
    content.id = TREE_VIEW_CONFIG.contentId;
    content.innerHTML = `
        <div class="tree-placeholder">
            <div class="tree-placeholder-icon">${xyIcon('seedling')}</div>
            <strong>课程结构</strong>
            <span>点击「课程结构」开始构建</span>
        </div>
    `;
    return content;
}
function createLoadingAnimation() {
    const loading = document.createElement('div');
    loading.id = TREE_VIEW_CONFIG.loadingId;
    loading.className = 'tree-loading';
    loading.style.display = 'none';
    loading.innerHTML = '<div class="loader"></div>';
    return loading;
}
function setAllFolders(container, expand) {
    const uls = [...container.querySelectorAll('#treeContent li > ul')];
    if (!expand) uls.reverse();
    uls.forEach(ul => {
        ul.classList.toggle('collapsed', !expand);
        ul.classList.toggle('expanded', expand);
        ul.style.display = expand ? 'block' : 'none';
        ul.style.height = '';
        const toggle = ul.parentElement.querySelector('.folder-toggle');
        if (toggle) {
            toggle.classList.toggle('open', expand);
            toggle.setAttribute('aria-expanded', String(expand));
            const folderName = ul.parentElement.querySelector('.folder')?.textContent || '文件夹';
            toggle.setAttribute('aria-label', `${expand ? '收起' : '展开'} ${folderName}`);
        }
        setFolderIconState(ul.parentElement, expand);
    });
}
function setFolderIconState(folderLi, expand) {
    if (!folderLi) return;
    const icon = folderLi.querySelector(':scope > .item-content .folder-icon i');
    if (icon) {
        icon.className = `fa-solid ${expand ? 'fa-folder-open' : 'fa-folder'} xy-icon`;
    }
}
function updateTreeSelectionSummary() {
    const summary = document.getElementById('treeSelectionSummary');
    const headerCount = document.getElementById('treeFileCount');
    const bulkButton = document.getElementById('treeBulkDownloadButton');
    if (!summary && !headerCount && !bulkButton) return;
    const checkboxes = [...document.querySelectorAll('#download_list .file-item input[type="checkbox"]')];
    const selected = checkboxes.filter(checkbox => checkbox.checked).length;
    if (summary) summary.textContent = `已选 ${selected} / ${checkboxes.length} 个文件`;
    if (headerCount) headerCount.textContent = `${checkboxes.length} 个文件`;
    if (bulkButton) bulkButton.disabled = selected === 0;
}
function setupTreeViewButtonEvents(button, container, content, loading) {
    button.onclick = async () => {
        if (!course_resources) {
            showNotification('课程资源尚未加载，请稍后再试。', 'warning');
            return;
        }
        if (container.style.display !== 'none') {
            container.close();
            return;
        }
        container.style.display = 'block';
        const buildToken = ++treeBuildToken;
        content.innerHTML = '';
        content.style.display = 'none';
        loading.style.display = 'flex';
        const searchInput = container.querySelector('#treeSearchInput');
        const searchInfo = container.querySelector('#treeSearchInfo');
        const prevButton = container.querySelector('#treePrevButton');
        const nextButton = container.querySelector('#treeNextButton');
        if (searchInput) {
            searchInput.value = '';
            searchInput.disabled = true;
        }
        if (searchInfo) searchInfo.textContent = '';
        if (prevButton) prevButton.disabled = true;
        if (nextButton) nextButton.disabled = true;
        updateTreeSelectionSummary();
        requestAnimationFrame(() => {
            const section = document.getElementById('xy-tree-section');
            if (section) section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
        const itemCount = countTreeItems(course_resources);
        const delay = Math.min(Math.max(itemCount * 6, 180), 900);
        await new Promise(resolve => setTimeout(resolve, delay));
        if (buildToken !== treeBuildToken) return;
        try {
            const treeHtml = await createTreeHTML();
            if (buildToken !== treeBuildToken) return;
            content.innerHTML = treeHtml;
            addFolderToggle(content);
            syncTreeWithDownloadList();
            const folderCount = content.querySelectorAll('.folder-toggle').length;
            setInitialFoldState(container, folderCount > 0 && folderCount <= 8);
            addPreviewButtonListeners();
            updateTreeSelectionSummary();
            content.style.opacity = '0';
            requestAnimationFrame(() => {
                if (buildToken !== treeBuildToken) return;
                content.style.transition = 'opacity .2s ease';
                content.style.opacity = '1';
            });
        } catch (error) {
            if (buildToken !== treeBuildToken) return;
            console.error('构建课程结构失败:', error);
            content.innerHTML = '<div class="tree-empty">课程结构构建失败，请稍后重试</div>';
        } finally {
            if (buildToken === treeBuildToken) {
                loading.style.display = 'none';
                content.style.display = 'block';
                if (searchInput) searchInput.disabled = false;
            }
        }
    };
}
function countTreeItems(resources) {
    if (!resources) return 0;
    if (Array.isArray(resources)) {
        let count = 0;
        for (const resource of resources) {
            count++;
            if (resource.children) {
                count += countTreeItems(resource.children);
            }
        }
        return count;
    } else if (typeof resources === 'object') {
        let count = 1;
        for (const key in resources) {
            if (resources.hasOwnProperty(key) && typeof resources[key] === 'object') {
                count += countTreeItems(resources[key]);
            }
        }
        return count;
    } else {
        return 1;
    }
}
function setupTreeCheckboxEvents(container) {
    container.removeEventListener('change', onTreeCheckboxChange);
    container.addEventListener('change', onTreeCheckboxChange);
}
function onTreeCheckboxChange(e) {
    if (e.target.classList.contains('tree-checkbox')) {
        handleTreeCheckboxChange(e.target);
    }
}
function handleTreeCheckboxChange(checkbox) {
    batchUpdate(checkbox);
    updateSelectAllCheckbox();
    syncTreeWithDownloadList();
}
function addPreviewButtonListeners() {
    const treePreviewButtons = document.querySelectorAll('#treeContainer .preview-button');
    treePreviewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const resourceId = button.getAttribute('data-resource-id');
            const correspondingPreviewLink = document.querySelector(`#download_list .preview-link[data-resource-id="${resourceId}"]`);
            if (correspondingPreviewLink) {
                const originalHtml = button.innerHTML;
                button.innerHTML = xyIcon('spinner', 'fa-spin');
                button.disabled = true;
                const restore = () => {
                    button.innerHTML = originalHtml;
                    button.disabled = false;
                };
                correspondingPreviewLink.click();
                setTimeout(restore, 1200);
            } else {
                console.error('找不到对应的预览链接');
                showNotification('预览链接不存在，请刷新页面后重试。', 'error');
            }
        });
    });
}
function treeEscapeHtml(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
function treeShortId(id) {
    const value = String(id || '');
    return value.length > 6 ? value.slice(-6) : value;
}
function treeFolderFallbackName(id) {
    return `隐藏文件夹 · ${treeShortId(id) || '未知'}`;
}
function countTreeFiles(node) {
    let count = node && node.resources ? node.resources.length : 0;
    if (node && node.children) {
        for (const key in node.children) {
            count += countTreeFiles(node.children[key]);
        }
    }
    return count;
}
async function createTreeHTML() {
    const folderNames = {};
    const resourceSortMap = {};
    (course_resources || []).forEach(resource => {
        const id = String(resource.id);
        resourceSortMap[id] = resource.sort_position || 0;
        if (Number(resource.type) === 1) {
            const rawName = String(resource.name || '').trim();
            folderNames[id] = {
                name: rawName && !/^\d+$/.test(rawName) ? rawName : treeFolderFallbackName(id),
                sort_position: resource.sort_position || 0
            };
        }
    });
    const entries = [];
    document.querySelectorAll('#download_list .file-item').forEach(fileItem => {
        const fileInfo = fileItem.querySelector('a');
        const checkbox = fileItem.querySelector('input[type="checkbox"]');
        if (!fileInfo || !checkbox) return;
        const resourceId = String(fileInfo.getAttribute('data-resource-id') || '');
        const originName = fileInfo.getAttribute('data-origin-name')
            || fileItem.querySelector('.file-name')?.textContent
            || '未命名文件';
        const rawPathIds = String(fileInfo.getAttribute('data-path') || '')
            .split('/')
            .filter(id => id && id !== '0' && id !== 'null');
        let pathIds = rawPathIds;
        if (!pathIds.length) {
            const parentId = String(fileInfo.getAttribute('data-parent-id') || '');
            pathIds = [parentId, resourceId]
                .filter(id => id && id !== '0' && id !== 'null');
        }
        if (!pathIds.length) return;
        entries.push({
            id: resourceId || pathIds[pathIds.length - 1],
            parent_id: fileInfo.getAttribute('data-parent-id') || null,
            name: originName,
            path: pathIds.join('/'),
            pathIds,
            checkbox,
            sort_position: resourceSortMap[resourceId] || 0
        });
    });
    const missingFolderIds = new Set();
    entries.forEach(entry => {
        entry.pathIds.slice(0, -1).forEach(id => {
            if (!folderNames[id]) missingFolderIds.add(id);
        });
    });
    if (missingFolderIds.size > 0 && typeof hpResolveFolderNames === 'function') {
        await hpResolveFolderNames([...missingFolderIds]);
        missingFolderIds.forEach(id => {
            if (hpFolderNameCache.has(id)) {
                folderNames[id] = { name: hpFolderNameCache.get(id), sort_position: 0 };
            }
        });
    }
    const tree = {};
    entries.forEach(entry => {
        let current = tree;
        let currentPath = [];
        entry.pathIds.forEach((id, index) => {
            const isFolder = index < entry.pathIds.length - 1;
            currentPath.push(id);
            if (!current[id]) {
                const knownFolder = folderNames[id];
                current[id] = {
                    children: {},
                    resources: [],
                    sort_position: isFolder
                        ? (knownFolder?.sort_position || resourceSortMap[id] || 0)
                        : entry.sort_position,
                    id,
                    name: isFolder
                        ? (knownFolder?.name || treeFolderFallbackName(id))
                        : entry.name,
                    isFolder,
                    path: currentPath.join('/')
                };
            }
            if (!isFolder) {
                current[id].resources.push(entry);
                current[id].id = entry.id || id;
                current[id].name = entry.name;
                current[id].sort_position = entry.sort_position;
            }
            current = current[id].children;
        });
    });
    return buildTreeHTML(tree);
}
function buildTreeHTML(node, level = 0) {
    if (level === 0 && Object.keys(node).length === 0) {
        return '<div class="tree-empty">暂无课程文件</div>';
    }
    const folderEntries = [];
    const fileEntries = [];
    for (const key in node) {
        const item = node[key];
        if (item.isFolder) folderEntries.push(item);
        else fileEntries.push(item);
    }
    const bySort = (a, b) => {
        const delta = (a.sort_position || 0) - (b.sort_position || 0);
        return delta || String(a.name || '').localeCompare(String(b.name || ''), 'zh-CN');
    };
    folderEntries.sort(bySort);
    fileEntries.sort(bySort);
    let html = `<ul${level === 0 ? ' class="tree-root"' : ''}>`;
    for (const item of folderEntries) {
        const name = treeEscapeHtml(item.name);
        const path = treeEscapeHtml(item.path);
        const count = countTreeFiles(item);
        html += `
            <li class="tree-folder" data-path="${path}">
                <div class="item-content" role="treeitem" aria-level="${level + 1}" tabindex="0">
                    <div class="item-content-left">
                        <input type="checkbox" class="tree-checkbox folder-checkbox" data-path="${path}" aria-label="选择 ${name}">
                        <button type="button" class="folder-toggle" aria-label="展开 ${name}" aria-expanded="false">${xyIcon('chevron-right')}</button>
                        <span class="folder-icon">${xyIcon('folder')}</span>
                        <span class="folder" title="${name}">${name}</span>
                        <span class="tree-count">${count}</span>
                    </div>
                </div>
                ${buildTreeHTML(item.children, level + 1)}
            </li>
        `;
    }
    for (const item of fileEntries) {
        for (const resource of item.resources) {
            const name = treeEscapeHtml(resource.name);
            const path = treeEscapeHtml(resource.path);
            const checked = resource.checkbox.checked ? 'checked' : '';
            const fileIcon = getFileIcon(resource.name);
            html += `
                <li class="tree-file" data-path="${path}">
                    <div class="item-content" role="treeitem" aria-level="${level + 1}" tabindex="0" title="${name}">
                        <div class="item-content-left">
                            <input type="checkbox" class="tree-checkbox" data-path="${path}" ${checked} aria-label="选择 ${name}">
                            <span class="tree-file-icon">${fileIcon}</span>
                            <span class="tree-file-name">${name}</span>
                        </div>
                        <button type="button" class="preview-button" data-resource-id="${treeEscapeHtml(resource.id)}" title="预览 ${name}" aria-label="预览 ${name}">
                            ${xyIcon('eye')}
                        </button>
                    </div>
                </li>
            `;
        }
    }
    html += '</ul>';
    return html;
}
function batchUpdate(checkbox) {
    const isChecked = checkbox.checked;
    const listItem = checkbox.closest('li');
    const childCheckboxes = listItem.querySelectorAll('input.tree-checkbox');
    const path = checkbox.getAttribute('data-path');
    childCheckboxes.forEach(child => {
        child.checked = isChecked;
    });
    const safePath = String(path || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const fileListCheckboxes = document.querySelectorAll(
        `#download_list .file-item a[data-path="${safePath}"], #download_list .file-item a[data-path^="${safePath}/"]`
    );
    const fileCheckboxes = new Set();
    fileListCheckboxes.forEach(fileInfo => {
        const fileCheckbox = fileInfo.parentElement.querySelector('input[type="checkbox"]');
        if (fileCheckbox) fileCheckboxes.add(fileCheckbox);
    });
    fileCheckboxes.forEach(fileCheckbox => {
        if (fileCheckbox.checked !== isChecked) {
            fileCheckbox.checked = isChecked;
        }
    });
    updateParentCheckboxes(checkbox);
}
function getFileIcon(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'webp', 'tif'];
    const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma', 'aiff', 'ape', 'midi'];
    const codeExts = ['py', 'cpp', 'java', 'js', 'ts', 'cs', 'php', 'rb', 'go', 'swift', 'kt', 'c', 'h', 'sh', 'bat', 'json', 'xml', 'yaml', 'yml', 'sql', 'css', 'scss', 'less'];
    const archiveExts = ['zip', 'rar', '7z', 'gz', 'bz2', 'tar'];
    let icon = 'link';
    if (extension === 'pdf') {
        icon = 'file-pdf';
    } else if (extension === 'doc' || extension === 'docx') {
        icon = 'file-word';
    } else if (extension === 'xls' || extension === 'xlsx') {
        icon = 'file-excel';
    } else if (extension === 'ppt' || extension === 'pptx') {
        icon = 'file-powerpoint';
    } else if (['txt', 'odt', 'rtf', 'html', 'htm', 'odp', 'xmind'].includes(extension)) {
        icon = 'file-lines';
    } else if (imageExts.includes(extension)) {
        icon = 'file-image';
    } else if (audioExts.includes(extension)) {
        icon = 'file-audio';
    } else if (codeExts.includes(extension)) {
        icon = 'file-code';
    } else if (archiveExts.includes(extension)) {
        icon = 'file-zipper';
    }
    return xyIcon(icon);
}
function addTreeViewStyles() {
    if (document.getElementById('tree-view-styles')) return;
    const style = document.createElement('style');
    style.id = 'tree-view-styles';
    style.textContent = `
        #treeContainer {
            display: flex;
            flex-direction: column;
            width: 100%;
            min-width: 0;
            color: #4b3722;
            background: #fff;
            font-size: 13px;
        }
        .tree-head {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
            padding: 0 0 10px;
            border-bottom: 1px solid #f1e8d8;
        }
        .tree-head-title {
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 0;
            color: #5b462e;
            font-size: 14px;
            font-weight: 700;
        }
        .tree-head-icon {
            width: 28px;
            height: 28px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            background: #f8f0e2;
            font-size: 15px;
        }
        .tree-head-count {
            padding: 2px 8px;
            border-radius: 999px;
            background: #f5eee2;
            color: #9a8972;
            font-size: 10.5px;
            font-weight: 600;
        }
        .tree-head-actions {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-wrap: wrap;
            margin-left: auto;
        }
        .tree-tool-btn {
            height: 30px;
            padding: 0 10px;
            border: 1px solid #e6d7bd;
            border-radius: 8px;
            background: #fff;
            color: #8a6a33;
            font-size: 11.5px;
            font-weight: 600;
            cursor: pointer;
            transition: background .15s ease, border-color .15s ease;
        }
        .tree-tool-btn:hover {
            background: #fbf5ea;
            border-color: #dcc9a8;
        }
        .tree-back-btn {
            background: #f5eee2;
            border-color: #e9ddc9;
            color: #5b462e;
        }
        .tree-back-btn:hover {
            background: #ece1d1;
        }
        .tree-search {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 10px 0;
            border-bottom: 1px solid #f3ece0;
        }
        .tree-search-box {
            position: relative;
            flex: 1;
            min-width: 120px;
            display: flex;
            align-items: center;
        }
        .tree-search-icon {
            position: absolute;
            left: 10px;
            display: inline-flex;
            align-items: center;
            color: #a8967e;
            font-size: 12px;
            pointer-events: none;
        }
        #treeSearchInput {
            width: 100%;
            height: 34px;
            padding: 0 10px 0 30px;
            border: 1px solid #e9ddc9;
            border-radius: 9px;
            background: #fbf8f2;
            color: #5b462e;
            font-size: 12.5px;
            outline: none;
        }
        #treeSearchInput:focus {
            border-color: #e8b86b;
            background: #fff;
            box-shadow: 0 0 0 3px rgba(240, 138, 0, .08);
        }
        .tree-icon-btn {
            width: 30px;
            height: 30px;
            flex-shrink: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            border: 1px solid transparent;
            border-radius: 8px;
            background: transparent;
            color: #8a7a63;
            font-size: 15px;
            line-height: 1;
            cursor: pointer;
        }
        .tree-icon-btn:hover {
            background: #f5eee2;
            color: #5b462e;
        }
        .tree-icon-btn:disabled {
            opacity: .35;
            cursor: not-allowed;
            background: transparent;
        }
        #treeSearchInfo {
            min-width: 46px;
            color: #9a8972;
            font-size: 11px;
            text-align: right;
        }
        #treeContentWrapper {
            flex: 1;
            min-height: 0;
            max-height: 52vh;
            overflow-y: auto;
            padding: 10px 2px 4px;
            scrollbar-gutter: stable;
        }
        #treeContent {
            min-height: 40px;
        }
        #treeContent ul {
            margin: 0;
            padding: 0;
            list-style: none;
        }
        #treeContent li {
            position: relative;
            margin: 1px 0;
        }
        #treeContent li > ul {
            margin-left: 15px;
            padding-left: 10px;
            border-left: 1px solid #f0e5d2;
            overflow: hidden;
            transition: height .22s ease;
        }
        #treeContent li > ul.collapsed {
            display: none;
        }
        .item-content {
            display: flex;
            align-items: center;
            gap: 8px;
            min-height: 34px;
            padding: 4px 6px;
            border-radius: 8px;
            cursor: pointer;
            transition: background .14s ease;
        }
        .item-content:hover {
            background: #fdf8ef;
        }
        .item-content:focus-visible {
            outline: 2px solid #e8b86b;
            outline-offset: -2px;
            background: #fdf8ef;
        }
        .item-content-left {
            display: flex;
            align-items: center;
            gap: 7px;
            min-width: 0;
            flex: 1;
        }
        .tree-checkbox {
            appearance: none;
            width: 17px;
            height: 17px;
            flex-shrink: 0;
            margin: 0;
            border: 1.5px solid #d9c3a1;
            border-radius: 5px;
            background: #fff;
            cursor: pointer;
            position: relative;
        }
        .tree-checkbox:checked {
            border-color: #e8890c;
            background: #e8890c;
        }
        .tree-checkbox:checked::after {
            content: '✓';
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 11px;
            font-weight: 700;
        }
        .tree-checkbox:indeterminate {
            border-color: #f3b45c;
            background: #f3b45c;
        }
        .tree-checkbox:indeterminate::after {
            content: '−';
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 13px;
            font-weight: 700;
        }
        .folder-toggle {
            width: 18px;
            height: 18px;
            flex-shrink: 0;
            padding: 0;
            border: 0;
            background: transparent;
            position: relative;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #9a8972;
        }
        .folder-toggle i {
            font-size: 10px;
            transition: transform .18s ease;
        }
        .folder-toggle.open i {
            transform: rotate(90deg);
        }
        .folder-icon {
            flex-shrink: 0;
            font-size: 14px;
            line-height: 1;
            color: #d4a017;
        }
        .tree-file-icon {
            display: inline-flex;
            align-items: center;
            flex-shrink: 0;
            font-size: 13px;
            line-height: 1;
        }
        .folder,
        .tree-file-name {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .folder {
            color: #5b462e;
            font-weight: 600;
        }
        .tree-file-name {
            color: #6b5533;
        }
        .tree-count {
            flex-shrink: 0;
            margin-left: 2px;
            padding: 1px 6px;
            border-radius: 9px;
            background: #f5eee2;
            color: #9a8972;
            font-size: 9.5px;
            font-weight: 600;
        }
        .preview-button {
            width: 26px;
            height: 26px;
            flex-shrink: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            border: 0;
            border-radius: 7px;
            background: transparent;
            color: #9a8972;
            cursor: pointer;
            opacity: 0;
            transition: opacity .14s ease, background .14s ease, color .14s ease;
        }
        .item-content:hover .preview-button,
        .preview-button:focus-visible {
            opacity: 1;
        }
        .preview-button:hover {
            background: #f5eee2;
            color: #b36a00;
        }
        .preview-button .xy-icon {
            font-size: 13px;
        }
        .tree-footer {
            display: flex;
            align-items: center;
            gap: 10px;
            padding-top: 10px;
            border-top: 1px solid #f1e8d8;
        }
        #treeSelectionSummary {
            color: #9a8972;
            font-size: 11.5px;
            font-weight: 500;
        }
        #treeBulkDownloadButton {
            height: 34px;
            margin-left: auto;
            padding: 0 16px;
            border: 0;
            border-radius: 9px;
            background: #e8890c;
            color: #fff;
            font-size: 12.5px;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        #treeBulkDownloadButton:hover {
            background: #d97a00;
        }
        #treeBulkDownloadButton:disabled {
            opacity: .45;
            cursor: not-allowed;
        }
        #treeBulkDownloadButton .xy-icon {
            font-size: 14px;
        }
        .tree-placeholder,
        .tree-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 6px;
            min-height: 200px;
            color: #9a8972;
            font-size: 12.5px;
            text-align: center;
        }
        .tree-placeholder-icon {
            font-size: 38px;
        }
        .tree-placeholder strong {
            color: #6b5533;
            font-size: 14px;
        }
        .tree-loading {
            display: none;
            align-items: center;
            justify-content: center;
            min-height: 200px;
        }
        .tree-loading .loader {
            display: inline-grid;
            color: #b36a00;
            font-size: 24px;
            font-weight: 700;
        }
        .tree-loading .loader:before,
        .tree-loading .loader:after {
            content: '正在构建…';
            grid-area: 1 / 1;
            line-height: 1em;
            -webkit-mask: linear-gradient(90deg, #000 50%, #0000 0) 0 50% / 2ch 100%;
            -webkit-mask-position: calc(var(--s, 0) * 1ch) 50%;
            animation: treeLoader 2s infinite;
        }
        .tree-loading .loader:after {
            --s: -1;
        }
        @keyframes treeLoader {
            33% {
                transform: translateY(calc(var(--s, 1) * 50%));
                -webkit-mask-position: calc(var(--s, 0) * 1ch) 50%;
            }
            66% {
                transform: translateY(calc(var(--s, 1) * 50%));
                -webkit-mask-position: calc(var(--s, 0) * 1ch + 1ch) 50%;
            }
            100% {
                transform: translateY(calc(var(--s, 1) * 0%));
                -webkit-mask-position: calc(var(--s, 0) * 1ch + 1ch) 50%;
            }
        }
        #treeContent .highlight {
            padding: 0 1px;
            border-radius: 3px;
            background: #ffe9c2;
            color: #8a4b00;
        }
        #treeContent .highlight.current {
            background: #f6a723;
            color: #fff;
        }
        @media (hover: none) {
            .preview-button {
                opacity: 1;
            }
        }
        @media (max-width: 620px) {
            .tree-head-actions {
                width: 100%;
                margin-left: 0;
            }
            .tree-head-actions .tree-tool-btn {
                flex: 1;
            }
            .tree-search {
                flex-wrap: wrap;
            }
            .tree-search-box {
                flex-basis: 100%;
            }
            #treeSearchInfo {
                margin-left: auto;
            }
        }
    `;
    document.head.appendChild(style);
}
function addFolderToggle(container) {
    container.removeEventListener('click', folderToggleHandler);
    container.addEventListener('click', folderToggleHandler);
    container.removeEventListener('keydown', treeRowKeydownHandler);
    container.addEventListener('keydown', treeRowKeydownHandler);
}
function treeRowKeydownHandler(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const row = e.target.closest('.item-content');
    if (!row || e.target.closest('button, input, a')) return;
    e.preventDefault();
    row.click();
}
function folderToggleHandler(e) {
    const row = e.target.closest('.item-content');
    if (!row) return;
    if (e.target.closest('input, button:not(.folder-toggle), a')) return;
    const li = row.closest('li');
    if (!li) return;
    const ul = li.querySelector(':scope > ul');
    const toggle = row.querySelector('.folder-toggle');
    if (ul) {
        e.preventDefault();
        e.stopPropagation();
        const isExpanding = ul.classList.contains('collapsed');
        ul.classList.toggle('collapsed', !isExpanding);
        ul.classList.toggle('expanded', isExpanding);
        if (toggle) {
            toggle.classList.toggle('open', isExpanding);
            toggle.setAttribute('aria-expanded', String(isExpanding));
            const folderName = row.querySelector('.folder')?.textContent || '文件夹';
            toggle.setAttribute('aria-label', `${isExpanding ? '收起' : '展开'} ${folderName}`);
        }
        setFolderIconState(li, isExpanding);
        if (isExpanding) {
            ul.style.display = 'block';
            ul.style.height = 'auto';
            const height = ul.scrollHeight;
            ul.style.height = '0px';
            ul.offsetHeight;
            ul.style.height = height + 'px';
            ul.addEventListener('transitionend', function handler() {
                ul.style.height = 'auto';
                ul.removeEventListener('transitionend', handler);
            }, { once: true });
        } else {
            ul.style.height = ul.scrollHeight + 'px';
            ul.offsetHeight;
            ul.style.height = '0px';
            ul.addEventListener('transitionend', function handler() {
                if (ul.classList.contains('collapsed')) {
                    ul.style.display = 'none';
                }
                ul.removeEventListener('transitionend', handler);
            }, { once: true });
        }
        return;
    }
    const checkbox = row.querySelector('.tree-checkbox');
    if (checkbox) {
        e.preventDefault();
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    }
}
function updateParentCheckboxes(checkbox) {
    let currentCheckbox = checkbox;
    while (currentCheckbox) {
        const parentLi = currentCheckbox.closest('li').parentElement.closest('li');
        if (!parentLi) break;
        const parentCheckbox = parentLi.querySelector('.tree-checkbox');
        updateFolderState(parentCheckbox);
        currentCheckbox = parentCheckbox;
    }
}
function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        const allCheckboxes = document.querySelectorAll("#download_list .file-item input[type='checkbox']");
        let allChecked = true;
        for (let checkbox of allCheckboxes) {
            if (!checkbox.checked) {
                allChecked = false;
                break;
            }
        }
        selectAllCheckbox.checked = allCheckboxes.length > 0 && allChecked;
    }
}
function syncTreeWithDownloadList() {
    const treeCheckboxes = document.querySelectorAll('#treeContainer .tree-checkbox');
    const downloadCheckboxes = document.querySelectorAll('#download_list .file-item input[type="checkbox"]');
    const downloadCheckboxMap = new Map();
    downloadCheckboxes.forEach(cb => {
        const path = cb.parentElement.querySelector('a').getAttribute('data-path');
        downloadCheckboxMap.set(path, cb.checked);
    });
    treeCheckboxes.forEach(treeCheckbox => {
        const path = treeCheckbox.getAttribute('data-path');
        if (downloadCheckboxMap.has(path)) {
            treeCheckbox.checked = downloadCheckboxMap.get(path);
        }
    });
    const folderCheckboxes = Array.from(document.querySelectorAll('#treeContainer .folder-checkbox')).reverse();
    folderCheckboxes.forEach(updateFolderState);
    updateTreeSelectionSummary();
}
function updateTreeCheckbox(downloadCheckbox) {
    let path = downloadCheckbox.parentElement.querySelector('a').getAttribute('data-path');
    let treeCheckbox = document.querySelector(`#treeContainer .tree-checkbox[data-path="${path}"]`);
    if (treeCheckbox) {
        treeCheckbox.checked = downloadCheckbox.checked;
        updateParentCheckboxes(treeCheckbox);
    }
}
function updateFolderState(folderCheckbox) {
    const folderLi = folderCheckbox.closest('li');
    const allDescendants = folderLi.querySelectorAll(':scope > ul .tree-checkbox');
    if (!allDescendants.length) {
        folderCheckbox.checked = false;
        folderCheckbox.indeterminate = false;
        return;
    }
    let allChecked = true;
    let anyChecked = false;
    for (let cb of allDescendants) {
        if (cb.checked || cb.indeterminate) {
            anyChecked = true;
        }
        if (!cb.checked) {
            allChecked = false;
        }
        if (anyChecked && !allChecked) break;
    }
    folderCheckbox.checked = allChecked;
    folderCheckbox.indeterminate = !allChecked && anyChecked;
}
function add_download_button() {
    var downloadListContainer = document.createElement('div');
    downloadListContainer.id = "download_list";
    downloadListContainer.style.cssText = `
        z-index: 9999;
        backdrop-filter: blur(10px);
        border: 2px solid #fcbb34;
        border-radius: 15px;
        width: 600px;
        max-height: 600px;
        overflow-y: auto;
        padding: 20px;
        transform-origin: bottom;
        transform: scaleY(0);
        transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
        opacity: 0;
        position: fixed;
        right: 30px;
        bottom: 50px;
        background-color: rgba(255, 255, 255, 0.95);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    `;
    downloadListContainer.innerHTML = `
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 300px;
            width: 100%;
        ">
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; margin-bottom: 20px;">${xyIcon('book-open')}</div>
                <h3 style="margin-bottom: 15px;">
                    <span style="
                        background: linear-gradient(90deg, #ffa500, #ff8c00, #ffa500);
                        background-size: 200% 100%;
                        animation: flowingGradient 3s ease infinite;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        font-weight: bold;
                        font-size: 24px;
                    ">暂无课件♪(´▽｀)</span>
                </h3>
                <p style="
                    font-size: 14px;
                    font-weight: bold;
                    color: #888;
                    max-width: 400px;
                    margin: 0 auto;
                    line-height: 1.6;
                ">
                    （进入课程页面后会自动获取资源）
                </p>
            </div>
        </div>
    `;
    var downloadIconStyle = document.createElement('style');
    downloadIconStyle.innerHTML = `
        .download-icon, .preview-icon {
            background-color: rgba(255, 255, 255, 0);
            border-radius: 10px;
            cursor: pointer;
        }
    `;
    var newStyles = document.createElement('style');
    newStyles.innerHTML = `
        #download_list .file-item {
            display: flex;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid #ffeeba;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        #download_list .file-item:last-child {
            border-bottom: none;
        }
        #download_list .file-item:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }
        #download_list .file-item .custom-checkbox {
            margin-right: 10px;
            flex-shrink: 0;
        }
        #download_list .file-item .file-icon {
            margin-right: 10px;
            font-size: 20px;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            flex-shrink: 0;
        }
        #download_list .file-item .file-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex-grow: 1;
            overflow: hidden;
            max-width: calc(100% - 90px);
        }
        #download_list .file-item .file-name {
            font-size: 14px;
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #ffa500;
            line-height: 1.2;
            margin: 2px 0;
            cursor: help;
            transition: color 0.3s ease;
        }
        #download_list .file-item .file-details {
            color: #888;
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.2;
            margin: 2px 0;
            cursor: help;
            transition: color 0.3s ease;
        }
        #download_list .file-item .download-link {
            text-decoration: none;
            color: #333;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #fff3cd;
            transition: all 0.3s ease;
            flex-shrink: 0;
            margin-left: 10px;
        }
        #download_list .file-item:hover .download-link {
            background-color: #ffc107;
            color: white;
        }
        #download_list .file-item .preview-link {
            text-decoration: none;
            color: #333;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #fff3cd;
            transition: all 0.3s ease;
            flex-shrink: 0;
            margin-left: 10px;
        }
        #download_list .file-item:hover .preview-link {
            background-color: #ffc107;
            color: white;
        }
        #download_list .file-icon-document {
            background-color: #fff3cd;
            color: #e69500;
        }
        #download_list .file-icon-image {
            background-color: #fff3cd;
            color: #e69500;
        }
        #download_list .file-icon-music {
            background-color: #fff3cd;
            color: #e69500;
        }
        #download_list .file-icon-code {
            background-color: #fff3cd;
            color: #e69500;
        }
        #download_list .file-icon-archive {
            background-color: #fff3cd;
            color: #e69500;
        }
        #download_list .file-icon-default {
            background-color: #fff3cd;
            color: #e69500;
        }
    `;
    document.head.appendChild(newStyles);
    document.head.appendChild(downloadIconStyle);
    document.body.appendChild(downloadListContainer);
}
function getCookie(keyword = 'prd-access-token') {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name.includes(keyword)) {
            return value;
        }
    }
    return null;
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
        maxWidth: '800px',
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
        fontWeight: 'bold',
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
        showNotification('确定要清空所有下载历史吗？此操作不可撤销。', 'confirm',
            () => {
                const items = historyPopup.historyListElement.querySelectorAll('li');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('remove-history-item');
                    }, index * 50);
                });
                setTimeout(() => {
                    downloadHistory = [];
                    localStorage.removeItem('downloadHistory');
                    updateHistoryList();
                    showNotification('下载历史已清空', 'info');
                }, items.length * 50 + 500);
            },
            () => {
                showNotification('操作已取消', 'info');
            }
        );
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
        historyPopup.style.top = startY + 'px';
        historyPopup.style.left = startX + 'px';
        historyPopup.style.transform = 'none';
        historyPopup.classList.remove('popup-show');
        historyPopup.classList.add('popup-hide');
        historyPopup.addEventListener('animationend', function () {
            document.body.removeChild(historyPopup);
            historyPopup = null;
        }, { once: true });
    };
    buttonContainer.appendChild(clearButton);
    buttonContainer.appendChild(closeButton);
    historyPopup.appendChild(title);
    historyPopup.appendChild(historyPopup.historyListElement);
    historyPopup.appendChild(buttonContainer);
    document.body.appendChild(historyPopup);
    const searchContainer = createSearchBox();
    historyPopup.insertBefore(searchContainer, historyPopup.historyListElement);
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
    const searchIcon = document.createElement('i');
    searchIcon.className = 'fa-solid fa-magnifying-glass xy-icon';
    Object.assign(searchIcon.style, {
        position: 'absolute',
        right: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#fcbb34',
        fontSize: '16px',
        pointerEvents: 'none'
    });
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchIcon);
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
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 50);
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
        transition: 'opacity 0.3s, transform 0.3s'
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
            setTimeout(() => {
                listItem.style.opacity = '1';
                listItem.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }
    localStorage.setItem('downloadHistory', JSON.stringify(downloadHistory));
}
function showNoHistoryMessage(historyListElement) {
    const noHistory = document.createElement('div');
    noHistory.id = 'noHistoryMessage';
    noHistory.innerHTML = `
        <span style="font-size: 50px; color: #fcbb34; line-height: 1;">${xyIcon('clock-rotate-left')}</span>
        <p>暂无下载历史</p>
        <span>开始下载以添加记录 (⌐■_■)</span>
    `;
    Object.assign(noHistory.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#888',
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
        opacity: '0',
        transform: 'translateY(-20px)'
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
        fontWeight: 'bold',
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
function saveDownloadHistory(filename, url) {
    const historyItem = { filename, url, time: new Date().getTime() };
    downloadHistory.unshift(historyItem);
    const threeDaysAgo = new Date().getTime() - (3 * 24 * 60 * 60 * 1000);
    downloadHistory = downloadHistory.filter(item => item.time > threeDaysAgo);
    localStorage.setItem('downloadHistory', JSON.stringify(downloadHistory));
    if (historyPopup && historyPopup.historyListElement) {
        const noHistoryMessage = historyPopup.historyListElement.querySelector('#noHistoryMessage');
        if (noHistoryMessage) {
            noHistoryMessage.remove();
        }
        const newListItem = createHistoryListItem(historyItem, 0);
        historyPopup.historyListElement.insertBefore(newListItem, historyPopup.historyListElement.firstChild);
        setTimeout(() => {
            newListItem.classList.add('new-history-item');
        }, 10);
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
    if (!savedHistory) return;
    try {
        const parsed = JSON.parse(savedHistory);
        if (!Array.isArray(parsed)) throw new Error('invalid history');
        const threeDaysAgo = new Date().getTime() - (3 * 24 * 60 * 60 * 1000);
        downloadHistory = parsed.filter(item => item && typeof item.time === 'number' && item.time > threeDaysAgo);
        localStorage.setItem('downloadHistory', JSON.stringify(downloadHistory));
    } catch (error) {
        console.warn('下载历史数据损坏，已重置:', error);
        downloadHistory = [];
        localStorage.removeItem('downloadHistory');
    }
}
function createZipProgressIndicator() {
    const TextContainer = document.getElementById('zipTextContainer');
    if (!TextContainer) {
        console.error('zipTextContainer not found');
        return null;
    }
    TextContainer.innerHTML = '';
    const iconContainer = document.createElement('div');
    iconContainer.style.cssText = `
        margin-bottom: 10px;
        font-size: 24px;
    `;
    iconContainer.innerHTML = xyIcon('folder');
    TextContainer.appendChild(iconContainer);
    const progressText = document.createElement('p');
    progressText.style.margin = '0';
    progressText.textContent = 'ZIP导出准备就绪，等待操作...';
    TextContainer.appendChild(progressText);
    const progressBackground = document.createElement('div');
    progressBackground.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background-color: #fff;
    `;
    TextContainer.appendChild(progressBackground);
    const zipProgressBar = document.createElement('div');
    zipProgressBar.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background-color: #fcbb34;
        transition: width 0.3s ease;
    `;
    TextContainer.appendChild(zipProgressBar);
    return {
        updateProgress: (text, progress = 0) => {
            progressText.textContent = text;
            zipProgressBar.style.width = `${progress}%`;
            if (progress === 0) {
                iconContainer.innerHTML = xyIcon('folder');
            } else if (progress < 100) {
                iconContainer.innerHTML = xyIcon('file-zipper');
            } else {
                iconContainer.innerHTML = xyIcon('box-archive');
            }
        },
        hide: () => {
            progressText.textContent = 'ZIP导出准备就绪，等待操作...';
            zipProgressBar.style.width = '0%';
            iconContainer.innerHTML = xyIcon('folder');
        }
    };
}
function initializeControlPanel() {
    const controlPanel = document.createElement('div');
    controlPanel.id = 'controlPanel';
    const checkboxesContainer = document.createElement('div');
    const downloadInterfaceCheckbox = document.createElement('input');
    const downloadButtonCheckbox = document.createElement('input');
    const progressBarCheckbox = document.createElement('input');
    const videoCheckbox = document.createElement('input');
    const tipsDisplay = document.createElement('div');
    const showCourseNameText = document.createElement('div');
    controlPanel.style.display = 'none';
    controlPanel.appendChild(tipsDisplay);
    controlPanel.appendChild(showCourseNameText);
    const Beautifulupdater = document.createElement('div');
    Beautifulupdater.style.position = 'relative';
    Beautifulupdater.style.width = '200px';
    Beautifulupdater.style.margin = '20px auto';
    Beautifulupdater.style.display = 'flex';
    Beautifulupdater.style.flexDirection = 'column';
    Beautifulupdater.style.justifyContent = 'center';
    Beautifulupdater.style.alignItems = 'center';
    const versionContainer = document.createElement('div');
    versionContainer.style.textAlign = 'center';
    const versionWrapper = document.createElement('div');
    versionWrapper.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    `;
    const versionDisplay = document.createElement('div');
    versionDisplay.textContent = `V${GM_info.script.version}`;
    versionDisplay.style.cssText = `
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
    const updateTip = document.createElement('div');
    updateTip.innerHTML = `
        <div style="
            font-size: 12px;
            color: #666;
            margin-top: 5px;
            text-align: center;
        ">
            <span style="color: #e74c3c">⚡</span>
            请通过
            <a href="https://scriptcat.org/zh-CN/script-show-page/2771"
            target="_blank"
            style="
                color: #3498db;
                text-decoration: none;
                font-weight: bold;
            "
            >ScriptCat</a>
            获取更新
            <br/>
        </div>
    `;
    versionWrapper.appendChild(versionDisplay);
    versionWrapper.appendChild(updateTip);
    versionContainer.appendChild(versionWrapper);
    let clickCount = 0;
    let lastClickTime = 0;
    versionDisplay.addEventListener('click', (e) => {
        e.stopPropagation();
        const currentTime = new Date().getTime();
        if (currentTime - lastClickTime > 1000) {
            clickCount = 0;
        }
        clickCount++;
        lastClickTime = currentTime;
        if (clickCount === 5) {
            activateEasterEgg();
            clickCount = 0;
        }
    });
    versionDisplay.addEventListener('mousedown', () => {
        versionDisplay.style.transform = 'scale(0.95)';
    });
    versionDisplay.addEventListener('mouseup', () => {
        versionDisplay.style.transform = 'scale(1)';
    });
    Beautifulupdater.appendChild(versionContainer);
    const customFilterContainer = document.createElement('div');
    customFilterContainer.dataset.category = 'customFilter';
    customFilterContainer.style.display = 'none';
    function createFilterEditor() {
        const editor = document.createElement('div');
        editor.style.padding = '20px';
        editor.style.backgroundColor = 'rgba(252, 187, 52, 0.05)';
        editor.style.borderRadius = '10px';
        editor.style.marginBottom = '20px';
        editor.style.boxShadow = '0 4px 15px rgba(252, 187, 52, 0.15)';
        window.quickFilters.forEach((filter, index) => {
            if (filter.label === "全部") return;
            const filterRow = document.createElement('div');
            filterRow.style.marginBottom = '20px';
            filterRow.style.display = 'flex';
            filterRow.style.alignItems = 'center';
            filterRow.style.transition = 'all 0.3s ease';
            const labelSpan = document.createElement('span');
            labelSpan.textContent = filter.label + ': ';
            labelSpan.style.marginRight = '15px';
            labelSpan.style.fontWeight = '600';
            labelSpan.style.color = '#e67e22';
            labelSpan.style.minWidth = '70px';
            labelSpan.style.fontSize = '16px';
            labelSpan.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.1)';
            labelSpan.style.letterSpacing = '0.5px';
            const valueInput = document.createElement('input');
            valueInput.type = 'text';
            valueInput.value = filter.value;
            valueInput.placeholder = '文件扩展名（用逗号分隔）';
            valueInput.style.flex = '1';
            valueInput.style.padding = '10px 15px';
            valueInput.style.borderRadius = '6px';
            valueInput.style.border = '2px solid #fcbb34';
            valueInput.style.outline = 'none';
            valueInput.style.transition = 'all 0.3s ease';
            valueInput.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            valueInput.style.fontSize = '14px';
            valueInput.style.color = '#333';
            valueInput.style.fontWeight = 'bold';
            valueInput.style.transform = 'skew(-10deg)';
            valueInput.addEventListener('focus', () => {
                valueInput.style.boxShadow = '0 0 0 3px rgba(252, 187, 52, 0.3)';
                filterRow.style.transform = 'translateX(5px)';
                labelSpan.style.color = '#d35400';
            });
            valueInput.addEventListener('blur', () => {
                valueInput.style.boxShadow = 'none';
                filterRow.style.transform = 'translateX(0)';
                labelSpan.style.color = '#e67e22';
            });
            valueInput.addEventListener('input', () => {
                window.quickFilters[index].value = valueInput.value;
            });
            filterRow.appendChild(labelSpan);
            filterRow.appendChild(valueInput);
            editor.appendChild(filterRow);
        });
        const instructionText = document.createElement('p');
        instructionText.textContent = '注意：该规则也对树状图生效，建议是增加而不是删除。';
        instructionText.style.marginTop = '15px';
        instructionText.style.fontSize = '14px';
        instructionText.style.color = '#666';
        instructionText.style.fontStyle = 'italic';
        instructionText.style.textAlign = 'center';
        editor.appendChild(instructionText);
        return editor;
    }
    function updateFilterEditor() {
        const oldEditor = customFilterContainer.querySelector('.filter-editor');
        const buttonsContainer = customFilterContainer.querySelector('.buttons-container');
        if (oldEditor) {
            oldEditor.remove();
        }
        const newEditor = createFilterEditor();
        newEditor.classList.add('filter-editor');
        if (buttonsContainer) {
            customFilterContainer.insertBefore(newEditor, buttonsContainer);
        } else {
            customFilterContainer.appendChild(newEditor);
        }
    }
    controlPanel.appendChild(customFilterContainer);
    updateFilterEditor();
    const defaultQuickFilters = [
        { label: "全部", value: "" },
        { label: "文档", value: "doc,docx,pdf,txt,odt,rtf,html,htm,xls,xlsx,ppt,pptx,odp,xmind" },
        { label: "图片", value: "jpg,jpeg,png,gif,bmp,tiff,svg,webp,tif" },
        { label: "音频", value: "mp3,wav,ogg,flac,aac,m4a,wma,aiff,ape,midi" },
        { label: "代码", value: "py,cpp,java,js,ts,cs,php,rb,go,swift,kt,c,h,sh,bat,json,xml,yaml,yml,sql,css,scss,less" },
        { label: "压缩包", value: "zip,rar,7z,gz,bz2,tar" }
    ];
    function createSaveAndResetButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('buttons-container');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.marginTop = '20px';
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存设置';
        saveButton.title = '保存设置并刷新页面';
        const resetButton = document.createElement('button');
        resetButton.textContent = '重置设置';
        resetButton.title = '重置为默认设置并刷新页面';
        const buttonStyle = `
            background-color: #3498db;
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
        saveButton.style.cssText = buttonStyle;
        resetButton.style.cssText = buttonStyle;
        resetButton.style.backgroundColor = '#e74c3c';
        const addHoverEffect = (button, defaultColor, hoverColor) => {
            button.onmouseover = function () {
                this.style.backgroundColor = hoverColor;
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)';
            };
            button.onmouseout = function () {
                this.style.backgroundColor = defaultColor;
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
            };
        };
        addHoverEffect(saveButton, '#3498db', '#2980b9');
        addHoverEffect(resetButton, '#e74c3c', '#c0392b');
        saveButton.onclick = () => {
            try {
                localStorage.setItem('customQuickFilters', JSON.stringify(window.quickFilters));
                showNotification('设置已保存，页面将在3秒后自动刷新以应用修改', 'info');
                setTimeout(() => {
                    location.reload();
                }, 3000);
            } catch (error) {
                showNotification('保存设置时出错，请重试', 'warning');
            }
        };
        resetButton.onclick = () => {
            showNotification('确定要重置所有过滤器设置吗？', 'confirm',
                () => {
                    window.quickFilters = JSON.parse(JSON.stringify(defaultQuickFilters));
                    localStorage.removeItem('customQuickFilters');
                    showNotification('设置已重置为默认值，页面将在3秒后自动刷新以应用修改', 'info');
                    setTimeout(() => {
                        location.reload();
                    }, 3000);
                },
                () => {
                    showNotification('重置操作已取消', 'info');
                }
            );
        };
        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(resetButton);
        return buttonContainer;
    }
    customFilterContainer.appendChild(createSaveAndResetButtons());
    const styleSheet1 = document.createElement('style');
    styleSheet1.type = 'text/css';
    styleSheet1.innerText = `
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
            background-color: #FF8C00;
        }
        .slider:hover {
            box-shadow: 0 0 5px rgba(255, 140, 0, 0.5);
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
        }
    `;
    document.head.appendChild(styleSheet1);
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
    function initializeCheckboxState(checkbox, index) {
        const savedState = localStorage.getItem(`xy-checkbox-${index}`);
        checkbox.checked = savedState === null ? true : savedState === 'true';
        progressBarCheckbox.addEventListener('change', () => {
            isProgressBarVisible = progressBarCheckbox.checked;
            updateVisibility();
        });
    }
    function saveCheckboxState(checkbox, index) {
        localStorage.setItem(`xy-checkbox-${index}`, checkbox.checked);
    }
    [downloadInterfaceCheckbox, downloadButtonCheckbox, progressBarCheckbox, videoCheckbox].forEach((checkbox, index) => {
        checkbox.type = 'checkbox';
        initializeCheckboxState(checkbox, index);
        checkbox.id = `checkbox-${index}`;
        checkbox.style.display = 'none';
        const label = document.createElement('label');
        label.className = 'switch';
        label.htmlFor = `checkbox-${index}`;
        const slider = document.createElement('span');
        slider.className = 'slider';
        label.appendChild(checkbox);
        label.appendChild(slider);
        const labelText = document.createElement('span');
        labelText.textContent = ['当前页课件卡片', '课程附件与导出', '下载进度', '视频源检测'][index];
        labelText.style.color = '#fcbb34';
        labelText.style.marginRight = '15px';
        labelText.style.fontWeight = '600';
        labelText.style.fontSize = '16px';
        labelText.style.letterSpacing = '0.5px';
        labelText.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.1)';
        labelText.style.transition = 'all 0.3s ease';
        labelText.style.cursor = 'pointer';
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
                updateDownloadListVisibility();
            } else {
                updateVisibility();
            }
            saveCheckboxState(checkbox, index);
        });
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.justifyContent = 'space-between';
        container.style.alignItems = 'center';
        container.style.padding = '10px';
        container.style.position = 'relative';
        container.appendChild(labelText);
        container.appendChild(label);
        checkboxesContainer.appendChild(container);
    });
    const messageButtonContainer = document.createElement('div');
    messageButtonContainer.style.display = 'flex';
    messageButtonContainer.style.justifyContent = 'space-between';
    messageButtonContainer.style.marginTop = '10px';
    const markReadButton = document.createElement('button');
    markReadButton.id = 'markReadButton';
    markReadButton.textContent = '已读所有消息';
    markReadButton.title = '标记所有消息为已读并刷新页面';
    markReadButton.style.cssText = `
        background-color: #2ecc71;
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
    markReadButton.onmouseover = function () {
        this.style.backgroundColor = '#27ae60';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)';
    };
    markReadButton.onmouseout = function () {
        this.style.backgroundColor = '#2ecc71';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    };
    markReadButton.onclick = async function () {
        try {
            this.disabled = true;
            this.textContent = '正在处理...';
            const result = await markAllMessagesAsRead();
            if (result.hasUnreadMessages) {
                showNotification('所有消息已标记为已读，页面将刷新', 'info');
                location.reload();
            } else {
                showNotification('没有未读消息', 'info');
            }
        } catch (error) {
            console.error('Error marking messages as read:', error);
            showNotification('标记消息时出错，请重试', 'warning');
        } finally {
            this.disabled = false;
            this.textContent = '已读所有消息';
        }
    };
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
                    if (!response.ok) {
                        throw new Error(`获取未读${messageType}消息失败: ${response.status} ${response.statusText}`);
                    }
                    const data = await response.json();
                    const messages = data.data.list;
                    if (messages.length === 0 || pageIndex * pageSize >= data.data.total) {
                        break;
                    }
                    unreadMessageIds = unreadMessageIds.concat(messages.map(message => message.id));
                    pageIndex++;
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
                    if (!updateResponse.ok) {
                        throw new Error(`标记${messageType}消息失败: ${updateResponse.status} ${updateResponse.statusText}`);
                    }
                    console.log(`所有${messageType}消息已标记为已读`);
                } else {
                    console.log(`没有未读${messageType}消息`);
                }
            } catch (error) {
                console.error(`Error processing ${messageType} messages:`, error);
                throw error;
            }
        }
        try {
            const updateCountResponse = await fetch(`https://${hostname}/api/jx-iresource/message/im/un_read_count`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!updateCountResponse.ok) {
                throw new Error(`更新未读消息计数失败: ${updateCountResponse.status} ${updateCountResponse.statusText}`);
            }
            const countData = await updateCountResponse.json();
            console.log("未读消息计数已更新:", countData);
        } catch (error) {
            console.error("更新未读消息计数时发生错误:", error);
        }
        return { hasUnreadMessages };
    }
    const clearMessagesButton = document.createElement('button');
    clearMessagesButton.id = 'clearMessagesButton';
    clearMessagesButton.textContent = '清空所有消息';
    clearMessagesButton.title = '清空所有消息并刷新页面';
    clearMessagesButton.style.cssText = `
        background-color: #e74c3c;
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
    clearMessagesButton.onmouseover = function () {
        this.style.backgroundColor = '#c0392b';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)';
    };
    clearMessagesButton.onmouseout = function () {
        this.style.backgroundColor = '#e74c3c';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    };
    clearMessagesButton.onclick = function () {
        showNotification("确定要清空所有消息吗？该操作无法撤销。", 'confirm',
            async () => {
                try {
                    this.disabled = true;
                    this.textContent = '正在清空...';
                    const result = await clearAllMessages();
                    if (result.hasMessagesToClear) {
                        showNotification('所有消息已清空，页面将在3秒后刷新', 'info');
                        setTimeout(() => {
                            location.reload();
                        }, 3000);
                    } else {
                        showNotification('没有消息可清空', 'info');
                    }
                } catch (error) {
                    console.error('Error clearing messages:', error);
                    showNotification('清空消息时出错，请重试', 'error');
                } finally {
                    this.disabled = false;
                    this.textContent = '清空所有消息';
                }
            },
            () => {
                showNotification('清空操作已取消', 'info');
            }
        );
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
                    if (!response.ok) {
                        throw new Error(`获取${messageType}消息失败: ${response.status} ${response.statusText}`);
                    }
                    const data = await response.json();
                    const messages = data.data.list;
                    if (messages.length === 0 || pageIndex * pageSize >= data.data.total) {
                        break;
                    }
                    messageIdsToClear = messageIdsToClear.concat(messages.map(message => message.id));
                    pageIndex++;
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
                    if (!clearResponse.ok) {
                        const errorText = await clearResponse.text();
                        throw new Error(`清空${messageType}消息失败: ${errorText}`);
                    }
                    console.log(`所有${messageType}消息已清空`);
                } else {
                    console.log(`没有${messageType}消息可清空`);
                }
            } catch (error) {
                console.error(`Error processing ${messageType} messages:`, error);
                throw error;
            }
        }
        try {
            const updateCountResponse = await fetch(`https://${hostname}/api/jx-iresource/message/im/un_read_count`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!updateCountResponse.ok) {
                throw new Error(`更新未读消息计数失败: ${updateCountResponse.status} ${updateCountResponse.statusText}`);
            }
            const countData = await updateCountResponse.json();
            console.log("未读消息计数已更新:", countData);
        } catch (error) {
            console.error("更新未读消息计数时发生错误:", error);
        }
        return { hasMessagesToClear };
    }
    messageButtonContainer.appendChild(markReadButton);
    messageButtonContainer.appendChild(clearMessagesButton);
    const downloadButtonContainer = document.createElement('div');
    downloadButtonContainer.style.display = 'flex';
    downloadButtonContainer.style.justifyContent = 'space-between';
    downloadButtonContainer.style.marginTop = '10px';
    const showHistoryButton = document.createElement('button');
    showHistoryButton.id = 'showHistoryButton';
    showHistoryButton.textContent = '查看下载历史';
    showHistoryButton.title = '导出的文件不会被记录';
    showHistoryButton.style.cssText = `
        background-color: #3498db;
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
    showHistoryButton.onmouseover = function () {
        showHistoryButton.style.backgroundColor = '#2980b9';
        showHistoryButton.style.transform = 'translateY(-2px)';
        showHistoryButton.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)';
    };
    showHistoryButton.onmouseout = function () {
        showHistoryButton.style.backgroundColor = '#3498db';
        showHistoryButton.style.transform = 'translateY(0)';
        showHistoryButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    };
    showHistoryButton.onclick = showDownloadHistory;
    downloadButtonContainer.appendChild(showHistoryButton);
    const thirdPartyDownloadButton = document.createElement('button');
    thirdPartyDownloadButton.id = 'thirdPartyDownloadButton';
    thirdPartyDownloadButton.title = '切换下载方式';
    thirdPartyDownloadButton.style.cssText = `
        background-color: #f39c12;
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
    thirdPartyDownloadButton.onmouseover = function () {
        thirdPartyDownloadButton.style.transform = 'translateY(-2px)';
        thirdPartyDownloadButton.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)';
    };
    thirdPartyDownloadButton.onmouseout = function () {
        thirdPartyDownloadButton.style.transform = 'translateY(0)';
        thirdPartyDownloadButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    };
    let useThirdPartyDownload = localStorage.getItem('useThirdPartyDownload') === 'true';
    updateThirdPartyDownloadButtonState();
    thirdPartyDownloadButton.onclick = function () {
        useThirdPartyDownload = !useThirdPartyDownload;
        localStorage.setItem('useThirdPartyDownload', useThirdPartyDownload);
        updateThirdPartyDownloadButtonState();
    };
    function updateThirdPartyDownloadButtonState() {
        if (useThirdPartyDownload) {
            thirdPartyDownloadButton.textContent = '用第三方下载';
            thirdPartyDownloadButton.style.backgroundColor = '#27ae60';
        } else {
            thirdPartyDownloadButton.textContent = '用浏览器下载';
            thirdPartyDownloadButton.style.backgroundColor = '#f39c12';
        }
    }
    downloadButtonContainer.appendChild(thirdPartyDownloadButton);
    const exportButtonContainer = document.createElement('div');
    exportButtonContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        padding: 10px;
        background-color: rgba(252, 187, 52, 0.1);
        border-radius: 8px;
    `;
    const TextContainer = document.createElement('div');
    TextContainer.id = 'zipTextContainer';
    TextContainer.style.cssText = `
        margin-top: 15px;
        padding: 15px 20px;
        background-color: #fff;
        border: 2px solid #fcbb34;
        border-radius: 12px;
        font-size: 14px;
        font-weight: bold;
        color: #333;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    `;
    function createCustomDropdown(container, options) {
        const dropdownContainer = document.createElement('div');
        dropdownContainer.className = 'custom-dropdown';
        dropdownContainer.style.cssText = `
            position: relative;
            width: 250px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        const selectedOption = document.createElement('div');
        selectedOption.className = 'selected-option';
        selectedOption.textContent = options[0].text;
        selectedOption.style.cssText = `
            padding: 12px 40px 12px 15px;
            font-size: 16px;
            font-weight: bold;
            border: 2px solid #fcbb34;
            border-radius: 8px;
            background-color: #fff;
            color: #333;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(252, 187, 52, 0.2);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            letter-spacing: 0.3px;
            line-height: 1.4;
        `;
        const arrow = document.createElement('div');
        arrow.className = 'dropdown-arrow';
        arrow.style.cssText = `
            position: absolute;
            top: 50%;
            right: 15px;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid #fcbb34;
            transition: all 0.3s ease;
            cursor: pointer;
        `;
        const optionsList = document.createElement('ul');
        optionsList.className = 'options-list';
        optionsList.style.cssText = `
            position: fixed;
            background-color: #fff;
            border: 2px solid #e67e22;
            border-top: none;
            border-radius: 0 0 8px 8px;
            list-style-type: none;
            margin: 0;
            padding: 0;
            max-height: 250px;
            overflow-y: auto;
            display: none;
            z-index: 10001;
            box-shadow: 0 4px 10px rgba(230, 126, 34, 0.2);
        `;
        options.forEach(option => {
            const li = document.createElement('li');
            li.textContent = option.text;
            li.dataset.value = option.value;
            li.style.cssText = `
                padding: 12px 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 15px;
                font-weight: bold;
                color: #555;
                border-bottom: 1px solid #f0f0f0;
                letter-spacing: 0.2px;
                line-height: 1.3;
            `;
            li.onmouseover = () => {
                li.style.backgroundColor = '#fff5e6';
                li.style.color = '#e67e22';
            };
            li.onmouseout = () => {
                li.style.backgroundColor = '#fff';
                li.style.color = '#555';
            };
            li.onclick = (event) => {
                event.stopPropagation();
                selectedOption.textContent = option.text;
                optionsList.style.display = 'none';
                arrow.style.transform = 'translateY(-50%) rotate(0deg)';
                selectedOption.style.borderRadius = '8px';
                selectedOption.style.borderBottom = '2px solid #fcbb34';
                selectedOption.style.borderColor = '#fcbb34';
                selectedOption.style.color = '#333';
            };
            optionsList.appendChild(li);
        });
        function positionOptionsList() {
            const rect = selectedOption.getBoundingClientRect();
            optionsList.style.width = `${rect.width}px`;
            optionsList.style.left = `${rect.left}px`;
            const spaceBelow = window.innerHeight - rect.bottom;
            if (spaceBelow < 200 && rect.top > spaceBelow) {
                optionsList.style.top = 'auto';
                optionsList.style.bottom = `${window.innerHeight - rect.top + 2}px`;
                optionsList.style.borderTop = '2px solid #e67e22';
                optionsList.style.borderBottom = 'none';
                optionsList.style.borderRadius = '8px 8px 0 0';
                selectedOption.style.borderTopLeftRadius = '0';
                selectedOption.style.borderTopRightRadius = '0';
                selectedOption.style.borderTop = 'none';
            } else {
                optionsList.style.top = `${rect.bottom - 2}px`;
                optionsList.style.bottom = 'auto';
                optionsList.style.borderTop = 'none';
                optionsList.style.borderBottom = '2px solid #e67e22';
                optionsList.style.borderRadius = '0 0 8px 8px';
            }
        }
        function toggleDropdown(event) {
            event.stopPropagation();
            const isOpen = optionsList.style.display === 'block';
            if (!isOpen) {
                positionOptionsList();
                selectedOption.style.borderBottomLeftRadius = '0';
                selectedOption.style.borderBottomRightRadius = '0';
                selectedOption.style.borderBottom = 'none';
                selectedOption.style.borderColor = '#e67e22';
                selectedOption.style.color = '#e67e22';
                optionsList.style.display = 'block';
                optionsList.style.borderTop = 'none';
            } else {
                selectedOption.style.borderRadius = '8px';
                selectedOption.style.borderBottom = '2px solid #fcbb34';
                selectedOption.style.borderColor = '#fcbb34';
                selectedOption.style.color = '#333';
                optionsList.style.display = 'none';
            }
            arrow.style.transform = isOpen
                ? 'translateY(-50%) rotate(0deg)'
                : 'translateY(-50%) rotate(180deg)';
        }
        selectedOption.onclick = toggleDropdown;
        arrow.onclick = (event) => {
            event.stopPropagation();
            toggleDropdown(event);
        };
        document.addEventListener('click', () => {
            optionsList.style.display = 'none';
            arrow.style.transform = 'translateY(-50%) rotate(0deg)';
            selectedOption.style.borderRadius = '8px';
            selectedOption.style.borderBottom = '2px solid #fcbb34';
            selectedOption.style.borderColor = '#fcbb34';
            selectedOption.style.color = '#333';
        });
        window.addEventListener('resize', () => {
            if (optionsList.style.display === 'block') {
                positionOptionsList();
            }
        });
        dropdownContainer.appendChild(selectedOption);
        dropdownContainer.appendChild(arrow);
        document.body.appendChild(optionsList);
        container.appendChild(dropdownContainer);
        return { dropdownContainer, optionsList };
    }
    const selectWrapper = document.createElement('div');
    selectWrapper.style.cssText = `
        position: relative;
        margin-right: 15px;
    `;
    const formats = [
        { value: 'ef2', text: 'EF2 格式 (IDM专用)' },
        { value: 'txt', text: 'TXT 格式 (通用)' },
        { value: 'json', text: 'JSON 格式 (结构化数据)' },
        { value: 'csv', text: 'CSV 格式 (电子表格)' },
        { value: 'zip', text: 'ZIP 格式 (压缩文件)' }
    ];
    const { dropdownContainer, optionsList } = createCustomDropdown(selectWrapper, formats);
    const exportButton = document.createElement('button');
    exportButton.id = 'exportButton';
    exportButton.textContent = '导出文件';
    exportButton.style.cssText = `
        background-color: #fcbb34;
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
    exportButton.onmouseover = function () {
        this.style.backgroundColor = '#e67e22';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)';
    };
    exportButton.onmouseout = function () {
        this.style.backgroundColor = '#fcbb34';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    };
    exportButton.onclick = function () {
        const selectedOption = dropdownContainer.querySelector('.selected-option');
        const selectedFormat = selectedOption.textContent.includes('EF2') ? 'ef2' :
            selectedOption.textContent.includes('JSON') ? 'json' :
                selectedOption.textContent.includes('CSV') ? 'csv' :
                    selectedOption.textContent.includes('ZIP') ? 'zip' : 'txt';
        if (selectedFormat === 'ef2') {
            exportToEf2();
        } else if (selectedFormat === 'txt') {
            exportToTxt();
        } else if (selectedFormat === 'json') {
            exportToJson();
        } else if (selectedFormat === 'csv') {
            exportToCsv();
        } else if (selectedFormat === 'zip') {
            exportToZip();
        }
    };
    exportButtonContainer.appendChild(selectWrapper);
    exportButtonContainer.appendChild(exportButton);
    addShowCourseNameText();
    window.xyTips = addTipsDisplay();
    async function exportToEf2() {
        const checkedCheckboxes = document.querySelectorAll("#download_list input[type='checkbox']:checked:not(#selectAllCheckbox)");
        const selectedFiles = Array.from(checkedCheckboxes).reduce((acc, checkbox) => {
            const container = checkbox.closest('div');
            if (!container) return acc;
            const link = container.querySelector('a.download-link');
            if (!link) return acc;
            const quoteId = link.getAttribute('data-quote-id');
            const filename = link.getAttribute('data-origin-name');
            if (!quoteId || !filename) return acc;
            acc.push({ quoteId, filename });
            return acc;
        }, []);
        if (selectedFiles.length === 0) {
            showNotification('请选择要导出的文件', 'warning');
            return;
        }
        showNotification('正在获取下载链接...', 'info');
        try {
            const filesWithUrls = await Promise.all(
                selectedFiles.map(async file => {
                    const url = await window.getDownloadUrl(file.quoteId);
                    return { ...file, url };
                })
            );
            const referer = window.location.href;
            const cookieString = document.cookie;
            let ef2Content = '';
            filesWithUrls.forEach(file => {
                ef2Content += '<\r\n';
                ef2Content += `${file.url}\r\n`;
                ef2Content += `referer: ${referer}\r\n`;
                ef2Content += `cookie: ${cookieString}\r\n`;
                ef2Content += `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0\r\n`;
                ef2Content += '>\r\n';
            });
            ef2Content += '\r\n';
            const blob = new Blob([ef2Content], { type: 'text/plain' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `${await getCourseName()}_课件链接.ef2`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            showNotification('导出成功!', 'info');
        } catch (error) {
            console.error('导出ef2文件时发生错误:', error);
            showNotification('导出失败,请重试', 'error');
        }
    }
    async function exportToTxt() {
        const checkedCheckboxes = document.querySelectorAll("#download_list input[type='checkbox']:checked:not(#selectAllCheckbox)");
        const selectedFiles = Array.from(checkedCheckboxes).reduce((acc, checkbox) => {
            const container = checkbox.closest('div');
            if (!container) return acc;
            const link = container.querySelector('a.download-link');
            if (!link) return acc;
            const quoteId = link.getAttribute('data-quote-id');
            if (!quoteId) return acc;
            acc.push(quoteId);
            return acc;
        }, []);
        if (selectedFiles.length === 0) {
            showNotification('请选择要导出的文件', 'info');
            return;
        }
        showNotification('正在获取下载链接...', 'info');
        try {
            const urls = await Promise.all(
                selectedFiles.map(quoteId => window.getDownloadUrl(quoteId))
            );
            let txtContent = urls.join('\r\n');
            console.log('TXT 内容长度:', txtContent.length);
            const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `${await getCourseName()}_课件链接.txt`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            showNotification('导出成功!', 'info');
        } catch (error) {
            console.error('导出txt文件时发生错误:', error);
            showNotification('导出失败,请重试', 'error');
        }
    }
    async function exportToJson() {
        const checkedCheckboxes = document.querySelectorAll("#download_list input[type='checkbox']:checked:not(#selectAllCheckbox)");
        const courseName = await getCourseName();
        const selectedFiles = Array.from(checkedCheckboxes).reduce((acc, checkbox) => {
            const container = checkbox.closest('div');
            if (checkbox.id === 'selectAllCheckbox') {
                return acc;
            }
            if (!container) {
                return acc;
            }
            const link = container.querySelector('a.download-link');
            if (!link) {
                return acc;
            }
            acc.push({
                quoteId: link.getAttribute('data-quote-id'),
                filename: link.getAttribute('data-origin-name'),
                course: courseName,
                createdAt: link.getAttribute('data-created-at'),
                updatedAt: link.getAttribute('data-updated-at'),
                resourceId: link.getAttribute('data-resource-id'),
                path: link.getAttribute('data-path'),
                parentId: link.getAttribute('data-parent-id')
            });
            return acc;
        }, []);
        if (selectedFiles.length === 0) {
            showNotification('请选择要导出的文件', 'warning');
            return;
        }
        showNotification('正在获取下载链接...', 'info');
        try {
            const filesWithUrls = await Promise.all(
                selectedFiles.map(async file => {
                    const url = await window.getDownloadUrl(file.quoteId);
                    return { ...file, url };
                })
            );
            const jsonContent = JSON.stringify({
                exportDate: new Date().toISOString(),
                totalFiles: filesWithUrls.length,
                files: filesWithUrls
            }, null, 2);
            console.log('JSON 内容长度:', jsonContent.length);
            const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `${await getCourseName()}_课件数据.json`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            showNotification('导出成功!', 'info');
        } catch (error) {
            console.error('导出json文件时发生错误:', error);
            showNotification('导出失败,请重试', 'error');
        }
    }
    async function exportToCsv() {
        const checkedCheckboxes = document.querySelectorAll("#download_list input[type='checkbox']:checked:not(#selectAllCheckbox)");
        const headers = ['URL', '文件名', '课程', '创建时间', '更新时间', '资源ID', '路径', '父ID'];
        let csvContent = headers.join(',') + '\n';
        const courseName = await getCourseName();
        const selectedFiles = Array.from(checkedCheckboxes).reduce((acc, checkbox) => {
            const container = checkbox.closest('div');
            if (checkbox.id === 'selectAllCheckbox') return acc;
            if (!container) return acc;
            const link = container.querySelector('a.download-link');
            if (!link) return acc;
            acc.push({
                quoteId: link.getAttribute('data-quote-id'),
                filename: link.getAttribute('data-origin-name'),
                course: courseName,
                createdAt: link.getAttribute('data-created-at'),
                updatedAt: link.getAttribute('data-updated-at'),
                resourceId: link.getAttribute('data-resource-id'),
                path: link.getAttribute('data-path'),
                parentId: link.getAttribute('data-parent-id')
            });
            return acc;
        }, []);
        if (selectedFiles.length === 0) {
            showNotification('请选择要导出的文件', 'warning');
            return;
        }
        showNotification('正在获取下载链接...', 'info');
        try {
            const filesWithUrls = await Promise.all(
                selectedFiles.map(async file => {
                    const url = await window.getDownloadUrl(file.quoteId);
                    return { ...file, url };
                })
            );
            csvContent = headers.join(',') + '\n';
            filesWithUrls.forEach(file => {
                const row = [
                    file.url,
                    file.filename,
                    file.course,
                    file.createdAt,
                    file.updatedAt,
                    file.resourceId,
                    file.path,
                    file.parentId
                ].map(item => `"${(item || '').replace(/"/g, '""')}"`);
                csvContent += row.join(',') + '\n';
            });
            console.log('CSV 内容长度:', csvContent.length);
            const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `${await getCourseName()}_课件表格.csv`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            showNotification('导出成功!', 'info');
        } catch (error) {
            console.error('导出CSV文件时发生错误:', error);
            showNotification('导出失败,请重试', 'error');
        }
    }
    async function exportToZip() {
        const progressIndicator = createZipProgressIndicator();
        if (!progressIndicator) {
            return;
        }
        const { updateProgress, hide } = progressIndicator;
        updateProgress("正在准备导出...", 0);
        const checkedCheckboxes = document.querySelectorAll("#download_list input[type='checkbox']:checked:not(#selectAllCheckbox)");
        const selectedFiles = Array.from(checkedCheckboxes).reduce((acc, checkbox) => {
            const container = checkbox.closest('div');
            if (!container) return acc;
            const link = container.querySelector('a.download-link');
            if (!link) return acc;
            const quoteId = link.getAttribute('data-quote-id');
            const filename = link.getAttribute('data-origin-name');
            if (!quoteId || !filename) return acc;
            acc.push({ quoteId, filename });
            return acc;
        }, []);
        if (selectedFiles.length === 0) {
            updateProgress('请选择要导出的文件', 0);
            setTimeout(hide, 3000);
            return;
        }
        const proceedWithZip = async () => {
            const zip = new window.JSZip();
            const totalFiles = selectedFiles.length;
            let processedFiles = 0;
            updateProgress("正在获取下载链接...", 5);
            try {
                const filesWithUrls = await Promise.all(
                    selectedFiles.map(async file => {
                        const url = await window.getDownloadUrl(file.quoteId);
                        return { ...file, url };
                    })
                );
                updateProgress("正在准备ZIP文件...", 20);
                const addFilePromises = filesWithUrls.map(file => {
                    return fetch(file.url)
                        .then(response => response.blob())
                        .then(blob => {
                            zip.file(file.filename, blob);
                            processedFiles++;
                            const progress = 20 + (processedFiles / totalFiles) * 60;
                            updateProgress(`正在添加文件 (${processedFiles}/${totalFiles})...`, progress);
                        })
                        .catch(error => {
                            console.error(`获取文件失败: ${file.filename}`, error);
                            throw error;
                        });
                });
                const courseName = await getCourseName();
                await Promise.all(addFilePromises);
                updateProgress("正在生成ZIP文件...", 80);
                const content = await zip.generateAsync({ type: "blob" });
                updateProgress("ZIP文件已生成，准备下载...", 90);
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(content);
                downloadLink.download = `${courseName}_课件包.zip`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                updateProgress("ZIP文件下载已开始", 100);
                setTimeout(hide, 3000);
            } catch (error) {
                updateProgress("创建ZIP文件时发生错误，请查看控制台获取详细信息。", 0);
                console.error("创建ZIP文件出错:", error);
                setTimeout(() => {
                    hide();
                    showInterceptionMessage("创建ZIP文件时发生错误，可能是网络问题或被IDM拦截");
                }, 1000);
            }
        };
        if (selectedFiles.length > 10) {
            showNotification(
                `已选择 ${selectedFiles.length} 个文件，压缩大量文件可能需要较长时间。是否继续？`,
                'confirm',
                () => {
                    proceedWithZip();
                },
                () => {
                    hide();
                    showNotification('压缩操作已取消', 'info');
                }
            );
        } else {
            proceedWithZip();
        }
    }
    function showInterceptionMessage(message) {
        const messageHTML = `
            <div id="interceptionMessage" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #fff9e6;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(255, 165, 0, 0.2);
                max-width: 550px;
                width: 90%;
                z-index: 9999;
                animation: fadeIn 0.5s ease-out;
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                ">
                    <span style="
                        font-size: 28px;
                        margin-right: 15px;
                    ">⚠️</span>
                    <h3 style="
                        color: #ffa500;
                        margin: 0;
                        font-size: 24px;
                        font-weight: bold;
                    ">下载遇到问题</h3>
                </div>
                <p style="
                    color: #5d4037;
                    font-size: 16px;
                    line-height: 1.6;
                    margin-bottom: 20px;
                ">${message}</p>
                <p style="
                    color: #33691e;
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 15px;
                ">可能的解决方法：</p>
                <ol style="
                    color: #5d4037;
                    font-size: 14px;
                    line-height: 1.7;
                    padding-left: 0;
                    margin-bottom: 25px;
                    list-style-type: none;
                    counter-reset: item;
                ">
                    <li style="
                        margin-bottom: 15px;
                        position: relative;
                        padding-left: 35px;
                        counter-increment: item;
                    ">
                        <i class="fa-solid fa-circle-info xy-icon" style="position: absolute; left: 0; top: 0; font-size: 24px; color: #ffa500;" aria-hidden="true"></i>
                        网络问题：请检查网络连接，稍后重试。
                    </li>
                    <li style="
                    margin-bottom: 15px;
                    position: relative;
                    padding-left: 35px;
                    counter-increment: item;
                ">
                    <i class="fa-solid fa-table-cells-large xy-icon" style="position: absolute; left: 0; top: 0; font-size: 24px; color: #ffa500;" aria-hidden="true"></i>
                    IDM拦截：如果你在使用IDM，以下是一种绕过手段：
                    <ul style="
                        padding-left: 20px;
                        margin-top: 10px;
                        list-style-type: none;
                    ">
                        <li style="margin-bottom: 10px; position: relative; padding-left: 25px;">
                            <i class="fa-solid fa-chevron-right xy-icon" style="position: absolute; left: 0; top: 2px; font-size: 18px; color: #ffa500;" aria-hidden="true"></i>
                            在 IDM 中，转到“下载” > "选项"
                        </li>
                        <li style="margin-bottom: 10px; position: relative; padding-left: 25px;">
                            <i class="fa-solid fa-chevron-right xy-icon" style="position: absolute; left: 0; top: 2px; font-size: 18px; color: #ffa500;" aria-hidden="true"></i>
                            选择“文件类型”标签
                        </li>
                        <li style="margin-bottom: 10px; position: relative; padding-left: 25px;">
                            <i class="fa-solid fa-chevron-right xy-icon" style="position: absolute; left: 0; top: 2px; font-size: 18px; color: #ffa500;" aria-hidden="true"></i>
                            在“下列站点不要自动开始下载”中添加 oss.ai-augmented.com（以空格分隔）
                        </li>
                        <li style="margin-bottom: 10px; position: relative; padding-left: 25px;">
                            <i class="fa-solid fa-chevron-right xy-icon" style="position: absolute; left: 0; top: 2px; font-size: 18px; color: #ffa500;" aria-hidden="true"></i>
                            点击“确定”保存设置
                        </li>
                        <li style="margin-bottom: 10px; position: relative; padding-left: 25px;">
                            <i class="fa-solid fa-chevron-right xy-icon" style="position: absolute; left: 0; top: 2px; font-size: 18px; color: #ffa500;" aria-hidden="true"></i>
                            当然，你也可以在IDM的弹窗里选择“该站点不要自动开始下载(oss.ai-augmented.com)”
                        </li>
                    </ul>
                </li>
                    <li style="
                        margin-bottom: 15px;
                        position: relative;
                        padding-left: 35px;
                        counter-increment: item;
                    ">
                        <i class="fa-solid fa-arrows-rotate xy-icon" style="position: absolute; left: 0; top: 0; font-size: 24px; color: #ffa500;" aria-hidden="true"></i>
                        也许我们可以试试刷新？（小声）
                    </li>
                </ol>
                <button onclick="
                const msgEl = document.getElementById('interceptionMessage');
                msgEl.style.animation = 'fadeOut 0.5s ease-out';
                setTimeout(() => msgEl.remove(), 500);
            " style="
                background-color: #ffa500;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s;
                display: block;
                margin: 0 auto;
                box-shadow: 0 4px 6px rgba(255, 165, 0, 0.2);
            ">我知道了</button>
            </div>
        `;
        const messageElement = document.createElement('div');
        messageElement.innerHTML = messageHTML;
        document.body.appendChild(messageElement);
        const button = messageElement.querySelector('button');
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#ff8c00';
            button.style.transform = 'translateY(-2px)';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#ffa500';
            button.style.transform = 'translateY(0)';
        });
    }
    function getCourseName() {
        if (courseVisitData && courseVisitData.name) {
            return courseVisitData.name;
        } else {
            console.debug('无法从课程访问数据中获取课程名称');
            return '未知课程';
        }
    }
    function addShowCourseNameText() {
        showCourseNameText.id = 'showCourseNameText';
        showCourseNameText.style.marginTop = '10px';
        showCourseNameText.style.marginBottom = '10px';
        showCourseNameText.style.fontSize = '16px';
        showCourseNameText.style.backgroundColor = 'transparent';
        showCourseNameText.style.width = '100%';
        showCourseNameText.style.textAlign = 'center';
        showCourseNameText.style.fontWeight = '600';
        showCourseNameText.style.letterSpacing = '0.5px';
        showCourseNameText.style.padding = '6px';
        showCourseNameText.style.boxSizing = 'border-box';
        showCourseNameText.className = 'glowing-text animated-text';
        showCourseNameText.textContent = '正在获取课程信息...';
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
        let checkInterval = setInterval(async () => {
            try {
                const courseName = await getCourseName();
                if (courseName && courseName !== '未知课程' && courseName !== showCourseNameText.getAttribute('data-course')) {
                    showCourseNameText.setAttribute('data-course', courseName);
                    typeWriter(`当前课程：${courseName}`, showCourseNameText);
                    clearInterval(checkInterval);
                    setupCourseNameObserver();
                }
            } catch (error) {
                console.debug('尝试获取课程名称:', error);
            }
        }, 1000);
        setTimeout(() => clearInterval(checkInterval), 30000);
        function setupCourseNameObserver() {
            const observer = new MutationObserver(async () => {
                try {
                    const courseName = await getCourseName();
                    if (courseName && courseName !== showCourseNameText.getAttribute('data-course')) {
                        showCourseNameText.setAttribute('data-course', courseName);
                        typeWriter(`当前课程：${courseName}`, showCourseNameText);
                    }
                } catch (error) {
                    console.debug('课程名称观察器错误:', error);
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: false
            });
        }
    }
    function typeWriter(text, element, index = 0) {
        if (index < text.length) {
            element.textContent = text.substring(0, index + 1);
            setTimeout(() => typeWriter(text, element, index + 1), 50);
        }
    }
    function addTipsDisplay() {
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
        tipsDisplay.style.transition = 'all 0.3s ease, max-height 0.5s ease-out';
        tipsDisplay.style.lineHeight = '1.6';
        tipsDisplay.title = '点击以查看/收起所有提示。';
        tipsDisplay.style.opacity = '1';
        tipsDisplay.style.transform = 'translateY(0)';
        const tipsList = [
            '教程：https://xiaoya.zygame1314.site。',
            '在「课件」页可以下载当前打开的单个课件。',
            '课程附件列表支持全选、批量下载和导出。',
            '脚本需要获取到课程资源后才能正常工作。',
            '现版本已不需要通过定位到课程首页来获取资源。',
            '现版本已不依赖于树状图，多节点课程可以正常使用了。',
            '下载进度和下载历史都在「传输」页。',
            '搜索栏支持按文件名、后缀名等多种条件进行筛选。',
            '图片和音频文件也可通过右键菜单直接选择“另存为”下载。',
            '「传输」页可以切换浏览器下载和第三方下载。',
            'IDM会自动接管所有下载请求，即便选择“用浏览器下载”。',
            '文件下载历史记录默认保留三天。',
            '导出前先在「课件」页勾选要导出的文件。',
            '点击已读或清空按钮后，页面会自动刷新。',
            '教师信息和课程附件需要在课程页面才能完整获取。',
            '搜索功能的准确性取决于用户填写的信息完整度。',
            '课程结构视图与课件列表互斥显示，关闭后回到列表。',
            '仅支持Office三件套和PDF的内容详情获取。',
            '只要是小雅能预览的，理论上都能预览（反之亦然）。',
            '如有功能建议或问题反馈，请在教程页面的评论区留言。',
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
                setTimeout(() => {
                    if (!isShowingAllTips && !isPaused && tipsDisplay.style.opacity === '0') {
                        updateTipDisplay();
                    }
                }, 320);
            }
        }
        function updateTipDisplay() {
            tipsDisplay.innerHTML = xyIcon('lightbulb', 'tips-icon') + tipsList[currentTipIndex];
            tipsDisplay.style.opacity = '1';
            tipsDisplay.style.transform = 'translateX(0)';
        }
        tipsDisplay.addEventListener('transitionend', (event) => {
            if (event.propertyName === 'opacity' && tipsDisplay.style.opacity === '0' && !isShowingAllTips) {
                updateTipDisplay();
            }
        });
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
        allTipsContainer.style.color = '#333';
        allTipsContainer.style.transition = 'none';
        allTipsContainer.style.transformOrigin = 'center center';
        function getTipsDisplayPosition() {
            const rect = tipsDisplay.getBoundingClientRect();
            return {
                left: rect.left + rect.width / 2,
                top: rect.top + rect.height / 2
            };
        }
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
                <h2>所有提示 <button id="closeTipsBtn" type="button">关闭</button></h2>
                ${tipsList.map((tip, index) => `
                    <div class="tip-item" style="animation: fadeInUp 0.5s ease-out ${index * 0.1}s both;">
                        <span class="tip-number">${index + 1}</span>
                        <span class="tip-text">${tip}</span>
                    </div>
                    `).join('')}
                `;
                allTipsContainer.style.display = 'block';
                allTipsContainer.style.animation = 'none';
                void allTipsContainer.offsetWidth;
                allTipsContainer.style.animation = 'popOutToCenter 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards';
                document.getElementById('closeTipsBtn').addEventListener('click', closeTips);
            } else {
                closeTips();
            }
        });
        tipsDisplay.addEventListener('mouseover', () => {
            pauseTips();
        });
        tipsDisplay.addEventListener('mouseout', () => {
            resumeTips();
        });
        function closeTips() {
            allTipsContainer.querySelectorAll('*').forEach(el => {
                el.style.animation = 'none';
                void el.offsetWidth;
            });
            allTipsContainer.style.animation = 'none';
            void allTipsContainer.offsetWidth;
            const position = getTipsDisplayPosition();
            const endX = position.left - window.innerWidth / 2;
            const endY = position.top - window.innerHeight / 2;
            allTipsContainer.style.setProperty('--end-x', `${endX}px`);
            allTipsContainer.style.setProperty('--end-y', `${endY}px`);
            allTipsContainer.style.animation = 'popInToOrigin 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards';
            allTipsContainer.addEventListener('animationend', () => {
                allTipsContainer.style.display = 'none';
                isShowingAllTips = false;
                resumeTips();
            }, { once: true });
        }
        function closeAllTips() {
            if (!isShowingAllTips) return;
            allTipsContainer.style.animation = 'none';
            allTipsContainer.style.display = 'none';
            isShowingAllTips = false;
        }
        function pauseTips() {
            isPaused = true;
            clearInterval(intervalId);
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
        updateTipDisplay();
        startTipInterval();
        document.body.appendChild(allTipsContainer);
        return {
            pauseTips,
            resumeTips,
            closeAllTips
        };
    }
    function updateVisibility() {
        const quickSection = document.getElementById('xy-files-quick-section');
        const progressSection = document.getElementById('xy-progress-section');
        const videoSection = document.getElementById('xy-video-section');
        if (quickSection) {
            quickSection.style.display = downloadInterfaceCheckbox.checked ? '' : 'none';
        }
        if (videoSection) {
            videoSection.style.display = videoCheckbox.checked ? '' : 'none';
        }
        if (progressSection) {
            const isVisible = progressBarCheckbox.checked;
            progressSection.style.display = isVisible ? '' : 'none';
            isProgressBarVisible = isVisible;
        }
        xyScheduleDrawerFit();
    }
    function updateDownloadListVisibility() {
        const listSection = document.getElementById('xy-files-list-section');
        const isVisible = downloadButtonCheckbox.checked;
        if (listSection) {
            listSection.style.display = isVisible ? '' : 'none';
        }
        const legacyList = document.getElementById('download_list');
        if (legacyList) {
            legacyList.style.opacity = '1';
            legacyList.style.transform = 'none';
        }
        xyScheduleDrawerFit();
    }
    messageContainer.appendChild(messageButtonContainer);
    downloadContainer.appendChild(downloadButtonContainer);
    exportContainer.appendChild(exportButtonContainer);
    exportContainer.appendChild(TextContainer);
    displayContainer.appendChild(checkboxesContainer);
    updateContainer.appendChild(Beautifulupdater);
    controlPanel.appendChild(messageContainer);
    controlPanel.appendChild(downloadContainer);
    controlPanel.appendChild(exportContainer);
    controlPanel.appendChild(displayContainer);
    controlPanel.appendChild(updateContainer);
    downloadContainer.style.display = 'none';
    exportContainer.style.display = 'none';
    displayContainer.style.display = 'none';
    updateContainer.style.display = 'none';
    document.body.appendChild(controlPanel);
    updateVisibility();
    updateDownloadListVisibility();
}
let lastGroupId = null;
function watchGroupIdChange() {
    lastGroupId = getGroupIdFromUrl();
    setInterval(() => {
        const currentGroupId = getGroupIdFromUrl();
        if (currentGroupId && currentGroupId !== lastGroupId) {
            lastGroupId = currentGroupId;
            parseContent();
            if (isEasterEggActivated) {
                getTeacherInfo(currentGroupId).then((teacherInfo) => {
                    if (teacherInfo) {
                        updateTeacherInfo(teacherInfo);
                    } else {
                        updateTeacherInfo([]);
                        console.error("无法获取教师信息");
                    }
                });
            }
        }
    }, 1000);
}
if (window.top === window.self) {
    setTimeout(() => {
        initWorkspace();
        add_download_button();
        loadDownloadHistory();
        initVideoAssistant();
        initCourseCapture();
        addDownloadsContainer();
        watchGroupIdChange();
        if (getGroupIdFromUrl()) {
            parseContent();
        }
        initializeControlPanel();
        createZipProgressIndicator();
        adoptLegacyPanels();
        const observer = new MutationObserver(function (mutationsList) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.target.id === 'download_list') {
                    window.updateUI();
                    break;
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }, 1000);
}
let previewLink;
let isDownloading = false;
let currentTitle = '';
function initCourseCapture() {
    const list = createDownloadInterface();
    createInitialPreviewLink();
    observeTitleChanges();
    handleXhrResponse();
}
function observeTitleChanges() {
    const titleElement = document.querySelector('title');
    if (!titleElement) return;
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.target === titleElement) {
                const newTitle = document.title.split('|')[0].trim();
                if (newTitle !== currentTitle) {
                    currentTitle = newTitle;
                    handleXhrResponse();
                }
            }
        });
    });
    observer.observe(titleElement, { childList: true });
}
function createDownloadInterface() {
    const list = document.createElement("div");
    initializeListStyles(list);
    addAnimationStyles();
    return list;
}
function initializeListStyles(element) {
    element.id = "downloadInterface";
    element.style.display = "none";
    document.body.appendChild(element);
}
function addAnimationStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes previewLinkSlideIn {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }
        #downloadInterface a span {
            overflow: hidden;
            text-overflow: ellipsis;
        }
    `;
    document.head.appendChild(style);
}
function handleXhrResponse() {
    if (isDownloading) return;
    isDownloading = true;
    const groupId = getGroupIdFromUrl();
    if (!groupId || currentResourcesGroupId !== groupId) {
        createInitialPreviewLink();
        isDownloading = false;
        return;
    }
    const pathname = window.location.pathname.replace(/\/+$/, '');
    let id = pathname.split('/').pop() || '';
    if (!/^\d+$/.test(id)) {
        const pathIds = pathname.match(/\d{19}/g) || [];
        if (pathIds.length > 1) id = pathIds[pathIds.length - 1];
    }
    if (!id || id === groupId) {
        createInitialPreviewLink();
        isDownloading = false;
        return;
    }
    const content = document.title.split('|')[0].trim();
    let checkCount = 0;
    const maxChecks = 10;
    const checkInterval = 500;
    function checkResources() {
        if (course_resources && Object.keys(course_resources).length > 0) {
            processResources();
        } else if (checkCount < maxChecks) {
            checkCount++;
            setTimeout(checkResources, checkInterval);
        } else {
            createInitialPreviewLink();
            isDownloading = false;
        }
    }
    function isAssignmentResource() {
        const taskButton = document.querySelector('.entry_task_btn');
        return taskButton !== null;
    }
    function processResources() {
        let quoteId = null;
        let resourceMimetype = null;
        let resourceName = null;
        if (isAssignmentResource()) {
            createInitialPreviewLink();
            showNotification('当前资源为作业，不支持下载。', 'info');
            isDownloading = false;
            return;
        }
        for (const resourceId in course_resources) {
            const resource = course_resources[resourceId];
            if (String(resource.id) === String(id) &&
                (!resource.group_id || String(resource.group_id) === String(groupId))) {
                quoteId = resource.quote_id;
                resourceMimetype = resource.mimetype;
                resourceName = resource.name;
                break;
            }
        }
        if (quoteId) {
            if (isVideoFile(resourceMimetype, resourceName)) {
                createInitialPreviewLink();
                showNotification('当前资源为视频，请通过视频组件下载。', 'info');
                isDownloading = false;
                return;
            }
            const url = 'https://' + hostname + '/api/jx-oresource/cloud/file_url/' + quoteId;
            const token = getCookie();
            fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    let downloadUrl = data.data.url;
                    if (data.data.is_encryption) {
                        downloadUrl = decryptFileUrl(downloadUrl);
                    }
                    updatePreviewLink(downloadUrl, resourceName || content);
                })
                .catch(error => {
                    console.error('获取文件下载地址失败:', error);
                    createInitialPreviewLink();
                    showNotification('获取文件下载地址失败X﹏X（或者根本不是个文件？）', 'error');
                });
        } else {
            createInitialPreviewLink();
        }
        isDownloading = false;
    }
    checkResources();
}
function showNotification(message, type = 'info', onConfirm = null, onCancel = null) {
    if (!document.getElementById('custom-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'custom-notification-styles';
        style.textContent = `
            .custom-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 16px;
                border-radius: 16px;
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
                background-color: #fff;
                color: #333;
                z-index: 10000;
                transition: transform 0.3s ease, opacity 0.3s ease;
                opacity: 0;
                display: flex;
                flex-direction: column;
                font-family: 'Baloo 2', cursive, sans-serif;
                overflow: hidden;
                width: auto;
                max-width: 600px;
                transform: translateX(100%);
                border: 2px solid #333;
            }
            .custom-notification.show {
                transform: translateX(0);
                opacity: 1;
            }
            .notification-content {
                display: flex;
                align-items: center;
                position: relative;
            }
            .notification-icon {
                font-size: 24px;
                margin-right: 12px;
                flex-shrink: 0;
                margin-top: 2px;
            }
            .notification-message {
                flex: 1;
                font-size: 15px;
                font-weight: bold;
                line-height: 1.5;
                word-break: break-word;
                padding-right: 30px;
            }
            .notification-close {
                position: absolute;
                top: 8px;
                right: 8px;
                font-size: 18px;
                cursor: pointer;
                color: #888;
                line-height: 1;
            }
            .notification-close:hover {
                color: #333;
            }
            .notification-buttons {
                margin-top: 12px;
                display: flex;
                justify-content: flex-end;
            }
            .notification-button {
                padding: 8px 16px;
                margin-left: 8px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: background-color 0.2s;
            }
            .notification-button.primary {
                background-color: #FFB400;
                color: #fff;
            }
            .notification-button.primary:hover {
                background-color: #e0a000;
            }
            .notification-button.secondary {
                background-color: #6c757d;
                color: #fff;
            }
            .notification-button.secondary:hover {
                background-color: #5a6268;
            }
            .notification-info {
                border-color: #00BFFF;
                background-color: #E0F7FF;
            }
            .notification-warning {
                border-color: #FFA500;
                background-color: #FFF5E6;
            }
            .notification-error {
                border-color: #FF6347;
                background-color: #FFEDED;
            }
            .notification-confirm {
                border-color: #32CD32;
                background-color: #E6FFE6;
            }
            .notification-info .notification-icon { color: #00BFFF; }
            .notification-warning .notification-icon { color: #FFA500; }
            .notification-error .notification-icon { color: #FF6347; }
            .notification-confirm .notification-icon { color: #32CD32; }
            .notification-countdown {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 4px;
                background-color: rgba(0, 0, 0, 0.1);
                transition: width linear;
            }
            .notification-info .notification-countdown {
                background-color: #00BFFF;
            }
            .notification-warning .notification-countdown {
                background-color: #FFA500;
            }
            .notification-error .notification-countdown {
                background-color: #FF6347;
            }
            .notification-confirm .notification-countdown {
                background-color: #32CD32;
            }
        `;
        document.head.appendChild(style);
    }
    const notifications = document.querySelectorAll('.custom-notification');
    const notificationHeight = 100;
    const spacing = 10;
    const offset = notifications.length * (notificationHeight + spacing);
    const notification = document.createElement('div');
    notification.classList.add('custom-notification', `notification-${type}`);
    notification.style.top = `${20 + offset}px`;
    const content = document.createElement('div');
    content.classList.add('notification-content');
    const icon = document.createElement('div');
    icon.classList.add('notification-icon');
    icon.innerHTML = getIcon(type);
    const messageElement = document.createElement('div');
    messageElement.classList.add('notification-message');
    messageElement.textContent = message;
    content.appendChild(icon);
    content.appendChild(messageElement);
    notification.appendChild(content);
    const closeBtn = document.createElement('span');
    closeBtn.classList.add('notification-close');
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = closeNotification;
    notification.appendChild(closeBtn);
    const notificationDuration = 4000;
    if (type !== 'confirm') {
        const countdownBar = document.createElement('div');
        countdownBar.classList.add('notification-countdown');
        countdownBar.style.width = '100%';
        countdownBar.style.transitionDuration = `${notificationDuration}ms`;
        notification.appendChild(countdownBar);
        setTimeout(() => {
            countdownBar.style.width = '0%';
        }, 10);
    }
    if (type === 'confirm') {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('notification-buttons');
        const createButton = (text, isPrimary, onClick) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.classList.add('notification-button');
            if (isPrimary) {
                button.classList.add('primary');
            } else {
                button.classList.add('secondary');
            }
            button.onclick = onClick;
            return button;
        };
        const cancelButton = createButton('取消', false, () => {
            if (onCancel) onCancel();
            closeNotification();
        });
        const confirmButton = createButton('确认', true, () => {
            if (onConfirm) onConfirm();
            closeNotification();
        });
        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(confirmButton);
        notification.appendChild(buttonContainer);
    }
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    function closeNotification() {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
                const remainingNotifications = document.querySelectorAll('.custom-notification');
                remainingNotifications.forEach((notif, index) => {
                    notif.style.top = `${20 + index * (notificationHeight + spacing)}px`;
                });
            }
        }, 300);
    }
    if (type !== 'confirm') {
        setTimeout(closeNotification, notificationDuration);
    }
    function getIcon(type) {
        switch (type) {
            case 'info':
                return xyIcon('circle-info');
            case 'warning':
                return xyIcon('triangle-exclamation');
            case 'error':
                return xyIcon('circle-exclamation');
            case 'confirm':
                return xyIcon('circle-check');
            default:
                return xyIcon('circle-question');
        }
    }
}
function createInitialPreviewLink() {
    const list = document.getElementById("downloadInterface");
    if (previewLink && list && previewLink.parentElement === list) {
        list.removeChild(previewLink);
        const trailingBr = Array.from(list.children).reverse().find(child => child.tagName === 'BR');
        if (trailingBr) trailingBr.remove();
    }
    createPreviewLink("#", "等待课件...( ＿ ＿)ノ｜");
    previewLink.removeAttribute("href");
    Object.assign(previewLink.style, {
        pointerEvents: "none",
        color: "#DDD"
    });
    if (typeof xySyncQuickSection === 'function') {
        xySyncQuickSection();
    }
}
function updatePreviewLink(href, content) {
    const list = document.getElementById("downloadInterface");
    if (previewLink && list && previewLink.parentElement === list) {
        list.removeChild(previewLink);
        const trailingBr = Array.from(list.children).reverse().find(child => child.tagName === 'BR');
        if (trailingBr) trailingBr.remove();
    }
    createNewPreviewLink(href, content);
    if (typeof xySyncQuickSection === 'function') {
        xySyncQuickSection();
    }
}
function createNewPreviewLink(href, content) {
    createPreviewLink(href, content);
}
function createPreviewLink(href, content) {
    previewLink = document.createElement("a");
    Object.assign(previewLink.style, {
        background: "linear-gradient(45deg, #FF8E53, #FF6B35)",
        color: "white",
        padding: "10px 15px",
        margin: "5px auto",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        fontSize: "14px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        maxWidth: "380px",
        width: "calc(100% - 30px)",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
    });
    const downloadIcon = xyIcon('download', 'xy-quick-link-icon');
    previewLink.innerHTML = `${downloadIcon}<span style="overflow: hidden; text-overflow: ellipsis;">${content}</span>`;
    previewLink.title = content;
    addPreviewLinkEventListeners(previewLink);
    const list = document.getElementById("downloadInterface");
    list.appendChild(previewLink);
    list.appendChild(document.createElement("br"));
    Object.assign(previewLink, {
        href: href,
        target: "_blank"
    });
    previewLink.dataset.downloadUrl = href;
    previewLink.dataset.filename = content;
    previewLink.style.animation = "previewLinkSlideIn 0.5s forwards";
}
function addPreviewLinkEventListeners(previewLink) {
    previewLink.addEventListener('dragstart', (event) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', previewLink.dataset.downloadUrl);
        event.dataTransfer.setData('text/filename', previewLink.dataset.filename);
    });
    previewLink.addEventListener("click", function (event) {
        totalDownloads++;
        updateTotalProgress();
        event.preventDefault();
        event.stopPropagation();
        courseDownload(previewLink.href, previewLink.textContent.trim());
    });
}
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
        font-weight: bold;
    `;
    const scrollContent = document.createElement('div');
    scrollContent.style.cssText = `
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        font-weight: bold;
    `;
    scrollContent.id = "teacherInfoContent";
    scrollContent.innerHTML = `
        <div class="loading-message" style="text-align: center; padding: 20px;">
            <p style="margin-bottom: 10px; font-size: 16px;">
                等待获取教师信息...
            </p>
            <div class="loading-dots">
                <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
            </div>
        </div>
    `;
    container.appendChild(scrollContent);
    document.body.appendChild(container);
    const teacher_style = document.createElement('style');
    teacher_style.textContent = `
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
    if (!content) return;
    if (teacherInfo && teacherInfo.length > 0) {
        content.innerHTML = `
            <h3 class="title" style="font-weight: bold; margin-bottom: 15px; padding-left: 10px;">教师信息</h3>
            <div class="teacher-list" style="font-weight: bold;">
                ${teacherInfo.map((teacher) => `
                    <div class="teacher-item" style="margin-bottom: 10px; padding: 10px; background-color: #FFE0B2; border-radius: 5px;">
                        <div class="teacher-name" style="margin-bottom: 5px;">${teacher.nickname}</div>
                        <div class="teacher-number" style="color: #757575;">${teacher.studentNumber}</div>
                    </div>
                `).join("")}
            </div>
        `;
    } else {
        content.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <p style="color: #757575; font-weight: bold; margin-bottom: 10px;">
                    暂无教师信息或尚未打开课程
                </p>
                <p style="color: #999; font-size: 14px;">
                    请确保在课程页面中使用此功能
                </p>
            </div>
        `;
    }
}
function createDebuggerDisablerContainer() {
    const container = document.createElement('div');
    container.id = "debuggerDisablerContainer";
    container.style.cssText = `
        position: fixed;
        top: -280px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10002;
        background-color: #1a1a1a;
        border: 2px solid #ff6600;
        border-radius: 0 0 10px 10px;
        padding: 20px;
        box-shadow: 0 5px 15px rgba(255, 102, 0, 0.3);
        width: 300px;
        height: 220px;
        transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    `;
    const content = document.createElement('div');
    content.style.cssText = `
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        color: #ff6600;
    `;
    content.innerHTML = `
        <h3 style="margin: 0; color: #ff6600; text-align: center; font-size: 18px; letter-spacing: 2px;">反调试禁用器</h3>
        <div style="width: 100%; height: 2px; background: linear-gradient(to right, #1a1a1a, #ff6600, #1a1a1a);"></div>
        <p style="text-align: center; margin: 10px 0; font-size: 14px; font-weight: bold; color: #cccccc;">禁用小雅反调试措施</p>
        <button id="disableDebuggerBtn" style="
            background-color: #1a1a1a;
            border: 2px solid #ff6600;
            color: #ff6600;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin: 4px 2px;
            cursor: pointer;
            transition: all 0.3s ease;
            outline: none;
            letter-spacing: 1px;
        ">⚡点击禁用⚡</button>
    `;
    container.appendChild(content);
    document.body.appendChild(container);
    if (!localStorage.getItem('debuggerDisablerShownWarning')) {
        showNotification("警告⚠️：此功能可能会影响网站的正常运行，请谨慎使用！", 'warning');
        localStorage.setItem('debuggerDisablerShownWarning', 'true');
    }
    const disableDebuggerBtn = document.getElementById('disableDebuggerBtn');
    disableDebuggerBtn.addEventListener('mouseover', () => {
        disableDebuggerBtn.style.backgroundColor = '#ff6600';
        disableDebuggerBtn.style.color = '#1a1a1a';
    });
    disableDebuggerBtn.addEventListener('mouseout', () => {
        disableDebuggerBtn.style.backgroundColor = '#1a1a1a';
        disableDebuggerBtn.style.color = '#ff6600';
    });
    disableDebuggerBtn.addEventListener('click', function () {
        (function () {
            'use strict';
            Function.prototype.constructor = function () {
                return function () { };
            };
        })();
        this.textContent = '反调试已禁用';
        this.style.backgroundColor = '#1a1a1a';
        this.style.color = '#00ff00';
        this.style.borderColor = '#00ff00';
        this.disabled = true;
        this.style.cursor = 'default';
        container.style.animation = 'glitch 0.5s';
    });
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glitch {
            0% { transform: translateX(-50%) translate(2px, 2px); }
            25% { transform: translateX(-50%) translate(-2px, -2px); }
            50% { transform: translateX(-50%) translate(2px, -2px); }
            75% { transform: translateX(-50%) translate(-2px, 2px); }
            100% { transform: translateX(-50%) translate(0, 0); }
        }
    `;
    document.head.appendChild(style);
}
let teacherInfoRequestTimeout;
async function getTeacherInfo(groupId) {
    if (teacherInfoRequestTimeout) {
        clearTimeout(teacherInfoRequestTimeout);
    }
    return new Promise((resolve) => {
        teacherInfoRequestTimeout = setTimeout(async () => {
            const visitData = await getCourseVisitData(groupId);
            if (!visitData) {
                resolve(null);
                return;
            }
            try {
                const teachers = visitData.teachers || [];
                resolve(teachers.map((teacher) => ({
                    nickname: teacher.nickname,
                    studentNumber: teacher.studentNumber,
                })));
            } catch (error) {
                console.error("处理教师信息时出错：", error);
                resolve(null);
            }
        }, 500);
    });
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
        font-weight: bold;
    `;
    const scrollContent = document.createElement('div');
    scrollContent.style.cssText = `
        height: 100%;
        overflow-y: auto;
    `;
    scrollContent.innerHTML = `
        <input type="text" id="userSearchInput" placeholder="输入电话/一卡通号" class="search-teacher-input" style="
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
        <button id="userSearchButton" class="search-teacher-button" style="
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
        <div id="userSearchResults" class="search-teacher-results" style="
            margin-top: 15px;
            font-weight: normal;
        ">
            <p class="search-teacher-hint">请输入电话或一卡通号进行搜索</p>
        </div>
    `;
    container.appendChild(scrollContent);
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
async function performSearch() {
    const input = document.getElementById("userSearchInput");
    const resultsDiv = document.getElementById("userSearchResults");
    if (input && resultsDiv) {
        const username = input.value.trim();
        if (username.length > 0) {
            const userInfo = await searchUser(username);
            displayUserInfo(userInfo, resultsDiv);
        } else {
            resultsDiv.innerHTML = '<p class="search-teacher-hint">请输入用户名或学号进行搜索</p>';
        }
    }
}
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
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    warningDiv.innerHTML = `
        <h3 style="
            color: #E65100;
            margin-top: 0;
            font-size: 28px;
            margin-bottom: 25px;
            font-weight: bold;
        ">⚠️ 警告</h3>
        <p style="
            color: #555;
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 30px;
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
function initContainers() {
    createTeacherInfoContainer();
    createUserSearchContainer();
    createDebuggerDisablerContainer();
}
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
document.addEventListener('keydown', (e) => {
    if (isEasterEggActivated) {
        return;
    }
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
function activateEasterEgg() {
    if (isEasterEggActivated) {
        showNotification("彩蛋已激活！别再戳啦！", 'info');
        return;
    }
    console.log("彩蛋已激活！");
    initContainers();
    if (window.xyWorkspace) {
        window.xyWorkspace.open('tools');
    }
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
    isEasterEggActivated = true;
}
function initVideoAssistant() {
    const token = getCookie();
    const container = document.createElement('div');
    container.id = 'tm-video-assistant';
    container.style.display = 'none';
    container.innerHTML = `
        <div id="tm-assistant-content">
            <div id="tm-header">
                <button id="tm-download-guide-button" class="tm-button">
                    <span class="tm-button-icon">${xyIcon('film')}</span>
                    视频下载指南
                </button>
            </div>
            <div id="tm-video-title-container" class="tm-info-container">
                <div class="tm-info-label">视频标题:</div>
                <div id="tm-video-title" class="tm-info-content">等待获取视频标题...</div>
            </div>
            <div id="tm-video-src-container" class="tm-info-container">
                <div class="tm-info-label">视频链接:</div>
                <div id="tm-video-src" class="tm-info-content">等待检测视频源...</div>
            </div>
            <div class="tm-button-row">
                <button id="tm-copy-src" class="tm-button">
                    <span class="tm-button-icon">${xyIcon('copy')}</span>
                    <strong>复制链接</strong>
                </button>
                <button id="tm-open-src" class="tm-button">
                    <span class="tm-button-icon">${xyIcon('arrow-up-right-from-square')}</span>
                    <strong>打开链接</strong>
                </button>
            </div>
            <div id="tm-m3u8-container" class="tm-info-container">
                <div class="tm-info-label">M3U8链接:</div>
                <div id="tm-m3u8-src" class="tm-info-content">等待获取M3U8链接...</div>
            </div>
            <div class="tm-button-row">
                <button id="tm-copy-m3u8" class="tm-button">
                    <span class="tm-button-icon">${xyIcon('copy')}</span>
                        <strong>复制M3U8</strong>
                </button>
                <button id="tm-download-m3u8" class="tm-button">
                    <span class="tm-button-icon">${xyIcon('download')}</span>
                        <strong>下载M3U8</strong>
                </button>
            </div>
            <p id="tm-status"></p>
        </div>
    `;
    document.body.appendChild(container);
    const style = document.createElement('style');
    style.textContent = `
        #tm-assistant-content {
            padding: 20px;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
            box-sizing: border-box;
        }
        .tm-info-container {
            width: 100%;
            margin: 10px 0;
            padding: 10px;
            border-radius: 5px;
            transition: all 0.3s ease;
            box-sizing: border-box;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        #tm-video-title-container {
            background: rgba(255, 255, 255, 0.3);
            border-left: 4px solid #6495ff;
        }
        #tm-video-src-container {
            background: rgba(255, 255, 255, 0.2);
            border-left: 4px solid #ff2201;
        }
        .tm-info-label {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #555;
        }
        .tm-info-content {
            font-size: 14px;
            font-weight: bold;
            word-break: break-all;
            white-space: pre-wrap;
            flex-grow: 1;
            max-height: 80px;
            overflow-y: auto;
        }
        .tm-info-content::-webkit-scrollbar {
            width: 6px;
        }
        .tm-info-content::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
        }
        .tm-info-content::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
        }
        .tm-button-row {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }
        .tm-button {
            background: rgba(255, 140, 0, 0.8);
            border: none;
            color: white;
            padding: 8px 15px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
            width: 48%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .tm-button:hover {
            background: rgba(255, 215, 0, 0.9);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        .tm-button-icon {
            margin-right: 5px;
            font-size: 16px;
        }
        #tm-status {
            font-size: 12px;
            margin-top: 10px;
            font-style: italic;
            width: 100%;
            text-align: center;
            color: #555;
        }
        #tm-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            margin-bottom: 15px;
        }
        #tm-download-guide-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #4CAF50;
            border: none;
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 1;
        }
        #tm-download-guide-button:hover {
            background: #45a049;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        #tm-download-guide-button .tm-button-icon {
            margin-right: 4px;
            font-size: 14px;
        }
        #tm-m3u8-container {
            background: rgba(255, 255, 255, 0.25);
            border-left: 4px solid #9c27b0;
            padding: 10px;
            border-radius: 5px;
            transition: all 0.3s ease;
            box-sizing: border-box;
        }
    `;
    document.head.appendChild(style);
    let lastUrl = location.href;
    let guideModal = null;
    let guideReturnFocus = null;
    let guideKeyHandler = null;
    let guideBodyOverflow = null;
    let guideSession = 0;
    let statusHideTimer = null;
    async function getVideoInfo(maxAttempts = 20, interval = 1000) {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const playerDivs = [
                document.querySelector('div.prism-player'),
                document.querySelector('div.video-player'),
                document.querySelector('.video-container video'),
                ...document.querySelectorAll('div[class*="player"]')
            ].filter(Boolean);
            for (const playerDiv of playerDivs) {
                const videoElement = playerDiv.querySelector('video') || playerDiv;
                if (videoElement && videoElement.src) {
                    const newSrc = videoElement.src;
                    const content = document.title.split('|')[0].trim();
                    const oldSrc = document.getElementById('tm-video-src').textContent;
                    if (newSrc !== oldSrc) {
                        document.getElementById('tm-video-src').textContent = newSrc;
                        document.getElementById('tm-video-title').textContent = content;
                        document.getElementById('tm-m3u8-container').style.display = 'block';
                        if (newSrc.startsWith('blob:')) {
                            document.getElementById('tm-video-src').textContent = '流式视频不可直接打开，请使用下方M3U8链接';
                        } else {
                            document.getElementById('tm-video-src').style.color = '';
                        }
                        getM3U8Link();
                        return { src: newSrc, title: content };
                    }
                }
            }
            if (attempt < maxAttempts - 1) {
                await new Promise(resolve => setTimeout(resolve, interval));
            }
        }
        document.getElementById('tm-video-title').textContent = '未找到视频标题';
        document.getElementById('tm-video-src').textContent = '未找到视频源';
        document.getElementById('tm-m3u8-src').textContent = '未找到M3U8链接';
        return null;
    }
    async function getM3U8Link() {
        try {
            document.getElementById('tm-m3u8-src').textContent = '正在获取M3U8链接...';
            const videoId = await extractVideoId();
            if (!videoId) {
                document.getElementById('tm-m3u8-src').textContent = '无法获取视频ID';
                return;
            }
            const authUrl = `https://${location.hostname}/api/jx-oresource/vod/video/play_auth/${videoId}`;
            const authResponse = await fetch(authUrl, {
                headers: {
                    "accept": "*/*",
                    "content-type": "application/json; charset=utf-8",
                    'Authorization': `Bearer ${token}`,
                    "x-language": "zh-CN",
                }
            });
            const authData = await authResponse.json();
            if (!authData.success) {
                document.getElementById('tm-m3u8-src').textContent = '获取授权失败';
                return;
            }
            const privateVod = authData.data.private_vod;
            if (privateVod && privateVod.length > 0 && privateVod[0].private_url) {
                const m3u8Url = privateVod[0].private_url;
                document.getElementById('tm-m3u8-src').textContent = m3u8Url;
                showStatus('已获取到M3U8链接');
                return m3u8Url;
            } else {
                document.getElementById('tm-m3u8-src').textContent = '未找到M3U8链接';
            }
        } catch (error) {
            console.error('获取M3U8链接失败:', error);
            document.getElementById('tm-m3u8-src').textContent = '获取M3U8链接失败';
        }
    }
    async function extractVideoId() {
        try {
            const urlMatch = location.href.match(/resource\/.*?\/(\d+)/);
            if (!urlMatch) return null;
            const resourceId = urlMatch[1];
            const resourceUrl = `https://${location.hostname}/api/jx-iresource/resource/queryResource?node_id=${resourceId}`;
            const response = await fetch(resourceUrl, {
                headers: {
                    "accept": "*/*",
                    "content-type": "application/json; charset=utf-8",
                    'Authorization': `Bearer ${token}`,
                    "x-language": "zh-CN",
                }
            });
            const resourceData = await response.json();
            if (resourceData.success && resourceData.data.resource && resourceData.data.resource.video_id) {
                return resourceData.data.resource.video_id;
            }
            return null;
        } catch (error) {
            console.error('提取视频ID失败:', error);
            return null;
        }
    }
    function checkUrlAndExecute() {
        if (lastUrl !== location.href) {
            lastUrl = location.href;
            closeGuide();
            getVideoInfo();
        }
    }
    document.getElementById('tm-copy-src').addEventListener('click', function (e) {
        e.stopPropagation();
        const src = document.getElementById('tm-video-src').textContent;
        if (src && src !== '等待检测视频源...' && src !== '未找到视频源') {
            navigator.clipboard.writeText(src).then(() => {
                showStatus('链接已复制！');
            }).catch(err => {
                console.error('复制失败:', err);
                showStatus('复制失败，请重试');
            });
        } else {
            showStatus('暂无可复制的链接');
        }
    });
    document.getElementById('tm-open-src').addEventListener('click', function (e) {
        e.stopPropagation();
        const src = document.getElementById('tm-video-src').textContent;
        if (src && src !== '等待检测视频源...' && src !== '未找到视频源') {
            window.open(src, '_blank');
            showStatus('已打开（小心音量爆炸哦~）');
        } else {
            showStatus('暂无可打开的链接');
        }
    });
    document.getElementById('tm-copy-m3u8').addEventListener('click', function (e) {
        e.stopPropagation();
        const m3u8Src = document.getElementById('tm-m3u8-src').textContent;
        if (m3u8Src && m3u8Src !== '等待获取M3U8链接...' && m3u8Src !== '未找到M3U8链接' && m3u8Src !== '正在获取M3U8链接...') {
            navigator.clipboard.writeText(m3u8Src).then(() => {
                showStatus('M3U8链接已复制！');
            }).catch(err => {
                console.error('复制失败:', err);
                showStatus('复制失败，请重试');
            });
        } else {
            showStatus('暂无可复制的M3U8链接');
        }
    });
    document.getElementById('tm-download-m3u8').addEventListener('click', function (e) {
        e.stopPropagation();
        const m3u8Src = document.getElementById('tm-m3u8-src').textContent;
        if (m3u8Src && m3u8Src !== '等待获取M3U8链接...' && m3u8Src !== '未找到M3U8链接' && m3u8Src !== '正在获取M3U8链接...') {
            const downloadUrl = `https://tools.thatwind.com/tool/m3u8downloader#${encodeURIComponent(m3u8Src)}`;
            window.open(downloadUrl, '_blank');
            showStatus('已跳转到M3U8下载器');
        } else {
            showStatus('暂无可下载的M3U8链接');
        }
    });
    function addGuideButtonListener() {
        const guideButton = document.getElementById('tm-download-guide-button');
        if (guideButton) {
            guideButton.addEventListener('click', function (e) {
                e.stopPropagation();
                showDownloadGuide();
            });
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addGuideButtonListener);
    } else {
        addGuideButtonListener();
    }
    function ensureGuideStyles() {
        if (document.getElementById('tm-guide-styles')) return;
        const style = document.createElement('style');
        style.id = 'tm-guide-styles';
        style.textContent = `
            #tm-guide-modal {
                position: fixed;
                inset: 0;
                z-index: 2147483600;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                background: rgba(43, 31, 17, .34);
                -webkit-backdrop-filter: blur(4px);
                backdrop-filter: blur(4px);
                opacity: 0;
                transition: opacity .2s ease;
                color: #4b3722;
                font-family: 'Microsoft YaHei', 'Segoe UI', Tahoma, sans-serif;
            }
            #tm-guide-modal *,
            #tm-guide-modal *::before,
            #tm-guide-modal *::after {
                box-sizing: border-box;
            }
            #tm-guide-modal.tm-guide-visible {
                opacity: 1;
            }
            #tm-guide-modal .tm-guide-dialog {
                width: min(540px, 100%);
                max-height: min(86vh, 720px);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid #e9ddc9;
                border-radius: 18px;
                background: #fffdf8;
                box-shadow: 0 28px 72px rgba(62, 42, 12, .28), 0 4px 16px rgba(62, 42, 12, .08);
                opacity: 0;
                transform: translateY(12px) scale(.97);
                transition: opacity .2s ease, transform .22s cubic-bezier(.2, .7, .3, 1);
                outline: none;
            }
            #tm-guide-modal.tm-guide-visible .tm-guide-dialog {
                opacity: 1;
                transform: none;
            }
            #tm-guide-modal .tm-guide-head {
                position: relative;
                flex: 0 0 auto;
                display: flex;
                align-items: flex-start;
                gap: 13px;
                padding: 22px 52px 17px 22px;
                border-bottom: 1px solid #f1e5d2;
                background: #fffaf1;
            }
            #tm-guide-modal .tm-guide-head-icon {
                flex: 0 0 auto;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 42px;
                height: 42px;
                border: 1px solid #f4dfbd;
                border-radius: 13px;
                background: #fdf0da;
                color: #d97a00;
                font-size: 19px;
            }
            #tm-guide-modal .tm-guide-title-group {
                min-width: 0;
            }
            #tm-guide-modal .tm-guide-title-group h2 {
                margin: 0;
                color: #3f2f1c;
                font-size: 19px;
                font-weight: 700;
                line-height: 1.35;
            }
            #tm-guide-modal .tm-guide-title-group p {
                margin: 6px 0 0;
                color: #8c7a62;
                font-size: 12.5px;
                line-height: 1.65;
            }
            #tm-guide-modal .tm-guide-close {
                position: absolute;
                top: 14px;
                right: 14px;
                width: 30px;
                height: 30px;
                padding: 0;
                border: none;
                border-radius: 9px;
                background: transparent;
                color: #9b8a72;
                font-family: inherit;
                font-size: 14px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background .16s ease, color .16s ease;
            }
            #tm-guide-modal .tm-guide-close:hover {
                background: #f7eddd;
                color: #8a5a12;
            }
            #tm-guide-modal .tm-guide-body {
                flex: 1 1 auto;
                min-height: 0;
                padding: 4px 22px 6px;
                overflow-y: auto;
                overscroll-behavior: contain;
                scrollbar-width: thin;
                scrollbar-color: #e4d1b3 transparent;
            }
            #tm-guide-modal .tm-guide-body::-webkit-scrollbar {
                width: 6px;
            }
            #tm-guide-modal .tm-guide-body::-webkit-scrollbar-thumb {
                border-radius: 999px;
                background: #e4d1b3;
            }
            #tm-guide-modal .tm-guide-steps {
                margin: 0;
                padding: 0;
                list-style: none;
            }
            #tm-guide-modal .tm-guide-step {
                display: grid;
                grid-template-columns: 22px 34px minmax(0, 1fr);
                align-items: start;
                gap: 11px;
                padding: 12px 0;
                border-bottom: 1px dashed #f0e4d1;
            }
            #tm-guide-modal .tm-guide-step:last-child {
                padding-bottom: 8px;
                border-bottom: none;
            }
            #tm-guide-modal .tm-guide-num {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 22px;
                height: 22px;
                margin-top: 6px;
                border-radius: 50%;
                background: #fdf0da;
                color: #b86f06;
                font-size: 11.5px;
                font-weight: 800;
                line-height: 1;
            }
            #tm-guide-modal .tm-guide-step-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 34px;
                height: 34px;
                border: 1px solid #f1e5d2;
                border-radius: 10px;
                background: #fbf5ea;
                color: #c98a2e;
                font-size: 15px;
            }
            #tm-guide-modal .tm-guide-step p {
                margin: 0;
                padding-top: 1px;
                color: #5b462e;
                font-size: 13px;
                line-height: 1.72;
                word-break: break-word;
                text-wrap: pretty;
            }
            #tm-guide-modal mark.tm-guide-k {
                padding: 0 3px;
                border-radius: 4px;
                background: #fff1d9;
                color: #a86200;
                font-weight: 700;
                white-space: nowrap;
            }
            #tm-guide-modal .tm-guide-foot {
                flex: 0 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
                padding: 14px 22px 17px;
                border-top: 1px solid #f3e8d6;
                background: #fffcf6;
            }
            #tm-guide-modal .tm-guide-foot-hint {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                color: #a1907a;
                font-size: 11px;
                font-weight: 500;
            }
            #tm-guide-modal .tm-guide-foot-hint .xy-icon {
                color: #b5a28a;
                font-size: 11px;
            }
            #tm-guide-modal .tm-guide-confirm {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 7px;
                height: 36px;
                padding: 0 18px;
                border: none;
                border-radius: 9px;
                background: #e8890c;
                color: #fff;
                font-family: inherit;
                font-size: 12.5px;
                font-weight: 700;
                cursor: pointer;
                transition: background .16s ease, box-shadow .16s ease;
            }
            #tm-guide-modal .tm-guide-confirm:hover {
                background: #d97a00;
                box-shadow: 0 4px 10px rgba(217, 122, 0, .2);
            }
            #tm-guide-modal .tm-guide-confirm .xy-icon {
                font-size: 11px;
            }
            #tm-guide-modal .tm-guide-close:focus-visible,
            #tm-guide-modal .tm-guide-confirm:focus-visible {
                outline: 2px solid #e8b86b;
                outline-offset: 2px;
            }
            @keyframes tm-guide-step-in {
                from { opacity: 0; transform: translateY(6px); }
                to { opacity: 1; transform: none; }
            }
            #tm-guide-modal.tm-guide-visible .tm-guide-step {
                animation: tm-guide-step-in .3s cubic-bezier(.2, .7, .3, 1) both;
                animation-delay: calc(40ms + var(--tm-guide-i, 0) * 38ms);
            }
            @media (max-width: 560px) {
                #tm-guide-modal {
                    padding: 12px;
                }
                #tm-guide-modal .tm-guide-dialog {
                    max-height: calc(100vh - 24px);
                    border-radius: 16px;
                }
                #tm-guide-modal .tm-guide-head {
                    gap: 10px;
                    padding: 18px 46px 14px 16px;
                }
                #tm-guide-modal .tm-guide-head-icon {
                    width: 38px;
                    height: 38px;
                    border-radius: 11px;
                    font-size: 17px;
                }
                #tm-guide-modal .tm-guide-title-group h2 {
                    font-size: 17px;
                }
                #tm-guide-modal .tm-guide-title-group p {
                    margin-top: 4px;
                    font-size: 12px;
                }
                #tm-guide-modal .tm-guide-body {
                    padding: 2px 16px 4px;
                }
                #tm-guide-modal .tm-guide-step {
                    grid-template-columns: 20px 30px minmax(0, 1fr);
                    gap: 9px;
                    padding: 10px 0;
                }
                #tm-guide-modal .tm-guide-num {
                    width: 20px;
                    height: 20px;
                    margin-top: 5px;
                    font-size: 11px;
                }
                #tm-guide-modal .tm-guide-step-icon {
                    width: 30px;
                    height: 30px;
                    border-radius: 9px;
                    font-size: 13px;
                }
                #tm-guide-modal .tm-guide-step p {
                    font-size: 12.5px;
                    line-height: 1.68;
                }
                #tm-guide-modal .tm-guide-foot {
                    padding: 12px 16px 14px;
                }
                #tm-guide-modal .tm-guide-foot-hint {
                    display: none;
                }
                #tm-guide-modal .tm-guide-confirm {
                    width: 100%;
                }
            }
            @media (prefers-reduced-motion: reduce) {
                #tm-guide-modal,
                #tm-guide-modal .tm-guide-dialog {
                    transition: none;
                }
                #tm-guide-modal.tm-guide-visible .tm-guide-step {
                    animation: none;
                }
            }
        `;
        (document.head || document.documentElement).appendChild(style);
    }
    function lockGuideScroll() {
        if (guideBodyOverflow !== null) return;
        guideBodyOverflow = {
            overflow: document.body.style.overflow,
            overflowX: document.body.style.overflowX,
            overflowY: document.body.style.overflowY
        };
        document.body.style.overflow = 'hidden';
    }
    function unlockGuideScroll() {
        if (guideBodyOverflow === null) return;
        const saved = guideBodyOverflow;
        guideBodyOverflow = null;
        document.body.style.overflow = saved.overflow;
        document.body.style.overflowX = saved.overflowX;
        document.body.style.overflowY = saved.overflowY;
    }
    function showDownloadGuide() {
        if (guideModal) {
            closeGuide();
            return;
        }
        const staleModal = document.getElementById('tm-guide-modal');
        if (staleModal) staleModal.remove();
        ensureGuideStyles();
        guideSession += 1;
        const guideButton = document.getElementById('tm-download-guide-button');
        const activeElement = document.activeElement;
        guideReturnFocus = activeElement instanceof HTMLElement && activeElement !== document.body
            ? activeElement
            : guideButton;
        const highlightKeywords = (text, keywords) => {
            if (!keywords.length) return text;
            return text.replace(
                new RegExp(`(${keywords.join('|')})`, 'g'),
                '<mark class="tm-guide-k">$1</mark>'
            );
        };
        const steps = [
            {
                icon: 'arrow-up-right-from-square',
                text: '打开视频链接。',
                keywords: ['打开']
            },
            {
                icon: 'circle-play',
                text: '在新标签页中找到播放器。',
                keywords: ['新标签页']
            },
            {
                icon: 'ellipsis-vertical',
                text: '点击播放器右下角的“三点”图标。',
                keywords: ['三点']
            },
            {
                icon: 'download',
                text: '在菜单中选择“下载”选项。',
                keywords: ['下载']
            },
            {
                icon: 'arrow-pointer',
                text: '如果没有“下载”选项，可右键点击视频，<br>选择“将视频另存为…”。',
                keywords: ['下载', '右键', '另存为']
            },
            {
                icon: 'file-video',
                text: '对于流式视频，可使用 M3U8 下载按钮跳转到专业下载工具。',
                keywords: ['M3U8']
            }
        ];
        guideModal = document.createElement('div');
        guideModal.id = 'tm-guide-modal';
        guideModal.innerHTML = `
            <div class="tm-guide-dialog" role="dialog" aria-modal="true" aria-labelledby="tm-guide-title" aria-describedby="tm-guide-desc" tabindex="-1">
                <div class="tm-guide-head">
                    <span class="tm-guide-head-icon">${xyIcon('download')}</span>
                    <div class="tm-guide-title-group">
                        <h2 id="tm-guide-title">如何下载视频</h2>
                        <p id="tm-guide-desc">按步骤操作即可保存课程视频；流媒体请使用 M3U8 下载工具。</p>
                    </div>
                    <button type="button" class="tm-guide-close" aria-label="关闭下载指南">${xyIcon('xmark')}</button>
                </div>
                <div class="tm-guide-body">
                    <ol class="tm-guide-steps">
                        ${steps.map((step, index) => `
                            <li class="tm-guide-step" style="--tm-guide-i:${index}">
                                <span class="tm-guide-num" aria-hidden="true">${index + 1}</span>
                                <span class="tm-guide-step-icon" aria-hidden="true">${xyIcon(step.icon)}</span>
                                <p>${highlightKeywords(step.text, step.keywords)}</p>
                            </li>
                        `).join('')}
                    </ol>
                </div>
                <div class="tm-guide-foot">
                    <span class="tm-guide-foot-hint">${xyIcon('keyboard')}<span>按 Esc 关闭</span></span>
                    <button type="button" class="tm-guide-confirm">${xyIcon('check')}<span>我知道了</span></button>
                </div>
            </div>
        `;
        document.body.appendChild(guideModal);
        lockGuideScroll();
        const dialog = guideModal.querySelector('.tm-guide-dialog');
        const closeButton = guideModal.querySelector('.tm-guide-close');
        const confirmButton = guideModal.querySelector('.tm-guide-confirm');
        closeButton.addEventListener('click', closeGuide);
        confirmButton.addEventListener('click', closeGuide);
        guideModal.addEventListener('click', (event) => {
            if (event.target === guideModal) closeGuide();
        });
        guideKeyHandler = (event) => {
            if (!guideModal) return;
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                closeGuide();
                return;
            }
            if (event.key !== 'Tab') return;
            const focusables = Array.from(dialog.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
                .filter((element) => element.offsetParent !== null);
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', guideKeyHandler, true);
        dialog.focus({ preventScroll: true });
        void guideModal.offsetWidth;
        guideModal.classList.add('tm-guide-visible');
    }
    function closeGuide() {
        if (!guideModal) return;
        const modal = guideModal;
        const session = guideSession;
        const returnFocus = guideReturnFocus;
        guideModal = null;
        guideReturnFocus = null;
        if (guideKeyHandler) {
            document.removeEventListener('keydown', guideKeyHandler, true);
            guideKeyHandler = null;
        }
        modal.classList.remove('tm-guide-visible');
        const reduceMotion = typeof window.matchMedia === 'function'
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setTimeout(() => {
            if (session !== guideSession) return;
            modal.remove();
            unlockGuideScroll();
            if (returnFocus && returnFocus.isConnected && typeof returnFocus.focus === 'function') {
                returnFocus.focus({ preventScroll: true });
            }
        }, reduceMotion ? 0 : 220);
    }
    function showStatus(message) {
        const statusElement = document.getElementById('tm-status');
        statusElement.textContent = message;
        statusElement.style.opacity = '1';
        clearTimeout(statusHideTimer);
        statusHideTimer = setTimeout(() => {
            statusElement.style.opacity = '0';
        }, 5000);
    }
    getVideoInfo();
    detectInterval = setInterval(checkUrlAndExecute, 1000);
    window.addEventListener('popstate', checkUrlAndExecute);
}
const hpFolderNameCache = new Map();
const hpFolderNameMissCache = new Set();
function hpBig(value) {
    try {
        const b = BigInt(String(value));
        return b > 0n ? b : null;
    } catch (e) {
        return null;
    }
}
function hpSleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function hpApi(path) {
    const token = getCookie();
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), 8000) : null;
    try {
        const response = await fetch(`https://${hostname}${path}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json; charset=utf-8'
            },
            ...(controller ? { signal: controller.signal } : {})
        });
        let json = null;
        try {
            json = await response.json();
        } catch (e) {
            json = null;
        }
        return { status: response.status, json };
    } finally {
        if (timer) clearTimeout(timer);
    }
}
async function hpFetchVisibleResources(groupId) {
    const paths = [
        `/api/jx-iresource/resource/queryCourseResources/v2?group_id=${groupId}`,
        `/api/jx-iresource/resource/queryCourseResources?group_id=${groupId}`
    ];
    for (const path of paths) {
        try {
            const { json } = await hpApi(path);
            if (json && json.success && Array.isArray(json.data)) {
                return json.data;
            }
        } catch (e) {
            console.warn('[隐藏资源] 列表接口失败:', path, e);
        }
    }
    return null;
}
async function hpQueryNode(nodeId) {
    try {
        const { json } = await hpApi(`/api/jx-iresource/ta_node/queryNodeAnyway?node_id=${nodeId}`);
        if (!json) return { ok: false, reason: 'empty' };
        if (json.success && json.data) return { ok: true, data: json.data };
        return { ok: false, code: json.code, message: json.message || '' };
    } catch (e) {
        return { ok: false, reason: 'network' };
    }
}
function hpNormalizeNode(node) {
    const resource = node.resource || {};
    return {
        id: String(node.id),
        name: String(node.name || resource.filename || resource.title || node.id),
        type: Number(node.type) || 0,
        public: Number(node.public),
        hidden: Number(node.public) === 1,
        del: Number(node.del),
        quote_id: node.quote_id || resource.id || null,
        video_id: resource.video_id || null,
        size: Number(resource.size) || 0,
        mimetype: resource.mimetype || node.mimetype || '',
        path: node.path || null,
        created_at: node.created_at || null,
        updated_at: node.updated_at || null,
        creator: node.creator || null,
        parent_id: node.parent_id && String(node.parent_id) !== '0' ? String(node.parent_id) : null
    };
}
async function hpResolveFolderNames(ids) {
    const missing = [...new Set((ids || []).map(String).filter(Boolean))]
        .filter(id => !hpFolderNameCache.has(id) && !hpFolderNameMissCache.has(id));
    const chunkSize = 6;
    const deadline = Date.now() + 6000;
    for (let i = 0; i < missing.length; i += chunkSize) {
        if (Date.now() > deadline) break;
        await Promise.all(missing.slice(i, i + chunkSize).map(async id => {
            if (hpFolderNameCache.has(id) || hpFolderNameMissCache.has(id)) return;
            const result = await Promise.race([
                hpQueryNode(id),
                hpSleep(4000).then(() => ({ ok: false, reason: 'timeout' }))
            ]);
            if (result.ok && result.data) {
                const node = hpNormalizeNode(result.data);
                if (node.type === 1 && node.name && !/^\d+$/.test(node.name)) {
                    hpFolderNameCache.set(id, node.name);
                    return;
                }
            }
            hpFolderNameMissCache.add(id);
        }));
    }
}
function hpBuildCandidates(visibleIds, options) {
    const numbers = [...new Set(visibleIds.map(String))]
        .map(hpBig)
        .filter(Boolean)
        .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    const gaps = [];
    for (let i = 1; i < numbers.length; i++) {
        const from = numbers[i - 1];
        const to = numbers[i];
        const size = Number(to - from - 1n);
        if (size <= 0) continue;
        if (size > options.maxGap) continue;
        gaps.push({ from, to, size });
    }
    const reserve = Math.max(0, options.edge * 2);
    const budget = Math.max(0, options.maxProbes - reserve);
    const picked = [];
    const seen = new Set();
    const push = (value) => {
        if (picked.length >= budget) return false;
        const key = value.toString();
        if (seen.has(key)) return true;
        seen.add(key);
        picked.push(key);
        return true;
    };
    let progressed = true;
    for (let offset = 1; progressed && picked.length < budget; offset++) {
        progressed = false;
        for (const gap of gaps) {
            if (offset > gap.size) continue;
            progressed = true;
            const left = gap.from + BigInt(offset);
            const right = gap.to - BigInt(offset);
            if (!push(left)) return picked;
            if (right > left) push(right);
            if (picked.length >= budget) return picked;
        }
    }
    if (options.edge > 0 && numbers.length) {
        const first = numbers[0];
        const last = numbers[numbers.length - 1];
        for (let k = 1; k <= options.edge; k++) {
            picked.push((first - BigInt(k)).toString());
            picked.push((last + BigInt(k)).toString());
        }
    }
    return picked;
}
async function probeHiddenResources(groupId, options, hooks) {
    const opts = Object.assign({}, HP_PROBE_DEFAULTS, options || {});
    const onProgress = (hooks && hooks.onProgress) || function () { };
    const shouldStop = (hooks && hooks.shouldStop) || function () { return false; };
    const visible = Array.isArray(opts.visible) ? opts.visible : await hpFetchVisibleResources(groupId);
    if (!visible) throw new Error('无法获取课程资源列表，请确认当前在课程页面');
    const visibleIds = new Set(visible.map(item => String(item.id)));
    const candidates = hpBuildCandidates([...visibleIds], opts);
    const found = new Map();
    const folderNames = new Map();
    const deadline = Date.now() + Math.max(5000, Number(opts.timeBudgetMs) || 60000);
    let skippedTasks = 0;
    let cursor = 0;
    let done = 0;
    let stopped = false;
    const worker = async () => {
        while (cursor < candidates.length) {
            if (stopped || shouldStop() || Date.now() > deadline) {
                stopped = true;
                return;
            }
            if (document.visibilityState === 'hidden') {
                stopped = true;
                return;
            }
            const nodeId = candidates[cursor++];
            done++;
            const result = await hpQueryNode(nodeId);
            if (result.ok && result.data) {
                const node = result.data;
                const sameGroup = String(node.group_id) === String(groupId);
                if (sameGroup && Number(node.type) === 1) {
                    const folderName = String(node.name || '').trim();
                    if (folderName && !/^\d+$/.test(folderName)) {
                        hpFolderNameCache.set(String(node.id), folderName);
                        folderNames.set(String(node.id), folderName);
                    }
                }
                if (sameGroup && node.quote_id && Number(node.type) !== 1) {
                    found.set(String(node.id), hpNormalizeNode(node));
                }
            } else if (result.code === 3003446) {
                skippedTasks++;
            }
            if (done % 8 === 0 || done === candidates.length) {
                onProgress({ done, total: candidates.length, found: found.size, nodeId });
            }
            if (opts.delayMs) {
                await hpSleep(opts.delayMs * (0.8 + Math.random() * 0.4));
            }
        }
    };
    const workerCount = Math.max(1, Math.min(12, Number(opts.concurrency) || 6));
    await Promise.all(Array.from({ length: workerCount }, worker));
    const items = [...found.values()].sort((a, b) => {
        const x = hpBig(a.id);
        const y = hpBig(b.id);
        if (x === null || y === null) return 0;
        return x < y ? -1 : x > y ? 1 : 0;
    });
    onProgress({ done, total: candidates.length, found: items.length, finished: true });
    return {
        items,
        probed: done,
        total: candidates.length,
        skippedTasks,
        stopped,
        folders: Object.fromEntries(folderNames)
    };
}
async function hpResolveDownloadUrl(item) {
    const token = getCookie();
    const quoteId = item.quote_id;
    if (!quoteId) throw new Error('该节点没有可用的资源 ID');
    const tryFetchUrl = async (path) => {
        try {
            const response = await fetch(`https://${hostname}${path}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const json = await response.json();
            if (json && json.success && json.data && json.data.download_url) {
                return json.data.download_url;
            }
        } catch (e) {
        }
        return null;
    };
    const isVideo = item.type === 9 || !!item.video_id;
    if (isVideo) {
        const url = await tryFetchUrl(`/api/jx-oresource/vod/video/${quoteId}`);
        if (url) return url;
    }
    const fileUrl = await tryFetchUrl(`/api/jx-oresource/cloud/file_down/${quoteId}/v2`);
    if (fileUrl) return fileUrl;
    if (!isVideo) {
        const url = await tryFetchUrl(`/api/jx-oresource/vod/video/${quoteId}`);
        if (url) return url;
    }
    return await window.getDownloadUrl(quoteId);
}
const HP_SKIP_TYPES = new Set([7, 8, 11]);
const HP_PROBE_DEFAULTS = {
    maxGap: 4096,
    edge: 12,
    maxProbes: 480,
    concurrency: 3,
    delayMs: 90,
    timeBudgetMs: 40000
};
const HP_CACHE_KEY_PREFIX = 'xyHiddenProbeCache:v2:';
const HP_CACHE_TTL = 12 * 60 * 60 * 1000;
const hpProbing = new Set();
const hpScannedGroups = new Set();
let hpDownloadFallbackReady = false;
function hpVisibleSignature(resources) {
    const ids = (resources || []).map(resource => String(resource.id)).sort();
    let hash = 2166136261;
    for (const id of ids) {
        for (let i = 0; i < id.length; i++) {
            hash ^= id.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        hash ^= 44;
        hash = Math.imul(hash, 16777619);
    }
    return `${ids.length}:${(hash >>> 0).toString(36)}`;
}
function hpLoadPersistentCache(groupId, signature) {
    try {
        const raw = localStorage.getItem(HP_CACHE_KEY_PREFIX + groupId);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (!data || data.signature !== signature || !Array.isArray(data.items)) return null;
        if (Date.now() - Number(data.ts || 0) > HP_CACHE_TTL) return null;
        if (data.folders && typeof data.folders === 'object') {
            Object.entries(data.folders).forEach(([id, name]) => {
                if (id && name) hpFolderNameCache.set(String(id), String(name));
            });
        }
        return { items: data.items, folders: data.folders || {} };
    } catch (e) {
        return null;
    }
}
function hpSavePersistentCache(groupId, signature, items, folders) {
    try {
        localStorage.setItem(HP_CACHE_KEY_PREFIX + groupId, JSON.stringify({
            ts: Date.now(),
            signature,
            items: items || [],
            folders: folders || {}
        }));
    } catch (e) {
    }
}
function hpInstallDownloadFallback() {
    if (hpDownloadFallbackReady) return;
    if (typeof window.getDownloadUrl !== 'function') return;
    const original = window.getDownloadUrl;
    if (original.__hpWrapped) {
        hpDownloadFallbackReady = true;
        return;
    }
    const wrapped = async function (quoteId) {
        try {
            return await original(quoteId);
        } catch (error) {
            const signed = await hpTrySignedUrl(quoteId, false);
            if (signed) return signed;
            throw error;
        }
    };
    wrapped.__hpWrapped = true;
    window.getDownloadUrl = wrapped;
    hpDownloadFallbackReady = true;
}
async function hpTrySignedUrl(quoteId, isVideo) {
    const token = getCookie();
    const attempt = async (path) => {
        try {
            const response = await fetch(`https://${hostname}${path}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const json = await response.json();
            if (json && json.success && json.data && json.data.download_url) {
                return json.data.download_url;
            }
        } catch (e) {
        }
        return null;
    };
    if (isVideo) {
        const vod = await attempt(`/api/jx-oresource/vod/video/${quoteId}`);
        if (vod) return vod;
    }
    const file = await attempt(`/api/jx-oresource/cloud/file_down/${quoteId}/v2`);
    if (file) return file;
    if (!isVideo) {
        return await attempt(`/api/jx-oresource/vod/video/${quoteId}`);
    }
    return null;
}
function hpFormatDate(value) {
    if (!value) return '';
    try {
        return new Date(value).toLocaleDateString();
    } catch (e) {
        return '';
    }
}
const HP_EYE_ICON = xyIcon('eye');
const HP_DOWNLOAD_ICON = xyIcon('download');
function hpBuildListRow(item) {
    const name = item.name;
    const created = hpFormatDate(item.created_at);
    const updated = hpFormatDate(item.updated_at);
    const path = item.path || (item.parent_id && String(item.parent_id) !== '0'
        ? `${item.parent_id}/${item.id}`
        : String(item.id));
    const row = document.createElement('div');
    row.className = 'file-item';
    row.setAttribute('data-hidden', '1');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'custom-checkbox';
    checkbox.id = 'file-checkbox-' + item.id;
    checkbox.setAttribute('data-visible', 'true');
    checkbox.addEventListener('change', function () {
        updateTreeCheckbox(this);
        syncTreeWithDownloadList();
    });
    const icon = document.createElement('span');
    icon.className = 'file-icon';
    icon.innerHTML = getFileIcon(name);
    const info = document.createElement('div');
    info.className = 'file-info';
    const fileName = document.createElement('div');
    fileName.className = 'file-name';
    fileName.textContent = name;
    fileName.title = name;
    const nameRow = document.createElement('div');
    nameRow.className = 'file-name-row';
    nameRow.appendChild(fileName);
    const hiddenBadge = document.createElement('span');
    hiddenBadge.className = 'file-hidden-badge';
    hiddenBadge.title = '由隐藏资源探测补全';
    hiddenBadge.innerHTML = `${xyIcon('eye-slash')}<span>隐藏</span>`;
    nameRow.appendChild(hiddenBadge);
    const details = document.createElement('div');
    details.className = 'file-details';
    if (created && updated && created !== updated) {
        details.textContent = `创建: ${created}　更新: ${updated}`;
        details.title = '创建日期 / 更新日期';
    } else if (created || updated) {
        details.textContent = `创建/更新: ${created || updated}`;
        details.title = '创建和更新日期';
    }
    info.appendChild(nameRow);
    info.appendChild(details);
    const previewLink = document.createElement('a');
    previewLink.className = 'preview-link';
    previewLink.href = '#';
    previewLink.title = `预览 ${name}`;
    previewLink.setAttribute('data-created-at', item.created_at || '');
    previewLink.setAttribute('data-updated-at', item.updated_at || '');
    previewLink.setAttribute('data-origin-name', name);
    previewLink.setAttribute('data-resource-id', item.id);
    previewLink.setAttribute('data-path', path);
    previewLink.setAttribute('data-parent-id', item.parent_id || '');
    const previewIcon = document.createElement('span');
    previewIcon.className = 'preview-icon';
    previewIcon.innerHTML = HP_EYE_ICON;
    previewLink.appendChild(previewIcon);
    previewLink.addEventListener('click', async function (event) {
        event.preventDefault();
        const node = this.querySelector('.preview-icon');
        const backup = node.innerHTML;
        node.innerHTML = xyIcon('spinner', 'fa-spin');
        try {
            const url = await hpResolveDownloadUrl(item);
            if (!url) throw new Error('未能获取预览地址');
            previewFile(name, url);
        } catch (error) {
            console.warn('[隐藏资源] 预览失败:', name, error);
            showNotification(`预览失败：${name}`, 'error');
        } finally {
            node.innerHTML = backup;
        }
    });
    const downloadLink = document.createElement('a');
    downloadLink.className = 'download-link';
    downloadLink.href = '#';
    downloadLink.target = '_blank';
    downloadLink.title = `下载 ${name}`;
    downloadLink.setAttribute('data-created-at', item.created_at || '');
    downloadLink.setAttribute('data-updated-at', item.updated_at || '');
    downloadLink.setAttribute('data-origin-name', name);
    downloadLink.setAttribute('data-resource-id', item.id);
    downloadLink.setAttribute('data-path', path);
    downloadLink.setAttribute('data-parent-id', item.parent_id || '');
    downloadLink.setAttribute('data-quote-id', item.quote_id || '');
    const downloadIcon = document.createElement('span');
    downloadIcon.className = 'download-icon';
    downloadIcon.innerHTML = HP_DOWNLOAD_ICON;
    downloadLink.appendChild(downloadIcon);
    downloadLink.addEventListener('click', async function (event) {
        event.preventDefault();
        const node = this.querySelector('.download-icon');
        const backup = node.innerHTML;
        node.innerHTML = xyIcon('spinner', 'fa-spin');
        try {
            totalDownloads++;
            updateTotalProgress();
            const url = await hpResolveDownloadUrl(item);
            if (!url) throw new Error('未能获取下载地址');
            courseDownload(url, name);
        } catch (error) {
            console.warn('[隐藏资源] 下载失败:', name, error);
            if (typeof addFailedFileNotification === 'function') {
                addFailedFileNotification(name);
            }
            completedDownloads++;
            updateTotalProgress();
        } finally {
            node.innerHTML = backup;
        }
    });
    row.appendChild(checkbox);
    row.appendChild(icon);
    row.appendChild(info);
    row.appendChild(previewLink);
    row.appendChild(downloadLink);
    return row;
}
function hpApplyItems(gid, items) {
    const list = document.getElementById('download_list');
    if (!list || !items || !items.length) return 0;
    const existing = new Set(
        [...list.querySelectorAll('.file-item')]
            .map(row => {
                const link = row.querySelector('a.download-link');
                return link ? link.getAttribute('data-resource-id') : null;
            })
            .filter(Boolean)
    );
    let added = 0;
    const fragment = document.createDocumentFragment();
    for (const item of items) {
        if (existing.has(item.id)) continue;
        if (HP_SKIP_TYPES.has(item.type)) continue;
        if (isVideoFile(item.mimetype, item.name)) continue;
        const row = hpBuildListRow(item);
        if (!row) continue;
        fragment.appendChild(row);
        existing.add(item.id);
        added++;
    }
    if (added > 0) list.appendChild(fragment);
    if (added > 0) {
        try {
            applyFilters();
            updateSelectAllCheckbox();
            syncTreeWithDownloadList();
        } catch (e) {
            console.warn('[隐藏资源] 刷新列表状态失败:', e);
        }
    }
    return added;
}
async function hpInjectHiddenItems(groupId, options) {
    const gid = groupId || getGroupIdFromUrl();
    if (!gid) return { added: 0 };
    hpInstallDownloadFallback();
    const opts = options || {};
    const signature = opts.signature || (Array.isArray(opts.visible) ? hpVisibleSignature(opts.visible) : '');
    const result = await probeHiddenResources(gid, opts, {
        shouldStop: () => getGroupIdFromUrl() !== gid,
        onProgress: typeof opts.onProgress === 'function' ? opts.onProgress : undefined
    });
    if (getGroupIdFromUrl() !== gid) {
        console.log(`[隐藏资源] 课程 ${gid} 已切换，放弃本次结果`);
        return {
            added: 0,
            found: result.items.length,
            skippedTask: 0,
            skippedVideo: 0,
            probed: result.probed,
            stopped: true,
            groupChanged: true
        };
    }
    if (!result.stopped && signature) {
        hpSavePersistentCache(gid, signature, result.items, result.folders);
    }
    const added = hpApplyItems(gid, result.items);
    const skippedTask = result.items.filter(item => HP_SKIP_TYPES.has(item.type)).length;
    const skippedVideo = result.items.filter(item => !HP_SKIP_TYPES.has(item.type) && isVideoFile(item.mimetype, item.name)).length;
    console.log(
        `[隐藏资源] 课程 ${gid}：探测 ${result.probed} 个候选，命中 ${result.items.length} 项，补全 ${added} 项` +
        (skippedTask ? `，跳过任务类 ${skippedTask} 项` : '') +
        (skippedVideo ? `，跳过视频 ${skippedVideo} 项` : '')
    );
    return {
        added,
        found: result.items.length,
        skippedTask,
        skippedVideo,
        probed: result.probed,
        stopped: result.stopped
    };
}
function hpSetHiddenProbeButtonState(state, label) {
    const button = document.getElementById('hiddenProbeButton');
    if (!button) return;
    if (state === 'running') {
        button.disabled = true;
        button.dataset.running = '1';
        delete button.dataset.scanned;
        button.setAttribute('aria-busy', 'true');
        button.title = '正在扫描隐藏资源，请稍候';
        button.innerHTML = `${xyIcon('spinner', 'fa-spin')}<span>${label || '探测中…'}</span>`;
        return;
    }
    button.disabled = false;
    delete button.dataset.running;
    button.removeAttribute('aria-busy');
    const gid = getGroupIdFromUrl();
    if (gid && hpScannedGroups.has(gid)) {
        button.dataset.scanned = '1';
        button.title = '重新扫描当前课程的隐藏资源（会再次请求接口）';
        button.innerHTML = `${xyIcon('rotate-right')}<span>重新探测</span>`;
    } else {
        delete button.dataset.scanned;
        button.title = '扫描当前课程中未显示的隐藏资源';
        button.innerHTML = `${xyIcon('magnifying-glass')}<span>探测隐藏</span>`;
    }
}
function createOrUpdateHiddenProbeButton(parent) {
    const gid = getGroupIdFromUrl();
    const hasResources = !!gid && currentResourcesGroupId === gid &&
        Array.isArray(course_resources) && course_resources.length > 0;
    let button = document.getElementById('hiddenProbeButton');
    if (!hasResources) {
        if (button) button.remove();
        return;
    }
    if (!button) {
        if (!parent) return;
        button = document.createElement('button');
        button.type = 'button';
        button.id = 'hiddenProbeButton';
        button.addEventListener('click', hpRunManualProbe);
        parent.appendChild(button);
    }
    hpSetHiddenProbeButtonState(hpProbing.has(gid) ? 'running' : 'idle');
}
async function hpRunManualProbe() {
    const gid = getGroupIdFromUrl();
    if (!gid) {
        showNotification('请先进入课程页面', 'warning');
        return;
    }
    if (hpProbing.has(gid)) return;
    if (currentResourcesGroupId !== gid || !Array.isArray(course_resources) || !course_resources.length) {
        showNotification('课件列表还未加载完成，请稍后再试', 'warning');
        return;
    }
    const visible = course_resources;
    const signature = hpVisibleSignature(visible);
    hpProbing.add(gid);
    hpSetHiddenProbeButtonState('running');
    try {
        if (!hpScannedGroups.has(gid)) {
            const cached = hpLoadPersistentCache(gid, signature);
            if (cached) {
                if (getGroupIdFromUrl() !== gid) return;
                const items = Array.isArray(cached.items) ? cached.items : [];
                const added = hpApplyItems(gid, items);
                hpScannedGroups.add(gid);
                if (items.length > 0) {
                    showNotification(`已使用本地缓存：加入 ${added} 项隐藏资源`, 'info');
                } else {
                    showNotification('缓存中未发现隐藏资源，可再次点击重新探测', 'info');
                }
                return;
            }
        }
        const result = await hpInjectHiddenItems(gid, {
            visible,
            signature,
            onProgress: progress => {
                if (getGroupIdFromUrl() !== gid) return;
                const total = Math.max(1, Number(progress.total) || 0);
                const percent = Math.min(100, Math.round((Number(progress.done) || 0) / total * 100));
                hpSetHiddenProbeButtonState('running', `探测中 ${percent}%`);
                const button = document.getElementById('hiddenProbeButton');
                if (button) {
                    button.title = `已探测 ${progress.done}/${progress.total}，发现 ${progress.found} 项`;
                }
            }
        });
        if (getGroupIdFromUrl() !== gid) return;
        if (result.probed > 0 || result.found > 0) {
            hpScannedGroups.add(gid);
        }
        if (result.stopped) {
            showNotification(`探测中断，已加入 ${result.added} 项`, 'warning');
        } else if (result.found === 0) {
            showNotification('探测完成：未发现隐藏资源', 'info');
        } else if (result.added > 0) {
            showNotification(`探测完成：发现 ${result.found} 项隐藏资源，加入 ${result.added} 项`, 'info');
        } else {
            showNotification(`探测完成：发现 ${result.found} 项隐藏资源，均已存在或已跳过`, 'info');
        }
    } catch (error) {
        console.warn('[隐藏资源] 手动探测失败:', error);
        if (getGroupIdFromUrl() === gid) {
            showNotification(`隐藏资源探测失败：${error && error.message ? error.message : '请稍后重试'}`, 'error');
        }
    } finally {
        hpProbing.delete(gid);
        const list = document.getElementById('download_list');
        if (list) createOrUpdateHiddenProbeButton(list);
    }
}
const XY_HOST_IDS = {
    course: 'xy-course-host',
    filesQuick: 'xy-files-quick-host',
    filesToolbar: 'xy-files-toolbar',
    filesList: 'xy-files-list-host',
    tree: 'xy-tree-host',
    export: 'xy-export-host',
    progress: 'xy-progress-host',
    download: 'xy-download-host',
    video: 'xy-video-host',
    teacher: 'xy-teacher-host',
    user: 'xy-user-host',
    debug: 'xy-debug-host',
    messages: 'xy-messages-host',
    tips: 'xy-tips-host',
    display: 'xy-display-host',
    filters: 'xy-filter-host',
    update: 'xy-update-host'
};
let xyBadgeTimer = null;
let xyFitTimer = null;
let xyFitFrame = null;
let xyResizeTimer = null;
let xyPaneObserver = null;
function xyEl(id) {
    return document.getElementById(id);
}
function xyHost(key) {
    return xyEl(XY_HOST_IDS[key]);
}
function xyInjectWorkspaceStyles() {
    if (xyEl('xy-workspace-styles')) return;
    const style = document.createElement('style');
    style.id = 'xy-workspace-styles';
    style.textContent = `
        #xy-app {
            --xy-orange: #f6a723;
            --xy-orange-dark: #e07800;
            --xy-ink: #4b3722;
            --xy-muted: #9b8a72;
            --xy-line: #f1e0c1;
            --xy-paper: #fffdf8;
            position: fixed;
            inset: 0;
            z-index: 9990;
            pointer-events: none;
            color: var(--xy-ink);
            font-family: 'Microsoft YaHei', 'Segoe UI', Tahoma, sans-serif;
        }
        #xy-app *,
        #xy-app *::before,
        #xy-app *::after {
            box-sizing: border-box;
        }
        #xy-app button,
        #xy-app input,
        #xy-app select,
        #xy-app textarea,
        #xy-app a {
            pointer-events: auto;
        }
        #xy-fab {
            position: absolute;
            right: 24px;
            bottom: 24px;
            width: 58px;
            height: 58px;
            padding: 0;
            border: none;
            border-radius: 50%;
            background: linear-gradient(135deg, #ffc247, #ff8a00);
            box-shadow: 0 10px 24px rgba(224, 120, 0, .35), 0 2px 6px rgba(0, 0, 0, .12);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
            pointer-events: auto;
        }
        #xy-fab:hover {
            transform: translateY(-2px);
            box-shadow: 0 14px 30px rgba(224, 120, 0, .42), 0 2px 6px rgba(0, 0, 0, .12);
        }
        #xy-fab .xy-fab-glyph {
            font-size: 26px;
            line-height: 1;
            filter: drop-shadow(0 1px 1px rgba(0, 0, 0, .15));
        }
        #xy-fab .xy-icon {
            color: #fff;
        }
        #xy-fab .xy-fab-badge {
            position: absolute;
            top: -4px;
            right: -4px;
            min-width: 20px;
            height: 20px;
            padding: 0 5px;
            border: 2px solid #ffb347;
            border-radius: 10px;
            background: #fff;
            color: #d97400;
            font-size: 11px;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #xy-fab .xy-fab-badge[hidden] {
            display: none;
        }
        #xy-app.xy-open #xy-fab {
            opacity: .8;
            transform: scale(.92);
        }
        #xy-drawer {
            position: absolute;
            right: 24px;
            bottom: 96px;
            width: min(680px, calc(100vw - 32px));
            height: min(820px, calc(100vh - 128px));
            display: flex;
            flex-direction: column;
            background: var(--xy-paper);
            border: 1px solid #f1dfbf;
            border-radius: 20px;
            box-shadow: 0 24px 60px rgba(120, 78, 10, .22), 0 4px 16px rgba(0, 0, 0, .06);
            overflow: hidden;
            opacity: 0;
            transform: translateY(12px) scale(.98);
            transition: opacity .22s ease, transform .22s ease, visibility 0s linear .22s;
            visibility: hidden;
            pointer-events: none;
        }
        #xy-app.xy-open #xy-drawer {
            opacity: 1;
            transform: none;
            visibility: visible;
            transition: opacity .22s ease, transform .22s ease, visibility 0s;
            pointer-events: auto;
        }
        .xy-head {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 16px;
            background: linear-gradient(120deg, #fff7e6, #ffe7bd);
            border-bottom: 1px solid #f6e1b8;
            flex-shrink: 0;
        }
        .xy-logo {
            width: 42px;
            height: 42px;
            border-radius: 14px;
            background: linear-gradient(135deg, #ffc247, #ff8a00);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            box-shadow: 0 6px 14px rgba(255, 138, 0, .28);
            flex-shrink: 0;
        }
        .xy-logo .xy-icon {
            color: #c57a0a;
        }
        .xy-head-text {
            flex: 1;
            min-width: 0;
        }
        .xy-title {
            font-size: 17px;
            font-weight: 800;
            color: #7a4400;
            letter-spacing: .5px;
        }
        .xy-sub {
            margin-top: 2px;
            font-size: 12px;
            color: #a97a2c;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.4;
        }
        .xy-close {
            width: 32px;
            height: 32px;
            padding: 0;
            border: none;
            border-radius: 10px;
            background: rgba(255, 255, 255, .7);
            color: #a06a12;
            font-size: 20px;
            line-height: 1;
            cursor: pointer;
            flex-shrink: 0;
        }
        .xy-close:hover {
            background: #fff;
            color: var(--xy-orange-dark);
        }
        .xy-tabs {
            display: flex;
            gap: 6px;
            padding: 9px 14px;
            background: #fffaf0;
            border-bottom: 1px solid #f4e3c2;
            flex-shrink: 0;
        }
        .xy-tab {
            flex: 1;
            padding: 9px 8px;
            border: none;
            border-radius: 10px;
            background: transparent;
            color: #8a6a33;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            transition: background .18s ease, color .18s ease, box-shadow .18s ease;
        }
        .xy-tab:hover {
            background: #fff3d9;
        }
        .xy-tab.active {
            background: #fff;
            color: #c56a00;
            box-shadow: 0 2px 8px rgba(197, 106, 0, .14);
        }
        .xy-tab-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 18px;
            height: 18px;
            padding: 0 4px;
            margin-left: 4px;
            border-radius: 9px;
            background: #ff8a00;
            color: #fff;
            font-size: 10px;
            font-weight: 800;
        }
        .xy-tab-badge[hidden] {
            display: none;
        }
        .xy-body {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            padding: 14px;
            background: var(--xy-paper);
        }
        .xy-body::-webkit-scrollbar {
            width: 8px;
        }
        .xy-body::-webkit-scrollbar-thumb {
            background: #efdcba;
            border-radius: 4px;
        }
        .xy-pane {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .xy-pane[hidden] {
            display: none !important;
        }
        .xy-card {
            background: #fff;
            border: 1px solid var(--xy-line);
            border-radius: 14px;
            padding: 14px;
            box-shadow: 0 2px 10px rgba(186, 140, 60, .06);
        }
        .xy-card-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 10px;
        }
        .xy-card-head h3 {
            margin: 0;
            font-size: 14px;
            font-weight: 800;
            color: #a35f00;
            letter-spacing: .3px;
        }
        .xy-hint {
            font-size: 12px;
            color: var(--xy-muted);
            font-weight: 400;
        }
        .xy-btn {
            padding: 9px 16px;
            border: none;
            border-radius: 10px;
            background: #fff3d9;
            color: #a35f00;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            transition: background .18s ease, transform .18s ease;
        }
        .xy-btn:hover {
            background: #ffe6b8;
            transform: translateY(-1px);
        }
        .xy-btn-primary {
            background: linear-gradient(135deg, #ffbc3f, #f08a00);
            color: #fff;
            box-shadow: 0 4px 10px rgba(240, 138, 0, .28);
        }
        .xy-btn-primary:hover {
            background: linear-gradient(135deg, #ffc85c, #f59616);
        }
        .xy-check {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            font-size: 12px;
            color: #8a6a33;
            font-weight: 600;
            cursor: pointer;
            user-select: none;
        }
        .xy-check input {
            accent-color: var(--xy-orange);
        }
        .xy-files-block {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .xy-toolbar {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
            margin-bottom: 10px;
        }
        .xy-toolbar:empty::before {
            content: '资源加载后即可使用批量下载与课程结构';
            font-size: 12px;
            color: var(--xy-muted);
        }
        #xy-files-list-host #download_list {
            position: static !important;
            right: auto !important;
            bottom: auto !important;
            width: 100% !important;
            max-height: none !important;
            overflow: visible !important;
            transform: none !important;
            opacity: 1 !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            backdrop-filter: none !important;
            z-index: auto !important;
        }
        #xy-files-toolbar > div {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 0 4px !important;
            margin: 0 !important;
        }
        #xy-files-toolbar #selectAllCheckbox {
            margin-right: 4px;
        }
        #xy-files-list-host #download_list > div[style*="height: 300px"] {
            height: auto !important;
            padding: 10px 0 !important;
        }
        #xy-export-host > div {
            margin-top: 0 !important;
        }
        #xy-export-host #zipTextContainer {
            margin-top: 10px !important;
        }
        #xy-progress-host #downloadsWrapperContainer {
            position: relative !important;
            left: auto !important;
            bottom: auto !important;
            transform: none !important;
            width: 100% !important;
            display: block !important;
        }
        #xy-progress-host #progressIndicator {
            top: 12px !important;
            right: 12px !important;
            z-index: 2 !important;
        }
        #xy-progress-host #downloadsContainer {
            min-width: 0 !important;
            width: 100% !important;
            max-height: none !important;
            padding: 12px !important;
            border-radius: 12px !important;
            box-shadow: none !important;
        }
        #xy-video-host #tm-video-assistant {
            position: static !important;
            top: auto !important;
            right: auto !important;
            width: 100% !important;
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            border-radius: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
            cursor: default !important;
            animation: none !important;
        }
        #xy-video-host .tm-info-container,
        #xy-video-host #tm-m3u8-container {
            background: #fff !important;
            border: 1px solid #f1e0c1 !important;
            border-left: 4px solid #ffb347 !important;
        }
        #xy-video-host #tm-assistant-content {
            display: flex !important;
            opacity: 1 !important;
            padding: 0 !important;
        }
        #xy-teacher-host #teacherInfoContainer,
        #xy-user-host #userSearchContainer {
            position: static !important;
            left: auto !important;
            top: auto !important;
            width: 100% !important;
            height: auto !important;
            max-height: none !important;
            padding: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
        }
        #xy-teacher-host #teacherInfoContent,
        #xy-user-host #userSearchContainer > div {
            height: auto !important;
            max-height: none !important;
        }
        #xy-teacher-host #teacherInfoContent .title {
            display: none !important;
        }
        #xy-user-host #userSearchInput {
            width: 100% !important;
            margin: 0 0 8px !important;
        }
        #xy-user-host #userSearchButton {
            width: 100%;
        }
        #xy-debug-host #debuggerDisablerContainer {
            position: static !important;
            top: auto !important;
            left: auto !important;
            transform: none !important;
            width: 100% !important;
            height: auto !important;
            padding: 14px !important;
            border-radius: 12px !important;
        }
        #xy-debug-host #debuggerDisablerContainer > div {
            height: auto !important;
            gap: 10px;
        }
        #xy-tips-host #tipsDisplay {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
        }
        #xy-filter-host input[type="text"] {
            transform: none !important;
            font-style: normal !important;
        }
        #xy-course-host #showCourseNameText {
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            border-radius: 0 !important;
            background: none !important;
            color: #a97a2c !important;
            -webkit-text-fill-color: #a97a2c !important;
            font-size: 12px !important;
            line-height: 1.4 !important;
            text-align: left !important;
            animation: none !important;
            box-shadow: none !important;
        }
        #xy-app [data-category] {
            width: 100% !important;
        }
        #xy-messages-host,
        #xy-download-host,
        #xy-display-host,
        #xy-filter-host,
        #xy-update-host {
            width: 100%;
        }
        #xy-app {
            --xy-orange: #e8890c;
            --xy-orange-dark: #c96f00;
            --xy-ink: #4b3722;
            --xy-muted: #8c7a62;
            --xy-line: #e9ddc9;
            --xy-paper: #fffdf8;
        }
        #xy-backdrop {
            position: absolute;
            inset: 0;
            z-index: 1;
            background: rgba(48, 36, 20, .16);
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity .2s ease, visibility 0s linear .2s;
        }
        #xy-app.xy-open #xy-backdrop {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
            transition: opacity .2s ease, visibility 0s;
        }
        #xy-fab {
            right: 22px;
            bottom: 22px;
            z-index: 3;
            width: 54px;
            height: 54px;
            background: linear-gradient(135deg, #f7b23b, #e8890c);
            box-shadow: 0 8px 22px rgba(180, 110, 10, .28), 0 2px 6px rgba(0, 0, 0, .12);
        }
        #xy-app.xy-open #xy-fab {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transform: scale(.85);
        }
        #xy-drawer {
            right: 22px;
            bottom: 22px;
            z-index: 2;
            width: min(720px, calc(100vw - 44px));
            height: min(860px, calc(100vh - 44px));
            border-color: #e9ddc9;
            border-radius: 18px;
            background: #fffdf8;
            box-shadow: 0 24px 64px rgba(90, 60, 20, .18), 0 4px 16px rgba(0, 0, 0, .05);
            transition: opacity .22s ease, transform .22s ease, visibility 0s linear .22s, height .3s cubic-bezier(.4, 0, .2, 1);
        }
        #xy-app.xy-open #xy-drawer {
            transition: opacity .22s ease, transform .22s ease, visibility 0s, height .3s cubic-bezier(.4, 0, .2, 1);
        }
        #xy-drawer.xy-no-transition {
            transition: none !important;
        }
        .xy-head {
            padding: 16px 18px;
            gap: 12px;
            background: #fffaf1;
            border-bottom-color: #f1e5d2;
        }
        .xy-logo {
            width: 40px;
            height: 40px;
            border: 1px solid #f3e0bd;
            border-radius: 12px;
            background: #fff3dd;
            box-shadow: none;
            font-size: 22px;
        }
        .xy-title {
            font-size: 16px;
            letter-spacing: 0;
            color: #4b3722;
        }
        .xy-sub {
            margin-top: 2px;
            font-size: 11.5px;
            color: #8c7a62;
        }
        .xy-close {
            width: 30px;
            height: 30px;
            border-radius: 9px;
            background: #f5eee2;
            color: #7a6448;
            font-size: 18px;
        }
        .xy-close:hover {
            background: #ece1d1;
            color: #5b462e;
        }
        .xy-tabs {
            gap: 2px;
            margin: 12px 16px 0;
            padding: 4px;
            background: #f5eee2;
            border: 1px solid #eee2cc;
            border-radius: 11px;
        }
        .xy-tab {
            padding: 8px 10px;
            border-radius: 8px;
            font-size: 12.5px;
            font-weight: 600;
            color: #8a7a63;
        }
        .xy-tab:hover {
            background: #efe5d4;
        }
        .xy-tab.active {
            background: #fff;
            color: #b36a00;
            box-shadow: 0 1px 3px rgba(90, 60, 20, .08);
        }
        .xy-tab-badge {
            min-width: 16px;
            height: 16px;
            padding: 0 4px;
            font-size: 9px;
            background: #e8890c;
        }
        .xy-body {
            min-height: 770px;
            padding: 14px 16px 18px;
            background: #faf6ee;
            scrollbar-gutter: stable;
        }
        .xy-pane {
            gap: 10px;
        }
        .xy-card {
            padding: 14px;
            border-color: #eadfcc;
            border-radius: 13px;
            box-shadow: 0 1px 2px rgba(90, 60, 20, .03);
        }
        .xy-card[hidden] {
            display: none !important;
        }
        .xy-card-head {
            margin-bottom: 10px;
        }
        .xy-card-head h3 {
            font-size: 13.5px;
            color: #5b462e;
        }
        .xy-hint {
            font-size: 11px;
            color: #9a8972;
        }
        .xy-btn {
            height: 34px;
            padding: 0 14px;
            border-radius: 9px;
            font-size: 12.5px;
            font-weight: 600;
        }
        .xy-btn-primary {
            background: #e8890c;
            box-shadow: none;
        }
        .xy-btn-primary:hover {
            background: #d97a00;
            transform: none;
        }
        #xy-files-quick-section {
            align-self: flex-start;
            display: inline-flex;
            width: fit-content;
            max-width: 100%;
            padding: 4px 10px !important;
        }
        #xy-files-quick-section .xy-card-head {
            display: none !important;
        }
        #xy-files-quick-host {
            width: auto;
            max-width: 100%;
            min-width: 0;
        }
        #xy-files-quick-host #downloadInterface {
            position: static !important;
            width: auto !important;
            max-width: 100% !important;
            height: auto !important;
            padding: 0 !important;
            border-radius: 0 !important;
            overflow: visible !important;
            background: transparent !important;
            box-shadow: none !important;
            cursor: default !important;
            animation: none !important;
            transform: none !important;
            z-index: auto !important;
        }
        #xy-files-quick-host #downloadInterface a {
            width: auto !important;
            max-width: 100% !important;
            display: inline-flex !important;
            margin: 0 !important;
            padding: 7px 6px !important;
            justify-content: flex-start !important;
            gap: 10px;
            border: none !important;
            border-radius: 9px !important;
            background: transparent !important;
            color: #4b3722 !important;
            font-size: 13px !important;
            font-weight: 600 !important;
            box-shadow: none !important;
            transition: background .15s ease !important;
        }
        #xy-files-quick-host #downloadInterface a:hover {
            background: transparent !important;
            transform: none !important;
            filter: none !important;
        }
        #xy-files-quick-host #downloadInterface a:hover span {
            text-decoration: underline;
            text-underline-offset: 2px;
        }
        #xy-files-quick-host #downloadInterface a .xy-quick-link-icon {
            flex-shrink: 0;
            width: 18px;
            height: 18px;
            padding: 6px;
            box-sizing: content-box;
            border-radius: 8px;
            background: #f8f0e2;
            color: #b36a00;
            font-size: 15px;
            transition: none;
        }
        #xy-files-quick-host #downloadInterface a:hover .xy-quick-link-icon {
            background: #f8f0e2;
        }
        #xy-files-quick-host #downloadInterface a::after {
            content: '当前页';
            flex-shrink: 0;
            margin-left: auto;
            padding: 2px 8px;
            border-radius: 999px;
            background: #f5eee2;
            color: #9a8972;
            font-size: 10px;
            font-weight: 500;
        }
        #xy-files-quick-host #downloadInterface a:not([href]) {
            color: #9a8972 !important;
            border: none !important;
            background: transparent !important;
        }
        #xy-files-quick-host #downloadInterface a:not([href]) .xy-quick-link-icon {
            background: #f3ece0;
            color: #b9aa95;
        }
        #xy-files-quick-host #downloadInterface br {
            display: none !important;
        }
        #xy-app .custom-checkbox {
            border-radius: 5px !important;
        }
        #xy-app .custom-checkbox::before {
            border-radius: 2px !important;
        }
        #xy-app .custom-checkbox:checked {
            animation: none !important;
        }
        #xy-files-toolbar {
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;
        }
        #xy-files-toolbar > div {
            padding: 0 !important;
            margin: 0 !important;
            gap: 6px;
        }
        #xy-files-toolbar .custom-checkbox {
            width: 19px !important;
            height: 19px !important;
            border-width: 2px !important;
            border-color: #e2c28e !important;
            margin: 0 6px 0 0 !important;
        }
        #xy-files-toolbar .custom-checkbox::before {
            width: 11px;
            height: 11px;
            background-color: #e8890c;
        }
        #xy-files-toolbar label {
            color: #6b5533 !important;
            font-size: 12.5px !important;
            font-weight: 600 !important;
        }
        #xy-files-toolbar #bulkDownloadButton,
        #xy-files-toolbar #treeViewButton,
        #xy-files-toolbar #hiddenProbeButton {
            position: static !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 6px !important;
            height: 34px !important;
            margin: 0 !important;
            padding: 0 14px !important;
            border-radius: 9px !important;
            font-size: 12.5px !important;
            font-weight: 600 !important;
            letter-spacing: 0 !important;
            text-transform: none !important;
            white-space: nowrap !important;
            box-shadow: none !important;
            animation: none !important;
            cursor: pointer !important;
            filter: none !important;
            transition: background-color .16s ease, border-color .16s ease, color .16s ease, box-shadow .16s ease, opacity .16s ease !important;
        }
        #xy-files-toolbar #hiddenProbeButton .xy-icon {
            font-size: 12px !important;
        }
        #xy-files-toolbar #bulkDownloadButton {
            margin-left: auto !important;
            background: #e8890c !important;
            background-image: none !important;
            background-size: auto !important;
            color: #fff !important;
        }
        #xy-files-toolbar #bulkDownloadButton:hover {
            background: #d97a00 !important;
            background-image: none !important;
            filter: none !important;
            transform: none !important;
        }
        #xy-files-toolbar #treeViewButton {
            background: #fff !important;
            color: #7a6448 !important;
            border: 1px solid #e6d7bd !important;
        }
        #xy-files-toolbar #treeViewButton:hover {
            background: #fbf5ea !important;
            border-color: #dcc9a8 !important;
            color: #5b462e !important;
            transform: none !important;
        }
        #xy-files-toolbar #hiddenProbeButton {
            background: #fff !important;
            color: #7a6448 !important;
            border: 1px solid #e6d7bd !important;
        }
        #xy-files-toolbar #hiddenProbeButton:hover {
            background: #fbf5ea !important;
            border-color: #dcc9a8 !important;
            color: #5b462e !important;
            transform: none !important;
        }
        #xy-files-toolbar #hiddenProbeButton[data-scanned="1"] {
            background: #fff7e8 !important;
            border-color: #efd7ae !important;
            color: #a86200 !important;
        }
        #xy-files-toolbar #hiddenProbeButton[data-scanned="1"]:hover {
            background: #fff1d9 !important;
            border-color: #e6c894 !important;
        }
        #xy-files-toolbar #hiddenProbeButton[data-running="1"] {
            background: #fbf5ea !important;
            border-color: #e6d7bd !important;
            color: #8a6a33 !important;
            cursor: progress !important;
        }
        #xy-files-toolbar #hiddenProbeButton:disabled {
            opacity: .78 !important;
            cursor: progress !important;
        }
        #xy-files-list-host #searchAndFilterContainer {
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) 118px 118px;
            gap: 8px !important;
            align-items: center !important;
            margin: 0 0 10px !important;
            padding: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
        }
        #xy-files-list-host #searchAndFilterContainer > div {
            display: contents !important;
        }
        #xy-files-list-host #searchInput {
            width: 100% !important;
            height: 36px !important;
            margin: 0 !important;
            padding: 0 34px 0 12px !important;
            border: 1px solid #e9ddc9 !important;
            border-radius: 9px !important;
            background-color: #fbf8f2 !important;
            color: #5b462e !important;
            font-size: 12.5px !important;
            font-weight: 500 !important;
            box-shadow: none !important;
        }
        #xy-files-list-host #searchInput:focus {
            border-color: #e8b86b !important;
            background-color: #fff !important;
            box-shadow: 0 0 0 3px rgba(240, 138, 0, .08) !important;
        }
        #xy-files-list-host #searchInput::placeholder {
            color: #a8967e !important;
        }
        #xy-files-list-host #quickFilterSelect,
        #xy-files-list-host #sortSelect {
            margin: 0 !important;
            min-width: 0 !important;
        }
        #xy-files-list-host .select-selected {
            height: 36px !important;
            padding: 0 28px 0 10px !important;
            border: 1px solid #e9ddc9 !important;
            border-radius: 9px !important;
            background-color: #fbf8f2 !important;
            color: #6b5533 !important;
            font-size: 12px !important;
            font-weight: 600 !important;
            line-height: 34px !important;
            box-shadow: none !important;
        }
        #xy-files-list-host .select-selected::after {
            right: 12px;
            border-width: 5px;
            border-color: #a88a5c transparent transparent transparent;
        }
        #xy-files-list-host .select-selected.select-arrow-active {
            border-radius: 9px 9px 0 0 !important;
            border-bottom-color: transparent !important;
        }
        #xy-files-list-host .select-items {
            border: 1px solid #e3d1b3 !important;
            border-top: none !important;
            border-radius: 0 0 9px 9px !important;
            background: #fff !important;
            box-shadow: 0 8px 20px rgba(90, 60, 20, .12) !important;
        }
        #xy-files-list-host .select-items div {
            min-height: 32px !important;
            padding: 7px 10px !important;
            color: #6b5533 !important;
            font-size: 12px !important;
            font-weight: 500 !important;
        }
        #xy-files-list-host .select-items div:hover,
        #xy-files-list-host .select-items .same-as-selected {
            background: #fbf3e5 !important;
            color: #b36a00 !important;
        }
        #xy-files-list-host {
            padding-right: 2px;
        }
        #download_list {
            color: #5b462e !important;
        }
        #download_list .file-item {
            gap: 2px;
            padding: 8px 6px !important;
            border-bottom: 1px solid #f3ece0 !important;
            content-visibility: auto;
            contain-intrinsic-size: auto 56px;
        }
        #download_list .file-item::before {
            display: none !important;
        }
        #download_list .file-item:hover {
            background: #fdf8ef !important;
            border-radius: 9px !important;
            box-shadow: none !important;
        }
        #download_list .file-item .custom-checkbox {
            width: 19px !important;
            height: 19px !important;
            margin-right: 10px !important;
            border-color: #e2c28e !important;
        }
        #download_list .file-item .custom-checkbox::before {
            width: 11px;
            height: 11px;
            background-color: #e8890c;
        }
        #download_list .file-item .file-icon {
            width: 30px;
            height: 30px;
            margin-right: 10px;
            border-radius: 8px;
            background: #f8f0e2 !important;
            color: #a97a2c !important;
        }
        #download_list .file-item .file-icon .xy-icon {
            font-size: 18px;
        }
        #download_list .file-item .file-info {
            max-width: none !important;
        }
        #download_list .file-item .file-name {
            color: #4b3722 !important;
            font-size: 13px !important;
            font-weight: 600 !important;
            line-height: 1.35 !important;
        }
        #download_list .file-item .file-name-row {
            display: flex;
            align-items: center;
            gap: 6px;
            min-width: 0;
        }
        #download_list .file-item .file-name-row .file-name {
            flex: 0 1 auto;
            min-width: 0;
        }
        #download_list .file-item .file-hidden-badge {
            flex-shrink: 0;
            display: inline-flex;
            align-items: center;
            gap: 3px;
            padding: 1px 6px;
            border: 1px solid #f0d29a;
            border-radius: 999px;
            background: #fff3d9;
            color: #b36a00;
            font-size: 9.5px;
            font-weight: 700;
            line-height: 1.5;
        }
        #download_list .file-item .file-hidden-badge .xy-icon {
            font-size: 9px;
        }
        #download_list .file-item .file-details {
            margin-top: 1px !important;
            color: #9a8972 !important;
            font-size: 11px !important;
            font-weight: 400 !important;
        }
        #download_list .file-item .download-link,
        #download_list .file-item .preview-link {
            width: 28px !important;
            height: 28px !important;
            margin-left: 6px !important;
            border-radius: 8px !important;
            background: #f7f0e3 !important;
            color: #8a6a33 !important;
        }
        #download_list .file-item:hover .download-link,
        #download_list .file-item:hover .preview-link {
            background: #ffe9c2 !important;
            color: #b36a00 !important;
            transform: none !important;
        }
        #download_list .file-item .download-link .xy-icon,
        #download_list .file-item .preview-link .xy-icon {
            font-size: 15px;
        }
        #failedToggleButton {
            margin-top: 8px !important;
            padding: 6px 10px !important;
            border: 1px solid #f0cfc6 !important;
            border-radius: 8px !important;
            background: #fff5f2 !important;
            color: #c0523c !important;
            font-size: 11px !important;
            font-weight: 600 !important;
            box-shadow: none !important;
        }
        #xy-export-host [data-category="export"] > div:first-child {
            display: flex !important;
            align-items: stretch !important;
            gap: 10px !important;
            margin-top: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            border-radius: 0 !important;
        }
        #xy-export-host [data-category="export"] > div:first-child > div:first-child {
            flex: 1;
            min-width: 0;
            margin-right: 0 !important;
        }
        #xy-export-host .custom-dropdown {
            width: 100% !important;
        }
        #xy-export-host .selected-option {
            height: 36px !important;
            padding: 0 32px 0 12px !important;
            border: 1px solid #e9ddc9 !important;
            border-radius: 9px !important;
            background: #fbf8f2 !important;
            color: #5b462e !important;
            font-size: 12.5px !important;
            font-weight: 600 !important;
            line-height: 34px !important;
            letter-spacing: 0 !important;
            box-shadow: none !important;
        }
        #xy-export-host .dropdown-arrow {
            right: 14px !important;
            border-top-color: #a88a5c !important;
        }
        #xy-export-host .options-list {
            padding: 4px !important;
            border: 1px solid #e3d1b3 !important;
            border-radius: 9px !important;
            background: #fff !important;
            box-shadow: 0 8px 20px rgba(90, 60, 20, .12) !important;
        }
        #xy-export-host .options-list li {
            padding: 8px 10px !important;
            border-bottom: 1px solid #f5eee2 !important;
            border-radius: 6px !important;
            color: #5b462e !important;
            font-size: 12px !important;
            font-weight: 500 !important;
        }
        .options-list {
            box-sizing: border-box !important;
            padding: 4px !important;
            border: 1px solid #e3d1b3 !important;
            border-radius: 10px !important;
            background: #fff !important;
            box-shadow: 0 8px 20px rgba(90, 60, 20, .12) !important;
        }
        .options-list li {
            padding: 8px 10px !important;
            border: none !important;
            border-bottom: 1px solid #f5eee2 !important;
            border-radius: 6px !important;
            color: #5b462e !important;
            font-size: 12px !important;
            font-weight: 500 !important;
        }
        .options-list li:last-child {
            border-bottom: none !important;
        }
        .options-list li:hover {
            background: #fbf3e5 !important;
            color: #b36a00 !important;
        }
        #xy-export-host #exportButton {
            height: 36px !important;
            padding: 0 18px !important;
            border: none !important;
            border-radius: 9px !important;
            background: #e8890c !important;
            color: #fff !important;
            font-size: 12.5px !important;
            font-weight: 600 !important;
            box-shadow: none !important;
        }
        #xy-export-host #exportButton:hover {
            background: #d97a00 !important;
            transform: none !important;
        }
        #xy-export-host #zipTextContainer {
            display: flex;
            align-items: center;
            gap: 8px;
            min-height: 38px;
            margin-top: 10px !important;
            padding: 9px 12px !important;
            border: 1px dashed #e3d1b3 !important;
            border-radius: 9px !important;
            background: #fbf8f2 !important;
            color: #8c7a62 !important;
            font-size: 12px !important;
            font-weight: 500 !important;
            text-align: left !important;
            box-shadow: none !important;
        }
        #xy-export-host #zipTextContainer > div:first-child {
            display: none !important;
        }
        #xy-export-host #zipTextContainer p {
            margin: 0 !important;
        }
        #xy-progress-host #downloadsContainer {
            padding: 16px !important;
            border: 1px solid #eee2cc !important;
            border-radius: 12px !important;
            background: #fbf8f2 !important;
            box-shadow: none !important;
        }
        #xy-progress-host #downloadsContainer p {
            color: #b36a00 !important;
            font-size: 13px !important;
        }
        #xy-progress-host #totalProgressText {
            color: #5b462e !important;
            font-size: 12px !important;
        }
        #xy-progress-host #totalProgressBar {
            height: 8px !important;
            background: #eadfcc !important;
        }
        #xy-progress-host #totalProgressBar > div {
            background: #e8890c !important;
        }
        #xy-download-host [data-category="download"] > div {
            display: flex !important;
            gap: 10px !important;
            margin-top: 0 !important;
        }
        #xy-download-host #showHistoryButton,
        #xy-download-host #thirdPartyDownloadButton {
            flex: 1;
            height: 36px;
            padding: 0 12px !important;
            border-radius: 9px !important;
            font-size: 12.5px !important;
            font-weight: 600 !important;
            box-shadow: none !important;
        }
        #xy-download-host #showHistoryButton {
            border: 1px solid #e6d7bd !important;
            background: #fff !important;
            color: #8a6a33 !important;
        }
        #xy-download-host #thirdPartyDownloadButton {
            border: none !important;
            background: #e8890c !important;
            color: #fff !important;
        }
        #xy-tips-host #tipsDisplay {
            display: block !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 10px 12px !important;
            border: 1px solid #eee2cc !important;
            border-radius: 10px !important;
            background: #fbf8f2 !important;
            background-image: none !important;
            color: #7a6448 !important;
            font-size: 12.5px !important;
            font-weight: 500 !important;
            line-height: 1.6 !important;
            text-align: left !important;
            box-shadow: none !important;
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
            transition: background .15s ease, border-color .15s ease !important;
        }
        #xy-tips-host #tipsDisplay:hover {
            background: #fff6e6 !important;
            border-color: #e7c98f !important;
            transform: none !important;
        }
        #xy-tips-host #tipsDisplay .tips-icon {
            margin-right: 7px;
            font-size: 13px;
            color: #c58a20;
        }
        #allTipsContainer {
            box-sizing: border-box !important;
            width: min(560px, calc(100vw - 40px)) !important;
            max-width: 560px !important;
            max-height: 80vh !important;
            padding: 0 20px 20px !important;
            border: 1px solid #e9ddc9 !important;
            border-radius: 16px !important;
            background: #fffdf8 !important;
            color: #4b3722 !important;
            box-shadow: 0 24px 60px rgba(90, 60, 20, .2) !important;
        }
        #allTipsContainer::-webkit-scrollbar {
            width: 6px !important;
        }
        #allTipsContainer::-webkit-scrollbar-track {
            background: transparent !important;
        }
        #allTipsContainer::-webkit-scrollbar-thumb {
            background: #d9c9b0 !important;
            border-radius: 3px !important;
        }
        #allTipsContainer h2 {
            position: sticky;
            top: 0;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin: 0 0 12px !important;
            padding: 20px 0 12px !important;
            border-bottom: 1px solid #f1e8d8;
            background: #fffdf8 !important;
            color: #5b462e !important;
            font-size: 16px !important;
            font-weight: 700 !important;
            letter-spacing: 0 !important;
            text-align: left !important;
        }
        #allTipsContainer .tip-item {
            display: flex !important;
            gap: 10px !important;
            padding: 8px 0 !important;
            border: none !important;
            border-bottom: 1px solid #f1e8d8 !important;
            border-radius: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
        }
        #allTipsContainer .tip-number {
            flex-shrink: 0;
            width: 20px;
            height: 20px;
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #f5eee2 !important;
            color: #a35f00 !important;
            font-size: 10px !important;
            font-weight: 700 !important;
        }
        #allTipsContainer .tip-text {
            color: #6b5533 !important;
            font-size: 12px !important;
            font-weight: 400 !important;
            line-height: 1.6 !important;
        }
        #allTipsContainer #closeTipsBtn {
            flex-shrink: 0;
            height: 28px;
            margin: 0 !important;
            padding: 0 10px !important;
            border: 1px solid #e6d7bd !important;
            border-radius: 8px !important;
            background: #fff !important;
            color: #8a6a33 !important;
            font-size: 11.5px !important;
            font-weight: 600 !important;
            cursor: pointer;
        }
        #allTipsContainer #closeTipsBtn:hover {
            background: #fbf5ea !important;
        }
        #xy-messages-host [data-category="message"] > div {
            display: flex !important;
            gap: 10px !important;
            margin-top: 0 !important;
        }
        #xy-messages-host #markReadButton,
        #xy-messages-host #clearMessagesButton {
            flex: 1;
            height: 36px;
            padding: 0 12px !important;
            border-radius: 9px !important;
            font-size: 12.5px !important;
            font-weight: 600 !important;
            box-shadow: none !important;
        }
        #xy-messages-host #markReadButton {
            border: 1px solid #e6d7bd !important;
            background: #fff !important;
            color: #8a6a33 !important;
        }
        #xy-messages-host #clearMessagesButton {
            border: 1px solid #f0cfc6 !important;
            background: #fff5f2 !important;
            color: #c0523c !important;
        }
        #xy-video-section {
            position: relative;
        }
        #xy-video-host #tm-video-assistant {
            border-radius: 12px !important;
            transform: none !important;
        }
        #xy-video-host #tm-header {
            position: absolute !important;
            top: 12px !important;
            right: 14px !important;
            width: auto !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            justify-content: flex-end !important;
            z-index: 2;
        }
        #xy-video-host #tm-download-guide-button {
            position: static !important;
            flex: 0 0 auto !important;
            width: auto !important;
            height: 30px !important;
            margin: 0 !important;
            padding: 0 10px !important;
            border: 1px solid #e6d7bd !important;
            border-radius: 9px !important;
            background: #fff !important;
            color: #8a6a33 !important;
            font-size: 11.5px !important;
            font-weight: 600 !important;
            box-shadow: none !important;
        }
        #xy-video-host #tm-download-guide-button:hover {
            background: #fff !important;
            box-shadow: none !important;
            filter: none !important;
            transform: none !important;
        }
        #xy-video-host .tm-info-container {
            margin: 0 0 8px !important;
            padding: 9px 12px !important;
            border: 1px solid #eee2cc !important;
            border-left: 3px solid #e8b86b !important;
            border-radius: 9px !important;
            background: #fbf8f2 !important;
        }
        #xy-video-host .tm-info-label {
            margin-bottom: 3px !important;
            color: #9a8972 !important;
            font-size: 11px !important;
            font-weight: 600 !important;
        }
        #xy-video-host .tm-info-content {
            max-height: 64px !important;
            color: #5b462e !important;
            font-size: 12px !important;
            font-weight: 500 !important;
        }
        #xy-video-host .tm-button-row {
            gap: 8px !important;
            justify-content: flex-start !important;
            margin: 0 0 8px !important;
        }
        #xy-video-host .tm-button {
            flex: 1;
            width: auto !important;
            height: 34px !important;
            padding: 0 10px !important;
            border: 1px solid #e6d7bd !important;
            border-radius: 9px !important;
            background: #fff !important;
            color: #8a6a33 !important;
            font-size: 12px !important;
            box-shadow: none !important;
        }
        #xy-video-host .tm-button:hover {
            background: #fbf5ea !important;
            transform: none !important;
        }
        #xy-video-host .tm-button-icon {
            margin-right: 4px !important;
            font-size: 13px !important;
        }
        #xy-video-host #tm-status {
            margin-top: 6px !important;
            color: #9a8972 !important;
            font-size: 11px !important;
        }
        #xy-display-host > div,
        #xy-display-host [data-category="display"] > div {
            width: 100% !important;
        }
        #xy-display-host [data-category="display"] > div > div {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 12px;
            padding: 10px 0 !important;
            border-bottom: 1px solid #f2e9db !important;
        }
        #xy-display-host [data-category="display"] > div > div:last-child {
            border-bottom: none !important;
        }
        #xy-display-host [data-category="display"] > div > div > span:first-child {
            color: #5b462e !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            letter-spacing: 0 !important;
            text-shadow: none !important;
            transform: none !important;
        }
        #xy-display-host .switch {
            width: 40px !important;
            height: 22px !important;
            flex-shrink: 0;
        }
        #xy-display-host .slider {
            border-radius: 11px !important;
            background: #e6ddce !important;
        }
        #xy-display-host input:checked + .slider {
            background: #e8890c !important;
        }
        #xy-display-host .slider:before {
            width: 16px !important;
            height: 16px !important;
            left: 3px !important;
            bottom: 3px !important;
        }
        #xy-display-host input:checked + .slider:before {
            transform: translateX(18px) !important;
        }
        #xy-filter-host .filter-editor {
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            border-radius: 0 !important;
            box-shadow: none !important;
        }
        #xy-filter-host .filter-editor > div {
            gap: 8px !important;
            margin-bottom: 8px !important;
        }
        #xy-filter-host .filter-editor > div > span {
            min-width: 50px !important;
            color: #7a6448 !important;
            font-size: 12px !important;
            font-weight: 600 !important;
            letter-spacing: 0 !important;
            text-shadow: none !important;
        }
        #xy-filter-host .filter-editor input {
            padding: 8px 10px !important;
            border: 1px solid #e9ddc9 !important;
            border-radius: 8px !important;
            background: #fbf8f2 !important;
            color: #5b462e !important;
            font-size: 12px !important;
            font-weight: 500 !important;
            transform: none !important;
        }
        #xy-filter-host .filter-editor input:focus {
            border-color: #e8b86b !important;
            background: #fff !important;
            box-shadow: 0 0 0 3px rgba(240, 138, 0, .08) !important;
        }
        #xy-filter-host .filter-editor p {
            color: #9a8972 !important;
            font-size: 11px !important;
        }
        #xy-filter-host button {
            height: 34px;
            padding: 0 16px !important;
            border-radius: 9px !important;
            font-size: 12.5px !important;
            font-weight: 600 !important;
            box-shadow: none !important;
        }
        #xy-filter-host button:nth-of-type(1) {
            border: none !important;
            background: #e8890c !important;
            color: #fff !important;
        }
        #xy-filter-host button:nth-of-type(2) {
            border: 1px solid #f0cfc6 !important;
            background: #fff5f2 !important;
            color: #c0523c !important;
        }
        #xy-update-host [data-category="update"] > div {
            position: static !important;
            width: 100% !important;
            margin: 0 !important;
            display: block !important;
        }
        #xy-update-host [data-category="update"] > div > div:last-child {
            width: 100% !important;
        }
        #xy-update-host [style*="glowPulse"] {
            padding: 4px 10px !important;
            border: 1px solid #f3e0bd !important;
            border-radius: 7px !important;
            background: #fff3dd !important;
            color: #a35f00 !important;
            font-size: 12px !important;
            box-shadow: none !important;
            animation: none !important;
        }
        #xy-update-host a {
            color: #c07a1a !important;
        }
        #xy-teacher-host #teacherInfoContainer,
        #xy-user-host #userSearchContainer {
            width: 100% !important;
            height: auto !important;
            max-height: none !important;
            padding: 0 !important;
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            font-weight: 400 !important;
        }
        #xy-teacher-host #teacherInfoContent {
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            font-weight: 400 !important;
        }
        #xy-user-host #userSearchContainer > div {
            display: flex !important;
            flex-wrap: wrap !important;
            align-items: center !important;
            gap: 8px !important;
            height: auto !important;
            overflow: visible !important;
        }
        #xy-user-host #userSearchInput {
            flex: 1;
            width: auto !important;
            height: 36px !important;
            margin: 0 !important;
            padding: 0 12px !important;
            border: 1px solid #e9ddc9 !important;
            border-radius: 9px !important;
            background: #fbf8f2 !important;
            color: #5b462e !important;
            font-size: 12.5px !important;
        }
        #xy-user-host #userSearchInput:focus {
            border-color: #e8b86b !important;
            background: #fff !important;
            box-shadow: 0 0 0 3px rgba(240, 138, 0, .08) !important;
        }
        #xy-user-host #userSearchButton {
            width: auto !important;
            height: 36px !important;
            margin: 0 !important;
            padding: 0 16px !important;
            border: none !important;
            border-radius: 9px !important;
            background: #e8890c !important;
            color: #fff !important;
            font-size: 12.5px !important;
            font-weight: 600 !important;
        }
        #xy-user-host #userSearchResults {
            flex-basis: 100%;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            background: transparent !important;
            font-size: 12px !important;
        }
        #xy-user-host #userSearchResults p {
            margin: 0;
            padding: 9px 12px;
            border: 1px dashed #e3d1b3;
            border-radius: 9px;
            background: #fbf8f2;
            color: #9a8972 !important;
            text-align: left !important;
        }
        #xy-debug-host #debuggerDisablerContainer {
            width: 100% !important;
            height: auto !important;
            padding: 14px !important;
            border: 1px solid #f0cfc6 !important;
            border-radius: 12px !important;
            background: #fff !important;
            box-shadow: none !important;
        }
        #xy-debug-host #debuggerDisablerContainer > div {
            height: auto !important;
            gap: 8px !important;
            color: #5b462e !important;
        }
        #xy-debug-host #debuggerDisablerContainer h3 {
            color: #b3492f !important;
            font-size: 13px !important;
            letter-spacing: 0 !important;
        }
        #xy-debug-host #debuggerDisablerContainer > div > div:first-of-type {
            height: 1px !important;
            background: #f3d9d2 !important;
        }
        #xy-debug-host #debuggerDisablerContainer p {
            color: #8a6a33 !important;
            font-size: 12px !important;
        }
        #xy-debug-host #disableDebuggerBtn {
            height: 34px !important;
            padding: 0 16px !important;
            border: 1px solid #f0cfc6 !important;
            border-radius: 9px !important;
            background: #fff5f2 !important;
            color: #b3492f !important;
            font-size: 12px !important;
            font-weight: 600 !important;
        }
        @media (max-width: 720px) {
            #xy-drawer {
                right: 0;
                bottom: 0;
                width: 100% !important;
                height: 100% !important;
                border: none;
                border-radius: 0;
            }
            .xy-head {
                padding: 12px 14px;
            }
            .xy-tabs {
                margin: 10px 12px 0;
            }
            .xy-body {
                padding: 12px;
            }
            #xy-files-list-host #searchAndFilterContainer {
                grid-template-columns: 1fr 1fr;
            }
            #xy-files-list-host #searchInput {
                grid-column: 1 / -1;
            }
            #xy-files-toolbar {
                gap: 6px;
            }
            #xy-files-toolbar #bulkDownloadButton {
                margin-left: 0 !important;
            }
            #xy-files-toolbar #bulkDownloadButton,
            #xy-files-toolbar #treeViewButton,
            #xy-files-toolbar #hiddenProbeButton {
                padding: 0 12px !important;
            }
        }
    `;
    document.head.appendChild(style);
}
function xySwitchTab(tab) {
    const app = xyEl('xy-app');
    if (!app || !tab) return;
    const previous = app.dataset.tab;
    document.querySelectorAll('.options-list').forEach(list => {
        list.style.display = 'none';
    });
    if (window.xyTips) {
        if (tab === 'tools') {
            window.xyTips.resumeTips();
        } else if (previous === 'tools') {
            window.xyTips.pauseTips();
        }
    }
    app.querySelectorAll('.xy-tab').forEach(button => {
        const active = button.dataset.tab === tab;
        button.classList.toggle('active', active);
        button.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    app.querySelectorAll('.xy-pane').forEach(pane => {
        pane.hidden = pane.dataset.pane !== tab;
    });
    const body = app.querySelector('.xy-body');
    if (body) body.scrollTop = 0;
    app.dataset.tab = tab;
    xyFitDrawer(false);
    xyScheduleDrawerFit();
}
function xyOpenWorkspace(tab) {
    const app = xyEl('xy-app');
    if (!app) return;
    adoptLegacyPanels();
    if (tab) xySwitchTab(tab);
    const drawer = xyEl('xy-drawer');
    if (drawer) {
        const target = xyDrawerTargetHeight();
        if (target) drawer.style.height = `${target}px`;
    }
    app.classList.add('xy-open');
    if (drawer) {
        drawer.removeAttribute('aria-hidden');
        const closeButton = drawer.querySelector('.xy-close');
        if (closeButton) closeButton.focus({ preventScroll: true });
    }
    xyScheduleDrawerFit(true);
    if (tab === 'transfers') {
        setTimeout(xyUpdateBadge, 0);
    }
}
function xyCloseWorkspace() {
    const app = xyEl('xy-app');
    if (!app) return;
    if (window.xyTips) {
        if (window.xyTips.closeAllTips) window.xyTips.closeAllTips();
        window.xyTips.pauseTips();
    }
    document.querySelectorAll('.options-list').forEach(list => {
        list.style.display = 'none';
    });
    app.classList.remove('xy-open');
    const drawer = xyEl('xy-drawer');
    if (drawer) {
        if (drawer.contains(document.activeElement)) {
            const fab = xyEl('xy-fab');
            if (fab) fab.focus();
            else document.activeElement.blur();
        }
        drawer.setAttribute('aria-hidden', 'true');
    }
}
function xyToggleWorkspace(tab) {
    const app = xyEl('xy-app');
    if (!app) return;
    if (app.classList.contains('xy-open')) {
        xyCloseWorkspace();
    } else {
        xyOpenWorkspace(tab);
    }
}
function xyUpdateBadge() {
    const list = xyEl('download_list');
    const count = list ? list.querySelectorAll('.file-item').length : 0;
    const badge = xyEl('xy-fab-badge');
    if (badge) {
        badge.textContent = String(count);
        badge.hidden = count === 0;
    }
    const counter = xyEl('xy-files-count');
    if (counter) {
        counter.textContent = count > 0 ? `${count} 个文件` : '';
    }
}
function xyScheduleBadge() {
    clearTimeout(xyBadgeTimer);
    xyBadgeTimer = setTimeout(xyUpdateBadge, 120);
}
function xySyncTreeSection() {
    const tree = xyEl('treeContainer');
    const section = xyEl('xy-tree-section');
    if (!tree || !section) return;
    const wasVisible = !section.hidden;
    const visible = tree.style.display === 'block';
    section.hidden = !visible;
    const listCard = xyEl('xy-files-list-card');
    if (listCard) listCard.hidden = visible;
    if (!visible && wasVisible) {
        const body = section.closest('.xy-body');
        if (body) body.scrollTop = 0;
    }
    xySyncQuickSection();
    xyScheduleDrawerFit();
}
function xySyncQuickSection() {
    const section = xyEl('xy-files-quick-section');
    const link = xyEl('downloadInterface')?.querySelector('a');
    if (!section) return;
    const treeVisible = xyEl('treeContainer')?.style.display === 'block';
    const hasResource = !!link && link.hasAttribute('href') && link.getAttribute('href') !== '#';
    section.hidden = !hasResource || treeVisible;
    xyScheduleDrawerFit();
}
function xyDrawerTargetHeight() {
    const drawer = xyEl('xy-drawer');
    const body = drawer?.querySelector('.xy-body');
    if (!drawer || !body) return 0;
    const header = drawer.querySelector('.xy-head');
    const tabs = drawer.querySelector('.xy-tabs');
    const tabsStyle = tabs ? getComputedStyle(tabs) : null;
    const tabsSpacing = tabsStyle
        ? (parseFloat(tabsStyle.marginTop) || 0) + (parseFloat(tabsStyle.marginBottom) || 0)
        : 0;
    const chrome = (header?.offsetHeight || 0) + (tabs?.offsetHeight || 0) + tabsSpacing;
    const activePane = Array.from(body.children).find(child =>
        child.classList && child.classList.contains('xy-pane') && !child.hidden
    );
    const bodyStyle = getComputedStyle(body);
    const bodyPadding = (parseFloat(bodyStyle.paddingTop) || 0) + (parseFloat(bodyStyle.paddingBottom) || 0);
    const content = activePane ? activePane.scrollHeight + bodyPadding : body.scrollHeight;
    const max = Math.max(220, window.innerHeight - 44);
    const min = Math.min(190, max);
    return Math.round(Math.min(Math.max(content + chrome, min), max));
}
function xyFitDrawer(immediate) {
    const app = xyEl('xy-app');
    const drawer = xyEl('xy-drawer');
    if (!app || !drawer || !app.classList.contains('xy-open')) return;
    if (window.matchMedia('(max-width: 720px)').matches) return;
    const target = xyDrawerTargetHeight();
    if (!target) return;
    if (immediate) {
        drawer.classList.add('xy-no-transition');
        drawer.style.height = `${target}px`;
        void drawer.offsetHeight;
        drawer.classList.remove('xy-no-transition');
        return;
    }
    if (drawer.getBoundingClientRect().height > 0) {
        drawer.style.height = `${target}px`;
    }
}
function xyQueueDrawerFit() {
    if (xyFitFrame) return;
    xyFitFrame = requestAnimationFrame(() => {
        xyFitFrame = null;
        xyFitDrawer(false);
    });
}
function xyScheduleDrawerFit(immediate = false) {
    if (immediate) {
        clearTimeout(xyFitTimer);
        xyFitTimer = null;
        xyFitDrawer(true);
        requestAnimationFrame(() => xyFitDrawer(false));
        return;
    }
    if (xyFitTimer) return;
    xyFitTimer = setTimeout(() => {
        xyFitTimer = null;
        xyQueueDrawerFit();
    }, 30);
}
function xyMoveNode(node, host) {
    if (!node || !host || node.parentElement === host) return false;
    host.appendChild(node);
    return true;
}
function adoptLegacyPanels() {
    if (!xyEl('xy-app')) return;
    const list = xyEl('download_list');
    if (list && xyHost('filesList')) {
        if (xyMoveNode(list, xyHost('filesList'))) {
            list.style.opacity = '1';
            list.style.transform = 'none';
        }
        if (!list.dataset.xyObserved) {
            list.dataset.xyObserved = '1';
            new MutationObserver(xyScheduleBadge).observe(list, { childList: true, subtree: true });
        }
    }
    const toolbar = xyHost('filesToolbar');
    if (toolbar) {
        const selectAll = xyEl('selectAllCheckbox');
        const selectAllRow = selectAll ? selectAll.parentElement : null;
        if (selectAllRow && selectAllRow.parentElement !== toolbar) {
            toolbar.prepend(selectAllRow);
        }
        ['bulkDownloadButton', 'treeViewButton', 'hiddenProbeButton'].forEach(id => {
            const button = xyEl(id);
            if (button) xyMoveNode(button, toolbar);
        });
    }
    const quickInterface = xyEl('downloadInterface');
    if (xyMoveNode(quickInterface, xyHost('filesQuick'))) {
        quickInterface.style.display = '';
    }
    if (quickInterface && !quickInterface.dataset.xyObserved) {
        quickInterface.dataset.xyObserved = '1';
        new MutationObserver(xySyncQuickSection).observe(quickInterface, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['href']
        });
    }
    xySyncQuickSection();
    xyMoveNode(xyEl('downloadsWrapperContainer'), xyHost('progress'));
    const videoAssistant = xyEl('tm-video-assistant');
    if (xyMoveNode(videoAssistant, xyHost('video'))) {
        videoAssistant.style.display = '';
    }
    const tree = xyEl('treeContainer');
    if (tree && xyHost('tree')) {
        xyMoveNode(tree, xyHost('tree'));
        if (!tree.dataset.xyObserved) {
            tree.dataset.xyObserved = '1';
            new MutationObserver(xySyncTreeSection).observe(tree, { attributes: true, attributeFilter: ['style'] });
        }
        xySyncTreeSection();
    }
    const panel = xyEl('controlPanel');
    if (panel && !panel.dataset.xyAdopted) {
        const categoryMap = {
            message: 'messages',
            download: 'download',
            export: 'export',
            display: 'display',
            customFilter: 'filters',
            update: 'update'
        };
        panel.querySelectorAll(':scope > [data-category]').forEach(section => {
            const host = xyHost(categoryMap[section.dataset.category]);
            if (!host) return;
            section.style.display = 'block';
            host.appendChild(section);
        });
        const tips = xyEl('tipsDisplay');
        if (tips && xyHost('tips')) {
            tips.style.width = '100%';
            xyHost('tips').appendChild(tips);
        }
        const courseName = xyEl('showCourseNameText');
        if (courseName && xyHost('course')) {
            xyHost('course').textContent = '';
            xyHost('course').appendChild(courseName);
        }
        panel.dataset.xyAdopted = '1';
        panel.remove();
    }
    const easterEggPanels = [
        ['teacherInfoContainer', 'teacher', 'xy-teacher-section'],
        ['userSearchContainer', 'user', 'xy-user-section'],
        ['debuggerDisablerContainer', 'debug', 'xy-debug-section']
    ];
    easterEggPanels.forEach(([elementId, hostKey, sectionId]) => {
        const element = xyEl(elementId);
        const host = xyHost(hostKey);
        if (!element || !host) return;
        xyMoveNode(element, host);
        const section = xyEl(sectionId);
        if (section) section.hidden = false;
    });
    const userInput = xyEl('userSearchInput');
    if (userInput && !userInput.dataset.xyWarned) {
        userInput.dataset.xyWarned = '1';
        userInput.addEventListener('focus', () => {
            if (!localStorage.getItem('userSearchWarningShown')) {
                showUserSearchWarning();
                localStorage.setItem('userSearchWarningShown', 'true');
            }
        }, { once: true });
    }
    xyScheduleBadge();
    xyScheduleDrawerFit();
}
function initWorkspace() {
    if (xyEl('xy-app') || !document.body) return;
    xyInjectWorkspaceStyles();
    const app = document.createElement('div');
    app.id = 'xy-app';
    app.innerHTML = `
        <div id="xy-backdrop" aria-hidden="true"></div>
        <button id="xy-fab" type="button" title="打开小雅工作台（Alt+X）" aria-label="打开小雅工作台">
            <span class="xy-fab-glyph">${xyIcon('cat')}</span>
            <span class="xy-fab-badge" id="xy-fab-badge" hidden>0</span>
        </button>
        <aside id="xy-drawer" role="dialog" aria-label="小雅工作台" aria-hidden="true">
            <header class="xy-head">
                <div class="xy-logo">${xyIcon('cat')}</div>
                <div class="xy-head-text">
                    <div class="xy-title">小雅爬爬爬 · 工作台</div>
                    <div class="xy-sub" id="xy-course-host">正在获取课程信息…</div>
                </div>
                <button class="xy-close" id="xy-close" type="button" title="关闭">${xyIcon('xmark')}</button>
            </header>
            <nav class="xy-tabs" role="tablist">
                <button class="xy-tab active" data-tab="files" type="button" role="tab" aria-selected="true">课件</button>
                <button class="xy-tab" data-tab="transfers" type="button" role="tab" aria-selected="false">传输<span class="xy-tab-badge" id="xy-transfer-badge" hidden>0</span></button>
                <button class="xy-tab" data-tab="tools" type="button" role="tab" aria-selected="false">工具</button>
                <button class="xy-tab" data-tab="settings" type="button" role="tab" aria-selected="false">设置</button>
            </nav>
            <div class="xy-body">
                <section class="xy-pane" data-pane="files">
                    <section class="xy-card" id="xy-files-quick-section">
                        <div class="xy-card-head">
                            <h3>当前页课件</h3>
                        </div>
                        <div id="xy-files-quick-host"></div>
                    </section>
                    <section class="xy-files-block" id="xy-files-list-section">
                        <div class="xy-card" id="xy-files-list-card">
                            <div class="xy-card-head">
                                <h3>课程附件</h3>
                                <span class="xy-hint" id="xy-files-count"></span>
                            </div>
                            <div class="xy-toolbar" id="xy-files-toolbar"></div>
                            <div id="xy-files-list-host"></div>
                        </div>
                        <div class="xy-card" id="xy-tree-section" hidden>
                            <div id="xy-tree-host"></div>
                        </div>
                        <div class="xy-card">
                            <div class="xy-card-head">
                                <h3>导出</h3>
                                <span class="xy-hint">先在上方勾选文件</span>
                            </div>
                            <div id="xy-export-host"></div>
                        </div>
                    </section>
                </section>
                <section class="xy-pane" data-pane="transfers" hidden>
                    <section class="xy-card" id="xy-progress-section">
                        <div class="xy-card-head">
                            <h3>下载进度</h3>
                            <span class="xy-hint">总进度与单个文件进度</span>
                        </div>
                        <div id="xy-progress-host"></div>
                    </section>
                    <section class="xy-card">
                        <div class="xy-card-head">
                            <h3>下载设置与历史</h3>
                        </div>
                        <div id="xy-download-host"></div>
                    </section>
                </section>
                <section class="xy-pane" data-pane="tools" hidden>
                    <section class="xy-card" id="xy-tips-section">
                        <div class="xy-card-head">
                            <h3>使用提示</h3>
                            <span class="xy-hint">点击提示查看全部</span>
                        </div>
                        <div id="xy-tips-host"></div>
                    </section>
                    <section class="xy-card" id="xy-messages-section">
                        <div class="xy-card-head">
                            <h3>消息管理</h3>
                            <span class="xy-hint">标记已读或清空站内消息</span>
                        </div>
                        <div id="xy-messages-host"></div>
                    </section>
                    <section class="xy-card" id="xy-video-section">
                        <div class="xy-card-head">
                            <h3>视频源检测</h3>
                        </div>
                        <div id="xy-video-host"></div>
                    </section>
                    <section class="xy-card" id="xy-teacher-section" hidden>
                        <div class="xy-card-head">
                            <h3>教师信息</h3>
                        </div>
                        <div id="xy-teacher-host"></div>
                    </section>
                    <section class="xy-card" id="xy-user-section" hidden>
                        <div class="xy-card-head">
                            <h3>用户搜索</h3>
                            <span class="xy-hint">仅供学习研究</span>
                        </div>
                        <div id="xy-user-host"></div>
                    </section>
                    <section class="xy-card" id="xy-debug-section" hidden>
                        <div class="xy-card-head">
                            <h3>高级工具</h3>
                        </div>
                        <div id="xy-debug-host"></div>
                    </section>
                </section>
                <section class="xy-pane" data-pane="settings" hidden>
                    <section class="xy-card">
                        <div class="xy-card-head">
                            <h3>显示内容</h3>
                            <span class="xy-hint">决定工作台里出现哪些模块</span>
                        </div>
                        <div id="xy-display-host"></div>
                    </section>
                    <section class="xy-card">
                        <div class="xy-card-head">
                            <h3>自定义筛选</h3>
                            <span class="xy-hint">按扩展名归类课件</span>
                        </div>
                        <div id="xy-filter-host"></div>
                    </section>
                    <section class="xy-card">
                        <div class="xy-card-head">
                            <h3>版本与更新</h3>
                        </div>
                        <div id="xy-update-host"></div>
                    </section>
                </section>
            </div>
        </aside>
    `;
    document.body.appendChild(app);
    const fab = xyEl('xy-fab');
    if (fab) fab.addEventListener('click', () => xyToggleWorkspace('files'));
    const backdrop = xyEl('xy-backdrop');
    if (backdrop) backdrop.addEventListener('click', xyCloseWorkspace);
    const closeButton = xyEl('xy-close');
    if (closeButton) closeButton.addEventListener('click', xyCloseWorkspace);
    app.querySelectorAll('.xy-tab').forEach(button => {
        button.addEventListener('click', () => {
            adoptLegacyPanels();
            xySwitchTab(button.dataset.tab);
        });
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && app.classList.contains('xy-open')) {
            const tree = xyEl('treeContainer');
            if (tree && tree.style.display === 'block' && typeof tree.close === 'function') {
                tree.close();
                return;
            }
            xyCloseWorkspace();
            return;
        }
        if (event.altKey && (event.key === 'x' || event.key === 'X')) {
            event.preventDefault();
            xyToggleWorkspace('files');
        }
    });
    if (window.ResizeObserver && !xyPaneObserver) {
        xyPaneObserver = new ResizeObserver(() => xyQueueDrawerFit());
        app.querySelectorAll('.xy-pane').forEach(pane => xyPaneObserver.observe(pane));
    }
    window.addEventListener('resize', () => {
        clearTimeout(xyResizeTimer);
        xyResizeTimer = setTimeout(() => {
            if (app.classList.contains('xy-open')) xyFitDrawer(true);
        }, 120);
    });
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            if (app.classList.contains('xy-open')) xyScheduleDrawerFit();
        });
    }
    let queued = false;
    const observer = new MutationObserver(() => {
        if (queued) return;
        queued = true;
        setTimeout(() => {
            queued = false;
            adoptLegacyPanels();
        }, 250);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    xyScheduleBadge();
    adoptLegacyPanels();
}
window.xyWorkspace = {
    open: xyOpenWorkspace,
    close: xyCloseWorkspace,
    toggle: xyToggleWorkspace,
    switchTab: xySwitchTab,
    adopt: adoptLegacyPanels
};
