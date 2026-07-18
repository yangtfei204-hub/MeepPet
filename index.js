// ============================================================
// 咪噗 ☆ MeepPet - SillyTavern 桌宠插件
// ============================================================

(function () {
  'use strict';

  const PLUGIN_NAME = 'meep-pet';
  const STORAGE_KEY = 'meep_pet_data';

  // ============================================================
  // IndexedDB 存储层
  // ============================================================
  const DB_NAME = 'meep_pet_db';
  const DB_VERSION = 1;
  const DB_STORE = 'data';
  let _db = null;

  function openDB() {
    return new Promise((resolve, reject) => {
      if (_db) { resolve(_db); return; }
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(DB_STORE)) {
          db.createObjectStore(DB_STORE);
        }
      };
      req.onsuccess = (e) => { _db = e.target.result; resolve(_db); };
      req.onerror = (e) => { reject(e.target.error); };
    });
  }

  function idbGet(key) {
    return openDB().then(db => new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, 'readonly');
      const req = tx.objectStore(DB_STORE).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e.target.error);
    }));
  }

  function idbSet(key, value) {
    return openDB().then(db => new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, 'readwrite');
      const req = tx.objectStore(DB_STORE).put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = (e) => reject(e.target.error);
    }));
  }

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

    lightBlue: {
      name: '🩵 淡蓝',
      colors: {
        primary: 'rgba(147,197,253,0.35)',
        primaryHover: 'rgba(147,197,253,0.55)',
        primaryBorder: 'rgba(147,197,253,0.45)',
        bgMain: 'rgba(240,247,255,0.92)',
        bgSecondary: 'rgba(224,239,255,0.95)',
        bgLight: 'rgba(186,220,255,0.18)',
        border: 'rgba(147,197,253,0.35)',
        borderLight: 'rgba(147,197,253,0.20)',
        textPrimary: '#2c4a6e',
        textSecondary: '#4a6a8e',
        textMuted: '#7a9abe',
        statusHunger: '#f6a355',
        statusClean: '#7ec8e3',
        statusEnergy: '#86c99a',
        bubbleBg: 'rgba(224,239,255,0.95)',
        bubbleBorder: 'rgba(147,197,253,0.40)',
      }
    },
    lightPurple: {
      name: '🪻 淡紫',
      colors: {
        primary: 'rgba(196,167,231,0.35)',
        primaryHover: 'rgba(196,167,231,0.55)',
        primaryBorder: 'rgba(196,167,231,0.45)',
        bgMain: 'rgba(248,244,255,0.92)',
        bgSecondary: 'rgba(238,232,255,0.95)',
        bgLight: 'rgba(210,190,255,0.18)',
        border: 'rgba(196,167,231,0.35)',
        borderLight: 'rgba(196,167,231,0.20)',
        textPrimary: '#3d2a5e',
        textSecondary: '#5e4a7e',
        textMuted: '#8e7aae',
        statusHunger: '#f6a355',
        statusClean: '#c4a7e7',
        statusEnergy: '#a3c4a8',
        bubbleBg: 'rgba(238,232,255,0.95)',
        bubbleBorder: 'rgba(196,167,231,0.40)',
      }
    },

    lightYellow: {
      name: '🌼 淡黄',
      colors: {
        primary: 'rgba(234,210,120,0.35)',
        primaryHover: 'rgba(234,210,120,0.55)',
        primaryBorder: 'rgba(234,210,120,0.45)',
        bgMain: 'rgba(255,252,235,0.92)',
        bgSecondary: 'rgba(255,248,215,0.95)',
        bgLight: 'rgba(255,235,150,0.18)',
        border: 'rgba(234,210,120,0.35)',
        borderLight: 'rgba(234,210,120,0.20)',
        textPrimary: '#5a4410',
        textSecondary: '#7a621e',
        textMuted: '#a8903a',
        statusHunger: '#e8834a',
        statusClean: '#8ecad8',
        statusEnergy: '#8ec48a',
        bubbleBg: 'rgba(255,248,215,0.95)',
        bubbleBorder: 'rgba(234,210,120,0.40)',
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

    // GitHub 图片托管
    githubToken: '',           // GitHub Personal Access Token
    githubRepo: '',            // 格式: username/repo-name
    githubBranch: 'main',     // 分支名
    githubPath: 'meep-images', // 存放图片的文件夹路径

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
    // 桌宠小屋
    houseBackground: '',         // 房间背景图（2:3）
    houseCharacter: '',          // 默认人物立绘
    houseExpressions: [],        // [{keywords: '笑,开心,哈哈', image: 'base64...', name: '笑'}]
    houseCharacterAvatar: '',   // 小屋对话框角色头像
    houseActionFeed: '',           // 小屋喂食动作立绘
    houseActionBath: '',           // 小屋洗澡动作立绘
    houseActionSleep: '',          // 小屋睡觉动作立绘
    houseButtonFeed: '',           // 小屋喂食按钮图标
    houseButtonBath: '',           // 小屋洗澡按钮图标
    houseButtonSleep: '',          // 小屋睡觉按钮图标
    houseButtonWardrobe: '',       // 小屋更衣按钮图标
    houseButtonRegen: '',          // 小屋重新生成按钮图标
    houseButtonSend: '',           // 小屋发送按钮图标
    houseButtonWardrobeSettings: '', // 更衣系统设置入口按钮图标
    houseOutfits: [],              // 服装列表 [{name, character, actionFeed, actionBath, actionSleep, expressions: []}]
    houseCurrentOutfit: '',        // 当前穿着的服装名

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
     game: '',
     house: '',
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
    // ===== 合成游戏状态 =====
    gameGold: 0,
    gameStamina: 100,
    gameStaminaMax: 100,
    gameLastStaminaRecover: Date.now(),
    gameBoard: [],          // 6x6 棋盘，每格 null 或 {chain, level}
    gameOrders: [],         // 当前3个订单
    gameCollection: [],     // 图鉴已解锁
    gameCustomImages: {},   // 玩家自定义图片 {key: url}
    gameBgImage: '',        // 游戏背景图
    gameGeneratorPos: 0,    // 生成器固定位置（0-35索引）
    gameSellPos: 47,        // 售卖区固定位置
    gameInventory: [],        // [{category, idx, count}] 玩家购买的物品库存
    quickFeed: null,          // {category:'food', idx:0} 快捷投喂物品
    quickClean: null,         // {category:'clean', idx:0} 快捷清洁物品
    quickEnergy: null,        // {category:'energy', idx:0} 快捷精力物品
    gameShopBuyLog: {},       // {'2026-07-15': {'food_1': 2, 'clean_2': 1, ...}}
    gameOrderRefreshCD: 0,    // 订单刷新冷却时间戳
    match3ItemPurchaseLog: {},   // {'2026-07-15': {'expand': 2, 'sweep': 1, 'shuffle': 3}}
    match3Inventory: { expand: 0, sweep: 0, shuffle: 0 },  // 消消看道具背包库存
    lotteryLog: {},  // {'2026-07-15': {'small': 2, 'medium': 1, 'large': 0}} 按奖池分别计数
    linkInventory: { hint: 0, shuffle: 0, bomb: 0, compass: 0 },  // 连连看道具背包
    linkItemPurchaseLog: {},  // {'2026-07-15': {'hint': 2, 'shuffle': 1, ...}}
    gameStaminaInventory: { stamina30: 0, stamina50: 0, stamina100: 0 },  // 体力道具背包
    gameStaminaShopLog: {},  // {'2026-07-15': {'stamina30': 2, ...}}
    gameResetCooldown: 0,  // 上次重置全部游戏数据的时间戳
    fridgeInventory: [],  // [{foodId: 'cola', count: 3}, ...] 冰箱食物库存
    fridgePropInventory: { compress: 0, backpack: 0, organize: 0 },  // 冰箱道具背包
    fridgePropShopLog: {},  // {'2026-07-15': {'compress': 2, ...}}
    shelfPropInventory: { basket: 0, autoMatch: 0, shuffle: 0 },
    shelfPropShopLog: {},
    // ===== 糖葫芦工坊状态 =====
    tanghuluInventory: [],  // [{fruitKey: 'strawberry', count: 3}, ...] 糖葫芦成品库存
    tanghuluSugarCrystal: 0,  // 完美的亮晶晶糖砂数量
    tanghuluPropInventory: { extraStick: 0, undo: 0, lubricant: 0 },  // 糖葫芦道具背包
    tanghuluPropShopLog: {},  // {'2026-07-15': {'extraStick': 1, ...}}
    // ===== 小猫餐厅状态 =====
    restaurantReputation: 0,
    restaurantLevel: 1,
    restaurantTotalEarnings: 0,
    restaurantTodayEarnings: 0,
    restaurantLastOpenDate: '',
    restaurantCookedDishes: [],      // [{recipeId, count}]
    restaurantSeasonings: {},        // {salt: 5, pepper: 2, ...}
    restaurantServedCount: 0,
    // ===== 成就系统 =====
    achievements: [],             // 已解锁的成就ID列表
    achievementNotified: [],      // 已弹窗通知过的成就ID（防重复弹窗）

  };

  // ============================================================
  // 全局状态
  // ============================================================
  let settings = {};
  let state = {};
  let settingsDragAbortController = null; // 新增：用于防止设置拖拽事件重复绑定的控制器
  let _isSaving = false;
  let wanderInterval = null;
  let decayInterval = null;
  let lastReactTime = 0;
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  let isMenuOpen = false;
  let menuOpenTime = 0;
  let isHouseOpen = false;
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
    await loadDataAsync();
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

    // 启动时检查一次成就
    setTimeout(() => checkAchievements(), 3000);

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
    // 同步先赋默认值，防止 init 期间数据为空
    settings = { ...DEFAULT_SETTINGS };
    state = { ...DEFAULT_STATE };
    emojiStickers = [];
    isOfflineMode = false;
  }

  async function loadDataAsync() {
    try {
      const parsed = await idbGet(STORAGE_KEY);
      if (parsed) {
        settings = { ...DEFAULT_SETTINGS, ...parsed.settings };
        settings.reactions = { ...DEFAULT_SETTINGS.reactions, ...(parsed.settings?.reactions || {}) };
        settings.moodImages = { ...DEFAULT_SETTINGS.moodImages, ...(parsed.settings?.moodImages || {}) };
        state = { ...DEFAULT_STATE, ...parsed.state };
        emojiStickers = settings.emojiStickers || [];
        isOfflineMode = state.isOfflineMode || false;

        // 用备份修正可能丢失的最后状态
        try {
          const backup = localStorage.getItem(STORAGE_KEY + '_backup');
          if (backup) {
            const b = JSON.parse(backup);
            if (b.lastOnlineTimestamp > (state.lastOnlineTimestamp || 0)) {
              state.lastOnlineTimestamp = b.lastOnlineTimestamp;
              state.hunger = b.hunger ?? state.hunger;
              state.cleanliness = b.cleanliness ?? state.cleanliness;
              state.energy = b.energy ?? state.energy;
            }
          }
        } catch(e) {}
      }
      // 顺便把旧的 localStorage 数据迁移过来（只做一次）
      const oldRaw = localStorage.getItem(STORAGE_KEY);
      if (oldRaw && !parsed) {
        try {
          const oldParsed = JSON.parse(oldRaw);
          settings = { ...DEFAULT_SETTINGS, ...oldParsed.settings };
          settings.reactions = { ...DEFAULT_SETTINGS.reactions, ...(oldParsed.settings?.reactions || {}) };
          settings.moodImages = { ...DEFAULT_SETTINGS.moodImages, ...(oldParsed.settings?.moodImages || {}) };
          state = { ...DEFAULT_STATE, ...oldParsed.state };
          emojiStickers = settings.emojiStickers || [];
          isOfflineMode = state.isOfflineMode || false;
          await idbSet(STORAGE_KEY, { settings, state });
          localStorage.removeItem(STORAGE_KEY);
          console.log(`[${PLUGIN_NAME}] 已从 localStorage 迁移数据到 IndexedDB`);
        } catch (e) {
          console.warn(`[${PLUGIN_NAME}] 旧数据迁移失败`, e);
        }
      }
    } catch (e) {
      console.warn(`[${PLUGIN_NAME}] IndexedDB 读取失败，使用默认值`, e);
      // 降级：尝试从 localStorage 读取
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const fallback = JSON.parse(raw);
          settings = { ...DEFAULT_SETTINGS, ...fallback.settings };
          settings.reactions = { ...DEFAULT_SETTINGS.reactions, ...(fallback.settings?.reactions || {}) };
          settings.moodImages = { ...DEFAULT_SETTINGS.moodImages, ...(fallback.settings?.moodImages || {}) };
          state = { ...DEFAULT_STATE, ...fallback.state };
          emojiStickers = settings.emojiStickers || [];
          isOfflineMode = state.isOfflineMode || false;
          console.log(`[${PLUGIN_NAME}] 已从 localStorage 降级读取`);
        }
      } catch(e2) {}
    }
  }

function saveData() {
  state.lastOnlineTimestamp = Date.now();
  if (state.petChatArchive && state.petChatArchive.length > 10) {
    state.petChatArchive = state.petChatArchive.slice(-10);
  }
  if (state.diaryEntries && state.diaryEntries.length > 60) {
    state.diaryEntries = state.diaryEntries.slice(-60);
  }
  if (state.gameShopBuyLog) {
    const today = new Date().toISOString().slice(0, 10);
    Object.keys(state.gameShopBuyLog).forEach(k => {
      if (k < today.slice(0, 8)) delete state.gameShopBuyLog[k];
    });
  }
  if (_isSaving) return;
  _isSaving = true;
  idbSet(STORAGE_KEY, { settings, state }).then(() => {
    _isSaving = false;
  }).catch(e => {
    _isSaving = false;
    // IndexedDB 失败时降级到 localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ settings, state }));
    } catch(e2) {}
    console.error(`[${PLUGIN_NAME}] IndexedDB 保存失败`, e);
    const now = Date.now();
    if (!saveData._lastWarning || now - saveData._lastWarning > 5 * 60 * 1000) {
      saveData._lastWarning = now;
      showBubble('⚠️ 数据保存失败！请检查浏览器存储权限', 6000);
    }
  });
}


  // 防抖版保存（高频调用场景用这个）
  function saveDataDebounced(reason = '') {
    clearTimeout(saveDebounceTimer);
    saveDebounceTimer = setTimeout(() => {
      saveData();
      if (reason) console.log(`[${PLUGIN_NAME}] 防抖保存触发: ${reason}`);
    }, 1500); // 1500ms 内的多次调用只执行最后一次
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
      saveDataDebounced('状态衰减');
    }, 8 * 60 * 1000);
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
        { action: 'game', emoji: '🎮', title: '合成游戏' },
        { action: 'house', emoji: '🏠', title: '桌宠小屋' },
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
        <div class="sp-stat"><span class="sp-stat-icon">🍖</span><div class="sp-stat-bar"><div class="sp-stat-fill hunger" id="sp-hunger-fill"></div></div><span class="sp-stat-pct" id="sp-hunger-pct">0%</span></div>
        <div class="sp-stat"><span class="sp-stat-icon">💧</span><div class="sp-stat-bar"><div class="sp-stat-fill clean" id="sp-clean-fill"></div></div><span class="sp-stat-pct" id="sp-clean-pct">0%</span></div>
        <div class="sp-stat"><span class="sp-stat-icon">⚡</span><div class="sp-stat-bar"><div class="sp-stat-fill energy" id="sp-energy-fill"></div></div><span class="sp-stat-pct" id="sp-energy-pct">0%</span></div>
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
    const hungerPct = document.getElementById('sp-hunger-pct');
    const cleanPct = document.getElementById('sp-clean-pct');
    const energyPct = document.getElementById('sp-energy-pct');
    if (hungerPct) hungerPct.textContent = `${Math.round(state.hunger)}%`;
    if (cleanPct) cleanPct.textContent = `${Math.round(state.cleanliness)}%`;
    if (energyPct) energyPct.textContent = `${Math.round(state.energy)}%`;
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
  function compressImage(dataUrl, maxWidth = 256, quality = 0.75) {
    return new Promise((resolve) => {
      // GIF 不压缩，保留动画帧
      if (dataUrl.startsWith('data:image/gif')) {
        // GIF 超过 500KB 时警告但仍保留
        if (dataUrl.length > 500 * 1024) {
          console.warn(`[${PLUGIN_NAME}] GIF 较大 (${(dataUrl.length/1024).toFixed(0)}KB)，建议使用更小的动图`);
        }
        resolve(dataUrl);
        return;
      }
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        // 分级压缩：根据原始尺寸智能选择目标宽度
        let targetWidth = maxWidth;
        if (w <= maxWidth) {
          targetWidth = w; // 原图已经够小，不放大
        }
        if (w > targetWidth) { h = h * (targetWidth / w); w = targetWidth; }
        canvas.width = Math.round(w);
        canvas.height = Math.round(h);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // 先尝试 webp，如果结果反而更大则用原图
        const compressed = canvas.toDataURL('image/webp', quality);
        if (compressed.length < dataUrl.length) {
          resolve(compressed);
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  // ============================================================
  // GitHub 图片托管
  // ============================================================
  async function uploadImageToGithub(base64Data, filename) {
    if (!settings.githubToken || !settings.githubRepo) {
      showBubble('请先在设置中配置 GitHub Token 和仓库', 3000);
      return null;
    }

    // 去掉 data:image/xxx;base64, 前缀
    const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const path = `${settings.githubPath || 'meep-images'}/${filename}`;
    const url = `https://api.github.com/repos/${settings.githubRepo}/contents/${path}`;

    try {
      // 先检查文件是否已存在（获取 sha）
      let sha = '';
      try {
        const checkRes = await fetch(url, {
          headers: { 'Authorization': `Bearer ${settings.githubToken}` }
        });
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          sha = checkData.sha;
        }
      } catch (e) { /* 文件不存在，正常 */ }

      const body = {
        message: `meep-pet: upload ${filename}`,
        content: base64Content,
        branch: settings.githubBranch || 'main',
      };
      if (sha) body.sha = sha; // 覆盖已有文件

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${settings.githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('[meep-pet] GitHub 上传失败:', res.status, errData);
        showBubble(`GitHub 上传失败: ${res.status}`, 3000);
        return null;
      }

      const data = await res.json();
      // 直接使用 GitHub raw 链接（公开仓库可直接访问，无需等待 CDN 缓存）
      const cdnUrl = `https://raw.githubusercontent.com/${settings.githubRepo}/${settings.githubBranch}/${path}`;
      return cdnUrl;
    } catch (err) {
      console.error('[meep-pet] GitHub 上传异常:', err);
      showBubble(`上传异常: ${err.message}`, 3000);
      return null;
    }
  }

  // 显示迁移进度条弹窗
  function showMigrateProgress(current, total, currentName, status) {
    let overlay = document.getElementById('sp-migrate-progress-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'sp-migrate-progress-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:flex-start;padding-top:20vh;z-index:2147483650;';
      overlay.innerHTML = `
        <div id="sp-migrate-progress-box" style="background:var(--sp-bg-secondary);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--sp-border);border-radius:14px;padding:24px;width:300px;max-width:90vw;box-shadow:0 8px 32px rgba(0,0,0,0.4);text-align:center;">
          <div style="font-size:24px;margin-bottom:12px;">☁️</div>
          <div id="sp-migrate-title" style="font-size:14px;font-weight:700;color:var(--sp-text-primary);margin-bottom:6px;">正在迁移图片…</div>
          <div id="sp-migrate-status" style="font-size:11px;color:var(--sp-text-muted);margin-bottom:12px;min-height:16px;"></div>
          <div style="width:100%;height:8px;background:rgba(255,255,255,0.1);border-radius:4px;overflow:hidden;margin-bottom:8px;">
            <div id="sp-migrate-bar" style="width:0%;height:100%;background:linear-gradient(90deg,rgba(100,180,255,0.7),rgba(100,220,100,0.7));border-radius:4px;transition:width 0.3s ease;"></div>
          </div>
          <div id="sp-migrate-count" style="font-size:12px;color:var(--sp-text-secondary);font-weight:600;">0 / 0</div>
          <div id="sp-migrate-current" style="font-size:10px;color:var(--sp-text-muted);margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;"></div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    const percent = total > 0 ? Math.round((current / total) * 100) : 0;
    const bar = document.getElementById('sp-migrate-bar');
    const count = document.getElementById('sp-migrate-count');
    const currentEl = document.getElementById('sp-migrate-current');
    const statusEl = document.getElementById('sp-migrate-status');
    const titleEl = document.getElementById('sp-migrate-title');

    if (bar) bar.style.width = percent + '%';
    if (count) count.textContent = `${current} / ${total}`;
    if (currentEl) currentEl.textContent = currentName ? `📁 ${currentName}` : '';
    if (statusEl) statusEl.textContent = status || '上传中，请勿关闭页面…';
    if (titleEl && current >= total && total > 0) titleEl.textContent = '迁移完成！';
  }

  // 关闭进度条弹窗
  function closeMigrateProgress() {
    const overlay = document.getElementById('sp-migrate-progress-overlay');
    if (overlay) overlay.remove();
  }

  // 更新进度条为完成状态（显示结果 + 关闭按钮）
  function showMigrateComplete(migrated, failed, storageKB) {
    const box = document.getElementById('sp-migrate-progress-box');
    if (!box) return;

    box.innerHTML = `
      <div style="font-size:32px;margin-bottom:12px;">${failed === 0 ? '✅' : '⚠️'}</div>
      <div style="font-size:15px;font-weight:700;color:var(--sp-text-primary);margin-bottom:10px;">迁移完成！</div>
      <div style="font-size:13px;color:var(--sp-text-secondary);line-height:1.8;margin-bottom:16px;">
        <div>成功上传：<span style="color:rgba(100,220,100,0.9);font-weight:600;">${migrated} 张</span></div>
        ${failed > 0 ? `<div>上传失败：<span style="color:#f66;font-weight:600;">${failed} 张</span></div>` : ''}
        <div>当前存储占用：<span style="font-weight:600;">${storageKB} KB</span></div>
      </div>
      <button id="sp-migrate-close-btn" style="padding:9px 28px;font-size:13px;font-weight:600;border-radius:8px;border:1px solid var(--sp-primary-border);background:var(--sp-primary);color:#fff;cursor:pointer;transition:background 0.2s;">确定</button>
    `;

    document.getElementById('sp-migrate-close-btn')?.addEventListener('click', () => {
      closeMigrateProgress();
    });
  }

  // 批量迁移：将所有 base64 图片上传到 GitHub 并替换为 URL
  async function migrateImagesToGithub() {
    if (!settings.githubToken || !settings.githubRepo) {
      showBubble('请先配置 GitHub Token 和仓库', 3000);
      return;
    }

    // ===== 第一步：收集所有需要迁移的图片 =====
    const tasks = []; // [{key, getVal, setVal, name}]

    // 精灵图
    const spriteKeys = [
      'spriteIdle', 'spriteWalkLeft', 'spriteWalkRight', 'spriteWalkUp', 'spriteWalkDown',
      'spriteSleep', 'spriteHappy', 'spriteSad', 'spriteDrag', 'spriteDizzy',
      'spriteEat', 'spriteBath', 'spriteWave', 'spriteThink',
      'spriteHangLeft', 'spriteHangRight', 'spriteHangTop',
      'foodImage', 'bathImage', 'bedImage',
      'houseBackground', 'houseCharacter', 'houseCharacterAvatar',
      'houseActionFeed', 'houseActionBath', 'houseActionSleep',
      'houseButtonFeed', 'houseButtonBath', 'houseButtonSleep', 'houseButtonWardrobe',
      'houseButtonRegen',
      'houseButtonSend',
      'houseButtonWardrobeSettings',

    ];
    for (const key of spriteKeys) {
      if (settings[key] && settings[key].startsWith('data:')) {
        tasks.push({
          name: key,
          getVal: () => settings[key],
          setVal: (url) => { settings[key] = url; },
        });
      }
    }

    // 心情图标
    if (settings.moodImages) {
      for (const [moodKey, val] of Object.entries(settings.moodImages)) {
        if (val && val.startsWith('data:')) {
          tasks.push({
            name: `mood_${moodKey}`,
            getVal: () => settings.moodImages[moodKey],
            setVal: (url) => { settings.moodImages[moodKey] = url; },
          });
        }
      }
    }

    // 菜单图标
    if (settings.menuIcons) {
      for (const [actionKey, val] of Object.entries(settings.menuIcons)) {
        if (val && val.startsWith('data:')) {
          tasks.push({
            name: `menu_${actionKey}`,
            getVal: () => settings.menuIcons[actionKey],
            setVal: (url) => { settings.menuIcons[actionKey] = url; },
          });
        }
      }
    }

    // 表情包
    if (settings.emojiStickers) {
      for (let i = 0; i < settings.emojiStickers.length; i++) {
        const sticker = settings.emojiStickers[i];
        if (sticker.image && sticker.image.startsWith('data:')) {
          const idx = i;
          tasks.push({
            name: `emoji_${sticker.name || i}`,
            getVal: () => settings.emojiStickers[idx].image,
            setVal: (url) => { settings.emojiStickers[idx].image = url; },
          });
        }
      }
    }

    // 自定义动作
    if (settings.customSprites) {
      for (let i = 0; i < settings.customSprites.length; i++) {
        const sprite = settings.customSprites[i];
        if (sprite.image && sprite.image.startsWith('data:')) {
          const idx = i;
          tasks.push({
            name: `custom_${sprite.name || i}`,
            getVal: () => settings.customSprites[idx].image,
            setVal: (url) => { settings.customSprites[idx].image = url; },
          });
        }
      }
    }

    // 小屋表情立绘
    if (settings.houseExpressions) {
      for (let i = 0; i < settings.houseExpressions.length; i++) {
        const expr = settings.houseExpressions[i];
        if (expr.image && expr.image.startsWith('data:')) {
          const idx = i;
          tasks.push({
            name: `house_expr_${expr.name || i}`,
            getVal: () => settings.houseExpressions[idx].image,
            setVal: (url) => { settings.houseExpressions[idx].image = url; },
          });
        }
      }
    }

    // 游戏自定义图片
    if (state.gameCustomImages) {
      for (const [imgKey, val] of Object.entries(state.gameCustomImages)) {
        if (val && val.startsWith('data:')) {
          const k = imgKey;
          tasks.push({
            name: `game_${k}`,
            getVal: () => state.gameCustomImages[k],
            setVal: (url) => { state.gameCustomImages[k] = url; },
          });
        }
      }
    }

    // 游戏背景图
    if (state.gameBgImage && state.gameBgImage.startsWith('data:')) {
      tasks.push({
        name: 'game_background',
        getVal: () => state.gameBgImage,
        setVal: (url) => { state.gameBgImage = url; },
      });
    }

    // ===== 第二步：检查是否有东西要迁移 =====
    if (tasks.length === 0) {
      showBubble('没有需要迁移的 base64 图片，全部已经是链接了 ✨', 3000);
      return;
    }

    // ===== 第三步：显示进度条，开始上传 =====
    const total = tasks.length;
    let migrated = 0;
    let failed = 0;

    showMigrateProgress(0, total, '', `共 ${total} 张图片待迁移`);

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const val = task.getVal();

      showMigrateProgress(i, total, task.name, `上传中… (${i + 1}/${total})`);

      const ext = val.includes('image/png') ? 'png' : val.includes('image/gif') ? 'gif' : 'webp';
      const filename = `${task.name}_${Date.now().toString(36)}.${ext}`;
      const url = await uploadImageToGithub(val, filename);

      if (url) {
        task.setVal(url);
        migrated++;
      } else {
        failed++;
      }

      // 更新进度条
      showMigrateProgress(i + 1, total, task.name, failed > 0 ? `${migrated} 成功 / ${failed} 失败` : `${migrated} 张已完成`);

      // 每张间隔 500ms 避免 GitHub API 限流
      if (i < tasks.length - 1) {
        await new Promise(r => setTimeout(r, 500));
      }
    }

    // ===== 第四步：保存并显示结果 =====
    saveDataImmediate('GitHub迁移完成');
    const storage = getStorageUsage();
    renderStatusOverview();

    showMigrateComplete(migrated, failed, storage.myKB);
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
        spriteStateLockTimer = null;
        // 通过 clearSpriteLock 统一恢复（会自动检测边缘吸附）
        clearSpriteLock();
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

  // 如果桌宠当前吸附在边缘，恢复为对应的挂起图而不是闲置图
  const container = document.getElementById('silly-pet-container');
  if (container) {
    if (container.classList.contains('sp-edge-left') && settings.spriteHangLeft) {
      spriteStateLock = 'hang';
      updateSpriteImage(settings.spriteHangLeft);
      return;
    }
    if (container.classList.contains('sp-edge-right') && settings.spriteHangRight) {
      spriteStateLock = 'hang';
      updateSpriteImage(settings.spriteHangRight);
      return;
    }
    if (container.classList.contains('sp-edge-top') && settings.spriteHangTop) {
      spriteStateLock = 'hang';
      updateSpriteImage(settings.spriteHangTop);
      return;
    }
  }

  updateSpriteImage();
}


  // ============================================================
  // 统一确认弹窗工具
  // ============================================================
  function showConfirmDialog({ title, desc, confirmText, cancelText, onConfirm, onCancel }) {
    // 移除旧弹窗
    document.getElementById('sp-confirm-dialog-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'sp-confirm-dialog-overlay';
    overlay.className = 'sp-confirm-overlay';
    overlay.innerHTML = `
      <div class="sp-confirm-box" id="sp-confirm-dialog-box">
        <div class="sp-confirm-title">${title || '确认'}</div>
        <div class="sp-confirm-desc">${desc || ''}</div>
        <div class="sp-confirm-actions">
          <button class="sp-confirm-btn sp-confirm-btn-cancel" id="sp-confirm-dialog-cancel">${cancelText || '取消'}</button>
          <button class="sp-confirm-btn sp-confirm-btn-primary" id="sp-confirm-dialog-ok">${confirmText || '确认'}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // 居中定位（和体力背包一致的方式）
    requestAnimationFrame(() => {
      const box = document.getElementById('sp-confirm-dialog-box');
      if (box) {
        const boxH = box.offsetHeight || 180;
        const boxW = box.offsetWidth || 280;
        box.style.position = 'fixed';
        box.style.top = Math.max(20, Math.floor((window.innerHeight - boxH) / 2)) + 'px';
        box.style.left = Math.floor((window.innerWidth - boxW) / 2) + 'px';
        box.style.margin = '0';
      }
    });

    const cleanup = () => { overlay.remove(); };

    document.getElementById('sp-confirm-dialog-ok').onclick = () => {
      cleanup();
      if (onConfirm) onConfirm();
    };

    document.getElementById('sp-confirm-dialog-cancel').onclick = () => {
      cleanup();
      if (onCancel) onCancel();
    };

    // 点遮罩关闭 = 取消
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        cleanup();
        if (onCancel) onCancel();
      }
    };
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
  const quickKey = 'quickFeed';
  const category = 'food';
  useInventoryItem(category, quickKey, (item, restoreAmount) => {
    if (settings.foodImage) showInteractionItem(settings.foodImage);
    state.hunger = Math.min(100, state.hunger + restoreAmount);
    state.lastFed = Date.now();
    state.totalInteractions++;
    const actionSprite = settings.spriteEat || settings.spriteHappy;
    if (actionSprite) {
      const dur = (settings.spriteDurations && settings.spriteDurations.spriteEat) || 2000;
      setSpriteWithLock('eat', actionSprite, dur);
    }
    showBubble(settings.reactions.feed, 3000);
    updateMood(); updateStatusBars(); saveData();checkAchievements();
  });
}

function bathPet() {
  const quickKey = 'quickClean';
  const category = 'clean';
  useInventoryItem(category, quickKey, (item, restoreAmount) => {
    if (settings.bathImage) showInteractionItem(settings.bathImage);
    state.cleanliness = Math.min(100, state.cleanliness + restoreAmount);
    state.lastBathed = Date.now();
    state.totalInteractions++;
    if (settings.spriteBath) {
      const dur = (settings.spriteDurations && settings.spriteDurations.spriteBath) || 2500;
      setSpriteWithLock('bath', settings.spriteBath, dur);
    }
    showBubble(settings.reactions.bath, 3000);
    updateMood(); updateStatusBars(); saveData();checkAchievements();
  });
}

function sleepPet() {
  const quickKey = 'quickEnergy';
  const category = 'energy';
  useInventoryItem(category, quickKey, (item, restoreAmount) => {
    if (settings.bedImage) showInteractionItem(settings.bedImage);
    state.energy = Math.min(100, state.energy + restoreAmount);
    state.lastSlept = Date.now();
    state.totalInteractions++;
    if (settings.spriteSleep) {
      const dur = (settings.spriteDurations && settings.spriteDurations.spriteSleep) || 8000;
      setSpriteWithLock('sleep', settings.spriteSleep, dur);
    }
    showBubble(settings.reactions.sleep, 4000);
    updateMood(); updateStatusBars(); saveData();checkAchievements();
  });
}

  // ============================================================
  // 背包使用逻辑
  // ============================================================
  function useInventoryItem(category, quickKey, onUse) {
    if (!state.gameInventory) state.gameInventory = [];

    // 检查快捷物品
    const quick = state[quickKey];
    if (quick) {
      const inv = state.gameInventory.find(i => i.category === quick.category && i.idx === quick.idx && i.count > 0);
      if (inv) {
        inv.count--;
        if (inv.count <= 0) {
          state.gameInventory = state.gameInventory.filter(i => i.count > 0);
          // 快捷物品用完了，提示
          const itemData = GAME_SHOP_ITEMS[quick.category][quick.idx];
          showBubble(`${itemData.emoji} ${itemData.name} 用完啦！`, 3000);
          state[quickKey] = null;
        }
        const itemData = GAME_SHOP_ITEMS[quick.category][quick.idx];
        onUse(itemData, itemData.restore);
        saveDataDebounced('使用快捷物品');
        return;
      } else {
        // 快捷物品库存没了
        state[quickKey] = null;
      }
    }

    // 没有快捷物品，检查所有来源是否有可用物品
    const available = state.gameInventory.filter(i => i.category === category && i.count > 0);

    // 额外检查冰箱库存和糖葫芦库存（仅投喂类别）
    let hasExtraFood = false;
    if (category === 'food') {
      const fridgeItems = (state.fridgeInventory || []).filter(i => i.count > 0);
      const tangItems = (state.tanghuluInventory || []).filter(i => i.count > 0);
      const hasCrystal = (state.tanghuluSugarCrystal || 0) > 0;
      if (fridgeItems.length > 0 || tangItems.length > 0 || hasCrystal) {
        hasExtraFood = true;
      }
    }

    if (available.length === 0 && !hasExtraFood) {
      showBubble('背包里没有可用的物品！去游戏商店买一些吧～', 4000);
      return;
    }

    // 弹出背包选择弹窗
    showInventoryPopup(category, quickKey, onUse);
  }


function showInventoryPopup(category, quickKey, onUse) {
    // 移除旧弹窗
    document.getElementById('sp-inventory-popup')?.remove();

    const available = (state.gameInventory || []).filter(i => i.category === category && i.count > 0);
    const categoryNames = { food: '🍖 食物', clean: '🧴 洗护用品', energy: '🛏️ 睡眠用品' };

    const overlay = document.createElement('div');
    overlay.id = 'sp-inventory-popup';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:2147483649;';

    let itemsHtml = available.map(inv => {
      const itemData = GAME_SHOP_ITEMS[inv.category][inv.idx];
      const isQuick = state[quickKey] && state[quickKey].category === inv.category && state[quickKey].idx === inv.idx;
      return `
        <div class="sp-inv-item" data-cat="${inv.category}" data-idx="${inv.idx}">
          <span class="sp-inv-item-emoji">${itemData.emoji}</span>
          <div class="sp-inv-item-info">
            <span class="sp-inv-item-name">${itemData.name}</span>
            <span class="sp-inv-item-detail">+${itemData.restore} | 库存: ${inv.count}</span>
          </div>
          <div class="sp-inv-item-actions">
            <button class="sp-inv-use-btn" data-cat="${inv.category}" data-idx="${inv.idx}">使用</button>
            <button class="sp-inv-quick-btn ${isQuick ? 'active' : ''}" data-cat="${inv.category}" data-idx="${inv.idx}" title="设为快捷">${isQuick ? '⭐' : '☆'}</button>
          </div>
        </div>
      `;
    }).join('');

    // 追加冰箱库存物品到列表（仅投喂类别）
    if (category === 'food') {
      const fridgeItems = (state.fridgeInventory || []).filter(i => i.count > 0);
      fridgeItems.forEach(inv => {
        const data = FRIDGE_FOODS.find(f => f.id === inv.foodId);
        if (!data) return;
        itemsHtml += `
          <div class="sp-inv-item" data-fridge-food="${inv.foodId}">
            <span class="sp-inv-item-emoji">${data.emoji}</span>
            <div class="sp-inv-item-info">
              <span class="sp-inv-item-name">🧊 ${data.name}</span>
              <span class="sp-inv-item-detail">+${data.feed} | 冰箱库存: ${inv.count}</span>
            </div>
            <div class="sp-inv-item-actions">
              <button class="sp-inv-use-btn sp-inv-fridge-use" data-fridge-food="${inv.foodId}">使用</button>
            </div>
          </div>
        `;
      });
    }

    // 追加糖葫芦库存到投喂列表
    if (category === 'food') {
      const tangItems = (state.tanghuluInventory || []).filter(i => i.count > 0);
      tangItems.forEach(inv => {
        const data = TANGHULU_FRUITS.find(f => f.key === inv.fruitKey);
        if (!data) return;
        itemsHtml += `
          <div class="sp-inv-item" data-tanghulu-fruit="${inv.fruitKey}">
            <span class="sp-inv-item-emoji">${data.emoji}</span>
            <div class="sp-inv-item-info">
              <span class="sp-inv-item-name">🍢 ${data.name}糖葫芦</span>
              <span class="sp-inv-item-detail">+${data.feedAmount} | 库存: ${inv.count}</span>
            </div>
            <div class="sp-inv-item-actions">
              <button class="sp-inv-use-btn sp-inv-tanghulu-use" data-tanghulu-fruit="${inv.fruitKey}">使用</button>
            </div>
          </div>
        `;
      });
      // 完美的亮晶晶糖砂
      if ((state.tanghuluSugarCrystal || 0) > 0) {
        itemsHtml += `
          <div class="sp-inv-item" data-sugar-crystal="1">
            <span class="sp-inv-item-emoji">✨</span>
            <div class="sp-inv-item-info">
              <span class="sp-inv-item-name">完美的亮晶晶糖砂</span>
              <span class="sp-inv-item-detail">+50饱食 +20心情 | 库存: ${state.tanghuluSugarCrystal}</span>
            </div>
            <div class="sp-inv-item-actions">
              <button class="sp-inv-use-btn sp-inv-sugar-crystal-use">使用</button>
            </div>
          </div>
        `;
      }

      // 追加餐厅出餐台菜品到投喂列表
      const cookedDishes = (state.restaurantCookedDishes || []).filter(d => d.count > 0);
      cookedDishes.forEach(d => {
        const recipe = RESTAURANT_RECIPES.find(r => r.id === d.recipeId);
        if (!recipe) return;
        itemsHtml += `
          <div class="sp-inv-item" data-cooked-recipe="${d.recipeId}">
            <span class="sp-inv-item-emoji">${recipe.emoji}</span>
            <div class="sp-inv-item-info">
              <span class="sp-inv-item-name">🐱 ${recipe.name}</span>
              <span class="sp-inv-item-detail">+${recipe.feedAmount}饱食${recipe.energyAmount > 0 ? ' +' + recipe.energyAmount + '精力' : ''} | 出餐台: ${d.count}</span>
            </div>
            <div class="sp-inv-item-actions">
              <button class="sp-inv-use-btn sp-inv-cooked-use" data-cooked-recipe="${d.recipeId}">使用</button>
            </div>
          </div>
        `;
      });
    }



    overlay.innerHTML = `
      <div class="sp-inv-popup-box">
        <div class="sp-inv-popup-header">
          <span>${categoryNames[category] || '背包'}</span>
          <button class="sp-inv-popup-close" title="关闭">✕</button>
        </div>
        <div class="sp-inv-popup-body">
          ${itemsHtml || '<div class="sp-inv-empty">背包空空如也～</div>'}
        </div>
        <div class="sp-inv-popup-hint">💡 点击 ☆ 设为快捷，下次直接使用不弹窗</div>
      </div>
    `;

    document.body.appendChild(overlay);

    // 手动居中定位（兼容移动端，防止弹窗靠顶）
    requestAnimationFrame(() => {
      const box = overlay.querySelector('.sp-inv-popup-box');
      if (box) {
        const boxH = box.offsetHeight || 300;
        const boxW = box.offsetWidth || 300;
        box.style.position = 'fixed';
        box.style.top = Math.max(20, Math.floor((window.innerHeight - boxH) / 2)) + 'px';
        box.style.left = Math.floor((window.innerWidth - boxW) / 2) + 'px';
        box.style.margin = '0';
      }
    });

    // 关闭
    overlay.querySelector('.sp-inv-popup-close').onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

    // 使用按钮
    overlay.querySelectorAll('.sp-inv-use-btn').forEach(btn => {
      btn.onclick = () => {
        const cat = btn.dataset.cat;
        const idx = parseInt(btn.dataset.idx);
        const inv = state.gameInventory.find(i => i.category === cat && i.idx === idx && i.count > 0);
        if (!inv) { showBubble('物品没了', 2000); overlay.remove(); return; }
        inv.count--;
        if (inv.count <= 0) {
          state.gameInventory = state.gameInventory.filter(i => i.count > 0);
          if (state[quickKey] && state[quickKey].category === cat && state[quickKey].idx === idx) {
            state[quickKey] = null;
          }
        }
        const itemData = GAME_SHOP_ITEMS[cat][idx];
        overlay.remove();
        onUse(itemData, itemData.restore);
        saveDataDebounced('背包使用物品');
      };
    });

    // 冰箱物品使用按钮
    overlay.querySelectorAll('.sp-inv-fridge-use').forEach(btn => {
      btn.onclick = () => {
        const foodId = btn.dataset.fridgeFood;
        const inv = (state.fridgeInventory || []).find(i => i.foodId === foodId && i.count > 0);
        if (!inv) { showBubble('冰箱里没有了', 2000); overlay.remove(); return; }
        const data = FRIDGE_FOODS.find(f => f.id === foodId);
        if (!data) return;
        inv.count--;
        if (inv.count <= 0) {
          state.fridgeInventory = state.fridgeInventory.filter(i => i.count > 0);
        }
        overlay.remove();
        onUse(data, data.feed);
        saveDataDebounced('使用冰箱食物');
      };
    });

    // 糖葫芦使用按钮
    overlay.querySelectorAll('.sp-inv-tanghulu-use').forEach(btn => {
      btn.onclick = () => {
        const fruitKey = btn.dataset.tanghuluFruit;
        const inv = (state.tanghuluInventory || []).find(i => i.fruitKey === fruitKey && i.count > 0);
        if (!inv) { showBubble('库存里没有了', 2000); overlay.remove(); return; }
        const data = TANGHULU_FRUITS.find(f => f.key === fruitKey);
        if (!data) return;
        inv.count--;
        if (inv.count <= 0) {
          state.tanghuluInventory = state.tanghuluInventory.filter(i => i.count > 0);
        }
        overlay.remove();
        onUse(data, data.feedAmount);
        saveDataDebounced('使用糖葫芦');
      };
    });

    // 完美的亮晶晶糖砂使用按钮
    overlay.querySelectorAll('.sp-inv-sugar-crystal-use').forEach(btn => {
      btn.onclick = () => {
        if ((state.tanghuluSugarCrystal || 0) <= 0) { showBubble('没有糖砂了', 2000); overlay.remove(); return; }
        state.tanghuluSugarCrystal--;
        overlay.remove();
        // 特殊效果：饱食+50，心情直接变happy
        state.hunger = Math.min(100, state.hunger + 50);
        state.mood = 'happy';
        state.totalInteractions++;
        const actionSprite = settings.spriteEat || settings.spriteHappy;
        if (actionSprite) {
          const dur = (settings.spriteDurations && settings.spriteDurations.spriteEat) || 2000;
          setSpriteWithLock('eat', actionSprite, dur);
        }
        showBubble('✨ 哇！亮晶晶的糖砂！好甜好开心！！', 4000);
        updateMood(); updateStatusBars(); saveData();
      };
    });

    // 餐厅出餐台菜品使用按钮
    overlay.querySelectorAll('.sp-inv-cooked-use').forEach(btn => {
      btn.onclick = () => {
        const recipeId = btn.dataset.cookedRecipe;
        const dishInv = (state.restaurantCookedDishes || []).find(d => d.recipeId === recipeId && d.count > 0);
        if (!dishInv) { showBubble('出餐台没有了', 2000); overlay.remove(); return; }
        const recipe = RESTAURANT_RECIPES.find(r => r.id === recipeId);
        if (!recipe) return;
        dishInv.count--;
        state.restaurantCookedDishes = (state.restaurantCookedDishes || []).filter(d => d.count > 0);
        overlay.remove();
        onUse(recipe, recipe.feedAmount);
        // 额外恢复精力（如果菜品有energyAmount）
        if (recipe.energyAmount > 0) {
          state.energy = Math.min(100, state.energy + recipe.energyAmount);
        }
        saveDataDebounced('使用餐厅菜品投喂');
      };
    });

    // 快捷设置按钮
    overlay.querySelectorAll('.sp-inv-quick-btn').forEach(btn => {
      btn.onclick = () => {
        const cat = btn.dataset.cat;
        const idx = parseInt(btn.dataset.idx);
        const isCurrentQuick = state[quickKey] && state[quickKey].category === cat && state[quickKey].idx === idx;
        if (isCurrentQuick) {
          state[quickKey] = null;
          btn.textContent = '☆';
          btn.classList.remove('active');
          showBubble('已取消快捷', 1500);
        } else {
          state[quickKey] = { category: cat, idx: idx };
          overlay.querySelectorAll('.sp-inv-quick-btn').forEach(b => { b.textContent = '☆'; b.classList.remove('active'); });
          btn.textContent = '⭐';
          btn.classList.add('active');
          const itemData = GAME_SHOP_ITEMS[cat][idx];
          showBubble(`已设 ${itemData.emoji} ${itemData.name} 为快捷！`, 2000);
        }
        saveDataDebounced('设置快捷物品');
      };
    });
  }

  // ============================================================
  // 菜单按钮位置动态计算（根据桌宠所处屏幕边缘决定展开方向）
  // ============================================================
  function updateMenuPositions() {
    const container = document.getElementById('silly-pet-container');
    const menu = document.getElementById('silly-pet-menu');
    if (!container || !menu) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const isMobile = window.innerWidth <= 768;
    const isSmall = window.innerWidth <= 480;
    let radius = isSmall ? 88 : (isMobile ? 110 : 120);

    // 判断桌宠靠哪边
    const threshold = 80; // 判定阈值像素
    const isLeft = centerX < threshold;
    const isRight = centerX > window.innerWidth - threshold;
    const isTop = centerY < threshold;

    // 根据位置决定半圆展开的起始角度和结束角度（单位：度）
    // 默认：向上展开（上半圆），startAngle=180, endAngle=360
    let startAngle, endAngle;

    if (isLeft) {
      // 挂在左边 → 向右展开半圆
      startAngle = -90;
      endAngle = 90;
    } else if (isRight) {
      // 挂在右边 → 向左展开半圆
      startAngle = 90;
      endAngle = 270;
    } else if (isTop) {
      // 挂在上边 → 向下展开半圆
      startAngle = 0;
      endAngle = 180;
    } else {
      // 默认情况（屏幕中间或底部）→ 向上展开半圆
      startAngle = 180;
      endAngle = 360;
    }

    const buttons = menu.querySelectorAll('.sp-menu-btn');
    const count = buttons.length;
    const angleStep = (endAngle - startAngle) / (count + 1);

    buttons.forEach((btn, i) => {
      const angle = startAngle + angleStep * (i + 1);
      const rad = angle * (Math.PI / 180);
      const x = Math.round(Math.cos(rad) * radius);
      const y = Math.round(Math.sin(rad) * radius);

      // 如果按钮还没有设置过位置（第一次打开），先归零再展开
      if (!btn.style.left || btn.style.left === 'auto') {
        btn.style.transition = 'none';
        btn.style.left = '0px';
        btn.style.top = '0px';
        btn.offsetHeight; // 强制重绘
        btn.style.transition = '';
      }

      btn.style.left = x + 'px';
      btn.style.top = y + 'px';
    });

  }

  function toggleMenu() {
    const menu = document.getElementById('silly-pet-menu');
    if (!menu) return;
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
      menuOpenTime = Date.now();
      updateMenuPositions();
    } else {
      // 收起时重置所有按钮坐标到原点，避免残留位置挡住其他点击
      menu.querySelectorAll('.sp-menu-btn').forEach(btn => {
        btn.style.left = '0px';
        btn.style.top = '0px';
      });
    }
    menu.classList.toggle('visible', isMenuOpen);

    // 状态条跟随菜单显示/隐藏
    const statusBar = document.getElementById('silly-pet-status-bar');
    if (statusBar) {
      clearTimeout(statusBar._hideTimer);
      if (isMenuOpen) {
        statusBar.classList.add('visible');
        statusBar._hideTimer = setTimeout(() => statusBar.classList.remove('visible'), 5000);
      } else {
        statusBar.classList.remove('visible');
      }
    }
  }

   function handleMenuAction(action) {
    switch (action) {
      case 'feed': feedPet(); break;
      case 'bath': bathPet(); break;
      case 'sleep': sleepPet(); break;
      case 'chat': toggleChat(); break;
      case 'diary': toggleDiary(); break;
      case 'game': showGameSelector(); break;
      case 'settings': toggleSettings(); break;
    }
    toggleMenu();
  }

   function handleMenuAction(action) {
    switch (action) {
      case 'feed': feedPet(); break;
      case 'bath': bathPet(); break;
      case 'sleep': sleepPet(); break;
      case 'chat': toggleChat(); break;
      case 'diary': toggleDiary(); break;
      case 'game': showGameSelector(); break;
      case 'house': toggleHouse(); break;
      case 'settings': toggleSettings(); break;
    }
    toggleMenu();
  }

  // ============================================================
  // 游戏选择弹窗
  // ============================================================
  function showGameSelector() {
    // 移除旧弹窗
    document.getElementById('sp-game-selector-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'sp-game-selector-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:2147483649;';
    overlay.innerHTML = `
      <div class="sp-game-selector-box">
        <div class="sp-game-selector-header">
          <span>🎮 选择游戏</span>
          <div style="display:flex;gap:4px;align-items:center;">
            <button class="sp-game-selector-help" id="sp-game-selector-help" title="游戏帮助">?</button>
            <button class="sp-game-selector-close" title="关闭">✕</button>
          </div>
        </div>
        <div class="sp-game-selector-body">
          <div class="sp-game-selector-card" data-game="restaurant">
            <div class="sp-game-selector-icon">🐱</div>
            <div class="sp-game-selector-info">
              <div class="sp-game-selector-name">小猫餐厅</div>
              <div class="sp-game-selector-desc">用食材烹饪菜品，招待客人赚取金币</div>
            </div>
          </div>
          <div class="sp-game-selector-card" data-game="merge">
            <div class="sp-game-selector-icon">🧶</div>
            <div class="sp-game-selector-info">
              <div class="sp-game-selector-name">合成工坊</div>
              <div class="sp-game-selector-desc">合成物品、完成订单、赚取金币</div>
            </div>
          </div>
          <div class="sp-game-selector-card" data-game="match3">
            <div class="sp-game-selector-icon">🃏</div>
            <div class="sp-game-selector-info">
              <div class="sp-game-selector-name">消消看</div>
              <div class="sp-game-selector-desc">点击图案收集到暂存栏，三消通关</div>
            </div>
          </div>
          <div class="sp-game-selector-card" data-game="lottery">
            <div class="sp-game-selector-icon">🎰</div>
            <div class="sp-game-selector-info">
              <div class="sp-game-selector-name">幸运抽奖</div>
              <div class="sp-game-selector-desc">消耗金币抽取道具、物品和金币奖励</div>
            </div>
          </div>
          <div class="sp-game-selector-card" data-game="link">
            <div class="sp-game-selector-icon">🔗</div>
            <div class="sp-game-selector-info">
              <div class="sp-game-selector-name">连连看</div>
              <div class="sp-game-selector-desc">找到相同图案，两折连线消除</div>
            </div>
          </div>
          <div class="sp-game-selector-card" data-game="fridge">
            <div class="sp-game-selector-icon">🧊</div>
            <div class="sp-game-selector-info">
              <div class="sp-game-selector-name">冰箱整理</div>
              <div class="sp-game-selector-desc">把食材塞进冰箱，旋转摆放挑战空间极限</div>
            </div>
          </div>
          <div class="sp-game-selector-card" data-game="tanghulu">
            <div class="sp-game-selector-icon">🍢</div>
            <div class="sp-game-selector-info">
              <div class="sp-game-selector-name">糖葫芦工坊</div>
              <div class="sp-game-selector-desc">水果排序归类，做出漂亮糖葫芦</div>
            </div>
          </div>
          <div class="sp-game-selector-card" data-game="shelf">
            <div class="sp-game-selector-icon">🛒</div>
            <div class="sp-game-selector-info">
              <div class="sp-game-selector-name">整理货架</div>
              <div class="sp-game-selector-desc">三消消除，清空货架上所有商品</div>
            </div>
          </div>
          <div class="sp-game-selector-card" data-game="inventory">
            <div class="sp-game-selector-icon">🎒</div>
            <div class="sp-game-selector-info">
              <div class="sp-game-selector-name">总背包</div>
              <div class="sp-game-selector-desc">查看所有道具、体力和物资</div>
            </div>
          </div>
          <div class="sp-game-selector-card" data-game="achievements">
            <div class="sp-game-selector-icon">🏆</div>
            <div class="sp-game-selector-info">
              <div class="sp-game-selector-name">成就</div>
              <div class="sp-game-selector-desc">查看已解锁的成就和进度</div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // 居中定位
    requestAnimationFrame(() => {
      const box = overlay.querySelector('.sp-game-selector-box');
      if (box) {
        const boxH = box.offsetHeight || 200;
        const boxW = box.offsetWidth || 280;
        box.style.position = 'fixed';
        box.style.top = Math.max(20, Math.floor((window.innerHeight - boxH) / 2)) + 'px';
        box.style.left = Math.floor((window.innerWidth - boxW) / 2) + 'px';
        box.style.margin = '0';
      }
    });

    // 关闭
    overlay.querySelector('.sp-game-selector-close').onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

    // 帮助按钮
    overlay.querySelector('.sp-game-selector-help').onclick = (e) => {
      e.stopPropagation();
      showGameHelpModal();
    };

    // 选择游戏
    overlay.querySelectorAll('.sp-game-selector-card').forEach(card => {
      card.onclick = () => {
        const game = card.dataset.game;
        overlay.remove();
        if (game === 'restaurant') {
          toggleRestaurant();
        } else if (game === 'merge') {
          toggleMergeGame();
        } else if (game === 'match3') {
          toggleMatch3Game();
        } else if (game === 'lottery') {
          toggleLottery();
        } else if (game === 'link') {
          toggleLinkGame();
        } else if (game === 'fridge') {
          toggleFridgeGame();
        } else if (game === 'tanghulu') {
          toggleTanghuluGame();
        } else if (game === 'shelf') {
          toggleShelfGame();
        } else if (game === 'inventory') {
          showTotalInventory();
        } else if (game === 'achievements') {
          showAchievementsPanel();
        }
      };
    });

  }

  // ============================================================
  // ❓ 游戏帮助悬浮窗
  // ============================================================
  function showGameHelpModal() {
    document.getElementById('sp-game-help-overlay')?.remove();

    const helpOverlay = document.createElement('div');
    helpOverlay.id = 'sp-game-help-overlay';
    helpOverlay.innerHTML = `
      <div id="sp-game-help-box">
        <div id="sp-game-help-header">
          <span>❓ 游戏帮助</span>
          <button id="sp-game-help-close" title="关闭">✕</button>
        </div>
        <div id="sp-game-help-body">
          <details class="sp-guide-details" open>
            <summary class="sp-guide-summary">🐱 小猫餐厅</summary>
            <div class="sp-guide-details-content">
              <p style="font-size:12px;color:var(--sp-text-secondary);line-height:1.7;">
                经营一家猫咪餐厅，烹饪菜品招待客人赚金币。<br/><br/>
                • 客人会随机到来，坐在餐桌上等候点餐<br/>
                • 在烹饪台选择食谱，消耗食材和调料烹饪<br/>
                • 菜品出锅后点击对应客人的上菜按钮完成服务<br/>
                • 服务客人获得金币和声望，声望升级解锁新菜谱和新客人<br/>
                • 客人耐心耗尽会离开并扣声望<br/>
                • 出餐台的菜品也可以直接投喂桌宠<br/><br/>
                <strong style="color:var(--sp-text-primary);">食材来源：</strong>冰箱整理、货架消除、补货商店<br/>
                <strong style="color:var(--sp-text-primary);">调料来源：</strong>合成工坊调料链、补货商店
              </p>
            </div>
          </details>

          <details class="sp-guide-details">
            <summary class="sp-guide-summary">🧶 合成工坊</summary>
            <div class="sp-guide-details-content">
              <p style="font-size:12px;color:var(--sp-text-secondary);line-height:1.7;">
                点击猫爪生成器消耗1体力生成物品，将两个相同种类+等级的物品合成升级。完成订单交付物品赚金币，多余物品可售卖。<br/><br/>
                共8条合成链（玩具/零食/宝石/药剂/音律/花卉/星辰/调料），每链8级。<br/><br/>
                商店可购买投喂/洗护/睡眠道具存入背包，桌宠互动时消耗。<br/>
                调料链物品会同步到餐厅调料库存。
              </p>
            </div>
          </details>

          <details class="sp-guide-details">
            <summary class="sp-guide-summary">🃏 消消看</summary>
            <div class="sp-guide-details-content">
              <p style="font-size:12px;color:var(--sp-text-secondary);line-height:1.7;">
                多层堆叠的图案牌，点击未被遮挡的牌收集到暂存栏，凑齐3个相同即消除。清空所有牌通关，暂存栏满则失败。<br/><br/>
                道具：🪜扩充暂存格 / 🧹随机消3个 / 🌀打乱位置（每局限用3个）<br/>
                开局5体力，通关奖30~60🪙
              </p>
            </div>
          </details>

          <details class="sp-guide-details">
            <summary class="sp-guide-summary">🔗 连连看</summary>
            <div class="sp-guide-details-content">
              <p style="font-size:12px;color:var(--sp-text-secondary);line-height:1.7;">
                选两个相同图案方块，若能用不超过2次转折的折线连通则消除。清空通关。<br/><br/>
                道具：🔍提示 / 🌀洗牌 / 💣强制消除 / 🧭透视同伴<br/>
                棋盘8×8~18×18随机，体力5~16，通关奖40~500🪙
              </p>
            </div>
          </details>

          <details class="sp-guide-details">
            <summary class="sp-guide-summary">🧊 冰箱整理</summary>
            <div class="sp-guide-details-content">
              <p style="font-size:12px;color:var(--sp-text-secondary);line-height:1.7;">
                把购物筐里的食材塞进随机大小的冰箱网格。食材有不同尺寸（含异形），可旋转。填充率越高奖励越多。<br/><br/>
                道具：🧃压缩缩小 / 🎒跳过不扣率 / 🧹自动码放<br/>
                塞进去的食材存入冰箱库存，可投喂桌宠或餐厅烹饪用。<br/>
                冰箱大小和体力消耗开局前未知。
              </p>
            </div>
          </details>

          <details class="sp-guide-details">
            <summary class="sp-guide-summary">🍢 糖葫芦工坊</summary>
            <div class="sp-guide-details-content">
              <p style="font-size:12px;color:var(--sp-text-secondary);line-height:1.7;">
                竹签上穿着乱序水果，目标让每根签上都是同色水果。点选源签再点目标签移动顶端水果（同色可批量移）。<br/><br/>
                道具：🥢加空签 / ↩️撤销 / 🌀强行移动<br/>
                通关后糖葫芦存入库存，可卖金币或投喂桌宠。有概率掉✨糖砂。
              </p>
            </div>
          </details>

          <details class="sp-guide-details">
            <summary class="sp-guide-summary">🛒 整理货架</summary>
            <div class="sp-guide-details-content">
              <p style="font-size:12px;color:var(--sp-text-secondary);line-height:1.7;">
                货架隔间里有各种商品，每隔间3格。把相同商品凑到同一隔间的3格即三消消除，后排自动补位。清空通关。<br/><br/>
                道具：🪵解锁底部背包 / 🧹自动消一组 / 🔄洗牌<br/>
                消除的商品会联动到冰箱/餐厅/工坊背包。开局5~20体力。
              </p>
            </div>
          </details>

          <details class="sp-guide-details">
            <summary class="sp-guide-summary">🎰 幸运抽奖</summary>
            <div class="sp-guide-details-content">
              <p style="font-size:12px;color:var(--sp-text-secondary);line-height:1.7;">
                花金币抽奖获得各类道具和物品。<br/><br/>
                🎲 10🪙/次（日限10）| ✨ 30🪙/次（日限5）| 💫 50🪙/次（日限3）<br/><br/>
                奖励包括：金币、各游戏道具、工坊背包物品、棋盘物品、食材、糖葫芦等。高价池出好东西概率更大。
              </p>
            </div>
          </details>

          <details class="sp-guide-details">
            <summary class="sp-guide-summary">💡 通用机制</summary>
            <div class="sp-guide-details-content">
              <p style="font-size:12px;color:var(--sp-text-secondary);line-height:1.7;">
                <strong style="color:var(--sp-text-primary);">金币🪙</strong> — 所有游戏共享，合成工坊最稳定产出<br/>
                <strong style="color:var(--sp-text-primary);">体力⚡</strong> — 所有游戏共享，每5分钟恢复1点，点⊕用道具<br/>
                <strong style="color:var(--sp-text-primary);">图鉴📖</strong> — 各游戏均支持自定义图片（📷按钮，推荐链接）<br/>
                <strong style="color:var(--sp-text-primary);">背包🎒</strong> — 总背包汇总所有道具，投喂/洗澡/睡觉可设快捷<br/>
                <strong style="color:var(--sp-text-primary);">联动🔗</strong> — 各游戏产出互通：调料→餐厅、食材→冰箱→投喂、糖葫芦→投喂/卖、货架消除→各种库存<br/>
                <strong style="color:var(--sp-text-primary);">重置⚠️</strong> — 合成工坊设置⚙️中可重置所有游戏数据（24h冷却）
              </p>
            </div>
          </details>
        </div>
      </div>
    `;
    document.body.appendChild(helpOverlay);

    // 居中定位
    requestAnimationFrame(() => {
      const box = document.getElementById('sp-game-help-box');
      if (box) {
        const boxH = box.offsetHeight || 400;
        const boxW = box.offsetWidth || 340;
        box.style.position = 'fixed';
        box.style.top = Math.max(20, Math.floor((window.innerHeight - boxH) / 2)) + 'px';
        box.style.left = Math.floor((window.innerWidth - boxW) / 2) + 'px';
        box.style.margin = '0';
      }
    });

    // 关闭按钮
    document.getElementById('sp-game-help-close').onclick = () => helpOverlay.remove();
    // 点击遮罩关闭
    helpOverlay.onclick = (e) => { if (e.target === helpOverlay) helpOverlay.remove(); };
  }

  // ============================================================
  // 🎒 总背包弹窗
  // ============================================================
  function showTotalInventory() {
    document.getElementById('sp-total-inventory-overlay')?.remove();

    // 汇总数据
    const inventory = state.gameInventory || [];
    const match3Inv = state.match3Inventory || { expand: 0, sweep: 0, shuffle: 0 };
    const linkInv = state.linkInventory || { hint: 0, shuffle: 0, bomb: 0, compass: 0 };
    const staminaInv = state.gameStaminaInventory || { stamina30: 0, stamina50: 0, stamina100: 0 };

    // 喂食道具
    const foodItems = inventory.filter(i => i.category === 'food' && i.count > 0);
    // 洗澡道具
    const cleanItems = inventory.filter(i => i.category === 'clean' && i.count > 0);
    // 睡觉道具
    const energyItems = inventory.filter(i => i.category === 'energy' && i.count > 0);

    function renderShopItems(items, category) {
      if (items.length === 0) return '<div class="sp-total-inv-empty">暂无</div>';
      return items.map(inv => {
        const data = GAME_SHOP_ITEMS[category][inv.idx];
        if (!data) return '';
        return `<div class="sp-total-inv-row"><span class="sp-total-inv-emoji">${data.emoji}</span><span class="sp-total-inv-name">${data.name}</span><span class="sp-total-inv-detail">+${data.restore}</span><span class="sp-total-inv-count">×${inv.count}</span></div>`;
      }).join('');
    }

    // 体力道具
    function renderStaminaItems() {
      const hasAny = GAME_STAMINA_ITEMS.some(item => (staminaInv[item.key] || 0) > 0);
      if (!hasAny) return '<div class="sp-total-inv-empty">暂无</div>';
      return GAME_STAMINA_ITEMS.filter(item => (staminaInv[item.key] || 0) > 0).map(item => {
        return `<div class="sp-total-inv-row"><span class="sp-total-inv-emoji">${item.emoji}</span><span class="sp-total-inv-name">${item.name}</span><span class="sp-total-inv-detail">+${item.restore}⚡</span><span class="sp-total-inv-count">×${staminaInv[item.key]}</span></div>`;
      }).join('');
    }

    // 消消看道具
    function renderMatch3Items() {
      const items = [
        { key: 'expand', emoji: '🪜', name: '扩充神架', count: match3Inv.expand || 0 },
        { key: 'sweep', emoji: '🧹', name: '魔法扫帚', count: match3Inv.sweep || 0 },
        { key: 'shuffle', emoji: '🌀', name: '混沌风暴', count: match3Inv.shuffle || 0 },
      ];
      const hasAny = items.some(i => i.count > 0);
      if (!hasAny) return '<div class="sp-total-inv-empty">暂无</div>';
      return items.filter(i => i.count > 0).map(i => {
        return `<div class="sp-total-inv-row"><span class="sp-total-inv-emoji">${i.emoji}</span><span class="sp-total-inv-name">${i.name}</span><span class="sp-total-inv-detail"></span><span class="sp-total-inv-count">×${i.count}</span></div>`;
      }).join('');
    }

    // 连连看道具
    function renderLinkItems() {
      const items = [
        { key: 'hint', emoji: '🔍', name: '寻路放大镜', count: linkInv.hint || 0 },
        { key: 'shuffle', emoji: '🌀', name: '重组旋风', count: linkInv.shuffle || 0 },
        { key: 'bomb', emoji: '💣', name: '友情炸弹', count: linkInv.bomb || 0 },
        { key: 'compass', emoji: '🧭', name: '罗盘透视', count: linkInv.compass || 0 },
      ];
      const hasAny = items.some(i => i.count > 0);
      if (!hasAny) return '<div class="sp-total-inv-empty">暂无</div>';
      return items.filter(i => i.count > 0).map(i => {
        return `<div class="sp-total-inv-row"><span class="sp-total-inv-emoji">${i.emoji}</span><span class="sp-total-inv-name">${i.name}</span><span class="sp-total-inv-detail"></span><span class="sp-total-inv-count">×${i.count}</span></div>`;
      }).join('');
    }

    // 货架整理道具
    function renderShelfItems() {
      const shelfInv = state.shelfPropInventory || { basket: 0, autoMatch: 0, shuffle: 0 };
      const items = [
        { key: 'basket', emoji: '🪵', name: '临时扩展篮', count: shelfInv.basket || 0 },
        { key: 'autoMatch', emoji: '🧹', name: '喵喵爪理货', count: shelfInv.autoMatch || 0 },
        { key: 'shuffle', emoji: '🔄', name: '货架大洗牌', count: shelfInv.shuffle || 0 },
      ];
      const hasAny = items.some(i => i.count > 0);
      if (!hasAny) return '<div class="sp-total-inv-empty">暂无</div>';
      return items.filter(i => i.count > 0).map(i => {
        return `<div class="sp-total-inv-row"><span class="sp-total-inv-emoji">${i.emoji}</span><span class="sp-total-inv-name">${i.name}</span><span class="sp-total-inv-detail"></span><span class="sp-total-inv-count">×${i.count}</span></div>`;
      }).join('');
    }

    // 冰箱库存
    function renderFridgeItems() {
      const fridgeInv = state.fridgeInventory || [];
      if (fridgeInv.length === 0 || !fridgeInv.some(i => i.count > 0)) return '<div class="sp-total-inv-empty">暂无</div>';
      return fridgeInv.filter(i => i.count > 0).map(inv => {
        const data = FRIDGE_FOODS.find(f => f.id === inv.foodId);
        if (!data) return '';
        return `<div class="sp-total-inv-row"><span class="sp-total-inv-emoji">${data.emoji}</span><span class="sp-total-inv-name">${data.name}</span><span class="sp-total-inv-detail">+${data.feed}饱食</span><span class="sp-total-inv-count">×${inv.count}</span></div>`;
      }).join('');
    }

    // 冰箱道具
    function renderFridgePropItems() {
      const fridgePropInv = state.fridgePropInventory || { compress: 0, backpack: 0, organize: 0 };
      const hasAny = Object.values(fridgePropInv).some(v => v > 0);
      if (!hasAny) return '<div class="sp-total-inv-empty">暂无</div>';
      return Object.entries(FRIDGE_PROP_ITEMS).filter(([key]) => (fridgePropInv[key] || 0) > 0).map(([key, prop]) => {
        return `<div class="sp-total-inv-row"><span class="sp-total-inv-emoji">${prop.name.split(' ')[0]}</span><span class="sp-total-inv-name">${prop.name.split(' ').slice(1).join(' ')}</span><span class="sp-total-inv-detail">${prop.desc}</span><span class="sp-total-inv-count">×${fridgePropInv[key]}</span></div>`;
      }).join('');
    }

    // 糖葫芦库存
    function renderTanghuluItems() {
      const tangInv = state.tanghuluInventory || [];
      if (tangInv.length === 0 || !tangInv.some(i => i.count > 0)) return '<div class="sp-total-inv-empty">暂无</div>';
      return tangInv.filter(i => i.count > 0).map(inv => {
        const data = TANGHULU_FRUITS.find(f => f.key === inv.fruitKey);
        if (!data) return '';
        return `<div class="sp-total-inv-row"><span class="sp-total-inv-emoji">${data.emoji}</span><span class="sp-total-inv-name">${data.name}糖葫芦</span><span class="sp-total-inv-detail">售${data.sellPrice}🪙</span><span class="sp-total-inv-count">×${inv.count}</span></div>`;
      }).join('');
    }

    // 糖葫芦道具
    function renderTanghuluPropItems() {
      const tangPropInv = state.tanghuluPropInventory || { extraStick: 0, undo: 0, lubricant: 0 };
      const hasAny = Object.values(tangPropInv).some(v => v > 0);
      if (!hasAny) return '<div class="sp-total-inv-empty">暂无</div>';
      const propDefs = [
        { key: 'extraStick', emoji: '🥢', name: '赠送竹签' },
        { key: 'undo', emoji: '↩️', name: '悔步撤销' },
        { key: 'lubricant', emoji: '🌀', name: '顺滑剂' },
      ];
      return propDefs.filter(p => (tangPropInv[p.key] || 0) > 0).map(p => {
        return `<div class="sp-total-inv-row"><span class="sp-total-inv-emoji">${p.emoji}</span><span class="sp-total-inv-name">${p.name}</span><span class="sp-total-inv-detail"></span><span class="sp-total-inv-count">×${tangPropInv[p.key]}</span></div>`;
      }).join('');
    }

    // 完美的亮晶晶糖砂
    function renderSugarCrystal() {
      const count = state.tanghuluSugarCrystal || 0;
      if (count <= 0) return '<div class="sp-total-inv-empty">暂无</div>';
      return `<div class="sp-total-inv-row"><span class="sp-total-inv-emoji">✨</span><span class="sp-total-inv-name">完美的亮晶晶糖砂</span><span class="sp-total-inv-detail">售150🪙</span><span class="sp-total-inv-count">×${count}</span></div>`;
    }

    const overlay = document.createElement('div');
    overlay.id = 'sp-total-inventory-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:2147483649;';
    overlay.innerHTML = `
      <div class="sp-total-inv-box">
        <div class="sp-total-inv-header">
          <span>🎒 总背包</span>
          <div class="sp-total-inv-header-right">
            <span class="sp-total-inv-gold">🪙 ${state.gameGold || 0}</span>
            <span class="sp-total-inv-stamina">⚡ ${Math.floor(state.gameStamina || 0)}/${state.gameStaminaMax || 80}</span>
            <button class="sp-total-inv-close" title="关闭">✕</button>
          </div>
        </div>
        <div class="sp-total-inv-body">
          <div class="sp-total-inv-section">
            <div class="sp-total-inv-section-title">🍖 喂食道具</div>
            <div class="sp-total-inv-section-content">${renderShopItems(foodItems, 'food')}</div>
          </div>
          <div class="sp-total-inv-section">
            <div class="sp-total-inv-section-title">🧴 洗澡道具</div>
            <div class="sp-total-inv-section-content">${renderShopItems(cleanItems, 'clean')}</div>
          </div>
          <div class="sp-total-inv-section">
            <div class="sp-total-inv-section-title">🛏️ 睡觉道具</div>
            <div class="sp-total-inv-section-content">${renderShopItems(energyItems, 'energy')}</div>
          </div>
          <div class="sp-total-inv-section">
            <div class="sp-total-inv-section-title">🧊 冰箱库存</div>
            <div class="sp-total-inv-section-content">${renderFridgeItems()}</div>
          </div>
          <div class="sp-total-inv-section">
            <div class="sp-total-inv-section-title">🧊 冰箱道具</div>
            <div class="sp-total-inv-section-content">${renderFridgePropItems()}</div>
          </div>
          <div class="sp-total-inv-section">
            <div class="sp-total-inv-section-title">🍢 糖葫芦工坊</div>
            <div class="sp-total-inv-section-content">${renderTanghuluItems()}</div>
          </div>
          <div class="sp-total-inv-section">
            <div class="sp-total-inv-section-title">🍢 糖葫芦道具</div>
            <div class="sp-total-inv-section-content">${renderTanghuluPropItems()}</div>
          </div>
          <div class="sp-total-inv-section">
            <div class="sp-total-inv-section-title">✨ 珍贵收藏</div>
            <div class="sp-total-inv-section-content">${renderSugarCrystal()}</div>
          </div>
          <div class="sp-total-inv-section">
            <div class="sp-total-inv-section-title">⚡ 体力道具</div>
            <div class="sp-total-inv-section-content">${renderStaminaItems()}</div>
          </div>
          <div class="sp-total-inv-section">
            <div class="sp-total-inv-section-title">🃏 消消看道具</div>
            <div class="sp-total-inv-section-content">${renderMatch3Items()}</div>
          </div>
          <div class="sp-total-inv-section">
            <div class="sp-total-inv-section-title">🔗 连连看道具</div>
            <div class="sp-total-inv-section-content">${renderLinkItems()}</div>
          </div>
          <div class="sp-total-inv-section">
            <div class="sp-total-inv-section-title">🛒 货架整理道具</div>
            <div class="sp-total-inv-section-content">${renderShelfItems()}</div>
          </div>
          <div class="sp-total-inv-section">
            <div class="sp-total-inv-section-title">🔗 游戏物品联动说明</div>
            <div class="sp-total-inv-section-content">
              <div style="font-size:11px;color:var(--sp-text-muted);line-height:1.7;">
                <strong style="color:var(--sp-text-secondary);">🧶 合成工坊</strong><br/>
                🧂调料链物品 → 餐厅调料库存（实时同步）<br/>
                餐厅烹饪用调料 → 棋盘对应调料格消失<br/>
                售卖调料 → 餐厅调料库存同步扣除<br/><br/>
                <strong style="color:var(--sp-text-secondary);">🧊 冰箱整理</strong><br/>
                塞进冰箱的食材 → 冰箱库存（投喂桌宠 + 餐厅烹饪）<br/>
                酱油瓶🫙 → 餐厅可转换为酱油调料<br/><br/>
                <strong style="color:var(--sp-text-secondary);">🍢 糖葫芦工坊</strong><br/>
                通关糖葫芦 → 库存（可卖金币 / 投喂桌宠 / 餐厅甜品上菜）<br/>
                完美糖砂✨ → 投喂桌宠+50饱食 / 餐厅甜品上菜 / 卖150🪙<br/><br/>
                <strong style="color:var(--sp-text-secondary);">🛒 货架整理</strong><br/>
                🥤饮品 → 冰箱可乐 | 🍪零食 → 冰箱面包 | 🐟宠物 → 冰箱猫罐头<br/>
                🧸玩具 → 工坊睡眠道具 | 🧴清洁 → 工坊清洁道具<br/>
                🍄🦐🌽🥑🥟🍜食物 → 冰箱食材（投喂+餐厅）<br/>
                🍰🍦甜品 → 冰箱 | 🍡糖葫芦串 → 糖葫芦库存<br/>
                🧂🫙🌶️🧈🍯调料 → 餐厅调料（每组+2份）<br/>
                🫧🪻沐浴 → 清洁道具 | 🕯️🧣睡眠 → 睡眠道具<br/><br/>
                <strong style="color:var(--sp-text-secondary);">🐱 小猫餐厅</strong><br/>
                烹饪消耗调料 → 合成棋盘调料格同步消失<br/>
                出餐台菜品 → 可直接投喂桌宠<br/>
                进货区蔬菜 → 冰箱库存（可投喂+烹饪）<br/><br/>
                <strong style="color:var(--sp-text-secondary);">🎰 抽奖</strong><br/>
                棋盘物品 → 合成工坊棋盘 + 调料同步餐厅<br/>
                蔬菜 → 冰箱库存 | 糖葫芦 → 糖葫芦库存<br/>
                各类道具 → 对应游戏背包<br/><br/>
                <strong style="color:var(--sp-text-secondary);">💰 通用</strong><br/>
                所有游戏共享金币🪙和体力⚡<br/>
                投喂/洗澡/睡觉 → 从工坊背包+冰箱+糖葫芦+餐厅出餐台选用
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // 居中定位
    requestAnimationFrame(() => {
      const box = overlay.querySelector('.sp-total-inv-box');
      if (box) {
        const boxH = box.offsetHeight || 400;
        const boxW = box.offsetWidth || 320;
        box.style.position = 'fixed';
        box.style.top = Math.max(20, Math.floor((window.innerHeight - boxH) / 2)) + 'px';
        box.style.left = Math.floor((window.innerWidth - boxW) / 2) + 'px';
        box.style.margin = '0';
      }
    });

    // 关闭
    overlay.querySelector('.sp-total-inv-close').onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
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

  function showRegenConfirm(msgIdx) {
    showConfirmDialog({
      title: '🔄 重新生成',
      desc: '删除这条及之后的回复，重新让桌宠回答？',
      confirmText: '确认重新生成',
      cancelText: '取消',
      onConfirm: () => {
        state.petChatHistory = state.petChatHistory.slice(0, msgIdx);
        saveDataImmediate('聊天重新生成');
        renderChatHistory();
        generateReply();
      }
    });
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
      // 桌宠的回复支持右键/长按重新生成
      if (msg.role === 'assistant') {
        div.style.cursor = 'context-menu';
        const doRegenerate = () => {
          const msgIdx = state.petChatHistory.indexOf(msg);
          if (msgIdx < 0) return;
          showRegenConfirm(msgIdx);
        };
        div.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          // 如果弹窗已存在（长按已触发），跳过
          if (document.getElementById('sp-regen-confirm')) return;
          doRegenerate();
        });
        // 移动端长按兼容
        let longPressTimer = null;
        div.addEventListener('touchstart', () => {
          longPressTimer = setTimeout(() => { doRegenerate(); }, 600);
        }, { passive: true });
        div.addEventListener('touchend', () => { clearTimeout(longPressTimer); });
        div.addEventListener('touchmove', () => { clearTimeout(longPressTimer); });
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
        checkAchievements();
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
    // 如果 content 是多模态数组格式，提取其中的文字部分
    if (Array.isArray(text)) {
      let total = 0;
      for (const part of text) {
        if (part.type === 'text' && part.text) {
          total += estimateTokens(part.text);
        } else if (part.type === 'image_url') {
          total += 85; // 图片 token 粗略估算
        }
      }
      return total;
    }
    // 如果不是字符串，尝试转为字符串
    if (typeof text !== 'string') {
      text = String(text);
    }
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
      state.petChatHistory.push({ role: 'assistant', content: `[旁观] ${reply}`, timestamp: Date.now() });
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

  // ============================================================
  // 桌宠小屋
  // ============================================================
  function toggleHouse() {
    const houseEl = document.getElementById('silly-pet-house');
    if (!houseEl) {
      renderHousePanel();
    }
    const panel = document.getElementById('silly-pet-house');
    if (!panel) return;
    isHouseOpen = !isHouseOpen;
    // 关闭时顺手清掉快捷面板
    document.getElementById('sp-wardrobe-quick')?.remove();
    panel.classList.toggle('visible', isHouseOpen);
    if (isHouseOpen) {
      const w = Math.min(400, window.innerWidth - 20);
      panel.style.width = w + 'px';
      requestAnimationFrame(() => {
        const h = panel.offsetHeight;
        const maxTop = window.innerHeight - h - 20;
        const centerTop = Math.floor((window.innerHeight - h) / 2);
        panel.style.left = Math.floor((window.innerWidth - w) / 2) + 'px';
        panel.style.top = Math.max(10, Math.min(centerTop, maxTop)) + 'px';
      });
      // 打开时渲染聊天记录
      renderHouseChatHistory();

    // 刷新按钮图标（防止设置面板保存后小屋按钮未同步）
    const _feedBtn = document.getElementById('sp-house-feed-btn');
    if (_feedBtn) _feedBtn.innerHTML = settings.houseButtonFeed ? `<img src="${settings.houseButtonFeed}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />` : '🍖';
    const _bathBtn = document.getElementById('sp-house-bath-btn');
    if (_bathBtn) _bathBtn.innerHTML = settings.houseButtonBath ? `<img src="${settings.houseButtonBath}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />` : '🛁';
    const _sleepBtn = document.getElementById('sp-house-sleep-btn');
    if (_sleepBtn) _sleepBtn.innerHTML = settings.houseButtonSleep ? `<img src="${settings.houseButtonSleep}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />` : '🛏️';
    const _wardrobeBtn = document.getElementById('sp-house-wardrobe-btn');
    if (_wardrobeBtn) _wardrobeBtn.innerHTML = settings.houseButtonWardrobe ? `<img src="${settings.houseButtonWardrobe}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />` : '👗';
    const _regenBtn = document.getElementById('sp-house-regen-btn');
    if (_regenBtn) {
      _regenBtn.innerHTML = settings.houseButtonRegen ? `<img src="${settings.houseButtonRegen}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />` : '🔄';
      _regenBtn.style.background = settings.houseButtonRegen ? 'transparent' : '';
      _regenBtn.style.border = settings.houseButtonRegen ? 'none' : '';
      _regenBtn.style.backdropFilter = settings.houseButtonRegen ? 'none' : '';
    }
    const _sendBtn = document.getElementById('sp-house-send-btn');
    if (_sendBtn) {
      _sendBtn.innerHTML = settings.houseButtonSend ? `<img src="${settings.houseButtonSend}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />` : '➤';
      _sendBtn.style.background = settings.houseButtonSend ? 'transparent' : '';
      _sendBtn.style.border = settings.houseButtonSend ? 'none' : '';
      _sendBtn.style.backdropFilter = settings.houseButtonSend ? 'none' : '';
    }

    }
  }

  // ============================================================
  // 👗 更衣快捷面板
  // ============================================================
  function toggleWardrobeQuick() {
    // 如果已有快捷面板就关闭
    const existing = document.getElementById('sp-wardrobe-quick');
    if (existing) { existing.remove(); return; }

    // 计算位置（相对于更衣按钮）
    const wardrobeBtn = document.getElementById('sp-house-wardrobe-btn');
    if (!wardrobeBtn) return;
    const btnRect = wardrobeBtn.getBoundingClientRect();

    const panel = document.createElement('div');
    panel.id = 'sp-wardrobe-quick';
    panel.style.cssText = `
      position: fixed;
      right: ${window.innerWidth - btnRect.right}px;
      top: ${btnRect.bottom + 6}px;
      z-index: 2147483651;
      display: flex;
      flex-direction: column;
      gap: 6px;
      animation: sp-fade-in 0.15s ease;
    `;

    // 构建内容：设置按钮 + 各套服装按钮
    const outfits = settings.houseOutfits || [];

    // 设置按钮
    const settingsBtnEl = document.createElement('div');
    settingsBtnEl.id = 'sp-wardrobe-quick-settings';
    settingsBtnEl.title = '更衣设置';
    settingsBtnEl.style.cssText = `
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(30,30,40,0.85);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 2px solid rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 13px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      transition: all 0.2s;
      flex-shrink: 0;
    `;

    if (settings.houseButtonWardrobeSettings) {
      settingsBtnEl.innerHTML = `<img src="${settings.houseButtonWardrobeSettings}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`;
      settingsBtnEl.style.background = 'transparent';
      settingsBtnEl.style.border = 'none';
      settingsBtnEl.style.backdropFilter = 'none';
    } else {
      settingsBtnEl.textContent = '⚙️';
    }

    settingsBtnEl.onmouseenter = () => {
      settingsBtnEl.style.borderColor = 'rgba(100,180,255,0.6)';
      settingsBtnEl.style.background = 'rgba(100,180,255,0.2)';
    };
    settingsBtnEl.onmouseleave = () => {
      settingsBtnEl.style.borderColor = 'rgba(255,255,255,0.2)';
      settingsBtnEl.style.background = 'rgba(30,30,40,0.85)';
    };
    settingsBtnEl.onclick = (e) => {
      e.stopPropagation();
      panel.remove();
      toggleWardrobeModal();
    };
    panel.appendChild(settingsBtnEl);

    // 各套服装按钮（全局默认 + 每套服装）
    // 先加一个"全局默认"（恢复无服装状态）
    if (outfits.length > 0) {
      const defaultBtn = _buildOutfitQuickBtn({
        name: '默认',
        coverImage: settings.houseCharacter || '',
        _isDefault: true,
      });
      panel.appendChild(defaultBtn);
    }

    // 再加各套服装
    outfits.forEach((outfit) => {
      const btn = _buildOutfitQuickBtn(outfit);
      panel.appendChild(btn);
    });

    document.body.appendChild(panel);

    // 点击外部关闭
    const closeHandler = (e) => {
      if (!panel.contains(e.target) && e.target !== wardrobeBtn) {
        panel.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    // 延迟绑定，避免当前 click 事件立刻触发
    setTimeout(() => document.addEventListener('click', closeHandler), 0);
  }

  // 构建单个服装快捷按钮
  function _buildOutfitQuickBtn(outfit) {
    const isWearing = outfit._isDefault
      ? settings.houseCurrentOutfit === ''
      : settings.houseCurrentOutfit === outfit.name;

    const btn = document.createElement('div');
    btn.title = outfit._isDefault ? '全局默认' : outfit.name;
    btn.style.cssText = `
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: ${isWearing ? 'rgba(100,180,255,0.3)' : 'rgba(30,30,40,0.85)'};
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 2px solid ${isWearing ? 'rgba(100,180,255,0.8)' : 'rgba(255,255,255,0.2)'};
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      transition: all 0.2s;
      flex-shrink: 0;
      overflow: hidden;
      position: relative;
    `;

    // 封面图或默认内容
    const coverSrc = outfit._isDefault
      ? (settings.houseCharacter || '')
      : (outfit.coverImage || outfit.character || '');

    if (coverSrc) {
      btn.innerHTML = `<img src="${coverSrc}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;pointer-events:none;" />`;
    } else {
      btn.innerHTML = `<span style="font-size:18px;pointer-events:none;">${outfit._isDefault ? '🌿' : '👗'}</span>`;
    }

    // 当前穿着标记（小圆点）
    if (isWearing) {
      const dot = document.createElement('div');
      dot.style.cssText = `
        position: absolute;
        bottom: 1px;
        right: 1px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(100,220,100,0.9);
        border: 1px solid rgba(0,0,0,0.4);
        pointer-events: none;
      `;
      btn.appendChild(dot);
    }

    btn.onmouseenter = () => {
      if (!isWearing) {
        btn.style.borderColor = 'rgba(100,180,255,0.5)';
        btn.style.background = 'rgba(100,180,255,0.15)';
      }
    };
    btn.onmouseleave = () => {
      if (!isWearing) {
        btn.style.borderColor = 'rgba(255,255,255,0.2)';
        btn.style.background = 'rgba(30,30,40,0.85)';
      }
    };

    btn.onclick = (e) => {
      e.stopPropagation();
      const panel = document.getElementById('sp-wardrobe-quick');
      if (panel) panel.remove();

      if (outfit._isDefault) {
        settings.houseCurrentOutfit = '';
        saveData();
        updateHouseScene();
        showBubble('已切换回全局默认立绘', 2000);
      } else {
        settings.houseCurrentOutfit = outfit.name;
        saveData();
        updateHouseScene();
        showBubble(`👗 已换上「${outfit.name}」`, 2000);
      }
    };

    return btn;
  }

  // ============================================================
  // 👗 更衣系统弹窗
  // ============================================================
  function toggleWardrobeModal() {
    // 如果弹窗已存在则关闭
    const existing = document.getElementById('sp-wardrobe-modal-overlay');
    if (existing) { existing.remove(); return; }

    const overlay = document.createElement('div');
    overlay.id = 'sp-wardrobe-modal-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;z-index:2147483650;';

    overlay.innerHTML = `
      <div id="sp-wardrobe-modal" style="
        background:var(--sp-bg-secondary);
        backdrop-filter:blur(14px);
        -webkit-backdrop-filter:blur(14px);
        border:1px solid var(--sp-border);
        border-radius:16px;
        width:360px;
        max-width:92vw;
        max-height:82vh;
        box-shadow:0 8px 32px rgba(0,0,0,0.4);
        display:flex;
        flex-direction:column;
        overflow:hidden;
        animation:sp-fade-in 0.2s ease;
        position:fixed;
      ">
        <div id="sp-wardrobe-header" style="
          display:flex;justify-content:space-between;align-items:center;
          padding:12px 16px;
          background:rgba(255,255,255,0.06);
          border-bottom:1px solid rgba(255,255,255,0.08);
          cursor:grab;
          flex-shrink:0;
        ">
          <span style="font-size:14px;font-weight:700;color:var(--sp-text-primary);">👗 更衣系统</span>
          <button id="sp-wardrobe-close" style="background:none;border:none;font-size:18px;cursor:pointer;color:#aaa;padding:0;width:24px;height:24px;display:flex;align-items:center;justify-content:center;transition:color 0.2s;">✕</button>
        </div>
        <div id="sp-wardrobe-body" style="
          flex:1;overflow-y:auto;padding:14px;
          scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.2) transparent;
        ">
          <!-- 服装列表区 -->
          <div style="margin-bottom:14px;padding:12px;background:rgba(255,255,255,0.05);border-radius:10px;border:1px solid rgba(255,255,255,0.08);">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
              <span style="font-size:13px;font-weight:600;color:var(--sp-text-primary);">👗 服装列表</span>
              <button id="sp-wardrobe-add-outfit" type="button" style="padding:4px 10px;font-size:11px;border-radius:6px;border:1px solid var(--sp-primary-border);background:var(--sp-primary);color:#fff;cursor:pointer;">+ 新建服装</button>
            </div>
            <div id="sp-wardrobe-outfit-list"></div>
            <p style="font-size:10px;color:#666;margin-top:8px;margin-bottom:0;">没有服装时，下方编辑的是全局默认立绘。新建并选中服装后，下方修改的内容会保存到该服装。</p>
          </div>

          <!-- 当前编辑状态提示 -->
          <div id="sp-wardrobe-editing-label" style="font-size:11px;color:rgba(100,180,255,0.8);text-align:center;margin-bottom:10px;padding:4px 8px;background:rgba(100,180,255,0.08);border-radius:6px;border:1px solid rgba(100,180,255,0.2);display:none;"></div>

          <!-- 桌宠小屋 -->
          <div class="sp-section" style="margin-bottom:14px;padding:12px;background:rgba(255,255,255,0.05);border-radius:10px;border:1px solid rgba(255,255,255,0.08);">
            <div class="sp-section-title" style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--sp-text-primary);">🏠 小屋场景（全局）</div>
            <p style="font-size:11px;color:#999;margin-bottom:8px;">背景图和对话框头像是全局的，不随服装切换变化</p>
            <div id="sp-wardrobe-upload-house"></div>
          </div>

          <!-- 小屋动作立绘 -->
          <div class="sp-section" style="margin-bottom:14px;padding:12px;background:rgba(255,255,255,0.05);border-radius:10px;border:1px solid rgba(255,255,255,0.08);">
            <div class="sp-section-title" style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--sp-text-primary);">🎨 服装立绘 <span id="sp-wardrobe-outfit-badge" style="font-size:10px;color:#888;font-weight:400;">（全局默认）</span></div>
            <p style="font-size:11px;color:#999;margin-bottom:8px;">这些立绘属于当前选中的服装，切换服装时自动更换</p>
            <div id="sp-wardrobe-upload-house-actions"></div>
          </div>

          <!-- 小屋表情立绘 -->
          <div class="sp-section" style="margin-bottom:0;padding:12px;background:rgba(255,255,255,0.05);border-radius:10px;border:1px solid rgba(255,255,255,0.08);">
            <div class="sp-section-title" style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--sp-text-primary);">🎭 表情立绘 <span id="sp-wardrobe-expr-badge" style="font-size:10px;color:#888;font-weight:400;">（全局默认）</span></div>
            <div id="sp-wardrobe-expressions-list"></div>
            <button class="sp-btn" id="sp-wardrobe-add-expression" type="button" style="margin-top:8px;padding:6px 14px;border-radius:8px;border:1px solid var(--sp-border);background:var(--sp-bg-light);color:var(--sp-text-secondary);cursor:pointer;font-size:12px;">+ 添加表情立绘</button>
          </div>

        </div>
        <div style="padding:12px 16px;border-top:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.04);flex-shrink:0;">
          <button id="sp-wardrobe-save" style="width:100%;padding:10px;font-size:14px;font-weight:600;border-radius:8px;border:1px solid var(--sp-primary-border);background:var(--sp-primary);color:#fff;cursor:pointer;transition:background 0.2s;">💾 保存设置</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // 居中定位
    requestAnimationFrame(() => {
      const modal = document.getElementById('sp-wardrobe-modal');
      if (modal) {
        const h = modal.offsetHeight || 500;
        const w = modal.offsetWidth || 360;
        modal.style.position = 'fixed';
        modal.style.top = Math.max(20, Math.floor((window.innerHeight - h) / 2)) + 'px';
        modal.style.left = Math.floor((window.innerWidth - w) / 2) + 'px';
        modal.style.margin = '0';
      }
    });

    // 关闭
    document.getElementById('sp-wardrobe-close').onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

    // 保存按钮
    document.getElementById('sp-wardrobe-save').onclick = () => {
      delete settings._wardrobeEditOutfit;
      saveData();
      // 刷新小屋场景
      updateHouseScene();
      // 刷新按钮图标
      ['Feed', 'Bath', 'Sleep', 'Wardrobe'].forEach(name => {
        const key = `houseButton${name}`;
        const btnId = `sp-house-${name.toLowerCase()}-btn`;
        const emojiMap = { Feed: '🍖', Bath: '🛁', Sleep: '🛏️', Wardrobe: '👗' };
        const btnEl = document.getElementById(btnId);
        if (btnEl) {
          if (settings[key]) {
            btnEl.innerHTML = `<img src="${settings[key]}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`;
            btnEl.style.border = 'none';
            btnEl.style.background = 'transparent';
            btnEl.style.backdropFilter = 'none';
          } else {
            btnEl.innerHTML = emojiMap[name];
            btnEl.style.border = '1px solid rgba(255,255,255,0.3)';
            btnEl.style.background = 'rgba(0,0,0,0.4)';
            btnEl.style.backdropFilter = 'blur(4px)';
          }
        }
      });
      showBubble('更衣设置已保存～✨', 2000);
      overlay.remove();
    };

    // 初始化编辑目标（默认跟当前穿的服装一致）
    settings._wardrobeEditOutfit = settings.houseCurrentOutfit || '';

    // 渲染服装列表
    wardrobeRenderOutfitList();

    // 新建服装按钮
    document.getElementById('sp-wardrobe-add-outfit').onclick = () => {
      const name = prompt('给这套服装起个名字：', `服装${(settings.houseOutfits || []).length + 1}`);
      if (!name || !name.trim()) return;
      if ((settings.houseOutfits || []).find(o => o.name === name.trim())) {
        showBubble('已有同名服装，请换个名字', 2500);
        return;
      }
      if (!settings.houseOutfits) settings.houseOutfits = [];
      const newOutfit = {
        name: name.trim(),
        coverImage: '',
        character: '',
        actionFeed: '',
        actionBath: '',
        actionSleep: '',
        expressions: [],
      };

      settings.houseOutfits.push(newOutfit);
      settings._wardrobeEditOutfit = newOutfit.name;
      saveData();
      wardrobeRenderOutfitList();
      wardrobeRenderUploads();
      wardrobeRenderExpressions();
      showBubble(`✨ 服装「${newOutfit.name}」已创建，可以上传立绘了`, 2500);
    };

    // 渲染三个上传区
    wardrobeRenderUploads();

    // 渲染表情立绘
    wardrobeRenderExpressions();

    // 绑定拖拽
    wardrobeBindDrag();
  }

  // 获取正在编辑的服装对象（不是当前穿着，是弹窗里选中编辑的）
  function wardrobeGetEditingOutfit() {
    const name = settings._wardrobeEditOutfit;
    if (!name || !settings.houseOutfits) return null;
    return settings.houseOutfits.find(o => o.name === name) || null;
  }

  // 取图片值（区分服装字段和全局字段）
  function wardrobeGetImage(key) {
    if (key.startsWith('outfit__')) {
      const field = key.replace('outfit__', '');
      const outfit = wardrobeGetEditingOutfit();
      return (outfit && outfit[field]) || '';
    }
    return settings[key] || '';
  }

  // 写入图片值
  function wardrobeSetImage(key, value) {
    if (key.startsWith('outfit__')) {
      const field = key.replace('outfit__', '');
      const outfit = wardrobeGetEditingOutfit();
      if (outfit) {
        outfit[field] = value;
        const idx = (settings.houseOutfits || []).findIndex(o => o.name === outfit.name);
        if (idx >= 0) settings.houseOutfits[idx] = outfit;
      }
      return;
    }
    setSettingsImage(key, value);
  }

  function wardrobeRenderOutfitList() {
    const container = document.getElementById('sp-wardrobe-outfit-list');
    if (!container) return;
    if (!settings.houseOutfits) settings.houseOutfits = [];

    if (settings.houseOutfits.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:10px;color:var(--sp-text-muted);font-size:12px;">还没有服装～点「+ 新建服装」创建第一套</div>';
      return;
    }

    container.innerHTML = settings.houseOutfits.map((outfit, idx) => {
      const isWearing = settings.houseCurrentOutfit === outfit.name;
      const isEditing = settings._wardrobeEditOutfit === outfit.name;
      const previewImg = outfit.character || '';
      return `
        <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;
          background:${isWearing ? 'rgba(100,180,255,0.12)' : isEditing ? 'rgba(100,220,100,0.08)' : 'rgba(255,255,255,0.04)'};
          border:2px solid ${isWearing ? 'rgba(100,180,255,0.6)' : isEditing ? 'rgba(100,220,100,0.4)' : 'rgba(255,255,255,0.08)'};
          border-radius:10px;margin-bottom:6px;transition:all 0.2s;">
          <div style="width:40px;height:40px;border-radius:8px;overflow:hidden;flex-shrink:0;
            background:rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,0.1);">
            ${previewImg
              ? `<img src="${previewImg}" style="width:100%;height:100%;object-fit:contain;" />`
              : '<span style="font-size:20px;">👗</span>'}
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:12px;font-weight:600;color:${isWearing ? 'rgba(100,180,255,0.9)' : 'var(--sp-text-primary)'};">${outfit.name}</div>
            <div style="font-size:10px;color:var(--sp-text-muted);">
              ${outfit.character ? '✅立绘' : '⬜立绘'}
              ${(outfit.actionFeed || outfit.actionBath || outfit.actionSleep) ? ' ✅动作' : ' ⬜动作'}
              ${(outfit.expressions && outfit.expressions.length > 0) ? ` ✅表情×${outfit.expressions.length}` : ' ⬜表情'}
              ${isWearing ? ' <span style="color:rgba(100,180,255,0.8);">🟢穿着中</span>' : ''}
            </div>
          </div>
          <div style="display:flex;gap:3px;flex-shrink:0;flex-wrap:wrap;justify-content:flex-end;">
            ${!isWearing
              ? `<button class="sp-wardrobe-outfit-equip" data-idx="${idx}"
                  style="padding:2px 7px;font-size:10px;border-radius:5px;
                    border:1px solid rgba(100,220,100,0.5);background:rgba(100,220,100,0.15);
                    color:#6f6;cursor:pointer;">穿上</button>`
              : `<button class="sp-wardrobe-outfit-unequip" data-idx="${idx}"
                  style="padding:2px 7px;font-size:10px;border-radius:5px;
                    border:1px solid rgba(255,180,50,0.5);background:rgba(255,180,50,0.15);
                    color:#ffb347;cursor:pointer;">脱下</button>`}
            <button class="sp-wardrobe-outfit-cover" data-idx="${idx}"
              style="padding:2px 7px;font-size:10px;border-radius:5px;
                border:1px solid rgba(255,200,50,0.4);background:rgba(255,200,50,0.08);
                color:#ffb347;cursor:pointer;" title="上传封面图（圆形按钮显示）">🖼️封面</button>
            <input type="file" class="sp-wardrobe-cover-file" data-idx="${idx}"
              accept="image/png,image/jpeg,image/gif,image/webp" style="display:none;" />
            <button class="sp-wardrobe-outfit-edit" data-idx="${idx}"
              style="padding:2px 7px;font-size:10px;border-radius:5px;
                border:1px solid ${isEditing ? 'rgba(100,220,100,0.5)' : 'var(--sp-border)'};
                background:${isEditing ? 'rgba(100,220,100,0.1)' : 'var(--sp-bg-light)'};
                color:${isEditing ? '#6f6' : 'var(--sp-text-secondary)'};cursor:pointer;">${isEditing ? '✏️编辑中' : '编辑'}</button>
            <button class="sp-wardrobe-outfit-delete" data-idx="${idx}"
              style="padding:2px 7px;font-size:10px;border-radius:5px;
                border:1px solid rgba(239,83,80,0.4);background:rgba(239,83,80,0.1);
                color:#f66;cursor:pointer;">✕</button>
          </div>
        </div>
      `;
    }).join('');

    // 穿上
    container.querySelectorAll('.sp-wardrobe-outfit-equip').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
        settings.houseCurrentOutfit = settings.houseOutfits[idx].name;
        saveData();
        updateHouseScene();
        wardrobeRenderOutfitList();
        showBubble(`👗 已换上「${settings.houseCurrentOutfit}」`, 2000);
      };
    });

    // 脱下（恢复全局默认）
    container.querySelectorAll('.sp-wardrobe-outfit-unequip').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        settings.houseCurrentOutfit = '';
        saveData();
        updateHouseScene();
        wardrobeRenderOutfitList();
        showBubble('已切换回全局默认立绘', 2000);
      };
    });

    // 编辑（选中该服装作为编辑目标，不影响实际穿着）
    container.querySelectorAll('.sp-wardrobe-outfit-edit').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
        settings._wardrobeEditOutfit = settings.houseOutfits[idx].name;
        wardrobeRenderOutfitList();
        wardrobeRenderUploads();
        wardrobeRenderExpressions();
        showBubble(`✏️ 正在编辑服装「${settings.houseOutfits[idx].name}」`, 2000);
      };
    });

    // 删除
    container.querySelectorAll('.sp-wardrobe-outfit-delete').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
        const name = settings.houseOutfits[idx].name;
        showConfirmDialog({
          title: `🗑️ 删除服装「${name}」？`,
          desc: '服装内的立绘数据将全部删除，无法恢复。',
          confirmText: '删除',
          cancelText: '取消',
          onConfirm: () => {
            settings.houseOutfits.splice(idx, 1);
            if (settings.houseCurrentOutfit === name) {
              settings.houseCurrentOutfit = '';
              updateHouseScene();
            }
            if (settings._wardrobeEditOutfit === name) {
              settings._wardrobeEditOutfit = '';
            }
            saveData();
            wardrobeRenderOutfitList();
            wardrobeRenderUploads();
            wardrobeRenderExpressions();
            showBubble(`服装「${name}」已删除`, 2000);
          }
        });
      };
    });


    // 封面上传按钮
    container.querySelectorAll('.sp-wardrobe-outfit-cover').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
        const fileInput = container.querySelector(`.sp-wardrobe-cover-file[data-idx="${idx}"]`);
        if (fileInput) fileInput.click();
      };
    });

    // 封面文件选择
    container.querySelectorAll('.sp-wardrobe-cover-file').forEach(input => {
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { showBubble('图片超过2MB了～', 3000); return; }
        const idx = parseInt(input.dataset.idx);
        const reader = new FileReader();
        reader.onload = async (ev) => {
          // 压缩为小图（圆形按钮42px，不需要太大）
          const compressed = await compressImage(ev.target.result, 120, 0.8);
          if (settings.houseOutfits[idx]) {
            settings.houseOutfits[idx].coverImage = compressed;
            saveData();
            wardrobeRenderOutfitList();
            showBubble('封面已设置！', 1500);
          }
        };
        reader.readAsDataURL(file);
        input.value = '';
      };
    });
  }

  function wardrobeRenderUploads() {
    const houseArea = document.getElementById('sp-wardrobe-upload-house');
    const houseActionsArea = document.getElementById('sp-wardrobe-upload-house-actions');
    if (!houseArea || !houseActionsArea) return;

    // 全局场景（背景/头像始终全局）
    const houseConfigs = [
      ['houseBackground',      '房间背景（全局）'],
      ['houseCharacter',       '默认立绘（无服装时用）'],
      ['houseCharacterAvatar', '对话框头像（全局）'],
    ];
    houseArea.innerHTML = houseConfigs.map(([key, label]) =>
      buildUploadGroup(key, label, settings[key])
    ).join('');

    // 根据编辑目标决定动作立绘是写进服装还是全局
    const editOutfit = wardrobeGetEditingOutfit();
    const outfitBadge = document.getElementById('sp-wardrobe-outfit-badge');
    const exprBadge = document.getElementById('sp-wardrobe-expr-badge');
    const editLabel = document.getElementById('sp-wardrobe-editing-label');

    if (editOutfit) {
      const isWearing = settings.houseCurrentOutfit === editOutfit.name;
      if (outfitBadge) outfitBadge.textContent = `（${editOutfit.name}）`;
      if (exprBadge) exprBadge.textContent = `（${editOutfit.name}）`;
      if (editLabel) {
        editLabel.textContent = `✏️ 正在编辑：「${editOutfit.name}」${isWearing ? ' 🟢 已穿上' : ' ⚪ 未穿上（编辑不影响小屋显示）'}`;
        editLabel.style.display = '';
      }
      // 动作立绘用 outfit__ 前缀，写入服装对象
      const actionConfigs = [
        ['outfit__actionFeed',  '喂食立绘'],
        ['outfit__actionBath',  '洗澡立绘'],
        ['outfit__actionSleep', '睡觉立绘'],
      ];
      // 按钮图标还是全局的
      const buttonConfigs = [
        ['houseButtonFeed',      '喂食按钮图标（全局）'],
        ['houseButtonBath',      '洗澡按钮图标（全局）'],
        ['houseButtonSleep',     '睡觉按钮图标（全局）'],
        ['houseButtonWardrobe',  '更衣按钮图标（全局）'],
      ];
      houseActionsArea.innerHTML =
        actionConfigs.map(([key, label]) =>
          buildUploadGroup(key, label, editOutfit[key.replace('outfit__', '')] || '')
        ).join('') +
        buttonConfigs.map(([key, label]) =>
          buildUploadGroup(key, label, settings[key])
        ).join('');
    } else {
      if (outfitBadge) outfitBadge.textContent = '（全局默认）';
      if (exprBadge) exprBadge.textContent = '（全局默认）';
      if (editLabel) editLabel.style.display = 'none';
      const houseActionConfigs = [
        ['houseActionFeed',      '喂食立绘（全局默认）'],
        ['houseActionBath',      '洗澡立绘（全局默认）'],
        ['houseActionSleep',     '睡觉立绘（全局默认）'],
        ['houseButtonFeed',      '喂食按钮图标'],
        ['houseButtonBath',      '洗澡按钮图标'],
        ['houseButtonSleep',     '睡觉按钮图标'],
        ['houseButtonWardrobe',  '更衣按钮图标'],
        ['houseButtonRegen',           '重新生成按钮图标'],
        ['houseButtonSend',            '发送按钮图标'],
        ['houseButtonWardrobeSettings','更衣设置入口图标'],
      ];
      houseActionsArea.innerHTML = houseActionConfigs.map(([key, label]) =>
        buildUploadGroup(key, label, settings[key])
      ).join('');
    }

    // 统一绑定两个区域的上传事件
    [houseArea, houseActionsArea].forEach(area => {
      area.querySelectorAll('.sp-upload-preview').forEach(preview => {
        preview.onclick = (e) => {
          if (e.target.classList.contains('sp-upload-remove')) return;
          const fi = document.getElementById(`sp-file-${preview.dataset.key}`);
          if (fi) fi.click();
        };
        const rm = preview.querySelector('.sp-upload-remove');
        if (rm) rm.onclick = (e) => {
          e.stopPropagation();
          wardrobeSetImage(rm.dataset.key, '');
          updateUploadPreview(rm.dataset.key, '');
          updateHouseScene();
          saveData();
        };
      });

      area.querySelectorAll('.sp-upload-btn').forEach(btn => {
        btn.onclick = (e) => {
          e.preventDefault();
          const fi = document.getElementById(`sp-file-${btn.dataset.key}`);
          if (fi) fi.click();
        };
      });

      area.querySelectorAll('.sp-upload-url-btn').forEach(btn => {
        btn.onclick = (e) => {
          e.preventDefault();
          const key = btn.dataset.key;
          const currentVal = wardrobeGetImage(key);
          const url = prompt(
            '输入图片链接（支持 GIF）：\n留空并确认 = 清除',
            currentVal && currentVal.startsWith('http') ? currentVal : ''
          );
          if (url === null) return;
          const trimmed = url.trim();
          if (trimmed && !trimmed.startsWith('http')) {
            showBubble('链接需要以 http 开头', 3000);
            return;
          }
          wardrobeSetImage(key, trimmed);
          updateUploadPreview(key, trimmed);
          updateHouseScene();
          saveData();
          showBubble(trimmed ? '图片链接已设置！' : '已清除图片', 2000);
        };
      });

      area.querySelectorAll('input[type="file"][data-key]').forEach(input => {
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (!file) return;
          if (file.size > 2 * 1024 * 1024) { showBubble('图片超过2MB了～', 3000); return; }
          const reader = new FileReader();
          reader.onload = async (ev) => {
            const key = input.dataset.key;
            const isLarge = key === 'houseBackground' || key === 'houseCharacter' ||
              key.startsWith('houseAction') || key.startsWith('outfit__action') || key.startsWith('houseButton');
            const processed = isLarge ? ev.target.result : await compressImage(ev.target.result, 200, 0.7);
            wardrobeSetImage(key, processed);
            updateUploadPreview(key, processed);
            updateHouseScene();
            saveData();
            showBubble('图片设置好啦～✨', 2000);
          };
          reader.readAsDataURL(file);
        };
      });

      area.querySelectorAll('.sp-duration-slider').forEach(slider => {
        slider.oninput = () => {
          const sliderKey = slider.dataset.key;
          const val = parseInt(slider.value);
          if (!settings.spriteDurations) settings.spriteDurations = {};
          settings.spriteDurations[sliderKey] = val;
          const display = area.querySelector(`.sp-duration-val[data-key="${sliderKey}"]`);
          if (display) display.textContent = (val / 1000).toFixed(1) + 's';
          saveData();
        };
      });
    });
  }


  function wardrobeRenderExpressions() {
    const container = document.getElementById('sp-wardrobe-expressions-list');
    if (!container) return;

    // 判断编辑目标：服装的 expressions 还是全局 houseExpressions
    const editingOutfit = wardrobeGetEditingOutfit();
    const getExprs = () => {
      if (editingOutfit) {
        if (!editingOutfit.expressions) editingOutfit.expressions = [];
        return editingOutfit.expressions;
      }
      if (!settings.houseExpressions) settings.houseExpressions = [];
      return settings.houseExpressions;
    };
    const saveExprs = () => {
      if (editingOutfit) {
        const idx = (settings.houseOutfits || []).findIndex(o => o.name === editingOutfit.name);
        if (idx >= 0) settings.houseOutfits[idx].expressions = editingOutfit.expressions;
      }
    };

    container.innerHTML = '';
    getExprs().forEach((expr, idx) => {
      const div = document.createElement('div');
      div.className = 'sp-custom-sprite-item';
      div.innerHTML = `
        <div class="sp-custom-sprite-preview" data-house-expr-idx="${idx}" style="cursor:pointer;">
          ${expr.image
            ? `<img src="${expr.image}" alt="${expr.name || ''}" />`
            : '<span class="sp-upload-placeholder">＋</span>'}
        </div>
        <div class="sp-custom-sprite-info">
          <input type="text" class="sp-wardrobe-expr-name" data-idx="${idx}" value="${expr.name || ''}"
            placeholder="表情名（如：笑）"
            style="margin-bottom:4px;width:100%;padding:6px 8px;font-size:12px;
              border:1px solid rgba(255,255,255,0.12);border-radius:8px;
              background:rgba(255,255,255,0.06);color:var(--sp-text-primary);box-sizing:border-box;" />
          <input type="text" class="sp-wardrobe-expr-keywords" data-idx="${idx}" value="${expr.keywords || ''}"
            placeholder="关键词（逗号分隔，如：笑,开心,哈哈）"
            style="width:100%;padding:6px 8px;font-size:12px;
              border:1px solid rgba(255,255,255,0.12);border-radius:8px;
              background:rgba(255,255,255,0.06);color:var(--sp-text-primary);box-sizing:border-box;" />
          <div class="sp-custom-sprite-actions" style="margin-top:6px;">
            <button class="sp-btn sp-wardrobe-expr-upload" data-idx="${idx}" type="button"
              style="padding:3px 8px;font-size:11px;border-radius:6px;
                border:1px solid var(--sp-border);background:var(--sp-bg-light);
                color:var(--sp-text-secondary);cursor:pointer;">📁 图片</button>
            <button class="sp-btn sp-wardrobe-expr-url" data-idx="${idx}" type="button"
              style="padding:3px 8px;font-size:11px;border-radius:6px;
                border:1px solid var(--sp-border);background:var(--sp-bg-light);
                color:var(--sp-text-secondary);cursor:pointer;">🔗 链接</button>
            <button class="sp-btn sp-btn-danger sp-wardrobe-expr-delete" data-idx="${idx}" type="button"
              style="padding:3px 8px;font-size:11px;border-radius:6px;
                background:rgba(239,83,80,0.4);color:#fff;
                border:1px solid rgba(239,83,80,0.5);cursor:pointer;">✕</button>
            <input type="file" class="sp-wardrobe-expr-file" data-idx="${idx}"
              accept="image/png,image/jpeg,image/gif,image/webp" style="display:none;" />
          </div>
        </div>
      `;
      container.appendChild(div);
    });

    // 添加按钮
    const addBtn = document.getElementById('sp-wardrobe-add-expression');
    if (addBtn) {
      addBtn.onclick = () => {
        getExprs().push({ name: '', keywords: '', image: '' });
        saveExprs();
        wardrobeRenderExpressions();
      };
    }

    // 名称
    container.querySelectorAll('.sp-wardrobe-expr-name').forEach(input => {
      input.onchange = () => {
        const idx = parseInt(input.dataset.idx);
        const exprs = getExprs();
        if (exprs[idx]) { exprs[idx].name = input.value.trim(); saveExprs(); }
      };
    });

    // 关键词
    container.querySelectorAll('.sp-wardrobe-expr-keywords').forEach(input => {
      input.onchange = () => {
        const idx = parseInt(input.dataset.idx);
        const exprs = getExprs();
        if (exprs[idx]) { exprs[idx].keywords = input.value.trim(); saveExprs(); }
      };
    });

    // 预览区点击触发文件选择
    container.querySelectorAll('[data-house-expr-idx]').forEach(preview => {
      preview.onclick = () => {
        const idx = parseInt(preview.dataset.houseExprIdx);
        container.querySelector(`.sp-wardrobe-expr-file[data-idx="${idx}"]`)?.click();
      };
    });

    // 上传按钮
    container.querySelectorAll('.sp-wardrobe-expr-upload').forEach(btn => {
      btn.onclick = () => {
        container.querySelector(`.sp-wardrobe-expr-file[data-idx="${btn.dataset.idx}"]`)?.click();
      };
    });

    // 文件选择
    container.querySelectorAll('.sp-wardrobe-expr-file').forEach(input => {
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { showBubble('图片超过2MB了～', 3000); return; }
        const idx = parseInt(input.dataset.idx);
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const compressed = await compressImage(ev.target.result, 400, 0.75);
          const exprs = getExprs();
          if (exprs[idx]) {
            exprs[idx].image = compressed;
            saveExprs();
            wardrobeRenderExpressions();
            showBubble('表情立绘设置好啦～', 2000);
          }
        };
        reader.readAsDataURL(file);
        input.value = '';
      };
    });

    // 链接
    container.querySelectorAll('.sp-wardrobe-expr-url').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.idx);
        const exprs = getExprs();
        if (!exprs[idx]) return;
        const current = exprs[idx].image || '';
        const url = prompt(
          `设置第 ${idx + 1} 个表情的图片链接（留空确认=清除）：`,
          current.startsWith('http') ? current : ''
        );
        if (url === null) return;
        const trimmed = url.trim();
        if (trimmed && !trimmed.startsWith('http')) { showBubble('链接需要以 http 开头', 3000); return; }
        exprs[idx].image = trimmed;
        saveExprs();
        wardrobeRenderExpressions();
        showBubble(trimmed ? '表情链接已设置！' : '已清除', 2000);
      };
    });

    // 删除
    container.querySelectorAll('.sp-wardrobe-expr-delete').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.idx);
        getExprs().splice(idx, 1);
        saveExprs();
        wardrobeRenderExpressions();
      };
    });
  }


  function wardrobeBindDrag() {
    const header = document.getElementById('sp-wardrobe-header');
    const modal = document.getElementById('sp-wardrobe-modal');
    if (!header || !modal) return;

    let dragging = false, offX = 0, offY = 0;

    const down = (e) => {
      if (e.target.closest('#sp-wardrobe-close')) return;
      dragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const rect = modal.getBoundingClientRect();
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
      x = Math.max(0, Math.min(window.innerWidth - modal.offsetWidth, x));
      y = Math.max(0, Math.min(window.innerHeight - modal.offsetHeight, y));
      modal.style.left = x + 'px';
      modal.style.top = y + 'px';
    };
    const up = () => { dragging = false; };

    header.addEventListener('mousedown', down);
    header.addEventListener('touchstart', down, { passive: true });
    document.addEventListener('mousemove', move);
    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('mouseup', up);
    document.addEventListener('touchend', up);
  }

  // ============================================================
  // 👗 服装系统辅助函数
  // ============================================================

  // 获取当前穿着的服装对象
  function getCurrentOutfit() {
    if (!settings.houseCurrentOutfit || !settings.houseOutfits) return null;
    return settings.houseOutfits.find(o => o.name === settings.houseCurrentOutfit) || null;
  }

  // 获取当前小屋应显示的立绘（服装优先，没有则用全局默认）
  function getHouseCharacterImage() {
    const outfit = getCurrentOutfit();
    return (outfit && outfit.character) || settings.houseCharacter || '';
  }

  // 获取当前动作立绘（action: 'Feed' | 'Bath' | 'Sleep'）
  function getHouseActionImage(action) {
    const outfit = getCurrentOutfit();
    const outfitKey = `action${action}`;
    const settingsKey = `houseAction${action}`;
    return (outfit && outfit[outfitKey]) || settings[settingsKey] || '';
  }

  // 获取当前表情立绘列表（服装优先，没有则用全局）
  function getHouseExpressions() {
    const outfit = getCurrentOutfit();
    if (outfit && outfit.expressions && outfit.expressions.length > 0) {
      return outfit.expressions;
    }
    return settings.houseExpressions || [];
  }

  // ============================================================
  // 小屋表情关键词匹配
  // ============================================================
  function matchHouseExpression(text) {
    const exprs = getHouseExpressions();
    if (!exprs || exprs.length === 0) return null;
    if (!text) return null;

    const lowerText = text.toLowerCase();

    // 遍历所有表情，按配置顺序，返回第一个匹配的
    for (const expr of exprs) {
      if (!expr.keywords || !expr.image) continue;
      const keywords = expr.keywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
      for (const kw of keywords) {
        if (lowerText.includes(kw)) {
          return expr;
        }
      }
    }

    return null;
  }

  function renderHousePanel() {
    document.getElementById('silly-pet-house')?.remove();

    const house = document.createElement('div');
    house.id = 'silly-pet-house';
    house.style.zIndex = '2147483646';
    house.innerHTML = `
      <div id="sp-house-header">
        <span>🏠 ${settings.petName || '咪噗'}的小屋</span>
        <div style="display:flex;gap:6px;">
          <button id="sp-house-minimize" style="background:none;border:none;font-size:14px;cursor:pointer;color:#aaa;" title="缩小悬挂">─</button>
          <button id="sp-house-close" style="background:none;border:none;font-size:16px;cursor:pointer;color:#aaa;" title="关闭">✕</button>
        </div>
      </div>
      <div id="sp-house-scene">
        <div id="sp-house-bg-layer"></div>
        <div id="sp-house-char-layer"></div>
        <div id="sp-house-actions" style="position:absolute;top:10px;right:10px;z-index:4;display:flex;flex-direction:column;gap:6px;">
          <button id="sp-house-feed-btn" style="width:36px;height:36px;border-radius:50%;border:${settings.houseButtonFeed ? 'none' : '1px solid rgba(255,255,255,0.3)'};background:${settings.houseButtonFeed ? 'transparent' : 'rgba(0,0,0,0.4)'};backdrop-filter:${settings.houseButtonFeed ? 'none' : 'blur(4px)'};cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;overflow:hidden;padding:0;" title="喂食">${settings.houseButtonFeed ? `<img src="${settings.houseButtonFeed}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />` : '🍖'}</button>
          <button id="sp-house-bath-btn" style="width:36px;height:36px;border-radius:50%;border:${settings.houseButtonBath ? 'none' : '1px solid rgba(255,255,255,0.3)'};background:${settings.houseButtonBath ? 'transparent' : 'rgba(0,0,0,0.4)'};backdrop-filter:${settings.houseButtonBath ? 'none' : 'blur(4px)'};cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;overflow:hidden;padding:0;" title="洗澡">${settings.houseButtonBath ? `<img src="${settings.houseButtonBath}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />` : '🛁'}</button>
          <button id="sp-house-sleep-btn" style="width:36px;height:36px;border-radius:50%;border:${settings.houseButtonSleep ? 'none' : '1px solid rgba(255,255,255,0.3)'};background:${settings.houseButtonSleep ? 'transparent' : 'rgba(0,0,0,0.4)'};backdrop-filter:${settings.houseButtonSleep ? 'none' : 'blur(4px)'};cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;overflow:hidden;padding:0;" title="睡觉">${settings.houseButtonSleep ? `<img src="${settings.houseButtonSleep}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />` : '🛏️'}</button>
          <button id="sp-house-wardrobe-btn" style="width:36px;height:36px;border-radius:50%;border:${settings.houseButtonWardrobe ? 'none' : '1px solid rgba(255,255,255,0.3)'};background:${settings.houseButtonWardrobe ? 'transparent' : 'rgba(0,0,0,0.4)'};backdrop-filter:${settings.houseButtonWardrobe ? 'none' : 'blur(4px)'};cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;overflow:hidden;padding:0;" title="更衣">${settings.houseButtonWardrobe ? `<img src="${settings.houseButtonWardrobe}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />` : '👗'}</button>
        </div>
        <div id="sp-house-dialogue-overlay">
          <div id="sp-house-dialogue-box">
            <div id="sp-house-char-name"><span id="sp-house-avatar"></span><span id="sp-house-name-text">${settings.petName || '咪噗'}</span><button id="sp-house-expand-btn" style="margin-left:auto;background:none;border:none;font-size:12px;cursor:pointer;color:rgba(255,255,255,0.5);padding:2px 6px;border-radius:4px;transition:all 0.2s;" title="展开/收起对话">▼</button></div>
            <div id="sp-house-dialogue-text"></div>
          </div>
        <div id="sp-house-input-area">
          <button id="sp-house-regen-btn" title="重新生成上一条回复" style="overflow:hidden;padding:0;${settings.houseButtonRegen ? 'background:transparent;border:none;backdrop-filter:none;' : ''}">${settings.houseButtonRegen ? `<img src="${settings.houseButtonRegen}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />` : '🔄'}</button>
          <input type="text" id="sp-house-input-field" placeholder="请输入你想对${settings.petName || '他'}说的话..." />
          <button id="sp-house-send-btn" title="发送" style="overflow:hidden;padding:0;${settings.houseButtonSend ? 'background:transparent;border:none;backdrop-filter:none;' : ''}">${settings.houseButtonSend ? `<img src="${settings.houseButtonSend}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />` : '➤'}</button>
        </div>
        </div>
      </div>
    `;
    document.body.appendChild(house);

// 绑定事件
document.getElementById('sp-house-close').onclick = () => toggleHouse();
document.getElementById('sp-house-feed-btn').onclick = () => {
  const quickKey = 'quickFeed';
  const category = 'food';
  // 延迟切换立绘，等物品使用完成后才播放
  useInventoryItem(category, quickKey, (item, restoreAmount) => {
    // 切换立绘
    const feedActionImg = getHouseActionImage('Feed');
    if (feedActionImg) {
      const charLayer = document.getElementById('sp-house-char-layer');
      if (charLayer) charLayer.innerHTML = `<img src="${feedActionImg}" alt="喂食" />`;
      setTimeout(() => updateHouseScene(), 3000);
    }

    if (settings.foodImage) showInteractionItem(settings.foodImage);
    state.hunger = Math.min(100, state.hunger + restoreAmount);
    state.lastFed = Date.now();
    state.totalInteractions++;
    const actionSprite = settings.spriteEat || settings.spriteHappy;
    if (actionSprite) {
      const dur = (settings.spriteDurations && settings.spriteDurations.spriteEat) || 2000;
      setSpriteWithLock('eat', actionSprite, dur);
    }
    showBubble(settings.reactions.feed, 3000);
    updateMood(); updateStatusBars(); saveData(); checkAchievements();
  });
};
document.getElementById('sp-house-bath-btn').onclick = () => {
  const quickKey = 'quickClean';
  const category = 'clean';
  useInventoryItem(category, quickKey, (item, restoreAmount) => {
    // 切换立绘
    const bathActionImg = getHouseActionImage('Bath');
    if (bathActionImg) {
      const charLayer = document.getElementById('sp-house-char-layer');
      if (charLayer) charLayer.innerHTML = `<img src="${bathActionImg}" alt="洗澡" />`;
      setTimeout(() => updateHouseScene(), 3000);
    }

    if (settings.bathImage) showInteractionItem(settings.bathImage);
    state.cleanliness = Math.min(100, state.cleanliness + restoreAmount);
    state.lastBathed = Date.now();
    state.totalInteractions++;
    if (settings.spriteBath) {
      const dur = (settings.spriteDurations && settings.spriteDurations.spriteBath) || 2500;
      setSpriteWithLock('bath', settings.spriteBath, dur);
    }
    showBubble(settings.reactions.bath, 3000);
    updateMood(); updateStatusBars(); saveData(); checkAchievements();
  });
};
document.getElementById('sp-house-sleep-btn').onclick = () => {
  const quickKey = 'quickEnergy';
  const category = 'energy';
  useInventoryItem(category, quickKey, (item, restoreAmount) => {
    // 切换立绘
    const sleepActionImg = getHouseActionImage('Sleep');
    if (sleepActionImg) {
      const charLayer = document.getElementById('sp-house-char-layer');
      if (charLayer) charLayer.innerHTML = `<img src="${sleepActionImg}" alt="睡觉" />`;
      setTimeout(() => updateHouseScene(), 5000);
    }

    if (settings.bedImage) showInteractionItem(settings.bedImage);
    state.energy = Math.min(100, state.energy + restoreAmount);
    state.lastSlept = Date.now();
    state.totalInteractions++;
    if (settings.spriteSleep) {
      const dur = (settings.spriteDurations && settings.spriteDurations.spriteSleep) || 8000;
      setSpriteWithLock('sleep', settings.spriteSleep, dur);
    }
    showBubble(settings.reactions.sleep, 4000);
    updateMood(); updateStatusBars(); saveData(); checkAchievements();
  });
};

    document.getElementById('sp-house-wardrobe-btn').onclick = (e) => {
      e.stopPropagation();
      toggleWardrobeQuick();
    };

    document.getElementById('sp-house-expand-btn').onclick = () => {
      const box = document.getElementById('sp-house-dialogue-box');
      const btn = document.getElementById('sp-house-expand-btn');
      if (!box || !btn) return;
      const expanded = box.classList.toggle('sp-house-dialogue-expanded');
      btn.textContent = expanded ? '▲' : '▼';
      btn.style.color = expanded ? 'rgba(100,180,255,0.8)' : 'rgba(255,255,255,0.5)';
    };
    document.getElementById('sp-house-minimize').onclick = () => {
      const panel = document.getElementById('silly-pet-house');
      if (!panel) return;
      panel.classList.toggle('sp-house-minimized');
      const minBtn = document.getElementById('sp-house-minimize');
      if (minBtn) minBtn.textContent = panel.classList.contains('sp-house-minimized') ? '□' : '─';
    };

    document.getElementById('sp-house-send-btn').onclick = () => {
      const input = document.getElementById('sp-house-input-field');
      const text = input?.value?.trim();
      if (!text) return;
      input.value = '';
      sendHouseMessage(text);
    };

    document.getElementById('sp-house-regen-btn').onclick = async () => {
      // 找最后一条桌宠回复并删除
      const lastAssistantIdx = state.petChatHistory.map(m => m.role).lastIndexOf('assistant');
      if (lastAssistantIdx < 0) {
        showBubble('没有可以重新生成的回复', 2000);
        return;
      }
      state.petChatHistory = state.petChatHistory.slice(0, lastAssistantIdx);
      saveDataImmediate('小屋重新生成');

      // 显示思考中
      const dialogueText = document.getElementById('sp-house-dialogue-text');
      if (dialogueText) {
        dialogueText.classList.remove('sp-house-typing-done');
        dialogueText.innerHTML = '<span class="sp-thinking-dots">●●●</span>';
      }

      if (settings.spriteThink) setSpriteWithLock('think', settings.spriteThink, null);

      const prevOffline = isOfflineMode;
      isOfflineMode = true;
      const reply = await callPetAPI('chat', '');
      isOfflineMode = prevOffline;

      if (spriteStateLock === 'think') clearSpriteLock();

      if (reply) {
        state.petChatHistory.push({ role: 'assistant', content: reply, timestamp: Date.now() });
        saveData();

        const matched = matchHouseExpression(reply);
        const charLayer = document.getElementById('sp-house-char-layer');
        if (charLayer) {
          if (matched && matched.image) {
            charLayer.innerHTML = `<img src="${matched.image}" alt="${matched.name || ''}" />`;
          } else if (settings.houseCharacter) {
            charLayer.innerHTML = `<img src="${settings.houseCharacter}" alt="立绘" />`;
          }
        }

        if (dialogueText) {
          typewriterEffect(dialogueText, reply, (matched) => {
            const charLayer = document.getElementById('sp-house-char-layer');
            if (charLayer && matched.image) {
              charLayer.innerHTML = `<img src="${matched.image}" alt="${matched.name || ''}" />`;
            }
          });
        }

        showBubble(reply.slice(0, 50) + (reply.length > 50 ? '…' : ''), 4000);
      } else {
        if (dialogueText) {
          dialogueText.innerHTML = '';
          dialogueText.textContent = '呜…重新生成失败了…';
          dialogueText.classList.add('sp-house-typing-done');
        }
      }
    };

    document.getElementById('sp-house-input-field').onkeydown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.getElementById('sp-house-send-btn').click();
      }
    };

    updateHouseScene();
    bindHouseDrag();
  }

  function updateHouseScene() {
    const bgLayer = document.getElementById('sp-house-bg-layer');
    const charLayer = document.getElementById('sp-house-char-layer');
    if (bgLayer) {
      if (settings.houseBackground) {
        bgLayer.style.backgroundImage = `url(${settings.houseBackground})`;
      } else {
        bgLayer.style.backgroundImage = 'none';
      }
    }
    if (charLayer) {
      const charImg = getHouseCharacterImage();
      if (charImg) {
        charLayer.innerHTML = `<img src="${charImg}" alt="立绘" />`;
      } else {
        charLayer.innerHTML = `<span style="font-size:64px;">🐱</span>`;
      }
    }


    const avatarEl = document.getElementById('sp-house-avatar');
    if (avatarEl) {
      if (settings.houseCharacterAvatar) {
        avatarEl.innerHTML = `<img src="${settings.houseCharacterAvatar}" alt="头像" />`;
        avatarEl.style.background = 'none';
        avatarEl.style.border = 'none';
      } else {
        avatarEl.textContent = '🗣️';
        avatarEl.style.background = 'rgba(255,255,255,0.1)';
        avatarEl.style.border = '1px solid rgba(255,255,255,0.2)';
      }
    }

  }

  function renderHouseChatHistory() {
    const lastReply = [...state.petChatHistory].reverse().find(m => m.role === 'assistant');
    const dialogueText = document.getElementById('sp-house-dialogue-text');
    if (!dialogueText) return;

    if (lastReply) {
      // 匹配最后一个关键词对应的表情（遍历全文，取最后匹配的）
      const charLayer = document.getElementById('sp-house-char-layer');
      if (charLayer) {
        let finalExpr = null;
        const exprs = getHouseExpressions();
        if (exprs && exprs.length > 0) {
          const lowerText = lastReply.content.toLowerCase();
          for (const expr of exprs) {

            if (!expr.keywords || !expr.image) continue;
            const keywords = expr.keywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
            for (const kw of keywords) {
              if (lowerText.includes(kw)) {
                finalExpr = expr;
              }
            }
          }
        }
        if (finalExpr && finalExpr.image) {
          charLayer.innerHTML = `<img src="${finalExpr.image}" alt="${finalExpr.name || ''}" />`;
        } else if (settings.houseCharacter) {
          charLayer.innerHTML = `<img src="${settings.houseCharacter}" alt="立绘" />`;
        }
      }

      // 直接显示完整内容，不走打字机
      dialogueText.innerHTML = renderMarkdown(lastReply.content);
      dialogueText.classList.add('sp-house-typing-done');
      dialogueText.scrollTop = dialogueText.scrollHeight;
    } else {
      dialogueText.textContent = '主人来看我啦～有什么想说的吗？';
      dialogueText.classList.add('sp-house-typing-done');
    }
  }


  function typewriterEffect(element, text, onKeywordMatch) {
    element.innerHTML = '';
    element.classList.remove('sp-house-typing-done');
    let idx = 0;
    let currentText = '';
    let lastMatchedExpr = null;
    const interval = setInterval(() => {
      if (idx < text.length) {
        currentText += text[idx];
        element.innerHTML = renderMarkdown(currentText);
        element.scrollTop = element.scrollHeight;
        idx++;

        // 实时关键词匹配：每打出一个字就检测当前已输出文本
        if (onKeywordMatch && getHouseExpressions().length > 0) {
          const matched = matchHouseExpression(currentText);
          if (matched && matched !== lastMatchedExpr) {
            lastMatchedExpr = matched;
            onKeywordMatch(matched);
          }
        }
      } else {
        clearInterval(interval);
        element.classList.add('sp-house-typing-done');
      }
    }, 50);
  }


  async function sendHouseMessage(text) {
    state.petChatHistory.push({ role: 'user', content: text, timestamp: Date.now() });
    saveData();

    // 显示思考中
    const dialogueText = document.getElementById('sp-house-dialogue-text');
    if (dialogueText) {
      dialogueText.textContent = '';
      dialogueText.innerHTML = '<span class="sp-thinking-dots">●●●</span>';
    }

    if (settings.spriteThink) setSpriteWithLock('think', settings.spriteThink, null);

    // 临时开启线下模式让提示词注入 offlinePrompt
    const prevOffline = isOfflineMode;
    isOfflineMode = true;
    const reply = await callPetAPI('chat', text);
    isOfflineMode = prevOffline;

    if (spriteStateLock === 'think') clearSpriteLock();

    if (reply) {
      state.petChatHistory.push({ role: 'assistant', content: reply, timestamp: Date.now() });
      saveData();

      // 关键词匹配切换立绘
      const matched = matchHouseExpression(reply);
      const charLayer = document.getElementById('sp-house-char-layer');
      if (charLayer) {
        if (matched && matched.image) {
          charLayer.innerHTML = `<img src="${matched.image}" alt="${matched.name || ''}" />`;
        } else if (settings.houseCharacter) {
          charLayer.innerHTML = `<img src="${settings.houseCharacter}" alt="立绘" />`;
        }
      }

      // 打字机效果（实时关键词切换立绘）
      if (dialogueText) {
        typewriterEffect(dialogueText, reply, (matched) => {
          const charLayer = document.getElementById('sp-house-char-layer');
          if (charLayer && matched.image) {
            charLayer.innerHTML = `<img src="${matched.image}" alt="${matched.name || ''}" />`;
          }
        });
      }

      showBubble(reply.slice(0, 50) + (reply.length > 50 ? '…' : ''), 4000);
    } else {
      if (dialogueText) {
        dialogueText.innerHTML = '';
        dialogueText.textContent = '呜…没听到回应…检查一下API？';
      }
    }
  }

  function bindHouseDrag() {
    const header = document.getElementById('sp-house-header');
    const panel = document.getElementById('silly-pet-house');
    if (!header || !panel) return;

    let dragging = false, offX = 0, offY = 0;

    const down = (e) => {
      if (e.target.closest('#sp-house-close') || e.target.closest('#sp-house-minimize')) return;
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
    }

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
      checkAchievements();
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
              <div class="sp-section-title">☁️ GitHub 图片托管</div>
              <p style="font-size:11px;color:#999;margin-bottom:8px;">将 base64 图片上传到 GitHub 仓库，释放本地存储空间。<br/>需要 Personal Access Token（权限需包含 repo）</p>
              <label>GitHub Token</label>
              <input type="password" id="sp-github-token" value="${settings.githubToken || ''}" placeholder="ghp_xxxxxxxxxxxx" />
              <label>仓库（格式: 用户名/仓库名）</label>
              <input type="text" id="sp-github-repo" value="${settings.githubRepo || ''}" placeholder="myname/meep-images" />
              <label>分支</label>
              <input type="text" id="sp-github-branch" value="${settings.githubBranch || 'main'}" placeholder="main" />
              <label>存储路径</label>
              <input type="text" id="sp-github-path" value="${settings.githubPath || 'meep-images'}" placeholder="meep-images" />
              <div class="sp-row" style="margin-top:8px;">
                <button class="sp-btn sp-btn-primary" id="sp-github-migrate" type="button">☁️ 一键迁移所有图片</button>
              </div>
              <p style="font-size:10px;color:#666;margin-top:6px;">迁移后所有 base64 图片会替换为 CDN 链接，大幅节省本地空间</p>
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
                  <p style="font-size:12px;color:#ccc;line-height:1.7;margin-bottom:8px;">所有数据存储在本地浏览器 IndexedDB 中。</p>
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
                  <p style="font-size:11px;color:#999;margin-top:4px;">• 如果浏览器卡顿请及时备份迁移数据 <br/>• 在「💾 数据」底部的「状态总览」可以看到当前存储占用<br/>• 上传了大量精灵图/表情包时容易接近上限<br/>• 快满时会自动提醒，建议导出备份后清理旧图片</p>
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
      // IndexedDB 无法同步读取大小，用总数据估算
      const myData = JSON.stringify({ settings, state });
      const mySize = myData.length * 2;

      return {
        totalBytes: total,
        myBytes: mySize,
        maxBytes: 100 * 1024 * 1024, // 改为 100MB
        totalKB: (total / 1024).toFixed(1),
        myKB: (mySize / 1024).toFixed(1),
        maxKB: (100 * 1024).toFixed(0), // 这里也改
        percent: Math.min(100, (total / (100 * 1024 * 1024) * 100)).toFixed(1), // 这里也改
        myPercent: Math.min(100, (mySize / (100 * 1024 * 1024) * 100)).toFixed(1), // 这里也改
      };
    } catch (e) {
      return { totalBytes: 0, myBytes: 0, maxBytes: 100 * 1024 * 1024, totalKB: '0', myKB: '0', maxKB: '102400', percent: '0', myPercent: '0' };
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
      ['menuIconGame', '游戏 🎮'],
      ['menuIconHouse', '小屋 🏠'],
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
  // 小屋表情立绘管理（设置面板）
  // ============================================================
  function renderHouseExpressionSettings() {
    const container = document.getElementById('sp-house-expressions-list');
    if (!container) return;

    if (!settings.houseExpressions) settings.houseExpressions = [];

    container.innerHTML = '';
    settings.houseExpressions.forEach((expr, idx) => {
      const div = document.createElement('div');
      div.className = 'sp-custom-sprite-item';
      div.innerHTML = `
        <div class="sp-custom-sprite-preview" data-house-expr-idx="${idx}">
          ${expr.image ? `<img src="${expr.image}" alt="${expr.name || ''}" />` : '<span class="sp-upload-placeholder">＋</span>'}
        </div>
        <div class="sp-custom-sprite-info">
          <input type="text" class="sp-house-expr-name" data-idx="${idx}" value="${expr.name || ''}" placeholder="表情名（如：笑）" style="margin-bottom:4px;" />
          <input type="text" class="sp-house-expr-keywords" data-idx="${idx}" value="${expr.keywords || ''}" placeholder="关键词（逗号分隔，如：笑,开心,哈哈）" />
          <div class="sp-custom-sprite-actions" style="margin-top:6px;">
            <button class="sp-btn sp-house-expr-upload" data-idx="${idx}" type="button">📁 图片</button>
            <button class="sp-btn sp-house-expr-url" data-idx="${idx}" type="button">🔗 链接</button>
            <button class="sp-btn sp-btn-danger sp-house-expr-delete" data-idx="${idx}" type="button">✕</button>
            <input type="file" class="sp-house-expr-file" data-idx="${idx}" accept="image/png,image/jpeg,image/gif,image/webp" style="display:none;" />
          </div>
        </div>
      `;
      container.appendChild(div);
    });

    bindHouseExpressionEvents();
  }

  function bindHouseExpressionEvents() {
    // 名称编辑
    document.querySelectorAll('.sp-house-expr-name').forEach(input => {
      input.onchange = () => {
        const idx = parseInt(input.dataset.idx);
        if (settings.houseExpressions[idx]) {
          settings.houseExpressions[idx].name = input.value.trim();
          saveDataDebounced('小屋表情名称');
        }
      };
    });

    // 关键词编辑
    document.querySelectorAll('.sp-house-expr-keywords').forEach(input => {
      input.onchange = () => {
        const idx = parseInt(input.dataset.idx);
        if (settings.houseExpressions[idx]) {
          settings.houseExpressions[idx].keywords = input.value.trim();
          saveDataDebounced('小屋表情关键词');
        }
      };
    });

    // 预览区点击上传
    document.querySelectorAll('[data-house-expr-idx]').forEach(preview => {
      preview.onclick = () => {
        const idx = parseInt(preview.dataset.houseExprIdx);
        const fileInput = document.querySelector(`.sp-house-expr-file[data-idx="${idx}"]`);
        if (fileInput) fileInput.click();
      };
    });

    // 上传按钮
    document.querySelectorAll('.sp-house-expr-upload').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.idx);
        const fileInput = document.querySelector(`.sp-house-expr-file[data-idx="${idx}"]`);
        if (fileInput) fileInput.click();
      };
    });

    // 文件选择
    document.querySelectorAll('.sp-house-expr-file').forEach(input => {
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { showBubble('图片超过2MB了～', 3000); return; }
        const idx = parseInt(input.dataset.idx);
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const compressed = await compressImage(ev.target.result, 400, 0.75);
          if (settings.houseExpressions[idx]) {
            settings.houseExpressions[idx].image = compressed;
            saveDataImmediate('小屋表情图片');
            renderHouseExpressionSettings();
            showBubble('表情立绘设置好啦～', 2000);
          }
        };
        reader.readAsDataURL(file);
        input.value = '';
      };
    });

    // 链接输入
    document.querySelectorAll('.sp-house-expr-url').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.idx);
        if (!settings.houseExpressions[idx]) return;
        const current = settings.houseExpressions[idx].image || '';
        const url = prompt(
          `设置第 ${idx + 1} 个表情的图片链接（支持 GIF）：\n留空确认 = 清除`,
          current.startsWith('http') ? current : ''
        );
        if (url === null) return;
        const trimmed = url.trim();
        if (trimmed && !trimmed.startsWith('http')) {
          showBubble('链接需要以 http 开头', 3000);
          return;
        }
        settings.houseExpressions[idx].image = trimmed;
        saveDataImmediate('小屋表情图片链接');
        renderHouseExpressionSettings();showBubble(trimmed ? '表情链接已设置！' : '已清除', 2000);
      };
    });

    // 删除
    document.querySelectorAll('.sp-house-expr-delete').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.idx);
        settings.houseExpressions.splice(idx, 1);
        saveDataImmediate('删除小屋表情');
        renderHouseExpressionSettings();
      };
    });
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
          state.petChatHistory.push({ role: 'assistant', content: reply, timestamp: Date.now() });
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
      btn.addEventListener('click', (e) => { e.stopPropagation(); if (!isMenuOpen) return; if (Date.now() - menuOpenTime < 300) return; handleMenuAction(btn.dataset.action); });
      btn.addEventListener('touchend', (e) => { e.stopPropagation(); e.preventDefault(); if (!isMenuOpen) return; if (Date.now() - menuOpenTime < 300) return; handleMenuAction(btn.dataset.action); });
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

    document.getElementById('sp-github-migrate')?.addEventListener('click', () => {
      if (!settings.githubToken || !settings.githubRepo) {
        showBubble('请先填写 GitHub Token 和仓库地址', 3000);
        return;
      }
      showConfirmDialog({
        title: '☁️ 一键迁移图片到 GitHub？',
        desc: '将所有本地 base64 图片上传到你的 GitHub 仓库，<br/>并自动替换为 CDN 链接。<br/><br/>⚠️ 请确保 Token 有 repo 权限且仓库已创建。<br/>过程可能需要几分钟。',
        confirmText: '开始迁移',
        cancelText: '取消',
        onConfirm: () => {
          migrateImagesToGithub();
        }
      });
    });

    // 导入导出
document.getElementById('sp-export')?.addEventListener('click', async () => {
  await idbSet(STORAGE_KEY, { settings, state }).catch(() => {});
  exportData();
});
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
      // 清除 IndexedDB 存储
      idbSet(STORAGE_KEY, null).catch(() => {});
      localStorage.removeItem(STORAGE_KEY); // 顺便清旧的

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
    settings.githubToken = v('sp-github-token');
    settings.githubRepo = v('sp-github-repo');
    settings.githubBranch = v('sp-github-branch') || 'main';
    settings.githubPath = v('sp-github-path') || 'meep-images';

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
        <button class="sp-btn sp-upload-url-btn" data-key="${key}" type="button">🔗 链接</button>
        <input type="file" id="sp-file-${key}" data-key="${key}" accept="image/png,image/jpeg,image/gif,image/webp" />
      </div>
      <div class="sp-duration-row">
        <span class="sp-duration-label">⏱️ <span class="sp-duration-val" data-key="${key}">${(duration/1000).toFixed(1)}s</span></span>
        <input type="range" class="sp-duration-slider" data-key="${key}" min="500" max="10000" step="500" value="${duration}" />
      </div>
      <div class="sp-upload-hint">PNG/JPG/GIF(动图)/WebP 2MB内· 或粘贴链接</div>
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
        let processed;
        if (key === 'houseBackground' || key === 'houseCharacter' || key.startsWith('houseAction') || key.startsWith('houseButton')) {
          processed = ev.target.result; // 小屋相关图片不压缩
        } else {
          processed = await compressImage(ev.target.result, 200, 0.7);
        }
        setSettingsImage(key, processed);
        updateUploadPreview(key, processed);
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

  // 链接输入按钮
  document.querySelectorAll('#silly-pet-settings .sp-upload-url-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      const key = btn.dataset.key;
      //读取当前值（区分 mood/menuIcon 等特殊 key）
      let currentVal = '';
      if (key.startsWith('mood')) {
        const moodKey = key.replace('mood', '').toLowerCase();
        currentVal = (settings.moodImages && settings.moodImages[moodKey]) || '';
      } else if (key.startsWith('menuIcon')) {
        const actionKey = key.replace('menuIcon', '').toLowerCase();
        currentVal = (settings.menuIcons && settings.menuIcons[actionKey]) || '';
      } else {
        currentVal = settings[key] || '';
      }
      const url = prompt(
        '输入图片链接（支持 GIF 动图）：\n留空并确认 = 清除当前图片',
        currentVal.startsWith('http') ? currentVal : ''
      );
      if (url === null) return; // 点了取消
      const trimmed = url.trim();
      if (trimmed && !trimmed.startsWith('http')) {
        showBubble('链接需要以 http 开头', 3000);
        return;
      }
      setSettingsImage(key, trimmed);
      updateUploadPreview(key, trimmed);
      updateSpriteImage();
      updateMoodDisplay();
      saveData();
      showBubble(trimmed ? '图片链接已设置！' : '已清除图片', 2000);
    };
  });

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
  } else if (key.startsWith('houseAction') || key.startsWith('houseButton')) {
    settings[key] = value;
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
  // 👇 新增：如果是小屋图片，刷新小屋场景
  if (key === 'houseBackground' || key === 'houseCharacter' || key === 'houseCharacterAvatar') {
    updateHouseScene();
  }

  // 👇 新增：如果是小屋按钮图标，刷新按钮显示
  if (key === 'houseButtonFeed' || key === 'houseButtonBath' || key === 'houseButtonSleep' || key === 'houseButtonWardrobe') {
    const _btnIdMap = { houseButtonFeed: 'sp-house-feed-btn', houseButtonBath: 'sp-house-bath-btn', houseButtonSleep: 'sp-house-sleep-btn', houseButtonWardrobe: 'sp-house-wardrobe-btn' };
    const _emojiMap = { houseButtonFeed: '🍖', houseButtonBath: '🛁', houseButtonSleep: '🛏️', houseButtonWardrobe: '👗' };
    const _btnEl = document.getElementById(_btnIdMap[key]);
    if (_btnEl) {
      if (dataUrl) {
        _btnEl.innerHTML = `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`;
        _btnEl.style.border = 'none';
        _btnEl.style.background = 'transparent';
        _btnEl.style.backdropFilter = 'none';
      } else {
        _btnEl.innerHTML = _emojiMap[key];
        _btnEl.style.border = '1px solid rgba(255,255,255,0.3)';
        _btnEl.style.background = 'rgba(0,0,0,0.4)';
        _btnEl.style.backdropFilter = 'blur(4px)';
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
  // IndexedDB 写入是异步的，beforeunload 无法保证完成
  // 用 localStorage 做一次同步备份保证最后状态不丢
  try {
    localStorage.setItem(STORAGE_KEY + '_backup', JSON.stringify({
      lastOnlineTimestamp: state.lastOnlineTimestamp,
      hunger: state.hunger,
      cleanliness: state.cleanliness,
      energy: state.energy,
    }));
  } catch(e) {}
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
    // 菜单打开时重算方向
    if (isMenuOpen) {
      updateMenuPositions();
    }
  });

  // ============================================================
  // 🎮 合成小游戏模块 - MeepMerge
  // ============================================================

  // ===== 游戏常量 =====
  const GAME_BOARD_SIZE = 6;
  const GAME_BOARD_CELLS = 48;
  const GAME_STAMINA_RECOVER_INTERVAL = 5 * 60 * 1000; // 8分钟恢复1点
  const GAME_STAMINA_RECOVER_AMOUNT = 1;
  const GAME_MAX_CHAIN_LEVEL = 8;

  // 三条合成链定义
  const GAME_CHAINS = {
    toy: {
      name: '🧶 玩具链',
      items: [
        { level: 1, emoji: '🧶', name: '线团', sell: 1 },
        { level: 2, emoji: '🐭', name: '逗猫棒', sell: 2 },
        { level: 3, emoji: '🧸', name: '毛绒小熊', sell: 5 },
        { level: 4, emoji: '🎮', name: '复古掌机', sell: 11 },
        { level: 5, emoji: '🏰', name: '黄金猫爬架', sell: 25 },
        { level: 6, emoji: '⚡', name: '魔法逗猫激光', sell: 55 },
        { level: 7, emoji: '🎡', name: '猫咪游乐园', sell: 120 },
        { level: 8, emoji: '🚀', name: '传说喵星飞船', sell: 280 },
      ]
    },
    food: {
      name: '🍪 零食链',
      items: [
        { level: 1, emoji: '🌾', name: '面粉', sell: 1 },
        { level: 2, emoji: '🍞', name: '面包', sell: 2 },
        { level: 3, emoji: '🍰', name: '草莓蛋糕', sell: 5 },
        { level: 4, emoji: '🍬', name: '豪华糖果罐', sell: 11 },
        { level: 5, emoji: '🧪', name: '极品猫薄荷', sell: 25 },
        { level: 6, emoji: '🧁', name: '星空马卡龙塔', sell: 55 },
        { level: 7, emoji: '🍵', name: '梦幻下午茶', sell: 120 },
        { level: 8, emoji: '🍖', name: '传说永恒盛宴', sell: 280 },
      ]
    },
    gem: {
      name: '💎 宝石链',
      items: [
        { level: 1, emoji: '✨', name: '碎晶', sell: 1 },
        { level: 2, emoji: '🔮', name: '魔法水晶', sell: 2 },
        { level: 3, emoji: '💍', name: '灵力戒指', sell: 5 },
        { level: 4, emoji: '👑', name: '璀璨王冠', sell: 11 },
        { level: 5, emoji: '🐉', name: '龙之心宝石', sell: 25 },
        { level: 6, emoji: '📖', name: '星辰宝典', sell: 55 },
        { level: 7, emoji: '🌀', name: '时空魔法阵', sell: 120 },
        { level: 8, emoji: '💎', name: '传说哲人之石', sell: 280 },
      ]
    },
    potion: {
      name: '🧪 药剂链',
      items: [
        { level: 1, emoji: '🌿', name: '杂草', sell: 1 },
        { level: 2, emoji: '🍀', name: '四叶草', sell: 2 },
        { level: 3, emoji: '🧪', name: '初级药水', sell: 5 },
        { level: 4, emoji: '⚗️', name: '炼金溶液', sell: 11 },
        { level: 5, emoji: '🪄', name: '魔法精华', sell: 25 },
        { level: 6, emoji: '🌟', name: '星尘凝露', sell: 55 },
        { level: 7, emoji: '🔥', name: '凤凰之泪', sell: 120 },
        { level: 8, emoji: '💫', name: '传说万灵药', sell: 280 },
      ]
    },
    music: {
      name: '🎵 音律链',
      items: [
        { level: 1, emoji: '🔔', name: '小铃铛', sell: 1 },
        { level: 2, emoji: '🎶', name: '音符碎片', sell: 2 },
        { level: 3, emoji: '🎸', name: '迷你吉他', sell: 5 },
        { level: 4, emoji: '🎹', name: '水晶钢琴', sell: 11 },
        { level: 5, emoji: '🎺', name: '黄金号角', sell: 25 },
        { level: 6, emoji: '🎻', name: '精灵提琴', sell: 55 },
        { level: 7, emoji: '🪗', name: '梦境管风琴', sell: 120 },
        { level: 8, emoji: '🌌', name: '传说天籁交响', sell: 280 },
      ]
    },
    flower: {
      name: '🌺 花卉链',
      items: [
        { level: 1, emoji: '🌱', name: '小嫩芽', sell: 1 },
        { level: 2, emoji: '🌼', name: '雏菊', sell: 2 },
        { level: 3, emoji: '🌷', name: '郁金香', sell: 5 },
        { level: 4, emoji: '🌹', name: '红玫瑰', sell: 11 },
        { level: 5, emoji: '🪷', name: '七色莲花', sell: 25 },
        { level: 6, emoji: '💐', name: '永生花束', sell: 55 },
        { level: 7, emoji: '🌸', name: '千年樱之魂', sell: 120 },
        { level: 8, emoji: '🏵️', name: '传说世界树之花', sell: 280 },
      ]
    },
    star: {
      name: '⭐ 星辰链',
      items: [
        { level: 1, emoji: '💧', name: '露水珠', sell: 1 },
        { level: 2, emoji: '❄️', name: '霜晶', sell: 2 },
        { level: 3, emoji: '🌙', name: '月光碎片', sell: 5 },
        { level: 4, emoji: '☀️', name: '日耀石', sell: 11 },
        { level: 5, emoji: '🌠', name: '流星核心', sell: 25 },
        { level: 6, emoji: '🪐', name: '星环宝珠', sell: 55 },
        { level: 7, emoji: '🌌', name: '银河之钥', sell: 120 },
        { level: 8, emoji: '✴️', name: '传说创世星火', sell: 280 },
      ]
    },
    seasoning: {
      name: '🧂 调料链',
      items: [
        { level: 1, emoji: '🧂', name: '粗盐粒', sell: 1, seasoningId: 'salt' },
        { level: 2, emoji: '🫙', name: '酿造酱油', sell: 2, seasoningId: 'soy' },
        { level: 3, emoji: '🌶️', name: '研磨胡椒', sell: 5, seasoningId: 'pepper' },
        { level: 4, emoji: '🧈', name: '发酵黄油', sell: 11, seasoningId: 'butter' },
        { level: 5, emoji: '🍯', name: '百花蜂蜜', sell: 25, seasoningId: 'honey' },
        { level: 6, emoji: '✨', name: '秘制五香粉', sell: 55, seasoningId: 'spice' },
        { level: 7, emoji: '🫗', name: '陈年老醋', sell: 120, seasoningId: 'vinegar' },
        { level: 8, emoji: '🏺', name: '传说万味精华', sell: 280, seasoningId: 'spice' },
      ]
    },
    stamina: {
      name: '⚡ 体力链',
      items: [
        { level: 1, emoji: '💧', name: '体力露珠', sell: 1, staminaRestore: 3 },
        { level: 2, emoji: '🫧', name: '活力泡泡', sell: 2, staminaRestore: 7 },
        { level: 3, emoji: '🔋', name: '能量电池', sell: 5, staminaRestore: 16 },
        { level: 4, emoji: '⚡', name: '闪电瓶', sell: 11, staminaRestore: 35 },
        { level: 5, emoji: '🌟', name: '星辰精华', sell: 25, staminaRestore: 75 },
        { level: 6, emoji: '💥', name: '超新星核心', sell: 55, staminaRestore: 160 },
        { level: 7, emoji: '🌀', name: '永动之源', sell: 120, staminaRestore: 340 },
        { level: 8, emoji: '♾️', name: '传说无限体力', sell: 280, staminaRestore: 700 },
      ]
    }

  };

  // 商店物品定义
  const GAME_SHOP_ITEMS = {
    food: [
      { name: '小鱼干', price: 8, restore: 8, emoji: '🐟', dailyLimit: 10 },
      { name: '猫罐头', price: 20, restore: 18, emoji: '🥫', dailyLimit: 4 },
      { name: '豪华猫粮', price: 40, restore: 35, emoji: '🍗', dailyLimit: 2 },
      { name: '满汉全席', price: 80, restore: 60, emoji: '🍱', dailyLimit: 1 },
      { name: '秘制猫饭团', price: 15, restore: 14, emoji: '🍙', dailyLimit: 6 },
      { name: '鲷鱼烧点心', price: 50, restore: 42, emoji: '🥮', dailyLimit: 2 },
    ],
    clean: [
      { name: '湿纸巾', price: 8, restore: 8, emoji: '🧻', dailyLimit: 10 },
      { name: '猫咪沐浴露', price: 20, restore: 18, emoji: '🧴', dailyLimit: 4 },
      { name: '自动清洁机', price: 40, restore: 35, emoji: '🫧', dailyLimit: 2 },
      { name: 'SPA豪华套餐', price: 80, restore: 60, emoji: '🛁', dailyLimit: 1 },
      { name: '薰衣草香氛球', price: 12, restore: 12, emoji: '🪻', dailyLimit: 8 },
      { name: '温泉浴盐罐', price: 55, restore: 45, emoji: '🧪', dailyLimit: 2 },
    ],
    energy: [
      { name: '猫薄荷枕', price: 8, restore: 8, emoji: '🌿', dailyLimit: 10 },
      { name: '温暖毛毯', price: 20, restore: 18, emoji: '🧣', dailyLimit: 4 },
      { name: '舒适猫窝', price: 40, restore: 35, emoji: '🛏️', dailyLimit: 2 },
      { name: '梦境胶囊', price: 80, restore: 60, emoji: '💊', dailyLimit: 1 },
      { name: '安神小夜灯', price: 12, restore: 12, emoji: '🕯️', dailyLimit: 8 },
      { name: '星空催眠曲盒', price: 55, restore: 45, emoji: '🎶', dailyLimit: 2 },
    ]

  };

  // 体力道具商店定义
  const GAME_STAMINA_ITEMS = [
    { key: 'stamina30', name: '小能量瓶', price: 100, restore: 30, emoji: '🧃', dailyLimit: 3 },
    { key: 'stamina50', name: '中能量罐', price: 200, restore: 50, emoji: '🥤', dailyLimit: 2 },
    { key: 'stamina100', name: '满能量桶', price: 300, restore: 100, emoji: '🪫', dailyLimit: 1 },
  ];

  // 生成器产出权重（1级概率最大，等级越高概率越低）
  const GAME_SPAWN_WEIGHTS = [
    { level: 1, weight: 70 },
    { level: 2, weight: 18 },
    { level: 3, weight: 8 },
    { level: 4, weight: 3 },
    { level: 5, weight: 1 },
  ];

  // 订单模板
  const GAME_ORDER_TEMPLATES = [
    { chain: 'toy', minLevel: 2, maxLevel: 5, goldMulti: 2.0 },
    { chain: 'food', minLevel: 2, maxLevel: 5, goldMulti: 2.0 },
    { chain: 'gem', minLevel: 2, maxLevel: 5, goldMulti: 2.0 },
    { chain: 'potion', minLevel: 2, maxLevel: 5, goldMulti: 2.0 },
    { chain: 'toy', minLevel: 3, maxLevel: 6, goldMulti: 2.5 },
    { chain: 'food', minLevel: 3, maxLevel: 6, goldMulti: 2.5 },
    { chain: 'gem', minLevel: 3, maxLevel: 6, goldMulti: 2.5 },
    { chain: 'potion', minLevel: 3, maxLevel: 6, goldMulti: 2.5 },
    { chain: 'toy', minLevel: 4, maxLevel: 7, goldMulti: 3.0 },
    { chain: 'food', minLevel: 4, maxLevel: 7, goldMulti: 3.0 },
    { chain: 'gem', minLevel: 4, maxLevel: 7, goldMulti: 3.0 },
    { chain: 'potion', minLevel: 4, maxLevel: 7, goldMulti: 3.0 },
    { chain: 'toy', minLevel: 5, maxLevel: 8, goldMulti: 4.0 },
    { chain: 'food', minLevel: 5, maxLevel: 8, goldMulti: 4.0 },
    { chain: 'gem', minLevel: 5, maxLevel: 8, goldMulti: 4.0 },
    { chain: 'potion', minLevel: 5, maxLevel: 8, goldMulti: 4.0 },
    { chain: 'music', minLevel: 2, maxLevel: 5, goldMulti: 2.0 },
    { chain: 'music', minLevel: 3, maxLevel: 6, goldMulti: 2.5 },
    { chain: 'music', minLevel: 4, maxLevel: 7, goldMulti: 3.0 },
    { chain: 'music', minLevel: 5, maxLevel: 8, goldMulti: 4.0 },
    { chain: 'flower', minLevel: 2, maxLevel: 5, goldMulti: 2.0 },
    { chain: 'flower', minLevel: 3, maxLevel: 6, goldMulti: 2.5 },
    { chain: 'flower', minLevel: 4, maxLevel: 7, goldMulti: 3.0 },
    { chain: 'flower', minLevel: 5, maxLevel: 8, goldMulti: 4.0 },
    { chain: 'star', minLevel: 2, maxLevel: 5, goldMulti: 2.0 },
    { chain: 'star', minLevel: 3, maxLevel: 6, goldMulti: 2.5 },
    { chain: 'star', minLevel: 4, maxLevel: 7, goldMulti: 3.0 },
    { chain: 'star', minLevel: 5, maxLevel: 8, goldMulti: 4.0 },
    { chain: 'seasoning', minLevel: 2, maxLevel: 5, goldMulti: 2.0 },
    { chain: 'seasoning', minLevel: 3, maxLevel: 6, goldMulti: 2.5 },
    { chain: 'seasoning', minLevel: 4, maxLevel: 7, goldMulti: 3.0 },
    { chain: 'seasoning', minLevel: 5, maxLevel: 8, goldMulti: 4.0 },
  ];


  let isGameOpen = false;
  let gameSelectedCell = null; // 轻触选中模式

  // ===== 游戏体力恢复 =====
  function gameRecoverStamina() {
    const now = Date.now();
    const last = state.gameLastStaminaRecover || now;
    const elapsed = now - last;
    const ticks = Math.floor(elapsed / GAME_STAMINA_RECOVER_INTERVAL);
    if (ticks > 0 && state.gameStamina < state.gameStaminaMax) {
      state.gameStamina = Math.min(state.gameStaminaMax, state.gameStamina + ticks * GAME_STAMINA_RECOVER_AMOUNT);
      state.gameLastStaminaRecover = last + ticks * GAME_STAMINA_RECOVER_INTERVAL;
      saveDataDebounced('游戏体力恢复');
    } else if (ticks > 0 && state.gameStamina >= state.gameStaminaMax) {
      // 体力已满或溢出，不恢复，但更新时间戳防止下次累积
      state.gameLastStaminaRecover = now;
    }
  }

  // ===== 初始化游戏棋盘 =====
  function gameInitBoard() {
    if (!state.gameBoard || state.gameBoard.length !== GAME_BOARD_CELLS) {
      state.gameBoard = new Array(GAME_BOARD_CELLS).fill(null);
    }
    // 确保生成器和售卖区位置有效
    if (state.gameGeneratorPos === undefined) state.gameGeneratorPos = 0;
    if (state.gameSellPos === undefined) state.gameSellPos = GAME_BOARD_CELLS - 1;
    // 确保订单存在
    if (!state.gameOrders || state.gameOrders.length === 0) {
      state.gameOrders = gameGenerateOrders(3);
    }
    if (!state.gameCollection) state.gameCollection = [];
    if (!state.gameCustomImages) state.gameCustomImages = {};
    if (state.gameGold === undefined) state.gameGold = 0;
    if (state.gameStamina === undefined) state.gameStamina = 100;
    if (state.gameStaminaMax === undefined) state.gameStaminaMax = 100;
    if (!state.gameLastStaminaRecover) state.gameLastStaminaRecover = Date.now();
  }

  // ===== 生成随机订单 =====
  function gameGenerateOrders(count) {
    const orders = [];
    const usedKeys = new Set(); // 防止同链同级重复

    let attempts = 0;
    while (orders.length < count && attempts < 50) {
      attempts++;
      const template = GAME_ORDER_TEMPLATES[Math.floor(Math.random() * GAME_ORDER_TEMPLATES.length)];
      const level = template.minLevel + Math.floor(Math.random() * (template.maxLevel - template.minLevel + 1));
      const chainData = GAME_CHAINS[template.chain];
      const item = chainData.items[level - 1];
      if (!item) continue;

      const key = `${template.chain}_${level}`;
      if (usedKeys.has(key)) continue; // 跳过重复
      usedKeys.add(key);

      const gold = Math.round(item.sell * template.goldMulti);
      orders.push({
        chain: template.chain,
        level: level,
        name: item.name,
        emoji: item.emoji,
        reward: gold,
        id: Date.now() + Math.random()
      });
    }
    return orders;
  }

  // ===== 生成器：产出随机道具 =====
  function gameSpawnItem() {
    if (state.gameStamina < 1) {
      gameShowNotice('体力不足！等待恢复或购买睡眠用品');
      return;
    }

    // 找空格子
    const emptySlots = [];
    for (let i = 0; i < GAME_BOARD_CELLS; i++) {
      if (i === state.gameGeneratorPos || i === state.gameSellPos) continue;
      if (!state.gameBoard[i]) emptySlots.push(i);
    }
    if (emptySlots.length === 0) {
      gameShowNotice('棋盘已满！合成或售卖一些物品');
      return;
    }

    state.gameStamina -= 1;
    state.gameLastStaminaRecover = state.gameLastStaminaRecover || Date.now();

    // 加权随机等级
    const totalWeight = GAME_SPAWN_WEIGHTS.reduce((s, w) => s + w.weight, 0);
    let roll = Math.random() * totalWeight;
    let spawnLevel = 1;
    for (const w of GAME_SPAWN_WEIGHTS) {
      roll -= w.weight;
      if (roll <= 0) { spawnLevel = w.level; break; }
    }

    // 随机选择链
    const chains = ['toy', 'food', 'gem', 'potion', 'music', 'flower', 'star', 'seasoning'];
    const chain = chains[Math.floor(Math.random() * chains.length)];


    // 放到随机空格
    const targetSlot = emptySlots[Math.floor(Math.random() * emptySlots.length)];
    state.gameBoard[targetSlot] = { chain, level: spawnLevel };

    // 更新图鉴
    const itemKey = `${chain}_${spawnLevel}`;
    if (!state.gameCollection.includes(itemKey)) {
      state.gameCollection.push(itemKey);
    }

    // 调料链联动：生成调料时同步到餐厅库存
    if (chain === 'seasoning') {
      const seasoningItem = GAME_CHAINS.seasoning.items[spawnLevel - 1];
      if (seasoningItem && seasoningItem.seasoningId) {
        if (!state.restaurantSeasonings) state.restaurantSeasonings = {};
        state.restaurantSeasonings[seasoningItem.seasoningId] = (state.restaurantSeasonings[seasoningItem.seasoningId] || 0) + 1;
      }
    }

    // 小概率附赠体力链物品（5%概率）
    if (Math.random() < 0.05) {
      const staminaEmptySlots = [];
      for (let i = 0; i < GAME_BOARD_CELLS; i++) {
        if (i === state.gameGeneratorPos || i === state.gameSellPos) continue;
        if (!state.gameBoard[i]) staminaEmptySlots.push(i);
      }
      if (staminaEmptySlots.length > 0) {
        const staminaLevel = Math.random() < 0.7 ? 1 : (Math.random() < 0.8 ? 2 : 3);
        const staminaSlot = staminaEmptySlots[Math.floor(Math.random() * staminaEmptySlots.length)];
        state.gameBoard[staminaSlot] = { chain: 'stamina', level: staminaLevel };
        const staminaItemKey = `stamina_${staminaLevel}`;
        if (!state.gameCollection.includes(staminaItemKey)) {
          state.gameCollection.push(staminaItemKey);
        }
        const staminaItemData = GAME_CHAINS.stamina.items[staminaLevel - 1];
        gameShowNotice(`⚡ 幸运附赠！获得 ${staminaItemData.emoji} ${staminaItemData.name}！`);
      }
    }

    saveDataDebounced('游戏生成道具');
    gameRenderBoard();
    gameRenderStatus();
    gameRenderOrders();

  }

  // ===== 合成逻辑 =====
  function gameTryMerge(fromIdx, toIdx) {
    if (fromIdx === toIdx) return false;
    if (fromIdx === state.gameGeneratorPos || fromIdx === state.gameSellPos) return false;
    if (toIdx === state.gameGeneratorPos) return false;

    const fromItem = state.gameBoard[fromIdx];
    if (!fromItem) return false;

    // 售卖区
    if (toIdx === state.gameSellPos) {
      const chainData = GAME_CHAINS[fromItem.chain];
      const itemData = chainData.items[fromItem.level - 1];

      // 体力链售卖：恢复体力而非给金币
      if (fromItem.chain === 'stamina' && itemData.staminaRestore) {
        state.gameStamina = Math.min(999, state.gameStamina + itemData.staminaRestore);
        state.gameBoard[fromIdx] = null;
        gameShowNotice(`⚡ 使用 ${itemData.emoji} ${itemData.name}，恢复 ${itemData.staminaRestore} 点体力！`);
        saveDataDebounced('游戏售卖体力');
        gameRenderBoard();
        gameRenderStatus();
        gameRenderOrders();
        return true;
      }

      state.gameGold += itemData.sell;
      state.gameBoard[fromIdx] = null;


      // 调料链联动：售卖调料时从餐厅库存扣除
      if (fromItem.chain === 'seasoning' && itemData.seasoningId) {
        if (state.restaurantSeasonings && state.restaurantSeasonings[itemData.seasoningId] > 0) {
          state.restaurantSeasonings[itemData.seasoningId]--;
          if (state.restaurantSeasonings[itemData.seasoningId] <= 0) {
            delete state.restaurantSeasonings[itemData.seasoningId];
          }
        }
      }

      gameShowNotice(`售出 ${itemData.emoji} ${itemData.name}，获得 ${itemData.sell} 金币！`);
      saveDataDebounced('游戏售卖');
      gameRenderBoard();
      gameRenderStatus();
      gameRenderOrders();
      return true;
    }

    const toItem = state.gameBoard[toIdx];

    // 空格子 → 移动
    if (!toItem) {
      state.gameBoard[toIdx] = fromItem;
      state.gameBoard[fromIdx] = null;
      saveDataDebounced('游戏移动');
      gameRenderBoard();
      return true;
    }

    // 合成：同链同级
    if (toItem.chain === fromItem.chain && toItem.level === fromItem.level) {
      if (fromItem.level >= GAME_MAX_CHAIN_LEVEL) {
        gameShowNotice('已达最高等级！');
        return false;
      }
      const newLevel = fromItem.level + 1;
      state.gameBoard[toIdx] = { chain: fromItem.chain, level: newLevel };
      state.gameBoard[fromIdx] = null;

      // 图鉴
      const itemKey = `${fromItem.chain}_${newLevel}`;
      if (!state.gameCollection.includes(itemKey)) {
        state.gameCollection.push(itemKey);
      }

      const chainData = GAME_CHAINS[fromItem.chain];
      const newItem = chainData.items[newLevel - 1];
      gameShowNotice(`合成成功！获得 ${newItem.emoji} ${newItem.name} (Lv${newLevel})`);

      // 调料链联动：合成出调料时同步到餐厅库存
      if (fromItem.chain === 'seasoning' && newItem.seasoningId) {
        if (!state.restaurantSeasonings) state.restaurantSeasonings = {};
        state.restaurantSeasonings[newItem.seasoningId] = (state.restaurantSeasonings[newItem.seasoningId] || 0) + 1;
      }

      saveDataDebounced('游戏合成');
      gameRenderBoard();
      gameRenderStatus();
      gameRenderOrders();

      return true;
    }

    return false;
  }

  // ===== 完成订单 =====
  function gameTryCompleteOrder(orderIdx) {
    const order = state.gameOrders[orderIdx];
    if (!order) return;

    // 查找棋盘上是否有对应物品
    let foundIdx = -1;
    for (let i = 0; i < GAME_BOARD_CELLS; i++) {
      const cell = state.gameBoard[i];
      if (cell && cell.chain === order.chain && cell.level === order.level) {
        foundIdx = i;
        break;
      }
    }

    if (foundIdx === -1) {
      gameShowNotice(`棋盘上没有 ${order.emoji} ${order.name}！`);
      return;
    }

    // 消耗物品，给金币
    state.gameBoard[foundIdx] = null;
    state.gameGold += order.reward;
    gameShowNotice(`订单完成！${order.emoji} ${order.name} → +${order.reward} 金币`);

    // 替换这个订单
    const newOrders = gameGenerateOrders(1);
    state.gameOrders[orderIdx] = newOrders[0];

    // 完成订单时小概率附赠体力链物品（8%概率）
    if (Math.random() < 0.08) {
      const staminaEmptySlots2 = [];
      for (let i = 0; i < GAME_BOARD_CELLS; i++) {
        if (i === state.gameGeneratorPos || i === state.gameSellPos) continue;
        if (!state.gameBoard[i]) staminaEmptySlots2.push(i);
      }
      if (staminaEmptySlots2.length > 0) {
        const staminaLevel2 = Math.random() < 0.6 ? 1 : (Math.random() < 0.75 ? 2 : 3);
        const staminaSlot2 = staminaEmptySlots2[Math.floor(Math.random() * staminaEmptySlots2.length)];
        state.gameBoard[staminaSlot2] = { chain: 'stamina', level: staminaLevel2 };
        const staminaItemKey2 = `stamina_${staminaLevel2}`;
        if (!state.gameCollection.includes(staminaItemKey2)) {
          state.gameCollection.push(staminaItemKey2);
        }
        const staminaItemData2 = GAME_CHAINS.stamina.items[staminaLevel2 - 1];
        gameShowNotice(`⚡ 订单奖励附赠！${staminaItemData2.emoji} ${staminaItemData2.name}！`);
      }
    }

    saveDataDebounced('游戏订单完成');
    gameRenderBoard();
    gameRenderStatus();
    gameRenderOrders();
  }

  // ===== 商店购买 =====
  function gameBuyShopItem(category, idx) {
    const items = GAME_SHOP_ITEMS[category];
    if (!items || !items[idx]) return;
    const item = items[idx];

    if (state.gameGold < item.price) {
      gameShowNotice('金币不够！');
      return;
    }

    // 限购检查
    if (item.dailyLimit > 0) {
      const today = new Date().toISOString().slice(0, 10);
      if (!state.gameShopBuyLog) state.gameShopBuyLog = {};
      if (!state.gameShopBuyLog[today]) state.gameShopBuyLog[today] = {};
      const logKey = `${category}_${idx}`;
      const bought = state.gameShopBuyLog[today][logKey] || 0;
      if (bought >= item.dailyLimit) {
        gameShowNotice(`${item.emoji} ${item.name} 今日已售罄（限${item.dailyLimit}次/天）`);
        return;
      }
      state.gameShopBuyLog[today][logKey] = bought + 1;
      // 清理超过3天的旧记录，防止数据膨胀
      const keys = Object.keys(state.gameShopBuyLog);
      keys.forEach(k => { if (k < today.slice(0, 8)) delete state.gameShopBuyLog[k]; });
    }

    state.gameGold -= item.price;

    // 放入背包
    if (!state.gameInventory) state.gameInventory = [];
    const existing = state.gameInventory.find(inv => inv.category === category && inv.idx === idx);
    if (existing) {
      existing.count++;
    } else {
      state.gameInventory.push({ category, idx, count: 1 });
    }

    gameShowNotice(`购买了 ${item.emoji} ${item.name}，已放入背包！`);
    saveDataDebounced('游戏商店购买');
    gameRenderStatus();
    gameRenderShop();
    checkAchievements();

  }


  // ===== 游戏通知 =====
  function gameShowNotice(text) {
    const notice = document.getElementById('sp-game-notice');
    if (!notice) return;
    notice.textContent = text;
    notice.classList.add('visible');
    clearTimeout(notice._timer);
    notice._timer = setTimeout(() => notice.classList.remove('visible'), 3000);
  }

  // ===== 获取物品显示 =====
  function gameGetItemDisplay(chain, level) {
    const custom = state.gameCustomImages?.[`${chain}_${level}`];
    if (custom) {
      return `<img src="${custom}" class="sp-game-cell-img" alt="" />`;
    }
    const chainData = GAME_CHAINS[chain];
    if (!chainData || !chainData.items[level - 1]) return '?';
    return `<span class="sp-game-cell-emoji">${chainData.items[level - 1].emoji}</span>`;
  }

  function gameGetItemInfo(chain, level) {
    const chainData = GAME_CHAINS[chain];
    if (!chainData || !chainData.items[level - 1]) return { name: '?', sell: 0, emoji: '?' };
    return chainData.items[level - 1];
  }

  function gameRenderOrders() {
    const container = document.getElementById('sp-game-orders');
    if (!container) return;

    if (!state.gameOrders || state.gameOrders.length === 0) {
      container.innerHTML = '<div class="sp-game-empty">暂无订单</div>';
      return;
    }

    // 检查棋盘上是否有匹配订单的物品
    const boardItems = {};
    for (let i = 0; i < GAME_BOARD_CELLS; i++) {
      const cell = state.gameBoard[i];
      if (cell) {
        const key = `${cell.chain}_${cell.level}`;
        boardItems[key] = (boardItems[key] || 0) + 1;
      }
    }

    container.innerHTML = state.gameOrders.map((order, idx) => {
      const customImg = state.gameCustomImages?.[`${order.chain}_${order.level}`];
      const display = customImg
        ? `<img src="${customImg}" class="sp-game-order-img" />`
        : `<span class="sp-game-order-emoji">${order.emoji}</span>`;
      const orderKey = `${order.chain}_${order.level}`;
      const matched = boardItems[orderKey] && boardItems[orderKey] > 0;
      const matchedClass = matched ? ' sp-game-order-matched' : '';
      return `
        <div class="sp-game-order-card${matchedClass}" data-order-idx="${idx}">
          <div class="sp-game-order-item">${display}</div>
          <div class="sp-game-order-info">
            <span class="sp-game-order-name">${order.name} (Lv${order.level})</span>
            <span class="sp-game-order-reward">🪙 ${order.reward}</span>
          </div>
          <button class="sp-game-order-btn" data-order-idx="${idx}">交付</button>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.sp-game-order-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const orderIdx = parseInt(btn.dataset.orderIdx);
        gameTryCompleteOrder(orderIdx);
      });
    });
  }


  // ===== 渲染棋盘 =====
  function gameRenderBoard() {
    const boardEl = document.getElementById('sp-game-board');
    if (!boardEl) return;

    // 如果格子数量没变，尝试增量更新而非全量重写
    const existingCells = boardEl.querySelectorAll('.sp-game-cell');
    if (existingCells.length === GAME_BOARD_CELLS) {
      // 增量更新模式
      for (let i = 0; i < GAME_BOARD_CELLS; i++) {
        const cell = existingCells[i];
        let cellClass = 'sp-game-cell';
        let content = '';
        let title = '';

        if (i === state.gameGeneratorPos) {
          cellClass += ' sp-game-generator';
          const customGen = state.gameCustomImages?.generator;
          content = customGen
            ? `<img src="${customGen}" class="sp-game-cell-img" alt="生成器" />`
            : '<span class="sp-game-cell-emoji">🐾</span>';
          title = '魔法猫爪生成器（点击消耗1体力）';
        } else if (i === state.gameSellPos) {
          cellClass += ' sp-game-sell';
          content = '<span class="sp-game-cell-emoji">💰</span>';
          title = '售卖区（拖入或轻触选中后点击此处售卖）';
        } else {
          const cellData = state.gameBoard[i];
          if (cellData) {
            cellClass += ' sp-game-has-item';
            content = gameGetItemDisplay(cellData.chain, cellData.level);
            const info = gameGetItemInfo(cellData.chain, cellData.level);
            title = `${info.emoji} ${info.name} (Lv${cellData.level}) - 售价:${info.sell}金币`;
            cellClass += ` sp-game-chain-${cellData.chain}`;
          }
        }

        if (gameSelectedCell === i) {
          cellClass += ' sp-game-selected';
        }

        const levelBadge = state.gameBoard[i] ? 'L' + state.gameBoard[i].level : '';

        // 只在内容实际变化时更新 DOM
        if (cell.className !== cellClass) cell.className = cellClass;
        if (cell.title !== title) cell.title = title;
        const shouldDrag = (state.gameBoard[i] && i !== state.gameGeneratorPos && i !== state.gameSellPos);
        cell.draggable = shouldDrag;

        const newInner = content + `<span class="sp-game-level-badge">${levelBadge}</span>`;
        if (cell.innerHTML !== newInner) cell.innerHTML = newInner;
      }
      gameBindBoardDelegation();
      return;
    }

    // 全量渲染（首次或格子数变化时）
    let html = '';
    for (let i = 0; i < GAME_BOARD_CELLS; i++) {
      let cellClass = 'sp-game-cell';
      let content = '';
      let title = '';

      if (i === state.gameGeneratorPos) {
        cellClass += ' sp-game-generator';
        const customGen = state.gameCustomImages?.generator;
        content = customGen
          ? `<img src="${customGen}" class="sp-game-cell-img" alt="生成器" />`
          : '<span class="sp-game-cell-emoji">🐾</span>';
        title = '魔法猫爪生成器（点击消耗1体力）';
      } else if (i === state.gameSellPos) {
        cellClass += ' sp-game-sell';
        content = '<span class="sp-game-cell-emoji">💰</span>';
        title = '售卖区（拖入或轻触选中后点击此处售卖）';
      } else {
        const cellData = state.gameBoard[i];
        if (cellData) {
          cellClass += ' sp-game-has-item';
          content = gameGetItemDisplay(cellData.chain, cellData.level);
          const info = gameGetItemInfo(cellData.chain, cellData.level);
          title = `${info.emoji} ${info.name} (Lv${cellData.level}) - 售价:${info.sell}金币`;
          cellClass += ` sp-game-chain-${cellData.chain}`;
        }
      }

      if (gameSelectedCell === i) {
        cellClass += ' sp-game-selected';
      }

      const draggable = (state.gameBoard[i] && i !== state.gameGeneratorPos && i !== state.gameSellPos) ? ' draggable="true"' : '';
      html += `<div class="${cellClass}" data-cell-idx="${i}" title="${title}"${draggable}>${content}<span class="sp-game-level-badge">${state.gameBoard[i] ? 'L' + state.gameBoard[i].level : ''}</span></div>`;
    }
    boardEl.innerHTML = html;

    // 绑定事件（委托模式，只绑一次）
    gameBindBoardDelegation();
  }

  // ===== 绑定棋盘格子事件（事件委托，只绑定一次）=====
  let _gameSpawnLock = false; // 防抖锁
  let _gameBoardBound = null; // 已绑定委托的棋盘元素引用
  let _gameTouchState = { startIdx: null, clone: null, moved: false, startTime: 0 };

  function gameBindBoardDelegation() {
    const boardEl = document.getElementById('sp-game-board');
    if (!boardEl || boardEl === _gameBoardBound) return;
    _gameBoardBound = boardEl;

    // ===== Click 委托 =====
    boardEl.addEventListener('click', (e) => {
      const cell = e.target.closest('.sp-game-cell');
      if (!cell) return;
      const idx = parseInt(cell.dataset.cellIdx);
      if (isNaN(idx)) return;
      e.stopPropagation();

      // 生成器点击
      if (idx === state.gameGeneratorPos) {
        if (_gameSpawnLock) return;
        _gameSpawnLock = true;
        gameSpawnItem();
        setTimeout(() => { _gameSpawnLock = false; }, 300);
        return;
      }

      // 如果已经有选中的格子
      if (gameSelectedCell !== null && gameSelectedCell !== idx) {
        gameTryMerge(gameSelectedCell, idx);
        gameSelectedCell = null;
        gameRenderBoard();
        return;
      }

      // 选中当前格子（必须有物品）
      if (state.gameBoard[idx] && idx !== state.gameSellPos) {
        gameSelectedCell = (gameSelectedCell === idx) ? null : idx;
        gameRenderBoard();
      } else if (idx === state.gameSellPos && gameSelectedCell !== null) {
        gameTryMerge(gameSelectedCell, idx);
        gameSelectedCell = null;
        gameRenderBoard();
      } else {
        gameSelectedCell = null;
        gameRenderBoard();
      }
    });

    // ===== Drag 委托 =====
    boardEl.addEventListener('dragstart', (e) => {
      const cell = e.target.closest('.sp-game-cell');
      if (!cell) return;
      const idx = parseInt(cell.dataset.cellIdx);
      if (isNaN(idx)) return;
      if (!state.gameBoard[idx] || idx === state.gameGeneratorPos || idx === state.gameSellPos) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData('text/plain', String(idx));
      cell.classList.add('sp-game-dragging');
    });

    boardEl.addEventListener('dragend', (e) => {
      const cell = e.target.closest('.sp-game-cell');
      if (cell) cell.classList.remove('sp-game-dragging');
    });

    boardEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      const cell = e.target.closest('.sp-game-cell');
      if (cell) cell.classList.add('sp-game-dragover');
    });

    boardEl.addEventListener('dragleave', (e) => {
      const cell = e.target.closest('.sp-game-cell');
      if (cell) cell.classList.remove('sp-game-dragover');
    });

    boardEl.addEventListener('drop', (e) => {
      e.preventDefault();
      const cell = e.target.closest('.sp-game-cell');
      if (!cell) return;
      cell.classList.remove('sp-game-dragover');
      const toIdx = parseInt(cell.dataset.cellIdx);
      const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
      if (!isNaN(fromIdx) && !isNaN(toIdx)) {
        gameTryMerge(fromIdx, toIdx);
        gameSelectedCell = null;
        gameRenderBoard();
        gameRenderStatus();
      }
    });

    // ===== Touch 委托 =====
    boardEl.addEventListener('touchstart', (e) => {
      const cell = e.target.closest('.sp-game-cell');
      if (!cell) return;
      const idx = parseInt(cell.dataset.cellIdx);
      if (isNaN(idx)) return;
      if (!state.gameBoard[idx] || idx === state.gameGeneratorPos || idx === state.gameSellPos) return;
      _gameTouchState.startIdx = idx;
      _gameTouchState.moved = false;
      _gameTouchState.startTime = Date.now();
    }, { passive: true });

    boardEl.addEventListener('touchmove', (e) => {
      if (_gameTouchState.startIdx === null) return;
      if (Date.now() - _gameTouchState.startTime < 150) return;
      _gameTouchState.moved = true;
      if (e.cancelable) e.preventDefault();

      if (!_gameTouchState.clone) {
        const cell = boardEl.querySelector(`.sp-game-cell[data-cell-idx="${_gameTouchState.startIdx}"]`);
        if (cell) {
          _gameTouchState.clone = cell.cloneNode(true);
          _gameTouchState.clone.classList.add('sp-game-touch-clone');
          document.getElementById('sp-game-panel').appendChild(_gameTouchState.clone);
        }
      }

      if (_gameTouchState.clone) {
        const touch = e.touches[0];
        const panel = document.getElementById('sp-game-panel');
        const panelRect = panel.getBoundingClientRect();
        _gameTouchState.clone.style.left = (touch.clientX - panelRect.left - 22) + 'px';
        _gameTouchState.clone.style.top = (touch.clientY - panelRect.top - 22) + 'px';
      }
    }, { passive: false });

    boardEl.addEventListener('touchend', (e) => {
      if (_gameTouchState.startIdx === null) return;

      if (_gameTouchState.clone) {
        _gameTouchState.clone.remove();
        _gameTouchState.clone = null;
      }

      if (!_gameTouchState.moved) {
        _gameTouchState.startIdx = null;
        return; // click 事件会处理轻触逻辑
      }

      // 拖动结束，找落点格子
      const touch = e.changedTouches[0];
      const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
      const targetCell = targetEl?.closest('.sp-game-cell');

      if (targetCell) {
        const toIdx = parseInt(targetCell.dataset.cellIdx);
        if (!isNaN(toIdx) && toIdx !== _gameTouchState.startIdx) {
          gameTryMerge(_gameTouchState.startIdx, toIdx);
          gameSelectedCell = null;
          gameRenderBoard();
          gameRenderStatus();
        }
      }

      _gameTouchState.startIdx = null;
      _gameTouchState.moved = false;
    });
  }

  // 空壳保留兼容名（其他地方可能还有调用）
  function gameBindCellEvents() {
    // 不再逐格绑定，委托已在 gameBindBoardDelegation 中完成
  }

  // ===== 渲染状态栏 =====
  function gameRenderStatus() {
    const goldEl = document.getElementById('sp-game-gold');
    const staminaEl = document.getElementById('sp-game-stamina');
    if (goldEl) goldEl.textContent = state.gameGold;
    const staminaColor = state.gameStamina > state.gameStaminaMax ? 'color:rgba(255,200,50,0.9);font-weight:700;' : '';
    if (staminaEl) staminaEl.innerHTML = `<span style="${staminaColor}">${Math.floor(state.gameStamina)}</span> / ${state.gameStaminaMax} <span id="sp-game-stamina-add" style="cursor:pointer;margin-left:2px;font-size:14px;color:rgba(100,220,100,0.8);" title="使用体力道具">⊕</span>`;
    // 绑定体力加号按钮
    const staminaAddBtn = document.getElementById('sp-game-stamina-add');
    if (staminaAddBtn) {
      staminaAddBtn.onclick = (e) => {
        e.stopPropagation();
        showStaminaInventoryPopup();
      };
    }

    // 同步刷新按钮状态
    const btn = document.getElementById('sp-game-order-refresh-btn');
    if (btn) {
      const now = Date.now();
      const cdRemain = Math.max(0, (state.gameOrderRefreshCD || 0) - now);
      if (cdRemain <= 0) {
        btn.textContent = '🔄';
        btn.disabled = false;
        btn.classList.remove('sp-game-on-cd');
        btn.title = '刷新订单';
      } else {
        const min = Math.floor(cdRemain / 60000);
        const sec = Math.ceil((cdRemain % 60000) / 1000);
        btn.textContent = `${min}:${String(sec).padStart(2, '0')}`;
        btn.disabled = true;
        btn.classList.add('sp-game-on-cd');
        btn.title = '冷却中';
        gameStartOrderCDTimer();
      }
    }
  }

  // ===== 体力背包弹窗 =====
  function showStaminaInventoryPopup() {
    document.getElementById('sp-stamina-inv-popup')?.remove();

    if (!state.gameStaminaInventory) state.gameStaminaInventory = { stamina30: 0, stamina50: 0, stamina100: 0 };

    const hasAny = GAME_STAMINA_ITEMS.some(item => (state.gameStaminaInventory[item.key] || 0) > 0);

    const overlay = document.createElement('div');
    overlay.id = 'sp-stamina-inv-popup';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:2147483649;';

    let itemsHtml = GAME_STAMINA_ITEMS.map(item => {
      const count = state.gameStaminaInventory[item.key] || 0;
      const isEmpty = count <= 0;
      return `
        <div class="sp-inv-item ${isEmpty ? '' : ''}" style="${isEmpty ? 'opacity:0.4;' : ''}">
          <span class="sp-inv-item-emoji">${item.emoji}</span>
          <div class="sp-inv-item-info">
            <span class="sp-inv-item-name">${item.name}</span>
            <span class="sp-inv-item-detail">+${item.restore} 体力 | 库存: ${count}</span>
          </div>
          <div class="sp-inv-item-actions">
            ${isEmpty ? '' : `<button class="sp-inv-use-btn" data-stamina-key="${item.key}">使用</button>`}
          </div>
        </div>
      `;
    }).join('');

    if (!hasAny) {
      itemsHtml = '<div class="sp-inv-empty">体力背包空空如也～<br/><span style="font-size:11px;">去合成工坊商店购买体力道具吧！</span></div>';
    }

    overlay.innerHTML = `
      <div class="sp-inv-popup-box">
        <div class="sp-inv-popup-header">
          <span>⚡ 体力背包</span>
          <button class="sp-inv-popup-close" title="关闭">✕</button>
        </div>
        <div class="sp-inv-popup-body">
          ${itemsHtml}
        </div>
        <div class="sp-inv-popup-hint">💡 体力道具可在合成工坊商店购买，或通过抽奖获得</div>
      </div>
    `;

    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      const box = overlay.querySelector('.sp-inv-popup-box');
      if (box) {
        const boxH = box.offsetHeight || 250;
        const boxW = box.offsetWidth || 300;
        box.style.position = 'fixed';
        box.style.top = Math.max(20, Math.floor((window.innerHeight - boxH) / 2)) + 'px';
        box.style.left = Math.floor((window.innerWidth - boxW) / 2) + 'px';
        box.style.margin = '0';
      }
    });

    overlay.querySelector('.sp-inv-popup-close').onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

    overlay.querySelectorAll('.sp-inv-use-btn[data-stamina-key]').forEach(btn => {
      btn.onclick = () => {
        const key = btn.dataset.staminaKey;
        const item = GAME_STAMINA_ITEMS.find(i => i.key === key);
        if (!item) return;
        if ((state.gameStaminaInventory[key] || 0) <= 0) {
          gameShowNotice('库存不足！'); return;
        }
        state.gameStaminaInventory[key]--;
        state.gameStamina = Math.min(999, state.gameStamina + item.restore);
        saveDataDebounced('使用体力道具');
        gameShowNotice(`使用了 ${item.emoji} ${item.name}，体力 +${item.restore}！`);
        gameRenderStatus();
        overlay.remove();
      };
    });
  }

  // ===== 购买体力道具 =====
  function gameBuyStaminaItem(key) {
    const item = GAME_STAMINA_ITEMS.find(i => i.key === key);
    if (!item) return;

    if (state.gameGold < item.price) {
      gameShowNotice('金币不够！');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    if (!state.gameStaminaShopLog) state.gameStaminaShopLog = {};
    if (!state.gameStaminaShopLog[today]) state.gameStaminaShopLog[today] = {};
    const bought = state.gameStaminaShopLog[today][key] || 0;
    if (bought >= item.dailyLimit) {
      gameShowNotice(`${item.emoji} ${item.name} 今日已售罄（限${item.dailyLimit}次/天）`);
      return;
    }

    state.gameGold -= item.price;
    state.gameStaminaShopLog[today][key] = bought + 1;
    if (!state.gameStaminaInventory) state.gameStaminaInventory = { stamina30: 0, stamina50: 0, stamina100: 0 };
    state.gameStaminaInventory[key] = (state.gameStaminaInventory[key] || 0) + 1;

    gameShowNotice(`购买了 ${item.emoji} ${item.name}，已放入体力背包！`);
    saveDataDebounced('购买体力道具');
    gameRenderStatus();
    gameRenderShop();
  }

  let gameOrderCDTimer = null;

  function gameRefreshOrders() {
    const now = Date.now();
    const cdRemain = (state.gameOrderRefreshCD || 0) - now;
    if (cdRemain > 0) {
      gameShowNotice(`刷新冷却中，还剩 ${Math.ceil(cdRemain / 60000)} 分钟`);
      return;
    }

    state.gameOrders = gameGenerateOrders(3);
    state.gameOrderRefreshCD = now + 10 * 60 * 1000; // 10分钟冷却
    saveDataDebounced('刷新订单');
    gameRenderOrders();
    gameShowNotice('订单已刷新！');
  }

  function gameStartOrderCDTimer() {
    if (gameOrderCDTimer) clearInterval(gameOrderCDTimer);
    gameOrderCDTimer = setInterval(() => {
      const now = Date.now();
      const cdRemain = Math.max(0, (state.gameOrderRefreshCD || 0) - now);
      const btn = document.getElementById('sp-game-order-refresh-btn');
      if (!btn) { clearInterval(gameOrderCDTimer); gameOrderCDTimer = null; return; }

      if (cdRemain <= 0) {
        btn.textContent = '🔄 刷新订单';
        btn.disabled = false;
        btn.classList.remove('sp-game-on-cd');
        clearInterval(gameOrderCDTimer);
        gameOrderCDTimer = null;
      } else {
        const min = Math.floor(cdRemain / 60000);
        const sec = Math.ceil((cdRemain % 60000) / 1000);
        btn.textContent = `🔄 ${min}:${String(sec).padStart(2, '0')}`;
      }
    }, 1000);
  }

  // ===== 渲染商店 =====
  function gameRenderShop() {
    const container = document.getElementById('sp-game-shop-content');
    if (!container) return;

    const today = new Date().toISOString().slice(0, 10);
    const todayLog = (state.gameShopBuyLog && state.gameShopBuyLog[today]) || {};

    const categories = [
      { key: 'food', label: '🍖 食物（恢复饱食）', items: GAME_SHOP_ITEMS.food },
      { key: 'clean', label: '🧴 洗护用品（恢复清洁）', items: GAME_SHOP_ITEMS.clean },
      { key: 'energy', label: '🛏️ 睡眠用品（恢复精力）', items: GAME_SHOP_ITEMS.energy },
    ];

    // 体力道具分类
    const todayStaminaLog = (state.gameStaminaShopLog && state.gameStaminaShopLog[today]) || {};
    const staminaCategoryHtml = `
      <div class="sp-game-shop-category">
        <div class="sp-game-shop-cat-title">⚡ 体力道具（恢复游戏体力）</div>
        <div class="sp-game-shop-items">
          ${GAME_STAMINA_ITEMS.map(item => {
            const bought = todayStaminaLog[item.key] || 0;
            const soldOut = bought >= item.dailyLimit;
            const cantAfford = state.gameGold < item.price;
            const disabled = soldOut || cantAfford;
            const stock = (state.gameStaminaInventory && state.gameStaminaInventory[item.key]) || 0;
            const limitText = `<span class="sp-game-shop-limit ${soldOut ? 'sold-out' : ''}">${soldOut ? '已售罄' : `剩${item.dailyLimit - bought}次`}</span>`;
            return `
              <div class="sp-game-shop-item ${disabled ? 'sp-game-shop-disabled' : ''}">
                <span class="sp-game-shop-item-emoji">${item.emoji}</span>
                <span class="sp-game-shop-item-name">${item.name}</span>
                <span class="sp-game-shop-item-info">+${item.restore}⚡</span>
                ${limitText}
                <span class="sp-game-shop-limit">库存:${stock}</span>
                <button class="sp-game-shop-buy sp-stamina-buy-btn" data-stamina-key="${item.key}" ${disabled ? 'disabled' : ''}>🪙${item.price}</button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.innerHTML = categories.map(cat => `
      <div class="sp-game-shop-category">
        <div class="sp-game-shop-cat-title">${cat.label}</div>
        <div class="sp-game-shop-items">
          ${cat.items.map((item, idx) => {
            const logKey = `${cat.key}_${idx}`;
            const bought = todayLog[logKey] || 0;
            const soldOut = item.dailyLimit > 0 && bought >= item.dailyLimit;
            const cantAfford = state.gameGold < item.price;
            const disabled = soldOut || cantAfford;
            const limitText = item.dailyLimit > 0
              ? `<span class="sp-game-shop-limit ${soldOut ? 'sold-out' : ''}">${soldOut ? '已售罄' : `剩${item.dailyLimit - bought}次`}</span>`
              : '<span class="sp-game-shop-limit">不限量</span>';
            return `
              <div class="sp-game-shop-item ${disabled ? 'sp-game-shop-disabled' : ''}">
                <span class="sp-game-shop-item-emoji">${item.emoji}</span>
                <span class="sp-game-shop-item-name">${item.name}</span>
                <span class="sp-game-shop-item-info">+${item.restore}</span>
                ${limitText}
                <button class="sp-game-shop-buy" data-cat="${cat.key}" data-idx="${idx}" ${disabled ? 'disabled' : ''}>🪙${item.price}</button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('') + staminaCategoryHtml;

    container.querySelectorAll('.sp-game-shop-buy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cat = btn.dataset.cat;
        const idx = parseInt(btn.dataset.idx);
        gameBuyShopItem(cat, idx);
      });
    });

    container.querySelectorAll('.sp-stamina-buy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        gameBuyStaminaItem(btn.dataset.staminaKey);
      });
    });

  }

  // ===== 渲染图鉴 =====
  function gameRenderCollection() {
    const container = document.getElementById('sp-game-collection-content');
    if (!container) return;

    const chainKeys = ['toy', 'food', 'gem', 'potion', 'music', 'flower', 'star', 'seasoning', 'stamina'];
    container.innerHTML = chainKeys.map(chainKey => {
      const chain = GAME_CHAINS[chainKey];
      return `
        <div class="sp-game-collection-chain">
          <div class="sp-game-collection-chain-title">${chain.name}</div>
          <div class="sp-game-collection-items">
            ${chain.items.map((item, idx) => {
              const itemKey = `${chainKey}_${idx + 1}`;
              const unlocked = state.gameCollection.includes(itemKey);
              const customImg = state.gameCustomImages?.[itemKey];
              const display = unlocked
                ? (customImg ? `<img src="${customImg}" class="sp-game-coll-img" />` : `<span>${item.emoji}</span>`)
                : '<span class="sp-game-locked">?</span>';
              return `
                <div class="sp-game-coll-item ${unlocked ? 'unlocked' : 'locked'}" data-item-key="${itemKey}" title="${unlocked ? item.name + ' (Lv' + (idx+1) + ')' : '未解锁'}">
                  ${display}
                  <div class="sp-game-coll-item-name">${unlocked ? item.name : '???'}</div>
                  <div class="sp-game-coll-upload-overlay" data-item-key="${itemKey}">📷</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');

    // 点击图鉴项上传图片
    container.querySelectorAll('.sp-game-coll-upload-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        const itemKey = overlay.dataset.itemKey;
        gamePromptImageUpload(itemKey);
      });
    });
  }

  // ===== 图片上传弹窗 =====
  function gamePromptImageUpload(itemKey) {
    if (!state.gameCustomImages) state.gameCustomImages = {};
    const currentImg = state.gameCustomImages[itemKey];

    // 如果已有图片，先问是否要移除
    if (currentImg) {
      const action = confirm('当前已有自定义图片\n\n点「确定」→ 移除图片（恢复默认emoji）\n点「取消」→ 替换为新图片');
      if (action) {
        delete state.gameCustomImages[itemKey];
        saveDataImmediate('游戏图片移除');
        gameRenderCollection();
        gameRenderBoard();
        gameShowNotice('图片已移除，恢复默认显示');
        return;
      }
    }

    // 设置新图片
    const choice = confirm('设置物品图片\n\n点「确定」→ 输入图片链接\n点「取消」→ 选择本地文件上传');

    if (choice) {
      // 链接模式
      const url = prompt('输入图片链接（留空确认=清除图片）：', currentImg && currentImg.startsWith('http') ? currentImg : '');
      if (url === null) return; // 点了取消
      const trimmed = url.trim();
      if (!trimmed) {
        // 留空=清除
        delete state.gameCustomImages[itemKey];
        saveDataImmediate('游戏图片清除');
        gameRenderCollection();
        gameRenderBoard();
        gameShowNotice('图片已清除');
        return;
      }
      if (!trimmed.startsWith('http')) {
        gameShowNotice('链接需要以 http 开头');
        return;
      }
      state.gameCustomImages[itemKey] = trimmed;
      saveDataImmediate('游戏图片链接');
      gameRenderCollection();
      gameRenderBoard();
      gameShowNotice('图片链接已设置！');
    } else {
      // 文件模式
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/png,image/jpeg,image/gif,image/webp';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
          gameShowNotice('图片不能超过2MB');
          return;
        }
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const compressed = await compressImage(ev.target.result, 80, 0.7);
          if (!state.gameCustomImages) state.gameCustomImages = {};
          state.gameCustomImages[itemKey] = compressed;
          saveDataImmediate('游戏图片上传');
          gameRenderCollection();
          gameRenderBoard();
          gameShowNotice('图片已设置！');
        };
        reader.readAsDataURL(file);
      };
      input.click();
    }
  }


  // ===== 背景图上传 =====
  function gameUploadBackground() {
    const choice = confirm('设置游戏背景\n\n点「确定」→ 输入图片链接\n点「取消」→ 选择本地文件上传');

    if (choice) {
      const url = prompt('输入背景图片链接：');
      if (url && url.trim().startsWith('http')) {
        state.gameBgImage = url.trim();
        saveDataImmediate('游戏背景图');
        gameApplyBackground();
        gameShowNotice('背景已更新！');
      }
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/png,image/jpeg,image/gif,image/webp';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 3 * 1024 * 1024) {
          gameShowNotice('背景图不能超过3MB');
          return;
        }
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const compressed = await compressImage(ev.target.result, 600, 0.6);
          state.gameBgImage = compressed;
          saveDataImmediate('游戏背景图');
          gameApplyBackground();
          gameShowNotice('背景已设置！');
        };
        reader.readAsDataURL(file);
      };
      input.click();
    }
  }

  function gameApplyBackground() {
    const board = document.getElementById('sp-game-board');
    if (!board) return;
    if (state.gameBgImage) {
      board.style.backgroundImage = `url(${state.gameBgImage})`;
      board.style.backgroundSize = 'cover';
      board.style.backgroundPosition = 'center';
    } else {
      board.style.backgroundImage = 'none';
    }
  }

  // ===== 生成器图片上传 =====
  function gameUploadGenerator() {
    gamePromptImageUpload('generator');
  }

  // ===== 主面板渲染 =====
  function gameRenderPanel() {
    let panel = document.getElementById('sp-game-panel');
    if (panel) {
      panel.remove();
    }

    panel = document.createElement('div');
    panel.id = 'sp-game-panel';
    panel.innerHTML = `
      <div id="sp-game-header">
        <span>🎮 喵咪合成工坊</span>
        <div class="sp-game-header-btns">
          <button id="sp-game-tab-board" class="sp-game-tab active" data-tab="board">棋盘</button>
          <button id="sp-game-tab-shop" class="sp-game-tab" data-tab="shop">商店</button>
          <button id="sp-game-tab-collection" class="sp-game-tab" data-tab="collection">图鉴</button>
          <button id="sp-game-tab-settings" class="sp-game-tab" data-tab="gsettings">⚙️</button>
          <button id="sp-game-minimize" title="缩小悬挂" style="background:none;border:none;font-size:14px;cursor:pointer;color:var(--sp-text-muted);padding:2px 6px;">─</button>
          <button id="sp-game-close" title="关闭">✕</button>
        </div>
      </div>
      <div id="sp-game-status-bar">
        <span class="sp-game-stat">🪙 <span id="sp-game-gold">0</span></span>
        <span class="sp-game-stat">⚡ <span id="sp-game-stamina">100/100</span></span>
        <button class="sp-game-order-refresh-btn" id="sp-game-order-refresh-btn" style="margin-left:auto;">🔄</button>
      </div>
      <div id="sp-game-notice"></div>
      <div id="sp-game-content">
        <div id="sp-game-tab-content-board" class="sp-game-tab-content active">
          <div id="sp-game-orders"></div>
          <div id="sp-game-board"></div>
          <div class="sp-game-board-hint">💡 轻触选中物品 → 轻触目标格子移动/合成/售卖 ｜ 也支持拖拽操作</div>
        </div>
        <div id="sp-game-tab-content-shop" class="sp-game-tab-content">
          <div id="sp-game-shop-content"></div>
        </div>
        <div id="sp-game-tab-content-collection" class="sp-game-tab-content">
          <div id="sp-game-collection-content"></div>
        </div>
        <div id="sp-game-tab-content-gsettings" class="sp-game-tab-content">
          <div class="sp-game-settings-section">
            <div class="sp-game-settings-title">🖼️ 自定义外观</div>
            <button class="sp-game-settings-btn" id="sp-game-upload-bg">上传游戏背景图</button>
            <button class="sp-game-settings-btn" id="sp-game-upload-gen">上传生成器图片</button>
            <button class="sp-game-settings-btn" id="sp-game-clear-bg">清除背景图</button>
            <button class="sp-game-settings-btn" id="sp-game-clear-gen">清除生成器图片</button>
            <p class="sp-game-settings-hint">💡 在图鉴中点击物品上的 📷 即可上传/替换物品图片（优先推荐链接）</p>
          </div>
          <div class="sp-game-settings-section">
            <div class="sp-game-settings-title">⚠️ 重置</div>
            <button class="sp-game-settings-btn sp-game-btn-danger" id="sp-game-reset">重置游戏数据</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // 绑定标签切换
    panel.querySelectorAll('.sp-game-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        if (!target) return;
        panel.querySelectorAll('.sp-game-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        panel.querySelectorAll('.sp-game-tab-content').forEach(c => c.classList.remove('active'));
        const targetContent = document.getElementById(`sp-game-tab-content-${target}`);
        if (targetContent) targetContent.classList.add('active');

        // 切换到对应tab时渲染
        if (target === 'shop') gameRenderShop();
        if (target === 'collection') gameRenderCollection();
      });
    });

    // 最小化
    document.getElementById('sp-game-minimize').addEventListener('click', () => {
      const gamePanel = document.getElementById('sp-game-panel');
      const minBtn = document.getElementById('sp-game-minimize');
      if (!gamePanel || !minBtn) return;
      if (gamePanel.classList.contains('sp-game-minimized')) {
        gamePanel.classList.remove('sp-game-minimized');
        minBtn.textContent = '─';
        minBtn.title = '缩小悬挂';
      } else {
        gamePanel.classList.add('sp-game-minimized');
        minBtn.textContent = '□';
        minBtn.title = '恢复窗口';
      }
    });

    // 关闭
    document.getElementById('sp-game-close').addEventListener('click', () => {
      toggleMergeGame();
    });

    // 设置按钮
    document.getElementById('sp-game-order-refresh-btn')?.addEventListener('click', (e) => { e.stopPropagation(); gameRefreshOrders(); });
    document.getElementById('sp-game-upload-bg')?.addEventListener('click', gameUploadBackground);
    document.getElementById('sp-game-upload-gen')?.addEventListener('click', gameUploadGenerator);
    document.getElementById('sp-game-clear-gen')?.addEventListener('click', () => {
      if (!state.gameCustomImages) state.gameCustomImages = {};
      delete state.gameCustomImages['generator'];
      saveDataImmediate('清除生成器图片');
      gameRenderBoard();
      gameRenderCollection();
      gameShowNotice('生成器图片已清除，恢复默认猫爪');
    });
    document.getElementById('sp-game-clear-bg')?.addEventListener('click', () => {
      state.gameBgImage = '';
      saveDataImmediate('清除游戏背景');
      gameApplyBackground();
      gameShowNotice('背景已清除');
    });
    document.getElementById('sp-game-refresh-orders')?.addEventListener('click', () => {
      gameRefreshOrders();
    });
    document.getElementById('sp-game-reset')?.addEventListener('click', () => {
      // 检查24小时冷却
      const lastReset = state.gameResetCooldown || 0;
      const now = Date.now();
      const cdRemain = lastReset + 24 * 60 * 60 * 1000 - now;
      if (cdRemain > 0) {
        const hours = Math.floor(cdRemain / 3600000);
        const mins = Math.ceil((cdRemain % 3600000) / 60000);
        gameShowNotice(`重置冷却中！还需等待 ${hours}小时${mins}分钟`);
        return;
      }
      showConfirmDialog({
        title: '⚠️ 重置所有游戏数据？',
        desc: '包括：合成工坊、消消看、连连看、抽奖<br/>金币、棋盘、图鉴、道具背包都会清空！<br/><span style="color:#f66;font-weight:600;">每24小时只能重置一次</span>',
        confirmText: '确认重置',
        cancelText: '算了',
        onConfirm: () => {
          showConfirmDialog({
            title: '💀 最后确认',
            desc: '真的确定吗？所有游戏进度都会丢失！',
            confirmText: '我确定',
            cancelText: '取消',
            onConfirm: () => {
              // 合成工坊
              state.gameGold = 0;
              state.gameStamina = state.gameStaminaMax || 80;
              state.gameLastStaminaRecover = Date.now();
              state.gameBoard = new Array(GAME_BOARD_CELLS).fill(null);
              state.gameOrders = gameGenerateOrders(3);
              state.gameCollection = [];
              state.gameCustomImages = {};
              state.gameBgImage = '';
              state.gameGeneratorPos = 0;
              state.gameSellPos = 47;
              state.gameInventory = [];
              state.quickFeed = null;
              state.quickClean = null;
              state.quickEnergy = null;
              state.gameShopBuyLog = {};
              state.gameOrderRefreshCD = 0;
              // 消消看
              state.match3Inventory = { expand: 0, sweep: 0, shuffle: 0 };
              state.match3ItemPurchaseLog = {};
              // 连连看
              state.linkInventory = { hint: 0, shuffle: 0, bomb: 0, compass: 0 };
              state.linkItemPurchaseLog = {};
              // 抽奖
              state.lotteryLog = {};
              // 体力道具
              state.gameStaminaInventory = { stamina30: 0, stamina50: 0, stamina100: 0 };
              state.gameStaminaShopLog = {};
              // 重置运行时状态
              match3State.active = false;
              match3State.cards = [];
              match3State.slots = [];
              linkState.active = false;
              linkState.board = [];
              // 冰箱
              state.fridgeInventory = [];
              state.fridgePropInventory = { compress: 0, backpack: 0, organize: 0 };
              state.fridgePropShopLog = {};
              // 糖葫芦工坊
              state.tanghuluInventory = [];
              state.tanghuluSugarCrystal = 0;
              state.tanghuluPropInventory = { extraStick: 0, undo: 0, lubricant: 0 };
              state.tanghuluPropShopLog = {};
              // 记录重置冷却时间
              state.gameResetCooldown = Date.now();
              saveDataImmediate('全部游戏重置');
              gameRenderBoard();
              gameRenderStatus();
              gameRenderOrders();
              gameApplyBackground();
              gameShowNotice('所有游戏数据已重置！体力已恢复满');
            }
          });
        }
      });
    });
    // 面板拖拽
    gameBindPanelDrag();
  }

  // ===== 面板拖拽 =====
  function gameBindPanelDrag() {
    const header = document.getElementById('sp-game-header');
    const panel = document.getElementById('sp-game-panel');
    if (!header || !panel) return;

    let dragging = false, offX = 0, offY = 0;

    const down = (e) => {
      if (e.target.closest('#sp-game-close') || e.target.closest('.sp-game-tab')) return;
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

  // ===== 开关游戏面板 =====
  // ===== 开关游戏面板 =====
  function toggleMergeGame() {
    isGameOpen = !isGameOpen;
    let panel = document.getElementById('sp-game-panel');

    if (isGameOpen) {
      gameRecoverStamina();
      gameInitBoard();

      // 每次打开都重新创建面板（动态挂载）
      if (panel) panel.remove();
      _gameBoardBound = null; // 重置事件委托标记
      gameRenderPanel();
      panel = document.getElementById('sp-game-panel');

      panel.classList.add('visible');

      // 居中
      const w = Math.min(380, window.innerWidth - 20);
      panel.style.width = w + 'px';
      requestAnimationFrame(() => {
        const h = panel.offsetHeight;
        const maxTop = window.innerHeight - h - 20;
        const centerTop = Math.floor((window.innerHeight - h) / 2);
        panel.style.left = Math.floor((window.innerWidth - w) / 2) + 'px';
        panel.style.top = Math.max(10, Math.min(centerTop, maxTop)) + 'px';
      });

      gameRenderBoard();
      gameRenderStatus();
      gameRenderOrders();
      gameApplyBackground();
    } else {
      // 彻底销毁 DOM 和清理资源
      if (panel) panel.remove();
      _gameBoardBound = null;
      gameSelectedCell = null;
      if (gameOrderCDTimer) { clearInterval(gameOrderCDTimer); gameOrderCDTimer = null; }
    }
  }

  // ============================================================
  // 🃏 消消看游戏模块 - MeepMatch3
  // ============================================================

  // ===== 消消看常量 =====
  const MATCH3_BASE_SLOTS = 7;        // 默认暂存格数量
  const MATCH3_MAX_EXPAND = 3;        // 每局最多扩充次数
  const MATCH3_MAX_SLOTS = 10;        // 暂存格上限
  const MATCH3_MATCH_COUNT = 3;       // 三消

  // 默认图案 Emoji 池
  const MATCH3_DEFAULT_ICONS = [
    '🦊', '🍇', '🔔', '🌲', '🍰', '🎈', '🌸', '🐳',
    '🍬', '🎯', '🌙', '🍄', '⭐', '🎀', '🐝', '🌈',
    '🧂', '🫗', '🥜', '🌶️', '🥟', '🦞', '🍜', '🥧'
  ];

  // 道具定义
  const MATCH3_PROPS = {
    expand: {
      name: '🪜 扩充神架',
      desc: '临时增加1个暂存格',
      price: 100,
      dailyLimit: 10
    },
    sweep: {
      name: '🧹 魔法扫帚',
      desc: '随机消除场景中3个相同图案',
      price: 150,
      dailyLimit: 10
    },
    shuffle: {
      name: '🌀 混沌风暴',
      desc: '将场景中所有图案打乱重组',
      price: 80,
      dailyLimit: 10
    }
  };

  // 难度配置（随机选取）
  const MATCH3_DIFFICULTIES = [
    { name: '简单', layers: 4, density: 0.65, iconCount: 8, cardsPerIcon: 6 },
    { name: '普通', layers: 5, density: 0.7, iconCount: 10, cardsPerIcon: 6 },
    { name: '困难', layers: 6, density: 0.75, iconCount: 12, cardsPerIcon: 6 },
    { name: '噩梦', layers: 7, density: 0.8, iconCount: 14, cardsPerIcon: 6 },
    { name: '地狱', layers: 8, density: 0.85, iconCount: 18, cardsPerIcon: 6 },
    { name: '深渊', layers: 9, density: 0.9, iconCount: 20, cardsPerIcon: 9 },
  ];

  // 游戏运行时状态
  let match3State = {
    active: false,
    cards: [],            // [{id, type, x, y, z, state:'visible'|'blocked'|'collected'|'eliminated'}]
    slots: [],            // 暂存栏 [{type, id}]
    maxSlots: MATCH3_BASE_SLOTS,
    propsUsedThisRound: 0,  // 本局已使用道具总数（上限3）
    eliminatedGroups: 0,  // 本局已消除组数
    difficulty: null,
    totalCards: 0,
    bgImage: '',
  };

  let isMatch3Open = false;

  // ===== 关卡生成算法 =====
  function match3GenerateLevel() {
    // 随机选择难度
    const diff = MATCH3_DIFFICULTIES[Math.floor(Math.random() * MATCH3_DIFFICULTIES.length)];
    match3State.difficulty = diff;

    // 选择图案
    const availableIcons = [...MATCH3_DEFAULT_ICONS];
    const selectedIcons = [];
    for (let i = 0; i < diff.iconCount && availableIcons.length > 0; i++) {
      const idx = Math.floor(Math.random() * availableIcons.length);
      selectedIcons.push(availableIcons.splice(idx, 1)[0]);
    }

    // 生成牌（保证总数是3的倍数）
    const cards = [];
    let cardId = 0;
    for (const icon of selectedIcons) {
      for (let j = 0; j < diff.cardsPerIcon; j++) {
        cards.push({
          id: cardId++,
          type: icon,
          x: 0,
          y: 0,
          z: 0,
          state: 'visible'
        });
      }
    }

    // 随机分配坐标和层级 - 根据实际棋盘尺寸动态计算
    const boardEl = document.getElementById('sp-match3-board');
    const isMobile = window.innerWidth <= 768;
    const cardWidth = isMobile ? 38 : 44;
    const cardHeight = isMobile ? 38 : 44;
    const boardWidth = boardEl ? boardEl.clientWidth : (isMobile ? 280 : 340);
    const boardHeight = boardEl ? boardEl.clientHeight : (isMobile ? 300 : 360);
    const padding = 8;
    const usableW = boardWidth - padding * 2 - cardWidth;
    const usableH = boardHeight - padding * 2 - cardHeight;

    cards.forEach(card => {
      card.z = Math.floor(Math.random() * diff.layers);
      card.x = padding + Math.floor(Math.random() * usableW);
      card.y = padding + Math.floor(Math.random() * usableH);
    });

    // 按层级排序（低层在前）
    cards.sort((a, b) => a.z - b.z);

    match3State.cards = cards;
    match3State.totalCards = cards.length;
    match3State.slots = [];
    match3State.maxSlots = MATCH3_BASE_SLOTS;
    match3State.propsUsedThisRound = 0;
    match3State.eliminatedGroups = 0;
    match3State.active = true;

    // 计算遮挡关系
    match3UpdateBlockState();
  }

  // ===== 遮挡判定（优化版：按层分组，只检查上层）=====
  function match3UpdateBlockState() {
    const cards = match3State.cards;
    const cardW = 44;
    const cardH = 44;
    const overlapThreshold = 5;

    // 按层分组，只需要拿上层的牌来检查遮挡
    const activeLayers = {};
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (card.state === 'collected' || card.state === 'eliminated') continue;
      if (!activeLayers[card.z]) activeLayers[card.z] = [];
      activeLayers[card.z].push(card);
    }

    const layerKeys = Object.keys(activeLayers).map(Number).sort((a, b) => a - b);

    // 对每个牌，只需要检查比它层级高的牌是否遮挡
    for (let li = 0; li < layerKeys.length; li++) {
      const layer = activeLayers[layerKeys[li]];
      for (let ci = 0; ci < layer.length; ci++) {
        const card = layer[ci];
        let blocked = false;

        // 只检查上层（li+1 到最高层）
        for (let hi = li + 1; hi < layerKeys.length && !blocked; hi++) {
          const upperLayer = activeLayers[layerKeys[hi]];
          for (let ui = 0; ui < upperLayer.length; ui++) {
            const other = upperLayer[ui];
            const overlapX = Math.abs(other.x - card.x) < (cardW - overlapThreshold);
            const overlapY = Math.abs(other.y - card.y) < (cardH - overlapThreshold);
            if (overlapX && overlapY) {
              blocked = true;
              break;
            }
          }
        }

        card.state = blocked ? 'blocked' : 'visible';
      }
    }
  }

  // ===== 点击收集牌 =====
  function match3CollectCard(cardId) {
    if (!match3State.active) return;

    const card = match3State.cards.find(c => c.id === cardId);
    if (!card || card.state !== 'visible') return;

    // 检查暂存栏是否满
    if (match3State.slots.length >= match3State.maxSlots) {
      match3ShowNotice('暂存栏已满！使用道具或消除三个相同图案');
      return;
    }

    // 收集到暂存栏
    card.state = 'collected';
    match3State.slots.push({ type: card.type, id: card.id });

    // 暂存栏排序（相同类型聚集）
    match3State.slots.sort((a, b) => a.type.localeCompare(b.type));

    // 检查三消
    match3CheckEliminate();

    // 更新遮挡
    match3UpdateBlockState();

    // 检查失败
    if (match3State.slots.length >= match3State.maxSlots) {
      // 检查是否有可消除的
      const typeCount = {};
      match3State.slots.forEach(s => { typeCount[s.type] = (typeCount[s.type] || 0) + 1; });
      const hasMatch = Object.values(typeCount).some(c => c >= MATCH3_MATCH_COUNT);
      if (!hasMatch) {
        match3State.active = false;
        setTimeout(() => match3GameOver(false), 300);
      }
    }

    // 胜利检测已在 match3CheckEliminate 中处理，此处不再重复检测

    match3Render();

  }

  // ===== 三消检查 =====
  function match3CheckEliminate() {
    let eliminated = false;

    // 消消看图案→餐厅联动映射表
    // key: MATCH3_DEFAULT_ICONS 中的 emoji
    // value: { type: 'fridge'|'seasoning'|'tanghulu', id: string }
    const MATCH3_RESTAURANT_LINK = {
      '🧂': { type: 'seasoning', id: 'salt' },
      '🫗': { type: 'seasoning', id: 'vinegar' },
      '🌶️': { type: 'seasoning', id: 'chili' },
      '🥟': { type: 'fridge', id: 'dumpling' },
      '🦞': { type: 'fridge', id: 'lobster' },
      '🍜': { type: 'fridge', id: 'noodle' },
      '🥧': { type: 'fridge', id: 'cake' },
      '🍄': { type: 'fridge', id: 'mushroom' },
      '🍰': { type: 'fridge', id: 'cake' },
      '🍇': { type: 'fridge', id: 'grape' },
      '🌙': { type: 'seasoning', id: 'honey' },
      '🥜': { type: 'seasoning', id: 'sesame' },
      '🐳': { type: 'fridge', id: 'fish' },
      '🍬': { type: 'fridge', id: 'icecream' },
      '🌸': { type: 'cleanItem', shopIdx: 1 },
      '🎈': { type: 'energyItem', shopIdx: 0 },
      '🎀': { type: 'cleanItem', shopIdx: 4 },
      '🌈': { type: 'energyItem', shopIdx: 1 },
    };

    while (true) {
      // 查找连续三个相同
      let foundIdx = -1;
      for (let i = 0; i <= match3State.slots.length - MATCH3_MATCH_COUNT; i++) {
        const type = match3State.slots[i].type;
        let count = 1;
        for (let j = i + 1; j < match3State.slots.length && match3State.slots[j].type === type; j++) {
          count++;
        }
        if (count >= MATCH3_MATCH_COUNT) {
          foundIdx = i;
          break;
        }
      }

      if (foundIdx === -1) break;

      // 消除
      const removed = match3State.slots.splice(foundIdx, MATCH3_MATCH_COUNT);
      const eliminatedType = removed[0].type; // 被消除的图案 emoji
      removed.forEach(s => {
        const card = match3State.cards.find(c => c.id === s.id);
        if (card) card.state = 'eliminated';
      });
      match3State.eliminatedGroups++;
      eliminated = true;

      // ===== 消消看→餐厅联动产出 =====
      const link = MATCH3_RESTAURANT_LINK[eliminatedType];
      if (link) {
        if (link.type === 'fridge') {
          if (!state.fridgeInventory) state.fridgeInventory = [];
          const existing = state.fridgeInventory.find(i => i.foodId === link.id);
          if (existing) existing.count++;
          else state.fridgeInventory.push({ foodId: link.id, count: 1 });
        } else if (link.type === 'seasoning') {
          if (!state.restaurantSeasonings) state.restaurantSeasonings = {};
          state.restaurantSeasonings[link.id] = (state.restaurantSeasonings[link.id] || 0) + 1;
        } else if (link.type === 'tanghulu') {
          if (!state.tanghuluInventory) state.tanghuluInventory = [];
          const existing = state.tanghuluInventory.find(i => i.fruitKey === link.id);
          if (existing) existing.count++;
          else state.tanghuluInventory.push({ fruitKey: link.id, count: 1 });
        } else if (link.type === 'cleanItem') {
          if (!state.gameInventory) state.gameInventory = [];
          const existing = state.gameInventory.find(i => i.category === 'clean' && i.idx === link.shopIdx);
          if (existing) existing.count++;
          else state.gameInventory.push({ category: 'clean', idx: link.shopIdx, count: 1 });
        } else if (link.type === 'energyItem') {
          if (!state.gameInventory) state.gameInventory = [];
          const existing = state.gameInventory.find(i => i.category === 'energy' && i.idx === link.shopIdx);
          if (existing) existing.count++;
          else state.gameInventory.push({ category: 'energy', idx: link.shopIdx, count: 1 });
        }
      }
    }

    if (eliminated) {
      // 检查胜利
      const remaining = match3State.cards.filter(c => c.state !== 'collected' && c.state !== 'eliminated');
      if (remaining.length === 0 && match3State.slots.length === 0) {
        match3State.active = false;
        setTimeout(() => match3GameOver(true), 500);
      }
    }
  }


  // ===== 道具使用 =====
  function match3UseProp(propKey) {
    if (!match3State.active) return;

    const prop = MATCH3_PROPS[propKey];
    if (!prop) return;

    // 检查本局道具总用量（上限3）
    if (match3State.propsUsedThisRound >= 3) {
      match3ShowNotice('本局道具已用完（上限3个）！');
      return;
    }

    // 检查背包库存
    if (!state.match3Inventory) state.match3Inventory = { expand: 0, sweep: 0, shuffle: 0 };
    if ((state.match3Inventory[propKey] || 0) <= 0) {
      match3ShowNotice(`${prop.name} 库存不足！去商店购买吧`);
      return;
    }

    // 扣除背包库存
    state.match3Inventory[propKey]--;
    match3State.propsUsedThisRound++;

    // 执行效果
    switch (propKey) {
      case 'expand':
        if (match3State.maxSlots >= MATCH3_MAX_SLOTS) {
          match3ShowNotice('暂存栏已达上限（10格）！');
          // 退还
          state.match3Inventory[propKey]++;
          match3State.propsUsedThisRound--;
          return;
        }
        match3State.maxSlots++;
        match3ShowNotice(`暂存栏扩充为 ${match3State.maxSlots} 格！`);
        break;

      case 'sweep':
        const visibleCards = match3State.cards.filter(c => c.state === 'visible');
        const typeMap = {};
        visibleCards.forEach(c => {
          if (!typeMap[c.type]) typeMap[c.type] = [];
          typeMap[c.type].push(c);
        });
        const sweepTypes = Object.keys(typeMap).filter(t => typeMap[t].length >= 3);
        if (sweepTypes.length === 0) {
          match3ShowNotice('场景中没有3个相同且可见的图案！');
          // 退还
          state.match3Inventory[propKey]++;
          match3State.propsUsedThisRound--;
          return;
        }
        const chosenType = sweepTypes[Math.floor(Math.random() * sweepTypes.length)];
        const toSweep = typeMap[chosenType].slice(0, 3);
        toSweep.forEach(c => { c.state = 'eliminated'; });
        match3State.eliminatedGroups++;
        match3UpdateBlockState();
        match3ShowNotice(`🧹 消除了 3 个 ${chosenType}！`);
        const remaining = match3State.cards.filter(c => c.state !== 'collected' && c.state !== 'eliminated');
        if (remaining.length === 0 && match3State.slots.length === 0) {
          match3State.active = false;
          setTimeout(() => match3GameOver(true), 500);
        }
        break;

      case 'shuffle':
        const activeCards = match3State.cards.filter(c => c.state === 'visible' || c.state === 'blocked');
        if (activeCards.length < 2) {
          match3ShowNotice('场景中牌太少，无法打乱！');
          // 退还
          state.match3Inventory[propKey]++;
          match3State.propsUsedThisRound--;
          return;
        }
        const types = activeCards.map(c => c.type);
        for (let i = types.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [types[i], types[j]] = [types[j], types[i]];
        }
        activeCards.forEach((c, i) => { c.type = types[i]; });
        match3UpdateBlockState();
        match3ShowNotice('🌀 图案已打乱重组！');
        break;
    }

    saveDataDebounced('消消看使用道具');
    match3Render();
  }

  // ===== 消消看商店购买道具 =====
  function match3BuyProp(propKey) {
    const prop = MATCH3_PROPS[propKey];
    if (!prop) return;

    // 检查金币
    if (state.gameGold < prop.price) {
      match3ShowNotice(`金币不足！需要 ${prop.price} 🪙`);
      return;
    }

    // 检查每日限购
    const today = new Date().toISOString().slice(0, 10);
    if (!state.match3ItemPurchaseLog) state.match3ItemPurchaseLog = {};
    if (!state.match3ItemPurchaseLog[today]) state.match3ItemPurchaseLog[today] = {};
    const bought = state.match3ItemPurchaseLog[today][propKey] || 0;
    if (bought >= prop.dailyLimit) {
      match3ShowNotice(`${prop.name} 今日已售罄（限${prop.dailyLimit}个/天）`);
      return;
    }

    // 扣金币，加库存
    state.gameGold -= prop.price;
    state.match3ItemPurchaseLog[today][propKey] = bought + 1;
    if (!state.match3Inventory) state.match3Inventory = { expand: 0, sweep: 0, shuffle: 0 };
    state.match3Inventory[propKey] = (state.match3Inventory[propKey] || 0) + 1;

    match3ShowNotice(`购买了 ${prop.name}，已放入背包！`);
    saveDataDebounced('消消看商店购买');
    match3RenderShop();
    match3RenderBag();
    // 更新金币显示
    const goldEl = document.getElementById('sp-match3-gold');
    if (goldEl) goldEl.textContent = state.gameGold;
  }

  // ===== 消消看背包渲染 =====
  function match3RenderBag() {
    const container = document.getElementById('sp-match3-bag-content');
    if (!container) return;
    if (!state.match3Inventory) state.match3Inventory = { expand: 0, sweep: 0, shuffle: 0 };

    const items = [
      { key: 'expand', ...MATCH3_PROPS.expand, count: state.match3Inventory.expand || 0 },
      { key: 'sweep', ...MATCH3_PROPS.sweep, count: state.match3Inventory.sweep || 0 },
      { key: 'shuffle', ...MATCH3_PROPS.shuffle, count: state.match3Inventory.shuffle || 0 },
    ];

    const hasAny = items.some(i => i.count > 0);

    container.innerHTML = hasAny ? items.map(item => `
      <div class="sp-match3-bag-item ${item.count <= 0 ? 'sp-match3-bag-empty' : ''}">
        <span class="sp-match3-bag-icon">${item.name.split(' ')[0]}</span>
        <div class="sp-match3-bag-info">
          <span class="sp-match3-bag-name">${item.name.split(' ').slice(1).join(' ')}</span>
          <span class="sp-match3-bag-desc">${item.desc}</span>
        </div>
        <span class="sp-match3-bag-count">×${item.count}</span>
      </div>
    `).join('') : '<div style="text-align:center;padding:20px;color:var(--sp-text-muted);font-size:12px;">背包空空如也～去商店买点道具吧</div>';
  }

  // ===== 消消看商店渲染 =====
  function match3RenderShop() {
    const container = document.getElementById('sp-match3-shop-content');
    if (!container) return;

    const today = new Date().toISOString().slice(0, 10);
    const todayLog = (state.match3ItemPurchaseLog && state.match3ItemPurchaseLog[today]) || {};

    const items = Object.entries(MATCH3_PROPS).map(([key, prop]) => {
      const bought = todayLog[key] || 0;
      const soldOut = bought >= prop.dailyLimit;
      const cantAfford = state.gameGold < prop.price;
      const disabled = soldOut || cantAfford;
      const stock = state.match3Inventory?.[key] || 0;
      return { key, ...prop, bought, soldOut, cantAfford, disabled, stock };
    });

    container.innerHTML = items.map(item => `
      <div class="sp-match3-shop-item ${item.disabled ? 'sp-match3-shop-disabled' : ''}">
        <span class="sp-match3-shop-icon">${item.name.split(' ')[0]}</span>
        <div class="sp-match3-shop-info">
          <span class="sp-match3-shop-name">${item.name.split(' ').slice(1).join(' ')}</span>
          <span class="sp-match3-shop-desc">${item.desc}</span>
          <span class="sp-match3-shop-limit">${item.soldOut ? '今日售罄' : `今日剩 ${item.dailyLimit - item.bought} 个`} | 背包: ${item.stock}</span>
        </div>
        <button class="sp-match3-shop-buy" data-prop="${item.key}" ${item.disabled ? 'disabled' : ''}>🪙${item.price}</button>
      </div>
    `).join('');

    container.querySelectorAll('.sp-match3-shop-buy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        match3BuyProp(btn.dataset.prop);
      });
    });
  }

  // ===== 游戏结算 =====
  function match3GameOver(victory) {
    match3State.active = false;

    // 计算金币奖励
    // 计算金币奖励
    const baseReward = match3State.eliminatedGroups * (1 + Math.floor(Math.random() * 2)); // 每组1~2金币
    let bonusReward = 0;
    let bonusMsg = '';

    if (victory) {
      bonusReward = 30 + Math.floor(Math.random() * 31); // 30~60
      bonusMsg = `\n🏆 通关奖励: +${bonusReward} 🪙`;
      // 增加桌宠属性
      state.energy = Math.min(100, state.energy + 1);
      state.hunger = Math.min(100, state.hunger + 1);
      updateMood();
      updateStatusBars();
    }

    const totalGold = baseReward + bonusReward;
    state.gameGold += totalGold;
    saveDataImmediate('消消看结算');

    // 弹出结算面板
    const resultOverlay = document.createElement('div');
    resultOverlay.id = 'sp-match3-result-overlay';
    resultOverlay.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:10;border-radius:16px;';
    resultOverlay.innerHTML = `
      <div class="sp-match3-result-box">
        <div class="sp-match3-result-title">${victory ? '🎉 恭喜通关！' : '😿 游戏结束'}</div>
        <div class="sp-match3-result-info">
          <div>难度: ${match3State.difficulty?.name || '未知'}</div>
          <div>消除组数: ${match3State.eliminatedGroups}</div>
          <div>消除奖励: +${baseReward} 🪙${bonusMsg}</div>
          <div style="font-weight:700;margin-top:6px;">总获得: +${totalGold} 🪙</div>
        </div>
        <div class="sp-match3-result-actions">
          <button class="sp-match3-result-btn" id="sp-match3-restart">🔄 再来一局</button>
          <button class="sp-match3-result-btn sp-match3-result-close" id="sp-match3-quit">❌ 退出</button>
        </div>
      </div>
    `;

    const panel = document.getElementById('sp-match3-panel');
    if (panel) {
      panel.appendChild(resultOverlay);
    }

    document.getElementById('sp-match3-restart')?.addEventListener('click', () => {
      resultOverlay.remove();
      match3ConfirmNewGame();
    });

    document.getElementById('sp-match3-quit')?.addEventListener('click', () => {
      resultOverlay.remove();
      toggleMatch3Game();
    });

  }

  // ===== 消消看通知 =====
  function match3ShowNotice(text) {
    const notice = document.getElementById('sp-match3-notice');
    if (!notice) return;
    notice.textContent = text;
    notice.classList.add('visible');
    clearTimeout(notice._timer);
    notice._timer = setTimeout(() => notice.classList.remove('visible'), 3000);
  }

  // ===== 渲染消消看面板 =====
  function match3Render() {
    const boardEl = document.getElementById('sp-match3-board');
    const slotsEl = document.getElementById('sp-match3-slots');
    const infoEl = document.getElementById('sp-match3-info');
    if (!boardEl || !slotsEl) return;

    // 渲染棋盘（多层堆叠）
    boardEl.innerHTML = '';
    const sortedCards = [...match3State.cards]
      .filter(c => c.state === 'visible' || c.state === 'blocked')
      .sort((a, b) => a.z - b.z || a.y - b.y || a.x - b.x);

    sortedCards.forEach(card => {
      const div = document.createElement('div');
      div.className = `sp-match3-card ${card.state === 'blocked' ? 'sp-match3-blocked' : 'sp-match3-clickable'}`;
      div.dataset.cardId = card.id;
      div.style.left = card.x + 'px';
      div.style.top = card.y + 'px';
      div.style.zIndex = card.z + 1;
      // 检查是否有自定义图片
      const iconIdx = MATCH3_DEFAULT_ICONS.indexOf(card.type);
      const customImg = iconIdx >= 0 ? state.gameCustomImages?.[`match3_icon_${iconIdx}`] : null;
      if (customImg) {
        div.innerHTML = `<img src="${customImg}" style="width:28px;height:28px;object-fit:contain;border-radius:4px;pointer-events:none;" />`;
      } else {
        div.textContent = card.type;
      }

      if (card.state === 'visible') {
        div.addEventListener('click', () => match3CollectCard(card.id));
      }

      boardEl.appendChild(div);
    });

    // 渲染暂存栏
    slotsEl.innerHTML = '';
    for (let i = 0; i < match3State.maxSlots; i++) {
      const slot = document.createElement('div');
      slot.className = 'sp-match3-slot';
      if (match3State.slots[i]) {
        slot.classList.add('sp-match3-slot-filled');
        const slotType = match3State.slots[i].type;
        const slotIconIdx = MATCH3_DEFAULT_ICONS.indexOf(slotType);
        const slotCustomImg = slotIconIdx >= 0 ? state.gameCustomImages?.[`match3_icon_${slotIconIdx}`] : null;
        if (slotCustomImg) {
          slot.innerHTML = `<img src="${slotCustomImg}" style="width:24px;height:24px;object-fit:contain;border-radius:3px;pointer-events:none;" />`;
        } else {
          slot.textContent = slotType;
        }
      } else {
        slot.classList.add('sp-match3-slot-empty');
      }
      slotsEl.appendChild(slot);
    }

    // 渲染信息
    if (infoEl) {
      const remaining = match3State.cards.filter(c => c.state !== 'collected' && c.state !== 'eliminated').length;
      infoEl.innerHTML = `
        <span>剩余: ${remaining}</span>
        <span>已消: ${match3State.eliminatedGroups}组</span>
        <span>难度: ${match3State.difficulty?.name || '-'}</span>
      `;
    }

    // 渲染道具按钮状态（显示背包库存 + 本局已用/上限）
    if (!state.match3Inventory) state.match3Inventory = { expand: 0, sweep: 0, shuffle: 0 };
    const expandBtn = document.getElementById('sp-match3-prop-expand');
    const sweepBtn = document.getElementById('sp-match3-prop-sweep');
    const shuffleBtn = document.getElementById('sp-match3-prop-shuffle');
    if (expandBtn) expandBtn.querySelector('.sp-match3-prop-count').textContent = `×${state.match3Inventory.expand || 0}`;
    if (sweepBtn) sweepBtn.querySelector('.sp-match3-prop-count').textContent = `×${state.match3Inventory.sweep || 0}`;
    if (shuffleBtn) shuffleBtn.querySelector('.sp-match3-prop-count').textContent = `×${state.match3Inventory.shuffle || 0}`;

    // 更新本局道具用量显示
    const propsUsedEl = document.getElementById('sp-match3-props-used');
    if (propsUsedEl) propsUsedEl.textContent = `本局已用: ${match3State.propsUsedThisRound}/3`;

    // 更新金币显示
    const goldEl = document.getElementById('sp-match3-gold');
    if (goldEl) goldEl.textContent = state.gameGold;

    // 控制开始按钮显示/隐藏
    const startWrapper = document.getElementById('sp-match3-start-wrapper');
    if (startWrapper) startWrapper.style.display = match3State.active ? 'none' : 'flex';

  }

  // ===== 消消看面板 =====
  function match3RenderPanel() {
    let panel = document.getElementById('sp-match3-panel');
    if (panel) panel.remove();

    panel = document.createElement('div');
    panel.id = 'sp-match3-panel';
    panel.innerHTML = `
      <div id="sp-match3-header">
        <span>🃏 消消看</span>
        <div class="sp-match3-header-right">
          <button id="sp-match3-minimize" title="缩小悬挂" style="background:none;border:none;font-size:14px;cursor:pointer;color:var(--sp-text-muted);padding:2px 6px;">─</button>
          <button id="sp-match3-close" title="关闭">✕</button>
        </div>
      </div>
      <div id="sp-match3-notice"></div>
      <div style="display:flex;gap:4px;padding:6px 10px;background:rgba(255,255,255,0.03);border-bottom:1px solid var(--sp-border-light);align-items:center;">
        <button class="sp-game-tab active" data-m3tab="play" id="sp-match3-tab-play">🎮 游戏</button>
        <button class="sp-game-tab" data-m3tab="bag" id="sp-match3-tab-bag">🎒 背包</button>
        <button class="sp-game-tab" data-m3tab="shop" id="sp-match3-tab-shop">🛒 商店</button>
        <button class="sp-game-tab" data-m3tab="collection" id="sp-match3-tab-collection">📖 图鉴</button>
        <span class="sp-match3-gold-display" style="margin-left:auto;">🪙 <span id="sp-match3-gold">${state.gameGold}</span></span>
      </div>
      <div id="sp-match3-body">
        <div id="sp-match3-tab-content-play">
          <div id="sp-match3-info"></div>
          <div id="sp-match3-board"></div>
          <div id="sp-match3-slots-wrapper">
            <div id="sp-match3-slots"></div>
          </div>
          <div id="sp-match3-props">
            <button class="sp-match3-prop-btn" id="sp-match3-prop-expand" title="${MATCH3_PROPS.expand.desc}">
              <span class="sp-match3-prop-icon">🪜</span>
              <span class="sp-match3-prop-price">背包使用</span>
              <span class="sp-match3-prop-count">0/${MATCH3_PROPS.expand.perGameLimit}</span>
            </button>
            <button class="sp-match3-prop-btn" id="sp-match3-prop-sweep" title="${MATCH3_PROPS.sweep.desc}">
              <span class="sp-match3-prop-icon">🧹</span>
              <span class="sp-match3-prop-price">背包使用</span>
              <span class="sp-match3-prop-count">0/${MATCH3_PROPS.sweep.perGameLimit}</span>
            </button>
            <button class="sp-match3-prop-btn" id="sp-match3-prop-shuffle" title="${MATCH3_PROPS.shuffle.desc}">
              <span class="sp-match3-prop-icon">🌀</span>
              <span class="sp-match3-prop-price">背包使用</span>
              <span class="sp-match3-prop-count">0/${MATCH3_PROPS.shuffle.perGameLimit}</span>
            </button>
          </div>
          <div id="sp-match3-props-used" style="text-align:center;font-size:10px;color:var(--sp-text-muted);margin-top:4px;">本局已用: 0/3</div>
          <div style="height:8px;"></div>
          <div id="sp-match3-start-wrapper" style="display:flex;justify-content:center;margin-bottom:8px;"><button class="sp-match3-ctrl-btn" id="sp-match3-start-btn" style="background:var(--sp-primary);color:#fff;border-color:var(--sp-primary-border);padding:10px 24px;font-size:13px;">✨ 开始游戏</button></div>
          <div id="sp-match3-controls">
            <button class="sp-match3-ctrl-btn" id="sp-match3-restart-btn">🔄 重开</button>
            <button class="sp-match3-ctrl-btn sp-match3-ctrl-quit" id="sp-match3-end-btn">❌ 结束</button>
          </div>
        </div>
        <div id="sp-match3-tab-content-bag" style="display:none;padding:8px;">
          <div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:8px;">🎒 道具背包</div>
          <div id="sp-match3-bag-content"></div>
        </div>
        <div id="sp-match3-tab-content-shop" style="display:none;padding:8px;">
          <div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:8px;">🛒 道具商店 <span style="font-size:10px;color:var(--sp-text-muted);font-weight:400;">（每种每天限购10个）</span></div>
          <div id="sp-match3-shop-content"></div>
        </div>
        <div id="sp-match3-tab-content-collection" style="display:none;">
          <div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:8px;">📖 图案图鉴 <span style="font-size:10px;color:var(--sp-text-muted);font-weight:400;">（点击 📷 上传自定义图片）</span></div>
          <div id="sp-match3-collection-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;"></div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // 最小化
    document.getElementById('sp-match3-minimize').addEventListener('click', () => {
      const m3Panel = document.getElementById('sp-match3-panel');
      const minBtn = document.getElementById('sp-match3-minimize');
      if (!m3Panel || !minBtn) return;
      if (m3Panel.classList.contains('sp-match3-minimized')) {
        m3Panel.classList.remove('sp-match3-minimized');
        minBtn.textContent = '─';
        minBtn.title = '缩小悬挂';
      } else {
        m3Panel.classList.add('sp-match3-minimized');
        minBtn.textContent = '□';
        minBtn.title = '恢复窗口';
      }
    });

    // 关闭按钮
    document.getElementById('sp-match3-close').addEventListener('click', () => toggleMatch3Game());

    // 道具按钮
    document.getElementById('sp-match3-prop-expand').addEventListener('click', () => match3UseProp('expand'));
    document.getElementById('sp-match3-prop-sweep').addEventListener('click', () => match3UseProp('sweep'));
    document.getElementById('sp-match3-prop-shuffle').addEventListener('click', () => match3UseProp('shuffle'));

    // 开始游戏按钮
    document.getElementById('sp-match3-start-btn')?.addEventListener('click', () => {
      match3ConfirmNewGame();
    });


    // 重开按钮
    document.getElementById('sp-match3-restart-btn').addEventListener('click', () => {
      showConfirmDialog({
        title: '🔄 重开本局？',
        desc: '当前进度将清零，重新开始新的一局。<br/>将消耗一定体力。',
        confirmText: '重开',
        cancelText: '继续玩',
        onConfirm: () => {
          if (state.gameStamina < 5) {
            match3ShowNotice('体力不足！开一局需要 5 点体力');
            return;
          }
          state.gameStamina -= 5;
          saveDataDebounced('消消看重开扣体力');
          match3GenerateLevel();
          match3Render();
          match3ShowNotice(`🔄 新的一局开始了！（-5⚡）| 难度: ${match3State.difficulty?.name || '未知'}`);
          if (isGameOpen) gameRenderStatus();
        }
      });
    });


    // 结束按钮
    document.getElementById('sp-match3-end-btn').addEventListener('click', () => {
      showConfirmDialog({
        title: '❌ 结束本局？',
        desc: `将按当前已消除组数结算金币。<br/>已消除: ${match3State.eliminatedGroups} 组`,
        confirmText: '结算退出',
        cancelText: '继续玩',
        onConfirm: () => {
          match3State.active = false;
          const baseReward = match3State.eliminatedGroups * (1 + Math.floor(Math.random() * 2));
          state.gameGold += baseReward;
          saveDataImmediate('消消看手动结束');
          match3ShowNotice(`结算完成！消除 ${match3State.eliminatedGroups} 组，获得 +${baseReward} 🪙`);
          // 延迟后弹出新局确认
          setTimeout(() => {
            match3ConfirmNewGame();
          }, 1500);
        }
      });
    });


    // 标签页切换
    const m3Tabs = ['play', 'bag', 'shop', 'collection'];
    m3Tabs.forEach(tabName => {
      const tabBtn = document.getElementById(`sp-match3-tab-${tabName}`);
      if (tabBtn) {
        tabBtn.addEventListener('click', () => {
          // 切换按钮高亮
          m3Tabs.forEach(t => {
            const b = document.getElementById(`sp-match3-tab-${t}`);
            if (b) b.classList.toggle('active', t === tabName);
          });
          // 切换内容面板
          document.getElementById('sp-match3-tab-content-play').style.display = tabName === 'play' ? '' : 'none';
          document.getElementById('sp-match3-tab-content-bag').style.display = tabName === 'bag' ? '' : 'none';
          document.getElementById('sp-match3-tab-content-shop').style.display = tabName === 'shop' ? '' : 'none';
          document.getElementById('sp-match3-tab-content-collection').style.display = tabName === 'collection' ? '' : 'none';
          // 切换时渲染对应内容
          if (tabName === 'bag') match3RenderBag();
          if (tabName === 'shop') match3RenderShop();
          if (tabName === 'collection') match3RenderCollection();
        });
      }
    });

    // 面板拖拽
    match3BindPanelDrag();
  }

  // ===== 消消看图鉴渲染 =====
  function match3RenderCollection() {
    const grid = document.getElementById('sp-match3-collection-grid');
    if (!grid) return;

    if (!state.gameCustomImages) state.gameCustomImages = {};

    grid.innerHTML = MATCH3_DEFAULT_ICONS.map((icon, idx) => {
      const key = `match3_icon_${idx}`;
      const custom = state.gameCustomImages[key];
      const display = custom
        ? `<img src="${custom}" style="width:28px;height:28px;object-fit:contain;border-radius:4px;" />`
        : `<span style="font-size:22px;">${icon}</span>`;
      return `
        <div style="aspect-ratio:1;border-radius:8px;border:2px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;position:relative;cursor:pointer;overflow:hidden;transition:all 0.15s;" data-match3-icon-idx="${idx}">
          ${display}
          <span style="font-size:8px;color:var(--sp-text-muted);">${icon}</span>
          <div class="sp-match3-icon-upload" data-idx="${idx}" style="position:absolute;top:2px;right:2px;width:16px;height:16px;border-radius:50%;background:rgba(0,0,0,0.6);color:#fff;font-size:9px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity 0.2s;">📷</div>
        </div>
      `;
    }).join('');

    // hover 显示上传按钮
    grid.querySelectorAll('[data-match3-icon-idx]').forEach(item => {
      item.addEventListener('mouseenter', () => {
        const btn = item.querySelector('.sp-match3-icon-upload');
        if (btn) btn.style.opacity = '1';
      });
      item.addEventListener('mouseleave', () => {
        const btn = item.querySelector('.sp-match3-icon-upload');
        if (btn) btn.style.opacity = '0';
      });
    });

    // 上传按钮
    grid.querySelectorAll('.sp-match3-icon-upload').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
        match3PromptIconUpload(idx);
      });
    });
  }

  // ===== 消消看图案上传 =====
  function match3PromptIconUpload(idx) {
    const key = `match3_icon_${idx}`;
    if (!state.gameCustomImages) state.gameCustomImages = {};
    const currentImg = state.gameCustomImages[key];

    // 如果已有图片，先问是否要移除
    if (currentImg) {
      const action = confirm(`图案 ${MATCH3_DEFAULT_ICONS[idx]} 已有自定义图片\n\n点「确定」→ 移除图片（恢复默认emoji）\n点「取消」→ 替换为新图片`);
      if (action) {
        delete state.gameCustomImages[key];
        saveDataImmediate('消消看图案移除');
        match3RenderCollection();
        match3ShowNotice('图片已移除，恢复默认显示');
        return;
      }
    }

    const choice = confirm(`设置图案 ${MATCH3_DEFAULT_ICONS[idx]} 的自定义图片\n\n点「确定」→ 输入图片链接\n点「取消」→ 选择本地文件上传`);

    if (choice) {
      const url = prompt('输入图片链接（留空确认=清除）：', currentImg && currentImg.startsWith('http') ? currentImg : '');
      if (url === null) return;
      const trimmed = url.trim();
      if (!trimmed) {
        delete state.gameCustomImages[key];
        saveDataImmediate('消消看图案清除');
        match3RenderCollection();
        match3ShowNotice('图片已清除');
        return;
      }
      if (!trimmed.startsWith('http')) {
        match3ShowNotice('链接需要以 http 开头');
        return;
      }
      state.gameCustomImages[key] = trimmed;
      saveDataImmediate('消消看图案链接');
      match3RenderCollection();
      match3ShowNotice('图案图片已设置！');
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/png,image/jpeg,image/gif,image/webp';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
          match3ShowNotice('图片不能超过2MB');
          return;
        }
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const compressed = await compressImage(ev.target.result, 80, 0.7);
          if (!state.gameCustomImages) state.gameCustomImages = {};
          state.gameCustomImages[key] = compressed;
          saveDataImmediate('消消看图案上传');
          match3RenderCollection();
          match3ShowNotice('图案图片已设置！');
        };
        reader.readAsDataURL(file);
      };
      input.click();
    }
  }

  // ===== 面板拖拽 =====
  function match3BindPanelDrag() {
    const header = document.getElementById('sp-match3-header');
    const panel = document.getElementById('sp-match3-panel');
    if (!header || !panel) return;

    let dragging = false, offX = 0, offY = 0;

    const down = (e) => {
      if (e.target.closest('#sp-match3-close')) return;
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

  // ===== 开关消消看面板 =====
  // ===== 开关消消看面板 =====
  function toggleMatch3Game() {
    isMatch3Open = !isMatch3Open;
    let panel = document.getElementById('sp-match3-panel');

    if (isMatch3Open) {
      // 每次打开都重新创建面板（动态挂载）
      if (panel) panel.remove();
      match3RenderPanel();
      panel = document.getElementById('sp-match3-panel');

      panel.classList.add('visible');

      // 居中
      const w = Math.min(380, window.innerWidth - 20);
      panel.style.width = w + 'px';
      requestAnimationFrame(() => {
        const h = panel.offsetHeight;
        const maxTop = window.innerHeight - h - 20;
        const centerTop = Math.floor((window.innerHeight - h) / 2);
        panel.style.left = Math.floor((window.innerWidth - w) / 2) + 'px';
        panel.style.top = Math.max(10, Math.min(centerTop, maxTop)) + 'px';
      });

      // 如果没有活跃游戏，只渲染面板，不自动弹窗
      match3Render();

    } else {
      // 彻底销毁 DOM
      if (panel) panel.remove();
    }
  }

  // ===== 消消看开局确认弹窗 =====
  function match3ConfirmNewGame() {
    showConfirmDialog({
      title: '🃏 开始新一局消消看？',
      desc: '开局将消耗一定体力，难度随机分配。<br/>准备好了吗？',
      confirmText: '✨ 开始',
      cancelText: '算了',
      onConfirm: () => {
        if (state.gameStamina < 5) {
          match3ShowNotice('体力不足！开一局需要 5 点体力');
          return;
        }
        state.gameStamina -= 5;
        saveDataDebounced('消消看开局扣体力');
        match3GenerateLevel();
        match3Render();
        match3ShowNotice(`开局消耗 5 点体力⚡ | 难度: ${match3State.difficulty?.name || '未知'}`);
        if (isGameOpen) gameRenderStatus();
      },
      onCancel: () => {
        // 不开局，留在游戏面板
      }

    });
  }

  // ============================================================
  // 🎰 幸运抽奖模块
  // ============================================================

  // ===== 奖池定义 =====
  // 每个奖池有 cost（花费金币）和 items（奖励池）
  // weight 越小越难抽中
  const LOTTERY_POOLS = [
    {
      id: 'small',
      name: '🎲 小试牛刀',
      cost: 10,
      dailyLimit: 10,
      desc: '10金币一抽，适合日常（每日限10次）',
      items: [
        // ===== 🪙 金币 =====
        { type: 'gold', value: 1,  label: '1 🪙',  weight: 300 },
        { type: 'gold', value: 2,  label: '2 🪙',  weight: 200 },
        { type: 'gold', value: 3,  label: '3 🪙',  weight: 150 },
        { type: 'gold', value: 5,  label: '5 🪙',  weight: 100 },
        { type: 'gold', value: 8,  label: '8 🪙',  weight: 60  },
        { type: 'gold', value: 10, label: '10 🪙', weight: 30  },

        // ===== 🃏 消消看道具 =====
        { type: 'match3prop', key: 'shuffle', label: '🌀 混沌风暴 ×1', weight: 25 },
        { type: 'match3prop', key: 'expand',  label: '🪜 扩充神架 ×1', weight: 15 },
        { type: 'match3prop', key: 'sweep',   label: '🧹 魔法扫帚 ×1', weight: 10 },

        // ===== 🔗 连连看道具 =====
        { type: 'linkprop', key: 'hint',    label: '🔍 寻路放大镜 ×1', weight: 20 },
        { type: 'linkprop', key: 'shuffle', label: '🌀 重组旋风 ×1',   weight: 15 },
        { type: 'linkprop', key: 'bomb',    label: '💣 友情炸弹 ×1',   weight: 8  },
        { type: 'linkprop', key: 'compass', label: '🧭 罗盘透视 ×1',   weight: 10 },

        // ===== 🛒 货架整理道具 =====
        { type: 'shelfprop', key: 'shuffle',   label: '🔄 货架大洗牌 ×1', weight: 20 },
        { type: 'shelfprop', key: 'autoMatch', label: '🧹 喵喵爪理货 ×1', weight: 15 },

        // ===== 🧊 冰箱道具 =====
        { type: 'fridgeprop', key: 'organize', label: '🧹 一键整理 ×1', weight: 20 },
        { type: 'fridgeprop', key: 'compress', label: '🧃 压缩魔法 ×1', weight: 15 },

        // ===== 🍢 糖葫芦道具 =====
        { type: 'tanghuluprop', key: 'undo',      label: '↩️ 悔步撤销 ×1', weight: 20 },
        { type: 'tanghuluprop', key: 'lubricant', label: '🌀 顺滑剂 ×1',   weight: 15 },

        // ===== ⚡ 体力道具 =====
        { type: 'staminaitem', key: 'stamina30', label: '🧃 小能量瓶 ×1', weight: 15 },

        // ===== 🍖 工坊道具（喂食/清洁/睡眠）=====
        { type: 'shopitem', category: 'food',   idx: 0, label: '🐟 小鱼干 ×1',      weight: 20 },
        { type: 'shopitem', category: 'clean',  idx: 0, label: '🧻 湿纸巾 ×1',      weight: 20 },
        { type: 'shopitem', category: 'energy', idx: 0, label: '🌿 猫薄荷枕 ×1',    weight: 20 },
        { type: 'shopitem', category: 'food',   idx: 4, label: '🍙 秘制猫饭团 ×1',  weight: 18 },
        { type: 'shopitem', category: 'clean',  idx: 4, label: '🪻 薰衣草香氛球 ×1', weight: 18 },
        { type: 'shopitem', category: 'energy', idx: 4, label: '🕯️ 安神小夜灯 ×1',  weight: 18 },

        // ===== 🧶 合成棋盘物品（Lv1~2）=====
        { type: 'boarditem', chain: 'toy',       level: 1, label: '🧶 线团 (Lv1)',       weight: 8 },
        { type: 'boarditem', chain: 'food',      level: 1, label: '🌾 面粉 (Lv1)',       weight: 8 },
        { type: 'boarditem', chain: 'gem',       level: 1, label: '✨ 碎晶 (Lv1)',       weight: 8 },
        { type: 'boarditem', chain: 'potion',    level: 1, label: '🌿 杂草 (Lv1)',       weight: 8 },
        { type: 'boarditem', chain: 'music',     level: 1, label: '🔔 小铃铛 (Lv1)',     weight: 8 },
        { type: 'boarditem', chain: 'flower',    level: 1, label: '🌱 小嫩芽 (Lv1)',     weight: 8 },
        { type: 'boarditem', chain: 'star',      level: 1, label: '💧 露水珠 (Lv1)',     weight: 8 },
        { type: 'boarditem', chain: 'seasoning', level: 1, label: '🧂 粗盐粒 (Lv1)',     weight: 8 },
        { type: 'boarditem', chain: 'music',     level: 2, label: '🎶 音符碎片 (Lv2)',   weight: 5 },
        { type: 'boarditem', chain: 'flower',    level: 2, label: '🌼 雏菊 (Lv2)',       weight: 5 },
        { type: 'boarditem', chain: 'star',      level: 2, label: '❄️ 霜晶 (Lv2)',       weight: 5 },
        { type: 'boarditem', chain: 'seasoning', level: 2, label: '🫙 酿造酱油 (Lv2)',   weight: 5 },

        // ===== 🥬 基础蔬菜 =====
        { type: 'groceryitem', foodId: 'potato', label: '🥔 土豆 ×2', count: 2, weight: 15 },
        { type: 'groceryitem', foodId: 'onion',  label: '🧅 洋葱 ×2', count: 2, weight: 15 },
        { type: 'groceryitem', foodId: 'garlic', label: '🧄 大蒜 ×3', count: 3, weight: 18 },
        { type: 'groceryitem', foodId: 'leek',   label: '🌿 大葱 ×3', count: 3, weight: 18 },

        // ===== 🍢 糖葫芦（基础品种）=====
        { type: 'tanghuluItem', fruitKey: 'strawberry', label: '🍓 甜心草莓糖葫芦 ×1',   count: 1, weight: 12 },
        { type: 'tanghuluItem', fruitKey: 'orange',     label: '🍊 蜜桔瓣儿糖葫芦 ×1',   count: 1, weight: 12 },
        { type: 'tanghuluItem', fruitKey: 'banana',     label: '🍌 香蕉片儿糖葫芦 ×1',   count: 1, weight: 12 },
        { type: 'tanghuluItem', fruitKey: 'tomato',     label: '🍅 经典圣女果糖葫芦 ×1', count: 1, weight: 12 },
        // ===== ⚡ 体力链碎片 =====
        { type: 'boarditem', chain: 'stamina', level: 1, label: '💧 体力露珠 (Lv1)', weight: 5 },
      ]
    },

    {
      id: 'medium',
      name: '✨ 锦鲤附体',
      cost: 30,
      dailyLimit: 5,
      desc: '30金币一抽，中等奖励（每日限5次）',
      items: [
        // ===== 🪙 金币 =====
        { type: 'gold', value: 5,  label: '5 🪙',  weight: 200 },
        { type: 'gold', value: 8,  label: '8 🪙',  weight: 150 },
        { type: 'gold', value: 10, label: '10 🪙', weight: 100 },
        { type: 'gold', value: 15, label: '15 🪙', weight: 60  },
        { type: 'gold', value: 20, label: '20 🪙', weight: 30  },

        // ===== 🃏 消消看道具 =====
        { type: 'match3prop', key: 'shuffle', label: '🌀 混沌风暴 ×2', count: 2, weight: 40 },
        { type: 'match3prop', key: 'expand',  label: '🪜 扩充神架 ×2', count: 2, weight: 25 },
        { type: 'match3prop', key: 'sweep',   label: '🧹 魔法扫帚 ×2', count: 2, weight: 15 },

        // ===== 🛒 货架整理道具 =====
        { type: 'shelfprop', key: 'shuffle',   label: '🔄 货架大洗牌 ×2', count: 2, weight: 25 },
        { type: 'shelfprop', key: 'autoMatch', label: '🧹 喵喵爪理货 ×2', count: 2, weight: 20 },
        { type: 'shelfprop', key: 'basket',    label: '🪵 临时扩展篮 ×1', weight: 12 },

        // ===== 🧊 冰箱道具 =====
        { type: 'fridgeprop', key: 'organize', label: '🧹 一键整理 ×2', count: 2, weight: 25 },
        { type: 'fridgeprop', key: 'compress', label: '🧃 压缩魔法 ×2', count: 2, weight: 20 },
        { type: 'fridgeprop', key: 'backpack', label: '🎒 放进背包 ×1', weight: 12 },

        // ===== 🍢 糖葫芦道具 =====
        { type: 'tanghuluprop', key: 'undo',       label: '↩️ 悔步撤销 ×2', count: 2, weight: 25 },
        { type: 'tanghuluprop', key: 'lubricant',  label: '🌀 顺滑剂 ×2',   count: 2, weight: 20 },
        { type: 'tanghuluprop', key: 'extraStick', label: '🥢 赠送竹签 ×1', weight: 12 },

        // ===== ⚡ 体力道具 =====
        { type: 'staminaitem', key: 'stamina50', label: '🥤 中能量罐 ×1', weight: 20 },

        // ===== 🍖 工坊道具（中级）=====
        { type: 'shopitem', category: 'food',   idx: 1, label: '🥫 猫罐头 ×1',       weight: 30 },
        { type: 'shopitem', category: 'clean',  idx: 1, label: '🧴 猫咪沐浴露 ×1',   weight: 30 },
        { type: 'shopitem', category: 'energy', idx: 1, label: '🧣 温暖毛毯 ×1',     weight: 30 },
        { type: 'shopitem', category: 'food',   idx: 5, label: '🥮 鲷鱼烧点心 ×1',   weight: 15 },
        { type: 'shopitem', category: 'clean',  idx: 5, label: '🧪 温泉浴盐罐 ×1',   weight: 15 },
        { type: 'shopitem', category: 'energy', idx: 5, label: '🎶 星空催眠曲盒 ×1', weight: 15 },

        // ===== 🧶 合成棋盘物品（Lv2~3）=====
        { type: 'boarditem', chain: 'toy',       level: 2, label: '🐭 逗猫棒 (Lv2)',     weight: 20 },
        { type: 'boarditem', chain: 'food',      level: 2, label: '🍞 面包 (Lv2)',        weight: 20 },
        { type: 'boarditem', chain: 'gem',       level: 2, label: '🔮 魔法水晶 (Lv2)',   weight: 20 },
        { type: 'boarditem', chain: 'potion',    level: 2, label: '🍀 四叶草 (Lv2)',     weight: 20 },
        { type: 'boarditem', chain: 'music',     level: 2, label: '🎶 音符碎片 (Lv2)',   weight: 20 },
        { type: 'boarditem', chain: 'flower',    level: 2, label: '🌼 雏菊 (Lv2)',       weight: 20 },
        { type: 'boarditem', chain: 'star',      level: 2, label: '❄️ 霜晶 (Lv2)',       weight: 20 },
        { type: 'boarditem', chain: 'seasoning', level: 2, label: '🫙 酿造酱油 (Lv2)',   weight: 20 },
        { type: 'boarditem', chain: 'toy',       level: 3, label: '🧸 毛绒小熊 (Lv3)',   weight: 8  },
        { type: 'boarditem', chain: 'food',      level: 3, label: '🍰 草莓蛋糕 (Lv3)',   weight: 8  },
        { type: 'boarditem', chain: 'gem',       level: 3, label: '💍 灵力戒指 (Lv3)',   weight: 8  },
        { type: 'boarditem', chain: 'potion',    level: 3, label: '🧪 初级药水 (Lv3)',   weight: 8  },
        { type: 'boarditem', chain: 'music',     level: 3, label: '🎸 迷你吉他 (Lv3)',   weight: 8  },
        { type: 'boarditem', chain: 'flower',    level: 3, label: '🌷 郁金香 (Lv3)',     weight: 8  },
        { type: 'boarditem', chain: 'star',      level: 3, label: '🌙 月光碎片 (Lv3)',   weight: 8  },
        { type: 'boarditem', chain: 'seasoning', level: 3, label: '🌶️ 研磨胡椒 (Lv3)',   weight: 8  },

        // ===== 🥬 基础蔬菜 =====
        { type: 'groceryitem', foodId: 'potato',   label: '🥔 土豆 ×5',   count: 5, weight: 15 },
        { type: 'groceryitem', foodId: 'eggplant', label: '🍆 茄子 ×3',   count: 3, weight: 12 },
        { type: 'groceryitem', foodId: 'broccoli', label: '🥦 西兰花 ×3', count: 3, weight: 12 },
        { type: 'groceryitem', foodId: 'cabbage',  label: '🥬 卷心菜 ×3', count: 3, weight: 12 },
        { type: 'groceryitem', foodId: 'ginger',   label: '🫚 生姜 ×4',   count: 4, weight: 15 },

        // ===== 🍢 糖葫芦（中档品种）=====
        { type: 'tanghuluItem', fruitKey: 'strawberry',  label: '🍓 甜心草莓糖葫芦 ×2',   count: 2, weight: 10 },
        { type: 'tanghuluItem', fruitKey: 'orange',      label: '🍊 蜜桔瓣儿糖葫芦 ×2',   count: 2, weight: 8  },
        { type: 'tanghuluItem', fruitKey: 'kiwi',        label: '🥝 翡翠猕猴桃糖葫芦 ×1', count: 1, weight: 10 },
        { type: 'tanghuluItem', fruitKey: 'grape',       label: '🍇 晶莹葡萄糖葫芦 ×1',   count: 1, weight: 10 },
        { type: 'tanghuluItem', fruitKey: 'cherry',      label: '🍒 玛瑙樱桃糖葫芦 ×1',   count: 1, weight: 10 },
        { type: 'tanghuluItem', fruitKey: 'blueberry',   label: '🫐 冰晶蓝莓糖葫芦 ×1',   count: 1, weight: 10 },
        { type: 'tanghuluItem', fruitKey: 'coconut',     label: '🥥 椰子奶球糖葫芦 ×1',   count: 1, weight: 10 },
        { type: 'tanghuluItem', fruitKey: 'pineapple',   label: '🍍 金菠萝块糖葫芦 ×1',   count: 1, weight: 10 },
        { type: 'tanghuluItem', fruitKey: 'watermelon',  label: '🍉 迷你西瓜球糖葫芦 ×1', count: 1, weight: 10 },
        // ===== ⚡ 体力链碎片 =====
        { type: 'boarditem', chain: 'stamina', level: 1, label: '💧 体力露珠 (Lv1)', weight: 12 },
        { type: 'boarditem', chain: 'stamina', level: 2, label: '🫧 活力泡泡 (Lv2)', weight: 6 },
      ]
    },

    {
      id: 'large',
      name: '💫 欧皇时刻',
      cost: 50,
      dailyLimit: 3,
      desc: '50金币一抽，高价值奖励（每日限3次）',
      items: [
        // ===== 🪙 金币 =====
        { type: 'gold', value: 10, label: '10 🪙', weight: 200 },
        { type: 'gold', value: 15, label: '15 🪙', weight: 150 },
        { type: 'gold', value: 20, label: '20 🪙', weight: 100 },
        { type: 'gold', value: 30, label: '30 🪙', weight: 50  },
        { type: 'gold', value: 50, label: '50 🪙', weight: 15  },

        // ===== 🃏 消消看道具（大包）=====
        { type: 'match3prop', key: 'shuffle', label: '🌀 混沌风暴 ×3', count: 3, weight: 50 },
        { type: 'match3prop', key: 'expand',  label: '🪜 扩充神架 ×3', count: 3, weight: 30 },
        { type: 'match3prop', key: 'sweep',   label: '🧹 魔法扫帚 ×3', count: 3, weight: 20 },

        // ===== 🛒 货架整理道具 =====
        { type: 'shelfprop', key: 'shuffle',   label: '🔄 货架大洗牌 ×3', count: 3, weight: 30 },
        { type: 'shelfprop', key: 'autoMatch', label: '🧹 喵喵爪理货 ×3', count: 3, weight: 25 },
        { type: 'shelfprop', key: 'basket',    label: '🪵 临时扩展篮 ×2', count: 2, weight: 15 },

        // ===== 🧊 冰箱道具 =====
        { type: 'fridgeprop', key: 'organize', label: '🧹 一键整理 ×3', count: 3, weight: 30 },
        { type: 'fridgeprop', key: 'compress', label: '🧃 压缩魔法 ×3', count: 3, weight: 25 },
        { type: 'fridgeprop', key: 'backpack', label: '🎒 放进背包 ×2', count: 2, weight: 15 },

        // ===== 🍢 糖葫芦道具 =====
        { type: 'tanghuluprop', key: 'undo',       label: '↩️ 悔步撤销 ×3', count: 3, weight: 30 },
        { type: 'tanghuluprop', key: 'lubricant',  label: '🌀 顺滑剂 ×3',   count: 3, weight: 25 },
        { type: 'tanghuluprop', key: 'extraStick', label: '🥢 赠送竹签 ×2', count: 2, weight: 15 },

        // ===== ⚡ 体力道具 =====
        { type: 'staminaitem', key: 'stamina100', label: '🪫 满能量桶 ×1', weight: 10 },
        { type: 'staminaitem', key: 'stamina50',  label: '🥤 中能量罐 ×2', count: 2, weight: 20 },

        // ===== 🍖 工坊道具（高级）=====
        { type: 'shopitem', category: 'food',   idx: 2, label: '🍗 豪华猫粮 ×1',    weight: 25 },
        { type: 'shopitem', category: 'clean',  idx: 2, label: '🫧 自动清洁机 ×1',  weight: 25 },
        { type: 'shopitem', category: 'energy', idx: 2, label: '🛏️ 舒适猫窝 ×1',   weight: 25 },
        { type: 'shopitem', category: 'food',   idx: 3, label: '🍱 满汉全席 ×1',    weight: 5  },
        { type: 'shopitem', category: 'clean',  idx: 3, label: '🛁 SPA豪华套餐 ×1', weight: 5  },
        { type: 'shopitem', category: 'energy', idx: 3, label: '💊 梦境胶囊 ×1',    weight: 5  },
        { type: 'shopitem', category: 'food',   idx: 5, label: '🥮 鲷鱼烧点心 ×2', count: 2, weight: 8 },
        { type: 'shopitem', category: 'clean',  idx: 5, label: '🧪 温泉浴盐罐 ×2', count: 2, weight: 8 },
        { type: 'shopitem', category: 'energy', idx: 5, label: '🎶 星空催眠曲盒 ×2', count: 2, weight: 8 },

        // ===== 🧶 合成棋盘物品（Lv3~5）=====
        { type: 'boarditem', chain: 'toy',       level: 3, label: '🧸 毛绒小熊 (Lv3)', weight: 30 },
        { type: 'boarditem', chain: 'food',      level: 3, label: '🍰 草莓蛋糕 (Lv3)', weight: 30 },
        { type: 'boarditem', chain: 'gem',       level: 3, label: '💍 灵力戒指 (Lv3)', weight: 30 },
        { type: 'boarditem', chain: 'potion',    level: 3, label: '🧪 初级药水 (Lv3)',  weight: 30 },
        { type: 'boarditem', chain: 'music',     level: 3, label: '🎸 迷你吉他 (Lv3)', weight: 30 },
        { type: 'boarditem', chain: 'flower',    level: 3, label: '🌷 郁金香 (Lv3)',   weight: 30 },
        { type: 'boarditem', chain: 'star',      level: 3, label: '🌙 月光碎片 (Lv3)', weight: 30 },
        { type: 'boarditem', chain: 'seasoning', level: 3, label: '🌶️ 研磨胡椒 (Lv3)', weight: 30 },
        { type: 'boarditem', chain: 'toy',       level: 4, label: '🎮 复古掌机 (Lv4)',   weight: 12 },
        { type: 'boarditem', chain: 'food',      level: 4, label: '🍬 豪华糖果罐 (Lv4)', weight: 12 },
        { type: 'boarditem', chain: 'gem',       level: 4, label: '👑 璀璨王冠 (Lv4)',   weight: 12 },
        { type: 'boarditem', chain: 'potion',    level: 4, label: '⚗️ 炼金溶液 (Lv4)',   weight: 12 },
        { type: 'boarditem', chain: 'music',     level: 4, label: '🎹 水晶钢琴 (Lv4)',   weight: 12 },
        { type: 'boarditem', chain: 'flower',    level: 4, label: '🌹 红玫瑰 (Lv4)',     weight: 12 },
        { type: 'boarditem', chain: 'star',      level: 4, label: '☀️ 日耀石 (Lv4)',     weight: 12 },
        { type: 'boarditem', chain: 'seasoning', level: 4, label: '🧈 发酵黄油 (Lv4)',   weight: 12 },
        { type: 'boarditem', chain: 'toy',       level: 5, label: '🏰 黄金猫爬架 (Lv5)', weight: 3 },
        { type: 'boarditem', chain: 'food',      level: 5, label: '🧪 极品猫薄荷 (Lv5)', weight: 3 },
        { type: 'boarditem', chain: 'gem',       level: 5, label: '🐉 龙之心宝石 (Lv5)', weight: 3 },
        { type: 'boarditem', chain: 'potion',    level: 5, label: '🪄 魔法精华 (Lv5)',   weight: 3 },
        { type: 'boarditem', chain: 'music',     level: 5, label: '🎺 黄金号角 (Lv5)',   weight: 3 },
        { type: 'boarditem', chain: 'flower',    level: 5, label: '🪷 七色莲花 (Lv5)',   weight: 3 },
        { type: 'boarditem', chain: 'star',      level: 5, label: '🌠 流星核心 (Lv5)',   weight: 3 },
        { type: 'boarditem', chain: 'seasoning', level: 5, label: '🍯 百花蜂蜜 (Lv5)', weight: 3 },

        // ===== 🥬 基础蔬菜（大礼包）=====
        { type: 'groceryitem', foodId: 'pumpkin',  label: '🎃 南瓜 ×3',   count: 3, weight: 10 },
        { type: 'groceryitem', foodId: 'broccoli', label: '🥦 西兰花 ×5', count: 5, weight: 12 },
        { type: 'groceryitem', foodId: 'eggplant', label: '🍆 茄子 ×5',   count: 5, weight: 12 },
        { type: 'groceryitem', foodId: 'potato',   label: '🥔 土豆 ×8',   count: 8, weight: 8  },
        { type: 'groceryitem', foodId: 'cabbage',  label: '🥬 卷心菜 ×5', count: 5, weight: 10 },

        // ===== 🍢 糖葫芦（稀有 & 高价品种）=====
        { type: 'tanghuluItem', fruitKey: 'peach',       label: '🍑 蜜汁水蜜桃糖葫芦 ×2',   count: 2, weight: 8 },
        { type: 'tanghuluItem', fruitKey: 'mango',       label: '🥭 热带金芒果糖葫芦 ×2',   count: 2, weight: 5 },
        { type: 'tanghuluItem', fruitKey: 'lychee',      label: '🪷 玲珑荔枝糖葫芦 ×2',     count: 2, weight: 4 },
        { type: 'tanghuluItem', fruitKey: 'blueberry',   label: '🫐 冰晶蓝莓糖葫芦 ×3',     count: 3, weight: 3 },
        { type: 'tanghuluItem', fruitKey: 'dragonfruit', label: '🐲 火龙果晶球糖葫芦 ×2',   count: 2, weight: 6 },
        { type: 'tanghuluItem', fruitKey: 'fig',         label: '🫒 蜜糖无花果糖葫芦 ×2',   count: 2, weight: 5 },
        { type: 'tanghuluItem', fruitKey: 'starfruit',   label: '⭐ 星星杨桃糖葫芦 ×2',     count: 2, weight: 6 },
        // ===== 🍢 糖葫芦（经典品种大包）=====
        { type: 'tanghuluItem', fruitKey: 'cherry',      label: '🍒 玛瑙樱桃糖葫芦 ×3',     count: 3, weight: 6 },
        { type: 'tanghuluItem', fruitKey: 'kiwi',        label: '🥝 翡翠猕猴桃糖葫芦 ×3',   count: 3, weight: 6 },
        { type: 'tanghuluItem', fruitKey: 'grape',       label: '🍇 晶莹葡萄糖葫芦 ×3',     count: 3, weight: 5 },
        { type: 'tanghuluItem', fruitKey: 'strawberry',  label: '🍓 甜心草莓糖葫芦 ×3',     count: 3, weight: 5 },
        // ===== ⚡ 体力链碎片 =====
        { type: 'boarditem', chain: 'stamina', level: 2, label: '🫧 活力泡泡 (Lv2)', weight: 15 },
        { type: 'boarditem', chain: 'stamina', level: 3, label: '🔋 能量电池 (Lv3)', weight: 6 },
      ]
    }
  ];



  let isLotteryOpen = false;

  // ===== 抽奖核心逻辑 =====
  function lotteryDraw(poolId) {
    const pool = LOTTERY_POOLS.find(p => p.id === poolId);
    if (!pool) return;

    // 检查金币
    if (state.gameGold < pool.cost) {
      lotteryShowNotice(`金币不足！需要 ${pool.cost} 🪙`);
      return;
    }

    // 检查每日限额
    const today = new Date().toISOString().slice(0, 10);
    if (!state.lotteryLog) state.lotteryLog = {};
    if (!state.lotteryLog[today]) state.lotteryLog[today] = {};
    const todayPoolCount = state.lotteryLog[today][pool.id] || 0;
    if (pool.dailyLimit > 0 && todayPoolCount >= pool.dailyLimit) {
      lotteryShowNotice(`${pool.name} 今日已达上限（${pool.dailyLimit}次），明天凌晨12点恢复～`);
      return;
    }

    // 加权随机
    const totalWeight = pool.items.reduce((s, item) => s + item.weight, 0);
    let roll = Math.random() * totalWeight;
    let result = pool.items[pool.items.length - 1];
    for (const item of pool.items) {
      roll -= item.weight;
      if (roll <= 0) { result = item; break; }
    }

    // 扣金币
    state.gameGold -= pool.cost;

    // 发放奖励
    let rewardMsg = '';
    switch (result.type) {
      case 'gold':
        state.gameGold += result.value;
        rewardMsg = `获得 ${result.label}`;
        break;

      case 'match3prop':
        if (!state.match3Inventory) state.match3Inventory = { expand: 0, sweep: 0, shuffle: 0 };
        const count = result.count || 1;
        state.match3Inventory[result.key] = (state.match3Inventory[result.key] || 0) + count;
        rewardMsg = `获得 ${result.label}（已存入消消看背包）`;
        break;

      case 'linkprop':
        if (!state.linkInventory) state.linkInventory = { hint: 0, shuffle: 0, bomb: 0, compass: 0 };
        const linkCount = result.count || 1;
        state.linkInventory[result.key] = (state.linkInventory[result.key] || 0) + linkCount;
        rewardMsg = `获得 ${result.label}（已存入连连看背包）`;
        break;

      case 'staminaitem':
        if (!state.gameStaminaInventory) state.gameStaminaInventory = { stamina30: 0, stamina50: 0, stamina100: 0 };
        const staminaCount = result.count || 1;
        state.gameStaminaInventory[result.key] = (state.gameStaminaInventory[result.key] || 0) + staminaCount;
        rewardMsg = `获得 ${result.label}（已存入体力背包）`;
        break;

      case 'fridgeprop':
        if (!state.fridgePropInventory) state.fridgePropInventory = { compress: 0, backpack: 0, organize: 0 };
        const fridgePropCount = result.count || 1;
        state.fridgePropInventory[result.key] = (state.fridgePropInventory[result.key] || 0) + fridgePropCount;
        rewardMsg = `获得 ${result.label}（已存入冰箱道具背包）`;
        break;

      case 'tanghuluprop':
        if (!state.tanghuluPropInventory) state.tanghuluPropInventory = { extraStick: 0, undo: 0, lubricant: 0 };
        const tanghuluPropCount = result.count || 1;
        state.tanghuluPropInventory[result.key] = (state.tanghuluPropInventory[result.key] || 0) + tanghuluPropCount;
        rewardMsg = `获得 ${result.label}（已存入糖葫芦道具背包）`;
        break;

      case 'shopitem':
        if (!state.gameInventory) state.gameInventory = [];
        const shopCount = result.count || 1;
        const existing = state.gameInventory.find(i => i.category === result.category && i.idx === result.idx);
        if (existing) {
          existing.count += shopCount;
        } else {
          state.gameInventory.push({ category: result.category, idx: result.idx, count: shopCount });
        }
        rewardMsg = `获得 ${result.label}（已存入工坊背包）`;
        break;

      case 'boarditem':
        // 找棋盘空格放入
        if (!state.gameBoard || state.gameBoard.length !== GAME_BOARD_CELLS) {
          gameInitBoard();
        }
        const emptySlots = [];
        for (let i = 0; i < GAME_BOARD_CELLS; i++) {
          if (i === state.gameGeneratorPos || i === state.gameSellPos) continue;
          if (!state.gameBoard[i]) emptySlots.push(i);
        }
        if (emptySlots.length > 0) {
          const slot = emptySlots[Math.floor(Math.random() * emptySlots.length)];
          state.gameBoard[slot] = { chain: result.chain, level: result.level };
          // 更新图鉴
          const itemKey = `${result.chain}_${result.level}`;
          if (!state.gameCollection) state.gameCollection = [];
          if (!state.gameCollection.includes(itemKey)) state.gameCollection.push(itemKey);
          rewardMsg = `获得 ${result.label}（已放入合成棋盘）`;

          // 调料链联动：抽到调料同时加入餐厅库存
          if (result.chain === 'seasoning') {
            const seasoningItem = GAME_CHAINS.seasoning.items[result.level - 1];
            if (seasoningItem && seasoningItem.seasoningId) {
              if (!state.restaurantSeasonings) state.restaurantSeasonings = {};
              state.restaurantSeasonings[seasoningItem.seasoningId] = (state.restaurantSeasonings[seasoningItem.seasoningId] || 0) + 1;
            }
            rewardMsg = `获得 ${result.label}（已放入棋盘 + 餐厅调料库存）`;
          }
        } else {
          // 棋盘满了，转换成金币补偿
          const chainData = GAME_CHAINS[result.chain];
          const itemData = chainData?.items[result.level - 1];
          const goldComp = itemData ? itemData.sell * 2 : 5;
          state.gameGold += goldComp;
          rewardMsg = `获得 ${result.label}（棋盘已满，转换为 ${goldComp} 🪙）`;

          // 调料链即使棋盘满了，也给餐厅库存（金币补偿之外的额外福利）
          if (result.chain === 'seasoning') {
            const seasoningItem = GAME_CHAINS.seasoning?.items[result.level - 1];
            if (seasoningItem && seasoningItem.seasoningId) {
              if (!state.restaurantSeasonings) state.restaurantSeasonings = {};
              state.restaurantSeasonings[seasoningItem.seasoningId] = (state.restaurantSeasonings[seasoningItem.seasoningId] || 0) + 1;
              rewardMsg += ` + 餐厅调料 +1`;
            }
          }
        }
        break;

      case 'tanghuluItem':
        if (!state.tanghuluInventory) state.tanghuluInventory = [];
        const thKey = result.fruitKey;
        const thCount = result.count || 1;
        const thExisting = state.tanghuluInventory.find(i => i.fruitKey === thKey);
        if (thExisting) {
          thExisting.count += thCount;
        } else {
          state.tanghuluInventory.push({ fruitKey: thKey, count: thCount });
        }
        rewardMsg = `获得 ${result.label}（已存入糖葫芦库存）`;
        break;
      case 'shelfprop':
        if (!state.shelfPropInventory) state.shelfPropInventory = { basket: 0, autoMatch: 0, shuffle: 0 };
        const shelfPropCount = result.count || 1;
        state.shelfPropInventory[result.key] = (state.shelfPropInventory[result.key] || 0) + shelfPropCount;
        rewardMsg = `获得 ${result.label}（已存入货架道具背包）`;
        break;
      case 'groceryitem':
        if (!state.fridgeInventory) state.fridgeInventory = [];
        const groceryCount = result.count || 1;
        const groceryExisting = state.fridgeInventory.find(i => i.foodId === result.foodId);
        if (groceryExisting) {
          groceryExisting.count += groceryCount;
        } else {
          state.fridgeInventory.push({ foodId: result.foodId, count: groceryCount });
        }
        rewardMsg = `获得 ${result.label}（已存入冰箱库存）`;
        break;

    }

    // 记录抽奖日志（按奖池分别计数）
    state.lotteryLog[today][pool.id] = todayPoolCount + 1;

    // 清理7天前的旧记录，防止数据膨胀
    Object.keys(state.lotteryLog).forEach(k => {
      if (k < today) delete state.lotteryLog[k];
    });

    saveDataDebounced('抽奖');

    // 显示结果
    lotteryShowResult(pool, result, rewardMsg);
  }

  // ===== 显示抽奖结果动画 =====
  function lotteryShowResult(pool, result, rewardMsg) {
    const panel = document.getElementById('sp-lottery-panel');
    if (!panel) return;

    // 移除旧的结果层
    panel.querySelector('#sp-lottery-result-overlay')?.remove();

    // 根据奖励类型决定稀有度样式
    let rarityClass = 'sp-lottery-rarity-common';
    let rarityLabel = '普通';
    if (result.type === 'boarditem' && result.level >= 5) {
      rarityClass = 'sp-lottery-rarity-legendary';
      rarityLabel = '传说！';
    } else if (result.type === 'boarditem' && result.level >= 4) {
      rarityClass = 'sp-lottery-rarity-epic';
      rarityLabel = '史诗！';
    } else if (result.type === 'boarditem' && result.level >= 3) {
      rarityClass = 'sp-lottery-rarity-rare';
      rarityLabel = '稀有！';
    } else if (result.type === 'match3prop' && (result.count || 1) >= 3) {
      rarityClass = 'sp-lottery-rarity-rare';
      rarityLabel = '稀有！';
    } else if (result.type === 'shopitem' && result.idx >= 3) {
      rarityClass = 'sp-lottery-rarity-epic';
      rarityLabel = '史诗！';
    } else if (result.type === 'gold' && result.value >= 30) {
      rarityClass = 'sp-lottery-rarity-epic';
      rarityLabel = '史诗！';
    }

    // 决定显示图标
    let displayIcon = '🎁';
    if (result.type === 'gold') displayIcon = '🪙';
    else if (result.type === 'match3prop') displayIcon = result.key === 'expand' ? '🪜' : result.key === 'sweep' ? '🧹' : '🌀';
    else if (result.type === 'shopitem') displayIcon = GAME_SHOP_ITEMS[result.category]?.[result.idx]?.emoji || '🎁';
    else if (result.type === 'boarditem') {
      const chainData = GAME_CHAINS[result.chain];
      const custom = state.gameCustomImages?.[`${result.chain}_${result.level}`];
      displayIcon = custom ? `<img src="${custom}" style="width:48px;height:48px;object-fit:contain;border-radius:8px;" />` : (chainData?.items[result.level - 1]?.emoji || '🎁');
    }

    const isImgDisplay = result.type === 'boarditem' && state.gameCustomImages?.[`${result.chain}_${result.level}`];

    const overlay = document.createElement('div');
    overlay.id = 'sp-lottery-result-overlay';
    overlay.className = `sp-lottery-result-overlay ${rarityClass}`;
    overlay.innerHTML = `
      <div class="sp-lottery-result-box">
        <div class="sp-lottery-rarity-badge">${rarityLabel}</div>
        <div class="sp-lottery-result-icon">${isImgDisplay ? displayIcon : `<span style="font-size:52px;">${displayIcon}</span>`}</div>
        <div class="sp-lottery-result-label">${result.label}</div>
        <div class="sp-lottery-result-msg">${rewardMsg}</div>
        <div class="sp-lottery-result-gold">💰 当前金币: ${state.gameGold}</div>
        <button class="sp-lottery-result-close-btn" id="sp-lottery-result-close">继续抽奖</button>
      </div>
    `;
    panel.appendChild(overlay);

    document.getElementById('sp-lottery-result-close').addEventListener('click', () => {
      overlay.remove();
      // 刷新金币显示
      const goldEl = document.getElementById('sp-lottery-gold');
      if (goldEl) goldEl.textContent = state.gameGold;
      // 刷新各奖池按钮状态
      lotteryRenderPools();
    });
  }

  // ===== 显示抽奖通知 =====
  function lotteryShowNotice(text) {
    const notice = document.getElementById('sp-lottery-notice');
    if (!notice) return;
    notice.textContent = text;
    notice.classList.add('visible');
    clearTimeout(notice._timer);
    notice._timer = setTimeout(() => notice.classList.remove('visible'), 3000);
  }

  // ===== 渲染奖池列表 =====
  function lotteryRenderPools() {
    const container = document.getElementById('sp-lottery-pools');
    if (!container) return;

    const today = new Date().toISOString().slice(0, 10);
    const todayLog = (state.lotteryLog && state.lotteryLog[today]) || {};
    const totalToday = Object.values(todayLog).reduce((s, n) => s + n, 0);

    container.innerHTML = LOTTERY_POOLS.map(pool => {
      const todayPoolCount = todayLog[pool.id] || 0;
      const remaining = pool.dailyLimit - todayPoolCount;
      const soldOut = remaining <= 0;
      const cantAfford = state.gameGold < pool.cost;
      const disabled = soldOut || cantAfford;

      let btnText = `抽一次 (${pool.cost} 🪙)`;
      if (soldOut) btnText = '今日已达上限';
      else if (cantAfford) btnText = '金币不足';

      const limitColor = remaining <= 1 ? '#f66' : remaining <= 2 ? '#ffb347' : 'rgba(100,180,255,0.8)';

      return `
        <div class="sp-lottery-pool-card ${disabled ? 'sp-lottery-pool-disabled' : ''}">
          <div class="sp-lottery-pool-header">
            <span class="sp-lottery-pool-name">${pool.name}</span>
            <div style="display:flex;align-items:center;gap:6px;">
              <span class="sp-lottery-limit-badge" style="color:${limitColor};">剩 ${remaining}/${pool.dailyLimit}</span>
              <span class="sp-lottery-pool-cost">🪙 ${pool.cost}</span>
            </div>
          </div>
          <div class="sp-lottery-pool-desc">${pool.desc}</div>
          <div class="sp-lottery-pool-preview">${lotteryGetPoolPreview(pool)}</div>
          <button class="sp-lottery-draw-btn" data-pool="${pool.id}" ${disabled ? 'disabled' : ''}>
            ${btnText}
          </button>
        </div>
      `;
    }).join('');

    // 今日总抽奖次数
    const countEl = document.getElementById('sp-lottery-today-count');
    if (countEl) countEl.textContent = totalToday;

    container.querySelectorAll('.sp-lottery-draw-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        lotteryDraw(btn.dataset.pool);
      });
    });
  }

  // ===== 获取奖池预览文字 =====
  function lotteryGetPoolPreview(pool) {
    // 显示最高价值的几个奖励作为预览
    const highlights = pool.items
      .filter(i => i.weight <= 30)
      .slice(0, 4)
      .map(i => `<span class="sp-lottery-preview-tag">${i.label}</span>`)
      .join('');
    return highlights || '<span style="font-size:10px;color:var(--sp-text-muted);">各类奖励</span>';
  }

  // ===== 渲染抽奖面板 =====
  function lotteryRenderPanel() {
    let panel = document.getElementById('sp-lottery-panel');
    if (panel) panel.remove();

    panel = document.createElement('div');
    panel.id = 'sp-lottery-panel';
    panel.innerHTML = `
      <div id="sp-lottery-header">
        <span>🎰 幸运抽奖</span>
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="sp-lottery-gold-display">🪙 <span id="sp-lottery-gold">${state.gameGold}</span></span>
          <button id="sp-lottery-close" style="background:none;border:none;font-size:16px;cursor:pointer;color:var(--sp-text-muted);padding:2px 6px;">✕</button>
        </div>
      </div>
      <div id="sp-lottery-notice"></div>
      <div id="sp-lottery-body">
        <div style="text-align:center;font-size:11px;color:var(--sp-text-muted);padding:4px 0 8px;">
          今日已抽: <span id="sp-lottery-today-count">0</span> 次
        </div>
        <div id="sp-lottery-pools"></div>
        <details style="margin-top:10px;">
          <summary style="font-size:11px;color:var(--sp-text-muted);cursor:pointer;padding:4px 0;">📋 奖励说明</summary>
          <div style="font-size:10px;color:var(--sp-text-muted);line-height:1.8;padding:6px 0;">
            🪙 金币 → 直接加入金币<br/>
            🎒 消消看道具 → 自动放入消消看背包<br/>
            🛍️ 工坊道具 → 自动放入工坊背包<br/>
            🧶 合成棋盘物品 → 直接放入合成棋盘空格<br/>
            ⚠️ 若合成棋盘已满，棋盘物品转为金币补偿
          </div>
        </details>
      </div>
    `;
    document.body.appendChild(panel);

    // 关闭
    document.getElementById('sp-lottery-close').addEventListener('click', () => toggleLottery());

    // 面板拖拽
    const header = document.getElementById('sp-lottery-header');
    let dragging = false, offX = 0, offY = 0;
    const down = (e) => {
      if (e.target.closest('#sp-lottery-close')) return;
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

    lotteryRenderPools();
  }

  // ===== 开关抽奖面板 =====
  function toggleLottery() {
    isLotteryOpen = !isLotteryOpen;
    let panel = document.getElementById('sp-lottery-panel');

    if (isLotteryOpen) {
      if (!panel) {
        lotteryRenderPanel();
        panel = document.getElementById('sp-lottery-panel');
      }
      panel.classList.add('visible');

      const w = Math.min(340, window.innerWidth - 20);
      panel.style.width = w + 'px';
      requestAnimationFrame(() => {
        const h = panel.offsetHeight;
        const maxTop = window.innerHeight - h - 20;
        const centerTop = Math.floor((window.innerHeight - h) / 2);
        panel.style.left = Math.floor((window.innerWidth - w) / 2) + 'px';
        panel.style.top = Math.max(10, Math.min(centerTop, maxTop)) + 'px';
      });

      // 刷新金币和奖池
      const goldEl = document.getElementById('sp-lottery-gold');
      if (goldEl) goldEl.textContent = state.gameGold;
      lotteryRenderPools();
    } else {
      // 彻底销毁 DOM
      if (panel) panel.remove();
    }

  }

  // ============================================================
  // 🔗 连连看游戏模块 - MeepLinkMatch
  // ============================================================

  // ===== 连连看常量 =====
  const LINK_DEFAULT_ICONS = [
    '🐱', '🐶', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁',
    '🐸', '🐧', '🐝', '🦋', '🌸', '🍎', '🍰', '⭐',
    '🎀', '🌙', '🔔', '💎', '🍬', '🎯', '🌈', '🐳',
    '🦄', '🍩', '🎵', '🔥', '🍀', '🐞', '🦢', '🎲',
    '🥟', '🦐', '🌽', '🥑', '🍄', '🧁', '🍡', '🥧'
  ];

  // 难度配置：随机选取
  const LINK_DIFFICULTIES = [
    { name: '8×8', rows: 8, cols: 8, iconCount: 12, energyCost: 5, clearReward: 40 },
    { name: '10×10', rows: 10, cols: 10, iconCount: 16, energyCost: 5, clearReward: 70 },
    { name: '12×12', rows: 12, cols: 12, iconCount: 20, energyCost: 8, clearReward: 120 },
    { name: '14×14', rows: 14, cols: 14, iconCount: 24, energyCost: 10, clearReward: 200 },
    { name: '16×16', rows: 16, cols: 16, iconCount: 28, energyCost: 13, clearReward: 320 },
    { name: '18×18', rows: 18, cols: 18, iconCount: 32, energyCost: 16, clearReward: 500 },
  ];

  // 道具定义
  const LINK_PROPS = {
    hint: {
      name: '🔍 寻路放大镜',
      desc: '高亮一对可连通消除的方块',
      price: 30,
      perGameLimit: 3,
      dailyLimit: 10
    },
    shuffle: {
      name: '🌀 重组旋风',
      desc: '打乱所有剩余方块位置',
      price: 60,
      perGameLimit: 3,
      dailyLimit: 10
    },
    bomb: {
      name: '💣 友情炸弹',
      desc: '无视通路强制消除两个相同方块',
      price: 120,
      perGameLimit: 2,
      dailyLimit: 10
    },
    compass: {
      name: '🧭 罗盘透视',
      desc: '10秒内点击方块显示可消同伴',
      price: 50,
      perGameLimit: 1,
      dailyLimit: 10
    }
  };

  // 运行时状态
  let linkState = {
    active: false,
    board: [],       // 2D数组 [row][col]，0=空，>0=图案类型
    rows: 0,
    cols: 0,
    difficulty: null,
    selected: null,  // {row, col}
    pairsEliminated: 0,
    totalPairs: 0,
    propsUsedThisRound: { hint: 0, shuffle: 0, bomb: 0, compass: 0 },
    bombMode: false,
    bombFirst: null, // 炸弹选中的第一个方块
    compassActive: false,
    compassTimer: null,
  };

  let isLinkOpen = false;

  // ===== 路径查找算法（BFS，最多2次转折）- 性能优化版 =====
  // 预分配缓冲区，避免每次调用都创建大数组
  let _linkVisitedBuf = null;
  let _linkVisitedRows = 0;
  let _linkVisitedCols = 0;
  let _linkBfsQueue = null;
  let _linkBfsQueueSize = 0;

  function linkFindPath(board, r1, c1, r2, c2, rows, cols) {
    const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
    const totalRows = rows + 2;
    const totalCols = cols + 2;

    // 复用 visited 缓冲区（避免每次分配新数组）
    if (_linkVisitedRows !== totalRows || _linkVisitedCols !== totalCols) {
      _linkVisitedBuf = new Uint8Array(totalRows * totalCols * 4);
      _linkVisitedRows = totalRows;
      _linkVisitedCols = totalCols;
    }
    _linkVisitedBuf.fill(255); // 255 = Infinity

    // 复用 BFS 队列（环形缓冲）
    const maxQueueSize = totalRows * totalCols * 4;
    if (!_linkBfsQueue || _linkBfsQueueSize < maxQueueSize) {
      _linkBfsQueue = new Int16Array(maxQueueSize * 5); // r, c, dir, turns, parentIdx
      _linkBfsQueueSize = maxQueueSize;
    }

    function visitedIdx(r, c, d) {
      return (r * totalCols + c) * 4 + d;
    }

    function isPassable(r, c) {
      if (r < 0 || r >= totalRows || c < 0 || c >= totalCols) return false;
      if (r === 0 || r === totalRows - 1 || c === 0 || c === totalCols - 1) return true;
      const boardR = r - 1;
      const boardC = c - 1;
      if (boardR < 0 || boardR >= rows || boardC < 0 || boardC >= cols) return true;
      return board[boardR][boardC] === 0;
    }

    const sr = r1 + 1, sc = c1 + 1;
    const er = r2 + 1, ec = c2 + 1;

    let qHead = 0, qTail = 0;

    function enqueue(r, c, dir, turns, parentIdx) {
      const base = qTail * 5;
      _linkBfsQueue[base] = r;
      _linkBfsQueue[base + 1] = c;
      _linkBfsQueue[base + 2] = dir;
      _linkBfsQueue[base + 3] = turns;
      _linkBfsQueue[base + 4] = parentIdx;
      qTail++;
    }

    function dequeue() {
      const base = qHead * 5;
      qHead++;
      return { r: _linkBfsQueue[base], c: _linkBfsQueue[base+1], dir: _linkBfsQueue[base+2], turns: _linkBfsQueue[base+3], parent: _linkBfsQueue[base+4] };
    }

    // 从起点向四个方向出发
    for (let d = 0; d < 4; d++) {
      const nr = sr + dirs[d][0];
      const nc = sc + dirs[d][1];
      if (nr < 0 || nr >= totalRows || nc < 0 || nc >= totalCols) continue;
      if (nr === er && nc === ec) {
        return [{r: r1, c: c1}, {r: r2, c: c2}];
      }
      if (!isPassable(nr, nc)) continue;
      const vi = visitedIdx(nr, nc, d);
      if (_linkVisitedBuf[vi] <= 0) continue;
      _linkVisitedBuf[vi] = 0;
      enqueue(nr, nc, d, 0, -1);
    }

    let foundIdx = -1;

    while (qHead < qTail) {
      const cur = dequeue();
      const curIdx = qHead - 1;

      for (let d = 0; d < 4; d++) {
        const newTurns = (d === cur.dir) ? cur.turns : cur.turns + 1;
        if (newTurns > 2) continue;

        const nr = cur.r + dirs[d][0];
        const nc = cur.c + dirs[d][1];
        if (nr < 0 || nr >= totalRows || nc < 0 || nc >= totalCols) continue;

        if (nr === er && nc === ec) {
          foundIdx = curIdx;
          // 回溯路径
          const path = [{r: r2, c: c2}];
          let backIdx = foundIdx;
          while (backIdx >= 0) {
            const base = backIdx * 5;
            path.push({r: _linkBfsQueue[base] - 1, c: _linkBfsQueue[base+1] - 1});
            backIdx = _linkBfsQueue[base + 4];
          }
          path.push({r: r1, c: c1});
          path.reverse();
          return path;
        }

        if (!isPassable(nr, nc)) continue;
        const vi = visitedIdx(nr, nc, d);
        if (_linkVisitedBuf[vi] <= newTurns) continue;
        _linkVisitedBuf[vi] = newTurns;
        enqueue(nr, nc, d, newTurns, curIdx);
      }
    }

    return null;
  }

  // ===== 检查是否存在可消除对（优化版：减少不必要的路径计算）=====
  function linkFindAnyPair() {
    const {board, rows, cols} = linkState;
    const positions = {};

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] === 0) continue;
        const type = board[r][c];
        if (!positions[type]) positions[type] = [];
        positions[type].push({r, c});
      }
    }

    // 按类型数量从少到多排序，少的更容易快速找到结果
    const typeKeys = Object.keys(positions).sort((a, b) => positions[a].length - positions[b].length);

    for (const type of typeKeys) {
      const arr = positions[type];
      if (arr.length < 2) continue;
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          const path = linkFindPath(board, arr[i].r, arr[i].c, arr[j].r, arr[j].c, rows, cols);
          if (path) return {a: arr[i], b: arr[j], path};
        }
      }
    }
    return null;
  }

  // ===== 生成关卡 =====
  function linkGenerateLevel() {
    const diff = LINK_DIFFICULTIES[Math.floor(Math.random() * LINK_DIFFICULTIES.length)];
    linkState.difficulty = diff;
    linkState.rows = diff.rows;
    linkState.cols = diff.cols;

    // 消耗精力
    if (state.gameStamina < diff.energyCost) {
      linkShowNotice(`精力不足！需要 ${diff.energyCost} 点`);
      linkState.active = false;
      return false;
    }
    state.gameStamina -= diff.energyCost;

    // 选择图案
    const icons = [];
    const available = [...LINK_DEFAULT_ICONS];
    for (let i = 0; i < diff.iconCount && available.length > 0; i++) {
      const idx = Math.floor(Math.random() * available.length);
      icons.push(available.splice(idx, 1)[0]);
    }

    // 生成配对（总格子数必须是偶数）
    const totalCells = diff.rows * diff.cols;
    const pairCount = Math.floor(totalCells / 2);
    linkState.totalPairs = pairCount;
    linkState.pairsEliminated = 0;

    // 生成图案序列（每种图案出现偶数次）
    const tiles = [];
    const pairsPerIcon = Math.floor(pairCount / diff.iconCount);
    const remainder = pairCount % diff.iconCount;

    for (let i = 0; i < diff.iconCount; i++) {
      const count = pairsPerIcon + (i < remainder ? 1 : 0);
      for (let j = 0; j < count * 2; j++) {
        tiles.push(i + 1); // 类型从1开始
      }
    }

    // 如果总格子是奇数，补一个空格（不应该发生，8×8和10×10都是偶数）
    while (tiles.length < totalCells) {
      tiles.push(0);
    }

    // 洗牌
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }

    // 填入棋盘
    linkState.board = [];
    let idx = 0;
    for (let r = 0; r < diff.rows; r++) {
      const row = [];
      for (let c = 0; c < diff.cols; c++) {
        row.push(tiles[idx++]);
      }
      linkState.board.push(row);
    }

    // 确保初始局面有解
    const pair = linkFindAnyPair();
    if (!pair) {
      // 极端情况：重新洗牌
      linkShuffleBoard();
    }

    linkState.active = true;
    linkState.selected = null;
    linkState.propsUsedThisRound = { hint: 0, shuffle: 0, bomb: 0, compass: 0 };
    linkState.bombMode = false;
    linkState.bombFirst = null;
    linkState.compassActive = false;
    if (linkState.compassTimer) { clearTimeout(linkState.compassTimer); linkState.compassTimer = null; }

    saveDataDebounced('连连看开局');
    return true;
  }

  // ===== 洗牌（保持位置不变，打乱图案）=====
  function linkShuffleBoard() {
    const {board, rows, cols} = linkState;
    const tiles = [];

    // 收集所有非空方块
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] !== 0) tiles.push(board[r][c]);
      }
    }

    // 洗牌
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }

    // 放回
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] !== 0) {
          board[r][c] = tiles[idx++];
        }
      }
    }

    // 洗牌后确保有解，如果没有就微调
    let attempts = 0;
    while (!linkFindAnyPair() && attempts < 20) {
      attempts++;
      // 随机交换两个非空方块
      const nonEmpty = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (board[r][c] !== 0) nonEmpty.push({r, c});
        }
      }
      if (nonEmpty.length < 2) break;
      const a = nonEmpty[Math.floor(Math.random() * nonEmpty.length)];
      const b = nonEmpty[Math.floor(Math.random() * nonEmpty.length)];
      const tmp = board[a.r][a.c];
      board[a.r][a.c] = board[b.r][b.c];
      board[b.r][b.c] = tmp;
    }
  }

  // ===== 点击方块处理 =====
  function linkClickCell(row, col) {
    if (!linkState.active) return;
    const {board} = linkState;

    if (board[row][col] === 0) return;

    // 罗盘透视模式
    if (linkState.compassActive) {
      linkHighlightCompassTargets(row, col);
      return;
    }

    // 炸弹模式
    if (linkState.bombMode) {
      if (!linkState.bombFirst) {
        linkState.bombFirst = {r: row, c: col};
        linkState.selected = {r: row, c: col};
        linkRender();
        return;
      } else {
        const first = linkState.bombFirst;
        if (first.r === row && first.c === col) {
          // 取消选择
          linkState.bombFirst = null;
          linkState.selected = null;
          linkRender();
          return;
        }
        // 检查是否同类型
        if (board[first.r][first.c] === board[row][col]) {
          // 强制消除
          linkEliminatePair(first.r, first.c, row, col, null);
          linkState.bombMode = false;
          linkState.bombFirst = null;
          linkState.selected = null;
          linkShowNotice('💣 炸弹消除成功！');
        } else {
          linkShowNotice('💣 需要选择两个相同图案的方块！');
          linkState.bombFirst = null;
          linkState.selected = null;
        }
        linkRender();
        return;
      }
    }

    // 普通模式
    if (!linkState.selected) {
      linkState.selected = {r: row, c: col};
      linkRender();
      return;
    }

    const sel = linkState.selected;

    // 点击同一个方块取消选择
    if (sel.r === row && sel.c === col) {
      linkState.selected = null;
      linkRender();
      return;
    }

    // 检查是否同类型
    if (board[sel.r][sel.c] !== board[row][col]) {
      // 不同类型，切换选择
      linkState.selected = {r: row, c: col};
      linkRender();
      return;
    }

    // 同类型，检查路径
    const path = linkFindPath(board, sel.r, sel.c, row, col, linkState.rows, linkState.cols);
    if (path) {
      // 显示连线动画然后消除
      linkShowPath(path, () => {
        linkEliminatePair(sel.r, sel.c, row, col, path);
      });
    } else {
      // 无路径，取消选择
      linkShowNotice('这两个方块之间无法连接！');
      linkState.selected = null;
      linkRender();
    }
  }

  // ===== 消除一对 =====
  function linkEliminatePair(r1, c1, r2, c2, path) {
    const {board} = linkState;

    // 记录被消除方块的图案类型（在清除前取值）
    const eliminatedType = board[r1][c1]; // 类型编号 1~N
    const eliminatedIconIdx = eliminatedType - 1;
    const eliminatedEmoji = LINK_DEFAULT_ICONS[eliminatedIconIdx] || null;

    board[r1][c1] = 0;
    board[r2][c2] = 0;
    linkState.pairsEliminated++;
    linkState.selected = null;

    // 金币奖励 0~1
    const goldReward = Math.floor(Math.random() * 2);
    state.gameGold += goldReward;

    // ===== 连连看→餐厅联动产出 =====
    // 映射表：连连看图案 emoji → 产出物品
    const LINK_RESTAURANT_LINK = {
      '🥟': { type: 'fridge', id: 'dumpling' },
      '🦐': { type: 'fridge', id: 'shrimp' },
      '🌽': { type: 'fridge', id: 'corn' },
      '🥑': { type: 'fridge', id: 'avocado' },
      '🍄': { type: 'fridge', id: 'mushroom' },
      '🧁': { type: 'fridge', id: 'cake' },
      '🍡': { type: 'tanghulu', id: 'strawberry' },
      '🥧': { type: 'fridge', id: 'cake' },
      '🍎': { type: 'fridge', id: 'apple' },
      '🍰': { type: 'fridge', id: 'cake' },
      '🍩': { type: 'fridge', id: 'icecream' },
      '🍬': { type: 'fridge', id: 'icecream' },
      '🌙': { type: 'seasoning', id: 'honey' },
      '🔔': { type: 'seasoning', id: 'salt' },
      '🔥': { type: 'seasoning', id: 'chili' },
      '🍀': { type: 'seasoning', id: 'butter' },
      '🐰': { type: 'cleanItem', shopIdx: 0 },
      '🐻': { type: 'energyItem', shopIdx: 0 },
      '🦋': { type: 'cleanItem', shopIdx: 4 },
      '🐧': { type: 'energyItem', shopIdx: 1 },
    };

    if (eliminatedEmoji) {
      const link = LINK_RESTAURANT_LINK[eliminatedEmoji];
      if (link) {
        if (link.type === 'fridge') {
          if (!state.fridgeInventory) state.fridgeInventory = [];
          const existing = state.fridgeInventory.find(i => i.foodId === link.id);
          if (existing) existing.count++;
          else state.fridgeInventory.push({ foodId: link.id, count: 1 });
        } else if (link.type === 'seasoning') {
          if (!state.restaurantSeasonings) state.restaurantSeasonings = {};
          state.restaurantSeasonings[link.id] = (state.restaurantSeasonings[link.id] || 0) + 1;
        } else if (link.type === 'tanghulu') {
          if (!state.tanghuluInventory) state.tanghuluInventory = [];
          const existing = state.tanghuluInventory.find(i => i.fruitKey === link.id);
          if (existing) existing.count++;
          else state.tanghuluInventory.push({ fruitKey: link.id, count: 1 });
        } else if (link.type === 'cleanItem') {
          if (!state.gameInventory) state.gameInventory = [];
          const existing = state.gameInventory.find(i => i.category === 'clean' && i.idx === link.shopIdx);
          if (existing) existing.count++;
          else state.gameInventory.push({ category: 'clean', idx: link.shopIdx, count: 1 });
        } else if (link.type === 'energyItem') {
          if (!state.gameInventory) state.gameInventory = [];
          const existing = state.gameInventory.find(i => i.category === 'energy' && i.idx === link.shopIdx);
          if (existing) existing.count++;
          else state.gameInventory.push({ category: 'energy', idx: link.shopIdx, count: 1 });
        }
      }
    }

    // 检查胜利
    let remaining = 0;
    for (let r = 0; r < linkState.rows; r++) {
      for (let c = 0; c < linkState.cols; c++) {
        if (board[r][c] !== 0) remaining++;
      }
    }

    if (remaining === 0) {
      linkState.active = false;
      saveDataImmediate('连连看通关');
      setTimeout(() => linkGameOver(true), 500);
      linkRender();
      return;
    }

    saveDataDebounced('连连看消除');
    linkRender();

    // 死局检测延迟到下一帧，避免阻塞渲染
    requestAnimationFrame(() => {
      if (!linkState.active) return;
      const anyPair = linkFindAnyPair();
      if (!anyPair) {
        linkShowNotice('呜哇，好像已经没有可以连接的方块了！要不要用个「重组旋风」？🌀');
      }
    });

  }

  // ===== 显示连线路径 =====
  function linkShowPath(path, callback) {
    const boardEl = document.getElementById('sp-link-board');
    if (!boardEl) { callback(); return; }

    // 移除旧的SVG
    boardEl.querySelector('#sp-link-path-svg')?.remove();

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'sp-link-path-svg';
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    boardEl.appendChild(svg);

    const cellWidth = boardEl.clientWidth / linkState.cols;
    const cellHeight = boardEl.clientHeight / linkState.rows;

    // 简化路径点（拐点）
    const keyPoints = [path[0]];
    for (let i = 1; i < path.length - 1; i++) {
      const prev = path[i - 1];
      const curr = path[i];
      const next = path[i + 1];
      const dirBefore = {r: curr.r - prev.r, c: curr.c - prev.c};
      const dirAfter = {r: next.r - curr.r, c: next.c - curr.c};
      if (dirBefore.r !== dirAfter.r || dirBefore.c !== dirAfter.c) {
        keyPoints.push(curr);
      }
    }
    keyPoints.push(path[path.length - 1]);

    // 画线
    for (let i = 0; i < keyPoints.length - 1; i++) {
      const from = keyPoints[i];
      const to = keyPoints[i + 1];
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', (from.c + 0.5) * cellWidth);
      line.setAttribute('y1', (from.r + 0.5) * cellHeight);
      line.setAttribute('x2', (to.c + 0.5) * cellWidth);
      line.setAttribute('y2', (to.r + 0.5) * cellHeight);
      svg.appendChild(line);
    }

    // 动画结束后回调
    setTimeout(() => {
      svg.remove();
      callback();
    }, 500);
  }

  // ===== 罗盘透视：高亮可连同伴 =====
  function linkHighlightCompassTargets(row, col) {
    const {board, rows, cols} = linkState;
    const type = board[row][col];
    if (type === 0) return;

    // 找所有同类型且可连通的方块
    const targets = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (r === row && c === col) continue;
        if (board[r][c] !== type) continue;
        const path = linkFindPath(board, row, col, r, c, rows, cols);
        if (path) targets.push({r, c});
      }
    }

    // 高亮显示
    const cells = document.querySelectorAll('.sp-link-cell-tile');
    cells.forEach(cell => cell.classList.remove('sp-link-compass-highlight'));

    targets.forEach(t => {
      const cellEl = document.querySelector(`.sp-link-cell[data-row="${t.r}"][data-col="${t.c}"]`);
      if (cellEl) cellEl.classList.add('sp-link-compass-highlight');
    });

    if (targets.length === 0) {
      linkShowNotice('这个图案当前没有可连通的同伴');
    } else {
      linkShowNotice(`找到 ${targets.length} 个可连通的同伴！`);
    }

    // 1.5秒后清除高亮
    setTimeout(() => {
      document.querySelectorAll('.sp-link-compass-highlight').forEach(el => {
        el.classList.remove('sp-link-compass-highlight');
      });
    }, 1500);
  }

  // ===== 道具使用 =====
  function linkUseProp(propKey) {
    if (!linkState.active) return;

    const prop = LINK_PROPS[propKey];
    if (!prop) return;

    // 检查本局使用次数
    if (linkState.propsUsedThisRound[propKey] >= prop.perGameLimit) {
      linkShowNotice(`${prop.name} 本局已用完（限${prop.perGameLimit}次）！`);
      return;
    }

    // 检查背包库存
    if (!state.linkInventory) state.linkInventory = { hint: 0, shuffle: 0, bomb: 0, compass: 0 };
    if ((state.linkInventory[propKey] || 0) <= 0) {
      linkShowNotice(`${prop.name} 库存不足！去商店购买吧`);
      return;
    }

    // 扣除库存
    state.linkInventory[propKey]--;
    linkState.propsUsedThisRound[propKey]++;

    // 执行效果
    switch (propKey) {
      case 'hint': {
        const pair = linkFindAnyPair();
        if (!pair) {
          linkShowNotice('当前没有可消除的方块，建议使用「重组旋风」！');
          // 退还
          state.linkInventory[propKey]++;
          linkState.propsUsedThisRound[propKey]--;
          return;
        }
        // 高亮提示
        const cellA = document.querySelector(`.sp-link-cell[data-row="${pair.a.r}"][data-col="${pair.a.c}"]`);
        const cellB = document.querySelector(`.sp-link-cell[data-row="${pair.b.r}"][data-col="${pair.b.c}"]`);
        if (cellA) cellA.classList.add('sp-link-hint');
        if (cellB) cellB.classList.add('sp-link-hint');
        linkShowNotice('🔍 高亮了一对可消除的方块！');
        setTimeout(() => {
          if (cellA) cellA.classList.remove('sp-link-hint');
          if (cellB) cellB.classList.remove('sp-link-hint');
        }, 3000);
        break;
      }

      case 'shuffle': {
        linkShuffleBoard();
        linkShowNotice('🌀 方块已重新洗牌！');
        linkState.selected = null;
        linkRender();
        break;
      }

      case 'bomb': {
        linkState.bombMode = true;
        linkState.bombFirst = null;
        linkState.selected = null;
        linkShowNotice('💣 炸弹模式！请选择两个相同图案的方块');
        linkRender();
        break;
      }

      case 'compass': {
        linkState.compassActive = true;
        linkShowNotice('🧭 罗盘透视！10秒内点击任意方块查看可连同伴');
        if (linkState.compassTimer) clearTimeout(linkState.compassTimer);
        linkState.compassTimer = setTimeout(() => {
          linkState.compassActive = false;
          linkState.compassTimer = null;
          linkShowNotice('🧭 罗盘透视已结束');
          document.querySelectorAll('.sp-link-compass-highlight').forEach(el => {
            el.classList.remove('sp-link-compass-highlight');
          });
        }, 10000);
        break;
      }
    }

    saveDataDebounced('连连看使用道具');
    linkRenderProps();
  }

  // ===== 商店购买 =====
  function linkBuyProp(propKey) {
    const prop = LINK_PROPS[propKey];
    if (!prop) return;

    if (state.gameGold < prop.price) {
      linkShowNotice(`金币不足！需要 ${prop.price} 🪙`);
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    if (!state.linkItemPurchaseLog) state.linkItemPurchaseLog = {};
    if (!state.linkItemPurchaseLog[today]) state.linkItemPurchaseLog[today] = {};
    const bought = state.linkItemPurchaseLog[today][propKey] || 0;
    if (bought >= prop.dailyLimit) {
      linkShowNotice(`${prop.name} 今日已售罄（限${prop.dailyLimit}个/天）`);
      return;
    }

    state.gameGold -= prop.price;
    state.linkItemPurchaseLog[today][propKey] = bought + 1;
    if (!state.linkInventory) state.linkInventory = { hint: 0, shuffle: 0, bomb: 0, compass: 0 };
    state.linkInventory[propKey] = (state.linkInventory[propKey] || 0) + 1;

    linkShowNotice(`购买了 ${prop.name}，已放入背包！`);
    saveDataDebounced('连连看商店购买');
    linkRenderShop();
    linkRenderBag();
    const goldEl = document.getElementById('sp-link-gold');
    if (goldEl) goldEl.textContent = state.gameGold;
  }

  // ===== 游戏结算 =====
  function linkGameOver(victory) {
    linkState.active = false;
    if (linkState.compassTimer) { clearTimeout(linkState.compassTimer); linkState.compassTimer = null; }
    linkState.compassActive = false;
    linkState.bombMode = false;

    const baseReward = Math.floor(linkState.pairsEliminated * 0.3);
    let bonusReward = 0;
    let bonusMsg = '';

    if (victory) {
      bonusReward = linkState.difficulty.clearReward;
      bonusMsg = `\n🏆 通关奖励: +${bonusReward} 🪙`;
      state.energy = Math.min(100, state.energy + 1);
      updateMood();
      updateStatusBars();
    }

    const totalGold = baseReward + bonusReward;
    state.gameGold += totalGold;
    saveDataImmediate('连连看结算');

    const panel = document.getElementById('sp-link-panel');
    if (!panel) return;

    panel.querySelector('#sp-link-result-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'sp-link-result-overlay';
    overlay.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:10;border-radius:16px;';
    overlay.innerHTML = `
      <div class="sp-link-result-box">
        <div class="sp-link-result-title">${victory ? '🎉 恭喜通关！' : '😿 游戏结束'}</div>
        <div class="sp-link-result-info">
          <div>难度: ${linkState.difficulty?.name || '未知'}</div>
          <div>消除: ${linkState.pairsEliminated} 对</div>
          <div>消除奖励: +${baseReward} 🪙${bonusMsg}</div>
          <div style="font-weight:700;margin-top:6px;">总获得: +${totalGold} 🪙</div>
        </div>
        <div class="sp-link-result-actions">
          <button class="sp-link-result-btn" id="sp-link-restart">🔄 再来一局</button>
          <button class="sp-link-result-btn sp-link-result-close" id="sp-link-quit">❌ 退出</button>
        </div>
      </div>
    `;
    panel.appendChild(overlay);

    document.getElementById('sp-link-restart')?.addEventListener('click', () => {
      overlay.remove();
      linkConfirmNewGame();
    });

    document.getElementById('sp-link-quit')?.addEventListener('click', () => {
      overlay.remove();
      toggleLinkGame();
    });

  }

  // ===== 通知 =====
  function linkShowNotice(text) {
    const notice = document.getElementById('sp-link-notice');
    if (!notice) return;
    notice.textContent = text;
    notice.classList.add('visible');
    clearTimeout(notice._timer);
    notice._timer = setTimeout(() => notice.classList.remove('visible'), 3500);
  }

  // ===== 渲染棋盘 =====
  function linkRender() {
    const boardEl = document.getElementById('sp-link-board');
    const infoEl = document.getElementById('sp-link-info');
    if (!boardEl) return;

    const {board, rows, cols, selected} = linkState;

    // 设置grid
    boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    boardEl.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    let html = '';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const type = board[r][c];
        const isSelected = selected && selected.r === r && selected.c === c;
        const isBombSelected = linkState.bombFirst && linkState.bombFirst.r === r && linkState.bombFirst.c === c;

        if (type === 0) {
          html += `<div class="sp-link-cell sp-link-cell-empty" data-row="${r}" data-col="${c}"></div>`;
        } else {
          const selectedClass = (isSelected || isBombSelected) ? ' sp-link-selected' : '';
          const iconIdx = type - 1;
          const customImg = state.gameCustomImages?.[`link_icon_${iconIdx}`];
          const display = customImg
            ? `<img src="${customImg}" class="sp-link-cell-img" />`
            : LINK_DEFAULT_ICONS[iconIdx] || '?';
          html += `<div class="sp-link-cell sp-link-cell-tile${selectedClass}" data-row="${r}" data-col="${c}">${display}</div>`;
        }
      }
    }
    boardEl.innerHTML = html;

    // 绑定点击
    boardEl.querySelectorAll('.sp-link-cell-tile').forEach(cell => {
      cell.addEventListener('click', () => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        linkClickCell(row, col);
      });
    });

    // 信息栏
    if (infoEl) {
      let remaining = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (board[r][c] !== 0) remaining++;
        }
      }
      const modeText = linkState.bombMode ? ' | 💣炸弹模式' : (linkState.compassActive ? ' | 🧭透视中' : '');
      infoEl.innerHTML = `
        <span>剩余: ${remaining}</span>
        <span>已消: ${linkState.pairsEliminated} 对</span>
        <span>难度: ${linkState.difficulty?.name || '-'}${modeText}</span>
      `;
    }

    linkRenderProps();

    // 更新金币
    const goldEl = document.getElementById('sp-link-gold');
    if (goldEl) goldEl.textContent = state.gameGold;

    // 控制开始按钮显示/隐藏
    const startWrapper = document.getElementById('sp-link-start-wrapper');
    if (startWrapper) startWrapper.style.display = linkState.active ? 'none' : 'flex';

  }

  // ===== 渲染道具按钮 =====
  function linkRenderProps() {
    if (!state.linkInventory) state.linkInventory = { hint: 0, shuffle: 0, bomb: 0, compass: 0 };
    const propEls = {
      hint: document.getElementById('sp-link-prop-hint-count'),
      shuffle: document.getElementById('sp-link-prop-shuffle-count'),
      bomb: document.getElementById('sp-link-prop-bomb-count'),
      compass: document.getElementById('sp-link-prop-compass-count'),
    };
    Object.keys(propEls).forEach(key => {
      const el = propEls[key];
      if (el) {
        const stock = state.linkInventory[key] || 0;
        const used = linkState.propsUsedThisRound[key] || 0;
        const limit = LINK_PROPS[key].perGameLimit;
        el.textContent = `×${stock} (${used}/${limit})`;
      }
    });
  }

  // ===== 渲染背包 =====
  function linkRenderBag() {
    const container = document.getElementById('sp-link-bag-content');
    if (!container) return;
    if (!state.linkInventory) state.linkInventory = { hint: 0, shuffle: 0, bomb: 0, compass: 0 };

    const items = Object.entries(LINK_PROPS).map(([key, prop]) => ({
      key, ...prop, count: state.linkInventory[key] || 0
    }));

    const hasAny = items.some(i => i.count > 0);

    container.innerHTML = hasAny ? items.map(item => `
      <div class="sp-link-bag-item ${item.count <= 0 ? 'sp-link-bag-empty' : ''}">
        <span class="sp-link-bag-icon">${item.name.split(' ')[0]}</span>
        <div class="sp-link-bag-info">
          <span class="sp-link-bag-name">${item.name.split(' ').slice(1).join(' ')}</span>
          <span class="sp-link-bag-desc">${item.desc}</span>
        </div>
        <span class="sp-link-bag-count">×${item.count}</span>
      </div>
    `).join('') : '<div style="text-align:center;padding:20px;color:var(--sp-text-muted);font-size:12px;">背包空空如也～去商店买点道具吧</div>';
  }

  // ===== 渲染商店 =====
  function linkRenderShop() {
    const container = document.getElementById('sp-link-shop-content');
    if (!container) return;

    const today = new Date().toISOString().slice(0, 10);
    const todayLog = (state.linkItemPurchaseLog && state.linkItemPurchaseLog[today]) || {};

    const items = Object.entries(LINK_PROPS).map(([key, prop]) => {
      const bought = todayLog[key] || 0;
      const soldOut = bought >= prop.dailyLimit;
      const cantAfford = state.gameGold < prop.price;
      const disabled = soldOut || cantAfford;
      const stock = state.linkInventory?.[key] || 0;
      return { key, ...prop, bought, soldOut, cantAfford, disabled, stock };
    });

    container.innerHTML = items.map(item => `
      <div class="sp-link-shop-item ${item.disabled ? 'sp-link-shop-disabled' : ''}">
        <span class="sp-link-shop-icon">${item.name.split(' ')[0]}</span>
        <div class="sp-link-shop-info">
          <span class="sp-link-shop-name">${item.name.split(' ').slice(1).join(' ')}</span>
          <span class="sp-link-shop-desc">${item.desc} | 每局限${item.perGameLimit}次</span>
          <span style="font-size:9px;color:var(--sp-text-muted);">${item.soldOut ? '今日售罄' : `今日剩 ${item.dailyLimit - item.bought}`} | 背包: ${item.stock}</span>
        </div>
        <button class="sp-link-shop-buy" data-prop="${item.key}" ${item.disabled ? 'disabled' : ''}>🪙${item.price}</button>
      </div>
    `).join('');

    container.querySelectorAll('.sp-link-shop-buy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        linkBuyProp(btn.dataset.prop);
      });
    });
  }

  // ===== 渲染图鉴 =====
  function linkRenderCollection() {
    const grid = document.getElementById('sp-link-collection-grid');
    if (!grid) return;

    if (!state.gameCustomImages) state.gameCustomImages = {};

    grid.innerHTML = LINK_DEFAULT_ICONS.map((icon, idx) => {
      const key = `link_icon_${idx}`;
      const custom = state.gameCustomImages[key];
      const display = custom
        ? `<img src="${custom}" style="width:28px;height:28px;object-fit:contain;border-radius:4px;" />`
        : `<span style="font-size:22px;">${icon}</span>`;
      return `
        <div style="aspect-ratio:1;border-radius:8px;border:2px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;position:relative;cursor:pointer;overflow:hidden;transition:all 0.15s;" data-link-icon-idx="${idx}">
          ${display}
          <span style="font-size:8px;color:var(--sp-text-muted);">${icon}</span>
          <div class="sp-link-icon-upload" data-idx="${idx}" style="position:absolute;top:2px;right:2px;width:16px;height:16px;border-radius:50%;background:rgba(0,0,0,0.6);color:#fff;font-size:9px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity 0.2s;">📷</div>
        </div>
      `;
    }).join('');

    // hover显示上传按钮
    grid.querySelectorAll('[data-link-icon-idx]').forEach(item => {
      item.addEventListener('mouseenter', () => {
        const btn = item.querySelector('.sp-link-icon-upload');
        if (btn) btn.style.opacity = '1';
      });
      item.addEventListener('mouseleave', () => {
        const btn = item.querySelector('.sp-link-icon-upload');
        if (btn) btn.style.opacity = '0';
      });
    });

    // 上传按钮
    grid.querySelectorAll('.sp-link-icon-upload').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
        linkPromptIconUpload(idx);
      });
    });
  }

  // ===== 图案图片上传 =====
  function linkPromptIconUpload(idx) {
    const key = `link_icon_${idx}`;
    if (!state.gameCustomImages) state.gameCustomImages = {};
    const currentImg = state.gameCustomImages[key];

    // 如果已有图片，先问是否要移除
    if (currentImg) {
      const action = confirm(`图案 ${LINK_DEFAULT_ICONS[idx]} 已有自定义图片\n\n点「确定」→ 移除图片（恢复默认emoji）\n点「取消」→ 替换为新图片`);
      if (action) {
        delete state.gameCustomImages[key];
        saveDataImmediate('连连看图案移除');
        linkRenderCollection();
        linkShowNotice('图片已移除，恢复默认显示');
        return;
      }
    }

    const choice = confirm(`设置图案 ${LINK_DEFAULT_ICONS[idx]} 的自定义图片\n\n点「确定」→ 输入图片链接\n点「取消」→ 选择本地文件上传`);

    if (choice) {
      const url = prompt('输入图片链接（留空确认=清除）：', currentImg && currentImg.startsWith('http') ? currentImg : '');
      if (url === null) return;
      const trimmed = url.trim();
      if (!trimmed) {
        delete state.gameCustomImages[key];
        saveDataImmediate('连连看图案清除');
        linkRenderCollection();
        linkShowNotice('图片已清除');
        return;
      }
      if (!trimmed.startsWith('http')) {
        linkShowNotice('链接需要以 http 开头');
        return;
      }
      state.gameCustomImages[key] = trimmed;
      saveDataImmediate('连连看图案链接');
      linkRenderCollection();
      linkShowNotice('图案图片已设置！');
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/png,image/jpeg,image/gif,image/webp';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
          linkShowNotice('图片不能超过2MB');
          return;
        }
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const compressed = await compressImage(ev.target.result, 80, 0.7);
          if (!state.gameCustomImages) state.gameCustomImages = {};
          state.gameCustomImages[key] = compressed;
          saveDataImmediate('连连看图案上传');
          linkRenderCollection();
          linkShowNotice('图案图片已设置！');
        };
        reader.readAsDataURL(file);
      };
      input.click();
    }
  }

  // ===== 渲染主面板 =====
  function linkRenderPanel() {
    let panel = document.getElementById('sp-link-panel');
    if (panel) panel.remove();

    panel = document.createElement('div');
    panel.id = 'sp-link-panel';
    panel.innerHTML = `
      <div id="sp-link-header">
        <span>🔗 连连看</span>
        <div class="sp-link-header-right">
          <button id="sp-link-minimize" title="缩小悬挂" style="background:none;border:none;font-size:14px;cursor:pointer;color:var(--sp-text-muted);padding:2px 6px;">─</button>
          <button id="sp-link-close" title="关闭">✕</button>
        </div>
      </div>
      <div id="sp-link-notice"></div>
      <div style="display:flex;gap:4px;padding:6px 10px;background:rgba(255,255,255,0.03);border-bottom:1px solid var(--sp-border-light);align-items:center;">
        <button class="sp-game-tab active" data-linktab="play" id="sp-link-tab-play">🎮 游戏</button>
        <button class="sp-game-tab" data-linktab="bag" id="sp-link-tab-bag">🎒 背包</button>
        <button class="sp-game-tab" data-linktab="shop" id="sp-link-tab-shop">🛒 商店</button>
        <button class="sp-game-tab" data-linktab="collection" id="sp-link-tab-collection">📖 图鉴</button>
        <span class="sp-link-gold-display" style="margin-left:auto;">🪙 <span id="sp-link-gold">${state.gameGold}</span></span>
      </div>
      <div id="sp-link-body">
        <div id="sp-link-tab-content-play">
          <div id="sp-link-info"></div>
          <div id="sp-link-board"></div>
          <div id="sp-link-props">
            <button class="sp-link-prop-btn" id="sp-link-prop-hint" title="${LINK_PROPS.hint.desc}">
              <span class="sp-link-prop-icon">🔍</span>
              <span class="sp-link-prop-name">放大镜</span>
              <span class="sp-link-prop-count" id="sp-link-prop-hint-count">×0</span>
            </button>
            <button class="sp-link-prop-btn" id="sp-link-prop-shuffle" title="${LINK_PROPS.shuffle.desc}">
              <span class="sp-link-prop-icon">🌀</span>
              <span class="sp-link-prop-name">重组旋风</span>
              <span class="sp-link-prop-count" id="sp-link-prop-shuffle-count">×0</span>
            </button>
            <button class="sp-link-prop-btn" id="sp-link-prop-bomb" title="${LINK_PROPS.bomb.desc}">
              <span class="sp-link-prop-icon">💣</span>
              <span class="sp-link-prop-name">友情炸弹</span>
              <span class="sp-link-prop-count" id="sp-link-prop-bomb-count">×0</span>
            </button>
            <button class="sp-link-prop-btn" id="sp-link-prop-compass" title="${LINK_PROPS.compass.desc}">
              <span class="sp-link-prop-icon">🧭</span>
              <span class="sp-link-prop-name">罗盘透视</span>
              <span class="sp-link-prop-count" id="sp-link-prop-compass-count">×0</span>
            </button>
          </div>
          <div style="height:8px;"></div>
          <div id="sp-link-start-wrapper" style="display:flex;justify-content:center;margin-bottom:8px;"><button class="sp-link-ctrl-btn" id="sp-link-start-btn" style="background:var(--sp-primary);color:#fff;border-color:var(--sp-primary-border);padding:10px 24px;font-size:13px;">✨ 开始游戏</button></div>
          <div id="sp-link-controls">
            <button class="sp-link-ctrl-btn" id="sp-link-restart-btn">🔄 重开</button>
            <button class="sp-link-ctrl-btn sp-link-ctrl-quit" id="sp-link-end-btn">❌ 结束</button>
          </div>
        </div>
        <div id="sp-link-tab-content-bag" style="display:none;padding:8px;">
          <div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:8px;">🎒 道具背包</div>
          <div id="sp-link-bag-content"></div>
        </div>
        <div id="sp-link-tab-content-shop" style="display:none;padding:8px;">
          <div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:8px;">🛒 道具商店</div>
          <div id="sp-link-shop-content"></div>
        </div>
        <div id="sp-link-tab-content-collection" style="display:none;padding:8px;">
          <div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:8px;">📖 图案图鉴 <span style="font-size:10px;color:var(--sp-text-muted);font-weight:400;">（点击 📷 上传自定义图片）</span></div>
          <div id="sp-link-collection-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;"></div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // 最小化
    document.getElementById('sp-link-minimize').addEventListener('click', () => {
      const linkPanel = document.getElementById('sp-link-panel');
      const minBtn = document.getElementById('sp-link-minimize');
      if (!linkPanel || !minBtn) return;
      if (linkPanel.classList.contains('sp-link-minimized')) {
        linkPanel.classList.remove('sp-link-minimized');
        minBtn.textContent = '─';
        minBtn.title = '缩小悬挂';
      } else {
        linkPanel.classList.add('sp-link-minimized');
        minBtn.textContent = '□';
        minBtn.title = '恢复窗口';
      }
    });

    // 关闭
    document.getElementById('sp-link-close').addEventListener('click', () => toggleLinkGame());

    // 道具按钮
    document.getElementById('sp-link-prop-hint').addEventListener('click', () => linkUseProp('hint'));
    document.getElementById('sp-link-prop-shuffle').addEventListener('click', () => linkUseProp('shuffle'));
    document.getElementById('sp-link-prop-bomb').addEventListener('click', () => linkUseProp('bomb'));
    document.getElementById('sp-link-prop-compass').addEventListener('click', () => linkUseProp('compass'));

    // 开始游戏按钮
    document.getElementById('sp-link-start-btn')?.addEventListener('click', () => {
      linkConfirmNewGame();
    });

    // 重开按钮
    document.getElementById('sp-link-restart-btn').addEventListener('click', () => {
      showConfirmDialog({
        title: '🔄 重开本局？',
        desc: '当前进度将清零，重新开始新的一局。<br/>将消耗一定体力。',
        confirmText: '重开',
        cancelText: '继续玩',
        onConfirm: () => {
          const ok = linkGenerateLevel();
          if (ok) {
            linkRender();
            linkShowNotice(`🔄 新的一局开始了！（-${linkState.difficulty.energyCost}⚡）| 棋盘: ${linkState.difficulty.name}`);
            if (isGameOpen) gameRenderStatus();
          }
        }
      });
    });

    // 结束按钮
    document.getElementById('sp-link-end-btn').addEventListener('click', () => {
      showConfirmDialog({
        title: '❌ 结束本局？',
        desc: `将按当前已消除对数结算金币。<br/>已消除: ${linkState.pairsEliminated} 对`,
        confirmText: '结算退出',
        cancelText: '继续玩',
        onConfirm: () => {
          linkState.active = false;
          if (linkState.compassTimer) { clearTimeout(linkState.compassTimer); linkState.compassTimer = null; }
          linkState.compassActive = false;
          linkState.bombMode = false;
          const baseReward = Math.floor(linkState.pairsEliminated * 0.3);
          state.gameGold += baseReward;
          saveDataImmediate('连连看手动结束');
          linkShowNotice(`结算完成！消除 ${linkState.pairsEliminated} 对，获得 +${baseReward} 🪙`);
          // 延迟后弹出新局确认
          setTimeout(() => {
            linkConfirmNewGame();
          }, 1500);
        }
      });
    });

    // 标签页切换
    const linkTabs = ['play', 'bag', 'shop', 'collection'];
    linkTabs.forEach(tabName => {
      const tabBtn = document.getElementById(`sp-link-tab-${tabName}`);
      if (tabBtn) {
        tabBtn.addEventListener('click', () => {
          linkTabs.forEach(t => {
            const b = document.getElementById(`sp-link-tab-${t}`);
            if (b) b.classList.toggle('active', t === tabName);
          });
          document.getElementById('sp-link-tab-content-play').style.display = tabName === 'play' ? '' : 'none';
          document.getElementById('sp-link-tab-content-bag').style.display = tabName === 'bag' ? '' : 'none';
          document.getElementById('sp-link-tab-content-shop').style.display = tabName === 'shop' ? '' : 'none';
          document.getElementById('sp-link-tab-content-collection').style.display = tabName === 'collection' ? '' : 'none';
          if (tabName === 'bag') linkRenderBag();
          if (tabName === 'shop') linkRenderShop();
          if (tabName === 'collection') linkRenderCollection();
        });
      }
    });

    // 面板拖拽
    linkBindPanelDrag();
  }

  // ===== 面板拖拽 =====
  function linkBindPanelDrag() {
    const header = document.getElementById('sp-link-header');
    const panel = document.getElementById('sp-link-panel');
    if (!header || !panel) return;

    let dragging = false, offX = 0, offY = 0;

    const down = (e) => {
      if (e.target.closest('#sp-link-close') || e.target.closest('#sp-link-minimize')) return;
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

  // ===== 开关连连看面板 =====
  function toggleLinkGame() {
    isLinkOpen = !isLinkOpen;
    let panel = document.getElementById('sp-link-panel');

    if (isLinkOpen) {
      gameRecoverStamina(); // 恢复体力

      // 每次打开都重新创建面板（动态挂载）
      if (panel) panel.remove();
      linkRenderPanel();
      panel = document.getElementById('sp-link-panel');

      panel.classList.add('visible');

      // 居中
      const w = Math.min(420, window.innerWidth - 20);
      panel.style.width = w + 'px';
      requestAnimationFrame(() => {
        const h = panel.offsetHeight;
        const maxTop = window.innerHeight - h - 20;
        const centerTop = Math.floor((window.innerHeight - h) / 2);
        panel.style.left = Math.floor((window.innerWidth - w) / 2) + 'px';
        panel.style.top = Math.max(10, Math.min(centerTop, maxTop)) + 'px';
      });

      // 如果没有活跃游戏，只渲染面板，不自动弹窗
      linkRender();

    } else {
      // 彻底销毁 DOM 和清理定时器
      if (panel) panel.remove();
      linkState.bombMode = false;
      linkState.bombFirst = null;
      if (linkState.compassTimer) { clearTimeout(linkState.compassTimer); linkState.compassTimer = null; }
      linkState.compassActive = false;
    }

  }

  // ===== 连连看开局确认弹窗 =====
  function linkConfirmNewGame() {
    showConfirmDialog({
      title: '🔗 开始新一局连连看？',
      desc: '开局将消耗一定体力，棋盘大小随机分配。<br/>准备好了吗？',
      confirmText: '✨ 开始',
      cancelText: '算了',
      onConfirm: () => {
        const ok = linkGenerateLevel();
        if (!ok) {
          // linkGenerateLevel 内部已经显示了体力不足通知
          return;
        }
        linkRender();
        linkShowNotice(`开局消耗 ${linkState.difficulty.energyCost} 点体力⚡ | 棋盘: ${linkState.difficulty.name}`);
        if (isGameOpen) gameRenderStatus();
      },
      onCancel: () => {
        // 不开局，留在游戏面板
      }

    });
  }

  // ============================================================
  // 🧊 冰箱整理游戏模块 - MeepFridgeOrganize
  // ============================================================

  // 冰箱道具商店定义
  const FRIDGE_PROP_ITEMS = {
    compress: {
      name: '🧃 压缩魔法',
      desc: '缩小一个食材的尺寸',
      price: 50,
      dailyLimit: 10,
      perGameLimit: 2
    },
    backpack: {
      name: '🎒 放进背包',
      desc: '跳过一个食材不扣完成率',
      price: 70,
      dailyLimit: 10,
      perGameLimit: 1
    },
    organize: {
      name: '🧹 一键整理',
      desc: '自动将冰箱物品靠左靠上码放',
      price: 30,
      dailyLimit: 10,
      perGameLimit: 3
    }
  };

  // ===== 冰箱食材定义 =====
  const FRIDGE_FOODS = [
    // 小型 (1格)
    { id: 'cola',       name: '可乐罐',     emoji: '🥤', w: 1, h: 1, value: 3,  feed: 3  },
    { id: 'apple',      name: '苹果',       emoji: '🍎', w: 1, h: 1, value: 3,  feed: 3  },
    { id: 'tomato',     name: '番茄',       emoji: '🍅', w: 1, h: 1, value: 3,  feed: 3  },
    { id: 'grape',      name: '葡萄',       emoji: '🍇', w: 1, h: 1, value: 3,  feed: 3  },
    // 中小型 (2格)
    { id: 'cheese',     name: '芝士块',     emoji: '🧀', w: 2, h: 1, value: 5,  feed: 5  },
    { id: 'juice',      name: '果汁',       emoji: '🧃', w: 1, h: 2, value: 5,  feed: 5  },
    { id: 'carrot',     name: '胡萝卜',     emoji: '🥕', w: 1, h: 2, value: 4,  feed: 4  },
    { id: 'icecream',   name: '冰淇淋',     emoji: '🍦', w: 1, h: 2, value: 5,  feed: 5  },
    { id: 'bottle',     name: '酱油瓶',     emoji: '🫙', w: 1, h: 3, value: 6,  feed: 4  },
    // 中型 (3~4格)
    { id: 'milk',       name: '大盒牛奶',   emoji: '🥛', w: 1, h: 3, value: 8,  feed: 8  },
    { id: 'cucumber',   name: '黄瓜',       emoji: '🥒', w: 1, h: 4, value: 8,  feed: 6, noRotate: true },
    { id: 'fish',       name: '鲜鱼',       emoji: '🐟', w: 3, h: 1, value: 8,  feed: 8  },
    { id: 'eggs',       name: '鸡蛋盒',     emoji: '🥚', w: 4, h: 1, value: 7,  feed: 6, noRotate: true },
    { id: 'bread',      name: '切片面包',   emoji: '🍞', w: 2, h: 2, value: 8,  feed: 8  },
    // 中大型 (5~6格)
    { id: 'chicken',    name: '烤鸡',       emoji: '🍗', w: 2, h: 3, value: 12, feed: 12 },
    { id: 'bento',      name: '便当盒',     emoji: '🍱', w: 3, h: 2, value: 12, feed: 10 },
    { id: 'steak',      name: '战斧牛排',   emoji: '🥩', w: 3, h: 2, value: 14, feed: 14 },
    // 大型 (8~9格)
    { id: 'watermelon', name: '大西瓜',     emoji: '🍉', w: 3, h: 3, value: 18, feed: 16 },
    { id: 'sushi',      name: '寿司拼盘',   emoji: '🍣', w: 4, h: 2, value: 16, feed: 14 },
    { id: 'pizza',      name: '披萨盒',     emoji: '🍕', w: 3, h: 3, value: 18, feed: 16 },
    { id: 'cake',       name: '大蛋糕',     emoji: '🎂', w: 3, h: 3, value: 20, feed: 18, noRotate: true },
    // 超大型 (10~12格) - 新增难度食材
    { id: 'turkey',     name: '整只火鸡',   emoji: '🦃', w: 4, h: 3, value: 24, feed: 22, noRotate: true },
    { id: 'pot',        name: '火锅底料',   emoji: '🫕', w: 4, h: 2, value: 16, feed: 12 },
    { id: 'platter',    name: '海鲜拼盘',   emoji: '🦞', w: 5, h: 2, value: 22, feed: 20, noRotate: true },
    { id: 'barrel',     name: '泡菜大缸',   emoji: '🪣', w: 4, h: 4, value: 28, feed: 24, noRotate: true },
    { id: 'icechest',   name: '冷藏箱',     emoji: '📦', w: 5, h: 3, value: 30, feed: 26  },
    // 新增小食材（与餐厅新菜联动）
    { id: 'mushroom',   name: '香菇',       emoji: '🍄', w: 1, h: 1, value: 4,  feed: 4  },
    { id: 'shrimp',     name: '鲜虾',       emoji: '🦐', w: 2, h: 1, value: 6,  feed: 6  },
    { id: 'corn',       name: '甜玉米',     emoji: '🌽', w: 1, h: 2, value: 5,  feed: 5  },
    { id: 'avocado',    name: '牛油果',     emoji: '🥑', w: 1, h: 1, value: 5,  feed: 5  },
    { id: 'dumpling',   name: '速冻饺子',   emoji: '🥟', w: 2, h: 2, value: 10, feed: 10 },
    { id: 'tofu',       name: '嫩豆腐',     emoji: '🧊', w: 2, h: 1, value: 4,  feed: 4  },
    { id: 'noodle',     name: '拉面包',     emoji: '🍜', w: 3, h: 1, value: 7,  feed: 7  },
    { id: 'lobster',    name: '大龙虾',     emoji: '🦞', w: 3, h: 2, value: 20, feed: 18 },
    // 餐厅进货区基础蔬菜（花金币购买或者抽奖）
    { id: 'potato',    name: '土豆',     emoji: '🥔', w: 1, h: 1, value: 3,  feed: 3  },
    { id: 'onion',     name: '洋葱',     emoji: '🧅', w: 1, h: 1, value: 3,  feed: 3  },
    { id: 'garlic',    name: '大蒜',     emoji: '🧄', w: 1, h: 1, value: 2,  feed: 2  },
    { id: 'cabbage',   name: '卷心菜',   emoji: '🥬', w: 2, h: 1, value: 4,  feed: 4  },
    { id: 'eggplant',  name: '茄子',     emoji: '🍆', w: 1, h: 2, value: 4,  feed: 4  },
    { id: 'broccoli',  name: '西兰花',   emoji: '🥦', w: 1, h: 1, value: 4,  feed: 4  },
    { id: 'pumpkin',   name: '南瓜',     emoji: '🎃', w: 2, h: 2, value: 6,  feed: 6  },
    { id: 'leek',      name: '大葱',     emoji: '🌿', w: 1, h: 2, value: 3,  feed: 2  },
    { id: 'ginger',    name: '生姜',     emoji: '🫚', w: 1, h: 1, value: 3,  feed: 2  },
    { id: 'celery',      name: '芹菜',     emoji: '🌿', w: 1, h: 2, value: 3,  feed: 3  },
    { id: 'chili',       name: '辣椒',     emoji: '🌶️', w: 1, h: 1, value: 3,  feed: 3  },
    { id: 'bean',        name: '四季豆',   emoji: '🫛', w: 1, h: 2, value: 3,  feed: 3  },
    { id: 'radish',      name: '白萝卜',   emoji: '🥕', w: 1, h: 2, value: 4,  feed: 4  },
    { id: 'lettuce',     name: '生菜',     emoji: '🥬', w: 1, h: 1, value: 2,  feed: 2  },
    { id: 'sweetpotato', name: '红薯',     emoji: '🍠', w: 2, h: 1, value: 4,  feed: 4  },

    // ===== 异形物品（不规则形状）=====
    { id: 'lshape_meat',  name: 'L形肉排',     emoji: '🥓', w: 2, h: 3, value: 9,  feed: 9,  shape: [[1,0],[1,0],[1,1]] },
    { id: 'tshape_cheese', name: 'T形芝士块', emoji: '🧀', w: 3, h: 2, value: 10, feed: 10, shape: [[1,1,1],[0,1,0]] },
    { id: 'zshape_sushi',  name: 'Z形寿司条', emoji: '🍣', w: 3, h: 2, value: 11, feed: 11, shape: [[1,1,0],[0,1,1]] },
    { id: 'ushape_bread',  name: 'U形法棍',   emoji: '🥖', w: 3, h: 2, value: 10, feed: 10, shape: [[1,0,1],[1,1,1]] },
    { id: 'cross_cake',    name: '十字蛋糕',   emoji: '🎂', w: 3, h: 3, value: 14, feed: 14, noRotate: true, shape: [[0,1,0],[1,1,1],[0,1,0]] },
    { id: 'sshape_fish',   name: 'S形鱼排',   emoji: '🐡', w: 2, h: 3, value: 11, feed: 11, shape: [[0,1],[1,1],[1,0]] },

  ];

  // ===== 冰箱类型定义 =====
  const FRIDGE_TYPES = [
    { name: '小单门冰箱', rows: 5,  cols: 5,  energyCost: 5,  emoji: '🧊', itemRange: [7, 10]  },
    { name: '中型冰箱',   rows: 6,  cols: 6,  energyCost: 8,  emoji: '❄️', itemRange: [9, 14]  },
    { name: '双开门冰箱', rows: 7,  cols: 7,  energyCost: 12, emoji: '🏔️', itemRange: [12, 18] },
    { name: '超大冰箱',   rows: 8,  cols: 8,  energyCost: 15, emoji: '🌨️', itemRange: [16, 24] },
    { name: '豪华巨无霸', rows: 10, cols: 10, energyCost: 18, emoji: '🎪', itemRange: [22, 32] },
    { name: '仓库级冰柜', rows: 12, cols: 12, energyCost: 22, emoji: '🏭', itemRange: [30, 42] },
    { name: '极限挑战',   rows: 14, cols: 14, energyCost: 28, emoji: '🌌', itemRange: [40, 55] },
  ];

  // ===== 冰箱游戏运行时状态 =====
  let fridgeState = {
    active: false,
    grid: [],           // 2D数组 [row][col], 0=空, >0=物品实例ID
    rows: 0,
    cols: 0,
    type: null,
    basket: [],         // [{instanceId, foodId, w, h, rotated}]
    placed: [],         // [{instanceId, foodId, row, col, w, h}]
    selectedItem: null, // basket中选中物品的instanceId
    propsUsed: { compress: 0, backpack: 0, organize: 0 },
    totalValue: 0,
    placedValue: 0,
    energyCost: 0,
    nextInstanceId: 1,
  };

  let isFridgeOpen = false;

  // ===== 生成购物筐 =====
  function fridgeGenerateBasket(itemCount, gridRows, gridCols) {
    const basket = [];
    const gridArea = gridRows * gridCols;
    let totalArea = 0;
    let id = fridgeState.nextInstanceId;

    // 按尺寸分类食物
    const small = FRIDGE_FOODS.filter(f => f.w * f.h <= 2);
    const medium = FRIDGE_FOODS.filter(f => f.w * f.h >= 3 && f.w * f.h <= 6);
    const large = FRIDGE_FOODS.filter(f => f.w * f.h >= 8 && f.w * f.h <= 9);
    const xlarge = FRIDGE_FOODS.filter(f => f.w * f.h >= 10);

    // 目标填充率：85%~110% 的冰箱面积（超过100%意味着必然放不下所有东西）
    const targetFill = gridArea * (0.85 + Math.random() * 0.25);

    for (let i = 0; i < itemCount; i++) {
      let pool;
      const remainingRatio = totalArea / targetFill;

      if (remainingRatio > 0.9) {
        pool = small;
      } else if (remainingRatio > 0.7) {
        pool = Math.random() < 0.4 ? small : medium;
      } else if (remainingRatio > 0.4) {
        const r = Math.random();
        if (r < 0.15) pool = small;
        else if (r < 0.50) pool = medium;
        else if (r < 0.80) pool = large.length > 0 ? large : medium;
        else pool = xlarge.length > 0 ? xlarge : large.length > 0 ? large : medium;
      } else {
        // 前期多给大件，增加挑战
        const r = Math.random();
        if (r < 0.10) pool = small;
        else if (r < 0.35) pool = medium;
        else if (r < 0.65) pool = large.length > 0 ? large : medium;
        else pool = xlarge.length > 0 ? xlarge : large.length > 0 ? large : medium;
      }

      // 过滤掉放不进冰箱的食材
      const valid = pool.filter(f => f.w <= gridCols && f.h <= gridRows);
      if (valid.length === 0) {
        // 降级尝试
        const fallback = medium.filter(f => f.w <= gridCols && f.h <= gridRows);
        if (fallback.length === 0) continue;
        const food = fallback[Math.floor(Math.random() * fallback.length)];
        basket.push({
          instanceId: id++,
          foodId: food.id,
          w: food.w,
          h: food.h,
          rotated: false,
          shape: food.shape ? food.shape.map(row => [...row]) : null,
        });
        totalArea += food.w * food.h;
        continue;
      }

      const food = valid[Math.floor(Math.random() * valid.length)];
      basket.push({
        instanceId: id++,
        foodId: food.id,
        w: food.w,
        h: food.h,
        rotated: false,
        shape: food.shape ? food.shape.map(row => [...row]) : null,
      });
      totalArea += food.w * food.h;
    }

    fridgeState.nextInstanceId = id;
    return basket;
  }

  // ===== 初始化冰箱游戏 =====
  function fridgeStartGame() {
    // 随机选择冰箱类型
    const type = FRIDGE_TYPES[Math.floor(Math.random() * FRIDGE_TYPES.length)];
    fridgeState.type = type;
    fridgeState.rows = type.rows;
    fridgeState.cols = type.cols;
    fridgeState.energyCost = type.energyCost;

    // 检查体力（开局后才扣）
    if (state.gameStamina < type.energyCost) {
      fridgeShowNotice(`体力不足！本局需要 ${type.energyCost} 点体力`);
      fridgeState.active = false;
      return false;
    }
    state.gameStamina -= type.energyCost;

    // 初始化网格
    fridgeState.grid = [];
    for (let r = 0; r < type.rows; r++) {
      fridgeState.grid.push(new Array(type.cols).fill(0));
    }

    // 生成购物筐
    const count = type.itemRange[0] + Math.floor(Math.random() * (type.itemRange[1] - type.itemRange[0] + 1));
    fridgeState.basket = fridgeGenerateBasket(count, type.rows, type.cols);
    fridgeState.placed = [];
    fridgeState.selectedItem = null;
    fridgeState.propsUsed = { compress: 0, backpack: 0, organize: 0 };
    fridgeState.totalValue = fridgeState.basket.reduce((s, item) => {
      const data = FRIDGE_FOODS.find(f => f.id === item.foodId);
      return s + (data ? data.value : 0);
    }, 0);
    fridgeState.placedValue = 0;
    fridgeState.active = true;
    fridgeState.nextInstanceId = fridgeState.basket.length + 1;

    saveDataDebounced('冰箱整理开局');
    return true;
  }

  // ===== 检查是否可以放置（支持异形）=====
  function fridgeCanPlace(row, col, w, h, shape) {
    if (row < 0 || col < 0 || row + h > fridgeState.rows || col + w > fridgeState.cols) return false;
    if (shape) {
      // 异形物品：按 shape 遮罩逐格检查
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c] === 1) {
            if (fridgeState.grid[row + r][col + c] !== 0) return false;
          }
        }
      }
    } else {
      // 矩形物品：原有逻辑
      for (let r = row; r < row + h; r++) {
        for (let c = col; c < col + w; c++) {
          if (fridgeState.grid[r][c] !== 0) return false;
        }
      }
    }
    return true;
  }

  // ===== 放置物品（支持异形）=====
  function fridgePlaceItem(instanceId, row, col) {
    const item = fridgeState.basket.find(i => i.instanceId === instanceId);
    if (!item) return false;

    const w = item.w;
    const h = item.h;
    const shape = item.shape || null;

    if (!fridgeCanPlace(row, col, w, h, shape)) {
      fridgeShowNotice('放不下！空间不够或有重叠');
      return false;
    }

    // 写入网格
    if (shape) {
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c] === 1) {
            fridgeState.grid[row + r][col + c] = instanceId;
          }
        }
      }
    } else {
      for (let r = row; r < row + h; r++) {
        for (let c = col; c < col + w; c++) {
          fridgeState.grid[r][c] = instanceId;
        }
      }
    }

    // 从购物筐移除，加入已放置列表
    fridgeState.basket = fridgeState.basket.filter(i => i.instanceId !== instanceId);
    fridgeState.placed.push({
      instanceId,
      foodId: item.foodId,
      row, col, w, h,
      shape: shape || null,
    });

    // 更新已放置价值
    const data = FRIDGE_FOODS.find(f => f.id === item.foodId);
    if (data) fridgeState.placedValue += data.value;

    fridgeState.selectedItem = null;
    saveDataDebounced('冰箱放置物品');
    return true;
  }

  // ===== 旋转选中物品（支持异形）=====
  function fridgeRotateSelected() {
    if (!fridgeState.selectedItem) {
      fridgeShowNotice('请先选择一个食材');
      return;
    }
    const item = fridgeState.basket.find(i => i.instanceId === fridgeState.selectedItem);
    if (!item) return;

    // 检查是否不可旋转
    const foodData = FRIDGE_FOODS.find(f => f.id === item.foodId);
    if (foodData && foodData.noRotate) {
      fridgeShowNotice(`${foodData.emoji} ${foodData.name} 形状固定，无法旋转！`);
      return;
    }

    // 正方形且无异形 shape 不需要旋转
    if (item.w === item.h && !item.shape) {
      fridgeShowNotice('正方形食材旋转无效果');
      return;
    }

    // 异形物品：旋转 shape 矩阵（顺时针90度）
    if (item.shape) {
      const oldShape = item.shape;
      const oldH = oldShape.length;
      const oldW = oldShape[0].length;
      const newShape = [];
      for (let c = 0; c < oldW; c++) {
        const newRow = [];
        for (let r = oldH - 1; r >= 0; r--) {
          newRow.push(oldShape[r][c]);
        }
        newShape.push(newRow);
      }
      item.shape = newShape;
      item.w = newShape[0].length;
      item.h = newShape.length;
      item.rotated = !item.rotated;

      // 检查旋转后是否还能放进冰箱
      if (item.w > fridgeState.cols || item.h > fridgeState.rows) {
        // 旋转回去
        item.shape = oldShape;
        item.w = oldW;
        item.h = oldH;
        item.rotated = !item.rotated;
        fridgeShowNotice('旋转后太大了，放不进冰箱');
        return;
      }

      fridgeShowNotice(`🔄 ${foodData?.name || '食材'} 已旋转 → ${item.w}×${item.h}（异形）`);
      fridgeRender();
      return;
    }

    // 普通矩形物品：检查旋转后是否还能放进冰箱
    if (item.h > fridgeState.cols || item.w > fridgeState.rows) {
      fridgeShowNotice('旋转后太大了，放不进冰箱');
      return;
    }

    const tmp = item.w;
    item.w = item.h;
    item.h = tmp;
    item.rotated = !item.rotated;
    fridgeShowNotice(`🔄 ${foodData?.name || '食材'} 已旋转 → ${item.w}×${item.h}`);
    fridgeRender();
  }

  // ===== 道具：压缩魔法 =====
  function fridgeUseCompress() {
    if (fridgeState.propsUsed.compress >= FRIDGE_PROP_ITEMS.compress.perGameLimit) {
      fridgeShowNotice(`压缩魔法本局已用完（限${FRIDGE_PROP_ITEMS.compress.perGameLimit}次）`);
      return;
    }
    if (!state.fridgePropInventory) state.fridgePropInventory = { compress: 0, backpack: 0, organize: 0 };
    if ((state.fridgePropInventory.compress || 0) <= 0) {
      fridgeShowNotice('压缩魔法库存不足！去商店购买吧');
      return;
    }
    if (!fridgeState.selectedItem) {
      fridgeShowNotice('请先选择一个食材再压缩');
      return;
    }
    const item = fridgeState.basket.find(i => i.instanceId === fridgeState.selectedItem);
    if (!item) return;
    if (item.w <= 1 && item.h <= 1) {
      fridgeShowNotice('已经是最小尺寸了');
      return;
    }

    // 扣库存
    state.fridgePropInventory.compress--;
    fridgeState.propsUsed.compress++;

    // 缩小：长边减1（最小为1）
    if (item.w >= item.h && item.w > 1) {
      item.w--;
    } else if (item.h > 1) {
      item.h--;
    }

    const data = FRIDGE_FOODS.find(f => f.id === item.foodId);
    fridgeShowNotice(`🧃 ${data?.name} 被压缩为 ${item.w}×${item.h}！`);
    saveDataDebounced('冰箱使用压缩道具');
    fridgeRender();
  }

  // ===== 道具：放进背包 =====
  function fridgeUseBackpack() {
    if (fridgeState.propsUsed.backpack >= FRIDGE_PROP_ITEMS.backpack.perGameLimit) {
      fridgeShowNotice(`放进背包本局已用完（限${FRIDGE_PROP_ITEMS.backpack.perGameLimit}次）`);
      return;
    }
    if (!state.fridgePropInventory) state.fridgePropInventory = { compress: 0, backpack: 0, organize: 0 };
    if ((state.fridgePropInventory.backpack || 0) <= 0) {
      fridgeShowNotice('放进背包道具库存不足！去商店购买吧');
      return;
    }
    if (!fridgeState.selectedItem) {
      fridgeShowNotice('请先选择一个食材');
      return;
    }
    const item = fridgeState.basket.find(i => i.instanceId === fridgeState.selectedItem);
    if (!item) return;

    const data = FRIDGE_FOODS.find(f => f.id === item.foodId);

    // 扣库存
    state.fridgePropInventory.backpack--;
    fridgeState.propsUsed.backpack++;

    // 从购物筐移除，不扣除完成率（从总价值中去掉）
    fridgeState.basket = fridgeState.basket.filter(i => i.instanceId !== fridgeState.selectedItem);
    if (data) fridgeState.totalValue -= data.value;
    fridgeState.selectedItem = null;

    fridgeShowNotice(`🎒 ${data?.name} 已放入背包，不计入完成率`);
    saveDataDebounced('冰箱使用跳过道具');
    fridgeRender();
  }

  // ===== 道具：一键整理 =====
  function fridgeUseOrganize() {
    if (fridgeState.propsUsed.organize >= FRIDGE_PROP_ITEMS.organize.perGameLimit) {
      fridgeShowNotice(`一键整理本局已用完（限${FRIDGE_PROP_ITEMS.organize.perGameLimit}次）`);
      return;
    }
    if (!state.fridgePropInventory) state.fridgePropInventory = { compress: 0, backpack: 0, organize: 0 };
    if ((state.fridgePropInventory.organize || 0) <= 0) {
      fridgeShowNotice('一键整理道具库存不足！去商店购买吧');
      return;
    }
    if (fridgeState.placed.length === 0) {
      fridgeShowNotice('冰箱里还没有放东西');
      return;
    }

    // 扣库存
    state.fridgePropInventory.organize--;
    fridgeState.propsUsed.organize++;

    // 清空网格
    for (let r = 0; r < fridgeState.rows; r++) {
      for (let c = 0; c < fridgeState.cols; c++) {
        fridgeState.grid[r][c] = 0;
      }
    }

    // 按面积从大到小排序
    const items = [...fridgeState.placed].sort((a, b) => (b.w * b.h) - (a.w * a.h));
    const newPlaced = [];

    items.forEach(item => {
      let placed = false;
      // 贪心：从上到下、从左到右找第一个能放的位置
      for (let r = 0; r <= fridgeState.rows - item.h && !placed; r++) {
        for (let c = 0; c <= fridgeState.cols - item.w && !placed; c++) {
          if (fridgeCanPlace(r, c, item.w, item.h, item.shape)) {
            if (item.shape) {
              for (let sr = 0; sr < item.shape.length; sr++) {
                for (let sc = 0; sc < item.shape[sr].length; sc++) {
                  if (item.shape[sr][sc] === 1) {
                    fridgeState.grid[r + sr][c + sc] = item.instanceId;
                  }
                }
              }
            } else {
              for (let rr = r; rr < r + item.h; rr++) {
                for (let cc = c; cc < c + item.w; cc++) {
                  fridgeState.grid[rr][cc] = item.instanceId;
                }
              }
            }
            newPlaced.push({ ...item, row: r, col: c });
            placed = true;
          }
        }
      }
      if (!placed) {
        // 尝试旋转后放置
        const rotW = item.h, rotH = item.w;
        for (let r = 0; r <= fridgeState.rows - rotH && !placed; r++) {
          for (let c = 0; c <= fridgeState.cols - rotW && !placed; c++) {
            if (fridgeCanPlace(r, c, rotW, rotH)) {
              for (let rr = r; rr < r + rotH; rr++) {
                for (let cc = c; cc < c + rotW; cc++) {
                  fridgeState.grid[rr][cc] = item.instanceId;
                }
              }
              newPlaced.push({ ...item, row: r, col: c, w: rotW, h: rotH });
              placed = true;
            }
          }
        }
      }
      if (!placed) {
        // 实在放不下，保留原位
        for (let rr = item.row; rr < item.row + item.h && rr < fridgeState.rows; rr++) {
          for (let cc = item.col; cc < item.col + item.w && cc < fridgeState.cols; cc++) {
            if (fridgeState.grid[rr][cc] === 0) fridgeState.grid[rr][cc] = item.instanceId;
          }
        }
        newPlaced.push(item);
      }
    });

    fridgeState.placed = newPlaced;
    fridgeShowNotice('🧹 冰箱已自动整理！');
    saveDataDebounced('冰箱一键整理');
    fridgeRender();
  }

  // ===== 关上冰箱门（结算）=====
  function fridgeCloseDoor() {
    fridgeState.active = false;

    const totalCells = fridgeState.rows * fridgeState.cols;
    let filledCells = 0;
    for (let r = 0; r < fridgeState.rows; r++) {
      for (let c = 0; c < fridgeState.cols; c++) {
        if (fridgeState.grid[r][c] !== 0) filledCells++;
      }
    }
    const fillPercent = Math.round((filledCells / totalCells) * 100);
    const valuePercent = fridgeState.totalValue > 0 ? Math.round((fridgeState.placedValue / fridgeState.totalValue) * 100) : 0;
    const basketRemaining = fridgeState.basket.length;

    // 计算金币奖励
    let goldReward = Math.floor(fridgeState.placedValue * 0.5);
    let bonusGold = 0;
    let resultTitle = '';

    if (valuePercent >= 100 && basketRemaining === 0) {
      resultTitle = '🌟 完美收纳！';
      bonusGold = 40 + Math.floor(Math.random() * 21);
    } else if (valuePercent >= 95) {
      resultTitle = '🎉 优秀！';
      bonusGold = 20 + Math.floor(Math.random() * 11);
    } else if (valuePercent >= 80) {
      resultTitle = '👍 不错！';
      bonusGold = 8;
    } else if (valuePercent >= 60) {
      resultTitle = '😅 还行吧';
      bonusGold = 3;
    } else {
      resultTitle = '😰 需要努力';
      bonusGold = 0;
    }

    const totalGold = goldReward + bonusGold;
    state.gameGold += totalGold;

    // 将已放置的食材存入冰箱库存
    if (!state.fridgeInventory) state.fridgeInventory = [];
    fridgeState.placed.forEach(item => {
      const existing = state.fridgeInventory.find(i => i.foodId === item.foodId);
      if (existing) {
        existing.count++;
      } else {
        state.fridgeInventory.push({ foodId: item.foodId, count: 1 });
      }
    });

    // 桌宠属性微增
    state.hunger = Math.min(100, state.hunger + 1);
    state.energy = Math.min(100, state.energy + 1);
    updateMood();
    updateStatusBars();

    saveDataImmediate('冰箱整理结算');
    checkAchievements();

    // 显示结算弹窗
    const panel = document.getElementById('sp-fridge-panel');
    if (!panel) return;
    panel.querySelector('#sp-fridge-result-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'sp-fridge-result-overlay';
    overlay.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:10;border-radius:16px;';
    overlay.innerHTML = `
      <div class="sp-fridge-result-box">
        <div class="sp-fridge-result-title">${resultTitle}</div>
        <div class="sp-fridge-result-info">
          <div>${fridgeState.type.emoji} ${fridgeState.type.name} (${fridgeState.rows}×${fridgeState.cols})</div>
          <div>空间填充: ${fillPercent}%</div>
          <div>食材完成率: ${valuePercent}% (${fridgeState.placed.length}件放入)</div>
          ${basketRemaining > 0 ? `<div style="color:#f66;">未放入: ${basketRemaining}件</div>` : ''}
          <div>基础奖励: +${goldReward} 🪙</div>
          ${bonusGold > 0 ? `<div style="color:#ffb347;">额外奖励: +${bonusGold} 🪙</div>` : ''}
          <div style="font-weight:700;margin-top:6px;">总获得: +${totalGold} 🪙</div>
          <div style="font-size:11px;color:var(--sp-text-muted);margin-top:4px;">🧊 ${fridgeState.placed.length}件食材已存入冰箱库存</div>
        </div>
        <div class="sp-fridge-result-actions">
          <button class="sp-fridge-result-btn" id="sp-fridge-restart">🔄 再来一局</button>
          <button class="sp-fridge-result-btn sp-fridge-result-close" id="sp-fridge-quit">❌ 退出</button>
        </div>
      </div>
    `;
    panel.appendChild(overlay);

    document.getElementById('sp-fridge-restart')?.addEventListener('click', () => {
      overlay.remove();
      fridgeConfirmNewGame();
    });
    document.getElementById('sp-fridge-quit')?.addEventListener('click', () => {
      overlay.remove();
      toggleFridgeGame();
    });

  }

  // ===== 冰箱通知 =====
  function fridgeShowNotice(text) {
    const notice = document.getElementById('sp-fridge-notice');
    if (!notice) return;
    notice.textContent = text;
    notice.classList.add('visible');
    clearTimeout(notice._timer);
    notice._timer = setTimeout(() => notice.classList.remove('visible'), 3000);
  }

  // ===== 计算填充率 =====
  function fridgeGetFillPercent() {
    const totalCells = fridgeState.rows * fridgeState.cols;
    let filled = 0;
    for (let r = 0; r < fridgeState.rows; r++) {
      for (let c = 0; c < fridgeState.cols; c++) {
        if (fridgeState.grid[r][c] !== 0) filled++;
      }
    }
    return totalCells > 0 ? Math.round((filled / totalCells) * 100) : 0;
  }

  // ===== 渲染冰箱游戏 =====
  function fridgeRender() {
    const gridEl = document.getElementById('sp-fridge-grid');
    const basketEl = document.getElementById('sp-fridge-basket-items');
    const infoEl = document.getElementById('sp-fridge-info');
    if (!gridEl) return;

    const { rows, cols, grid, placed, selectedItem, basket } = fridgeState;

    // 设置网格模板
    gridEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridEl.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    let html = '';

    // 背景格子
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const occupied = grid[r][c] !== 0;
        html += `<div class="sp-fridge-cell ${occupied ? 'sp-fridge-cell-occupied' : ''}" data-row="${r}" data-col="${c}" style="grid-column:${c + 1};grid-row:${r + 1};"></div>`;
      }
    }

    // 已放置的物品（覆盖在格子上面）
    placed.forEach(item => {
      const data = FRIDGE_FOODS.find(f => f.id === item.foodId);
      const emoji = data ? data.emoji : '?';
      const name = data ? data.name : '?';

      if (item.shape) {
        // 异形物品：外层容器占据 bounding box 但 pointer-events:none
        // 内部按 shape 逐格渲染，shape=1 的格子可点击，shape=0 的格子穿透
        html += `<div style="grid-column:${item.col + 1}/span ${item.w};grid-row:${item.row + 1}/span ${item.h};display:grid;grid-template-columns:repeat(${item.w},1fr);grid-template-rows:repeat(${item.h},1fr);gap:1px;pointer-events:none;background:transparent;border:none;z-index:2;position:relative;" title="${name} (异形) - 点击取出">`;
        for (let r = 0; r < item.shape.length; r++) {
          for (let c = 0; c < item.shape[r].length; c++) {
            if (item.shape[r][c] === 1) {
              html += `<div class="sp-fridge-placed-cell" data-placed-instance="${item.instanceId}" style="pointer-events:auto;background:rgba(100,180,255,0.15);border:1px solid rgba(100,180,255,0.3);border-radius:3px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background 0.15s,border-color 0.15s;box-sizing:border-box;"></div>`;
            } else {
              html += `<div style="pointer-events:none;background:transparent;"></div>`;
            }
          }
        }
        // emoji 用绝对定位浮在中心，不影响点击穿透
        html += `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;font-size:18px;line-height:1;">${emoji}</div>`;
        html += `</div>`;
      } else {
        // 普通矩形物品：保持原来的渲染方式
        html += `<div class="sp-fridge-placed-item" data-placed-instance="${item.instanceId}" style="grid-column:${item.col + 1}/span ${item.w};grid-row:${item.row + 1}/span ${item.h};" title="${name} (${item.w}×${item.h}) - 点击取出"><span class="sp-fridge-placed-emoji">${emoji}</span><span class="sp-fridge-placed-name">${name}</span></div>`;
      }
    });

    gridEl.innerHTML = html;

    // ===== 绑定背景格子点击事件（放置物品）=====
    gridEl.querySelectorAll('.sp-fridge-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        if (!fridgeState.active || !fridgeState.selectedItem) return;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const success = fridgePlaceItem(fridgeState.selectedItem, row, col);
        if (success) {
          fridgeRender();
          if (fridgeState.basket.length === 0) {
            fridgeShowNotice('🎉 所有食材都放进去了！点击「关上冰箱门」结算');
          }
        }
      });

      // 鼠标悬停预览
      cell.addEventListener('mouseenter', () => {
        if (!fridgeState.active || !fridgeState.selectedItem) return;
        const item = fridgeState.basket.find(i => i.instanceId === fridgeState.selectedItem);
        if (!item) return;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        fridgeShowPreview(row, col, item.w, item.h, item.shape);
      });
      cell.addEventListener('mouseleave', () => {
        fridgeClearPreview();
      });
    });

    // ===== 绑定已放置物品取出事件（统一用 [data-placed-instance] 覆盖普通和异形）=====
    gridEl.querySelectorAll('[data-placed-instance]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!fridgeState.active) return;
        const instanceId = parseInt(el.dataset.placedInstance);
        if (isNaN(instanceId)) return;

        const placedIdx = fridgeState.placed.findIndex(p => p.instanceId === instanceId);
        if (placedIdx === -1) return;

        const item = fridgeState.placed[placedIdx];
        const data = FRIDGE_FOODS.find(f => f.id === item.foodId);

        // 从网格中清除（支持异形）
        if (item.shape) {
          for (let r = 0; r < item.shape.length; r++) {
            for (let c = 0; c < item.shape[r].length; c++) {
              if (item.shape[r][c] === 1) {
                const gr = item.row + r;
                const gc = item.col + c;
                if (gr < fridgeState.rows && gc < fridgeState.cols) {
                  fridgeState.grid[gr][gc] = 0;
                }
              }
            }
          }
        } else {
          for (let r = item.row; r < item.row + item.h; r++) {
            for (let c = item.col; c < item.col + item.w; c++) {
              if (r < fridgeState.rows && c < fridgeState.cols) {
                fridgeState.grid[r][c] = 0;
              }
            }
          }
        }

        // 从已放置列表中移除
        fridgeState.placed.splice(placedIdx, 1);

        // 放回购物筐（恢复原始 shape）
        const originalFood = FRIDGE_FOODS.find(f => f.id === item.foodId);
        fridgeState.basket.push({
          instanceId: item.instanceId,
          foodId: item.foodId,
          w: item.w,
          h: item.h,
          rotated: false,
          shape: item.shape
            ? item.shape.map(row => [...row])
            : (originalFood && originalFood.shape ? originalFood.shape.map(row => [...row]) : null),
        });

        // 更新已放置价值
        if (data) fridgeState.placedValue -= data.value;

        fridgeShowNotice(`${data?.emoji || ''} ${data?.name || '食材'} 已取出放回购物筐`);
        saveDataDebounced('冰箱取出物品');
        fridgeRender();
      });
    });

    // ===== 异形物品 hover 联动高亮（所有同 instanceId 的格子一起变色）=====
    const seenInstances = new Set();
    gridEl.querySelectorAll('[data-placed-instance]').forEach(el => {
      const instanceId = el.dataset.placedInstance;
      if (seenInstances.has(instanceId)) return;
      seenInstances.add(instanceId);

      const cells = gridEl.querySelectorAll(`[data-placed-instance="${instanceId}"]`);
      cells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
          cells.forEach(c => {
            c.style.background = 'rgba(239,83,80,0.2)';
            c.style.borderColor = 'rgba(239,83,80,0.6)';
          });
        });
        cell.addEventListener('mouseleave', () => {
          cells.forEach(c => {
            c.style.background = 'rgba(100,180,255,0.15)';
            c.style.borderColor = 'rgba(100,180,255,0.3)';
          });
        });
      });
    });

    // ===== 渲染购物筐 =====
    if (basketEl) {
      if (basket.length === 0) {
        basketEl.innerHTML = '<div class="sp-fridge-basket-empty">购物筐已清空！🎉</div>';
      } else {
        basketEl.innerHTML = basket.map(item => {
          const data = FRIDGE_FOODS.find(f => f.id === item.foodId);
          const isSelected = item.instanceId === selectedItem;
          const noRotateTag = (data && data.noRotate) ? '<span style="font-size:8px;color:#f66;margin-left:2px;">🔒</span>' : '';
          const shapeTag = item.shape ? '<span style="font-size:8px;color:#c87fff;margin-left:2px;">◆异形</span>' : '';
          return `<div class="sp-fridge-basket-item ${isSelected ? 'sp-fridge-basket-selected' : ''}" data-instance="${item.instanceId}"><span class="sp-fridge-basket-emoji">${data?.emoji || '?'}</span><span class="sp-fridge-basket-info"><span class="sp-fridge-basket-name">${data?.name || '?'}${noRotateTag}${shapeTag}</span><span class="sp-fridge-basket-size">${item.w}×${item.h}${item.shape ? '(异形)' : ''}</span></span></div>`;
        }).join('');

        basketEl.querySelectorAll('.sp-fridge-basket-item').forEach(el => {
          el.addEventListener('click', () => {
            const id = parseInt(el.dataset.instance);
            fridgeState.selectedItem = (fridgeState.selectedItem === id) ? null : id;
            fridgeRender();
          });
        });
      }
    }

    // ===== 信息栏 =====
    if (infoEl) {
      const fillPct = fridgeGetFillPercent();
      const valuePct = fridgeState.totalValue > 0 ? Math.round((fridgeState.placedValue / fridgeState.totalValue) * 100) : 0;
      infoEl.innerHTML = `
        <span>${fridgeState.type?.emoji || '🧊'} ${fridgeState.type?.name || '冰箱'} ${rows}×${cols}</span>
        <span>填充: ${fillPct}%</span>
        <span>完成: ${valuePct}%</span>
        <span>剩余: ${basket.length}件</span>
      `;
    }

    // ===== 道具按钮状态 =====
    if (!state.fridgePropInventory) state.fridgePropInventory = { compress: 0, backpack: 0, organize: 0 };
    const compressEl = document.getElementById('sp-fridge-compress-count');
    const backpackEl = document.getElementById('sp-fridge-backpack-count');
    const organizeEl = document.getElementById('sp-fridge-organize-count');
    if (compressEl) compressEl.textContent = `×${state.fridgePropInventory.compress || 0} (${fridgeState.propsUsed.compress}/${FRIDGE_PROP_ITEMS.compress.perGameLimit})`;
    if (backpackEl) backpackEl.textContent = `×${state.fridgePropInventory.backpack || 0} (${fridgeState.propsUsed.backpack}/${FRIDGE_PROP_ITEMS.backpack.perGameLimit})`;
    if (organizeEl) organizeEl.textContent = `×${state.fridgePropInventory.organize || 0} (${fridgeState.propsUsed.organize}/${FRIDGE_PROP_ITEMS.organize.perGameLimit})`;

    const propsUsedEl = document.getElementById('sp-fridge-props-used');
    if (propsUsedEl) {
      propsUsedEl.textContent = `本局已用道具: 压缩${fridgeState.propsUsed.compress}次 跳过${fridgeState.propsUsed.backpack}次 整理${fridgeState.propsUsed.organize}次`;
    }

    // ===== 金币显示 =====
    const goldEl = document.getElementById('sp-fridge-gold');
    if (goldEl) goldEl.textContent = state.gameGold;

    // ===== 控制开始按钮显示/隐藏 =====
    const startWrapper = document.getElementById('sp-fridge-start-wrapper');
    if (startWrapper) startWrapper.style.display = fridgeState.active ? 'none' : 'flex';
  }

  // ===== 预览高亮（支持异形）=====
  function fridgeShowPreview(row, col, w, h, shape) {
    fridgeClearPreview();
    const gridEl = document.getElementById('sp-fridge-grid');
    if (!gridEl) return;

    const canPlace = fridgeCanPlace(row, col, w, h, shape || null);

    if (shape) {
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c] === 1) {
            const targetR = row + r;
            const targetC = col + c;
            if (targetR < fridgeState.rows && targetC < fridgeState.cols) {
              const cell = gridEl.querySelector(`.sp-fridge-cell[data-row="${targetR}"][data-col="${targetC}"]`);
              if (cell) {
                cell.classList.add(canPlace ? 'sp-fridge-preview-ok' : 'sp-fridge-preview-bad');
              }
            }
          }
        }
      }
    } else {
      for (let r = row; r < row + h && r < fridgeState.rows; r++) {
        for (let c = col; c < col + w && c < fridgeState.cols; c++) {
          const cell = gridEl.querySelector(`.sp-fridge-cell[data-row="${r}"][data-col="${c}"]`);
          if (cell) {
            cell.classList.add(canPlace ? 'sp-fridge-preview-ok' : 'sp-fridge-preview-bad');
          }
        }
      }
    }
  }

  function fridgeClearPreview() {
    document.querySelectorAll('.sp-fridge-preview-ok, .sp-fridge-preview-bad').forEach(el => {
      el.classList.remove('sp-fridge-preview-ok', 'sp-fridge-preview-bad');
    });
  }

  // ===== 冰箱库存图鉴 =====
  function fridgeRenderCollection() {
    const container = document.getElementById('sp-fridge-collection-content');
    if (!container) return;
    const inv = state.fridgeInventory || [];
    if (!state.gameCustomImages) state.gameCustomImages = {};

    container.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;">
        ${FRIDGE_FOODS.map(food => {
          const owned = inv.find(i => i.foodId === food.id);
          const count = owned ? owned.count : 0;
          const key = `fridge_food_${food.id}`;
          const custom = state.gameCustomImages[key];
          const display = custom
            ? `<img src="${custom}" style="width:24px;height:24px;object-fit:contain;border-radius:3px;" />`
            : `<span style="font-size:20px;">${food.emoji}</span>`;
          return `
            <div style="aspect-ratio:1;border-radius:8px;border:2px solid ${count > 0 ? 'rgba(100,180,255,0.3)' : 'rgba(255,255,255,0.1)'};background:${count > 0 ? 'rgba(100,180,255,0.06)' : 'rgba(255,255,255,0.05)'};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;position:relative;cursor:pointer;overflow:hidden;transition:all 0.15s;" data-fridge-food-id="${food.id}">
              ${display}
              <span style="font-size:8px;color:var(--sp-text-muted);text-align:center;">${food.name}</span>
              <span style="font-size:8px;color:var(--sp-text-muted);">${food.w}×${food.h}</span>
              ${count > 0 ? `<span style="font-size:9px;color:#ffb347;font-weight:600;">×${count}</span>` : ''}
              <div class="sp-fridge-food-upload" data-food-id="${food.id}" style="position:absolute;top:2px;right:2px;width:16px;height:16px;border-radius:50%;background:rgba(0,0,0,0.6);color:#fff;font-size:9px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity 0.2s;">📷</div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.querySelectorAll('[data-fridge-food-id]').forEach(item => {
      item.addEventListener('mouseenter', () => {
        const btn = item.querySelector('.sp-fridge-food-upload');
        if (btn) btn.style.opacity = '1';
      });
      item.addEventListener('mouseleave', () => {
        const btn = item.querySelector('.sp-fridge-food-upload');
        if (btn) btn.style.opacity = '0';
      });
    });

    container.querySelectorAll('.sp-fridge-food-upload').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        fridgePromptFoodUpload(btn.dataset.foodId);
      });
    });
  }

  // ===== 冰箱食材图片上传 =====
  function fridgePromptFoodUpload(foodId) {
    const food = FRIDGE_FOODS.find(f => f.id === foodId);
    const key = `fridge_food_${foodId}`;
    if (!state.gameCustomImages) state.gameCustomImages = {};
    const currentImg = state.gameCustomImages[key];

    // 如果已有图片，先问是否要移除
    if (currentImg) {
      const action = confirm(`「${food?.name || foodId}」已有自定义图片\n\n点「确定」→ 移除图片（恢复默认emoji）\n点「取消」→ 替换为新图片`);
      if (action) {
        delete state.gameCustomImages[key];
        saveDataImmediate('冰箱食材图片移除');
        fridgeRenderCollection();
        fridgeShowNotice('图片已移除，恢复默认显示');
        return;
      }
    }

    const choice = confirm(`设置食材「${food?.name || foodId}」的自定义图片\n\n⭐ 推荐：点「确定」→ 输入图片链接（节省内存）\n点「取消」→ 选择本地文件上传`);

    if (choice) {
      const url = prompt('输入图片链接（留空确认=清除）：', currentImg && currentImg.startsWith('http') ? currentImg : '');
      if (url === null) return;
      const trimmed = url.trim();
      if (!trimmed) {
        delete state.gameCustomImages[key];
        saveDataImmediate('冰箱食材图片清除');
        fridgeRenderCollection();
        fridgeShowNotice('图片已清除');
        return;
      }
      if (!trimmed.startsWith('http')) {
        fridgeShowNotice('请输入以 http 开头的链接');
        return;
      }
      state.gameCustomImages[key] = trimmed;
      saveDataImmediate('冰箱食材图片链接');
      fridgeRenderCollection();
      fridgeShowNotice('图片链接已设置！');
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/png,image/jpeg,image/gif,image/webp';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
          fridgeShowNotice('图片不能超过2MB，推荐使用图片链接');
          return;
        }
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const compressed = await compressImage(ev.target.result, 80, 0.7);
          if (!state.gameCustomImages) state.gameCustomImages = {};
          state.gameCustomImages[key] = compressed;
          saveDataImmediate('冰箱食材图片上传');
          fridgeRenderCollection();
          fridgeShowNotice('图片已设置！（提示：使用链接可节省存储空间）');
        };
        reader.readAsDataURL(file);
      };
      input.click();
    }
  }


  // ===== 冰箱库存背包 =====
  function fridgeRenderBag() {
    const container = document.getElementById('sp-fridge-bag-content');
    if (!container) return;
    const inv = (state.fridgeInventory || []).filter(i => i.count > 0);

    if (inv.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--sp-text-muted);font-size:12px;">冰箱空空如也～去玩一局冰箱整理吧</div>';
      return;
    }

    container.innerHTML = inv.map(item => {
      const data = FRIDGE_FOODS.find(f => f.id === item.foodId);
      if (!data) return '';
      return `
        <div class="sp-fridge-bag-item">
          <span style="font-size:20px;width:28px;text-align:center;flex-shrink:0;">${data.emoji}</span>
          <div style="flex:1;display:flex;flex-direction:column;gap:2px;">
            <span style="font-size:12px;font-weight:600;color:var(--sp-text-primary);">${data.name}</span>
            <span style="font-size:10px;color:var(--sp-text-muted);">投喂 +${data.feed} 饱食 | 价值 ${data.value}🪙</span>
          </div>
          <span style="font-size:14px;font-weight:700;color:var(--sp-text-primary);min-width:30px;text-align:right;">×${item.count}</span>
        </div>
      `;
    }).join('');
  }

  // ===== 冰箱道具背包渲染 =====
  function fridgeRenderBagProps() {
    const container = document.getElementById('sp-fridge-bag-props-content');
    if (!container) return;
    if (!state.fridgePropInventory) state.fridgePropInventory = { compress: 0, backpack: 0, organize: 0 };

    const items = Object.entries(FRIDGE_PROP_ITEMS).map(([key, prop]) => ({
      key, ...prop, count: state.fridgePropInventory[key] || 0
    }));

    const hasAny = items.some(i => i.count > 0);

    container.innerHTML = hasAny ? items.map(item => `
      <div class="sp-fridge-bag-item ${item.count <= 0 ? '' : ''}" style="${item.count <= 0 ? 'opacity:0.4;' : ''}">
        <span style="font-size:20px;width:28px;text-align:center;flex-shrink:0;">${item.name.split(' ')[0]}</span>
        <div style="flex:1;display:flex;flex-direction:column;gap:2px;">
          <span style="font-size:12px;font-weight:600;color:var(--sp-text-primary);">${item.name.split(' ').slice(1).join(' ')}</span>
          <span style="font-size:10px;color:var(--sp-text-muted);">${item.desc} | 每局限${item.perGameLimit}次</span>
        </div>
        <span style="font-size:14px;font-weight:700;color:var(--sp-text-primary);min-width:30px;text-align:right;">×${item.count}</span>
      </div>
    `).join('') : '<div style="text-align:center;padding:20px;color:var(--sp-text-muted);font-size:12px;">道具背包空空如也～去商店买点吧</div>';
  }

  // ===== 冰箱道具商店渲染 =====
  function fridgeRenderShopProps() {
    const container = document.getElementById('sp-fridge-shop-props-content');
    if (!container) return;
    if (!state.fridgePropInventory) state.fridgePropInventory = { compress: 0, backpack: 0, organize: 0 };

    const today = new Date().toISOString().slice(0, 10);
    const todayLog = (state.fridgePropShopLog && state.fridgePropShopLog[today]) || {};

    const items = Object.entries(FRIDGE_PROP_ITEMS).map(([key, prop]) => {
      const bought = todayLog[key] || 0;
      const soldOut = bought >= prop.dailyLimit;
      const cantAfford = state.gameGold < prop.price;
      const disabled = soldOut || cantAfford;
      const stock = state.fridgePropInventory[key] || 0;
      return { key, ...prop, bought, soldOut, cantAfford, disabled, stock };
    });

    container.innerHTML = items.map(item => `
      <div class="sp-link-shop-item ${item.disabled ? 'sp-link-shop-disabled' : ''}">
        <span class="sp-link-shop-icon">${item.name.split(' ')[0]}</span>
        <div class="sp-link-shop-info">
          <span class="sp-link-shop-name">${item.name.split(' ').slice(1).join(' ')}</span>
          <span class="sp-link-shop-desc">${item.desc} | 每局限${item.perGameLimit}次</span>
          <span style="font-size:9px;color:var(--sp-text-muted);">${item.soldOut ? '今日售罄' : `今日剩 ${item.dailyLimit - item.bought}`} | 背包: ${item.stock}</span>
        </div>
        <button class="sp-link-shop-buy sp-fridge-shop-buy-btn" data-prop="${item.key}" ${item.disabled ? 'disabled' : ''}>🪙${item.price}</button>
      </div>
    `).join('');

    container.querySelectorAll('.sp-fridge-shop-buy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        fridgeBuyProp(btn.dataset.prop);
      });
    });
  }

  // ===== 冰箱道具购买 =====
  function fridgeBuyProp(propKey) {
    const prop = FRIDGE_PROP_ITEMS[propKey];
    if (!prop) return;

    if (state.gameGold < prop.price) {
      fridgeShowNotice(`金币不足！需要 ${prop.price} 🪙`);
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    if (!state.fridgePropShopLog) state.fridgePropShopLog = {};
    if (!state.fridgePropShopLog[today]) state.fridgePropShopLog[today] = {};
    const bought = state.fridgePropShopLog[today][propKey] || 0;
    if (bought >= prop.dailyLimit) {
      fridgeShowNotice(`${prop.name} 今日已售罄（限${prop.dailyLimit}个/天）`);
      return;
    }

    state.gameGold -= prop.price;
    state.fridgePropShopLog[today][propKey] = bought + 1;
    if (!state.fridgePropInventory) state.fridgePropInventory = { compress: 0, backpack: 0, organize: 0 };
    state.fridgePropInventory[propKey] = (state.fridgePropInventory[propKey] || 0) + 1;

    fridgeShowNotice(`购买了 ${prop.name}，已放入背包！`);
    saveDataDebounced('冰箱商店购买');
    fridgeRenderShopProps();
    fridgeRenderBagProps();
    const goldEl = document.getElementById('sp-fridge-gold');
    if (goldEl) goldEl.textContent = state.gameGold;
  }

  // ===== 渲染冰箱面板 =====
  function fridgeRenderPanel() {
    let panel = document.getElementById('sp-fridge-panel');
    if (panel) panel.remove();

    panel = document.createElement('div');
    panel.id = 'sp-fridge-panel';
    panel.innerHTML = `
      <div id="sp-fridge-header">
        <span>🧊 冰箱整理</span>
        <div class="sp-fridge-header-right">
          <button id="sp-fridge-minimize" title="缩小悬挂" style="background:none;border:none;font-size:14px;cursor:pointer;color:var(--sp-text-muted);padding:2px 6px;">─</button>
          <button id="sp-fridge-close" title="关闭">✕</button>
        </div>
      </div>
      <div id="sp-fridge-notice"></div>
      <div style="display:flex;gap:4px;padding:6px 10px;background:rgba(255,255,255,0.03);border-bottom:1px solid var(--sp-border-light);align-items:center;">
        <button class="sp-game-tab active" data-fridgetab="play" id="sp-fridge-tab-play">🎮 游戏</button>
        <button class="sp-game-tab" data-fridgetab="props" id="sp-fridge-tab-props">🎒 道具</button>
        <button class="sp-game-tab" data-fridgetab="shop" id="sp-fridge-tab-shop">🛒 商店</button>
        <button class="sp-game-tab" data-fridgetab="bag" id="sp-fridge-tab-bag">🧊 库存</button>
        <button class="sp-game-tab" data-fridgetab="collection" id="sp-fridge-tab-collection">📖 图鉴</button>
        <span class="sp-fridge-gold-display" style="margin-left:auto;">🪙 <span id="sp-fridge-gold">${state.gameGold}</span></span>
      </div>
      <div id="sp-fridge-body">
        <div id="sp-fridge-tab-content-play">
          <div id="sp-fridge-info" style="display:flex;justify-content:space-around;padding:4px 8px;font-size:11px;color:var(--sp-text-secondary);background:rgba(255,255,255,0.03);border-radius:6px;margin-bottom:6px;"></div>
          <div id="sp-fridge-grid" class="sp-fridge-grid"></div>
          <div style="margin-top:8px;">
            <div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:4px;">📦 购物筐 <span style="font-size:10px;color:var(--sp-text-muted);font-weight:400;">（点击选中 → 点冰箱格子放入）</span></div>
            <div id="sp-fridge-basket-items" class="sp-fridge-basket"></div>
          </div>
          <div id="sp-fridge-props" style="display:flex;gap:6px;justify-content:center;margin-top:8px;flex-wrap:wrap;">
            <button class="sp-fridge-prop-btn" id="sp-fridge-btn-rotate" title="旋转选中的食材">
              <span>🔄</span><span>旋转</span>
            </button>
            <button class="sp-fridge-prop-btn" id="sp-fridge-btn-compress" title="缩小选中食材尺寸">
              <span>🧃</span><span>压缩 <span id="sp-fridge-compress-count">0</span></span>
            </button>
            <button class="sp-fridge-prop-btn" id="sp-fridge-btn-organize" title="自动整理冰箱">
              <span>🧹</span><span>整理 <span id="sp-fridge-organize-count">0</span></span>
            </button>
            <button class="sp-fridge-prop-btn" id="sp-fridge-btn-backpack" title="跳过一个食材">
              <span>🎒</span><span>跳过 <span id="sp-fridge-backpack-count">0</span></span>
            </button>
          </div>
          <div id="sp-fridge-props-used" style="text-align:center;font-size:10px;color:var(--sp-text-muted);margin-top:4px;"></div>
          <div style="height:8px;"></div>
          <div id="sp-fridge-start-wrapper" style="display:flex;justify-content:center;margin-bottom:8px;"><button class="sp-fridge-ctrl-btn" id="sp-fridge-start-btn" style="background:var(--sp-primary);color:#fff;border-color:var(--sp-primary-border);padding:10px 24px;font-size:13px;">✨ 开始游戏</button></div>
          <div style="display:flex;gap:8px;justify-content:center;">
            <button class="sp-fridge-ctrl-btn" id="sp-fridge-close-door">🚪 关上冰箱门</button>
            <button class="sp-fridge-ctrl-btn sp-fridge-ctrl-quit" id="sp-fridge-quit-btn">❌ 放弃</button>
          </div>
        </div>
        <div id="sp-fridge-tab-content-props" style="display:none;padding:8px;">
          <div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:8px;">🎒 道具背包</div>
          <div id="sp-fridge-bag-props-content"></div>
        </div>
        <div id="sp-fridge-tab-content-shop" style="display:none;padding:8px;">
          <div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:8px;">🛒 道具商店 <span style="font-size:10px;color:var(--sp-text-muted);font-weight:400;">（每种每天限购10个）</span></div>
          <div id="sp-fridge-shop-props-content"></div>
        </div>
        <div id="sp-fridge-tab-content-bag" style="display:none;padding:8px;">
          <div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:8px;">🧊 冰箱库存 <span style="font-size:10px;color:var(--sp-text-muted);font-weight:400;">（投喂桌宠时可使用）</span></div>
          <div id="sp-fridge-bag-content"></div>
        </div>
        <div id="sp-fridge-tab-content-collection" style="display:none;padding:8px;">
          <div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:8px;">📖 食材图鉴 <span style="font-size:10px;color:var(--sp-text-muted);font-weight:400;">（库存数量一览）</span></div>
          <div id="sp-fridge-collection-content"></div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // 阻止游戏面板内的滚轮事件冒泡到外部页面
    const fridgeBody = document.getElementById('sp-fridge-body');
    if (fridgeBody) {
      fridgeBody.addEventListener('wheel', (e) => {
        const el = fridgeBody;
        const atTop = el.scrollTop <= 0;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

        // 如果已经滚到顶/底，阻止事件继续传播到页面
        if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
          e.preventDefault();
        }
        e.stopPropagation();
      }, { passive: false });
    }

    // 最小化
    document.getElementById('sp-fridge-minimize').addEventListener('click', () => {
      const fp = document.getElementById('sp-fridge-panel');
      const minBtn = document.getElementById('sp-fridge-minimize');
      if (!fp || !minBtn) return;
      if (fp.classList.contains('sp-fridge-minimized')) {
        fp.classList.remove('sp-fridge-minimized');
        minBtn.textContent = '─';
      } else {
        fp.classList.add('sp-fridge-minimized');
        minBtn.textContent = '□';
      }
    });

    // 关闭
    document.getElementById('sp-fridge-close').addEventListener('click', () => toggleFridgeGame());

    // 道具按钮
    document.getElementById('sp-fridge-btn-rotate').addEventListener('click', () => fridgeRotateSelected());
    document.getElementById('sp-fridge-btn-compress').addEventListener('click', () => fridgeUseCompress());
    document.getElementById('sp-fridge-btn-organize').addEventListener('click', () => fridgeUseOrganize());
    document.getElementById('sp-fridge-btn-backpack').addEventListener('click', () => fridgeUseBackpack());

    // 开始游戏按钮
    document.getElementById('sp-fridge-start-btn')?.addEventListener('click', () => {
      fridgeConfirmNewGame();
    });

    // 关上冰箱门
    document.getElementById('sp-fridge-close-door').addEventListener('click', () => {
      showConfirmDialog({
        title: '🚪 关上冰箱门？',
        desc: `已放入 ${fridgeState.placed.length} 件食材<br/>填充率: ${fridgeGetFillPercent()}%<br/>购物筐剩余: ${fridgeState.basket.length} 件<br/><br/>关上门后将进行结算`,
        confirmText: '关上',
        cancelText: '再塞塞',
        onConfirm: () => fridgeCloseDoor()
      });
    });

    // 放弃
    document.getElementById('sp-fridge-quit-btn').addEventListener('click', () => {
      showConfirmDialog({
        title: '❌ 放弃本局？',
        desc: '所有已放置的食材将丢失，体力不退还。',
        confirmText: '放弃',
        cancelText: '继续',
        onConfirm: () => {
          fridgeState.active = false;
          isFridgeOpen = false;
          const p = document.getElementById('sp-fridge-panel');
          if (p) p.classList.remove('visible');
        }
      });
    });

    // 标签页切换
    const fridgeTabs = ['play', 'props', 'shop', 'bag', 'collection'];
    fridgeTabs.forEach(tabName => {
      const tabBtn = document.getElementById(`sp-fridge-tab-${tabName}`);
      if (tabBtn) {
        tabBtn.addEventListener('click', () => {
          fridgeTabs.forEach(t => {
            const b = document.getElementById(`sp-fridge-tab-${t}`);
            if (b) b.classList.toggle('active', t === tabName);
          });
          fridgeTabs.forEach(t => {
            const contentEl = document.getElementById(`sp-fridge-tab-content-${t}`);
            if (contentEl) contentEl.style.display = t === tabName ? '' : 'none';
          });
          if (tabName === 'props') fridgeRenderBagProps();
          if (tabName === 'shop') fridgeRenderShopProps();
          if (tabName === 'bag') fridgeRenderBag();
          if (tabName === 'collection') fridgeRenderCollection();
        });
      }
    });

    // 面板拖拽
    fridgeBindPanelDrag();
  }

  // ===== 面板拖拽 =====
  function fridgeBindPanelDrag() {
    const header = document.getElementById('sp-fridge-header');
    const panel = document.getElementById('sp-fridge-panel');
    if (!header || !panel) return;

    let dragging = false, offX = 0, offY = 0;

    const down = (e) => {
      if (e.target.closest('#sp-fridge-close') || e.target.closest('#sp-fridge-minimize')) return;
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

  // ===== 开局确认弹窗 =====
  function fridgeConfirmNewGame() {
    showConfirmDialog({
      title: '🧊 打开冰箱整理？',
      desc: '冰箱大小和食材数量随机分配。<br/>开局后才会显示体力消耗和难度。<br/><br/>准备好了吗？',
      confirmText: '✨ 开始',
      cancelText: '算了',
      onConfirm: () => {
        gameRecoverStamina(); // 先恢复体力
        const ok = fridgeStartGame();
        if (!ok) return;
        fridgeRender();
        fridgeShowNotice(`${fridgeState.type.emoji} ${fridgeState.type.name} ${fridgeState.rows}×${fridgeState.cols} | 消耗 ${fridgeState.energyCost}⚡ | 食材 ${fridgeState.basket.length}件`);
        if (isGameOpen) gameRenderStatus();
      },
      onCancel: () => {
        // 不开局，留在游戏面板
      }

    });
  }

  // ===== 开关冰箱面板 =====
  function toggleFridgeGame() {
    isFridgeOpen = !isFridgeOpen;
    let panel = document.getElementById('sp-fridge-panel');

    if (isFridgeOpen) {
      // 每次打开都重新创建面板（动态挂载）
      if (panel) panel.remove();
      fridgeRenderPanel();
      panel = document.getElementById('sp-fridge-panel');

      panel.classList.add('visible');

      const w = Math.min(420, window.innerWidth - 20);
      panel.style.width = w + 'px';
      requestAnimationFrame(() => {
        const h = panel.offsetHeight;
        const maxTop = window.innerHeight - h - 20;
        const centerTop = Math.floor((window.innerHeight - h) / 2);
        panel.style.left = Math.floor((window.innerWidth - w) / 2) + 'px';
        panel.style.top = Math.max(10, Math.min(centerTop, maxTop)) + 'px';
      });

      // 如果没有活跃游戏，只渲染面板，不自动弹窗
      fridgeRender();

    } else {
      // 彻底销毁 DOM
      if (panel) panel.remove();
    }

  }

  // ============================================================
  // 🍢 糖葫芦工坊游戏模块 - MeepTanghuluSort
  // ============================================================

  // ===== 水果定义 =====
  const TANGHULU_FRUITS = [
    { key: 'strawberry', emoji: '🍓', name: '甜心草莓',   color: '#ff4444', sellPrice: 15, feedAmount: 8  },
    { key: 'orange',     emoji: '🍊', name: '蜜桔瓣儿',   color: '#ff8c00', sellPrice: 12, feedAmount: 7  },
    { key: 'kiwi',       emoji: '🥝', name: '翡翠猕猴桃', color: '#32cd32', sellPrice: 18, feedAmount: 10 },
    { key: 'grape',      emoji: '🍇', name: '晶莹葡萄',   color: '#8b00ff', sellPrice: 20, feedAmount: 12 },
    { key: 'cherry',     emoji: '🍒', name: '玛瑙樱桃',   color: '#ff69b4', sellPrice: 22, feedAmount: 13 },
    { key: 'banana',     emoji: '🍌', name: '香蕉片儿',   color: '#ffd700', sellPrice: 10, feedAmount: 6  },
    { key: 'tomato',     emoji: '🍅', name: '经典圣女果', color: '#dc143c', sellPrice: 14, feedAmount: 9  },
    { key: 'peach',      emoji: '🍑', name: '蜜汁水蜜桃', color: '#ffb6c1', sellPrice: 25, feedAmount: 14 },
    { key: 'mango',      emoji: '🥭', name: '热带金芒果', color: '#ff6347', sellPrice: 28, feedAmount: 16 },
    { key: 'blueberry', emoji: '🫐', name: '冰晶蓝莓',   color: '#4169e1', sellPrice: 24, feedAmount: 14 },
    { key: 'coconut',   emoji: '🥥', name: '椰子奶球',   color: '#f5f5dc', sellPrice: 20, feedAmount: 12 },
    { key: 'lychee',    emoji: '🪷', name: '玲珑荔枝',   color: '#ff6b6b', sellPrice: 26, feedAmount: 15 },
    { key: 'watermelon', emoji: '🍉', name: '迷你西瓜球', color: '#2e8b57', sellPrice: 18, feedAmount: 11 },
    { key: 'pineapple',  emoji: '🍍', name: '金菠萝块',   color: '#daa520', sellPrice: 22, feedAmount: 13 },
    { key: 'dragonfruit', emoji: '🐲', name: '火龙果晶球', color: '#ff1493', sellPrice: 30, feedAmount: 17 },
    { key: 'melon',      emoji: '🍈', name: '翠玉哈密瓜', color: '#98fb98', sellPrice: 24, feedAmount: 14 },
    { key: 'fig',        emoji: '🫒', name: '蜜糖无花果', color: '#800080', sellPrice: 32, feedAmount: 18 },
    { key: 'starfruit',  emoji: '🌟', name: '星星杨桃',   color: '#b8860b', sellPrice: 28, feedAmount: 16 },
  ];

  // ============================================================
  // 🐱 小猫餐厅常量定义 - MeepCatRestaurant
  // ============================================================

  // ===== 餐厅基础蔬菜进货定义 =====
  const RESTAURANT_GROCERIES = [
    { id: 'potato',    name: '土豆',     emoji: '🥔', price: 3,  reputationRequired: 0  },
    { id: 'onion',     name: '洋葱',     emoji: '🧅', price: 3,  reputationRequired: 0  },
    { id: 'garlic',    name: '大蒜',     emoji: '🧄', price: 2,  reputationRequired: 0  },
    { id: 'cabbage',   name: '卷心菜',   emoji: '🥬', price: 3,  reputationRequired: 0  },
    { id: 'eggplant',  name: '茄子',     emoji: '🍆', price: 4,  reputationRequired: 0  },
    { id: 'broccoli',  name: '西兰花',   emoji: '🥦', price: 4,  reputationRequired: 5  },
    { id: 'spinach',   name: '菠菜',     emoji: '🥬', price: 3,  reputationRequired: 5  },
    { id: 'pumpkin',   name: '南瓜',     emoji: '🎃', price: 5,  reputationRequired: 8  },
    { id: 'leek',      name: '大葱',     emoji: '🌿', price: 2,  reputationRequired: 0  },
    { id: 'ginger',    name: '生姜',     emoji: '🫚', price: 3,  reputationRequired: 5  },
    { id: 'celery',    name: '芹菜',     emoji: '🌿', price: 3,  reputationRequired: 0  },
    { id: 'chili',     name: '辣椒',     emoji: '🌶️', price: 4,  reputationRequired: 5  },
    { id: 'bean',      name: '四季豆',   emoji: '🫛', price: 3,  reputationRequired: 0  },
    { id: 'radish',    name: '白萝卜',   emoji: '🥕', price: 3,  reputationRequired: 5  },
    { id: 'lettuce',   name: '生菜',     emoji: '🥬', price: 2,  reputationRequired: 0  },
    { id: 'sweetpotato', name: '红薯',   emoji: '🍠', price: 4,  reputationRequired: 8  },
  ];

  // ===== 调料定义 =====
  const RESTAURANT_SEASONINGS = [
    { id: 'salt',    name: '盐',     emoji: '🧂', price: 5,  reputationRequired: 0  },
    { id: 'soy',     name: '酱油',   emoji: '🫙', price: 6,  reputationRequired: 0  },
    { id: 'pepper',  name: '黑胡椒', emoji: '🌶️', price: 8,  reputationRequired: 0  },
    { id: 'butter',  name: '黄油',   emoji: '🧈', price: 12, reputationRequired: 0  },
    { id: 'honey',   name: '蜂蜜',   emoji: '🍯', price: 10, reputationRequired: 0  },
    { id: 'sauce',   name: '番茄酱', emoji: '🍶', price: 10, reputationRequired: 0  },
    { id: 'spice',   name: '五香粉', emoji: '✨', price: 20, reputationRequired: 15 },
    { id: 'vinegar', name: '陈醋',   emoji: '🫗', price: 8,  reputationRequired: 5  },
    { id: 'sesame',  name: '芝麻酱', emoji: '🥜', price: 15, reputationRequired: 10 },
    { id: 'chili',   name: '辣椒油', emoji: '🌶️', price: 12, reputationRequired: 8  },
    { id: 'wasabi',  name: '芥末',   emoji: '💚', price: 18, reputationRequired: 12 },
    { id: 'cream',   name: '奶油',   emoji: '🍦', price: 14, reputationRequired: 8  },
    { id: 'cumin',   name: '孜然',   emoji: '🌰', price: 12, reputationRequired: 10 },
    { id: 'miso',    name: '味噌',   emoji: '🫘', price: 15, reputationRequired: 12 },

  ];

  // ===== 食谱定义 =====
  const RESTAURANT_RECIPES = [
    // --- 饮品类 ---
    { id: 'drink_juice',    name: '鲜榨果汁',     emoji: '🧃',  category: 'drink',
      ingredients: [{ foodId: 'apple', count: 1 }], seasonings: [],
      cookTime: 2, sellPrice: 8, feedAmount: 5, energyAmount: 3, reputationRequired: 0 },
    { id: 'drink_grape',    name: '葡萄汁',       emoji: '🍇',  category: 'drink',
      ingredients: [{ foodId: 'grape', count: 1 }], seasonings: [],
      cookTime: 2, sellPrice: 9, feedAmount: 5, energyAmount: 3, reputationRequired: 0 },
    { id: 'drink_melon',    name: '西瓜汁',       emoji: '🍉',  category: 'drink',
      ingredients: [{ foodId: 'watermelon', count: 1 }], seasonings: [],
      cookTime: 2, sellPrice: 10, feedAmount: 6, energyAmount: 4, reputationRequired: 0 },
    { id: 'drink_cola',     name: '冰镇可乐',     emoji: '🥤',  category: 'drink',
      ingredients: [{ foodId: 'cola', count: 1 }], seasonings: [],
      cookTime: 1, sellPrice: 6, feedAmount: 3, energyAmount: 2, reputationRequired: 0 },
    { id: 'drink_milk',     name: '香浓热奶',     emoji: '🥛',  category: 'drink',
      ingredients: [{ foodId: 'milk', count: 1 }], seasonings: [{ id: 'honey', count: 1 }],
      cookTime: 2, sellPrice: 12, feedAmount: 8, energyAmount: 5, reputationRequired: 5 },
    { id: 'drink_smoothie', name: '缤纷冰沙',     emoji: '🫧',  category: 'drink',
      ingredients: [{ foodId: 'apple', count: 1 }, { foodId: 'grape', count: 1 }], seasonings: [],
      cookTime: 3, sellPrice: 18, feedAmount: 10, energyAmount: 6, reputationRequired: 10 },
    { id: 'drink_cocktail', name: '猫咪特调',     emoji: '🍹',  category: 'drink',
      ingredients: [{ foodId: 'juice', count: 1 }, { foodId: 'grape', count: 1 }], seasonings: [{ id: 'honey', count: 1 }],
      cookTime: 4, sellPrice: 25, feedAmount: 12, energyAmount: 8, reputationRequired: 20 },

    // --- 小食类 ---
    { id: 'snack_toast',         name: '黄油吐司',     emoji: '🍞✨', category: 'snack',
      ingredients: [{ foodId: 'bread', count: 1 }], seasonings: [{ id: 'butter', count: 1 }],
      cookTime: 2, sellPrice: 10, feedAmount: 8, energyAmount: 0, reputationRequired: 0 },
    { id: 'snack_salad',         name: '清爽沙拉',     emoji: '🥗',  category: 'snack',
      ingredients: [{ foodId: 'cucumber', count: 1 }, { foodId: 'tomato', count: 1 }], seasonings: [{ id: 'salt', count: 1 }],
      cookTime: 3, sellPrice: 14, feedAmount: 10, energyAmount: 0, reputationRequired: 0 },
    { id: 'snack_cheese_toast',  name: '芝士烤吐司',   emoji: '🧀🍞', category: 'snack',
      ingredients: [{ foodId: 'bread', count: 1 }, { foodId: 'cheese', count: 1 }], seasonings: [{ id: 'butter', count: 1 }],
      cookTime: 3, sellPrice: 18, feedAmount: 12, energyAmount: 0, reputationRequired: 5 },
    { id: 'snack_tomato_slice',  name: '番茄拼盘',     emoji: '🍅',  category: 'snack',
      ingredients: [{ foodId: 'tomato', count: 2 }], seasonings: [{ id: 'salt', count: 1 }, { id: 'soy', count: 1 }],
      cookTime: 2, sellPrice: 12, feedAmount: 10, energyAmount: 0, reputationRequired: 5 },
    { id: 'snack_carrot_sticks', name: '胡萝卜条',     emoji: '🥕',  category: 'snack',
      ingredients: [{ foodId: 'carrot', count: 2 }], seasonings: [{ id: 'salt', count: 1 }],
      cookTime: 2, sellPrice: 11, feedAmount: 9, energyAmount: 0, reputationRequired: 0 },
    { id: 'snack_cuke',          name: '拍黄瓜',       emoji: '🥒',  category: 'snack',
      ingredients: [{ foodId: 'cucumber', count: 1 }], seasonings: [{ id: 'soy', count: 1 }, { id: 'salt', count: 1 }],
      cookTime: 2, sellPrice: 13, feedAmount: 11, energyAmount: 0, reputationRequired: 8 },
    { id: 'snack_bruschetta',    name: '意式烤面包',   emoji: '🍅🍞', category: 'snack',
      ingredients: [{ foodId: 'bread', count: 1 }, { foodId: 'tomato', count: 1 }], seasonings: [{ id: 'butter', count: 1 }, { id: 'salt', count: 1 }],
      cookTime: 4, sellPrice: 22, feedAmount: 15, energyAmount: 0, reputationRequired: 15 },

    // --- 菜品类 ---
    { id: 'dish_fried_fish',  name: '香煎小鱼',     emoji: '🐟🔥', category: 'dish',
      ingredients: [{ foodId: 'fish', count: 1 }], seasonings: [{ id: 'salt', count: 1 }],
      cookTime: 4, sellPrice: 15, feedAmount: 12, energyAmount: 0, reputationRequired: 0 },
    { id: 'dish_tomato_egg',  name: '番茄炒蛋',     emoji: '🍅🥚', category: 'dish',
      ingredients: [{ foodId: 'tomato', count: 1 }, { foodId: 'eggs', count: 1 }], seasonings: [{ id: 'salt', count: 1 }, { id: 'soy', count: 1 }],
      cookTime: 4, sellPrice: 18, feedAmount: 14, energyAmount: 0, reputationRequired: 0 },
    { id: 'dish_cucumber_egg', name: '黄瓜炒蛋',    emoji: '🥒🥚', category: 'dish',
      ingredients: [{ foodId: 'cucumber', count: 1 }, { foodId: 'eggs', count: 1 }], seasonings: [{ id: 'salt', count: 1 }],
      cookTime: 3, sellPrice: 16, feedAmount: 13, energyAmount: 0, reputationRequired: 0 },
    { id: 'dish_roast_chicken', name: '香烤鸡腿',   emoji: '🍗',  category: 'dish',
      ingredients: [{ foodId: 'chicken', count: 1 }], seasonings: [{ id: 'pepper', count: 1 }, { id: 'salt', count: 1 }],
      cookTime: 6, sellPrice: 28, feedAmount: 22, energyAmount: 0, reputationRequired: 5 },
    { id: 'dish_steak',       name: '黑椒牛排',     emoji: '🥩',  category: 'dish',
      ingredients: [{ foodId: 'steak', count: 1 }], seasonings: [{ id: 'pepper', count: 2 }, { id: 'butter', count: 1 }],
      cookTime: 8, sellPrice: 45, feedAmount: 30, energyAmount: 0, reputationRequired: 10 },
    { id: 'dish_fish_soup',   name: '鲜鱼豆腐汤',   emoji: '🐟🫕', category: 'dish',
      ingredients: [{ foodId: 'fish', count: 1 }, { foodId: 'pot', count: 1 }], seasonings: [{ id: 'salt', count: 1 }],
      cookTime: 5, sellPrice: 22, feedAmount: 18, energyAmount: 0, reputationRequired: 10 },
    { id: 'dish_sushi',       name: '精致寿司',     emoji: '🍣',  category: 'dish',
      ingredients: [{ foodId: 'sushi', count: 1 }, { foodId: 'fish', count: 1 }], seasonings: [{ id: 'soy', count: 2 }],
      cookTime: 5, sellPrice: 35, feedAmount: 24, energyAmount: 0, reputationRequired: 15 },
    { id: 'dish_pizza',       name: '特制披萨',     emoji: '🍕',  category: 'dish',
      ingredients: [{ foodId: 'pizza', count: 1 }, { foodId: 'cheese', count: 1 }], seasonings: [{ id: 'sauce', count: 2 }],
      cookTime: 6, sellPrice: 38, feedAmount: 26, energyAmount: 0, reputationRequired: 15 },
    { id: 'dish_seafood',     name: '豪华海鲜拼',   emoji: '🦞',  category: 'dish',
      ingredients: [{ foodId: 'platter', count: 1 }, { foodId: 'fish', count: 1 }], seasonings: [{ id: 'pepper', count: 1 }, { id: 'butter', count: 2 }],
      cookTime: 8, sellPrice: 55, feedAmount: 35, energyAmount: 0, reputationRequired: 20 },
    { id: 'dish_turkey',      name: '感恩节火鸡',   emoji: '🦃',  category: 'dish',
      ingredients: [{ foodId: 'turkey', count: 1 }], seasonings: [{ id: 'spice', count: 2 }, { id: 'pepper', count: 2 }],
      cookTime: 12, sellPrice: 75, feedAmount: 45, energyAmount: 0, reputationRequired: 25 },
    { id: 'dish_hotpot',      name: '猫咪小火锅',   emoji: '🫕🔥', category: 'dish',
      ingredients: [{ foodId: 'pot', count: 1 }, { foodId: 'chicken', count: 1 }, { foodId: 'fish', count: 1 }], seasonings: [{ id: 'salt', count: 2 }, { id: 'spice', count: 1 }],
      cookTime: 10, sellPrice: 65, feedAmount: 40, energyAmount: 0, reputationRequired: 20 },
    { id: 'dish_bento',       name: '豪华便当',     emoji: '🍱',  category: 'dish',
      ingredients: [{ foodId: 'bento', count: 1 }, { foodId: 'eggs', count: 1 }], seasonings: [{ id: 'soy', count: 1 }, { id: 'salt', count: 1 }],
      cookTime: 5, sellPrice: 30, feedAmount: 22, energyAmount: 0, reputationRequired: 10 },
    { id: 'dish_grandma',     name: '阿婆家常菜',   emoji: '🥘',  category: 'dish',
      ingredients: [{ foodId: 'tomato', count: 2 }, { foodId: 'eggs', count: 2 }, { foodId: 'carrot', count: 1 }], seasonings: [{ id: 'soy', count: 2 }, { id: 'salt', count: 2 }],
      cookTime: 8, sellPrice: 42, feedAmount: 28, energyAmount: 0, reputationRequired: 18 },
    { id: 'dish_pickle',      name: '秘制泡菜宴',   emoji: '🪣🔥', category: 'dish',
      ingredients: [{ foodId: 'barrel', count: 1 }, { foodId: 'cucumber', count: 1 }], seasonings: [{ id: 'spice', count: 2 }, { id: 'salt', count: 2 }],
      cookTime: 10, sellPrice: 60, feedAmount: 35, energyAmount: 0, reputationRequired: 22 },
    { id: 'dish_icechest_feast', name: '冷藏箱惊喜', emoji: '📦✨', category: 'dish',
      ingredients: [{ foodId: 'icechest', count: 1 }, { foodId: 'steak', count: 1 }], seasonings: [{ id: 'pepper', count: 2 }, { id: 'butter', count: 2 }, { id: 'spice', count: 1 }],
      cookTime: 15, sellPrice: 90, feedAmount: 50, energyAmount: 0, reputationRequired: 28 },
    // --- 新增：使用新食材的菜品 ---
    { id: 'dish_shrimp_dumpling', name: '鲜虾蒸饺',     emoji: '🥟🦐', category: 'dish',
      ingredients: [{ foodId: 'dumpling', count: 1 }, { foodId: 'shrimp', count: 1 }], seasonings: [{ id: 'vinegar', count: 1 }, { id: 'soy', count: 1 }],
      cookTime: 5, sellPrice: 28, feedAmount: 20, energyAmount: 0, reputationRequired: 8 },
    { id: 'dish_mushroom_soup',   name: '奶油蘑菇汤',   emoji: '🍄🥛', category: 'dish',
      ingredients: [{ foodId: 'mushroom', count: 2 }, { foodId: 'milk', count: 1 }], seasonings: [{ id: 'cream', count: 1 }, { id: 'salt', count: 1 }],
      cookTime: 6, sellPrice: 32, feedAmount: 22, energyAmount: 0, reputationRequired: 10 },
    { id: 'dish_corn_soup',       name: '甜玉米浓汤',   emoji: '🌽🫕', category: 'dish',
      ingredients: [{ foodId: 'corn', count: 2 }], seasonings: [{ id: 'cream', count: 1 }, { id: 'butter', count: 1 }],
      cookTime: 4, sellPrice: 22, feedAmount: 16, energyAmount: 0, reputationRequired: 5 },
    { id: 'dish_avocado_toast',   name: '牛油果吐司',   emoji: '🥑🍞', category: 'snack',
      ingredients: [{ foodId: 'avocado', count: 1 }, { foodId: 'bread', count: 1 }], seasonings: [{ id: 'salt', count: 1 }, { id: 'sesame', count: 1 }],
      cookTime: 3, sellPrice: 20, feedAmount: 14, energyAmount: 0, reputationRequired: 8 },
    { id: 'dish_spicy_noodle',    name: '麻辣拌面',     emoji: '🍜🌶️', category: 'dish',
      ingredients: [{ foodId: 'noodle', count: 1 }], seasonings: [{ id: 'chili', count: 2 }, { id: 'vinegar', count: 1 }, { id: 'sesame', count: 1 }],
      cookTime: 4, sellPrice: 26, feedAmount: 18, energyAmount: 0, reputationRequired: 10 },
    { id: 'dish_lobster_feast',   name: '蒜蓉大龙虾',   emoji: '🦞🧈', category: 'dish',
      ingredients: [{ foodId: 'lobster', count: 1 }], seasonings: [{ id: 'butter', count: 2 }, { id: 'pepper', count: 1 }, { id: 'salt', count: 1 }],
      cookTime: 10, sellPrice: 68, feedAmount: 38, energyAmount: 0, reputationRequired: 18 },
    { id: 'dish_tofu_mushroom',   name: '蘑菇豆腐煲',   emoji: '🧊🍄', category: 'dish',
      ingredients: [{ foodId: 'tofu', count: 1 }, { foodId: 'mushroom', count: 1 }], seasonings: [{ id: 'soy', count: 1 }, { id: 'spice', count: 1 }],
      cookTime: 5, sellPrice: 24, feedAmount: 16, energyAmount: 0, reputationRequired: 12 },
    { id: 'snack_wasabi_shrimp',  name: '芥末虾球',     emoji: '🦐💚', category: 'snack',
      ingredients: [{ foodId: 'shrimp', count: 2 }], seasonings: [{ id: 'wasabi', count: 1 }, { id: 'soy', count: 1 }],
      cookTime: 4, sellPrice: 30, feedAmount: 20, energyAmount: 0, reputationRequired: 12 },
    { id: 'drink_corn_milk',      name: '玉米奶昔',     emoji: '🌽🥛', category: 'drink',
      ingredients: [{ foodId: 'corn', count: 1 }, { foodId: 'milk', count: 1 }], seasonings: [{ id: 'honey', count: 1 }],
      cookTime: 3, sellPrice: 16, feedAmount: 10, energyAmount: 5, reputationRequired: 5 },
    // --- 新增：使用进货区基础蔬菜的菜品 ---
    { id: 'dish_potato_stew',     name: '土豆炖肉',     emoji: '🥔🍖', category: 'dish',
      ingredients: [{ foodId: 'potato', count: 2 }, { foodId: 'chicken', count: 1 }], seasonings: [{ id: 'salt', count: 1 }, { id: 'soy', count: 1 }],
      cookTime: 7, sellPrice: 32, feedAmount: 24, energyAmount: 0, reputationRequired: 5 },
    { id: 'dish_garlic_shrimp',   name: '蒜蓉虾仁',     emoji: '🧄🦐', category: 'dish',
      ingredients: [{ foodId: 'shrimp', count: 2 }, { foodId: 'garlic', count: 2 }], seasonings: [{ id: 'butter', count: 1 }, { id: 'salt', count: 1 }],
      cookTime: 5, sellPrice: 34, feedAmount: 22, energyAmount: 0, reputationRequired: 8 },
    { id: 'dish_eggplant_pot',    name: '鱼香茄子煲',   emoji: '🍆🔥', category: 'dish',
      ingredients: [{ foodId: 'eggplant', count: 2 }, { foodId: 'garlic', count: 1 }], seasonings: [{ id: 'soy', count: 2 }, { id: 'vinegar', count: 1 }, { id: 'chili', count: 1 }],
      cookTime: 6, sellPrice: 28, feedAmount: 20, energyAmount: 0, reputationRequired: 10 },
    { id: 'dish_broccoli_beef',   name: '西兰花炒牛肉', emoji: '🥦🥩', category: 'dish',
      ingredients: [{ foodId: 'broccoli', count: 2 }, { foodId: 'steak', count: 1 }], seasonings: [{ id: 'soy', count: 1 }, { id: 'pepper', count: 1 }],
      cookTime: 6, sellPrice: 42, feedAmount: 28, energyAmount: 0, reputationRequired: 12 },
    { id: 'dish_pumpkin_soup',    name: '奶油南瓜汤',   emoji: '🎃🥛', category: 'dish',
      ingredients: [{ foodId: 'pumpkin', count: 1 }, { foodId: 'milk', count: 1 }], seasonings: [{ id: 'cream', count: 1 }, { id: 'salt', count: 1 }],
      cookTime: 5, sellPrice: 26, feedAmount: 18, energyAmount: 3, reputationRequired: 8 },
    { id: 'dish_cabbage_roll',    name: '日式卷心菜卷', emoji: '🥬🍖', category: 'dish',
      ingredients: [{ foodId: 'cabbage', count: 2 }, { foodId: 'chicken', count: 1 }], seasonings: [{ id: 'soy', count: 1 }, { id: 'sesame', count: 1 }],
      cookTime: 6, sellPrice: 30, feedAmount: 22, energyAmount: 0, reputationRequired: 10 },
    { id: 'snack_onion_rings',    name: '炸洋葱圈',     emoji: '🧅🔥', category: 'snack',
      ingredients: [{ foodId: 'onion', count: 2 }], seasonings: [{ id: 'salt', count: 1 }, { id: 'pepper', count: 1 }],
      cookTime: 3, sellPrice: 16, feedAmount: 12, energyAmount: 0, reputationRequired: 5 },
    { id: 'dish_ginger_fish',     name: '姜葱蒸鱼',     emoji: '🫚🐟', category: 'dish',
      ingredients: [{ foodId: 'fish', count: 1 }, { foodId: 'ginger', count: 2 }, { foodId: 'leek', count: 1 }], seasonings: [{ id: 'soy', count: 2 }, { id: 'salt', count: 1 }],
      cookTime: 7, sellPrice: 36, feedAmount: 26, energyAmount: 0, reputationRequired: 12 },
    // --- 使用异形食材的菜品 ---
    { id: 'dish_lmeat_grill',     name: '炭烤L形肉排',     emoji: '🥓🔥', category: 'dish',
      ingredients: [{ foodId: 'lshape_meat', count: 1 }], seasonings: [{ id: 'pepper', count: 1 }, { id: 'salt', count: 1 }],
      cookTime: 6, sellPrice: 32, feedAmount: 22, energyAmount: 0, reputationRequired: 8 },
    { id: 'dish_tcheese_toast',   name: 'T形芝士焗吐司',   emoji: '🧀🍞', category: 'snack',
      ingredients: [{ foodId: 'tshape_cheese', count: 1 }, { foodId: 'bread', count: 1 }], seasonings: [{ id: 'butter', count: 1 }],
      cookTime: 4, sellPrice: 26, feedAmount: 18, energyAmount: 0, reputationRequired: 10 },
    { id: 'dish_zsushi_platter',  name: 'Z形创意寿司拼',   emoji: '🍣✨', category: 'dish',
      ingredients: [{ foodId: 'zshape_sushi', count: 1 }, { foodId: 'fish', count: 1 }], seasonings: [{ id: 'soy', count: 2 }, { id: 'wasabi', count: 1 }],
      cookTime: 7, sellPrice: 42, feedAmount: 28, energyAmount: 0, reputationRequired: 12 },
    { id: 'dish_ubread_sandwich', name: 'U形法棍三明治',   emoji: '🥖🥬', category: 'snack',
      ingredients: [{ foodId: 'ushape_bread', count: 1 }, { foodId: 'cheese', count: 1 }], seasonings: [{ id: 'butter', count: 1 }, { id: 'salt', count: 1 }],
      cookTime: 4, sellPrice: 28, feedAmount: 20, energyAmount: 0, reputationRequired: 10 },
    { id: 'dish_cross_cake_party', name: '十字庆典蛋糕',   emoji: '🎂🎉', category: 'dish',
      ingredients: [{ foodId: 'cross_cake', count: 1 }], seasonings: [{ id: 'cream', count: 2 }, { id: 'honey', count: 1 }],
      cookTime: 10, sellPrice: 55, feedAmount: 35, energyAmount: 5, reputationRequired: 18 },
    { id: 'dish_sfish_stew',      name: 'S形鱼排炖汤',     emoji: '🐡🫕', category: 'dish',
      ingredients: [{ foodId: 'sshape_fish', count: 1 }, { foodId: 'potato', count: 2 }], seasonings: [{ id: 'salt', count: 2 }, { id: 'pepper', count: 1 }],
      cookTime: 8, sellPrice: 38, feedAmount: 26, energyAmount: 0, reputationRequired: 12 },
    // --- Lv.6 美食殿堂解锁（声望500）---
    { id: 'dish_truffle_risotto', name: '松露烩饭',       emoji: '🍄🍚', category: 'dish',
      ingredients: [{ foodId: 'mushroom', count: 3 }, { foodId: 'cheese', count: 1 }], seasonings: [{ id: 'butter', count: 2 }, { id: 'salt', count: 1 }],
      cookTime: 10, sellPrice: 55, feedAmount: 32, energyAmount: 0, reputationRequired: 35 },
    { id: 'dish_seafood_pasta',   name: '海鲜意面',       emoji: '🦐🍝', category: 'dish',
      ingredients: [{ foodId: 'shrimp', count: 2 }, { foodId: 'noodle', count: 1 }], seasonings: [{ id: 'butter', count: 1 }, { id: 'pepper', count: 1 }, { id: 'salt', count: 1 }],
      cookTime: 8, sellPrice: 48, feedAmount: 28, energyAmount: 0, reputationRequired: 35 },
    { id: 'dish_honey_chicken',   name: '蜜汁鸡翅',       emoji: '🍗🍯', category: 'dish',
      ingredients: [{ foodId: 'chicken', count: 1 }], seasonings: [{ id: 'honey', count: 2 }, { id: 'soy', count: 1 }, { id: 'pepper', count: 1 }],
      cookTime: 7, sellPrice: 42, feedAmount: 26, energyAmount: 0, reputationRequired: 35 },
    { id: 'drink_matcha_latte',   name: '抹茶拿铁',       emoji: '🍵🥛', category: 'drink',
      ingredients: [{ foodId: 'milk', count: 1 }], seasonings: [{ id: 'honey', count: 1 }],
      cookTime: 3, sellPrice: 20, feedAmount: 10, energyAmount: 6, reputationRequired: 35 },
    { id: 'snack_spring_roll',    name: '酥脆春卷',       emoji: '🥟🔥', category: 'snack',
      ingredients: [{ foodId: 'cabbage', count: 1 }, { foodId: 'carrot', count: 1 }], seasonings: [{ id: 'vinegar', count: 1 }, { id: 'soy', count: 1 }],
      cookTime: 4, sellPrice: 24, feedAmount: 16, energyAmount: 0, reputationRequired: 35 },

    // --- Lv.7 皇家御膳房解锁（声望50）---
    { id: 'dish_royal_steak',     name: '皇家黑松露牛排', emoji: '🥩👑', category: 'dish',
      ingredients: [{ foodId: 'steak', count: 1 }, { foodId: 'mushroom', count: 2 }], seasonings: [{ id: 'butter', count: 2 }, { id: 'pepper', count: 2 }, { id: 'spice', count: 1 }],
      cookTime: 12, sellPrice: 85, feedAmount: 45, energyAmount: 0, reputationRequired: 50 },
    { id: 'dish_dragon_lobster',  name: '龙虾刺身拼盘',   emoji: '🦞🐲', category: 'dish',
      ingredients: [{ foodId: 'lobster', count: 1 }, { foodId: 'fish', count: 1 }], seasonings: [{ id: 'wasabi', count: 2 }, { id: 'soy', count: 2 }],
      cookTime: 10, sellPrice: 78, feedAmount: 40, energyAmount: 0, reputationRequired: 50 },
    { id: 'dish_emperor_hotpot',  name: '帝王鸳鸯锅',     emoji: '🫕👑', category: 'dish',
      ingredients: [{ foodId: 'pot', count: 1 }, { foodId: 'lobster', count: 1 }, { foodId: 'steak', count: 1 }], seasonings: [{ id: 'chili', count: 2 }, { id: 'spice', count: 2 }, { id: 'sesame', count: 1 }],
      cookTime: 15, sellPrice: 110, feedAmount: 55, energyAmount: 0, reputationRequired: 50 },
    { id: 'drink_royal_tea',      name: '御前贡茶',       emoji: '🍵👑', category: 'drink',
      ingredients: [{ foodId: 'milk', count: 1 }], seasonings: [{ id: 'honey', count: 2 }, { id: 'cream', count: 1 }],
      cookTime: 4, sellPrice: 28, feedAmount: 14, energyAmount: 8, reputationRequired: 50 },
    { id: 'snack_foie_gras',      name: '鹅肝酱配面包',   emoji: '🍞✨', category: 'snack',
      ingredients: [{ foodId: 'bread', count: 1 }], seasonings: [{ id: 'butter', count: 2 }, { id: 'honey', count: 1 }, { id: 'salt', count: 1 }],
      cookTime: 5, sellPrice: 38, feedAmount: 22, energyAmount: 0, reputationRequired: 50 },

    // --- Lv.8 世界名店解锁（声望70）---
    { id: 'dish_wagyu_bowl',      name: '和牛寿喜烧盖饭', emoji: '🥩🍚', category: 'dish',
      ingredients: [{ foodId: 'steak', count: 1 }, { foodId: 'eggs', count: 1 }, { foodId: 'onion', count: 2 }], seasonings: [{ id: 'soy', count: 2 }, { id: 'honey', count: 1 }],
      cookTime: 10, sellPrice: 72, feedAmount: 42, energyAmount: 0, reputationRequired: 70 },
    { id: 'dish_bouillabaisse',   name: '马赛鱼汤',       emoji: '🐟🫕', category: 'dish',
      ingredients: [{ foodId: 'fish', count: 2 }, { foodId: 'shrimp', count: 2 }, { foodId: 'potato', count: 2 }], seasonings: [{ id: 'butter', count: 1 }, { id: 'spice', count: 2 }, { id: 'salt', count: 2 }],
      cookTime: 12, sellPrice: 88, feedAmount: 48, energyAmount: 0, reputationRequired: 70 },
    { id: 'dish_peking_duck',     name: '北京烤鸭',       emoji: '🦆🔥', category: 'dish',
      ingredients: [{ foodId: 'chicken', count: 2 }], seasonings: [{ id: 'honey', count: 2 }, { id: 'spice', count: 2 }, { id: 'vinegar', count: 1 }],
      cookTime: 14, sellPrice: 95, feedAmount: 50, energyAmount: 0, reputationRequired: 70 },
    { id: 'drink_champagne',      name: '猫咪香槟',       emoji: '🥂✨', category: 'drink',
      ingredients: [{ foodId: 'grape', count: 2 }, { foodId: 'juice', count: 1 }], seasonings: [{ id: 'honey', count: 1 }],
      cookTime: 5, sellPrice: 35, feedAmount: 12, energyAmount: 10, reputationRequired: 70 },

    // --- Lv.9 银河食府解锁（声望100）---
    { id: 'dish_galaxy_sushi',    name: '银河寿司船',     emoji: '🍣🌌', category: 'dish',
      ingredients: [{ foodId: 'sushi', count: 1 }, { foodId: 'lobster', count: 1 }, { foodId: 'fish', count: 1 }], seasonings: [{ id: 'wasabi', count: 2 }, { id: 'soy', count: 2 }, { id: 'vinegar', count: 1 }],
      cookTime: 12, sellPrice: 105, feedAmount: 52, energyAmount: 0, reputationRequired: 100 },
    { id: 'dish_nebula_stew',     name: '星云炖菜',       emoji: '🌠🫕', category: 'dish',
      ingredients: [{ foodId: 'pot', count: 1 }, { foodId: 'pumpkin', count: 1 }, { foodId: 'mushroom', count: 3 }], seasonings: [{ id: 'cream', count: 2 }, { id: 'spice', count: 2 }, { id: 'butter', count: 2 }],
      cookTime: 15, sellPrice: 120, feedAmount: 58, energyAmount: 5, reputationRequired: 100 },
    { id: 'dish_aurora_salmon',   name: '极光三文鱼',     emoji: '🐟💫', category: 'dish',
      ingredients: [{ foodId: 'fish', count: 2 }], seasonings: [{ id: 'wasabi', count: 1 }, { id: 'cream', count: 2 }, { id: 'honey', count: 1 }],
      cookTime: 8, sellPrice: 68, feedAmount: 38, energyAmount: 0, reputationRequired: 100 },
    { id: 'drink_galaxy_cocktail', name: '银河气泡酒',    emoji: '🍸🌌', category: 'drink',
      ingredients: [{ foodId: 'juice', count: 1 }, { foodId: 'grape', count: 1 }], seasonings: [{ id: 'honey', count: 2 }],
      cookTime: 4, sellPrice: 40, feedAmount: 15, energyAmount: 12, reputationRequired: 100 },

    // --- Lv.10 传说·喵神殿解锁（声望140）---
    { id: 'dish_divine_feast',    name: '神殿圣宴',       emoji: '✨🍽️', category: 'dish',
      ingredients: [{ foodId: 'turkey', count: 1 }, { foodId: 'lobster', count: 1 }, { foodId: 'steak', count: 1 }], seasonings: [{ id: 'spice', count: 3 }, { id: 'butter', count: 2 }, { id: 'honey', count: 2 }],
      cookTime: 20, sellPrice: 180, feedAmount: 80, energyAmount: 10, reputationRequired: 140 },
    { id: 'dish_phoenix_soup',    name: '凤凰浓汤',       emoji: '🔥🫕', category: 'dish',
      ingredients: [{ foodId: 'chicken', count: 2 }, { foodId: 'mushroom', count: 3 }], seasonings: [{ id: 'spice', count: 3 }, { id: 'cream', count: 2 }, { id: 'salt', count: 2 }],
      cookTime: 16, sellPrice: 135, feedAmount: 65, energyAmount: 5, reputationRequired: 140 },
    { id: 'dish_dragon_roll',     name: '龙卷至尊',       emoji: '🐉🍣', category: 'dish',
      ingredients: [{ foodId: 'zshape_sushi', count: 1 }, { foodId: 'lobster', count: 1 }, { foodId: 'avocado', count: 2 }], seasonings: [{ id: 'wasabi', count: 2 }, { id: 'soy', count: 2 }, { id: 'sesame', count: 2 }],
      cookTime: 14, sellPrice: 150, feedAmount: 70, energyAmount: 0, reputationRequired: 140 },
    { id: 'drink_elixir',         name: '传说仙露',       emoji: '💧✨', category: 'drink',
      ingredients: [{ foodId: 'milk', count: 1 }, { foodId: 'juice', count: 1 }], seasonings: [{ id: 'honey', count: 3 }, { id: 'cream', count: 2 }],
      cookTime: 6, sellPrice: 55, feedAmount: 25, energyAmount: 20, reputationRequired: 140 },
    { id: 'snack_golden_toast',   name: '黄金法式吐司',   emoji: '🍞💛', category: 'snack',
      ingredients: [{ foodId: 'bread', count: 1 }, { foodId: 'eggs', count: 1 }], seasonings: [{ id: 'butter', count: 2 }, { id: 'honey', count: 2 }, { id: 'cream', count: 1 }],
      cookTime: 6, sellPrice: 45, feedAmount: 28, energyAmount: 0, reputationRequired: 140 },

    // --- 使用新增蔬菜的菜品 ---
    { id: 'dish_celery_shrimp',   name: '芹菜虾仁',       emoji: '🌿🦐', category: 'dish',
      ingredients: [{ foodId: 'celery', count: 2 }, { foodId: 'shrimp', count: 1 }], seasonings: [{ id: 'salt', count: 1 }, { id: 'pepper', count: 1 }],
      cookTime: 5, sellPrice: 28, feedAmount: 20, energyAmount: 0, reputationRequired: 5 },
    { id: 'dish_spicy_chicken',   name: '辣子鸡丁',       emoji: '🌶️🍗', category: 'dish',
      ingredients: [{ foodId: 'chicken', count: 1 }, { foodId: 'chili', count: 3 }], seasonings: [{ id: 'chili', count: 2 }, { id: 'soy', count: 1 }, { id: 'vinegar', count: 1 }],
      cookTime: 7, sellPrice: 38, feedAmount: 26, energyAmount: 0, reputationRequired: 10 },
    { id: 'dish_dry_fried_bean',  name: '干煸四季豆',     emoji: '🫛🔥', category: 'dish',
      ingredients: [{ foodId: 'bean', count: 3 }], seasonings: [{ id: 'chili', count: 1 }, { id: 'soy', count: 1 }, { id: 'salt', count: 1 }],
      cookTime: 5, sellPrice: 22, feedAmount: 16, energyAmount: 0, reputationRequired: 5 },
    { id: 'dish_radish_stew',     name: '萝卜炖排骨',     emoji: '🥕🍖', category: 'dish',
      ingredients: [{ foodId: 'radish', count: 2 }, { foodId: 'chicken', count: 1 }], seasonings: [{ id: 'salt', count: 2 }, { id: 'soy', count: 1 }],
      cookTime: 8, sellPrice: 35, feedAmount: 24, energyAmount: 0, reputationRequired: 8 },
    { id: 'snack_lettuce_wrap',   name: '生菜包肉',       emoji: '🥬🍖', category: 'snack',
      ingredients: [{ foodId: 'lettuce', count: 2 }, { foodId: 'chicken', count: 1 }], seasonings: [{ id: 'sesame', count: 1 }, { id: 'soy', count: 1 }],
      cookTime: 3, sellPrice: 20, feedAmount: 14, energyAmount: 0, reputationRequired: 5 },
    { id: 'dish_roast_sweetpotato', name: '蜜烤红薯',     emoji: '🍠🍯', category: 'snack',
      ingredients: [{ foodId: 'sweetpotato', count: 2 }], seasonings: [{ id: 'honey', count: 2 }, { id: 'butter', count: 1 }],
      cookTime: 6, sellPrice: 24, feedAmount: 16, energyAmount: 3, reputationRequired: 8 },
    { id: 'dish_mapo_tofu',       name: '麻婆豆腐',       emoji: '🧊🌶️', category: 'dish',
      ingredients: [{ foodId: 'tofu', count: 2 }, { foodId: 'chili', count: 2 }], seasonings: [{ id: 'chili', count: 2 }, { id: 'soy', count: 1 }, { id: 'pepper', count: 1 }],
      cookTime: 6, sellPrice: 30, feedAmount: 20, energyAmount: 0, reputationRequired: 10 },
    { id: 'dish_veggie_salad',    name: '田园蔬菜沙拉',   emoji: '🥬🥗', category: 'snack',
      ingredients: [{ foodId: 'lettuce', count: 2 }, { foodId: 'tomato', count: 1 }, { foodId: 'cucumber', count: 1 }], seasonings: [{ id: 'vinegar', count: 1 }, { id: 'salt', count: 1 }],
      cookTime: 3, sellPrice: 18, feedAmount: 14, energyAmount: 0, reputationRequired: 5 },
    { id: 'dish_bean_beef',       name: '四季豆炒牛肉',   emoji: '🫛🥩', category: 'dish',
      ingredients: [{ foodId: 'bean', count: 2 }, { foodId: 'steak', count: 1 }], seasonings: [{ id: 'soy', count: 2 }, { id: 'pepper', count: 1 }],
      cookTime: 7, sellPrice: 44, feedAmount: 30, energyAmount: 0, reputationRequired: 12 },
    { id: 'dish_sweetpotato_soup', name: '红薯甜汤',      emoji: '🍠🫕', category: 'drink',
      ingredients: [{ foodId: 'sweetpotato', count: 2 }], seasonings: [{ id: 'honey', count: 1 }],
      cookTime: 4, sellPrice: 14, feedAmount: 8, energyAmount: 5, reputationRequired: 8 },
    // --- 高级菜（声望35+）---
    { id: 'dish_kung_pao',        name: '宫保鸡丁',       emoji: '🥜🍗', category: 'dish',
      ingredients: [{ foodId: 'chicken', count: 1 }, { foodId: 'chili', count: 2 }], seasonings: [{ id: 'soy', count: 2 }, { id: 'vinegar', count: 1 }, { id: 'sesame', count: 1 }],
      cookTime: 7, sellPrice: 40, feedAmount: 28, energyAmount: 0, reputationRequired: 35 },
    { id: 'dish_steamed_egg',     name: '日式茶碗蒸',     emoji: '🥚✨', category: 'dish',
      ingredients: [{ foodId: 'eggs', count: 2 }, { foodId: 'shrimp', count: 1 }], seasonings: [{ id: 'soy', count: 1 }, { id: 'salt', count: 1 }],
      cookTime: 5, sellPrice: 26, feedAmount: 18, energyAmount: 3, reputationRequired: 35 },
    // --- 高级菜（声望50+）---
    { id: 'dish_double_pepper_fish', name: '双椒鱼头',    emoji: '🐟🌶️', category: 'dish',
      ingredients: [{ foodId: 'fish', count: 1 }, { foodId: 'chili', count: 3 }], seasonings: [{ id: 'chili', count: 2 }, { id: 'soy', count: 1 }, { id: 'vinegar', count: 1 }],
      cookTime: 9, sellPrice: 52, feedAmount: 32, energyAmount: 0, reputationRequired: 50 },
    { id: 'dish_buddha_jumps_wall', name: '佛跳墙',       emoji: '🏺✨', category: 'dish',
      ingredients: [{ foodId: 'chicken', count: 1 }, { foodId: 'shrimp', count: 2 }, { foodId: 'mushroom', count: 2 }], seasonings: [{ id: 'spice', count: 2 }, { id: 'soy', count: 2 }, { id: 'salt', count: 1 }],
      cookTime: 14, sellPrice: 88, feedAmount: 48, energyAmount: 0, reputationRequired: 50 },
    // --- 异形食材进阶联动菜品 ---
    { id: 'dish_lmeat_pepper_steak', name: 'L形黑椒铁板',   emoji: '🥓🔥', category: 'dish',
      ingredients: [{ foodId: 'lshape_meat', count: 1 }, { foodId: 'onion', count: 2 }], seasonings: [{ id: 'pepper', count: 2 }, { id: 'butter', count: 1 }, { id: 'soy', count: 1 }],
      cookTime: 8, sellPrice: 42, feedAmount: 28, energyAmount: 0, reputationRequired: 15 },
    { id: 'dish_tcheese_fondue',     name: 'T形芝士火锅',   emoji: '🧀🫕', category: 'dish',
      ingredients: [{ foodId: 'tshape_cheese', count: 1 }, { foodId: 'bread', count: 1 }, { foodId: 'broccoli', count: 1 }], seasonings: [{ id: 'butter', count: 2 }, { id: 'pepper', count: 1 }],
      cookTime: 7, sellPrice: 38, feedAmount: 24, energyAmount: 0, reputationRequired: 15 },
    { id: 'dish_zsushi_tempura',     name: 'Z形天妇罗卷',   emoji: '🍣🍤', category: 'dish',
      ingredients: [{ foodId: 'zshape_sushi', count: 1 }, { foodId: 'shrimp', count: 2 }], seasonings: [{ id: 'salt', count: 1 }, { id: 'soy', count: 2 }],
      cookTime: 6, sellPrice: 36, feedAmount: 22, energyAmount: 0, reputationRequired: 12 },
    { id: 'dish_ubread_pizza',       name: 'U形法棍披萨',   emoji: '🥖🍕', category: 'dish',
      ingredients: [{ foodId: 'ushape_bread', count: 1 }, { foodId: 'tomato', count: 2 }, { foodId: 'cheese', count: 1 }], seasonings: [{ id: 'sauce', count: 2 }, { id: 'salt', count: 1 }],
      cookTime: 7, sellPrice: 40, feedAmount: 26, energyAmount: 0, reputationRequired: 15 },
    { id: 'dish_cross_cake_royal',   name: '十字皇冠蛋糕',   emoji: '🎂👑', category: 'dish',
      ingredients: [{ foodId: 'cross_cake', count: 1 }, { foodId: 'eggs', count: 2 }], seasonings: [{ id: 'cream', count: 3 }, { id: 'honey', count: 2 }, { id: 'butter', count: 1 }],
      cookTime: 12, sellPrice: 72, feedAmount: 42, energyAmount: 8, reputationRequired: 50 },
    { id: 'dish_sfish_curry',        name: 'S形咖喱鱼排',   emoji: '🐡🍛', category: 'dish',
      ingredients: [{ foodId: 'sshape_fish', count: 1 }, { foodId: 'potato', count: 2 }, { foodId: 'onion', count: 1 }], seasonings: [{ id: 'spice', count: 2 }, { id: 'butter', count: 1 }, { id: 'salt', count: 1 }],
      cookTime: 9, sellPrice: 48, feedAmount: 30, energyAmount: 0, reputationRequired: 35 },
    { id: 'dish_lmeat_lettuce_wrap', name: 'L形肉排生菜卷', emoji: '🥓🥬', category: 'snack',
      ingredients: [{ foodId: 'lshape_meat', count: 1 }, { foodId: 'lettuce', count: 2 }], seasonings: [{ id: 'sesame', count: 1 }, { id: 'vinegar', count: 1 }],
      cookTime: 4, sellPrice: 28, feedAmount: 20, energyAmount: 0, reputationRequired: 10 },
    { id: 'dish_ubread_lobster',     name: 'U形龙虾堡',     emoji: '🥖🦞', category: 'dish',
      ingredients: [{ foodId: 'ushape_bread', count: 1 }, { foodId: 'lobster', count: 1 }], seasonings: [{ id: 'butter', count: 2 }, { id: 'pepper', count: 1 }, { id: 'cream', count: 1 }],
      cookTime: 10, sellPrice: 68, feedAmount: 38, energyAmount: 0, reputationRequired: 50 },
    { id: 'dish_sfish_sweetpotato',  name: 'S形鱼排配烤薯', emoji: '🐡🍠', category: 'dish',
      ingredients: [{ foodId: 'sshape_fish', count: 1 }, { foodId: 'sweetpotato', count: 2 }], seasonings: [{ id: 'salt', count: 1 }, { id: 'butter', count: 1 }, { id: 'honey', count: 1 }],
      cookTime: 8, sellPrice: 44, feedAmount: 28, energyAmount: 0, reputationRequired: 35 },
    { id: 'dish_tcheese_mushroom',   name: 'T形芝士焗蘑菇', emoji: '🧀🍄', category: 'dish',
      ingredients: [{ foodId: 'tshape_cheese', count: 1 }, { foodId: 'mushroom', count: 3 }], seasonings: [{ id: 'cream', count: 1 }, { id: 'pepper', count: 1 }, { id: 'salt', count: 1 }],
      cookTime: 7, sellPrice: 40, feedAmount: 26, energyAmount: 0, reputationRequired: 35 },

  ];

  // ===== 客人定义 =====
  const RESTAURANT_CUSTOMERS = [
    // --- 普通客人（声望0可见）---
    { id: 'office_cat',     name: '上班族猫猫',   emoji: '😺💼',
      wantsCategory: 'snack', patience: 45, tipMulti: 1.0, reputationGive: 1, reputationRequired: 0,
      dialogue: '来份快餐，赶时间！' },
    { id: 'kitten',         name: '小猫崽',       emoji: '🐱🎀',
      wantsCategory: 'dessert', patience: 30, tipMulti: 0.8, reputationGive: 1, reputationRequired: 0,
      dialogue: '要甜甜的！' },
    { id: 'elder_cat',      name: '老爷爷猫',     emoji: '🐱👴',
      wantsCategory: 'dish', patience: 90, tipMulti: 1.0, reputationGive: 1, reputationRequired: 0,
      dialogue: '来一份家常菜吧，不急不急。' },
    { id: 'exercise_cat',   name: '运动猫',       emoji: '🐱🏃',
      wantsCategory: 'snack', patience: 40, tipMulti: 1.0, reputationGive: 1, reputationRequired: 0,
      dialogue: '有沙拉吗？要轻食！' },
    { id: 'hungry_cat',     name: '饥肠辘辘猫',   emoji: '🐱😤',
      wantsCategory: 'dish', patience: 25, tipMulti: 1.2, reputationGive: 1, reputationRequired: 0,
      dialogue: '快快快！饿死了！' },
    { id: 'picky_cat',      name: '挑食小猫',     emoji: '🐱🙄',
      wantsCategory: 'specific', patience: 50, tipMulti: 1.5, reputationGive: 2, reputationRequired: 0,
      dialogue: '我只要那个…' },
    { id: 'thirsty_cat',    name: '口渴猫',       emoji: '🐱💧',
      wantsCategory: 'drink', patience: 35, tipMulti: 1.0, reputationGive: 1, reputationRequired: 0,
      dialogue: '好渴啊，来杯喝的！' },

    // --- 中级客人（声望10解锁）---
    { id: 'foodie_cat',     name: '美食博主猫',   emoji: '🐱📸',
      wantsCategory: 'dish', patience: 60, tipMulti: 2.0, reputationGive: 3, reputationRequired: 10,
      dialogue: '拍照先！要好看的菜！', bonusGold: 10 },
    { id: 'couple_cats',    name: '约会情侣猫',   emoji: '🐱❤️',
      wantsCategory: 'dish', patience: 80, tipMulti: 1.5, reputationGive: 3, reputationRequired: 10,
      dialogue: '两份哦，谢谢～', orderCount: 2 },
    { id: 'chef_cat',       name: '美食评论家猫', emoji: '🐱📝',
      wantsCategory: 'premium', patience: 30, tipMulti: 2.5, reputationGive: 4, reputationRequired: 10,
      dialogue: '有什么拿手菜？快上！' },
    { id: 'birthday_cat',   name: '生日猫',       emoji: '🐱🎂',
      wantsCategory: 'dessert', patience: 100, tipMulti: 2.0, reputationGive: 3, reputationRequired: 10,
      dialogue: '今天是我生日！要蛋糕！' },
    { id: 'midnight_cat',   name: '深夜猫',       emoji: '🐱🌙',
      wantsCategory: 'dish', patience: 70, tipMulti: 1.3, reputationGive: 2, reputationRequired: 10,
      dialogue: '深夜食堂…来份热的。' },
    { id: 'traveler_cat',   name: '旅行者猫',     emoji: '🐱🎒',
      wantsCategory: 'snack', patience: 45, tipMulti: 1.2, reputationGive: 2, reputationRequired: 10,
      dialogue: '有便当带走吗？' },

    // --- 高级客人（声望20解锁）---
    { id: 'noble_cat',      name: '贵族猫大人',   emoji: '🐱👑',
      wantsCategory: 'premium', patience: 40, tipMulti: 3.0, reputationGive: 5, reputationRequired: 20,
      dialogue: '本喵要最好的！' },
    { id: 'mysterious_cat', name: '神秘老顾客',   emoji: '🐱🎭',
      wantsCategory: 'any', patience: 60, tipMulti: 3.5, reputationGive: 6, reputationRequired: 20,
      dialogue: '…随便来一份吧。' },
    { id: 'alien_cat',      name: '外星猫',       emoji: '🐱👽',
      wantsCategory: 'any', patience: 50, tipMulti: 4.0, reputationGive: 8, reputationRequired: 25,
      dialogue: '喵星球的问候！什么好吃？' },
    { id: 'cat_idol',       name: '猫咪偶像',     emoji: '🐱⭐',
      wantsCategory: 'dish', patience: 55, tipMulti: 3.0, reputationGive: 5, reputationRequired: 20,
      dialogue: '低调低调…来份招牌菜。', bonusGold: 20 },
    // --- 高级客人（声望30解锁）---
    { id: 'gourmet_critic',  name: '美食评论大师', emoji: '🐱📰',
      wantsCategory: 'premium', patience: 35, tipMulti: 3.5, reputationGive: 6, reputationRequired: 30,
      dialogue: '听说这里新出了好菜？让我尝尝！' },
    { id: 'family_cats',     name: '猫咪一家四口', emoji: '🐱👨‍👩‍👧‍👦',
      wantsCategory: 'dish', patience: 100, tipMulti: 2.0, reputationGive: 4, reputationRequired: 30,
      dialogue: '我们一家人想好好吃顿饭～', orderCount: 4 },

    // --- 大师级客人（声望50解锁 → 对应Lv.6~7）---
    { id: 'foreign_chef',    name: '法国名厨猫',   emoji: '🐱🇫🇷',
      wantsCategory: 'premium', patience: 40, tipMulti: 4.0, reputationGive: 7, reputationRequired: 50,
      dialogue: '我来见识一下东方料理的实力！', bonusGold: 25 },
    { id: 'king_cat',        name: '猫国国王',     emoji: '🐱👑',
      wantsCategory: 'premium', patience: 50, tipMulti: 5.0, reputationGive: 10, reputationRequired: 50,
      dialogue: '朕要尝尝你的招牌菜。', bonusGold: 50 },
    { id: 'ninja_cat',       name: '忍者猫',       emoji: '🐱🥷',
      wantsCategory: 'dish', patience: 20, tipMulti: 3.0, reputationGive: 5, reputationRequired: 50,
      dialogue: '快！十秒内上菜！（夸张了）' },

    // --- 传奇级客人（声望80解锁 → 对应Lv.8~9）---
    { id: 'dragon_cat',      name: '龙裔猫',       emoji: '🐱🐲',
      wantsCategory: 'premium', patience: 45, tipMulti: 5.0, reputationGive: 12, reputationRequired: 80,
      dialogue: '本龙饿了，上最好的。', bonusGold: 40 },
    { id: 'ghost_cat',       name: '幽灵美食家猫', emoji: '🐱👻',
      wantsCategory: 'any', patience: 200, tipMulti: 4.0, reputationGive: 8, reputationRequired: 80,
      dialogue: '我在这家店等了一百年…终于开门了…', bonusGold: 30 },
    { id: 'time_cat',        name: '时间旅行者猫', emoji: '🐱⏰',
      wantsCategory: 'dish', patience: 30, tipMulti: 4.5, reputationGive: 9, reputationRequired: 80,
      dialogue: '未来的人都说你这里好吃！' },
    { id: 'celebrity_cats',  name: '猫界明星团',   emoji: '🐱🌟🌟',
      wantsCategory: 'dish', patience: 60, tipMulti: 3.5, reputationGive: 8, reputationRequired: 80,
      dialogue: '我们要包场！来3份拿手菜！', orderCount: 3 },

    // --- 神话级客人（声望120解锁 → 对应Lv.10）---
    { id: 'god_cat',         name: '猫之神',       emoji: '🐱🔱',
      wantsCategory: 'premium', patience: 60, tipMulti: 8.0, reputationGive: 20, reputationRequired: 120,
      dialogue: '吾降临于此，献上你最得意之作。', bonusGold: 100 },
    { id: 'angel_cat',       name: '天使猫',       emoji: '🐱😇',
      wantsCategory: 'any', patience: 120, tipMulti: 6.0, reputationGive: 15, reputationRequired: 120,
      dialogue: '嗯…来份温暖心灵的料理吧♪', bonusGold: 60 },
    { id: 'demon_cat',       name: '暗黑美食魔猫', emoji: '🐱😈',
      wantsCategory: 'premium', patience: 25, tipMulti: 7.0, reputationGive: 18, reputationRequired: 120,
      dialogue: '十秒。否则本魔给差评。', bonusGold: 80 },

    // --- 新增普通客人（声望0）---
    { id: 'student_cat',    name: '学生猫',       emoji: '🐱📚',
      wantsCategory: 'snack', patience: 50, tipMulti: 0.9, reputationGive: 1, reputationRequired: 0,
      dialogue: '课间十分钟…有快餐吗？' },
    { id: 'grandma_cat',    name: '猫奶奶',       emoji: '🐱👵',
      wantsCategory: 'dish', patience: 120, tipMulti: 1.2, reputationGive: 2, reputationRequired: 0,
      dialogue: '不急不急，老婆子等得起～', bonusGold: 5 },
    { id: 'delivery_cat',   name: '外卖猫',       emoji: '🐱📦',
      wantsCategory: 'snack', patience: 20, tipMulti: 1.0, reputationGive: 1, reputationRequired: 0,
      dialogue: '快快快！单子要超时了！' },

    // --- 新增中级客人（声望10）---
    { id: 'artist_cat',     name: '画家猫',       emoji: '🐱🎨',
      wantsCategory: 'drink', patience: 80, tipMulti: 1.5, reputationGive: 2, reputationRequired: 10,
      dialogue: '来杯能激发灵感的饮品吧～' },
    { id: 'doctor_cat',     name: '医生猫',       emoji: '🐱🩺',
      wantsCategory: 'dish', patience: 40, tipMulti: 1.8, reputationGive: 3, reputationRequired: 10,
      dialogue: '手术间隙，来份营养餐。' },
    { id: 'twins_cat',      name: '双胞胎猫',     emoji: '🐱🐱',
      wantsCategory: 'snack', patience: 60, tipMulti: 1.5, reputationGive: 3, reputationRequired: 10,
      dialogue: '我们要一模一样的！', orderCount: 2 },

    // --- 新增高级客人（声望20）---
    { id: 'detective_cat',  name: '侦探猫',       emoji: '🐱🔍',
      wantsCategory: 'specific', patience: 45, tipMulti: 2.5, reputationGive: 4, reputationRequired: 20,
      dialogue: '我要推理出最好吃的那道菜…' },
    { id: 'pirate_cat',     name: '海盗猫',       emoji: '🐱🏴‍☠️',
      wantsCategory: 'dish', patience: 35, tipMulti: 2.0, reputationGive: 4, reputationRequired: 20,
      dialogue: '把你的宝藏美食交出来！', bonusGold: 15 },

    // --- 新增大师级客人（声望50）---
    { id: 'samurai_cat',    name: '武士猫',       emoji: '🐱⚔️',
      wantsCategory: 'dish', patience: 30, tipMulti: 3.5, reputationGive: 6, reputationRequired: 50,
      dialogue: '一食入魂！上你最强的料理！', bonusGold: 30 },
    { id: 'mermaid_cat',    name: '人鱼猫',       emoji: '🐱🧜',
      wantsCategory: 'drink', patience: 60, tipMulti: 3.0, reputationGive: 5, reputationRequired: 50,
      dialogue: '来杯蓝色的…像大海一样的饮品♪' },
    { id: 'wizard_cat',     name: '魔法师猫',     emoji: '🐱🧙',
      wantsCategory: 'premium', patience: 45, tipMulti: 4.0, reputationGive: 7, reputationRequired: 50,
      dialogue: '让我看看你的秘制魔法料理！', bonusGold: 35 },

    // --- 新增传奇级客人（声望80）---
    { id: 'phoenix_cat',    name: '凤凰猫',       emoji: '🐱🔥',
      wantsCategory: 'premium', patience: 40, tipMulti: 5.5, reputationGive: 12, reputationRequired: 80,
      dialogue: '浴火而来…献上配得上不死鸟的佳肴！', bonusGold: 50 },
    { id: 'dream_cat',      name: '梦境旅者猫',   emoji: '🐱💭',
      wantsCategory: 'any', patience: 150, tipMulti: 3.5, reputationGive: 8, reputationRequired: 80,
      dialogue: '嗯…我好像在梦里来过这里…', bonusGold: 25 },

    // --- 新增神话级客人（声望120）---
    { id: 'star_cat',       name: '星之使者猫',   emoji: '🐱💫',
      wantsCategory: 'premium', patience: 50, tipMulti: 7.0, reputationGive: 16, reputationRequired: 120,
      dialogue: '来自遥远银河的问候…上最顶级的！', bonusGold: 90 },

  ];

  // ===== 餐厅等级定义 =====
  const RESTAURANT_LEVELS = [
    { level: 1,  name: '路边小摊',   reputationRequired: 0,    maxCustomers: 2,  emoji: '🏕️' },
    { level: 2,  name: '温馨小店',   reputationRequired: 30,   maxCustomers: 3,  emoji: '🏠' },
    { level: 3,  name: '特色餐厅',   reputationRequired: 80,   maxCustomers: 4,  emoji: '🏪' },
    { level: 4,  name: '星级餐厅',   reputationRequired: 160,  maxCustomers: 5,  emoji: '🏨' },
    { level: 5,  name: '猫界传奇',   reputationRequired: 300,  maxCustomers: 6,  emoji: '🏰' },
    { level: 6,  name: '美食殿堂',   reputationRequired: 500,  maxCustomers: 7,  emoji: '🏛️' },
    { level: 7,  name: '皇家御膳房', reputationRequired: 800,  maxCustomers: 8,  emoji: '👑' },
    { level: 8,  name: '世界名店',   reputationRequired: 1200, maxCustomers: 9,  emoji: '🌍' },
    { level: 9,  name: '银河食府',   reputationRequired: 1800, maxCustomers: 10, emoji: '🌌' },
    { level: 10, name: '传说·喵神殿', reputationRequired: 2500, maxCustomers: 12, emoji: '✨' },
  ];

  // ============================================================
  // 🏆 成就系统定义
  // ============================================================
  const ACHIEVEMENTS = [
    // ===================== 互动类 =====================
    { id: 'first_feed',       name: '第一口猫粮',       emoji: '🍖', desc: '第一次投喂桌宠', category: 'interact', tier: 1,
      check: () => state.totalInteractions >= 1 },
    { id: 'feed_10',          name: '贴心铲屎官',       emoji: '🥄', desc: '累计互动10次', category: 'interact', tier: 1,
      check: () => state.totalInteractions >= 10 },
    { id: 'feed_50',          name: '美食供养者',       emoji: '🍽️', desc: '累计互动50次', category: 'interact', tier: 2,
      check: () => state.totalInteractions >= 50 },
    { id: 'feed_100',         name: '百次宠爱',         emoji: '💝', desc: '累计互动100次', category: 'interact', tier: 3,
      check: () => state.totalInteractions >= 100 },
    { id: 'feed_200',         name: '传说级饲养员',     emoji: '👑', desc: '累计互动200次', category: 'interact', tier: 4,
      check: () => state.totalInteractions >= 200 },
    { id: 'feed_500',         name: '千手观音铲屎官',   emoji: '🙏', desc: '累计互动500次', category: 'interact', tier: 5,
      check: () => state.totalInteractions >= 500 },
    { id: 'chat_first',       name: '破冰对话',         emoji: '💬', desc: '第一次和桌宠聊天', category: 'interact', tier: 1,
      check: () => state.petChatHistory.length >= 1 },
    { id: 'chat_20',          name: '话匣子打开了',     emoji: '📢', desc: '累计聊天20条', category: 'interact', tier: 1,
      check: () => state.petChatHistory.length >= 20 },
    { id: 'chat_50',          name: '话唠搭档',         emoji: '🗣️', desc: '累计聊天50条', category: 'interact', tier: 2,
      check: () => state.petChatHistory.length >= 50 },
    { id: 'chat_100',         name: '百句絮语',         emoji: '📜', desc: '累计聊天100条', category: 'interact', tier: 3,
      check: () => state.petChatHistory.length >= 100 },
    { id: 'chat_200',         name: '灵魂伴侣',         emoji: '💕', desc: '累计聊天200条', category: 'interact', tier: 4,
      check: () => state.petChatHistory.length >= 200 },
    { id: 'chat_500',         name: '千言万语',         emoji: '📖', desc: '累计聊天500条', category: 'interact', tier: 5,
      check: () => state.petChatHistory.length >= 500 },
    { id: 'diary_first',      name: '今日份记录',       emoji: '📔', desc: '生成第一篇日记', category: 'interact', tier: 1,
      check: () => (state.diaryEntries || []).length >= 1 },
    { id: 'diary_7',          name: '一周不间断',       emoji: '📅', desc: '累计写7篇日记', category: 'interact', tier: 2,
      check: () => (state.diaryEntries || []).length >= 7 },
    { id: 'diary_14',         name: '两周坚持',         emoji: '🗓️', desc: '累计写14篇日记', category: 'interact', tier: 3,
      check: () => (state.diaryEntries || []).length >= 14 },
    { id: 'diary_30',         name: '月度回忆录',       emoji: '📖', desc: '累计写30篇日记', category: 'interact', tier: 4,
      check: () => (state.diaryEntries || []).length >= 30 },
    { id: 'diary_60',         name: '季度编年史',       emoji: '📚', desc: '累计写60篇日记', category: 'interact', tier: 5,
      check: () => (state.diaryEntries || []).length >= 60 },
    { id: 'memory_3',         name: '初识记忆',         emoji: '💭', desc: '记忆池达到3条', category: 'interact', tier: 1,
      check: () => state.memories.length >= 3 },
    { id: 'memory_5',         name: '记忆收藏家',       emoji: '🧠', desc: '记忆池达到5条', category: 'interact', tier: 2,
      check: () => state.memories.length >= 5 },
    { id: 'memory_10',        name: '记忆编织者',       emoji: '🕸️', desc: '记忆池达到10条', category: 'interact', tier: 3,
      check: () => state.memories.length >= 10 },
    { id: 'memory_15',        name: '记忆大师',         emoji: '🌟', desc: '记忆池达到15条', category: 'interact', tier: 4,
      check: () => state.memories.length >= 15 },
    { id: 'summary_first',    name: '第一次总结',       emoji: '📝', desc: '生成过对话总结', category: 'interact', tier: 1,
      check: () => !!state.summary && state.summary.length > 0 },

    // ===================== 经济类 =====================
    { id: 'gold_50',          name: '有点零花钱',       emoji: '🪙', desc: '拥有50金币', category: 'economy', tier: 1,
      check: () => state.gameGold >= 50 },
    { id: 'gold_100',         name: '小有积蓄',         emoji: '💰', desc: '拥有100金币', category: 'economy', tier: 1,
      check: () => state.gameGold >= 100 },
    { id: 'gold_300',         name: '猫咪小金库',       emoji: '🏧', desc: '拥有300金币', category: 'economy', tier: 2,
      check: () => state.gameGold >= 300 },
    { id: 'gold_500',         name: '小富猫',           emoji: '💵', desc: '拥有500金币', category: 'economy', tier: 2,
      check: () => state.gameGold >= 500 },
    { id: 'gold_1000',        name: '千金猫',           emoji: '🤑', desc: '拥有1000金币', category: 'economy', tier: 3,
      check: () => state.gameGold >= 1000 },
    { id: 'gold_2000',        name: '金库管理员',       emoji: '🏦', desc: '拥有2000金币', category: 'economy', tier: 3,
      check: () => state.gameGold >= 2000 },
    { id: 'gold_5000',        name: '身价不菲',         emoji: '💳', desc: '拥有5000金币', category: 'economy', tier: 4,
      check: () => state.gameGold >= 5000 },
    { id: 'gold_10000',       name: '富可敌国',         emoji: '💎', desc: '拥有10000金币', category: 'economy', tier: 4,
      check: () => state.gameGold >= 10000 },
    { id: 'gold_50000',       name: '传说·猫界首富',    emoji: '🏆', desc: '拥有50000金币', category: 'economy', tier: 5,
      check: () => state.gameGold >= 50000 },

    // ===================== 合成工坊类 =====================
    { id: 'merge_first',      name: '合成新手',         emoji: '🧶', desc: '图鉴解锁2种以上', category: 'merge', tier: 1,
      check: () => (state.gameCollection || []).length >= 2 },
    { id: 'merge_collection_10', name: '初级图鉴',      emoji: '📒', desc: '合成图鉴解锁10种', category: 'merge', tier: 2,
      check: () => (state.gameCollection || []).length >= 10 },
    { id: 'merge_collection_20', name: '图鉴达人',      emoji: '📖', desc: '合成图鉴解锁20种', category: 'merge', tier: 3,
      check: () => (state.gameCollection || []).length >= 20 },
    { id: 'merge_collection_35', name: '高级图鉴',      emoji: '📗', desc: '合成图鉴解锁35种', category: 'merge', tier: 4,
      check: () => (state.gameCollection || []).length >= 35 },
    { id: 'merge_collection_50', name: '百科全书',      emoji: '📚', desc: '合成图鉴解锁50种', category: 'merge', tier: 4,
      check: () => (state.gameCollection || []).length >= 50 },
    { id: 'merge_collection_64', name: '全图鉴大师',    emoji: '🌈', desc: '合成图鉴全部解锁（64种）', category: 'merge', tier: 5,
      check: () => (state.gameCollection || []).length >= 64 },
    { id: 'merge_lv5',        name: '高阶炼金术',       emoji: '⚗️', desc: '合成出任意Lv5物品', category: 'merge', tier: 3,
      check: () => (state.gameCollection || []).some(k => k.endsWith('_5')) },
    { id: 'merge_lv7',        name: '大师锻造',         emoji: '🔨', desc: '合成出任意Lv7物品', category: 'merge', tier: 4,
      check: () => (state.gameCollection || []).some(k => k.endsWith('_7')) },
    { id: 'merge_max_level',  name: '传说锻造师',       emoji: '⚒️', desc: '合成出任意Lv8物品', category: 'merge', tier: 5,
      check: () => (state.gameCollection || []).some(k => k.endsWith('_8')) },
    { id: 'merge_all_chains_lv3', name: '八链均衡',     emoji: '⚖️', desc: '8条链各解锁到Lv3以上', category: 'merge', tier: 3,
      check: () => {
        const chains = ['toy', 'food', 'gem', 'potion', 'music', 'flower', 'star', 'seasoning'];
        return chains.every(chain => (state.gameCollection || []).includes(`${chain}_3`));
      }},
    { id: 'merge_seasoning_lv5', name: '调料链大师',    emoji: '🧂', desc: '调料链达到Lv5', category: 'merge', tier: 3,
      check: () => (state.gameCollection || []).includes('seasoning_5') },

    // ===================== 餐厅类 =====================
    { id: 'restaurant_open',  name: '开张大吉',         emoji: '🐱', desc: '餐厅声望达到1', category: 'restaurant', tier: 1,
      check: () => state.restaurantReputation >= 1 },
    { id: 'restaurant_lv2',   name: '温馨小店',         emoji: '🏠', desc: '餐厅升到Lv.2', category: 'restaurant', tier: 1,
      check: () => state.restaurantLevel >= 2 },
    { id: 'restaurant_lv3',   name: '特色餐厅',         emoji: '🏪', desc: '餐厅升到Lv.3', category: 'restaurant', tier: 2,
      check: () => state.restaurantLevel >= 3 },
    { id: 'restaurant_lv4',   name: '星级餐厅',         emoji: '🏨', desc: '餐厅升到Lv.4', category: 'restaurant', tier: 3,
      check: () => state.restaurantLevel >= 4 },
    { id: 'restaurant_lv5',   name: '猫界传奇',         emoji: '🏰', desc: '餐厅升到Lv.5', category: 'restaurant', tier: 3,
      check: () => state.restaurantLevel >= 5 },
    { id: 'restaurant_lv6',   name: '美食殿堂',         emoji: '🏛️', desc: '餐厅升到Lv.6', category: 'restaurant', tier: 4,
      check: () => state.restaurantLevel >= 6 },
    { id: 'restaurant_lv7',   name: '皇家御膳房',       emoji: '👑', desc: '餐厅升到Lv.7', category: 'restaurant', tier: 4,
      check: () => state.restaurantLevel >= 7 },
    { id: 'restaurant_lv8',   name: '世界名店',         emoji: '🌍', desc: '餐厅升到Lv.8', category: 'restaurant', tier: 4,
      check: () => state.restaurantLevel >= 8 },
    { id: 'restaurant_lv9',   name: '银河食府',         emoji: '🌌', desc: '餐厅升到Lv.9', category: 'restaurant', tier: 5,
      check: () => state.restaurantLevel >= 9 },
    { id: 'restaurant_lv10',  name: '传说·喵神殿',      emoji: '✨', desc: '餐厅升到Lv.10', category: 'restaurant', tier: 5,
      check: () => state.restaurantLevel >= 10 },
    { id: 'restaurant_serve_5', name: '开始营业',       emoji: '🙋', desc: '累计服务5位客人', category: 'restaurant', tier: 1,
      check: () => state.restaurantServedCount >= 5 },
    { id: 'restaurant_serve_10', name: '初级服务员',    emoji: '🍽️', desc: '累计服务10位客人', category: 'restaurant', tier: 2,
      check: () => state.restaurantServedCount >= 10 },
    { id: 'restaurant_serve_30', name: '熟练服务员',    emoji: '🎀', desc: '累计服务30位客人', category: 'restaurant', tier: 2,
      check: () => state.restaurantServedCount >= 30 },
    { id: 'restaurant_serve_50', name: '金牌服务',      emoji: '⭐', desc: '累计服务50位客人', category: 'restaurant', tier: 3,
      check: () => state.restaurantServedCount >= 50 },
    { id: 'restaurant_serve_100', name: '百客盈门',     emoji: '🎊', desc: '累计服务100位客人', category: 'restaurant', tier: 4,
      check: () => state.restaurantServedCount >= 100 },
    { id: 'restaurant_serve_200', name: '传说服务之神', emoji: '🌟', desc: '累计服务200位客人', category: 'restaurant', tier: 5,
      check: () => state.restaurantServedCount >= 200 },
    { id: 'restaurant_serve_500', name: '永不打烊',     emoji: '🏆', desc: '累计服务500位客人', category: 'restaurant', tier: 5,
      check: () => state.restaurantServedCount >= 500 },
    { id: 'restaurant_earn_100', name: '第一桶金',      emoji: '🪣', desc: '餐厅累计收入100金币', category: 'restaurant', tier: 2,
      check: () => state.restaurantTotalEarnings >= 100 },
    { id: 'restaurant_earn_500', name: '餐厅小赚',      emoji: '💵', desc: '餐厅累计收入500金币', category: 'restaurant', tier: 3,
      check: () => state.restaurantTotalEarnings >= 500 },
    { id: 'restaurant_earn_2000', name: '稳定盈利',     emoji: '📈', desc: '餐厅累计收入2000金币', category: 'restaurant', tier: 3,
      check: () => state.restaurantTotalEarnings >= 2000 },
    { id: 'restaurant_earn_5000', name: '餐饮大亨',     emoji: '🤑', desc: '餐厅累计收入5000金币', category: 'restaurant', tier: 4,
      check: () => state.restaurantTotalEarnings >= 5000 },
    { id: 'restaurant_earn_20000', name: '餐饮帝国',    emoji: '🏰', desc: '餐厅累计收入20000金币', category: 'restaurant', tier: 5,
      check: () => state.restaurantTotalEarnings >= 20000 },
    { id: 'restaurant_rep_50', name: '小有名气',        emoji: '📣', desc: '声望达到50', category: 'restaurant', tier: 2,
      check: () => state.restaurantReputation >= 50 },
    { id: 'restaurant_rep_100', name: '远近闻名',       emoji: '📰', desc: '声望达到100', category: 'restaurant', tier: 3,
      check: () => state.restaurantReputation >= 100 },
    { id: 'restaurant_rep_500', name: '猫界名厨',       emoji: '👨‍🍳', desc: '声望达到500', category: 'restaurant', tier: 5,
      check: () => state.restaurantReputation >= 500 },

    // ===================== 小游戏类 =====================
    { id: 'fridge_first',     name: '冰箱初体验',       emoji: '🧊', desc: '冰箱库存获得第一件食材', category: 'minigame', tier: 1,
      check: () => (state.fridgeInventory || []).filter(i => i.count > 0).length >= 1 },
    { id: 'fridge_stock_5',   name: '冰箱有货了',       emoji: '❄️', desc: '冰箱库存种类达到5种', category: 'minigame', tier: 2,
      check: () => (state.fridgeInventory || []).filter(i => i.count > 0).length >= 5 },
    { id: 'fridge_stock_10',  name: '食材丰富',         emoji: '🥗', desc: '冰箱库存种类达到10种', category: 'minigame', tier: 3,
      check: () => (state.fridgeInventory || []).filter(i => i.count > 0).length >= 10 },
    { id: 'fridge_stock_20',  name: '囤货达人',         emoji: '📦', desc: '冰箱库存种类达到20种', category: 'minigame', tier: 4,
      check: () => (state.fridgeInventory || []).filter(i => i.count > 0).length >= 20 },
    { id: 'fridge_total_50',  name: '仓储管理员',       emoji: '🏭', desc: '冰箱总件数达到50', category: 'minigame', tier: 4,
      check: () => (state.fridgeInventory || []).reduce((s, i) => s + i.count, 0) >= 50 },
    { id: 'tanghulu_first',   name: '糖葫芦学徒',       emoji: '🍢', desc: '完成第一串糖葫芦', category: 'minigame', tier: 1,
      check: () => (state.tanghuluInventory || []).filter(i => i.count > 0).length >= 1 },
    { id: 'tanghulu_5_types', name: '五味糖葫芦',       emoji: '🌈', desc: '糖葫芦库存种类达到5种', category: 'minigame', tier: 2,
      check: () => (state.tanghuluInventory || []).filter(i => i.count > 0).length >= 5 },
    { id: 'tanghulu_10_types', name: '糖葫芦大师',      emoji: '🍡', desc: '糖葫芦库存种类达到10种', category: 'minigame', tier: 3,
      check: () => (state.tanghuluInventory || []).filter(i => i.count > 0).length >= 10 },
    { id: 'tanghulu_crystal', name: '糖砂幸运儿',       emoji: '✨', desc: '获得第一颗完美糖砂', category: 'minigame', tier: 2,
      check: () => (state.tanghuluSugarCrystal || 0) >= 1 },
    { id: 'tanghulu_crystal_3', name: '糖砂收藏',       emoji: '💫', desc: '累计获得3颗完美糖砂', category: 'minigame', tier: 3,
      check: () => (state.tanghuluSugarCrystal || 0) >= 3 },
    { id: 'tanghulu_crystal_5', name: '糖砂收藏家',     emoji: '💎', desc: '累计获得5颗完美糖砂', category: 'minigame', tier: 4,
      check: () => (state.tanghuluSugarCrystal || 0) >= 5 },
    { id: 'tanghulu_crystal_10', name: '糖砂之王',      emoji: '👑', desc: '累计获得10颗完美糖砂', category: 'minigame', tier: 5,
      check: () => (state.tanghuluSugarCrystal || 0) >= 10 },
    { id: 'match3_prop_use',  name: '消消看道具初体验', emoji: '🃏', desc: '消消看道具背包曾有过道具', category: 'minigame', tier: 1,
      check: () => {
        const inv = state.match3Inventory || {};
        return (inv.expand || 0) + (inv.sweep || 0) + (inv.shuffle || 0) > 0 ||
               (state.match3ItemPurchaseLog && Object.keys(state.match3ItemPurchaseLog).length > 0);
      }},
    { id: 'link_prop_use',    name: '连连看道具收集',   emoji: '🔗', desc: '连连看道具背包曾有过道具', category: 'minigame', tier: 1,
      check: () => {
        const inv = state.linkInventory || {};
        return (inv.hint || 0) + (inv.shuffle || 0) + (inv.bomb || 0) + (inv.compass || 0) > 0 ||
               (state.linkItemPurchaseLog && Object.keys(state.linkItemPurchaseLog).length > 0);
      }},
    { id: 'shelf_eliminate_5', name: '货架消除新手',    emoji: '🛒', desc: '单局货架消除5组以上', category: 'minigame', tier: 2,
      check: () => shelfState.eliminatedGroups >= 5 },

    // ===================== 收集类 =====================
    { id: 'all_food_items',   name: '美食收藏家',       emoji: '🎒', desc: '工坊背包同时拥有3种以上食物', category: 'collect', tier: 2,
      check: () => (state.gameInventory || []).filter(i => i.category === 'food' && i.count > 0).length >= 3 },
    { id: 'all_clean_items',  name: '清洁大师',         emoji: '🧴', desc: '工坊背包同时拥有3种以上洗护', category: 'collect', tier: 2,
      check: () => (state.gameInventory || []).filter(i => i.category === 'clean' && i.count > 0).length >= 3 },
    { id: 'all_energy_items', name: '睡眠专家',         emoji: '🛏️', desc: '工坊背包同时拥有3种以上睡眠道具', category: 'collect', tier: 2,
      check: () => (state.gameInventory || []).filter(i => i.category === 'energy' && i.count > 0).length >= 3 },
    { id: 'seasoning_3',      name: '调料入门',         emoji: '🫙', desc: '同时拥有3种调料', category: 'collect', tier: 2,
      check: () => Object.values(state.restaurantSeasonings || {}).filter(v => v > 0).length >= 3 },
    { id: 'seasoning_6',      name: '调料达人',         emoji: '🧂', desc: '同时拥有6种调料', category: 'collect', tier: 3,
      check: () => Object.values(state.restaurantSeasonings || {}).filter(v => v > 0).length >= 6 },
    { id: 'seasoning_10',     name: '调料大师',         emoji: '✨', desc: '同时拥有10种以上调料', category: 'collect', tier: 4,
      check: () => Object.values(state.restaurantSeasonings || {}).filter(v => v > 0).length >= 10 },
    { id: 'emoji_3',          name: '表情包初收集',     emoji: '😸', desc: '上传3个表情包', category: 'collect', tier: 1,
      check: () => (settings.emojiStickers || []).length >= 3 },
    { id: 'emoji_5',          name: '表情包达人',       emoji: '😺', desc: '上传5个表情包', category: 'collect', tier: 2,
      check: () => (settings.emojiStickers || []).length >= 5 },
    { id: 'emoji_10',         name: '表情包狂热',       emoji: '🤪', desc: '上传10个表情包', category: 'collect', tier: 3,
      check: () => (settings.emojiStickers || []).length >= 10 },
    { id: 'custom_sprite',    name: '形象设计师',       emoji: '🎨', desc: '上传了桌宠闲置精灵图', category: 'collect', tier: 1,
      check: () => !!settings.spriteIdle },
    { id: 'custom_sprites_3', name: '动作导演',         emoji: '🎬', desc: '添加3个以上自定义动作', category: 'collect', tier: 2,
      check: () => (settings.customSprites || []).filter(s => s.image).length >= 3 },
    { id: 'custom_sprites_5', name: '动画大师',         emoji: '🎞️', desc: '添加5个以上自定义动作', category: 'collect', tier: 3,
      check: () => (settings.customSprites || []).filter(s => s.image).length >= 5 },
    { id: 'game_images_5',    name: '图鉴美化师',       emoji: '📷', desc: '上传5张游戏自定义图片', category: 'collect', tier: 2,
      check: () => Object.keys(state.gameCustomImages || {}).length >= 5 },
    { id: 'game_images_20',   name: '视觉艺术家',       emoji: '🖼️', desc: '上传20张游戏自定义图片', category: 'collect', tier: 3,
      check: () => Object.keys(state.gameCustomImages || {}).length >= 20 },
    { id: 'stamina_item_use', name: '能量充沛',         emoji: '⚡', desc: '体力道具背包曾有过道具', category: 'collect', tier: 1,
      check: () => {
        const inv = state.gameStaminaInventory || {};
        return (inv.stamina30 || 0) + (inv.stamina50 || 0) + (inv.stamina100 || 0) > 0;
      }},
    { id: 'profile_saved',    name: '存档管理者',       emoji: '💾', desc: '保存过至少1个桌宠存档', category: 'collect', tier: 1,
      check: () => (settings.petProfiles || []).length >= 1 },
    { id: 'profile_3',        name: '多宠家庭',         emoji: '🐾', desc: '保存过3个以上桌宠存档', category: 'collect', tier: 3,
      check: () => (settings.petProfiles || []).length >= 3 },

    // ===================== 状态/隐藏类 =====================
    { id: 'happy_always',     name: '快乐源泉',         emoji: '😊', desc: '三项状态同时超过90%', category: 'special', tier: 2,
      check: () => state.hunger >= 90 && state.cleanliness >= 90 && state.energy >= 90 },
    { id: 'full_status',      name: '满溢幸福',         emoji: '🌟', desc: '三项状态全部100%', category: 'special', tier: 3,
      check: () => state.hunger >= 100 && state.cleanliness >= 100 && state.energy >= 100 },
    { id: 'low_danger',       name: '危险边缘',         emoji: '⚠️', desc: '任意状态低于15%', category: 'special', tier: 1,
      check: () => state.hunger < 15 || state.cleanliness < 15 || state.energy < 15 },
    { id: 'all_low',          name: '绝境求生',         emoji: '💀', desc: '三项状态同时低于20%', category: 'special', tier: 2,
      check: () => state.hunger < 20 && state.cleanliness < 20 && state.energy < 20 },
    { id: 'night_owl',        name: '深夜猫奴',         emoji: '🌙', desc: '在凌晨2-5点和桌宠聊天', category: 'special', tier: 2,
      check: () => {
        const hour = new Date().getHours();
        return hour >= 2 && hour < 5 && state.petChatHistory.length > 0;
      }},
    { id: 'early_bird',       name: '早起的喵',         emoji: '🌅', desc: '在早晨5-7点和桌宠互动', category: 'special', tier: 2,
      check: () => {
        const hour = new Date().getHours();
        return hour >= 5 && hour < 7 && state.totalInteractions > 0;
      }},
    { id: 'weekend_warrior',  name: '周末战士',         emoji: '🎉', desc: '在周末和桌宠聊天超过10条', category: 'special', tier: 1,
      check: () => {
        const day = new Date().getDay();
        return (day === 0 || day === 6) && state.petChatHistory.length >= 10;
      }},
    { id: 'offline_mode_used', name: '线下约会',        emoji: '🌙', desc: '使用过线下模式和桌宠互动', category: 'special', tier: 1,
      check: () => state.isOfflineMode === true || state.petChatHistory.some(m => m.content && m.content.includes('[线下]')) },
    { id: 'pet_named',        name: '取个好名字',       emoji: '🏷️', desc: '给桌宠起了自定义名字', category: 'special', tier: 1,
      check: () => settings.petName && settings.petName !== '咪噗' && settings.petName.trim().length > 0 },
    { id: 'theme_changed',    name: '换个主题',         emoji: '🎨', desc: '使用过非默认主题', category: 'special', tier: 1,
      check: () => settings.currentTheme && settings.currentTheme !== 'default' },
    { id: 'all_games_played', name: '全能玩家',         emoji: '🎮', desc: '合成/冰箱/糖葫芦都玩过至少一次', category: 'special', tier: 3,
      check: () => {
        const hasCollection = (state.gameCollection || []).length >= 1;
        const hasFridge = (state.fridgeInventory || []).filter(i => i.count > 0).length >= 1;
        const hasTanghulu = (state.tanghuluInventory || []).filter(i => i.count > 0).length >= 1;
        return hasCollection && hasFridge && hasTanghulu;
      }},
    { id: 'all_6_games',      name: '六边形玩家',       emoji: '🌐', desc: '所有6种小游戏都体验过', category: 'special', tier: 4,
      check: () => {
        const hasCollection = (state.gameCollection || []).length >= 1;
        const hasFridge = (state.fridgeInventory || []).filter(i => i.count > 0).length >= 1;
        const hasTanghulu = (state.tanghuluInventory || []).filter(i => i.count > 0).length >= 1;
        const hasMatch3 = (state.match3ItemPurchaseLog && Object.keys(state.match3ItemPurchaseLog).length > 0) || (state.match3Inventory && Object.values(state.match3Inventory).some(v => v > 0));
        const hasLink = (state.linkItemPurchaseLog && Object.keys(state.linkItemPurchaseLog).length > 0) || (state.linkInventory && Object.values(state.linkInventory).some(v => v > 0));
        const hasShelf = (state.shelfPropInventory && Object.values(state.shelfPropInventory).some(v => v > 0)) || (state.shelfPropShopLog && Object.keys(state.shelfPropShopLog).length > 0);
        return hasCollection && hasFridge && hasTanghulu && (hasMatch3 || hasLink || hasShelf);
      }},
    { id: 'stamina_max',      name: '精力充沛',         emoji: '💪', desc: '体力恢复到满值', category: 'special', tier: 1,
      check: () => state.gameStamina >= state.gameStaminaMax },
    { id: 'first_lottery',    name: '手气不错',         emoji: '🎰', desc: '第一次使用抽奖', category: 'special', tier: 1,
      check: () => {
        const log = state.lotteryLog || {};
        return Object.values(log).some(day => Object.values(day).some(v => v > 0));
      }},
    { id: 'lottery_10_total', name: '抽奖常客',         emoji: '🎲', desc: '累计抽奖10次', category: 'special', tier: 2,
      check: () => {
        const log = state.lotteryLog || {};
        let total = 0;
        Object.values(log).forEach(day => { Object.values(day).forEach(v => { total += v; }); });
        return total >= 10;
      }},
    { id: 'lottery_50_total', name: '欧皇之路',         emoji: '🍀', desc: '累计抽奖50次', category: 'special', tier: 3,
      check: () => {
        const log = state.lotteryLog || {};
        let total = 0;
        Object.values(log).forEach(day => { Object.values(day).forEach(v => { total += v; }); });
        return total >= 50;
      }},
    { id: 'drag_pet',         name: '拎起来看看',       emoji: '✋', desc: '拖拽过桌宠', category: 'special', tier: 1,
      check: () => state.totalInteractions >= 1 },
    { id: 'relationship_set', name: '定义关系',         emoji: '💞', desc: '填写了与主人的关系描述', category: 'special', tier: 2,
      check: () => !!settings.relationshipPrompt && settings.relationshipPrompt.trim().length > 10 },
    { id: 'persona_set',      name: '主人人设',         emoji: '👤', desc: '填写了用户人设', category: 'special', tier: 2,
      check: () => (settings.userPersonaSource === 'manual' && settings.userPersonaText && settings.userPersonaText.trim().length > 10) || settings.userPersonaSource === 'card' },
    { id: 'worldbook_linked', name: '世界观构建者',     emoji: '🌍', desc: '关联了世界书', category: 'special', tier: 2,
      check: () => !!settings.worldBookId && settings.worldBookId.trim().length > 0 },
    { id: 'character_linked', name: '角色卡关联',       emoji: '🎭', desc: '关联了角色卡', category: 'special', tier: 1,
      check: () => !!settings.characterId && settings.characterId.trim().length > 0 },

    // ===================== 里程碑/隐藏成就 =====================
    { id: 'day_1',            name: '第一天',           emoji: '🌱', desc: '开始使用桌宠插件', category: 'milestone', tier: 1,
      check: () => true },
    { id: 'played_7_days',    name: '一周陪伴',         emoji: '📆', desc: '桌宠数据存在超过7天', category: 'milestone', tier: 2,
      check: () => {
        const firstChat = state.petChatHistory[0];
        if (!firstChat || !firstChat.timestamp) return false;
        return Date.now() - firstChat.timestamp >= 7 * 24 * 60 * 60 * 1000;
      }},
    { id: 'played_30_days',   name: '一月相守',         emoji: '🗓️', desc: '桌宠数据存在超过30天', category: 'milestone', tier: 3,
      check: () => {
        const firstChat = state.petChatHistory[0];
        if (!firstChat || !firstChat.timestamp) return false;
        return Date.now() - firstChat.timestamp >= 30 * 24 * 60 * 60 * 1000;
      }},
    { id: 'played_100_days',  name: '百日之约',         emoji: '💐', desc: '桌宠数据存在超过100天', category: 'milestone', tier: 4,
      check: () => {
        const firstChat = state.petChatHistory[0];
        if (!firstChat || !firstChat.timestamp) return false;
        return Date.now() - firstChat.timestamp >= 100 * 24 * 60 * 60 * 1000;
      }},
    { id: 'played_365_days',  name: '一年之恋',         emoji: '💍', desc: '桌宠数据存在超过365天', category: 'milestone', tier: 5,
      check: () => {
        const firstChat = state.petChatHistory[0];
        if (!firstChat || !firstChat.timestamp) return false;
        return Date.now() - firstChat.timestamp >= 365 * 24 * 60 * 60 * 1000;
      }},
    { id: 'total_1000_actions', name: '千次羁绊',       emoji: '🔗', desc: '总互动+聊天+日记超过1000次', category: 'milestone', tier: 5,
      check: () => state.totalInteractions + state.petChatHistory.length + (state.diaryEntries || []).length >= 1000 },
    { id: 'rich_and_full',    name: '人生赢家',         emoji: '🏅', desc: '金币>1000 且三项状态>80% 且餐厅Lv5+', category: 'milestone', tier: 4,
      check: () => state.gameGold >= 1000 && state.hunger >= 80 && state.cleanliness >= 80 && state.energy >= 80 && state.restaurantLevel >= 5 },
    { id: 'completionist_50', name: '半数成就',         emoji: '🥈', desc: '解锁50%以上成就', category: 'milestone', tier: 3,
      check: () => (state.achievements || []).length >= Math.floor(ACHIEVEMENTS.length * 0.5) },
    { id: 'completionist_80', name: '成就猎人',         emoji: '🥇', desc: '解锁80%以上成就', category: 'milestone', tier: 4,
      check: () => (state.achievements || []).length >= Math.floor(ACHIEVEMENTS.length * 0.8) },
    { id: 'completionist_100', name: '传说·全成就大师', emoji: '🏆', desc: '解锁全部成就', category: 'milestone', tier: 5,
      check: () => (state.achievements || []).length >= ACHIEVEMENTS.length - 1 },
    // ===================== 新增：互动深度 =====================
    { id: 'feed_1000',        name: '万宠集于一身',     emoji: '🌹', desc: '累计互动1000次', category: 'interact', tier: 5,
      check: () => state.totalInteractions >= 1000 },
    { id: 'chat_1000',        name: '万语千言',         emoji: '💌', desc: '累计聊天1000条', category: 'interact', tier: 5,
      check: () => state.petChatHistory.length >= 1000 },
    { id: 'archive_3',        name: '记忆归档人',       emoji: '📚', desc: '产生过3批聊天归档', category: 'interact', tier: 2,
      check: () => (state.petChatArchive || []).length >= 3 },
    { id: 'archive_10',       name: '编年史学家',       emoji: '🏛️', desc: '产生过10批聊天归档', category: 'interact', tier: 4,
      check: () => (state.petChatArchive || []).length >= 10 },

    // ===================== 新增：经济进阶 =====================
    { id: 'gold_100000',      name: '猫界央行行长',     emoji: '🏦', desc: '拥有100000金币', category: 'economy', tier: 5,
      check: () => state.gameGold >= 100000 },
    { id: 'spend_big',        name: '挥金如土',         emoji: '💸', desc: '单次购买道具花费80金币以上', category: 'economy', tier: 2,
      check: () => {
        const inv = state.gameInventory || [];
        return inv.some(i => {
          const items = GAME_SHOP_ITEMS[i.category];
          return items && items[i.idx] && items[i.idx].price >= 80;
        });
      }},

    // ===================== 新增：合成工坊进阶 =====================
    { id: 'merge_all_chains_lv5', name: '八链精通',     emoji: '🔥', desc: '8条链各解锁到Lv5以上', category: 'merge', tier: 4,
      check: () => {
        const chains = ['toy', 'food', 'gem', 'potion', 'music', 'flower', 'star', 'seasoning'];
        return chains.every(chain => (state.gameCollection || []).includes(`${chain}_5`));
      }},
    { id: 'merge_all_chains_lv8', name: '传说·八链至尊', emoji: '🌌', desc: '8条链全部达到Lv8', category: 'merge', tier: 5,
      check: () => {
        const chains = ['toy', 'food', 'gem', 'potion', 'music', 'flower', 'star', 'seasoning'];
        return chains.every(chain => (state.gameCollection || []).includes(`${chain}_8`));
      }},
    { id: 'merge_board_full',  name: '棋盘爆满',       emoji: '🧩', desc: '棋盘46格全部有物品（不含生成器和售卖区）', category: 'merge', tier: 3,
      check: () => {
        if (!state.gameBoard || state.gameBoard.length !== 48) return false;
        let filled = 0;
        for (let i = 0; i < 48; i++) {
          if (i === state.gameGeneratorPos || i === state.gameSellPos) continue;
          if (state.gameBoard[i]) filled++;
        }
        return filled >= 46;
      }},

    // ===================== 新增：餐厅进阶 =====================
    { id: 'restaurant_earn_50000', name: '餐饮传说',    emoji: '💫', desc: '餐厅累计收入50000金币', category: 'restaurant', tier: 5,
      check: () => state.restaurantTotalEarnings >= 50000 },
    { id: 'restaurant_rep_200', name: '全城热议',       emoji: '📺', desc: '声望达到200', category: 'restaurant', tier: 3,
      check: () => state.restaurantReputation >= 200 },
    { id: 'restaurant_rep_300', name: '传奇名厨',       emoji: '🔪', desc: '声望达到300', category: 'restaurant', tier: 4,
      check: () => state.restaurantReputation >= 300 },
    { id: 'restaurant_rep_1000', name: '喵星米其林',    emoji: '⭐', desc: '声望达到1000', category: 'restaurant', tier: 5,
      check: () => state.restaurantReputation >= 1000 },

    // ===================== 新增：小游戏进阶 =====================
    { id: 'fridge_total_100',  name: '冰箱仓库管理员', emoji: '🏭', desc: '冰箱总件数达到100', category: 'minigame', tier: 5,
      check: () => (state.fridgeInventory || []).reduce((s, i) => s + i.count, 0) >= 100 },
    { id: 'tanghulu_all_types', name: '糖葫芦全家福',  emoji: '🍢', desc: '糖葫芦库存种类达到15种', category: 'minigame', tier: 5,
      check: () => (state.tanghuluInventory || []).filter(i => i.count > 0).length >= 15 },
    { id: 'tanghulu_total_30', name: '糖葫芦批发商',   emoji: '🏪', desc: '糖葫芦库存总数达到30串', category: 'minigame', tier: 4,
      check: () => (state.tanghuluInventory || []).reduce((s, i) => s + i.count, 0) >= 30 },

    // ===================== 新增：收集进阶 =====================
    { id: 'emoji_20',          name: '表情包仓库',     emoji: '📦', desc: '上传20个表情包', category: 'collect', tier: 4,
      check: () => (settings.emojiStickers || []).length >= 20 },
    { id: 'custom_sprites_10', name: '首席动画师',     emoji: '🎥', desc: '添加10个以上自定义动作', category: 'collect', tier: 4,
      check: () => (settings.customSprites || []).filter(s => s.image).length >= 10 },
    { id: 'game_images_50',    name: '像素艺术大师',   emoji: '🎨', desc: '上传50张游戏自定义图片', category: 'collect', tier: 4,
      check: () => Object.keys(state.gameCustomImages || {}).length >= 50 },
    { id: 'all_mood_images',   name: '表情全套',       emoji: '😊', desc: '6种心情图标全部自定义', category: 'collect', tier: 3,
      check: () => {
        const moods = ['happy', 'neutral', 'sad', 'sleepy', 'hungry', 'dirty'];
        return moods.every(m => settings.moodImages && settings.moodImages[m]);
      }},
    { id: 'all_menu_icons',    name: '菜单全定制',     emoji: '🎯', desc: '8个菜单按钮全部自定义图标', category: 'collect', tier: 3,
      check: () => {
        const actions = ['feed', 'bath', 'sleep', 'chat', 'diary', 'game', 'house', 'settings'];
        return actions.every(a => settings.menuIcons && settings.menuIcons[a]);
      }},
    { id: 'house_full_setup',  name: '小屋装修完成',   emoji: '🏠', desc: '小屋背景+立绘+头像全部设置', category: 'collect', tier: 2,
      check: () => !!settings.houseBackground && !!settings.houseCharacter && !!settings.houseCharacterAvatar },
    { id: 'house_expressions_3', name: '表情立绘收藏', emoji: '🎭', desc: '设置3个以上小屋表情立绘', category: 'collect', tier: 2,
      check: () => (settings.houseExpressions || []).filter(e => e.image && e.keywords).length >= 3 },
    { id: 'house_expressions_8', name: '千面演员',     emoji: '🎪', desc: '设置8个以上小屋表情立绘', category: 'collect', tier: 4,
      check: () => (settings.houseExpressions || []).filter(e => e.image && e.keywords).length >= 8 },

    // ===================== 新增：特殊/隐藏 =====================
    { id: 'seasoning_all',     name: '万味俱全',       emoji: '🫙', desc: '同时拥有全部14种调料', category: 'special', tier: 5,
      check: () => Object.values(state.restaurantSeasonings || {}).filter(v => v > 0).length >= 14 },
    { id: 'midnight_gamer',    name: '深夜肝帝',       emoji: '🦉', desc: '在凌晨0-3点玩小游戏（有游戏数据变动）', category: 'special', tier: 2,
      check: () => {
        const hour = new Date().getHours();
        return hour >= 0 && hour < 3 && (state.gameCollection || []).length > 0;
      }},
    { id: 'jailbreak_set',    name: '自由的猫',       emoji: '🔓', desc: '设置了破限提示词', category: 'special', tier: 1,
      check: () => !!settings.jailbreak && settings.jailbreak.trim().length > 5 },
    { id: 'vision_enabled',   name: '火眼金睛',       emoji: '👁️', desc: '开启了视觉识别功能', category: 'special', tier: 1,
      check: () => settings.enableVision === true },
    { id: 'streaming_enabled', name: '流光溢彩',      emoji: '✨', desc: '开启了流式输出', category: 'special', tier: 1,
      check: () => settings.enableStreaming === true },
    { id: 'time_awareness',   name: '时间掌控者',     emoji: '⏰', desc: '开启了时间感知', category: 'special', tier: 1,
      check: () => settings.enableTimeAwareness === true },
    { id: 'max_activity',     name: '话痨模式',       emoji: '📣', desc: '活跃度设为100%', category: 'special', tier: 1,
      check: () => settings.activityLevel >= 100 },
    { id: 'zero_activity',    name: '禅定模式',       emoji: '🧘', desc: '活跃度设为0%', category: 'special', tier: 1,
      check: () => settings.activityLevel <= 0 },
    { id: 'scale_tiny',       name: '迷你宠物',       emoji: '🔬', desc: '桌宠缩放设为0.5x', category: 'special', tier: 1,
      check: () => settings.petScale <= 0.5 },
    { id: 'scale_giant',      name: '巨型桌宠',       emoji: '🦕', desc: '桌宠缩放设为2.0x', category: 'special', tier: 1,
      check: () => settings.petScale >= 2.0 },
    { id: 'inventory_rich',   name: '道具满仓',       emoji: '🎁', desc: '工坊背包同时拥有10种以上道具', category: 'special', tier: 3,
      check: () => (state.gameInventory || []).filter(i => i.count > 0).length >= 10 },
    { id: 'cooked_5_types',   name: '五菜齐全',       emoji: '🍳', desc: '出餐台同时有5种以上菜品', category: 'special', tier: 3,
      check: () => (state.restaurantCookedDishes || []).filter(d => d.count > 0).length >= 5 },
    { id: 'cooked_10_types',  name: '满汉全席',       emoji: '🍽️', desc: '出餐台同时有10种以上菜品', category: 'special', tier: 4,
      check: () => (state.restaurantCookedDishes || []).filter(d => d.count > 0).length >= 10 },

    // ===================== 新增：里程碑 =====================
    { id: 'total_500_actions', name: '五百里程碑',     emoji: '🚩', desc: '总互动+聊天+日记超过500次', category: 'milestone', tier: 3,
      check: () => state.totalInteractions + state.petChatHistory.length + (state.diaryEntries || []).length >= 500 },
    { id: 'total_2000_actions', name: '两千之约',      emoji: '💎', desc: '总互动+聊天+日记超过2000次', category: 'milestone', tier: 5,
      check: () => state.totalInteractions + state.petChatHistory.length + (state.diaryEntries || []).length >= 2000 },
    { id: 'played_180_days',  name: '半年之恋',       emoji: '💖', desc: '桌宠数据存在超过180天', category: 'milestone', tier: 4,
      check: () => {
        const firstChat = state.petChatHistory[0];
        if (!firstChat || !firstChat.timestamp) return false;
        return Date.now() - firstChat.timestamp >= 180 * 24 * 60 * 60 * 1000;
      }},
    { id: 'master_of_all',    name: '全能大师',       emoji: '🌟', desc: '餐厅Lv8+ 且 图鉴50+ 且 金币5000+', category: 'milestone', tier: 5,
      check: () => state.restaurantLevel >= 8 && (state.gameCollection || []).length >= 50 && state.gameGold >= 5000 },
    // ===================== 新增：互动细节 =====================
    { id: 'feed_bath_sleep_same_day', name: '完美照料',       emoji: '🌺', desc: '同一天内投喂、洗澡、睡觉各至少一次', category: 'interact', tier: 2,
      check: () => {
        const today = new Date().toDateString();
        const fedToday = state.lastFed && new Date(state.lastFed).toDateString() === today;
        const bathedToday = state.lastBathed && new Date(state.lastBathed).toDateString() === today;
        const sleptToday = state.lastSlept && new Date(state.lastSlept).toDateString() === today;
        return fedToday && bathedToday && sleptToday;
      }},
    { id: 'status_all_max',       name: '满满当当',           emoji: '💯', desc: '三项状态同时达到100%', category: 'interact', tier: 3,
      check: () => state.hunger >= 100 && state.cleanliness >= 100 && state.energy >= 100 },
    { id: 'drag_10',              name: '爱捏捏',             emoji: '🤏', desc: '累计互动达到10次（代指拖拽玩耍）', category: 'interact', tier: 1,
      check: () => state.totalInteractions >= 10 },
    { id: 'chat_with_emoji',      name: '表情包达人',         emoji: '🖼️', desc: '发送过带图片的表情包消息', category: 'interact', tier: 1,
      check: () => state.petChatHistory.some(m => m.image) },
    { id: 'chat_long_session',    name: '马拉松聊天',         emoji: '🎙️', desc: '单次会话连续聊天超过20条', category: 'interact', tier: 2,
      check: () => {
        if (state.petChatHistory.length < 20) return false;
        const recent = state.petChatHistory.slice(-20);
        if (!recent[0].timestamp || !recent[19].timestamp) return false;
        const span = recent[19].timestamp - recent[0].timestamp;
        return span < 2 * 60 * 60 * 1000; // 2小时内连续20条
      }},
    { id: 'offline_long',         name: '久别重逢',           emoji: '🌅', desc: '离线超过24小时后回来', category: 'interact', tier: 2,
      check: () => {
        const now = Date.now();
        return (now - (state.lastOnlineTimestamp || now)) > 24 * 60 * 60 * 1000;
      }},
    { id: 'offline_week',         name: '一周之别',           emoji: '🗺️', desc: '离线超过7天后回来', category: 'interact', tier: 3,
      check: () => {
        const now = Date.now();
        return (now - (state.lastOnlineTimestamp || now)) > 7 * 24 * 60 * 60 * 1000;
      }},
    { id: 'memory_starred_5',     name: '心中珍藏',           emoji: '⭐', desc: '拥有5条5星记忆', category: 'interact', tier: 3,
      check: () => state.memories.filter(m => (typeof m === 'object' ? m.importance : 3) >= 5).length >= 5 },
    { id: 'summary_3_times',      name: '勤于整理',           emoji: '🗂️', desc: '进行过3次以上对话总结', category: 'interact', tier: 2,
      check: () => (state.petChatArchive || []).length >= 3 },
    { id: 'diary_streak_3',       name: '三日坚持',           emoji: '📅', desc: '连续3天都写了日记', category: 'interact', tier: 2,
      check: () => {
        const entries = state.diaryEntries || [];
        if (entries.length < 3) return false;
        const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
        for (let i = 0; i < sorted.length - 2; i++) {
          const d1 = new Date(sorted[i].date);
          const d2 = new Date(sorted[i+1].date);
          const d3 = new Date(sorted[i+2].date);
          const diff1 = (d1 - d2) / 86400000;
          const diff2 = (d2 - d3) / 86400000;
          if (Math.round(diff1) === 1 && Math.round(diff2) === 1) return true;
        }
        return false;
      }},
    { id: 'diary_streak_7',       name: '七日连载',           emoji: '🗒️', desc: '连续7天都写了日记', category: 'interact', tier: 3,
      check: () => {
        const entries = state.diaryEntries || [];
        if (entries.length < 7) return false;
        const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
        let streak = 1;
        for (let i = 0; i < sorted.length - 1; i++) {
          const d1 = new Date(sorted[i].date);
          const d2 = new Date(sorted[i+1].date);
          if (Math.round((d1 - d2) / 86400000) === 1) {
            streak++;
            if (streak >= 7) return true;
          } else {
            streak = 1;
          }
        }
        return false;
      }},
    { id: 'use_offline_mode',     name: '线下约会',           emoji: '🌿', desc: '开启过线下模式聊天', category: 'interact', tier: 1,
      check: () => state.petChatHistory.some(m => m.role === 'assistant' && m.content && m.content.length > 0) && isOfflineMode },

    // ===================== 新增：经济进阶 =====================
    { id: 'gold_zero',            name: '一贫如洗',           emoji: '🪣', desc: '金币归零（破产体验）', category: 'economy', tier: 1,
      check: () => state.gameGold === 0 },
    { id: 'earn_100_once',        name: '今日暴富',           emoji: '💹', desc: '今日餐厅收入超过100金币', category: 'economy', tier: 2,
      check: () => state.restaurantTodayEarnings >= 100 },
    { id: 'earn_500_once',        name: '今日大赚',           emoji: '📊', desc: '今日餐厅收入超过500金币', category: 'economy', tier: 3,
      check: () => state.restaurantTodayEarnings >= 500 },
    { id: 'lottery_jackpot',      name: '欧皇附体',           emoji: '🍀', desc: '单次抽奖获得Lv5以上棋盘物品', category: 'economy', tier: 3,
      check: () => {
        const log = state.lotteryLog || {};
        return Object.keys(log).length > 0 && (state.gameCollection || []).some(k => k.endsWith('_5') || k.endsWith('_6') || k.endsWith('_7') || k.endsWith('_8'));
      }},
    { id: 'buy_premium_item',     name: '出手阔绰',           emoji: '💳', desc: '购买过满汉全席/SPA/梦境胶囊等高级道具', category: 'economy', tier: 2,
      check: () => {
        const inv = state.gameInventory || [];
        return inv.some(i => i.idx >= 3 && i.category === 'food') ||
               inv.some(i => i.idx >= 3 && i.category === 'clean') ||
               inv.some(i => i.idx >= 3 && i.category === 'energy');
      }},
    { id: 'stamina_100_item',     name: '元气满满',           emoji: '🪫', desc: '购买过满能量桶', category: 'economy', tier: 2,
      check: () => (state.gameStaminaShopLog && Object.values(state.gameStaminaShopLog).some(day => day['stamina100'] > 0)) },

    // ===================== 新增：合成工坊进阶 =====================
    { id: 'merge_seasoning_all',  name: '调料全收集',         emoji: '🫙', desc: '调料链8个等级全部解锁', category: 'merge', tier: 4,
      check: () => [1,2,3,4,5,6,7,8].every(l => (state.gameCollection || []).includes(`seasoning_${l}`)) },
    { id: 'merge_stamina_lv5',    name: '体力链达人',         emoji: '⚡', desc: '体力链达到Lv5', category: 'merge', tier: 3,
      check: () => (state.gameCollection || []).includes('stamina_5') },
    { id: 'merge_stamina_lv8',    name: '永动机',             emoji: '♾️', desc: '体力链达到最高Lv8', category: 'merge', tier: 5,
      check: () => (state.gameCollection || []).includes('stamina_8') },
    { id: 'merge_order_10',       name: '订单狂人',           emoji: '📋', desc: '累计完成10个订单（通过订单完成触发合成）', category: 'merge', tier: 2,
      check: () => (state.gameGold || 0) >= 100 && (state.gameCollection || []).length >= 5 },
    { id: 'merge_sell_lv8',       name: '传说出售',           emoji: '💰', desc: '售出过任意Lv8物品', category: 'merge', tier: 5,
      check: () => (state.gameCollection || []).some(k => k.endsWith('_8')) && state.gameGold > 0 },
    { id: 'merge_all_chains_lv1', name: '百链初生',           emoji: '🌱', desc: '9条链（含体力链）各有至少Lv1', category: 'merge', tier: 1,
      check: () => {
        const chains = ['toy','food','gem','potion','music','flower','star','seasoning','stamina'];
        return chains.every(c => (state.gameCollection || []).includes(`${c}_1`));
      }},
    { id: 'merge_board_50_items', name: '棋盘收藏家',         emoji: '🎲', desc: '图鉴解锁数量达到45种', category: 'merge', tier: 3,
      check: () => (state.gameCollection || []).length >= 45 },

    // ===================== 新增：餐厅细节 =====================
    { id: 'restaurant_vip',       name: 'VIP贵宾',           emoji: '👑', desc: '接待过猫国国王或猫之神客人', category: 'restaurant', tier: 4,
      check: () => state.restaurantServedCount >= 20 && state.restaurantReputation >= 50 },
    { id: 'restaurant_no_timeout','name': '零超时',           emoji: '⏱️', desc: '声望达到30（代表服务流畅从未超时）', category: 'restaurant', tier: 2,
      check: () => state.restaurantReputation >= 30 },
    { id: 'restaurant_dessert_5', name: '甜品专家',           emoji: '🍰', desc: '用糖葫芦/甜品上菜累计5次', category: 'restaurant', tier: 2,
      check: () => (state.tanghuluInventory || []).reduce((s,i) => s + i.count, 0) === 0 && state.restaurantServedCount >= 5 },
    { id: 'restaurant_all_season','name': '调料收藏家',       emoji: '🧂', desc: '同时拥有8种以上调料', category: 'restaurant', tier: 3,
      check: () => Object.values(state.restaurantSeasonings || {}).filter(v => v > 0).length >= 8 },
    { id: 'restaurant_cook_10',   name: '厨艺精进',           emoji: '👨‍🍳', desc: '出餐台曾同时有过3种以上菜品', category: 'restaurant', tier: 2,
      check: () => (state.restaurantCookedDishes || []).filter(d => d.count > 0).length >= 3 },
    { id: 'restaurant_feed_pet_5','name': '厨师的爱',         emoji: '🍖', desc: '用出餐台菜品投喂桌宠5次以上', category: 'restaurant', tier: 2,
      check: () => state.totalInteractions >= 5 && (state.restaurantCookedDishes || []).length >= 0 && state.hunger >= 80 },
    { id: 'restaurant_rep_2500',  name: '传说米其林',         emoji: '🌟', desc: '声望达到2500，解锁传说喵神殿', category: 'restaurant', tier: 5,
      check: () => state.restaurantReputation >= 2500 },
    { id: 'restaurant_grocery_all','name':'蔬菜大全',         emoji: '🥬', desc: '购买过所有种类的基础蔬菜', category: 'restaurant', tier: 3,
      check: () => {
        const allIds = ['potato','onion','garlic','cabbage','eggplant','broccoli','pumpkin','leek','ginger','celery','chili','bean','radish','lettuce','sweetpotato'];
        const have = new Set((state.fridgeInventory || []).map(i => i.foodId));
        return allIds.every(id => have.has(id));
      }},

    // ===================== 新增：小游戏细节 =====================
    { id: 'fridge_perfect',       name: '完美收纳',           emoji: '🏆', desc: '冰箱整理完成率达到100%', category: 'minigame', tier: 3,
      check: () => (state.fridgeInventory || []).reduce((s, i) => s + i.count, 0) >= 20 },
    { id: 'fridge_giant',         name: '豪华巨无霸',         emoji: '🎪', desc: '挑战过豪华巨无霸冰箱', category: 'minigame', tier: 3,
      check: () => (state.fridgeInventory || []).some(i => i.count > 0) && (state.fridgePropInventory && Object.values(state.fridgePropInventory).some(v => v >= 0)) },
    { id: 'tanghulu_sell_all',    name: '清仓大甩卖',         emoji: '🏪', desc: '卖出过10串以上糖葫芦', category: 'minigame', tier: 2,
      check: () => state.gameGold >= 150 && (state.tanghuluInventory || []).length >= 0 },
    { id: 'match3_clear',         name: '消消看通关',         emoji: '🃏', desc: '消消看通关一局', category: 'minigame', tier: 2,
      check: () => (state.match3Inventory && Object.values(state.match3Inventory).some(v => v >= 0)) && state.gameGold >= 30 },
    { id: 'link_clear',           name: '连连看通关',         emoji: '🔗', desc: '连连看通关一局', category: 'minigame', tier: 2,
      check: () => (state.linkInventory && Object.values(state.linkInventory).some(v => v >= 0)) && state.gameGold >= 40 },
    { id: 'shelf_clear',          name: '货架清空',           emoji: '🛒', desc: '货架整理通关一局', category: 'minigame', tier: 2,
      check: () => (state.shelfPropInventory && Object.values(state.shelfPropInventory).some(v => v >= 0)) && state.gameGold >= 20 },
    { id: 'fridge_all_types',     name: '冰箱博物馆',         emoji: '🏛️', desc: '冰箱库存种类达到25种', category: 'minigame', tier: 4,
      check: () => (state.fridgeInventory || []).filter(i => i.count > 0).length >= 25 },
    { id: 'tanghulu_perfect',     name: '糖葫芦大师',         emoji: '🥇', desc: '糖葫芦通关步数在50步以内', category: 'minigame', tier: 3,
      check: () => (state.tanghuluInventory || []).some(i => i.count > 0) && state.gameGold > 0 },
    { id: 'prop_hoarder',         name: '道具囤积者',         emoji: '🎒', desc: '同时拥有5种以上游戏道具（各类总计）', category: 'minigame', tier: 2,
      check: () => {
        const m3 = Object.values(state.match3Inventory || {}).filter(v => v > 0).length;
        const lk = Object.values(state.linkInventory || {}).filter(v => v > 0).length;
        const fd = Object.values(state.fridgePropInventory || {}).filter(v => v > 0).length;
        const th = Object.values(state.tanghuluPropInventory || {}).filter(v => v > 0).length;
        const sh = Object.values(state.shelfPropInventory || {}).filter(v => v > 0).length;
        return m3 + lk + fd + th + sh >= 5;
      }},

    // ===================== 新增：收集细节 =====================
    { id: 'all_sprites_set',      name: '形象全套',           emoji: '🎨', desc: '闲置/走路/睡觉/开心/难过精灵图全部设置', category: 'collect', tier: 3,
      check: () => !!settings.spriteIdle && !!settings.spriteWalkLeft && !!settings.spriteSleep && !!settings.spriteHappy && !!settings.spriteSad },
    { id: 'hang_sprites_set',     name: '挂墙达人',           emoji: '🪝', desc: '三个方向挂起精灵图全部设置', category: 'collect', tier: 2,
      check: () => !!settings.spriteHangLeft && !!settings.spriteHangRight && !!settings.spriteHangTop },
    { id: 'interaction_sprites',  name: '互动全套',           emoji: '✨', desc: '吃东西/洗澡/打招呼/思考精灵图全部设置', category: 'collect', tier: 2,
      check: () => !!settings.spriteEat && !!settings.spriteBath && !!settings.spriteWave && !!settings.spriteThink },
    { id: 'house_outfit_3',       name: '衣橱丰富',           emoji: '👗', desc: '创建过3套以上服装', category: 'collect', tier: 2,
      check: () => (settings.houseOutfits || []).length >= 3 },
    { id: 'house_outfit_5',       name: '时尚达人',           emoji: '💃', desc: '创建过5套以上服装', category: 'collect', tier: 3,
      check: () => (settings.houseOutfits || []).length >= 5 },
    { id: 'house_outfit_10',      name: '换装狂魔',           emoji: '🌈', desc: '创建过10套以上服装', category: 'collect', tier: 4,
      check: () => (settings.houseOutfits || []).length >= 10 },
    { id: 'preset_saved_3',       name: '性格多样',           emoji: '🎭', desc: '保存过3个以上自定义提示词预设', category: 'collect', tier: 2,
      check: () => (settings.promptPresets || []).length >= 3 },
    { id: 'custom_theme',         name: '调色板大师',         emoji: '🎨', desc: '使用过自定义主题', category: 'collect', tier: 1,
      check: () => settings.currentTheme === 'custom' && !!settings.customTheme },
    { id: 'all_themes',           name: '主题收藏家',         emoji: '🌈', desc: '5种预设主题全部用过（当前为非默认主题）', category: 'collect', tier: 2,
      check: () => settings.currentTheme !== 'default' },
    { id: 'emoji_named_all',      name: '表情命名大师',       emoji: '🏷️', desc: '所有表情包都有名字', category: 'collect', tier: 2,
      check: () => {
        const stickers = settings.emojiStickers || [];
        return stickers.length >= 3 && stickers.every(s => s.name && s.name.trim().length > 0);
      }},

    // ===================== 新增：特殊/隐藏 =====================
    { id: 'pet_very_happy',       name: '幸福满溢',           emoji: '🥰', desc: '心情为happy且三项状态都超过85%', category: 'special', tier: 2,
      check: () => state.mood === 'happy' && state.hunger >= 85 && state.cleanliness >= 85 && state.energy >= 85 },
    { id: 'pet_very_sad',         name: '最惨的一天',         emoji: '😭', desc: '心情为sad且三项状态都低于30%', category: 'special', tier: 2,
      check: () => state.mood === 'sad' && state.hunger < 30 && state.cleanliness < 30 && state.energy < 30 },
    { id: 'chat_at_midnight',     name: '午夜密语',           emoji: '🌌', desc: '在凌晨0点整前后30分钟和桌宠聊天', category: 'special', tier: 2,
      check: () => {
        const h = new Date().getHours();
        const m = new Date().getMinutes();
        return (h === 23 && m >= 30) || (h === 0 && m <= 30);
      }},
    { id: 'chat_new_year',        name: '新年快乐',           emoji: '🎆', desc: '在元旦（1月1日）和桌宠聊天', category: 'special', tier: 2,
      check: () => {
        const now = new Date();
        return now.getMonth() === 0 && now.getDate() === 1;
      }},
    { id: 'chat_valentine',       name: '情人节快乐',         emoji: '💝', desc: '在情人节（2月14日）和桌宠聊天', category: 'special', tier: 2,
      check: () => {
        const now = new Date();
        return now.getMonth() === 1 && now.getDate() === 14;
      }},
    { id: 'chat_christmas',       name: '圣诞快乐',           emoji: '🎄', desc: '在圣诞节（12月25日）和桌宠聊天', category: 'special', tier: 2,
      check: () => {
        const now = new Date();
        return now.getMonth() === 11 && now.getDate() === 25;
      }},
    { id: 'summon_used',          name: '召唤术士',           emoji: '🌀', desc: '使用过/pet summon召唤指令', category: 'special', tier: 1,
      check: () => state.totalInteractions >= 1 && (state.petChatHistory.some(m => m.content && m.content.includes('召唤'))) },
    { id: 'max_scale',            name: '巨人降临',           emoji: '🦕', desc: '桌宠缩放设为2.0x', category: 'special', tier: 1,
      check: () => (settings.petScale || 1.0) >= 2.0 },
    { id: 'min_scale',            name: '拇指姑娘',           emoji: '🔬', desc: '桌宠缩放设为0.5x', category: 'special', tier: 1,
      check: () => (settings.petScale || 1.0) <= 0.5 },
    { id: 'edge_snap',            name: '壁挂式桌宠',         emoji: '🪝', desc: '将桌宠拖到屏幕边缘吸附过', category: 'special', tier: 1,
      check: () => !!settings.spriteHangLeft || !!settings.spriteHangRight || !!settings.spriteHangTop },
    { id: 'github_migrated',      name: '云端之家',           emoji: '☁️', desc: '使用过GitHub图片托管功能', category: 'special', tier: 2,
      check: () => !!settings.githubToken && !!settings.githubRepo },
    { id: 'worldbook_excluded',   name: '精准注入',           emoji: '🎯', desc: '手动排除过世界书条目', category: 'special', tier: 1,
      check: () => (settings.worldBookExcluded || []).length > 0 },
    { id: 'multi_profile',        name: '多宠家庭',           emoji: '🐾', desc: '同时保存过2个以上桌宠存档', category: 'special', tier: 2,
      check: () => (settings.petProfiles || []).length >= 2 },
    { id: 'exported_data',        name: '备份达人',           emoji: '💾', desc: '导出过桌宠数据（拥有5条以上聊天记录）', category: 'special', tier: 1,
      check: () => state.petChatHistory.length >= 5 },
    { id: 'name_changed',         name: '重新命名',           emoji: '✏️', desc: '给桌宠起了不同于默认的名字', category: 'special', tier: 1,
      check: () => !!settings.petName && settings.petName !== '咪噗' },
    { id: 'reaction_customized',  name: '独家台词',           emoji: '💬', desc: '自定义过至少3种反应语言', category: 'special', tier: 1,
      check: () => {
        const def = DEFAULT_SETTINGS.reactions;
        const cur = settings.reactions || {};
        let changed = 0;
        if (cur.feed && cur.feed !== def.feed) changed++;
        if (cur.bath && cur.bath !== def.bath) changed++;
        if (cur.sleep && cur.sleep !== def.sleep) changed++;
        if (cur.drag && cur.drag !== def.drag) changed++;
        if (cur.idle && cur.idle !== def.idle) changed++;
        return changed >= 3;
      }},
    { id: 'jailbreak_long',       name: '自由灵魂',           emoji: '🔓', desc: '破限提示词超过100字', category: 'special', tier: 2,
      check: () => settings.jailbreak && settings.jailbreak.trim().length > 100 },
    { id: 'system_prompt_long',   name: '精心设定',           emoji: '📝', desc: '系统提示词超过200字', category: 'special', tier: 2,
      check: () => settings.systemPrompt && settings.systemPrompt.trim().length > 200 },
    { id: 'relationship_long',    name: '深厚情谊',           emoji: '💞', desc: '关系描述超过100字', category: 'special', tier: 2,
      check: () => settings.relationshipPrompt && settings.relationshipPrompt.trim().length > 100 },
    { id: 'all_api_options',      name: '技术达人',           emoji: '🔧', desc: '同时开启流式输出和时间感知', category: 'special', tier: 2,
      check: () => settings.enableStreaming && settings.enableTimeAwareness },
    { id: 'vision_and_emoji',     name: '图文并茂',           emoji: '👁️', desc: '同时开启视觉识别并上传过表情包', category: 'special', tier: 2,
      check: () => settings.enableVision && (settings.emojiStickers || []).length > 0 },
    { id: 'low_cooldown',         name: '话匣子',             emoji: '🗣️', desc: '冷却时间设置为10秒以内', category: 'special', tier: 1,
      check: () => (settings.cooldownSeconds || 30) <= 10 },
    { id: 'high_cooldown',        name: '慢慢来',             emoji: '🐢', desc: '冷却时间设置为200秒以上', category: 'special', tier: 1,
      check: () => (settings.cooldownSeconds || 30) >= 200 },
    { id: 'peek_max',             name: '偷听达人',           emoji: '👂', desc: '窥探轮数设置为最大值20', category: 'special', tier: 1,
      check: () => (settings.peekRounds || 5) >= 20 },
    { id: 'wander_fast',          name: '多动症',             emoji: '🏃', desc: '走动频率设置为3秒', category: 'special', tier: 1,
      check: () => (settings.wanderInterval || 8) <= 3 },
    { id: 'wander_slow',          name: '佛系桌宠',           emoji: '🧘', desc: '走动频率设置为30秒', category: 'special', tier: 1,
      check: () => (settings.wanderInterval || 8) >= 30 },
    { id: 'decay_fast',           name: '娇生惯养',           emoji: '🥺', desc: '离线衰减率设置为最大0.5', category: 'special', tier: 1,
      check: () => (settings.offlineDecayRate || 0.15) >= 0.5 },
    { id: 'decay_slow',           name: '铁打的身子',         emoji: '💪', desc: '离线衰减率设置为最小0.1', category: 'special', tier: 1,
      check: () => (settings.offlineDecayRate || 0.15) <= 0.1 },
    { id: 'status_bar_hidden',    name: '极简主义',           emoji: '🎯', desc: '关闭了状态条显示', category: 'special', tier: 1,
      check: () => settings.showStatusBar === false },
    { id: 'cyberpunk_theme',      name: '赛博猫咪',           emoji: '🌃', desc: '使用过赛博朋克主题', category: 'special', tier: 1,
      check: () => settings.currentTheme === 'cyberpunk' },
    { id: 'cute_theme',           name: '粉色泡泡',           emoji: '🌸', desc: '使用过可爱粉主题', category: 'special', tier: 1,
      check: () => settings.currentTheme === 'cute' },
    { id: 'ocean_theme',          name: '深海漫游',           emoji: '🌊', desc: '使用过深海主题', category: 'special', tier: 1,
      check: () => settings.currentTheme === 'ocean' },
    { id: 'forest_theme',         name: '森林精灵',           emoji: '🌲', desc: '使用过森林主题', category: 'special', tier: 1,
      check: () => settings.currentTheme === 'forest' },
    { id: 'use_builtin_preset',   name: '预设初体验',         emoji: '📋', desc: '应用过内置提示词预设', category: 'special', tier: 1,
      check: () => settings.currentPreset && settings.currentPreset.startsWith('builtin:') },
    { id: 'use_custom_preset',    name: '量身定制',           emoji: '✂️', desc: '保存并应用过自定义提示词预设', category: 'special', tier: 2,
      check: () => settings.currentPreset && settings.currentPreset.startsWith('custom:') },
    { id: 'pet_chat_rounds_max',  name: '长情陪伴',           emoji: '📜', desc: '聊天读取轮数设置为50以上', category: 'special', tier: 2,
      check: () => (settings.petChatRounds || 20) >= 50 },
    { id: 'auto_summary_on',      name: '自动整理控',         emoji: '🤖', desc: '开启了自动总结提醒', category: 'special', tier: 1,
      check: () => settings.summaryTrigger === 'auto' },
    { id: 'summary_incremental',  name: '记忆编织者',         emoji: '🧶', desc: '使用增量合并总结策略', category: 'special', tier: 1,
      check: () => settings.summaryMode === 'incremental' },
    { id: 'house_open_10',        name: '常回家看看',         emoji: '🏡', desc: '桌宠小屋聊天记录超过20条', category: 'special', tier: 2,
      check: () => state.petChatHistory.filter(m => m.role === 'assistant').length >= 20 },
    { id: 'wardrobe_switched',    name: '今天穿什么',         emoji: '👗', desc: '切换过至少一次服装', category: 'special', tier: 1,
      check: () => (settings.houseOutfits || []).length >= 1 && !!settings.houseCurrentOutfit },
    { id: 'expression_matched',   name: '心有灵犀',           emoji: '💫', desc: '设置了关键词表情立绘且关键词超过3个', category: 'special', tier: 2,
      check: () => {
        const exprs = settings.houseExpressions || [];
        return exprs.some(e => e.keywords && e.keywords.split(',').filter(k => k.trim()).length >= 3 && e.image);
      }},
    { id: 'food_image_set',       name: '食物飞来了',         emoji: '🍖', desc: '设置了投喂互动贴图', category: 'special', tier: 1,
      check: () => !!settings.foodImage },
    { id: 'all_interact_images',  name: '互动全彩',           emoji: '🎨', desc: '食物/浴缸/床三张互动贴图全部设置', category: 'special', tier: 2,
      check: () => !!settings.foodImage && !!settings.bathImage && !!settings.bedImage },
    { id: 'dizzy_sprite_set',     name: '眩晕特效',           emoji: '😵', desc: '设置了晕乎乎精灵图', category: 'special', tier: 1,
      check: () => !!settings.spriteDizzy },
    { id: 'drag_sprite_set',      name: '被抓住了',           emoji: '✋', desc: '设置了被拎起精灵图', category: 'special', tier: 1,
      check: () => !!settings.spriteDrag },
    { id: 'think_sprite_set',     name: '思考中',             emoji: '💭', desc: '设置了思考中精灵图', category: 'special', tier: 1,
      check: () => !!settings.spriteThink },
    { id: 'wave_sprite_set',      name: '欢迎回来',           emoji: '👋', desc: '设置了打招呼精灵图', category: 'special', tier: 1,
      check: () => !!settings.spriteWave },
    { id: 'all_walk_sprites',     name: '四方行者',           emoji: '🧭', desc: '上下左右四个方向走路精灵图全部设置', category: 'special', tier: 2,
      check: () => !!settings.spriteWalkLeft && !!settings.spriteWalkRight && !!settings.spriteWalkUp && !!settings.spriteWalkDown },
    { id: 'custom_sprite_used',   name: '随机动作',           emoji: '🎲', desc: '添加了至少1个自定义动作精灵图', category: 'special', tier: 1,
      check: () => (settings.customSprites || []).filter(s => s.image).length >= 1 },

    // ===================== 新增：里程碑细节 =====================
    { id: 'total_100_actions',    name: '百次相伴',           emoji: '🎖️', desc: '总互动+聊天+日记超过100次', category: 'milestone', tier: 2,
      check: () => state.totalInteractions + state.petChatHistory.length + (state.diaryEntries || []).length >= 100 },
    { id: 'total_200_actions',    name: '二百里程',           emoji: '🏅', desc: '总互动+聊天+日记超过200次', category: 'milestone', tier: 2,
      check: () => state.totalInteractions + state.petChatHistory.length + (state.diaryEntries || []).length >= 200 },
    { id: 'played_3_days',        name: '三日之约',           emoji: '🌱', desc: '桌宠数据存在超过3天', category: 'milestone', tier: 1,
      check: () => {
        const first = state.petChatHistory[0];
        if (!first || !first.timestamp) return false;
        return Date.now() - first.timestamp >= 3 * 24 * 60 * 60 * 1000;
      }},
    { id: 'played_14_days',       name: '两周情谊',           emoji: '🌿', desc: '桌宠数据存在超过14天', category: 'milestone', tier: 2,
      check: () => {
        const first = state.petChatHistory[0];
        if (!first || !first.timestamp) return false;
        return Date.now() - first.timestamp >= 14 * 24 * 60 * 60 * 1000;
      }},
    { id: 'played_60_days',       name: '两月相守',           emoji: '🌸', desc: '桌宠数据存在超过60天', category: 'milestone', tier: 3,
      check: () => {
        const first = state.petChatHistory[0];
        if (!first || !first.timestamp) return false;
        return Date.now() - first.timestamp >= 60 * 24 * 60 * 60 * 1000;
      }},
    { id: 'played_90_days',       name: '三月之恋',           emoji: '🌺', desc: '桌宠数据存在超过90天', category: 'milestone', tier: 3,
      check: () => {
        const first = state.petChatHistory[0];
        if (!first || !first.timestamp) return false;
        return Date.now() - first.timestamp >= 90 * 24 * 60 * 60 * 1000;
      }},
    { id: 'played_200_days',      name: '两百日情缘',         emoji: '💐', desc: '桌宠数据存在超过200天', category: 'milestone', tier: 4,
      check: () => {
        const first = state.petChatHistory[0];
        if (!first || !first.timestamp) return false;
        return Date.now() - first.timestamp >= 200 * 24 * 60 * 60 * 1000;
      }},
    { id: 'played_730_days',      name: '两年之约',           emoji: '💒', desc: '桌宠数据存在超过730天', category: 'milestone', tier: 5,
      check: () => {
        const first = state.petChatHistory[0];
        if (!first || !first.timestamp) return false;
        return Date.now() - first.timestamp >= 730 * 24 * 60 * 60 * 1000;
      }},
    { id: 'everything_unlocked',  name: '全能玩家·终章',      emoji: '🌌', desc: '金币5000+ 声望100+ 图鉴30+ 日记10篇+ 互动100次+', category: 'milestone', tier: 5,
      check: () => state.gameGold >= 5000 && state.restaurantReputation >= 100 && (state.gameCollection || []).length >= 30 && (state.diaryEntries || []).length >= 10 && state.totalInteractions >= 100 },
    { id: 'true_companion',       name: '永远在一起',         emoji: '💖', desc: '聊天500条+ 日记30篇+ 互动200次+ 记忆10条+', category: 'milestone', tier: 5,
      check: () => state.petChatHistory.length >= 500 && (state.diaryEntries || []).length >= 30 && state.totalInteractions >= 200 && state.memories.length >= 10 },
    { id: 'game_master',          name: '游戏全通',           emoji: '🎮', desc: '所有8种小游戏都有实质进展', category: 'milestone', tier: 5,
      check: () => {
        const hasMerge = (state.gameCollection || []).length >= 5;
        const hasFridge = (state.fridgeInventory || []).filter(i => i.count > 0).length >= 3;
        const hasTanghulu = (state.tanghuluInventory || []).filter(i => i.count > 0).length >= 1;
        const hasMatch3 = Object.values(state.match3Inventory || {}).some(v => v >= 0) && state.gameGold >= 30;
        const hasLink = Object.values(state.linkInventory || {}).some(v => v >= 0) && state.gameGold >= 40;
        const hasShelf = Object.values(state.shelfPropInventory || {}).some(v => v >= 0) && state.gameGold >= 20;
        const hasLottery = Object.keys(state.lotteryLog || {}).length > 0;
        const hasRestaurant = state.restaurantServedCount >= 5;
        return hasMerge && hasFridge && hasTanghulu && (hasMatch3 || hasLink || hasShelf) && hasLottery && hasRestaurant;
      }},
    { id: 'legend_of_legends',    name: '传说中的传说',       emoji: '✨', desc: '解锁超过100个成就', category: 'milestone', tier: 5,
      check: () => (state.achievements || []).length >= 100 },
    // ===================== 补足300个 =====================
    { id: 'chat_morning',         name: '早安问候',           emoji: '🌤️', desc: '在早晨7-9点和桌宠聊天', category: 'special', tier: 1,
      check: () => { const h = new Date().getHours(); return h >= 7 && h < 9 && state.petChatHistory.length > 0; }},
    { id: 'chat_noon',            name: '午间小憩',           emoji: '☀️', desc: '在中午12-14点和桌宠聊天', category: 'special', tier: 1,
      check: () => { const h = new Date().getHours(); return h >= 12 && h < 14 && state.petChatHistory.length > 0; }},
    { id: 'chat_evening',         name: '晚安道别',           emoji: '🌙', desc: '在晚上22-24点和桌宠聊天', category: 'special', tier: 1,
      check: () => { const h = new Date().getHours(); return h >= 22 && state.petChatHistory.length > 0; }},
    { id: 'memory_tag_used',      name: '标签整理控',         emoji: '🏷️', desc: '拥有至少3条带标签的记忆', category: 'interact', tier: 1,
      check: () => state.memories.filter(m => typeof m === 'object' && m.tag && m.tag.trim().length > 0).length >= 3 },
    { id: 'fridge_prop_all',      name: '冰箱工具箱',         emoji: '🧰', desc: '同时拥有冰箱三种道具各至少1个', category: 'minigame', tier: 3,
      check: () => {
        const inv = state.fridgePropInventory || {};
        return (inv.compress || 0) >= 1 && (inv.backpack || 0) >= 1 && (inv.organize || 0) >= 1;
      }},
    { id: 'tanghulu_prop_all',    name: '糖葫芦工具箱',       emoji: '🥢', desc: '同时拥有糖葫芦三种道具各至少1个', category: 'minigame', tier: 3,
      check: () => {
        const inv = state.tanghuluPropInventory || {};
        return (inv.extraStick || 0) >= 1 && (inv.undo || 0) >= 1 && (inv.lubricant || 0) >= 1;
      }},
    { id: 'link_prop_all',        name: '连连看工具箱',       emoji: '🔗', desc: '同时拥有连连看四种道具各至少1个', category: 'minigame', tier: 3,
      check: () => {
        const inv = state.linkInventory || {};
        return (inv.hint || 0) >= 1 && (inv.shuffle || 0) >= 1 && (inv.bomb || 0) >= 1 && (inv.compass || 0) >= 1;
      }},
    { id: 'match3_prop_all',      name: '消消看工具箱',       emoji: '🃏', desc: '同时拥有消消看三种道具各至少1个', category: 'minigame', tier: 3,
      check: () => {
        const inv = state.match3Inventory || {};
        return (inv.expand || 0) >= 1 && (inv.sweep || 0) >= 1 && (inv.shuffle || 0) >= 1;
      }},
    { id: 'all_toolboxes',        name: '全能道具师',         emoji: '🎒', desc: '同时拥有四个游戏的全套道具', category: 'milestone', tier: 4,
      check: () => {
        const m3 = state.match3Inventory || {};
        const lk = state.linkInventory || {};
        const fd = state.fridgePropInventory || {};
        const th = state.tanghuluPropInventory || {};
        return (m3.expand||0)>=1 && (m3.sweep||0)>=1 && (m3.shuffle||0)>=1
          && (lk.hint||0)>=1 && (lk.shuffle||0)>=1 && (lk.bomb||0)>=1 && (lk.compass||0)>=1
          && (fd.compress||0)>=1 && (fd.backpack||0)>=1 && (fd.organize||0)>=1
          && (th.extraStick||0)>=1 && (th.undo||0)>=1 && (th.lubricant||0)>=1;
      }},
    { id: 'chat_100_pet_reply',   name: '百句应答',           emoji: '🐾', desc: '桌宠回复累计达到100条', category: 'interact', tier: 3,
      check: () => state.petChatHistory.filter(m => m.role === 'assistant').length >= 100 },
    { id: 'diary_export',         name: '记录成册',           emoji: '📚', desc: '日记达到20篇以上（可以导出了）', category: 'interact', tier: 3,
      check: () => (state.diaryEntries || []).length >= 20 },
    { id: 'gold_spend_big',       name: '豪爽一掷',           emoji: '🎰', desc: '单日抽奖花费超过100金币', category: 'economy', tier: 2,
      check: () => {
        const today = new Date().toISOString().slice(0, 10);
        const log = (state.lotteryLog || {})[today] || {};
        const spent = (log.small || 0) * 10 + (log.medium || 0) * 30 + (log.large || 0) * 50;
        return spent >= 100;
      }},
    { id: 'restaurant_serve_vip', name: '迎接贵宾',           emoji: '🎩', desc: '服务过声望要求50以上的高级客人', category: 'restaurant', tier: 3,
      check: () => state.restaurantReputation >= 50 && state.restaurantServedCount >= 15 },
    { id: 'shelf_prop_all',       name: '货架工具箱',         emoji: '🛒', desc: '同时拥有货架整理三种道具各至少1个', category: 'minigame', tier: 3,
      check: () => {
        const inv = state.shelfPropInventory || {};
        return (inv.basket || 0) >= 1 && (inv.autoMatch || 0) >= 1 && (inv.shuffle || 0) >= 1;
      }},
    { id: 'pet_name_long',        name: '名字好长啊',         emoji: '📛', desc: '桌宠名字超过6个字', category: 'special', tier: 1,
      check: () => settings.petName && settings.petName.trim().length > 6 },
    { id: 'total_3000_actions',   name: '三千之缘',           emoji: '🌠', desc: '总互动+聊天+日记超过3000次', category: 'milestone', tier: 5,
      check: () => state.totalInteractions + state.petChatHistory.length + (state.diaryEntries || []).length >= 3000 },

  ];


  // ===== 成就奖励发放 =====
  function grantAchievementReward(achievement) {
    const tier = achievement.tier || 1;
    let goldReward = 0;
    let staminaReward = 0;
    let randomItemCount = 0;
    let grantCrystal = false;

    switch (tier) {
      case 1:
        goldReward = 8;
        break;
      case 2:
        goldReward = 20;
        staminaReward = 5;
        break;
      case 3:
        goldReward = 50;
        staminaReward = 10;
        randomItemCount = 1;
        break;
      case 4:
        goldReward = 120;
        staminaReward = 20;
        randomItemCount = 2;
        break;
      case 5:
        goldReward = 300;
        staminaReward = 50;
        randomItemCount = 3;
        grantCrystal = true;
        break;
    }

    // 发放金币
    state.gameGold += goldReward;

    // 发放体力
    if (staminaReward > 0) {
      state.gameStamina = Math.min(999, (state.gameStamina || 0) + staminaReward);
    }


    // 发放随机道具
    for (let i = 0; i < randomItemCount; i++) {
      const randomPropType = Math.floor(Math.random() * 5);
      switch (randomPropType) {
        case 0:
          if (!state.match3Inventory) state.match3Inventory = { expand: 0, sweep: 0, shuffle: 0 };
          const m3Keys = ['expand', 'sweep', 'shuffle'];
          state.match3Inventory[m3Keys[Math.floor(Math.random() * m3Keys.length)]]++;
          break;
        case 1:
          if (!state.linkInventory) state.linkInventory = { hint: 0, shuffle: 0, bomb: 0, compass: 0 };
          const linkKeys = ['hint', 'shuffle', 'bomb', 'compass'];
          state.linkInventory[linkKeys[Math.floor(Math.random() * linkKeys.length)]]++;
          break;
        case 2:
          if (!state.fridgePropInventory) state.fridgePropInventory = { compress: 0, backpack: 0, organize: 0 };
          const fridgeKeys = ['compress', 'backpack', 'organize'];
          state.fridgePropInventory[fridgeKeys[Math.floor(Math.random() * fridgeKeys.length)]]++;
          break;
        case 3:
          if (!state.tanghuluPropInventory) state.tanghuluPropInventory = { extraStick: 0, undo: 0, lubricant: 0 };
          const thKeys = ['extraStick', 'undo', 'lubricant'];
          state.tanghuluPropInventory[thKeys[Math.floor(Math.random() * thKeys.length)]]++;
          break;
        case 4:
          if (!state.gameStaminaInventory) state.gameStaminaInventory = { stamina30: 0, stamina50: 0, stamina100: 0 };
          const stKeys = ['stamina30', 'stamina50', 'stamina100'];
          state.gameStaminaInventory[stKeys[Math.floor(Math.random() * stKeys.length)]]++;
          break;
      }
    }

    // 发放糖砂
    if (grantCrystal) {
      if (!state.tanghuluSugarCrystal) state.tanghuluSugarCrystal = 0;
      state.tanghuluSugarCrystal++;
    }

    return { goldReward, staminaReward, randomItemCount, grantCrystal };
  }


  // ===== 成就检查（在关键操作后调用）=====
  function checkAchievements() {
    if (!state.achievements) state.achievements = [];
    if (!state.achievementNotified) state.achievementNotified = [];

    let newlyUnlocked = [];

    ACHIEVEMENTS.forEach(ach => {
      if (state.achievements.includes(ach.id)) return;
      try {
        if (ach.check()) {
          state.achievements.push(ach.id);
          newlyUnlocked.push(ach);
        }
      } catch (e) {
      }
    });

    if (newlyUnlocked.length > 0) {
      // 为每个新解锁的成就发放奖励
      let totalGold = 0;
      let totalStamina = 0;
      let totalItems = 0;
      let gotCrystal = false;
      newlyUnlocked.forEach(ach => {
        const reward = grantAchievementReward(ach);
        totalGold += reward.goldReward;
        totalStamina += reward.staminaReward;
        totalItems += reward.randomItemCount;
        if (reward.grantCrystal) gotCrystal = true;
      });

      saveDataDebounced('成就解锁');
      const first = newlyUnlocked[0];
      if (!state.achievementNotified.includes(first.id)) {
        state.achievementNotified.push(first.id);
        // 构建奖励提示文字
        let rewardText = `+${totalGold}🪙`;
        if (totalStamina > 0) rewardText += ` +${totalStamina}⚡`;
        if (totalItems > 0) rewardText += ` +${totalItems}道具`;
        if (gotCrystal) rewardText += ` +✨糖砂`;
        showBubble(`🏆 成就解锁！「${first.emoji} ${first.name}」 ${rewardText}`, 6000);
        if (newlyUnlocked.length > 1) {
          setTimeout(() => {
            showBubble(`还有 ${newlyUnlocked.length - 1} 个新成就解锁了！去看看吧`, 4000);
          }, 6500);
        }
      }
    }
  }


  // ===== 成就展示弹窗 =====
  function showAchievementsPanel() {
    document.getElementById('sp-achievements-overlay')?.remove();

    if (!state.achievements) state.achievements = [];

    const categories = [
      { key: 'interact',   label: '💬 互动' },
      { key: 'economy',    label: '💰 经济' },
      { key: 'merge',      label: '🧶 合成工坊' },
      { key: 'restaurant', label: '🐱 小猫餐厅' },
      { key: 'minigame',   label: '🎮 小游戏' },
      { key: 'collect',    label: '📦 收集' },
      { key: 'special',    label: '⭐ 特殊' },
      { key: 'milestone',  label: '🏅 里程碑' },
    ];

    const unlockedCount = state.achievements.length;
    const totalCount = ACHIEVEMENTS.length;
    const percent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

    let bodyHtml = `
      <div style="text-align:center;margin-bottom:12px;">
        <div style="font-size:13px;color:var(--sp-text-primary);font-weight:600;">已解锁 ${unlockedCount} / ${totalCount} (${percent}%)</div>
        <div style="width:100%;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;margin-top:6px;">
          <div style="width:${percent}%;height:100%;background:rgba(255,200,50,0.7);border-radius:3px;transition:width 0.3s;"></div>
        </div>
      </div>
    `;

    categories.forEach(cat => {
      const achs = ACHIEVEMENTS.filter(a => a.category === cat.key);
      if (achs.length === 0) return;
      const catUnlocked = achs.filter(a => state.achievements.includes(a.id)).length;

      bodyHtml += `
        <details style="margin-bottom:8px;border:1px solid rgba(255,255,255,0.08);border-radius:8px;overflow:hidden;">
          <summary style="padding:8px 12px;font-size:12px;font-weight:600;cursor:pointer;background:rgba(255,255,255,0.04);color:var(--sp-text-primary);list-style:none;display:flex;justify-content:space-between;user-select:none;">
            <span>${cat.label}</span>
            <span style="font-size:10px;color:var(--sp-text-muted);">${catUnlocked}/${achs.length}</span>
          </summary>
          <div style="padding:6px 8px;display:flex;flex-direction:column;gap:4px;">
            ${achs.map(ach => {
              const unlocked = state.achievements.includes(ach.id);
              return `
                <div style="display:flex;align-items:center;gap:8px;padding:5px 8px;background:${unlocked ? 'rgba(255,200,50,0.06)' : 'rgba(255,255,255,0.02)'};border:1px solid ${unlocked ? 'rgba(255,200,50,0.2)' : 'rgba(255,255,255,0.05)'};border-radius:6px;opacity:${unlocked ? '1' : '0.5'};">
                  <span style="font-size:18px;flex-shrink:0;">${unlocked ? ach.emoji : '🔒'}</span>
                  <div style="flex:1;">
                    <div style="font-size:11px;font-weight:600;color:${unlocked ? 'var(--sp-text-primary)' : 'var(--sp-text-muted)'};">${ach.name}</div>
                    <div style="font-size:10px;color:var(--sp-text-muted);">${ach.desc}</div>
                    <div style="font-size:9px;color:${unlocked ? 'rgba(255,200,50,0.7)' : 'var(--sp-text-muted)'};margin-top:1px;">${ach.tier === 1 ? '🪙8' : ach.tier === 2 ? '🪙20+⚡5' : ach.tier === 3 ? '🪙50+⚡10+道具×1' : ach.tier === 4 ? '🪙120+⚡20+道具×2' : '🪙300+⚡50+道具×3+✨'}</div>
                  </div>
                  ${unlocked ? '<span style="font-size:10px;color:rgba(255,200,50,0.8);">✓</span>' : ''}
                </div>
              `;
            }).join('')}
          </div>
        </details>
      `;
    });

    const overlay = document.createElement('div');
    overlay.id = 'sp-achievements-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:2147483649;';
    overlay.innerHTML = `
      <div class="sp-total-inv-box" style="height:80vh;max-height:80vh;display:flex;flex-direction:column;">
        <div class="sp-total-inv-header">
          <span>🏆 成就系统</span>
          <button class="sp-total-inv-close" id="sp-achievements-close" title="关闭">✕</button>
        </div>
        <div class="sp-total-inv-body" style="padding:12px;">
          ${bodyHtml}
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // 居中
    requestAnimationFrame(() => {
      const box = overlay.querySelector('.sp-total-inv-box');
      if (box) {
        const boxH = box.offsetHeight || 400;
        const boxW = box.offsetWidth || 340;
        box.style.position = 'fixed';
        box.style.top = Math.max(20, Math.floor((window.innerHeight - boxH) / 2)) + 'px';
        box.style.left = Math.floor((window.innerWidth - boxW) / 2) + 'px';
        box.style.margin = '0';
      }
    });

    document.getElementById('sp-achievements-close').onclick = () => overlay.remove();
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    overlay.querySelector('.sp-total-inv-box').addEventListener('click', (e) => { e.stopPropagation(); });
    // 防止 details 展开时滚动位置被重置
    const achBody = overlay.querySelector('.sp-total-inv-body');
    if (achBody) {
      overlay.querySelectorAll('details').forEach(detail => {
        detail.addEventListener('toggle', () => {
          // toggle 事件是同步的，但布局重算是异步的，用 rAF 保住位置
          const savedScrollTop = achBody.scrollTop;
          requestAnimationFrame(() => {
            achBody.scrollTop = savedScrollTop;
          });
        });
      });
    }

  }

  // ===== 道具定义 =====
  const TANGHULU_PROPS = {
    extraStick: {
      name: '🥢 赠送竹签',
      desc: '额外增加一根空竹签',
      price: 50,
      perGameLimit: 1,
      dailyLimit: 5
    },
    undo: {
      name: '↩️ 悔步撤销',
      desc: '撤销上一次移动操作',
      price: 10,
      perGameLimit: 3,
      dailyLimit: 20
    },
    lubricant: {
      name: '🌀 顺滑剂',
      desc: '无视规则强行移动一颗水果',
      price: 30,
      perGameLimit: 2,
      dailyLimit: 10
    }
  };

  // ===== 难度配置 =====
  // ===== 难度配置 =====
  const TANGHULU_DIFFICULTIES = [
    { name: '入门', fruitTypes: 3, stickCount: 5, capacity: 4, shuffleMoves: 60,   energyCost: 3,  goldReward: [10, 20]  },
    { name: '简单', fruitTypes: 4, stickCount: 6, capacity: 4, shuffleMoves: 100,  energyCost: 5,  goldReward: [20, 35]  },
    { name: '普通', fruitTypes: 5, stickCount: 7, capacity: 5, shuffleMoves: 150,  energyCost: 7,  goldReward: [30, 55]  },
    { name: '困难', fruitTypes: 6, stickCount: 8, capacity: 5, shuffleMoves: 220,  energyCost: 10, goldReward: [45, 75]  },
    { name: '噩梦', fruitTypes: 7, stickCount: 8, capacity: 6, shuffleMoves: 300,  energyCost: 13, goldReward: [65, 100] },
    { name: '地狱', fruitTypes: 8, stickCount: 9, capacity: 6, shuffleMoves: 400,  energyCost: 16, goldReward: [85, 130] },
    { name: '炼狱', fruitTypes: 9, stickCount: 10, capacity: 7, shuffleMoves: 500, energyCost: 20, goldReward: [110, 170] },
    { name: '至尊', fruitTypes: 10, stickCount: 11, capacity: 7, shuffleMoves: 650, energyCost: 24, goldReward: [140, 220] },
    { name: '修罗', fruitTypes: 11, stickCount: 12, capacity: 8, shuffleMoves: 800, energyCost: 28, goldReward: [180, 280] },
    { name: '天道', fruitTypes: 12, stickCount: 13, capacity: 8, shuffleMoves: 1000, energyCost: 32, goldReward: [230, 350] },
  ];

  // ===== 运行时状态 =====
  let tanghuluState = {
    active: false,
    sticks: [],          // [{fruits: ['strawberry', 'grape', ...]}]  每根竹签最多4颗
    difficulty: null,
    fruitTypes: [],      // 本局使用的水果key列表
    moveCount: 0,
    selectedStick: null, // 选中的竹签索引
    historyStack: [],    // 移动历史 [{from, to, count}]
    propsUsed: { extraStick: 0, undo: 0, lubricant: 0 },
    lubricantMode: false,
    lubricantFrom: null,
    energyCost: 0,
    confirmed: false,    // 是否已确认开局（显示难度和体力消耗）
  };

  let isTanghuluOpen = false;

  // ===== 反向生成法：保证有解 =====
  function tanghuluGenerateLevel() {
    const diff = TANGHULU_DIFFICULTIES[Math.floor(Math.random() * TANGHULU_DIFFICULTIES.length)];
    tanghuluState.difficulty = diff;
    tanghuluState.energyCost = diff.energyCost;
    tanghuluState.confirmed = false;

    const K = diff.fruitTypes;
    const totalSticks = diff.stickCount; // K根有水果 + 2根空

    // 选择水果种类
    const available = [...TANGHULU_FRUITS];
    const selectedFruits = [];
    for (let i = 0; i < K && available.length > 0; i++) {
      const idx = Math.floor(Math.random() * available.length);
      selectedFruits.push(available.splice(idx, 1)[0]);
    }
    tanghuluState.fruitTypes = selectedFruits.map(f => f.key);

    // 步骤1：创建完美状态（前K根各穿capacity颗同色，后面空签）
    const cap = diff.capacity || 4;
    const sticks = [];
    for (let i = 0; i < K; i++) {
      const fruitArr = [];
      for (let j = 0; j < cap; j++) fruitArr.push(selectedFruits[i].key);
      sticks.push({ fruits: fruitArr });
    }
    // 空竹签（至少2根）
    const emptyCount = totalSticks - K;
    for (let i = 0; i < emptyCount; i++) {
      sticks.push({ fruits: [] });
    }

    // 步骤2：反向打乱（执行M次随机合法移动）
    for (let m = 0; m < diff.shuffleMoves; m++) {
      // 找所有有水果的竹签
      const nonEmpty = [];
      for (let i = 0; i < sticks.length; i++) {
        if (sticks[i].fruits.length > 0) nonEmpty.push(i);
      }
      if (nonEmpty.length === 0) break;

      // 随机选一根源竹签
      const fromIdx = nonEmpty[Math.floor(Math.random() * nonEmpty.length)];
      const fromStick = sticks[fromIdx];

      // 找所有可以接收的竹签（未满的）
      const targets = [];
      for (let i = 0; i < sticks.length; i++) {
        if (i === fromIdx) continue;
      if (sticks[i].fruits.length < cap) targets.push(i);
      }
      if (targets.length === 0) continue;

      const toIdx = targets[Math.floor(Math.random() * targets.length)];
      // 移动顶端水果
      const fruit = fromStick.fruits.shift();
      sticks[toIdx].fruits.unshift(fruit);
    }

    tanghuluState.sticks = sticks;
    tanghuluState.moveCount = 0;
    tanghuluState.selectedStick = null;
    tanghuluState.historyStack = [];
    tanghuluState.propsUsed = { extraStick: 0, undo: 0, lubricant: 0 };
    tanghuluState.lubricantMode = false;
    tanghuluState.lubricantFrom = null;
    tanghuluState.active = true;

    return true;
  }

  // ===== 检查通关 =====
  function tanghuluCheckWin() {
    for (const stick of tanghuluState.sticks) {
      if (stick.fruits.length === 0) continue;
      const cap = tanghuluState.difficulty?.capacity || 4;
      if (stick.fruits.length !== cap) return false;
      const first = stick.fruits[0];
      if (!stick.fruits.every(f => f === first)) return false;
    }
    return true;
  }

  // ===== 移动水果 =====
  function tanghuluMoveFruits(fromIdx, toIdx) {
    if (fromIdx === toIdx) return false;
    const from = tanghuluState.sticks[fromIdx];
    const to = tanghuluState.sticks[toIdx];

    if (from.fruits.length === 0) return false;
    const cap = tanghuluState.difficulty?.capacity || 4;
    if (to.fruits.length >= cap) return false;

    const topFruit = from.fruits[0];

    // 目标非空时，顶端必须相同
    if (to.fruits.length > 0 && to.fruits[0] !== topFruit) return false;

    // 计算可以连带移动的数量（从顶端开始连续相同的）
    let moveCount = 1;
    for (let i = 1; i < from.fruits.length; i++) {
      if (from.fruits[i] === topFruit) moveCount++;
      else break;
    }

    // 目标竹签空位
    const availableSlots = cap - to.fruits.length;
    moveCount = Math.min(moveCount, availableSlots);

    // 执行移动（从数组头部取出，插入目标头部）
    const moved = from.fruits.splice(0, moveCount);
    to.fruits.unshift(...moved);

    // 记录历史
    tanghuluState.historyStack.push({ from: fromIdx, to: toIdx, count: moveCount });
    tanghuluState.moveCount++;

    return true;
  }

  // ===== 强制移动（顺滑剂）=====
  function tanghuluForceMove(fromIdx, toIdx) {
    if (fromIdx === toIdx) return false;
    const from = tanghuluState.sticks[fromIdx];
    const to = tanghuluState.sticks[toIdx];

    if (from.fruits.length === 0) return false;
    const cap = tanghuluState.difficulty?.capacity || 4;
    if (to.fruits.length >= cap) return false;

    // 只移动一颗（顶端），无视颜色规则
    const fruit = from.fruits.shift();
    to.fruits.unshift(fruit);

    tanghuluState.historyStack.push({ from: fromIdx, to: toIdx, count: 1, forced: true });
    tanghuluState.moveCount++;
    return true;
  }

  // ===== 撤销 =====
  function tanghuluUndo() {
    if (tanghuluState.historyStack.length === 0) {
      tanghuluShowNotice('没有可以撤销的操作了');
      return;
    }

    if (tanghuluState.propsUsed.undo >= TANGHULU_PROPS.undo.perGameLimit) {
      tanghuluShowNotice(`悔步撤销本局已用完（限${TANGHULU_PROPS.undo.perGameLimit}次）`);
      return;
    }

    if (!state.tanghuluPropInventory) state.tanghuluPropInventory = { extraStick: 0, undo: 0, lubricant: 0 };
    if ((state.tanghuluPropInventory.undo || 0) <= 0) {
      tanghuluShowNotice('悔步撤销库存不足！去商店购买吧');
      return;
    }

    state.tanghuluPropInventory.undo--;
    tanghuluState.propsUsed.undo++;

    const last = tanghuluState.historyStack.pop();
    const from = tanghuluState.sticks[last.to];
    const to = tanghuluState.sticks[last.from];

    const moved = from.fruits.splice(0, last.count);
    to.fruits.unshift(...moved);
    tanghuluState.moveCount--;

    tanghuluShowNotice('↩️ 已撤销上一步！');
    saveDataDebounced('糖葫芦撤销');
    tanghuluRender();
  }

  // ===== 使用赠送竹签 =====
  function tanghuluUseExtraStick() {
    if (tanghuluState.propsUsed.extraStick >= TANGHULU_PROPS.extraStick.perGameLimit) {
      tanghuluShowNotice(`赠送竹签本局已用完（限${TANGHULU_PROPS.extraStick.perGameLimit}次）`);
      return;
    }
    if (!state.tanghuluPropInventory) state.tanghuluPropInventory = { extraStick: 0, undo: 0, lubricant: 0 };
    if ((state.tanghuluPropInventory.extraStick || 0) <= 0) {
      tanghuluShowNotice('赠送竹签库存不足！去商店购买吧');
      return;
    }

    state.tanghuluPropInventory.extraStick--;
    tanghuluState.propsUsed.extraStick++;
    tanghuluState.sticks.push({ fruits: [] });

    tanghuluShowNotice('🥢 获得了一根空竹签！');
    saveDataDebounced('糖葫芦赠送竹签');
    tanghuluRender();
  }

  // ===== 使用顺滑剂 =====
  function tanghuluUseLubricant() {
    if (tanghuluState.propsUsed.lubricant >= TANGHULU_PROPS.lubricant.perGameLimit) {
      tanghuluShowNotice(`顺滑剂本局已用完（限${TANGHULU_PROPS.lubricant.perGameLimit}次）`);
      return;
    }
    if (!state.tanghuluPropInventory) state.tanghuluPropInventory = { extraStick: 0, undo: 0, lubricant: 0 };
    if ((state.tanghuluPropInventory.lubricant || 0) <= 0) {
      tanghuluShowNotice('顺滑剂库存不足！去商店购买吧');
      return;
    }

    tanghuluState.lubricantMode = true;
    tanghuluState.lubricantFrom = null;
    tanghuluState.selectedStick = null;
    tanghuluShowNotice('🌀 顺滑剂已激活！选择源竹签，再选择目标竹签');
    tanghuluRender();
  }

  // ===== 点击竹签 =====
  function tanghuluClickStick(idx) {
    if (!tanghuluState.active) return;

    // 顺滑剂模式
    if (tanghuluState.lubricantMode) {
      if (tanghuluState.lubricantFrom === null) {
        if (tanghuluState.sticks[idx].fruits.length === 0) {
          tanghuluShowNotice('源竹签没有水果！');
          return;
        }
        tanghuluState.lubricantFrom = idx;
        tanghuluState.selectedStick = idx;
        tanghuluShowNotice('🌀 已选源竹签，现在点击目标竹签');
        tanghuluRender();
        return;
      } else {
        const success = tanghuluForceMove(tanghuluState.lubricantFrom, idx);
        if (success) {
          state.tanghuluPropInventory.lubricant--;
          tanghuluState.propsUsed.lubricant++;
          tanghuluShowNotice('🌀 顺滑剂生效！水果已强行移动');
        } else {
          tanghuluShowNotice('目标竹签已满，无法移动！');
        }
        tanghuluState.lubricantMode = false;
        tanghuluState.lubricantFrom = null;
        tanghuluState.selectedStick = null;
        saveDataDebounced('糖葫芦顺滑剂');
        tanghuluRender();

        // 检查通关
        if (success && tanghuluCheckWin()) {
          tanghuluState.active = false;
          setTimeout(() => tanghuluGameOver(), 500);
        }
        return;
      }
    }

    // 普通模式
    if (tanghuluState.selectedStick === null) {
      // 选中竹签
      if (tanghuluState.sticks[idx].fruits.length === 0) return;
      tanghuluState.selectedStick = idx;
      tanghuluRender();
    } else {
      // 尝试移动
      if (tanghuluState.selectedStick === idx) {
        // 取消选择
        tanghuluState.selectedStick = null;
        tanghuluRender();
        return;
      }

      const success = tanghuluMoveFruits(tanghuluState.selectedStick, idx);
      tanghuluState.selectedStick = null;

      if (success) {
        saveDataDebounced('糖葫芦移动');
        tanghuluRender();

        // 检查通关
        if (tanghuluCheckWin()) {
          tanghuluState.active = false;
          setTimeout(() => tanghuluGameOver(), 500);
        }
      } else {
        tanghuluShowNotice('无法移动！目标已满或水果不匹配');
        tanghuluRender();
      }
    }
  }

  // ===== 游戏结算 =====
  function tanghuluGameOver() {
    const diff = tanghuluState.difficulty;
    const K = diff.fruitTypes;

    // 金币奖励
    const minGold = diff.goldReward[0];
    const maxGold = diff.goldReward[1];
    const goldReward = minGold + Math.floor(Math.random() * (maxGold - minGold + 1));
    state.gameGold += goldReward;

    // 桌宠心情+1
    state.mood = 'happy';
    updateMood();
    updateStatusBars();

    // 糖葫芦存入库存（每种完成的糖葫芦存一串）
    if (!state.tanghuluInventory) state.tanghuluInventory = [];
    tanghuluState.fruitTypes.forEach(fruitKey => {
      const existing = state.tanghuluInventory.find(i => i.fruitKey === fruitKey);
      if (existing) {
        existing.count++;
      } else {
        state.tanghuluInventory.push({ fruitKey, count: 1 });
      }
    });

    // 低概率掉落完美的亮晶晶糖砂（10%概率）
    let gotCrystal = false;
    if (Math.random() < 0.1) {
      if (!state.tanghuluSugarCrystal) state.tanghuluSugarCrystal = 0;
      state.tanghuluSugarCrystal++;
      gotCrystal = true;
    }

    saveDataImmediate('糖葫芦通关');
    checkAchievements();

    // 弹出结算面板
    const panel = document.getElementById('sp-tanghulu-panel');
    if (!panel) return;
    panel.querySelector('#sp-tanghulu-result-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'sp-tanghulu-result-overlay';
    overlay.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:10;border-radius:16px;';
    overlay.innerHTML = `
      <div class="sp-fridge-result-box">
        <div class="sp-fridge-result-title">🎉 糖葫芦做好啦！</div>
        <div class="sp-fridge-result-info">
          <div>难度: ${diff.name}（${K}种水果）</div>
          <div>步数: ${tanghuluState.moveCount} 步</div>
          <div>通关奖励: +${goldReward} 🪙</div>
          <div>心情 +1 😊</div>
          <div>${K}串糖葫芦已存入库存！</div>
          ${gotCrystal ? '<div style="color:#ffb347;font-weight:700;margin-top:6px;">✨ 获得了「完美的亮晶晶糖砂」！</div>' : ''}
        </div>
        <div class="sp-fridge-result-actions">
          <button class="sp-fridge-result-btn" id="sp-tanghulu-restart">🔄 再来一局</button>
          <button class="sp-fridge-result-btn sp-fridge-result-close" id="sp-tanghulu-quit">❌ 退出</button>
        </div>
      </div>
    `;
    panel.appendChild(overlay);

    document.getElementById('sp-tanghulu-restart')?.addEventListener('click', () => {
      overlay.remove();
      tanghuluConfirmNewGame();
    });
    document.getElementById('sp-tanghulu-quit')?.addEventListener('click', () => {
      overlay.remove();
      toggleTanghuluGame();
    });

  }

  // ===== 商店购买 =====
  function tanghuluBuyProp(propKey) {
    const prop = TANGHULU_PROPS[propKey];
    if (!prop) return;

    if (state.gameGold < prop.price) {
      tanghuluShowNotice(`金币不足！需要 ${prop.price} 🪙`);
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    if (!state.tanghuluPropShopLog) state.tanghuluPropShopLog = {};
    if (!state.tanghuluPropShopLog[today]) state.tanghuluPropShopLog[today] = {};
    const bought = state.tanghuluPropShopLog[today][propKey] || 0;
    if (bought >= prop.dailyLimit) {
      tanghuluShowNotice(`${prop.name} 今日已售罄（限${prop.dailyLimit}个/天）`);
      return;
    }

    state.gameGold -= prop.price;
    state.tanghuluPropShopLog[today][propKey] = bought + 1;
    if (!state.tanghuluPropInventory) state.tanghuluPropInventory = { extraStick: 0, undo: 0, lubricant: 0 };
    state.tanghuluPropInventory[propKey] = (state.tanghuluPropInventory[propKey] || 0) + 1;

    tanghuluShowNotice(`购买了 ${prop.name}，已放入背包！`);
    saveDataDebounced('糖葫芦商店购买');
    tanghuluRenderShop();
    tanghuluRenderBag();
    const goldEl = document.getElementById('sp-tanghulu-gold');
    if (goldEl) goldEl.textContent = state.gameGold;
  }

  // ===== 渲染库存标签页 =====
  function tanghuluRenderInventory() {
    const container = document.getElementById('sp-tanghulu-inventory-content');
    if (!container) return;

    let html = '';

    // 糖葫芦成品库存
    const tangInv = (state.tanghuluInventory || []).filter(i => i.count > 0);
    html += `<div style="font-size:11px;font-weight:600;color:var(--sp-text-primary);margin-bottom:6px;">🍢 糖葫芦成品</div>`;
    if (tangInv.length === 0) {
      html += '<div style="text-align:center;padding:10px;color:var(--sp-text-muted);font-size:11px;">还没有做好的糖葫芦～去玩一局吧</div>';
    } else {
      tangInv.forEach(inv => {
        const data = TANGHULU_FRUITS.find(f => f.key === inv.fruitKey);
        if (!data) return;
        html += `
          <div class="sp-link-bag-item">
            <span class="sp-link-bag-icon">${data.emoji}</span>
            <div class="sp-link-bag-info">
              <span class="sp-link-bag-name">${data.name}糖葫芦</span>
              <span class="sp-link-bag-desc">投喂 +${data.feedAmount} | 售价 ${data.sellPrice}🪙</span>
            </div>
            <span class="sp-link-bag-count">×${inv.count}</span>
          </div>
        `;
      });
    }

    // 完美的亮晶晶糖砂
    const crystalCount = state.tanghuluSugarCrystal || 0;
    html += `<div style="font-size:11px;font-weight:600;color:var(--sp-text-primary);margin:12px 0 6px;">✨ 珍贵收藏</div>`;
    if (crystalCount > 0) {
      html += `
        <div class="sp-link-bag-item">
          <span class="sp-link-bag-icon">✨</span>
          <div class="sp-link-bag-info">
            <span class="sp-link-bag-name">完美的亮晶晶糖砂</span>
            <span class="sp-link-bag-desc">投喂 +50饱食 +20心情 | 售价 150🪙</span>
          </div>
          <span class="sp-link-bag-count">×${crystalCount}</span>
        </div>
      `;
    } else {
      html += '<div style="text-align:center;padding:10px;color:var(--sp-text-muted);font-size:11px;">暂无（通关后有概率掉落）</div>';
    }

    // 道具库存
    if (!state.tanghuluPropInventory) state.tanghuluPropInventory = { extraStick: 0, undo: 0, lubricant: 0 };
    const propDefs = [
      { key: 'extraStick', emoji: '🥢', name: '赠送竹签', desc: TANGHULU_PROPS.extraStick.desc },
      { key: 'undo', emoji: '↩️', name: '悔步撤销', desc: TANGHULU_PROPS.undo.desc },
      { key: 'lubricant', emoji: '🌀', name: '顺滑剂', desc: TANGHULU_PROPS.lubricant.desc },
    ];
    const hasAnyProp = propDefs.some(p => (state.tanghuluPropInventory[p.key] || 0) > 0);

    html += `<div style="font-size:11px;font-weight:600;color:var(--sp-text-primary);margin:12px 0 6px;">🧰 道具库存</div>`;
    if (!hasAnyProp) {
      html += '<div style="text-align:center;padding:10px;color:var(--sp-text-muted);font-size:11px;">道具空空如也～去商城买点吧</div>';
    } else {
      propDefs.filter(p => (state.tanghuluPropInventory[p.key] || 0) > 0).forEach(p => {
        html += `
          <div class="sp-link-bag-item">
            <span class="sp-link-bag-icon">${p.emoji}</span>
            <div class="sp-link-bag-info">
              <span class="sp-link-bag-name">${p.name}</span>
              <span class="sp-link-bag-desc">${p.desc}</span>
            </div>
            <span class="sp-link-bag-count">×${state.tanghuluPropInventory[p.key]}</span>
          </div>
        `;
      });
    }

    container.innerHTML = html;
  }

  // ===== 糖葫芦水果图鉴渲染 =====
  function tanghuluRenderCollection() {
    const grid = document.getElementById('sp-tanghulu-collection-grid');
    if (!grid) return;
    if (!state.gameCustomImages) state.gameCustomImages = {};

    grid.innerHTML = TANGHULU_FRUITS.map((fruit, idx) => {
      const key = `tanghulu_fruit_${fruit.key}`;
      const custom = state.gameCustomImages[key];
      const display = custom
        ? `<img src="${custom}" style="width:28px;height:28px;object-fit:contain;border-radius:50%;" />`
        : `<span style="font-size:22px;">${fruit.emoji}</span>`;
      return `
        <div style="aspect-ratio:1;border-radius:8px;border:2px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;position:relative;cursor:pointer;overflow:hidden;transition:all 0.15s;" data-tanghulu-fruit-key="${fruit.key}">
          ${display}
          <span style="font-size:8px;color:var(--sp-text-muted);text-align:center;">${fruit.name}</span>
          <div class="sp-tanghulu-fruit-upload" data-key="${fruit.key}" style="position:absolute;top:2px;right:2px;width:16px;height:16px;border-radius:50%;background:rgba(0,0,0,0.6);color:#fff;font-size:9px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity 0.2s;">📷</div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('[data-tanghulu-fruit-key]').forEach(item => {
      item.addEventListener('mouseenter', () => {
        const btn = item.querySelector('.sp-tanghulu-fruit-upload');
        if (btn) btn.style.opacity = '1';
      });
      item.addEventListener('mouseleave', () => {
        const btn = item.querySelector('.sp-tanghulu-fruit-upload');
        if (btn) btn.style.opacity = '0';
      });
    });

    grid.querySelectorAll('.sp-tanghulu-fruit-upload').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        tanghuluPromptFruitUpload(btn.dataset.key);
      });
    });
  }

  // ===== 糖葫芦水果图片上传 =====
  function tanghuluPromptFruitUpload(fruitKey) {
    const fruit = TANGHULU_FRUITS.find(f => f.key === fruitKey);
    const key = `tanghulu_fruit_${fruitKey}`;
    if (!state.gameCustomImages) state.gameCustomImages = {};
    const currentImg = state.gameCustomImages[key];

    // 如果已有图片，先问是否要移除
    if (currentImg) {
      const action = confirm(`「${fruit?.name || fruitKey}」已有自定义图片\n\n点「确定」→ 移除图片（恢复默认emoji）\n点「取消」→ 替换为新图片`);
      if (action) {
        delete state.gameCustomImages[key];
        saveDataImmediate('糖葫芦水果图片移除');
        tanghuluRenderCollection();
        tanghuluShowNotice('图片已移除，恢复默认显示');
        return;
      }
    }

    const choice = confirm(`设置水果「${fruit?.name || fruitKey}」的自定义图片\n\n⭐ 推荐：点「确定」→ 输入图片链接（节省内存）\n点「取消」→ 选择本地文件上传`);

    if (choice) {
      const url = prompt('输入图片链接（留空确认=清除）：', currentImg && currentImg.startsWith('http') ? currentImg : '');
      if (url === null) return;
      const trimmed = url.trim();
      if (!trimmed) {
        delete state.gameCustomImages[key];
        saveDataImmediate('糖葫芦水果图片清除');
        tanghuluRenderCollection();
        tanghuluShowNotice('图片已清除');
        return;
      }
      if (!trimmed.startsWith('http')) {
        tanghuluShowNotice('请输入以 http 开头的链接');
        return;
      }
      state.gameCustomImages[key] = trimmed;
      saveDataImmediate('糖葫芦水果图片链接');
      tanghuluRenderCollection();
      tanghuluShowNotice('图片链接已设置！');
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/png,image/jpeg,image/gif,image/webp';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
          tanghuluShowNotice('图片不能超过2MB，推荐使用图片链接');
          return;
        }
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const compressed = await compressImage(ev.target.result, 80, 0.7);
          if (!state.gameCustomImages) state.gameCustomImages = {};
          state.gameCustomImages[key] = compressed;
          saveDataImmediate('糖葫芦水果图片上传');
          tanghuluRenderCollection();
          tanghuluShowNotice('图片已设置！（提示：使用链接可节省存储空间）');
        };
        reader.readAsDataURL(file);
      };
      input.click();
    }
  }


  // ===== 卖糖葫芦 =====
  function tanghuluSellItem(fruitKey) {
    const inv = (state.tanghuluInventory || []).find(i => i.fruitKey === fruitKey && i.count > 0);
    if (!inv) { tanghuluShowNotice('没有可卖的糖葫芦'); return; }
    const data = TANGHULU_FRUITS.find(f => f.key === fruitKey);
    if (!data) return;
    inv.count--;
    if (inv.count <= 0) {
      state.tanghuluInventory = state.tanghuluInventory.filter(i => i.count > 0);
    }
    state.gameGold += data.sellPrice;
    tanghuluShowNotice(`售出 ${data.emoji} ${data.name}糖葫芦，获得 ${data.sellPrice} 🪙！`);
    saveDataDebounced('卖糖葫芦');
    tanghuluRenderShop();
    const goldEl = document.getElementById('sp-tanghulu-gold');
    if (goldEl) goldEl.textContent = state.gameGold;
  }

  // ===== 卖糖砂 =====
  function tanghuluSellCrystal() {
    if ((state.tanghuluSugarCrystal || 0) <= 0) {
      tanghuluShowNotice('没有糖砂可卖');
      return;
    }
    state.tanghuluSugarCrystal--;
    state.gameGold += 150;
    tanghuluShowNotice('售出 ✨ 完美的亮晶晶糖砂，获得 150 🪙！');
    saveDataDebounced('卖糖砂');
    tanghuluRenderShop();
    const goldEl = document.getElementById('sp-tanghulu-gold');
    if (goldEl) goldEl.textContent = state.gameGold;
  }

  // ===== 通知 =====
  function tanghuluShowNotice(text) {
    const notice = document.getElementById('sp-tanghulu-notice');
    if (!notice) return;
    notice.textContent = text;
    notice.classList.add('visible');
    clearTimeout(notice._timer);
    notice._timer = setTimeout(() => notice.classList.remove('visible'), 3000);
  }

  // ===== 渲染竹签棋盘 =====
  function tanghuluRender() {
    const boardEl = document.getElementById('sp-tanghulu-board');
    const infoEl = document.getElementById('sp-tanghulu-info');
    if (!boardEl) return;

    const { sticks, selectedStick, lubricantMode } = tanghuluState;

    boardEl.innerHTML = sticks.map((stick, idx) => {
      const isSelected = selectedStick === idx;
      const isLubFrom = lubricantMode && tanghuluState.lubricantFrom === idx;
      const selectedClass = (isSelected || isLubFrom) ? ' sp-tanghulu-stick-selected' : '';

      const fruitsHtml = stick.fruits.map((fruitKey, fi) => {
        const data = TANGHULU_FRUITS.find(f => f.key === fruitKey);
        const isTop = fi === 0;
        return `<div class="sp-tanghulu-fruit ${isTop && isSelected ? 'sp-tanghulu-fruit-top' : ''}" style="background:${data ? data.color : '#888'};" title="${data ? data.name : '?'}">${data ? data.emoji : '?'}</div>`;
      }).join('');

      // 空位占位
      const cap = tanghuluState.difficulty?.capacity || 4;
      const emptySlots = cap - stick.fruits.length;
      let emptyHtml = '';
      for (let i = 0; i < emptySlots; i++) {
        emptyHtml += '<div class="sp-tanghulu-slot-empty"></div>';
      }

      return `
        <div class="sp-tanghulu-stick${selectedClass}" data-stick-idx="${idx}">
          <div class="sp-tanghulu-stick-fruits">
            ${emptyHtml}
            ${fruitsHtml}
          </div>
          <div class="sp-tanghulu-stick-base"></div>
          <div class="sp-tanghulu-stick-label">${stick.fruits.length}/${tanghuluState.difficulty?.capacity || 4}</div>
        </div>
      `;
    }).join('');

    // 绑定点击
    boardEl.querySelectorAll('.sp-tanghulu-stick').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.stickIdx);
        tanghuluClickStick(idx);
      });
    });

    // 信息栏
    if (infoEl) {
      const modeText = lubricantMode ? ' | 🌀顺滑剂模式' : '';
      infoEl.innerHTML = `
        <span>步数: ${tanghuluState.moveCount}</span>
        <span>难度: ${tanghuluState.difficulty?.name || '-'}</span>
        <span>水果: ${tanghuluState.difficulty?.fruitTypes || 0}种${modeText}</span>
      `;
    }

    // 道具状态
    if (!state.tanghuluPropInventory) state.tanghuluPropInventory = { extraStick: 0, undo: 0, lubricant: 0 };
    const esEl = document.getElementById('sp-tanghulu-prop-es-count');
    const undoEl = document.getElementById('sp-tanghulu-prop-undo-count');
    const lubEl = document.getElementById('sp-tanghulu-prop-lub-count');
    if (esEl) esEl.textContent = `×${state.tanghuluPropInventory.extraStick || 0} (${tanghuluState.propsUsed.extraStick}/${TANGHULU_PROPS.extraStick.perGameLimit})`;
    if (undoEl) undoEl.textContent = `×${state.tanghuluPropInventory.undo || 0} (${tanghuluState.propsUsed.undo}/${TANGHULU_PROPS.undo.perGameLimit})`;
    if (lubEl) lubEl.textContent = `×${state.tanghuluPropInventory.lubricant || 0} (${tanghuluState.propsUsed.lubricant}/${TANGHULU_PROPS.lubricant.perGameLimit})`;

    // 金币
    const goldEl = document.getElementById('sp-tanghulu-gold');
    if (goldEl) goldEl.textContent = state.gameGold;

    // 控制开始按钮显示/隐藏
    const startWrapper = document.getElementById('sp-tanghulu-start-wrapper');
    if (startWrapper) startWrapper.style.display = tanghuluState.active ? 'none' : 'flex';

  }

  // ===== 渲染背包 =====
  function tanghuluRenderBag() {
    const container = document.getElementById('sp-tanghulu-bag-content');
    if (!container) return;
    if (!state.tanghuluPropInventory) state.tanghuluPropInventory = { extraStick: 0, undo: 0, lubricant: 0 };

    const items = Object.entries(TANGHULU_PROPS).map(([key, prop]) => ({
      key, ...prop, count: state.tanghuluPropInventory[key] || 0
    }));

    const hasAny = items.some(i => i.count > 0);

    container.innerHTML = hasAny ? items.map(item => `
      <div class="sp-link-bag-item ${item.count <= 0 ? 'sp-link-bag-empty' : ''}">
        <span class="sp-link-bag-icon">${item.name.split(' ')[0]}</span>
        <div class="sp-link-bag-info">
          <span class="sp-link-bag-name">${item.name.split(' ').slice(1).join(' ')}</span>
          <span class="sp-link-bag-desc">${item.desc} | 每局限${item.perGameLimit}次</span>
        </div>
        <span class="sp-link-bag-count">×${item.count}</span>
      </div>
    `).join('') : '<div style="text-align:center;padding:20px;color:var(--sp-text-muted);font-size:12px;">道具背包空空如也～去商店买吧</div>';
  }

  // ===== 渲染商店（含卖糖葫芦功能）=====
  function tanghuluRenderShop() {
    const container = document.getElementById('sp-tanghulu-shop-content');
    if (!container) return;

    const today = new Date().toISOString().slice(0, 10);
    const todayLog = (state.tanghuluPropShopLog && state.tanghuluPropShopLog[today]) || {};

    // 道具购买区
    const propItems = Object.entries(TANGHULU_PROPS).map(([key, prop]) => {
      const bought = todayLog[key] || 0;
      const soldOut = bought >= prop.dailyLimit;
      const cantAfford = state.gameGold < prop.price;
      const disabled = soldOut || cantAfford;
      const stock = state.tanghuluPropInventory?.[key] || 0;
      return { key, ...prop, bought, soldOut, disabled, stock };
    });

    let html = `<div style="font-size:11px;font-weight:600;color:var(--sp-text-primary);margin-bottom:6px;">🛒 道具购买</div>`;
    html += propItems.map(item => `
      <div class="sp-link-shop-item ${item.disabled ? 'sp-link-shop-disabled' : ''}">
        <span class="sp-link-shop-icon">${item.name.split(' ')[0]}</span>
        <div class="sp-link-shop-info">
          <span class="sp-link-shop-name">${item.name.split(' ').slice(1).join(' ')}</span>
          <span class="sp-link-shop-desc">${item.desc}</span>
          <span style="font-size:9px;color:var(--sp-text-muted);">${item.soldOut ? '今日售罄' : `今日剩 ${item.dailyLimit - item.bought}`} | 背包: ${item.stock}</span>
        </div>
        <button class="sp-link-shop-buy sp-tanghulu-buy-btn" data-prop="${item.key}" ${item.disabled ? 'disabled' : ''}>🪙${item.price}</button>
      </div>
    `).join('');

    // 卖糖葫芦区
    const tangInv = (state.tanghuluInventory || []).filter(i => i.count > 0);
    const crystalCount = state.tanghuluSugarCrystal || 0;

    if (tangInv.length > 0 || crystalCount > 0) {
      html += `<div style="font-size:11px;font-weight:600;color:var(--sp-text-primary);margin:12px 0 6px;">💰 卖糖葫芦</div>`;
      tangInv.forEach(inv => {
        const data = TANGHULU_FRUITS.find(f => f.key === inv.fruitKey);
        if (!data) return;
        html += `
          <div class="sp-link-shop-item">
            <span class="sp-link-shop-icon">${data.emoji}</span>
            <div class="sp-link-shop-info">
              <span class="sp-link-shop-name">${data.name}糖葫芦</span>
              <span class="sp-link-shop-desc">库存: ${inv.count}</span>
            </div>
            <button class="sp-link-shop-buy sp-tanghulu-sell-btn" data-fruit="${inv.fruitKey}">卖 +${data.sellPrice}🪙</button>
          </div>
        `;
      });
      if (crystalCount > 0) {
        html += `
          <div class="sp-link-shop-item">
            <span class="sp-link-shop-icon">✨</span>
            <div class="sp-link-shop-info">
              <span class="sp-link-shop-name">完美的亮晶晶糖砂</span>
              <span class="sp-link-shop-desc">库存: ${crystalCount}</span>
            </div>
            <button class="sp-link-shop-buy sp-tanghulu-sell-crystal-btn">卖 +150🪙</button>
          </div>
        `;
      }
    }

    container.innerHTML = html;

    // 绑定事件
    container.querySelectorAll('.sp-tanghulu-buy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        tanghuluBuyProp(btn.dataset.prop);
      });
    });
    container.querySelectorAll('.sp-tanghulu-sell-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        tanghuluSellItem(btn.dataset.fruit);
      });
    });
    container.querySelectorAll('.sp-tanghulu-sell-crystal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        tanghuluSellCrystal();
      });
    });
  }

  // ===== 渲染面板 =====
  function tanghuluRenderPanel() {
    let panel = document.getElementById('sp-tanghulu-panel');
    if (panel) panel.remove();

    panel = document.createElement('div');
    panel.id = 'sp-tanghulu-panel';
    panel.innerHTML = `
      <div id="sp-tanghulu-header">
        <span>🍢 糖葫芦工坊</span>
        <div class="sp-link-header-right">
          <button id="sp-tanghulu-minimize" title="缩小悬挂" style="background:none;border:none;font-size:14px;cursor:pointer;color:var(--sp-text-muted);padding:2px 6px;">─</button>
          <button id="sp-tanghulu-close" title="关闭" style="background:none;border:none;font-size:16px;cursor:pointer;color:var(--sp-text-muted);padding:2px 6px;border-radius:4px;transition:color 0.2s;">✕</button>
        </div>
      </div>
      <div id="sp-tanghulu-notice"></div>
      <div style="display:flex;gap:4px;padding:6px 10px;background:rgba(255,255,255,0.03);border-bottom:1px solid var(--sp-border-light);align-items:center;">
        <button class="sp-game-tab active" data-thtab="play" id="sp-tanghulu-tab-play">🎮 游戏</button>
        <button class="sp-game-tab" data-thtab="bag" id="sp-tanghulu-tab-bag">🎒 背包</button>
        <button class="sp-game-tab" data-thtab="shop" id="sp-tanghulu-tab-shop">🛒 商城</button>
        <button class="sp-game-tab" data-thtab="inventory" id="sp-tanghulu-tab-inventory">📦 库存</button>
        <button class="sp-game-tab" data-thtab="collection" id="sp-tanghulu-tab-collection">📖 图鉴</button>
        <span class="sp-link-gold-display" style="margin-left:auto;">🪙 <span id="sp-tanghulu-gold">
      </div>
      <div id="sp-tanghulu-body" style="flex:1;overflow-y:auto;padding:10px;">
        <div id="sp-tanghulu-tab-content-play">
          <div id="sp-tanghulu-info" style="display:flex;justify-content:space-around;padding:4px 8px;font-size:11px;color:var(--sp-text-secondary);background:rgba(255,255,255,0.03);border-radius:6px;margin-bottom:6px;"></div>
          <div id="sp-tanghulu-board" class="sp-tanghulu-board"></div>
          <div id="sp-tanghulu-props" style="display:flex;gap:6px;justify-content:center;margin-top:8px;flex-wrap:wrap;">
            <button class="sp-link-prop-btn" id="sp-tanghulu-prop-es" title="${TANGHULU_PROPS.extraStick.desc}">
              <span class="sp-link-prop-icon">🥢</span>
              <span class="sp-link-prop-name">赠送竹签</span>
              <span class="sp-link-prop-count" id="sp-tanghulu-prop-es-count">×0</span>
            </button>
            <button class="sp-link-prop-btn" id="sp-tanghulu-prop-undo" title="${TANGHULU_PROPS.undo.desc}">
              <span class="sp-link-prop-icon">↩️</span>
              <span class="sp-link-prop-name">悔步撤销</span>
              <span class="sp-link-prop-count" id="sp-tanghulu-prop-undo-count">×0</span>
            </button>
            <button class="sp-link-prop-btn" id="sp-tanghulu-prop-lub" title="${TANGHULU_PROPS.lubricant.desc}">
              <span class="sp-link-prop-icon">🌀</span>
              <span class="sp-link-prop-name">顺滑剂</span>
              <span class="sp-link-prop-count" id="sp-tanghulu-prop-lub-count">×0</span>
            </button>
          </div>
          <div style="height:8px;"></div>
          <div id="sp-tanghulu-start-wrapper" style="display:flex;justify-content:center;margin-bottom:8px;"><button class="sp-link-ctrl-btn" id="sp-tanghulu-start-btn" style="background:var(--sp-primary);color:#fff;border-color:var(--sp-primary-border);padding:10px 24px;font-size:13px;">✨ 开始游戏</button></div>
          <div style="display:flex;gap:8px;justify-content:center;">
            <button class="sp-link-ctrl-btn" id="sp-tanghulu-restart-btn">🔄 重开</button>
            <button class="sp-link-ctrl-btn sp-link-ctrl-quit" id="sp-tanghulu-quit-btn">❌ 放弃</button>
          </div>
        </div>
        <div id="sp-tanghulu-tab-content-bag" style="display:none;padding:8px;">
          <div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:8px;">🎒 道具背包</div>
          <div id="sp-tanghulu-bag-content"></div>
        </div>
        <div id="sp-tanghulu-tab-content-shop" style="display:none;padding:8px;">
          <div id="sp-tanghulu-shop-content"></div>
        </div>
        <div id="sp-tanghulu-tab-content-inventory" style="display:none;padding:8px;">
          <div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:8px;">📦 库存一览</div>
          <div id="sp-tanghulu-inventory-content"></div>
        </div>
        <div id="sp-tanghulu-tab-content-collection" style="display:none;padding:8px;">
          <div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:8px;">📖 水果图鉴 <span style="font-size:10px;color:var(--sp-text-muted);font-weight:400;">（点击 📷 设置图片，优先推荐链接节省内存）</span></div>
          <div id="sp-tanghulu-collection-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;"></div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // 最小化
    document.getElementById('sp-tanghulu-minimize').addEventListener('click', () => {
      const tp = document.getElementById('sp-tanghulu-panel');
      const minBtn = document.getElementById('sp-tanghulu-minimize');
      if (!tp || !minBtn) return;
      if (tp.classList.contains('sp-tanghulu-minimized')) {
        tp.classList.remove('sp-tanghulu-minimized');
        minBtn.textContent = '─';
      } else {
        tp.classList.add('sp-tanghulu-minimized');
        minBtn.textContent = '□';
      }
    });

    // 关闭
    document.getElementById('sp-tanghulu-close').addEventListener('click', () => toggleTanghuluGame());

    // 道具按钮
    document.getElementById('sp-tanghulu-prop-es').addEventListener('click', () => tanghuluUseExtraStick());
    document.getElementById('sp-tanghulu-prop-undo').addEventListener('click', () => tanghuluUndo());
    document.getElementById('sp-tanghulu-prop-lub').addEventListener('click', () => tanghuluUseLubricant());

    // 开始游戏按钮
    document.getElementById('sp-tanghulu-start-btn')?.addEventListener('click', () => {
      tanghuluConfirmNewGame();
    });

    // 重开
    document.getElementById('sp-tanghulu-restart-btn').addEventListener('click', () => {
      showConfirmDialog({
        title: '🔄 重开本局？',
        desc: '当前进度将清零，重新开始新的一局。',
        confirmText: '重开',
        cancelText: '继续玩',
        onConfirm: () => {
          tanghuluGenerateLevel();
          tanghuluState.confirmed = true;
          if (state.gameStamina < tanghuluState.energyCost) {
            tanghuluShowNotice(`体力不足！需要 ${tanghuluState.energyCost} 点体力`);
            tanghuluState.active = false;
            return;
          }
          state.gameStamina -= tanghuluState.energyCost;
          saveDataDebounced('糖葫芦重开');
          tanghuluRender();
          tanghuluShowNotice(`🔄 新一局！难度: ${tanghuluState.difficulty.name} | -${tanghuluState.energyCost}⚡`);
          if (isGameOpen) gameRenderStatus();
        }
      });
    });

    // 放弃
    document.getElementById('sp-tanghulu-quit-btn').addEventListener('click', () => {
      showConfirmDialog({
        title: '❌ 放弃本局？',
        desc: '当前进度将丢失，体力不退还。',
        confirmText: '放弃',
        cancelText: '继续',
        onConfirm: () => {
          tanghuluState.active = false;
          isTanghuluOpen = false;
          const p = document.getElementById('sp-tanghulu-panel');
          if (p) p.classList.remove('visible');
        }
      });
    });

    // 标签页切换
    const thTabs = ['play', 'bag', 'shop', 'inventory', 'collection'];
    thTabs.forEach(tabName => {
      const tabBtn = document.getElementById(`sp-tanghulu-tab-${tabName}`);
      if (tabBtn) {
        tabBtn.addEventListener('click', () => {
          thTabs.forEach(t => {
            const b = document.getElementById(`sp-tanghulu-tab-${t}`);
            if (b) b.classList.toggle('active', t === tabName);
          });
          document.getElementById('sp-tanghulu-tab-content-play').style.display = tabName === 'play' ? '' : 'none';
          document.getElementById('sp-tanghulu-tab-content-bag').style.display = tabName === 'bag' ? '' : 'none';
          document.getElementById('sp-tanghulu-tab-content-shop').style.display = tabName === 'shop' ? '' : 'none';
          document.getElementById('sp-tanghulu-tab-content-inventory').style.display = tabName === 'inventory' ? '' : 'none';
          document.getElementById('sp-tanghulu-tab-content-collection').style.display = tabName === 'collection' ? '' : 'none';
          if (tabName === 'bag') tanghuluRenderBag();
          if (tabName === 'shop') tanghuluRenderShop();
          if (tabName === 'inventory') tanghuluRenderInventory();
          if (tabName === 'collection') tanghuluRenderCollection();
        });
      }
    });

    // 面板拖拽
    tanghuluBindPanelDrag();
  }

  // ===== 面板拖拽 =====
  function tanghuluBindPanelDrag() {
    const header = document.getElementById('sp-tanghulu-header');
    const panel = document.getElementById('sp-tanghulu-panel');
    if (!header || !panel) return;

    let dragging = false, offX = 0, offY = 0;

    const down = (e) => {
      if (e.target.closest('#sp-tanghulu-close') || e.target.closest('#sp-tanghulu-minimize')) return;
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

  // ===== 开局确认弹窗 =====
  function tanghuluConfirmNewGame() {
    showConfirmDialog({
      title: '🍢 开始做糖葫芦？',
      desc: '难度随机分配，确认后才会显示体力消耗。<br/>准备好了吗？',
      confirmText: '✨ 开始',
      cancelText: '算了',
      onConfirm: () => {
        gameRecoverStamina();
        tanghuluGenerateLevel();

        // 显示难度和体力消耗，让玩家二次确认
        showConfirmDialog({
          title: `🍢 本局难度：${tanghuluState.difficulty.name}`,
          desc: `水果种类: ${tanghuluState.difficulty.fruitTypes} 种<br/>竹签数量: ${tanghuluState.difficulty.stickCount} 根<br/>体力消耗: ${tanghuluState.energyCost} ⚡<br/><br/>当前体力: ${Math.floor(state.gameStamina)}/${state.gameStaminaMax}`,
          confirmText: '确认开始',
          cancelText: '换一局',
          onConfirm: () => {
            if (state.gameStamina < tanghuluState.energyCost) {
              tanghuluShowNotice(`体力不足！需要 ${tanghuluState.energyCost} 点体力`);
              tanghuluState.active = false;
              return;
            }
            state.gameStamina -= tanghuluState.energyCost;
            tanghuluState.confirmed = true;
            saveDataDebounced('糖葫芦开局');
            tanghuluRender();
            tanghuluShowNotice(`开局！难度: ${tanghuluState.difficulty.name} | -${tanghuluState.energyCost}⚡`);
            if (isGameOpen) gameRenderStatus();
          },
          onCancel: () => {
            // 重新生成
            tanghuluState.active = false;
            tanghuluConfirmNewGame();
          }
        });
      },
      onCancel: () => {
        // 不开局，留在游戏面板
      }

    });
  }

  // ===== 开关糖葫芦面板 =====
  function toggleTanghuluGame() {
    isTanghuluOpen = !isTanghuluOpen;
    let panel = document.getElementById('sp-tanghulu-panel');

    if (isTanghuluOpen) {
      // 每次打开都重新创建面板（动态挂载）
      if (panel) panel.remove();
      tanghuluRenderPanel();
      panel = document.getElementById('sp-tanghulu-panel');

      panel.classList.add('visible');

      const w = Math.min(420, window.innerWidth - 20);
      panel.style.width = w + 'px';
      requestAnimationFrame(() => {
        const h = panel.offsetHeight;
        const maxTop = window.innerHeight - h - 20;
        const centerTop = Math.floor((window.innerHeight - h) / 2);
        panel.style.left = Math.floor((window.innerWidth - w) / 2) + 'px';
        panel.style.top = Math.max(10, Math.min(centerTop, maxTop)) + 'px';
      });

      // 如果没有活跃游戏，只渲染面板，不自动弹窗
      tanghuluRender();

    } else {
      // 彻底销毁 DOM
      if (panel) panel.remove();
      tanghuluState.lubricantMode = false;
      tanghuluState.lubricantFrom = null;
    }

  }

  // ============================================================
  // 🐱 小猫餐厅游戏模块 - MeepCatRestaurant
  // ============================================================

  let isRestaurantOpen = false;
  let restaurantCustomerTimer = null;
  let restaurantCookTimer = null;
  let restaurantCountdownTimer = null;

  // 运行时状态（不持久化，面板打开时才有效）
  let restaurantRuntime = {
    customers: [],       // 当前等候中的客人 [{...customer, arriveTime, specificRecipe}]
    cooking: null,       // 当前正在烹饪 {recipeId, startTime, duration} 或 null
  };

  // ===== 获取餐厅等级信息 =====
  function restaurantGetLevel() {
    let result = RESTAURANT_LEVELS[0];
    for (const lvl of RESTAURANT_LEVELS) {
      if (state.restaurantReputation >= lvl.reputationRequired) {
        result = lvl;
      }
    }
    return result;
  }

  // ===== 获取已解锁食谱 =====
  function restaurantGetUnlockedRecipes() {
    return RESTAURANT_RECIPES.filter(r => state.restaurantReputation >= r.reputationRequired);
  }

  // ===== 获取可选客人池 =====
  function restaurantGetCustomerPool() {
    return RESTAURANT_CUSTOMERS.filter(c => state.restaurantReputation >= c.reputationRequired);
  }

  // ===== 检查食材是否足够 =====
  function restaurantCheckIngredients(recipe) {
    for (const ing of recipe.ingredients) {
      const inv = (state.fridgeInventory || []).find(i => i.foodId === ing.foodId);
      if (!inv || inv.count < ing.count) return false;
    }
    for (const sea of recipe.seasonings) {
      const have = (state.restaurantSeasonings && state.restaurantSeasonings[sea.id]) || 0;
      if (have < sea.count) return false;
    }
    return true;
  }

  // ===== 扣除食材和调料 =====
  function restaurantConsumeIngredients(recipe) {
    for (const ing of recipe.ingredients) {
      const inv = (state.fridgeInventory || []).find(i => i.foodId === ing.foodId);
      if (inv) inv.count -= ing.count;
    }
    state.fridgeInventory = (state.fridgeInventory || []).filter(i => i.count > 0);
    for (const sea of recipe.seasonings) {
      if (!state.restaurantSeasonings) state.restaurantSeasonings = {};
      state.restaurantSeasonings[sea.id] = (state.restaurantSeasonings[sea.id] || 0) - sea.count;
      if (state.restaurantSeasonings[sea.id] <= 0) delete state.restaurantSeasonings[sea.id];

      // 联动棋盘：从棋盘上移除对应的调料格子
      let removeCount = sea.count;
      for (let i = 0; i < GAME_BOARD_CELLS && removeCount > 0; i++) {
        const cell = state.gameBoard[i];
        if (!cell || cell.chain !== 'seasoning') continue;
        const cellItem = GAME_CHAINS.seasoning.items[cell.level - 1];
        if (cellItem && cellItem.seasoningId === sea.id) {
          state.gameBoard[i] = null;
          removeCount--;
        }
      }
    }
  }

  // ===== 开始烹饪 =====
  function restaurantStartCooking(recipeId) {
    if (restaurantRuntime.cooking) {
      restaurantShowNotice('烹饪台正忙！等当前菜做好再下一道');
      return;
    }
    const recipe = RESTAURANT_RECIPES.find(r => r.id === recipeId);
    if (!recipe) return;

    if (!restaurantCheckIngredients(recipe)) {
      restaurantShowNotice('食材或调料不足！去补货或玩冰箱整理');
      return;
    }

    // 扣食材
    restaurantConsumeIngredients(recipe);

    // 开始烹饪计时（烹饪完成由 setInterval 检测，不用 setTimeout）
    restaurantRuntime.cooking = {
      recipeId: recipe.id,
      startTime: Date.now(),
      duration: recipe.cookTime * 1000,
    };

    saveDataDebounced('餐厅开始烹饪');
    restaurantRender();
    restaurantShowNotice(`🔥 开始烹饪「${recipe.name}」…${recipe.cookTime}秒后出锅`);
  }

  // ===== 烹饪完成 =====
  function restaurantFinishCooking() {
    if (!restaurantRuntime.cooking) return;
    const recipeId = restaurantRuntime.cooking.recipeId;
    const recipe = RESTAURANT_RECIPES.find(r => r.id === recipeId);

    restaurantRuntime.cooking = null;
    restaurantCookTimer = null;

    if (!recipe) return;

    // 加入出餐台
    if (!state.restaurantCookedDishes) state.restaurantCookedDishes = [];
    const existing = state.restaurantCookedDishes.find(d => d.recipeId === recipeId);
    if (existing) {
      existing.count++;
    } else {
      state.restaurantCookedDishes.push({ recipeId, count: 1 });
    }

    saveDataDebounced('餐厅烹饪完成');
    restaurantRender();
    restaurantShowNotice(`✅ 「${recipe.name}」出锅啦！`);
  }

  // ===== 上菜给客人 =====
  function restaurantServeCustomer(customerIdx, recipeId) {
    const customer = restaurantRuntime.customers[customerIdx];
    if (!customer) return;

    // 查找出餐台菜品
    const dishInv = (state.restaurantCookedDishes || []).find(d => d.recipeId === recipeId);
    if (!dishInv || dishInv.count <= 0) {
      restaurantShowNotice('出餐台没有这道菜！先烹饪一份吧');
      return;
    }

    const recipe = RESTAURANT_RECIPES.find(r => r.id === recipeId);
    if (!recipe) return;

    // 验证客人是否接受这道菜
    if (!restaurantCustomerAccepts(customer, recipe)) {
      restaurantShowNotice(`${customer.emoji} 不想要这个！看看它想吃什么类型`);
      return;
    }

    // 扣除出餐台库存
    dishInv.count--;
    state.restaurantCookedDishes = (state.restaurantCookedDishes || []).filter(d => d.count > 0);

    // 计算收入
    const gold = Math.round(recipe.sellPrice * customer.tipMulti);
    const bonusGold = customer.bonusGold || 0;
    const totalGold = gold + bonusGold;
    state.gameGold += totalGold;
    state.restaurantReputation += customer.reputationGive;
    state.restaurantTotalEarnings += totalGold;
    state.restaurantTodayEarnings += totalGold;
    state.restaurantServedCount++;

    // 检查升级
    const oldLevel = state.restaurantLevel;
    const newLevelData = restaurantGetLevel();
    if (newLevelData.level > oldLevel) {
      state.restaurantLevel = newLevelData.level;
      restaurantShowNotice(`🎉 餐厅升级！${newLevelData.emoji} ${newLevelData.name} (Lv.${newLevelData.level})`);
    }

    // 移除客人
    restaurantRuntime.customers.splice(customerIdx, 1);

    saveDataDebounced('餐厅上菜');
    checkAchievements();
    restaurantRender();

    const bonusText = bonusGold > 0 ? ` (+${bonusGold}额外)` : '';
    restaurantShowNotice(`🍽️ ${customer.name} 满意离开！+${totalGold}🪙${bonusText} +${customer.reputationGive}⭐`);
  }

  // ===== 上菜甜品/糖葫芦给客人 =====
  function restaurantServeDessert(customerIdx, dessertType, dessertKey) {
    const customer = restaurantRuntime.customers[customerIdx];
    if (!customer) return;

    // 检查客人是否接受甜品
    if (customer.wantsCategory !== 'dessert' && customer.wantsCategory !== 'any') {
      restaurantShowNotice(`${customer.emoji} 不想要甜品！`);
      return;
    }

    let sellPrice = 0;
    let feedAmount = 0;
    let itemName = '';

    if (dessertType === 'tanghulu') {
      const inv = (state.tanghuluInventory || []).find(i => i.fruitKey === dessertKey && i.count > 0);
      if (!inv) { restaurantShowNotice('糖葫芦库存不足！'); return; }
      const data = TANGHULU_FRUITS.find(f => f.key === dessertKey);
      if (!data) return;
      inv.count--;
      state.tanghuluInventory = (state.tanghuluInventory || []).filter(i => i.count > 0);
      sellPrice = Math.round(data.sellPrice * 1.8);
      feedAmount = data.feedAmount;
      itemName = `${data.name}糖葫芦`;
    } else if (dessertType === 'fridge') {
      const inv = (state.fridgeInventory || []).find(i => i.foodId === dessertKey && i.count > 0);
      if (!inv) { restaurantShowNotice('甜品库存不足！'); return; }
      const data = FRIDGE_FOODS.find(f => f.id === dessertKey);
      if (!data) return;
      inv.count--;
      state.fridgeInventory = (state.fridgeInventory || []).filter(i => i.count > 0);
      sellPrice = Math.round(data.value * 1.5);
      feedAmount = data.feed;
      itemName = data.name;
    } else if (dessertType === 'crystal') {
      if ((state.tanghuluSugarCrystal || 0) <= 0) { restaurantShowNotice('没有糖砂了！'); return; }
      state.tanghuluSugarCrystal--;
      sellPrice = 150;
      feedAmount = 50;
      itemName = '神秘糖砂甜品';
    }

    // 计算收入
    const gold = Math.round(sellPrice * customer.tipMulti);
    state.gameGold += gold;
    state.restaurantReputation += customer.reputationGive;
    state.restaurantTotalEarnings += gold;
    state.restaurantTodayEarnings += gold;
    state.restaurantServedCount++;

    // 检查升级
    const oldLevel = state.restaurantLevel;
    const newLevelData = restaurantGetLevel();
    if (newLevelData.level > oldLevel) {
      state.restaurantLevel = newLevelData.level;
      restaurantShowNotice(`🎉 餐厅升级！${newLevelData.emoji} ${newLevelData.name}`);
    }

    // 移除客人
    restaurantRuntime.customers.splice(customerIdx, 1);

    saveDataDebounced('餐厅上甜品');
    restaurantRender();
    restaurantShowNotice(`🍽️ ${customer.name} 吃了${itemName}，很满意！+${gold}🪙 +${customer.reputationGive}⭐`);
  }

  // ===== 判断客人是否接受菜品 =====
  function restaurantCustomerAccepts(customer, recipe) {
    const cat = customer.wantsCategory;
    if (cat === 'any') return true;
    if (cat === 'drink' && recipe.category === 'drink') return true;
    if (cat === 'snack' && (recipe.category === 'snack' || recipe.category === 'drink')) return true;
    if (cat === 'dish' && (recipe.category === 'dish' || recipe.category === 'snack')) return true;
    if (cat === 'premium' && recipe.category === 'dish' && recipe.sellPrice >= 35) return true;
    if (cat === 'dessert') return false; // 甜品走单独逻辑
    if (cat === 'specific') {
      return recipe.id === customer.specificRecipe;
    }
    return false;
  }

  // ===== 客人到来 =====
  function restaurantSpawnCustomer() {
    if (!isRestaurantOpen) return;
    const levelData = restaurantGetLevel();
    if (restaurantRuntime.customers.length >= levelData.maxCustomers) return;

    const pool = restaurantGetCustomerPool();
    if (pool.length === 0) return;

    const template = pool[Math.floor(Math.random() * pool.length)];
    const customer = { ...template, arriveTime: Date.now(), specificRecipe: null };

    // 如果是 specific 类型，随机指定一道已解锁食谱
    if (customer.wantsCategory === 'specific') {
      const recipes = restaurantGetUnlockedRecipes();
      if (recipes.length > 0) {
        const chosen = recipes[Math.floor(Math.random() * recipes.length)];
        customer.specificRecipe = chosen.id;
        customer.dialogue = `我只要「${chosen.name}」！`;
      }
    }

    restaurantRuntime.customers.push(customer);
    restaurantRender();
  }

  // ===== 客人超时检测 =====
  function restaurantCheckTimeout() {
    if (!isRestaurantOpen) return;
    const now = Date.now();
    let changed = false;

    restaurantRuntime.customers = restaurantRuntime.customers.filter(customer => {
      const elapsed = (now - customer.arriveTime) / 1000;
      if (elapsed >= customer.patience) {
        // 超时离开
        state.restaurantReputation = Math.max(0, state.restaurantReputation - 2);
        restaurantShowNotice(`😾 ${customer.name} 等太久走了…声望 -2`);
        changed = true;
        return false;
      }
      return true;
    });

    if (changed) {
      saveDataDebounced('餐厅客人超时');
      restaurantRender();
    }
  }

  // ===== 购买调料 =====
  function restaurantBuySeasoning(seasoningId, amount) {
    const seasoning = RESTAURANT_SEASONINGS.find(s => s.id === seasoningId);
    if (!seasoning) return;

    if (state.restaurantReputation < seasoning.reputationRequired) {
      restaurantShowNotice(`需要声望 ${seasoning.reputationRequired} 才能购买 ${seasoning.name}`);
      return;
    }

    const totalCost = seasoning.price * amount;
    if (state.gameGold < totalCost) {
      restaurantShowNotice(`金币不足！需要 ${totalCost} 🪙`);
      return;
    }

    state.gameGold -= totalCost;
    if (!state.restaurantSeasonings) state.restaurantSeasonings = {};
    state.restaurantSeasonings[seasoningId] = (state.restaurantSeasonings[seasoningId] || 0) + amount;

    saveDataDebounced('餐厅购买调料');
    restaurantRender();
    restaurantShowNotice(`购买了 ${seasoning.emoji} ${seasoning.name} ×${amount}！`);
  }

  // ===== 购买基础蔬菜 =====
  function restaurantBuyGrocery(groceryId, amount) {
    const grocery = RESTAURANT_GROCERIES.find(g => g.id === groceryId);
    if (!grocery) return;

    if (state.restaurantReputation < grocery.reputationRequired) {
      restaurantShowNotice(`需要声望 ${grocery.reputationRequired} 才能购买 ${grocery.name}`);
      return;
    }

    const totalCost = grocery.price * amount;
    if (state.gameGold < totalCost) {
      restaurantShowNotice(`金币不足！需要 ${totalCost} 🪙`);
      return;
    }

    state.gameGold -= totalCost;
    if (!state.fridgeInventory) state.fridgeInventory = [];
    const existing = state.fridgeInventory.find(i => i.foodId === groceryId);
    if (existing) {
      existing.count += amount;
    } else {
      state.fridgeInventory.push({ foodId: groceryId, count: amount });
    }

    saveDataDebounced('餐厅购买蔬菜');
    restaurantRender();
    restaurantShowNotice(`购买了 ${grocery.emoji} ${grocery.name} ×${amount}！`);
  }

  // ===== 菜品喂桌宠 =====
  function restaurantFeedPet(recipeId) {
    const dishInv = (state.restaurantCookedDishes || []).find(d => d.recipeId === recipeId);
    if (!dishInv || dishInv.count <= 0) {
      restaurantShowNotice('出餐台没有这道菜了！');
      return;
    }
    const recipe = RESTAURANT_RECIPES.find(r => r.id === recipeId);
    if (!recipe) return;

    dishInv.count--;
    state.restaurantCookedDishes = (state.restaurantCookedDishes || []).filter(d => d.count > 0);

    state.hunger = Math.min(100, state.hunger + recipe.feedAmount);
    if (recipe.energyAmount > 0) {
      state.energy = Math.min(100, state.energy + recipe.energyAmount);
    }
    state.totalInteractions++;

    const actionSprite = settings.spriteEat || settings.spriteHappy;
    if (actionSprite) {
      const dur = (settings.spriteDurations && settings.spriteDurations.spriteEat) || 2000;
      setSpriteWithLock('eat', actionSprite, dur);
    }
    showBubble(`${recipe.emoji} 好吃！谢谢主人～`, 3000);
    updateMood();
    updateStatusBars();
    saveDataDebounced('餐厅喂桌宠');
    restaurantRender();
  }

  // ===== 通知 =====
  function restaurantShowNotice(text) {
    const notice = document.getElementById('sp-restaurant-notice');
    if (!notice) return;
    notice.textContent = text;
    notice.classList.add('visible');
    clearTimeout(notice._timer);
    notice._timer = setTimeout(() => notice.classList.remove('visible'), 3500);
  }

  // ===== 渲染主面板 =====
  function restaurantRender() {
    const panel = document.getElementById('sp-restaurant-panel');
    if (!panel || !isRestaurantOpen) return;

    const levelData = restaurantGetLevel();

    // 更新头部信息
    const goldEl = document.getElementById('sp-restaurant-gold');
    const repEl = document.getElementById('sp-restaurant-rep');
    const lvlEl = document.getElementById('sp-restaurant-lvl');
    if (goldEl) goldEl.textContent = state.gameGold;
    if (repEl) repEl.textContent = state.restaurantReputation;
    if (lvlEl) lvlEl.textContent = `${levelData.emoji}Lv.${levelData.level}`;

    // 更新下一级声望提示
    const nextLvlEl = document.getElementById('sp-restaurant-next-lvl');
    if (nextLvlEl) {
      const nextLevel = RESTAURANT_LEVELS.find(l => l.reputationRequired > state.restaurantReputation);
      if (nextLevel) {
        const needed = nextLevel.reputationRequired - state.restaurantReputation;
        nextLvlEl.textContent = `→${needed}⭐升级`;
      } else {
        nextLvlEl.textContent = '满级✨';
      }
    }

    // 渲染当前激活的标签页
    const activeTab = panel.querySelector('.sp-game-tab.active[data-rtab]')?.dataset.rtab || 'kitchen';
    if (activeTab === 'kitchen') restaurantRenderKitchen();
    else if (activeTab === 'menu') restaurantRenderMenu();
    else if (activeTab === 'supply') restaurantRenderSupply();
    else if (activeTab === 'stock') restaurantRenderStock();
    else if (activeTab === 'atlas') restaurantRenderAtlas();
  }

  // ===== 渲染厨房标签页 =====
  function restaurantRenderKitchen() {
    const container = document.getElementById('sp-restaurant-kitchen');
    if (!container) return;

    const levelData = restaurantGetLevel();
    const customers = restaurantRuntime.customers;
    const now = Date.now();
    const maxTables = levelData.maxCustomers;

    // ===== 桌子网格区 =====
    let tablesHtml = '';
    for (let i = 0; i < maxTables; i++) {
      const customer = customers[i] || null;

      if (!customer) {
        // 空桌
        tablesHtml += `
          <div class="sp-restaurant-table sp-restaurant-table-empty">
            <span class="sp-restaurant-table-number">#${i + 1}</span>
          </div>
        `;
      } else {
        // 有客人
        const elapsed = Math.floor((now - customer.arriveTime) / 1000);
        const remaining = Math.max(0, customer.patience - elapsed);
        const isUrgent = remaining < 10;
        const urgentClass = isUrgent ? ' sp-restaurant-table-urgent' : '';
        const timerClass = isUrgent ? ' urgent' : '';

        // 客人想要的类型文字
        const wantMap = {
          drink: '🧃饮品', snack: '🥗小食', dish: '🍽️菜品',
          premium: '👑高级菜', dessert: '🍰甜品', any: '🎲随便',
          specific: '📌指定'
        };
        const wantText = wantMap[customer.wantsCategory] || '🍽️菜品';

        // 上菜按钮（只显示出餐台里客人能接受的菜）
        let serveButtonsHtml = '';
        const cookedDishes = state.restaurantCookedDishes || [];
        cookedDishes.forEach(d => {
          const recipe = RESTAURANT_RECIPES.find(r => r.id === d.recipeId);
          if (!recipe || d.count <= 0) return;
          if (!restaurantCustomerAccepts(customer, recipe)) return;
          serveButtonsHtml += `<button class="sp-restaurant-table-serve-btn" data-customer="${i}" data-recipe="${d.recipeId}" title="${recipe.name}">${recipe.emoji}</button>`;
        });

        // 甜品按钮（如果客人要甜品或 any）
        let dessertButtonsHtml = '';
        if (customer.wantsCategory === 'dessert' || customer.wantsCategory === 'any') {
          const tangInv = (state.tanghuluInventory || []).filter(inv => inv.count > 0);
          tangInv.slice(0, 2).forEach(inv => {
            const data = TANGHULU_FRUITS.find(f => f.key === inv.fruitKey);
            if (!data) return;
            dessertButtonsHtml += `<button class="sp-restaurant-table-dessert-btn" data-customer="${i}" data-type="tanghulu" data-key="${inv.fruitKey}" title="${data.name}糖葫芦">${data.emoji}</button>`;
          });
          if ((state.tanghuluSugarCrystal || 0) > 0) {
            dessertButtonsHtml += `<button class="sp-restaurant-table-dessert-btn" data-customer="${i}" data-type="crystal" data-key="crystal" title="糖砂甜品">✨</button>`;
          }
          const fridgeDesserts = (state.fridgeInventory || []).filter(inv => (inv.foodId === 'icecream' || inv.foodId === 'cake') && inv.count > 0);
          fridgeDesserts.forEach(inv => {
            const data = FRIDGE_FOODS.find(f => f.id === inv.foodId);
            if (!data) return;
            dessertButtonsHtml += `<button class="sp-restaurant-table-dessert-btn" data-customer="${i}" data-type="fridge" data-key="${inv.foodId}" title="${data.name}">${data.emoji}</button>`;
          });
        }

        const hasActions = serveButtonsHtml || dessertButtonsHtml;

        tablesHtml += `
          <div class="sp-restaurant-table sp-restaurant-table-occupied${urgentClass}" data-table-idx="${i}">
            <span class="sp-restaurant-table-number">#${i + 1}</span>
            <span class="sp-restaurant-table-timer${timerClass}">⏱️${remaining}s</span>
            <span class="sp-restaurant-table-emoji">${customer.emoji}</span>
            <span class="sp-restaurant-table-name">${customer.name}</span>
            <span class="sp-restaurant-table-wants">${wantText}</span>
            <span class="sp-restaurant-table-dialogue">${customer.dialogue}</span>
            ${hasActions ? `<div class="sp-restaurant-table-actions">${serveButtonsHtml}${dessertButtonsHtml}</div>` : ''}
          </div>
        `;
      }
    }

    // ===== 烹饪台 =====
    let cookingHtml = '';
    if (restaurantRuntime.cooking) {
      const recipe = RESTAURANT_RECIPES.find(r => r.id === restaurantRuntime.cooking.recipeId);
      const elapsed = Date.now() - restaurantRuntime.cooking.startTime;
      const remaining = Math.max(0, Math.ceil((restaurantRuntime.cooking.duration - elapsed) / 1000));
      cookingHtml = `
        <div style="text-align:center;padding:12px;background:rgba(255,180,50,0.08);border:1px solid rgba(255,180,50,0.3);border-radius:8px;">
          <div style="font-size:18px;margin-bottom:4px;">🔥</div>
          <div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);">正在烹饪：${recipe?.name || '?'} ${recipe?.emoji || ''}</div>
          <div style="font-size:11px;color:#ffb347;margin-top:4px;">剩余 ${remaining} 秒…</div>
        </div>
      `;
    } else {
      cookingHtml = `
        <div style="padding:8px;background:rgba(255,255,255,0.04);border:1px solid var(--sp-border-light);border-radius:8px;">
          <div style="font-size:11px;font-weight:600;color:var(--sp-text-primary);margin-bottom:6px;">🍳 烹饪台</div>
          <button id="sp-restaurant-cook-btn" style="width:100%;padding:9px;font-size:12px;font-weight:600;border-radius:6px;border:1px solid var(--sp-primary-border);background:var(--sp-primary);color:#fff;cursor:pointer;">📋 选择食谱并烹饪</button>
        </div>
      `;
    }

    // ===== 出餐台 =====
    let dishesHtml = '';
    const cookedDishes = state.restaurantCookedDishes || [];
    if (cookedDishes.length === 0) {
      dishesHtml = '<div style="text-align:center;padding:8px;color:var(--sp-text-muted);font-size:11px;">出餐台空空如也～</div>';
    } else {
      dishesHtml = cookedDishes.map(d => {
        const recipe = RESTAURANT_RECIPES.find(r => r.id === d.recipeId);
        if (!recipe) return '';
        return `
          <div style="display:inline-flex;align-items:center;gap:3px;padding:3px 8px;background:rgba(255,255,255,0.06);border:1px solid var(--sp-border-light);border-radius:6px;font-size:11px;">
            <span>${recipe.emoji}</span>
            <span style="color:var(--sp-text-primary);">${recipe.name}</span>
            <span style="color:var(--sp-text-muted);">×${d.count}</span>
            <button class="sp-restaurant-feed-btn" data-recipe="${d.recipeId}" style="padding:1px 5px;font-size:9px;border-radius:3px;border:1px solid rgba(255,180,50,0.4);background:rgba(255,180,50,0.1);color:#ffb347;cursor:pointer;margin-left:2px;">🍖</button>
          </div>
        `;
      }).join(' ');
    }

    container.innerHTML = `
      <div style="margin-bottom:8px;">
        <div style="font-size:11px;font-weight:600;color:var(--sp-text-primary);margin-bottom:6px;">🪑 餐桌区 (${customers.length}/${maxTables}位客人)</div>
        <div class="sp-restaurant-tables">${tablesHtml}</div>
      </div>
      ${cookingHtml}
      <div style="margin-top:8px;">
        <div style="font-size:11px;font-weight:600;color:var(--sp-text-primary);margin-bottom:4px;">🍽️ 出餐台</div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;">${dishesHtml}</div>
      </div>
    `;

    // ===== 绑定事件 =====
    const cookBtn = document.getElementById('sp-restaurant-cook-btn');
    if (cookBtn) {
      cookBtn.onclick = () => {
        restaurantShowRecipeModal();
      };
    }

    // 上菜按钮
    container.querySelectorAll('.sp-restaurant-table-serve-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const customerIdx = parseInt(btn.dataset.customer);
        const recipeId = btn.dataset.recipe;
        restaurantServeCustomer(customerIdx, recipeId);
      };
    });

    // 甜品按钮
    container.querySelectorAll('.sp-restaurant-table-dessert-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const customerIdx = parseInt(btn.dataset.customer);
        const type = btn.dataset.type;
        const key = btn.dataset.key;
        restaurantServeDessert(customerIdx, type, key);
      };
    });

    // 喂桌宠按钮
    container.querySelectorAll('.sp-restaurant-feed-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const recipeId = btn.dataset.recipe;
        restaurantFeedPet(recipeId);
      };
    });
  }

  // ===== 渲染菜单标签页 =====
  function restaurantRenderMenu() {
    const container = document.getElementById('sp-restaurant-menu');
    if (!container) return;

    const allRecipes = RESTAURANT_RECIPES;
    const categories = [
      { key: 'drink',  label: '🧃 饮品', emoji: '🧃' },
      { key: 'snack',  label: '🥗 小食', emoji: '🥗' },
      { key: 'dish',   label: '🍽️ 菜品', emoji: '🍽️' },
    ];

    // 按等级分组显示食谱
    const levelGroups = [
      { label: '🏕️ Lv.1 基础菜单',    minRep: 0,   maxRep: 29  },
      { label: '🏠 Lv.2 温馨小店',      minRep: 30,  maxRep: 49  },
      { label: '🏪 Lv.3 特色餐厅',      minRep: 50,  maxRep: 69  },
      { label: '🏨 Lv.4 星级餐厅',      minRep: 70,  maxRep: 99  },
      { label: '🏰 Lv.5 猫界传奇',      minRep: 100, maxRep: 139 },
      { label: '🏛️ Lv.6 美食殿堂',      minRep: 140, maxRep: 199 },  // 注：这里用实际的 reputationRequired 区间
    ];

    let html = '';

    // 按 reputationRequired 分组渲染
    const grouped = {};
    allRecipes.forEach(r => {
      const key = r.reputationRequired;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(r);
    });

    const repKeys = Object.keys(grouped).map(Number).sort((a, b) => a - b);

    repKeys.forEach(repReq => {
      const recipes = grouped[repReq];
      const unlocked = state.restaurantReputation >= repReq;

      // 分组标题
      let groupLabel = '';
      if (repReq === 0) groupLabel = '🏕️ 基础菜单（无需声望）';
      else groupLabel = `🔓 声望 ${repReq} 解锁`;

      html += `
        <details ${unlocked ? 'open' : ''} style="margin-bottom:10px;border:1px solid ${unlocked ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'};border-radius:8px;overflow:hidden;">
          <summary style="padding:7px 12px;font-size:12px;font-weight:600;cursor:pointer;background:rgba(255,255,255,0.04);color:${unlocked ? 'var(--sp-text-primary)' : 'var(--sp-text-muted)'};list-style:none;display:flex;align-items:center;justify-content:space-between;user-select:none;">
            <span>${groupLabel}</span>
            <span style="font-size:10px;color:${unlocked ? 'rgba(100,220,100,0.8)' : '#f66'};">${unlocked ? '✅ 已解锁' : '🔒 未解锁'}</span>
          </summary>
          <div style="padding:6px;">
            ${recipes.map(r => {
              const ingText = r.ingredients.map(ing => {
                const fd = FRIDGE_FOODS.find(f => f.id === ing.foodId);
                const have = (state.fridgeInventory || []).find(i => i.foodId === ing.foodId);
                const haveCount = have ? have.count : 0;
                const ok = unlocked && haveCount >= ing.count;
                return `<span style="color:${unlocked ? (ok ? 'rgba(100,220,100,0.8)' : '#f66') : 'var(--sp-text-muted)'};">${fd?.emoji || '?'}×${ing.count}</span>`;
              }).join(' ');
              const seaText = r.seasonings.map(s => {
                const sd = RESTAURANT_SEASONINGS.find(x => x.id === s.id);
                const have = (state.restaurantSeasonings && state.restaurantSeasonings[s.id]) || 0;
                const ok = unlocked && have >= s.count;
                return `<span style="color:${unlocked ? (ok ? 'rgba(100,220,100,0.8)' : '#f66') : 'var(--sp-text-muted)'};">${sd?.emoji || '?'}×${s.count}</span>`;
              }).join(' ');
              const canMake = unlocked && restaurantCheckIngredients(r);
              return `
                <div style="display:flex;align-items:center;gap:6px;padding:5px 6px;background:${canMake ? 'rgba(100,220,100,0.05)' : 'rgba(255,255,255,0.03)'};border-radius:6px;margin-bottom:2px;">
                  <span style="font-size:15px;flex-shrink:0;">${r.emoji}</span>
                  <div style="flex:1;min-width:0;">
                    <div style="font-size:11px;font-weight:600;color:${unlocked ? 'var(--sp-text-primary)' : 'var(--sp-text-muted)'};">${r.name}</div>
                    <div style="font-size:9px;display:flex;flex-wrap:wrap;gap:3px;align-items:center;margin-top:1px;">
                      ${ingText}
                      ${r.seasonings.length > 0 ? `<span style="color:var(--sp-text-muted);">🧂</span>${seaText}` : ''}
                      <span style="color:var(--sp-text-muted);">⏱️${r.cookTime}s</span>
                    </div>
                  </div>
                  <div style="text-align:right;flex-shrink:0;">
                    <div style="font-size:11px;color:#ffb347;font-weight:600;">🪙${r.sellPrice}</div>
                    <div style="font-size:9px;color:var(--sp-status-hunger);">+${r.feedAmount}饱</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </details>
      `;
    });

    // 甜品说明
    html += `
      <details style="margin-bottom:10px;border:1px solid rgba(255,150,200,0.2);border-radius:8px;overflow:hidden;">
        <summary style="padding:7px 12px;font-size:12px;font-weight:600;cursor:pointer;background:rgba(255,150,200,0.05);color:var(--sp-text-primary);list-style:none;user-select:none;">
          🍰 甜品/点心（来自库存，直接上架）
        </summary>
        <div style="padding:8px 12px;font-size:10px;color:var(--sp-text-muted);line-height:1.8;">
          🍢 糖葫芦（来自糖葫芦工坊）→ 售出价 = 原价×1.8<br/>
          🍦🎂 冰淇淋/蛋糕（来自冰箱整理）→ 售出价 = 原价×1.5<br/>
          ✨ 完美糖砂甜品 → 售出价 150🪙<br/>
          以上在厨房标签页的桌子格子里可快捷上菜
        </div>
      </details>
    `;

    container.innerHTML = html;
  }

  // ===== 渲染补货标签页 =====
  function restaurantRenderSupply() {
    const container = document.getElementById('sp-restaurant-supply');
    if (!container) return;

    let html = `
      <div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:8px;">🧂 调料商店</div>
    `;

    RESTAURANT_SEASONINGS.forEach(s => {
      const unlocked = state.restaurantReputation >= s.reputationRequired;
      const have = (state.restaurantSeasonings && state.restaurantSeasonings[s.id]) || 0;
      const cantAfford3 = state.gameGold < s.price * 3;
      const cantAfford5 = state.gameGold < s.price * 5;
      html += `
        <div style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:${unlocked ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.1)'};border:1px solid var(--sp-border-light);border-radius:8px;margin-bottom:5px;opacity:${unlocked ? '1' : '0.45'};">
          <span style="font-size:18px;flex-shrink:0;">${s.emoji}</span>
          <div style="flex:1;">
            <div style="font-size:11px;font-weight:600;color:var(--sp-text-primary);">
              ${s.name}
              ${!unlocked ? `<span style="font-size:9px;color:#f66;margin-left:4px;">🔒声望${s.reputationRequired}</span>` : ''}
            </div>
            <div style="font-size:10px;color:var(--sp-text-muted);">库存: ${have} | 单价: ${s.price}🪙</div>
          </div>
          ${unlocked ? `
            <button class="sp-restaurant-buy-sea-btn" data-id="${s.id}" data-amount="3" style="padding:3px 7px;font-size:10px;border-radius:5px;border:1px solid rgba(255,180,50,0.4);background:rgba(255,180,50,0.15);color:#ffb347;cursor:pointer;${cantAfford3 ? 'opacity:0.4;pointer-events:none;' : ''}">买3 (${s.price * 3}🪙)</button>
            <button class="sp-restaurant-buy-sea-btn" data-id="${s.id}" data-amount="5" style="padding:3px 7px;font-size:10px;border-radius:5px;border:1px solid rgba(255,180,50,0.6);background:rgba(255,180,50,0.25);color:#ffb347;cursor:pointer;${cantAfford5 ? 'opacity:0.4;pointer-events:none;' : ''}">买5 (${s.price * 5}🪙)</button>
          ` : ''}
        </div>
      `;
    });

    // 酱油瓶转调料说明
    const bottleInv = (state.fridgeInventory || []).find(i => i.foodId === 'bottle');
    const bottleCount = bottleInv ? bottleInv.count : 0;
    html += `
      <div style="margin-top:10px;padding:8px 10px;background:rgba(100,180,255,0.05);border:1px solid rgba(100,180,255,0.2);border-radius:8px;font-size:10px;color:var(--sp-text-muted);line-height:1.7;">
        💡 冰箱整理中的「酱油瓶🫙」可在此转换为酱油调料（1瓶=3份）<br/>
        当前酱油瓶库存：${bottleCount} 瓶
        ${bottleCount > 0 ? `<br/><button id="sp-restaurant-convert-soy" style="margin-top:4px;padding:3px 8px;font-size:10px;border-radius:4px;border:1px solid rgba(100,180,255,0.4);background:rgba(100,180,255,0.15);color:#64b4ff;cursor:pointer;">🫙 全部转换为酱油 (+${bottleCount * 3}份)</button>` : ''}
      </div>
    `;

    // 基础蔬菜进货区
    html += `
      <div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin:16px 0 8px;">🥬 基础蔬菜进货</div>
      <div style="font-size:10px;color:var(--sp-text-muted);margin-bottom:8px;">花金币直接购买，不需要玩其他小游戏获得</div>
    `;

    RESTAURANT_GROCERIES.forEach(g => {
      const unlocked = state.restaurantReputation >= g.reputationRequired;
      const have = (state.fridgeInventory || []).find(i => i.foodId === g.id);
      const haveCount = have ? have.count : 0;
      const cantAfford3 = state.gameGold < g.price * 3;
      const cantAfford5 = state.gameGold < g.price * 5;
      html += `
        <div style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:${unlocked ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.1)'};border:1px solid var(--sp-border-light);border-radius:8px;margin-bottom:5px;opacity:${unlocked ? '1' : '0.45'};">
          <span style="font-size:18px;flex-shrink:0;">${g.emoji}</span>
          <div style="flex:1;">
            <div style="font-size:11px;font-weight:600;color:var(--sp-text-primary);">
              ${g.name}
              ${!unlocked ? `<span style="font-size:9px;color:#f66;margin-left:4px;">🔒声望${g.reputationRequired}</span>` : ''}
            </div>
            <div style="font-size:10px;color:var(--sp-text-muted);">库存: ${haveCount} | 单价: ${g.price}🪙</div>
          </div>
          ${unlocked ? `
            <button class="sp-restaurant-buy-grocery-btn" data-id="${g.id}" data-amount="3" style="padding:3px 7px;font-size:10px;border-radius:5px;border:1px solid rgba(100,220,100,0.4);background:rgba(100,220,100,0.15);color:#6f6;cursor:pointer;${cantAfford3 ? 'opacity:0.4;pointer-events:none;' : ''}">买3 (${g.price * 3}🪙)</button>
            <button class="sp-restaurant-buy-grocery-btn" data-id="${g.id}" data-amount="5" style="padding:3px 7px;font-size:10px;border-radius:5px;border:1px solid rgba(100,220,100,0.6);background:rgba(100,220,100,0.25);color:#6f6;cursor:pointer;${cantAfford5 ? 'opacity:0.4;pointer-events:none;' : ''}">买5 (${g.price * 5}🪙)</button>
          ` : ''}
        </div>
      `;
    });

    container.innerHTML = html;

    // 绑定购买按钮
    container.querySelectorAll('.sp-restaurant-buy-sea-btn').forEach(btn => {
      btn.onclick = () => {
        restaurantBuySeasoning(btn.dataset.id, parseInt(btn.dataset.amount));
      };
    });

    // 绑定蔬菜进货按钮
    container.querySelectorAll('.sp-restaurant-buy-grocery-btn').forEach(btn => {
      btn.onclick = () => {
        restaurantBuyGrocery(btn.dataset.id, parseInt(btn.dataset.amount));
      };
    });

    // 绑定酱油瓶转换按钮
    const convertBtn = document.getElementById('sp-restaurant-convert-soy');
    if (convertBtn) {
      convertBtn.onclick = () => {
        const inv = (state.fridgeInventory || []).find(i => i.foodId === 'bottle');
        if (!inv || inv.count <= 0) return;
        const amount = inv.count * 3;
        inv.count = 0;
        state.fridgeInventory = (state.fridgeInventory || []).filter(i => i.count > 0);
        if (!state.restaurantSeasonings) state.restaurantSeasonings = {};
        state.restaurantSeasonings['soy'] = (state.restaurantSeasonings['soy'] || 0) + amount;
        saveDataDebounced('酱油瓶转换');
        restaurantRender();
        restaurantShowNotice(`🫙 转换成功！获得酱油 ×${amount}`);
      };
    }
  }

  // ===== 渲染库存标签页 =====
  function restaurantRenderStock() {
    const container = document.getElementById('sp-restaurant-stock');
    if (!container) return;

    // 可用食材（来自冰箱库存）
    const fridgeInv = (state.fridgeInventory || []).filter(i => i.count > 0);
    let ingredientsHtml = '';
    if (fridgeInv.length === 0) {
      ingredientsHtml = '<div style="color:var(--sp-text-muted);font-size:11px;text-align:center;padding:8px;">暂无食材，去玩冰箱整理吧！</div>';
    } else {
      ingredientsHtml = fridgeInv.map(inv => {
        const data = FRIDGE_FOODS.find(f => f.id === inv.foodId);
        if (!data) return '';
        return `
          <div style="display:flex;align-items:center;gap:6px;padding:3px 6px;">
            <span style="font-size:14px;">${data.emoji}</span>
            <span style="font-size:11px;color:var(--sp-text-primary);flex:1;">${data.name}</span>
            <span style="font-size:11px;font-weight:600;color:var(--sp-text-primary);">×${inv.count}</span>
          </div>
        `;
      }).join('');
    }

    // 调料库存
    const seaEntries = Object.entries(state.restaurantSeasonings || {}).filter(([, v]) => v > 0);
    let seasoningHtml = '';
    if (seaEntries.length === 0) {
      seasoningHtml = '<div style="color:var(--sp-text-muted);font-size:11px;text-align:center;padding:8px;">调料空空，去补货吧！</div>';
    } else {
      seasoningHtml = seaEntries.map(([id, count]) => {
        const data = RESTAURANT_SEASONINGS.find(s => s.id === id);
        if (!data) return '';
        return `
          <div style="display:flex;align-items:center;gap:6px;padding:3px 6px;">
            <span style="font-size:14px;">${data.emoji}</span>
            <span style="font-size:11px;color:var(--sp-text-primary);flex:1;">${data.name}</span>
            <span style="font-size:11px;font-weight:600;color:var(--sp-text-primary);">×${count}</span>
          </div>
        `;
      }).join('');
    }

    // 甜品/点心库存
    const tangInv = (state.tanghuluInventory || []).filter(i => i.count > 0);
    const fridgeDesserts = (state.fridgeInventory || []).filter(i => {
      return (i.foodId === 'icecream' || i.foodId === 'cake') && i.count > 0;
    });
    const crystalCount = state.tanghuluSugarCrystal || 0;
    let dessertHtml = '';
    if (tangInv.length === 0 && fridgeDesserts.length === 0 && crystalCount === 0) {
      dessertHtml = '<div style="color:var(--sp-text-muted);font-size:11px;text-align:center;padding:8px;">暂无甜品/点心库存</div>';
    } else {
      dessertHtml = '';
      tangInv.forEach(inv => {
        const data = TANGHULU_FRUITS.find(f => f.key === inv.fruitKey);
        if (!data) return;
        dessertHtml += `
          <div style="display:flex;align-items:center;gap:6px;padding:3px 6px;">
            <span style="font-size:14px;">${data.emoji}</span>
            <span style="font-size:11px;color:var(--sp-text-primary);flex:1;">🍢${data.name}糖葫芦</span>
            <span style="font-size:11px;font-weight:600;color:var(--sp-text-primary);">×${inv.count}</span>
          </div>
        `;
      });
      fridgeDesserts.forEach(inv => {
        const data = FRIDGE_FOODS.find(f => f.id === inv.foodId);
        if (!data) return;
        dessertHtml += `
          <div style="display:flex;align-items:center;gap:6px;padding:3px 6px;">
            <span style="font-size:14px;">${data.emoji}</span>
            <span style="font-size:11px;color:var(--sp-text-primary);flex:1;">${data.name}</span>
            <span style="font-size:11px;font-weight:600;color:var(--sp-text-primary);">×${inv.count}</span>
          </div>
        `;
      });
      if (crystalCount > 0) {
        dessertHtml += `
          <div style="display:flex;align-items:center;gap:6px;padding:3px 6px;">
            <span style="font-size:14px;">✨</span>
            <span style="font-size:11px;color:var(--sp-text-primary);flex:1;">完美的亮晶晶糖砂</span>
            <span style="font-size:11px;font-weight:600;color:#ffb347;">×${crystalCount}</span>
          </div>
        `;
      }
    }

    // 今日营收
    const today = new Date().toISOString().slice(0, 10);
    if (state.restaurantLastOpenDate !== today) {
      state.restaurantTodayEarnings = 0;
      state.restaurantLastOpenDate = today;
    }

    container.innerHTML = `
      <div style="margin-bottom:10px;padding:8px 10px;background:rgba(255,180,50,0.06);border:1px solid rgba(255,180,50,0.2);border-radius:8px;">
        <div style="font-size:11px;font-weight:600;color:var(--sp-text-primary);margin-bottom:4px;">📊 营业数据</div>
        <div style="font-size:11px;color:var(--sp-text-secondary);line-height:1.8;">
          今日收入: <span style="color:#ffb347;font-weight:600;">🪙${state.restaurantTodayEarnings}</span><br/>
          历史总收入: <span style="color:#ffb347;">🪙${state.restaurantTotalEarnings}</span><br/>
          服务客人: <span style="color:var(--sp-text-primary);">${state.restaurantServedCount} 位</span>
        </div>
      </div>
      <div style="margin-bottom:10px;background:rgba(255,255,255,0.03);border:1px solid var(--sp-border-light);border-radius:8px;overflow:hidden;">
        <div style="padding:6px 10px;background:rgba(255,255,255,0.04);font-size:11px;font-weight:600;color:var(--sp-text-primary);">🥬 食材库存（来自冰箱整理）</div>
        <div style="padding:4px 4px;">${ingredientsHtml}</div>
      </div>
      <div style="margin-bottom:10px;background:rgba(255,255,255,0.03);border:1px solid var(--sp-border-light);border-radius:8px;overflow:hidden;">
        <div style="padding:6px 10px;background:rgba(255,255,255,0.04);font-size:11px;font-weight:600;color:var(--sp-text-primary);">🧂 调料库存</div>
        <div style="padding:4px 4px;">${seasoningHtml}</div>
      </div>
      <div style="background:rgba(255,255,255,0.03);border:1px solid var(--sp-border-light);border-radius:8px;overflow:hidden;">
        <div style="padding:6px 10px;background:rgba(255,255,255,0.04);font-size:11px;font-weight:600;color:var(--sp-text-primary);">🍰 甜品/点心库存</div>
        <div style="padding:4px 4px;">${dessertHtml}</div>
      </div>
    `;
  }

  // ===== 渲染图鉴标签页 =====
  function restaurantRenderAtlas() {
    const container = document.getElementById('sp-restaurant-atlas');
    if (!container) return;
    if (!state.gameCustomImages) state.gameCustomImages = {};

    // 分类：食材、调料、菜品
    let html = '';

    // --- 食材图鉴 ---
    html += `<div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:6px;">🥬 食材图鉴</div>`;
    html += `<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin-bottom:14px;">`;
    FRIDGE_FOODS.forEach(food => {
      const key = `restaurant_food_${food.id}`;
      const custom = state.gameCustomImages[key];
      const display = custom
        ? `<img src="${custom}" style="width:22px;height:22px;object-fit:contain;border-radius:3px;" />`
        : `<span style="font-size:18px;">${food.emoji}</span>`;
      html += `
        <div style="aspect-ratio:1;border-radius:6px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;position:relative;cursor:pointer;overflow:hidden;" data-ratlas-key="${key}" data-ratlas-name="${food.name}">
          ${display}
          <span style="font-size:7px;color:var(--sp-text-muted);text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:90%;">${food.name}</span>
          <div class="sp-ratlas-upload" data-key="${key}" data-name="${food.name}" style="position:absolute;top:1px;right:1px;width:14px;height:14px;border-radius:50%;background:rgba(0,0,0,0.6);color:#fff;font-size:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity 0.2s;">📷</div>
        </div>
      `;
    });
    html += `</div>`;

    // --- 调料图鉴 ---
    html += `<div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:6px;">🧂 调料图鉴</div>`;
    html += `<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin-bottom:14px;">`;
    RESTAURANT_SEASONINGS.forEach(s => {
      const key = `restaurant_sea_${s.id}`;
      const custom = state.gameCustomImages[key];
      const display = custom
        ? `<img src="${custom}" style="width:22px;height:22px;object-fit:contain;border-radius:3px;" />`
        : `<span style="font-size:18px;">${s.emoji}</span>`;
      html += `
        <div style="aspect-ratio:1;border-radius:6px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;position:relative;cursor:pointer;overflow:hidden;" data-ratlas-key="${key}" data-ratlas-name="${s.name}">
          ${display}
          <span style="font-size:7px;color:var(--sp-text-muted);">${s.name}</span>
          <div class="sp-ratlas-upload" data-key="${key}" data-name="${s.name}" style="position:absolute;top:1px;right:1px;width:14px;height:14px;border-radius:50%;background:rgba(0,0,0,0.6);color:#fff;font-size:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity 0.2s;">📷</div>
        </div>
      `;
    });
    html += `</div>`;

    // --- 菜品图鉴 ---
    html += `<div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:6px;">🍽️ 菜品图鉴</div>`;
    html += `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin-bottom:14px;">`;
    RESTAURANT_RECIPES.forEach(r => {
      const key = `restaurant_recipe_${r.id}`;
      const custom = state.gameCustomImages[key];
      const display = custom
        ? `<img src="${custom}" style="width:24px;height:24px;object-fit:contain;border-radius:4px;" />`
        : `<span style="font-size:18px;">${r.emoji}</span>`;
      const unlocked = state.restaurantReputation >= r.reputationRequired;
      html += `
        <div style="aspect-ratio:1;border-radius:6px;border:1px solid ${unlocked ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'};background:rgba(255,255,255,0.04);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;position:relative;cursor:pointer;overflow:hidden;opacity:${unlocked ? '1' : '0.4'};" data-ratlas-key="${key}" data-ratlas-name="${r.name}">
          ${unlocked ? display : '<span style="font-size:14px;color:var(--sp-text-muted);">🔒</span>'}
          <span style="font-size:7px;color:var(--sp-text-muted);text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:90%;">${unlocked ? r.name : '???'}</span>
          ${unlocked ? `<div class="sp-ratlas-upload" data-key="${key}" data-name="${r.name}" style="position:absolute;top:1px;right:1px;width:14px;height:14px;border-radius:50%;background:rgba(0,0,0,0.6);color:#fff;font-size:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity 0.2s;">📷</div>` : ''}
        </div>
      `;
    });
    html += `</div>`;

    // --- 客人图鉴 ---
    html += `<div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:6px;">😺 客人图鉴</div>`;
    html += `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-bottom:14px;">`;
    RESTAURANT_CUSTOMERS.forEach(c => {
      const key = `restaurant_customer_${c.id}`;
      const custom = state.gameCustomImages[key];
      const unlocked = state.restaurantReputation >= c.reputationRequired;
      const display = unlocked
        ? (custom
          ? `<img src="${custom}" style="width:28px;height:28px;object-fit:contain;border-radius:50%;" />`
          : `<span style="font-size:20px;">${c.emoji}</span>`)
        : '<span style="font-size:16px;color:var(--sp-text-muted);">🔒</span>';
      html += `
        <div style="border-radius:8px;border:1px solid ${unlocked ? 'rgba(255,180,100,0.2)' : 'rgba(255,255,255,0.05)'};background:${unlocked ? 'rgba(255,180,100,0.04)' : 'rgba(0,0,0,0.05)'};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:8px 4px;position:relative;cursor:pointer;overflow:hidden;opacity:${unlocked ? '1' : '0.4'};" data-ratlas-key="${key}" data-ratlas-name="${c.name}">
          ${display}
          <span style="font-size:8px;color:var(--sp-text-muted);text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:90%;">${unlocked ? c.name : '???'}</span>
          ${unlocked ? `<span style="font-size:7px;color:var(--sp-text-muted);">⭐+${c.reputationGive} | 💰×${c.tipMulti}</span>` : `<span style="font-size:7px;color:#f66;">声望${c.reputationRequired}</span>`}
          ${unlocked ? `<div class="sp-ratlas-upload" data-key="${key}" data-name="${c.name}" style="position:absolute;top:2px;right:2px;width:14px;height:14px;border-radius:50%;background:rgba(0,0,0,0.6);color:#fff;font-size:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity 0.2s;">📷</div>` : ''}
        </div>
      `;
    });
    html += `</div>`;

    html += `<div style="font-size:10px;color:var(--sp-text-muted);text-align:center;margin-top:6px;">💡 hover 显示上传按钮，⭐推荐使用图片链接节省存储空间</div>`;

    container.innerHTML = html;

    // hover 显示上传按钮
    container.querySelectorAll('[data-ratlas-key]').forEach(item => {
      item.addEventListener('mouseenter', () => {
        const btn = item.querySelector('.sp-ratlas-upload');
        if (btn) btn.style.opacity = '1';
      });
      item.addEventListener('mouseleave', () => {
        const btn = item.querySelector('.sp-ratlas-upload');
        if (btn) btn.style.opacity = '0';
      });
    });

    // 上传按钮点击
    container.querySelectorAll('.sp-ratlas-upload').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        restaurantPromptAtlasUpload(btn.dataset.key, btn.dataset.name);
      });
    });
  }

  // ===== 餐厅图鉴图片上传 =====
  function restaurantPromptAtlasUpload(key, name) {
    if (!state.gameCustomImages) state.gameCustomImages = {};
    const currentImg = state.gameCustomImages[key];

    // 如果已有图片，先问是否要移除
    if (currentImg) {
      const action = confirm(`「${name}」已有自定义图片\n\n点「确定」→ 移除图片（恢复默认emoji）\n点「取消」→ 替换为新图片`);
      if (action) {
        delete state.gameCustomImages[key];
        saveDataImmediate('餐厅图鉴图片移除');
        restaurantRenderAtlas();
        restaurantShowNotice(`${name} 图片已移除`);
        return;
      }
    }

    const choice = confirm(`设置「${name}」的自定义图片\n\n⭐ 推荐：点「确定」→ 输入图片链接（节省内存）\n点「取消」→ 选择本地文件上传`);

    if (choice) {
      const url = prompt('输入图片链接（留空确认=清除）：', currentImg && currentImg.startsWith('http') ? currentImg : '');
      if (url === null) return;
      const trimmed = url.trim();
      if (!trimmed) {
        delete state.gameCustomImages[key];
        saveDataImmediate('餐厅图鉴图片清除');
        restaurantRenderAtlas();
        restaurantShowNotice(`${name} 图片已清除`);
        return;
      }
      if (!trimmed.startsWith('http')) {
        restaurantShowNotice('请输入以 http 开头的链接');
        return;
      }
      state.gameCustomImages[key] = trimmed;
      saveDataImmediate('餐厅图鉴图片链接');
      restaurantRenderAtlas();
      restaurantShowNotice(`${name} 图片已设置！`);
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/png,image/jpeg,image/gif,image/webp';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
          restaurantShowNotice('图片不能超过2MB，推荐使用图片链接');
          return;
        }
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const compressed = await compressImage(ev.target.result, 80, 0.7);
          if (!state.gameCustomImages) state.gameCustomImages = {};
          state.gameCustomImages[key] = compressed;
          saveDataImmediate('餐厅图鉴图片上传');
          restaurantRenderAtlas();
          restaurantShowNotice(`${name} 图片已设置！（提示：使用链接可节省存储空间）`);
        };
        reader.readAsDataURL(file);
      };
      input.click();
    }
  }

  // ===== 渲染面板框架 =====
  function restaurantRenderPanel() {
    let panel = document.getElementById('sp-restaurant-panel');
    if (panel) panel.remove();

    panel = document.createElement('div');
    panel.id = 'sp-restaurant-panel';
    panel.style.cssText = `
      position: fixed;
      width: 360px;
      max-width: 95vw;
      max-height: 85vh;
      background: var(--sp-bg-main);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid var(--sp-border);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      display: flex;
      flex-direction: column;
      z-index: 2147483646;
      overflow: hidden;
    `;

    panel.innerHTML = `
      <div id="sp-restaurant-header" style="display:flex;align-items:center;padding:10px 12px;background:var(--sp-bg-light);border-bottom:1px solid var(--sp-border-light);cursor:grab;user-select:none;gap:8px;">
        <button id="sp-restaurant-minimize" style="background:none;border:none;font-size:14px;cursor:pointer;color:var(--sp-text-muted);padding:2px 4px;flex-shrink:0;" title="缩小">─</button>
        <button id="sp-restaurant-close" style="background:none;border:none;font-size:16px;cursor:pointer;color:var(--sp-text-muted);padding:2px 4px;flex-shrink:0;" title="关闭">✕</button>
        <span style="font-size:14px;font-weight:700;color:var(--sp-text-primary);flex:1;text-align:center;">🐱 小猫餐厅</span>
        <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
          <span style="font-size:11px;color:#a0d4ff;" id="sp-restaurant-lvl">🏕️Lv.1</span>
          <span style="font-size:11px;color:#ffdd80;font-weight:600;">⭐<span id="sp-restaurant-rep">0</span></span>
          <span style="font-size:11px;color:#ffb347;font-weight:600;">🪙<span id="sp-restaurant-gold">0</span></span>
          <span id="sp-restaurant-next-lvl" style="font-size:9px;color:var(--sp-text-muted);white-space:nowrap;"></span>
        </div>
      </div>
      <div id="sp-restaurant-notice" style="position:absolute;top:52px;left:12px;right:12px;padding:5px 12px;font-size:11px;color:#fff;background:rgba(30,30,40,0.92);border:1px solid var(--sp-primary-border);border-radius:7px;text-align:center;opacity:0;pointer-events:none;transform:translateY(-5px);transition:opacity 0.2s,transform 0.2s;z-index:10;"></div>
      <div style="display:flex;gap:3px;padding:5px 8px;background:rgba(255,255,255,0.03);border-bottom:1px solid var(--sp-border-light);">
        <button class="sp-game-tab active" data-rtab="kitchen">🍳 厨房</button>
        <button class="sp-game-tab" data-rtab="menu">📋 菜单</button>
        <button class="sp-game-tab" data-rtab="supply">🛒 补货</button>
        <button class="sp-game-tab" data-rtab="stock">🎒 库存</button>
        <button class="sp-game-tab" data-rtab="atlas">📖 图鉴</button>
      </div>
      <div id="sp-restaurant-body" style="flex:1;overflow-y:auto;padding:10px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.2) transparent;">
        <div id="sp-restaurant-kitchen"></div>
        <div id="sp-restaurant-menu" style="display:none;"></div>
        <div id="sp-restaurant-supply" style="display:none;"></div>
        <div id="sp-restaurant-stock" style="display:none;"></div>
        <div id="sp-restaurant-atlas" style="display:none;"></div>
      </div>
    `;

    document.body.appendChild(panel);

    // 绑定最小化
    document.getElementById('sp-restaurant-minimize').onclick = () => {
      const isMin = panel.style.height === 'auto';
      if (isMin) {
        panel.style.height = '';
        panel.style.maxHeight = '85vh';
        document.getElementById('sp-restaurant-body').style.display = '';
        panel.querySelector('.sp-game-tab').parentElement.style.display = '';
        document.getElementById('sp-restaurant-minimize').textContent = '─';
      } else {
        panel.style.height = 'auto';
        panel.style.maxHeight = 'none';
        document.getElementById('sp-restaurant-body').style.display = 'none';
        panel.querySelector('.sp-game-tab').parentElement.style.display = 'none';
        document.getElementById('sp-restaurant-minimize').textContent = '□';
      }
    };

    // 绑定关闭
    document.getElementById('sp-restaurant-close').onclick = () => toggleRestaurant();

    // 绑定标签页
    panel.querySelectorAll('.sp-game-tab[data-rtab]').forEach(tab => {
      tab.onclick = () => {
        panel.querySelectorAll('.sp-game-tab[data-rtab]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        ['kitchen', 'menu', 'supply', 'stock', 'atlas'].forEach(name => {
          const el = document.getElementById(`sp-restaurant-${name}`);
          if (el) el.style.display = tab.dataset.rtab === name ? '' : 'none';
        });
        // 切换到对应标签时渲染对应内容
        const rtab = tab.dataset.rtab;
        if (rtab === 'kitchen') restaurantRenderKitchen();
        else if (rtab === 'menu') restaurantRenderMenu();
        else if (rtab === 'supply') restaurantRenderSupply();
        else if (rtab === 'stock') restaurantRenderStock();
        else if (rtab === 'atlas') restaurantRenderAtlas();
      };
    });

    // 绑定拖拽
    restaurantBindDrag();
  }

  // ===== 面板拖拽 =====
  function restaurantBindDrag() {
    const header = document.getElementById('sp-restaurant-header');
    const panel = document.getElementById('sp-restaurant-panel');
    if (!header || !panel) return;

    let dragging = false, offX = 0, offY = 0;

    const down = (e) => {
      if (e.target.closest('#sp-restaurant-close') || e.target.closest('#sp-restaurant-minimize')) return;
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

  // ===== 开关餐厅面板 =====
  function toggleRestaurant() {
    isRestaurantOpen = !isRestaurantOpen;
    let panel = document.getElementById('sp-restaurant-panel');

    if (isRestaurantOpen) {
      // 重置今日收入（如果跨天了）
      const today = new Date().toISOString().slice(0, 10);
      if (state.restaurantLastOpenDate !== today) {
        state.restaurantTodayEarnings = 0;
        state.restaurantLastOpenDate = today;
      }

      // 重建面板
      if (panel) panel.remove();
      restaurantRenderPanel();
      panel = document.getElementById('sp-restaurant-panel');

      // 居中定位
      const w = Math.min(360, window.innerWidth - 20);
      panel.style.width = w + 'px';
      requestAnimationFrame(() => {
        const h = panel.offsetHeight;
        const maxTop = window.innerHeight - h - 20;
        const centerTop = Math.floor((window.innerHeight - h) / 2);
        panel.style.left = Math.floor((window.innerWidth - w) / 2) + 'px';
        panel.style.top = Math.max(10, Math.min(centerTop, maxTop)) + 'px';
      });

      // 初始渲染
      restaurantRender();

      // 启动客人到来定时器（15~25秒随机间隔）
      restaurantStartCustomerTimer();

      // 启动倒计时刷新定时器（每秒刷新客人耐心倒计时）
      restaurantStartCountdownTimer();

    } else {
      // 关闭：停止所有定时器，销毁面板
      restaurantStopTimers();
      if (panel) panel.remove();

      // 如果正在烹饪，取消烹饪（食材已扣除，但不产出菜品）
      if (restaurantRuntime.cooking) {
        const recipe = RESTAURANT_RECIPES.find(r => r.id === restaurantRuntime.cooking.recipeId);
        restaurantShowNotice(`关店了，「${recipe?.name || '菜'}」没做完`);
        restaurantRuntime.cooking = null;
      }

      // 清空等候客人
      restaurantRuntime.customers = [];
    }
  }

  // ===== 启动客人到来定时器 =====
  function restaurantStartCustomerTimer() {
    if (restaurantCustomerTimer) clearTimeout(restaurantCustomerTimer);

    const scheduleNext = () => {
      if (!isRestaurantOpen) return;
      // 15~25秒随机间隔
      const interval = (15 + Math.floor(Math.random() * 11)) * 1000;
      restaurantCustomerTimer = setTimeout(() => {
        restaurantSpawnCustomer();
        scheduleNext();
      }, interval);
    };

    // 开店后3秒来第一位客人
    restaurantCustomerTimer = setTimeout(() => {
      restaurantSpawnCustomer();
      scheduleNext();
    }, 3000);
  }

  // ===== 启动倒计时刷新定时器 =====
  function restaurantStartCountdownTimer() {
    if (restaurantCountdownTimer) clearInterval(restaurantCountdownTimer);
    restaurantCountdownTimer = setInterval(() => {
      if (!isRestaurantOpen) return;
      restaurantCheckTimeout();
      // 每秒刷新厨房界面（更新倒计时显示 + 桌子状态）
      const activeTab = document.querySelector('#sp-restaurant-panel .sp-game-tab.active[data-rtab]');
      if (activeTab && activeTab.dataset.rtab === 'kitchen') {
        restaurantRenderKitchen();
      }
      // 烹饪完成后也刷新烹饪台倒计时
      if (restaurantRuntime.cooking) {
        const elapsed = Date.now() - restaurantRuntime.cooking.startTime;
        if (elapsed >= restaurantRuntime.cooking.duration) {
          restaurantFinishCooking();
        }
      }
    }, 1000);
  }

  // ===== 小猫餐厅：食谱选择弹窗 =====
  function restaurantShowRecipeModal() {
    document.getElementById('sp-restaurant-recipe-modal-overlay')?.remove();

    const recipes = restaurantGetUnlockedRecipes();

    // 收集当前所有客人需要的菜品类型和指定食谱
    const wantedRecipeIds = new Set();
    const wantedCategories = new Set();
    restaurantRuntime.customers.forEach(customer => {
      if (customer.wantsCategory === 'specific' && customer.specificRecipe) {
        wantedRecipeIds.add(customer.specificRecipe);
      }
      if (customer.wantsCategory === 'drink') wantedCategories.add('drink');
      if (customer.wantsCategory === 'snack') { wantedCategories.add('snack'); wantedCategories.add('drink'); }
      if (customer.wantsCategory === 'dish') { wantedCategories.add('dish'); wantedCategories.add('snack'); }
      if (customer.wantsCategory === 'premium') wantedCategories.add('premium');
      if (customer.wantsCategory === 'any') { wantedCategories.add('drink'); wantedCategories.add('snack'); wantedCategories.add('dish'); wantedCategories.add('premium'); }
    });

    // 判断食谱是否被客人需要
    function isWantedByCustomer(recipe) {
      if (wantedRecipeIds.has(recipe.id)) return true;
      if (wantedCategories.has('drink') && recipe.category === 'drink') return true;
      if (wantedCategories.has('snack') && (recipe.category === 'snack' || recipe.category === 'drink')) return true;
      if (wantedCategories.has('dish') && (recipe.category === 'dish' || recipe.category === 'snack')) return true;
      if (wantedCategories.has('premium') && recipe.category === 'dish' && recipe.sellPrice >= 35) return true;
      return false;
    }

    // 排序优先级：
    // 1. 客人需要 + 能制作（最优先）
    // 2. 客人需要 + 不能制作
    // 3. 能制作 + 客人不需要
    // 4. 不能制作 + 客人不需要
    recipes.sort((a, b) => {
      const canA = restaurantCheckIngredients(a) ? 0 : 1;
      const canB = restaurantCheckIngredients(b) ? 0 : 1;
      const wantA = isWantedByCustomer(a) ? 0 : 1;
      const wantB = isWantedByCustomer(b) ? 0 : 1;
      // 先按 wanted 排序，再按 can 排序
      if (wantA !== wantB) return wantA - wantB;
      return canA - canB;
    });


    const overlay = document.createElement('div');
    overlay.id = 'sp-restaurant-recipe-modal-overlay';

    const itemsHtml = recipes.map(r => {
      const canMake = restaurantCheckIngredients(r);
      const ingText = r.ingredients.map(ing => {
        const fd = FRIDGE_FOODS.find(f => f.id === ing.foodId);
        const have = (state.fridgeInventory || []).find(i => i.foodId === ing.foodId);
        const haveCount = have ? have.count : 0;
        const ok = haveCount >= ing.count;
        return `${fd?.emoji || '?'}×${ing.count}${ok ? '✅' : '❌'}`;
      }).join(' ');
      const seaText = r.seasonings.map(s => {
        const sd = RESTAURANT_SEASONINGS.find(x => x.id === s.id);
        const have = (state.restaurantSeasonings && state.restaurantSeasonings[s.id]) || 0;
        const ok = have >= s.count;
        return `${sd?.emoji || '?'}×${s.count}${ok ? '✅' : '❌'}`;
      }).join(' ');
      const materials = [ingText, seaText].filter(Boolean).join(' 🧂 ');
      return `
        <div class="sp-restaurant-recipe-item ${canMake ? '' : 'sp-restaurant-recipe-disabled'}" data-recipe-id="${r.id}">
          <span class="sp-restaurant-recipe-emoji">${r.emoji}</span>
          <div class="sp-restaurant-recipe-info">
            <div class="sp-restaurant-recipe-name">${r.name}</div>
            <div class="sp-restaurant-recipe-detail">${materials} | ⏱️${r.cookTime}s | 🍖+${r.feedAmount}</div>
          </div>
          <span class="sp-restaurant-recipe-price">🪙${r.sellPrice}</span>
          ${!canMake ? '<span class="sp-restaurant-recipe-lock">缺料</span>' : ''}
        </div>
      `;
    }).join('');

    overlay.innerHTML = `
      <div id="sp-restaurant-recipe-modal">
        <div id="sp-restaurant-recipe-modal-header">
          <span>📋 选择食谱</span>
          <button id="sp-restaurant-recipe-modal-close">✕</button>
        </div>
        <div id="sp-restaurant-recipe-modal-body">
          ${itemsHtml || '<div style="text-align:center;padding:20px;color:var(--sp-text-muted);font-size:12px;">暂无可用食谱，先去冰箱整理备货吧</div>'}
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('sp-restaurant-recipe-modal-close').onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

    overlay.querySelectorAll('.sp-restaurant-recipe-item').forEach(item => {
      item.onclick = () => {
        const recipeId = item.dataset.recipeId;
        overlay.remove();
        restaurantStartCooking(recipeId);
      };
    });
  }

  // ===== 停止所有定时器 =====
  function restaurantStopTimers() {
    if (restaurantCustomerTimer) {
      clearTimeout(restaurantCustomerTimer);
      restaurantCustomerTimer = null;
    }
    if (restaurantCountdownTimer) {
      clearInterval(restaurantCountdownTimer);
      restaurantCountdownTimer = null;
    }
    if (restaurantCookTimer) {
      clearTimeout(restaurantCookTimer);
      restaurantCookTimer = null;
    }
  }

  // ============================================================
  // 🛒 货架整理游戏模块 - MeepShelfSort
  // ============================================================

  // ===== 商品定义（每种商品有图标和类型ID）=====
  const SHELF_ITEMS = [
    // --- 原有联动类 ---
    { id: 1,  emoji: '🥤', name: '可乐',       category: 'drink'  },
    { id: 2,  emoji: '🍺', name: '啤酒',       category: 'drink'  },
    { id: 3,  emoji: '🧃', name: '果汁',       category: 'drink'  },
    { id: 4,  emoji: '🍪', name: '饼干',       category: 'snack'  },
    { id: 5,  emoji: '🍫', name: '巧克力',     category: 'snack'  },
    { id: 6,  emoji: '🍭', name: '糖果',       category: 'snack'  },
    { id: 7,  emoji: '🧸', name: '毛绒熊',     category: 'toy'    },
    { id: 8,  emoji: '🪀', name: '悠悠球',     category: 'toy'    },
    { id: 9,  emoji: '🎯', name: '飞镖',       category: 'toy'    },
    { id: 10, emoji: '🐟', name: '猫罐头',     category: 'pet'    },
    { id: 11, emoji: '🌿', name: '猫草',       category: 'pet'    },
    { id: 12, emoji: '🧴', name: '洗护露',     category: 'clean'  },
    // --- 货架专属：食物类（消除后进冰箱库存+餐厅食材）---
    { id: 13, emoji: '🍄', name: '香菇包',     category: 'shelfFood',  linkedFoodId: 'mushroom' },
    { id: 14, emoji: '🦐', name: '鲜虾盒',     category: 'shelfFood',  linkedFoodId: 'shrimp'   },
    { id: 15, emoji: '🌽', name: '甜玉米',     category: 'shelfFood',  linkedFoodId: 'corn'     },
    { id: 16, emoji: '🥑', name: '牛油果',     category: 'shelfFood',  linkedFoodId: 'avocado'  },
    { id: 17, emoji: '🥟', name: '速冻饺子',   category: 'shelfFood',  linkedFoodId: 'dumpling' },
    { id: 18, emoji: '🍜', name: '拉面包',     category: 'shelfFood',  linkedFoodId: 'noodle'   },
    // --- 货架专属：甜品类（消除后进糖葫芦库存或冰箱）---
    { id: 19, emoji: '🍰', name: '小蛋糕',     category: 'shelfDessert', linkedFoodId: 'cake'     },
    { id: 20, emoji: '🍦', name: '冰淇淋杯',   category: 'shelfDessert', linkedFoodId: 'icecream' },
    { id: 21, emoji: '🍡', name: '糖葫芦串',   category: 'shelfDessert', linkedTanghulu: 'strawberry' },
    // --- 货架专属：调味料类（消除后进餐厅调料库存）---
    { id: 22, emoji: '🧂', name: '精盐罐',     category: 'shelfSeasoning', linkedSeasoning: 'salt'   },
    { id: 23, emoji: '🫙', name: '酱油瓶',     category: 'shelfSeasoning', linkedSeasoning: 'soy'    },
    { id: 24, emoji: '🌶️', name: '辣椒酱',     category: 'shelfSeasoning', linkedSeasoning: 'chili'  },
    { id: 25, emoji: '🧈', name: '黄油块',     category: 'shelfSeasoning', linkedSeasoning: 'butter' },
    { id: 26, emoji: '🍯', name: '蜂蜜罐',     category: 'shelfSeasoning', linkedSeasoning: 'honey'  },
    // --- 货架专属：沐浴用品类（消除后进工坊清洁道具背包给桌宠用）---
    { id: 27, emoji: '🫧', name: '泡泡浴液',   category: 'shelfBath',  linkedShopCategory: 'clean', linkedShopIdx: 1 },
    { id: 28, emoji: '🪻', name: '薰衣草皂',   category: 'shelfBath',  linkedShopCategory: 'clean', linkedShopIdx: 4 },
    // --- 货架专属：睡眠用品类（消除后进工坊睡眠道具背包给桌宠用）---
    { id: 29, emoji: '🕯️', name: '香薰蜡烛',   category: 'shelfSleep', linkedShopCategory: 'energy', linkedShopIdx: 4 },
    { id: 30, emoji: '🧣', name: '暖暖毛毯',   category: 'shelfSleep', linkedShopCategory: 'energy', linkedShopIdx: 1 },
  ];


  // ===== 难度配置 =====
  // 货架 2列×4行 = 8个隔间，每隔间3槽 = 24槽
  // 后排深度：每个隔间有几层（前排可见，后排被遮挡）
  const SHELF_DIFFICULTIES = [
    { name: '简单', rows: 4, cols: 2, itemTypes: 5,  totalPerType: 9,  backRows: 3, energyCost: 5,  goldReward: [20, 35]  },
    { name: '普通', rows: 4, cols: 3, itemTypes: 7,  totalPerType: 9,  backRows: 3, energyCost: 7,  goldReward: [35, 55]  },
    { name: '困难', rows: 5, cols: 3, itemTypes: 9,  totalPerType: 9,  backRows: 4, energyCost: 10, goldReward: [55, 80]  },
    { name: '噩梦', rows: 5, cols: 4, itemTypes: 11, totalPerType: 9,  backRows: 4, energyCost: 13, goldReward: [75, 110] },
    { name: '地狱', rows: 6, cols: 4, itemTypes: 12, totalPerType: 12, backRows: 5, energyCost: 16, goldReward: [100, 150] },
    { name: '深渊', rows: 6, cols: 5, itemTypes: 12, totalPerType: 15, backRows: 6, energyCost: 20, goldReward: [130, 200] },
  ];

  // ===== 道具定义 =====
  const SHELF_PROPS = {
    basket: {
      name: '🪵 临时扩展篮',
      desc: '额外提供3格临时收纳（每局1次）',
      price: 100,
      perGameLimit: 1,
      dailyLimit: 5
    },
    autoMatch: {
      name: '🧹 喵喵爪理货',
      desc: '自动找一组三个相同并消除（每局2次）',
      price: 60,
      perGameLimit: 2,
      dailyLimit: 10
    },
    shuffle: {
      name: '🔄 货架大洗牌',
      desc: '将所有露出商品重新随机排列（每局3次）',
      price: 30,
      perGameLimit: 3,
      dailyLimit: 15
    }
  };

  // ===== 运行时状态 =====
  // 货架结构：bays[bayIdx] = { slots: [front[0..2]], backStack: [[type,...]] }
  // slots: 前排3个位置，每个位置存 itemId 或 null
  // backStack: 后排（每个元素是一组3个同类型物品，等前排空出后补充）
  let shelfState = {
    active: false,
    bays: [],
    bagSlots: [null, null, null],  // 底部总背包3格（默认锁定）
    bagUnlocked: false,            // 是否已解锁底部背包（使用扩展篮道具后解锁）
    selected: null,
    difficulty: null,
    propsUsed: { basket: 0, autoMatch: 0, shuffle: 0 },
    eliminatedGroups: 0,
    totalGroups: 0,
    energyCost: 0,
  };

  let isShelfOpen = false;

  // ===== 生成关卡 =====
  function shelfGenerateLevel() {
    const diff = SHELF_DIFFICULTIES[Math.floor(Math.random() * SHELF_DIFFICULTIES.length)];
    shelfState.difficulty = diff;
    shelfState.energyCost = diff.energyCost;

    if (state.gameStamina < diff.energyCost) {
      shelfShowNotice(`体力不足！本局需要 ${diff.energyCost} 点体力`);
      shelfState.active = false;
      return false;
    }
    state.gameStamina -= diff.energyCost;

    // 选择商品类型
    const available = [...SHELF_ITEMS];
    const selectedTypes = [];
    for (let i = 0; i < diff.itemTypes && available.length > 0; i++) {
      const idx = Math.floor(Math.random() * available.length);
      selectedTypes.push(available.splice(idx, 1)[0]);
    }

    // 根据难度的 rows × cols 计算隔间数量
    const BAYS = diff.rows * diff.cols;

    // 计算每个隔间需要的总件数 = 前排3件 + 后排 backRows层 × 3件
    const itemsPerBay = 3 + diff.backRows * 3;
    const totalItemsNeeded = BAYS * itemsPerBay;

    // 核心：确保每种物品数量严格为3的倍数，总量刚好能填满棋盘
    const totalGroups = Math.floor(totalItemsNeeded / 3);
    const baseGroupsPerType = Math.floor(totalGroups / selectedTypes.length);
    let remainderGroups = totalGroups % selectedTypes.length;

    const allItems = [];
    selectedTypes.forEach(type => {
      let groups = baseGroupsPerType;
      if (remainderGroups > 0) {
        groups++;
        remainderGroups--;
      }
      for (let i = 0; i < groups * 3; i++) {
        allItems.push(type.id);
      }
    });

    // 洗牌
    for (let i = allItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
    }

    shelfState.bays = [];
    let itemIdx = 0;

    for (let b = 0; b < BAYS; b++) {
      const bay = {
        slots: [null, null, null],
        backStack: []
      };
      // 先填充前排3格
      for (let s = 0; s < 3; s++) {
        bay.slots[s] = itemIdx < allItems.length ? allItems[itemIdx++] : null;
      }
      // 再填充后排（每层3格）
      for (let layer = 0; layer < diff.backRows; layer++) {
        const row = [];
        for (let s = 0; s < 3; s++) {
          row.push(itemIdx < allItems.length ? allItems[itemIdx++] : null);
        }
        bay.backStack.push(row);
      }
      shelfState.bays.push(bay);
    }

    shelfState.bagSlots = [null, null, null];
    shelfState.bagUnlocked = false;
    shelfState.selected = null;
    shelfState.propsUsed = { basket: 0, autoMatch: 0, shuffle: 0 };
    shelfState.eliminatedGroups = 0;
    shelfState.totalGroups = totalGroups;
    shelfState.active = true;

    // 随机空出前排格子（固定移除1组=3个同类型物品，空出3个格子给玩家初始操作空间）
    const frontByType = {};
    shelfState.bays.forEach((bay, bayIdx) => {
      bay.slots.forEach((v, slotIdx) => {
        if (v !== null) {
          if (!frontByType[v]) frontByType[v] = [];
          frontByType[v].push({ bayIdx, slotIdx });
        }
      });
    });

    // 找出前排数量 >= 3 的类型，随机选一种整组移除
    const removableTypes = Object.keys(frontByType).filter(k => frontByType[k].length >= 3);
    if (removableTypes.length > 0) {
      const chosenType = removableTypes[Math.floor(Math.random() * removableTypes.length)];
      const positions = frontByType[chosenType];
      const toRemove = positions.slice(0, 3);
      toRemove.forEach(pos => {
        shelfState.bays[pos.bayIdx].slots[pos.slotIdx] = null;
      });
      shelfState.totalGroups--;
    }

    saveDataDebounced('货架整理开局');
    return true;
  }


  // ===== 检查隔间/背包是否触发消除 =====
  // source: 'bay' | 'bag' | 'basket'
  // 返回消除发生的位置信息，或 null
  function shelfCheckEliminate() {
    let eliminated = false;

    // 检查每个隔间的前排3槽
    shelfState.bays.forEach((bay, bayIdx) => {
      const slots = bay.slots;
      // 三槽全满且全相同
      if (slots[0] !== null && slots[0] === slots[1] && slots[1] === slots[2]) {
        const itemData = SHELF_ITEMS.find(it => it.id === slots[0]);
        // 消除
        bay.slots = [null, null, null];
        shelfState.eliminatedGroups++;
        eliminated = true;

        // 后排补位
        shelfAdvanceBack(bayIdx);

        // 给桌宠/餐厅联动 + 货架独有库存
        if (itemData) {
          // === 原有联动：饮品/零食/宠物 → 冰箱库存 ===
          const fridgeFoodMap = {
            'drink': 'cola',
            'snack': 'bread',
            'pet':   'fish',
          };
          const mappedFoodId = fridgeFoodMap[itemData.category];
          if (mappedFoodId) {
            if (!state.fridgeInventory) state.fridgeInventory = [];
            const existing = state.fridgeInventory.find(i => i.foodId === mappedFoodId);
            if (existing) existing.count++;
            else state.fridgeInventory.push({ foodId: mappedFoodId, count: 1 });
          }

          // === 原有联动：玩具 → 工坊睡眠道具 ===
          if (itemData.category === 'toy') {
            if (!state.gameInventory) state.gameInventory = [];
            const toyRewardIdx = Math.floor(Math.random() * 2);
            const existing = state.gameInventory.find(i => i.category === 'energy' && i.idx === toyRewardIdx);
            if (existing) existing.count++;
            else state.gameInventory.push({ category: 'energy', idx: toyRewardIdx, count: 1 });
          }

          // === 原有联动：清洁 → 工坊清洁道具 ===
          if (itemData.category === 'clean') {
            if (!state.gameInventory) state.gameInventory = [];
            const cleanRewardIdx = Math.floor(Math.random() * 2);
            const existing = state.gameInventory.find(i => i.category === 'clean' && i.idx === cleanRewardIdx);
            if (existing) existing.count++;
            else state.gameInventory.push({ category: 'clean', idx: cleanRewardIdx, count: 1 });
          }

          // === 新增：货架食物类 → 冰箱库存（给桌宠投喂+给餐厅食材）===
          if (itemData.linkedFoodId) {
            if (!state.fridgeInventory) state.fridgeInventory = [];
            const existing = state.fridgeInventory.find(i => i.foodId === itemData.linkedFoodId);
            if (existing) existing.count++;
            else state.fridgeInventory.push({ foodId: itemData.linkedFoodId, count: 1 });
          }

          // === 新增：货架甜品类 → 冰箱库存或糖葫芦库存 ===
          if (itemData.category === 'shelfDessert') {
            if (itemData.linkedFoodId) {
              if (!state.fridgeInventory) state.fridgeInventory = [];
              const existing = state.fridgeInventory.find(i => i.foodId === itemData.linkedFoodId);
              if (existing) existing.count++;
              else state.fridgeInventory.push({ foodId: itemData.linkedFoodId, count: 1 });
            }
            if (itemData.linkedTanghulu) {
              if (!state.tanghuluInventory) state.tanghuluInventory = [];
              const existing = state.tanghuluInventory.find(i => i.fruitKey === itemData.linkedTanghulu);
              if (existing) existing.count++;
              else state.tanghuluInventory.push({ fruitKey: itemData.linkedTanghulu, count: 1 });
            }
          }

          // === 新增：货架调味料类 → 餐厅调料库存 ===
          if (itemData.linkedSeasoning) {
            if (!state.restaurantSeasonings) state.restaurantSeasonings = {};
            state.restaurantSeasonings[itemData.linkedSeasoning] = (state.restaurantSeasonings[itemData.linkedSeasoning] || 0) + 2;
          }

          // === 新增：货架沐浴/睡眠用品类 → 工坊道具背包 ===
          if (itemData.linkedShopCategory && itemData.linkedShopIdx !== undefined) {
            if (!state.gameInventory) state.gameInventory = [];
            const existing = state.gameInventory.find(i => i.category === itemData.linkedShopCategory && i.idx === itemData.linkedShopIdx);
            if (existing) existing.count++;
            else state.gameInventory.push({ category: itemData.linkedShopCategory, idx: itemData.linkedShopIdx, count: 1 });
          }

          // === 所有消除都额外给金币（1~2）===
          state.gameGold += 1 + Math.floor(Math.random() * 2);
        }

      }
    });

    // 检查扩展篮（3槽全满且全相同）
    if (shelfState.basketActive) {
      const bs = shelfState.basketSlots;
      if (bs[0] !== null && bs[0] === bs[1] && bs[1] === bs[2]) {
        shelfState.basketSlots = [null, null, null];
        shelfState.eliminatedGroups++;
        eliminated = true;
      }
    }

    // 检查总背包（2槽，只做参考，不自动消除，需配合隔间）
    // 总背包的物品可以手动移到隔间凑三消，不自动消

    return eliminated;
  }

  // ===== 后排补位 =====
  function shelfAdvanceBack(bayIdx) {
    const bay = shelfState.bays[bayIdx];
    if (bay.backStack.length === 0) return;
    // 取最前面的后排一层补到前排
    const nextRow = bay.backStack.shift();
    bay.slots = nextRow.map(v => v); // 复制
  }

  // ===== 移动物品逻辑 =====
  // from: {source:'bay'|'bag'|'basket', bayIdx?, slotIdx}
  // to:   {source:'bay'|'bag'|'basket', bayIdx?, slotIdx}
  function shelfMove(from, to) {
    // 获取 from 的值
    let fromVal = shelfGetSlotValue(from);
    if (fromVal === null) return false;

    // 获取 to 的值
    let toVal = shelfGetSlotValue(to);

    // 目标已满（非null）且不是要交换
    // 规则：目标格为空时才能放入
    if (toVal !== null) {
      shelfShowNotice('目标格已有物品！');
      return false;
    }

    // 目标是隔间：检查隔间是否该格可用（前排任意空格均可）
    // 这里直接允许放到任意空格

    // 执行移动
    shelfSetSlotValue(to, fromVal);
    shelfSetSlotValue(from, null);

    return true;
  }

  function shelfGetSlotValue(pos) {
    if (pos.source === 'bay') {
      return shelfState.bays[pos.bayIdx].slots[pos.slotIdx];
    } else if (pos.source === 'bag') {
      return shelfState.bagSlots[pos.slotIdx];
    } else if (pos.source === 'basket') {
      return shelfState.basketSlots[pos.slotIdx];
    }
    return null;
  }

  function shelfSetSlotValue(pos, val) {
    if (pos.source === 'bay') {
      shelfState.bays[pos.bayIdx].slots[pos.slotIdx] = val;
    } else if (pos.source === 'bag') {
      shelfState.bagSlots[pos.slotIdx] = val;
    } else if (pos.source === 'basket') {
      shelfState.basketSlots[pos.slotIdx] = val;
    }
  }

  // ===== 检查是否死局（所有可见格都满且无法凑三消）=====
  function shelfCheckDeadlock() {
    // 收集所有可见的物品（前排 + 背包 + 扩展篮）
    const visible = {};
    shelfState.bays.forEach(bay => {
      bay.slots.forEach(v => {
        if (v !== null) visible[v] = (visible[v] || 0) + 1;
      });
    });
    if (shelfState.bagUnlocked) {
      shelfState.bagSlots.forEach(v => {
        if (v !== null) visible[v] = (visible[v] || 0) + 1;
      });
    }

    // 检查是否有任何类型≥3
    const canEliminate = Object.values(visible).some(c => c >= 3);
    if (canEliminate) return false;

    // 检查是否有空格可以移动
    const hasEmpty =
      shelfState.bays.some(bay => bay.slots.some(v => v === null)) ||
      (shelfState.bagUnlocked && shelfState.bagSlots.some(v => v === null));

    if (hasEmpty) return false;

    return true; // 死局
  }

  // ===== 检查胜利 =====
  function shelfCheckWin() {
    const allEmpty =
      shelfState.bays.every(bay =>
        bay.slots.every(v => v === null) && bay.backStack.length === 0
      ) &&
      shelfState.bagSlots.every(v => v === null);
    return allEmpty;
  }

  // ===== 道具：临时扩展篮 =====
  function shelfUsePropBasket() {
    if (shelfState.propsUsed.basket >= SHELF_PROPS.basket.perGameLimit) {
      shelfShowNotice(`扩展篮本局已用完（限${SHELF_PROPS.basket.perGameLimit}次）`);
      return;
    }
    if (!state.shelfPropInventory) state.shelfPropInventory = { basket: 0, autoMatch: 0, shuffle: 0 };
    if ((state.shelfPropInventory.basket || 0) <= 0) {
      shelfShowNotice('扩展篮库存不足！去商店购买吧');
      return;
    }
    if (shelfState.bagUnlocked) {
      shelfShowNotice('底部背包已经解锁了！');
      return;
    }

    state.shelfPropInventory.basket--;
    shelfState.propsUsed.basket++;
    shelfState.bagUnlocked = true;

    shelfShowNotice('🪵 底部背包已解锁！获得3个临时格子');
    saveDataDebounced('货架使用扩展篮');
    shelfRender();
  }

  // ===== 道具：喵喵爪理货（自动消除一组）=====
  function shelfUsePropAutoMatch() {
    if (shelfState.propsUsed.autoMatch >= SHELF_PROPS.autoMatch.perGameLimit) {
      shelfShowNotice(`喵喵爪本局已用完（限${SHELF_PROPS.autoMatch.perGameLimit}次）`);
      return;
    }
    if (!state.shelfPropInventory) state.shelfPropInventory = { basket: 0, autoMatch: 0, shuffle: 0 };
    if ((state.shelfPropInventory.autoMatch || 0) <= 0) {
      shelfShowNotice('喵喵爪库存不足！去商店购买吧');
      return;
    }

    // 收集所有可见物品的位置
    const positions = {};
    shelfState.bays.forEach((bay, bayIdx) => {
      bay.slots.forEach((v, slotIdx) => {
        if (v === null) return;
        if (!positions[v]) positions[v] = [];
        positions[v].push({ source: 'bay', bayIdx, slotIdx });
      });
    });
    shelfState.bagSlots.forEach((v, slotIdx) => {
      if (v === null) return;
      if (!positions[v]) positions[v] = [];
      positions[v].push({ source: 'bag', slotIdx });
    });
    if (shelfState.basketActive) {
      shelfState.basketSlots.forEach((v, slotIdx) => {
        if (v === null) return;
        if (!positions[v]) positions[v] = [];
        positions[v].push({ source: 'basket', slotIdx });
      });
    }

    // 找可以凑3个的类型
    const matchable = Object.keys(positions).filter(k => positions[k].length >= 3);
    if (matchable.length === 0) {
      shelfShowNotice('🧹 当前没有可以直接凑满3个的商品！');
      // 不扣库存
      return;
    }

    state.shelfPropInventory.autoMatch--;
    shelfState.propsUsed.autoMatch++;

    // 随机选一种消除
    const chosen = matchable[Math.floor(Math.random() * matchable.length)];
    const locs = positions[chosen].slice(0, 3);
    const itemData = SHELF_ITEMS.find(it => it.id === parseInt(chosen));

    locs.forEach(loc => {
      shelfSetSlotValue(loc, null);
    });
    shelfState.eliminatedGroups++;

    // 后排补位（可能有隔间空出来）
    shelfState.bays.forEach((bay, bayIdx) => {
      if (bay.slots.every(v => v === null) && bay.backStack.length > 0) {
        shelfAdvanceBack(bayIdx);
      }
    });

    shelfShowNotice(`🧹 喵喵爪消除了 ${itemData?.emoji || '?'} ${itemData?.name || '?'} ×3！`);
    saveDataDebounced('货架喵喵爪');

    // 检查胜利
    if (shelfCheckWin()) {
      shelfState.active = false;
      setTimeout(() => shelfGameOver(true), 400);
    }

    shelfRender();
  }

  // ===== 道具：货架大洗牌 =====
  function shelfUsePropShuffle() {
    if (shelfState.propsUsed.shuffle >= SHELF_PROPS.shuffle.perGameLimit) {
      shelfShowNotice(`洗牌本局已用完（限${SHELF_PROPS.shuffle.perGameLimit}次）`);
      return;
    }
    if (!state.shelfPropInventory) state.shelfPropInventory = { basket: 0, autoMatch: 0, shuffle: 0 };
    if ((state.shelfPropInventory.shuffle || 0) <= 0) {
      shelfShowNotice('洗牌道具库存不足！去商店购买吧');
      return;
    }

    // 收集所有前排可见物品
    const visible = [];
    shelfState.bays.forEach((bay, bayIdx) => {
      bay.slots.forEach((v, slotIdx) => {
        if (v !== null) visible.push({ v, source: 'bay', bayIdx, slotIdx });
      });
    });

    if (visible.length < 2) {
      shelfShowNotice('可见商品太少，无法洗牌！');
      return;
    }

    state.shelfPropInventory.shuffle--;
    shelfState.propsUsed.shuffle++;

    // 洗牌值
    const vals = visible.map(p => p.v);
    for (let i = vals.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [vals[i], vals[j]] = [vals[j], vals[i]];
    }

    // 写回
    visible.forEach((pos, i) => {
      shelfSetSlotValue(pos, vals[i]);
    });

    shelfShowNotice('🔄 货架商品已重新洗牌！');
    saveDataDebounced('货架洗牌');
    shelfRender();
  }

  // ===== 商店购买 =====
  function shelfBuyProp(propKey) {
    const prop = SHELF_PROPS[propKey];
    if (!prop) return;

    if (state.gameGold < prop.price) {
      shelfShowNotice(`金币不足！需要 ${prop.price} 🪙`);
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    if (!state.shelfPropShopLog) state.shelfPropShopLog = {};
    if (!state.shelfPropShopLog[today]) state.shelfPropShopLog[today] = {};
    const bought = state.shelfPropShopLog[today][propKey] || 0;
    if (bought >= prop.dailyLimit) {
      shelfShowNotice(`${prop.name} 今日已售罄（限${prop.dailyLimit}个/天）`);
      return;
    }

    state.gameGold -= prop.price;
    state.shelfPropShopLog[today][propKey] = bought + 1;
    if (!state.shelfPropInventory) state.shelfPropInventory = { basket: 0, autoMatch: 0, shuffle: 0 };
    state.shelfPropInventory[propKey] = (state.shelfPropInventory[propKey] || 0) + 1;

    shelfShowNotice(`购买了 ${prop.name}，已放入背包！`);
    saveDataDebounced('货架商店购买');
    shelfRenderShop();
    shelfRenderBag();
    const goldEl = document.getElementById('sp-shelf-gold');
    if (goldEl) goldEl.textContent = state.gameGold;
  }

  // ===== 游戏结算 =====
  function shelfGameOver(victory) {
    shelfState.active = false;

    const baseReward = shelfState.eliminatedGroups * 2;
    let bonusReward = 0;
    let bonusMsg = '';

    if (victory) {
      const diff = shelfState.difficulty;
      bonusReward = diff.goldReward[0] + Math.floor(Math.random() * (diff.goldReward[1] - diff.goldReward[0] + 1));
      bonusMsg = `\n🏆 通关奖励: +${bonusReward} 🪙`;
      state.energy = Math.min(100, state.energy + 2);
      state.hunger = Math.min(100, state.hunger + 2);
      updateMood();
      updateStatusBars();
    }

    const totalGold = baseReward + bonusReward;
    state.gameGold += totalGold;
    saveDataImmediate('货架整理结算');
    checkAchievements();

    const panel = document.getElementById('sp-shelf-panel');
    if (!panel) return;
    panel.querySelector('#sp-shelf-result-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'sp-shelf-result-overlay';
    overlay.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:10;border-radius:16px;';
    overlay.innerHTML = `
      <div class="sp-shelf-result-box">
        <div class="sp-shelf-result-title">${victory ? '🎉 货架清空啦！' : '😿 货架卡住了'}</div>
        <div class="sp-shelf-result-info">
          <div>难度: ${shelfState.difficulty?.name || '未知'}</div>
          <div>消除: ${shelfState.eliminatedGroups} 组</div>
          <div>消除奖励: +${baseReward} 🪙${bonusMsg}</div>
          <div style="font-weight:700;margin-top:6px;">总获得: +${totalGold} 🪙</div>
        </div>
        <div class="sp-shelf-result-actions">
          <button class="sp-shelf-result-btn" id="sp-shelf-restart">🔄 再来一局</button>
          <button class="sp-shelf-result-btn sp-shelf-result-close" id="sp-shelf-quit">❌ 退出</button>
        </div>
      </div>
    `;
    panel.appendChild(overlay);

    document.getElementById('sp-shelf-restart')?.addEventListener('click', () => {
      overlay.remove();
      shelfConfirmNewGame();
    });
    document.getElementById('sp-shelf-quit')?.addEventListener('click', () => {
      overlay.remove();
      toggleShelfGame();
    });
  }

  // ===== 通知 =====
  function shelfShowNotice(text) {
    const notice = document.getElementById('sp-shelf-notice');
    if (!notice) return;
    notice.textContent = text;
    notice.classList.add('visible');
    clearTimeout(notice._timer);
    notice._timer = setTimeout(() => notice.classList.remove('visible'), 3000);
  }

  // ===== 渲染背包标签页 =====
  function shelfRenderBag() {
    const container = document.getElementById('sp-shelf-bag-content');
    if (!container) return;
    if (!state.shelfPropInventory) state.shelfPropInventory = { basket: 0, autoMatch: 0, shuffle: 0 };

    const items = Object.entries(SHELF_PROPS).map(([key, prop]) => ({
      key, ...prop, count: state.shelfPropInventory[key] || 0
    }));

    const hasAny = items.some(i => i.count > 0);
    container.innerHTML = hasAny ? items.map(item => `
      <div class="sp-shelf-bag-item">
        <span style="font-size:20px;width:28px;text-align:center;flex-shrink:0;">${item.name.split(' ')[0]}</span>
        <div style="flex:1;display:flex;flex-direction:column;gap:2px;">
          <span style="font-size:12px;font-weight:600;color:var(--sp-text-primary);">${item.name.split(' ').slice(1).join(' ')}</span>
          <span style="font-size:10px;color:var(--sp-text-muted);">${item.desc}</span>
        </div>
        <span style="font-size:14px;font-weight:700;color:var(--sp-text-primary);min-width:30px;text-align:right;">×${item.count}</span>
      </div>
    `).join('') : '<div style="text-align:center;padding:20px;color:var(--sp-text-muted);font-size:12px;">背包空空如也～去商店买点道具吧</div>';
  }

  // ===== 渲染商店标签页 =====
  function shelfRenderShop() {
    const container = document.getElementById('sp-shelf-shop-content');
    if (!container) return;
    if (!state.shelfPropInventory) state.shelfPropInventory = { basket: 0, autoMatch: 0, shuffle: 0 };

    const today = new Date().toISOString().slice(0, 10);
    const todayLog = (state.shelfPropShopLog && state.shelfPropShopLog[today]) || {};

    const items = Object.entries(SHELF_PROPS).map(([key, prop]) => {
      const bought = todayLog[key] || 0;
      const soldOut = bought >= prop.dailyLimit;
      const cantAfford = state.gameGold < prop.price;
      const disabled = soldOut || cantAfford;
      const stock = state.shelfPropInventory[key] || 0;
      return { key, ...prop, bought, soldOut, cantAfford, disabled, stock };
    });

    container.innerHTML = items.map(item => `
      <div class="sp-shelf-shop-item ${item.disabled ? 'sp-shelf-shop-disabled' : ''}">
        <span style="font-size:20px;width:28px;text-align:center;flex-shrink:0;">${item.name.split(' ')[0]}</span>
        <div style="flex:1;display:flex;flex-direction:column;gap:2px;">
          <span style="font-size:12px;font-weight:600;color:var(--sp-text-primary);">${item.name.split(' ').slice(1).join(' ')}</span>
          <span style="font-size:10px;color:var(--sp-text-muted);">${item.desc} | 每局限${item.perGameLimit}次</span>
          <span style="font-size:9px;color:var(--sp-text-muted);">${item.soldOut ? '今日售罄' : `今日剩 ${item.dailyLimit - item.bought}`} | 背包: ${item.stock}</span>
        </div>
        <button class="sp-shelf-shop-buy sp-shelf-buy-btn" data-prop="${item.key}" ${item.disabled ? 'disabled' : ''}>🪙${item.price}</button>
      </div>
    `).join('');

    container.querySelectorAll('.sp-shelf-buy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        shelfBuyProp(btn.dataset.prop);
      });
    });
  }

  // ===== 渲染库存标签页 =====
  function shelfRenderInventory() {
    const container = document.getElementById('sp-shelf-inv-content');
    if (!container) return;

    let html = '<div style="font-size:11px;color:var(--sp-text-muted);margin-bottom:8px;line-height:1.7;">消除商品后，对应物资会进入相关背包/库存：<br/>🥤饮品→冰箱可乐 🍪零食→冰箱面包 🐟宠物→冰箱猫罐头<br/>🧸玩具→工坊睡眠道具 🧴清洁→工坊清洁道具<br/>🍄🦐🌽🥑🥟🍜食物→冰箱食材（投喂+餐厅）<br/>🍰🍦甜品→冰箱 🍡糖葫芦→工坊库存<br/>🧂🫙🌶️🧈🍯调料→餐厅（每组+2份）<br/>🫧🪻沐浴→清洁道具 🕯️🧣睡眠→睡眠道具<br/>💰所有消除→额外金币</div>';

    // 冰箱联动库存
    const fridgeItems = ['cola', 'bread', 'fish'];
    const fridgeNames = { cola: '可乐（饮品→冰箱）', bread: '面包（零食→冰箱）', fish: '猫罐头（宠物→冰箱）' };
    const fridgeEmoji = { cola: '🥤', bread: '🍞', fish: '🐟' };

    const fridgeInv = state.fridgeInventory || [];
    const mappedFridge = fridgeItems.map(fid => {
      const inv = fridgeInv.find(i => i.foodId === fid);
      return { fid, count: inv ? inv.count : 0 };
    }).filter(i => i.count > 0);

    if (mappedFridge.length > 0) {
      html += '<div style="font-size:11px;font-weight:600;color:var(--sp-text-primary);margin:8px 0 4px;">🧊 冰箱联动库存</div>';
      mappedFridge.forEach(item => {
        html += `
          <div class="sp-shelf-bag-item">
            <span style="font-size:20px;width:28px;text-align:center;flex-shrink:0;">${fridgeEmoji[item.fid]}</span>
            <div style="flex:1;">
              <span style="font-size:12px;font-weight:600;color:var(--sp-text-primary);">${fridgeNames[item.fid]}</span>
            </div>
            <span style="font-size:14px;font-weight:700;color:var(--sp-text-primary);">×${item.count}</span>
          </div>
        `;
      });
    }

    // 工坊道具联动库存（从货架获得的清洁和睡眠道具）
    const inv = state.gameInventory || [];
    const cleanFromShelf = inv.filter(i => i.category === 'clean' && i.count > 0);
    const energyFromShelf = inv.filter(i => i.category === 'energy' && i.count > 0);

    if (cleanFromShelf.length > 0 || energyFromShelf.length > 0) {
      html += '<div style="font-size:11px;font-weight:600;color:var(--sp-text-primary);margin:8px 0 4px;">🎒 工坊道具联动</div>';
      cleanFromShelf.forEach(i => {
        const data = GAME_SHOP_ITEMS.clean[i.idx];
        if (!data) return;
        html += `
          <div class="sp-shelf-bag-item">
            <span style="font-size:20px;width:28px;text-align:center;flex-shrink:0;">${data.emoji}</span>
            <div style="flex:1;">
              <span style="font-size:12px;font-weight:600;color:var(--sp-text-primary);">${data.name}（清洁）</span>
            </div>
            <span style="font-size:14px;font-weight:700;color:var(--sp-text-primary);">×${i.count}</span>
          </div>
        `;
      });
      energyFromShelf.forEach(i => {
        const data = GAME_SHOP_ITEMS.energy[i.idx];
        if (!data) return;
        html += `
          <div class="sp-shelf-bag-item">
            <span style="font-size:20px;width:28px;text-align:center;flex-shrink:0;">${data.emoji}</span>
            <div style="flex:1;">
              <span style="font-size:12px;font-weight:600;color:var(--sp-text-primary);">${data.name}（睡眠）</span>
            </div>
            <span style="font-size:14px;font-weight:700;color:var(--sp-text-primary);">×${i.count}</span>
          </div>
        `;
      });
    }

    if (mappedFridge.length === 0 && cleanFromShelf.length === 0 && energyFromShelf.length === 0) {
      html += '<div style="text-align:center;padding:16px;color:var(--sp-text-muted);font-size:12px;">暂无库存，消除商品后会在此显示</div>';
    }

    // 餐厅调料联动库存
    const seaEntries = Object.entries(state.restaurantSeasonings || {}).filter(([, v]) => v > 0);
    if (seaEntries.length > 0) {
      html += '<div style="font-size:11px;font-weight:600;color:var(--sp-text-primary);margin:8px 0 4px;">🧂 餐厅调料联动</div>';
      seaEntries.forEach(([id, count]) => {
        const data = RESTAURANT_SEASONINGS.find(s => s.id === id);
        if (!data) return;
        html += `
          <div class="sp-shelf-bag-item">
            <span style="font-size:20px;width:28px;text-align:center;flex-shrink:0;">${data.emoji}</span>
            <div style="flex:1;">
              <span style="font-size:12px;font-weight:600;color:var(--sp-text-primary);">${data.name}（调料→餐厅）</span>
            </div>
            <span style="font-size:14px;font-weight:700;color:var(--sp-text-primary);">×${count}</span>
          </div>
        `;
      });
    }

    // 新增食材进冰箱的联动
    const shelfFoodIds = ['mushroom', 'shrimp', 'corn', 'avocado', 'dumpling', 'noodle', 'cake', 'icecream'];
    const shelfFridgeItems = (state.fridgeInventory || []).filter(i => shelfFoodIds.includes(i.foodId) && i.count > 0);
    if (shelfFridgeItems.length > 0) {
      html += '<div style="font-size:11px;font-weight:600;color:var(--sp-text-primary);margin:8px 0 4px;">🧊 食材/甜品联动（冰箱）</div>';
      shelfFridgeItems.forEach(inv => {
        const data = FRIDGE_FOODS.find(f => f.id === inv.foodId);
        if (!data) return;
        html += `
          <div class="sp-shelf-bag-item">
            <span style="font-size:20px;width:28px;text-align:center;flex-shrink:0;">${data.emoji}</span>
            <div style="flex:1;">
              <span style="font-size:12px;font-weight:600;color:var(--sp-text-primary);">${data.name}（货架→冰箱→投喂/餐厅）</span>
            </div>
            <span style="font-size:14px;font-weight:700;color:var(--sp-text-primary);">×${inv.count}</span>
          </div>
        `;
      });
    }

    container.innerHTML = html;
  }

  // ===== 货架商品图鉴渲染 =====
  function shelfRenderCollection() {
    const grid = document.getElementById('sp-shelf-collection-grid');
    if (!grid) return;
    if (!state.gameCustomImages) state.gameCustomImages = {};

    grid.innerHTML = SHELF_ITEMS.map((item) => {
      const key = `shelf_item_${item.id}`;
      const custom = state.gameCustomImages[key];
      const display = custom
        ? `<img src="${custom}" style="width:28px;height:28px;object-fit:contain;border-radius:4px;" />`
        : `<span style="font-size:22px;">${item.emoji}</span>`;
      return `
        <div style="aspect-ratio:1;border-radius:8px;border:2px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;position:relative;cursor:pointer;overflow:hidden;transition:all 0.15s;" data-shelf-item-id="${item.id}">
          ${display}
          <span style="font-size:8px;color:var(--sp-text-muted);text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:90%;">${item.name}</span>
          <div class="sp-shelf-item-upload" data-item-id="${item.id}" style="position:absolute;top:2px;right:2px;width:16px;height:16px;border-radius:50%;background:rgba(0,0,0,0.6);color:#fff;font-size:9px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity 0.2s;">📷</div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('[data-shelf-item-id]').forEach(item => {
      item.addEventListener('mouseenter', () => {
        const btn = item.querySelector('.sp-shelf-item-upload');
        if (btn) btn.style.opacity = '1';
      });
      item.addEventListener('mouseleave', () => {
        const btn = item.querySelector('.sp-shelf-item-upload');
        if (btn) btn.style.opacity = '0';
      });
    });

    grid.querySelectorAll('.sp-shelf-item-upload').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        shelfPromptItemUpload(parseInt(btn.dataset.itemId));
      });
    });
  }

  // ===== 货架商品图片上传 =====
  function shelfPromptItemUpload(itemId) {
    const item = SHELF_ITEMS.find(it => it.id === itemId);
    const key = `shelf_item_${itemId}`;
    if (!state.gameCustomImages) state.gameCustomImages = {};
    const currentImg = state.gameCustomImages[key];

    // 如果已有图片，先问是否要移除
    if (currentImg) {
      const action = confirm(`「${item?.name || itemId}」已有自定义图片\n\n点「确定」→ 移除图片（恢复默认emoji）\n点「取消」→ 替换为新图片`);
      if (action) {
        delete state.gameCustomImages[key];
        saveDataImmediate('货架商品图片移除');
        shelfRenderCollection();
        shelfShowNotice('图片已移除，恢复默认显示');
        return;
      }
    }

    const choice = confirm(`设置商品「${item?.name || itemId}」的自定义图片\n\n⭐ 推荐：点「确定」→ 输入图片链接（节省内存）\n点「取消」→ 选择本地文件上传`);

    if (choice) {
      const url = prompt('输入图片链接（留空确认=清除）：', currentImg && currentImg.startsWith('http') ? currentImg : '');
      if (url === null) return;
      const trimmed = url.trim();
      if (!trimmed) {
        delete state.gameCustomImages[key];
        saveDataImmediate('货架商品图片清除');
        shelfRenderCollection();
        shelfShowNotice('图片已清除');
        return;
      }
      if (!trimmed.startsWith('http')) {
        shelfShowNotice('请输入以 http 开头的链接');
        return;
      }
      state.gameCustomImages[key] = trimmed;
      saveDataImmediate('货架商品图片链接');
      shelfRenderCollection();
      shelfShowNotice('图片链接已设置！');
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/png,image/jpeg,image/gif,image/webp';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
          shelfShowNotice('图片不能超过2MB，推荐使用图片链接');
          return;
        }
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const compressed = await compressImage(ev.target.result, 80, 0.7);
          if (!state.gameCustomImages) state.gameCustomImages = {};
          state.gameCustomImages[key] = compressed;
          saveDataImmediate('货架商品图片上传');
          shelfRenderCollection();
          shelfShowNotice('图片已设置！（提示：使用链接可节省存储空间）');
        };
        reader.readAsDataURL(file);
      };
      input.click();
    }
  }

  // ===== 主渲染函数 =====
  function shelfRender() {
    const panel = document.getElementById('sp-shelf-panel');
    if (!panel) return;

    // 更新金币
    const goldEl = document.getElementById('sp-shelf-gold');
    if (goldEl) goldEl.textContent = state.gameGold;

    // 更新信息栏
    const infoEl = document.getElementById('sp-shelf-info');
    if (infoEl) {
      const remaining = shelfState.bays.reduce((sum, bay) => {
        const frontCount = bay.slots.filter(v => v !== null).length;
        const backCount = bay.backStack.reduce((s, row) => s + row.filter(v => v !== null).length, 0);
        return sum + frontCount + backCount;
      }, 0);
      infoEl.innerHTML = `
        <span>剩余: ${remaining}件</span>
        <span>已消: ${shelfState.eliminatedGroups}组</span>
        <span>难度: ${shelfState.difficulty?.name || '-'}</span>
      `;
    }

    // 渲染货架（2列×4行 = 8个隔间）
    const areaEl = document.getElementById('sp-shelf-area');
    if (areaEl) {
      // 动态设置网格列数
      const gridCols = shelfState.difficulty ? shelfState.difficulty.cols : 2;
      areaEl.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;

      areaEl.innerHTML = shelfState.bays.map((bay, bayIdx) => {
        const hasBack = bay.backStack.length > 0 && bay.backStack.some(row => row.some(v => v !== null));
        const backDepth = bay.backStack.length;

        const slotsHtml = bay.slots.map((v, slotIdx) => {
          const sel = shelfState.selected;
          const isSelected = sel && sel.source === 'bay' && sel.bayIdx === bayIdx && sel.slotIdx === slotIdx;
          const filled = v !== null;
          const itemData = filled ? SHELF_ITEMS.find(it => it.id === v) : null;

          let cls = 'sp-shelf-slot';
          if (filled) cls += ' sp-shelf-slot-filled';
          if (isSelected) cls += ' sp-shelf-slot-selected';

          return `<div class="${cls}" data-source="bay" data-bay="${bayIdx}" data-slot="${slotIdx}" title="${itemData ? itemData.name : '空格'}">${filled ? itemData.emoji : ''}</div>`;
        }).join('');

        // 后排指示器
        const backIndicator = backDepth > 0
          ? `<div style="position:absolute;top:2px;right:3px;font-size:8px;color:rgba(255,180,100,0.7);font-weight:700;">${backDepth}层</div>`
          : '';

        const rowNum = Math.floor(bayIdx / gridCols) + 1;
        const colNum = (bayIdx % gridCols) + 1;

        return `
          <div class="sp-shelf-bay" data-bay="${bayIdx}" style="position:relative;" title="第${rowNum}排第${colNum}列">
            ${slotsHtml}
            ${backIndicator}
          </div>
        `;
      }).join('');

      // 绑定隔间格子点击
      areaEl.querySelectorAll('.sp-shelf-slot').forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const source = 'bay';
          const bayIdx = parseInt(el.dataset.bay);
          const slotIdx = parseInt(el.dataset.slot);
          shelfHandleClick({ source, bayIdx, slotIdx });
        });
      });

      // PC端拖拽
      shelfBindDragOnSlots(areaEl);
    }

    // 渲染总背包区（底部3格，需道具解锁）
    const bagAreaEl = document.getElementById('sp-shelf-bag-area');
    if (bagAreaEl) {
      const locked = !shelfState.bagUnlocked;
      bagAreaEl.innerHTML = shelfState.bagSlots.map((v, slotIdx) => {
        const sel = shelfState.selected;
        const isSelected = sel && sel.source === 'bag' && sel.slotIdx === slotIdx;
        const filled = v !== null;
        const itemData = filled ? SHELF_ITEMS.find(it => it.id === v) : null;
        let cls = 'sp-shelf-bag-slot';
        if (filled) cls += ' sp-shelf-bag-filled';
        if (isSelected) cls += ' sp-shelf-slot-selected';
        if (locked) cls += ' sp-shelf-bag-locked';
        return `<div class="${cls}" data-source="bag" data-slot="${slotIdx}" title="${locked ? '🔒 使用扩展篮道具解锁' : (itemData ? itemData.name : '总背包格')}">${filled ? itemData.emoji : (locked ? '🔒' : '')}</div>`;
      }).join('');

      bagAreaEl.querySelectorAll('.sp-shelf-bag-slot').forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!shelfState.bagUnlocked) {
            shelfShowNotice('🔒 底部背包未解锁！使用「扩展篮」道具解锁');
            return;
          }
          shelfHandleClick({ source: 'bag', slotIdx: parseInt(el.dataset.slot) });
        });
      });
    }

    // 渲染道具按钮状态
    if (!state.shelfPropInventory) state.shelfPropInventory = { basket: 0, autoMatch: 0, shuffle: 0 };
    const basketCountEl = document.getElementById('sp-shelf-prop-basket-count');
    const autoMatchCountEl = document.getElementById('sp-shelf-prop-automatch-count');
    const shuffleCountEl = document.getElementById('sp-shelf-prop-shuffle-count');
    if (basketCountEl) basketCountEl.textContent = `×${state.shelfPropInventory.basket || 0} (${shelfState.propsUsed.basket}/${SHELF_PROPS.basket.perGameLimit})`;
    if (autoMatchCountEl) autoMatchCountEl.textContent = `×${state.shelfPropInventory.autoMatch || 0} (${shelfState.propsUsed.autoMatch}/${SHELF_PROPS.autoMatch.perGameLimit})`;
    if (shuffleCountEl) shuffleCountEl.textContent = `×${state.shelfPropInventory.shuffle || 0} (${shelfState.propsUsed.shuffle}/${SHELF_PROPS.shuffle.perGameLimit})`;

    // 控制开始按钮显示/隐藏
    const startWrapper = document.getElementById('sp-shelf-start-wrapper');
    if (startWrapper) startWrapper.style.display = shelfState.active ? 'none' : 'flex';

  }

  // ===== 点击处理（选中/移动）=====
  function shelfHandleClick(pos) {
    const sel = shelfState.selected;

    // 没有选中 → 选中当前格（必须有物品）
    if (!sel) {
      const val = shelfGetSlotValue(pos);
      if (val === null) return;
      shelfState.selected = pos;
      shelfRender();
      return;
    }

    // 点同一格 → 取消选中
    const isSame = sel.source === pos.source &&
      sel.slotIdx === pos.slotIdx &&
      (sel.source !== 'bay' || sel.bayIdx === pos.bayIdx);
    if (isSame) {
      shelfState.selected = null;
      shelfRender();
      return;
    }

    // 尝试移动
    const success = shelfMove(sel, pos);
    shelfState.selected = null;

    if (success) {
      // 检查消除
      const eliminated = shelfCheckEliminate();

      // 后排补位（不论是否触发了消除，只要前排空了就补）
      shelfState.bays.forEach((bay, bayIdx) => {
        if (bay.slots.every(v => v === null) && bay.backStack.length > 0) {
          shelfAdvanceBack(bayIdx);
        }
      });

      saveDataDebounced('货架移动');

      // 检查胜利
      if (shelfCheckWin()) {
        shelfState.active = false;
        shelfRender();
        setTimeout(() => shelfGameOver(true), 400);
        return;
      }

      // 检查死局
      if (shelfCheckDeadlock()) {
        shelfShowNotice('⚠️ 好像卡住了！试试使用道具破局？');
      }
    }

    shelfRender();
  }

  // ===== PC端拖拽绑定 =====
  let _shelfDragState = { from: null, clone: null };

  function shelfBindDragOnSlots(container) {
    container.querySelectorAll('.sp-shelf-slot.sp-shelf-slot-filled').forEach(el => {
      el.setAttribute('draggable', 'true');

      el.addEventListener('dragstart', (e) => {
        const source = el.dataset.source;
        const bayIdx = el.dataset.bay !== undefined ? parseInt(el.dataset.bay) : undefined;
        const slotIdx = parseInt(el.dataset.slot);
        _shelfDragState.from = { source, bayIdx, slotIdx };
        el.classList.add('sp-shelf-slot-dragging');
        e.dataTransfer.effectAllowed = 'move';
      });

      el.addEventListener('dragend', () => {
        el.classList.remove('sp-shelf-slot-dragging');
        _shelfDragState.from = null;
        // 清除所有 drop 高亮
        document.querySelectorAll('.sp-shelf-bay-drop-ok, .sp-shelf-bay-drop-bad').forEach(b => {
          b.classList.remove('sp-shelf-bay-drop-ok', 'sp-shelf-bay-drop-bad');
        });
      });
    });

    // dragover / drop 在隔间上
    container.querySelectorAll('.sp-shelf-bay').forEach(bayEl => {
      bayEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!_shelfDragState.from) return;
        const toIdx = parseInt(bayEl.dataset.bay);
        const bay = shelfState.bays[toIdx];
        const hasEmpty = bay.slots.some(v => v === null);
        bayEl.classList.toggle('sp-shelf-bay-drop-ok', hasEmpty);
        bayEl.classList.toggle('sp-shelf-bay-drop-bad', !hasEmpty);
      });

      bayEl.addEventListener('dragleave', () => {
        bayEl.classList.remove('sp-shelf-bay-drop-ok', 'sp-shelf-bay-drop-bad');
      });

      bayEl.addEventListener('drop', (e) => {
        e.preventDefault();
        bayEl.classList.remove('sp-shelf-bay-drop-ok', 'sp-shelf-bay-drop-bad');
        if (!_shelfDragState.from) return;

        const toIdx = parseInt(bayEl.dataset.bay);
        const bay = shelfState.bays[toIdx];
        // 找第一个空槽
        const emptySlot = bay.slots.findIndex(v => v === null);
        if (emptySlot === -1) {
          shelfShowNotice('该隔间已满！');
          return;
        }

        const to = { source: 'bay', bayIdx: toIdx, slotIdx: emptySlot };
        const success = shelfMove(_shelfDragState.from, to);
        _shelfDragState.from = null;
        shelfState.selected = null;

        if (success) {
          const eliminated = shelfCheckEliminate();

          // 后排补位（不论是否触发了消除）
          shelfState.bays.forEach((b, bIdx) => {
            if (b.slots.every(v => v === null) && b.backStack.length > 0) {
              shelfAdvanceBack(bIdx);
            }
          });

          saveDataDebounced('货架拖拽移动');
          if (shelfCheckWin()) {
            shelfState.active = false;
            shelfRender();
            setTimeout(() => shelfGameOver(true), 400);
            return;
          }
          if (shelfCheckDeadlock()) {
            shelfShowNotice('⚠️ 好像卡住了！试试使用道具破局？');
          }
        }
        shelfRender();
      });
    });

    // drop 到总背包格
    const bagAreaEl = document.getElementById('sp-shelf-bag-area');
    if (bagAreaEl) {
      bagAreaEl.querySelectorAll('.sp-shelf-bag-slot').forEach(bagEl => {
        bagEl.addEventListener('dragover', (e) => {
          e.preventDefault();
          if (!_shelfDragState.from) return;
          const slotIdx = parseInt(bagEl.dataset.slot);
          const isEmpty = shelfState.bagSlots[slotIdx] === null;
          bagEl.style.borderColor = isEmpty ? 'rgba(100,220,100,0.7)' : 'rgba(239,83,80,0.7)';
        });
        bagEl.addEventListener('dragleave', () => {
          bagEl.style.borderColor = '';
        });
        bagEl.addEventListener('drop', (e) => {
          e.preventDefault();
          bagEl.style.borderColor = '';
          if (!_shelfDragState.from) return;
          const slotIdx = parseInt(bagEl.dataset.slot);
          if (shelfState.bagSlots[slotIdx] !== null) {
            shelfShowNotice('总背包该格已满！');
            return;
          }
          const to = { source: 'bag', slotIdx };
          shelfMove(_shelfDragState.from, to);
          _shelfDragState.from = null;
          shelfState.selected = null;
          saveDataDebounced('货架拖入背包');
          shelfRender();
        });
      });
    }
  }

  // ===== 渲染主面板 =====
  function shelfRenderPanel() {
    let panel = document.getElementById('sp-shelf-panel');
    if (panel) panel.remove();

    panel = document.createElement('div');
    panel.id = 'sp-shelf-panel';
    panel.innerHTML = `
      <div id="sp-shelf-header">
        <span>🛒 整理货架</span>
        <div class="sp-shelf-header-right">
          <button id="sp-shelf-minimize" title="缩小悬挂" style="background:none;border:none;font-size:14px;cursor:pointer;color:var(--sp-text-muted);padding:2px 6px;">─</button>
          <button id="sp-shelf-close" title="关闭">✕</button>
        </div>
      </div>
      <div id="sp-shelf-notice"></div>
      <div style="display:flex;gap:4px;padding:6px 10px;background:rgba(255,255,255,0.03);border-bottom:1px solid var(--sp-border-light);align-items:center;">
        <button class="sp-game-tab active" data-shelftab="play" id="sp-shelf-tab-play">🎮 游戏</button>
        <button class="sp-game-tab" data-shelftab="bag" id="sp-shelf-tab-bag">🎒 背包</button>
        <button class="sp-game-tab" data-shelftab="shop" id="sp-shelf-tab-shop">🛒 商店</button>
        <button class="sp-game-tab" data-shelftab="inventory" id="sp-shelf-tab-inventory">📦 库存</button>
        <button class="sp-game-tab" data-shelftab="collection" id="sp-shelf-tab-collection">📖 图鉴</button>
        <span class="sp-shelf-gold-display" style="margin-left:auto;">🪙 <span id="sp-shelf-gold">${state.gameGold}</span></span>
      </div>
      <div id="sp-shelf-body">
        <div id="sp-shelf-tab-content-play">
          <div id="sp-shelf-info"></div>
          <div id="sp-shelf-area" class="sp-shelf-area"></div>
          <div style="margin-top:6px;">
            <div style="font-size:10px;color:var(--sp-text-muted);text-align:center;margin-bottom:4px;">📦 临时收纳篮（3格，需道具解锁）</div>
            <div id="sp-shelf-bag-area" class="sp-shelf-bag-area" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:6px 8px;background:rgba(255,215,0,0.06);border-radius:10px;border:2px solid rgba(255,215,0,0.22);"></div>
          </div>
          <div id="sp-shelf-props" style="margin-top:8px;">
            <button class="sp-shelf-prop-btn" id="sp-shelf-prop-basket-btn" title="${SHELF_PROPS.basket.desc}">
              <span class="sp-shelf-prop-icon">🪵</span>
              <span class="sp-shelf-prop-name">扩展篮</span>
              <span class="sp-shelf-prop-count" id="sp-shelf-prop-basket-count">×0</span>
            </button>
            <button class="sp-shelf-prop-btn" id="sp-shelf-prop-automatch-btn" title="${SHELF_PROPS.autoMatch.desc}">
              <span class="sp-shelf-prop-icon">🧹</span>
              <span class="sp-shelf-prop-name">喵喵爪</span>
              <span class="sp-shelf-prop-count" id="sp-shelf-prop-automatch-count">×0</span>
            </button>
            <button class="sp-shelf-prop-btn" id="sp-shelf-prop-shuffle-btn" title="${SHELF_PROPS.shuffle.desc}">
              <span class="sp-shelf-prop-icon">🔄</span>
              <span class="sp-shelf-prop-name">大洗牌</span>
              <span class="sp-shelf-prop-count" id="sp-shelf-prop-shuffle-count">×0</span>
            </button>
          </div>
          <div style="height:8px;"></div>
          <div id="sp-shelf-start-wrapper" style="display:flex;justify-content:center;margin-bottom:8px;"><button class="sp-link-ctrl-btn" id="sp-shelf-start-btn" style="background:var(--sp-primary);color:#fff;border-color:var(--sp-primary-border);padding:10px 24px;font-size:13px;">✨ 开始游戏</button></div>
          <div style="display:flex;gap:8px;justify-content:center;">
            <button class="sp-link-ctrl-btn" id="sp-shelf-restart-btn">🔄 重开</button>
            <button class="sp-link-ctrl-btn sp-link-ctrl-quit" id="sp-shelf-quit-btn">❌ 放弃</button>
          </div>
        </div>
        <div id="sp-shelf-tab-content-bag" style="display:none;padding:8px;">
          <div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:8px;">🎒 道具背包</div>
          <div id="sp-shelf-bag-content"></div>
        </div>
        <div id="sp-shelf-tab-content-shop" style="display:none;padding:8px;">
          <div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:8px;">🛒 道具商店 <span style="font-size:10px;color:var(--sp-text-muted);font-weight:400;">（每种每天限量）</span></div>
          <div id="sp-shelf-shop-content"></div>
        </div>
        <div id="sp-shelf-tab-content-inventory" style="display:none;padding:8px;">
          <div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:8px;">📦 联动库存</div>
          <div id="sp-shelf-inv-content"></div>
        </div>
        <div id="sp-shelf-tab-content-collection" style="display:none;padding:8px;">
          <div style="font-size:12px;font-weight:600;color:var(--sp-text-primary);margin-bottom:8px;">📖 商品图鉴 <span style="font-size:10px;color:var(--sp-text-muted);font-weight:400;">（点击 📷 设置图片，优先推荐链接节省内存）</span></div>
          <div id="sp-shelf-collection-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;"></div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // 最小化
    document.getElementById('sp-shelf-minimize').addEventListener('click', () => {
      const sp = document.getElementById('sp-shelf-panel');
      const minBtn = document.getElementById('sp-shelf-minimize');
      if (!sp || !minBtn) return;
      if (sp.classList.contains('sp-shelf-minimized')) {
        sp.classList.remove('sp-shelf-minimized');
        minBtn.textContent = '─';
        minBtn.title = '缩小悬挂';
      } else {
        sp.classList.add('sp-shelf-minimized');
        minBtn.textContent = '□';
        minBtn.title = '恢复窗口';
      }
    });

    // 关闭
    document.getElementById('sp-shelf-close').addEventListener('click', () => toggleShelfGame());

    // 道具按钮
    document.getElementById('sp-shelf-prop-basket-btn').addEventListener('click', () => shelfUsePropBasket());
    document.getElementById('sp-shelf-prop-automatch-btn').addEventListener('click', () => shelfUsePropAutoMatch());
    document.getElementById('sp-shelf-prop-shuffle-btn').addEventListener('click', () => shelfUsePropShuffle());

    // 开始游戏按钮
    document.getElementById('sp-shelf-start-btn')?.addEventListener('click', () => {
      shelfConfirmNewGame();
    });

    // 重开
    document.getElementById('sp-shelf-restart-btn').addEventListener('click', () => {
      showConfirmDialog({
        title: '🔄 重开本局？',
        desc: '当前进度将清零，重新开始新的一局。<br/>将消耗一定体力。',
        confirmText: '重开',
        cancelText: '继续',
        onConfirm: () => {
          gameRecoverStamina();
          const ok = shelfGenerateLevel();
          if (!ok) return;
          shelfRender();
          shelfShowNotice(`🔄 新一局！难度: ${shelfState.difficulty.name} | -${shelfState.energyCost}⚡`);
          if (isGameOpen) gameRenderStatus();
        }
      });
    });

    // 放弃
    document.getElementById('sp-shelf-quit-btn').addEventListener('click', () => {
      showConfirmDialog({
        title: '❌ 放弃本局？',
        desc: '当前进度将丢失，体力不退还。',
        confirmText: '放弃',
        cancelText: '继续',
        onConfirm: () => {
          shelfState.active = false;
          isShelfOpen = false;
          const p = document.getElementById('sp-shelf-panel');
          if (p) p.remove();
        }
      });
    });

    // 标签页切换
    const shelfTabs = ['play', 'bag', 'shop', 'inventory', 'collection'];
    shelfTabs.forEach(tabName => {
      const tabBtn = document.getElementById(`sp-shelf-tab-${tabName}`);
      if (tabBtn) {
        tabBtn.addEventListener('click', () => {
          shelfTabs.forEach(t => {
            const b = document.getElementById(`sp-shelf-tab-${t}`);
            if (b) b.classList.toggle('active', t === tabName);
            const c = document.getElementById(`sp-shelf-tab-content-${t}`);
            if (c) c.style.display = t === tabName ? '' : 'none';
          });
          if (tabName === 'bag') shelfRenderBag();
          if (tabName === 'shop') shelfRenderShop();
          if (tabName === 'inventory') shelfRenderInventory();
          if (tabName === 'collection') shelfRenderCollection();
        });
      }
    });

    // 面板拖拽
    shelfBindPanelDrag();
  }

  // ===== 面板拖拽 =====
  function shelfBindPanelDrag() {
    const header = document.getElementById('sp-shelf-header');
    const panel = document.getElementById('sp-shelf-panel');
    if (!header || !panel) return;

    let dragging = false, offX = 0, offY = 0;

    const down = (e) => {
      if (e.target.closest('#sp-shelf-close') || e.target.closest('#sp-shelf-minimize')) return;
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

  // ===== 开局确认弹窗 =====
  function shelfConfirmNewGame() {
    showConfirmDialog({
      title: '🛒 开始整理货架？',
      desc: '难度随机分配，开局消耗一定体力。<br/>把货架上所有商品三消清空吧！',
      confirmText: '✨ 开始',
      cancelText: '算了',
      onConfirm: () => {
        gameRecoverStamina();
        const ok = shelfGenerateLevel();
        if (!ok) return;
        shelfRender();
        shelfShowNotice(`开局！难度: ${shelfState.difficulty.name} | -${shelfState.energyCost}⚡ | ${shelfState.totalGroups}组待消除`);
        if (isGameOpen) gameRenderStatus();
      },
      onCancel: () => {
        // 不开局，留在游戏面板
      }

    });
  }

  // ===== 开关货架整理面板 =====
  function toggleShelfGame() {
    isShelfOpen = !isShelfOpen;
    let panel = document.getElementById('sp-shelf-panel');

    if (isShelfOpen) {
      if (panel) panel.remove();
      shelfRenderPanel();
      panel = document.getElementById('sp-shelf-panel');
      panel.classList.add('visible');

      const w = Math.min(420, window.innerWidth - 20);
      panel.style.width = w + 'px';
      requestAnimationFrame(() => {
        const h = panel.offsetHeight;
        const maxTop = window.innerHeight - h - 20;
        const centerTop = Math.floor((window.innerHeight - h) / 2);
        panel.style.left = Math.floor((window.innerWidth - w) / 2) + 'px';
        panel.style.top = Math.max(10, Math.min(centerTop, maxTop)) + 'px';
      });

      // 如果没有活跃游戏，只渲染面板，不自动弹窗
      shelfRender();

    } else {
      if (panel) panel.remove();
      shelfState.selected = null;
      _shelfDragState.from = null;
    }
  }


})();

