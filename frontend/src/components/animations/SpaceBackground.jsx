import { useEffect, useRef } from 'react';

export default function SpaceBackground() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w, h;
    let animationFrameId;
    let shootingStars = [];
    let stars = [];
    let nebulae = [];

    // ---------- helpers ----------
    const random = (min, max) => Math.random() * (max - min) + min;
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // Nebula class
    class Nebula {
      constructor() {
        this.x = random(-w * 0.5, w * 1.5);
        this.y = random(-h * 0.5, h * 1.5);
        this.radius = random(150, 500);
        this.alpha = random(0.015, 0.04);
        this.color = Math.random() > 0.5 ? '148,85,247' : '34,211,238'; // purple or cyan
        this.speedX = random(-0.02, 0.02);
        this.speedY = random(-0.02, 0.02);
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < -this.radius) this.x = w + this.radius;
        if (this.x > w + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = h + this.radius;
        if (this.y > h + this.radius) this.y = -this.radius;
      }
      draw(ctx) {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, `rgba(${this.color},${this.alpha})`);
        gradient.addColorStop(0.5, `rgba(${this.color},${this.alpha * 0.5})`);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Star class with depth
    class Star {
      constructor(layer = 0) {
        this.x = random(0, w);
        this.y = random(0, h);
        this.radius = layer === 0 ? random(0.3, 1.2) : layer === 1 ? random(0.8, 2.2) : random(1.5, 3.2);
        this.brightness = random(0.3, 1);
        this.twinkleSpeed = random(0.002, 0.01);
        this.twinkleOffset = random(0, Math.PI * 2);
        this.layer = layer; // 0: far, 1: mid, 2: near (also used for parallax strength)
        this.color = Math.random() > 0.7 ? '#e0d0ff' : '#ffffff';
      }
      update(mouseX, mouseY) {
        // parallax drift based on mouse position (convert to 0..1)
        const mx = (mouseX / w) - 0.5;
        const my = (mouseY / h) - 0.5;
        const factor = (this.layer + 1) * 8;
        this.x += mx * factor * 0.05;
        this.y += my * factor * 0.05;
        // wrap around
        if (this.x < -5) this.x = w + 5;
        if (this.x > w + 5) this.x = -5;
        if (this.y < -5) this.y = h + 5;
        if (this.y > h + 5) this.y = -5;
      }
      draw(ctx, time) {
        const twinkle = 0.5 + 0.5 * Math.sin(time * this.twinkleSpeed + this.twinkleOffset);
        const alpha = this.brightness * (0.6 + 0.4 * twinkle);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
        // glow for near stars
        if (this.layer === 2) {
          ctx.shadowColor = 'rgba(168,85,247,0.8)';
          ctx.shadowBlur = this.radius * 3;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }

    // Shooting star
    class ShootingStar {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = random(0, w * 0.8);
        this.y = random(0, h * 0.3);
        this.length = random(50, 150);
        this.speed = random(4, 8);
        this.angle = random(0.2, 0.5); // down-right angle
        this.opacity = 1;
        this.life = 1;
        this.decay = random(0.008, 0.02);
      }
      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.life -= this.decay;
        if (this.life <= 0 || this.x > w + 50 || this.y > h + 50) this.reset();
      }
      draw(ctx) {
        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;
        const gradient = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
        gradient.addColorStop(0, 'rgba(255,255,255,0)');
        gradient.addColorStop(1, `rgba(255,255,255,${this.life})`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
      }
    }

    // Resize handler
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      // Regenerate stars and nebulae on resize
      initStarsAndNebulae();
    };

    const initStarsAndNebulae = () => {
      stars = [];
      // far stars (layer 0)
      for (let i = 0; i < 600; i++) stars.push(new Star(0));
      // mid stars (layer 1)
      for (let i = 0; i < 250; i++) stars.push(new Star(1));
      // near stars (layer 2)
      for (let i = 0; i < 80; i++) stars.push(new Star(2));
      nebulae = [];
      for (let i = 0; i < 5; i++) nebulae.push(new Nebula());
    };

    // Mouse listener
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    // Shooting stars list
    shootingStars = [new ShootingStar(), new ShootingStar()];

    // Animation loop
    const animate = (time) => {
      ctx.clearRect(0, 0, w, h);

      // Draw background base
      const bgGradient = ctx.createLinearGradient(0, 0, 0, h);
      bgGradient.addColorStop(0, '#02001a');
      bgGradient.addColorStop(0.5, '#0b0420');
      bgGradient.addColorStop(1, '#02001a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, w, h);

      // Nebulae first
      nebulae.forEach(n => { n.update(); n.draw(ctx); });

      // Stars with parallax
      stars.forEach(star => star.update(mouse.current.x, mouse.current.y));
      stars.forEach(star => star.draw(ctx, time));

      // Shooting stars
      shootingStars.forEach(s => { s.update(); s.draw(ctx); });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
}
