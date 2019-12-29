const shell = require('shelljs');
const program = require('commander');
program.version('0.0.1').description('用于个人博客的快捷命令行工具');

const gotoCurrent = () => {
    shell.cd('~/desktop/imbrb/source/_posts');
};

// 展示文章列表
program
    .command('list')
    .description('list the essay list')
    .action(() => {
        // shell.cd('~/desktop/imbrb/source/_posts');
        const pwd = shell.pwd();
        shell.echo(pwd);
        shell.cd('~/desktop/imbrb/source/_posts');
        // 拉取最新代码仓库
        shell.exec('git pull origin master');
        shell.ls('*.md').forEach((file) => {
            const essayName = file.slice(0, -3);
            shell.echo(essayName);
        });
    });
// 新建文章
program
    .command('new <essay>')
    .description('new essay called <essay>')
    .action((essay) => {
        // 创建一篇文档 并用 typora 打开
        const md = '/Applications/Typora.app/Contents/MacOS/Typora';
        gotoCurrent();
        shell.exec(`hexo new "#${essay}"`);
        shell.exec(`${md} ${essay}.md`);
    });
// 打开现有文章
program
    .command('open <essay>')
    .description('open a exist essay called <essay>')
    .action((essay) => {
        // 创建一篇文档 并用 typora 打开
        const md = '/Applications/Typora.app/Contents/MacOS/Typora';
        gotoCurrent();
        let hasEssay = false;
        shell.ls('*.md').forEach((file) => {
            const essayName = file.slice(0, -3);
            `${essayName}` === essay && (hasEssay = true);
        });
        if (hasEssay) {
            shell.exec(`${md} ${essay}.md`);
        } else {
            shell.echo(`No such '${essay}' name, Please 'new <essay>' it~`);
        }
    });
// 将文章部署到我的博客
program
    .command('push')
    .description('deploy change to website --IMBRB')
    .action(() => {
        // 同步服务器端代码库 & 同步 github 端 代码库
        console.log('deploying your commit...');
        gotoCurrent();
        shell.exec('hexo clean && hexo g && hexo d');
    });

    
program.parse(process.argv);