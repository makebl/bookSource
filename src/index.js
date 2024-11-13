const inquirer = require('inquirer');
const fs = require('fs');
const { analyzePage } = require('./utils/analyzer');
const { validateBookSource } = require('./utils/validator');
const { generateBookSource } = require('./templates/bookSource');

async function main() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'websiteUrl',
        message: '请输入要分析的网站URL:',
        validate: input => input.startsWith('http') ? true : '请输入有效的URL'
      },
      {
        type: 'input',
        name: 'bookSourceName',
        message: '请输入书源名称:',
      }
    ]);

    console.log('开始分析网站结构...');
    const analysis = await analyzePage(answers.websiteUrl);
    
    console.log('生成书源模板...');
    const bookSource = generateBookSource(analysis, answers.websiteUrl, answers.bookSourceName);
    
    // 验证生成的书源
    const validation = validateBookSource(bookSource);
    if (!validation.isValid) {
      console.error('书源验证失败:', validation.errors.join('\n'));
      return;
    }

    // 保存书源
    const outputPath = './src/generatedBookSource.json';
    fs.writeFileSync(outputPath, JSON.stringify(bookSource, null, 2));
    
    console.log(`\n✅ 书源生成成功！已保存到: ${outputPath}`);
    console.log('\n提示:');
    console.log('1. 请检查生成的规则是否符合网站实际结构');
    console.log('2. 可能需要调整搜索URL格式');
    console.log('3. 建议实际测试后再使用');
    
  } catch (error) {
    console.error('程序执行失败:', error.message);
  }
}

main();