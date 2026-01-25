
// Reveal animation
const reveals=document.querySelectorAll('.reveal');
function reveal(){
  reveals.forEach(el=>{
    if(el.getBoundingClientRect().top < window.innerHeight-120){
      el.classList.add('active');
    }
  })
}
window.addEventListener('scroll',reveal);
reveal();

// Neural network background animation
const canvas=document.getElementById('bg');
const ctx=canvas.getContext('2d');

function resize(){canvas.width=innerWidth;canvas.height=innerHeight}
window.addEventListener('resize',resize);resize();

let nodes=[];
const NODE_COUNT=90;
const MAX_DIST=160;

for(let i=0;i<NODE_COUNT;i++){
  nodes.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    z:Math.random()*1+0.3, // depth layer
    vx:(Math.random()-.5)*0.6,
    vy:(Math.random()-.5)*0.6
  })
}

let mouse={x:null,y:null};
window.addEventListener('mousemove',e=>{
  mouse.x=e.clientX;
  mouse.y=e.clientY;
})

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  nodes.forEach(n=>{
    n.x+=n.vx*n.z; 
    n.y+=n.vy*n.z;

    if(n.x<0||n.x>canvas.width) n.vx*=-1;
    if(n.y<0||n.y>canvas.height) n.vy*=-1;

    if(mouse.x){
      n.x+=(mouse.x-canvas.width/2)*0.00003*n.z;
      n.y+=(mouse.y-canvas.height/2)*0.00003*n.z;
    }
  });

  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      const dx=nodes[i].x-nodes[j].x;
      const dy=nodes[i].y-nodes[j].y;
      const dist=Math.sqrt(dx*dx+dy*dy);

      if(dist<MAX_DIST){
        const alpha=(1-dist/MAX_DIST)*Math.min(nodes[i].z,nodes[j].z);
        ctx.strokeStyle=`rgba(56,189,248,${alpha})`;
        ctx.lineWidth=nodes[i].z;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x,nodes[i].y);
        ctx.lineTo(nodes[j].x,nodes[j].y);
        ctx.stroke();
      }
    }
  }

  nodes.forEach(n=>{
    ctx.fillStyle=`rgba(167,139,250,${n.z})`;
    ctx.beginPath();
    ctx.arc(n.x,n.y,2.5*n.z,0,Math.PI*2);
    ctx.fill();
  });

  requestAnimationFrame(draw);
}

draw();
