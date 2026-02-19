# koishi-plugin-minecraft-command

Koishi 的 Minecraft 服务器命令插件，通过聊天平台远程执行 Minecraft 服务器命令。需配合 [koishi-plugin-minecraft-adapter](https://github.com/johntime2005/koishi-plugin-minecraft-adapter) 使用。

## 功能特性

- **在线玩家查询**: 查看服务器在线玩家列表
- **消息广播**: 在 Minecraft 服务器中广播消息
- **玩家传送**: 传送玩家到指定位置或其他玩家
- **物品给予**: 给予玩家指定物品
- **天气控制**: 设置服务器天气（晴天/雨天/雷暴）
- **时间控制**: 设置服务器时间（白天/黑夜/自定义游戏刻）
- **自定义命令**: 执行任意 Minecraft 服务器命令
- **权限管理**: 基于 Koishi 内置权限系统的分级权限控制
- **中文别名**: 所有命令均支持中文别名

## 前置需求

- [Koishi](https://koishi.chat/) v4.17.9+
- [koishi-plugin-minecraft-adapter](https://github.com/johntime2005/koishi-plugin-minecraft-adapter) — Minecraft 适配器插件（必须先安装并配置好）

## 安装

```bash
npm install koishi-plugin-minecraft-command
```

## 配置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `botId` | `string` | `''` | 指定 Minecraft Bot ID（selfId），留空则自动选择第一个可用的 Minecraft Bot |
| `userAuthority` | `number` | `1` | 普通命令（mc.list / mc.say）所需的 Koishi 用户权限等级 |
| `adminAuthority` | `number` | `3` | 管理命令（mc.tp / mc.give / mc.weather / mc.time / mc.cmd）所需的 Koishi 用户权限等级 |

### 配置示例

```yaml
plugins:
  minecraft-command:
    botId: ''
    userAuthority: 1
    adminAuthority: 3
```

## 命令列表

### 普通命令

普通命令需要用户权限等级 >= `userAuthority`（默认 1）。

| 命令 | 中文别名 | 说明 | 示例 |
|------|----------|------|------|
| `mc.list` | `mc.在线` | 查看在线玩家 | `mc.list` |
| `mc.say <消息>` | `mc.广播` | 在服务器中广播消息 | `mc.say 大家好` |

### 管理命令

管理命令需要用户权限等级 >= `adminAuthority`（默认 3）。

| 命令 | 中文别名 | 说明 | 示例 |
|------|----------|------|------|
| `mc.tp <玩家> <目标>` | `mc.传送` | 传送玩家到目标位置或玩家 | `mc.tp Steve Alex`<br>`mc.tp Steve 100 64 200` |
| `mc.give <玩家> <物品> [数量]` | `mc.给予` | 给予玩家物品 | `mc.give Steve diamond 64` |
| `mc.weather <类型>` | `mc.天气` | 设置服务器天气 | `mc.weather clear` |
| `mc.time <值>` | `mc.时间` | 设置服务器时间 | `mc.time day`<br>`mc.time 6000` |
| `mc.cmd <命令>` | `mc.命令` | 执行任意服务器命令 | `mc.cmd op Steve` |

### 天气类型

| 值 | 说明 |
|----|------|
| `clear` | 晴天 |
| `rain` | 雨天 |
| `thunder` | 雷暴 |

### 时间值

| 值 | 说明 |
|----|------|
| `day` | 白天 |
| `night` | 黑夜 |
| `noon` | 正午 |
| `midnight` | 午夜 |
| 数字 | 游戏刻（如 `6000`） |

## 权限说明

本插件使用 Koishi 内置权限系统，通过用户的 `authority`（权限等级）控制命令访问。

### 权限等级

| 等级 | 说明 | 可用命令 |
|------|------|----------|
| 0 | 未授权用户 | 无 |
| 1（默认 `userAuthority`） | 普通用户 | `mc.list`、`mc.say` |
| 3（默认 `adminAuthority`） | 管理员 | 所有命令 |

> 可通过插件配置调整 `userAuthority` 和 `adminAuthority` 的值。

### 如何设置用户权限

1. **通过 Koishi 控制台**：在「用户管理」页面找到目标用户，修改其 `authority` 字段
2. **通过 `authorize` 命令**（需安装 admin 插件）：
   ```
   authorize 3 -u @用户
   ```

### 推荐配置

```yaml
# 默认配置即可满足大多数场景
minecraft-command:
  userAuthority: 1    # 普通用户可执行查询和广播
  adminAuthority: 3   # 管理员可执行传送、给予、天气、时间等管理命令
```

## 相关项目

- [koishi-plugin-minecraft-adapter](https://github.com/johntime2005/koishi-plugin-minecraft-adapter) — Minecraft 适配器插件（本插件的前置依赖）
- [鹊桥 (QueQiao)](https://github.com/17TheWord/QueQiao) — Minecraft 服务端通信插件/Mod
- [Koishi](https://koishi.chat/) — 跨平台聊天机器人框架

## 链接

- [GitHub 仓库](https://github.com/johntime2005/koishi-plugin-minecraft-command)
- [问题反馈](https://github.com/johntime2005/koishi-plugin-minecraft-command/issues)
- [npm 包](https://www.npmjs.com/package/koishi-plugin-minecraft-command)

## 许可证

[MIT](LICENSE)
