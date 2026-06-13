export class FloorEngine {
  drawRoom(ctx: CanvasRenderingContext2D, room: any) {
    ctx.beginPath();

    room.walls.forEach((wall: any) => {
      ctx.lineTo(wall.x, wall.y);
    });

    ctx.closePath();
    ctx.stroke();
  }

  drawDevices(ctx: CanvasRenderingContext2D, devices: any[]) {
    devices.forEach((d) => {
      ctx.fillStyle = d.state ? 'yellow' : 'gray';

      ctx.beginPath();
      ctx.arc(d.x, d.y, 8, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}
