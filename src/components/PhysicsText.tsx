"use client";

import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

const LETTERS = ["T", "A", "N", "T", "R", "A", "F", "I", "E", "S", "T", "A"];

interface PhysicsTextProps {
  startTrigger?: boolean;
}

// Extended type to attach a cleanup callback without using `any`
interface EngineWithCleanup extends Matter.Engine {
  cleanup?: () => void;
}

// Normalized vertices for the robot mascot silhouette (0.0 to 1.0 relative to mascot rendered box)
// Head & Visor: 10-vertex convex polygon matching the tilted CRT visor, top peak, ear hardware, and jawline
const MASCOT_HEAD_NORM = [
  { x: 0.61, y: 0.00 }, // Antenna / helmet top peak
  { x: 0.85, y: 0.16 }, // Top right machinery
  { x: 0.99, y: 0.29 }, // Right ear / hardware edge
  { x: 0.96, y: 0.48 }, // Lower right head / neck joint
  { x: 0.35, y: 0.53 }, // Chin / lower jaw base
  { x: 0.10, y: 0.48 }, // Jaw left edge
  { x: 0.03, y: 0.29 }, // Bottom-left visor corner
  { x: 0.13, y: 0.20 }, // Visor left side
  { x: 0.27, y: 0.10 }, // Visor top-left slope
  { x: 0.42, y: 0.05 }, // Visor top transition to peak
];

// Torso & Shoulders: 5-vertex convex polygon matching collar, left shoulder slope, right shoulder, and bottom baseline
const MASCOT_TORSO_NORM = [
  { x: 0.28, y: 0.52 }, // Left collar transition
  { x: 0.96, y: 0.52 }, // Right collar / cable entry
  { x: 1.00, y: 1.00 }, // Right shoulder bottom
  { x: 0.00, y: 1.00 }, // Left shoulder bottom
  { x: 0.15, y: 0.70 }, // Left collar / shoulder flare
];

interface LetterItem {
  body: Matter.Body;
  el: HTMLImageElement;
  w: number;
  h: number;
  isDragging: boolean;
  pointerId: number | null;
  dragOffset: { x: number; y: number };
  pointerHistory: { x: number; y: number; time: number }[];
  downHandler: (e: PointerEvent) => void;
}

