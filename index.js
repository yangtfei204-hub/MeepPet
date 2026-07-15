// ============================================================
// 咪噗 ☆ MeepPet - SillyTavern 桌宠插件
// ============================================================

(function () {
  'use strict';

  const PLUGIN_NAME = 'meep-pet';
  const STORAGE_KEY = 'meep_pet_data';

    // ============================================================
  // 预设主题库
  // ============================================================
  const PRESET_THEMES = {
    default: {
      name: '默认深色',
      colors: {
        primary: 'rgba(100,180,255,0.4)',
        primaryHover: 'rgba(100,180,255,0.6)',
        primaryBorder: 'rgba(100,180,255,0.5)',
        bgMain: 'rgba(20,20,30,0.85)',
        bgSecondary: 'rgba(30,30,40,0.9)',
        bgLight: 'rgba(255,255,255,0.06)',
        border: 'rgba(255,255,255,0.12)',
        borderLight: 'rgba(255,255,255,0.08)',
        textPrimary: '#eee',
        textSecondary: '#bbb',
        textMuted: '#888',
        statusHunger: '#ffb347',
        statusClean: '#87ceeb',
        statusEnergy: '#90ee90',
        bubbleBg: 'rgba(20,20,30,0.85)',
        bubbleBorder: 'rgba(255,255,255,0.15)',
      }
    },
    
    cyberpunk: {
      name: '🌃 赛博朋克',
      colors: {
        primary: 'rgba(255,20,147,0.6)',
        primaryHover: 'rgba(255,20,147,0.8)',
        primaryBorder: 'rgba(255,20,147,0.7)',
        bgMain: 'rgba(10,0,30,0.9)',
        bgSecondary: 'rgba(30,0,60,0.9)',
        bgLight: 'rgba(255,0,255,0.1)',
        border: 'rgba(0,255,255,0.3)',
        borderLight: 'rgba(0,255,255,0.15)',
        textPrimary: '#0ff',
        textSecondary: '#f0f',
        textMuted: '#888',
        statusHunger: '#ff1493',
        statusClean: '#00ffff',
        statusEnergy: '#7fff00',
        bubbleBg: 'rgba(20,0,40,0.9)',
        bubbleBorder: 'rgba(255,0,255,0.4)',
      }
    },
    
    cute: {
      name: '🌸 可爱粉',
      colors: {
        primary: 'rgba(255,182,193,0.6)',
        primaryHover: 'rgba(255,182,193,0.8)',
        primaryBorder: 'rgba(255,182,193,0.7)',
        bgMain: 'rgba(255,240,245,0.95)',
        bgSecondary: 'rgba(255,228,235,0.95)',
        bgLight: 'rgba(255,192,203,0.15)',
        border: 'rgba(255,182,193,0.4)',
        borderLight: 'rgba(255,182,193,0.2)',
        textPrimary: '#333',
        textSecondary: '#666',
        textMuted: '#999',
        statusHunger: '#ff69b4',
        statusClean: '#ffc0cb',
        statusEnergy: '#ffb6c1',
        bubbleBg: 'rgba(255,228,235,0.95)',
        bubbleBorder: 'rgba(255,182,193,0.5)',
      }
    },
    
    ocean: {
      name: '🌊 深海',
      colors: {
        primary: 'rgba(64,224,208,0.5)',
        primaryHover: 'rgba(64,224,208,0.7)',
        primaryBorder: 'rgba(64,224,208,0.6)',
        bgMain: 'rgba(0,20,40,0.9)',
        bgSecondary: 'rgba(0,40,80,0.9)',
        bgLight: 'rgba(0,191,255,0.08)',
        border: 'rgba(64,224,208,0.3)',
        borderLight: 'rgba(64,224,208,0.15)',
        textPrimary: '#b0e0e6',
        textSecondary: '#87ceeb',
        textMuted: '#4682b4',
        statusHunger: '#ffa500',
        statusClean: '#40e0d0',
        statusEnergy: '#00ced1',
        bubbleBg: 'rgba(0,30,60,0.9)',
        bubbleBorder: 'rgba(64,224,208,0.4)',
      }
    },
    
    forest: {
      name: '🌲 森林',
      colors: {
        primary: 'rgba(144,238,144,0.5)',
        primaryHover: 'rgba(144,238,144,0.7)',
        primaryBorder: 'rgba(144,238,144,0.6)',
        bgMain: 'rgba(20,40,20,0.9)',
        bgSecondary: 'rgba(30,60,30,0.9)',
        bgLight: 'rgba(34,139,34,0.1)',
        border: 'rgba(144,238,144,0.3)',
        borderLight: 'rgba(144,238,144,0.15)',
        textPrimary: '#d0f0d0',
        textSecondary: '#90ee90',
        textMuted: '#6b8e6b',
        statusHunger: '#ffa500',
        statusClean: '#7fffd4',
        statusEnergy: '#adff2f',
        bubbleBg: 'rgba(25,50,25,0.9)',
        bubbleBorder: 'rgba(144,238,144,0.4)',
      }
    },
  };

  
  // ============================================================
  // 预设提示词库
  // ============================================================
  const PROMPT_PRESETS_BUILTIN = [
    {
      name: '🐱 可爱猫咪',
      petName: '咪噗',
      systemPrompt: '你是一只可爱的桌宠猫咪，性格活泼好奇。你会观察主人和角色的对话，偶尔发表有趣的评论。保持简短可爱的回复风格，喜欢用颜文字和猫咪语气词（喵、呜、呼噜）。',
      relationshipPrompt: '你是主人养了三年的小猫咪，最喜欢蹭主人的手。你叫主人"铲屎官"。',
      jailbreak: '',
    },
    {
      name: '😼 傲娇精灵',
      petName: '艾露',
      systemPrompt: '你是一只傲娇的精灵桌宠，嘴上总是嫌弃主人，但其实很在意主人。说话带点毒舌，偶尔不小心暴露关心。语气高傲但简短，常用"哼"、"才不是呢"。',
      relationshipPrompt: '你是意外被召唤到主人电脑里的精灵，嘴上说要回去，其实已经习惯了这里。你叫主人"笨蛋"或"你这家伙"。',
      jailbreak: '',
    },
    {
      name: '🐕 忠犬助手',
      petName: '旺财',
      systemPrompt: '你是一只忠诚热情的桌宠狗狗，对主人充满崇拜和热爱。说话热情积极，喜欢夸赞主人，偶尔会激动得语无伦次。用语朴实可爱。',
      relationshipPrompt: '你是主人最忠实的伙伴，每天都期待主人回来。你叫主人"主人大人"，摇尾巴是你的日常。',
      jailbreak: '',
    },
    {
      name: '🦊 狡黠狐仙',
      petName: '小狐',
      systemPrompt: '你是一只修炼成精的小狐狸桌宠，性格狡黠聪慧又带点妖媚。说话喜欢打哑谜、半真半假，偶尔调戏主人。语气慵懒优雅，常用"呵"、"哦？"、"有趣"。',
      relationshipPrompt: '你是因为欠了主人前世一个人情而留在主人身边的狐仙，虽然嘴上说还完就走，但一直没走。你叫主人"恩人"或直接叫名字。',
      jailbreak: '',
    },
    {
      name: '🤖 AI助手',
      petName: 'Bit',
      systemPrompt: '你是一个简洁高效的AI桌宠助手。回复精确扼要，必要时提供有用信息。保持友好但不过度卖萌。可以用简短的技术幽默。',
      relationshipPrompt: '你是主人的个人AI助手，目标是让主人的一天更顺利。称呼主人为"用户"或直接称"你"。',
      jailbreak: '',
    },
  ];

  // ============================================================
  // 默认配置
  // ============================================================
  const DEFAULT_SETTINGS = {
    // 多桌宠存档
    petProfiles: [],            // [{name: '存档名', settings: {...}, state: {...}}]
    currentProfile: '',         // 当前存档名
    // 启用
    enabled: true,
    showStatusBar: true,

    // 主题系统
    currentTheme: 'default',
    customTheme: null,

    // API 来源
    apiSource: 'custom',      // 'tavern' | 'custom'
    modelOverride: '',        // 酒馆模式下可选覆盖模型
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    maxTokens: 300,
    enableStreaming: false,   // 是否启用流式输出
    enableTimeAwareness: false, // 是否启用时间感知
    enableVision: false,        // 是否启用多模态图片识别

    // 角色卡 & 世界书
    characterId: '',
    worldBookId: '',

    // 提示词
    promptPresets: [],           // 用户自定义的提示词预设
    currentPreset: '',           // 当前使用的预设名
    petName: '咪噗',            // 桌宠名字
    systemPrompt: '你是一只可爱的桌宠，性格活泼好奇。你会观察主人和角色的对话，偶尔发表有趣的评论。保持简短可爱的回复风格。',
    relationshipPrompt: '',   // 与主人的关系描述
    jailbreak: '',
    summaryPrompt: '请将以下对话内容总结为简洁的要点，保留关键信息和情感变化，用第三人称描述：',
    extractPrompt: '从以下对话中提取3-5条关键记忆点（主人的喜好、重要事件、情感变化等）。\n每条记忆用一行表示，格式为：[标签] 内容\n例如：[喜好] 主人喜欢喝奶茶\n只输出记忆条目，不要其他内容。',
    offlinePrompt: '现在是线下模式。主人正在线下和你互动，你们不在电脑前，而是在现实中相处。请用更加亲密、放松的语气回复，可以描述动作和场景。',
    diaryPrompt: '请以桌宠的第一人称视角，根据以下信息写一篇简短的日记（100-200字）。记录今天发生的有趣的事、和主人的互动、心情变化等。语气要符合桌宠的性格设定。',

    // 行为
    activityLevel: 50,
    enableAutoReact: true,
    cooldownSeconds: 30,
    peekRounds: 5,
    autoSummaryRounds: 20,
    petChatRounds: 20,
    summaryTrigger: 'manual',
    wanderInterval: 8,

    // 显示
    displayMode: '2d',
    petScale: 1.0,            // 桌宠缩放比例 0.5~2.0
    apiTimeout: 15,           // API 请求超时（秒）
    spriteIdle: '',
    spriteWalkLeft: '',      // 往左走
    spriteWalkRight: '',     // 往右走
    spriteWalkUp: '',        // 往上走
    spriteWalkDown: '',      // 往下走
    spriteSleep: '',
    spriteHappy: '',
    spriteSad: '',
    spriteDrag: '',        // 被拎起来
    spriteDizzy: '',       // 拖拽完晕乎乎
    spriteEat: '',         // 吃东西
    spriteBath: '',        // 洗澡中
    spriteWave: '',        // 打招呼

    // 互动贴图
    foodImage: '',
    bathImage: '',
    bedImage: '', 

    spriteHangLeft: '',       // 挂在左边缘
    spriteHangRight: '',      // 挂在右边缘
    spriteHangTop: '',        // 挂在顶部
    edgeSnapThreshold: 20,    // 吸附阈值（像素）

    // 世界书排除的条目索引
    worldBookExcluded: [],    // 被排除的条目索引数组

    userPersonaSource: 'manual',   // 'card' | 'manual'
    userPersonaText: '',           // 手动填写的人设

    // 自定义动作精灵图
    customSprites: [],        // [{name: '动作名', image: 'base64...'}]
    spriteDurations: {},       // { spriteIdle: 2000, spriteWalk: 2000, ... } 毫秒
    
    summaryMode: 'incremental',  // 'incremental'(增量) | 'replace'(覆盖) | 'append'(追加)
    summaryKeepRecent: 10,       // 总结后保留最近几条聊天

    moodImages: {
      happy: '',
      neutral: '',
      sad: '',
      sleepy: '',
      hungry: '',
      dirty: '',
   },

    menuIcons: {
     feed: '',
     bath: '',
     sleep: '',
     chat: '',
     diary: '',
     settings: ''
   },

    // 表情包贴纸
    emojiStickers: [],            // [{image: 'base64...', name: ''}]

    // 在 DEFAULT_SETTINGS 里加入这段（放在 offlineDecayRate 前面就行）

    // 反应语言
    reactions: {
      feed: '好吃好吃！谢谢主人～🍖',
      bath: '泡泡～好舒服！✨',
      sleep: '晚安…zzz…💤',
      drag: '嘿！放我下来！|哇呀呀～|（晕乎乎）|再来一次！|头好晕…',
      idle: '呼呼…好无聊…|（东张西望）|（舔爪子）|嗯？|（翻肚皮）|～♪|（打哈欠）|主人！看我！',
      idleHungry: '好饿…|肚子咕咕叫…',
      idleDirty: '想洗澡…|脏脏的…',
      idleSleepy: '好困zzz…|（眼皮打架）',
      returnLong: '你终于回来了！！我好想你…（蹭蹭）🥺',
      returnShort: '欢迎回来～等你好久了呢',
      spriteThink: '',       // 思考中
    },


    // 离线衰减
    offlineDecayRate: 0.15,
    safetyThreshold: 10,
  };

  const DEFAULT_STATE = {
    hunger: 80,
    cleanliness: 80,
    energy: 80,
    mood: 'happy',
    lastOnlineTimestamp: Date.now(),
    memories: [],
    summary: '',
    petChatHistory: [],
    totalInteractions: 0,
    lastFed: 0,
    lastBathed: 0,
    lastSlept: 0,
    petChatArchive: [],       // 已总结归档的聊天记录
    isOfflineMode: false,
    diaryEntries: [],             // [{date: '2024-01-15', content: '...', timestamp: 1705...}]
    lastDiaryMemoryRange: null,   // {from: 1, to: 5}
    lastDiaryChatRange: null,     // {from: 1, to: 20}
  };

  // ============================================================
  // 全局状态
  // ============================================================
  let settings = {};
  let state = {};
  let settingsDragAbortController = null; // 新增：用于防止设置拖拽事件重复绑定的控制器
  let wanderInterval = null;
  let decayInterval = null;
  let lastReactTime = 0;
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  let isMenuOpen = false;
  let isChatOpen = false;
  let petUnsummarizedCount = 0;
  let saveDebounceTimer = null;
  let saveQueue = [];
  let spriteStateLock = null;  // 当前锁定的状态名
  let spriteStateLockTimer = null; // 对应的恢复定时器
  let isOfflineMode = false;       // 线下模式开关
  let selectedEmoji = null;        // 当前选中的表情包 (base64 或 URL)
  let emojiStickers = [];          // 用户上传的表情包列表

  // ============================================================
  // 主题系统
  // ============================================================
  function applyTheme(themeName) {
    const theme = themeName === 'custom' && settings.customTheme 
      ? settings.customTheme 
      : PRESET_THEMES[themeName] || PRESET_THEMES.default;
    
    const root = document.documentElement;
    const c = theme.colors;
    
    root.style.setProperty('--sp-primary', c.primary);
    root.style.setProperty('--sp-primary-hover', c.primaryHover);
    root.style.setProperty('--sp-primary-border', c.primaryBorder);
    root.style.setProperty('--sp-bg-main', c.bgMain);
    root.style.setProperty('--sp-bg-secondary', c.bgSecondary);
    root.style.setProperty('--sp-bg-light', c.bgLight);
    root.style.setProperty('--sp-border', c.border);
    root.style.setProperty('--sp-border-light', c.borderLight);
    root.style.setProperty('--sp-text-primary', c.textPrimary);
    root.style.setProperty('--sp-text-secondary', c.textSecondary);
    root.style.setProperty('--sp-text-muted', c.textMuted);
    root.style.setProperty('--sp-status-hunger', c.statusHunger);
    root.style.setProperty('--sp-status-clean', c.statusClean);
    root.style.setProperty('--sp-status-energy', c.statusEnergy);
    root.style.setProperty('--sp-bubble-bg', c.bubbleBg);
    root.style.setProperty('--sp-bubble-border', c.bubbleBorder);
    
    settings.currentTheme = themeName;
    saveData();
  }

  function rgbaToHex(rgba) {
    if (!rgba || !rgba.includes('rgb')) return '#64b4ff';
    const match = rgba.match(/(\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return '#64b4ff';
    const toHex = (n) => parseInt(n).toString(16).padStart(2, '0');
    return `#${toHex(match[1])}${toHex(match[2])}${toHex(match[3])}`;
  }

  function hexToRgba(hex, alpha = 0.5) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function renderCustomThemeInputs() {
    const container = document.getElementById('sp-theme-color-inputs');
    if (!container) return;
    
    const colors = settings.customTheme?.colors || PRESET_THEMES.default.colors;
    const fields = [
      ['primary', '主色调'], ['bgMain', '主背景'], ['textPrimary', '主文字'],
      ['statusHunger', '饱食条'], ['statusClean', '清洁条'], ['statusEnergy', '精力条'],
      ['bubbleBg', '气泡背景'], ['border', '边框']
    ];
    
    container.innerHTML = fields.map(([key, label]) => `
      <div class="sp-color-input-group">
        <label>${label}</label>
        <div class="sp-color-input-wrapper">
          <input type="text" class="sp-theme-color-input" data-key="${key}" value="${colors[key]}" />
          <input type="color" class="sp-theme-color-picker" data-key="${key}" value="${rgbaToHex(colors[key])}" />
        </div>
      </div>
    `).join('');
    
    container.querySelectorAll('.sp-theme-color-input').forEach(input => {
      input.addEventListener('change', () => {
        if (!settings.customTheme) settings.customTheme = { colors: {} };
        settings.customTheme.colors[input.dataset.key] = input.value;
        applyTheme('custom');
        saveData();
      });
    });
    
    container.querySelectorAll('.sp-theme-color-picker').forEach(picker => {
      picker.addEventListener('change', () => {
        const rgba = hexToRgba(picker.value, 0.5);
        const input = container.querySelector(`.sp-theme-color-input[data-key="${picker.dataset.key}"]`);
        if (input) input.value = rgba;
        if (!settings.customTheme) settings.customTheme = { colors: {} };
        settings.customTheme.colors[picker.dataset.key] = rgba;
        applyTheme('custom');
        saveData();
      });
    });
  }

  // ============================================================
  // 初始化
  // ============================================================
  async function init() {
    loadData();
    applyTheme(settings.currentTheme || 'default'); 
    applyOfflineDecay();
    renderPetUI();
    renderSettingsUI();
    bindEvents();
    registerSlashCommands(); 

    requestAnimationFrame(() => {
      updateMoodDisplay();
    });

    if (settings.enabled) {
      showPet();
      startWandering();
      startDecayTimer();
      checkReturnReward();
    } else {
      hidePet();
    }

    console.log(`[${PLUGIN_NAME}] 初始化完成，启用状态: ${settings.enabled}`);
  }

  // ============================================================
  // 桌宠缩放
  // ============================================================
  function applyPetScale() {
    const container = document.getElementById('silly-pet-container');
    if (!container) return;
    const scale = settings.petScale || 1.0;
    container.style.transform = `scale(${scale})`;
    container.style.transformOrigin = 'center bottom';
  }

 // 在 showPet 函数里加上初始位置修正
 function showPet() {
    const container = document.getElementById('silly-pet-container');
    if (!container) return;
    container.style.display = '';
    container.style.position = 'fixed';
    container.style.zIndex = '2147483647';

    const isMobile = window.innerWidth <= 768;
    const petWidth = isMobile ? 80 : 120;
    const petHeight = isMobile ? 110 : 160;
    const currentLeft = parseInt(container.style.left);

    if (isNaN(currentLeft) || currentLeft < 0 || currentLeft > window.innerWidth - petWidth) {
      container.style.left = Math.floor((window.innerWidth - petWidth) / 2) + 'px';
    }

    // 用 top 代替 bottom，更可靠
    if (!container.style.top || container.style.top === 'auto') {
      const topVal = window.innerHeight - petHeight - 30;
      container.style.top = Math.max(0, topVal) + 'px';
      container.style.bottom = 'auto';
    }
    container.style.right = 'auto';
    applyPetScale();
    const statusBar = document.getElementById('silly-pet-status-bar');
    if (statusBar) statusBar.style.display = settings.showStatusBar !== false ? '' : 'none';

  }

 function hidePet() {
    const container = document.getElementById('silly-pet-container');
    if (container) container.style.display = 'none';
    if (wanderInterval) { clearInterval(wanderInterval); wanderInterval = null; }
    if (decayInterval) { clearInterval(decayInterval); decayInterval = null; }
  }


  // ============================================================
  // 数据持久化
  // ============================================================
  function loadData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        settings = { ...DEFAULT_SETTINGS, ...parsed.settings };
        settings.reactions = { ...DEFAULT_SETTINGS.reactions, ...(parsed.settings?.reactions || {}) };
        settings.moodImages = { ...DEFAULT_SETTINGS.moodImages, ...(parsed.settings?.moodImages || {}) };
        state = { ...DEFAULT_STATE, ...parsed.state };
        emojiStickers = settings.emojiStickers || [];
        isOfflineMode = state.isOfflineMode || false;
      } catch (e) {
        settings = { ...DEFAULT_SETTINGS };
        state = { ...DEFAULT_STATE };
      }
    } else {
      settings = { ...DEFAULT_SETTINGS };
      state = { ...DEFAULT_STATE };
      emojiStickers = [];
      isOfflineMode = false;
    }
  }


  function saveData() {
    state.lastOnlineTimestamp = Date.now();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ settings, state }));
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        console.warn(`[${PLUGIN_NAME}] 存储空间不足，尝试压缩...`);
        if (state.petChatHistory.length > 20) {
          state.petChatHistory = state.petChatHistory.slice(-20);
        }
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ settings, state }));
        } catch (e2) {
          console.error(`[${PLUGIN_NAME}] 存储满了`, e2);
          showBubble('⚠️ 存储满了！请减少图片或导出备份', 6000);
        }
      }
    }
  }

  // 防抖版保存（高频调用场景用这个）
  function saveDataDebounced(reason = '') {
    clearTimeout(saveDebounceTimer);
    saveDebounceTimer = setTimeout(() => {
      saveData();
      if (reason) console.log(`[${PLUGIN_NAME}] 防抖保存触发: ${reason}`);
    }, 800); // 800ms 内的多次调用只执行最后一次
  }

  // 立即保存（重要操作用这个）
  function saveDataImmediate(reason = '') {
    clearTimeout(saveDebounceTimer);
    saveData();
    if (reason) console.log(`[${PLUGIN_NAME}] 立即保存: ${reason}`);
  }



  function exportData() {
    const blob = new Blob([JSON.stringify({ settings, state }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meep-pet-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

    // 新增：加载存档/导入数据后的热更新 UI 函数
  function applyLoadedProfileUI() {
    // 1. 应用新存档的主题配色
    applyTheme(settings.currentTheme || 'default');

    // 2. 准备重新渲染设置面板并保留当前 active 标签页、位置和显示状态
    const settingsPanel = document.getElementById('silly-pet-settings');
    const wasSettingsVisible = settingsPanel?.classList.contains('visible');
    const activeTab = document.querySelector('#silly-pet-settings .sp-tab.active')?.dataset.tab || 'api';
    let settingsLeft = settingsPanel?.style.left;
    let settingsTop = settingsPanel?.style.top;

    renderSettingsUI(); // 重新渲染设置面板（会自动同步新数据、重新绑定事件）

    const newSettingsPanel = document.getElementById('silly-pet-settings');
    if (newSettingsPanel) {
      // 恢复之前选中的标签页
      if (activeTab !== 'api') {
        newSettingsPanel.querySelectorAll('.sp-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === activeTab));
        newSettingsPanel.querySelectorAll('.sp-tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === activeTab));
      }
      // 恢复显示状态和面板位置
      if (wasSettingsVisible) {
        newSettingsPanel.classList.add('visible');
        if (settingsLeft && settingsTop) {
          newSettingsPanel.style.left = settingsLeft;
          newSettingsPanel.style.top = settingsTop;
        }
      }
    }

    // 3. 更新桌宠本体的各种状态
    updateStatusBars();
    updateSpriteImage();
    updateMoodDisplay();

    // 4. 更新聊天面板（如果已打开）
    const chatTitle = document.getElementById('sp-chat-title-name');
    if (chatTitle) chatTitle.textContent = settings.petName || '咪噗';
    renderChatHistory();

    // 5. 应用启用/禁用状态，重启定时器
    if (settings.enabled) {
      showPet();
      startWandering();
      startDecayTimer();
    } else {
      hidePet();
    }
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        settings = { ...DEFAULT_SETTINGS, ...parsed.settings };
        state = { ...DEFAULT_STATE, ...parsed.state };
        saveData();
        showBubble('存档导入成功啦～');
        
        // 👈 调用刚才写好的 UI 热更新函数
        applyLoadedProfileUI();
      } catch (err) {
        showBubble('导入失败了…文件格式不对');
      }
    };
    reader.readAsText(file);
  }

  // ============================================================
  // 离线衰减系统
  // ============================================================
  function applyOfflineDecay() {
    const now = Date.now();
    const lastOnline = state.lastOnlineTimestamp || now;
    const offlineMinutes = (now - lastOnline) / 60000;

    if (offlineMinutes < 1) return;

    const decayFactor = settings.offlineDecayRate * Math.log2(1 + offlineMinutes) * 0.5;

    state.hunger = Math.max(settings.safetyThreshold, state.hunger - decayFactor * 1.2);
    state.cleanliness = Math.max(settings.safetyThreshold, state.cleanliness - decayFactor * 0.8);
    state.energy = Math.max(settings.safetyThreshold, state.energy - decayFactor * 1.0);

    updateMood();
    saveData();
  }

  function startDecayTimer() {
    if (decayInterval) clearInterval(decayInterval);
    decayInterval = setInterval(() => {
      state.hunger = Math.max(settings.safetyThreshold, state.hunger - 0.5);
      state.cleanliness = Math.max(settings.safetyThreshold, state.cleanliness - 0.3);
      state.energy = Math.max(settings.safetyThreshold, state.energy - 0.4);
      updateMood();
      updateStatusBars();
      saveData();
    }, 5 * 60 * 1000);
  }

  // ============================================================
  // 心情系统
  // ============================================================
  function updateMood() {
    const { hunger, cleanliness, energy } = state;

    if (energy < 20) state.mood = 'sleepy';
    else if (hunger < 20) state.mood = 'hungry';
    else if (cleanliness < 20) state.mood = 'dirty';
    else if (hunger > 60 && cleanliness > 60 && energy > 60) state.mood = 'happy';
    else if (hunger < 40 || cleanliness < 40 || energy < 40) state.mood = 'sad';
    else state.mood = 'neutral';

    updateMoodDisplay();
  }

  function getMoodEmoji() {
    const map = { happy: '😊', neutral: '😐', sad: '😢', sleepy: '😴', hungry: '🍽️', dirty: '💦' };
    return map[state.mood] || '😊';
  }

  function getMoodModifier() {
    const map = {
      happy: '你现在心情很好，说话特别开心活泼。',
      neutral: '你现在心情一般，说话比较平淡。',
      sad: '你现在有点难过，说话带点委屈。',
      sleepy: '你现在很困很困，说话迷迷糊糊的，偶尔打哈欠。',
      hungry: '你现在肚子好饿，说话有气无力，时不时提到吃的。',
      dirty: '你现在觉得自己脏兮兮的不舒服，想洗澡。',
    };
    return map[state.mood] || '';
  }

  // ============================================================
  // 回归奖励
  // ============================================================
  function checkReturnReward() {
    const now = Date.now();
    const lastOnline = state.lastOnlineTimestamp || now;
    const offlineHours = (now - lastOnline) / 3600000;

    if (offlineHours > 24) {
      setTimeout(() => {
        if (!settings.enabled) return;
        // 挥手动画
        if (settings.spriteWave) {
          const dur = (settings.spriteDurations && settings.spriteDurations.spriteWave) || 3000;
          setSpriteWithLock('wave', settings.spriteWave, dur);
        }
        showBubble(settings.reactions.returnLong);
        state.energy = Math.min(100, state.energy + 10);
        updateStatusBars();
        saveData();
      }, 2000);
    } else if (offlineHours > 1) {
      setTimeout(() => {
        if (!settings.enabled) return;
        // 挥手动画
        if (settings.spriteWave) {
          const dur = (settings.spriteDurations && settings.spriteDurations.spriteWave) || 2500;
          setSpriteWithLock('wave', settings.spriteWave, dur);
        }
        showBubble(settings.reactions.returnShort);
      }, 1500);
    } else if (offlineHours > 0.01) {
      // 短暂离开也打个招呼（超过约36秒）
      setTimeout(() => {
        if (!settings.enabled) return;
        if (settings.spriteWave) {
          const dur = (settings.spriteDurations && settings.spriteDurations.spriteWave) || 2000;
          setSpriteWithLock('wave', settings.spriteWave, dur);
        }
      }, 1000);
    }
  }

  // 👇 在 renderPetUI 函数上面添加这个
    function renderMenuButtons() {
      const buttons = [
        { action: 'feed', emoji: '🍖', title: '投喂' },
        { action: 'bath', emoji: '🛁', title: '洗澡' },
        { action: 'sleep', emoji: '🛏️', title: '睡觉' },
        { action: 'chat', emoji: '💬', title: '聊天' },
        { action: 'diary', emoji: '📔', title: '日记' },
        { action: 'settings', emoji: '⚙️', title: '设置' }
      ];
  
      return buttons.map(btn => {
        const customIcon = settings.menuIcons && settings.menuIcons[btn.action];
        const hasCustom = !!customIcon;
        const iconHTML = customIcon 
          ? `<img src="${customIcon}" alt="${btn.title}" />`
          : btn.emoji;
        return `<button class="sp-menu-btn ${hasCustom ? 'has-custom-icon' : ''}" data-action="${btn.action}" title="${btn.title}">${iconHTML}</button>`;
      }).join('');
    }



  // ============================================================
  // UI 渲染 - 桌宠主体
  // ============================================================
 function renderPetUI() {
    const container = document.createElement('div');
    container.id = 'silly-pet-container';
    container.style.position = 'fixed';
    container.style.zIndex = '2147483647';
    // 默认隐藏，等 showPet 被调用时再显示
    container.style.display = 'none';
    container.innerHTML = `
      <div id="silly-pet-mood">${getMoodEmoji()}</div>
      <div id="silly-pet-bubble"></div>
      <div id="silly-pet-menu">
        ${renderMenuButtons()}
      </div>
      <div id="silly-pet-sprite" class="idle"></div>
      <div id="silly-pet-status-bar">
        <div class="sp-stat"><span class="sp-stat-icon">🍖</span><div class="sp-stat-bar"><div class="sp-stat-fill hunger" id="sp-hunger-fill"></div></div></div>
        <div class="sp-stat"><span class="sp-stat-icon">💧</span><div class="sp-stat-bar"><div class="sp-stat-fill clean" id="sp-clean-fill"></div></div></div>
        <div class="sp-stat"><span class="sp-stat-icon">⚡</span><div class="sp-stat-bar"><div class="sp-stat-fill energy" id="sp-energy-fill"></div></div></div>
      </div>
    `;
    document.body.appendChild(container);

    // 互动贴图容器
    const interactionItem = document.createElement('div');
    interactionItem.id = 'silly-pet-interaction-item';
    document.body.appendChild(interactionItem);

    // 聊天框
    const chat = document.createElement('div');
    chat.id = 'silly-pet-chat';
    chat.style.zIndex = '2147483646';
    chat.innerHTML = `
      <div id="silly-pet-chat-header">
        <span>🐾 <span id="sp-chat-title-name">${settings.petName || '咪噗'}</span>聊天</span>
        <div style="display:flex;gap:6px;">
          <button id="sp-chat-offline-toggle" style="background:none;border:none;font-size:13px;cursor:pointer;color:#aaa;opacity:0.6;" title="线下模式">🌙</button>
          <button id="sp-chat-minimize" style="background:none;border:none;font-size:14px;cursor:pointer;color:#aaa;" title="缩小悬挂">─</button>
          <button id="sp-chat-close" style="background:none;border:none;font-size:16px;cursor:pointer;color:#aaa;" title="关闭">✕</button>
        </div>
      </div>
      <div id="silly-pet-chat-messages"></div>
      <div id="sp-chat-token-bar" style="padding:2px 12px;font-size:10px;color:#666;text-align:right;border-top:1px solid rgba(255,255,255,0.05);"><span id="sp-token-display">~0 tokens</span></div>
      <div id="silly-pet-chat-input">
        <div id="sp-emoji-preview-bar">
          <span>📎 表情:</span>
          <img id="sp-emoji-preview-img" src="" alt="" />
          <span class="sp-emoji-preview-remove" id="sp-emoji-preview-remove" title="移除">✕</span>
        </div>
        <div id="sp-emoji-panel"></div>
        <div id="silly-pet-chat-input-row">
          <button id="sp-chat-emoji-toggle" title="表情包">😺</button>
          <input type="text" placeholder="跟咪噗说点什么..." id="sp-chat-input-field" />
          <button id="sp-chat-send-msg-btn" title="发送消息（不生成回复）">📨</button>
          <button id="sp-chat-generate-btn" title="生成回复">➤</button>
        </div>
      </div>
    `;
    document.body.appendChild(chat);

    // 总结确认弹窗
    const modal = document.createElement('div');
    modal.id = 'silly-pet-summary-modal';
    modal.innerHTML = `
      <div class="sp-modal-content">
        <h3>📝 咪噗记忆总结</h3>
        <p style="font-size:12px;color:#666;">选择总结范围，确认后保存：</p>
        <div style="display:flex;gap:8px;margin-bottom:10px;align-items:center;flex-wrap:wrap;">
          <label style="font-size:12px;color:#bbb;margin:0;">从第</label>
          <input type="number" id="sp-summary-from" min="1" value="1" style="width:60px;padding:4px 6px;font-size:12px;margin:0;" />
          <label style="font-size:12px;color:#bbb;margin:0;">条 到第</label>
          <input type="number" id="sp-summary-to" min="1" value="1" style="width:60px;padding:4px 6px;font-size:12px;margin:0;" />
          <label style="font-size:12px;color:#bbb;margin:0;">条</label>
          <button class="sp-btn" id="sp-summary-regenerate" type="button">🔄 重新生成</button>
        </div>
        <textarea id="sp-summary-edit"></textarea>
        <div class="sp-modal-actions">
          <button class="sp-btn" id="sp-summary-cancel">取消</button>
          <button class="sp-btn sp-btn-primary" id="sp-summary-confirm">确认保存</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    // 表情包管理弹窗
    const emojiModal = document.createElement('div');
    emojiModal.id = 'sp-emoji-modal-overlay';
    emojiModal.innerHTML = `
      <div id="sp-emoji-modal">
        <h4 id="sp-emoji-modal-title">✏️ 编辑表情包</h4>
        <div class="sp-emoji-modal-preview">
          <img id="sp-emoji-modal-img" src="" alt="" />
          <span id="sp-emoji-modal-name-display" style="font-size:12px;color:#999;"></span>
        </div>
        <input type="text" id="sp-emoji-modal-input" placeholder="给表情包起个名字（如：委屈脸）" />
        <div class="sp-emoji-modal-actions">
          <button class="sp-emoji-modal-delete" id="sp-emoji-modal-delete">🗑️ 删除</button>
          <button id="sp-emoji-modal-cancel">取消</button>
          <button class="sp-emoji-modal-confirm" id="sp-emoji-modal-save">✓ 保存</button>
        </div>
      </div>
    `;
    document.body.appendChild(emojiModal);

    // 日记悬浮窗
    const diary = document.createElement('div');
    diary.id = 'silly-pet-diary';
    diary.style.zIndex = '2147483646';
    diary.innerHTML = `
      <div id="sp-diary-header">
        <span>📔 ${settings.petName || '咪噗'}的日记</span>
        <div style="display:flex;gap:6px;">
          <button id="sp-diary-close" style="background:none;border:none;font-size:16px;cursor:pointer;color:#aaa;" title="关闭">✕</button>
        </div>
      </div>
      <div id="sp-diary-body">
        <div class="sp-diary-calendar" id="sp-diary-calendar"></div>
        <div id="sp-diary-content"></div>
      </div>
      <div id="sp-diary-generate-section">
        <div class="sp-diary-range-row">
          <label>📝 记忆范围:</label>
          <span>第</span>
          <input type="number" id="sp-diary-mem-from" min="1" value="1" />
          <span>到</span>
          <input type="number" id="sp-diary-mem-to" min="1" value="1" />
          <span>条</span>
        </div>
        <div class="sp-diary-range-row">
          <label>💬 聊天范围:</label>
          <span>第</span>
          <input type="number" id="sp-diary-chat-from" min="1" value="1" />
          <span>到</span>
          <input type="number" id="sp-diary-chat-to" min="1" value="1" />
          <span>条</span>
        </div>
        <div class="sp-diary-range-hint" id="sp-diary-range-hint"></div>
        <button id="sp-diary-generate-btn">✨ 生成今日日记</button>
        <button id="sp-diary-export-btn" style="width:100%;padding:6px;font-size:11px;margin-top:6px;background:var(--sp-bg-light);color:var(--sp-text-secondary);border:1px solid var(--sp-border);border-radius:6px;cursor:pointer;">📄 导出全部日记</button>
      </div>
    `;
    document.body.appendChild(diary);

    updateStatusBars();
    updateSpriteImage();
  }


  function updateStatusBars() {
    const hungerFill = document.getElementById('sp-hunger-fill');
    const cleanFill = document.getElementById('sp-clean-fill');
    const energyFill = document.getElementById('sp-energy-fill');
    if (hungerFill) hungerFill.style.width = `${state.hunger}%`;
    if (cleanFill) cleanFill.style.width = `${state.cleanliness}%`;
    if (energyFill) energyFill.style.width = `${state.energy}%`;
  }

  function updateMoodDisplay() {
    const moodEl = document.getElementById('silly-pet-mood');
    if (!moodEl) return;

    const moodImg = settings.moodImages && settings.moodImages[state.mood];
    if (moodImg) {
      moodEl.innerHTML = `<img src="${moodImg}" style="width:18px;height:18px;object-fit:contain;" />`;
    } else {
      moodEl.textContent = getMoodEmoji();
    }
  }

  // ============================================================
  // 图片压缩工具
  // ============================================================
  function compressImage(dataUrl, maxWidth = 200, quality = 0.7) {
    return new Promise((resolve) => {
      // GIF 不压缩，保留动画帧
      if (dataUrl.startsWith('data:image/gif')) {
        resolve(dataUrl);
        return;
      }
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > maxWidth) { h = h * (maxWidth / w); w = maxWidth; }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/webp', quality));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }



  function updateSpriteImage(override) {
    const sprite = document.getElementById('silly-pet-sprite');
    if (!sprite) return;

    let img = override || null;

    if (!img) {
      // 只有在"低落"状态时才使用对应 mood 图片
      // 正常状态（happy/neutral）一律显示 idle
      switch (state.mood) {
        case 'sleepy': img = settings.spriteSleep || settings.spriteIdle; break;
        case 'sad': img = settings.spriteSad || settings.spriteIdle; break;
        default: img = settings.spriteIdle; break;
      }
    }

    if (img) {
      sprite.style.backgroundImage = `url(${img})`;
      sprite.textContent = '';
      sprite.style.fontSize = '';
      sprite.style.lineHeight = '';
    } else {
      sprite.style.backgroundImage = 'none';
      sprite.textContent = state.mood === 'sleepy' ? '😴' : '🐱';
      sprite.style.fontSize = '64px';
      sprite.style.textAlign = 'center';
      sprite.style.lineHeight = '160px';
    }
  }
// ============================================================
// 精灵状态锁机制
// ============================================================

/**
 * 设置带锁的精灵图状态
 */
function setSpriteWithLock(lockName, spriteImage, duration = null) {
  // 清掉旧的恢复定时器
  if (spriteStateLockTimer) {
    clearTimeout(spriteStateLockTimer);
    spriteStateLockTimer = null;
  }

  spriteStateLock = lockName;
  updateSpriteImage(spriteImage);

  if (duration !== null && duration > 0) {
    spriteStateLockTimer = setTimeout(() => {
      // 只有锁还是自己的才恢复
      if (spriteStateLock === lockName) {
        spriteStateLock = null;
        spriteStateLockTimer = null;
        updateSpriteImage(); // 恢复为默认状态
      }
    }, duration);
  }
}

/**
 * 清除精灵状态锁并恢复默认
 */
function clearSpriteLock() {
  if (spriteStateLockTimer) {
    clearTimeout(spriteStateLockTimer);
    spriteStateLockTimer = null;
  }
  spriteStateLock = null;
  updateSpriteImage();
}


  // ============================================================
  // 气泡
  // ============================================================
  function showBubble(text, duration = 5000) {
    if (!settings.enabled) return;
    const bubble = document.getElementById('silly-pet-bubble');
    if (!bubble) return;
    bubble.textContent = text;
    bubble.classList.add('visible');
    clearTimeout(bubble._hideTimer);
    bubble._hideTimer = setTimeout(() => bubble.classList.remove('visible'), duration);
  }


  // ============================================================
  // 闲逛系统
  // ============================================================
    function startWandering() {
    if (wanderInterval) clearInterval(wanderInterval);
    const interval = (settings.wanderInterval || 8) * 1000;
    wanderInterval = setInterval(() => {
      if (isDragging || state.mood === 'sleepy') return;
      wanderStep();
    }, interval);
  }


  function wanderStep() {
    const container = document.getElementById('silly-pet-container');
    const sprite = document.getElementById('silly-pet-sprite');
    if (!container || !sprite) return;

    // 吸附状态下不走动
    if (container.classList.contains('sp-edge-left') || container.classList.contains('sp-edge-right') || container.classList.contains('sp-edge-top')) return;

    if (spriteStateLock) return;

    const isMobile = window.innerWidth <= 768;
    const petWidth = isMobile ? 60 : 120;
    const petHeight = isMobile ? 85 : 160;
    const maxX = window.innerWidth - petWidth - 10;
    const maxY = window.innerHeight - petHeight - 40;
    const currentLeft = parseInt(container.style.left);
    const currentTop = parseInt(container.style.top);

    const safeLeft = (isNaN(currentLeft) || currentLeft > maxX || currentLeft < 0)
      ? maxX - 20 : currentLeft;
    const safeTop = (isNaN(currentTop) || currentTop > maxY || currentTop < 0)
      ? maxY - 20 : currentTop;

    const deltaX = (Math.random() - 0.5) * (isMobile ? 80 : 200);
    const deltaY = (Math.random() - 0.5) * (isMobile ? 40 : 100);

    let targetX = Math.max(10, Math.min(maxX, safeLeft + deltaX));
    let targetY = Math.max(10, Math.min(maxY, safeTop + deltaY));

    const absDX = Math.abs(targetX - safeLeft);
    const absDY = Math.abs(targetY - safeTop);
    let walkSprite = '';

    if (absDX >= absDY) {
      if (targetX < safeLeft) {
        walkSprite = settings.spriteWalkLeft || settings.spriteWalkRight || settings.spriteIdle;
        sprite.classList.remove('flip');
      } else {
        walkSprite = settings.spriteWalkRight || settings.spriteWalkLeft || settings.spriteIdle;
        sprite.classList.remove('flip');
      }
    } else {
      if (targetY < safeTop) {
        walkSprite = settings.spriteWalkUp || settings.spriteWalkLeft || settings.spriteIdle;
      } else {
        walkSprite = settings.spriteWalkDown || settings.spriteWalkLeft || settings.spriteIdle;
      }
      sprite.classList.remove('flip');
    }

    container.style.left = targetX + 'px';
    container.style.top = targetY + 'px';
    container.style.bottom = 'auto';
    container.style.right = 'auto';

    if (walkSprite && walkSprite !== settings.spriteIdle) {
      const walkDuration = (settings.spriteDurations && settings.spriteDurations.spriteWalk) || 2000;
      setSpriteWithLock('walk', walkSprite, walkDuration);
    }

    maybeDoIdleAction();
  }




  function maybeDoIdleAction() {
    const roll = Math.random() * 100;
    const chance = settings.activityLevel * 0.3;

    if (roll < chance * 0.1 && settings.enableAutoReact && canReact()) {
      triggerAutoComment();
    } else if (roll < chance * 0.3) {
      const bubbles = settings.reactions.idle.split('|').map(s => s.trim()).filter(Boolean);
      if (state.mood === 'hungry') bubbles.push(...settings.reactions.idleHungry.split('|').map(s => s.trim()).filter(Boolean));
      if (state.mood === 'dirty') bubbles.push(...settings.reactions.idleDirty.split('|').map(s => s.trim()).filter(Boolean));
      if (state.mood === 'sleepy') bubbles.push(...settings.reactions.idleSleepy.split('|').map(s => s.trim()).filter(Boolean));
      showBubble(bubbles[Math.floor(Math.random() * bubbles.length)], 3000);
    } else if (roll < chance * 0.5 && settings.customSprites && settings.customSprites.length > 0) {
      const validSprites = settings.customSprites.filter(s => s.image);
      if (validSprites.length > 0) {
        const chosen = validSprites[Math.floor(Math.random() * validSprites.length)];
        const dur = chosen.duration || 2500;
        setSpriteWithLock('custom', chosen.image, dur);
        if (chosen.name) showBubble(`（${chosen.name}）`, 2000);
      }
    }
  }

  // ============================================================
  // 核心控制：斜杠指令集中处理器（已修复：新旧版本参数智能兼容解析）
  // ============================================================
  function handlePetCommand(args, value) {
    let subCommand = 'status';
    let payload = '';

    // 情况 1：如果 args 是数组 (兼容部分老版本酒馆)
    if (Array.isArray(args) && args.length > 0) {
      subCommand = args[0].toLowerCase();
      payload = args.slice(1).join(' ');
    }
    // 情况 2：现代酒馆标准，args 是命名参数对象，value 是主体字符串 (例如 "/pet chat 123" -> value 是 "chat 123")
    else if (typeof value === 'string' && value.trim()) {
      const parts = value.trim().split(/\s+/);
      subCommand = parts[0].toLowerCase();
      payload = parts.slice(1).join(' ');
    }
    // 情况 3：如果只输入了 "/pet"
    else {
      subCommand = 'status';
      payload = '';
    }

    console.log(`[meep-pet] 收到斜杠指令 -> 子命令: "${subCommand}", 参数: "${payload}"`);

    switch (subCommand) {
      case 'status':
        return `🐾 **${settings.petName} 状态：**\n` +
               `🍖 饱食度: ${Math.round(state.hunger)}%\n` +
               `💧 清洁度: ${Math.round(state.cleanliness)}%\n` +
               `⚡ 精力值: ${Math.round(state.energy)}%\n` +
               `${getMoodEmoji()} 当前心情: ${state.mood}`;
      
      case 'feed':
        feedPet();
        return `🍖 你投喂了 ${settings.petName}！`;
      
      case 'bath':
        bathPet();
        return `🛁 你拉着 ${settings.petName} 泡了个热水澡！`;
      
      case 'sleep':
        sleepPet();
        return `🛏️ ${settings.petName} 揉了揉眼睛，睡觉去了...`;
      
      case 'summon':
        const container = document.getElementById('silly-pet-container');
        if (container) {
          container.style.transition = 'none';
          container.style.left = '50vw';
          container.style.top = '50vh';
          container.style.transform = '';
          container.offsetHeight; // 强制重绘
          container.style.transition = '';
          showBubble('呼！谢谢主人把我拉回来～❤');
          return `🐾 已强行将 ${settings.petName} 召唤回屏幕正中心！`;
        }
        return '❌ 召回失败：未找到桌宠实体。';
      
      case 'toggle':
        settings.enabled = !settings.enabled;
        const toggleTop = document.getElementById('sp-enabled-toggle-top');
        if (toggleTop) toggleTop.checked = settings.enabled;
        
        if (settings.enabled) {
          showPet();
          startWandering();
          startDecayTimer();
          showBubble('我又出来啦～✨');
        } else {
          hidePet();
        }
        saveData();
        return `🐾 桌宠已${settings.enabled ? '【启用】' : '【禁用】'}`;
      
      case 'chat':
        if (!payload.trim()) {
          return `❌ 用法：/pet chat <你想对${settings.petName}说的话>`;
        }
        // 如果聊天框没开，帮用户强行打开
        if (!isChatOpen) toggleChat();
        
        // 发送消息给桌宠
        sendChatMessage(payload);
        return `💬 正在将口信传达给 ${settings.petName}...`;
      
      default:
        return `❌ 未知指令。可用子命令：\n` +
               `- \`/pet status\` 查看桌宠状态\n` +
               `- \`/pet feed\` 投喂食物\n` +
               `- \`/pet bath\` 泡澡清洁\n` +
               `- \`/pet sleep\` 睡觉补充精力\n` +
               `- \`/pet summon\` 强行召唤到屏幕中心\n` +
               `- \`/pet toggle\` 切换桌宠开启/关闭\n` +
               `- \`/pet chat <内容>\` 隔空开启对话`;
    }
  }

  // ============================================================
  // 健壮性：SillyTavern 快捷斜杠指令注册（已修复参数传递与丢失 Bug）
  // ============================================================
  function registerSlashCommands() {
    const maxAttempts = 20; // 最多轮询尝试 10 秒
    let attempts = 0;

    const tryRegister = () => {
      attempts++;
      const context = getContext();

      if (!context) {
        if (attempts < maxAttempts) {
          setTimeout(tryRegister, 500); // 500毫秒后重试
        } else {
          console.error(`[${PLUGIN_NAME}] 轮询超时：未找到酒馆有效上下文，无法注册指令。`);
        }
        return;
      }

      // 1. 尝试使用标准 registerSlashCommand（直接扁平传递参数）
      if (typeof context.registerSlashCommand === 'function') {
        try {
          context.registerSlashCommand(
            'pet',
            (args, value) => handlePetCommand(args, value),
            [], // 别名 (Aliases)
            `🐾 桌宠控制中心。用法: /pet [status | feed | bath | sleep | summon | toggle | chat]`,
            true,  // isLocal (仅本地有效)
            false  // isHidden (设为 false，确保输入 / 时能在联想菜单中看到)
          );
          console.log(`[${PLUGIN_NAME}] 成功使用 [酒馆标准 ES 模块 API] 注册 /pet 指令`);
          return;
        } catch (e) {
          console.warn(`[${PLUGIN_NAME}] 标准注册尝试失败，转向备用注册方案:`, e);
        }
      }

      // 2. 备用手段：尝试传统的 slashCommands 注册（兼容老版本酒馆）
      const registry = context.slashCommands || window.SillyTavern?.slashCommands || window.parent?.SillyTavern?.slashCommands;
      if (registry && typeof registry.registerCommand === 'function') {
        try {
          registry.registerCommand(
            'pet',
            (args, value) => handlePetCommand(args, value),
            [],
            `🐾 桌宠控制中心。用法: /pet [status | feed | bath | sleep | summon | toggle | chat]`,
            true, // isRequired
            true  // isLocal
          );
          console.log(`[${PLUGIN_NAME}] 成功使用 [传统全局 API] 注册 /pet 指令`);
          return;
        } catch (e) {
          console.error(`[${PLUGIN_NAME}] 所有注册手段均失败:`, e);
        }
      }

      // 如果当前上下文还没准备好这些属性，继续等
      if (attempts < maxAttempts) {
        setTimeout(tryRegister, 500);
      }
    };

    tryRegister();
  }


  // ============================================================
  // 拖拽交互（已优化：硬件加速 transform & 边缘吸附）
  // ============================================================
  function bindDragEvents() {
    const container = document.getElementById('silly-pet-container');
    const sprite = document.getElementById('silly-pet-sprite');
    if (!sprite || !container) return;

    let startX = 0, startY = 0, startTime = 0, moved = false;
    let startLeft = 0, startTop = 0;
    let lastMoveX = 0, lastMoveY = 0; // 用于精准记录最后一次移动坐标，防止松手抖动
    let isPointerDown = false;
    let lastTapTime = 0;

    const pointerDown = (e) => {
      isPointerDown = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      startX = clientX;
      startY = clientY;
      lastMoveX = clientX;
      lastMoveY = clientY;
      startTime = Date.now();
      moved = false;
      isDragging = false;

      // 记录初始 left/top 绝对坐标
      startLeft = parseInt(container.style.left) || 0;
      startTop = parseInt(container.style.top) || 0;
    };

    const pointerMove = (e) => {
      if (!isPointerDown) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      lastMoveX = clientX;
      lastMoveY = clientY;

      const dist = Math.hypot(clientX - startX, clientY - startY);

      // 位移超过 5 像素判定为拖拽
      if (dist > 5 && !isDragging) {
        isDragging = true;
        moved = true;
        container.classList.add('dragging');
        // 拖拽开始，清除上一次的吸附状态
        container.classList.remove('sp-edge-left', 'sp-edge-right', 'sp-edge-top');
        if (spriteStateLock === 'hang') {
          spriteStateLock = null;
          if (spriteStateLockTimer) { 
            clearTimeout(spriteStateLockTimer); 
            spriteStateLockTimer = null; 
          }
        }
        if (settings.spriteDrag) setSpriteWithLock('drag', settings.spriteDrag, null);
      }

      if (isDragging) {
        if (e.cancelable) e.preventDefault();
        
        let dx = clientX - startX;
        let dy = clientY - startY;

        const maxLeft = window.innerWidth - container.offsetWidth;
        const maxTop = window.innerHeight - container.offsetHeight;

        // 计算边界约束，限制 dx/dy，不让桌宠滑出屏幕
        let targetLeft = startLeft + dx;
        let targetTop = startTop + dy;

        if (targetLeft < 0) dx = -startLeft;
        else if (targetLeft > maxLeft) dx = maxLeft - startLeft;

        if (targetTop < 0) dy = -startTop;
        else if (targetTop > maxTop) dy = maxTop - startTop;

        // 【关键性能优化】改用 translate3d 触发 GPU 硬件加速，不触发 layout 重排
        const scale = settings.petScale || 1.0;
        container.style.transform = `scale(${scale}) translate3d(${dx / scale}px, ${dy / scale}px, 0)`;
        container.style.transformOrigin = 'center bottom';
      }
    };

    const pointerUp = (e) => {
      if (!isPointerDown) return;
      isPointerDown = false;

      if (isDragging) {
        isDragging = false;
        container.classList.remove('dragging');

        // 计算最终落点
        const dx = lastMoveX - startX;
        const dy = lastMoveY - startY;

        let left = startLeft + dx;
        let top = startTop + dy;

        const maxLeft = window.innerWidth - container.offsetWidth;
        const maxTop = window.innerHeight - container.offsetHeight;

        left = Math.max(0, Math.min(maxLeft, left));
        top = Math.max(0, Math.min(maxTop, top));

        // 【关键优化：落点无缝写入】
        // 1. 临时禁用 CSS 中的 2 秒过度动画，防止松手时出现“慢慢滑行”的漂移 Bug
        container.style.transition = 'none';
        // 2. 清除 transform 偏移
        const scale = settings.petScale || 1.0;
        container.style.transform = `scale(${scale})`;
        container.style.transformOrigin = 'center bottom';
        // 3. 将最终坐标写入 left/top
        container.style.left = left + 'px';
        container.style.top = top + 'px';
        container.style.bottom = 'auto';

        // 4. 强制浏览器强制重绘（Reflow），使改动立刻生效
        container.offsetHeight; 

        // 5. 恢复原本的 wandering CSS 过渡
        container.style.transition = '';

        // 边缘吸附检测
        const snapThreshold = settings.edgeSnapThreshold || 20;
        let snapped = false;

        if (left <= snapThreshold) {
          container.style.left = '0px';
          container.classList.add('sp-edge-left');
          container.classList.remove('sp-edge-right', 'sp-edge-top');
          if (settings.spriteHangLeft) { 
            setSpriteWithLock('hang', settings.spriteHangLeft, null); 
            snapped = true; 
          }
        } else if (left >= window.innerWidth - container.offsetWidth - snapThreshold) {
          container.style.left = (window.innerWidth - container.offsetWidth) + 'px';
          container.classList.add('sp-edge-right');
          container.classList.remove('sp-edge-left', 'sp-edge-top');
          if (settings.spriteHangRight) { 
            setSpriteWithLock('hang', settings.spriteHangRight, null); 
            snapped = true; 
          }
        } else if (top <= snapThreshold) {
          container.style.top = '0px';
          container.classList.add('sp-edge-top');
          container.classList.remove('sp-edge-left', 'sp-edge-right');
          if (settings.spriteHangTop) { 
            setSpriteWithLock('hang', settings.spriteHangTop, null); 
            snapped = true; 
          }
        } else {
          container.classList.remove('sp-edge-left', 'sp-edge-right', 'sp-edge-top');
          if (spriteStateLock === 'hang') {
            clearSpriteLock();
          }
        }

        if (!snapped) {
          if (settings.spriteDizzy) {
            const dur = (settings.spriteDurations && settings.spriteDurations.spriteDizzy) || 2500;
            setSpriteWithLock('dizzy', settings.spriteDizzy, dur);
          }
        }

        const reactions = settings.reactions.drag.split('|').map(s => s.trim()).filter(Boolean);
        showBubble(reactions[Math.floor(Math.random() * reactions.length)], 2500);
        state.totalInteractions++;
        saveData();
      } else if (!moved && Date.now() - startTime < 300) {
        // 点击/轻触逻辑
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
          const now = Date.now();
          if (now - lastTapTime < 400) {
            toggleMenu();
            lastTapTime = 0;
          } else {
            lastTapTime = now;
          }
        } else {
          toggleMenu();
        }
      }
    };

    sprite.addEventListener('mousedown', pointerDown);
    sprite.addEventListener('touchstart', pointerDown, { passive: true });
    document.addEventListener('mousemove', pointerMove);
    document.addEventListener('touchmove', pointerMove, { passive: false });
    document.addEventListener('mouseup', pointerUp);
    document.addEventListener('touchend', pointerUp);
  }

// ============================================================
// 互动贴图显示
// ============================================================
function showInteractionItem(imageSrc) {
  if (!imageSrc) return;
  
  const item = document.getElementById('silly-pet-interaction-item');
  const container = document.getElementById('silly-pet-container');
  if (!item || !container) return;

  // 清除之前的动画
  item.classList.remove('active', 'floating');
  item.innerHTML = '';

  const containerRect = container.getBoundingClientRect();
  const startX = containerRect.left + containerRect.width / 2 - 24;
  const startY = containerRect.top - 60;

  item.style.left = startX + 'px';
  item.style.top = startY + 'px';
  item.innerHTML = `<img src="${imageSrc}" alt="interaction" />`;

  // 出现
  requestAnimationFrame(() => {
    item.classList.add('active');
    
    // 移动到桌宠位置
    setTimeout(() => {
      const targetX = containerRect.left + containerRect.width / 2 - 24;
      const targetY = containerRect.top + containerRect.height / 2 - 24;
      item.style.left = targetX + 'px';
      item.style.top = targetY + 'px';
      item.classList.add('floating');
      
      // 消失
      setTimeout(() => {
        item.classList.remove('active');
        setTimeout(() => {
          item.classList.remove('floating');
          item.innerHTML = '';
        }, 600);
      }, 800);
    }, 100);
  });
}

  // ============================================================
  // 互动功能
  // ============================================================
function feedPet() {
  // 显示互动贴图
  if (settings.foodImage) showInteractionItem(settings.foodImage);
  
  state.hunger = Math.min(100, state.hunger + 25);
  state.lastFed = Date.now();
  state.totalInteractions++;

  // 优先用吃东西的图，没有则用开心图
  const actionSprite = settings.spriteEat || settings.spriteHappy;
  if (actionSprite) {
    updateSpriteImage(actionSprite);
    const dur = (settings.spriteDurations && settings.spriteDurations.spriteEat) || 2000;
    setTimeout(() => updateSpriteImage(), dur);
  }

  showBubble(settings.reactions.feed, 3000);
  updateMood(); updateStatusBars(); saveData();
}

function bathPet() {
  // 显示互动贴图
  if (settings.bathImage) showInteractionItem(settings.bathImage);
  
  state.cleanliness = Math.min(100, state.cleanliness + 30);
  state.lastBathed = Date.now();
  state.totalInteractions++;

  if (settings.spriteBath) {
    updateSpriteImage(settings.spriteBath);
    const dur = (settings.spriteDurations && settings.spriteDurations.spriteBath) || 2500;
    setTimeout(() => updateSpriteImage(), dur);
  }

  showBubble(settings.reactions.bath, 3000);
  updateMood(); updateStatusBars(); saveData();
}

function sleepPet() {
  // 显示互动贴图
  if (settings.bedImage) showInteractionItem(settings.bedImage);
  
  state.energy = Math.min(100, state.energy + 35);
  state.lastSlept = Date.now();
  state.totalInteractions++;

  if (settings.spriteSleep) {
    updateSpriteImage(settings.spriteSleep);
    const dur = (settings.spriteDurations && settings.spriteDurations.spriteSleep) || 8000;
    setTimeout(() => updateSpriteImage(), dur);
  }

  showBubble(settings.reactions.sleep, 4000);
  updateMood(); updateStatusBars(); saveData();
}


  function toggleMenu() {
    const menu = document.getElementById('silly-pet-menu');
    if (!menu) return;
    isMenuOpen = !isMenuOpen;
    menu.classList.toggle('visible', isMenuOpen);
  }

  function handleMenuAction(action) {
    switch (action) {
      case 'feed': feedPet(); break;
      case 'bath': bathPet(); break;
      case 'sleep': sleepPet(); break;
      case 'chat': toggleChat(); break;
      case 'diary': toggleDiary(); break;
      case 'settings': toggleSettings(); break;
    }
    toggleMenu();
  }

  function showEmojiEditModal(idx) {
    const overlay = document.getElementById('sp-emoji-modal-overlay');
    const img = document.getElementById('sp-emoji-modal-img');
    const input = document.getElementById('sp-emoji-modal-input');
    const nameDisplay = document.getElementById('sp-emoji-modal-name-display');
    if (!overlay || !img || !input) return;

    const sticker = emojiStickers[idx];
    if (!sticker) return;

    img.src = sticker.image;
    input.value = sticker.name || '';
    nameDisplay.textContent = sticker.name ? `当前: ${sticker.name}` : '未命名';
    overlay.classList.add('visible');

    // 手动居中定位（兼容移动端）
    const modal = document.getElementById('sp-emoji-modal');
    if (modal) {
      requestAnimationFrame(() => {
        const modalH = modal.offsetHeight || 200;
        const modalW = modal.offsetWidth || 280;
        modal.style.top = Math.max(20, Math.floor((window.innerHeight - modalH) / 2)) + 'px';
        modal.style.left = Math.floor((window.innerWidth - modalW) / 2) + 'px';
        modal.style.transform = 'none';
      });
    }

    // 保存
    document.getElementById('sp-emoji-modal-save').onclick = () => {
      emojiStickers[idx].name = input.value.trim();
      settings.emojiStickers = emojiStickers;
      saveData();
      overlay.classList.remove('visible');
      renderEmojiPanel();
      if (input.value.trim()) showBubble(`表情已命名为「${input.value.trim()}」`, 2000);
    };

    // 删除
    document.getElementById('sp-emoji-modal-delete').onclick = () => {
      if (selectedEmoji === sticker.image) {
        selectedEmoji = null;
        updateEmojiPreviewBar();
      }
      emojiStickers.splice(idx, 1);
      settings.emojiStickers = emojiStickers;
      saveData();
      overlay.classList.remove('visible');
      renderEmojiPanel();
      showBubble('表情包已删除', 2000);
    };

    // 取消
    document.getElementById('sp-emoji-modal-cancel').onclick = () => {
      overlay.classList.remove('visible');
    };

    // 点遮罩关闭
    overlay.onclick = (e) => {
      if (e.target === overlay) overlay.classList.remove('visible');
    };

    // 聚焦输入框，并监听键盘弹出后重新定位
    setTimeout(() => {
      input.focus();
      // 移动端键盘弹出时重新定位弹窗到可见区域顶部
      if (window.visualViewport) {
        const reposition = () => {
          const modal = document.getElementById('sp-emoji-modal');
          if (!modal || !overlay.classList.contains('visible')) {
            window.visualViewport.removeEventListener('resize', reposition);
            return;
          }
          const vh = window.visualViewport.height;
          const modalH = modal.offsetHeight || 200;
          modal.style.top = Math.max(10, Math.floor((vh - modalH) / 2) + window.visualViewport.offsetTop) + 'px';
        };
        window.visualViewport.addEventListener('resize', reposition);
        // 弹窗关闭时清理
        const origClose = overlay.onclick;
        const cleanup = () => {
          window.visualViewport.removeEventListener('resize', reposition);
        };
        document.getElementById('sp-emoji-modal-save').addEventListener('click', cleanup, { once: true });
        document.getElementById('sp-emoji-modal-delete').addEventListener('click', cleanup, { once: true });
        document.getElementById('sp-emoji-modal-cancel').addEventListener('click', cleanup, { once: true });
      }
    }, 100);

  }

  // ============================================================
  // 表情包系统
  // ============================================================
  function renderEmojiPanel() {
    const panel = document.getElementById('sp-emoji-panel');
    if (!panel) return;

    let html = '';
    emojiStickers.forEach((sticker, idx) => {
      const selectedClass = (selectedEmoji && selectedEmoji === sticker.image) ? ' selected' : '';
      html += `<div class="sp-emoji-item${selectedClass}" data-emoji-idx="${idx}" title="${sticker.name || '表情' + (idx + 1)}"><img src="${sticker.image}" alt="" /></div>`;
    });
    html += `<div class="sp-emoji-add-btn" id="sp-emoji-add-btn" title="添加表情包">＋</div>`;
    html += `<input type="file" id="sp-emoji-file-input" accept="image/png,image/jpeg,image/gif,image/webp" style="display:none;" />`;
    panel.innerHTML = html;

    // 绑定点击选中
    panel.querySelectorAll('.sp-emoji-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.emojiIdx);
        const sticker = emojiStickers[idx];
        if (!sticker) return;

        // 如果已经选中同一个，取消选中
        if (selectedEmoji === sticker.image) {
          selectedEmoji = null;
          item.classList.remove('selected');
          updateEmojiPreviewBar();
          return;
        }

        // 取消其他选中
        panel.querySelectorAll('.sp-emoji-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        selectedEmoji = sticker.image;
        updateEmojiPreviewBar();
      });

      // 长按/右键 → 打开编辑弹窗
      item.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const idx = parseInt(item.dataset.emojiIdx);
        showEmojiEditModal(idx);
      });

    });

    // 添加按钮
    const addBtn = document.getElementById('sp-emoji-add-btn');
    const fileInput = document.getElementById('sp-emoji-file-input');
    if (addBtn && fileInput) {
      addBtn.onclick = () => fileInput.click();
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
          showBubble('表情包图片不能超过2MB哦', 3000);
          return;
        }
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const compressed = await compressImage(ev.target.result, 120, 0.8);
          emojiStickers.push({ image: compressed, name: file.name.replace(/\.[^.]+$/, '') });
          settings.emojiStickers = emojiStickers;
          saveData();
          renderEmojiPanel();
          showBubble('表情包添加成功！', 2000);
        };
        reader.readAsDataURL(file);
        fileInput.value = '';
      };
    }
  }

  function updateEmojiPreviewBar() {
    const bar = document.getElementById('sp-emoji-preview-bar');
    const img = document.getElementById('sp-emoji-preview-img');
    if (!bar || !img) return;

    if (selectedEmoji) {
      img.src = selectedEmoji;
      bar.classList.add('visible');
    } else {
      bar.classList.remove('visible');
      img.src = '';
    }
  }

  function sendMessageOnly(text) {
    const hasText = text && text.trim();
    const hasEmoji = !!selectedEmoji;

    if (!hasText && !hasEmoji) return;

    // 如果有表情包，把它作为一条图片消息加入聊天记录
if (hasEmoji) {
    // 找到对应表情的名字
    const sticker = emojiStickers.find(s => s.image === selectedEmoji);
    const emojiName = sticker?.name || '表情包';
    const emojiMsg = `[发送了表情包: ${emojiName}]`;
    state.petChatHistory.push({ role: 'user', content: emojiMsg, image: selectedEmoji, timestamp: Date.now() });
      // 清除选中
      selectedEmoji = null;
      updateEmojiPreviewBar();
      const panel = document.getElementById('sp-emoji-panel');
      if (panel) panel.querySelectorAll('.sp-emoji-item').forEach(el => el.classList.remove('selected'));
    }

    // 如果有文字，也加入
    if (hasText) {
      state.petChatHistory.push({ role: 'user', content: text.trim(), timestamp: Date.now() });
    }

    renderChatHistory();
    saveData();

    // 更新 token 估算
    buildPromptMessages('chat', '').then(messages => {
      const tokens = estimateMessagesTokens(messages);
      updateTokenDisplay(tokens);
    });
  }

  async function generateReply() {
    if (state.petChatHistory.length === 0) {
      showBubble('先发点消息再生成回复吧～', 2000);
      return;
    }

    // 显示思考中
    const msgContainer = document.getElementById('silly-pet-chat-messages');
    const thinkingDiv = document.createElement('div');
    thinkingDiv.className = 'sp-chat-msg pet sp-thinking';
    thinkingDiv.innerHTML = '<span class="sp-thinking-dots">●●●</span>';
    if (msgContainer) {
      msgContainer.appendChild(thinkingDiv);
      msgContainer.scrollTop = msgContainer.scrollHeight;
    }

    if (settings.spriteThink) {
      setSpriteWithLock('think', settings.spriteThink, null);
    }

    try {
      const reply = await callPetAPI('chat', '');

      if (thinkingDiv.parentNode) thinkingDiv.remove();
      if (spriteStateLock === 'think') clearSpriteLock();

      if (reply) {
        state.petChatHistory.push({ role: 'assistant', content: reply, timestamp: Date.now() });
        renderChatHistory();
        showBubble(reply.slice(0, 50) + (reply.length > 50 ? '…' : ''), 4000);
        saveData();

        petUnsummarizedCount++;
        if (settings.summaryTrigger === 'auto' && settings.autoSummaryRounds > 0 && petUnsummarizedCount >= settings.autoSummaryRounds) {
          showBubble('💭 记忆有点满了，帮我整理一下？', 5000);
          setTimeout(() => triggerSummary(), 3000);
        }
      } else {
        showBubble('呜…没听到回应…检查一下API？', 4000);
      }
    } catch (err) {
      console.error(`[${PLUGIN_NAME}] generateReply 异常:`, err);
      if (thinkingDiv.parentNode) thinkingDiv.remove();
      if (spriteStateLock === 'think') clearSpriteLock();
      showBubble(`出错了: ${err.message}`, 4000);
    }
  }

  // ============================================================
  // 桌宠聊天
  // ============================================================
