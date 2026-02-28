import 客户端 from "./CLIENT.js";
import 文件夹令牌 from "./conf/dir/合规自动化.js";
import 模板令牌 from "./conf/DOCX_TEMPLATE.js";
import 标记解析器 from "markdown-it";

const 标记 = new 标记解析器({ html: true, breaks: true });

export default async (内容, 月份) => {
    const 标题 = `合规报告 - ${月份.format("YYYY-MM")}`,
        复制结果 = await 客户端.drive.v1.file.copy({
            path: { file_token: 模板令牌 },
            data: { name: 标题, folder_token: 文件夹令牌, type: "docx" },
        }),
        令牌 = 复制结果.data.file.token,
        超文本 = 标记.render(内容),
        转换结果 = await 客户端.docx.v1.document.convert({
            data: { content: 超文本, content_type: "html" },
        }),
        { first_level_block_ids: 顶层列表, blocks: 块列表 } = 转换结果.data,
        处理列表 = 块列表.map((块) => {
            if (块.block_type === 31 && 块.table) {
                delete 块.table.property.merge_info;
                if (块.table.property.column_width) {
                    const 列数 = 块.table.property.column_width.length;
                    const 平均宽度 = Math.floor(600 / 列数);
                    块.table.property.column_width = 块.table.property.column_width.map(() => 平均宽度);
                }
            }
            return 块;
        });

    await 客户端.docx.v1.documentBlockDescendant.create({
        path: { document_id: 令牌, block_id: 令牌 },
        params: { index: 0 },
        data: { children_id: 顶层列表, descendants: 处理列表 },
    });

    return `https://xvccapical.feishu.cn/docx/${令牌}`;
};
