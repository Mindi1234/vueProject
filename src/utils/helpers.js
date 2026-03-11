export function shortText(text) {
    if (!text) return "No description";
    return text.length > 60 ? text.slice(0, 60) + "..." : text;
  }
  
  export function formatDate(date) {
    if (!date) return "Today";
  
    const d = new Date(date);
    return d.toLocaleDateString("en-GB");
  }
  
  export function getInitial(name) {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  }