// function handling the scroll to top...

export function handleScrollToTop(windowScreen:Window) {
    const scrollableElement = document.getElementById('main-scrollable');
    if (scrollableElement) scrollableElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    
}
