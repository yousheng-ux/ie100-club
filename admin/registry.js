// ===== IE100 content registry =====
// The single source of truth that the admin Content editor renders from.
// Each field: { key, label(中文), type: 'text'|'textarea'|'rich'|'image', value(当前默认值) }
// `value` doubles as the seed used by "用当前网站内容初始化".
// Rich values are raw HTML (stored in the doc as { html: ... }).
// Plain titles that have a line break on the site use "\n" (content.js renders <br>).

window.IE100_REGISTRY = {
  pages: [
    {
      id: 'global', title: '全站 · 页脚',
      sections: [
        { title: '页脚（所有页面共用）', fields: [
          { key: 'footer.about', label: '俱乐部简介', type: 'textarea', value: '国际企业家100俱乐部——聚焦全球华人企业家，私密、闭环的跨境商业生态社群。\n隶属于新加坡春天国际控股公司。' },
          { key: 'footer.email', label: '联系邮箱', type: 'text', value: 'info@ie100club.com' },
          { key: 'footer.copyright', label: '版权信息', type: 'text', value: '© 2026 IE100 俱乐部. 版权所有.' },
          { key: 'footer.legal', label: '法律/备案行', type: 'text', value: '隐私政策 · 条款 · [ ICP 备案号 ]' },
        ]},
      ]
    },

    {
      id: 'index', title: '首页',
      sections: [
        { title: '首屏 Hero', fields: [
          { key: 'index.hero.eyebrow', label: '小标题', type: 'text', value: '国际企业家100俱乐部' },
          { key: 'index.hero.title', label: '主标题（换行用回车）', type: 'textarea', value: '连接全球华商，重塑\n价值版图' },
          { key: 'index.hero.subtitle', label: '副标题', type: 'textarea', value: '以新加坡为枢纽，构建高信任的全球华商协作网络——资源对接、企业传承、世代相传，仅限受邀加入。' },
          { key: 'index.hero.slide.0', label: '轮播图 1', type: 'image', value: "KV%20Image/FTU%20Image/Image21.jpg" },
          { key: 'index.hero.slide.1', label: '轮播图 2', type: 'image', value: "KV%20Image/FTU%20Image/Image3.jpg" },
          { key: 'index.hero.slide.2', label: '轮播图 3', type: 'image', value: "KV%20Image/FTU%20Image/Image1.jpg" },
          { key: 'index.hero.slide.3', label: '轮播图 4', type: 'image', value: "KV%20Image/FTU%20Image/Image16.jpg" },
          { key: 'index.hero.slide.4', label: '轮播图 5', type: 'image', value: "KV%20Image/FTU%20Image/Image5.jpg" },
          { key: 'index.hero.slide.5', label: '轮播图 6', type: 'image', value: "KV%20Image/FTU%20Image/Image4.jpg" },
        ]},
        { title: '核心优势', fields: [
          { key: 'index.advantages.eyebrow', label: '小标题', type: 'text', value: '核心优势' },
          { key: 'index.advantages.title', label: '标题', type: 'textarea', value: '为塑造跨境产业格局的少数卓越者，打造高端商业生态' },
          { key: 'index.advantages.card.0.title', label: '卡片1 · 标题', type: 'text', value: '1对1 商务资源对接' },
          { key: 'index.advantages.card.0.body', label: '卡片1 · 描述', type: 'textarea', value: '依托"新加坡加一政策"，为会员对接资本、合作伙伴与跨境商机，助力企业通商东南亚与世界各地。' },
          { key: 'index.advantages.card.0.img', label: '卡片1 · 配图', type: 'image', value: "KV%20Image/FTU%20Image/Image25.jpg" },
          { key: 'index.advantages.card.1.title', label: '卡片2 · 标题', type: 'text', value: '企业传承服务' },
          { key: 'index.advantages.card.1.body', label: '卡片2 · 描述', type: 'textarea', value: '为家族企业的长远延续提供体系化的顾问与服务——让价值跨越世代，基业长青。' },
          { key: 'index.advantages.card.1.img', label: '卡片2 · 配图', type: 'image', value: "KV%20Image/FTU%20Image/Image2.jpg" },
          { key: 'index.advantages.card.2.title', label: '卡片3 · 标题', type: 'text', value: '二代资源链接' },
          { key: 'index.advantages.card.2.body', label: '卡片3 · 描述', type: 'textarea', value: '一个值得信赖的圈层，连接企业二代与全球范围内的导师、同侪及专属线下体验。' },
          { key: 'index.advantages.card.2.img', label: '卡片3 · 配图', type: 'image', value: "KV%20Image/FTU%20Image/Image10.jpg" },
        ]},
        { title: '宗旨', fields: [
          { key: 'index.statement.eyebrow', label: '小标题', type: 'text', value: '宗旨 · Our Purpose' },
          { key: 'index.statement.body', label: '宗旨正文（可加粗）', type: 'rich', value: '打造一个国际华人企业家高端社交俱乐部，<span class="muted">为各国企业家和青年创始人提供跨国信息交流，提高国际认知，资产保值增值，促进跨界合作、商务赋能，促进会员事业的发展，促进企业家向投资家转变，促进个人生活品质的提升。</span>' },
          { key: 'index.statement.cite', label: '署名', type: 'text', value: '— 国际企业家100俱乐部' },
        ]},
        { title: '体验特写', fields: [
          { key: 'index.feature.img', label: '大图', type: 'image', value: "KV%20Image/FTU%20Image/Image13.jpg" },
          { key: 'index.feature.eyebrow', label: '小标题', type: 'text', value: '俱乐部体验' },
          { key: 'index.feature.heading', label: '标题（换行用回车）', type: 'textarea', value: '从私密的天台沙龙，到闭门论坛，\n汇聚精挑细选的企业家社群' },
          { key: 'index.feature.meta.0.label', label: '信息1 · 名称', type: 'text', value: '活动形式' },
          { key: 'index.feature.meta.0.value', label: '信息1 · 内容', type: 'text', value: '私密沙龙 · 闭门论坛' },
          { key: 'index.feature.meta.1.label', label: '信息2 · 名称', type: 'text', value: '举办城市' },
          { key: 'index.feature.meta.1.value', label: '信息2 · 内容', type: 'text', value: '上海 · 香港 · 新加坡' },
          { key: 'index.feature.meta.2.label', label: '信息3 · 名称', type: 'text', value: '准入方式' },
          { key: 'index.feature.meta.2.value', label: '信息3 · 内容', type: 'text', value: '仅限受邀会员' },
          { key: 'index.feature.body.title', label: '副栏标题', type: 'text', value: '亲密的圈层，全球的格局' },
          { key: 'index.feature.body.text', label: '副栏正文', type: 'textarea', value: '每一次聚会都为真诚的连接、坦率的交流，以及唯有闭环生态方能成就的信任而设。我们相信，最有价值的资源往往诞生于一席对话之间——在这里，企业家彼此成就，跨越边界，共筑长久。' },
        ]},
        { title: '会员福利', fields: [
          { key: 'index.benefits.eyebrow', label: '小标题', type: 'text', value: '会员福利 · Member Benefits' },
          { key: 'index.benefits.title', label: '标题', type: 'text', value: '七项专属权益，陪伴会员跨越山海' },
          { key: 'index.benefits.item.0.title', label: '权益1 · 标题', type: 'text', value: '商务资源对接' },
          { key: 'index.benefits.item.0.body', label: '权益1 · 描述', type: 'textarea', value: '跨国商务资源精准匹配，为中国企业家出海东南亚及国际化布局设计解决方案，深度链接渠道与人脉资源，同时协助新加坡及海外企业家布局中国市场，构建双向互通的跨境商务合作渠道。' },
          { key: 'index.benefits.item.1.title', label: '权益2 · 标题', type: 'text', value: '私享沙龙酒会' },
          { key: 'index.benefits.item.1.body', label: '权益2 · 描述', type: 'textarea', value: '打造高私密性小圈层交流场景，围绕项目洽谈、资源置换、行业研讨开展精准对接，构筑纯粹的精英社交环境，促成会员间深度同频合作。' },
          { key: 'index.benefits.item.2.title', label: '权益3 · 标题', type: 'text', value: '商务午荟' },
          { key: 'index.benefits.item.2.body', label: '权益3 · 描述', type: 'textarea', value: '开展同城会员轻商务午餐交流活动，搭建面对面沟通渠道，实现一对一资源对接，高效推动业务协同与合作落地。' },
          { key: 'index.benefits.item.3.title', label: '权益4 · 标题', type: 'text', value: '企业参访活动' },
          { key: 'index.benefits.item.3.body', label: '权益4 · 描述', type: 'textarea', value: '组织会员走进优秀会员企业实地参访调研，深入了解企业业务模式与产业优势，夯实圈层互信，助力企业品牌展示与深度业务合作。' },
          { key: 'index.benefits.item.4.title', label: '权益5 · 标题', type: 'text', value: '行业主题分享会（线上线下）' },
          { key: 'index.benefits.item.4.body', label: '权益5 · 描述', type: 'textarea', value: '汇聚企业家与行业专家，围绕跨境发展、市场趋势、产业变革等议题开展专题分享，搭建商业思想交流平台，帮助会员把握投资机遇，破解经营难题。' },
          { key: 'index.benefits.item.5.title', label: '权益6 · 标题', type: 'text', value: '企业家二代研修' },
          { key: 'index.benefits.item.5.body', label: '权益6 · 描述', type: 'textarea', value: '面向家族企业新生代接班人开展系统化赋能，拓宽商业视野、搭建专属圈层，围绕格局提升、企业传承、创新经营开展学习交流，保障家族企业可持续传承发展。' },
          { key: 'index.benefits.item.6.title', label: '权益7 · 标题', type: 'text', value: '尊崇会员身份' },
          { key: 'index.benefits.item.6.body', label: '权益7 · 描述', type: 'textarea', value: '拥有高贵的会员身份，获得国际化的社交标识，彰显企业家圈层地位。' },
        ]},
        { title: '活动区（标题）', fields: [
          { key: 'index.events.eyebrow', label: '小标题', type: 'text', value: '常年活动 · Activities' },
          { key: 'index.events.title', label: '标题', type: 'text', value: '年度大会与论坛 · 季度交流会 · 不定期企业走访' },
        ]},
        { title: '团队与顾问', fields: [
          { key: 'index.leaders.eyebrow', label: '小标题', type: 'text', value: '团队与顾问' },
          { key: 'index.leaders.title', label: '标题', type: 'text', value: '由资深企业家与值得信赖的顾问引领' },
          { key: 'index.leaders.person.0.name', label: '成员1 · 姓名', type: 'text', value: 'Alan Yang 杨照林' },
          { key: 'index.leaders.person.0.role', label: '成员1 · 职务', type: 'text', value: '主席（轮值制）' },
          { key: 'index.leaders.person.0.bio', label: '成员1 · 简介', type: 'textarea', value: '逾25年跨境企业建设经验，引领 IE100 打造私密、可信、面向全球华人企业家的社群愿景。' },
          { key: 'index.leaders.person.0.img', label: '成员1 · 照片', type: 'image', value: "KV%20Image/FTU%20Image/Image11.jpg" },
          { key: 'index.leaders.person.1.name', label: '成员2 · 姓名', type: 'text', value: 'Jason Yang' },
          { key: 'index.leaders.person.1.role', label: '成员2 · 职务', type: 'text', value: '执行总监' },
          { key: 'index.leaders.person.1.bio', label: '成员2 · 简介', type: 'textarea', value: '主导会员服务与战略资源对接，在金融与企业转型领域拥有深厚经验。' },
          { key: 'index.leaders.person.1.img', label: '成员2 · 照片', type: 'image', value: "KV%20Image/FTU%20Image/Image8.jpg" },
          { key: 'index.leaders.person.2.name', label: '成员3 · 姓名', type: 'text', value: 'David Goh' },
          { key: 'index.leaders.person.2.role', label: '成员3 · 职务', type: 'text', value: '高级顾问' },
          { key: 'index.leaders.person.2.bio', label: '成员3 · 简介', type: 'textarea', value: '为会员提供企业传承与治理方面的顾问服务，拥有数十年家族企业专业经验。' },
          { key: 'index.leaders.person.2.img', label: '成员3 · 照片', type: 'image', value: "KV%20Image/FTU%20Image/Image7.jpg" },
          { key: 'index.leaders.person.3.name', label: '成员4 · 姓名', type: 'text', value: 'Tony Chan' },
          { key: 'index.leaders.person.3.role', label: '成员4 · 职务', type: 'text', value: '资源顾问' },
          { key: 'index.leaders.person.3.bio', label: '成员4 · 简介', type: 'textarea', value: '连接跨市场的新一代创始人，促进导师指导与长久的合作伙伴关系。' },
          { key: 'index.leaders.person.4.name', label: '成员5 · 姓名', type: 'text', value: 'Irene 林文惠博士' },
          { key: 'index.leaders.person.4.role', label: '成员5 · 职务', type: 'text', value: '二代传承顾问' },
          { key: 'index.leaders.person.4.bio', label: '成员5 · 简介', type: 'textarea', value: '国际教练联合会认证教练 | 共享领导力团队教练 | 世界 NLP 学院认证教练、培训师与咨询师。INSEED 企业家变革项目培训师，首创「双师模式」，深耕家族企业传承辅导，实战经验丰富。' },
          { key: 'index.leaders.person.3.img', label: '成员4 · 照片', type: 'image', value: "KV%20Image/FTU%20Image/Image9.jpg" },
        ]},
        { title: '底部行动区 CTA', fields: [
          { key: 'index.cta.eyebrow', label: '小标题', type: 'text', value: '受邀制会员 · Membership' },
          { key: 'index.cta.title', label: '标题（换行用回车）', type: 'textarea', value: '全球限额 100 位\n受邀制高端社群' },
          { key: 'index.cta.text1', label: '正文', type: 'textarea', value: '入会资格：具有一定实力的企业家、有潜力的青年创始人（含企业家二代）。申请方法：会员推荐，理事会审批。' },
        ]},
      ]
    },

    {
      id: 'about', title: '关于我们',
      sections: [
        { title: '页头横幅', fields: [
          { key: 'about.banner.img', label: '背景图', type: 'image', value: "KV%20Image/FTU%20Image/Image15.jpg" },
          { key: 'about.banner.eyebrow', label: '小标题', type: 'text', value: '关于我们' },
          { key: 'about.banner.title', label: '标题（换行用回车）', type: 'textarea', value: '连接全球华商的\n私密商业社群' },
          { key: 'about.banner.subtitle', label: '副标题', type: 'textarea', value: 'IE100 俱乐部致力于打造一个闭环、可信、跨越边界的高端商业生态——让卓越的创始人彼此连接、共创长远价值。' },
        ]},
        { title: '核心理念', fields: [
          { key: 'about.core.eyebrow', label: '小标题', type: 'text', value: '核心理念' },
          { key: 'about.core.title', label: '标题', type: 'text', value: '以信任为基石，以传承为远见' },
          { key: 'about.core.prose', label: '正文（多段，可加粗）', type: 'rich', value: '<p class="lead">国际企业家100俱乐部（IE100club）聚焦全球华人企业家，是一个私密、闭环的高端商业社群。</p>\n<p>我们相信，真正有价值的商业关系建立于长久的信任与审慎的分寸之上。IE100 以"百位"为名，寓意精选、克制与高门槛——我们宁缺毋滥，只为汇聚真正志同道合、彼此成就的卓越创始人。</p>\n<p>俱乐部的服务宗旨，是为各国企业家与青年创始人提供跨国信息交流，提高国际认知、促进资产保值增值，并以跨界合作与商务赋能助力会员事业发展，推动企业家向投资家转变，进而提升个人生活品质。我们陪伴每一位会员，走过事业与人生的关键节点。</p>' },
        ]},
        { title: '数据指标', fields: [
          { key: 'about.stats.0.num', label: '指标1 · 数字', type: 'rich', value: '<b>100</b>+' },
          { key: 'about.stats.0.label', label: '指标1 · 说明', type: 'text', value: '受邀会员企业' },
          { key: 'about.stats.1.num', label: '指标2 · 数字', type: 'rich', value: '12' },
          { key: 'about.stats.1.label', label: '指标2 · 说明', type: 'text', value: '覆盖全球城市' },
          { key: 'about.stats.2.num', label: '指标3 · 数字', type: 'rich', value: '40' },
          { key: 'about.stats.2.label', label: '指标3 · 说明', type: 'text', value: '年度线下活动' },
          { key: 'about.stats.3.num', label: '指标4 · 数字', type: 'rich', value: '¥80<b>亿</b>' },
          { key: 'about.stats.3.label', label: '指标4 · 说明', type: 'text', value: '累计资源对接' },
        ]},
        { title: '优势与实力', fields: [
          { key: 'about.strength.eyebrow', label: '小标题', type: 'text', value: '优势与实力' },
          { key: 'about.strength.title', label: '标题', type: 'text', value: '四项核心服务能力，构筑会员的长期价值' },
          { key: 'about.strength.item.0.title', label: '能力1 · 标题', type: 'text', value: '1对1 商务资源对接' },
          { key: 'about.strength.item.0.body', label: '能力1 · 描述', type: 'textarea', value: '由专属顾问根据会员需求，精准、私密地引荐资本、合作伙伴与跨境商业机会，让每一次连接都恰逢其时。' },
          { key: 'about.strength.item.1.title', label: '能力2 · 标题', type: 'text', value: '企业传承服务' },
          { key: 'about.strength.item.1.body', label: '能力2 · 描述', type: 'textarea', value: '为家族企业的长远延续提供体系化的顾问与服务，涵盖治理结构、股权安排与接班规划，让价值跨越世代。' },
          { key: 'about.strength.item.2.title', label: '能力3 · 标题', type: 'text', value: '二代资源链接' },
          { key: 'about.strength.item.2.body', label: '能力3 · 描述', type: 'textarea', value: '连接企业二代与全球范围内的导师、同侪及专属体验，助力新一代企业家成长，承启家族与事业的未来。' },
          { key: 'about.strength.item.3.title', label: '能力4 · 标题', type: 'text', value: '各类线下活动' },
          { key: 'about.strength.item.3.body', label: '能力4 · 描述', type: 'textarea', value: '从年度大会、季度交流会到企业走访与领袖研修，多元的线下场景让信任在真实的相遇中自然生长。' },
        ]},
        { title: '闭环生态特写', fields: [
          { key: 'about.feature.img', label: '大图', type: 'image', value: "KV%20Image/FTU%20Image/Image1.jpg" },
          { key: 'about.feature.eyebrow', label: '小标题', type: 'text', value: '闭环生态' },
          { key: 'about.feature.heading', label: '标题（换行用回车）', type: 'textarea', value: '一个克制而温暖的圈层，\n让卓越者彼此看见' },
        ]},
        { title: '团队与顾问', fields: [
          { key: 'about.leaders.eyebrow', label: '小标题', type: 'text', value: '团队与顾问' },
          { key: 'about.leaders.title', label: '标题', type: 'text', value: '由资深企业家与值得信赖的顾问引领' },
          { key: 'about.leaders.person.0.name', label: '成员1 · 姓名', type: 'text', value: 'Alan Yang 杨照林' },
          { key: 'about.leaders.person.0.role', label: '成员1 · 职务', type: 'text', value: '主席（轮值制）' },
          { key: 'about.leaders.person.0.bio', label: '成员1 · 简介', type: 'textarea', value: '逾25年跨境企业建设经验，引领 IE100 打造私密、可信、面向全球华人企业家的社群愿景。' },
          { key: 'about.leaders.person.0.img', label: '成员1 · 照片', type: 'image', value: "KV%20Image/FTU%20Image/Image11.jpg" },
          { key: 'about.leaders.person.1.name', label: '成员2 · 姓名', type: 'text', value: 'Jason Yang' },
          { key: 'about.leaders.person.1.role', label: '成员2 · 职务', type: 'text', value: '执行总监' },
          { key: 'about.leaders.person.1.bio', label: '成员2 · 简介', type: 'textarea', value: '主导会员服务与战略资源对接，在金融与企业转型领域拥有深厚经验。' },
          { key: 'about.leaders.person.1.img', label: '成员2 · 照片', type: 'image', value: "KV%20Image/FTU%20Image/Image8.jpg" },
          { key: 'about.leaders.person.2.name', label: '成员3 · 姓名', type: 'text', value: 'David Goh' },
          { key: 'about.leaders.person.2.role', label: '成员3 · 职务', type: 'text', value: '高级顾问' },
          { key: 'about.leaders.person.2.bio', label: '成员3 · 简介', type: 'textarea', value: '为会员提供企业传承与治理方面的顾问服务，拥有数十年家族企业专业经验。' },
          { key: 'about.leaders.person.2.img', label: '成员3 · 照片', type: 'image', value: "KV%20Image/FTU%20Image/Image7.jpg" },
          { key: 'about.leaders.person.3.name', label: '成员4 · 姓名', type: 'text', value: 'Tony Chan' },
          { key: 'about.leaders.person.3.role', label: '成员4 · 职务', type: 'text', value: '资源顾问' },
          { key: 'about.leaders.person.3.bio', label: '成员4 · 简介', type: 'textarea', value: '连接跨市场的新一代创始人，促进导师指导与长久的合作伙伴关系。' },
          { key: 'about.leaders.person.4.name', label: '成员5 · 姓名', type: 'text', value: 'Irene 林文惠博士' },
          { key: 'about.leaders.person.4.role', label: '成员5 · 职务', type: 'text', value: '二代传承顾问' },
          { key: 'about.leaders.person.4.bio', label: '成员5 · 简介', type: 'textarea', value: '国际教练联合会认证教练 | 共享领导力团队教练 | 世界 NLP 学院认证教练、培训师与咨询师。INSEED 企业家变革项目培训师，首创「双师模式」，深耕家族企业传承辅导，实战经验丰富。' },
          { key: 'about.leaders.person.3.img', label: '成员4 · 照片', type: 'image', value: "KV%20Image/FTU%20Image/Image9.jpg" },
        ]},
        { title: '底部行动区 CTA', fields: [
          { key: 'about.cta.eyebrow', label: '小标题', type: 'text', value: '受邀制会员' },
          { key: 'about.cta.title', label: '标题（换行用回车）', type: 'textarea', value: '加入一个\n为您开启机遇之门的社群' },
          { key: 'about.cta.text', label: '正文', type: 'textarea', value: 'IE100 会员采用甄选制。欢迎符合资格的企业家提交申请——我们的团队将审慎评估每一份申请。' },
        ]},
      ]
    },

    {
      id: 'philosophy', title: '企业理念',
      sections: [
        { title: '页头横幅', fields: [
          { key: 'philosophy.banner.img', label: '背景图', type: 'image', value: "KV%20Image/FTU%20Image/Image2.jpg" },
          { key: 'philosophy.banner.eyebrow', label: '小标题', type: 'text', value: '企业理念' },
          { key: 'philosophy.banner.title', label: '标题', type: 'text', value: '愿景、使命与价值观' },
          { key: 'philosophy.banner.subtitle', label: '副标题', type: 'textarea', value: '理念是俱乐部的底色。它指引我们如何聚人、如何相待、如何走得长远。' },
        ]},
        { title: '引言', fields: [
          { key: 'philosophy.statement.eyebrow', label: '小标题', type: 'text', value: '我们所信' },
          { key: 'philosophy.statement.body', label: '引言正文（可加粗）', type: 'rich', value: '"连接全球华商，重塑价值版图。<span class="muted">IE100 愿成为华人企业家最值得信赖的同行者——在这里，雄心被理解，远见被成全。"</span>' },
          { key: 'philosophy.statement.cite', label: '署名', type: 'text', value: '— IE100 俱乐部' },
        ]},
        { title: '三大基石', fields: [
          { key: 'philosophy.pillars.eyebrow', label: '小标题', type: 'text', value: '三大基石' },
          { key: 'philosophy.pillars.title', label: '标题', type: 'text', value: '支撑俱乐部前行的核心信念' },
          { key: 'philosophy.pillar.0.title', label: '基石1 · 标题', type: 'text', value: '愿景' },
          { key: 'philosophy.pillar.0.body', label: '基石1 · 描述', type: 'textarea', value: '连接全球华商，重塑价值版图。' },
          { key: 'philosophy.pillar.1.title', label: '基石2 · 标题', type: 'text', value: '使命' },
          { key: 'philosophy.pillar.1.body', label: '基石2 · 描述', type: 'textarea', value: '以新加坡为枢纽，构建高信任的全球华商协作网络。' },
          { key: 'philosophy.pillar.2.title', label: '基石3 · 标题', type: 'text', value: '价值观' },
          { key: 'philosophy.pillar.2.body', label: '基石3 · 描述', type: 'textarea', value: '价值优先 · 代际共创 · 全球视野 · 信任至上。' },
        ]},
        { title: '价值观细则', fields: [
          { key: 'philosophy.values.eyebrow', label: '小标题', type: 'text', value: '价值观' },
          { key: 'philosophy.values.title', label: '标题', type: 'text', value: '四个词，定义我们如何相待' },
          { key: 'philosophy.values.prose', label: '细则正文（多段，可加粗）', type: 'rich', value: '<p><strong class="em-lg">价值优先 ·</strong> 连接必须创造真实商业价值。</p>\n<p><strong class="em-lg">代际共创 ·</strong> 打破年龄与圈层边界，促进经验与创新融合。</p>\n<p><strong class="em-lg">全球视野 ·</strong> 立足新加坡，布局世界。</p>\n<p><strong class="em-lg">信任至上 ·</strong> 以百人规模建立深度信任与长期共生。</p>' },
        ]},
        { title: '长期主义特写', fields: [
          { key: 'philosophy.feature.img', label: '大图', type: 'image', value: "KV%20Image/FTU%20Image/Image19.jpg" },
          { key: 'philosophy.feature.eyebrow', label: '小标题', type: 'text', value: '长期主义' },
          { key: 'philosophy.feature.heading', label: '标题（换行用回车）', type: 'textarea', value: '不追逐喧嚣，\n只成全真正长久的事' },
        ]},
        { title: '底部行动区 CTA', fields: [
          { key: 'philosophy.cta.eyebrow', label: '小标题', type: 'text', value: '认同理念' },
          { key: 'philosophy.cta.title', label: '标题（换行用回车）', type: 'textarea', value: '与志同道合者\n同行致远' },
          { key: 'philosophy.cta.text', label: '正文', type: 'textarea', value: '若您认同我们的理念，欢迎进一步了解会员服务与入会资格。' },
        ]},
      ]
    },

    {
      id: 'membership', title: '会员服务',
      sections: [
        { title: '页头横幅', fields: [
          { key: 'membership.banner.img', label: '背景图', type: 'image', value: "KV%20Image/FTU%20Image/Image24.jpg" },
          { key: 'membership.banner.eyebrow', label: '小标题', type: 'text', value: '会员服务' },
          { key: 'membership.banner.title', label: '标题', type: 'text', value: '成为 IE100 的一员' },
          { key: 'membership.banner.subtitle', label: '副标题', type: 'textarea', value: '受邀制的私密社群，专属的权益与服务，只为真正卓越的企业家而设。' },
        ]},
        { title: '会员权益', fields: [
          { key: 'membership.benefits.eyebrow', label: '小标题', type: 'text', value: '会员权益' },
          { key: 'membership.benefits.title', label: '标题', type: 'text', value: '专属于 IE100 会员的价值' },
          { key: 'membership.benefit.0.title', label: '权益1 · 标题', type: 'text', value: '商务资源对接' },
          { key: 'membership.benefit.0.body', label: '权益1 · 描述', type: 'textarea', value: '跨国商务资源精准匹配，为中国企业家出海东南亚及国际化布局设计解决方案，深度链接渠道与人脉资源，同时协助新加坡及海外企业家布局中国市场，构建双向互通的跨境商务合作渠道。' },
          { key: 'membership.benefit.1.title', label: '权益2 · 标题', type: 'text', value: '私享沙龙酒会' },
          { key: 'membership.benefit.1.body', label: '权益2 · 描述', type: 'textarea', value: '打造高私密性小圈层交流场景，围绕项目洽谈、资源置换、行业研讨开展精准对接，构筑纯粹的精英社交环境，促成会员间深度同频合作。' },
          { key: 'membership.benefit.2.title', label: '权益3 · 标题', type: 'text', value: '商务午荟' },
          { key: 'membership.benefit.2.body', label: '权益3 · 描述', type: 'textarea', value: '开展同城会员轻商务午餐交流活动，搭建面对面沟通渠道，实现一对一资源对接，高效推动业务协同与合作落地。' },
          { key: 'membership.benefit.3.title', label: '权益4 · 标题', type: 'text', value: '企业参访活动' },
          { key: 'membership.benefit.3.body', label: '权益4 · 描述', type: 'textarea', value: '组织会员走进优秀会员企业实地参访调研，深入了解企业业务模式与产业优势，夯实圈层互信，助力企业品牌展示与深度业务合作。' },
          { key: 'membership.benefit.4.title', label: '权益5 · 标题', type: 'text', value: '行业主题分享会（线上线下）' },
          { key: 'membership.benefit.4.body', label: '权益5 · 描述', type: 'textarea', value: '汇聚企业家与行业专家，围绕跨境发展、市场趋势、产业变革等议题开展专题分享，搭建商业思想交流平台，帮助会员把握投资机遇，破解经营难题。' },
          { key: 'membership.benefit.5.title', label: '权益6 · 标题', type: 'text', value: '企业家二代研修' },
          { key: 'membership.benefit.5.body', label: '权益6 · 描述', type: 'textarea', value: '面向家族企业新生代接班人开展系统化赋能，拓宽商业视野、搭建专属圈层，围绕格局提升、企业传承、创新经营开展学习交流，保障家族企业可持续传承发展。' },
          { key: 'membership.benefit.6.title', label: '权益7 · 标题', type: 'text', value: '尊崇会员身份' },
          { key: 'membership.benefit.6.body', label: '权益7 · 描述', type: 'textarea', value: '拥有高贵的会员身份，获得国际化的社交标识，彰显企业家圈层地位。' },
        ]},
        { title: '入会资格', fields: [
          { key: 'membership.eligibility.eyebrow', label: '小标题', type: 'text', value: '入会资格' },
          { key: 'membership.eligibility.title', label: '标题（换行用回车）', type: 'textarea', value: '明确的门槛，\n纯粹的圈层' },
          { key: 'membership.eligibility.prose', label: '正文（多段，可加粗）', type: 'rich', value: '<p class="lead">IE100 采用会员推荐、理事会审批的甄选机制，会员数量上限 100 人，宁缺毋滥。</p>\n<p><strong>入会资格 ·</strong> 具备一定实力的企业家。</p>\n<p><strong>申请方法 ·</strong> 会员推荐，理事会审批。</p>\n<p><strong>国际会员来自 ·</strong> 新加坡、中国、东南亚、欧美，以华文为交流语言的各国企业家。</p>\n<p><strong>主席 ·</strong> Alan Yang 杨照林，轮值主席每年一位。</p>' },
        ]},
        { title: '申请流程', fields: [
          { key: 'membership.process.eyebrow', label: '小标题', type: 'text', value: '申请流程' },
          { key: 'membership.process.title', label: '标题', type: 'text', value: '清晰的四步，开启入会之旅' },
          { key: 'membership.step.0.title', label: '步骤1 · 标题', type: 'text', value: '会员推荐' },
          { key: 'membership.step.0.body', label: '步骤1 · 描述', type: 'textarea', value: '由现任会员推荐，或向秘书处提交入会意向。' },
          { key: 'membership.step.1.title', label: '步骤2 · 标题', type: 'text', value: '资格审核' },
          { key: 'membership.step.1.body', label: '步骤2 · 描述', type: 'textarea', value: '俱乐部对申请资料进行评估与背景了解。' },
          { key: 'membership.step.2.title', label: '步骤3 · 标题', type: 'text', value: '面谈交流' },
          { key: 'membership.step.2.body', label: '步骤3 · 描述', type: 'textarea', value: '安排一对一面谈，深入了解彼此的理念与期待。' },
          { key: 'membership.step.3.title', label: '步骤4 · 标题', type: 'text', value: '理事会审批' },
          { key: 'membership.step.3.body', label: '步骤4 · 描述', type: 'textarea', value: '经理事会审批通过后，正式确认会员资格并完成入会。' },
        ]},
        { title: '申请区文案', fields: [
          { key: 'membership.apply.eyebrow', label: '小标题', type: 'text', value: '申请入会' },
          { key: 'membership.apply.title', label: '标题', type: 'text', value: '提交您的入会申请' },
          { key: 'membership.apply.note', label: '表单说明', type: 'textarea', value: '提交后，您的申请将直接发送至俱乐部秘书处邮箱，我们将在 5 个工作日内与您联系。' },
          { key: 'membership.apply.success', label: '提交成功提示', type: 'textarea', value: '✓ 感谢您的申请！我们已收到您的入会意向，将尽快与您取得联系。' },
        ]},
      ]
    },

    {
      id: 'events', title: '活动动态（页面文案）',
      sections: [
        { title: '页头横幅', fields: [
          { key: 'events.banner.img', label: '背景图', type: 'image', value: "KV%20Image/FTU%20Image/Image13.jpg" },
          { key: 'events.banner.eyebrow', label: '小标题', type: 'text', value: '活动动态' },
          { key: 'events.banner.title', label: '标题（换行用回车）', type: 'textarea', value: '相聚之处，\n价值自然流动' },
          { key: 'events.banner.subtitle', label: '副标题', type: 'textarea', value: '年度大会、季度交流会、企业走访与领袖研修——多元的场景，让信任在真实的相遇中生长。' },
        ]},
        { title: '底部行动区 CTA', fields: [
          { key: 'events.cta.eyebrow', label: '小标题', type: 'text', value: '参与活动' },
          { key: 'events.cta.title', label: '标题（换行用回车）', type: 'textarea', value: '成为会员，\n开启专属活动通行' },
          { key: 'events.cta.text', label: '正文', type: 'textarea', value: '俱乐部全部线下活动仅向会员开放。欢迎了解会员服务，开启您的 IE100 之旅。' },
        ]},
      ]
    },

    {
      id: 'contact', title: '联系我们',
      sections: [
        { title: '页头横幅', fields: [
          { key: 'contact.banner.img', label: '背景图', type: 'image', value: "KV%20Image/FTU%20Image/Image23.jpg" },
          { key: 'contact.banner.eyebrow', label: '小标题', type: 'text', value: '联系我们' },
          { key: 'contact.banner.title', label: '标题', type: 'text', value: '与 IE100 取得联系' },
          { key: 'contact.banner.subtitle', label: '副标题', type: 'textarea', value: '无论是入会咨询、合作洽谈，还是媒体联络，我们都期待您的到来。' },
        ]},
        { title: '官方联系方式', fields: [
          { key: 'contact.info.eyebrow', label: '小标题', type: 'text', value: '官方联系方式' },
          { key: 'contact.info.title', label: '标题', type: 'text', value: '我们随时为您服务' },
          { key: 'contact.info.item.1.label', label: '项2 · 名称', type: 'text', value: '官方邮箱' },
          { key: 'contact.info.item.1.value', label: '项2 · 内容', type: 'text', value: 'info@ie100club.com' },
          { key: 'contact.info.item.2.label', label: '项3 · 名称', type: 'text', value: '办公地址' },
          { key: 'contact.info.item.2.value', label: '项3 · 内容', type: 'text', value: '#03-331, Block 135 Jurong Gateway Rd, 600135' },
          { key: 'contact.office.img', label: '办公室照片', type: 'image', value: "KV%20Image/Background2.png" },
        ]},
        { title: '表单文案', fields: [
          { key: 'contact.form.note', label: '表单说明', type: 'textarea', value: '提交后，您的留言将直接发送至俱乐部秘书处邮箱。' },
          { key: 'contact.form.success', label: '提交成功提示', type: 'textarea', value: '✓ 感谢您的留言！我们已收到您的信息，将尽快与您联系。' },
        ]},
      ]
    },
  ],

  // category slug -> Chinese label (editable in the Events tab)
  eventCategoryLabels: { launch: '开幕盛典', annual: '年度大会', quarterly: '季度交流会', visit: '企业走访', retreat: '领袖研修' },
};

// ---- form wording defaults (Form-settings tab + applyForms fallback) ----
window.IE100_FORMS_DEFAULT = {
  membership: {
    title: '入会申请表',
    fields: {
      name:            { label: '姓名', placeholder: '您的姓名', required: true },
      gender:          { label: '性别', placeholder: '', required: true, options: ['男', '女'] },
      email:           { label: '电邮', placeholder: 'name@example.com', required: true },
      wechat:          { label: '微信号', placeholder: '您的微信号', required: false },
      company:         { label: '公司名称', placeholder: '公司全称', required: true },
      companyWebsite:  { label: '公司网址', placeholder: '例如：www.company.com', required: false },
      companyAddress:  { label: '公司地址', placeholder: '公司注册或办公地址', required: false },
      businessScope:   { label: '公司生意范围', placeholder: '请简要描述公司的主营业务与生意范围', required: false },
      referrer:        { label: '推荐会员姓名', placeholder: '推荐您入会的现任会员姓名（如有）', required: false },
      secretaryName:   { label: '秘书姓名（本人指定的联系人）', placeholder: '您指定的联系人姓名', required: false },
      secretaryPhone:  { label: '秘书电话', placeholder: '+65 / +86 ', required: false },
      secretaryEmail:  { label: '秘书电邮', placeholder: 'email@example.com', required: false },
      secretaryWechat: { label: '秘书微信号', placeholder: '微信号', required: false },
    },
  },
  contact: {
    title: '联系表单',
    fields: {
      name:    { label: '姓名', placeholder: '您的姓名', required: true },
      company: { label: '公司 / 职务', placeholder: '公司名称与职务', required: false },
      email:   { label: '电子邮箱', placeholder: 'name@example.com', required: true },
      phone:   { label: '联系电话', placeholder: '+65 ', required: false },
      topic:   { label: '咨询主题', placeholder: '', required: false, options: ['入会咨询', '商务合作', '活动参与', '媒体联络', '其他'] },
      message: { label: '留言内容', placeholder: '请简要描述您的需求', required: true },
    },
  },
};

// ---- events seed (the single card currently on events.html; featured so it also shows on the homepage) ----
window.IE100_EVENTS_SEED = [
  { category: 'launch', title: '巅峰启幕 · 聚力环球', status: 'past', location: '新加坡', date_label: '2026年9月18日', summary: 'IE100 CLUB国际企业家100俱乐部新加坡盛大启航——狮城聚贤，盛启新章！海内外华人企业家、新锐创始人、企业家二代代表齐聚现场，共同见证这一跨国精英商业平台的正式诞生。', image_url: 'Event%20Photos/开幕典礼/DSC_1254-web.jpg', detail_url: 'event-2026-singapore-launch.html', featured: true, sort_order: 1, published: true },
];
