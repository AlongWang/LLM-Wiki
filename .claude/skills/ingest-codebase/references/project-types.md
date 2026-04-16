# 项目类型识别

## Node.js 项目

**配置文件**:
- `package.json` - 项目名称、版本、依赖
- `tsconfig.json` - TypeScript 配置
- `.env.example` - 环境变量示例

**提取信息**:
```yaml
项目信息:
  名称: order-service
  版本: 1.0.0
  描述: Order management service
  语言: TypeScript
  框架: NestJS
  数据库: PostgreSQL
  缓存: Redis
```

**技术栈识别**:
- 从 `dependencies` 识别框架和库
- 从 `scripts` 识别构建和测试命令
- 从 `engines` 识别 Node.js 版本要求

---

## Java/Spring Boot 项目

**配置文件**:
- `pom.xml` / `build.gradle` - 项目配置、依赖
- `application.yml` - 应用配置

**提取信息**:
```yaml
项目信息:
  名称: order-service
  版本: 1.0.0
  语言: Java
  框架: Spring Boot
  数据库: MySQL
  缓存: Redis
```

**技术栈识别**:
- 从 `dependencies` 识别框架和库
- 从 `application.yml` 识别数据库、缓存配置
- 从 `plugins` 识别构建工具

---

## Python 项目

**配置文件**:
- `requirements.txt` / `pyproject.toml` - 依赖
- `setup.py` - 项目配置

**提取信息**:
```yaml
项目信息:
  名称: ml-service
  版本: 1.0.0
  语言: Python
  框架: FastAPI
  数据库: PostgreSQL
```

**技术栈识别**:
- 从 `requirements.txt` 识别依赖库
- 从 `setup.py` 识别项目元数据
- 从 `pyproject.toml` 识别构建配置

---

## Go 项目

**配置文件**:
- `go.mod` - 模块和依赖

**提取信息**:
```yaml
项目信息:
  名称: api-gateway
  版本: 1.0.0
  语言: Go
  模块: github.com/company/api-gateway
```

**技术栈识别**:
- 从 `go.mod` 识别模块路径和依赖
- 从 `go.sum` 识别依赖版本

---

## Rust 项目

**配置文件**:
- `Cargo.toml` - 项目配置和依赖

**提取信息**:
```yaml
项目信息:
  名称: data-processor
  版本: 1.0.0
  语言: Rust
  版本: 1.70
```

**技术栈识别**:
- 从 `Cargo.toml` 识别依赖
- 从 `Cargo.lock` 识别依赖版本
