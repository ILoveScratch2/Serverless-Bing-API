addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const apiUrl = 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN'
  
  try {
      const response = await fetch(apiUrl)
      const data = await response.json()
      

      const image = data.images[0]
      if (!image) throw new Error('No image found')
      

      const uhdUrl = `https://cn.bing.com${image.urlbase}_UHD.jpg`
      

      if (!isValidUrl(uhdUrl)) throw new Error('Invalid URL')
      

      return Response.redirect(uhdUrl, 302)
      
  } catch (error) {
      return new Response(`Error: ${error.message}`, {
          status: 500,
          headers: { 'Content-Type': 'text/plain' }
      })
  }
}

function isValidUrl(string) {
  try {
      new URL(string)
      return true
  } catch (_) {
      return false
  }
}
