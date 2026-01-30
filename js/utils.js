// js/utils.js - 工具函数
class DateUtils {
    // 获取当前日期字符串
    static getCurrentDate() {
        const now = new Date();
        return now.toISOString().split('T')[0];
    }

    // 格式化日期
    static formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day);
    }
}

class BaGuaUtils {
    // 获取卦象解释
    static getGuaExplanation(guaName) {
        const explanations = {
            '乾': '䷀ 乾为天：元亨利贞。象征天，代表刚健、创始、领导。',
            '坤': '䷁ 坤为地：元亨，利牝马之贞。象征地，代表柔顺、承载、包容。',
            '兑': '䷹ 兑为泽：亨，利贞。象征泽，代表喜悦、交流、沟通。',
            '离': '䷝ 离为火：利贞，亨。畜牝牛，吉。象征火，代表光明、美丽、依附。',
            '震': '䷲ 震为雷：亨。震来虩虩，笑言哑哑。象征雷，代表行动、震动、奋发。',
            '巽': '䷸ 巽为风：小亨，利有攸往，利见大人。象征风，代表顺从、进入、渗透。',
            '坎': '䷜ 坎为水：习坎，有孚，维心亨，行有尚。象征水，代表险陷、智慧、流动。',
            '艮': '䷳ 艮为山：艮其背，不获其身，行其庭，不见其人，无咎。象征山，代表停止、稳重、静止。'
        };
        return explanations[guaName] || '此卦象需结合具体情况分析。';
    }

    // 获取动爻解释
    static getDongYaoExplanation(yao) {
        const explanations = {
            1: '初爻：事物初始阶段，需谨慎行事。',
            2: '二爻：事物发展期，宜积极进取。',
            3: '三爻：事物转折点，需注意风险。',
            4: '四爻：接近成功，但仍有挑战。',
            5: '五爻：鼎盛时期，把握时机。',
            6: '上爻：事物终结，总结反思。'
        };
        return explanations[yao] || '';
    }
}

class StorageUtils {
    // 保存历史记录
    static saveHistory(result) {
        try {
            const history = this.getHistory();
            history.unshift({
                timestamp: new Date().toISOString(),
                result: result
            });
            
            // 只保留最近的50条记录
            if (history.length > 50) {
                history.pop();
            }
            
            localStorage.setItem('bagua_history', JSON.stringify(history));
            return true;
        } catch (e) {
            console.error('保存历史记录失败:', e);
            return false;
        }
    }

    // 获取历史记录
    static getHistory() {
        try {
            const history = localStorage.getItem('bagua_history');
            return history ? JSON.parse(history) : [];
        } catch (e) {
            console.error('读取历史记录失败:', e);
            return [];
        }
    }

    // 清空历史记录
    static clearHistory() {
        localStorage.removeItem('bagua_history');
    }
}

// 导出
window.DateUtils = DateUtils;
window.BaGuaUtils = BaGuaUtils;
window.StorageUtils = StorageUtils;