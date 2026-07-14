/**
 * 🐾 BiliPlayer Extension for SillyTavern
 * 
 * Author: 未初
 * Version: 2.0.0
 * 💖 Special Thanks: 本插件的底层基础逻辑与核心机制由【老农民】老师提供支持，特此致谢！
 */


// 1. 全局配置与状态
const MODULE_NAME = 'bili_player_ext';
let panelElement = null;
let floatBadgeElement = null;
let settingsDialogElement = null;
let helpDialogElement = null;  // ⭐ 新增：使用说明弹窗

const THEMES = {
    pink:           { name: '🩷 樱花粉',     emoji: '🐾' },
    lemon:          { name: '🌼 嫩黄',       emoji: '🍋' },
    mint:           { name: '🌿 淡绿',       emoji: '🌱' },
    'glass-light':  { name: '🪟 毛玻璃白',   emoji: '☁️' },
    'glass-dark':   { name: '🕶️ 毛玻璃黑',   emoji: '🌙' },
    sakura:         { name: '🌸 夜樱',       emoji: '🌸' },
    ocean:          { name: '🌊 深海蓝',     emoji: '🐳' },
    sunset:         { name: '🌅 落日橘',     emoji: '🌇' },
    lavender:       { name: '💜 薰衣草',     emoji: '🪻' },
    mocha:          { name: '☕ 摩卡棕',     emoji: '🍫' }
};

const DEFAULT_SETTINGS = {
    theme: 'pink',
    badgeSize: 'medium',
    avatarType: 'emoji',
    avatarValue: '',
    borderImage: '',
    borderImageMode: 'background',
    borderImageFit: 'cover',
    borderImageOpacity: 1,
    customColors: null,
    startAsFloating: true,
    badgeBorderImage: '',      
    hideBadgeBorder: false,        // ⭐ 加上逗号
    badgeBorderZIndex: 'above',    
    badgeBorderScale: 100,          
    badgeBorderOffsetX: 0,          
    badgeBorderOffsetY: 0           
};




const BADGE_DIMENSIONS = {
    large:  { w: 72, h: 76 },
    medium: { w: 58, h: 62 },
    small:  { w: 44, h: 48 }
};

const THEME_COLORS = {
    pink: {
        primary: '#ff85a7', primaryLight: '#fff0f3', primaryDeep: '#fb7299',
        secondary: '#86e3ce', bg: '#ffffff', bgSoft: '#fffbfc', text: '#5d6d7e',
        textMuted: '#b8a4ad', border: '#ff85a7', actionPrimary: '#ff85a7',
        actionPrimaryText: '#ffffff', actionSecondary: '#86e3ce',
        actionSecondaryText: '#2c3e50', shadow: 'rgba(251, 114, 153, 0.2)'
    },
    lemon: {
        primary: '#f4d35e', primaryLight: '#fff8d6', primaryDeep: '#ee9b00',
        secondary: '#ffd166', bg: '#fffdf5', bgSoft: '#fffbea', text: '#6b5d3f',
        textMuted: '#b8a87d', border: '#ee9b00', actionPrimary: '#ee9b00',
        actionPrimaryText: '#ffffff', actionSecondary: '#ffd166',
        actionSecondaryText: '#6b5d3f', shadow: 'rgba(244, 211, 94, 0.3)'
    },
    mint: {
        primary: '#95d5b2', primaryLight: '#d8f3dc', primaryDeep: '#52b788',
        secondary: '#b7e4c7', bg: '#ffffff', bgSoft: '#f1faf3', text: '#3d5a45',
        textMuted: '#8aab92', border: '#52b788', actionPrimary: '#52b788',
        actionPrimaryText: '#ffffff', actionSecondary: '#95d5b2',
        actionSecondaryText: '#3d5a45', shadow: 'rgba(82, 183, 136, 0.25)'
    },
    'glass-light': {
        primary: '#8b9bb4', primaryLight: 'rgba(255,255,255,0.5)', primaryDeep: '#5d6d7e',
        secondary: '#c9d6e2', bg: 'rgba(255,255,255,0.55)', bgSoft: 'rgba(245,248,252,0.6)',
        text: '#3d4a5c', textMuted: '#8a99ad', border: 'rgba(139,155,180,0.5)',
        actionPrimary: '#5d6d7e', actionPrimaryText: '#ffffff',
        actionSecondary: '#c9d6e2', actionSecondaryText: '#3d4a5c',
        shadow: 'rgba(100, 120, 150, 0.2)'
    },
    'glass-dark': {
        primary: '#b794d4', primaryLight: 'rgba(60,50,80,0.5)', primaryDeep: '#d4a5e8',
        secondary: '#7c9eb2', bg: 'rgba(30,25,45,0.55)', bgSoft: 'rgba(40,35,55,0.6)',
        text: '#e8e3f0', textMuted: '#9a8fb0', border: 'rgba(183,148,212,0.4)',
        actionPrimary: '#b794d4', actionPrimaryText: '#1a1525',
        actionSecondary: '#7c9eb2', actionSecondaryText: '#1a1525',
        shadow: 'rgba(0, 0, 0, 0.5)'
    },
    sakura: {
        primary: '#f8a5c2', primaryLight: 'rgba(60, 40, 55, 0.6)', primaryDeep: '#ff6b9d',
        secondary: '#c39bd3', bg: 'rgba(40, 30, 45, 0.7)', bgSoft: 'rgba(50, 38, 58, 0.65)',
        text: '#f5e6ee', textMuted: '#b094a6', border: 'rgba(248, 165, 194, 0.5)',
        actionPrimary: '#ff6b9d', actionPrimaryText: '#ffffff',
        actionSecondary: '#c39bd3', actionSecondaryText: '#2a1f2e',
        shadow: 'rgba(255, 107, 157, 0.3)'
    },
    ocean: {
        primary: '#48cae4', primaryLight: '#caf0f8', primaryDeep: '#0077b6',
        secondary: '#90e0ef', bg: '#ffffff', bgSoft: '#f0fbfd', text: '#023e58',
        textMuted: '#8ab4c8', border: '#0077b6',
        actionPrimary: '#0077b6', actionPrimaryText: '#ffffff',
        actionSecondary: '#90e0ef', actionSecondaryText: '#023e58',
        shadow: 'rgba(0, 119, 182, 0.25)'
    },
    sunset: {
        primary: '#ffb07c', primaryLight: '#fff0e0', primaryDeep: '#ff7e3c',
        secondary: '#ffd6a5', bg: '#fffaf5', bgSoft: '#fff3e8', text: '#6b4423',
        textMuted: '#c4a382', border: '#ff7e3c',
        actionPrimary: '#ff7e3c', actionPrimaryText: '#ffffff',
        actionSecondary: '#ffd6a5', actionSecondaryText: '#6b4423',
        shadow: 'rgba(255, 126, 60, 0.3)'
    },
    lavender: {
        primary: '#c8a2d4', primaryLight: '#f3e5f7', primaryDeep: '#9c6bc7',
        secondary: '#e1bee7', bg: '#ffffff', bgSoft: '#faf5fc', text: '#5a4570',
        textMuted: '#b094c4', border: '#9c6bc7',
        actionPrimary: '#9c6bc7', actionPrimaryText: '#ffffff',
        actionSecondary: '#e1bee7', actionSecondaryText: '#5a4570',
        shadow: 'rgba(156, 107, 199, 0.25)'
    },
    mocha: {
        primary: '#c9a883', primaryLight: 'rgba(60, 45, 35, 0.6)', primaryDeep: '#a07855',
        secondary: '#d4b896', bg: 'rgba(45, 35, 28, 0.75)', bgSoft: 'rgba(55, 42, 33, 0.7)',
        text: '#f0e6d8', textMuted: '#a89880', border: 'rgba(201, 168, 131, 0.5)',
        actionPrimary: '#a07855', actionPrimaryText: '#ffffff',
        actionSecondary: '#d4b896', actionSecondaryText: '#2a1f15',
        shadow: 'rgba(160, 120, 85, 0.35)'
    }
};

const state = {
    isCollapsed: false,
    isFloating: false,
    isActive: true,
    currentGroup: '',
    currentBvid: '',
    savedHeight: '450px',
    savedWidth: '340px',
    savedPos: null,
    settings: { ...DEFAULT_SETTINGS },
    playlistData: {
        "🐾 未分类": [{ bvid: 'BV1GJ411x7h7', title: '极乐净土' }],
        "✨ 追剧池": []
    },
    collapsedGroups: new Set()  // ⭐ 新增：记录被折叠的分类
};

// 2. 数据恢复与持久化
function loadExtensionSettings() {
    try {
        const context = window.SillyTavern?.extensions_settings;
        let saved = null;

        if (context && context[MODULE_NAME]) {
            saved = context[MODULE_NAME];
        }

        if (!saved) {
            const local = localStorage.getItem(MODULE_NAME);
            if (local) {
                try {
                    saved = JSON.parse(local);
                    if (context) {
                        context[MODULE_NAME] = saved;
                        window.saveSettingsDebounced?.();
                    }
                } catch (e) { }
            }
        }

        if (!saved) {
            saved = {
                playlistData: state.playlistData,
                lastGroup: '',
                lastBvid: '',
                lastPos: null,
                settings: { ...DEFAULT_SETTINGS },
                isActive: true  // ⭐ 新增：默认开启
            };
            if (context) {
                context[MODULE_NAME] = saved;
                window.saveSettingsDebounced?.();
            }
            localStorage.setItem(MODULE_NAME, JSON.stringify(saved));
        }

        state.playlistData = saved.playlistData || state.playlistData;
        state.currentGroup = saved.lastGroup || '';
        state.currentBvid = saved.lastBvid || '';
        state.savedPos = saved.lastPos || null;
        state.settings = { ...DEFAULT_SETTINGS, ...(saved.settings || {}) };
        
        // ⭐ 新增：恢复开关状态（如果存档中有的话）
        if (saved.hasOwnProperty('isActive')) {
            state.isActive = saved.isActive;
        }

        if (['cover', 'contain', 'repeat', '100% 100%'].includes(state.settings.borderImageMode)) {
            state.settings.borderImageFit = state.settings.borderImageMode;
            state.settings.borderImageMode = 'background';
        }

    } catch (e) {
        console.warn("配置读取失败", e);
    }
}


function saveExtensionSettings() {
    let pos = null;
    if (panelElement && !state.isFloating && panelElement.style.display !== 'none') {
        const rect = panelElement.getBoundingClientRect();
        pos = { left: rect.left, top: rect.top };
    }

    const data = {
        playlistData: state.playlistData,
        lastGroup: state.currentGroup,
        lastBvid: state.currentBvid,
        lastPos: pos,
        settings: state.settings,
        isActive: state.isActive  // ⭐ 新增：保存开关状态
    };

    try {
        localStorage.setItem(MODULE_NAME, JSON.stringify(data));
    } catch (e) {
        console.warn("localStorage 保存失败", e);
    }

    const context = window.SillyTavern?.extensions_settings;
    if (context) {
        context[MODULE_NAME] = data;
        if (typeof window.saveSettingsDebounced === 'function') {
            window.saveSettingsDebounced();
        } else if (typeof window.saveSettings === 'function') {
            window.saveSettings();
        }
    }
}


// 3. 主题应用
function applyTheme() {
    const theme = state.settings.theme;
    const colors = state.settings.customColors || THEME_COLORS[theme] || THEME_COLORS.pink;

    const root = document.documentElement;
    if (colors.primary) root.style.setProperty('--kp-primary', colors.primary);
    if (colors.primaryLight) root.style.setProperty('--kp-primary-light', colors.primaryLight);
    if (colors.primaryDeep) root.style.setProperty('--kp-primary-deep', colors.primaryDeep);
    if (colors.secondary) root.style.setProperty('--kp-secondary', colors.secondary);
    if (colors.bg) root.style.setProperty('--kp-bg', colors.bg);
    if (colors.bgSoft) root.style.setProperty('--kp-bg-soft', colors.bgSoft);
    if (colors.text) root.style.setProperty('--kp-text', colors.text);
    if (colors.textMuted) root.style.setProperty('--kp-text-muted', colors.textMuted);
    if (colors.border) root.style.setProperty('--kp-border', colors.border);
    if (colors.actionPrimary) root.style.setProperty('--kp-action-primary', colors.actionPrimary);
    if (colors.actionPrimaryText) root.style.setProperty('--kp-action-primary-text', colors.actionPrimaryText);
    if (colors.actionSecondary) root.style.setProperty('--kp-action-secondary', colors.actionSecondary);
    if (colors.actionSecondaryText) root.style.setProperty('--kp-action-secondary-text', colors.actionSecondaryText);
    if (colors.shadow) root.style.setProperty('--kp-shadow', `0 12px 35px ${colors.shadow}`);

    root.setAttribute('data-bili-theme', theme);

    applyBorderImage();

    updateBadgeAvatar();

    if (panelElement) {
        const titleEl = panelElement.querySelector('.bili-ext-header .title');
        if (titleEl) {
            titleEl.textContent = `${THEMES[theme].emoji} BiliPlayer ${THEMES[theme].emoji}`;
        }
    }

    refreshSettingsUI();
}

function applyThemeColorsOnly() {
    const theme = state.settings.theme;
    const colors = state.settings.customColors || THEME_COLORS[theme] || THEME_COLORS.pink;

    const root = document.documentElement;
    if (colors.primary) root.style.setProperty('--kp-primary', colors.primary);
    if (colors.primaryLight) root.style.setProperty('--kp-primary-light', colors.primaryLight);
    if (colors.primaryDeep) root.style.setProperty('--kp-primary-deep', colors.primaryDeep);
    if (colors.secondary) root.style.setProperty('--kp-secondary', colors.secondary);
    if (colors.bg) root.style.setProperty('--kp-bg', colors.bg);
    if (colors.bgSoft) root.style.setProperty('--kp-bg-soft', colors.bgSoft);
    if (colors.text) root.style.setProperty('--kp-text', colors.text);
    if (colors.textMuted) root.style.setProperty('--kp-text-muted', colors.textMuted);
    if (colors.border) root.style.setProperty('--kp-border', colors.border);
    if (colors.actionPrimary) root.style.setProperty('--kp-action-primary', colors.actionPrimary);
    if (colors.actionPrimaryText) root.style.setProperty('--kp-action-primary-text', colors.actionPrimaryText);
    if (colors.actionSecondary) root.style.setProperty('--kp-action-secondary', colors.actionSecondary);
    if (colors.actionSecondaryText) root.style.setProperty('--kp-action-secondary-text', colors.actionSecondaryText);
    if (colors.shadow) root.style.setProperty('--kp-shadow', `0 12px 35px ${colors.shadow}`);
}

function applyBorderImage() {
    if (!panelElement) return;

    const oldLayer = panelElement.querySelector('.bili-border-image-layer');
    if (oldLayer) oldLayer.remove();

    if (!state.settings.borderImage) {
        panelElement.classList.remove('bili-has-border-image');
        panelElement.removeAttribute('data-border-mode');
        return;
    }

    panelElement.classList.add('bili-has-border-image');
    const mode = state.settings.borderImageMode || 'background';
    panelElement.setAttribute('data-border-mode', mode);

    const layer = document.createElement('div');
    layer.className = 'bili-border-image-layer';
    layer.style.backgroundImage = `url("${state.settings.borderImage}")`;

    const fit = state.settings.borderImageFit || 'cover';
    if (fit === 'repeat') {
        layer.style.backgroundSize = 'auto';
        layer.style.backgroundRepeat = 'repeat';
    } else if (fit === 'stretch') {
        layer.style.backgroundSize = '100% 100%';
        layer.style.backgroundRepeat = 'no-repeat';
    } else {
        layer.style.backgroundSize = fit;
        layer.style.backgroundRepeat = 'no-repeat';
    }

    layer.style.backgroundPosition = 'center';
    layer.style.opacity = state.settings.borderImageOpacity;

    panelElement.insertBefore(layer, panelElement.firstChild);
}

function updateBadgeAvatar() {
    if (!floatBadgeElement) return;
    
    const circle = floatBadgeElement.querySelector('.bili-badge-circle');
    if (!circle) return;
    
    const faceEl = circle.querySelector('.bili-badge-text-face');
    const imgEl = circle.querySelector('.bili-badge-avatar-img');
    
    const { avatarType, avatarValue } = state.settings;
    
    if (imgEl) imgEl.remove();
    
    if (avatarType === 'emoji' || !avatarValue) {
        circle.style.background = '';
        circle.style.backgroundImage = '';
        if (!faceEl) {
            const newFace = document.createElement('div');
            newFace.className = 'bili-badge-text-face';
            newFace.textContent = avatarValue || THEMES[state.settings.theme].emoji;
            circle.appendChild(newFace);
        } else {
            faceEl.textContent = avatarValue || THEMES[state.settings.theme].emoji;
            faceEl.style.display = '';
        }
    } else {
        if (faceEl) faceEl.style.display = 'none';
        const img = document.createElement('img');
        img.className = 'bili-badge-avatar-img';
        img.src = avatarValue;
        img.alt = 'avatar';
        img.onerror = () => {
            img.remove();
            if (faceEl) {
                faceEl.style.display = '';
                faceEl.textContent = THEMES[state.settings.theme].emoji;
            }
        };
        circle.appendChild(img);
    }
}

// 4. 安全释放 Iframe 内存
function safeUpdateIframe(src) {
    const box = document.getElementById('bili-ext-video-box');
    if (!box) return;
    
    const oldFrame = document.getElementById('bili-ext-frame');
    if (oldFrame) {
        oldFrame.src = 'about:blank';
        oldFrame.parentNode.removeChild(oldFrame);
    }
    
    const placeholder = document.getElementById('bili-ext-placeholder');
    if (!src) {
        if (placeholder) placeholder.style.display = 'flex';
        return;
    }
    
    if (placeholder) placeholder.style.display = 'none';
    const newFrame = document.createElement('iframe');
    newFrame.id = 'bili-ext-frame';
    newFrame.className = 'bili-ext-iframe';
    newFrame.setAttribute('scrolling', 'no');
    newFrame.setAttribute('frameborder', 'no');
    newFrame.setAttribute('allowfullscreen', 'true');
    newFrame.src = src;
    box.appendChild(newFrame);
}

function loadVideo(groupName, bvid) {
    state.currentGroup = groupName;
    state.currentBvid = bvid;
    
    let targetPage = 1; 
    let pureBvid = bvid;
    if (bvid.includes('_p')) {
        const parts = bvid.split('_p');
        pureBvid = parts[0];
        targetPage = parts[1] || 1;
    }
    
    const src = `https://www.bilibili.com/blackboard/html5mobileplayer.html?bvid=${pureBvid}&p=${targetPage}`;
    safeUpdateIframe(src);
    renderGroups(); 
    updateNavButtons(); 
    saveExtensionSettings();
}

// ⭐ 新增：上下集切换功能
function getAdjacentVideo(direction) {
    if (!state.currentGroup || !state.currentBvid) return null;
    const videos = state.playlistData[state.currentGroup];
    if (!videos || videos.length === 0) return null;
    
    const currentIdx = videos.findIndex(v => v.bvid === state.currentBvid);
    if (currentIdx === -1) return null;
    
    const newIdx = currentIdx + direction;
    if (newIdx < 0 || newIdx >= videos.length) return null;
    
    return videos[newIdx];
}

function playPrev() {
    const prev = getAdjacentVideo(-1);
    if (prev) loadVideo(state.currentGroup, prev.bvid);
}

function playNext() {
    const next = getAdjacentVideo(1);
    if (next) loadVideo(state.currentGroup, next.bvid);
}

