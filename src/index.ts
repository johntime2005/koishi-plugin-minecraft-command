import { Bot, Context, Logger, Schema } from 'koishi'

export const name = 'minecraft-command'

const logger = new Logger('mc-cmd')

// duck-typing 接口：与 minecraft-adapter 的 MinecraftBot.executeCommand 对齐，避免硬依赖 adapter 包
interface ExecutableBot extends Bot {
  executeCommand(command: string): Promise<string>
}

function hasExecuteCommand(bot: Bot): bot is ExecutableBot {
  return 'executeCommand' in bot
}

export interface Config {
  botId: string
  userAuthority: number
  adminAuthority: number
}

export const Config: Schema<Config> = Schema.object({
  botId: Schema.string()
    .description('指定 Minecraft Bot ID（selfId），留空则自动选择第一个可用的 Minecraft Bot')
    .default(''),
  userAuthority: Schema.number()
    .description('普通命令（mc.list / mc.say）所需的 Koishi 用户权限等级')
    .default(1),
  adminAuthority: Schema.number()
    .description('管理命令（mc.tp / mc.give / mc.weather / mc.time / mc.cmd）所需的 Koishi 用户权限等级')
    .default(3),
})

export function apply(ctx: Context, config: Config) {

  function findBot(): ExecutableBot | undefined {
    for (const bot of ctx.bots) {
      if (bot.platform !== 'minecraft') continue
      if (!hasExecuteCommand(bot)) continue
      if (config.botId && bot.selfId !== config.botId) continue
      return bot
    }
    // 指定了 botId 但未匹配时，fallback 到任意可用的 minecraft bot
    if (config.botId) {
      for (const bot of ctx.bots) {
        if (bot.platform === 'minecraft' && hasExecuteCommand(bot)) {
          return bot
        }
      }
    }
    return undefined
  }

  async function runCommand(command: string): Promise<string> {
    const bot = findBot()
    if (!bot) {
      throw new Error('未找到可用的 Minecraft Bot，请确保 minecraft-adapter 插件已启用并连接')
    }
    return await bot.executeCommand(command)
  }

  ctx.command('mc', 'Minecraft 服务器管理')
    .usage('通过子命令管理 Minecraft 服务器：mc.list / mc.say / mc.tp / mc.give / mc.weather / mc.time / mc.cmd')

  ctx.command('mc.list', '查看在线玩家', { authority: config.userAuthority })
    .alias('mc.在线')
    .action(async ({ session }) => {
      if (!session) return
      try {
        const result = await runCommand('list')
        return result || '命令已执行，但服务器未返回数据'
      } catch (e) {
        logger.warn('mc.list 执行失败', e)
        return `执行失败: ${(e as Error).message}`
      }
    })

  ctx.command('mc.say <message:text>', '在服务器中广播消息', { authority: config.userAuthority })
    .alias('mc.广播')
    .action(async ({ session }, message) => {
      if (!session) return
      if (!message) return '请输入要广播的消息'
      try {
        const result = await runCommand(`say ${message}`)
        return `广播成功${result ? `: ${result}` : ''}`
      } catch (e) {
        logger.warn('mc.say 执行失败', e)
        return `广播失败: ${(e as Error).message}`
      }
    })

  ctx.command('mc.tp <player:string> <target:text>', '传送玩家到目标位置或玩家', { authority: config.adminAuthority })
    .alias('mc.传送')
    .usage('示例:\n  mc.tp Steve Alex        — 将 Steve 传送到 Alex\n  mc.tp Steve 100 64 200  — 将 Steve 传送到坐标')
    .action(async ({ session }, player, target) => {
      if (!session) return
      if (!player || !target) return '用法: mc.tp <玩家名> <目标玩家或坐标>'
      try {
        const result = await runCommand(`tp ${player} ${target}`)
        return `传送成功${result ? `: ${result}` : ''}`
      } catch (e) {
        logger.warn('mc.tp 执行失败', e)
        return `传送失败: ${(e as Error).message}`
      }
    })

  ctx.command('mc.give <player:string> <item:string> [count:number]', '给予玩家物品', { authority: config.adminAuthority })
    .alias('mc.给予')
    .usage('示例: mc.give Steve diamond 64')
    .action(async ({ session }, player, item, count) => {
      if (!session) return
      if (!player || !item) return '用法: mc.give <玩家名> <物品ID> [数量]'
      const amount = count ?? 1
      try {
        const result = await runCommand(`give ${player} ${item} ${amount}`)
        return `已给予 ${player} ${amount} 个 ${item}${result ? `\n${result}` : ''}`
      } catch (e) {
        logger.warn('mc.give 执行失败', e)
        return `给予失败: ${(e as Error).message}`
      }
    })

  ctx.command('mc.weather <type:string>', '设置服务器天气', { authority: config.adminAuthority })
    .alias('mc.天气')
    .usage('可选值: clear (晴天) / rain (雨天) / thunder (雷暴)')
    .action(async ({ session }, type) => {
      if (!session) return
      if (!type) return '请指定天气类型: clear / rain / thunder'
      const validTypes = ['clear', 'rain', 'thunder']
      if (!validTypes.includes(type.toLowerCase())) {
        return `无效的天气类型，可选值: ${validTypes.join(' / ')}`
      }
      try {
        const result = await runCommand(`weather ${type.toLowerCase()}`)
        return `天气已设置为 ${type}${result ? `\n${result}` : ''}`
      } catch (e) {
        logger.warn('mc.weather 执行失败', e)
        return `设置天气失败: ${(e as Error).message}`
      }
    })

  ctx.command('mc.time <value:string>', '设置服务器时间', { authority: config.adminAuthority })
    .alias('mc.时间')
    .usage('可选值: day / night / noon / midnight / 游戏刻数字 (如 6000)')
    .action(async ({ session }, value) => {
      if (!session) return
      if (!value) return '请指定时间值: day / night / noon / midnight / 游戏刻数字'
      const presets = ['day', 'night', 'noon', 'midnight']
      const isPreset = presets.includes(value.toLowerCase())
      const isNumber = /^\d+$/.test(value)
      if (!isPreset && !isNumber) {
        return `无效的时间值，可选: ${presets.join(' / ')} 或游戏刻数字`
      }
      try {
        const result = await runCommand(`time set ${isPreset ? value.toLowerCase() : value}`)
        return `时间已设置为 ${value}${result ? `\n${result}` : ''}`
      } catch (e) {
        logger.warn('mc.time 执行失败', e)
        return `设置时间失败: ${(e as Error).message}`
      }
    })

  ctx.command('mc.cmd <command:text>', '执行任意 Minecraft 服务器命令', { authority: config.adminAuthority })
    .alias('mc.命令')
    .usage('直接执行原始服务器命令，如: mc.cmd op Steve')
    .action(async ({ session }, command) => {
      if (!session) return
      if (!command) return '请输入要执行的命令'
      try {
        const result = await runCommand(command)
        return result || '命令已执行'
      } catch (e) {
        logger.warn('mc.cmd 执行失败', e)
        return `执行失败: ${(e as Error).message}`
      }
    })

  logger.info('minecraft-command 插件已加载')
}
