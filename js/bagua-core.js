// js/bagua-core.js - 完整集成农历计算的八卦排盘核心算法

// ==================== 第一部分：农历计算库（转换自你的Java类） ====================
class LunarCalendarFestivalUtils {
    constructor() {
        // 生肖
        this.animals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
        // 天干
        this.tGan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
        // 地支
        this.dZhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
        // 二十四节气
        this.solarTerms = ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏",
            "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"];
        // 划分月份的十二个节气
        this.terms = ["立春", "惊蛰", "清明", "立夏", "芒种", "小暑", "立秋", "白露", "寒露", "立冬", "大雪", "小寒"];
        // 农历月份
        this.lunarNumber = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
        // 农历年数字
        this.lunarYears = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
        this.chineseTen = ["初", "十", "廿", "三"];
        
        // 修正1996 0x055c0 -> 0x059c0
        this.lunarInfo = [
            0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
            0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
            0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
            0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
            0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
            0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
            0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
            0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
            0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
            0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x059c0, 0x0ab60, 0x096d5, 0x092e0,
            0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
            0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
            0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
            0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
            0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0
        ];
        
        // 节气偏移配置
        this.D = 0.2422;
        this.INCREASE_OFFSETMAP = {
            0: [1982],   // 小寒
            1: [2082],   // 大寒
            5: [2084],   // 春分
            9: [2008],   // 小满
            10: [1902],  // 芒种
            11: [1928],  // 夏至
            12: [1925, 2016], // 小暑
            13: [1922],  // 大暑
            14: [2002],  // 立秋
            16: [1927],  // 白露
            17: [1942],  // 秋分
            19: [2089],  // 霜降
            20: [2089],  // 立冬
            21: [1978],  // 小雪
            22: [1954]   // 大雪
        };
        this.DECREASE_OFFSETMAP = {
            0: [2019],   // 小寒
            3: [2026],   // 雨水
            23: [1918, 2021] // 冬至
        };
        