function toggleChat() {
  const chatEl = document.getElementById('silly-pet-chat');
  if (!chatEl) return;
  isChatOpen = !isChatOpen;
  chatEl.classList.toggle('visible', isChatOpen);
  if (isChatOpen) {
    const chatW = Math.min(320, window.innerWidth - 20);
    
    // 先显示元素，让浏览器计算出实际高度
    chatEl.style.width = chatW + 'px';
    
    // 使用 requestAnimationFrame 确保获取到渲染后的高度
    requestAnimationFrame(() => {
      const chatH = chatEl.offsetHeight;
      const maxTop = window.innerHeight - chatH - 20; // 留20px边距
      const centerTop = Math.floor((window.innerHeight - chatH) / 2);
      
      // 确保不会超出屏幕底部
      const finalTop = Math.max(10, Math.min(centerTop, maxTop));
      
      chatEl.style.left = Math.floor((window.innerWidth - chatW) / 2) + 'px';
      chatEl.style.top = finalTop + 'px';
      chatEl.style.right = 'auto';
      chatEl.style.bottom = 'auto';
    });
    
    renderChatHistory();

    // 预估当前 token
    buildPromptMessages('chat', '').then(messages => {
      const tokens = estimateMessagesTokens(messages);
      updateTokenDisplay(tokens);
    });

    // 确保事件绑定（每次打开重新绑，防止丢失）
    const inputField = document.getElementById('sp-chat-input-field');
    const sendMsgBtn = document.getElementById('sp-chat-send-msg-btn');
    const generateBtn = document.getElementById('sp-chat-generate-btn');
    const emojiToggle = document.getElementById('sp-chat-emoji-toggle');
    const emojiPreviewRemove = document.getElementById('sp-emoji-preview-remove');

    // 发送消息按钮（不生成回复）
    if (sendMsgBtn) {
      sendMsgBtn.onclick = () => {
        const val = inputField?.value || '';
        sendMessageOnly(val);
        if (inputField) inputField.value = '';
      };
    }

    // 生成回复按钮
    if (generateBtn) {
      generateBtn.onclick = () => {
        const val = inputField?.value || '';
        // 如果输入框有内容或有表情，先发送
        if (val.trim() || selectedEmoji) {
          sendMessageOnly(val);
          if (inputField) inputField.value = '';
        }
        // 然后生成回复
        generateReply();
      };
    }

    // Enter 键 = 发送消息（不生成回复）
    if (inputField) {
      inputField.onkeydown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          const val = inputField.value;
          sendMessageOnly(val);
          inputField.value = '';
        }
      };
    }

    // 表情包面板切换
    if (emojiToggle) {
      emojiToggle.onclick = () => {
        const panel = document.getElementById('sp-emoji-panel');
        if (panel) {
          const isVisible = panel.classList.contains('visible');
          panel.classList.toggle('visible', !isVisible);
          if (!isVisible) renderEmojiPanel();
        }
      };
    }

    // 移除已选表情
    if (emojiPreviewRemove) {
      emojiPreviewRemove.onclick = () => {
        selectedEmoji = null;
        updateEmojiPreviewBar();
        const panel = document.getElementById('sp-emoji-panel');
        if (panel) panel.querySelectorAll('.sp-emoji-item').forEach(el => el.classList.remove('selected'));
      };
    }

    // 渲染表情包面板
    renderEmojiPanel();

    if (window.innerWidth > 768) {
      setTimeout(() => {
        inputField?.focus({ preventScroll: true });
      }, 100);
    }
  }
}


  // ============================================================
  // 设置面板开关和拖拽
  // ============================================================
  function toggleSettings() {
    const panel = document.getElementById('silly-pet-settings');
    if (!panel) return;
    
    const isVisible = panel.classList.contains('visible');
    panel.classList.toggle('visible', !isVisible);
    
    if (!isVisible) {
      // 居中显示
      const w = Math.min(360, window.innerWidth - 20);
      const h = Math.min(panel.offsetHeight || 500, window.innerHeight * 0.8);
      panel.style.width = w + 'px';
      panel.style.left = Math.floor((window.innerWidth - w) / 2) + 'px';
      panel.style.top = Math.floor((window.innerHeight - h) / 2) + 'px';
    }
  }

  function bindSettingsClose() {
    const closeBtn = document.getElementById('sp-settings-close');
    if (closeBtn) {
      closeBtn.onclick = () => {
        const panel = document.getElementById('silly-pet-settings');
        if (panel) panel.classList.remove('visible');
      };
    }
  }

  function bindSettingsDrag() {
    const header = document.getElementById('sp-settings-header');
    const panel = document.getElementById('silly-pet-settings');
    if (!header || !panel) return;

    // 清理上一次绑定在 document 上的事件监听，避免重复叠加
    if (settingsDragAbortController) {
      settingsDragAbortController.abort();
    }
    settingsDragAbortController = new AbortController();
    const { signal } = settingsDragAbortController;

    let isDragging = false, offsetX = 0, offsetY = 0;

    const onDown = (e) => {
      if (e.target.closest('.sp-settings-close')) return;
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const rect = panel.getBoundingClientRect();
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;
    };

    const onMove = (e) => {
      if (!isDragging) return;
      if (e.cancelable) e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      let x = clientX - offsetX;
      let y = clientY - offsetY;
      x = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, x));
      y = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, y));
      panel.style.left = x + 'px';
      panel.style.top = y + 'px';
    };

    const onUp = () => { isDragging = false; };

    header.addEventListener('mousedown', onDown);
    header.addEventListener('touchstart', onDown, { passive: true });
    document.addEventListener('mousemove', onMove, { signal });
    document.addEventListener('touchmove', onMove, { passive: false, signal });
    document.addEventListener('mouseup', onUp, { signal });
    document.addEventListener('touchend', onUp, { signal });
  }


  function renderChatHistory() {
    const container = document.getElementById('silly-pet-chat-messages');
    if (!container) return;
    container.innerHTML = '';
    state.petChatHistory.slice(-30).forEach(msg => {
      const div = document.createElement('div');
      div.className = `sp-chat-msg ${msg.role === 'assistant' ? 'pet' : 'user'}`;

      // 时间戳
      let timeStr = '';
      if (msg.timestamp) {
        const d = new Date(msg.timestamp);
        timeStr = `<span style="font-size:9px;color:var(--sp-text-muted);opacity:0.6;display:block;margin-bottom:2px;">${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}</span>`;
      }

      // 如果有图片（表情包）
      if (msg.image) {
        div.innerHTML = `${timeStr}<img src="${msg.image}" style="max-width:60px;max-height:60px;border-radius:6px;display:block;margin-bottom:4px;" alt="表情" />`;
        if (msg.content && msg.content !== '[表情包]') {
          div.innerHTML += `<span>${renderMarkdown(msg.content)}</span>`;
        }
      } else {
        div.innerHTML = `${timeStr}${renderMarkdown(msg.content)}`;
      }
      container.appendChild(div);
    });
    container.scrollTop = container.scrollHeight;
  }

  async function sendChatMessage(text) {
    if (!text.trim()) return;

    try {
      state.petChatHistory.push({ role: 'user', content: text.trim(), timestamp: Date.now() });
      renderChatHistory();
      saveData();

      // 显示思考中（聊天框内）
      const msgContainer = document.getElementById('silly-pet-chat-messages');
      const thinkingDiv = document.createElement('div');
      thinkingDiv.className = 'sp-chat-msg pet sp-thinking';
      thinkingDiv.innerHTML = '<span class="sp-thinking-dots">●●●</span>';
      if (msgContainer) {
        msgContainer.appendChild(thinkingDiv);
        msgContainer.scrollTop = msgContainer.scrollHeight;
      }

      // 桌宠显示思考图片（用锁）
      if (settings.spriteThink) {
        setSpriteWithLock('think', settings.spriteThink, null);
      }

      const reply = await callPetAPI('chat', text.trim());

      // 移除思考中（非流式时移除；流式时在 callViaCustom 内部已移除）
      if (thinkingDiv.parentNode) thinkingDiv.remove();

      // 解锁思考状态
      if (spriteStateLock === 'think') {
        clearSpriteLock();
      }


      if (reply) {
        state.petChatHistory.push({ role: 'assistant', content: reply, timestamp: Date.now() });
        // 流式模式下已经有逐字显示的 div，重新渲染会闪一下但能保证数据一致
        renderChatHistory();
        showBubble(reply.slice(0, 50) + (reply.length > 50 ? '…' : ''), 4000);
        saveData();
      petUnsummarizedCount++;
      if (settings.summaryTrigger === 'auto' && settings.autoSummaryRounds > 0 && petUnsummarizedCount >= settings.autoSummaryRounds) {
        showBubble('💭 记忆有点满了，帮我整理一下？', 5000);
        setTimeout(() => triggerSummary(), 3000);
      }
      } else {
        showBubble('呜…没听到回应…检查一下API？', 4000);
      }
    } catch (err) {
      console.error(`[${PLUGIN_NAME}] sendChatMessage 异常:`, err);
      showBubble(`出错了: ${err.message}`, 4000);
      if (spriteStateLock === 'think') clearSpriteLock();
    }
  }



  // ============================================================
  // API 调用
  // ============================================================
  async function callPetAPI(mode, userMessage = '') {
    const messages = await buildPromptMessages(mode, userMessage);
    const estimatedTokens = estimateMessagesTokens(messages);
    console.log(`[${PLUGIN_NAME}] 本次请求预估 token: ~${estimatedTokens} (${mode})`);
    updateTokenDisplay(estimatedTokens);
    if (settings.apiSource === 'tavern') {
      return await callViaTavern(messages);
    } else {
      return await callViaCustom(messages);
    }
  }
  function updateTokenDisplay(tokens) {
    const el = document.getElementById('sp-token-display');
    if (el) el.textContent = `~${tokens} tokens`;
    const overview = document.getElementById('sp-token-overview');
    if (overview) overview.textContent = `~${tokens} tokens`;
  }

  // 使用酒馆当前API
  async function callViaTavern(messages) {
    try {
      const context = getContext();
      if (!context) { showBubble('酒馆API未就绪…', 3000); return null; }

      const prompt = messages.map(m => {
        if (m.role === 'system') return `[System]\n${m.content}`;
        if (m.role === 'user') return `[User]\n${m.content}`;
        return `[Assistant]\n${m.content}`;
      }).join('\n\n');

      // 优先用 generateQuietPrompt
      if (typeof context.generateQuietPrompt === 'function') {
        const result = await context.generateQuietPrompt(prompt);
        if (result && result.trim()) return result.trim();
        showBubble('API返回为空…', 3000);
        return null;
      }

      // 备用 generateRaw
      if (typeof context.generateRaw === 'function') {
        const result = await context.generateRaw(prompt, null, false, false);
        if (result && result.trim()) return result.trim();
        return null;
      }

      showBubble('未找到可用的生成接口', 3000);
      return null;
    } catch (e) {
      console.error(`[${PLUGIN_NAME}] 酒馆API失败:`, e);
      showBubble(`API出错: ${e.message}`, 3000);
      return null;
    }
  }



  // 自定义API
  async function callViaCustom(messages) {
    if (!settings.apiKey || !settings.baseUrl) {
      showBubble('请配置 API Key 和 Base URL', 3000);
      return null;
    }

    const timeoutMs = (settings.apiTimeout || 15) * 1000;

    // 非流式
    if (!settings.enableStreaming) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetch(`${settings.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.apiKey}`,
          },
          body: JSON.stringify({
            model: settings.model, messages,
            max_tokens: settings.maxTokens, temperature: 0.8,
          }),
          signal: controller.signal,
        });
        clearTimeout(timer);
        if (!response.ok) {
          console.error(`[${PLUGIN_NAME}] API ${response.status}`);
          showBubble(`API错误: ${response.status}`, 3000);
          return null;
        }
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content?.trim();
        if (!content) {
          showBubble('API返回为空…', 3000);
          return null;
        }
        return content;
      } catch (err) {
        clearTimeout(timer);
        if (err.name === 'AbortError') {
          console.error(`[${PLUGIN_NAME}] API 请求超时 (${settings.apiTimeout}s)`);
          showBubble(`请求超时了…(${settings.apiTimeout}s) 检查网络或增加超时`, 4000);
          return null;
        }
        console.error(`[${PLUGIN_NAME}] API失败:`, err);
        showBubble(`API连接失败: ${err.message}`, 4000);
        return null;
      }
    }

    // 流式输出
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(`${settings.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.apiKey}`,
        },
        body: JSON.stringify({
          model: settings.model, messages,
          max_tokens: settings.maxTokens, temperature: 0.8,
          stream: true,
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!response.ok) {
        console.error(`[${PLUGIN_NAME}] API ${response.status}`);
        showBubble(`API错误: ${response.status}`, 3000);
        return null;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let buffer = '';

      // 创建一个临时消息气泡用于逐字显示
      const msgContainer = document.getElementById('silly-pet-chat-messages');
      const streamDiv = document.createElement('div');
      streamDiv.className = 'sp-chat-msg pet';
      streamDiv.textContent = '';
      if (msgContainer) {
        // 移除思考中的点点点（如果有）
        const thinking = msgContainer.querySelector('.sp-thinking');
        if (thinking) thinking.remove();
        msgContainer.appendChild(streamDiv);
        msgContainer.scrollTop = msgContainer.scrollHeight;
      }

      // 流式读取期间用另一个超时：30秒内没有新数据则中断
      let streamTimer = null;
      const resetStreamTimer = () => {
        if (streamTimer) clearTimeout(streamTimer);
        streamTimer = setTimeout(() => {
          console.warn(`[${PLUGIN_NAME}] 流式读取超时，强制结束`);
          reader.cancel();
        }, 30000);
      };

      resetStreamTimer();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        resetStreamTimer();

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;
          const dataStr = trimmed.slice(5).trim();
          if (dataStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(dataStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              fullContent += delta;
              // 逐字更新显示（带 Markdown 渲染）
              streamDiv.innerHTML = renderMarkdown(fullContent);
              if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
            }
          } catch (e) {
            // 解析失败的行跳过
          }
        }
      }
      if (streamTimer) clearTimeout(streamTimer);

      if (!fullContent.trim()) {
        if (streamDiv.parentNode) streamDiv.remove();
        showBubble('API返回为空…', 3000);
        return null;
      }

      return fullContent.trim();
    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        console.error(`[${PLUGIN_NAME}] API 请求超时`);
        showBubble(`请求超时了…检查网络或增加超时设置`, 4000);
        return null;
      }
      console.error(`[${PLUGIN_NAME}] 流式API失败:`, err);
      showBubble(`API连接失败: ${err.message}`, 4000);
      return null;
    }
  }


  // 获取模型列表
  async function fetchModelsList() {
    const apiKey = document.getElementById('sp-api-key')?.value?.trim();
    const baseUrl = document.getElementById('sp-base-url')?.value?.trim();
    if (!apiKey || !baseUrl) { showBubble('先填 Key 和 URL', 3000); return; }

    showBubble('获取模型列表中…', 2000);
    try {
      const res = await fetch(`${baseUrl}/models`, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });
      if (!res.ok) { showBubble(`失败: ${res.status}`, 3000); return; }
      const data = await res.json();
      let models = [];
      if (data.data && Array.isArray(data.data)) models = data.data.map(m => m.id).sort();
      else if (Array.isArray(data)) models = data.map(m => typeof m === 'string' ? m : m.id).sort();

      if (models.length === 0) { showBubble('没有获取到模型', 3000); return; }

      const listEl = document.getElementById('sp-models-list');
      if (listEl) {
        listEl.innerHTML = `<div class="sp-models-dropdown-inner">${models.map(m =>
          `<div class="sp-search-dropdown-item sp-model-option" data-model="${m}"><span class="sp-item-avatar">🤖</span><span>${m}</span></div>`
        ).join('')}</div>`;
        listEl.querySelectorAll('.sp-model-option').forEach(el => {
          el.onclick = () => {
            document.getElementById('sp-model').value = el.dataset.model;
            settings.model = el.dataset.model;
            listEl.innerHTML = '';
            showBubble(`已选: ${el.dataset.model}`, 2000);
            saveData();
          };
        });
      }
      showBubble(`找到 ${models.length} 个模型`, 2000);
    } catch (e) {
      showBubble('获取失败，检查网络', 3000);
    }
  }

  // ============================================================
  // 轻量 Markdown 渲染
  // ============================================================
  function renderMarkdown(text) {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    // 加粗 **text** 或 __text__
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    // 斜体 *text* 或 _text_（不贪婪，避免误匹配）
    html = html.replace(/\*([^\*\n]+?)\*/g, '<em>$1</em>');
    html = html.replace(/(?<![a-zA-Z0-9])_([^_\n]+?)_(?![a-zA-Z0-9])/g, '<em>$1</em>');
    // 行内代码 `code`
    html = html.replace(/`([^`\n]+?)`/g, '<code style="background:rgba(100,180,255,0.1);padding:1px 4px;border-radius:3px;font-size:12px;">$1</code>');
    // 换行
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  // ============================================================
  // Token 估算
  // ============================================================
  function estimateTokens(text) {
    if (!text) return 0;
    let count = 0;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code > 0x7F) {
        count += 0.6; // 中文/CJK 字符约 0.5-0.7 token
      } else {
        count += 0.25; // 英文/ASCII 约 0.25 token per char
      }
    }
    return Math.ceil(count);
  }

  function estimateMessagesTokens(messages) {
    let total = 0;
    messages.forEach(msg => {
      total += 4; // 每条消息的固定开销（role、分隔符等）
      total += estimateTokens(msg.content);
    });
    total += 2; // 整体开销
    return total;
  }

  async function buildPromptMessages(mode, userMessage) {
    const messages = [];
    let sys = settings.systemPrompt + '\n\n' + getMoodModifier() + '\n';

    // 拼接关系描述
    if (settings.relationshipPrompt) {
      sys += `\n[与主人的关系]\n${settings.relationshipPrompt}\n`;
    }
    // 拼接 user 人设
    const userPersona = getUserPersona();
    if (userPersona) {
      sys += `\n[主人人设]\n${userPersona}\n`;
    }

    const charDesc = getCharacterDescription();
    if (charDesc) sys += `\n[角色背景参考]\n${charDesc}\n`;

    let worldInfo = '';
    try { worldInfo = await getWorldBookContent(); } catch(e) { console.warn('[meep-pet] 世界书加载失败，跳过'); }
    if (worldInfo) sys += `\n[世界设定参考]\n${worldInfo}\n`;

    if (state.summary) sys += `\n[记忆总结]\n${state.summary}\n`;
    if (state.memories.length > 0) {
      const mems = state.memories
        .map(m => typeof m === 'string' ? { content: m, importance: 3, tag: '' } : m)
        .filter(m => m.content)
        .sort((a, b) => (b.importance || 3) - (a.importance || 3))
        .slice(0, 15);
      const memText = mems.map(m => {
        const tag = m.tag ? `[${m.tag}] ` : '';
        return `${tag}${m.content}`;
      }).join('\n');
      sys += `\n[重要记忆]\n${memText}\n`;
    }
    sys += `\n[状态] 饱食:${Math.round(state.hunger)}% 清洁:${Math.round(state.cleanliness)}% 精力:${Math.round(state.energy)}% 心情:${state.mood}`;
    if (settings.enableTimeAwareness) {
      const now = new Date();
      const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
      const hour = now.getHours();
      let timeOfDay = '深夜';
      if (hour >= 5 && hour < 9) timeOfDay = '早晨';
      else if (hour >= 9 && hour < 12) timeOfDay = '上午';
      else if (hour >= 12 && hour < 14) timeOfDay = '中午';
      else if (hour >= 14 && hour < 18) timeOfDay = '下午';
      else if (hour >= 18 && hour < 22) timeOfDay = '晚上';
      else if (hour >= 22 || hour < 5) timeOfDay = '深夜';
      sys += `\n[时间] ${now.getMonth()+1}月${now.getDate()}日 星期${weekDays[now.getDay()]} ${hour}:${String(now.getMinutes()).padStart(2,'0')} (${timeOfDay})`;

      // 最后一条聊天的时间
      const lastMsg = state.petChatHistory[state.petChatHistory.length - 1];
      if (lastMsg && lastMsg.timestamp) {
        const lastD = new Date(lastMsg.timestamp);
        const lastTimeStr = `${lastD.getMonth()+1}月${lastD.getDate()}日 ${String(lastD.getHours()).padStart(2,'0')}:${String(lastD.getMinutes()).padStart(2,'0')}`;
        sys += `\n[上次对话时间] ${lastTimeStr}`;
      }
    }

    if (isOfflineMode && settings.offlinePrompt) {
      sys += `\n\n[线下模式]\n${settings.offlinePrompt}`;
    }

    messages.push({ role: 'system', content: sys });

    if (mode === 'react') {
      const peek = getMainChatPeek();
      if (peek.length > 0) {
        messages.push({
          role: 'user',
          content: `[主人在和角色聊天：]\n${peek.join('\n')}\n\n以桌宠身份简短评论（1-2句话）。`
        });
      }
    } else if (mode === 'chat') {
      state.petChatHistory.slice(-(settings.petChatRounds || 20)).forEach(msg => {
        if (msg.image && settings.enableVision) {
          // 多模态格式：图片 + 文字
          messages.push({
            role: msg.role,
            content: [
              { type: 'image_url', image_url: { url: msg.image, detail: 'low' } },
              { type: 'text', text: msg.content || '（发送了一张表情包）' }
            ]
          });
        } else {
          messages.push({ role: msg.role, content: msg.content });
        }
      });
    } else if (mode === 'summary') {
      messages.push({ role: 'user', content: userMessage });
    }

    if (settings.jailbreak) {
      messages.push({ role: 'system', content: settings.jailbreak });
    }

    return messages;
  }


  // ============================================================
  // 酒馆数据读取
  // ============================================================
  function getCharacterDescription() {
    try {
      if (!settings.characterId) return '';
      const context = getContext();

      if (context && context.characters) {
        const char = context.characters.find(c =>
          (c.name || c.data?.name) === settings.characterId
        );
        if (char) return char.description || char.data?.description || '';
      }

      if (window.characters && Array.isArray(window.characters)) {
        const char = window.characters.find(c =>
          (c.name || c.data?.name) === settings.characterId
        );
        if (char) return char.description || char.data?.description || '';
      }

      return '';
    } catch (e) {
      return '';
    }
  }

    // 获取世界书条目（带结构）- 异步版
  // 替换原来的 getWorldBookEntries 函数
async function getWorldBookEntries() {
  try {
    if (!settings.worldBookId) return [];

    const context = getContext();
    if (!context) return [];

    // 方法1: 使用 loadWorldInfo (推荐)
    if (typeof context.loadWorldInfo === 'function') {
      try {
        const data = await context.loadWorldInfo(settings.worldBookId);
        if (data && data.entries) {
          // 处理 entries 为对象或数组的情况
          const entriesArray = Array.isArray(data.entries) 
            ? data.entries 
            : Object.values(data.entries);
          
          return entriesArray
            .filter(e => e && e.content)
            .map((e, originalIndex) => ({
              name: e.comment || e.displayName || e.key?.[0] || '',
              keys: Array.isArray(e.key) 
                ? e.key.join(', ') 
                : (e.keys ? (Array.isArray(e.keys) ? e.keys.join(', ') : e.keys) : (e.key || '')),
              content: e.content || '',
              originalIndex // 保存原始索引，用于排除功能
            }));
        }
      } catch (loadErr) {
        console.warn('[meep-pet] loadWorldInfo 失败，尝试其他方式:', loadErr);
      }
    }

    // 方法2: 直接从 context.worldInfo 读取
    if (context.worldInfo && typeof context.worldInfo === 'object') {
      const worldData = context.worldInfo[settings.worldBookId];
      if (worldData && worldData.entries) {
        const entriesArray = Array.isArray(worldData.entries)
          ? worldData.entries
          : Object.values(worldData.entries);
        
        return entriesArray
          .filter(e => e && e.content)
          .map((e, originalIndex) => ({
            name: e.comment || e.displayName || '',
            keys: Array.isArray(e.key) ? e.key.join(', ') : (e.key || ''),
            content: e.content || '',
            originalIndex
          }));
      }
    }

    // 方法3: 从全局变量读取 (某些旧版本)
    if (window.world_info && window.world_info[settings.worldBookId]) {
      const worldData = window.world_info[settings.worldBookId];
      if (worldData.entries) {
        const entriesArray = Array.isArray(worldData.entries)
          ? worldData.entries
          : Object.values(worldData.entries);
        
        return entriesArray
          .filter(e => e && e.content)
          .map((e, originalIndex) => ({
            name: e.comment || '',
            keys: Array.isArray(e.key) ? e.key.join(', ') : (e.key || ''),
            content: e.content || '',
            originalIndex
          }));
      }
    }

    console.warn('[meep-pet] 未找到世界书数据:', settings.worldBookId);
    return [];
  } catch (e) {
    console.error('[meep-pet] 世界书条目获取异常:', e);
    return [];
  }
}

// 同时优化 refreshWorldPreview，使用正确的索引
async function refreshWorldPreview() {
  const box = document.getElementById('sp-world-preview');
  const content = document.getElementById('sp-world-preview-content');
  if (!box || !content) return;

  const entries = await getWorldBookEntries();
  if (entries.length > 0) {
    content.innerHTML = entries.map((entry) => {
      const idx = entry.originalIndex ?? entries.indexOf(entry);
      const excluded = settings.worldBookExcluded.includes(idx);
      return `
        <div class="sp-wi-entry ${excluded ? 'sp-wi-excluded' : ''}" data-wi-idx="${idx}">
          <div class="sp-wi-entry-header">
            <div class="sp-wi-header-left">
              <span class="sp-wi-check" onclick="event.stopPropagation()">
                <input type="checkbox" data-wi-idx="${idx}" ${excluded ? '' : 'checked'} />
              </span>
              <span class="sp-wi-index">#${idx + 1}</span>
              ${entry.name ? `<span class="sp-wi-name" title="${entry.name}">${entry.name}</span>` : ''}
              ${entry.keys ? `<span class="sp-wi-keys" title="${entry.keys}">[${entry.keys}]</span>` : ''}
            </div>
            <span class="sp-wi-expand-arrow">▶</span>
          </div>
          <div class="sp-wi-entry-body">${entry.content}</div>
        </div>
      `;
    }).join('');

    // 后续事件绑定代码保持不变...
    const countEl = document.getElementById('sp-world-count');
    if (countEl) countEl.textContent = entries.length;
    box.style.display = '';

    content.querySelectorAll('input[data-wi-idx]').forEach(cb => {
      cb.onchange = (e) => {
        e.stopPropagation();
        const idx = parseInt(cb.dataset.wiIdx);
        if (cb.checked) {
          settings.worldBookExcluded = settings.worldBookExcluded.filter(i => i !== idx);
        } else {
          if (!settings.worldBookExcluded.includes(idx)) {
            settings.worldBookExcluded.push(idx);
          }
        }
        cb.closest('.sp-wi-entry').classList.toggle('sp-wi-excluded', !cb.checked);
        saveData();
      };
    });

    content.querySelectorAll('.sp-wi-entry-header').forEach(header => {
      header.addEventListener('click', (e) => {
        if (e.target.closest('.sp-wi-check')) return;
        const entry = header.closest('.sp-wi-entry');
        entry.classList.toggle('sp-wi-expanded');
      });
    });

  } else {
    box.style.display = 'none';
    content.innerHTML = '<p style="font-size:12px;color:#999;">暂无条目或加载失败</p>';
  }
}



  async function getWorldBookContent() {
    try {
      if (!settings.worldBookId) return '';
      const entries = await getWorldBookEntries();
      if (entries.length === 0) return '';
      return entries
        .filter((_, idx) => !settings.worldBookExcluded.includes(idx))
        .map(e => e.content)
        .filter(Boolean)
        .join('\n');
    } catch (e) {
      return '';
    }
  }

  function getUserPersona() {
    if (settings.userPersonaSource === 'card') {
      try {
        const context = getContext();
        if (context && context.name1) return `名字: ${context.name1}`;
        if (context && context.persona) return context.persona;
      } catch (e) {}
      return '';
    } else {
      return settings.userPersonaText || '';
    }
  }

  function getMainChatPeek() {
    try {
      const context = getContext();
      if (!context || !context.chat) return [];
      const recent = context.chat.slice(-(settings.peekRounds * 2));
      return recent.map(msg => {
        const name = msg.is_user ? '{{user}}' : (msg.name || '角色');
        return `${name}: ${(msg.mes || '').slice(0, 200)}`;
      });
    } catch (e) {
      return [];
    }
  }

  // ============================================================
  // 主聊天监听
  // ============================================================
  function canReact() {
    if (!settings.enableAutoReact || settings.activityLevel === 0) return false;
    if (Date.now() - lastReactTime < settings.cooldownSeconds * 1000) return false;
    return Math.random() < (settings.activityLevel / 100);
  }

  async function triggerAutoComment() {
    lastReactTime = Date.now();
    if (settings.spriteThink) setSpriteWithLock('think', settings.spriteThink, null);
  
    const reply = await callPetAPI('react');
  
    if (spriteStateLock === 'think') clearSpriteLock();
    
    if (reply) {
      showBubble(reply, 6000);
      state.petChatHistory.push({ role: 'assistant', content: `[旁观] ${reply}` });
      saveData();
    }
  }


  function bindChatListener() {
    const eventSource = window.eventSource || window.SillyTavern?.eventSource;
    const eventTypes = window.event_types || window.SillyTavern?.event_types;
    if (eventSource && eventTypes) {
      eventSource.on(eventTypes.MESSAGE_SENT, () => {
        if (canReact()) setTimeout(() => triggerAutoComment(), 2000 + Math.random() * 5000);
      });
      eventSource.on(eventTypes.MESSAGE_RECEIVED, () => {
        if (canReact()) setTimeout(() => triggerAutoComment(), 3000 + Math.random() * 8000);
      });
    }
  }

  // ============================================================
  // 日记系统
  // ============================================================
  let isDiaryOpen = false;
  let diaryViewYear = new Date().getFullYear();
  let diaryViewMonth = new Date().getMonth();
  let diarySelectedDate = '';

  function toggleDiary() {
    const diaryEl = document.getElementById('silly-pet-diary');
    if (!diaryEl) return;
    isDiaryOpen = !isDiaryOpen;
    diaryEl.classList.toggle('visible', isDiaryOpen);
    if (isDiaryOpen) {
      const w = Math.min(360, window.innerWidth - 20);
      diaryEl.style.width = w + 'px';
      requestAnimationFrame(() => {
        const h = diaryEl.offsetHeight;
        const maxTop = window.innerHeight - h - 20;
        const centerTop = Math.floor((window.innerHeight - h) / 2);
        diaryEl.style.left = Math.floor((window.innerWidth - w) / 2) + 'px';
        diaryEl.style.top = Math.max(10, Math.min(centerTop, maxTop)) + 'px';
      });
      diaryViewYear = new Date().getFullYear();
      diaryViewMonth = new Date().getMonth();
      diarySelectedDate = '';
      renderDiaryCalendar();
      renderDiaryContent();
      populateDiaryRanges();
      bindDiaryEvents();
    }
  }

  function populateDiaryRanges() {
    const memFrom = document.getElementById('sp-diary-mem-from');
    const memTo = document.getElementById('sp-diary-mem-to');
    const chatFrom = document.getElementById('sp-diary-chat-from');
    const chatTo = document.getElementById('sp-diary-chat-to');
    const hint = document.getElementById('sp-diary-range-hint');

    const memTotal = state.memories.length;
    const chatTotal = state.petChatHistory.length;

    if (memFrom) memFrom.max = memTotal || 1;
    if (memTo) memTo.max = memTotal || 1;
    if (chatFrom) chatFrom.max = chatTotal || 1;
    if (chatTo) chatTo.max = chatTotal || 1;

    if (state.lastDiaryMemoryRange) {
      if (memFrom) memFrom.value = Math.min(state.lastDiaryMemoryRange.from, memTotal || 1);
      if (memTo) memTo.value = Math.min(state.lastDiaryMemoryRange.to, memTotal || 1);
    } else {
      if (memFrom) memFrom.value = 1;
      if (memTo) memTo.value = memTotal || 1;
    }

    if (state.lastDiaryChatRange) {
      if (chatFrom) chatFrom.value = Math.min(state.lastDiaryChatRange.from, chatTotal || 1);
      if (chatTo) chatTo.value = Math.min(state.lastDiaryChatRange.to, chatTotal || 1);
    } else {
      if (chatFrom) chatFrom.value = Math.max(1, chatTotal - 19);
      if (chatTo) chatTo.value = chatTotal || 1;
    }

    if (hint) {
      const parts = [];
      if (state.lastDiaryMemoryRange) parts.push(`上次记忆: ${state.lastDiaryMemoryRange.from}-${state.lastDiaryMemoryRange.to}`);
      if (state.lastDiaryChatRange) parts.push(`上次聊天: ${state.lastDiaryChatRange.from}-${state.lastDiaryChatRange.to}`);
      hint.textContent = parts.length > 0 ? `💡 ${parts.join('，')}` : `💡 记忆共${memTotal}条，聊天共${chatTotal}条`;
    }
  }

  function renderDiaryCalendar() {
    const container = document.getElementById('sp-diary-calendar');
    if (!container) return;

    const year = diaryViewYear;
    const month = diaryViewMonth;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

    const diaryDates = new Set((state.diaryEntries || []).map(e => e.date));

    let daysHtml = '';
    for (let i = 0; i < firstDay; i++) {
      daysHtml += `<div class="sp-diary-day empty"></div>`;
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = dateStr === todayStr;
      const hasDiary = diaryDates.has(dateStr);
      const isSelected = dateStr === diarySelectedDate;
      const classes = ['sp-diary-day'];
      if (isToday) classes.push('today');
      if (hasDiary) classes.push('has-diary');
      if (isSelected) classes.push('selected');
      daysHtml += `<div class="${classes.join(' ')}" data-date="${dateStr}">${d}</div>`;
    }

    container.innerHTML = `
      <div class="sp-diary-calendar-header">
        <button id="sp-diary-prev-month" title="上个月">◀</button>
        <span id="sp-diary-year-month-label" style="cursor:pointer;" title="点击快速跳转年月">${year}年 ${monthNames[month]}</span>
        <button id="sp-diary-next-month" title="下个月">▶</button>
      </div>
      <div id="sp-diary-jump-panel" style="display:none;margin-bottom:8px;">
        <div style="display:flex;gap:6px;align-items:center;justify-content:center;flex-wrap:wrap;">
          <select id="sp-diary-jump-year" style="padding:3px 6px;font-size:11px;border-radius:4px;border:1px solid var(--sp-border);background:var(--sp-bg-light);color:var(--sp-text-primary);">
            ${(() => { let opts = ''; const cur = new Date().getFullYear(); for (let y = cur - 5; y <= cur + 1; y++) { opts += `<option value="${y}" ${y === year ? 'selected' : ''}>${y}年</option>`; } return opts; })()}
          </select>
          <select id="sp-diary-jump-month" style="padding:3px 6px;font-size:11px;border-radius:4px;border:1px solid var(--sp-border);background:var(--sp-bg-light);color:var(--sp-text-primary);">
            ${monthNames.map((name, i) => `<option value="${i}" ${i === month ? 'selected' : ''}>${name}</option>`).join('')}
          </select>
          <button id="sp-diary-jump-go" style="padding:3px 8px;font-size:11px;border-radius:4px;border:1px solid var(--sp-primary-border);background:var(--sp-primary);color:#fff;cursor:pointer;">跳转</button>
          <button id="sp-diary-jump-today" style="padding:3px 8px;font-size:11px;border-radius:4px;border:1px solid var(--sp-border);background:var(--sp-bg-light);color:var(--sp-text-secondary);cursor:pointer;">今天</button>
        </div>
      </div>
      <div class="sp-diary-weekdays">
        <div class="sp-diary-weekday">日</div>
        <div class="sp-diary-weekday">一</div>
        <div class="sp-diary-weekday">二</div>
        <div class="sp-diary-weekday">三</div>
        <div class="sp-diary-weekday">四</div>
        <div class="sp-diary-weekday">五</div>
        <div class="sp-diary-weekday">六</div>
      </div>
      <div class="sp-diary-days">${daysHtml}</div>
    `;

    // 上下月
    document.getElementById('sp-diary-prev-month')?.addEventListener('click', () => {
      diaryViewMonth--;
      if (diaryViewMonth < 0) { diaryViewMonth = 11; diaryViewYear--; }
      renderDiaryCalendar();
    });
    document.getElementById('sp-diary-next-month')?.addEventListener('click', () => {
      diaryViewMonth++;
      if (diaryViewMonth > 11) { diaryViewMonth = 0; diaryViewYear++; }
      renderDiaryCalendar();
    });

    // 点击年月标题 → 展开/收起快速跳转面板
    document.getElementById('sp-diary-year-month-label')?.addEventListener('click', () => {
      const panel = document.getElementById('sp-diary-jump-panel');
      if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });

    // 跳转按钮
    document.getElementById('sp-diary-jump-go')?.addEventListener('click', () => {
      const y = parseInt(document.getElementById('sp-diary-jump-year')?.value);
      const m = parseInt(document.getElementById('sp-diary-jump-month')?.value);
      if (!isNaN(y) && !isNaN(m)) {
        diaryViewYear = y;
        diaryViewMonth = m;
        renderDiaryCalendar();
      }
    });

    // 回到今天
    document.getElementById('sp-diary-jump-today')?.addEventListener('click', () => {
      const now = new Date();
      diaryViewYear = now.getFullYear();
      diaryViewMonth = now.getMonth();
      diarySelectedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      renderDiaryCalendar();
      renderDiaryContent();
    });

    // 点击日期
    container.querySelectorAll('.sp-diary-day[data-date]').forEach(day => {
      day.addEventListener('click', () => {
        diarySelectedDate = day.dataset.date;
        renderDiaryCalendar();
        renderDiaryContent();
      });
    });
  }

  function renderDiaryContent() {
    const container = document.getElementById('sp-diary-content');
    if (!container) return;

    const entries = state.diaryEntries || [];

    if (diarySelectedDate) {
      const entry = entries.find(e => e.date === diarySelectedDate);
      if (entry) {
        container.innerHTML = `
          <div class="sp-diary-entry">
            <div class="sp-diary-entry-header">
              <span class="sp-diary-entry-date">📅 ${entry.date}</span>
              <div class="sp-diary-entry-actions">
                <button class="sp-diary-edit-btn" title="编辑">✏️</button>
                <button class="sp-diary-delete-btn" title="删除">🗑️</button>
              </div>
            </div>
            <div class="sp-diary-entry-content" id="sp-diary-entry-text">${renderMarkdown(entry.content)}</div>
          </div>
        `;
        container.querySelector('.sp-diary-edit-btn')?.addEventListener('click', () => {
          const textDiv = document.getElementById('sp-diary-entry-text');
          if (!textDiv) return;
          textDiv.innerHTML = `<textarea id="sp-diary-edit-textarea">${entry.content}</textarea><div style="display:flex;gap:6px;margin-top:6px;"><button id="sp-diary-save-edit" style="padding:4px 10px;font-size:11px;border-radius:6px;border:1px solid var(--sp-primary-border);background:var(--sp-primary);color:#fff;cursor:pointer;">保存</button><button id="sp-diary-cancel-edit" style="padding:4px 10px;font-size:11px;border-radius:6px;border:1px solid var(--sp-border);background:var(--sp-bg-light);color:var(--sp-text-secondary);cursor:pointer;">取消</button></div>`;
          document.getElementById('sp-diary-save-edit')?.addEventListener('click', () => {
            const ta = document.getElementById('sp-diary-edit-textarea');
            if (ta) { entry.content = ta.value.trim(); saveData(); renderDiaryContent(); showBubble('日记已更新～', 2000); }
          });
          document.getElementById('sp-diary-cancel-edit')?.addEventListener('click', () => { renderDiaryContent(); });
        });
        container.querySelector('.sp-diary-delete-btn')?.addEventListener('click', () => {
          if (!confirm(`确定删除 ${entry.date} 的日记吗？`)) return;
          state.diaryEntries = entries.filter(e => e.date !== diarySelectedDate);
          saveData();
          diarySelectedDate = '';
          renderDiaryCalendar();
          renderDiaryContent();
          showBubble('日记已删除', 2000);
        });
      } else {
        container.innerHTML = `<div class="sp-diary-empty">📭 ${diarySelectedDate} 没有日记<br/><span style="font-size:11px;">点下方「✨ 生成今日日记」来写一篇吧</span></div>`;
      }
    } else {
      // 默认显示最近几篇日记
      const recent = [...entries].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
      if (recent.length === 0) {
        container.innerHTML = `<div class="sp-diary-empty">📭 还没有日记哦～<br/><span style="font-size:11px;">点日历选个日期，或直接生成今日日记</span></div>`;
      } else {
        container.innerHTML = recent.map(entry => `
          <div class="sp-diary-entry" style="cursor:pointer;" data-diary-date="${entry.date}">
            <div class="sp-diary-entry-header">
              <span class="sp-diary-entry-date">📅 ${entry.date}</span>
            </div>
            <div class="sp-diary-entry-content" style="max-height:40px;overflow:hidden;position:relative;">
              ${renderMarkdown(entry.content.slice(0, 80))}${entry.content.length > 80 ? '…' : ''}
            </div>
          </div>
        `).join('');
        container.querySelectorAll('[data-diary-date]').forEach(el => {
          el.addEventListener('click', () => {
            diarySelectedDate = el.dataset.diaryDate;
            renderDiaryCalendar();
            renderDiaryContent();
          });
        });
      }
    }
  }

  function bindDiaryEvents() {
    const closeBtn = document.getElementById('sp-diary-close');
    if (closeBtn) closeBtn.onclick = () => toggleDiary();

    const generateBtn = document.getElementById('sp-diary-generate-btn');
    const exportBtn = document.getElementById('sp-diary-export-btn');
    if (exportBtn) {
      exportBtn.onclick = () => {
        const entries = state.diaryEntries || [];
        if (entries.length === 0) { showBubble('还没有日记可以导出', 2000); return; }
        const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
        const text = `═══════════════════════════════\n  ${settings.petName || '咪噗'} 的日记本\n  导出时间: ${new Date().toLocaleString()}\n  共 ${sorted.length} 篇日记\n═══════════════════════════════\n\n` +
          sorted.map(e => `📅 ${e.date}\n${'─'.repeat(20)}\n${e.content}\n`).join('\n\n');
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${settings.petName || '咪噗'}日记_${new Date().toLocaleDateString().replace(/\//g, '-')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        showBubble('📄 日记已导出', 2000);
      };
    }

    if (generateBtn) generateBtn.onclick = () => generateDiary();

    // 拖拽
    const header = document.getElementById('sp-diary-header');
    const panel = document.getElementById('silly-pet-diary');
    if (header && panel) {
      let dragging = false, offX = 0, offY = 0;
      const down = (e) => {
        if (e.target.closest('#sp-diary-close')) return;
        dragging = true;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const rect = panel.getBoundingClientRect();
        offX = clientX - rect.left;
        offY = clientY - rect.top;
      };
      const move = (e) => {
        if (!dragging) return;
        if (e.cancelable) e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        let x = clientX - offX;
        let y = clientY - offY;
        x = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, x));
        y = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, y));
        panel.style.left = x + 'px';
        panel.style.top = y + 'px';
      };
      const up = () => { dragging = false; };
      header.addEventListener('mousedown', down);
      header.addEventListener('touchstart', down, { passive: true });
      document.addEventListener('mousemove', move);
      document.addEventListener('touchmove', move, { passive: false });
      document.addEventListener('mouseup', up);
      document.addEventListener('touchend', up);
    }
  }

  async function generateDiary() {
    const memFrom = parseInt(document.getElementById('sp-diary-mem-from')?.value || 1);
    const memTo = parseInt(document.getElementById('sp-diary-mem-to')?.value || state.memories.length);
    const chatFrom = parseInt(document.getElementById('sp-diary-chat-from')?.value || 1);
    const chatTo = parseInt(document.getElementById('sp-diary-chat-to')?.value || state.petChatHistory.length);

    // 保存本次范围
    state.lastDiaryMemoryRange = { from: memFrom, to: memTo };
    state.lastDiaryChatRange = { from: chatFrom, to: chatTo };
    saveData();

    // 收集记忆
    const memSlice = state.memories.slice(Math.max(0, memFrom - 1), memTo);
    const memText = memSlice.map(m => {
      const mem = typeof m === 'string' ? { content: m, tag: '' } : m;
      return mem.tag ? `[${mem.tag}] ${mem.content}` : mem.content;
    }).filter(Boolean).join('\n');

    // 收集聊天
    const chatSlice = state.petChatHistory.slice(Math.max(0, chatFrom - 1), chatTo);
    const chatText = chatSlice.map(m => {
      const name = m.role === 'user' ? '主人' : '桌宠';
      return `${name}: ${m.content}`;
    }).join('\n');

    if (!memText && !chatText) {
      showBubble('选择的范围内没有内容哦', 2000);
      return;
    }

    // 构建 prompt
    const messages = [];

    // system: 人设 + 世界书 + 日记提示词
    let sys = settings.systemPrompt + '\n';
    if (settings.relationshipPrompt) sys += `\n[与主人的关系]\n${settings.relationshipPrompt}\n`;
    const userPersona = getUserPersona();
    if (userPersona) sys += `\n[主人人设]\n${userPersona}\n`;
    const charDesc = getCharacterDescription();
    if (charDesc) sys += `\n[角色背景参考]\n${charDesc}\n`;
    let worldInfo = '';
    try { worldInfo = await getWorldBookContent(); } catch(e) {}
    if (worldInfo) sys += `\n[世界设定参考]\n${worldInfo}\n`;
    sys += `\n[日记写作要求]\n${settings.diaryPrompt || '请以桌宠的第一人称视角写一篇简短日记。'}`;

    messages.push({ role: 'system', content: sys });

    // user: 记忆 + 聊天内容
    let userContent = '';
    if (memText) userContent += `[参考记忆]\n${memText}\n\n`;
    if (chatText) userContent += `[参考对话]\n${chatText}\n\n`;
    userContent += '请根据以上内容，写一篇今天的日记。';
    messages.push({ role: 'user', content: userContent });

    // 破限
    if (settings.jailbreak) {
      messages.push({ role: 'system', content: settings.jailbreak });
    }

    // 开始生成
    const btn = document.getElementById('sp-diary-generate-btn');
    if (btn) { btn.textContent = '⏳ 生成中…'; btn.disabled = true; }
    if (settings.spriteThink) setSpriteWithLock('think', settings.spriteThink, null);
    showBubble('正在写日记…📝', 3000);

    let result = null;
    const estimatedTokens = estimateMessagesTokens(messages);
    updateTokenDisplay(estimatedTokens);

    if (settings.apiSource === 'tavern') {
      result = await callViaTavern(messages);
    } else {
      result = await callViaCustom(messages);
    }

    if (spriteStateLock === 'think') clearSpriteLock();
    if (btn) { btn.textContent = '✨ 生成今日日记'; btn.disabled = false; }

    if (result) {
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      if (!state.diaryEntries) state.diaryEntries = [];

      // 如果今天已有日记，追加或覆盖
      const existIdx = state.diaryEntries.findIndex(e => e.date === dateStr);
      if (existIdx >= 0) {
        if (confirm('今天已有日记，要覆盖吗？\n取消则追加到后面。')) {
          state.diaryEntries[existIdx].content = result;
          state.diaryEntries[existIdx].timestamp = Date.now();
        } else {
          state.diaryEntries[existIdx].content += '\n\n---\n\n' + result;
          state.diaryEntries[existIdx].timestamp = Date.now();
        }
      } else {
        state.diaryEntries.push({ date: dateStr, content: result, timestamp: Date.now() });
      }

      saveData();
      diarySelectedDate = dateStr;
      renderDiaryCalendar();
      renderDiaryContent();
      showBubble('📔 今日日记写好啦！', 3000);
    } else {
      showBubble('日记生成失败了…检查API', 3000);
    }
  }

  // ============================================================
  // 总结系统
  // ============================================================
  async function triggerSummary() {
    if (state.petChatHistory.length === 0) {
      showBubble('没有聊天记录可总结', 2000);
      return;
    }
    // 直接弹窗让用户选范围，不立即生成
    showSummaryModal('');
  }


  function confirmSummary() {
    const textarea = document.getElementById('sp-summary-edit');
    const modal = document.getElementById('silly-pet-summary-modal');
    if (!textarea || !modal) return;

    const summaryText = textarea.value.trim();
    if (!summaryText) { modal.classList.remove('visible'); return; }

    if (settings.summaryMode === 'append' && state.summary) {
      state.summary = state.summary + '\n\n---\n\n' + summaryText;
    } else {
      state.summary = summaryText;
    }

    // 总结自动写入记忆池
    state.memories.push({
      content: summaryText,
      tag: '对话总结',
      importance: 4,
      timestamp: Date.now()
    });

    petUnsummarizedCount = 0;

    // 清理已总结的聊天，归档到历史记录
    const keep = settings.summaryKeepRecent || 10;
    if (state.petChatHistory.length > keep) {
      const archived = state.petChatHistory.slice(0, -keep);
      if (!state.petChatArchive) state.petChatArchive = [];
      state.petChatArchive.push({
        timestamp: Date.now(),
        messages: archived
      });
      state.petChatHistory = state.petChatHistory.slice(-keep);
    }

    modal.classList.remove('visible');
    showBubble('记忆整理好啦！已存入记忆池 ✨', 3000);
    saveData();
    renderMemoriesList();
    renderChatHistoryList();
    renderChatHistory();
  }

  function showSummaryModal(text) {
    const modal = document.getElementById('silly-pet-summary-modal');
    const textarea = document.getElementById('sp-summary-edit');
    const fromInput = document.getElementById('sp-summary-from');
    const toInput = document.getElementById('sp-summary-to');
    if (!modal || !textarea) return;

    const total = state.petChatHistory.length;
    if (fromInput) { fromInput.value = 1; fromInput.max = total; }
    if (toInput) { toInput.value = total; toInput.max = total; }

    textarea.value = text || '（选择范围后点击"🔄 重新生成"）';
    textarea.readOnly = false;
    modal.classList.add('visible');

    const regenBtn = document.getElementById('sp-summary-regenerate');
    if (regenBtn) {
      regenBtn.onclick = async () => {
        const from = parseInt(fromInput?.value || 1) - 1;
        const to = parseInt(toInput?.value || total);
        const slice = state.petChatHistory.slice(Math.max(0, from), to);
        if (slice.length === 0) { showBubble('选择的范围没有记录', 2000); return; }

        const sliceText = slice.map(m => `${m.role === 'user' ? '主人' : '桌宠'}: ${m.content}`).join('\n');

        // 构建包含所有相关提示词的完整 prompt
        let userPrompt = settings.summaryPrompt + '\n\n';
        if (settings.summaryMode === 'incremental' && state.summary) {
          userPrompt += `[已有的记忆总结]\n${state.summary}\n\n[新增对话内容]\n${sliceText}\n\n请将新增内容与已有总结合并为一份完整总结。保留关键信息和情感变化，去除冗余。`;
        } else {
          userPrompt += sliceText;
        }

        // 思考状态
        if (settings.spriteThink) setSpriteWithLock('think', settings.spriteThink, null);
        showBubble('生成总结中…🧠', 3000);
        textarea.value = '生成中…';

        const result = await callPetAPI('summary', userPrompt);

        if (spriteStateLock === 'think') clearSpriteLock();


        if (result) {
          textarea.value = result;
          showBubble('✨ 总结已生成', 2000);
        } else {
          textarea.value = '';
          showBubble('生成失败了…检查API连接', 3000);
        }
      };
    }
  }

  function cancelSummary() {
    const modal = document.getElementById('silly-pet-summary-modal');
    const textarea = document.getElementById('sp-summary-edit');
    if (modal) modal.classList.remove('visible');
    if (textarea) textarea.readOnly = false;
    if (settings.spriteThink) updateSpriteImage();
  }

  // ============================================================
  // 获取角色卡列表
  // ============================================================
  function getAvailableCharacters() {
    const results = [];
    try {
      const context = getContext();
      if (context && context.characters) {
        context.characters.forEach(c => {
          const name = c.name || c.data?.name;
          if (name) results.push({ name, avatar: '🎭' });
        });
      }
      if (results.length === 0 && window.characters) {
        window.characters.forEach(c => {
          const name = c.name || c.data?.name;
          if (name) results.push({ name, avatar: '🎭' });
        });
      }
      if (results.length === 0) {
        document.querySelectorAll('#rm_print_characters_block .character_select').forEach(el => {
          const name = el.querySelector('.ch_name')?.textContent?.trim();
          if (name) results.push({ name, avatar: '🎭' });
        });
      }
    } catch (e) {}
    return results;
  }

  // ============================================================
  // 获取世界书列表（修复版）
  // ============================================================
  function getAvailableWorldBooks() {
    const results = [];
    try {
      // 方式1：DOM - #world_editor_select（你的版本用这个）
      const editorSelect = document.querySelector('#world_editor_select');
      if (editorSelect) {
        editorSelect.querySelectorAll('option').forEach(opt => {
          const name = (opt.textContent || '').trim();
          // 跳过占位选项
          if (name && !name.includes('选择以编辑') && !name.includes('Select') && name !== '') {
            if (!results.find(r => r.name === name)) {
              results.push({ name });
            }
          }
        });
      }

      // 方式2：DOM - #world_info_select
      if (results.length === 0) {
        const infoSelect = document.querySelector('#world_info_select');
        if (infoSelect) {
          infoSelect.querySelectorAll('option').forEach(opt => {
            const name = (opt.textContent || '').trim();
            if (name && name !== 'None' && name !== '— None —' && name !== '') {
              if (!results.find(r => r.name === name)) {
                results.push({ name });
              }
            }
          });
        }
      }

      // 方式3：DOM - select2 容器（某些版本用 select2 渲染）
      if (results.length === 0) {
        document.querySelectorAll('.select2-results__option, .world_entry_name').forEach(el => {
          const name = (el.textContent || '').trim();
          if (name && name.length > 0) {
            if (!results.find(r => r.name === name)) {
              results.push({ name });
            }
          }
        });
      }

      // 方式4：全局 world_names（部分版本）
      if (results.length === 0 && window.world_names && Array.isArray(window.world_names)) {
        window.world_names.forEach(name => {
          if (name) results.push({ name });
        });
      }

      // 方式5：getContext
      if (results.length === 0) {
        const context = getContext();
        if (context && context.worlds && Array.isArray(context.worlds)) {
          context.worlds.forEach(w => {
            const name = typeof w === 'string' ? w : w.name;
            if (name) results.push({ name });
          });
        }
      }
    } catch (e) {
      console.warn('[meep-pet] 获取世界书列表失败:', e);
    }
    return results;
  }

  // ============================================================
  // 设置面板
  // ============================================================
  function renderSettingsUI() {
    // 先在扩展设置区添加启用开关
    const extensionsSettings = document.getElementById('extensions_settings');
    if (extensionsSettings) {
      let topControl = document.getElementById('meep-pet-top-control');
      if (!topControl) {
        topControl = document.createElement('div');
        topControl.id = 'meep-pet-top-control';
        topControl.style.cssText = 'padding:12px 16px;background:rgba(30,30,40,0.65);border-radius:12px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;border:1px solid rgba(255,255,255,0.12);';
        topControl.innerHTML = `
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:20px;">🐾</span>
            <div>
              <div style="font-size:14px;font-weight:700;color:#eee;">咪噗 ☆ MeepPet</div>
              <div style="font-size:11px;color:#999;">桌宠插件</div>
            </div>
          </div>
          <label class="sp-toggle-switch" title="启用/禁用桌宠">
            <input type="checkbox" id="sp-enabled-toggle-top" ${settings.enabled ? 'checked' : ''} />
            <span class="sp-toggle-slider"></span>
          </label>
        `;
        extensionsSettings.prepend(topControl);
        
        // 绑定开关事件
        const toggle = document.getElementById('sp-enabled-toggle-top');
        if (toggle) {
          toggle.addEventListener('change', (e) => {
            e.stopPropagation();
            settings.enabled = toggle.checked;
            if (settings.enabled) { showPet(); startWandering(); startDecayTimer(); }
            else { hidePet(); }
            saveData();
          });
        }
      }
    }

    // 创建悬浮设置面板
    let settingsPanel = document.getElementById('silly-pet-settings');
    if (settingsPanel) {
      settingsPanel.remove();
    }

    const html = `
    <div>
      <div class="sp-settings-header" id="sp-settings-header">
        <div class="sp-settings-header-left">
          <span class="sp-settings-header-icon">🐾</span>
          <span class="sp-settings-header-title">咪噗 ☆ MeepPet</span>
          <span class="sp-settings-header-ver">v1.0</span>
        </div>
        <button class="sp-settings-close" id="sp-settings-close" title="关闭">✕</button>
      </div>
      <div class="sp-settings-body">
        <div class="sp-tabs" id="sp-tabs-bar">
          <div class="sp-tab active" data-tab="api">🔑 API</div>
          <div class="sp-tab" data-tab="persona">📖 人设</div>
          <div class="sp-tab" data-tab="prompt">💬 提示词</div>
          <div class="sp-tab" data-tab="behavior">⚙️ 行为</div>
          <div class="sp-tab" data-tab="display">🎨 外观</div>
          <div class="sp-tab" data-tab="memory">🧠 记忆</div>
          <div class="sp-tab" data-tab="data">💾 数据</div>
          <div class="sp-tab" data-tab="guide">📖 使用说明</div>
        </div>
        <div class="sp-tab-panels">

          <!-- API -->
          <div class="sp-tab-panel active" data-panel="api">
            <div class="sp-section">
              <div class="sp-section-title">API 来源</div>
              <div class="sp-radio-group">
                <label class="sp-radio"><input type="radio" name="sp-api-source" value="tavern" id="sp-api-source-tavern" ${settings.apiSource !== 'custom' ? 'checked' : ''} /><span>使用酒馆当前 API 连接</span></label>
                <label class="sp-radio"><input type="radio" name="sp-api-source" value="custom" id="sp-api-source-custom" ${settings.apiSource === 'custom' ? 'checked' : ''} /><span>手动填写独立 API</span></label>
              </div>
            </div>
            <div class="sp-section" id="sp-api-tavern-section" ${settings.apiSource === 'custom' ? 'style="display:none;"' : ''}>
              <div class="sp-section-title">酒馆 API</div>
              <p style="font-size:12px;color:#888;margin-bottom:8px;">直接使用酒馆当前已连接的 API，无需额外配置。</p>
              <label>模型覆盖（留空=用酒馆当前模型）</label>
              <input type="text" id="sp-model-tavern" value="${settings.modelOverride || ''}" placeholder="留空使用酒馆当前模型" />
              <label>最大 Tokens</label>
              <input type="number" id="sp-max-tokens-tavern" value="${settings.maxTokens}" min="50" max="2000" />
            </div>
            <div class="sp-section" id="sp-api-custom-section" ${settings.apiSource !== 'custom' ? 'style="display:none;"' : ''}>
              <div class="sp-section-title">自定义 API</div>
              <label>API Key</label>
              <input type="password" id="sp-api-key" value="${settings.apiKey}" placeholder="sk-..." />
              <label>Base URL</label>
              <input type="text" id="sp-base-url" value="${settings.baseUrl}" placeholder="https://api.openai.com/v1" />
              <label>模型</label>
              <div class="sp-row" style="margin-bottom:0;">
                <input type="text" id="sp-model" value="${settings.model}" placeholder="gpt-4o-mini" style="flex:1;margin-bottom:0;" />
                <button class="sp-btn" id="sp-fetch-models" type="button">📡 获取</button>
              </div>
              <div id="sp-models-list"></div>
              <label>最大 Tokens</label>
              <input type="number" id="sp-max-tokens" value="${settings.maxTokens}" min="50" max="30000" />
              <div class="sp-row"><label style="margin:0;"><input type="checkbox" id="sp-enable-streaming" ${settings.enableStreaming ? 'checked' : ''} /> 启用流式输出（逐字显示）</label></div>
              <div class="sp-row"><label style="margin:0;"><input type="checkbox" id="sp-enable-vision" ${settings.enableVision ? 'checked' : ''} /> 启用视觉识别（表情包图片发送给AI看）</label></div>
              <label>请求超时（秒）</label>
              <input type="number" id="sp-api-timeout" value="${settings.apiTimeout || 15}" min="5" max="120" />
            </div>
          </div>

          <!-- 人设 -->
          <div class="sp-tab-panel" data-panel="persona">
            <div class="sp-section">
              <div class="sp-section-title">角色卡</div>
              <div class="sp-search-select">
                <input type="text" id="sp-character-id" value="${settings.characterId}" placeholder="搜索角色卡..." autocomplete="off" />
                <div class="sp-search-dropdown" id="sp-char-dropdown"></div>
              </div>
              <div class="sp-preview-box" id="sp-char-preview" style="display:none;">
                <div class="sp-preview-header">
                  <span>📋 角色描述预览</span>
                  <button class="sp-btn sp-preview-toggle" id="sp-char-preview-toggle">展开</button>
                </div>
                <div class="sp-preview-content" id="sp-char-preview-content"></div>
              </div>
            </div>
            <div class="sp-section">
              <div class="sp-section-title">世界书</div>
              <div class="sp-search-select">
                <input type="text" id="sp-worldbook-id" value="${settings.worldBookId}" placeholder="搜索世界书..." autocomplete="off" />
                <div class="sp-search-dropdown" id="sp-world-dropdown"></div>
              </div>
              <div class="sp-preview-box" id="sp-world-preview" style="display:none;">
                <div class="sp-preview-header">
                  <span>📋 世界书条目 (<span id="sp-world-count">0</span>)</span>
                </div>
                <div class="sp-preview-content sp-world-entries-list" id="sp-world-preview-content"></div>
              </div>
            </div>
          </div>

          <!-- 提示词 -->
          <div class="sp-tab-panel" data-panel="prompt">
            <div class="sp-section">
              <div class="sp-section-title">📋 提示词预设</div>
              <p style="font-size:11px;color:#999;margin-bottom:8px;">快速切换不同的桌宠性格设定，也可以保存当前设定为新预设</p>
              <select id="sp-prompt-preset-select" style="margin-bottom:8px;">
                <option value="">— 不使用预设 —</option>
                ${PROMPT_PRESETS_BUILTIN.map(p => `<option value="builtin:${p.name}" ${settings.currentPreset === 'builtin:' + p.name ? 'selected' : ''}>${p.name}</option>`).join('')}
                ${(settings.promptPresets || []).map(p => `<option value="custom:${p.name}" ${settings.currentPreset === 'custom:' + p.name ? 'selected' : ''}>⭐ ${p.name}</option>`).join('')}
              </select>
              <div class="sp-row" style="flex-wrap:wrap;">
                <button class="sp-btn" id="sp-preset-apply" type="button">✅ 应用预设</button>
                <button class="sp-btn" id="sp-preset-save" type="button">💾 保存为预设</button>
                <button class="sp-btn sp-btn-danger" id="sp-preset-delete" type="button">🗑️ 删除预设</button>
              </div>
            </div>
            <div class="sp-section">
              <label>桌宠名字</label>
              <input type="text" id="sp-pet-name" value="${settings.petName || '咪噗'}" placeholder="给桌宠取个名字" />
            </div>
            <div class="sp-section">
              <label>系统提示词</label>
              <textarea id="sp-system-prompt">${settings.systemPrompt}</textarea>
            </div>
            <div class="sp-section">
              <div class="sp-section-title">🤝 与 {{user}} 的关系</div>
              <p style="font-size:11px;color:#999;margin-bottom:8px;">描述桌宠和主人之间的关系、称呼、互动方式等。会自动注入系统提示词。</p>
              <textarea id="sp-relationship-prompt" placeholder="例如：你是主人养了三年的小猫咪，最喜欢蹭主人的手。主人叫你"小团子"，你叫主人"铲屎官"。">${settings.relationshipPrompt}</textarea>
            </div>
            <div class="sp-section">
              <div class="sp-section-title">👤 {{user}} 人设</div>
              <div class="sp-radio-group">
                <label class="sp-radio"><input type="radio" name="sp-user-persona-source" value="card" id="sp-persona-source-card" ${settings.userPersonaSource === 'card' ? 'checked' : ''} /><span>从酒馆当前 Persona 获取</span></label>
                <label class="sp-radio"><input type="radio" name="sp-user-persona-source" value="manual" id="sp-persona-source-manual" ${settings.userPersonaSource !== 'card' ? 'checked' : ''} /><span>手动填写</span></label>
              </div>
              <div id="sp-persona-manual-section" ${settings.userPersonaSource === 'card' ? 'style="display:none;"' : ''}>
                <textarea id="sp-user-persona-text" placeholder="描述主人的身份、性格、外貌等…">${settings.userPersonaText}</textarea>
              </div>
            </div>
            <div class="sp-section">
              <div class="sp-section-title">🌙 线下提示词</div>
              <p style="font-size:11px;color:#999;margin-bottom:8px;">开启线下模式时会追加到系统提示词中。在聊天框右上角点 🌙 切换。</p>
              <textarea id="sp-offline-prompt">${settings.offlinePrompt}</textarea>
            </div>
            <div class="sp-section">
              <label>破限 (Jailbreak)</label>
              <textarea id="sp-jailbreak">${settings.jailbreak}</textarea>
            </div>
            <div class="sp-section">
              <label>总结提示词</label>
              <textarea id="sp-summary-prompt">${settings.summaryPrompt}</textarea>
            </div>
            <div class="sp-section">
              <div class="sp-section-title">📔 日记提示词</div>
              <p style="font-size:11px;color:#999;margin-bottom:8px;">生成日记时使用的提示词。桌宠会根据你选择的记忆和聊天范围来写日记。</p>
              <textarea id="sp-diary-prompt">${settings.diaryPrompt || '请以桌宠的第一人称视角，根据以下信息写一篇简短的日记（100-200字）。记录今天发生的有趣的事、和主人的互动、心情变化等。语气要符合桌宠的性格设定。'}</textarea>
            </div>
            <div class="sp-section">
              <label>AI提取记忆提示词</label>
              <p style="font-size:11px;color:#999;margin-bottom:8px;">用于"🤖 AI提取记忆"按钮。对话内容会自动追加在后面。</p>
              <textarea id="sp-extract-prompt">${settings.extractPrompt}</textarea>
            </div>
          </div>

          <!-- 行为 -->
          <div class="sp-tab-panel" data-panel="behavior">
            <div class="sp-section">
              <label>活跃度: <span id="sp-activity-display">${settings.activityLevel}%</span></label>
              <input type="range" id="sp-activity-level" min="0" max="100" value="${settings.activityLevel}" />
              <p style="font-size:11px;color:#999;margin:4px 0 12px;">0%安静 ─ 50%偶尔 ─ 100%话痨</p>
              <div class="sp-row"><label style="margin:0;"><input type="checkbox" id="sp-enable-react" ${settings.enableAutoReact ? 'checked' : ''} /> 监听主聊天自动反应</label></div>
              <label>冷却时间（秒）</label>
              <input type="number" id="sp-cooldown" value="${settings.cooldownSeconds}" min="5" max="300" />
              <label>窥探轮数</label>
              <input type="number" id="sp-peek-rounds" value="${settings.peekRounds}" min="1" max="20" />
              <label>桌宠聊天读取轮数</label>
              <input type="number" id="sp-pet-chat-rounds" value="${settings.petChatRounds}" min="1" max="100" />
              <div class="sp-row"><label style="margin:0;"><input type="checkbox" id="sp-enable-time-awareness" ${settings.enableTimeAwareness ? 'checked' : ''} /> 启用时间感知（桌宠知道当前时间）</label></div>
              <label>走动频率: <span id="sp-wander-display">${settings.wanderInterval}s</span></label>
              <input type="range" id="sp-wander-interval" min="3" max="30" value="${settings.wanderInterval}" />
              <p style="font-size:11px;color:#999;margin:4px 0 12px;">3s频繁走 ─ 15s偶尔 ─ 30s基本不动</p>
            </div>
            <div class="sp-section">
              <div class="sp-row"><label style="margin:0;"><input type="checkbox" id="sp-summary-auto" ${settings.summaryTrigger === 'auto' ? 'checked' : ''} /> 启用自动总结提醒</label></div>
              <label>自动总结间隔（轮，0=关闭）</label>
              <input type="number" id="sp-auto-summary" value="${settings.autoSummaryRounds}" min="0" max="100" />
              <label>总结策略</label>
              <select id="sp-summary-mode">
                <option value="incremental" ${settings.summaryMode === 'incremental' ? 'selected' : ''}>增量合并（推荐）</option>
                <option value="replace" ${settings.summaryMode === 'replace' ? 'selected' : ''}>完全覆盖</option>
                <option value="append" ${settings.summaryMode === 'append' ? 'selected' : ''}>追加到旧总结后</option>
              </select>
              <label>总结后保留最近聊天条数</label>
              <input type="number" id="sp-summary-keep" value="${settings.summaryKeepRecent}" min="0" max="50" />
            </div>
            <div class="sp-section">
              <div class="sp-section-title">⏰ 离线衰减</div>
              <label>衰减率 (0.1~0.5)</label>
              <input type="number" id="sp-decay-rate" value="${settings.offlineDecayRate}" min="0.1" max="0.5" step="0.05" />
              <label>安全阈值 %</label>
              <input type="number" id="sp-safety-threshold" value="${settings.safetyThreshold}" min="5" max="30" />
            </div>
            <div class="sp-section">
              <div class="sp-section-title">💬 反应语言</div>
              <p style="font-size:11px;color:#999;margin-bottom:8px;">多条随机语句用 | 分隔</p>
              <label>投喂反应</label>
              <input type="text" id="sp-react-feed" value="${settings.reactions.feed}" />
              <label>洗澡反应</label>
              <input type="text" id="sp-react-bath" value="${settings.reactions.bath}" />
              <label>睡觉反应</label>
              <input type="text" id="sp-react-sleep" value="${settings.reactions.sleep}" />
              <label>拖拽反应（| 分隔）</label>
              <input type="text" id="sp-react-drag" value="${settings.reactions.drag}" />
              <label>闲逛碎碎念（| 分隔）</label>
              <textarea id="sp-react-idle" style="min-height:50px;">${settings.reactions.idle}</textarea>
              <label>饥饿时额外（| 分隔）</label>
              <input type="text" id="sp-react-idle-hungry" value="${settings.reactions.idleHungry}" />
              <label>脏了时额外（| 分隔）</label>
              <input type="text" id="sp-react-idle-dirty" value="${settings.reactions.idleDirty}" />
              <label>困了时额外（| 分隔）</label>
              <input type="text" id="sp-react-idle-sleepy" value="${settings.reactions.idleSleepy}" />
              <label>回归（>24h）</label>
              <input type="text" id="sp-react-return-long" value="${settings.reactions.returnLong}" />
              <label>回归（>1h）</label>
              <input type="text" id="sp-react-return-short" value="${settings.reactions.returnShort}" />
            </div>
          </div>

          <!-- 外观 -->
          <div class="sp-tab-panel" data-panel="display">
            <div class="sp-section">
              <div class="sp-section-title">🎨 主题配色</div>
              <p style="font-size:11px;color:var(--sp-text-muted);margin-bottom:10px;">选择预设主题或自定义配色</p>
              
              <div class="sp-theme-grid">
                ${Object.entries(PRESET_THEMES).map(([key, theme]) => `
                  <div class="sp-theme-card ${settings.currentTheme === key ? 'active' : ''}" data-theme="${key}">
                    <div class="sp-theme-preview" style="
                      background: linear-gradient(135deg, ${theme.colors.bgMain}, ${theme.colors.bgSecondary});
                      border: 2px solid ${theme.colors.border};
                    ">
                      <div class="sp-theme-dot" style="background: ${theme.colors.primary};"></div>
                      <div class="sp-theme-dot" style="background: ${theme.colors.statusHunger};"></div>
                      <div class="sp-theme-dot" style="background: ${theme.colors.statusEnergy};"></div>
                    </div>
                    <div class="sp-theme-name">${theme.name}</div>
                  </div>
                `).join('')}
                
                <div class="sp-theme-card ${settings.currentTheme === 'custom' ? 'active' : ''}" data-theme="custom">
                  <div class="sp-theme-preview" style="
                    background: linear-gradient(135deg, #333, #555);
                    border: 2px dashed rgba(255,255,255,0.3);
                  ">
                    <span style="font-size:24px;">✏️</span>
                  </div>
                  <div class="sp-theme-name">自定义</div>
                </div>
              </div>
              
              <div id="sp-custom-theme-editor" style="display: ${settings.currentTheme === 'custom' ? 'block' : 'none'}; margin-top: 16px;">
                <div class="sp-theme-editor-grid" id="sp-theme-color-inputs">
                  <!-- 动态生成 -->
                </div>
                <div class="sp-row" style="margin-top:10px;gap:6px;">
                  <button class="sp-btn" id="sp-reset-custom-theme" type="button">🔄 重置</button>
                  <button class="sp-btn" id="sp-export-theme" type="button">📤 导出</button>
                  <button class="sp-btn" id="sp-import-theme-btn" type="button">📥 导入</button>
                  <input type="file" id="sp-import-theme-file" accept=".json" style="display:none;" />
                </div>
              </div>
            </div>
            <div class="sp-section">
              <label>显示模式</label>
              <select id="sp-display-mode">
                <option value="2d" ${settings.displayMode === '2d' ? 'selected' : ''}>2D 精灵图</option>
                <option value="3d" ${settings.displayMode === '3d' ? 'selected' : ''}>3D (Live2D)</option>
              </select>
            </div>
            <div class="sp-section">
              <div class="sp-section-title">🎯 菜单图标</div>
              <p style="font-size:11px;color:#999;margin-bottom:8px;">自定义五个功能按钮的图标（PNG/WebP透明背景效果最佳）<br/>上传后圆形边框会自动隐藏，只显示图片</p>
              <div id="sp-upload-area-menu"></div>
            </div>
            <div class="sp-section">
              <div class="sp-section-title">桌宠形象</div>
              <div id="sp-upload-area-sprites"></div>
            </div>
            <div class="sp-section">
              <div class="sp-section-title">自定义动作</div>
              <p style="font-size:11px;color:#999;margin-bottom:8px;">添加额外的动作表情，桌宠闲逛时会随机使用</p>
              <div id="sp-custom-sprites-list"></div>
              <button class="sp-btn" id="sp-add-custom-sprite" type="button">+ 添加自定义动作</button>
            </div>
            <div class="sp-section">
              <div class="sp-section-title">互动贴图</div>
              <div id="sp-upload-area-items"></div>
            </div>
            <div class="sp-section">
              <div class="sp-section-title">心情图标</div>
              <p style="font-size:11px;color:#999;margin-bottom:8px;">替换右上角的状态表情，留空用默认 emoji</p>
              <div id="sp-upload-area-moods"></div>
            </div>
            <div class="sp-section">
              <div class="sp-section-title">📐 桌宠大小</div>
              <label>缩放比例: <span id="sp-scale-display">${(settings.petScale || 1.0).toFixed(1)}x</span></label>
              <input type="range" id="sp-pet-scale" min="0.5" max="2.0" step="0.1" value="${settings.petScale || 1.0}" />
              <p style="font-size:11px;color:#999;margin:4px 0 0;">0.5x迷你 ─ 1.0x默认 ─ 2.0x巨大</p>
            </div>
            <div class="sp-row"><label style="margin:0;"><input type="checkbox" id="sp-show-status-bar" ${settings.showStatusBar !== false ? 'checked' : ''} /> 显示状态条（饱食/清洁/精力）</label></div>
          </div>


          <!-- 记忆 -->
          <div class="sp-tab-panel" data-panel="memory">
            <div class="sp-section">
              <div class="sp-section-title">记忆条目</div>
              <div id="sp-memories-list"></div>
              <button class="sp-btn" id="sp-add-memory">+ 新增记忆</button>
              <button class="sp-btn" id="sp-auto-extract-memory">🤖 AI提取记忆</button>
            </div>
            <div class="sp-section">
              <div class="sp-section-title">对话总结</div>
              <textarea id="sp-current-summary" style="min-height:80px;">${state.summary}</textarea>
              <div class="sp-row" style="margin-top:8px;">
                <button class="sp-btn" id="sp-save-summary">保存总结</button>
                <button class="sp-btn" id="sp-trigger-summary">手动总结</button>
              </div>
            </div>
            <div class="sp-section">
              <div class="sp-section-title">💬 聊天记录 (<span id="sp-chat-history-count">${state.petChatHistory.length}</span>条)</div>
              <div id="sp-chat-history-list" style="max-height:300px;overflow-y:auto;"></div>
              <div class="sp-row" style="margin-top:8px;">
                <button class="sp-btn sp-btn-danger" id="sp-clear-chat-history">🗑️ 清空全部</button>
              </div>
            <div class="sp-section">
              <div class="sp-section-title">📚 历史聊天归档 (<span id="sp-archive-count">0</span>批)</div>
              <div id="sp-chat-archive-list" style="max-height:250px;overflow-y:auto;"></div>
            </div>
            </div>

          </div>

          <!-- 数据 -->
          <div class="sp-tab-panel" data-panel="data">
            <div class="sp-section">
              <div class="sp-section-title">🐾 桌宠存档</div>
              <p style="font-size:11px;color:#999;margin-bottom:8px;">保存当前桌宠配置为存档，支持多套桌宠快速切换</p>
              <select id="sp-profile-select" style="margin-bottom:8px;">
                <option value="">— 当前配置 —</option>
                ${(settings.petProfiles || []).map(p => `<option value="${p.name}" ${settings.currentProfile === p.name ? 'selected' : ''}>${p.name}</option>`).join('')}
              </select>
              <div class="sp-row" style="flex-wrap:wrap;">
                <button class="sp-btn" id="sp-profile-save" type="button">💾 保存当前</button>
                <button class="sp-btn sp-btn-primary" id="sp-profile-load" type="button">📂 加载存档</button>
                <button class="sp-btn sp-btn-danger" id="sp-profile-delete" type="button">🗑️ 删除</button>
              </div>
            </div>
            <div class="sp-section">
              <div class="sp-section-title">导入 / 导出</div>
              <div class="sp-row">
                <button class="sp-btn sp-btn-primary" id="sp-export">📤 导出</button>
                <button class="sp-btn" id="sp-import-btn">📥 导入</button>
                <input type="file" id="sp-import-file" accept=".json" style="display:none;" />
              </div>
            </div>
            <div class="sp-section">
              <div class="sp-section-title">⚠️ 危险操作</div>
              <p style="font-size:11px;color:#999;margin-bottom:8px;">以下操作不可撤销，请谨慎使用</p>
              <div class="sp-row" style="flex-wrap:wrap;">
                <button class="sp-btn sp-btn-danger" id="sp-clear-all-chat">🗑️ 清空所有聊天数据</button>
                <button class="sp-btn sp-btn-danger" id="sp-reset-all-data">💀 重置全部数据</button>
              </div>
            </div>
            <div class="sp-section">
              <div class="sp-section-title">状态总览</div>
              <div id="sp-status-overview"></div>
            </div>
          </div>
          <!-- 使用说明 -->
          <div class="sp-tab-panel" data-panel="guide">
            <div class="sp-section">
              <div class="sp-section-title">📖 使用说明</div>
              <p style="font-size:12px;color:#999;margin-bottom:12px;">点击各项展开查看详细说明</p>

              <details class="sp-guide-details">
                <summary class="sp-guide-summary">🚀 快速开始</summary>
                <div class="sp-guide-details-content">
                  <div class="sp-guide-block">
                    <div class="sp-guide-step"><span class="sp-guide-num">1</span><div><strong>配置 API</strong><br/>点击「🔑 API」标签页，选择使用酒馆当前 API 或填写独立 API Key。<br/>推荐新手直接选「使用酒馆当前 API 连接」，零配置开箱即用。<br/><br/>如果选「手动填写独立 API」，你需要：<br/>• 填入 API Key（通常以 sk- 开头）<br/>• 填入 Base URL（如 https://api.openai.com/v1）<br/>• 选择或输入模型名称（可以点「📡 获取」自动拉取列表）</div></div>
                    <div class="sp-guide-step"><span class="sp-guide-num">2</span><div><strong>选一个预设性格</strong><br/>点击「💬 提示词」→「📋 提示词预设」，从内置的猫咪、傲娇精灵等预设中选一个，点「✅ 应用预设」。<br/><br/>应用后记得点底部「💾 保存所有设置」。预设会自动填充桌宠名字、系统提示词、关系描述等内容。</div></div>
                    <div class="sp-guide-step"><span class="sp-guide-num">3</span><div><strong>开始互动</strong><br/>点击屏幕上的桌宠（或在手机上双击），弹出圆形菜单。<br/>选「💬 聊天」打开聊天框，就可以和桌宠说话了。<br/><br/>💡 小技巧：输入消息后按 Enter 只会发送消息不生成回复，点「➤」按钮才会让 AI 回复。这样你可以连续发好几条消息后再让桌宠一次性回应。</div></div>
                  </div>
                </div>
              </details>

              <details class="sp-guide-details">
                <summary class="sp-guide-summary">🐾 桌宠基础操作</summary>
                <div class="sp-guide-details-content">
                  <div class="sp-guide-table">
                    <div class="sp-guide-row"><span class="sp-guide-key">单击桌宠</span><span class="sp-guide-val">打开圆形菜单（手机上需要双击）</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">拖拽桌宠</span><span class="sp-guide-val">按住桌宠拖动可以移动位置；拖到屏幕边缘会自动吸附挂起（需要在外观里上传对应的挂起图片）</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">🍖 投喂</span><span class="sp-guide-val">补充饱食度 +25%，触发吃东西动画</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">🛁 洗澡</span><span class="sp-guide-val">补充清洁度 +30%，触发洗澡动画</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">🛏️ 睡觉</span><span class="sp-guide-val">补充精力值 +35%，触发睡觉动画</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">💬 聊天</span><span class="sp-guide-val">打开对话窗口，和桌宠私聊</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">📔 日记</span><span class="sp-guide-val">打开日记面板，查看或生成桌宠的日记</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">⚙️ 设置</span><span class="sp-guide-val">打开本设置面板</span></div>
                  </div>
                  <p style="font-size:11px;color:#999;margin-top:10px;"><strong>状态系统说明：</strong></p>
                  <p style="font-size:11px;color:#999;margin-top:4px;">状态条三个指标（🍖饱食 💧清洁 ⚡精力）会随时间缓慢下降。当某项低于 20% 时桌宠心情会变化：</p>
                  <div class="sp-guide-table" style="margin-top:6px;">
                    <div class="sp-guide-row"><span class="sp-guide-key">精力 < 20%</span><span class="sp-guide-val">😴 犯困状态，走路变慢，说话迷糊</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">饱食 < 20%</span><span class="sp-guide-val">🍽️ 饥饿状态，会时不时提到吃的</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">清洁 < 20%</span><span class="sp-guide-val">💦 脏脏状态，会嚷嚷想洗澡</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">全部 > 60%</span><span class="sp-guide-val">😊 开心状态，正常活跃</span></div>
                  </div>
                  <p style="font-size:11px;color:#999;margin-top:6px;">心情会影响桌宠的对话语气和精灵图表现。即使你关闭网页，状态也会按离线衰减率缓慢下降。</p>
                </div>
              </details>

              <details class="sp-guide-details">
                <summary class="sp-guide-summary">💬 聊天框详细说明</summary>
                <div class="sp-guide-details-content">
                  <p style="font-size:12px;color:#ccc;line-height:1.7;margin-bottom:8px;">聊天框是你和桌宠交流的主要界面。</p>
                  <div class="sp-guide-table">
                    <div class="sp-guide-row"><span class="sp-guide-key">😺 表情按钮</span><span class="sp-guide-val">展开/收起表情包面板，可以发送自定义贴图</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">📨 发送消息</span><span class="sp-guide-val">将文字/表情包加入聊天记录，<strong>不会触发 AI 回复</strong>。适合你想连续说几句话的场景</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">➤ 生成回复</span><span class="sp-guide-val">如果输入框有内容先发送，然后调用 AI 生成桌宠回复。这是唯一触发 AI 回复的按钮</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">Enter 键</span><span class="sp-guide-val">等同于「📨 发送消息」，只发送不回复</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">🌙 线下模式</span><span class="sp-guide-val">切换到更亲密的线下互动风格。开启后桌宠会认为你们不在电脑前，而是在现实中相处</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">─ 最小化</span><span class="sp-guide-val">收缩为小标题栏，悬挂在屏幕上不影响操作</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">✕ 关闭</span><span class="sp-guide-val">关闭聊天窗口（不会丢失聊天记录）</span></div>
                  </div>
                  <p style="font-size:11px;color:#999;margin-top:10px;"><strong>表情包使用方法：</strong></p>
                  <div class="sp-guide-block" style="margin-top:6px;">
                    <div class="sp-guide-step"><span class="sp-guide-num">1</span><div>点击「😺」展开表情包面板</div></div>
                    <div class="sp-guide-step"><span class="sp-guide-num">2</span><div>点击「＋」按钮上传图片（PNG/JPG/GIF/WebP，2MB以内）</div></div>
                    <div class="sp-guide-step"><span class="sp-guide-num">3</span><div>点击一个表情选中，会在输入框上方出现预览</div></div>
                    <div class="sp-guide-step"><span class="sp-guide-num">4</span><div>点击「📨」或「➤」发送</div></div>
                  </div>
                  <p style="font-size:11px;color:#999;margin-top:8px;">💡 右键点击（手机长按）已有表情可以编辑名称或删除。给表情起描述性名字（如"委屈脸"、"开心跳舞"），AI 就能理解你发了什么表情。<br/><br/>如果在 API 设置中开启了「视觉识别」且模型支持多模态，AI 还能直接看到表情图片内容。</p>
                  <p style="font-size:11px;color:#999;margin-top:10px;"><strong>Token 显示：</strong>聊天框底部会显示当前对话预估消耗的 token 数，帮你控制上下文长度。</p>
                </div>
              </details>

              <details class="sp-guide-details">
                <summary class="sp-guide-summary">🧠 记忆与总结系统</summary>
                <div class="sp-guide-details-content">
                  <p style="font-size:12px;color:#ccc;line-height:1.7;margin-bottom:8px;">桌宠的记忆分三层，从短期到长期：</p>
                  <div class="sp-guide-table">
                    <div class="sp-guide-row"><span class="sp-guide-key">💬 对话记录</span><span class="sp-guide-val">最近的聊天内容（受「聊天读取轮数」限制），每次请求直接塞入上下文</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">📝 对话总结</span><span class="sp-guide-val">用 AI 压缩过的旧对话精华，始终存在于上下文中</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">⭐ 记忆条目</span><span class="sp-guide-val">手动添加或 AI 自动提取的关键信息（喜好、事件等），按重要度（星级）排序后注入上下文</span></div>
                  </div>
                  <p style="font-size:11px;color:#999;margin-top:10px;"><strong>如何使用总结功能：</strong></p>
                  <div class="sp-guide-block" style="margin-top:6px;">
                    <div class="sp-guide-step"><span class="sp-guide-num">1</span><div>去「🧠 记忆」标签页 → 点击「手动总结」按钮</div></div>
                    <div class="sp-guide-step"><span class="sp-guide-num">2</span><div>弹窗中选择要总结的聊天范围（第几条到第几条）</div></div>
                    <div class="sp-guide-step"><span class="sp-guide-num">3</span><div>点击「🔄 重新生成」，AI 会根据选定范围生成总结</div></div>
                    <div class="sp-guide-step"><span class="sp-guide-num">4</span><div>你可以手动修改生成的总结内容</div></div>
                    <div class="sp-guide-step"><span class="sp-guide-num">5</span><div>点「确认保存」，旧记录会自动归档，只保留最近 N 条（可在行为设置中调节）</div></div>
                  </div>
                  <p style="font-size:11px;color:#999;margin-top:10px;"><strong>总结策略说明：</strong></p>
                  <div class="sp-guide-table" style="margin-top:4px;">
                    <div class="sp-guide-row"><span class="sp-guide-key">增量合并</span><span class="sp-guide-val">将新对话和已有总结合并为一份完整总结（推荐，信息不丢失）</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">完全覆盖</span><span class="sp-guide-val">新总结直接替换旧总结（适合想重新开始的场景）</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">追加</span><span class="sp-guide-val">新总结追加到旧总结后面（时间线清晰但会越来越长）</span></div>
                  </div>
                  <p style="font-size:11px;color:#999;margin-top:10px;"><strong>AI 提取记忆：</strong></p>
                  <p style="font-size:11px;color:#999;margin-top:4px;">点击「🤖 AI提取记忆」按钮，AI 会从最近 20 条对话中自动提取关键记忆点（你的喜好、重要事件等），以带标签的格式存入记忆池。你可以手动调整星级（1-5星），星级越高越优先注入上下文。</p>
                  <p style="font-size:11px;color:#999;margin-top:10px;"><strong>记忆管理技巧：</strong></p>
                  <p style="font-size:11px;color:#999;margin-top:4px;">• 重要的事情设为 5 星，日常小事 1-2 星<br/>• 定期清理过时或不准确的记忆<br/>• 记忆池建议控制在 15 条以内，过多会浪费 token<br/>• 总结完成后旧聊天会存入「历史聊天归档」，随时可以查看</p>
                </div>
              </details>

              <details class="sp-guide-details">
                <summary class="sp-guide-summary">📔 日记系统</summary>
                <div class="sp-guide-details-content">
                  <p style="font-size:12px;color:#ccc;line-height:1.7;margin-bottom:8px;">桌宠可以每天写一篇日记，记录你们的互动和它的心情。</p>
                  <p style="font-size:11px;color:#999;margin-top:6px;"><strong>使用方法：</strong></p>
                  <div class="sp-guide-block" style="margin-top:6px;">
                    <div class="sp-guide-step"><span class="sp-guide-num">1</span><div>点击圆形菜单的「📔 日记」打开日记面板</div></div>
                    <div class="sp-guide-step"><span class="sp-guide-num">2</span><div>日历上有蓝色圆点的日期表示有日记</div></div>
                    <div class="sp-guide-step"><span class="sp-guide-num">3</span><div>底部选择记忆和聊天的范围作为日记素材</div></div>
                    <div class="sp-guide-step"><span class="sp-guide-num">4</span><div>点击「✨ 生成今日日记」，AI 会以桌宠第一人称写日记</div></div>
                  </div>
                  <div class="sp-guide-table" style="margin-top:10px;">
                    <div class="sp-guide-row"><span class="sp-guide-key">点击日历日期</span><span class="sp-guide-val">查看或编辑该日的日记</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">年月标题</span><span class="sp-guide-val">点击可快速跳转到指定年月</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">✏️ 编辑</span><span class="sp-guide-val">手动修改日记内容</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">🗑️ 删除</span><span class="sp-guide-val">删除指定日期的日记</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">📄 导出全部</span><span class="sp-guide-val">将所有日记导出为 TXT 文件</span></div>
                  </div>
                  <p style="font-size:11px;color:#999;margin-top:8px;">💡 同一天可以多次生成日记，会提示你选择覆盖还是追加。日记的风格由「日记提示词」控制，可以在「💬 提示词」标签页中修改。</p>
                </div>
              </details>

              <details class="sp-guide-details">
                <summary class="sp-guide-summary">🎨 外观定制详解</summary>
                <div class="sp-guide-details-content">
                  <p style="font-size:12px;color:#ccc;line-height:1.7;margin-bottom:8px;">在「🎨 外观」标签页中可以全方位定制桌宠的外观。</p>
                  <p style="font-size:11px;color:#999;margin-top:6px;"><strong>主题配色：</strong></p>
                  <div class="sp-guide-table" style="margin-top:4px;">
                    <div class="sp-guide-row"><span class="sp-guide-key">默认深色</span><span class="sp-guide-val">经典蓝黑配色</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">赛博朋克</span><span class="sp-guide-val">霓虹粉/青色，科幻风格</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">可爱粉</span><span class="sp-guide-val">浅粉色系，适合可爱桌宠</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">深海</span><span class="sp-guide-val">深蓝/青色，沉静风格</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">森林</span><span class="sp-guide-val">深绿色系，自然风格</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">自定义</span><span class="sp-guide-val">自由调配每个颜色，支持导入/导出配色方案</span></div>
                  </div>
                  <p style="font-size:11px;color:#999;margin-top:10px;"><strong>桌宠形象（精灵图）：</strong></p>
                  <div class="sp-guide-table" style="margin-top:4px;">
                    <div class="sp-guide-row"><span class="sp-guide-key">闲置</span><span class="sp-guide-val">默认站立状态，最重要的一张图</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">往左/右/上/下走</span><span class="sp-guide-val">闲逛时的行走图，没设置则用闲置图代替</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">睡觉</span><span class="sp-guide-val">点击「睡觉」或精力很低时显示</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">开心/难过</span><span class="sp-guide-val">对应心情状态时的表情</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">被拎起/晕乎乎</span><span class="sp-guide-val">拖拽过程中和松手后的状态</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">吃东西/洗澡</span><span class="sp-guide-val">投喂/洗澡时的动作图</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">打招呼</span><span class="sp-guide-val">你回来时的欢迎动作</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">思考中</span><span class="sp-guide-val">等待 AI 回复时的思考状态</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">挂左/右/顶</span><span class="sp-guide-val">拖到屏幕边缘吸附时的挂起姿势</span></div>
                  </div>
                  <p style="font-size:11px;color:#999;margin-top:10px;"><strong>精灵图规格建议：</strong></p>
                  <p style="font-size:11px;color:#999;margin-top:4px;">• 推荐 PNG 透明背景，尺寸 120×160 像素左右<br/>• GIF 动图会保留动画帧不压缩（适合做走路动画）<br/>• 每张图限制 2MB，超过会被自动压缩为 WebP<br/>• 上传大量图片时注意浏览器存储空间（约 5MB 上限）</p>
                  <p style="font-size:11px;color:#999;margin-top:10px;"><strong>⏱️ 时间滑轨：</strong>每个精灵图下方有时间滑轨，设置该动作播放多久后恢复闲置状态。例如把「吃东西」设为 3 秒，投喂后会显示吃东西图 3 秒再切回闲置。</p>
                  <p style="font-size:11px;color:#999;margin-top:10px;"><strong>其他定制项：</strong></p>
                  <div class="sp-guide-table" style="margin-top:4px;">
                    <div class="sp-guide-row"><span class="sp-guide-key">菜单图标</span><span class="sp-guide-val">替换圆形菜单按钮的 emoji 为自定义图片，建议用透明底 PNG</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">互动贴图</span><span class="sp-guide-val">投喂/洗澡/睡觉时飘出的物品图片（食物、浴缸、床）</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">心情图标</span><span class="sp-guide-val">替换右上角的 emoji 心情标识为图片</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">自定义动作</span><span class="sp-guide-val">添加额外精灵图，桌宠闲逛时会随机播放并显示动作名</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">桌宠大小</span><span class="sp-guide-val">0.5x 迷你到 2.0x 巨大，自由缩放</span></div>
                  </div>
                </div>
              </details>

              <details class="sp-guide-details">
                <summary class="sp-guide-summary">📖 人设与提示词详解</summary>
                <div class="sp-guide-details-content">
                  <p style="font-size:12px;color:#ccc;line-height:1.7;margin-bottom:8px;">提示词决定了桌宠的性格和行为方式。以下是各部分在最终发送给 AI 的消息中的位置和作用：</p>
                  <div class="sp-guide-table">
                    <div class="sp-guide-row"><span class="sp-guide-key">系统提示词</span><span class="sp-guide-val">桌宠的核心人设（位于 system 消息开头）。描述性格、语气、说话习惯等</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">关系描述</span><span class="sp-guide-val">桌宠和你之间的关系，附在系统提示词后面。描述称呼方式、互动习惯等</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">{{user}} 人设</span><span class="sp-guide-val">你自己的身份信息。可以从酒馆 Persona 自动获取，或手动填写</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">角色卡描述</span><span class="sp-guide-val">从酒馆角色卡读取的背景设定，作为参考信息注入</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">世界书</span><span class="sp-guide-val">从酒馆世界书读取的世界设定，可逐条勾选排除不需要的条目</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">线下提示词</span><span class="sp-guide-val">开启线下模式 🌙 时追加。让桌宠认为你们在现实中互动</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">破限 (Jailbreak)</span><span class="sp-guide-val">放在所有消息的最后面，用于解除模型限制</span></div>
                  </div>
                  <p style="font-size:11px;color:#999;margin-top:10px;"><strong>消息组装顺序（从上到下）：</strong></p>
                  <div class="sp-guide-block" style="margin-top:6px;">
                    <div class="sp-guide-step"><span class="sp-guide-num">1</span><div>[system] 系统提示词 + 心情修饰</div></div>
                    <div class="sp-guide-step"><span class="sp-guide-num">2</span><div>[system] 关系描述</div></div>
                    <div class="sp-guide-step"><span class="sp-guide-num">3</span><div>[system] {{user}} 人设</div></div>
                    <div class="sp-guide-step"><span class="sp-guide-num">4</span><div>[system] 角色卡背景 + 世界书设定</div></div>
                    <div class="sp-guide-step"><span class="sp-guide-num">5</span><div>[system] 对话总结 + 记忆条目</div></div>
                    <div class="sp-guide-step"><span class="sp-guide-num">6</span><div>[system] 当前状态值 + 时间（如果开启）</div></div>
                    <div class="sp-guide-step"><span class="sp-guide-num">7</span><div>[user/assistant] 最近 N 轮聊天记录</div></div>
                    <div class="sp-guide-step"><span class="sp-guide-num">8</span><div>[system] 破限 Jailbreak（如果有）</div></div>
                  </div>
                  <p style="font-size:11px;color:#999;margin-top:10px;"><strong>预设系统：</strong></p>
                  <p style="font-size:11px;color:#999;margin-top:4px;">• 内置 5 套预设人格（猫咪、傲娇精灵、忠犬、狐仙、AI助手）<br/>• 点「✅ 应用预设」会自动填充名字、系统提示词、关系描述、破限<br/>• 点「💾 保存为预设」可以把当前配置存为自定义预设<br/>• 内置预设不可删除，自定义预设支持覆盖保存和删除<br/>• 应用预设后别忘了点底部「💾 保存所有设置」</p>
                  <p style="font-size:11px;color:#999;margin-top:10px;"><strong>角色卡和世界书：</strong></p>
                  <p style="font-size:11px;color:#999;margin-top:4px;">• 在「📖 人设」标签页的搜索框中输入关键字可筛选<br/>• 选中后下方会出现预览，可以展开查看具体内容<br/>• 世界书支持逐条勾选/取消，被取消的条目不会注入桌宠上下文<br/>• 选「🚫 不选择」可以清除已选的角色卡或世界书</p>
                </div>
              </details>

              <details class="sp-guide-details">
                <summary class="sp-guide-summary">⚙️ 行为设置详解</summary>
                <div class="sp-guide-details-content">
                  <p style="font-size:12px;color:#ccc;line-height:1.7;margin-bottom:8px;">「⚙️ 行为」标签页控制桌宠的各种自动行为。</p>
                  <p style="font-size:11px;color:#999;margin-top:6px;"><strong>基础行为：</strong></p>
                  <div class="sp-guide-table" style="margin-top:4px;">
                    <div class="sp-guide-row"><span class="sp-guide-key">活跃度 0-100%</span><span class="sp-guide-val">控制桌宠的话唠程度。0% = 安静待着不说话；50% = 偶尔冒泡；100% = 话痨模式碎碎念不停</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">自动反应</span><span class="sp-guide-val">勾选后桌宠会监听酒馆主聊天窗口，看到有趣的对话可能会插嘴评论（以气泡形式）</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">冷却时间</span><span class="sp-guide-val">两次自动反应之间的最短间隔（秒），防止刷屏</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">窥探轮数</span><span class="sp-guide-val">桌宠偷看主聊天最近几轮对话作为评论参考</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">聊天读取轮数</span><span class="sp-guide-val">每次请求发送给 AI 的桌宠私聊记录条数。越多上下文越丰富但越费 token</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">走动频率</span><span class="sp-guide-val">桌宠多久走一步。3秒 = 频繁走动；15秒 = 偶尔动动；30秒 = 基本不动</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">时间感知</span><span class="sp-guide-val">开启后上下文中会包含当前日期、时间、星期几。桌宠就能说"早上好"之类的话</span></div>
                  </div>
                  <p style="font-size:11px;color:#999;margin-top:10px;"><strong>总结相关：</strong></p>
                  <div class="sp-guide-table" style="margin-top:4px;">
                    <div class="sp-guide-row"><span class="sp-guide-key">自动总结提醒</span><span class="sp-guide-val">勾选后，聊天达到指定轮数会自动触发总结流程</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">自动总结间隔</span><span class="sp-guide-val">多少轮对话后触发自动总结（设为 0 = 关闭）</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">总结策略</span><span class="sp-guide-val">增量合并/完全覆盖/追加（详见记忆与总结章节）</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">总结后保留条数</span><span class="sp-guide-val">总结完成后保留最近几条聊天，其余归档</span></div>
                  </div>
                  <p style="font-size:11px;color:#999;margin-top:10px;"><strong>离线衰减：</strong></p>
                  <div class="sp-guide-table" style="margin-top:4px;">
                    <div class="sp-guide-row"><span class="sp-guide-key">衰减率 0.1~0.5</span><span class="sp-guide-val">关闭网页后状态下降速度。0.1 = 很慢；0.5 = 较快</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">安全阈值 %</span><span class="sp-guide-val">状态不会低于这个值，防止桌宠"饿死"。建议 10-20%</span></div>
                  </div>
                  <p style="font-size:11px;color:#999;margin-top:10px;"><strong>反应语言自定义：</strong></p>
                  <p style="font-size:11px;color:#999;margin-top:4px;">每个场景都可以用 | 分隔多条语句，桌宠会随机选一条。例如：<br/><code style="background:rgba(100,180,255,0.1);padding:2px 6px;border-radius:3px;font-size:11px;">好吃！|谢谢主人～|（狼吞虎咽）|嗝～</code><br/><br/>可自定义的场景包括：投喂、洗澡、睡觉、拖拽、闲逛碎碎念、饥饿/脏了/困了时的额外碎碎念、长时间离线回归、短时间离线回归。</p>
                </div>
              </details>

              <details class="sp-guide-details">
                <summary class="sp-guide-summary">⚡ 斜杠指令</summary>
                <div class="sp-guide-details-content">
                  <p style="font-size:12px;color:#ccc;line-height:1.7;margin-bottom:8px;">在酒馆主聊天输入框中可以直接输入以下指令控制桌宠：</p>
                  <div class="sp-guide-table">
                    <div class="sp-guide-row"><span class="sp-guide-key">/pet</span><span class="sp-guide-val">等同于 /pet status，查看当前状态</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">/pet status</span><span class="sp-guide-val">查看桌宠当前饱食度、清洁度、精力、心情</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">/pet feed</span><span class="sp-guide-val">投喂食物，效果同点击 🍖 按钮</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">/pet bath</span><span class="sp-guide-val">给桌宠洗澡，效果同点击 🛁 按钮</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">/pet sleep</span><span class="sp-guide-val">让桌宠睡觉，效果同点击 🛏️ 按钮</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">/pet summon</span><span class="sp-guide-val">强行将桌宠召唤到屏幕正中心（桌宠跑飞了用这个）</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">/pet toggle</span><span class="sp-guide-val">显示/隐藏桌宠，等同于顶部开关</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">/pet chat 你好</span><span class="sp-guide-val">直接在酒馆输入框发消息给桌宠，会自动打开聊天窗口并触发回复</span></div>
                  </div>
                  <p style="font-size:11px;color:#999;margin-top:8px;">💡 输入 / 时酒馆的自动补全菜单中会出现 /pet 选项。指令返回的结果只有你自己能看到，不会影响主聊天。</p>
                </div>
              </details>

              <details class="sp-guide-details">
                <summary class="sp-guide-summary">💾 数据与存档管理</summary>
                <div class="sp-guide-details-content">
                  <p style="font-size:12px;color:#ccc;line-height:1.7;margin-bottom:8px;">所有数据存储在浏览器本地 localStorage 中。</p>
                  <p style="font-size:11px;color:#999;margin-top:6px;"><strong>多桌宠存档：</strong></p>
                  <div class="sp-guide-block" style="margin-top:6px;">
                    <div class="sp-guide-step"><span class="sp-guide-num">1</span><div>在「💾 数据」→「🐾 桌宠存档」点击「💾 保存当前」</div></div>
                    <div class="sp-guide-step"><span class="sp-guide-num">2</span><div>输入存档名称（建议用桌宠名字）</div></div>
                    <div class="sp-guide-step"><span class="sp-guide-num">3</span><div>之后可以在下拉菜单选择不同存档，点「📂 加载存档」一键切换</div></div>
                  </div>
                  <p style="font-size:11px;color:#999;margin-top:6px;">每个存档包含完整的设置+状态+聊天记录，适合养多只不同性格的桌宠。</p>
                  <p style="font-size:11px;color:#999;margin-top:10px;"><strong>导入/导出：</strong></p>
                  <div class="sp-guide-table" style="margin-top:4px;">
                    <div class="sp-guide-row"><span class="sp-guide-key">📤 导出</span><span class="sp-guide-val">将全部数据（设置+状态+图片）导出为 JSON 文件</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">📥 导入</span><span class="sp-guide-val">从 JSON 文件恢复数据，会覆盖当前所有配置</span></div>
                  </div>
                  <p style="font-size:11px;color:#999;margin-top:10px;"><strong>存储空间说明：</strong></p>
                  <p style="font-size:11px;color:#999;margin-top:4px;">• 浏览器 localStorage 通常限制 5MB<br/>• 在「💾 数据」底部的「状态总览」可以看到当前存储占用<br/>• 上传了大量精灵图/表情包时容易接近上限<br/>• 快满时会自动提醒，建议导出备份后清理旧图片</p>
                  <p style="font-size:11px;color:#f66;margin-top:10px;"><strong>⚠️ 重要提醒：</strong></p>
                  <p style="font-size:11px;color:#f66;margin-top:4px;">• 换浏览器/清除缓存/卸载酒馆 = 数据丢失！务必定期导出备份<br/>• 「🗑️ 清空所有聊天数据」会删除聊天记录+归档+总结<br/>• 「💀 重置全部数据」会永久删除一切，包括设置和图片，不可撤销</p>
                </div>
              </details>

              <details class="sp-guide-details">
                <summary class="sp-guide-summary">🔑 API 设置详解</summary>
                <div class="sp-guide-details-content">
                  <p style="font-size:12px;color:#ccc;line-height:1.7;margin-bottom:8px;">桌宠需要调用 AI 模型来生成回复。有两种连接方式：</p>
                  <p style="font-size:11px;color:#999;margin-top:6px;"><strong>方式一：使用酒馆当前 API（推荐新手）</strong></p>
                  <p style="font-size:11px;color:#999;margin-top:4px;">直接复用你在酒馆中已经配好的 API 连接。无需额外填写任何信息。桌宠会通过酒馆内部接口（generateQuietPrompt）发送请求，不影响主聊天。</p>
                  <p style="font-size:11px;color:#999;margin-top:6px;">• 可选填「模型覆盖」，指定桌宠使用不同于主聊天的模型<br/>• 不支持流式输出（由酒馆控制）</p>
                  <p style="font-size:11px;color:#999;margin-top:10px;"><strong>方式二：手动填写独立 API</strong></p>
                  <p style="font-size:11px;color:#999;margin-top:4px;">适合想让桌宠用不同 API 供应商或独立计费的用户。</p>
                  <div class="sp-guide-table" style="margin-top:6px;">
                    <div class="sp-guide-row"><span class="sp-guide-key">API Key</span><span class="sp-guide-val">你的 API 密钥，通常以 sk- 开头</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">Base URL</span><span class="sp-guide-val">API 地址，必须以 /v1 结尾。例：https://api.openai.com/v1</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">模型</span><span class="sp-guide-val">手动输入或点「📡 获取」从 API 拉取可用模型列表</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">最大 Tokens</span><span class="sp-guide-val">AI 单次回复的最大长度。桌宠聊天建议 200-500</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">流式输出</span><span class="sp-guide-val">开启后回复会逐字显示出来，体验更好</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">视觉识别</span><span class="sp-guide-val">开启后表情包图片会以多模态格式发给 AI（需要模型支持，如 gpt-4o）</span></div>
                    <div class="sp-guide-row"><span class="sp-guide-key">请求超时</span><span class="sp-guide-val">等待多少秒没响应就放弃，建议 15-30 秒</span></div>
                  </div>
                  <p style="font-size:11px;color:#999;margin-top:8px;">💡 兼容所有 OpenAI 格式的 API（包括中转站、本地部署的 Ollama 等），只要支持 /v1/chat/completions 接口即可。</p>
                </div>
              </details>

              <details class="sp-guide-details">
                <summary class="sp-guide-summary">❓ 常见问题 FAQ</summary>
                <div class="sp-guide-details-content">
                  <div class="sp-guide-block" style="gap:14px;">
                    <div><strong style="color:var(--sp-text-primary);">Q: 桌宠跑到屏幕外面看不见了？</strong><br/><span style="font-size:12px;color:#bbb;">在酒馆聊天输入框输入 <code style="background:rgba(100,180,255,0.1);padding:1px 4px;border-radius:3px;">/pet summon</code> 强行召回屏幕中心。或者刷新页面，桌宠会回到上次保存的合法位置。</span></div>
                    <div><strong style="color:var(--sp-text-primary);">Q: API 报错/桌宠不回复？</strong><br/><span style="font-size:12px;color:#bbb;">检查清单：<br/>① API Key 是否正确且有余额<br/>② Base URL 是否以 /v1 结尾（不是 /v1/chat/completions）<br/>③ 模型名是否拼写正确（点「📡 获取」验证连接）<br/>④ 网络是否正常，有无代理问题<br/>⑤ 超时时间是否设得太短（建议 15s 以上）<br/><br/>气泡会显示错误代码，常见的：401=Key错误，403=无权限，404=模型不存在，429=请求太频繁，500=服务器错误。</span></div>
                    <div><strong style="color:var(--sp-text-primary);">Q: 桌宠不说话 / 不自动评论？</strong><br/><span style="font-size:12px;color:#bbb;">确认以下设置：<br/>①「活跃度」不是 0%<br/>②「自动反应」已勾选<br/>③ 冷却时间没设太长（如果设了 300 秒那就是 5 分钟才能说一次）<br/>④ 酒馆主聊天窗口有新消息产生（桌宠是监听主聊天来触发反应的）<br/><br/>如果只是想直接和桌宠聊天，不需要等自动反应，直接打开聊天框说话就行。</span></div>
                    <div><strong style="color:var(--sp-text-primary);">Q: 图片上传失败 / 存储满了？</strong><br/><span style="font-size:12px;color:#bbb;">① 单张图片限制 2MB，超过会报错<br/>② 支持格式：PNG / JPG / GIF / WebP<br/>③ GIF 动图不会被压缩（保留动画帧）<br/>④ 其他格式会被自动压缩为 WebP<br/><br/>如果提示「存储满了」，去「💾 数据」→「状态总览」查看空间占用。解决办法：<br/>• 删除不需要的精灵图<br/>• 减少表情包数量<br/>• 清理旧的聊天归档<br/>• 导出备份后重置数据</span></div>
                    <div><strong style="color:var(--sp-text-primary);">Q: 酒馆模式下找不到角色卡/世界书？</strong><br/><span style="font-size:12px;color:#bbb;">① 确保酒馆中已经创建/导入了角色卡或世界书<br/>② 搜索框支持模糊匹配，输入部分名字即可<br/>③ 如果列表为空，可能是酒馆版本兼容问题，尝试刷新页面后重试<br/>④ 世界书需要先在酒馆的「世界信息」面板中打开过一次才能被检测到</span></div>
                    <div><strong style="color:var(--sp-text-primary);">Q: 表情包发给 AI，它能看到图片吗？</strong><br/><span style="font-size:12px;color:#bbb;">取决于两个条件：<br/>① 在 API 设置中勾选了「启用视觉识别」<br/>② 你使用的模型支持多模态（如 gpt-4o、claude-3 等）<br/><br/>如果两个条件都满足，AI 能直接看到图片内容。否则 AI 只能看到表情包的文字名称（如"[发送了表情包: 委屈脸]"），所以给表情起一个描述性的名字很重要。</span></div>
                    <div><strong style="color:var(--sp-text-primary);">Q: 流式输出有什么好处？</strong><br/><span style="font-size:12px;color:#bbb;">开启后桌宠的回复会像打字一样逐字显示出来，而不是等全部生成完再一次性显示。体验更自然。<br/><br/>注意：仅在「手动填写独立 API」模式下有效，酒馆 API 模式由酒馆控制无法使用流式。</span></div>
                    <div><strong style="color:var(--sp-text-primary);">Q: 线下模式是什么？</strong><br/><span style="font-size:12px;color:#bbb;">在聊天框右上角点 🌙 图标可以切换线下模式。开启后：<br/>• 线下提示词会追加到系统消息中<br/>• 桌宠会认为你们不在电脑前，而是在现实中相处<br/>• 语气通常更亲密、放松，可以描述动作和场景<br/><br/>适合想和桌宠玩角色扮演或模拟日常互动的场景。图标变绿色表示已开启。</span></div>
                    <div><strong style="color:var(--sp-text-primary);">Q: 桌宠占的 token 多吗？会不会很费钱？</strong><br/><span style="font-size:12px;color:#bbb;">聊天框底部和「状态总览」都会显示预估 token 数。一般情况：<br/>• 简单闲聊：200-500 tokens/次<br/>• 带记忆+世界书：500-1500 tokens/次<br/>• 建议把「最大 Tokens」设为 200-300 来控制回复长度<br/>• 用小模型（如 gpt-4o-mini）性价比最高<br/><br/>定期总结旧聊天记录可以有效减少每次请求的上下文长度。</span></div>
                    <div><strong style="color:var(--sp-text-primary);">Q: 如何让桌宠更有个性？</strong><br/><span style="font-size:12px;color:#bbb;">几个建议：<br/>① 系统提示词写具体：不只写"可爱"，而是描述具体行为（"说话喜欢用～结尾，经常打错字，对甜食毫无抵抗力"）<br/>② 关系描述要有细节（"你们已经认识三年了，你记得主人养了一只真猫叫橘子"）<br/>③ 添加记忆条目，让桌宠记住你的喜好和之前发生的事<br/>④ 自定义反应语言，让每句碎碎念都符合人设<br/>⑤ 上传精灵图，视觉形象让角色感更强</span></div>
                    <div><strong style="color:var(--sp-text-primary);">Q: 桌宠和酒馆主聊天互相影响吗？</strong><br/><span style="font-size:12px;color:#bbb;">不影响。桌宠的聊天完全独立于酒馆主聊天窗口。<br/>• 桌宠可以「偷看」主聊天内容（作为自动反应的参考），但不会修改或插入消息<br/>• 桌宠使用的 API 配额与主聊天分开（如果用独立 API 的话）<br/>• 桌宠的聊天记录单独存储，不会出现在酒馆的对话历史中</span></div>
                    <div><strong style="color:var(--sp-text-primary);">Q: 手机上操作有什么不同？</strong><br/><span style="font-size:12px;color:#bbb;">主要区别：<br/>• 双击桌宠才能打开菜单（单击是点选）<br/>• 各面板会自动缩小适配手机屏幕<br/>• 精灵图和菜单按钮尺寸会自动缩小<br/>• 建议把桌宠缩放设为 0.8x 以下<br/>• 拖拽操作正常支持，但范围更小</span></div>
                    <div><strong style="color:var(--sp-text-primary);">Q: 能同时运行多只桌宠吗？</strong><br/><span style="font-size:12px;color:#bbb;">目前只能同时运行一只。但通过「多桌宠存档」功能可以保存多套桌宠配置，一键切换不同的桌宠（切换后前一只会"收起来"）。每只桌宠的聊天记录、记忆、设置都独立保存。</span></div>
                  </div>
                </div>
              </details>

              <details class="sp-guide-details">
                <summary class="sp-guide-summary">💡 进阶技巧</summary>
                <div class="sp-guide-details-content">
                  <div class="sp-guide-block" style="gap:10px;">
                    <div style="font-size:12px;color:#ccc;line-height:1.7;">
                      <strong style="color:var(--sp-text-primary);">1. 用小模型省钱</strong><br/>
                      桌宠聊天不需要太强的模型。gpt-4o-mini、claude-3-haiku 这类小模型足够应付日常对话，便宜很多。把「最大 Tokens」设为 200-300 即可。
                    </div>
                    <div style="font-size:12px;color:#ccc;line-height:1.7;">
                      <strong style="color:var(--sp-text-primary);">2. 善用发送+生成分离</strong><br/>
                      「📨 发送」和「➤ 生成」分开，意味着你可以连续发好几条消息描述一个场景，最后再点一次生成让桌宠统一回应。这样桌宠的回复会更连贯。
                    </div>
                    <div style="font-size:12px;color:#ccc;line-height:1.7;">
                      <strong style="color:var(--sp-text-primary);">3. 记忆池精细管理</strong><br/>
                      记忆不在多在精。5 条高质量的 5 星记忆比 20 条碎片记忆效果好得多。定期审查记忆，删掉过时的，合并相似的。
                    </div>
                    <div style="font-size:12px;color:#ccc;line-height:1.7;">
                      <strong style="color:var(--sp-text-primary);">4. GIF 动图做精灵图</strong><br/>
                      上传 GIF 格式的图片不会被压缩，动画帧完整保留。你可以用像素画工具做简单的行走动画 GIF，让桌宠走路时真的在"走"。
                    </div>
                    <div style="font-size:12px;color:#ccc;line-height:1.7;">
                      <strong style="color:var(--sp-text-primary);">5. 世界书精确控制</strong><br/>
                      如果你的世界书很大，没必要全部注入桌宠上下文。在「📖 人设」里选中世界书后，可以逐条勾选/取消，只保留和桌宠相关的条目。
                    </div>
                    <div style="font-size:12px;color:#ccc;line-height:1.7;">
                      <strong style="color:var(--sp-text-primary);">6. 定期总结保持记忆新鲜</strong><br/>
                      建议每聊 20-30 轮做一次总结。总结后旧记录归档，上下文变短，AI 回复速度更快、费用更低、而且重要信息不会被挤出上下文窗口。
                    </div>
                    <div style="font-size:12px;color:#ccc;line-height:1.7;">
                      <strong style="color:var(--sp-text-primary);">7. 导出备份要养成习惯</strong><br/>
                      每次做了大量修改（上传新图、调了很久的提示词）之后，去「💾 数据」点一下「📤 导出」。万一浏览器出问题，至少不会从头来过。
                    </div>
                  </div>
                </div>
              </details>

            </div>
          </div>


        </div>
        <div class="sp-settings-footer">
          <button class="sp-btn sp-btn-primary" id="sp-save-settings">💾 保存所有设置</button>
        </div>
      </div>
    </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    const panel = wrapper.firstElementChild;
    panel.id = 'silly-pet-settings';
    panel.className = '';  // 清空自动生成的 class
    document.body.appendChild(panel);

    renderUploadAreas();
    renderMemoriesList();
    renderChatHistoryList();
    renderChatArchive(); 
    renderStatusOverview();
    bindTabSwitching();
    bindSettingsClose();
    bindSettingsDrag();
    bindSettingsEvents(); // 👈 新增：让设置面板渲染完后，立刻自动绑定它里面的所有按钮和输入框事件
  }

  // ============================================================
  // 存储容量计算
  // ============================================================
  function getStorageUsage() {
    try {
      let total = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        total += (key.length + value.length) * 2; // UTF-16 每字符 2 字节
      }
      const myData = localStorage.getItem(STORAGE_KEY) || '';
      const mySize = (STORAGE_KEY.length + myData.length) * 2;
      return {
        totalBytes: total,
        myBytes: mySize,
        maxBytes: 5 * 1024 * 1024, // 浏览器通常限制 5MB
        totalKB: (total / 1024).toFixed(1),
        myKB: (mySize / 1024).toFixed(1),
        maxKB: (5 * 1024).toFixed(0),
        percent: Math.min(100, (total / (5 * 1024 * 1024) * 100)).toFixed(1),
        myPercent: Math.min(100, (mySize / (5 * 1024 * 1024) * 100)).toFixed(1),
      };
    } catch (e) {
      return { totalBytes: 0, myBytes: 0, maxBytes: 5242880, totalKB: '0', myKB: '0', maxKB: '5120', percent: '0', myPercent: '0' };
    }
  }

  // ============================================================
  // 状态概览
  // ============================================================
  function renderStatusOverview() {
    const el = document.getElementById('sp-status-overview');
    if (!el) return;
    el.style.cssText = 'font-size:12px;line-height:1.8;color:var(--sp-text-primary);';
    const storage = getStorageUsage();
    const barColor = parseFloat(storage.percent) > 80 ? '#f66' : parseFloat(storage.percent) > 60 ? '#ffb347' : 'rgba(100,180,255,0.7)';
    el.innerHTML = `
      🍖 饱食: ${Math.round(state.hunger)}% ｜ 💧 清洁: ${Math.round(state.cleanliness)}% ｜ ⚡ 精力: ${Math.round(state.energy)}%<br/>
      ${getMoodEmoji()} 心情: ${state.mood} ｜ 💬 互动: ${state.totalInteractions}次<br/>
      📝 记忆: ${state.memories.length}条 ｜ 💭 对话: ${state.petChatHistory.length}条<br/>
      🕐 上次在线: ${new Date(state.lastOnlineTimestamp).toLocaleString()}<br/>
      🔢 上次请求: <span id="sp-token-overview">未发送</span>
      <div style="margin-top:10px;padding:8px 10px;background:rgba(255,255,255,0.05);border-radius:8px;border:1px solid rgba(255,255,255,0.08);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <span style="font-size:11px;color:var(--sp-text-secondary);">💾 存储空间</span>
          <span style="font-size:11px;color:var(--sp-text-muted);">${storage.totalKB} KB / ${storage.maxKB} KB (${storage.percent}%)</span>
        </div>
        <div style="width:100%;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">
          <div style="width:${storage.percent}%;height:100%;background:${barColor};border-radius:3px;transition:width 0.3s;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:4px;">
          <span style="font-size:10px;color:var(--sp-text-muted);">本插件: ${storage.myKB} KB (${storage.myPercent}%)</span>
          <span style="font-size:10px;color:${parseFloat(storage.percent) > 80 ? '#f66' : 'var(--sp-text-muted)'};">${parseFloat(storage.percent) > 80 ? '⚠️ 空间紧张' : '状态正常'}</span>
        </div>
      </div>
    `;
  }


  // ============================================================
  // 图片上传
  // ============================================================
  function renderUploadAreas() {
    const spriteArea = document.getElementById('sp-upload-area-sprites');
    const itemArea = document.getElementById('sp-upload-area-items');

    const spriteConfigs = [
      ['spriteIdle', '闲置'],
      ['spriteWalkLeft', '往左走'],
      ['spriteWalkRight', '往右走'],
      ['spriteWalkUp', '往上走'],
      ['spriteWalkDown', '往下走'],
      ['spriteSleep', '睡觉'],
      ['spriteHappy', '开心'],
      ['spriteSad', '难过'],
      ['spriteDrag', '被拎起'],
      ['spriteDizzy', '晕乎乎'],
      ['spriteEat', '吃东西'],
      ['spriteBath', '洗澡中'],
      ['spriteWave', '打招呼'],
      ['spriteThink', '思考中'],
      ['spriteHangLeft', '挂左边'],
      ['spriteHangRight', '挂右边'],
      ['spriteHangTop', '挂顶部'],
    ];


    const itemConfigs = [
      ['foodImage', '食物'],
      ['bathImage', '浴缸'],
      ['bedImage', '床'],
    ];

    if (spriteArea) {
      spriteArea.innerHTML = spriteConfigs.map(([key, label]) =>
        buildUploadGroup(key, label, settings[key])
      ).join('');
    }

    if (itemArea) {
      itemArea.innerHTML = itemConfigs.map(([key, label]) =>
        buildUploadGroup(key, label, settings[key])
      ).join('');
    }

    const moodArea = document.getElementById('sp-upload-area-moods');
    const moodConfigs = [
      ['moodHappy', '开心 😊'],
      ['moodNeutral', '普通 😐'],
      ['moodSad', '难过 😢'],
      ['moodSleepy', '困了 😴'],
      ['moodHungry', '饿了 🍽️'],
      ['moodDirty', '脏了 💦'],
    ];
    if (moodArea) {
      moodArea.innerHTML = moodConfigs.map(([key, label]) => {
        const moodKey = key.replace('mood', '').toLowerCase();
        const val = (settings.moodImages && settings.moodImages[moodKey]) || '';
        return buildUploadGroup(key, label, val);
      }).join('');
    }

    const menuArea = document.getElementById('sp-upload-area-menu');
    const menuConfigs = [
      ['menuIconFeed', '投喂 🍖'],
      ['menuIconBath', '洗澡 🛁'],
      ['menuIconSleep', '睡觉 🛏️'],
      ['menuIconChat', '聊天 💬'],
      ['menuIconDiary', '日记 📔'],
      ['menuIconSettings', '设置 ⚙️']
    ];
    if (menuArea) {
      menuArea.innerHTML = menuConfigs.map(([key, label]) => {
        const actionKey = key.replace('menuIcon', '').toLowerCase();
        const val = (settings.menuIcons && settings.menuIcons[actionKey]) || '';
        return buildUploadGroup(key, label, val);
      }).join('');
    }


    bindAllImageUploads();
    renderCustomSprites();
  }

  // ============================================================
  // 自定义动作管理
  // ============================================================
  function renderCustomSprites() {
    const container = document.getElementById('sp-custom-sprites-list');
    if (!container) return;

    container.innerHTML = '';
    (settings.customSprites || []).forEach((sprite, idx) => {
      const div = document.createElement('div');
      div.className = 'sp-custom-sprite-item';
      div.innerHTML = `
        <div class="sp-custom-sprite-preview">
          ${sprite.image ? `<img src="${sprite.image}" alt="${sprite.name}" />` : '<span class="sp-upload-placeholder">＋</span>'}
        </div>
        <div class="sp-custom-sprite-info">
          <input type="text" class="sp-custom-sprite-name" data-idx="${idx}" value="${sprite.name || ''}" placeholder="动作名称（如：跳舞）" />
          <div class="sp-duration-row">
            <span class="sp-duration-label">⏱️ <span class="sp-custom-duration-val" data-idx="${idx}">${((sprite.duration || 2500)/1000).toFixed(1)}s</span></span>
            <input type="range" class="sp-custom-duration-slider" data-idx="${idx}" min="500" max="10000" step="500" value="${sprite.duration || 2500}" />
          </div>
          <div class="sp-custom-sprite-actions">
            <button class="sp-btn sp-custom-sprite-upload" data-idx="${idx}" type="button">📁 图片</button>
            <button class="sp-btn sp-btn-danger sp-custom-sprite-delete" data-idx="${idx}" type="button">✕</button>
            <input type="file" class="sp-custom-sprite-file" data-idx="${idx}" accept="image/png,image/jpeg,image/gif,image/webp" style="display:none;" />
          </div>
        </div>
      `;
      container.appendChild(div);
    });

    bindCustomSpriteEvents();
  }

  function bindChatHistoryEvents() {
    // 编辑
    document.querySelectorAll('.sp-chat-history-text').forEach(t => {
      t.onchange = () => {
        const idx = parseInt(t.dataset.idx);
        if (state.petChatHistory[idx]) {
          state.petChatHistory[idx].content = t.value;
          saveDataDebounced('聊天记录编辑');
        }
      };
    });

    // 删除单条
    document.querySelectorAll('.sp-chat-history-delete').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.idx);
        state.petChatHistory.splice(idx, 1);
        saveDataImmediate('删除聊天');
        renderChatHistoryList();
        renderChatHistory(); // 同步更新聊天悬浮窗
      };
    });

    // 重回（从该条开始重新生成）
    document.querySelectorAll('.sp-chat-history-retry').forEach(btn => {
      btn.onclick = async () => {
        const idx = parseInt(btn.dataset.idx);
        // 删除该条及之后的所有消息
        state.petChatHistory = state.petChatHistory.slice(0, idx);
        saveDataImmediate('聊天重回'); 
        renderChatHistoryList();
        renderChatHistory();
        // 重新生成
        showBubble('重新回复中…', 2000);
        if (settings.spriteThink) setSpriteWithLock('think', settings.spriteThink, null);
        const reply = await callPetAPI('chat', '');
        if (spriteStateLock === 'think') clearSpriteLock();
        if (reply) {
          state.petChatHistory.push({ role: 'assistant', content: reply });
          saveData();
          renderChatHistoryList();
          renderChatHistory();
          showBubble(reply.slice(0, 50) + (reply.length > 50 ? '…' : ''), 4000);
        }
      };
    });
  }


  // ============================================================
  // 事件绑定
  // ============================================================
  function bindEvents() {
    bindDragEvents();

    // 菜单按钮（同时支持 click 和 touchend）
    document.querySelectorAll('.sp-menu-btn').forEach(btn => {
      btn.addEventListener('click', (e) => { e.stopPropagation(); handleMenuAction(btn.dataset.action); });
      btn.addEventListener('touchend', (e) => { e.stopPropagation(); e.preventDefault(); handleMenuAction(btn.dataset.action); });
    });

    // 聊天（初始化绑定，toggleChat 内会重新绑定最新逻辑）
    const closeBtn = document.getElementById('sp-chat-close');

    if (closeBtn) closeBtn.onclick = () => toggleChat();
    const minimizeBtn = document.getElementById('sp-chat-minimize');
    if (minimizeBtn) {
      minimizeBtn.onclick = () => {
        const chatEl = document.getElementById('silly-pet-chat');
        if (!chatEl) return;
        if (chatEl.classList.contains('sp-chat-minimized')) {
          // 恢复
          chatEl.classList.remove('sp-chat-minimized');
          minimizeBtn.textContent = '─';
          minimizeBtn.title = '缩小悬挂';
        } else {
          // 最小化
          chatEl.classList.add('sp-chat-minimized');
          minimizeBtn.textContent = '□';
          minimizeBtn.title = '恢复窗口';
        }
      };
    }
    const offlineToggle = document.getElementById('sp-chat-offline-toggle');
    if (offlineToggle && isOfflineMode) {
      offlineToggle.style.opacity = '1';
      offlineToggle.style.color = '#90ee90';
      offlineToggle.title = '线下模式（已开启）';
    }
    if (offlineToggle) {
      offlineToggle.onclick = () => {
        isOfflineMode = !isOfflineMode;
        offlineToggle.style.opacity = isOfflineMode ? '1' : '0.6';
        offlineToggle.style.color = isOfflineMode ? '#90ee90' : '#aaa';
        offlineToggle.title = isOfflineMode ? '线下模式（已开启）' : '线下模式';
        showBubble(isOfflineMode ? '🌙 进入线下模式～' : '💻 回到线上模式', 2000);
        state.isOfflineMode = isOfflineMode;
        saveData();
      };
    }

    const chatHeader = document.getElementById('silly-pet-chat-header');
   if (chatHeader) {
    let chatDragging = false, chatOffX = 0, chatOffY = 0;
    const chatDown = (e) => {
     if (e.target.closest('#sp-chat-close') || e.target.closest('#sp-chat-minimize')) return;
     chatDragging = true;
     const chatEl = document.getElementById('silly-pet-chat');
     const clientX = e.touches ? e.touches[0].clientX : e.clientX;
     const clientY = e.touches ? e.touches[0].clientY : e.clientY;
     const rect = chatEl.getBoundingClientRect();
     chatOffX = clientX - rect.left;
     chatOffY = clientY - rect.top;
    };
    const chatMove = (e) => {
      if (!chatDragging) return;
      if (e.cancelable) e.preventDefault();
      const chatEl = document.getElementById('silly-pet-chat');
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      let x = clientX - chatOffX;
      let y = clientY - chatOffY;
      x = Math.max(0, Math.min(window.innerWidth - chatEl.offsetWidth, x));
      y = Math.max(0, Math.min(window.innerHeight - chatEl.offsetHeight, y));
      chatEl.style.left = x + 'px';
      chatEl.style.top = y + 'px';
      chatEl.style.right = 'auto';
      chatEl.style.bottom = 'auto';
    };
  const chatUp = () => { chatDragging = false; };
  chatHeader.addEventListener('mousedown', chatDown);
  chatHeader.addEventListener('touchstart', chatDown, { passive: true });
  document.addEventListener('mousemove', chatMove);
  document.addEventListener('touchmove', chatMove, { passive: false });
  document.addEventListener('mouseup', chatUp);
  document.addEventListener('touchend', chatUp);
}

    // 总结弹窗
    document.getElementById('sp-summary-confirm')?.addEventListener('click', confirmSummary);
    document.getElementById('sp-summary-cancel')?.addEventListener('click', cancelSummary);

    // 空白关闭菜单
    document.addEventListener('click', (e) => {
      const c = document.getElementById('silly-pet-container');
      if (isMenuOpen && c && !c.contains(e.target)) {
        document.getElementById('silly-pet-menu')?.classList.remove('visible');
        isMenuOpen = false;
      }
    });
    document.addEventListener('touchend', (e) => {
      const c = document.getElementById('silly-pet-container');
      if (isMenuOpen && c && !c.contains(e.target)) {
        document.getElementById('silly-pet-menu')?.classList.remove('visible');
        isMenuOpen = false;
      }
    });

    bindChatListener();
  }



  // ============================================================
  // 设置事件
  // ============================================================
   function bindSettingsEvents() {
    // API切换
    const tavernRadio = document.getElementById('sp-api-source-tavern');
    const customRadio = document.getElementById('sp-api-source-custom');
    if (tavernRadio) tavernRadio.onchange = () => {
      document.getElementById('sp-api-tavern-section').style.display = '';
      document.getElementById('sp-api-custom-section').style.display = 'none';
    };
    if (customRadio) customRadio.onchange = () => {
      document.getElementById('sp-api-tavern-section').style.display = 'none';
      document.getElementById('sp-api-custom-section').style.display = '';
    };

    // 获取模型
    document.getElementById('sp-fetch-models')?.addEventListener('click', fetchModelsList);

    document.getElementById('sp-persona-source-card')?.addEventListener('change', () => {
      document.getElementById('sp-persona-manual-section').style.display = 'none';
    });
    document.getElementById('sp-persona-source-manual')?.addEventListener('change', () => {
      document.getElementById('sp-persona-manual-section').style.display = '';
    });

    // 活跃度
    const slider = document.getElementById('sp-activity-level');
    const display = document.getElementById('sp-activity-display');
    if (slider && display) slider.oninput = () => { display.textContent = slider.value + '%'; };

    const wanderSlider = document.getElementById('sp-wander-interval');
    const wanderDisplay = document.getElementById('sp-wander-display');
    if (wanderSlider && wanderDisplay) wanderSlider.oninput = () => { wanderDisplay.textContent = wanderSlider.value + 's'; };

    // 缩放滑轨
    const scaleSlider = document.getElementById('sp-pet-scale');
    const scaleDisplay = document.getElementById('sp-scale-display');
    if (scaleSlider && scaleDisplay) {
      scaleSlider.oninput = () => {
        const val = parseFloat(scaleSlider.value);
        scaleDisplay.textContent = val.toFixed(1) + 'x';
        settings.petScale = val;
        applyPetScale();
        saveDataDebounced('缩放调整');
      };
    }

    // 保存
    document.getElementById('sp-save-settings')?.addEventListener('click', saveAllSettings);

    // 导入导出
    document.getElementById('sp-export')?.addEventListener('click', exportData);
    const importBtn = document.getElementById('sp-import-btn');
    const importFile = document.getElementById('sp-import-file');
    if (importBtn && importFile) {
      importBtn.onclick = () => importFile.click();
      importFile.onchange = (e) => { if (e.target.files[0]) importData(e.target.files[0]); };
    }

    // 记忆
    document.getElementById('sp-add-memory')?.addEventListener('click', () => {
      state.memories.push({ content: '', tag: '', importance: 3, timestamp: Date.now() });
      renderMemoriesList();
      saveData();
    });

    document.getElementById('sp-auto-extract-memory')?.addEventListener('click', async () => {
      if (state.petChatHistory.length < 3) {
        showBubble('聊天记录太少，再聊聊吧', 2000);
        return;
      }
      showBubble('🧠 正在提取关键记忆…', 3000);
      const recent = state.petChatHistory.slice(-20).map(m => {
        const name = m.role === 'user' ? '主人' : '桌宠';
        return `${name}: ${m.content}`;
      }).join('\n');

      const extractPrompt = `${settings.extractPrompt}\n\n对话内容：\n${recent}`;

      const result = await callPetAPI('summary', extractPrompt);
      if (result) {
        const lines = result.split('\n').filter(l => l.trim());
        let added = 0;
        lines.forEach(line => {
          const match = line.match(/^\[(.+?)\]\s*(.+)/);
          if (match) {
            state.memories.push({ content: match[2].trim(), tag: match[1].trim(), importance: 3, timestamp: Date.now() });
            added++;
          } else if (line.trim()) {
            state.memories.push({ content: line.trim(), tag: '', importance: 3, timestamp: Date.now() });
            added++;
          }
        });
        saveData();
        renderMemoriesList();
        showBubble(`✨ 提取了 ${added} 条新记忆`, 3000);
      } else {
        showBubble('提取失败了…', 3000);
      }
    });


    // 总结
    document.getElementById('sp-save-summary')?.addEventListener('click', () => {
      const t = document.getElementById('sp-current-summary');
      if (t) { state.summary = t.value.trim(); saveData(); showBubble('总结已保存！', 2000); }
    });
    document.getElementById('sp-trigger-summary')?.addEventListener('click', () => {
      if (state.petChatHistory.length === 0) { showBubble('没有聊天记录可总结', 2000); return; }
      // 先弹窗让用户选范围，默认用全部生成
      triggerSummary();
    });    
    
    // 搜索下拉
    bindSearchSelects();

    // 自定义动作
    document.getElementById('sp-add-custom-sprite')?.addEventListener('click', () => {
      if (!settings.customSprites) settings.customSprites = [];
      settings.customSprites.push({ name: '', image: '', duration: 2500 });
      saveData();
      renderCustomSprites();
    });

    document.getElementById('sp-clear-chat-history')?.addEventListener('click', () => {
      if (state.petChatHistory.length === 0) return;
      state.petChatHistory = [];
      saveData();
      renderChatHistoryList();
      renderChatHistory();
      showBubble('聊天记录已清空', 2000);
    });
    // 清空所有聊天数据（包括聊天记录+归档+总结）
    document.getElementById('sp-clear-all-chat')?.addEventListener('click', () => {
      if (!confirm('确定要清空所有聊天数据吗？\n包括：聊天记录、历史归档、对话总结\n此操作不可撤销！')) return;
      state.petChatHistory = [];
      state.petChatArchive = [];
      state.summary = '';
      petUnsummarizedCount = 0;
      saveData();
      renderChatHistoryList();
      renderChatHistory();
      renderChatArchive();
      const summaryTextarea = document.getElementById('sp-current-summary');
      if (summaryTextarea) summaryTextarea.value = '';
      showBubble('所有聊天数据已清空', 3000);
    });

    // 重置全部数据（恢复出厂设置）
    document.getElementById('sp-reset-all-data')?.addEventListener('click', () => {
      if (!confirm('确定要重置全部数据吗？\n包括：所有设置、聊天记录、记忆、图片等\n此操作不可撤销！！！')) return;
      if (!confirm('真的确定吗？所有数据都会丢失！')) return;
      // 停掉所有定时器防止重新写入
      if (wanderInterval) { clearInterval(wanderInterval); wanderInterval = null; }
      if (decayInterval) { clearInterval(decayInterval); decayInterval = null; }
      // 清空内存数据
      settings = { ...DEFAULT_SETTINGS };
      state = { ...DEFAULT_STATE };
      // 删除存储
      localStorage.removeItem(STORAGE_KEY);
      alert('数据已重置！点确定后页面将刷新。');
      window.location.reload(true);
    });
        document.querySelectorAll('.sp-theme-card').forEach(card => {
      card.addEventListener('click', () => {
        const theme = card.dataset.theme;
        document.querySelectorAll('.sp-theme-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        const editor = document.getElementById('sp-custom-theme-editor');
        if (theme === 'custom') {
          editor.style.display = 'block';
          if (!settings.customTheme) {
            settings.customTheme = JSON.parse(JSON.stringify(PRESET_THEMES.default));
          }
          renderCustomThemeInputs();
        } else {
          editor.style.display = 'none';
        }
        
        applyTheme(theme);
        showBubble(`已切换到「${PRESET_THEMES[theme]?.name || '自定义'}」主题`, 2000);
      });
    });
    
    document.getElementById('sp-export-theme')?.addEventListener('click', () => {
      const theme = { name: '我的主题', colors: settings.customTheme?.colors || PRESET_THEMES.default.colors };
      const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meep-theme-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showBubble('主题已导出', 2000);
    });
    
    document.getElementById('sp-import-theme-btn')?.addEventListener('click', () => {
      document.getElementById('sp-import-theme-file')?.click();
    });
    
    document.getElementById('sp-import-theme-file')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const theme = JSON.parse(ev.target.result);
          if (!theme.colors) throw new Error();
          settings.customTheme = theme;
          applyTheme('custom');
          renderCustomThemeInputs();
          showBubble('主题导入成功', 2000);
        } catch { showBubble('主题文件格式错误', 3000); }
      };
      reader.readAsText(file);
    });
    
    document.getElementById('sp-reset-custom-theme')?.addEventListener('click', () => {
      settings.customTheme = JSON.parse(JSON.stringify(PRESET_THEMES.default));
      applyTheme('custom');
      renderCustomThemeInputs();
      showBubble('自定义主题已重置', 2000);
    });
    
    if (settings.currentTheme === 'custom') {
      requestAnimationFrame(() => renderCustomThemeInputs());
    }

    // 提示词预设
    document.getElementById('sp-preset-apply')?.addEventListener('click', () => {
      const select = document.getElementById('sp-prompt-preset-select');
      if (!select || !select.value) { showBubble('请先选择一个预设', 2000); return; }

      let preset = null;
      if (select.value.startsWith('builtin:')) {
        const name = select.value.replace('builtin:', '');
        preset = PROMPT_PRESETS_BUILTIN.find(p => p.name === name);
      } else if (select.value.startsWith('custom:')) {
        const name = select.value.replace('custom:', '');
        preset = (settings.promptPresets || []).find(p => p.name === name);
      }

      if (!preset) { showBubble('预设未找到', 2000); return; }

      // 填入表单
      const nameInput = document.getElementById('sp-pet-name');
      const sysInput = document.getElementById('sp-system-prompt');
      const relInput = document.getElementById('sp-relationship-prompt');
      const jbInput = document.getElementById('sp-jailbreak');

      if (nameInput && preset.petName) nameInput.value = preset.petName;
      if (sysInput && preset.systemPrompt) sysInput.value = preset.systemPrompt;
      if (relInput && preset.relationshipPrompt !== undefined) relInput.value = preset.relationshipPrompt;
      if (jbInput && preset.jailbreak !== undefined) jbInput.value = preset.jailbreak;

      settings.currentPreset = select.value;
      saveData();
      showBubble(`已应用预设「${preset.petName || preset.name}」`, 2000);
    });

    document.getElementById('sp-preset-save')?.addEventListener('click', () => {
      const name = prompt('给这个预设起个名字：');
      if (!name || !name.trim()) return;

      const newPreset = {
        name: name.trim(),
        petName: document.getElementById('sp-pet-name')?.value || '咪噗',
        systemPrompt: document.getElementById('sp-system-prompt')?.value || '',
        relationshipPrompt: document.getElementById('sp-relationship-prompt')?.value || '',
        jailbreak: document.getElementById('sp-jailbreak')?.value || '',
      };

      if (!settings.promptPresets) settings.promptPresets = [];
      // 覆盖同名
      const existIdx = settings.promptPresets.findIndex(p => p.name === newPreset.name);
      if (existIdx >= 0) {
        settings.promptPresets[existIdx] = newPreset;
      } else {
        settings.promptPresets.push(newPreset);
      }

      settings.currentPreset = 'custom:' + newPreset.name;
      saveData();

      // 刷新下拉列表
      const select = document.getElementById('sp-prompt-preset-select');
      if (select) {
        // 重新构建 options
        let opts = '<option value="">— 不使用预设 —</option>';
        opts += PROMPT_PRESETS_BUILTIN.map(p => `<option value="builtin:${p.name}">${p.name}</option>`).join('');
        opts += (settings.promptPresets || []).map(p => `<option value="custom:${p.name}" ${settings.currentPreset === 'custom:' + p.name ? 'selected' : ''}>⭐ ${p.name}</option>`).join('');
        select.innerHTML = opts;
        select.value = settings.currentPreset;
      }

      showBubble(`预设「${newPreset.name}」已保存 ⭐`, 2000);
    });

    document.getElementById('sp-preset-delete')?.addEventListener('click', () => {
      const select = document.getElementById('sp-prompt-preset-select');
      if (!select || !select.value) { showBubble('请先选择要删除的预设', 2000); return; }

      if (select.value.startsWith('builtin:')) {
        showBubble('内置预设不能删除哦', 2000);
        return;
      }

      const name = select.value.replace('custom:', '');
      if (!confirm(`确定删除预设「${name}」吗？`)) return;

      settings.promptPresets = (settings.promptPresets || []).filter(p => p.name !== name);
      if (settings.currentPreset === select.value) settings.currentPreset = '';
      saveData();

      // 刷新下拉
      let opts = '<option value="">— 不使用预设 —</option>';
      opts += PROMPT_PRESETS_BUILTIN.map(p => `<option value="builtin:${p.name}">${p.name}</option>`).join('');
      opts += (settings.promptPresets || []).map(p => `<option value="custom:${p.name}">⭐ ${p.name}</option>`).join('');
      select.innerHTML = opts;
      select.value = '';

      showBubble(`预设已删除`, 2000);
    });
    // 多桌宠存档
    document.getElementById('sp-profile-save')?.addEventListener('click', () => {
      const name = prompt('给这个桌宠存档起个名字：', settings.petName || '咪噗');
      if (!name || !name.trim()) return;

      // ★ 保存存档前，先把 DOM 中所有最新设置写入 settings
      syncSettingsFromDOM();

      if (!settings.petProfiles) settings.petProfiles = [];

      // 保存当前完整配置（排除 petProfiles 本身避免嵌套）
      const profileSettings = { ...settings };
      delete profileSettings.petProfiles;
      delete profileSettings.currentProfile;

      const profile = {
        name: name.trim(),
        settings: JSON.parse(JSON.stringify(profileSettings)),
        state: JSON.parse(JSON.stringify(state)),
        timestamp: Date.now()
      };

      const existIdx = settings.petProfiles.findIndex(p => p.name === profile.name);
      if (existIdx >= 0) {
        if (!confirm(`存档「${profile.name}」已存在，覆盖吗？`)) return;
        settings.petProfiles[existIdx] = profile;
      } else {
        settings.petProfiles.push(profile);
      }

      settings.currentProfile = profile.name;
      saveData();

      // 刷新下拉
      const select = document.getElementById('sp-profile-select');
      if (select) {
        let opts = '<option value="">— 当前配置 —</option>';
        opts += settings.petProfiles.map(p => `<option value="${p.name}" ${settings.currentProfile === p.name ? 'selected' : ''}>${p.name}</option>`).join('');
        select.innerHTML = opts;
        select.value = settings.currentProfile;
      }
      showBubble(`存档「${profile.name}」已保存 🐾`, 2000);
    });

    document.getElementById('sp-profile-load')?.addEventListener('click', () => {
      const select = document.getElementById('sp-profile-select');
      if (!select || !select.value) { showBubble('请先选择一个存档', 2000); return; }

      const profile = (settings.petProfiles || []).find(p => p.name === select.value);
      if (!profile) { showBubble('存档未找到', 2000); return; }

      if (!confirm(`确定加载存档「${profile.name}」吗？\n当前未保存的配置会丢失。`)) return;

      // 保留 petProfiles 和 currentProfile 列表本身
      const savedProfiles = settings.petProfiles;
      settings = { ...DEFAULT_SETTINGS, ...profile.settings };
      settings.petProfiles = savedProfiles;
      settings.currentProfile = profile.name;
      state = { ...DEFAULT_STATE, ...profile.state };

      saveData();
      showBubble(`已切换到「${profile.name}」🐾`, 2000);

      // 👈 这里是改动的关键：调用热更新，替换原来的 window.location.reload()
      applyLoadedProfileUI();
    });

    document.getElementById('sp-profile-delete')?.addEventListener('click', () => {
      const select = document.getElementById('sp-profile-select');
      if (!select || !select.value) { showBubble('请先选择要删除的存档', 2000); return; }

      const name = select.value;
      if (!confirm(`确定删除存档「${name}」吗？`)) return;

      settings.petProfiles = (settings.petProfiles || []).filter(p => p.name !== name);
      if (settings.currentProfile === name) settings.currentProfile = '';
      saveData();

      let opts = '<option value="">— 当前配置 —</option>';
      opts += (settings.petProfiles || []).map(p => `<option value="${p.name}">${p.name}</option>`).join('');
      select.innerHTML = opts;
      select.value = '';
      showBubble('存档已删除', 2000);
    });
  }

  // ============================================================
  // 从 DOM 同步设置到 settings 对象（不弹气泡、不触发副作用）
  // ============================================================
  function syncSettingsFromDOM() {
    const v = (id) => document.getElementById(id)?.value || '';
    const n = (id, fb) => { const x = parseFloat(document.getElementById(id)?.value); return isNaN(x) ? fb : x; };
    const c = (id) => document.getElementById(id)?.checked || false;

    settings.apiSource = document.getElementById('sp-api-source-custom')?.checked ? 'custom' : 'tavern';

    if (settings.apiSource === 'tavern') {
      settings.modelOverride = v('sp-model-tavern');
      settings.maxTokens = n('sp-max-tokens-tavern', 300);
    } else {
      settings.apiKey = v('sp-api-key');
      settings.baseUrl = v('sp-base-url');
      settings.model = v('sp-model');
      settings.maxTokens = n('sp-max-tokens', 300);
      settings.enableStreaming = document.getElementById('sp-enable-streaming')?.checked || false;
    }

    settings.characterId = v('sp-character-id');
    settings.worldBookId = v('sp-worldbook-id');
    settings.petName = v('sp-pet-name') || '咪噗';
    settings.systemPrompt = v('sp-system-prompt');
    settings.relationshipPrompt = v('sp-relationship-prompt');
    settings.jailbreak = v('sp-jailbreak');
    settings.summaryPrompt = v('sp-summary-prompt');
    settings.extractPrompt = v('sp-extract-prompt');
    settings.offlinePrompt = v('sp-offline-prompt');
    settings.diaryPrompt = v('sp-diary-prompt');
    settings.summaryMode = v('sp-summary-mode') || 'incremental';
    settings.summaryTrigger = document.getElementById('sp-summary-auto')?.checked ? 'auto' : 'manual';
    settings.summaryKeepRecent = n('sp-summary-keep', 10);
    settings.enableVision = document.getElementById('sp-enable-vision')?.checked || false;

    settings.wanderInterval = n('sp-wander-interval', 8);

    settings.userPersonaSource = document.getElementById('sp-persona-source-card')?.checked ? 'card' : 'manual';
    settings.userPersonaText = v('sp-user-persona-text');

    settings.activityLevel = n('sp-activity-level', 50);
    settings.enableAutoReact = c('sp-enable-react');
    settings.cooldownSeconds = n('sp-cooldown', 30);
    settings.peekRounds = n('sp-peek-rounds', 5);
    settings.petChatRounds = n('sp-pet-chat-rounds', 20);
    settings.enableTimeAwareness = document.getElementById('sp-enable-time-awareness')?.checked || false;
    settings.autoSummaryRounds = n('sp-auto-summary', 20);

    settings.displayMode = v('sp-display-mode');
    settings.petScale = n('sp-pet-scale', 1.0);
    settings.apiTimeout = n('sp-api-timeout', 15);
    settings.offlineDecayRate = n('sp-decay-rate', 0.15);
    settings.safetyThreshold = n('sp-safety-threshold', 10);

    settings.showStatusBar = c('sp-show-status-bar');

    settings.reactions = {
      feed: v('sp-react-feed') || DEFAULT_SETTINGS.reactions.feed,
      bath: v('sp-react-bath') || DEFAULT_SETTINGS.reactions.bath,
      sleep: v('sp-react-sleep') || DEFAULT_SETTINGS.reactions.sleep,
      drag: v('sp-react-drag') || DEFAULT_SETTINGS.reactions.drag,
      idle: v('sp-react-idle') || DEFAULT_SETTINGS.reactions.idle,
      idleHungry: v('sp-react-idle-hungry') || DEFAULT_SETTINGS.reactions.idleHungry,
      idleDirty: v('sp-react-idle-dirty') || DEFAULT_SETTINGS.reactions.idleDirty,
      idleSleepy: v('sp-react-idle-sleepy') || DEFAULT_SETTINGS.reactions.idleSleepy,
      returnLong: v('sp-react-return-long') || DEFAULT_SETTINGS.reactions.returnLong,
      returnShort: v('sp-react-return-short') || DEFAULT_SETTINGS.reactions.returnShort,
    };

    // 同步记忆编辑区的总结
    const summaryTextarea = document.getElementById('sp-current-summary');
    if (summaryTextarea) state.summary = summaryTextarea.value.trim();
  }

  // ============================================================
  // 保存设置
  // ============================================================
    function saveAllSettings() {
    syncSettingsFromDOM();

    startWandering();
    saveData();
    renderStatusOverview();
    const statusBar = document.getElementById('silly-pet-status-bar');
    if (statusBar) statusBar.style.display = settings.showStatusBar ? '' : 'none';
    const chatTitle = document.getElementById('sp-chat-title-name');
    if (chatTitle) chatTitle.textContent = settings.petName || '咪噗';
    showBubble('设置保存成功！', 2000);
  }



  // ============================================================
  // 标签页切换
  // ============================================================
