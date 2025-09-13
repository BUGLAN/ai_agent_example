# 奇书网玄幻小说爬虫

这是一个用于爬取奇书网玄幻小说的Python爬虫程序。

## 功能特性

- 爬取奇书网玄幻小说分类前10页的小说列表
- 自动进入每本小说的详情页
- 查找并下载TXT格式的小说文件
- 内置反爬虫机制：
  - 随机User-Agent伪装
  - 随机请求延时
  - 请求重试机制
  - Session保持

## 安装依赖

```bash
pip install -r requirements.txt
```

## 使用方法

```bash
python novel_spider.py
```

程序会自动：
1. 创建`novels`目录用于存储下载的小说
2. 爬取前10页的小说列表
3. 去重处理
4. 逐个下载小说TXT文件

## 文件结构

```
mcp_chrome_example/
├── novel_spider.py      # 主爬虫程序
├── requirements.txt     # 项目依赖
├── README.md           # 说明文档
└── novels/             # 下载的小说存储目录（自动创建）
```

## 注意事项

1. 请遵守网站的robots.txt协议
2. 不要过于频繁地请求，避免给服务器造成压力
3. 仅供学习交流使用，请勿用于商业用途
4. 下载的内容请尊重版权，仅供个人阅读

## 技术实现

- **requests**: HTTP请求库
- **BeautifulSoup**: HTML解析
- **fake-useragent**: 随机User-Agent生成
- **lxml**: 高性能XML/HTML解析器

## 反爬虫策略

1. **User-Agent轮换**: 每次请求使用随机的浏览器标识
2. **请求延时**: 页面间2-4秒延时，下载间3-6秒延时
3. **重试机制**: 失败请求自动重试最多3次
4. **Session保持**: 维持会话状态，模拟真实浏览
5. **编码处理**: 正确处理GBK编码的中文内容

## 自定义配置

可以修改`NovelSpider`类中的参数：
- `max_pages`: 爬取页数（默认10页）
- `download_dir`: 下载目录（默认"novels"）
- 延时时间范围
- 重试次数