# 智能文本分析Agent

一个基于Python的智能文本分析系统，能够自动识别输入文本的类别（名词、成语、歇后语、常规句子）并提供智能补全建议。

## 功能特性

### 🔍 文本分类
- **名词识别**：识别具体名词如"电脑"、"学校"等
- **成语检测**：识别常见四字成语如"一心一意"、"七上八下"等
- **歇后语分析**：识别歇后语前半部分如"泥菩萨过河"等
- **常规句子**：处理一般性文本内容

### 💡 智能补全
- 基于分类结果提供个性化建议
- 上下文感知的补全提示
- 多种补全选项供用户选择

### 🖥️ 多界面支持
- **命令行界面**：简洁高效的终端交互
- **Web界面**：美观友好的浏览器访问

## 快速开始

### 环境要求
- Python 3.6+
- FastAPI 或 Flask（可选Web框架）

### 安装依赖

#### 基础依赖
```bash
pip install -r requirements.txt
```

#### FastAPI版本（推荐）
```bash
pip install fastapi uvicorn[standard]
```

### 运行方式

#### 1. 命令行模式
```bash
python text_analyzer.py
```

#### 2. 简单Agent模型（新功能）
```bash
python model.py  # 测试简单Agent
```

#### 3. Web界面模式（四种选择）

**FastAPI版本（推荐，高性能）**
```bash
python fastapi_interface.py
```
访问：http://localhost:8000
API文档：http://localhost:8000/docs

**简单Agent服务器（基于新模型）**
```bash
python simple_agent_server.py
```
访问：http://localhost:8001/web
API文档：http://localhost:8001/docs

**Flask版本（传统）**
```bash
python web_interface.py
```
访问：http://localhost:5000

## 使用示例

### 命令行使用
```
============================
智能文本分析Agent
可以分析：名词、成语、歇后语、常规句子
输入 'quit' 或 'exit' 退出
输入 'stats' 查看统计
============================

请输入要分析的文本: 一心一意

=== 分析结果 ===
原文: 一心一意
类别: 成语
置信度: 0.95
解释: '一心一意'是一个常见成语，通常用于形容特定的情境或表达特定的含义

智能补全建议:
  1. 一心一意的下一句
  2. 与一心一意意思相近的成语
  3. 一心一意的英文翻译
```

### Web界面使用
1. 打开浏览器访问 http://localhost:5000
2. 在输入框中输入要分析的文本
3. 点击"分析文本"按钮
4. 查看分析结果和智能补全建议

## 技术架构

### 核心组件
- **TextAnalyzer**：文本分析引擎
- **SmartAgent**：智能代理主类
- **AnalysisResult**：分析结果数据结构

### 分类算法
- 基于模式匹配的精确识别
- 可扩展的词典系统
- 置信度评分机制

### 扩展性设计
- 模块化架构，易于添加新类别
- 可扩展的词典系统
- 支持自定义规则

## 扩展开发

### 添加新类别
1. 在 `TextCategory` 枚举中添加新类别
2. 在 `TextAnalyzer` 中实现新的分析方法
3. 添加对应的词典和匹配规则

### 增强词典
- 成语词典：修改 `_load_idioms()` 方法
- 歇后语词典：修改 `_load_xiehouyu()` 方法
- 名词词典：修改 `_load_nouns()` 方法

### 集成外部API
可以集成以下API增强功能：
- 百度翻译API（多语言支持）
- 成语词典API（更丰富的成语数据）
- 自然语言处理API（深度语义分析）

## 性能优化

### 当前限制
- 词典规模有限（演示用途）
- 基于精确匹配，不支持模糊匹配
- 无机器学习模型

### 优化建议
1. **词典扩展**：增加更多词条
2. **模糊匹配**：支持相似度匹配
3. **机器学习**：集成NLP模型
4. **缓存机制**：提高响应速度

## 项目结构

```
agent_example/
├── text_analyzer.py      # 核心文本分析引擎
├── fastapi_interface.py  # FastAPI Web界面
├── web_interface.py      # Flask Web界面（可选）
├── model.py              # 简单Agent模型（新增）
├── simple_agent_server.py  # 基于新模型的FastAPI服务器（新增）
├── templates/            # HTML模板目录
│   └── index.html       # Web界面模板
├── requirements.txt      # 项目依赖
└── README.md            # 项目说明文档
```

## 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

### 开发计划
- [ ] 增加更多文本类别
- [ ] 集成机器学习模型
- [ ] 添加语音输入支持
- [ ] 实现用户词典功能
- [ ] 添加导出分析结果功能

## 许可证

MIT License - 详见项目根目录LICENSE文件