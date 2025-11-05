export const extractChineseErrorMessage = (error: unknown): string => {
  if (!error) return '未知错误'

  const errorMessage = error.toString()

  // 匹配中文字符（包括中文标点）
  const chineseMatch = errorMessage.match(/[\u4e00-\u9fa5：，。！？；]+[\u4e00-\u9fa5：，。！？；\s]*/g)

  if (chineseMatch && chineseMatch.length > 0) {
    // 返回最后一个中文片段（通常是最具体的错误描述）
    return chineseMatch[chineseMatch.length - 1].trim()
  }

  // 如果没有中文，返回原始消息或默认提示
  return errorMessage.includes('Error') ? '网络请求失败' : errorMessage
}
