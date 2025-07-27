import { useEffect, useState } from "react";

type QyutType = {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  rotation: number;
  collisionCount: number;
};

const BouncingQyuts = () => {
  const [qyuts, setQyuts] = useState<QyutType[]>([]);
  const [nextId, setNextId] = useState(1);
  const size = 80;
  const speed = 10;

  const handleClick = (e: React.MouseEvent) => {
    const newQyut: QyutType = {
      id: nextId,
      x: e.clientX - size / 2,
      y: window.innerHeight - e.clientY - size / 2,
      dx: Math.random() < 0.5 ? 1 : -1,
      dy: Math.random() < 0.5 ? 1 : -1,
      rotation: 0,
      collisionCount: 0,
    };
    setNextId(id => id + 1);
    setQyuts(prev => [...prev, newQyut]);
  };

  const isColliding = (a: QyutType, b: QyutType) => {
    return (
      Math.abs(a.x - b.x) < size &&
      Math.abs(a.y - b.y) < size
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setQyuts(prev => {
        let updated = [...prev];

        updated = updated.map(q => {
          let newX = q.x + q.dx * speed;
          let newY = q.y + q.dy * speed;
          let newDx = q.dx;
          let newDy = q.dy;

          if (newX < 0 || newX > window.innerWidth - size) {
            newDx = -newDx;
            newX = Math.max(0, Math.min(newX, window.innerWidth - size));
          }

          if (newY < 0 || newY > window.innerHeight - size) {
            newDy = -newDy;
            newY = Math.max(0, Math.min(newY, window.innerHeight - size));
          }

          return {
            ...q,
            x: newX,
            y: newY,
            dx: newDx,
            dy: newDy,
            rotation: q.rotation + 15,
          };
        });

        const collisionMap: Record<number, number> = {};

        for (let i = 0; i < updated.length; i++) {
          for (let j = i + 1; j < updated.length; j++) {
            const a = updated[i];
            const b = updated[j];

            if (isColliding(a, b)) {
              updated[i].dx *= -1;
              updated[i].dy *= -1;
              updated[j].dx *= -1;
              updated[j].dy *= -1;

              collisionMap[a.id] = (collisionMap[a.id] || a.collisionCount) + 1;
              collisionMap[b.id] = (collisionMap[b.id] || b.collisionCount) + 1;
            }
          }
        }

        updated = updated.map(q => ({
          ...q,
          collisionCount: collisionMap[q.id] ?? q.collisionCount,
        }));

        return updated.filter(q => q.collisionCount < 15);
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div onClick={handleClick} className="w-full h-screen relative overflow-hidden cursor-pointer">
      {qyuts.map(q => (
        <div
          key={q.id}
          className="fixed w-20 h-20 rounded-full"
          style={{
            transform: `rotate(${q.rotation}deg)`,
            left: `${q.x}px`,
            bottom: `${q.y}px`,
          }}
        >
          <div className={`absolute ${q.collisionCount < 14?'top-0':'-top-10'} left-1/2 -translate-x-1/2 bg-black w-3.5 h-7 rounded-xl`}></div>
          <div className={`absolute ${q.collisionCount < 14?'left-0':'-left-10'} top-1/2 -translate-y-1/2 bg-black w-7 h-3.5 rounded-xl`}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black w-3.5 h-3.5"></div>
          <div className={`absolute ${q.collisionCount < 14?'bottom-0':'-bottom-10'} left-1/2 -translate-x-1/2 bg-black w-3.5 h-7 rounded-xl`}></div>
          <div className={`absolute ${q.collisionCount < 14?'right-0':'-right-10'} top-1/2 -translate-y-1/2 bg-black w-7 h-3.5 rounded-xl`}></div>
        </div>
      ))}
      {qyuts.length == 0 && 
        <div className="fixed top-1/2 left-1/2 -translate-1/2 w-[90%] h-[90%] rounded-2xl border-4 border-dashed flex flex-col gap-5 items-center justify-center">
            <div className="md:text-6xl text-4xl font-serif font-bold text-gray-800">Click To Start</div>
            <div className="relative w-20 h-20 rounded-full animate-spin">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-black w-3.5 h-7 rounded-xl"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-black w-7 h-3.5 rounded-xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black w-3.5 h-3.5"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black w-3.5 h-7 rounded-xl"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-black w-7 h-3.5 rounded-xl"></div>
            </div>
        </div>
      }
    </div>
  );
};

export default BouncingQyuts;