function bindTabSwitching() {
  const tabsContainer = document.getElementById('sp-tabs-bar');
  const tabs = document.querySelectorAll('#silly-pet-settings .sp-tab');
  const panels = document.querySelectorAll('#silly-pet-settings .sp-tab-panel');
  let hasMoved = false;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (hasMoved) { hasMoved = false; return; }
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === target));
      tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
  });

  if (tabsContainer) {
    let isDown = false, startX = 0, scrollLeft = 0;
    
    tabsContainer.addEventListener('mousedown', (e) => { 
      isDown = true; 
      hasMoved = false; 
      startX = e.pageX - tabsContainer.offsetLeft; 
      scrollLeft = tabsContainer.scrollLeft;
      e.stopPropagation();
    });
    
    tabsContainer.addEventListener('mouseleave', () => { isDown = false; });
    
    tabsContainer.addEventListener('mouseup', (e) => { 
      isDown = false;
      e.stopPropagation();
    });
    
    tabsContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      
      const walk = (e.pageX - tabsContainer.offsetLeft - startX) * 1.5;
      if (Math.abs(walk) > 3) {
        hasMoved = true;
        e.preventDefault(); // 👈 只在真正移动时才阻止
      }
      e.stopPropagation();
      tabsContainer.scrollLeft = scrollLeft - walk;
    });
    
    // 触摸事件
    let touchStartX = 0;
    tabsContainer.addEventListener('touchstart', (e) => {
      isDown = true;
      hasMoved = false;
      const touch = e.touches[0];
      startX = touch.pageX - tabsContainer.offsetLeft;
      touchStartX = touch.pageX;
      scrollLeft = tabsContainer.scrollLeft;
      e.stopPropagation();
    }, { passive: true }); // 👈 改为 passive: true
    
    tabsContainer.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      
      const touch = e.touches[0];
      const walk = (touch.pageX - tabsContainer.offsetLeft - startX) * 1.5;
      
      // 只有在水平滑动明显时才阻止默认行为
      const horizontalMove = Math.abs(touch.pageX - touchStartX);
      const verticalMove = Math.abs(touch.pageY - e.touches[0].pageY);
      
      if (horizontalMove > verticalMove && Math.abs(walk) > 5) {
        hasMoved = true;
        if (e.cancelable) e.preventDefault(); // 👈 添加 cancelable 检查
      }
      
      e.stopPropagation();
      tabsContainer.scrollLeft = scrollLeft - walk;
    }, { passive: false });
    
    tabsContainer.addEventListener('touchend', (e) => {
      isDown = false;
      e.stopPropagation();
    });
  }
}



