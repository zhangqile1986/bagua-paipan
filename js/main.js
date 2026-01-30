// js/main.js - 主页面逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 初始化
    const baGuaCalculator = new RunQG();
    const historyContainer = document.getElementById('historyList');
    
    // 设置默认日期
    document.getElementById('date').value = DateUtils.getCurrentDate();
    
    // 绑定计算按钮事件
    document.getElementById('calculateBtn').addEventListener('click', calculate);
    
    // 绑定清空历史按钮
    document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
    
    // 加载历史记录
    loadHistory();
    
    // 计算函数
   // 简化版本 - 如果你不想使用地区和行业
async function calculate() {
    try {
        const name = document.getElementById('name').value.trim();
        const date = document.getElementById('date').value;
        const hour = 12; // 使用默认时辰
        
        if (!name || !date) {
            alert('请填写姓名和日期！');
            return;
        }
        
        // 只传递必要的参数
        const result = await baGuaCalculator.calculate(name, date, hour);
        
        if (result.success) {
            displayResult(result.data);
        } else {
            alert('计算失败：' + result.error);
        }
    } catch (error) {
        console.error('计算错误:', error);
        alert('发生错误，请重试！');
    }
}
    
    // 显示结果
    function displayResult(data) {
        const resultSection = document.getElementById('resultSection');
        const explanationSection = document.getElementById('explanationSection');
        
        // 显示结果区域
        resultSection.style.display = 'block';
        explanationSection.style.display = 'block';
        
        // 填充结果数据
        document.getElementById('resultName').textContent = data.name;
        document.getElementById('resultDate').textContent = data.date;
        document.getElementById('resultAddress').textContent = data.address;
        document.getElementById('resultIndustry').textContent = data.industry;
        document.getElementById('resultStrokes').textContent = data.strokeCount;
        document.getElementById('resultTianShi').textContent = data.tianShiSum;
        document.getElementById('resultShangGua').textContent = data.shangGua;
        document.getElementById('resultXiaGua').textContent = data.xiaGua;
        document.getElementById('resultDongYao').textContent = data.dongYao;
        document.getElementById('resultBianGua').textContent = data.bianGua;
        document.getElementById('resultGanZhi').textContent = data.lunarInfo.dayStemBranch;
        
        // 显示匹配状态
        const statusColor = data.fullMatch ? '#4CAF50' : '#FF9800';
        document.getElementById('resultStatus').innerHTML = 
            `<span style="color:${statusColor}; font-weight:bold">
                ${data.fullMatch ? '✓ 天地人和' : '△ 部分匹配'}
            </span>`;
        
        // 显示卦象解释
        const shangExplanation = BaGuaUtils.getGuaExplanation(data.shangGua);
        const xiaExplanation = BaGuaUtils.getGuaExplanation(data.xiaGua);
        const bianExplanation = BaGuaUtils.getGuaExplanation(data.bianGua);
        const yaoExplanation = BaGuaUtils.getDongYaoExplanation(data.dongYao);
        
        document.getElementById('guaExplanation').innerHTML = `
            <h4>卦象详解：</h4>
            <p><strong>上卦（${data.shangGua}）：</strong> ${shangExplanation}</p>
            <p><strong>下卦（${data.xiaGua}）：</strong> ${xiaExplanation}</p>
            <p><strong>变卦（${data.bianGua}）：</strong> ${bianExplanation}</p>
            <p><strong>动爻（第${data.dongYao}爻）：</strong> ${yaoExplanation}</p>
            ${data.fullMatch ? 
                '<p style="color:#4CAF50; font-weight:bold">✓ 天时、地利、人和三者兼备，时机有利！</p>' : 
                '<p style="color:#FF9800">△ 需关注匹配条件，时机可能不完全成熟。</p>'
            }
        `;
        
        // 显示完整描述
        document.getElementById('fullDescription').textContent = data.description;
        
        // 滚动到结果区域
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // 加载历史记录
    function loadHistory() {
        const history = StorageUtils.getHistory();
        historyContainer.innerHTML = '';
        
        if (history.length === 0) {
            historyContainer.innerHTML = '<p style="color:#666; text-align:center;">暂无历史记录</p>';
            return;
        }
        
        history.forEach((item, index) => {
            const result = item.result;
            const card = document.createElement('div');
            card.className = 'history-card';
            card.innerHTML = `
                <div class="history-header">
                    <span>#${index + 1}</span>
                    <span>${new Date(item.timestamp).toLocaleString()}</span>
                </div>
                <div class="history-content">
                    <p><strong>${result.name}</strong> (${result.date})</p>
                    <p>上卦：${result.shangGua} | 下卦：${result.xiaGua}</p>
                    <p>动爻：${result.dongYao} | 变卦：${result.bianGua}</p>
                    <p>状态：${result.fullMatch ? '✓ 匹配' : '△ 待定'}</p>
                </div>
                <button onclick="viewHistoryDetail(${index})" class="view-btn">查看详情</button>
            `;
            historyContainer.appendChild(card);
        });
    }
    
    // 清空历史记录
    function clearHistory() {
        if (confirm('确定要清空所有历史记录吗？')) {
            StorageUtils.clearHistory();
            loadHistory();
        }
    }
    
    // 查看历史详情（全局函数）
    window.viewHistoryDetail = function(index) {
        const history = StorageUtils.getHistory();
        if (history[index]) {
            displayResult(history[index].result);
        }
    };
});