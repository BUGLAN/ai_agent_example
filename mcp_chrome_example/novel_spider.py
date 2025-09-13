#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
奇书网玄幻小说爬虫
功能：爬取前10页小说列表，进入详情页下载txt文件
"""

import requests
from bs4 import BeautifulSoup
import time
import os
import re
from urllib.parse import urljoin, urlparse
from fake_useragent import UserAgent
import random

class NovelSpider:
    def __init__(self):
        self.base_url = "https://www.qishuxia.com/xuanhuanxiaoshuo/"
        self.session = requests.Session()
        self.ua = UserAgent()
        self.download_dir = "novels"
        
        # 创建下载目录
        if not os.path.exists(self.download_dir):
            os.makedirs(self.download_dir)
        
        # 设置请求头
        self.headers = {
            'User-Agent': self.ua.random,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0'
        }
        self.session.headers.update(self.headers)
    
    def get_page(self, url, retries=3):
        """获取页面内容，带重试机制"""
        for i in range(retries):
            try:
                # 随机延时，避免被反爬
                time.sleep(random.uniform(1, 3))
                
                # 随机更换User-Agent
                self.session.headers['User-Agent'] = self.ua.random
                
                response = self.session.get(url, timeout=10)
                response.encoding = 'gbk'  # 网站使用gbk编码
                
                if response.status_code == 200:
                    return response.text
                else:
                    print(f"请求失败，状态码: {response.status_code}")
                    
            except Exception as e:
                print(f"请求出错 (尝试 {i+1}/{retries}): {e}")
                if i < retries - 1:
                    time.sleep(random.uniform(2, 5))
        
        return None
    
    def parse_novel_list(self, html):
        """解析小说列表页面"""
        soup = BeautifulSoup(html, 'html.parser')
        novels = []
        
        # 解析推荐小说（顶部大图区域）
        featured_items = soup.find_all('div', class_='item')
        for item in featured_items:
            try:
                title_link = item.find('dt').find('a')
                if title_link:
                    title = title_link.get_text().strip()
                    url = title_link.get('href')
                    author = item.find('dt').find('span').get_text().strip()
                    
                    novels.append({
                        'title': title,
                        'author': author,
                        'url': url
                    })
            except Exception as e:
                print(f"解析推荐小说出错: {e}")
                continue
        
        # 解析更新列表
        list_items = soup.find('ul', class_='txt-list txt-list-row5')
        if list_items:
            for li in list_items.find_all('li'):
                try:
                    title_link = li.find('span', class_='s2').find('a')
                    author_span = li.find('span', class_='s4')
                    
                    if title_link and author_span:
                        title = title_link.get_text().strip()
                        url = title_link.get('href')
                        author = author_span.get_text().strip()
                        
                        novels.append({
                            'title': title,
                            'author': author,
                            'url': url
                        })
                except Exception as e:
                    print(f"解析列表小说出错: {e}")
                    continue
        
        return novels
    
    def get_download_link(self, novel_url):
        """获取小说下载链接"""
        import re
        # 首先尝试在详情页查找直接下载链接
        html = self.get_page(novel_url)
        if not html:
            return None
        
        soup = BeautifulSoup(html, 'html.parser')
        
        # 查找TXT下载链接，使用更精确的选择器
        download_links = soup.find_all('a', class_=re.compile(r'.*btn-dl.*|.*download.*', re.I))
        if not download_links:
            download_links = soup.find_all('a', string=re.compile(r'TXT下载', re.I))
        
        for link in download_links:
            href = link.get('href')
            if href:
                if href.startswith('http'):
                    return href
                elif href.startswith('/'):
                    return f"https://www.qishuxia.com{href}"
                else:
                    return f"https://www.qishuxia.com/{href}"
        
        # 尝试构造下载链接，基于小说ID
        # 从URL中提取小说ID
        match = re.search(r'/book/(\d+)/?', novel_url)
        if match:
            book_id = match.group(1)
            return f"https://www.qishuxia.com/modules/article/txtarticle.php?id={book_id}"
        
        return None
    
    def find_txt_in_read_page(self, read_url):
        """在阅读页面查找TXT下载链接"""
        html = self.get_page(read_url)
        if not html:
            return None
        
        soup = BeautifulSoup(html, 'html.parser')
        
        # 在阅读页面查找下载链接
        download_links = soup.find_all('a', href=re.compile(r'.*\.(txt|TXT).*'))
        
        if download_links:
            return urljoin(read_url, download_links[0].get('href'))
        
        return None
    
    def download_novel(self, novel_info):
        """下载小说文件"""
        print(f"正在处理: {novel_info['title']} - {novel_info['author']}")
        
        # 获取下载链接
        download_url = self.get_download_link(novel_info['url'])
        
        if not download_url:
            print(f"未找到下载链接: {novel_info['title']}")
            return False
        
        try:
            # 下载文件
            response = self.session.get(download_url, timeout=30)
            
            if response.status_code == 200:
                # 清理文件名
                safe_title = re.sub(r'[<>:"/\\|?*]', '_', novel_info['title'])
                filename = f"{safe_title}_{novel_info['author']}.txt"
                filepath = os.path.join(self.download_dir, filename)
                
                # 处理编码并保存文件
                content = response.content
                
                # 尝试不同的编码
                encodings = ['utf-8', 'gbk', 'gb2312', 'big5']
                decoded_content = None
                
                for encoding in encodings:
                    try:
                        decoded_content = content.decode(encoding)
                        break
                    except UnicodeDecodeError:
                        continue
                
                if decoded_content is None:
                    # 如果所有编码都失败，使用utf-8并忽略错误
                    decoded_content = content.decode('utf-8', errors='ignore')
                
                # 以UTF-8编码保存文件
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(decoded_content)
                
                print(f"下载成功: {filename}")
                return True
            else:
                print(f"下载失败，状态码: {response.status_code}")
                
        except Exception as e:
            print(f"下载出错: {e}")
        
        return False
    
    def crawl_pages(self, start_page=1, max_pages=10):
        """爬取指定页数的小说"""
        all_novels = []
        
        for page in range(start_page, max_pages + 2):
            print(f"\n正在爬取第 {page} 页...")
            
            if page == 1:
                url = self.base_url
            else:
                url = f"https://www.qishuxia.com/list/1_{page}.html"
            
            html = self.get_page(url)
            if not html:
                print(f"获取第 {page} 页失败")
                continue
            
            novels = self.parse_novel_list(html)
            print(f"第 {page} 页找到 {len(novels)} 本小说")
            
            all_novels.extend(novels)
            
            # 页面间延时
            time.sleep(random.uniform(2, 4))
        
        print(f"\n总共找到 {len(all_novels)} 本小说")
        
        # 去重
        unique_novels = []
        seen_urls = set()
        
        for novel in all_novels:
            if novel['url'] not in seen_urls:
                unique_novels.append(novel)
                seen_urls.add(novel['url'])
        
        print(f"去重后剩余 {len(unique_novels)} 本小说")
        
        # 开始下载
        success_count = 0
        for i, novel in enumerate(unique_novels, 1):
            print(f"\n[{i}/{len(unique_novels)}] ", end="")
            
            if self.download_novel(novel):
                success_count += 1
            
            # 下载间隔
            time.sleep(random.uniform(3, 6))
        
        print(f"\n爬取完成！成功下载 {success_count}/{len(unique_novels)} 本小说")

def main():
    spider = NovelSpider()
    spider.crawl_pages(1, 10)  # 爬取前10页

if __name__ == "__main__":
    main()