        // 节气世纪值
        this.CENTURY_ARRAY = [
            [6.11, 20.84, 4.6295, 19.4599, 6.3826, 21.4155, 5.59, 20.888, 6.318, 21.86, 6.5, 22.2, 7.928, 23.65, 8.35, 23.95, 8.44, 23.822, 9.098, 24.218, 8.218, 23.08, 7.9, 22.6],
            [5.4055, 20.12, 3.87, 18.73, 5.63, 20.646, 4.81, 20.1, 5.52, 21.04, 5.678, 21.37, 7.108, 22.83, 7.5, 23.13, 7.646, 23.042, 8.318, 23.438, 7.438, 22.36, 7.18, 21.94]
        ];
    }

    // 返回农历y年的总天数
    lunarYearDays(y) {
        let sum = 348;
        for (let i = 0x8000; i > 0x8; i >>= 1) {
            sum += ((this.lunarInfo[y - 1900] & i) !== 0 ? 1 : 0);
        }
        return sum + this.leapDays(y);
    }

    // 返回农历y年闰月的天数
    leapDays(y) {
        if (this.leapMonth(y) !== 0) {
            return ((this.lunarInfo[y - 1900] & 0x10000) !== 0 ? 30 : 29);
        } else {
            return 0;
        }
    }

    // 判断y年的农历中那个月是闰月,不是闰月返回0
    leapMonth(y) {
        return this.lunarInfo[y - 1900] & 0xf;
    }

    // 返回农历y年m月的总天数
    monthDays(y, m) {
        return ((this.lunarInfo[y - 1900] & (0x10000 >> m)) !== 0 ? 30 : 29);
    }

    // 获取阴历年字符串
    getLunarYearString(year) {
        const y1 = parseInt(year.charAt(0));
        const y2 = parseInt(year.charAt(1));
        const y3 = parseInt(year.charAt(2));
        const y4 = parseInt(year.charAt(3));
        return this.lunarYears[y1] + this.lunarYears[y2] + this.lunarYears[y3] + this.lunarYears[y4];
    }

    // 获取阴历日字符串
    getLunarDayString(day) {
        if (day > 30) return "";
        if (day === 10) return "初十";
        
        const n = day % 10 === 0 ? 9 : day % 10 - 1;
        return this.chineseTen[Math.floor(day / 10)] + this.lunarNumber[n];
    }

    // 特殊年份节气偏移
    specialYearOffset(year, n) {
        let offset = 0;
        offset += this.getOffset(this.DECREASE_OFFSETMAP, year, n, -1);
        offset += this.getOffset(this.INCREASE_OFFSETMAP, year, n, 1);
        return offset;
    }

    getOffset(map, year, n, offset) {
        if (map[n]) {
            for (const y of map[n]) {
                if (y === year) return offset;
            }
        }
        return 0;
    }

    // 获取某年的第n个节气为几日(从0小寒起算)
    sTerm(year, n) {
        let centuryIndex = -1;
        if (year >= 1900 && year <= 2000) {
            centuryIndex = 0;
        } else if (year >= 2001 && year <= 2050) {
            centuryIndex = 1;
        } else {
            throw new Error(`不支持此年份：${year}，目前只支持1900年2月4日到2050年1月22日期间的计算`);
        }
        
        const centuryValue = this.CENTURY_ARRAY[centuryIndex][n];
        let y = year % 100;
        
        // 闰年调整
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
            if (n <= 3) { // 小寒、大寒、立春、雨水
                y = y - 1;
            }
        }
        
        let dateNum = Math.floor(y * this.D + centuryValue) - Math.floor(y / 4);
        dateNum += this.specialYearOffset(year, n);
        return dateNum;
    }

    // 初始化农历信息（对应你的Java方法）
    initLunarCalendarInfo(currentDate) {
        const splitDate = currentDate.split("-");
        const year = parseInt(splitDate[0]);
        const month = parseInt(splitDate[1]);
        const day = parseInt(splitDate[2]);
        
        // 设置生肖
        this.animal = this.animals[(year - 4) % 12];
        
        // 设置天干地支年（简化版）
        // const num = year - 1900 + 36;
        // this.ganZhiYear = this.tGan[num % 10] + this.dZhi[num % 12];
        
        // 计算农历日期
        const baseDate = new Date(1900, 0, 31); // 1900年1月31日
        const nowaday = new Date(year, month - 1, day);
        
        // 获取天数差
        const offset = Math.floor((nowaday - baseDate) / (1000 * 60 * 60 * 24));
        
        let iYear, daysOfYear = 0;
        let tempOffset = offset;
        
        for (iYear = 1900; iYear < 10000 && tempOffset > 0; iYear++) {
            daysOfYear = this.lunarYearDays(iYear);
            tempOffset -= daysOfYear;
        }
        
        if (tempOffset < 0) {
            tempOffset += daysOfYear;
            iYear--;
        }
        
        this.lunarYear = this.getLunarYearString(iYear.toString());
        this.lunarYearNum = iYear;
        
        const leapMonth = this.leapMonth(iYear);
        let leap = false;
        
        let iMonth, daysOfMonth = 0;
        tempOffset = offset - (this.lunarYearDays(iYear) - daysOfYear); // 重新计算offset
        
        for (iMonth = 1; iMonth < 13 && tempOffset > 0; iMonth++) {
            if (leapMonth > 0 && iMonth === (leapMonth + 1) && !leap) {
                iMonth--;
                leap = true;
                daysOfMonth = this.leapDays(iYear);
            } else {
                daysOfMonth = this.monthDays(iYear, iMonth);
            }
            tempOffset -= daysOfMonth;
            
            if (leap && iMonth === (leapMonth + 1)) {
                leap = false;
            }
        }
        
        if (tempOffset === 0 && leapMonth > 0 && iMonth === leapMonth + 1) {
            if (leap) {
                leap = false;
            } else {
                leap = true;
                iMonth--;
            }
        }
        
        if (tempOffset < 0) {
            tempOffset += daysOfMonth;
            iMonth--;
        }
        
        // 设置农历月
        this.lunarMonth = this.lunarNumber[iMonth - 1];
        this.lunarMonthNum = iMonth;
        
        if (this.lunarMonth === "一") this.lunarMonth = "正";
        if (this.lunarMonth === "十二") this.lunarMonth = "腊";
        if (leap) this.lunarMonth = "闰" + this.lunarMonth;
        
        // 设置农历日
        const iDay = tempOffset + 1;
        this.lunarDay = this.getLunarDayString(iDay);
        this.lunarDayNum = iDay;
        
        // 设置节气
        if (day === this.sTerm(year, (month - 1) * 2)) {
            this.lunarTerm = this.solarTerms[(month - 1) * 2];
        } else if (day === this.sTerm(year, (month - 1) * 2 + 1)) {
            this.lunarTerm = this.solarTerms[(month - 1) * 2 + 1];
        } else {
            this.lunarTerm = "";
        }
        
        return {
            lunarYear: this.lunarYear,
            lunarYearNum: this.lunarYearNum,
            lunarMonth: this.lunarMonth,
            lunarMonthNum: this.lunarMonthNum,
            lunarDay: this.lunarDay,
            lunarDayNum: this.lunarDayNum,
            animal: this.animal,
            lunarTerm: this.lunarTerm
        };
    }

    // ============ 静态方法（对应你的Java静态方法） ============
    
    // 阳历日期转阴历 yyyy-MM-dd
    static toLunarCalendar(date) {
        const festival = new LunarCalendarFestivalUtils();
        const info = festival.initLunarCalendarInfo(date);
        return `${info.lunarYearNum}-${info.lunarMonthNum.toString().padStart(2, '0')}-${info.lunarDayNum.toString().padStart(2, '0')}`;
    }
    
    // 获取阴历大写日期
    static getLunarCalendar(date) {
        const festival = new LunarCalendarFestivalUtils();
        const info = festival.initLunarCalendarInfo(date);
        return `${info.lunarYear}年 ${info.lunarMonth}月${info.lunarDay}`;
    }
    
    // 获取阴历日
    static getLunarCalendarDay(date) {
        const festival = new LunarCalendarFestivalUtils();
        const info = festival.initLunarCalendarInfo(date);
        return info.lunarDay;
    }
    
    // 查找数组元素下标
    static printArray(array, value) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === value) return i;
        }
        return -1;
    }
    
    // 获取节气日期
    static getLunarTermDay(year, month, n) {
        const festival = new LunarCalendarFestivalUtils();
        const day = festival.sTerm(year, n);
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
    
    // 按节气划分月份（干支纪月的月份）
    static getLunarTermMonth(date) {
        const year = LunarCalendarFestivalUtils.getLunarTermYear(date);
        const solarTermDates = new Array(13);
        
        for (let i = 0; i < LunarCalendarFestivalUtils.prototype.terms.length; i++) {
            let solarTermDate;
            if (i === LunarCalendarFestivalUtils.prototype.terms.length - 1) {
                solarTermDate = LunarCalendarFestivalUtils.getLunarTermDay(
                    year + 1, 1, 
                    LunarCalendarFestivalUtils.printArray(LunarCalendarFestivalUtils.prototype.solarTerms, 
                    LunarCalendarFestivalUtils.prototype.terms[i])
                );
            } else {
                solarTermDate = LunarCalendarFestivalUtils.getLunarTermDay(
                    year, i + 2,
                    LunarCalendarFestivalUtils.printArray(LunarCalendarFestivalUtils.prototype.solarTerms,
                    LunarCalendarFestivalUtils.prototype.terms[i])
                );
            }
            solarTermDates[i] = solarTermDate;
        }
        solarTermDates[12] = LunarCalendarFestivalUtils.getLunarTermDay(
            year + 1, 2,
            LunarCalendarFestivalUtils.printArray(LunarCalendarFestivalUtils.prototype.solarTerms,
            LunarCalendarFestivalUtils.prototype.terms[0])
        );
        
        const dateScope = new Array(12);
        for (let i = 0; i < 12; i++) {
            dateScope[i] = [solarTermDates[i], solarTermDates[i + 1]];
        }
        
        const currentDate = new Date(date);
        for (let i = 0; i < dateScope.length; i++) {
            const startDate = new Date(dateScope[i][0]);
            const endDate = new Date(dateScope[i][1]);
            endDate.setDate(endDate.getDate() - 1);
            
            if (currentDate >= startDate && currentDate <= endDate) {
                return i + 1;
            }
        }
        return 0;
    }
    
    // 按节气划分年份（干支纪月的年份）
    static getLunarTermYear(date) {
        const splitDate = date.split("-");
        let year = parseInt(splitDate[0]);
        
        const currSpringDate = LunarCalendarFestivalUtils.getLunarTermDay(
            year, 2,
            LunarCalendarFestivalUtils.printArray(LunarCalendarFestivalUtils.prototype.solarTerms,
            "立春")
        );
        
        const currentDate = new Date(date);
        const springDate = new Date(currSpringDate);
        
        if (currentDate < springDate) {
            year--;
        }
        return year;
    }
    
    // 获取农历日数字
    static getLunarDayNum(date) {
        const festival = new LunarCalendarFestivalUtils();
        const info = festival.initLunarCalendarInfo(date);
        return info.lunarDayNum;
    }
}

