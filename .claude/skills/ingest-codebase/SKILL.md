---
name: ingest-codebase
description: "分析代码库并提取系统架构、服务、组件、数据模型等信息，生成 wiki 页面。支持 Node.js、Java、Python、Go、Rust 等项目"
argument-hint: "[codebase-path]"
user-invocable: true
---

# Ingest Codebase

## 目标

分析代码库，提取架构信息，生成结构化的 wiki 页面。

## 输入

- 代码库路径（如 `raw/codebases/project-a`）
- 可选：分析范围（全部/特定模块）

## 分析流程

### 1. 项目识别

根据项目类型读取配置文件。详细的项目类型识别规则参考：[project-types.md](./references/project-types.md)

**支持的项目类型**：
- Node.js：`package.json`、`tsconfig.json`
- Java：`pom.xml`、`build.gradle`、`application.yml`
- Python：`requirements.txt`、`pyproject.toml`
- Go：`go.mod`
- Rust：`Cargo.toml`

提取项目信息：名称、版本、描述、语言、框架、技术栈等。

### 1.1 QMD 预索引（推荐）

如果代码库已经放入 `raw/codebases/`，先刷新索引并生成向量，便于后续做语义检索：

```bash
qmd update
qmd embed
```

对于大型代码库，优先结合 AST-aware chunking：

```bash
qmd embed --chunk-strategy auto
qmd vsearch "authentication middleware implementation" -c raw-codebases
```

### 2. 架构分析

详细的架构分析规则参考：[architecture-analysis.md](./references/architecture-analysis.md)

**分析内容**：
- 目录结构扫描，识别模块和组件
- 模块职责分析（通过代码结构和命名）
- 技术栈识别（依赖和框架）

结合 QMD 做定向定位：

- 用 `qmd search` 找显式入口，如 `controller`、`router`、`service`
- 用 `qmd vsearch` 找语义相关实现，如认证、下单、库存扣减
- 用 `qmd multi-get` 批量取回候选文件片段，再做结构化归纳

### 3. 服务/API 分析

提取每个服务的端点信息：
- HTTP 方法、路径、参数、返回值
- 认证、授权、速率限制
- 错误处理和异常情况

### 4. 数据模型分析

提取实体和数据模型：
- 表/集合字段定义、类型、约束
- 关系映射（一对多、多对多等）
- 业务规则和验证规则

### 5. 依赖分析

分析项目依赖：
- 外部依赖（版本、用途）
- 内部依赖（模块间调用关系）
- 运行时和开发依赖分类

可结合以下命令快速做依赖定位：

```bash
qmd search "package.json dependencies" -c raw-codebases
qmd search "pom.xml dependency" -c raw-codebases
qmd vsearch "database model repository" -c raw-codebases
```

### 6. 写入后刷新索引

生成或更新 wiki 页面后，刷新索引与向量：

```bash
qmd update
qmd embed
```

这样后续 `/query-wiki` 和 `/lint-wiki` 能立即检索到新内容。

## 生成 Wiki 页面

所有页面按系统名称组织在子目录中。详细的页面模板参考：[page-templates.md](./references/page-templates.md)

### 页面类型

| 类型 | 目录 | 说明 |
|-----|------|------|
| 系统页面 | `wiki/systems/{system}/` | 系统概览 |
| 组件页面 | `wiki/components/{system}/` | 模块、服务组件 |
| 服务页面 | `wiki/services/{system}/` | API 端点 |
| 数据模型 | `wiki/data-models/{system}/` | 实体、表结构 |
| 依赖关系 | `wiki/dependencies/{system}/` | 依赖管理 |
| 架构图 | `wiki/architectures/diagrams/` | 系统架构 |

### 页面内容

每个页面包含：

**系统页面** (`{system}.md`)
- 系统概述、技术栈
- 核心模块和提供的服务列表
- 架构图和相关文档链接

**组件页面** (`{module}.md`)
- 模块职责、所属系统
- 提供的服务和依赖关系
- 代码位置信息

**服务页面** (`{service}.md`)
- API 信息（方法、路径、认证）
- 请求参数和返回值
- 业务流程（时序图/流程图）

**数据模型页面** (`{entity}.md`)
- 字段定义、索引、约束
- 关系映射（ER 图）
- 业务规则

**依赖关系页面** (`dependencies.md`)
- 外部依赖列表和用途
- 内部模块依赖关系图
- 版本兼容性

**架构图页面**
- 系统架构 Mermaid 图表
- 组件交互说明
- 技术栈说明

## 目录结构示例

```
wiki/
├── systems/order-service/
│   └── order-service.md
├── components/order-service/
│   ├── order-module.md
│   ├── payment-module.md
│   └── inventory-module.md
├── services/order-service/
│   ├── create-order.md
│   ├── query-order.md
│   └── update-order.md
├── data-models/order-service/
│   ├── order.md
│   ├── order-item.md
│   └── customer.md
├── dependencies/order-service/
│   └── dependencies.md
└── architectures/diagrams/system-designs/
    └── order-service/
        └── architecture.md
```

## 输出报告

分析完成后，生成摘要报告：

```
✅ 成功分析代码库: {system-name}

📊 统计:
- 识别模块: N 个
- 提取服务: N 个
- 提取数据模型: N 个
- 识别依赖: N 个

📄 生成的页面:
- 系统页面: {count} 个
- 组件页面: {count} 个
- 服务页面: {count} 个
- 数据模型页面: {count} 个
- 依赖关系页面: {count} 个
- 架构图页面: {count} 个

⚠️ 需要人工补充:
- 业务背景和设计意图
- 非功能性需求
- 部署和运维信息
```

## YAML Frontmatter 约定

所有生成的页面应包含标准 frontmatter：

```yaml
---
tags: [tag1, tag2]
date: 2026-04-16
source_count: 1
status: published
type: system|component|service|data-model|dependency|architecture
system: {system-name}
codebase_path: raw/codebases/{project}
---
```

## 注意事项

1. **代码隐私**：不要将敏感信息（密钥、密码）写入 wiki
2. **版本追踪**：记录分析的代码库版本/commit hash
3. **增量更新**：支持增量分析，只更新变化的部分
4. **人工审核**：自动生成的页面需要人工审核和补充
5. **双向链接**：使用 `[[page-name]]` 语法建立页面间链接
6. **架构图格式**：ArchiMate 用 PlantUML，其他用 Mermaid
7. **优先利用检索**：大型代码库不要全量通读，先用 QMD 缩小候选范围

## 参考文档

- [project-types.md](./references/project-types.md) - 项目类型配置
- [architecture-analysis.md](./references/architecture-analysis.md) - 架构分析规则
- [page-templates.md](./references/page-templates.md) - wiki 页面模板
