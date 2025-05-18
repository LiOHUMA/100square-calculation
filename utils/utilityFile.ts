//  @file utilityFile.ts
//  @description 様々なユーティリティメソッドを提供するファイルです。
//  @author Your <Name>Onimaru</Name>
//  @date 2025-05-14
//  @version 1.0.0

export function getOperationSymbol(
  operation: string | null | undefined
): string {
  switch (operation) {
    case "addition":
      return "+";
    case "subtraction":
      return "-";
    case "multiplication":
      return "×";
    case "division":
      return "÷";
    default:
      return "";
  }
}