function updateNavButtons() {
    const prevBtn = document.getElementById('bili-ext-prev-btn');
    const nextBtn = document.getElementById('bili-ext-next-btn');
    const infoSpan = document.getElementById('bili-ext-nav-info');
    if (!prevBtn || !nextBtn) return;
    
    const videos = state.playlistData[state.currentGroup] || [];
    const currentIdx = videos.findIndex(v => v.bvid === state.currentBvid);
    
    prevBtn.disabled = currentIdx <= 0;
    nextBtn.disabled = currentIdx === -1 || currentIdx >= videos.length - 1;
    
    if (infoSpan) {
        if (currentIdx >= 0 && videos.length > 0) {
            infoSpan.textContent = `${currentIdx + 1} / ${videos.length}`;
        } else {
            infoSpan.textContent = '';
        }
    }

    updateOverlayButtons();
}


// 5. 绘制系列列表（含 ⭐ 重命名功能）
let renderTimeout = null;

function renderGroups() {
    clearTimeout(renderTimeout);

    renderTimeout = setTimeout(() => {
        const container = document.getElementById('bili-ext-groups-container');
        if (!container) return;

        container.innerHTML = '';
        const allGroupNames = Object.keys(state.playlistData);

        if (allGroupNames.length === 0) {
            container.innerHTML = '<div style="text-align:center;color:var(--kp-text-muted);font-size:11px;margin-top:20px;">盒子空啦喏~</div>';
            saveExtensionSettings();
            return;
        }

        const fragment = document.createDocumentFragment();

        allGroupNames.forEach(groupName => {
            const videos = state.playlistData[groupName] || [];
            const details = document.createElement('details');
            details.className = 'bili-details';

            // ⭐ 新逻辑：优先检查用户是否手动折叠过
            if (state.collapsedGroups.has(groupName)) {
                details.open = false;  // 用户折叠过，保持折叠
            } else if (allGroupNames.length === 1) {
                details.open = true;  // 只有一个分类，默认展开
            } else if (state.currentGroup === groupName && state.currentBvid) {
                details.open = true;  // 正在播放的分类自动展开
            } else {
                details.open = false;  // 其他情况默认折叠
            }

            // ⭐ 监听用户的展开/折叠操作
            details.addEventListener('toggle', () => {
                if (details.open) {
                    state.collapsedGroups.delete(groupName);  // 展开时移除记录
                } else {
                    state.collapsedGroups.add(groupName);  // 折叠时添加记录
                }
            });

            const summary = document.createElement('summary');
            summary.className = 'bili-summary';
            summary.innerHTML = `
            <span class="bili-arrow">⭐</span>
            <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            ${escapeHtml(groupName)} (${videos.length})
            </span>`;

            // ⭐ 分类重命名按钮
            const groupRename = document.createElement('span');
            groupRename.className = 'bili-rename';
            groupRename.textContent = '✎';
            groupRename.title = '重命名分类';
            groupRename.style.marginRight = '4px';
            groupRename.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const newName = prompt(`重命名分类「${groupName}」：`, groupName);
                if (!newName || newName.trim() === groupName) return;
                const trimmed = newName.trim();
                if (state.playlistData[trimmed]) {
                    alert('已存在同名分类哦~');
                    return;
                }
                const newPlaylistData = {};
                Object.keys(state.playlistData).forEach(key => {
                    if (key === groupName) {
                        newPlaylistData[trimmed] = state.playlistData[key];
                    } else {
                        newPlaylistData[key] = state.playlistData[key];
                    }
                });
                state.playlistData = newPlaylistData;
                if (state.currentGroup === groupName) {
                    state.currentGroup = trimmed;
                }
                renderGroups();
                saveExtensionSettings();
            };

            // ⭐ 分类上下移动按钮
            if (allGroupNames.length > 1) {
                const groupIdx = allGroupNames.indexOf(groupName);
                if (groupIdx > 0) {
                const upBtn = document.createElement('span');
                upBtn.className = 'bili-move-btn';
                upBtn.textContent = '↑';
                upBtn.title = '上移';
                upBtn.style.marginRight = '2px';
                upBtn.onclick = (e) => {
                   e.preventDefault();
                   e.stopPropagation();
                    const keys = Object.keys(state.playlistData);
                    const idx = keys.indexOf(groupName);
                    if (idx > 0) {
                        [keys[idx - 1], keys[idx]] = [keys[idx], keys[idx - 1]];
                        const newData = {};
                        keys.forEach(k => { newData[k] = state.playlistData[k]; });
                        state.playlistData = newData;
                        renderGroups();
                        saveExtensionSettings();
                   }
                };
                summary.appendChild(upBtn);
            }
            if (groupIdx < allGroupNames.length - 1) {
                const downBtn = document.createElement('span');
                downBtn.className = 'bili-move-btn';
                downBtn.textContent = '↓';
                downBtn.title = '下移';
                downBtn.style.marginRight = '2px';
                downBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const keys = Object.keys(state.playlistData);
                    const idx = keys.indexOf(groupName);
                    if (idx < keys.length - 1) {
                        [keys[idx], keys[idx + 1]] = [keys[idx + 1], keys[idx]];
                        const newData = {};
                        keys.forEach(k => { newData[k] = state.playlistData[k]; });
                        state.playlistData = newData;
                        renderGroups();
                        saveExtensionSettings();
                    }
                };
                summary.appendChild(downBtn);
            }
        }

            summary.appendChild(groupRename);

            const groupDel = document.createElement('span');
            groupDel.className = 'bili-del';
            groupDel.textContent = '×';
            groupDel.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (videos.length > 0 && !confirm(`确定删除 ${groupName}？`)) {
                    return;
                }

                delete state.playlistData[groupName];

                if (state.currentGroup === groupName) {
                    state.currentGroup = '';
                    state.currentBvid = '';
                    safeUpdateIframe('');
                }
                renderGroups();
                saveExtensionSettings();
            };

            summary.appendChild(groupDel);
            details.appendChild(summary);

            const ul = document.createElement('ul');
            ul.style.listStyle = 'none';
            ul.style.padding = '0 6px 6px';
            ul.dataset.group = groupName;
            ul.className = 'bili-sortable-list';

            videos.forEach(item => {
                const li = document.createElement('li');
                li.className = 'bili-item';
                li.draggable = true;
                li.dataset.bvid = item.bvid;

                if (state.currentGroup === groupName && state.currentBvid === item.bvid) {
                    li.classList.add('active');
                }

                // ⭐ 视频名（点击播放 + 双击改名）
                const title = document.createElement('span');
                title.className = 'bili-title-span';
                title.textContent = item.title || item.bvid;
                title.title = '点击播放 · 双击改名';
                title.onclick = (e) => { 
                    e.stopPropagation();
                    loadVideo(groupName, item.bvid); 
                };
                title.ondblclick = (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    startRenameItem(li, groupName, item);
                };
                li.appendChild(title);

                // ⭐ 笔形按钮（hover 才显示）
                const renameBtn = document.createElement('span');
                renameBtn.className = 'bili-rename';
                renameBtn.textContent = '✎';
                renameBtn.title = '重命名';
                renameBtn.onclick = (e) => {
                    e.stopPropagation();
                    startRenameItem(li, groupName, item);
                };
                li.appendChild(renameBtn);

                // ⭐ 移动按钮（点击弹出面板选分类）
                const moveBtn = document.createElement('span');
                moveBtn.className = 'bili-move-btn';
                moveBtn.textContent = '↗';
                moveBtn.title = '移动到其他分类';
                moveBtn.onclick = async (e) => {
                    e.stopPropagation();
                    const targetGroup = await showMoveDialog(item, groupName);
                    if (!targetGroup) return;

                    state.playlistData[groupName] = state.playlistData[groupName].filter(v => v.bvid !== item.bvid);
                    state.playlistData[targetGroup].push(item);

                    if (state.currentBvid === item.bvid) {
                        state.currentGroup = targetGroup;
                    }
                    renderGroups();
                    saveExtensionSettings();
                    showToast(`✅ 已移动到「${targetGroup}」`);
                };
                li.appendChild(moveBtn);

                const del = document.createElement('span');
                del.className = 'bili-del';
                del.textContent = '×';
                del.onclick = () => {
                    state.playlistData[groupName] = state.playlistData[groupName].filter(v => v.bvid !== item.bvid);

                    if (state.currentBvid === item.bvid) {
                        safeUpdateIframe('');
                        state.currentBvid = '';
                        if (state.currentGroup === groupName) {
                            state.currentGroup = '';
                        }
                    }
                    renderGroups();
                    saveExtensionSettings();
                };
                li.appendChild(del);

                // ⭐ 拖拽排序事件
                li.addEventListener('dragstart', (e) => {
                    if (li.classList.contains('bili-renaming')) {
                        e.preventDefault();
                        return;
                    }
                    e.stopPropagation(); // ⭐ 阻止冒泡到 details
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', item.bvid);
                    li.classList.add('bili-dragging');
                    li.dataset.dragGroup = groupName;
                });
                li.addEventListener('dragend', () => {
                    li.classList.remove('bili-dragging');
                    document.querySelectorAll('.bili-drag-over').forEach(el => el.classList.remove('bili-drag-over'));
                });
                li.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.stopPropagation(); 
                    e.dataTransfer.dropEffect = 'move';
                    const dragging = ul.querySelector('.bili-dragging');
                    if (dragging && dragging !== li) {
                        // ✅ 使用 requestAnimationFrame 防止频繁重绘
                        if (!li._dragOverScheduled) {
                            li._dragOverScheduled = true;
                            requestAnimationFrame(() => {
                                ul.querySelectorAll('.bili-drag-over').forEach(el => {
                                    if (el !== li) el.classList.remove('bili-drag-over');
                                });
                                li.classList.add('bili-drag-over');
                                li._dragOverScheduled = false;
                            });
                        }
                    }
                });
                    
                li.addEventListener('dragleave', () => {
                    li.classList.remove('bili-drag-over');
                });
                li.addEventListener('drop', (e) => {
                    e.preventDefault();
                    li.classList.remove('bili-drag-over');
                    const dragBvid = e.dataTransfer.getData('text/plain');
                    if (!dragBvid || dragBvid === item.bvid) return;

                    const videos = state.playlistData[groupName];
                    if (!videos) return;

                    const fromIdx = videos.findIndex(v => v.bvid === dragBvid);
                    const toIdx = videos.findIndex(v => v.bvid === item.bvid);
                    if (fromIdx === -1 || toIdx === -1) return;

                    const [moved] = videos.splice(fromIdx, 1);
                    videos.splice(toIdx, 0, moved);

                    renderGroups();
                    updateNavButtons();
                    saveExtensionSettings();
                });
                ul.appendChild(li);
            });

            
            details.appendChild(ul);
            fragment.appendChild(details);
        });

        container.appendChild(fragment);
        setupGroupDragSort(container);
        saveExtensionSettings();
    }, 30);
}

// ⭐ 移动端触摸拖拽排序
function setupTouchSortable(ul, groupName) {
    let dragItem = null;
    let dragClone = null;
    let startY = 0;
    let startX = 0;
    let longPressTimer = null;
    let isDragging = false;
    const LONG_PRESS_MS = 400;
    const MOVE_THRESHOLD = 8;

    ul.addEventListener('touchstart', (e) => {
        const li = e.target.closest('.bili-item');
        if (!li || li.classList.contains('bili-renaming')) return;
        if (e.target.closest('.bili-del') || e.target.closest('.bili-selector') || e.target.closest('.bili-rename') || e.target.closest('input')) return;

        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;

        longPressTimer = setTimeout(() => {
            isDragging = true;
            dragItem = li;
            li.classList.add('bili-dragging');

            // 创建拖拽影子
            dragClone = li.cloneNode(true);
            dragClone.className = 'bili-drag-clone';
            const rect = li.getBoundingClientRect();
            dragClone.style.cssText = `
                position: fixed;
                left: ${rect.left}px;
                top: ${rect.top}px;
                width: ${rect.width}px;
                height: ${rect.height}px;
                z-index: 999999;
                pointer-events: none;
                opacity: 0.85;
                transform: scale(1.03);
                transform: scale(1.03) translateZ(0);
                box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                border-radius: 8px;
                background: var(--kp-bg);
                transition: none;
                will-change: transform; 
            `;
            document.body.appendChild(dragClone);
        }, LONG_PRESS_MS);
    }, { passive: true });

    ul.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];

        // 未进入拖拽状态时，如果手指移动超过阈值，取消长按
        if (!isDragging) {
            if (Math.abs(touch.clientX - startX) > MOVE_THRESHOLD || Math.abs(touch.clientY - startY) > MOVE_THRESHOLD) {
                clearTimeout(longPressTimer);
            }
            return;
        }

        e.preventDefault();

        // 移动影子
        if (dragClone) {
            const rect = dragItem.getBoundingClientRect();
            dragClone.style.top = (touch.clientY - rect.height / 2) + 'px';
            dragClone.style.left = rect.left + 'px';
        }

        // 找到手指下方的目标 li
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        const targetLi = target?.closest('.bili-item');

        // 清除旧高亮
        ul.querySelectorAll('.bili-drag-over').forEach(el => el.classList.remove('bili-drag-over'));

        if (targetLi && targetLi !== dragItem && ul.contains(targetLi)) {
            targetLi.classList.add('bili-drag-over');
        }
    }, { passive: false });

    ul.addEventListener('touchend', () => {
        clearTimeout(longPressTimer);

        if (!isDragging || !dragItem) {
            isDragging = false;
            dragItem = null;
            return;
        }

        // 找到最终目标
        const overItem = ul.querySelector('.bili-drag-over');
        if (overItem && overItem !== dragItem) {
            const fromBvid = dragItem.dataset.bvid;
            const toBvid = overItem.dataset.bvid;
            const videos = state.playlistData[groupName];

            if (videos && fromBvid && toBvid) {
                const fromIdx = videos.findIndex(v => v.bvid === fromBvid);
                const toIdx = videos.findIndex(v => v.bvid === toBvid);
                if (fromIdx !== -1 && toIdx !== -1) {
                    const [moved] = videos.splice(fromIdx, 1);
                    videos.splice(toIdx, 0, moved);
                    saveExtensionSettings();
                }
            }
        }

        // 清理
        dragItem.classList.remove('bili-dragging');
        ul.querySelectorAll('.bili-drag-over').forEach(el => el.classList.remove('bili-drag-over'));
        if (dragClone) { dragClone.remove(); dragClone = null; }
        isDragging = false;
        dragItem = null;

        renderGroups();
        updateNavButtons();
    }, { passive: true });

    ul.addEventListener('touchcancel', () => {
        clearTimeout(longPressTimer);
        if (dragItem) dragItem.classList.remove('bili-dragging');
        ul.querySelectorAll('.bili-drag-over').forEach(el => el.classList.remove('bili-drag-over'));
        if (dragClone) { dragClone.remove(); dragClone = null; }
        isDragging = false;
        dragItem = null;
    }, { passive: true });
}

// ⭐ 分类拖拽排序（仅桌面端）
function setupGroupDragSort(container) {
    const details = container.querySelectorAll('.bili-details');

    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        details.forEach(detail => {
            detail.draggable = false;
            detail.removeAttribute('draggable');
        });
        return; 
    }
    
    details.forEach(detail => {
        const summary = detail.querySelector('.bili-summary');
        if (!summary) return;
        
        detail.draggable = true;
        
        detail.addEventListener('dragstart', (e) => {
            if (!e.target.closest('.bili-summary') && e.target !== detail) {
                e.preventDefault();
                return;
            }
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/bili-group', detail.querySelector('.bili-summary span:nth-child(2)')?.textContent?.replace(/\s*\(\d+\)\s*$/, '').trim() || '');
            detail.classList.add('bili-group-dragging');
        });
        
        detail.addEventListener('dragend', () => {
            detail.classList.remove('bili-group-dragging');
            // ✅ 强制清理所有高亮（包括拖到外面的情况）
            document.querySelectorAll('.bili-group-drag-over').forEach(el => el.classList.remove('bili-group-drag-over'));
        });
        
        detail.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'move';
            const dragging = container.querySelector('.bili-group-dragging');
            if (dragging && dragging !== detail) {
                if (!detail._dragOverScheduled) {
                    detail._dragOverScheduled = true;
                    requestAnimationFrame(() => {
                        container.querySelectorAll('.bili-group-drag-over').forEach(el => {
                            if (el !== detail) el.classList.remove('bili-group-drag-over');
                        });
                        detail.classList.add('bili-group-drag-over');
                        detail._dragOverScheduled = false;
                    });
                }
            }
        });
        
        detail.addEventListener('dragleave', (e) => {
            // ✅ 只在真正离开元素时清理（避免子元素触发）
            if (!detail.contains(e.relatedTarget)) {
                detail.classList.remove('bili-group-drag-over');
            }
        });
        
        detail.addEventListener('drop', (e) => {
            e.preventDefault();
            detail.classList.remove('bili-group-drag-over');
            const fromGroupRaw = e.dataTransfer.getData('text/bili-group');
            if (!fromGroupRaw) return;
            
            const allGroupNames = Object.keys(state.playlistData);
            const detailsList = [...container.querySelectorAll('.bili-details')];
            const fromIdx = detailsList.indexOf(container.querySelector('.bili-group-dragging'));
            const toIdx = detailsList.indexOf(detail);
            
            if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;
            
            const keys = Object.keys(state.playlistData);
            const [movedKey] = keys.splice(fromIdx, 1);
            keys.splice(toIdx, 0, movedKey);
            
            const newData = {};
            keys.forEach(k => { newData[k] = state.playlistData[k]; });
            state.playlistData = newData;
            
            renderGroups();
            saveExtensionSettings();
        });
    });
    
    // ⭐ 容器级清理：拖出整个列表区域时清除所有高亮
    container.addEventListener('dragleave', (e) => {
        if (!container.contains(e.relatedTarget)) {
            container.querySelectorAll('.bili-group-drag-over').forEach(el => {
                el.classList.remove('bili-group-drag-over');
            });
        }
    });
    
    // ⭐ 全局兜底清理：拖出窗口时清理（防止拖到浏览器外）
    document.addEventListener('dragover', (e) => {
        const isDraggingGroup = container.querySelector('.bili-group-dragging');
        if (isDraggingGroup) {
            const rect = container.getBoundingClientRect();
            if (e.clientX < rect.left || e.clientX > rect.right ||
                e.clientY < rect.top || e.clientY > rect.bottom) {
                container.querySelectorAll('.bili-group-drag-over').forEach(el => {
                    el.classList.remove('bili-group-drag-over');
                });
            }
        }
    });
}


