---
name: ingest-source
description: "摄取源文档（文章、论文、设计文档等）到 wiki 中，提取关键信息并生成结构化页面。支持多种文档类型，自动检测矛盾"
argument-hint: "[source-path]"
user-invocable: true
---

# Ingest Source

## 目标

摄取源文档到 wiki 中，提取关键信息，生成结构化页面，并更新相关页面。

## 输入

- 源文档路径（如 `raw/documents/article.md`）
- 可选：特定关注点或提取重点

## 处理流程

### 1. 读取源文档

```
读取 raw/documents/ 中的源文档
支持格式：.md, .txt, .pdf（需提取文本）
```

### 2. 分析文档内容

#### 2.1 识别文档类型

详细的文档类型识别规则请参考 [document-types.md](./references/document-types.md)

- **文章/博客**: 新闻、技术文章、博客文章
- **学术论文**: 研究论文、技术报告
- **设计文档**: 系统设计、架构设计、产品设计
- **会议记录**: 会议纪要、讨论记录
- **书籍章节**: 书籍内容、教程
- **其他**: 根据内容自动判断

#### 2.2 提取关键信息

详细的提取规则请参考 [extraction-rules.md](./references/extraction-rules.md)

**通用信息**:
- 标题、作者、日期、摘要/概述、关键词/标签

**实体信息**:
- 人物、组织、地点、产品/项目

**概念信息**:
- 核心概念、理论/方法、技术/工具

**架构信息**（如果是设计文档）:
- 系统、组件、服务、数据模型、依赖关系

### 3. 生成 Wiki 页面

#### 3.1 创建源文档摘要页面

在 `wiki/sources/` 创建摘要页面：

```markdown
---
tags: [source, article, ...]
date: 2026-04-16
source_count: 1
status: published
type: source
source_path: raw/documents/article.md
author: 作者名
source_date: 2026-04-01
---

# {文档标题}

## 概述
{文档摘要}

## 关键要点
- 要点1
- 要点2
- 要点3

## 核心概念
- [[concept-1]] - 概念说明
- [[concept-2]] - 概念说明

## 相关实体
- [[entity-1]] - 实体说明
- [[entity-2]] - 实体说明

## 原文链接
- 源文档: raw/documents/article.md

## 引用
```bibtex
@article{...}
```
```

#### 3.2 创建/更新实体页面

为每个识别的实体创建或更新页面：

**如果是新实体**:
- 在 `wiki/entities/` 创建新页面
- 使用 `entity-template.md` 模板

**如果实体已存在**:
- 读取现有页面
- 添加新信息
- 更新 `source_count`
- 标注任何矛盾

#### 3.3 创建/更新概念页面

为每个识别的概念创建或更新页面：

**如果是新概念**:
- 在 `wiki/concepts/` 创建新页面
- 使用 `concept-template.md` 模板

**如果概念已存在**:
- 读取现有页面
- 添加新信息
- 更新 `source_count`
- 标注任何矛盾

#### 3.4 创建架构页面（如果适用）

如果文档包含架构信息：

**系统页面**:
- 在 `wiki/systems/{system-name}/` 创建或更新

**组件页面**:
- 在 `wiki/components/{system-name}/` 创建或更新

**服务页面**:
- 在 `wiki/services/{system-name}/` 创建或更新

**数据模型页面**:
- 在 `wiki/data-models/{system-name}/` 创建或更新

**架构图页面**:
- 在 `wiki/architectures/diagrams/system-designs/{system-name}/` 创建
- ArchiMate 图使用 PlantUML
- 其他图使用 Mermaid

### 4. 更新索引

更新 `wiki/index.md`：

```markdown
## 源文档

### {文档标题}
- 路径: [[sources/article-name]]
- 摘要: {一句话摘要}
- 日期: 2026-04-16
- 标签: #tag1 #tag2

## 实体

### {实体名称}
- 路径: [[entities/entity-name]]
- 摘要: {一句话摘要}
- 来源数: 3

## 概念

### {概念名称}
- 路径: [[concepts/concept-name]]
- 摘要: {一句话摘要}
- 来源数: 2
```

### 5. 记录日志

在 `wiki/log.md` 添加条目：

```markdown
## [2026-04-16] ingest | {文档标题}
- 源文档: raw/documents/article.md
- 类型: 文章
- 生成源文档摘要: wiki/sources/article-name.md
- 创建实体页面: 2个
- 创建概念页面: 3个
- 更新实体页面: 1个
- 更新概念页面: 2个
```

### 6. 更新概述（可选）

如果文档包含重要信息，更新 `wiki/overview.md`。

## 输出

向用户报告：

```
✅ 成功摄取源文档: {文档标题}

📊 统计:
- 创建页面: X 个
- 更新页面: Y 个
- 提取实体: Z 个
- 提取概念: W 个

📄 生成的页面:
- 源文档摘要: wiki/sources/{name}.md
- 实体页面: wiki/entities/{name}.md
- 概念页面: wiki/concepts/{name}.md

⚠️ 发现的矛盾:
- [[entity-name]]: 新信息与现有信息矛盾
  - 现有: ...
  - 新信息: ...
```

## 特殊处理

### 架构文档

如果检测到文档包含架构信息：

1. **识别架构元素**: 系统、组件、服务、数据模型、依赖关系
2. **生成架构图**: ArchiMate 图 → PlantUML，其他图 → Mermaid
3. **创建关系映射**: 在 `wiki/architectures/relationships/` 创建关系映射页面

### 图片处理

如果源文档包含图片：

1. 图片已在 `raw/assets/images/` 中
2. 在 wiki 页面中使用相对路径引用
3. 使用 Obsidian 语法: `![[image-name.png]]`

## 注意事项

1. **不要修改源文档**: 源文档是只读的
2. **检测矛盾**: 如果新信息与现有信息矛盾，明确标注
3. **保持链接**: 使用双向链接 `[[page-name]]`
4. **更新 source_count**: 每次更新页面时更新 source_count
5. **人工审核**: 建议用户审核生成的页面

## 示例

详细的摄取示例请参考 [examples.md](./references/examples.md)，包括：
- 摄取技术文章示例
- 摄取设计文档示例
- 摄取学术论文示例
- 发现矛盾示例
