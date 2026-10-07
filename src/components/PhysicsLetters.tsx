"use client";

import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import Image from "next/image";

const LETTERS = ["T", "A", "N", "T", "R", "A", "F", "I", "E", "S", "T", "A"];

interface PhysicsLettersProps {
  startTrigger?: boolean;
}

export function PhysicsLetters({ startTrigger = true }: PhysicsLettersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  useEffect(() => {
    if (!startTrigger || !containerRef.current) return;

    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

    const engine = Engine.create();
    engineRef.current = engine;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Floor and walls
    const ground = Bodies.rectangle(width / 2, height + 50, width * 2, 100, {
      isStatic: true,
      friction: 0.8,
      restitution: 0.2,
    });
    
    // Slanted side walls to keep them from piling up perfectly flat and falling out
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height * 2, { isStatic: true });
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height * 2, { isStatic: true });

    Composite.add(engine.world, [ground, leftWall, rightWall]);

    // Letter bodies
    const letterBodies: { body: Matter.Body; el: HTMLImageElement }[] = [];

    // The letter images are roughly 40px - 60px wide based on screen size
    const isMobile = window.innerWidth < 768;
    const letterWidth = isMobile ? 32 : 48;
    const letterHeight = isMobile ? 32 : 48;

    // Spawn them side by side like text
    const totalWidth = LETTERS.length * letterWidth;
    const startX = width / 2 - totalWidth / 2;
    const startY = -100; // Drop from slightly above the container

    LETTERS.forEach((char, i) => {
      const el = document.createElement("img");
      el.src = `/assets/tf_letters/${char}.png`;
      el.className = `absolute w-[${letterWidth}px] h-[${letterHeight}px] object-contain z-[100] drop-shadow-xl`;
      
      // Let them be interactive for CSS hover (doesn't affect physics, but looks cool)
      el.style.transition = "filter 0.2s";
      el.onmouseenter = () => el.style.filter = "brightness(1.5)";
      el.onmouseleave = () => el.style.filter = "brightness(1)";

      container.appendChild(el);

      const x = startX + i * letterWidth + (Math.random() * 10 - 5);
      const y = startY - Math.random() * 50 - i * 20;

      // Create a slightly smaller collision box than the visual bounds to let them overlap nicely
      const body = Bodies.rectangle(x, y, letterWidth * 0.8, letterHeight * 0.8, {
        restitution: 0.5,
        friction: 0.1,
        density: 0.05,
      });

      // Add a slight initial spin and varying speed
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);

      Composite.add(engine.world, body);
      letterBodies.push({ body, el });
    });

    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Animation Loop
    let animationFrame: number;
    const update = () => {
      letterBodies.forEach(({ body, el }) => {
        el.style.transform = `translate(${body.position.x - letterWidth / 2}px, ${
          body.position.y - letterHeight / 2
        }px) rotate(${body.angle}rad)`;
      });
      animationFrame = requestAnimationFrame(update);
    };
    update();

    // Handle Resize
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      Matter.Body.setPosition(ground, { x: newWidth / 2, y: newHeight + 50 });
      Matter.Body.setPosition(rightWall, { x: newWidth + 50, y: newHeight / 2 });
      Matter.Body.setPosition(leftWall, { x: -50, y: newHeight / 2 });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrame);
      if (runnerRef.current) Runner.stop(runnerRef.current);
      Engine.clear(engine);
      container.innerHTML = "";
    };
  }, [startTrigger]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-visible"
    >
      {/* Container is pointer-events-none so it doesn't block the footer links */}
    </div>
  );
}
