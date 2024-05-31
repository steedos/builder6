
import Icon from '@/components/Icon'
import { ArrowTrendingUpIcon, CurrencyYenIcon, CalculatorIcon, ChartBarIcon, BuildingOfficeIcon, ArrowPathIcon, CloudArrowUpIcon, LockClosedIcon, DocumentMagnifyingGlassIcon, PuzzlePieceIcon, AdjustmentsHorizontalIcon, InboxArrowDownIcon} from '@heroicons/react/20/solid'


const features = [
  {
    name: 'AI Chat',
    description:
      '灵犀内置了先进的智能助手，能够与用户进行自然、流畅的对话，提供智能化的交互体验。',
    href: 'https://chat.builder6.com',
    target: '_blank',
    icon: ArrowTrendingUpIcon,
    slds: "live_chat"
  },
  {
    name: '智能翻译',
    description:
      '自动检测用户输入的语言，并自动翻译成中文或英文，支持翻译整片文章。',
    href: '/app/translate',
    icon: CurrencyYenIcon,
    slds: "orders",
  },
  {
    name: '管理控制台',
    description:
      '“灵犀”云端自动化开发工具管理后台，只需点击鼠标，即可在线设计人工智能应用程序。',
    href: 'https://automation.steedos.cn/zh',
    target: '_blank',
    icon: CurrencyYenIcon,
    slds: "settings",
  },
]


export default function Home() {
  return (
    <>          
      <main className="max-w-6xl mx-auto pb-20">
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-8 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <a href={feature.href} target={feature.target?'_blank':'_self'}>
                <div key={feature.name} className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow border border-slate-300 hover:border-sky-600">
                  <div className="flex flex-1 flex-col p-8">
                    <div className="mx-auto">
                      <Icon name={feature.slds} className="slds-icon_large"></Icon>
                    </div>
                    <h3 className="my-3 text-lg font-medium text-gray-900">{feature.name}</h3>
                    <dl className="mt-1 flex flex-grow flex-col justify-between">
                      <dt className="sr-only">Title</dt>
                      <dd className=" text-slate-800 h-20">{feature.description}</dd>
                    </dl>
                  </div>
                </div>
              </a>
            ))}
          </dl>
        </div>

        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </main>
    </>
  )
}