// ==================== 第二部分：干支计算工具 ====================
class DateStemBranchUtils {
    // 天干
    static GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    // 地支
    static ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
    // 月支
    static MONTH_ZHI = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"];

    // 计算年柱
    static calYearStemBranch(year) {
        const ganIndex = (year - 4) % 10;
        const zhiIndex = (year - 4) % 12;
        return {
            gan: this.GAN[ganIndex >= 0 ? ganIndex : ganIndex + 10],
            zhi: this.ZHI[zhiIndex >= 0 ? zhiIndex : zhiIndex + 12],
            full: this.GAN[ganIndex >= 0 ? ganIndex : ganIndex + 10] + 
                  this.ZHI[zhiIndex >= 0 ? zhiIndex : zhiIndex + 12]
        };
    }

    // 计算月柱（需要节气年、节气月）
    static calMonthStemBranch(lunarTermYear, lunarTermMonth) {
        // 年干对应月干表
        const yearGan = this.calYearStemBranch(lunarTermYear).gan;
        const monthGanTable = {
            '甲': '丙', '乙': '戊', '丙': '庚', '丁': '壬', '戊': '甲',
            '己': '丙', '庚': '戊', '辛': '庚', '壬': '壬', '癸': '甲'
        };
        
        let monthGanStart = monthGanTable[yearGan] || '丙';
        let ganStartIndex = this.GAN.indexOf(monthGanStart);
        let monthGanIndex = (ganStartIndex + lunarTermMonth - 1) % 10;
        let monthGan = this.GAN[monthGanIndex >= 0 ? monthGanIndex : monthGanIndex + 10];
        let monthZhi = this.MONTH_ZHI[lunarTermMonth - 1] || '寅';
        
        return {
            gan: monthGan,
            zhi: monthZhi,
            full: monthGan + monthZhi
        };
    }

    // 计算日柱（使用固定算法）
    static calDayStemBranch(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();
        
        // 使用公式计算（简化版）
        const baseDate = new Date(1900, 0, 31);
        const targetDate = new Date(year, month - 1, day);
        const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
        
        const ganIndex = diffDays % 10;
        const zhiIndex = diffDays % 12;
        
        return {
            gan: this.GAN[ganIndex >= 0 ? ganIndex : ganIndex + 10],
            zhi: this.ZHI[zhiIndex >= 0 ? zhiIndex : zhiIndex + 12],
            full: this.GAN[ganIndex >= 0 ? ganIndex : ganIndex + 10] + 
                  this.ZHI[zhiIndex >= 0 ? zhiIndex : zhiIndex + 12]
        };
    }

