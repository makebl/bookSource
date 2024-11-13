// 书源模板生成器
function generateBookSource(analysis, baseUrl, sourceName) {
  return {
    bookSourceName: sourceName,
    bookSourceUrl: baseUrl,
    bookSourceGroup: "测试",
    enabled: true,
    searchUrl: `${baseUrl}/search?key={{key}}`,
    ruleSearch: {
      bookList: analysis.bookElements[0]?.xpath || "//div[contains(@class,'book-list')]/div",
      name: ".//h3[contains(@class,'title')]|.//a[contains(@class,'name')]",
      author: ".//p[contains(@class,'author')]|.//span[contains(@class,'author')]",
      coverUrl: ".//img[contains(@class,'cover')]/@src",
      bookUrl: ".//a/@href"
    },
    ruleBookInfo: {
      name: "//h1[contains(@class,'name')]|//h1[contains(@class,'title')]",
      author: "//span[contains(@class,'author')]|//p[contains(@class,'author')]",
      coverUrl: "//div[contains(@class,'cover')]//img/@src",
      intro: "//div[contains(@class,'intro')]|//div[contains(@class,'summary')]",
      lastChapter: "//div[contains(@class,'last-chapter')]//a",
      catalog: analysis.chapterLists[0]?.xpath || "//*[@id='catalog-list']"
    },
    ruleContent: {
      content: analysis.contentElements[0]?.xpath || "//*[@id='chapter-content']"
    }
  };
}

module.exports = { generateBookSource };