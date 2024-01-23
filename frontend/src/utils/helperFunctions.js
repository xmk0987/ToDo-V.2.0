


export const formattedDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString();
    
    return `${day}.${month}.${year}`;
};
  



export const makeLinksClickable = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => (
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    ));
};