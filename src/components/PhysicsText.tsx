"use client";

import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const LETTERS = ["T", "A", "N", "T", "R", "A", "F", "I", "E", "S", "T", "A"];

interface PhysicsTextProps {
  startTrigger?: boolean;
}

export function PhysicsText({ startTrigger = true }: PhysicsTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!startTrigger || !containerRef.current || hasStarted.current) return;
    hasStarted.current = true;

    const Engine = Matter.Engine,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

    const timeoutId = setTimeout(() => {
      const engine = Engine.create();
      engineRef.current = engine;

      const container = containerRef.current;
      if (!container) return;
      
      const footerContainer = container.closest(".footer-bounds") as HTMLElement || document.body;
      const footerRect = footerContainer.getBoundingClientRect();

      const letterEls = Array.from(container.querySelectorAll(".physics-letter")) as HTMLImageElement[];
      
      const letterBodies: { body: Matter.Body; el: HTMLImageElement; w: number; h: number }[] = [];

      const initialPositions = letterEls.map(el => {
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left - footerRect.left + rect.width / 2,
          y: rect.top - footerRect.top + rect.height / 2,
          w: rect.width,
          h: rect.height
        };
      });

      letterEls.forEach((el, i) => {
        const pos = initialPositions[i];
        const clone = el.cloneNode(true) as HTMLImageElement;
        clone.style.position = "absolute";
        clone.style.left = "0px";
        clone.style.top = "0px";
        clone.style.transform = `translate(${pos.x - pos.w / 2}px, ${pos.y - pos.h / 2}px)`;
        clone.style.zIndex = "10";
        
        el.style.opacity = "0";
        
        footerContainer.appendChild(clone);

        const w = pos.w || (window.innerWidth < 768 ? 32 : 48);
        const h = pos.h || (window.innerWidth < 768 ? 32 : 48);

        const body = Bodies.rectangle(pos.x, pos.y, w * 0.8, h * 0.8, {
          restitution: 0.6,
          friction: 0.1,
          density: 0.05,
        });

        Matter.Body.applyForce(body, body.position, {
          x: (Math.random() - 0.5) * 0.05,
          y: -Math.random() * 0.05
        });
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);

        Composite.add(engine.world, body);
        letterBodies.push({ body, el: clone, w, h });
      });

      const width = footerRect.width;
      const height = footerRect.height;
      
      const ground = Bodies.rectangle(width / 2, height + 50, width * 2, 100, { isStatic: true });
      const leftWall = Bodies.rectangle(-50, height / 2, 100, height * 2, { isStatic: true });
      const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height * 2, { isStatic: true });
      
      // Invisible physical ramps to match the yellow SVG corner cutouts so letters slide into the center
      const leftChamfer = Bodies.rectangle(0, height, 300, 150, { isStatic: true, angle: Math.PI / 5 });
      const rightChamfer = Bodies.rectangle(width, height, 300, 150, { isStatic: true, angle: -Math.PI / 5 });

      const statics = [ground, leftWall, rightWall, leftChamfer, rightChamfer];

      // Character mascot physical boundaries
      const charImage = footerContainer.querySelector('img[src*="distorted_gurl"]');
      if (charImage) {
        const charRect = charImage.getBoundingClientRect();
        const cx = charRect.left - footerRect.left + charRect.width / 2;
        const cy = charRect.top - footerRect.top + charRect.height / 2;
        
        // Head (approximate circle)
        const head = Bodies.circle(cx, cy - charRect.height * 0.2, charRect.width * 0.25, { isStatic: true });
        
        // Body (shoulders and torso - trapezoid narrower at top, wider at bottom)
        const torso = Bodies.trapezoid(cx, cy + charRect.height * 0.15, charRect.width * 0.7, charRect.height * 0.6, 0.4, { isStatic: true });
        
        statics.push(head, torso);
      }

      Composite.add(engine.world, statics);

      const runner = Runner.create();
      runnerRef.current = runner;
      Runner.run(runner, engine);

      let animationFrame: number;
      const update = () => {
        letterBodies.forEach(({ body, el, w, h }) => {
          el.style.transform = `translate(${body.position.x - w / 2}px, ${
            body.position.y - h / 2
          }px) rotate(${body.angle}rad)`;
        });
        animationFrame = requestAnimationFrame(update);
      };
      update();

      // Store a cleanup callback on the engineRef itself to avoid weird scope issues
      (engine as any).cleanup = () => {
        cancelAnimationFrame(animationFrame);
        Runner.stop(runner);
        Engine.clear(engine);
        letterBodies.forEach(({ el }) => {
          if (el.parentNode) el.parentNode.removeChild(el);
        });
      };
    }, 400);

    return () => {
      clearTimeout(timeoutId);
      if (engineRef.current) {
        const engine = engineRef.current as any;
        if (engine.cleanup) engine.cleanup();
      }
    };
  }, [startTrigger]);

  return (
    <div ref={containerRef} className="flex flex-wrap gap-1 md:gap-2">
      {LETTERS.map((char, idx) => (
        <img
          key={idx}
          src={`/assets/tf_letters/${char}.png`}
          alt={char}
          className="physics-letter w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 object-contain"
          style={{ width: '48px', height: '48px' }}
        />
      ))}
    </div>
  );
}
