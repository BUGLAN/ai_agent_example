#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FastAPI界面 - 智能文本分析Agent
基于FastAPI的现代化Web应用
"""

import sys
import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from pydantic import BaseModel
from typing import Dict, Any

# 添加当前目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from text_analyzer import SmartAgent

# 创建FastAPI应用
app = FastAPI(
    title="智能文本分析Agent",
    description="基于FastAPI的智能文本分类和补全系统",
    version="2.0.0"
)

# 初始化Agent
agent = SmartAgent()

# 请求模型
class TextRequest(BaseModel):
    text: str

# 响应模型
class AnalysisResponse(BaseModel):
    status: str
    data: Dict[str, Any]

@app.get("/", response_class=HTMLResponse)
async def root():
    """主页 - 返回现代化的HTML界面"""
    html_content = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>智能文本分析Agent - FastAPI版</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', 'Microsoft YaHei', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
            animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255,255,255,0.1) 10px,
                rgba(255,255,255,0.1) 20px
            );
            animation: shimmer 3s linear infinite;
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }
        
        .header p {
            opacity: 0.9;
            font-size: 18px;
            position: relative;
            z-index: 1;
        }
        
        .content {
            padding: 40px;
        }
        
        .input-section {
            margin-bottom: 30px;
        }
        
        .input-section label {
            display: block;
            margin-bottom: 10px;
            font-weight: bold;
            color: #333;
            font-size: 16px;
        }
        
        .input-section textarea {
            width: 100%;
            min-height: 120px;
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            font-size: 16px;
            resize: vertical;
            transition: all 0.3s ease;
            font-family: inherit;
        }
        
        .input-section textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            flex-wrap: wrap;
        }
        
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .btn:active {
            transform: translateY(0);
        }
        
        .btn.secondary {
            background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
        }
        
        .btn.success {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        }
        
        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
        
        .result-section {
            margin-top: 30px;
            display: none;
        }
        
        .result-card {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 20px;
            border: 1px solid #e9ecef;
            animation: slideIn 0.5s ease-out;
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .result-card h3 {
            color: #667eea;
            margin-bottom: 20px;
            font-size: 22px;
            display: flex;
            align-items: center;
        }
        
        .result-item {
            margin-bottom: 15px;
            padding: 12px;
            background: white;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .result-item strong {
            color: #333;
            display: inline-block;
            width: 100px;
            font-weight: 600;
        }
        
        .suggestions {
            margin-top: 20px;
        }
        
        .suggestion-item {
            background: linear-gradient(135deg, #e8f2ff 0%, #f0f8ff 100%);
            padding: 12px;
            margin-bottom: 8px;
            border-radius: 8px;
            border-left: 3px solid #667eea;
            transition: transform 0.2s ease;
        }
        
        .suggestion-item:hover {
            transform: translateX(5px);
        }
        
        .loading {
            text-align: center;
            padding: 20px;
            color: #667eea;
            display: none;
        }
        
        .loading::after {
            content: '';
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #667eea;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .stats {
            background: linear-gradient(135deg, #f0f0f0 0%, #e9ecef 100%);
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            display: none;
        }
        
        .stats h4 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 18px;
        }
        
        .error {
            background: linear-gradient(135deg, #ffe6e6 0%, #ffcccc 100%);
            color: #d63384;
            padding: 15px;
            border-radius: 12px;
            margin-bottom: 20px;
            display: none;
            border-left: 4px solid #d63384;
        }
        
        .confidence-bar {
            width: 100%;
            height: 8px;
            background: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 5px;
        }
        
        .confidence-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            transition: width 0.5s ease;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 15px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .content {
                padding: 20px;
            }
            
            .button-group {
                flex-direction: column;
            }
            
            .btn {
                width: 100%;
                margin-bottom: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 智能文本分析Agent - FastAPI版</h1>
            <p>基于FastAPI的高性能文本分类和智能补全系统</p>
        </div>
        
        <div class="content">
            <div class="input-section">
                <label for="textInput">请输入要分析的文本：</label>
                <textarea 
                    id="textInput" 
                    placeholder="例如：一心一意、泥菩萨过河、电脑、今天天气真好..."
                    maxlength="500"
                ></textarea>
                <div class="button-group">
                    <button class="btn" onclick="analyzeText()">🎯 分析文本</button>
                    <button class="btn secondary" onclick="clearText()">🧹 清空</button>
                    <button class="btn success" onclick="showStats()">📊 查看统计</button>
                </div>
            </div>
            
            <div class="loading" id="loading">
                正在智能分析中...
            </div>
            
            <div class="stats" id="stats">
                <h4>📈 使用统计</h4>
                <div id="statsContent"></div>
            </div>
            
            <div class="result-section" id="resultSection">
                <div class="result-card">
                    <h3>📊 智能分析结果</h3>
                    <div class="result-item">
                        <strong>原文：</strong><span id="originalText"></span>
                    </div>
                    <div class="result-item">
                        <strong>类别：</strong><span id="category"></span>
                    </div>
                    <div class="result-item">
                        <strong>置信度：</strong><span id="confidence"></span>
                        <div class="confidence-bar">
                            <div class="confidence-fill" id="confidenceBar"></div>
                        </div>
                    </div>
                    <div class="result-item">
                        <strong>解释：</strong><span id="explanation"></span>
                    </div>
                    
                    <div class="suggestions">
                        <strong>💡 智能补全建议：</strong>
                        <div id="suggestionsList"></div>
                    </div>
                </div>
            </div>
            
            <div class="error" id="error"></div>
        </div>
    </div>

    <script>
        async function analyzeText() {
            const text = document.getElementById('textInput').value.trim();
            if (!text) {
                showError('请输入要分析的文本');
                return;
            }

            showLoading(true);
            hideError();
            
            try {
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: text })
                });
                
                const data = await response.json();
                showLoading(false);
                
                if (response.ok && data.status === 'success') {
                    displayResult(data.data);
                } else {
                    showError(data.detail || data.message || '分析失败');
                }
            } catch (error) {
                showLoading(false);
                showError('网络错误，请稍后重试');
            }
        }
        
        async function showStats() {
            try {
                const response = await fetch('/api/stats');
                const data = await response.json();
                
                if (response.ok && data.status === 'success') {
                    const stats = data.data;
                    let content = `<p><strong>总分析次数:</strong> ${stats.total_analyses}</p>`;
                    
                    if (stats.total_analyses > 0) {
                        content += '<p><strong>类别分布:</strong></p><ul style="list-style: none; padding: 0;">';
                        for (const [category, count] of Object.entries(stats.categories)) {
                            const percentage = ((count / stats.total_analyses) * 100).toFixed(1);
                            content += `<li style="margin: 5px 0;">${category}: ${count}次 (${percentage}%)</li>`;
                        }
                        content += '</ul>';
                    } else {
                        content += '<p>暂无分析记录，快来试试吧！</p>';
                    }
                    
                    document.getElementById('statsContent').innerHTML = content;
                    document.getElementById('stats').style.display = 'block';
                    document.getElementById('resultSection').style.display = 'none';
                }
            } catch (error) {
                showError('获取统计信息失败');
            }
        }
        
        function displayResult(data) {
            document.getElementById('originalText').textContent = data.original_text;
            document.getElementById('category').textContent = data.category;
            document.getElementById('confidence').textContent = (data.confidence * 100).toFixed(1) + '%';
            document.getElementById('explanation').textContent = data.explanation;
            
            // 更新置信度条
            const confidenceBar = document.getElementById('confidenceBar');
            confidenceBar.style.width = (data.confidence * 100) + '%';
            
            const suggestionsList = document.getElementById('suggestionsList');
            suggestionsList.innerHTML = '';
            
            data.suggestions.forEach((suggestion, index) => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.innerHTML = `<strong>${index + 1}.</strong> ${suggestion}`;
                div.onclick = () => {
                    document.getElementById('textInput').value = suggestion;
                    analyzeText();
                };
                suggestionsList.appendChild(div);
            });
            
            document.getElementById('resultSection').style.display = 'block';
            document.getElementById('stats').style.display = 'none';
        }
        
        function showLoading(show) {
            document.getElementById('loading').style.display = show ? 'block' : 'none';
        }
        
        function showError(message) {
            const errorDiv = document.getElementById('error');
            errorDiv.innerHTML = `<strong>错误：</strong> ${message}`;
            errorDiv.style.display = 'block';
        }
        
        function hideError() {
            document.getElementById('error').style.display = 'none';
        }
        
        function clearText() {
            document.getElementById('textInput').value = '';
            document.getElementById('resultSection').style.display = 'none';
            document.getElementById('stats').style.display = 'none';
            document.getElementById('textInput').focus();
            hideError();
        }
        
        // 支持快捷键
        document.getElementById('textInput').addEventListener('keydown', function(e) {
            if ((e.key === 'Enter' && e.ctrlKey) || (e.key === 'Enter' && e.metaKey)) {
                e.preventDefault();
                analyzeText();
            }
        });
        
        // 页面加载完成后的初始化
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('textInput').focus();
        });
    </script>
</body>
</html>'''
    
    return HTMLResponse(content=html_content)

@app.post("/api/analyze", response_model=Dict[str, Any])
async def analyze_text(request: TextRequest):
    """分析文本API端点"""
    try:
        if not request.text or not request.text.strip():
            raise HTTPException(status_code=400, detail="请输入要分析的文本")
        
        result = agent.process_input(request.text.strip())
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats", response_model=Dict[str, Any])
async def get_stats():
    """获取统计信息API端点"""
    try:
        stats_data = agent.get_stats()
        return {
            "status": "success",
            "data": stats_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    """健康检查端点"""
    return {
        "status": "healthy",
        "service": "智能文本分析Agent",
        "version": "2.0.0",
        "framework": "FastAPI"
    }

@app.get("/api/docs")
async def get_api_docs():
    """API文档重定向"""
    return {"message": "请访问 /docs 查看交互式API文档"}

if __name__ == '__main__':
    # 安装必要的依赖
    try:
        import uvicorn
    except ImportError:
        print("正在安装FastAPI和Uvicorn...")
        os.system("pip install fastapi uvicorn[standard]")
        import uvicorn
    
    print("🚀 启动FastAPI智能文本分析Agent...")
    print("📱 访问地址: http://localhost:8000")
    print("📚 API文档: http://localhost:8000/docs")
    print("🔍 API测试: http://localhost:8000/redoc")
    
    uvicorn.run(
        "fastapi_interface:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )