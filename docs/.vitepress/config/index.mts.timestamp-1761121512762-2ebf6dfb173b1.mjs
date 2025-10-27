// .vitepress/config/index.mts
import { withPwa } from "file:///Users/henry/Project/last-admin/last-admin-vben5/node_modules/.pnpm/@vite-pwa+vitepress@1.0.0_vite-plugin-pwa@1.0.1_vite@5.4.18_@types+node@22.16.0_less@4.3.0_sa_jitz2tvlngaufov5xqvgmlsbs4/node_modules/@vite-pwa/vitepress/dist/index.mjs";
import { defineConfigWithTheme } from "file:///Users/henry/Project/last-admin/last-admin-vben5/node_modules/.pnpm/vitepress@1.6.3_@algolia+client-search@5.23.4_@types+node@22.16.0_async-validator@4.2.5_axios_ckivqexnwv5qinw5d7czg76siq/node_modules/vitepress/dist/node/index.js";

// .vitepress/config/en.mts
import { defineConfig } from "file:///Users/henry/Project/last-admin/last-admin-vben5/node_modules/.pnpm/vitepress@1.6.3_@algolia+client-search@5.23.4_@types+node@22.16.0_async-validator@4.2.5_axios_ckivqexnwv5qinw5d7czg76siq/node_modules/vitepress/dist/node/index.js";

// ../package.json
var version = "5.5.9";

// .vitepress/config/en.mts
var en = defineConfig({
  description: "Vben Admin & Enterprise level management system framework",
  lang: "en-US",
  themeConfig: {
    darkModeSwitchLabel: "Theme",
    darkModeSwitchTitle: "Switch to Dark Mode",
    docFooter: {
      next: "Next Page",
      prev: "Previous Page"
    },
    editLink: {
      pattern: "https://github.com/vbenjs/vue-vben-admin/edit/main/docs/src/:path",
      text: "Edit this page on GitHub"
    },
    footer: {
      copyright: `Copyright \xA9 2020-${(/* @__PURE__ */ new Date()).getFullYear()} Vben`,
      message: "Released under the MIT License."
    },
    langMenuLabel: "Language",
    lastUpdated: {
      formatOptions: {
        dateStyle: "short",
        timeStyle: "medium"
      },
      text: "Last updated on"
    },
    lightModeSwitchTitle: "Switch to Light Mode",
    nav: nav(),
    outline: {
      label: "Navigate"
    },
    returnToTopLabel: "Back to top",
    sidebar: {
      "/en/commercial/": {
        base: "/en/commercial/",
        items: sidebarCommercial()
      },
      "/en/guide/": { base: "/en/guide/", items: sidebarGuide() }
    }
  }
});
function sidebarGuide() {
  return [
    {
      collapsed: false,
      text: "Introduction",
      items: [
        {
          link: "introduction/vben",
          text: "About Vben Admin"
        },
        {
          link: "introduction/why",
          text: "Why Choose Us?"
        },
        { link: "introduction/quick-start", text: "Quick Start" },
        { link: "introduction/thin", text: "Lite Version" }
      ]
    },
    {
      text: "Basics",
      items: [
        { link: "essentials/concept", text: "Basic Concepts" },
        { link: "essentials/development", text: "Local Development" },
        { link: "essentials/route", text: "Routing and Menu" },
        { link: "essentials/settings", text: "Configuration" },
        { link: "essentials/icons", text: "Icons" },
        { link: "essentials/styles", text: "Styles" },
        { link: "essentials/external-module", text: "External Modules" },
        { link: "essentials/build", text: "Build and Deployment" },
        { link: "essentials/server", text: "Server Interaction and Data Mock" }
      ]
    },
    {
      text: "Advanced",
      items: [
        { link: "in-depth/login", text: "Login" },
        { link: "in-depth/theme", text: "Theme" },
        { link: "in-depth/access", text: "Access Control" },
        { link: "in-depth/locale", text: "Internationalization" },
        { link: "in-depth/features", text: "Common Features" },
        { link: "in-depth/check-updates", text: "Check Updates" },
        { link: "in-depth/loading", text: "Global Loading" },
        { link: "in-depth/ui-framework", text: "UI Framework Switching" }
      ]
    },
    {
      text: "Engineering",
      items: [
        { link: "project/standard", text: "Standards" },
        { link: "project/cli", text: "CLI" },
        { link: "project/dir", text: "Directory Explanation" },
        { link: "project/test", text: "Unit Testing" },
        { link: "project/tailwindcss", text: "Tailwind CSS" },
        { link: "project/changeset", text: "Changeset" },
        { link: "project/vite", text: "Vite Config" }
      ]
    },
    {
      text: "Others",
      items: [
        { link: "other/project-update", text: "Project Update" },
        { link: "other/remove-code", text: "Remove Code" },
        { link: "other/faq", text: "FAQ" }
      ]
    }
  ];
}
function sidebarCommercial() {
  return [
    {
      link: "community",
      text: "Community"
    },
    {
      link: "technical-support",
      text: "Technical-support"
    },
    {
      link: "customized",
      text: "Customized"
    }
  ];
}
function nav() {
  return [
    {
      activeMatch: "^/en/(guide|components)/",
      text: "Doc",
      items: [
        {
          activeMatch: "^/en/guide/",
          link: "/en/guide/introduction/vben",
          text: "Guide"
        },
        // {
        //   activeMatch: '^/en/components/',
        //   link: '/en/components/introduction',
        //   text: 'Components',
        // },
        {
          text: "Historical Versions",
          items: [
            {
              link: "https://doc.vvbin.cn",
              text: "2.x Version Documentation"
            }
          ]
        }
      ]
    },
    {
      text: "Demo",
      items: [
        {
          text: "Vben Admin",
          items: [
            {
              link: "https://www.vben.pro",
              text: "Demo Version"
            },
            {
              link: "https://ant.vben.pro",
              text: "Ant Design Vue Version"
            },
            {
              link: "https://naive.vben.pro",
              text: "Naive Version"
            },
            {
              link: "https://ele.vben.pro",
              text: "Element Plus Version"
            }
          ]
        },
        {
          text: "Others",
          items: [
            {
              link: "https://vben.vvbin.cn",
              text: "Vben Admin 2.x"
            }
          ]
        }
      ]
    },
    {
      text: version,
      items: [
        {
          link: "https://github.com/vbenjs/vue-vben-admin/releases",
          text: "Changelog"
        },
        {
          link: "https://github.com/orgs/vbenjs/projects/5",
          text: "Roadmap"
        },
        {
          link: "https://github.com/vbenjs/vue-vben-admin/blob/main/.github/contributing.md",
          text: "Contribution"
        }
      ]
    },
    {
      link: "/commercial/technical-support",
      text: "\u{1F984} Tech Support"
    },
    {
      link: "/sponsor/personal",
      text: "\u2728 Sponsor"
    },
    {
      link: "/commercial/community",
      text: "\u{1F468}\u200D\u{1F466}\u200D\u{1F466} Community"
    }
    // {
    //   link: '/friend-links/',
    //   text: '🤝 Friend Links',
    // },
  ];
}

// .vitepress/config/shared.mts
import { resolve } from "node:path";
import {
  viteArchiverPlugin,
  viteVxeTableImportsPlugin
} from "file:///Users/henry/Project/last-admin/last-admin-vben5/internal/vite-config/dist/index.mjs";
import {
  GitChangelog,
  GitChangelogMarkdownSection
} from "file:///Users/henry/Project/last-admin/last-admin-vben5/node_modules/.pnpm/@nolebase+vitepress-plugin-git-changelog@2.18.0_typescript@5.8.3_vitepress@1.6.3_@algolia+cli_gptd6ztx2f52ss7by26svybjra/node_modules/@nolebase/vitepress-plugin-git-changelog/dist/vite/index.mjs";
import tailwind from "file:///Users/henry/Project/last-admin/last-admin-vben5/node_modules/.pnpm/tailwindcss@3.4.17/node_modules/tailwindcss/lib/index.js";
import { defineConfig as defineConfig3, postcssIsolateStyles } from "file:///Users/henry/Project/last-admin/last-admin-vben5/node_modules/.pnpm/vitepress@1.6.3_@algolia+client-search@5.23.4_@types+node@22.16.0_async-validator@4.2.5_axios_ckivqexnwv5qinw5d7czg76siq/node_modules/vitepress/dist/node/index.js";
import {
  groupIconMdPlugin,
  groupIconVitePlugin
} from "file:///Users/henry/Project/last-admin/last-admin-vben5/node_modules/.pnpm/vitepress-plugin-group-icons@1.6.1_markdown-it@14.1.0_vite@5.4.18_@types+node@22.16.0_less@4._622kuaawyf5wod5d6lt5lznhdi/node_modules/vitepress-plugin-group-icons/dist/index.js";

// .vitepress/config/plugins/demo-preview.ts
import crypto from "node:crypto";
import { readdirSync } from "node:fs";
import { join } from "node:path";
var rawPathRegexp = (
  // eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/strict
  /^(.+?(?:\.([\da-z]+))?)(#[\w-]+)?(?: ?{(\d+(?:[,-]\d+)*)? ?(\S+)?})? ?(?:\[(.+)])?$/
);
function rawPathToToken(rawPath) {
  const [
    filepath = "",
    extension = "",
    region = "",
    lines = "",
    lang = "",
    rawTitle = ""
  ] = (rawPathRegexp.exec(rawPath) || []).slice(1);
  const title = rawTitle || filepath.split("/").pop() || "";
  return { extension, filepath, lang, lines, region, title };
}
var demoPreviewPlugin = (md) => {
  md.core.ruler.after("inline", "demo-preview", (state) => {
    const insertComponentImport = (importString) => {
      const index = state.tokens.findIndex(
        (i) => i.type === "html_block" && i.content.match(/<script setup>/g)
      );
      if (index === -1) {
        const importComponent = new state.Token("html_block", "", 0);
        importComponent.content = `<script setup>
${importString}
</script>
`;
        state.tokens.splice(0, 0, importComponent);
      } else {
        if (state.tokens[index]) {
          const content = state.tokens[index].content;
          state.tokens[index].content = content.replace(
            "</script>",
            `${importString}
</script>`
          );
        }
      }
    };
    const regex = /<DemoPreview[^>]*\sdir="([^"]*)"/g;
    state.src = state.src.replaceAll(regex, (_match, dir) => {
      const componentDir = join(process.cwd(), "src", dir).replaceAll(
        "\\",
        "/"
      );
      let childFiles = [];
      let dirExists = true;
      try {
        childFiles = readdirSync(componentDir, {
          encoding: "utf8",
          recursive: false,
          withFileTypes: false
        }) || [];
      } catch {
        dirExists = false;
      }
      if (!dirExists) {
        return "";
      }
      const uniqueWord = generateContentHash(componentDir);
      const ComponentName = `DemoComponent_${uniqueWord}`;
      insertComponentImport(
        `import ${ComponentName} from '${componentDir}/index.vue'`
      );
      const { path: _path } = state.env;
      const index = state.tokens.findIndex((i) => i.content.match(regex));
      if (!state.tokens[index]) {
        return "";
      }
      const firstString = "index.vue";
      childFiles = childFiles.sort((a, b) => {
        if (a === firstString) return -1;
        if (b === firstString) return 1;
        return a.localeCompare(b, "en", { sensitivity: "base" });
      });
      state.tokens[index].content = `<DemoPreview files="${encodeURIComponent(JSON.stringify(childFiles))}" ><${ComponentName}/>
        `;
      const _dummyToken = new state.Token("", "", 0);
      const tokenArray = [];
      childFiles.forEach((filename) => {
        const templateStart = new state.Token("html_inline", "", 0);
        templateStart.content = `<template #${filename}>`;
        tokenArray.push(templateStart);
        const resolvedPath = join(componentDir, filename);
        const { extension, filepath, lang, lines, title } = rawPathToToken(resolvedPath);
        const token = new state.Token("fence", "code", 0);
        token.info = `${lang || extension}${lines ? `{${lines}}` : ""}${title ? `[${title}]` : ""}`;
        token.content = `<<< ${filepath}`;
        token.src = [resolvedPath];
        tokenArray.push(token);
        const templateEnd = new state.Token("html_inline", "", 0);
        templateEnd.content = "</template>";
        tokenArray.push(templateEnd);
      });
      const endTag = new state.Token("html_inline", "", 0);
      endTag.content = "</DemoPreview>";
      tokenArray.push(endTag);
      state.tokens.splice(index + 1, 0, ...tokenArray);
      return "";
    });
  });
};
function generateContentHash(input, length = 10) {
  const hash = crypto.createHash("sha256").update(input).digest("hex");
  return Number.parseInt(hash, 16).toString(36).slice(0, length);
}

// .vitepress/config/zh.mts
import { defineConfig as defineConfig2 } from "file:///Users/henry/Project/last-admin/last-admin-vben5/node_modules/.pnpm/vitepress@1.6.3_@algolia+client-search@5.23.4_@types+node@22.16.0_async-validator@4.2.5_axios_ckivqexnwv5qinw5d7czg76siq/node_modules/vitepress/dist/node/index.js";
var zh = defineConfig2({
  description: "Vben Admin & \u4F01\u4E1A\u7EA7\u7BA1\u7406\u7CFB\u7EDF\u6846\u67B6",
  lang: "zh-Hans",
  themeConfig: {
    darkModeSwitchLabel: "\u4E3B\u9898",
    darkModeSwitchTitle: "\u5207\u6362\u5230\u6DF1\u8272\u6A21\u5F0F",
    docFooter: {
      next: "\u4E0B\u4E00\u9875",
      prev: "\u4E0A\u4E00\u9875"
    },
    editLink: {
      pattern: "https://github.com/vbenjs/vue-vben-admin/edit/main/docs/src/:path",
      text: "\u5728 GitHub \u4E0A\u7F16\u8F91\u6B64\u9875\u9762"
    },
    footer: {
      copyright: `Copyright \xA9 2020-${(/* @__PURE__ */ new Date()).getFullYear()} Vben`,
      message: "\u57FA\u4E8E MIT \u8BB8\u53EF\u53D1\u5E03."
    },
    langMenuLabel: "\u591A\u8BED\u8A00",
    lastUpdated: {
      formatOptions: {
        dateStyle: "short",
        timeStyle: "medium"
      },
      text: "\u6700\u540E\u66F4\u65B0\u4E8E"
    },
    lightModeSwitchTitle: "\u5207\u6362\u5230\u6D45\u8272\u6A21\u5F0F",
    nav: nav2(),
    outline: {
      label: "\u9875\u9762\u5BFC\u822A"
    },
    returnToTopLabel: "\u56DE\u5230\u9876\u90E8",
    sidebar: {
      "/commercial/": { base: "/commercial/", items: sidebarCommercial2() },
      "/components/": { base: "/components/", items: sidebarComponents() },
      "/guide/": { base: "/guide/", items: sidebarGuide2() }
    },
    sidebarMenuLabel: "\u83DC\u5355"
  }
});
function sidebarGuide2() {
  return [
    {
      collapsed: false,
      text: "\u7B80\u4ECB",
      items: [
        {
          link: "introduction/vben",
          text: "\u5173\u4E8E Vben Admin"
        },
        {
          link: "introduction/why",
          text: "\u4E3A\u4EC0\u4E48\u9009\u62E9\u6211\u4EEC?"
        },
        { link: "introduction/quick-start", text: "\u5FEB\u901F\u5F00\u59CB" },
        { link: "introduction/thin", text: "\u7CBE\u7B80\u7248\u672C" },
        {
          base: "/",
          link: "components/introduction",
          text: "\u7EC4\u4EF6\u6587\u6863"
        }
      ]
    },
    {
      text: "\u57FA\u7840",
      items: [
        { link: "essentials/concept", text: "\u57FA\u7840\u6982\u5FF5" },
        { link: "essentials/development", text: "\u672C\u5730\u5F00\u53D1" },
        { link: "essentials/route", text: "\u8DEF\u7531\u548C\u83DC\u5355" },
        { link: "essentials/settings", text: "\u914D\u7F6E" },
        { link: "essentials/icons", text: "\u56FE\u6807" },
        { link: "essentials/styles", text: "\u6837\u5F0F" },
        { link: "essentials/external-module", text: "\u5916\u90E8\u6A21\u5757" },
        { link: "essentials/build", text: "\u6784\u5EFA\u4E0E\u90E8\u7F72" },
        { link: "essentials/server", text: "\u670D\u52A1\u7AEF\u4EA4\u4E92\u4E0E\u6570\u636EMock" }
      ]
    },
    {
      text: "\u6DF1\u5165",
      items: [
        { link: "in-depth/login", text: "\u767B\u5F55" },
        // { link: 'in-depth/layout', text: '布局' },
        { link: "in-depth/theme", text: "\u4E3B\u9898" },
        { link: "in-depth/access", text: "\u6743\u9650" },
        { link: "in-depth/locale", text: "\u56FD\u9645\u5316" },
        { link: "in-depth/features", text: "\u5E38\u7528\u529F\u80FD" },
        { link: "in-depth/check-updates", text: "\u68C0\u67E5\u66F4\u65B0" },
        { link: "in-depth/loading", text: "\u5168\u5C40loading" },
        { link: "in-depth/ui-framework", text: "\u7EC4\u4EF6\u5E93\u5207\u6362" }
      ]
    },
    {
      text: "\u5DE5\u7A0B",
      items: [
        { link: "project/standard", text: "\u89C4\u8303" },
        { link: "project/cli", text: "CLI" },
        { link: "project/dir", text: "\u76EE\u5F55\u8BF4\u660E" },
        { link: "project/test", text: "\u5355\u5143\u6D4B\u8BD5" },
        { link: "project/tailwindcss", text: "Tailwind CSS" },
        { link: "project/changeset", text: "Changeset" },
        { link: "project/vite", text: "Vite Config" }
      ]
    },
    {
      text: "\u5176\u4ED6",
      items: [
        { link: "other/project-update", text: "\u9879\u76EE\u66F4\u65B0" },
        { link: "other/remove-code", text: "\u79FB\u9664\u4EE3\u7801" },
        { link: "other/faq", text: "\u5E38\u89C1\u95EE\u9898" }
      ]
    }
  ];
}
function sidebarCommercial2() {
  return [
    {
      link: "community",
      text: "\u4EA4\u6D41\u7FA4"
    },
    {
      link: "technical-support",
      text: "\u6280\u672F\u652F\u6301"
    },
    {
      link: "customized",
      text: "\u5B9A\u5236\u5F00\u53D1"
    }
  ];
}
function sidebarComponents() {
  return [
    {
      text: "\u7EC4\u4EF6",
      items: [
        {
          link: "introduction",
          text: "\u4ECB\u7ECD"
        }
      ]
    },
    {
      collapsed: false,
      text: "\u5E03\u5C40\u7EC4\u4EF6",
      items: [
        {
          link: "layout-ui/page",
          text: "Page \u9875\u9762"
        }
      ]
    },
    {
      collapsed: false,
      text: "\u901A\u7528\u7EC4\u4EF6",
      items: [
        {
          link: "common-ui/vben-api-component",
          text: "ApiComponent Api\u7EC4\u4EF6\u5305\u88C5\u5668"
        },
        {
          link: "common-ui/vben-alert",
          text: "Alert \u8F7B\u91CF\u63D0\u793A\u6846"
        },
        {
          link: "common-ui/vben-modal",
          text: "Modal \u6A21\u6001\u6846"
        },
        {
          link: "common-ui/vben-drawer",
          text: "Drawer \u62BD\u5C49"
        },
        {
          link: "common-ui/vben-form",
          text: "Form \u8868\u5355"
        },
        {
          link: "common-ui/vben-vxe-table",
          text: "Vxe Table \u8868\u683C"
        },
        {
          link: "common-ui/vben-count-to-animator",
          text: "CountToAnimator \u6570\u5B57\u52A8\u753B"
        },
        {
          link: "common-ui/vben-ellipsis-text",
          text: "EllipsisText \u7701\u7565\u6587\u672C"
        }
      ]
    }
  ];
}
function nav2() {
  return [
    {
      activeMatch: "^/(guide|components)/",
      text: "\u6587\u6863",
      items: [
        {
          activeMatch: "^/guide/",
          link: "/guide/introduction/vben",
          text: "\u6307\u5357"
        },
        {
          activeMatch: "^/components/",
          link: "/components/introduction",
          text: "\u7EC4\u4EF6"
        },
        {
          text: "\u5386\u53F2\u7248\u672C",
          items: [
            {
              link: "https://doc.vvbin.cn",
              text: "2.x\u7248\u672C\u6587\u6863"
            }
          ]
        }
      ]
    },
    {
      text: "\u6F14\u793A",
      items: [
        {
          text: "Vben Admin",
          items: [
            {
              link: "https://www.vben.pro",
              text: "\u6F14\u793A\u7248\u672C"
            },
            {
              link: "https://ant.vben.pro",
              text: "Ant Design Vue \u7248\u672C"
            },
            {
              link: "https://naive.vben.pro",
              text: "Naive \u7248\u672C"
            },
            {
              link: "https://ele.vben.pro",
              text: "Element Plus\u7248\u672C"
            }
          ]
        },
        {
          text: "\u5176\u4ED6",
          items: [
            {
              link: "https://vben.vvbin.cn",
              text: "Vben Admin 2.x"
            }
          ]
        }
      ]
    },
    {
      text: version,
      items: [
        {
          link: "https://github.com/vbenjs/vue-vben-admin/releases",
          text: "\u66F4\u65B0\u65E5\u5FD7"
        },
        {
          link: "https://github.com/orgs/vbenjs/projects/5",
          text: "\u8DEF\u7EBF\u56FE"
        },
        {
          link: "https://github.com/vbenjs/vue-vben-admin/blob/main/.github/contributing.md",
          text: "\u8D21\u732E"
        }
      ]
    },
    {
      link: "/commercial/technical-support",
      text: "\u{1F984} \u6280\u672F\u652F\u6301"
    },
    {
      link: "/sponsor/personal",
      text: "\u2728 \u8D5E\u52A9"
    },
    {
      link: "/commercial/community",
      text: "\u{1F468}\u200D\u{1F466}\u200D\u{1F466} \u4EA4\u6D41\u7FA4"
      // items: [
      //   {
      //     link: 'https://qun.qq.com/qqweb/qunpro/share?_wv=3&_wwv=128&appChannel=share&inviteCode=22ySzj7pKiw&businessType=9&from=246610&biz=ka&mainSourceId=share&subSourceId=others&jumpsource=shorturl#/pc',
      //     text: 'QQ频道',
      //   },
      //   {
      //     link: 'https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=mjZmlhgVzzUxvdxllB6C1vHpX8O8QRL0&authKey=DBdFbBwERmfaKY95JvRWqLCJIRGJAmKyZbrpzZ41EKDMZ5SR6MfbjOBaaNRN73fr&noverify=0&group_code=4286109',
      //     text: 'QQ群',
      //   },
      //   {
      //     link: 'https://discord.gg/VU62jTecad',
      //     text: 'Discord',
      //   },
      // ],
    }
    // {
    //   link: '/friend-links/',
    //   text: '🤝 友情链接',
    // },
  ];
}
var search = {
  root: {
    placeholder: "\u641C\u7D22\u6587\u6863",
    translations: {
      button: {
        buttonAriaLabel: "\u641C\u7D22\u6587\u6863",
        buttonText: "\u641C\u7D22\u6587\u6863"
      },
      modal: {
        errorScreen: {
          helpText: "\u4F60\u53EF\u80FD\u9700\u8981\u68C0\u67E5\u4F60\u7684\u7F51\u7EDC\u8FDE\u63A5",
          titleText: "\u65E0\u6CD5\u83B7\u53D6\u7ED3\u679C"
        },
        footer: {
          closeText: "\u5173\u95ED",
          navigateText: "\u5207\u6362",
          searchByText: "\u641C\u7D22\u63D0\u4F9B\u8005",
          selectText: "\u9009\u62E9"
        },
        noResultsScreen: {
          noResultsText: "\u65E0\u6CD5\u627E\u5230\u76F8\u5173\u7ED3\u679C",
          reportMissingResultsLinkText: "\u70B9\u51FB\u53CD\u9988",
          reportMissingResultsText: "\u4F60\u8BA4\u4E3A\u8BE5\u67E5\u8BE2\u5E94\u8BE5\u6709\u7ED3\u679C\uFF1F",
          suggestedQueryText: "\u4F60\u53EF\u4EE5\u5C1D\u8BD5\u67E5\u8BE2"
        },
        searchBox: {
          cancelButtonAriaLabel: "\u53D6\u6D88",
          cancelButtonText: "\u53D6\u6D88",
          resetButtonAriaLabel: "\u6E05\u9664\u67E5\u8BE2\u6761\u4EF6",
          resetButtonTitle: "\u6E05\u9664\u67E5\u8BE2\u6761\u4EF6"
        },
        startScreen: {
          favoriteSearchesTitle: "\u6536\u85CF",
          noRecentSearchesText: "\u6CA1\u6709\u641C\u7D22\u5386\u53F2",
          recentSearchesTitle: "\u641C\u7D22\u5386\u53F2",
          removeFavoriteSearchButtonTitle: "\u4ECE\u6536\u85CF\u4E2D\u79FB\u9664",
          removeRecentSearchButtonTitle: "\u4ECE\u641C\u7D22\u5386\u53F2\u4E2D\u79FB\u9664",
          saveRecentSearchButtonTitle: "\u4FDD\u5B58\u81F3\u641C\u7D22\u5386\u53F2"
        }
      }
    }
  }
};

// .vitepress/config/shared.mts
var shared = defineConfig3({
  appearance: "dark",
  head: head(),
  markdown: {
    preConfig(md) {
      md.use(demoPreviewPlugin);
      md.use(groupIconMdPlugin);
    }
  },
  pwa: pwa(),
  srcDir: "src",
  themeConfig: {
    i18nRouting: true,
    logo: "https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp",
    search: {
      options: {
        locales: {
          ...search
        }
      },
      provider: "local"
    },
    siteTitle: "Vben Admin",
    socialLinks: [
      { icon: "github", link: "https://github.com/vbenjs/vue-vben-admin" }
    ]
  },
  title: "Vben Admin",
  vite: {
    build: {
      chunkSizeWarningLimit: Infinity,
      minify: "terser"
    },
    css: {
      postcss: {
        plugins: [
          tailwind(),
          postcssIsolateStyles({ includeFiles: [/vp-doc\.css/] })
        ]
      },
      preprocessorOptions: {
        scss: {
          api: "modern"
        }
      }
    },
    json: {
      stringify: true
    },
    plugins: [
      GitChangelog({
        mapAuthors: [
          {
            mapByNameAliases: ["Vben"],
            name: "vben",
            username: "anncwb"
          },
          {
            name: "vince",
            username: "vince292007"
          },
          {
            name: "Li Kui",
            username: "likui628"
          }
        ],
        repoURL: () => "https://github.com/vbenjs/vue-vben-admin"
      }),
      GitChangelogMarkdownSection(),
      viteArchiverPlugin({ outputDir: ".vitepress" }),
      groupIconVitePlugin(),
      await viteVxeTableImportsPlugin()
    ],
    server: {
      fs: {
        allow: ["../.."]
      },
      host: true,
      port: 6173
    },
    ssr: {
      external: ["@vue/repl"]
    }
  }
});
function head() {
  return [
    ["meta", { content: "Vbenjs Team", name: "author" }],
    [
      "meta",
      {
        content: "vben, vitejs, vite, shacdn-ui, vue",
        name: "keywords"
      }
    ],
    ["link", { href: "/favicon.ico", rel: "icon", type: "image/svg+xml" }],
    [
      "meta",
      {
        content: "width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no",
        name: "viewport"
      }
    ],
    ["meta", { content: "vben admin docs", name: "keywords" }],
    ["link", { href: "/favicon.ico", rel: "icon" }]
    // [
    //   'script',
    //   {
    //     src: 'https://cdn.tailwindcss.com',
    //   },
    // ],
  ];
}
function pwa() {
  return {
    includeManifestIcons: false,
    manifest: {
      description: "Vben Admin is a modern admin dashboard template based on Vue 3. ",
      icons: [
        {
          sizes: "192x192",
          src: "https://unpkg.com/@vbenjs/static-source@0.1.7/source/pwa-icon-192.png",
          type: "image/png"
        },
        {
          sizes: "512x512",
          src: "https://unpkg.com/@vbenjs/static-source@0.1.7/source/pwa-icon-512.png",
          type: "image/png"
        }
      ],
      id: "/",
      name: "Vben Admin Doc",
      short_name: "vben_admin_doc",
      theme_color: "#ffffff"
    },
    outDir: resolve(process.cwd(), ".vitepress/dist"),
    registerType: "autoUpdate",
    workbox: {
      globPatterns: ["**/*.{css,js,html,svg,png,ico,txt,woff2}"],
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
    }
  };
}