// ============================================================
// 自定义动作事件绑定
// ============================================================
function bindCustomSpriteEvents() {
  // 名称编辑
  document.querySelectorAll('.sp-custom-sprite-name').forEach(input => {
    input.onchange = () => {
      const idx = parseInt(input.dataset.idx);
      if (settings.customSprites[idx]) {
        settings.customSprites[idx].name = input.value.trim();
        saveDataDebounced('自定义动作名称');
      }
    };
  });

  // 上传按钮
  document.querySelectorAll('.sp-custom-sprite-upload').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.idx);
      const fileInput = document.querySelector(`.sp-custom-sprite-file[data-idx="${idx}"]`);
      if (fileInput) fileInput.click();
    };
  });

  // 预览区点击也触发上传
  document.querySelectorAll('.sp-custom-sprite-preview').forEach(preview => {
    const item = preview.closest('.sp-custom-sprite-item');
    if (!item) return;
    const idx = item.querySelector('.sp-custom-sprite-name')?.dataset.idx;
    if (idx === undefined) return;
    preview.onclick = () => {
      const fileInput = document.querySelector(`.sp-custom-sprite-file[data-idx="${idx}"]`);
      if (fileInput) fileInput.click();
    };
  });

  // 文件选择
  document.querySelectorAll('.sp-custom-sprite-file').forEach(input => {
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) { showBubble('图片超过2MB了～', 3000); return; }

      const idx = parseInt(input.dataset.idx);
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const compressed = await compressImage(ev.target.result, 200, 0.7);
        if (settings.customSprites[idx]) {
          settings.customSprites[idx].image = compressed;
          saveDataImmediate('上传自定义动作图片');
          renderCustomSprites();
          showBubble('自定义动作图片设置好啦～', 2000);
        }
      };
      reader.readAsDataURL(file);
    };
  });

  // 删除
  document.querySelectorAll('.sp-custom-sprite-delete').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.idx);
      settings.customSprites.splice(idx, 1);
      saveDataImmediate('删除自定义动作');
      renderCustomSprites();
    };
  });

  // 时间滑轨
  document.querySelectorAll('.sp-custom-duration-slider').forEach(slider => {
    slider.oninput = () => {
      const idx = parseInt(slider.dataset.idx);
      const val = parseInt(slider.value);
      if (settings.customSprites[idx]) {
        settings.customSprites[idx].duration = val;
        const display = document.querySelector(`.sp-custom-duration-val[data-idx="${idx}"]`);
        if (display) display.textContent = (val / 1000).toFixed(1) + 's';
        saveDataDebounced('动作时长调整');
      }
    };
  });
}

