// 游戏状态
let currentStep = 0;
let stepProgress = 0;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// 步骤配置
const steps = [
    {
        title: "第一步：备器",
        image: "1.jpg",
        hint: "点击'开始'按钮",
        description: "准备好分茶所需的茶具：茶盏、茶碾、茶罗、汤瓶、茶筅等。宋代人最看重茶盏，喜欢用黑色的茶盏，因为它能最好地衬托出白色的茶汤泡沫。",
        action: "auto",
        targetProgress: 100
    },
    {
        title: "第二步：碾茶",
        image: "2.jpg",
        hint: "👆 快速点击茶碾碾茶",
        description: "将茶饼放入茶碾中，细细碾成粉末。茶末碾得越细越好，这样后面点出的茶汤才会细腻洁白。",
        action: "click",
        targetProgress: 100,
        increment: 25
    },
    {
        title: "第三步：罗茶",
        image: "3.jpg",
        hint: "👆 点击茶罗筛出细茶末",
        description: "用细茶罗筛出最细腻的茶末，去掉粗渣。只有最细的茶末，才能在击拂时产生丰富的泡沫。",
        action: "click",
        targetProgress: 100,
        increment: 33
    },
    {
        title: "第四步：温盏",
        image: "4.jpg",
        hint: "点击'下一步'按钮",
        description: "用沸水倒入茶盏中预热。如果茶盏是冷的，茶汤就不容易产生泡沫，所以这一步很重要。",
        action: "auto",
        targetProgress: 100
    },
    {
        title: "第五步：调膏",
        image: "5.jpg",
        hint: "✋ 在茶盏上拖动搅拌",
        description: "把温盏的水倒掉，放入茶末，加少量沸水调成膏状。膏的稠度要适中，像融化的巧克力一样。",
        action: "drag",
        targetProgress: 100,
        increment: 10
    },
    {
        title: "第六步：击拂",
        image: "6.jpg",
        hint: "⚡ 点击进行击拂",
        description: "一边往茶盏里加水，一边用茶筅快速用力地搅动。这是最关键的一步，要让茶汤表面产生一层厚厚的、白色的泡沫。",
        action: "click",
        targetProgress: 100,
        increment: 20
    },
    {
        title: "第七步：分茶",
        image: "7.jpg",
        hint: "✏️ 在茶盏上画画",
        description: "用茶匙或茶筅在白色的泡沫上轻轻勾画。可以画出山水、花鸟、文字等各种图案，这就是神奇的'水丹青'！画完后点击'完成'按钮。",
        action: "draw",
        targetProgress: 100
    }
];

// DOM元素
let totalProgress, stepTitle, gameArea, gameImage, actionHint;
let stepProgressEl, stepProgressFill, description, actionBtn, teaCanvas, ctx;

// 音乐控制变量
let isMusicPlaying = true;
let bgMusic, musicToggle;

// 页面加载完成后初始化
window.onload = function() {
    // 获取所有DOM元素
    totalProgress = document.getElementById('totalProgress');
    stepTitle = document.getElementById('stepTitle');
    gameArea = document.getElementById('gameArea');
    gameImage = document.getElementById('gameImage');
    actionHint = document.getElementById('actionHint');
    stepProgressEl = document.getElementById('stepProgress');
    stepProgressFill = document.getElementById('stepProgressFill');
    description = document.getElementById('description');
    actionBtn = document.getElementById('actionBtn');
    teaCanvas = document.getElementById('teaCanvas');
    ctx = teaCanvas.getContext('2d');

    // 获取音乐元素
    bgMusic = document.getElementById('bgMusic');
    musicToggle = document.getElementById('musicToggle');

    // 绑定图片点击事件
    gameImage.onclick = handleImageClick;
    gameImage.onmousemove = handleImageDrag;

    // 绑定画布绘画事件
    teaCanvas.onmousedown = handleCanvasMouseDown;
    teaCanvas.onmousemove = handleCanvasMouseMove;
    teaCanvas.onmouseup = handleCanvasMouseUp;
    teaCanvas.onmouseout = handleCanvasMouseUp;

    // 初始化显示
    updateDisplay();
    
    // 初始化音乐
    initMusic();
    
    console.log("游戏初始化成功！可以开始玩了。");
};

// 初始化音乐
function initMusic() {
    if (bgMusic && musicToggle) {
        // 设置初始音量
        bgMusic.volume = 0.3;
        
        // 尝试自动播放（需要用户交互）
        document.addEventListener('click', function firstClick() {
            if (isMusicPlaying) {
                bgMusic.play().catch(e => {
                    console.log("音乐自动播放被阻止，请点击音乐按钮手动开启。");
                    musicToggle.textContent = '🎵 音乐：点击开启';
                    isMusicPlaying = false;
                });
            }
            document.removeEventListener('click', firstClick);
        });
        
        // 音乐切换按钮事件
        musicToggle.addEventListener('click', function() {
            if (isMusicPlaying) {
                bgMusic.pause();
                musicToggle.textContent = '🎵 音乐：关';
                isMusicPlaying = false;
            } else {
                bgMusic.play();
                musicToggle.textContent = '🎵 音乐：开';
                isMusicPlaying = true;
            }
        });
    }
}

