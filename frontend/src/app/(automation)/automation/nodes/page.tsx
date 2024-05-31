

export default function Home({ params }: { params: { slug: string } })  {
    return (
      <>          
        Node Page {params.slug}
      </>
    )
  }
  