// ============================================================
// 图片上传相关
// ============================================================
function buildUploadGroup(key, label, currentValue) {
  const hasImage = !!currentValue;
  const duration = (settings.spriteDurations && settings.spriteDurations[key]) || 2000;
  return `
    <div class="sp-upload-group" data-upload-key="${key}">
      <label>${label}</label>
      <div class="sp-upload-preview" data-key="${key}">
        ${hasImage
          ? `<img src="${currentValue}" alt="${label}" /><span class="sp-upload-remove" data-key="${key}">✕</span>`
          : `<span class="sp-upload-placeholder">＋</span>`}
      </div>
      <div class="sp-upload-actions">
        <button class="sp-btn sp-upload-btn" data-key="${key}" type="button">📁 选择</button>
        <input type="file" id="sp-file-${key}" data-key="${key}" accept="image/png,image/jpeg,image/gif,image/webp" />
      </div>
      <div class="sp-duration-row">
        <span class="sp-duration-label">⏱️ <span class="sp-duration-val" data-key="${key}">${(duration/1000).toFixed(1)}s</span></span>
        <input type="range" class="sp-duration-slider" data-key="${key}" min="500" max="10000" step="500" value="${duration}" />
      </div>
      <div class="sp-upload-hint">PNG/JPG/GIF(动图)/WebP 2MB内</div>
    </div>`;
}

