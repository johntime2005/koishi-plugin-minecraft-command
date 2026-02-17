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
- **权限管理**: 支持普通用户/管理员分级权限控制
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
| `allowedChannels` | `string[]` | `[]` | 允许执行命令的频道/群组 ID 列表（留空则不限制频道） |
| `allowedUsers` | `string[]` | `[]` | 允许执行普通命令的用户 ID 列表（留空则不限制用户） |
| `adminUsers` | `string[]` | `[]` | 允许执行管理命令的用户 ID 列表 |
| `adminAuthority` | `number` | `3` | 管理命令所需的 Koishi authority 等级（与 `adminUsers` 为「或」关系，满足其一即可） |
| `userAuthority` | `number` | `1` | 普通命令所需的 Koishi authority 等级 |

### 配置示例

```yaml
plugins:
  minecraft-command:
    botId: ''
    allowedChannels: []
    allowedUsers: []
    adminUsers:
      - '123456789'
    adminAuthority: 3
    userAuthority: 1
```

## 命令列表

### 普通命令

普通命令受 `allowedUsers` 和 `userAuthority` 控制。

| 命令 | 中文别名 | 说明 | 示例 |
|------|----------|------|------|
| `mc.list` | `mc.在线` | 查看在线玩家 | `mc.list` |
| `mc.say <消息>` | `mc.广播` | 在服务器中广播消息 | `mc.say 大家好` |

### 管理命令

管理命令受 `adminUsers` 和 `adminAuthority` 控制（满足其一即可）。

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

本插件采用两级权限模型：

### 普通权限

控制 `mc.list`、`mc.say` 命令的访问。

1. **频道限制** (`allowedChannels`)：非空时，仅允许列表中的频道执行命令
2. **用户限制** (`allowedUsers`)：非空时，用户需在列表中 **或** authority >= `userAuthority`

### 管理权限

控制 `mc.tp`、`mc.give`、`mc.weather`、`mc.time`、`mc.cmd` 命令的访问。

1. **频道限制** (`allowedChannels`)：同普通权限
2. **管理员验证**：用户在 `adminUsers` 列表中 **或** authority >= `adminAuthority`（满足其一即可）

### 推荐配置

```yaml
# 仅限特定群组使用，指定管理员
minecraft-command:
  allowedChannels:
    - '群组ID'
  adminUsers:
    - '管理员QQ号'
  adminAuthority: 3
  userAuthority: 1
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
