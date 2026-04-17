# LLM Wiki

一个基于 LLM 的个人知识库系统，支持文档和代码库的摄取、查询和维护。

## 🎯 核心特性

- **持久化知识积累** - 知识编译一次并保持最新，而非每次查询重新推导
- **自动交叉引用** - LLM 自动维护页面间的链接和关系
- **矛盾检测** - 自动标记新数据与旧声明的矛盾
- **支持多种源** - 文档、代码库、架构图等
- **双系统支持** - 同时支持 Claude Code 和 GitHub Copilot
- **Markdown 格式** - 所有内容使用 Markdown 格式，版本控制友好
- **QMD 集成** - 使用 QMD 混合搜索引擎增强查询能力

## 📦 项目结构

```
llm-wiki/
├── AGENTS.md                    # Agent 配置文件
├── README.md                    # 本文件
├── llm-wiki.md                  # 原始设计文档
├── prompts/                     # 可复用的 AI prompt 文件
│
├── .claude/skills/              # 技能目录
│   ├── ingest-source/           # 摄取源文档
│   ├── ingest-codebase/         # 摄取代码库
│   ├── query-wiki/              # 查询 wiki
│   └── lint-wiki/               # 检查 wiki
│
├── raw/                         # 源文档目录（不可变）
│   ├── documents/               # 文档类源
│   ├── codebases/               # 代码库
│   └── assets/                  # 资源文件
│
└── wiki/                        # Wiki 内容目录（LLM 维护）
    ├── index.md                 # 内容目录索引
    ├── log.md                   # 操作日志
    ├── overview.md              # Wiki 综合概述
    ├── templates/               # 页面模板
    ├── summaries/               # 摘要页面
    ├── entities/                # 实体页面
    ├── concepts/                # 概念页面
    ├── sources/                 # 源文档摘要
    ├── analyses/                # 分析页面
    ├── systems/                 # 系统页面
    ├── components/              # 组件页面
    ├── services/                # 服务/API页面
    ├── data-models/             # 数据模型页面
    ├── dependencies/            # 依赖关系页面
    └── architectures/           # 架构文档
```

## 🚀 快速开始

### 0. 初始化仓库

新用户建议先运行统一初始化脚本：

```bash
npm run init:repo
```

如果你暂时不想安装 QMD，只初始化目录骨架：

```bash
npm run init:repo:skip-qmd
```

如果你想让 AI 代为执行初始化，可以直接让 AI 读取并执行：

```text
prompts/init-repo.prompt.md
```

### 1. 摄取源文档

将源文档放入 `raw/documents/` 目录，然后使用技能：

```
/ingest-source raw/documents/article.md
```

### 2. 摄取代码库

将代码库放入 `raw/codebases/` 目录，然后使用技能：

```
/ingest-codebase raw/codebases/project-a
```

### 3. 查询 Wiki

使用自然语言查询：

```
/query-wiki 订单系统包含哪些组件？
```

### 4. 检查 Wiki

定期检查 wiki 健康度：

```
/lint-wiki
```

## 📚 核心操作

### Ingest（摄取）

摄取新的源文档或代码库到 wiki 中。

**可用技能**:
- `/ingest-source` - 摄取文档类源（文章、论文、设计文档等）
- `/ingest-codebase` - 摄取代码库（提取系统架构、服务、数据模型等）

**流程**:
1. 读取源文档/代码库
2. 提取关键信息
3. 生成 wiki 页面
4. 更新相关页面
5. 更新 `index.md`
6. 记录到 `log.md`

### Query（查询）

查询 wiki 并生成答案。

**可用技能**:
- `/query-wiki` - 查询 wiki 并生成答案

**流程**:
1. 读取 `index.md` 找到相关页面
2. 读取相关页面内容
3. 综合答案并添加引用
4. 可选：将答案保存为新的 wiki 页面

### Lint（检查）

健康检查 wiki，发现问题并建议改进。

**可用技能**:
- `/lint-wiki` - 检查 wiki 健康度

**检查项**:
- 页面间的矛盾
- 过时的声明
- 孤儿页面（无入站链接）
- 缺失的交叉引用
- 提及但未创建页面的概念

## 📄 页面类型

### 通用知识页面

| 类型 | 目录 | 用途 |
|-----|------|------|
| 摘要 | `summaries/` | 综合摘要、主题摘要 |
| 实体 | `entities/` | 人物、组织、地点 |
| 概念 | `concepts/` | 理论、方法、技术 |
| 源文档 | `sources/` | 源文档摘要 |
| 分析 | `analyses/` | 对比分析、查询结果 |

### 系统架构页面

| 类型 | 目录 | 用途 |
|-----|------|------|
| 系统 | `systems/` | 系统概览 |
| 组件 | `components/` | 系统组件 |
| 服务 | `services/` | API/服务 |
| 数据模型 | `data-models/` | 实体/表结构 |
| 依赖关系 | `dependencies/` | 依赖管理 |
| 架构图 | `architectures/diagrams/` | 架构图 |

## 🎨 架构图格式

