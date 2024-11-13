// 书源验证工具
function validateBookSource(bookSource) {
  const requiredFields = ['bookSourceName', 'bookSourceUrl', 'searchUrl'];
  const errors = [];
  
  for (const field of requiredFields) {
    if (!bookSource[field]) {
      errors.push(`缺少必需字段: ${field}`);
    }
  }

  // 验证URL格式
  if (bookSource.bookSourceUrl && !isValidUrl(bookSource.bookSourceUrl)) {
    errors.push('无效的书源URL格式');
  }

  if (bookSource.searchUrl && !bookSource.searchUrl.includes('{{key}}')) {
    errors.push('搜索URL必须包含 {{key}} 占位符');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

module.exports = { validateBookSource };