function setupGroupTouchSort(container) {
    let dragDetail = null;
    let dragClone = null;
    let startY = 0;
    let startX = 0;
    let longPressTimer = null;
    let isDragging = false;
    let lastOverDetail = null;
    const LONG_PRESS_MS = 500;
    const MOVE_THRESHOLD = 8;

    container.addEventListener('touchstart', (e) => {
        const summary = e.target.closest('.bili-summary');
        // 只允许从分类标题栏触发，排除视频条目区域
        if (!summary) return;
        // 如果触发点在视频列表内，不处理
        if (e.target.closest('.bili-sortable-list') || e.target.closest('.bili-item')) return;
        const detail = summary.closest('.bili-details');
        if (!detail) return;
        // 不在按钮上触发
        if (e.target.closest('.bili-del') || e.target.closest('.bili-rename')) return;

        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;

        longPressTimer = setTimeout(() => {
            isDragging = true;
            dragDetail = detail;
            detail.classList.add('bili-group-dragging');

            dragClone = document.createElement('div');
            dragClone.className = 'bili-drag-clone';
            const rect = detail.getBoundingClientRect();
            dragClone.textContent = summary.textContent.trim();
            dragClone.style.cssText = `
                position: fixed;
                left: ${rect.left}px;
                top: ${rect.top}px;
                width: ${rect.width}px;
                height: 40px;
                z-index: 999999;
                pointer-events: none;
                opacity: 0.85;
                transform: scale(1.02);
                box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                border-radius: 12px;
                background: var(--kp-bg);
                display: flex;
                align-items: center;
                padding: 0 12px;
                font-size: 12px;
                font-weight: 700;
                color: var(--kp-text);
                border: 2px solid var(--kp-primary-deep);
            `;
            document.body.appendChild(dragClone);
        }, LONG_PRESS_MS);
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        if (!isDragging) {
            if (Math.abs(touch.clientX - startX) > MOVE_THRESHOLD || Math.abs(touch.clientY - startY) > MOVE_THRESHOLD) {
                clearTimeout(longPressTimer);
            }
            return;
        }
        e.preventDefault();

        if (dragClone) {
            // 影子跟随手指，锁定水平位置避免飘
            const containerRect = container.getBoundingClientRect();
            dragClone.style.top = (touch.clientY - 20) + 'px';
            dragClone.style.left = containerRect.left + 'px';
            dragClone.style.width = containerRect.width + 'px';
        }

        // 用坐标遍历判断，不依赖 elementFromPoint
        container.querySelectorAll('.bili-group-drag-over').forEach(el => el.classList.remove('bili-group-drag-over'));

        lastOverDetail = null;
        const allDetails = container.querySelectorAll('.bili-details');
        for (const d of allDetails) {
            if (d === dragDetail) continue;
            const summaryEl = d.querySelector('.bili-summary');
            if (!summaryEl) continue;
            const rect = summaryEl.getBoundingClientRect();
            if (touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
                d.classList.add('bili-group-drag-over');
                lastOverDetail = d;
                break;
            }
        }
    }, { passive: false });

    container.addEventListener('touchend', () => {
        clearTimeout(longPressTimer);
        if (!isDragging || !dragDetail) {
            isDragging = false;
            dragDetail = null;
            return;
        }

        const overDetail = lastOverDetail;
        if (overDetail && overDetail !== dragDetail) {
            const detailsList = [...container.querySelectorAll('.bili-details')];
            const fromIdx = detailsList.indexOf(dragDetail);
            const toIdx = detailsList.indexOf(overDetail);

            if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
                const keys = Object.keys(state.playlistData);
                const [movedKey] = keys.splice(fromIdx, 1);
                keys.splice(toIdx, 0, movedKey);

                const newData = {};
                keys.forEach(k => { newData[k] = state.playlistData[k]; });
                state.playlistData = newData;
                saveExtensionSettings();
            }
        }

        dragDetail.classList.remove('bili-group-dragging');
        container.querySelectorAll('.bili-group-drag-over').forEach(el => el.classList.remove('bili-group-drag-over'));
        if (dragClone) { dragClone.remove(); dragClone = null; }
        isDragging = false;
        dragDetail = null;

        renderGroups();
    }, { passive: true });

    container.addEventListener('touchcancel', () => {
        clearTimeout(longPressTimer);
        if (dragDetail) dragDetail.classList.remove('bili-group-dragging');
        container.querySelectorAll('.bili-group-drag-over').forEach(el => el.classList.remove('bili-group-drag-over'));
        if (dragClone) { dragClone.remove(); dragClone = null; }
        isDragging = false;
        dragDetail = null;
    }, { passive: true });
}

// ⭐ 新增：让某个视频项进入"重命名"状态
function startRenameItem(liElement, groupName, item) {
    if (liElement.classList.contains('bili-renaming')) return;
    
    const titleSpan = liElement.querySelector('.bili-title-span');
    if (!titleSpan) return;
    
    const oldTitle = item.title || item.bvid;
    const oldBvid = item.bvid;
    
    const idx = state.playlistData[groupName].findIndex(v => v.bvid === oldBvid);
    if (idx === -1) return;
    
    liElement.classList.add('bili-renaming');
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'bili-rename-input';
    input.value = oldTitle;
    input.placeholder = '输入新名字...';
    input.maxLength = 50;
    input.setAttribute('touch-action', 'manipulation');
    
    titleSpan.style.display = 'none';
    titleSpan.parentNode.insertBefore(input, titleSpan);
    
    // ⭐ 移动端：用 setTimeout 避免虚拟键盘弹起时立刻 blur
    setTimeout(() => {
        input.focus();
        input.select();
    }, 50);
    
    let finished = false;
    const finish = (commit) => {
        if (finished) return;
        finished = true;
        liElement.classList.remove('bili-renaming');
        
        if (commit) {
            const newTitle = input.value.trim();
            if (newTitle && newTitle !== oldTitle) {
                const cur = state.playlistData[groupName][idx];
                if (cur && cur.bvid === oldBvid) {
                    cur.title = newTitle;
                    saveExtensionSettings();
                }
            }
        }
        if (input.parentNode) input.remove();
        titleSpan.style.display = '';
        renderGroups();
    };
    
    input.onkeydown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            finish(true);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            finish(false);
        }
        // ⭐ 阻止冒泡，避免触发拖拽
        e.stopPropagation();
    };
    input.onblur = () => {
        // 移动端延迟判断：如果是被新 input 抢走焦点，忽略
        setTimeout(() => {
            if (!finished && document.activeElement !== input) {
                finish(true);
            }
        }, 100);
    };
    // ⭐ 阻止 input 点击冒泡到 li（防止触发拖拽）
    input.onclick = (e) => e.stopPropagation();
    input.onmousedown = (e) => e.stopPropagation();
    input.ontouchstart = (e) => e.stopPropagation();
}

// 6. 创建主面板
function createPanel() {
    if (document.getElementById('bili-player-extension-panel')) return;

    panelElement = document.createElement('div');
    panelElement.id = 'bili-player-extension-panel';
    panelElement.setAttribute('data-theme', state.settings.theme);
    
    if (window.innerWidth <= 768) {
        const w = Math.min(window.innerWidth * 0.94, 500);
        const h = Math.min(window.innerHeight * 0.82, 700);
        panelElement.style.position = 'fixed';
        panelElement.style.width = w + 'px';
        panelElement.style.height = h + 'px';
        panelElement.style.left = (window.innerWidth - w) / 2 + 'px';
        panelElement.style.top = (window.innerHeight - h) / 2 + 'px';
        panelElement.style.right = 'auto';
        panelElement.style.bottom = 'auto';
        panelElement.classList.add('bili-mobile');
        console.log('[BiliPlayer] 📱 移动端初始化', w, 'x', h);
    } else {
        panelElement.style.position = 'fixed';
        panelElement.style.bottom = '80px';
        panelElement.style.right = '20px';
    }
    
    const theme = state.settings.theme;
    const themeEmoji = THEMES[theme].emoji;
    
    // ⭐ 标题栏：新增 ? 帮助按钮
    panelElement.innerHTML = `
        <div class="bili-ext-header" id="bili-ext-header-drag">
            <span class="title">${themeEmoji} BiliPlayer ${themeEmoji}</span>
            <div class="bili-ext-controls">
                <button id="bili-ext-help-btn" class="bili-ext-btn" title="使用说明" type="button">?</button>
                <button id="bili-ext-settings-btn" class="bili-ext-btn" title="设置" type="button">⚙</button>
                <button id="bili-ext-collapse-btn" class="bili-ext-btn" title="切换收起/展开" type="button">_</button>
                <button id="bili-ext-close-btn" class="bili-ext-btn" title="缩成悬浮猫耳" type="button">×</button>
            </div>
        </div>
        <div class="bili-ext-video-box" id="bili-ext-video-box">
            <div class="bili-ext-dragging-shield"></div>
            <div class="bili-ext-placeholder" id="bili-ext-placeholder">
                <div class="bili-ext-mascot">${themeEmoji} • 人 • ${themeEmoji}</div>
                <p>小主人请投喂我~</p>
            </div>
            <div class="bili-ext-overlay-nav" id="bili-ext-overlay-nav">
                <div class="bili-ext-overlay-trigger" id="bili-ext-overlay-trigger"></div>
                <button class="bili-overlay-btn left" id="bili-overlay-prev" type="button" disabled>
                    <span>⏮</span>
                </button>
                <button class="bili-overlay-btn right" id="bili-overlay-next" type="button" disabled>
                    <span>⏭</span>
                </button>
            </div>
        </div>
        <div class="bili-ext-nav-bar" id="bili-ext-nav-bar">
            <button id="bili-ext-prev-btn" class="bili-nav-btn" title="上一集" type="button" disabled>⏮ 上一集</button>
            <span id="bili-ext-nav-info" class="bili-nav-info"></span>
            <button id="bili-ext-next-btn" class="bili-nav-btn" title="下一集" type="button" disabled>下一集 ⏭</button>
        </div>
        <div id="bili-ext-lower-wrapper">
            <div class="bili-ext-panel">
                <div class="bili-ext-tools">
                    <div style="display:flex;gap:6px;">
                        <input type="text" id="bili-ext-g-input" placeholder="新分类/系列名称..." />
                        <button id="bili-ext-g-btn" class="bili-pink-action-btn" type="button">新建系列</button>
                    </div>
                    <div style="display:flex;gap:6px;margin-top:2px;">
                        <input type="text" id="bili-ext-v-input" placeholder="BV号 / 完整链接 / 分P链接 (空格+自定义名)" />
                        <button id="bili-ext-v-btn" class="bili-mint-action-btn" type="button">投喂</button>
                    </div>
                </div>
                <div class="bili-ext-groups" id="bili-ext-groups-container"></div>
            </div>
        </div>
    `;

    document.body.appendChild(panelElement);

    setupPanelEventDelegation(panelElement);

    applyBorderImage();
    applyThemeColorsOnly();

    if (state.savedPos && state.savedPos.left != null && state.savedPos.top != null) {
        const inViewport = state.savedPos.left > -100 && 
                           state.savedPos.top > -50 && 
                           state.savedPos.left < window.innerWidth - 50 && 
                           state.savedPos.top < window.innerHeight - 50;
        if (inViewport) {
            panelElement.style.left = state.savedPos.left + 'px';
            panelElement.style.top = state.savedPos.top + 'px';
            panelElement.style.right = 'auto';
            panelElement.style.bottom = 'auto';
        }
    }

    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (panelElement && !state.isFloating && panelElement.style.display !== 'none') {
                const rect = panelElement.getBoundingClientRect();
                if (rect.left < -panelElement.offsetWidth + 100 || 
                    rect.top < 0 || 
                    rect.right > window.innerWidth + 100 || 
                    rect.bottom > window.innerHeight) {
                    if (panelElement.classList.contains('bili-mobile')) {
                        const w = parseInt(panelElement.style.width);
                        const h = parseInt(panelElement.style.height);
                        panelElement.style.left = (window.innerWidth - w) / 2 + 'px';
                        panelElement.style.top = (window.innerHeight - h) / 2 + 'px';
                    } else {
                        panelElement.style.left = Math.max(0, window.innerWidth - panelElement.offsetWidth - 20) + 'px';
                        panelElement.style.top = Math.max(0, window.innerHeight - panelElement.offsetHeight - 100) + 'px';
                    }
                }
            }
        }, 200);
    });
}

function setupPanelEventDelegation(panel) {
    panel.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        
        const id = btn.id;
        
        if (id === 'bili-ext-close-btn') {
            e.preventDefault();
            e.stopPropagation();
            enterFloatingState();
        } else if (id === 'bili-ext-collapse-btn') {
            e.preventDefault();
            e.stopPropagation();
            toggleCollapseState();
        } else if (id === 'bili-ext-g-btn') {
            createGroup();
        } else if (id === 'bili-ext-v-btn') {
            addVideo();
        } else if (id === 'bili-ext-settings-btn') {
            e.preventDefault();
            e.stopPropagation();
            openSettingsDialog();
        } else if (id === 'bili-ext-help-btn') {  // ⭐ 新增
            e.preventDefault();
            e.stopPropagation();
            openHelpDialog();
        } else if (id === 'bili-ext-prev-btn') {
            playPrev();
        } else if (id === 'bili-ext-next-btn') {
            playNext();
        }
    });

    initDragSystem(panel, document.getElementById('bili-ext-header-drag'), false);
    setupOverlayNav(panel);
}

// ⭐ 折叠模式 - 视频遮罩浮层上下集按钮
function setupOverlayNav(panel) {
    const overlayNav = panel.querySelector('#bili-ext-overlay-nav');
    const trigger = panel.querySelector('#bili-ext-overlay-trigger');
    const prevBtn = panel.querySelector('#bili-overlay-prev');
    const nextBtn = panel.querySelector('#bili-overlay-next');
    if (!overlayNav || !trigger || !prevBtn || !nextBtn) return;

    let hideTimer = null;

    const showButtons = () => {
        clearTimeout(hideTimer);
        overlayNav.classList.add('active');
        overlayNav.classList.remove('fade-out');
        updateOverlayButtons();

        hideTimer = setTimeout(() => {
            overlayNav.classList.add('fade-out');
            setTimeout(() => {
                overlayNav.classList.remove('active', 'fade-out');
            }, 300);
        }, 3000);
    };

    const hideButtons = () => {
        clearTimeout(hideTimer);
        overlayNav.classList.add('fade-out');
        setTimeout(() => {
            overlayNav.classList.remove('active', 'fade-out');
        }, 300);
    };

    // 点击顶部触发条 → 切换按钮显示/隐藏
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (overlayNav.classList.contains('active') && !overlayNav.classList.contains('fade-out')) {
            hideButtons();
        } else {
            showButtons();
        }
    });

    trigger.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (overlayNav.classList.contains('active') && !overlayNav.classList.contains('fade-out')) {
            hideButtons();
        } else {
            showButtons();
        }
    });

    // 上一集
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playPrev();
        setTimeout(() => { updateOverlayButtons(); showButtons(); }, 100);
    });

    // 下一集
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playNext();
        setTimeout(() => { updateOverlayButtons(); showButtons(); }, 100);
    });

    prevBtn.addEventListener('touchend', (e) => {
        e.preventDefault(); e.stopPropagation();
        playPrev();
        setTimeout(() => { updateOverlayButtons(); showButtons(); }, 100);
    });

    nextBtn.addEventListener('touchend', (e) => {
        e.preventDefault(); e.stopPropagation();
        playNext();
        setTimeout(() => { updateOverlayButtons(); showButtons(); }, 100);
    });
}



// ⭐ 更新遮罩浮层按钮的 disabled 状态
function updateOverlayButtons() {
    const prevBtn = document.getElementById('bili-overlay-prev');
    const nextBtn = document.getElementById('bili-overlay-next');
    if (!prevBtn || !nextBtn) return;

    const videos = state.playlistData[state.currentGroup] || [];
    const currentIdx = videos.findIndex(v => v.bvid === state.currentBvid);

    prevBtn.disabled = currentIdx <= 0;
    nextBtn.disabled = currentIdx === -1 || currentIdx >= videos.length - 1;
}


// 7. 拖拽系统
function initDragSystem(panel, handle, isBadge) {
    if (!handle) return;
    
    let isDragging = false;
    let hasMoved = false;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;
    let moveHandler = null;
    let endHandler = null;
    const DRAG_THRESHOLD = 5;

    const start = (clientX, clientY, e) => {
        // ⭐ 防止 input / 按钮 / 重命名输入框触发拖拽
        if (e.target.tagName === 'BUTTON' || 
            e.target.tagName === 'INPUT' || 
            e.target.tagName === 'SELECT' ||
            e.target.classList?.contains('bili-rename-input') ||
            e.target.closest('button') ||
            e.target.closest('input')) {
            return false;
        }

        if (!isBadge && !panel.classList.contains('bili-mobile')) {
            const rect = panel.getBoundingClientRect();
            if (clientX > rect.right - 16 && clientY > rect.bottom - 16) {
                return false;
            }
        }

        isDragging = true;
        hasMoved = false;
        if (isBadge) panel.dataset.dragging = 'true';
        
        const rect = panel.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        startX = clientX;
        startY = clientY;

        if (isBadge) {
            panel.style.left = startLeft + 'px';
            panel.style.top = startTop + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        } else {
            if (panel.style.right && panel.style.right !== 'auto') {
                panel.style.left = startLeft + 'px';
                panel.style.top = startTop + 'px';
                panel.style.right = 'auto';
                panel.style.bottom = 'auto';
            }
        }

        panel.classList.add('bili-is-dragging');
        if (!isBadge && e.cancelable) e.preventDefault();
        
        return true;
    };

    const move = (clientX, clientY) => {
        if (!isDragging) return;
        
        const dx = clientX - startX;
        const dy = clientY - startY;
        
        if (!hasMoved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
            hasMoved = true;
        }
        
        if (!hasMoved) return;
        
        panel.style.left = (startLeft + dx) + 'px';
        panel.style.top = (startTop + dy) + 'px';
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
    };

    const end = () => {
        if (!isDragging) return;
        const wasMoved = hasMoved;
        isDragging = false;
        hasMoved = false;
        panel.classList.remove('bili-is-dragging');
        
        if (moveHandler) {
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('touchmove', moveHandler);
            moveHandler = null;
        }
        if (endHandler) {
            document.removeEventListener('mouseup', endHandler);
            document.removeEventListener('touchend', endHandler);
            document.removeEventListener('touchcancel', endHandler);
            endHandler = null;
        }
        
        if (isBadge) {
            if (wasMoved) {
                panel.dataset.dragging = 'true';
                setTimeout(() => {
                    if (floatBadgeElement) panel.dataset.dragging = 'false';
                }, 100);
                saveExtensionSettings();
            } else {
                panel.dataset.dragging = 'false';
            }
        } else {
            saveExtensionSettings();
        }
    };

    handle.addEventListener('mousedown', (e) => {
        if (!start(e.clientX, e.clientY, e)) return;
        
        moveHandler = (ev) => move(ev.clientX, ev.clientY);
        endHandler = () => end();
        
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', endHandler);
    });

    handle.addEventListener('touchstart', (e) => {
        if (!e.touches[0]) return;
        if (!start(e.touches[0].clientX, e.touches[0].clientY, e)) return;
        
        moveHandler = (ev) => {
            if (ev.touches[0]) move(ev.touches[0].clientX, ev.touches[0].clientY);
        };
        endHandler = () => end();
        
        document.addEventListener('touchmove', moveHandler, { passive: false });
        document.addEventListener('touchend', endHandler);
        document.addEventListener('touchcancel', endHandler);
    }, { passive: false });
}

// 8. 折叠/展开
function toggleCollapseState() {
    state.isCollapsed = !state.isCollapsed;
    const lowerBody = document.getElementById('bili-ext-lower-wrapper');
    const btn = document.getElementById('bili-ext-collapse-btn');
    
    if (state.isCollapsed) {
        state.savedHeight = panelElement.style.height || '450px';
        state.savedWidth = panelElement.style.width || '340px';
        panelElement.classList.add('bili-collapsed-mode');
        panelElement.style.height = 'auto'; 
        panelElement.style.resize = 'horizontal'; 
        lowerBody.style.display = 'none';
        btn.textContent = '▢';
    } else {
        panelElement.classList.remove('bili-collapsed-mode');
        panelElement.style.height = state.savedHeight; 
        panelElement.style.width = state.savedWidth;
        panelElement.style.resize = 'both'; 
        lowerBody.style.display = 'flex';
        btn.textContent = '_';
    }
    saveExtensionSettings();
}

// 9. 缩成猫耳
function enterFloatingState() {
    console.log('[BiliPlayer] 进入悬浮球模式');
    state.isFloating = true;
    
    let badgeLeft = null, badgeTop = null;
    if (panelElement) {
        const rect = panelElement.getBoundingClientRect();
        state.savedPos = { left: rect.left, top: rect.top };
        const dim = BADGE_DIMENSIONS[state.settings.badgeSize] || BADGE_DIMENSIONS.medium;
        badgeLeft = rect.left + rect.width / 2 - dim.w / 2;
        badgeTop = rect.top + rect.height / 2 - dim.h / 2;
    }
    
    panelElement.style.display = 'none';
    createFloatBadge(badgeLeft, badgeTop);
    saveExtensionSettings();
}

