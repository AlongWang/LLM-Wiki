---
mode: agent
description: 初始化 LLM Wiki 仓库并验证本地 QMD 检索环境
---

# 初始化 LLM Wiki 仓库

目标：为新用户完成仓库初始化，并验证本地检索环境是否可用。

执行要求：

1. 先阅读 `README.md`、`scripts/init-repo.js`、`scripts/setup-qmd.js`，理解初始化流程。
2. 执行 `npm run init:repo`。
3. 如果系统没有安装 QMD，不要改代码；直接说明缺少的依赖，并给出下一步安装命令。
4. 如果 QMD 已安装，继续验证以下命令：
   - `qmd collection show wiki`
   - `qmd status`
   - `qmd search "Wiki" -c wiki`
5. 汇总初始化结果，明确说明：
   - 创建了哪些目录
   - `wiki` collection 是否指向仓库根目录下的 `wiki/`
   - QMD 是否可用
   - 后续用户应该把文档和代码库放到哪里

约束：

- 不要修改 `raw/` 下的用户源文件。
- 不要删除现有 wiki 页面。
- 如果初始化已经完成，只做验证和状态说明，不重复做无关修改。