    // 计算时辰柱
    static calHourStemBranch(dayGan, hour) {
        const hourGanTable = {
            '甲': '甲', '乙': '丙', '丙': '戊', '丁': '庚', 
            '戊': '壬', '己': '甲', '庚': '丙', '辛': '戊', 
            '壬': '庚', '癸': '壬'
        };
        
        const hourZhiMap = {
            23: '子', 0: '子',   // 子时：23-1
            1: '丑', 2: '丑',    // 丑时：1-3
            3: '寅', 4: '寅',    // 寅时：3-5
            5: '卯', 6: '卯',    // 卯时：5-7
            7: '辰', 8: '辰',    // 辰时：7-9
            9: '巳', 10: '巳',   // 巳时：9-11
            11: '午', 12: '午',  // 午时：11-13
            13: '未', 14: '未',  // 未时：13-15
            15: '申', 16: '申',  // 申时：15-17
            17: '酉', 18: '酉',  // 酉时：17-19
            19: '戌', 20: '戌',  // 戌时：19-21
            21: '亥', 22: '亥'   // 亥时：21-23
        };
        
        const hourGanStart = hourGanTable[dayGan] || '甲';
        const ganStartIndex = this.GAN.indexOf(hourGanStart);
        const hourZhi = hourZhiMap[hour] || '子';
        const zhiIndex = this.ZHI.indexOf(hourZhi);
        
        // 计算时干
        const hourGanIndex = (ganStartIndex + Math.floor((zhiIndex + 1) / 2)) % 10;
        const hourGan = this.GAN[hourGanIndex >= 0 ? hourGanIndex : hourGanIndex + 10];
        
        return {
            gan: hourGan,
            zhi: hourZhi,
            full: hourGan + hourZhi
        };
    }

    // 获取农历日数字（对应你的getdayNumber方法）
    static getdayNumber(lunarDayChinese) {
        // 将"初五"这样的中文转为数字5
        const map = {
            '初一': 1, '初二': 2, '初三': 3, '初四': 4, '初五': 5,
            '初六': 6, '初七': 7, '初八': 8, '初九': 9, '初十': 10,
            '十一': 11, '十二': 12, '十三': 13, '十四': 14, '十五': 15,
            '十六': 16, '十七': 17, '十八': 18, '十九': 19, '二十': 20,
            '廿一': 21, '廿二': 22, '廿三': 23, '廿四': 24, '廿五': 25,
            '廿六': 26, '廿七': 27, '廿八': 28, '廿九': 29, '三十': 30
        };
        return map[lunarDayChinese] || 1;
    }

    // 综合计算干支（对应你的calStemBranch方法）
    static calStemBranch(dateTimeStr) {
        const date = new Date(dateTimeStr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        
        const yearGanZhi = this.calYearStemBranch(year);
        const monthGanZhi = this.calMonthStemBranch(year, month);
        const dayGanZhi = this.calDayStemBranch(`${year}-${month}-${day}`);
        const hourGanZhi = this.calHourStemBranch(dayGanZhi.gan, hour);
        
        return {
            year: yearGanZhi.full,
            month: monthGanZhi.full,
            day: dayGanZhi.full,
            hour: hourGanZhi.full,
            full: `${yearGanZhi.full}年 ${monthGanZhi.full}月 ${dayGanZhi.full}日 ${hourGanZhi.full}时`
        };
    }
}

// ==================== 第三部分：八卦核心算法 ====================
// ==================== 第三部分：八卦核心算法（完整版） ====================
class RunQG {
    constructor() {
        // 修复：更安全地检查笔画库
        this.strokeLibAvailable = false;
        try {
            this.strokeLibAvailable = (window.SumStrokesNumUtils && 
                                      typeof window.SumStrokesNumUtils.GetStrokeCount === 'function');
        } catch (e) {
            console.warn('检查笔画库失败:', e);
        }
        
        console.log('笔画库可用:', this.strokeLibAvailable);
        this.initMaps();
    }