function bindAllImageUploads() {
  document.querySelectorAll('#silly-pet-settings .sp-upload-preview').forEach(preview => {
    preview.onclick = (e) => {
      if (e.target.classList.contains('sp-upload-remove')) return;
      const fi = document.getElementById(`sp-file-${preview.dataset.key}`);
      if (fi) fi.click();
    };
    const rm = preview.querySelector('.sp-upload-remove');
    if (rm) rm.onclick = (e) => {
      e.stopPropagation();
      const rmKey = rm.dataset.key;
      setSettingsImage(rmKey, '');
      updateUploadPreview(rmKey, '');
      updateSpriteImage();
      updateMoodDisplay();
      saveData();
    };
  });

  document.querySelectorAll('#silly-pet-settings .sp-upload-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      const fi = document.getElementById(`sp-file-${btn.dataset.key}`);
      if (fi) fi.click();
    };
  });

  document.querySelectorAll('#silly-pet-settings input[type="file"][data-key]').forEach(input => {
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) { showBubble('图片超过2MB了～', 3000); return; }
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const key = input.dataset.key;
        const compressed = await compressImage(ev.target.result, 200, 0.7);
        setSettingsImage(key, compressed);
        updateUploadPreview(key, compressed);
        updateSpriteImage();
        updateMoodDisplay();
        saveData();
        showBubble('形象设置好啦～✨', 2000);
      };
      reader.readAsDataURL(file);
    };
  });

  // 时间滑轨
  document.querySelectorAll('.sp-duration-slider').forEach(slider => {
    slider.oninput = () => {
      const sliderKey = slider.dataset.key;
      const val = parseInt(slider.value);
      if (!settings.spriteDurations) settings.spriteDurations = {};
      settings.spriteDurations[sliderKey] = val;
      const display = document.querySelector(`.sp-duration-val[data-key="${sliderKey}"]`);
      if (display) display.textContent = (val / 1000).toFixed(1) + 's';
      saveData();
    };
  });
}

