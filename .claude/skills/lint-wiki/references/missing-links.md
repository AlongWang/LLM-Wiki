# 缺失链接检测

## 1. 提及但未创建的页面

检测在文本中频繁提及但没有对应页面的概念。

### 示例

```markdown
## 缺失页面

以下概念被提及但没有对应页面：

### 概念
- "注意力机制" - 在 5 个页面中提及
  - [[sources/article-1]]
  - [[sources/article-2]]
  - [[concepts/transformer]]
  - [[analyses/llm-comparison]]
  - [[services/nlp-service]]

### 实体
- "Google DeepMind" - 在 3 个页面中提及
  - [[sources/article-3]]
  - [[entities/google]]
  - [[concepts/reinforcement-learning]]

**建议**: 为这些概念/实体创建页面。
```

## 2. 失效链接

检测指向不存在的页面的链接。

```markdown
## 失效链接

以下链接指向不存在的页面：

- [[entities/non-existent]] - 在 [[sources/article-1]] L15 中引用
- [[concepts/undefined]] - 在 [[concepts/transformer]] L42 中引用
- [[services/payment-gateway]] - 在 [[systems/order-service]] L28 中引用

**建议**: 
1. 创建缺失的页面
2. 或修正链接指向正确的页面
3. 或如果不相关，删除链接
```

## 3. 缺失的双向链接

检测应该相互链接但缺失反向链接的页面。

```markdown
## 缺失的双向链接

### [[entities/openai]] → [[entities/anthropic]]
- 原因: 两者都是 AI 公司，存在竞争关系
- [[openai]] 链接到 [[anthropic]]（✅）
- [[anthropic]] 缺少反向链接（❌）
- 建议: 在 [[anthropic]] 中添加"竞争对手"链接

### [[concepts/transformer]] ↔ [[concepts/attention-mechanism]]
- 原因: Transformer 基于注意力机制
- 两个方向都缺少链接（❌）
- 建议: 建立双向链接
```

## 检测算法

### 提及频率分析

```
提及次数 >= 3 的概念 → 应该有专门页面
```

### 链接指向检查

```
遍历所有 [[page]] 引用 → 检查页面是否存在 → 标记死链
```

### 上下文分析

```
如果页面 A 链接到 B，但 B 没有链接回 A → 建议添加双向链接
```

## 输出格式

```markdown
# 缺失链接报告

## 统计

- 失效链接: 12 个
- 提及但未创建: 8 个
- 缺失双向链接: 15 对

## 优先处理

### 🔴 高优先级
- [[services/payment-gateway]] - 在订单流程中关键

### 🟡 中优先级  
- [[concepts/attention-mechanism]] - 在多个地方提及

### 🟢 低优先级
- [[entities/legacy-company]] - 仅在历史记录中提及
```
