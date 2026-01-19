export const getShareLinks = (url: string, text: string) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    gmail: `https://mail.google.com/mail/?view=cm&su=${encodedText}&body=${encodedUrl}`,
  };
};