// 初始化画布
function initCanvas() {
    ctx.fillStyle = 'rgba(245, 245, 220, 0.8)';
    ctx.fillRect(0, 0, teaCanvas.width, teaCanvas.height);
}

// 更新显示
function updateDisplay() {
    const step = steps[currentStep];
    
    stepTitle.textContent = step.title;
    gameImage.src = step.image;
    actionHint.textContent = step.hint;
    description.textContent = step.description;
    
    // 更新总进度
    totalProgress.style.width = (currentStep / steps.length * 100) + '%';
    
    // 重置步骤进度
    stepProgress = 0;
    stepProgressFill.style.width = '0%';
    
    // 隐藏/显示进度条
    if (step.action === "auto") {
        stepProgressEl.classList.add('hidden');
    } else {
        stepProgressEl.classList.remove('hidden');
    }
    
    // 隐藏/显示画布
    if (step.action === "draw") {
        gameImage.style.display = 'none';
        teaCanvas.style.display = 'block';
        initCanvas();
    } else {
        gameImage.style.display = 'block';
        teaCanvas.style.display = 'none';
    }
    
    // 更新按钮文本
    if (step.action === "auto") {
        actionBtn.textContent = "下一步";
        actionBtn.disabled = false;
    } else if (step.action === "draw") {
        actionBtn.textContent = "完成分茶";
        actionBtn.disabled = false;
    } else {
        actionBtn.textContent = "进行中...";
        actionBtn.disabled = true;
    }
}

// 完成步骤
function completeStep() {
    // 显示成功动画
    const success = document.createElement('div');
    success.className = 'success-animation';
    success.textContent = '✓ 完成！';
    gameArea.appendChild(success);
    
    setTimeout(() => {
        gameArea.removeChild(success);
        
        if (currentStep < steps.length - 1) {
            currentStep++;
            updateDisplay();
        } else {
            // 游戏结束
            stepTitle.textContent = "🎉 恭喜你完成了分茶！";
            description.textContent = "你已经体验了完整的宋代分茶过程。分茶是中国古代茶文化的瑰宝，希望你能喜欢这门神奇的技艺！";
            actionHint.textContent = "游戏结束";
            actionBtn.textContent = "重新开始";
            actionBtn.disabled = false;
            totalProgress.style.width = '100%';
        }
    }, 1000);
}

// 按钮点击处理
function handleButtonClick() {
    console.log("按钮被点击了！当前步骤：" + currentStep);
    
    const step = steps[currentStep];
    
    if (step.action === "auto") {
        completeStep();
    } else if (step.action === "draw") {
        completeStep();
    } else if (currentStep === steps.length - 1 && actionBtn.textContent === "重新开始") {
        // 重新开始游戏
        currentStep = 0;
        updateDisplay();
    }
}

// 图片点击处理
function handleImageClick() {
    const step = steps[currentStep];
    if (step.action === "click" && stepProgress < step.targetProgress) {
        stepProgress += step.increment;
        if (stepProgress > step.targetProgress) stepProgress = step.targetProgress;
        stepProgressFill.style.width = stepProgress + '%';
        
        if (stepProgress >= step.targetProgress) {
            completeStep();
        }
    }
}

// 图片拖动处理（调膏）
function handleImageDrag(e) {
    const step = steps[currentStep];
    if (step.action === "drag" && e.buttons === 1 && stepProgress < step.targetProgress) {
        stepProgress += step.increment;
        if (stepProgress > step.targetProgress) stepProgress = step.targetProgress;
        stepProgressFill.style.width = stepProgress + '%';
        
        if (stepProgress >= step.targetProgress) {
            completeStep();
        }
    }
}

// 画布绘画事件处理
function handleCanvasMouseDown(e) {
    isDrawing = true;
    const rect = teaCanvas.getBoundingClientRect();
    lastX = (e.clientX - rect.left) * (teaCanvas.width / rect.width);
    lastY = (e.clientY - rect.top) * (teaCanvas.height / rect.height);
}

function handleCanvasMouseMove(e) {
    if (!isDrawing) return;
    
    const rect = teaCanvas.getBoundingClientRect();
    const currentX = (e.clientX - rect.left) * (teaCanvas.width / rect.width);
    const currentY = (e.clientY - rect.top) * (teaCanvas.height / rect.height);
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.strokeStyle = '#8b5a2b';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    lastX = currentX;
    lastY = currentY;
    
    // 绘画进度
    if (stepProgress < 100) {
        stepProgress += 0.5;
        stepProgressFill.style.width = stepProgress + '%';
    }
}

function handleCanvasMouseUp() {
    isDrawing = false;
}