# 摄取示例

## 示例 1: 摄取技术文章

**用户输入**:
```
/ingest-source raw/documents/llm-architecture.md
```

**助手输出**:
```
✅ 成功摄取源文档: LLM Architecture Overview

📊 统计:
- 创建页面: 5 个
- 更新页面: 2 个
- 提取实体: 3 个
- 提取概念: 4 个

📄 生成的页面:
- 源文档摘要: wiki/sources/llm-architecture-overview.md
- 实体页面: 
  - wiki/entities/openai.md
  - wiki/entities/anthropic.md
  - wiki/entities/google-deepmind.md
- 概念页面:
  - wiki/concepts/transformer-architecture.md
  - wiki/concepts/attention-mechanism.md
  - wiki/concepts/llm-training.md
  - wiki/concepts/prompt-engineering.md
```

---

## 示例 2: 摄取设计文档

**用户输入**:
```
/ingest-source raw/documents/order-system-design.md
```

**助手输出**:
```
✅ 成功摄取源文档: Order System Design

📊 统计:
- 创建页面: 12 个
- 更新页面: 3 个
- 提取系统: 1 个
- 提取组件: 5 个
- 提取服务: 8 个
- 提取数据模型: 4 个

📄 生成的页面:
- 源文档摘要: wiki/sources/order-system-design.md
- 系统页面: wiki/systems/order-management-system.md
- 组件页面:
  - wiki/components/order-service.md
  - wiki/components/inventory-service.md
  - wiki/components/payment-service.md
  - ...
- 服务页面:
  - wiki/services/create-order.md
  - wiki/services/query-order.md
  - ...
- 数据模型页面:
  - wiki/data-models/order.md
  - wiki/data-models/order-item.md
  - ...
- 架构图:
  - wiki/architectures/diagrams/system-designs/order-system-architecture.md
```

---

## 示例 3: 摄取学术论文

**用户输入**:
```
/ingest-source raw/documents/attention-is-all-you-need.pdf
```

**助手输出**:
```
✅ 成功摄取源文档: Attention Is All You Need

📊 统计:
- 创建页面: 6 个
- 更新页面: 1 个
- 提取实体: 8 个
- 提取概念: 3 个

📄 生成的页面:
- 源文档摘要: wiki/sources/attention-is-all-you-need.md
- 实体页面:
  - wiki/entities/google-brain.md
  - wiki/entities/ashish-vaswani.md
  - ...（其他作者）
- 概念页面:
  - wiki/concepts/transformer.md
  - wiki/concepts/self-attention.md
  - wiki/concepts/positional-encoding.md

📝 引用格式:
```bibtex
@article{vaswani2017attention,
  title={Attention is all you need},
  author={Vaswani, Ashish and Shazeer, Noam and Parmar, Niki and others},
  journal={Advances in neural information processing systems},
  year={2017}
}
```
```

---

## 示例 4: 发现矛盾

**用户输入**:
```
/ingest-source raw/documents/new-gpt4-info.md
```

**助手输出**:
```
✅ 成功摄取源文档: New GPT-4 Information

📊 统计:
- 创建页面: 1 个
- 更新页面: 2 个
- 提取实体: 1 个
- 提取概念: 1 个

📄 生成的页面:
- 源文档摘要: wiki/sources/new-gpt4-info.md
- 更新实体页面: wiki/entities/openai.md
- 更新概念页面: wiki/concepts/gpt4.md

⚠️ 发现的矛盾:
- [[entities/openai]]: 新信息与现有信息矛盾
  - 现有: GPT-4 发布于 2023 年 3 月 [[sources/article-1]]
  - 新信息: GPT-4 发布于 2023 年 6 月 [[sources/new-gpt4-info]]
  - 建议: 核实准确日期，更新页面并标注正确来源
```