function exitFloatingState() {
    console.log('[BiliPlayer] 退出悬浮球模式');
    state.isFloating = false;
    if (floatBadgeElement) {
        floatBadgeElement.style.display = 'none';
    }
    panelElement.style.display = 'flex';
    
    // ⭐ 修改：只渲染列表，不自动加载视频
    renderGroups();
    
    // ⭐ 如果之前有播放记录且视频区是空的，才恢复播放
    const currentFrame = document.getElementById('bili-ext-frame');
    if (state.currentGroup && state.currentBvid && !currentFrame) {
        loadVideo(state.currentGroup, state.currentBvid);
    }
    
    saveExtensionSettings();
}


// 10. 绘制小猫耳悬浮球
function createFloatBadge(customLeft = null, customTop = null) {
    if (document.getElementById('bili-ext-float-badge')) {
        floatBadgeElement.style.display = 'block';
        return;
    }

    floatBadgeElement = document.createElement('div');
    floatBadgeElement.id = 'bili-ext-float-badge';
    floatBadgeElement.dataset.dragging = 'false';
    floatBadgeElement.setAttribute('data-size', state.settings.badgeSize);
    floatBadgeElement.setAttribute('data-theme', state.settings.theme);
    
    const isMobile = window.innerWidth <= 768;
    const left = customLeft !== null ? customLeft + 'px' : (isMobile ? '15px' : '40px');
    const top = customTop !== null ? customTop + 'px' : '40%';
    
    floatBadgeElement.style.cssText = `
        position: fixed !important;
        left: ${left} !important;
        top: ${top} !important;
        z-index: 100000 !important;
        cursor: pointer !important;
        -webkit-tap-highlight-color: transparent;
        -webkit-user-select: none;
        user-select: none;
    `;

    floatBadgeElement.innerHTML = `
        <div class="bili-badge-container">
            <div class="bili-badge-border-wrapper"></div>
            <div class="bili-badge-ear left"></div>
            <div class="bili-badge-ear right"></div>
            <div class="bili-badge-circle">
                <div class="bili-badge-text-face"></div>
            </div>
        </div>
    `;

    document.body.appendChild(floatBadgeElement);

    updateBadgeAvatar();
    applyBadgeBorder();  // 新增：应用外框图片

    let downX = 0, downY = 0, downTime = 0;
    const TAP_THRESHOLD = 10;
    const TAP_TIME = 500;

    const onDown = (x, y) => {
        downX = x;
        downY = y;
        downTime = Date.now();
    };

    const onUp = (x, y) => {
        const dx = Math.abs(x - downX);
        const dy = Math.abs(y - downY);
        const dt = Date.now() - downTime;
        if (dx < TAP_THRESHOLD && dy < TAP_THRESHOLD && dt < TAP_TIME) {
            exitFloatingState();
        }
    };

    floatBadgeElement.addEventListener('touchstart', (e) => {
        if (e.touches[0]) onDown(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    floatBadgeElement.addEventListener('touchend', (e) => {
        if (e.changedTouches[0]) {
            onUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }
    }, { passive: false });

    floatBadgeElement.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        onDown(e.clientX, e.clientY);
    });

    floatBadgeElement.addEventListener('mouseup', (e) => {
        if (e.button !== 0) return;
        onUp(e.clientX, e.clientY);
    });

    initDragSystem(floatBadgeElement, floatBadgeElement, true);
}

function applyBadgeBorder() {
    if (!floatBadgeElement) return;
    
    const wrapper = floatBadgeElement.querySelector('.bili-badge-border-wrapper');
    const ears = floatBadgeElement.querySelectorAll('.bili-badge-ear');
    const circle = floatBadgeElement.querySelector('.bili-badge-circle');
    
    if (!wrapper) return;
    
    // 清空旧内容
    wrapper.innerHTML = '';
    
    // 如果勾选了"隐藏外框"
    if (state.settings.hideBadgeBorder) {
        ears.forEach(ear => ear.style.display = 'none');
        if (circle) circle.style.border = 'none';
        wrapper.style.display = 'none';
        return;
    }
    
    wrapper.style.display = '';
    
    // 显示默认猫耳
    ears.forEach(ear => ear.style.display = '');
    if (circle) circle.style.border = '';
    
    // 如果有自定义外框图片
    if (state.settings.badgeBorderImage) {
        const img = document.createElement('img');
        img.className = 'bili-badge-custom-border';
        img.src = state.settings.badgeBorderImage;
        img.alt = 'border';
        
        // ⭐ 应用缩放
        const scale = (state.settings.badgeBorderScale || 100) / 100;
        const offsetX = state.settings.badgeBorderOffsetX || 0;
        const offsetY = state.settings.badgeBorderOffsetY || 0;
        
        img.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
        
        img.onerror = () => {
            img.remove();
            console.warn('[BiliPlayer] 悬浮球外框图片加载失败');
        };
        wrapper.appendChild(img);
        
        // ⭐ 层级控制
        const zIndex = state.settings.badgeBorderZIndex || 'above';
        if (zIndex === 'above') {
            wrapper.style.zIndex = '3';  // 外框在前
            if (circle) circle.style.zIndex = '2';
        } else {
            wrapper.style.zIndex = '1';  // 外框在后
            if (circle) circle.style.zIndex = '2';
        }
        
        // 隐藏默认猫耳和圆圈边框
        ears.forEach(ear => ear.style.display = 'none');
        if (circle) circle.style.border = 'none';
    }
}

function openHelpDialog() {
    if (document.getElementById('bili-ext-help-dialog')) {
        closeHelpDialog();
        return;
    }

    const isMobile = window.innerWidth <= 768;
    helpDialogElement = document.createElement('div');
    helpDialogElement.id = 'bili-ext-help-dialog';
    helpDialogElement.setAttribute('data-theme', state.settings.theme);
    if (isMobile) helpDialogElement.classList.add('bili-help-mobile');

    helpDialogElement.innerHTML = `
        <div class="bili-help-mask"></div>
        <div class="bili-help-box">
            <div class="bili-help-header">
                <span>📖 BiliPlayer 使用指南</span>
                <button class="bili-help-close" type="button">×</button>
            </div>
            <div class="bili-help-body">

                <!-- 快速上手（默认展开） -->
                <details class="bili-help-section" open>
                    <summary class="bili-help-title">🚀 三步快速上手</summary>
                    <div class="bili-help-content">
                        <ol>
                            <li><b>创建分类：</b>在「新分类/系列名称」输入框填入名字（如「追番」「电影」），点击<b>「新建系列」</b></li>
                            <li><b>添加视频：</b>在下方输入框粘贴 B 站视频链接或 BV 号，点击<b>「投喂」</b></li>
                            <li><b>开始播放：</b>点击列表中任意视频名即可播放</li>
                        </ol>

                        <p><b>💡 温馨提示：</b></p>
                        <ul>
                            <li>第一次使用时，如果还没有分类，添加视频会自动创建「🐾 未分类」</li>
                            <li>面板可以随意拖拽移动，右下角可以调整大小（桌面端）</li>
                            <li>点击右上角 <b>×</b> 会缩成可爱的猫耳悬浮球，再次点击即可恢复</li>
                        </ul>

                        <p><b>🎯 核心功能一览：</b></p>
                        <ul>
                            <li>🎨 10 套预设主题 + 自定义配色 + 背景图片（含动图 GIF/WebP）</li>
                            <li>📂 分类管理：拖拽排序、重命名、上下移动、删除</li>
                            <li>🎞️ 视频管理：双击改名、拖拽排序、批量添加多P合集、分类间移动</li>
                            <li>⏮️ 上下集切换：视频区下方导航栏 + 折叠模式浮层按钮</li>
                            <li>🐱 悬浮球模式：缩成猫耳球，支持自定义头像、外框、缩放、偏移</li>
                            <li>💾 数据自动保存 + JSON 格式导出导入备份</li>
                        </ul>
                    </div>
                </details>

                <!-- 添加视频详解 -->
                <details class="bili-help-section">
                    <summary class="bili-help-title">🎬 添加视频（详细说明）</summary>
                    <div class="bili-help-content">
                        <h4>✨ 支持的输入格式</h4>
                        <ul>
                            <li><b>纯 BV 号：</b><code>BV1SPQeBuE2d</code></li>
                            <li><b>完整视频链接：</b><code>https://www.bilibili.com/video/BV1xxx</code></li>
                            <li><b>分P链接：</b><code>https://www.bilibili.com/video/BV1xxx?p=3</code></li>
                            <li><b>带追踪参数的链接：</b><code>https://...?vd_source=xxx</code>（自动过滤无关参数）</li>
                            <li><b>B站短链：</b><code>https://b23.tv/abc123</code>（自动展开，可能受 CORS 限制）</li>
                        </ul>

                        <h4>📝 自定义视频名称</h4>
                        <p>在链接或 BV 号后面加一个<b>空格</b>，再写上自定义名字：</p>
                        <div class="bili-help-code">BV1SPQeBuE2d 蜡笔小新第一集</div>
                        <div class="bili-help-code">https://www.bilibili.com/video/BV1xxx 猫和老鼠</div>
                        <p>不写自定义名字时，默认用 BV 号作为标题。</p>

                        <h4>📂 添加流程说明</h4>
                        <p>粘贴内容后点击「投喂」，根据情况会有不同的流程：</p>

                        <h5>情况一：纯 BV 号（不含 bilibili.com）</h5>
                        <ul>
                            <li>只有 1 个分类 → 直接添加到该分类，不弹窗</li>
                            <li>有多个分类 → 弹窗选择目标分类 → 选完即添加</li>
                            <li><b>不会询问多P</b>，始终当作单集处理（想批量添加请用完整链接）</li>
                        </ul>

                        <h5>情况二：完整视频链接（含 bilibili.com）</h5>
                        <ul>
                            <li>只有 1 个分类 → 弹窗直接进入「是否多P合集」步骤</li>
                            <li>有多个分类 → 先选分类 → 再询问是否多P合集</li>
                        </ul>

                        <h4>🎯 批量添加多P合集</h4>
                        <p>使用<b>完整链接</b>添加时，选完分类后会进入第二步：</p>
                        <ul>
                            <li>如果是单集视频 → 点<b>「添加单集」</b>按钮即可</li>
                            <li>如果是多P合集 → 填写<b>起始集数</b>（默认 1）和<b>结束集数</b>（如 24、130），点<b>「批量添加」</b></li>
                            <li>批量添加后标题格式：<code>自定义名字 - P1</code>、<code>自定义名字 - P2</code> ...</li>
                            <li>没写自定义名字时：<code>BV1xxx - P1</code>、<code>BV1xxx - P2</code> ...</li>
                            <li>起始集数可以自定义，比如从第 5 集开始添加到第 24 集</li>
                        </ul>
                        <div class="bili-help-code">示例：粘贴「https://www.bilibili.com/video/BV1xxx 蜡笔小新」<br>→ 选分类 → 起始集 1，结束集 130 → 批量添加<br>→ 生成「蜡笔小新 - P1」~「蜡笔小新 - P130」共 130 个条目</div>

                        <h4>⚠️ 注意事项</h4>
                        <ul>
                            <li>如果想让纯 BV 号也能批量添加多P，请改用完整链接格式</li>
                            <li>番剧链接（<code>/bangumi/play/</code>）暂不支持，请复制播放页的 BV 号</li>
                            <li>短链展开可能受浏览器 CORS 安全策略限制，失败时请改用完整链接</li>
                            <li>同一分类下不会重复添加相同 BV 号（含分P标识）的视频</li>
                        </ul>
                    </div>
                </details>

                <!-- 播放与切换 -->
                <details class="bili-help-section">
                    <summary class="bili-help-title">▶️ 播放与上下集切换</summary>
                    <div class="bili-help-content">
                        <h4>播放视频</h4>
                        <ul>
                            <li>单击列表中任意视频名 → 立即开始播放</li>
                            <li>当前正在播放的视频会高亮显示（左侧有彩色竖条标记）</li>
                            <li>视频区采用 B 站移动端播放器，支持暂停、进度条、全屏等基本操作</li>
                            <li>播放器内操作与 B 站移动版一致，支持手势控制</li>
                        </ul>

                        <h4>上下集切换（两种方式）</h4>
                        <p><b>方式一：导航栏按钮（展开模式）</b></p>
                        <ul>
                            <li>视频区下方有<b>「⏮ 上一集」</b>和<b>「下一集 ⏭」</b>按钮</li>
                            <li>中间显示当前集数位置（如 <code>3 / 24</code>）</li>
                            <li>到达第一集时「上一集」按钮自动变灰不可点击</li>
                            <li>到达最后一集时「下一集」按钮自动变灰不可点击</li>
                        </ul>
                        <p><b>方式二：视频区浮层按钮（折叠模式）</b></p>
                        <ul>
                            <li>折叠模式下，点击视频区顶部的半透明触发条</li>
                            <li>左右两侧会浮现「⏮」「⏭」按钮</li>
                            <li>3 秒无操作后自动隐藏，再次点击触发条可再次唤出</li>
                        </ul>
                        <p><em>注意：切集范围仅限<b>当前分类</b>内的视频列表，按列表排列顺序切换。</em></p>

                        <h4>折叠模式</h4>
                        <ul>
                            <li>点击标题栏的 <b>_</b> 按钮 → 隐藏下方列表区，只保留标题栏 + 视频画面</li>
                            <li>折叠后面板变为仅横向可调整大小（桌面端）</li>
                            <li>再次点击 <b>▢</b> 按钮恢复完整面板</li>
                            <li>折叠模式下导航栏隐藏，改用视频区浮层按钮切集</li>
                            <li>适合只想看视频、不需要操作列表的场景</li>
                        </ul>
                    </div>
                </details>

                <!-- 分类管理 -->
                <details class="bili-help-section">
                    <summary class="bili-help-title">📂 分类管理</summary>
                    <div class="bili-help-content">
                        <h4>创建分类</h4>
                        <ul>
                            <li>在顶部「新分类/系列名称」输入框中填入名字</li>
                            <li>点击<b>「新建系列」</b>，新分类立即出现在列表底部</li>
                            <li>分类名支持 Emoji 和任意字符，如「🎬 电影」「📺 追番」「🎵 音乐」</li>
                            <li>不能创建同名分类（会静默忽略）</li>
                        </ul>

                        <h4>展开/折叠分类</h4>
                        <ul>
                            <li>点击分类名左侧的 ⭐ 箭头或分类标题 → 展开/折叠该分类的视频列表</li>
                            <li>当前正在播放的分类会自动展开</li>
                            <li>只有一个分类时默认展开</li>
                            <li>用户手动折叠过的分类会记住状态，切换视频时不会自动展开</li>
                        </ul>

                        <h4>重命名分类</h4>
                        <ul>
                            <li>鼠标悬停分类标题 → 右侧出现 <b>✎</b> 笔形按钮 → 点击</li>
                            <li>在弹出的对话框中填入新名字 → 确认</li>
                            <li>分类下的所有视频会保留，正在播放的视频不受影响</li>
                            <li>不能改成已存在的分类名（会提示重复）</li>
                        </ul>

                        <h4>调整分类顺序（三种方式）</h4>
                        <ul>
                            <li><b>按钮方式：</b>每个分类标题右侧有 <b>↑</b> <b>↓</b> 按钮，点击即可上移/下移</li>
                            <li><b>桌面端拖拽：</b>按住分类标题拖动到目标位置，目标处会出现蓝色指示线</li>
                            <li><b>移动端：</b>长按分类标题约 0.5 秒进入拖拽模式（也可使用 ↑↓ 按钮）</li>
                        </ul>

                        <h4>删除分类</h4>
                        <ul>
                            <li>点击分类标题最右侧的 <b>×</b> 按钮</li>
                            <li>如果分类内有视频，会弹出二次确认对话框</li>
                            <li>空分类直接删除，不会二次确认</li>
                            <li>删除后<b>无法恢复</b>，请谨慎操作</li>
                            <li>如果删除的是正在播放的分类，播放会停止，视频区回到待机状态</li>
                        </ul>
                    </div>
                </details>

                <!-- 视频管理 -->
                <details class="bili-help-section">
                    <summary class="bili-help-title">🎞️ 视频管理</summary>
                    <div class="bili-help-content">
                        <h4>重命名视频（两种方式）</h4>
                        <ul>
                            <li><b>方式一：</b>鼠标悬停视频条目 → 右侧出现 <b>✎</b> 笔形按钮 → 点击进入编辑模式</li>
                            <li><b>方式二：</b>直接<b>双击</b>视频名文字进入编辑模式</li>
                            <li>编辑时按 <kbd>Enter</kbd> 保存 / 按 <kbd>Esc</kbd> 取消 / 点击其他区域自动保存</li>
                            <li>最多输入 50 个字符，支持 Emoji 和特殊符号</li>
                            <li>编辑过程中不会触发拖拽排序</li>
                        </ul>

                        <h4>移动视频到其他分类</h4>
                        <ul>
                            <li>鼠标悬停视频条目 → 出现 <b>↗</b> 移动按钮 → 点击</li>
                            <li>弹出分类选择面板（不显示当前所在分类），点击目标分类即可完成移动</li>
                            <li>如果移动的是正在播放的视频，播放状态会跟随到新分类（不会中断）</li>
                            <li>移动后视频会出现在目标分类的末尾</li>
                        </ul>

                        <h4>调整视频顺序</h4>
                        <ul>
                            <li><b>桌面端：</b>直接<b>拖拽</b>视频条目到目标位置（目标处出现蓝色指示线）</li>
                            <li><b>移动端：</b><b>长按</b>视频条目约 0.4 秒，进入拖拽模式后移动手指到目标位置释放</li>
                            <li>排序会影响上下集切换的顺序</li>
                            <li>排序操作实时保存，无需额外确认</li>
                        </ul>

                        <h4>删除视频</h4>
                        <ul>
                            <li>点击视频条目最右侧的 <b>×</b> 按钮</li>
                            <li>删除后<b>无法恢复</b>（不会二次确认）</li>
                            <li>如果删除的是正在播放的视频，播放会停止</li>
                            <li>建议重要视频先移动到备份分类再删除原条目</li>
                        </ul>
                    </div>
                </details>

                <!-- 悬浮球 -->
                <details class="bili-help-section">
                    <summary class="bili-help-title">🐱 猫耳悬浮球</summary>
                    <div class="bili-help-content">
                        <h4>进入悬浮球模式</h4>
                        <ul>
                            <li>点击主面板标题栏右侧的 <b>×</b> 关闭按钮</li>
                            <li>面板会缩成一个带猫耳的圆形悬浮球</li>
                            <li>视频 iframe 保持加载，不会中断（但不一定继续播放，取决于浏览器策略）</li>
                        </ul>

                        <h4>悬浮球操作</h4>
                        <ul>
                            <li><b>单击/轻触</b> → 恢复完整面板</li>
                            <li><b>拖拽</b> → 移动到屏幕任意位置（桌面和移动端均支持）</li>
                            <li><b>悬停</b> → 轻微放大动画（视觉反馈）</li>
                            <li>移动距离超过 10px 判定为拖拽，不会误触恢复面板</li>
                        </ul>

                        <h4>默认启动方式</h4>
                        <ul>
                            <li>插件默认以悬浮球模式启动（节省屏幕空间）</li>
                            <li>悬浮球位置在桌面端默认 左侧 40px、顶部 40%</li>
                            <li>移动端默认 左侧 15px、顶部 40%</li>
                            <li>每次拖拽后位置会自动保存，刷新页面后恢复</li>
                        </ul>

                        <h4>自定义悬浮球外观（在 ⚙ 设置中调整）</h4>
                        <p><b>🔘 尺寸：</b></p>
                        <ul>
                            <li>大（72×76px）/ 中（58×62px，推荐）/ 小（44×48px）</li>
                            <li>移动端「小」尺寸会额外缩小 0.85 倍</li>
                        </ul>
                        <p><b>🐱 头像（显示在中心圆圈内）：</b></p>
                        <ul>
                            <li>Emoji / 颜文字：输入任意 Emoji 或文字表情（如 🐾、⎚˕⎚）</li>
                            <li>图片 URL：输入网络图片地址</li>
                            <li>本地上传：从设备选择图片文件（建议 ≤ 2MB）</li>
                        </ul>
                        <p><b>🎀 外框（替代默认猫耳+圆圈边框）：</b></p>
                        <ul>
                            <li>上传自定义外框图片（支持 PNG / GIF / WebP 动图）</li>
                            <li>建议使用<b>中心透明、四周有图案</b>的 PNG 素材</li>
                            <li><b>外框大小：</b>30% ~ 200% 无级缩放</li>
                            <li><b>水平偏移：</b>-50px ~ +50px（微调外框位置）</li>
                            <li><b>垂直偏移：</b>-50px ~ +50px</li>
                            <li><b>外框层级：</b>「外框在前」（盖住头像边缘）或「外框在后」（头像完全在前）</li>
                            <li><b>隐藏外框：</b>勾选后只保留头像圆圈（用于对比测试新外框效果）</li>
                        </ul>
                        <p>设置面板中有<b>实时预览</b>区域，调整参数时可即时看到效果。</p>
                    </div>
                </details>

                <!-- 主题与外观 -->
                <details class="bili-help-section">
                    <summary class="bili-help-title">🎨 主题与外观设置</summary>
                    <div class="bili-help-content">
                        <p>点击标题栏的 <b>⚙</b> 按钮打开设置面板。</p>

                        <h4>🎨 10 套预设主题</h4>
                        <ul>
                            <li><b>亮色系：</b>🩷 樱花粉 / 🌼 嫩黄 / 🌿 淡绿 / 🌊 深海蓝 / 🌅 落日橘 / 💜 薰衣草</li>
                            <li><b>暗色系：</b>🕶️ 毛玻璃黑 / 🌸 夜樱 / ☕ 摩卡棕</li>
                            <li><b>透明系：</b>🪟 毛玻璃白</li>
                        </ul>
                        <p>选择主题后即时预览生效，点击「保存」确认。切换主题会同步更新标题栏 Emoji、悬浮球默认头像等。</p>

                        <h4>🖼️ 悬浮窗背景图片</h4>
                        <ul>
                            <li>支持上传图片作为面板背景，含 GIF / WebP <b>动图</b></li>
                            <li><b>背景模式（二选一）：</b></li>
                        </ul>
                        <ul>
                            <li>「🖼️ 作为背景」— 图片在面板底层，保留原有主题边框样式，适合纹理/壁纸</li>
                            <li>「🎀 替换边框」— 图片作为包边素材，原边框隐藏，适合四周有花纹的透明 PNG</li>
                        </ul>
                        <ul>
                            <li><b>填充方式：</b>覆盖（推荐，自动裁剪铺满）/ 包含（完整显示留白）/ 平铺（重复排列）/ 拉伸（变形铺满）</li>
                            <li><b>透明度：</b>0% ~ 100% 无级调节滑块</li>
                            <li>设置面板中有缩略图预览</li>
                            <li>建议图片大小控制在 <b>2-5MB</b> 以内</li>
                        </ul>

                        <h4>🎨 自定义配色</h4>
                        <ul>
                            <li>可单独调整 6 种颜色：主色、主色浅、主色深、辅色、面板背景、文字颜色</li>
                            <li>使用系统颜色选择器（点击色块弹出）</li>
                            <li>修改任一颜色后自动标记为「自定义配色」模式</li>
                            <li>点击<b>「↺ 重置配色」</b>清除自定义，恢复当前主题预设色</li>
                            <li>点击<b>「✨ 应用当前主题预设」</b>将选择器重置为当前主题默认值（方便微调）</li>
                        </ul>
                        <p><em>提示：部分暗色主题的颜色包含透明度（rgba），颜色选择器无法直接编辑透明度通道，建议使用纯色近似值。</em></p>
                    </div>
                </details>

                <!-- 数据管理 -->
                <details class="bili-help-section">
                    <summary class="bili-help-title">💾 数据保存与导入导出</summary>
                    <div class="bili-help-content">
                        <h4>自动保存机制</h4>
                        <ul>
                            <li>所有操作（添加/删除/排序/重命名/切换主题/拖拽等）都会<b>立即自动保存</b></li>
                            <li>双重保存策略：浏览器 <code>localStorage</code> + SillyTavern 扩展配置（<code>settings.json</code>）</li>
                            <li>刷新页面或重启酒馆后自动恢复所有状态</li>
                            <li>无需手动点「保存」（设置面板的保存按钮用于确认设置变更）</li>
                        </ul>

                        <h4>保存的内容包括</h4>
                        <ul>
                            <li>所有分类和视频列表（含排列顺序）</li>
                            <li>当前播放的视频和所属分类</li>
                            <li>面板位置、大小</li>
                            <li>主题、自定义配色、背景图片（Base64）</li>
                            <li>悬浮球外观设置（头像、外框、缩放、偏移等）</li>
                        </ul>
                        <h4>📤 导出播放列表</h4>
                        <ul>
                            <li>在设置面板底部点击<b>「📤 导出播放列表」</b></li>
                            <li>自动下载一个 JSON 文件（文件名示例：<code>BiliPlayer_backup_2025-07-11.json</code>）</li>
                            <li>包含所有分类名和视频数据（BV号 + 标题）</li>
                            <li>可用于备份或迁移到其他设备/浏览器</li>
                        </ul>
                        <h4>📥 导入播放列表</h4>
                        <ul>
                            <li>点击<b>「📥 导入播放列表」</b>，选择之前导出的 JSON 文件</li>
                            <li>导入采用<b>合并模式</b>：新分类和新视频会添加到现有列表中，不会覆盖已有数据</li>
                            <li>同一分类下相同 BV 号的视频不会重复导入</li>
                            <li>导入完成后会提示新增了多少个分类和视频</li>
                        </ul>

                        <h4>⚠️ 数据安全提醒</h4>
                        <ul>
                            <li>清除浏览器缓存/数据会丢失 localStorage 中的数据</li>
                            <li>建议定期使用导出功能备份（尤其是大量视频时）</li>
                            <li>上传的图片（背景/外框/头像）以 Base64 编码存储，大文件会增加配置体积</li>
                            <li>图片建议控制在 2-5MB 以内，避免影响保存和加载性能</li>
                            <li>SillyTavern 的 <code>public/settings.json</code> 中也有一份备份数据</li>
                        </ul>
                    </div>
                </details>

                <!-- 面板控制 -->
                <details class="bili-help-section">
                    <summary class="bili-help-title">⌨️ 面板控制与快捷操作</summary>
                    <div class="bili-help-content">
                        <h4>标题栏按钮（从左到右）</h4>
                        <ul>
                            <li><b>?</b> — 打开本使用说明弹窗</li>
                            <li><b>⚙</b> — 打开设置面板（主题/外观/数据管理）</li>
                            <li><b>_</b> — 折叠模式：隐藏列表区域，只保留标题栏+视频画面（再次点击 <b>▢</b> 恢复）</li>
                            <li><b>×</b> — 缩成猫耳悬浮球（点击悬浮球恢复面板）</li>
                        </ul>

                        <h4>面板操作</h4>
                        <ul>
                            <li><b>拖拽标题栏</b> → 移动面板到屏幕任意位置</li>
                            <li><b>拖拽右下角</b> → 调整面板大小（仅桌面端，移动端禁用防误触）</li>
                            <li>面板最小尺寸：290×240px</li>
                            <li>面板最大尺寸：1000×900px</li>
                            <li>面板位置和大小会自动保存，刷新后恢复</li>
                            <li>如果面板跑到屏幕外，刷新页面会自动复位到安全位置</li>
                        </ul>

                        <h4>SillyTavern 集成</h4>
                        <ul>
                            <li>扩展设置菜单（Extensions）顶部有 BiliPlayer 开关（运行中 / 已关闭）</li>
                            <li>关闭后完全隐藏面板和悬浮球，同时释放视频 iframe 资源</li>
                            <li>重新开启后恢复上次的播放状态和位置</li>
                            <li>支持斜杠命令 <code>/bili</code> 在对话框中快速开关播放器</li>
                        </ul>
                    </div>
                </details>

                <!-- 移动端适配 -->
                <details class="bili-help-section">
                    <summary class="bili-help-title">📱 移动端适配说明</summary>
                    <div class="bili-help-content">
                        <h4>自动适配特性</h4>
                        <ul>
                            <li>面板自动居中，宽度占屏幕 94%（最大 500px），高度占 82%（最大 700px）</li>
                            <li>所有按钮和输入框自动放大，适合手指操作（最小触摸区域 32px+）</li>
                            <li>禁用拖拽调整大小（防止与滚动操作冲突）</li>
                            <li>悬浮球默认位于屏幕左侧 15px 处</li>
                            <li>支持安全区域适配（刘海屏、底部横条、圆角屏幕）</li>
                        </ul>

                        <h4>触屏操作差异</h4>
                        <ul>
                            <li><b>视频排序：</b>长按视频条目约 <b>0.4 秒</b>后进入拖拽模式，移动手指到目标位置释放</li>
                            <li><b>分类排序：</b>长按分类标题约 <b>0.5 秒</b>进入拖拽（也可使用 ↑↓ 按钮更方便）</li>
                            <li><b>重命名：</b>虚拟键盘弹出时不会误触其他按钮（有延迟保护）</li>
                            <li><b>悬浮球：</b>轻触恢复面板；按住拖动超过 10px 视为拖拽移动位置</li>
                            <li><b>面板拖动：</b>按住标题栏滑动即可移动面板位置</li>
                        </ul>

                        <h4>浏览器兼容性</h4>
                        <ul>
                            <li>✅ iOS Safari 15+、Android Chrome 90+</li>
                            <li>✅ 微信内置浏览器、QQ 浏览器</li>
                            <li>✅ SillyTavern 移动端访问（手机/平板）</li>
                            <li>⚠️ 毛玻璃主题（glass-light / glass-dark）在部分旧系统上可能不生效（降级为半透明背景）</li>
                            <li>⚠️ 小尺寸悬浮球在移动端会额外缩小 0.85 倍（保证不遮挡内容）</li>
                        </ul>
                    </div>
                </details>

                <!-- 常见问题 -->
                <details class="bili-help-section">
                    <summary class="bili-help-title">❓ 常见问题 FAQ</summary>
                    <div class="bili-help-content">
                        <h4>Q: 为什么视频无法播放 / 黑屏？</h4>
                        <p>A: 播放器使用 B 站移动端嵌入地址，部分视频可能有版权限制或地区限制。尝试：① 刷新页面 ② 更换其他视频测试 ③ 确认 BV 号正确。</p>

                        <h4>Q: 粘贴链接后弹出的选分类面板是什么？</h4>
                        <p>A: 当你有多个分类时，插件需要知道你想把视频加到哪个分类。只有一个分类时不会弹出（直接添加）。</p>

                        <h4>Q: 纯 BV 号为什么不询问多P集数？</h4>
                        <p>A: 为了简化日常操作流程。如果需要批量添加多P合集，请使用完整视频链接格式（包含 bilibili.com）。</p>

                        <h4>Q: 批量添加后标题都是「BV号 - P1」格式，能改吗？</h4>
                        <p>A: 可以！两种方式：<br>
                        ① 添加时在链接后加空格+名字（如 <code>https://...BV1xxx 蜡笔小新</code>），自动生成「蜡笔小新 - P1」格式<br>
                        ② 添加后双击视频名逐个修改</p>

                        <h4>Q: 短链（b23.tv）展开失败怎么办？</h4>
                        <p>A: 受浏览器 CORS 安全策略限制，短链展开可能被拦截。建议在 B 站打开视频后复制浏览器地址栏中的完整链接。</p>

                        <h4>Q: 面板位置跑到屏幕外面了怎么办？</h4>
                        <p>A: 刷新页面即可。插件启动时会自动检测面板是否在可视区域内，超出时会自动复位。</p>

                        <h4>Q: 为什么移动端看不到调整大小的功能？</h4>
                        <p>A: 移动端禁用了 resize 功能（防止与滚动操作冲突），面板会自动适配屏幕尺寸。</p>

                        <h4>Q: 毛玻璃主题在某些浏览器不生效？</h4>
                        <p>A: 需要浏览器支持 <code>backdrop-filter</code> CSS 属性。iOS Safari 15+、Chrome 76+ 均支持。旧版浏览器建议使用实色主题。</p>

                        <h4>Q: 播放列表突然清空了？</h4>
                        <p>A: 可能是浏览器缓存被清理导致 localStorage 数据丢失。建议：① 定期导出备份 ② 检查 SillyTavern 的 <code>public/settings.json</code> 中是否有备份。</p>

                        <h4>Q: 上传的图片会占用很多空间吗？</h4>
                        <p>A: 图片以 Base64 编码存储在配置中。建议：背景图 ≤ 5MB、头像/外框 ≤ 2MB、避免超高分辨率（1920×1080 足够）。</p>

                        <h4>Q: 能否添加其他视频平台的视频？</h4>
                        <p>A: 目前仅支持 B 站视频（使用 B 站移动端嵌入播放器接口）。其他平台暂无计划支持。</p>

                        <h4>Q: 删除操作能撤销吗？</h4>
                        <p>A: 不能。删除分类和视频都是不可逆操作。建议重要内容先用导出功能备份，或移动到「备份」分类。</p>

                        <h4>Q: 拖拽排序不灵敏怎么办？</h4>
                        <p>A: 桌面端直接拖拽即可；移动端需要<b>长按</b> 0.4~0.5 秒后才进入拖拽模式。如仍不灵敏，使用「↑ ↓」按钮替代。</p>

                        <h4>Q: 番剧链接为什么不支持？</h4>
                        <p>A: B 站番剧（<code>/bangumi/play/</code>）的嵌入接口与普通视频不同，且版权限制更严格。建议在网页找到播放页的 BV 号后用 BV 号添加。</p>

                        <h4>Q: 为什么有些视频标题是 BV 号？</h4>
                        <p>A: 插件不会自动获取视频标题（避免频繁请求 B 站 API 触发风控）。建议添加时手动输入自定义名字（链接后加空格+名字），或添加后双击修改。</p>
                    </div>
                </details>

                <!-- 高级技巧 -->
                <details class="bili-help-section">
                    <summary class="bili-help-title">🎓 高级技巧与最佳实践</summary>
                    <div class="bili-help-content">
                        <h4>💡 视频管理技巧</h4>
                        <ul>
                            <li>创建「🎬 待看」分类作为临时收藏夹，看完后移动到对应分类或删除</li>
                            <li>使用 Emoji 前缀区分分类类型：📺 追番、🎥 电影、🎵 音乐MV、📚 学习</li>
                            <li>批量添加时可自定义起始集数，跳过已看过的部分（如从第 5 集开始）</li>
                            <li>重命名时加标记：「蜡笔小新 EP1 ✓」表示已看完</li>
                            <li>同一部番可以分多次添加：先加 1-12 集，看完后再加 13-24 集</li>
                        </ul>

                        <h4>🎨 美化技巧</h4>
                        <ul>
                            <li>悬浮球外框建议使用<b>透明 PNG</b>，中心留空给头像，四周有装饰图案</li>
                            <li>面板背景图「替换边框」模式适合<b>边框素材</b>（四周花纹、中间透明的 PNG）</li>
                            <li>面板背景图「作为背景」模式适合<b>纹理壁纸</b>（GIF 动图效果很棒）</li>
                            <li>暗色主题搭配暗色调背景图效果更协调，亮色主题同理</li>
                            <li>自定义配色时确保主色与背景色有足够对比度，保证文字可读性</li>
                            <li>外框缩放 + 偏移配合使用，可精确对齐不规则形状的外框素材</li>
                        </ul>

                        <h4>⚡ 效率技巧</h4>
                        <ul>
                            <li>在 SillyTavern 对话框中输入 <code>/bili</code> 可快速开关播放器</li>
                            <li>折叠模式 + 调小面板宽度 = 精简的小窗播放器（不干扰聊天）</li>
                            <li>移动端建议默认以悬浮球启动，需要操作时再点开</li>
                            <li>桌面端可以把面板拖到屏幕边缘角落，边聊天边看视频</li>
                            <li>如果经常在同一分类中切换视频，善用上下集按钮比点击列表更快</li>
                        </ul>

                        <h4>🔧 故障排查清单</h4>
                        <ul>
                            <li>视频加载慢 → 检查网络连接 / 刷新页面 / 确认 BV 号有效</li>
                            <li>设置不生效 → 确认点击了「保存」按钮 / 刷新页面</li>
                            <li>面板消失了 → 在 Extensions 设置菜单中重新开启 BiliPlayer 开关</li>
                            <li>数据丢失了 → 检查 SillyTavern 的 <code>public/settings.json</code></li>
                            <li>悬浮球不见了 → 可能拖到了屏幕边缘外，刷新页面恢复默认位置</li>
                            <li>外框图片不显示 → 确认图片格式正确（PNG/GIF/WebP）且大小 ≤ 5MB</li>
                        </ul>
                    </div>
                </details>

                <!-- 页脚 -->
                <div class="bili-help-footer">
                    <div class="bili-help-footer-content">
                        <p>🐾 BiliPlayer v2.0.0 · 让小主人看视频更开心~</p>
                        <p style="font-size:10px; opacity:0.8;">💖 特别鸣谢：本插件底层核心逻辑由 <b>老农民</b> 老师提供支持</p>
                        <p><a href="https://github.com/yangtfei204-hub/SillyTavern-BiliPlayer" target="_blank">📄 查看项目主页 & 完整文档</a></p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(helpDialogElement);

    helpDialogElement.querySelector('.bili-help-close').onclick = closeHelpDialog;
    helpDialogElement.querySelector('.bili-help-mask').onclick = closeHelpDialog;
}

function closeHelpDialog() {
    if (helpDialogElement) {
        helpDialogElement.remove();
        helpDialogElement = null;
    }
}


// 11. 设置弹窗
function openSettingsDialog() {
    if (document.getElementById('bili-ext-settings-dialog')) {
        closeSettingsDialog();
        return;
    }

    const isMobile = window.innerWidth <= 768;
    settingsDialogElement = document.createElement('div');
    settingsDialogElement.id = 'bili-ext-settings-dialog';
    settingsDialogElement.setAttribute('data-theme', state.settings.theme);
    if (isMobile) settingsDialogElement.classList.add('bili-settings-mobile');

    settingsDialogElement.innerHTML = `
        <div class="bili-settings-mask"></div>
        <div class="bili-settings-box">
            <div class="bili-settings-header">
                <span>⚙ BiliPlayer 设置</span>
                <button class="bili-settings-close" type="button">×</button>
            </div>
            <div class="bili-settings-body">
                <!-- 主题 -->
                <div class="bili-settings-section">
                    <div class="bili-settings-label">🎨 主题配色</div>
                    <div class="bili-theme-grid">
                        ${Object.entries(THEMES).map(([key, info]) => `
                            <label class="bili-theme-option" data-theme-key="${key}">
                                <input type="radio" name="bili-theme" value="${key}" ${state.settings.theme === key ? 'checked' : ''}>
                                <div class="bili-theme-preview bili-theme-preview-${key}"></div>
                                <span>${info.name}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <!-- ⭐ 悬浮窗背景替换（改名） -->
                <div class="bili-settings-section">
                    <div class="bili-settings-label">🖼️ 悬浮窗背景替换（支持动图 GIF/WebP）</div>
                    <div class="bili-border-image-controls">
                        <div class="bili-border-image-upload-wrap">
                            <input type="file" id="bili-border-image-upload" accept="image/*" style="display:none;">
                            <button id="bili-border-image-upload-btn" type="button" class="bili-action-btn-sm bili-action-btn-primary">
                                ${state.settings.borderImage ? '✓ 已设置（点击更换）' : '📁 选择背景图片'}
                            </button>
                            ${state.settings.borderImage ? `<button id="bili-border-image-clear-btn" type="button" class="bili-action-btn-sm bili-action-btn-warn">移除</button>` : ''}
                        </div>

                        <div class="bili-border-image-mode-wrap">
                            <label class="bili-settings-sub-label">背景模式：</label>
                            <select id="bili-border-image-mode" class="bili-settings-select">
                                <option value="background" ${state.settings.borderImageMode === 'background' ? 'selected' : ''}>
                                    🖼️ 作为背景（保留原边框）
                                </option>
                                <option value="replace" ${state.settings.borderImageMode === 'replace' ? 'selected' : ''}>
                                    🎀 替换边框（图片包边）
                                </option>
                            </select>
                        </div>

                        <div class="bili-border-image-mode-wrap">
                            <label class="bili-settings-sub-label">填充方式：</label>
                            <select id="bili-border-image-fit" class="bili-settings-select">
                                <option value="cover" ${state.settings.borderImageFit === 'cover' ? 'selected' : ''}>覆盖（推荐）</option>
                                <option value="contain" ${state.settings.borderImageFit === 'contain' ? 'selected' : ''}>包含</option>
                                <option value="repeat" ${state.settings.borderImageFit === 'repeat' ? 'selected' : ''}>平铺</option>
                                <option value="stretch" ${state.settings.borderImageFit === 'stretch' ? 'selected' : ''}>拉伸</option>
                            </select>
                        </div>

                        <div class="bili-border-image-opacity-wrap">
                            <label class="bili-settings-sub-label">透明度：<span id="bili-border-opacity-val">${Math.round(state.settings.borderImageOpacity * 100)}%</span></label>
                            <input type="range" id="bili-border-image-opacity" min="0" max="100" value="${Math.round(state.settings.borderImageOpacity * 100)}" class="bili-settings-range">
                        </div>

                        <div class="bili-border-image-preview" id="bili-border-image-preview">
                            ${state.settings.borderImage ? `<img src="${state.settings.borderImage}" alt="背景预览">` : '<span style="color:var(--kp-text-muted);font-size:11px;">未设置背景图片</span>'}
                        </div>

                        <div class="bili-border-image-tip">💡 提示：「替换边框」建议上传四周有图案、中心透明的 PNG；「作为背景」可上传任意纹理或动图</div>
                    </div>
                </div>

                <!-- ⭐ 自定义配色 -->
                <div class="bili-settings-section">
                    <div class="bili-settings-label">🎨 自定义配色 <span style="font-size:10px;color:var(--kp-text-muted);font-weight:normal;">（留空则使用上方选定的主题）</span></div>
                    <div class="bili-color-picker-grid">
                        <div class="bili-color-picker-item">
                            <label>主色</label>
                            <input type="color" id="bili-color-primary" value="${getColorValue('primary')}">
                        </div>
                        <div class="bili-color-picker-item">
                            <label>主色浅</label>
                            <input type="color" id="bili-color-primary-light" value="${getColorValue('primaryLight')}">
                        </div>
                        <div class="bili-color-picker-item">
                            <label>主色深</label>
                            <input type="color" id="bili-color-primary-deep" value="${getColorValue('primaryDeep')}">
                        </div>
                        <div class="bili-color-picker-item">
                            <label>辅色</label>
                            <input type="color" id="bili-color-secondary" value="${getColorValue('secondary')}">
                        </div>
                        <div class="bili-color-picker-item">
                            <label>面板背景</label>
                            <input type="color" id="bili-color-bg" value="${getColorValue('bg')}">
                        </div>
                        <div class="bili-color-picker-item">
                            <label>文字颜色</label>
                            <input type="color" id="bili-color-text" value="${getColorValue('text')}">
                        </div>
                    </div>
                    <div class="bili-color-actions">
                        <button id="bili-color-reset" type="button" class="bili-action-btn-sm bili-action-btn-warn">↺ 重置配色</button>
                        <button id="bili-color-apply-preset" type="button" class="bili-action-btn-sm bili-action-btn-primary">✨ 应用当前主题预设</button>
                    </div>
                </div>

                <!-- 悬浮球大小 -->
                <div class="bili-settings-section">
                    <div class="bili-settings-label">🔘 悬浮球尺寸</div>
                    <div class="bili-size-options">
                        <label class="bili-size-option">
                            <input type="radio" name="bili-badge-size" value="large" ${state.settings.badgeSize === 'large' ? 'checked' : ''}>
                            <span>大（72px）</span>
                        </label>
                        <label class="bili-size-option">
                            <input type="radio" name="bili-badge-size" value="medium" ${state.settings.badgeSize === 'medium' ? 'checked' : ''}>
                            <span>中（58px）</span>
                        </label>
                        <label class="bili-size-option">
                            <input type="radio" name="bili-badge-size" value="small" ${state.settings.badgeSize === 'small' ? 'checked' : ''}>
                            <span>小（44px）</span>
                        </label>
                    </div>
                </div>

                <!-- ⭐⭐⭐ 悬浮球外框（升级版，支持动图） -->
                <div class="bili-settings-section">
                    <div class="bili-settings-label">🎀 悬浮球外框（猫耳边框装饰）</div>
                    <div class="bili-border-image-controls">
                        <div class="bili-border-image-upload-wrap">
                            <input type="file" id="bili-badge-border-upload" accept="image/*" style="display:none;">
                            <button id="bili-badge-border-upload-btn" type="button" class="bili-action-btn-sm bili-action-btn-primary">
                                ${state.settings.badgeBorderImage ? '✓ 已设置（点击更换）' : '📁 选择外框图片'}
                            </button>
                            ${state.settings.badgeBorderImage ? `<button id="bili-badge-border-clear-btn" type="button" class="bili-action-btn-sm bili-action-btn-warn">移除</button>` : ''}
                        </div>

                        <div class="bili-border-image-mode-wrap">
                            <label class="bili-settings-sub-label" style="display:flex;align-items:center;gap:6px;">
                                <input type="checkbox" id="bili-badge-border-hide" ${state.settings.hideBadgeBorder ? 'checked' : ''}>
                                <span>隐藏外框（仅显示头像，方便测试新外框）</span>
                            </label>
                        </div>

                        <!-- ⭐ 新增：层级控制 -->
                        <div class="bili-border-image-mode-wrap">
                            <label class="bili-settings-sub-label">外框层级：</label>
                            <select id="bili-badge-border-zindex" class="bili-settings-select">
                                <option value="above" ${(state.settings.badgeBorderZIndex || 'above') === 'above' ? 'selected' : ''}>
                                    🎀 外框在前（盖住头像）
                                </option>
                                <option value="below" ${state.settings.badgeBorderZIndex === 'below' ? 'selected' : ''}>
                                    🖼️ 外框在后（头像在前）
                                </option>
                            </select>
                        </div>

                        <!-- ⭐ 新增：缩放控制 -->
                        <div class="bili-border-image-opacity-wrap">
                            <label class="bili-settings-sub-label">外框大小：<span id="bili-badge-border-scale-val">${state.settings.badgeBorderScale || 100}%</span></label>
                            <input type="range" id="bili-badge-border-scale" min="30" max="200" value="${state.settings.badgeBorderScale || 100}" class="bili-settings-range">
                        </div>

                        <!-- ⭐ 新增：水平偏移 -->
                        <div class="bili-border-image-opacity-wrap">
                            <label class="bili-settings-sub-label">水平偏移：<span id="bili-badge-border-x-val">${state.settings.badgeBorderOffsetX || 0}px</span></label>
                            <input type="range" id="bili-badge-border-x" min="-50" max="50" value="${state.settings.badgeBorderOffsetX || 0}" class="bili-settings-range">
                        </div>

                        <!-- ⭐ 新增：垂直偏移 -->
                        <div class="bili-border-image-opacity-wrap">
                            <label class="bili-settings-sub-label">垂直偏移：<span id="bili-badge-border-y-val">${state.settings.badgeBorderOffsetY || 0}px</span></label>
                            <input type="range" id="bili-badge-border-y" min="-50" max="50" value="${state.settings.badgeBorderOffsetY || 0}" class="bili-settings-range">
                        </div>

                        <!-- ⭐ 升级：实时预览（外框+头像） -->
                        <div class="bili-badge-preview-wrapper" id="bili-badge-preview-wrapper">
                            <span style="font-size:11px;color:var(--kp-text-muted);margin-bottom:4px;">实时预览（外框+头像）：</span>
                            <div class="bili-badge-preview-container" id="bili-badge-preview-container">
                                <!-- 动态生成预览 -->
                            </div>
                        </div>

                        <div class="bili-border-image-tip">💡 提示：上传的图片会替换默认的猫耳+圆圈边框。<b>支持动图 GIF/WebP</b>，建议上传透明 PNG，中心留空放头像</div>
                    </div>
                </div>

                <!-- 头像 -->
                <div class="bili-settings-section">
                    <div class="bili-settings-label">🐱 悬浮球头像（显示在外框中心）</div>
                    <div class="bili-avatar-type">
                        <label>
                            <input type="radio" name="bili-avatar-type" value="emoji" ${state.settings.avatarType === 'emoji' ? 'checked' : ''}>
                            <span>颜文字/Emoji</span>
                        </label>
                        <label>
                            <input type="radio" name="bili-avatar-type" value="url" ${state.settings.avatarType === 'url' ? 'checked' : ''}>
                            <span>图片 URL</span>
                        </label>
                        <label>
                            <input type="radio" name="bili-avatar-type" value="upload" ${state.settings.avatarType === 'upload' ? 'checked' : ''}>
                            <span>上传图片</span>
                        </label>
                    </div>
                    <div class="bili-avatar-input-wrap">
                        <input type="text" id="bili-avatar-emoji" class="bili-avatar-input" 
                               placeholder="输入颜文字，如 ⎚˕⎚ 或 🐱" 
                               value="${state.settings.avatarType === 'emoji' ? state.settings.avatarValue : ''}" 
                               style="display:${state.settings.avatarType === 'emoji' ? 'block' : 'none'}">
                        <input type="text" id="bili-avatar-url" class="bili-avatar-input" 
                               placeholder="输入图片 URL，如 https://..." 
                               value="${state.settings.avatarType === 'url' ? state.settings.avatarValue : ''}" 
                               style="display:${state.settings.avatarType === 'url' ? 'block' : 'none'}">
                        <div class="bili-avatar-upload-wrap" style="display:${state.settings.avatarType === 'upload' ? 'block' : 'none'}">
                            <input type="file" id="bili-avatar-upload" accept="image/*" class="bili-avatar-input" style="display:none;">
                            <button id="bili-avatar-upload-preview" type="button" class="bili-action-btn-sm">
                                ${state.settings.avatarType === 'upload' && state.settings.avatarValue ? '✓ 已上传（点击重新选择）' : '点击上传图片'}
                            </button>
                        </div>
                    </div>
                    <div class="bili-avatar-preview" id="bili-avatar-preview">
                        <span style="font-size:11px;color:var(--kp-text-muted);">头像预览 →</span>
                        <div class="bili-avatar-preview-badge"></div>
                    </div>
                </div>

                <!-- 导出/导入 -->
                <div class="bili-settings-section">
                    <div class="bili-settings-label">💾 数据导出/导入</div>
                    <div class="bili-border-image-controls">
                        <div class="bili-border-image-upload-wrap">
                            <button id="bili-export-btn" type="button" class="bili-action-btn-sm bili-action-btn-primary">📤 导出播放列表</button>
                            <button id="bili-import-file-btn" type="button" class="bili-action-btn-sm bili-action-btn-warn">📥 导入播放列表</button>
                            <input type="file" id="bili-import-file-input" accept=".json" style="display:none;">
                        </div>
                        <div class="bili-border-image-tip">💡 导出为 JSON 文件，可跨设备迁移。导入时会合并到现有列表（不会覆盖）</div>
                    </div>
                </div>

                <!-- 操作按钮 -->
                <div class="bili-settings-actions">
                    <button id="bili-settings-reset" type="button" class="bili-action-btn-sm bili-action-btn-warn">恢复默认</button>
                    <button id="bili-settings-save" type="button" class="bili-action-btn-sm bili-action-btn-primary">保存</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(settingsDialogElement);

    setupSettingsEvents();
    updateAvatarPreview();
    updateBadgePreview();  // ⭐ 新增：初始化外框预览
}


function getColorValue(key) {
    const colors = state.settings.customColors || THEME_COLORS[state.settings.theme] || THEME_COLORS.pink;
    let val = colors[key] || '';
    if (val.startsWith('rgba') || val.startsWith('rgb(')) {
        return THEME_COLORS.pink[key] || '#ffffff';
    }
    return val || '#ffffff';
}

function setupSettingsEvents() {
    const dialog = settingsDialogElement;
    
    dialog.querySelector('.bili-settings-close').onclick = closeSettingsDialog;
    dialog.querySelector('.bili-settings-mask').onclick = closeSettingsDialog;
    
    dialog.querySelectorAll('input[name="bili-theme"]').forEach(radio => {
        radio.onchange = (e) => {
            const newTheme = e.target.value;
            dialog.setAttribute('data-theme', newTheme);
            
            // ⭐ 实时预览：应用新主题颜色
            if (!state.settings.customColors) {
                const colors = THEME_COLORS[newTheme] || THEME_COLORS.pink;
                const root = document.documentElement;
            
                if (colors.primary) root.style.setProperty('--kp-primary', colors.primary);
                if (colors.primaryLight) root.style.setProperty('--kp-primary-light', colors.primaryLight);
                if (colors.primaryDeep) root.style.setProperty('--kp-primary-deep', colors.primaryDeep);
                if (colors.secondary) root.style.setProperty('--kp-secondary', colors.secondary);
                if (colors.bg) root.style.setProperty('--kp-bg', colors.bg);
                if (colors.bgSoft) root.style.setProperty('--kp-bg-soft', colors.bgSoft);
                if (colors.text) root.style.setProperty('--kp-text', colors.text);
                if (colors.textMuted) root.style.setProperty('--kp-text-muted', colors.textMuted);
                if (colors.border) root.style.setProperty('--kp-border', colors.border);
                if (colors.actionPrimary) root.style.setProperty('--kp-action-primary', colors.actionPrimary);
                if (colors.actionPrimaryText) root.style.setProperty('--kp-action-primary-text', colors.actionPrimaryText);
                if (colors.actionSecondary) root.style.setProperty('--kp-action-secondary', colors.actionSecondary);
                if (colors.actionSecondaryText) root.style.setProperty('--kp-action-secondary-text', colors.actionSecondaryText);
                if (colors.shadow) root.style.setProperty('--kp-shadow', `0 12px 35px ${colors.shadow}`);
            
                root.setAttribute('data-bili-theme', newTheme);
                refreshColorInputs(newTheme);
            }
        };
    });

    
    const borderFileInput = dialog.querySelector('#bili-border-image-upload');
    const borderUploadBtn = dialog.querySelector('#bili-border-image-upload-btn');
    const borderClearBtn = dialog.querySelector('#bili-border-image-clear-btn');
    
    if (borderUploadBtn) {
        borderUploadBtn.onclick = () => borderFileInput.click();
    }
    if (borderClearBtn) {
        borderClearBtn.onclick = () => {
            state.settings.borderImage = '';
            closeSettingsDialog();
            openSettingsDialog();
        };
    }
    if (borderFileInput) {
        borderFileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) {
                alert('图片太大啦！请选择 5MB 以内的图片（动图文件较大是正常的）');
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
                state.settings.borderImage = ev.target.result;
                closeSettingsDialog();
                openSettingsDialog();
            };
            reader.readAsDataURL(file);
        };
    }
    
    const borderModeSelect = dialog.querySelector('#bili-border-image-mode');
    if (borderModeSelect) {
        borderModeSelect.onchange = (e) => {
            state.settings.borderImageMode = e.target.value;
        };
    }
    
    const borderFitSelect = dialog.querySelector('#bili-border-image-fit');
    if (borderFitSelect) {
        borderFitSelect.onchange = (e) => {
            state.settings.borderImageFit = e.target.value;
        };
    }
    
    const borderOpacity = dialog.querySelector('#bili-border-image-opacity');
    const borderOpacityVal = dialog.querySelector('#bili-border-opacity-val');
    if (borderOpacity) {
        borderOpacity.oninput = (e) => {
            const v = parseInt(e.target.value);
            state.settings.borderImageOpacity = v / 100;
            if (borderOpacityVal) borderOpacityVal.textContent = v + '%';
        };
    }
    
    const colorInputs = [
        'primary', 'primary-light', 'primary-deep',
        'secondary', 'bg', 'text'
    ];
    colorInputs.forEach(key => {
        const input = dialog.querySelector(`#bili-color-${key}`);
        if (input) {
            input.oninput = (e) => {
                const cssVar = '--kp-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
                document.documentElement.style.setProperty(cssVar, e.target.value);
            };
        }
    });
    
    const colorResetBtn = dialog.querySelector('#bili-color-reset');
    if (colorResetBtn) {
        colorResetBtn.onclick = () => {
            state.settings.customColors = null;
            refreshColorInputs(state.settings.theme);
            applyTheme();
        };
    }
    
    const applyPresetBtn = dialog.querySelector('#bili-color-apply-preset');
    if (applyPresetBtn) {
        applyPresetBtn.onclick = () => {
            state.settings.customColors = null;
            refreshColorInputs(state.settings.theme);
            applyTheme();
        };
    }
    
    // ⭐ 悬浮球外框图片上传
    const badgeBorderFileInput = dialog.querySelector('#bili-badge-border-upload');
    const badgeBorderUploadBtn = dialog.querySelector('#bili-badge-border-upload-btn');
    const badgeBorderClearBtn = dialog.querySelector('#bili-badge-border-clear-btn');
    
    if (badgeBorderUploadBtn) {
        badgeBorderUploadBtn.onclick = () => badgeBorderFileInput.click();
    }
    if (badgeBorderClearBtn) {
        badgeBorderClearBtn.onclick = () => {
            state.settings.badgeBorderImage = '';
            closeSettingsDialog();
            openSettingsDialog();
        };
    }
    if (badgeBorderFileInput) {
        badgeBorderFileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) {
                alert('图片太大啦！请选择 5MB 以内的图片');
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
                state.settings.badgeBorderImage = ev.target.result;
                closeSettingsDialog();
                openSettingsDialog();
            };
            reader.readAsDataURL(file);
        };
    }
    
    // ⭐ 隐藏外框开关
    const hideBorderCheckbox = dialog.querySelector('#bili-badge-border-hide');
    if (hideBorderCheckbox) {
        hideBorderCheckbox.onchange = (e) => {
            state.settings.hideBadgeBorder = e.target.checked;
            if (floatBadgeElement) applyBadgeBorder();
            updateBadgePreview();
        };
    }

    // ⭐ 层级控制
    const zIndexSelect = dialog.querySelector('#bili-badge-border-zindex');
    if (zIndexSelect) {
        zIndexSelect.onchange = (e) => {
            state.settings.badgeBorderZIndex = e.target.value;
            if (floatBadgeElement) applyBadgeBorder();
            updateBadgePreview();
        };
    }

    // ⭐ 缩放控制
    const scaleRange = dialog.querySelector('#bili-badge-border-scale');
    const scaleVal = dialog.querySelector('#bili-badge-border-scale-val');
    if (scaleRange) {
        scaleRange.oninput = (e) => {
            const v = parseInt(e.target.value);
            state.settings.badgeBorderScale = v;
            if (scaleVal) scaleVal.textContent = v + '%';
            if (floatBadgeElement) applyBadgeBorder();
            updateBadgePreview();
        };
    }

    // ⭐ 水平偏移
    const xRange = dialog.querySelector('#bili-badge-border-x');
    const xVal = dialog.querySelector('#bili-badge-border-x-val');
    if (xRange) {
        xRange.oninput = (e) => {
            const v = parseInt(e.target.value);
            state.settings.badgeBorderOffsetX = v;
            if (xVal) xVal.textContent = v + 'px';
            if (floatBadgeElement) applyBadgeBorder();
            updateBadgePreview();
        };
    }

    // ⭐ 垂直偏移
    const yRange = dialog.querySelector('#bili-badge-border-y');
    const yVal = dialog.querySelector('#bili-badge-border-y-val');
    if (yRange) {
        yRange.oninput = (e) => {
            const v = parseInt(e.target.value);
            state.settings.badgeBorderOffsetY = v;
            if (yVal) yVal.textContent = v + 'px';
            if (floatBadgeElement) applyBadgeBorder();
            updateBadgePreview();
        };
    }

    // ⭐ 悬浮球尺寸切换时更新预览
    dialog.querySelectorAll('input[name="bili-badge-size"]').forEach(radio => {
        radio.onchange = (e) => {
            const tempSize = state.settings.badgeSize;
            state.settings.badgeSize = e.target.value;
            updateBadgePreview();
            state.settings.badgeSize = tempSize;
        };
    });

    
    dialog.querySelectorAll('input[name="bili-avatar-type"]').forEach(radio => {
        radio.onchange = (e) => {
            const type = e.target.value;
            dialog.querySelector('#bili-avatar-emoji').style.display = type === 'emoji' ? 'block' : 'none';
            dialog.querySelector('#bili-avatar-url').style.display = type === 'url' ? 'block' : 'none';
            dialog.querySelector('.bili-avatar-upload-wrap').style.display = type === 'upload' ? 'block' : 'none';
            updateAvatarPreview();
        };
    });
    
    ['#bili-avatar-emoji', '#bili-avatar-url'].forEach(sel => {
        const el = dialog.querySelector(sel);
        if (el) el.addEventListener('input', updateAvatarPreview);
    });
    
    const fileInput = dialog.querySelector('#bili-avatar-upload');
    const uploadBtn = dialog.querySelector('#bili-avatar-upload-preview');
    
    uploadBtn.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert('图片太大啦！请选择 2MB 以内的图片');
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
            state.settings.avatarValue = ev.target.result;
            uploadBtn.textContent = '✓ 已上传（点击重新选择）';
            updateAvatarPreview();
        };
        reader.readAsDataURL(file);
    };

    // ⭐ 导出播放列表
    dialog.querySelector('#bili-export-btn').onclick = () => {
        const exportData = {
            version: '2.1.0',
            exportTime: new Date().toISOString(),
            playlistData: state.playlistData
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BiliPlayer_backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('📤 导出成功！');
    };

    // ⭐ 导入播放列表
    const importFileInput = dialog.querySelector('#bili-import-file-input');
    dialog.querySelector('#bili-import-file-btn').onclick = () => importFileInput.click();
    importFileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const imported = JSON.parse(ev.target.result);
                const data = imported.playlistData || imported;
                if (typeof data !== 'object' || Array.isArray(data)) {
                    alert('文件格式不正确哦~');
                    return;
                }
                let addedGroups = 0;
                let addedVideos = 0;
                Object.entries(data).forEach(([groupName, videos]) => {
                    if (!Array.isArray(videos)) return;
                    if (!state.playlistData[groupName]) {
                        state.playlistData[groupName] = [];
                        addedGroups++;
                    }
                    videos.forEach(v => {
                        if (v.bvid && !state.playlistData[groupName].some(existing => existing.bvid === v.bvid)) {
                            state.playlistData[groupName].push({ bvid: v.bvid, title: v.title || v.bvid });
                            addedVideos++;
                        }
                    });
                });
                renderGroups();
                saveExtensionSettings();
                showToast(`📥 导入成功！新增 ${addedGroups} 个分类，${addedVideos} 个视频`);
            } catch (err) {
                alert('导入失败：文件解析出错\n' + err.message);
            }
        };
        reader.readAsText(file);
        importFileInput.value = '';
    };

    dialog.querySelector('#bili-settings-reset').onclick = () => {
        if (!confirm('确定要恢复所有设置为默认值吗？播放列表不会受影响~')) return;
        
        state.settings.theme = DEFAULT_SETTINGS.theme;
        state.settings.badgeSize = DEFAULT_SETTINGS.badgeSize;
        state.settings.avatarType = DEFAULT_SETTINGS.avatarType;
        state.settings.borderImage = DEFAULT_SETTINGS.borderImage;
        state.settings.borderImageMode = DEFAULT_SETTINGS.borderImageMode;
        state.settings.borderImageFit = DEFAULT_SETTINGS.borderImageFit;
        state.settings.borderImageOpacity = DEFAULT_SETTINGS.borderImageOpacity;
        state.settings.customColors = DEFAULT_SETTINGS.customColors;
        state.settings.badgeBorderImage = DEFAULT_SETTINGS.badgeBorderImage;
        state.settings.hideBadgeBorder = DEFAULT_SETTINGS.hideBadgeBorder;
        state.settings.badgeBorderZIndex = DEFAULT_SETTINGS.badgeBorderZIndex;
        state.settings.badgeBorderScale = DEFAULT_SETTINGS.badgeBorderScale;
        state.settings.badgeBorderOffsetX = DEFAULT_SETTINGS.badgeBorderOffsetX;
        state.settings.badgeBorderOffsetY = DEFAULT_SETTINGS.badgeBorderOffsetY;
        
        closeSettingsDialog();
        openSettingsDialog();
        applyTheme();
        if (floatBadgeElement) {
            floatBadgeElement.setAttribute('data-size', state.settings.badgeSize);
            updateBadgeAvatar();
            applyBadgeBorder();
        }
        saveExtensionSettings();
    };
    
    dialog.querySelector('#bili-settings-save').onclick = () => {
        const theme = dialog.querySelector('input[name="bili-theme"]:checked').value;
        const badgeSize = dialog.querySelector('input[name="bili-badge-size"]:checked').value;
        const avatarType = dialog.querySelector('input[name="bili-avatar-type"]:checked').value;
        
        let avatarValue = '';
        if (avatarType === 'emoji') {
            avatarValue = dialog.querySelector('#bili-avatar-emoji').value.trim() || THEMES[theme].emoji;
        } else if (avatarType === 'url') {
            avatarValue = dialog.querySelector('#bili-avatar-url').value.trim();
            if (!avatarValue) {
                alert('请输入图片 URL');
                return;
            }
        } else if (avatarType === 'upload') {
            avatarValue = state.settings.avatarValue || '';
            if (!avatarValue) {
                alert('请先上传图片');
                return;
            }
        }
        
        const customColorsRaw = {
            primary: dialog.querySelector('#bili-color-primary').value,
            primaryLight: dialog.querySelector('#bili-color-primary-light').value,
            primaryDeep: dialog.querySelector('#bili-color-primary-deep').value,
            secondary: dialog.querySelector('#bili-color-secondary').value,
            bg: dialog.querySelector('#bili-color-bg').value,
            text: dialog.querySelector('#bili-color-text').value,
        };
        const themeColors = THEME_COLORS[theme];
        let isCustom = false;
        for (const key of Object.keys(customColorsRaw)) {
            const themeVal = (themeColors[key] || '').toLowerCase();
            const customVal = customColorsRaw[key].toLowerCase();
            if (themeVal.startsWith('rgba') || themeVal.startsWith('rgb(')) {
                isCustom = true;
                break;
            }
            if (customVal !== themeVal) {
                isCustom = true;
                break;
            }
        }
        
        state.settings.theme = theme;
        state.settings.badgeSize = badgeSize;
        state.settings.avatarType = avatarType;
        state.settings.avatarValue = avatarValue;
        state.settings.customColors = isCustom ? customColorsRaw : null;
        
        applyTheme();
        if (floatBadgeElement) {
            floatBadgeElement.setAttribute('data-size', badgeSize);
            updateBadgeAvatar();
            applyBadgeBorder();
        }
        
        saveExtensionSettings();
        closeSettingsDialog();
    };
}