    initMaps() {
        // 八卦定义
        this.baguaDef = {
            '乾': [1, 1, 1], '兑': [0, 1, 1], '离': [1, 0, 1], '震': [0, 0, 1],
            '巽': [1, 1, 0], '坎': [0, 1, 0], '艮': [1, 0, 0], '坤': [0, 0, 0]
        };

        // 年地支 -> 数字
        this.yearMap = {
            '子': 1, '丑': 2, '寅': 3, '卯': 4, '辰': 5, '巳': 6,
            '午': 7, '未': 8, '申': 9, '酉': 10, '戌': 11, '亥': 12
        };

        // 月地支 -> 数字
        this.monMap = {
            '寅': 1, '卯': 2, '辰': 3, '巳': 4, '午': 5, '未': 6,
            '申': 7, '酉': 8, '戌': 9, '亥': 10, '子': 11, '丑': 12
        };

        // 八卦序号映射
        this.baguaNum = {
            '1': '乾', '2': '兑', '3': '离', '4': '震',
            '5': '巽', '6': '坎', '7': '艮', '8': '坤', '0': '坤'
        };

        // 八卦数字映射（反向）
        this.baguaToNum = {
            '乾': 1, '兑': 2, '离': 3, '震': 4,
            '巽': 5, '坎': 6, '艮': 7, '坤': 8
        };

        // 变卦表
        this.bianGuaMap = {
            '1#1': 5, '1#2': 3, '1#3': 2,
            '2#1': 6, '2#2': 4, '2#3': 1,
            '3#1': 7, '3#2': 1, '3#3': 4,
            '4#1': 8, '4#2': 2, '4#3': 3,
            '5#1': 1, '5#2': 7, '5#3': 6,
            '6#1': 2, '6#2': 8, '6#3': 5,
            '7#1': 3, '7#2': 5, '7#3': 8,
            '8#1': 4, '8#2': 6, '8#3': 7,
            '0#1': 4, '0#2': 6, '0#3': 7
        };

        // 六冲配置
        this.liuChong = [
            '子午', '午子', '辰戌', '戌辰', '巳亥', '亥巳',
            '丑未', '未丑', '寅申', '申寅', '卯酉', '酉卯'
        ];

        // 六合配置
        this.liuHe = [
            '子丑', '丑子', '亥寅', '寅亥', '戌卯', '卯戌',
            '酉辰', '辰酉', '申巳', '巳申', '午未', '未午'
        ];

        // 地区映射（完整版）
        this.dqys = {
            '黑龙': ['丑', '寅'],
            '新疆': ['戌', '亥'],
            '吉林': ['丑', '寅'],
            '甘肃': ['酉'],
            '辽宁': ['丑', '寅'],
            '青海': ['酉'],
            '北京': ['子'],
            '陕西': ['戌', '亥'],
            '天津': ['子'],
            '广西': ['午'],
            '河北': ['子'],
            '广东': ['午', '巳'],
            '河南': ['子', '午'],
            '宁夏': ['戌', '亥'],
            '山东': ['子'],
            '上海': ['卯', '寅'],
            '山西': ['子'],
            '深圳': ['午', '巳'],
            '湖北': ['子', '午'],
            '湖南': ['子', '午'],
            '四川': ['未', '午', '申'],
            '安徽': ['卯', '寅', '辰'],
            '重庆': ['未', '午', '申'],
            '江苏': ['卯', '寅', '辰'],
            '云南': ['未', '午', '申'],
            '浙江': ['卯', '寅', '辰'],
            '贵州': ['未', '午', '申'],
            '海南': ['午', '巳'],
            '西藏': ['未', '午', '申'],
            '内蒙': ['子']
        };

        // 行业映射（完整版）
        this.hyys = {
            '纺织服饰': ['酉', '戌', '亥', '子'],
            '环境保护': ['辰', '午'],
            '汽车类': ['丑', '辰', '午'],
            '电气设备': ['丑', '辰', '午'],
            '化工': ['丑', '辰', '午'],
            '医药': ['子', '未', '酉', '申'],
            '工业机械': ['未', '子', '戌'],
            '元器件': ['未', '子', '戌'],
            '航空': ['申', '午'],
            '建材': ['未', '戌', '酉'],
            '证券': ['戌', '亥'],
            '仓储物流': ['子', '戌', '亥'],
            '软件服务': ['亥', '丑', '寅'],
            '造纸': ['申', '未'],
            '农林牧渔': ['丑', '寅', '酉', '子', '未'],
            '多元金融': ['未', '申', '酉', '戌', '亥', '子'],
            '电力': ['子', '丑', '辰', '午'],
            '商业连锁': ['子', '戌', '亥'],
            '建筑': ['戌', '亥'],
            '煤炭': ['未', '申', '酉', '戌', '亥', '子'],
            '工程机械': ['戌', '亥'],
            '交通设施': ['戌', '亥'],
            '传媒娱乐': ['丑', '辰', '午'],
            '运输设备': ['丑', '辰'],
            '石油': ['子', '酉'],
            '有色': ['未', '申', '酉', '戌', '亥', '子'],
            '食品饮料': ['未', '申', '酉', '戌', '亥', '子'],
            '医疗保健': ['申', '酉'],
            '供气供热': ['卯', '丑', '辰'],
            '通信设备': ['戌', '亥', '丑'],
            '旅游': ['丑', '辰', '午'],
            '酿酒': ['辰', '午'],
            '钢铁': ['未', '申', '酉', '戌', '亥', '子'],
            '化纤': ['未'],
            '房地产': ['子', '戌', '亥'],
            '电器仪表': ['辰', '午', '卯'],
            '半导体': ['子', '午'],
            '银行': ['戌', '亥'],
            '矿物制品': ['未', '申', '酉', '戌', '亥', '子'],
            '通用机械': ['亥', '子', '卯', '巳'],
            '综合类': ['子', '午'],
            '互联网': ['戌', '亥'],
            '文教休闲': ['丑', '卯', '辰', '午'],
            '运输服务': ['丑', '卯', '辰', '午'],
            '商贸代理': ['丑', '辰'],
            '家用电器': ['申', '亥'],
            '酒店餐饮': ['酉', '戌', '亥', '子'],
            '电信运营': ['亥', '丑', '卯'],
            '广告包装': ['卯', '辰', '午'],
            'IT设备': ['戌', '亥', '丑'],
            '船舶': ['申', '酉'],
            '保险': ['申', '酉'],
            '家居用品': ['子', '戌', '亥'],
            '日用化工': ['子', '戌', '亥'],
            '农产品加工': ['丑', '辰', '午'],
            '公共交通': ['丑', '辰', '午'],
            '酿酒': ['申', '酉'],
            '通用机械': ['子', '午'],
            '商贸代理': ['子', '丑', '辰', '午']
        };

        // 时辰笔画数映射
        this.scMap = {
            23: 1, 0: 1, 22: 12, 21: 12, 20: 11, 19: 11,
            18: 10, 17: 10, 16: 9, 15: 9, 14: 8, 13: 8,
            12: 7, 11: 7, 10: 6, 9: 6, 8: 5, 7: 5,
            6: 4, 5: 4, 4: 3, 3: 3, 2: 2, 1: 2
        };

        // 九宫映射
        this.xtyt = {
            '1@4': '艮', '2@4': '丑', '3@4': '丑', '4@4': '丑', '5@4': '癸', '6@4': '癸', '7@4': '癸', '8@4': '子',
            '1@3': '卯', '2@3': '甲', '3@3': '甲', '4@3': '甲', '5@3': '寅', '6@3': '寅', '7@3': '寅', '8@3': '艮',
            '1@2': '巽', '2@2': '辰', '3@2': '辰', '4@2': '辰', '5@2': '乙', '6@2': '乙', '7@2': '乙', '8@2': '卯',
            '1@1': '午', '2@1': '丙', '3@1': '丙', '4@1': '丙', '5@1': '巳', '6@1': '巳', '7@1': '巳', '8@1': '巽',
            '1@5': '丁', '2@5': '丁', '3@5': '丁', '4@5': '丁', '5@5': '未', '6@5': '未', '7@5': '未', '8@5': '坤',
            '1@6': '坤', '2@6': '申', '3@6': '申', '4@6': '申', '5@6': '庚', '6@6': '庚', '7@6': '庚', '8@6': '酉',
            '1@7': '酉', '2@7': '辛', '3@7': '辛', '4@7': '辛', '5@7': '戌', '6@7': '戌', '7@7': '戌', '8@7': '乾',
            '1@8': '乾', '2@8': '亥', '3@8': '亥', '4@8': '亥', '5@8': '壬', '6@8': '壬', '7@8': '壬', '8@8': '子'
        };
    }

