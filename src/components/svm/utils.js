export function drawBubble(ctx, x, y, w, h, radius) {
  let r = x + w;
  let b = y + h;
  ctx.beginPath();
  ctx.strokeStyle="black";
  ctx.lineWidth="2";
  ctx.moveTo(x+radius, y);
  ctx.lineTo(x+radius/2, y-10);
  ctx.lineTo(x+radius * 2, y);
  ctx.lineTo(r-radius, y);
  ctx.quadraticCurveTo(r, y, r, y+radius);
  ctx.lineTo(r, y+h-radius);
  ctx.quadraticCurveTo(r, b, r-radius, b);
  ctx.lineTo(x+radius, b);
  ctx.quadraticCurveTo(x, b, x, b-radius);
  ctx.lineTo(x, y+radius);
  ctx.quadraticCurveTo(x, y, x+radius, y);
  ctx.stroke();
}

export function drawRect(ctx, x, y, w, h){
  ctx.beginPath();
  ctx.rect(x,y,w,h);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

export function drawCircle(ctx, x, y, r){
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, true); 
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

//uniform distribution integer
export function randi(s, e) {
  return Math.floor(Math.random()*(e-s) + s);
}

//uniform distribution
export function randf(s, e) {
  return Math.random()*(e-s) + s;
}

//normal distribution random number
export function randn(mean, letiance) {
  let V1, V2, S;
  do {
    let U1 = Math.random();
    let U2 = Math.random();
    V1 = 2 * U1 - 1;
    V2 = 2 * U2 - 1;
    S = V1 * V1 + V2 * V2;
  } while (S > 1);
  let X = Math.sqrt(-2 * Math.log(S) / S) * V1;
  X = mean + Math.sqrt(letiance) * X;
  return X;
}