addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const apiUrl = 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN'
  const url = new URL(request.url)
  const resParam = url.searchParams.get('res') || 'uhd'

  try {

    const response = await fetch(apiUrl)
    const data = await response.json()
    
    // Check
    const image = data.images[0]
    if (!image) throw new Error('No image found')
    if (!image.urlbase) throw new Error('Missing image base URL')

    let suffix
    switch (resParam.toLowerCase()) {
      case 'uhd':
        suffix = '_UHD.jpg'       // 超高清 3840x2160
        break
      case 'm':
        suffix = '_1080x1920.jpg' // 手机竖版 1080x1920
        break
      default:
        // 自定义分辨率格式 (1920x1080)
        if (/^\d+x\d+$/.test(resParam)) {
          suffix = `_${resParam}.jpg`
        } else {
          throw new Error(`ILOVESCRATCH API ERROR: UNKNOWN RESOLUTION ${resParam}`)
        }
    }

    const imageUrl = `https://cn.bing.com${image.urlbase}${suffix}`
    

    if (!isValidUrl(imageUrl)) throw new Error('ILOVESCRATCH API ERROR(INTERNAL): INVALID URL GENERATED.    IF YOU BELIEVE THIS IS A MISTAKE, CONTACT ILOVESCRATCH@FOXMAIL.com')


    return Response.redirect(imageUrl, 302)

  } catch (error) {
    return new Response(error.message, {
      status: error.message.startsWith('ILOVESCRATCH API ERROR:') ? 400 : 500,
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
