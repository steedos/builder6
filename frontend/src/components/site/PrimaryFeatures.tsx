import { ArrowTrendingUpIcon, CurrencyYenIcon, CalculatorIcon, ChartBarIcon, BuildingOfficeIcon, ArrowPathIcon, CloudArrowUpIcon, LockClosedIcon, DocumentMagnifyingGlassIcon, PuzzlePieceIcon, AdjustmentsHorizontalIcon, InboxArrowDownIcon} from '@heroicons/react/20/solid'
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'

import ReactMarkdown from 'react-markdown';
import Icon from './Icon'

const features = [
  {
    name: '智能客服',
    description: `
- 基于公司产品和知识库，ChatGPT驱动智能客服机器人，精准理解客户需求，提供即时、个性化的咨询服务。 
- 无缝嵌入公司官网或微信公众号，打造全天候服务窗口，提升客户满意度。
`,
    href: 'https://chat.builder6.com',
    icon: ArrowTrendingUpIcon,
    slds: "service_request"
  },
  {
    name: '智能表单',
    description:`
- 在线构建客户咨询表单，ChatGPT自动完善客户信息，并进行评级分析，精准识别客户需求。
- 实时发送短信通知相关人员，并将信息同步至CRM系统，实现客户信息高效流转。
    `,
    icon: PuzzlePieceIcon,
    slds: "survey",
  },
  {
    name: '智能数据分析',
    description:`
- ChatGPT接入公司业务数据，进行深度分析和预测，洞察市场趋势，挖掘潜在商机。
- 生成可视化数据报告，为企业决策提供数据支撑，助力业务增长。
    `,
    icon: PuzzlePieceIcon,
    slds: "agent_session",
  },
  {
    name: '智能舆情风控',
    description:`
- ChatGPT实时监控互联网新闻，精准分析舆情风险级别，将负面影响扼杀在摇篮。
- 自动生成舆情报告，并推送给相关负责人，助力企业及时应对，维护品牌声誉。
    `,
    icon: PuzzlePieceIcon,
    slds: "news",
  },
  {
    name: '智能会议助手',
    description:`
- 自动记录会议内容，并利用ChatGPT生成简洁、准确的会议纪要和摘要。
- 与企业文档管理系统无缝衔接，方便会议资料存储和查阅，提高工作效率。
    `,
    icon: PuzzlePieceIcon,
    slds: "team_member",
  },
  {
    name: '智能合同审查',
    description:`
- ChatGPT结合公司规章制度，化身智能合同审查员，自动识别风险条款，提供修改建议。
- 与现有合同管理系统深度整合，实现合同审查流程自动化。
    `,
    icon: PuzzlePieceIcon,
    slds: "contract",
  },
  // {
  //   name: 'AI 自动化流程',
  //   description:
  //     `通过灵犀，提供直观易用的界面，让您轻松实现AI技术与各种业务系统的无缝连接。不再需要繁琐的代码编写，一切操作尽在掌握。`,
  //   // href: '/spend-management',
  //   icon: CurrencyYenIcon,
  //   slds: "orders",
  // },
]

export default function Example() {
  return (
    <div className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          {/* <h2 className="text-base font-semibold leading-7 text-indigo-400">费控王</h2> */}
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          灵犀 人工智能解决方案
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-700">
          灵犀专注于帮助客户实现人工智能技术与业务系统之间的高效连接。无论您是小型初创企业还是大型企业，灵犀都将成为您数字化转型的得力助手。

          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-8 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow border border-slate-300 hover:border-sky-600">
                <div className="flex flex-1 flex-col p-8 pb-4 pl-4">
                  <div className="mx-auto">
                    <Icon name={feature.slds} className="slds-icon_large"></Icon>
                  </div>
                  <h3 className="mt-3 text-lg font-medium text-gray-900">{feature.name}</h3>
                  <dl className="flex flex-grow flex-col justify-between">
                    <dt className="sr-only">Title</dt>
                    <dd className="leading-6 text-left text-slate-800 markdown">
                      <ReactMarkdown>{feature.description}</ReactMarkdown>
                    </dd>
                  </dl>
                  {feature.href &&(
                    <a href={feature.href} className="pt-4 leading-6 text-sky-600">访问应用</a>
                  )}
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