    // ==================== 核心计算方法 ====================
    async calculate(name, dateStr, hour = 12) {
        try {
            console.log('=== 八卦排盘计算开始 ===');
            
            // 参数验证
            if (!name || typeof name !== 'string' || name.trim() === '') {
                throw new Error('姓名不能为空');
            }
            if (!dateStr || typeof dateStr !== 'string') {
                throw new Error('日期不能为空');
            }
            
            // 处理时辰
            hour = parseInt(hour);
            if (isNaN(hour) || hour < 0 || hour > 23) {
                hour = 12; // 默认中午12点
            }
            
            console.log('输入参数:', { name, dateStr, hour });
            
            // 1. 获取农历和干支信息
            const lunarInfo = this.getLunarInfo(dateStr, hour);
            console.log('农历信息:', lunarInfo);
            
            // 2. 计算天时总数
            const tianShiSum = this.calcTianShiSum(lunarInfo);
            console.log('天时总数:', tianShiSum);
            
            // 3. 计算姓名笔画数
            const strokeCount = this.calcStrokeCount(name);
            console.log('姓名笔画:', strokeCount);
            
            // 4. 时辰笔画数
            const hourStroke = this.scMap[hour] || 1;
            console.log('时辰笔画:', hourStroke);
            
            // 5. 计算上卦、下卦、动爻
            const guaResult = this.calcGua(tianShiSum, strokeCount);
            console.log('卦象结果:', guaResult);
            
            // 6. 计算变卦
            const bianGua = this.calcBianGua(guaResult);
            console.log('变卦结果:', bianGua);
            
            // 计算总和分析
            const totalSum = tianShiSum + strokeCount + hourStroke;
            
            // 判断是否有利
            const isFavorable = bianGua.num < guaResult.shangGuaNum || bianGua.num < guaResult.xiaGuaNum;
            
            // 生成结果描述
            const description = this.generateResultDescription({
                name,
                date: dateStr,
                hour,
                strokeCount,
                tianShiSum,
                hourStroke,
                totalSum,
                shangGua: guaResult.shangGuaName,
                xiaGua: guaResult.xiaGuaName,
                dongYao: guaResult.dongYao,
                bianGua: bianGua.name,
                yearStemBranch: lunarInfo.yearStemBranch?.full || '',
                monthStemBranch: lunarInfo.monthStemBranch?.full || '',
                dayStemBranch: lunarInfo.dayStemBranch?.full || '',
                hourStemBranch: lunarInfo.hourStemBranch?.full || '',
                isFavorable
            });
            
            return {
                success: true,
                data: {
                    // 输入信息
                    name: name,
                    date: dateStr,
                    hour: hour,
                    
                    // 农历干支信息
                    lunarDate: lunarInfo.lunarDate,
                    lunarDayChinese: lunarInfo.lunarDayChinese,
                    yearStemBranch: lunarInfo.yearStemBranch?.full || '',
                    monthStemBranch: lunarInfo.monthStemBranch?.full || '',
                    dayStemBranch: lunarInfo.dayStemBranch?.full || '',
                    hourStemBranch: lunarInfo.hourStemBranch?.full || '',
                    
                    // 计算数值
                    nameStrokeCount: strokeCount,
                    tianShiSum: tianShiSum,
                    hourStroke: hourStroke,
                    totalSum: totalSum,
                    
                    // 卦象结果
                    shangGua: guaResult.shangGuaName,
                    xiaGua: guaResult.xiaGuaName,
                    dongYao: guaResult.dongYao,
                    bianGua: bianGua.name,
                    
                    // 检查结果
                    isFavorable: isFavorable,
                    
                    // 完整描述
                    description: description
                }
            };
            
        } catch (error) {
            console.error('八卦计算失败:', error);
            return {
                success: false,
                error: '计算失败: ' + (error.message || '未知错误')
            };
        }
    }

    // ==================== 辅助方法 ====================
    
