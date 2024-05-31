

export default function Home({ params }: { params: { slug: string } })  {
    return (
      <>          
        Interfaces Page {params.slug}
      </>
    )
  }
  