export function PhysicsText({ startTrigger = true }: PhysicsTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<EngineWithCleanup | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!startTrigger && !hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    if (window.innerWidth < 768) return; // Do not run physics on mobile viewports

    const Engine = Matter.Engine,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Vertices = Matter.Vertices;

    const engine = Engine.create() as EngineWithCleanup;
    engineRef.current = engine;

    const container = containerRef.current;
    if (!container) return;

    const footerContainer = (container.closest(".footer-bounds") as HTMLElement) || document.body;
    let footerRect = footerContainer.getBoundingClientRect();

    const letterEls = Array.from(container.querySelectorAll(".physics-letter")) as HTMLImageElement[];
    const letterBodies: LetterItem[] = [];
    const activeDrags = new Map<number, LetterItem>();

    const initialPositions = letterEls.map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left - footerRect.left + rect.width / 2,
        y: 0, // Drop from the top of the footer
        w: rect.width || 48,
        h: rect.height || 48,
      };
    });

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Build mascot colliders using exact normalized silhouette vertices
    const createMascotColliders = (fRect: DOMRect): Matter.Body[] => {
      const charImage = footerContainer.querySelector("img[data-mascot]") as HTMLImageElement | null;
      if (!charImage) return [];

      // Prefer outer untransformed container if available so 3D HoverTilt does not distort colliders
      const mascotBox =
        (charImage.closest('[style*="perspective"]') as HTMLElement) ||
        charImage.parentElement?.parentElement ||
        charImage;
      const mascotRect = mascotBox.getBoundingClientRect();

      const w = mascotRect.width || (window.innerWidth >= 1024 ? 400 : 350);
      const h = mascotRect.height || w * (1430 / 1100);

      // Relative origin inside footerContainer
      let originX = mascotRect.left - fRect.left;
      let originY = mascotRect.top - fRect.top;

      // Safe fallbacks if image layout is settling
      if (originX <= 0 || isNaN(originX)) {
        originX = (fRect.width - w) / 2;
      }
      if (originY <= 0 || isNaN(originY)) {
        originY = fRect.height - h;
      }

      // 1. Head & Visor (Convex 10-gon)
      const headVerts = MASCOT_HEAD_NORM.map((p) => ({
        x: originX + p.x * w,
        y: originY + p.y * h,
      }));
      const headCenter = Vertices.centre(headVerts);
      const headBody = Bodies.fromVertices(headCenter.x, headCenter.y, [headVerts], {
        isStatic: true,
        friction: 0.15,
        restitution: 0.5,
      });

      // 2. Torso & Shoulders (Convex 5-gon)
      const torsoVerts = MASCOT_TORSO_NORM.map((p) => ({
        x: originX + p.x * w,
        y: originY + p.y * h,
      }));
      const torsoCenter = Vertices.centre(torsoVerts);
      const torsoBody = Bodies.fromVertices(torsoCenter.x, torsoCenter.y, [torsoVerts], {
        isStatic: true,
        friction: 0.2,
        restitution: 0.4,
      });

      return [headBody, torsoBody];
    };

    // Build footer perimeter boundaries
    const createBoundaries = (fRect: DOMRect): Matter.Body[] => {
      const width = fRect.width;
      const height = fRect.height;
      const groundY = height - 35;

      const ground = Bodies.rectangle(width / 2, groundY + 100, width * 3, 200, {
        isStatic: true,
        friction: 0.3,
      });
      const ceiling = Bodies.rectangle(width / 2, -100, width * 3, 200, {
        isStatic: true,
      });
      const leftWall = Bodies.rectangle(-50, height / 2, 100, height * 3, {
        isStatic: true,
      });
      const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height * 3, {
        isStatic: true,
      });

      // Angled chamfers matching cyberpunk corner cutouts to funnel letters inward
      const leftChamfer = Bodies.rectangle(40, groundY, 260, 120, {
        isStatic: true,
        angle: Math.PI / 6,
      });
      const rightChamfer = Bodies.rectangle(width - 40, groundY, 260, 120, {
        isStatic: true,
        angle: -Math.PI / 6,
      });

      return [ground, ceiling, leftWall, rightWall, leftChamfer, rightChamfer];
    };

    let boundaryBodies = createBoundaries(footerRect);
    let mascotBodies = createMascotColliders(footerRect);
    Composite.add(engine.world, [...boundaryBodies, ...mascotBodies]);

    const runner = Runner.create();
    runnerRef.current = runner;

    // Simulation loop state
    let isRunning = false;
    let animationFrameId: number | null = null;

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        Runner.run(runner, engine);
      }
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    const stopLoop = () => {
      if (isRunning) {
        isRunning = false;
        Runner.stop(runner);
      }
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const tick = () => {
      animationFrameId = null;

      // Update non-dragged letter element transforms to match physics bodies
      for (let i = 0; i < letterBodies.length; i++) {
        const item = letterBodies[i];
        if (!item.isDragging) {
          item.el.style.transform = `translate(${item.body.position.x - item.w / 2}px, ${
            item.body.position.y - item.h / 2
          }px) rotate(${item.body.angle}rad)`;
        }
      }

      // Check if simulation needs to keep running
      const anyActive =
        activeDrags.size > 0 ||
        letterBodies.some(
          ({ body, isDragging }) =>
            isDragging || body.speed >= 0.2 || Math.abs(body.angularVelocity) >= 0.008
        );

      if (anyActive) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        stopLoop();
      }
    };

    // Pointer Drag Handlers
    const handlePointerDown = (e: PointerEvent, item: LetterItem) => {
      if (e.button !== 0) return; // Main button only
      e.preventDefault();

      item.isDragging = true;
      item.pointerId = e.pointerId;
      item.el.style.cursor = "grabbing";
      item.el.style.zIndex = "25";

      try {
        item.el.setPointerCapture(e.pointerId);
      } catch {}

      const currentFooterRect = footerContainer.getBoundingClientRect();
      const pointerX = e.clientX - currentFooterRect.left;
      const pointerY = e.clientY - currentFooterRect.top;

      item.dragOffset = {
        x: pointerX - item.body.position.x,
        y: pointerY - item.body.position.y,
      };

      item.pointerHistory = [{ x: pointerX, y: pointerY, time: performance.now() }];

      // Kinematic ownership during drag: isolate from free-fall simulation
      Matter.Body.setStatic(item.body, true);
      Matter.Body.setVelocity(item.body, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(item.body, 0);

      activeDrags.set(e.pointerId, item);
      startLoop();
    };

    const onWindowPointerMove = (e: PointerEvent) => {
      const item = activeDrags.get(e.pointerId);
      if (!item) return;
      e.preventDefault();

      const currentFooterRect = footerContainer.getBoundingClientRect();
      const pointerX = e.clientX - currentFooterRect.left;
      const pointerY = e.clientY - currentFooterRect.top;

      // Keep dragged letter securely within footer interior bounds
      const minX = item.w / 2 + 8;
      const maxX = currentFooterRect.width - item.w / 2 - 8;
      const minY = item.h / 2 + 8;
      const maxY = currentFooterRect.height - 35 - item.h / 2;

      const targetX = Math.max(minX, Math.min(maxX, pointerX - item.dragOffset.x));
      const targetY = Math.max(minY, Math.min(maxY, pointerY - item.dragOffset.y));

      Matter.Body.setPosition(item.body, { x: targetX, y: targetY });
      item.el.style.transform = `translate(${targetX - item.w / 2}px, ${
        targetY - item.h / 2
      }px) rotate(${item.body.angle}rad)`;

      const now = performance.now();
      item.pointerHistory.push({ x: targetX, y: targetY, time: now });
      while (item.pointerHistory.length > 1 && now - item.pointerHistory[0].time > 100) {
        item.pointerHistory.shift();
      }
    };

    const onWindowPointerUp = (e: PointerEvent) => {
      const item = activeDrags.get(e.pointerId);
      if (!item) return;
      e.preventDefault();

      if (item.el.hasPointerCapture(e.pointerId)) {
        try {
          item.el.releasePointerCapture(e.pointerId);
        } catch {}
      }

      activeDrags.delete(e.pointerId);
      item.isDragging = false;
      item.pointerId = null;
      item.el.style.cursor = "grab";
      item.el.style.zIndex = "20";

      // Restore dynamic physics
      Matter.Body.setStatic(item.body, false);

      // Compute release velocity safely from recent pointer history
      const history = item.pointerHistory;
      if (history.length >= 2) {
        const first = history[0];
        const last = history[history.length - 1];
        const dt = (last.time - first.time) / 1000;
        if (dt > 0.01) {
          const vx = (last.x - first.x) / (dt * 60);
          const vy = (last.y - first.y) / (dt * 60);
          const speed = Math.hypot(vx, vy);
          const maxSpeed = 16;
          const scale = speed > maxSpeed ? maxSpeed / speed : 1;
          Matter.Body.setVelocity(item.body, { x: vx * scale, y: vy * scale });
          Matter.Body.setAngularVelocity(item.body, vx * scale * 0.015);
        }
      }

      startLoop();
    };

    window.addEventListener("pointermove", onWindowPointerMove);
    window.addEventListener("pointerup", onWindowPointerUp);
    window.addEventListener("pointercancel", onWindowPointerUp);

    // Instantiate and spawn each letter
    letterEls.forEach((el, i) => {
      const pos = initialPositions[i];
      const clone = el.cloneNode(true) as HTMLImageElement;
      clone.style.position = "absolute";
      clone.style.left = "0px";
      clone.style.top = "0px";
      clone.style.transform = `translate(${pos.x - pos.w / 2}px, ${pos.y - pos.h / 2}px)`;
      clone.style.zIndex = "20";
      clone.style.opacity = "1";
      clone.style.pointerEvents = "auto";
      clone.style.touchAction = "none";
      clone.style.userSelect = "none";
      clone.style.cursor = "grab";
      clone.draggable = false;
      clone.setAttribute("aria-hidden", "true");
      clone.setAttribute("role", "presentation");

      el.style.opacity = "0";
      footerContainer.appendChild(clone);

      const w = pos.w || (window.innerWidth < 768 ? 32 : 48);
      const h = pos.h || (window.innerWidth < 768 ? 32 : 48);

      const body = Bodies.rectangle(pos.x, pos.y, w * 0.8, h * 0.8, {
        restitution: 0.55,
        friction: 0.12,
        density: 0.05,
      });

      if (prefersReducedMotion) {
        Matter.Body.applyForce(body, body.position, {
          x: (Math.random() - 0.5) * 0.005,
          y: 0,
        });
        Matter.Body.setAngularVelocity(body, 0);
      } else {
        Matter.Body.applyForce(body, body.position, {
          x: (Math.random() - 0.5) * 0.05,
          y: -Math.random() * 0.05,
        });
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);
      }

      Composite.add(engine.world, body);

      const letterItem: LetterItem = {
        body,
        el: clone,
        w,
        h,
        isDragging: false,
        pointerId: null,
        dragOffset: { x: 0, y: 0 },
        pointerHistory: [],
        downHandler: (ev) => handlePointerDown(ev, letterItem),
      };

      clone.addEventListener("pointerdown", letterItem.downHandler);
      clone.addEventListener("dragstart", (e) => e.preventDefault());

      letterBodies.push(letterItem);
    });

    // Handle viewport & container resizing gracefully without duplicate handlers
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const height = entry.contentRect.height;
        if (width === 0 || height === 0) continue;

        if (window.innerWidth < 768) {
          letterBodies.forEach(({ el }) => {
            el.style.display = "none";
          });
          stopLoop();
          continue;
        } else {
          letterBodies.forEach(({ el }) => {
            el.style.display = "block";
          });
        }

        footerRect = footerContainer.getBoundingClientRect();

        Composite.remove(engine.world, [...boundaryBodies, ...mascotBodies]);
        boundaryBodies = createBoundaries(footerRect);
        mascotBodies = createMascotColliders(footerRect);
        Composite.add(engine.world, [...boundaryBodies, ...mascotBodies]);

        const groundY = footerRect.height - 35;
        letterBodies.forEach(({ body, w, h }) => {
          const minX = w / 2 + 8;
          const maxX = footerRect.width - w / 2 - 8;
          const minY = h / 2 + 8;
          const maxY = groundY - h / 2;
          const clampedX = Math.max(minX, Math.min(maxX, body.position.x));
          const clampedY = Math.max(minY, Math.min(maxY, body.position.y));
          if (clampedX !== body.position.x || clampedY !== body.position.y) {
            Matter.Body.setPosition(body, { x: clampedX, y: clampedY });
          }
        });

        startLoop();
      }
    });

    resizeObserver.observe(footerContainer);

    // Cancel all drags if window loses focus
    const onBlur = () => {
      activeDrags.forEach((item, pId) => {
        onWindowPointerUp(new PointerEvent("pointercancel", { pointerId: pId }));
      });
    };
    window.addEventListener("blur", onBlur);

    // Kick off initial simulation
    startLoop();

    // Store cleanup callback on the engine instance
    engine.cleanup = () => {
      window.removeEventListener("pointermove", onWindowPointerMove);
      window.removeEventListener("pointerup", onWindowPointerUp);
      window.removeEventListener("pointercancel", onWindowPointerUp);
      window.removeEventListener("blur", onBlur);
      resizeObserver.disconnect();
      stopLoop();
      letterBodies.forEach((item) => {
        item.el.removeEventListener("pointerdown", item.downHandler);
        if (item.el.parentNode) {
          item.el.parentNode.removeChild(item.el);
        }
      });
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    };

    return () => {
      if (engineRef.current?.cleanup) {
        engineRef.current.cleanup();
      }
    };
  }, [startTrigger]);

  return (
    <div ref={containerRef} className="flex flex-wrap gap-1 md:gap-2">
      {LETTERS.map((char, idx) => (
        // eslint-disable-next-line @next/next/no-img-element
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