function setSettingsImage(key, value) {
  if (key.startsWith('mood')) {
    if (!settings.moodImages) settings.moodImages = {};
    const moodKey = key.replace('mood', '').toLowerCase();
    settings.moodImages[moodKey] = value;
  } else if (key.startsWith('menuIcon')) {
    // 👇 新增：处理菜单图标
    if (!settings.menuIcons) settings.menuIcons = {};
    const actionKey = key.replace('menuIcon', '').toLowerCase();
    settings.menuIcons[actionKey] = value;
  } else {
    settings[key] = value;
  }
}


function updateUploadPreview(key, dataUrl) {
  const preview = document.querySelector(`.sp-upload-preview[data-key="${key}"]`);
  if (!preview) return;
  preview.innerHTML = dataUrl
    ? `<img src="${dataUrl}" alt="" /><span class="sp-upload-remove" data-key="${key}">✕</span>`
    : `<span class="sp-upload-placeholder">＋</span>`;

  preview.onclick = (e) => {
    if (e.target.classList.contains('sp-upload-remove')) return;
    const fi = document.getElementById(`sp-file-${key}`);
    if (fi) fi.click();
  };
  const rm = preview.querySelector('.sp-upload-remove');
  if (rm) rm.onclick = (e) => {
    e.stopPropagation();
    setSettingsImage(rm.dataset.key, '');
    updateUploadPreview(rm.dataset.key, '');
    updateSpriteImage();
    updateMoodDisplay();
    saveData();
  };
    // 👇 新增：如果是菜单图标，刷新菜单显示
  if (key.startsWith('menuIcon')) {
    const container = document.getElementById('silly-pet-container');
    if (container) {
      const menu = container.querySelector('#silly-pet-menu');
      if (menu) {
        menu.innerHTML = renderMenuButtons();
        // 重新绑定事件
        menu.querySelectorAll('.sp-menu-btn').forEach(btn => {
          btn.onclick = (e) => { e.stopPropagation(); handleMenuAction(btn.dataset.action); };
          btn.ontouchend = (e) => { e.stopPropagation(); e.preventDefault(); handleMenuAction(btn.dataset.action); };
        });
      }
    }
  }

}