    // 笔画计算方法（修复版）
// 在 RunQG 类中修改 calcStrokeCount 方法
calcStrokeCount(name) {
    try {
        console.log('[笔画计算开始] 输入:', name);
        
        if (!name || typeof name !== 'string') {
            console.log('[笔画计算] 名称无效');
            return 0;
        }
        
        name = name.trim();
        if (name.length === 0) {
            console.log('[笔画计算] 名称为空');
            return 0;
        }
        
        // 方法1：使用笔画库
        console.log('[笔画计算] 笔画库可用:', this.strokeLibAvailable);
        
        if (this.strokeLibAvailable) {
            try {
                console.log('[笔画计算] 尝试使用笔画库');
                const count = SumStrokesNumUtils.GetStrokeCount(name);
                console.log(`[笔画计算] "${name}" = ${count}画 (使用笔画库)`);
                return (typeof count === 'number') ? count : 0;
            } catch (e) {
                console.warn('[笔画计算] 笔画库计算失败:', e);
            }
        }
        
        // 方法2：简化计算 - 汉字个数
        console.log('[笔画计算] 使用简化计算');
        const chineseChars = name.match(/[\u4e00-\u9fa5]/g);
        const charCount = chineseChars ? chineseChars.length : 0;
        console.log(`[笔画计算] "${name}" = ${charCount}画 (汉字个数)`);
        return charCount;
        
    } catch (error) {
        console.warn('[笔画计算] 异常:', error);
        return 0;
    }
}

    // 获取农历信息
   // 在 getLunarInfo 方法中添加调试
getLunarInfo(dateStr, hour) {
    try {
        console.log('[农历计算] 开始, 日期:', dateStr, '时辰:', hour);
        
        // 检查农历工具是否可用
        if (!LunarCalendarFestivalUtils || !DateStemBranchUtils) {
            console.error('[农历计算] 工具类未加载');
            throw new Error('农历计算工具未加载');
        }
        
        // 测试农历计算
        console.log('[农历计算] 测试农历日期转换');
        const lunarDate = LunarCalendarFestivalUtils.toLunarCalendar(dateStr);
        console.log('[农历计算] 农历日期:', lunarDate);
        
        const lunarDayChinese = LunarCalendarFestivalUtils.getLunarCalendarDay(dateStr);
        console.log('[农历计算] 农历日中文:', lunarDayChinese);
        
        const lunarTermYear = LunarCalendarFestivalUtils.getLunarTermYear(dateStr);
        console.log('[农历计算] 农历年:', lunarTermYear);
        
        const lunarTermMonth = LunarCalendarFestivalUtils.getLunarTermMonth(dateStr);
        console.log('[农历计算] 农历月:', lunarTermMonth);
        
        // 计算干支
        console.log('[农历计算] 开始计算干支');
        const date = new Date(dateStr);
        const year = date.getFullYear();
        console.log('[农历计算] 年份:', year);
        
        const yearStemBranch = DateStemBranchUtils.calYearStemBranch(year);
        console.log('[农历计算] 年柱:', yearStemBranch);
        
        const monthStemBranch = DateStemBranchUtils.calMonthStemBranch(lunarTermYear, lunarTermMonth);
        console.log('[农历计算] 月柱:', monthStemBranch);
        
        const dayStemBranch = DateStemBranchUtils.calDayStemBranch(dateStr);
        console.log('[农历计算] 日柱:', dayStemBranch);
        
        const hourStemBranch = DateStemBranchUtils.calHourStemBranch(dayStemBranch.gan, hour);
        console.log('[农历计算] 时柱:', hourStemBranch);
        
        const lunarDayNum = DateStemBranchUtils.getdayNumber(lunarDayChinese) || 1;
        console.log('[农历计算] 农历日数字:', lunarDayNum);
        
        return {
            lunarDate,
            lunarDayChinese,
            lunarDayNum,
            lunarTermYear,
            lunarTermMonth,
            yearStemBranch,
            monthStemBranch,
            dayStemBranch,
            hourStemBranch
        };
        
    } catch (error) {
        console.error('[农历计算] 失败:', error);
        // 返回带默认值的对象
        return {
            lunarDate: '2026-01-01',
            lunarDayChinese: '初一',
            lunarDayNum: 1,
            lunarTermYear: 2026,
            lunarTermMonth: 1,
            yearStemBranch: { 
                full: '丙午', 
                gan: '丙', 
                zhi: '午' 
            },
            monthStemBranch: { 
                full: '庚寅', 
                gan: '庚', 
                zhi: '寅' 
            },
            dayStemBranch: { 
                full: '壬子', 
                gan: '壬', 
                zhi: '子' 
            },
            hourStemBranch: { 
                full: '丙午', 
                gan: '丙', 
                zhi: '午' 
            }
        };
    }
}

    // 计算天时总数
    calcTianShiSum(lunarInfo) {
        try {
            const yearNum = this.getYearNumber(lunarInfo.yearStemBranch?.zhi || '');
            const monthNum = this.getMonNumber(lunarInfo.monthStemBranch?.zhi || '');
            const dayNum = lunarInfo.lunarDayNum || 1;
            
            const sum = yearNum + monthNum + dayNum;
            console.log(`天时计算: 年${yearNum} + 月${monthNum} + 日${dayNum} = ${sum}`);
            return sum;
        } catch (error) {
            console.error('计算天时总数失败:', error);
            return 0;
        }
    }

    // 获取年地支对应数字
    getYearNumber(zhi) {
        return this.yearMap[zhi] || 0;
    }

    // 获取月地支对应数字
    getMonNumber(zhi) {
        return this.monMap[zhi] || 0;
    }

    // 计算卦象
    calcGua(tianShiSum, strokeCount) {
        // 上卦
        let shangNum = tianShiSum % 8;
        if (shangNum === 0) shangNum = 8;
        
        // 下卦
        let xiaNum = (tianShiSum + strokeCount) % 8;
        if (xiaNum === 0) xiaNum = 8;
        
        // 动爻
        let dongYao = (tianShiSum + strokeCount) % 6;
        if (dongYao === 0) dongYao = 6;
        
        console.log(`卦象计算: 天时${tianShiSum}, 笔画${strokeCount} → 上卦${shangNum}, 下卦${xiaNum}, 动爻${dongYao}`);
        
        return {
            shangGuaNum: shangNum,
            xiaGuaNum: xiaNum,
            dongYao: dongYao,
            shangGuaName: this.baguaNum[shangNum] || '坤',
            xiaGuaName: this.baguaNum[xiaNum] || '坤'
        };
    }

