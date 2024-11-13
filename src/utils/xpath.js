// XPath 工具函数
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

module.exports = { getXPath };