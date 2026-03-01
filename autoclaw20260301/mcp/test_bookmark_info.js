// 测试获取书签信息的脚本
const WebSocket = require('ws');

// MCP服务器地址和token
const MCP_SERVER = 'ws://localhost:30000';
const TOKEN = 'autoclaw_builtin_Q0hpK2oV4F9tlwbYX3RELxiJNGDvayr8OPqZzkfs';

// 连接到MCP服务器
const ws = new WebSocket(`${MCP_SERVER}/extension?token=${TOKEN}`);

ws.on('open', function open() {
    console.log('已连接到MCP服务器');
    
    // 发送初始化消息
    ws.send(JSON.stringify({
        type: 'initialize',
        version: '1.0'
    }));
    
    // 发送ping消息
    setInterval(() => {
        ws.send(JSON.stringify({ type: 'ping' }));
    }, 30000);
    
    // 获取书签树
    setTimeout(() => {
        console.log('获取书签树...');
        ws.send(JSON.stringify({
            type: 'bookmark',
            action: 'getTree'
        }));
    }, 1000);
});

// 计算文件夹数量
function countFolders(tree) {
    let count = 0;
    
    function traverse(node) {
        if (node.children) {
            count++;
            for (const child of node.children) {
                traverse(child);
            }
        }
    }
    
    if (Array.isArray(tree)) {
        for (const node of tree) {
            traverse(node);
        }
    }
    
    return count;
}

// 收集所有书签链接
function collectBookmarks(tree) {
    const bookmarks = [];
    
    function traverse(node) {
        if (node.url) {
            bookmarks.push({
                title: node.title,
                url: node.url,
                id: node.id
            });
        } else if (node.children) {
            for (const child of node.children) {
                traverse(child);
            }
        }
    }
    
    if (Array.isArray(tree)) {
        for (const node of tree) {
            traverse(node);
        }
    }
    
    return bookmarks;
}

// 处理服务器响应
ws.on('message', function incoming(data) {
    try {
        const message = JSON.parse(data);
        
        if (message.type === 'bookmark' && message.action === 'getTree' && message.data) {
            const bookmarkTree = message.data;
            
            // 计算文件夹数量
            const folderCount = countFolders(bookmarkTree);
            console.log(`文件夹数量: ${folderCount}`);
            
            // 收集所有书签
            const bookmarks = collectBookmarks(bookmarkTree);
            console.log(`书签总数: ${bookmarks.length}`);
            
            // 随机返回一个书签
            if (bookmarks.length > 0) {
                const randomIndex = Math.floor(Math.random() * bookmarks.length);
                const randomBookmark = bookmarks[randomIndex];
                console.log('随机书签:');
                console.log(`标题: ${randomBookmark.title}`);
                console.log(`URL: ${randomBookmark.url}`);
                console.log(`ID: ${randomBookmark.id}`);
            } else {
                console.log('没有找到书签');
            }
            
            // 打印书签树结构（简化版）
            console.log('\n书签树结构:');
            function printTree(node, indent = 0) {
                const prefix = '  '.repeat(indent);
                if (node.url) {
                    console.log(`${prefix}📄 ${node.title} (${node.url})`);
                } else {
                    console.log(`${prefix}📁 ${node.title}`);
                    if (node.children) {
                        for (const child of node.children) {
                            printTree(child, indent + 1);
                        }
                    }
                }
            }
            
            if (Array.isArray(bookmarkTree)) {
                for (const node of bookmarkTree) {
                    printTree(node);
                }
            }
            
            // 关闭连接
            ws.close();
        } else if (message.type === 'error') {
            console.error('错误:', message.message);
            ws.close();
        }
    } catch (error) {
        console.error('解析消息时出错:', error);
    }
});

// 处理连接错误
ws.on('error', function error(error) {
    console.error('连接错误:', error);
});

// 处理连接关闭
ws.on('close', function close() {
    console.log('连接已关闭');
});
