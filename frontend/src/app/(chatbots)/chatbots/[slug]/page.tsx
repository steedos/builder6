

export default function Home({ params }: { params: { slug: string } })  {
    return (
      <>          
        Table Page {params.slug}
      </>
    )
  }
  