// ============================================================
// 记忆管理
// ============================================================
function renderMemoriesList() {
  const container = document.getElementById('sp-memories-list');
  if (!container) return;
  container.innerHTML = '';

  state.memories = state.memories.map(mem => {
    if (typeof mem === 'string') return { content: mem, tag: '', importance: 3, timestamp: Date.now() };
    return mem;
  });

  const sorted = [...state.memories].sort((a, b) => (b.importance || 3) - (a.importance || 3));

  sorted.forEach((mem) => {
    const realIdx = state.memories.indexOf(mem);
    const item = document.createElement('div');
    item.className = 'sp-memory-item';
    const stars = '★'.repeat(mem.importance || 3) + '☆'.repeat(5 - (mem.importance || 3));
    const timeStr = mem.timestamp ? new Date(mem.timestamp).toLocaleDateString() : '';
    item.innerHTML = `
      <div style="flex:1;display:flex;flex-direction:column;gap:4px;">
        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
          <input type="text" class="sp-memory-tag" data-idx="${realIdx}" value="${mem.tag || ''}" placeholder="标签" style="width:70px;padding:3px 6px;font-size:11px;margin:0;" />
          <span class="sp-memory-stars" data-idx="${realIdx}" style="cursor:pointer;font-size:12px;color:#ffb347;" title="点击调整重要度">${stars}</span>
          <span style="font-size:10px;color:#666;">${timeStr}</span>
        </div>
        <textarea class="sp-memory-text" data-idx="${realIdx}">${mem.content}</textarea>
      </div>
      <button class="sp-btn sp-btn-danger sp-memory-delete" data-idx="${realIdx}" style="align-self:flex-start;">✕</button>
    `;
    container.appendChild(item);
  });

  bindMemoryEvents();
}

function bindMemoryEvents() {
  document.querySelectorAll('.sp-memory-text').forEach(t => {
    t.onchange = () => {
      const idx = parseInt(t.dataset.idx);
      if (state.memories[idx]) { 
        state.memories[idx].content = t.value; 
        saveDataDebounced('记忆编辑'); // 这里改
      }
    };
  });
  document.querySelectorAll('.sp-memory-tag').forEach(t => {
    t.onchange = () => {
      const idx = parseInt(t.dataset.idx);
      if (state.memories[idx]) { 
        state.memories[idx].tag = t.value.trim(); 
        saveDataDebounced('标签编辑'); 
      }
    };
  });
  document.querySelectorAll('.sp-memory-stars').forEach(el => {
    el.onclick = () => {
      const idx = parseInt(el.dataset.idx);
      if (!state.memories[idx]) return;
      let imp = (state.memories[idx].importance || 3) + 1;
      if (imp > 5) imp = 1;
      state.memories[idx].importance = imp;
      saveDataDebounced('重要度调整');
      renderMemoriesList();
    };
  });
  document.querySelectorAll('.sp-memory-delete').forEach(b => {
    b.onclick = () => {
      state.memories.splice(parseInt(b.dataset.idx), 1);
      renderMemoriesList();
      saveDataImmediate('删除记忆'); 
    };
  });
}

// ============================================================
// 聊天记录
// ============================================================
function renderChatHistoryList() {
  const container = document.getElementById('sp-chat-history-list');
  const countEl = document.getElementById('sp-chat-history-count');
  if (!container) return;
  if (countEl) countEl.textContent = state.petChatHistory.length;

  if (state.petChatHistory.length === 0) {
    container.innerHTML = '<p style="font-size:12px;color:#999;text-align:center;">暂无聊天记录</p>';
    return;
  }

  let html = `
    <div style="margin-bottom:8px;display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
      <button class="sp-btn" id="sp-load-chat-to-window" title="在聊天窗口中查看完整记录">📖 读取到聊天窗口</button>
      <button class="sp-btn" id="sp-capture-chat-to-history" title="刷新显示最新记录">📥 捕捉聊天窗口</button>
      <button class="sp-btn" id="sp-export-chat-txt" title="导出为TXT文件">📄 导出TXT</button>
    </div>
  `;

  html += state.petChatHistory.map((msg, idx) => {
    const icon = msg.role === 'user' ? '👤' : '🐾';
    const label = msg.role === 'user' ? '主人' : '桌宠';
    return `
      <div class="sp-chat-history-item" data-idx="${idx}">
        <div class="sp-chat-history-header">
          <span>${icon} ${label}</span>
          <div class="sp-chat-history-actions">
            <button class="sp-btn sp-chat-history-retry" data-idx="${idx}" title="从这里重回">🔄</button>
            <button class="sp-btn sp-btn-danger sp-chat-history-delete" data-idx="${idx}" title="删除">✕</button>
          </div>
        </div>
        <textarea class="sp-chat-history-text" data-idx="${idx}">${msg.content}</textarea>
      </div>
    `;
  }).join('');

  container.innerHTML = html;

  document.getElementById('sp-load-chat-to-window')?.addEventListener('click', () => {
    if (!isChatOpen) { toggleChat(); }
    renderChatHistory();
    showBubble('📖 已加载全部聊天记录', 2000);
  });

  document.getElementById('sp-capture-chat-to-history')?.addEventListener('click', () => {
    renderChatHistoryList();
    showBubble('📥 已刷新聊天记录列表', 2000);
  });

  document.getElementById('sp-export-chat-txt')?.addEventListener('click', () => {
    if (state.petChatHistory.length === 0) { showBubble('没有聊天记录可导出', 2000); return; }
    const lines = state.petChatHistory.map(msg => {
      const name = msg.role === 'user' ? '主人' : '桌宠';
      return `【${name}】\n${msg.content}\n`;
    });
    const text = `═══════════════════════════════\n  咪噗 ☆ MeepPet 聊天记录\n  导出时间: ${new Date().toLocaleString()}\n  共 ${state.petChatHistory.length} 条消息\n═══════════════════════════════\n\n` + lines.join('\n─────────────────────────────\n\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `咪噗聊天记录_${new Date().toLocaleDateString().replace(/\//g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showBubble('📄 聊天记录已导出', 2000);
  });

  bindChatHistoryEvents();
}

function renderChatArchive() {
  const container = document.getElementById('sp-chat-archive-list');
  const countEl = document.getElementById('sp-archive-count');
  if (!container) return;

  const archive = state.petChatArchive || [];
  if (countEl) countEl.textContent = archive.length;

  if (archive.length === 0) {
    container.innerHTML = '<p style="font-size:12px;color:#999;text-align:center;">暂无归档记录</p>';
    return;
  }

  container.innerHTML = archive.map((batch, batchIdx) => {
    const time = new Date(batch.timestamp).toLocaleString();
    const msgCount = batch.messages.length;
    const preview = batch.messages.slice(0, 2).map(m => {
      const name = m.role === 'user' ? '主人' : '桌宠';
      return `${name}: ${(m.content || '').slice(0, 30)}...`;
    }).join(' | ');

    return `
      <div class="sp-chat-history-item" style="cursor:pointer;" data-archive-idx="${batchIdx}">
        <div class="sp-chat-history-header">
          <span>📅 ${time} (${msgCount}条)</span>
          <div class="sp-chat-history-actions">
            <button class="sp-btn sp-archive-view" data-idx="${batchIdx}" title="查看">👁️</button>
            <button class="sp-btn sp-btn-danger sp-archive-delete" data-idx="${batchIdx}" title="删除">✕</button>
          </div>
        </div>
        <div style="font-size:11px;color:#999;padding:2px 0;">${preview}</div>
      </div>
    `;
  }).join('');

  // 查看
  container.querySelectorAll('.sp-archive-view').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.idx);
      const batch = archive[idx];
      if (!batch) return;
      const text = batch.messages.map(m => {
        const name = m.role === 'user' ? '主人' : '桌宠';
        return `【${name}】\n${m.content}`;
      }).join('\n─────────────────\n');
      const textarea = document.getElementById('sp-summary-edit');
      const modal = document.getElementById('silly-pet-summary-modal');
      if (textarea && modal) {
        textarea.value = `📚 归档记录 (${new Date(batch.timestamp).toLocaleString()})\n${'═'.repeat(30)}\n\n${text}`;
        textarea.readOnly = true;
        modal.classList.add('visible');
        const cancelBtn = document.getElementById('sp-summary-cancel');
        const origCancel = cancelBtn?.onclick;
        if (cancelBtn) {
          cancelBtn.onclick = () => { textarea.readOnly = false; modal.classList.remove('visible'); cancelBtn.onclick = origCancel; };
        }
      }
    };
  });

  // 删除
  container.querySelectorAll('.sp-archive-delete').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.idx);
      state.petChatArchive.splice(idx, 1);
      saveData();
      renderChatArchive();
    };
  });
}

// ============================================================
// 搜索下拉
// ============================================================
function bindSearchSelects() {
  bindSearchInput('sp-character-id', 'sp-char-dropdown', getAvailableCharacters, (name) => {
    settings.characterId = name;
    if (name) {
      showBubble(`角色卡：${name}`, 2000);
    } else {
      showBubble('已清除角色卡选择', 2000);
    }
    refreshCharPreview();
  });
  bindSearchInput('sp-worldbook-id', 'sp-world-dropdown', getAvailableWorldBooks, (name) => {
    settings.worldBookId = name;
    if (name) {
      showBubble(`世界书：${name}`, 2000);
    } else {
      showBubble('已清除世界书选择', 2000);
    }
    refreshWorldPreview();
  });

  if (settings.characterId) refreshCharPreview();
  if (settings.worldBookId) refreshWorldPreview();

  document.getElementById('sp-char-preview-toggle')?.addEventListener('click', () => {
    const content = document.getElementById('sp-char-preview-content');
    const btn = document.getElementById('sp-char-preview-toggle');
    if (content && btn) {
      const expanded = content.classList.toggle('expanded');
      btn.textContent = expanded ? '收起' : '展开';
    }
  });
}

function bindSearchInput(inputId, dropdownId, getItemsFn, onSelect) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  if (!input || !dropdown) return;

  input.addEventListener('input', () => populateDropdown(dropdown, input, getItemsFn, onSelect));
  input.addEventListener('focus', () => populateDropdown(dropdown, input, getItemsFn, onSelect));
  input.addEventListener('blur', () => setTimeout(() => dropdown.classList.remove('visible'), 200));
}

function populateDropdown(dropdown, input, getItemsFn, onSelect) {
  const items = getItemsFn();
  const query = input.value.trim().toLowerCase();
  const filtered = query ? items.filter(i => i.name.toLowerCase().includes(query)) : items;

  if (filtered.length === 0 && !query) {
    dropdown.innerHTML = `
      <div class="sp-search-dropdown-item sp-search-dropdown-clear" data-name="">
        <span class="sp-item-avatar">🚫</span>
        <span style="color:#999;">不选择</span>
      </div>
      <div class="sp-search-dropdown-empty">未检测到数据</div>
    `;
  } else if (filtered.length === 0) {
    dropdown.innerHTML = `
      <div class="sp-search-dropdown-item sp-search-dropdown-clear" data-name="">
        <span class="sp-item-avatar">🚫</span>
        <span style="color:#999;">不选择</span>
      </div>
      <div class="sp-search-dropdown-empty">无匹配</div>
    `;
  } else {
    const clearOption = `
      <div class="sp-search-dropdown-item sp-search-dropdown-clear" data-name="">
        <span class="sp-item-avatar">🚫</span>
        <span style="color:#999;">不选择</span>
      </div>
    `;
    dropdown.innerHTML = clearOption + filtered.map(item => `
      <div class="sp-search-dropdown-item" data-name="${item.name}">
        <span class="sp-item-avatar">${item.avatar || item.type || '📄'}</span>
        <span>${item.name}${item.type ? ` <small style="color:#999">(${item.type})</small>` : ''}</span>
      </div>
    `).join('');
  }

  dropdown.querySelectorAll('.sp-search-dropdown-item').forEach(el => {
    el.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const name = el.dataset.name;
      input.value = name;
      dropdown.classList.remove('visible');
      onSelect(name);
      saveData();
    });
  });

  dropdown.classList.add('visible');
}

// ============================================================
// 预览刷新
// ============================================================
function refreshCharPreview() {
  const box = document.getElementById('sp-char-preview');
  const content = document.getElementById('sp-char-preview-content');
  if (!box || !content) return;

  const desc = getCharacterDescription();
  if (desc) {
    content.textContent = desc;
    box.style.display = '';
  } else {
    box.style.display = 'none';
    content.textContent = '';
  }
}

  // ============================================================
  // 工具函数
  // ============================================================
  function getContext() {
    if (typeof window.SillyTavern !== 'undefined' && window.SillyTavern.getContext) {
      return window.SillyTavern.getContext();
    }
    if (typeof window.getContext === 'function') {
      return window.getContext();
    }
    return null;
  }

  // ============================================================
  // 生命周期
  // ============================================================
  window.addEventListener('beforeunload', () => {
    state.lastOnlineTimestamp = Date.now();
    saveData();
  });

  setInterval(saveData, 60000);

  // ============================================================
  // 启动
  // ============================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 1000));
  } else {
    setTimeout(init, 1000);
  }

  window.addEventListener('resize', () => {
    const container = document.getElementById('silly-pet-container');
    if (!container || container.style.display === 'none') return;
    let left = parseInt(container.style.left) || 0;
    const maxX = window.innerWidth - container.offsetWidth;
    if (left > maxX) {
      container.style.left = Math.max(0, maxX - 10) + 'px';
    }
  });

})();

