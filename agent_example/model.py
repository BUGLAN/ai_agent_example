#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
简单Agent模型 - 模块化设计
提供更清晰的架构和更好的扩展性
"""

from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum
import json
import re
from datetime import datetime

class AgentType(Enum):
    """Agent类型枚举"""
    TEXT_ANALYZER = "text_analyzer"
    CHAT_BOT = "chat_bot"
    DATA_PROCESSOR = "data_processor"

class ResponseStatus(Enum):
    """响应状态枚举"""
    SUCCESS = "success"
    ERROR = "error"
    PENDING = "pending"

@dataclass
class AgentMessage:
    """Agent消息数据结构"""
    content: str
    timestamp: datetime = field(default_factory=datetime.now)
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class AgentResponse:
    """Agent响应数据结构"""
    content: str
    status: ResponseStatus
    confidence: float = 1.0
    metadata: Dict[str, Any] = field(default_factory=dict)
    suggestions: List[str] = field(default_factory=list)

class BaseAgent(ABC):
    """Agent基类"""
    
    def __init__(self, agent_id: str, agent_type: AgentType):
        self.agent_id = agent_id
        self.agent_type = agent_type
        self.conversation_history: List[AgentMessage] = []
        self.stats = {
            "total_requests": 0,
            "successful_responses": 0,
            "error_responses": 0,
            "start_time": datetime.now()
        }
    
    @abstractmethod
    async def process(self, message: AgentMessage) -> AgentResponse:
        """处理消息的核心方法"""
        pass
    
    def add_to_history(self, message: AgentMessage):
        """添加到对话历史"""
        self.conversation_history.append(message)
        if len(self.conversation_history) > 100:  # 限制历史记录大小
            self.conversation_history.pop(0)
    
    def get_stats(self) -> Dict[str, Any]:
        """获取Agent统计信息"""
        uptime = datetime.now() - self.stats["start_time"]
        success_rate = (
            self.stats["successful_responses"] / self.stats["total_requests"] * 100
            if self.stats["total_requests"] > 0 else 0
        )
        
        return {
            "agent_id": self.agent_id,
            "agent_type": self.agent_type.value,
            "total_requests": self.stats["total_requests"],
            "successful_responses": self.stats["successful_responses"],
            "error_responses": self.stats["error_responses"],
            "success_rate": round(success_rate, 2),
            "uptime_seconds": int(uptime.total_seconds()),
            "conversation_length": len(self.conversation_history)
        }

class TextCategory(Enum):
    """文本类别枚举"""
    NOUN = "名词"
    IDIOM = "成语"
    XIEHOUYU = "歇后语"
    REGULAR_SENTENCE = "常规句子"
    QUESTION = "疑问句"
    COMMAND = "命令句"
    UNKNOWN = "未知"

class SimpleTextAgent(BaseAgent):
    """简单的文本分析Agent"""
    
    def __init__(self, agent_id: str = "text_analyzer_001"):
        super().__init__(agent_id, AgentType.TEXT_ANALYZER)
        self._load_patterns()
    
    def _load_patterns(self):
        """加载文本模式"""
        self.patterns = {
            TextCategory.IDIOM: [
                "一心一意", "七上八下", "五花八门", "九牛一毛", "十全十美",
                "百发百中", "千军万马", "万无一失", "风和日丽", "兴高采烈"
            ],
            TextCategory.XIEHOUYU: [
                "泥菩萨过河", "八仙过海", "竹篮打水", "对牛弹琴", "猫哭老鼠"
            ],
            TextCategory.NOUN: [
                "电脑", "手机", "汽车", "房子", "学校", "公司", "朋友", "家人"
            ]
        }
        
        # 正则表达式模式
        self.regex_patterns = {
            TextCategory.QUESTION: r'.*\?|.*？|什么|怎么|为什么|如何',
            TextCategory.COMMAND: r'请|帮我|给我|需要|应该|必须'
        }
    
    async def process(self, message: AgentMessage) -> AgentResponse:
        """处理文本分析请求"""
        try:
            self.stats["total_requests"] += 1
            
            text = message.content.strip()
            if not text:
                response = AgentResponse(
                    content="输入为空",
                    status=ResponseStatus.ERROR,
                    confidence=0.0,
                    suggestions=["请输入一些文本进行分析"]
                )
                self.stats["error_responses"] += 1
                return response
            
            # 分析文本
            category, confidence = self._analyze_text(text)
            suggestions = self._generate_suggestions(text, category)
            explanation = self._generate_explanation(text, category, confidence)
            
            response = AgentResponse(
                content=explanation,
                status=ResponseStatus.SUCCESS,
                confidence=confidence,
                metadata={
                    "original_text": text,
                    "category": category.value,
                    "text_length": len(text)
                },
                suggestions=suggestions
            )
            
            self.stats["successful_responses"] += 1
            self.add_to_history(message)
            return response
            
        except Exception as e:
            self.stats["error_responses"] += 1
            return AgentResponse(
                content=f"分析过程中出现错误: {str(e)}",
                status=ResponseStatus.ERROR,
                confidence=0.0,
                suggestions=["请稍后重试", "检查输入内容格式"]
            )
    
    def _analyze_text(self, text: str) -> Tuple[TextCategory, float]:
        """分析文本类别"""
        text = text.strip()
        
        # 检查成语
        for idiom in self.patterns[TextCategory.IDIOM]:
            if idiom in text:
                return TextCategory.IDIOM, 0.95
        
        # 检查歇后语
        for xiehouyu in self.patterns[TextCategory.XIEHOUYU]:
            if xiehouyu in text:
                return TextCategory.XIEHOUYU, 0.90
        
        # 检查名词
        for noun in self.patterns[TextCategory.NOUN]:
            if noun in text:
                return TextCategory.NOUN, 0.85
        
        # 检查疑问句
        if re.search(self.regex_patterns[TextCategory.QUESTION], text, re.IGNORECASE):
            return TextCategory.QUESTION, 0.80
        
        # 检查命令句
        if re.search(self.regex_patterns[TextCategory.COMMAND], text, re.IGNORECASE):
            return TextCategory.COMMAND, 0.75
        
        # 检查是否为常规句子
        if len(text) > 5 and any(p in text for p in '，。！？；：'):
            return TextCategory.REGULAR_SENTENCE, 0.70
        
        return TextCategory.UNKNOWN, 0.50
    
    def _generate_suggestions(self, text: str, category: TextCategory) -> List[str]:
        """生成建议"""
        suggestions_map = {
            TextCategory.IDIOM: [
                f"{text}的出处和典故",
                f"与{text}意思相近的成语",
                f"{text}的英文翻译"
            ],
            TextCategory.XIEHOUYU: [
                f"{text}的下半句是什么？",
                f"{text}的寓意和启示",
                f"类似{text}的歇后语"
            ],
            TextCategory.NOUN: [
                f"关于{text}的详细介绍",
                f"{text}的种类和分类",
                f"如何选择合适的{text}"
            ],
            TextCategory.QUESTION: [
                f"回答这个问题：{text}",
                f"扩展这个问题的背景",
                f"类似问题的解答"
            ],
            TextCategory.COMMAND: [
                f"执行命令：{text}",
                f"提供完成{text}的步骤",
                f"{text}的最佳实践"
            ],
            TextCategory.REGULAR_SENTENCE: [
                "这句话可以如何扩展？",
                "类似表达的句子",
                "如何改写这句话使其更生动"
            ],
            TextCategory.UNKNOWN: [
                "请提供更具体的文本",
                "尝试输入成语、名词或句子",
                "查看使用示例"
            ]
        }
        
        return suggestions_map.get(category, ["请提供更多信息"])
    
    def _generate_explanation(self, text: str, category: TextCategory, confidence: float) -> str:
        """生成解释"""
        explanations = {
            TextCategory.IDIOM: f"'{text}'是一个常见成语，通常用于形容特定的情境或表达特定的含义。",
            TextCategory.XIEHOUYU: f"'{text}'是一个歇后语的前半部分，通常后面跟着形象的比喻或双关语。",
            TextCategory.NOUN: f"'{text}'是一个具体名词，可以进一步探讨其属性、特征或相关话题。",
            TextCategory.QUESTION: f"这是一个疑问句，表达了提问者对'{text}'的疑问或寻求信息。",
            TextCategory.COMMAND: f"这是一个命令或请求，表达了希望'{text}'被执行的意愿。",
            TextCategory.REGULAR_SENTENCE: f"这是一个包含{len(text)}个字符的常规句子。",
            TextCategory.UNKNOWN: f"无法确定'{text}'的具体类别，请尝试提供更多上下文信息。"
        }
        
        base_explanation = explanations.get(category, "文本分析完成")
        return f"{base_explanation} (置信度: {confidence:.1%})"

class AgentManager:
    """Agent管理器"""
    
    def __init__(self):
        self.agents: Dict[str, BaseAgent] = {}
        self._initialize_agents()
    
    def _initialize_agents(self):
        """初始化所有Agent"""
        text_agent = SimpleTextAgent("main_text_analyzer")
        self.register_agent(text_agent)
    
    def register_agent(self, agent: BaseAgent):
        """注册Agent"""
        self.agents[agent.agent_id] = agent
    
    def get_agent(self, agent_id: str) -> Optional[BaseAgent]:
        """获取Agent"""
        return self.agents.get(agent_id)
    
    def list_agents(self) -> List[Dict[str, Any]]:
        """列出所有Agent"""
        return [
            {
                "agent_id": agent.agent_id,
                "agent_type": agent.agent_type.value,
                "stats": agent.get_stats()
            }
            for agent in self.agents.values()
        ]
    
    async def process_with_agent(self, agent_id: str, message: str) -> AgentResponse:
        """使用指定Agent处理消息"""
        agent = self.get_agent(agent_id)
        if not agent:
            return AgentResponse(
                content=f"未找到Agent: {agent_id}",
                status=ResponseStatus.ERROR,
                suggestions=["可用的Agent: " + ", ".join(self.agents.keys())]
            )
        
        agent_message = AgentMessage(content=message)
        return await agent.process(agent_message)

# 全局Agent管理器实例
agent_manager = AgentManager()

# 便捷函数
async def analyze_text(text: str, agent_id: str = "main_text_analyzer") -> AgentResponse:
    """快速分析文本"""
    return await agent_manager.process_with_agent(agent_id, text)

def get_system_stats() -> Dict[str, Any]:
    """获取系统统计信息"""
    return {
        "system": "简单Agent系统",
        "version": "1.0.0",
        "agents": agent_manager.list_agents(),
        "timestamp": datetime.now().isoformat()
    }

# 使用示例和测试函数
async def demo():
    """演示功能"""
    print("🤖 简单Agent系统演示")
    print("=" * 50)
    
    # 获取系统信息
    stats = get_system_stats()
    print(f"系统版本: {stats['version']}")
    print(f"可用Agent: {len(stats['agents'])}")
    
    # 测试文本分析
    test_cases = [
        "一心一意",
        "泥菩萨过河",
        "电脑",
        "今天天气怎么样？",
        "请帮我完成这个任务",
        "这是一个普通的句子。"
    ]
    
    for text in test_cases:
        print(f"\n📝 分析: {text}")
        response = await analyze_text(text)
        print(f"📊 类别: {response.metadata.get('category', '未知')}")
        print(f"💡 建议: {response.suggestions[0] if response.suggestions else '无'}")
    
    print("\n" + "=" * 50)
    print("✅ 演示完成")

if __name__ == "__main__":
    import asyncio
    asyncio.run(demo())