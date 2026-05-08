import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- UTILS ---
const genId = (prefix) => `${prefix}_${Math.random().toString(36).substr(2, 9)}`;

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  en: {
    appTitle: "Pro PLC Simulator",
    homeDesc: "Web-Based PLC Ladder Logic and Process Control Training Simulator",
    inputs: "Inputs",
    outputs: "Outputs",
    memory: "Memory",
    system: "System",
    tabIo: "1. I/O Configuration",
    tabLadder: "2. Ladder Logic Editor",
    tabProcess: "🏭 3. 2D Process Plant",
    runSystem: "RUN SYSTEM",
    stopSystem: "STOP SYSTEM",
    resetSim: "↺ Reset Simulation",
    ioTagDb: "I/O Tag Database",
    ioDesc: "Define physical inputs and outputs. Click any Tag Name to rename it.",
    type: "Type",
    address: "Address",
    tagName: "Tag Name",
    addTag: "Add Tag",
    physicalPanel: "Physical Panel",
    physicalDesc: "Toggle inputs and monitor output states.",
    ladderProg: "Ladder Logic Editor",
    editMode: "Edit Mode",
    running: "Running",
    addRung: "+ Add Rung",
    noRungs: "No rungs defined. Click '+ Add Rung' to begin.",
    selectTarget: "Target...",
    preset: "Preset:",
    parallelDown: "+ Parallel ↓",
    outputDown: "+ Output ↓",
    processSim: "2D Process Simulation",
    processDesc: "Write the ladder logic required to control this plant!",
    bottles: "Bottles",
    conveyor: "Conveyor",
    valve: "Valve",
    motorUp: "Motor Up",
    motorDn: "Motor Dn",
    fillPump: "Fill Pump",
    drainPump: "Drain Pump",
    mixer: "Mixer",
    heater: "Heater",
    floor2: "Floor 2",
    floor1: "Floor 1",
    ground: "Ground",
    call: "Call",
    on: "ON",
    off: "OFF",
    photoEyeHelp: "Photo Eye (I:0/4) - Toggle on Left Panel",
    prox: "Prox",
    level: "Level",
    high: "High",
    low: "Low",
    loadTemplate: "Load Template",
    export: "💾 Save Logic",
    copyCode: "📋 Copy Submission Code",
    import: "📂 Load Logic",
    importSuccess: "Project loaded successfully!",
    importError: "Invalid PLC submission file.",
    plcSystemMode: "PLC System Mode",
    brand_generic: "Generic Learning Mode",
    brand_siemens: "Siemens Training Board Mode",
    brand_mitsubishi: "Mitsubishi Quick-Connection Mode",
    addressingRef: "Addressing Reference",
    refGeneric: "Generic: I:0/0, O:0/0, M:0/0",
    refSiemens: "Siemens: I0.0, Q0.0, M0.0",
    refMitsubishi: "Mitsubishi: X0, Y0, M0",
    vendorNeutralNote: "The simulator keeps a vendor-neutral internal logic engine. The selected PLC mode changes the addressing format shown to students so that the exercises align with different PLC training hardware.",
    compatGeneric: "Generic Ladder Logic Exercise",
    compatSiemens: "Compatible with Siemens Training Board",
    compatMitsubishi: "Compatible with Mitsubishi Quick-Connection Practice",
    sfTitle: "🏭 Mini Smart Factory",
    sfDesc: "An advanced integrated production line combining conveyor control, filling, capping, inspection, sorting, packaging, counters, timers, and fault handling.",
    guidedMode: "Guided Mode",
    challengeMode: "Challenge Mode",
    hwMapMode: "Hardware Mapping Mode",
    safetyStart: "Safety and Start-Up",
    conveyorTrans: "Conveyor Transport",
    mixTank: "Mixing Tank",
    fillStation: "Filling Station",
    capStation: "Capping Station",
    qualInspect: "Quality Inspection",
    sortStation: "Sorting Station",
    packArea: "Packaging Area",
    goodCount: "Good Count",
    rejectCount: "Reject Count",
    batchTarget: "Batch Target",
    faultStatus: "Fault Status",
    activeStation: "Active Station",
    eStop: "Emergency Stop",
    rejectFull: "Reject Bin Full",
    tankLow: "Tank Low Level",
    sysReady: "System Ready",
    batchComplete: "Batch Complete",
    howToRunTitle: "How to Run This Simulation",
    step1: "Step 1: Select PLC System Mode.",
    step2: "Step 2: Open Ladder Logic Editor.",
    step3: "Step 3: Build the required ladder logic.",
    step4: "Step 4: Click RUN SYSTEM.",
    step5: "Step 5: Use the Physical Panel to press Start, Stop, Reset, Emergency Stop, and Quality OK.",
    step6: "Step 6: Observe the Smart Factory process.",
    step7: "Step 7: Use the Logic Debug Checklist to troubleshoot.",
    progTaskTitle: "Programming Task",
    runtimeActTitle: "Runtime Action",
    whyNotRunning: "Why Not Running?",
    procNotMoving: "Process is not moving because:",
    sysStoppedFault: "System stopped due to fault:",
    reqNowLabel: "Required Now",
    notActLabel: "Not Active",
    faultLabel: "Fault",
    okLabel: "OK",
    pass: "Pass",
    reject: "Reject",
    waiting: "Waiting",
    stopped: "Stopped",
    legend: "Legend",
    inputSens: "Input Sensor / Button",
    outputAct: "Output Actuator",
    intMemory: "Internal Memory",
    faultReason: "Fault Reason"
  },
  zh: {
    appTitle: "Pro PLC 模拟器",
    homeDesc: "基于Web的PLC梯形图逻辑和过程控制培训模拟器",
    inputs: "输入",
    outputs: "输出",
    memory: "内存",
    system: "系统",
    tabIo: "1. I/O 配置",
    tabLadder: "2. 梯形图编辑器",
    tabProcess: "🏭 3. 2D 过程工厂",
    runSystem: "运行系统",
    stopSystem: "停止系统",
    resetSim: "↺ 重置模拟",
    ioTagDb: "I/O 标签数据库",
    ioDesc: "在编程之前定义您的物理输入和输出。单击任何标签名称以重命名它。",
    type: "类型",
    address: "地址",
    tagName: "标签名称",
    addTag: "添加标签",
    physicalPanel: "物理面板",
    physicalDesc: "切换输入状态并监控输出状态。",
    ladderProg: "梯形图编辑器",
    editMode: "编辑模式",
    running: "运行中",
    addRung: "+ 添加逻辑行",
    noRungs: "未定义梯形图。单击“+ 添加逻辑行”开始。",
    selectTarget: "目标...",
    preset: "预设值:",
    parallelDown: "+ 并联分支 ↓",
    outputDown: "+ 并联输出 ↓",
    processSim: "2D 过程模拟",
    processDesc: "编写控制此工厂所需的梯形图逻辑！",
    bottles: "瓶子数量",
    conveyor: "传送带",
    valve: "灌装阀",
    motorUp: "向上电机",
    motorDn: "向下电机",
    fillPump: "进水泵",
    drainPump: "排水泵",
    mixer: "搅拌机",
    heater: "加热器",
    floor2: "2楼",
    floor1: "1楼",
    ground: "底层",
    call: "呼叫",
    on: "开",
    off: "关",
    photoEyeHelp: "光电传感器 (I:0/4) - 在左侧面板切换",
    prox: "接近",
    level: "液位",
    high: "高",
    low: "低",
    loadTemplate: "加载模板",
    export: "💾 保存逻辑",
    copyCode: "📋 复制提交代码",
    import: "📂 加载逻辑",
    importSuccess: "项目加载成功！",
    importError: "无效的PLC提交文件。",
    plcSystemMode: "PLC系统模式",
    brand_generic: "通用学习模式",
    brand_siemens: "西门子实训板模式",
    brand_mitsubishi: "三菱快接线模式",
    addressingRef: "寻址参考",
    refGeneric: "通用: I:0/0, O:0/0, M:0/0",
    refSiemens: "西门子: I0.0, Q0.0, M0.0",
    refMitsubishi: "三菱: X0, Y0, M0",
    vendorNeutralNote: "该模拟器保留了与供应商无关的内部逻辑引擎。选择的PLC模式仅改变向学生显示的寻址格式，以使练习与不同的PLC培训硬件对齐。",
    compatGeneric: "通用梯形图逻辑练习",
    compatSiemens: "兼容西门子实训板",
    compatMitsubishi: "兼容三菱快接线练习",
    sfTitle: "🏭 迷你智能工厂",
    sfDesc: "一个高级综合生产线，结合输送带控制、灌装、封盖、检测、分拣、包装、计数器、定时器和故障处理。",
    guidedMode: "引导模式",
    challengeMode: "挑战模式",
    hwMapMode: "硬件映射模式",
    safetyStart: "安全与启动",
    conveyorTrans: "输送带运输",
    mixTank: "混合罐",
    fillStation: "灌装站",
    capStation: "封盖站",
    qualInspect: "质量检测",
    sortStation: "分拣站",
    packArea: "包装区",
    goodCount: "合格数量",
    rejectCount: "次品数量",
    batchTarget: "批次目标",
    faultStatus: "故障状态",
    activeStation: "当前工站",
    eStop: "紧急停止",
    rejectFull: "废品箱满",
    tankLow: "水箱低液位",
    sysReady: "系统就绪",
    batchComplete: "批次完成",
    howToRunTitle: "如何运行此模拟",
    step1: "步骤1：选择PLC系统模式。",
    step2: "步骤2：打开梯形图编辑器。",
    step3: "步骤3：构建所需的梯形图逻辑。",
    step4: "步骤4：点击运行系统 (RUN SYSTEM)。",
    step5: "步骤5：使用物理面板按下启动、停止、复位、急停和质量合格按钮。",
    step6: "步骤6：观察智能工厂过程。",
    step7: "步骤7：使用逻辑调试清单进行故障排除。",
    progTaskTitle: "编程任务",
    runtimeActTitle: "运行操作",
    whyNotRunning: "为什么没有运行？",
    procNotMoving: "过程未运行，因为：",
    sysStoppedFault: "系统因故障停止：",
    reqNowLabel: "当前需要",
    notActLabel: "未激活",
    faultLabel: "故障",
    okLabel: "正常",
    pass: "合格",
    reject: "剔除",
    waiting: "等待",
    stopped: "已停止",
    legend: "图例",
    inputSens: "输入传感器/按钮",
    outputAct: "输出执行器",
    intMemory: "内部内存",
    faultReason: "故障原因"
  }
};

// --- ADDRESS FORMATTER HELPER ---
const formatAddress = (address, brand) => {
  if (!address) return address;
  const match = address.match(/^([IOM]):(\d+)\/(\d+)$/);
  if (!match) return address; 
  const type = match[1], word = match[2], bit = match[3];
  if (brand === 'siemens') {
    if (type === 'I') return `I${word}.${bit}`;
    if (type === 'O') return `Q${word}.${bit}`;
    if (type === 'M') return `M${word}.${bit}`;
  } else if (brand === 'mitsubishi') {
    const combinedBit = word === '0' ? bit : `${word}${bit}`;
    if (type === 'I') return `X${combinedBit}`;
    if (type === 'O') return `Y${combinedBit}`;
    if (type === 'M') return `M${combinedBit}`;
  }
  return address;
};

