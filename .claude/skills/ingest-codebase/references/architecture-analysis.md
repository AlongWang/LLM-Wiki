# 架构分析规则

## 目录结构分析

扫描目录结构，识别模块：

```
project-a/
├── src/
│   ├── modules/
│   │   ├── order/          # 订单模块
│   │   ├── payment/        # 支付模块
│   │   └── inventory/      # 库存模块
│   ├── common/             # 公共模块
│   └── config/             # 配置模块
├── tests/
└── docs/
```

## 模块识别

识别每个模块的职责：

- **order 模块**: 订单创建、查询、更新、取消
- **payment 模块**: 支付处理、退款
- **inventory 模块**: 库存检查、扣减、回滚

## 技术栈识别

从依赖和代码中识别技术栈：

| 类别 | 技术 |
|-----|------|
| 语言 | TypeScript 4.8 |
| 框架 | NestJS 9.0 |
| ORM | TypeORM 0.3 |
| 数据库 | PostgreSQL 14 |
| 缓存 | Redis 6.2 |
| 消息队列 | RabbitMQ 3.9 |

## API 端点提取

### NestJS 示例

```typescript
@Controller('orders')
export class OrderController {
  @Post()
  createOrder(@Body() dto: CreateOrderDto) {}
  
  @Get(':id')
  getOrder(@Param('id') id: string) {}
  
  @Put(':id')
  updateOrder(@Param('id') id: string, @Body() dto: UpdateOrderDto) {}
  
  @Delete(':id')
  cancelOrder(@Param('id') id: string) {}
}
```

提取结果：
- `POST /orders` - 创建订单
- `GET /orders/:id` - 查询订单
- `PUT /orders/:id` - 更新订单
- `DELETE /orders/:id` - 取消订单

### Spring Boot 示例

```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {
  @PostMapping
  public Order createOrder(@RequestBody CreateOrderDto dto) {}
  
  @GetMapping("/{id}")
  public Order getOrder(@PathVariable String id) {}
}
```

## 实体提取

### TypeORM 示例

```typescript
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('increment')
  id: number;
  
  @Column()
  customerId: number;
  
  @Column('decimal')
  totalAmount: number;
  
  @Column({ default: 'pending' })
  status: string;
  
  @OneToMany(() => OrderItem, item => item.order)
  items: OrderItem[];
  
  @ManyToOne(() => Customer)
  customer: Customer;
}
```

提取结果：
- 表名: `orders`
- 字段: id, customerId, totalAmount, status
- 关系: 
  - Order → OrderItem (一对多)
  - Order → Customer (多对一)

## 依赖分析

### 外部依赖

从配置文件提取：

**package.json**:
```json
{
  "dependencies": {
    "@nestjs/core": "^9.0.0",
    "typeorm": "^0.3.0",
    "pg": "^8.0.0",
    "redis": "^4.0.0",
    "amqplib": "^0.10.0"
  }
}
```

分类：
- 运行时依赖: NestJS, TypeORM, pg, redis, amqplib
- 开发依赖: TypeScript, Jest, ESLint

### 内部依赖

分析模块间的依赖：

```typescript
// order.module.ts
@Module({
  imports: [
    InventoryModule,    // 依赖库存模块
    PaymentModule,      // 依赖支付模块
  ],
})
export class OrderModule {}
```

依赖关系：
- OrderModule → InventoryModule
- OrderModule → PaymentModule
