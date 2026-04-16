# LLM Wiki - Agent Configuration

这是一个基于 LLM 的个人知识库系统，支持文档和代码库的摄取、查询和维护。

## 项目概述

LLM Wiki 是一个持久化、可累积的知识管理系统。与传统的 RAG 系统不同，LLM Wiki 增量构建并维护一个结构化的 wiki，包含相互链接的 markdown 文件，位于原始源文档和用户之间。

### 核心特性

- **持久化知识积累**: 知识编译一次并保持最新，而非每次查询重新推导
- **自动交叉引用**: LLM 自动维护页面间的链接和关系
- **矛盾检测**: 自动标记新数据与旧声明的矛盾
- **支持多种源**: 文档、代码库、架构图等
- **双系统支持**: 同时支持 Claude Code 和 GitHub Copilot

## 目录结构

```
llm-wiki/
├── AGENTS.md                    # 本文件 - Agent 配置
├── README.md                    # 项目说明文档
├── llm-wiki.md                  # 原始设计文档
│
├── .claude/                     # 技能目录（Claude Code + GitHub Copilot）
│   └── skills/
│       ├── ingest-source/       # 摄取源文档
│       ├── ingest-codebase/     # 摄取代码库
│       ├── query-wiki/          # 查询 wiki
│       └── lint-wiki/           # 检查 wiki
│
├── raw/                         # 源文档目录（不可变）
│   ├── documents/               # 文档类源
│   ├── codebases/               # 代码库
│   └── assets/                  # 资源文件
│       ├── diagrams/            # 架构图
│       └── images/              # 图片
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
    ├── systems/                 # 系统页面（按系统名称组织）
    │   └── {system-name}/       # 系统目录
    │       └── {system-name}.md # 系统页面
    ├── components/              # 组件页面（按系统名称组织）
    │   └── {system-name}/       # 系统组件目录
    │       └── {module-name}.md # 组件页面
    ├── services/                # 服务/API页面（按系统名称组织）
    │   └── {system-name}/       # 系统服务目录
    │       └── {service-name}.md # 服务页面
    ├── data-models/             # 数据模型页面（按系统名称组织）
    │   └── {system-name}/       # 系统数据模型目录
    │       └── {entity-name}.md # 数据模型页面
    ├── dependencies/            # 依赖关系页面（按系统名称组织）
    │   └── {system-name}/       # 系统依赖目录
    │       └── dependencies.md  # 依赖关系页面
    └── architectures/           # 架构文档
        ├── diagrams/            # 架构图页面
        │   └── system-designs/  # 系统架构图（按系统名称组织）
        │       └── {system-name}/ # 系统架构图目录
        │           └── architecture.md # 架构图页面
        └── relationships/       # 关系映射页面
```

## 核心操作

### 1. Ingest（摄取）

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

### 2. Query（查询）

查询 wiki 并生成答案。

**可用技能**:
- `/query-wiki` - 查询 wiki 并生成答案

**流程**:
1. 读取 `index.md` 找到相关页面
2. 读取相关页面内容
3. 综合答案并添加引用
4. 可选：将答案保存为新的 wiki 页面

### 3. Lint（检查）

健康检查 wiki，发现问题并建议改进。

**可用技能**:
- `/lint-wiki` - 检查 wiki 健康度

**检查项**:
- 页面间的矛盾
- 过时的声明
- 孤儿页面（无入站链接）
- 缺失的交叉引用
- 提及但未创建页面的概念

## Wiki 页面类型

### 通用知识页面

| 类型 | 目录 | 用途 | 模板 |
|-----|------|------|------|
| 摘要 | `summaries/` | 综合摘要、主题摘要 | `summary-template.md` |
| 实体 | `entities/` | 人物、组织、地点 | `entity-template.md` |
| 概念 | `concepts/` | 理论、方法、技术 | `concept-template.md` |
| 源文档 | `sources/` | 源文档摘要 | `source-template.md` |
| 分析 | `analyses/` | 对比分析、查询结果 | `comparison-template.md` |

### 系统架构页面

| 类型 | 目录 | 用途 | 模板 |
|-----|------|------|------|
| 系统 | `systems/` | 系统概览 | `system-template.md` |
| 组件 | `components/` | 系统组件 | `component-template.md` |
| 服务 | `services/` | API/服务 | `service-template.md` |
| 数据模型 | `data-models/` | 实体/表结构 | `data-model-template.md` |
| 依赖关系 | `dependencies/` | 依赖管理 | `dependency-template.md` |
| 架构图 | `architectures/diagrams/` | 架构图 | `architecture-diagram-template.md` |

## 页面约定

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

### 架构图格式

- **ArchiMate 图**: 使用 PlantUML（`wiki/templates/plantuml/ArchiMate.puml`）
- **UML 类图**: 使用 Mermaid `classDiagram`
- **UML 时序图**: 使用 Mermaid `sequenceDiagram`
- **流程图**: 使用 Mermaid `graph`
- **ER 图**: 使用 Mermaid `erDiagram`

## 技能使用指南

### 摄取文档

```
/ingest-source raw/documents/article.md
```

### 摄取代码库

```
/ingest-codebase raw/codebases/project-a
```

### 查询 Wiki

```
/query-wiki 订单系统包含哪些组件？
```

### 检查 Wiki

```
/lint-wiki
```

## 最佳实践

### 1. 源文档管理

- 将源文档放在 `raw/documents/` 目录
- 源文档不可变，LLM 只读不写
- 图片等资源放在 `raw/assets/` 目录

### 2. Wiki 维护

- 定期运行 `/lint-wiki` 检查 wiki 健康度
- 重要查询结果应保存为新的 wiki 页面
- 保持 `index.md` 和 `log.md` 的更新

### 3. 架构文档

- ArchiMate 图使用 PlantUML 格式
- 其他图表使用 Mermaid 格式
- 架构图应包含详细的文字说明和链接

### 4. 代码库摄取

- 摄取前确保代码库在 `raw/codebases/` 目录
- 摄取后人工审核生成的页面
- 补充业务背景和设计意图

## 工具集成

### Obsidian

推荐使用 Obsidian 作为 wiki 的浏览和编辑工具：

- **Graph View**: 可视化页面关系
- **Dataview**: 查询 frontmatter 数据
- **Mermaid**: 原生支持 Mermaid 图表
- **PlantUML**: 需安装 PlantUML 插件

### 版本控制

Wiki 是纯 markdown 文件，天然支持 Git：

- 版本历史追踪
- 分支和合并
- 协作编辑

## 扩展性

### 添加新的页面类型

1. 在 `wiki/templates/` 创建新模板
2. 在 `wiki/` 创建对应目录
3. 更新 `AGENTS.md` 中的页面类型表
4. 更新相关技能以支持新类型

### 添加新的技能

1. 在 `.claude/skills/` 创建新技能目录
2. 创建 `SKILL.md` 文件（包含 YAML frontmatter）
3. 在 `AGENTS.md` 中添加技能说明

## 注意事项

1. **不要修改源文档**: `raw/` 目录中的文件是只读的
2. **保持 frontmatter 一致**: 所有页面都应包含标准 frontmatter
3. **使用双向链接**: 使用 `[[page-name]]` 语法建立链接
4. **定期 lint**: 定期运行 lint 检查 wiki 健康度
5. **版本追踪**: 在 `log.md` 中记录所有操作

## 参考文档

- 原始设计文档: `llm-wiki.md`
- 使用指南: `README.md`
- 模板目录: `wiki/templates/`
