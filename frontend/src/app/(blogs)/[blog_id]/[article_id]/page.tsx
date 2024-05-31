

export default function Home({ params }: { params: { slug: string } })  {
    return (
      <>          
        Blog Page {params.slug}
      </>
    )
  }
  