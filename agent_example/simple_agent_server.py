#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
简单Agent服务器 - 基于新模型
使用FastAPI提供Agent服务
"""

import sys
import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
import asyncio

# 添加当前目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from model import agent_manager, AgentMessage, analyze_text, get_system_stats

# 创建FastAPI应用
app = FastAPI(
    title="简单Agent系统",
    description="基于模块化设计的智能Agent服务",
    version="2.1.0"
)

# 添加CORS支持
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 请求模型
class TextAnalysisRequest(BaseModel):
    text: str = Field(..., description="要分析的文本", min_length=1, max_length=1000)
    agent_id: str = Field(default="main_text_analyzer", description="使用的Agent ID")

class BatchAnalysisRequest(BaseModel):
    texts: List[str] = Field(..., description="要分析的文本列表", min_items=1, max_items=10)
    agent_id: str = Field(default="main_text_analyzer", description="使用的Agent ID")

# 响应模型
class AnalysisResult(BaseModel):
    content: str
    category: str
    confidence: float
    suggestions: List[str]
    metadata: Dict[str, Any]
    timestamp: str

class SystemInfo(BaseModel):
    version: str
    agents: List[Dict[str, Any]]
    timestamp: str

@app.get("/", response_class=Dict[str, Any])
async def root():
    """根路径信息"""
    return {
        "service": "简单Agent系统",
        "version": "2.1.0",
        "endpoints": {
            "analyze": "/analyze",
            "batch_analyze": "/batch_analyze",
            "agents": "/agents",
            "stats": "/stats",
            "health": "/health"
        },
        "docs": "/docs"
    }

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_single(request: TextAnalysisRequest):
    """分析单个文本"""
    try:
        response = await analyze_text(request.text, request.agent_id)
        
        return AnalysisResult(
            content=response.content,
            category=response.metadata.get("category", "unknown"),
            confidence=response.confidence,
            suggestions=response.suggestions,
            metadata=response.metadata,
            timestamp=response.metadata.get("timestamp", "")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/batch_analyze", response_model=List[AnalysisResult])
async def analyze_batch(request: BatchAnalysisRequest):
    """批量分析文本"""
    try:
        results = []
        for text in request.texts:
            response = await analyze_text(text, request.agent_id)
            results.append(AnalysisResult(
                content=response.content,
                category=response.metadata.get("category", "unknown"),
                confidence=response.confidence,
                suggestions=response.suggestions,
                metadata=response.metadata,
                timestamp=response.metadata.get("timestamp", "")
            ))
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/agents", response_model=SystemInfo)
async def list_agents():
    """列出所有可用Agent"""
    return SystemInfo(
        version="2.1.0",
        agents=agent_manager.list_agents(),
        timestamp=get_system_stats()["timestamp"]
    )

@app.get("/stats", response_model=Dict[str, Any])
async def get_stats():
    """获取系统统计信息"""
    return get_system_stats()

@app.get("/health")
async def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "service": "简单Agent系统",
        "uptime": get_system_stats()["timestamp"],
        "agents_count": len(agent_manager.list_agents())
    }

@app.get("/demo")
async def run_demo():
    """运行演示"""
    demo_texts = [
        "一心一意",
        "泥菩萨过河",
        "电脑",
        "今天天气怎么样？",
        "请帮我完成这个任务"
    ]
    
    results = []
    for text in demo_texts:
        response = await analyze_text(text)
        results.append({
            "text": text,
            "category": response.metadata.get("category", "unknown"),
            "confidence": response.confidence,
            "suggestion": response.suggestions[0] if response.suggestions else None
        })
    
    return {
        "demo_results": results,
        "total_processed": len(results),
        "system_info": get_system_stats()
    }

# 简单的Web界面
@app.get("/web", response_class=Dict[str, Any])
async def web_interface():
    """简单的Web界面"""
    return {
        "html": '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>简单Agent系统</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .input-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        textarea {
            width: 100%;
            min-height: 100px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-family: inherit;
        }
        button {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 10px;
        }
        button:hover {
            background: #0056b3;
        }
        .result {
            margin-top: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 5px;
            border-left: 4px solid #007bff;
        }
        .loading {
            display: none;
            color: #007bff;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 简单Agent系统</h1>
        <p>基于模块化设计的智能文本分析</p>
        
        <div class="input-group">
            <label for="textInput">输入文本：</label>
            <textarea id="textInput" placeholder="请输入要分析的文本..."></textarea>
        </div>
        
        <button onclick="analyzeText()">分析文本</button>
        <button onclick="runDemo()">运行演示</button>
        <button onclick="showStats()">查看统计</button>
        
        <div class="loading" id="loading">分析中...</div>
        <div class="result" id="result" style="display: none;">
            <h3>分析结果</h3>
            <div id="resultContent"></div>
        </div>
    </div>

    <script>
        async function analyzeText() {
            const text = document.getElementById('textInput').value.trim();
            if (!text) {
                alert('请输入文本');
                return;
            }
            
            document.getElementById('loading').style.display = 'block';
            
            try {
                const response = await fetch('/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: text })
                });
                
                const data = await response.json();
                displayResult(data);
            } catch (error) {
                alert('分析失败: ' + error.message);
            } finally {
                document.getElementById('loading').style.display = 'none';
            }
        }
        
        async function runDemo() {
            try {
                const response = await fetch('/demo');
                const data = await response.json();
                
                let html = '<h4>演示结果</h4>';
                data.demo_results.forEach(item => {
                    html += `<p><strong>${item.text}</strong> → ${item.category} (${item.confidence}%)</p>`;
                });
                
                document.getElementById('resultContent').innerHTML = html;
                document.getElementById('result').style.display = 'block';
            } catch (error) {
                alert('演示失败');
            }
        }
        
        async function showStats() {
            try {
                const response = await fetch('/stats');
                const data = await response.json();
                
                document.getElementById('resultContent').innerHTML = 
                    `<pre>${JSON.stringify(data, null, 2)}</pre>`;
                document.getElementById('result').style.display = 'block';
            } catch (error) {
                alert('获取统计失败');
            }
        }
        
        function displayResult(data) {
            document.getElementById('resultContent').innerHTML = `
                <p><strong>类别:</strong> ${data.category}</p>
                <p><strong>置信度:</strong> ${(data.confidence * 100).toFixed(1)}%</p>
                <p><strong>解释:</strong> ${data.content}</p>
                <p><strong>建议:</strong> ${data.suggestions[0] || '无'}</p>
            `;
            document.getElementById('result').style.display = 'block';
        }
    </script>
</body>
</html>'''
    }

if __name__ == '__main__':
    print("🚀 启动简单Agent系统...")
    print("📱 Web界面: http://localhost:8001/web")
    print("📊 API文档: http://localhost:8001/docs")
    print("🔍 演示接口: http://localhost:8001/demo")
    
    uvicorn.run(
        "simple_agent_server:app",
        host="0.0.0.0",
        port=8001,
        reload=True
    )