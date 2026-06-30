// function handling the scroll to top...

export function handleScrollToTop(elementid:string) {
  const scrollableElement = document.getElementById(elementid);
  if (scrollableElement) scrollableElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
}

export function scrollToBottom(elementid:string) {
  const scrollableElement = document.getElementById(elementid) ;
  if (scrollableElement) scrollableElement.scrollTo({ top: scrollableElement.scrollHeight,left: 0,behavior: "smooth" });
  
}

