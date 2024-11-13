const puppeteer = require('puppeteer');
const fs = require('fs');

async function analyzeWebsite() {
  const url = 'https://833330.xyz/';
  console.log('开始分析网站...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.goto(url);
    
    // 分析页面结构
    const pageStructure = await page.evaluate(() => {
      function getXPath(element) {
        if (element.id !== '')
          return `//*[@id="${element.id}"]`;
        
        if (element === document.body)
          return '/html/body';
        
        let ix = 0;
        let siblings = element.parentNode.childNodes;
        
        for (let sibling of siblings) {
          if (sibling === element)
            return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase();
          if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
            ix++;
        }
        
        return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
      }

      return {
        searchBox: document.querySelector('input[type="search"]'),
        bookList: document.querySelector('.book-list, .novel-list'),
        bookItems: Array.from(document.querySelectorAll('.book-item, .novel-item')),
        chapterList: document.querySelector('.chapter-list, #chapter-list'),
        content: document.querySelector('.chapter-content, #content')
      };
    });

    // 生成书源
    const bookSource = {
      bookSourceName: "833330小说",
      bookSourceUrl: "https://833330.xyz",
      bookSourceGroup: "小说",
      enabled: true,
      searchUrl: "https://833330.xyz/search?keyword={{key}}",
      ruleSearch: {
        bookList: "//div[contains(@class, 'novel-item')]",
        name: "//h3[contains(@class, 'novel-title')]/text()",
        author: "//div[contains(@class, 'novel-author')]/text()",
        coverUrl: "//img[contains(@class, 'novel-cover')]/@src",
        bookUrl: "//a[contains(@class, 'novel-link')]/@href",
        lastChapter: "//div[contains(@class, 'latest-chapter')]/text()"
      },
      ruleBookInfo: {
        name: "//h1[contains(@class, 'novel-title')]/text()",
        author: "//div[contains(@class, 'author-name')]/text()",
        coverUrl: "//div[contains(@class, 'novel-cover')]//img/@src",
        intro: "//div[contains(@class, 'novel-intro')]/text()",
        lastChapter: "//div[contains(@class, 'latest-chapter')]/a/text()",
        catalog: "//div[contains(@class, 'chapter-list')]"
      },
      ruleContent: {
        content: "//div[contains(@class, 'chapter-content')]"
      }
    };
    
    // 保存书源
    fs.writeFileSync('./src/generatedBookSource.json', JSON.stringify(bookSource, null, 2));
    console.log('\n✅ 书源生成成功！已保存到 generatedBookSource.json');
    console.log('\n提示:');
    console.log('1. 请在阅读APP中测试书源');
    console.log('2. 可能需要根据实际情况调整XPath规则');
    
  } catch (error) {
    console.error('分析过程出错:', error);
  } finally {
    await browser.close();
  }
}

analyzeWebsite();