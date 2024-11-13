const puppeteer = require('puppeteer');
const fs = require('fs');

async function analyzePage(url) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.goto(url);
    
    const analysis = await page.evaluate(() => {
      // 分析书籍列表元素
      function findBookElements() {
        return Array.from(document.querySelectorAll('div')).filter(div => {
          const hasTitle = div.querySelector('h1, h2, h3, h4, a');
          const hasAuthor = div.textContent.includes('作者') || div.textContent.includes('著');
          return hasTitle && hasAuthor;
        });
      }

      // 分析章节列表
      function findChapterList() {
        const possibleElements = [
          document.querySelector('#chapter-list'),
          document.querySelector('.chapter-list'),
          document.querySelector('.catalog'),
          ...document.querySelectorAll('div.chapters')
        ].filter(Boolean);

        return possibleElements.map(el => ({
          xpath: getXPath(el),
          sampleText: el.textContent.slice(0, 100)
        }));
      }

      // 分析正文内容
      function findContentElement() {
        const possibleElements = [
          document.querySelector('#content'),
          document.querySelector('.content'),
          document.querySelector('.chapter-content'),
          document.querySelector('article')
        ].filter(Boolean);

        return possibleElements.map(el => ({
          xpath: getXPath(el),
          sampleText: el.textContent.slice(0, 100)
        }));
      }

      return {
        bookElements: findBookElements(),
        chapterLists: findChapterList(),
        contentElements: findContentElement()
      };
    });

    return analysis;
    
  } finally {
    await browser.close();
  }
}

module.exports = { analyzePage };