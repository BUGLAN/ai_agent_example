#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
智能文本分析Agent
用于分析输入语句的类别并进行智能补全
"""

import re
import json
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from enum import Enum

class TextCategory(Enum):
    """文本类别枚举"""
    NOUN = "名词"
    IDIOM = "成语"
    XIEHOUYU = "歇后语"
    REGULAR_SENTENCE = "常规句子"
    UNKNOWN = "未知"

@dataclass
class AnalysisResult:
    """分析结果数据结构"""
    original_text: str
    category: TextCategory
    confidence: float
    suggestions: List[str]
    explanation: str

class TextAnalyzer:
    """文本分析器主类"""
    
    def __init__(self):
        self.idiom_patterns = self._load_idioms()
        self.xiehouyu_patterns = self._load_xiehouyu()
        self.noun_patterns = self._load_nouns()
    
    def _load_idioms(self) -> List[str]:
        """加载常见成语模式"""
        return [
            "一心一意", "七上八下", "五花八门", "九牛一毛", "十全十美",
            "百发百中", "千军万马", "万无一失", "风和日丽", "兴高采烈",
            "自由自在", "无忧无虑", "不慌不忙", "不紧不慢", "自言自语",
            "大摇大摆", "多才多艺", "非亲非故", "古色古香", "活灵活现"
        ]
    
    def _load_xiehouyu(self) -> List[str]:
        """加载常见歇后语模式"""
        return [
            "泥菩萨过河", "八仙过海", "竹篮打水", "对牛弹琴", "猫哭老鼠",
            "狗咬吕洞宾", "王婆卖瓜", "姜太公钓鱼", "愚公移山", "叶公好龙"
        ]
    
    def _load_nouns(self) -> List[str]:
        """加载常见名词模式"""
        return [
            "电脑", "手机", "汽车", "房子", "学校", "公司", "朋友", "家人",
            "工作", "学习", "生活", "时间", "空间", "世界", "国家", "城市"
        ]
    
    def analyze(self, text: str) -> AnalysisResult:
        """分析输入文本"""
        text = text.strip()
        
        if not text:
            return AnalysisResult(
                original_text=text,
                category=TextCategory.UNKNOWN,
                confidence=0.0,
                suggestions=["请输入一些文本进行分析"],
                explanation="输入为空"
            )
        
        # 检查是否为成语
        if self._is_idiom(text):
            return self._analyze_idiom(text)
        
        # 检查是否为歇后语
        if self._is_xiehouyu(text):
            return self._analyze_xiehouyu(text)
        
        # 检查是否为名词
        if self._is_noun(text):
            return self._analyze_noun(text)
        
        # 默认为常规句子
        return self._analyze_sentence(text)
    
    def _is_idiom(self, text: str) -> bool:
        """判断是否为成语"""
        return text in self.idiom_patterns
    
    def _is_xiehouyu(self, text: str) -> bool:
        """判断是否为歇后语"""
        return any(xiehouyu in text for xiehouyu in self.xiehouyu_patterns)
    
    def _is_noun(self, text: str) -> bool:
        """判断是否为名词"""
        return text in self.noun_patterns
    
    def _analyze_idiom(self, text: str) -> AnalysisResult:
        """分析成语"""
        suggestions = [
            f"{text}的下一句",
            f"与{text}意思相近的成语",
            f"{text}的英文翻译"
        ]
        
        return AnalysisResult(
            original_text=text,
            category=TextCategory.IDIOM,
            confidence=0.95,
            suggestions=suggestions,
            explanation=f"'{text}'是一个常见成语，通常用于形容特定的情境或表达特定的含义"
        )
    
    def _analyze_xiehouyu(self, text: str) -> AnalysisResult:
        """分析歇后语"""
        suggestions = [
            f"{text}的下一句是什么？",
            f"{text}的寓意",
            f"类似{text}的歇后语"
        ]
        
        return AnalysisResult(
            original_text=text,
            category=TextCategory.XIEHOUYU,
            confidence=0.90,
            suggestions=suggestions,
            explanation=f"'{text}'是一个歇后语的前半部分，通常后面跟着形象的比喻或双关语"
        )
    
    def _analyze_noun(self, text: str) -> AnalysisResult:
        """分析名词"""
        suggestions = [
            f"关于{text}的详细介绍",
            f"{text}的种类和分类",
            f"如何选择合适的{text}",
            f"{text}的发展趋势"
        ]
        
        return AnalysisResult(
            original_text=text,
            category=TextCategory.NOUN,
            confidence=0.85,
            suggestions=suggestions,
            explanation=f"'{text}'是一个具体名词，可以进一步探讨其属性、特征或相关话题"
        )
    
    def _analyze_sentence(self, text: str) -> AnalysisResult:
        """分析常规句子"""
        # 简单的句子分析
        word_count = len(text)
        has_punctuation = any(p in text for p in '，。！？；：')
        
        suggestions = [
            "这句话可以如何扩展？",
            "类似表达的句子",
            "这句话的修辞手法分析",
            "如何改写这句话使其更生动"
        ]
        
        confidence = 0.8 if has_punctuation else 0.7
        
        return AnalysisResult(
            original_text=text,
            category=TextCategory.REGULAR_SENTENCE,
            confidence=confidence,
            suggestions=suggestions,
            explanation=f"这是一个包含{word_count}个字符的常规句子，{'包含标点符号' if has_punctuation else '缺少标点符号'}"
        )

class SmartAgent:
    """智能Agent主类"""
    
    def __init__(self):
        self.analyzer = TextAnalyzer()
        self.conversation_history = []
    
    def process_input(self, user_input: str) -> Dict:
        """处理用户输入"""
        result = self.analyzer.analyze(user_input)
        
        # 保存对话历史
        self.conversation_history.append({
            "input": user_input,
            "result": result
        })
        
        return {
            "status": "success",
            "data": {
                "original_text": result.original_text,
                "category": result.category.value,
                "confidence": result.confidence,
                "suggestions": result.suggestions,
                "explanation": result.explanation
            }
        }
    
    def get_stats(self) -> Dict:
        """获取使用统计"""
        if not self.conversation_history:
            return {"total_analyses": 0, "categories": {}}
        
        categories = {}
        for item in self.conversation_history:
            cat = item["result"].category.value
            categories[cat] = categories.get(cat, 0) + 1
        
        return {
            "total_analyses": len(self.conversation_history),
            "categories": categories
        }

def main():
    """主函数 - 命令行界面"""
    agent = SmartAgent()
    
    print("=" * 50)
    print("智能文本分析Agent")
    print("可以分析：名词、成语、歇后语、常规句子")
    print("输入 'quit' 或 'exit' 退出")
    print("输入 'stats' 查看统计")
    print("=" * 50)
    
    while True:
        try:
            user_input = input("\n请输入要分析的文本: ").strip()
            
            if user_input.lower() in ['quit', 'exit']:
                print("感谢使用，再见！")
                break
            
            if user_input.lower() == 'stats':
                stats = agent.get_stats()
                print("\n=== 使用统计 ===")
                print(f"总分析次数: {stats['total_analyses']}")
                for cat, count in stats['categories'].items():
                    print(f"{cat}: {count}次")
                continue
            
            result = agent.process_input(user_input)
            data = result["data"]
            
            print(f"\n=== 分析结果 ===")
            print(f"原文: {data['original_text']}")
            print(f"类别: {data['category']}")
            print(f"置信度: {data['confidence']:.2f}")
            print(f"解释: {data['explanation']}")
            print("\n智能补全建议:")
            for i, suggestion in enumerate(data['suggestions'], 1):
                print(f"  {i}. {suggestion}")
                
        except KeyboardInterrupt:
            print("\n\n感谢使用，再见！")
            break
        except Exception as e:
            print(f"发生错误: {e}")

if __name__ == "__main__":
    main()