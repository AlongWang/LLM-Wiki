# PlantUML ArchiMate 库使用说明

## 概述

本库提供了 ArchiMate 3.2 标准的 PlantUML 定义，用于在 Obsidian 中绘制 ArchiMate 架构图。

## 使用方法

### 1. 在 PlantUML 代码中引用库

```plantuml
@startuml
!include ArchiMate.puml

' 你的 ArchiMate 图代码
@enduml
```

### 2. 使用 ArchiMate 元素

#### 业务层元素

```plantuml
Business_Process(BP1, "下单流程")
Business_Service(BS1, "订单服务")
Business_Object(BO1, "订单")
Business_Actor(BA1, "客户")
```

#### 应用层元素

```plantuml
Application_Component(AC1, "订单服务")
Application_Service(AS1, "创建订单")
Application_DataObject(ADO1, "订单数据")
Application_Interface(AI1, "订单API")
```

#### 技术层元素

```plantuml
Technology_Node(TN1, "服务器")
Technology_Device(TD1, "数据库服务器")
Technology_Service(TS1, "容器服务")
Technology_System_Software(TSS1, "PostgreSQL")
```

### 3. 使用 ArchiMate 关系

```plantuml
' 触发关系
Triggering_Rel(BP1, BS1, "")

' 使用关系
UsedBy_Rel(BP1, BS1, "")

' 实现关系
Realization_Rel(AS1, BS1, "")

' 分配关系
Assignment_Rel(AC1, AS1, "")

' 访问关系
Access_Rel(AS1, ADO1, "读写")
```

## 完整示例

### 业务架构图

```plantuml
@startuml
!include ArchiMate.puml

' 业务层元素
Business_Process(BP1, "下单流程")
Business_Process(BP2, "支付流程")
Business_Service(BS1, "订单服务")
Business_Service(BS2, "支付服务")
Business_Object(BO1, "订单")

' 关系
Triggering_Rel(BP1, BP2, "")
UsedBy_Rel(BP1, BS1, "")
UsedBy_Rel(BP2, BS2, "")
Access_Rel(BS1, BO1, "创建")

@enduml
```

### 应用架构图

```plantuml
@startuml
!include ArchiMate.puml

' 应用层元素
Application_Component(AC1, "订单服务")
Application_Component(AC2, "库存服务")
Application_Service(AS1, "创建订单")
Application_Service(AS2, "查询库存")
Application_Interface(AI1, "订单API")

' 关系
Assignment_Rel(AC1, AS1, "")
Assignment_Rel(AC2, AS2, "")
Serving_Rel(AI1, AS1, "")
UsedBy_Rel(AS1, AS2, "")

@enduml
```

### 技术架构图

```plantuml
@startuml
!include ArchiMate.puml

' 技术层元素
Technology_Node(TN1, "Kubernetes集群")
Technology_Service(TS1, "容器编排")
Technology_System_Software(TSS1, "PostgreSQL")
Technology_System_Software(TSS2, "Redis")

' 关系
Assignment_Rel(TN1, TS1, "")
Realization_Rel(TSS1, TS1, "")

@enduml
```

## 支持的元素

### 业务层
- Business_Process - 业务流程
- Business_Service - 业务服务
- Business_Object - 业务对象
- Business_Event - 业务事件
- Business_Function - 业务功能
- Business_Interaction - 业务交互
- Business_Actor - 业务参与者
- Business_Role - 业务角色
- Business_Collaboration - 业务协作
- Business_Interface - 业务接口
- Product - 产品
- Contract - 合同
- Representation - 表示

### 应用层
- Application_Component - 应用组件
- Application_Service - 应用服务
- Application_Interface - 应用接口
- Application_Function - 应用功能
- Application_Interaction - 应用交互
- Application_DataObject - 数据对象
- Application_Process - 应用流程
- Application_Event - 应用事件

### 技术层
- Technology_Node - 节点
- Technology_Device - 设备
- Technology_System_Software - 系统软件
- Technology_Service - 技术服务
- Technology_Interface - 技术接口
- Technology_Network - 网络
- Technology_Function - 技术功能
- Technology_Process - 技术流程
- Technology_Event - 技术事件
- Technology_Artifact - 制品
- Technology_CommunicationPath - 通信路径

## 支持的关系

### 结构关系
- Composition_Rel - 组合关系
- Aggregation_Rel - 聚合关系
- Assignment_Rel - 分配关系
- Realization_Rel - 实现关系

### 依赖关系
- Serving_Rel - 服务关系
- Access_Rel - 访问关系
- Influence_Rel - 影响关系

### 动态关系
- Triggering_Rel - 触发关系
- Flow_Rel - 流关系

### 其他关系
- Specialization_Rel - 特化关系
- Association_Rel - 关联关系

## 注意事项

1. **文件路径**: 确保 `ArchiMate.puml` 文件路径正确
2. **Obsidian 插件**: 需要安装 PlantUML 插件
3. **图标显示**: 某些图标可能需要特定的 PlantUML 版本
4. **中文支持**: 确保使用 UTF-8 编码

## 参考资源

- [ArchiMate 3.2 规范](https://pubs.opengroup.org/architecture/archimate32-doc/)
- [PlantUML 官方文档](https://plantuml.com/)
- [Obsidian PlantUML 插件](https://github.com/joethei/obsidian-plantuml)