// .vitepress/config/index.mts
var index_default = withPwa(
  defineConfigWithTheme({
    ...shared,
    locales: {
      en: {
        label: "English",
        lang: "en",
        link: "/en/",
        ...en
      },
      root: {
        label: "\u7B80\u4F53\u4E2D\u6587",
        lang: "zh-CN",
        ...zh
      }
    }
  })
);
export {
  index_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLnZpdGVwcmVzcy9jb25maWcvaW5kZXgubXRzIiwgIi52aXRlcHJlc3MvY29uZmlnL2VuLm10cyIsICIuLi9wYWNrYWdlLmpzb24iLCAiLnZpdGVwcmVzcy9jb25maWcvc2hhcmVkLm10cyIsICIudml0ZXByZXNzL2NvbmZpZy9wbHVnaW5zL2RlbW8tcHJldmlldy50cyIsICIudml0ZXByZXNzL2NvbmZpZy96aC5tdHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvaGVucnkvUHJvamVjdC9sYXN0LWFkbWluL2xhc3QtYWRtaW4tdmJlbjUvZG9jcy8udml0ZXByZXNzL2NvbmZpZ1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2hlbnJ5L1Byb2plY3QvbGFzdC1hZG1pbi9sYXN0LWFkbWluLXZiZW41L2RvY3MvLnZpdGVwcmVzcy9jb25maWcvaW5kZXgubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9oZW5yeS9Qcm9qZWN0L2xhc3QtYWRtaW4vbGFzdC1hZG1pbi12YmVuNS9kb2NzLy52aXRlcHJlc3MvY29uZmlnL2luZGV4Lm10c1wiO2ltcG9ydCB7IHdpdGhQd2EgfSBmcm9tICdAdml0ZS1wd2Evdml0ZXByZXNzJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZ1dpdGhUaGVtZSB9IGZyb20gJ3ZpdGVwcmVzcyc7XG5cbmltcG9ydCB7IGVuIH0gZnJvbSAnLi9lbi5tdHMnO1xuaW1wb3J0IHsgc2hhcmVkIH0gZnJvbSAnLi9zaGFyZWQubXRzJztcbmltcG9ydCB7IHpoIH0gZnJvbSAnLi96aC5tdHMnO1xuXG5leHBvcnQgZGVmYXVsdCB3aXRoUHdhKFxuICBkZWZpbmVDb25maWdXaXRoVGhlbWUoe1xuICAgIC4uLnNoYXJlZCxcbiAgICBsb2NhbGVzOiB7XG4gICAgICBlbjoge1xuICAgICAgICBsYWJlbDogJ0VuZ2xpc2gnLFxuICAgICAgICBsYW5nOiAnZW4nLFxuICAgICAgICBsaW5rOiAnL2VuLycsXG4gICAgICAgIC4uLmVuLFxuICAgICAgfSxcbiAgICAgIHJvb3Q6IHtcbiAgICAgICAgbGFiZWw6ICdcdTdCODBcdTRGNTNcdTRFMkRcdTY1ODcnLFxuICAgICAgICBsYW5nOiAnemgtQ04nLFxuICAgICAgICAuLi56aCxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSksXG4pO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvaGVucnkvUHJvamVjdC9sYXN0LWFkbWluL2xhc3QtYWRtaW4tdmJlbjUvZG9jcy8udml0ZXByZXNzL2NvbmZpZ1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2hlbnJ5L1Byb2plY3QvbGFzdC1hZG1pbi9sYXN0LWFkbWluLXZiZW41L2RvY3MvLnZpdGVwcmVzcy9jb25maWcvZW4ubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9oZW5yeS9Qcm9qZWN0L2xhc3QtYWRtaW4vbGFzdC1hZG1pbi12YmVuNS9kb2NzLy52aXRlcHJlc3MvY29uZmlnL2VuLm10c1wiO2ltcG9ydCB0eXBlIHsgRGVmYXVsdFRoZW1lIH0gZnJvbSAndml0ZXByZXNzJztcblxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXByZXNzJztcblxuaW1wb3J0IHsgdmVyc2lvbiB9IGZyb20gJy4uLy4uLy4uL3BhY2thZ2UuanNvbic7XG5cbmV4cG9ydCBjb25zdCBlbiA9IGRlZmluZUNvbmZpZyh7XG4gIGRlc2NyaXB0aW9uOiAnVmJlbiBBZG1pbiAmIEVudGVycHJpc2UgbGV2ZWwgbWFuYWdlbWVudCBzeXN0ZW0gZnJhbWV3b3JrJyxcbiAgbGFuZzogJ2VuLVVTJyxcbiAgdGhlbWVDb25maWc6IHtcbiAgICBkYXJrTW9kZVN3aXRjaExhYmVsOiAnVGhlbWUnLFxuICAgIGRhcmtNb2RlU3dpdGNoVGl0bGU6ICdTd2l0Y2ggdG8gRGFyayBNb2RlJyxcbiAgICBkb2NGb290ZXI6IHtcbiAgICAgIG5leHQ6ICdOZXh0IFBhZ2UnLFxuICAgICAgcHJldjogJ1ByZXZpb3VzIFBhZ2UnLFxuICAgIH0sXG4gICAgZWRpdExpbms6IHtcbiAgICAgIHBhdHRlcm46XG4gICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vdmJlbmpzL3Z1ZS12YmVuLWFkbWluL2VkaXQvbWFpbi9kb2NzL3NyYy86cGF0aCcsXG4gICAgICB0ZXh0OiAnRWRpdCB0aGlzIHBhZ2Ugb24gR2l0SHViJyxcbiAgICB9LFxuICAgIGZvb3Rlcjoge1xuICAgICAgY29weXJpZ2h0OiBgQ29weXJpZ2h0IFx1MDBBOSAyMDIwLSR7bmV3IERhdGUoKS5nZXRGdWxsWWVhcigpfSBWYmVuYCxcbiAgICAgIG1lc3NhZ2U6ICdSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuJyxcbiAgICB9LFxuICAgIGxhbmdNZW51TGFiZWw6ICdMYW5ndWFnZScsXG4gICAgbGFzdFVwZGF0ZWQ6IHtcbiAgICAgIGZvcm1hdE9wdGlvbnM6IHtcbiAgICAgICAgZGF0ZVN0eWxlOiAnc2hvcnQnLFxuICAgICAgICB0aW1lU3R5bGU6ICdtZWRpdW0nLFxuICAgICAgfSxcbiAgICAgIHRleHQ6ICdMYXN0IHVwZGF0ZWQgb24nLFxuICAgIH0sXG4gICAgbGlnaHRNb2RlU3dpdGNoVGl0bGU6ICdTd2l0Y2ggdG8gTGlnaHQgTW9kZScsXG4gICAgbmF2OiBuYXYoKSxcbiAgICBvdXRsaW5lOiB7XG4gICAgICBsYWJlbDogJ05hdmlnYXRlJyxcbiAgICB9LFxuICAgIHJldHVyblRvVG9wTGFiZWw6ICdCYWNrIHRvIHRvcCcsXG4gICAgc2lkZWJhcjoge1xuICAgICAgJy9lbi9jb21tZXJjaWFsLyc6IHtcbiAgICAgICAgYmFzZTogJy9lbi9jb21tZXJjaWFsLycsXG4gICAgICAgIGl0ZW1zOiBzaWRlYmFyQ29tbWVyY2lhbCgpLFxuICAgICAgfSxcbiAgICAgICcvZW4vZ3VpZGUvJzogeyBiYXNlOiAnL2VuL2d1aWRlLycsIGl0ZW1zOiBzaWRlYmFyR3VpZGUoKSB9LFxuICAgIH0sXG4gIH0sXG59KTtcblxuZnVuY3Rpb24gc2lkZWJhckd1aWRlKCk6IERlZmF1bHRUaGVtZS5TaWRlYmFySXRlbVtdIHtcbiAgcmV0dXJuIFtcbiAgICB7XG4gICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgdGV4dDogJ0ludHJvZHVjdGlvbicsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7XG4gICAgICAgICAgbGluazogJ2ludHJvZHVjdGlvbi92YmVuJyxcbiAgICAgICAgICB0ZXh0OiAnQWJvdXQgVmJlbiBBZG1pbicsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBsaW5rOiAnaW50cm9kdWN0aW9uL3doeScsXG4gICAgICAgICAgdGV4dDogJ1doeSBDaG9vc2UgVXM/JyxcbiAgICAgICAgfSxcbiAgICAgICAgeyBsaW5rOiAnaW50cm9kdWN0aW9uL3F1aWNrLXN0YXJ0JywgdGV4dDogJ1F1aWNrIFN0YXJ0JyB9LFxuICAgICAgICB7IGxpbms6ICdpbnRyb2R1Y3Rpb24vdGhpbicsIHRleHQ6ICdMaXRlIFZlcnNpb24nIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgdGV4dDogJ0Jhc2ljcycsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IGxpbms6ICdlc3NlbnRpYWxzL2NvbmNlcHQnLCB0ZXh0OiAnQmFzaWMgQ29uY2VwdHMnIH0sXG4gICAgICAgIHsgbGluazogJ2Vzc2VudGlhbHMvZGV2ZWxvcG1lbnQnLCB0ZXh0OiAnTG9jYWwgRGV2ZWxvcG1lbnQnIH0sXG4gICAgICAgIHsgbGluazogJ2Vzc2VudGlhbHMvcm91dGUnLCB0ZXh0OiAnUm91dGluZyBhbmQgTWVudScgfSxcbiAgICAgICAgeyBsaW5rOiAnZXNzZW50aWFscy9zZXR0aW5ncycsIHRleHQ6ICdDb25maWd1cmF0aW9uJyB9LFxuICAgICAgICB7IGxpbms6ICdlc3NlbnRpYWxzL2ljb25zJywgdGV4dDogJ0ljb25zJyB9LFxuICAgICAgICB7IGxpbms6ICdlc3NlbnRpYWxzL3N0eWxlcycsIHRleHQ6ICdTdHlsZXMnIH0sXG4gICAgICAgIHsgbGluazogJ2Vzc2VudGlhbHMvZXh0ZXJuYWwtbW9kdWxlJywgdGV4dDogJ0V4dGVybmFsIE1vZHVsZXMnIH0sXG4gICAgICAgIHsgbGluazogJ2Vzc2VudGlhbHMvYnVpbGQnLCB0ZXh0OiAnQnVpbGQgYW5kIERlcGxveW1lbnQnIH0sXG4gICAgICAgIHsgbGluazogJ2Vzc2VudGlhbHMvc2VydmVyJywgdGV4dDogJ1NlcnZlciBJbnRlcmFjdGlvbiBhbmQgRGF0YSBNb2NrJyB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6ICdBZHZhbmNlZCcsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IGxpbms6ICdpbi1kZXB0aC9sb2dpbicsIHRleHQ6ICdMb2dpbicgfSxcbiAgICAgICAgeyBsaW5rOiAnaW4tZGVwdGgvdGhlbWUnLCB0ZXh0OiAnVGhlbWUnIH0sXG4gICAgICAgIHsgbGluazogJ2luLWRlcHRoL2FjY2VzcycsIHRleHQ6ICdBY2Nlc3MgQ29udHJvbCcgfSxcbiAgICAgICAgeyBsaW5rOiAnaW4tZGVwdGgvbG9jYWxlJywgdGV4dDogJ0ludGVybmF0aW9uYWxpemF0aW9uJyB9LFxuICAgICAgICB7IGxpbms6ICdpbi1kZXB0aC9mZWF0dXJlcycsIHRleHQ6ICdDb21tb24gRmVhdHVyZXMnIH0sXG4gICAgICAgIHsgbGluazogJ2luLWRlcHRoL2NoZWNrLXVwZGF0ZXMnLCB0ZXh0OiAnQ2hlY2sgVXBkYXRlcycgfSxcbiAgICAgICAgeyBsaW5rOiAnaW4tZGVwdGgvbG9hZGluZycsIHRleHQ6ICdHbG9iYWwgTG9hZGluZycgfSxcbiAgICAgICAgeyBsaW5rOiAnaW4tZGVwdGgvdWktZnJhbWV3b3JrJywgdGV4dDogJ1VJIEZyYW1ld29yayBTd2l0Y2hpbmcnIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgdGV4dDogJ0VuZ2luZWVyaW5nJyxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgbGluazogJ3Byb2plY3Qvc3RhbmRhcmQnLCB0ZXh0OiAnU3RhbmRhcmRzJyB9LFxuICAgICAgICB7IGxpbms6ICdwcm9qZWN0L2NsaScsIHRleHQ6ICdDTEknIH0sXG4gICAgICAgIHsgbGluazogJ3Byb2plY3QvZGlyJywgdGV4dDogJ0RpcmVjdG9yeSBFeHBsYW5hdGlvbicgfSxcbiAgICAgICAgeyBsaW5rOiAncHJvamVjdC90ZXN0JywgdGV4dDogJ1VuaXQgVGVzdGluZycgfSxcbiAgICAgICAgeyBsaW5rOiAncHJvamVjdC90YWlsd2luZGNzcycsIHRleHQ6ICdUYWlsd2luZCBDU1MnIH0sXG4gICAgICAgIHsgbGluazogJ3Byb2plY3QvY2hhbmdlc2V0JywgdGV4dDogJ0NoYW5nZXNldCcgfSxcbiAgICAgICAgeyBsaW5rOiAncHJvamVjdC92aXRlJywgdGV4dDogJ1ZpdGUgQ29uZmlnJyB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6ICdPdGhlcnMnLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyBsaW5rOiAnb3RoZXIvcHJvamVjdC11cGRhdGUnLCB0ZXh0OiAnUHJvamVjdCBVcGRhdGUnIH0sXG4gICAgICAgIHsgbGluazogJ290aGVyL3JlbW92ZS1jb2RlJywgdGV4dDogJ1JlbW92ZSBDb2RlJyB9LFxuICAgICAgICB7IGxpbms6ICdvdGhlci9mYXEnLCB0ZXh0OiAnRkFRJyB9LFxuICAgICAgXSxcbiAgICB9LFxuICBdO1xufVxuXG5mdW5jdGlvbiBzaWRlYmFyQ29tbWVyY2lhbCgpOiBEZWZhdWx0VGhlbWUuU2lkZWJhckl0ZW1bXSB7XG4gIHJldHVybiBbXG4gICAge1xuICAgICAgbGluazogJ2NvbW11bml0eScsXG4gICAgICB0ZXh0OiAnQ29tbXVuaXR5JyxcbiAgICB9LFxuICAgIHtcbiAgICAgIGxpbms6ICd0ZWNobmljYWwtc3VwcG9ydCcsXG4gICAgICB0ZXh0OiAnVGVjaG5pY2FsLXN1cHBvcnQnLFxuICAgIH0sXG4gICAge1xuICAgICAgbGluazogJ2N1c3RvbWl6ZWQnLFxuICAgICAgdGV4dDogJ0N1c3RvbWl6ZWQnLFxuICAgIH0sXG4gIF07XG59XG5cbmZ1bmN0aW9uIG5hdigpOiBEZWZhdWx0VGhlbWUuTmF2SXRlbVtdIHtcbiAgcmV0dXJuIFtcbiAgICB7XG4gICAgICBhY3RpdmVNYXRjaDogJ14vZW4vKGd1aWRlfGNvbXBvbmVudHMpLycsXG4gICAgICB0ZXh0OiAnRG9jJyxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBhY3RpdmVNYXRjaDogJ14vZW4vZ3VpZGUvJyxcbiAgICAgICAgICBsaW5rOiAnL2VuL2d1aWRlL2ludHJvZHVjdGlvbi92YmVuJyxcbiAgICAgICAgICB0ZXh0OiAnR3VpZGUnLFxuICAgICAgICB9LFxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgYWN0aXZlTWF0Y2g6ICdeL2VuL2NvbXBvbmVudHMvJyxcbiAgICAgICAgLy8gICBsaW5rOiAnL2VuL2NvbXBvbmVudHMvaW50cm9kdWN0aW9uJyxcbiAgICAgICAgLy8gICB0ZXh0OiAnQ29tcG9uZW50cycsXG4gICAgICAgIC8vIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiAnSGlzdG9yaWNhbCBWZXJzaW9ucycsXG4gICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGluazogJ2h0dHBzOi8vZG9jLnZ2YmluLmNuJyxcbiAgICAgICAgICAgICAgdGV4dDogJzIueCBWZXJzaW9uIERvY3VtZW50YXRpb24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6ICdEZW1vJyxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiAnVmJlbiBBZG1pbicsXG4gICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGluazogJ2h0dHBzOi8vd3d3LnZiZW4ucHJvJyxcbiAgICAgICAgICAgICAgdGV4dDogJ0RlbW8gVmVyc2lvbicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsaW5rOiAnaHR0cHM6Ly9hbnQudmJlbi5wcm8nLFxuICAgICAgICAgICAgICB0ZXh0OiAnQW50IERlc2lnbiBWdWUgVmVyc2lvbicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsaW5rOiAnaHR0cHM6Ly9uYWl2ZS52YmVuLnBybycsXG4gICAgICAgICAgICAgIHRleHQ6ICdOYWl2ZSBWZXJzaW9uJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGxpbms6ICdodHRwczovL2VsZS52YmVuLnBybycsXG4gICAgICAgICAgICAgIHRleHQ6ICdFbGVtZW50IFBsdXMgVmVyc2lvbicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiAnT3RoZXJzJyxcbiAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsaW5rOiAnaHR0cHM6Ly92YmVuLnZ2YmluLmNuJyxcbiAgICAgICAgICAgICAgdGV4dDogJ1ZiZW4gQWRtaW4gMi54JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiB2ZXJzaW9uLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vdmJlbmpzL3Z1ZS12YmVuLWFkbWluL3JlbGVhc2VzJyxcbiAgICAgICAgICB0ZXh0OiAnQ2hhbmdlbG9nJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vb3Jncy92YmVuanMvcHJvamVjdHMvNScsXG4gICAgICAgICAgdGV4dDogJ1JvYWRtYXAnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGluazogJ2h0dHBzOi8vZ2l0aHViLmNvbS92YmVuanMvdnVlLXZiZW4tYWRtaW4vYmxvYi9tYWluLy5naXRodWIvY29udHJpYnV0aW5nLm1kJyxcbiAgICAgICAgICB0ZXh0OiAnQ29udHJpYnV0aW9uJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICBsaW5rOiAnL2NvbW1lcmNpYWwvdGVjaG5pY2FsLXN1cHBvcnQnLFxuICAgICAgdGV4dDogJ1x1RDgzRVx1REQ4NCBUZWNoIFN1cHBvcnQnLFxuICAgIH0sXG4gICAge1xuICAgICAgbGluazogJy9zcG9uc29yL3BlcnNvbmFsJyxcbiAgICAgIHRleHQ6ICdcdTI3MjggU3BvbnNvcicsXG4gICAgfSxcbiAgICB7XG4gICAgICBsaW5rOiAnL2NvbW1lcmNpYWwvY29tbXVuaXR5JyxcbiAgICAgIHRleHQ6ICdcdUQ4M0RcdURDNjhcdTIwMERcdUQ4M0RcdURDNjZcdTIwMERcdUQ4M0RcdURDNjYgQ29tbXVuaXR5JyxcbiAgICB9LFxuICAgIC8vIHtcbiAgICAvLyAgIGxpbms6ICcvZnJpZW5kLWxpbmtzLycsXG4gICAgLy8gICB0ZXh0OiAnXHVEODNFXHVERDFEIEZyaWVuZCBMaW5rcycsXG4gICAgLy8gfSxcbiAgXTtcbn1cbiIsICJ7XG4gIFwibmFtZVwiOiBcInZiZW4tYWRtaW4tbW9ub3JlcG9cIixcbiAgXCJ2ZXJzaW9uXCI6IFwiNS41LjlcIixcbiAgXCJwcml2YXRlXCI6IHRydWUsXG4gIFwia2V5d29yZHNcIjogW1xuICAgIFwibW9ub3JlcG9cIixcbiAgICBcInR1cmJvXCIsXG4gICAgXCJ2YmVuXCIsXG4gICAgXCJ2YmVuIGFkbWluXCIsXG4gICAgXCJ2YmVuIHByb1wiLFxuICAgIFwidnVlXCIsXG4gICAgXCJ2dWUgYWRtaW5cIixcbiAgICBcInZ1ZSB2YmVuIGFkbWluXCIsXG4gICAgXCJ2dWUgdmJlbiBhZG1pbiBwcm9cIixcbiAgICBcInZ1ZTNcIlxuICBdLFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL3ZiZW5qcy92dWUtdmJlbi1hZG1pblwiLFxuICBcImJ1Z3NcIjogXCJodHRwczovL2dpdGh1Yi5jb20vdmJlbmpzL3Z1ZS12YmVuLWFkbWluL2lzc3Vlc1wiLFxuICBcInJlcG9zaXRvcnlcIjogXCJ2YmVuanMvdnVlLXZiZW4tYWRtaW4uZ2l0XCIsXG4gIFwibGljZW5zZVwiOiBcIk1JVFwiLFxuICBcImF1dGhvclwiOiB7XG4gICAgXCJuYW1lXCI6IFwidmJlblwiLFxuICAgIFwiZW1haWxcIjogXCJhbm4udmJlbkBnbWFpbC5jb21cIixcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9hbm5jd2JcIlxuICB9LFxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImJ1aWxkXCI6IFwiY3Jvc3MtZW52IE5PREVfT1BUSU9OUz0tLW1heC1vbGQtc3BhY2Utc2l6ZT04MTkyIHR1cmJvIGJ1aWxkXCIsXG4gICAgXCJidWlsZDphbmFseXplXCI6IFwidHVyYm8gYnVpbGQ6YW5hbHl6ZVwiLFxuICAgIFwiYnVpbGQ6YW50ZFwiOiBcInBucG0gcnVuIGJ1aWxkIC0tZmlsdGVyPUB2YmVuL3dlYi1hbnRkXCIsXG4gICAgXCJidWlsZDpkb2NrZXJcIjogXCIuL3NjcmlwdHMvZGVwbG95L2J1aWxkLWxvY2FsLWRvY2tlci1pbWFnZS5zaFwiLFxuICAgIFwiYnVpbGQ6ZG9jc1wiOiBcInBucG0gcnVuIGJ1aWxkIC0tZmlsdGVyPUB2YmVuL2RvY3NcIixcbiAgICBcImJ1aWxkOmVsZVwiOiBcInBucG0gcnVuIGJ1aWxkIC0tZmlsdGVyPUB2YmVuL3dlYi1lbGVcIixcbiAgICBcImJ1aWxkOm5haXZlXCI6IFwicG5wbSBydW4gYnVpbGQgLS1maWx0ZXI9QHZiZW4vd2ViLW5haXZlXCIsXG4gICAgXCJidWlsZDpwbGF5XCI6IFwicG5wbSBydW4gYnVpbGQgLS1maWx0ZXI9QHZiZW4vcGxheWdyb3VuZFwiLFxuICAgIFwiYnVpbGQ6bGFzdC1hZG1pblwiOiBcInBucG0gcnVuIGJ1aWxkIC0tZmlsdGVyPUBsYXN0LWFkbWluL2FudGRcIixcbiAgICBcImNoYW5nZXNldFwiOiBcInBucG0gZXhlYyBjaGFuZ2VzZXRcIixcbiAgICBcImNoZWNrXCI6IFwicG5wbSBydW4gY2hlY2s6Y2lyY3VsYXIgJiYgcG5wbSBydW4gY2hlY2s6ZGVwICYmIHBucG0gcnVuIGNoZWNrOnR5cGUgJiYgcG5wbSBjaGVjazpjc3BlbGxcIixcbiAgICBcImNoZWNrOmNpcmN1bGFyXCI6IFwidnNoIGNoZWNrLWNpcmN1bGFyXCIsXG4gICAgXCJjaGVjazpjc3BlbGxcIjogXCJjc3BlbGwgbGludCAqKi8qLnRzICoqL1JFQURNRS5tZCAuY2hhbmdlc2V0LyoubWQgLS1uby1wcm9ncmVzc1wiLFxuICAgIFwiY2hlY2s6ZGVwXCI6IFwidnNoIGNoZWNrLWRlcFwiLFxuICAgIFwiY2hlY2s6dHlwZVwiOiBcInR1cmJvIHJ1biB0eXBlY2hlY2tcIixcbiAgICBcImNsZWFuXCI6IFwibm9kZSAuL3NjcmlwdHMvY2xlYW4ubWpzXCIsXG4gICAgXCJjb21taXRcIjogXCJjemdcIixcbiAgICBcImRldlwiOiBcInR1cmJvLXJ1biBkZXZcIixcbiAgICBcImRldjphbnRkXCI6IFwicG5wbSAtRiBAdmJlbi93ZWItYW50ZCBydW4gZGV2XCIsXG4gICAgXCJkZXY6ZG9jc1wiOiBcInBucG0gLUYgQHZiZW4vZG9jcyBydW4gZGV2XCIsXG4gICAgXCJkZXY6ZWxlXCI6IFwicG5wbSAtRiBAdmJlbi93ZWItZWxlIHJ1biBkZXZcIixcbiAgICBcImRldjpuYWl2ZVwiOiBcInBucG0gLUYgQHZiZW4vd2ViLW5haXZlIHJ1biBkZXZcIixcbiAgICBcImRldjpwbGF5XCI6IFwicG5wbSAtRiBAdmJlbi9wbGF5Z3JvdW5kIHJ1biBkZXZcIixcbiAgICBcImRldjpsYXN0LWFkbWluXCI6IFwicG5wbSAtRiBAbGFzdC1hZG1pbi9hbnRkIHJ1biBkZXZcIixcbiAgICBcImZvcm1hdFwiOiBcInZzaCBsaW50IC0tZm9ybWF0XCIsXG4gICAgXCJsaW50XCI6IFwidnNoIGxpbnRcIixcbiAgICBcInBvc3RpbnN0YWxsXCI6IFwicG5wbSAtciBydW4gc3R1YiAtLWlmLXByZXNlbnRcIixcbiAgICBcInByZWluc3RhbGxcIjogXCJucHggb25seS1hbGxvdyBwbnBtXCIsXG4gICAgXCJwcmV2aWV3XCI6IFwidHVyYm8tcnVuIHByZXZpZXdcIixcbiAgICBcInB1YmxpbnRcIjogXCJ2c2ggcHVibGludFwiLFxuICAgIFwicmVpbnN0YWxsXCI6IFwicG5wbSBjbGVhbiAtLWRlbC1sb2NrICYmIHBucG0gaW5zdGFsbFwiLFxuICAgIFwidGVzdDp1bml0XCI6IFwidml0ZXN0IHJ1biAtLWRvbVwiLFxuICAgIFwidGVzdDplMmVcIjogXCJ0dXJibyBydW4gdGVzdDplMmVcIixcbiAgICBcInVwZGF0ZTpkZXBzXCI6IFwibnB4IHRhemUgLXIgLXdcIixcbiAgICBcInZlcnNpb25cIjogXCJwbnBtIGV4ZWMgY2hhbmdlc2V0IHZlcnNpb24gJiYgcG5wbSBpbnN0YWxsIC0tbm8tZnJvemVuLWxvY2tmaWxlXCIsXG4gICAgXCJjYXRhbG9nXCI6IFwicG5weCBjb2RlbW9kIHBucG0vY2F0YWxvZ1wiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBjaGFuZ2VzZXRzL2NoYW5nZWxvZy1naXRodWJcIjogXCJjYXRhbG9nOlwiLFxuICAgIFwiQGNoYW5nZXNldHMvY2xpXCI6IFwiY2F0YWxvZzpcIixcbiAgICBcIkBwbGF5d3JpZ2h0L3Rlc3RcIjogXCJjYXRhbG9nOlwiLFxuICAgIFwiQHR5cGVzL25vZGVcIjogXCJjYXRhbG9nOlwiLFxuICAgIFwiQHZiZW4vY29tbWl0bGludC1jb25maWdcIjogXCJ3b3Jrc3BhY2U6KlwiLFxuICAgIFwiQHZiZW4vZXNsaW50LWNvbmZpZ1wiOiBcIndvcmtzcGFjZToqXCIsXG4gICAgXCJAdmJlbi9wcmV0dGllci1jb25maWdcIjogXCJ3b3Jrc3BhY2U6KlwiLFxuICAgIFwiQHZiZW4vc3R5bGVsaW50LWNvbmZpZ1wiOiBcIndvcmtzcGFjZToqXCIsXG4gICAgXCJAdmJlbi90YWlsd2luZC1jb25maWdcIjogXCJ3b3Jrc3BhY2U6KlwiLFxuICAgIFwiQHZiZW4vdHNjb25maWdcIjogXCJ3b3Jrc3BhY2U6KlwiLFxuICAgIFwiQHZiZW4vdHVyYm8tcnVuXCI6IFwid29ya3NwYWNlOipcIixcbiAgICBcIkB2YmVuL3ZpdGUtY29uZmlnXCI6IFwid29ya3NwYWNlOipcIixcbiAgICBcIkB2YmVuL3ZzaFwiOiBcIndvcmtzcGFjZToqXCIsXG4gICAgXCJAdml0ZWpzL3BsdWdpbi12dWVcIjogXCJjYXRhbG9nOlwiLFxuICAgIFwiQHZpdGVqcy9wbHVnaW4tdnVlLWpzeFwiOiBcImNhdGFsb2c6XCIsXG4gICAgXCJAdnVlL3Rlc3QtdXRpbHNcIjogXCJjYXRhbG9nOlwiLFxuICAgIFwiYXV0b3ByZWZpeGVyXCI6IFwiY2F0YWxvZzpcIixcbiAgICBcImNyb3NzLWVudlwiOiBcImNhdGFsb2c6XCIsXG4gICAgXCJjc3BlbGxcIjogXCJjYXRhbG9nOlwiLFxuICAgIFwiaGFwcHktZG9tXCI6IFwiY2F0YWxvZzpcIixcbiAgICBcImlzLWNpXCI6IFwiY2F0YWxvZzpcIixcbiAgICBcImxlZnRob29rXCI6IFwiY2F0YWxvZzpcIixcbiAgICBcInBsYXl3cmlnaHRcIjogXCJjYXRhbG9nOlwiLFxuICAgIFwicmltcmFmXCI6IFwiY2F0YWxvZzpcIixcbiAgICBcInRhaWx3aW5kY3NzXCI6IFwiY2F0YWxvZzpcIixcbiAgICBcInR1cmJvXCI6IFwiY2F0YWxvZzpcIixcbiAgICBcInR5cGVzY3JpcHRcIjogXCJjYXRhbG9nOlwiLFxuICAgIFwidW5idWlsZFwiOiBcImNhdGFsb2c6XCIsXG4gICAgXCJ2aXRlXCI6IFwiY2F0YWxvZzpcIixcbiAgICBcInZpdGVzdFwiOiBcImNhdGFsb2c6XCIsXG4gICAgXCJ2dWVcIjogXCJjYXRhbG9nOlwiLFxuICAgIFwidnVlLXRzY1wiOiBcImNhdGFsb2c6XCJcbiAgfSxcbiAgXCJlbmdpbmVzXCI6IHtcbiAgICBcIm5vZGVcIjogXCI+PTIwLjEwLjBcIixcbiAgICBcInBucG1cIjogXCI+PTkuMTIuMFwiXG4gIH0sXG4gIFwicGFja2FnZU1hbmFnZXJcIjogXCJwbnBtQDEwLjE0LjBcIixcbiAgXCJwbnBtXCI6IHtcbiAgICBcInBlZXJEZXBlbmRlbmN5UnVsZXNcIjoge1xuICAgICAgXCJhbGxvd2VkVmVyc2lvbnNcIjoge1xuICAgICAgICBcImVzbGludFwiOiBcIipcIlxuICAgICAgfVxuICAgIH0sXG4gICAgXCJvdmVycmlkZXNcIjoge1xuICAgICAgXCJAYXN0LWdyZXAvbmFwaVwiOiBcImNhdGFsb2c6XCIsXG4gICAgICBcIkBjdHJsL3Rpbnljb2xvclwiOiBcImNhdGFsb2c6XCIsXG4gICAgICBcImNsc3hcIjogXCJjYXRhbG9nOlwiLFxuICAgICAgXCJlc2J1aWxkXCI6IFwiMC4yNS4zXCIsXG4gICAgICBcInBpbmlhXCI6IFwiY2F0YWxvZzpcIixcbiAgICAgIFwidnVlXCI6IFwiY2F0YWxvZzpcIlxuICAgIH0sXG4gICAgXCJuZXZlckJ1aWx0RGVwZW5kZW5jaWVzXCI6IFtcbiAgICAgIFwiY2FudmFzXCIsXG4gICAgICBcIm5vZGUtZ3lwXCJcbiAgICBdXG4gIH1cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2hlbnJ5L1Byb2plY3QvbGFzdC1hZG1pbi9sYXN0LWFkbWluLXZiZW41L2RvY3MvLnZpdGVwcmVzcy9jb25maWdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9oZW5yeS9Qcm9qZWN0L2xhc3QtYWRtaW4vbGFzdC1hZG1pbi12YmVuNS9kb2NzLy52aXRlcHJlc3MvY29uZmlnL3NoYXJlZC5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2hlbnJ5L1Byb2plY3QvbGFzdC1hZG1pbi9sYXN0LWFkbWluLXZiZW41L2RvY3MvLnZpdGVwcmVzcy9jb25maWcvc2hhcmVkLm10c1wiO2ltcG9ydCB0eXBlIHsgUHdhT3B0aW9ucyB9IGZyb20gJ0B2aXRlLXB3YS92aXRlcHJlc3MnO1xuaW1wb3J0IHR5cGUgeyBIZWFkQ29uZmlnIH0gZnJvbSAndml0ZXByZXNzJztcblxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ25vZGU6cGF0aCc7XG5cbmltcG9ydCB7XG4gIHZpdGVBcmNoaXZlclBsdWdpbixcbiAgdml0ZVZ4ZVRhYmxlSW1wb3J0c1BsdWdpbixcbn0gZnJvbSAnQHZiZW4vdml0ZS1jb25maWcnO1xuXG5pbXBvcnQge1xuICBHaXRDaGFuZ2Vsb2csXG4gIEdpdENoYW5nZWxvZ01hcmtkb3duU2VjdGlvbixcbn0gZnJvbSAnQG5vbGViYXNlL3ZpdGVwcmVzcy1wbHVnaW4tZ2l0LWNoYW5nZWxvZy92aXRlJztcbmltcG9ydCB0YWlsd2luZCBmcm9tICd0YWlsd2luZGNzcyc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIHBvc3Rjc3NJc29sYXRlU3R5bGVzIH0gZnJvbSAndml0ZXByZXNzJztcbmltcG9ydCB7XG4gIGdyb3VwSWNvbk1kUGx1Z2luLFxuICBncm91cEljb25WaXRlUGx1Z2luLFxufSBmcm9tICd2aXRlcHJlc3MtcGx1Z2luLWdyb3VwLWljb25zJztcblxuaW1wb3J0IHsgZGVtb1ByZXZpZXdQbHVnaW4gfSBmcm9tICcuL3BsdWdpbnMvZGVtby1wcmV2aWV3JztcbmltcG9ydCB7IHNlYXJjaCBhcyB6aFNlYXJjaCB9IGZyb20gJy4vemgubXRzJztcblxuZXhwb3J0IGNvbnN0IHNoYXJlZCA9IGRlZmluZUNvbmZpZyh7XG4gIGFwcGVhcmFuY2U6ICdkYXJrJyxcbiAgaGVhZDogaGVhZCgpLFxuICBtYXJrZG93bjoge1xuICAgIHByZUNvbmZpZyhtZCkge1xuICAgICAgbWQudXNlKGRlbW9QcmV2aWV3UGx1Z2luKTtcbiAgICAgIG1kLnVzZShncm91cEljb25NZFBsdWdpbik7XG4gICAgfSxcbiAgfSxcbiAgcHdhOiBwd2EoKSxcbiAgc3JjRGlyOiAnc3JjJyxcbiAgdGhlbWVDb25maWc6IHtcbiAgICBpMThuUm91dGluZzogdHJ1ZSxcbiAgICBsb2dvOiAnaHR0cHM6Ly91bnBrZy5jb20vQHZiZW5qcy9zdGF0aWMtc291cmNlQDAuMS43L3NvdXJjZS9sb2dvLXYxLndlYnAnLFxuICAgIHNlYXJjaDoge1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBsb2NhbGVzOiB7XG4gICAgICAgICAgLi4uemhTZWFyY2gsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcHJvdmlkZXI6ICdsb2NhbCcsXG4gICAgfSxcbiAgICBzaXRlVGl0bGU6ICdWYmVuIEFkbWluJyxcbiAgICBzb2NpYWxMaW5rczogW1xuICAgICAgeyBpY29uOiAnZ2l0aHViJywgbGluazogJ2h0dHBzOi8vZ2l0aHViLmNvbS92YmVuanMvdnVlLXZiZW4tYWRtaW4nIH0sXG4gICAgXSxcbiAgfSxcbiAgdGl0bGU6ICdWYmVuIEFkbWluJyxcbiAgdml0ZToge1xuICAgIGJ1aWxkOiB7XG4gICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IEluZmluaXR5LFxuICAgICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICB9LFxuICAgIGNzczoge1xuICAgICAgcG9zdGNzczoge1xuICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgdGFpbHdpbmQoKSxcbiAgICAgICAgICBwb3N0Y3NzSXNvbGF0ZVN0eWxlcyh7IGluY2x1ZGVGaWxlczogWy92cC1kb2NcXC5jc3MvXSB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIHNjc3M6IHtcbiAgICAgICAgICBhcGk6ICdtb2Rlcm4nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIGpzb246IHtcbiAgICAgIHN0cmluZ2lmeTogdHJ1ZSxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIEdpdENoYW5nZWxvZyh7XG4gICAgICAgIG1hcEF1dGhvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXBCeU5hbWVBbGlhc2VzOiBbJ1ZiZW4nXSxcbiAgICAgICAgICAgIG5hbWU6ICd2YmVuJyxcbiAgICAgICAgICAgIHVzZXJuYW1lOiAnYW5uY3diJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICd2aW5jZScsXG4gICAgICAgICAgICB1c2VybmFtZTogJ3ZpbmNlMjkyMDA3JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdMaSBLdWknLFxuICAgICAgICAgICAgdXNlcm5hbWU6ICdsaWt1aTYyOCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgcmVwb1VSTDogKCkgPT4gJ2h0dHBzOi8vZ2l0aHViLmNvbS92YmVuanMvdnVlLXZiZW4tYWRtaW4nLFxuICAgICAgfSksXG4gICAgICBHaXRDaGFuZ2Vsb2dNYXJrZG93blNlY3Rpb24oKSxcbiAgICAgIHZpdGVBcmNoaXZlclBsdWdpbih7IG91dHB1dERpcjogJy52aXRlcHJlc3MnIH0pLFxuICAgICAgZ3JvdXBJY29uVml0ZVBsdWdpbigpLFxuICAgICAgYXdhaXQgdml0ZVZ4ZVRhYmxlSW1wb3J0c1BsdWdpbigpLFxuICAgIF0sXG4gICAgc2VydmVyOiB7XG4gICAgICBmczoge1xuICAgICAgICBhbGxvdzogWycuLi8uLiddLFxuICAgICAgfSxcbiAgICAgIGhvc3Q6IHRydWUsXG4gICAgICBwb3J0OiA2MTczLFxuICAgIH0sXG5cbiAgICBzc3I6IHtcbiAgICAgIGV4dGVybmFsOiBbJ0B2dWUvcmVwbCddLFxuICAgIH0sXG4gIH0sXG59KTtcblxuZnVuY3Rpb24gaGVhZCgpOiBIZWFkQ29uZmlnW10ge1xuICByZXR1cm4gW1xuICAgIFsnbWV0YScsIHsgY29udGVudDogJ1ZiZW5qcyBUZWFtJywgbmFtZTogJ2F1dGhvcicgfV0sXG4gICAgW1xuICAgICAgJ21ldGEnLFxuICAgICAge1xuICAgICAgICBjb250ZW50OiAndmJlbiwgdml0ZWpzLCB2aXRlLCBzaGFjZG4tdWksIHZ1ZScsXG4gICAgICAgIG5hbWU6ICdrZXl3b3JkcycsXG4gICAgICB9LFxuICAgIF0sXG4gICAgWydsaW5rJywgeyBocmVmOiAnL2Zhdmljb24uaWNvJywgcmVsOiAnaWNvbicsIHR5cGU6ICdpbWFnZS9zdmcreG1sJyB9XSxcbiAgICBbXG4gICAgICAnbWV0YScsXG4gICAgICB7XG4gICAgICAgIGNvbnRlbnQ6XG4gICAgICAgICAgJ3dpZHRoPWRldmljZS13aWR0aCxpbml0aWFsLXNjYWxlPTEsbWluaW11bS1zY2FsZT0xLjAsbWF4aW11bS1zY2FsZT0xLjAsdXNlci1zY2FsYWJsZT1ubycsXG4gICAgICAgIG5hbWU6ICd2aWV3cG9ydCcsXG4gICAgICB9LFxuICAgIF0sXG4gICAgWydtZXRhJywgeyBjb250ZW50OiAndmJlbiBhZG1pbiBkb2NzJywgbmFtZTogJ2tleXdvcmRzJyB9XSxcbiAgICBbJ2xpbmsnLCB7IGhyZWY6ICcvZmF2aWNvbi5pY28nLCByZWw6ICdpY29uJyB9XSxcbiAgICAvLyBbXG4gICAgLy8gICAnc2NyaXB0JyxcbiAgICAvLyAgIHtcbiAgICAvLyAgICAgc3JjOiAnaHR0cHM6Ly9jZG4udGFpbHdpbmRjc3MuY29tJyxcbiAgICAvLyAgIH0sXG4gICAgLy8gXSxcbiAgXTtcbn1cblxuZnVuY3Rpb24gcHdhKCk6IFB3YU9wdGlvbnMge1xuICByZXR1cm4ge1xuICAgIGluY2x1ZGVNYW5pZmVzdEljb25zOiBmYWxzZSxcbiAgICBtYW5pZmVzdDoge1xuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICdWYmVuIEFkbWluIGlzIGEgbW9kZXJuIGFkbWluIGRhc2hib2FyZCB0ZW1wbGF0ZSBiYXNlZCBvbiBWdWUgMy4gJyxcbiAgICAgIGljb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzaXplczogJzE5MngxOTInLFxuICAgICAgICAgIHNyYzogJ2h0dHBzOi8vdW5wa2cuY29tL0B2YmVuanMvc3RhdGljLXNvdXJjZUAwLjEuNy9zb3VyY2UvcHdhLWljb24tMTkyLnBuZycsXG4gICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgIHNyYzogJ2h0dHBzOi8vdW5wa2cuY29tL0B2YmVuanMvc3RhdGljLXNvdXJjZUAwLjEuNy9zb3VyY2UvcHdhLWljb24tNTEyLnBuZycsXG4gICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgaWQ6ICcvJyxcbiAgICAgIG5hbWU6ICdWYmVuIEFkbWluIERvYycsXG4gICAgICBzaG9ydF9uYW1lOiAndmJlbl9hZG1pbl9kb2MnLFxuICAgICAgdGhlbWVfY29sb3I6ICcjZmZmZmZmJyxcbiAgICB9LFxuICAgIG91dERpcjogcmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnLnZpdGVwcmVzcy9kaXN0JyksXG4gICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXG4gICAgd29ya2JveDoge1xuICAgICAgZ2xvYlBhdHRlcm5zOiBbJyoqLyoue2NzcyxqcyxodG1sLHN2ZyxwbmcsaWNvLHR4dCx3b2ZmMn0nXSxcbiAgICAgIG1heGltdW1GaWxlU2l6ZVRvQ2FjaGVJbkJ5dGVzOiA1ICogMTAyNCAqIDEwMjQsXG4gICAgfSxcbiAgfTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2hlbnJ5L1Byb2plY3QvbGFzdC1hZG1pbi9sYXN0LWFkbWluLXZiZW41L2RvY3MvLnZpdGVwcmVzcy9jb25maWcvcGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2hlbnJ5L1Byb2plY3QvbGFzdC1hZG1pbi9sYXN0LWFkbWluLXZiZW41L2RvY3MvLnZpdGVwcmVzcy9jb25maWcvcGx1Z2lucy9kZW1vLXByZXZpZXcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2hlbnJ5L1Byb2plY3QvbGFzdC1hZG1pbi9sYXN0LWFkbWluLXZiZW41L2RvY3MvLnZpdGVwcmVzcy9jb25maWcvcGx1Z2lucy9kZW1vLXByZXZpZXcudHNcIjtpbXBvcnQgdHlwZSB7IE1hcmtkb3duRW52LCBNYXJrZG93blJlbmRlcmVyIH0gZnJvbSAndml0ZXByZXNzJztcblxuaW1wb3J0IGNyeXB0byBmcm9tICdub2RlOmNyeXB0byc7XG5pbXBvcnQgeyByZWFkZGlyU3luYyB9IGZyb20gJ25vZGU6ZnMnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ25vZGU6cGF0aCc7XG5cbmV4cG9ydCBjb25zdCByYXdQYXRoUmVnZXhwID1cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlZ2V4cC9uby1zdXBlci1saW5lYXItYmFja3RyYWNraW5nLCByZWdleHAvc3RyaWN0XG4gIC9eKC4rPyg/OlxcLihbXFxkYS16XSspKT8pKCNbXFx3LV0rKT8oPzogP3soXFxkKyg/OlssLV1cXGQrKSopPyA/KFxcUyspP30pPyA/KD86XFxbKC4rKV0pPyQvO1xuXG5mdW5jdGlvbiByYXdQYXRoVG9Ub2tlbihyYXdQYXRoOiBzdHJpbmcpIHtcbiAgY29uc3QgW1xuICAgIGZpbGVwYXRoID0gJycsXG4gICAgZXh0ZW5zaW9uID0gJycsXG4gICAgcmVnaW9uID0gJycsXG4gICAgbGluZXMgPSAnJyxcbiAgICBsYW5nID0gJycsXG4gICAgcmF3VGl0bGUgPSAnJyxcbiAgXSA9IChyYXdQYXRoUmVnZXhwLmV4ZWMocmF3UGF0aCkgfHwgW10pLnNsaWNlKDEpO1xuXG4gIGNvbnN0IHRpdGxlID0gcmF3VGl0bGUgfHwgZmlsZXBhdGguc3BsaXQoJy8nKS5wb3AoKSB8fCAnJztcblxuICByZXR1cm4geyBleHRlbnNpb24sIGZpbGVwYXRoLCBsYW5nLCBsaW5lcywgcmVnaW9uLCB0aXRsZSB9O1xufVxuXG5leHBvcnQgY29uc3QgZGVtb1ByZXZpZXdQbHVnaW4gPSAobWQ6IE1hcmtkb3duUmVuZGVyZXIpID0+IHtcbiAgbWQuY29yZS5ydWxlci5hZnRlcignaW5saW5lJywgJ2RlbW8tcHJldmlldycsIChzdGF0ZSkgPT4ge1xuICAgIGNvbnN0IGluc2VydENvbXBvbmVudEltcG9ydCA9IChpbXBvcnRTdHJpbmc6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSBzdGF0ZS50b2tlbnMuZmluZEluZGV4KFxuICAgICAgICAoaSkgPT4gaS50eXBlID09PSAnaHRtbF9ibG9jaycgJiYgaS5jb250ZW50Lm1hdGNoKC88c2NyaXB0IHNldHVwPi9nKSxcbiAgICAgICk7XG4gICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgIGNvbnN0IGltcG9ydENvbXBvbmVudCA9IG5ldyBzdGF0ZS5Ub2tlbignaHRtbF9ibG9jaycsICcnLCAwKTtcbiAgICAgICAgaW1wb3J0Q29tcG9uZW50LmNvbnRlbnQgPSBgPHNjcmlwdCBzZXR1cD5cXG4ke2ltcG9ydFN0cmluZ31cXG48L3NjcmlwdD5cXG5gO1xuICAgICAgICBzdGF0ZS50b2tlbnMuc3BsaWNlKDAsIDAsIGltcG9ydENvbXBvbmVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc3RhdGUudG9rZW5zW2luZGV4XSkge1xuICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBzdGF0ZS50b2tlbnNbaW5kZXhdLmNvbnRlbnQ7XG4gICAgICAgICAgc3RhdGUudG9rZW5zW2luZGV4XS5jb250ZW50ID0gY29udGVudC5yZXBsYWNlKFxuICAgICAgICAgICAgJzwvc2NyaXB0PicsXG4gICAgICAgICAgICBgJHtpbXBvcnRTdHJpbmd9XFxuPC9zY3JpcHQ+YCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICAvLyBEZWZpbmUgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBtYXRjaCB0aGUgZGVzaXJlZCBwYXR0ZXJuXG4gICAgY29uc3QgcmVnZXggPSAvPERlbW9QcmV2aWV3W14+XSpcXHNkaXI9XCIoW15cIl0qKVwiL2c7XG4gICAgLy8gSXRlcmF0ZSB0aHJvdWdoIHRoZSBNYXJrZG93biBjb250ZW50IGFuZCByZXBsYWNlIHRoZSBwYXR0ZXJuXG4gICAgc3RhdGUuc3JjID0gc3RhdGUuc3JjLnJlcGxhY2VBbGwocmVnZXgsIChfbWF0Y2gsIGRpcikgPT4ge1xuICAgICAgY29uc3QgY29tcG9uZW50RGlyID0gam9pbihwcm9jZXNzLmN3ZCgpLCAnc3JjJywgZGlyKS5yZXBsYWNlQWxsKFxuICAgICAgICAnXFxcXCcsXG4gICAgICAgICcvJyxcbiAgICAgICk7XG5cbiAgICAgIGxldCBjaGlsZEZpbGVzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgbGV0IGRpckV4aXN0cyA9IHRydWU7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNoaWxkRmlsZXMgPVxuICAgICAgICAgIHJlYWRkaXJTeW5jKGNvbXBvbmVudERpciwge1xuICAgICAgICAgICAgZW5jb2Rpbmc6ICd1dGY4JyxcbiAgICAgICAgICAgIHJlY3Vyc2l2ZTogZmFsc2UsXG4gICAgICAgICAgICB3aXRoRmlsZVR5cGVzOiBmYWxzZSxcbiAgICAgICAgICB9KSB8fCBbXTtcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICBkaXJFeGlzdHMgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFkaXJFeGlzdHMpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB1bmlxdWVXb3JkID0gZ2VuZXJhdGVDb250ZW50SGFzaChjb21wb25lbnREaXIpO1xuXG4gICAgICBjb25zdCBDb21wb25lbnROYW1lID0gYERlbW9Db21wb25lbnRfJHt1bmlxdWVXb3JkfWA7XG4gICAgICBpbnNlcnRDb21wb25lbnRJbXBvcnQoXG4gICAgICAgIGBpbXBvcnQgJHtDb21wb25lbnROYW1lfSBmcm9tICcke2NvbXBvbmVudERpcn0vaW5kZXgudnVlJ2AsXG4gICAgICApO1xuICAgICAgY29uc3QgeyBwYXRoOiBfcGF0aCB9ID0gc3RhdGUuZW52IGFzIE1hcmtkb3duRW52O1xuXG4gICAgICBjb25zdCBpbmRleCA9IHN0YXRlLnRva2Vucy5maW5kSW5kZXgoKGkpID0+IGkuY29udGVudC5tYXRjaChyZWdleCkpO1xuXG4gICAgICBpZiAoIXN0YXRlLnRva2Vuc1tpbmRleF0pIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuICAgICAgY29uc3QgZmlyc3RTdHJpbmcgPSAnaW5kZXgudnVlJztcbiAgICAgIGNoaWxkRmlsZXMgPSBjaGlsZEZpbGVzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgaWYgKGEgPT09IGZpcnN0U3RyaW5nKSByZXR1cm4gLTE7XG4gICAgICAgIGlmIChiID09PSBmaXJzdFN0cmluZykgcmV0dXJuIDE7XG4gICAgICAgIHJldHVybiBhLmxvY2FsZUNvbXBhcmUoYiwgJ2VuJywgeyBzZW5zaXRpdml0eTogJ2Jhc2UnIH0pO1xuICAgICAgfSk7XG4gICAgICBzdGF0ZS50b2tlbnNbaW5kZXhdLmNvbnRlbnQgPVxuICAgICAgICBgPERlbW9QcmV2aWV3IGZpbGVzPVwiJHtlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY2hpbGRGaWxlcykpfVwiID48JHtDb21wb25lbnROYW1lfS8+XG4gICAgICAgIGA7XG5cbiAgICAgIGNvbnN0IF9kdW1teVRva2VuID0gbmV3IHN0YXRlLlRva2VuKCcnLCAnJywgMCk7XG4gICAgICBjb25zdCB0b2tlbkFycmF5OiBBcnJheTx0eXBlb2YgX2R1bW15VG9rZW4+ID0gW107XG4gICAgICBjaGlsZEZpbGVzLmZvckVhY2goKGZpbGVuYW1lKSA9PiB7XG4gICAgICAgIC8vIGNvbnN0IHNsb3ROYW1lID0gZmlsZW5hbWUucmVwbGFjZShleHRuYW1lKGZpbGVuYW1lKSwgJycpO1xuXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlU3RhcnQgPSBuZXcgc3RhdGUuVG9rZW4oJ2h0bWxfaW5saW5lJywgJycsIDApO1xuICAgICAgICB0ZW1wbGF0ZVN0YXJ0LmNvbnRlbnQgPSBgPHRlbXBsYXRlICMke2ZpbGVuYW1lfT5gO1xuICAgICAgICB0b2tlbkFycmF5LnB1c2godGVtcGxhdGVTdGFydCk7XG5cbiAgICAgICAgY29uc3QgcmVzb2x2ZWRQYXRoID0gam9pbihjb21wb25lbnREaXIsIGZpbGVuYW1lKTtcblxuICAgICAgICBjb25zdCB7IGV4dGVuc2lvbiwgZmlsZXBhdGgsIGxhbmcsIGxpbmVzLCB0aXRsZSB9ID1cbiAgICAgICAgICByYXdQYXRoVG9Ub2tlbihyZXNvbHZlZFBhdGgpO1xuICAgICAgICAvLyBBZGQgY29kZSB0b2tlbnMgZm9yIGVhY2ggbGluZVxuICAgICAgICBjb25zdCB0b2tlbiA9IG5ldyBzdGF0ZS5Ub2tlbignZmVuY2UnLCAnY29kZScsIDApO1xuICAgICAgICB0b2tlbi5pbmZvID0gYCR7bGFuZyB8fCBleHRlbnNpb259JHtsaW5lcyA/IGB7JHtsaW5lc319YCA6ICcnfSR7XG4gICAgICAgICAgdGl0bGUgPyBgWyR7dGl0bGV9XWAgOiAnJ1xuICAgICAgICB9YDtcblxuICAgICAgICB0b2tlbi5jb250ZW50ID0gYDw8PCAke2ZpbGVwYXRofWA7XG4gICAgICAgICh0b2tlbiBhcyBhbnkpLnNyYyA9IFtyZXNvbHZlZFBhdGhdO1xuICAgICAgICB0b2tlbkFycmF5LnB1c2godG9rZW4pO1xuXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlRW5kID0gbmV3IHN0YXRlLlRva2VuKCdodG1sX2lubGluZScsICcnLCAwKTtcbiAgICAgICAgdGVtcGxhdGVFbmQuY29udGVudCA9ICc8L3RlbXBsYXRlPic7XG4gICAgICAgIHRva2VuQXJyYXkucHVzaCh0ZW1wbGF0ZUVuZCk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGVuZFRhZyA9IG5ldyBzdGF0ZS5Ub2tlbignaHRtbF9pbmxpbmUnLCAnJywgMCk7XG4gICAgICBlbmRUYWcuY29udGVudCA9ICc8L0RlbW9QcmV2aWV3Pic7XG4gICAgICB0b2tlbkFycmF5LnB1c2goZW5kVGFnKTtcblxuICAgICAgc3RhdGUudG9rZW5zLnNwbGljZShpbmRleCArIDEsIDAsIC4uLnRva2VuQXJyYXkpO1xuXG4gICAgICAvLyBjb25zb2xlLmxvZyhcbiAgICAgIC8vICAgc3RhdGUubWQucmVuZGVyZXIucmVuZGVyKHN0YXRlLnRva2Vucywgc3RhdGU/Lm9wdGlvbnMgPz8gW10sIHN0YXRlLmVudiksXG4gICAgICAvLyApO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQ29udGVudEhhc2goaW5wdXQ6IHN0cmluZywgbGVuZ3RoOiBudW1iZXIgPSAxMCk6IHN0cmluZyB7XG4gIC8vIFx1NEY3Rlx1NzUyOCBTSEEtMjU2IFx1NzUxRlx1NjIxMFx1NTRDOFx1NUUwQ1x1NTAzQ1xuICBjb25zdCBoYXNoID0gY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTI1NicpLnVwZGF0ZShpbnB1dCkuZGlnZXN0KCdoZXgnKTtcblxuICAvLyBcdTVDMDZcdTU0QzhcdTVFMENcdTUwM0NcdThGNkNcdTYzNjJcdTRFM0EgQmFzZTM2IFx1N0YxNlx1NzgwMVx1RkYwQ1x1NUU3Nlx1NTNENlx1NjMwN1x1NUI5QVx1OTU3Rlx1NUVBNlx1NzY4NFx1NUI1N1x1N0IyNlx1NEY1Q1x1NEUzQVx1N0VEM1x1Njc5Q1xuICByZXR1cm4gTnVtYmVyLnBhcnNlSW50KGhhc2gsIDE2KS50b1N0cmluZygzNikuc2xpY2UoMCwgbGVuZ3RoKTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2hlbnJ5L1Byb2plY3QvbGFzdC1hZG1pbi9sYXN0LWFkbWluLXZiZW41L2RvY3MvLnZpdGVwcmVzcy9jb25maWdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9oZW5yeS9Qcm9qZWN0L2xhc3QtYWRtaW4vbGFzdC1hZG1pbi12YmVuNS9kb2NzLy52aXRlcHJlc3MvY29uZmlnL3poLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvaGVucnkvUHJvamVjdC9sYXN0LWFkbWluL2xhc3QtYWRtaW4tdmJlbjUvZG9jcy8udml0ZXByZXNzL2NvbmZpZy96aC5tdHNcIjtpbXBvcnQgdHlwZSB7IERlZmF1bHRUaGVtZSB9IGZyb20gJ3ZpdGVwcmVzcyc7XG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGVwcmVzcyc7XG5cbmltcG9ydCB7IHZlcnNpb24gfSBmcm9tICcuLi8uLi8uLi9wYWNrYWdlLmpzb24nO1xuXG5leHBvcnQgY29uc3QgemggPSBkZWZpbmVDb25maWcoe1xuICBkZXNjcmlwdGlvbjogJ1ZiZW4gQWRtaW4gJiBcdTRGMDFcdTRFMUFcdTdFQTdcdTdCQTFcdTc0MDZcdTdDRkJcdTdFREZcdTY4NDZcdTY3QjYnLFxuICBsYW5nOiAnemgtSGFucycsXG4gIHRoZW1lQ29uZmlnOiB7XG4gICAgZGFya01vZGVTd2l0Y2hMYWJlbDogJ1x1NEUzQlx1OTg5OCcsXG4gICAgZGFya01vZGVTd2l0Y2hUaXRsZTogJ1x1NTIwN1x1NjM2Mlx1NTIzMFx1NkRGMVx1ODI3Mlx1NkEyMVx1NUYwRicsXG4gICAgZG9jRm9vdGVyOiB7XG4gICAgICBuZXh0OiAnXHU0RTBCXHU0RTAwXHU5ODc1JyxcbiAgICAgIHByZXY6ICdcdTRFMEFcdTRFMDBcdTk4NzUnLFxuICAgIH0sXG4gICAgZWRpdExpbms6IHtcbiAgICAgIHBhdHRlcm46XG4gICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vdmJlbmpzL3Z1ZS12YmVuLWFkbWluL2VkaXQvbWFpbi9kb2NzL3NyYy86cGF0aCcsXG4gICAgICB0ZXh0OiAnXHU1NzI4IEdpdEh1YiBcdTRFMEFcdTdGMTZcdThGOTFcdTZCNjRcdTk4NzVcdTk3NjInLFxuICAgIH0sXG4gICAgZm9vdGVyOiB7XG4gICAgICBjb3B5cmlnaHQ6IGBDb3B5cmlnaHQgXHUwMEE5IDIwMjAtJHtuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCl9IFZiZW5gLFxuICAgICAgbWVzc2FnZTogJ1x1NTdGQVx1NEU4RSBNSVQgXHU4QkI4XHU1M0VGXHU1M0QxXHU1RTAzLicsXG4gICAgfSxcbiAgICBsYW5nTWVudUxhYmVsOiAnXHU1OTFBXHU4QkVEXHU4QTAwJyxcbiAgICBsYXN0VXBkYXRlZDoge1xuICAgICAgZm9ybWF0T3B0aW9uczoge1xuICAgICAgICBkYXRlU3R5bGU6ICdzaG9ydCcsXG4gICAgICAgIHRpbWVTdHlsZTogJ21lZGl1bScsXG4gICAgICB9LFxuICAgICAgdGV4dDogJ1x1NjcwMFx1NTQwRVx1NjZGNFx1NjVCMFx1NEU4RScsXG4gICAgfSxcbiAgICBsaWdodE1vZGVTd2l0Y2hUaXRsZTogJ1x1NTIwN1x1NjM2Mlx1NTIzMFx1NkQ0NVx1ODI3Mlx1NkEyMVx1NUYwRicsXG4gICAgbmF2OiBuYXYoKSxcblxuICAgIG91dGxpbmU6IHtcbiAgICAgIGxhYmVsOiAnXHU5ODc1XHU5NzYyXHU1QkZDXHU4MjJBJyxcbiAgICB9LFxuICAgIHJldHVyblRvVG9wTGFiZWw6ICdcdTU2REVcdTUyMzBcdTk4NzZcdTkwRTgnLFxuXG4gICAgc2lkZWJhcjoge1xuICAgICAgJy9jb21tZXJjaWFsLyc6IHsgYmFzZTogJy9jb21tZXJjaWFsLycsIGl0ZW1zOiBzaWRlYmFyQ29tbWVyY2lhbCgpIH0sXG4gICAgICAnL2NvbXBvbmVudHMvJzogeyBiYXNlOiAnL2NvbXBvbmVudHMvJywgaXRlbXM6IHNpZGViYXJDb21wb25lbnRzKCkgfSxcbiAgICAgICcvZ3VpZGUvJzogeyBiYXNlOiAnL2d1aWRlLycsIGl0ZW1zOiBzaWRlYmFyR3VpZGUoKSB9LFxuICAgIH0sXG4gICAgc2lkZWJhck1lbnVMYWJlbDogJ1x1ODNEQ1x1NTM1NScsXG4gIH0sXG59KTtcblxuZnVuY3Rpb24gc2lkZWJhckd1aWRlKCk6IERlZmF1bHRUaGVtZS5TaWRlYmFySXRlbVtdIHtcbiAgcmV0dXJuIFtcbiAgICB7XG4gICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgdGV4dDogJ1x1N0I4MFx1NEVDQicsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7XG4gICAgICAgICAgbGluazogJ2ludHJvZHVjdGlvbi92YmVuJyxcbiAgICAgICAgICB0ZXh0OiAnXHU1MTczXHU0RThFIFZiZW4gQWRtaW4nLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGluazogJ2ludHJvZHVjdGlvbi93aHknLFxuICAgICAgICAgIHRleHQ6ICdcdTRFM0FcdTRFQzBcdTRFNDhcdTkwMDlcdTYyRTlcdTYyMTFcdTRFRUM/JyxcbiAgICAgICAgfSxcbiAgICAgICAgeyBsaW5rOiAnaW50cm9kdWN0aW9uL3F1aWNrLXN0YXJ0JywgdGV4dDogJ1x1NUZFQlx1OTAxRlx1NUYwMFx1NTlDQicgfSxcbiAgICAgICAgeyBsaW5rOiAnaW50cm9kdWN0aW9uL3RoaW4nLCB0ZXh0OiAnXHU3Q0JFXHU3QjgwXHU3MjQ4XHU2NzJDJyB9LFxuICAgICAgICB7XG4gICAgICAgICAgYmFzZTogJy8nLFxuICAgICAgICAgIGxpbms6ICdjb21wb25lbnRzL2ludHJvZHVjdGlvbicsXG4gICAgICAgICAgdGV4dDogJ1x1N0VDNFx1NEVGNlx1NjU4N1x1Njg2MycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgdGV4dDogJ1x1NTdGQVx1Nzg0MCcsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IGxpbms6ICdlc3NlbnRpYWxzL2NvbmNlcHQnLCB0ZXh0OiAnXHU1N0ZBXHU3ODQwXHU2OTgyXHU1RkY1JyB9LFxuICAgICAgICB7IGxpbms6ICdlc3NlbnRpYWxzL2RldmVsb3BtZW50JywgdGV4dDogJ1x1NjcyQ1x1NTczMFx1NUYwMFx1NTNEMScgfSxcbiAgICAgICAgeyBsaW5rOiAnZXNzZW50aWFscy9yb3V0ZScsIHRleHQ6ICdcdThERUZcdTc1MzFcdTU0OENcdTgzRENcdTUzNTUnIH0sXG4gICAgICAgIHsgbGluazogJ2Vzc2VudGlhbHMvc2V0dGluZ3MnLCB0ZXh0OiAnXHU5MTREXHU3RjZFJyB9LFxuICAgICAgICB7IGxpbms6ICdlc3NlbnRpYWxzL2ljb25zJywgdGV4dDogJ1x1NTZGRVx1NjgwNycgfSxcbiAgICAgICAgeyBsaW5rOiAnZXNzZW50aWFscy9zdHlsZXMnLCB0ZXh0OiAnXHU2ODM3XHU1RjBGJyB9LFxuICAgICAgICB7IGxpbms6ICdlc3NlbnRpYWxzL2V4dGVybmFsLW1vZHVsZScsIHRleHQ6ICdcdTU5MTZcdTkwRThcdTZBMjFcdTU3NTcnIH0sXG4gICAgICAgIHsgbGluazogJ2Vzc2VudGlhbHMvYnVpbGQnLCB0ZXh0OiAnXHU2Nzg0XHU1RUZBXHU0RTBFXHU5MEU4XHU3RjcyJyB9LFxuICAgICAgICB7IGxpbms6ICdlc3NlbnRpYWxzL3NlcnZlcicsIHRleHQ6ICdcdTY3MERcdTUyQTFcdTdBRUZcdTRFQTRcdTRFOTJcdTRFMEVcdTY1NzBcdTYzNkVNb2NrJyB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6ICdcdTZERjFcdTUxNjUnLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyBsaW5rOiAnaW4tZGVwdGgvbG9naW4nLCB0ZXh0OiAnXHU3NjdCXHU1RjU1JyB9LFxuICAgICAgICAvLyB7IGxpbms6ICdpbi1kZXB0aC9sYXlvdXQnLCB0ZXh0OiAnXHU1RTAzXHU1QzQwJyB9LFxuICAgICAgICB7IGxpbms6ICdpbi1kZXB0aC90aGVtZScsIHRleHQ6ICdcdTRFM0JcdTk4OTgnIH0sXG4gICAgICAgIHsgbGluazogJ2luLWRlcHRoL2FjY2VzcycsIHRleHQ6ICdcdTY3NDNcdTk2NTAnIH0sXG4gICAgICAgIHsgbGluazogJ2luLWRlcHRoL2xvY2FsZScsIHRleHQ6ICdcdTU2RkRcdTk2NDVcdTUzMTYnIH0sXG4gICAgICAgIHsgbGluazogJ2luLWRlcHRoL2ZlYXR1cmVzJywgdGV4dDogJ1x1NUUzOFx1NzUyOFx1NTI5Rlx1ODBGRCcgfSxcbiAgICAgICAgeyBsaW5rOiAnaW4tZGVwdGgvY2hlY2stdXBkYXRlcycsIHRleHQ6ICdcdTY4QzBcdTY3RTVcdTY2RjRcdTY1QjAnIH0sXG4gICAgICAgIHsgbGluazogJ2luLWRlcHRoL2xvYWRpbmcnLCB0ZXh0OiAnXHU1MTY4XHU1QzQwbG9hZGluZycgfSxcbiAgICAgICAgeyBsaW5rOiAnaW4tZGVwdGgvdWktZnJhbWV3b3JrJywgdGV4dDogJ1x1N0VDNFx1NEVGNlx1NUU5M1x1NTIwN1x1NjM2MicgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiAnXHU1REU1XHU3QTBCJyxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgbGluazogJ3Byb2plY3Qvc3RhbmRhcmQnLCB0ZXh0OiAnXHU4OUM0XHU4MzAzJyB9LFxuICAgICAgICB7IGxpbms6ICdwcm9qZWN0L2NsaScsIHRleHQ6ICdDTEknIH0sXG4gICAgICAgIHsgbGluazogJ3Byb2plY3QvZGlyJywgdGV4dDogJ1x1NzZFRVx1NUY1NVx1OEJGNFx1NjYwRScgfSxcbiAgICAgICAgeyBsaW5rOiAncHJvamVjdC90ZXN0JywgdGV4dDogJ1x1NTM1NVx1NTE0M1x1NkQ0Qlx1OEJENScgfSxcbiAgICAgICAgeyBsaW5rOiAncHJvamVjdC90YWlsd2luZGNzcycsIHRleHQ6ICdUYWlsd2luZCBDU1MnIH0sXG4gICAgICAgIHsgbGluazogJ3Byb2plY3QvY2hhbmdlc2V0JywgdGV4dDogJ0NoYW5nZXNldCcgfSxcbiAgICAgICAgeyBsaW5rOiAncHJvamVjdC92aXRlJywgdGV4dDogJ1ZpdGUgQ29uZmlnJyB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6ICdcdTUxNzZcdTRFRDYnLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyBsaW5rOiAnb3RoZXIvcHJvamVjdC11cGRhdGUnLCB0ZXh0OiAnXHU5ODc5XHU3NkVFXHU2NkY0XHU2NUIwJyB9LFxuICAgICAgICB7IGxpbms6ICdvdGhlci9yZW1vdmUtY29kZScsIHRleHQ6ICdcdTc5RkJcdTk2NjRcdTRFRTNcdTc4MDEnIH0sXG4gICAgICAgIHsgbGluazogJ290aGVyL2ZhcScsIHRleHQ6ICdcdTVFMzhcdTg5QzFcdTk1RUVcdTk4OTgnIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIF07XG59XG5cbmZ1bmN0aW9uIHNpZGViYXJDb21tZXJjaWFsKCk6IERlZmF1bHRUaGVtZS5TaWRlYmFySXRlbVtdIHtcbiAgcmV0dXJuIFtcbiAgICB7XG4gICAgICBsaW5rOiAnY29tbXVuaXR5JyxcbiAgICAgIHRleHQ6ICdcdTRFQTRcdTZENDFcdTdGQTQnLFxuICAgIH0sXG4gICAge1xuICAgICAgbGluazogJ3RlY2huaWNhbC1zdXBwb3J0JyxcbiAgICAgIHRleHQ6ICdcdTYyODBcdTY3MkZcdTY1MkZcdTYzMDEnLFxuICAgIH0sXG4gICAge1xuICAgICAgbGluazogJ2N1c3RvbWl6ZWQnLFxuICAgICAgdGV4dDogJ1x1NUI5QVx1NTIzNlx1NUYwMFx1NTNEMScsXG4gICAgfSxcbiAgXTtcbn1cblxuZnVuY3Rpb24gc2lkZWJhckNvbXBvbmVudHMoKTogRGVmYXVsdFRoZW1lLlNpZGViYXJJdGVtW10ge1xuICByZXR1cm4gW1xuICAgIHtcbiAgICAgIHRleHQ6ICdcdTdFQzRcdTRFRjYnLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGxpbms6ICdpbnRyb2R1Y3Rpb24nLFxuICAgICAgICAgIHRleHQ6ICdcdTRFQ0JcdTdFQ0QnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvbGxhcHNlZDogZmFsc2UsXG4gICAgICB0ZXh0OiAnXHU1RTAzXHU1QzQwXHU3RUM0XHU0RUY2JyxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBsaW5rOiAnbGF5b3V0LXVpL3BhZ2UnLFxuICAgICAgICAgIHRleHQ6ICdQYWdlIFx1OTg3NVx1OTc2MicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgIHRleHQ6ICdcdTkwMUFcdTc1MjhcdTdFQzRcdTRFRjYnLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGxpbms6ICdjb21tb24tdWkvdmJlbi1hcGktY29tcG9uZW50JyxcbiAgICAgICAgICB0ZXh0OiAnQXBpQ29tcG9uZW50IEFwaVx1N0VDNFx1NEVGNlx1NTMwNVx1ODhDNVx1NTY2OCcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBsaW5rOiAnY29tbW9uLXVpL3ZiZW4tYWxlcnQnLFxuICAgICAgICAgIHRleHQ6ICdBbGVydCBcdThGN0JcdTkxQ0ZcdTYzRDBcdTc5M0FcdTY4NDYnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGluazogJ2NvbW1vbi11aS92YmVuLW1vZGFsJyxcbiAgICAgICAgICB0ZXh0OiAnTW9kYWwgXHU2QTIxXHU2MDAxXHU2ODQ2JyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxpbms6ICdjb21tb24tdWkvdmJlbi1kcmF3ZXInLFxuICAgICAgICAgIHRleHQ6ICdEcmF3ZXIgXHU2MkJEXHU1QzQ5JyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxpbms6ICdjb21tb24tdWkvdmJlbi1mb3JtJyxcbiAgICAgICAgICB0ZXh0OiAnRm9ybSBcdTg4NjhcdTUzNTUnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGluazogJ2NvbW1vbi11aS92YmVuLXZ4ZS10YWJsZScsXG4gICAgICAgICAgdGV4dDogJ1Z4ZSBUYWJsZSBcdTg4NjhcdTY4M0MnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGluazogJ2NvbW1vbi11aS92YmVuLWNvdW50LXRvLWFuaW1hdG9yJyxcbiAgICAgICAgICB0ZXh0OiAnQ291bnRUb0FuaW1hdG9yIFx1NjU3MFx1NUI1N1x1NTJBOFx1NzUzQicsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBsaW5rOiAnY29tbW9uLXVpL3ZiZW4tZWxsaXBzaXMtdGV4dCcsXG4gICAgICAgICAgdGV4dDogJ0VsbGlwc2lzVGV4dCBcdTc3MDFcdTc1NjVcdTY1ODdcdTY3MkMnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICBdO1xufVxuXG5mdW5jdGlvbiBuYXYoKTogRGVmYXVsdFRoZW1lLk5hdkl0ZW1bXSB7XG4gIHJldHVybiBbXG4gICAge1xuICAgICAgYWN0aXZlTWF0Y2g6ICdeLyhndWlkZXxjb21wb25lbnRzKS8nLFxuICAgICAgdGV4dDogJ1x1NjU4N1x1Njg2MycsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7XG4gICAgICAgICAgYWN0aXZlTWF0Y2g6ICdeL2d1aWRlLycsXG4gICAgICAgICAgbGluazogJy9ndWlkZS9pbnRyb2R1Y3Rpb24vdmJlbicsXG4gICAgICAgICAgdGV4dDogJ1x1NjMwN1x1NTM1NycsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBhY3RpdmVNYXRjaDogJ14vY29tcG9uZW50cy8nLFxuICAgICAgICAgIGxpbms6ICcvY29tcG9uZW50cy9pbnRyb2R1Y3Rpb24nLFxuICAgICAgICAgIHRleHQ6ICdcdTdFQzRcdTRFRjYnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogJ1x1NTM4Nlx1NTNGMlx1NzI0OFx1NjcyQycsXG4gICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGluazogJ2h0dHBzOi8vZG9jLnZ2YmluLmNuJyxcbiAgICAgICAgICAgICAgdGV4dDogJzIueFx1NzI0OFx1NjcyQ1x1NjU4N1x1Njg2MycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgdGV4dDogJ1x1NkYxNFx1NzkzQScsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogJ1ZiZW4gQWRtaW4nLFxuICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGxpbms6ICdodHRwczovL3d3dy52YmVuLnBybycsXG4gICAgICAgICAgICAgIHRleHQ6ICdcdTZGMTRcdTc5M0FcdTcyNDhcdTY3MkMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGluazogJ2h0dHBzOi8vYW50LnZiZW4ucHJvJyxcbiAgICAgICAgICAgICAgdGV4dDogJ0FudCBEZXNpZ24gVnVlIFx1NzI0OFx1NjcyQycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsaW5rOiAnaHR0cHM6Ly9uYWl2ZS52YmVuLnBybycsXG4gICAgICAgICAgICAgIHRleHQ6ICdOYWl2ZSBcdTcyNDhcdTY3MkMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGluazogJ2h0dHBzOi8vZWxlLnZiZW4ucHJvJyxcbiAgICAgICAgICAgICAgdGV4dDogJ0VsZW1lbnQgUGx1c1x1NzI0OFx1NjcyQycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiAnXHU1MTc2XHU0RUQ2JyxcbiAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsaW5rOiAnaHR0cHM6Ly92YmVuLnZ2YmluLmNuJyxcbiAgICAgICAgICAgICAgdGV4dDogJ1ZiZW4gQWRtaW4gMi54JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiB2ZXJzaW9uLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vdmJlbmpzL3Z1ZS12YmVuLWFkbWluL3JlbGVhc2VzJyxcbiAgICAgICAgICB0ZXh0OiAnXHU2NkY0XHU2NUIwXHU2NUU1XHU1RkQ3JyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vb3Jncy92YmVuanMvcHJvamVjdHMvNScsXG4gICAgICAgICAgdGV4dDogJ1x1OERFRlx1N0VCRlx1NTZGRScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL3ZiZW5qcy92dWUtdmJlbi1hZG1pbi9ibG9iL21haW4vLmdpdGh1Yi9jb250cmlidXRpbmcubWQnLFxuICAgICAgICAgIHRleHQ6ICdcdThEMjFcdTczMkUnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGxpbms6ICcvY29tbWVyY2lhbC90ZWNobmljYWwtc3VwcG9ydCcsXG4gICAgICB0ZXh0OiAnXHVEODNFXHVERDg0IFx1NjI4MFx1NjcyRlx1NjUyRlx1NjMwMScsXG4gICAgfSxcbiAgICB7XG4gICAgICBsaW5rOiAnL3Nwb25zb3IvcGVyc29uYWwnLFxuICAgICAgdGV4dDogJ1x1MjcyOCBcdThENUVcdTUyQTknLFxuICAgIH0sXG4gICAge1xuICAgICAgbGluazogJy9jb21tZXJjaWFsL2NvbW11bml0eScsXG4gICAgICB0ZXh0OiAnXHVEODNEXHVEQzY4XHUyMDBEXHVEODNEXHVEQzY2XHUyMDBEXHVEODNEXHVEQzY2IFx1NEVBNFx1NkQ0MVx1N0ZBNCcsXG4gICAgICAvLyBpdGVtczogW1xuICAgICAgLy8gICB7XG4gICAgICAvLyAgICAgbGluazogJ2h0dHBzOi8vcXVuLnFxLmNvbS9xcXdlYi9xdW5wcm8vc2hhcmU/X3d2PTMmX3d3dj0xMjgmYXBwQ2hhbm5lbD1zaGFyZSZpbnZpdGVDb2RlPTIyeVN6ajdwS2l3JmJ1c2luZXNzVHlwZT05JmZyb209MjQ2NjEwJmJpej1rYSZtYWluU291cmNlSWQ9c2hhcmUmc3ViU291cmNlSWQ9b3RoZXJzJmp1bXBzb3VyY2U9c2hvcnR1cmwjL3BjJyxcbiAgICAgIC8vICAgICB0ZXh0OiAnUVFcdTk4OTFcdTkwNTMnLFxuICAgICAgLy8gICB9LFxuICAgICAgLy8gICB7XG4gICAgICAvLyAgICAgbGluazogJ2h0dHBzOi8vcW0ucXEuY29tL2NnaS1iaW4vcW0vcXI/X3d2PTEwMjcmaz1talptbGhnVnp6VXh2ZHhsbEI2QzF2SHBYOE84UVJMMCZhdXRoS2V5PURCZEZiQndFUm1mYUtZOTVKdlJXcUxDSklSR0pBbUt5WmJycHpaNDFFS0RNWjVTUjZNZmJqT0JhYU5STjczZnImbm92ZXJpZnk9MCZncm91cF9jb2RlPTQyODYxMDknLFxuICAgICAgLy8gICAgIHRleHQ6ICdRUVx1N0ZBNCcsXG4gICAgICAvLyAgIH0sXG4gICAgICAvLyAgIHtcbiAgICAgIC8vICAgICBsaW5rOiAnaHR0cHM6Ly9kaXNjb3JkLmdnL1ZVNjJqVGVjYWQnLFxuICAgICAgLy8gICAgIHRleHQ6ICdEaXNjb3JkJyxcbiAgICAgIC8vICAgfSxcbiAgICAgIC8vIF0sXG4gICAgfSxcbiAgICAvLyB7XG4gICAgLy8gICBsaW5rOiAnL2ZyaWVuZC1saW5rcy8nLFxuICAgIC8vICAgdGV4dDogJ1x1RDgzRVx1REQxRCBcdTUzQ0JcdTYwQzVcdTk0RkVcdTYzQTUnLFxuICAgIC8vIH0sXG4gIF07XG59XG5cbmV4cG9ydCBjb25zdCBzZWFyY2g6IERlZmF1bHRUaGVtZS5BbGdvbGlhU2VhcmNoT3B0aW9uc1snbG9jYWxlcyddID0ge1xuICByb290OiB7XG4gICAgcGxhY2Vob2xkZXI6ICdcdTY0MUNcdTdEMjJcdTY1ODdcdTY4NjMnLFxuICAgIHRyYW5zbGF0aW9uczoge1xuICAgICAgYnV0dG9uOiB7XG4gICAgICAgIGJ1dHRvbkFyaWFMYWJlbDogJ1x1NjQxQ1x1N0QyMlx1NjU4N1x1Njg2MycsXG4gICAgICAgIGJ1dHRvblRleHQ6ICdcdTY0MUNcdTdEMjJcdTY1ODdcdTY4NjMnLFxuICAgICAgfSxcbiAgICAgIG1vZGFsOiB7XG4gICAgICAgIGVycm9yU2NyZWVuOiB7XG4gICAgICAgICAgaGVscFRleHQ6ICdcdTRGNjBcdTUzRUZcdTgwRkRcdTk3MDBcdTg5ODFcdTY4QzBcdTY3RTVcdTRGNjBcdTc2ODRcdTdGNTFcdTdFRENcdThGREVcdTYzQTUnLFxuICAgICAgICAgIHRpdGxlVGV4dDogJ1x1NjVFMFx1NkNENVx1ODNCN1x1NTNENlx1N0VEM1x1Njc5QycsXG4gICAgICAgIH0sXG4gICAgICAgIGZvb3Rlcjoge1xuICAgICAgICAgIGNsb3NlVGV4dDogJ1x1NTE3M1x1OTVFRCcsXG4gICAgICAgICAgbmF2aWdhdGVUZXh0OiAnXHU1MjA3XHU2MzYyJyxcbiAgICAgICAgICBzZWFyY2hCeVRleHQ6ICdcdTY0MUNcdTdEMjJcdTYzRDBcdTRGOUJcdTgwMDUnLFxuICAgICAgICAgIHNlbGVjdFRleHQ6ICdcdTkwMDlcdTYyRTknLFxuICAgICAgICB9LFxuICAgICAgICBub1Jlc3VsdHNTY3JlZW46IHtcbiAgICAgICAgICBub1Jlc3VsdHNUZXh0OiAnXHU2NUUwXHU2Q0Q1XHU2MjdFXHU1MjMwXHU3NkY4XHU1MTczXHU3RUQzXHU2NzlDJyxcbiAgICAgICAgICByZXBvcnRNaXNzaW5nUmVzdWx0c0xpbmtUZXh0OiAnXHU3MEI5XHU1MUZCXHU1M0NEXHU5OTg4JyxcbiAgICAgICAgICByZXBvcnRNaXNzaW5nUmVzdWx0c1RleHQ6ICdcdTRGNjBcdThCQTRcdTRFM0FcdThCRTVcdTY3RTVcdThCRTJcdTVFOTRcdThCRTVcdTY3MDlcdTdFRDNcdTY3OUNcdUZGMUYnLFxuICAgICAgICAgIHN1Z2dlc3RlZFF1ZXJ5VGV4dDogJ1x1NEY2MFx1NTNFRlx1NEVFNVx1NUMxRFx1OEJENVx1NjdFNVx1OEJFMicsXG4gICAgICAgIH0sXG4gICAgICAgIHNlYXJjaEJveDoge1xuICAgICAgICAgIGNhbmNlbEJ1dHRvbkFyaWFMYWJlbDogJ1x1NTNENlx1NkQ4OCcsXG4gICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogJ1x1NTNENlx1NkQ4OCcsXG4gICAgICAgICAgcmVzZXRCdXR0b25BcmlhTGFiZWw6ICdcdTZFMDVcdTk2NjRcdTY3RTVcdThCRTJcdTY3NjFcdTRFRjYnLFxuICAgICAgICAgIHJlc2V0QnV0dG9uVGl0bGU6ICdcdTZFMDVcdTk2NjRcdTY3RTVcdThCRTJcdTY3NjFcdTRFRjYnLFxuICAgICAgICB9LFxuICAgICAgICBzdGFydFNjcmVlbjoge1xuICAgICAgICAgIGZhdm9yaXRlU2VhcmNoZXNUaXRsZTogJ1x1NjUzNlx1ODVDRicsXG4gICAgICAgICAgbm9SZWNlbnRTZWFyY2hlc1RleHQ6ICdcdTZDQTFcdTY3MDlcdTY0MUNcdTdEMjJcdTUzODZcdTUzRjInLFxuICAgICAgICAgIHJlY2VudFNlYXJjaGVzVGl0bGU6ICdcdTY0MUNcdTdEMjJcdTUzODZcdTUzRjInLFxuICAgICAgICAgIHJlbW92ZUZhdm9yaXRlU2VhcmNoQnV0dG9uVGl0bGU6ICdcdTRFQ0VcdTY1MzZcdTg1Q0ZcdTRFMkRcdTc5RkJcdTk2NjQnLFxuICAgICAgICAgIHJlbW92ZVJlY2VudFNlYXJjaEJ1dHRvblRpdGxlOiAnXHU0RUNFXHU2NDFDXHU3RDIyXHU1Mzg2XHU1M0YyXHU0RTJEXHU3OUZCXHU5NjY0JyxcbiAgICAgICAgICBzYXZlUmVjZW50U2VhcmNoQnV0dG9uVGl0bGU6ICdcdTRGRERcdTVCNThcdTgxRjNcdTY0MUNcdTdEMjJcdTUzODZcdTUzRjInLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlgsU0FBUyxlQUFlO0FBQ3JaLFNBQVMsNkJBQTZCOzs7QUNDdEMsU0FBUyxvQkFBb0I7OztBQ0EzQixjQUFXOzs7QURJTixJQUFNLEtBQUssYUFBYTtBQUFBLEVBQzdCLGFBQWE7QUFBQSxFQUNiLE1BQU07QUFBQSxFQUNOLGFBQWE7QUFBQSxJQUNYLHFCQUFxQjtBQUFBLElBQ3JCLHFCQUFxQjtBQUFBLElBQ3JCLFdBQVc7QUFBQSxNQUNULE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQSxVQUFVO0FBQUEsTUFDUixTQUNFO0FBQUEsTUFDRixNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sV0FBVyx3QkFBb0Isb0JBQUksS0FBSyxHQUFFLFlBQVksQ0FBQztBQUFBLE1BQ3ZELFNBQVM7QUFBQSxJQUNYO0FBQUEsSUFDQSxlQUFlO0FBQUEsSUFDZixhQUFhO0FBQUEsTUFDWCxlQUFlO0FBQUEsUUFDYixXQUFXO0FBQUEsUUFDWCxXQUFXO0FBQUEsTUFDYjtBQUFBLE1BQ0EsTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBLHNCQUFzQjtBQUFBLElBQ3RCLEtBQUssSUFBSTtBQUFBLElBQ1QsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLElBQ1Q7QUFBQSxJQUNBLGtCQUFrQjtBQUFBLElBQ2xCLFNBQVM7QUFBQSxNQUNQLG1CQUFtQjtBQUFBLFFBQ2pCLE1BQU07QUFBQSxRQUNOLE9BQU8sa0JBQWtCO0FBQUEsTUFDM0I7QUFBQSxNQUNBLGNBQWMsRUFBRSxNQUFNLGNBQWMsT0FBTyxhQUFhLEVBQUU7QUFBQSxJQUM1RDtBQUFBLEVBQ0Y7QUFDRixDQUFDO0FBRUQsU0FBUyxlQUEyQztBQUNsRCxTQUFP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YTtBQUFBLE1BQ2IsTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0w7QUFBQSxVQUNFLGFBQWE7QUFBQSxVQUNiLE1BQU07QUFBQSxVQUNOLE1BQU07QUFBQSxRQUNSO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBTUE7QUFBQSxVQUNFLE1BQU07QUFBQSxVQUNOLE9BQU87QUFBQSxZQUNMO0FBQUEsY0FDRSxNQUFNO0FBQUEsY0FDTixNQUFNO0FBQUEsWUFDUjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUEsUUFDTDtBQUFBLFVBQ0UsTUFBTTtBQUFBLFVBQ04sT0FBTztBQUFBLFlBQ0w7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLE1BQU07QUFBQSxZQUNSO0FBQUEsWUFDQTtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sTUFBTTtBQUFBLFlBQ1I7QUFBQSxZQUNBO0FBQUEsY0FDRSxNQUFNO0FBQUEsY0FDTixNQUFNO0FBQUEsWUFDUjtBQUFBLFlBQ0E7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLE1BQU07QUFBQSxZQUNSO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxRQUNBO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixPQUFPO0FBQUEsWUFDTDtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sTUFBTTtBQUFBLFlBQ1I7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQTtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0w7QUFBQSxVQUNFLE1BQU07QUFBQSxVQUNOLE1BQU07QUFBQSxRQUNSO0FBQUEsUUFDQTtBQUFBLFVBQ0UsTUFBTTtBQUFBLFVBQ04sTUFBTTtBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixNQUFNO0FBQUEsUUFDUjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFD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VUFDRSxNQUFNO0FBQUEsVUFDTixNQUFNO0FBQUEsUUFDUjtBQUFBLFFBQ0E7QUFBQSxVQUNFLE1BQU07QUFBQSxVQUNOLE1BQU07QUFBQSxRQUNSO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxTQUFTRCxPQUE4QjtBQUNyQyxTQUFPO0FBQUEsSUFDTDtBQUFBLE1BQ0UsYUFBYTtBQUFBLE1BQ2IsTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0w7QUFBQSxVQUNFLGFBQWE7QUFBQSxVQUNiLE1BQU07QUFBQSxVQUNOLE1BQU07QUFBQSxRQUNSO0FBQUEsUUFDQTtBQUFBLFVBQ0UsYUFBYTtBQUFBLFVBQ2IsTUFBTTtBQUFBLFVBQ04sTUFBTTtBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixPQUFPO0FBQUEsWUFDTDtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sTUFBTTtBQUFBLFlBQ1I7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQTtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0w7QUFBQSxVQUNFLE1BQU07QUFBQSxVQUNOLE9BQU87QUFBQSxZQUNMO0FBQUEsY0FDRSxNQUFNO0FBQUEsY0FDTixNQUFNO0FBQUEsWUFDUjtBQUFBLFlBQ0E7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLE1BQU07QUFBQSxZQUNSO0FBQUEsWUFDQTtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sTUFBTTtBQUFBLFlBQ1I7QUFBQSxZQUNBO0FBQUEsY0FDRSxNQUFNO0FBQUEsY0FDTixNQUFNO0FBQUEsWUFDUjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsUUFDQTtBQUFBLFVBQ0UsTUFBTTtBQUFBLFVBQ04sT0FBTztBQUFBLFlBQ0w7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLE1BQU07QUFBQSxZQUNSO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElB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
