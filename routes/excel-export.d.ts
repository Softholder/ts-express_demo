// 模块插件
declare module 'excel-export' {
    // 导出excel的函数
    export function execute(config: Config): void;
    // 导出函数的参数类型定义
    export interface Config {
        // 列头定义：caption为列头文字，type为单元格类型
        cols: { caption: string, type: string }[];
        // 具体的数字
        rows: any[];
    }
}