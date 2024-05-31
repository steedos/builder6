export default function Customers () {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-32">
      <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">深受客户信赖</h2>
      <div className="mx-auto mt-10 grid  place-content-center max-w-lg grid-cols-1 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-1 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-1">
        <img
          className="mx-auto max-w-full md:max-w-3xl object-contain lg:col-span-1"
          src="/img/customers.png"
          alt="Transistor"
        />
      </div>
    </div>
  )
}