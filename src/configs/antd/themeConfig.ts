import type { ThemeConfig } from "antd";
import { TableToken } from "antd/es/table/style";
import { AliasToken } from "antd/es/theme/internal";

const tokenAntd: Partial<AliasToken> = {
  fontFamily: "Be Vietnam Pro",
};

// config table
const tableComponent: Partial<TableToken> = {
  headerBg: "#418efd",
  headerColor: "#ffffff",
};

const themeAntd: ThemeConfig = {
  token: tokenAntd,
  components: {
    Table: tableComponent,
  },
};

export default themeAntd;