// --- PLANT TEMPLATES (STUDENT MODE ONLY - BLANK LOGIC) ---
const BLANK_RUNG = [{ id: 'r1', nodes: [], outputs: [{ id: 'o1', type: 'coil', address: '', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] }];

const PLANT_TEMPLATES = {
  sandbox: {
    name_en: "🛠️ Sandbox (Beginner)", name_zh: "🛠️ 沙盒 (初学者)",
    desc_en: "A blank canvas to learn basic logic gates. Wire the switches to the colored LEDs!", desc_zh: "一个空白画布，用于学习基本逻辑门。将开关连接到彩色LED上！",
    ioMap: [
      { id: 'io1', type: 'input', address: 'I:0/0', tag_en: 'Switch_A', tag_zh: '开关_A', mode: 'toggle' },
      { id: 'io2', type: 'input', address: 'I:0/1', tag_en: 'Switch_B', tag_zh: '开关_B', mode: 'toggle' },
      { id: 'io3', type: 'input', address: 'I:0/2', tag_en: 'Push_Button', tag_zh: '按钮', mode: 'momentary' },
      { id: 'out1', type: 'output', address: 'O:0/0', tag_en: 'Green_LED', tag_zh: '绿灯' },
      { id: 'out2', type: 'output', address: 'O:0/1', tag_en: 'Yellow_LED', tag_zh: '黄灯' },
      { id: 'out3', type: 'output', address: 'O:0/2', tag_en: 'Red_LED', tag_zh: '红灯' }
    ], rungs: BLANK_RUNG
  },
  bottle: {
    name_en: "🍾 Bottle Filling Line", name_zh: "🍾 灌装生产线",
    desc_en: "Control a conveyor belt and a fill valve using proximity and level sensors.", desc_zh: "使用接近和液位传感器控制传送带和灌装阀。",
    ioMap: [
      { id: 'io1', type: 'input', address: 'I:0/0', tag_en: 'Start_Button', tag_zh: '启动按钮', mode: 'momentary' },
      { id: 'io2', type: 'input', address: 'I:0/1', tag_en: 'Stop_Button', tag_zh: '停止按钮', mode: 'momentary' },
      { id: 'io3', type: 'input', address: 'I:0/2', tag_en: 'Bottle_Present_Sensor', tag_zh: '瓶子到位传感器', mode: 'auto' },
      { id: 'io4', type: 'input', address: 'I:0/3', tag_en: 'Bottle_Full_Sensor', tag_zh: '瓶子满载传感器', mode: 'auto' },
      { id: 'out1', type: 'output', address: 'O:0/0', tag_en: 'Conveyor_Motor', tag_zh: '传送带电机' },
      { id: 'out2', type: 'output', address: 'O:0/1', tag_en: 'Fill_Valve', tag_zh: '灌装阀' }
    ], rungs: BLANK_RUNG
  },
  garage: {
    name_en: "🚪 Garage Door", name_zh: "🚪 车库门控制",
    desc_en: "Safely open and close a door using limit switches and interlocks.", desc_zh: "使用限位开关和联锁装置安全地打开和关闭车库门。",
    ioMap: [
      { id: 'io1', type: 'input', address: 'I:0/0', tag_en: 'Open_Button', tag_zh: '开门按钮', mode: 'momentary' },
      { id: 'io2', type: 'input', address: 'I:0/1', tag_en: 'Close_Button', tag_zh: '关门按钮', mode: 'momentary' },
      { id: 'io3', type: 'input', address: 'I:0/2', tag_en: 'Upper_Limit', tag_zh: '上限位', mode: 'auto' },
      { id: 'io4', type: 'input', address: 'I:0/3', tag_en: 'Lower_Limit', tag_zh: '下限位', mode: 'auto' },
      { id: 'io5', type: 'input', address: 'I:0/4', tag_en: 'Photo_Eye_Blocked', tag_zh: '光电被遮挡', mode: 'toggle' },
      { id: 'out1', type: 'output', address: 'O:0/0', tag_en: 'Motor_Up', tag_zh: '电机_上' },
      { id: 'out2', type: 'output', address: 'O:0/1', tag_en: 'Motor_Down', tag_zh: '电机_下' }
    ], rungs: BLANK_RUNG
  },
  tank: {
    name_en: "🧪 Batch Mixing Tank", name_zh: "🧪 批量混合罐",
    desc_en: "Fill a tank, mix and heat the contents, then drain it using level sensors.", desc_zh: "填充水箱，混合并加热内容物，然后使用液位传感器将其排空。",
    ioMap: [
      { id: 'io1', type: 'input', address: 'I:0/0', tag_en: 'Start_Fill', tag_zh: '开始注水', mode: 'momentary' },
      { id: 'io2', type: 'input', address: 'I:0/1', tag_en: 'Start_Drain', tag_zh: '开始排水', mode: 'momentary' },
      { id: 'io3', type: 'input', address: 'I:0/2', tag_en: 'Low_Sensor', tag_zh: '低液位传感器', mode: 'auto' },
      { id: 'io4', type: 'input', address: 'I:0/3', tag_en: 'High_Sensor', tag_zh: '高液位传感器', mode: 'auto' },
      { id: 'out1', type: 'output', address: 'O:0/0', tag_en: 'Fill_Pump', tag_zh: '进水泵' },
      { id: 'out2', type: 'output', address: 'O:0/1', tag_en: 'Drain_Pump', tag_zh: '排水泵' },
      { id: 'out3', type: 'output', address: 'O:0/2', tag_en: 'Mixer', tag_zh: '搅拌机' },
      { id: 'out4', type: 'output', address: 'O:0/3', tag_en: 'Heater', tag_zh: '加热器' }
    ], rungs: BLANK_RUNG
  },
  traffic: {
    name_en: "🚦 Traffic Intersection", name_zh: "🚦 交通路口",
    desc_en: "Use cascaded timers to sequence N/S and E/W traffic lights perfectly.", desc_zh: "使用级联定时器完美控制南北和东西交通信号灯的顺序。",
    ioMap: [
      { id: 'io1', type: 'input', address: 'I:0/0', tag_en: 'Enable_System', tag_zh: '启用系统', mode: 'toggle' },
      { id: 'out1', type: 'output', address: 'O:0/0', tag_en: 'NS_Green', tag_zh: '南北_绿灯' },
      { id: 'out2', type: 'output', address: 'O:0/1', tag_en: 'NS_Yellow', tag_zh: '南北_黄灯' },
      { id: 'out3', type: 'output', address: 'O:0/2', tag_en: 'NS_Red', tag_zh: '南北_红灯' },
      { id: 'out4', type: 'output', address: 'O:0/3', tag_en: 'EW_Green', tag_zh: '东西_绿灯' },
      { id: 'out5', type: 'output', address: 'O:0/4', tag_en: 'EW_Yellow', tag_zh: '东西_黄灯' },
      { id: 'out6', type: 'output', address: 'O:0/5', tag_en: 'EW_Red', tag_zh: '东西_红灯' },
      { id: 'mem1', type: 'memory', address: 'M:0/0', tag_en: 'Timer_NS_G', tag_zh: '定时器_南北绿' },
      { id: 'mem2', type: 'memory', address: 'M:0/1', tag_en: 'Timer_NS_Y', tag_zh: '定时器_南北黄' },
      { id: 'mem3', type: 'memory', address: 'M:0/2', tag_en: 'Timer_EW_G', tag_zh: '定时器_东西绿' },
      { id: 'mem4', type: 'memory', address: 'M:0/3', tag_en: 'Timer_EW_Y', tag_zh: '定时器_东西黄' }
    ], rungs: BLANK_RUNG
  },
  elevator: {
    name_en: "🛗 3-Floor Elevator", name_zh: "🛗 3层电梯",
    desc_en: "Build logic to latch floor calls and control the UP/DOWN motors.", desc_zh: "构建逻辑来锁存楼层呼叫，并控制升降电机。",
    ioMap: [
      { id: 'io1', type: 'input', address: 'I:0/0', tag_en: 'Call_Ground', tag_zh: '呼叫_底层', mode: 'momentary' },
      { id: 'io2', type: 'input', address: 'I:0/1', tag_en: 'Call_Floor_1', tag_zh: '呼叫_1楼', mode: 'momentary' },
      { id: 'io3', type: 'input', address: 'I:0/2', tag_en: 'Call_Floor_2', tag_zh: '呼叫_2楼', mode: 'momentary' },
      { id: 'io4', type: 'input', address: 'I:0/3', tag_en: 'Sensor_Ground', tag_zh: '传感器_底层', mode: 'auto' },
      { id: 'io5', type: 'input', address: 'I:0/4', tag_en: 'Sensor_Floor_1', tag_zh: '传感器_1楼', mode: 'auto' },
      { id: 'io6', type: 'input', address: 'I:0/5', tag_en: 'Sensor_Floor_2', tag_zh: '传感器_2楼', mode: 'auto' },
      { id: 'out1', type: 'output', address: 'O:0/0', tag_en: 'Motor_Up', tag_zh: '电机_上' },
      { id: 'out2', type: 'output', address: 'O:0/1', tag_en: 'Motor_Down', tag_zh: '电机_下' },
      { id: 'mem1', type: 'memory', address: 'M:0/0', tag_en: 'Req_G', tag_zh: '请求_底层' },
      { id: 'mem2', type: 'memory', address: 'M:0/1', tag_en: 'Req_1', tag_zh: '请求_1楼' },
      { id: 'mem3', type: 'memory', address: 'M:0/2', tag_en: 'Req_2', tag_zh: '请求_2楼' },
      { id: 'mem4', type: 'memory', address: 'M:0/3', tag_en: 'Move_Up', tag_zh: '上升_锁定' },
      { id: 'mem5', type: 'memory', address: 'M:0/4', tag_en: 'Move_Down', tag_zh: '下降_锁定' }
    ], rungs: BLANK_RUNG
  },
  smartFactory: {
    name_en: "🏭 Mini Smart Factory", name_zh: "🏭 迷你智能工厂",
    desc_en: "An advanced integrated production line combining conveyor control, filling, capping, inspection, sorting, packaging, counters, timers, and fault handling.",
    desc_zh: "一个高级综合生产线，结合输送带控制、灌装、封盖、检测、分拣、包装、计数器、定时器和故障处理。",
    ioMap: [
      { id: 'sf_i1', type: 'input', address: 'I:0/0', tag_en: 'Start_Button', tag_zh: '启动按钮', mode: 'momentary', purpose: 'Start system' },
      { id: 'sf_i2', type: 'input', address: 'I:0/1', tag_en: 'Stop_Button', tag_zh: '停止按钮', mode: 'momentary', purpose: 'Stop system' },
      { id: 'sf_i3', type: 'input', address: 'I:0/2', tag_en: 'Emergency_Stop', tag_zh: '紧急停止', mode: 'toggle', purpose: 'Emergency fault' },
      { id: 'sf_i4', type: 'input', address: 'I:0/3', tag_en: 'Reset_Button', tag_zh: '复位按钮', mode: 'momentary', purpose: 'Reset faults' },
      { id: 'sf_i5', type: 'input', address: 'I:0/4', tag_en: 'Bottle_Entry_Sensor', tag_zh: '入料传感器', mode: 'auto', purpose: 'Detect entry' },
      { id: 'sf_i6', type: 'input', address: 'I:0/5', tag_en: 'Fill_Position_Sensor', tag_zh: '灌装位传感器', mode: 'auto', purpose: 'Detect fill pos' },
      { id: 'sf_i7', type: 'input', address: 'I:0/6', tag_en: 'Bottle_Full_Sensor', tag_zh: '瓶满传感器', mode: 'auto', purpose: 'Detect full' },
      { id: 'sf_i8', type: 'input', address: 'I:0/7', tag_en: 'Cap_Position_Sensor', tag_zh: '封盖位传感器', mode: 'auto', purpose: 'Detect cap pos' },
      { id: 'sf_i9', type: 'input', address: 'I:1/0', tag_en: 'Cap_Done_Sensor', tag_zh: '封盖完成传感器', mode: 'auto', purpose: 'Detect cap done' },
      { id: 'sf_i10', type: 'input', address: 'I:1/1', tag_en: 'Quality_OK_Sensor', tag_zh: '质量合格传感器', mode: 'toggle', purpose: 'Quality status' },
      { id: 'sf_i11', type: 'input', address: 'I:1/2', tag_en: 'Reject_Bin_Full', tag_zh: '废料箱满', mode: 'toggle', purpose: 'Bin full fault' },
      { id: 'sf_i12', type: 'input', address: 'I:1/3', tag_en: 'Tank_Low_Level', tag_zh: '储罐低液位', mode: 'auto', purpose: 'Tank low fault' },
      { id: 'sf_o1', type: 'output', address: 'O:0/0', tag_en: 'Conveyor_Motor', tag_zh: '输送带电机', purpose: 'Move bottles' },
      { id: 'sf_o2', type: 'output', address: 'O:0/1', tag_en: 'Fill_Pump', tag_zh: '灌装泵', purpose: 'Pump liquid' },
      { id: 'sf_o3', type: 'output', address: 'O:0/2', tag_en: 'Fill_Valve', tag_zh: '灌装阀', purpose: 'Open valve' },
      { id: 'sf_o4', type: 'output', address: 'O:0/3', tag_en: 'Mixer_Motor', tag_zh: '搅拌电机', purpose: 'Mix tank' },
      { id: 'sf_o5', type: 'output', address: 'O:0/4', tag_en: 'Heater', tag_zh: '加热器', purpose: 'Heat tank' },
      { id: 'sf_o6', type: 'output', address: 'O:0/5', tag_en: 'Clamp_Solenoid', tag_zh: '夹紧电磁阀', purpose: 'Clamp bottle' },
      { id: 'sf_o7', type: 'output', address: 'O:0/6', tag_en: 'Capper_Motor', tag_zh: '封盖电机', purpose: 'Cap bottle' },
      { id: 'sf_o8', type: 'output', address: 'O:0/7', tag_en: 'Diverter_Solenoid', tag_zh: '分流电磁阀', purpose: 'Reject bottle' },
      { id: 'sf_o9', type: 'output', address: 'O:1/0', tag_en: 'Packaging_Conveyor', tag_zh: '包装线输送带', purpose: 'Move to pkg' },
      { id: 'sf_o10', type: 'output', address: 'O:1/1', tag_en: 'Run_Lamp', tag_zh: '运行指示灯', purpose: 'System running' },
      { id: 'sf_o11', type: 'output', address: 'O:1/2', tag_en: 'Fault_Lamp', tag_zh: '故障指示灯', purpose: 'System fault' },
      { id: 'sf_o12', type: 'output', address: 'O:1/3', tag_en: 'Buzzer', tag_zh: '蜂鸣器', purpose: 'Alarm buzzer' },
      { id: 'sf_m1', type: 'memory', address: 'M:0/0', tag_en: 'System_Run_Latch', tag_zh: '系统运行锁存', purpose: 'Maintain run state' },
      { id: 'sf_m2', type: 'memory', address: 'M:0/1', tag_en: 'Filling_Step', tag_zh: '灌装步骤', purpose: 'Step memory' },
      { id: 'sf_m3', type: 'memory', address: 'M:0/2', tag_en: 'Capping_Step', tag_zh: '封盖步骤', purpose: 'Step memory' },
      { id: 'sf_m4', type: 'memory', address: 'M:0/3', tag_en: 'Inspection_Step', tag_zh: '检测步骤', purpose: 'Step memory' },
      { id: 'sf_m5', type: 'memory', address: 'M:0/4', tag_en: 'Reject_Step', tag_zh: '剔除步骤', purpose: 'Step memory' },
      { id: 'sf_m6', type: 'memory', address: 'M:0/5', tag_en: 'Batch_Complete', tag_zh: '批次完成', purpose: 'Batch target met' },
      { id: 'sf_m7', type: 'memory', address: 'M:0/6', tag_en: 'Fault_Latch', tag_zh: '故障锁存', purpose: 'Maintain fault' }
    ], rungs: BLANK_RUNG
  }
};

const App = () => {
  const [lang, setLang] = useState('en');
  const t = useCallback((key) => TRANSLATIONS[lang][key] || key, [lang]);

  const [plcBrand, setPlcBrand] = useState('generic');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [sfSubTab, setSfSubTab] = useState('simulation');
  
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissionType, setSubmissionType] = useState('save');
  const [studentInfo, setStudentInfo] = useState({ name: '', id: '', section: '' });

  const [ioMap, setIoMap] = useState([]);
  const [newIO, setNewIO] = useState({ type: 'input', address: '', tag: '', mode: 'toggle' });
  const [physicalInputs, setPhysicalInputs] = useState({});
  const [rungs, setRungs] = useState([]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const latchedTags = useRef({});
  const previousScanTags = useRef({});
  const rungsRef = useRef(rungs); 
  const fileInputRef = useRef(null);

  const [plantState, setPlantState] = useState({
    bottle: { pos: -200, fill: 0, count: 0 },
    garage: { pos: 0 },
    tank: { level: 0 },
    elevator: { pos: 0 },
    smartFactory: { bottlePos: -50, bottleFill: 0, tankLevel: 100, capProgress: 0, currentBottleQuality: true, goodCount: 0, rejectCount: 0, batchTarget: 10, rejected: false, packaged: false, activeStation: 'Start' }
  });

  useEffect(() => { rungsRef.current = rungs; }, [rungs]);

  const loadTemplate = (plantId) => {
    setIsRunning(false);
    setSelectedPlant(plantId);
    setSfSubTab('simulation');
    
    const localizedIoMap = PLANT_TEMPLATES[plantId].ioMap.map(io => ({
      id: io.id, type: io.type, address: io.address, mode: io.mode || 'toggle', purpose: io.purpose || '', tag: lang === 'zh' ? (io.tag_zh || io.tag_en) : io.tag_en
    }));
    setIoMap(localizedIoMap);
    setRungs([{ id: genId('r'), nodes: [], outputs: [{ id: genId('o'), type: 'coil', address: '', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] }]);
    setPhysicalInputs({});
    setPlantState({ bottle: { pos: -200, fill: 0, count: 0 }, garage: { pos: 0 }, tank: { level: 0 }, elevator: { pos: 0 }, smartFactory: { bottlePos: -50, bottleFill: 0, tankLevel: 100, capProgress: 0, currentBottleQuality: true, goodCount: 0, rejectCount: 0, batchTarget: 10, rejected: false, packaged: false, activeStation: 'Start' } });
    setActiveTab('simulator');
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setPlantState({ bottle: { pos: -200, fill: 0, count: 0 }, garage: { pos: 0 }, tank: { level: 0 }, elevator: { pos: 0 }, smartFactory: { bottlePos: -50, bottleFill: 0, tankLevel: 100, capProgress: 0, currentBottleQuality: true, goodCount: 0, rejectCount: 0, batchTarget: 10, rejected: false, packaged: false, activeStation: 'Start' } });
    setPhysicalInputs({});
    setRungs(prevRungs => prevRungs.map(r => ({ ...r, outputs: r.outputs.map(o => ({ ...o, state: false, accum: o.type === 'ctd' ? o.preset : 0, doneBit: false, lastState: false })) })));
    latchedTags.current = {};
  };

  const handleSubmissionRequest = (type) => { setSubmissionType(type); setShowSubmissionModal(true); };

  const executeSubmission = (e) => {
    e.preventDefault();
    if (!studentInfo.name || !studentInfo.id || !studentInfo.section) return alert("Please fill all fields before submitting.");
    const payload = {
      studentName: studentInfo.name, studentId: studentInfo.id, classSection: studentInfo.section,
      plantKey: selectedPlant, plantTitle: PLANT_TEMPLATES[selectedPlant][`name_${lang}`] || PLANT_TEMPLATES[selectedPlant].name_en,
      plcBrand, plcBrandLabel: t(`brand_${plcBrand}`), addressProfile: plcBrand === 'siemens' ? t('refSiemens') : plcBrand === 'mitsubishi' ? t('refMitsubishi') : t('refGeneric'),
      displayedIoMap: ioMap.map(io => ({...io, displayAddress: formatAddress(io.address, plcBrand)})),
      ioMap, rungs, timestamp: new Date().toISOString(), appVersion: "1.4.0"
    };

    const jsonStr = JSON.stringify(payload, null, 2);
    if (submissionType === 'save') {
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = `PLC_Submission_${studentInfo.id}_${selectedPlant}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } else {
      const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
      const textOutput = `PLC_SUBMISSION_BEGIN\nStudent Name: ${studentInfo.name}\nStudent ID: ${studentInfo.id}\nClass: ${studentInfo.section}\nPlant: ${payload.plantTitle}\nPLC Brand: ${payload.plcBrandLabel}\nTimestamp: ${payload.timestamp}\nData:\n${b64}\nPLC_SUBMISSION_END`;
      const copyFn = () => {
        const ta = document.createElement("textarea"); ta.value = textOutput; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); alert("Submission code copied. Paste it into WeChat and send it to your lecturer."); } catch (err) { alert("Failed to copy."); }
        document.body.removeChild(ta);
      };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(textOutput).then(() => alert("Submission code copied.")).catch(copyFn);
      else copyFn();
    }
    setShowSubmissionModal(false);
  };

  const importLogic = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if ((data.plant || data.plantKey) && data.rungs && data.ioMap) {
          setIsRunning(false); setSelectedPlant(data.plantKey || data.plant); setIoMap(data.ioMap); setRungs(data.rungs); setPlcBrand(data.plcBrand || 'generic'); alert(t('importSuccess'));
        } else alert(t('importError'));
      } catch (err) { alert(t('importError')); }
    };
    reader.readAsText(file); e.target.value = null;
  };

  const isOutputOn = useCallback((address) => {
    let p = false;
    for (const r of rungsRef.current) for (const o of r.outputs) { if (o.address === address) { if (['coil', 'reset', 'difu', 'difd', 'set'].includes(o.type)) p = p || o.state; else p = p || o.doneBit; } }
    return p || (latchedTags.current[address] === true);
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setTick(t => t + 1), 100); 
    return () => clearInterval(id);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || !selectedPlant || selectedPlant === 'sandbox') return;

    setPlantState(prev => {
      let next = { ...prev };
      
      if (selectedPlant === 'bottle') {
        let { pos, fill, count } = next.bottle;
        if (isOutputOn('O:0/0')) pos += 15; 
        const isPresent = pos >= 440 && pos <= 460;
        if (isOutputOn('O:0/1') && isPresent) fill += 5; 
        if (fill > 100) fill = 100;
        const isFull = (fill >= 100) && isPresent;
        if (pos > 1200) { pos = -200; fill = 0; count += 1; }
        next.bottle = { pos, fill, count };
        setPhysicalInputs(inputs => {
          if (inputs['I:0/2'] !== isPresent || inputs['I:0/3'] !== isFull) return { ...inputs, 'I:0/2': isPresent, 'I:0/3': isFull }; return inputs;
        });
      }

      if (selectedPlant === 'garage') {
        let { pos } = next.garage;
        const motorUp = isOutputOn('O:0/0'), motorDn = isOutputOn('O:0/1'), photoEye = physicalInputs['I:0/4'] || false;
        if (motorUp && !motorDn && pos < 100) pos += 2;
        if (motorDn && !motorUp && pos > 0 && !photoEye) pos -= 2;
        if (pos > 100) pos = 100; if (pos < 0) pos = 0;
        next.garage = { pos };
        setPhysicalInputs(inputs => {
          const upLim = pos >= 100, dnLim = pos <= 0;
          if (inputs['I:0/2'] !== upLim || inputs['I:0/3'] !== dnLim) return { ...inputs, 'I:0/2': upLim, 'I:0/3': dnLim }; return inputs;
        });
      }

      if (selectedPlant === 'tank') {
        let { level } = next.tank;
        if (isOutputOn('O:0/0')) level += 1.5; if (isOutputOn('O:0/1')) level -= 1.5; 
        if (level > 100) level = 100; if (level < 0) level = 0;
        next.tank = { level };
        setPhysicalInputs(inputs => {
          const lowSens = level <= 5, highSens = level >= 95;
          if (inputs['I:0/2'] !== lowSens || inputs['I:0/3'] !== highSens) return { ...inputs, 'I:0/2': lowSens, 'I:0/3': highSens }; return inputs;
        });
      }

      if (selectedPlant === 'elevator') {
        let { pos } = next.elevator;
        if (isOutputOn('O:0/0')) pos += 1.0; if (isOutputOn('O:0/1')) pos -= 1.0; 
        pos = Math.round(pos * 10) / 10;
        if (pos > 100) pos = 100; if (pos < 0) pos = 0;
        next.elevator = { pos };
        setPhysicalInputs(inputs => {
          const sensG = pos === 0, sens1 = pos === 50, sens2 = pos === 100;
          if (inputs['I:0/3'] !== sensG || inputs['I:0/4'] !== sens1 || inputs['I:0/5'] !== sens2) {
            return { ...inputs, 'I:0/3': sensG, 'I:0/4': sens1, 'I:0/5': sens2 };
          } return inputs;
        });
      }

      if (selectedPlant === 'smartFactory') {
        let { bottlePos, bottleFill, tankLevel, capProgress, currentBottleQuality, goodCount, rejectCount, batchTarget, rejected, packaged, activeStation } = next.smartFactory;

        if (physicalInputs['I:0/3'] && tankLevel <= 10) { tankLevel = 100; }

        const conveyorOn = isOutputOn('O:0/0'), pumpOn = isOutputOn('O:0/1'), valveOn = isOutputOn('O:0/2'), clampOn = isOutputOn('O:0/5'), capperOn = isOutputOn('O:0/6'), diverterOn = isOutputOn('O:0/7'), pkgConveyorOn = isOutputOn('O:1/0');
        const isEStop = physicalInputs['I:0/2'] === true, isRejectFull = physicalInputs['I:1/2'] === true, isTankLow = tankLevel <= 10;
        const faultActive = isEStop || isRejectFull || isTankLow;

        if (conveyorOn && !rejected && !packaged && !faultActive) { bottlePos += 15; } 
        else if (rejected) { bottlePos = -50; bottleFill = 0; capProgress = 0; rejected = false; currentBottleQuality = physicalInputs['I:1/1'] !== false; } 
        else if (packaged) { bottlePos = -50; bottleFill = 0; capProgress = 0; packaged = false; currentBottleQuality = physicalInputs['I:1/1'] !== false; }

        const atFill = bottlePos >= 230 && bottlePos <= 250, atCap = bottlePos >= 440 && bottlePos <= 460, atSort = bottlePos >= 780 && bottlePos <= 800;

        if (atSort && !currentBottleQuality && diverterOn && conveyorOn && !faultActive) { rejected = true; rejectCount++; }
        if (bottlePos > 1050 && !packaged && pkgConveyorOn && !faultActive) { packaged = true; goodCount++; }
        if (pumpOn && valveOn && atFill && !faultActive) { bottleFill += 10; if (bottleFill > 100) bottleFill = 100; }
        if (clampOn && capperOn && atCap && !faultActive) { capProgress += 10; if (capProgress > 100) capProgress = 100; }
        if (pumpOn && !faultActive) { tankLevel -= 0.5; if (tankLevel <= 0) tankLevel = 0; }

        const entrySens = bottlePos >= -20 && bottlePos <= 50, fullSens = atFill && bottleFill >= 100, capDoneSens = atCap && capProgress >= 100;

        if (atFill) activeStation = 'Fill';
        else if (atCap) activeStation = 'Cap';
        else if (atSort || (bottlePos > 600 && bottlePos < 780)) activeStation = 'Sort';
        else if (bottlePos > 850) activeStation = 'Package';
        else if (bottlePos >= 600 && bottlePos <= 650) activeStation = 'Inspect'; // Adding Inspect Zone logic
        else if (entrySens) activeStation = 'Entry';
        else if (!isOutputOn('M:0/0')) activeStation = 'Start';
        else activeStation = 'Transport';

        // Override Inspect station specifically for sequencing
        if(bottlePos >= 600 && bottlePos <= 650) activeStation = 'Inspect';

        setPhysicalInputs(inputs => {
           if(inputs['I:0/4'] !== entrySens || inputs['I:0/5'] !== atFill || inputs['I:0/6'] !== fullSens || inputs['I:0/7'] !== atCap || inputs['I:1/0'] !== capDoneSens || inputs['I:1/3'] !== isTankLow){
               return { ...inputs, 'I:0/4': entrySens, 'I:0/5': atFill, 'I:0/6': fullSens, 'I:0/7': atCap, 'I:1/0': capDoneSens, 'I:1/3': isTankLow };
           } return inputs;
        });

        next.smartFactory = { bottlePos, bottleFill, tankLevel, capProgress, currentBottleQuality, goodCount, rejectCount, batchTarget, rejected, packaged, activeStation };
      }
      return next;
    });
  }, [tick, isRunning, selectedPlant, physicalInputs, isOutputOn]);

  // --- LADDER LOGIC ENGINE ---
  useEffect(() => {
    if (!isRunning) { latchedTags.current = {}; previousScanTags.current = {}; return; }

    setRungs(prevRungs => {
      const nextRungs = prevRungs.map(r => ({ ...r, nodes: r.nodes.map(n => ({ ...n, branches: n.branches.map(b => b.map(c => ({ ...c }))) })), outputs: r.outputs.map(o => ({ ...o })) }));
      let changed = false; const resets = new Set();
      const getContactPower = (contact) => {
        const ioDef = ioMap.find(io => io.address === contact.address); let p = false;
        if (ioDef?.type === 'input') p = physicalInputs[contact.address] || false;
        else if (ioDef?.type === 'output' || ioDef?.type === 'memory') {
          for (const r of nextRungs) for (const o of r.outputs) { if (o.address === contact.address) { if (['coil','reset','difu','difd','set'].includes(o.type)) p = p || o.state; else p = p || o.doneBit; } }
          p = p || (latchedTags.current[contact.address] === true);
        } else if (ioDef?.type === 'system' || contact.address.startsWith('S:')) {
           if (contact.address === 'S:1Hz') p = Math.floor(Date.now() / 500) % 2 === 0; else if (contact.address === 'S:2Hz') p = Math.floor(Date.now() / 250) % 2 === 0;
        }
        const prevPower = previousScanTags.current[contact.address] || false;
        if (contact.type === 'NO') return p; if (contact.type === 'NC') return !p; if (contact.type === 'P') return p && !prevPower; if (contact.type === 'N') return !p && prevPower; return false;
      };

      for (let i = 0; i < nextRungs.length; i++) {
        const rung = nextRungs[i]; let isRungTrue = true;
        if (rung.nodes && rung.nodes.length > 0) {
          for (const node of rung.nodes) {
            let isNodeTrue = false;
            for (const branch of node.branches) {
              let isBranchTrue = true;
              for (const contact of branch) { if (!getContactPower(contact)) { isBranchTrue = false; break; } }
              if (isBranchTrue || branch.length === 0) { isNodeTrue = true; break; }
            }
            if (!isNodeTrue) { isRungTrue = false; break; }
          }
        } else { isRungTrue = false; }

        for (let j = 0; j < rung.outputs.length; j++) {
          let out = rung.outputs[j], newAccum = out.accum || 0, newDoneBit = out.doneBit || false, newState = out.state || false;
          if (out.type === 'timer') {
            if (isRungTrue) { newAccum = Math.round((newAccum + 0.1) * 10) / 10; if (newAccum >= out.preset) { newAccum = out.preset; newDoneBit = true; } } else { newAccum = 0; newDoneBit = false; } newState = isRungTrue;
          } else if (out.type === 'tof') {
            if (isRungTrue) { newAccum = 0; newDoneBit = true; newState = true; } else { newState = false; if (newDoneBit) { newAccum = Math.round((newAccum + 0.1) * 10) / 10; if (newAccum >= out.preset) { newAccum = out.preset; newDoneBit = false; } } }
          } else if (out.type === 'rto') {
            if (isRungTrue) { if (newAccum < out.preset) newAccum = Math.round((newAccum + 0.1) * 10) / 10; if (newAccum >= out.preset) newDoneBit = true; } newState = isRungTrue;
          } else if (out.type === 'counter') {
            if (isRungTrue && !out.lastState) newAccum += 1; if (newAccum >= out.preset) newDoneBit = true; newState = isRungTrue;
          } else if (out.type === 'ctd') {
            if (isRungTrue && !out.lastState) newAccum -= 1; if (newAccum <= 0) newDoneBit = true; newState = isRungTrue;
          } else if (out.type === 'difu') { newState = isRungTrue && !out.lastState; } else if (out.type === 'difd') { newState = !isRungTrue && out.lastState;
          } else if (out.type === 'set') { newState = isRungTrue; if (isRungTrue && out.address) latchedTags.current[out.address] = true;
          } else if (out.type === 'reset') { newState = isRungTrue; if (isRungTrue && out.address) { latchedTags.current[out.address] = false; resets.add(out.address); }
          } else { newState = isRungTrue; newDoneBit = isRungTrue; }

          if (out.state !== newState || out.accum !== newAccum || out.doneBit !== newDoneBit || out.lastState !== isRungTrue) { out.state = newState; out.accum = newAccum; out.doneBit = newDoneBit; out.lastState = isRungTrue; changed = true; }
        }
      }

      if (resets.size > 0) {
        for (let i = 0; i < nextRungs.length; i++) {
          for (let j = 0; j < nextRungs[i].outputs.length; j++) {
            let out = nextRungs[i].outputs[j];
            if (resets.has(out.address) && ['timer','tof','rto','counter','ctd'].includes(out.type)) {
              const resetValue = out.type === 'ctd' ? out.preset : 0; if (out.accum !== resetValue || out.doneBit !== false) { out.accum = resetValue; out.doneBit = false; changed = true; }
            }
          }
        }
      }

      const newPrevTags = {}; const allAddressesToTrack = new Set(ioMap.map(io => io.address)); allAddressesToTrack.add('S:1Hz'); allAddressesToTrack.add('S:2Hz');
      Array.from(allAddressesToTrack).forEach(address => {
        let p = false; const io = ioMap.find(i => i.address === address);
        if (io?.type === 'input') p = physicalInputs[address] || false;
        else if (io?.type === 'output' || io?.type === 'memory' || (!io && !address.startsWith('S:'))) {
          for (const r of nextRungs) for (const o of r.outputs) { if (o.address === address) { if (['coil', 'reset', 'difu', 'difd', 'set'].includes(o.type)) p = p || o.state; else p = p || o.doneBit; } }
          p = p || (latchedTags.current[address] === true);
        } else if (io?.type === 'system' || address.startsWith('S:')) {
          if (address === 'S:1Hz') p = Math.floor(Date.now() / 500) % 2 === 0; else if (address === 'S:2Hz') p = Math.floor(Date.now() / 250) % 2 === 0;
        }
        newPrevTags[address] = p;
      });
      previousScanTags.current = newPrevTags;

      return changed ? nextRungs : prevRungs;
    });
  }, [physicalInputs, ioMap, isRunning, tick]);

  // --- HANDLERS ---
  const handleAddIO = (e) => {
    e.preventDefault(); if (!newIO.address || !newIO.tag) return; if (ioMap.some(io => io.address === newIO.address)) return alert("Address already exists!");
    setIoMap([...ioMap, { id: genId('io'), ...newIO }]); if (newIO.type === 'input') setPhysicalInputs(prev => ({ ...prev, [newIO.address]: false }));
    setNewIO({ type: 'input', address: '', tag: '', mode: 'toggle' });
  };
  const removeIO = (idToRemove, address) => { setIoMap(ioMap.filter(io => io.id !== idToRemove)); const newPhysical = { ...physicalInputs }; delete newPhysical[address]; setPhysicalInputs(newPhysical); };
  const renameIO = (idToRename, newTag) => setIoMap(ioMap.map(io => io.id === idToRename ? { ...io, tag: newTag } : io));
  const updateIOMode = (idToUpdate, newMode) => setIoMap(ioMap.map(io => io.id === idToUpdate ? { ...io, mode: newMode } : io));
  const togglePhysicalInput = (address) => setPhysicalInputs(prev => ({ ...prev, [address]: !prev[address] }));
  const triggerMomentaryInput = (address) => { setPhysicalInputs(prev => ({ ...prev, [address]: true })); setTimeout(() => { setPhysicalInputs(prev => ({ ...prev, [address]: false })); }, 300); };

  const addRung = () => setRungs([...rungs, { id: genId('r'), nodes: [], outputs: [{ id: genId('o'), type: 'coil', address: '', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] }]);
  const removeRung = (rungId) => setRungs(rungs.filter(r => r.id !== rungId));
  const addNode = (rungId) => setRungs(rungs.map(rung => rung.id === rungId ? { ...rung, nodes: [...rung.nodes, { id: genId('n'), branches: [[{ id: genId('c'), address: '', type: 'NO' }]] }] } : rung));
  const addParallelBranch = (rungId, nodeId) => setRungs(rungs.map(rung => rung.id === rungId ? { ...rung, nodes: rung.nodes.map(n => n.id === nodeId ? { ...n, branches: [...n.branches, [{ id: genId('c'), address: '', type: 'NO' }]] } : n) } : rung));
  const addContactToBranch = (rungId, nodeId, branchIdx) => setRungs(rungs.map(rung => rung.id === rungId ? { ...rung, nodes: rung.nodes.map(n => n.id === nodeId ? { ...n, branches: n.branches.map((b, i) => i === branchIdx ? [...b, { id: genId('c'), address: '', type: 'NO' }] : b) } : n) } : rung));
  const updateContact = (rungId, nodeId, branchIdx, contactId, field, value) => setRungs(rungs.map(rung => rung.id === rungId ? { ...rung, nodes: rung.nodes.map(n => n.id === nodeId ? { ...n, branches: n.branches.map((b, i) => i === branchIdx ? b.map(c => c.id === contactId ? { ...c, [field]: value } : c) : b) } : n) } : rung));
  const removeContact = (rungId, nodeId, branchIdx, contactId) => setRungs(rungs.map(rung => { if (rung.id !== rungId) return rung; let updatedNodes = rung.nodes.map(n => { if (n.id !== nodeId) return n; const newBranches = n.branches.map((b, i) => i === branchIdx ? b.filter(c => c.id !== contactId) : b); return { ...n, branches: newBranches.filter(b => b.length > 0) }; }); return { ...rung, nodes: updatedNodes.filter(n => n.branches.length > 0) }; }));
  const removeBranch = (rungId, nodeId, branchIdx) => setRungs(rungs.map(rung => { if (rung.id !== rungId) return rung; const newNodes = rung.nodes.map(n => n.id === nodeId ? { ...n, branches: n.branches.filter((_, i) => i !== branchIdx) } : n).filter(n => n.branches.length > 0); return { ...rung, nodes: newNodes }; }));
  const addOutput = (rungId) => setRungs(rungs.map(rung => rung.id === rungId ? { ...rung, outputs: [...rung.outputs, { id: genId('o'), type: 'coil', address: '', state: false, preset: 5, accum: 0, doneBit: false, lastState: false }] } : rung));
  const removeOutput = (rungId, outputId) => setRungs(rungs.map(rung => { if (rung.id !== rungId || rung.outputs.length <= 1) return rung; return { ...rung, outputs: rung.outputs.filter(o => o.id !== outputId) }; }));
  const updateOutputField = (rungId, outputId, field, value) => setRungs(rungs.map(rung => rung.id === rungId ? { ...rung, outputs: rung.outputs.map(o => { if (o.id !== outputId) return o; const updated = { ...o, [field]: value }; if (field === 'type' && value === 'ctd') updated.accum = updated.preset; else if (field === 'type' && value !== 'ctd') updated.accum = 0; if (field === 'preset' && updated.type === 'ctd' && !isRunning) updated.accum = value; return updated; }) } : rung));
  const resetCounter = (rungId, outputId) => setRungs(rungs.map(rung => rung.id === rungId ? { ...rung, outputs: rung.outputs.map(o => o.id === outputId ? { ...o, accum: o.type === 'ctd' ? o.preset : 0, doneBit: false } : o) } : rung));

  const inputsList = ioMap.filter(io => io.type === 'input');
  const outputsList = ioMap.filter(io => io.type === 'output');
  const memoryList = ioMap.filter(io => io.type === 'memory');
  const systemList = ioMap.filter(io => io.type === 'system');

  // --- SMART FACTORY DYNAMIC HELPERS ---
  const getSfProgrammingTask = () => {
    const s = plantState.smartFactory;
    if (!isOutputOn('M:0/0')) return "Create a start/stop latch using Start Button, Stop Button, Emergency Stop, and System Run Latch.";
    if (!isOutputOn('O:0/0') && s.activeStation !== 'Fill' && s.activeStation !== 'Cap') return "Turn ON the Conveyor Motor to move the bottle when the system is running.";
    if (s.activeStation === 'Fill' && s.bottleFill < 100) return "Bottle is at filling station. Stop conveyor and activate Fill Pump + Fill Valve.";
    if (s.activeStation === 'Fill' && s.bottleFill >= 100) return "Bottle is full. Start conveyor to move it to the capping station.";
    if (s.activeStation === 'Cap' && s.capProgress < 100) return "Activate Clamp Solenoid and Capper Motor until cap is attached.";
    if (s.activeStation === 'Cap' && s.capProgress >= 100) return "Capping complete. Move bottle to inspection.";
    if (s.activeStation === 'Sort') return "Activate Diverter Solenoid if Quality OK is false to reject the bottle.";
    if (s.activeStation === 'Package') return "Activate Packaging Conveyor to count good bottles.";
    if (s.goodCount >= s.batchTarget) return "Stop the line and activate Buzzer since batch target is reached.";
    return "Build the required ladder logic to automate the full process.";
  };

  const getSfRuntimeAction = () => {
    if (!isRunning) return "Click RUN SYSTEM to start the simulation engine.";
    const s = plantState.smartFactory;
    const isEStop = physicalInputs['I:0/2'] === true;
    const isRejectFull = physicalInputs['I:1/2'] === true;
    const isTankLow = s.tankLevel <= 10;
    if (isEStop || isRejectFull || isTankLow) return "Clear the fault using the Physical Panel and press Reset.";
    if (s.goodCount >= s.batchTarget) return "Process Complete. Click Reset Simulation to restart.";
    if (!isOutputOn('M:0/0')) return "Press Start in the Physical Panel.";
    if (s.activeStation === 'Inspect') return "Toggle Quality OK Sensor in Physical Panel to test Pass or Reject paths.";
    return "Observe the Smart Factory process.";
  };

  const getSfWhyNotRunning = () => {
    const reasons = [];
    const s = plantState.smartFactory;
    const isEStop = physicalInputs['I:0/2'] === true;
    const isRejectFull = physicalInputs['I:1/2'] === true;
    const isTankLow = s.tankLevel <= 10;

    if (isEStop) reasons.push("Emergency Stop active");
    if (isRejectFull) reasons.push("Reject bin full");
    if (isTankLow) reasons.push("Tank low level");

    if (reasons.length > 0) return { type: 'fault', list: reasons };

    if (!isOutputOn('M:0/0')) reasons.push("System Run Latch is OFF.");
    if (!physicalInputs['I:0/0'] && !isOutputOn('M:0/0')) reasons.push("Start Button has not been pressed.");
    if (isOutputOn('M:0/0') && !isOutputOn('O:0/0') && s.activeStation !== 'Fill' && s.activeStation !== 'Cap') reasons.push("Conveyor Motor is OFF.");

    return { type: 'logic', list: reasons };
  };

  const sfDebugChecklist = [
    { label: "Start Button (I:0/0)", active: physicalInputs['I:0/0'], req: !isOutputOn('M:0/0'), desc: "Press to initiate system." },
    { label: "System Run Latch (M:0/0)", active: isOutputOn('M:0/0'), req: true, desc: "Latch M0 must turn ON after Start is pressed." },
    { label: "Emergency Stop (I:0/2)", active: physicalInputs['I:0/2'], req: false, fault: true, desc: "Must be inactive to run." },
    { label: "Conveyor Motor (O:0/0)", active: isOutputOn('O:0/0'), req: isOutputOn('M:0/0') && plantState.smartFactory.activeStation !== 'Fill' && plantState.smartFactory.activeStation !== 'Cap', desc: "Y0 must turn ON to move the bottle." },
    { label: "Fill Position Sensor (I:0/5)", active: physicalInputs['I:0/5'], req: false, desc: "Detects bottle at fill station." },
    { label: "Fill Pump & Valve (O:0/1, O:0/2)", active: isOutputOn('O:0/1') && isOutputOn('O:0/2'), req: plantState.smartFactory.activeStation === 'Fill' && plantState.smartFactory.bottleFill < 100, desc: "Must activate to fill bottle." },
    { label: "Bottle Full Sensor (I:0/6)", active: physicalInputs['I:0/6'], req: false, desc: "Detects when filling is complete." },
    { label: "Clamp & Capper (O:0/5, O:0/6)", active: isOutputOn('O:0/5') && isOutputOn('O:0/6'), req: plantState.smartFactory.activeStation === 'Cap' && plantState.smartFactory.capProgress < 100, desc: "Must activate to seal bottle." },
    { label: "Quality OK Sensor (I:1/1)", active: physicalInputs['I:1/1'], req: false, desc: "Determines Pass or Reject." },
    { label: "Diverter Solenoid (O:0/7)", active: isOutputOn('O:0/7'), req: plantState.smartFactory.activeStation === 'Sort' && !plantState.smartFactory.currentBottleQuality, desc: "Must activate to reject bad bottle." },
    { label: "Packaging Conveyor (O:1/0)", active: isOutputOn('O:1/0'), req: plantState.smartFactory.activeStation === 'Package', desc: "Must activate to accept good bottle." },
    { label: "Batch Complete (M:0/5)", active: plantState.smartFactory.goodCount >= plantState.smartFactory.batchTarget, req: false, desc: "Indicates target reached." },
  ];

  // --- PERFECT SVG CONTACT RENDERER ---
  const renderContactIcon = (type) => {
    return (
      <svg viewBox="0 0 40 24" className="w-full h-full stroke-slate-800 stroke-[3px] fill-none overflow-visible group-hover/contact:stroke-blue-500">
        <line x1="0" y1="12" x2="14" y2="12" />
        <line x1="14" y1="4" x2="14" y2="20" />
        <line x1="26" y1="4" x2="26" y2="20" />
        <line x1="26" y1="12" x2="40" y2="12" />
        {type === 'NC' && <line x1="10" y1="22" x2="30" y2="2" />}
        {type === 'P' && <text x="20" y="17" className="text-[12px] font-bold fill-slate-800 stroke-none font-sans" textAnchor="middle">P</text>}
        {type === 'N' && <text x="20" y="17" className="text-[12px] font-bold fill-slate-800 stroke-none font-sans" textAnchor="middle">N</text>}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative">
      
      {/* LANGUAGE TOGGLE (HOME ONLY) */}
      {activeTab === 'home' && (
        <div className="absolute top-4 right-8 z-50 flex gap-2">
           <button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} className="bg-white border border-slate-200 shadow-sm text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold transition-colors">
              🌐 {lang === 'en' ? '中文' : 'English'}
           </button>
        </div>
      )}

      {/* SUBMISSION MODAL */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">
            <h3 className="text-2xl font-bold mb-2 text-slate-800">Student Submission</h3>
            <p className="text-sm text-slate-500 mb-6">Please enter your details to generate your submission file/code.</p>
            <form onSubmit={executeSubmission}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Student Name</label>
                  <input type="text" required value={studentInfo.name} onChange={e => setStudentInfo({...studentInfo, name: e.target.value})} className="w-full p-3 border border-slate-300 rounded focus:border-blue-500 outline-none" placeholder="e.g., Ali Bin Ahmad" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Student ID</label>
                  <input type="text" required value={studentInfo.id} onChange={e => setStudentInfo({...studentInfo, id: e.target.value})} className="w-full p-3 border border-slate-300 rounded focus:border-blue-500 outline-none" placeholder="e.g., CB23001" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Class / Section</label>
                  <input type="text" required value={studentInfo.section} onChange={e => setStudentInfo({...studentInfo, section: e.target.value})} className="w-full p-3 border border-slate-300 rounded focus:border-blue-500 outline-none" placeholder="e.g., Section 1" />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowSubmissionModal(false)} className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800 transition-colors">{t('cancel')}</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-colors shadow-sm">{submissionType === 'save' ? 'Download JSON' : 'Copy Code'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <input type="file" ref={fileInputRef} onChange={importLogic} accept=".json" style={{ display: 'none' }} />

      {/* HEADER NAV (INTERNAL PAGES) */}
      {activeTab !== 'home' && (
        <header className="bg-white border-b border-slate-200 px-8 pt-6 pb-0 shadow-sm flex flex-col shrink-0 relative z-40">
          
          {/* TOP ROW: Title & Branding/Language */}
          <div className="flex justify-between items-start w-full mb-4">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-4">
              <button onClick={() => setActiveTab('home')} className="text-slate-400 hover:text-blue-600 transition-colors">←</button>
              {lang === 'en' ? PLANT_TEMPLATES[selectedPlant]?.name_en : PLANT_TEMPLATES[selectedPlant]?.name_zh}
            </h1>

            <div className="flex items-center gap-6">
               {/* COMPACT BRANDING */}
               <div className="hidden lg:flex items-center gap-3">
                  <img 
                    src="/umpsa-logo.png" 
                    alt="UMPSA Logo" 
                    className="w-10 h-10 object-contain" 
                    onError={(e) => { e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23cbd5e1"><path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" /></svg>'; }} 
                  />
                  <div className="text-right flex flex-col justify-center">
                     <div className="text-sm font-bold text-slate-800 leading-tight">Universiti Malaysia Pahang Al-Sultan Abdullah</div>
                     <div className="text-[10px] font-medium text-slate-500 leading-tight">Faculty of Electrical and Electronic Engineering Technology (FTKEE)</div>
                  </div>
               </div>
               
               {/* LANGUAGE TOGGLE */}
               <button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} className="bg-white border border-slate-200 shadow-sm text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold transition-colors">
                  🌐 {lang === 'en' ? '中文' : 'English'}
               </button>
            </div>
          </div>

          {/* BOTTOM ROW: Tabs & Action Buttons */}
          <div className="flex flex-col xl:flex-row justify-between items-end w-full">
            <div className="flex gap-2 overflow-x-auto pb-px w-full xl:w-auto">
              <button onClick={() => setActiveTab('io_setup')} className={`px-5 py-3 font-medium text-sm rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'io_setup' ? 'bg-slate-100 border-t border-l border-r border-slate-200 text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>{t('tabIo')}</button>
              <button onClick={() => setActiveTab('simulator')} className={`px-5 py-3 font-medium text-sm rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'simulator' ? 'bg-slate-100 border-t border-l border-r border-slate-200 text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>{t('tabLadder')}</button>
              <button onClick={() => setActiveTab('process')} className={`px-5 py-3 font-bold text-sm rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'process' ? 'bg-slate-800 text-white shadow-inner' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>{t('tabProcess')}</button>
            </div>

            <div className="flex flex-col sm:flex-row items-end sm:items-center mb-3 mt-4 xl:mt-0 gap-4">
               {/* PLC System Selector */}
               <select 
                 value={plcBrand} 
                 onChange={(e) => setPlcBrand(e.target.value)}
                 className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 bg-white outline-none cursor-pointer shadow-sm hover:border-blue-400"
               >
                 <option value="generic">{t('brand_generic')}</option>
                 <option value="siemens">{t('brand_siemens')}</option>
                 <option value="mitsubishi">{t('brand_mitsubishi')}</option>
               </select>

               {/* Action Buttons */}
               <div className="flex items-center gap-4 flex-wrap justify-end">
                  <button onClick={resetSimulation} className="px-4 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 shadow-sm border border-slate-300 whitespace-nowrap">
                    {t('resetSim')}
                  </button>
                  <button onClick={() => setIsRunning(!isRunning)} className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-3 shadow-sm whitespace-nowrap ${isRunning ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30' : 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-red-200 animate-pulse' : 'bg-green-200'}`}></div>
                    {isRunning ? t('stopSystem') : t('runSystem')}
                  </button>
               </div>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 overflow-y-auto flex flex-col relative">
        
        {/* --- TAB 0: HOME / PROJECT SELECTOR --- */}
        {activeTab === 'home' && (
          <div className="max-w-5xl mx-auto py-12 px-8 relative flex-1 w-full">
            
            {/* BRANDING HEADER */}
            <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left mb-10 pb-10 border-b border-slate-200 gap-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg shrink-0">
                 <img 
                   src="/umpsa-logo.png" 
                   alt="UMPSA Logo" 
                   className="w-full h-full object-contain p-2" 
                   onError={(e) => { e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23cbd5e1"><path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" /></svg>'; }} 
                 />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Universiti Malaysia Pahang Al-Sultan Abdullah</h2>
                <h3 className="text-sm sm:text-lg font-medium text-slate-500 mt-2">Faculty of Electrical and Electronic Engineering Technology (FTKEE)</h3>
              </div>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">{t('appTitle')}</h1>
              <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto">{t('homeDesc')}</p>
            </div>

            {/* PLC System Brand Mode Selection */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 max-w-3xl mx-auto shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 border-b border-slate-200 pb-4">
                 <div>
                   <h3 className="text-lg font-bold text-slate-800">{t('plcSystemMode')}</h3>
                   <p className="text-xs text-slate-500 mt-1 max-w-md leading-relaxed">{t('vendorNeutralNote')}</p>
                 </div>
                 <select 
                   value={plcBrand} 
                   onChange={(e) => setPlcBrand(e.target.value)}
                   className="px-4 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 bg-white outline-none cursor-pointer shadow-sm hover:border-blue-400 focus:ring-2 focus:ring-blue-100"
                 >
                   <option value="generic">{t('brand_generic')}</option>
                   <option value="siemens">{t('brand_siemens')}</option>
                   <option value="mitsubishi">{t('brand_mitsubishi')}</option>
                 </select>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-700 text-sm mb-3">{t('addressingRef')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-slate-600">
                  <div className={`p-2 rounded border ${plcBrand === 'generic' ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold shadow-inner' : 'bg-slate-50 border-transparent'}`}>
                    {t('refGeneric')}
                  </div>
                  <div className={`p-2 rounded border ${plcBrand === 'siemens' ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold shadow-inner' : 'bg-slate-50 border-transparent'}`}>
                    {t('refSiemens')}
                  </div>
                  <div className={`p-2 rounded border ${plcBrand === 'mitsubishi' ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold shadow-inner' : 'bg-slate-50 border-transparent'}`}>
                    {t('refMitsubishi')}
                  </div>
                </div>
              </div>
            </div>

            {/* Student Instruction Panel */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-12 max-w-3xl mx-auto text-left shadow-sm">
              <h3 className="text-lg font-bold text-blue-800 mb-3">PLC Simulator Student Guide</h3>
              <ol className="list-decimal list-inside text-slate-700 space-y-1.5 mb-5 text-sm font-medium">
                <li>Select the assigned process below.</li>
                <li>Build the ladder logic using the <strong>Ladder Logic Editor</strong>.</li>
                <li>Use the <strong>Physical Panel</strong> to test inputs.</li>
                <li>Click <strong>RUN SYSTEM</strong> to observe the process simulation.</li>
                <li>Click <strong>Save Logic</strong> or <strong>Copy Submission Code</strong>.</li>
                <li>Submit your JSON file or submission code through WeChat.</li>
              </ol>
              <div className="text-xs text-blue-700 bg-blue-100 p-3 rounded leading-relaxed">
                <strong>Note:</strong> For best performance, use a laptop or tablet. Phone users should use landscape mode. If the simulator does not work properly inside WeChat, open the link in Chrome, Edge, or Safari.
              </div>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(PLANT_TEMPLATES).map(([key, template]) => (
                <div key={key} onClick={() => loadTemplate(key)} className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden">
                  
                  {/* Badge */}
                  <div className={`absolute top-0 right-0 left-0 text-[10px] font-bold text-center py-1 uppercase tracking-widest ${plcBrand === 'siemens' ? 'bg-teal-100 text-teal-700' : plcBrand === 'mitsubishi' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
                    {plcBrand === 'siemens' ? t('compatSiemens') : plcBrand === 'mitsubishi' ? t('compatMitsubishi') : t('compatGeneric')}
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-2 mt-4 group-hover:text-blue-600 transition-colors">{lang === 'en' ? template.name_en : template.name_zh}</h3>
                  <p className="text-sm text-slate-500 flex-1 mb-4">{lang === 'en' ? template.desc_en : template.desc_zh}</p>
                  
                  {/* IO Preview Table */}
                  <div className="bg-slate-50 p-3 rounded border border-slate-200 overflow-y-auto max-h-32 text-xs">
                    <table className="w-full">
                       <tbody>
                         {template.ioMap.slice(0, 5).map(io => (
                           <tr key={io.id}>
                             <td className="text-slate-600 font-medium py-0.5 pr-2 truncate max-w-[120px]">{lang === 'en' ? io.tag_en : io.tag_zh}</td>
                             <td className="text-right font-mono text-blue-600 font-bold py-0.5">{formatAddress(io.address, plcBrand)}</td>
                           </tr>
                         ))}
                       </tbody>
                    </table>
                    {template.ioMap.length > 5 && <div className="text-center text-slate-400 mt-1 italic text-[10px]">+{template.ioMap.length - 5} more I/O</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 1: I/O CONFIGURATION --- */}
        {activeTab === 'io_setup' && (
          <div className="flex-1 max-w-4xl mx-auto w-full">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 my-8">
              <h2 className="text-2xl font-bold mb-2">{t('ioTagDb')}</h2>
              <p className="text-slate-500 mb-8">{t('ioDesc')}</p>
              <form onSubmit={handleAddIO} className="flex gap-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-200 mb-8 flex-wrap">
                <div className="flex-1 min-w-[120px]"><label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t('type')}</label><select value={newIO.type} onChange={e => setNewIO({...newIO, type: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none"><option value="input">{t('inputs')}</option><option value="output">{t('outputs')}</option><option value="memory">{t('memory')}</option></select></div>
                {newIO.type === 'input' && (
                  <div className="flex-1 min-w-[140px]"><label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Behavior</label><select value={newIO.mode || 'toggle'} onChange={e => setNewIO({...newIO, mode: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none"><option value="toggle">Toggle Switch</option><option value="momentary">Push Button</option><option value="auto">Auto Sensor</option></select></div>
                )}
                <div className="flex-1 min-w-[120px]"><label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t('address')}</label><input type="text" placeholder="e.g. I:0/0 or M:0/0" required value={newIO.address} onChange={e => setNewIO({...newIO, address: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none"/></div>
                <div className="flex-1 min-w-[120px]"><label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t('tagName')}</label><input type="text" placeholder="e.g. Start_Button" required value={newIO.tag} onChange={e => setNewIO({...newIO, tag: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none"/></div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors whitespace-nowrap mb-0.5">{t('addTag')}</button>
              </form>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-700 mb-3 border-b pb-2">{t('inputs')}</h3>
                  <div className="space-y-2">{inputsList.map(io => (
                    <div key={io.id} className="flex justify-between items-center bg-white border border-slate-200 p-2 rounded shadow-sm">
                      <div className="flex flex-col gap-1 w-full mr-2">
                        <div className="flex items-center">
                          <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded mr-2">{formatAddress(io.address, plcBrand)}</span>
                          <input type="text" value={io.tag} onChange={(e) => renameIO(io.id, e.target.value)} className="font-medium text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none w-full truncate" />
                        </div>
                        <select value={io.mode || 'toggle'} onChange={(e) => updateIOMode(io.id, e.target.value)} className="text-[10px] bg-slate-50 border border-slate-200 rounded p-1 text-slate-500 outline-none w-32 cursor-pointer">
                          <option value="toggle">Toggle Switch</option><option value="momentary">Push Button</option><option value="auto">Auto Sensor</option>
                        </select>
                      </div>
                      <button onClick={() => removeIO(io.id, io.address)} className="text-red-400 hover:text-red-700 font-bold px-2">&times;</button>
                    </div>
                  ))}</div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-700 mb-3 border-b pb-2">{t('outputs')}</h3>
                  <div className="space-y-2">{outputsList.map(io => (<div key={io.id} className="flex justify-between items-center bg-white border border-slate-200 p-2 rounded shadow-sm"><div><span className="font-mono text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded mr-2">{formatAddress(io.address, plcBrand)}</span><input type="text" value={io.tag} onChange={(e) => renameIO(io.id, e.target.value)} className="font-medium text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none w-24 truncate" /></div><button onClick={() => removeIO(io.id, io.address)} className="text-red-400 hover:text-red-700 font-bold px-2">&times;</button></div>))}</div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-700 mb-3 border-b pb-2">{t('memory')} / {t('system')}</h3>
                  <div className="space-y-2">
                    {memoryList.map(io => (<div key={io.id} className="flex justify-between items-center bg-white border border-slate-200 p-2 rounded shadow-sm"><div><span className="font-mono text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded mr-2">{formatAddress(io.address, plcBrand)}</span><input type="text" value={io.tag} onChange={(e) => renameIO(io.id, e.target.value)} className="font-medium text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none w-24 truncate" /></div><button onClick={() => removeIO(io.id, io.address)} className="text-red-400 hover:text-red-700 font-bold px-2">&times;</button></div>))}
                    {systemList.map(io => (<div key={io.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-2 rounded shadow-sm"><div><span className="font-mono text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded mr-2">{io.address}</span><span className="font-medium text-sm text-slate-500 truncate">{io.tag}</span></div></div>))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2 & 3 SHARED CONTENT AREA --- */}
        {(activeTab === 'simulator' || activeTab === 'process') && (
          <div className="flex-1 flex flex-col gap-6 w-full max-w-[90rem] mx-auto p-8">
            
            {/* Top: Compact Physical Simulator Panel */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 shrink-0">
              <div className="flex justify-between items-center mb-3 border-b pb-2">
                <h2 className="text-lg font-bold text-slate-800">{t('physicalPanel')}</h2>
                <span className="text-xs text-slate-500">{t('physicalDesc')}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Inputs Column */}
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t('inputs')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {inputsList.map(io => {
                      const isAuto = io.mode === 'auto';
                      const isMomentary = io.mode === 'momentary';
                      const modeLabel = isAuto ? 'AUTO SENSOR' : isMomentary ? 'PUSH BUTTON' : 'SWITCH';
                      
                      return (
                        <div key={io.id} className={`flex items-center justify-between p-2 rounded border ${isAuto ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="flex flex-col">
                            <span className="font-medium text-xs text-slate-700 truncate w-24" title={io.tag}>{io.tag}</span>
                            <span className="text-[8px] font-mono text-slate-400 mt-0.5">{formatAddress(io.address, plcBrand)} <span className="bg-slate-200 text-slate-500 px-1 rounded ml-1">{modeLabel}</span></span>
                          </div>
                          <button onClick={() => { if (isRunning && !isAuto) { isMomentary ? triggerMomentaryInput(io.address) : togglePhysicalInput(io.address) } }} disabled={!isRunning || isAuto} className={`w-9 h-5 rounded-full transition-all relative shadow-inner shrink-0 ${physicalInputs[io.address] ? 'bg-green-500' : 'bg-slate-300'} ${(!isRunning || isAuto) && 'opacity-60 cursor-not-allowed'}`}><div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform shadow ${physicalInputs[io.address] ? 'translate-x-4' : 'translate-x-0'}`} /></button>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {/* Outputs Column */}
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t('outputs')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {outputsList.map(io => {
                      const isOn = rungs.some(r => r.outputs.some(o => o.address === io.address && (((o.type === 'coil' || o.type === 'difu' || o.type === 'difd' || o.type === 'set') && o.state) || ((['timer','tof','rto','counter','ctd'].includes(o.type)) && o.doneBit)))) || latchedTags.current[io.address];
                      return (
                        <div key={io.id} className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200">
                          <div className="flex flex-col">
                            <span className="font-medium text-xs text-slate-700 truncate w-24" title={io.tag}>{io.tag}</span>
                            <span className="text-[9px] font-mono text-slate-400">{formatAddress(io.address, plcBrand)}</span>
                          </div>
                          <div className={`w-3.5 h-3.5 rounded-full shadow-inner shrink-0 ${isOn ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]' : 'bg-slate-300'}`} />
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Memory Column */}
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t('memory')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {memoryList.map(io => {
                      const isOn = rungs.some(r => r.outputs.some(o => o.address === io.address && (((o.type === 'coil' || o.type === 'difu' || o.type === 'difd' || o.type === 'set') && o.state) || ((['timer','tof','rto','counter','ctd'].includes(o.type)) && o.doneBit)))) || latchedTags.current[io.address];
                      return (
                        <div key={io.id} className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200">
                          <div className="flex flex-col">
                            <span className="font-medium text-xs text-slate-700 truncate w-24" title={io.tag}>{io.tag}</span>
                            <span className="text-[9px] font-mono text-slate-400">{formatAddress(io.address, plcBrand)}</span>
                          </div>
                          <div className={`w-3.5 h-3.5 rounded-full shadow-inner shrink-0 ${isOn ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'bg-slate-300'}`} />
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* --- TAB 2 CONTENT: LADDER EDITOR --- */}
            {activeTab === 'simulator' && (
              <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-x-auto min-h-[500px]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 border-b pb-4 gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{t('ladderProg')}</h2>
                    <p className="text-sm text-slate-500 mt-1">{isRunning ? <span className="text-green-600 font-semibold flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>{t('running')}</span> : t('editMode')}</p>
                  </div>
                  {!isRunning && (
                    <div className="flex gap-2 flex-wrap justify-end">
                      <button onClick={() => handleSubmissionRequest('save')} className="bg-slate-50 text-slate-600 hover:bg-slate-100 px-4 py-2 rounded text-sm font-bold transition-colors border border-slate-200 shadow-sm">{t('export')}</button>
                      <button onClick={() => handleSubmissionRequest('copy')} className="bg-slate-50 text-slate-600 hover:bg-slate-100 px-4 py-2 rounded text-sm font-bold transition-colors border border-slate-200 shadow-sm">{t('copyCode')}</button>
                      <button onClick={() => fileInputRef.current.click()} className="bg-slate-50 text-slate-600 hover:bg-slate-100 px-4 py-2 rounded text-sm font-bold transition-colors border border-slate-200 shadow-sm">{t('import')}</button>
                      <button onClick={addRung} className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded text-sm font-bold transition-colors border border-blue-200 shadow-sm">{t('addRung')}</button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-10 relative py-4">
                  <div className="absolute top-0 bottom-0 left-4 w-1.5 bg-red-500 z-0 rounded-full"></div>
                  <div className="absolute top-0 bottom-0 right-4 w-1.5 bg-blue-500 z-0 rounded-full"></div>

                  {rungs.length === 0 && <div className="text-center py-10 text-slate-400 italic">{t('noRungs')}</div>}

                  {rungs.map((rung) => {
                    let rungRunningPower = true;
                    return (
                      <div key={rung.id} className="relative z-10 flex items-center min-w-max px-4">
                        {!isRunning && <button onClick={() => removeRung(rung.id)} className="absolute -left-10 w-6 h-6 flex items-center justify-center rounded bg-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-colors border border-red-200 z-50 font-bold shadow-sm">&times;</button>}
                        <div className="w-8 h-1.5 bg-red-500 shrink-0"></div>

                        {/* --- SERIES NODES --- */}
                        {rung.nodes.map((node, nIdx) => {
                          let nodeOutputPower = false;
                          const evaluatedBranches = node.branches.map(branch => {
                            let branchAccumPower = rungRunningPower;
                            const evaluatedContacts = branch.map(contact => {
                              const ioDef = ioMap.find(io => io.address === contact.address);
                              let p = false;
                              if (ioDef?.type === 'input') p = physicalInputs[contact.address] || false;
                              else if (ioDef?.type === 'output' || ioDef?.type === 'memory') {
                                for (const r of rungs) for (const o of r.outputs) { if (o.address === contact.address) { if (['coil','reset','difu','difd','set'].includes(o.type)) p = p || o.state; else p = p || o.doneBit; } }
                                p = p || (latchedTags.current[contact.address] === true);
                              } else if (ioDef?.type === 'system') { if (contact.address === 'S:1Hz') p = Math.floor(Date.now() / 500) % 2 === 0; else if (contact.address === 'S:2Hz') p = Math.floor(Date.now() / 250) % 2 === 0; }
                              
                              const prevP = previousScanTags.current[contact.address] || false;
                              const contactPasses = (contact.type === 'NO' && p) || (contact.type === 'NC' && !p) || (contact.type === 'P' && p && !prevP) || (contact.type === 'N' && !p && prevP);
                              const currentWirePower = branchAccumPower; branchAccumPower = branchAccumPower && contactPasses;
                              return { ...contact, inputWirePower: currentWirePower, contactPasses };
                            });
                            if (branchAccumPower || branch.length === 0) nodeOutputPower = true;
                            return { contacts: evaluatedContacts, outputWirePower: branchAccumPower };
                          });
                          if (!nodeOutputPower) rungRunningPower = false;

                          return (
                            <React.Fragment key={node.id}>
                              <div className="relative flex flex-col justify-center gap-2 group/node shrink-0">
                                {node.branches.length > 1 && (
                                  <>
                                    <div className={`absolute left-0 top-8 bottom-8 w-1.5 transition-colors ${rungRunningPower || nodeOutputPower ? 'bg-green-500' : 'bg-slate-200'} z-0`}></div>
                                    <div className={`absolute right-0 top-8 bottom-8 w-1.5 transition-colors ${nodeOutputPower ? 'bg-green-500' : 'bg-slate-200'} z-0`}></div>
                                  </>
                                )}
                                {evaluatedBranches.map((branchData, bIdx) => (
                                  <div key={bIdx} className="flex flex-row items-center h-16 relative group/branch">
                                    <div className={`w-4 h-1.5 transition-colors ${node.branches.length > 1 ? (rungRunningPower || nodeOutputPower ? 'bg-green-500' : 'bg-slate-200') : (branchData.contacts[0]?.inputWirePower || rungRunningPower ? 'bg-green-500' : 'bg-slate-200')} shrink-0`}></div>
                                    {branchData.contacts.map((cData, cIdx) => (
                                      <React.Fragment key={cData.id}>
                                        <div className="flex flex-col items-center mx-2 relative group/contact">
                                          <div className={`absolute bottom-[100%] left-1/2 -translate-x-1/2 pb-2 z-20 ${isRunning ? 'hidden' : 'opacity-0 group-hover/contact:opacity-100'} transition-opacity pointer-events-none group-hover/contact:pointer-events-auto`}>
                                            <div className="bg-white border border-slate-200 shadow-lg rounded p-1 flex gap-1">
                                              <select value={cData.address} onChange={(e) => updateContact(rung.id, node.id, bIdx, cData.id, 'address', e.target.value)} className="text-xs p-1 border rounded w-24 outline-none">
                                                <option value="">{t('selectTarget')}</option>
                                                <optgroup label={t('inputs')}>{inputsList.map(io => <option key={io.id} value={io.address}>{formatAddress(io.address, plcBrand)} - {io.tag}</option>)}</optgroup>
                                                <optgroup label={t('outputs')}>{outputsList.map(io => <option key={io.id} value={io.address}>{formatAddress(io.address, plcBrand)} - {io.tag}</option>)}</optgroup>
                                                <optgroup label={t('memory')}>{memoryList.map(io => <option key={io.id} value={io.address}>{formatAddress(io.address, plcBrand)} - {io.tag}</option>)}</optgroup>
                                                <optgroup label={t('system')}>{systemList.map(io => <option key={io.id} value={io.address}>{formatAddress(io.address, plcBrand)} - {io.tag}</option>)}</optgroup>
                                              </select>
                                              <select value={cData.type} onChange={(e) => updateContact(rung.id, node.id, bIdx, cData.id, 'type', e.target.value)} className="text-xs p-1 border rounded outline-none"><option value="NO">NO</option><option value="NC">NC</option><option value="P">P (↑)</option><option value="N">N (↓)</option></select>
                                              <button onClick={() => removeContact(rung.id, node.id, bIdx, cData.id)} className="bg-red-50 text-red-500 hover:bg-red-100 px-2 rounded text-xs">X</button>
                                            </div>
                                          </div>
                                          <span className="text-[10px] font-bold text-blue-700 mb-1 truncate w-16 text-center" title={ioMap.find(io => io.address === cData.address)?.tag}>{ioMap.find(io => io.address === cData.address)?.tag || <span className="text-red-400 italic">...</span>}</span>
                                          <div className={`w-10 h-8 flex items-center justify-center transition-colors ${cData.inputWirePower && cData.contactPasses ? 'text-green-600' : 'text-slate-600'} shrink-0`}>
                                            {renderContactIcon(cData.type)}
                                          </div>
                                          <span className="text-[9px] font-mono text-slate-400 mt-1">{formatAddress(cData.address, plcBrand) || '?'}</span>
                                        </div>
                                        <div className={`w-6 h-1.5 transition-colors ${cData.inputWirePower && cData.contactPasses ? 'bg-green-500' : 'bg-slate-200'} shrink-0`}></div>
                                      </React.Fragment>
                                    ))}
                                    {branchData.contacts.length === 0 && <div className={`flex-1 min-w-[40px] h-1.5 transition-colors ${rungRunningPower || nodeOutputPower ? 'bg-green-500' : 'bg-slate-200'}`}></div>}
                                    {!isRunning && <button onClick={() => addContactToBranch(rung.id, node.id, bIdx)} className="w-6 h-6 rounded-full border-2 border-dashed border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center text-xs font-bold shadow-sm bg-white z-10 mx-1 shrink-0 opacity-0 group-hover/branch:opacity-100 transition-opacity">+</button>}
                                    <div className={`flex-1 h-1.5 transition-colors ${branchData.outputWirePower ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                                    <div className={`w-4 h-1.5 transition-colors ${branchData.outputWirePower ? 'bg-green-500' : 'bg-slate-200'} shrink-0`}></div>
                                    {!isRunning && node.branches.length > 1 && <button onClick={() => removeBranch(rung.id, node.id, bIdx)} className="absolute right-0 top-0 w-4 h-4 rounded-full bg-red-100 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center text-[10px] font-bold shadow-sm z-20">&times;</button>}
                                  </div>
                                ))}
                                {!isRunning && <button onClick={() => addParallelBranch(rung.id, node.id)} className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 hover:text-blue-600 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm opacity-0 group-hover/node:opacity-100 transition-opacity z-20 whitespace-nowrap">{t('parallelDown')}</button>}
                              </div>
                              <div className={`w-8 h-1.5 transition-colors ${nodeOutputPower ? 'bg-green-500' : 'bg-slate-200'} shrink-0`}></div>
                            </React.Fragment>
                          );
                        })}
                        {!isRunning && <button onClick={() => addNode(rung.id)} className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center text-lg font-bold shadow-sm bg-white shrink-0 mx-2">+</button>}
                        <div className={`flex-1 min-w-[20px] h-1.5 transition-colors ${rungRunningPower ? 'bg-green-500' : 'bg-slate-200'}`}></div>

                        {/* --- OUTPUTS --- */}
                        <div className="relative flex flex-col justify-center gap-2 shrink-0">
                          {rung.outputs.length > 1 && (
                            <>
                              <div className={`absolute left-0 top-8 bottom-8 w-1.5 transition-colors ${rungRunningPower ? 'bg-green-500' : 'bg-slate-200'} z-0`}></div>
                              <div className="absolute right-0 top-8 bottom-8 w-1.5 bg-blue-500 z-0"></div>
                            </>
                          )}
                          {rung.outputs.map((out, oIdx) => (
                            <div key={out.id} className="flex flex-row items-center h-16 relative">
                              <div className={`w-4 h-1.5 transition-colors ${rungRunningPower ? 'bg-green-500' : 'bg-slate-200'} shrink-0`}></div>
                              <div className="flex flex-col items-center px-4 relative group/coil z-10">
                                <div className={`absolute bottom-[100%] left-1/2 -translate-x-1/2 pb-2 z-20 ${isRunning ? 'hidden' : 'opacity-0 group-hover/coil:opacity-100'} transition-opacity pointer-events-none group-hover/coil:pointer-events-auto`}>
                                  <div className="bg-white border border-slate-200 shadow-lg rounded p-2 flex flex-col gap-2 w-48">
                                    <select value={out.type || 'coil'} onChange={(e) => updateOutputField(rung.id, out.id, 'type', e.target.value)} className="text-xs p-1 border rounded outline-none font-bold">
                                      <option value="coil">Coil ()</option><option value="set">Set (SET)</option><option value="reset">Reset (RES)</option><option value="difu">DIFU (↑)</option><option value="difd">DIFD (↓)</option><option value="timer">Timer (TON)</option><option value="tof">Timer (TOF)</option><option value="rto">Timer (RTO)</option><option value="counter">Counter (CTU)</option><option value="ctd">Counter (CTD)</option>
                                    </select>
                                    <select value={out.address} onChange={(e) => updateOutputField(rung.id, out.id, 'address', e.target.value)} className="text-xs p-1 border rounded outline-none">
                                      <option value="">{t('selectTarget')}</option>
                                      <optgroup label={t('outputs')}>{outputsList.map(io => <option key={io.id} value={io.address}>{formatAddress(io.address, plcBrand)} - {io.tag}</option>)}</optgroup>
                                      <optgroup label={t('memory')}>{memoryList.map(io => <option key={io.id} value={io.address}>{formatAddress(io.address, plcBrand)} - {io.tag}</option>)}</optgroup>
                                    </select>
                                    {(['timer','tof','rto','counter','ctd'].includes(out.type)) && (
                                      <div className="flex justify-between items-center"><label className="text-xs text-slate-500">{t('preset')}</label><input type="number" min="1" step="any" value={out.preset} onChange={(e) => updateOutputField(rung.id, out.id, 'preset', Number(e.target.value))} className="w-16 p-1 text-xs border rounded"/></div>
                                    )}
                                  </div>
                                </div>
                                <span className="text-[10px] font-bold text-blue-700 mb-1 truncate w-20 text-center" title={[...outputsList, ...memoryList].find(io => io.address === out.address)?.tag}>{[...outputsList, ...memoryList].find(io => io.address === out.address)?.tag || <span className="text-red-400 italic">...</span>}</span>
                                {['timer','tof','rto','counter','ctd'].includes(out.type) ? (
                                  <div className={`w-20 h-12 border-2 rounded flex flex-col items-center justify-center transition-colors relative ${out.doneBit ? 'border-yellow-400 bg-yellow-50 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : (out.state ? 'border-blue-400 bg-blue-50' : 'border-slate-300 bg-slate-50')}`}>
                                    <div className="text-[10px] font-bold bg-white/50 w-full text-center border-b pb-0.5">{out.type.toUpperCase()}</div>
                                    <div className="flex gap-2 text-[9px] mt-0.5"><span className="text-slate-600">P:{out.preset}</span><span className="font-bold text-blue-700">A:{out.accum}</span></div>
                                    {isRunning && ['counter','rto','ctd'].includes(out.type) && <button onClick={() => resetCounter(rung.id, out.id)} className="absolute -bottom-5 bg-red-100 hover:bg-red-200 text-red-700 text-[8px] px-1.5 py-0.5 rounded border border-red-200">RESET</button>}
                                  </div>
                                ) : out.type === 'set' ? (
                                  <div className={`w-12 h-12 border-2 rounded-full flex items-center justify-center transition-colors ${out.state ? 'border-blue-400 bg-blue-50 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'border-slate-300 bg-slate-50'}`}><div className="font-bold text-sm">-(S)-</div></div>
                                ) : out.type === 'reset' ? (
                                  <div className={`w-12 h-12 border-2 rounded-full flex items-center justify-center transition-colors ${out.state ? 'border-red-400 bg-red-50 shadow-[0_0_15px_rgba(248,113,113,0.5)]' : 'border-slate-300 bg-slate-50'}`}><div className="font-bold text-sm">-(R)-</div></div>
                                ) : out.type === 'difu' ? (
                                  <div className={`w-12 h-12 border-2 rounded-full flex items-center justify-center transition-colors ${out.state ? 'border-green-400 bg-green-50 shadow-[0_0_15px_rgba(74,222,128,0.6)]' : 'border-slate-300 bg-slate-50'}`}><div className="font-bold text-sm">-(↑)-</div></div>
                                ) : out.type === 'difd' ? (
                                  <div className={`w-12 h-12 border-2 rounded-full flex items-center justify-center transition-colors ${out.state ? 'border-green-400 bg-green-50 shadow-[0_0_15px_rgba(74,222,128,0.6)]' : 'border-slate-300 bg-slate-50'}`}><div className="font-bold text-sm">-(↓)-</div></div>
                                ) : (
                                  <div className={`w-12 h-12 border-2 rounded-full flex items-center justify-center transition-colors ${out.state ? 'border-yellow-400 bg-yellow-100 shadow-[0_0_15px_rgba(250,204,21,0.6)]' : 'border-slate-300 bg-slate-50'}`}><div className="font-bold text-sm">-( )-</div></div>
                                )}
                                <span className="text-[9px] font-mono text-slate-400 mt-1">{formatAddress(out.address, plcBrand) || '?'}</span>
                              </div>
                              <div className={`flex-1 min-w-[20px] h-1.5 transition-colors ${out.doneBit || (['coil','reset','set','difu','difd'].includes(out.type) && out.state) ? 'bg-blue-400' : 'bg-blue-500'} shrink-0`}></div>
                              <div className="w-4 h-1.5 bg-blue-500 shrink-0"></div>
                              {!isRunning && rung.outputs.length > 1 && <button onClick={() => removeOutput(rung.id, out.id)} className="absolute right-0 top-0 w-4 h-4 rounded-full bg-red-100 text-red-500 hover:bg-red-500 flex items-center justify-center text-[10px] font-bold z-20">&times;</button>}
                            </div>
                          ))}
                          {!isRunning && <button onClick={() => addOutput(rung.id)} className="absolute -bottom-6 right-0 text-[10px] font-bold text-slate-400 hover:text-blue-600 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm opacity-0 group-hover/coil:opacity-100 transition-opacity z-20 whitespace-nowrap">{t('outputDown')}</button>}
                        </div>
                        <div className="w-8 h-1.5 bg-blue-500 shrink-0"></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* --- TAB 3 CONTENT: 2D PROCESS PLANT --- */}
            {activeTab === 'process' && (
              <div className="flex-1 flex flex-col w-full max-w-[90rem] mx-auto gap-6 mt-6">
                
                <div className="flex justify-between items-end border-b border-slate-300 pb-2">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t('processSim')}</h2>
                  </div>
                </div>

                {/* HOW TO RUN INSTRUCTIONS FOR SMART FACTORY */}
                {selectedPlant === 'smartFactory' && (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-sm">
                    <h3 className="font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">💡 {t('howToRunTitle')}</h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-slate-600 font-medium">
                      <span className="flex items-center gap-1.5"><span className="bg-blue-100 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs">1</span> {t('step1')}</span>
                      <span className="flex items-center gap-1.5"><span className="bg-blue-100 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs">2</span> {t('step2')}</span>
                      <span className="flex items-center gap-1.5"><span className="bg-blue-100 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs">3</span> {t('step3')}</span>
                      <span className="flex items-center gap-1.5"><span className="bg-blue-100 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs">4</span> {t('step4')}</span>
                      <span className="flex items-center gap-1.5"><span className="bg-blue-100 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs">5</span> {t('step5')}</span>
                      <span className="flex items-center gap-1.5"><span className="bg-blue-100 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs">6</span> {t('step6')}</span>
                      <span className="flex items-center gap-1.5"><span className="bg-blue-100 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs">7</span> {t('step7')}</span>
                    </div>
                  </div>
                )}

                {/* SPECIAL PANEL FOR SMART FACTORY */}
                {selectedPlant === 'smartFactory' && (
                  <div className="mb-2">
                    <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-300">
                      <button onClick={() => setSfSubTab('simulation')} className={`px-4 py-2 font-bold text-sm rounded transition-colors ${sfSubTab === 'simulation' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>Simulation</button>
                      <button onClick={() => setSfSubTab('guided')} className={`px-4 py-2 font-bold text-sm rounded transition-colors ${sfSubTab === 'guided' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>{t('guidedMode')}</button>
                      <button onClick={() => setSfSubTab('challenge')} className={`px-4 py-2 font-bold text-sm rounded transition-colors ${sfSubTab === 'challenge' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>{t('challengeMode')}</button>
                      <button onClick={() => setSfSubTab('hardware')} className={`px-4 py-2 font-bold text-sm rounded transition-colors ${sfSubTab === 'hardware' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>{t('hwMapMode')}</button>
                    </div>

                    {sfSubTab === 'guided' && (
                      <div className="bg-white p-6 rounded-lg border border-slate-200 mt-4 shadow-sm text-sm text-slate-700 max-w-4xl">
                        <ol className="list-decimal list-inside space-y-3">
                          <li><strong className="text-slate-900">Level 1:</strong> Create start/stop latch using <code>{formatAddress('I:0/0', plcBrand)}</code> and <code>{formatAddress('I:0/1', plcBrand)}</code>.</li>
                          <li><strong className="text-slate-900">Level 2:</strong> Turn ON conveyor motor (<code>{formatAddress('O:0/0', plcBrand)}</code>) when system is running.</li>
                          <li><strong className="text-slate-900">Level 3:</strong> Stop conveyor at filling station using sensor <code>{formatAddress('I:0/5', plcBrand)}</code>.</li>
                          <li><strong className="text-slate-900">Level 4:</strong> Activate fill pump (<code>{formatAddress('O:0/1', plcBrand)}</code>) and fill valve (<code>{formatAddress('O:0/2', plcBrand)}</code>) until bottle is full (<code>{formatAddress('I:0/6', plcBrand)}</code>).</li>
                          <li><strong className="text-slate-900">Level 5:</strong> Move to capping station and activate clamp/capper (<code>{formatAddress('O:0/5', plcBrand)}</code>, <code>{formatAddress('O:0/6', plcBrand)}</code>).</li>
                          <li><strong className="text-slate-900">Level 6:</strong> Inspect product quality using sensor <code>{formatAddress('I:1/1', plcBrand)}</code>.</li>
                          <li><strong className="text-slate-900">Level 7:</strong> Reject bad product using diverter solenoid (<code>{formatAddress('O:0/7', plcBrand)}</code>).</li>
                          <li><strong className="text-slate-900">Level 8:</strong> Count accepted products on packaging conveyor (<code>{formatAddress('O:1/0', plcBrand)}</code>).</li>
                          <li><strong className="text-slate-900">Level 9:</strong> Stop the line when batch target is reached.</li>
                          <li><strong className="text-slate-900">Level 10:</strong> Add emergency stop (<code>{formatAddress('I:0/2', plcBrand)}</code>), reject bin full (<code>{formatAddress('I:1/2', plcBrand)}</code>), and tank low (<code>{formatAddress('I:1/3', plcBrand)}</code>) fault handling.</li>
                        </ol>
                      </div>
                    )}

                    {sfSubTab === 'challenge' && (
                      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 mt-4 shadow-sm text-sm text-purple-900 font-medium max-w-4xl leading-relaxed">
                        “Design a ladder program that automatically fills, caps, inspects, sorts, and packages 10 bottles. Reject bad products and stop the system during emergency stop, tank low level, or reject bin full.”
                      </div>
                    )}

                    {sfSubTab === 'hardware' && (
                      <div className="bg-white p-6 rounded-lg border border-slate-200 mt-4 shadow-sm text-sm text-slate-700 max-w-4xl">
                        <h4 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Wiring Preparation for Real PLC Trainers ({t(`brand_${plcBrand}`)})</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                          <li className="flex justify-between border-b border-slate-50 pb-1"><span>Start Button</span> <strong className="font-mono text-blue-600">{formatAddress('I:0/0', plcBrand)}</strong></li>
                          <li className="flex justify-between border-b border-slate-50 pb-1"><span>Stop Button</span> <strong className="font-mono text-blue-600">{formatAddress('I:0/1', plcBrand)}</strong></li>
                          <li className="flex justify-between border-b border-slate-50 pb-1"><span>Emergency Stop</span> <strong className="font-mono text-blue-600">{formatAddress('I:0/2', plcBrand)}</strong></li>
                          <li className="flex justify-between border-b border-slate-50 pb-1"><span>Reset Button</span> <strong className="font-mono text-blue-600">{formatAddress('I:0/3', plcBrand)}</strong></li>
                          <li className="flex justify-between border-b border-slate-50 pb-1"><span>Conveyor Motor</span> <strong className="font-mono text-blue-600">{formatAddress('O:0/0', plcBrand)}</strong></li>
                          <li className="flex justify-between border-b border-slate-50 pb-1"><span>Fill Pump</span> <strong className="font-mono text-blue-600">{formatAddress('O:0/1', plcBrand)}</strong></li>
                          <li className="flex justify-between border-b border-slate-50 pb-1"><span>Fill Valve</span> <strong className="font-mono text-blue-600">{formatAddress('O:0/2', plcBrand)}</strong></li>
                          <li className="flex justify-between border-b border-slate-50 pb-1"><span>Run Lamp</span> <strong className="font-mono text-blue-600">{formatAddress('O:1/1', plcBrand)}</strong></li>
                          <li className="flex justify-between border-b border-slate-50 pb-1"><span>Fault Lamp</span> <strong className="font-mono text-blue-600">{formatAddress('O:1/2', plcBrand)}</strong></li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* --- NON-SMART FACTORY SVGs --- */}
                {selectedPlant !== 'smartFactory' && (
                  <div className="w-full aspect-video max-h-[800px] bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border-4 border-slate-700 shadow-inner relative mt-4">
                     {/* ---- 0. SANDBOX (SVG) ---- */}
                     {selectedPlant === 'sandbox' && (
                       <svg viewBox="0 0 1000 600" className="w-full h-full object-contain">
                         <rect width="1000" height="600" fill="#1e293b" />
                         <text x="500" y="80" fill="white" fontSize="32" fontWeight="bold" textAnchor="middle">Sandbox Simulation</text>
                         <g transform="translate(140, 200)">
                           <circle cx="120" cy="100" r="80" fill={isOutputOn('O:0/0') ? '#22c55e' : '#475569'} stroke="#0f172a" strokeWidth="12" />
                           <text x="120" y="220" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle">{formatAddress('O:0/0', plcBrand)} (Green)</text>
                           <circle cx="360" cy="100" r="80" fill={isOutputOn('O:0/1') ? '#eab308' : '#475569'} stroke="#0f172a" strokeWidth="12" />
                           <text x="360" y="220" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle">{formatAddress('O:0/1', plcBrand)} (Yellow)</text>
                           <circle cx="600" cy="100" r="80" fill={isOutputOn('O:0/2') ? '#ef4444' : '#475569'} stroke="#0f172a" strokeWidth="12" />
                           <text x="600" y="220" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle">{formatAddress('O:0/2', plcBrand)} (Red)</text>
                         </g>
                         <g transform="translate(100, 480)">
                            <rect x="0" y="0" width="800" height="80" fill="#334155" rx="10" />
                            <text x="400" y="45" fill="white" fontSize="20" textAnchor="middle">
                              Use the Physical Panel (Left) to toggle: 
                              {formatAddress('I:0/0', plcBrand)} (Switch A), {formatAddress('I:0/1', plcBrand)} (Switch B), {formatAddress('I:0/2', plcBrand)} (Push Button)
                            </text>
                         </g>
                       </svg>
                     )}

                     {/* ---- 1. BOTTLE FILLING PLANT (SVG) ---- */}
                     {selectedPlant === 'bottle' && (
                       <svg viewBox="0 0 1000 600" className="w-full h-full object-contain">
                         <rect width="1000" height="600" fill="#1e293b" />
                         <rect x="20" y="20" width="220" height="110" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                         <text x="35" y="50" fill="#94a3b8" fontSize="16" fontWeight="bold" fontFamily="monospace">{t('bottles')}:</text>
                         <text x="130" y="50" fill="#22c55e" fontSize="24" fontWeight="bold" fontFamily="monospace">{plantState.bottle.count}</text>
                         <text x="35" y="80" fill="#94a3b8" fontSize="14" fontFamily="monospace">{t('conveyor')}: {isOutputOn('O:0/0') ? <tspan fill="#22c55e" fontWeight="bold">{t('on')}</tspan> : t('off')}</text>
                         <text x="35" y="105" fill="#94a3b8" fontSize="14" fontFamily="monospace">{t('valve')}: {isOutputOn('O:0/1') ? <tspan fill="#3b82f6" fontWeight="bold">{t('on')}</tspan> : t('off')}</text>

                         <rect x="0" y="450" width="1000" height="150" fill="#334155" />
                         <rect x="0" y="450" width="1000" height="15" fill="#475569" />
                         {Array.from({length: 20}).map((_, i) => (
                            <g key={i} transform={`translate(${25 + i*50}, 490)`}>
                              <circle r="20" fill="#94a3b8" />
                              {isOutputOn('O:0/0') && (
                                 <g transform={`rotate(${tick * 20 % 360})`}>
                                   <line x1="-15" y1="0" x2="15" y2="0" stroke="#475569" strokeWidth="4" />
                                   <line x1="0" y1="-15" x2="0" y2="15" stroke="#475569" strokeWidth="4" />
                                 </g>
                              )}
                            </g>
                         ))}
                         {isOutputOn('O:0/1') && <rect x="490" y="150" width="20" height="300" fill="#3b82f6" opacity="0.8" />}
                         <path d="M 400 0 L 600 0 L 530 130 L 470 130 Z" fill="#64748b" />
                         <rect x="480" y="130" width="40" height="40" fill={isOutputOn('O:0/1') ? '#3b82f6' : '#94a3b8'} stroke="#fff" strokeWidth="2" />
                         <text x="530" y="155" fill="white" fontSize="16" fontWeight="bold">{formatAddress('O:0/1', plcBrand)} {t('valve')}</text>

                         <g transform={`translate(${plantState.bottle.pos}, 250)`}>
                            <rect x="0" y="0" width="100" height="200" rx="5" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="4" />
                            <rect x="4" y={196 - plantState.bottle.fill * 1.92} width="92" height={plantState.bottle.fill * 1.92} fill="#3b82f6" />
                            <rect x="10" y="10" width="10" height="180" fill="white" opacity="0.2" rx="5" />
                         </g>

                         <rect x="360" y="420" width="40" height="20" fill={physicalInputs['I:0/2'] ? '#ef4444' : '#475569'} stroke="#fff" strokeWidth="2" />
                         <text x="320" y="400" fill="white" fontSize="16" fontWeight="bold">{formatAddress('I:0/2', plcBrand)} {t('prox')}</text>
                         
                         <rect x="600" y="270" width="40" height="20" fill={physicalInputs['I:0/3'] ? '#22c55e' : '#475569'} stroke="#fff" strokeWidth="2" />
                         <text x="650" y="285" fill="white" fontSize="16" fontWeight="bold">{formatAddress('I:0/3', plcBrand)} {t('level')}</text>
                         <text x="20" y="580" fill="white" fontSize="20" fontWeight="bold">{formatAddress('O:0/0', plcBrand)} {t('conveyor')}</text>
                       </svg>
                     )}

                     {/* ---- 2. GARAGE DOOR (SVG) ---- */}
                     {selectedPlant === 'garage' && (
                       <svg viewBox="0 0 1000 600" className="w-full h-full object-contain">
                         <rect width="1000" height="600" fill="#1e293b" />
                         <text x="40" y="50" fill="white" fontSize="18" fontWeight="bold">{formatAddress('O:0/0', plcBrand)} {t('motorUp')}: <tspan fill={isOutputOn('O:0/0')?'#22c55e':'#94a3b8'}>{isOutputOn('O:0/0')?t('on'):t('off')}</tspan></text>
                         <text x="260" y="50" fill="white" fontSize="18" fontWeight="bold">{formatAddress('O:0/1', plcBrand)} {t('motorDn')}: <tspan fill={isOutputOn('O:0/1')?'#3b82f6':'#94a3b8'}>{isOutputOn('O:0/1')?t('on'):t('off')}</tspan></text>
                         <text x="480" y="50" fill="white" fontSize="14" opacity="0.6">{t('photoEyeHelp')}</text>
                         <rect x="250" y="150" width="500" height="400" fill="#0f172a" />
                         <g transform={`translate(0, ${-plantState.garage.pos * 4})`}>
                            <rect x="250" y="150" width="500" height="400" fill="#cbd5e1" stroke="#64748b" strokeWidth="4" />
                            {Array.from({length: 8}).map((_, i) => (
                               <line key={i} x1="250" y1={200 + i*50} x2="750" y2={200 + i*50} stroke="#94a3b8" strokeWidth="4" />
                            ))}
                         </g>
                         <rect x="0" y="60" width="1000" height="90" fill="#334155" stroke="#475569" strokeWidth="4" />
                         <rect x="0" y="150" width="250" height="450" fill="#334155" stroke="#475569" strokeWidth="4" />
                         <rect x="750" y="150" width="250" height="450" fill="#334155" stroke="#475569" strokeWidth="4" />

                         <rect x="200" y="170" width="50" height="20" fill={physicalInputs['I:0/2'] ? '#ef4444' : '#475569'} stroke="#fff" strokeWidth="2" />
                         <text x="60" y="185" fill="white" fontSize="16" fontWeight="bold">{formatAddress('I:0/2', plcBrand)} Upper Limit</text>
                         <rect x="200" y="520" width="50" height="20" fill={physicalInputs['I:0/3'] ? '#ef4444' : '#475569'} stroke="#fff" strokeWidth="2" />
                         <text x="60" y="535" fill="white" fontSize="16" fontWeight="bold">{formatAddress('I:0/3', plcBrand)} Lower Limit</text>
                         <circle cx="270" cy="500" r="10" fill={physicalInputs['I:0/4'] ? '#ef4444' : '#64748b'} />
                         <circle cx="730" cy="500" r="10" fill="#64748b" />
                         {!physicalInputs['I:0/4'] && <line x1="270" y1="500" x2="730" y2="500" stroke="#ef4444" strokeWidth="4" strokeDasharray="15 10" />}
                         <text x="250" y="480" fill="white" fontSize="16" fontWeight="bold">{formatAddress('I:0/4', plcBrand)} Photo Eye</text>
                       </svg>
                     )}

                     {/* ---- 3. BATCH MIXING TANK (SVG) ---- */}
                     {selectedPlant === 'tank' && (
                       <svg viewBox="0 0 1000 600" className="w-full h-full object-contain">
                         <rect width="1000" height="600" fill="#1e293b" />
                         <text x="40" y="40" fill="white" fontSize="18" fontWeight="bold">{formatAddress('O:0/0', plcBrand)} {t('fillPump')}: <tspan fill={isOutputOn('O:0/0')?'#3b82f6':'#94a3b8'}>{isOutputOn('O:0/0')?t('on'):t('off')}</tspan></text>
                         <text x="40" y="70" fill="white" fontSize="18" fontWeight="bold">{formatAddress('O:0/1', plcBrand)} {t('drainPump')}: <tspan fill={isOutputOn('O:0/1')?'#3b82f6':'#94a3b8'}>{isOutputOn('O:0/1')?t('on'):t('off')}</tspan></text>
                         <text x="750" y="40" fill="white" fontSize="18" fontWeight="bold">{formatAddress('O:0/2', plcBrand)} {t('mixer')}: <tspan fill={isOutputOn('O:0/2')?'#a855f7':'#94a3b8'}>{isOutputOn('O:0/2')?t('on'):t('off')}</tspan></text>
                         <text x="750" y="70" fill="white" fontSize="18" fontWeight="bold">{formatAddress('O:0/3', plcBrand)} {t('heater')}: <tspan fill={isOutputOn('O:0/3')?'#ef4444':'#94a3b8'}>{isOutputOn('O:0/3')?t('on'):t('off')}</tspan></text>
                         <path d="M 50 100 L 350 100 L 350 150" fill="none" stroke="#64748b" strokeWidth="20" strokeLinejoin="round" />
                         <circle cx="150" cy="100" r="30" fill={isOutputOn('O:0/0') ? '#3b82f6' : '#475569'} stroke="#fff" strokeWidth="4" />
                         {isOutputOn('O:0/0') && <rect x="340" y="145" width="20" height={400 - plantState.tank.level * 4} fill="#3b82f6" opacity="0.6" />}
                         <path d="M 650 500 L 650 550 L 950 550" fill="none" stroke="#64748b" strokeWidth="20" strokeLinejoin="round" />
                         <circle cx="800" cy="550" r="30" fill={isOutputOn('O:0/1') ? '#3b82f6' : '#475569'} stroke="#fff" strokeWidth="4" />
                         <path d="M 300 150 L 700 150 L 700 500 A 50 50 0 0 1 650 550 L 350 550 A 50 50 0 0 1 300 500 Z" fill="#0f172a" stroke="#cbd5e1" strokeWidth="8" />
                         <rect x="304" y={546 - plantState.tank.level * 3.96} width="392" height={plantState.tank.level * 3.96} fill="#0ea5e9" opacity="0.9" rx="15" />
                         <rect x="350" y="520" width="300" height="15" rx="7" fill={isOutputOn('O:0/3') ? '#ef4444' : '#475569'} />
                         <rect x="490" y="100" width="20" height="350" fill="#94a3b8" /> 
                         <rect x="470" y="50" width="60" height="50" fill="#475569" rx="5" /> 
                         <g transform={`translate(500, 300) rotate(${isOutputOn('O:0/2') ? (tick * 45 % 360) : 0})`}><rect x="-80" y="-10" width="160" height="20" fill="#cbd5e1" rx="5" /></g>
                         <g transform={`translate(500, 420) rotate(${isOutputOn('O:0/2') ? (tick * 45 % 360) : 0})`}><rect x="-80" y="-10" width="160" height="20" fill="#cbd5e1" rx="5" /></g>
                         <polygon points="280,180 280,200 310,190" fill={physicalInputs['I:0/3'] ? '#22c55e' : '#475569'} />
                         <text x="180" y="195" fill="white" fontSize="16" fontWeight="bold">{formatAddress('I:0/3', plcBrand)} {t('high')}</text>
                         <polygon points="280,450 280,470 310,460" fill={physicalInputs['I:0/2'] ? '#22c55e' : '#475569'} />
                         <text x="180" y="465" fill="white" fontSize="16" fontWeight="bold">{formatAddress('I:0/2', plcBrand)} {t('low')}</text>
                       </svg>
                     )}

                     {/* ---- 4. TRAFFIC INTERSECTION (SVG) ---- */}
                     {selectedPlant === 'traffic' && (
                       <svg viewBox="0 0 1000 600" className="w-full h-full object-contain">
                         <rect width="1000" height="600" fill="#15803d" />
                         <text x="30" y="40" fill="white" fontSize="18" fontWeight="bold">{formatAddress('I:0/0', plcBrand)} System: {physicalInputs['I:0/0']?'ON':'OFF'} (Use Switch in Physical Panel)</text>
                         <rect x="0" y="200" width="1000" height="200" fill="#334155" />
                         <rect x="400" y="0" width="200" height="600" fill="#334155" />
                         <line x1="500" y1="0" x2="500" y2="200" stroke="#facc15" strokeWidth="6" strokeDasharray="30 20" />
                         <line x1="500" y1="400" x2="500" y2="600" stroke="#facc15" strokeWidth="6" strokeDasharray="30 20" />
                         <line x1="0" y1="300" x2="400" y2="300" stroke="#facc15" strokeWidth="6" strokeDasharray="30 20" />
                         <line x1="600" y1="300" x2="1000" y2="300" stroke="#facc15" strokeWidth="6" strokeDasharray="30 20" />
                         {Array.from({length: 6}).map((_, i) => <rect key={`tc_${i}`} x={415+i*30} y="150" width="15" height="40" fill="white" /> )}
                         {Array.from({length: 6}).map((_, i) => <rect key={`bc_${i}`} x={415+i*30} y="410" width="15" height="40" fill="white" /> )}
                         {Array.from({length: 6}).map((_, i) => <rect key={`lc_${i}`} x="350" y={215+i*30} width="40" height="15" fill="white" /> )}
                         {Array.from({length: 6}).map((_, i) => <rect key={`rc_${i}`} x="610" y={215+i*30} width="40" height="15" fill="white" /> )}
                         <g transform="translate(280, 20)">
                            <rect x="0" y="0" width="80" height="180" fill="#0f172a" rx="10" stroke="#475569" strokeWidth="4" />
                            <circle cx="40" cy="40" r="20" fill={isOutputOn('O:0/2') ? '#ef4444' : '#450a0a'} stroke="#000" strokeWidth="2" />
                            <circle cx="40" cy="90" r="20" fill={isOutputOn('O:0/1') ? '#eab308' : '#422006'} stroke="#000" strokeWidth="2" />
                            <circle cx="40" cy="140" r="20" fill={isOutputOn('O:0/0') ? '#22c55e' : '#052e16'} stroke="#000" strokeWidth="2" />
                            <text x="40" y="200" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">North / South</text>
                            <text x="40" y="220" fill="white" fontSize="12" textAnchor="middle">{formatAddress('O:0/0', plcBrand)}, {formatAddress('O:0/1', plcBrand)}, {formatAddress('O:0/2', plcBrand)}</text>
                         </g>
                         <g transform="translate(680, 420)">
                            <rect x="0" y="0" width="180" height="80" fill="#0f172a" rx="10" stroke="#475569" strokeWidth="4" />
                            <circle cx="40" cy="40" r="20" fill={isOutputOn('O:0/5') ? '#ef4444' : '#450a0a'} stroke="#000" strokeWidth="2" />
                            <circle cx="90" cy="40" r="20" fill={isOutputOn('O:0/4') ? '#eab308' : '#422006'} stroke="#000" strokeWidth="2" />
                            <circle cx="140" cy="40" r="20" fill={isOutputOn('O:0/3') ? '#22c55e' : '#052e16'} stroke="#000" strokeWidth="2" />
                            <text x="90" y="105" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">East / West</text>
                            <text x="90" y="125" fill="white" fontSize="12" textAnchor="middle">{formatAddress('O:0/3', plcBrand)}, {formatAddress('O:0/4', plcBrand)}, {formatAddress('O:0/5', plcBrand)}</text>
                         </g>
                       </svg>
                     )}

                     {/* ---- 5. ELEVATOR (SVG) ---- */}
                     {selectedPlant === 'elevator' && (
                       <svg viewBox="0 0 1000 600" className="w-full h-full object-contain">
                         <rect width="1000" height="600" fill="#1e293b" />
                         <text x="40" y="50" fill="white" fontSize="18" fontWeight="bold">{formatAddress('O:0/0', plcBrand)} {t('motorUp')}: <tspan fill={isOutputOn('O:0/0')?'#22c55e':'#94a3b8'}>{isOutputOn('O:0/0')?t('on'):t('off')}</tspan></text>
                         <text x="260" y="50" fill="white" fontSize="18" fontWeight="bold">{formatAddress('O:0/1', plcBrand)} {t('motorDn')}: <tspan fill={isOutputOn('O:0/1')?'#3b82f6':'#94a3b8'}>{isOutputOn('O:0/1')?t('on'):t('off')}</tspan></text>
                         
                         <circle cx="450" cy="50" r="30" fill="#94a3b8" />
                         {isOutputOn('O:0/0') && <path d="M 450 50 L 480 30" stroke="#fff" strokeWidth="4" />}
                         <rect x="350" y="50" width="200" height="500" fill="#0f172a" stroke="#475569" strokeWidth="8" />
                         <line x1="450" y1="50" x2="450" y2={450 - plantState.elevator.pos * 4} stroke="#94a3b8" strokeWidth="6" />

                         <g transform={`translate(355, ${450 - plantState.elevator.pos * 4})`}>
                            <rect x="0" y="0" width="190" height="100" fill="#cbd5e1" rx="5" />
                            <rect x="10" y="10" width="80" height="80" fill="#64748b" />
                            <rect x="100" y="10" width="80" height="80" fill="#64748b" />
                            <line x1="95" y1="10" x2="95" y2="90" stroke="#1e293b" strokeWidth="4" />
                         </g>

                         <line x1="150" y1="550" x2="350" y2="550" stroke="#fff" strokeWidth="6" />
                         <text x="180" y="520" fill="white" fontSize="20" fontWeight="bold">{t('ground')}</text>
                         <rect x="310" y="530" width="40" height="20" fill={physicalInputs['I:0/3'] ? '#22c55e' : '#475569'} stroke="#fff" strokeWidth="2" />
                         <text x="260" y="545" fill="white" fontSize="14">{formatAddress('I:0/3', plcBrand)}</text>
                         <g onClick={() => isRunning && triggerMomentaryInput('I:0/0')} className="cursor-pointer">
                           <rect x="180" y="450" width="40" height="40" rx="5" fill={physicalInputs['I:0/0'] ? '#facc15' : '#94a3b8'} />
                           <text x="200" y="475" fill="#0f172a" fontSize="16" fontWeight="bold" textAnchor="middle">G</text>
                           <text x="180" y="440" fill="white" fontSize="10">{formatAddress('I:0/0', plcBrand)} Call</text>
                         </g>

                         <line x1="150" y1="350" x2="350" y2="350" stroke="#fff" strokeWidth="6" />
                         <text x="180" y="320" fill="white" fontSize="20" fontWeight="bold">{t('floor1')}</text>
                         <rect x="310" y="330" width="40" height="20" fill={physicalInputs['I:0/4'] ? '#22c55e' : '#475569'} stroke="#fff" strokeWidth="2" />
                         <text x="260" y="345" fill="white" fontSize="14">{formatAddress('I:0/4', plcBrand)}</text>
                         <g onClick={() => isRunning && triggerMomentaryInput('I:0/1')} className="cursor-pointer">
                           <rect x="180" y="250" width="40" height="40" rx="5" fill={physicalInputs['I:0/1'] ? '#facc15' : '#94a3b8'} />
                           <text x="200" y="275" fill="#0f172a" fontSize="16" fontWeight="bold" textAnchor="middle">1</text>
                           <text x="180" y="240" fill="white" fontSize="10">{formatAddress('I:0/1', plcBrand)} Call</text>
                         </g>

                         <line x1="150" y1="150" x2="350" y2="150" stroke="#fff" strokeWidth="6" />
                         <text x="180" y="120" fill="white" fontSize="20" fontWeight="bold">{t('floor2')}</text>
                         <rect x="310" y="130" width="40" height="20" fill={physicalInputs['I:0/5'] ? '#22c55e' : '#475569'} stroke="#fff" strokeWidth="2" />
                         <text x="260" y="145" fill="white" fontSize="14">{formatAddress('I:0/5', plcBrand)}</text>
                         <g onClick={() => isRunning && triggerMomentaryInput('I:0/2')} className="cursor-pointer">
                           <rect x="180" y="50" width="40" height="40" rx="5" fill={physicalInputs['I:0/2'] ? '#facc15' : '#94a3b8'} />
                           <text x="200" y="75" fill="#0f172a" fontSize="16" fontWeight="bold" textAnchor="middle">2</text>
                           <text x="180" y="40" fill="white" fontSize="10">{formatAddress('I:0/2', plcBrand)} Call</text>
                         </g>
                       </svg>
                     )}
                  </div>
                )}

                {/* --- 6. SMART FACTORY (INTEGRATED LAYOUT) --- */}
                {selectedPlant === 'smartFactory' && sfSubTab === 'simulation' && (
                  <div className="w-full flex flex-col xl:flex-row gap-6 bg-slate-100 rounded-lg">
                    
                    {/* Left Side: SVG Process Area and IO Table */}
                    <div className="flex-1 flex flex-col gap-6">
                      
                      {/* SVG Canvas */}
                      <div className="w-full aspect-video bg-slate-900 rounded-xl overflow-hidden relative border-4 border-slate-700 shadow-inner">
                        <svg viewBox="0 0 1200 600" className="w-full h-full object-contain">
                          
                          {/* FAULT BANNER Overlay */}
                          {(physicalInputs['I:0/2'] || physicalInputs['I:1/2'] || plantState.smartFactory.tankLevel <= 10) && (
                            <g transform="translate(300, 250)" className="z-50 opacity-95">
                               <rect x="0" y="0" width="600" height="100" fill="#ef4444" rx="10" stroke="#b91c1c" strokeWidth="4" />
                               <text x="300" y="45" fill="white" fontSize="32" fontWeight="bold" textAnchor="middle">{t('sysStoppedFault')}</text>
                               <text x="300" y="80" fill="white" fontSize="20" textAnchor="middle" fontWeight="bold">
                                 {physicalInputs['I:0/2'] ? t('eStop') : physicalInputs['I:1/2'] ? t('rejectFull') : t('tankLow')}
                               </text>
                            </g>
                          )}

                          {/* Top Process Flow Bar */}
                          <g transform="translate(50, 20)">
                            {['Entry', 'Fill', 'Cap', 'Inspect', 'Sort', 'Package'].map((step, idx) => {
                              // Simplify active station matching to these exact 6 steps
                              let highlight = false;
                              const s = plantState.smartFactory.activeStation;
                              if (step === 'Entry' && (s === 'Start' || s === 'Entry' || s === 'Transport')) highlight = true;
                              if (step === s) highlight = true;

                              return (
                                <g key={step} transform={`translate(${idx * 180}, 0)`}>
                                  <polygon points="0,0 160,0 175,15 160,30 0,30 15,15" fill={highlight ? '#3b82f6' : '#334155'} stroke="#1e293b" strokeWidth="2" />
                                  <text x="90" y="20" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">Step {idx+1}: {step}</text>
                                </g>
                              );
                            })}
                          </g>

                          {/* Station Titles */}
                          <g fill="#94a3b8" fontSize="18" fontWeight="bold" textAnchor="middle">
                            <text x="100" y="100">ENTRY</text>
                            <text x="250" y="100">FILL</text>
                            <text x="450" y="100">CAP</text>
                            <text x="650" y="100">INSPECT</text>
                            <text x="800" y="100">SORT</text>
                            <text x="1000" y="100">PACKAGE</text>
                          </g>

                          {/* Conveyor Belt */}
                          <rect x="20" y="450" width="1160" height="40" fill="#334155" />
                          <rect x="20" y="450" width="1160" height="5" fill="#475569" />
                          {Array.from({length: 23}).map((_, i) => (
                             <g key={i} transform={`translate(${45 + i*50}, 470)`}>
                               <circle r="15" fill="#94a3b8" />
                               {isOutputOn('O:0/0') && (
                                  <g transform={`rotate(${tick * 20 % 360})`} stroke="#475569" strokeWidth="3">
                                    <line x1="-10" y1="0" x2="10" y2="0" />
                                    <line x1="0" y1="-10" x2="0" y2="10" />
                                  </g>
                               )}
                             </g>
                          ))}
                          <rect x="20" y="500" width="80" height="25" fill={isOutputOn('O:0/0') ? '#facc15' : '#64748b'} rx="4" />
                          <text x="60" y="517" fill="#1e293b" fontSize="14" fontWeight="bold" textAnchor="middle">{formatAddress('O:0/0', plcBrand)}</text>

                          {/* Entry Station */}
                          <rect x="90" y="415" width="20" height="30" fill={physicalInputs['I:0/4'] ? '#3b82f6' : '#475569'} rx="4" />
                          <text x="100" y="405" fill="#3b82f6" fontSize="14" fontWeight="bold" textAnchor="middle">{formatAddress('I:0/4', plcBrand)}</text>

                          {/* Tank & Fill Station (Centered at x=250) */}
                          <path d="M 210 140 L 290 140 L 290 280 L 210 280 Z" fill="#475569" />
                          <rect x="215" y={145 + (100 - plantState.smartFactory.tankLevel)*1.3} width="70" height={plantState.smartFactory.tankLevel*1.3} fill="#0ea5e9" opacity="0.8" />
                          
                          <rect x="150" y="240" width="50" height="20" fill={physicalInputs['I:1/3'] ? '#ef4444' : '#475569'} rx="4" />
                          <text x="175" y="230" fill={physicalInputs['I:1/3'] ? '#ef4444' : '#3b82f6'} fontSize="14" fontWeight="bold" textAnchor="middle">{formatAddress('I:1/3', plcBrand)}</text>

                          <path d="M 250 280 L 250 330" stroke="#64748b" strokeWidth="10" />
                          
                          <circle cx="280" cy="300" r="15" fill={isOutputOn('O:0/1') ? '#facc15' : '#64748b'} />
                          <text x="315" y="305" fill="#facc15" fontSize="14" fontWeight="bold" textAnchor="middle">{formatAddress('O:0/1', plcBrand)}</text>

                          <rect x="235" y="330" width="30" height="20" fill={isOutputOn('O:0/2') ? '#facc15' : '#64748b'} rx="2" />
                          <text x="290" y="345" fill="#facc15" fontSize="14" fontWeight="bold" textAnchor="middle">{formatAddress('O:0/2', plcBrand)}</text>
                          {isOutputOn('O:0/2') && <rect x="245" y="350" width="10" height="100" fill="#0ea5e9" opacity="0.8" />}

                          <rect x="210" y="415" width="20" height="30" fill={physicalInputs['I:0/5'] ? '#3b82f6' : '#475569'} rx="4" />
                          <text x="180" y="435" fill="#3b82f6" fontSize="14" fontWeight="bold" textAnchor="middle">{formatAddress('I:0/5', plcBrand)}</text>
                          
                          <rect x="270" y="415" width="20" height="30" fill={physicalInputs['I:0/6'] ? '#3b82f6' : '#475569'} rx="4" />
                          <text x="310" y="435" fill="#3b82f6" fontSize="14" fontWeight="bold" textAnchor="middle">{formatAddress('I:0/6', plcBrand)}</text>

                          {/* Capping Station (Centered at x=450) */}
                          <rect x="410" y="240" width="80" height="80" fill="#475569" rx="5" />
                          <text x="510" y="260" fill="#facc15" fontSize="14" fontWeight="bold" textAnchor="middle">{formatAddress('O:0/6', plcBrand)}</text>
                          <rect x="425" y="320" width="50" height={10 + (plantState.smartFactory.capProgress/5)} fill={isOutputOn('O:0/5') ? '#facc15' : '#cbd5e1'} rx="3" />
                          <text x="510" y="330" fill="#facc15" fontSize="14" fontWeight="bold" textAnchor="middle">{formatAddress('O:0/5', plcBrand)}</text>

                          <rect x="410" y="415" width="20" height="30" fill={physicalInputs['I:0/7'] ? '#3b82f6' : '#475569'} rx="4" />
                          <text x="380" y="435" fill="#3b82f6" fontSize="14" fontWeight="bold" textAnchor="middle">{formatAddress('I:0/7', plcBrand)}</text>

                          <rect x="470" y="415" width="20" height="30" fill={physicalInputs['I:1/0'] ? '#3b82f6' : '#475569'} rx="4" />
                          <text x="510" y="435" fill="#3b82f6" fontSize="14" fontWeight="bold" textAnchor="middle">{formatAddress('I:1/0', plcBrand)}</text>

                          {/* Inspection Station (Centered at x=650) */}
                          <rect x="620" y="300" width="60" height="60" fill="#1e293b" stroke="#64748b" strokeWidth="4" rx="8" />
                          <circle cx="650" cy="330" r="15" fill={physicalInputs['I:1/1'] ? '#22c55e' : '#ef4444'} />
                          <text x="650" y="285" fill="#3b82f6" fontSize="14" fontWeight="bold" textAnchor="middle">{formatAddress('I:1/1', plcBrand)}</text>

                          {/* Sorting Station (Centered at x=800) */}
                          <path d="M 850 450 L 930 450 L 890 550 Z" fill="#475569" />
                          <text x="890" y="570" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">REJECT BIN</text>
                          <rect x="850" y="580" width="80" height="20" fill={physicalInputs['I:1/2'] ? '#ef4444' : '#475569'} rx="4" />
                          <text x="890" y="595" fill={physicalInputs['I:1/2'] ? '#ef4444' : '#3b82f6'} fontSize="14" fontWeight="bold" textAnchor="middle">{formatAddress('I:1/2', plcBrand)}</text>

                          <g transform={isOutputOn('O:0/7') ? "rotate(30 810 400)" : ""}>
                            <rect x="800" y="400" width="80" height="20" fill={isOutputOn('O:0/7') ? '#ef4444' : '#64748b'} rx="5" />
                          </g>
                          <text x="800" y="385" fill="#facc15" fontSize="14" fontWeight="bold" textAnchor="middle">{formatAddress('O:0/7', plcBrand)}</text>

                          {/* Packaging Station (x=1000) */}
                          <rect x="950" y="500" width="150" height="25" fill={isOutputOn('O:1/0') ? '#facc15' : '#475569'} rx="4" />
                          <text x="1025" y="490" fill="#facc15" fontSize="14" fontWeight="bold" textAnchor="middle">{formatAddress('O:1/0', plcBrand)}</text>
                          
                          <rect x="1000" y="380" width="80" height="80" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="4" strokeDasharray="10 5" rx="5" />
                          <text x="1040" y="370" fill="#22c55e" fontSize="14" fontWeight="bold" textAnchor="middle">Box / Package</text>

                          {/* Legend inside SVG (Bottom Left) */}
                          <g transform="translate(20, 530)">
                            <rect x="0" y="0" width="260" height="60" fill="#0f172a" rx="5" stroke="#475569" strokeWidth="2" />
                            <text x="10" y="20" fill="white" fontSize="12" fontWeight="bold">{t('legend')}</text>
                            <rect x="10" y="30" width="12" height="12" fill="#3b82f6" /> <text x="25" y="40" fill="#94a3b8" fontSize="10">{t('inputSens')}</text>
                            <rect x="115" y="30" width="12" height="12" fill="#facc15" /> <text x="130" y="40" fill="#94a3b8" fontSize="10">Active Output</text>
                            <rect x="10" y="45" width="12" height="12" fill="#64748b" /> <text x="25" y="55" fill="#94a3b8" fontSize="10">Inactive Output</text>
                            <rect x="115" y="45" width="12" height="12" fill="#ef4444" /> <text x="130" y="55" fill="#94a3b8" fontSize="10">Fault / Reject</text>
                          </g>

                          {/* Moving Bottle */}
                          <g transform={`translate(${plantState.smartFactory.bottlePos}, 350)`}>
                             <rect x="0" y="0" width="40" height="100" rx="5" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="3" />
                             <rect x="3" y={97 - plantState.smartFactory.bottleFill * 0.94} width="34" height={plantState.smartFactory.bottleFill * 0.94} fill={plantState.smartFactory.currentBottleQuality ? "#0ea5e9" : "#84cc16"} rx="2" />
                             {plantState.smartFactory.capProgress >= 100 && <rect x="5" y="-15" width="30" height="15" fill="#facc15" rx="3" />}
                          </g>

                        </svg>
                      </div>

                      {/* Smart Factory I/O Mapping Table (Outside SVG) */}
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 overflow-x-auto">
                        <h3 className="text-slate-800 font-bold mb-3 border-b border-slate-100 pb-2">Smart Factory I/O Mapping ({t(`brand_${plcBrand}`)})</h3>
                        <table className="w-full text-left text-sm text-slate-600">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider">
                              <th className="p-2 rounded-tl">Function</th>
                              <th className="p-2">Displayed Address</th>
                              <th className="p-2">Type</th>
                              <th className="p-2 rounded-tr">Purpose</th>
                            </tr>
                          </thead>
                          <tbody>
                            {PLANT_TEMPLATES.smartFactory.ioMap.map((io, idx) => (
                              <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50">
                                <td className="p-2 font-medium text-slate-800">{lang === 'en' ? io.tag_en : io.tag_zh}</td>
                                <td className="p-2 font-mono text-blue-600 font-bold">{formatAddress(io.address, plcBrand)}</td>
                                <td className="p-2">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${io.type === 'input' ? 'bg-blue-100 text-blue-700' : io.type === 'output' ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-700'}`}>
                                    {io.type.toUpperCase()}
                                  </span>
                                </td>
                                <td className="p-2 text-xs">{io.purpose}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                    </div>
                    
                    {/* Right Side: Learning Panels */}
                    <div className="w-full xl:w-96 flex flex-col gap-5">
                       
                       {/* Why Not Running Helper Box */}
                       {getSfWhyNotRunning().list.length > 0 && (
                         <div className={`p-4 rounded-xl border shadow-sm ${getSfWhyNotRunning().type === 'fault' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                           <h3 className={`font-bold mb-2 flex items-center gap-2 ${getSfWhyNotRunning().type === 'fault' ? 'text-red-700' : 'text-amber-700'}`}>
                             {getSfWhyNotRunning().type === 'fault' ? '⛔ ' + t('sysStoppedFault') : '💡 ' + t('procNotMoving')}
                           </h3>
                           <ul className="list-disc list-inside text-sm space-y-1 ml-1 font-medium">
                             {getSfWhyNotRunning().list.map((reason, i) => <li key={i}>{reason}</li>)}
                           </ul>
                         </div>
                       )}

                       {/* Programming Task Card */}
                       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                         <div className="bg-blue-600 text-white px-4 py-2 font-bold text-sm">{t('progTaskTitle')}</div>
                         <div className="p-4 text-sm text-slate-700 leading-relaxed font-medium">
                           {getSfProgrammingTask()}
                         </div>
                       </div>

                       {/* Runtime Action Card */}
                       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                         <div className="bg-purple-600 text-white px-4 py-2 font-bold text-sm">{t('runtimeActTitle')}</div>
                         <div className="p-4 text-sm text-slate-700 leading-relaxed font-medium">
                           {getSfRuntimeAction()}
                         </div>
                       </div>

                       {/* Dashboard Card */}
                       <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                         <h3 className="text-slate-800 font-bold mb-3 border-b border-slate-100 pb-2">Dashboard</h3>
                         <div className="grid grid-cols-2 gap-3 text-sm">
                           <div className="bg-slate-50 p-3 rounded border border-slate-100 flex flex-col">
                              <span className="text-slate-500 text-xs mb-1">System Status</span>
                              <span className="font-black">
                                {physicalInputs['I:0/2'] || physicalInputs['I:1/2'] || plantState.smartFactory.tankLevel <= 10 ? <span className="text-red-500">{t('faultLabel')}</span> : 
                                 plantState.smartFactory.goodCount >= plantState.smartFactory.batchTarget ? <span className="text-green-500">{t('batchComplete')}</span> : 
                                 isOutputOn('M:0/0') ? <span className="text-blue-500">{t('running')}</span> : <span className="text-slate-400">{t('stopped')}</span>}
                              </span>
                           </div>
                           <div className="bg-slate-50 p-3 rounded border border-slate-100 flex flex-col">
                              <span className="text-slate-500 text-xs mb-1">{t('activeStep')}</span>
                              <span className="text-amber-500 font-black">{plantState.smartFactory.activeStation}</span>
                           </div>
                           <div className="bg-slate-50 p-2 rounded border border-slate-100 flex justify-between font-medium">Target: <span className="text-slate-800">{plantState.smartFactory.batchTarget}</span></div>
                           <div className="bg-slate-50 p-2 rounded border border-slate-100 flex justify-between font-medium">Good: <span className="text-green-600">{plantState.smartFactory.goodCount}</span></div>
                           <div className="bg-slate-50 p-2 rounded border border-slate-100 flex justify-between font-medium">Tank: <span className="text-blue-600">{Math.round(plantState.smartFactory.tankLevel)}%</span></div>
                           <div className="bg-slate-50 p-2 rounded border border-slate-100 flex justify-between font-medium">Reject: <span className="text-red-600">{plantState.smartFactory.rejectCount}</span></div>
                           <div className="bg-slate-50 p-2 rounded border border-slate-100 flex justify-between font-medium">Fill: <span className="text-blue-600">{plantState.smartFactory.bottleFill}%</span></div>
                           <div className="bg-slate-50 p-2 rounded border border-slate-100 flex justify-between font-medium col-span-2">Quality Result: <span className={plantState.smartFactory.currentBottleQuality ? "text-green-600" : "text-red-600"}>{plantState.smartFactory.currentBottleQuality ? t('pass') : t('reject')}</span></div>
                         </div>
                       </div>

                       {/* Debug Checklist */}
                       <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                         <h3 className="text-slate-800 font-bold mb-3 border-b border-slate-100 pb-2">{t('logicDebug')}</h3>
                         <div className="flex flex-col gap-2">
                           {sfDebugChecklist.map((item, i) => (
                             <div key={i} className="flex flex-col bg-slate-50 p-2.5 rounded border border-slate-100">
                               <div className="flex items-center justify-between mb-1 text-sm">
                                 <span className={`font-bold truncate mr-2 ${item.fault && item.active ? 'text-red-600' : 'text-slate-700'}`}>
                                   <span className="font-mono text-blue-600 mr-1">{formatAddress(item.label.match(/\((.*?)\)/)[1], plcBrand)}</span> 
                                   {item.label.split('(')[0].trim()}
                                 </span>
                                 {item.active && !item.fault ? (
                                   <span className="text-green-700 font-bold text-xs whitespace-nowrap bg-green-100 px-2 py-0.5 rounded">✅ {t('okLabel')}</span>
                                 ) : item.active && item.fault ? (
                                   <span className="text-red-700 font-bold text-xs whitespace-nowrap bg-red-100 px-2 py-0.5 rounded">⛔ {t('faultLabel')}</span>
                                 ) : item.req ? (
                                   <span className="text-amber-700 font-bold text-xs whitespace-nowrap bg-amber-100 px-2 py-0.5 rounded animate-pulse">⚠ {t('reqNowLabel')}</span>
                                 ) : (
                                   <span className="text-slate-500 text-xs whitespace-nowrap bg-slate-200 px-2 py-0.5 rounded">❌ {t('notActLabel')}</span>
                                 )}
                               </div>
                               <span className="text-slate-500 text-[11px] italic">{item.desc}</span>
                             </div>
                           ))}
                         </div>
                       </div>

                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        )}
        
        {/* FOOTER */}
        <footer className="w-full text-center py-6 text-xs font-medium text-slate-400 mt-auto shrink-0 border-t border-slate-200 bg-white/50 z-10">
           &copy; Ridzuan Radin | FTKEE UMPSA
        </footer>
      </main>
    </div>
  );
};

export default App;
