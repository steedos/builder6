export function Logo(props: React.ComponentPropsWithoutRef<any>) {
  return (
    <div className="group flex flex-row justify-center items-center">
      <img className={`${props.className}`} src="/logo.svg"/>
      <span className="font-bold text-xl pl-2 ">灵犀</span>
    </div>
  )
}