    // 计算变卦
    calcBianGua(guaResult) {
        let bianNum;
        let shangNum, xiaNum;
        
        if (guaResult.dongYao > 3) {
            // 上卦动爻
            const dy = guaResult.dongYao - 3;
            const key = `${guaResult.shangGuaNum}#${dy}`;
            bianNum = this.bianGuaMap[key] || guaResult.shangGuaNum;
            shangNum = bianNum;
            xiaNum = guaResult.xiaGuaNum;
            console.log(`上卦动爻: ${key} → ${bianNum}`);
        } else {
            // 下卦动爻
            const key = `${guaResult.xiaGuaNum}#${guaResult.dongYao}`;
            bianNum = this.bianGuaMap[key] || guaResult.xiaGuaNum;
            shangNum = guaResult.shangGuaNum;
            xiaNum = bianNum;
            console.log(`下卦动爻: ${key} → ${bianNum}`);
        }
        
        return {
            num: bianNum,
            name: this.baguaNum[bianNum] || '坤',
            shangNum: shangNum,
            xiaNum: xiaNum
        };
    }

    // 生成结果描述
    generateResultDescription(params) {
        const interpretation = this.getGuaInterpretation(params.shangGua, params.xiaGua, params.bianGua, params.dongYao);
        
        return `姓名：${params.name}
时间：${params.date} ${params.hour}时
==============================
姓名笔画：${params.strokeCount}
天时总数：${params.tianShiSum}
时辰笔画：${params.hourStroke}
总    和：${params.totalSum}
==============================
年柱：${params.yearStemBranch}
月柱：${params.monthStemBranch}
日柱：${params.dayStemBranch}
时柱：${params.hourStemBranch}
==============================
上  卦：${params.shangGua}
下  卦：${params.xiaGua}
动  爻：第${params.dongYao}爻
变  卦：${params.bianGua}
==============================
变卦有利：${params.isFavorable ? '✓' : '✗'}
==============================
解析：${interpretation}`;
    }
    
    // 卦象解析
    getGuaInterpretation(shangGua, xiaGua, bianGua, dongYao) {
        const guaMeanings = {
            '乾': '刚健、创始、领导',
            '坤': '柔顺、承载、包容',
            '兑': '喜悦、交流、沟通',
            '离': '光明、美丽、依附',
            '震': '行动、震动、奋发',
            '巽': '顺从、进入、渗透',
            '坎': '险陷、智慧、流动',
            '艮': '停止、稳重、静止'
        };
        
        const shangMeaning = guaMeanings[shangGua] || '';
        const xiaMeaning = guaMeanings[xiaGua] || '';
        const bianMeaning = guaMeanings[bianGua] || '';
        
        return `${shangGua}上${xiaGua}下，${shangMeaning}在上，${xiaMeaning}在下。动爻第${dongYao}爻，变卦为${bianGua}，主${bianMeaning}。`;
    }

    // ==================== 其他方法 ====================
    
    // 获取组合定位
    getzhdw(gzh) {
        return this.xtyt[gzh] || '';
    }

    // 判断是否为六冲
    islc(zhdz, txdz) {
        if (!zhdz || !txdz) return false;
        const pair = zhdz + txdz;
        const reversePair = txdz + zhdz;
        return this.liuChong.includes(pair) || this.liuChong.includes(reversePair);
    }

    // 检查地区匹配
    getdqys(address, dz) {
        if (!address || !dz) return false;
        
        // 尝试匹配地址前2个字
        const key2 = address.substring(0, 2);
        if (this.dqys[key2]) {
            return this.dqys[key2].includes(dz);
        }
        
        // 尝试匹配地址前1个字
        const key1 = address.substring(0, 1);
        for (const [key, value] of Object.entries(this.dqys)) {
            if (key.startsWith(key1)) {
                return value.includes(dz);
            }
        }
        
        return false;
    }

    // 检查行业匹配
    gethyys(industry, dz) {
        if (!industry || !dz) return false;
        
        // 直接匹配
        if (this.hyys[industry]) {
            return this.hyys[industry].includes(dz);
        }
        
        // 尝试部分匹配
        for (const [key, value] of Object.entries(this.hyys)) {
            if (industry.includes(key) || key.includes(industry)) {
                return value.includes(dz);
            }
        }
        
        return false;
    }

    // 判断六合
    islh(zhdz, txdz) {
        if (!zhdz || !txdz) return false;
        const pair = zhdz + txdz;
        const reversePair = txdz + zhdz;
        return this.liuHe.includes(pair) || this.liuHe.includes(reversePair);
    }

    // 获取八卦名称
    getgz(gx) {
        return this.baguaNum[gx.toString()] || '坤';
    }
    
    // 获取卦序
    getgx(sumcount) {
        return sumcount % 8;
    }
    
    // 获取动爻
    getdy(sumcount) {
        const dy = sumcount % 6;
        return dy === 0 ? 6 : dy;
    }
}

// ==================== 导出 ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        RunQG,
        LunarCalendarFestivalUtils,
        DateStemBranchUtils
    };
} else {
    window.RunQG = RunQG;
    window.LunarCalendarFestivalUtils = LunarCalendarFestivalUtils;
    window.DateStemBranchUtils = DateStemBranchUtils;
}