function refreshColorInputs(themeKey) {
    if (!settingsDialogElement) return;
    const colors = THEME_COLORS[themeKey] || THEME_COLORS.pink;
    const mapping = {
        'primary': colors.primary,
        'primary-light': colors.primaryLight,
        'primary-deep': colors.primaryDeep,
        'secondary': colors.secondary,
        'bg': colors.bg,
        'text': colors.text
    };
    Object.entries(mapping).forEach(([key, val]) => {
        const input = settingsDialogElement.querySelector(`#bili-color-${key}`);
        if (input && val && !val.startsWith('rgba') && !val.startsWith('rgb(')) {
            input.value = val;
        }
    });
}

function closeSettingsDialog() {
    if (settingsDialogElement) {
        settingsDialogElement.remove();
        settingsDialogElement = null;
    }
}

function updateAvatarPreview() {
    if (!settingsDialogElement) return;
    const previewEl = settingsDialogElement.querySelector('.bili-avatar-preview-badge');
    if (!previewEl) return;
    
    const type = settingsDialogElement.querySelector('input[name="bili-avatar-type"]:checked').value;
    let value = '';
    
    if (type === 'emoji') {
        value = settingsDialogElement.querySelector('#bili-avatar-emoji').value.trim();
        if (!value) value = THEMES[state.settings.theme].emoji;
        previewEl.innerHTML = `<div class="bili-badge-text-face" style="font-size:20px;">${value}</div>`;
    } else if (type === 'url') {
        value = settingsDialogElement.querySelector('#bili-avatar-url').value.trim();
        if (value) {
            previewEl.innerHTML = `<img src="${value}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.style.display='none'">`;
        } else {
            previewEl.innerHTML = '';
        }
    } else if (type === 'upload') {
        if (state.settings.avatarValue) {
            previewEl.innerHTML = `<img src="${state.settings.avatarValue}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        } else {
            previewEl.innerHTML = '';
        }
    }
}

// ⭐ 新增：悬浮球外框+头像实时预览
// ⭐ 新增：悬浮球外框+头像实时预览（修复移动端偏移）
function updateBadgePreview() {
    if (!settingsDialogElement) return;
    const container = settingsDialogElement.querySelector('#bili-badge-preview-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // ⭐ 根据当前设置的悬浮球尺寸预览
    const currentSize = state.settings.badgeSize || 'medium';
    const dimensions = BADGE_DIMENSIONS[currentSize];
    
    // ⭐ 判断是否移动端（small 尺寸在移动端会缩小 0.85）
    const isMobile = window.innerWidth <= 768;
    const isMobileSmall = isMobile && currentSize === 'small';
    
    // 创建对应尺寸的悬浮球预览
    const preview = document.createElement('div');
    preview.className = 'bili-badge-preview-mini';
    preview.style.cssText = `
        position: relative;
        width: ${dimensions.w}px;
        height: ${dimensions.h}px;
        margin: 0 auto;
        ${isMobileSmall ? 'transform: scale(0.85);' : ''}
    `;
    
    // 外框层
    const borderWrapper = document.createElement('div');
    borderWrapper.style.cssText = `
        position: absolute;
        inset: 0;
        pointer-events: none;
    `;
    
    const zIndex = state.settings.badgeBorderZIndex || 'above';
    borderWrapper.style.zIndex = zIndex === 'above' ? '3' : '1';
    
    if (state.settings.badgeBorderImage && !state.settings.hideBadgeBorder) {
        const borderImg = document.createElement('img');
        borderImg.src = state.settings.badgeBorderImage;
        borderImg.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: contain;
        `;
        
        const scale = (state.settings.badgeBorderScale || 100) / 100;
        const offsetX = state.settings.badgeBorderOffsetX || 0;
        const offsetY = state.settings.badgeBorderOffsetY || 0;
        borderImg.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
        
        borderWrapper.appendChild(borderImg);
    } else if (!state.settings.hideBadgeBorder) {
        // ⭐ 根据尺寸显示对应大小的默认猫耳
        let earWidth, earHeight, earBorder, earTop, earLeftPos, earRightPos;
        
        if (currentSize === 'large') {
            earWidth = 22; earHeight = 20; earBorder = 3.5; earTop = 4; 
            earLeftPos = 6; earRightPos = 6;
        } else if (currentSize === 'small') {
            earWidth = 14; earHeight = 12; earBorder = 2.5; earTop = 2;
            earLeftPos = 4; earRightPos = 4;
        } else { // medium
            earWidth = 18; earHeight = 16; earBorder = 3; earTop = 3;
            earLeftPos = 5; earRightPos = 5;
        }
        
        const earLeft = document.createElement('div');
        earLeft.style.cssText = `
            position: absolute;
            width: ${earWidth}px; height: ${earHeight}px;
            background: var(--kp-primary-deep);
            border: ${earBorder}px solid var(--kp-bg);
            border-radius: 10px 10px 0 0;
            top: ${earTop}px; left: ${earLeftPos}px;
            transform: rotate(-30deg);
            transform-origin: bottom center;
        `;
        const earRight = document.createElement('div');
        earRight.style.cssText = earLeft.style.cssText;
        earRight.style.left = 'auto';
        earRight.style.right = earRightPos + 'px';
        earRight.style.transform = 'rotate(30deg)';
        
        borderWrapper.appendChild(earLeft);
        borderWrapper.appendChild(earRight);
    }
    
    preview.appendChild(borderWrapper);
    
    // ⭐ 头像层（根据尺寸调整）
    const currentSizeConfig = {
        large: { circle: 64, left: 4, border: 4.5, fontSize: 16 },
        medium: { circle: 52, left: 3, border: 4, fontSize: 14 },
        small: { circle: 40, left: 2, border: 3, fontSize: 12 }
    };
    const sizeConfig = currentSizeConfig[currentSize];
    
    const circle = document.createElement('div');
    circle.style.cssText = `
        position: absolute;
        bottom: 0;
        left: ${sizeConfig.left}px;
        width: ${sizeConfig.circle}px;
        height: ${sizeConfig.circle}px;
        background: var(--kp-bg);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        z-index: 2;
    `;
    
    if (!state.settings.hideBadgeBorder && !state.settings.badgeBorderImage) {
        circle.style.border = `${sizeConfig.border}px solid var(--kp-primary-deep)`;
    }
    
    // 头像内容
    const type = settingsDialogElement.querySelector('input[name="bili-avatar-type"]:checked')?.value || 'emoji';
    
    if (type === 'emoji') {
        const emoji = settingsDialogElement.querySelector('#bili-avatar-emoji')?.value.trim() || THEMES[state.settings.theme].emoji;
        circle.innerHTML = `<div style="font-size:${sizeConfig.fontSize}px;font-weight:bold;color:var(--kp-primary-deep);">${emoji}</div>`;
    } else if (type === 'url') {
        const url = settingsDialogElement.querySelector('#bili-avatar-url')?.value.trim();
        if (url) {
            circle.innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'">`;
        }
    } else if (type === 'upload') {
        if (state.settings.avatarValue) {
            circle.innerHTML = `<img src="${state.settings.avatarValue}" style="width:100%;height:100%;object-fit:cover;">`;
        }
    }
    
    preview.appendChild(circle);
    container.appendChild(preview);
}




function refreshSettingsUI() {
    if (!settingsDialogElement) return;
    const dialog = settingsDialogElement;
    dialog.setAttribute('data-theme', state.settings.theme);
    
    const themeRadio = dialog.querySelector(`input[name="bili-theme"][value="${state.settings.theme}"]`);
    if (themeRadio) themeRadio.checked = true;
    
    const sizeRadio = dialog.querySelector(`input[name="bili-badge-size"][value="${state.settings.badgeSize}"]`);
    if (sizeRadio) sizeRadio.checked = true;
    
    const typeRadio = dialog.querySelector(`input[name="bili-avatar-type"][value="${state.settings.avatarType}"]`);
    if (typeRadio) typeRadio.checked = true;
}

// 12. 交互功能

/**
 * ⭐ 解析各种 B 站输入格式
 * 支持：纯 BV号、完整 URL、带分P、带追踪参数、番剧链接、短链
 */
function parseBilibiliInput(input) {
    if (!input) return null;
    
    // ⭐ 情况 1：完整 URL（宽容匹配，允许前面有任意字符）
    const videoUrlMatch = input.match(/(?:https?:\/\/)?(?:www\.)?bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/i);
    if (videoUrlMatch) {
        const bvid = videoUrlMatch[1];
        const pageNum = extractPageFromUrl(input);
        return { 
            bvid, 
            pageNum, 
            sourceTitle: null, 
            needFetchTitle: true, 
            needFetchPages: true  // ⭐ 完整链接才询问多P
        };
    }
    
    // ⭐ 情况 2：纯 BV 号（只有当输入"几乎只有 BV 号"时才触发）
    // 修改判断：如果有 bilibili.com 就不走这里
    if (!input.includes('bilibili.com')) {
        const bvMatch = input.match(/(BV[a-zA-Z0-9]+)/);
        if (bvMatch) {
            let bvid = bvMatch[1];
            let pageNum = null;
            if (input.includes('p=')) {
                const pParts = input.split('p=');
                if (pParts[1]) {
                    const numMatch = pParts[1].match(/^([0-9]+)/);
                    if (numMatch) pageNum = numMatch[1];
                }
            }
            return { 
                bvid, 
                pageNum, 
                sourceTitle: null,
                needFetchTitle: true,   // ⭐ 获取标题
                needFetchPages: false   // ⭐ 不询问多P
            };
        }
    }
    
    // 情况 3：短链 b23.tv
    const shortMatch = input.match(/b23\.tv\/([a-zA-Z0-9]+)/i);
    if (shortMatch) {
        return { 
            bvid: null, pageNum: null, sourceTitle: null,
            shortUrl: input, isShortUrl: true 
        };
    }
    
    // 情况 4：番剧链接
    const bangumiMatch = input.match(/bangumi\/play\/(ss|ep)(\d+)/i);
    if (bangumiMatch) {
        return { 
            bvid: null, pageNum: null, sourceTitle: null,
            bangumiId: bangumiMatch[2],
            bangumiType: bangumiMatch[1].toLowerCase(),
            isBangumi: true 
        };
    }
    
    return null;
}



function extractPageFromUrl(url) {
    try {
        if (url.includes('?')) {
            const query = url.split('?')[1].split('#')[0];
            const params = new URLSearchParams(query);
            const p = params.get('p');
            if (p && /^\d+$/.test(p)) return p;
        }
        const m = url.match(/[?&]p=(\d+)/);
        if (m) return m[1];
    } catch (e) { }
    return null;
}

async function expandShortUrl(shortUrl) {
    try {
        const resp = await fetch(shortUrl, { 
            method: 'HEAD', 
            redirect: 'follow' 
        });
        const finalUrl = resp.url;
        console.log('[BiliPlayer] 短链展开:', shortUrl, '→', finalUrl);
        return parseBilibiliInput(finalUrl);
    } catch (e) {
        console.warn('[BiliPlayer] 短链展开失败（可能被 CORS 拦截）', e);
        return null;
    }
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function showToast(msg, duration = 2200) {
    const existing = document.getElementById('bili-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'bili-toast';
    toast.textContent = msg;
    toast.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        background: var(--kp-action-primary); color: var(--kp-action-primary-text);
        padding: 10px 20px; border-radius: 12px; z-index: 999999;
        font-size: 13px; font-weight: 700; font-family: 'Microsoft YaHei', sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: bili-import-pop 0.25s ease;
        pointer-events: none;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ⭐ 新增：可视化导入弹窗（替代 prompt 选分类 + 填集数）
function showImportDialog(bvid, customTitle, parsed, allGroups) {
    return new Promise((resolve) => {
        const existing = document.getElementById('bili-ext-import-dialog');
        if (existing) existing.remove();

        const dialog = document.createElement('div');
        dialog.id = 'bili-ext-import-dialog';
        dialog.setAttribute('data-theme', state.settings.theme);

        let selectedGroup = null;

        dialog.innerHTML = `
            <div class="bili-import-mask"></div>
            <div class="bili-import-box">
                <div class="bili-import-header">
                    <span>📺 添加视频</span>
                    <button class="bili-import-close" type="button">×</button>
                </div>
                <div class="bili-import-body">
                    <div class="bili-import-info">
                        <div class="bili-import-bvid">🎬 ${customTitle || bvid}</div>
                        ${customTitle ? `<div class="bili-import-bvid-sub">${bvid}</div>` : ''}
                    </div>

                    <!-- Step 1: 选择分类 -->
                    <div class="bili-import-step" id="bili-import-step1">
                        <div class="bili-import-step-title">📂 选择目标分类</div>
                        <div class="bili-import-group-list" id="bili-import-group-list">
                            ${allGroups.map((name) => `
                                <button class="bili-import-group-btn ${state.currentGroup === name ? 'bili-import-group-current' : ''}" data-group="${escapeHtml(name)}" type="button">
                                    <span class="bili-import-group-icon">${state.currentGroup === name ? '▶️' : '📁'}</span>
                                    <span class="bili-import-group-name">${escapeHtml(name)}</span>
                                    <span class="bili-import-group-count">${(state.playlistData[name] || []).length} 个视频</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Step 2: 填集数 -->
                    <div class="bili-import-step" id="bili-import-step2" style="display:none;">
                        <div class="bili-import-step-title">📋 是否为多P合集？</div>
                        <div class="bili-import-step-desc">
                            如果是单集视频，直接点「添加单集」<br>
                            如果是多P合集，填写起始和结束集数（起始默认为 1）
                        </div>
                        <div class="bili-import-episode-wrap">
                            <input type="number" id="bili-import-episode-start"
                                   class="bili-import-episode-input"
                                   placeholder="起始集数（默认从第 1 集开始）"
                                   min="1" max="9999"
                                   style="margin-bottom:6px;">
                            <input type="number" id="bili-import-episode-input"
                                   class="bili-import-episode-input"
                                   placeholder="结束集数，如 12、24、130..."
                                   min="1" max="9999">
                        </div>
                        <div class="bili-import-actions">
                            <button id="bili-import-single-btn" class="bili-import-action-btn bili-import-btn-secondary" type="button">
                                添加单集
                            </button>
                            <button id="bili-import-batch-btn" class="bili-import-action-btn bili-import-btn-primary" type="button">
                                批量添加
                            </button>
                        </div>
                        <button id="bili-import-back-btn" class="bili-import-back-btn" type="button">
                            ← 返回选分类
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        const step1 = dialog.querySelector('#bili-import-step1');
        const step2 = dialog.querySelector('#bili-import-step2');

        const onEsc = (e) => {
            if (e.key === 'Escape') closeDialog(null);
        };
        document.addEventListener('keydown', onEsc);

        const closeDialog = (result = null) => {
            document.removeEventListener('keydown', onEsc);
            dialog.remove();
            resolve(result);
        };

        // 关闭
        dialog.querySelector('.bili-import-close').onclick = () => closeDialog(null);
        dialog.querySelector('.bili-import-mask').onclick = () => closeDialog(null);

        // 选择分类按钮
        dialog.querySelectorAll('.bili-import-group-btn').forEach(btn => {
            btn.onclick = () => {
                selectedGroup = btn.dataset.group;
                dialog.querySelectorAll('.bili-import-group-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                if (parsed.needFetchPages) {
                    step1.style.display = 'none';
                    step2.style.display = 'block';
                    step2.style.animation = 'none';
                    step2.offsetHeight;
                    step2.style.animation = '';
                    setTimeout(() => {
                        const epInput = dialog.querySelector('#bili-import-episode-input');
                        if (epInput) epInput.focus();
                    }, 100);
                } else {
                    // ⭐ 纯BV号 + 多分类：选完直接关闭
                    closeDialog({ group: selectedGroup, mode: 'single', episodes: 0 });
                }
            };
        });


        // 返回上一步
        const backBtn = dialog.querySelector('#bili-import-back-btn');
        if (backBtn) {
            backBtn.onclick = () => {
                step2.style.display = 'none';
                step1.style.display = 'block';
                step1.style.animation = 'none';
                step1.offsetHeight;
                step1.style.animation = '';
            };
        }

        // 添加单集
        const singleBtn = dialog.querySelector('#bili-import-single-btn');
        if (singleBtn) {
            singleBtn.onclick = () => {
                closeDialog({ group: selectedGroup, mode: 'single', episodes: 0 });
            };
        }

        // 批量添加
        const batchBtn = dialog.querySelector('#bili-import-batch-btn');
        if (batchBtn) {
            batchBtn.onclick = () => {
                const startInput = dialog.querySelector('#bili-import-episode-start');
                const endInput = dialog.querySelector('#bili-import-episode-input');
                const startNum = parseInt(startInput.value) || 1;
                const endNum = parseInt(endInput.value);
                if (isNaN(endNum) || endNum < 1 || endNum < startNum) {
                    endInput.style.borderColor = 'var(--kp-primary-deep)';
                    endInput.style.animation = 'bili-shake 0.3s ease';
                    setTimeout(() => {
                        endInput.style.animation = '';
                        endInput.style.borderColor = '';
                    }, 400);
                    endInput.placeholder = endNum < startNum ? '结束集数不能小于起始集数' : '请输入有效的集数...';
                    endInput.focus();
                    return;
                }
                closeDialog({ group: selectedGroup, mode: 'batch', startEpisode: startNum, episodes: endNum });
            };
        }

        // 回车触发批量
        const episodeStartInput = dialog.querySelector('#bili-import-episode-start');
        const episodeEndInput = dialog.querySelector('#bili-import-episode-input');
        if (episodeStartInput) {
            episodeStartInput.onkeydown = (e) => {
            if (e.key === 'Enter') { e.preventDefault(); episodeEndInput.focus(); }
            };
        }
        if (episodeEndInput) {
            episodeEndInput.onkeydown = (e) => {
                if (e.key === 'Enter') { e.preventDefault(); batchBtn.click(); }
            };
        }
    });
}

// ⭐ 新增：移动视频到其他分类的可视化弹窗
function showMoveDialog(item, currentGroup) {
    return new Promise((resolve) => {
        const allGroups = Object.keys(state.playlistData).filter(g => g !== currentGroup);
        if (allGroups.length === 0) {
            showToast('⚠️ 没有其他分类可以移动到');
            resolve(null);
            return;
        }

        const existing = document.getElementById('bili-ext-move-dialog');
        if (existing) existing.remove();

        const dialog = document.createElement('div');
        dialog.id = 'bili-ext-move-dialog';
        dialog.setAttribute('data-theme', state.settings.theme);

        dialog.innerHTML = `
            <div class="bili-import-mask"></div>
            <div class="bili-import-box">
                <div class="bili-import-header">
                    <span>📦 移动视频</span>
                    <button class="bili-import-close" type="button">×</button>
                </div>
                <div class="bili-import-body">
                    <div class="bili-import-info">
                        <div class="bili-import-bvid">🎬 ${escapeHtml(item.title || item.bvid)}</div>
                        <div class="bili-import-bvid-sub">当前分类：${escapeHtml(currentGroup)}</div>
                    </div>
                    <div class="bili-import-step">
                        <div class="bili-import-step-title">📂 移动到哪个分类？</div>
                        <div class="bili-import-group-list">
                            ${allGroups.map((name) => `
                                <button class="bili-import-group-btn" data-group="${escapeHtml(name)}" type="button">
                                    <span class="bili-import-group-icon">📁</span>
                                    <span class="bili-import-group-name">${escapeHtml(name)}</span>
                                    <span class="bili-import-group-count">${(state.playlistData[name] || []).length} 个视频</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        const onEsc = (e) => { if (e.key === 'Escape') closeDialog(null); };
        document.addEventListener('keydown', onEsc);

        const closeDialog = (result) => {
            document.removeEventListener('keydown', onEsc);
            dialog.remove();
            resolve(result);
        };

        dialog.querySelector('.bili-import-close').onclick = () => closeDialog(null);
        dialog.querySelector('.bili-import-mask').onclick = () => closeDialog(null);

        dialog.querySelectorAll('.bili-import-group-btn').forEach(btn => {
            btn.onclick = () => closeDialog(btn.dataset.group);
        });
    });
}

function createGroup() {
    const input = document.getElementById('bili-ext-g-input');
    const name = input.value.trim();
    if (!name || state.playlistData[name]) return;
    state.playlistData[name] = [];
    input.value = '';
    renderGroups();
    saveExtensionSettings();
}

async function addVideo() {
    const input = document.getElementById('bili-ext-v-input');
    const val = input.value.trim();
    if (!val) return;

    const spaceIndex = val.indexOf(' ');
    let videoPart = val;
    let customTitle = '';
    if (spaceIndex !== -1) {
        videoPart = val.substring(0, spaceIndex).trim();
        customTitle = val.substring(spaceIndex + 1).trim();
    }

    const parsed = parseBilibiliInput(videoPart);
    if (!parsed) {
        alert('无法识别这个链接或 BV 号哦~\n\n支持格式：\n• BV 号（BV1xxx...）\n• 完整链接（https://www.bilibili.com/video/BV...）\n• 带 ?p=2 的分P链接\n• 带 ?vd_source=xxx 的追踪参数链接\n• 短链（https://b23.tv/xxx）\n• 番剧链接（/bangumi/play/ss...）\n\n点击右上 ? 查看详细使用说明~');
        return;
    }

    if (parsed.isBangumi) {
        alert('番剧链接暂不支持直接添加哦~\n请在网页打开番剧,复制播放页的 BV 号或普通视频链接~');
        return;
    }

    if (parsed.isShortUrl) {
        const expanded = await expandShortUrl(parsed.shortUrl);
        if (!expanded || expanded.isShortUrl) {
            alert('短链展开失败啦~\n可能是 CORS 拦截，请直接复制完整链接试试~');
            return;
        }
        Object.assign(parsed, expanded);
    }

    const { bvid, pageNum } = parsed;
    const finalBvid = pageNum ? `${bvid}_p${pageNum}` : bvid;
    const displayTitle = customTitle || (pageNum ? `${bvid} (P${pageNum})` : bvid);

    const allGroups = Object.keys(state.playlistData);
    let defaultBox;

    // 没有分类时自动创建
    if (allGroups.length === 0) {
        state.playlistData["🐾 未分类"] = [];
        defaultBox = "🐾 未分类";
        renderGroups();
        // 如果不需要询问多P，直接添加
        if (!parsed.needFetchPages) {
            if (!state.playlistData[defaultBox].some(v => v.bvid === finalBvid)) {
                state.playlistData[defaultBox].push({ bvid: finalBvid, title: displayTitle });
            }
            input.value = '';
            renderGroups();
            saveExtensionSettings();
            if (!state.currentBvid) loadVideo(defaultBox, finalBvid);
            return;
        }
        // 需要询问多P时，还是走弹窗（此时只有一个分类）
    }

    // 只有一个分类且不需要多P询问 → 直接添加，不弹窗
    const currentGroups = Object.keys(state.playlistData);
    if (currentGroups.length === 1 && !parsed.needFetchPages) {
        defaultBox = currentGroups[0];
        if (!state.playlistData[defaultBox]) state.playlistData[defaultBox] = [];
        if (!state.playlistData[defaultBox].some(v => v.bvid === finalBvid)) {
            state.playlistData[defaultBox].push({ bvid: finalBvid, title: displayTitle });
            showToast(`✅ 已添加到「${defaultBox}」`);
        } else {
            showToast(`⚠️ 该视频已存在于「${defaultBox}」`);
        }
        input.value = '';
        renderGroups();
        saveExtensionSettings();
        if (!state.currentBvid) loadVideo(defaultBox, finalBvid);
        return;
    }


    // ⭐ 其他情况：弹出可视化面板
    const result = await showImportDialog(bvid, customTitle, parsed, currentGroups);

    if (!result) return; // 用户取消

    defaultBox = result.group;
    if (!state.playlistData[defaultBox]) state.playlistData[defaultBox] = [];

    // 批量添加
    if (result.mode === 'batch' && result.episodes > 1) {
        const start = result.startEpisode || 1;
        const end = result.episodes;
        let addedCount = 0;
        const baseTitle = customTitle || bvid;

        for (let i = start; i <= end; i++) {
            const pBvid = `${bvid}_p${i}`;
            if (state.playlistData[defaultBox].some(v => v.bvid === pBvid)) continue;
            state.playlistData[defaultBox].push({
                bvid: pBvid,
                title: `${baseTitle} - P${i}`
            });
            addedCount++;
        }

        if (addedCount > 0) {
            input.value = '';
            renderGroups();
            saveExtensionSettings();
            if (!state.currentBvid) loadVideo(defaultBox, `${bvid}_p${start}`);
            showToast(`✅ 成功添加 ${addedCount} 集到「${defaultBox}」`);
        }
        return;
    }

    // 单集添加
    if (!state.playlistData[defaultBox].some(v => v.bvid === finalBvid)) {
        state.playlistData[defaultBox].push({ bvid: finalBvid, title: displayTitle });
        showToast(`✅ 已添加到「${defaultBox}」`);
    } else {
        showToast(`⚠️ 该视频已存在于「${defaultBox}」`);
    }

    input.value = '';
    renderGroups();
    saveExtensionSettings();
    if (!state.currentBvid) loadVideo(defaultBox, finalBvid);
}

function togglePowerState() {
    if (state.isActive) {
        shutdownPlayer();
    } else {
        startupPlayer();
    }
    updatePowerButton();
    saveExtensionSettings();  // ⭐ 新增：切换时立即保存
}


function shutdownPlayer() {
    state.isActive = false;
    
    // 彻底隐藏面板
    if (panelElement) {
        panelElement.style.display = 'none';
    }
    // 彻底隐藏悬浮球
    if (floatBadgeElement) {
        floatBadgeElement.style.display = 'none';
    }
    // 停止视频播放，释放资源
    safeUpdateIframe('');
    
    console.log('[BiliPlayer] 🔴 已关闭');
}

function startupPlayer() {
    state.isActive = true;
    
    if (state.settings.startAsFloating || state.isFloating) {
        // 以悬浮球模式启动
        state.isFloating = true;
        if (panelElement) panelElement.style.display = 'none';
        createFloatBadge();
        if (floatBadgeElement) floatBadgeElement.style.display = 'block';
    } else {
        // 以完整面板启动
        state.isFloating = false;
        if (floatBadgeElement) floatBadgeElement.style.display = 'none';
        if (panelElement) {
            panelElement.style.display = 'flex';
            renderGroups();
        }
    }
    
    // 恢复上次播放的视频
    if (state.currentGroup && state.currentBvid && state.playlistData[state.currentGroup]) {
        loadVideo(state.currentGroup, state.currentBvid);
    }
    
    console.log('[BiliPlayer] 🟢 已启动');
}

function updatePowerButton() {
    const btn = document.getElementById('bili-ext-power-btn');
    const dot = document.getElementById('bili-ext-power-dot');
    const label = document.getElementById('bili-ext-power-label');
    if (!btn || !dot || !label) return;
    
    if (state.isActive) {
        btn.style.background = '#52b788';
        btn.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 6px rgba(82,183,136,0.3)';
        dot.style.left = '28px';
        label.textContent = '运行中';
        label.style.color = '#52b788';
    } else {
        btn.style.background = '#ccc';
        btn.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.1)';
        dot.style.left = '3px';
        label.textContent = '已关闭';
        label.style.color = '#999';
    }
}



function toggleMainPlayerPanel() {
    if (state.isFloating) {
        exitFloatingState();
    } else if (panelElement) {
        if (panelElement.style.display === 'none') {
            panelElement.style.display = 'flex';
            renderGroups();
        } else {
            panelElement.style.display = 'none';
        }
    } else {
        createPanel();
        renderGroups();
    }
}

// 13. 初始化
function initExtension() {
    loadExtensionSettings();
    
    document.documentElement.setAttribute('data-bili-theme', state.settings.theme);
    applyThemeColorsOnly();

    const context = window.SillyTavern?.extensions_settings;
    if (context && !context[MODULE_NAME]) {
        context[MODULE_NAME] = {
            playlistData: state.playlistData,
            lastGroup: state.currentGroup,
            lastBvid: state.currentBvid,
            lastPos: state.savedPos,
            settings: state.settings,
            isActive: state.isActive  // ⭐ 新增
        };
        if (typeof window.saveSettingsDebounced === 'function') {
            window.saveSettingsDebounced();
        } else if (typeof window.saveSettings === 'function') {
            window.saveSettings();
        }
    }

    // ⭐ 新增：如果上次关闭时是关闭状态，创建面板但不显示
    if (!state.isActive) {
        createPanel();
        panelElement.style.display = 'none';
        // 不创建悬浮球，不加载视频
        console.log('[BiliPlayer] 🔴 上次关闭时为关闭状态，保持关闭');
    } else if (state.settings.startAsFloating) {
        // 悬浮球启动
        createPanel();
        panelElement.style.display = 'none';
        state.isFloating = true;
        createFloatBadge();
        
        if (state.currentGroup && state.currentBvid && state.playlistData[state.currentGroup]) {
            loadVideo(state.currentGroup, state.currentBvid);
        }
    } else {
        // 完整面板启动
        createPanel();
        renderGroups();
        
        if (state.currentGroup && state.currentBvid && state.playlistData[state.currentGroup]) {
            loadVideo(state.currentGroup, state.currentBvid);
        }
    }

    let attempts = 0;
    const injectInterval = setInterval(() => {
        attempts++;
        const extensionSettingsMenu = document.getElementById('extensions_settings');
        if (extensionSettingsMenu && !document.getElementById('bili-ext-nav-toggle')) {
            extensionSettingsMenu.insertAdjacentHTML('afterbegin', `
                <div class="inline-drawer" id="bili-ext-nav-toggle" style="
                    margin-bottom: 10px;
                    padding: 12px 14px;
                    background: linear-gradient(135deg, var(--kp-primary-light, #fff0f3), var(--kp-bg-soft, #fffbfc));
                    border-radius: 14px;
                    border: 2.5px solid var(--kp-border, #ff85a7);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                    text-align: center;
                    transition: all 0.3s ease;
                ">
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                    ">
                        <span style="
                            font-size: 12px;
                            font-weight: 700;
                            color: var(--kp-text, #5d6d7e);
                            letter-spacing: 0.5px;
                        ">📺 BiliPlayer</span>
                        <button id="bili-ext-power-btn" type="button" style="
                            position: relative;
                            width: 52px;
                            height: 26px;
                            border: none;
                            border-radius: 13px;
                            cursor: pointer;
                            background: #52b788;
                            box-shadow: inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 6px rgba(82,183,136,0.3);
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                            padding: 0;
                            outline: none;
                        "><span id="bili-ext-power-dot" style="
                            position: absolute;
                            top: 3px;
                            left: 28px;
                            width: 20px;
                            height: 20px;
                            background: #ffffff;
                            border-radius: 50%;
                            box-shadow: 0 1px 4px rgba(0,0,0,0.2);
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        "></span></button>
                        <span id="bili-ext-power-label" style="
                            font-size: 11px;
                            font-weight: 600;
                            color: #52b788;
                            min-width: 32px;
                            transition: color 0.3s;
                        ">运行中</span>
                    </div>
                </div>
            `);

            const powerBtn = document.getElementById('bili-ext-power-btn');
            powerBtn.addEventListener('click', togglePowerState);
            updatePowerButton();  // ⭐ 这里会根据 state.isActive 正确显示按钮状态
        }

        try {
            if (window.SillyTavern && window.SillyTavern.SlashCommandParser && !window.SillyTavern.SlashCommandParser.commands.bili) {
                window.SillyTavern.SlashCommandParser.addCommandObject(
                    window.SillyTavern.SlashCommandParser.commands.bili = {
                        namedArgumentList: [],
                        unnamedArgumentList: [],
                        returns: 'void',
                        helpString: '启动或关闭 BiliPlayer 播放器',
                        execute: () => { togglePowerState(); return ''; }
                    }
                );
            }
        } catch (e) { }

        if (document.getElementById('bili-ext-nav-toggle') || attempts > 20) {
            clearInterval(injectInterval);
        }
    }, 1000);
}




if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initExtension();
} else {
    document.addEventListener('DOMContentLoaded', initExtension);
}