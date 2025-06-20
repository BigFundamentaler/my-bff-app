#!/bin/bash
echo "=== 调试应用启动问题 ==="

echo "1. 检查文件结构..."
ls -la

echo -e "\n2. 检查关键目录..."
ls -la views/ assets/ services/ routers/ logs/ 2>/dev/null || echo "某些目录不存在"

echo -e "\n3. 检查Node版本..."
node --version

echo -e "\n4. 检查依赖..."
npm list --depth=0 | head -10

echo -e "\n5. 手动测试启动..."
timeout 10s npx ts-node app.ts || echo "手动启动失败或超时"

echo -e "\n6. 检查端口占用..."
sudo lsof -i :8081 || echo "端口8081未被占用"

echo -e "\n7. PM2状态..."
pm2 status

echo -e "\n8. 最新错误日志..."
pm2 logs yd-app --err --lines 10 2>/dev/null || echo "无法获取PM2日志"