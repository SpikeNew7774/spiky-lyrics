export function darkenColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);
  
    R = Math.floor(R   
   * (1 - percent / 100));
    G = Math.floor(G * (1 - percent / 100));
    B = Math.floor(B * (1 - percent / 100));
  
    return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
}