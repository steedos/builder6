

export default function Home({ params }: { params: { slug: string } })  {
    return (
      <>          
        Interfaces Page {params.interface_id} / {params.page_id}
      </>
    )
  }
  