

export default function Home({ params }: { params: { slug: string } })  {
    return (
      <>          
        Chatbots Page {params.slug}
      </>
    )
  }
  