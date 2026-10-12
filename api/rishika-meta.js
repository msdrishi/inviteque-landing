export default function handler(req, res) {
  const { variant } = req.query || {}
  const variantPath = variant ? `/${variant}` : ''
  const pageUrl = `https://inviteque.com/template/rajasthani-vows/rishika-and-jaskaran${variantPath}`
  const targetRedirect = `${pageUrl}?redirected=true`

  const title = "Rishika weds Major Jaskaran | Wedding Invitation"
  const description = "We cordially invite you to celebrate the wedding of Rishika & Major Jaskaran. Tap to view the interactive invitation."
  const imageUrl = "https://inviteque.com/assets/templates/rajestani-vows/whatsapp-preview.jpg"

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Open Graph / WhatsApp Preview Meta Tags -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:secure_url" content="${imageUrl}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${pageUrl}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">

  <script>
    window.location.replace("${targetRedirect}");
  </script>
</head>
<body style="font-family: serif; text-align: center; padding: 40px; background-color: #FAF6EE; color: #7A1228;">
  <h2>Rishika weds Major Jaskaran</h2>
  <p>Redirecting to your interactive wedding invitation card...</p>
</body>
</html>`

  res.setHeader('Content-Type', 'text/html; charset=UTF-8')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  return res.status(200).send(html)
}