| 图表类型 | 格式 | 原因 |
|---------|------|------|
| **ArchiMate 图** | PlantUML | 原生支持，标准库完整 |
| **UML 类图** | Mermaid | 简洁易读，Obsidian 原生支持 |
| **UML 时序图** | Mermaid | 简洁易读，Obsidian 原生支持 |
| **流程图** | Mermaid | 简洁易读，Obsidian 原生支持 |
| **ER 图** | Mermaid | 原生支持 erDiagram |

## 🔧 工具集成

### QMD 搜索引擎

LLM Wiki 集成了 [QMD](https://github.com/tobi/qmd) 作为搜索引擎，提供：

- **混合搜索** - BM25 全文搜索 + 向量语义搜索 + LLM 重排序
- **本地运行** - 所有模型本地运行，数据隐私保护
- **MCP 集成** - 与 Claude Code 无缝集成
- **智能分块** - Markdown 智能分块，AST 感知分块（代码文件）

#### 安装 QMD

```bash
# 使用 npm 安装
npm install -g @tobilu/qmd

# 或使用 Bun 安装
bun install -g @tobilu/qmd
```

#### 初始化索引

```bash
# 推荐：统一初始化仓库并配置 QMD
npm run init:repo

# 或仅执行 QMD 配置
npm run setup:qmd
```

#### MCP 集成

在 `~/.claude/settings.json` 中添加：

```json
{
  "mcpServers": {
    "qmd": {
      "command": "qmd",
      "args": ["mcp"]
    }
  }
}
```

详细配置请参考 [QMD 集成指南](docs/qmd-integration.md)。

### Obsidian

推荐使用 Obsidian 作为 wiki 的浏览和编辑工具：

- **Graph View** - 可视化页面关系
- **Dataview** - 查询 frontmatter 数据
- **Mermaid** - 原生支持 Mermaid 图表
- **PlantUML** - 需安装 PlantUML 插件

### 版本控制

Wiki 是纯 markdown 文件，天然支持 Git：

- 版本历史追踪
- 分支和合并
- 协作编辑

## 📖 使用指南

### 源文档管理

- 将源文档放在 `raw/documents/` 目录
- 源文档不可变，LLM 只读不写
- 图片等资源放在 `raw/assets/` 目录

### 仓库初始化

- 新用户优先运行 `npm run init:repo`
- 如果只想创建目录，不初始化 QMD，使用 `npm run init:repo:skip-qmd`
- 需要让 AI 代为执行时，可使用 `prompts/init-repo.prompt.md`

### Wiki 维护

- 定期运行 `/lint-wiki` 检查 wiki 健康度
- 重要查询结果应保存为新的 wiki 页面
- 保持 `index.md` 和 `log.md` 的更新

### 架构文档

- ArchiMate 图使用 PlantUML 格式
- 其他图表使用 Mermaid 格式
- 架构图应包含详细的文字说明和链接

### 代码库摄取

- 摄取前确保代码库在 `raw/codebases/` 目录
- 摄取后人工审核生成的页面
- 补充业务背景和设计意图

## 📝 页面约定

### YAML Frontmatter

所有 wiki 页面应包含 YAML frontmatter：

```yaml
---
tags: [tag1, tag2, tag3]
date: 2026-04-16
source_count: 3
status: draft | published | archived
type: entity | concept | source | system | component | service | ...
---
```

### 双向链接

使用 Obsidian 风格的双向链接：

```markdown
- 相关概念: [[concept-name]]
- 相关系统: [[system-name]]
- 参考源文档: [[source-document]]
```

## 🛠️ 扩展性

### 添加新的页面类型

1. 在 `wiki/templates/` 创建新模板
2. 在 `wiki/` 创建对应目录
3. 更新 `AGENTS.md` 中的页面类型表
4. 更新相关技能以支持新类型

### 添加新的技能

1. 在 `.claude/skills/` 创建新技能目录
2. 创建 `SKILL.md` 文件（包含 YAML frontmatter）
3. 在 `AGENTS.md` 中添加技能说明

## ⚠️ 注意事项

1. **不要修改源文档** - `raw/` 目录中的文件是只读的
2. **保持 frontmatter 一致** - 所有页面都应包含标准 frontmatter
3. **使用双向链接** - 使用 `[[page-name]]` 语法建立链接
4. **定期 lint** - 定期运行 lint 检查 wiki 健康度
5. **版本追踪** - 在 `log.md` 中记录所有操作

## 📚 参考文档

- 原始设计文档: `llm-wiki.md`
- Agent 配置: `AGENTS.md`
- 模板目录: `wiki/templates/`
- PlantUML ArchiMate 库: `wiki/templates/plantuml/ArchiMate.puml`

## 🤝 贡献

这是一个个人知识库系统，但欢迎提出改进建议：

1. 提交 Issue 描述问题或建议
2. 提交 Pull Request 改进代码或文档

## 📄 许可证

MIT License

---

**开始使用**: 先运行 `npm run init:repo`，再将源文档放入 `raw/documents/` 或代码库放入 `raw/codebases/`，然后使用 `/ingest-source` 或 `/ingest-codebase` 技能开始构建你的知识库！